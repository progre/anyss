// @ts-ignore
import { StyledComponentProps } from 'material-ui';
import Grid from 'material-ui/Grid';
import List, { ListItem, ListItemText } from 'material-ui/List';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import * as React from 'react';

const styles = { root: {} };

class DualList extends React.Component<
  {
    readonly sounds: ReadonlyArray<{
      readonly fileName: string;
      readonly tags: ReadonlyArray<string>;
    }>,

    onFileNameClick(fileName: string): void;
  }
  ,
  {

  }> {
  render() {
    const tags = uniqueSort(
      (this.props.sounds.map(x => x.tags) as string[][]).reduce((a, b) => [...a, ...b]),
    );
    const fileNames = this.props.sounds.map(x => x.fileName);
    fileNames.sort();
    return (
      <div>
        <Grid container spacing={24}>
          <Grid item xs={4}>
            <List>
              {tags.map((x, i) => (
                <ListItem button key={i}>
                  <ListItemText primary={x} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={8}>
            <List>
              {fileNames.map((x, i) => (
                <ListItem button key={i}>
                  <ListItemText
                    primary={x}
                    onClick={(() => { this.props.onFileNameClick(x); }) as any}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </div>
    );
  }
}

function Root(props: WithStyles<keyof typeof styles> & {
  readonly sounds: ReadonlyArray<{
    readonly fileName: string;
    readonly tags: ReadonlyArray<string>;
  }>,

  onFileNameClick(fileName: string): void;
}) {
  return (
    <div className={props.classes.root}>
      <DualList {...props} />
    </div>
  );
}

function uniqueSort(stringArray: string[]) {
  stringArray.sort();
  return stringArray.reduce((p, c) => p[p.length - 1] === c ? p : p.concat(c), [] as string[]);
}

export default withStyles(styles)(Root);
