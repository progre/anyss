import Grid from 'material-ui/Grid';
import List, { ListItem, ListItemText } from 'material-ui/List';
import * as React from 'react';

export interface Props {
  readonly sounds: ReadonlyArray<{
    readonly fileName: string;
    readonly tags: ReadonlyArray<string>;
  }>;

  onFileNameClick(fileName: string): void;
}

export interface State {
  readonly selectedTag: string;
  readonly selectedFileName: string;
}

export default class DualList extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      selectedTag: 'default',
      selectedFileName: '',
    };
  }

  render() {
    const tags = uniqueSort(
      (this.props.sounds.map(x => x.tags) as string[][]).reduce((a, b) => [...a, ...b]),
    );
    const fileNames = this.props.sounds
      .filter(x => x.tags.includes(this.state.selectedTag))
      .map(x => x.fileName);
    fileNames.sort();
    return (
      <div>
        <Grid container spacing={24}>
          <Grid item xs={4}>
            <List>
              {tags.map((x, i) => (
                <ListItem
                  button
                  key={i}
                  style={
                    this.state.selectedTag !== x ? {} : {
                      backgroundColor: '#E8E8E8',
                    }
                  }
                  onClickCapture={(() => {
                    this.setState({ ...this.state, selectedTag: x });
                  }) as any}
                >
                  <ListItemText primary={x} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={8}>
            <List>
              {fileNames.map((x, i) => (
                <ListItem
                  button
                  key={i}
                  style={
                    this.state.selectedFileName !== x ? {} : {
                      backgroundColor: '#E8E8E8',
                    }
                  }
                  onClickCapture={(() => {
                    this.props.onFileNameClick(x);
                    this.setState({ ...this.state, selectedFileName: x });
                  }) as any}
                >
                  <ListItemText primary={x} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </div>
    );
  }
}

function uniqueSort(stringArray: string[]) {
  stringArray.sort();
  return stringArray.reduce((p, c) => p[p.length - 1] === c ? p : p.concat(c), [] as string[]);
}
