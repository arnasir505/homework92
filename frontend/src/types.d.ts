export interface RegisterMutation {
  email: string;
  displayName: string;
  avatar?: string;
  password: string;
}

export interface LoginMutation {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  email: string;
  token: string;
  role: string;
  displayName: string;
  googleID?: string;
  avatar?: string;
}

export interface ChatMessage {
  _id?: string;
  username: string;
  text: string;
  datetime: string;
}

interface IncomingChatMessages {
  type: 'SET_MESSAGES';
  payload: ChatMessage[];
}

interface IncomingChatMessage {
  type: 'NEW_MESSAGE';
  payload: ChatMessage;
}

interface IncomingWelcomeMessage {
  type: 'WELCOME';
  payload: ChatMessage;
}

export type IncomingMessage = IncomingChatMessages | IncomingChatMessage | IncomingWelcomeMessage;

export interface RegisterResponse {
  user: User;
  message: string;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    };
  };
  message: string;
  name: string;
  _message: string;
}

export interface GlobalError {
  error: string;
}
