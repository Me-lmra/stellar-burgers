import {
  AppHeader,
  ProtectedRoute,
  Modal,
  OrderInfo,
  IngredientDetails,
} from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
} from '@pages';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { fetchIngredients } from '@services/slices/ingredients';
import { getUser, authChecked } from '@services/slices/user';
import { useDispatch, useSelector } from '@services/store';

import type { RootState } from '@services/store';

import '../../index.css';

import styles from './app.module.css';

type LocationState = {
  background?: Location;
};

const App = (): React.JSX.Element => {
  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent />
    </div>
  );
};

export default App;

const AppContent = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const ingredients = useSelector((state: RootState) => state.ingredients.data);
  const isLoading = useSelector((state: RootState) => state.ingredients.loading);
  const error = useSelector((state: RootState) => state.ingredients.error);
  const isAuthChecked = useSelector((state: RootState) => state.user.isAuthChecked);

  useEffect(() => {
    void dispatch(fetchIngredients());
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
      void dispatch(getUser());
    } else {
      void dispatch(authChecked());
    }
  }, [dispatch]);

  if (!isAuthChecked || isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты: {error}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
    );
  }

  return <RouteComponent />;
};

const RouteComponent = (): React.JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as LocationState | null;
  const background = state?.background;

  const handleClose = (): void => {
    void navigate(-1);
  };

  return (
    <>
      <Routes location={background ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />

        <Route path="/feed/:number" element={<OrderInfo />} />
        <Route path="/ingredients/:id" element={<IngredientDetails />} />
        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/feed/:number"
            element={
              <Modal title="Информация о заказе" onClose={handleClose}>
                <OrderInfo isModal />
              </Modal>
            }
          />
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={handleClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute>
                <Modal title="Информация о заказе" onClose={handleClose}>
                  <OrderInfo isModal />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};
