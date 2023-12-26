import formatMoney from '@/lib/i18n/moneyFormatter';
import { InvoicingReport } from '@/lib/invoice/invoices';
import Papa from 'papaparse';

export default function buildCSVInvoicesList(report: InvoicingReport): Blob {
  const rows = [];
  rows.push(['L.p.', 'Nr faktury', 'Data sprzedaży', 'Kwota EUR', 'Kurs przewalutowania', 'Kwota PLN']);

  for (let i = 0; i < report.rows.length; i++) {
    rows.push([
      report.rows[i].rowId.toString(),
      report.rows[i].invoiceNumber,
      report.rows[i].date.toFormat('dd-MM-yyyy'),
      formatMoney(report.rows[i].totalEur),
      formatMoney(report.rows[i].exchangeRate?.rate, 4),
      formatMoney(report.rows[i].totalPln)
    ]);
  }

  const csv = Papa.unparse(rows);
  return new Blob([csv], {type: 'text/csv'});
}
