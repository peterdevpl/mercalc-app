import { CompanyData } from '@/lib/invoice/companyData';
import { DateTime } from 'luxon';
import Decimal from 'decimal.js';
import { Invoice, InvoiceItem } from '@/lib/invoice/invoice';
import { IOrder } from '@/lib/orderList';
import vatRates from '@/lib/oss/vatRates';

export default function buildInvoice(order: IOrder, type: string, number: string, issuer: CompanyData): Invoice {
  const zero = new Decimal(0);
  const vatRate = vatRates.get(order.country) || zero;
  const vatDivider = vatRate.add(1);

  const items: InvoiceItem[] = [];
  let rowId = 1;
  for (const item of order.items) {
    const totalNet = item.total.div(vatDivider).toDecimalPlaces(2);
    items.push({
      rowId,
      name: 'brelok',  // todo
      unitPrice: totalNet.div(item.quantity).toDecimalPlaces(2),
      quantity: item.quantity,
      unit: 'kpl.',
      totalNet,
      vatRate,
      vatAmount: item.total.sub(totalNet),
      totalGross: item.total
    });
    rowId++;
  }

  if (order.shipping.greaterThan(0)) {
    const shippingNet = order.shipping.div(vatDivider).toDecimalPlaces(2);
    items.push({
      rowId,
      name: 'kurier',
      unitPrice: shippingNet,
      quantity: 1,
      unit: 'szt.',
      totalNet: shippingNet,
      vatRate,
      vatAmount: order.shipping.sub(shippingNet),
      totalGross: order.shipping
    });
  }

  const totalNetEur = order.total.div(vatDivider).toDecimalPlaces(2);

  return {
    orderId: order.id,
    invoiceType: type,
    invoiceNumber: number,
    date: DateTime.fromISO(order.date),
    buyer: order.buyer,
    totalNetEur,
    totalVatEur: order.total.sub(totalNetEur),
    totalEur: order.total,
    exchangeRate: order.rate,
    totalConverted: order.totalConverted,
    country: order.country,
    issuer,
    items
  };
};
