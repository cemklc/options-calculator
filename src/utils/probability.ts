// Abramowitz & Stegun 26.2.17 polynomial approximation (max error < 7.5e-8)
function phi(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

export function normalCdf(x: number): number {
  if (x >= 0) {
    const p = 0.2316419;
    const b = [0.319381530, -0.356563782, 1.781477937, -1.821255978, 1.330274429];
    const t = 1 / (1 + p * x);
    const poly = b[0]*t + b[1]*t**2 + b[2]*t**3 + b[3]*t**4 + b[4]*t**5;
    return 1 - phi(x) * poly;
  }
  return 1 - normalCdf(-x);
}

// P(option expires worthless) using risk-neutral Black-Scholes d2, r=0
export function computePoP(
  currentPrice: number,
  strike: number,
  volatilityPct: number,
  strategy: 'csp' | 'cc',
): number {
  const sigma = volatilityPct / 100;
  const t = 30 / 365;
  const d2 = (Math.log(currentPrice / strike) - 0.5 * sigma * sigma * t) / (sigma * Math.sqrt(t));
  // CSP profits when S_T > K → P(S_T > K) = N(d2)
  // CC  profits when S_T < K → P(S_T < K) = N(-d2)
  return strategy === 'csp' ? normalCdf(d2) : normalCdf(-d2);
}
