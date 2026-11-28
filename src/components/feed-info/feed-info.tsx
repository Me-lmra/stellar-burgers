import { FeedInfoUI } from '@ui';

import {
  getFeedOrdersSelector,
  getFeedTotalSelector,
  getFeedTotalTodaySelector,
  getFeedLoadingSelector,
  getFeedErrorSelector,
} from '@services/slices/feed';
import { useSelector } from '@services/store';

import type { TOrder } from '@utils-types';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo = (): React.JSX.Element => {
  const orders = useSelector(getFeedOrdersSelector);
  const total = useSelector(getFeedTotalSelector);
  const totalToday = useSelector(getFeedTotalTodaySelector);
  const isLoading = useSelector(getFeedLoadingSelector);
  const error = useSelector(getFeedErrorSelector);

  const feed = {
    orders,
    total,
    totalToday,
    isLoading,
    error,
  };
  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI readyOrders={readyOrders} pendingOrders={pendingOrders} feed={feed} />
  );
};
