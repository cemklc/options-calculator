import type { Strategy } from '../types';

const BASE_VOL = 25;

// Returns the base time-value percentage at 25% IV, 30-day expiry
function baseTimePct(distancePct: number, isOTM: boolean, isATM: boolean): number {
  if (isATM) return 0.025;

  if (isOTM) {
    if (distancePct <= 5) {
      // Linear: 2.5% at 0.5% distance → 1.0% at 5% distance
      const t = (distancePct - 0.5) / 4.5;
      return 0.025 - t * 0.015;
    } else if (distancePct <= 10) {
      // Linear: 1.0% → 0.3%
      const t = (distancePct - 5) / 5;
      return 0.010 - t * 0.007;
    } else if (distancePct <= 20) {
      // Linear: 0.3% → 0.1%
      const t = (distancePct - 10) / 10;
      return 0.003 - t * 0.002;
    }
    return 0.0005; // 20%+ OTM
  }

  // ITM: time value decreases with depth
  return Math.max(0.005, 0.025 - distancePct * 0.002);
}

export function estimatePremium(
  strike: number,
  currentPrice: number,
  volatilityPct: number,
  strategy: Strategy,
): number {
  const volScale = volatilityPct / BASE_VOL;
  const distancePct = Math.abs(((strike - currentPrice) / currentPrice) * 100);
  const isATM = distancePct <= 0.5;
  const isOTM = isATM
    ? false
    : strategy === 'csp'
      ? strike < currentPrice
      : strike > currentPrice;

  if (isATM || isOTM) {
    return Math.max(0.01, baseTimePct(distancePct, isOTM, isATM) * strike * volScale);
  }

  // ITM: intrinsic value + scaled time value
  const intrinsic = Math.abs(strike - currentPrice);
  const timeValue = Math.max(0.01, baseTimePct(distancePct, false, false) * strike * volScale);
  return intrinsic + timeValue;
}
