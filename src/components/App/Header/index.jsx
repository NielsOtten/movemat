import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { AppBar, NavDrawer, Navigation, Button } from 'react-toolbox';
import HeaderStore from './HeaderStore';
import style from './style.scss';

@observer
class Header extends Component {
  render() {
    return (
      <div>
        <AppBar leftIcon='menu' onLeftIconClick={() => HeaderStore.toggleDrawerActive()}>
          <Navigation type='horizontal' className={style.navigation}>
            {/* TODO: Make own buttons for routing */}
            <Button href='/login' label='Login' className={style.raisedButton} raised />
            <Button href='/registreer' label='Registreren' className={style.flatButton} flat />
          </Navigation>
        </AppBar>
        <NavDrawer
          active={HeaderStore.drawerActive}
          pinned={HeaderStore.drawerPinned}
          onOverlayClick={() => HeaderStore.toggleDrawerActive()}
        />
      </div>
    );
  }
}

export default Header;
