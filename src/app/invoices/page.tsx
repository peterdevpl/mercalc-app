'use client';

import { BlobReader, BlobWriter, EntryMetaData, ZipWriter } from '@zip.js/zip.js';
import buildInvoicingReport from '@/lib/invoice/invoicingReport';
import buildCSVInvoicesList from '@/lib/invoice/export/csvInvoicesList';
import buildPDFInvoice from '@/lib/invoice/export/pdfInvoice';
import buildPDFInvoicesList from '@/lib/invoice/export/pdfInvoicesList';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { CompanyData } from '@/lib/invoice/companyData';
import CompanyDataForm from '@/components/invoicesList/companyDataForm';
import downloadBlob from '@/app/downloadBlob';
import { Invoice } from '@/lib/invoice/invoice';
import InvoicesList from '@/components/invoicesList/invoicesList';
import { InvoicingReport, InvoicingReportColumns } from '@/lib/invoice/invoices';
import MonthYearSelector from '@/components/monthYearSelector/monthYearSelector';
import { OrdersFilter } from '@/lib/order/ordersFilter';
import { useOrderList } from '@/context/orderListContext';
import React, { FormEvent, useEffect, useState } from 'react';

const STORAGE_COLUMNS = 'invoiceReportColumns';
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

function buildDefaultFilter(monthYear: string): OrdersFilter {
  return {
    monthYear,
    hasDomestic: false,
    hasEUBelowOSS: false,
    hasEUAboveOSS: false,
    hasOutsideEU: false,
  };
}

