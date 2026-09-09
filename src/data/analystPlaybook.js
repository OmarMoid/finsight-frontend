/**
 * The analyst playbook — the content behind the Coach page.
 *
 * A walkthrough of how to analyse one real company using the data FinSight
 * already has, in the order a professional actually works: understand the
 * business, then how it earns, then what it owes, then what it's worth, then
 * what the market thinks, and only then form a view.
 *
 * Deliberately **no AI**. Every reading below is a rule applied to a live
 * number, so the walkthrough works with no API key, costs nothing, never
 * hallucinates a figure, and — most importantly for learning — the rule itself
 * is stated, so you can disagree with it. A model that says "this looks
 * expensive" teaches nothing; "P/E of 36 against a 15–25 typical band" teaches
 * you where the band came from.
 *
 * Each step declares:
 *   id, title, question  — what this step is trying to answer
 *   where                — where in FinSight this data lives, so the tour
 *                          doubles as a map of the app
 *   metrics(data)        — the live figures, each with its own reading
 *   teaching             — what these numbers mean, in general
 *   checkYourself        — a question to answer before moving on
 */

// ── Reading helpers ─────────────────────────────────────────────────────────
// A "reading" is {verdict, note}. `verdict` drives colour only; `note` is the
// sentence that does the teaching, and always states the threshold it used.

const GOOD = 'good'
const WATCH = 'watch'
const POOR = 'poor'
const NEUTRAL = 'neutral'

const num = (v) => (typeof v === 'number' && isFinite(v) ? v : null)

/**
 * Grade a value against two thresholds and say, in words, which side of them
 * it fell on.
 *
 * `invert` marks a metric where lower is better (leverage, EV/EBITDA). Getting
 * the *wording* right for those matters as much as the verdict: a 27x
 * EV/EBITDA is failing because it is **above** the 16x line, and a note that
 * says "below the threshold" while colouring the number red teaches the
 * opposite of the intended lesson.
 */
function band(value, { good, watch, invert = false, unit = '', name }) {
  const v = num(value)
  if (v === null) return null
  const better = invert ? v <= good : v >= good
  const middling = invert ? v <= watch : v >= watch

  // "at or above" for higher-is-better, "at or below" for lower-is-better —
  // and the failing case is the opposite direction again.
  const passWord = invert ? 'at or below' : 'at or above'
  const failWord = invert ? 'above' : 'below'

  if (better) {
    return {
      verdict: GOOD,
      note: `${name} of ${fmt(v, unit)} - ${passWord} the ${fmt(good, unit)} mark that generally reads as strong.`,
    }
  }
  if (middling) {
    return {
      verdict: WATCH,
      note: `${name} of ${fmt(v, unit)} - between ${fmt(good, unit)} and ${fmt(watch, unit)}, so respectable rather than remarkable.`,
    }
  }
  return {
    verdict: POOR,
    note: `${name} of ${fmt(v, unit)} - ${failWord} the ${fmt(watch, unit)} threshold, which is where this metric starts to be a concern.`,
  }
}

function fmt(v, unit) {
  if (v === null || v === undefined) return '-'
  if (unit === '%') return `${v.toFixed(1)}%`
  if (unit === 'x') return `${v.toFixed(1)}x`
  return v.toFixed(2)
}

const pctOf = (v) => (num(v) === null ? null : v * 100)

// ── Step definitions ────────────────────────────────────────────────────────

