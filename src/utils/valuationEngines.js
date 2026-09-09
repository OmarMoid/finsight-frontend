// ============================================================================
// FinSight Valuation Engines — pure JavaScript math, no API calls.
// ============================================================================

// ── DCF ENGINE ───────────────────────────────────────────────────────────

export function calculateDCF(inputs) {
  const {
    lastRevenue,
    revenueGrowth1to3,
    revenueGrowth4to5,
    ebitMargin,
    taxRate,
    daPercent,
    capexPercent,
    nwcPercent,
    wacc,
    terminalGrowthRate,
    terminalMethod = 'gordon',
    terminalMultiple = 10,
    netDebt = 0,
    sharesOutstanding,
  } = inputs

  const projectedFCFs = []
  let prevRevenue = lastRevenue
  let pvFCFs = 0

  for (let year = 1; year <= 5; year++) {
    const growth = year <= 3 ? revenueGrowth1to3 : revenueGrowth4to5
    const revenue = prevRevenue * (1 + growth)
    const ebit = revenue * ebitMargin
    const nopat = ebit * (1 - taxRate)
    const da = revenue * daPercent
    const capex = revenue * capexPercent
    // Incremental net working capital investment (cash outflow when revenue grows)
    const nwc = (revenue - prevRevenue) * nwcPercent
    const fcf = nopat + da - capex - nwc
    const pvFCF = fcf / Math.pow(1 + wacc, year)

    projectedFCFs.push({ year, revenue, ebit, nopat, da, capex, nwc, fcf, pvFCF })
    pvFCFs += pvFCF
    prevRevenue = revenue
  }

  const finalYear = projectedFCFs[projectedFCFs.length - 1]

  let terminalValue
  if (terminalMethod === 'multiple') {
    // EV/EBITDA exit multiple applied to terminal-year EBITDA
    const terminalEBITDA = finalYear.ebit + finalYear.da
    terminalValue = terminalEBITDA * terminalMultiple
  } else {
    // Gordon Growth on terminal-year FCF
    terminalValue = (finalYear.fcf * (1 + terminalGrowthRate)) / (wacc - terminalGrowthRate)
  }

  const pvTerminalValue = terminalValue / Math.pow(1 + wacc, 5)
  const enterpriseValue = pvFCFs + pvTerminalValue
  const equityValue = enterpriseValue - netDebt
  const fairValuePerShare = sharesOutstanding ? equityValue / sharesOutstanding : 0
  const terminalValuePercent = enterpriseValue ? (pvTerminalValue / enterpriseValue) * 100 : 0

  return {
    projectedFCFs,
    pvFCFs,
    terminalValue,
    pvTerminalValue,
    enterpriseValue,
    equityValue,
    fairValuePerShare,
    terminalValuePercent,
  }
}

// ── WACC CALCULATOR ────────────────────────────────────────────────────────

export function calculateWACC(inputs) {
  const {
    riskFreeRate,
    equityRiskPremium,
    beta,
    preTaxCostOfDebt,
    taxRate,
    debtWeight,
    equityWeight,
  } = inputs

  const costOfEquity = riskFreeRate + beta * equityRiskPremium
  const afterTaxCostOfDebt = preTaxCostOfDebt * (1 - taxRate)
  const wacc = equityWeight * costOfEquity + debtWeight * afterTaxCostOfDebt

  const pct = (x) => (x * 100).toFixed(2) + '%'

  return {
    costOfEquity,
    afterTaxCostOfDebt,
    wacc,
    costOfEquityFormula: `Ke = ${pct(riskFreeRate)} + ${beta.toFixed(2)} × ${pct(equityRiskPremium)} = ${pct(costOfEquity)}`,
    waccFormula: `WACC = ${pct(equityWeight)} × ${pct(costOfEquity)} + ${pct(debtWeight)} × ${pct(afterTaxCostOfDebt)} = ${pct(wacc)}`,
  }
}

// ── SENSITIVITY TABLE ──────────────────────────────────────────────────────

export function buildSensitivityTable(baseInputs, waccRange, tgrRange) {
  return waccRange.map((wacc) =>
    tgrRange.map((tgr) => {
      const result = calculateDCF({
        ...baseInputs,
        wacc,
        terminalGrowthRate: tgr,
        terminalMethod: 'gordon',
      })
      return result.fairValuePerShare
    })
  )
}

