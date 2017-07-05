/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from 'material-ui/Table';
import GroupTableRow from './GroupTableRow';
import styles from './styles.scss';

@observer
class AdminGroup extends Component {
  componentDidMount() {
    fetch('/api/group', {
      credentials: 'same-origin',
      method: 'GET',
    })
    .then(res => res.json())
    .then((groups) => {
      this.groups = groups;
    })
    .catch((err) => {
      console.log(err);
    });
  }

  @observable groups = [];

  render() {
    const groups = this.groups.map(group => <GroupTableRow
      key={group._id}
      id={group._id}
      name={group.name}
      allowedEmails={group.allowedEmails}
      users={group.users}
    />);

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn>ID</TableHeaderColumn>
            <TableHeaderColumn>Naam</TableHeaderColumn>
            <TableHeaderColumn>Allowed Emails</TableHeaderColumn>
            <TableHeaderColumn>Registered Users</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups}
        </TableBody>
      </Table>
    );
  }
}

export default AdminGroup;
