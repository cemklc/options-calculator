import { useState } from 'react';

export function InfoBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="info-banner">
      <span>
        Premiums shown are model estimates for comparison purposes. Real-time European options data
        (Euronext Amsterdam etc.) is not freely available via API. Click any premium cell to enter
        the actual market price you see on real exchange.
      </span>
      <button onClick={() => setDismissed(true)} aria-label="Dismiss">×</button>
    </div>
  );
}