// ── MONTE CARLO ENGINE ───────────────────────────────────────────────────

export function sampleTriangular(min, mode, max) {
  // Guard against unordered inputs (e.g. WACC bear > bull).
  const lo = Math.min(min, max)
  const hi = Math.max(min, max)
  const m = Math.min(Math.max(mode, lo), hi)

  if (hi === lo) return lo

  const u = Math.random()
  const fc = (m - lo) / (hi - lo)
  if (u < fc) {
    return lo + Math.sqrt(u * (hi - lo) * (m - lo))
  }
  return hi - Math.sqrt((1 - u) * (hi - lo) * (hi - m))
}

export function runMonteCarlo(inputs, numSimulations = 5000) {
  const { revenueGrowth1, revenueGrowth2, ebitMargin, wacc, terminalGrowthRate, fixed } = inputs
  const currentPrice = inputs.currentPrice ?? fixed?.currentPrice ?? null

  const results = []
  for (let i = 0; i < numSimulations; i++) {
    const g1 = sampleTriangular(revenueGrowth1.bear, revenueGrowth1.base, revenueGrowth1.bull)
    const g2 = sampleTriangular(revenueGrowth2.bear, revenueGrowth2.base, revenueGrowth2.bull)
    const margin = sampleTriangular(ebitMargin.bear, ebitMargin.base, ebitMargin.bull)
    const w = sampleTriangular(wacc.bear, wacc.base, wacc.bull)
    const tgr = sampleTriangular(terminalGrowthRate.bear, terminalGrowthRate.base, terminalGrowthRate.bull)

    // Skip degenerate draws where Gordon Growth is invalid.
    if (w <= tgr) continue

    const dcf = calculateDCF({
      lastRevenue: fixed.lastRevenue,
      revenueGrowth1to3: g1,
      revenueGrowth4to5: g2,
      ebitMargin: margin,
      taxRate: fixed.taxRate,
      daPercent: fixed.daPercent,
      capexPercent: fixed.capexPercent,
      nwcPercent: fixed.nwcPercent,
      wacc: w,
      terminalGrowthRate: tgr,
      terminalMethod: 'gordon',
      netDebt: fixed.netDebt,
      sharesOutstanding: fixed.sharesOutstanding,
    })
    if (isFinite(dcf.fairValuePerShare)) results.push(dcf.fairValuePerShare)
  }

  results.sort((a, b) => a - b)
  const n = results.length

  const percentile = (p) => {
    if (n === 0) return null
    const idx = Math.min(n - 1, Math.max(0, Math.floor((p / 100) * n)))
    return results[idx]
  }

  const mean = n ? results.reduce((s, x) => s + x, 0) / n : 0
  const variance = n ? results.reduce((s, x) => s + (x - mean) ** 2, 0) / n : 0
  const stdDev = Math.sqrt(variance)
  const skewness =
    n && stdDev > 0
      ? results.reduce((s, x) => s + ((x - mean) / stdDev) ** 3, 0) / n
      : 0

  const probabilityUndervalued =
    currentPrice && n
      ? (results.filter((x) => x > currentPrice).length / n) * 100
      : null

  // Build histogram (~30 buckets).
  const histogram = []
  if (n > 0) {
    const lo = results[0]
    const hi = results[n - 1]
    const numBuckets = 30
    const width = (hi - lo) / numBuckets || 1
    for (let b = 0; b < numBuckets; b++) {
      const bucketLo = lo + b * width
      const bucketHi = bucketLo + width
      const count = results.filter(
        (x) => x >= bucketLo && (b === numBuckets - 1 ? x <= bucketHi : x < bucketHi)
      ).length
      histogram.push({ bucket: bucketLo + width / 2, count })
    }
  }

  return {
    results,
    p5: percentile(5),
    p25: percentile(25),
    p50: percentile(50),
    p75: percentile(75),
    p95: percentile(95),
    mean,
    stdDev,
    skewness,
    probabilityUndervalued,
    histogram,
  }
}

// ── DDM ENGINE ─────────────────────────────────────────────────────────────

