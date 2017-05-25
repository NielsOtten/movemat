import { observable, computed } from 'mobx';

class PassportErrorsStore {
  @observable errors = [];

  @computed get getErrors() {
    return this.errors;
  }
}

const store = new PassportErrorsStore();

export default store;
