'use client';

import Papa, { ParseConfig, ParseResult } from 'papaparse';
import { useOrderList } from '@/context/orderListContext';
import buildOrderList from '@/lib/orderListBuilder';
import importEtsyCsv from "@/lib/import/etsyCsvImporter";
import styles from './csvUpload.module.css';

export default function CsvUpload() {
  const orderListContext = useOrderList();

  function uploadCsv(files: FileList | null): void
  {
    if (files === null || files.length === 0) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const string = event.target && event.target.result ? event.target.result.toString() : '';
      const config: ParseConfig = { skipEmptyLines: true };
      const csv: ParseResult<any> = Papa.parse(string, config);
      if (csv.errors.length > 0) {
        alert('Plik CSV nie jest poprawny');  // todo error handling
      } else {
        const orders = importEtsyCsv(csv.data);
        buildOrderList(orders).then((ordersList) => {
          orderListContext.updateList(ordersList);
        });
      }
    };
    reader.readAsBinaryString(files[0]);
  }

  return (
    <input type="file" id="csv" className={styles.fileInput} onChange={(event) => uploadCsv(event.target.files)} />
  )
}
