import * as React from 'react';
import Root from '../components/Root';

export const initialState = {
  sounds: null as ReadonlyArray<{
    readonly fileName: string;
    readonly tags: ReadonlyArray<string>;
  }> | null,
};

export default class Index extends React.Component<{}, typeof initialState> {
  constructor() {
    super();

    this.state = initialState;
    this.onFileNameClick = this.onFileNameClick.bind(this);
  }

  render() {
    if (this.state.sounds == null) {
      return <div />;
    }
    return <Root sounds={this.state.sounds} onFileNameClick={this.onFileNameClick} />;
  }

  async componentDidMount() {
    const res = await fetch('/api/getSounds');
    const json = await res.json();
    this.setState({
      sounds: json.sounds,
    });
  }

  onFileNameClick(fileName: string) {
    (async () => {
      await fetch(
        '/api/setSrc', {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json; charset=utf-8',
          }),
          body: JSON.stringify({ src: fileName }),
        },
      );
    })().catch((e) => { console.error(e.stack || e); });
  }
}
