export type Strategy = 'csp' | 'cc';
export type StrategyView = 'csp' | 'cc' | 'both';
export type Moneyness = 'ITM' | 'ATM' | 'OTM';

export interface StrikeRow {
  strategy: Strategy;
  strike: number;
  distancePct: number;
  moneyness: Moneyness;
  estimatedPremium: number;
  effectivePremium: number;
  isOverridden: boolean;
  monthlyReturnPct: number;
  annualReturnPct: number;
  capitalRequired: number;
  breakEven: number;
  maxProfit: number;
}
