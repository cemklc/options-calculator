import { useState, useRef } from 'react';

interface Props {
  text: string;
}

export function Tooltip({ text }: Props) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);

  function handleEnter() {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setPos({ x: r.left + r.width / 2, y: r.top });
    }
  }

  return (
    <span className="tooltip-wrap" onMouseEnter={handleEnter} onMouseLeave={() => setPos(null)}>
      <span ref={triggerRef} className="tooltip-trigger">?</span>
      {pos && (
        <span
          className="tooltip-box"
          style={{
            position: 'fixed',
            left: pos.x,
            top: pos.y - 6,
            transform: 'translateX(-50%) translateY(-100%)',
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
}
