'use client';

import buildSummary from '@/lib/stats/summaryBuilder';
import countries from '@/lib/i18n/polishCountryNames';
import { Table } from 'react-bootstrap';
import { useOrderList } from '@/context/orderListContext';

export default function OssSummary() {
  const context = useOrderList();
  const summary = buildSummary(context.orderList.orders);  // todo move to order list builder

  if (summary.ossSummary !== null) {
    const rows: any[] = [];
    summary.ossSummary.countries.forEach((value, key) => {
      rows.push({
        countryId: key,
        countryName: countries.get(key),
        vatRate: value.vatRate.times(100).toString() + '%',
        totalAmount: value.totalAmount.toFixed(2),
        vatAmount: value.totalVat.toFixed(2)
      });
    });
    rows.sort((a, b) => (a.countryName > b.countryName) ? 1 : -1);

    return (
      <section>
        <Table striped bordered>
          <thead>
            <tr>
              <th>Kraj</th>
              <th>Sprzedaż w EUR</th>
              <th>Stawka VAT</th>
              <th>Kwota VAT w EUR</th>
            </tr>
          </thead>
          <tbody>
          {rows.map((row) => {
            return (
              <tr key={row.countryId}>
                <td>{row.countryName}</td>
                <td>{row.totalAmount}</td>
                <td>{row.vatRate}</td>
                <td>{row.vatAmount}</td>
              </tr>
            );
          })}
          </tbody>
        </Table>
        <p>Zamówienie przekraczające limit OSS: {summary.ossSummary.orderAboveOssLimit}</p>
      </section>
    );
  } else {
    return (
      <section>
        <p>Brak zestawienia VAT OSS - nie przekroczono progu 10,000 EUR.</p>
      </section>
    );
  }
}
