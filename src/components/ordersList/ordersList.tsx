'use client';

import countries from '@/lib/i18n/polishCountryNames';
import formatMoney from '@/lib/i18n/moneyFormatter';
import { Table } from 'react-bootstrap';
import { useOrderList } from '@/context/orderListContext';

export default function OrdersList() {
  const context = useOrderList();

  if (context.orderList.orders.length > 0) {
    const orderRows = context.orderList.orders.map(order =>
      <tr key={order.id}>
        <td>{order.id}</td>
        <td>{order.date}</td>
        <td>{formatMoney(order.total)}</td>
        <td>{formatMoney(order.rate?.rate, 4)}</td>
        <td>{formatMoney(order.totalConverted)}</td>
        <td>{countries.get(order.country) || ''}</td>
      </tr>
    );

    return (
      <section>
        <Table striped>
          <thead>
          <tr>
            <th>Numer</th>
            <th>Data</th>
            <th>Kwota EUR</th>
            <th>Kurs EUR/PLN</th>
            <th>Kwota PLN</th>
            <th>Kraj</th>
          </tr>
          </thead>
          <tbody>
          {orderRows}
          </tbody>
        </Table>
      </section>
    )
  } else {
    return (
      <section>
        <p>Brak zamówień na liście.</p>
      </section>
    )
  }
}
