import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { AppBar, NavDrawer, Navigation } from 'react-toolbox';
import { Redirect } from 'react-router-dom';
import Button from '../../common/LinkButtons';
import HeaderStore from './HeaderStore';
import AuthStore from '../../../stores/AuthStore';
import style from './style.scss';

@observer
class Header extends Component {
  state = {
    logout: false,
  };

  render() {
    return (
      <div>
        {this.state.logout && <Redirect to='/' />}
        <AppBar leftIcon='menu' onLeftIconClick={() => HeaderStore.toggleDrawerActive()}>
          <Navigation type='horizontal' className={style.navigation}>
            {/* TODO: Make own buttons for routing. */}
            {!AuthStore.loggedIn && <Button href='/login' label='Login' className={style.raisedButton} raised /> }
            {!AuthStore.loggedIn && <Button href='/registreer' label='Registreren' className={style.flatButton} flat />}
            {AuthStore.loggedIn && <Button href='/' label='Log uit' className={style.raisedButton} onClick={(e) => { e.preventDefault(); this.setState({ logout: true }); AuthStore.logOut(); }} raised /> }
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
