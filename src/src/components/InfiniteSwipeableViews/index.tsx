import * as React from "react";
import SwipeableViews from 'react-swipeable-views';
import { virtualize, bindKeyboard } from 'react-swipeable-views-utils';
import AutoSizer from "react-virtualized-auto-sizer";
import { makeStyles, Theme, createStyles, WithStyles, withStyles } from "@material-ui/core";

const VirtualizeSwipeableViews = bindKeyboard(virtualize(SwipeableViews));

const styles = (theme: Theme) => createStyles({
  swipeableViews: {
    height: "100%",
    position: "relative",
    "& .react-swipeable-view-container": {
      height: "100%"
    }
  }
});

interface InfiniteSwipeableViewsProps extends WithStyles<typeof styles> {
  relativeIndex:number,
  onRelativeIndexChanged: (newVal:number) => void,
  slideRenderer(relativeToStart:number): React.ReactNode
}

const start = 10000;

class InfiniteSwipeableViews extends React.Component<InfiniteSwipeableViewsProps> {

  private prevTime = 0;

  constructor(props:InfiniteSwipeableViewsProps) {
    super(props);
  }

  slideRenderer = (params:any) => {
    return <div key={params.key} style={{position: "relative", height: "100%"}}>{this.props.slideRenderer(params.index - start)}</div>;
  }

  private setIndex = (newIndex:number) => {
    this.prevTime = new Date().getTime();
    this.props.onRelativeIndexChanged(newIndex - start);
  }

  private getIndex = () => {
    return this.props.relativeIndex + start;
  }

  private goForward = () => {
    this.setIndex(this.getIndex() + 1);
  }

  private goBack = () => {
    this.setIndex(this.getIndex() - 1);
  }

  onWheel = (event:any) => {
    const deltaX = event.deltaX;
    const deltaY = event.deltaY;
    setTimeout(() => {
      const newTime = new Date().getTime();
      if (newTime < this.prevTime + 200) {
        return;
      }
      if (deltaX !== 0) {
        if (deltaX > 0) {
          this.goForward();
        } else if (deltaX < 0) {
          this.goBack();
        }
      } else {
        if (deltaY > 0) {
          this.goForward();
        } else if (deltaY < 0) {
          this.goBack();
        }
      }
    }, 100);
    // console.log(event.target);
    
  }

  onScroll = (event:any) => {
    this.prevTime = new Date().getTime() + 1000;
    // setIndexAndPrevTime({
    //   index: indexAndPrevTime.index,
    //   prevTime: new Date().getTime()
    // });
  }

  render = () => {
    // Workaround for bug https://github.com/oliviertassinari/react-swipeable-views/issues/593
    var additionalProps:any = {
      overscanSlideBefore: 1
    };

    return (
      <VirtualizeSwipeableViews 
      index={this.getIndex()}
      onChangeIndex={(newIndex:any) => this.props.onRelativeIndexChanged(newIndex - start)}
      slideRenderer={this.slideRenderer}
      overscanSlideAfter={1}
      {...additionalProps}
      onWheel={this.onWheel}
      onScroll={this.onScroll}
      className={this.props.classes.swipeableViews}/>
    );
  }
}

export default withStyles(styles)(InfiniteSwipeableViews);