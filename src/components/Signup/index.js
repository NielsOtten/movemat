
import React from 'react';

function Signup() {
  return (
    <form method="POST" action="/signup">
      <input type="text" name="email"/>
      <input type="text" name="username"/>
      <input type="password" name="password"/>
      <input type="submit"/>
    </form>
  );
}

export default Signup;
