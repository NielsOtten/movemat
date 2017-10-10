import fetch from 'fetch-everywhere';

function Login(username = '', password = '') {
  console.log('login');

  return fetch('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
}

export { Login };
