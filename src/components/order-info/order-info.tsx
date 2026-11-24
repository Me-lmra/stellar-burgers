import { Preloader, OrderInfoUI } from '@ui';
import { useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import {
  getOrderByNumber,
  getOrderByNumberSelector,
  getFeedLoadingSelector,
} from '@services/slices/feed';
import { useSelector, useDispatch } from '@services/store';

import type { RootState } from '@services/store';
import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();

  const ingredients = useSelector((state: RootState) => state.ingredients.data);
  const orderData = useSelector((state: RootState) =>
    number ? getOrderByNumberSelector(state, Number(number)) : null
  );
  const isLoading = useSelector((state: RootState) => getFeedLoadingSelector(state));

  useEffect(() => {
    if (!number) return;
    if (orderData) return;
    void dispatch(getOrderByNumber(Number(number)));
  }, [dispatch, number, orderData?.number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