export function calculateGordonGrowthDDM(d0, g, ke) {
  const d1 = d0 * (1 + g)
  const intrinsicValue = ke > g ? d1 / (ke - g) : Infinity
  return {
    d1,
    intrinsicValue,
    formula: `V = D₁ / (Ke − g) = ${d1.toFixed(2)} / (${(ke * 100).toFixed(2)}% − ${(g * 100).toFixed(2)}%) = ${isFinite(intrinsicValue) ? intrinsicValue.toFixed(2) : '∞'}`,
  }
}

export function calculateTwoStageDDM(d0, g1, years1, g2, ke) {
  const dividendSchedule = []
  let pvPhase1 = 0
  let dividend = d0

  for (let year = 1; year <= years1; year++) {
    dividend = dividend * (1 + g1)
    const pv = dividend / Math.pow(1 + ke, year)
    dividendSchedule.push({ year, dividend, pv })
    pvPhase1 += pv
  }

  // Terminal value at end of phase 1 (Gordon Growth on first stable dividend).
  const terminalDividend = dividend * (1 + g2)
  const terminalValue = ke > g2 ? terminalDividend / (ke - g2) : Infinity
  const pvTerminalValue = isFinite(terminalValue)
    ? terminalValue / Math.pow(1 + ke, years1)
    : Infinity

  const intrinsicValue = pvPhase1 + pvTerminalValue

  return { dividendSchedule, pvPhase1, terminalValue, pvTerminalValue, intrinsicValue }
}

export function calculateThreeStageDDM(d0, g1, years1, g2, years2, g3, ke) {
  const dividendSchedule = []
  let pvHighGrowth = 0
  let pvTransition = 0
  let dividend = d0
  let year = 0

  // Stage 1: high growth
  for (let i = 0; i < years1; i++) {
    year++
    dividend = dividend * (1 + g1)
    const pv = dividend / Math.pow(1 + ke, year)
    dividendSchedule.push({ year, dividend, pv, phase: 'high-growth' })
    pvHighGrowth += pv
  }

  // Stage 2: transition (constant g2)
  for (let i = 0; i < years2; i++) {
    year++
    dividend = dividend * (1 + g2)
    const pv = dividend / Math.pow(1 + ke, year)
    dividendSchedule.push({ year, dividend, pv, phase: 'transition' })
    pvTransition += pv
  }

  // Stage 3: terminal (Gordon Growth on first terminal dividend)
  const terminalDividend = dividend * (1 + g3)
  const terminalValue = ke > g3 ? terminalDividend / (ke - g3) : Infinity
  const pvTerminalValue = isFinite(terminalValue)
    ? terminalValue / Math.pow(1 + ke, year)
    : Infinity

  const intrinsicValue = pvHighGrowth + pvTransition + pvTerminalValue

  return {
    dividendSchedule,
    pvHighGrowth,
    pvTransition,
    terminalValue,
    pvTerminalValue,
    intrinsicValue,
  }
}

export function calculateFrankingAdjustedYield(dividend, frankingPercent, corporateTaxRate = 0.3) {
  // Accept franking as either a fraction (0–1) or a percentage (0–100).
  const frankingPct = frankingPercent > 1 ? frankingPercent / 100 : frankingPercent
  const frankingCredit = dividend * frankingPct * (corporateTaxRate / (1 - corporateTaxRate))
  const grossedUpDividend = dividend + frankingCredit
  // Gross-up uplift factor (grossed-up dividend relative to the cash dividend).
  const effectiveYield = dividend ? grossedUpDividend / dividend : 0
  return { grossedUpDividend, frankingCredit, effectiveYield }
}

// ── REVERSE DCF ENGINE ─────────────────────────────────────────────────────

export function findImpliedGrowthRate(currentPrice, fixedAssumptions) {
  // Bisection over a single revenue growth rate applied to both growth periods.
  // Fair value is monotonically increasing in growth, so bisection converges.
  let lo = -0.5
  let hi = 1.0
  const tolerance = 0.001
  let impliedGrowthRate = 0
  let convergenceReached = false
  let lastResult = null

  const evalFairValue = (g) => {
    const r = calculateDCF({
      ...fixedAssumptions,
      revenueGrowth1to3: g,
      revenueGrowth4to5: g,
    })
    lastResult = r
    return r.fairValuePerShare
  }

  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2
    const fv = evalFairValue(mid)
    impliedGrowthRate = mid

    if (Math.abs(fv - currentPrice) < tolerance) {
      convergenceReached = true
      break
    }
    if (fv < currentPrice) {
      lo = mid // need more growth to reach the price
    } else {
      hi = mid
    }
  }

  return {
    impliedGrowthRate,
    convergenceReached,
    impliedEV: lastResult ? lastResult.enterpriseValue : null,
  }
}

