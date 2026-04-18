import { useState, useCallback } from 'react';
import type { Strategy, StrategyView, DealThresholds } from './types';
import { Nav } from './components/Nav';
import { generateStrikes } from './utils/strikeGenerator';
import { buildStrikeRow } from './utils/calculations';
import { PriceInput } from './components/PriceInput';
import { VolatilityInput } from './components/VolatilityInput';
import { StrategyToggle } from './components/StrategyToggle';
import { OptionsTable } from './components/OptionsTable';
import { InfoBanner } from './components/InfoBanner';
import { DealThresholdsPanel } from './components/DealThresholds';

const LS = {
  price: 'opt-price',
  vol: 'opt-vol',
  strategy: 'opt-strategy',
  overrides: 'opt-overrides',
  showAdvanced: 'opt-show-advanced',
  dealThresholds: 'opt-deal-thresholds',
} as const;

const DEFAULT_THRESHOLDS: DealThresholds = { minAnnualReturnPct: 15, minPopPct: 75 };

function loadInitial() {
  const price = parseFloat(localStorage.getItem(LS.price) ?? '30');
  const vol = parseInt(localStorage.getItem(LS.vol) ?? '25', 10);
  const rawStrategy = localStorage.getItem(LS.strategy);
  const strategy: StrategyView =
    rawStrategy === 'csp' || rawStrategy === 'cc' || rawStrategy === 'both'
      ? rawStrategy
      : 'csp';

  let overrides: Map<string, number> = new Map();
  try {
    const raw = localStorage.getItem(LS.overrides);
    if (raw) overrides = new Map(JSON.parse(raw) as [string, number][]);
  } catch {
    // ignore corrupt data
  }

  const showAdvanced = localStorage.getItem(LS.showAdvanced) === 'true';

  let dealThresholds = DEFAULT_THRESHOLDS;
  try {
    const raw = localStorage.getItem(LS.dealThresholds);
    if (raw) dealThresholds = JSON.parse(raw) as DealThresholds;
  } catch {
    // ignore corrupt data
  }

  return {
    price: isNaN(price) || price <= 0 ? 30 : price,
    vol: isNaN(vol) ? 25 : Math.max(10, Math.min(80, vol)),
    strategy,
    overrides,
    showAdvanced,
    dealThresholds,
  };
}

export default function App() {
  const [currentPrice, setCurrentPrice] = useState(() => loadInitial().price);
  const [volatility, setVolatility] = useState(() => loadInitial().vol);
  const [strategyView, setStrategyView] = useState<StrategyView>(() => loadInitial().strategy);
  const [overrides, setOverrides] = useState<Map<string, number>>(() => loadInitial().overrides);
  const [showAdvanced, setShowAdvanced] = useState(() => loadInitial().showAdvanced);
  const [dealThresholds, setDealThresholds] = useState<DealThresholds>(
    () => loadInitial().dealThresholds,
  );

  function persist<T>(key: string, value: T) {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  }

  function handlePrice(p: number) {
    setCurrentPrice(p);
    persist(LS.price, p);
  }

  function handleVolatility(v: number) {
    setVolatility(v);
    persist(LS.vol, v);
  }

  function handleStrategy(s: StrategyView) {
    setStrategyView(s);
    persist(LS.strategy, s);
  }

  function handleToggleAdvanced() {
    setShowAdvanced((prev) => {
      const next = !prev;
      persist(LS.showAdvanced, next);
      return next;
    });
  }

  function handleThresholds(t: DealThresholds) {
    setDealThresholds(t);
    persist(LS.dealThresholds, t);
  }

  const handlePremiumChange = useCallback(
    (strategy: Strategy, strike: number, value: number | undefined) => {
      setOverrides((prev) => {
        const next = new Map(prev);
        const key = `${strategy}-${strike}`;
        if (value === undefined) next.delete(key);
        else next.set(key, value);
        persist(LS.overrides, [...next]);
        return next;
      });
    },
    [],
  );

  function buildRows(strategy: Strategy) {
    return generateStrikes(currentPrice).map((strike) =>
      buildStrikeRow(strike, currentPrice, volatility, strategy, overrides.get(`${strategy}-${strike}`)),
    );
  }

  return (
    <div className="app">
      <Nav page="calculator" />
      <header className="app-header">
        <h1>Options Premium Calculator</h1>
        <p className="subtitle">Cash-Secured Puts &amp; Covered Calls · 30-day Euronext options</p>
      </header>

      <InfoBanner />

      <div className="controls">
        <PriceInput value={currentPrice} onChange={handlePrice} />
        <VolatilityInput volatility={volatility} onChange={handleVolatility} />
        <StrategyToggle value={strategyView} onChange={handleStrategy} />
        <div className="advanced-toggle-wrap">
          <span className="label-text">Advanced Metrics</span>
          <button
            className={`advanced-toggle ${showAdvanced ? 'active' : ''}`}
            onClick={handleToggleAdvanced}
          >
            {showAdvanced ? 'Hide' : 'Show'} PoP, EV &amp; More
          </button>
        </div>
      </div>

      {showAdvanced && (
        <div className="advanced-bar">
          <DealThresholdsPanel thresholds={dealThresholds} onChange={handleThresholds} />
        </div>
      )}

      <main className="tables">
        {strategyView !== 'cc' && (
          <OptionsTable
            rows={buildRows('csp')}
            strategy="csp"
            onPremiumChange={handlePremiumChange}
            showAdvanced={showAdvanced}
            dealThresholds={dealThresholds}
          />
        )}
        {strategyView !== 'csp' && (
          <OptionsTable
            rows={buildRows('cc')}
            strategy="cc"
            onPremiumChange={handlePremiumChange}
            showAdvanced={showAdvanced}
            dealThresholds={dealThresholds}
          />
        )}
      </main>
    </div>
  );
}
