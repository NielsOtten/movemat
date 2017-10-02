import React from 'react';
import { observer } from 'mobx-react';
import { AppBar, NavDrawer } from 'react-toolbox';
import HeaderStore from './HeaderStore';

const Header = observer(() => (
  <div>
    <AppBar leftIcon='menu' onLeftIconClick={() => HeaderStore.toggleDrawerActive()} />
    <NavDrawer
      active={HeaderStore.drawerActive}
      pinned={HeaderStore.drawerPinned}
      onOverlayClick={() => HeaderStore.toggleDrawerActive()}
    >
      <p>
        Navigation, account switcher, etc. go here.
      </p>
    </NavDrawer>
  </div>
));

export default Header;
