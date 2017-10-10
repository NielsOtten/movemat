import fetch from 'fetch-everywhere';

/**
 * Login the user with the given details. Returns j
 * @param {string} username - Username or email.
 * @param {string} password - Password of the user.
 * @return {Promise} Promise object with the response of the login fetch.
 * @constructor
 */
function Login(username = '', password = '') {
  return fetch('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });
}

export { Login };
