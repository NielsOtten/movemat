import React, { Component } from 'react';
import Input from 'react-toolbox/lib/input';
import { Button } from 'react-toolbox';
import { recoverPassword } from '../../services/api/User';
import Box from '../../components/common/Box';

class PasswordRecovery extends Component {
  state = {
    name: '',
    nameError: '',
  };

  constructor(props) {
    super(props);

    // Bind handle submit because of error in _asyncToGenerator.
    // See issue: https://github.com/babel/babel/issues/4550
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(e, clicked = false) {
    if(clicked || e.key === 'Enter') {
      try {
        const response = await recoverPassword(this.state.name);
        const json = await response.json();

        if(json instanceof Object) {
          if(json.success) {
            this.setState({ redirect: true });
          } else {
            this.setState({ nameError: json.messages.name});
          }
        }
      } catch(exception) {
        console.log(exception);
        // Time out, 500, weird errors are handled here.
        // TODO: Call global function to handle these errors.
      }
    }
  }

  render() {
    return (
      <Box >
        <h2>Wachtwoord vergeten</h2>
        <p>Bent u uw wachtwoord vergeten? Vul dan hieronder uw gebruikersnaam of Email in. Dan krijgt u van ons een mail met daarin een link om uw wachtwoord te herstellen.</p>
        <Input
          type='text'
          label='Gebruikersnaam/E-mailadres'
          name='name'
          value={this.state.name}
          onKeyPress={this.handleSubmit}
          onChange={name => this.setState({ name })}
          error={this.state.nameError}
        />
        <Button label='herstel' raised primary onClick={e => this.handleSubmit(e, true)} />
      </Box>
    );
  }
}

export default PasswordRecovery;
