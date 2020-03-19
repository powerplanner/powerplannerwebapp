import * as React from "react";
import { Link, LinkProps } from "react-router-dom";

const StylelessLink = (props:LinkProps) => {
  return <Link style={{
    textDecoration: "inherit",
    color: "inherit",
    ...props.style
  }} {...props}/>
}

export default StylelessLink;