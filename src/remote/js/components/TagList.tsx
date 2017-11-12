import List, { ListItem, ListItemText } from 'material-ui/List';
import * as React from 'react';
import Lock from './Lock';

export default function TagList(props: {
  items: ReadonlyArray<{ tag: string; lock: boolean; disabled: boolean; }>;
  selectedItem: string;

  onLock(item: string, lock: boolean): void;
  onSelect(selectedItem: string): void;
}) {
  return (
    <List>
      {props.items.map((x, i) => (
        <ListItem
          button
          key={i}
          style={props.selectedItem !== x.tag ? {} : { backgroundColor: '#E8E8E8' }}
          disabled={x.disabled}
          onClickCapture={() => { props.onSelect(x.tag); }}
        >
          <ListItemText primary={x.tag} />
          <Lock
            lock={x.lock}
            onLock={(lock) => { props.onLock(x.tag, lock); }}
          />
        </ListItem>
      ))}
    </List>
  );
}
