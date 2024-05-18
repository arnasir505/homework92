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
  username: string;
  text: string;
}

export interface IncomingChatMessage {
  type: 'NEW_MESSAGE';
  payload: ChatMessage;
}

export interface IncomingWelcomeMessage {
  type: 'WELCOME';
  payload: ChatMessage;
}

export type IncomingMessage = IncomingChatMessage | IncomingWelcomeMessage;

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
