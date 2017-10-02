import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from '../components/App';

require('normalize.css/normalize.css');

// We need a Root component for React Hot Loading.
function Root() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default Root;
