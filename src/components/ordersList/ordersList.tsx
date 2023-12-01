'use client';

import countries from '@/lib/i18n/polishCountryNames';
import { Table } from 'react-bootstrap';
import { useOrderList } from '@/context/orderListContext';

export default function OrdersList() {
  const context = useOrderList();

  if (context.orderList.orders.length > 0) {
    const orderRows = context.orderList.orders.map(order =>
      <tr key={order.id}>
        <td>{order.id}</td>
        <td>{order.date}</td>
        <td>{order.total.toFixed(2)}</td>
        <td>{order.rate?.rate.toFixed(4)}</td>
        <td>{order.totalConverted?.toFixed(2)}</td>
        <td>{countries.get(order.country) || ''}</td>
      </tr>
    );

    return (
      <Table striped bordered>
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
    )
  } else {
    return (
      <p>Brak zamówień na liście.</p>
    )
  }
}