import React, { Component } from 'react';
import fetch from 'fetch-everywhere';
import TextField from 'material-ui/TextField';
import Popup from 'react-popup';
import RaisedButton from 'material-ui/RaisedButton';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

@observer
class GroupNew extends Component {
  constructor(props) {
    super(props);
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
    fetch('/api/admin/group', {
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      method: 'POST',
      body,
    })
      .then(res => res.json())
      .then((res) => {
        Popup.alert('Succesvol toegevoegd');
      });
  };

  @observable group = {};
  @observable name = '';
  @observable email = [];

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
            name='allowedEmail'
            hintText='Allowed emails (Met comma)'
            onChange={(e, v) => { this.email = v; }}
          /><br />
          <RaisedButton type='submit' label='Voeg toe' />
        </form>
      </div>
    );
  }
}

export default GroupNew;
