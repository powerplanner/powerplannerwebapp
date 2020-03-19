import * as React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";

const DeleteItemDialog = (props:{
  title: string,
  body: string,
  open: boolean,
  onClose?: () => void,
  onDelete?: () => Promise<boolean>
}) => {

  const [disabled, setDisabled] = React.useState(false);

  const handleClose = () => {
    if (disabled) {
      return;
    }
    if (props.onClose) {
      props.onClose();
    }
  }

  const handleDelete = async () => {
    if (props.onDelete) {
      setDisabled(true);
      try {
        if (await props.onDelete()) {
          if (props.onClose) {
            props.onClose();
          }
        }
      } catch {
        alert("Unknown error");
      }
      setDisabled(false);
    }
  }

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText color="inherit">
          {props.body}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="default" onClick={handleClose} disabled={disabled}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleDelete} disabled={disabled}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteItemDialog;