import { observable } from 'mobx';
import fetch from 'fetch-everywhere';

class AuthStore {
  @observable loggedIn = false;
  @observable role = '';

  async isLoggedIn() {
    try {
      const response = await fetch('/api/user/isLoggedIn', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        credentials: 'include',
      });
      const json = await response.json();
      if(json instanceof Object === false) return this.loggedIn = false;
      return this.loggedIn = json.loggedIn;
    } catch(exception) {
      return this.loggedIn = false;
    }
  }

  async getRole() {
    try {
      const response = await fetch('/api/user', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        credentials: 'include',
      });
      const json = await response.json();
      if(json instanceof Object === false || json.user === 'undefined') return this.role = '';
      return this.role = json.user.role;
    } catch(exception) {
      return this.role = '';
    }
  }

  async logOut() {
    const response = await fetch('/api/user/logout', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include',
    });
    const json = await response.json();
    if(json instanceof Object === false) return this.loggedIn = false;
    return this.loggedIn = false;
  }
}

const store = new AuthStore();
export default store;
