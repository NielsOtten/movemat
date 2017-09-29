import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const AuthenticatedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest} render={props => (
    false === true ? (
      <Component {...props} />
    ) : (
      <Redirect
        to={{
          pathname: '/geen-toegang',
          state: { from: props.location },
        }}
      />
    )
  )}
  />
);

export default AuthenticatedRoute;
