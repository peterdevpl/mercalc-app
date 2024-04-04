import Link from 'next/link';

export default function Help() {
  return (
    <>
      <h1>Jak to działa?</h1>
      <section>
        <p>Kalkulator podatkowy przetwarza zamówienia z Twojego sklepu Etsy, przelicza ich wartość na PLN według
          aktualnych kursów NBP oraz tworzy zestawienie dla księgowości.</p>
        <p>Kurs EUR/PLN pochodzi z <a href="https://nbp.pl/statystyka-i-sprawozdawczosc/kursy/tabela-a/">tabeli kursów
          średnich NBP</a> z dnia roboczego poprzedzającego datę sprzedaży.</p>
        <p>W podsumowaniu zobaczysz też sumę EUR transakcji w obrębie Unii Europejskiej — ma to wpływ na Twój status <a
          href="https://vat-one-stop-shop.ec.europa.eu/one-stop-shop_en">podatnika VAT OSS</a>.</p>
        <p>Jeśli Twoja firma jest zarejestrowana w VAT OSS, w zakładce <Link href="/stats">Statystyki VAT UE</Link> pobierzesz zestawienie VAT
          według krajów docelowych.</p>
      </section>
      <h1>Jak to zrobić?</h1>
      <section>
        <ol>
          <li>Zaloguj się do swojego sklepu Etsy. Kliknij <strong>Account settings</strong> w prawym górnym rogu.</li>
          <li>W menu z lewej strony wybierz <strong>Settings</strong> i <strong>Options</strong>. Kliknij zakładkę <strong>Download Data</strong>.</li>
          <li>W dolnej ramce z przyciskiem <strong>Download CSV</strong> wybierz typ raportu: <strong>Order Items</strong>. Następnie wybierz rok, nie wybieraj miesiąca.</li>
          <li>Kliknij przycisk <strong>Download CSV</strong>. Otrzymasz na maila link do pobrania pliku. Zapisz plik na komputerze, a następnie wklej go tutaj <Link href="/">w zakładce "Przegląd"</Link>.</li>
        </ol>
      </section>
    </>
  );
}
