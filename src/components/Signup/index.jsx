
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import styles from './styles.scss';
import PassportErrorsStore from '../../client/stores/PassportErrorsStore';

@observer
class Signup extends Component {

  static renderErrors() {
    return PassportErrorsStore.errors.map(error => <li key={error.key} dangerouslySetInnerHTML={{ __html: error.message }} />);
  }

  render() {
    const underlineStyle = { borderColor: '#53a9fe' };
    const colorStyle = { color: '#53a9fe' };
    return (
      <div className={styles.form}>
        <h2>Registreer</h2>
        <div className={styles.innerLogin}>
          <ul className={styles.errors}>
            {Signup.renderErrors()}
          </ul>
          <form method='POST' action='/signup'>
            <TextField
              name='email'
              floatingLabelText='Email'
              floatingLabelStyle={colorStyle}
              floatingLabelFocusStyle={colorStyle}
              underlineFocusStyle={underlineStyle}
              fullWidth
            />
            <TextField
              name='username'
              floatingLabelText='Gebruikersnaam'
              floatingLabelStyle={colorStyle}
              floatingLabelFocusStyle={colorStyle}
              underlineFocusStyle={underlineStyle}
              fullWidth
            />
            <TextField
              name='password'
              type='password'
              floatingLabelText='Wachtwoord'
              floatingLabelStyle={colorStyle}
              floatingLabelFocusStyle={colorStyle}
              underlineFocusStyle={underlineStyle}
              fullWidth
            />
            <TextField
              name='passwordsecond'
              type='password'
              floatingLabelText='Wachtwoord opnieuw'
              floatingLabelStyle={colorStyle}
              floatingLabelFocusStyle={colorStyle}
              underlineFocusStyle={underlineStyle}
              fullWidth
            />
            <RaisedButton type='submit' label='Registreer' className={styles.raisedButton} backgroundColor='#53a9fe' labelColor='#ffffff' />
          </form>
        </div>
      </div>
    );
  }
}

export default Signup;
