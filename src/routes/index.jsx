
import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';
import App from '../components/App';
import Admin from '../components/Admin';

// Webpack 2 supports ES2015 `import()` by auto-
// chunking assets. Check out the following for more:
// https://webpack.js.org/guides/migrating/#code-splitting-with-es2015
const importHome = (nextState, cb) => {
  import('../components/Home')
    .then(module => cb(null, module.default))
    .catch((e) => { throw e; });
};

const importLogin = (nextState, cb) => {
  import('../components/Login')
    .then(module => cb(null, module.default))
    .catch((e) => { throw e; });
};

const importSignUp = (nextState, cb) => {
  import('../components/Signup')
    .then(module => cb(null, module.default))
    .catch((e) => { throw e; });
};

const importGroup = (nextState, cb) => {
  import('../components/Group')
    .then(module => cb(null, module.default))
    .catch((e) => { throw e; });
};

const importDashboard = (nextState, cb) => {
  import('../components/Dashboard')
    .then(module => cb(null, module.default))
    .catch((e) => { throw e; });
};

const importAdminGroup = (nextState, cb) => {
  import('../components/Admin/Group')
    .then(module => cb(null, module.default))
    .catch((e) => { throw e; });
};

const importAdminModelContainer = (nextState, cb) => {
  import('../components/Admin/Model/ModelContainer')
    .then(module => cb(null, module.default))
    .catch((e) => { throw e; });
};

const importAdminGroupEdit = (nextState, cb) => {
  import('../components/Admin/Model/GroupEdit')
    .then(module => cb(null, module.default))
    .catch((e) => { throw e; });
};

const importAdminGroupnew = (nextState, cb) => {
  import('../components/Admin/Model/GroupNew')
    .then(module => cb(null, module.default))
    .catch((e) => { throw e; });
};

const importAdminUserEdit = (nextState, cb) => {
  import('../components/Admin/Model/UserEdit')
    .then(module => cb(null, module.default))
    .catch((e) => { throw e; });
};

const importAdminUsernew = (nextState, cb) => {
  import('../components/Admin/Model/UserNew')
    .then(module => cb(null, module.default))
    .catch((e) => { throw e; });
};

// We use `getComponent` to dynamically load routes.
// https://github.com/reactjs/react-router/blob/master/docs/guides/DynamicRouting.md
const routes = (
  <Route>
    <Route path='/' component={App}>
      <IndexRoute getComponent={importHome} />
      <Route path='login' getComponent={importLogin} />
      <Route path='signup' getComponent={importSignUp} />
      <Route path='dashboard' getComponent={importDashboard} />
      <Route path='familie/:id' getComponent={importGroup} />
    </Route>
    <Route path='/admin' component={Admin}>
      <IndexRoute getComponent={importAdminGroup} />
      <Route path=':id' getComponent={importAdminModelContainer} />
      <Route path='user/edit/:id' getComponent={importAdminUserEdit} />
      <Route path='user/add' getComponent={importAdminUsernew} />
      <Route path='group/edit/:id' getComponent={importAdminGroupEdit} />
      <Route path='group/add' getComponent={importAdminGroupnew} />
    </Route>
  </Route>
);

// Unfortunately, HMR breaks when we dynamically resolve
// routes so we need to require them here as a workaround.
// https://github.com/gaearon/react-hot-loader/issues/288
if(module.hot) {
  require('../components/Home');    // eslint-disable-line global-require
  require('../components/Login');   // eslint-disable-line global-require
  require('../components/Signup');   // eslint-disable-line global-require
  require('../components/Group');   // eslint-disable-line global-require
  require('../components/Dashboard');   // eslint-disable-line global-require
  require('../components/Admin/Group');   // eslint-disable-line global-require
  require('../components/Admin/User');   // eslint-disable-line global-require
}

export default routes;
