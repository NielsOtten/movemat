import React, { Component } from 'react';
import fetch from 'fetch-everywhere';
import TextField from 'material-ui/TextField';
import Popup from 'react-popup';
import RaisedButton from 'material-ui/RaisedButton';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

@observer
class UserEdit extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getUser();
  }

  getUser() {
    fetch(`/api/admin/user/${this.props.routeParams.id}`, {
      credentials: 'same-origin',
      method: 'GET',
    })
      .then(res => res.json())
      .then((json) => {
        this.user = json;
      });
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
    fetch(`/api/admin/user/${this.props.routeParams.id}`, {
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      method: 'PUT',
      body,
    })
      .then(() => {
        this.getUser();
        Popup.alert('succesvol aangepast.');
      });
  };

  @observable user = {};
  @observable name = '';
  @observable email = '';
  @observable password = '';

  render() {
    const id = this.user._id ? this.user._id : '';
    const name = this.user.username ? this.user.username : '';
    const email = this.user.email ? this.user.email : '';
    return (
      <div>
        <div>
          <p>id: {id}</p>
          <p>username: {name}</p>
          <p>email: {email}</p>
        </div>
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
          <RaisedButton type='submit' label='edit' />
        </form>
      </div>
    );
  }
}

export default UserEdit;
