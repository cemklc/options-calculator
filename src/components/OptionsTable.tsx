import type { StrikeRow, Strategy, DealThresholds } from '../types';
import { EditableCell } from './EditableCell';
import { Tooltip } from './Tooltip';

interface Props {
  rows: StrikeRow[];
  strategy: Strategy;
  onPremiumChange: (strategy: Strategy, strike: number, value: number | undefined) => void;
  showAdvanced: boolean;
  dealThresholds: DealThresholds;
}

function fmt(n: number, dp = 2): string {
  return n.toFixed(dp);
}

function fmtCapital(n: number): string {
  return Math.round(n).toLocaleString('en-US');
}

function fmtEv(n: number): string {
  return (n >= 0 ? '+' : '') + fmt(n, 0);
}

export function OptionsTable({ rows, strategy, onPremiumChange, showAdvanced, dealThresholds }: Props) {
  const title = strategy === 'csp' ? 'Cash-Secured Puts' : 'Covered Calls';

  return (
    <div className="table-container">
      <h2 className="table-title">{title}</h2>
      <div className="table-scroll">
        <table className="options-table">
          <thead>
            <tr>
              <th className="left">Strike</th>
              <th>Distance</th>
              <th className="left">Type</th>
              <th>Premium</th>
              <th>Monthly %</th>
              <th>Annual %</th>
              <th>Capital (€)</th>
              <th>Break-even</th>
              <th>Max Profit</th>
              {showAdvanced && (
                <>
                  <th className="adv-col">
                    PoP <Tooltip text="Probability of Profit: estimated chance the option expires worthless and you keep the full premium. Calculated using Black-Scholes d2 with 30-day expiry." />
                  </th>
                  <th className="adv-col">
                    EV (€) <Tooltip text="Expected Value per contract: PoP × premium income minus (1 − PoP) × estimated average loss. Positive = mathematically favorable trade on average." />
                  </th>
                  <th className="adv-col">
                    /Day (€) <Tooltip text="Premium per Day: daily income rate (premium ÷ 30). Useful for comparing trades across different strikes or timeframes." />
                  </th>
                  <th className="adv-col">
                    If Assigned <Tooltip text="Return if Assigned: for CSP, the % discount on your effective purchase price vs current market price; for CC, total return (premium + appreciation) if shares are called away." />
                  </th>
                  <th className="adv-col">
                    Safety % <Tooltip text="Margin of Safety: how far the stock can fall before you start losing money, as a % of current price. Higher = more downside protection." />
                  </th>
                  <th className="adv-col">
                    Risk:Reward <Tooltip text="Risk/Reward Ratio: estimated max loss ÷ max profit per contract. A 50:1 ratio means you risk €5,000 to earn €100. Lower is better." />
                  </th>
                  <th className="adv-col">
                    Deal <Tooltip text="Good Deal indicator: row meets your minimum Annual Return and PoP thresholds set in the panel above." />
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isGoodDeal =
                row.annualReturnPct > dealThresholds.minAnnualReturnPct &&
                row.pop * 100 > dealThresholds.minPopPct;

              return (
                <tr
                  key={`${row.strategy}-${row.strike}`}
                  className={[
                    row.moneyness === 'ATM' ? 'row-atm' : '',
                    showAdvanced && isGoodDeal ? 'row-good-deal' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <td className="num left">{fmt(row.strike)}</td>
                  <td className="num">
                    {row.distancePct >= 0 ? '+' : ''}
                    {fmt(row.distancePct, 1)}%
                  </td>
                  <td>
                    <span className={`moneyness-badge badge-${row.moneyness.toLowerCase()}`}>
                      {row.moneyness}
                    </span>
                  </td>
                  <td>
                    <EditableCell
                      value={row.effectivePremium}
                      isOverridden={row.isOverridden}
                      onCommit={(v) => onPremiumChange(strategy, row.strike, v)}
                    />
                  </td>
                  <td className="num">{fmt(row.monthlyReturnPct)}%</td>
                  <td className="num">{fmt(row.annualReturnPct, 1)}%</td>
                  <td className="num">{fmtCapital(row.capitalRequired)}</td>
                  <td className="num">{fmt(row.breakEven)}</td>
                  <td className="num">
                    <strong>{fmt(row.maxProfit)}</strong>
                    {strategy === 'cc' && (
                      <div className="max-profit-breakdown">
                        {fmt(row.effectivePremium * 100)} + {fmt(row.maxProfit - row.effectivePremium * 100)}
                      </div>
                    )}
                  </td>
                  {showAdvanced && (
                    <>
                      <td className="num adv-col">{fmt(row.pop * 100, 0)}%</td>
                      <td className={`num adv-col ${row.ev >= 0 ? 'ev-pos' : 'ev-neg'}`}>
                        {fmtEv(row.ev)}
                      </td>
                      <td className="num adv-col">{fmt(row.premiumPerDay, 3)}</td>
                      <td className="num adv-col">
                        {row.returnIfAssigned >= 0 ? '+' : ''}
                        {fmt(row.returnIfAssigned, 1)}%
                      </td>
                      <td className="num adv-col">{fmt(row.marginOfSafety, 1)}%</td>
                      <td className="num adv-col">
                        {isFinite(row.riskRewardRatio)
                          ? fmt(row.riskRewardRatio, 0) + ':1'
                          : '∞'}
                      </td>
                      <td className="adv-col deal-col">
                        {isGoodDeal ? (
                          <span className="deal-badge">★</span>
                        ) : (
                          <span className="deal-none">—</span>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
