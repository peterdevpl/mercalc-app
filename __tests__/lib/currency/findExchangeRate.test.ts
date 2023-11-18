import { findExchangeRate } from '@/lib/currency/currencyConverter';
import { IOrder } from '@/lib/orderList';
import Decimal from 'decimal.js';
import { ExchangeRate } from '@/lib/currency/currencyExchange';

describe('findExchangeRate', () => {
  it('returns an exchange rate from the previous day', () => {
    // given
    const zero = new Decimal(0);
    const order: IOrder = {
      id: '1',
      date: '2023-11-01',
      discount: zero,
      shipping: zero,
      total: new Decimal('1.23'),
      totalConverted: null,
      rate: null,
      country: 'Poland',
      currency: 'EUR',
      items: []
    };

    const rate: ExchangeRate = {
      date: '2023-10-31',
      sourceName: 'NBP',
      sourceDescription: '211/A/NBP/2023',
      rate: new Decimal('4.4475')
    };

    const rates: Map<string, ExchangeRate> = new Map<string, ExchangeRate>();
    rates.set('2023-10-31', rate);

    // when
    const result = findExchangeRate(order, rates);

    // then
    expect(result.success).toBeTruthy();
    if (result.success) {
      expect(result.value).toBe(rate);
    }
  })

  it('finds an exchange rate over the weekend', () => {
    // given
    const zero = new Decimal(0);
    const order: IOrder = {
      id: '1',
      date: '2023-11-06',
      discount: zero,
      shipping: zero,
      total: new Decimal('1.23'),
      totalConverted: null,
      rate: null,
      country: 'Poland',
      currency: 'EUR',
      items: []
    };

    const rate: ExchangeRate = {
      date: '2023-11-03',
      sourceName: 'NBP',
      sourceDescription: '213/A/NBP/2023',
      rate: new Decimal('4.4569')
    };

    const rates: Map<string, ExchangeRate> = new Map<string, ExchangeRate>();
    rates.set('2023-11-03', rate);

    // when
    const result = findExchangeRate(order, rates);

    // then
    expect(result.success).toBeTruthy();
    if (result.success) {
      expect(result.value).toBe(rate);
    }
  })
})
