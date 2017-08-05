import React from 'react';
import Popup from 'react-popup';
import PropTypes from 'prop-types';
import fetch from 'fetch-everywhere';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import { List, ListItem } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import styles from './styles.scss';

const deleteGroup = (id, name) => {
  Popup.create({
    title: null,
    content: `Weet je zeker dat je ${name} (${id}) wilt verwijderen?` ,
    buttons: {
      left: [{
        text: 'Nee',
        className: 'danger',
        action() {
          Popup.close();
        },
      }],
      right: [{
        text: 'Ja',
        className: 'success',
        action() {
          fetch(`/api/group/${id}`, {
            credentials: 'same-origin',
            method: 'DELETE',
          }).then(res => res.json())
            .then((data) => {
              console.log('data', data);
              return data;
            })
            .catch((err) => { console.log(err); });
          Popup.close();
        },
      }],
    },
  });
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
