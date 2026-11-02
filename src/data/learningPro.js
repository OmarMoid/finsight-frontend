// ============================================================================
// Learning Hub — analyst pack.
//
// Eight lessons aimed at the gap between knowing the vocabulary and producing
// a defensible view of a company: DCF modelling, reading filings, technicals
// and portfolio/macro risk. Merged by learningContent.js alongside the other
// packs. Each lesson points at the FinSight page where the same data lives, so
// reading and doing happen in the same session.
// ============================================================================

export const PRO_TOPICS = {
  valuation: [
    { id: 'vm107', title: 'Building a DCF Step by Step', level: 'Intermediate', duration: 30, labModel: 'dcf' },
    { id: 'vm210', title: 'Terminal Value and Reverse DCF', level: 'Advanced', duration: 28, labModel: 'dcf' },
    { id: 'vm211', title: 'Sizing Risk - Drawdowns, Correlation and Concentration', level: 'Advanced', duration: 26 },
  ],
  fundamentals: [
    { id: 'fs106', title: 'Reading a 10-K in 30 Minutes', level: 'Beginner', duration: 24 },
    { id: 'fs211', title: 'Reading 8-Ks and Proxies for Signals', level: 'Intermediate', duration: 22 },
  ],
  technical: [
    { id: 'ta107', title: 'Building a Technical Checklist', level: 'Beginner', duration: 20 },
    { id: 'ta208', title: 'Combining Trend, Momentum and Volume', level: 'Intermediate', duration: 24 },
  ],
  macro: [
    { id: 'ma106', title: 'How Rates and Inflation Reach Valuations', level: 'Beginner', duration: 22 },
  ],
}

