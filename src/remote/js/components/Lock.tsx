import * as React from 'react';

export interface Props {
  lock: boolean;

  onLock(lock: boolean): void;
}

export const INITIAL_STATE = {
  point: false,
};

export default class Lock extends React.Component<Props, typeof INITIAL_STATE> {
  constructor() {
    super();
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onClick = this.onClick.bind(this);

    this.state = INITIAL_STATE;
  }

  render() {
    return (
      <div
        onMouseOver={this.onMouseOver}
        onMouseLeave={this.onMouseLeave}
        onClick={this.onClick}
        style={{
          width: '3em',
          textAlign: 'center',
          color: !this.props.lock
            ? !this.state.point ? '#0001' : '#0006'
            : !this.state.point ? '#000B' : '#000F',
        }}
      >
        {!this.props.lock ? '🔓' : '🔒'}
      </div>
    );
  }

  private onMouseOver() {
    this.setState({ ...this.state, point: true });
  }

  private onMouseLeave() {
    this.setState({ ...this.state, point: false });
  }

  private onClick() {
    this.props.onLock(!this.props.lock);
  }
}
