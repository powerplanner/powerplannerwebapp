import * as React from "react";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MoreIcon from '@material-ui/icons/MoreVert';

const MoreButton = (props:{
  menuItems: {
    name: string,
    onClick?: () => void
  }[]
}) => {

  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);

  const handleClick = (event:any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton aria-label="display more actions" edge="end" color="inherit" onClick={handleClick}>
        <MoreIcon />
      </IconButton>
      <Menu
        id="moreMenu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        {props.menuItems.map(i => (
          <MenuItem key={i.name} onClick={() => {
            if (i.onClick) {
              i.onClick();
            }
            handleClose();
          }}>{i.name}</MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default MoreButton;