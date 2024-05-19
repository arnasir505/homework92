import { Schema, model } from 'mongoose';
import { ChatMessageFields } from '../types';

const ChatSchema = new Schema<ChatMessageFields>(
  {
    username: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    datetime: {
      type: String,
      required: true,
    },
    avatar: String,
  },
  {
    versionKey: false,
  }
);

const Chat = model('Chat', ChatSchema);

export default Chat;
