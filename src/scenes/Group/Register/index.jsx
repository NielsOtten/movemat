import React, { Component } from 'react';
import { Tab, Tabs } from 'react-toolbox';
import Box from '../../../components/common/Box/index';
import Login from './Login';
import SignUp from './SignUp';

class Register extends Component {
  state = {
    index: 0,
  };

  handleTabChange = (index) => {
    this.setState({ index });
  };

  render() {
    return (
      <Box>
        <Tabs index={this.state.index} onChange={this.handleTabChange} fixed>
          <Tab label='Bestaand account'>
            <Login {...this.props} />
          </Tab>
          <Tab label='Nieuw account'>
            <SignUp {...this.props} />
          </Tab>
        </Tabs>
      </Box>
    );
  }
}

export default Register;
