import buildInvoice from '@/lib/invoice/invoiceBuilder';
import Decimal from 'decimal.js';
import { CompanyData } from '@/lib/invoice/companyData';
import filterOrders from '@/lib/order/filterOrders';
import { IOrder } from '@/lib/orderList';
import { InvoicingReport } from '@/lib/invoice/invoices';
import { OrdersFilter } from '@/lib/order/ordersFilter';

export default function buildInvoicingReport(orders: IOrder[], issuer: CompanyData, type: string, prefix: string, start: number, suffix: string, filter: OrdersFilter): InvoicingReport {
  const zero = new Decimal(0);
  const report: InvoicingReport = {
    rows: [],
    totalEur: zero,
    totalPln: zero
  };

  let rowId = 1;
  let invoiceNumber = start;
  const filteredOrders = filterOrders(orders, filter);
  for (let i = 0; i < filteredOrders.length; i++) {
    const number = prefix + invoiceNumber.toString() + suffix;
    const invoice = buildInvoice(filteredOrders[i], type, number, issuer);

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
    report.totalEur = report.totalEur.add(filteredOrders[i].total);
    report.totalPln = report.totalPln.add(filteredOrders[i].totalConverted ?? zero);
    rowId++;
    invoiceNumber++;
  }

  return report;
};
