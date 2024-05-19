import { WebSocket } from 'ws';

export interface UserFields {
  email: string;
  password: string;
  token: string;
  role: string;
  displayName: string;
  googleID?: string;
  avatar?: string;
}

export interface ActiveConnections {
  [id: string]: WebSocket;
}

export interface IncomingMessage {
  type: string;
  payload: {
    username: string;
    text: string;
  };
}

export interface ChatMessageFields {
  username: string;
  text: string;
  datetime: string;
  avatar?: string;
}
