import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Layout } from 'react-toolbox';

import Header from './Header';
import Login from '../../scenes/Login';
import PasswordRecovery from '../../scenes/PasswordRecovery';
import NotFound from '../../scenes/NotFound';
import SignUp from '../../scenes/SignUp';
import Group from '../../scenes/Group';
import Dashboard from '../../scenes/Dashboard';
import AdminStepsView from '../../scenes/Admin/Steps/view';
import AccessDenied from '../../scenes/AccessDenied';
import AuthenticatedRoute from '../Routes/AuthenticatedRoute';
import AdminRoute from '../Routes/AdminRoute';

import styles from './style.scss';

const constants = Object.freeze({
  LOGIN_ROUTE: '/login',
  HOME_ROUTE: '/',
  PASSWORD_RECOVERY_ROUTE: '/wachtwoord-vergeten',
  PASSWORD_RECOVERY_TOKEN_ROUTE: '/reset-wachtwoord/:token',
  SIGNUP_ROUTE: '/registreer',
  DASHBOARD_ROUTE: '/dashboard',
  GROUP_ROUTE: '/familie/:id',
  NO_ACCESS_ROUTE: '/geen-toegang',
  STEPS_VIEW_ROUTE: '/admin/steps',
});

const App = appProps => (
  <Router>
    <Layout>
      <Header />
      <main className={styles.main}>
        <Switch>
          <Redirect exact from={constants.HOME_ROUTE} to={constants.LOGIN_ROUTE} />
          <Route path={constants.LOGIN_ROUTE} component={Login} {...appProps} />
          <Route path={constants.PASSWORD_RECOVERY_ROUTE} component={PasswordRecovery} />
          <Route path={constants.PASSWORD_RECOVERY_TOKEN_ROUTE} component={Login} />
          <Route path={constants.SIGNUP_ROUTE} component={SignUp} {...appProps} />
          <AuthenticatedRoute path={constants.DASHBOARD_ROUTE} component={Dashboard} {...appProps} />
          <AuthenticatedRoute path={constants.GROUP_ROUTE} component={Group} {...appProps} />
          <AdminRoute path={constants.STEPS_VIEW_ROUTE} component={AdminStepsView} {...appProps} />
          <Route path={constants.NO_ACCESS_ROUTE} component={AccessDenied} {...appProps} />
          <Route component={NotFound} {...appProps} />
        </Switch>
      </main>
    </Layout>
  </Router>
);

export { App as default, constants };
