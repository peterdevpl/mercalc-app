import { DateTime } from 'luxon';
import { euCountries } from '@/lib/i18n/euCountries';
import formatMoney from '@/lib/i18n/moneyFormatter';
import formatPercent from '@/lib/i18n/percentFormatter';
import { Invoice, InvoiceLanguage } from '@/lib/invoice/invoice';
import { jsPDF } from 'jspdf';
import polishCountryNames from '@/lib/i18n/polishCountryNames';
import '@/fonts/OpenSans-bold';
import '@/fonts/OpenSans-normal';

const fontYOffset = 2.6;  // pdf.text() "y" argument is the font baseline, so we need an offset for the top line to be at "y"

type Column = {
  width: number;
  align: 'left'|'center'|'right';
};

const languages = {
	"en": {
		"issue-place": "Place of issue",
		"issue-date": "Issue date",
		"sale-date": "Sale date",
		"seller": "Seller",
		"buyer": "Buyer",
		"tax-id": "Tax ID",
		"header": [
			'No.',
			'Name',
			'Unit',
			'Qty',
			'Net|price',
			'Total|net',
			'VAT|rate',
			'VAT|amount',
			'Total|gross'
		],
		"vat-split": "VAT",
		"total": "Total",
		"paid": "Paid",
		"to-pay": "To pay",
		"payment-date": "Payment date",
		"paid-with-transfer": "Payment method: bank transfer",
		"words": ""
	},
	"pl": {
		"issue-place": "Miejsce wystawienia",
		"issue-date": "Data wystawienia",
		"sale-date": "Data wystawienia",
		"seller": "Sprzedawca",
		"buyer": "Nabywca",
		"tax-id": "NIP",
		"header": [
			'Lp.',
			'Nazwa towaru lub usługi',
			'Jm.',
			'Ilość',
			'Cena|netto',
			'Wartość|netto',
			'Stawka|VAT',
			'Kwota|VAT',
			'Wartość|brutto'
		],
		"vat-split": "W tym",
		"total": "Razem",
		"paid": "Zapłacono",
		"to-pay": "Do zapłaty",
		"payment-date": "Data płatności",
		"paid-with-transfer": "Sposób płatności: przelew",
		"words": "Słownie"
	}
};

function printIssueHeader(pdf: jsPDF, invoice: Invoice, language: InvoiceLanguage): void {
	let text;

	text = languages[language]['issue-place'];
  pdf.setFillColor('0.875');
  pdf.rect(123.6, 12, 74.4, 7.5, 'F');
  pdf.line(123.6, 12, 198, 12);
  pdf.text(text, 123.6 + (198 - 123.6 - pdf.getTextWidth(text)) / 2, 14.9 + fontYOffset);

	text = languages[language]['issue-date'];
  pdf.setFillColor('0.875');
  pdf.rect(123.6, 27, 74.4, 7.5, 'F');
  pdf.line(123.6, 27, 198, 27);
  pdf.text(text, 123.6 + (198 - 123.6 - pdf.getTextWidth(text)) / 2, 29.5 + fontYOffset);

	text = languages[language]['sale-date'];
  pdf.setFillColor('0.875');
  pdf.rect(123.6, 42, 74.4, 7.5, 'F');
  pdf.line(123.6, 42, 198, 42);
  pdf.text(text, 123.6 + (198 - 123.6 - pdf.getTextWidth(text)) / 2, 44.3 + fontYOffset);

  pdf.setFont('OpenSans', 'normal', 'bold');
  let textX = 160.8 - pdf.getTextWidth(invoice.issuer.city) / 2;
  pdf.text(invoice.issuer.city, textX, 21.8 + fontYOffset);
  const invoiceDate = invoice.date.toFormat('dd-MM-yyyy');
  textX = 160.8 - pdf.getTextWidth(invoiceDate) / 2;
  pdf.text(invoiceDate, textX, 36.7 + fontYOffset);
  pdf.text(invoiceDate, textX, 51.5 + fontYOffset);
  pdf.setFont('OpenSans', 'normal', 'normal');
}

