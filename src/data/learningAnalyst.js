// ============================================================================
// Learning Hub — analyst pack (second expansion).
//
// Where learningExtra.js broadened the curriculum, this pack deepens it toward
// the work an analyst actually does: reading primary sources, judging earnings
// quality, sizing a position, and running a repeatable process.
//
// Several topics deliberately teach a tool FinSight now has, so the lesson and
// the app reinforce each other rather than living apart:
//
//   fs105  → the Filings tab (what each SEC form is for)
//   fs306  → the Altman Z / Piotroski F scores now computed in-house, including
//            why the app refuses to show Z for a bank
//   ta106  → the swing-pivot support and resistance now computed from history
//   vm209  → the Analyst Coach's ten-step method, written out as a process
//
// Merged into CATEGORIES / LESSON_CONTENT / QUIZ_BANKS by learningContent.js
// before it builds its topic index, exactly as the first pack is.
// ============================================================================

export const ANALYST_TOPICS = {
  fundamentals: [
    { id: 'fs105', title: 'Where the Numbers Come From - 10-K, 10-Q, 8-K', level: 'Beginner', duration: 20 },
    { id: 'fs208', title: 'Revenue Recognition and Deferred Revenue', level: 'Intermediate', duration: 24 },
    { id: 'fs209', title: 'Segment Reporting - Where Profit Really Comes From', level: 'Intermediate', duration: 22 },
    { id: 'fs210', title: 'Leases, Pensions and Off-Balance-Sheet Obligations', level: 'Intermediate', duration: 26 },
    { id: 'fs306', title: 'Altman Z and Piotroski F - Scoring Financial Strength', level: 'Advanced', duration: 28 },
    { id: 'fs307', title: 'Earnings Calls - Reading Guidance and Management Language', level: 'Advanced', duration: 26 },
    { id: 'fs308', title: 'Capital Allocation - Buybacks, Dividends and M&A', level: 'Advanced', duration: 30 },
  ],
  technical: [
    { id: 'ta106', title: 'Support, Resistance and Swing Pivots', level: 'Beginner', duration: 18 },
    { id: 'ta207', title: 'Volume, Liquidity and the Cost of Getting Out', level: 'Intermediate', duration: 20 },
    { id: 'ta305', title: 'Volatility, ATR and Position Sizing', level: 'Advanced', duration: 26 },
  ],
  macro: [
    { id: 'ma105', title: 'Currency Effects on Foreign Earnings', level: 'Beginner', duration: 18 },
    { id: 'ma207', title: 'Commodity Cycles and Capex Discipline', level: 'Intermediate', duration: 24 },
    { id: 'ma305', title: 'Sector Rotation Through the Cycle', level: 'Advanced', duration: 26 },
  ],
  asx: [
    { id: 'asx110', title: 'Franking Credits in Practice - Grossed-Up Yield', level: 'Intermediate', duration: 22 },
    { id: 'asx111', title: 'ASX vs SEC Disclosure - What Actually Differs', level: 'Intermediate', duration: 20 },
  ],
  valuation: [
    { id: 'vm106', title: 'Comparable Company Analysis Done Properly', level: 'Intermediate', duration: 24 },
    { id: 'vm207', title: 'Owner Earnings and Normalising Free Cash Flow', level: 'Advanced', duration: 28, labModel: 'dcf' },
    { id: 'vm208', title: 'Position Sizing and Portfolio Construction', level: 'Advanced', duration: 28 },
    { id: 'vm209', title: 'Building a Repeatable Research Process', level: 'Advanced', duration: 30 },
  ],
}

