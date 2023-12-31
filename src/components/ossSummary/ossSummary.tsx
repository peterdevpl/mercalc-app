'use client';

import buildOssSummary from '@/lib/oss/ossSummaryBuilder';
import buildPDFOSSSummary from '@/lib/oss/export/pdfOssSummary';
import { Button, Col, Row, Table } from 'react-bootstrap';
import countries from '@/lib/i18n/polishCountryNames';
import downloadBlob from '@/app/downloadBlob';
import formatMoney from '@/lib/i18n/moneyFormatter';
import FormCheckInput from 'react-bootstrap/FormCheckInput';
import FormCheckLabel from 'react-bootstrap/FormCheckLabel';
import MonthYearSelector from '@/components/monthYearSelector/monthYearSelector';
import { useOrderList } from '@/context/orderListContext';
import React, { useState } from 'react';
import styles from './ossSummary.module.css';

export default function OssSummary() {
  const context = useOrderList();
  const [ monthYear, setMonthYear ] = useState(context.orderList.timeline.months[context.orderList.timeline.months.length - 1]);
  const [ isAlreadyOss, setIsAlreadyOss ] = useState(false);
  const summary = buildOssSummary(context.orderList.orders, monthYear, isAlreadyOss);
  const handleMonthYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => setMonthYear(event.currentTarget.value);  // todo wrap the event, so we dont have to know if it's a select element
  const handleIsAlreadyOssChange = (event: React.ChangeEvent<HTMLInputElement>) => setIsAlreadyOss(event.currentTarget.checked);

  const handlePDFExport = () => {
    downloadBlob(buildPDFOSSSummary(summary), 'raport-oss-' + monthYear + '.pdf');
  };

  const rows: any[] = [];
  summary.countries.forEach((value, key) => {
    rows.push({
      countryId: key,
      countryName: countries.get(key),
      vatRate: value.vatRate.times(100).toString() + '%',
      totalAmount: formatMoney(value.totalAmount),
      vatAmount: formatMoney(value.totalVat)
    });
  });

  let data;
  if (rows.length > 0) {
    rows.sort((a, b) => (a.countryName > b.countryName) ? 1 : -1);
    data = (
      <>
      <Table striped className={styles.ossSummary}>
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
        <tfoot>
          <tr>
            <th colSpan={3}>Suma</th>
            <td><strong>{formatMoney(summary.totalVat)}</strong></td>
          </tr>
        </tfoot>
      </Table>
      {summary.orderAboveOssLimit && <p>Zamówienie przekraczające limit OSS: {summary.orderAboveOssLimit}</p>}
      <div className="form-group">
        <Button variant="secondary" onClick={handlePDFExport}>Eksportuj do PDF</Button>
      </div>
      </>
    );
  } else {
    data = <p>W tym miesiącu nie płacisz VAT OSS.</p>;
  }

  return (
    <section>
      <form className={styles.form}>
        <Row>
          <Col md={2}>
            <MonthYearSelector id="month" values={context.orderList.timeline.months} onChange={handleMonthYearChange} />
          </Col>
          <Col>
            <FormCheckInput id="already-oss" type="checkbox" checked={isAlreadyOss} onChange={handleIsAlreadyOssChange} />
            <FormCheckLabel htmlFor="already-oss">Jestem już w OSS</FormCheckLabel>
          </Col>
        </Row>
      </form>
      {data}
    </section>
  );
}
