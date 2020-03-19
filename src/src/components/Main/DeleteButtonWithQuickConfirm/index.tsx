import * as React from "react";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';

const DeleteButtonWithQuickConfirm = (props:{
  disabled?: boolean,
  onDelete?: () => void
}) => {

  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);

  const onClick = (event:any) => {
    setAnchorEl(event.currentTarget);
  }

  const handleConfirmedDelete = () => {
    setAnchorEl(null);
    if (props.onDelete) {
      props.onDelete();
    }
  }

  return (
    <div>
      <IconButton color="inherit" disabled={props.disabled} onClick={onClick}>
        <DeleteIcon />
      </IconButton>
      <Menu
        id="quickConfirmDelete"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={handleConfirmedDelete}>Yes, delete</MenuItem>
      </Menu>
    </div>
  )
}

export default DeleteButtonWithQuickConfirm;