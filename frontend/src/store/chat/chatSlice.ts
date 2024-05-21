import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ChatMessage, OnlineUser } from '../../types';
import { RootState } from '../../app/store';

interface ChatState {
  messages: ChatMessage[];
  onlineUsers: OnlineUser[];
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
      state.messages.unshift(message);
    },
    setOnlineUsers: (
      state,
      { payload: users }: PayloadAction<OnlineUser[]>
    ) => {
      state.onlineUsers = users;
    },
    updateOnlineUsers: (
      state,
      { payload: newUser }: PayloadAction<OnlineUser>
    ) => {
      const foundIndex = state.onlineUsers.findIndex(
        (user) => user._id === newUser._id
      );
      if (foundIndex === -1) {
        state.onlineUsers.push(newUser);
      }
    },
  },
});

export const chatReducer = chat.reducer;
export const {
  setMessages,
  updateMessages,
  setOnlineUsers,
  updateOnlineUsers,
} = chat.actions;
export const selectChatMessages = (state: RootState) => state.chat.messages;
export const selectChatOnlineUsers = (state: RootState) =>
  state.chat.onlineUsers;
