import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { fetchProfileOrders } from '@services/slices/profile';
import { type RootState, useDispatch, useSelector } from '@services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const orders = useSelector((state: RootState) => state.profile.orders);
  const isLoading = useSelector((state: RootState) => state.profile.isLoading);

  useEffect(() => {
    void dispatch(fetchProfileOrders());
  }, [dispatch]);

  if (isLoading && orders.length === 0) {
    return <p className="text text_type_main-medium">Загрузка заказов...</p>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
