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

  @observable group = {};

  render() {
    console.log(this.group.name);
    return (
      <form>
        <TextField
          hintText='Name'
          defaultValue={this.group.name === 'undefined' ? this.group.name : 'a'}
        /><br />
        <TextField
          hintText='Allowed emails (Met comma)'
          defaultValue={this.group.name ? this.group.name : 'a'}
        /><br />
        <RaisedButton type='submit' label='edit' />
      </form>
    );
  }
}

export default GroupEdit;
