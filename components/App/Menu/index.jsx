import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router';
import styles from './styles.scss';
import PassportErrorsStore from '../../../client/stores/PassportErrorsStore';
import UserStore from '../../../client/stores/UserStore';

@observer
class Menu extends Component {
  static onClickHandler() {
    PassportErrorsStore.errors = [];
  }

  componentDidMount() {
    UserStore.login();
  }

  render() {
    let homeLink = '/';
    let secondMenu = (<ul className={styles.secondMenu}>
      <li className={styles.navItem}>
        <Link className={[styles.link, styles.loginLink].join(' ')} to='/login' onClick={this.onClickHandler}>Log in</Link>
      </li>
      <li className={styles.navItem}>
        <Link className={styles.link} to='/signup' onClick={this.onClickHandler}>Registreer</Link>
      </li>
    </ul>);
    if(UserStore.isLoggedIn) {
      secondMenu = (<ul className={styles.secondMenu}>
        <li className={styles.navItem}>
          <Link className={[styles.link, styles.loginLink].join(' ')} to='/login' onClick={this.onClickHandler}>Log uit</Link>
        </li>
      </ul>);
      homeLink = '/dashboard';
    }


    return (
      <header>
        <div className={styles.logo}><img src={require('../../../src/images/StepsMMlogoLang.png')} alt='Logo' /></div>
        <ul className={styles.mainMenu}>
          <li className={styles.navItem}>
            <Link className={styles.link} to={homeLink} onClick={this.onClickHandler}>Home</Link>
          </li>
        </ul>
        { secondMenu }
      </header>
    );
  }
}

export default Menu;
