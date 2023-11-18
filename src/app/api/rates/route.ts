import * as fs from 'fs';
import * as path from 'path';
import { ExchangeRate } from '@/lib/currency/currencyExchange';
import Decimal from 'decimal.js';

type NBPRate = {
  no: string;
  effectiveDate: string;
  mid: number;
};

type NBPRates = {
  table: string;
  currency: string;
  code: string;
  rates: NBPRate[];
};

export async function GET(request: Request) {
  const filePath = path.resolve('rates-nbp.json');
  const ratesData = fs.readFileSync(filePath);
  const rawRates: NBPRates = JSON.parse(ratesData.toString());

  const allRates: ExchangeRate[] = [];
  for (const rate of rawRates.rates) {
    allRates.push({
      date: rate.effectiveDate,
      sourceName: 'NBP',
      sourceDescription: rate.no,
      rate: new Decimal(rate.mid.toFixed(4))
    });
  }

  return Response.json(allRates);
}
