import type { StrikeRow, Strategy } from '../types';
import { EditableCell } from './EditableCell';

interface Props {
  rows: StrikeRow[];
  strategy: Strategy;
  onPremiumChange: (strategy: Strategy, strike: number, value: number | undefined) => void;
}

function fmt(n: number, dp = 2): string {
  return n.toFixed(dp);
}

function fmtCapital(n: number): string {
  return Math.round(n).toLocaleString('en-US');
}

export function OptionsTable({ rows, strategy, onPremiumChange }: Props) {
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
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={`${row.strategy}-${row.strike}`}
                className={row.moneyness === 'ATM' ? 'row-atm' : ''}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
