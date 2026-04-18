import type { Strategy, StrikeRow, Moneyness } from '../types';
import { estimatePremium } from '../models/premiumModel';
import { computePoP } from './probability';

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

  const annualReturnPct = monthlyReturnPct * 12;

  // Phase 2 ─────────────────────────────────────────────────────────────────

  const pop = computePoP(currentPrice, strike, volatilityPct, strategy);

  // EV = PoP × income − (1 − PoP) × avg_loss (per contract, EUR)
  // avg_loss: conservative estimate — half the max loss (stock → 0)
  const maxLoss = breakEven * 100;
  const avgLoss = maxLoss / 2;
  const ev = pop * maxProfit - (1 - pop) * avgLoss;

  const premiumPerDay = effectivePremium / 30;

  // Return if assigned: how good is the outcome if the option gets exercised?
  let returnIfAssigned: number;
  if (strategy === 'csp') {
    // Effective purchase price vs current market price
    returnIfAssigned = ((currentPrice - (strike - effectivePremium)) / currentPrice) * 100;
  } else {
    // Total return (premium + price appreciation to strike) relative to current price
    returnIfAssigned = ((strike - currentPrice + effectivePremium) / currentPrice) * 100;
  }

  // How far price can drop before you lose money
  const marginOfSafety = ((currentPrice - breakEven) / currentPrice) * 100;

  const riskRewardRatio = maxProfit > 0 ? maxLoss / maxProfit : Infinity;

  return {
    strategy,
    strike,
    distancePct,
    moneyness: moneyness(strike, currentPrice, strategy),
    estimatedPremium,
    effectivePremium,
    isOverridden,
    monthlyReturnPct,
    annualReturnPct,
    capitalRequired,
    breakEven,
    maxProfit,
    pop,
    ev,
    premiumPerDay,
    returnIfAssigned,
    marginOfSafety,
    maxLoss,
    riskRewardRatio,
  };
}
