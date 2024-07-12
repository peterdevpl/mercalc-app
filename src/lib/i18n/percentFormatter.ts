import Decimal from 'decimal.js';

export default function formatPercent(value: Decimal | undefined | null, places: number = 0): string {
  return value ? value.times(100).toFixed(places).replace('.', ',') + '%' : '';
}
