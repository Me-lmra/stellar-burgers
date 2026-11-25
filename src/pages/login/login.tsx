import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState, useEffect } from 'react';

import { loginUser, clearError } from '@services/slices/user';
import { type RootState, useDispatch, useSelector } from '@services/store';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const error = useSelector((state: RootState) => state.user.error);

  // очистка ошибки при уходе со стр
  useEffect(() => {
    return (): void => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
