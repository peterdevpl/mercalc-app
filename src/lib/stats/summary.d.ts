import Decimal from 'decimal.js';

export type OrdersSummary = {
  totalPerCurrency: Map<string, Decimal>;
  totalConvertedToLocal: Decimal;
  totalWithinEU: Decimal;
  totalDomestic: Decimal;
  totalOutsideEU: Decimal;
  totalWithinEUConverted: Decimal;
  totalDomesticConverted: Decimal;
  totalOutsideEUConverted: Decimal;
};
