import * as React from 'react';

import { storiesOf } from '@storybook/react';

import ColorPicker from ".";

storiesOf("ColorPicker", module)
  .add("unselected", () => <ColorPicker/>)
  .add("purple", () => <ColorPicker selectedColor="#A200FF"/>)
  .add("custom", () => <ColorPicker selectedColor="#b58500"/>);