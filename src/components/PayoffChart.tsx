// SVG payoff diagram — normalized coordinate system
// Price axis: 60–140 (strike = 100, premium = 10)
// PnL axis: –35 to +35
//
// All payoff lines use these conventions so charts are comparable.

const W = 440;
const H = 210;
const PL = 52; // left padding (y-axis labels)
const PR = 16;
const PT = 18;
const PB = 38; // bottom padding (x-axis labels)
const CW = W - PL - PR; // 372
const CH = H - PT - PB; // 154

const P_MIN = 60, P_MAX = 140; // price range
const V_MIN = -35, V_MAX = 35;  // pnl range

function px(price: number): number {
  return PL + ((price - P_MIN) / (P_MAX - P_MIN)) * CW;
}
function py(pnl: number): number {
  return PT + ((V_MAX - pnl) / (V_MAX - V_MIN)) * CH;
}
function path(points: [number, number][]): string {
  return points
    .map(([p, v], i) => `${i === 0 ? 'M' : 'L'}${px(p).toFixed(1)},${py(v).toFixed(1)}`)
    .join(' ');
}

// Pre-computed reference values
const Y0 = py(0);           // zero line y
const X_STRIKE = px(100);   // strike vertical x
const X_BE_CALL = px(110);  // break-even for calls (strike + premium)
const X_BE_PUT = px(90);    // break-even for puts (strike - premium)

interface Line {
  label: string;
  color: string;
  points: [number, number][];
  breakEven?: number; // price where pnl = 0
}

interface Props {
  lines: Line[];
  type: 'call' | 'put';
}

const PRICE_LABELS = [70, 80, 90, 100, 110, 120, 130];

export function PayoffChart({ lines, type }: Props) {
  const beX = type === 'call' ? X_BE_CALL : X_BE_PUT;
  const bePrice = type === 'call' ? 110 : 90;

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} className="payoff-svg" role="img" aria-label="Option payoff diagram at expiry">

        {/* Profit / loss zone fills */}
        <rect x={PL} y={PT} width={CW} height={Y0 - PT} fill="#dcfce7" opacity="0.45" />
        <rect x={PL} y={Y0} width={CW} height={CH - (Y0 - PT)} fill="#fee2e2" opacity="0.35" />

        {/* Grid lines */}
        {[-20, -10, 10, 20].map((v) => (
          <line
            key={v}
            x1={PL} y1={py(v)} x2={PL + CW} y2={py(v)}
            stroke="#e5e7eb" strokeWidth="1"
          />
        ))}

        {/* Zero line */}
        <line x1={PL} y1={Y0} x2={PL + CW} y2={Y0} stroke="#9ca3af" strokeWidth="1.5" />

        {/* Strike price dashed vertical */}
        <line
          x1={X_STRIKE} y1={PT} x2={X_STRIKE} y2={PT + CH}
          stroke="#6b7280" strokeWidth="1.5" strokeDasharray="5,4"
        />
        <text x={X_STRIKE} y={PT + CH + 14} textAnchor="middle" className="chart-label" fill="#374151">
          Strike
        </text>
        <text x={X_STRIKE} y={PT + CH + 26} textAnchor="middle" className="chart-label-sm" fill="#6b7280">
          €100
        </text>

        {/* Break-even dashed vertical */}
        <line
          x1={beX} y1={PT} x2={beX} y2={PT + CH}
          stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,4"
        />
        <text x={beX} y={PT - 4} textAnchor="middle" className="chart-label-sm" fill="#d97706">
          B/E €{bePrice}
        </text>

        {/* Y-axis labels */}
        {[-20, -10, 0, 10, 20].map((v) => (
          <text key={v} x={PL - 6} y={py(v) + 4} textAnchor="end" className="chart-label-sm" fill={v > 0 ? '#15803d' : v < 0 ? '#b91c1c' : '#6b7280'}>
            {v > 0 ? `+${v}` : v}
          </text>
        ))}

        {/* X-axis labels */}
        {PRICE_LABELS.map((p) => (
          <text key={p} x={px(p)} y={PT + CH + 14} textAnchor="middle" className="chart-label-sm" fill="#6b7280">
            {p}
          </text>
        ))}

        {/* Zone labels */}
        <text x={PL + 8} y={PT + 13} className="chart-label-sm" fill="#15803d">PROFIT</text>
        <text x={PL + 8} y={PT + CH - 5} className="chart-label-sm" fill="#b91c1c">LOSS</text>

        {/* Axis labels */}
        <text x={PL + CW / 2} y={H - 2} textAnchor="middle" className="chart-label" fill="#374151">
          Stock price at expiry (€)
        </text>
        <text
          x={12} y={PT + CH / 2}
          textAnchor="middle"
          className="chart-label"
          fill="#374151"
          transform={`rotate(-90, 12, ${PT + CH / 2})`}
        >
          Profit / Loss (€)
        </text>

        {/* Payoff lines */}
        {lines.map((line) => (
          <path
            key={line.label}
            d={path(line.points)}
            fill="none"
            stroke={line.color}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        ))}

        {/* Break-even dot */}
        <circle cx={beX} cy={Y0} r="4" fill="#f59e0b" stroke="white" strokeWidth="1.5" />

        {/* Legend */}
        {lines.map((line, i) => (
          <g key={line.label} transform={`translate(${PL + 10 + i * 160}, ${PT + 6})`}>
            <line x1="0" y1="6" x2="22" y2="6" stroke={line.color} strokeWidth="2.5" />
            <text x="28" y="10" className="chart-label" fill="#374151">{line.label}</text>
          </g>
        ))}
      </svg>

      <p className="chart-note">
        All values per share · Strike = €100 · Premium = €10 · 30-day expiry
      </p>
    </div>
  );
}

// Pre-built diagram data for calls
export const CALL_LINES: Line[] = [
  {
    label: 'Buyer (long call)',
    color: '#2563eb',
    points: [[60, -10], [100, -10], [140, 30]],
  },
  {
    label: 'Seller (short call)',
    color: '#dc2626',
    points: [[60, 10], [100, 10], [140, -30]],
  },
];

// Pre-built diagram data for puts
export const PUT_LINES: Line[] = [
  {
    label: 'Buyer (long put)',
    color: '#2563eb',
    points: [[60, 30], [100, -10], [140, -10]],
  },
  {
    label: 'Seller (CSP)',
    color: '#dc2626',
    points: [[60, -30], [100, 10], [140, 10]],
  },
];
