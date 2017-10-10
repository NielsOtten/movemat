import React, { Component } from 'react';
import Input from 'react-toolbox/lib/input';
import { Button } from 'react-toolbox';
import { Login } from '../../services/api/User';
import styles from './style.scss';

class LoginScene extends Component {

  state = {
    name: '',
    password: '',
  };

  constructor(props) {
    super(props);

    // Bind handle submit because of error in _asyncToGenerator.
    // See issue: https://github.com/babel/babel/issues/4550
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(e, clicked = false) {
    if(clicked || e.key === 'Enter') {
      try {
        const response = await Login(this.state.name, this.state.password);
        console.log(response);
        const json = await response.json();
      } catch(exception) {
        console.log(exception);
        // Time out, 500, weird errors are handled here.
        // TODO: Call global function to handle these errors.
      }
    }
  }

  render() {
    return (
      <div className={styles.loginScene}>
        <section className={styles.loginWrapper}>
          <h2>Steps login</h2>
          <Input
            type='text'
            label='Gebruikersnaam/E-mailadres'
            name='name'
            value={this.state.name}
            onKeyPress={this.handleSubmit}
            onChange={name => this.setState({ name })}
          />
          <Input
            type='password'
            label='Wachtwoord'
            name='password'
            value={this.state.password}
            onKeyPress={this.handleSubmit}
            onChange={password => this.setState({ password })}
          />
          <Button label='inloggen' raised primary onClick={e => this.handleSubmit(e, true)} />
        </section>
      </div>
    );
  }
}

export default LoginScene;
