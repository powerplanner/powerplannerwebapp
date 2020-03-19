import React from 'react';

import { storiesOf } from '@storybook/react';

import MainShellNavDrawer, { MainShellNavDrawerItem } from './index';
import NavDrawerStatics from 'components/navDrawerStatics';
import { BrowserRouter } from 'react-router-dom';
import { ViewItemClass } from 'models/viewItems';
import { Guid } from 'guid-typescript';

class Container extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div style={{ backgroundColor: '#2E366D', position: 'absolute', top: 0, bottom: 0, left: 0, width: NavDrawerStatics.drawerWidth }}>
          {this.props.children}
        </div>
      </BrowserRouter>
    )
  }
}

const classes = [new ViewItemClass({
  identifier: Guid.create(),
  name: "Math",
  color: "blue",
  semesterId: Guid.create()
}), new ViewItemClass({
  identifier: Guid.create(),
  name: "Spanish",
  color: "red",
  semesterId: Guid.create()
}), new ViewItemClass({
  identifier: Guid.create(),
  name: "Super long name that should clip",
  color: "green",
  semesterId: Guid.create()
})];

storiesOf("MainShellNavDrawer", module)
  .add("default", () => <Container><MainShellNavDrawer selectedItem={MainShellNavDrawerItem.Years} /></Container>)
  .add("semester but no classes", () => <Container><MainShellNavDrawer hasSemester={true} selectedItem={MainShellNavDrawerItem.Classes}/></Container>)
  .add("classes", () => <Container><MainShellNavDrawer hasSemester={true} selectedItem={MainShellNavDrawerItem.Classes} semesterClasses={classes} /></Container>);