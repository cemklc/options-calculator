const PRESETS = [
  { label: 'Low', pct: 15, examples: 'Unilever, Nestlé' },
  { label: 'Medium', pct: 25, examples: 'ASML, Shell' },
  { label: 'High', pct: 40, examples: 'Growth / tech stocks' },
  { label: 'Very High', pct: 60, examples: 'Meme stocks, biotech' },
] as const;

interface Props {
  volatility: number;
  onChange: (pct: number) => void;
}

export function VolatilityInput({ volatility, onChange }: Props) {
  const activePreset = PRESETS.find((p) => p.pct === volatility);

  return (
    <div className="volatility-input">
      <label className="label-text">Implied Volatility</label>
      <div className="preset-buttons">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            className={`preset-btn ${volatility === p.pct ? 'active' : ''}`}
            onClick={() => onChange(p.pct)}
            title={p.examples}
          >
            {p.label} ({p.pct}%)
          </button>
        ))}
      </div>
      <div className="slider-row">
        <input
          type="range"
          min="10"
          max="80"
          step="1"
          value={volatility}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <input
          type="number"
          min="10"
          max="80"
          step="1"
          value={volatility}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v >= 10 && v <= 80) onChange(v);
          }}
          className="vol-number-input"
        />
        <span className="unit">%</span>
      </div>
      {activePreset && (
        <div className="field-hint">e.g. {activePreset.examples}</div>
      )}
    </div>
  );
}
