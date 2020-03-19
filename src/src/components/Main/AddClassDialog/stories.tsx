import * as React from 'react';

import { storiesOf } from '@storybook/react';

import AddClassDialogShell from './AddClassDialogShell';
import { ViewItemClass } from 'models/viewItems';
import { Guid } from 'guid-typescript';

const c = new ViewItemClass({
  identifier: Guid.create(),
  name: 'Math',
  color: '#A200FF',
  semesterId: Guid.create()
});

storiesOf("AddClass", module)
  .add("new class", () => <AddClassDialogShell open={true}/>)
  .add("edit class", () => <AddClassDialogShell open={true} itemToEdit={c}/>)
  // .add("custom", () => <ColorPicker selectedColor="#b58500"/>);