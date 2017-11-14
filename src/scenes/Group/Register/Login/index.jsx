import React, { Component } from 'react';
import Input from 'react-toolbox/lib/input';
import { Button } from 'react-toolbox';
import { Redirect } from 'react-router-dom';

class Login extends Component {
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
        const { token, id } = this.props.match.params;
        const username = this.state.name;
        const password = this.state.password;
        const response = await fetch(`/api/group/${id}/signup/${token}`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ username, password, login: true }),
        });
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
    return (
      <div>
        {this.state.redirect && <Redirect to='/login' />}
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
        <Button label='inloggen' raised primary onClick={e => this.handleSubmit(e, true)} />
      </div>
    );
  }
}

export default Login;
