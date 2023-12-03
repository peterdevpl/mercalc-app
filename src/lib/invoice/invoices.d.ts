import { DateTime } from 'luxon';
import Decimal from 'decimal.js';
import { ExchangeRate } from '@/lib/currency/currencyExchange';

export type InvoiceRow = {
  rowId: number;
  invoiceNumber: string;
  date: DateTime;
  totalEur: Decimal;
  exchangeRate: ExchangeRate | null;
  totalPln: Decimal | null;
  country: string;
};

export type InvoicingReport = {
  rows: InvoiceRow[];
  totalEur: Decimal;
  totalPln: Decimal;
};
