import Decimal from 'decimal.js';

export type IOrderItem = {
  total: Decimal;
}

export type IOrder = {
  id: string;
  date: string;
  discount: Decimal;
  shipping: Decimal;
  total: Decimal;
  totalConverted: Decimal | null;
  rate: Decimal | null;
  country: string;
  currency: string;
  items: IOrderItem[];
}

export type IOrderList = {
  orders: IOrder[];
  // any other fields that should go in the global context - can live here
  // for component-specific data, use their state
}
