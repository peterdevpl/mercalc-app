import { IOrder, OrdersTimeline } from '@/lib/orderList';

export default function buildTimeline(orders: IOrder[]): OrdersTimeline {
  const timeline: OrdersTimeline = {
    months: [],
    quarters: [],
    years: []
  };

  let lastMonth = '';
  for (let i = 0; i < orders.length; i++) {
    const month = orders[i].date.substring(0, 7);
    if (month === lastMonth) {
      // optimization: don't perform calculations on orders from the same year+month
      continue;
    }
    lastMonth = month;
    timeline.months.push(month);

    const year = orders[i].date.substring(0, 4);
    if (!timeline.years.includes(year)) {
      timeline.years.push(year);
    }

    const quarter = year + '-Q' + Math.floor((parseInt(orders[i].date.substring(5, 7)) + 2) / 3);
    if (!timeline.quarters.includes(quarter)) {
      timeline.quarters.push(quarter);
    }
  }

  return timeline;
}
