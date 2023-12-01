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
        date: '2023-11-01',
        discount: zero,
        shipping: zero,
        total: new Decimal('1.23'),
        totalConverted: null,
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
        totalConverted: null,
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
        totalConverted: null,
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
        totalConverted: null,
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
        totalConverted: null,
        rate: null,
        country: 'US',
        currency: 'EUR',
        items: []
      },
      {  // USA
        id: '6',
        date: '2023-11-01',
        discount: zero,
        shipping: zero,
        total: new Decimal('2.20'),
        totalConverted: null,
        rate: null,
        country: 'US',
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
    expect(summary.ossSummary).toBeNull();
  })

  it('builds an OSS report', () => {
    // given
    const zero = new Decimal(0);
    const orders: IOrder[] = [
      {
        id: '1',
        date: '2023-11-01',
        discount: zero,
        shipping: zero,
        total: new Decimal('9999.99'),
        totalConverted: null,
        rate: null,
        country: 'DE',
        currency: 'EUR',
        items: []
      },
      {
        id: '2',
        date: '2023-11-02',
        discount: zero,
        shipping: zero,
        total: new Decimal('20.00'),
        totalConverted: null,
        rate: null,
        country: 'FR',
        currency: 'EUR',
        items: []
      },
      {
        id: '3',
        date: '2023-11-03',
        discount: zero,
        shipping: zero,
        total: new Decimal('10.00'),
        totalConverted: null,
        rate: null,
        country: 'IE',
        currency: 'EUR',
        items: []
      },
      {
        id: '4',
        date: '2023-11-03',
        discount: zero,
        shipping: zero,
        total: new Decimal('15.00'),
        totalConverted: null,
        rate: null,
        country: 'FR',
        currency: 'EUR',
        items: []
      },
    ];

    // when
    const summary = buildSummary(orders);

    // then
    expect(summary.ossSummary?.orderAboveOssLimit).toBe('2');
    expect(summary.ossSummary?.countries.size).toBe(2);
    expect(summary.ossSummary?.countries.get('FR')?.vatRate).toEqual(new Decimal('0.20'));
    expect(summary.ossSummary?.countries.get('FR')?.totalVat).toEqual(new Decimal('7.00'));
    expect(summary.ossSummary?.countries.get('IE')?.vatRate).toEqual(new Decimal('0.23'));
    expect(summary.ossSummary?.countries.get('IE')?.totalVat).toEqual(new Decimal('2.30'));
  })
})
