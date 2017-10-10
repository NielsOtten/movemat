import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import AuthStore from '../../../stores/AuthStore';

@observer
class AuthenticatedRoute extends React.Component {
  state = {
    loading: true,
    loggedIn: false,
  };

  async componentDidMount() {
    await AuthStore.isLoggedIn();
    this.setState({ loading: false });
  }

  render() {
    const { component: Component, ...rest } = this.props;
    if(this.state.loading) return <div>Figuring out if you are logged in. Please wait....</div>;
    return (<Route
      {...rest} render={props => (
        <div>
          {!AuthStore.loggedIn && <Redirect to={{ pathname: '/login' }} />}
          <Component {...this.props} />
        </div>
    )}
    />);
  }
}

export default withRouter(observer(AuthenticatedRoute));
