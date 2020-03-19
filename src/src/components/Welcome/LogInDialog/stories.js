import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import LogInDialog from './index';

storiesOf("LogInDialog", module)
  .add("view dialog", () => <LogInDialog open={true} />);