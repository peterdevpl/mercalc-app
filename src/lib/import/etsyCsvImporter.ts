import { IOrder, IOrderItem } from '@/lib/orderList';
import { DateTime } from 'luxon';
import countries from '@/lib/import/countryNameParser';
import * as he from 'he';
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

    const discount = new Decimal(row.discount);
    const item: IOrderItem = {
      unitPrice: new Decimal(row.unitPrice),
      quantity: row.quantity,
      total: new Decimal(row.total).sub(discount)
    };
    order.items.push(item);

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
  shipName: string;
  shipAddress1: string;
  shipAddress2: string;
  shipCity: string;
  shipState: string;
  shipZipcode: string;
  country: string;
  currency: string;
  discount: string;
  shipping: string;
  unitPrice: string;
  quantity: number;
  total: string;
}

function parseRow(data: string[]): EtsyCsvRow
{
  return {
    orderId: data[24],
    date: data[0],
    shipName: data[17],
    shipAddress1: data[18],
    shipAddress2: data[19],
    shipCity: data[20],
    shipState: data[21],
    shipZipcode: data[22],
    country: data[23],
    currency: data[12],
    discount: data[7],
    shipping: data[9],
    unitPrice: data[4],
    quantity: Number.parseInt(data[3]),
    total: data[11]
  };
}

function buildFreshOrder(row: EtsyCsvRow): IOrder
{
  const countryCode = countries.get(row.country) || '';  // todo error handling

  return {
    id: row.orderId,
    date: DateTime.fromFormat(row.date, 'MM/dd/yy').toISODate() || '',  // todo error handling
    buyer: {
      // Etsy may provide encoded HTML entities instead of simple characters like apostrophe
      name: he.decode(row.shipName.trim()),
      street: he.decode((row.shipAddress1 + ' ' + row.shipAddress2).trim()),
      cityCountry: he.decode(buildCityCountry(countryCode, row))
    },
    discount: new Decimal(0),
    shipping: new Decimal(0),
    total: new Decimal(0),
    totalConverted: null,
    rate: null,
    country: countryCode,
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

function buildCityCountry(countryCode: string, row: EtsyCsvRow): string
{
  const city = row.shipZipcode + ' ' + row.shipCity;
  // const country = polishCountryNames.has(countryCode) ? ', ' + polishCountryNames.get(countryCode) : '';

  return city.trim();
}
