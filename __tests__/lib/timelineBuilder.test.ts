import buildTimeline from '@/lib/timelineBuilder';
import Decimal from 'decimal.js';
import { IOrder } from '@/lib/orderList';

describe('timelineBuilder', () => {
  it('builds a list of months, quarters and years from orders', () => {
    // given
    const zero = new Decimal(0);
    const orders: IOrder[] = [
      {
        id: '1',
        date: '2022-12-31',
        discount: zero,
        shipping: zero,
        total: new Decimal('1.23'),
        totalConverted: null,
        rate: null,
        country: 'PL',
        currency: 'EUR',
        items: []
      },
      {
        id: '2',
        date: '2023-01-01',
        discount: zero,
        shipping: zero,
        total: new Decimal('2.46'),
        totalConverted: null,
        rate: null,
        country: 'PL',
        currency: 'EUR',
        items: []
      },
      {
        id: '3',
        date: '2023-01-02',
        discount: zero,
        shipping: zero,
        total: new Decimal('1.19'),
        totalConverted: null,
        rate: null,
        country: 'DE',
        currency: 'EUR',
        items: []
      },
      {
        id: '4',
        date: '2023-04-01',
        discount: zero,
        shipping: zero,
        total: new Decimal('1.20'),
        totalConverted: null,
        rate: null,
        country: 'FR',
        currency: 'EUR',
        items: []
      }
    ];

    // when
    const timeline = buildTimeline(orders);

    // then
    expect(timeline.years).toEqual(['2022', '2023']);
    expect(timeline.quarters).toEqual(['2022-Q4', '2023-Q1', '2023-Q2']);
    expect(timeline.months).toEqual(['2022-12', '2023-01', '2023-04']);
  })
})
