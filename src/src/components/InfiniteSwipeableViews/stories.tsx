import * as React from 'react';

import { storiesOf } from '@storybook/react';

import InfiniteSwipeableViews from ".";

const start = 8;

const colors = ["blue", "red", "green", "brown"];

const slideRenderer = (relativeToStart:number) => {
  return (
    <div style={{backgroundColor: colors[Math.abs(relativeToStart) % colors.length], padding: "12px"}}>
      <p style={{color: "white"}}>{relativeToStart}</p>
    </div>
  )
}

storiesOf("InfiniteSwipeableViews", module)
  .add("numbers", () => <InfiniteSwipeableViews relativeIndex={0} onRelativeIndexChanged={() => {}} slideRenderer={slideRenderer}/>);