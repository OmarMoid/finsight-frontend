// ============================================================================
// Learning Hub — expansion pack.
//
// New topics across all five categories, merged into CATEGORIES /
// LESSON_CONTENT / QUIZ_BANKS by learningContent.js before it builds its topic
// index. Kept in a separate file so the original curriculum stays readable and
// so a future batch can be added the same way.
//
// The Valuation additions (vm105 / vm204 / vm205 / vm206) deliberately mirror
// what the Research tab's engine now does — cost of capital, scenario ladders,
// price targets and ranges — so the lesson and the tool teach each other.
// ============================================================================

// ── New topics, keyed by the category they belong to ───────────────────────
export const EXTRA_TOPICS = {
  fundamentals: [
    { id: 'fs104', title: 'Working Capital and the Cash Conversion Cycle', level: 'Beginner', duration: 18 },
    { id: 'fs206', title: 'Margins - Gross, Operating, Net', level: 'Intermediate', duration: 22 },
    { id: 'fs207', title: 'Stock-Based Compensation and Dilution', level: 'Intermediate', duration: 20 },
    { id: 'fs305', title: 'Goodwill, Intangibles and Acquisition Accounting', level: 'Advanced', duration: 28 },
  ],
  technical: [
    { id: 'ta105', title: 'Trend, Range and Choosing a Timeframe', level: 'Beginner', duration: 16 },
    { id: 'ta206', title: 'Relative Strength vs the Index', level: 'Intermediate', duration: 20 },
    { id: 'ta304', title: 'Market Breadth and Internals', level: 'Advanced', duration: 28 },
  ],
  macro: [
    { id: 'ma104', title: 'Reading the Economic Calendar', level: 'Beginner', duration: 18 },
    { id: 'ma205', title: 'Credit Spreads and Financial Conditions', level: 'Intermediate', duration: 24 },
    { id: 'ma206', title: 'Labour Market Data - Payrolls, Claims, Sahm Rule', level: 'Intermediate', duration: 22 },
    { id: 'ma304', title: 'Fiscal Deficits and Bond Supply', level: 'Advanced', duration: 28 },
  ],
  asx: [
    { id: 'asx107', title: 'Superannuation and Australia’s Investor Base', level: 'Beginner', duration: 18 },
    { id: 'asx108', title: 'Capital Raisings, Placements and Dilution', level: 'Intermediate', duration: 24 },
    { id: 'asx109', title: 'Battery Materials - Lithium, Copper, Gold', level: 'Intermediate', duration: 24 },
  ],
  valuation: [
    { id: 'vm105', title: 'Cost of Capital - CAPM, Beta and WACC', level: 'Intermediate', duration: 26, labModel: 'dcf' },
    { id: 'vm205', title: 'Reading a Sell-Side Research Note', level: 'Intermediate', duration: 22 },
    { id: 'vm204', title: 'Scenario and Probability-Weighted Valuation', level: 'Advanced', duration: 30, labModel: 'dcf' },
    { id: 'vm206', title: 'Sensitivity Analysis, Ranges and Monte Carlo', level: 'Advanced', duration: 28, labModel: 'dcf' },
  ],
}

