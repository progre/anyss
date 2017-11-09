// @ts-ignore
import { StyledComponentProps } from 'material-ui';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import * as React from 'react';
import DualList from './DualList';

const styles = { root: {} };

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

export default withStyles(styles)(Root);
