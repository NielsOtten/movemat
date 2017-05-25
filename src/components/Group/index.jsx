import React, { Component } from 'react';
import styles from './styles.scss';
import GroupApi from '../../api';

/**
 * This is the detail view of the group in which you can view all your photo's from that group.
 */
class Group extends Component {
  constructor(props) {
    super(props);
    console.log(props.params.id);
    this.GroupAPI = new GroupApi(props.params.id);
  }

  componentDidMount() {
    console.log(this.GroupAPI.hasAccess());
  }

  render() {
    return (
      <div>
        test
      </div>
    );
  }
}

export default Group;
