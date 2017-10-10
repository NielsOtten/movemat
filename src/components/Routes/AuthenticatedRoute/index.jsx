import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { isLoggedIn } from '../../../services/api/User';

class AuthenticatedRoute extends React.Component {
  state = {
    loading: true,
    loggedIn: false,
  };

  async componentDidMount() {
    const loggedIn = await isLoggedIn();
    this.setState({ loggedIn, loading: false });
  }

  render() {
    const { component: Component, ...rest } = this.props;
    if(this.state.loading) return <div>Figuring out if you are logged in. Please wait....</div>;
    return (<Route
      {...rest} render={props => (
        <div>
          {!this.state.loggedIn && <Redirect to={{ pathname: '/login' }} />}
          <Component {...this.props} />
        </div>
    )}
    />);
  }
}

export default withRouter(AuthenticatedRoute);
