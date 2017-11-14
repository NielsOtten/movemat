import React, { Component } from 'react';
import Input from 'react-toolbox/lib/input';
import { Redirect } from 'react-router-dom';
import { Button } from 'react-toolbox';

class SignUp extends Component {
  state = {
    email: '',
    username: '',
    password: '',
    secondPassword: '',
    emailError: '',
    usernameError: '',
    passwordError: '',
    secondPasswordError: '',
  };

  checkPasswords = () => {
    if(this.state.password !== this.state.secondPassword) {
      this.setState({
        passwordError: 'Wachtwoorden zijn niet gelijk',
        secondPasswordError: 'Wachtwoorden zijn niet gelijk',
      });
    } else {
      this.setState({
        passwordError: '',
        secondPasswordError: '',
      });
    }
  };

  async handleSubmit(e, clicked = false) {
    if(clicked || e.key === 'Enter') {
      ['email', 'password', 'username'].forEach((value) => {
        if(this.state[value].length <= 0) {
          const obj = {};
          obj[`${value}Error`] = 'Mag niet leeg zijn';
          this.setState(obj);
        } else {
          const obj = {};
          obj[`${value}Error`] = '';
          this.setState(obj);
        }
      });
      try {
        const { token, id } = this.props.match.params;
        const { username, password, email } = this.state;
        const response = await fetch(`/api/group/${id}/signup/${token}`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ username, password, email, login: false }),
        });
        const json = await response.json();

        if(json instanceof Object) {
          if(json.success) {
            this.setState({ redirect: true });
          } else {
            const { emailError, usernameError, passwordError } = json.errors;
            const values = { emailError, usernameError, passwordError };
            const obj = {};
            Object.keys(values).forEach((key) => {
              if(values[key] === undefined || !values[key]) {
                obj[key] = '';
              } else {
                obj[key] = values[key];
              }
            });
            this.setState(obj);
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
          label='Gebruikersnaam'
          name='name'
          value={this.state.username}
          onKeyPress={this.handleSubmit}
          onChange={username => this.setState({ username })}
          error={this.state.usernameError}
        />
        <Input
          type='email'
          label='E-mail'
          name='email'
          value={this.state.email}
          onKeyPress={this.handleSubmit}
          onChange={email => this.setState({ email })}
          error={this.state.emailError}
        />
        <Input
          type='password'
          label='Wachtwoord'
          name='password'
          value={this.state.password}
          onKeyPress={this.handleSubmit}
          onChange={async (password) => {
            await this.setState({ password });
            this.checkPasswords();
          }}
          error={this.state.passwordError}
        />
        <Input
          type='password'
          label='Wachtwoord herhalen'
          name='secondpassword'
          value={this.state.secondPassword}
          onKeyPress={this.handleSubmit}
          onChange={async (secondPassword) => {
            await this.setState({ secondPassword });
            this.checkPasswords();
          }}
          error={this.state.secondPasswordError}
        />
        <Button label='Meldt aan' raised primary onClick={e => this.handleSubmit(e, true)} />
      </div>
    );
  }
}

export default SignUp;
