import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './styles.scss';
import GroupApi from '../../api/Group';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.GroupAPI = new GroupApi(props.params.id);
    this.state = {
      groups: [],
    };
  }

  componentDidMount() {
    this.GroupAPI.getGroups()
      .then(groups => {
        this.setState({ groups });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const groups = this.state.groups.map(group => <li key={group._id}><Link to={`/familie/${group._id}`}>{group.name}</Link></li>);

    return (
      <ul className={styles.dashboard}>
        {groups}
      </ul>
    );
  }
}

export default Dashboard;
