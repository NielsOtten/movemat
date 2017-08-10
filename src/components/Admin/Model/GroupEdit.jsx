import React, { Component } from 'react';
import fetch from 'fetch-everywhere';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

@observer
class GroupEdit extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getGroup();
  }

  getGroup() {
    fetch(`/api/admin/group/${this.props.routeParams.id}`, {
      credentials: 'same-origin',
      method: 'GET',
    })
      .then(res => res.json())
      .then((json) => {
        this.group = json;
      });
  }

  submitHandler = (e) => {
    e.preventDefault();
    const obj = {};
    if(this.name && this.name.length > 0) {
      obj.name = this.name;
    }
    if(this.email && this.email.length > 0) {
      obj.allowedEmails = this.email.trim().split(',');
    }
    const body = JSON.stringify(obj);
    fetch(`/api/admin/group/${this.props.routeParams.id}`, {
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
        this.getGroup();
      });
  };

  @observable group = {};
  @observable name = '';
  @observable email = [];

  render() {
    const name = this.group.name ? this.group.name : '';
    const id = this.group.id ? this.group.id : '';
    const token = this.group.token ? this.group.token : '';
    const allowedEmails = this.group.allowedEmails ? this.group.allowedEmails.map(email => <li key={email}>{email}</li>) : '';
    return (
      <div>
        <div>
          <p>id: {id}</p>
          <p>Naam: {name}</p>
          <p>Allowed emails:</p>
          <ul>
            {allowedEmails}
          </ul>
          <p>Token: {token}</p>
        </div>
        <form onSubmit={this.submitHandler}>
          <TextField
            name='name'
            hintText='Name'
            onChange={(e, v) => { this.name = v; }}

          /><br />
          <TextField
            name='allowedEmail'
            hintText='Allowed emails (Met comma)'
            onChange={(e, v) => { this.email = v; }}
          /><br />
          <RaisedButton type='submit' label='edit' />
        </form>
      </div>
    );
  }
}

export default GroupEdit;
