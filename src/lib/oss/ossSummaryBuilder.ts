import Decimal from 'decimal.js';
import { IOrder } from '@/lib/orderList';
import { OssCountrySummary, OssSummary } from '@/lib/oss/ossSummary';
import vatRates from '@/lib/oss/vatRates';

const euCountries = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT',
  'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'];

const thisCountry = 'PL';

const ossLimit = new Decimal('10000.00');

export default function buildOssSummary(orders: IOrder[], monthYear: string, isAlreadyOss: boolean): OssSummary {
  const zero = new Decimal(0);
  const year = monthYear.substring(0, 4);
  const month = parseInt(monthYear.substring(5, 7));
  const summary: OssSummary = {
    year: parseInt(year),
    month,
    countries: new Map<string, OssCountrySummary>(),
    orderAboveOssLimit: null
  };
  let totalWithinEU = zero;
  let countOrder = false;
  let vatRate: Decimal;

  for (let i = 0; i < orders.length; i++) {
    if (orders[i].date.substring(0, 4) !== year) {
      continue;
    }

    if (orders[i].country === thisCountry || !euCountries.includes(orders[i].country)) {
      continue;
    }

    countOrder = false;

    if (!isAlreadyOss) {
      totalWithinEU = totalWithinEU.add(orders[i].total);
      if (summary.orderAboveOssLimit === null && totalWithinEU.greaterThan(ossLimit)) {
        summary.orderAboveOssLimit = orders[i].id;
      }
      if (summary.orderAboveOssLimit !== null && monthYear === orders[i].date.substring(0, 7)) {
        countOrder = true;
      }
    } else if (monthYear === orders[i].date.substring(0, 7)) {
      countOrder = true;
    }

    if (countOrder) {
      vatRate = vatRates.get(orders[i].country) || zero;
      const vatAmount = orders[i].total.times(vatRate);
      let countrySummary = summary.countries.get(orders[i].country);
      if (countrySummary === undefined) {
        countrySummary = {
          vatRate,
          totalAmount: orders[i].total,
          totalVat: vatAmount
        };
        summary.countries.set(orders[i].country, countrySummary);
      } else {
        countrySummary.totalAmount = countrySummary.totalAmount.add(orders[i].total);
        countrySummary.totalVat = countrySummary.totalVat.add(vatAmount);
      }
    }
  }

  return summary;
}
