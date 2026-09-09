// Worked-example engine. Given a lesson topic and a loaded stock's live data
// (quote + financials), it produces a step-by-step, numbers-in worked example so
// the learner can see the chapter applied to a real company from the app.
//
// Core topics get bespoke walkthroughs; everything else falls back to a
// category-appropriate set of live metrics with interpretation. All numbers are
// pulled from the same FMP/yfinance data the rest of FinSight uses.

import { formatNumber, formatCurrency, formatPercent } from '../utils/formatters'

const n = (v, d = 2) => (v == null ? '-' : formatNumber(v, d))
const cur = (v, big = false) => (v == null ? '-' : formatCurrency(v, 'USD', big))
const pctFrac = (v, d = 1) => (v == null ? '-' : formatPercent(v * 100, d, false)) // v is a fraction

function ctxFrom(data) {
  const quote = data?.quote || {}
  const fin = data?.fin || {}
  return {
    quote,
    km: fin.key_metrics_ttm || {},
    rt: fin.ratios_ttm || {},
    inc: (fin.income_statement || [])[0] || {},
    bal: (fin.balance_sheet || [])[0] || {},
    cf: (fin.cash_flow || [])[0] || {},
    sym: quote.symbol || data?.symbol || '',
  }
}

// ── Bespoke builders, keyed by topic id ──────────────────────────────────────
const BUILDERS = {
  // P/E, P/B, P/S
  fs102: (c) => {
    const pe = c.quote.pe_ratio ?? c.rt.priceToEarningsRatioTTM
    const ey = pe ? 1 / pe : null
    return {
      intro: `Applying the P/E lesson to ${c.sym}.`,
      rows: [
        ['Price', cur(c.quote.price)],
        ['EPS (TTM)', n(c.quote.eps)],
        ['P/E = Price ÷ EPS', pe ? `${n(pe, 1)}×` : '-'],
        ['Earnings yield = 1 ÷ P/E', ey ? pctFrac(ey) : '-'],
        ['P/B', c.rt.priceToBookRatioTTM ? `${n(c.rt.priceToBookRatioTTM, 1)}×` : '-'],
      ],
      steps: [
        `${c.sym} trades at ${cur(c.quote.price)} on EPS of ${n(c.quote.eps)}, so its P/E is ${pe ? n(pe, 1) + '×' : 'n/a'}.`,
        ey ? `Flipping the P/E gives an earnings yield of ${pctFrac(ey)} - compare that to bond yields and to peers.` : 'EPS is non-positive, so the P/E is not meaningful here.',
        `Ask whether the multiple is justified by growth and quality, or whether peak/​trough earnings are distorting it.`,
      ],
    }
  },
  // EPS & earnings quality
  fs103: (c) => {
    const ni = c.inc.netIncome, ocf = c.cf.operatingCashFlow
    const ratio = ni && ocf ? ocf / ni : null
    return {
      intro: `Checking ${c.sym}'s earnings quality.`,
      rows: [
        ['EPS (TTM)', n(c.quote.eps)],
        ['EPS (Fwd)', n(c.quote.eps_forward)],
        ['Net Income', cur(ni, true)],
        ['Operating Cash Flow', cur(ocf, true)],
        ['OCF ÷ Net Income', ratio ? `${n(ratio, 2)}×` : '-'],
      ],
      steps: [
        `${c.sym} reported net income of ${cur(ni, true)} and operating cash flow of ${cur(ocf, true)}.`,
        ratio ? `That is a cash-conversion ratio of ${n(ratio, 2)}× - above ~1.0× suggests profits are backed by real cash (good quality).` : 'Cash conversion could not be computed from the available data.',
        `Forward EPS of ${n(c.quote.eps_forward)} vs trailing ${n(c.quote.eps)} shows the market's growth expectation.`,
      ],
    }
  },
  // ROIC / ROE / ROA
  fs202: (c) => ({
    intro: `Capital efficiency for ${c.sym}.`,
    rows: [
      ['ROE', c.km.returnOnEquityTTM != null ? pctFrac(c.km.returnOnEquityTTM) : '-'],
      ['ROA', c.km.returnOnAssetsTTM != null ? pctFrac(c.km.returnOnAssetsTTM) : '-'],
      ['ROIC', c.km.returnOnInvestedCapitalTTM != null ? pctFrac(c.km.returnOnInvestedCapitalTTM) : '-'],
      ['Net Margin', c.rt.netProfitMarginTTM != null ? pctFrac(c.rt.netProfitMarginTTM) : '-'],
    ],
    steps: [
      `${c.sym} earns ROE of ${c.km.returnOnEquityTTM != null ? pctFrac(c.km.returnOnEquityTTM) : 'n/a'} and ROIC of ${c.km.returnOnInvestedCapitalTTM != null ? pctFrac(c.km.returnOnInvestedCapitalTTM) : 'n/a'}.`,
      `Value is created only when ROIC exceeds the WACC (often ~8–10%). Compare the ROIC above to that hurdle.`,
      `A high ROE built on margins and turnover is higher quality than one built on leverage - check debt/equity too.`,
    ],
  }),
  // Free cash flow
  fs203: (c) => {
    const fcf = c.cf.freeCashFlow, mc = c.quote.market_cap
    const yld = fcf && mc ? fcf / mc : (c.km.freeCashFlowYieldTTM ?? null)
    return {
      intro: `Free cash flow for ${c.sym}.`,
      rows: [
        ['Operating Cash Flow', cur(c.cf.operatingCashFlow, true)],
        ['Capex', cur(c.cf.capitalExpenditure, true)],
        ['Free Cash Flow', cur(fcf, true)],
        ['Market Cap', cur(mc, true)],
        ['FCF Yield', yld != null ? pctFrac(yld) : '-'],
      ],
      steps: [
        `FCF = operating cash flow ${cur(c.cf.operatingCashFlow, true)} minus capex ${cur(c.cf.capitalExpenditure, true)} = ${cur(fcf, true)}.`,
        yld != null ? `Against a ${cur(mc, true)} market cap that is a FCF yield of ${pctFrac(yld)} - the cash return you earn at today's price.` : 'FCF yield could not be computed.',
        `A FCF yield above the bond yield, with room to grow, is the hallmark of a cash-generative business.`,
      ],
    }
  },
  // EV multiples
  fs204: (c) => ({
    intro: `Enterprise value multiples for ${c.sym}.`,
    rows: [
      ['Market Cap', cur(c.quote.market_cap, true)],
      ['Total Debt', cur(c.bal.totalDebt, true)],
      ['Cash', cur(c.bal.cashAndCashEquivalents, true)],
      ['EV/EBITDA', c.km.evToEBITDATTM ? `${n(c.km.evToEBITDATTM, 1)}×` : '-'],
      ['EV/Sales', c.km.evToSalesTTM ? `${n(c.km.evToSalesTTM, 1)}×` : '-'],
    ],
    steps: [
      `EV = market cap ${cur(c.quote.market_cap, true)} + debt ${cur(c.bal.totalDebt, true)} − cash ${cur(c.bal.cashAndCashEquivalents, true)}.`,
      `${c.sym} trades at ${c.km.evToEBITDATTM ? n(c.km.evToEBITDATTM, 1) + '× EV/EBITDA' : 'n/a'} - capital-structure-neutral, unlike P/E.`,
      `Compare this multiple to peers in the Comps model of the Valuation Lab.`,
    ],
  }),
  // Comps
  vm101: (c) => ({
    intro: `Relative valuation snapshot for ${c.sym}.`,
    rows: [
      ['P/E', c.quote.pe_ratio ? `${n(c.quote.pe_ratio, 1)}×` : '-'],
      ['EV/EBITDA', c.km.evToEBITDATTM ? `${n(c.km.evToEBITDATTM, 1)}×` : '-'],
      ['P/B', c.rt.priceToBookRatioTTM ? `${n(c.rt.priceToBookRatioTTM, 1)}×` : '-'],
      ['P/S', c.rt.priceToSalesRatioTTM ? `${n(c.rt.priceToSalesRatioTTM, 1)}×` : '-'],
    ],
    steps: [
      `These are ${c.sym}'s current multiples. Comps works by comparing them to a median of genuinely similar peers.`,
      `Open the Comps model in the Valuation Lab - it auto-loads peers and computes the implied price at the peer median.`,
      `Remember: cheap-vs-peers means nothing if the whole sector is mispriced.`,
    ],
  }),
  // DDM
  vm102: (c) => {
    const dy = c.quote.dividend_yield
    return {
      intro: `Dividend discount inputs for ${c.sym}.`,
      rows: [
        ['Price', cur(c.quote.price)],
        ['Dividend Yield', dy != null ? `${n(dy, 2)}%` : '-'],
        ['Payout Ratio', c.km.payoutRatioTTM != null ? pctFrac(c.km.payoutRatioTTM) : '-'],
        ['ROE', c.km.returnOnEquityTTM != null ? pctFrac(c.km.returnOnEquityTTM) : '-'],
      ],
      steps: [
        dy != null && dy > 0 ? `${c.sym} yields ${n(dy, 2)}%. The DDM values the stock as next year's dividend ÷ (Ke − g).` : `${c.sym} pays little or no dividend, so the DDM is a poor fit - use a DCF instead.`,
        `Sustainable growth g ≈ ROE × (1 − payout). With ROE ${c.km.returnOnEquityTTM != null ? pctFrac(c.km.returnOnEquityTTM) : 'n/a'} and payout ${c.km.payoutRatioTTM != null ? pctFrac(c.km.payoutRatioTTM) : 'n/a'}, estimate g and plug into the DDM model.`,
        `Run the full model under the DDM tab of the Valuation Lab.`,
      ],
    }
  },
  // PEG
  vm104: (c) => {
    const pe = c.quote.pe_ratio
    const g = c.km.pegRatioTTM && pe ? pe / c.km.pegRatioTTM : null
    return {
      intro: `PEG check for ${c.sym}.`,
      rows: [
        ['P/E', pe ? `${n(pe, 1)}×` : '-'],
        ['PEG', c.km.pegRatioTTM ? n(c.km.pegRatioTTM, 2) : '-'],
        ['Implied growth', g ? `${n(g, 0)}%` : '-'],
      ],
      steps: [
        `PEG = P/E ÷ growth%. ${c.sym}'s PEG is ${c.km.pegRatioTTM ? n(c.km.pegRatioTTM, 2) : 'n/a'}.`,
        `A PEG near 1.0 is roughly fair for the growth; below 1.0 is potentially cheap, above ~2.0 is rich.`,
        `PEG relies on forecast growth and ignores risk - sanity-check the growth assumption.`,
      ],
    }
  },
}