export const PRO_LESSONS = {
  vm107: `## A DCF Is a Story Written in Numbers

A discounted cash flow values a company as the cash it will hand to its owners, discounted back to today. The arithmetic is easy. The skill is deciding which story the inputs tell and whether you believe it.

## The Seven Steps

1. **Start from reality.** Pull five years of revenue, operating margin, tax and capex. FinSight's **Fundamentals** page shows these in full.
2. **Forecast revenue growth** year by year, fading toward the economy's growth rate. Growth that stays at 20% for ten years needs a reason.
3. **Forecast margins.** Ask what the business earns at maturity, not just this year.
4. **Convert to free cash flow:** \`FCF = EBIT × (1 − tax) + depreciation − capex − change in working capital\`.
5. **Choose a discount rate** (WACC). See the cost-of-capital lesson. A risk-free rate near 4% plus a beta-scaled equity premium is a sensible starting point for a large US company.
6. **Add a terminal value** for everything after the forecast window.
7. **Bridge to the share price:** enterprise value, minus net debt, divided by diluted shares.

## A Small Worked Example

Free cash flow of 100 growing 8% for five years, a 9% discount rate and a 2.5% terminal growth rate:

- Year 5 FCF is about 147. Terminal value = \`147 × 1.025 / (0.09 − 0.025)\`, which is about 2,318.
- Discounted back five years at 9%, the terminal value is worth about 1,507.
- The five forecast cash flows add roughly 485 in present value.
- Enterprise value is about 1,990.

Notice that **three quarters of the value sits in the terminal value.** That is normal, and it is why the terminal assumptions deserve most of your attention.

## Where DCFs Go Wrong

- Optimistic margins that never fade.
- A discount rate chosen to hit the answer.
- Capex below depreciation forever.
- Forgetting dilution from stock compensation.

## Try It

Open the **Research** tab and compare its DCF with the one on a stock's Valuation tab. When they disagree, find which assumption differs. That gap is the lesson.`,

  vm210: `## Terminal Value Is the Whole Argument

Because most of a DCF's value arrives after the forecast ends, the terminal value decides the answer. There are two ways to compute it.

**Gordon growth:** \`TV = FCF × (1 + g) / (WACC − g)\`. The growth rate g must stay below long-run nominal GDP, usually 2-3%. If g creeps toward WACC the value explodes.

**Exit multiple:** \`TV = final-year EBITDA × multiple\`. It is simple, but it imports today's market mood into your model. If the whole sector is expensive, so is your terminal value.

Cross-check each against the other. If a Gordon TV implies an exit multiple of 40x EBITDA, one of your inputs is wrong.

## Reverse DCF: Ask What the Price Assumes

Instead of forecasting and getting a value, take the **current price** and solve for the growth the market must expect. It turns an opinion contest into a plausibility test.

Method:
1. Hold WACC, margins and terminal growth fixed.
2. Adjust the revenue growth rate until the DCF equals today's price.
3. Ask whether that growth is believable given the company's history and market size.

A stock whose price needs 25% growth for ten years is not necessarily wrong, but you now know exactly what you are betting on.

## Sensitivity Beats Precision

Report a range, not a point. Rerun the model one point above and below your discount rate: in the worked example earlier, moving WACC from 9% to 8% lifts the terminal value by about a fifth. If a one-point change moves the value that much, say so. The Valuation tab's DCF is a starting point; the **Research** tab lets you flex the inputs.`,

  vm211: `## Position Size Is a Risk Decision

Picking good companies matters less than not being ruined by a few. Three ideas keep a portfolio alive.

## 1. Drawdown, Not Volatility

Volatility treats up and down moves alike. Drawdown measures the **peak-to-trough fall** you would have lived through. A 50% fall needs a 100% gain to recover, so large losses are disproportionately costly. Before buying, look at the stock's worst past drawdown on the Charts tab and ask whether you would have held.

## 2. Correlation

Ten stocks that move together are one stock. Holdings in the same sector, or driven by the same rate or commodity exposure, fall together in a crisis, exactly when diversification should help. Count independent bets, not tickers.

## 3. Concentration and Sizing

A simple rule: size each position by how much you are willing to lose if you are wrong.

\`Shares = (Portfolio × risk per trade) / (entry − stop)\`

Risking 1% of a 50,000 portfolio with a stop 8 below the entry gives \`500 / 8 = 62\` shares. The stop comes from the chart (a recent swing low, or a multiple of ATR), not from what you hope.

## Habits That Help

- Cap any single position at a level you can stomach, often 5-10%.
- Know your total exposure to one currency. A mix of ASX and US stocks adds A$/US$ risk.
- Write down why you own each holding and what would make you sell.`,

  fs106: `## Don't Read It Cover to Cover

A 10-K runs 100 pages. Analysts read it in a deliberate order, and you can too. Open any company in FinSight's **Filings** tab and follow along.

## The 30-Minute Route

**1. Item 1, Business (5 min).** How does the company make money? Who are its customers? How many segments? Skim for what is new compared with last year.

**2. Item 7, MD&A (8 min).** Management explains the numbers in its own words. Look for what drove revenue and margin change, and what management says about the coming year.

**3. Item 1A, Risk Factors (5 min).** Risks are listed roughly in order of importance. Read the first five. Notice any that are **new** this year.

**4. Item 8, Financial Statements and Notes (10 min).** Check that cash flow tracks net income. Then read the notes on revenue recognition, debt maturities, leases and any "contingencies".

**5. Item 9A and the auditor's report (2 min).** Look for "material weakness" or a qualified opinion. Both are rare and serious.

## Red Flags Worth Knowing

- Net income rising while operating cash flow falls.
- Receivables growing faster than revenue.
- A new accounting policy or a change of auditor.
- Heavy use of non-GAAP measures with a long list of adjustments.

## Habit

Compare this year's risk factors and MD&A with last year's. What changed is more informative than what stayed.`,

  fs211: `## The Filings That Move Markets

The annual and quarterly reports are slow. Two other documents often tell you more, sooner.

## The 8-K: News Within Four Business Days

An 8-K reports an event. Learn the items:

- **2.02** Results of operations. The earnings release, usually attached as Exhibit 99.1.
- **5.02** Departure or appointment of directors and officers. A sudden CFO exit deserves attention.
- **1.01 / 1.02** Entry into or termination of a material agreement.
- **4.02** Non-reliance on previously issued financials, meaning a restatement. This is a serious warning.
- **8.01** Other events, a catch-all.

## The Proxy (DEF 14A): How Management Is Paid

Filed before the annual meeting. Read the Compensation Discussion and Analysis:

- What does the bonus reward: revenue, profit, return on capital, or share price?
- Are targets raised each year or quietly lowered?
- How much do executives own? Large holdings align interests.
- Related-party transactions, buried near the back.

## Signals to Look For

Pay that rewards growth at any cost tends to produce acquisitions and aggressive accounting. Pay tied to return on capital tends to produce discipline.

## In the App

The **Filings** tab shows 10-K, 10-Q, 8-K and proxy filings by default, with each form explained. Use "All forms" to see insider Form 4s as well.`,

  ta107: `## A Checklist Removes the Mood

Technical analysis becomes useful when it is a routine, not a feeling. Run the same five questions on every chart.

## The Five Questions

1. **What is the trend?** Compare price with the 50-day and 200-day moving averages. Above both, with the 50 above the 200, is an uptrend.
2. **Where is the nearest support and resistance?** FinSight's Technicals tab lists swing levels, ordered by how often price touched them.
3. **Is momentum stretched?** RSI above 70 is overbought and below 30 oversold, but in a strong trend RSI can stay high for weeks. Treat it as context, not a signal.
4. **Is volume confirming?** Breakouts on rising volume are more trustworthy than on thin volume.
5. **How volatile is it?** ATR tells you how far the stock moves in a typical day, which sets stop distance and position size.

## Reading the Answers Together

An uptrend, price pulling back to the 50-day average, RSI cooling from overbought and volume drying up on the dip is a classic constructive setup. A price below a falling 200-day, bouncing on weak volume, is the opposite.

## Rules

- Decide the exit **before** you enter.
- Use daily charts for decisions and weekly charts for context.
- Technicals describe what is happening. They do not explain why, so pair them with the fundamentals view.`,

  ta208: `## One Indicator Is an Opinion; Three Is Evidence

Indicators measure the same price in different ways. Their value comes from agreement or disagreement.

## Trend, Momentum, Volume

- **Trend** (moving averages) tells you the direction.
- **Momentum** (RSI, MACD) tells you whether the move is gaining or losing strength.
- **Volume** tells you whether participants are behind it.

## Useful Combinations

**Confirmation.** Price breaks above resistance, MACD turns up and volume is above average. Three signals agree.

**Divergence.** Price makes a new high but RSI makes a lower high. Momentum is fading before price. It is a warning, not a sell signal, so wait for price to confirm by breaking support.

**Squeeze.** Narrow Bollinger Bands show low volatility, which tends to precede a large move. The bands do not say which direction, so wait for the break.

## Common Mistakes

- Stacking five momentum indicators. They are all derived from price, so they agree for the same reason and tell you nothing new.
- Trading against a clear higher-timeframe trend.
- Treating a signal as certain. Every setup fails some of the time, which is why sizing and stops matter.

## Practice

On the **Charts** tab, add RSI and MACD to a stock you know. Find the last three times RSI diverged from price and note what happened next.`,

  ma106: `## Why Interest Rates Move Every Valuation

A share is worth the cash it will pay, discounted at a rate. When the **risk-free rate** rises, every future cash flow is worth less today, and the further away the cash, the larger the hit.

## Duration of Equity

Growth companies earn most of their value far in the future, so they behave like long-dated bonds. A rise in the 10-year yield from 3% to 5% hits them hardest. Mature, cash-generating companies are less sensitive.

Illustration: with WACC at 8%, a terminal growth rate of 3% gives a terminal multiple of \`1 / (0.08 − 0.03) = 20x\` cash flow. If WACC rises to 10%, the multiple falls to \`1 / 0.07 ≈ 14x\`. That is a 30% cut in terminal value from a two-point change in rates.

## Inflation's Two Edges

- It lifts costs and pushes central banks to raise rates, which lowers valuations.
- Companies with **pricing power** can pass costs on and protect margins. Check gross margin through past inflation spikes.

## What to Watch

- The 10-year yield. FinSight's DCF assumptions show the risk-free rate used for the listing market.
- Central bank decisions and the economic calendar.
- The yield curve. An inverted curve has often come before slowdowns.

## For Australian Investors

ASX valuations key off Australian 10-year yields and the RBA cash rate, and the A$/US$ rate affects the earnings of companies that report overseas.`,
}

