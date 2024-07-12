import Decimal from 'decimal.js';
import { ExchangeRate } from '@/lib/currency/currencyExchange';

export type IBuyer = {
  name: string;
  street: string;
  cityCountry: string;
}

export type IOrderItem = {
  unitPrice: Decimal;
  quantity: number;
  total: Decimal;
}

export type IOrder = {
  id: string;
  date: string;
  buyer: IBuyer;
  discount: Decimal;
  shipping: Decimal;
  total: Decimal;
  totalConverted: Decimal | null;
  rate: ExchangeRate | null;
  country: string;  // ISO code
  currency: string;  // ISO code
  items: IOrderItem[];
}

export type OrdersTimeline = {
  months: string[];
  quarters: string[];
  years: string[];
};

export type IOrderList = {
  orders: IOrder[];
  timeline: OrdersTimeline;
  // any other fields that should go in the global context - can live here
  // for component-specific data, use their state
}
