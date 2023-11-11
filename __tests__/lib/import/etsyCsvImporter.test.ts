import importEtsyCsv from '@/lib/import/etsyCsvImporter'

describe('EtsyCSVImporter', () => {
  it('builds a list with two orders', () => {
    const data: string[][] = [
      ['Sale Date', 'Item Name', 'Buyer', 'Quantity', 'Price', 'Coupon Code', 'Coupon Details', 'Discount Amount', 'Shipping Discount', 'Order Shipping', 'Order Sales Tax', 'Item Total', 'Currency', 'Transaction ID', 'Listing ID', 'Date Paid', 'Date Shipped', 'Ship Name', 'Ship Address1', 'Ship Address2', 'Ship City', 'Ship State', 'Ship Zipcode', 'Ship Country', 'Order ID', 'Variations', 'Order Type', 'Listings Type', 'Payment Type', 'InPerson Discount', 'InPerson Location', 'VAT Paid by Buyer', 'SKU'],
      ['11/06/23', 'Personalized resin bookmark', 'John Smith (abcdef)', '2', '14.00', '', '', '0.00', '0.00', '4.9', '0', '28', 'EUR', '12345679', '1463475241', '11/06/2023', '', 'John Smith', 'Horster Str. 1', '', 'Nordwestuckermark', '', '17291', 'Germany', '1234', '', 'online', 'listing', 'online_cc', '', '', '0', ''],
      ['11/06/23', 'Bridesmaid gifts', '', '1', '19.00', '', '', '0.00', '0.00', '4.9', '0', '19', 'EUR', '12345678', '1491609849', '11/06/2023', '', 'Jane Doe', 'Auf der Röte 1', '', 'Müllheim', '', '79379', 'Germany', '5678', 'Personalization', 'online', 'listing', 'online_cc', '', '', '0', '']
    ];

    const orderList = importEtsyCsv(data);
    console.log(orderList.orders);

    expect(orderList.orders.length).toEqual(2);
  })
})
