import React, { Component } from 'react';
import fetch from 'fetch-everywhere';
import TextField from 'material-ui/TextField';
import Popup from 'react-popup';
import RaisedButton from 'material-ui/RaisedButton';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

@observer
class UserNew extends Component {
  constructor(props) {
    super(props);
  }

  submitHandler = (e) => {
    e.preventDefault();
    const obj = {};
    if(this.name && this.name.length > 0) {
      obj.username = this.name;
    }
    if(this.email && this.email.length > 0) {
      obj.email = this.email;
    }
    if(this.password && this.password.length > 0) {
      obj.password = this.password;
    }
    const body = JSON.stringify(obj);
    fetch('/api/admin/user', {
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      method: 'POST',
      body,
    })
      .then(() => {
        Popup.alert('succesvol aangemaakt.');
      });
  };

  @observable name = '';
  @observable email = '';
  @observable password = '';

  render() {
    return (
      <div>
        <form onSubmit={this.submitHandler}>
          <TextField
            name='name'
            hintText='Name'
            onChange={(e, v) => { this.name = v; }}

          /><br />
          <TextField
            name='email'
            hintText='Email'
            onChange={(e, v) => { this.email = v; }}

          /><br />
          <TextField
            name='password'
            hintText='Wachtwoord'
            onChange={(e, v) => { this.password = v; }}

          /><br />
          <RaisedButton type='submit' label='Nieuwe gebruiker' />
        </form>
      </div>
    );
  }
}

export default UserNew;