export function assessGrowthExpectation(impliedRate, historicalRate, analystRate) {
  const benchmark = Math.max(historicalRate ?? 0, analystRate ?? 0)
  const floor = Math.min(historicalRate ?? 0, analystRate ?? 0)

  if (impliedRate > 0.4 || impliedRate > benchmark * 2.5) {
    return {
      label: 'Unachievable',
      color: 'text-[var(--negative)]',
      description: 'The market is pricing in growth that has rarely been sustained - significant downside risk if it disappoints.',
    }
  }
  if (impliedRate > benchmark) {
    return {
      label: 'Aggressive',
      color: 'text-[var(--accent-gold)]',
      description: 'The implied growth exceeds both historical and analyst expectations - the stock needs to outperform to justify its price.',
    }
  }
  if (impliedRate < floor) {
    return {
      label: 'Conservative',
      color: 'text-[var(--positive)]',
      description: 'The market expects less growth than history and analysts suggest - potential undervaluation if the company merely meets expectations.',
    }
  }
  return {
    label: 'Realistic',
    color: 'text-[var(--text-secondary)]',
    description: 'The implied growth sits within the range of historical performance and analyst forecasts - fairly priced on current assumptions.',
  }
}

// ── LBO ENGINE ─────────────────────────────────────────────────────────────

export function calculateIRR(cashFlows) {
  // Newton-Raphson on NPV(r) = 0.
  let rate = 0.1
  for (let i = 0; i < 1000; i++) {
    let npv = 0
    let dNpv = 0
    for (let t = 0; t < cashFlows.length; t++) {
      const denom = Math.pow(1 + rate, t)
      npv += cashFlows[t] / denom
      if (t > 0) dNpv -= (t * cashFlows[t]) / Math.pow(1 + rate, t + 1)
    }
    if (Math.abs(npv) < 1e-6) return rate
    if (dNpv === 0) break
    const newRate = rate - npv / dNpv
    if (!isFinite(newRate) || newRate <= -0.9999) break
    if (Math.abs(newRate - rate) < 1e-7) return newRate
    rate = newRate
  }
  return null
}

export function calculateMOIC(entryEquity, exitEquity) {
  return entryEquity ? exitEquity / entryEquity : 0
}

