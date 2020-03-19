import * as React from 'react'
import { ListItem } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { ListItemProps } from '@material-ui/core/ListItem';
import { LocationDescriptorObject, LocationDescriptor, Location } from 'history';

// From https://github.com/mui-org/material-ui/issues/9106#issuecomment-409882433

interface Props extends ListItemProps {
    // ListItemProps and LinkProps both define an 'innerRef' property
    // which are incompatible. Therefore the props `to` and `replace` are
    // simply duplicated here.
    to: string;
    replace?: boolean;
}

// function createLink({innerRef, ...props}: Props) {
//     // Remove `innerRef` from properties as the interface
//     // is incompatible. The property `innerRef` should not be
//     // needed as the `ListItem` component already provides that
//     // feature with a different interface.
//     return <Link {...props}/>
// }

export default class LinkListItem extends React.PureComponent<Props> {
    render() {
      return <ListItem component={Link} {...this.props as any}/>;
    }
}