function printContractors(pdf: jsPDF, invoice: Invoice, language: InvoiceLanguage): void {
  const lineHeight = 6.3;
  let y = 66.2;
	let text;
  pdf.setFont('OpenSans', 'normal', 'bold');

	text = languages[language]['seller'];
  pdf.setFillColor('0.875');
  pdf.rect(12, y, 83.7, 7.5, 'F');
  pdf.line(12, y, 95.7, y);
  pdf.text(text, 12 + (95.7 - 12 - pdf.getTextWidth(text)) / 2, 69 + fontYOffset);

	text = languages[language]['buyer'];
  pdf.setFillColor('0.875');
  pdf.rect(114.3, y, 83.7, 7.5, 'F');
  pdf.line(114.3, y, 198, y);
  pdf.text(text, 114.3 + (198 - 114.3 - pdf.getTextWidth(text)) / 2, 69 + fontYOffset);

  y += 10;

  pdf.setFont('OpenSans', 'normal', 'normal');
  pdf.text(invoice.issuer.name, 12, y + fontYOffset);
  pdf.text(languages[language]['tax-id'] + ': ' + invoice.issuer.vatId, 12, y + lineHeight + fontYOffset);
  pdf.text(invoice.issuer.street, 12, y + lineHeight * 2 + fontYOffset);
  pdf.text(invoice.issuer.zipCode + ' ' + invoice.issuer.city, 12, y + lineHeight * 3 + fontYOffset);

  pdf.text(invoice.buyer.name, 114.3, y + fontYOffset);
  pdf.text(invoice.buyer.street, 114.3, y + lineHeight + fontYOffset);
  pdf.text(invoice.buyer.cityCountry, 114.3, y + lineHeight * 2 + fontYOffset);
  pdf.text(polishCountryNames.get(invoice.country) || '', 114.3, y + lineHeight * 3 + fontYOffset);
}

function printDocumentName(pdf: jsPDF, invoice: Invoice, language: InvoiceLanguage): void {
  const text = (language === 'pl' ? invoice.invoiceType : 'Invoice #') + ' ' + invoice.invoiceNumber;
  pdf.setFont('OpenSans', 'normal', 'bold');
  pdf.setFontSize(15);
  const x = 105 - pdf.getTextWidth(text) / 2;
  pdf.text(text, x, 112.8 + fontYOffset);
  pdf.setFont('OpenSans', 'normal', 'normal');
  pdf.setFontSize(10);
}

function printTableRow(pdf: jsPDF, columns: Column[], text: string[], x: number, y: number, height: number, padding: number, header: boolean = false): void {
  if (header) {
    pdf.setFillColor('0.875');
    pdf.rect(x, y, 198 - x, height, 'F');
    pdf.setFont('OpenSans', 'normal', 'bold');
  }

  pdf.line(x, y, 198, y);
  let columnX = x;
  let textX;
  let textY;
  let lines;
  for (let i = 0; i < columns.length; i++) {
    lines = text[i].split('|');
    textY = y + height / (lines.length + 1) + fontYOffset / 2;

    for (let j = 0; j < lines.length; j++) {
      // header cells are always centered
      if (!header && columns[i].align === 'left') {
        textX = columnX + padding;
      } else {
        const textWidth = pdf.getTextWidth(lines[j]);
        textX = (!header && columns[i].align === 'right') ? columnX + columns[i].width - padding - textWidth
          : columnX + columns[i].width / 2 - textWidth / 2;
      }
      pdf.text(lines[j], textX, textY);
      textY += 5;
    }

    pdf.line(columnX, y, columnX, y + height);
    columnX += columns[i].width;
  }

  pdf.line(columnX, y, columnX, y + height);

  if (header) {
    pdf.setFont('OpenSans', 'normal', 'normal');
  }
}

