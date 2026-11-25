import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

import { updateUser } from '@services/slices/user';
import { type RootState, useDispatch, useSelector } from '@services/store';

export const Profile = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.user);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (currentUser) {
      setFormValue((prevState) => ({
        ...prevState,
        name: currentUser.name || '',
        email: currentUser.email || '',
      }));
    }
  }, [currentUser]);

  const isFormChanged =
    formValue.name !== (currentUser?.name ?? '') ||
    formValue.email !== (currentUser?.email ?? '') ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(updateUser(formValue)).then((result) => {
      if (updateUser.fulfilled.match(result)) {
        setFormValue((prev) => ({ ...prev, password: '' }));
      }
    });
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    setFormValue({
      name: currentUser?.name ?? '',
      email: currentUser?.email ?? '',
      password: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