// ── Category fallback ─────────────────────────────────────────────────────────
function fallback(c, topic) {
  return {
    intro: `Live metrics for ${c.sym} relevant to "${topic.title}".`,
    rows: [
      ['Price', cur(c.quote.price)],
      ['P/E', c.quote.pe_ratio ? `${n(c.quote.pe_ratio, 1)}×` : '-'],
      ['P/B', c.rt.priceToBookRatioTTM ? `${n(c.rt.priceToBookRatioTTM, 1)}×` : '-'],
      ['ROE', c.km.returnOnEquityTTM != null ? pctFrac(c.km.returnOnEquityTTM) : '-'],
      ['Net Margin', c.rt.netProfitMarginTTM != null ? pctFrac(c.rt.netProfitMarginTTM) : '-'],
      ['FCF Yield', c.km.freeCashFlowYieldTTM != null ? pctFrac(c.km.freeCashFlowYieldTTM) : '-'],
    ],
    steps: [
      `Use these live ${c.sym} figures as you read the lesson - relate each concept to the actual number.`,
      topic.labModel ? `This topic has an interactive model: open the Valuation Lab to apply it to ${c.sym} directly.` : `For valuation topics, load this name in the Valuation Lab to model it end-to-end.`,
    ],
  }
}

export function getWorkedExample(topic, data) {
  if (!topic || !data) return null
  const c = ctxFrom(data)
  if (!c.quote.price) return null
  const builder = BUILDERS[topic.id]
  return builder ? builder(c) : fallback(c, topic)
}

export default getWorkedExample
