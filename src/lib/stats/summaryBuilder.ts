import Decimal from 'decimal.js';
import { IOrder } from '@/lib/orderList';
import { OrdersSummary } from '@/lib/stats/summary';

const euCountries = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT',
  'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'];

const thisCountry = 'PL';

export default function buildSummary(orders: IOrder[]): OrdersSummary {
  const summary: OrdersSummary = {
    totalPerCurrency: new Map<string, Decimal>(),
    totalConvertedToLocal: new Decimal(0),
    // below we assume calculations in EUR
    totalWithinEU: new Decimal(0),
    totalDomestic: new Decimal(0),
    totalOutsideEU: new Decimal(0)
  };

  for (const order of orders) {
    const total = summary.totalPerCurrency.get(order.currency);
    if (total === undefined) {
      summary.totalPerCurrency.set(order.currency, order.total);
    } else {
      summary.totalPerCurrency.set(order.currency, total.add(order.total));
    }

    if (order.currency === 'EUR') {
      if (order.country === thisCountry) {
        summary.totalDomestic = summary.totalDomestic.add(order.total);
      } else if (euCountries.indexOf(order.country) !== -1) {
        summary.totalWithinEU = summary.totalWithinEU.add(order.total);
      } else {
        summary.totalOutsideEU = summary.totalOutsideEU.add(order.total);
      }
    } else {
      // todo log this
    }
  }

  return summary;
}
