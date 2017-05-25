
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router/lib/Link';
import styles from './styles.scss';
import PassportErrorsStore from '../../client/PassportErrorsStore';

class App extends Component {
  static getErrors(errors) {
    PassportErrorsStore.errors = errors.map(error => ({ key: Object.keys(error)[0], message: Object.values(error)[0].message }));
  }

  componentDidMount() {
    App.getErrors(__passportErrors);
  }

  renderChildren() {
    return React.Children.map(this.props.children, child => React.cloneElement(child, {
      passportErrorsStore: PassportErrorsStore,
    }));
  }

  render() {
    return (
      <div>
        <i className={styles.logo} />
        <ul className={styles.nav}>
          <li className={styles.navItem}>
            <Link className={styles.link} to='/'>Home</Link>
          </li>
          <li className={styles.navItem}>
            <Link className={styles.link} to='/login'>login</Link>
          </li>
          <li className={styles.navItem}>
            <Link className={styles.link} to='/signup'>signup</Link>
          </li>
        </ul>
        <div className={styles.content}>
          {this.renderChildren()}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
