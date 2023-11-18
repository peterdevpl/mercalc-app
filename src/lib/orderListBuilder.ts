'use client';

import { IOrder, IOrderList } from '@/lib/orderList';
import { findExchangeRate } from '@/lib/currency/currencyConverter';
import { ExchangeRate } from '@/lib/currency/currencyExchange';
import Decimal from 'decimal.js';

export default async function buildOrderList(orders: IOrder[]): Promise<IOrderList> {
  const ordersList: IOrderList = {
    orders: orders,
  };

  const response = await fetch('/api/rates');
  if (!response.ok) {
    alert(response.statusText);
  }
  const rates: ExchangeRate[] = await response.json();

  convertCurrency(ordersList.orders, rates);

  return ordersList;
}

function convertCurrency(orders: IOrder[], rates: ExchangeRate[])
{
  // Optimization: convert an array of exchange rates to a map
  const ratesPerDate: Map<string, ExchangeRate> = new Map<string, ExchangeRate>();
  for (const rate of rates) {
    ratesPerDate.set(rate.date, rate);
  }

  for (const order of orders) {
    if (order.currency !== 'EUR') {
      continue;
    }

    const result = findExchangeRate(order, ratesPerDate);
    if (result.success) {
      order.rate = {
        date: result.value.date,
        sourceName: result.value.sourceName,
        sourceDescription: result.value.sourceDescription,
        rate: new Decimal(result.value.rate),  // JSON parser does not create an instance of Decimal
      };
      order.totalConverted = order.total.mul(result.value.rate);
    }
    // todo: error handling
  }
}
