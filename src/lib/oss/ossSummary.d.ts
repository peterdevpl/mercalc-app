import Decimal from 'decimal.js';

export type OssCountrySummary = {
  vatRate: Decimal;
  totalAmount: Decimal;
  totalVat: Decimal;
};

export type OssSummary = {
  year: number;
  month: number;
  countries: Map<string, OssCountrySummary>;
  totalVat: Decimal;
  orderAboveOssLimit: string | null;
};
