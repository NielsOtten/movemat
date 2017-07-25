
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import PassportErrorsStore from '../../client/stores/PassportErrorsStore';
import styles from './styles.scss';

@observer
class Login extends Component {
  static renderErrors() {
    return PassportErrorsStore.errors.map(error => <p key={error.key} dangerouslySetInnerHTML={{ __html: error.message }} />);
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
    return this.state.messages.map((message, index) => <p key={index} dangerouslySetInnerHTML={{ __html: message }} />);
  }

  render() {
    const underlineStyle = { borderColor: '#53a9fe' };
    const colorStyle = { color: '#53a9fe' };
    return (
      <div className={styles.form}>
        <h2>Log in</h2>
        <div className={styles.innerLogin}>
          <div className={styles.errors}>
            {Login.renderErrors()}
          </div>
          <div className={styles.messages}>
            {this.renderMessages()}
          </div>
          <form method='POST' action='/login'>
            <TextField
              name='username'
              floatingLabelText='Gebruikersnaam of email'
              floatingLabelStyle={colorStyle}
              floatingLabelFocusStyle={colorStyle}
              underlineFocusStyle={underlineStyle}
              fullWidth
            />
            <TextField
              name='password'
              floatingLabelText='Wachtwoord'
              type='password'
              floatingLabelStyle={colorStyle}
              floatingLabelFocusStyle={colorStyle}
              underlineFocusStyle={underlineStyle}
              fullWidth
            />
            <input type='hidden' name='redirectUri' value={this.state.redirectUri} />
            <RaisedButton type='submit' label='Log in' className={styles.raisedButton} backgroundColor='#53a9fe' labelColor='#ffffff' />
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
