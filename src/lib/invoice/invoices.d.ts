import { DateTime } from 'luxon';
import Decimal from 'decimal.js';
import { ExchangeRate } from '@/lib/currency/currencyExchange';
import { Invoice } from '@/lib/invoice/invoice';

export type InvoiceRow = {
  rowId: number;
  orderId: string;
  invoiceType: string;
  invoiceNumber: string;
  buyerName: string;
  date: DateTime;
  totalNetEur: Decimal;
  totalVatEur: Decimal;
  totalEur: Decimal;
  exchangeRate: ExchangeRate | null;
  totalPln: Decimal | null;
  country: string;
  invoice: Invoice;
};

export type InvoicingReport = {
  rows: InvoiceRow[];
  totalEur: Decimal;
  totalPln: Decimal;
};
