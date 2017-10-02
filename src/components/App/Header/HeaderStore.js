import { observable } from 'mobx';

class HeaderStore {
  @observable drawerActive = false;
  @observable drawerPinned = false;
  @observable sidebarPinned = false;

  toggleDrawerActive() {
    this.drawerActive = !this.drawerActive;
  }

  toggleDrawerPinned() {
    this.drawerPinned = !this.drawerPinned;
  }

  toggleSidebar() {
    this.sidebarPinned = !this.sidebarPinned;
  }
}

const singleton = new HeaderStore();
export default singleton;
