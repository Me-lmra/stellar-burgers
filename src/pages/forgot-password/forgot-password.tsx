import { ForgotPasswordUI } from '@ui-pages';
import { useState, type SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { forgotPassword } from '@services/slices/user';
import { type RootState, useDispatch, useSelector } from '@services/store';

export const ForgotPassword = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state: RootState) => state.user.error);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    void dispatch(forgotPassword({ email })).then((result) => {
      if (forgotPassword.fulfilled.match(result)) {
        localStorage.setItem('resetPassword', 'true');
        void navigate('/reset-password', { replace: true });
      }
    });
  };

  return (
    <ForgotPasswordUI
      errorText={error ?? undefined}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
