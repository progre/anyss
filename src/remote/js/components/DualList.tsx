import Grid from 'material-ui/Grid';
import * as React from 'react';
import SoundList from './SoundList';
import TagList from './TagList';

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
    this.onTagSelect = this.onTagSelect.bind(this);
    this.onFileNameSelect = this.onFileNameSelect.bind(this);

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
            <TagList
              items={tags}
              selectedItem={this.state.selectedTag}
              onSelect={this.onTagSelect}
            />
          </Grid>
          <Grid item xs={8}>
            <SoundList
              items={fileNames}
              selectedItem={this.state.selectedFileName}
              onSelect={this.onFileNameSelect}
            />
          </Grid>
        </Grid>
      </div>
    );
  }

  private onTagSelect(selectedTag: string) {
    this.setState({ ...this.state, selectedTag });
  }

  private onFileNameSelect(selectedFileName: string) {
    this.props.onFileNameClick(selectedFileName);
    this.setState({ ...this.state, selectedFileName });
  }
}

function uniqueSort(stringArray: string[]) {
  stringArray.sort();
  return stringArray.reduce((p, c) => p[p.length - 1] === c ? p : p.concat(c), [] as string[]);
}
