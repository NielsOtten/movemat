/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import fetch from 'fetch-everywhere';
import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table';
import Button from '../../../../components/common/LinkButtons';

class StepsView extends Component {
  state = {
    groups: [],
  };

  componentDidMount() {
    this.getGroups();
  }

  async getGroups() {
    try {
      const repsonse = await fetch('/api/admin/group', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
        credentials: 'include',
      });
      const groups = await repsonse.json();
      if(groups instanceof Array) {
        this.setState({ groups });
      }
    } catch(exception) {
      console.log(exception);
    }
  }

  render() {
    const groups = this.state.groups.map((group) => (
      <TableRow key={group._id}>
        <TableCell>{group._id}</TableCell>
        <TableCell>{group.name}</TableCell>
        <TableCell>{group.token}</TableCell>
        <TableCell>
          <Button href={`/admin/steps/${group._id}/edit`} label='Edit' raised primary />
          <Button href='/' label='Verwijder' raised primary />
        </TableCell>
      </TableRow>));

    return (
      <Table>
        <TableHead>
          <TableCell>Id</TableCell>
          <TableCell>Naam</TableCell>
          <TableCell>Token</TableCell>
          <TableCell>Acties</TableCell>
        </TableHead>
        {groups}
      </Table>
    );
  }
}

export default StepsView;
