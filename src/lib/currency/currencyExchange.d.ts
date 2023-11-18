import Decimal from 'decimal.js';

export type ExchangeRate = {
  date: string;
  sourceName: string;
  sourceDescription: string;
  rate: Decimal;
};
