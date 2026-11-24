import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import {
  getFeeds,
  getFeedOrdersSelector,
  getFeedLoadingSelector,
} from '@services/slices/feed';
import { type RootState, useDispatch, useSelector } from '@services/store';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const orders = useSelector((state: RootState) => getFeedOrdersSelector(state));
  const isLoading = useSelector((state: RootState) => getFeedLoadingSelector(state));

  useEffect(() => {
    void dispatch(getFeeds());
  }, [dispatch]);

  const handleGetFeeds = (): void => {
    void dispatch(getFeeds());
  };

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
