import Decimal from 'decimal.js';
import importEtsyCsv from '@/lib/import/etsyCsvImporter'

describe('EtsyCSVImporter', () => {
  it('builds a list with two orders', () => {
    // given
    const data: string[][] = [
      ['Sale Date', 'Item Name', 'Buyer', 'Quantity', 'Price', 'Coupon Code', 'Coupon Details', 'Discount Amount', 'Shipping Discount', 'Order Shipping', 'Order Sales Tax', 'Item Total', 'Currency', 'Transaction ID', 'Listing ID', 'Date Paid', 'Date Shipped', 'Ship Name', 'Ship Address1', 'Ship Address2', 'Ship City', 'Ship State', 'Ship Zipcode', 'Ship Country', 'Order ID', 'Variations', 'Order Type', 'Listings Type', 'Payment Type', 'InPerson Discount', 'InPerson Location', 'VAT Paid by Buyer', 'SKU'],
      ['11/06/23', 'Personalized resin bookmark', 'John Smith (abcdef)', '2', '14.00', '', '', '1.00', '0.00', '4.9', '0', '28', 'EUR', '12345679', '1463475241', '11/06/2023', '', 'John Smith', 'Horster Str. 1', '', 'Nordwestuckermark', '', '17291', 'Germany', '5678', '', 'online', 'listing', 'online_cc', '', '', '0', ''],
      ['11/05/23', 'Bridesmaid gifts', '', '1', '19.00', '', '', '0.00', '0.00', '4.9', '0', '19', 'EUR', '12345678', '1491609849', '11/06/2023', '', 'Jane Doe', 'Auf der Röte 1', '', 'Müllheim', '', '79379', 'The Netherlands', '1234', 'Personalization', 'online', 'listing', 'online_cc', '', '', '0', '']
    ];

    // when
    const orders = importEtsyCsv(data);

    // then
    expect(orders.length).toBe(2);

    expect(orders[0].id).toEqual('1234');
    expect(orders[0].date).toEqual('2023-11-05');
    expect(orders[0].discount).toEqual(new Decimal('0.00'));
    expect(orders[0].shipping).toEqual(new Decimal('4.9'));
    expect(orders[0].total).toEqual(new Decimal('23.90'));
    expect(orders[0].totalConverted).toBeNull();
    expect(orders[0].rate).toBeNull();
    expect(orders[0].country).toEqual('NL');  // special case: Etsy calls NL "The Netherlands"
    expect(orders[0].currency).toEqual('EUR');
    expect(orders[0].items.length).toBe(1);
    expect(orders[0].items[0].total).toEqual(new Decimal('19'));

    expect(orders[1].id).toEqual('5678');
    expect(orders[1].date).toEqual('2023-11-06');
    expect(orders[1].discount).toEqual(new Decimal('1.00'));
    expect(orders[1].shipping).toEqual(new Decimal('4.9'));
    expect(orders[1].total).toEqual(new Decimal('31.90'));
    expect(orders[1].totalConverted).toBeNull();
    expect(orders[1].rate).toBeNull();
    expect(orders[1].country).toEqual('DE');
    expect(orders[1].currency).toEqual('EUR');
    expect(orders[1].items.length).toBe(1);
    expect(orders[1].items[0].total).toEqual(new Decimal('28'));
  })
})
