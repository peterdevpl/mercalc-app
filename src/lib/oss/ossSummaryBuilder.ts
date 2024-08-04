import Decimal from 'decimal.js';
import filterOrders from '@/lib/order/filterOrders';
import { IOrder } from '@/lib/orderList';
import { OrdersFilter } from '@/lib/order/ordersFilter';
import { OssCountrySummary, OssSummary } from '@/lib/oss/ossSummary';
import vatRates from '@/lib/oss/vatRates';

export default function buildOssSummary(orders: IOrder[], monthYear: string, isAlreadyOss: boolean): OssSummary {
  const zero = new Decimal(0);
  const year = monthYear.substring(0, 4);
  const month = parseInt(monthYear.substring(5, 7));
  const summary: OssSummary = {
    year: parseInt(year),
    month,
    countries: new Map<string, OssCountrySummary>(),
    totalVat: zero,
  };
  let vatRate: Decimal;
  let vatDivider: Decimal;

  const filter: OrdersFilter = {
    monthYear,
    hasDomestic: false,
    hasEUBelowOSS: isAlreadyOss,
    hasEUAboveOSS: true,
    hasOutsideEU: false,
  };
  const filteredOrders = filterOrders(orders, filter);

  for (let i = 0; i < filteredOrders.length; i++) {
    vatRate = vatRates.get(filteredOrders[i].country) || zero;
    vatDivider = vatRate.add(1);
    const net = filteredOrders[i].total.div(vatDivider).toDecimalPlaces(2);
    const vatAmount = filteredOrders[i].total.sub(net);
    summary.totalVat = summary.totalVat.add(vatAmount);  // this should go into some main invoice builder
    let countrySummary = summary.countries.get(filteredOrders[i].country);
    if (countrySummary === undefined) {
      countrySummary = {
        vatRate,
        totalAmount: filteredOrders[i].total,
        totalVat: vatAmount
      };
      summary.countries.set(filteredOrders[i].country, countrySummary);
    } else {
      countrySummary.totalAmount = countrySummary.totalAmount.add(filteredOrders[i].total);
      countrySummary.totalVat = countrySummary.totalVat.add(vatAmount);
    }
  }

  return summary;
}