// ── Lesson bodies ──────────────────────────────────────────────────────────
export const EXTRA_LESSONS = {
  // ── Fundamentals ────────────────────────────────────────────────────────
  fs104: `## The Money Trapped Inside the Business

Working capital is the cash a company must keep tied up just to operate: inventory sitting in warehouses, invoices customers haven't paid yet, less the invoices the company itself hasn't paid. Formally, \`Working Capital = Current Assets − Current Liabilities\`, but the number that matters analytically is **operating** working capital: receivables + inventory − payables. Cash and debt are excluded because they are financing, not operations.

## The Cash Conversion Cycle

The cash conversion cycle (CCC) measures how many days a dollar stays trapped:

\`CCC = DSO + DIO − DPO\`

- **DSO** (days sales outstanding) = \`Receivables / Revenue × 365\` - how long customers take to pay.
- **DIO** (days inventory outstanding) = \`Inventory / COGS × 365\` - how long stock sits.
- **DPO** (days payables outstanding) = \`Payables / COGS × 365\` - how long the company takes to pay suppliers.

Worked example: a retailer with **$40M receivables**, **$120M inventory**, **$90M payables**, **$600M revenue** and **$420M COGS**. DSO = 40/600 × 365 = **24 days**. DIO = 120/420 × 365 = **104 days**. DPO = 90/420 × 365 = **78 days**. CCC = 24 + 104 − 78 = **50 days**. Half a quarter of trading is funded out of the company's own pocket.

## Negative Working Capital Is a Superpower

Some businesses collect cash before they spend it. Supermarkets sell stock in weeks but pay suppliers in months. Software firms bill annually in advance. Their CCC is **negative**, which means growth *generates* cash instead of consuming it - the customer funds the expansion. This is one of the most under-appreciated quality signals on a balance sheet.

## What Changes Tell You

The level of working capital matters less than its **direction relative to revenue**. If revenue grows 10% and receivables grow 35%, one of three things is happening: the company is selling to weaker customers, channel-stuffing to hit a number, or losing pricing discipline. All three eventually show up in cash flow. Rising inventory ahead of flat sales is the same story in a different account.

## Common Mistakes

Treating a working-capital release as recurring earnings. A company can flatter one year's free cash flow by squeezing suppliers or running inventory down - neither is repeatable, and both usually reverse. Always check whether a jump in operating cash flow came from *profit* or from *the working-capital line*.

## How a PM Uses It

Working capital is the bridge between the income statement and reality. Before trusting a DCF, a portfolio manager checks that reinvestment in working capital is modelled at all - a fast-growing business with a 60-day CCC needs real cash to fund each extra dollar of sales, and a model that ignores it overstates free cash flow badly.`,

  fs206: `## Three Margins, Three Different Questions

Margins are the clearest window into what kind of business you own. Each level of the income statement answers something different, and confusing them is a classic beginner error.

- **Gross margin** = \`(Revenue − COGS) / Revenue\`. Answers: *do we have pricing power?*
- **Operating margin (EBIT margin)** = \`EBIT / Revenue\`. Answers: *is the core business efficient once we pay for people, R&D and marketing?*
- **Net margin** = \`Net Income / Revenue\`. Answers: *what actually reaches shareholders after interest and tax?*

Worked example: two companies both earn **$100M revenue** and **$8M net income** - identical 8% net margins. Company A has a 70% gross margin and heavy R&D spend; Company B has a 20% gross margin and thin overheads. A is a software business investing through the income statement; B is a distributor with structurally no pricing power. Same bottom line, completely different futures.

## Operating Leverage

Fixed costs mean profits move faster than revenue. If a company has **$60M fixed costs** and a 50% contribution margin, revenue rising from $150M to $180M (+20%) lifts EBIT from $15M to $30M (**+100%**). The same mechanism works brutally in reverse - this is why cyclical companies look cheap at the top of the cycle and expensive at the bottom.

## Benchmarks Worth Carrying

Software: 70–85% gross, 20–35% operating at scale. Consumer brands: 40–60% gross. Retail/distribution: 20–35% gross, 3–8% operating. Miners and airlines: no meaningful gross margin - read EBITDA margin instead. **Never compare margins across industries**; compare a company to its own history and its direct peers.

## Reading the Direction

A rising gross margin usually means price increases are sticking or mix is shifting to better products. A falling gross margin with rising revenue often means the company is buying growth with discounts. Operating margin diverging from gross margin tells you the cost base is where the story is - a company can hold price while its sales-and-marketing spend runs away from it.

## Common Mistakes

Reading a single quarter. Margins swing with seasonality, one-off legal costs, and inventory write-downs. Read four to eight quarters and look at the trend line, not the point.

## How a PM Uses It

Margin trajectory is the main input to a forecast. A DCF's assumption of "EBIT margin expands from 22% to 26% over five years" is doing enormous work in the output - a PM will interrogate that assumption harder than almost anything else in the model, because it is the number analysts are most reliably too optimistic about.`,

  fs207: `## The Expense That Doesn't Look Like One

Stock-based compensation (SBC) pays employees in shares rather than cash. It is a genuine expense - it appears on the income statement and reduces net income - but because no cash leaves the business it gets **added back** in the cash flow statement, and therefore inflates operating cash flow and free cash flow. This is the single most contested line in modern equity analysis.

## Why It Matters

If a company reports **$1.0B free cash flow** while issuing **$400M of stock** to staff, the cash figure is real but your *ownership* of it just shrank. Buffett's framing settles the argument: if compensation isn't an expense, what is it - and if it isn't in earnings, where should it be?

Worked example: a company with **200M shares** grants **6M shares** a year (3% of the count) and buys back **$300M** of stock at **$50** (6M shares). Share count is flat, earnings look clean, and the buyback looks like capital return. It isn't - **the entire buyback was spent offsetting dilution**. The shareholder received nothing.

## How to Measure It Properly

1. **SBC as a % of revenue.** Under 3% is unremarkable; 10%+ at a mature company is a red flag.
2. **Net dilution** = shares issued for comp − shares retired by buybacks, as a % of the count. This is the number that actually costs you.
3. **Cash-adjusted FCF** = reported FCF − SBC. Compare valuation multiples on this basis, not the reported one.

## Diluted vs Basic, and the Treasury Stock Method

Diluted share count assumes in-the-money options and RSUs convert. It uses the treasury stock method: proceeds from option exercise are assumed to buy back stock at the *current* price. That means **dilution mechanically worsens as the share price rises** - a detail that surprises people when a stock doubles and diluted EPS grows more slowly than expected.

## Common Mistakes

Accepting "adjusted EBITDA" or "non-GAAP EPS" that excludes SBC without recomputing it yourself. Most high-growth companies present exactly this. Add it back in and the picture can change from "profitable" to "not yet".

## How a PM Uses It

For any company where SBC exceeds ~5% of revenue, a PM values the business on cash-adjusted free cash flow and tracks net dilution every year. A business that must issue 4% of itself annually to retain staff has to grow per-share value 4% faster just to stand still.`,

  fs305: `## What Happens When One Company Buys Another

When an acquirer pays more than the fair value of the target's identifiable net assets, the excess is recorded as **goodwill**. Alongside it, previously unrecognised **intangibles** - customer relationships, brands, developed technology, patents - are placed on the balance sheet for the first time at fair value.

Worked example: Company A buys Company B for **$1.2B**. B's identifiable net assets are worth **$400M**, and the purchase price allocation assigns **$300M** to customer relationships and **$100M** to technology. Goodwill = 1,200 − 400 − 300 − 100 = **$400M**.

## Why This Distorts Everything After

1. **Amortisation of acquired intangibles** hits GAAP earnings for years, even though the cash was spent once. This is why acquisitive companies push "adjusted EPS" so hard.
2. **Goodwill is not amortised** - it is tested annually for impairment. It sits on the balance sheet at cost until management admits the deal didn't work.
3. **ROIC gets flattered** if you strip goodwill out of invested capital. Always compute ROIC **including** goodwill when judging whether the acquisition created value; the acquirer really did spend that money.

## Impairments Are Confessions

A goodwill write-down is non-cash and backward-looking, so the market often shrugs at it. Analytically, it is management stating publicly that a past acquisition is worth less than they paid. A pattern of repeated impairments is a capital-allocation indictment, not an accounting event. Track cumulative impairments against cumulative deal spend.

## Serial Acquirers: Two Very Different Species

Some roll-ups genuinely create value by buying small, unloved businesses below their own multiple and improving them. Others manufacture the *appearance* of growth: acquired revenue papers over flat organic growth, while intangible amortisation and integration costs get adjusted away. The test is **organic growth disclosed separately**. If a company won't give you it, assume the worst.

## Common Mistakes

Comparing an acquisitive company's P/E to an organic grower's without adjusting. Also: assuming goodwill has liquidation value. In a distress scenario goodwill is worth zero - which is why net **tangible** assets exist as a separate measure.

## How a PM Uses It

For any serial acquirer, a PM rebuilds free cash flow after **all** acquisition spend (treating M&A as capex, because for that business model it is) and checks whether ROIC including goodwill beats the cost of capital. If it doesn't, the growth is being purchased at a loss and the multiple should compress, not expand.`,

  // ── Technical ───────────────────────────────────────────────────────────
  ta105: `## The First Question: Trend or Range?

Almost every technical mistake comes from applying trend tools to a ranging market or range tools to a trending one. Before any indicator, classify the market.

- **Trending**: price makes higher highs and higher lows (up) or lower highs and lower lows (down). Moving averages are stacked and sloping. Momentum tools work; mean-reversion tools bleed.
- **Ranging**: price oscillates between a floor and a ceiling with no directional progress. Moving averages flatten and tangle. Overbought/oversold tools work; breakout signals mostly fail.

## Timeframes Nest

A stock can be in a daily downtrend inside a weekly uptrend. Neither reading is wrong - they answer different questions. The rule that keeps you out of trouble: **trade the timeframe you can actually monitor, and use the timeframe above it for direction**. If you review positions weekly, the weekly chart sets your bias and the daily chart sets your entry.

Worked example: a stock at **$48** is above a rising 200-day average at **$40** (weekly uptrend) but has fallen from $55 and sits below a falling 20-day at **$50** (daily pullback). A long-term investor sees a pullback in an uptrend; a short-term trader sees a downtrend. Both are looking at the same chart.

## Higher Highs, Higher Lows - Precisely

Define swing points before you eyeball them. A swing high is a bar whose high exceeds the two bars either side; a swing low is the mirror. Mark them, then check the sequence. This mechanical definition removes most of the wishful thinking from trend identification.

## Failed Breakouts Are the Most Reliable Signal

When price breaks a range high and then closes back inside within a few bars, the breakout has failed - and failed breakouts tend to run hard in the opposite direction, because everyone who bought the break is now offside. This is a range trader's best setup and a breakout trader's worst nightmare.

## Common Mistakes

Switching timeframes to justify a losing position ("it's still fine on the weekly"). Decide the timeframe before the trade, not after.

## How a Professional Uses It

Discretionary managers use trend/range classification mainly for **sizing and patience**, not entries: in a confirmed trend they hold through noise and add on pullbacks; in a range they cut position size and take profits at the edges. The classification changes behaviour, not just the buy button.`,

  ta206: `## Beating the Market Is a Ratio, Not a Price

Relative strength (RS) plots a stock **divided by** an index - say \`CBA.AX / XJO\` or \`AAPL / SPX\`. The line rises when the stock outperforms and falls when it lags, regardless of whether either is going up in absolute terms. It is the single most useful chart most investors never look at.

Worked example: a stock falls from **$100 to $90** (−10%) while its index falls **15%**. Absolute chart: ugly. Relative chart: rising. That stock is being accumulated while the market is sold - exactly the profile that leads the next advance.

## Why It Works

Institutional money is measured against a benchmark, so it flows toward what is already outperforming. That flow is persistent enough that relative strength has one of the most durable track records in empirical finance (the momentum factor). It is not a prediction of value - it is a measurement of demand.

## Reading It

- **RS rising while price falls** = accumulation into weakness. Watch closely.
- **RS falling while price rises** = the stock is up but lagging; it is a source of funds for others.
- **RS breaking a downtrend** often precedes an absolute breakout by weeks.

Do not confuse this with Wilder's **RSI**, which measures a stock against *its own* recent history. Relative strength compares to *other assets*. Same words, entirely different tools.

## Sector Relative Strength

Run the same ratio at the sector level (e.g. XLF/SPX) to see where money is rotating. Sector RS often turns before individual names, and it connects directly to the macro cycle: financials lead when rates rise, staples lead when growth rolls over.

## Common Mistakes

Chasing relative strength at the end of a long run - RS is a trend measure and trends end. Pair it with valuation: strong RS on a reasonable multiple is a very different proposition from strong RS on a record multiple.

## How a PM Uses It

Relative strength is primarily a **sell discipline**. A holding whose thesis is intact but whose RS has been deteriorating for months is telling you the market disagrees with you and is voting with size. Most PMs won't add to a name making new relative lows, whatever the model says.`,

  ta304: `## What the Index Price Hides

An index is a weighted average, and averages lie. In 2023–24 the S&P 500 rose while more than half its members fell, because a handful of mega-caps carried it. **Breadth** measures how much of the market is actually participating.

## The Core Measures

- **Advance/Decline line**: cumulative (advancers − decliners) each day. Rising A/D confirms an index rally; a rising index with a falling A/D line is a narrowing, fragile advance.
- **% of members above their 200-day average**: above 60% is a healthy trend, below 40% is a broken one, below 20% is washout territory.
- **New highs vs new lows**: expanding new highs confirm strength; a rally with expanding new *lows* underneath is a classic distribution signal.
- **Equal-weight vs cap-weight** (e.g. RSP vs SPY): the ratio falling means the average stock is losing to the giants.

Worked example: an index makes a new high, but only **38%** of members are above their 200-day and the A/D line peaked two months ago. The index is being held up by concentration. This does not time a top - breadth can stay narrow for a long time - but it tells you the market is one leadership stumble away from a fast decline.

## Breadth Thrusts

The mirror image is more actionable. When breadth expands violently off a low - for instance the percentage of members above their 50-day going from under 10% to over 90% in a few weeks - forward returns have historically been strong. Rare, but worth knowing.

## Volatility and Positioning

Pair breadth with the **VIX term structure**. VIX futures in backwardation (front month above later months) signals genuine stress and, historically, decent odds of a bounce. Persistent contango is the normal, complacent state.

## Common Mistakes

Treating breadth divergence as a timing signal. It is a **condition**, not a trigger. Divergences can persist for a year. Use them to adjust risk appetite, not to short an index.

## How a PM Uses It

Breadth informs gross and net exposure rather than individual stock picks. Narrowing breadth with rising indices typically pushes a PM toward higher-quality, larger names and away from speculative small caps - precisely because those are what break first when the leadership finally cracks.`,

  // ── Macro ───────────────────────────────────────────────────────────────
  ma104: `## The Market Trades the Surprise, Not the Number

Every scheduled data release comes with a consensus forecast. Prices already embed that forecast. What moves markets is the **deviation** - the surprise - and the direction of revisions to prior months.

Worked example: payrolls consensus is **+180k**. The print is **+165k**, seemingly a miss. But the prior two months are revised **up by 90k** combined. Net-net the labour market is stronger than believed, and bond yields rise despite the "miss". Reading only the headline gets this exactly backwards.

## The Releases That Actually Matter

**Tier 1 - moves everything:** US CPI, non-farm payrolls, FOMC decision and the dot plot, and the quarterly refunding announcement.
**Tier 2 - moves rates and sectors:** PCE deflator (the Fed's preferred inflation gauge), ISM manufacturing and services, retail sales, initial jobless claims (the fastest weekly read on the labour market).
**Australia:** monthly and quarterly CPI, RBA decision and Statement on Monetary Policy, labour force survey, and Chinese activity data - which matters more to the ASX than most domestic releases because of the iron ore link.

## Reading a Release Properly

1. **Headline vs core.** Core strips food and energy; central banks target something close to it.
2. **Revisions.** Frequently more informative than the new number.
3. **Composition.** In CPI, services inflation is stickier and more policy-relevant than goods. In payrolls, check whether the gain is concentrated in one non-cyclical sector like healthcare.
4. **The market's reaction to the news** is itself information. A hot inflation print that fails to push yields up tells you the bad news was already positioned for.

## Common Mistakes

Trading the first move. Algorithmic reactions in the first seconds frequently reverse once the detail is digested - especially on CPI, where the market often reacts to the headline before the core-services breakdown is read.

## How a PM Uses It

Most long-term investors should use the calendar defensively: know when the volatility is scheduled and avoid initiating positions into a Tier 1 release. The exception is a genuine regime signal - a run of CPI prints confirming disinflation, or claims breaking out of range - which changes the discount rate applied to every holding.`,

  ma205: `## The Market That Tells the Truth First

Credit markets are less forgiving than equity markets. Bondholders have no upside beyond their coupon, so they price downside relentlessly. Credit spreads - the extra yield corporate bonds pay over Treasuries of the same maturity - are one of the best real-time gauges of systemic stress there is.

- **Investment grade (IG) spread**: typically 90–150bps in calm conditions.
- **High yield (HY) spread**: typically 300–500bps calm, 800bps+ in genuine stress, over 1,000bps in a crisis.

Worked example: HY spreads widen from **340bps to 520bps** over six weeks while equity indices are only 4% off their highs. Credit is signalling that refinancing is getting harder and default expectations are rising. Historically, equities eventually follow credit, not the other way round.

## Why Spreads Drive Valuations

A company's cost of debt is the risk-free rate plus its spread. Widening spreads raise the weighted average cost of capital directly, which lowers every discounted valuation - and they hit leveraged, low-quality and long-duration businesses hardest. This is the transmission channel from "financial conditions" to your DCF.

## Financial Conditions Indices

Central banks and banks publish composite financial conditions indices blending rates, spreads, equity valuations and the dollar. The insight worth carrying: **the Fed does not really set policy through the funds rate alone - it sets it through financial conditions**. If it hikes and conditions *loosen* (because equities rally and spreads tighten), the hike did nothing, and more will follow.

## The Refinancing Wall

Track when a company's - or a sector's - debt matures. Cheap debt issued in a low-rate era eventually has to be refinanced at current rates. A business earning a 9% return on capital that must refinance 3% debt at 8% has just lost most of its equity return, without anything changing operationally.

## Common Mistakes

Watching only the level of spreads. The **rate of change** matters more: a fast 100bps widening from a low base is more dangerous than a stable wide level, because it reflects a repricing in progress.

## How a PM Uses It

Widening credit spreads push a PM toward balance-sheet quality: net cash instead of net debt, long-dated fixed-rate maturities instead of near-term floating ones. That rotation typically happens well before the earnings damage shows up in the numbers.`,

  ma206: `## The Data That Decides the Cycle

Central banks with a dual mandate care about employment as much as inflation, so labour data drives rate expectations, which drive discount rates, which drive every valuation you own.

## The Releases, Fastest to Slowest

- **Initial jobless claims** (weekly): the fastest, noisiest read. Watch the 4-week moving average. A sustained break above roughly 260–280k in the US has historically marked genuine deterioration.
- **Non-farm payrolls** (monthly): jobs added, unemployment rate, average hourly earnings, participation rate. Note that the job count and the unemployment rate come from **two different surveys** (establishment and household) and routinely disagree.
- **Employment cost index / wage growth**: the inflation-relevant part. Wages growing at 4%+ with 1.5% productivity growth implies ~2.5% unit labour cost inflation - above target.

## The Sahm Rule

One of the more reliable recession indicators: when the **3-month average unemployment rate rises 0.50 percentage points above its lowest 3-month average of the prior 12 months**, a recession has historically already begun.

Worked example: unemployment troughs at **3.5%**, then the 3-month average reaches **4.0%**. That 0.5pp rise triggers the rule. The point is not the level - 4.0% is historically low - but the **rate of change**. Labour markets rarely deteriorate a little and then stop; layoffs beget lower spending, which begets more layoffs.

## Why Rising Unemployment Can Be Bullish (Briefly)

In an overheating economy where the central bank is trying to slow demand, softening labour data raises the odds of rate cuts, and equities often rally. That relationship inverts sharply once deterioration is fast enough to threaten earnings - "bad news is good news" works until it very abruptly doesn't. Recognising that flip is one of the hardest and most valuable macro judgements there is.

## Common Mistakes

Reacting to a single payrolls print. The margin of error on the monthly change is roughly ±100k, and revisions are large. Trend, not point.

## How a PM Uses It

Labour data sets the cycle read that determines sector positioning: early-cycle strength favours cyclicals and small caps; deterioration favours staples, healthcare and quality balance sheets. FinSight's Research tab uses exactly this signal - the 12-month change in unemployment is one of four inputs to its macro regime classification.`,

  ma304: `## Who Buys All Those Bonds?

Government deficits must be financed by issuing bonds. When deficits are large and persistent, the supply of bonds grows - and, all else equal, more supply means lower prices and higher yields. This is bond supply as a driver of the risk-free rate, and therefore of every discount rate in your models.

Worked example: a government running a **6% of GDP** deficit in a full-employment economy must find buyers for that paper every year. If the central bank is simultaneously running quantitative tightening (shrinking its own holdings), the private sector must absorb both. The clearing price is a higher yield - which raises the risk-free rate in every DCF, independent of what inflation or growth are doing.

## Term Premium

The yield on a 10-year bond is roughly the average expected short rate over ten years **plus a term premium** - compensation for the risk of holding duration. Term premium had been near zero or negative for much of the 2010s; heavy issuance, less price-insensitive central-bank buying and inflation uncertainty push it back up. A rising term premium steepens the curve *without* any change in expected policy - an important distinction, because the two steepenings mean opposite things for equities.

## Fiscal Impulse vs Fiscal Level

Markets respond to the **change** in the deficit (the impulse), not its level. A deficit shrinking from 8% to 6% of GDP is contractionary for growth even though 6% is still enormous. Conversely, stimulus into a tight economy is inflationary and typically forces the central bank to offset it - fiscal and monetary policy pulling against each other is a recipe for higher real rates.

## Debt Sustainability in One Inequality

If the interest rate on debt (**r**) exceeds nominal growth (**g**), the debt-to-GDP ratio rises mechanically unless the government runs a primary surplus. Years of **r < g** made large debts manageable; a sustained regime of **r > g** changes the arithmetic and raises the odds of higher taxes, financial repression, or inflation as the adjustment mechanism.

## Common Mistakes

Assuming high debt automatically means crisis. Japan has carried enormous debt for decades. What matters is currency of issuance, the domestic savings base, central bank reaction function, and r versus g.

## How a PM Uses It

Fiscal analysis mostly enters portfolios through the **discount rate and the curve**, not through stock picking. Persistently higher long yields compress long-duration assets - unprofitable growth, REITs, utilities and infrastructure - and favour businesses with near-term cash flows and pricing power.`,

  // ── ASX ─────────────────────────────────────────────────────────────────
  asx107: `## The $4 Trillion Reason the ASX Behaves the Way It Does

Australia's compulsory superannuation system channels a fixed percentage of every wage into investment funds every single pay cycle. That creates a structural, price-insensitive bid for Australian assets that has no direct equivalent in most markets, and it explains several ASX quirks at once.

## What It Does to the Market

1. **Persistent inflows.** Money arrives whether valuations are attractive or not, which supports the market and helps explain why the ASX has historically not gotten as cheap in drawdowns as smaller markets.
2. **A home bias.** Australian funds hold far more domestic equity than the country's ~2% share of global market cap would justify - largely because **franking credits are worthless to foreign assets** and valuable to super funds in accumulation and pension phase.
3. **Demand for yield.** A large retiree cohort in pension phase pays 0% tax and can therefore claim franking credits as a **cash refund**. That makes fully franked dividends unusually attractive to Australians specifically, and it is why ASX companies pay out far more of their earnings than US peers.

Worked example: a fully franked **$0.70** dividend grosses up to **$1.00**. A pension-phase investor at a 0% tax rate receives the $0.70 cash *and* a $0.30 refund - an effective yield 43% higher than the headline. The same dividend is worth exactly $0.70 to a foreign holder.

## The Consequences for Analysis

Because so much capital demands income, ASX management teams are rewarded for paying dividends and punished for retaining earnings. This is a genuine structural drag on the reinvestment rate - one reason the ASX has so few global-scale growth companies. When a company like CSL retains earnings to compound, it is going against the grain of its own investor base.

## Index Effects

Super funds largely index or index-hug, so ASX 200 **inclusion and exclusion** move prices materially. A company entering the index gets bought by every passive fund on the rebalance date regardless of valuation. Watching index review announcements is a legitimate, if crowded, source of edge.

## Common Mistakes

Assuming a high headline ASX yield means the market is cheap. Much of that yield is a tax artefact and a payout-ratio artefact, not a valuation signal.

## How a PM Uses It

Australian PMs model dividends and franking explicitly rather than treating them as residual, and they watch super fund flows and index reviews as a distinct, non-fundamental driver of price.`,

  asx108: `## How Australian Companies Actually Raise Money

The ASX has some of the most permissive capital-raising rules in the developed world, and if you own small and mid caps you will meet them repeatedly. Understanding the mechanics is not optional - dilution is the main way retail holders quietly lose money on the ASX.

## The Instruments

- **Placement**: shares issued directly to institutions, typically at a discount, usually completed overnight. Listing Rule 7.1 allows up to **15%** of issued capital in any 12 months without shareholder approval (plus an extra 10% under 7.1A for smaller companies with approval). **Retail holders are excluded entirely and diluted.**
- **Entitlement offer (rights issue)**: existing holders can buy new shares pro rata, so participating holders are not diluted. **Renounceable** rights can be sold; **non-renounceable** cannot, which is materially worse for anyone who can't fund the take-up.
- **Share Purchase Plan (SPP)**: retail holders can apply for a capped parcel (commonly up to $30,000), often to soften the optics of a placement. Frequently scaled back.

Worked example: a company with **100M shares** at **$1.00** does a 15% placement at **$0.85**. It issues 15M shares and raises $12.75M. Pre-raise market cap $100M; post-raise value $112.75M across 115M shares = **$0.98** theoretical price. A non-participating holder's stake falls from 1.00% to 0.87% and the share price drops - a real, immediate wealth transfer to the institutions who were invited.

## The Question That Matters

Not *"is it dilutive?"* - every raise is. The question is **what is the money for**, and what return will it earn. Raising at a discount to fund a project earning above the cost of capital creates value even after dilution. Raising to fund operating losses, or to repay debt the business can't service, is dilution funding survival. Read the announcement's use-of-funds section and compare it to the last one.

## Warning Signs

Repeated raises within 18 months; deepening discounts; raising immediately after positive drilling results or a promotional announcement; and an ever-growing "options and performance rights" table in the annual report.

## Common Mistakes

Buying into an SPP purely because it is "at a discount". If the stock trades below the SPP price by the allocation date - which happens often - the discount is illusory.

## How a PM Uses It

Professional investors treat placement access as part of the return. Not being able to participate is a structural disadvantage for retail in Australian small caps, and it is a good reason to weight self-funding, cash-generative businesses far more heavily in that part of the market.`,

  asx109: `## Australia Digs What the Energy Transition Needs

Beyond iron ore and coal, the ASX hosts a deep bench of lithium, copper, nickel, rare earths and gold producers and developers. Each obeys the commodity-cycle logic of asx103, but with important differences worth knowing individually.

## Lithium

Priced off contracts and spot indices, not a deep futures market, so price discovery is poor and volatile. Two ore types matter: **spodumene** (hard rock, Australia's specialty, faster to build) and **brine** (South America, cheaper to operate, slower to ramp). The cycle is brutal because supply responds faster than in most commodities - a price spike funds a wave of new spodumene projects that arrives together and crashes the price. Watch **cost per tonne SC6** (6% spodumene concentrate) and where the producer sits on the cost curve.

## Copper

The best long-term structural story in mining: electrification demand grows steadily while grades decline globally and new discoveries are scarce and increasingly in difficult jurisdictions. Copper is also the classic macro barometer - "Dr Copper" tracks global industrial activity closely enough that it is genuinely useful as a cycle read.

## Gold

Behaves as a monetary asset, not an industrial one. Its price is driven primarily by **real interest rates** (nominal yields minus inflation expectations) and the US dollar, with central bank buying as a swing factor. Falling real rates lift gold because the opportunity cost of holding a zero-yielding asset falls. Gold *miners* add operating leverage on top: a miner with **$1,400/oz all-in sustaining costs (AISC)** sees margin rise from $600 to $1,000 - **+67%** - on a gold move from $2,000 to $2,400.

## The Metric That Cuts Across All Three

**AISC** (all-in sustaining cost) is the single most important number in a producer's results: total cost per unit including sustaining capital. It tells you who survives the trough. Also track **reserve life** (reserves ÷ annual production) - a miner with a 6-year reserve life must find or buy more, and acquisitions at the top of the cycle are how mining companies destroy capital.

## Developers vs Producers

A developer has no revenue and burns cash to a final investment decision. It carries funding risk, permitting risk, construction risk and cost blowouts - capex overruns of 30–50% on Australian projects are common. Producers are cheaper to analyse and far less likely to dilute you (see asx108).

## How a PM Uses It

Position on the **cost curve** first, commodity view second. A first-quartile producer survives a downturn that eliminates its high-cost competitors and then earns supernormal returns on the recovery - which is why cost position, not the price forecast, is where the durable edge sits.`,

  // ── Valuation ───────────────────────────────────────────────────────────
  vm105: `## The Number That Decides Everything Else

Change a DCF's discount rate by one percentage point and the fair value can move 15–25%. It is the most consequential and least examined input in most models. Building it properly is what separates a defensible valuation from a number.

## Cost of Equity: CAPM

\`Ke = Risk-free rate + β × Equity Risk Premium (+ size premium)\`

- **Risk-free rate**: the long government bond yield - the US 10-year, or the Australian 10-year for ASX names. Use the **live** yield, not a remembered constant. A model still running a 2% risk-free rate in a 4.5% world is systematically overvaluing everything.
- **Equity risk premium (ERP)**: the extra return equities must offer over bonds. Long-run mature-market estimates cluster around **4.5–5.5%**. Critically, ERP is **countercyclical** - it widens in stress, exactly when the assets it discounts are already falling.
- **Beta**: sensitivity to the market. Raw regression betas are noisy and mean-revert, so practitioners use an **adjusted beta**: \`0.67 × raw + 0.33 × 1.0\` (the Blume adjustment, and Bloomberg's default). A raw beta of 2.2 becomes 1.81.
- **Size premium**: small caps have persistently out-earned what beta alone predicts. Practitioner cost-of-capital builds add roughly 0.6% for large caps up to ~3.5% for micro caps.

Worked example: risk-free **4.7%**, ERP **5.2%**, raw beta **1.09** → adjusted **1.06**, size premium **0%** for a mega cap. \`Ke = 4.7% + 1.06 × 5.2% = 10.2%\`.

## WACC: Blending in Debt

\`WACC = (E/V) × Ke + (D/V) × Kd × (1 − tax rate)\`

Debt is cheaper than equity because it ranks ahead and because interest is tax-deductible. **Use market values, not book values**, for E and D. Cost of debt (Kd) should be the yield the company would pay to issue *today*, not the historical average coupon on its existing debt.

## Which One to Discount With

Match the rate to the cash flow. **FCFF (unlevered)** - cash to all capital providers - is discounted at **WACC** and gives enterprise value; subtract net debt for equity value. **FCFE (levered)** - cash after interest and debt movements - is discounted at **Ke** and gives equity value directly. Mixing them is the most common modelling error there is.

## Common Mistakes

Using a single WACC for a conglomerate with divisions of genuinely different risk; using book value of equity; and forgetting that a highly leveraged company's beta is partly a financing artefact, which is why unlevering and relevering betas exists.

## How a PM Uses It

Because the cost of capital is so sensitive, a PM never takes a point estimate seriously - they read the **sensitivity grid** across a plausible band. FinSight's Research tab shows exactly this build-up (risk-free, ERP, adjusted beta, size premium) so you can see which assumption is doing the work.`,

  vm205: `## Reading Research Like a Professional

Sell-side research notes follow a strict, predictable structure. Knowing how to read one - and where the pressure points are - lets you extract the useful parts and discard the marketing.

## The Anatomy

1. **Rating**: Buy/Overweight, Hold/Neutral, Sell/Underweight. Almost always defined against expected **total return** over 12 months relative to a hurdle - the analyst's cost of equity or coverage-universe average.
2. **Price target**: a 12-month forward value, not an intrinsic value today. Standard practice is to take a fair value and **roll it forward one year at the cost of equity**, or to apply a target multiple to next-twelve-months earnings.
3. **Estimates**: revenue, EBIT/EBITDA, EPS for the next two to three years. **This is the most valuable part of the note.** The direction of estimate revisions is a better predictor of returns than the rating.
4. **Valuation methodology**: DCF, comps, sum-of-parts, or a blend - with the target multiple stated.
5. **Risks to the thesis** and, near the back, **disclosures**.

## The Structural Biases

- **Ratings skew positive.** Buys typically outnumber Sells by a wide margin. Investment banking relationships, corporate access, and the simple fact that a Sell rating makes management stop taking your calls all push the same way.
- **Targets cluster near price.** An analyst who publishes a target 60% below the market is taking career risk, so targets tend to follow price rather than lead it.
- **Estimates are revised late and in a herd.** Numbers move after the company guides, not before.

## What Is Genuinely Valuable

Industry knowledge, channel checks, the estimate model itself, and above all **changes**: an upgrade paired with a large estimate revision carries information; a target tweak with unchanged estimates is noise. Read the *revision*, not the *level*.

## Consensus as a Tool

Consensus is the market's collective forecast, so it tells you **what is already priced in**. That makes it a benchmark to differ from, not an answer to copy. The most valuable positions come from a differentiated, defensible view versus consensus - which requires knowing consensus precisely.

## Common Mistakes

Treating the average price target as a forecast. Academic work has found consensus targets to be optimistic on average and poor at predicting returns. Their real use is as a *sentiment* gauge.

## How This Maps to FinSight

The Research tab is deliberately built in this shape: a rating on a defined total-return scale, a 12-month price target rolled forward at the cost of equity and blended with consensus in proportion to coverage depth, a bull/base/bear ladder, and every assumption disclosed. Where it disagrees with the street, the conviction flag tells you so explicitly - which is the honest version of what a research note does implicitly.`,

  vm204: `## One Number Is Always Wrong

A single fair value implies a precision no forecast possesses. Professional valuation works in **scenarios**: a small set of internally coherent futures, each with a value and a probability, combined into an expected value and - just as importantly - a range.

## Building Coherent Scenarios

The essential discipline is that within a scenario, assumptions must move **together**. A bull case is not just higher growth; it is higher growth *and* the multiple the market pays for that growth *and*, usually, an easier cost of capital. A bear case is weaker growth *and* multiple compression *and* a higher risk premium. Varying one input at a time understates the true range badly, because in reality these variables are correlated.

Worked example - a semiconductor company at **$212**:

| Scenario | Growth | Discount | Terminal | Multiple | Value | Prob. |
|---|---|---|---|---|---|---|
| Bull | 40.5% | 12.7% | 3.6% | +17% | $464 | 22% |
| Base | 34.7% | 14.1% | 3.0% | 0% | $338 | 50% |
| Bear | 28.2% | 16.5% | 2.3% | −20% | $233 | 28% |

Expected value = 0.22 × 464 + 0.50 × 338 + 0.28 × 233 = **$336**.

## Where Probabilities Come From

Not from thin air. Anchor them to something observable: the macro regime (recession risk justifies a fatter bear tail), the company's own history of hitting guidance, and the dispersion of analyst estimates. State them explicitly so someone can disagree with the probability rather than the whole model.

## Risk/Reward and Asymmetry

\`Risk/Reward = (Bull − Price) / (Price − Bear)\`

A 3:1 ratio means you are risking one unit to make three. Position sizing should follow asymmetry, not just expected return. A stock with +20% expected return and a 1:1 ratio is a worse proposition than one with +12% expected return and 4:1, because the second survives being wrong.

## Scenario Width as Information

The distance between bull and bear tells you how much you actually know. A utility's ladder should be narrow; an early-stage biotech's should be enormous. If your bull-to-bear spread is 120% of the current price, that is not a valuation - it is an admission that the outcome is unknowable, and it should be sized accordingly.

## Common Mistakes

Setting the base case as the average of bull and bear (it should be the *most likely* outcome, and can sit anywhere in the range), and quietly assigning 80% to the base so the exercise changes nothing.

## How a PM Uses It

Expected value drives the buy decision; the **range** drives position size; the bear case drives the stop or the review trigger. A PM who cannot state what would make them wrong does not have a thesis - they have a position.`,

  vm206: `## Mapping the Uncertainty You Already Have

Sensitivity analysis does not add uncertainty to a model - it reveals the uncertainty that was always there. Every valuation has one or two assumptions doing most of the work, and finding them is the point of the exercise.

## The Two-Way Data Table

The standard tool: fair value across a grid of the two most consequential inputs, almost always **WACC × terminal growth** in a DCF.

Worked example: base case WACC 10%, terminal growth 2.5%, fair value $100.

| | 9.0% | 10.0% | 11.0% |
|---|---|---|---|
| **2.0% g** | $104 | $88 | $77 |
| **2.5% g** | $118 | $100 | $86 |
| **3.0% g** | $137 | $115 | $97 |

Fair value spans **$77 to $137** across assumptions no one could call unreasonable. That spread is the honest answer. Quoting "$100" alone is false precision, and the grid is what stops you defending a decimal place you never earned.

## Why Terminal Value Dominates

In a typical DCF, 60–80% of present value sits in the terminal value. The perpetuity formula \`TV = FCF × (1+g) / (r − g)\` has a denominator that is a small difference between two uncertain numbers, so it amplifies error violently. This is exactly why practitioners cross-check the perpetuity against an **exit multiple** and report the growth rate that multiple implies: \`g = (r × m − 1) / (m + 1)\`. If your exit multiple implies 6% perpetual growth, you have smuggled in an assumption that the company outgrows the economy forever.

## Tornado Charts

Rank every assumption by how much fair value moves across its plausible range, then plot the swings as horizontal bars, widest at the top. The result is usually humbling: two or three inputs dominate and the rest are rounding. Spend your research time on the top of the tornado.

## Monte Carlo

Rather than a handful of points, assign each key input a distribution and run thousands of simulations. Triangular distributions (min / most likely / max) are the practical choice - they need no statistical estimation beyond a range and a best guess. The output is a distribution of fair values, from which you can read a median, a confidence interval, and the **probability that fair value exceeds the current price** - a far more useful statement than a point estimate.

## The Big Caveat

Monte Carlo assumes your distributions and correlations are right. If growth and margins are modelled as independent when they are in fact strongly linked, the simulation will produce a confidently wrong, deceptively tight distribution. Precision in the output is not accuracy.

## How a PM Uses It

The range is the deliverable. A PM buys when the current price sits below the low end of a reasonable range - not when it sits below a point estimate - because that is the only version of the exercise that survives being slightly wrong about everything.`,
}

