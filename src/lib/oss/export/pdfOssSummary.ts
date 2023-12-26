import countries from '@/lib/i18n/polishCountryNames';
import formatMoney from '@/lib/i18n/moneyFormatter';
import { jsPDF } from 'jspdf';
import { OssSummary } from '@/lib/oss/ossSummary';
import '@/fonts/Verdana-normal';

function printPdfHeader(pdf: jsPDF, columns: number[]): void {
  pdf.text('Kraj', columns[0], 10);
  pdf.text('Sprzedaż w EUR', columns[1], 10);
  pdf.text('Stawka VAT', columns[2], 10);
  pdf.text('Kwota VAT w EUR', columns[3], 10);
}

function buildRows(summary: OssSummary): any[] {
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
  rows.sort((a, b) => (a.countryName > b.countryName) ? 1 : -1);

  return rows;
}

export default function buildPDFOSSSummary(summary: OssSummary): Blob {
  const pdf = new jsPDF();
  const columns = [5, 45, 90, 130];
  pdf.setFont('Verdana');
  pdf.setFontSize(10);
  pdf.setLineWidth(0.1);
  pdf.setDrawColor('0.0');

  printPdfHeader(pdf, columns);
  let y = 20;

  const rows: any[] = buildRows(summary);
  for (let i = 0; i < rows.length; i++) {
    pdf.line(5, y - 6, 180, y - 6);
    pdf.text(rows[i].countryName, columns[0], y);
    pdf.text(rows[i].totalAmount, columns[1], y);
    pdf.text(rows[i].vatRate, columns[2], y);
    pdf.text(rows[i].vatAmount, columns[3], y);
    y += 10;
  }

  pdf.text('Razem VAT: ' + formatMoney(summary.totalVat) + ' EUR', 5, y);

  return pdf.output('blob');
}
