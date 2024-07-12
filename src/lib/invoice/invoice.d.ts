import { CompanyData } from '@/lib/invoice/companyData';
import { DateTime } from 'luxon';
import Decimal from 'decimal.js';
import { ExchangeRate } from '@/lib/currency/currencyExchange';
import { IBuyer } from '@/lib/orderList';

export type InvoiceItem = {
  rowId: number;
  name: string;
  unitPrice: Decimal;
  quantity: number;
  unit: string;
  totalNet: Decimal;
  vatRate: Decimal | null;
  vatAmount: Decimal;
  totalGross: Decimal;
};

export type Invoice = {
  orderId: string;
  invoiceType: string;
  invoiceNumber: string;
  date: DateTime;
  buyer: IBuyer;
  totalNetEur: Decimal;
  totalVatEur: Decimal;
  totalEur: Decimal;
  exchangeRate: ExchangeRate | null;
  totalConverted: Decimal | null;
  country: string;
  issuer: CompanyData;
  items: InvoiceItem[];
};
