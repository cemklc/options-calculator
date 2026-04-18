import { Nav } from './components/Nav';
import { PayoffChart, CALL_LINES, PUT_LINES } from './components/PayoffChart';

// ── Reusable pieces ─────────────────────────────────────────────────────────

function SectionHeader({ n, title, subtitle }: { n: string; title: string; subtitle?: string }) {
  return (
    <div className="tut-section-header">
      <span className="tut-section-num">{n}</span>
      <div>
        <h2 className="tut-section-title">{title}</h2>
        {subtitle && <p className="tut-section-sub">{subtitle}</p>}
      </div>
    </div>
  );
}

function Callout({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="tut-callout">
      <span className="tut-callout-icon">{icon}</span>
      <div>{children}</div>
    </div>
  );
}

function Tag({ type }: { type: 'buyer' | 'seller' }) {
  return (
    <span className={`tut-tag tut-tag-${type}`}>
      {type === 'buyer' ? 'BUYER' : 'SELLER'}
    </span>
  );
}

// ── Main tutorial ────────────────────────────────────────────────────────────

export function Tutorial() {
  return (
    <div className="tut-page">
      <Nav page="tutorial" />

      <div className="tut-container">

        {/* ── Hero ── */}
        <header className="tut-hero">
          <h1>Options Trading — From Zero to Premium Farming</h1>
          <p>
            A practical guide to understanding calls, puts, and why selling options
            is one of the most consistent income strategies available.
          </p>
        </header>

        {/* ══════════════════════════════════════════
            SECTION 1 — What is an option?
        ══════════════════════════════════════════ */}
        <section className="tut-section">
          <SectionHeader
            n="1"
            title="What Is an Option?"
            subtitle="A contract between two parties — one pays for a right, the other receives money and takes on an obligation."
          />

          <p className="tut-body">
            An option is a financial contract that gives the <strong>buyer</strong> the right —
            but <em>not</em> the obligation — to buy or sell 100 shares of a stock at a fixed
            price (the <strong>strike</strong>) before a set date (the <strong>expiry</strong>).
            The buyer pays a fee called the <strong>premium</strong>. The seller receives that
            premium and is legally obligated to fulfill the contract if the buyer chooses to exercise it.
          </p>

          <Callout icon="🏠">
            <strong>Analogy: the property option.</strong><br />
            Imagine you spot a house listed at €300,000 and expect prices to rise. You pay the
            owner €5,000 for a 30-day option to buy it at €300,000.
            <ul className="tut-list">
              <li>If the house rises to €340,000 → you exercise your option, buy at €300,000,
                and immediately have €40,000 in equity. Net gain: €35,000 after your €5,000 fee.</li>
              <li>If the house falls to €280,000 → you walk away. Max loss: €5,000 (your premium).</li>
              <li>The seller kept your €5,000 either way, and was only forced to sell
                if you chose to exercise.</li>
            </ul>
            Stock options work exactly the same way — except the underlying asset is shares,
            and one contract covers 100 shares.
          </Callout>

          <div className="tut-key-terms">
            <h3 className="tut-subsection-title">The four key elements of every option</h3>
            <div className="tut-terms-grid">
              <div className="tut-term">
                <div className="tut-term-label">Underlying</div>
                <div className="tut-term-def">The stock the option is written on (e.g. Shell, ASML).</div>
              </div>
              <div className="tut-term">
                <div className="tut-term-label">Strike price</div>
                <div className="tut-term-def">The fixed price at which the shares can be bought or sold. Set when the contract is created.</div>
              </div>
              <div className="tut-term">
                <div className="tut-term-label">Premium</div>
                <div className="tut-term-def">The price of the option itself — what the buyer pays per share. One contract = 100 shares.</div>
              </div>
              <div className="tut-term">
                <div className="tut-term-label">Expiry</div>
                <div className="tut-term-def">The date the contract expires. After this, the option is worthless if unexercised.</div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 2 — Call Options
        ══════════════════════════════════════════ */}
        <section className="tut-section">
          <SectionHeader
            n="2"
            title="Call Options — The Right to Buy"
            subtitle="A call gives the buyer the right to purchase 100 shares at the strike price, before expiry."
          />

          <div className="tut-sides">

            {/* Buyer side */}
            <div className="tut-side tut-side-buyer">
              <div className="tut-side-header">
                <Tag type="buyer" /> Long Call
              </div>
              <ul className="tut-side-list">
                <li><span className="tut-check">✓</span> Pays the premium upfront</li>
                <li><span className="tut-check">✓</span> Gets the <strong>right to buy</strong> 100 shares at the strike</li>
                <li><span className="tut-check">✓</span> Profits if the stock rises above the <em>break-even</em> (strike + premium)</li>
                <li><span className="tut-cross">✗</span> Max loss = premium paid (if stock stays below strike)</li>
              </ul>
              <div className="tut-motivation">
                "I expect this stock to rise significantly."
              </div>
            </div>

            {/* Seller side */}
            <div className="tut-side tut-side-seller">
              <div className="tut-side-header">
                <Tag type="seller" /> Short Call / Covered Call
              </div>
              <ul className="tut-side-list">
                <li><span className="tut-check">✓</span> Receives the premium immediately — cash in hand</li>
                <li><span className="tut-cross">✗</span> <strong>Must sell</strong> 100 shares at the strike if assigned</li>
                <li><span className="tut-check">✓</span> Keeps the full premium if stock stays below break-even</li>
                <li><span className="tut-cross">✗</span> If uncovered: unlimited loss risk as stock rises</li>
                <li><span className="tut-neutral">→</span> If covered (owns shares): capped upside, but protected</li>
              </ul>
              <div className="tut-motivation">
                "I own shares and am happy to sell them at my target price."
              </div>
            </div>
          </div>

          {/* Call example */}
          <div className="tut-example">
            <div className="tut-example-title">Worked example — ASML at €780</div>
            <div className="tut-example-setup">
              Call option · Strike €820 · Premium €15/share · Expiry: 30 days · Contract: 100 shares (€1,500 cost)
            </div>
            <div className="tut-example-scenarios">
              <div className="tut-scenario tut-scenario-good">
                <div className="tut-scenario-label">Stock rises to €860 at expiry</div>
                <div className="tut-scenario-side">
                  <strong>Buyer:</strong> exercises the call, buys 100 shares at €820 (worth €860) →
                  profit = (€860 − €820 − €15) × 100 = <strong>+€2,500</strong>
                </div>
                <div className="tut-scenario-side">
                  <strong>Seller (covered):</strong> shares called away at €820 →
                  collected €1,500 premium + €820×100 proceeds, missed the extra €40 gain.
                  Net outcome: <strong>+€1,500 premium</strong> (capped upside)
                </div>
              </div>
              <div className="tut-scenario tut-scenario-bad">
                <div className="tut-scenario-label">Stock stays at €780 at expiry</div>
                <div className="tut-scenario-side">
                  <strong>Buyer:</strong> call expires worthless →
                  loss = <strong>−€1,500</strong> (premium paid)
                </div>
                <div className="tut-scenario-side">
                  <strong>Seller:</strong> option not exercised, keeps all premium →
                  profit = <strong>+€1,500</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Call payoff diagram */}
          <div className="tut-chart-section">
            <h3 className="tut-subsection-title">Payoff diagram at expiry</h3>
            <p className="tut-body tut-chart-caption">
              The <span style={{ color: '#2563eb', fontWeight: 700 }}>buyer's</span> loss is
              capped at the premium paid. The <span style={{ color: '#dc2626', fontWeight: 700 }}>seller's</span> profit
              is capped at the premium received — but their loss grows if the stock surges above the strike.
              The yellow dashed line marks the break-even price (strike + premium).
            </p>
            <PayoffChart lines={CALL_LINES} type="call" />
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 3 — Put Options
        ══════════════════════════════════════════ */}
        <section className="tut-section">
          <SectionHeader
            n="3"
            title="Put Options — The Right to Sell"
            subtitle="A put gives the buyer the right to sell 100 shares at the strike price, before expiry."
          />

          <div className="tut-sides">

            {/* Buyer side */}
            <div className="tut-side tut-side-buyer">
              <div className="tut-side-header">
                <Tag type="buyer" /> Long Put
              </div>
              <ul className="tut-side-list">
                <li><span className="tut-check">✓</span> Pays the premium upfront</li>
                <li><span className="tut-check">✓</span> Gets the <strong>right to sell</strong> 100 shares at the strike</li>
                <li><span className="tut-check">✓</span> Profits if the stock falls below break-even (strike − premium)</li>
                <li><span className="tut-cross">✗</span> Max loss = premium paid (if stock stays above strike)</li>
              </ul>
              <div className="tut-motivation">
                "I think this stock will fall — or I want insurance on a position I already hold."
              </div>
            </div>

            {/* Seller side */}
            <div className="tut-side tut-side-seller">
              <div className="tut-side-header">
                <Tag type="seller" /> Short Put / Cash-Secured Put
              </div>
              <ul className="tut-side-list">
                <li><span className="tut-check">✓</span> Receives the premium immediately</li>
                <li><span className="tut-cross">✗</span> <strong>Must buy</strong> 100 shares at the strike if assigned</li>
                <li><span className="tut-check">✓</span> Keeps the full premium if stock stays above break-even</li>
                <li><span className="tut-neutral">→</span> "Cash-secured" means you set aside the full strike × 100 as collateral</li>
                <li><span className="tut-neutral">→</span> If assigned: you own shares at an effective cost = strike − premium</li>
              </ul>
              <div className="tut-motivation">
                "I'm happy to own this stock at the strike price, and I'll earn income while waiting."
              </div>
            </div>
          </div>

          {/* Put example */}
          <div className="tut-example">
            <div className="tut-example-title">Worked example — Shell at €30</div>
            <div className="tut-example-setup">
              Put option · Strike €28 · Premium €0.40/share · Expiry: 30 days · Contract: 100 shares (€40 income for seller)
            </div>
            <div className="tut-example-scenarios">
              <div className="tut-scenario tut-scenario-good">
                <div className="tut-scenario-label">Shell falls to €24 at expiry</div>
                <div className="tut-scenario-side">
                  <strong>Buyer:</strong> exercises the put, sells 100 shares at €28 (worth €24) →
                  profit = (€28 − €24 − €0.40) × 100 = <strong>+€360</strong>
                </div>
                <div className="tut-scenario-side">
                  <strong>Seller (CSP):</strong> must buy 100 shares at €28, worth €24 →
                  net cost per share = €28 − €0.40 = €27.60. Still a loss vs current price:
                  <strong> −€360</strong> (but owns shares bought 8% cheaper than today's price)
                </div>
              </div>
              <div className="tut-scenario tut-scenario-neutral">
                <div className="tut-scenario-label">Shell stays at €30 at expiry (most common outcome)</div>
                <div className="tut-scenario-side">
                  <strong>Buyer:</strong> put expires worthless →
                  loss = <strong>−€40</strong>
                </div>
                <div className="tut-scenario-side">
                  <strong>Seller:</strong> option not exercised, keeps all premium →
                  profit = <strong>+€40</strong> on €2,800 capital = 1.43% monthly / 17.1% annualised
                </div>
              </div>
            </div>
          </div>

          {/* Put payoff diagram */}
          <div className="tut-chart-section">
            <h3 className="tut-subsection-title">Payoff diagram at expiry</h3>
            <p className="tut-body tut-chart-caption">
              The <span style={{ color: '#2563eb', fontWeight: 700 }}>buyer</span> profits
              as the stock falls. The <span style={{ color: '#dc2626', fontWeight: 700 }}>CSP seller</span> collects
              a capped premium but risks being forced to buy at the strike if the stock crashes.
              Break-even for the seller = strike − premium (€90 here).
            </p>
            <PayoffChart lines={PUT_LINES} type="put" />
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 4 — Moneyness
        ══════════════════════════════════════════ */}
        <section className="tut-section">
          <SectionHeader
            n="4"
            title="In, At, and Out of the Money"
            subtitle="Where the strike sits relative to the current stock price affects premium size, risk, and probability of assignment."
          />

          <div className="tut-moneyness-grid">

            {/* Call moneyness */}
            <div className="tut-money-block">
              <div className="tut-money-title">For a CALL (right to buy)</div>
              <div className="tut-money-row tut-money-itm">
                <div className="tut-money-badge">ITM</div>
                <div>
                  <strong>In the Money</strong><br />
                  Stock price is <em>above</em> the strike. The call has intrinsic value — exercising
                  it now would be profitable. Higher premium, higher chance of assignment.
                  <div className="tut-money-eg">e.g. Stock €110, Strike €100 → €10 intrinsic value</div>
                </div>
              </div>
              <div className="tut-money-row tut-money-atm">
                <div className="tut-money-badge">ATM</div>
                <div>
                  <strong>At the Money</strong><br />
                  Stock price ≈ strike. Maximum time value. Highest uncertainty about whether
                  it will be exercised.
                  <div className="tut-money-eg">e.g. Stock €100, Strike €100</div>
                </div>
              </div>
              <div className="tut-money-row tut-money-otm">
                <div className="tut-money-badge">OTM</div>
                <div>
                  <strong>Out of the Money</strong><br />
                  Stock price is <em>below</em> the strike. No intrinsic value — only time value.
                  Lower premium, lower chance of assignment.
                  <div className="tut-money-eg">e.g. Stock €90, Strike €100 → strike is too high to exercise</div>
                </div>
              </div>
            </div>

            {/* Put moneyness */}
            <div className="tut-money-block">
              <div className="tut-money-title">For a PUT (right to sell)</div>
              <div className="tut-money-row tut-money-itm">
                <div className="tut-money-badge">ITM</div>
                <div>
                  <strong>In the Money</strong><br />
                  Stock price is <em>below</em> the strike. The put has intrinsic value — you could
                  sell at a price higher than market. Higher premium, higher assignment risk.
                  <div className="tut-money-eg">e.g. Stock €90, Strike €100 → €10 intrinsic value</div>
                </div>
              </div>
              <div className="tut-money-row tut-money-atm">
                <div className="tut-money-badge">ATM</div>
                <div>
                  <strong>At the Money</strong><br />
                  Stock price ≈ strike. Highest time value, ~50% chance of expiring worthless.
                  <div className="tut-money-eg">e.g. Stock €100, Strike €100</div>
                </div>
              </div>
              <div className="tut-money-row tut-money-otm">
                <div className="tut-money-badge">OTM</div>
                <div>
                  <strong>Out of the Money</strong><br />
                  Stock price is <em>above</em> the strike. No intrinsic value, only time value.
                  Lower premium, high probability of expiring worthless (desirable for sellers).
                  <div className="tut-money-eg">e.g. Stock €110, Strike €100 → no reason to sell at €100</div>
                </div>
              </div>
            </div>
          </div>

          <Callout icon="⏱️">
            <strong>Time decay (theta):</strong> Every day that passes, the time value of an option
            shrinks — even if the stock doesn't move. This decay accelerates as expiry approaches.
            This is why option <em>sellers</em> benefit from time passing: they collected the premium
            upfront and just need the option to expire worthless.
          </Callout>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 5 — The Wheel Strategy
        ══════════════════════════════════════════ */}
        <section className="tut-section">
          <SectionHeader
            n="5"
            title="The Seller's Edge — Premium Farming"
            subtitle="Selling options consistently is a way to generate monthly income on stocks you're willing to own."
          />

          <p className="tut-body">
            Most retail option traders buy options hoping for a big move. The math is stacked
            against them — the premium they pay includes a "volatility premium" that statistically
            overestimates how much the stock will actually move.
          </p>
          <p className="tut-body">
            <strong>Sellers take the other side.</strong> By selling options on stocks you
            understand and are comfortable owning, you collect income month after month — whether
            the stock moves or not. The two main strategies are:
          </p>

          <div className="tut-strategies">

            <div className="tut-strategy-card">
              <div className="tut-strategy-num">Step 1</div>
              <div className="tut-strategy-name">Cash-Secured Put (CSP)</div>
              <div className="tut-strategy-body">
                <p>Sell a put below the current stock price. Set aside enough cash to buy 100 shares
                at the strike if assigned.</p>
                <ul className="tut-list">
                  <li>Stock stays above strike → keep premium, repeat next month</li>
                  <li>Stock falls below strike → get assigned, buy shares at an effective
                    discount (strike − premium)</li>
                </ul>
                <div className="tut-strategy-eg">
                  Shell at €30 · Sell €28 put for €0.40 · Monthly return: 1.43% on capital
                </div>
              </div>
            </div>

            <div className="tut-wheel-arrow">↓ if assigned</div>

            <div className="tut-strategy-card">
              <div className="tut-strategy-num">Step 2</div>
              <div className="tut-strategy-name">Covered Call (CC)</div>
              <div className="tut-strategy-body">
                <p>Now you own 100 shares. Sell a call above the current price to collect
                income while holding.</p>
                <ul className="tut-list">
                  <li>Stock stays below strike → keep premium, repeat next month</li>
                  <li>Stock rises above strike → shares called away at a profit, return to Step 1</li>
                </ul>
                <div className="tut-strategy-eg">
                  Bought at €27.60 · Sell €30 call for €0.50 · Monthly return: 1.81%
                </div>
              </div>
            </div>

          </div>

          <Callout icon="⚠️">
            <strong>Real risks to understand:</strong>
            <ul className="tut-list">
              <li><strong>Assignment risk:</strong> You <em>must</em> buy/sell the shares. Only sell
                puts on stocks you genuinely want to own at the strike price.</li>
              <li><strong>Gap risk:</strong> A stock can fall 30% overnight on bad news. Your
                break-even protects you a little, but not from catastrophic drops.</li>
              <li><strong>Opportunity cost:</strong> If the stock rockets above your call strike,
                you miss out on those gains.</li>
            </ul>
          </Callout>

          <div className="tut-cta-block">
            <div className="tut-cta-text">
              <strong>Ready to evaluate a trade?</strong><br />
              Enter a stock price, choose a volatility level, and the calculator shows you
              estimated premiums, monthly returns, and break-evens for every strike across CSPs and Covered Calls.
            </div>
            <a href="#/" className="tut-cta-btn">Open the Calculator →</a>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 6 — Glossary
        ══════════════════════════════════════════ */}
        <section className="tut-section">
          <SectionHeader n="6" title="Quick Reference Glossary" />

          <div className="tut-glossary">
            {[
              ['Assignment', 'When the option buyer exercises their right, forcing the seller to buy or sell the shares.'],
              ['Break-even', 'The stock price at which the trade makes neither profit nor loss at expiry. For a short put: strike − premium. For a short call: strike + premium.'],
              ['Call option', 'Gives the buyer the right to buy 100 shares at the strike price before expiry.'],
              ['Contract', 'One options contract covers 100 shares. Premiums are quoted per share; multiply by 100 for total cost.'],
              ['Covered call', 'Selling a call while owning the underlying shares. The shares "cover" the obligation.'],
              ['Cash-secured put', 'Selling a put while holding enough cash to buy the shares if assigned.'],
              ['Expiry', 'The date the option contract ends. After this, the option is void if unexercised.'],
              ['Implied Volatility (IV)', 'The market\'s estimate of future volatility, baked into the option price. Higher IV → higher premiums.'],
              ['Intrinsic value', 'The immediate exercise value of an option. A €100 call with stock at €115 has €15 intrinsic value.'],
              ['OTM / ATM / ITM', 'Out of / At / In the money. Describes where the strike is relative to the current stock price.'],
              ['Premium', 'The price of the option per share. The buyer pays it; the seller receives it.'],
              ['Put option', 'Gives the buyer the right to sell 100 shares at the strike price before expiry.'],
              ['Strike price', 'The fixed price at which shares can be bought (call) or sold (put) if the option is exercised.'],
              ['Theta (time decay)', 'The daily erosion of an option\'s time value. Options lose value as expiry approaches — good for sellers.'],
              ['The Wheel', 'A strategy of selling CSPs until assigned, then selling covered calls until shares are called away, then repeating.'],
            ].map(([term, def]) => (
              <div key={term} className="tut-glossary-row">
                <dt className="tut-glossary-term">{term}</dt>
                <dd className="tut-glossary-def">{def}</dd>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
