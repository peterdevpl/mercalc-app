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
    expect(summary.totalWithinEUConverted).toEqual(zero);
    expect(summary.totalDomesticConverted).toEqual(zero);
    expect(summary.totalOutsideEUConverted).toEqual(zero);
  })

  it('builds a summary in EUR split geographically', () => {
    // given
    const zero = new Decimal(0);
    const orders: IOrder[] = [
      {  // domestic
        id: '1',
        date: '2023-11-01',
        discount: zero,
        shipping: zero,
        total: new Decimal('1.23'),
        totalConverted: new Decimal('4.92'),
        rate: null,
        country: 'PL',
        currency: 'EUR',
        items: []
      },
      {  // domestic
        id: '2',
        date: '2023-11-01',
        discount: zero,
        shipping: zero,
        total: new Decimal('2.46'),
        totalConverted: new Decimal('9.84'),
        rate: null,
        country: 'PL',
        currency: 'EUR',
        items: []
      },
      {  // EU
        id: '3',
        date: '2023-11-01',
        discount: zero,
        shipping: zero,
        total: new Decimal('1.19'),
        totalConverted: new Decimal('4.76'),
        rate: null,
        country: 'DE',
        currency: 'EUR',
        items: []
      },
      {  // EU
        id: '4',
        date: '2023-11-01',
        discount: zero,
        shipping: zero,
        total: new Decimal('1.20'),
        totalConverted: new Decimal('4.80'),
        rate: null,
        country: 'FR',
        currency: 'EUR',
        items: []
      },
      {  // USA
        id: '5',
        date: '2023-11-01',
        discount: zero,
        shipping: zero,
        total: new Decimal('1.10'),
        totalConverted: new Decimal('4.40'),
        rate: null,
        country: 'US',
        currency: 'EUR',
        items: []
      },
      {  // Mexico
        id: '6',
        date: '2023-11-01',
        discount: zero,
        shipping: zero,
        total: new Decimal('2.20'),
        totalConverted: new Decimal('8.80'),
        rate: null,
        country: 'MX',
        currency: 'EUR',
        items: []
      }
    ];

    // when
    const summary = buildSummary(orders);

    // then
    expect(summary.totalPerCurrency.size).toEqual(1);
    expect(summary.totalPerCurrency.get('EUR')).toEqual(new Decimal('9.38'));
    expect(summary.totalConvertedToLocal).toEqual(new Decimal('37.52'));
    expect(summary.totalWithinEU).toEqual(new Decimal('2.39'));
    expect(summary.totalDomestic).toEqual(new Decimal('3.69'));
    expect(summary.totalOutsideEU).toEqual(new Decimal('3.30'));
    expect(summary.totalWithinEUConverted).toEqual(new Decimal('9.56'));
    expect(summary.totalDomesticConverted).toEqual(new Decimal('14.76'));
    expect(summary.totalOutsideEUConverted).toEqual(new Decimal('13.20'));
  })
})
