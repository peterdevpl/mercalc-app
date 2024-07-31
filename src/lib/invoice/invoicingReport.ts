import buildInvoice from '@/lib/invoice/invoiceBuilder';
import Decimal from 'decimal.js';
import { CompanyData } from '@/lib/invoice/companyData';
import { IOrder } from '@/lib/orderList';
import { InvoicingReport } from '@/lib/invoice/invoices';

export default function buildInvoicingReport(orders: IOrder[], monthYear: string, issuer: CompanyData, prefix: string, start: number, suffix: string): InvoicingReport {
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

    const number = prefix + invoiceNumber.toString() + suffix;
    const invoice = buildInvoice(orders[i], 'Faktura', number, issuer);  // todo: take type from input

    report.rows.push({
      rowId,
      orderId: invoice.orderId,
      invoiceType: invoice.invoiceType,
      invoiceNumber: invoice.invoiceNumber,
      date: invoice.date,
      buyerName: invoice.buyer.name,
      totalNetEur: invoice.totalNetEur,
      totalVatEur: invoice.totalVatEur,
      totalEur: invoice.totalEur,
      totalPln: invoice.totalConverted,
      exchangeRate: invoice.exchangeRate,
      country: invoice.country,
      invoice
    });
    report.totalEur = report.totalEur.add(orders[i].total);
    report.totalPln = report.totalPln.add(orders[i].totalConverted ?? zero);
    rowId++;
    invoiceNumber++;
  }

  return report;
};
