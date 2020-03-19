import * as React from "react";
import { FormControl, InputLabel, Select, MenuItem, Typography, makeStyles } from "@material-ui/core";

const colors = [
  {
    name: "Blue",
    value: "#1ba1e2"
  }, {
    name: 'Red',
    value: '#e51400'
  }, {
    name: 'Green',
    value: '#339933'
  }, {
    name: 'Purple',
    value: '#a200ff'
  }, {
    name: 'Pink',
    value: '#e671b8'
  }, {
    name: 'Mango',
    value: '#f09609'
  }, {
    name: 'Teal',
    value: '#00aba9'
  }, {
    name: 'Lime',
    value: '#8cbf26'
  }, {
    name: 'Magenta',
    value: '#ff0097'
  }, {
    name: 'Brown',
    value: '#a05000'
  }, {
    name: 'Gray',
    value: '#4b4b4b'
  }, {
    name: 'Nokia',
    value: '#1080dd'
  }, {
    name: 'HTC',
    value: '#69b40f'
  }
];

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  colorSquare: {
    width: '14px',
    height: '14px',
    border: '1px solid black',
    marginRight: theme.spacing(1)
  }
}));

const ColorValue = (props:{
  color:{
    name: string,
    value: string
  }
}) => {

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.colorSquare} style={{backgroundColor: props.color.value}}/>
      <Typography>{props.color.name}</Typography>
    </div>
  );
}

const ColorPicker = (props:{
  selectedColor?: string,
  onChange?: (color:string) => void
}) => {

  const selectedColorLower = props.selectedColor?.toLowerCase();
  const hasCustomColor = props.selectedColor && colors.find(i => i.value === selectedColorLower) === undefined;

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel id="colorLabel">Color</InputLabel>
      <Select
        id="color"
        labelId="colorLabel"
        value={selectedColorLower}
        onChange={e => props.onChange && props.onChange(e.target.value as string)}>
        {colors.map(c => (
          <MenuItem key={c.value} value={c.value}><ColorValue color={c}/></MenuItem>
        ))}
        {hasCustomColor && <MenuItem value={selectedColorLower}><ColorValue color={{name: 'Custom', value: selectedColorLower!}}/></MenuItem>}
      </Select>
    </FormControl>
  );
}

export default ColorPicker;