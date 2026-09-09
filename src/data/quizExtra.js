// Supplemental question pools, merged with QUIZ_BANKS at runtime. Kept separate
// so the original learningContent.js is untouched. The quiz engine draws a
// random subset from the combined pool each attempt, so a larger pool here means
// genuinely different questions on every retake.
//
// Coverage note: these expand the core Fundamentals, Valuation and a few
// Technical/Macro/ASX topics from 5 → ~10 questions. Topics without an entry
// here still randomise question order and option order on each attempt.

export const EXTRA_QUIZ = {
  // ── Fundamentals ──────────────────────────────────────────────────────────
  fs101: [
    { question: 'Which statement shows a company’s financial position at a single point in time?', options: ['Income statement', 'Balance sheet', 'Cash flow statement', 'Statement of equity'], correct: 'B', explanation: 'The balance sheet is a snapshot of assets, liabilities and equity at a date.' },
    { question: 'The accounting identity is:', options: ['Assets = Liabilities + Equity', 'Assets = Revenue − Costs', 'Equity = Assets + Liabilities', 'Revenue = Assets − Equity'], correct: 'A', explanation: 'Assets are funded by liabilities plus shareholders’ equity.' },
    { question: 'Which is a NON-cash expense on the income statement?', options: ['Wages', 'Interest paid', 'Depreciation', 'Rent'], correct: 'C', explanation: 'Depreciation allocates past capital spending; no cash leaves in the period.' },
    { question: 'The cash flow statement is valuable because it:', options: ['Uses accrual estimates', 'Strips out non-cash accounting and shows real cash generated', 'Ignores investing activity', 'Equals net income'], correct: 'B', explanation: 'It reconciles profit to actual cash, exposing earnings quality.' },
    { question: 'A company with rising profit but falling operating cash flow may be:', options: ['Very healthy', 'Showing a possible earnings-quality red flag', 'Debt-free', 'Overcapitalised'], correct: 'B', explanation: 'Profit not converting to cash can signal aggressive accounting or working-capital strain.' },
  ],
  fs102: [
    { question: 'A P/E of 25 means investors pay:', options: ['$25 per $1 of annual earnings', '25% earnings yield', '$25 of debt per share', '25 cents of dividends'], correct: 'A', explanation: 'P/E is price divided by EPS - dollars paid per dollar of earnings.' },
    { question: 'The earnings yield is the:', options: ['Dividend / price', 'Inverse of the P/E (EPS / price)', 'P/B ratio', 'Growth rate'], correct: 'B', explanation: 'Earnings yield = E/P, the reciprocal of the P/E.' },
    { question: 'P/B is most useful for valuing:', options: ['Asset-light software', 'Banks and asset-heavy financials', 'Pre-revenue startups', 'Pure growth stocks'], correct: 'B', explanation: 'Book value is meaningful where the balance sheet drives earnings, e.g. banks.' },
    { question: 'A low P/E can be a "value trap" when:', options: ['Earnings are about to grow fast', 'Earnings are at a cyclical peak and set to fall', 'The company is debt-free', 'Dividends are rising'], correct: 'B', explanation: 'A cheap multiple on peak earnings is dangerous as earnings revert down.' },
    { question: 'P/S is especially helpful for companies that:', options: ['Have stable mature earnings', 'Are not yet profitable but growing revenue', 'Pay large dividends', 'Have no revenue'], correct: 'B', explanation: 'When earnings are negative, sales-based multiples still give a comparison.' },
  ],
  fs103: [
    { question: 'Diluted EPS differs from basic EPS by including:', options: ['Only preferred dividends', 'Potential shares from options, warrants and convertibles', 'Treasury stock only', 'Buybacks only'], correct: 'B', explanation: 'Diluted EPS assumes dilutive securities convert, lowering EPS.' },
    { question: 'High-quality earnings are typically:', options: ['Backed by strong operating cash flow', 'Driven by one-off gains', 'Reliant on accounting changes', 'Boosted by asset sales'], correct: 'A', explanation: 'Cash-backed, recurring earnings are higher quality than one-offs.' },
    { question: 'A widening gap between net income and operating cash flow suggests:', options: ['Improving quality', 'Possible aggressive revenue recognition', 'Lower leverage', 'Higher dividends'], correct: 'B', explanation: 'Profit not turning into cash is a classic earnings-quality warning.' },
    { question: '"Normalised" EPS removes:', options: ['All expenses', 'One-time, non-recurring items', 'Taxes', 'Cost of goods sold'], correct: 'B', explanation: 'Normalising strips non-recurring items to show sustainable earnings power.' },
    { question: 'Share buybacks raise EPS by:', options: ['Increasing net income', 'Reducing the share count', 'Raising revenue', 'Cutting taxes'], correct: 'B', explanation: 'Fewer shares lift EPS even with flat profit - check it is not masking weak growth.' },
  ],
  fs201: [
    { question: 'A DCF values a company as the:', options: ['Sum of its assets', 'Present value of future free cash flows', 'Latest year’s earnings × P/E', 'Book value plus cash'], correct: 'B', explanation: 'Intrinsic value = PV of expected future cash flows.' },
    { question: 'In a DCF, a higher discount rate makes the fair value:', options: ['Higher', 'Lower', 'Unchanged', 'Negative always'], correct: 'B', explanation: 'A higher rate discounts future cash more heavily, reducing present value.' },
    { question: 'Most of a typical DCF value sits in the:', options: ['First year', 'Terminal value', 'Net debt', 'Tax shield'], correct: 'B', explanation: 'The terminal value usually dominates, so its assumptions matter most.' },
    { question: 'Free cash flow to the firm is roughly:', options: ['Net income + dividends', 'NOPAT + D&A − capex − ΔNWC', 'Revenue − costs', 'EBITDA − tax'], correct: 'B', explanation: 'FCFF = after-tax operating profit plus non-cash, less reinvestment.' },
    { question: 'A DCF is most fragile when:', options: ['Cash flows are stable and predictable', 'Growth and discount-rate assumptions are uncertain', 'The firm is mature', 'Margins are steady'], correct: 'B', explanation: 'Small changes in growth/WACC swing the output widely - hence sensitivity tables.' },
  ],
  fs202: [
    { question: 'ROIC measures return on:', options: ['Equity only', 'All invested capital (debt + equity)', 'Total assets', 'Revenue'], correct: 'B', explanation: 'ROIC = NOPAT / invested capital, capturing debt and equity funding.' },
    { question: 'A company creates value when:', options: ['ROIC > WACC', 'ROIC < WACC', 'ROE = 0', 'Revenue grows'], correct: 'A', explanation: 'Earning more on capital than it costs is the definition of value creation.' },
    { question: 'DuPont breaks ROE into margin, asset turnover and:', options: ['Tax rate', 'Financial leverage', 'Dividend payout', 'Beta'], correct: 'B', explanation: 'ROE = net margin × asset turnover × equity multiplier (leverage).' },
    { question: 'A high ROE driven mostly by leverage is:', options: ['Always excellent', 'Riskier than one driven by margins/turnover', 'Impossible', 'A sign of no debt'], correct: 'B', explanation: 'Leverage amplifies ROE but also risk; quality matters more than the headline.' },
    { question: 'ROA is most useful for comparing:', options: ['Companies with different capital structures', 'Only tech firms', 'Dividend payers', 'Pre-revenue firms'], correct: 'A', explanation: 'ROA ignores financing, comparing how efficiently assets generate profit.' },
  ],
  fs203: [
    { question: 'Free cash flow is best described as cash:', options: ['Before any spending', 'Left after funding operations and capex', 'Equal to net income', 'From financing'], correct: 'B', explanation: 'FCF = operating cash flow minus capital expenditure.' },
    { question: 'FCF yield is calculated as:', options: ['FCF / market cap (or per share / price)', 'FCF / revenue', 'FCF / assets', 'FCF / debt'], correct: 'A', explanation: 'FCF yield compares free cash to the price you pay for the equity.' },
    { question: 'A capital-light business tends to have:', options: ['High capex and low FCF conversion', 'Low capex and high FCF conversion', 'No revenue', 'Negative margins'], correct: 'B', explanation: 'Less reinvestment need means more profit converts to free cash.' },
    { question: 'Negative FCF can be acceptable when:', options: ['The company is shrinking', 'It is investing heavily in profitable growth', 'It cannot pay interest', 'Margins are collapsing'], correct: 'B', explanation: 'Growth capex that earns above the cost of capital can justify temporary negative FCF.' },
    { question: 'Owner earnings (Buffett) approximate FCF by starting from:', options: ['Revenue', 'Net income plus non-cash charges minus maintenance capex', 'EBITDA only', 'Dividends'], correct: 'B', explanation: 'Owner earnings focus on maintenance (not growth) capex to gauge sustainable cash.' },
  ],
  fs204: [
    { question: 'Enterprise value represents the cost to acquire:', options: ['Just the equity', 'The whole business including debt, net of cash', 'Only the assets', 'The brand'], correct: 'B', explanation: 'EV = market cap + total debt − cash; the takeover value of operations.' },
    { question: 'Why add debt and subtract cash to get EV?', options: ['Tax reasons', 'An acquirer assumes the debt and gets the cash', 'Accounting rules', 'To inflate value'], correct: 'B', explanation: 'Buying the firm means taking on its debt and pocketing its cash.' },
    { question: 'EV/Sales is useful when a company:', options: ['Has stable earnings', 'Is unprofitable but growing', 'Pays dividends', 'Has no debt'], correct: 'B', explanation: 'When EBITDA/earnings are negative, EV/Sales still allows comparison.' },
    { question: 'Two firms with identical operations but different debt will have similar:', options: ['P/E ratios', 'EV/EBITDA ratios', 'Dividend yields', 'Share prices'], correct: 'B', explanation: 'EV/EBITDA neutralises leverage, unlike P/E.' },
    { question: 'EV/EBIT is preferred over EV/EBITDA for capital-intensive firms because it:', options: ['Ignores depreciation', 'Counts depreciation as the real cost it is', 'Adds back capex', 'Uses revenue'], correct: 'B', explanation: 'For heavy-asset firms depreciation is a genuine cost, so EBIT is more honest.' },
  ],

  // ── Valuation ───────────────────────────────────────────────────────────────
  vm101: [
    { question: 'The first step in a comps analysis is to:', options: ['Pick a price target', 'Select genuinely comparable peers', 'Calculate the DCF', 'Choose a discount rate'], correct: 'B', explanation: 'Comps live or die on the comparability of the peer set.' },
    { question: 'Forward multiples differ from trailing multiples by using:', options: ['Last year’s earnings', 'Expected future earnings', 'Book value', 'Cash flow only'], correct: 'B', explanation: 'Forward multiples divide price by forecast earnings, capturing expected growth.' },
    { question: 'A peer trading at a premium multiple may deserve it because of:', options: ['Lower growth', 'Higher growth, margins or returns on capital', 'More debt', 'Weaker moat'], correct: 'B', explanation: 'Quality and growth justify higher multiples - adjust, don’t just average.' },
    { question: 'A weakness of relative valuation is that it:', options: ['Requires cash-flow forecasts', 'Says nothing about absolute value if the sector is mispriced', 'Cannot use multiples', 'Ignores peers'], correct: 'B', explanation: 'Cheap-vs-peers is meaningless if the whole group is over- or under-valued.' },
    { question: 'When peer multiples are skewed by an outlier, prefer the:', options: ['Mean', 'Median', 'Maximum', 'Sum'], correct: 'B', explanation: 'The median resists distortion from extreme values.' },
  ],
  vm102: [
    { question: 'The DDM is most appropriate for:', options: ['Non-dividend growth stocks', 'Stable, mature dividend payers', 'Pre-revenue firms', 'Cyclical miners'], correct: 'B', explanation: 'It needs predictable, growing dividends to be reliable.' },
    { question: 'In the Gordon model, raising the growth rate g (with g < Ke):', options: ['Lowers value', 'Raises value', 'No effect', 'Makes it negative'], correct: 'B', explanation: 'A smaller (Ke − g) denominator increases the present value.' },
    { question: 'A two-stage DDM is used when:', options: ['Growth is constant forever', 'High growth fades to a stable long-run rate', 'There are no dividends', 'Ke is zero'], correct: 'B', explanation: 'It models a high-growth phase then a perpetual stable phase.' },
    { question: 'The required return Ke is often estimated with:', options: ['The dividend yield', 'CAPM (Rf + beta × ERP)', 'The P/E', 'Revenue growth'], correct: 'B', explanation: 'CAPM gives the cost of equity used to discount dividends.' },
    { question: 'For an ASX bank, the DDM should incorporate:', options: ['Franking credits', 'Stock splits', 'Volume', 'Beta only'], correct: 'A', explanation: 'Franking lifts the effective after-tax yield to Australian investors.' },
  ],
  vm103: [
    { question: 'EBITDA is popular in EV multiples because it is:', options: ['Net of all costs', 'A rough proxy for operating cash flow, pre-capital-structure', 'The same as FCF', 'After tax'], correct: 'B', explanation: 'EBITDA approximates operating cash generation before financing and tax.' },
    { question: 'A criticism of EBITDA, per Buffett/Munger, is that it:', options: ['Includes too much tax', 'Ignores that capex and depreciation are real', 'Is too conservative', 'Excludes revenue'], correct: 'B', explanation: '"Does management think the tooth fairy pays for capex?" - D&A reflects real spending.' },
    { question: 'A reasonable EV/EBITDA for a stable mature industrial might be:', options: ['1–2x', '6–10x', '40x', '0.2x'], correct: 'B', explanation: 'Mature, moderate-growth firms commonly trade around 6–10x EV/EBITDA.' },
    { question: 'EV/EBITDA lets you compare firms with different:', options: ['Products', 'Capital structures and tax rates', 'Customers', 'Names'], correct: 'B', explanation: 'It strips out leverage and tax differences, isolating operating value.' },
    { question: 'To go from implied EV to equity value per share you:', options: ['Add cash, subtract debt, divide by shares', 'Subtract cash, add debt', 'Multiply by P/E', 'Add revenue'], correct: 'A', explanation: 'Equity = EV − net debt; per share = equity / share count.' },
  ],
  vm104: [
    { question: 'PEG below 1.0 generally suggests a stock is:', options: ['Expensive for its growth', 'Cheap relative to its growth', 'Bankrupt', 'A dividend stock'], correct: 'B', explanation: 'A PEG under 1 means you pay less than 1× the growth rate in P/E terms.' },
    { question: 'PEG was popularised by:', options: ['Warren Buffett', 'Peter Lynch', 'Benjamin Graham', 'Eugene Fama'], correct: 'B', explanation: 'Lynch championed PEG as a quick growth-adjusted value check.' },
    { question: 'PEG is unreliable when growth is:', options: ['Steady and positive', 'Near zero or negative', 'Above 10%', 'Equal to the P/E'], correct: 'B', explanation: 'Dividing by tiny or negative growth produces meaningless ratios.' },
    { question: 'A flaw of PEG is that it treats:', options: ['All growth as equally risky', 'High and low risk growth differently', 'Dividends as growth', 'Debt as equity'], correct: 'A', explanation: 'PEG ignores the quality and risk of the forecast growth.' },
    { question: 'A 40 P/E with 50% growth gives a PEG of:', options: ['0.8', '2.0', '1.25', '0.4'], correct: 'A', explanation: '40 / 50 = 0.8, attractive if the growth is durable.' },
  ],

  // ── Technical ─────────────────────────────────────────────────────────────
  ta101: [
    { question: 'A candlestick body shows the range between:', options: ['High and low', 'Open and close', 'Two moving averages', 'Volume peaks'], correct: 'B', explanation: 'The body spans open-to-close; wicks show the high/low extremes.' },
    { question: 'A long lower wick (hammer) after a downtrend often signals:', options: ['Continuation down', 'Potential bullish reversal', 'Low volume', 'A dividend'], correct: 'B', explanation: 'Buyers rejected lower prices, hinting at a reversal - confirm with follow-through.' },
    { question: 'A "doji" candle reflects:', options: ['Strong trend', 'Indecision (open ≈ close)', 'A gap up', 'High dividends'], correct: 'B', explanation: 'Open and close near-equal show a balance between buyers and sellers.' },
    { question: 'Candlestick signals are most reliable when:', options: ['Used alone', 'Confirmed by volume and context/trend', 'Ignoring price', 'On 1-minute charts only'], correct: 'B', explanation: 'Context and confirmation reduce false signals.' },
    { question: 'An engulfing pattern is notable because the second candle:', options: ['Is tiny', 'Fully engulfs the prior body, showing a momentum shift', 'Has no body', 'Matches the first'], correct: 'B', explanation: 'A larger opposite candle swallowing the prior one signals a shift in control.' },
  ],
  ta102: [
    { question: 'Support is a price level where:', options: ['Selling overwhelms buying', 'Buying tends to halt a decline', 'Volume disappears', 'Dividends are paid'], correct: 'B', explanation: 'Demand clusters at support, slowing or reversing falls.' },
    { question: 'When resistance breaks convincingly, it often becomes:', options: ['Stronger resistance', 'New support', 'Irrelevant', 'A dividend level'], correct: 'B', explanation: 'Role reversal: broken resistance frequently acts as support.' },
    { question: 'A level is more significant when it has been:', options: ['Touched once', 'Tested multiple times on volume', 'Never reached', 'Set by one trade'], correct: 'B', explanation: 'Repeated tests with volume confirm the level’s importance.' },
    { question: 'Round numbers (e.g. $100) often act as:', options: ['No level at all', 'Psychological support/resistance', 'Guaranteed targets', 'Dividend dates'], correct: 'B', explanation: 'Clustered orders at round figures create psychological levels.' },
    { question: 'A false breakout (whipsaw) is when price:', options: ['Breaks a level then quickly reverses back', 'Trends smoothly', 'Pays a dividend', 'Gaps and holds'], correct: 'A', explanation: 'Price pierces the level but fails to hold, trapping breakout traders.' },
  ],
  ta103: [
    { question: 'A simple moving average smooths price by:', options: ['Taking the latest price', 'Averaging closes over a window', 'Using only highs', 'Ignoring price'], correct: 'B', explanation: 'An SMA averages the last N closing prices.' },
    { question: 'A "golden cross" is when the:', options: ['50-day crosses below the 200-day', '50-day crosses above the 200-day', 'Price hits a new low', 'Volume spikes'], correct: 'B', explanation: 'A shorter MA crossing above a longer one is a classic bullish signal.' },
    { question: 'An EMA differs from an SMA by:', options: ['Ignoring recent prices', 'Weighting recent prices more heavily', 'Using volume', 'Being slower'], correct: 'B', explanation: 'The exponential MA reacts faster by overweighting recent data.' },
    { question: 'Moving averages work poorly in:', options: ['Strong trends', 'Choppy, sideways markets', 'Any market', 'High-volume markets'], correct: 'B', explanation: 'Range-bound markets produce frequent whipsaw crossovers.' },
    { question: 'Price above a rising 200-day MA generally indicates:', options: ['A bear market', 'A long-term uptrend', 'A dividend cut', 'Low volatility only'], correct: 'B', explanation: 'The 200-day is a widely watched long-term trend filter.' },
  ],
  ta201: [
    { question: 'RSI oscillates between:', options: ['−1 and +1', '0 and 100', '0 and 1', '−100 and 100'], correct: 'B', explanation: 'RSI is bounded 0–100, with 30/70 common thresholds.' },
    { question: 'A classic overbought RSI reading is above:', options: ['30', '50', '70', '90 only'], correct: 'C', explanation: 'Above 70 is conventionally overbought (context matters in strong trends).' },
    { question: 'Bullish RSI divergence is when price makes a lower low but RSI makes a:', options: ['Lower low', 'Higher low', 'New high', 'Flat line'], correct: 'B', explanation: 'Momentum improving while price falls hints at a reversal up.' },
    { question: 'In a strong uptrend, RSI can stay overbought, so it is best used with:', options: ['No other tools', 'Trend context and confirmation', 'Only volume', 'Dividends'], correct: 'B', explanation: 'Overbought can persist; combine RSI with trend and price action.' },
    { question: 'RSI is classified as a:', options: ['Trend-following average', 'Momentum oscillator', 'Volume indicator', 'Valuation metric'], correct: 'B', explanation: 'RSI measures the speed/magnitude of recent price changes.' },
  ],
  ta202: [
    { question: 'MACD is built from:', options: ['Two moving averages and their difference', 'Volume only', 'RSI and price', 'Book value'], correct: 'A', explanation: 'MACD = (12-EMA − 26-EMA), with a 9-EMA signal line.' },
    { question: 'A bullish MACD signal is the MACD line crossing:', options: ['Below the signal line', 'Above the signal line', 'Below zero only', 'The 200-day'], correct: 'B', explanation: 'MACD crossing above its signal line is a common buy trigger.' },
    { question: 'The MACD histogram measures the:', options: ['Volume', 'Gap between MACD and its signal line', 'P/E', 'Dividend'], correct: 'B', explanation: 'The histogram is MACD minus signal, showing momentum acceleration.' },
    { question: 'MACD above zero indicates:', options: ['Short-term average below long-term', 'Short-term average above long-term (upward momentum)', 'No trend', 'Overbought'], correct: 'B', explanation: 'A positive MACD means the fast EMA is above the slow EMA.' },
    { question: 'Like other oscillators, MACD lags because it is built from:', options: ['Future prices', 'Moving averages of past prices', 'Volume spikes', 'Analyst targets'], correct: 'B', explanation: 'Averaging past prices introduces lag; signals confirm rather than predict.' },
  ],

  // ── Macro ──────────────────────────────────────────────────────────────────
  ma101: [
    { question: 'When central banks raise rates, the present value of future earnings generally:', options: ['Rises', 'Falls', 'Is unchanged', 'Doubles'], correct: 'B', explanation: 'Higher discount rates lower the PV of distant cash flows - hurting growth stocks most.' },
    { question: 'Higher interest rates tend to hurt which stocks most?', options: ['Long-duration growth stocks', 'Short-duration value stocks', 'Cash-rich firms', 'Banks always'], correct: 'A', explanation: 'Growth stocks’ value sits far in the future, so they are rate-sensitive.' },
    { question: 'Rising rates often help the earnings of:', options: ['Highly indebted firms', 'Banks via wider net interest margins', 'Utilities', 'REITs'], correct: 'B', explanation: 'Banks can earn more on the spread between loan and deposit rates.' },
    { question: 'Bond yields and bond prices move:', options: ['Together', 'Inversely', 'Randomly', 'Identically to stocks'], correct: 'B', explanation: 'When yields rise, existing bond prices fall, and vice versa.' },
    { question: 'The "risk-free rate" in valuation is usually proxied by:', options: ['Corporate bond yields', 'Government bond yields', 'The dividend yield', 'The P/E'], correct: 'B', explanation: 'Sovereign (e.g. 10-year) yields anchor the discount rate.' },
  ],
  ma102: [
    { question: 'CPI measures:', options: ['Unemployment', 'Consumer price inflation', 'GDP growth', 'Money supply'], correct: 'B', explanation: 'The Consumer Price Index tracks the change in a basket of consumer prices.' },
    { question: 'Core inflation excludes:', options: ['Rent', 'Food and energy (volatile components)', 'Services', 'Wages'], correct: 'B', explanation: 'Core strips volatile food/energy to reveal the underlying trend.' },
    { question: 'Central banks typically respond to persistently high inflation by:', options: ['Cutting rates', 'Raising rates', 'Printing money', 'Buying stocks'], correct: 'B', explanation: 'Tighter policy (higher rates) cools demand to bring inflation down.' },
    { question: 'Most developed-market central banks target inflation around:', options: ['0%', '2%', '10%', '20%'], correct: 'B', explanation: 'A ~2% target is the common benchmark for price stability.' },
    { question: '"Sticky" inflation refers to prices that:', options: ['Fall quickly', 'Are slow to come back down', 'Never change', 'Track oil'], correct: 'B', explanation: 'Services and wages adjust slowly, keeping inflation elevated.' },
  ],

  // ── ASX ──────────────────────────────────────────────────────────────────
  asx101: [
    { question: 'The ASX 200 is weighted by:', options: ['Equal weight', 'Free-float market capitalisation', 'Share price', 'Dividend yield'], correct: 'B', explanation: 'Larger free-float companies have bigger index weights.' },
    { question: 'Relative to global indices, the ASX 200 offers a higher:', options: ['Tech weighting', 'Dividend yield', 'Growth rate', 'Volatility'], correct: 'B', explanation: 'Franking and a value tilt make the ASX a relatively high-yield market.' },
    { question: 'The "Big Four" on the ASX refers to:', options: ['Four miners', 'Four major banks', 'Four retailers', 'Four REITs'], correct: 'B', explanation: 'CBA, NAB, ANZ and Westpac dominate the financials sector.' },
    { question: 'A risk of the ASX 200’s concentration is exposure to:', options: ['Global tech only', 'A combined commodity and housing/credit downturn', 'No sectors', 'Bonds'], correct: 'B', explanation: 'Banks (housing/credit) and miners (commodities) drive much of the index.' },
    { question: 'CSL is a notable ASX constituent because it is a global leader in:', options: ['Iron ore', 'Biotech/healthcare', 'Banking', 'Retail'], correct: 'B', explanation: 'CSL is a rare large-cap ASX growth company in healthcare.' },
  ],
  asx104: [
    { question: 'The key profitability spread for a bank is its:', options: ['Gross margin', 'Net interest margin (NIM)', 'EBITDA margin', 'Dividend yield'], correct: 'B', explanation: 'NIM is the spread between lending and funding rates.' },
    { question: 'A bank’s CET1 ratio measures its:', options: ['Dividend cover', 'Core capital strength vs risk-weighted assets', 'Loan growth', 'NIM'], correct: 'B', explanation: 'Common Equity Tier 1 gauges the capital buffer against losses.' },
    { question: 'Loan-loss provisions rise sharply during:', options: ['Booms', 'Recessions/credit downturns', 'Rate cuts only', 'Buybacks'], correct: 'B', explanation: 'Expected defaults climb in downturns, denting bank profits.' },
    { question: 'Australian bank earnings are tightly linked to the:', options: ['Gold price', 'Housing market and unemployment', 'Oil price', 'US tech sector'], correct: 'B', explanation: 'Mortgages dominate loan books, tying banks to housing and jobs.' },
    { question: 'Banks are typically valued on price-to-book and:', options: ['EV/EBITDA', 'Return on equity', 'EV/Sales', 'PEG'], correct: 'B', explanation: 'P/B paired with ROE is the standard bank valuation lens.' },
  ],

  // ── Fundamentals: advanced ─────────────────────────────────────────────────
  fs205: [
    { question: 'An economic "moat" refers to a company’s:', options: ['Cash balance', 'Durable competitive advantage that protects returns', 'Dividend policy', 'Share price momentum'], correct: 'B', explanation: 'A moat is a structural edge that lets a firm earn excess returns for years.' },
    { question: 'Which is an example of a NETWORK-EFFECT moat?', options: ['A patent on a drug', 'A marketplace that gets more useful as more users join', 'A low-cost mine', 'A strong brand'], correct: 'B', explanation: 'Network effects (e.g. exchanges, social platforms) strengthen with each new user.' },
    { question: 'High customer SWITCHING COSTS create a moat because:', options: ['Prices must be cut', 'Leaving a product is costly or risky, so customers stay', 'The firm has no debt', 'Margins fall'], correct: 'B', explanation: 'Embedded software/ERP systems are painful to replace, locking in revenue.' },
    { question: 'The clearest financial fingerprint of a wide moat is:', options: ['Volatile margins', 'Persistently high ROIC well above the cost of capital', 'High leverage', 'Low gross margin'], correct: 'B', explanation: 'A moat shows up as sustained returns on capital above WACC.' },
    { question: 'A moat is being ERODED when you observe:', options: ['Rising market share', 'Falling returns on capital and new entrants undercutting price', 'Stable pricing power', 'Growing switching costs'], correct: 'B', explanation: 'Declining ROIC and margin compression signal the advantage is weakening.' },
  ],
  fs301: [
    { question: 'WACC is the:', options: ['Cost of equity only', 'Blended after-tax cost of debt and equity, weighted by capital structure', 'Risk-free rate', 'Dividend yield'], correct: 'B', explanation: 'WACC weights each funding source by its share of total capital.' },
    { question: 'The cost of equity is commonly estimated with the:', options: ['Gordon growth model only', 'Capital Asset Pricing Model (CAPM)', 'Current ratio', 'P/E ratio'], correct: 'B', explanation: 'CAPM: Ke = risk-free + beta × equity risk premium.' },
    { question: 'Debt is cheaper than equity in WACC mainly because:', options: ['It never needs repaying', 'Interest is tax-deductible and lenders rank ahead of shareholders', 'It has no risk', 'It pays dividends'], correct: 'B', explanation: 'The tax shield and seniority make debt’s required return lower.' },
    { question: 'In the Gordon growth terminal value, the terminal growth rate should generally not exceed:', options: ['The discount rate', 'Long-run nominal GDP growth', 'Last year’s revenue growth', 'The inflation rate × 5'], correct: 'B', explanation: 'No firm can outgrow the whole economy forever, so g ≈ GDP at most.' },
    { question: 'A terminal value is dangerously sensitive when:', options: ['WACC is far above g', 'The gap between WACC and g is very small', 'Cash flows are negative', 'The firm has no debt'], correct: 'B', explanation: 'TV = CF/(WACC−g); as WACC−g shrinks, the value explodes.' },
  ],
  fs302: [
    { question: 'A reverse DCF solves for the:', options: ['Fair value given assumptions', 'Growth rate the current price already implies', 'Dividend yield', 'Beta'], correct: 'B', explanation: 'It back-solves the expectations baked into today’s price.' },
    { question: 'The main advantage of a reverse DCF is that it:', options: ['Removes all assumptions', 'Frames the question as "is the market’s implied growth achievable?"', 'Guarantees returns', 'Ignores cash flow'], correct: 'B', explanation: 'It tests plausibility rather than inventing a forecast.' },
    { question: 'If a reverse DCF implies 25% growth for 10 years, a value investor should:', options: ['Buy immediately', 'Judge whether that growth is realistic vs history and the market size', 'Ignore it', 'Short it automatically'], correct: 'B', explanation: 'The key is whether the implied expectation is achievable.' },
    { question: 'A stock where the implied growth is LOWER than you expect is potentially:', options: ['Overvalued', 'Undervalued - the market expects too little', 'Fairly valued always', 'A value trap'], correct: 'B', explanation: 'If reality should beat the modest implied growth, there is upside.' },
    { question: 'Reverse DCF is most useful for:', options: ['Cash shells', 'High-multiple growth stocks where expectations are extreme', 'Bonds', 'Index funds'], correct: 'B', explanation: 'It disciplines the optimism embedded in rich growth valuations.' },
  ],
  fs303: [
    { question: 'A classic revenue-recognition red flag is:', options: ['Cash collected before delivery', 'Receivables growing much faster than sales', 'Falling inventory', 'Rising dividends'], correct: 'B', explanation: 'Receivables outpacing revenue can mean sales are booked before cash is real.' },
    { question: 'Channel stuffing inflates current sales by:', options: ['Cutting prices permanently', 'Pushing excess inventory onto distributors to pull forward revenue', 'Raising R&D', 'Buying back shares'], correct: 'B', explanation: 'It borrows from future quarters and often reverses later.' },
    { question: 'A growing gap between net income and operating cash flow over several years suggests:', options: ['Strong earnings quality', 'Possible earnings manipulation or accruals build-up', 'Lower risk', 'Higher dividends'], correct: 'B', explanation: 'Profits that never become cash are a core forensic warning.' },
    { question: 'Frequent "one-off" restructuring charges every year are suspicious because:', options: ['They are truly rare', 'Recurring "non-recurring" items can mask weak core earnings', 'They raise cash', 'They lower debt'], correct: 'B', explanation: 'Serial one-offs flatter "adjusted" earnings versus reality.' },
    { question: 'The Beneish M-score and Altman Z-score are tools used to flag:', options: ['Dividend growth', 'Earnings manipulation and bankruptcy risk', 'Index inclusion', 'Buyback timing'], correct: 'B', explanation: 'They combine ratios to screen for manipulation (M) and distress (Z).' },
  ],
  fs304: [
    { question: 'Sum-of-the-parts (SOTP) valuation values a company by:', options: ['Its total revenue', 'Valuing each division separately and adding them', 'Its share price', 'Its dividend'], correct: 'B', explanation: 'Each segment gets the multiple/method that fits it, then they are summed.' },
    { question: 'SOTP is most useful for:', options: ['Single-product firms', 'Diversified conglomerates with distinct businesses', 'Bonds', 'Pure cash shells'], correct: 'B', explanation: 'It surfaces hidden value when divisions deserve different multiples.' },
    { question: 'A "conglomerate discount" means the market values the whole at:', options: ['More than the sum of parts', 'Less than the sum of its parts', 'Exactly the parts', 'Zero'], correct: 'B', explanation: 'Complexity and poor capital allocation can make the group worth less than its pieces.' },
    { question: 'After summing the parts, you must still:', options: ['Add more revenue', 'Subtract net debt and central/holding-company costs', 'Ignore debt', 'Double the value'], correct: 'B', explanation: 'Equity value = enterprise value of parts − net debt − unallocated costs.' },
    { question: 'SOTP often supports the investment case for:', options: ['A merger', 'A break-up or spin-off to unlock value', 'A buyback only', 'A dividend cut'], correct: 'B', explanation: 'If parts are worth more separately, a spin-off can close the discount.' },
  ],

  // ── Technical analysis ─────────────────────────────────────────────────────
  ta104: [
    { question: 'Rising price on rising volume is generally read as:', options: ['A weak, unconvincing move', 'A strong, confirmed trend', 'A reversal signal', 'Meaningless'], correct: 'B', explanation: 'Volume confirms conviction behind a price move.' },
    { question: 'A price breakout on LOW volume is suspect because:', options: ['It is always real', 'Lack of participation makes a false breakout more likely', 'Volume never matters', 'It guarantees a trend'], correct: 'B', explanation: 'Breakouts need volume to confirm genuine demand/supply.' },
    { question: 'On-Balance Volume (OBV) tries to show whether volume is flowing into or out of a stock by:', options: ['Averaging price', 'Adding volume on up days and subtracting on down days', 'Counting trades', 'Ignoring direction'], correct: 'B', explanation: 'OBV is a running total that hints at accumulation/distribution.' },
    { question: 'Bearish divergence (price up, volume falling) warns that:', options: ['The rally has strong support', 'The advance may be losing momentum', 'Volume is irrelevant', 'A breakout is confirmed'], correct: 'B', explanation: 'Fading volume on new highs signals weakening demand.' },
    { question: 'A volume "climax" spike after a long trend often marks:', options: ['The start of the trend', 'Possible exhaustion and a turning point', 'No information', 'Guaranteed continuation'], correct: 'B', explanation: 'A blow-off in volume can flag capitulation or euphoria near a turn.' },
  ],
  ta203: [
    { question: 'Bollinger Bands are plotted at:', options: ['Fixed dollar amounts', 'A moving average plus/minus a number of standard deviations', 'The 52-week high/low', 'Fibonacci levels'], correct: 'B', explanation: 'Typically a 20-period SMA ± 2 standard deviations.' },
    { question: 'When the bands "squeeze" (narrow), it signals:', options: ['A guaranteed fall', 'Low volatility that often precedes a big move', 'A dividend', 'High volume'], correct: 'B', explanation: 'A squeeze marks compression; expansion (a breakout) often follows.' },
    { question: 'Price touching the upper band means the stock is:', options: ['Always overbought and a sell', 'Relatively high vs recent volatility - context still matters', 'Bankrupt', 'Guaranteed to fall'], correct: 'B', explanation: 'In strong trends price can "ride" the band; it is not an automatic sell.' },
    { question: 'A "band ride" up the upper band during a strong uptrend indicates:', options: ['Weakness', 'Powerful momentum, not necessarily a reversal', 'A squeeze', 'Low volume'], correct: 'B', explanation: 'Persistent tags of the upper band reflect strength.' },
    { question: 'Bollinger Bands are based on which statistical measure of dispersion?', options: ['Mean', 'Standard deviation', 'Median', 'Mode'], correct: 'B', explanation: 'The band width is driven by standard deviation, so they adapt to volatility.' },
  ],
  ta204: [
    { question: 'Fibonacci retracement levels are used to estimate:', options: ['Dividend dates', 'Likely support/resistance where a pullback may pause', 'Earnings', 'Volume'], correct: 'B', explanation: 'Traders watch retracements of a prior move for reaction zones.' },
    { question: 'The most-watched Fibonacci retracement levels include:', options: ['10%, 20%, 30%', '23.6%, 38.2%, 50%, 61.8%', '5%, 15%, 25%', '12%, 24%, 48%'], correct: 'B', explanation: 'These ratios derive from the Fibonacci sequence (50% is a common add-on).' },
    { question: 'The 61.8% level is called the:', options: ['Death cross', 'Golden ratio', 'Pivot point', 'Mean'], correct: 'B', explanation: '0.618 is the golden ratio, a key Fibonacci reaction zone.' },
    { question: 'A pullback that holds the 38.2% retracement suggests:', options: ['A very weak trend', 'A relatively strong trend with shallow profit-taking', 'A reversal', 'No trend'], correct: 'B', explanation: 'Shallow retracements (38.2%) imply strong underlying demand.' },
    { question: 'Fibonacci tools work best when:', options: ['Used alone with no context', 'Combined with other evidence like trend, volume and support/resistance', 'The market is random', 'Applied to a single candle'], correct: 'B', explanation: 'They are confluence tools, strongest alongside other signals.' },
  ],
  ta205: [
    { question: 'A "head and shoulders" top is generally a:', options: ['Bullish continuation', 'Bearish reversal pattern', 'Volume indicator', 'Moving average'], correct: 'B', explanation: 'It signals a potential trend change from up to down.' },
    { question: 'The "neckline" of a head-and-shoulders pattern is important because:', options: ['It sets the dividend', 'A break below it confirms the pattern and projects a target', 'It marks the high', 'It is irrelevant'], correct: 'B', explanation: 'The breakdown through the neckline triggers the pattern.' },
    { question: 'Ascending triangles are typically resolved with a:', options: ['Downside break', 'Upside breakout (bullish bias)', 'Dividend', 'Gap down'], correct: 'B', explanation: 'Rising lows into flat resistance often break upward.' },
    { question: 'A "cup and handle" is usually a:', options: ['Bearish top', 'Bullish continuation pattern', 'Reversal only', 'Volume spike'], correct: 'B', explanation: 'A rounded base then a small pullback (handle) precedes a breakout.' },
    { question: 'The most reliable chart-pattern breakouts are accompanied by:', options: ['Falling volume', 'A clear expansion in volume', 'No volume', 'A dividend cut'], correct: 'B', explanation: 'Volume confirmation reduces the odds of a false breakout.' },
  ],
  ta301: [
    { question: 'Elliott Wave theory proposes that trends move in:', options: ['Random walks', 'A 5-wave impulse followed by a 3-wave correction', 'Straight lines', '2 waves only'], correct: 'B', explanation: 'The core pattern is 5 waves with the trend, 3 against it.' },
    { question: 'In a 5-wave impulse, waves 1, 3 and 5 are:', options: ['Corrective', 'In the direction of the main trend', 'Always equal', 'Sideways'], correct: 'B', explanation: 'Odd waves move with the trend; waves 2 and 4 correct.' },
    { question: 'A common Elliott guideline is that wave 3 is usually:', options: ['The shortest', 'Often the longest and never the shortest of 1/3/5', 'Always 50%', 'Flat'], correct: 'B', explanation: 'Wave 3 is typically the strongest and is never the shortest impulse wave.' },
    { question: 'A major criticism of Elliott Wave analysis is that it is:', options: ['Fully objective', 'Highly subjective - counts can be redrawn after the fact', 'Based on earnings', 'Volume-only'], correct: 'B', explanation: 'Wave counts are interpretive, making it hard to falsify in real time.' },
    { question: 'Elliott Wave often overlaps with which other tool for targets?', options: ['P/E ratios', 'Fibonacci ratios', 'Dividend yield', 'Beta'], correct: 'B', explanation: 'Fibonacci relationships are used to project wave lengths and retracements.' },
  ],
  ta302: [
    { question: 'The Wyckoff method focuses on the interaction between:', options: ['Dividends and buybacks', 'Price, volume and the actions of large operators ("smart money")', 'Taxes and rates', 'Earnings and P/E'], correct: 'B', explanation: 'Wyckoff reads supply/demand left by big institutions.' },
    { question: 'A Wyckoff "accumulation" phase is where:', options: ['Smart money distributes to the public', 'Large players quietly build positions in a range before a markup', 'Prices trend straight up', 'Volume disappears'], correct: 'B', explanation: 'Accumulation precedes the markup (uptrend) phase.' },
    { question: 'The four Wyckoff market phases are accumulation, markup, distribution and:', options: ['Dividend', 'Markdown', 'Squeeze', 'Split'], correct: 'B', explanation: 'Markdown is the downtrend after distribution.' },
    { question: 'A "spring" in Wyckoff analysis is a:', options: ['Dividend event', 'False breakdown below support that shakes out weak holders before a rally', 'Volume gap', 'Moving average'], correct: 'B', explanation: 'The spring traps sellers then reverses up, signalling accumulation is ending.' },
    { question: 'Wyckoff’s "law of effort vs result" compares:', options: ['Price to earnings', 'Volume (effort) against the resulting price move', 'Debt to equity', 'Beta to alpha'], correct: 'B', explanation: 'Big volume with little price progress warns of a coming turn.' },
  ],
  ta303: [
    { question: 'Unusually high options volume in out-of-the-money calls can signal:', options: ['Guaranteed losses', 'Speculative bullish positioning or informed buying', 'A dividend', 'A stock split'], correct: 'B', explanation: 'Spikes in OTM call activity are watched as a sentiment/positioning clue.' },
    { question: '"Dark pools" are:', options: ['Illegal exchanges', 'Private venues where large blocks trade away from public order books', 'Crypto wallets', 'Retail brokers'], correct: 'B', explanation: 'They let institutions trade size without moving the lit market.' },
    { question: 'The put/call ratio is used as a:', options: ['Valuation multiple', 'Contrarian sentiment gauge', 'Dividend metric', 'Leverage ratio'], correct: 'B', explanation: 'Extreme readings can signal over-bearishness or over-bullishness.' },
    { question: 'A key limitation of reading options/dark-pool "flow" is that:', options: ['It is always predictive', 'Much of it is hedging, not directional bets, so it can mislead', 'It is free of noise', 'It shows earnings'], correct: 'B', explanation: 'Flow can be hedges or arbitrage, not a clean view of conviction.' },
    { question: 'Gamma exposure ("GEX") matters because dealer hedging can:', options: ['Set dividends', 'Amplify or dampen intraday volatility near key strikes', 'Change earnings', 'Fix interest rates'], correct: 'B', explanation: 'Dealers hedging large positions can pin or accelerate price moves.' },
  ],

  // ── Macro ──────────────────────────────────────────────────────────────────
  ma103: [
    { question: 'Early in an economic recovery, which sectors typically lead?', options: ['Utilities and staples', 'Cyclicals like financials, consumer discretionary and industrials', 'Only bonds', 'Cash'], correct: 'B', explanation: 'Rate-sensitive cyclicals tend to outperform as growth turns up.' },
    { question: 'Defensive sectors (utilities, staples, healthcare) tend to outperform during:', options: ['Booms', 'Late-cycle slowdowns and recessions', 'Early recovery', 'Rate cuts only'], correct: 'B', explanation: 'Stable demand makes defensives relatively resilient in downturns.' },
    { question: 'Sector rotation is the practice of:', options: ['Holding one stock forever', 'Shifting weightings between sectors as the cycle changes', 'Avoiding equities', 'Day trading only'], correct: 'B', explanation: 'Different sectors lead at different points in the cycle.' },
    { question: 'GDP measures the:', options: ['Total value of goods and services produced in an economy', 'Stock market level', 'Government debt', 'Inflation rate'], correct: 'A', explanation: 'GDP is the headline gauge of economic output.' },
    { question: 'Energy and materials often peak:', options: ['Early in recovery', 'Late-cycle as inflation and demand run hot', 'During recessions', 'Never'], correct: 'B', explanation: 'Commodity-linked sectors typically lead late in the expansion.' },
  ],
  ma201: [
    { question: 'An inverted yield curve (short rates above long rates) has historically been a:', options: ['Reliable bullish signal', 'Warning sign that often precedes recessions', 'Dividend indicator', 'Random event'], correct: 'B', explanation: 'Inversions have led most modern US recessions by months to a year+.' },
    { question: 'The yield curve plots:', options: ['Stock prices over time', 'Bond yields against their maturities', 'Inflation vs GDP', 'P/E vs growth'], correct: 'B', explanation: 'It shows yields from short to long maturities.' },
    { question: 'A "steepening" curve (long rates rising faster) often signals expectations of:', options: ['Recession', 'Stronger growth and/or higher future inflation', 'Deflation only', 'A market crash'], correct: 'B', explanation: 'Bull steepeners/steepening can reflect reflation and recovery hopes.' },
    { question: 'The commonly watched US recession-signal spread is the:', options: ['2-year vs 10-year Treasury yield', 'Fed funds vs dividend yield', 'CPI vs PPI', 'VIX vs S&P'], correct: 'A', explanation: 'The 2s10s spread is the classic inversion gauge.' },
    { question: 'Why might the curve invert? Markets expect the central bank to:', options: ['Hike forever', 'Cut rates in the future as growth slows', 'Pay dividends', 'Buy stocks'], correct: 'B', explanation: 'Expected future cuts pull long yields below high short rates.' },
  ],
  ma202: [
    { question: 'The RBA’s primary policy tool is the:', options: ['Company tax rate', 'Cash rate', 'Franking system', 'GST'], correct: 'B', explanation: 'The Reserve Bank of Australia sets the official cash rate.' },
    { question: 'When the RBA RAISES the cash rate, the typical effect on the ASX is:', options: ['Always positive', 'A headwind, especially for rate-sensitive sectors like REITs', 'No effect', 'Higher dividends only'], correct: 'B', explanation: 'Higher rates lift discount rates and borrowing costs, pressuring valuations.' },
    { question: 'Australian banks’ net interest margins are sensitive to:', options: ['Gold prices', 'The cash rate and funding costs', 'US tech earnings', 'The AUD only'], correct: 'B', explanation: 'Rate moves reprice loans and deposits, shifting NIM.' },
    { question: 'The RBA’s inflation target band is:', options: ['0–1%', '2–3% over the cycle', '5–6%', '10%+'], correct: 'B', explanation: 'The RBA aims to keep CPI inflation between 2 and 3% on average.' },
    { question: 'Rate-sensitive ASX sectors that usually react most to RBA moves include:', options: ['Pure gold miners', 'REITs, banks and highly indebted/long-duration growth names', 'Defensive staples only', 'Cash holdings'], correct: 'B', explanation: 'Property trusts and leveraged/growth stocks are most rate-sensitive.' },
  ],
  ma203: [
    { question: 'A FALLING Australian dollar generally benefits:', options: ['Importers', 'Exporters and offshore-earners (more AUD per foreign dollar)', 'Domestic-only retailers', 'Bond holders only'], correct: 'B', explanation: 'A weaker AUD lifts the local-currency value of foreign revenue.' },
    { question: 'For an unhedged Australian investor, a falling AUD makes US share holdings:', options: ['Worth less in AUD', 'Worth more in AUD terms', 'Unchanged', 'Tax-free'], correct: 'B', explanation: 'Foreign assets gain in AUD when the local currency weakens.' },
    { question: 'The AUD is often described as a "commodity currency" because it tracks:', options: ['US tech', 'Iron ore and other key export commodity prices', 'Gold only', 'Bitcoin'], correct: 'B', explanation: 'Australia’s terms of trade drive much of the AUD’s value.' },
    { question: 'Currency hedging is used by investors to:', options: ['Increase FX exposure', 'Remove or reduce the impact of exchange-rate moves on returns', 'Raise dividends', 'Avoid tax'], correct: 'B', explanation: 'Hedging isolates the asset return from currency swings.' },
    { question: 'A rising AUD is a headwind for:', options: ['Importers', 'Resource exporters whose USD revenue converts to fewer AUD', 'Domestic banks only', 'Cash'], correct: 'B', explanation: 'A strong AUD shrinks the AUD value of USD-denominated export sales.' },
  ],
  ma204: [
    { question: 'A supply shock that cuts global oil output typically causes oil prices to:', options: ['Fall', 'Rise', 'Stay flat', 'Go to zero'], correct: 'B', explanation: 'Less supply at similar demand pushes prices up.' },
    { question: 'Gold often performs well during:', options: ['Calm bull markets only', 'Geopolitical stress and times of uncertainty', 'Strong-dollar booms', 'Rate hikes only'], correct: 'B', explanation: 'Gold is a traditional safe-haven in crises.' },
    { question: 'Geopolitical conflict in a major commodity-producing region usually raises:', options: ['Nothing', 'Risk premia and prices for the affected commodities', 'Dividends', 'Bond prices only'], correct: 'B', explanation: 'Supply-disruption fears lift commodity risk premiums.' },
    { question: 'For the ASX, higher commodity prices are broadly:', options: ['Always bad', 'Often supportive, given the heavy resources weighting', 'Irrelevant', 'Only good for banks'], correct: 'B', explanation: 'Miners and energy names are a big share of the index.' },
    { question: 'A key risk of investing on geopolitical themes is that:', options: ['Outcomes are certain', 'Events are hard to predict and often already priced in', 'There is no volatility', 'Commodities never move'], correct: 'B', explanation: 'Markets price expectations fast, so reacting late can hurt.' },
  ],
  ma301: [
    { question: 'Global capital tends to flow TOWARD markets offering:', options: ['Lower returns and higher risk', 'Higher risk-adjusted returns and stability', 'No liquidity', 'Capital controls'], correct: 'B', explanation: 'Capital chases attractive, stable risk-adjusted returns.' },
    { question: 'When US interest rates rise sharply, emerging-market capital often:', options: ['Flows in', 'Flows out toward higher US yields', 'Stays put', 'Disappears'], correct: 'B', explanation: 'Higher US yields and a stronger dollar can drain EM flows.' },
    { question: 'A stronger US dollar tends to:', options: ['Help all emerging markets', 'Pressure emerging markets with USD-denominated debt', 'Lower US rates', 'Raise gold always'], correct: 'B', explanation: 'USD debt gets harder to service as the dollar rises.' },
    { question: '"Risk-on" capital flows favour:', options: ['Cash and government bonds', 'Equities, credit and higher-yielding/EM assets', 'Only gold', 'Nothing'], correct: 'B', explanation: 'In risk-on regimes investors reach for return; risk-off reverses it.' },
    { question: 'For Australia, foreign capital flows matter because they help fund the:', options: ['Budget surplus always', 'Current account deficit and asset markets', 'Franking system', 'Cash rate'], correct: 'B', explanation: 'Australia is a net capital importer, so flows affect the AUD and asset prices.' },
  ],
  ma302: [
    { question: 'Quantitative easing (QE) is when a central bank:', options: ['Raises rates', 'Buys bonds to inject liquidity and lower long-term yields', 'Sells all assets', 'Cuts taxes'], correct: 'B', explanation: 'QE expands the balance sheet to ease financial conditions.' },
    { question: 'Quantitative tightening (QT) does the opposite by:', options: ['Buying more bonds', 'Shrinking the balance sheet / draining liquidity', 'Cutting rates', 'Printing money'], correct: 'B', explanation: 'QT withdraws liquidity, tending to tighten conditions.' },
    { question: 'QE generally supports asset prices because it:', options: ['Raises discount rates', 'Lowers yields and pushes investors toward riskier assets', 'Cuts earnings', 'Reduces liquidity'], correct: 'B', explanation: 'Lower safe yields drive a "reach for yield" into equities/credit.' },
    { question: 'A common criticism of prolonged QE is that it can:', options: ['Eliminate risk', 'Inflate asset bubbles and widen wealth inequality', 'Lower all prices', 'Fix productivity'], correct: 'B', explanation: 'Cheap money can distort valuations and reward asset owners.' },
    { question: 'During QT, long-duration and speculative assets often:', options: ['Outperform strongly', 'Come under pressure as liquidity is withdrawn', 'Are unaffected', 'Pay higher dividends'], correct: 'B', explanation: 'Tighter liquidity hits the most rate-sensitive, speculative names hardest.' },
  ],
  ma303: [
    { question: 'A top-down investment framework starts from:', options: ['A single stock’s footnotes', 'The macro picture, then sectors, then individual stocks', 'Only technicals', 'Insider trades'], correct: 'B', explanation: 'Top-down moves macro → sector → security.' },
    { question: 'Top-down differs from bottom-up because bottom-up starts with:', options: ['The economy', 'Individual company fundamentals regardless of macro', 'Currencies', 'The yield curve'], correct: 'B', explanation: 'Bottom-up prioritises company-specific analysis first.' },
    { question: 'In a top-down process, the macro view mainly informs:', options: ['The company’s logo', 'Asset allocation and sector tilts', 'Dividend dates', 'Ticker symbols'], correct: 'B', explanation: 'Macro shapes how much to allocate to regions, sectors and asset classes.' },
    { question: 'A strength of top-down investing is that it:', options: ['Ignores risk', 'Aligns positioning with the prevailing economic regime', 'Guarantees gains', 'Avoids all analysis'], correct: 'B', explanation: 'It helps avoid fighting the macro tide.' },
    { question: 'A weakness of a purely top-down approach is that it can:', options: ['Be too detailed on companies', 'Miss great individual companies that defy the macro backdrop', 'Never be wrong', 'Ignore the economy'], correct: 'B', explanation: 'Strong stock-pickers can be missed if macro screens are too rigid.' },
  ],

  // ── ASX-specific ───────────────────────────────────────────────────────────
  asx102: [
    { question: 'Franking credits represent:', options: ['A government grant', 'Company tax already paid, passed to shareholders to avoid double taxation', 'A capital gain', 'A brokerage fee'], correct: 'B', explanation: 'Imputation credits the corporate tax already paid on the dividend.' },
    { question: 'A "fully franked" dividend means:', options: ['No tax was paid by the company', 'Company tax has been paid on all of the profit distributed', 'It is tax-free overseas', 'It includes no cash'], correct: 'B', explanation: 'Full franking carries credits for the full 30% company tax.' },
    { question: 'Dividend imputation exists to prevent:', options: ['Inflation', 'Double taxation of company profits at both corporate and shareholder level', 'Capital gains', 'Short selling'], correct: 'B', explanation: 'It ensures profit is effectively taxed once, at the investor’s rate.' },
    { question: 'For a low-tax-rate Australian investor, franking credits can:', options: ['Always be ignored', 'Produce a tax refund if credits exceed tax owed', 'Increase company tax', 'Reduce the dividend'], correct: 'B', explanation: 'Excess refundable franking credits can be returned as cash.' },
    { question: 'The "grossed-up" dividend yield includes:', options: ['Only the cash dividend', 'The cash dividend plus attached franking credits', 'Capital gains', 'Brokerage'], correct: 'B', explanation: 'Grossing up reflects the pre-tax value of a franked dividend.' },
  ],
  asx103: [
    { question: 'Australian resource companies’ earnings are most driven by:', options: ['Domestic retail spending', 'Global commodity prices and volumes', 'Franking credits', 'Local interest rates only'], correct: 'B', explanation: 'Miners are price-takers tied to global commodity markets.' },
    { question: 'Commodity cycles are driven heavily by demand from:', options: ['Australia alone', 'Large consumers like China and global industrial activity', 'Retail investors', 'Banks'], correct: 'B', explanation: 'China’s construction/industrial demand is pivotal for iron ore etc.' },
    { question: 'Low-cost producers are advantaged in commodity downturns because they:', options: ['Have the highest costs', 'Stay profitable at prices that push high-cost rivals into losses', 'Pay no tax', 'Avoid volatility'], correct: 'B', explanation: 'A low position on the cost curve survives low-price periods.' },
    { question: 'A key valuation metric for miners is the:', options: ['P/E only', 'All-in sustaining cost (AISC) versus the commodity price', 'Dividend cover only', 'PEG ratio'], correct: 'B', explanation: 'AISC vs price shows the margin and downside resilience.' },
    { question: 'Resource earnings are highly cyclical, so a very LOW trailing P/E often occurs:', options: ['At the bottom of the cycle', 'At the top of the cycle when earnings are about to fall', 'Randomly', 'Only in recessions'], correct: 'B', explanation: 'Peak-earnings + low P/E is a classic cyclical value trap.' },
  ],
  asx105: [
    { question: 'For an Australian REIT (A-REIT), "NTA" stands for:', options: ['Net Trading Account', 'Net Tangible Assets per security', 'New Tenant Agreement', 'Notional Total Assets'], correct: 'B', explanation: 'NTA is the underlying property-backed asset value per unit.' },
    { question: 'A "cap rate" (capitalisation rate) is:', options: ['The interest rate on debt', 'Net property income ÷ property value', 'The dividend yield', 'The franking rate'], correct: 'B', explanation: 'Cap rate = NOI/value; lower cap rates imply higher valuations.' },
    { question: 'When market cap rates RISE, property values generally:', options: ['Rise', 'Fall', 'Stay flat', 'Double'], correct: 'B', explanation: 'Value = income/cap rate, so higher cap rates cut valuations.' },
    { question: 'A REIT trading at a large DISCOUNT to NTA may indicate:', options: ['Guaranteed bargain', 'Market expects asset values to fall or distrust of the book valuation', 'No information', 'A franking credit'], correct: 'B', explanation: 'Discounts can flag expected write-downs or sector stress.' },
    { question: 'A-REIT distributions and valuations are especially sensitive to:', options: ['Gold prices', 'Interest rates and bond yields', 'US tech earnings', 'The GST'], correct: 'B', explanation: 'As income vehicles, REITs are highly rate-sensitive.' },
  ],
  asx106: [
    { question: 'ASX small-caps (outside the ASX 100) typically offer:', options: ['Lower risk and lower return', 'Higher growth potential but higher risk and lower liquidity', 'Guaranteed dividends', 'No volatility'], correct: 'B', explanation: 'Smaller companies can grow fast but are riskier and thinly traded.' },
    { question: 'A key risk specific to small-cap investing is:', options: ['Too much analyst coverage', 'Low liquidity and wide bid-ask spreads', 'Excessive regulation', 'Guaranteed profits'], correct: 'B', explanation: 'Thin trading makes entering/exiting positions costly.' },
    { question: 'Small-caps can be "under-researched", which means:', options: ['No opportunity exists', 'Mispricings are more likely, rewarding diligent investors', 'They are always overvalued', 'They never move'], correct: 'B', explanation: 'Less analyst coverage can create inefficiencies to exploit.' },
    { question: 'Many speculative ASX small-caps (e.g. junior explorers) are:', options: ['Profitable and stable', 'Pre-revenue and reliant on raising capital', 'Large dividend payers', 'Index heavyweights'], correct: 'B', explanation: 'Early-stage miners/biotechs often burn cash and dilute holders.' },
    { question: 'Capital raisings by small-caps often cause:', options: ['No effect', 'Dilution of existing shareholders', 'Higher EPS automatically', 'A franking credit'], correct: 'B', explanation: 'Issuing new shares to fund operations dilutes ownership.' },
  ],

  // ── Valuation models ───────────────────────────────────────────────────────
  vm201: [
    { question: 'A leveraged buyout (LBO) acquires a company using:', options: ['Only equity', 'A large amount of debt secured against the target', 'No financing', 'Government grants'], correct: 'B', explanation: 'LBOs use heavy debt, repaid from the target’s cash flows.' },
    { question: 'LBO returns are driven primarily by debt paydown, multiple expansion and:', options: ['Dividend cuts', 'EBITDA/operational growth', 'Share splits', 'Franking credits'], correct: 'B', explanation: 'Growing EBITDA, deleveraging and exit-multiple gains drive IRR.' },
    { question: 'The ideal LBO target has:', options: ['Volatile cash flows and high capex', 'Stable, predictable cash flows able to service debt', 'No assets', 'Negative margins'], correct: 'B', explanation: 'Steady cash flow supports the leverage used in the deal.' },
    { question: 'In an LBO, using more debt (leverage) tends to:', options: ['Lower equity returns', 'Amplify equity returns - and risk', 'Remove all risk', 'Reduce IRR always'], correct: 'B', explanation: 'Leverage magnifies both gains and losses on the equity slice.' },
    { question: 'The sponsor’s equity return in an LBO is usually measured by:', options: ['Dividend yield', 'IRR and the money multiple (MOIC) at exit', 'P/B', 'Beta'], correct: 'B', explanation: 'Private equity targets a hurdle IRR / MOIC over the hold period.' },
  ],
  vm202: [
    { question: 'Net Asset Value (NAV) valuation for a resource company sums the value of its:', options: ['Brand only', 'Producing and development assets (reserves) less net debt', 'Dividends', 'Office buildings only'], correct: 'B', explanation: 'NAV discounts the cash flows from each asset/reserve, net of debt.' },
    { question: 'A resource NAV is highly sensitive to assumptions about:', options: ['The CEO’s salary', 'Long-run commodity prices and the discount rate', 'The logo', 'Office rent'], correct: 'B', explanation: 'Price decks and discount rates swing asset cash-flow values widely.' },
    { question: 'A miner trading BELOW 1.0× P/NAV may be:', options: ['Always overvalued', 'Potentially cheap, if the NAV assumptions are sound', 'Debt-free always', 'A REIT'], correct: 'B', explanation: 'P/NAV < 1 can flag value, but only if the price deck is credible.' },
    { question: '"Reserves" differ from "resources" in that reserves are:', options: ['Less certain', 'The economically mineable portion proven to a higher confidence', 'Always larger', 'Non-physical'], correct: 'B', explanation: 'Reserves meet stricter economic and geological confidence tests.' },
    { question: 'NAV is generally preferred over P/E for miners because earnings are:', options: ['Always stable', 'Distorted by the commodity cycle and finite asset lives', 'Tax-free', 'Irrelevant'], correct: 'B', explanation: 'Asset-based NAV handles depleting reserves and cyclicality better.' },
  ],
  vm203: [
    { question: 'A complete investment thesis should clearly state the:', options: ['Stock’s logo', 'Reasons to own it, the valuation, catalysts and key risks', 'Only the ticker', 'Yesterday’s price'], correct: 'B', explanation: 'A thesis articulates why, how much it’s worth, and what could go wrong.' },
    { question: 'A "variant perception" in a thesis is:', options: ['The consensus view', 'A well-supported view that differs from the market’s', 'A chart pattern', 'A dividend'], correct: 'B', explanation: 'Edge comes from a differentiated, defensible view vs consensus.' },
    { question: 'Identifying "catalysts" matters because they:', options: ['Are decoration', 'Are events that could close the gap between price and value', 'Set the dividend', 'Replace valuation'], correct: 'B', explanation: 'Catalysts (earnings, spin-offs, approvals) help value get recognised.' },
    { question: 'A "pre-mortem" in thesis-building asks:', options: ['How great the upside is', 'What would have to be true for the thesis to FAIL', 'The CEO’s salary', 'The ticker'], correct: 'B', explanation: 'Imagining failure surfaces risks and disconfirming evidence early.' },
    { question: 'Position sizing in a thesis should reflect:', options: ['Excitement only', 'Conviction and the risk/downside, not just upside', 'The logo', 'Random choice'], correct: 'B', explanation: 'Size to the risk-adjusted edge and the potential loss, not hype.' },
  ],
}

export default EXTRA_QUIZ
