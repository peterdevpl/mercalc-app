import buildInvoicingReport from '@/lib/invoice/invoicingReport';
import { DateTime } from 'luxon';
import Decimal from 'decimal.js';
import { ExchangeRate } from '@/lib/currency/currencyExchange';
import { IOrder } from '@/lib/orderList';

describe('invoicingReport', () => {
  it('it generates report from orders', () => {
    // given
    const zero = new Decimal(0);
    const rate1: ExchangeRate = {
      date: '2023-10-31',
      rate: new Decimal('4.5678'),
      sourceName: 'NBP',
      sourceDescription: '211/A/NBP/2023'
    };
    const rate2: ExchangeRate = {
      date: '2023-11-02',
      rate: new Decimal('4.5432'),
      sourceName: 'NBP',
      sourceDescription: '212/A/NBP/2023'
    };
    const orders: IOrder[] = [
      {
        id: '1',
        date: '2023-10-31',
        discount: zero,
        shipping: zero,
        total: new Decimal('10.00'),
        totalConverted: null,
        rate: null,
        country: 'PL',
        currency: 'EUR',
        items: []
      },
      {
        id: '2',
        date: '2023-11-02',
        discount: zero,
        shipping: zero,
        total: new Decimal('10.00'),
        totalConverted: new Decimal('45.68'),
        rate: rate1,
        country: 'PL',
        currency: 'EUR',
        items: []
      },
      {
        id: '3',
        date: '2023-11-03',
        discount: zero,
        shipping: zero,
        total: new Decimal('15.00'),
        totalConverted: new Decimal('68.15'),
        rate: rate2,
        country: 'DE',
        currency: 'EUR',
        items: []
      },
      {
        id: '4',
        date: '2023-12-01',
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
    const report = buildInvoicingReport(orders, '2023-11', 'FR/', 5, '/2023');

    // then
    expect(report.rows.length).toBe(2);
    expect(report.totalEur).toEqual(new Decimal('25.00'));
    expect(report.totalPln).toEqual(new Decimal('113.83'));

    expect(report.rows[0].rowId).toBe(1);
    expect(report.rows[0].invoiceNumber).toBe('FR/5/2023');
    expect(report.rows[0].date).toEqual(DateTime.fromISO('2023-11-02'));
    expect(report.rows[0].totalEur).toEqual(new Decimal('10.00'));
    expect(report.rows[0].exchangeRate).toBe(rate1);
    expect(report.rows[0].totalPln).toEqual(new Decimal('45.68'));
    expect(report.rows[0].country).toEqual('PL');

    expect(report.rows[1].rowId).toBe(2);
    expect(report.rows[1].invoiceNumber).toBe('FR/6/2023');
    expect(report.rows[1].date).toEqual(DateTime.fromISO('2023-11-03'));
    expect(report.rows[1].totalEur).toEqual(new Decimal('15.00'));
    expect(report.rows[1].exchangeRate).toBe(rate2);
    expect(report.rows[1].totalPln).toEqual(new Decimal('68.15'));
    expect(report.rows[1].country).toEqual('DE');
  })
})
