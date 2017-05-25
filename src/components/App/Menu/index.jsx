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
      <ul className={styles.nav}>
        <li className={styles.navItem}>
          <Link className={styles.link} to='/' onClick={this.onClickHandler}>Home</Link>
        </li>
        <li className={styles.navItem}>
          <Link className={styles.link} to='/login' onClick={this.onClickHandler}>login</Link>
        </li>
        <li className={styles.navItem}>
          <Link className={styles.link} to='/signup' onClick={this.onClickHandler}>signup</Link>
        </li>
      </ul>
    );
  }
}

export default Menu;
