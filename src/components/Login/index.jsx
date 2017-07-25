
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
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
      <div className={styles.login}>
        <h2>Log in</h2>
        <div className={styles.innerLogin}>
          <ul className={styles.errors}>
            {Login.renderErrors()}
          </ul>
          <ul className={styles.messages}>
            {this.renderMessages()}
          </ul>
          <form method='POST' action='/login'>
            <TextField name='username' floatingLabelText='Gebruikersnaam of email' fullWidth />
            <TextField name='password' floatingLabelText='Wachtwoord' type='password' fullWidth />
            <input type='hidden' name='redirectUri' value={this.state.redirectUri} />
            <RaisedButton type='submit' label='Log in' className={styles.raisedButton} backgroundColor='#53a9fe' labelColor='#ffffff' />
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
