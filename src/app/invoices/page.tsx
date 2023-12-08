'use client';

import buildInvoicingReport from '@/lib/invoice/invoicingReport';
import buildPDFInvoicesList from '@/lib/invoice/export/pdfInvoicesList';
import { Button } from 'react-bootstrap';
import downloadBlob from '@/app/downloadBlob';
import InvoicesList from '@/components/invoicesList/invoicesList';
import { InvoicingReport } from '@/lib/invoice/invoices';
import MonthYearSelector from '@/components/monthYearSelector/monthYearSelector';
import { useOrderList } from '@/context/orderListContext';
import React, { FormEvent, useState } from 'react';

export default function Invoices() {
  const context = useOrderList();

  const [ monthYear, setMonthYear ] = useState(context.orderList.timeline.months[context.orderList.timeline.months.length - 1]);
  const [ prefix, setPrefix ] = useState('FR/');
  const [ report, setReport ] = useState<InvoicingReport | null>(null);
  const [ start, setStart ] = useState('1');
  const [ suffix, setSuffix ] = useState('/2023');

  let contents;
  if (context.orderList.orders.length > 0) {
    const buildInvoiceList = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setReport(buildInvoicingReport(context.orderList.orders, monthYear, prefix, parseInt(start), suffix));
    }
    const handleMonthYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => setMonthYear(event.currentTarget.value);  // todo wrap the event, so we dont have to know if it's a select element
    const handlePrefixChange = (event: React.ChangeEvent<HTMLInputElement>) => setPrefix(event.currentTarget.value);
    const handleStartChange = (event: React.ChangeEvent<HTMLInputElement>) => setStart(event.currentTarget.value);
    const handleSuffixChange = (event: React.ChangeEvent<HTMLInputElement>) => setSuffix(event.currentTarget.value);

    const handlePDFExport = () => {
      if (report) {
        downloadBlob(buildPDFInvoicesList(report), 'raport-' + monthYear + '.pdf');
      }
    };

    contents = (
      <>
        <form onSubmit={buildInvoiceList}>
          <MonthYearSelector id="invoice-month" values={context.orderList.timeline.months} onChange={handleMonthYearChange} />
          <input type="text" id="invoice-prefix" value={prefix} onChange={handlePrefixChange} />
          <input type="number" id="invoice-start" value={start} onChange={handleStartChange} />
          <input type="text" id="invoice-suffix" value={suffix} onChange={handleSuffixChange} />
          <button type="submit">Utwórz zestawienie</button>
        </form>
        {report && <section>
          <InvoicesList report={report} />
          <div className="form-group">
            <Button variant="secondary" onClick={handlePDFExport}>Eksportuj do PDF</Button>
          </div>
        </section>}
      </>
    );
  } else {
    contents = <p>Brak zamówień na liście.</p>;
  }

  return (
    <main>
      <h1>Faktury</h1>
      {contents}
    </main>
  )
}
