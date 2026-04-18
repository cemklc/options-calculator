import type { DealThresholds } from '../types';

interface Props {
  thresholds: DealThresholds;
  onChange: (t: DealThresholds) => void;
}

export function DealThresholdsPanel({ thresholds, onChange }: Props) {
  return (
    <div className="deal-thresholds-panel">
      <span className="label-text">Good Deal Thresholds</span>
      <div className="threshold-fields">
        <label className="threshold-field">
          <span>Min Annual Return</span>
          <div className="threshold-input-wrap">
            <input
              type="number"
              min={0}
              max={200}
              value={thresholds.minAnnualReturnPct}
              onChange={(e) =>
                onChange({ ...thresholds, minAnnualReturnPct: Math.max(0, Number(e.target.value)) })
              }
            />
            <span className="threshold-unit">%</span>
          </div>
        </label>
        <label className="threshold-field">
          <span>Min PoP</span>
          <div className="threshold-input-wrap">
            <input
              type="number"
              min={0}
              max={100}
              value={thresholds.minPopPct}
              onChange={(e) =>
                onChange({ ...thresholds, minPopPct: Math.max(0, Math.min(100, Number(e.target.value))) })
              }
            />
            <span className="threshold-unit">%</span>
          </div>
        </label>
      </div>
    </div>
  );
}
