/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import fetch from 'fetch-everywhere';
import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table';
import Button from '../../../../components/common/LinkButtons';

class StepsView extends Component {
  state = {
    users: [],
  };

  componentDidMount() {
    this.getUsers();
  }

  async getUsers() {
    try {
      const repsonse = await fetch('/api/admin/user', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
        credentials: 'include',
      });
      const users = await repsonse.json();
      if(users instanceof Array) {
        this.setState({ users });
      }
    } catch(exception) {
      console.log(exception);
    }
  }

  render() {
    const users = this.state.users.map(user => (
      <TableRow key={user._id}>
        <TableCell>{user._id}</TableCell>
        <TableCell>{user.username}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.role}</TableCell>
        <TableCell>
          <Button href={`/admin/users/${user._id}/edit`} label='Edit' raised primary />
          <Button href='/' label='Verwijder' raised primary />
        </TableCell>
      </TableRow>));

    return (
      <Table>
        <TableHead>
          <TableCell>Id</TableCell>
          <TableCell>Gebruikersnaam</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Rol</TableCell>
          <TableCell>Acties</TableCell>
        </TableHead>
        {users}
      </Table>
    );
  }
}

export default StepsView;
