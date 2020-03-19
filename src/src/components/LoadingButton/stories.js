import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import Typography from '@material-ui/core/Typography';

import LoadingButton from './index';

storiesOf("LoadingButton", module)
  .add("initial state", () => <LoadingButton>Initial state</LoadingButton>)
  .add("loading state", () => <LoadingButton loading={true}>Loading state</LoadingButton>)
  .add("success state", () => <LoadingButton loading={false} success={true}>Success state</LoadingButton>);