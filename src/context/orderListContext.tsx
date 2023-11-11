'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { IOrderList  } from '@/lib/orderList';

const emptyOrderList: IOrderList = {
  orders: []
};

const OrderListContext = createContext({
  orderList: emptyOrderList,
  updateList: (newList: IOrderList) => {},
});

const OrderListProvider = ({ children }: { children: ReactNode }) => {
  const [orderList, setOrderList] = useState<IOrderList>(emptyOrderList);

  const updateList = (newList: IOrderList) => {
    setOrderList(newList);
  }

  return (
    <OrderListContext.Provider value={{ orderList, updateList }}>
      {children}
    </OrderListContext.Provider>
  );
}

export default OrderListProvider;

export const useOrderList = () => {
  return useContext(OrderListContext);
}