export const ANALYST_LESSONS = {
  // ── Fundamentals ─────────────────────────────────────────────────────────
  fs105: `## Everything You Read Is Downstream of a Filing

Every ratio on a data terminal, every headline about a beat or a miss, every analyst model - all of it is derived from a handful of documents the company files with its regulator. Learning to go to the source is the single biggest step from consumer of research to producer of it. FinSight's **Filings** tab opens these directly.

## The Three Documents That Matter Most

**The 10-K** is the annual report. It is audited, it is long (Apple's runs to about 120 pages, a bank's can exceed 300), and it is the only place you get the complete picture. Its structure is fixed by regulation, which is what makes it learnable:

- **Item 1 - Business.** What the company sells and to whom, in its own words.
- **Item 1A - Risk Factors.** Management's list of what could go wrong. Legally dangerous to omit something, so it is unusually candid by corporate standards.
- **Item 3 - Legal Proceedings.** Litigation material enough to disclose.
- **Item 7 - MD&A.** Why the numbers moved. The densest section in the document.
- **Item 8 - Financial Statements and Notes.** The statements themselves, plus the notes, which is where the actual detail lives.

**The 10-Q** is the quarterly version: unaudited, shorter, and filed three times a year. There is no fourth-quarter 10-Q - that period is folded into the 10-K, which is why Q4 numbers often need deriving as "full year minus the first three quarters".

**The 8-K** is the "something just happened" filing, due within four business days. Earnings results reach the market through an 8-K - specifically through **Exhibit 99.1**, the press release attached to it - weeks before the 10-Q with the full statements appears.

## The Two Most Under-Read Filings

**DEF 14A, the proxy statement**, is filed before the annual meeting. It contains the full detail of executive compensation: not just the amount, but what it is paid *for*. A CEO paid on revenue growth and a CEO paid on return on invested capital will run the same company very differently. It also contains the beneficial ownership table - who actually controls the business.

**Form 4** reports an insider buying or selling within two business days. Any single Form 4 is noise: executives sell for tax, for divorce, for a house. What is informative is an open-market **purchase** (transaction code P), because there is only one reason to buy. Clusters of insiders buying in the same window are among the more reliable signals in fundamental analysis.

## How to Actually Read a 10-K in 40 Minutes

You are not reading it cover to cover. The efficient order is:

1. **Item 1**, skimmed, until you can state the business model in one sentence.
2. **Item 7 (MD&A)**, read properly. This is where the year's story is.
3. **Item 1A**, read the first five risk factors only - companies order them roughly by significance, and the tail is boilerplate that appears in every filing in the sector.
4. **The notes to the accounts** for revenue recognition, segments, and debt maturities.

Then, and only then, go back to the numbers you already had. The value is in reading the narrative *against* the figures: if margins fell and the MD&A does not explain why, that silence is itself the finding.

## Common Mistakes

Reading the earnings press release and stopping. The press release is written by the company's investor relations team to be favourable; the 10-K is written by its lawyers to be defensible. When the two disagree, the lawyers are the ones exposed to liability.`,

  fs208: `## When Does a Sale Become Revenue?

Revenue looks like the simplest line on the income statement and is quietly one of the most judgement-laden. The governing principle under both IFRS 15 and ASC 606 is that revenue is recognised when **control of a good or service transfers to the customer** - not when the contract is signed, not when cash arrives, and not when the invoice is sent.

## The Five-Step Model

1. Identify the contract.
2. Identify the distinct performance obligations within it.
3. Determine the transaction price.
4. Allocate that price across the obligations.
5. Recognise revenue as each obligation is satisfied.

Step 2 is where most of the interesting judgement sits. Sell a phone with two years of bundled software updates, and the phone and the updates are separate obligations: part of the price is recognised at delivery and part is spread over two years. Companies have real discretion over how they split it.

## Deferred Revenue Is the Analyst's Friend

When a customer pays before the service is delivered, the cash arrives but the revenue does not. The difference sits on the balance sheet as **deferred revenue** (sometimes "contract liabilities") - a liability, because the company owes work.

This is genuinely useful information, because deferred revenue is *already contracted*. A software business with revenue of \`$400M\` and deferred revenue rising from \`$180M\` to \`$240M\` grew billings faster than reported revenue: it has pre-sold \`$60M\` more work than it recognised. Reported growth understates what has actually been sold.

The reverse is the warning. If revenue keeps growing while deferred revenue falls, the company is recognising work it sold in earlier periods. That is not fraud - it is arithmetic - but it means reported growth is running ahead of new business, and it eventually stops.

## Gross vs Net, and Why It Matters

A marketplace can book the full transaction as revenue (**gross**, as principal) or only its commission (**net**, as agent). The profit is identical; the revenue line differs by an order of magnitude. Two competitors reporting \`$1bn\` and \`$80M\` of revenue may be exactly the same size. Always check the revenue recognition note before comparing a marketplace to anything.

## Red Flags Worth Knowing

- **Receivables growing much faster than revenue.** Sales are being booked that customers have not paid for. Compute days sales outstanding each year: 45 → 52 → 68 is a trend, not noise.
- **A change in accounting estimate that raises revenue.** Disclosed in the notes, never in the press release.
- **Bill-and-hold arrangements**, where goods are invoiced but not shipped. Legitimate in narrow circumstances, and a recurring feature of accounting scandals.
- **Revenue growth with flat operating cash flow.** The single most useful cross-check there is. Profit is an opinion; cash is a fact.

## How a PM Uses It

Before trusting a growth rate, an analyst reconciles three numbers: revenue growth, receivables growth and operating cash flow growth. When all three move together, the growth is real. When revenue is the only one moving, the question is not whether the company is growing - it is whether the growth is being collected.`,

  fs209: `## The Consolidated Numbers Hide the Story

A company with 8% revenue growth might have one division growing 40% and another shrinking 15%. The consolidated figure tells you neither, and the two facts imply completely different futures. **Segment reporting** - required under IFRS 8 and ASC 280 - is where the real business is disclosed.

## What Gets Disclosed

Companies must report segments the way management actually runs the business, which is what makes the disclosure honest: the segments are the ones the chief operating decision maker reviews. For each, you typically get revenue, operating profit, assets and capital expenditure.

## The Three Questions to Ask

**Which segment produces the profit?** Frequently not the one producing the revenue. A hardware business might be 75% of sales and 40% of profit, with a services arm on 25% of sales and 60% of profit. If services is also the faster-growing segment, the company is quietly becoming a services business and its multiple should reflect that mix, not the current revenue split.

**Which segment absorbs the capital?** Compare each segment's capital expenditure with its operating profit. A division taking 60% of capex and delivering 20% of profit is destroying value, and the consolidated return on invested capital hides it by averaging.

**Is the mix shifting?** Track segment shares over three years. Mix shift is the most reliably under-priced fact in a filing, because headline growth is what gets reported and mix is what determines future margins.

## A Worked Example

A company reports \`$2.0bn\` revenue and \`$300M\` operating profit - a 15% margin. The segments:

| Segment | Revenue | Op. profit | Margin |
|---|---|---|---|
| Legacy hardware | \`$1.4bn\` | \`$70M\` | 5% |
| Software | \`$0.6bn\` | \`$230M\` | 38% |

The 15% consolidated margin is not a fact about this company; it is an artefact of the mix. If software grows 25% a year and hardware shrinks 5%, then in three years the mix is roughly \`$1.17bn\` software and \`$1.20bn\` hardware, and - holding segment margins constant - consolidated margin rises to around 22% without a single thing improving. Modelling the segments separately captures this. Modelling the consolidated margin cannot.

## Where It Goes Wrong

**Unallocated corporate costs.** Segment operating profits usually sum to more than group operating profit, because head office costs sit outside. Always reconcile: if segments total \`$340M\` and the group reports \`$300M\`, there is \`$40M\` of central cost that a sum-of-the-parts valuation must subtract.

**Segment redefinition.** When a company changes its segments, prior years are restated but comparability with your own older notes is lost - and a redefinition that arrives just as one division starts underperforming deserves a second look.

**Geographic vs operating segments.** Both may be disclosed and they are not interchangeable. Geography tells you about currency and political exposure; operating segments tell you about the business model.

## How a PM Uses It

Segment data is how you build a sum-of-the-parts valuation and how you decide whether a "cheap" conglomerate is cheap or correctly discounted. It is also the fastest way to check whether a company's story matches its accounts: if management spends the whole earnings call discussing a segment that is 6% of profit, ask why.`,

  fs210: `## The Obligations That Aren't Called Debt

A balance sheet's "total debt" line is not the whole of what a company owes. Several material, contractual, cash-consuming obligations sit elsewhere - and a leverage ratio that ignores them understates risk in exactly the businesses where it matters most.

## Leases

Since IFRS 16 (2019) and ASC 842, most leases appear on the balance sheet: a **right-of-use asset** on one side, a **lease liability** on the other. This was a genuine improvement - before it, a retailer with 900 leased stores could look almost debt-free.

Two things still catch people out. First, comparisons across the transition year are broken: leverage ratios jumped for lease-heavy sectors (retail, airlines, restaurants) with no change in economics whatsoever. Second, US GAAP retains a distinction between finance and operating leases in the *income statement*, so operating lease costs land in operating expenses rather than being split into depreciation and interest - which means EBITDA is not comparable between a US and an IFRS filer with identical economics.

Rule of thumb: for a lease-heavy business, add the lease liability to debt before computing net debt / EBITDA, and be sure the EBITDA you are using is on the same basis.

## Pensions

A defined-benefit pension scheme is a promise to pay retirees for decades. The balance sheet shows only the **net** position - scheme assets minus the present value of obligations - which can be a small number sitting on top of two enormous ones.

Three things matter:

- **The discount rate.** The obligation is a present value, so it moves inversely with rates. A scheme that swung from deficit to surplus may have had a wonderful year in markets, or rates may simply have risen. The notes say which.
- **The deficit is a real claim.** It ranks alongside debt and consumes cash through deficit-repair contributions, which appear in the cash flow statement, not in interest expense.
- **The expected return assumption.** A scheme assuming 7% on its assets when bonds yield 4% is flattering reported profit.

Defined-**contribution** schemes carry none of this: the company pays in and the risk sits with the employee. Check which one you are looking at before doing any work at all.

## The Rest of the Off-Balance-Sheet Family

- **Purchase commitments.** Contracted future spend, disclosed in the notes. Common in mining, airlines and semiconductors, and often large.
- **Guarantees of associates' debt.** The company is on the hook if the associate fails.
- **Contingent liabilities.** Litigation and warranty exposures, disclosed but not provided for when an outflow is not "probable". Read the wording carefully; "possible" and "probable" are technical terms here.
- **Securitisations and factoring.** Selling receivables converts them to cash and shortens days sales outstanding. It is legitimate financing, but it flatters both working capital and the cash flow statement, and it is disclosed only in the notes.

## A Worked Adjustment

A retailer reports net debt of \`$1.2bn\` and EBITDA of \`$800M\` - 1.5x, comfortable. The notes disclose \`$2.8bn\` of lease liabilities and a \`$300M\` pension deficit. Adjusted net debt is \`$4.3bn\`. Against a rent-adjusted EBITDA the ratio is far above the headline, and the company's real fixed-charge burden is roughly three times what the front page suggested.

## How a PM Uses It

Any leverage screen run on the reported debt line will systematically rank lease-heavy and pension-heavy companies as safer than they are. Adjusting for both is what separates a credit-aware equity analyst from someone reading a ratio off a screen.`,

  fs306: `## Turning a Balance Sheet Into One Number

Two scores compress a company's financial condition into a single figure. Neither is a decision, and both are far more useful when you understand what they are made of - which is why FinSight computes them from the statements rather than buying them, and shows the components.

## Altman Z-Score - Distress Risk

Edward Altman's 1968 model, still the standard, combines five ratios:

\`Z = 1.2·X₁ + 1.4·X₂ + 3.3·X₃ + 0.6·X₄ + 1.0·X₅\`

- **X₁ = Working capital / Total assets** - short-term liquidity cushion.
- **X₂ = Retained earnings / Total assets** - cumulative profitability, and implicitly age. A young company scores low here no matter how good it is.
- **X₃ = EBIT / Total assets** - operating productivity of the asset base. The heaviest weight, and rightly so.
- **X₄ = Market capitalisation / Total liabilities** - how far equity can fall before liabilities exceed assets.
- **X₅ = Revenue / Total assets** - asset turnover.

Bands: **Z ≥ 3.0** safe, **1.8 – 3.0** grey, **Z < 1.8** distress. The model was fitted on manufacturers and its accuracy at predicting bankruptcy within two years was reported around 80–90% on the original sample.

## Where Altman Z Must Not Be Used

**Banks, insurers and REITs.** A bank funds itself with deposits, so its liabilities are enormous by design, its working capital is not a meaningful concept, and its revenue-to-assets ratio is structurally tiny. Run the formula on a healthy major bank and it will return something in the low single digits and label it "distress" - a statement about the model, not the bank. Altman excluded financials from his sample for exactly this reason.

This is why FinSight refuses to display a Z-score for a financial company and says why, rather than printing an alarming number. A score you cannot interpret is worse than no score.

## Piotroski F-Score - Fundamental Momentum

Joseph Piotroski's nine binary tests ask a different question: is this company getting **better or worse**, year on year?

*Profitability (4):* positive return on assets; positive operating cash flow; ROA higher than last year; operating cash flow exceeding net income (an accruals check).

*Leverage and liquidity (3):* leverage lower than last year; current ratio higher than last year; no significant new share issuance.

*Efficiency (2):* gross margin higher than last year; asset turnover higher than last year.

Each pass scores 1, giving 0–9. **7–9** is strong, **4–6** mixed, **0–3** weak. Piotroski's original finding was that applying the screen to cheap (high book-to-market) stocks improved returns substantially - the score works best as a *filter on value*, not as a signal on its own.

## Reading the Two Together

They answer different questions and disagree usefully. High Z with low F is a strong balance sheet in a business that is deteriorating - often a value trap in the making. Low Z with high F is a stretched balance sheet that is repairing itself, which is where recovery returns come from and also where you get hurt.

## The Practical Cautions

- Both use **annual** data and are stale for months at a time.
- Both are backward-looking. Neither knows about a contract loss announced last week.
- A partial F-score (FinSight reports "6/8" when a prior-year statement is missing) must be scaled before comparing with a published figure.
- Neither replaces reading Item 1A and the debt maturity note.`,

  fs307: `## The Only Time Management Answers Unscripted Questions

The quarterly earnings call has two halves and they are not equally informative. The **prepared remarks** are written, reviewed by lawyers and rehearsed; they tell you what the company wants emphasised, which is worth knowing but is not analysis. The **Q&A** is where analysts push, and where the informative material is.

## Guidance Is the Number That Moves the Stock

Reported results are largely known before the call: consensus exists, and the 8-K press release lands first. What moves the price is **guidance** - the outlook for the next quarter or year.

Learn the vocabulary, because it is deliberately precise:

- *"We now expect"* - a change. Compare with last quarter's exact wording.
- *"We are reaffirming"* - no change, which in a deteriorating environment is itself good news.
- *"At the low end of our previous range"* - a downgrade delivered without the word downgrade.
- *"Excluding the impact of…"* - the adjustment is about to do the work. Find out how big it is.
- *"Headwinds"* / *"transitory"* - apply the second-year test: if the same headwind appears in four consecutive calls, it is not transitory, it is the business.

## Reading the Q&A

Three patterns are worth training yourself to notice.

**Who is asking, and what about?** If four of the first six questions are about one segment or one metric, the market has identified where the uncertainty lives. That is free information about what is actually being debated.

**Non-answers.** "We're not going to break that out", "we'll give more colour next quarter", or a long answer to a different question. A single deflection is normal; the same question deflected two quarters running is a finding.

**Who answers.** When the CFO takes a question addressed to the CEO, or vice versa, it usually indicates who owns the problem.

## Cross-Checks That Take Two Minutes

- Compare the **adjusted** and **GAAP** numbers. A widening gap, quarter after quarter, means "one-off" charges are recurring - and recurring charges are costs.
- Check whether **revenue guidance and margin guidance** are consistent. Growing revenue while cutting the cost base is a story that needs an explanation.
- Read the guidance against **inventory and receivables** in the accompanying release. Confidence about next quarter's demand should be visible in what the company has already built or shipped.

## The Tone Trap

There is real evidence that linguistic markers on calls - hedging language, complexity, the ratio of positive to negative words - carry some predictive information. There is also a large industry over-selling it. Treat tone as a prompt to look harder at a number, never as a substitute for looking.

## What to Do After the Call

Write down, in one line, what changed: guidance, the reason given, and whether you believe it. Three or four quarters of those lines is a record of whether management's explanations have historically been right - which is the most valuable thing you can know about a management team, and it can only be built by keeping the notes.`,

  fs308: `## The CEO's Real Job

Once a business is generating cash, the most consequential decisions management makes are about where that cash goes. Warren Buffett's observation is the one to remember: a chief executive who reaches the top after a career in operations or marketing is suddenly responsible for capital allocation, a skill they may never have practised.

There are five destinations, and every dollar goes to one of them.

## 1. Reinvest in the Business

The best use - *if* the returns justify it. The test is whether incremental return on invested capital exceeds the cost of capital. A company earning 25% ROIC that can deploy more capital at 25% should reinvest everything and pay nothing out; a company earning 6% against an 9% cost of capital should be shrinking, and growth there actively destroys value.

Compute incremental ROIC rather than the reported level: \`ΔEBIT × (1 − tax) / ΔInvested capital\` over three to five years. The reported figure is dominated by capital deployed a decade ago; the incremental figure tells you about the decisions being made now.

## 2. Acquisitions

Statistically the worst of the five. The recurring failure modes are consistent: paying a control premium for synergies that are announced in year one and never verified; buying growth at the top of a cycle; and diversifying into businesses the acquirer does not understand.

Two checks. First, was the deal **accretive to earnings per share, or to return on capital?** Debt-funded acquisitions are almost always accretive to EPS and frequently destroy value - the accretion is a financing effect, not a business one. Second, look at **goodwill**. It is the premium paid over identifiable assets, and a subsequent goodwill impairment is management admitting in writing that the price was wrong.

## 3. Buybacks

Repurchasing shares is a *valuation decision*, and it should be judged as one: buying back stock below intrinsic value transfers wealth to continuing holders, and buying above it destroys wealth just as surely as an overpriced acquisition.

The uncomfortable pattern is that buybacks peak at market highs and stop in crashes - precisely backwards. Two things to check:

- **Gross vs net.** A company repurchasing \`$5bn\` while issuing \`$4bn\` of stock-based compensation has retired \`$1bn\`. Look at the change in the **diluted share count**, which cannot be spun.
- **Funding.** Buybacks funded from free cash flow are a distribution. Buybacks funded from new debt are a leveraging decision wearing a distribution's clothes.

## 4. Dividends

The most rigid choice, because cutting one is punished severely, so a dividend is a long-term commitment to a cash outflow. Sustainability is best judged against **free cash flow**, not earnings: a payout ratio of 70% of earnings can be well above 100% of free cash flow in a capital-intensive business.

Dividends suit mature businesses with limited reinvestment opportunities. A high yield on a company that still has 25% ROIC projects available is a sign of a management team taking the easy option.

## 5. Pay Down Debt

Unglamorous, and correct more often than it is chosen - particularly late in a cycle, and particularly when maturities are clustered. Deleveraging raises the value of equity mechanically, and it buys the option to act when the cycle turns.

## Tracing the History

The cash flow statement's financing section is a five-year record of every one of these decisions. Read it alongside the share count and the return on invested capital, and you can judge a management team on what they did rather than on what they said in the annual letter.`,

  // ── Technical ────────────────────────────────────────────────────────────
  ta106: `## Levels Are Memory, Not Magic

Support and resistance are prices where buying or selling has previously overwhelmed the other side. Support is a level price has repeatedly stopped falling at; resistance is where it has repeatedly stopped rising. There is nothing mystical in this - the mechanism is ordinary. Traders who bought at a level remember it. Those who sold too early want a second chance. Stop-losses cluster just beyond round numbers and prior lows. Enough of those overlapping intentions at one price makes the level real.

## How a Level Is Actually Identified

FinSight computes levels from **swing pivots**. A bar is a pivot high when its high is the highest within a five-bar window on each side; a pivot low is the mirror. That is a purely mechanical definition - no drawing, no judgement, no confirmation bias about where you wanted the line to be.

Raw pivots then need **clustering**, because price turns near the same area repeatedly rather than at one exact number. Pivots within 1.5% of each other are merged into a single level, and the number of pivots merged into it becomes its strength. A level price respected four times matters more than four levels each respected once - and that touch count is precisely what a hand-drawn line loses.

## Reading the Levels You Get

- **Distance matters more than existence.** A resistance level 15% above the price is not relevant to a decision today.
- **Levels become invalid once broken, and often swap roles.** Broken resistance frequently becomes support, because the traders who sold there now want to buy back at their exit price.
- **Round numbers and 52-week extremes** act as levels even with no pivot structure, because that is where stops and options strikes accumulate.
- **The more times a level is tested, the weaker it becomes.** Each test consumes the orders sitting there. The fourth test of a level breaks more often than the first.

## The Only Genuinely Useful Application

Not prediction. **Risk definition.**

The honest use of a support level is to answer: "if I am wrong, where will I find out?" If you buy at \`$52\` with clustered support at \`$48\`, your thesis is mechanically falsified below \`$48\`, and your downside to that point is 7.7%. Combined with a target, that gives a risk/reward ratio computable *before* the trade - which is the entire point.

Compare that with buying at \`$52\` "because it looks strong". There is no exit condition, so every subsequent decision gets made under pressure.

## Where It Fails

- **On news.** An earnings surprise, a takeover, a downgrade - price gaps straight through every level, because the information that set them is obsolete.
- **In thin stocks.** Levels need volume to be meaningful. In a stock trading \`$200k\` a day, a "level" may be one large order that has since been filled.
- **On short timeframes.** Levels on a 5-minute chart are mostly noise; on daily and weekly charts, where more participants observe the same prices, they are far more robust.

## The Discipline

Identify levels **before** you have a view. Once you want to buy, you will find support wherever you need it to be. Writing the levels down first makes them a constraint on the decision rather than a justification for one.`,

  ta207: `## The Cost Nobody Models

Every backtest assumes you can buy at the price on the screen. In anything other than the largest stocks, you cannot. The gap between the theoretical price and what you actually pay is **slippage**, and for a private investor in small caps it routinely exceeds brokerage by an order of magnitude.

## The Three Numbers That Define Liquidity

**Average daily volume (ADV)** - shares traded per day, usually averaged over 20 or 50 days. On its own it is misleading: 5 million shares of a \`$0.30\` stock is \`$1.5M\` of turnover, which is nothing.

**Average daily value traded** - ADV × price. This is the number that matters. A stock turning over \`$50M\` a day and one turning over \`$300k\` a day are different asset classes regardless of their charts.

**Bid-ask spread** - the gap between the best buy and sell price, best expressed as a percentage. A 0.02% spread in a mega-cap is negligible. A 2% spread in a micro-cap means you are 2% down the moment you buy, and you pay it again on the way out.

## The Participation Rule

The practical guideline used by institutions: your order should not exceed roughly **10% of average daily value**, and even that will move the price on a quiet day. Below 5% you are usually invisible.

Worked through: a stock trades \`$800k\` a day. A \`$40k\` position is 5% of a day's volume - fine. A \`$400k\` position is half a day's volume and would take several days to build and considerably longer to exit under stress, because volume disappears exactly when you need it.

This is why liquidity is a **position-sizing constraint**, not a yes/no filter. The question is never "can I buy this?" but "how much can I own and still be able to leave?"

## Volume as Information

Volume confirms or contradicts a price move:

- **Breakout on high volume** - many participants agreed at the new price. More likely to hold.
- **Breakout on low volume** - few did. More likely to reverse.
- **A large fall on unusually high volume** - genuine distribution, often institutional selling that takes weeks to complete.
- **Price drifting up on falling volume** - buyers losing interest, a common precursor to a reversal.

Absolute volume means nothing without a baseline. Use **relative volume**: today's volume divided by the 20-day average. Above 2x is worth investigating; above 5x, something has happened and you should find out what before doing anything else.

## Liquidity Is Not Constant

The trap that catches people is that liquidity evaporates precisely when it is needed. In a market-wide selloff, spreads widen, market makers step back, and the ADV you sized against was measured in calm conditions. Size for the liquidity of a bad day, not an average one.

## The ASX Angle

This matters more on the ASX than in US large caps. Outside the ASX 100, daily value traded falls quickly, spreads widen, and a modest private order can be a meaningful share of the day's volume. Always check value traded before deciding position size on a small or mid-cap Australian listing - and use limit orders, never market orders, in anything below the ASX 200.`,

  ta305: `## Sizing Is Where Returns Are Actually Made

Two investors can hold identical positions and end with completely different outcomes, because getting the direction right and getting the size wrong is still a bad decision. Position size should be driven by **volatility and the distance to your invalidation point**, not by conviction - conviction is exactly the input most likely to be wrong.

## ATR: Measuring Normal Movement

**Average True Range** measures how much a stock moves in a typical day, including gaps. True range for each bar is the largest of:

- today's high − today's low,
- |today's high − yesterday's close|,
- |today's low − yesterday's close|.

ATR is normally the 14-day Wilder-smoothed average of that. Expressed as a percentage of price (\`ATR / price\`), it is directly comparable across stocks: a \`$300\` stock with a \`$7\` ATR (2.3%) is meaningfully more volatile than a \`$40\` stock with a \`$0.50\` ATR (1.25%).

## Volatility-Adjusted Position Sizing

The method that follows from this is simple and hard to argue with:

\`Position size = (Portfolio × Risk per trade) / (Entry − Stop)\`

Risk per trade is typically 0.5%–2% of the portfolio. The stop is placed at a **structural** level - below clustered support, below the last swing low - with an ATR buffer so ordinary noise does not trigger it. A common buffer is 1.5–2× ATR.

Worked through. Portfolio \`$100,000\`, risking 1% (\`$1,000\`). Entry \`$52.00\`. Support sits at \`$48.50\` and ATR is \`$1.20\`, so the stop goes at \`48.50 − (1.5 × 1.20) = $46.70\`. Risk per share is \`52.00 − 46.70 = $5.30\`. Position = \`1000 / 5.30 = 188 shares\`, about \`$9,800\` - roughly 10% of the portfolio.

Now the same portfolio and the same 1% risk on a volatile stock with a \`$9\` per-share risk gives 111 shares. The **dollar risk is identical**; the position sizes differ by 40% because the stocks differ. That is the entire idea: the portfolio experiences each position as the same size of bet.

## Why Fixed Percentage Sizing Fails

Putting 5% into everything means a low-volatility utility and a high-beta small cap contribute wildly different amounts of risk to the portfolio. The portfolio's outcome is then dominated by whichever positions happen to be most volatile - which is not a decision anyone made deliberately.

## The Second-Order Effects

- **Correlation.** Six positions sized at 1% risk each are not 6% of risk if they are all in the same sector. In a selloff, correlations converge toward 1 and the whole book behaves like one large position.
- **Volatility clusters.** ATR rises in falling markets, so volatility-adjusted sizing automatically makes you smaller when markets are turbulent. This is a feature.
- **Gaps.** A stop is not a guarantee. Earnings gaps straight through it, which is why the biggest position should never be the one reporting tomorrow.

## The Discipline

Compute the stop and the size **before** you buy, and write both down. Determining an exit while already holding a losing position is the single most reliable way to turn a planned 1% loss into an unplanned 8% one.`,

  // ── Macro ────────────────────────────────────────────────────────────────
  ma105: `## Two Companies, Same Performance, Different Numbers

A company earning most of its revenue abroad reports in its home currency, which means its reported growth blends two entirely different things: how the business performed, and what the exchange rate did. Separating them is routine work and is skipped constantly.

## Translation vs Transaction

**Translation exposure** is an accounting effect. Foreign subsidiaries' revenue and profit are converted at average rates for the period, and their balance sheets at closing rates. Nothing about the business changed; the reporting currency did.

**Transaction exposure** is economic and real. It arises when costs and revenues are in different currencies - an Australian miner selling in USD and paying wages in AUD has genuine currency risk in its margins, not just in its reporting.

The distinction matters because translation effects reverse and transaction effects compound. Management commentary blurs the two constantly.

## Constant Currency

Companies disclose **constant-currency** (or "organic") growth: what growth would have been if exchange rates had not moved. This is the number to use for judging the business.

Worked through. Reported revenue rises from \`$1,000M\` to \`$1,040M\` - 4% growth. The company discloses a 3-percentage-point currency headwind, so constant-currency growth was 7%. The business grew 7%; the dollar's strength took three points away. If you model 4% forward growth and currency then reverses, you will be wrong twice.

The reverse is the more dangerous case, because it is more pleasant: reported growth of 12% flattered by 5 points of currency tailwind is a 7% business, and the tailwind will not repeat.

## The Australian Case

This is unavoidable for ASX investors, because the resources sector prices in USD and reports in AUD.

- A **falling AUD** raises the AUD revenue of miners and energy producers with no change in volumes or prices - which is why resources often outperform when the currency weakens.
- A **rising AUD** does the reverse, and simultaneously helps importers and retailers whose input costs are in USD.
- Because the AUD tends to fall in global risk-off episodes while commodity prices also fall, the two partially offset. The currency is a natural, imperfect hedge for the sector.

Investors holding US stocks from Australia face the mirror image: unhedged US holdings gain in AUD terms when the AUD falls, which has historically cushioned Australian investors during global drawdowns.

## What to Check in a Filing

- The **revenue by geography** note, for the actual currency mix.
- The **market risk disclosure** (Item 7A in a 10-K), which quantifies sensitivity - often as "a 10% move in the euro would change operating profit by \\$X".
- The **hedging note**. Hedges delay currency effects by the length of the hedge book, typically 6–18 months. A hedged company's numbers lag the spot rate, so a currency move you can see today shows up in results a year from now.

## The Practical Rule

When a company's growth changes materially, check the currency line before changing your view. A large share of "surprising" revenue moves in multinationals are exchange rates, and the market frequently prices them as if they were business news.`,

  ma207: `## The Cycle That Repeats Because of How Capital Behaves

Commodity businesses follow a cycle whose mechanism is unusually well understood, which does not stop it recurring. It is worth learning as a sequence:

1. Demand exceeds supply. Prices rise.
2. Producers earn extraordinary margins. Analysts extrapolate them.
3. Boards approve expansion - new mines, new wells, new capacity.
4. Projects take five to ten years to deliver, so supply arrives *late*.
5. It arrives together, and typically into softening demand.
6. Prices collapse. Producers cut capex, close projects, take impairments.
7. Underinvestment builds a supply deficit. Return to 1.

The long lead time is the whole mechanism. Capacity decisions are made using the prices of the moment and take effect years later.

## The Analyst's Signal Is Capex, Not Price

The consequence is counter-intuitive and useful: **industry capital expenditure is the leading indicator, and the price is the lagging one.**

Rising sector-wide capex at high prices is a signal that the supply response is being built, and that the next few years will be worse than the last. Falling capex during depressed prices is laying the foundation for the next upcycle. This is why capital *discipline* - refusing to expand at the top - is treated as the single most important management quality in the sector, and why the market rewards it with a higher multiple.

## Why Multiples Invert

Cyclical stocks look **cheapest at the top and dearest at the bottom**. At the peak, earnings are at a level that cannot persist, so a trailing P/E of 5 is a warning rather than a bargain. At the trough, earnings are near zero or negative and the P/E is enormous or meaningless - which is often the moment to buy.

The fixes are standard practice: value on **mid-cycle earnings** rather than trailing; use **price-to-book** or **EV per unit of production/reserves**, which are less cyclical; and check the **cost curve position**, because a producer in the lowest cost quartile survives the trough that eliminates the highest.

## Reading the Cost Curve

A commodity's price is set at the marginal cost of the highest-cost producer needed to meet demand. A miner in the first quartile of the cost curve stays profitable at prices that force the fourth quartile to shut - and those shutdowns are what eventually rebalances the market. Cost curve position is more predictive of long-run returns than the commodity price forecast, and considerably easier to know.

## Practical Checks

- **Where in the cycle are we?** Compare current prices with the ten-year range, and industry capex with its own history.
- **Are inventories building or drawing?** Warehouse stocks and days of cover lead price.
- **Is capital discipline holding?** Read the capex guidance in the annual report, not the commentary about it.
- **What is the incentive price** - the price required to justify new supply? Prices persistently above it guarantee that supply is coming.

## The ASX Relevance

Resources are a large share of the ASX, and BHP, Rio Tinto, Fortescue and Woodside are the clearest available examples of this cycle. The lesson learned expensively in the 2011–2015 iron ore cycle - where expansion approved at \`$180\`/tonne delivered into a \`$40\` market - is why "capital discipline" now appears in every Australian mining presentation, and why the market punishes any sign of it slipping.`,

  ma305: `## Different Businesses Need Different Weather

Sector rotation is the observation that sectors do not perform equally at the same point in the economic cycle, because their earnings respond differently to growth and to interest rates. Used well, it is a framework for understanding relative performance. Used badly, it is market timing with extra steps.

## The Four Phases

**Early cycle** - recession ending, rates falling, credit reopening. The leaders are the most economically sensitive and the most rate-sensitive: **consumer discretionary, financials, industrials, real estate**. Earnings are still poor and the market is buying the recovery, so this phase looks expensive on trailing numbers and is frequently missed for that reason.

**Mid cycle** - growth established, inflation contained, rates neutral. The longest phase and the hardest to trade. **Technology and industrials** typically lead as capital spending accelerates. Sector dispersion narrows and stock selection matters more than sector choice.

**Late cycle** - growth still positive but decelerating, inflation rising, central banks tightening. **Energy and materials** lead on input-cost inflation; **staples and healthcare** begin outperforming as investors move defensive. An inverting yield curve is the classic marker.

**Recession** - contracting growth, falling rates, rising unemployment. **Consumer staples, healthcare, utilities** hold up because demand for food, medicine and electricity is inelastic. They fall less; they rarely rise.

## The Rate Sensitivity That Drives Half of It

The other axis, and the one that dominated markets in 2022–2024, is duration. A company whose profits arrive mostly in the distant future has a longer duration and is more sensitive to the discount rate - which is why unprofitable growth stocks fall hardest when yields rise, and why utilities, despite being defensive, fall alongside them.

Financials are the exception worth knowing: banks earn on the spread between short and long rates, so a **steepening** curve helps them and an **inverting** one squeezes them, regardless of where the economy sits.

## What Actually Works

- **Relative strength as confirmation.** Rotation is visible in relative performance before it is obvious in the data. Sector-vs-index ratios turn early.
- **Credit spreads as the honest indicator.** Corporate bond spreads widen before equities fall and narrow before recoveries. They are less prone to narrative than equity prices.
- **The yield curve as the phase marker.** Inversion has preceded every US recession of the past fifty years, though with lead times from six months to two years - useful for positioning, useless for timing.

## The Honest Caveats

The framework describes tendencies, not laws. Phases are only identifiable with confidence after the fact; every cycle has a distinguishing feature that breaks the pattern (a pandemic, an energy shock, an AI capex boom); and sector labels have drifted - "technology" now includes both hyper-cyclical semiconductors and utility-like software subscriptions.

The reasonable use is as a **risk lens rather than a trading system**: if a portfolio is entirely early-cycle names and the curve has just inverted, that is worth knowing. Rotating the whole book on a phase call is how the framework gets people hurt.

## The ASX Version

Australia's index skews to financials and materials, so it behaves as a late-cycle market and is more sensitive to Chinese industrial demand than to the domestic cycle. Rotation on the ASX often reads better as "iron ore versus banks" than as the textbook sequence.`,

  // ── ASX ──────────────────────────────────────────────────────────────────
  asx110: `## The Reason Australian Yields Aren't Comparable

Australia's dividend imputation system means company tax paid on profits is credited to shareholders when those profits are distributed. The purpose is to remove the double taxation that exists in most other countries, where profit is taxed at the company and the dividend is taxed again in the shareholder's hands.

The practical effect is that **an Australian dividend yield is not comparable to an overseas one** without adjustment.

## The Arithmetic

A fully franked dividend carries franking credits equal to the company tax already paid at 30% (25% for base-rate entities).

\`Grossed-up dividend = Cash dividend / (1 − company tax rate)\`
\`Franking credit = Grossed-up dividend − Cash dividend\`

Worked through, at the 30% rate: a company pays a \`$0.70\` fully franked dividend. Grossed up: \`0.70 / 0.70 = $1.00\`. The franking credit is \`$0.30\`.

The shareholder declares the full \`$1.00\` as income and receives a \`$0.30\` tax offset:

- **On a 45% marginal rate:** tax of \`$0.45\`, less the \`$0.30\` credit, leaves \`$0.15\` payable. After-tax income is \`$0.55\`.
- **On a 30% rate:** tax of \`$0.30\`, fully offset. Nothing payable, \`$0.70\` retained.
- **On a 15% rate (superannuation accumulation):** tax of \`$0.15\`, credit of \`$0.30\`, so \`$0.15\` is **refunded**. Total received: \`$0.85\`.
- **On 0% (pension-phase super):** the entire \`$0.30\` is refunded. Total: \`$1.00\` - a 43% uplift on the cash dividend.

Refundability of excess credits is the distinctive Australian feature; most imputation systems elsewhere only reduce tax to zero.

## Grossed-Up Yield

A stock paying a 5.0% fully franked cash yield has a grossed-up yield of \`5.0 / 0.70 = 7.14%\`. Against an unfranked 6.0% yield, the franked stock is materially better for anyone who can use the credits - and identical for a foreign investor, who cannot use them at all.

## Franking Levels Vary, and the Reason Matters

Not every dividend is fully franked. The franking account is fed by Australian tax actually paid, so a company earning much of its profit offshore - where it pays foreign tax - accumulates fewer credits. This is why large domestic banks and Telstra frank fully while globally diversified industrials often frank partially.

A **fall in franking percentage** is therefore informative: it usually means the profit mix has shifted offshore, or that Australian taxable income has fallen.

## Who This Actually Helps

- **Pension-phase superannuation (0% tax):** the largest beneficiary, receiving the full credit as a refund. This is the structural reason Australian retirees hold so many fully franked domestic banks.
- **Accumulation-phase super (15%):** substantial benefit.
- **Individuals below the 30% marginal rate:** net refund.
- **Individuals above it:** partial offset only.
- **Foreign investors:** no benefit. Franking credits are worthless to them, which is part of why offshore investors value ASX yield stocks differently - and a genuine source of mispricing between the two investor bases.

## The Caveats

The **45-day holding rule** requires shares to be held at risk for 45 days (excluding purchase and sale days) to claim the credits, which exists specifically to prevent dividend-stripping around the ex-date. And franking should never be the sole reason to hold a stock: a fully franked dividend from a business in structural decline is a tax-efficient way to lose money.`,

  asx111: `## Same Idea, Different Machinery

An investor moving between US and Australian listings finds the analytical work identical and the *sourcing* of it quite different. Knowing where each market puts its information saves a great deal of time.

## Reporting Frequency

**US:** quarterly. A 10-Q for each of the first three quarters, a 10-K for the year. Four data points annually, with guidance updated on each earnings call.

**Australia:** half-yearly is the standard for full accounts - an interim report at the half and an annual report at year end. Most companies do not give quarterly earnings, and there is no Australian equivalent of the quarterly earnings call ritual.

The exception is important: mining and exploration companies must lodge **quarterly activities reports (Appendix 5B)** covering production, expenditure and cash. For a junior resources company, the 5B is the most informative document it produces - it shows cash on hand and quarterly burn, which is the real question.

## Continuous Disclosure

Australia's **ASX Listing Rule 3.1** requires immediate disclosure of any information a reasonable person would expect to have a material effect on price. It is broader and faster than the US 8-K regime, which enumerates specific triggering events with a four-business-day deadline.

The practical consequence: on the ASX, material news arrives as an **announcement** on the company's ASX page, often with no US-style analogue. The stream of announcements is the primary news source, and price-sensitive ones are flagged.

## Where to Look

| | US | Australia |
|---|---|---|
| Annual report | 10-K on EDGAR | Annual Report on ASX announcements |
| Interim | 10-Q, quarterly | Half-year report |
| Material news | 8-K | ASX announcement (Rule 3.1) |
| Executive pay | DEF 14A proxy | Remuneration Report, inside the annual report |
| Insider trades | Form 4, within 2 days | Appendix 3Y, within 5 business days |
| Substantial holders | SC 13D/13G above 5% | Form 603/604, above 5% |
| Regulator | SEC | ASIC (ASX handles listing rules) |

**EDGAR has nothing for an ASX-only listing.** This is why FinSight's Filings tab tells you plainly when a symbol is not SEC-registered rather than showing an empty page. Where a large Australian company has a US listing - BHP and Rio Tinto file **20-F**, the foreign-issuer annual report - those filings are available, and FinSight will show them while making clear they belong to the US line.

## Accounting Standards

Australia uses **AASB standards, aligned with IFRS**; the US uses **US GAAP**. Most line items reconcile, but several differences matter in practice: inventory costing (LIFO is permitted under US GAAP and prohibited under IFRS), development cost capitalisation (permitted under IFRS when criteria are met, largely expensed under US GAAP), and the income-statement treatment of operating leases. Comparing an IFRS filer's EBITDA to a US filer's without checking is a common and material error.

## The Remuneration Report and the Two-Strikes Rule

Australia's remuneration report is subject to a shareholder vote, and if 25% or more vote against it in two consecutive years, a resolution to spill the entire board is put to the meeting. This gives Australian shareholders more direct leverage on pay than their US counterparts, and makes a first strike a genuinely material governance event worth noticing.`,

  // ── Valuation ────────────────────────────────────────────────────────────
  vm106: `## The Method Everyone Uses and Few Do Well

Comparable company analysis values a business by reference to what the market pays for similar ones. It is fast, it reflects current market conditions, and its assumptions are visible - which is why it is the most widely used valuation method in practice, and why doing it carelessly is so common.

## Step 1: Choose the Peer Set

This determines the answer, so it deserves most of the effort. Genuine comparability means similar **business model, growth rate, margin structure, capital intensity and end markets** - not merely the same sector code.

The failure mode is a peer set assembled from an index classification. A payments company, a regional bank and an insurer share the "Financials" label and have nothing in common. Five genuinely comparable companies beat twenty loosely related ones every time.

Where possible, cross-check the peer list against the ones the company itself names in its remuneration report or annual report - companies choose their own comparators carefully.

## Step 2: Choose the Right Multiple

- **P/E** - simple and widely quoted, but distorted by leverage and by any non-cash charge. Meaningless when earnings are negative.
- **EV/EBITDA** - the workhorse, because enterprise value and EBITDA are both pre-financing, so it compares companies with different debt loads fairly.
- **EV/EBIT** - better than EV/EBITDA when capital intensity differs, because depreciation is a real cost of staying in business.
- **EV/Sales** - for loss-making companies. Only meaningful within a set that shares a plausible steady-state margin.
- **P/B** - appropriate for banks and insurers, where assets are marked near market and book value means something.
- **EV/Production, EV/Reserves, EV/Subscriber** - sector-specific and often the most honest, because they are harder to manipulate than an accounting figure.

## Step 3: Use the Median, and Adjust

Use the **median**, not the mean: one company mid-takeover or mid-collapse destroys an average.

Then adjust for the difference between the target and the set. A company growing faster, earning higher margins, or carrying less debt deserves a premium to the median - and the analyst's job is to say **how much and why**, in writing. An unexplained "20% premium for quality" is where comps analysis stops being analysis.

## A Worked Example

Peer median EV/EBITDA is 11.0x. The target company grows 12% against a peer median of 6%, and earns a 24% EBITDA margin against 18%. A 15–25% premium is defensible on those two facts, so call it 13.0x.

Target EBITDA is \`$450M\`, so implied EV is \`$5,850M\`. Subtract net debt of \`$900M\` to get equity value of \`$4,950M\`. On 300M shares, that is **\`$16.50\`** per share.

Note what has been done here: the answer is entirely a function of the peer set, the multiple and the premium. Change the peer set and it changes. That is not a flaw - it is what "relative valuation" means - but it must be stated rather than hidden behind a decimal point.

## The Three Standard Errors

**Circularity.** If the whole sector is overvalued, comps will say the target is fairly valued. Comps measure relative value only. Always run a DCF alongside for an absolute anchor.

**Mixing trailing and forward.** A trailing multiple on one company and a forward multiple on another is not a comparison. Keep the basis consistent and label it.

**Ignoring the balance sheet.** Comparing P/E across companies with very different leverage rewards the indebted one for its financing choices. Use enterprise-value multiples when debt levels differ.`,

  vm207: `## The Number a DCF Should Actually Discount

"Free cash flow" is not a defined accounting term, and the version most data providers publish - operating cash flow minus capital expenditure - is a starting point rather than an answer. Buffett's phrase for the number you actually want is **owner earnings**: the cash a business generates that could be taken out without impairing its competitive position.

## The Adjustments That Matter

**Split maintenance from growth capex.** Reported capex bundles the spend needed to keep the business running with the spend that expands it. Only maintenance capex belongs in owner earnings; growth capex is discretionary and buys future cash flows. Companies rarely disclose the split, so an approximation is needed - depreciation is a reasonable proxy for maintenance in a stable business, though it understates it under inflation.

**Add back genuine one-offs, and only genuine ones.** A single litigation settlement or restructuring charge distorts a year. A "one-off" restructuring charge in each of five consecutive years is an operating cost with a misleading label.

**Subtract stock-based compensation.** This is the most consequential and most frequently skipped adjustment. SBC is added back in the cash flow statement because it is non-cash - but it is a real transfer of value from shareholders to employees, and treating it as free is how software companies came to report "free cash flow" far above any sensible owner earnings. If the company must buy back shares to offset the dilution, the cash cost is visible in financing.

**Normalise working capital.** A large one-year release of working capital is not repeatable, and neither is a one-year build. Use the change consistent with the growth rate you are forecasting.

**Normalise tax.** A year with an unusual tax benefit is not the run rate. Use the structural effective rate.

## Why the Starting Point Deserves This Much Care

A DCF compounds the starting figure for a decade. Get it 30% wrong and everything downstream is 30% wrong, no matter how carefully the discount rate is built.

The most reliable defence is to avoid anchoring on a single year. FinSight's research engine takes the **median** of three estimates - reported trailing free cash flow, the three-year average, and net income multiplied by a bounded median cash-conversion ratio. The median rather than the mean is deliberate: one distorted year is *discarded* rather than averaged in.

This was not a theoretical concern. A large consumer staples company had trailing free cash flow roughly 60% below its net income because of one-off payments in that year. Compounded across a seven-year forecast, that produced a fair value around \`$32\` against a market price near \`$86\` - a wildly wrong answer produced by a perfectly correct model fed a bad first number.

## The Cross-Checks

- **Cash conversion:** \`FCF / Net income\`, averaged over five years. Persistently below 0.7 means earnings are not converting; persistently above 1.2 usually means depreciation exceeds real maintenance needs.
- **Cumulative comparison:** sum five years of net income and five years of free cash flow. Over a full cycle they should be close. A large persistent gap is the single best forensic signal available.
- **The reinvestment check:** does the growth you are forecasting come with the capital spending needed to deliver it? A model with 10% growth and capex at depreciation is internally inconsistent.

## The Honest Framing

There is no single correct free cash flow figure - there is a defensible one, with its adjustments stated. Show the adjustments in the model. An analyst who can say "I normalised the starting figure because year three included a \`$400M\` legal settlement" is doing valuation; one who typed in the trailing number is doing data entry.`,

  vm208: `## Being Right Is Only Half the Job

A portfolio is not a collection of good ideas - it is a structure whose behaviour depends on how those ideas are combined. Two people holding the same ten stocks in different weights, with different rules for adding and cutting, will get materially different outcomes.

## Sizing on Risk, Not Conviction

The instinct is to put the most money into the idea you like most. The problem is that conviction is not calibrated: research consistently finds that confidence and accuracy correlate weakly, and that the most confident calls are not the most reliable.

The alternative is to size on **risk contribution**: how much the portfolio loses if this position is wrong. That combines position size with volatility and with how far the price can fall before the thesis is falsified. A stable large-cap and a volatile small-cap held at the same dollar weight contribute very different amounts of risk, so the same dollar weight is not the same bet.

Practically: risk 0.5–2% of the portfolio per position, defined as \`Position size × (Entry − Invalidation level) / Portfolio\`.

## Concentration and Its Limits

The mathematics of diversification are steep and then flat. Moving from 1 to 5 positions removes most single-stock risk; 5 to 15 removes most of the rest; beyond about 25–30, additional positions mainly dilute the good ideas while adding administrative load.

The real constraint is not the count but **correlation**. Fifteen positions across four sectors is genuinely diversified; fifteen positions in Australian banks and miners is two bets wearing fifteen hats. Correlations also rise sharply in drawdowns, so a portfolio that looks diversified in calm markets can behave as a single position exactly when that matters.

## The Rules Worth Writing Down in Advance

- **Maximum position size**, so a single mistake cannot be terminal. 5–10% is a common ceiling for a concentrated portfolio.
- **Maximum sector exposure**, typically 20–30%.
- **An invalidation level per position** - the specific fact, not the price, that would prove the thesis wrong. Prices falling is not new information; a second consecutive quarter of margin decline is.
- **A rebalancing rule.** Trimming a position that has doubled is not pessimism; it is restoring the risk contribution you chose deliberately.
- **A cash policy.** Cash is a position, and having some is what makes it possible to act during a dislocation rather than watch one.

## The Behavioural Half

Most of the damage in real portfolios is not analytical:

- **Averaging down without a rule** turns a small loss into the largest position in the book, and does so precisely when the thesis is deteriorating.
- **Selling winners and holding losers** - the disposition effect - is the single most documented investor error, and it systematically shortens the holds that produce the returns.
- **Position size and sleep.** A position too large to hold through normal volatility will be sold during normal volatility, at the worst possible price.

## Recording the Decision

Keep a one-page note per position: what you believe, what would prove you wrong, the size and why that size, and the date. Reviewed a year later, it is the only honest record of whether your process works - because memory reliably rewrites the reasoning to match the outcome.`,

  vm209: `## Repeatability Beats Brilliance

The difference between an investor who improves and one who does not is rarely intelligence. It is whether the work is done the same way every time, so that when it goes wrong the cause can be identified. A process that varies from stock to stock produces outcomes you cannot learn from.

This lesson sets out a process. FinSight's **Analyst Coach** walks the same sequence with live data for whatever ticker you give it - this is that method written out.

## The Sequence, and Why It Is In This Order

**1. Understand the business.** What it sells, to whom, and what determines whether it does well. Everything downstream is meaningless without this: a "cheap" multiple means different things for a retailer and a software company. *Fundamentals → Business; Filings → 10-K Item 1.*

**2. Read the price action.** Not to predict, but for context. Buying a good business near its 52-week high is a different decision from buying it near the low. *Charts; Technicals.*

**3. Check how well it earns.** Margins for the business model, returns on capital for the quality. The single most useful comparison is ROIC against the ~8–10% cost of capital: above it, growth creates value; below it, growth destroys value. *Fundamentals → Profitability.*

**4. Measure growth.** Revenue, profit and free cash flow together, compounded over several years rather than one. Profit growing without cash growing is the most common warning sign there is. *Fundamentals → Growth.*

**5. Inspect the balance sheet.** Not "is there debt" but "how far can earnings fall before the debt is a problem". Include leases and pensions. *Fundamentals → Balance Sheet Health.*

**6. Price it against peers.** Multiples are a question, not an answer. Compare against the company's own history and genuine comparables, never across sectors. *Fundamentals → Valuation; Screener.*

**7. Estimate intrinsic value.** A DCF is most useful run backwards: what would have to be true for today's price to make sense? That converts a valuation into a testable claim. *Valuation tab; Valuation Lab; Research.*

**8. Weigh the consensus.** Not to follow it - to know what is already priced in, and to locate where you disagree. *Valuation; News; Sentiment.*

**9. Read the primary sources.** Everything up to here is numbers someone else computed. Item 1A and Item 7 are the company's own account. *Filings.*

**10. Form the view, with a falsifier.** What you think, and the specific fact that would prove you wrong.

## Why the Order Is Not Arbitrary

Valuation comes late deliberately. Starting from a multiple anchors everything afterwards - you will find reasons for whatever the multiple implied. Starting from the business means the multiple is interpreted rather than assumed.

Reading the filings at step 9 rather than step 1 is also deliberate: you get far more out of Item 7 once you already know which numbers moved and want to know why.

## The Written Output

One page per name, every time, containing:

- What the business does, in one sentence.
- Three to five numbers that matter, and why those ones.
- The valuation, the method, and the key assumption.
- The bull and bear cases, with rough probabilities.
- **The falsifier** - the specific observable fact that would end the thesis.
- Position size and the reasoning for it.

## The Review Loop

Revisit each note when results are published, or quarterly. Ask only two questions: *has anything in the thesis changed?* and *was my reasoning good, independently of whether the outcome was good?*

Separating the two is the whole discipline. A profitable position reached by luck and a loss reached by sound reasoning are both worth recognising for what they were - and only a written record makes that possible, because memory quietly rewrites the reasoning to match the result.`,
}

