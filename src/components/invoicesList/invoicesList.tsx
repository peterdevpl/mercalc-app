import countries from '@/lib/i18n/polishCountryNames';
import { InvoicingReport } from '@/lib/invoice/invoices';
import { Table } from 'react-bootstrap';
import React from 'react';

export default function InvoicesList({ report }: { report: InvoicingReport }) {
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
          <th>Kraj</th>
        </tr>
      </thead>
      <tbody>
      {report.rows.map(row => (
        <tr key={row.rowId}>
          <td>{row.rowId}.</td>
          <td>{row.invoiceNumber}</td>
          <td>{row.date.toFormat('dd-MM-yyyy')}</td>
          <td>{row.totalEur.toFixed(2)}</td>
          <td>{row.exchangeRate?.rate.toFixed(4)}</td>
          <td>{row.totalPln?.toFixed(2)}</td>
          <td>{countries.get(row.country)}</td>
        </tr>
      ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={3}>Suma</td>
          <td>EUR {report.totalEur.toFixed(2)}</td>
          <td></td>
          <td>PLN {report.totalPln.toFixed(2)}</td>
          <td></td>
        </tr>
      </tfoot>
    </Table>
  );
}
