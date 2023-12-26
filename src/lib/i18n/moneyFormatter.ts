import Decimal from 'decimal.js';

export default function formatMoney(amount: Decimal | undefined | null, places: number = 2): string {
  return amount ? amount.toFixed(places).replace('.', ',') : '';
}
