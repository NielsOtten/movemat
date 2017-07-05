import React from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from './Header';
import styles from './styles.scss';

function Admin({ children }) {
  return (
    <MuiThemeProvider>
      <div>
        <Header />
        <div className={styles.content}>
          { children }
        </div>
      </div>
    </MuiThemeProvider>
  );
}

Admin.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Admin;
