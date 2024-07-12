import { DateTime } from 'luxon';
import formatMoney from '@/lib/i18n/moneyFormatter';
import formatPercent from '@/lib/i18n/percentFormatter';
import { Invoice } from '@/lib/invoice/invoice';
import { jsPDF } from 'jspdf';
import polishCountryNames from '@/lib/i18n/polishCountryNames';
import '@/fonts/Verdana-normal';

const fontYOffset = 2.6;  // pdf.text() "y" argument is the font baseline, so we need an offset for the top line to be at "y"

type Column = {
  width: number;
  align: 'left'|'center'|'right';
};

function printIssueHeader(pdf: jsPDF): void {
  pdf.setFillColor('0.875');
  pdf.rect(123.6, 12, 74.4, 7.5, 'F');
  pdf.line(123.6, 12, 198, 12);
  pdf.text('Miejsce wystawienia', 144.7, 15.4 + fontYOffset);

  pdf.setFillColor('0.875');
  pdf.rect(123.6, 27, 74.4, 7.5, 'F');
  pdf.line(123.6, 27, 198, 27);
  pdf.text('Data wystawienia', 147, 30 + fontYOffset);

  pdf.setFillColor('0.875');
  pdf.rect(123.6, 42, 74.4, 7.5, 'F');
  pdf.line(123.6, 42, 198, 42);
  pdf.text('Data sprzedaży', 148.5, 44.8 + fontYOffset);
}

function printContractors(pdf: jsPDF, invoice: Invoice): void {
  const lineHeight = 6.3;
  let y = 66.2;

  pdf.setFillColor('0.875');
  pdf.rect(12, y, 83.7, 7.5, 'F');
  pdf.line(12, y, 95.7, y);
  pdf.text('Sprzedawca', 43.5, 69.5 + fontYOffset);

  pdf.setFillColor('0.875');
  pdf.rect(114.3, y, 83.7, 7.5, 'F');
  pdf.line(114.3, y, 198, y);
  pdf.text('Nabywca', 148.3, 69.5 + fontYOffset);

  y += 10;

  pdf.text(invoice.issuer.name, 12, y + fontYOffset);
  pdf.text('NIP: ' + invoice.issuer.vatId, 12, y + lineHeight + fontYOffset);
  pdf.text(invoice.issuer.street, 12, y + lineHeight * 2 + fontYOffset);
  pdf.text(invoice.issuer.zipCode + ' ' + invoice.issuer.city, 12, y + lineHeight * 3 + fontYOffset);

  pdf.text(invoice.buyer.name, 114.3, y + fontYOffset);
  pdf.text(invoice.buyer.street, 114.3, y + lineHeight + fontYOffset);
  pdf.text(invoice.buyer.cityCountry, 114.3, y + lineHeight * 2 + fontYOffset);
  pdf.text(polishCountryNames.get(invoice.country) || '', 114.3, y + lineHeight * 3 + fontYOffset);
}

function printDocumentName(pdf: jsPDF, invoice: Invoice): void {
  pdf.text(invoice.invoiceType + ' ' + invoice.invoiceNumber, 64, 112.8 + fontYOffset);
}

function printTableRow(pdf: jsPDF, columns: Column[], text: string[], x: number, y: number, height: number, padding: number, header: boolean = false): void {
  if (header) {
    pdf.setFillColor('0.875');
    pdf.rect(x, y, 198 - x, height, 'F');
  }

  pdf.line(x, y, 198, y);
  let columnX = x;
  for (let i = 0; i < columns.length; i++) {
    let textX;
    if (!header && columns[i].align === 'left') {
      textX = columnX + padding;
    } else {
      const textWidth = pdf.getTextWidth(text[i]);
      textX = (!header && columns[i].align === 'right') ? columnX + columns[i].width - padding - textWidth
        : columnX + columns[i].width / 2 - textWidth / 2;
    }

    pdf.text(text[i], textX, y + height - padding * 2);
    pdf.line(columnX, y, columnX, y + height);

    columnX += columns[i].width;
  }
  pdf.line(columnX, y, columnX, y + height);
}

