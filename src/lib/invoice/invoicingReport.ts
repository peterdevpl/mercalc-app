import { DateTime } from 'luxon';
import Decimal from 'decimal.js';
import { IOrder } from '@/lib/orderList';
import { InvoicingReport } from '@/lib/invoice/invoices';

export default function buildInvoicingReport(orders: IOrder[], monthYear: string, prefix: string, start: number, suffix: string): InvoicingReport {
  const zero = new Decimal(0);
  const report: InvoicingReport = {
    rows: [],
    totalEur: zero,
    totalPln: zero
  };

  let rowId = 1;
  let invoiceNumber = start;
  for (let i = 0; i < orders.length; i++) {
    if (orders[i].date.substring(0, 7) !== monthYear) {
      continue;
    }
    report.rows.push({
      rowId,
      invoiceNumber: prefix + invoiceNumber.toString() + suffix,
      date: DateTime.fromISO(orders[i].date),
      totalEur: orders[i].total,
      totalPln: orders[i].totalConverted,
      exchangeRate: orders[i].rate,
      country: orders[i].country,
    });
    report.totalEur = report.totalEur.add(orders[i].total);
    report.totalPln = report.totalPln.add(orders[i].totalConverted ?? zero);
    rowId++;
    invoiceNumber++;
  }
  console.log(report);

  return report;
};
