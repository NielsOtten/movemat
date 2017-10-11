import { observable } from 'mobx';
import fetch from 'fetch-everywhere';

class AuthStore {
  @observable loggedIn = false;

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
