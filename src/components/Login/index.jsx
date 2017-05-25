
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PassportErrorsStore from '../../client/PassportErrorsStore';
import styles from './styles.scss';

@observer
class Login extends Component {
  static renderErrors() {
    return PassportErrorsStore.errors.map(error => <li key={error.key} dangerouslySetInnerHTML={{ __html: error.message }} />);
  }

  render() {
    return (
      <div>
        <ul className={styles.errors}>
          {Login.renderErrors()}
        </ul>
        <form method='POST' action='/login'>
          <input type='text' name='username' />
          <input type='password' name='password' />
          <input type='submit' />
        </form>
      </div>
    );
  }
}

export default Login;
