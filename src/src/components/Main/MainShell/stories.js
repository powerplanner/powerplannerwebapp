import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';

import MainShell from './index';

storiesOf("MainShell", module)
  .add("loading", () => <MainShell loading={true}/>)
  .add("loaded", () => <MainShell/>)
  .add("loadingError", () => <MainShell loadingErrorMessage={false}/>);