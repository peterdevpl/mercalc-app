import Decimal from 'decimal.js';
import { IOrder } from '@/lib/orderList';
import { OrdersFilter } from '@/lib/order/ordersFilter';

const euCountries = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT',
	'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'];

const thisCountry = 'PL';

const ossLimit = new Decimal('10000.00');

export default function filterOrders(orders: IOrder[], filter: OrdersFilter): IOrder[] {
	const result: IOrder[] = [];
	let totalWithinEU = new Decimal(0);
	let isWithinEU = false;

	for (let i = 0; i < orders.length; i++) {
		isWithinEU = orders[i].country !== thisCountry && euCountries.includes(orders[i].country);
		if (isWithinEU && (filter.hasEUBelowOSS || filter.hasEUAboveOSS)) {
			totalWithinEU = totalWithinEU.add(orders[i].total);
		}

		if (orders[i].date.substring(0, 7) !== filter.monthYear) {
			continue;
		}

		if (filter.hasDomestic && orders[i].country === thisCountry) {
			result.push(orders[i]);
			continue;
		}

		if (filter.hasEUBelowOSS && isWithinEU && totalWithinEU.lessThanOrEqualTo(ossLimit)) {
			result.push(orders[i]);
			continue;
		}

		if (filter.hasEUAboveOSS && isWithinEU && totalWithinEU.greaterThan(ossLimit)) {
			result.push(orders[i]);
			continue;
		}

		if (filter.hasOutsideEU && !euCountries.includes(orders[i].country)) {
			result.push(orders[i]);
		}
	}

	return result;
}
