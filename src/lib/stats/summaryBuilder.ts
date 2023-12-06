import Decimal from 'decimal.js';
import { IOrder } from '@/lib/orderList';
import { OrdersSummary } from '@/lib/stats/summary';

const euCountries = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT',
  'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'];

const thisCountry = 'PL';

// todo refactor and tests
export default function buildSummary(orders: IOrder[]): OrdersSummary {
  const zero = new Decimal(0);
  const summary: OrdersSummary = {
    totalPerCurrency: new Map<string, Decimal>(),
    totalConvertedToLocal: zero,
    // below we assume calculations in EUR
    totalWithinEU: zero,
    totalDomestic: zero,
    totalOutsideEU: zero,
    // below we have a local currency
    totalWithinEUConverted: zero,
    totalDomesticConverted: zero,
    totalOutsideEUConverted: zero
  };

  for (const order of orders) {
    const total = summary.totalPerCurrency.get(order.currency);
    if (total === undefined) {
      summary.totalPerCurrency.set(order.currency, order.total);
    } else {
      summary.totalPerCurrency.set(order.currency, total.add(order.total));
    }

    summary.totalConvertedToLocal = summary.totalConvertedToLocal.add(order.totalConverted ?? zero);

    if (order.currency === 'EUR') {
      if (order.country === thisCountry) {
        summary.totalDomestic = summary.totalDomestic.add(order.total);
        summary.totalDomesticConverted = summary.totalDomesticConverted.add(order.totalConverted ?? zero);
      } else if (euCountries.indexOf(order.country) !== -1) {
        summary.totalWithinEU = summary.totalWithinEU.add(order.total);
        summary.totalWithinEUConverted = summary.totalWithinEUConverted.add(order.totalConverted ?? zero);
      } else {
        summary.totalOutsideEU = summary.totalOutsideEU.add(order.total);
        summary.totalOutsideEUConverted = summary.totalOutsideEUConverted.add(order.totalConverted ?? zero);
      }
    } else {
      // todo log this
    }
  }

  return summary;
}
