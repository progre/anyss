import List, { ListItem, ListItemText } from 'material-ui/List';
import * as React from 'react';

export default function TagList(props: {
  items: ReadonlyArray<string>;
  selectedItem: string;
  onSelect(selectedItem: string): void;
}) {
  return (
    <List>
      {props.items.map((x, i) => (
        <ListItem
          button
          key={i}
          style={props.selectedItem !== x ? {} : { backgroundColor: '#E8E8E8' }}
          onClickCapture={() => { props.onSelect(x); }}
        >
          <ListItemText primary={x} />
        </ListItem>
      ))}
    </List>
  );
}
