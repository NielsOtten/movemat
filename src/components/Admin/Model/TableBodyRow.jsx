import React from 'react';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import { List, ListItem } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import ModelContainer from './ModelContainer';

const TableBodyRow = ({ model, deleteHandler, editLink, ...otherProps }) => {
  const values = Object.keys(model).filter(field => ModelContainer.filterVars(field)).map((key) => {
    const value = model[key] instanceof Array && model[key].length > 0 ?
      (<List>
        {model[key].map(val =>
          <ListItem key={val._id || val} primaryText={val.email || val} />,
        )}
      </List>) : model[key] instanceof Boolean ? 'true' : model[key];
    return (<TableRowColumn key={key}>
      {value}
    </TableRowColumn>);
  });

  return (
    <TableRow {...otherProps}>
      {otherProps.children[0]}
      {values}
      <TableRowColumn>
        <RaisedButton label='Delete' onClick={deleteHandler} style={{ display: 'block' }} />
        <RaisedButton label='Edit' href={editLink} style={{ display: 'block', marginTop: '4px' }} />
      </TableRowColumn>
    </TableRow>
  );
};

export default TableBodyRow;
