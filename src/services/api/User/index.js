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

/**
 * Checks with a fetch if the user is logged in.
 */
async function isLoggedIn() {
  try {
    const response = await fetch('/api/user/isLoggedIn', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include',
    });
    const json = await response.json();
    if(json instanceof Object === false) return false;
    return json.loggedIn;
  } catch(exception) {
    return false;
  }
}

export { Login, isLoggedIn };