// Core single-scenario LBO computation, reused by the sensitivity grid.
function computeLBO(inputs, entryMultiple, exitMultiple) {
  const {
    ltmEBITDA,
    ltmRevenue,
    transactionFeesPct,
    financingFeesPct,
    seniorDebtPct,
    seniorRate,
    subDebtPct,
    subRate,
    revenueGrowthRate,
    ebitdaMarginTarget,
    capexPct,
    nwcChangePct,
    holdPeriod,
    existingNetDebt = 0,
    sharesOutstanding,
    taxRate = 0.25,
  } = inputs

  const entryEV = ltmEBITDA * entryMultiple
  const seniorDebt = entryEV * seniorDebtPct
  const subDebt = entryEV * subDebtPct
  const totalDebt = seniorDebt + subDebt
  const transactionFees = entryEV * transactionFeesPct
  const financingFees = totalDebt * financingFeesPct

  const sponsorEquity = entryEV + transactionFees + financingFees - totalDebt

  // Debt tranches (cash sweep repays senior first).
  let seniorBal = seniorDebt
  let subBal = subDebt

  const entryMargin = ltmRevenue ? ltmEBITDA / ltmRevenue : ebitdaMarginTarget
  let revenue = ltmRevenue
  const yearByYear = []

  for (let year = 1; year <= holdPeriod; year++) {
    const prevRevenue = revenue
    revenue = prevRevenue * (1 + revenueGrowthRate)
    // Glide margin linearly from entry margin to target over the hold.
    const margin = entryMargin + ((ebitdaMarginTarget - entryMargin) * year) / holdPeriod
    const ebitda = revenue * margin

    const interest = seniorBal * seniorRate + subBal * subRate
    const capex = revenue * capexPct
    const nwcChange = (revenue - prevRevenue) * nwcChangePct
    // Assume D&A ≈ capex for the tax shield approximation.
    const taxable = Math.max(0, ebitda - capex - interest)
    const taxes = taxable * taxRate
    const fcf = ebitda - interest - taxes - capex - nwcChange

    // 100% cash sweep: senior first, then sub.
    let sweep = Math.max(0, fcf)
    const seniorRepaid = Math.min(sweep, seniorBal)
    seniorBal -= seniorRepaid
    sweep -= seniorRepaid
    const subRepaid = Math.min(sweep, subBal)
    subBal -= subRepaid
    const debtRepaid = seniorRepaid + subRepaid
    const debtBalance = seniorBal + subBal

    const equityValue = ebitda * exitMultiple - debtBalance

    yearByYear.push({
      year,
      revenue,
      ebitda,
      interest,
      fcf,
      debtRepaid,
      debtBalance,
      equityValue,
    })
  }

  const finalYear = yearByYear[yearByYear.length - 1]
  const exitEV = finalYear.ebitda * exitMultiple
  const exitDebt = finalYear.debtBalance
  const exitEquity = exitEV - exitDebt

  const cashFlows = [-sponsorEquity, ...Array(holdPeriod - 1).fill(0), exitEquity]
  const irr = calculateIRR(cashFlows)
  const moic = calculateMOIC(sponsorEquity, exitEquity)

  const entryPricePerShare = sharesOutstanding
    ? (entryEV - existingNetDebt) / sharesOutstanding
    : 0
  const exitPricePerShare = sharesOutstanding ? exitEquity / sharesOutstanding : 0

  return {
    entryEV,
    entryEquity: sponsorEquity,
    entryPricePerShare,
    totalDebt,
    seniorDebt,
    subDebt,
    transactionFees,
    financingFees,
    leverage: ltmEBITDA ? totalDebt / ltmEBITDA : 0,
    yearByYear,
    exitEV,
    exitEquity,
    exitPricePerShare,
    cashFlows,
    irr,
    moic,
  }
}

export function runLBOModel(inputs) {
  const { entryMultiple, exitMultiple, currentSharePrice } = inputs
  const core = computeLBO(inputs, entryMultiple, exitMultiple)

  const entryPremium = currentSharePrice
    ? core.entryPricePerShare / currentSharePrice - 1
    : null

  const sourcesAndUses = {
    sources: {
      seniorDebt: core.seniorDebt,
      subDebt: core.subDebt,
      sponsorEquity: core.entryEquity,
      total: core.seniorDebt + core.subDebt + core.entryEquity,
    },
    uses: {
      purchaseEnterpriseValue: core.entryEV,
      transactionFees: core.transactionFees,
      financingFees: core.financingFees,
      total: core.entryEV + core.transactionFees + core.financingFees,
    },
  }

  // Assessment based on IRR.
  let assessment
  if (core.irr === null) {
    assessment = { label: 'No Convergence', color: 'text-[var(--negative)]', description: 'IRR could not be computed for these cash flows.' }
  } else if (core.irr >= 0.25) {
    assessment = { label: 'Attractive', color: 'text-[var(--positive)]', description: 'IRR exceeds the typical 25% private-equity hurdle - a compelling return.' }
  } else if (core.irr >= 0.15) {
    assessment = { label: 'Acceptable', color: 'text-[var(--accent-gold)]', description: 'IRR is within a reasonable 15–25% range but below top-quartile targets.' }
  } else {
    assessment = { label: 'Unattractive', color: 'text-[var(--negative)]', description: 'IRR falls below the 15% threshold most sponsors require.' }
  }

  // Sensitivity grid: entry multiple (rows) × exit multiple (cols) → IRR.
  const entryRange = [entryMultiple - 1, entryMultiple - 0.5, entryMultiple, entryMultiple + 0.5, entryMultiple + 1]
  const exitRange = [exitMultiple - 1, exitMultiple - 0.5, exitMultiple, exitMultiple + 0.5, exitMultiple + 1]
  const sensitivityTable = entryRange.map((em) =>
    exitRange.map((xm) => computeLBO(inputs, em, xm).irr)
  )

  return {
    entryEV: core.entryEV,
    entryEquity: core.entryEquity,
    entryPricePerShare: core.entryPricePerShare,
    entryPremium,
    totalDebt: core.totalDebt,
    leverage: core.leverage,
    yearByYear: core.yearByYear,
    exitEV: core.exitEV,
    exitEquity: core.exitEquity,
    exitPricePerShare: core.exitPricePerShare,
    cashFlows: core.cashFlows,
    irr: core.irr,
    moic: core.moic,
    sourcesAndUses,
    assessment,
    sensitivityTable,
    sensitivityAxes: { entryRange, exitRange },
  }
}

