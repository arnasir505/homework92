import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface RegisterState {
  data: {
    email: string;
    displayName: string;
    avatar: string | undefined;
    password: string;
  };
  filename: string;
}

const initialState: RegisterState = {
  data: {
    email: '',
    displayName: '',
    avatar: '',
    password: '',
  },
  filename: '',
};

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    updateEmail: (state, { payload: email }: PayloadAction<string>) => {
      state.data.email = email;
    },
    updateDisplayName: (
      state,
      { payload: displayName }: PayloadAction<string>
    ) => {
      state.data.displayName = displayName;
    },
    updateAvatar: (state, { payload: avatar }: PayloadAction<string>) => {
      state.data.avatar = avatar;
    },
    updatePassword: (state, { payload: password }: PayloadAction<string>) => {
      state.data.password = password;
    },
    updateFilename: (state, { payload: filename }: PayloadAction<string>) => {
      state.filename = filename;
    },
    clearAvatar: (state) => {
      state.data.avatar = '';
    },
    clearForm: (state) => {
      state.data = {
        email: '',
        displayName: '',
        avatar: '',
        password: '',
      };
      state.filename = '';
    },
  },
});

export const registerReducer = registerSlice.reducer;
export const {
  updateEmail,
  updateDisplayName,
  updateAvatar,
  updatePassword,
  updateFilename,
  clearAvatar,
  clearForm,
} = registerSlice.actions;

export const selectRegisterState = (state: RootState) => state.register.data;
export const selectRegisterAvatarFilename = (state: RootState) =>
  state.register.filename;
