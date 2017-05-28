
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import styles from './styles.scss';
import PassportErrorsStore from '../../client/stores/PassportErrorsStore';

@observer
class Signup extends Component {

  static renderErrors() {
    return PassportErrorsStore.errors.map(error => <li key={error.key} dangerouslySetInnerHTML={{ __html: error.message }} />);
  }

  render() {
    return (
      <div>
        <ul className={styles.errors}>
          {Signup.renderErrors()}
        </ul>
        <form method='POST' action='/signup'>
          <input type='text' name='email' placeholder='Email' />
          <input type='text' name='username' placeholder='Username' />
          <input type='password' name='password' placeholder='Password' />
          <input type='submit' />
        </form>
      </div>
    );
  }
}

export default Signup;
