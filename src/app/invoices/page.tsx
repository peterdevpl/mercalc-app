'use client';

import buildInvoicingReport from '@/lib/invoice/invoicingReport';
import buildCSVInvoicesList from '@/lib/invoice/export/csvInvoicesList';
import buildPDFInvoicesList from '@/lib/invoice/export/pdfInvoicesList';
import { Button } from 'react-bootstrap';
import { CompanyData } from '@/lib/invoice/companyData';
import CompanyDataForm from '@/components/invoicesList/companyDataForm';
import downloadBlob from '@/app/downloadBlob';
import InvoicesList from '@/components/invoicesList/invoicesList';
import { InvoicingReport } from '@/lib/invoice/invoices';
import MonthYearSelector from '@/components/monthYearSelector/monthYearSelector';
import { useOrderList } from '@/context/orderListContext';
import React, { FormEvent, useState } from 'react';

const STORAGE_INVOICE_PREFIX = 'invoicePrefix';
const STORAGE_INVOICE_SUFFIX = 'invoiceSuffix';

function buildDefaultCompanyData(): CompanyData {
  return {
    vatId: '',
    name: '',
    street: '',
    zipCode: '',
    city: '',
    country: 'PL',
    bankName: '',
    bankAccount: ''
  };
}

export default function Invoices() {
  const context = useOrderList();

  const [ monthYear, setMonthYear ] = useState(context.orderList.timeline.months[context.orderList.timeline.months.length - 1]);
  const [ prefix, setPrefix ] = useState(localStorage?.getItem(STORAGE_INVOICE_PREFIX) || 'FR/');
  const [ report, setReport ] = useState<InvoicingReport | null>(null);
  const [ start, setStart ] = useState('1');
  const [ suffix, setSuffix ] = useState(localStorage?.getItem(STORAGE_INVOICE_SUFFIX) || '/' + new Date().getFullYear());
  const [ companyData, setCompanyData ] = useState<CompanyData>(buildDefaultCompanyData());

  let contents;
  if (context.orderList.orders.length > 0) {
    const buildInvoiceList = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setReport(buildInvoicingReport(context.orderList.orders, monthYear, companyData, prefix, parseInt(start), suffix));
    }
    const handleMonthYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => setMonthYear(event.currentTarget.value);  // todo wrap the event, so we dont have to know if it's a select element
    const handlePrefixChange = (event: React.ChangeEvent<HTMLInputElement>) => setPrefix(event.currentTarget.value);
    const handleStartChange = (event: React.ChangeEvent<HTMLInputElement>) => setStart(event.currentTarget.value);
    const handleSuffixChange = (event: React.ChangeEvent<HTMLInputElement>) => setSuffix(event.currentTarget.value);

    const handleCompanyDataChange = (field: string, value: string) => {
      const newData = structuredClone(companyData);
      switch (field) {
        case 'vatId': newData.vatId = value; break;
        case 'name': newData.name = value; break;
        case 'street': newData.street = value; break;
        case 'zipCode': newData.zipCode = value; break;
        case 'city': newData.city = value; break;
        case 'bankName': newData.bankName = value; break;
        case 'bankAccount': newData.bankAccount = value; break;
      }
      setCompanyData(newData);
    };

    const handlePDFExport = () => {
      if (report) {
        downloadBlob(buildPDFInvoicesList(report), 'raport-' + monthYear + '.pdf');
      }
    };

    const handleCSVExport = () => {
      if (report) {
        downloadBlob(buildCSVInvoicesList(report), 'raport-' + monthYear + '.csv');
      }
    };

    contents = (
      <>
        <section>
          <CompanyDataForm data={companyData} onChange={handleCompanyDataChange} />
        </section>
        <section>
          <form onSubmit={buildInvoiceList}>
            <div>
              <MonthYearSelector id="invoice-month" values={context.orderList.timeline.months} onChange={handleMonthYearChange} />
              <input type="text" id="invoice-prefix" value={prefix} onChange={handlePrefixChange} />
              <input type="number" id="invoice-start" value={start} onChange={handleStartChange} />
              <input type="text" id="invoice-suffix" value={suffix} onChange={handleSuffixChange} />
              <Button variant="primary" type="submit">Utwórz zestawienie</Button>
            </div>
          </form>
        </section>
        {report && <section>
          <InvoicesList report={report} />
          <div className="form-group">
            <Button variant="secondary" onClick={handlePDFExport}>Eksportuj do PDF</Button>
            <Button variant="secondary" onClick={handleCSVExport}>Eksportuj do CSV</Button>
          </div>
        </section>}
      </>
    );
  } else {
    contents = <section><p>Brak zamówień na liście.</p></section>;
  }

  return (
    <main>
      <h1>Faktury</h1>
      {contents}
    </main>
  )
}
