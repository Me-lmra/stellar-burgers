import { AppHeaderUI } from '@ui';

import { getUserSelector } from '@services/slices/user';
import { useSelector } from '@services/store';

export const AppHeader = (): React.JSX.Element => {
  const user = useSelector(getUserSelector);
  const userName = user?.name;

  return <AppHeaderUI userName={userName} />;
};
