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
  items: IOrderItem[];
}

export type IOrderList = {
  orders: IOrder[];
}
