import { useState } from 'react';

interface Props {
  value: number;
  isOverridden: boolean;
  onCommit: (value: number | undefined) => void;
}

export function EditableCell({ value, isOverridden, onCommit }: Props) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');

  function startEdit() {
    setInputValue(value.toFixed(2));
    setEditing(true);
  }

  function commit(raw: string) {
    const trimmed = raw.trim();
    if (trimmed === '' || trimmed === '0') {
      onCommit(undefined); // revert to estimate
    } else {
      const parsed = parseFloat(trimmed);
      onCommit(!isNaN(parsed) && parsed > 0 ? parsed : undefined);
    }
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        className="premium-edit-input"
        type="number"
        min="0"
        step="0.01"
        value={inputValue}
        autoFocus
        onFocus={(e) => e.target.select()}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit(inputValue);
          if (e.key === 'Escape') setEditing(false);
        }}
      />
    );
  }

  return (
    <span
      className={`premium-cell ${isOverridden ? 'overridden' : 'estimated'}`}
      onClick={startEdit}
      title={isOverridden ? 'Custom value — click to edit or clear to revert' : 'Estimated — click to enter real market price'}
    >
      {value.toFixed(2)}
      {isOverridden && <sup className="override-marker">*</sup>}
    </span>
  );
}
