export type Message
  = SelectDeviceForLabelMessage
  | SetSrcMessage
  | PlayMessage
  | StopMessage;

export interface SelectDeviceForLabelMessage {
  type: 'selectDeviceForLabel';
  label: string;
}

export interface SetSrcMessage {
  type: 'setSrc';
  src: string;
}

export interface PlayMessage {
  type: 'play';
}

export interface StopMessage {
  type: 'stop';
}
