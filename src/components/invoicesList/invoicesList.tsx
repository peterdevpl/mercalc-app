import buildPDFInvoice from '@/lib/invoice/export/pdfInvoice';
import downloadBlob from '@/app/downloadBlob';
import formatMoney from '@/lib/i18n/moneyFormatter';
import { Invoice } from '@/lib/invoice/invoice';
import { InvoicingReport } from '@/lib/invoice/invoices';
import { Table } from 'react-bootstrap';
import React from 'react';

export default function InvoicesList({ report }: { report: InvoicingReport }) {
  const handleInvoice = (invoice: Invoice) => {
    const filename = (invoice.invoiceType + ' ' + invoice.invoiceNumber)
      .toLowerCase()
      .replace(/[\s\/]/g, '-');
    downloadBlob(buildPDFInvoice(invoice), filename + '.pdf');
  };

  return (
    <Table striped bordered>
      <thead>
        <tr>
          <th>L.p.</th>
          <th>Nr faktury</th>
          <th>Data sprzedaży</th>
          <th>Kwota EUR</th>
          <th>Kurs przewalutowania</th>
          <th>Kwota PLN</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      {report.rows.map(row => (
        <tr key={row.rowId}>
          <td>{row.rowId}.</td>
          <td>{row.invoiceNumber}</td>
          <td>{row.date.toFormat('dd-MM-yyyy')}</td>
          <td>{formatMoney(row.totalEur)}</td>
          <td>{formatMoney(row.exchangeRate?.rate, 4)}</td>
          <td>{formatMoney(row.totalPln)}</td>
          <td><button onClick={() => handleInvoice(row.invoice)}>F</button></td>
        </tr>
      ))}
      </tbody>
      <tfoot>
        <tr>
          <th colSpan={3}>Suma</th>
          <td><strong>EUR {formatMoney(report.totalEur)}</strong></td>
          <td></td>
          <td><strong>PLN {formatMoney(report.totalPln)}</strong></td>
          <td></td>
        </tr>
      </tfoot>
    </Table>
  );
}
