import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ChatMessage, User } from '../../types';
import { RootState } from '../../app/store';

interface ChatState {
  messages: ChatMessage[];
  onlineUsers: User[];
}

const initialState: ChatState = {
  messages: [],
  onlineUsers: [],
};

const chat = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (
      state,
      { payload: messages }: PayloadAction<ChatMessage[]>
    ) => {
      state.messages = messages;
    },
    updateMessages: (
      state,
      { payload: message }: PayloadAction<ChatMessage>
    ) => {
      state.messages.push(message);
    },
  },
});

export const chatReducer = chat.reducer;
export const { setMessages, updateMessages } = chat.actions;
export const selectChatMessages = (state: RootState) => state.chat.messages;
export const selectChatOnlineUsers = (state: RootState) =>
  state.chat.onlineUsers;
