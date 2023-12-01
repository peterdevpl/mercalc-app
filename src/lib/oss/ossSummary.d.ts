import Decimal from 'decimal.js';

export type OssCountrySummary = {
  vatRate: Decimal;
  totalAmount: Decimal;
  totalVat: Decimal;
};

export type OssSummary = {
  countries: Map<string, OssCountrySummary>;
  orderAboveOssLimit: string;
};