function printTable(pdf: jsPDF, invoice: Invoice): number {
  const columns: Column[] = [
    { width: 10, align: 'center' },
    { width: 58, align: 'left' },
    { width: 10, align: 'center' },
    { width: 13, align: 'center' },
    { width: 19, align: 'right' },
    { width: 19, align: 'right' },
    { width: 19, align: 'center' },
    { width: 19, align: 'right' },
    { width: 19, align: 'right' }
  ];
  const headerHeight = 13.5;
  const padding = 1;
  let y = 122.5;
  let x = 12;

  const headerText: string[] = [
    'Lp.',
    'Nazwa towaru lub usługi',
    'Jm.',
    'Ilość',
    'Cena|netto',
    'Wartość|netto',
    'Stawka|VAT',
    'Kwota|VAT',
    'Wartość|brutto'
  ];
  printTableRow(pdf, columns, headerText, x, y, headerHeight, padding, true);
  y += headerHeight;

  const rowHeight = 7.5;
  for (let i = 0; i < invoice.items.length; i++) {
    const itemText: string[] = [
      invoice.items[i].rowId.toString(),
      invoice.items[i].name,
      'kpl.',
      invoice.items[i].quantity.toString(),
      formatMoney(invoice.items[i].unitPrice),
      formatMoney(invoice.items[i].totalNet),
      formatPercent(invoice.items[i].vatRate),
      formatMoney(invoice.items[i].vatAmount),
      formatMoney(invoice.items[i].totalGross)
    ];
    printTableRow(pdf, columns, itemText, x, y, rowHeight, padding);
    y += rowHeight;
  }

  const summaryColumns = columns.slice(-4);
  const colspanWidth = columns[0].width + columns[1].width + columns[2].width + columns[3].width + columns[4].width;
  x = 12 + colspanWidth;
  pdf.line(12, y, x, y);

  pdf.text('W tym', 106.3, y + fontYOffset);
  const vatText: string[] = [
    formatMoney(invoice.totalNetEur),
    formatPercent(invoice.items[0].vatRate),
    formatMoney(invoice.totalVatEur),
    formatMoney(invoice.totalEur)
  ];
  printTableRow(pdf, summaryColumns, vatText, x, y, rowHeight, padding);
  y += rowHeight;

  pdf.text('Razem', 106.1, y + fontYOffset);
  const totalText: string[] = [
    formatMoney(invoice.totalNetEur),
    '',
    formatMoney(invoice.totalVatEur),
    formatMoney(invoice.totalEur)
  ];
  printTableRow(pdf, summaryColumns, totalText, x, y, rowHeight, padding);
  y += rowHeight;
  pdf.line(x, y, 198, y);

  return y;
}

function printPaymentInfo(pdf: jsPDF, invoice: Invoice, y: number): void {
  const lineHeight = 6.3;
  pdf.text('Zapłacono ' + formatMoney(invoice.totalEur) + ' EUR', 12, y + fontYOffset);
  pdf.text('Data płatności: ' + invoice.date.toFormat('dd-MM-yyyy'), 12, y + lineHeight + fontYOffset);
  pdf.text('Sposób płatności: przelew', 12, y + lineHeight * 2 + fontYOffset);
  pdf.text('bank', 12, y + lineHeight * 3 + fontYOffset);
  pdf.text('bank account', 12, y + lineHeight * 4 + fontYOffset);

  if (invoice.exchangeRate) {
    const rateDate = DateTime.fromISO(invoice.exchangeRate.date).toFormat('dd-MM-yyyy');
    const conversion = 'Przeliczono po kursie 1 EUR = ' + formatMoney(invoice.exchangeRate.rate, 4) +
      ' PLN, tabela kursów średnich ' + invoice.exchangeRate.sourceName + ' ' +
      invoice.exchangeRate.sourceDescription + ' z dnia ' + rateDate + ';';
    pdf.text(conversion, 12, y + lineHeight * 5 + fontYOffset);

    pdf.text('Przeliczona wartość: ' + formatMoney(invoice.totalConverted) + ' PLN', 12, y + lineHeight * 6 + fontYOffset);
  }
}

export default function buildPDFInvoice(invoice: Invoice): Blob {
  const pdf = new jsPDF({ unit: 'mm' });
  pdf.setFont('Verdana');
  pdf.setFontSize(10);
  pdf.setLineWidth(0.1);
  pdf.setDrawColor('0.0');
  pdf.setFillColor('0.875');

  printIssueHeader(pdf);
  printContractors(pdf, invoice);
  printDocumentName(pdf, invoice);
  let y = printTable(pdf, invoice);

  y += 10;
  printPaymentInfo(pdf, invoice, y);

  return pdf.output('blob');
}
