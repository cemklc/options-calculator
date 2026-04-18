import { useState, useEffect, useRef } from 'react';

interface Props {
  value: number;
  onChange: (price: number) => void;
}

export function PriceInput({ value, onChange }: Props) {
  const [inputValue, setInputValue] = useState(String(value));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setInputValue(raw);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const parsed = parseFloat(raw);
      if (!isNaN(parsed) && parsed > 0) onChange(parsed);
    }, 300);
  }

  return (
    <div className="price-input">
      <label className="label-text">Stock Price</label>
      <div className="input-with-unit">
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={inputValue}
          onChange={handleChange}
        />
        <span className="unit">EUR</span>
      </div>
      <span className="field-hint">30-day expiry</span>
    </div>
  );
}