// ── ASSUMPTION VALIDATOR ───────────────────────────────────────────────────

export function validateAssumptions(modelType, inputs) {
  const issues = []
  const add = (field, severity, message) => issues.push({ field, severity, message })

  const riskFreeRate = inputs.riskFreeRate ?? 0.04

  if (modelType === 'dcf' || modelType === 'montecarlo' || modelType === 'reverse') {
    const wacc = inputs.wacc ?? inputs.wacc?.base
    const tgr = inputs.terminalGrowthRate ?? inputs.terminalGrowthRate?.base

    if (wacc !== undefined && wacc < riskFreeRate) {
      add('wacc', 'error', 'WACC is below the risk-free rate - discount rate is implausible.')
    }
    if (wacc !== undefined && tgr !== undefined && tgr > wacc) {
      add('terminalGrowthRate', 'error', 'Terminal growth rate exceeds WACC - the Gordon Growth model breaks down (infinite value).')
    }
    if (tgr !== undefined && tgr > 0.04) {
      add('terminalGrowthRate', 'warning', 'Terminal growth above 4% exceeds long-run GDP growth - likely too optimistic in perpetuity.')
    }
    if (inputs.ebitMargin !== undefined && inputs.ebitMargin > 0.6) {
      add('ebitMargin', 'warning', 'EBIT margin above 60% is exceptional - verify it is sustainable.')
    }
    const g1 = inputs.revenueGrowth1to3
    if (g1 !== undefined && g1 > 0.4) {
      add('revenueGrowth1to3', 'warning', 'Revenue growth above 40% sustained over 5 years is rarely achievable.')
    }
  }

  if (modelType === 'ddm') {
    const ke = inputs.ke
    const g = inputs.g ?? inputs.g1 ?? inputs.terminalGrowthRate
    if (ke !== undefined && g !== undefined && g >= ke) {
      add('g', 'error', 'Growth rate (g) is greater than or equal to cost of equity (Ke) - the DDM produces an infinite or negative value.')
    }
  }

  if (modelType === 'lbo') {
    const leverage = inputs.leverage ??
      (inputs.ltmEBITDA && inputs.entryMultiple && (inputs.seniorDebtPct + inputs.subDebtPct)
        ? inputs.entryMultiple * (inputs.seniorDebtPct + inputs.subDebtPct)
        : undefined)
    if (leverage !== undefined && leverage > 7) {
      add('leverage', 'warning', 'Leverage above 7× EBITDA is aggressive and raises default risk.')
    }
    if (inputs.irr === null) {
      add('irr', 'error', 'IRR did not converge for the projected cash flows.')
    }
  }

  if (modelType === 'graham') {
    if (inputs.eps !== undefined && inputs.eps <= 0) add('eps', 'error', 'Graham Number requires positive EPS - the company must be profitable.')
    if (inputs.bvps !== undefined && inputs.bvps <= 0) add('bvps', 'error', 'Graham Number requires positive book value per share.')
  }
  if (modelType === 'epv') {
    if (inputs.wacc !== undefined && inputs.wacc < riskFreeRate) add('wacc', 'error', 'Cost of capital is below the risk-free rate - implausible.')
    if (inputs.normalizedEBIT !== undefined && inputs.normalizedEBIT <= 0) add('normalizedEBIT', 'warning', 'Normalised EBIT is non-positive - EPV will be negative.')
  }
  if (modelType === 'rim') {
    if (inputs.ke !== undefined && inputs.ke <= 0) add('ke', 'error', 'Cost of equity must be positive.')
    if (inputs.bookValuePerShare !== undefined && inputs.bookValuePerShare <= 0) add('bookValuePerShare', 'warning', 'Negative book value makes the residual income model unreliable.')
  }

  return issues
}