export const STEPS = [
  // 1 ───────────────────────────────────────────────────────────────────────
  {
    id: 'business',
    title: 'Understand the business',
    question: 'What does this company actually sell, and to whom?',
    where: 'Fundamentals → Business · Filings → 10-K Item 1',
    teaching: [
      'Everything downstream depends on this. A retailer with 3% net margins and a software company with 30% are not comparable, and a "cheap" P/E means something different in each.',
      'Size matters for a different reason: a $4tn company cannot grow 40% a year, and a $400m one can be taken over or run out of cash. Market cap sets the range of plausible outcomes before you look at a single ratio.',
      "Beta is how much the stock has historically moved for a 1% move in the market. Above 1 it amplifies, below 1 it dampens. It is a measure of past volatility, not of risk in the everyday sense - a stable business can have a high beta and vice versa.",
    ],
    metrics: (d) => [
      {
        label: 'Sector',
        value: d.quote?.sector || '-',
        reading: d.quote?.sector
          ? { verdict: NEUTRAL, note: `Compare every ratio below against other ${d.quote.sector.toLowerCase()} companies, not against the market as a whole.` }
          : null,
      },
      {
        label: 'Market cap',
        value: d.fmt.money(d.quote?.market_cap),
        reading: (() => {
          const cap = num(d.quote?.market_cap)
          if (cap === null) return null
          if (cap >= 200e9) return { verdict: NEUTRAL, note: 'Mega-cap. Well covered by analysts, so genuine mispricings are rare and usually about the long term rather than the next quarter.' }
          if (cap >= 10e9) return { verdict: NEUTRAL, note: 'Large-cap. Liquid, well researched, but still capable of surprising on a change in trajectory.' }
          if (cap >= 2e9) return { verdict: NEUTRAL, note: 'Mid-cap. Thinner coverage, so more room for independent work to pay off - and more room to be wrong alone.' }
          return { verdict: WATCH, note: 'Small-cap. Expect wider spreads, thinner analyst coverage and more volatile fundamentals. Position size accordingly.' }
        })(),
      },
      {
        label: 'Beta',
        value: d.fmt.plain(d.quote?.beta),
        reading: (() => {
          const b = num(d.quote?.beta)
          if (b === null) return null
          if (b > 1.3) return { verdict: WATCH, note: `Beta ${b.toFixed(2)} - historically moves about ${b.toFixed(1)}x the market. Expect sharper drawdowns in a selloff.` }
          if (b < 0.8) return { verdict: NEUTRAL, note: `Beta ${b.toFixed(2)} - historically less volatile than the market. Often a defensive business.` }
          return { verdict: NEUTRAL, note: `Beta ${b.toFixed(2)} - roughly moves with the market.` }
        })(),
      },
    ],
    checkYourself: 'In one sentence and without using the word "technology", how does this company make money?',
  },

  // 2 ───────────────────────────────────────────────────────────────────────
  {
    id: 'price',
    title: 'Read the price action',
    question: 'Where is the price relative to its own recent history?',
    where: 'Charts · Stock page → Technicals',
    teaching: [
      'This step is about context, not prediction. Buying a good business is a different decision at the top of its 52-week range than at the bottom, even if nothing about the business has changed.',
      'A moving average is just the average close over N days. Price above the 200-day is the conventional definition of an uptrend; below it, a downtrend. It tells you what has been happening, never what will.',
      'RSI measures how one-sided recent moves have been, on a 0–100 scale. Above 70 is conventionally "overbought", below 30 "oversold" - but a strong stock can sit above 70 for months, so treat it as a flag to look closer, not a signal.',
    ],
    metrics: (d) => {
      const t = d.technicals || {}
      const q = d.quote || {}
      const high = num(q['52w_high'])
      const low = num(q['52w_low'])
      const price = num(q.price)
      const position = high && low && price && high > low ? ((price - low) / (high - low)) * 100 : null
      return [
        {
          label: 'Position in 52-week range',
          value: position != null ? `${position.toFixed(0)}%` : '-',
          reading: position == null ? null : position > 85
            ? { verdict: WATCH, note: `${position.toFixed(0)}% of the way up the 52-week range - near the highs. Nothing wrong with that, but you are paying up relative to anyone who bought this year.` }
            : position < 20
              ? { verdict: WATCH, note: `${position.toFixed(0)}% of the range - near the lows. Ask why: a cheap price and a broken business look identical on this metric alone.` }
              : { verdict: NEUTRAL, note: `${position.toFixed(0)}% of the range - mid-range, so the price is not itself making an argument either way.` },
        },
        {
          label: 'vs. 200-day average',
          value: t.price_vs_sma200 != null ? `${t.price_vs_sma200 > 0 ? '+' : ''}${t.price_vs_sma200.toFixed(1)}%` : '-',
          reading: (() => {
            const v = num(t.price_vs_sma200)
            if (v === null) return null
            if (v > 20) return { verdict: WATCH, note: `${v.toFixed(1)}% above the 200-day. Extended - long-run trends are intact but the stock is a long way ahead of its own average.` }
            if (v > 0) return { verdict: GOOD, note: `${v.toFixed(1)}% above the 200-day, the conventional definition of an uptrend.` }
            return { verdict: WATCH, note: `${v.toFixed(1)}% below the 200-day - a downtrend by the conventional definition. Worth understanding what changed.` }
          })(),
        },
        {
          label: 'RSI (14-day)',
          value: d.fmt.plain(t.rsi14, 1),
          reading: (() => {
            const r = num(t.rsi14)
            if (r === null) return null
            if (r >= 70) return { verdict: WATCH, note: `RSI ${r.toFixed(0)} - above the conventional 70 "overbought" line. Momentum is strong; entries here have less margin for error.` }
            if (r <= 30) return { verdict: WATCH, note: `RSI ${r.toFixed(0)} - below the conventional 30 "oversold" line. Sometimes an opportunity, sometimes the start of a repricing.` }
            return { verdict: NEUTRAL, note: `RSI ${r.toFixed(0)} - between 30 and 70, so no momentum extreme.` }
          })(),
        },
        {
          label: 'Nearest support',
          value: d.fmt.plain((t.support_resistance?.support || [])[0]),
          reading: (t.support_resistance?.support || []).length
            ? { verdict: NEUTRAL, note: 'A price level where buyers have previously stepped in. Useful for framing where a thesis would be wrong, not for predicting a bounce.' }
            : null,
        },
      ]
    },
    checkYourself: 'If the price fell 20% from here, what level would it reach - and is there anything in the price history at that level?',
  },

  // 3 ───────────────────────────────────────────────────────────────────────
  {
    id: 'profitability',
    title: 'Check how well it earns',
    question: 'Does this business turn revenue into profit, and capital into returns?',
    where: 'Fundamentals → Profitability & Quality',
    teaching: [
      'Margins tell you about the business model. Gross margin is what is left after the direct cost of what was sold - it is the clearest signal of pricing power. Net margin is what is left after everything.',
      'Returns tell you about capital allocation. Return on equity can be flattered by debt (borrowing shrinks the equity base), which is why return on invested capital matters more: it measures the return on all the money in the business, borrowed or not.',
      'The single most useful comparison is ROIC against the cost of capital, typically 8–10%. A company earning above it creates value by growing. A company earning below it destroys value by growing - growth makes it worse, not better.',
    ],
    metrics: (d) => {
      const km = d.financials?.key_metrics_ttm || {}
      const rt = d.financials?.ratios_ttm || {}
      return [
        {
          label: 'Gross margin',
          value: d.fmt.pct(rt.grossProfitMarginTTM),
          reading: band(pctOf(rt.grossProfitMarginTTM), { good: 40, watch: 20, unit: '%', name: 'Gross margin' }),
        },
        {
          label: 'Net margin',
          value: d.fmt.pct(rt.netProfitMarginTTM),
          reading: band(pctOf(rt.netProfitMarginTTM), { good: 15, watch: 5, unit: '%', name: 'Net margin' }),
        },
        {
          label: 'Return on equity',
          value: d.fmt.pct(km.returnOnEquityTTM),
          reading: band(pctOf(km.returnOnEquityTTM), { good: 15, watch: 8, unit: '%', name: 'ROE' }),
        },
        {
          label: 'Return on invested capital',
          value: d.fmt.pct(km.returnOnInvestedCapitalTTM),
          reading: (() => {
            const v = pctOf(km.returnOnInvestedCapitalTTM)
            if (v === null) return null
            if (v >= 15) return { verdict: GOOD, note: `ROIC of ${v.toFixed(1)}% is comfortably above a typical 8–10% cost of capital, so growth here creates value.` }
            if (v >= 8) return { verdict: WATCH, note: `ROIC of ${v.toFixed(1)}% is close to a typical 8–10% cost of capital. The company roughly breaks even on the capital it employs.` }
            return { verdict: POOR, note: `ROIC of ${v.toFixed(1)}% is below a typical 8–10% cost of capital - on these numbers, growth destroys value rather than creating it.` }
          })(),
        },
      ]
    },
    checkYourself: 'Is ROIC above or below 10%? If below, what would have to change for growth to be worth having?',
  },

  // 4 ───────────────────────────────────────────────────────────────────────
  {
    id: 'growth',
    title: 'Measure the growth',
    question: 'Is the business bigger than it was, and is profit keeping up with revenue?',
    where: 'Fundamentals → Growth',
    teaching: [
      'Look at revenue and profit growth together. Profit growing faster than revenue means margins are expanding - usually operating leverage or pricing power. Profit growing slower means costs are winning.',
      'Prefer the compound rate over several years to the latest year alone. One good year can be a comparison against a bad one; a five-year compound rate is much harder to fake.',
      'Free cash flow growth is the honest check on both. Revenue can be booked before cash arrives and profit is an accounting figure; cash is cash. Persistent profit growth with flat free cash flow is the single most common warning sign in fundamental analysis.',
    ],
    metrics: (d) => d.growth.map((g) => ({
      label: `${g.label} (CAGR)`,
      value: g.cagr != null ? `${g.cagr > 0 ? '+' : ''}${g.cagr.toFixed(1)}%` : '-',
      reading: g.cagr == null ? null : g.cagr >= 15
        ? { verdict: GOOD, note: `Compounding at ${g.cagr.toFixed(1)}% a year over the reported periods - fast growth. Check it is not one exceptional year doing the work.` }
        : g.cagr >= 5
          ? { verdict: NEUTRAL, note: `Compounding at ${g.cagr.toFixed(1)}% a year - steady growth, roughly in line with a healthy mature business.` }
          : g.cagr >= 0
            ? { verdict: WATCH, note: `Compounding at ${g.cagr.toFixed(1)}% a year - close to flat. Below inflation, this is shrinking in real terms.` }
            : { verdict: POOR, note: `Declining at ${Math.abs(g.cagr).toFixed(1)}% a year. Understand whether this is cyclical or structural before anything else.` },
    })),
    checkYourself: 'Is net income growing faster or slower than revenue - and does free cash flow agree with the profit figure?',
  },

  // 5 ───────────────────────────────────────────────────────────────────────
  {
    id: 'balance',
    title: 'Inspect the balance sheet',
    question: 'Can this company survive a bad year?',
    where: 'Fundamentals → Balance Sheet Health · Stock page → Financials',
    teaching: [
      'Debt is not bad in itself - it is cheaper than equity and amplifies returns. It becomes bad when earnings fall and the interest still has to be paid. The question is always "how much can earnings drop before this is a problem?"',
      'The current ratio compares assets that turn into cash within a year against bills due within a year. Below 1 is not automatically a crisis (supermarkets run below 1 by design, because they collect cash before they pay suppliers) but it does need a reason.',
      'The Altman Z-Score bundles five balance-sheet ratios into one distress score. It was calibrated on manufacturers and is genuinely not applicable to banks or REITs - FinSight refuses to show it for those rather than printing a scary number the model was never built to produce.',
    ],
    metrics: (d) => {
      const rt = d.financials?.ratios_ttm || {}
      const km = d.financials?.key_metrics_ttm || {}
      const scores = d.financials?.financial_scores || {}
      const out = [
        {
          label: 'Debt / equity',
          value: d.fmt.plain(rt.debtToEquityRatioTTM ?? km.debtToEquityTTM),
          reading: band(num(rt.debtToEquityRatioTTM ?? km.debtToEquityTTM), { good: 1, watch: 2, invert: true, unit: 'x', name: 'Debt/equity' }),
        },
        {
          label: 'Current ratio',
          value: d.fmt.plain(rt.currentRatioTTM ?? km.currentRatioTTM),
          reading: (() => {
            const v = num(rt.currentRatioTTM ?? km.currentRatioTTM)
            if (v === null) return null
            if (v >= 1.5) return { verdict: GOOD, note: `Current ratio ${v.toFixed(2)} - comfortably more than a year's worth of near-term assets against near-term bills.` }
            if (v >= 1) return { verdict: NEUTRAL, note: `Current ratio ${v.toFixed(2)} - short-term assets cover short-term liabilities, with little slack.` }
            return { verdict: WATCH, note: `Current ratio ${v.toFixed(2)} - below 1. Not fatal (some business models collect cash before paying suppliers) but it needs an explanation.` }
          })(),
        },
      ]
      const altman = scores.altmanDetail
      if (altman?.applicable === false) {
        out.push({
          label: 'Altman Z-Score',
          value: 'Not applicable',
          reading: { verdict: NEUTRAL, note: altman.reason },
        })
      } else if (scores.altmanZScore != null) {
        out.push({
          label: 'Altman Z-Score',
          value: d.fmt.plain(scores.altmanZScore),
          reading: scores.altmanZScore >= 3
            ? { verdict: GOOD, note: `Z of ${scores.altmanZScore.toFixed(2)} - above 3.0, the "safe" zone for bankruptcy risk.` }
            : scores.altmanZScore >= 1.8
              ? { verdict: WATCH, note: `Z of ${scores.altmanZScore.toFixed(2)} - the 1.8–3.0 grey zone. Not distress, but not comfortable.` }
              : { verdict: POOR, note: `Z of ${scores.altmanZScore.toFixed(2)} - below 1.8, the distress zone. Treat leverage as the main risk here.` },
        })
      }
      if (scores.piotroskiScore != null) {
        const outOf = scores.piotroskiOutOf || 9
        out.push({
          label: 'Piotroski F-Score',
          value: `${scores.piotroskiScore}/${outOf}`,
          reading: (scores.piotroskiScore / outOf) >= 0.78
            ? { verdict: GOOD, note: `${scores.piotroskiScore} of ${outOf} fundamental tests passed - improving on most measures year on year.` }
            : (scores.piotroskiScore / outOf) >= 0.44
              ? { verdict: NEUTRAL, note: `${scores.piotroskiScore} of ${outOf} tests passed - a mixed picture of improvement and deterioration.` }
              : { verdict: POOR, note: `${scores.piotroskiScore} of ${outOf} tests passed - deteriorating on most fundamental measures.` },
        })
      }
      return out
    },
    checkYourself: 'If revenue fell 30% for two years, would this balance sheet cope? What in the numbers tells you that?',
  },

  // 6 ───────────────────────────────────────────────────────────────────────
  {
    id: 'multiples',
    title: 'Price the business against its peers',
    question: 'What is the market paying for each unit of earnings, book value and cash flow?',
    where: 'Fundamentals → Valuation · Screener',
    teaching: [
      'A multiple is a shorthand, not a valuation. P/E of 30 means you are paying 30 years of current earnings - which is cheap if earnings triple and dear if they halve. The multiple is a question, never an answer.',
      'EV/EBITDA is the more comparable multiple across companies with different debt loads, because enterprise value includes debt and EBITDA sits above interest. It is the one to reach for when comparing a heavily borrowed company with a debt-free one.',
      'Never compare a multiple across sectors. A utility on 15x and a software company on 15x are not equally priced; they are priced for completely different growth and risk. Compare against the same company’s own history and its direct peers.',
    ],
    metrics: (d) => {
      const km = d.financials?.key_metrics_ttm || {}
      const rt = d.financials?.ratios_ttm || {}
      const pe = num(rt.priceToEarningsRatioTTM ?? km.peRatioTTM)
      return [
        {
          label: 'P/E (trailing)',
          value: d.fmt.plain(pe),
          reading: pe === null ? null : pe < 0
            ? { verdict: WATCH, note: 'Negative P/E - the company is loss-making, so the ratio has no meaning. Use price-to-sales or EV/EBITDA instead.' }
            : pe < 15
              ? { verdict: GOOD, note: `P/E of ${pe.toFixed(1)} - below the 15–25 band a mature profitable business usually trades in. Either genuinely cheap or the market expects earnings to fall.` }
              : pe <= 25
                ? { verdict: NEUTRAL, note: `P/E of ${pe.toFixed(1)} - inside the 15–25 band typical of a mature profitable business.` }
                : { verdict: WATCH, note: `P/E of ${pe.toFixed(1)} - above the typical 15–25 band. That is only justified by growth, so check the growth step actually supports it.` },
        },
        {
          label: 'Forward P/E',
          value: d.fmt.plain(d.quote?.pe_forward),
          reading: (() => {
            const fwd = num(d.quote?.pe_forward)
            if (fwd === null || pe === null || pe <= 0) return null
            return fwd < pe
              ? { verdict: NEUTRAL, note: `Forward P/E of ${fwd.toFixed(1)} is below the trailing ${pe.toFixed(1)}, so analysts expect earnings to grow. The gap is the size of that expectation.` }
              : { verdict: WATCH, note: `Forward P/E of ${fwd.toFixed(1)} is above the trailing ${pe.toFixed(1)} - analysts expect earnings to *fall*. Find out why before anything else.` }
          })(),
        },
        {
          label: 'EV / EBITDA',
          value: d.fmt.plain(km.evToEBITDATTM),
          reading: band(num(km.evToEBITDATTM), { good: 10, watch: 16, invert: true, unit: 'x', name: 'EV/EBITDA' }),
        },
        {
          label: 'Free cash flow yield',
          value: d.fmt.pct(km.freeCashFlowYieldTTM),
          reading: (() => {
            const v = pctOf(km.freeCashFlowYieldTTM)
            if (v === null) return null
            if (v >= 6) return { verdict: GOOD, note: `${v.toFixed(1)}% of the market cap arrives as free cash each year - a high yield, and the most tangible form of "cheap".` }
            if (v >= 3) return { verdict: NEUTRAL, note: `${v.toFixed(1)}% free cash flow yield - reasonable. For comparison, ask what a government bond pays today.` }
            return { verdict: WATCH, note: `${v.toFixed(1)}% free cash flow yield - low. You are paying for future cash flows, not current ones.` }
          })(),
        },
      ]
    },
    checkYourself: 'Is this stock more or less expensive than its own five-year average multiple? The Screener will show you peers on the same measure.',
  },

  // 7 ───────────────────────────────────────────────────────────────────────
  {
    id: 'intrinsic',
    title: 'Estimate what it is worth',
    question: 'What do the cash flows themselves say the business is worth?',
    where: 'Stock page → Valuation · Research · Learning → Valuation Lab',
    teaching: [
      'A discounted cash flow adds up the cash a business will produce and discounts it back to today, because a dollar in ten years is worth less than a dollar now. It is the only valuation method that is about the business rather than about what someone else will pay.',
      'A DCF is exquisitely sensitive to two assumptions: the discount rate and the terminal growth rate. Moving either by one percentage point can move the answer 30%. So the useful output is not the number - it is the range, and knowing which assumption is doing the work.',
      'Use it to answer "what would have to be true for today’s price to make sense?" rather than "what is the right price?". If the price implies 20% growth forever, you now have something concrete to agree or disagree with.',
    ],
    metrics: (d) => {
      const dcf = d.valuation?.dcf || {}
      const price = num(d.quote?.price)
      const out = []
      if (dcf.applicable === false) {
        out.push({ label: 'DCF fair value', value: 'Not applicable', reading: { verdict: NEUTRAL, note: dcf.reason } })
      } else if (num(dcf.dcf) !== null) {
        const upside = price ? (dcf.dcf / price - 1) * 100 : null
        out.push({
          label: 'DCF fair value',
          value: d.fmt.plain(dcf.dcf),
          reading: upside === null ? null : upside > 20
            ? { verdict: GOOD, note: `The model puts fair value ${upside.toFixed(0)}% above the current price. Before believing it, check which assumption is producing that gap.` }
            : upside > -20
              ? { verdict: NEUTRAL, note: `Fair value within ${Math.abs(upside).toFixed(0)}% of the price - the model broadly agrees with the market, which is the usual result.` }
              : { verdict: WATCH, note: `The model puts fair value ${Math.abs(upside).toFixed(0)}% below the price. Either the market expects far more growth than the model assumes, or the stock is expensive.` },
        })
        if (dcf.assumptions) {
          out.push({
            label: 'Discount rate used',
            value: `${(dcf.assumptions.discountRate * 100).toFixed(1)}%`,
            reading: { verdict: NEUTRAL, note: `Built from the risk-free rate plus a beta-adjusted equity premium. Raise it and the fair value falls - this is the assumption to stress-test first.` },
          })
          out.push({
            label: 'Terminal growth used',
            value: `${(dcf.assumptions.terminalGrowth * 100).toFixed(1)}%`,
            reading: { verdict: NEUTRAL, note: 'Growth assumed forever after year five. It must be below long-run GDP growth - anything higher implies the company eventually becomes the whole economy.' },
          })
        }
      }
      const target = d.valuation?.price_target?.yfinance || {}
      const mean = num(target.targetMean ?? d.quote?.target_mean)
      if (mean !== null && price) {
        const gap = (mean / price - 1) * 100
        out.push({
          label: 'Analyst mean target',
          value: d.fmt.plain(mean),
          reading: {
            verdict: NEUTRAL,
            note: `${gap > 0 ? '+' : ''}${gap.toFixed(0)}% from today. Worth knowing as a consensus marker, but analyst targets cluster near the current price and are revised after moves, not before them.`,
          },
        })
      }
      return out
    },
    checkYourself: 'What growth rate would the DCF need for fair value to equal today’s price? That number is the market’s expectation, and it is the thing you are really betting for or against.',
  },

  // 8 ───────────────────────────────────────────────────────────────────────
  {
    id: 'sentiment',
    title: 'Weigh what everyone else thinks',
    question: 'What is already priced in, and where might you disagree?',
    where: 'Stock page → Valuation, News · Sentiment · Dashboard',
    teaching: [
      'Consensus is not a signal to follow - it is the thing you need an edge against. If 39 of 40 analysts rate a stock a Buy, the good news is already in the price and the asymmetry runs against you.',
      'Earnings surprises matter more than ratings. A company that has beaten estimates for eight straight quarters has either a conservative management team or genuine momentum, and both are worth knowing.',
      'The Fear & Greed index on the Dashboard is market-wide, not stock-specific. It is context for sizing and timing, never a reason to buy or sell a particular company.',
    ],
    metrics: (d) => {
      const out = []
      const n = num(d.quote?.num_analysts)
      if (n !== null) {
        out.push({
          label: 'Analysts covering',
          value: String(n),
          reading: n >= 25
            ? { verdict: NEUTRAL, note: `${n} analysts cover this. Heavy coverage means efficient pricing - an independent view has to be genuinely differentiated to be worth anything.` }
            : n >= 8
              ? { verdict: NEUTRAL, note: `${n} analysts - moderate coverage.` }
              : { verdict: WATCH, note: `Only ${n} analysts cover this. Thin coverage means more room for mispricing, and less external work to check yours against.` },
        })
      }
      const high = num(d.quote?.target_high)
      const low = num(d.quote?.target_low)
      const price = num(d.quote?.price)
      if (high && low && price) {
        const spread = ((high - low) / price) * 100
        out.push({
          label: 'Target spread',
          value: `${spread.toFixed(0)}% of price`,
          reading: spread > 60
            ? { verdict: WATCH, note: `Targets span ${spread.toFixed(0)}% of the price - analysts strongly disagree. Wide disagreement usually means the outcome hinges on one uncertain thing. Find out what.` }
            : { verdict: NEUTRAL, note: `Targets span ${spread.toFixed(0)}% of the price - a fairly tight consensus.` },
        })
      }
      if (d.earnings?.history?.length) {
        const scored = d.earnings.history.filter((h) => h.surprise_percent != null)
        const beats = scored.filter((h) => h.surprise_percent >= 0).length
        if (scored.length) {
          out.push({
            label: 'Earnings beat rate',
            value: `${beats}/${scored.length}`,
            reading: beats / scored.length >= 0.75
              ? { verdict: GOOD, note: `Beat estimates in ${beats} of the last ${scored.length} quarters - consistent execution, or consistently conservative guidance.` }
              : beats / scored.length >= 0.5
                ? { verdict: NEUTRAL, note: `Beat in ${beats} of ${scored.length} quarters - a mixed record against expectations.` }
                : { verdict: WATCH, note: `Missed in ${scored.length - beats} of the last ${scored.length} quarters. Repeated misses usually mean guidance is disconnected from the business.` },
          })
        }
      }
      return out
    },
    checkYourself: 'Name one thing you believe about this company that the consensus does not. If you cannot, you have no edge - which is fine, but it should be a deliberate choice.',
  },

  // 9 ───────────────────────────────────────────────────────────────────────
  {
    id: 'filings',
    title: 'Read the primary sources',
    question: 'What does the company say about itself, in the document it can be sued over?',
    where: 'Filings → 10-K, 10-Q, 8-K, DEF 14A',
    teaching: [
      'Everything so far has been numbers someone else computed. The filings are the source. Item 1A (Risk Factors) is management’s own list of what could go wrong, and it is legally dangerous for them to leave something out.',
      'Read Item 7 (MD&A) against the numbers you have just seen. If margins fell and the MD&A does not explain why, that is itself the finding.',
      'The proxy statement (DEF 14A) tells you what management is paid *for*. Compensation tied to revenue growth and compensation tied to return on capital produce very different companies.',
    ],
    metrics: () => [],
    checkYourself: 'Open the latest 10-K, read the first five risk factors, and write down which one you think is genuinely underpriced by the market.',
    action: { label: 'Open the filings', to: (symbol) => `/filings?symbol=${encodeURIComponent(symbol)}` },
  },

  // 10 ──────────────────────────────────────────────────────────────────────
  {
    id: 'call',
    title: 'Form the view',
    question: 'What do you actually think, and what would change your mind?',
    where: 'Research (full sourced workup + Excel) · Guru',
    teaching: [
      'A view without a falsifier is not a view, it is a hope. Before you finish, write down the specific thing that would make you wrong - a margin below X, a second quarter of declining revenue, a covenant breach.',
      'Separate the business from the price. "Good company, too expensive" is a complete and respectable conclusion, and it is the one you will reach most often.',
      'The Research tab runs seven valuation models, a macro regime read and a scenario ladder for this ticker and exports the lot to Excel. Use it *after* forming your own view, so you find out where you disagree with it rather than starting from its answer.',
    ],
    metrics: (d) => {
      // A tally of how the earlier steps came out. Deliberately not a
      // recommendation — it is a count of the readings, which is a summary of
      // what was observed, not advice about what to do.
      const tally = d.tally || { good: 0, watch: 0, poor: 0 }
      const total = tally.good + tally.watch + tally.poor
      return [{
        label: 'Readings across all steps',
        value: total ? `${tally.good} strong · ${tally.watch} watch · ${tally.poor} weak` : '-',
        reading: total
          ? { verdict: NEUTRAL, note: 'A count of how the thresholds above came out. It is a summary of what was observed, not a recommendation - the weight each one deserves is a judgement only you can make.' }
          : null,
      }]
    },
    checkYourself: 'Write two sentences: what you think, and what would prove you wrong.',
    action: { label: 'Run the full research workup', to: (symbol) => `/research?symbol=${encodeURIComponent(symbol)}` },
  },
]

export const VERDICT_COLOURS = {
  [GOOD]: 'var(--positive)',
  [WATCH]: 'var(--accent-gold)',
  [POOR]: 'var(--negative)',
  [NEUTRAL]: 'var(--text-secondary)',
}

export { GOOD, WATCH, POOR, NEUTRAL }