// ── Quiz banks — 10 questions per topic ─────────────────────────────────────
export const ANALYST_QUIZZES = {
  fs105: [
    { question: 'Which document contains a company’s audited annual financial statements?', options: ['The 8-K', 'The 10-K', 'The 10-Q', 'Form 4'], correct: 'B', explanation: 'The 10-K is the annual report; 10-Qs are unaudited quarterly updates.' },
    { question: 'Risk Factors appear in the 10-K as:', options: ['Item 1', 'Item 1A', 'Item 7', 'Item 8'], correct: 'B', explanation: 'Item 1A. Item 1 is Business, Item 7 is MD&A.' },
    { question: 'How many 10-Qs does a US company file each year?', options: ['Four', 'Three', 'Two', 'One'], correct: 'B', explanation: 'Q4 is folded into the 10-K, so only three 10-Qs are filed.' },
    { question: 'Earnings results first reach the market through:', options: ['The 10-Q', 'An 8-K, usually Exhibit 99.1', 'The 10-K', 'The proxy statement'], correct: 'B', explanation: 'The press release is attached to an 8-K weeks before the 10-Q.' },
    { question: 'Executive compensation detail is found in:', options: ['The 10-K', 'The DEF 14A proxy statement', 'The 8-K', 'Form 4'], correct: 'B', explanation: 'The proxy contains the Compensation Discussion & Analysis.' },
    { question: 'A Form 4 must be filed within:', options: ['Four business days', 'Two business days', 'Thirty days', 'One quarter'], correct: 'B', explanation: 'Insider transactions are reported within two business days.' },
    { question: 'The most informative insider transaction type is generally:', options: ['A sale under a 10b5-1 plan', 'An open-market purchase (code P)', 'An option grant', 'A gift'], correct: 'B', explanation: 'There is only one reason to buy; sales have many explanations.' },
    { question: 'An 8-K must generally be filed within:', options: ['Two business days', 'Four business days', 'Ten days', 'Forty-five days'], correct: 'B', explanation: 'Four business days of the triggering event.' },
    { question: 'When the earnings press release and the 10-K describe the year differently, you should generally trust:', options: ['The press release, as it is more current', 'The 10-K, because it carries legal liability', 'Whichever is shorter', 'Neither'], correct: 'B', explanation: 'The press release is written to be favourable; the 10-K to be defensible.' },
    { question: 'The most efficient order for reading a 10-K quickly is:', options: ['Cover to cover', 'Item 1, then Item 7, then the top risk factors, then the notes', 'The notes only', 'Item 8 only'], correct: 'B', explanation: 'Business, then MD&A, then the risks that are ranked first, then detail.' },
  ],
  fs208: [
    { question: 'Under IFRS 15 / ASC 606, revenue is recognised when:', options: ['Cash is received', 'The contract is signed', 'Control transfers to the customer', 'The invoice is issued'], correct: 'C', explanation: 'Transfer of control is the governing principle.' },
    { question: 'Deferred revenue is:', options: ['An asset', 'A liability representing work already paid for but not delivered', 'Equity', 'An expense'], correct: 'B', explanation: 'The company owes the customer future performance.' },
    { question: 'Revenue rising while deferred revenue falls suggests:', options: ['Accelerating new business', 'Recognition of previously sold work, so reported growth runs ahead of bookings', 'A cash flow problem', 'An accounting error'], correct: 'B', explanation: 'The backlog is being consumed rather than replenished.' },
    { question: 'A marketplace reporting revenue gross rather than net will show:', options: ['Higher profit', 'A much larger revenue line for identical economics', 'Lower assets', 'Higher margins'], correct: 'B', explanation: 'Profit is unchanged; only the revenue line differs.' },
    { question: 'Days sales outstanding rising from 45 to 68 over three years most likely indicates:', options: ['Improved collections', 'Sales booked to customers who are slower or less able to pay', 'Lower revenue', 'Higher margins'], correct: 'B', explanation: 'Receivables growing faster than revenue is a classic warning.' },
    { question: 'The strongest cross-check on reported revenue growth is:', options: ['The share price', 'Operating cash flow growth', 'The dividend', 'The P/E ratio'], correct: 'B', explanation: 'Profit is an opinion; cash is a fact.' },
    { question: 'Step 2 of the five-step revenue model is:', options: ['Determine the transaction price', 'Identify the distinct performance obligations', 'Recognise revenue', 'Identify the contract'], correct: 'B', explanation: 'Separating obligations is where most judgement sits.' },
    { question: 'A phone sold with two years of bundled software updates should have:', options: ['All revenue recognised at delivery', 'Revenue split between delivery and the update period', 'No revenue until year two', 'Revenue recognised when cash clears'], correct: 'B', explanation: 'They are separate performance obligations.' },
    { question: 'A bill-and-hold arrangement is:', options: ['Always fraudulent', 'Legitimate only in narrow circumstances and a recurring feature of scandals', 'Standard practice', 'Required by IFRS'], correct: 'B', explanation: 'Invoicing without shipping needs specific conditions to be met.' },
    { question: 'Rising deferred revenue alongside slower reported revenue growth means:', options: ['The business is shrinking', 'Billings are growing faster than recognised revenue', 'Customers are leaving', 'Margins are falling'], correct: 'B', explanation: 'Work has been pre-sold that has not yet been recognised.' },
  ],
  fs209: [
    { question: 'Segment reporting requires companies to disclose segments based on:', options: ['Geography only', 'How management actually runs the business', 'Legal entity structure', 'Tax jurisdiction'], correct: 'B', explanation: 'Segments follow the chief operating decision maker’s view.' },
    { question: 'A 15% consolidated margin from a 5%-margin and a 38%-margin segment is best described as:', options: ['The company’s true margin', 'An artefact of the current revenue mix', 'A modelling error', 'The target margin'], correct: 'B', explanation: 'Mix shift alone will move it without anything improving.' },
    { question: 'Segment operating profits usually sum to more than group operating profit because:', options: ['Of rounding', 'Unallocated corporate costs sit outside the segments', 'Of tax', 'Of currency'], correct: 'B', explanation: 'Head office costs must be subtracted in any sum-of-the-parts.' },
    { question: 'A division taking 60% of capex and delivering 20% of profit is:', options: ['The growth engine', 'Likely destroying value, hidden by consolidated averages', 'Correctly funded', 'Irrelevant'], correct: 'B', explanation: 'Segment capital intensity is invisible in the group ROIC.' },
    { question: 'Geographic and operating segments are:', options: ['Interchangeable', 'Different disclosures answering different questions', 'The same thing', 'Both optional'], correct: 'B', explanation: 'Geography addresses currency and political exposure; operating segments the business model.' },
    { question: 'When a company redefines its segments, the main analytical consequence is:', options: ['Nothing changes', 'Comparability with your own prior work is lost, and the timing deserves scrutiny', 'Revenue increases', 'Tax changes'], correct: 'B', explanation: 'Redefinitions coinciding with underperformance warrant a second look.' },
    { question: 'The best evidence that a company is becoming a services business is:', options: ['Management commentary', 'The services segment growing its share of profit', 'A rising share price', 'A new logo'], correct: 'B', explanation: 'Mix shift shows in the segment note before it shows anywhere else.' },
    { question: 'Segment data is essential for which valuation method?', options: ['Dividend discount', 'Sum-of-the-parts', 'Price-to-book', 'Gordon growth'], correct: 'B', explanation: 'SOTP values each segment on its own appropriate multiple.' },
    { question: 'If management devotes most of an earnings call to a segment that is 6% of profit, the reasonable response is:', options: ['Increase your estimates', 'Ask why the emphasis does not match the economics', 'Ignore the call', 'Sell immediately'], correct: 'B', explanation: 'A mismatch between narrative and accounts is worth understanding.' },
    { question: 'Consolidated revenue growth of 8% is consistent with:', options: ['Every segment growing 8%', 'One segment growing 40% and another shrinking 15%', 'Only stable businesses', 'A single-segment company'], correct: 'B', explanation: 'The consolidated figure hides the composition entirely.' },
  ],
  fs210: [
    { question: 'Since IFRS 16 and ASC 842, most leases appear:', options: ['Only in the notes', 'On the balance sheet as a right-of-use asset and a lease liability', 'In equity', 'Nowhere'], correct: 'B', explanation: 'Both sides are recognised on the balance sheet.' },
    { question: 'The main comparability problem the lease standards created is:', options: ['Nothing changed', 'Leverage ratios jumped in lease-heavy sectors with no change in economics', 'Revenue fell', 'Tax rose'], correct: 'B', explanation: 'Ratios across the transition year are not comparable.' },
    { question: 'A defined-benefit pension deficit is best treated as:', options: ['An operating expense', 'A debt-like claim that consumes cash', 'Equity', 'A contingent asset'], correct: 'B', explanation: 'It ranks alongside debt and requires deficit-repair contributions.' },
    { question: 'A pension scheme moving from deficit to surplus may be explained by:', options: ['Only asset performance', 'Asset performance or a rise in the discount rate', 'Only new contributions', 'A change in headcount'], correct: 'B', explanation: 'The obligation is a present value and falls as rates rise.' },
    { question: 'In a defined-contribution scheme, investment risk sits with:', options: ['The company', 'The employee', 'The regulator', 'The auditor'], correct: 'B', explanation: 'The company’s obligation ends with the contribution.' },
    { question: 'Factoring receivables:', options: ['Has no effect on reported figures', 'Flatters working capital and operating cash flow, and is disclosed only in the notes', 'Increases revenue', 'Reduces equity'], correct: 'B', explanation: 'It is financing that looks like improved collections.' },
    { question: 'A retailer with $1.2bn net debt, $2.8bn lease liabilities and a $300m pension deficit has adjusted net debt of:', options: ['$1.2bn', '$4.0bn', '$4.3bn', '$2.8bn'], correct: 'C', explanation: '1.2 + 2.8 + 0.3 = $4.3bn.' },
    { question: 'Under US GAAP, operating lease costs sit in operating expenses, which means:', options: ['Nothing for analysis', 'EBITDA is not comparable with an IFRS filer of identical economics', 'Revenue differs', 'Tax differs'], correct: 'B', explanation: 'IFRS splits the cost into depreciation and interest, below EBITDA.' },
    { question: 'A contingent liability is disclosed but not provided for when an outflow is:', options: ['Probable', 'Possible but not probable', 'Certain', 'Immaterial only'], correct: 'B', explanation: '"Possible" and "probable" are technical terms in the standards.' },
    { question: 'A leverage screen run on the reported debt line will:', options: ['Be accurate', 'Systematically rank lease- and pension-heavy companies as safer than they are', 'Overstate leverage', 'Work only for banks'], correct: 'B', explanation: 'The obligations outside the debt line are invisible to it.' },
  ],
  fs306: [
    { question: 'The heaviest-weighted term in the Altman Z-Score is:', options: ['Working capital / assets', 'Retained earnings / assets', 'EBIT / assets', 'Sales / assets'], correct: 'C', explanation: 'X₃ carries a coefficient of 3.3.' },
    { question: 'A Z-Score of 1.4 falls in the:', options: ['Safe zone', 'Grey zone', 'Distress zone', 'Not-applicable zone'], correct: 'C', explanation: 'Below 1.8 is distress.' },
    { question: 'Altman Z should not be applied to banks because:', options: ['Banks are too large', 'Their liabilities are funding by design, so the model returns a false distress reading', 'They file differently', 'They have no revenue'], correct: 'B', explanation: 'Altman excluded financials from the fitting sample.' },
    { question: 'FinSight responds to a Z-Score request for a bank by:', options: ['Showing the raw number', 'Reporting "not applicable" and explaining why', 'Showing zero', 'Hiding the tab'], correct: 'B', explanation: 'A score you cannot interpret is worse than no score.' },
    { question: 'The Piotroski F-Score has how many tests?', options: ['Five', 'Seven', 'Nine', 'Twelve'], correct: 'C', explanation: 'Nine binary tests across profitability, leverage and efficiency.' },
    { question: 'The Piotroski accruals test compares:', options: ['Revenue with receivables', 'Operating cash flow with net income', 'Debt with equity', 'Margin with turnover'], correct: 'B', explanation: 'Cash earnings should exceed accounting earnings.' },
    { question: 'Piotroski’s original research found the score worked best:', options: ['On growth stocks', 'As a filter applied to cheap, high book-to-market stocks', 'On its own across all stocks', 'On bonds'], correct: 'B', explanation: 'It separates improving value stocks from value traps.' },
    { question: 'A high Z-Score with a low F-Score suggests:', options: ['A strong, improving business', 'A strong balance sheet in a deteriorating business - a potential value trap', 'Imminent bankruptcy', 'An accounting error'], correct: 'B', explanation: 'The two scores answer different questions and usefully disagree.' },
    { question: 'Both scores share the limitation that they:', options: ['Require market data', 'Use annual data and are backward-looking', 'Only work for banks', 'Need analyst estimates'], correct: 'B', explanation: 'Neither knows about news since the last annual report.' },
    { question: 'A reported F-Score of "6/8" means:', options: ['The score is wrong', 'One test lacked the data to run and was excluded from the denominator', 'The company failed three tests', 'The scale is out of eight'], correct: 'B', explanation: 'Excluding untestable tests is more honest than scoring them zero.' },
  ],
  fs307: [
    { question: 'The more informative half of an earnings call is generally:', options: ['The prepared remarks', 'The analyst Q&A', 'The legal disclaimer', 'The introduction'], correct: 'B', explanation: 'Prepared remarks are scripted and reviewed; Q&A is not.' },
    { question: '"At the low end of our previous range" is:', options: ['A reaffirmation', 'A downgrade delivered without the word', 'An upgrade', 'Neutral'], correct: 'B', explanation: 'Guidance language is deliberately precise.' },
    { question: 'A widening gap between adjusted and GAAP earnings over several quarters suggests:', options: ['Improving quality', '"One-off" charges that are actually recurring costs', 'Lower tax', 'Higher growth'], correct: 'B', explanation: 'Recurring adjustments are operating costs with a label.' },
    { question: 'If four of the first six analyst questions concern one segment, it indicates:', options: ['Poor preparation', 'Where the market has located the uncertainty', 'A scripted call', 'Nothing'], correct: 'B', explanation: 'Question distribution reveals what is actually being debated.' },
    { question: 'A "transitory headwind" appearing in four consecutive calls should be treated as:', options: ['Transitory', 'A feature of the business', 'A one-off', 'An accounting item'], correct: 'B', explanation: 'The second-year test: repeated headwinds are structure.' },
    { question: 'What moves the price on an earnings call is usually:', options: ['The reported quarter', 'Guidance for future periods', 'The CEO’s tone', 'The dividend'], correct: 'B', explanation: 'Reported results are largely known from the 8-K beforehand.' },
    { question: 'Linguistic tone analysis of calls should be treated as:', options: ['A reliable trading signal', 'A prompt to examine a number more closely', 'Irrelevant', 'A substitute for the accounts'], correct: 'B', explanation: 'There is some signal and a large over-selling industry.' },
    { question: 'The same question being deflected in two consecutive quarters is:', options: ['Normal', 'A finding worth pursuing', 'A legal requirement', 'Evidence of fraud'], correct: 'B', explanation: 'One deflection is routine; a pattern is information.' },
    { question: 'The most valuable habit after a call is to record:', options: ['The share price reaction', 'What changed in guidance, the reason given, and whether you believe it', 'The call transcript in full', 'The number of analysts'], correct: 'B', explanation: 'Over several quarters this shows whether management’s explanations hold up.' },
    { question: 'Revenue guidance raised alongside a cost-cutting programme should prompt:', options: ['Immediate buying', 'A question about how both are consistent', 'No reaction', 'A downgrade'], correct: 'B', explanation: 'Growing while shrinking the cost base needs an explanation.' },
  ],
  fs308: [
    { question: 'The five destinations for corporate cash are reinvestment, acquisitions, buybacks, dividends and:', options: ['Executive pay', 'Paying down debt', 'Taxes', 'Research'], correct: 'B', explanation: 'Deleveraging is the fifth and most frequently under-used.' },
    { question: 'A company earning 6% ROIC against a 9% cost of capital should:', options: ['Grow as fast as possible', 'Recognise that growth destroys value and return capital or shrink', 'Borrow to expand', 'Acquire competitors'], correct: 'B', explanation: 'Growth below the cost of capital destroys value.' },
    { question: 'Incremental ROIC is more informative than reported ROIC because:', options: ['It is easier to compute', 'It reflects the capital decisions being made now rather than a decade ago', 'It is always higher', 'Auditors require it'], correct: 'B', explanation: 'Reported ROIC is dominated by legacy capital.' },
    { question: 'A debt-funded acquisition that is accretive to EPS:', options: ['Always creates value', 'May still destroy value - accretion is a financing effect', 'Cannot be accretive', 'Reduces leverage'], correct: 'B', explanation: 'Judge deals on return on capital, not EPS accretion.' },
    { question: 'A goodwill impairment is best read as:', options: ['A routine accounting entry', 'Management confirming in writing that the price paid was wrong', 'A cash outflow', 'A tax benefit'], correct: 'B', explanation: 'It is the admission that acquired value was overstated.' },
    { question: 'The honest measure of a buyback programme is:', options: ['Dollars spent', 'The change in the diluted share count', 'The announcement size', 'The share price after'], correct: 'B', explanation: 'Gross repurchases can be offset entirely by stock-based compensation.' },
    { question: 'Buybacks are best understood as:', options: ['An automatic good', 'A valuation decision - value-creating below intrinsic value, destructive above it', 'A dividend substitute with no difference', 'A tax strategy only'], correct: 'B', explanation: 'The price paid determines whether value is transferred or destroyed.' },
    { question: 'Dividend sustainability is best judged against:', options: ['Reported earnings', 'Free cash flow', 'Revenue', 'EBITDA'], correct: 'B', explanation: 'A 70% earnings payout can exceed 100% of free cash flow.' },
    { question: 'The observed pattern in corporate buyback activity is that it:', options: ['Peaks at market lows', 'Peaks at market highs and stops in crashes', 'Is constant', 'Follows the dividend'], correct: 'B', explanation: 'Precisely backwards from what value creation requires.' },
    { question: 'The five-year record of a management team’s capital allocation is found in:', options: ['The chairman’s letter', 'The financing section of the cash flow statement', 'The income statement', 'The proxy'], correct: 'B', explanation: 'It records what they did rather than what they said.' },
  ],
  ta106: [
    { question: 'A swing pivot high is defined as a bar whose high is:', options: ['Above the moving average', 'The highest within a fixed window on both sides', 'A new 52-week high', 'Above yesterday’s close'], correct: 'B', explanation: 'A purely mechanical definition, free of drawing bias.' },
    { question: 'Clustering nearby pivots into one level is done because:', options: ['It looks tidier', 'Price turns near an area rather than at an exact number, and touch count measures strength', 'It reduces computation', 'Regulators require it'], correct: 'B', explanation: 'Merging within a tolerance and counting touches is what a hand-drawn line loses.' },
    { question: 'A level tested repeatedly tends to become:', options: ['Stronger each time', 'Weaker, as resting orders are consumed', 'Permanent', 'Irrelevant immediately'], correct: 'B', explanation: 'The fourth test breaks more often than the first.' },
    { question: 'Broken resistance frequently becomes:', options: ['Stronger resistance', 'Support', 'Irrelevant', 'A gap'], correct: 'B', explanation: 'Traders who sold there want to buy back at their exit price.' },
    { question: 'The most defensible use of a support level is:', options: ['Predicting a bounce', 'Defining where the thesis is falsified, and therefore the risk', 'Setting a price target', 'Timing earnings'], correct: 'B', explanation: 'Risk definition, not prediction.' },
    { question: 'Levels are least reliable:', options: ['On weekly charts', 'On news that gaps price through them', 'In liquid large caps', 'After a long consolidation'], correct: 'B', explanation: 'New information makes the prior structure obsolete.' },
    { question: 'Buying at $52 with clustered support at $48 implies downside to invalidation of approximately:', options: ['4.0%', '7.7%', '12%', '2%'], correct: 'B', explanation: '(52 − 48) / 52 = 7.7%.' },
    { question: 'Levels in a stock trading $200k a day should be treated as:', options: ['Highly reliable', 'Unreliable, since a "level" may be one order since filled', 'Identical to a large cap', 'Stronger than in liquid names'], correct: 'B', explanation: 'Levels need volume to be meaningful.' },
    { question: 'Round numbers act as levels primarily because:', options: ['Of mathematics', 'Stop orders and options strikes cluster there', 'Of exchange rules', 'Of algorithmic trading only'], correct: 'B', explanation: 'Order clustering creates the effect.' },
    { question: 'Levels should be identified:', options: ['After forming a view, to confirm it', 'Before forming a view, so they constrain the decision', 'Only after entering', 'Only on 5-minute charts'], correct: 'B', explanation: 'Once you want to buy, you will find support wherever you need it.' },
  ],
  ta207: [
    { question: 'The most meaningful liquidity measure is:', options: ['Share volume', 'Average daily value traded', 'Market cap', 'Free float percentage'], correct: 'B', explanation: 'Volume × price; 5m shares at $0.30 is $1.5m, which is nothing.' },
    { question: 'The common institutional participation guideline is that an order should not exceed roughly:', options: ['1% of average daily value', '10% of average daily value', '50% of average daily value', 'There is no guideline'], correct: 'B', explanation: 'Above that, the order itself moves the price.' },
    { question: 'A 2% bid-ask spread means you are, immediately on buying:', options: ['Break-even', 'About 2% down, and pay it again on exit', '2% up', 'Unaffected'], correct: 'B', explanation: 'The spread is a round-trip cost.' },
    { question: 'Liquidity should be treated as:', options: ['A yes/no filter', 'A position-sizing constraint', 'Irrelevant for long-term investors', 'A valuation input'], correct: 'B', explanation: 'The question is how much you can own and still exit.' },
    { question: 'A breakout on unusually low volume is:', options: ['More likely to hold', 'More likely to reverse, since few participants agreed', 'Always a buy', 'Meaningless'], correct: 'B', explanation: 'Volume confirms or contradicts the price move.' },
    { question: 'Relative volume is:', options: ['Volume in dollars', 'Today’s volume divided by the 20-day average', 'Volume minus the average', 'Volume times price'], correct: 'B', explanation: 'Absolute volume is meaningless without a baseline.' },
    { question: 'The dangerous property of liquidity is that it:', options: ['Is constant', 'Evaporates precisely when you need to sell', 'Only matters at IPO', 'Rises in selloffs'], correct: 'B', explanation: 'Size for a bad day, not an average one.' },
    { question: 'A stock trading $800k a day supports a position of roughly what size at 5% participation?', options: ['$8k', '$40k', '$400k', '$800k'], correct: 'B', explanation: '5% of $800k is $40k.' },
    { question: 'Price drifting higher on falling volume typically indicates:', options: ['Strong accumulation', 'Buyers losing interest, a common precursor to reversal', 'A breakout', 'Institutional buying'], correct: 'B', explanation: 'Rising price needs participation to be durable.' },
    { question: 'Outside the ASX 100, the recommended order type is:', options: ['Market orders for speed', 'Limit orders, because spreads widen quickly', 'Stop-market orders', 'It makes no difference'], correct: 'B', explanation: 'A market order in a wide spread pays the whole spread.' },
  ],
  ta305: [
    { question: 'True range for a bar is the largest of three values, one of which is:', options: ['Close minus open', 'High minus low', 'Volume times price', 'The 20-day average'], correct: 'B', explanation: 'The others involve the prior close, which captures gaps.' },
    { question: 'ATR is most comparable across stocks when expressed as:', options: ['A dollar amount', 'A percentage of price', 'A share count', 'A multiple of volume'], correct: 'B', explanation: '$7 on a $300 stock and $0.50 on a $40 stock are 2.3% vs 1.25%.' },
    { question: 'Position size = (Portfolio × Risk per trade) / ?', options: ['ATR', 'Entry price', 'Entry minus stop', 'Beta'], correct: 'C', explanation: 'Risk per share is the distance to invalidation.' },
    { question: 'Portfolio $100,000, 1% risk, entry $52.00, stop $46.70. Position size is approximately:', options: ['100 shares', '188 shares', '500 shares', '1,000 shares'], correct: 'B', explanation: '$1,000 / $5.30 ≈ 188 shares.' },
    { question: 'Volatility-adjusted sizing means two positions with different volatility have:', options: ['The same dollar value', 'The same dollar risk', 'The same share count', 'The same beta'], correct: 'B', explanation: 'The portfolio experiences each as the same size of bet.' },
    { question: 'A stop is placed at a structural level plus an ATR buffer because:', options: ['It looks better', 'Ordinary daily noise should not trigger it', 'Brokers require it', 'It reduces tax'], correct: 'B', explanation: 'A stop inside normal movement is hit by nothing happening.' },
    { question: 'Sizing everything at a fixed 5% weight means:', options: ['Equal risk contribution', 'Portfolio outcomes dominated by whichever positions are most volatile', 'Lower drawdowns', 'Better diversification'], correct: 'B', explanation: 'Equal weight is not equal risk.' },
    { question: 'ATR rising in falling markets means volatility-adjusted sizing:', options: ['Breaks down', 'Automatically reduces position sizes when markets are turbulent', 'Increases sizes', 'Has no effect'], correct: 'B', explanation: 'This is a feature, not a flaw.' },
    { question: 'Six positions each risking 1% in the same sector represent:', options: ['6% of independent risk', 'Substantially more concentrated risk, since they correlate', 'Less risk than one position', 'A hedged book'], correct: 'B', explanation: 'Correlations converge toward 1 in a selloff.' },
    { question: 'A stop does not protect against:', options: ['Slow declines', 'Earnings gaps that jump straight through it', 'Rising volatility', 'Sector rotation'], correct: 'B', explanation: 'Which is why the largest position should not be the one reporting tomorrow.' },
  ],
  ma105: [
    { question: 'Translation exposure arises from:', options: ['Costs and revenues in different currencies', 'Converting foreign subsidiaries’ results into the reporting currency', 'Hedging contracts', 'Interest rate differences'], correct: 'B', explanation: 'It is an accounting effect, not an economic one.' },
    { question: 'Transaction exposure is:', options: ['Purely accounting', 'Economic and real, arising from a currency mismatch between costs and revenues', 'Only relevant to banks', 'Eliminated by IFRS'], correct: 'B', explanation: 'It affects actual margins, not just reported figures.' },
    { question: 'Reported growth 4%, currency headwind 3 points. Constant-currency growth is:', options: ['1%', '4%', '7%', '12%'], correct: 'C', explanation: 'Add the headwind back: 4 + 3 = 7%.' },
    { question: 'Reported growth of 12% including a 5-point currency tailwind describes a business growing:', options: ['12%', '17%', '7%', '5%'], correct: 'C', explanation: 'The tailwind will not repeat.' },
    { question: 'A falling AUD generally:', options: ['Hurts Australian miners', 'Raises the AUD revenue of USD-selling miners with no volume change', 'Has no effect', 'Only affects banks'], correct: 'B', explanation: 'This is why resources often outperform on a weaker currency.' },
    { question: 'For an Australian investor holding unhedged US equities, a falling AUD:', options: ['Reduces returns in AUD', 'Increases returns in AUD, cushioning global drawdowns', 'Has no effect', 'Triggers tax'], correct: 'B', explanation: 'The currency has historically been a partial hedge.' },
    { question: 'Currency sensitivity is quantified in a 10-K in:', options: ['Item 1', 'Item 1A', 'Item 7A, the market risk disclosure', 'Item 3'], correct: 'C', explanation: 'Often stated as the profit impact of a 10% move.' },
    { question: 'A company with an 18-month hedge book will show currency effects:', options: ['Immediately', 'With a lag of roughly the hedge tenor', 'Never', 'Only at year end'], correct: 'B', explanation: 'Hedging delays, it does not eliminate.' },
    { question: 'Translation and transaction effects differ importantly because:', options: ['One is larger', 'Translation effects reverse, transaction effects compound', 'Only one is disclosed', 'Only one is taxed'], correct: 'B', explanation: 'Management commentary frequently blurs the two.' },
    { question: 'Before revising a view on a multinational’s growth, you should first check:', options: ['The share price', 'The currency line', 'The dividend', 'The auditor'], correct: 'B', explanation: 'Much "surprising" revenue movement is exchange rates.' },
  ],
  ma207: [
    { question: 'The commodity cycle recurs primarily because:', options: ['Investors are irrational', 'Capacity decisions are made at current prices and deliver years later', 'Regulation changes', 'Demand is unpredictable'], correct: 'B', explanation: 'The long lead time is the whole mechanism.' },
    { question: 'The leading indicator for a commodity sector is:', options: ['The spot price', 'Industry-wide capital expenditure', 'The share price', 'Inventory value'], correct: 'B', explanation: 'Price is the lagging indicator; capex is the leading one.' },
    { question: 'A trailing P/E of 5 for a cyclical at the top of the cycle is:', options: ['A bargain', 'A warning, because peak earnings cannot persist', 'Normal', 'A data error'], correct: 'B', explanation: 'Cyclicals look cheapest at the top.' },
    { question: 'Commodity price is set by the:', options: ['Lowest-cost producer', 'Marginal cost of the highest-cost producer needed to meet demand', 'Average producer', 'Largest producer'], correct: 'B', explanation: 'Which is why cost curve position determines survival.' },
    { question: 'A producer in the first quartile of the cost curve:', options: ['Has the highest margins at the peak only', 'Stays profitable at prices that force high-cost producers to shut', 'Has the most debt', 'Is always the largest'], correct: 'B', explanation: 'Cost position is more predictive than price forecasts.' },
    { question: 'The "incentive price" is:', options: ['The current spot price', 'The price required to justify new supply', 'The cost of production', 'The futures price'], correct: 'B', explanation: 'Prices persistently above it guarantee supply is coming.' },
    { question: 'For valuing cyclicals, a more robust approach than trailing P/E is:', options: ['Forward P/E only', 'Mid-cycle earnings, price-to-book or EV per unit of production', 'Dividend yield', 'Price-to-sales'], correct: 'B', explanation: 'Less cyclical measures avoid the peak/trough inversion.' },
    { question: 'Falling industry capex during depressed prices generally indicates:', options: ['Permanent decline', 'The foundation of the next upcycle', 'Imminent bankruptcy', 'Nothing'], correct: 'B', explanation: 'Underinvestment builds the next supply deficit.' },
    { question: 'The 2011–2015 iron ore cycle is instructive because expansion approved at ~$180/tonne:', options: ['Delivered into a strong market', 'Delivered into a ~$40/tonne market', 'Was cancelled', 'Was never approved'], correct: 'B', explanation: 'The origin of the sector’s current focus on capital discipline.' },
    { question: 'Capital discipline is rewarded with a higher multiple because:', options: ['It raises current earnings', 'Refusing to expand at the top avoids the value destruction that drives the cycle', 'Regulators require it', 'It lowers tax'], correct: 'B', explanation: 'The market pays for management that does not repeat the cycle.' },
  ],
  ma305: [
    { question: 'Early-cycle leadership typically comes from:', options: ['Utilities and staples', 'Consumer discretionary, financials and industrials', 'Energy and materials', 'Healthcare'], correct: 'B', explanation: 'The most economically and rate-sensitive sectors lead the recovery.' },
    { question: 'Late-cycle leadership typically comes from:', options: ['Consumer discretionary', 'Energy and materials, then defensives', 'Technology only', 'Real estate'], correct: 'B', explanation: 'Input-cost inflation favours resources before defensives take over.' },
    { question: 'Recession-phase outperformers are usually:', options: ['High-beta growth', 'Consumer staples, healthcare and utilities', 'Financials', 'Small caps'], correct: 'B', explanation: 'Demand for food, medicine and electricity is inelastic.' },
    { question: 'Long-duration equities are most sensitive to:', options: ['Oil prices', 'The discount rate', 'The dividend yield', 'Currency'], correct: 'B', explanation: 'Profits arriving far in the future are discounted hardest.' },
    { question: 'Banks are helped by a:', options: ['Flattening curve', 'Steepening yield curve', 'Inverted curve', 'Falling curve at both ends'], correct: 'B', explanation: 'They earn on the spread between short and long rates.' },
    { question: 'Credit spreads are useful because they:', options: ['Are less prone to narrative than equity prices and turn earlier', 'Predict earnings exactly', 'Are unaffected by rates', 'Only matter for bonds'], correct: 'A', explanation: 'They widen before equities fall and narrow before recoveries.' },
    { question: 'Yield curve inversion has preceded US recessions with lead times of:', options: ['Exactly six months', 'Six months to two years', 'One month', 'Five years'], correct: 'B', explanation: 'Useful for positioning, useless for timing.' },
    { question: 'The main limitation of the sector rotation framework is that:', options: ['It never works', 'Phases are only identifiable with confidence after the fact', 'It requires derivatives', 'It only applies to bonds'], correct: 'B', explanation: 'It describes tendencies, not laws.' },
    { question: 'The reasonable use of rotation analysis is as:', options: ['A complete trading system', 'A risk lens on existing positioning', 'A valuation method', 'A stop-loss rule'], correct: 'B', explanation: 'Rotating the whole book on a phase call is where it goes wrong.' },
    { question: 'The ASX behaves as a late-cycle market mainly because:', options: ['Of its time zone', 'Of its heavy weighting to financials and materials', 'Of franking credits', 'Of its size'], correct: 'B', explanation: 'It is more sensitive to Chinese industrial demand than the domestic cycle.' },
  ],
  asx110: [
    { question: 'A $0.70 fully franked dividend at a 30% company tax rate grosses up to:', options: ['$0.91', '$1.00', '$1.30', '$0.70'], correct: 'B', explanation: '0.70 / (1 − 0.30) = $1.00.' },
    { question: 'The franking credit attached to that dividend is:', options: ['$0.21', '$0.30', '$0.70', '$1.00'], correct: 'B', explanation: 'Grossed-up $1.00 less the $0.70 cash.' },
    { question: 'A 5.0% fully franked cash yield has a grossed-up yield of approximately:', options: ['6.5%', '7.14%', '8.0%', '5.0%'], correct: 'B', explanation: '5.0 / 0.70 = 7.14%.' },
    { question: 'The feature that distinguishes Australia’s system from most imputation systems is:', options: ['The tax rate', 'Excess credits are refundable in cash', 'The 45-day rule', 'Half-yearly payment'], correct: 'B', explanation: 'Elsewhere credits typically only reduce tax to zero.' },
    { question: 'A pension-phase superannuation fund on a 0% tax rate receiving a $0.70 fully franked dividend receives in total:', options: ['$0.70', '$0.85', '$1.00', '$1.30'], correct: 'C', explanation: 'The full $0.30 credit is refunded - a 43% uplift on the cash.' },
    { question: 'Franking credits are worth what to a foreign investor?', options: ['Full value', 'Half value', 'Nothing', 'Double value'], correct: 'C', explanation: 'A genuine source of valuation difference between investor bases.' },
    { question: 'A company’s franking percentage falling usually indicates:', options: ['Falling profits', 'A profit mix shifting offshore, where foreign tax is paid', 'A dividend cut', 'A tax audit'], correct: 'B', explanation: 'The franking account is fed by Australian tax actually paid.' },
    { question: 'The 45-day holding rule exists to prevent:', options: ['Short selling', 'Dividend stripping around the ex-date', 'Insider trading', 'Capital raisings'], correct: 'B', explanation: 'Shares must be held at risk to claim the credits.' },
    { question: 'An investor on a 45% marginal rate receiving a $0.70 fully franked dividend nets:', options: ['$0.70', '$0.55', '$0.85', '$0.30'], correct: 'B', explanation: '$1.00 income, $0.45 tax, $0.30 credit → $0.15 payable.' },
    { question: 'The correct caution about franking is that:', options: ['It should always be maximised', 'A fully franked dividend from a declining business is a tax-efficient way to lose money', 'It is taxed twice', 'It applies to foreign shares'], correct: 'B', explanation: 'Franking is a tax attribute, not an investment thesis.' },
  ],
  asx111: [
    { question: 'Full financial accounts on the ASX are required:', options: ['Quarterly', 'Half-yearly', 'Annually only', 'Monthly'], correct: 'B', explanation: 'Interim at the half and a full annual report.' },
    { question: 'Australian mining and exploration companies must lodge quarterly:', options: ['10-Qs', 'Activities reports (Appendix 5B)', 'Proxy statements', 'Nothing'], correct: 'B', explanation: 'Production, expenditure and cash - the key document for a junior.' },
    { question: 'ASX Listing Rule 3.1 requires:', options: ['Quarterly reporting', 'Immediate disclosure of price-sensitive information', 'Annual audits', 'Board diversity'], correct: 'B', explanation: 'Broader and faster than the US 8-K regime.' },
    { question: 'An Australian insider trade is reported on:', options: ['Form 4', 'Appendix 3Y', 'Form 603', 'The annual report'], correct: 'B', explanation: 'Within five business days, versus two for a US Form 4.' },
    { question: 'Executive pay detail on the ASX appears in:', options: ['A separate proxy statement', 'The Remuneration Report inside the annual report', 'The half-year report', 'Appendix 5B'], correct: 'B', explanation: 'There is no separate DEF 14A equivalent.' },
    { question: 'Under the two-strikes rule, a board spill resolution is triggered when:', options: ['Any vote fails', '25% or more vote against the remuneration report in two consecutive years', 'The share price halves', 'The auditor resigns'], correct: 'B', explanation: 'It gives Australian shareholders unusual direct leverage on pay.' },
    { question: 'Searching EDGAR for an ASX-only listing returns:', options: ['The annual report', 'Nothing, because it is not SEC-registered', 'A 20-F', 'A 10-K'], correct: 'B', explanation: 'EDGAR covers US-listed companies and foreign issuers with a US listing.' },
    { question: 'BHP and Rio Tinto file which form with the SEC?', options: ['10-K', '20-F', '40-F', '6-K only'], correct: 'B', explanation: 'The foreign private issuer annual report.' },
    { question: 'Australia uses AASB standards, which are aligned with:', options: ['US GAAP', 'IFRS', 'Neither', 'Japanese GAAP'], correct: 'B', explanation: 'Aligned with IFRS, which differs from US GAAP in several material ways.' },
    { question: 'A difference that makes EBITDA non-comparable between an ASX and a US filer is:', options: ['Currency', 'The income-statement treatment of operating leases', 'Audit standards', 'Reporting frequency'], correct: 'B', explanation: 'IFRS splits lease cost below EBITDA; US GAAP operating leases sit above it.' },
  ],
  vm106: [
    { question: 'The step that most determines the answer in comps analysis is:', options: ['The arithmetic', 'Choosing the peer set', 'The software used', 'The date'], correct: 'B', explanation: 'Comparability of business model, growth and capital intensity drives everything.' },
    { question: 'Assembling a peer set from an index sector classification is:', options: ['Best practice', 'The most common failure mode', 'Required', 'Impossible'], correct: 'B', explanation: 'A payments company, a bank and an insurer share a label and nothing else.' },
    { question: 'The most appropriate multiple when companies have different debt loads is:', options: ['P/E', 'EV/EBITDA', 'P/B', 'Dividend yield'], correct: 'B', explanation: 'Both enterprise value and EBITDA are pre-financing.' },
    { question: 'The median is preferred to the mean because:', options: ['It is easier', 'One company mid-takeover or mid-collapse destroys an average', 'It is always higher', 'Regulators require it'], correct: 'B', explanation: 'Robustness to outliers.' },
    { question: 'Peer median EV/EBITDA 11.0x, applied premium to 13.0x, target EBITDA $450m, net debt $900m, 300m shares. Value per share is:', options: ['$16.50', '$19.50', '$13.00', '$21.00'], correct: 'A', explanation: '13 × 450 = 5,850; less 900 = 4,950; / 300 = $16.50.' },
    { question: 'EV/EBIT is preferable to EV/EBITDA when:', options: ['Growth differs', 'Capital intensity differs, since depreciation is a real cost', 'Tax rates differ', 'Currencies differ'], correct: 'B', explanation: 'EBITDA ignores the cost of maintaining the asset base.' },
    { question: 'The circularity problem in comps is that:', options: ['The arithmetic is recursive', 'If the whole sector is overvalued, comps will call the target fairly valued', 'Peers change', 'Multiples are unstable'], correct: 'B', explanation: 'Comps measure relative value only; run a DCF for an absolute anchor.' },
    { question: 'Mixing a trailing multiple for one company with a forward multiple for another:', options: ['Is standard', 'Is not a comparison at all', 'Improves accuracy', 'Is required for growth stocks'], correct: 'B', explanation: 'The basis must be consistent and labelled.' },
    { question: 'A premium applied to the peer median should be:', options: ['A round 20%', 'Justified in writing by specific differences in growth, margin or leverage', 'Avoided entirely', 'Set by the client'], correct: 'B', explanation: 'An unexplained premium is where comps stops being analysis.' },
    { question: 'Sector-specific multiples such as EV/reserves are often preferred because they are:', options: ['Simpler', 'Harder to manipulate than an accounting figure', 'Always lower', 'Required by IFRS'], correct: 'B', explanation: 'Physical measures are less subject to accounting judgement.' },
  ],
  vm207: [
    { question: '"Owner earnings" refers to:', options: ['Net income', 'Cash generated that could be taken out without impairing competitive position', 'EBITDA', 'Dividends paid'], correct: 'B', explanation: 'Buffett’s formulation of the number a DCF should discount.' },
    { question: 'Only which portion of capital expenditure belongs in owner earnings?', options: ['All of it', 'Growth capex', 'Maintenance capex', 'None of it'], correct: 'C', explanation: 'Growth capex is discretionary and buys future cash flows.' },
    { question: 'A commonly used proxy for maintenance capex in a stable business is:', options: ['Total capex', 'Depreciation', 'Revenue × 5%', 'Net income'], correct: 'B', explanation: 'Imperfect - it understates maintenance under inflation.' },
    { question: 'Stock-based compensation should be:', options: ['Added back as non-cash', 'Subtracted, because it is a real transfer of value to employees', 'Ignored', 'Capitalised'], correct: 'B', explanation: 'The most consequential and most frequently skipped adjustment.' },
    { question: 'A "one-off" restructuring charge appearing in five consecutive years is:', options: ['Still one-off', 'An operating cost with a misleading label', 'A tax item', 'Non-cash'], correct: 'B', explanation: 'Recurring charges are costs.' },
    { question: 'FinSight’s research engine sets starting free cash flow using the median of three estimates because:', options: ['It is faster', 'The median discards one distorted year rather than averaging it in', 'Regulators require it', 'It always gives a higher value'], correct: 'B', explanation: 'A mean would blend the distortion into the result.' },
    { question: 'A staples company whose trailing FCF was 60% below net income produced a DCF value of ~$32 against an $86 price because:', options: ['The model was wrong', 'A bad starting figure was compounded across the forecast', 'The discount rate was too low', 'The terminal growth was too high'], correct: 'B', explanation: 'A correct model fed a bad first number gives a wildly wrong answer.' },
    { question: 'A five-year cash conversion ratio persistently below 0.7 suggests:', options: ['Strong earnings quality', 'Earnings are not converting into cash', 'High growth', 'Low tax'], correct: 'B', explanation: 'FCF / net income is the standard quality check.' },
    { question: 'The best forensic cross-check is comparing five years of:', options: ['Revenue and EBITDA', 'Cumulative net income and cumulative free cash flow', 'Dividends and buybacks', 'Assets and liabilities'], correct: 'B', explanation: 'Over a cycle they should be close; a persistent gap is a signal.' },
    { question: 'A model forecasting 10% growth with capex held at depreciation is:', options: ['Conservative', 'Internally inconsistent, since growth requires reinvestment', 'Standard practice', 'Optimal'], correct: 'B', explanation: 'Growth must be funded in the model that forecasts it.' },
  ],
  vm208: [
    { question: 'Sizing on conviction is problematic mainly because:', options: ['It is hard to measure', 'Confidence and accuracy correlate weakly', 'It is prohibited', 'It requires derivatives'], correct: 'B', explanation: 'The most confident calls are not the most reliable.' },
    { question: 'Risk contribution of a position depends on size and:', options: ['Sector only', 'Volatility and the distance to the invalidation level', 'Market cap', 'Dividend yield'], correct: 'B', explanation: 'Same dollar weight is not the same bet.' },
    { question: 'Most single-stock risk is removed by moving from:', options: ['1 to 5 positions', '15 to 30 positions', '30 to 50 positions', '50 to 100 positions'], correct: 'A', explanation: 'The benefit of diversification is steep and then flat.' },
    { question: 'Fifteen positions across Australian banks and miners represents:', options: ['Genuine diversification', 'Roughly two bets wearing fifteen hats', 'A hedged portfolio', 'Optimal construction'], correct: 'B', explanation: 'Correlation, not count, is the real constraint.' },
    { question: 'An invalidation level should be defined as:', options: ['A price decline of 20%', 'A specific fact that would prove the thesis wrong', 'The 200-day average', 'Analyst downgrades'], correct: 'B', explanation: 'Prices falling is not new information.' },
    { question: 'Trimming a position that has doubled is best understood as:', options: ['Pessimism', 'Restoring the risk contribution originally chosen', 'Market timing', 'Tax management'], correct: 'B', explanation: 'Rebalancing maintains the structure you designed.' },
    { question: 'The disposition effect describes the tendency to:', options: ['Buy high and sell low', 'Sell winners and hold losers', 'Over-diversify', 'Under-research'], correct: 'B', explanation: 'It systematically shortens the holds that produce returns.' },
    { question: 'Averaging down without a predefined rule tends to:', options: ['Reduce risk', 'Make the deteriorating thesis the largest position in the book', 'Improve returns reliably', 'Have no effect'], correct: 'B', explanation: 'Size grows exactly as the evidence worsens.' },
    { question: 'A position too large to hold through normal volatility will:', options: ['Outperform', 'Be sold during normal volatility, at a poor price', 'Reduce drawdowns', 'Improve discipline'], correct: 'B', explanation: 'Sizing has a behavioural component, not just a mathematical one.' },
    { question: 'Cash in a portfolio is best regarded as:', options: ['A failure to invest', 'A position that buys the option to act during a dislocation', 'Always suboptimal', 'A hedge against inflation'], correct: 'B', explanation: 'Having some is what makes acting possible rather than watching.' },
  ],
  vm209: [
    { question: 'Valuation is placed late in the process because:', options: ['It is the hardest step', 'Starting from a multiple anchors every judgement that follows', 'It requires more data', 'It is optional'], correct: 'B', explanation: 'Starting from the business means the multiple is interpreted, not assumed.' },
    { question: 'The most useful way to run a DCF is:', options: ['Forwards, to get a target price', 'Backwards, asking what must be true for today’s price to make sense', 'With three decimal places', 'Only for mature companies'], correct: 'B', explanation: 'That converts a valuation into a testable claim.' },
    { question: 'The single most useful comparison in the profitability step is:', options: ['Gross margin vs peers', 'ROIC against the cost of capital', 'Net margin vs last year', 'Revenue per employee'], correct: 'B', explanation: 'Above it growth creates value; below it, growth destroys value.' },
    { question: 'Filings are read at step 9 rather than step 1 because:', options: ['They are boring', 'You get far more from the MD&A once you know which numbers moved', 'They arrive late', 'They are optional'], correct: 'B', explanation: 'Reading the narrative against the figures is where the value is.' },
    { question: 'A thesis without a falsifier is:', options: ['A strong conviction', 'A hope', 'A hedge', 'Standard practice'], correct: 'B', explanation: 'The falsifier is what makes the view testable.' },
    { question: 'The purpose of weighing consensus is:', options: ['To follow it', 'To know what is priced in and locate where you disagree', 'To copy targets', 'To time entries'], correct: 'B', explanation: 'Consensus is the thing you need an edge against.' },
    { question: 'The written note per name should include size and:', options: ['The broker used', 'The reasoning for that size', 'The tax treatment', 'The sector weight only'], correct: 'B', explanation: 'Sizing reasoning is as reviewable as the thesis.' },
    { question: 'On review, the two questions to ask are whether the thesis changed and:', options: ['Whether you made money', 'Whether the reasoning was good, independently of the outcome', 'Whether peers agreed', 'Whether the sector rotated'], correct: 'B', explanation: 'Separating process from outcome is the whole discipline.' },
    { question: 'A written record is necessary because:', options: ['Regulators require it', 'Memory rewrites the reasoning to match the result', 'It is faster', 'Brokers request it'], correct: 'B', explanation: 'Hindsight makes an unrecorded process unreviewable.' },
    { question: 'The reason to use the same sequence for every company is that:', options: ['It is faster', 'When it goes wrong, the cause can be identified', 'It impresses clients', 'It is required by CFA rules'], correct: 'B', explanation: 'A process that varies produces outcomes you cannot learn from.' },
  ],
}
