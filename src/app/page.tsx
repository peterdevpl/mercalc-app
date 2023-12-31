import CsvUpload from '@/components/csvUpload/csvUpload';
import OrdersSummary from '@/components/ordersSummary/ordersSummary';
import styles from './page.module.css';

export default function Home() {
  return (
    <main>
      <h1>Prześlij plik CSV z Etsy</h1>
      <section className={styles.fileUpload}>
        <CsvUpload/>
        <p className={styles.disclaimer}>Twoje dane są bezpieczne &mdash; nigdzie ich nie wysyłamy, są przetwarzane na
          Twoim komputerze</p>
      </section>
      <OrdersSummary/>
    </main>
  )
}
