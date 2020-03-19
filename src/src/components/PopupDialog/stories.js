import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import Typography from '@material-ui/core/Typography';

import PopupDialog from './index';

storiesOf("PopupDialog", module)
  .add("simple popup", () => <PopupDialog title="My sample dialog" open={true}>This is a super basic dialog</PopupDialog>);