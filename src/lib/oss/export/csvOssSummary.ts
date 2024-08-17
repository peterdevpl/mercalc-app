import formatMoney from '@/lib/i18n/moneyFormatter';
import { OssSummary } from '@/lib/oss/ossSummary';
import Papa from 'papaparse';
import polishCountryNames from '@/lib/i18n/polishCountryNames';

function buildDataRows(summary: OssSummary): any[] {
	const rows: string[][] = [];
	summary.countries.forEach((value, key) => {
		rows.push([
			polishCountryNames.get(key) || '',
			value.vatRate.times(100).toString() + '%',
			formatMoney(value.totalAmount),
			formatMoney(value.totalVat)
		]);
	});
	rows.sort((a, b) => (a[0] > b[0]) ? 1 : -1);

	return rows;
}

export default function buildCSVOSSSummary(summary: OssSummary): Blob {
	const rows: string[][] = [];
	rows.push(['Kraj', 'Sprzedaż w EUR', 'Stawka VAT', 'Kwota VAT w EUR']);

	for (const row of buildDataRows(summary)) {
		rows.push(row);
	}

	const csv = Papa.unparse(rows, { delimiter: "\t" });
	return new Blob([csv], { type: 'text/csv' });
}
