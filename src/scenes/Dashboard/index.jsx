/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import { List, ListSubHeader, ListItem } from 'react-toolbox/lib/list';
import { getGroups } from '../../services/api/Group';

class Dashboard extends Component {
  state = {
    groups: [],
  };

  async componentDidMount() {
    // Get groups
    try {
      const response = await getGroups();
      const { groups } = await response.json();
      this.setState({ groups });
    } catch(exception) {
      console.log(exception);
    }
  }

  render() {
    const groups = this.state.groups.map(group => (
      <ListItem
        key={group._id}
        caption={group.name}
        to={`/familie/${group._id}`}
      />
    ));

    return (
      <div>
        <List selectable ripple>
          <ListSubHeader caption='Uw families:' />
          {groups}
        </List>
      </div>
    );
  }
}

export default Dashboard;
