import { combineReducers } from '@reduxjs/toolkit';

import { burgerConstructorReducer } from './slices/constructor';
import { feedReducer } from './slices/feed';
import { ingredientsReducer } from './slices/ingredients';
import { profileReducer } from './slices/profile';
import { userReducer } from './slices/user';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  user: userReducer,
  profile: profileReducer,
  feed: feedReducer,
});
