// ============================================================================
// FinSight Learning Hub — curriculum structure, lesson content, quiz banks.
//
// Status: STRUCTURE complete for all 47 topics.
//         LESSON_CONTENT + QUIZ_BANKS complete for the Fundamentals category
//         (12 topics, fs101–fs304). Remaining 35 topics are scaffolded and
//         filled in subsequent batches.
// ============================================================================

import { EXTRA_TOPICS, EXTRA_LESSONS, EXTRA_LESSON_QUIZZES } from './learningExtra'
import { ANALYST_TOPICS, ANALYST_LESSONS, ANALYST_QUIZZES } from './learningAnalyst'
import { DEEP_DIVES } from './learningDeepDives'

// ── Curriculum structure ───────────────────────────────────────────────────
// The literal below is the original 47-topic curriculum; learningExtra.js adds
// more immediately after it (see the merge under TOTAL_TOPICS).
// labModel links a lesson to an interactive Valuation Lab model.
export const CATEGORIES = [
  {
    key: 'fundamentals',
    label: 'Fundamentals',
    emoji: '📊',
    topics: [
      { id: 'fs101', title: 'Reading Financial Statements', level: 'Beginner', duration: 18 },
      { id: 'fs102', title: 'P/E, P/B, P/S Ratios', level: 'Beginner', duration: 16 },
      { id: 'fs103', title: 'EPS and Earnings Quality', level: 'Beginner', duration: 16 },
      { id: 'fs201', title: 'DCF Valuation First Principles', level: 'Intermediate', duration: 28, labModel: 'dcf' },
      { id: 'fs202', title: 'ROIC, ROE, ROA - Capital Efficiency', level: 'Intermediate', duration: 24 },
      { id: 'fs203', title: 'Free Cash Flow Analysis', level: 'Intermediate', duration: 24 },
      { id: 'fs204', title: 'Enterprise Value and EV Multiples', level: 'Intermediate', duration: 22 },
      { id: 'fs205', title: 'Moat Analysis', level: 'Intermediate', duration: 22 },
      { id: 'fs301', title: 'Advanced DCF - WACC and Terminal Value', level: 'Advanced', duration: 34, labModel: 'dcf' },
      { id: 'fs302', title: 'Reverse DCF', level: 'Advanced', duration: 30, labModel: 'reverse' },
      { id: 'fs303', title: 'Forensic Accounting Red Flags', level: 'Advanced', duration: 32 },
      { id: 'fs304', title: 'Sum-of-Parts Valuation', level: 'Advanced', duration: 30 },
    ],
  },
  {
    key: 'technical',
    label: 'Technical',
    emoji: '📈',
    topics: [
      { id: 'ta101', title: 'Candlestick Charts', level: 'Beginner', duration: 16 },
      { id: 'ta102', title: 'Support and Resistance', level: 'Beginner', duration: 16 },
      { id: 'ta103', title: 'Moving Averages', level: 'Beginner', duration: 16 },
      { id: 'ta104', title: 'Volume Analysis', level: 'Beginner', duration: 16 },
      { id: 'ta201', title: 'RSI and Divergence', level: 'Intermediate', duration: 22 },
      { id: 'ta202', title: 'MACD', level: 'Intermediate', duration: 22 },
      { id: 'ta203', title: 'Bollinger Bands', level: 'Intermediate', duration: 20 },
      { id: 'ta204', title: 'Fibonacci Retracement', level: 'Intermediate', duration: 20 },
      { id: 'ta205', title: 'Chart Patterns', level: 'Intermediate', duration: 24 },
      { id: 'ta301', title: 'Elliott Wave Theory', level: 'Advanced', duration: 30 },
      { id: 'ta302', title: 'Wyckoff Method', level: 'Advanced', duration: 30 },
      { id: 'ta303', title: 'Options Flow and Dark Pool Signals', level: 'Advanced', duration: 32 },
    ],
  },
  {
    key: 'macro',
    label: 'Macro',
    emoji: '🌍',
    topics: [
      { id: 'ma101', title: 'Interest Rates and Stock Prices', level: 'Beginner', duration: 18 },
      { id: 'ma102', title: 'CPI, Inflation and the Fed', level: 'Beginner', duration: 18 },
      { id: 'ma103', title: 'GDP Cycles and Sector Rotation', level: 'Beginner', duration: 20 },
      { id: 'ma201', title: 'Yield Curve and Recession Signals', level: 'Intermediate', duration: 24 },
      { id: 'ma202', title: 'RBA Policy and ASX Impact', level: 'Intermediate', duration: 24 },
      { id: 'ma203', title: 'Currency Effects', level: 'Intermediate', duration: 22 },
      { id: 'ma204', title: 'Geopolitics and Commodities', level: 'Intermediate', duration: 22 },
      { id: 'ma301', title: 'Global Capital Flows', level: 'Advanced', duration: 30 },
      { id: 'ma302', title: 'Quantitative Easing vs Tightening', level: 'Advanced', duration: 30 },
      { id: 'ma303', title: 'Top-Down Investment Framework', level: 'Advanced', duration: 32 },
    ],
  },
  {
    key: 'asx',
    label: 'ASX Specific',
    emoji: '🇦🇺',
    topics: [
      { id: 'asx101', title: 'ASX 200 Composition', level: 'Beginner', duration: 16 },
      { id: 'asx102', title: 'Franking Credits and Dividend Imputation', level: 'Intermediate', duration: 24, labModel: 'ddm' },
      { id: 'asx103', title: 'Resources Sector and Commodity Cycles', level: 'Intermediate', duration: 24 },
      { id: 'asx104', title: 'Australian Banks Analysis', level: 'Intermediate', duration: 24 },
      { id: 'asx105', title: 'Australian REITs - Cap Rates and NTA', level: 'Advanced', duration: 28 },
      { id: 'asx106', title: 'ASX Small Cap Opportunities', level: 'Advanced', duration: 26 },
    ],
  },
  {
    key: 'valuation',
    label: 'Valuation Models',
    emoji: '💼',
    topics: [
      { id: 'vm101', title: 'Relative Valuation and Comps', level: 'Intermediate', duration: 24, labModel: 'comps' },
      { id: 'vm102', title: 'Dividend Discount Model', level: 'Intermediate', duration: 24, labModel: 'ddm' },
      { id: 'vm103', title: 'EV/EBITDA - The Institutional Standard', level: 'Intermediate', duration: 22, labModel: 'comps' },
      { id: 'vm104', title: 'PEG Ratio', level: 'Intermediate', duration: 18 },
      { id: 'vm201', title: 'LBO Analysis', level: 'Advanced', duration: 34, labModel: 'lbo' },
      { id: 'vm202', title: 'NAV for Resource Companies', level: 'Advanced', duration: 30 },
      { id: 'vm203', title: 'Building a Full Investment Thesis', level: 'Advanced', duration: 36 },
    ],
  },
]

// ── Expansion pack ─────────────────────────────────────────────────────────
// New topics live in learningExtra.js and are folded in here, before the topic
// index is built, so everything downstream (progress tracking, quizzes, the
// category tabs, TOTAL_TOPICS) picks them up with no further changes.
const _LEVEL_RANK = { Beginner: 0, Intermediate: 1, Advanced: 2 }
for (const cat of CATEGORIES) {
  // Both expansion packs fold in here, before the index is built, so
  // everything downstream — progress tracking, quizzes, category tabs,
  // TOTAL_TOPICS — picks them up with no further changes.
  const extra = [...(EXTRA_TOPICS[cat.key] || []), ...(ANALYST_TOPICS[cat.key] || [])]
  if (!extra.length) continue
  cat.topics = [...cat.topics, ...extra].sort(
    (a, b) => (_LEVEL_RANK[a.level] - _LEVEL_RANK[b.level]) || a.id.localeCompare(b.id)
  )
}

export const TOTAL_TOPICS = CATEGORIES.reduce((n, c) => n + c.topics.length, 0)

const _index = {}
for (const cat of CATEGORIES) {
  for (const t of cat.topics) _index[t.id] = { ...t, category: cat.key, categoryLabel: cat.label }
}

export function getTopicById(id) { return _index[id] || null }
export function getAllTopics() { return Object.values(_index) }
export function getCategoryTopics(key) {
  const c = CATEGORIES.find((x) => x.key === key)
  return c ? c.topics : []
}

// ============================================================================
// PRACTICAL_WORKFLOWS — hands-on "do it in FinSight" guides per topic.
// Each is a step-by-step on WHERE to retrieve the metric in this app and HOW
// to turn it into an analytical judgement. Rendered as a distinct card under
// the written lesson. Topics without an entry simply omit the card.
// ============================================================================
export const PRACTICAL_WORKFLOWS = {
  // ── Fundamentals ──────────────────────────────────────────────────────────
  fs101: `## In FinSight: Find It & Analyse It

**Goal:** read a company's three financial statements end-to-end.

1. Use the **Navbar search** (top of any page) to find a ticker - e.g. type \`AAPL\` (US) or \`CBA\` then pick **CBA.AX** (ASX). Press Enter to open its **Stock Detail** page.
2. Open the **Financials** tab. Use the **Annual / Quarterly** toggle to switch reporting period, and read the three blocks: **Income Statement** (revenue → gross profit → EBIT → net income), **Balance Sheet** (assets, liabilities, equity), **Cash Flow** (operating, investing, financing).
3. Trace the linkage: net income from the income statement should flow into retained earnings (balance sheet) and be the starting line of operating cash flow.

**Analyse it:**
- Read **three years side-by-side** - is revenue growing and is net income growing *with* it (margins stable or rising)?
- Cross-check earnings quality: **operating cash flow should track net income**. If profit rises but cash flow stalls, that is a red flag (see fs303).
- The same figures power the **Valuation tab** and the **Valuation Lab** - what you read here is what those models consume.`,

  fs102: `## In FinSight: Find It & Analyse It

**Goal:** pull P/E, P/B, P/S and judge whether a stock is cheap or expensive.

1. Search a ticker to open **Stock Detail**. The headline **P/E** sits in the stat pills under the price.
2. Open the **Financials** tab → **Key Metrics** for the full set: **P/E, P/B, P/S, EV/EBITDA, PEG**. These are TTM (trailing twelve months).
3. To compare against peers, open the **Overview** tab and use the **Peers** list, or run the **Screener** (Value preset) to see where the multiple sits across a universe.

**Analyse it:**
- A multiple is only meaningful **relative to** (a) the company's own history, (b) sector peers, and (c) its growth rate. A P/E of 30 is cheap for a 40%-grower and expensive for a no-grower.
- Use **P/B for banks and asset-heavy businesses**, **P/S for unprofitable growth**, **P/E for stable earners**.
- High P/E + slowing growth = priced for perfection. Cross-check with the **PEG** lesson (vm104) before concluding "expensive."`,

  fs103: `## In FinSight: Find It & Analyse It

**Goal:** check EPS and whether earnings are real or accounting-driven.

1. Open **Stock Detail → Financials**. Read **EPS** and **Net Income** across the period toggle.
2. Compare **net income** to **operating cash flow** (same tab). Persistent gaps where profit > cash flow signal aggressive accruals.
3. Check the **Dividends** tab and **share count** trend - falling shares lift EPS even with flat profit (buybacks).

**Analyse it:**
- Rising EPS driven by **buybacks** (shrinking denominator) is lower-quality than EPS driven by growing net income.
- Watch for one-off items inflating a single quarter - read three to four periods, not one.
- Tie this to fs303 (forensic red flags): diverging cash flow is the single most reliable earnings-quality warning.`,

  fs201: `## In FinSight: Find It & Analyse It

**Goal:** build a DCF and read a fair value.

1. Open **Stock Detail → Valuation** tab to see the app's pre-computed **DCF Fair Value** and implied upside/downside vs price.
2. For a hands-on model, go to **Learning → Valuation Lab**, type the ticker, click **Load** - it pre-populates revenue, margins, and net debt from live data.
3. Select the **DCF** model. Adjust the **revenue growth**, **EBIT margin**, **WACC**, and **terminal growth** inputs and watch Fair Value recompute live. Read the **FCF projection table** and **sensitivity grid**.

**Analyse it:**
- Fair value is only as good as your assumptions - change growth by 2% and watch how far the answer moves. That swing *is* the uncertainty.
- Use the **sensitivity table** (WACC × terminal growth) to get a *range*, not a single number.
- Compare the DCF output to the **analyst Median Price Target** on the same stock (Overview consensus) as a sanity check.`,

  fs202: `## In FinSight: Find It & Analyse It

**Goal:** measure capital efficiency with ROIC, ROE, ROA.

1. Open **Stock Detail → Financials → Key Metrics**. Read **ROE, ROA, ROIC** (TTM, already computed from live FMP data).
2. Decompose: high **ROE** with low **ROA** means the company uses a lot of **leverage** (check debt on the Balance Sheet block) - common for banks.
3. Compare **ROIC vs WACC** - pull WACC from the **Valuation Lab DCF** for the same ticker.

**Analyse it:**
- **ROIC > WACC** means the company creates value as it grows; **ROIC < WACC** means growth destroys value.
- A durable ROIC above ~15% sustained over years is a hallmark of a wide-moat business (see fs205).
- Apple's famously high ROE (>100%) comes from buybacks shrinking equity - always check *why* a ratio is high, not just that it is.`,

  fs203: `## In FinSight: Find It & Analyse It

**Goal:** analyse free cash flow.

1. Open **Stock Detail → Financials → Cash Flow**. Read **Operating Cash Flow** and **Capital Expenditure**. **FCF = Operating Cash Flow − CapEx**.
2. The **Valuation tab** and **Valuation Lab DCF** both display FCF - confirm the figure matches what you computed.
3. Look at the FCF trend across the period toggle, and the **FCF margin** (FCF ÷ revenue) in Key Metrics where available.

**Analyse it:**
- **FCF, not net income, is what a DCF discounts** - it is the cash actually available to investors.
- A business with net income but negative FCF is plowing everything into CapEx - fine for a growth phase, dangerous if it never converts.
- Stable, growing FCF margin = pricing power and capital discipline.`,

  fs204: `## In FinSight: Find It & Analyse It

**Goal:** use Enterprise Value and EV multiples.

1. Open **Stock Detail → Financials → Key Metrics**. Read **EV/EBITDA** and **EV/Sales** (EV already accounts for net debt, unlike P/E).
2. Confirm the components on the **Balance Sheet** block: **EV = Market Cap + Total Debt − Cash**.
3. Compare EV/EBITDA against peers via the **Overview → Peers** list or the **Comps** model in the **Valuation Lab**.

**Analyse it:**
- **EV multiples are capital-structure-neutral**, so they compare a debt-heavy and a debt-free company fairly - that is why M&A and PE use them.
- Prefer **EV/EBITDA over P/E** when comparing companies with very different leverage.
- Pair with vm103 (EV/EBITDA deep-dive) and the Comps model to triangulate a value range.`,

  fs301: `## In FinSight: Find It & Analyse It

**Goal:** drive WACC and terminal value in an advanced DCF.

1. **Learning → Valuation Lab → DCF**, load your ticker. Focus on the **WACC** and **terminal growth** inputs.
2. Adjust WACC and watch the present value of the terminal value - note how **most of the DCF value typically sits in the terminal**.
3. Use the **sensitivity table** (WACC × terminal growth) to bound the answer.

**Analyse it:**
- Terminal growth should never exceed long-run GDP (~2–3%) - anything higher implies the company eventually becomes the whole economy.
- A 1% WACC change can move fair value 15–25%. This is why a DCF gives a **range**, not a point.
- Cross-check the implied terminal multiple looks sane vs the EV/EBITDA peers in the Comps model.`,

  fs302: `## In FinSight: Find It & Analyse It

**Goal:** run a reverse DCF to see what the market is pricing in.

1. **Learning → Valuation Lab → Reverse DCF**, load the ticker. Instead of outputting a price, it solves for the **growth rate implied by the current price**.
2. Read the **implied growth** figure the model backs out.
3. Compare it to the company's **historical revenue/EPS growth** (Stock Detail → Financials) and analyst expectations.

**Analyse it:**
- If the market implies 15% growth but the firm has only ever done 6%, the stock is **priced for an outcome it has never delivered** - a sell/avoid signal.
- If implied growth is *below* the firm's durable rate, the market may be too pessimistic - a potential opportunity.
- Reverse DCF reframes valuation as "what must I believe?" - the most honest way to use the Lab.`,

  // ── Technical ─────────────────────────────────────────────────────────────
  ta102: `## In FinSight: Find It & Analyse It

**Goal:** identify support and resistance.

1. Open **Stock Detail → Technicals** tab. The app computes **Support / Resistance** levels and shows them.
2. Cross-reference with the **price chart** on the Overview tab (TradingView-style with volume) - eyeball where price has repeatedly bounced or stalled.
3. Note the current price relative to those levels.

**Analyse it:**
- **Support** is a price floor where buyers historically step in; **resistance** is a ceiling where sellers appear.
- A **break above resistance on high volume** (check the volume bars) often flips it into new support - a bullish signal.
- Use levels to frame entries/exits and stop-losses, not as guarantees.`,

  ta103: `## In FinSight: Find It & Analyse It

**Goal:** read moving averages and trend.

1. **Stock Detail → Technicals**. Read the **SMA 20 / 50 / 200** values the app computes.
2. Compare price to each: above all three = uptrend; below all three = downtrend.
3. Watch the relationship between the 50 and 200 (golden/death cross context).

**Analyse it:**
- **Price > 200-day SMA** is the classic definition of a long-term uptrend - many funds won't buy below it.
- A **50-day crossing above the 200-day (golden cross)** is a momentum confirmation; the reverse (death cross) warns of trend change.
- Combine with RSI (ta201) - trend tells you direction, RSI tells you if it is overextended.`,

  ta201: `## In FinSight: Find It & Analyse It

**Goal:** use RSI and spot divergence.

1. **Stock Detail** - the **RSI 14 gauge** is shown directly on the page (semicircle), plus on the Technicals tab.
2. Read the value: **>70 overbought**, **<30 oversold**, ~50 neutral.
3. Compare RSI direction to price direction over recent weeks (use the price chart).

**Analyse it:**
- **Bullish divergence:** price makes a lower low but RSI makes a higher low - momentum is fading on the downside, a potential reversal up.
- **Bearish divergence:** price higher high, RSI lower high - the rally is running out of steam.
- RSI is a *condition*, not a trigger - overbought can stay overbought in a strong trend. Confirm with trend (ta103) and support/resistance (ta102).`,

  // ── Macro ─────────────────────────────────────────────────────────────────
  ma201: `## In FinSight: Find It & Analyse It

**Goal:** read the yield curve for recession signals.

1. Open the **Sentiment** page → **US** tab. The **FRED yield curve** is charted (2Y → 30Y) with the **2Y–10Y spread** called out.
2. Read whether the spread is **positive (normal)**, near zero **(flat)**, or **negative (inverted)**.
3. Note the **Fed Funds Rate** and the dynamically-written macro summary below the chart.

**Analyse it:**
- An **inverted 2Y–10Y curve** has preceded most US recessions - it signals the market expects rate cuts ahead.
- A **flat** curve (small spread) is late-cycle caution; a **steep** curve is early-recovery optimism.
- Use this top-down read to set risk appetite *before* picking stocks (ties to ma303 top-down framework).`,

  // ── ASX ───────────────────────────────────────────────────────────────────
  asx102: `## In FinSight: Find It & Analyse It

**Goal:** value a franked Australian dividend.

1. Open an ASX payer - search \`CBA\` → **CBA.AX** → **Stock Detail → Dividends** tab for the cash yield and history.
2. Go to **Learning → Valuation Lab → DDM** and load the .AX ticker - the model includes a **franking adjustment** for Australian stocks.
3. Gross up the dividend: \`grossed-up = cash dividend / (1 − 0.30)\` for a fully-franked payout.

**Analyse it:**
- A 4% **fully-franked** yield is worth ~5.7% grossed-up to an investor who can use the credits - compare franked stocks on **grossed-up** yield, never cash yield.
- The benefit depends on the investor's tax rate; foreign investors generally cannot use franking.
- This is why banks and miners are core income holdings on the ASX.`,

  asx104: `## In FinSight: Find It & Analyse It

**Goal:** analyse an Australian bank.

1. Search \`NAB\`/\`WBC\`/\`ANZ\`/\`CBA\` → open **.AX** ticker → **Stock Detail**.
2. On **Financials → Key Metrics**, lead with **P/B and ROE** (banks are valued on book value, not P/E primarily). Check **dividend yield** on the Dividends tab.
3. Pull the macro backdrop from **Sentiment → Australia** (RBA cash rate) - rates drive bank net interest margins.

**Analyse it:**
- Bank value = **ROE relative to cost of equity**, capitalised onto **book value (P/B)**. ROE > cost of equity justifies P/B > 1.
- Rising RBA rates can lift margins but also raise bad-debt risk - read both.
- Always assess franking (asx102) - bank dividends are typically fully franked.`,

  // ── Valuation Models ──────────────────────────────────────────────────────
  vm101: `## In FinSight: Find It & Analyse It

**Goal:** value by comparables (comps).

1. **Learning → Valuation Lab → Comps**. Load your ticker.
2. The model applies **peer multiples (EV/EBITDA, P/E)** to the target's metrics to derive an implied value range.
3. Sanity-check the peer set against **Stock Detail → Overview → Peers**.

**Analyse it:**
- Comps answer "what is the market paying for *similar* businesses right now?" - a relative, market-anchored value vs the DCF's intrinsic value.
- Garbage peers = garbage output: peers must match on sector, growth, and margins.
- Use comps and DCF together - when both agree, conviction is high; when they diverge, dig into why.`,

  vm102: `## In FinSight: Find It & Analyse It

**Goal:** value a stable dividend payer with the DDM.

1. **Learning → Valuation Lab → DDM**. Load a mature, dividend-paying ticker (utilities, banks, staples).
2. Set the **dividend**, **growth rate**, and **required return (cost of equity)**. For .AX stocks the franking adjustment applies.
3. Read the Gordon-growth fair value: \`value = D1 / (ke − g)\`.

**Analyse it:**
- DDM only works for **stable, predictable dividend payers** - it breaks for non-payers and high-growth names.
- The output is hypersensitive to \`(ke − g)\` - when growth nears the discount rate, value explodes; keep g well below ke.
- Best used as a cross-check on income stocks alongside grossed-up yield.`,

  vm103: `## In FinSight: Find It & Analyse It

**Goal:** apply EV/EBITDA the way institutions do.

1. **Stock Detail → Financials → Key Metrics** for the live **EV/EBITDA**.
2. **Learning → Valuation Lab → Comps** to apply a peer EV/EBITDA to the target and read implied EV → equity value.
3. Compare across peers with different leverage.

**Analyse it:**
- EV/EBITDA is the **institutional default** because it is capital-structure- and (largely) accounting-policy-neutral.
- Watch sector norms: software trades at high multiples, miners/banks low - never compare across unlike sectors.
- Subtract net debt from implied EV to get to **equity value per share** - the number you actually compare to price.`,

  vm104: `## In FinSight: Find It & Analyse It

**Goal:** put a P/E in growth context with PEG.

1. **Stock Detail → Financials → Key Metrics** - read **P/E** and the **PEG** (PEG = P/E ÷ growth rate).
2. Confirm the growth input against historical EPS growth (Financials period toggle) and analyst expectations.

**Analyse it:**
- **PEG ≈ 1** is the rough "fairly priced for growth" benchmark; **<1** may be cheap, **>2** expensive - *if* the growth is real.
- PEG's weakness is the growth estimate - garbage growth in, garbage PEG out. Stress-test it.
- Use PEG to defend or challenge a "high P/E" conclusion from fs102.`,

  vm201: `## In FinSight: Find It & Analyse It

**Goal:** run a private-equity-style LBO.

1. **Learning → Valuation Lab → LBO**. Load a stable, cash-generative target.
2. Set **entry multiple, leverage (debt %), hold period, and exit multiple**. The model computes **IRR and MOIC** live.
3. Flex the leverage and exit assumptions to see how returns respond.

**Analyse it:**
- LBO returns come from three levers: **debt paydown, EBITDA growth, and multiple expansion** - identify which one your deal relies on.
- High leverage amplifies returns *and* risk - best for stable cash flows, dangerous for cyclicals.
- A deal that only works on multiple expansion (selling higher than you bought) is a bet on the market, not the business.`,

  vm203: `## In FinSight: Find It & Analyse It

**Goal:** assemble a full investment thesis end-to-end in FinSight.

1. **Macro top-down:** start at **Sentiment** (US yield curve, Fed) and **Dashboard** (Fear & Greed, market status) to set risk appetite.
2. **Screen:** use the **Screener** preset (Value/Growth/etc.) to surface candidates, add the best to your **Watchlist**.
3. **Fundamentals:** for each name, work **Stock Detail → Financials** (growth, margins, ROIC, FCF) and **Overview** (moat, peers).
4. **Value it:** triangulate with the **Valuation Lab** - DCF (intrinsic), Comps (relative), and Reverse DCF (what's priced in).
5. **Sense-check:** compare your value to the **analyst Median Price Target** and the **Technicals** for timing.

**Analyse it:**
- A complete thesis states: the business quality, the valuation (with a range, not a point), the catalyst, and the key risk that would prove you wrong.
- When macro, fundamentals, and valuation all align, conviction is high. When they conflict, size smaller and define what would change your mind.`,
}

