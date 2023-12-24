'use client';

import { useOrderList } from '@/context/orderListContext';
import buildSummary from '@/lib/stats/summaryBuilder';
import { OrdersSummary } from '@/lib/stats/summary';
import styles from './ordersSummary.module.css';
import SwitchButtons from '@/components/switchButtons/switchButtons';
import { useState } from 'react';

type Figure = {
  key: string;
  label: string;
  value: string;
}

function addEurFigures(figures: Figure[], summary: OrdersSummary) {
  figures.push({
    key: 'sum-eur',
    label: 'Suma EUR',
    value: summary.totalPerCurrency.get('EUR')?.toFixed(2) ?? ''
  });
  figures.push({
    key: 'domestic-eur',
    label: 'Obrót w Polsce',
    value: summary.totalDomestic.toFixed(2) + ' EUR'
  });
  figures.push({
    key: 'eu-eur',
    label: 'Obrót z krajami UE',
    value: summary.totalWithinEU.toFixed(2) + ' EUR'
  });
  figures.push({
    key: 'outside-eu-eur',
    label: 'Obrót poza UE',
    value: summary.totalOutsideEU.toFixed(2) + ' EUR'
  });
}

function addConvertedFigures(figures: Figure[], summary: OrdersSummary) {
  figures.push({
    key: 'sum-converted',
    label: 'Suma PLN',
    value: summary.totalConvertedToLocal.toFixed(2) ?? ''
  });
  figures.push({
    key: 'domestic-converted',
    label: 'Obrót w Polsce',
    value: summary.totalDomesticConverted.toFixed(2) + ' PLN'
  });
  figures.push({
    key: 'eu-converted',
    label: 'Obrót z krajami UE',
    value: summary.totalWithinEUConverted.toFixed(2) + ' PLN'
  });
  figures.push({
    key: 'outside-eu-converted',
    label: 'Obrót poza UE',
    value: summary.totalOutsideEUConverted.toFixed(2) + ' PLN'
  });
}

export default function OrdersSummary() {
  const context = useOrderList();
  const summary = buildSummary(context.orderList.orders);
  const [ currency, setCurrency ] = useState('EUR');
  const currencies = new Map<string, string>();
  currencies.set('EUR', 'EUR');
  currencies.set('PLN', 'PLN');
  const handleCurrencyChange = (selection: string) => {
    setCurrency(selection);
  };

  const figures: Figure[] = [];
  if (context.orderList.orders.length > 0) {
    figures.push({
      key: 'orders-length',
      label: 'Liczba zamówień w pliku',
      value: context.orderList.orders.length.toString()
    });
    if (currency === 'EUR') {
      addEurFigures(figures, summary);
    } else {
      addConvertedFigures(figures, summary);
    }
  }

  return (
    <>
      {figures.length > 0 && <section>
        <SwitchButtons options={currencies} selected={currency} onChange={handleCurrencyChange} />
        <div className={styles.stats}>
          {figures.map(figure => (
            <div className={styles.statsFigure} key={figure.key}>
              <span className={styles.statsLabel}>{figure.label}:</span>
              <strong className={styles.statsValue}>{figure.value}</strong>
            </div>
            ))}
        </div>
      </section>}
    </>
  )
}