function printTable(pdf: jsPDF, invoice: Invoice, language: InvoiceLanguage): number {
  const columns: Column[] = [
    { width: 10, align: 'center' },
    { width: 64, align: 'left' },
    { width: 10, align: 'center' },
    { width: 12, align: 'center' },
    { width: 18, align: 'right' },
    { width: 18, align: 'right' },
    { width: 18, align: 'center' },
    { width: 18, align: 'right' },
    { width: 18, align: 'right' }
  ];
  const headerHeight = 13.5;
  const padding = 1;
  let y = 122.5;
  let x = 12;

  printTableRow(pdf, columns, languages[language]['header'], x, y, headerHeight, padding, true);
  y += headerHeight;

  let rowHeight: number;
  for (let i = 0; i < invoice.items.length; i++) {
		const linesCount = invoice.items[i].name[language].split('|').length;
		rowHeight = 7.5 + 6 * (linesCount - 1);
    const itemText: string[] = [
      invoice.items[i].rowId.toString(),
      invoice.items[i].name[language],
      invoice.items[i].unit[language],
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

	rowHeight = 7.5;

  const summaryColumns = columns.slice(-4);
  const colspanWidth = columns.slice(0, 5).reduce((accumulator, currentValue) => accumulator + currentValue.width, 0);
  x = 12 + colspanWidth;
  pdf.line(12, y, x, y);

  pdf.setFont('OpenSans', 'normal', 'bold');
  pdf.text(languages[language]['vat-split'], x - padding - pdf.getTextWidth(languages[language]['vat-split']), y + rowHeight / 2 + fontYOffset / 2);
  pdf.text(languages[language]['total'], x - padding - pdf.getTextWidth(languages[language]['total']), y + rowHeight * 1.5 + fontYOffset / 2);
  pdf.setFont('OpenSans', 'normal', 'normal');

  const vatText: string[] = [
    formatMoney(invoice.totalNetEur),
    formatPercent(invoice.items[0].vatRate),
    formatMoney(invoice.totalVatEur),
    formatMoney(invoice.totalEur)
  ];
  printTableRow(pdf, summaryColumns, vatText, x, y, rowHeight, padding);
  y += rowHeight;

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

function printPaymentInfo(pdf: jsPDF, invoice: Invoice, y: number, language: InvoiceLanguage): void {
  pdf.line(12, y, 95.7, y);
  pdf.line(114.3, y, 198, y);
  const lineHeight = 6.3;
  y += lineHeight / 2;

  pdf.setFont('OpenSans', 'normal', 'bold');
  pdf.setFontSize(11);
  pdf.text(languages[language]['paid'] + ' ' + formatMoney(invoice.totalEur) + ' EUR', 12, y + fontYOffset);
	if (language === 'pl') {
		pdf.text(languages[language]['to-pay'] + ' 0,00 EUR', 114.3, y + fontYOffset);
	}

  pdf.setFont('OpenSans', 'normal', 'normal');
  pdf.setFontSize(10);
  pdf.text(languages[language]['payment-date'] + ': ' + invoice.date.toFormat('dd-MM-yyyy'), 12, y + lineHeight + fontYOffset);
  pdf.text(languages[language]['paid-with-transfer'], 12, y + lineHeight * 2 + fontYOffset);
  pdf.text(invoice.issuer.bankName, 12, y + lineHeight * 3 + fontYOffset);
  pdf.text(invoice.issuer.bankAccount, 12, y + lineHeight * 4 + fontYOffset);
	if (language === 'pl') {
		pdf.text(languages[language]['words'] + ' zero 00/100 EUR', 114.3, y + lineHeight + fontYOffset);
	}

  y += lineHeight * 5;

  if (invoice.exchangeRate && language === 'pl') {
    pdf.line(12, y, 198, y);
    const rateDate = DateTime.fromISO(invoice.exchangeRate.date).toFormat('dd-MM-yyyy');
    const conversion = 'Przeliczono po kursie 1 EUR = ' + formatMoney(invoice.exchangeRate.rate, 4) +
      ' PLN, tabela kursów średnich ' + invoice.exchangeRate.sourceName + ' ' +
      invoice.exchangeRate.sourceDescription + ' z dnia ' + rateDate + ';';
    pdf.text(conversion, 12, y + lineHeight * 0.5 + fontYOffset);

    pdf.text('Przeliczona wartość:', 12, y + lineHeight * 1.5 + fontYOffset);
    pdf.setFont('OpenSans', 'normal', 'bold');
    pdf.text(formatMoney(invoice.totalConverted) + ' PLN', 46.5, y + lineHeight * 1.5 + fontYOffset);
    pdf.setFont('OpenSans', 'normal', 'normal');

    y += lineHeight * 3;
  }

  if (!euCountries.includes(invoice.country) && language === 'pl') {
    pdf.text('0% VAT na podstawie IE599', 12, y + fontYOffset);
  }
}

export default function buildPDFInvoice(invoice: Invoice, language: InvoiceLanguage): Blob {
  const pdf = new jsPDF({ unit: 'mm', compress: true });
  pdf.setFont('OpenSans');
  pdf.setFontSize(10);
  pdf.setLineWidth(0.265);
  pdf.setDrawColor('0.0');
  pdf.setFillColor('0.875');

  printIssueHeader(pdf, invoice, language);
  printContractors(pdf, invoice, language);
  printDocumentName(pdf, invoice, language);
  let y = printTable(pdf, invoice, language);

  y += 10;
  printPaymentInfo(pdf, invoice, y, language);

  return pdf.output('blob');
}
