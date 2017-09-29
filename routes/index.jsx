
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import App from '../components/App/index';
import Admin from '../components/Admin/index';

// Webpack 2 supports ES2015 `import()` by auto-
// chunking assets. Check out the following for more:
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

// We use `getComponent` to dynamically load routes.
// https://github.com/reactjs/react-router/blob/master/docs/guides/DynamicRouting.md
const routes = (
  <Switch>
    <Route exact path='/' component={App} />
  </Switch>
    // <Route path='/' component={App} />
    //   <Route exact path='/' getComponent={importHome} />
    //   <Route path='login' getComponent={importLogin} />
    //   <Route path='signup' getComponent={importSignUp} />
    //   <Route path='dashboard' getComponent={importDashboard} />
    //   <Route path='familie/:id' getComponent={importGroup} />
    // <Route path='/admin' component={Admin} />
);

// Unfortunately, HMR breaks when we dynamically resolve
// routes so we need to require them here as a workaround.
// https://github.com/gaearon/react-hot-loader/issues/288
if(module.hot) {
  require('../components/Home/index');    // eslint-disable-line global-require
  require('../components/Login/index');   // eslint-disable-line global-require
  require('../components/Signup/index');   // eslint-disable-line global-require
  require('../components/Group/index');   // eslint-disable-line global-require
  require('../components/Dashboard/index');   // eslint-disable-line global-require
}

export default routes;
