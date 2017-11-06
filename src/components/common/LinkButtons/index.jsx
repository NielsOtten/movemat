import React from 'react';
import { Button } from 'react-toolbox';
import { Link } from 'react-router-dom';

export default ({ href, ...appProps }) => (
  <Link to={href}>
    <Button {...appProps} />
  </Link>
);
