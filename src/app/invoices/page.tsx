'use client';

import { BlobReader, BlobWriter, EntryMetaData, ZipWriter } from '@zip.js/zip.js';
import buildInvoicingReport from '@/lib/invoice/invoicingReport';
import buildCSVInvoicesList from '@/lib/invoice/export/csvInvoicesList';
import buildPDFInvoice from '@/lib/invoice/export/pdfInvoice';
import buildPDFInvoicesList from '@/lib/invoice/export/pdfInvoicesList';
import { Button } from 'react-bootstrap';
import { CompanyData } from '@/lib/invoice/companyData';
import CompanyDataForm from '@/components/invoicesList/companyDataForm';
import downloadBlob from '@/app/downloadBlob';
import { Invoice } from '@/lib/invoice/invoice';
import InvoicesList from '@/components/invoicesList/invoicesList';
import { InvoicingReport } from '@/lib/invoice/invoices';
import MonthYearSelector from '@/components/monthYearSelector/monthYearSelector';
import { useOrderList } from '@/context/orderListContext';
import React, { FormEvent, useEffect, useState } from 'react';

const STORAGE_COMPANY_DATA = 'companyData';
const STORAGE_INVOICE_TYPE = 'invoiceType';
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

function getInvoiceFilename(invoice: Invoice): string {
  return (invoice.invoiceType + ' ' + invoice.invoiceNumber)
    .toLowerCase()
    .replace(/[\s\/]/g, '-') + '.pdf';
}

async function buildZipFile(report: InvoicingReport) {
  const zipWriter = new ZipWriter(new BlobWriter('application/zip'));
  const files: Promise<EntryMetaData>[] = [];

  report.rows.forEach((row) => files.push(
    zipWriter.add(getInvoiceFilename(row.invoice), new BlobReader(buildPDFInvoice(row.invoice)))
  ));

  await Promise.all(files);

  return zipWriter.close();
}

export default function Invoices() {
  const context = useOrderList();

  const defaultSuffix = '/' + new Date().getFullYear();
  const [ monthYear, setMonthYear ] = useState(context.orderList.timeline.months[context.orderList.timeline.months.length - 1]);
  const [ type, setType ] = useState('Faktura VAT');
  const [ prefix, setPrefix ] = useState('FR/');
  const [ report, setReport ] = useState<InvoicingReport | null>(null);
  const [ start, setStart ] = useState('1');
  const [ suffix, setSuffix ] = useState(defaultSuffix);
  const [ companyData, setCompanyData ] = useState<CompanyData>(buildDefaultCompanyData());

  useEffect(() => {
    setType(window.localStorage?.getItem(STORAGE_INVOICE_TYPE) || 'Faktura VAT');
    setPrefix(window.localStorage?.getItem(STORAGE_INVOICE_PREFIX) ?? 'FR/');
    setSuffix(window.localStorage?.getItem(STORAGE_INVOICE_SUFFIX) ?? defaultSuffix);
    const rememberedCompanyData = window.localStorage?.getItem(STORAGE_COMPANY_DATA);
    if (rememberedCompanyData) {
      try {
        setCompanyData(JSON.parse(rememberedCompanyData));
      } catch (error) {}
    }
  }, []);

  let contents;
  if (context.orderList.orders.length > 0) {
    const buildInvoiceList = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setReport(buildInvoicingReport(context.orderList.orders, monthYear, companyData, type, prefix, parseInt(start), suffix));
    }
    const handleMonthYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => setMonthYear(event.currentTarget.value);  // todo wrap the event, so we dont have to know if it's a select element
    const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      window.localStorage?.setItem(STORAGE_INVOICE_TYPE, event.currentTarget.value);
      setType(event.currentTarget.value);
    }
    const handlePrefixChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      window.localStorage?.setItem(STORAGE_INVOICE_PREFIX, event.currentTarget.value);
      setPrefix(event.currentTarget.value);
    }
    const handleStartChange = (event: React.ChangeEvent<HTMLInputElement>) => setStart(event.currentTarget.value);
    const handleSuffixChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      window.localStorage?.setItem(STORAGE_INVOICE_SUFFIX, event.currentTarget.value);
      setSuffix(event.currentTarget.value);
    }

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
      window.localStorage?.setItem(STORAGE_COMPANY_DATA, JSON.stringify(newData));
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

    const handleDownloadAllPDF = () => {
      if (report) {
        buildZipFile(report).then((blob) => downloadBlob(blob, 'faktury-' + monthYear + '.zip'));
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
              <input type="text" id="invoice-type" value={type} required={true} onChange={handleTypeChange} />
              <input type="text" id="invoice-prefix" value={prefix} onChange={handlePrefixChange} />
              <input type="number" id="invoice-start" value={start} required={true} onChange={handleStartChange} />
              <input type="text" id="invoice-suffix" value={suffix} onChange={handleSuffixChange} />
              <Button variant="primary" type="submit">Utwórz zestawienie</Button>
            </div>
          </form>
        </section>
        {report && <section>
          <InvoicesList report={report} />
          <div className="form-group">
            <Button variant="secondary" onClick={handlePDFExport}>Eksportuj raport do PDF</Button>
            <Button variant="secondary" onClick={handleCSVExport}>Eksportuj raport do CSV</Button>
            <Button variant="warning" onClick={handleDownloadAllPDF}>Pobierz wszystkie faktury</Button>
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
