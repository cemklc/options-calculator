import type { StrategyView } from '../types';

interface Props {
  value: StrategyView;
  onChange: (v: StrategyView) => void;
}

const OPTIONS: { value: StrategyView; label: string }[] = [
  { value: 'csp', label: 'Cash-Secured Put' },
  { value: 'cc', label: 'Covered Call' },
  { value: 'both', label: 'Both' },
];

export function StrategyToggle({ value, onChange }: Props) {
  return (
    <div className="strategy-toggle">
      <label className="label-text">Strategy</label>
      <div className="segmented-control">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`segment ${value === opt.value ? 'active' : ''}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