// ============================================================================
// LESSON_CONTENT — Markdown-ish strings rendered by Learning.jsx.
// Conventions: ## Heading · **bold** · 1. numbered · - bullet · `formula`
// ============================================================================
export const LESSON_CONTENT = {
  asx101: `## Inside the ASX 200: A Concentrated Index

The S&P/ASX 200 is Australia's benchmark index, covering the 200 largest listed companies (roughly 80% of the market's value). But its *composition* is unusual and crucial to understand: it is one of the most concentrated developed-market indices, dominated by two sectors.

## The Two Pillars: Financials and Materials

Together, **financials** (mostly the big four banks: CBA, NAB, WBC, ANZ, plus Macquarie) and **materials** (the miners: BHP, RIO, FMG) make up roughly **half the index**. This is wildly different from the US, where technology dominates. The practical consequence: the ASX 200's fortunes are tied to **interest rates and credit** (via banks) and **commodity prices and China** (via miners), far more than to global tech.

## What's Missing

The ASX is **light on technology and healthcare** relative to global indices. There is no Australian equivalent of the US mega-cap tech giants. CSL (healthcare/biotech) is a standout exception and one of the few global-scale Australian companies. This means an ASX-only portfolio is structurally under-exposed to the secular growth themes that have driven global markets - a key reason many Australian investors hold international equities too.

## The Yield Tilt

Australian companies pay high dividends, partly driven by the franking-credit system (asx102). The ASX is a **high-yield, value-tilted** market - attractive for income but historically lower-growth than tech-heavy peers.

## Worked Example

If iron ore falls 20% and the RBA hikes rates, an ASX-200 index investor feels both blows: miners drop on the commodity, and banks/REITs wobble on rates. Because these two sectors are half the index, there is little to offset them - illustrating the concentration risk.

## Benchmarks

The ASX 200 (^AXJO) is the headline; watch sector sub-indices for financials (^AXFJ) and materials (^AXMJ), which FinSight tracks on the **Dashboard** in ASX mode.

## Common Mistakes

Assuming the ASX behaves like the S&P 500 (it does not - far less tech); ignoring the banks-and-miners concentration; overlooking the lack of growth exposure.

## How a PM Uses It

An Australian PM manages this concentration deliberately - often supplementing ASX holdings with global tech and healthcare for diversification, and positioning around the two dominant drivers (rates for banks, commodities for miners) that move the index.`,

  asx102: `## Franking Credits: Australia's Unique Dividend Advantage

Franking credits (dividend imputation) are one of the most important and distinctive features of Australian investing. They can make an Australian dividend worth substantially more than its headline yield suggests - and they reshape how income investors value ASX stocks. Model the impact in the **DDM model in the Valuation Lab** (which has a franking adjustment for .AX stocks).

## The Double-Taxation Problem It Solves

In most countries, company profits are taxed twice: once at the corporate level (company tax), then again when paid to shareholders as dividends (personal income tax). Australia's **dividend imputation system** removes this double-taxation. When a company pays tax on its profits, it attaches a **franking credit** to the dividend representing the tax already paid.

## How It Works

A **fully franked** dividend comes with credits for the full 30% corporate tax. The shareholder "grosses up" the dividend (adds back the credit), declares the gross amount as income, and then claims the franking credit against their personal tax bill. The grossing-up formula: \`Grossed-up dividend = cash dividend / (1 − corporate tax rate)\` for a fully franked payout.

## Worked Example

A company pays a **$0.70 fully franked dividend**. The franking credit is \`0.70 × (0.30 / 0.70) = $0.30\`. The **grossed-up dividend is $1.00**. A shareholder on a 0% effective tax rate (e.g., some retirees in pension phase) can claim the full $0.30 credit as a *cash refund* - turning a 4% cash yield into an effective ~5.7% pre-tax yield. This is why franked yield is so prized by Australian income investors.

## Why It Matters for Valuation

For Australian-resident investors, two stocks with identical cash yields are *not* equivalent if one is fully franked and the other unfranked. The franked stock delivers materially higher after-tax income. This is why the big banks and miners - reliable, fully-franked payers - are core holdings for income portfolios.

## Benchmarks

Franking ranges from 0% (unfranked) to 100% (fully franked). The corporate tax rate is 30% (25% for some small companies). Check the franking percentage in dividend disclosures.

## Common Mistakes

Comparing franked and unfranked yields directly; forgetting that the benefit depends on the investor's tax rate; ignoring that foreign investors generally cannot use franking credits.

## How a PM Uses It

An income-focused Australian PM evaluates stocks on **grossed-up (franked) yield**, not just cash yield - and tilts toward fully-franked payers for tax-advantaged income, especially for retiree and SMSF mandates.`,

  asx103: `## The Resources Sector: Riding the Commodity Cycle

Mining and energy are the engine room of the ASX. Companies like BHP, RIO, FMG, WDS, and STO are leveraged bets on commodity prices - and understanding the **commodity cycle** is the key to analysing them, because their earnings swing violently with prices they do not control.

## Price Takers, Not Price Makers

A miner cannot set the price of iron ore or oil - it is set by global supply and demand. This makes resource companies **price takers**: their revenue is largely a function of the commodity price times volume. Costs are relatively fixed, so changes in the commodity price flow almost directly to the bottom line - enormous **operating leverage**. A 20% rise in iron ore can more than double a low-cost miner's profit.

## The Cost Curve Is Everything

The single most important concept in resource analysis is the **cost curve** - the ranking of global producers from cheapest to most expensive. The lowest-cost producers (BHP and RIO in iron ore) survive and stay profitable even when prices crash and high-cost rivals go bust. **Position on the cost curve** determines who wins through the cycle. Always ask: where does this miner sit, and what is its all-in sustaining cost?

## The Cycle and Capital Discipline

Commodity cycles are driven by the lag between price signals and supply response: high prices trigger investment in new mines, which take years to build, eventually creating oversupply that crashes prices, which halts investment, eventually creating shortage again. The best miners show **capital discipline** - returning cash to shareholders at the top rather than over-investing into the inevitable downturn.

## Worked Example

Iron ore rises from $90 to $120 a tonne. A low-cost producer with $40/tonne costs sees its margin jump from $50 to $80 - a 60% margin increase on a 33% price move. That operating leverage is why miners soar in commodity upcycles and why China's demand (asx104, ma204) dominates their fate.

## Benchmarks

Track the underlying commodity (iron ore, oil, copper, gold), the company's position on the cost curve, and its net debt (balance-sheet strength to survive downturns).

## Common Mistakes

Valuing a miner on a single year's peak earnings (the cycle will turn); ignoring the cost curve; chasing high-cost producers at the top of the cycle; forgetting that a low P/E at peak earnings is a trap.

## How a PM Uses It

A resources PM times exposure to the commodity cycle, favours low-cost producers with strong balance sheets that survive downturns, and rewards capital discipline - buying miners when pessimism and prices are low, not at euphoric peaks.`,

  asx104: `## Analysing Australian Banks: The Big Four

The big four banks - CBA, NAB, WBC, ANZ - are the heart of the ASX, together a quarter of the index and a core holding in almost every Australian portfolio. Banks are analysed very differently from industrial companies; their balance sheet *is* the business.

## The Core Drivers

Three metrics define a bank's earnings:
1. **Net Interest Margin (NIM)** - the spread between what the bank earns on loans and pays on deposits. \`NIM = (interest income − interest expense) / interest-earning assets\`. It is the bank's core profitability lever. Rising rates can widen NIM (good), but intense competition and rising deposit costs can compress it.
2. **Credit growth** - how fast the loan book (mostly mortgages in Australia) is expanding. More lending means more income, but chasing growth can mean lower-quality loans.
3. **Bad and doubtful debts (loan losses)** - the provisions for loans that go sour. In good times these are low (flattering profits); in recessions they spike and crush earnings.

## The Capital and Quality Lens

Banks are valued on **price-to-book** and **ROE** (not EV/EBITDA - irrelevant for banks). Key ratios: the **CET1 capital ratio** (a regulatory buffer against losses - higher is safer), and the **cost-to-income ratio** (efficiency - lower is better). A well-run Australian bank targets a high-teens ROE and a cost-to-income ratio in the 40s.

## The Housing Connection

Australian banks are, in effect, leveraged plays on the **housing market** - mortgages dominate their loan books. House prices, household debt, and unemployment drive their loan-loss experience. A housing downturn with rising unemployment is the key tail risk for the sector.

## Worked Example

A bank reports NIM expanding from 1.85% to 1.95% as rate hikes pass through faster to loans than deposits. With a $900B loan book, that 10bps lift adds roughly $900M of annual income - a powerful earnings driver from a tiny-looking margin change. But if unemployment rises and bad debts climb, that benefit can reverse.

## Benchmarks

NIM ~1.8-2.0%, ROE mid-to-high teens, CET1 above ~11%, cost-to-income in the 40s. Compare the four banks on these.

## Common Mistakes

Ignoring loan-loss provisions (the swing factor in a downturn); valuing banks on a P/E like an industrial; forgetting their leverage to housing and unemployment.

## How a PM Uses It

A PM analyses banks on NIM trajectory, credit quality, capital strength, and the housing/rate outlook - favouring the best-capitalised, most efficient banks early in a rate-hiking cycle and turning cautious when unemployment and bad debts threaten to rise.`,

  asx105: `## Australian REITs: Valuing Property on the ASX

Real Estate Investment Trusts (A-REITs) like Goservel-style landlords - GMG, SCG, DXS, GPT, MGR - own portfolios of commercial property (industrial, retail, office) and pass rental income to investors. They are valued with property-specific tools that every ASX income investor should know.

## The Two Master Concepts: Cap Rates and NTA

1. **Capitalisation rate (cap rate)** - the property world's yield: \`Cap rate = annual net rental income / property value\`. A property earning $10M on a $200M value has a 5% cap rate. Crucially, cap rates move *inversely* to values: when cap rates rise (often because interest rates rise), property values fall, and vice versa. Cap-rate expansion is the single biggest driver of REIT value moves.
2. **Net Tangible Assets (NTA)** - the per-share value of the REIT's properties minus its debt. REITs are valued relative to NTA: trading **above NTA** signals the market expects rental/value growth; **below NTA** signals scepticism or distress. The premium/discount to NTA is the headline valuation metric.

## Why REITs Are So Rate-Sensitive

REITs are hit by rates two ways: rising rates **lift their borrowing costs** (they are leveraged), and they push **cap rates up** (devaluing the properties). On top of that, a REIT's distribution yield must compete with bond yields - when bonds yield more, REIT yields must rise (prices fall) to stay attractive. This triple sensitivity makes A-REITs one of the most rate-exposed corners of the ASX (see ma202).

## Worked Example

An office REIT trades at $3.00 against an NTA of $4.00 - a 25% discount. The market is signalling it expects cap rates to keep rising (office values to keep falling) amid a work-from-home structural shift. The discount is a judgement, not a free lunch - the NTA itself may be marked down further.

## Benchmarks

Cap rates vary by property type (industrial tightest, office widest, especially post-COVID). Watch the **premium/discount to NTA**, gearing (debt/assets, ideally under ~35%), and weighted average lease expiry (WALE - longer is more secure).

## Common Mistakes

Buying a big NTA discount without asking *why* (the NTA may be stale); ignoring gearing and refinancing risk; treating all property types alike (industrial and office have diverged sharply).

## How a PM Uses It

A REIT specialist focuses on cap-rate direction, the NTA premium/discount, balance-sheet gearing, and the rate outlook - favouring well-let industrial REITs with low gearing in a rising-rate world and avoiding highly-geared office exposure.`,

  asx106: `## ASX Small Caps: Where Inefficiency Lives

Beyond the ASX 200 lies a vast field of small and micro-cap companies - the **ASX Small Ordinaries** and below. This is where the market is least efficient, the research coverage thinnest, and the potential rewards (and risks) greatest. It is the hunting ground for active investors seeking an edge.

## Why Small Caps Offer Opportunity

Large caps like CBA are followed by dozens of analysts; their prices reflect all known information. Small caps are often covered by **one analyst or none**. This information vacuum means quality companies can be mispriced for years before the market notices. The classic small-cap thesis: find a high-quality, growing business *before* it gets big enough to attract institutional attention and analyst coverage - then ride the re-rating as it does.

## The Risks Are Real

Small caps carry distinct dangers that demand respect:
- **Liquidity risk** - thin trading volumes mean you can move the price yourself, and exiting in a downturn can be brutal.
- **Capital-raising dilution** - unprofitable small caps frequently issue new shares to fund themselves, diluting existing holders.
- **Single-point-of-failure risk** - one product, one customer, one key person; less diversified and more fragile.
- **Governance and disclosure** - generally weaker than large caps.

## The Quality Filter

Because the failure rate is high, discipline is everything. Favour small caps that are **already profitable or clearly self-funding**, have a **net-cash balance sheet** (no reliance on dilutive raises), a **founder with skin in the game**, and a genuine, growing niche. Avoid the perennial promise-and-raise "story stocks" that never make money.

## Worked Example

A profitable niche software company at a $200M market cap, covered by no major broker, grows revenue 30% a year with net cash and 40% insider ownership. As it scales past $500M, institutions and analysts begin coverage, and the multiple re-rates from 15× to 25× earnings - a powerful combination of earnings growth *and* multiple expansion that large caps rarely offer.

## Benchmarks

Watch liquidity (average daily value traded), the cash runway (for unprofitable names), insider ownership, and the path to profitability. FinSight's screener (ASX universe) can surface candidates by market cap and quality filters.

## Common Mistakes

Chasing illiquid "story" stocks with no earnings; ignoring dilution risk; oversizing positions you cannot exit; confusing volatility with opportunity.

## How a PM Uses It

A small-cap PM accepts higher risk for higher return, sizing positions carefully for liquidity, demanding quality and self-funding, and aiming to own great businesses *before* the crowd - the purest form of the active investing edge.`,

  vm101: `## Relative Valuation: Pricing by Comparison

Relative valuation (comps) values a company by comparing its multiples to similar businesses, rather than building a cash-flow model from scratch. It is the most widely used valuation method on Wall Street because it is fast, market-grounded, and intuitive. Build a live comps table in the **Comps model in the Valuation Lab**.

## The Core Logic

If similar companies trade at an average of 15× earnings, and your subject is a comparable business, it "should" trade near 15× too. Relative valuation doesn't ask "what is this worth in absolute terms?" but "what is the market paying for similar businesses, and is this one cheap or expensive against that?"

## Choosing the Right Peers

This is where comps live or die. Good peers share: the **same industry**, similar **business model and margins**, comparable **growth rates**, and similar **size and geography**. A common mistake is sloppy peer selection - comparing a fast-growing premium operator to slow, low-margin rivals will mislead. The tighter and more genuinely comparable the peer set, the more reliable the conclusion.

## The Workflow

1. Select 5-8 genuine peers.
2. Pull each peer's key multiples (EV/EBITDA, P/E, P/B, EV/Sales).
3. Compute the **median** (more robust than the mean, which outliers distort).
4. Apply the peer median multiple to the subject's metric to derive an **implied value**.
5. Compare implied value to the current price.

## Worked Example

Your subject earns $500M EBITDA. Its five closest peers trade at a **median 10× EV/EBITDA**. Implied EV = \`500M × 10 = $5.0B\`. Subtract net debt of $1B → equity value $4.0B. If the subject trades at $3.5B, it looks ~13% cheap versus peers - a starting point for deeper work.

## Why Use Median, Not Mean

One peer trading at an extreme multiple (say a takeover target at 25×) would drag the mean upward and distort the read. The **median** ignores outliers and better represents the typical peer.

## Benchmarks

The "right" multiple depends on growth and quality - faster, higher-return businesses deserve premium multiples. Comps tell you the *relative* picture; pair them with a DCF for the absolute view.

## Common Mistakes

Poor peer selection; using the mean instead of the median; ignoring quality/growth differences that justify a premium or discount; treating "cheap vs peers" as a buy signal when the whole sector is overvalued.

## How a PM Uses It

Comps are the analyst's first cut and the banker's go-to for M&A. A PM uses them to triage ideas quickly and to sanity-check a DCF - if your DCF says a stock is worth double its peers' multiple, one of them is wrong.`,

  vm102: `## The Dividend Discount Model: Valuing the Cash You Receive

The Dividend Discount Model (DDM) values a stock as the present value of all its future dividends. It is the purest application of the idea that a share is worth the cash it returns to you - and it shines for stable, dividend-paying businesses like utilities, banks, and mature blue chips. Run all three variants in the **DDM model in the Valuation Lab**.

## The Gordon Growth Model

The simplest DDM assumes dividends grow at a constant rate forever: \`P = D₁ / (Ke − g)\`, where D₁ is next year's dividend, Ke is the required return (cost of equity), and g is the perpetual growth rate. It is elegant but fragile - the result is extremely sensitive to the tiny gap between Ke and g.

The critical constraint: **g must be less than Ke**. If growth equals or exceeds the required return, the formula produces an infinite or negative value - economic nonsense. No company grows faster than its cost of equity forever.

## Worked Example

A stock pays a $2.00 dividend, expected to grow 4% forever, with a 9% required return. \`D₁ = 2.00 × 1.04 = $2.08\`. \`P = 2.08 / (0.09 − 0.04) = $41.60\`. Notice the sensitivity: if g were 5% instead of 4%, the value jumps to $52.50 - a 26% swing from a 1-point change. This fragility is the model's main weakness.

## Multi-Stage Models

Real companies don't grow at one rate forever. The **two-stage DDM** uses a high growth rate for an explicit period, then a stable perpetual rate. The **three-stage DDM** adds a transition period where growth declines gradually - more realistic for a maturing company. These reduce the single-rate fragility by separating near-term growth from terminal assumptions.

## Estimating the Inputs

- **Ke** comes from CAPM: \`Rf + β × ERP\`.
- **g** can be estimated from the **sustainable growth rate**: \`g = ROE × (1 − payout ratio)\` - the growth a company can fund from retained earnings.

## The Australian Twist

For ASX stocks, remember **franking credits** (asx102) - the effective yield to an Australian investor is the grossed-up dividend, which materially raises the value of franked payers. The Lab's DDM adjusts for franking on .AX stocks.

## Common Mistakes

Setting g ≥ Ke; using the Gordon model for volatile or non-dividend payers; ignoring franking for ASX stocks; trusting a precise output from such sensitive inputs.

## How a PM Uses It

DDM is the natural tool for income and dividend-focused mandates - valuing banks, utilities, REITs, and mature payers, and identifying where a sustainable, growing, (franked) dividend stream is mispriced.`,

  vm103: `## EV/EBITDA: The Institutional Standard

If there is one multiple that professional investors and dealmakers reach for first, it is **EV/EBITDA**. It is the institutional standard because it compares the operating value of businesses cleanly - independent of how they are financed or taxed. Use it in the **Comps model in the Valuation Lab**.

## Why It Beats P/E

P/E has two flaws for comparison: it is distorted by **leverage** (debt changes net income via interest) and by **tax differences**. Two identical businesses with different debt loads show different P/Es but similar operating economics. EV/EBITDA fixes both:
- **Enterprise Value** (Market Cap + Debt − Cash) captures the whole capital structure, so leverage is neutralised.
- **EBITDA** (Earnings Before Interest, Tax, Depreciation, Amortisation) is a pre-financing, pre-tax proxy for operating cash generation.

The result is a **capital-structure-neutral, tax-neutral** measure of how the market values a dollar of operating earnings. This is exactly why M&A bankers and private equity anchor on it - an acquirer assumes the debt and changes the tax situation, so they care about the operating value.

## Worked Example

Two companies each generate $200M EBITDA. Company A is debt-free; Company B carries $500M of debt. On P/E, B looks "cheaper" because interest expense lowers its net income and price. But on EV/EBITDA, the debt is added into EV, revealing they are valued similarly on operations. EV/EBITDA sees through the financing illusion that fools P/E.

## Typical Ranges

EV/EBITDA varies by sector and growth: ~6-8× for mature, cyclical, or capital-intensive businesses; 10-14× for steady quality compounders; 15-25×+ for high-growth software. A multiple only means something against peers and the company's own history.

## The Important Caveat

EBITDA **ignores capital intensity**. It adds back depreciation, which for a capital-heavy business (telecoms, miners, manufacturers) represents a real, recurring cost of replacing assets. For these, EBITDA flatters reality - EV/EBIT or EV/FCF is more honest. Charlie Munger famously distrusted EBITDA for exactly this reason.

## Benchmarks

Compare EV/EBITDA to peers and to the company's historical range. A multiple well below peers and history, for no fundamental reason, flags potential value.

## Common Mistakes

Comparing EV/EBITDA to P/E directly (different numerator and denominator); using it for capital-intensive firms where depreciation is real; forgetting to net cash into EV; ignoring growth differences that justify multiple gaps.

## How a PM Uses It

EV/EBITDA is the workhorse for relative valuation, M&A, and LBO analysis (vm201). A PM uses it to compare operating value across a peer set fairly and as the entry/exit metric in any buyout math.`,

  vm104: `## The PEG Ratio: Putting Growth in Context

A P/E ratio alone can mislead - a "high" P/E may be perfectly justified by fast growth, and a "low" P/E may be a trap on a shrinking business. The **PEG ratio** addresses this by dividing the P/E by the earnings growth rate, giving a valuation measure that accounts for growth.

## The Formula

\`PEG = P/E ÷ earnings growth rate (in %)\`. A stock with a 30× P/E growing earnings at 30% has a PEG of \`30 / 30 = 1.0\`. The rule of thumb popularised by Peter Lynch: a **PEG around 1.0 suggests fair value**, **below 1.0 may be undervalued** (you are paying little for the growth), and **above 1.0 may be expensive** (paying a premium for the growth on offer).

## Why It Helps

PEG levels the playing field between fast and slow growers. A 40× P/E sounds expensive - but if earnings are compounding at 50%, the PEG is 0.8, arguably cheap *for that growth*. Conversely, a 12× P/E looks cheap until you see earnings are shrinking, giving a meaningless or negative PEG. PEG forces you to ask: **am I paying a reasonable price for the growth I am buying?**

## Worked Example

Company A: 15× P/E, 8% growth → PEG = 1.9 (expensive for its growth). Company B: 28× P/E, 30% growth → PEG = 0.9 (reasonable for its growth). Despite the much higher headline P/E, Company B is arguably the better value once growth is accounted for. PEG flips the naive "low P/E = cheap" conclusion.

## The Significant Caveats

PEG is a useful heuristic, not a precise tool. Its weaknesses:
- **Growth estimates are unreliable** - it depends entirely on forecast growth, which is often wrong, especially for high-flyers.
- **It ignores risk and quality** - a 30%-growth company may be far riskier than an 8% one; PEG treats their growth as equally valuable.
- **It breaks for low or negative growth** - the ratio becomes meaningless.
- **It ignores duration** - it assumes the growth persists.

## Benchmarks

PEG ~1.0 is the fair-value rule of thumb; under 1.0 is potentially attractive; over 2.0 is rich. Use forward growth (next few years), not a single year.

## Common Mistakes

Trusting unreliable growth forecasts; ignoring that high growth often carries high risk; using PEG on cyclical or no-growth companies; treating it as precise rather than a quick screen.

## How a PM Uses It

PEG is a fast triage tool to compare growth stocks on a like-for-like basis - flagging where the market may be underpricing durable growth - but a PM always confirms with a fuller DCF and a hard look at whether the forecast growth is actually achievable.`,

  vm201: `## LBO Analysis: Thinking Like a Private Equity Buyer

A Leveraged Buyout values a company through the eyes of a private equity firm: what is the most it could pay, funded largely with debt, and still earn its target return? LBO analysis reveals a **floor valuation** - below which a PE firm could profitably buy the whole company - and teaches you to think about debt, cash generation, and returns. Build a full model in the **LBO model in the Valuation Lab**.

## The Core Idea

A PE firm buys a company using a small slice of its own equity and a large slice of **debt** (the leverage). Over a 3-7 year hold, the company's cash flow **pays down that debt**. At exit, the firm sells the company; because debt has been reduced, more of the sale value accrues to equity. The combination of debt paydown, EBITDA growth, and any multiple expansion drives the return. It is a bet that cash flow can service and repay borrowed money.

## The Two Return Metrics

1. **MOIC (Multiple of Invested Capital)** = exit equity / entry equity. A 2.5× MOIC means the sponsor's money grew 2.5 times.
2. **IRR (Internal Rate of Return)** - the annualised return, accounting for the holding period. The PE industry hurdle is typically **20-25% IRR**.

## The Three Levers of Return

LBO returns come from: (1) **debt paydown** (cash flow reducing debt, transferring value to equity); (2) **EBITDA growth** (revenue growth and margin improvement); (3) **multiple expansion** (selling at a higher EV/EBITDA than you bought - the least reliable lever). The best deals don't rely on multiple expansion.

## Worked Example

A firm buys a company at 10× EBITDA ($1.0B EV) with $600M debt and $400M equity. Over five years, cash flow repays $300M of debt and EBITDA grows 25%. At exit at 11× on the higher EBITDA, the equity is worth ~$1.1B. MOIC = 1,100/400 = **2.75×**, an IRR around 22% - a viable PE deal. The Lab computes this live with an entry × exit sensitivity grid.

## Why Leverage Magnifies Returns (and Risk)

Debt amplifies equity returns - but also losses. If cash flow disappoints and the company can't service its debt, the equity can be wiped out. **Leverage above ~7× EBITDA** is aggressive and raises default risk; the Lab flags it.

## Benchmarks

Entry multiples vary by sector; target IRR 20-25%; leverage typically 4-6× EBITDA; hold period 3-7 years. The exit assumption (multiple and EBITDA) drives much of the return.

## Common Mistakes

Relying on multiple expansion; over-leveraging; assuming smooth cash flows; ignoring the cyclicality of the business.

## How a PM Uses It

Even for public-market investors, LBO math reveals a **downside floor**: if a stock trades below its LBO value, private equity could step in - a margin of safety. PMs use it to identify potential takeover candidates and to ground their sense of how low a quality business could realistically fall.`,

  vm202: `## NAV for Resource Companies: Valuing What's in the Ground

A mining or energy company is fundamentally a collection of finite assets - ore bodies and oil fields that deplete over time. Standard multiples (P/E, EV/EBITDA) struggle with this because earnings are volatile and the assets run out. The right tool is **Net Asset Value (NAV)** - valuing each resource asset directly and summing them.

## Why Multiples Fail for Resources

A miner's P/E is treacherous: at the top of the commodity cycle, peak earnings make the P/E look low (a value trap); at the bottom, depressed or negative earnings make it meaningless. And no multiple captures the crucial fact that a mine has a **finite life** - it will eventually be exhausted. NAV addresses both by modelling each asset's actual cash flows over its life.

## The NAV Process

1. **For each asset (mine or field)**, build a life-of-mine model: project production volumes over the asset's reserve life, multiply by a forecast commodity price, subtract operating and capital costs to get cash flows.
2. **Discount** those cash flows to present value at an appropriate rate.
3. **Sum** the present values of all assets to get the asset value.
4. **Bridge to equity**: add other assets and cash, subtract net debt and corporate costs.
5. **Divide by shares** for NAV per share.

This is effectively a **sum-of-the-parts DCF** (fs304) applied to physical resource assets.

## The Price/NAV Multiple

Resource companies are then valued on **Price/NAV**: trading **below 1.0× NAV** suggests the market is pricing in lower commodity prices or execution risk; **above 1.0×** suggests optimism about prices, growth, or exploration upside. P/NAV is the resource analyst's headline valuation metric, much as P/B is for banks.

## The Commodity Price Assumption Dominates

The single biggest swing factor is the **long-term commodity price** assumption. A NAV at $90/tonne iron ore looks very different at $70. Analysts run NAV at multiple price decks (spot, consensus, long-run) precisely because the answer is so sensitive to this input.

## Worked Example

A gold miner has two mines. Mine A: 10-year life, modelled NAV $1.5B. Mine B: 6-year life, NAV $0.8B. Plus $200M cash, less $400M debt → equity NAV $2.1B. Across 700M shares, NAV per share = $3.00. If the stock trades at $2.40, it is at 0.8× NAV - discounted, but ask whether the gold price deck used is realistic.

## Common Mistakes

Using an over-optimistic commodity price deck; ignoring reserve life and depletion; forgetting rehabilitation/closure costs; treating exploration "blue sky" as certain value.

## How a PM Uses It

A resources PM values miners and energy companies on P/NAV across realistic price decks, favouring those trading at a discount to NAV with long reserve lives and low costs - and treating multiples like P/E as secondary, cycle-distorted checks.`,

  vm203: `## Building a Full Investment Thesis

Everything in this curriculum - fundamentals, technicals, macro, and valuation - comes together in the **investment thesis**: a clear, written argument for why a stock will outperform. A professional thesis is not a hunch; it is a structured, falsifiable case with a catalyst, a valuation, and a defined risk. This is how institutional decisions are actually made.

## The Anatomy of a Thesis

1. **The business** - what does the company do, and is it a *quality* business? Assess the moat (fs205), returns on capital (fs202), and the durability of its economics.
2. **The thesis (why it will outperform)** - the core insight. Is the market underestimating its growth, mispricing a turnaround, ignoring a catalyst, or applying too harsh a multiple? You must articulate **what you see that the market doesn't**, or why the consensus is wrong.
3. **The valuation** - triangulate across methods: a DCF for intrinsic value, comps for the relative picture (vm101), and a reverse DCF (fs302) to check what the price already implies. Where is the upside, and is the risk-reward skewed in your favour?
4. **The catalyst** - what will cause the market to re-rate the stock? Earnings inflection, a product launch, a margin turn, an activist, an industry shift. Without a catalyst, a cheap stock can stay cheap for years.
5. **The risks and the kill criteria** - what could go wrong, and crucially, **what would prove you wrong**? Define in advance the evidence that would invalidate the thesis and trigger an exit.

## Why Falsifiability Matters

The discipline that separates professionals from gamblers is the **kill criterion** - a pre-defined condition that says "if X happens, I was wrong, and I sell." It defeats the human tendency to rationalise and hold losers. A thesis you can't disprove is a religion, not an investment.

## Worked Example

*Thesis for a quality industrial:* "High-ROIC business with a widening moat. The market is pricing in flat margins, but a completed automation programme should lift EBIT margin 300bps over two years (the catalyst). A DCF at conservative assumptions implies 35% upside; reverse DCF shows the price assumes no margin gain at all - an asymmetric setup. Key risk: the automation underdelivers. **Kill criterion:** if the next two results show no margin progress, the thesis is broken - exit."

## Position Sizing

A thesis ends with **sizing**: conviction and risk-reward determine how much to own. High-conviction, asymmetric ideas get larger weights; speculative ones get small ones. Sizing is where the thesis becomes a portfolio decision.

## Common Mistakes

No clear catalyst; ignoring valuation ("great company at any price"); no defined risk or kill criterion; falling in love with the thesis and rationalising away disconfirming evidence.

## How a PM Uses It

This is the job. A PM builds a written thesis for every position, sizes it by conviction and risk-reward, monitors the catalyst and the kill criteria, and exits when the thesis plays out or breaks - turning analysis into disciplined, accountable decisions.`,

  ma101: `## The Gravity of Interest Rates

Interest rates are the single most important macro variable for equity valuation. Warren Buffett called them "gravity" for asset prices: when rates rise, the pull on valuations intensifies; when they fall, assets can float higher. Understanding the mechanism is foundational to top-down investing.

## Why Rates Move Stocks: The Discount Rate

A stock is worth the present value of its future cash flows, discounted at a rate tied to the risk-free rate (government bond yield). When rates rise, that discount rate rises, and \`PV = CF / (1 + r)^t\` shrinks - especially for cash flows far in the future. This is why **long-duration growth stocks** (most of their value in distant years) fall hardest when rates rise, while value stocks with near-term cash flows are more resilient.

## The Competition Effect

Bonds compete with stocks for capital. When the 10-year Treasury yields 1.5%, equities look attractive by comparison. When it yields 5%, investors can earn a solid risk-free return, so they demand more from stocks - compressing valuations. The "equity risk premium" is the extra return equities must offer over bonds.

## The Economic Channel

Higher rates also slow the real economy: borrowing costs rise for companies and consumers, dampening investment, spending, and ultimately earnings. So rates hit stocks twice - through the discount rate *and* through earnings.

## Worked Example

A growth stock with most of its value in years 6-10 might fall 30% when the 10-year yield jumps from 2% to 4%, while a utility with stable near-term dividends falls only 8%. Same macro shock, very different sensitivity - driven by cash-flow duration.

## Benchmarks

Watch the **10-year Treasury yield** (the equity-relevant benchmark) and the **Fed Funds rate** (the policy lever). FinSight tracks both on the **Sentiment → United States** tab.

## Common Mistakes

Treating all stocks as equally rate-sensitive; ignoring duration; reacting to a single rate move rather than the trend; forgetting that the *pace* of change matters as much as the level.

## How a PM Uses It

Rate regime drives positioning: in a rising-rate environment, PMs rotate toward value, financials (which earn more on higher rates), and short-duration cash flows; in a falling-rate environment, growth and long-duration assets lead. Getting the rate call right is half the battle in asset allocation.`,

  ma102: `## Inflation and the Central Bank Reaction Function

Inflation is the rate at which prices rise, eroding purchasing power. For investors it matters less for its own sake than for how the central bank *responds* to it - because that response sets interest rates, which set valuations (see ma101).

## Measuring Inflation

The headline gauge is the **Consumer Price Index (CPI)**, tracking a basket of consumer goods and services. Analysts focus on **core CPI** (excluding volatile food and energy) for the underlying trend. The Fed actually targets a related measure, **PCE**, aiming for ~2% annual inflation. FinSight charts CPI on the **Sentiment → US** tab from FRED data.

## The Central Bank Reaction Function

This is the key mental model: when inflation runs above target, the central bank **raises rates** to cool demand; when inflation is below target and growth is weak, it **cuts rates** to stimulate. Markets obsess over inflation data precisely because it predicts the next policy move. A hot CPI print can sink stocks not because of the inflation itself but because it implies more rate hikes.

## Good vs Bad Inflation for Stocks

Mild, demand-driven inflation (~2-3%) alongside growth is benign - companies can pass on costs. **High or accelerating** inflation is corrosive: it forces aggressive hikes, squeezes margins for firms without pricing power, and compresses valuations. Deflation is also dangerous - it signals collapsing demand.

## Worked Example

CPI comes in at 4.2% versus 3.5% expected. Bond yields jump as markets price in more hikes; long-duration tech sells off 3% while energy and commodities (inflation beneficiaries) rise. The CPI surprise rippled through rates into sector performance within minutes.

## Benchmarks

~2% is the target; above 4% is uncomfortable and policy-tightening; below 1% raises deflation concerns. The *trend and surprise* matter more than the level.

## Common Mistakes

Confusing the inflation level with its direction; ignoring core vs headline; forgetting that markets price the *expected* path, so a high-but-falling reading can rally stocks.

## How a PM Uses It

Inflation data shapes the rate outlook, which shapes everything. PMs hold inflation hedges (energy, materials, real assets, sometimes value) when inflation is rising, and rotate to growth and duration when it is cooling toward target.`,

  ma103: `## The Business Cycle and Sector Rotation

Economies move in cycles - expansion, peak, contraction, trough - and different sectors lead at each stage. Sector rotation is the strategy of positioning a portfolio for the *next* phase of the cycle rather than the current one.

## The Four Phases

1. **Early cycle (recovery)** - recession ending, rates low, growth accelerating. Leaders: financials, consumer discretionary, industrials, technology.
2. **Mid cycle (expansion)** - steady growth. Leaders: technology, industrials, communication services.
3. **Late cycle (peak)** - growth slowing, inflation rising, rates climbing. Leaders: energy, materials, healthcare.
4. **Recession (contraction)** - falling growth. Leaders (defensive): utilities, consumer staples, healthcare.

## Cyclical vs Defensive

The core distinction: **cyclical** sectors (discretionary, industrials, materials, financials) amplify the economy - they soar in expansion and slump in recession. **Defensive** sectors (staples, utilities, healthcare) provide steady demand regardless of the cycle - they lag in booms but cushion downturns. Rotating between them as the cycle turns is the essence of the strategy.

## The Forward-Looking Catch

Markets are a leading indicator - they price 6-9 months ahead. So sector rotation must anticipate: you buy early-cycle sectors *during* the recession, when fear is highest, not after the recovery is obvious. By the time the data confirms a phase, the rotation has often already happened.

## Worked Example

The yield curve inverts and growth data softens (late cycle). A rotation-aware PM trims discretionary and tech, adds healthcare and staples, and raises some cash - positioning defensively *before* the slowdown bites. When the contraction arrives, the defensive tilt outperforms.

## Benchmarks

Use the yield curve (ma201), PMI surveys, and unemployment trends to locate the cycle. No phase has fixed length - read the indicators, not the calendar.

## Common Mistakes

Rotating too late (chasing what already worked); over-trading on noise; ignoring that cycles vary in length and intensity; forcing the framework when the signals are mixed.

## How a PM Uses It

Sector rotation is a core top-down discipline. By overweighting the sectors poised to lead the next phase and underweighting the laggards, a PM adds value through allocation even before individual stock selection - turning the macro cycle into a positioning edge.`,

  ma201: `## The Yield Curve: The Market's Recession Radar

The yield curve plots government bond yields across maturities (2-year, 5-year, 10-year, 30-year). Its *shape* is one of the most reliable recession indicators in all of finance - it has preceded every US recession of the past half-century.

## The Three Shapes

1. **Normal (upward-sloping)** - long-term yields exceed short-term. Healthy: investors demand more to lend for longer, signalling expected growth.
2. **Flat** - short and long yields converge. A transition signal; the economy is uncertain.
3. **Inverted (downward-sloping)** - short-term yields exceed long-term. The recession warning.

## Why Inversion Predicts Recession

Inversion means investors expect the central bank to *cut* rates in the future - which only happens when they foresee economic weakness. Short rates are high (current tight policy) while long rates are low (expected future cuts and slow growth). It reflects a collective market judgement that tight policy will cause a downturn. The classic measure is the **2-year/10-year spread**: when 10Y minus 2Y goes negative, the curve is inverted. FinSight computes this on the **Sentiment → US** tab and flags inversions.

## The Critical Nuance: The Lag

Inversion is an *early* warning, not a timer. Historically, recession follows inversion by **12-24 months** - and stocks often rally *after* inversion before the eventual downturn. The curve typically "un-inverts" (steepens) just as the recession actually begins. So inversion is a signal to grow cautious and prepare, not to sell everything immediately.

## Worked Example

The 2Y yields 4.8% and the 10Y yields 4.3% - a −50bps inversion. A macro-aware PM does not panic-sell, but begins de-risking: trimming high-beta cyclicals, adding quality and defensives, and building some dry powder, knowing a slowdown is more likely in the next 1-2 years.

## Benchmarks

A spread above +0.5% is comfortably normal; 0 to +0.5% is flat; negative is inverted. The depth and *duration* of inversion both matter.

## Common Mistakes

Treating inversion as an immediate sell signal; ignoring the long lag; forgetting the un-inversion (steepening) is the more imminent warning; relying on the curve alone without confirming data.

## How a PM Uses It

The yield curve is a cornerstone of cycle positioning (ma103). PMs use a persistent inversion to shift toward late-cycle and defensive postures and to stress-test the portfolio for a downturn well before it arrives.`,

  ma202: `## The RBA and the ASX: Australia's Policy Engine

The Reserve Bank of Australia sets the **cash rate**, the country's benchmark interest rate, and its decisions ripple powerfully through the ASX - far more concentrated in rate-sensitive sectors than the US market. For any ASX investor, reading the RBA is essential.

## What the RBA Targets

The RBA has a dual mandate: keeping inflation within a **2-3% target band** and supporting full employment. It meets monthly (more often than the Fed) and adjusts the cash rate to balance these goals. FinSight shows the live cash rate on the **Sentiment → Australia** tab.

## Why the ASX Is So Rate-Sensitive

The ASX 200 is dominated by **banks** (about a quarter of the index) and is heavy in **REITs** and other yield plays. This makes the index unusually exposed to rate moves:
- **Banks** - higher rates can widen net interest margins (good) but also slow credit growth and raise bad debts (bad). The net effect depends on the level and pace.
- **REITs** - highly rate-sensitive; rising rates lift their borrowing costs and make their yields less attractive versus bonds, pressuring prices.
- **The Australian consumer** - most mortgages are variable-rate, so RBA hikes hit household budgets almost immediately, more directly than in the fixed-rate US market.

## The Housing Channel

Australia's economy is uniquely levered to housing. Because mortgages are predominantly variable, RBA decisions transmit to consumer spending fast. A hiking cycle cools house prices and discretionary spending, hitting retailers and banks; a cutting cycle does the reverse.

## Worked Example

The RBA holds the cash rate at 4.35% but signals "higher for longer." Bank margins stay healthy, but rate-sensitive REITs (GMG, DXS) and discretionary retailers soften as the variable-rate mortgage squeeze persists. The single decision rippled across three ASX sectors.

## Benchmarks

Compare the RBA cash rate to the US Fed Funds rate - the **rate differential** drives the AUD (see ma203). A widening US-Australia gap pressures the Australian dollar.

## Common Mistakes

Assuming RBA moves mirror the Fed (they often diverge); ignoring the variable-mortgage transmission; treating all banks and REITs identically.

## How a PM Uses It

An ASX-focused PM positions around the RBA cycle - favouring banks early in a hiking cycle, avoiding rate-sensitive REITs when rates are rising, and rotating into yield plays when cuts loom.`,

  ma203: `## Currency Effects: The AUD and Your Returns

Exchange rates quietly reshape investment returns, corporate earnings, and entire sector fortunes - especially for a commodity-exporting, open economy like Australia. The AUD/USD rate is a macro variable every ASX investor must watch.

## What Drives the Australian Dollar

The AUD is a **commodity currency** and a **risk barometer**, driven by three main forces:
1. **Commodity prices** - Australia exports iron ore, coal, and gas; when their prices rise (often on Chinese demand), export income flows in and the AUD strengthens.
2. **Interest rate differentials** - when the RBA cash rate is high relative to the US Fed Funds rate, capital flows to Australia chasing yield, lifting the AUD. A widening US-AU gap weakens it.
3. **Global risk sentiment** - the AUD is a "risk-on" currency; it rises when markets are optimistic and falls in flights to safety (when the USD strengthens).

## The Translation Effect on Earnings

A weaker AUD is a **tailwind for exporters and offshore earners**. Miners like BHP and RIO sell commodities priced in USD but report in AUD - a falling AUD inflates their reported earnings. CSL, which earns most revenue offshore, benefits similarly. Conversely, a stronger AUD helps **importers and domestic retailers** (cheaper imported goods) but squeezes exporters.

## Worked Example

The AUD falls from 0.72 to 0.65 against the USD. BHP's USD-denominated iron ore revenue now translates into more AUD - boosting reported profit without a single tonne of extra production. Meanwhile, an importer of consumer electronics sees its costs rise. Same currency move, opposite effects.

## Benchmarks

AUD/USD around 0.65-0.75 is a typical range. FinSight shows the live rate and beneficiaries on the **Sentiment → Australia** tab. Watch it alongside iron ore and the US-AU rate gap.

## Common Mistakes

Ignoring currency when analysing exporters; forgetting that a hedged company has different sensitivity; assuming currency moves are random rather than driven by commodities and rate differentials.

## How a PM Uses It

A PM uses the AUD view to tilt the portfolio: expecting a weaker AUD, they overweight miners, energy, and offshore earners (CSL, RMD); expecting a stronger AUD, they favour domestic importers and retailers. Currency is a lever, not just noise.`,

  ma204: `## Geopolitics and Commodities: Trading the Map

Geopolitical events - wars, sanctions, trade disputes, supply disruptions - move markets primarily through **commodities**, which are physical, location-bound, and highly sensitive to supply shocks. For a resource-heavy market like the ASX, geopolitics is not background noise; it is a direct earnings driver.

## Why Commodities Are the Transmission Channel

Unlike a software company, an oil field or a copper mine cannot be relocated when conflict erupts. So geopolitical shocks hit supply directly: a war in an oil-producing region, sanctions on a major exporter, or a blockade of a shipping lane instantly tightens supply and spikes prices. Energy and metals are the most geopolitically sensitive assets.

## The Key Linkages

1. **Oil** - concentrated in politically volatile regions; conflict or OPEC decisions swing prices, rippling into inflation (ma102) and energy stocks (WDS, STO).
2. **Industrial metals** - copper, iron ore, lithium; sensitive to trade policy and Chinese demand, the dominant driver for Australian miners.
3. **Gold** - the classic **safe haven**; it rises during geopolitical stress and currency debasement as investors seek a store of value.
4. **Agriculture** - wars and export bans (e.g., in major grain producers) spike food prices.

## The China Factor for the ASX

For Australia, **China is the swing variable**. China consumes the majority of seaborne iron ore, so its growth, stimulus, and trade relations dominate the fortunes of BHP, RIO, and FMG. A Chinese property stimulus lifts iron ore and Australian miners; a trade dispute or slowdown sinks them.

## Worked Example

A supply disruption removes a chunk of global oil output. Brent jumps 15%; energy stocks rally, airlines and consumer discretionary fall (higher fuel and squeezed spending), gold climbs on the uncertainty, and headline inflation ticks up - pressuring rate expectations. One event, a cascade across asset classes.

## Benchmarks

Track oil (Brent/WTI), iron ore, copper, and gold. FinSight surfaces commodity-linked drivers on the **Sentiment → Australia** tab.

## Common Mistakes

Overreacting to headlines (many geopolitical scares fade fast); ignoring the second-order effects (inflation, rates); forgetting that the market prices probabilities, not certainties.

## How a PM Uses It

Geopolitics is a risk-management and opportunity lens. A PM hedges geopolitical risk with energy and gold exposure, and sizes commodity positions around the China and supply outlook - turning the geopolitical map into portfolio positioning.`,

  ma301: `## Global Capital Flows: Following the Money

At the highest level, markets are driven by where the world's enormous pools of capital choose to flow. Trillions of dollars move between countries, currencies, and asset classes seeking the best risk-adjusted return - and those flows set prices far more than any single company's fundamentals.

## What Drives the Flows

Capital chases **relative** opportunity across three dimensions:
1. **Yield differentials** - money flows to where real (inflation-adjusted) returns are highest. When US rates rise relative to the rest of the world, capital floods into US assets and the dollar.
2. **Growth differentials** - capital favours faster-growing economies and markets.
3. **Risk appetite** - in "risk-on" periods, money flows to emerging markets, equities, and commodity currencies (like the AUD); in "risk-off" periods, it retreats to safe havens (US Treasuries, USD, gold, the yen).

## The US Dollar as the Master Variable

The USD is the world's reserve currency, so its strength is the single most important capital-flow signal. A **strong dollar** pulls capital out of emerging markets (which often borrow in USD), tightens global financial conditions, and pressures commodities. A **weak dollar** does the reverse - easing global liquidity and lifting risk assets, EM, and commodities. For the ASX, dollar weakness is generally a tailwind (it lifts commodities and the AUD).

## Worked Example

The Fed signals aggressive tightening. The dollar surges; capital exits emerging markets and commodity currencies; the AUD falls, EM equities slide, and even gold dips on the strong dollar. A single shift in US policy redirects global capital and ripples to every market - including Australian miners via the China-EM channel.

## Benchmarks

Watch the US Dollar Index (DXY), the direction of US real yields, and EM equity/bond fund flows. These reveal the prevailing risk regime.

## Common Mistakes

Analysing a market in isolation; ignoring the dollar; underestimating how fast flows reverse; confusing a local story with a global liquidity tide.

## How a PM Uses It

Global flows set the backdrop for everything else. A PM reads the dollar and risk regime to decide overall equity exposure, EM vs developed tilt, and commodity positioning - the macro tide that lifts or sinks all boats before stock selection even begins.`,

  ma302: `## QE vs QT: When Central Banks Move the Tide

Beyond setting interest rates, modern central banks wield a second, more powerful tool: changing the size of their balance sheet. **Quantitative Easing (QE)** floods the system with liquidity; **Quantitative Tightening (QT)** drains it. These programmes have been among the biggest drivers of asset prices since 2008.

## How QE Works

When rates are already near zero and the economy still needs support, the central bank creates new money and uses it to **buy bonds** (government and sometimes corporate) in the open market. This does three things:
1. **Pushes bond prices up and yields down**, lowering borrowing costs across the economy.
2. **Injects liquidity** - the cash paid for those bonds flows into the financial system seeking returns.
3. **Forces investors out the risk curve** - with bond yields crushed, investors are pushed into equities, credit, and other risk assets, lifting their prices. This "portfolio balance" effect is why QE eras saw powerful bull markets.

## How QT Works

QT is the reverse: the central bank lets bonds mature without replacing them (or sells them), **shrinking its balance sheet** and withdrawing liquidity. This tends to raise yields, tighten financial conditions, and remove the tailwind from risk assets. QT periods are typically more volatile and challenging for equities - the tide that lifted everything is now going out.

## The Liquidity Lens

A useful mental model: QE is a rising tide that lifts all asset prices (often regardless of fundamentals); QT is an ebbing tide that exposes weakly-supported valuations. Much of the 2010s bull market and the 2022 drawdown can be read through this liquidity lens.

## Worked Example

A central bank announces it will end QE and begin QT. Bond yields rise, the most speculative, profitless growth stocks (which thrived on free liquidity) fall hardest, and market volatility increases. The withdrawal of liquidity repriced the riskiest assets first.

## Benchmarks

Track the central bank balance sheet trend (expanding = QE, contracting = QT) alongside rate policy. The two together define the monetary regime.

## Common Mistakes

Ignoring the balance sheet and watching only rates; underestimating QE's effect on valuations; assuming QT is smooth (it can break things in over-levered corners of the market).

## How a PM Uses It

The QE/QT regime sets the risk-appetite backdrop. PMs take more risk and favour long-duration growth during QE; they de-risk, favour quality and cash flow, and expect higher volatility during QT - aligning the portfolio with the direction of the liquidity tide.`,

  ma303: `## The Top-Down Framework: From Macro to Stock

Top-down investing builds a portfolio by starting with the big picture and narrowing down - from the global economy, to asset allocation, to sectors, and finally to individual stocks. It is the discipline that ties together everything in this Macro module into a single, coherent process.

## The Funnel

1. **Macro regime** - assess growth, inflation, rates, liquidity (QE/QT), and the cycle phase (ma103). Where are we, and where are we heading?
2. **Asset allocation** - given the regime, how much in equities vs bonds vs cash vs commodities? A late-cycle, tightening regime argues for caution; an early-cycle, easing regime argues for risk.
3. **Geographic and currency tilt** - which markets and currencies are favoured by capital flows and the dollar outlook (ma301, ma203)?
4. **Sector selection** - rotate toward the sectors poised to lead the next phase (ma103).
5. **Stock selection** - within favoured sectors, pick the best businesses (using the Fundamentals module).

## Why Top-Down Matters

Studies consistently find that **asset allocation and sector positioning** explain the majority of portfolio returns - far more than individual stock picks. Getting the regime and allocation right is the highest-leverage decision a PM makes. A brilliant stock pick in the wrong sector during the wrong regime can still lose money.

## Combining Top-Down and Bottom-Up

The best investors blend both: top-down to decide *where* to fish (which sectors and regions the macro favours), and bottom-up to decide *which fish* to catch (the highest-quality, best-valued stocks within those areas). The macro sets the opportunity set; the fundamentals select within it.

## Worked Example

A PM reads the regime: inflation cooling, the Fed signalling cuts, the yield curve steepening from inversion (early-cycle setup). The framework says: raise equity exposure, tilt toward early-cycle cyclicals (financials, discretionary, tech), favour markets that benefit from a weaker dollar - then within those sectors, select the strongest balance sheets and widest moats. Macro and fundamentals working together.

## Benchmarks

Use the yield curve, inflation trend, PMI, unemployment, and the dollar to locate the regime. FinSight's **Sentiment** tabs and **Macro Summary** card assemble these into a single read.

## Common Mistakes

Being all top-down (ignoring company quality) or all bottom-up (ignoring the macro tide); over-forecasting; failing to update the view as data changes.

## How a PM Uses It

This *is* how most institutional money is run: a top-down process to set allocation and sector weights, executed through bottom-up stock selection - turning a macro worldview into a disciplined, positioned portfolio.`,

  ta101: `## Candlesticks: Price Action in One Glance

A candlestick compresses four numbers - open, high, low, close - into a single visual that traders read instantly. The **body** spans open to close; the **wicks** (shadows) reach to the high and low. A close above the open is an "up" candle (green); a close below is a "down" candle (red). The shape tells you who won the session: bulls or bears.

## Reading the Anatomy

A long body means strong conviction in one direction. Long wicks mean rejection - price tried to go somewhere and was pushed back. A small body with long wicks signals indecision. The **relationship between body and wicks** is the entire language.

## Key Single and Two-Candle Signals

1. **Doji** - open ≈ close, tiny body. Indecision; often a reversal warning after a strong trend.
2. **Hammer** - small body at the top, long lower wick. After a downtrend, it shows buyers absorbing selling - bullish reversal.
3. **Shooting Star** - the inverse: small body at the bottom, long upper wick after an uptrend - bearish.
4. **Engulfing** - a candle whose body completely engulfs the prior one. Bullish engulfing after a decline, bearish engulfing after a rally, are among the most reliable two-candle reversals.

## Worked Example

A stock falls for five sessions, then prints a hammer at support: open $48, low $45, close $49. The long $3 lower wick shows buyers stepped in hard. If the next candle closes above $49, the reversal is confirmed and you have a defined risk level - a stop just below $45.

## Benchmarks and Confirmation

No single candle is a trade. The professional rule is **confirmation**: a hammer needs a follow-through up-candle; a doji needs the next candle to break in one direction. Candles are most powerful at **levels that already matter** - support, resistance, or a moving average (see ta102, ta103).

## Common Mistakes

Trading every doji as a reversal (most are noise); ignoring the trend context; using candles on a timeframe that's too short and full of randomness. A daily candle carries far more signal than a 1-minute one.

## Where to Find It and How a PM Uses It

Every chart in FinSight's **Stock Detail** page is candle-based. Discretionary traders use candles for **entry timing** - even a fundamentally-driven PM who has decided to buy will wait for a constructive candle at support to get a better entry price and a tighter stop.`,

  ta102: `## Support and Resistance: The Market's Memory

Support is a price level where buying has repeatedly overwhelmed selling; resistance is where selling has overwhelmed buying. These levels work because markets have **memory** - traders remember where they bought, sold, or wished they had, and act again at those prices.

## Why Levels Form

Support forms at prices where demand is strong: previous lows, round numbers, prior breakout points. Resistance forms at supply zones: previous highs, where trapped buyers wait to "get out even." The more times a level is tested and holds, the more significant it becomes - until it breaks.

## The Polarity Principle

The single most useful idea: **broken resistance becomes support, and broken support becomes resistance.** When price finally pushes through a ceiling, that old ceiling becomes a floor on the pullback. This "role reversal" gives you high-probability entry points.

## Worked Example

A stock repeatedly fails at $100 (resistance) three times over two months. On the fourth attempt it breaks through to $105, then pulls back. If $100 now holds as support, that retest is a textbook entry - you buy at $100 with a stop at, say, $97, risking $3 to play for a continuation.

## Identifying Quality Levels

Look for: multiple touches, high volume at the level (conviction), and confluence with round numbers or moving averages. A level tested four times on heavy volume is far stronger than one touched once.

## Benchmarks

Treat support/resistance as **zones, not exact lines** - give them a band of a percent or two. Price often overshoots slightly (a "stop hunt") before reversing.

## Common Mistakes

Drawing too many lines until the chart is meaningless; treating a level as an exact price rather than a zone; ignoring volume; fading a level that has already been tested too many times (each test weakens it).

## Where to Find It and How a PM Uses It

FinSight surfaces Finnhub support/resistance levels on the **Technicals tab**. A PM uses these levels for **risk management** - placing stops just beyond support and scaling into positions near it, turning a vague "it looks cheap" into a precise risk-defined plan.`,

  ta103: `## Moving Averages: Smoothing the Noise

A moving average (MA) turns choppy price into a single trend-following line by averaging the last N closes. It answers one question cleanly: which way is the trend, and is price extended from it?

## SMA vs EMA

The **Simple Moving Average** weights all N periods equally: \`SMA = (sum of last N closes) / N\`. The **Exponential Moving Average** weights recent prices more heavily, so it reacts faster to new information. Short-term traders favour the EMA for responsiveness; longer-term investors use the SMA for stability.

## The Key Averages

- **20-day** - short-term trend, the line momentum traders watch.
- **50-day** - the intermediate trend; institutions defend it.
- **200-day** - the long-term trend and the single most-watched line in markets. Price above the 200-day is broadly bullish; below is bearish.

## Crossovers

The **Golden Cross** (50-day crossing above the 200-day) is a classic bullish signal; the **Death Cross** (50 below 200) is bearish. They lag - by definition averages are backward-looking - but they filter out noise and keep you on the right side of major trends.

## Worked Example

A stock trades at $110 with a 200-day SMA at $100 - it sits 10% above its long-term trend. That confirms an uptrend but also warns of being extended; a pullback toward $100 would be a lower-risk entry. FinSight computes exactly this on the **Technicals tab** ("price vs SMA200").

## Benchmarks

Price far above the 200-day (say +25%) is overextended and prone to mean-reversion; price reclaiming the 200-day from below often marks a trend change worth acting on.

## Common Mistakes

Using MAs in choppy, sideways markets where they whipsaw constantly (they only work in trends); using too short a period and getting faked out; treating a crossover as an instant signal rather than confirmation of a trend already underway.

## How a PM Uses It

Moving averages define **regime**. Many funds simply won't buy a stock below its 200-day, and use the 50-day as a trailing stop and add-on level. They are the trend filter that keeps a portfolio aligned with the primary direction rather than fighting it.`,

  ta104: `## Volume: The Fuel Behind Price

Price tells you what happened; volume tells you how much conviction was behind it. A move on heavy volume is meaningful; the same move on thin volume is suspect. Volume is the second dimension that separates real signals from noise.

## The Core Principle

Volume should **confirm** the trend. In a healthy uptrend, up-days have higher volume than down-days - buyers are in control. When a rally happens on declining volume, the move is running out of fuel and is vulnerable to reversal. This is the foundation of volume analysis.

## Breakouts Live or Die on Volume

A breakout above resistance **on a surge in volume** is credible - real demand pushed it through. A breakout on weak volume is a likely "fakeout" that will fail and trap buyers. Always check volume before trusting a breakout.

## Key Volume Concepts

1. **Volume spikes** - an abnormal surge often marks climaxes: capitulation bottoms (panic selling) or blow-off tops (euphoric buying).
2. **OBV (On-Balance Volume)** - a running total that adds volume on up-days and subtracts on down-days, revealing whether accumulation or distribution is occurring beneath the price.
3. **Volume vs average** - compare today's volume to the 50-day average; 2× average is significant.

## Worked Example

A stock consolidates near $50 for weeks on quiet volume, then breaks to $53 on **3× its average volume**. That volume confirms institutional buying, not a random pop - a far higher-probability entry than the same move on average volume.

## Benchmarks

Healthy trends show volume expanding in the trend direction and contracting on counter-trend pullbacks. Divergence - price making new highs while volume shrinks - is a warning.

## Common Mistakes

Ignoring volume entirely; chasing breakouts without volume confirmation; misreading a single spike (one day proves little - look at the pattern).

## How a PM Uses It

FinSight shows volume bars beneath every price chart and average volume on the **Stock Detail** header. Institutions watch volume to gauge whether *other institutions* are accumulating - large players can't hide their footprints in the volume profile.`,

  ta201: `## RSI: Measuring Momentum Extremes

The Relative Strength Index is a momentum oscillator bounded between 0 and 100. It measures the speed and magnitude of recent price changes to flag when a stock is overbought or oversold. It's the most widely used oscillator in markets.

## The Mechanics

RSI compares average gains to average losses over a period (default 14): \`RSI = 100 − 100 / (1 + RS)\`, where \`RS = average gain / average loss\` (using Wilder's smoothing). The output:
- **Above 70** - overbought; momentum is stretched, a pullback is more likely.
- **Below 30** - oversold; selling is stretched, a bounce is more likely.
- **50** - the centreline; above is bullish momentum, below bearish.

## The Crucial Caveat

Overbought is **not** a sell signal in a strong trend. A powerful uptrend can keep RSI above 70 for weeks - "overbought" can stay overbought. RSI extremes are warnings to manage risk, not automatic reversal trades. In strong trends, the 40–80 band holds; in downtrends, 20–60.

## Divergence - The Real Edge

The highest-value RSI signal is **divergence**: price makes a new high but RSI makes a *lower* high (bearish divergence - momentum is fading even as price rises), or price makes a new low while RSI makes a higher low (bullish divergence - selling is exhausting). Divergence often precedes reversals.

## Worked Example

A stock rallies to a new high of $120, but RSI peaks at 65 versus 78 on the prior high. That bearish divergence says the rally lacks momentum - a signal to tighten stops or trim, even though price is still rising.

## Benchmarks

RSI 14 is standard. Shorter periods (e.g., 7) are noisier and more sensitive; longer ones smoother.

## Common Mistakes

Shorting every overbought reading in a bull market (the classic way to lose money); ignoring trend context; trading divergence without price confirmation.

## How a PM Uses It

FinSight shows RSI 14 with a signal label on the **Technicals tab**. PMs use RSI to **time entries and exits within a thesis** - buying a fundamentally-liked stock when it's oversold, and using divergence as an early warning to reduce risk.`,

  ta202: `## MACD: Trend and Momentum Combined

The Moving Average Convergence Divergence indicator merges trend-following and momentum into one tool. It's built from moving averages but reads like an oscillator, making it one of the most versatile indicators in technical analysis.

## The Three Components

1. **MACD line** = 12-period EMA − 26-period EMA. It measures the gap between fast and slow trends.
2. **Signal line** = 9-period EMA of the MACD line. It smooths the MACD for crossovers.
3. **Histogram** = MACD line − Signal line. It visualises momentum: growing bars mean accelerating momentum, shrinking bars mean it's fading.

## Reading the Signals

- **Bullish crossover** - MACD line crosses above the signal line: momentum is turning up.
- **Bearish crossover** - MACD crosses below: momentum turning down.
- **Zero-line cross** - MACD crossing above zero means the fast EMA is above the slow EMA (uptrend); below zero, downtrend.
- **Histogram** - the earliest tell; it peaks and turns before the crossover happens.

## Divergence

Like RSI, MACD divergence is powerful: price making new highs while the MACD makes lower highs warns that the trend is weakening beneath the surface.

## Worked Example

A stock's MACD histogram has been shrinking for five sessions even as price grinds higher - momentum is decelerating. Then the MACD line crosses below the signal line. That sequence (histogram fade → crossover) is a classic exit or short-entry trigger.

## Benchmarks

12/26/9 is the standard setting. MACD works best in trending markets and whipsaws in sideways chop - pair it with a trend filter.

## Common Mistakes

Trading every crossover in a range-bound market; ignoring the zero line (crossovers above zero are higher-quality in an uptrend); using MACD alone without price-structure context.

## How a PM Uses It

FinSight can pull MACD via Alpha Vantage. Traders use MACD crossovers for **timing**, the histogram for **early momentum shifts**, and divergence as a **trend-exhaustion warning** - a three-in-one read on where momentum is heading.`,

  ta203: `## Bollinger Bands: Volatility as a Map

Bollinger Bands wrap a moving average in two bands set a number of standard deviations away, turning volatility itself into a visual trading tool. They adapt automatically - widening when markets are volatile, contracting when calm.

## Construction

- **Middle band** = 20-period SMA.
- **Upper band** = middle + 2 standard deviations.
- **Lower band** = middle − 2 standard deviations.

Because they use standard deviation, the bands **breathe** with volatility. About 95% of price action stays within the bands (two standard deviations), which is what makes touches of the bands notable.

## The Two Core Setups

1. **The Squeeze** - when the bands contract to an unusually narrow width, volatility is low and a big move is coming. The squeeze doesn't tell you direction, only that energy is building. Breakouts from a squeeze are high-probability.
2. **Band touches** - in a range, price tagging the upper band is relatively expensive and the lower band relatively cheap (mean-reversion). But in a strong trend, price "walks the band," riding the upper band up - so a band touch is **not** automatically a reversal.

## Worked Example

A stock's bands narrow to their tightest in six months (a squeeze). Then price breaks above the upper band on rising volume. The squeeze signalled energy building; the break signals release - a momentum entry with the lower band as a trailing stop reference.

## Benchmarks

20-period, 2 standard deviations is standard. Widen to 2.5 SD for less frequent, higher-conviction signals.

## Common Mistakes

Blindly shorting upper-band touches in an uptrend (price walks the band); treating the bands as fixed support/resistance; ignoring the volume confirmation on squeeze breakouts.

## How a PM Uses It

Bollinger Bands (available via Alpha Vantage in FinSight) give a PM a **volatility regime** read. The squeeze is especially valued - it flags when a quiet stock is coiling for a move, letting a manager position ahead of the expansion.`,

  ta204: `## Fibonacci Retracement: Mapping Pullbacks

After a strong move, markets rarely go straight - they pull back before continuing. Fibonacci retracement levels predict *how far* a pullback is likely to go, giving traders pre-planned entry zones within a trend.

## The Levels

Drawn from a swing low to a swing high (or vice versa), the key retracement levels are **23.6%, 38.2%, 50%, 61.8%, and 78.6%**. The 38.2%, 50%, and 61.8% levels are the workhorses. The 61.8% ("the golden ratio") is the most-watched - a pullback that holds there often resumes the original trend.

## Why They Work

Partly mathematics, largely **self-fulfilling prophecy**: enough traders place orders at these levels that they become real support and resistance. The 50% level isn't a true Fibonacci number but is included because markets so often retrace half a move.

## Worked Example

A stock rallies from $50 to $70 (a $20 move), then pulls back. The Fibonacci levels are: 38.2% → $62.36, 50% → $60, 61.8% → $57.64. A trader watches $60–$62 as the high-probability re-entry zone. If price holds the 61.8% at $57.64 and turns up, that's a strong continuation signal with a tight stop just below.

## Confluence Is Everything

Fibonacci levels are most reliable when they **line up with other evidence** - a prior support level, a moving average, or a round number at the same price. A 61.8% retracement that coincides with the 200-day SMA is a high-conviction zone.

## Benchmarks

The deeper the retracement (toward 78.6%), the weaker the original move; shallow pullbacks (to 38.2%) signal strength.

## Common Mistakes

Drawing from the wrong swing points; treating levels as exact prices rather than zones; using Fibonacci in isolation without confluence; forcing it onto every chart.

## How a PM Uses It

Fibonacci gives a disciplined framework for **scaling into a position on pullbacks** - buying a trending stock at the 50% and 61.8% retracements rather than chasing it, improving the average entry and defining risk.`,

  ta205: `## Chart Patterns: The Geometry of Crowd Behaviour

Chart patterns are recurring price formations that reflect the repeating psychology of fear and greed. They fall into two families: **continuation** patterns (a pause before the trend resumes) and **reversal** patterns (the trend is ending).

## Reversal Patterns

1. **Head and Shoulders** - three peaks, the middle highest, with a "neckline" connecting the troughs. A break below the neckline signals a top. The measured target: project the head-to-neckline distance down from the break.
2. **Double Top / Double Bottom** - price tests a level twice and fails (top) or holds twice (bottom). A break of the intervening level confirms the reversal.

## Continuation Patterns

3. **Flags and Pennants** - a sharp move (the "pole") followed by a brief consolidation against the trend, then continuation. The most reliable continuation patterns.
4. **Triangles** - ascending (bullish, flat top rising bottom), descending (bearish), or symmetrical (neutral, breaks either way). Volume typically contracts into the apex, then expands on the breakout.

## Worked Example

A stock rallies from $40 to $60 (the pole), then drifts down to $55 in a tight flag over a week on declining volume. A break above $60 on rising volume targets roughly $75 ($60 + the $20 pole). The flag was simply buyers pausing, not selling.

## The Universal Rule: Volume and Confirmation

Patterns are only valid on **confirmation** - the breakout - and that breakout should come on **expanding volume**. A pattern is a hypothesis; the volume-backed break is the trigger. Trading the pattern before it completes is guessing.

## Benchmarks

Bigger patterns (formed over months) carry more weight than intraday ones. The measured-move target is a guide, not a guarantee.

## Common Mistakes

Seeing patterns that aren't there (pareidolia); trading before the breakout; ignoring volume; forgetting that perhaps a third of patterns fail - always use a stop beyond the pattern.

## How a PM Uses It

Patterns help a PM **time entries and set targets/stops** with defined risk-reward. A flag in a fundamentally strong stock offers a high-probability add point; a head-and-shoulders top is a cue to take profits.`,

  ta301: `## Elliott Wave: The Market's Fractal Rhythm

Elliott Wave Theory proposes that markets move in repeating, fractal wave patterns driven by mass psychology. It's the most ambitious - and most subjective - framework in technical analysis: powerful as a roadmap, dangerous when forced.

## The Basic Structure

A complete cycle has **eight waves**: a five-wave "impulse" in the direction of the trend, followed by a three-wave "correction" against it.
- **Impulse (1-2-3-4-5):** waves 1, 3, 5 move with the trend; waves 2 and 4 are pullbacks. Wave 3 is usually the longest and strongest.
- **Correction (A-B-C):** a three-wave move against the trend.

The pattern is **fractal** - each wave subdivides into smaller waves of the same form, and is itself part of a larger wave.

## The Three Unbreakable Rules

1. Wave 2 never retraces more than 100% of wave 1.
2. Wave 3 is never the shortest of waves 1, 3, and 5.
3. Wave 4 never overlaps the price territory of wave 1.

If a count violates any rule, it's wrong - recount. These rules are what keep the theory falsifiable.

## Fibonacci Integration

Wave relationships obey Fibonacci ratios: wave 2 often retraces 61.8% of wave 1; wave 3 frequently extends to 161.8% of wave 1. This is where Elliott Wave (ta301) and Fibonacci (ta204) combine.

## Worked Example

After identifying a clear five-wave advance from $50 to $100, a practitioner expects an A-B-C correction. If wave A drops to $85 and wave B bounces to $95, wave C might target the 61.8% retracement near $69 - a planned re-entry zone for the next impulse.

## The Honest Caveat

Elliott Wave is **highly subjective** - give the same chart to ten analysts and you'll get ten counts. Its value is as a framework for *scenarios and risk*, not precise prediction. The best practitioners hold multiple counts and trade the one with the clearest invalidation level.

## Common Mistakes

Forcing a count to fit a bias; ignoring the three rules; over-precision; betting heavily on a single count.

## How a PM Uses It

Few institutional PMs trade Elliott Wave mechanically, but many use its **structure** to frame where a market sits in its psychological cycle and to define invalidation levels - turning subjective wave counts into disciplined risk points.`,

  ta302: `## The Wyckoff Method: Following the Smart Money

Developed by Richard Wyckoff a century ago, this method reads the market as a battle between the "Composite Operator" (large institutions) and the public. The goal: identify when smart money is **accumulating** (quietly buying) or **distributing** (quietly selling) before the trend reveals itself.

## The Core Idea

Large players can't buy or sell huge positions at once without moving price against themselves. So they **accumulate within a trading range**, absorbing supply quietly, then mark price up. Distribution is the reverse - selling into strength within a range before the markdown. Wyckoff teaches you to read these ranges.

## The Four Phases

1. **Accumulation** - a sideways range after a downtrend where institutions absorb supply.
2. **Markup** - the uptrend as price is driven higher.
3. **Distribution** - a sideways range after the uptrend where institutions offload.
4. **Markdown** - the downtrend.

## Key Events Within a Range

- **Spring** - a false breakdown below support that shakes out weak holders before the markup. A bullish tell.
- **Upthrust** - a false breakout above resistance that traps buyers before distribution. Bearish.
- **Sign of Strength / Weakness** - a decisive move on volume confirming the range is resolving.

## The Three Laws

1. **Supply and Demand** - price rises when demand exceeds supply.
2. **Cause and Effect** - the size of the trading range (the "cause") determines the size of the subsequent move (the "effect").
3. **Effort vs Result** - volume (effort) should align with price movement (result); a divergence signals a coming reversal.

## Worked Example

A stock trades sideways for two months after a decline. It briefly stabs below support to $45 on a volume spike, then snaps back inside the range (a spring) - weak holders were shaken out and institutions absorbed the supply. The subsequent break above the range on heavy volume confirms markup has begun.

## Common Mistakes

Mistaking a genuine breakdown for a spring; ignoring volume (Wyckoff is volume-centric); impatience during the long accumulation phase.

## How a PM Uses It

Wyckoff aligns a manager with **institutional intent** rather than retail emotion. Spotting accumulation lets a PM build a position alongside smart money, before the trend - and the crowd - arrives.`,

  ta303: `## Options Flow and Dark Pools: Reading Institutional Footprints

The most sophisticated edge in modern markets is tracking where institutional money is actually positioning - through the options market and off-exchange "dark pool" prints. This is advanced, signal-rich, and easy to misread.

## Why Options Flow Matters

Large players use options to express directional views with leverage and defined risk. **Unusual options activity** - a sudden surge in volume far above the open interest, especially in out-of-the-money calls or puts with near-term expiry - can signal that someone with conviction (and possibly information) is positioning. The key filters: volume vs open interest, the size of the premium spent, and whether it hit the ask (aggressive buying) or bid.

## Reading the Signals

- **Sweeps** - orders split across multiple exchanges to fill fast, signalling urgency.
- **Block trades** - large single prints, often negotiated, indicating institutional size.
- **Call/Put skew** - heavy call buying suggests bullish positioning; heavy put buying, bearish or hedging.

The crucial nuance: much options activity is **hedging, not speculation**. A big put buy might be a fund protecting a long position, not betting on a crash. Context is everything.

## Dark Pools

Dark pools are private venues where institutions trade large blocks without revealing intent to the public market. **Dark pool prints** - large off-exchange trades reported after the fact - reveal where size is changing hands. Persistent large prints at a price level can mark institutional accumulation or distribution that isn't visible on the standard chart.

## Worked Example

A stock at $50 sees a sweep of 10,000 call contracts at the $55 strike expiring in three weeks, premium $2M, hitting the ask - against open interest of just 500. That's aggressive, urgent, large bullish positioning. Combined with a dark-pool block at $50, it suggests an institution is building a directional bet.

## The Honest Caveat

This data is **noisy and often misleading**. You can't see the other leg of a spread, whether it's a hedge, or who's behind it. Treat unusual flow as a *hypothesis generator*, never a standalone signal.

## Common Mistakes

Blindly following "unusual options" alerts; ignoring that most flow is hedging; over-leveraging on a single print; forgetting expiry and strike context.

## How a PM Uses It

Sophisticated desks use flow and dark-pool data as a **confirmation layer** - when unusual bullish flow aligns with their fundamental thesis and the technicals, conviction rises. It's an edge in *timing and sizing*, not a crystal ball.`,

  fs101: `## Why the Three Statements Matter

Every equity story ultimately reduces to three documents: the income statement, the balance sheet, and the cash flow statement. A junior analyst who can read them fluently has a permanent edge, because most retail investors only ever glance at the headline EPS number. Your job is to read them as a *connected system* - each statement explains a different dimension of the same business.

## The Income Statement: Profitability Over a Period

The income statement covers a *period* (a quarter or year) and walks from revenue down to net income. The key lines, top to bottom:

1. **Revenue** - the top line. Ask: is it growing, and is the growth organic or acquired?
2. **Gross Profit** = Revenue − Cost of Goods Sold. The gross margin (\`Gross Profit / Revenue\`) tells you pricing power.
3. **Operating Income (EBIT)** - after sales, marketing, R&D and admin. This is the profit from the core business before financing and tax.
4. **Net Income** - the bottom line, after interest and tax.

Worked example: a software firm with **$400M revenue**, **$300M gross profit** (75% gross margin), **$120M EBIT** (30% operating margin) and **$95M net income** (23.75% net margin) is a high-quality business - those margins scream pricing power and operating leverage.

## The Balance Sheet: Position at a Point in Time

The balance sheet is a *snapshot* on the last day of the period. It always obeys: \`Assets = Liabilities + Equity\`. Read it for three things: **liquidity** (can it pay near-term bills - current assets vs current liabilities), **leverage** (how much debt sits on the business), and **capital structure** (debt vs equity funding). Net debt = Total Debt − Cash is the number that feeds directly into your enterprise value bridge.

## The Cash Flow Statement: The Truth Serum

Net income can be massaged with accounting choices; cash is much harder to fake. The cash flow statement reconciles net income to actual cash, split into three sections:

- **Operating Cash Flow (OCF)** - cash from running the business.
- **Investing** - capex, acquisitions, asset sales.
- **Financing** - debt raised/repaid, dividends, buybacks.

The single most important derived number is **Free Cash Flow**: \`FCF = Operating Cash Flow − Capex\`. This is the cash actually available to owners, and it is the input to a DCF.

## How They Connect

Net income flows from the income statement into both the top of the cash flow statement and into retained earnings on the balance sheet. Capex on the cash flow statement becomes PP&E on the balance sheet. Master these links and you can spot when something doesn't add up.

## Benchmarks and Red Flags

Healthy signs: OCF consistently exceeds net income (earnings are cash-backed); revenue and receivables grow in line. **Red flags**: net income rising while OCF falls (earnings quality deteriorating); receivables growing much faster than sales (channel stuffing); rising inventory ahead of slowing sales.

## Common Mistakes

Beginners fixate on EPS and ignore the balance sheet, then are shocked when a "profitable" company raises emergency capital. Always read all three together. A profitable company with negative operating cash flow and a wall of maturing debt is a landmine.

## Where to Find the Data and How a PM Uses It

Pull statements from the company's 10-K/annual report, or here in FinSight on the **Financials tab** of any Stock Detail page. A portfolio manager screens the income statement for margin trends, the balance sheet for solvency, and the cash flow statement to confirm the earnings are real - *then* decides whether the valuation is interesting.`,

  fs102: `## The Three Workhorse Multiples

Price multiples are the lingua franca of markets. They let you compare a $5 stock to a $500 stock on equal footing by normalising price against a fundamental. The three you must know cold are **P/E**, **P/B**, and **P/S**.

## Price-to-Earnings (P/E)

\`P/E = Price per Share / Earnings per Share\` - or equivalently Market Cap / Net Income. It answers: how many dollars are investors paying for one dollar of annual earnings? A P/E of 20 means 20 years of current earnings to "pay back" the price, ignoring growth.

Worked example: a stock at **$50** with **$2.50 EPS** trades on a **20× P/E**. If peers trade at 15×, the market is paying a premium - justified only if this company grows faster or earns higher-quality profits.

Rough interpretation (context-dependent): under 10 is cheap or distressed; 15–20 is fair for a steady business; 30+ prices in strong growth. **Never read a P/E in isolation** - a low P/E on a melting-ice-cube business is a value trap.

## Price-to-Book (P/B)

\`P/B = Market Cap / Shareholders' Equity\`. Book value is assets minus liabilities - accounting net worth. P/B is most useful for asset-heavy, mark-to-market businesses: **banks, insurers, and REITs**. A bank trading below 1.0× P/B is being valued at less than its stated net assets, which signals either distress or market scepticism about asset quality.

P/B is nearly useless for asset-light businesses. A software company with huge intangible value but little book equity can trade at 20× P/B and be perfectly reasonable - the value isn't on the balance sheet.

## Price-to-Sales (P/S)

\`P/S = Market Cap / Revenue\`. Because revenue is harder to manipulate than earnings and never goes negative, P/S is the go-to for **early-stage or temporarily unprofitable companies**. The catch: it ignores profitability entirely. A 10× P/S is wildly different for a 90%-gross-margin software firm versus a 5%-margin retailer.

## The Golden Rule: Multiples Are Relative

A multiple only has meaning against a reference: the company's own history, its direct peers, and its growth rate. The professional workflow is to build a comps table (see the **Comps model in the Valuation Lab**) and compare the subject to the peer median.

## Common Mistakes

1. Comparing P/E across sectors (a utility and a chipmaker shouldn't trade alike).
2. Using trailing earnings during a cyclical peak - the "E" collapses next year and the cheap-looking P/E was a mirage.
3. Forgetting that buybacks flatter EPS and therefore compress P/E artificially.

## Where to Find It and How a PM Uses It

FinSight shows P/E, P/B and P/S on the **Financials tab**. A PM uses multiples for quick triage and relative positioning, then pressure-tests the cheap names with a cash-flow model to separate genuine value from value traps.`,

  fs103: `## EPS Is the Headline - Earnings Quality Is the Story

Earnings per share is the number that moves stocks on results day, but seasoned analysts spend far more time on *earnings quality* - whether the reported profit is durable, cash-backed, and free of accounting tricks.

## The Mechanics of EPS

\`Basic EPS = Net Income / Weighted Average Shares Outstanding\`. **Diluted EPS** additionally counts options, warrants and convertibles that could become shares - always use diluted EPS, because it reflects the real claim on profits. A company can grow EPS three ways: grow net income, shrink the share count via buybacks, or both.

Worked example: net income flat at **$1.0B**, but a buyback cuts shares from **500M to 450M**. EPS rises from **$2.00 to $2.22** - an 11% "growth" with zero improvement in the underlying business. Always decompose EPS growth into operational growth versus share-count reduction.

## What Earnings Quality Means

High-quality earnings are: (1) **cash-backed** - operating cash flow tracks or exceeds net income; (2) **recurring** - not propped up by one-off gains; (3) **conservatively stated** - not relying on aggressive revenue recognition.

The key diagnostic is the **accruals ratio**: \`(Net Income − Operating Cash Flow) / Total Assets\`. A large positive value means profits exist on paper but not in cash - a warning sign. Academic research (Sloan, 1996) showed firms with high accruals systematically underperform.

## Red Flags in Practice

- Net income up, operating cash flow down - the classic divergence.
- Revenue recognised aggressively (booking multi-year contracts upfront).
- Repeated "one-time" charges every single quarter (they aren't one-time).
- Rising "other income" doing the heavy lifting instead of core operations.
- Receivables growing materially faster than revenue.

## Worked Interpretation

If a company reports **$95M net income** but only **$60M operating cash flow**, ask why. Sometimes it's benign (a working-capital build during fast growth). Often it's a sign that reported earnings are running ahead of economic reality. Pair this lesson with **Forensic Accounting Red Flags (fs303)** for the deep dive.

## Common Mistakes

Trusting the adjusted/non-GAAP EPS that management highlights. Companies love to add back stock-based compensation and "restructuring." SBC is a real economic cost - it dilutes you. Always reconcile adjusted figures back to GAAP.

## Where to Find It and How a PM Uses It

EPS (diluted) and the cash flow statement are on FinSight's **Financials tab**; compute the accruals ratio yourself from net income and OCF. A portfolio manager treats earnings quality as a gating test - a cheap multiple on low-quality earnings is not actually cheap.`,

  fs201: `## The Single Most Important Idea in Finance

A business is worth the present value of all the cash it will generate for its owners over its life. That sentence is the entire foundation of the **Discounted Cash Flow** model. Everything else - margins, growth, WACC - is just machinery for estimating and discounting those future cash flows. You can run this end-to-end right now in the **DCF model in the Valuation Lab**.

## Why Discount at All?

A dollar next year is worth less than a dollar today, because today's dollar can be invested. The **discount rate** converts future dollars into today's dollars. We discount at the **WACC** (Weighted Average Cost of Capital) - the blended return debt and equity investors require. (WACC gets its own deep-dive in **fs301**.)

The present value of a future cash flow is: \`PV = CF / (1 + WACC)^t\` where t is the number of years away.

## The Five-Step DCF

1. **Project Free Cash Flow** for an explicit forecast period (typically 5 years). \`FCF = EBIT × (1 − Tax) + D&A − Capex − ΔNWC\`.
2. **Discount each year's FCF** back to today at the WACC.
3. **Estimate Terminal Value** - the value of all cash flows beyond year 5, via Gordon Growth: \`TV = FCF₅ × (1 + g) / (WACC − g)\`.
4. **Discount the terminal value** back to today.
5. **Sum to Enterprise Value**, subtract net debt to get **Equity Value**, divide by shares for **fair value per share**.

## Worked Example

A company with **$120M EBIT**, 21% tax, **$12M D&A**, **$12M capex**, **$8M** increase in working capital generates Year-1 FCF of roughly \`120×0.79 + 12 − 12 − 8 = $87M\`. Grow that, discount at a 9% WACC, add a terminal value, subtract net debt, divide by shares - and you have an intrinsic value to compare against the market price.

## The Terminal Value Problem

In most DCFs, **60–80% of the total value sits in the terminal value**. That should make you nervous: the bulk of your answer depends on assumptions about year 6 onward. This is why terminal growth must be modest - never above long-run GDP growth (~2.5%). A terminal growth rate above your WACC produces infinite value and is mathematically nonsense.

## Sensitivity Is the Point

A DCF is not a precision instrument; it is a *framework for disciplined thinking*. Small changes in WACC or terminal growth swing the output massively. That's why the Valuation Lab builds a live **sensitivity table** (WACC × terminal growth). Use the DCF to find the *range* of plausible values and the assumptions the price implies - not a single magic number.

## Common Mistakes

Hockey-stick revenue forecasts; terminal growth set too high; forgetting to subtract net debt; ignoring stock-based compensation. Garbage in, garbage out.

## How a PM Uses It

A fund manager rarely believes their own DCF to the cent. They use it to understand what the market is implicitly assuming, then ask: are those assumptions too optimistic or too pessimistic? Open the **DCF Lab**, load a real stock, and watch the fair value move as you change each input.`,

  fs202: `## Returns on Capital: The Quality Engine

Growth is only valuable if it is funded at a return above its cost. The three return ratios - **ROE, ROA, and ROIC** - measure how efficiently a company turns capital into profit. They are the heart of quality investing.

## ROE - Return on Equity

\`ROE = Net Income / Shareholders' Equity\`. It measures the return generated on the owners' capital. A sustained ROE above ~15% generally signals a high-quality business. But ROE has a flaw: **leverage flatters it**. A company can boost ROE simply by loading on debt, which raises risk without raising underlying quality.

The **DuPont decomposition** unpacks this: \`ROE = Net Margin × Asset Turnover × Equity Multiplier\`. The equity multiplier is the leverage term. If a high ROE is driven mostly by the equity multiplier, be cautious.

## ROA - Return on Assets

\`ROA = Net Income / Total Assets\`. Because the denominator is the whole asset base regardless of how it's financed, ROA strips out the leverage illusion. Banks run low ROA (~1%) on enormous balance sheets; asset-light software runs high ROA. Compare ROA only within an industry.

## ROIC - The Analyst's Favourite

\`ROIC = NOPAT / Invested Capital\`, where NOPAT = EBIT × (1 − tax) and invested capital = debt + equity − cash. ROIC measures the return on *all* capital deployed in operations, independent of capital structure. The decisive comparison is **ROIC versus WACC**:

- ROIC > WACC → the company **creates value** as it grows.
- ROIC < WACC → growth **destroys value** (it would be better off shrinking).

Worked example: a firm with **$120M EBIT**, 21% tax (NOPAT $94.8M) and **$600M invested capital** earns a **15.8% ROIC**. Against a 9% WACC, every dollar reinvested creates roughly 7 cents of value annually - a compounding machine.

## Benchmarks

Elite businesses sustain ROIC above 20% (think established software, luxury brands, payment networks). 10–15% is solid. Below WACC is a structural problem.

## Common Mistakes

Chasing high ROE without checking leverage; comparing ROA across industries; using a single year (use a 3–5 year average to smooth cycles); forgetting goodwill bloats invested capital after acquisitions.

## Where to Find It and How a PM Uses It

FinSight surfaces ROE, ROA and ROIC on the **Financials tab**. Quality-focused PMs screen for durable, high ROIC and rising invested capital - businesses that can reinvest at high rates compound shareholder wealth far faster than cheap-but-mediocre ones.`,

  fs203: `## Cash Is What You Actually Own

Free cash flow is the cash a business throws off after maintaining and growing its asset base. It is the number that pays dividends, funds buybacks, repays debt, and ultimately determines intrinsic value. Earnings are an opinion; free cash flow is closer to a fact.

## Defining FCF

The workhorse definition: \`FCF = Operating Cash Flow − Capex\`. A more granular version used in modelling: \`FCF = EBIT × (1 − Tax) + D&A − Capex − Change in Net Working Capital\`. Both aim at the same thing - cash available to capital providers after the business has been kept running and growing.

## Maintenance vs Growth Capex

A subtle but crucial distinction. **Maintenance capex** keeps the existing asset base productive; **growth capex** expands it. Reported capex lumps them together. A company spending heavily on *growth* capex may show weak FCF today but be building enormous future cash flow. Penalising it for low headline FCF would be a mistake. Conversely, a business whose maintenance capex keeps creeping up has a hidden treadmill.

## FCF Margin and Conversion

Two ratios matter. **FCF margin** = \`FCF / Revenue\` - how much of each sales dollar becomes free cash. **FCF conversion** = \`FCF / Net Income\` - how cleanly accounting profit turns into cash. Conversion consistently above ~90% signals high earnings quality; persistently below ~70% warrants investigation.

Worked example: **$60M FCF** on **$400M revenue** is a healthy 15% FCF margin. If net income is **$65M**, conversion is 92% - the earnings are real.

## Why FCF Beats Earnings

Cash flow is harder to manipulate. Aggressive revenue recognition inflates net income but not cash, so it shows up as a widening gap between earnings and OCF. The FCF yield - \`FCF / Market Cap\` - is also a clean, capital-structure-aware valuation signal: a 5%+ FCF yield on a growing business is attractive.

## Common Mistakes

1. Ignoring stock-based compensation, which is added back in OCF but is a real cost.
2. Treating a one-off working-capital release as sustainable FCF.
3. Forgetting that for high-growth firms, negative working-capital swings can temporarily mask strong economics.

## Where to Find It and How a PM Uses It

Build FCF from the cash flow statement on FinSight's **Financials tab** (OCF minus capex). FCF is the direct input to the **DCF model in the Valuation Lab** - when you load a stock, the Lab pulls the latest FCF as your historical anchor. A PM lives and dies by free cash flow: it funds the returns of capital that ultimately reward shareholders.`,

  fs204: `## Enterprise Value: Valuing the Whole Business

Market capitalisation values only the equity. **Enterprise Value (EV)** values the entire operating business - what it would cost to buy the whole thing, debt and all. It is the cleaner basis for comparing companies with different capital structures.

## The EV Bridge

\`EV = Market Cap + Total Debt − Cash & Equivalents\`. (Add minorities and preferred if present.) The logic: an acquirer assumes the target's debt but pockets its cash, so net debt is added to the equity price. Cash-rich companies have an EV *below* their market cap; heavily indebted ones an EV well above it.

Worked example: a company with **$4.0B market cap**, **$1.0B debt** and **$0.5B cash** has \`EV = 4.0 + 1.0 − 0.5 = $4.5B\`.

## Why EV Multiples Are Superior for Comparison

Because EV captures debt, EV-based multiples let you compare a debt-free company against a leveraged one fairly. The two most important:

- **EV/EBITDA** - the institutional standard (full lesson in **vm103**). EBITDA approximates pre-financing operating cash flow, so EV/EBITDA is capital-structure-neutral. Typical ranges: 6–10× mature/cyclical, 12–20×+ for high-growth.
- **EV/Sales** - for unprofitable or early-stage firms where EBITDA is meaningless.
- **EV/FCF** - arguably the purest, since FCF is the actual cash the whole enterprise produces.

## P/E vs EV/EBITDA

P/E is distorted by leverage and tax differences; two identical businesses with different debt loads will show different P/Es but similar EV/EBITDA. That's why M&A bankers and PE firms anchor on EV/EBITDA - it reflects the operating reality before financing choices.

## Common Mistakes

1. Comparing EV/EBITDA to P/E directly - they have different numerators and denominators.
2. Forgetting to net off cash - a cash-rich balance sheet makes a company look more expensive on market cap than it really is on EV.
3. Using EBITDA for capital-intensive businesses where heavy depreciation is a real economic cost (EV/EBIT or EV/FCF is better there).

## Where to Find It and How a PM Uses It

FinSight shows EV and EV multiples on the **Financials/Valuation tabs**, and the **Comps model in the Valuation Lab** builds a full peer EV/EBITDA table automatically. A PM uses EV multiples as the first cut in relative valuation and as the entry/exit metric in any buyout analysis.`,

  fs205: `## The Moat: Why Some Returns Persist

In a competitive market, high returns attract competition that competes them away. A **moat** is a structural feature that protects a company's returns on capital from that erosion. Warren Buffett popularised the term; the academic version is "sustainable competitive advantage." Moats are *why* a high ROIC can persist for a decade rather than a year.

## The Five Sources of Moat

1. **Intangible assets** - brands (LVMH), patents (pharma), regulatory licences. They let a company charge more or lock out rivals.
2. **Switching costs** - when leaving is painful or risky. Enterprise software (SAP, Salesforce) and banking relationships are sticky because migration is costly.
3. **Network effects** - the product gets more valuable as more people use it (Visa, exchanges, marketplaces). These are the most powerful moats because they strengthen with scale.
4. **Cost advantages** - structurally lower costs from scale, process, or unique resources (low-cost miners like BHP on the cost curve, or Costco's scale).
5. **Efficient scale** - a market only big enough to profitably support one or two players (pipelines, some utilities).

## How to Measure a Moat Quantitatively

A moat shows up in the numbers as **persistently high and stable ROIC** well above WACC, combined with **stable or rising gross margins** and **durable market share**. If ROIC is high but volatile, the advantage may be cyclical rather than structural. Look back 5–10 years: did the company defend its margins through a downturn and against new entrants?

Worked interpretation: a payments network sustaining 30%+ ROIC and expanding margins for a decade is displaying a network-effect moat in the data. A commodity producer with high returns only at the top of the cycle is not moated - it's just leveraged to the commodity.

## Moats Are Dynamic

Moats widen and narrow. Kodak's film moat evaporated; newspapers' classified-ad moat was destroyed by the internet. The analyst's job is to assess not just whether a moat exists today but whether it is **widening or eroding**. Ask: what would a well-funded competitor have to do to take share, and how hard is that?

## Common Mistakes

Confusing a *good product* with a moat (products get copied), or a *temporary lead* with a structural one. A great quarter is not a moat. Also: paying any price for a moat - even the best business is a bad investment at the wrong price.

## How a PM Uses It

Moat analysis is qualitative judgement disciplined by quantitative evidence (ROIC durability on FinSight's **Financials tab**). Quality-growth PMs will pay a premium multiple for a widening moat because it justifies a higher terminal value in the DCF and a longer runway of value-creating reinvestment.`,

  fs301: `## Beyond the Basics: Making the DCF Defensible

The basic DCF (fs201) gets the architecture right. This lesson hardens the two assumptions that drive most of the answer: the **discount rate (WACC)** and the **terminal value**. Get these wrong and the whole model is theatre. Practise everything here in the **DCF model in the Valuation Lab**.

## Building WACC From the Ground Up

WACC is the blended required return of all capital providers: \`WACC = (E/V) × Ke + (D/V) × Kd × (1 − Tax)\`, where E/V and D/V are the equity and debt weights.

**Cost of equity (Ke)** comes from CAPM: \`Ke = Rf + β × ERP\`.
- **Rf** (risk-free rate) - use the 10-year government bond yield (FinSight pre-populates this from FRED's 10Y).
- **β** (beta) - the stock's sensitivity to the market; pull it from the stock data.
- **ERP** (equity risk premium) - the extra return demanded for equity risk, historically ~5–6%.

Worked example: with **Rf = 4.5%**, **β = 1.2**, **ERP = 5.5%**: \`Ke = 4.5% + 1.2 × 5.5% = 11.1%\`. If the firm is 80% equity / 20% debt with a 5% pre-tax cost of debt and 21% tax: \`WACC = 0.8 × 11.1% + 0.2 × 5% × 0.79 = 9.67%\`.

## Terminal Value: Where the Money Hides

60–80% of a DCF's value typically sits beyond the forecast horizon. Two methods:

1. **Gordon Growth (perpetuity):** \`TV = FCF₅ × (1 + g) / (WACC − g)\`. The terminal growth rate **g** must be conservative - at or below long-run nominal GDP (~2.5%). Crucially, **g must be less than WACC** or the maths explodes.
2. **Exit Multiple:** \`TV = EBITDA₅ × terminal multiple\`. Ground the multiple in where mature peers actually trade. This is favoured in PE/banking because it's market-anchored.

Best practice: compute both and sanity-check that they imply similar values. A large gap means one of your assumptions is off.

## The Discipline of Sensitivity

Because WACC and g dominate the output, never present a single number. The Lab builds a 2-D **sensitivity table** - WACC ±2% against terminal growth ±1.5%. The spread reveals how fragile your conclusion is. If the stock only looks cheap in the bottom-left corner, your "buy" rests on heroic assumptions.

## Common Mistakes

Terminal growth ≥ WACC; using a book-value rather than market-value capital structure; a beta from too short a window; mismatching the cash flows (real vs nominal) with the discount rate; forgetting mid-year convention for a small precision gain.

## How a PM Uses It

Sophisticated investors run the DCF backwards too (see **Reverse DCF, fs302**) to extract the market's implied assumptions. The forward DCF tells you what *you* think it's worth; the reverse DCF tells you what the *market* already believes. The gap between them is the opportunity.`,

  fs302: `## Flipping the DCF on Its Head

A forward DCF asks "what is this worth?" - and is only as good as your growth guesses. The **Reverse DCF** asks a sharper question: "what growth rate does the current price already imply?" Instead of forecasting growth and solving for value, you take the market price as given and solve for the growth rate embedded in it. Run it live in the **Reverse DCF model in the Valuation Lab**.

## Why This Is So Powerful

Forecasting growth is where analysts fool themselves. The reverse DCF sidesteps that bias. You fix the boring, defensible inputs - WACC, terminal growth, margins, tax - and let the algorithm find the single revenue growth rate that makes the model's fair value equal today's price. Then you ask one judgement question: **is that implied growth realistic?**

## The Mechanics

Mathematically you're solving for **g** such that \`DCF(g) = Current Price\`. Since fair value rises monotonically with growth, a bisection search converges quickly (the Lab runs up to 100 iterations). The output is the **market-implied growth rate**.

## Interpreting the Result

Compare the implied rate against three anchors:
1. The company's **historical** revenue growth (last 3–5 years).
2. **Analyst consensus** forward estimates.
3. The **industry / GDP** growth ceiling.

The Lab labels the verdict:
- **Conservative** - implied growth below history/analysts → the market is sceptical; potential undervaluation.
- **Realistic** - implied growth within the plausible range → fairly priced.
- **Aggressive** - above both history and analysts → priced for perfection.
- **Unachievable** - implausibly high (e.g., 40%+ sustained) → likely overvalued.

Worked example: if a stock's price implies **18% annual revenue growth for five years**, but the company has grown 8% historically and analysts expect 10%, the market is pricing in a dramatic acceleration. Unless you have a specific, defensible reason that will happen, the risk is asymmetric to the downside.

## The Famous Case

The classic teaching example is a high-flying growth stock whose price implies it must capture an impossible share of its total addressable market. Reverse-DCF that, and the absurdity becomes explicit and quantifiable - far more persuasive than a hand-wave that it "looks expensive."

## Common Mistakes

Setting the fixed assumptions sloppily (a too-low WACC will make the implied growth look more reasonable than it is); ignoring margin assumptions; treating the implied rate as precise rather than indicative.

## How a PM Uses It

The reverse DCF is a brilliant *risk-management* tool. Before buying a richly-valued stock, a PM checks what growth the price assumes and asks whether that's a bet they want to make. It reframes "is it cheap?" into "what has to be true?" - a far more honest question.`,

  fs303: `## Reading Between the Lines

Most companies report honestly. A minority massage the numbers, and a few commit outright fraud. Forensic accounting is the skill of spotting the warning signs *before* the restatement, the profit warning, or the collapse. The tools are ratios and cross-checks that are hard to fake simultaneously.

## The Cash-vs-Earnings Divergence

The number-one red flag: **net income rising while operating cash flow stagnates or falls.** Real profits generate cash. When they don't, earnings are being manufactured through accruals. Track the gap over several quarters - a persistent and widening divergence is the loudest alarm in forensic analysis.

## Revenue-Side Warning Signs

- **Receivables growing faster than revenue** (Days Sales Outstanding rising) - the company may be booking sales it hasn't collected, or stuffing the channel.
- **Aggressive revenue recognition** - booking long-term contracts upfront, or "bill and hold" arrangements.
- A surge in "unbilled receivables" or contract assets.

## Margin and Inventory Signals

- **Inventory rising faster than sales** (Days Inventory climbing) - demand may be softening before management admits it; a write-down is coming.
- **Gross margins that are suspiciously smooth** while peers gyrate - possible cost capitalisation or cookie-jar reserves.

## The Beneish M-Score

A formal screen, the **M-Score** combines eight indices (DSO, gross margin, asset quality, sales growth, depreciation, SG&A, leverage, and total accruals) into a single probability of manipulation. A score above **−1.78** flags elevated risk. It famously would have caught Enron. Treat it as a smoke detector, not a verdict - it generates hypotheses to investigate, not conclusions.

## Capital-Structure and Disclosure Red Flags

- Frequent "one-time" charges that recur every period.
- Heavy reliance on non-GAAP/adjusted figures that strip out real costs (especially stock-based compensation).
- Auditor changes, CFO turnover, or late filings - governance smoke.
- Complex, opaque related-party transactions or off-balance-sheet vehicles (Enron's playbook).

## Worked Interpretation

A company reporting **20% earnings growth** but **flat operating cash flow**, **DSO up from 45 to 70 days**, and a fresh batch of "non-recurring" addbacks is showing three independent red flags. No single one is proof; three together demand you either understand exactly why, or walk away.

## Common Mistakes

Dismissing red flags because the stock is going up (fraud can persist for years); trusting management's narrative over the cash flow statement; analysing one ratio in isolation rather than the constellation.

## How a PM Uses It

Forensic screens are a *defensive* discipline. The goal isn't to predict every blow-up - it's to avoid the catastrophic single-name losses that destroy a track record. A PM runs these checks before sizing any large position, treating the cash flow statement as the ultimate referee.`,

  fs304: `## When One Multiple Won't Do

A conglomerate or multi-segment business is really several businesses stapled together, each with its own economics and appropriate valuation. Applying a single blended P/E or EV/EBITDA to the whole thing is lazy and usually wrong. **Sum-of-the-Parts (SOTP)** values each segment separately, then adds them up.

## The SOTP Process

1. **Identify the segments** from the segment disclosures in the annual report (revenue, EBIT, and often assets are broken out by division).
2. **Value each segment** with the multiple appropriate to *its* industry. A media conglomerate's streaming arm might deserve an EV/Sales multiple like a tech peer, while its cable division gets a low EV/EBITDA like a mature utility.
3. **Sum the segment EVs** to a total enterprise value.
4. **Bridge to equity value**: subtract net debt, unallocated corporate costs (capitalised), pension deficits, and any holding-company discount; add the value of non-core stakes or investments.
5. **Divide by shares** for fair value.

## Worked Example

A group has three segments. Segment A: **$200M EBITDA** × 12× = $2,400M. Segment B: **$150M EBITDA** × 7× = $1,050M. Segment C (high-growth): **$300M revenue** × 4× EV/Sales = $1,200M. Total EV = **$4,650M**. Subtract **$800M net debt** → equity value **$3,850M**. The blended approach might have valued the whole thing at 8× on $650M total EBITDA = $5,200M EV - overvaluing the slow segments and undervaluing the growth one.

## The Conglomerate Discount

Markets often value diversified groups *below* their SOTP because of complexity, cross-subsidisation, and capital-allocation concerns. This **conglomerate discount** (often 10–20%) is precisely why activist investors push for **break-ups and spin-offs** - to unlock the gap between the parts and the whole. SOTP is the activist's core weapon.

## Where SOTP Shines

Conglomerates (industrials, media), holding companies, and **resource companies with multiple assets** at different stages - though resource NAV has its own dedicated method (**vm202**). It's also essential when one division is loss-making and dragging the consolidated multiple, masking a valuable core.

## Common Mistakes

1. Forgetting unallocated corporate overhead - it's a real negative.
2. Double-counting cash or net debt.
3. Using peer multiples from the wrong point in *their* cycle.
4. Ignoring tax leakage and frictions on a hypothetical break-up.

## How a PM Uses It

SOTP is both a valuation method and a **catalyst thesis**: if the parts are worth materially more than the whole, a PM looks for the trigger (activist pressure, management change, a planned spin) that closes the gap. It turns a static valuation into an actionable event-driven idea.`,
}

