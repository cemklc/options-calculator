# Options Premium Farming Calculator — Implementation Plan

## Context

Build a web app to evaluate cash-secured puts (CSPs) and covered calls (CCs) for premium farming. The user sells 30-day options on European stocks (via DEGIRO/Euronext) and wants a calculator to quickly assess whether a quoted premium is a good deal. Since free real-time European options data is not available via API, the app provides estimated default premiums that the user can override with real market values they see on DEGIRO.

**Key insight from research:** Options on DEGIRO are standard Euronext-listed contracts (not DEGIRO-specific). Tradegate does not offer options. No free API exists for Euronext options chains, so real data integration is deferred.

---

## Tech Stack

**React + Vite + TypeScript** — React's state management is ideal for the reactive table updates, Vite provides fast dev experience, TypeScript catches calculation bugs. No UI library — plain CSS with variables.

---

## Project Structure

```
src/
├── main.tsx                    # React mount
├── App.tsx                     # Root state: price, strategy, overrides
├── types.ts                    # TypeScript interfaces
├── models/
│   └── premiumModel.ts         # Premium estimation heuristic
├── utils/
│   ├── calculations.ts         # Return %, break-even, capital required
│   └── strikeGenerator.ts      # Generate strike prices around current price
├── components/
│   ├── PriceInput.tsx          # Current price input + expiry label
│   ├── VolatilityInput.tsx     # Volatility slider + presets (Low/Med/High/VHigh)
│   ├── StrategyToggle.tsx      # CSP / CC / Both toggle
│   ├── OptionsTable.tsx        # Main results table
│   ├── EditableCell.tsx        # Click-to-edit premium cell
│   └── InfoBanner.tsx          # "Premiums are estimates" notice
└── styles/
    └── global.css              # CSS variables, reset, typography
```

---

## Implementation Steps

### Step 1: Scaffold project
- `npm create vite@latest . -- --template react-ts`
- Clean boilerplate, set up `global.css` with financial-tool styling (clean, monospace numbers, light theme)

### Step 2: Core logic (no UI)
- **`types.ts`** — `Strategy`, `StrategyView`, `StrikeRow` interfaces, `VolatilityLevel` type
- **`premiumModel.ts`** — Volatility-adjusted premium estimation:
  - **Volatility input**: slider or dropdown with presets: Low (15%), Medium (25%), High (40%), Very High (60%), Custom (user enters %)
  - The volatility multiplier scales the base premium estimates. Base premiums assume ~25% IV (medium). The model applies a scaling factor of `(userVol / 25)` to all OTM/ATM time-value premiums
  - **Base heuristic** (at 25% IV, 30-day expiry):
    - ATM (within 0.5%): ~2.5% of strike
    - 0.5-5% OTM: linear 2.5% → 1.0%
    - 5-10% OTM: linear 1.0% → 0.3%
    - 10-20% OTM: linear 0.3% → 0.1%
    - 20%+ OTM: 0.05%
    - ITM: intrinsic value + time-value component (also scaled by volatility)
  - **Effect**: A high-volatility stock (e.g. 60% IV) will show ~2.4× higher estimated premiums than the baseline, which matches real market behavior — volatile stocks command higher option premiums
  - **Preset guidance in UI**: show examples next to volatility levels:
    - Low (15%): stable blue chips (Unilever, Nestlé)
    - Medium (25%): typical large caps (ASML, Shell)
    - High (40%): growth/tech stocks
    - Very High (60%): meme stocks, biotech, earnings plays
- **`strikeGenerator.ts`** — Generate 13 strikes around current price with smart step sizes (1 EUR for <50, 2.50 for <100, 5 for <250, etc.)
- **`calculations.ts`** — `buildStrikeRow()` computing: distance %, moneyness, monthly return %, annualized return % (simple ×12), capital required (per contract), break-even, max profit

### Step 3: Basic UI
- `PriceInput` — number input with EUR label, debounced (300ms)
- `VolatilityInput` — slider (range 10-80%) with preset buttons (Low/Medium/High/Very High) + custom input. Shows example stocks for each preset level. Changing volatility recalculates all estimated premiums in the table
- `StrategyToggle` — segmented control: CSP | CC | Both
- `OptionsTable` — table with columns: Strike, Distance %, Moneyness, Premium (estimated), Monthly Return %, Annual Return %, Capital Required, Break-even, Max Profit
- `App.tsx` — wire state: `currentPrice`, `volatility`, `strategyView`, generate rows, render table

### Step 4: Editable premiums
- `EditableCell` — click to edit, blur/Enter to commit, clear to revert to default
- `premiumOverrides` state in App — `Map<"csp-28", number>` keyed by strategy+strike so overrides survive price changes
- Visual indicator for overridden vs estimated values

### Step 5: Polish
- ATM row highlighting (blue tint)
- Moneyness color coding (green=OTM, yellow=ATM, red=ITM)
- `InfoBanner` — dismissable note about estimated premiums
- Responsive layout (stack tables on mobile)
- Number formatting (2dp currency, 2dp percentages)
- localStorage for last-used price and overrides

---

## Phase 2: Advanced Metrics (Nice-to-Have)

These extend the table with deeper trade evaluation. Implement after Phase 1 is fully working.

### New Columns

1. **Probability of Profit (PoP)** — % chance the option expires worthless. Uses a normal distribution CDF based on volatility, distance from current price, and 30-day timeframe. Formula: for CSP, `PoP = N(d2)` where `d2 = (ln(S/K) + (r - 0.5σ²)t) / (σ√t)` (simplified Black-Scholes d2). Display as percentage (e.g. "82%").

