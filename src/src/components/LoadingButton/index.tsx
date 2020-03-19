import * as React from 'react';
import { withStyles, Theme, WithStyles, createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonNormal: {
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  }
});

export interface LoadingButtonProps extends WithStyles<typeof styles> {
  loading?: boolean,
  success?: boolean,
  onClick?: Function
}

// The {} represents the state
class LoadingButton extends React.Component<LoadingButtonProps, {}> {

  constructor(props: Readonly<LoadingButtonProps>) {
    super(props);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleButtonClick() {
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  render() {
    const { classes, loading, success, children } = this.props;

    return (
      <div className={classes.wrapper}>
        <Button
          variant="contained"
          color="primary"
          className={success ? classes.buttonSuccess : classes.buttonNormal}
          disabled={loading}
          onClick={this.handleButtonClick}
          fullWidth={true}
        >
          {children}
        </Button>
        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </div>
    );
  }
}
  
export default withStyles(styles)(LoadingButton);
  