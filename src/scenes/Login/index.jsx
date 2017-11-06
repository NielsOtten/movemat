import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Input from 'react-toolbox/lib/input';
import { Button } from 'react-toolbox';
import { Login } from '../../services/api/User';
import Box from '../../components/common/Box';
import styles from './style.scss';

class LoginScene extends Component {

  state = {
    name: '',
    password: '',
    nameError: '',
    passwordError: '',
    redirect: false,
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
        const json = await response.json();

        if(json instanceof Object) {
          if(json.success) {
            this.setState({ redirect: true });
          } else {
            this.setState({ nameError: json.messages.name, passwordError: json.messages.password });
          }
        }
      } catch(exception) {
        console.log(exception);
        // Time out, 500, weird errors are handled here.
        // TODO: Call global function to handle these errors.
      }
    }
  }

  render() {
    if(this.state.redirect) {
      return <Redirect to='/dashboard' push />;
    }

    return (
      <Box>
        <h2>Steps login</h2>
        <Input
          type='text'
          label='Gebruikersnaam/E-mailadres'
          name='name'
          value={this.state.name}
          onKeyPress={this.handleSubmit}
          onChange={name => this.setState({ name })}
          error={this.state.nameError}
        />
        <Input
          type='password'
          label='Wachtwoord'
          name='password'
          value={this.state.password}
          onKeyPress={this.handleSubmit}
          onChange={password => this.setState({ password })}
          error={this.state.passwordError}
        />
        {/*<Link className={styles.passwordLink} to='/wachtwoord-vergeten' >Wachtwoord vergeten</Link>*/}
        <Button label='inloggen' raised primary onClick={e => this.handleSubmit(e, true)} />
      </Box>
    );
  }
}

export default LoginScene;
