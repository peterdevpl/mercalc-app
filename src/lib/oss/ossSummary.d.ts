import Decimal from 'decimal.js';

export type OssCountrySummary = {
  vatRate: Decimal;
  totalVat: Decimal;
};

export type OssSummary = {
  countries: Map<string, OssCountrySummary>;
  orderAboveOssLimit: string;
};