// ============================================================================
// QUIZ_BANKS — 5 questions per topic. correct is 'A'|'B'|'C'|'D'.
// ============================================================================
export const QUIZ_BANKS = {
  asx101: [
    { question: 'The ASX 200 is dominated by which two sectors?', options: ['Technology and healthcare', 'Financials and materials', 'Utilities and energy', 'Consumer and industrials'], correct: 'B', explanation: 'Banks and miners make up roughly half the index.' },
    { question: 'Compared with the S&P 500, the ASX 200 is notably light on:', options: ['Banks', 'Technology', 'Miners', 'REITs'], correct: 'B', explanation: 'The ASX lacks the mega-cap tech that dominates the US market.' },
    { question: 'The ASX is best described as a:', options: ['High-growth tech market', 'High-yield, value-tilted market', 'Pure resources market', 'Bond-like market'], correct: 'B', explanation: 'High dividends and a value tilt characterise the ASX, partly due to franking.' },
    { question: 'A rare global-scale Australian growth company is:', options: ['CSL', 'A major bank', 'A small miner', 'A utility'], correct: 'A', explanation: 'CSL in healthcare/biotech is a standout global-scale exception.' },
    { question: 'The ASX 200 concentration creates which risk?', options: ['Too much diversification', 'A simultaneous hit from falling commodities AND rising rates', 'Excess tech exposure', 'No dividend income'], correct: 'B', explanation: 'With banks and miners as half the index, a rate-and-commodity shock has little to offset it.' },
  ],
  asx102: [
    { question: 'Dividend imputation (franking) is designed to remove:', options: ['Capital gains tax', 'The double-taxation of company profits', 'Brokerage fees', 'Stamp duty'], correct: 'B', explanation: 'Franking credits pass on company tax already paid, avoiding taxing the same profit twice.' },
    { question: 'A fully franked dividend carries credits for which corporate tax rate?', options: ['0%', '15%', '30%', '45%'], correct: 'C', explanation: 'Full franking reflects the 30% company tax rate.' },
    { question: 'A $0.70 fully franked dividend grosses up to:', options: ['$0.70', '$1.00', '$0.91', '$1.30'], correct: 'B', explanation: '0.70 / (1 − 0.30) = $1.00 grossed-up.' },
    { question: 'Franking credits are most valuable to an investor on:', options: ['The top tax rate', 'A low or zero effective tax rate (e.g., pension phase)', 'A foreign tax regime', 'No income at all and unable to file'], correct: 'B', explanation: 'Low-rate investors can claim the full credit, sometimes as a cash refund.' },
    { question: 'When comparing ASX income stocks, the correct measure is:', options: ['Cash yield only', 'Grossed-up (franked) yield', 'P/E only', 'Beta'], correct: 'B', explanation: 'Grossed-up yield reflects the true after-tax income to an Australian resident.' },
  ],
  asx103: [
    { question: 'Resource companies are best described as:', options: ['Price makers', 'Price takers with high operating leverage', 'Low-volatility defensives', 'Bond proxies'], correct: 'B', explanation: 'They cannot set commodity prices, and fixed costs create large operating leverage.' },
    { question: 'The most important concept in resource analysis is the:', options: ['Dividend yield', 'Cost curve position', 'P/E ratio', 'Beta'], correct: 'B', explanation: 'Low-cost producers survive downturns that wipe out high-cost rivals.' },
    { question: 'Iron ore rises from $90 to $120 for a miner with $40 costs. Its margin moves from:', options: ['$50 to $80', '$50 to $60', '$40 to $50', 'unchanged'], correct: 'A', explanation: 'Margin = price − cost: ($90−$40)=$50 to ($120−$40)=$80, a 60% jump on a 33% price move.' },
    { question: 'A low P/E on a miner at the TOP of the commodity cycle is usually:', options: ['A clear buy', 'A value trap as peak earnings will fall', 'A sign of a moat', 'Irrelevant'], correct: 'B', explanation: 'Peak earnings flatter the P/E; the cycle will turn down.' },
    { question: 'The best miners demonstrate capital discipline by:', options: ['Over-investing at the top of the cycle', 'Returning cash at the top rather than chasing the inevitable downturn', 'Ignoring the cost curve', 'Maximising debt at peaks'], correct: 'B', explanation: 'Disciplined miners return capital at peaks instead of building into oversupply.' },
  ],
  asx104: [
    { question: 'Net Interest Margin (NIM) measures:', options: ['Total assets', 'The spread between what a bank earns on loans and pays on deposits', 'The dividend yield', 'Loan losses'], correct: 'B', explanation: 'NIM is the core profitability spread of a bank.' },
    { question: 'Banks are primarily valued on:', options: ['EV/EBITDA', 'Price-to-book and ROE', 'EV/Sales', 'PEG'], correct: 'B', explanation: 'For banks, P/B and ROE are the relevant metrics, not EV/EBITDA.' },
    { question: 'The swing factor that crushes bank earnings in a recession is:', options: ['Rising NIM', 'A spike in bad and doubtful debts', 'Lower costs', 'Higher capital ratios'], correct: 'B', explanation: 'Loan-loss provisions surge in downturns, hitting profits hard.' },
    { question: 'Australian banks are effectively leveraged plays on:', options: ['Technology', 'The housing market', 'Gold', 'Oil'], correct: 'B', explanation: 'Mortgages dominate their loan books, tying them to housing and unemployment.' },
    { question: 'On a $900B loan book, a 10bps NIM increase adds roughly:', options: ['$9M', '$90M', '$900M', '$9B'], correct: 'C', explanation: '0.0010 × $900B = $900M of additional annual income.' },
  ],
  asx105: [
    { question: 'A capitalisation (cap) rate is:', options: ['Net rental income divided by property value', 'The dividend yield', 'The P/E of a REIT', 'The loan-to-value ratio'], correct: 'A', explanation: 'Cap rate = annual net rent / property value - the property yield.' },
    { question: 'When cap rates RISE, property values:', options: ['Rise', 'Fall', 'Stay flat', 'Double'], correct: 'B', explanation: 'Cap rates move inversely to values; rising cap rates devalue property.' },
    { question: 'NTA (Net Tangible Assets) for a REIT represents:', options: ['Net rental income', 'Property value minus debt, per share', 'The dividend', 'The cap rate'], correct: 'B', explanation: 'NTA is the per-share value of properties less debt - the key valuation anchor.' },
    { question: 'REITs are highly rate-sensitive for all these reasons EXCEPT:', options: ['Rising borrowing costs', 'Cap-rate expansion devaluing properties', 'Yields competing with bonds', 'They hold no property'], correct: 'D', explanation: 'REITs do hold property; the other three are the genuine rate sensitivities.' },
    { question: 'A REIT trading at $3.00 with NTA of $4.00 is at:', options: ['A 25% premium', 'A 25% discount to NTA', 'Fair value', 'A 33% premium'], correct: 'B', explanation: '3.00 / 4.00 = 0.75, a 25% discount - the market expects further value falls.' },
  ],
  asx106: [
    { question: 'Small caps offer opportunity mainly because they are:', options: ['Heavily covered by analysts', 'Under-researched and often mispriced', 'Always profitable', 'Low risk'], correct: 'B', explanation: 'Thin analyst coverage creates an information gap and mispricing.' },
    { question: 'A distinct small-cap risk is:', options: ['Too much liquidity', 'Liquidity risk and dilution from capital raises', 'Excess analyst coverage', 'No volatility'], correct: 'B', explanation: 'Thin trading and dilutive raises are core small-cap dangers.' },
    { question: 'A quality small-cap filter favours companies that are:', options: ['Burning cash with no path to profit', 'Profitable or self-funding with insider ownership', 'Reliant on constant capital raises', 'Run by absentee owners'], correct: 'B', explanation: 'Self-funding, founder-owned, profitable niches reduce the high failure rate.' },
    { question: 'The classic small-cap re-rating thesis is to own a quality business:', options: ['After it joins the ASX 200', 'Before it attracts institutional and analyst attention', 'Only at index inclusion', 'After three capital raises'], correct: 'B', explanation: 'Buying before broad coverage lets you capture the re-rating as the market notices.' },
    { question: 'Small caps can deliver outsized returns through:', options: ['Multiple expansion only', 'Both earnings growth AND multiple expansion as they scale', 'Dividends only', 'Share buybacks only'], correct: 'B', explanation: 'A scaling small cap can compound earnings while its multiple re-rates upward.' },
  ],
  vm101: [
    { question: 'Relative valuation (comps) values a company by:', options: ['Discounting its cash flows', 'Comparing its multiples to similar peers', 'Counting its assets', 'Its dividend only'], correct: 'B', explanation: 'Comps benchmark the subject against the multiples of comparable businesses.' },
    { question: 'When summarising peer multiples, the more robust statistic is the:', options: ['Mean', 'Median', 'Maximum', 'Sum'], correct: 'B', explanation: 'The median ignores outliers that distort the mean.' },
    { question: 'The most important determinant of a good comps analysis is:', options: ['Using many decimal places', 'Genuinely comparable peer selection', 'A long time period', 'Ignoring growth'], correct: 'B', explanation: 'Comps live or die on choosing truly similar peers.' },
    { question: 'A subject earns $500M EBITDA; peers trade at a median 10x EV/EBITDA. Implied EV is:', options: ['$50M', '$5.0B', '$500M', '$50B'], correct: 'B', explanation: '$500M × 10 = $5.0B enterprise value.' },
    { question: 'A risk of comps is that:', options: ['They are too slow', 'The whole peer group may be overvalued, so cheap-vs-peers is not truly cheap', 'They ignore the market', 'They require no peers'], correct: 'B', explanation: 'Relative value says nothing about absolute value if the sector is mispriced.' },
  ],
  vm102: [
    { question: 'The Gordon Growth DDM formula is:', options: ['D1 / (Ke − g)', 'D1 × (Ke − g)', 'D1 / Ke', 'Ke / g'], correct: 'A', explanation: 'Price = next dividend divided by (required return minus growth).' },
    { question: 'A $2.00 dividend growing 4% with a 9% required return is worth:', options: ['$41.60', '$22.00', '$52.50', '$20.80'], correct: 'A', explanation: 'D1 = 2.08; 2.08 / (0.09 − 0.04) = $41.60.' },
    { question: 'The DDM breaks down when:', options: ['g is below Ke', 'g is greater than or equal to Ke', 'Dividends are stable', 'Ke is positive'], correct: 'B', explanation: 'If g >= Ke the denominator is zero or negative, giving a nonsensical value.' },
    { question: 'The sustainable growth rate is estimated as:', options: ['ROE × (1 − payout ratio)', 'P/E × growth', 'Dividend / price', 'Ke − Rf'], correct: 'A', explanation: 'Retained earnings (ROE times the retention ratio) fund sustainable growth.' },
    { question: 'For ASX dividend stocks, the DDM should also account for:', options: ['Stock splits', 'Franking credits, which raise the effective yield', 'Beta only', 'Volume'], correct: 'B', explanation: 'Franking materially increases the value of a franked payout to Australian investors.' },
  ],
  vm103: [
    { question: 'Enterprise Value is:', options: ['Market Cap + Debt − Cash', 'Market Cap − Debt', 'Net Income × P/E', 'EBITDA × 10'], correct: 'A', explanation: 'EV captures the whole capital structure: equity plus net debt.' },
    { question: 'EV/EBITDA is preferred over P/E because it is:', options: ['Always lower', 'Capital-structure and tax neutral', 'Based on book value', 'Easier to game'], correct: 'B', explanation: 'EBITDA is pre-interest and pre-tax, and EV captures debt, neutralising financing differences.' },
    { question: 'EV/EBITDA is a POOR measure for:', options: ['Asset-light software', 'Highly capital-intensive firms where depreciation is a real cost', 'Mature staples', 'Payment networks'], correct: 'B', explanation: 'EBITDA adds back depreciation, which is a genuine recurring cost for capital-heavy businesses.' },
    { question: 'Two firms with $200M EBITDA differ only in debt. On EV/EBITDA they look:', options: ['Very different', 'Similar, because EV adds the debt back in', 'Impossible to compare', 'Identical to their P/E'], correct: 'B', explanation: 'EV/EBITDA sees through leverage that distorts P/E.' },
    { question: 'A typical EV/EBITDA for a high-growth software firm might be:', options: ['2x', '6x', '15-25x or more', '0.5x'], correct: 'C', explanation: 'High growth commands premium multiples, often 15-25x+.' },
  ],
  vm104: [
    { question: 'The PEG ratio is calculated as:', options: ['P/E ÷ growth rate', 'P/E × growth rate', 'Growth ÷ P/E', 'Price ÷ EBITDA'], correct: 'A', explanation: 'PEG divides the P/E by the earnings growth rate to contextualise the multiple.' },
    { question: 'A PEG around 1.0 is generally interpreted as:', options: ['Very expensive', 'Roughly fair value for the growth', 'Deeply undervalued', 'A sell signal'], correct: 'B', explanation: 'Peter Lynch\\u2019s rule of thumb: a PEG near 1 suggests fair value.' },
    { question: 'A stock with a 28x P/E growing at 30% has a PEG of:', options: ['0.9', '1.9', '8.4', '0.3'], correct: 'A', explanation: '28 / 30 = 0.93, reasonable for that growth.' },
    { question: 'A key weakness of PEG is that it:', options: ['Ignores the P/E', 'Depends on unreliable growth forecasts and ignores risk', 'Cannot be calculated', 'Only works for banks'], correct: 'B', explanation: 'PEG hinges on forecast growth and treats risky and safe growth as equal.' },
    { question: 'PEG breaks down for companies with:', options: ['Steady 10% growth', 'Low or negative growth', 'High ROE', 'Strong dividends'], correct: 'B', explanation: 'With near-zero or negative growth the ratio becomes meaningless.' },
  ],
  vm201: [
    { question: 'In an LBO, a company is acquired primarily using:', options: ['All equity', 'A large amount of debt (leverage)', 'Only retained earnings', 'Government grants'], correct: 'B', explanation: 'Leverage - substantial debt - is the defining feature of an LBO.' },
    { question: 'MOIC is calculated as:', options: ['Exit equity ÷ entry equity', 'Entry equity ÷ exit equity', 'IRR × years', 'EBITDA × multiple'], correct: 'A', explanation: 'Multiple of Invested Capital = exit equity divided by entry equity.' },
    { question: 'The typical PE IRR hurdle is around:', options: ['5%', '10%', '20-25%', '50%'], correct: 'C', explanation: 'Private equity firms typically target a 20-25% IRR.' },
    { question: 'The LEAST reliable lever of LBO returns is:', options: ['Debt paydown', 'EBITDA growth', 'Multiple expansion', 'Cost cuts'], correct: 'C', explanation: 'Selling at a higher multiple than you paid is the least dependable source of return.' },
    { question: 'Leverage above roughly which level is flagged as aggressive?', options: ['2x EBITDA', '4x EBITDA', '7x EBITDA', '1x EBITDA'], correct: 'C', explanation: 'Leverage above about 7x EBITDA is aggressive and raises default risk.' },
  ],
  vm202: [
    { question: 'NAV is the preferred method for resource companies because:', options: ['Earnings are stable', 'Assets are finite and earnings are cycle-distorted', 'They pay no dividends', 'They have no debt'], correct: 'B', explanation: 'Finite, depleting assets and volatile earnings make multiples unreliable; NAV models each asset directly.' },
    { question: 'NAV is essentially a:', options: ['Single-year P/E', 'Sum-of-the-parts DCF of each resource asset', 'Dividend model', 'Book-value calculation'], correct: 'B', explanation: 'Each mine or field is modelled over its life and discounted, then summed.' },
    { question: 'Resource companies are headlined on which valuation metric?', options: ['P/E', 'Price/NAV', 'EV/Sales', 'PEG'], correct: 'B', explanation: 'P/NAV is the resource analyst\\u2019s headline metric, like P/B for banks.' },
    { question: 'The single biggest swing factor in a resource NAV is the:', options: ['Dividend', 'Long-term commodity price assumption', 'Share count', 'Tax rate'], correct: 'B', explanation: 'NAV is extremely sensitive to the assumed commodity price deck.' },
    { question: 'A miner trading at 0.8x NAV is:', options: ['At a premium', 'At a discount - but check the price deck is realistic', 'Overvalued for certain', 'Debt-free for certain'], correct: 'B', explanation: 'A discount to NAV may be opportunity or may reflect an optimistic price assumption.' },
  ],
  vm203: [
    { question: 'A professional investment thesis must include:', options: ['Only a price target', 'A quality assessment, valuation, catalyst, and defined risk', 'Just a chart', 'Only the dividend'], correct: 'B', explanation: 'A full thesis covers the business, the edge, valuation, a catalyst, and the risks.' },
    { question: 'The "kill criterion" is:', options: ['A profit target', 'A pre-defined condition that would prove the thesis wrong and trigger an exit', 'A stock split', 'A dividend cut'], correct: 'B', explanation: 'Defining in advance what disproves the thesis defeats rationalisation and enforces discipline.' },
    { question: 'Without a catalyst, a cheap stock can:', options: ['Always re-rate immediately', 'Stay cheap for years', 'Never fall further', 'Guarantee returns'], correct: 'B', explanation: 'A catalyst is what causes the market to recognise the value; without one, cheap can persist.' },
    { question: 'A robust thesis triangulates valuation using:', options: ['One method only', 'DCF, comps, and a reverse DCF together', 'Only technicals', 'Only the P/E'], correct: 'B', explanation: 'Cross-checking intrinsic, relative, and implied-expectation views strengthens conviction.' },
    { question: 'The final step that turns a thesis into a portfolio decision is:', options: ['Ignoring risk', 'Position sizing by conviction and risk-reward', 'Buying the maximum always', 'Avoiding any sizing'], correct: 'B', explanation: 'Sizing translates conviction and asymmetry into how much to own.' },
  ],
  ma101: [
    { question: 'When interest rates rise, the present value of distant cash flows:', options: ['Rises', 'Falls - hurting long-duration growth stocks most', 'Is unaffected', 'Doubles'], correct: 'B', explanation: 'A higher discount rate shrinks PV, and cash flows far in the future are hit hardest.' },
    { question: 'Which stock type is generally MOST sensitive to rising rates?', options: ['A utility with near-term dividends', 'A long-duration growth stock', 'A value stock with current earnings', 'A cash-rich bank'], correct: 'B', explanation: 'Most of a growth stock value sits in distant years, so a higher discount rate hits it hardest.' },
    { question: 'The equity risk premium is:', options: ['The dividend yield', 'The extra return equities must offer over bonds', 'The inflation rate', 'The Fed Funds rate'], correct: 'B', explanation: 'It is the additional return investors demand for taking equity risk versus risk-free bonds.' },
    { question: 'Rising rates hurt stocks through TWO channels:', options: ['Dividends and buybacks', 'A higher discount rate and slower earnings', 'Volume and volatility', 'Splits and spinoffs'], correct: 'B', explanation: 'Higher rates raise the discount rate AND slow the economy, hitting earnings.' },
    { question: 'In a rising-rate regime, PMs often rotate toward:', options: ['Profitless tech', 'Value and financials with shorter-duration cash flows', 'Long-duration growth', 'Zero-dividend startups'], correct: 'B', explanation: 'Value, financials, and short-duration cash flows are more resilient when rates rise.' },
  ],
  ma102: [
    { question: 'Core CPI differs from headline CPI because it excludes:', options: ['Housing', 'Volatile food and energy', 'Services', 'Healthcare'], correct: 'B', explanation: 'Core strips out food and energy to reveal the underlying inflation trend.' },
    { question: 'The central bank reaction function says that when inflation runs above target, the bank will:', options: ['Cut rates', 'Raise rates to cool demand', 'Do nothing', 'Buy stocks'], correct: 'B', explanation: 'Above-target inflation prompts rate hikes to slow demand.' },
    { question: 'A hot CPI print typically sinks stocks because it implies:', options: ['Lower earnings forever', 'More rate hikes ahead', 'A dividend cut', 'A stock split'], correct: 'B', explanation: 'Markets fall on the implied tighter policy, not the inflation number itself.' },
    { question: 'CPI comes in at 4.2% vs 3.5% expected. The likely immediate reaction is:', options: ['Bond yields fall, tech rallies', 'Bond yields rise, long-duration tech sells off', 'No reaction', 'Gold collapses'], correct: 'B', explanation: 'An upside surprise lifts yields and pressures rate-sensitive growth stocks.' },
    { question: 'The Fed primarily targets which inflation measure?', options: ['CPI', 'PCE, aiming near 2%', 'PPI', 'GDP deflator only'], correct: 'B', explanation: 'The Fed targets roughly 2% PCE inflation.' },
  ],
  ma103: [
    { question: 'Which sectors typically lead EARLY in the cycle (recovery)?', options: ['Utilities and staples', 'Financials, discretionary, industrials, tech', 'Only healthcare', 'Only energy'], correct: 'B', explanation: 'Early-cycle leadership comes from rate-sensitive cyclicals as growth accelerates.' },
    { question: 'Defensive sectors include:', options: ['Discretionary and materials', 'Utilities, staples, and healthcare', 'Financials and energy', 'Technology and industrials'], correct: 'B', explanation: 'Defensives have steady demand regardless of the cycle and cushion downturns.' },
    { question: 'Because markets lead the economy by 6-9 months, sector rotation must:', options: ['Wait for confirmed data', 'Anticipate the next phase before it is obvious', 'Ignore the cycle', 'Only buy after a recovery'], correct: 'B', explanation: 'You buy early-cycle sectors during the recession, before the recovery is confirmed.' },
    { question: 'In a late-cycle environment, which sectors tend to lead?', options: ['Discretionary and tech', 'Energy, materials, healthcare', 'Only utilities', 'Communication services'], correct: 'B', explanation: 'Late cycle favours energy and materials (inflation) plus defensive healthcare.' },
    { question: 'Cyclical sectors are best described as:', options: ['Steady regardless of the economy', 'Amplifying the economy - soaring in booms, slumping in recessions', 'Always outperforming', 'Bond-like'], correct: 'B', explanation: 'Cyclicals magnify the economic cycle, unlike steady defensives.' },
  ],
  ma201: [
    { question: 'An inverted yield curve means:', options: ['Long yields exceed short yields', 'Short-term yields exceed long-term yields', 'All yields are equal', 'Yields are zero'], correct: 'B', explanation: 'Inversion is when short rates sit above long rates, a classic recession warning.' },
    { question: 'The classic recession-signal spread is:', options: ['3-month vs 1-year', '2-year vs 10-year', '5-year vs 5-year', 'Fed Funds vs CPI'], correct: 'B', explanation: 'A negative 2Y/10Y spread (10Y minus 2Y below zero) is the classic inversion measure.' },
    { question: 'Historically, recession follows yield-curve inversion by about:', options: ['1 week', '1 month', '12-24 months', '10 years'], correct: 'C', explanation: 'Inversion is an early warning with a long and variable lag.' },
    { question: 'Inversion predicts recession because it implies investors expect the central bank to:', options: ['Raise rates further', 'Cut rates in the future amid weakness', 'Buy stocks', 'Do nothing'], correct: 'B', explanation: 'Low long rates reflect expected future cuts, which only happen if growth weakens.' },
    { question: 'A 2Y at 4.8% and 10Y at 4.3% gives a 2Y/10Y spread of:', options: ['+0.5%', '−0.5% (inverted)', '0%', '+9.1%'], correct: 'B', explanation: '10Y minus 2Y = 4.3 − 4.8 = −0.5%, an inverted curve.' },
  ],
  ma202: [
    { question: 'The RBA sets which benchmark rate?', options: ['The Fed Funds rate', 'The cash rate', 'The prime rate', 'The repo rate'], correct: 'B', explanation: 'The Reserve Bank of Australia sets the cash rate, its policy benchmark.' },
    { question: 'The ASX 200 is especially rate-sensitive because it is heavy in:', options: ['Biotech and semiconductors', 'Banks and REITs', 'Streaming and gaming', 'Airlines'], correct: 'B', explanation: 'Banks (about a quarter of the index) and rate-sensitive REITs dominate the ASX.' },
    { question: 'Australian rate changes transmit to consumers quickly because most mortgages are:', options: ['Fixed for 30 years', 'Variable-rate', 'Interest-free', 'Government-paid'], correct: 'B', explanation: 'Predominantly variable mortgages pass RBA moves to households almost immediately.' },
    { question: 'Rising rates generally pressure REITs because:', options: ['Their tenants leave', 'Borrowing costs rise and their yields look less attractive vs bonds', 'They pay no dividends', 'They have no debt'], correct: 'B', explanation: 'Higher rates lift REIT financing costs and reduce the relative appeal of their yields.' },
    { question: 'The RBA-Fed rate differential primarily drives:', options: ['Iron ore prices', 'The AUD exchange rate', 'US inflation', 'ASX trading hours'], correct: 'B', explanation: 'A wider US-Australia rate gap tends to weaken the Australian dollar.' },
  ],
  ma203: [
    { question: 'The AUD is best described as a:', options: ['Safe-haven currency', 'Commodity and risk-on currency', 'Pegged currency', 'Deflationary currency'], correct: 'B', explanation: 'The AUD strengthens on rising commodities and risk appetite, and falls in risk-off moves.' },
    { question: 'A FALLING AUD is a tailwind for:', options: ['Domestic importers', 'Exporters and offshore earners like BHP and CSL', 'Local retailers', 'Bond investors'], correct: 'B', explanation: 'USD-denominated revenue translates into more AUD when the AUD falls.' },
    { question: 'If BHP sells iron ore in USD and the AUD falls from 0.72 to 0.65, its reported AUD earnings:', options: ['Fall', 'Rise without any extra production', 'Stay flat', 'Go to zero'], correct: 'B', explanation: 'The same USD revenue converts into more AUD, boosting reported profit.' },
    { question: 'A STRONGER AUD tends to benefit:', options: ['Miners', 'Importers and domestic retailers', 'Energy exporters', 'Offshore earners'], correct: 'B', explanation: 'A higher AUD makes imported goods cheaper, helping importers and retailers.' },
    { question: 'Which is NOT a primary driver of the AUD?', options: ['Commodity prices', 'Interest rate differentials', 'Global risk sentiment', 'The ASX trading calendar'], correct: 'D', explanation: 'Commodities, rate differentials, and risk appetite drive the AUD; the trading calendar does not.' },
  ],
  ma204: [
    { question: 'Geopolitical events move markets primarily through:', options: ['Software stocks', 'Commodities, which are physical and supply-sensitive', 'Bond coupons', 'Dividend dates'], correct: 'B', explanation: 'Physical, location-bound commodities react sharply to supply shocks.' },
    { question: 'Which asset is the classic safe haven during geopolitical stress?', options: ['Small-cap tech', 'Gold', 'High-yield bonds', 'Airlines'], correct: 'B', explanation: 'Gold rises during stress and currency debasement as a store of value.' },
    { question: 'For the ASX, the dominant swing variable for iron ore demand is:', options: ['Europe', 'China', 'Japan', 'Brazil'], correct: 'B', explanation: 'China consumes most seaborne iron ore, dominating BHP, RIO, and FMG fortunes.' },
    { question: 'A 15% spike in oil typically causes:', options: ['Airlines to rally', 'Energy stocks up, airlines and discretionary down, inflation up', 'Gold to crash', 'Lower bond yields only'], correct: 'B', explanation: 'Higher oil helps energy but squeezes fuel-sensitive sectors and lifts inflation.' },
    { question: 'A Chinese property stimulus would most directly lift:', options: ['Australian banks only', 'Iron ore and Australian miners', 'US utilities', 'Gold miners only'], correct: 'B', explanation: 'Chinese construction demand drives iron ore and the major Australian miners.' },
  ],
  ma301: [
    { question: 'The single most important capital-flow signal is the:', options: ['Oil price', 'US dollar', 'VIX', 'Copper price'], correct: 'B', explanation: 'As the reserve currency, the USD direction governs global capital flows.' },
    { question: 'A STRONG US dollar tends to:', options: ['Boost emerging markets', 'Pull capital out of EM and pressure commodities', 'Lower US rates', 'Raise gold sharply'], correct: 'B', explanation: 'A strong dollar tightens global conditions and pressures EM and commodities.' },
    { question: 'In risk-off periods, capital flows toward:', options: ['Emerging markets and the AUD', 'Safe havens like US Treasuries, the USD, gold, and the yen', 'Small caps', 'Commodity currencies'], correct: 'B', explanation: 'Flights to safety favour reserve assets and havens.' },
    { question: 'For the ASX, a WEAK US dollar is generally:', options: ['A headwind', 'A tailwind, lifting commodities and the AUD', 'Irrelevant', 'Deflationary'], correct: 'B', explanation: 'Dollar weakness supports commodities and the AUD, helping the resource-heavy ASX.' },
    { question: 'Capital chases all of these EXCEPT:', options: ['Higher real yields', 'Faster growth', 'Higher risk-adjusted returns', 'Older companies regardless of returns'], correct: 'D', explanation: 'Flows seek yield, growth, and risk-adjusted return - not age.' },
  ],
  ma302: [
    { question: 'Quantitative Easing involves the central bank:', options: ['Selling bonds to drain cash', 'Creating money to buy bonds, injecting liquidity', 'Raising the policy rate', 'Issuing equities'], correct: 'B', explanation: 'QE buys bonds with new money, lowering yields and injecting liquidity.' },
    { question: 'QE lifts equities partly by:', options: ['Cutting dividends', 'Forcing investors out the risk curve as bond yields fall', 'Raising taxes', 'Reducing buybacks'], correct: 'B', explanation: 'With bond yields crushed, capital is pushed into equities and credit.' },
    { question: 'Quantitative Tightening (QT):', options: ['Expands the balance sheet', 'Shrinks the balance sheet and withdraws liquidity', 'Always lowers volatility', 'Cuts interest rates'], correct: 'B', explanation: 'QT drains liquidity by letting bonds roll off or selling them.' },
    { question: 'During QT, which stocks typically fall hardest?', options: ['Cash-rich quality names', 'Speculative, profitless growth stocks', 'Dividend aristocrats', 'Consumer staples'], correct: 'B', explanation: 'The riskiest assets that thrived on free liquidity are repriced first.' },
    { question: 'A useful mental model is that QE is a ___ and QT is a ___:', options: ['Headwind; tailwind', 'Rising tide; ebbing tide', 'Tax; subsidy', 'Split; merger'], correct: 'B', explanation: 'QE lifts all assets like a rising tide; QT exposes weak valuations as it ebbs.' },
  ],
  ma303: [
    { question: 'Top-down investing starts with:', options: ['Picking a single stock', 'The macro regime and asset allocation', 'Technical chart patterns', 'Dividend dates'], correct: 'B', explanation: 'It begins with the big picture, then narrows to sectors and stocks.' },
    { question: 'Research shows that most portfolio return variation comes from:', options: ['Individual stock picks', 'Asset allocation and sector positioning', 'Trading frequency', 'Brokerage choice'], correct: 'B', explanation: 'Allocation and sector weights explain the majority of returns.' },
    { question: 'The ideal approach blends top-down with:', options: ['More top-down', 'Bottom-up stock selection within favoured areas', 'Random selection', 'Index-only investing'], correct: 'B', explanation: 'Top-down sets where to fish; bottom-up picks the best fish.' },
    { question: 'In an early-cycle setup (cooling inflation, cuts coming, curve steepening), the framework suggests:', options: ['Maximum defensiveness', 'Raising equity exposure and tilting to cyclicals', 'Selling all stocks', 'Buying only utilities'], correct: 'B', explanation: 'Early-cycle conditions favour more risk and cyclical leadership.' },
    { question: 'A key risk of being purely bottom-up is:', options: ['Too much macro forecasting', 'Ignoring the macro tide and cycle', 'Over-diversification', 'Holding too much cash'], correct: 'B', explanation: 'A great stock in the wrong regime and sector can still lose money.' },
  ],
  ta101: [
    { question: 'On a candlestick, the body represents:', options: ['The high and low', 'The open and close', 'Only the close', 'The volume'], correct: 'B', explanation: 'The body spans open to close; the wicks reach to the high and low.' },
    { question: 'A hammer candle after a downtrend suggests:', options: ['Continuation of the decline', 'A potential bullish reversal as buyers absorb selling', 'Indecision only', 'A dividend cut'], correct: 'B', explanation: 'The long lower wick shows buyers stepped in hard - a reversal signal needing confirmation.' },
    { question: 'A doji is characterised by:', options: ['A very large body', 'Open ≈ close (a tiny body)', 'No wicks', 'A gap up'], correct: 'B', explanation: 'A doji shows indecision - open and close are nearly equal.' },
    { question: 'The professional rule for trading candlestick signals is:', options: ['Trade every signal immediately', 'Require confirmation from the next candle', 'Ignore the trend', 'Use only 1-minute charts'], correct: 'B', explanation: 'A single candle is a hypothesis; the following candle confirms it.' },
    { question: 'A bullish engulfing pattern is most significant when it occurs:', options: ['In the middle of a range', 'At a support level after a decline', 'On low volume', 'Randomly'], correct: 'B', explanation: 'Candles carry most signal at levels that already matter, like support after a downtrend.' },
  ],
  ta102: [
    { question: 'The polarity principle states that:', options: ['Support and resistance never change', 'Broken resistance becomes support and vice versa', 'Volume is irrelevant', 'Levels must be exact prices'], correct: 'B', explanation: 'Role reversal - old resistance becomes new support after a breakout - is a high-probability setup.' },
    { question: 'Support and resistance should be treated as:', options: ['Exact single prices', 'Zones rather than precise lines', 'Irrelevant in trends', 'Only round numbers'], correct: 'B', explanation: 'Price often overshoots slightly, so levels are best viewed as bands.' },
    { question: 'A level becomes MORE significant when it:', options: ['Is touched once', 'Is tested multiple times on high volume', 'Is a random price', 'Has no volume'], correct: 'B', explanation: 'Repeated tests on conviction (volume) strengthen a level - until it finally breaks.' },
    { question: 'A stock breaks resistance at $100, pulls back, and $100 holds. This retest is:', options: ['A sell signal', 'A textbook risk-defined entry', 'Meaningless', 'A death cross'], correct: 'B', explanation: 'Old resistance ($100) acting as new support gives a precise entry with a nearby stop.' },
    { question: 'A common mistake with support/resistance is:', options: ['Using zones', 'Checking volume', 'Drawing so many lines the chart loses meaning', 'Watching round numbers'], correct: 'C', explanation: 'Over-drawing levels makes the analysis useless - focus on the few that matter.' },
  ],
  ta103: [
    { question: 'The single most-watched moving average in markets is the:', options: ['5-day', '20-day', '200-day', '500-day'], correct: 'C', explanation: 'The 200-day SMA defines the long-term trend and is the most-watched line.' },
    { question: 'An EMA differs from an SMA because it:', options: ['Ignores recent prices', 'Weights recent prices more heavily and reacts faster', 'Uses volume', 'Is always higher'], correct: 'B', explanation: 'The exponential MA gives more weight to recent data, making it more responsive.' },
    { question: 'A "Golden Cross" is:', options: ['50-day crossing below 200-day', '50-day crossing above 200-day', 'Price hitting an all-time high', 'RSI above 70'], correct: 'B', explanation: 'The 50-day crossing above the 200-day is a classic (lagging) bullish signal.' },
    { question: 'A stock at $110 with a 200-day SMA at $100 is:', options: ['10% below trend', '10% above its long-term trend - extended', 'In a downtrend', 'At fair value by DCF'], correct: 'B', explanation: 'Price 10% above the 200-day confirms an uptrend but warns of being extended.' },
    { question: 'Moving averages perform WORST in:', options: ['Strong uptrends', 'Strong downtrends', 'Choppy, sideways markets', 'High-volume trends'], correct: 'C', explanation: 'In range-bound markets MAs whipsaw; they only add value in trends.' },
  ],
  ta104: [
    { question: 'In a healthy uptrend, volume should:', options: ['Be higher on down-days', 'Be higher on up-days than down-days', 'Be constant', 'Be ignored'], correct: 'B', explanation: 'Volume confirming the trend - heavier on up-days - shows buyers are in control.' },
    { question: 'A breakout above resistance is most credible when it occurs on:', options: ['Declining volume', 'A surge in volume', 'No volume', 'A holiday'], correct: 'B', explanation: 'Volume confirms real demand pushed price through; weak-volume breakouts often fail.' },
    { question: 'On-Balance Volume (OBV) is constructed by:', options: ['Averaging prices', 'Adding volume on up-days and subtracting on down-days', 'Counting candles', 'Multiplying price by P/E'], correct: 'B', explanation: 'OBV is a running total revealing accumulation or distribution beneath the price.' },
    { question: 'A volume spike at the end of a long decline often marks:', options: ['A blow-off top', 'A capitulation bottom', 'Nothing', 'A dividend'], correct: 'B', explanation: 'Panic selling on huge volume frequently signals exhaustion and a bottom.' },
    { question: 'Price making new highs while volume shrinks is:', options: ['Bullish confirmation', 'A warning (bearish divergence)', 'Irrelevant', 'A golden cross'], correct: 'B', explanation: 'Fading volume on new highs signals the move is losing fuel.' },
  ],
  ta201: [
    { question: 'An RSI reading above 70 indicates the stock is:', options: ['Oversold', 'Overbought', 'Fairly valued', 'About to pay a dividend'], correct: 'B', explanation: 'RSI > 70 flags overbought momentum - a warning, not an automatic sell.' },
    { question: 'In a strong uptrend, an overbought RSI:', options: ['Is always a sell signal', 'Can remain overbought for weeks', 'Means the trend is over', 'Is impossible'], correct: 'B', explanation: '"Overbought can stay overbought" - shorting strength in a bull trend loses money.' },
    { question: 'Bearish RSI divergence occurs when:', options: ['Price and RSI both make new highs', 'Price makes a new high but RSI makes a lower high', 'RSI hits 50', 'Volume spikes'], correct: 'B', explanation: 'Fading momentum (lower RSI high) on a new price high warns of a reversal.' },
    { question: 'The standard RSI period is:', options: ['7', '14', '50', '200'], correct: 'B', explanation: 'RSI 14 is the default; shorter periods are noisier.' },
    { question: 'The RSI centreline at 50 separates:', options: ['Overbought from oversold', 'Bullish from bearish momentum', 'Support from resistance', 'Trend from range'], correct: 'B', explanation: 'Above 50 is bullish momentum; below 50 is bearish.' },
  ],
  ta202: [
    { question: 'The MACD line is calculated as:', options: ['12-EMA − 26-EMA', '50-SMA − 200-SMA', 'RSI − 50', 'Price − volume'], correct: 'A', explanation: 'MACD line = 12-period EMA minus 26-period EMA.' },
    { question: 'The MACD histogram represents:', options: ['Price minus volume', 'MACD line minus signal line', 'The 9-EMA alone', 'Open minus close'], correct: 'B', explanation: 'The histogram is the gap between the MACD and signal lines - a momentum gauge.' },
    { question: 'A bullish MACD signal is the MACD line:', options: ['Crossing below the signal line', 'Crossing above the signal line', 'Touching zero only', 'Going vertical'], correct: 'B', explanation: 'MACD crossing above its signal line indicates upward momentum.' },
    { question: 'The earliest momentum tell in MACD is usually the:', options: ['Zero-line cross', 'Histogram peaking and turning', 'Signal line', 'Volume'], correct: 'B', explanation: 'The histogram turns before the crossover, giving the earliest warning.' },
    { question: 'The standard MACD settings are:', options: ['9/12/26', '12/26/9', '14/50/200', '5/10/20'], correct: 'B', explanation: '12 and 26 for the EMAs, 9 for the signal line.' },
  ],
  ta203: [
    { question: 'Bollinger Bands are typically set at:', options: ['1 SD from a 10-SMA', '2 standard deviations from a 20-SMA', '3 SD from a 50-SMA', 'Fixed % from price'], correct: 'B', explanation: 'Standard settings: a 20-period SMA with bands at ±2 standard deviations.' },
    { question: 'A "Bollinger squeeze" signals:', options: ['The trend has ended', 'Low volatility - a big move is likely coming', 'An immediate sell', 'High dividends'], correct: 'B', explanation: 'Narrowing bands mean volatility is compressing and energy is building for a breakout.' },
    { question: 'In a strong uptrend, price tagging the upper band:', options: ['Is always a reversal', 'Can "walk the band" higher - not an automatic sell', 'Means oversold', 'Signals a squeeze'], correct: 'B', explanation: 'In trends price rides the band; a touch alone is not a reversal signal.' },
    { question: 'Roughly what percentage of price action stays within 2-SD Bollinger Bands?', options: ['50%', '68%', '95%', '100%'], correct: 'C', explanation: 'About 95% of observations fall within two standard deviations.' },
    { question: 'The squeeze tells you ___ but not ___:', options: ['Direction; timing', 'That a move is coming; the direction', 'Price; volume', 'Nothing useful', ], correct: 'B', explanation: 'A squeeze signals an imminent move but not which way - wait for the breakout.' },
  ],
  ta204: [
    { question: 'The most-watched Fibonacci retracement level is:', options: ['23.6%', '38.2%', '61.8%', '78.6%'], correct: 'C', explanation: 'The 61.8% "golden ratio" level is the most closely watched; holding it often resumes the trend.' },
    { question: 'A stock rallies $50→$70. The 50% retracement sits at:', options: ['$60', '$57.64', '$62.36', '$55'], correct: 'A', explanation: '50% of the $20 move below $70 is $60.' },
    { question: 'Fibonacci levels work partly because they are:', options: ['Government-mandated', 'Self-fulfilling - many traders act at them', 'Random', 'Based on earnings'], correct: 'B', explanation: 'Enough orders cluster at these levels to make them real support/resistance.' },
    { question: 'Fibonacci levels are most reliable when they:', options: ['Stand alone', 'Coincide with other support/resistance (confluence)', 'Are drawn on every chart', 'Ignore the trend'], correct: 'B', explanation: 'Confluence with an MA or prior level greatly raises a level\'s significance.' },
    { question: 'A shallow retracement (to ~38.2%) signals:', options: ['A weak original move', 'A strong original move', 'A reversal', 'Low volume'], correct: 'B', explanation: 'Shallow pullbacks indicate strength; deep ones (78.6%) indicate weakness.' },
  ],
  ta205: [
    { question: 'A head and shoulders pattern is a:', options: ['Continuation pattern', 'Reversal pattern signalling a top', 'Volume indicator', 'Bullish flag'], correct: 'B', explanation: 'Three peaks with the middle highest, breaking the neckline, signals a top.' },
    { question: 'Flags and pennants are:', options: ['Reversal patterns', 'Continuation patterns - a pause before the trend resumes', 'Always bearish', 'Volume spikes'], correct: 'B', explanation: 'A sharp move, brief consolidation, then continuation in the same direction.' },
    { question: 'A pattern is only valid on:', options: ['The first touch', 'Confirmation via the breakout, ideally on rising volume', 'Low volume', 'A doji'], correct: 'B', explanation: 'The pattern is a hypothesis; the volume-backed breakout is the trigger.' },
    { question: 'A stock forms a $40→$60 pole then a flag to $55. The measured target on a break above $60 is roughly:', options: ['$65', '$75', '$60', '$80'], correct: 'B', explanation: 'Project the $20 pole from the $60 breakout: ~$75.' },
    { question: 'An ascending triangle (flat top, rising bottom) is generally:', options: ['Bearish', 'Bullish', 'Neutral', 'A reversal top'], correct: 'B', explanation: 'Rising lows pressing against flat resistance typically resolve upward.' },
  ],
  ta301: [
    { question: 'A complete Elliott Wave cycle consists of:', options: ['3 waves', 'A 5-wave impulse and a 3-wave correction', '10 waves', '2 waves'], correct: 'B', explanation: 'Five waves with the trend, then a three-wave (A-B-C) correction.' },
    { question: 'Which is an unbreakable Elliott Wave rule?', options: ['Wave 3 is the shortest', 'Wave 2 never retraces more than 100% of wave 1', 'Wave 4 must overlap wave 1', 'Wave 5 is always longest'], correct: 'B', explanation: 'If wave 2 fully retraces wave 1, the count is invalid.' },
    { question: 'Wave 3 is typically:', options: ['The shortest wave', 'The longest and strongest impulse wave', 'A correction', 'Always equal to wave 1'], correct: 'B', explanation: 'Wave 3 is usually the most powerful and is never the shortest.' },
    { question: 'Elliott Wave commonly integrates with:', options: ['P/E ratios', 'Fibonacci ratios for wave targets', 'Dividend yields', 'Bond spreads'], correct: 'B', explanation: 'Wave 2 often retraces 61.8% and wave 3 extends to 161.8% - Fibonacci relationships.' },
    { question: 'The honest limitation of Elliott Wave is that it is:', options: ['Always precise', 'Highly subjective - counts vary between analysts', 'Illegal', 'Volume-based'], correct: 'B', explanation: 'Its value is as a scenario/risk framework, not precise prediction.' },
  ],
  ta302: [
    { question: 'The Wyckoff method seeks to identify:', options: ['Dividend dates', 'When smart money is accumulating or distributing', 'P/E ratios', 'Interest rates'], correct: 'B', explanation: 'It reads ranges to follow institutional ("Composite Operator") intent.' },
    { question: 'A Wyckoff "spring" is:', options: ['A breakout to new highs', 'A false breakdown below support that shakes out weak holders', 'A dividend', 'A death cross'], correct: 'B', explanation: 'The spring traps sellers and lets institutions absorb supply before markup.' },
    { question: 'Wyckoff\'s law of "Cause and Effect" says:', options: ['Volume is irrelevant', 'The size of the trading range determines the size of the next move', 'Price always rises', 'Earnings drive price'], correct: 'B', explanation: 'A larger accumulation cause produces a larger subsequent effect.' },
    { question: 'The four Wyckoff phases in order are:', options: ['Markup, Accumulation, Markdown, Distribution', 'Accumulation, Markup, Distribution, Markdown', 'Distribution, Markdown, Accumulation, Markup', 'Random'], correct: 'B', explanation: 'Accumulate → mark up → distribute → mark down is the institutional cycle.' },
    { question: '"Effort vs Result" divergence (volume vs price) signals:', options: ['Trend continuation', 'A potential coming reversal', 'A dividend', 'Nothing'], correct: 'B', explanation: 'When heavy volume fails to move price, the trend may be exhausting.' },
  ],
  ta303: [
    { question: 'Unusual options activity is most notable when volume is:', options: ['Below open interest', 'Far above the existing open interest', 'Zero', 'Equal to the share price'], correct: 'B', explanation: 'Volume vastly exceeding open interest suggests new, conviction-driven positioning.' },
    { question: 'An options "sweep" indicates:', options: ['A slow, patient order', 'An urgent order split across exchanges to fill fast', 'A dividend', 'A stock split'], correct: 'B', explanation: 'Sweeps signal urgency - the buyer wants filled immediately.' },
    { question: 'A key caveat when reading options flow is that much of it is:', options: ['Always speculation', 'Often hedging, not directional bets', 'Illegal', 'Retail only'], correct: 'B', explanation: 'A large put buy may be portfolio protection, not a bearish bet - context matters.' },
    { question: 'Dark pools are venues where institutions:', options: ['Trade large blocks privately to hide intent', 'Pay dividends', 'Set interest rates', 'Issue IPOs'], correct: 'A', explanation: 'Off-exchange dark pools let large players trade size without revealing it publicly.' },
    { question: 'Options flow and dark-pool data are best used as:', options: ['Standalone buy signals', 'A confirmation layer alongside a thesis', 'A guaranteed predictor', 'A replacement for fundamentals'], correct: 'B', explanation: 'The data is noisy; it confirms conviction rather than predicting on its own.' },
  ],
  fs101: [
    { question: 'Which statement covers performance over a period of time rather than a single point in time?', options: ['Balance sheet', 'Income statement', 'Statement of shareholders’ equity (only)', 'None - all are point-in-time'], correct: 'B', explanation: 'The income and cash flow statements cover a period; the balance sheet is a point-in-time snapshot.' },
    { question: 'Free Cash Flow is best approximated as:', options: ['Net income + depreciation', 'Operating cash flow − capex', 'Revenue − operating expenses', 'EBITDA − interest'], correct: 'B', explanation: 'FCF = Operating Cash Flow − Capex is the cash available to capital providers after maintaining/growing assets.' },
    { question: 'A company reports rising net income but falling operating cash flow. This most likely signals:', options: ['Improving earnings quality', 'A deteriorating earnings quality / accruals red flag', 'Lower leverage', 'Higher dividend capacity'], correct: 'B', explanation: 'Profit that is not converting to cash points to aggressive accruals - a classic earnings-quality warning.' },
    { question: 'The balance sheet identity is:', options: ['Assets = Liabilities − Equity', 'Equity = Assets + Liabilities', 'Assets = Liabilities + Equity', 'Revenue = Assets + Equity'], correct: 'C', explanation: 'Assets are always funded by some mix of liabilities and equity.' },
    { question: 'If revenue is $400M and gross profit is $300M, the gross margin is:', options: ['25%', '75%', '133%', '30%'], correct: 'B', explanation: 'Gross margin = Gross Profit / Revenue = 300/400 = 75%.' },
  ],
  fs102: [
    { question: 'A stock trades at $60 with diluted EPS of $3.00. Its P/E is:', options: ['20×', '180×', '5×', '0.05×'], correct: 'A', explanation: 'P/E = Price / EPS = 60 / 3 = 20×.' },
    { question: 'Which multiple is most appropriate for a bank?', options: ['P/S', 'EV/EBITDA', 'P/B', 'PEG'], correct: 'C', explanation: 'Banks are mark-to-market, asset-heavy businesses, so price-to-book is the standard lens.' },
    { question: 'Price-to-Sales is most useful when:', options: ['Earnings are negative or early-stage', 'The company is a mature utility', 'You want a leverage-neutral metric', 'Comparing across unrelated sectors'], correct: 'A', explanation: 'P/S works when there is no meaningful "E" yet, since revenue is always positive.' },
    { question: 'A low trailing P/E during a cyclical peak is dangerous because:', options: ['Earnings will likely fall, raising the forward P/E', 'Book value is overstated', 'Dividends are unsustainable', 'Beta is too high'], correct: 'A', explanation: 'Peak earnings inflate the denominator; as the cycle turns, the cheap-looking P/E evaporates - a value trap.' },
    { question: 'A share buyback, all else equal, will:', options: ['Raise EPS and lower the P/E mechanically', 'Lower EPS', 'Raise book value per share', 'Have no effect on EPS'], correct: 'A', explanation: 'Fewer shares raise EPS even with flat net income, mechanically compressing the P/E.' },
  ],
  fs103: [
    { question: 'Net income is $1.0B with 500M shares; a buyback cuts shares to 450M with net income unchanged. New EPS is approximately:', options: ['$2.00', '$2.22', '$1.80', '$2.50'], correct: 'B', explanation: '1,000 / 450 = $2.22 - an 11% EPS rise from the buyback alone, with no operational improvement.' },
    { question: 'The accruals ratio is calculated as:', options: ['(Net Income − OCF) / Total Assets', 'OCF / Net Income', 'Net Income / Revenue', 'Capex / Depreciation'], correct: 'A', explanation: 'High positive accruals (income running ahead of cash) tend to predict underperformance.' },
    { question: 'Why should you use diluted rather than basic EPS?', options: ['It is always higher', 'It reflects the dilutive effect of options and convertibles', 'It excludes one-off items', 'Regulators require only basic EPS'], correct: 'B', explanation: 'Diluted EPS captures the full potential claim on earnings, giving a truer per-share figure.' },
    { question: 'Adding back stock-based compensation to reach "adjusted EPS" is questionable because:', options: ['SBC is tax-deductible', 'SBC is a real cost that dilutes shareholders', 'SBC increases cash flow', 'It is required under GAAP'], correct: 'B', explanation: 'Stock-based comp transfers value to employees and dilutes owners - it is an economic cost, not a true add-back.' },
    { question: 'High earnings quality is best evidenced by:', options: ['Adjusted EPS far above GAAP EPS', 'Operating cash flow consistently tracking or exceeding net income', 'Frequent one-time gains', 'Rising receivables relative to sales'], correct: 'B', explanation: 'Cash-backed earnings are the hallmark of quality.' },
  ],
  fs201: [
    { question: 'In a DCF, the discount rate used to convert future cash flows to present value is:', options: ['The risk-free rate', 'The WACC', 'The dividend yield', 'The inflation rate'], correct: 'B', explanation: 'WACC is the blended required return of debt and equity providers.' },
    { question: 'The Gordon Growth terminal value formula is:', options: ['FCF₅ × (WACC − g)', 'FCF₅ × (1 + g) / (WACC − g)', 'FCF₅ / WACC', 'EBITDA₅ × g'], correct: 'B', explanation: 'TV = FCF₅ × (1 + g) / (WACC − g) capitalises the next year’s FCF at the spread between WACC and g.' },
    { question: 'A terminal growth rate set higher than the WACC produces:', options: ['A conservative valuation', 'An infinite/negative, nonsensical value', 'A lower terminal value', 'No effect'], correct: 'B', explanation: 'When g ≥ WACC the denominator (WACC − g) is zero or negative, breaking the model.' },
    { question: 'Roughly what share of a typical DCF’s value sits in the terminal value?', options: ['10–20%', '30–40%', '60–80%', 'Always 100%'], correct: 'C', explanation: 'Most of a DCF’s value lies beyond the explicit forecast, which is why terminal assumptions dominate.' },
    { question: 'To go from Enterprise Value to equity fair value per share you:', options: ['Add net debt, then divide by shares', 'Subtract net debt, then divide by shares', 'Divide by EBITDA', 'Multiply by the P/E'], correct: 'B', explanation: 'Equity Value = EV − Net Debt; divide by shares for per-share fair value.' },
  ],
  fs202: [
    { question: 'The decisive comparison for value creation is:', options: ['ROE vs net margin', 'ROIC vs WACC', 'ROA vs ROE', 'P/E vs growth'], correct: 'B', explanation: 'When ROIC > WACC, growth creates value; when ROIC < WACC, growth destroys it.' },
    { question: 'A firm with $94.8M NOPAT and $600M invested capital has an ROIC of:', options: ['6.3%', '15.8%', '9.0%', '21.0%'], correct: 'B', explanation: 'ROIC = NOPAT / Invested Capital = 94.8 / 600 = 15.8%.' },
    { question: 'ROE can be misleading because:', options: ['It ignores revenue', 'Leverage (the equity multiplier) can inflate it', 'It uses cash flow not earnings', 'It is capital-structure neutral'], correct: 'B', explanation: 'The DuPont equity multiplier means debt alone can boost ROE without improving the business.' },
    { question: 'Which metric strips out the leverage illusion by using the whole asset base?', options: ['ROE', 'ROA', 'EPS', 'Dividend yield'], correct: 'B', explanation: 'ROA = Net Income / Total Assets removes the financing choice from the numerator-denominator relationship.' },
    { question: 'An elite, durable business typically sustains ROIC:', options: ['Below WACC', 'Around 0%', 'Above ~20%', 'Equal to the risk-free rate'], correct: 'C', explanation: 'Sustained 20%+ ROIC signals a strong, value-creating franchise.' },
  ],
  fs203: [
    { question: 'FCF margin of a company with $60M FCF and $400M revenue is:', options: ['6.7%', '15%', '24%', '40%'], correct: 'B', explanation: 'FCF margin = FCF / Revenue = 60 / 400 = 15%.' },
    { question: 'FCF conversion is defined as:', options: ['FCF / Revenue', 'FCF / Net Income', 'OCF / Capex', 'Net Income / FCF'], correct: 'B', explanation: 'Conversion = FCF / Net Income; consistently >90% signals high earnings quality.' },
    { question: 'A company with low headline FCF due to heavy GROWTH capex is:', options: ['Necessarily low quality', 'Possibly building future cash flow and should not be penalised outright', 'Manipulating earnings', 'In financial distress'], correct: 'B', explanation: 'Growth capex depresses current FCF while expanding future capacity - distinguish it from maintenance capex.' },
    { question: 'Why is FCF harder to manipulate than net income?', options: ['It excludes revenue', 'Cash movements are more concrete than accrual accounting choices', 'It is audited more often', 'It ignores capex'], correct: 'B', explanation: 'Accounting choices flatter earnings but eventually show up as a gap between profit and cash.' },
    { question: 'FCF yield is calculated as:', options: ['FCF / Market Cap', 'FCF / Revenue', 'FCF / Net Income', 'FCF / Total Assets'], correct: 'A', explanation: 'FCF / Market Cap is a clean valuation signal; 5%+ on a growing business is attractive.' },
  ],
  fs204: [
    { question: 'Enterprise Value is calculated as:', options: ['Market Cap − Debt + Cash', 'Market Cap + Debt − Cash', 'Market Cap + Cash', 'Net Income × P/E'], correct: 'B', explanation: 'An acquirer assumes debt and keeps cash, so EV = Market Cap + Total Debt − Cash.' },
    { question: 'A company has $4.0B market cap, $1.0B debt and $0.5B cash. Its EV is:', options: ['$4.5B', '$3.5B', '$5.5B', '$4.0B'], correct: 'A', explanation: 'EV = 4.0 + 1.0 − 0.5 = $4.5B.' },
    { question: 'EV/EBITDA is preferred over P/E for comparison because it is:', options: ['Always lower', 'Capital-structure neutral', 'Easier to manipulate', 'Based on book value'], correct: 'B', explanation: 'EBITDA is pre-financing, so EV/EBITDA compares businesses regardless of how they are funded.' },
    { question: 'A cash-rich company will have an EV that is:', options: ['Above its market cap', 'Below its market cap', 'Equal to its market cap', 'Always negative'], correct: 'B', explanation: 'Netting off cash reduces EV below the equity market cap.' },
    { question: 'EV/EBITDA is a poor choice for which type of business?', options: ['Asset-light software', 'Highly capital-intensive firms where depreciation is a real economic cost', 'Mature consumer staples', 'Payment networks'], correct: 'B', explanation: 'When depreciation reflects genuine capital consumption, EV/EBIT or EV/FCF is more honest.' },
  ],
  fs205: [
    { question: 'Which is generally the most powerful and self-reinforcing moat?', options: ['A popular product', 'Network effects', 'A temporary cost lead', 'A large marketing budget'], correct: 'B', explanation: 'Network effects strengthen as scale grows, making the advantage compound over time.' },
    { question: 'In the financials, a durable moat most reliably shows up as:', options: ['High but volatile ROIC', 'Persistently high and stable ROIC above WACC', 'Rising leverage', 'A low P/E'], correct: 'B', explanation: 'Sustained, stable returns on capital above the cost of capital are the quantitative fingerprint of a moat.' },
    { question: 'Switching costs create a moat because:', options: ['The product is cheap', 'Leaving the product is costly or risky for customers', 'The company has patents', 'The market is large'], correct: 'B', explanation: 'High switching costs (e.g., enterprise software) lock customers in and protect pricing.' },
    { question: 'A commodity producer earning high returns only at the top of the cycle:', options: ['Has a wide moat', 'Is displaying cyclical leverage, not a structural moat', 'Has network effects', 'Has high switching costs'], correct: 'B', explanation: 'Cyclical peak returns are not a sustainable competitive advantage.' },
    { question: 'The analyst’s key forward-looking moat question is:', options: ['What is the current P/E?', 'Is the moat widening or eroding?', 'What is the dividend yield?', 'How big is the marketing budget?'], correct: 'B', explanation: 'Moats are dynamic; the durability and trajectory of the advantage drive the terminal value.' },
  ],
  fs301: [
    { question: 'The CAPM cost of equity is:', options: ['Rf + β × ERP', 'Rf × β', 'ERP / β', 'Rf + Kd'], correct: 'A', explanation: 'Ke = risk-free rate + beta × equity risk premium.' },
    { question: 'With Rf = 4.5%, β = 1.2 and ERP = 5.5%, cost of equity is:', options: ['10.0%', '11.1%', '9.9%', '6.6%'], correct: 'B', explanation: 'Ke = 4.5% + 1.2 × 5.5% = 4.5% + 6.6% = 11.1%.' },
    { question: 'Which input should be a MARKET-based weight in WACC?', options: ['Book value of equity', 'Market value of equity and debt', 'Par value of debt only', 'Retained earnings'], correct: 'B', explanation: 'WACC weights should use market values, not book values, to reflect current capital costs.' },
    { question: 'A sensible upper bound for the terminal growth rate is:', options: ['The WACC', 'Long-run nominal GDP growth (~2.5%)', 'The historical revenue CAGR', 'The risk-free rate × 2'], correct: 'B', explanation: 'No company can outgrow the economy forever, so g should sit at or below long-run GDP growth.' },
    { question: 'Best practice for terminal value is to:', options: ['Use only Gordon Growth', 'Use only an exit multiple', 'Compute both and check they are broadly consistent', 'Ignore it entirely'], correct: 'C', explanation: 'Cross-checking the perpetuity and exit-multiple methods exposes unrealistic assumptions.' },
  ],
  fs302: [
    { question: 'A reverse DCF solves for:', options: ['The fair value given a growth assumption', 'The growth rate implied by the current price', 'The WACC', 'The dividend'], correct: 'B', explanation: 'It fixes price and the other inputs, then backs out the implied revenue growth rate.' },
    { question: 'If a price implies 18% growth but history and analysts suggest ~9–10%, the stock is:', options: ['Conservatively priced', 'Priced for a dramatic acceleration (aggressive)', 'Undervalued', 'Fairly valued'], correct: 'B', explanation: 'The market is demanding far more growth than the track record supports - an aggressive, risky setup.' },
    { question: 'A bisection search works for the reverse DCF because fair value is:', options: ['Constant in growth', 'Monotonically increasing in growth', 'Random in growth', 'Decreasing in growth'], correct: 'B', explanation: 'Higher growth always raises fair value, so the root can be bracketed and halved repeatedly.' },
    { question: 'Setting the fixed WACC too LOW in a reverse DCF will:', options: ['Make the implied growth look more reasonable than it is', 'Have no effect', 'Make implied growth look higher', 'Break the model'], correct: 'A', explanation: 'A low discount rate flatters value, lowering the growth needed to justify the price.' },
    { question: 'The reverse DCF is most valuable as a:', options: ['Precise price target generator', 'Risk-management / "what has to be true" tool', 'Replacement for financial statements', 'Technical indicator'], correct: 'B', explanation: 'It reframes valuation around the realism of the market’s embedded expectations.' },
  ],
  fs303: [
    { question: 'The single loudest forensic red flag is:', options: ['A high dividend', 'Net income rising while operating cash flow stagnates/falls', 'A share buyback', 'A low P/E'], correct: 'B', explanation: 'Profit that does not convert to cash is the core signature of accrual-based manipulation.' },
    { question: 'Rising Days Sales Outstanding (receivables growing faster than sales) can indicate:', options: ['Improving collections', 'Channel stuffing or premature revenue recognition', 'Lower leverage', 'Higher cash flow'], correct: 'B', explanation: 'Booking sales faster than they are collected inflates revenue and earnings.' },
    { question: 'The Beneish M-Score is used to:', options: ['Set a price target', 'Estimate the probability of earnings manipulation', 'Calculate WACC', 'Measure dividend safety'], correct: 'B', explanation: 'It combines eight indices into a manipulation-probability score; above −1.78 flags elevated risk.' },
    { question: 'Rising inventory relative to sales often precedes:', options: ['A dividend increase', 'An inventory write-down as demand softens', 'A buyback', 'Margin expansion'], correct: 'B', explanation: 'Inventory building ahead of slowing sales frequently ends in markdowns and write-downs.' },
    { question: 'Which is a governance red flag?', options: ['Stable auditor for a decade', 'Frequent CFO turnover and auditor changes', 'Consistent GAAP reporting', 'Low related-party activity'], correct: 'B', explanation: 'Churn in the CFO/auditor seats and opaque related-party deals are classic governance warning signs.' },
  ],
  fs304: [
    { question: 'Sum-of-the-Parts valuation is most appropriate for:', options: ['A single-product startup', 'A multi-segment conglomerate', 'A money-market fund', 'A pure-play utility'], correct: 'B', explanation: 'SOTP shines when distinct divisions warrant different valuation multiples.' },
    { question: 'In SOTP, each segment should be valued using:', options: ['The parent’s blended multiple', 'A multiple appropriate to that segment’s own industry', 'Book value only', 'The risk-free rate'], correct: 'B', explanation: 'Applying industry-appropriate multiples to each part is the whole point of SOTP.' },
    { question: 'The "conglomerate discount" refers to:', options: ['A tax on conglomerates', 'Markets valuing the whole below the sum of its parts', 'A discount brokers offer', 'Lower debt costs for large firms'], correct: 'B', explanation: 'Complexity and capital-allocation concerns often make the whole trade below its parts - the basis for break-up theses.' },
    { question: 'After summing segment EVs, to reach equity value you must:', options: ['Add net debt and corporate costs', 'Subtract net debt, unallocated corporate costs and pension deficits', 'Multiply by the P/E', 'Add the dividend'], correct: 'B', explanation: 'Bridge from total EV to equity by removing net debt and central liabilities/costs.' },
    { question: 'SOTP is powerful for activists because it:', options: ['Lowers the tax rate', 'Quantifies the value unlockable via spin-offs/break-ups', 'Increases leverage', 'Predicts interest rates'], correct: 'B', explanation: 'It makes the gap between parts and whole explicit, motivating structural change as a catalyst.' },
  ],
}

// ── Merge in the expansion pack's lesson bodies and quiz banks ─────────────
// Mutating the exported objects (rather than rebuilding them) keeps every
// existing import site working unchanged.
Object.assign(LESSON_CONTENT, EXTRA_LESSONS, ANALYST_LESSONS)
Object.assign(QUIZ_BANKS, EXTRA_LESSON_QUIZZES, ANALYST_QUIZZES)

// Re-exported so pages can import everything learning-related from one module.
export { DEEP_DIVES }
