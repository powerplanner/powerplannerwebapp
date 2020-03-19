import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog, { InjectedProps, WithMobileDialogOptions, WithMobileDialog } from '@material-ui/core/withMobileDialog';
import { WithStyles, createStyles, Theme, withStyles, CssBaseline } from '@material-ui/core';
import { WithWidth } from '@material-ui/core/withWidth';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { makeStyles } from '@material-ui/core';

// Unfortunately the dragging doesn't behave well with inputs inside it
// function PaperComponent(props: any) {
//   return (
//     <Draggable>
//       <Paper {...props}/>
//     </Draggable>
//   )
// }


const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  appBar: {
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    overflowY: 'auto'
  },
  actions: {
    padding: theme.spacing(3)
  },
  toolbar: theme.mixins.toolbar,
  grow: {
    flexGrow: 1,
  },
});

export interface PopupDialogProps extends WithMobileDialog, WithStyles<typeof styles> {
  title: string;
  actions?: React.ReactNode;
  open: boolean;
  onClose?: Function;
  disabled?: boolean;
  additionalIcons?: React.ReactNode;
}

class PopupDialog extends React.Component<PopupDialogProps, {}> {
  // state = {
  //   open: this.props.open,
  // };

  handleClose = () => {
    if (this.props.disabled) {
      return;
    }
    if (this.props.onClose) {
      this.props.onClose(this);
    }
  };

  // open() {
  //   this.setState({ open: true });
  // }

  // close() {
  //   this.setState({ open: false });
  // }

  render() {
    const { classes, title, fullScreen, open, children } = this.props;

    return (
      <Dialog
        fullScreen={fullScreen}
        fullWidth={true}
        maxWidth='sm'
        open={open}
        onClose={this.handleClose}
        transitionDuration={0}
        // PaperComponent={PaperComponent}
        aria-labelledby="dialog-title"
      >
      <div className={classes.root}>
        <AppBar position="relative" className={classes.appBar}>
          <Toolbar>
            <Typography id="dialog-title" variant="h6" color="inherit" noWrap>
              {title}
            </Typography>
            <div className={classes.grow} />
            {this.props.additionalIcons && this.props.additionalIcons}
            <IconButton color="inherit" onClick={this.handleClose} disabled={this.props.disabled}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className={classes.content}>
          {children}
        </div>
        {this.props.actions != null &&
          <div className={classes.actions}>
            {this.props.actions}
          </div>
        }
        </div>
      </Dialog>
    );
  }
}

var popupWithMobile = withMobileDialog<PopupDialogProps>()(PopupDialog);
export default withStyles(styles)(popupWithMobile);