2. **Expected Value (EV)** — `(PoP × premium) - ((1 - PoP) × avg_loss)` per contract. Where avg_loss is estimated as half the distance between strike and break-even (conservative). Positive EV = mathematically favorable trade. Display in EUR.

3. **Premium per Day** — `effective_premium / 30`. Shows daily income rate. Useful for comparing across trades. Display in EUR (e.g. "0.02/day").

4. **Return if Assigned** — For CSP: effective purchase price = `strike - premium`, and what % discount that is from current price. For CC: total return = `(strike - current_price + premium) / current_price × 100%`. Answers "if I get assigned, is this still a good outcome?"

5. **Margin of Safety %** — `(current_price - break_even) / current_price × 100` for CSP. How far the stock can drop before you lose money. More intuitive than raw break-even.

### New UI Elements

6. **"Good Deal" Indicator** — Visual badge/highlight on rows where:
   - Annualized return > user-configurable threshold (default: 15%)
   - AND PoP > user-configurable threshold (default: 75%)
   - Shows a green checkmark or star icon. Thresholds adjustable via small settings popover.

7. **Risk/Reward Ratio** — `max_loss / max_profit`. For CSP: max_loss = `(strike - premium) × 100` (stock → 0). Puts premium in perspective — "I'm risking 2,800 to earn 50."

### Implementation Notes
- PoP calculation requires a normal CDF function — use a simple polynomial approximation (no library needed, ~10 lines of code)
- Add these as optional columns that can be toggled on/off to avoid overwhelming the table
- Phase 2 columns appear to the right of Phase 1 columns
- All Phase 2 metrics recalculate when price, volatility, or premium changes
- The "Good Deal" indicator works on both estimated and overridden premiums

### Files to Modify
- `src/types.ts` — extend `StrikeRow` with new fields
- `src/utils/calculations.ts` — add PoP, EV, margin of safety, return-if-assigned calculations
- `src/utils/probability.ts` (new) — normal CDF approximation
- `src/components/OptionsTable.tsx` — add new columns, toggle visibility, "Good Deal" badges
- `src/components/DealThresholds.tsx` (new) — small popover to set return/PoP thresholds
- `src/App.tsx` — add state for column visibility and deal thresholds

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Override map keyed by `strategy-strike` | Overrides survive when price changes regenerate the strike list |
| Simple annualization (×12) not compound | Industry convention for wheel strategy returns |
| Per-share premiums in model, per-contract in display | Matches how options are quoted vs. how capital is committed |
| Debounced price input (300ms) | Prevents thrashing during typing |
| Volatility scales time-value only, not intrinsic | ITM intrinsic value is deterministic; only the time-value portion should scale with IV |
| Volatility presets with stock examples | Helps user pick the right level without needing to look up actual IV |

---

## Table Example (30 EUR stock, CSP, Medium volatility 25%)

| Strike | Distance | Type | Est. Premium | Monthly % | Annual % | Capital | Break-even |
|--------|----------|------|-------------|-----------|----------|---------|------------|
| 24     | -20.0%   | OTM  | 0.03        | 0.13%     | 1.5%     | 2,400   | 23.97      |
| 27     | -10.0%   | OTM  | 0.09        | 0.33%     | 4.0%     | 2,700   | 26.91      |
| 28     | -6.7%    | OTM  | 0.20        | 0.71%     | 8.6%     | 2,800   | 27.80      |
| 29     | -3.3%    | OTM  | 0.41        | 1.41%     | 16.9%    | 2,900   | 28.59      |
| 30     | 0.0%     | ATM  | 0.75        | 2.50%     | 30.0%    | 3,000   | 29.25      |
| 31     | +3.3%    | ITM  | 1.15        | 3.71%     | 44.5%    | 3,100   | 29.85      |

At **High volatility (40%)**, the same 30 EUR stock would show ~1.6× higher premiums (e.g. ATM premium ~1.20 instead of 0.75).

---

## Real Data Note (displayed in app)

> Premiums shown are model estimates for comparison purposes. Real-time European options data (Euronext Amsterdam/DEGIRO) is not freely available via API. Click any premium cell to enter the actual market price you see on DEGIRO.

---

## Verification Plan

### Phase 1
1. `npm run dev` — app loads without errors
2. Enter 30 EUR — table shows 13 strikes from ~24-36 with reasonable premiums
3. Change to 50 EUR — table regenerates with strikes ~38-62 and scaled premiums
4. Change volatility from Medium to High — all estimated premiums increase by ~1.6×
5. Change volatility to Low — premiums decrease; far OTM options show very small premiums
6. Click a premium cell, type 0.50, press Enter — all derived columns update; changing volatility does NOT affect manually overridden premiums
7. Toggle between CSP/CC/Both — tables render correctly with appropriate calculations
8. Refresh page — localStorage restores last price, volatility, and overrides

### Phase 2
9. Toggle on advanced columns — PoP, EV, Premium/Day, Return if Assigned, Margin of Safety appear
10. PoP for deep OTM puts should be high (>90%), ATM should be ~50%, ITM should be low — verify this makes intuitive sense
11. Increase volatility — PoP for OTM options should decrease (more volatile = more chance of being hit)
12. "Good Deal" badges appear on rows meeting both thresholds; adjust thresholds and verify badges update
13. Override a premium — all Phase 2 metrics recalculate for that row
