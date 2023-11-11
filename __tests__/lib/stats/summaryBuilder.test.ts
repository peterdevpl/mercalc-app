import buildSummary from '@/lib/stats/summaryBuilder';
import { IOrder } from '@/lib/orderList';
import Decimal from 'decimal.js';

describe('SummaryBuilder', () => {
  it('builds an empty summary', () => {
    // given
    const zero = new Decimal(0);
    const orders: IOrder[] = [];

    // when
    const summary = buildSummary(orders);

    // then
    expect(summary.totalPerCurrency.size).toEqual(0);
    expect(summary.totalConvertedToLocal).toEqual(zero);
    expect(summary.totalWithinEU).toEqual(zero);
    expect(summary.totalDomestic).toEqual(zero);
    expect(summary.totalOutsideEU).toEqual(zero);
  })

  it('builds a summary in EUR split geographically', () => {
    // given
    const zero = new Decimal(0);
    const orders: IOrder[] = [
      {  // domestic
        id: '1',
        date: '11/01/2023',
        discount: zero,
        shipping: zero,
        total: new Decimal('1.23'),
        totalConverted: null,
        rate: null,
        country: 'Poland',
        currency: 'EUR',
        items: []
      },
      {  // domestic
        id: '2',
        date: '11/01/2023',
        discount: zero,
        shipping: zero,
        total: new Decimal('2.46'),
        totalConverted: null,
        rate: null,
        country: 'Poland',
        currency: 'EUR',
        items: []
      },
      {  // EU
        id: '3',
        date: '11/01/2023',
        discount: zero,
        shipping: zero,
        total: new Decimal('1.19'),
        totalConverted: null,
        rate: null,
        country: 'Germany',
        currency: 'EUR',
        items: []
      },
      {  // EU
        id: '4',
        date: '11/01/2023',
        discount: zero,
        shipping: zero,
        total: new Decimal('1.20'),
        totalConverted: null,
        rate: null,
        country: 'France',
        currency: 'EUR',
        items: []
      },
      {  // USA
        id: '5',
        date: '11/01/2023',
        discount: zero,
        shipping: zero,
        total: new Decimal('1.10'),
        totalConverted: null,
        rate: null,
        country: 'United States',
        currency: 'EUR',
        items: []
      },
      {  // USA
        id: '6',
        date: '11/01/2023',
        discount: zero,
        shipping: zero,
        total: new Decimal('2.20'),
        totalConverted: null,
        rate: null,
        country: 'United States',
        currency: 'EUR',
        items: []
      }
    ];

    // when
    const summary = buildSummary(orders);

    // then
    expect(summary.totalPerCurrency.size).toEqual(1);
    expect(summary.totalPerCurrency.get('EUR')).toEqual(new Decimal('9.38'));
    expect(summary.totalConvertedToLocal).toEqual(zero);
    expect(summary.totalWithinEU).toEqual(new Decimal('2.39'));
    expect(summary.totalDomestic).toEqual(new Decimal('3.69'));
    expect(summary.totalOutsideEU).toEqual(new Decimal('3.30'));
  })
})
