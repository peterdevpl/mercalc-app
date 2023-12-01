import Decimal from 'decimal.js';
import { OssSummary } from '@/lib/oss/ossSummary';

export type OrdersSummary = {
  totalPerCurrency: Map<string, Decimal>;
  totalConvertedToLocal: Decimal;
  totalWithinEU: Decimal;
  totalDomestic: Decimal;
  totalOutsideEU: Decimal;
  ossSummary: OssSummary | null;
};
