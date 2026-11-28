import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';
import { NavLink, Link } from 'react-router-dom';

import type { TAppHeaderUIProps } from './type';
import type { ReactNode } from 'react';

import styles from './app-header.module.css';

type TNavLinkWithIconProps = {
  to: string;
  icon: (isActive: boolean) => ReactNode;
  children: ReactNode;
};

const NavLinkWithIcon = ({
  to,
  icon,
  children,
}: TNavLinkWithIconProps): React.JSX.Element => (
  <NavLink
    to={to}
    className={({ isActive }) => `${styles.link} ${isActive ? styles.link_active : ''}`}
  >
    {({ isActive }) => (
      <>
        {icon(isActive)}
        {children}
      </>
    )}
  </NavLink>
);

export const AppHeaderUI = ({ userName }: TAppHeaderUIProps): React.JSX.Element => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <NavLinkWithIcon
          to="/"
          icon={(isActive) => <BurgerIcon type={isActive ? 'primary' : 'secondary'} />}
        >
          <p className="text text_type_main-default ml-2 mr-10">Конструктор</p>
        </NavLinkWithIcon>

        <NavLinkWithIcon
          to="/feed"
          icon={(isActive) => <ListIcon type={isActive ? 'primary' : 'secondary'} />}
        >
          <p className="text text_type_main-default ml-2">Лента заказов</p>
        </NavLinkWithIcon>
      </div>

      <div className={styles.logo}>
        <Link to="/">
          <Logo className="" />
        </Link>
      </div>

      <div className={styles.link_position_last}>
        <NavLinkWithIcon
          to="/profile"
          icon={(isActive) => <ProfileIcon type={isActive ? 'primary' : 'secondary'} />}
        >
          <p className="text text_type_main-default ml-2">
            {userName ?? 'Личный кабинет'}
          </p>
        </NavLinkWithIcon>
      </div>
    </nav>
  </header>
);
