import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { AppBar, NavDrawer, Navigation } from 'react-toolbox';
import { Redirect, Link } from 'react-router-dom';
import Button from '../../common/LinkButtons';
import AuthStore from '../../../stores/AuthStore';
import style from './style.scss';
import { constants as LinkRoutes } from '../index';

@observer
class Header extends Component {
  state = {
    logout: false,
  };

  render() {
    const logoRoute = AuthStore.loggedIn ? LinkRoutes.DASHBOARD_ROUTE : LinkRoutes.HOME_ROUTE;
    return (
      <div>
        {this.state.logout && <Redirect to='/' />}
        <AppBar>
          <Link to={logoRoute} >
            <img className={style.logo} src='/steps-logo.png' alt='Steps Logo' />
          </Link>
          <Navigation type='horizontal' className={style.navigation}>
            {!AuthStore.loggedIn && <Button href='/login' label='Login' className={style.raisedButton} raised /> }
            {AuthStore.loggedIn && <Button href='/' label='Log uit' className={style.raisedButton} onClick={(e) => { e.preventDefault(); this.setState({ logout: true }); AuthStore.logOut(); }} raised /> }
          </Navigation>
        </AppBar>
      </div>
    );
  }
}

export default Header;
