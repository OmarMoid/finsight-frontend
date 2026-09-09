// ============================================================================
// Learning Hub — "Going Deeper" sections.
//
// Each entry extends an existing lesson with the material that separates
// knowing a definition from being able to use it: the nuance most explanations
// skip, a worked number, and the trap people actually fall into. Rendered as a
// separate expandable block under the main lesson body, so the original lesson
// stays a clean first read.
//
// Topics added by learningExtra.js already carry this depth in the lesson
// itself and are deliberately absent here.
// ============================================================================

export const DEEP_DIVES = {
  // ── Fundamentals ────────────────────────────────────────────────────────
  fs101: `## Going Deeper: The Articulation Check

The three statements are not three reports - they are one model viewed from three angles, and they must tie out exactly. Run this check on any company and you will catch problems most readers never see.

**The links, precisely:**
- Net income (income statement) → top of the cash flow statement, and → retained earnings on the balance sheet: \`Closing equity = Opening equity + Net income − Dividends ± Share issuance/buybacks\`.
- Capex (cash flow, investing) → increases PP&E on the balance sheet; depreciation reduces it.
- Change in working capital accounts (balance sheet) → the working capital lines of operating cash flow.
- Closing cash (cash flow statement) → the cash line on the balance sheet. Exactly.

**Worked example.** Opening equity $2,400M, net income $500M, dividends $150M, buybacks $200M. Closing equity should be 2,400 + 500 − 150 − 200 = **$2,550M**. If the reported figure is $2,750M, something else moved equity - most often other comprehensive income (currency translation, pension remeasurement, hedging reserves) - and it is worth knowing which, because OCI is where losses hide from the income statement.

**The trap:** reading the income statement and cash flow statement while never opening the balance sheet. Balance sheets are where leverage, dilution and asset quality live, and they are the statement that constrains everything the other two can say next year.`,

  fs102: `## Going Deeper: Justified Multiples

A multiple is not an opinion - it is an output of the same discounted-cash-flow logic as everything else. Deriving it turns "P/E of 20 seems high" into a testable statement.

From the Gordon growth model, the **justified forward P/E** is:

\`P/E = payout ratio / (Ke − g)\`

**Worked example.** A company pays out 40% of earnings, has a 9% cost of equity and 4% sustainable growth: \`0.40 / (0.09 − 0.04) = 8.0×\`. If it trades at 15×, the market is assuming faster growth, a lower risk premium, or a higher sustainable payout than your inputs. Solve for which - that is the real analysis.

The same logic gives **justified P/B = (ROE − g) / (Ke − g)**. This is why a bank earning a 14% ROE with a 10% cost of equity trades above book, and one earning 7% trades below: the market is pricing whether the business earns more than its cost of capital, not what its assets cost.

**The trap:** comparing a trailing P/E to a forward P/E without noticing. During an earnings trough a stock looks expensive on trailing and cheap on forward - the two can differ by 40%+ at cyclical turns, which is exactly when the distinction matters most.`,

  fs103: `## Going Deeper: The Accruals Ratio

Earnings quality can be measured, not just described. The **accruals ratio** quantifies how much of reported profit is accounting estimate rather than cash:

\`Accruals ratio = (Net income − Operating cash flow) / Average total assets\`

Sloan's original research found that companies in the highest accruals decile persistently underperform those in the lowest - one of the most replicated anomalies in accounting research.

**Worked example.** Net income $800M, operating cash flow $520M, average total assets $6,000M. Accruals ratio = (800 − 520) / 6,000 = **4.7%**. Positive and sizeable: over a third of reported profit has not turned into cash. Not fraud, necessarily - a fast-growing business genuinely builds receivables - but it is a question that needs an answer.

**Also worth computing:** the **cash conversion ratio** = operating cash flow / net income. Above 1.0 sustained is a high-quality signal (depreciation exceeds capex needs, or the business collects early). Persistently below 0.8 warrants a hard look at receivables and inventory.

**The trap:** treating one year's ratio as a verdict. Accruals mean-revert. It is a *persistently* high ratio, or a sharp deterioration versus the company's own history, that carries the signal.`,

  fs201: `## Going Deeper: Where the Value Actually Sits

Decompose any DCF into two pieces and the exercise becomes far more honest: the present value of the explicit forecast years, and the present value of the terminal value.

**Worked example.** A 5-year DCF at a 10% discount rate: explicit-period PV of $180M, terminal value PV of $620M. Terminal is **77%** of the answer. Which means four-fifths of your carefully modelled fair value rests on a single formula applied to year 5 - and the year-by-year revenue build you spent hours on moves the answer far less than you think.

**Mid-year convention.** Standard DCFs discount as if all cash arrives on 31 December. Cash actually arrives throughout the year, so practitioners discount by \`t − 0.5\` instead of \`t\`. On a 10% rate this lifts fair value by roughly **5%** - small, but it is the difference between a model that is right and one that is conventionally wrong.

**Net debt and the bridge.** \`Equity value = Enterprise value − Net debt − Minority interests − Preferred + Associates\`. Forgetting minorities and associates is one of the most common errors in a first model, and on a conglomerate it can move the per-share answer by 10%+.

**The trap:** adding forecast years to feel more rigorous. A 10-year explicit forecast is not more accurate than a 5-year one - it just relocates the guesswork from the terminal formula into years 6–10, where you have no visibility either.`,

  fs202: `## Going Deeper: Computing ROIC Properly

Most published ROIC figures are wrong in ways that matter. The definition:

\`ROIC = NOPAT / Invested Capital\`, where \`NOPAT = EBIT × (1 − tax rate)\` and \`Invested Capital = Total Debt + Equity − Cash and equivalents\`.

Equivalently from the asset side: net working capital + net PP&E + goodwill and intangibles.

**Worked example.** EBIT $1,200M, tax rate 25% → NOPAT $900M. Debt $2,000M, equity $4,500M, excess cash $1,500M → invested capital $5,000M. ROIC = 900 / 5,000 = **18%**. Against a 9% WACC, every dollar reinvested creates roughly a dollar of extra value - this is a genuine compounder.

**The value-creation identity:** \`Value creation = (ROIC − WACC) × Invested Capital\`. Growth is only valuable when ROIC exceeds WACC. A company growing 15% a year at an 6% ROIC against a 9% WACC is destroying value *faster* the more it grows - which is why "growth" alone is not a thesis.

**Three adjustments that change the answer:** capitalise operating leases (post-IFRS 16 they are already on balance sheet, but historical comparisons need care); consider capitalising R&D for research-heavy firms, which otherwise understates invested capital and overstates ROIC; and always include goodwill when judging acquisitive companies.

**The trap:** excess cash left in the denominator drags ROIC down and makes a cash-rich, high-quality business look mediocre.`,

  fs203: `## Going Deeper: Maintenance vs Growth Capex

A DCF discounts free cash flow, but "free" cash flow computed as OCF − total capex penalises a company for investing in growth. Buffett's **owner earnings** separates the two:

\`Owner earnings = Net income + D&A + non-cash charges − maintenance capex − required working capital investment\`

Only maintenance capex is genuinely required to stand still. Growth capex is discretionary, and a company that stopped growing could return it to shareholders.

**Estimating maintenance capex** (companies rarely disclose it): use depreciation as a first approximation, since D&A roughly reflects the historical cost of maintaining the asset base. Refine by looking at capex as a % of sales in a no-growth year, or by tracking the ratio of capex to depreciation - sustained above 1.5× means the company is genuinely expanding, not just replacing.

**Worked example.** Operating cash flow $900M, total capex $500M, depreciation $280M. Reported FCF = $400M. If maintenance capex ≈ depreciation, owner earnings ≈ 900 − 280 = **$620M**, and the extra $220M is investment in growth. Valued at a 15× multiple the difference is over $3B of value - the distinction is not academic.

**The trap:** applying this to a business whose asset base is genuinely shrinking in productive capacity. If depreciation understates true replacement cost (common with old assets and inflation), owner earnings flatters reality.`,

  fs204: `## Going Deeper: Building the EV Bridge Correctly

\`EV = Market cap + Total debt − Cash and equivalents\` is the version everyone learns and it is incomplete. The full bridge:

\`EV = Market cap + Total debt + Minority interests + Preferred stock + Unfunded pension obligations − Cash and equivalents − Value of associates\`

**Why each item.** Minority interests: EBITDA consolidates 100% of a partly-owned subsidiary, so the minority's claim must be added to keep numerator and denominator consistent. Associates: their earnings are *below* EBITDA (equity accounted), so their value must be removed from EV or the multiple double-counts. Unfunded pensions are debt in all but name.

**Worked example.** Market cap $8,000M, debt $3,000M, cash $1,200M, minorities $400M, associates worth $600M. EV = 8,000 + 3,000 + 400 − 1,200 − 600 = **$9,600M**, not the $9,800M the simple formula gives.

**Excess vs operating cash.** Not all cash is deductible. A business needs some cash to operate - commonly estimated at 1–2% of revenue. Deducting the entire balance treats working cash as distributable and overstates the discount.

**The trap:** using EV/EBITDA for banks and insurers. Debt is raw material for a financial institution, not financing, so enterprise value is meaningless. Use P/B and ROE.`,

  fs205: `## Going Deeper: Testing a Moat with Numbers

"Wide moat" is an assertion until you can show it in the financials. Three tests:

**1. ROIC persistence.** Competitive theory says excess returns get competed away. Plot ROIC over 10 years: a business holding 20%+ ROIC through a full cycle has something structural protecting it. A business whose ROIC decayed from 25% to 12% had a moat and is losing it - the far more common story, and the one the market prices too late.

**2. Gross margin stability through a downturn.** Pricing power is the ability to *not* discount when demand falls. Check 2008–09 and 2020 gross margins. A brand that held price is different in kind from one that held volume.

**3. Reinvestment runway.** A moat without somewhere to deploy capital produces a cash cow, not a compounder. \`Growth = ROIC × reinvestment rate\`. A business earning 30% ROIC but able to reinvest only 20% of earnings grows at 6%; one earning 18% and reinvesting 80% grows at **14.4%** and will create far more value.

**Worked example.** Two companies, both 10-year holds: A earns 30% ROIC, reinvests 20% → 6% growth. B earns 18% ROIC, reinvests 80% → 14.4% growth. Over a decade B compounds intrinsic value roughly 2.2× faster despite the lower headline return.

**The trap:** confusing scale with a moat. Being large is not a barrier unless it produces cost advantage, network effects or switching costs that a well-funded competitor cannot replicate.`,

  fs301: `## Going Deeper: Sanity-Checking the Terminal Value

Every advanced DCF should have its terminal value cross-examined three ways before it is trusted.

**1. The implied exit multiple.** \`Implied EV/EBITDA = TV / terminal-year EBITDA\`. If the perpetuity produces an implied 22× exit multiple on a business whose peers trade at 11×, the terminal growth assumption is doing something indefensible.

**2. The implied perpetuity growth from a multiple.** Working the other way for exit-multiple models: \`g = (r × m − 1) / (m + 1)\`. A 20× exit multiple at a 10% discount rate implies \`(0.10 × 20 − 1) / 21 = 4.8%\` perpetual growth - above nominal GDP, therefore impossible in the long run.

**3. Terminal ROIC.** In steady state, \`Reinvestment rate = g / ROIC\`. If terminal growth is 2.5% and terminal ROIC is 12%, the company must reinvest 21% of NOPAT forever. Many models implicitly assume a company grows at 3% while reinvesting nothing - which is free growth, and does not exist.

**Worked example.** Terminal FCF $500M, r = 9%, g = 2.5% → TV = 500 × 1.025 / 0.065 = **$7,885M**, an implied 15.8× terminal FCF multiple. Against peers at 14× that is defensible; against peers at 8× it is not.

**The trap:** raising terminal growth to reach a target price. It is the least observable input in the model and therefore the easiest to abuse - which is precisely why reviewers check it first.`,

  fs302: `## Going Deeper: Reverse DCF as a Falsifiable Thesis

A reverse DCF converts valuation from "what is it worth?" - unanswerable - into "what must be true?" - testable. That reframing is its entire value.

**The method.** Hold the discount rate, terminal growth and margin structure fixed. Solve by bisection for the growth rate that makes fair value equal the current price. That rate is the market's embedded expectation.

**Worked example.** A stock at $212 back-solves to **25% implied growth** over the explicit forecast period. The company has delivered 18% over the last five years, and consensus forecasts 22% next year. The gap is the debate: to justify today's price, the business must sustain a rate above both its own history and the street's near-term forecast for the entire forecast window.

**Then interrogate the implied number properly.** Convert it into units the business actually operates in. If 25% growth for seven years implies revenue of $340B in year seven, ask what share of the addressable market that represents. When implied growth requires more than 100% market share - which happens more often than you would expect - the model has answered the question decisively.

**The trap:** running a reverse DCF and treating a high implied growth rate as an automatic sell. Some companies do deliver extraordinary growth. The output is a **hurdle to assess**, not a verdict - the discipline is that you now know exactly what you are betting on.`,

  fs303: `## Going Deeper: The Screens That Actually Catch Things

Forensic analysis is pattern recognition. These are the ratios that have historically preceded restatements and blow-ups.

**Beneish M-score.** An eight-variable model combining growth in receivables versus sales (DSRI), gross margin deterioration (GMI), asset quality (AQI), sales growth (SGI), depreciation rate changes (DEPI), SG&A behaviour, leverage, and total accruals. An M-score above **−1.78** flags elevated manipulation probability. It famously flagged Enron years early. It produces false positives on fast-growing companies - treat it as a question generator, not a verdict.

**Altman Z-score** for bankruptcy risk: below **1.8** is distress territory, above **3.0** is safe. It is calibrated on manufacturers and misleads badly for asset-light and financial businesses.

**The individual red flags worth screening for directly:**
- Receivables growth persistently exceeding revenue growth (DSO extending year on year).
- Inventory growth exceeding COGS growth.
- Widening gap between net income and operating cash flow (see the accruals ratio in fs103).
- Repeated "one-off" restructuring charges - three years running is a cost structure, not a one-off.
- Capitalising costs peers expense (software development, customer acquisition).
- Auditor changes, CFO departures, and late filings - the three softest and most predictive signals of all.

**The trap:** treating any single flag as proof. Fraud is found where several independent flags point the same way at once.`,

  fs304: `## Going Deeper: Building an SOTP That Holds Up

A sum-of-the-parts is only as good as its discipline about what sits between the segments and the share price.

**The structure.**
1. Value each segment on the multiple appropriate to *that* business - the software division on EV/Sales or EV/EBITDA, the industrial division on EV/EBIT, the property assets on cap rate or NTA.
2. Sum to gross enterprise value.
3. Subtract **unallocated corporate costs**, capitalised. This is the step most retail SOTPs skip and it is large: $80M of annual head-office cost at a 10× multiple is **$800M** of value that belongs to no segment.
4. Bridge to equity: subtract net debt, minorities, pension deficits; add associates.
5. Apply a **conglomerate discount** - historically 10–20% - reflecting complexity, cross-subsidy and the fact that the parts are not actually for sale.

**Worked example.** Segments worth $4.0B + $2.5B + $1.5B = $8.0B. Less capitalised corporate costs $0.8B = $7.2B. Less net debt $1.5B = $5.7B equity. Less a 15% conglomerate discount = **$4.85B**. Against a $4.0B market cap there is a 21% gap - meaningful, but a long way from the naive $8.0B headline.

**The trap:** an SOTP without a catalyst is a permanent observation, not an idea. Conglomerate discounts can persist for decades. The thesis needs an activist, a management change, or an announced separation to close the gap.`,

  // ── Technical ───────────────────────────────────────────────────────────
  ta101: `## Going Deeper: What a Candle Actually Encodes

A candlestick compresses an auction into four numbers, and reading it as a *process* rather than a shape is what makes it useful.

The **open** is where overnight orders cleared. The **close** is the most informative of the four - it is where committed participants were willing to hold risk. The **range** (high − low) measures disagreement. The **body relative to the range** measures resolution: a small body inside a wide range means enormous activity resolved into nothing.

**Where the close sits in the range** is the highest-signal single observation. A close in the top 20% of a wide range means buyers won the day regardless of the colour of the candle.

**Worked example.** A stock opens $50, drops to $46, recovers to close $49.60 with a high of $50.10. The body is small and red, which looks bearish; but the close sits in the top 90% of the range after a 8% intraday drawdown was fully bought. That is an accumulation day dressed as a down day.

**Context multipliers.** The same hammer means very different things at a 52-week low on triple average volume versus mid-range on a quiet Tuesday. Location and volume are not decoration - without them the pattern has essentially no predictive content.

**The trap:** memorising dozens of named patterns. Three or four read in context outperform an encyclopaedia read without it.`,

  ta102: `## Going Deeper: Why Levels Work, and When They Don't

Support and resistance are not physical properties of a chart. They exist because of **position memory** - real people hold real inventory at those prices.

At a prior high, three groups act at once: buyers from that level who are now break-even and want out ("get me back to flat"), short sellers who entered there and are defending, and momentum buyers waiting for confirmation. That order flow is what makes the level real, and it explains why levels weaken over time as those positions are closed or given up.

**Volume profile is the sharper tool.** Rather than horizontal lines drawn at highs and lows, plot volume traded *at each price*. High-volume nodes are where large amounts of inventory changed hands and where price tends to stall; **low-volume nodes** are areas price traverses quickly, because there is no inventory to absorb it. Gaps in the profile are where fast moves happen.

**Worked example.** A stock has traded 40% of its yearly volume between $44 and $47 and almost nothing between $47 and $52. On a break above $47, the absence of overhead supply is the reason a move to $52 can happen quickly - nobody in that zone is waiting to sell into it.

**The trap:** treating a level as a price rather than a zone. Levels are areas - typically 1–2% wide - and precise lines invite stops placed exactly where they will be swept.`,

  ta103: `## Going Deeper: Choosing the Right Average

Moving averages differ in what they weight, and the choice is not cosmetic.

- **Simple (SMA)**: equal weight. Slowest to react, fewest whipsaws, the reference most institutions actually watch - which is a self-fulfilling reason to use the standard 50 and 200.
- **Exponential (EMA)**: weights recent data more heavily. Faster, and better for shorter-horizon work.
- **Volume-weighted (VWAP)**: weights by volume traded. It is the day's true average execution price, which is why institutional desks are benchmarked against it - a large buyer filling below VWAP has done a good job. Anchored VWAP, run from a significant event such as an earnings date or a major low, is one of the most useful and least-known tools available.

**Golden and death crosses.** The 50 crossing above the 200 (golden) and below (death) are widely cited and only modestly predictive - they are lagging by construction, and produce their worst signals in ranging markets. Their real value is as a regime label, not an entry.

**Worked example.** A 200-day SMA at $40 with price at $48 sits 20% above trend. Historically, extreme extensions above a long average mean-revert; the average acts as a magnet. That is a **sizing** signal, not a sell.

**The trap:** optimising the period length on historical data. A 43-day average that backtested beautifully is curve-fitted. Use the standard periods precisely *because* everyone else does.`,

  ta104: `## Going Deeper: Volume as Confirmation and Contradiction

Volume is the only technical input that measures conviction rather than price. Four combinations, and what each means:

- **Price up, volume up** - healthy demand, participation confirms the move.
- **Price up, volume down** - the advance is running out of buyers; a common precursor to a stall.
- **Price down, volume up** - genuine distribution or forced selling.
- **Price down, volume low** - a drift or a lack of interest, not necessarily a change in trend.

**On-balance volume (OBV)** cumulates volume signed by the day's direction. Its value is in divergence: OBV making new highs while price stalls suggests accumulation ahead of a breakout; the reverse warns of distribution.

**Volume climax.** Extremely high volume after an extended move often marks exhaustion rather than continuation - it is the point at which the last participants capitulate and there is nobody left to act.

**Worked example.** A stock breaks a $47 resistance on 3.2× average volume and holds. Compare to a break on 0.7× average volume that fails within two sessions. The price action is identical; the volume told you which was real.

**The trap:** comparing raw volume across time without adjusting for index rebalances, options expiry (the third Friday of each month) and holiday periods. Always compare to a rolling average, not to an absolute number.`,

  ta201: `## Going Deeper: RSI Beyond 70/30

The 70/30 thresholds are a starting point that most users never move past, and they are wrong in trends.

**Range shift.** In a strong uptrend, RSI oscillates roughly between **40 and 90** - pullbacks bottom near 40, not 30, and readings above 70 persist for months. In a downtrend the range shifts to roughly **10 to 60**. Which band RSI is respecting is itself a trend-identification tool, often clearer than the price chart.

**Divergence, properly defined.** Bearish divergence requires price making a *higher high* while RSI makes a *lower high*, at meaningful swing points, with the second peak generally within a few weeks of the first. Divergences across six months are noise. And divergences can repeat several times before price responds - which is why they are a warning, not a trigger.

**Worked example.** Price makes a new high at $58 with RSI at 64, having previously peaked at $55 with RSI at 78. Momentum has deteriorated even as price advanced. In a strong trend this frequently resolves with a shallow pullback and a new high, not a reversal - the signal is that the *rate* of advance is slowing.

**Failure swings** are a stronger version: RSI fails to reach overbought on a rally, then breaks the prior RSI trough while price is still near its high.

**The trap:** shorting a stock because RSI is above 70. In the strongest trends RSI stays overbought for the entire move, and that is precisely when shorting is most expensive.`,

  ta202: `## Going Deeper: MACD's Three Components

MACD carries more information than the crossover most people trade.

- **MACD line** = 12-period EMA − 26-period EMA. It is a momentum measure: the *distance* between two trend speeds.
- **Signal line** = 9-period EMA of the MACD line.
- **Histogram** = MACD − signal. This is the second derivative - the rate of change of momentum - and it turns before the crossover does.

**Zero-line context.** MACD above zero means the short average is above the long: the trend is up. A bullish crossover *above* zero, in an established uptrend, is a far higher-quality signal than the same crossover below zero, which is usually just a bounce in a downtrend.

**Worked example.** The histogram has been printing shrinking positive bars for six sessions while price grinds higher. Momentum is decelerating; a crossover is likely within days. Acting on the histogram turn rather than waiting for the crossover typically gains several sessions - at the cost of more false signals.

**The trap:** MACD is a lagging trend-following tool built from moving averages, so in a range it whipsaws relentlessly. Classify trend versus range (see ta105) before using it at all. And the default 12/26/9 settings assume daily bars - applying them to a weekly chart without thought changes their meaning entirely.`,

  ta203: `## Going Deeper: Bands as a Volatility Model

Bollinger Bands are a statistical statement: a 20-period moving average with bands at ±2 standard deviations. Under a normal distribution that would contain ~95% of observations - but returns are not normally distributed, and tails are much fatter than the model implies. That mismatch is where both the value and the danger live.

**Bandwidth and the squeeze.** \`Bandwidth = (Upper − Lower) / Middle\`. Volatility is mean-reverting and clusters, so historically low bandwidth - a "squeeze" - reliably precedes an expansion. What it does **not** do is predict direction. Trading the squeeze means preparing for a move, not guessing which way.

**%B** locates price within the bands: \`%B = (Price − Lower) / (Upper − Lower)\`. Above 1.0 means price is outside the upper band, below 0 outside the lower.

**Walking the band.** In a strong trend price hugs the upper band for extended periods. This is the single biggest source of losses for band traders, who read "touching the upper band" as overbought and sell into the strongest part of a move.

**Worked example.** Bandwidth compresses to the lowest reading in 12 months while price coils in a 3% range. A directional break follows within weeks - the squeeze told you volatility was coming, and the break told you which way.

**The trap:** using bands as standalone overbought/oversold signals. They are a volatility envelope, not a valuation tool.`,

  ta204: `## Going Deeper: Fibonacci Without the Mysticism

The 61.8% ratio has no mechanical power over markets. What Fibonacci retracements have is **coordination**: enough participants draw the same levels that orders cluster there, which makes the levels partially self-fulfilling. That is a real effect, and it is the only justification the tool needs.

**Where they carry actual information** is in **confluence**. A 61.8% retracement that coincides with the 200-day moving average, a prior support level and a high-volume node is a genuine decision zone - not because of the ratio, but because four independent reasons to transact overlap there.

**The 50% level**, the one most watched, is not a Fibonacci number at all. It is simply the midpoint, and it works because halfway is an intuitive place for humans to act.

**Extensions** (127.2%, 161.8%) are used for targets after a breakout, and they are weaker still - targets set by measured moves or by valuation are more defensible.

**Worked example.** A stock rallies $40 → $60 and pulls back. The 61.8% retracement sits at $47.64. If the 200-day average is at $47.20 and the prior breakout level was $47.50, the $47.2–47.6 zone is worth watching. If none of those align, the Fibonacci level alone is not a reason to act.

**The trap:** drawing retracements from arbitrary swing points until one "works". Define the swing high and low mechanically, before looking at where the levels land.`,

  ta205: `## Going Deeper: Measured Moves and Base Rates

Chart patterns are worth using only with a target rule and honest expectations about how often they fail.

**Measured move targets:**
- **Head and shoulders**: target = neckline − (head − neckline). A head at $60 with a $50 neckline projects to **$40**.
- **Triangles and rectangles**: project the widest part of the pattern from the breakout point.
- **Flags and pennants**: project the length of the preceding "flagpole" from the breakout.

**Base rates matter more than the pattern.** Bulkowski's exhaustive studies found most patterns succeed only 50–70% of the time, with meaningful throwback and pullback rates - price returns to test the breakout level roughly half the time. That is not an argument against patterns; it is an argument for position sizing that survives a 40% failure rate.

**Volume is the filter that separates real from decorative.** Genuine head-and-shoulders tops show declining volume on the right shoulder and a volume expansion on the neckline break. Without that signature, the shape is coincidence.

**Worked example.** A rectangle between $30 and $36 breaks upward at $36 on high volume. Measured target = 36 + (36 − 30) = **$42**. A pullback to $36 is the statistically normal outcome, not a failure - which is exactly why stops belong below the pattern, not at the breakout price.

**The trap:** seeing patterns everywhere. Pattern recognition is what human brains do to random data; a pattern you had to squint to find is not one.`,

  ta301: `## Going Deeper: The Rules That Make Elliott Falsifiable

Elliott Wave is often dismissed as unfalsifiable - an analyst can relabel waves after the fact indefinitely. It has three hard rules that, if honoured, make a count testable:

1. **Wave 2 never retraces more than 100% of wave 1.**
2. **Wave 3 is never the shortest** of waves 1, 3 and 5.
3. **Wave 4 never enters the price territory of wave 1** (in non-leveraged markets).

Break any rule and the count is invalid - not "adjusted". Analysts who relabel rather than discard are the reason the method has its reputation.

**Guidelines (not rules) worth knowing:** wave 3 is usually the longest and most powerful, frequently extending to 161.8% of wave 1; wave 2 commonly retraces 50–61.8% of wave 1; wave 4 often retraces ~38.2% of wave 3; and alternation - if wave 2 is a sharp correction, wave 4 tends to be a sideways one, and vice versa.

**Worked example.** Wave 1 runs $20 → $30. Wave 2 must hold above $20 or the count is dead. If wave 2 bottoms at $24 (60% retracement, textbook), a wave 3 extension to 161.8% projects $24 + 16.18 = **$40.18**.

**The trap:** trading a count with a low-probability alternate that has not been ruled out. Practically, Elliott is most useful for identifying where you are in a structure and what would prove you wrong - not for prediction.`,

  ta302: `## Going Deeper: The Wyckoff Events in Order

Wyckoff's contribution is a *sequence* with named events, which makes accumulation and distribution identifiable in real time rather than only in hindsight.

**Accumulation, in order:**
- **PS** (preliminary support) and **SC** (selling climax) - heavy volume, wide spread down, the panic low.
- **AR** (automatic rally) - the bounce that defines the top of the trading range.
- **ST** (secondary test) - retests the SC low on **lower volume**. This is the key confirmation: less supply at the same price.
- **Spring** - a false break below support that traps late shorts, on low volume, quickly reclaimed.
- **SOS** (sign of strength) - a rally on expanding volume and widening spread out of the range.
- **LPS** (last point of support) - a higher low on light volume. The best risk/reward entry in the whole structure.

**The three laws underneath it:** supply and demand; **effort versus result** (high volume producing little price movement means effort is being absorbed - the most useful single Wyckoff idea); and cause and effect (the width of the range determines the size of the eventual move).

**Worked example.** Price breaks $28 support to $26.50 on below-average volume and closes back above $28 within two sessions. That is a textbook spring: the break found no supply and trapped the sellers who acted on it.

**The trap:** forcing the schematic onto every range. Many ranges are just ranges. Wyckoff structures are identifiable precisely because they are not universal.`,

  ta303: `## Going Deeper: What Options Flow Can and Cannot Tell You

Options data is genuinely informative, but almost every popular interpretation of it is wrong.

**Unusual options activity** is only meaningful when volume exceeds existing **open interest** at that strike - that proves new positions were opened rather than existing ones traded. And a large call purchase is not automatically bullish: it may be a hedge against a short stock position, one leg of a spread, or a covered-call overwrite. Single-leg interpretation of multi-leg trades is the most common error in this space.

**Gamma exposure (GEX)** is the more durable concept. When dealers are **long gamma** (typically when large open interest sits in calls above the market), their hedging is stabilising: they sell into rallies and buy dips, compressing realised volatility. When dealers are **short gamma**, hedging amplifies moves in both directions. This is a real, mechanical effect on intraday behaviour, and it explains why some price zones behave like magnets and others like accelerants.

**Put/call ratios** are contrarian sentiment gauges at extremes and noise in between.

**Dark pools** are simply off-exchange venues for large orders; prints there are reported to the tape with a delay and do not carry directional information on their own - the "dark pool signal" services sold to retail are mostly reading noise.

**The trap:** trusting third-party "smart money" flow feeds. Institutions deliberately break up and disguise large orders, which is the entire purpose of the venues these feeds monitor.`,

  // ── Macro ───────────────────────────────────────────────────────────────
  ma101: `## Going Deeper: Duration, in Equities

Rates matter to equities through the same mechanism they matter to bonds: **duration**. A stock whose cash flows arrive far in the future is a long-duration asset and reprices violently when the discount rate moves.

**Worked example.** Two companies each worth $100 today. Company A's value comes mostly from cash flows in the next five years; Company B is pre-profit with value concentrated 10–20 years out. Raise the discount rate from 8% to 10%. A falls perhaps 10%; B falls 30%+. Nothing about either business changed.

**Real rates, not nominal.** Equities respond to real yields (nominal minus expected inflation). Rising nominal rates *because* growth is strong can coexist with rising equities. Rising **real** rates - as in 2022 - compress multiples everywhere. Separating the two is the single most useful macro distinction for an equity investor.

**The Fed model, and its flaw.** Comparing the equity earnings yield (E/P) to the 10-year yield is intuitive but empirically weak: it compares a real quantity (earnings, which grow with inflation) to a nominal one. It was popular in the high-inflation 1980s for exactly the wrong reason.

**The trap:** assuming a rate cut is automatically bullish. Cuts arrive because growth is deteriorating. The first cut of a cycle has historically been a poor buy signal - what matters is whether earnings hold up.`,

  ma102: `## Going Deeper: Why Services Inflation Is the Whole Game

Not all inflation is equal to a central bank. Goods inflation is largely imported and supply-driven; **services inflation** is domestic, wage-linked and persistent. It is what determines whether an inflation episode is transitory.

**Supercore inflation** - services excluding energy and housing - is the measure central bankers actually discuss, because it most closely tracks domestic labour costs.

**Shelter's lag.** US CPI shelter is derived from rents including owners' equivalent rent, and it captures market rents with a lag of roughly 9–12 months because leases reset annually. This means CPI can print hot long after real-time market rents have rolled over - a mechanical artefact that has repeatedly misled commentators.

**The reaction function.** A Taylor-rule intuition: the policy rate should be roughly the neutral real rate + inflation + 0.5 × (inflation gap) + 0.5 × (output gap). It is not a formula any central bank follows, but it explains why policy is tighter than the inflation rate alone suggests.

**Worked example.** Headline CPI 3.7%, core 3.1%, supercore 4.2%, policy rate 3.63%. The real policy rate is roughly −0.1% - barely restrictive - while the stickiest component runs above 4%. That combination is why a central bank would hesitate to cut despite a falling headline.

**The trap:** reacting to headline inflation. Energy swings dominate the headline and are exactly what policy cannot influence.`,

  ma103: `## Going Deeper: Sector Rotation as a Sequence

The rotation model is only useful if you can locate the current position, and that requires knowing the ordering and the lead times.

**Early cycle** (recession ending, policy easing): consumer discretionary, financials, real estate, small caps. Highest beta, largest gains, hardest to buy because the news is still terrible.
**Mid cycle** (growth accelerating): technology, industrials, communication services.
**Late cycle** (growth peaking, policy tightening, inflation rising): energy, materials, and quality compounders.
**Recession**: consumer staples, healthcare, utilities - the sectors whose earnings are least tied to GDP.

**Equities lead the economy by roughly 6–9 months.** By the time a recession is officially declared - the NBER dates it with a lag of many months - the market has usually already bottomed. This is why waiting for economic confirmation is a reliably losing strategy.

**Worked example.** The curve is flat, real policy is near neutral, CPI is above target and unemployment is beginning to tick up. That is a late-cycle read: it argues for quality, pricing power and balance-sheet strength rather than early-cycle beta - even if index prices are still making highs.

**The trap:** treating the model as mechanical. Every cycle has idiosyncratic drivers (a pandemic, an AI capex boom, a commodity shock) that dominate the textbook sequence for years at a time. Use it as a prior, not a rule.`,

  ma201: `## Going Deeper: Which Spread, and Why Inversion Works

Not all curve measures agree, and the disagreements are informative.

- **2s10s** is the most quoted, and the one most people mean by "the curve".
- **3m10y** has the better empirical record in academic work and is the New York Fed's preferred recession input.
- **The near-term forward spread** (18-month forward 3-month rate minus the current 3-month rate) is what Fed researchers have argued is cleanest, because it isolates the market's expectation of policy easing.

**The mechanism.** Inversion means markets expect short rates to fall, which happens when the central bank is expected to cut, which happens when growth deteriorates. Separately, it damages the banking system's core economics - banks borrow short and lend long, so an inverted curve compresses net interest margin and tightens credit supply directly.

**The lag is long and variable.** Historically 12–24 months from inversion to recession, and - critically - **the curve usually re-steepens before the recession begins**, as the central bank starts cutting. A re-steepening after a long inversion is therefore not the all-clear it appears to be; it has often been the final warning.

**Worked example.** 2y at 4.25%, 10y at 4.70% → +45bps, technically positive but historically flat. That is a late-cycle shape, not a recession signal.

**The trap:** treating inversion as a market-timing tool. Equities have frequently risen substantially between inversion and recession.`,

  ma202: `## Going Deeper: Why Australian Policy Transmits Faster

The RBA's rate decisions hit Australian household cash flow far more quickly than the Fed's hit American households, and the reason is the mortgage market.

In Australia, the large majority of mortgages are **variable rate** or fixed for only 2–3 years. In the US, the 30-year fixed mortgage is standard. A US homeowner who locked 3% in 2021 is entirely insulated from subsequent hikes; an Australian borrower feels each rise within weeks. This makes Australian monetary policy unusually potent and fast-acting, and it is why the RBA has historically been able to move less far than the Fed to achieve a similar effect.

**The consequences for the ASX:** consumer discretionary and housing-linked stocks respond to RBA decisions far more sharply than US equivalents respond to the Fed; and the banks face a genuine two-sided effect - higher rates widen net interest margin, but also raise arrears and provisioning.

**The other RBA-specific factors.** Its mandate includes full employment explicitly. The Board meets more frequently than the FOMC. And the AUD is a commodity currency, so terms of trade feed into inflation through import prices in a way that has no US analogue.

**Worked example.** A 100bps rise on a $700,000 variable mortgage is roughly **$7,000 a year** of after-tax cash flow removed from a household - an immediate, direct hit to discretionary spending.

**The trap:** applying US rate intuition to Australian consumer stocks. The transmission speed is genuinely different.`,

  ma203: `## Going Deeper: Currency as an Earnings Variable

The AUD is a **procyclical commodity currency**: it rises with global growth, risk appetite and commodity prices, and falls in risk-off episodes. That makes it a natural hedge inside an Australian portfolio - unhedged foreign assets rise in AUD terms exactly when domestic assets fall.

**Translation vs transaction exposure.** *Translation* exposure is the accounting effect of converting foreign subsidiary earnings back to AUD. *Transaction* exposure is real: costs incurred in one currency and revenue earned in another. Only transaction exposure changes economics, but both move reported earnings, and companies frequently blur the two in commentary.

**Worked example.** An Australian company earns 60% of revenue in USD and incurs 80% of costs in AUD. A 10% fall in the AUD lifts AUD-translated revenue by roughly 6% while costs are unchanged - the margin expansion is genuine, not an accounting artefact. Miners with USD-denominated commodity revenue and AUD cost bases are the purest version of this trade.

**Interest rate parity, and why carry works anyway.** Theory says a higher-yielding currency should depreciate to offset the yield advantage. Empirically it frequently does not, for long stretches - which is the basis of the carry trade, and why the AUD attracted so much foreign capital in high-rate periods. Carry unwinds violently, which is why the AUD falls fastest in stress.

**The trap:** ignoring whether a company hedges. A three-year hedge book means today's currency move affects earnings in 2028, not this half.`,

  ma204: `## Going Deeper: Supply Shocks vs Demand Shocks

The single most useful distinction in commodity analysis is **why** the price moved, because the two causes have opposite implications for equities.

**A demand-driven price rise** (strong global growth lifting oil and copper) is bullish for equities broadly: it reflects economic strength, and cyclical earnings rise with it.

**A supply-driven price rise** (a conflict closing a shipping lane, sanctions, a mine failure) is a tax on consumers and a margin squeeze for every business that uses the input. It raises inflation while *reducing* growth - the stagflationary combination that central banks find hardest to respond to, and equity markets hate.

**How to tell them apart in real time:** if oil is rising *and* copper is rising *and* equities are rising, it is demand. If oil is rising while copper falls and bond yields rise on inflation expectations rather than growth expectations, it is supply.

**Worked example.** Oil goes $75 → $95 on a supply disruption. Airlines and transport lose margin immediately; energy producers gain; the aggregate effect on the index is negative because the losers outnumber the winners, and headline inflation rises without any underlying demand strength to justify it.

**Australia's specific position.** As a net commodity exporter, Australia's terms of trade *improve* in a commodity supply shock - the ASX often outperforms global peers in exactly the episodes that hurt them.

**The trap:** assuming higher commodity prices are good for the resources-heavy ASX regardless of cause. It depends entirely on whether Australia exports the commodity in question.`,

  ma301: `## Going Deeper: The Dollar as the Global Liquidity Tap

Because roughly half of global trade and a large share of emerging-market debt is denominated in USD, the dollar functions as the world's liquidity condition rather than merely a currency.

**The mechanism.** A stronger USD raises the local-currency cost of servicing dollar debt for every foreign borrower, tightens global financial conditions, pressures commodity prices (which are dollar-priced), and pulls capital out of emerging markets. A weaker dollar does the reverse. This is why "the dollar" appears in nearly every global macro discussion - it is a proxy for global funding stress.

**Where the pressure shows first:** cross-currency basis swaps and FX swap spreads. When non-US institutions are desperate for dollars, the cost of swapping into USD spikes above what interest parity implies. This is the plumbing indicator that moved first in March 2020, before equity markets fully repriced.

**Triffin's dilemma** underneath it all: to supply the world with reserve dollars, the US must run persistent deficits - which over time undermines confidence in the very asset the world relies on.

**Worked example.** The USD strengthens 12% over a year. An emerging-market corporate with dollar debt and local-currency revenue sees its debt service cost rise 12% in real terms with no change in operations. Defaults follow, then capital flight, then a currency crisis - the standard sequence.

**The trap:** thinking of the dollar only as an FX rate. It is a global financial condition.`,

  ma302: `## Going Deeper: What QE Actually Does

QE is frequently described as "printing money", which obscures the mechanism and leads to wrong predictions - notably the widely-forecast hyperinflation after 2009 that never arrived.

**What actually happens.** The central bank creates reserves and buys bonds from banks and non-banks. Reserves are not currency in circulation; they sit at the central bank. The primary effects are (1) removing duration from the market, which suppresses the **term premium** and lowers long yields, and (2) the **portfolio balance channel** - investors sold their bonds and must put the proceeds somewhere, pushing them into credit and equities.

**Why 2009 QE was not inflationary but 2020 was.** In 2009 the reserves largely sat idle: banks repaired balance sheets and bank lending did not expand, so broad money growth stayed subdued. In 2020 QE ran alongside enormous **fiscal transfers directly to households**, which did create spendable broad money against constrained supply. The distinction is fiscal-monetary coordination, not the size of the central bank balance sheet.

**QT is not symmetric.** Balance-sheet runoff is slower and less telegraphed than QE, and its effects are far less studied. It also removes a price-insensitive buyer at exactly the time deficits require more issuance (see ma304).

**The trap:** predicting inflation from central bank balance-sheet size alone. Broad money growth and the velocity of that money are what matter, and neither follows mechanically from reserves.`,

  ma303: `## Going Deeper: From Regime to Position Size

A top-down framework only earns its keep if it changes what you own and how much. The chain:

**1. Regime read.** Curve shape, real policy rate, inflation versus target, and labour-market direction. These four are exactly the inputs FinSight's Research tab uses to classify a regime.
**2. Discount rate.** The live risk-free rate plus a regime-adjusted equity risk premium - countercyclical, so it widens as conditions deteriorate.
**3. Sector tilt.** Each sector has a cyclicality (how much earnings swing with the cycle) and a rate duration (how much the multiple responds to long rates). Utilities and REITs are low cyclicality, high duration; banks are high cyclicality with *negative* rate duration, because they earn a wider spread when rates rise.
**4. Position size.** Regime informs gross exposure and the bull/bear probability weights, not stock selection.

**Worked example.** Late cycle: curve flat, CPI above target, unemployment beginning to rise. That widens the ERP, shrinks the near-term growth assumption for cyclical sectors, and fattens the bear-case probability. In FinSight's engine those three adjustments happen explicitly and are shown with reasons on the Research tab.

**The trap:** letting macro override bottom-up work. Macro should tilt a portfolio, not select it. Investors who have traded a macro view instead of owning businesses have generally underperformed those who owned good businesses through the cycle - which is why the overlay in a well-built model is bounded.`,

  // ── ASX ─────────────────────────────────────────────────────────────────
  asx101: `## Going Deeper: What Concentration Really Costs

The ASX 200's top 10 names account for roughly 45% of the index, and financials plus materials are close to half of it. That has consequences most Australian investors underestimate.

**Correlated risk, not diversified risk.** Banks and miners look unrelated but share a common driver: Chinese demand supports commodity prices, which supports the terms of trade, national income, employment, and therefore mortgage credit quality. A Chinese slowdown hits both halves of the index at once. Holding "the market" in Australia is a much more concentrated bet than holding the S&P 500.

**The sector gaps.** Technology is roughly 3% of the ASX 200 versus about 30% of the S&P 500. That single difference explains most of the ASX's relative underperformance in growth-led periods and its relative resilience in rate-shock periods.

**Worked example.** An investor holding an ASX 200 index fund plus the four major banks individually believes they are diversified. Their true exposure to Australian housing credit may exceed 40% of the portfolio.

**The practical implication:** for an Australian investor, genuine diversification usually requires deliberate international exposure - which then reintroduces the currency and franking considerations covered in asx107.

**The trap:** treating index concentration as a static fact. Index weights drift with performance, and the concentration is highest exactly when the leading sector is most extended.`,

  asx102: `## Going Deeper: The 45-Day Rule and Who the Credit Is Worth Something To

Franking credits are not automatically yours for holding a stock over an ex-dividend date.

**The 45-day holding rule** requires shares to be held **at risk** for at least 45 days (excluding the days of acquisition and disposal) around the ex-dividend date to claim the credits - with a small-shareholder exemption where total franking credits for the year are under $5,000. "At risk" is meaningful: hedging the position with derivatives can void the entitlement.

**Dividend stripping** - buying just before ex-date and selling after to harvest the credit - is exactly what this rule exists to prevent, and the ATO treats aggressive versions as tax avoidance.

**Who the credit is actually worth something to,** in descending order: superannuation funds in **pension phase** (0% tax, full cash refund); super funds in **accumulation** (15% tax, refund of the excess); low-income individuals; higher-rate individuals (partial offset only); and **foreign investors**, to whom the credit is worth exactly nothing.

**Worked example.** A $0.70 fully franked dividend grosses up to $1.00 with a $0.30 credit. A pension-phase investor receives $0.70 cash plus a $0.30 refund - an effective 43% uplift. A US investor holding the same shares receives $0.70, full stop.

**The trap:** comparing an ASX stock's yield to a US stock's yield without grossing up - and then over-correcting by grossing up for an investor who cannot claim the credit.`,

  asx103: `## Going Deeper: Reading the Cost Curve

The cost curve - every producer of a commodity ranked from lowest to highest cost, plotted against cumulative supply - is the single most important object in resources analysis, because it determines both the price floor and who survives.

**How it sets price.** In a balanced market the price sits near the marginal producer's cost - the last tonne needed to meet demand. When demand falls, the highest-cost producers shut in, supply contracts, and the price finds a new floor at the new marginal cost.

**Why first-quartile position is everything.** A first-quartile producer earns a margin through the entire cycle. A fourth-quartile producer earns spectacular returns at the peak and goes bankrupt in the trough. The first is an investment; the second is an option on the commodity price.

**Worked example.** Iron ore at $120/t with a producer at $40/t all-in costs: margin $80/t. Price falls to $75/t: the first-quartile producer still earns $35/t while producers above $75 are losing cash on every tonne and must curtail. That curtailment is what stops the price falling further.

**Also track:** the **AUD/USD**, because Australian producers earn USD revenue against AUD costs - a falling AUD lowers their position on the global cost curve without any operational change at all.

**The trap:** using P/E on a miner. At the top of the cycle peak earnings make the multiple look cheap; at the bottom, depressed earnings make it look expensive. Price-to-NAV and cost-curve position are the right tools.`,

  asx104: `## Going Deeper: The Four Levers of Bank Earnings

Bank profit decomposes into four drivers, and knowing which is moving explains almost every bank result.

**1. Net interest margin (NIM)** = net interest income / average interest-earning assets. Rising rates initially widen NIM (deposits reprice slower than loans), then compress it as deposit competition catches up and customers shift from at-call to term deposits. The **deposit beta** - the share of a rate rise passed to depositors - is the number analysts obsess over.
**2. Volume** - credit growth, essentially housing credit in Australia.
**3. Costs** - the cost-to-income ratio; the majors run in the low-to-mid 40s%.
**4. Credit quality** - the bad and doubtful debts charge, expressed in basis points of loans. This is the swing factor: it is near zero for years and then, in a downturn, is large enough to eliminate a year's profit growth on its own.

**Capital.** CET1 ratio is the binding constraint on buybacks and dividends. APRA's "unquestionably strong" benchmark is 10.5% for the majors; capital above that is what funds returns.

**Worked example.** A $900B loan book with a 10bps NIM improvement adds roughly **$900M** of annual revenue - and a 10bps rise in the loan loss charge takes roughly the same amount away. The two levers are the same size.

**The trap:** valuing a bank on EV/EBITDA. Debt is a bank's raw material, so enterprise value is meaningless. Use P/B against ROE, and dividend yield against the payout ratio's sustainability.`,

  asx105: `## Going Deeper: The REIT Metrics That Matter

REIT accounting has enough quirks that standard metrics actively mislead.

**FFO and AFFO, not EPS.** Net income for a REIT includes property revaluations, which are non-cash and volatile. \`FFO = Net income + Depreciation − Gains on property sales\`. \`AFFO = FFO − maintenance capex − straight-lining of rent adjustments\`. AFFO is what actually funds the distribution, and the **AFFO payout ratio** is the real test of distribution sustainability.

**Cap rate arithmetic.** \`Property value = Net operating income / Cap rate\`. Cap rates move with bond yields, so a 100bps rise in rates that lifts cap rates from 5.0% to 6.0% cuts property value by **17%** - with no change in the rent roll. This is why REITs are the purest long-duration equity exposure.

**Gearing and covenants.** Look-through gearing (debt / total assets) typically runs 25–35%. Covenants often bite around 50%. Because falling property values raise gearing mechanically, a REIT can breach a covenant without borrowing a dollar - which is when equity raises at dilutive prices happen.

**WALE** (weighted average lease expiry) measures income durability. A 7-year WALE with government tenants is a bond; a 2-year WALE in secondary office is an equity with problems.

**Worked example.** A REIT with $4.00 NTA trading at $3.00 is at a 25% discount - the market is pricing further cap-rate expansion. Solve for what cap rate justifies $3.00; if that rate is already above recent comparable transactions, the discount may be excessive.

**The trap:** buying a REIT for its yield without checking the AFFO payout ratio and the debt maturity schedule.`,

  asx106: `## Going Deeper: The Structural Realities of Small Caps

The small-cap opportunity is real, and so are the frictions that consume it.

**Liquidity is a position-size constraint, not a footnote.** If a stock trades $200,000 a day and you own $2M, exiting takes weeks and moves the price against you the whole way. A workable rule of thumb: hold no more than 10–20% of average daily volume, so a full exit takes days, not months.

**Spreads and market impact.** A 2% bid-ask spread costs 2% round-trip before any market impact - against an expected annual return of maybe 15%, that is a substantial hurdle paid on entry and exit.

**Dilution risk** (see asx108). Small caps raise capital far more often than large caps, usually via placements retail cannot access, at discounts retail absorbs.

**Index inclusion as the exit.** The classic thesis is to own quality before institutions can. Entering the ASX 300 or 200 forces passive buying, which is the re-rating you were positioned for - and often the point at which to reduce.

**Worked example.** A profitable niche company with 40% insider ownership, no debt and a self-funding growth plan is a genuinely different asset from a pre-revenue explorer, even though both sit in "small caps". The first cannot dilute you; the second must.

**The trap:** applying large-cap position sizes. In small caps, position size should be set by liquidity first and conviction second.`,

  // ── Valuation ───────────────────────────────────────────────────────────
  vm101: `## Going Deeper: Building a Defensible Comps Set

The peer group is the entire analysis. Everything downstream is arithmetic.

**Screen on economics, not sector labels.** Genuine comparability means similar growth rate, similar margin structure, similar capital intensity, similar end-market exposure and similar geography. A GICS sector code is a starting filter, not an answer - two "software" companies with 15% and 45% growth are not comparable at any multiple.

**Use the median, and show the range.** The median is robust to the one peer trading at 90× because of a takeover rumour. But also report the quartiles: a subject at 14× against a peer range of 11–13× is expensive; against a range of 9–26× it tells you nothing.

**Regress rather than eyeball.** With six or more peers, regress the multiple against the driver - EV/Sales against growth rate, or P/E against ROE. The regression line gives a *justified* multiple for the subject's fundamentals, and the residual tells you whether it is genuinely cheap or simply lower-quality. This is what separates professional comps work from a table of averages.

**Worked example.** Peers average 18× P/E but their growth ranges 4–22%. Regressing P/E on growth gives roughly \`P/E ≈ 9 + 0.75 × growth%\`. The subject grows 12%, so its justified multiple is ~18×. It trades at 14× - a genuine discount, not an artefact of mix.

**The trap:** relative valuation is silent on absolute value. If the entire peer group is mispriced, "cheap versus peers" means nothing. Always triangulate with a DCF.`,

  vm102: `## Going Deeper: When the DDM Is the Right Tool

The Gordon growth model looks trivially simple, which causes it to be applied where it does not belong and dismissed where it is the best available tool.

**It works properly only when three conditions hold:** the company is mature with stable growth below the discount rate; dividends are paid consistently and bear a sensible relationship to earnings; and growth is genuinely sustainable. That describes utilities, regulated infrastructure, mature banks and some REIT-like structures - a small but important part of the market.

**Sustainable growth,** properly derived: \`g = ROE × (1 − payout ratio)\`. A bank earning 13% ROE paying out 70% can sustainably grow at 13% × 0.30 = **3.9%**. If management guides to 8% growth on that payout, either ROE must rise or capital must be raised. The identity makes the guidance falsifiable.

**The sensitivity problem.** \`P = D1 / (Ke − g)\` has a denominator that is a small difference between two uncertain numbers. With Ke = 9% and g = 4%, the denominator is 5%. Move g to 5% and value rises 25%. This is not a flaw to be avoided - it is the honest sensitivity of the underlying economics - but it means a DDM must always be presented as a range.

**Multi-stage versions** handle companies transitioning from high growth to maturity: model dividends explicitly through the transition, then apply Gordon to the terminal stage.

**The trap:** applying a DDM to a low- or no-payout compounder. If a company retains everything to reinvest at a high ROIC, its dividend tells you nothing about its value.`,

  vm103: `## Going Deeper: When EV/EBITDA Lies

EV/EBITDA is the institutional default because it neutralises capital structure and tax. Its weaknesses are equally systematic.

**EBITDA ignores capital intensity.** Charlie Munger's objection stands: depreciation is a real cost for a business that must replace its assets. A telecom or a miner spending capex equal to 90% of EBITDA has far less economic cash flow than the multiple implies. **EV/EBIT** or **EV/(EBITDA − capex)** are the honest alternatives for asset-heavy businesses.

**EBITDA ignores working capital.** A company growing fast with a 90-day cash conversion cycle consumes cash that never appears in EBITDA.

**"Adjusted EBITDA" is where sins are buried.** Add-backs for restructuring that recurs annually, stock-based compensation, "pre-opening costs", and management's estimate of run-rate synergies are all common. Always rebuild EBITDA from reported figures rather than accepting the company's presentation.

**Worked example.** Two companies both at 10× EV/EBITDA on $500M EBITDA. Company A spends $100M capex; Company B spends $420M. On EV/(EBITDA − capex) they trade at 12.5× and 62.5× respectively. The identical headline multiple concealed an entirely different economic reality.

**Where it genuinely excels:** comparing companies with different leverage, M&A and LBO analysis (where the acquirer will change the capital structure anyway), and any situation with different tax domiciles.

**The trap:** using EV/EBITDA on banks and insurers, where debt is raw material and enterprise value has no meaning.`,

  vm104: `## Going Deeper: PEG's Hidden Assumptions

PEG = P/E ÷ growth rate, with "1.0 is fair" as the folk rule. It is a useful rough sort and a poor precision tool, and knowing why makes it far more usable.

**It ignores risk entirely.** Two companies both on a PEG of 1.0, one a stable consumer staple and one a single-product biotech, are not equivalently priced. Growth without a risk adjustment is half an analysis.

**It ignores the quality of growth.** Growth funded by dilutive equity issuance or by acquisitions at high multiples is worth far less than organic growth funded from internal cash flow at a high ROIC. PEG treats them identically.

**It breaks at the extremes.** Below ~5% growth the ratio is unstable and can be enormous for a perfectly sound business; above ~30% it is meaningless because such rates never persist long enough to justify the arithmetic.

**Use forward growth, matched to the multiple.** A trailing P/E divided by a forward growth rate is a mismatch that flatters every fast grower.

**PEGY** - \`P/E / (growth + dividend yield)\` - is the sensible extension for income-paying companies: a 12× P/E with 4% growth and 5% yield has a PEGY of 1.33, a very different picture from its 3.0 PEG.

**Worked example.** Company A: 30× P/E, 30% growth, PEG 1.0, but growth is acquisition-driven and ROIC is below WACC. Company B: 20× P/E, 15% growth, PEG 1.33, organic, 25% ROIC. B is the better business at the "worse" PEG.

**The trap:** screening on PEG alone. It is a first filter, never a conclusion.`,

  vm201: `## Going Deeper: Where LBO Returns Actually Come From

An LBO's IRR decomposes into three sources, and knowing the split tells you what kind of deal it is.

1. **Debt paydown** - cash flow retires debt, and equity grows even at a flat enterprise value.
2. **EBITDA growth** - operational improvement or organic growth.
3. **Multiple expansion** - exiting at a higher multiple than entry.

Sponsors underwrite deals assuming **no multiple expansion** (often assuming exit = entry multiple, or lower). A deal that only works with multiple expansion is a bet on the market, not on the business.

**Worked example.** Enter at 10× EBITDA of $100M = $1,000M EV, funded with $600M debt and $400M equity. Over five years EBITDA grows to $130M and $250M of debt is repaid. Exit at 10× = $1,300M EV, less $350M debt = **$950M equity**. MOIC = 2.4×; IRR ≈ **19%**. Attribution: EBITDA growth contributed $300M, debt paydown $250M, multiple expansion nothing.

**What makes a business LBO-able:** stable, predictable cash flows; low capital intensity; a defensible market position; low cyclicality; and identifiable cost or growth levers. Cyclical, capital-hungry businesses cannot carry the leverage.

**Why it matters to a public-market investor:** an LBO model gives you a **floor valuation** - the price at which a financial buyer could pay and still earn ~20% IRR. A public company trading below its LBO value is a takeover candidate, and that is a real support under the share price.

**The trap:** modelling leverage the credit market would never actually provide. Check the implied debt/EBITDA against what is being underwritten today.`,

  vm202: `## Going Deeper: NAV and the P/NAV Discount

Resource NAV valuation is a DCF of a **finite** asset, which changes several things structurally.

**The build.** Model production year by year over the life of mine; apply a commodity price deck (usually spot for near years fading to a long-run consensus price); subtract operating costs, sustaining capital and tax; discount at a rate reflecting jurisdiction and asset risk - commonly **8–10% real** for gold, sometimes higher for single-asset or frontier-jurisdiction projects. Then bridge: NAV = PV of mine cash flows + other assets − net debt − corporate costs capitalised.

**Reserve categories are not interchangeable.** Proven and probable **reserves** are economically extractable and belong in a base-case NAV. **Measured, indicated and inferred resources** are progressively less certain; inferred resources should be risk-weighted heavily or excluded. Companies quote resources because the number is bigger.

**P/NAV as the comparison metric.** Producing gold miners have historically traded around 0.8–1.2× NAV; developers at 0.3–0.6× NAV, reflecting funding, permitting and construction risk. The re-rating from developer to producer is the core thesis in single-asset developers.

**Worked example.** A single-asset developer with NAV of $1.2B trading at $480M is on 0.4× NAV. If it reaches production and re-rates to 0.9×, the equity is worth $1.08B - before any change to the resource or the commodity price.

**The trap:** using spot commodity prices for the entire mine life. A 20-year mine valued at a cyclical peak price is not a valuation, it is an extrapolation.`,

  vm203: `## Going Deeper: What Separates a Thesis from a Position

A complete investment thesis answers five questions in order, and the fourth and fifth are the ones most people skip.

**1. What does the business do, and why does it earn returns above its cost of capital?** The moat, in one paragraph, tested against numbers (see fs205).
**2. What is it worth?** A range from multiple methods, with the assumptions that drive it stated.
**3. Why is it mispriced?** This is the crux. Markets are mostly efficient, so you must be able to name the reason your view differs: a time-horizon mismatch, misunderstood accounting, a temporary dislocation, forced selling, or genuine under-coverage. "It looks cheap" is not a reason - it is an observation that thousands of others have also made.
**4. What is the catalyst, and over what horizon?** Something must convert value into price: an earnings inflection, a capital-allocation change, an index inclusion, a spin-off, a regulatory decision. Without one, cheap can stay cheap indefinitely.
**5. What would prove me wrong?** Specific, observable, pre-committed. "Gross margin falls below 38% for two consecutive quarters" is a falsifier. "The story changes" is not.

**Position sizing follows from the answers,** not from enthusiasm: expected value drives the buy, the bull-to-bear range drives the size, the bear case drives the review trigger (see vm204).

**Worked example of a pre-mortem.** Before buying, write the note explaining why the position lost 40%. If you cannot write it convincingly, you do not yet understand the risks. If you can, you have just written your monitoring checklist.

**The trap:** a thesis that cannot be wrong. If no observable outcome would change your mind, you are not analysing - you are believing.`,
}
