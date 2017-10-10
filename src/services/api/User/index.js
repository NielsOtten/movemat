import fetch from 'fetch-everywhere';

function Login(username = '', password = '') {
  return fetch('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
}

export { Login };
