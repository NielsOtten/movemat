import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GroupApi from '../../api';

/**
 * This is the detail view of the group in which you can view all your photo's from that group.
 */
class Group extends Component {
  constructor(props) {
    super(props);
    this.GroupAPI = new GroupApi(props.params.id);
    this.onSumbitHandler = this.onSumbitHandler.bind(this);
    this.getToken = this.getToken.bind(this);
  }

  onSumbitHandler(e) {
    e.preventDefault();
    this.GroupAPI.addUser();
  }

  getToken(e) {
    e.preventDefault();
    this.GroupAPI.getToken();
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onSumbitHandler}>
          <input type='submit' />
        </form>
        <button onClick={this.getToken}>GetToken</button>
      </div>
    );
  }
}

export default Group;
