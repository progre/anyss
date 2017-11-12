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

export const INITIAL_STATE = {
  selectedTag: 'default',
  selectedFileName: '',
  lockedTags: [] as ReadonlyArray<string>,
};

export default class DualList extends React.Component<Props, typeof INITIAL_STATE> {
  constructor() {
    super();
    this.onTagSelect = this.onTagSelect.bind(this);
    this.onLock = this.onLock.bind(this);
    this.onFileNameSelect = this.onFileNameSelect.bind(this);

    this.state = INITIAL_STATE;
  }

  render() {
    const lockFilteredSounds = this.props.sounds
      .filter(x => this.state.lockedTags.every(lockedTag => x.tags.includes(lockedTag)));
    const tags = uniqueSort(
      (this.props.sounds.map(x => x.tags) as string[][]).reduce((a, b) => [...a, ...b]),
    );
    const fileNames = lockFilteredSounds
      .filter(x => x.tags.includes(this.state.selectedTag))
      .map(x => x.fileName);
    fileNames.sort();
    return (
      <div>
        <Grid container spacing={24}>
          <Grid item xs={4}>
            <TagList
              items={tags.map(x => (
                {
                  tag: x,
                  lock: this.state.lockedTags.includes(x),
                  disabled: !lockFilteredSounds.some(sound => sound.tags.includes(x)),
                }
              ))}
              selectedItem={this.state.selectedTag}
              onLock={this.onLock}
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

  private onLock(tag: string, lock: boolean) {
    this.setState({
      ...this.state,
      lockedTags: lock
        ? [...this.state.lockedTags, tag]
        : this.state.lockedTags.filter(x => x !== tag),
    });
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
