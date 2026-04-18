import type { Strategy, StrikeRow, Moneyness } from '../types';
import { estimatePremium } from '../models/premiumModel';

function moneyness(strike: number, currentPrice: number, strategy: Strategy): Moneyness {
  const dist = Math.abs(((strike - currentPrice) / currentPrice) * 100);
  if (dist <= 0.5) return 'ATM';
  if (strategy === 'csp') return strike < currentPrice ? 'OTM' : 'ITM';
  return strike > currentPrice ? 'OTM' : 'ITM';
}

export function buildStrikeRow(
  strike: number,
  currentPrice: number,
  volatilityPct: number,
  strategy: Strategy,
  overridePremium?: number,
): StrikeRow {
  const estimatedPremium = estimatePremium(strike, currentPrice, volatilityPct, strategy);
  const effectivePremium = overridePremium ?? estimatedPremium;
  const isOverridden = overridePremium !== undefined;

  const distancePct = ((strike - currentPrice) / currentPrice) * 100;

  let capitalRequired: number;
  let breakEven: number;
  let monthlyReturnPct: number;
  let maxProfit: number;

  if (strategy === 'csp') {
    capitalRequired = strike * 100;
    breakEven = strike - effectivePremium;
    monthlyReturnPct = (effectivePremium / strike) * 100;
    maxProfit = effectivePremium * 100;
  } else {
    capitalRequired = currentPrice * 100;
    breakEven = currentPrice - effectivePremium;
    monthlyReturnPct = (effectivePremium / currentPrice) * 100;
    maxProfit = (strike - currentPrice + effectivePremium) * 100;
  }

  return {
    strategy,
    strike,
    distancePct,
    moneyness: moneyness(strike, currentPrice, strategy),
    estimatedPremium,
    effectivePremium,
    isOverridden,
    monthlyReturnPct,
    annualReturnPct: monthlyReturnPct * 12,
    capitalRequired,
    breakEven,
    maxProfit,
  };
}
