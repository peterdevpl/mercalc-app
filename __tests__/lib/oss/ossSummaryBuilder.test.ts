import buildOssSummary from '@/lib/oss/ossSummaryBuilder';
import Decimal from 'decimal.js';
import { IOrder } from '@/lib/orderList';

describe('ossSummaryBuilder', () => {
  it('builds an empty summary if a threshold is not exceeded and the company is not OSS', () => {
    // given
    const zero = new Decimal(0);
    const orders: IOrder[] = [
      {  // domestic
        id: '1',
        date: '2023-01-01',
        discount: zero,
        shipping: zero,
        total: new Decimal('1.23'),
        totalConverted: null,
        rate: null,
        country: 'PL',
        currency: 'EUR',
        items: []
      },
      {  // EU
        id: '2',
        date: '2023-02-01',
        discount: zero,
        shipping: zero,
        total: new Decimal('10000.00'),
        totalConverted: null,
        rate: null,
        country: 'DE',
        currency: 'EUR',
        items: []
      },
      {  // USA
        id: '3',
        date: '2023-03-01',
        discount: zero,
        shipping: zero,
        total: new Decimal('1.10'),
        totalConverted: null,
        rate: null,
        country: 'US',
        currency: 'EUR',
        items: []
      }
    ];

    // when
    const summary = buildOssSummary(orders, '2023-03', false);

    // then
    expect(summary.year).toBe(2023);
    expect(summary.month).toBe(3);
    expect(summary.countries.size).toBe(0);
    expect(summary.orderAboveOssLimit).toBeNull();
  })

  it('builds a monthly summary and finds an order exceeding the threshold if the company was not OSS last year', () => {
    // given
    const zero = new Decimal(0);
    const orders: IOrder[] = [
      {  // domestic
        id: '1',
        date: '2023-01-01',
        discount: zero,
        shipping: zero,
        total: new Decimal('1.23'),
        totalConverted: null,
        rate: null,
        country: 'PL',
        currency: 'EUR',
        items: []
      },
      {  // EU
        id: '2',
        date: '2023-02-01',
        discount: zero,
        shipping: zero,
        total: new Decimal('9990.01'),
        totalConverted: null,
        rate: null,
        country: 'DE',
        currency: 'EUR',
        items: []
      },
      {  // EU
        id: '3',
        date: '2023-02-02',
        discount: zero,
        shipping: zero,
        total: new Decimal('10.00'),
        totalConverted: null,
        rate: null,
        country: 'DE',
        currency: 'EUR',
        items: []
      },
      {  // USA
        id: '4',
        date: '2023-03-01',
        discount: zero,
        shipping: zero,
        total: new Decimal('1.10'),
        totalConverted: null,
        rate: null,
        country: 'US',
        currency: 'EUR',
        items: []
      }
    ];

    // when
    const summary = buildOssSummary(orders, '2023-02', false);

    // then
    expect(summary.year).toBe(2023);
    expect(summary.month).toBe(2);
    expect(summary.countries.size).toBe(1);
    expect(summary.countries.get('DE')?.vatRate).toEqual(new Decimal('0.19'));
    expect(summary.countries.get('DE')?.totalAmount).toEqual(new Decimal('10.00'));
    expect(summary.countries.get('DE')?.totalVat).toEqual(new Decimal('1.90'));
    expect(summary.orderAboveOssLimit).toEqual('3');
  })

  it('finds an order exceeding the threshold, but returns an empty report for a month before the threshold', () => {
    // given
    const zero = new Decimal(0);
    const orders: IOrder[] = [
      {  // EU
        id: '1',
        date: '2023-01-01',
        discount: zero,
        shipping: zero,
        total: new Decimal('1.23'),
        totalConverted: null,
        rate: null,
        country: 'FR',
        currency: 'EUR',
        items: []
      },
      {  // EU
        id: '2',
        date: '2023-02-01',
        discount: zero,
        shipping: zero,
        total: new Decimal('9990.01'),
        totalConverted: null,
        rate: null,
        country: 'DE',
        currency: 'EUR',
        items: []
      },
      {  // EU
        id: '3',
        date: '2023-02-02',
        discount: zero,
        shipping: zero,
        total: new Decimal('10.00'),
        totalConverted: null,
        rate: null,
        country: 'DE',
        currency: 'EUR',
        items: []
      },
      {  // USA
        id: '4',
        date: '2023-03-01',
        discount: zero,
        shipping: zero,
        total: new Decimal('1.10'),
        totalConverted: null,
        rate: null,
        country: 'US',
        currency: 'EUR',
        items: []
      }
    ];

    // when
    const summary = buildOssSummary(orders, '2023-01', false);

    // then
    expect(summary.year).toBe(2023);
    expect(summary.month).toBe(1);
    expect(summary.countries.size).toBe(0);
    expect(summary.orderAboveOssLimit).toEqual('3');
  })

  it('builds a summary from the beginning of the year if the company was OSS last year', () => {
    // given
    const zero = new Decimal(0);
    const orders: IOrder[] = [
      {  // EU
        id: '1',
        date: '2023-01-01',
        discount: zero,
        shipping: zero,
        total: new Decimal('50.00'),
        totalConverted: null,
        rate: null,
        country: 'FR',
        currency: 'EUR',
        items: []
      },
      {  // EU
        id: '2',
        date: '2023-01-02',
        discount: zero,
        shipping: zero,
        total: new Decimal('9990.00'),
        totalConverted: null,
        rate: null,
        country: 'DE',
        currency: 'EUR',
        items: []
      },
      {  // EU
        id: '3',
        date: '2023-01-03',
        discount: zero,
        shipping: zero,
        total: new Decimal('10.00'),
        totalConverted: null,
        rate: null,
        country: 'DE',
        currency: 'EUR',
        items: []
      },
      {  // EU
        id: '4',
        date: '2023-02-01',
        discount: zero,
        shipping: zero,
        total: new Decimal('1.10'),
        totalConverted: null,
        rate: null,
        country: 'NL',
        currency: 'EUR',
        items: []
      }
    ];

    // when
    const summary = buildOssSummary(orders, '2023-01', true);

    // then
    expect(summary.year).toBe(2023);
    expect(summary.month).toBe(1);
    expect(summary.countries.size).toBe(2);

    expect(summary.countries.get('DE')?.vatRate).toEqual(new Decimal('0.19'));
    expect(summary.countries.get('DE')?.totalAmount).toEqual(new Decimal('10000.00'));
    expect(summary.countries.get('DE')?.totalVat).toEqual(new Decimal('1900.00'));

    expect(summary.countries.get('FR')?.vatRate).toEqual(new Decimal('0.20'));
    expect(summary.countries.get('FR')?.totalAmount).toEqual(new Decimal('50.00'));
    expect(summary.countries.get('FR')?.totalVat).toEqual(new Decimal('10.00'));

    expect(summary.orderAboveOssLimit).toBeNull();
  })
})
