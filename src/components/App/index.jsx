import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import Login from '../../scenes/Login';
import NotFound from '../../scenes/NotFound';
import SignUp from '../../scenes/SignUp';
import Group from '../../scenes/Group';
import Dashboard from '../../scenes/Dashboard';
import AccessDenied from '../../scenes/AccessDenied';
import AuthenticatedRoute from '../Routes/AuthenticatedRoute';

const App = appProps => (
  <Router>
    <Switch>
      <Redirect exact from='/' to='/login' />
      <Route path='/login' component={Login} {...appProps} />
      <Route path='/herstel-wachtwoord' component={Login} />
      <Route path='/reset-wachtwoord/:token' component={Login} />
      <Route path='/registreer' component={SignUp} {...appProps} />
      <Route path='/dashboard' component={Dashboard} {...appProps} />
      <AuthenticatedRoute path='/familie/:_id' component={Group} {...appProps} />
      <Route path='/geen-toegang' component={AccessDenied} {...appProps} />
      <Route component={NotFound} {...appProps} />
    </Switch>
  </Router>
);

export default App;
