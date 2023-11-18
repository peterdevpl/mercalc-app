import { DateTime } from 'luxon';
import { ExchangeRate } from '@/lib/currency/currencyExchange';
import { IOrder } from '@/lib/orderList';
import { Result } from '@/lib/result';

export class ExchangeRateNotFound extends Error {
}

export function findExchangeRate(order: IOrder, ratesPerDate: Map<string, ExchangeRate>): Result<ExchangeRate, ExchangeRateNotFound> {
  let date = order.date;
  do {
    date = DateTime.fromISO(date).minus({days: 1}).toISODate() || '';
  } while (!ratesPerDate.has(date) && date >= '2022-12-30' && date !== '');

  const rate = ratesPerDate.get(date);
  if (!rate) {
    return {
      success: false,
      error: new Error(`Cannot find exchange rate for order ${order.currency} ${order.date}`)
    }
  }

  return {
    success: true,
    value: rate
  }
}
