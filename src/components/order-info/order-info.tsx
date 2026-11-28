import { Preloader, OrderInfoUI } from '@ui';
import { useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getOrderByNumber, getOrderByNumberSelector } from '@services/slices/feed';
import { getIngredientsDataSelector } from '@services/slices/ingredients';
import { getProfileOrderByNumberSelector } from '@services/slices/profile';
import { useSelector, useDispatch } from '@services/store';

import type { TIngredient } from '@utils-types';

import styles from '../../components/app/app.module.css';

type TOrderInfoProps = {
  isModal?: boolean;
};

export const OrderInfo = ({ isModal = false }: TOrderInfoProps): React.JSX.Element => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();

  const [isOrderLoading, setIsOrderLoading] = useState(false);

  const ingredients = useSelector(getIngredientsDataSelector);
  const orderData = useSelector((state) => {
    if (!number) return null;
    const num = Number(number);
    return (
      getProfileOrderByNumberSelector(state, num) ?? getOrderByNumberSelector(state, num)
    );
  });

  useEffect(() => {
    if (!number) return;
    if (orderData) return;
    setIsOrderLoading(true);
    void dispatch(getOrderByNumber(Number(number))).finally(() => {
      setIsOrderLoading(false);
    });
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

  if (isOrderLoading) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Заказ не найден</p>
    );
  }

  return <OrderInfoUI orderInfo={orderInfo} isModal={isModal} />;
};
