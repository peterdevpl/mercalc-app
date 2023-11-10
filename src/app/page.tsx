import CsvUpload from '@/components/csvUpload/csvUpload';

export default function Home() {
  return (
    <main>
        <h1>Prześlij plik CSV z Etsy</h1>
        <CsvUpload />
        <p className="disclaimer">Twoje dane są bezpieczne &mdash; nigdzie ich nie wysyłamy, są przetwarzane na Twoim komputerze</p>
    </main>
  )
}
