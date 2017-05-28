
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PassportErrorsStore from '../../client/stores/PassportErrorsStore';
import styles from './styles.scss';

@observer
class Login extends Component {
  static renderErrors() {
    return PassportErrorsStore.errors.map(error => <li key={error.key} dangerouslySetInnerHTML={{ __html: error.message }} />);
  }

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      redirectUri: '',
    };
  }

  componentWillMount() {
    const messages = this.props.location.query.messages ? this.props.location.query.messages.split(',') : [];
    const redirectUri = this.props.location.query.redirectUri ? this.props.location.query.redirectUri : '';
    this.setState({ messages, redirectUri });
  }

  renderMessages() {
    return this.state.messages.map((message, index) => <li key={index} dangerouslySetInnerHTML={{ __html: message }} />);
  }

  render() {
    return (
      <div>
        <ul className={styles.errors}>
          {Login.renderErrors()}
        </ul>
        <ul className={styles.messages}>
          {this.renderMessages()}
        </ul>
        <form method='POST' action='/login'>
          <input type='text' name='username' placeholder='Username' />
          <input type='password' name='password' placeholder='Password' />
          <input type='hidden' name='redirectUri' value={this.state.redirectUri} />
          <input type='submit' />
        </form>
      </div>
    );
  }
}

export default Login;
