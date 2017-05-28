
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PassportErrorsStore from '../../client/stores/PassportErrorsStore';
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
          <input type='text' name='username' placeholder='Username' />
          <input type='password' name='password' placeholder='Password' />
          <input type='submit' />
        </form>
      </div>
    );
  }
}

export default Login;
