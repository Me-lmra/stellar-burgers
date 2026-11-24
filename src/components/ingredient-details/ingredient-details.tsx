import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';

import { useSelector } from '@services/store';

import type { RootState } from '@services/store';
import type { TIngredient } from '@utils-types';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();

  const ingredients = useSelector((state: RootState) => state.ingredients.data);
  const isLoading = useSelector((state: RootState) => state.ingredients.loading);
  const ingredientData = ingredients.find((item: TIngredient) => item._id === id);

  if (isLoading) {
    return <Preloader />;
  }
  if (!ingredientData) {
    return <p className="text text_type_main-medium">Ингредиент не найден</p>;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
