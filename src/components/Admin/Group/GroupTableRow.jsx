import React from 'react';
import Popup from 'react-popup';
import PropTypes from 'prop-types';
import fetch from 'fetch-everywhere';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import { List, ListItem } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import styles from './styles.scss';

const deleteGroup = (id, name) => {
};

const GroupTableRow = ({ id, name, allowedEmails, users, ...otherProps }) => (
  <TableRow
    {...otherProps}
  >
    {otherProps.children[0]}
    <TableRowColumn>{id}</TableRowColumn>
    <TableRowColumn>{name}</TableRowColumn>
    <TableRowColumn>
      <List>
        {allowedEmails.map(email => <ListItem key={email} className={styles.listItem} primaryText={email} disabled />)}
      </List>
    </TableRowColumn>
    <TableRowColumn>
      <List>
        {users.map(user => <ListItem key={user.email} className={styles.listItem} primaryText={user.email} disabled />)}
      </List>
    </TableRowColumn>
    <TableRowColumn>
      <RaisedButton label='Delete' onClick={() => { deleteGroup(id, name); }} className={styles.raisedButton} />
    </TableRowColumn>
  </TableRow>
);

GroupTableRow.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default GroupTableRow;
