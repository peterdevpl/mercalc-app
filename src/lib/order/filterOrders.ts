import Decimal from 'decimal.js';
import { IOrder } from '@/lib/orderList';
import { OrdersFilter } from '@/lib/order/ordersFilter';

const euCountries = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT',
	'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'];

const thisCountry = 'PL';

const ossLimit = new Decimal('10000.00');

export default function filterOrders(orders: IOrder[], filter: OrdersFilter): IOrder[] {
	const result: IOrder[] = [];

	for (let i = 0; i < orders.length; i++) {
		if (orders[i].date.substring(0, 7) !== filter.monthYear) {
			continue;
		}

		// todo: implement other filters

		result.push(orders[i]);
	}

	return result;
}
