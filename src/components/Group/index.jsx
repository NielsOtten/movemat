import React, { Component } from 'react';
import GroupApi from '../../api';

/**
 * This is the detail view of the group in which you can view all your photo's from that group.
 */
class Group extends Component {
  constructor(props) {
    super(props);
    this.GroupAPI = new GroupApi(props.params.id);
    this.onSumbitHandler = this.onSumbitHandler.bind(this);
  }

  onSumbitHandler(e) {
    e.preventDefault();
    this.GroupAPI.addUser();
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onSumbitHandler}>
          <input type='submit' />
        </form>
      </div>
    );
  }
}

export default Group;
