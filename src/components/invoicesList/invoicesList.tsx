import buildPDFInvoice from '@/lib/invoice/export/pdfInvoice';
import downloadBlob from '@/app/downloadBlob';
import formatMoney from '@/lib/i18n/moneyFormatter';
import { Invoice } from '@/lib/invoice/invoice';
import { InvoicingReport, InvoicingReportColumns } from '@/lib/invoice/invoices';
import polishCountryNames from '@/lib/i18n/polishCountryNames';
import { Table } from 'react-bootstrap';
import React from 'react';

export default function InvoicesList({ report, columns }: { report: InvoicingReport, columns: InvoicingReportColumns }) {
  const handleInvoice = (invoice: Invoice) => {
    const filename = (invoice.invoiceType + ' ' + invoice.invoiceNumber)
      .toLowerCase()
      .replace(/[\s\/]/g, '-');
    downloadBlob(buildPDFInvoice(invoice), filename + '.pdf');
  };

  let firstColspan = 0;
  let secondColspan = 0;

  return (
    <Table striped bordered>
      <thead>
        <tr>
          {columns.invoiceNumber && ++firstColspan && <th>Nr dokumentu</th>}
          {columns.issueDate && ++firstColspan && <th>Data wystawienia</th>}
          {columns.saleDate && ++firstColspan && <th>Data sprzedaży</th>}
          {columns.buyerName && ++firstColspan && <th>Nazwa kontrahenta</th>}
          {columns.country && ++firstColspan && <th>Kraj</th>}
          {columns.totalEur && <th>Kwota EUR brutto</th>}
          {columns.totalNetEur && ++secondColspan && <th>Kwota EUR netto</th>}
          {columns.totalVatEur && ++secondColspan && <th>VAT EUR</th>}
          {columns.exchangeRate && ++secondColspan && <th>Kurs EUR/PLN</th>}
          {columns.totalConverted && <th>Kwota PLN</th>}
        </tr>
      </thead>
      <tbody>
      {report.rows.map(row => (
        <tr key={row.rowId}>
          {columns.invoiceNumber && <td><a className="invoiceFile" onClick={() => handleInvoice(row.invoice)}>{row.invoiceNumber}</a></td>}
          {columns.issueDate && <td>{row.date.toFormat('dd-MM-yyyy')}</td>}
          {columns.saleDate && <td>{row.date.toFormat('dd-MM-yyyy')}</td>}
          {columns.buyerName && <td>{row.buyerName}</td>}
          {columns.country && <td>{polishCountryNames.get(row.country)}</td>}
          {columns.totalEur && <td>{formatMoney(row.totalEur)}</td>}
          {columns.totalNetEur && <td>{formatMoney(row.totalNetEur)}</td>}
          {columns.totalVatEur && <td>{formatMoney(row.totalVatEur)}</td>}
          {columns.exchangeRate && <td>{formatMoney(row.exchangeRate?.rate, 4)}</td>}
          {columns.totalConverted && <td>{formatMoney(row.totalPln)}</td>}
        </tr>
      ))}
      </tbody>
      <tfoot>
        <tr>
          {firstColspan && <th colSpan={firstColspan}>Suma</th>}
          {columns.totalEur && <td><strong>EUR {formatMoney(report.totalEur)}</strong></td>}
          {secondColspan && <td colSpan={secondColspan}></td>}
          {columns.totalConverted && <td><strong>PLN {formatMoney(report.totalPln)}</strong></td>}
        </tr>
      </tfoot>
    </Table>
  );
}