function buildDefaultColumns(): InvoicingReportColumns {
  return {
    invoiceNumber: true,
    issueDate: true,
    saleDate: true,
    buyerName: true,
    country: true,
    totalEur: true,
    totalNetEur: true,
    totalVatEur: true,
    exchangeRate: true,
    totalConverted: true,
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

  const defaultMonthYear = context.orderList.timeline.months[context.orderList.timeline.months.length - 1];
  const defaultSuffix = '/' + new Date().getFullYear();

  const [ type, setType ] = useState('Faktura VAT');
  const [ prefix, setPrefix ] = useState('FR/');
  const [ report, setReport ] = useState<InvoicingReport | null>(null);
  const [ start, setStart ] = useState('1');
  const [ suffix, setSuffix ] = useState(defaultSuffix);
  const [ filter, setFilter ] = useState<OrdersFilter>(buildDefaultFilter(defaultMonthYear));
  const [ companyData, setCompanyData ] = useState<CompanyData>(buildDefaultCompanyData());
  const [ columns, setColumns ] = useState<InvoicingReportColumns>(buildDefaultColumns());

  useEffect(() => {
    setType(window.localStorage?.getItem(STORAGE_INVOICE_TYPE) || 'Faktura VAT');
    setPrefix(window.localStorage?.getItem(STORAGE_INVOICE_PREFIX) ?? 'FR/');
    setSuffix(window.localStorage?.getItem(STORAGE_INVOICE_SUFFIX) ?? defaultSuffix);
    const rememberedColumns = window.localStorage?.getItem(STORAGE_COLUMNS);
    if (rememberedColumns) {
      try {
        setColumns(JSON.parse(rememberedColumns));
      } catch (error) {}
    }
    const rememberedCompanyData = window.localStorage?.getItem(STORAGE_COMPANY_DATA);
    if (rememberedCompanyData) {
      try {
        setCompanyData(JSON.parse(rememberedCompanyData));
      } catch (error) {}
    }
  }, [defaultSuffix]);

  let contents;
  if (context.orderList.orders.length > 0) {
    const buildInvoiceList = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setReport(buildInvoicingReport({
        orders: context.orderList.orders,
        issuer: companyData,
        type,
        prefix,
        start: parseInt(start),
        suffix,
        filter
      }));
    }
    const handleMonthYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {   // todo wrap the event, so we dont have to know if it's a select element
      const newFilter: OrdersFilter = Object.assign(filter, { monthYear: event.currentTarget.value });
      setFilter(newFilter);
    };
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

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newFilter = structuredClone(filter);
      const checked = event.currentTarget.checked;
      switch (event.currentTarget.id) {
        case 'invoice-include-domestic': newFilter.hasDomestic = checked; break;
        case 'invoice-include-eu-below-oss': newFilter.hasEUBelowOSS = checked; break;
        case 'invoice-include-eu-above-oss': newFilter.hasEUAboveOSS = checked; break;
        case 'invoice-include-outside-eu': newFilter.hasOutsideEU = checked; break;
      }
      setFilter(newFilter);
    };

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

    const handleColumnsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newColumns = structuredClone(columns);
      const checked = event.currentTarget.checked;
      switch (event.currentTarget.id) {
        case 'report-col-invoice-number': newColumns.invoiceNumber = checked; break;
        case 'report-col-issue-date': newColumns.issueDate = checked; break;
        case 'report-col-sale-date': newColumns.saleDate = checked; break;
        case 'report-col-buyer-name': newColumns.buyerName = checked; break;
        case 'report-col-country': newColumns.country = checked; break;
        case 'report-col-total-eur': newColumns.totalEur = checked; break;
        case 'report-col-total-net-eur': newColumns.totalNetEur = checked; break;
        case 'report-col-total-vat-eur': newColumns.totalVatEur = checked; break;
        case 'report-col-exchange-rate': newColumns.exchangeRate = checked; break;
        case 'report-col-total-converted': newColumns.totalConverted = checked; break;
      }
      window.localStorage?.setItem(STORAGE_COLUMNS, JSON.stringify(newColumns));
      setColumns(newColumns);
    };

    const handlePDFExport = () => {
      if (report) {
        downloadBlob(buildPDFInvoicesList(report), 'raport-' + filter.monthYear + '.pdf');
      }
    };

    const handleCSVExport = () => {
      if (report) {
        downloadBlob(buildCSVInvoicesList(report, columns), 'raport-' + filter.monthYear + '.csv');
      }
    };

    const handleDownloadAllPDF = () => {
      if (report) {
        buildZipFile(report).then((blob) => downloadBlob(blob, 'faktury-' + filter.monthYear + '.zip'));
      }
    };

    contents = (
      <>
        <section>
          <CompanyDataForm data={companyData} onChange={handleCompanyDataChange} />
        </section>
        <section>
          <form onSubmit={buildInvoiceList}>
            <Row className="mb-3">
              <Col md="3">
                <MonthYearSelector id="invoice-month" values={context.orderList.timeline.months} onChange={handleMonthYearChange} />
              </Col>
            </Row>
            <Row className="row-cols-lg-auto g-3 align-items-center">
              <Form.Group as={Col} sm="1">
                <Form.Control type="text" id="invoice-type" size="sm" value={type} required onChange={handleTypeChange} />
              </Form.Group>
              <Form.Group as={Col} sm="1">
                <Form.Control type="text" id="invoice-prefix" size="sm" value={prefix} onChange={handlePrefixChange} />
              </Form.Group>
              <Form.Group as={Col} sm="1">
                <Form.Control type="number" id="invoice-start" size="sm" value={start} required onChange={handleStartChange} />
              </Form.Group>
              <Form.Group as={Col} sm="1">
                <Form.Control type="text" id="invoice-suffix" size="sm" value={suffix} onChange={handleSuffixChange} />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Check id="invoice-include-domestic" label="Zamówienia krajowe" checked={filter.hasDomestic} onChange={handleFilterChange} />
                <Form.Check id="invoice-include-eu-below-oss" label="Zamówienia UE do limitu OSS" checked={filter.hasEUBelowOSS} onChange={handleFilterChange} />
                <Form.Check id="invoice-include-eu-above-oss" label="Zamówienia UE powyżej limitu OSS" checked={filter.hasEUAboveOSS} onChange={handleFilterChange} />
                <Form.Check id="invoice-include-outside-eu" label="Zamówienia poza UE" checked={filter.hasOutsideEU} onChange={handleFilterChange} />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Check id="report-col-invoice-number" label="Nr dokumentu" checked={columns.invoiceNumber} onChange={handleColumnsChange} />
                <Form.Check id="report-col-issue-date" label="Data wystawienia" checked={columns.issueDate} onChange={handleColumnsChange} />
                <Form.Check id="report-col-sale-date" label="Data sprzedaży" checked={columns.saleDate} onChange={handleColumnsChange} />
                <Form.Check id="report-col-buyer-name" label="Nazwa kontrahenta" checked={columns.buyerName} onChange={handleColumnsChange} />
                <Form.Check id="report-col-country" label="Kraj" checked={columns.country} onChange={handleColumnsChange} />
                <Form.Check id="report-col-total-eur" label="Kwota EUR brutto" checked={columns.totalEur} onChange={handleColumnsChange} />
                <Form.Check id="report-col-total-net-eur" label="Kwota EUR netto" checked={columns.totalNetEur} onChange={handleColumnsChange} />
                <Form.Check id="report-col-total-vat-eur" label="VAT EUR" checked={columns.totalVatEur} onChange={handleColumnsChange} />
                <Form.Check id="report-col-exchange-rate" label="Kurs EUR/PLN" checked={columns.exchangeRate} onChange={handleColumnsChange} />
                <Form.Check id="report-col-total-converted" label="Kwota PLN" checked={columns.totalConverted} onChange={handleColumnsChange} />
              </Col>
            </Row>
            <Row>
              <Col>
                <Button variant="primary" type="submit">Utwórz zestawienie</Button>
              </Col>
            </Row>
          </form>
        </section>
        {report && <section>
          <InvoicesList report={report} columns={columns} />
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
