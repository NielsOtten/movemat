import React, { Component } from 'react';
import Input from 'react-toolbox/lib/input';
import { Button } from 'react-toolbox';
import { Redirect } from 'react-router-dom';
import fetch from 'fetch-everywhere';
import Dropdown from 'react-toolbox/lib/dropdown';
import { constants as routerLinks } from '../../../../components/App/index';
import Box from '../../../../components/common/Box';

class UserEdit extends Component {
  state = {
    username: '',
    email: '',
    role: '',
    password: '',
    usernameError: '',
    emailError: '',
    roleError: '',
    passwordError: '',
    redirect: false,
  };

  constructor(props) {
    super(props);

    // Bind handle submit because of error in _asyncToGenerator.
    // See issue: https://github.com/babel/babel/issues/4550
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    try {
      const id = this.props.computedMatch.params.id;
      const response = await fetch(`/api/admin/user/${id}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
        credentials: 'include',
      });
      const json = await response.json();
      this.setState({
        username: json.username,
        email: json.email,
        role: json.role,
      });
    } catch(exception) {
      console.log(exception);
    }
  }

  async handleSubmit(e, clicked = false) {
    if(clicked || e.key === 'Enter') {
      try {
        const id = this.props.computedMatch.params.id;
        const json = {
          username: this.state.username,
          email: this.state.email,
          role: this.state.role,
        };

        if(this.state.password.length > 0) {
          json.password = this.state.password;
        }

        const response = await fetch(`/api/admin/user/${id}`, {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(json),
        });
        if(response.status === 200) {
          this.setState({ redirect: true });
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
      <Box>
        {this.state.redirect && <Redirect to={routerLinks.USER_VIEW_ROUTE} />}
        <h2>Edit User</h2>
        <Input
          type='text'
          label='Gebruikersnaam'
          name='name'
          value={this.state.username}
          onKeyPress={this.handleSubmit}
          onChange={username => this.setState({ username })}
          error={this.state.nameError}
        />
        <Input
          type='text'
          label='Email'
          name='name'
          value={this.state.email}
          onKeyPress={this.handleSubmit}
          onChange={email => this.setState({ email })}
          error={this.state.nameError}
        />
        <Input
          type='text'
          label='Wachtwoord'
          name='name'
          value={this.state.password}
          onKeyPress={this.handleSubmit}
          onChange={password => this.setState({ password })}
          error={this.state.nameError}
        />
        <Dropdown
          source={[
            { value: 'admin', label: 'Admin' },
            { value: 'anonymous_user', label: 'Normale gebruiker' },
          ]}
          onChange={role => this.setState({ role })}
          value={this.state.role}
        />
        <Button label='Edit' raised primary onClick={e => this.handleSubmit(e, true)} />
      </Box>
    );
  }
}

export default UserEdit;