export const PRO_QUIZZES = {
  vm107: [
    { question: 'In a typical DCF, where does most of the value sit?', options: ['The first forecast year', 'The terminal value', 'The balance sheet cash', 'The dividend'], correct: 'B', explanation: 'Often 60-80% of enterprise value arrives after the explicit forecast.' },
    { question: 'Free cash flow to the firm is approximately:', options: ['Net income', 'EBIT × (1 − tax) + depreciation − capex − change in working capital', 'Revenue − COGS', 'EBITDA'], correct: 'B', explanation: 'It is operating cash after tax and reinvestment.' },
    { question: 'To go from enterprise value to a per-share value you:', options: ['Add net debt and divide by shares', 'Subtract net debt and divide by diluted shares', 'Multiply by the P/E', 'Divide by revenue'], correct: 'B', explanation: 'Equity value = EV minus net debt; then divide by diluted shares.' },
    { question: 'Revenue growth in a forecast should usually:', options: ['Stay constant', 'Fade toward long-run economic growth', 'Increase each year', 'Be ignored'], correct: 'B', explanation: 'High growth attracts competition and shrinks as the base grows.' },
    { question: 'Which is a common DCF error?', options: ['Using diluted shares', 'Margins that never fade', 'Cross-checking with multiples', 'Showing a range'], correct: 'B', explanation: 'Sustained peak margins inflate value.' },
  ],
  vm210: [
    { question: 'In the Gordon growth formula, terminal growth should stay below:', options: ['Zero', 'Long-run nominal GDP growth', 'The WACC plus 2%', 'Revenue growth in year 1'], correct: 'B', explanation: 'No company outgrows the economy forever.' },
    { question: 'A reverse DCF solves for:', options: ['The discount rate only', 'The growth the current price implies', 'Next quarter EPS', 'The dividend'], correct: 'B', explanation: 'It asks what the market is already assuming.' },
    { question: 'The exit-multiple method imports:', options: ['Your own growth view', 'Current market valuation levels', 'The balance sheet', 'Tax rates'], correct: 'B', explanation: 'If the sector is expensive, so is your terminal value.' },
    { question: 'If terminal growth approaches WACC, the terminal value:', options: ['Falls to zero', 'Grows very large', 'Stays unchanged', 'Becomes negative'], correct: 'B', explanation: 'The denominator (WACC − g) shrinks toward zero.' },
    { question: 'The best way to present a DCF result is:', options: ['A single exact number', 'A range driven by sensitivity analysis', 'The average of two models', 'A target price only'], correct: 'B', explanation: 'Small input changes move the value a lot, so show the range.' },
  ],
  vm211: [
    { question: 'A 50% loss requires what gain to break even?', options: ['50%', '75%', '100%', '150%'], correct: 'C', explanation: 'Halving requires doubling to recover.' },
    { question: 'Ten highly correlated stocks behave like:', options: ['Ten independent bets', 'Roughly one bet', 'A bond', 'Cash'], correct: 'B', explanation: 'Correlated positions fall together in a crisis.' },
    { question: 'Risking 1% of 50,000 with a stop 8 below entry gives about how many shares?', options: ['40', '62', '100', '500'], correct: 'B', explanation: '500 / 8 ≈ 62 shares.' },
    { question: 'Where should a stop-loss level come from?', options: ['Your hopes', 'A chart level such as a swing low or an ATR multiple', 'The purchase price', 'A round number'], correct: 'B', explanation: 'The market, not the entry price, defines where the idea fails.' },
    { question: 'Mixing ASX and US stocks adds exposure to:', options: ['Inflation only', 'The A$/US$ exchange rate', 'Nothing extra', 'Credit spreads only'], correct: 'B', explanation: 'Currency moves change the value of foreign holdings.' },
  ],
  fs106: [
    { question: 'Which item of the 10-K contains Risk Factors?', options: ['Item 1', 'Item 1A', 'Item 7', 'Item 9A'], correct: 'B', explanation: 'Item 1A. Item 7 is MD&A.' },
    { question: 'A good first read after the Business section is:', options: ['The exhibits', 'MD&A (Item 7)', 'The signatures', 'Item 15'], correct: 'B', explanation: 'Management explains what drove the numbers.' },
    { question: 'Net income rising while operating cash flow falls is:', options: ['Reassuring', 'A red flag worth investigating', 'Irrelevant', 'Normal for all firms'], correct: 'B', explanation: 'Profit not turning into cash is a classic warning.' },
    { question: 'The most useful comparison when reading risk factors is:', options: ['With a competitor', 'With last year’s list', 'With the dividend', 'With the stock price'], correct: 'B', explanation: 'New or reworded risks show what changed.' },
    { question: 'A "material weakness" is disclosed in:', options: ['Item 1', 'Item 9A and the auditor’s report', 'Item 2', 'Item 5'], correct: 'B', explanation: 'It signals a failure in internal controls over reporting.' },
  ],
  fs211: [
    { question: 'Which 8-K item reports results of operations?', options: ['1.01', '2.02', '5.02', '8.01'], correct: 'B', explanation: 'Item 2.02 is the earnings release.' },
    { question: 'An 8-K Item 4.02 means:', options: ['A new CEO', 'Non-reliance on prior financials, a restatement', 'A dividend', 'A stock split'], correct: 'B', explanation: 'It tells investors past statements can no longer be relied on.' },
    { question: 'Executive pay is detailed in:', options: ['The 10-Q', 'The DEF 14A proxy', 'Form 4', 'The 8-K only'], correct: 'B', explanation: 'The CD&A section explains pay and targets.' },
    { question: 'Pay tied purely to revenue growth tends to encourage:', options: ['Capital discipline', 'Growth at any cost, including acquisitions', 'Lower risk', 'Higher dividends'], correct: 'B', explanation: 'People optimise what they are paid for.' },
    { question: 'An 8-K is generally due within:', options: ['Four business days', 'Sixty days', 'One year', 'Same day'], correct: 'A', explanation: 'Four business days of the triggering event.' },
  ],
  ta107: [
    { question: 'An uptrend is commonly defined as price above:', options: ['The 5-day average only', 'The 50-day and 200-day averages', 'Last year’s low', 'The RSI'], correct: 'B', explanation: 'Both medium and long averages confirm the direction.' },
    { question: 'RSI above 70 in a strong trend:', options: ['Always means sell', 'Can persist for weeks', 'Means volume is low', 'Is impossible'], correct: 'B', explanation: 'Strong trends keep RSI elevated; use it as context.' },
    { question: 'ATR helps you set:', options: ['The dividend', 'Stop distance and position size', 'The P/E', 'The trend'], correct: 'B', explanation: 'It measures typical daily movement.' },
    { question: 'A breakout on rising volume is:', options: ['Less reliable', 'More reliable than one on thin volume', 'Unrelated to volume', 'Always false'], correct: 'B', explanation: 'Volume shows participation behind the move.' },
    { question: 'You should decide your exit:', options: ['After entering', 'Before entering', 'Only if losing', 'Never'], correct: 'B', explanation: 'Pre-deciding removes emotion.' },
  ],
  ta208: [
    { question: 'Price makes a new high but RSI a lower high. This is:', options: ['Confirmation', 'Bearish divergence, a warning', 'A buy signal', 'Noise'], correct: 'B', explanation: 'Momentum is fading before price.' },
    { question: 'Narrow Bollinger Bands usually signal:', options: ['A downtrend', 'Low volatility that often precedes a bigger move', 'High volume', 'A dividend'], correct: 'B', explanation: 'Compression tends to precede expansion, direction unknown.' },
    { question: 'Why is stacking five momentum indicators weak?', options: ['They are expensive', 'They all derive from price and say the same thing', 'They never agree', 'They need volume'], correct: 'B', explanation: 'Agreement among redundant tools adds no evidence.' },
    { question: 'MACD and RSI are examples of:', options: ['Trend tools', 'Momentum tools', 'Volume tools', 'Fundamentals'], correct: 'B', explanation: 'They measure strength of the move.' },
    { question: 'Trading against a clear higher-timeframe trend is:', options: ['Safer', 'Usually lower probability', 'Required', 'Neutral'], correct: 'B', explanation: 'The larger trend tends to dominate smaller moves.' },
  ],
  ma106: [
    { question: 'When the risk-free rate rises, valuations generally:', options: ['Rise', 'Fall, especially for long-duration growth stocks', 'Stay the same', 'Double'], correct: 'B', explanation: 'Future cash flows are discounted more heavily.' },
    { question: 'With WACC 8% and growth 3%, the terminal multiple is about:', options: ['10x', '20x', '30x', '5x'], correct: 'B', explanation: '1 / (0.08 − 0.03) = 20.' },
    { question: 'Which companies handle inflation best?', options: ['Those with pricing power', 'Those with high debt', 'Those with thin margins', 'Those with fixed contracts'], correct: 'A', explanation: 'They pass cost increases to customers.' },
    { question: 'An inverted yield curve has often preceded:', options: ['Booms', 'Slowdowns', 'Rate cuts only', 'Currency pegs'], correct: 'B', explanation: 'Short rates above long rates signal tight policy.' },
    { question: 'ASX valuations key off:', options: ['US yields only', 'Australian yields and the RBA cash rate', 'Gold prices', 'The Dow'], correct: 'B', explanation: 'Local rates set the discount rate for local cash flows.' },
  ],
}
