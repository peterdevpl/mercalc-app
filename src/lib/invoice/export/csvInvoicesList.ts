import formatMoney from '@/lib/i18n/moneyFormatter';
import { InvoiceRow, InvoicingReport, InvoicingReportColumns } from '@/lib/invoice/invoices';
import Papa from 'papaparse';
import polishCountryNames from '@/lib/i18n/polishCountryNames';

function buildHeader(columns: InvoicingReportColumns): string[] {
  const header = [];
  columns.invoiceNumber && header.push('Nr dokumentu');
  columns.issueDate && header.push('Data wystawienia');
  columns.saleDate && header.push('Data sprzedaży');
  columns.buyerName && header.push('Kontrahent');
  columns.country && header.push('Kraj');
  columns.totalEur && header.push('Kwota EUR brutto');
  columns.totalNetEur && header.push('Kwota EUR netto');
  columns.totalVatEur && header.push('VAT EUR');
  columns.exchangeRate && header.push('Kurs EUR/PLN');
  columns.totalConverted && header.push('Kwota PLN');

  return header;
}

function buildRow(row: InvoiceRow, columns: InvoicingReportColumns): string[] {
  const output = [];
  columns.invoiceNumber && output.push(row.invoiceNumber);
  columns.issueDate && output.push(row.date.toFormat('dd-MM-yyyy'));
  columns.saleDate && output.push(row.date.toFormat('dd-MM-yyyy'));
  columns.buyerName && output.push(row.invoice.buyer.name + ', ' + row.invoice.buyer.street + ', ' + row.invoice.buyer.cityCountry);
  columns.country && output.push(polishCountryNames.get(row.country) || '');
  columns.totalEur && output.push(formatMoney(row.totalEur));
  columns.totalNetEur && output.push(formatMoney(row.totalNetEur));
  columns.totalVatEur && output.push(formatMoney(row.totalVatEur));
  columns.exchangeRate && output.push(formatMoney(row.exchangeRate?.rate, 4));
  columns.totalConverted && output.push(formatMoney(row.totalPln));

  return output;
}

export default function buildCSVInvoicesList(report: InvoicingReport, columns: InvoicingReportColumns): Blob {
  const rows = [];
  rows.push(buildHeader(columns));

  for (let i = 0; i < report.rows.length; i++) {
    rows.push(buildRow(report.rows[i], columns));
  }

  const csv = Papa.unparse(rows, { delimiter: "\t" });
  return new Blob([csv], {type: 'text/csv'});
}