// ── Quiz banks for the new topics (10 questions each) ──────────────────────
export const EXTRA_LESSON_QUIZZES = {
  fs104: [
    { question: 'The cash conversion cycle is calculated as:', options: ['DSO + DIO − DPO', 'DSO − DIO + DPO', 'DIO − DSO − DPO', 'DSO + DPO − DIO'], correct: 'A', explanation: 'Days receivable plus days inventory, less days payable.' },
    { question: 'A negative cash conversion cycle means the company:', options: ['Is losing money', 'Collects from customers before paying suppliers', 'Has no inventory', 'Cannot pay its bills'], correct: 'B', explanation: 'Customers fund the business - growth generates cash rather than consuming it.' },
    { question: 'Days sales outstanding is:', options: ['Receivables / Revenue × 365', 'Inventory / COGS × 365', 'Payables / COGS × 365', 'Revenue / Assets'], correct: 'A', explanation: 'DSO measures how long customers take to pay.' },
    { question: 'Receivables growing far faster than revenue most likely signals:', options: ['Excellent collections', 'Weakening customer quality or channel stuffing', 'Lower leverage', 'Higher margins'], correct: 'B', explanation: 'Sales are being booked that are not converting to cash.' },
    { question: 'Operating working capital deliberately excludes:', options: ['Inventory', 'Receivables', 'Cash and debt', 'Payables'], correct: 'C', explanation: 'Cash and debt are financing items, not operations.' },
    { question: 'A supermarket typically has:', options: ['A very long positive CCC', 'A negative or near-zero CCC', 'No payables', 'No inventory'], correct: 'B', explanation: 'Fast stock turns and long supplier terms produce a negative cycle.' },
    { question: 'With $40M receivables on $600M revenue, DSO is approximately:', options: ['24 days', '67 days', '15 days', '104 days'], correct: 'A', explanation: '40/600 × 365 ≈ 24 days.' },
    { question: 'A one-off working capital release boosting operating cash flow should be treated as:', options: ['Recurring earnings power', 'Non-repeatable and likely to reverse', 'A permanent margin gain', 'Revenue'], correct: 'B', explanation: 'Squeezing suppliers or destocking is not a sustainable source of cash.' },
    { question: 'For a fast-growing company, ignoring working capital in a DCF will:', options: ['Understate free cash flow', 'Overstate free cash flow', 'Have no effect', 'Only affect terminal value'], correct: 'B', explanation: 'Each extra dollar of sales needs real cash tied up to support it.' },
    { question: 'Rising inventory alongside flat sales usually indicates:', options: ['Strong demand', 'Building unsold stock and possible future write-downs', 'Improved turnover', 'Lower costs'], correct: 'B', explanation: 'Stock accumulating without sales is a classic early warning.' },
  ],
  fs206: [
    { question: 'Gross margin primarily measures:', options: ['Tax efficiency', 'Pricing power relative to direct costs', 'Leverage', 'Asset turnover'], correct: 'B', explanation: 'It is revenue less cost of goods sold, over revenue.' },
    { question: 'Operating margin is:', options: ['Net income / revenue', 'EBIT / revenue', 'Gross profit / revenue', 'EBITDA / assets'], correct: 'B', explanation: 'EBIT margin captures the core business after operating expenses.' },
    { question: 'Operating leverage means that with high fixed costs:', options: ['Profits move more than proportionally to revenue', 'Profits are stable', 'Revenue is fixed', 'Margins never change'], correct: 'A', explanation: 'Fixed costs amplify both gains and losses.' },
    { question: 'With $60M fixed costs and a 50% contribution margin, revenue rising from $150M to $180M moves EBIT from:', options: ['$15M to $30M', '$15M to $18M', '$30M to $36M', '$15M to $20M'], correct: 'A', explanation: 'Contribution rises $15M, all of which drops to EBIT: $15M → $30M.' },
    { question: 'Comparing margins is only meaningful:', options: ['Across any two companies', 'Against the company’s own history and direct peers', 'Against the market index', 'Against bond yields'], correct: 'B', explanation: 'Margin norms differ enormously by industry.' },
    { question: 'A falling gross margin with rising revenue often means:', options: ['Pricing power is strengthening', 'Growth is being bought with discounts', 'Costs are falling', 'Taxes rose'], correct: 'B', explanation: 'Volume gained at the expense of price shows up here first.' },
    { question: 'Two companies with identical net margins but very different gross margins are best described as:', options: ['Identical businesses', 'Structurally different businesses with different futures', 'Both software firms', 'Both distributors'], correct: 'B', explanation: 'The cost structure, not the bottom line, defines the business model.' },
    { question: 'For miners and airlines, the more useful margin is:', options: ['Gross margin', 'EBITDA margin', 'Net margin only', 'None'], correct: 'B', explanation: 'Gross margin is not meaningful where COGS is not cleanly defined.' },
    { question: 'Operating margin diverging downward from a stable gross margin points to:', options: ['A pricing problem', 'A cost-base problem (opex growing faster than sales)', 'A tax problem', 'A dividend problem'], correct: 'B', explanation: 'Price is holding; spending below the gross line is the issue.' },
    { question: 'In a DCF, the margin assumption matters most because:', options: ['It is easy to verify', 'Analysts are reliably too optimistic about margin expansion', 'It does not affect value', 'It only affects year one'], correct: 'B', explanation: 'Assumed expansion compounds through the forecast and into terminal value.' },
  ],
  fs207: [
    { question: 'Stock-based compensation is added back in the cash flow statement because:', options: ['It is not an expense', 'No cash left the business', 'It is tax-free', 'It is a financing item'], correct: 'B', explanation: 'It is a real expense settled in shares rather than cash.' },
    { question: 'The effect of SBC on reported free cash flow is to:', options: ['Reduce it', 'Inflate it', 'Leave it unchanged', 'Make it negative'], correct: 'B', explanation: 'Adding back a real cost overstates the cash available to owners.' },
    { question: 'Net dilution is best measured as:', options: ['Shares issued for comp minus shares retired by buybacks', 'Total shares outstanding', 'Options granted only', 'Revenue per share'], correct: 'A', explanation: 'Only the net change in the count affects your ownership.' },
    { question: 'A company grants 6M shares and buys back exactly 6M shares. The shareholder has received:', options: ['A 3% capital return', 'Nothing - the buyback merely offset dilution', 'A dividend', 'A stock split'], correct: 'B', explanation: 'Flat share count means the buyback funded compensation, not returns.' },
    { question: 'Diluted EPS differs from basic EPS by assuming:', options: ['All debt converts', 'In-the-money options and RSUs convert to shares', 'Dividends are reinvested', 'Buybacks continue'], correct: 'B', explanation: 'Dilutive securities are treated as if exercised.' },
    { question: 'Under the treasury stock method, dilution from options:', options: ['Falls as the share price rises', 'Worsens as the share price rises', 'Is fixed', 'Is ignored'], correct: 'B', explanation: 'Exercise proceeds buy back fewer shares at a higher price.' },
    { question: 'Cash-adjusted free cash flow is calculated as:', options: ['FCF + SBC', 'FCF − SBC', 'FCF × SBC', 'FCF / shares'], correct: 'B', explanation: 'Subtracting SBC restores the true economic cost.' },
    { question: 'SBC above roughly 10% of revenue at a mature company is:', options: ['Normal', 'A red flag', 'Impossible', 'Tax-advantaged'], correct: 'B', explanation: 'It signals that a large share of value is going to employees, not owners.' },
    { question: 'Non-GAAP EPS that excludes SBC should be:', options: ['Accepted as reported', 'Recomputed with SBC included', 'Multiplied by the P/E', 'Ignored entirely'], correct: 'B', explanation: 'Excluding a genuine expense flatters the multiple.' },
    { question: 'A business issuing 4% of itself annually in compensation must:', options: ['Do nothing extra', 'Grow per-share value 4% faster just to stand still', 'Cut its dividend', 'Increase leverage'], correct: 'B', explanation: 'Dilution is a permanent headwind to per-share compounding.' },
  ],
  fs305: [
    { question: 'Goodwill arises when an acquirer pays:', options: ['Less than book value', 'More than the fair value of identifiable net assets', 'Exactly net asset value', 'In shares only'], correct: 'B', explanation: 'The unallocated excess of purchase price is recorded as goodwill.' },
    { question: 'Under current accounting, goodwill is:', options: ['Amortised straight-line', 'Tested annually for impairment', 'Expensed immediately', 'Ignored'], correct: 'B', explanation: 'It stays on the balance sheet until impaired.' },
    { question: 'A buys B for $1.2B; identifiable net assets are $400M and intangibles identified total $400M. Goodwill is:', options: ['$800M', '$400M', '$1.2B', '$0'], correct: 'B', explanation: '1,200 − 400 − 400 = $400M.' },
    { question: 'When judging whether an acquisition created value, ROIC should be computed:', options: ['Excluding goodwill', 'Including goodwill', 'On revenue', 'On EBITDA only'], correct: 'B', explanation: 'The acquirer genuinely spent that capital, so it belongs in the denominator.' },
    { question: 'Amortisation of acquired intangibles is the main reason acquisitive companies emphasise:', options: ['GAAP earnings', 'Adjusted or cash EPS', 'Dividend yield', 'Book value'], correct: 'B', explanation: 'Adjusted metrics strip a charge whose cash was spent once.' },
    { question: 'A goodwill impairment is best interpreted as:', options: ['A routine accounting entry', 'Management conceding a past acquisition is worth less than they paid', 'A cash outflow', 'A tax benefit'], correct: 'B', explanation: 'It is non-cash but it is a capital-allocation confession.' },
    { question: 'The key disclosure that separates a good roll-up from a bad one is:', options: ['Total revenue growth', 'Organic growth reported separately', 'Headcount', 'Dividend policy'], correct: 'B', explanation: 'Acquired revenue can hide flat or falling underlying growth.' },
    { question: 'In a distress or liquidation scenario, goodwill is worth:', options: ['Book value', 'Approximately zero', 'More than book', 'Its original cost'], correct: 'B', explanation: 'This is why net tangible assets is tracked separately.' },
    { question: 'For a serial acquirer, acquisition spending is best treated as:', options: ['A one-off', 'Effectively capital expenditure', 'A financing activity only', 'Irrelevant'], correct: 'B', explanation: 'If M&A is how the business grows, it is part of its reinvestment.' },
    { question: 'A pattern of repeated goodwill impairments indicates:', options: ['Conservative accounting', 'Persistently poor capital allocation', 'Strong organic growth', 'Low leverage'], correct: 'B', explanation: 'Repeatedly overpaying is a management-quality problem.' },
  ],
  ta105: [
    { question: 'A market making higher highs and higher lows is:', options: ['Ranging', 'In an uptrend', 'In a downtrend', 'Undefined'], correct: 'B', explanation: 'That sequence is the definition of an uptrend.' },
    { question: 'Mean-reversion tools work best in a:', options: ['Strong trend', 'Range', 'Breakout', 'Gap'], correct: 'B', explanation: 'Oscillators need a floor and ceiling to revert between.' },
    { question: 'A swing high is a bar whose high:', options: ['Is the highest of the year', 'Exceeds the two bars either side', 'Equals the close', 'Is above the moving average'], correct: 'B', explanation: 'A mechanical definition removes wishful trend reading.' },
    { question: 'A stock above a rising 200-day but below a falling 20-day is best described as:', options: ['A downtrend', 'A pullback within an uptrend', 'A range', 'A breakout'], correct: 'B', explanation: 'Longer timeframe up, shorter timeframe down.' },
    { question: 'The recommended relationship between timeframes is:', options: ['Trade the one above, monitor the one below', 'Trade the timeframe you can monitor; use the one above for bias', 'Only ever use one', 'Switch after entering'], correct: 'B', explanation: 'The higher timeframe sets direction, the lower sets timing.' },
    { question: 'A failed breakout - price breaking a range high then closing back inside - often leads to:', options: ['A continuation higher', 'A sharp move in the opposite direction', 'No movement', 'A gap up'], correct: 'B', explanation: 'Breakout buyers are trapped and forced to exit.' },
    { question: 'When moving averages flatten and tangle, the market is likely:', options: ['Trending strongly', 'Ranging', 'About to gap', 'Illiquid'], correct: 'B', explanation: 'No directional progress flattens the averages.' },
    { question: 'Switching timeframes after entering a losing trade is:', options: ['Good risk management', 'A common rationalisation to avoid taking a loss', 'Required by the method', 'Neutral'], correct: 'B', explanation: 'Decide the timeframe before the trade, not after.' },
    { question: 'In a confirmed trend, professionals typically:', options: ['Take profits at every wiggle', 'Hold through noise and add on pullbacks', 'Reduce to zero', 'Reverse daily'], correct: 'B', explanation: 'Classification changes behaviour and sizing more than entry timing.' },
    { question: 'Applying breakout systems in a range typically results in:', options: ['Consistent profits', 'Repeated false signals', 'No trades', 'Lower volatility'], correct: 'B', explanation: 'Ranges are precisely where breakouts fail most often.' },
  ],
  ta206: [
    { question: 'A relative strength line plots a stock:', options: ['Against its own history', 'Divided by an index', 'Against its moving average', 'Against its volume'], correct: 'B', explanation: 'RS is a ratio of the stock to a benchmark.' },
    { question: 'A stock falls 10% while its index falls 15%. Its relative strength line:', options: ['Falls', 'Rises', 'Is flat', 'Is undefined'], correct: 'B', explanation: 'Outperformance lifts the ratio even in an absolute decline.' },
    { question: 'RSI differs from relative strength in that RSI compares a stock to:', options: ['Its sector', 'Its own recent price history', 'The index', 'Bond yields'], correct: 'B', explanation: 'Same words, entirely different tools.' },
    { question: 'RS rising while absolute price falls suggests:', options: ['Distribution', 'Accumulation into weakness', 'A dividend cut', 'Index exclusion'], correct: 'B', explanation: 'The stock is being bought relative to everything else.' },
    { question: 'RS falling while price rises means the stock is:', options: ['Leading the market', 'Rising but lagging - a source of funds', 'Undervalued', 'Overbought'], correct: 'B', explanation: 'Money is leaving it for better-performing assets.' },
    { question: 'The persistence of relative strength is closely related to which documented factor?', options: ['Value', 'Momentum', 'Size', 'Quality'], correct: 'B', explanation: 'Benchmark-relative flows create durable momentum effects.' },
    { question: 'Sector relative strength is most useful for identifying:', options: ['Individual earnings surprises', 'Rotation between parts of the market', 'Dividend dates', 'Share counts'], correct: 'B', explanation: 'Sector RS often turns before individual names.' },
    { question: 'A key risk when acting on relative strength is:', options: ['It is too slow', 'Chasing it at the end of a long run', 'It cannot be charted', 'It requires options data'], correct: 'B', explanation: 'RS measures an existing trend, and trends end.' },
    { question: 'RS is best combined with:', options: ['Nothing else', 'A valuation check', 'Only volume', 'Only news'], correct: 'B', explanation: 'Strong RS on a reasonable multiple beats strong RS on a record one.' },
    { question: 'For most portfolio managers, relative strength functions mainly as a:', options: ['Buy trigger', 'Sell discipline', 'Position sizing formula', 'Tax tool'], correct: 'B', explanation: 'Deteriorating RS on a held name is the market voting against the thesis.' },
  ],
  ta304: [
    { question: 'Market breadth measures:', options: ['Index price level', 'How many members are participating in a move', 'Trading hours', 'Bid-ask spreads'], correct: 'B', explanation: 'Breadth looks underneath the weighted average.' },
    { question: 'A rising index with a falling advance/decline line indicates:', options: ['Broad strength', 'A narrowing, fragile advance', 'A crash', 'High dividends'], correct: 'B', explanation: 'A few large names are carrying the index.' },
    { question: 'The percentage of members above their 200-day average is considered healthy above roughly:', options: ['20%', '40%', '60%', '90%'], correct: 'C', explanation: 'Above 60% reflects genuine broad participation.' },
    { question: 'An equal-weight vs cap-weight ratio that is falling means:', options: ['The average stock is beating the giants', 'The giants are beating the average stock', 'Volatility is falling', 'Dividends are rising'], correct: 'B', explanation: 'Cap-weighted outperformance signals concentration.' },
    { question: 'A rally accompanied by expanding new lows is:', options: ['Confirmation of strength', 'A classic distribution signal', 'Impossible', 'Irrelevant'], correct: 'B', explanation: 'Underlying deterioration contradicts the headline index.' },
    { question: 'A breadth thrust - members above their 50-day going from under 10% to over 90% - has historically preceded:', options: ['Poor returns', 'Strong forward returns', 'No change', 'Guaranteed losses'], correct: 'B', explanation: 'Violent breadth expansion off a low is a rare, constructive signal.' },
    { question: 'VIX futures in backwardation indicates:', options: ['Complacency', 'Genuine near-term stress', 'Low volume', 'A dividend period'], correct: 'B', explanation: 'The front month pricing above later months reflects acute fear.' },
    { question: 'Breadth divergences are best treated as:', options: ['Precise timing triggers', 'A condition that adjusts risk appetite', 'Guaranteed reversals', 'Irrelevant noise'], correct: 'B', explanation: 'They can persist for a very long time.' },
    { question: 'Narrowing breadth typically pushes a PM toward:', options: ['Speculative small caps', 'Higher-quality larger names', 'Maximum leverage', 'Illiquid assets'], correct: 'B', explanation: 'The speculative end breaks first when leadership cracks.' },
    { question: 'The reason an index can rise while most members fall is:', options: ['Data error', 'Capitalisation weighting', 'Dividends', 'Short selling'], correct: 'B', explanation: 'A handful of mega-caps can outweigh hundreds of decliners.' },
  ],
  ma104: [
    { question: 'Markets primarily react to:', options: ['The absolute level of a data point', 'The deviation from consensus expectations', 'The release time', 'The publishing agency'], correct: 'B', explanation: 'The forecast is already in the price; the surprise is not.' },
    { question: 'Payrolls print +165k vs +180k expected, but prior months are revised up 90k. The labour market is:', options: ['Weaker than believed', 'Stronger than believed', 'Unchanged', 'Impossible to judge'], correct: 'B', explanation: 'Revisions more than offset the headline miss.' },
    { question: 'The Federal Reserve’s preferred inflation gauge is:', options: ['CPI', 'The PCE deflator', 'PPI', 'Import prices'], correct: 'B', explanation: 'The Fed targets PCE inflation, not CPI.' },
    { question: 'Core inflation excludes:', options: ['Housing', 'Food and energy', 'Services', 'Wages'], correct: 'B', explanation: 'Volatile components are stripped to see the underlying trend.' },
    { question: 'Within CPI, the more policy-relevant and persistent component is:', options: ['Goods', 'Services', 'Energy', 'Used cars'], correct: 'B', explanation: 'Services inflation is stickier and wage-linked.' },
    { question: 'The fastest weekly read on the US labour market is:', options: ['Non-farm payrolls', 'Initial jobless claims', 'GDP', 'ISM'], correct: 'B', explanation: 'Claims are weekly and highly timely.' },
    { question: 'For the ASX specifically, an often-underrated release is:', options: ['US retail sales', 'Chinese activity data', 'UK GDP', 'Japanese CPI'], correct: 'B', explanation: 'Chinese demand drives iron ore and therefore much of the index.' },
    { question: 'A hot inflation print that fails to lift yields tells you:', options: ['The data was wrong', 'The bad news was already positioned for', 'Rates will be cut', 'Nothing at all'], correct: 'B', explanation: 'The market’s reaction to news is itself information.' },
    { question: 'Trading the first move after a Tier 1 release is risky because:', options: ['Volumes are low', 'Algorithmic reactions often reverse once detail is digested', 'Markets are closed', 'Data is delayed'], correct: 'B', explanation: 'The initial spike frequently reverses on the breakdown.' },
    { question: 'For a long-term investor, the calendar is best used to:', options: ['Day-trade the releases', 'Avoid initiating positions into scheduled volatility', 'Ignore entirely', 'Time dividends'], correct: 'B', explanation: 'Know when the volatility is scheduled; act on regime changes, not prints.' },
  ],
  ma205: [
    { question: 'A credit spread is the yield on a corporate bond:', options: ['Minus the dividend yield', 'Over a Treasury of the same maturity', 'Divided by its coupon', 'Times its duration'], correct: 'B', explanation: 'It is the compensation for credit risk above the risk-free rate.' },
    { question: 'High-yield spreads in genuine stress typically exceed:', options: ['150bps', '300bps', '800bps', '50bps'], correct: 'C', explanation: 'Calm HY runs 300–500bps; stress pushes past 800bps.' },
    { question: 'Credit markets often lead equities because bondholders:', options: ['Have unlimited upside', 'Have capped upside and so price downside relentlessly', 'Trade more frequently', 'Receive dividends'], correct: 'B', explanation: 'Asymmetric payoffs make credit investors focus on default risk.' },
    { question: 'Widening spreads affect valuations by:', options: ['Lowering the cost of capital', 'Raising the cost of debt and therefore WACC', 'Raising terminal growth', 'Reducing beta'], correct: 'B', explanation: 'A higher WACC lowers every discounted valuation.' },
    { question: 'Widening spreads hurt which companies most?', options: ['Net-cash, short-duration businesses', 'Leveraged, low-quality, long-duration businesses', 'All equally', 'Only banks'], correct: 'B', explanation: 'Refinancing risk and duration sensitivity compound.' },
    { question: 'If a central bank hikes but financial conditions loosen, the hike has:', options: ['Been effective', 'Effectively done nothing, implying more to come', 'Caused a recession', 'Cut inflation'], correct: 'B', explanation: 'Policy transmits through conditions, not the policy rate alone.' },
    { question: 'A "refinancing wall" refers to:', options: ['A regulatory limit', 'A concentration of debt maturing and needing refinancing at current rates', 'A bank capital rule', 'An index methodology'], correct: 'B', explanation: 'Cheap legacy debt eventually reprices to today’s cost.' },
    { question: 'A company earning 9% on capital refinancing 3% debt at 8%:', options: ['Improves its equity return', 'Loses most of its equity return with no operational change', 'Is unaffected', 'Becomes investment grade'], correct: 'B', explanation: 'The spread between returns and funding cost collapses.' },
    { question: 'More informative than the level of spreads is:', options: ['Their rate of change', 'Their currency', 'Their issuance date', 'Their coupon'], correct: 'A', explanation: 'A fast widening from a low base signals repricing in progress.' },
    { question: 'Widening spreads typically push a PM toward:', options: ['Maximum leverage', 'Balance-sheet quality and long-dated fixed-rate debt', 'Small-cap speculation', 'Higher payout ratios'], correct: 'B', explanation: 'The rotation happens before earnings damage appears.' },
  ],
  ma206: [
    { question: 'The Sahm rule triggers when the 3-month average unemployment rate rises above its prior 12-month low by:', options: ['0.10pp', '0.50pp', '1.50pp', '3.00pp'], correct: 'B', explanation: 'A half-point rise off the low has reliably coincided with recession.' },
    { question: 'The Sahm rule emphasises:', options: ['The level of unemployment', 'The rate of change in unemployment', 'Wage growth', 'Participation'], correct: 'B', explanation: '4.0% is low, but getting there quickly from 3.5% is the signal.' },
    { question: 'US payrolls and the unemployment rate come from:', options: ['The same survey', 'Two different surveys that often disagree', 'Tax records', 'Company filings'], correct: 'B', explanation: 'Establishment and household surveys are separate.' },
    { question: 'The approximate margin of error on a monthly US payrolls change is around:', options: ['±10k', '±100k', '±500k', 'Zero'], correct: 'B', explanation: 'Which is why trend matters far more than any single print.' },
    { question: 'Wages growing 4% with 1.5% productivity growth implies unit labour cost inflation of roughly:', options: ['1.5%', '2.5%', '4.0%', '5.5%'], correct: 'B', explanation: '4% − 1.5% ≈ 2.5%, above most inflation targets.' },
    { question: 'Sustained initial claims breaking above roughly 260–280k has historically signalled:', options: ['An overheating economy', 'Genuine labour market deterioration', 'Falling inflation only', 'Nothing'], correct: 'B', explanation: 'Claims are the fastest indicator of a turning labour market.' },
    { question: '"Bad news is good news" for equities applies when:', options: ['Deterioration threatens earnings', 'Softening data raises the odds of rate cuts in an overheated economy', 'Always', 'Never'], correct: 'B', explanation: 'The relationship inverts once damage threatens profits.' },
    { question: 'Payroll gains concentrated in one non-cyclical sector such as healthcare suggest:', options: ['Broad-based strength', 'Narrower, lower-quality job growth', 'A data error', 'Rising productivity'], correct: 'B', explanation: 'Composition matters as much as the headline.' },
    { question: 'Labour markets rarely deteriorate a little and stop because:', options: ['Of seasonal adjustment', 'Layoffs reduce spending, which causes further layoffs', 'Of survey design', 'Wages are sticky'], correct: 'B', explanation: 'The feedback loop is self-reinforcing.' },
    { question: 'FinSight’s Research tab uses which labour input in its macro regime read?', options: ['Participation rate', 'The 12-month change in unemployment', 'Job openings', 'Union membership'], correct: 'B', explanation: 'Rate of change in unemployment is one of its four regime signals.' },
  ],
  ma304: [
    { question: 'Larger government deficits, all else equal, tend to push bond yields:', options: ['Lower', 'Higher', 'To zero', 'Unchanged'], correct: 'B', explanation: 'More supply requires a higher yield to clear.' },
    { question: 'Term premium is compensation for:', options: ['Credit risk', 'The risk of holding duration', 'Currency risk', 'Liquidity only'], correct: 'B', explanation: 'It is the extra yield above expected average short rates.' },
    { question: 'A rising term premium steepens the curve:', options: ['Only if policy changes', 'Without any change in expected policy', 'Never', 'Only in recessions'], correct: 'B', explanation: 'Which is why not all steepenings mean the same thing.' },
    { question: 'Markets respond primarily to the deficit’s:', options: ['Absolute level', 'Change (the fiscal impulse)', 'Currency', 'Publication date'], correct: 'B', explanation: 'A shrinking deficit is contractionary even if still large.' },
    { question: 'Debt-to-GDP rises mechanically without a primary surplus when:', options: ['r < g', 'r > g', 'r = 0', 'g > 5%'], correct: 'B', explanation: 'Interest cost outrunning nominal growth compounds the ratio.' },
    { question: 'Quantitative tightening alongside heavy issuance means:', options: ['The central bank absorbs supply', 'The private sector must absorb more paper', 'Yields must fall', 'Deficits shrink'], correct: 'B', explanation: 'Both add to the supply the market must take down.' },
    { question: 'High government debt does not automatically imply crisis because of factors like:', options: ['Currency of issuance and domestic savings', 'The colour of the flag', 'Population size only', 'Stock market size'], correct: 'A', explanation: 'Japan has sustained very high debt for decades.' },
    { question: 'Fiscal stimulus into a tight economy typically forces the central bank to:', options: ['Cut rates', 'Offset it with tighter policy', 'Do nothing', 'Buy bonds'], correct: 'B', explanation: 'Policies pulling against each other raise real rates.' },
    { question: 'Persistently higher long yields most compress:', options: ['Short-duration cash generators', 'Long-duration assets like unprofitable growth and REITs', 'Consumer staples only', 'Banks'], correct: 'B', explanation: 'Distant cash flows are discounted hardest.' },
    { question: 'Fiscal analysis reaches a portfolio mainly through:', options: ['Individual stock selection', 'The discount rate and the shape of the curve', 'Dividend policy', 'Index inclusion'], correct: 'B', explanation: 'It is a top-down driver of valuation, not a stock-specific one.' },
  ],
  asx107: [
    { question: 'Compulsory superannuation creates:', options: ['Volatile, price-sensitive flows', 'A persistent, largely price-insensitive bid for Australian assets', 'No effect on markets', 'Only bond demand'], correct: 'B', explanation: 'Money arrives every pay cycle regardless of valuation.' },
    { question: 'Australian funds hold more domestic equity than global weights justify largely because:', options: ['Of currency rules', 'Franking credits are worthless on foreign assets', 'Of index construction', 'Of trading hours'], correct: 'B', explanation: 'The tax benefit is available only on Australian franked dividends.' },
    { question: 'A pension-phase investor at a 0% tax rate receiving a fully franked dividend:', options: ['Pays tax on the grossed-up amount', 'Can claim the franking credit as a cash refund', 'Loses the credit', 'Must reinvest it'], correct: 'B', explanation: 'This is what makes franked yield so valuable domestically.' },
    { question: 'A $0.70 fully franked dividend grosses up to:', options: ['$0.70', '$1.00', '$0.91', '$1.30'], correct: 'B', explanation: '0.70 / (1 − 0.30) = $1.00.' },
    { question: 'The structural demand for income on the ASX contributes to:', options: ['Low payout ratios', 'High payout ratios and low reinvestment', 'High R&D spending', 'Frequent buybacks only'], correct: 'B', explanation: 'Management is rewarded for paying out rather than retaining.' },
    { question: 'One consequence of that payout culture is:', options: ['Many global-scale growth companies', 'Few global-scale growth companies', 'No dividends', 'Lower volatility'], correct: 'B', explanation: 'Capital returned is capital not compounded internally.' },
    { question: 'ASX 200 index inclusion moves prices because:', options: ['Of media coverage', 'Passive and index-hugging funds must buy on the rebalance date', 'Of franking', 'Of short selling'], correct: 'B', explanation: 'Passive demand is valuation-insensitive.' },
    { question: 'A high headline ASX dividend yield is:', options: ['Always a valuation signal', 'Partly a tax and payout-ratio artefact', 'Evidence of growth', 'Irrelevant'], correct: 'B', explanation: 'It does not by itself mean the market is cheap.' },
    { question: 'A fully franked dividend is worth how much to a foreign holder?', options: ['The grossed-up amount', 'Only the cash amount', 'Double', 'Nothing'], correct: 'B', explanation: 'Franking credits cannot be claimed by non-residents.' },
    { question: 'CSL retaining earnings to reinvest is notable because it:', options: ['Follows the ASX norm', 'Goes against the grain of its own investor base', 'Is illegal', 'Avoids tax'], correct: 'B', explanation: 'Most ASX investors demand income instead.' },
  ],
  asx108: [
    { question: 'Under Listing Rule 7.1, a company can issue up to what proportion of capital in 12 months without shareholder approval?', options: ['5%', '15%', '30%', '50%'], correct: 'B', explanation: 'Plus a further 10% under 7.1A for eligible smaller companies with approval.' },
    { question: 'In a placement, retail shareholders are:', options: ['Given priority', 'Excluded and diluted', 'Paid a premium', 'Given options'], correct: 'B', explanation: 'Placements go to institutions, usually overnight and at a discount.' },
    { question: 'An entitlement offer differs from a placement because:', options: ['It is always cheaper', 'Existing holders can subscribe pro rata and avoid dilution', 'It requires no disclosure', 'It is only for institutions'], correct: 'B', explanation: 'Pro rata participation preserves ownership percentage.' },
    { question: 'A non-renounceable rights issue is worse for a holder who cannot fund it because:', options: ['The rights cannot be sold', 'The price is higher', 'It is taxed', 'It is compulsory'], correct: 'A', explanation: 'Renounceable rights at least have salvage value.' },
    { question: '100M shares at $1.00; a 15% placement at $0.85 gives a theoretical post-raise price of about:', options: ['$1.00', '$0.98', '$0.85', '$1.15'], correct: 'B', explanation: '($100M + $12.75M) / 115M ≈ $0.98.' },
    { question: 'The right question about any capital raise is:', options: ['Is it dilutive?', 'What is the money for and what return will it earn?', 'Who underwrote it?', 'What day it settles'], correct: 'B', explanation: 'Every raise dilutes; only the use of funds decides value.' },
    { question: 'A Share Purchase Plan typically caps retail applications at around:', options: ['$1,000', '$30,000', '$500,000', 'No cap'], correct: 'B', explanation: 'And applications are frequently scaled back.' },
    { question: 'Raising capital repeatedly at deepening discounts usually indicates:', options: ['Strong demand', 'Funding operations or distress rather than growth', 'A takeover', 'Index inclusion'], correct: 'B', explanation: 'Serial dilution at worsening terms is a survival pattern.' },
    { question: 'Buying into an SPP purely for the discount is risky because:', options: ['SPPs are illegal', 'The stock may trade below the SPP price by allocation date', 'The discount is taxed', 'Shares are unlisted'], correct: 'B', explanation: 'The discount can evaporate before you receive the shares.' },
    { question: 'The structural disadvantage retail faces in ASX small caps argues for weighting toward:', options: ['Pre-revenue explorers', 'Self-funding, cash-generative businesses', 'Maximum leverage', 'Frequent traders'], correct: 'B', explanation: 'Businesses that need no capital cannot dilute you.' },
  ],
  asx109: [
    { question: 'AISC stands for:', options: ['Average industry sales cost', 'All-in sustaining cost', 'Annual invested share capital', 'Adjusted internalship cost'], correct: 'B', explanation: 'Total cost per unit including sustaining capital - the survival metric.' },
    { question: 'Australia’s lithium industry is built primarily on:', options: ['Brine', 'Hard-rock spodumene', 'Clay', 'Recycling'], correct: 'B', explanation: 'Spodumene is faster to build but higher cost than brine.' },
    { question: 'Lithium cycles are especially brutal because:', options: ['Demand is fixed', 'Supply responds quickly, so price spikes fund a wave of projects that arrive together', 'It cannot be stored', 'It is not traded'], correct: 'B', explanation: 'Fast supply response overshoots and crashes the price.' },
    { question: 'The long-term structural case for copper rests on:', options: ['Falling demand', 'Electrification demand against declining grades and scarce discoveries', 'Government subsidies', 'Recycling only'], correct: 'B', explanation: 'Supply growth is genuinely hard, unlike most commodities.' },
    { question: 'Gold’s price is driven primarily by:', options: ['Industrial demand', 'Real interest rates and the US dollar', 'Jewellery only', 'Mining costs'], correct: 'B', explanation: 'Falling real rates cut the opportunity cost of a zero-yield asset.' },
    { question: 'A miner with $1,400/oz AISC sees margin move from $600 to $1,000 when gold goes $2,000 → $2,400. That is:', options: ['+20%', '+67%', '+40%', 'unchanged'], correct: 'B', explanation: 'Operating leverage: a 20% price move produces a 67% margin move.' },
    { question: 'Reserve life is calculated as:', options: ['Reserves ÷ annual production', 'Production ÷ reserves', 'Reserves × price', 'Grade × tonnage'], correct: 'A', explanation: 'A short reserve life forces exploration or acquisitions.' },
    { question: 'Mining companies most often destroy capital by:', options: ['Paying dividends', 'Acquiring at the top of the cycle', 'Cutting costs', 'Hedging'], correct: 'B', explanation: 'Peak-cycle M&A is the classic value-destruction pattern.' },
    { question: 'Compared with producers, developers carry additional:', options: ['Dividend risk', 'Funding, permitting, construction and cost-blowout risk', 'Index risk only', 'No extra risk'], correct: 'B', explanation: 'Capex overruns of 30–50% are common on Australian projects.' },
    { question: 'The most durable edge in resources analysis is:', options: ['Forecasting the commodity price', 'Identifying cost-curve position', 'Trading the chart', 'Following broker upgrades'], correct: 'B', explanation: 'Low-cost producers survive troughs and earn supernormal returns on recovery.' },
  ],
  vm105: [
    { question: 'The CAPM cost of equity is:', options: ['Rf + β × ERP', 'Rf × β', 'ERP / β', 'β + ERP'], correct: 'A', explanation: 'Risk-free rate plus beta times the equity risk premium.' },
    { question: 'The Blume adjustment to beta is:', options: ['0.67 × raw + 0.33 × 1.0', '0.5 × raw', 'raw × 2', 'raw − 1'], correct: 'A', explanation: 'Raw betas mean-revert toward 1.0; this is Bloomberg’s default.' },
    { question: 'A raw beta of 2.2 becomes an adjusted beta of approximately:', options: ['2.2', '1.81', '1.0', '0.67'], correct: 'B', explanation: '0.67 × 2.2 + 0.33 = 1.81.' },
    { question: 'Long-run mature-market equity risk premium estimates cluster around:', options: ['1–2%', '4.5–5.5%', '9–10%', '15%'], correct: 'B', explanation: 'Roughly 4.5–5.5% is the practitioner consensus range.' },
    { question: 'The equity risk premium is countercyclical, meaning it:', options: ['Falls in stress', 'Widens in stress', 'Never changes', 'Tracks GDP'], correct: 'B', explanation: 'Investors demand more for risk exactly when assets are falling.' },
    { question: 'A size premium is added because small caps:', options: ['Are less volatile', 'Have historically out-earned what beta alone predicts', 'Pay more dividends', 'Have lower betas'], correct: 'B', explanation: 'Practitioner builds add ~0.6% (large) to ~3.5% (micro).' },
    { question: 'WACC uses which values for equity and debt?', options: ['Book values', 'Market values', 'Historical cost', 'Par values'], correct: 'B', explanation: 'Market values reflect the actual capital structure today.' },
    { question: 'The cost of debt used in WACC should be:', options: ['The historical average coupon', 'The yield the company would pay to issue today', 'The risk-free rate', 'Zero'], correct: 'B', explanation: 'Current marginal cost, not legacy cost.' },
    { question: 'FCFF should be discounted at:', options: ['Cost of equity', 'WACC', 'The risk-free rate', 'The dividend yield'], correct: 'B', explanation: 'Unlevered cash flow belongs to all capital providers.' },
    { question: 'Discounting FCFE at WACC instead of the cost of equity:', options: ['Is standard practice', 'Is a common and serious modelling error', 'Improves accuracy', 'Has no effect'], correct: 'B', explanation: 'The cash flow and the rate must match in leverage terms.' },
  ],
  vm205: [
    { question: 'A sell-side price target is normally:', options: ['An intrinsic value today', 'A 12-month forward value', 'A stop-loss level', 'A book value'], correct: 'B', explanation: 'Typically fair value rolled forward one year at the cost of equity.' },
    { question: 'Ratings are usually defined against:', options: ['Absolute price', 'Expected total return over 12 months versus a hurdle', 'Revenue growth', 'Dividend yield'], correct: 'B', explanation: 'The hurdle is often the cost of equity or coverage-universe average.' },
    { question: 'The most valuable part of a research note is generally:', options: ['The rating', 'The estimates and their revisions', 'The disclosures', 'The cover page'], correct: 'B', explanation: 'Estimate revision direction predicts returns better than the rating.' },
    { question: 'Sell-side ratings skew positive partly because:', options: ['Analysts are optimists by nature only', 'Banking relationships and corporate access create pressure', 'Regulation requires it', 'Sells are illegal'], correct: 'B', explanation: 'Structural incentives push toward Buy.' },
    { question: 'Price targets tend to:', options: ['Lead price', 'Follow price', 'Be random', 'Be fixed annually'], correct: 'B', explanation: 'Publishing far from the market carries career risk.' },
    { question: 'A target tweak with unchanged estimates is:', options: ['A strong signal', 'Largely noise', 'A downgrade', 'An upgrade'], correct: 'B', explanation: 'Read the revision, not the level.' },
    { question: 'Consensus is most useful as:', options: ['A forecast to copy', 'A measure of what is already priced in', 'A stop-loss', 'A dividend estimate'], correct: 'B', explanation: 'Edge comes from a defensible difference versus consensus.' },
    { question: 'Academic evidence suggests consensus price targets are:', options: ['Highly accurate', 'Optimistic on average and poor return predictors', 'Perfectly unbiased', 'Always too low'], correct: 'B', explanation: 'They are better read as a sentiment gauge.' },
    { question: 'Estimates typically move:', options: ['Before company guidance', 'After the company guides, in a herd', 'Randomly', 'Only annually'], correct: 'B', explanation: 'Which is why revision momentum persists.' },
    { question: 'FinSight’s Research tab blends consensus into its price target in proportion to:', options: ['Market cap', 'How well covered the stock is', 'Dividend yield', 'Sector'], correct: 'B', explanation: 'Deeper analyst coverage earns consensus more weight, capped at an even split.' },
  ],
  vm204: [
    { question: 'Within a single scenario, assumptions should:', options: ['Vary one at a time', 'Move together coherently', 'Stay at base case', 'Be randomised'], correct: 'B', explanation: 'Growth, multiple and discount rate are correlated in reality.' },
    { question: 'Varying one input at a time tends to:', options: ['Overstate the range', 'Understate the true range', 'Be exactly right', 'Eliminate uncertainty'], correct: 'B', explanation: 'It ignores the correlation between drivers.' },
    { question: 'Bull $464 (22%), base $338 (50%), bear $233 (28%). Expected value is approximately:', options: ['$345', '$336', '$310', '$400'], correct: 'B', explanation: '0.22(464) + 0.50(338) + 0.28(233) ≈ $336.' },
    { question: 'Risk/reward is calculated as:', options: ['(Bull − Price) / (Price − Bear)', '(Bull − Bear) / Price', 'Bull / Bear', 'Price / Bull'], correct: 'A', explanation: 'Upside to the bull case over downside to the bear case.' },
    { question: 'A stock with +12% expected return and 4:1 risk/reward versus +20% and 1:1 is:', options: ['Clearly worse', 'Often the better proposition because it survives being wrong', 'Identical', 'Uninvestable'], correct: 'B', explanation: 'Asymmetry matters as much as expected return.' },
    { question: 'Scenario probabilities should be anchored to:', options: ['Round numbers', 'The macro regime, guidance track record and estimate dispersion', 'The analyst’s mood', 'The share price'], correct: 'B', explanation: 'Stated explicitly so they can be argued with.' },
    { question: 'The base case should be:', options: ['The average of bull and bear', 'The most likely single outcome', 'Always the midpoint', 'The lowest value'], correct: 'B', explanation: 'It can sit anywhere in the range.' },
    { question: 'A very wide bull-to-bear spread indicates:', options: ['High precision', 'That the outcome is genuinely uncertain and should be sized accordingly', 'A modelling error', 'A guaranteed loss'], correct: 'B', explanation: 'Range width is itself information about what you know.' },
    { question: 'Assigning 80% probability to the base case typically:', options: ['Improves the model', 'Makes the exercise change nothing', 'Is required', 'Reduces risk'], correct: 'B', explanation: 'It quietly collapses back to a point estimate.' },
    { question: 'In practice, the bear case primarily drives:', options: ['The buy decision', 'The review trigger or stop', 'The dividend', 'The tax treatment'], correct: 'B', explanation: 'Expected value drives buying; the range drives sizing; the bear drives the exit plan.' },
  ],
  vm206: [
    { question: 'A two-way sensitivity table in a DCF is most often built on:', options: ['Revenue and tax', 'WACC and terminal growth', 'Capex and dividends', 'Beta and payout'], correct: 'B', explanation: 'These two dominate the terminal value, and thus the answer.' },
    { question: 'In a typical DCF, terminal value accounts for roughly:', options: ['10–20% of value', '30–40% of value', '60–80% of value', 'None'], correct: 'C', explanation: 'Which is why its assumptions deserve the most scrutiny.' },
    { question: 'The perpetuity formula amplifies error because its denominator is:', options: ['A large number', 'A small difference between two uncertain numbers', 'Always positive', 'Fixed'], correct: 'B', explanation: 'r − g is small, so small changes swing the result violently.' },
    { question: 'The growth implied by an exit multiple m at discount rate r is:', options: ['(r × m − 1) / (m + 1)', 'r / m', 'm − r', 'r × m'], correct: 'A', explanation: 'It back-solves what perpetual growth the multiple assumes.' },
    { question: 'An exit multiple implying 6% perpetual growth is:', options: ['Conservative', 'Assuming the company outgrows the economy forever', 'Standard', 'Impossible to compute'], correct: 'B', explanation: 'Terminal growth above nominal GDP is not sustainable.' },
    { question: 'A tornado chart ranks assumptions by:', options: ['Alphabetical order', 'How much fair value moves across each plausible range', 'Their size in dollars', 'Their volatility'], correct: 'B', explanation: 'Widest bars at the top show where research time belongs.' },
    { question: 'Triangular distributions are practical in Monte Carlo because they need only:', options: ['A mean and variance', 'A minimum, most likely and maximum', 'Historical returns', 'A correlation matrix'], correct: 'B', explanation: 'No statistical estimation beyond a range and a best guess.' },
    { question: 'A key output of Monte Carlo that a point estimate cannot give is:', options: ['The share price', 'The probability that fair value exceeds the current price', 'The dividend', 'The beta'], correct: 'B', explanation: 'A distribution supports probabilistic statements.' },
    { question: 'The main danger of Monte Carlo is that:', options: ['It is too slow', 'Wrong distributions or ignored correlations produce a confidently wrong, tight result', 'It cannot be charted', 'It needs no inputs'], correct: 'B', explanation: 'Precision in the output is not accuracy.' },
    { question: 'A range of $77–$137 around a $100 base case means the honest conclusion is:', options: ['Fair value is $100', 'Fair value is a range, and buying below the low end is the robust decision', 'The model is broken', 'The stock is a sell'], correct: 'B', explanation: 'Quoting the point estimate alone is false precision.' },
  ],
}
