
import React from 'react';

function Login() {
  return (
    <form method="POST" action="/login">
      <input type="text" name="username"/>
      <input type="password" name="password"/>
      <input type="submit"/>
    </form>
  );
}

export default Login;
