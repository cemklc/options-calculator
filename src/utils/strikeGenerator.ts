function stepSize(price: number): number {
  if (price < 50) return 1;
  if (price < 100) return 2.5;
  if (price < 250) return 5;
  return 10;
}

export function generateStrikes(currentPrice: number): number[] {
  const step = stepSize(currentPrice);
  const atm = Math.round(currentPrice / step) * step;
  const strikes: number[] = [];
  for (let i = -6; i <= 6; i++) {
    const s = Math.round((atm + i * step) * 1000) / 1000;
    if (s > 0) strikes.push(s);
  }
  return strikes;
}
