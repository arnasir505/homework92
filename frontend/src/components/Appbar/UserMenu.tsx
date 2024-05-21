import React, { useState } from 'react';
import { User } from '../../types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectLogoutLoading } from '../../store/users/usersSlice';
import { logout } from '../../store/users/usersThunks';
import {
  Avatar,
  Button,
  CircularProgress,
  Menu,
  MenuItem,
} from '@mui/material';
import { apiUrl } from '../../constants';
import { setMessages, setOnlineUsers } from '../../store/chat/chatSlice';

interface Props {
  user: User;
}

const UserMenu: React.FC<Props> = ({ user }) => {
  const dispatch = useAppDispatch();
  const [anchorEl, setAncorEl] = useState<HTMLElement | null>(null);
  const loading = useAppSelector(selectLogoutLoading);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAncorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAncorEl(null);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    dispatch(setMessages([]));
    dispatch(setOnlineUsers([]));
  };

  return (
    <>
      <Button color='inherit' onClick={handleClick}>
        <Avatar
          src={
            user.avatar?.includes('google')
              ? user.avatar
              : `${apiUrl}/${user.avatar}`
          }
          sx={{ width: 30, height: 30, mr: 1 }}
        >
          {user.displayName[0]}
        </Avatar>
        {user.displayName}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        keepMounted
      >
        <MenuItem onClick={handleLogout}>
          {loading && <CircularProgress size={20} sx={{ mr: 1 }} />}
          Log out
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
