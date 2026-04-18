# Options Premium Calculator

A web app for evaluating **cash-secured puts (CSPs)** and **covered calls (CCs)** when farming option premiums on European stocks (Euronext/DEGIRO).

Since no free API exists for real-time Euronext options data, the app generates **model-estimated premiums** based on volatility and distance from the current price. You can override any premium cell with the real quote you see on your broker.

## Features

- **13 strikes** auto-generated around the current stock price, with smart step sizing
- **Volatility model** scales all premiums by implied volatility — presets for Low (15%), Medium (25%), High (40%), Very High (60%) plus a custom slider
- **Per-row metrics:** monthly return %, annualised return %, capital required per contract, break-even, max profit
- **Editable premiums** — click any premium cell to enter the real market price; overridden values survive volatility changes and are shown in purple
- **CSP / Covered Call / Both** view toggle
- **ATM row** highlighted in blue; OTM/ATM/ITM colour-coded badges
- **localStorage** persistence — price, volatility, strategy, and all overrides are restored on reload

## Premium model

Base heuristic at 25% IV, 30-day expiry:

| Distance from price | Premium % of strike |
|---------------------|---------------------|
| ATM (≤ 0.5%)        | 2.5%                |
| 0.5 – 5% OTM        | 2.5% → 1.0% linear  |
| 5 – 10% OTM         | 1.0% → 0.3% linear  |
| 10 – 20% OTM        | 0.3% → 0.1% linear  |
| 20%+ OTM            | 0.05%               |
| ITM                 | intrinsic + scaled time value |

All time-value components scale by `userVol / 25`, so a 40% IV stock shows ~1.6× the base premium.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Usage

1. **Enter the stock price** — the table regenerates with 13 strikes centred around it
2. **Set implied volatility** — use a preset or drag the slider; all estimated premiums update immediately
3. **Pick a strategy** — CSP, Covered Call, or both side by side
4. **Read the table** — find strikes with a monthly return % you like and a break-even you're comfortable with
5. **Enter real prices** — click any premium cell, type the actual quote from your broker, press Enter; derived columns recalculate. Clear to 0 or blank to revert to the estimate

## Tech stack

React · TypeScript · Vite · plain CSS (no UI library)
