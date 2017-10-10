import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Layout } from 'react-toolbox';

import Header from './Header';
import Login from '../../scenes/Login';
import NotFound from '../../scenes/NotFound';
import SignUp from '../../scenes/SignUp';
import Group from '../../scenes/Group';
import Dashboard from '../../scenes/Dashboard';
import AccessDenied from '../../scenes/AccessDenied';
import AuthenticatedRoute from '../Routes/AuthenticatedRoute';

import styles from './style.scss';

const App = appProps => (
  <Router>
    <Layout>
      <Header />
      <main className={styles.main}>
        <Switch>
          <Redirect exact from='/' to='/login' />
          <Route path='/login' component={Login} {...appProps} />
          <Route path='/herstel-wachtwoord' component={Login} />
          <Route path='/reset-wachtwoord/:token' component={Login} />
          <Route path='/registreer' component={SignUp} {...appProps} />
          <AuthenticatedRoute path='/dashboard' component={Dashboard} {...appProps} />
          <AuthenticatedRoute path='/familie/:_id' component={Group} {...appProps} />
          <Route path='/geen-toegang' component={AccessDenied} {...appProps} />
          <Route component={NotFound} {...appProps} />
        </Switch>
      </main>
    </Layout>
  </Router>
);

export default App;