// ── Graham Number ────────────────────────────────────────────────────────────
// Benjamin Graham's quick fair-value screen for a defensive stock:
//   √(22.5 × EPS × Book Value per Share)
// 22.5 = the product of his maximum 15× P/E and 1.5× P/B ceilings.
export function calculateGrahamNumber({ eps, bvps, currentPrice }) {
  if (eps == null || bvps == null || eps <= 0 || bvps <= 0) {
    return { grahamNumber: null, valid: false, upside: null }
  }
  const grahamNumber = Math.sqrt(22.5 * eps * bvps)
  const upside = currentPrice ? (grahamNumber / currentPrice - 1) * 100 : null
  return {
    grahamNumber,
    impliedPE: eps ? grahamNumber / eps : null,
    impliedPB: bvps ? grahamNumber / bvps : null,
    valid: true,
    upside,
  }
}

// ── Earnings Power Value (Bruce Greenwald) ───────────────────────────────────
// Values the business assuming current normalised earnings persist with NO
// growth, capitalised at the cost of capital:
//   EPV (enterprise) = normalised NOPAT / WACC
//   EPV (equity)     = EPV enterprise − net debt
// A no-growth anchor: the gap vs price/DCF tells you how much "growth" the
// market is paying for.
export function calculateEPV({ normalizedEBIT, taxRate = 0.21, wacc, netDebt = 0, sharesOutstanding, currentPrice }) {
  if (!normalizedEBIT || !wacc || wacc <= 0 || !sharesOutstanding) {
    return { epvPerShare: null, valid: false }
  }
  const nopat = normalizedEBIT * (1 - taxRate)
  const epvEnterprise = nopat / wacc
  const epvEquity = epvEnterprise - netDebt
  const epvPerShare = epvEquity / sharesOutstanding
  const upside = currentPrice ? (epvPerShare / currentPrice - 1) * 100 : null
  return {
    nopat,
    epvEnterprise,
    epvEquity,
    epvPerShare,
    upside,
    valid: true,
  }
}

// ── Residual Income Model (RIM) ──────────────────────────────────────────────
// Value = current book value + PV of future residual income, where
//   residual income_t = (ROE − Ke) × Book Value_(t−1)
// Book value compounds at ROE × (1 − payout). A terminal residual-income
// perpetuity (with fade growth g) caps the horizon.
export function calculateResidualIncome({
  bookValuePerShare, roe, ke, payoutRatio = 0.4, years = 5, terminalGrowth = 0.0, currentPrice,
}) {
  if (bookValuePerShare == null || roe == null || !ke || ke <= 0) {
    return { valuePerShare: null, valid: false, schedule: [] }
  }
  const retention = 1 - payoutRatio
  let bv = bookValuePerShare
  let pvRI = 0
  const schedule = []
  for (let t = 1; t <= years; t++) {
    const eps = roe * bv
    const ri = (roe - ke) * bv          // residual income for the year
    const disc = Math.pow(1 + ke, t)
    const pv = ri / disc
    pvRI += pv
    schedule.push({ year: t, openingBV: bv, eps, residualIncome: ri, pv })
    bv = bv + eps * retention            // retained earnings grow book value
  }
  // Terminal value of residual income beyond the explicit horizon.
  const lastRI = schedule.length ? schedule[schedule.length - 1].residualIncome : 0
  let pvTerminal = 0
  if (ke > terminalGrowth) {
    const terminalRI = (lastRI * (1 + terminalGrowth)) / (ke - terminalGrowth)
    pvTerminal = terminalRI / Math.pow(1 + ke, years)
  }
  const valuePerShare = bookValuePerShare + pvRI + pvTerminal
  const upside = currentPrice ? (valuePerShare / currentPrice - 1) * 100 : null
  return {
    valuePerShare,
    startingBookValue: bookValuePerShare,
    pvResidualIncome: pvRI,
    pvTerminal,
    schedule,
    upside,
    valid: true,
  }
}
