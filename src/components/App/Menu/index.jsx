import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './styles.scss';
import PassportErrorsStore from '../../../client/stores/PassportErrorsStore';

class Menu extends Component {
  static onClickHandler() {
    PassportErrorsStore.errors = [];
  }

  constructor(props) {
    super(props);

    this.onClickHandler = Menu.onClickHandler.bind(this);
  }

  render() {
    return (
      <header>
        <div className={styles.logo}>Steps</div>
        <ul className={styles.mainMenu}>
          <li className={styles.navItem}>
            <Link className={styles.link} to='/' onClick={this.onClickHandler}>Home</Link>
          </li>
        </ul>
        <ul className={styles.secondMenu}>
          <li className={styles.navItem}>
            <Link className={[styles.link, styles.loginLink].join(' ')} to='/login' onClick={this.onClickHandler}>Log in</Link>
          </li>
          <li className={styles.navItem}>
            <Link className={styles.link} to='/signup' onClick={this.onClickHandler}>Registreer</Link>
          </li>
        </ul>
      </header>
    );
  }
}

export default Menu;
