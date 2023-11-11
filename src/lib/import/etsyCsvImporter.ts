import { IOrder, IOrderItem } from '@/lib/orderList';
import Decimal from 'decimal.js';

export default function importEtsyCsv(data: string[][]): IOrder[] {
  checkHeader(data[0]);

  const orders: IOrder[] = [];
  let order: IOrder | null = null;

  /* The Etsy order items CSV is sorted by date descending, we want to reverse it */
  for (let rowId = data.length - 1; rowId > 0; rowId--) {
    const row = parseRow(data[rowId]);

    if (order === null) {
      order = buildFreshOrder(row);
    } else if (row.orderId !== order.id) {
      processOrder(order);
      orders.push(order);
      order = buildFreshOrder(row);
    }

    const item: IOrderItem = {
      total: new Decimal(row.total)
    };
    order.items.push(item);

    if (row.discount !== '0' && row.discount !== '0.00') {
      order.discount = order.discount.add(new Decimal(row.discount));
    }

    if (row.shipping !== '0' && row.shipping !== '0.00') {
      order.shipping = new Decimal(row.shipping);
    }
  }

  if (order !== null) {
    /* The last order from the loop */
    processOrder(order);
    orders.push(order);
  }

  return orders;
}

function checkHeader(header: string[]): void
{
  if (header.length !== 33 || header[0] !== 'Sale Date' || header[32] !== 'SKU') {
    throw new Error('Nagłówek CSV jest niepoprawny');
  }
}

type EtsyCsvRow = {
  orderId: string;
  date: string;
  country: string;
  currency: string;
  discount: string;
  shipping: string;
  total: string;
}

function parseRow(data: string[]): EtsyCsvRow
{
  return {
    orderId: data[24],
    date: data[0],
    country: data[23],
    currency: data[12],
    discount: data[7],
    shipping: data[9],
    total: data[11]
  };
}

function buildFreshOrder(row: EtsyCsvRow): IOrder
{
  return {
    id: row.orderId,
    date: row.date,
    discount: new Decimal(0),
    shipping: new Decimal(0),
    total: new Decimal(0),
    totalConverted: null,
    rate: null,
    country: row.country,
    currency: row.currency,
    items: []
  };
}

function processOrder(order: IOrder): void
{
  for (const item of order.items) {
    order.total = order.total.add(item.total);
  }

  order.total = order.total.add(order.shipping).sub(order.discount);
}
