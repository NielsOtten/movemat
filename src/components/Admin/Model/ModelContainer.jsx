import React, { Component } from 'react';
import { observable } from 'mobx';
import fetch from 'fetch-everywhere';
import Popup from 'react-popup';
import { observer } from 'mobx-react';
import { Table, TableBody, TableHeader, TableRow, TableHeaderColumn, TableRowColumn } from 'material-ui/Table';
import TableBodyRow from './TableBodyRow';

@observer
class ModelContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.model = this.props.routeParams.id;
    this.getModels(this.model);
  }

  getModels(model) {
    fetch(`/api/admin/${model}`, {
      credentials: 'same-origin',
      method: 'GET',
    }).then(res => res.json())
      .then((json) => {
        console.log(json);
        this.models = json;
      });
  }

  static filterVars(vars) {
    return !['__v', 'downloaded', 'deleted'].includes(vars);
  }

  deleteHandler = (id) => {
    const that = this;
    Popup.create({
      title: null,
      content: `Weet je zeker dat je ${id} wilt verwijderen?` ,
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
            fetch(`/api/admin/${that.model}/${id}`, {
              credentials: 'same-origin',
              method: 'DELETE',
            }).then(res => res.json())
              .then((data) => {
                console.log('data', data);
                return data;
              })
              .catch((err) => { console.log(err); });
            that.getModels();
            Popup.close();
          },
        }],
      },
    });
  };

  @observable models = [];

  render() {
    const tableHeaderRows = this.models.length > 0 ? Object.keys(this.models[0]).filter(field => ModelContainer.filterVars(field)).map(field => <TableHeaderColumn key={field}>{field}</TableHeaderColumn>) : '';
    const tableRows = this.models.length > 0 ? this.models.map(model => <TableBodyRow key={model._id} model={model} deleteHandler={() => this.deleteHandler(model._id)} editLink={`/admin/${this.model}/edit/${model._id}`} />) : <TableRow />;
    return (
      <section>
        <Table
          multiSelectable
        >
          <TableHeader>
            <TableRow>
              {tableHeaderRows}
              <TableHeaderColumn>Actions</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableRows}
          </TableBody>
        </Table>
      </section>
    );
  }
}

export default ModelContainer;
