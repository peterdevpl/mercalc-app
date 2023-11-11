'use client';

import { useOrderList } from '@/context/orderListContext';
import buildSummary from '@/lib/stats/summaryBuilder';
import styles from './ordersSummary.module.css';

export default function OrdersSummary() {
  const context = useOrderList();
  const summary = buildSummary(context.orderList.orders);

  return (
    <>
      {context.orderList.orders.length > 0 && <div className={styles.stats}>
        <div className={styles.statsFigure}>
          <span className={styles.statsLabel}>Liczba zamówień w pliku:</span>
          <strong className={styles.statsValue}>{context.orderList.orders.length}</strong>
        </div>
        <div className={styles.statsFigure}>
          <span className={styles.statsLabel}>Suma EUR:</span>
          <strong className={styles.statsValue}>{summary.totalPerCurrency.get('EUR')?.toFixed(2)}</strong>
        </div>
        <div className={styles.statsFigure}>
          <span className={styles.statsLabel}>Obrót w Polsce:</span>
          <strong className={styles.statsValue}>{summary.totalDomestic.toFixed(2)} EUR</strong>
        </div>
        <div className={styles.statsFigure}>
          <span className={styles.statsLabel}>Obrót z krajami UE:</span>
          <strong className={styles.statsValue}>{summary.totalWithinEU.toFixed(2)} EUR</strong>
        </div>
        <div className={styles.statsFigure}>
          <span className={styles.statsLabel}>Obrót poza UE:</span>
          <strong className={styles.statsValue}>{summary.totalOutsideEU.toFixed(2)} EUR</strong>
        </div>
      </div>}
    </>
  )
}
