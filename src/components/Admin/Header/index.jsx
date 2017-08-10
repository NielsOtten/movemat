import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router';
import { observable } from 'mobx';
import Appbar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

@observer
class Header extends Component {
  @observable drawerOpen = false;

  drawerToggle = () => {
    this.drawerOpen = !this.drawerOpen;
  };

  drawerClose = () => {
    this.drawerOpen = false;
  }

  render() {
    return (
      <div>
        <Appbar
          title='Admin Steps'
          iconClassNameRight='muidocs-icon-navigation-expand-more'
          onLeftIconButtonTouchTap={this.drawerToggle}
        />
        <Drawer
          open={this.drawerOpen}
          docked={false}
          onRequestChange={open => this.drawerOpen = open}
        >
          <MenuItem onTouchTap={this.drawerClose}><Link to='/admin/user'>Gebruikers</Link></MenuItem>
          <MenuItem onTouchTap={this.drawerClose}><Link to='/admin/group'>Families</Link></MenuItem>
        </Drawer>
      </div>
    );
  }
}

export default Header;
