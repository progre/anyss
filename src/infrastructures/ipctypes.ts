export type Message
  = ExportAllDevicesToClipboardMessage
  | SelectDeviceForLabelMessage
  | SetSrcMessage
  | PlayMessage
  | StopMessage;

export interface ExportAllDevicesToClipboardMessage {
  type: 'exportAllDevicesToClipboard';
}

export interface SelectDeviceForLabelMessage {
  type: 'selectDeviceForLabel';
  label: string;
  withDefault: boolean;
}

export interface SetSrcMessage {
  type: 'setSrc';
  src: string;
  fileName: string;
}

export interface PlayMessage {
  type: 'play';
}

export interface StopMessage {
  type: 'stop';
}
