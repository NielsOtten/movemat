import React from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import { List, ListItem } from 'material-ui/List';

const GroupTableRow = ({ id, name, allowedEmails, users, ...otherProps }) => (
  <TableRow {...otherProps}>
    {otherProps.children[0]}
    <TableRowColumn>{id}</TableRowColumn>
    <TableRowColumn>{name}</TableRowColumn>
    <TableRowColumn>
      <List>
        {allowedEmails.map(email => <ListItem key={email} primaryText={email} disabled={true} />)}
      </List>
    </TableRowColumn>
    <TableRowColumn>
      <List>
        {users.map(user => <ListItem key={user.email} primaryText={user.email} disabled={true} />)}
      </List>
    </TableRowColumn>
  </TableRow>
);

GroupTableRow.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default GroupTableRow;
