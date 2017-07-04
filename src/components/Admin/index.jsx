import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from './Header';

function Admin() {
  return (
    <MuiThemeProvider>
      <Header />
    </MuiThemeProvider>
  );
}

export default Admin;
