
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Popup from 'react-popup';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MenuComponent from './Menu/index';
import styles from './styles.scss';
import PassportErrorsStore from '../../client/stores/PassportErrorsStore';

class App extends Component {
  static getErrors(errors) {
    PassportErrorsStore.errors = errors.map(error => ({ key: Object.keys(error)[0], message: Object.values(error)[0].message }));
  }

  componentDidMount() {
    App.getErrors(__passportErrors);
  }

  renderChildren() {
    return React.Children.map(this.props.children, child => React.cloneElement(child, {
      passportErrorsStore: PassportErrorsStore,
    }));
  }

  render() {
    return (
      <div>
        <MenuComponent />
        <MuiThemeProvider>
          <div className={styles.content}>
            <Popup />
            {this.renderChildren()}
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
