import { observable, computed } from 'mobx';
import fetch from 'fetch-everywhere';

class UserStore {
  @observable user = false;
  @computed get isLoggedIn() {
    return this.user;
  }

  login() {
    return fetch('/api/user/isLoggedIn', {
      credentials: 'same-origin',
      method: 'GET',
    })
    .then((response) => {
      if(response.status === 401) return this.user = false;
      return this.user = true;
    })
    .catch(() => this.user = false);
  }
}

const store = new UserStore();

export default store;
