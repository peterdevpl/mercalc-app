import formatMoney from '@/lib/i18n/moneyFormatter';
import { InvoicingReport } from '@/lib/invoice/invoices';
import { jsPDF } from 'jspdf';
import '@/fonts/Verdana-normal';

function printPdfHeader(pdf: jsPDF, columns: number[]): void
{
  pdf.text('L.p.', columns[0], 10);
  pdf.text('Nr faktury', columns[1], 10);
  pdf.text('Data sprzedaży', columns[2], 10);
  pdf.text('Kwota EUR', columns[3], 10);
  pdf.text('Kurs przewalutowania', columns[4], 10);
  pdf.text('Kwota w PLN', columns[5], 10);
}

export default function buildPDFInvoicesList(report: InvoicingReport): Blob {
  const pdf = new jsPDF();
  const columns = [5, 20, 60, 90, 115, 155];
  pdf.setFont('Verdana');
  pdf.setFontSize(10);
  pdf.setLineWidth(0.1);
  pdf.setDrawColor('0.0');

  printPdfHeader(pdf, columns);
  let y = 20;

  for (let i = 0; i < report.rows.length; i++) {
    if (y > 290) {
      pdf.addPage();
      y = 20;
      printPdfHeader(pdf, columns);
    }

    pdf.line(5, y - 6, 180, y - 6);
    pdf.text(report.rows[i].rowId.toString(), columns[0], y);
    pdf.text(report.rows[i].invoiceNumber, columns[1], y);
    pdf.text(report.rows[i].date.toFormat('dd-MM-yyyy'), columns[2], y);
    pdf.text(formatMoney(report.rows[i].totalEur), columns[3], y);
    pdf.text(formatMoney(report.rows[i].exchangeRate?.rate, 4), columns[4], y);
    pdf.text(formatMoney(report.rows[i].totalPln), columns[5], y);

    y += 10;
  }

  if (y > 280) {
    pdf.addPage();
    y = 10;
  }
  pdf.text('Suma EUR: ' + formatMoney(report.totalEur), 5, y);
  pdf.text('Suma PLN: ' + formatMoney(report.totalPln), 5, y + 5);

  return pdf.output('blob');
}
