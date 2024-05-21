import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { IncomingMessage } from '../../types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectChatMessages,
  selectChatOnlineUsers,
  setMessages,
  setOnlineUsers,
  updateMessages,
  updateOnlineUsers,
} from '../../store/chat/chatSlice';
import { selectUser } from '../../store/users/usersSlice';
import { Link } from 'react-router-dom';
import ChatBubble from '../../components/ChatBubble/ChatBubble';
import { StyledBadge } from '../../theme';
import { apiUrl } from '../../constants';

const Chat: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const chatMessages = useAppSelector(selectChatMessages);
  const onlineUsers = useAppSelector(selectChatOnlineUsers);
  const [messageText, setMessageText] = useState('');
  const ws = useRef<WebSocket | null>(null);

  const onMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
  };

  const onMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ws.current) return;

    if (messageText !== '') {
      ws.current.send(
        JSON.stringify({
          type: 'SEND_MESSAGE',
          payload: {
            username: user?.displayName,
            text: messageText,
            avatar: user?.avatar,
          },
        })
      );
      setMessageText('');
    }
  };

  const connect = () => {
    if (!user) {
      return;
    }
    ws.current = new WebSocket('ws://localhost:8000/chat');

    ws.current.addEventListener('open', () => {
      if (ws.current) {
        ws.current.send(
          JSON.stringify({ type: 'LOGIN', payload: { token: user.token } })
        );
      }
    });

    ws.current.addEventListener('close', () => {
      console.log('Connection closed');
    });

    ws.current.addEventListener('message', (msg) => {
      const parsedMsg = JSON.parse(msg.data) as IncomingMessage;

      switch (parsedMsg.type) {
        case 'SET_MESSAGES':
          dispatch(setMessages(parsedMsg.payload));
          break;
        case 'NEW_MESSAGE':
          dispatch(updateMessages(parsedMsg.payload));
          break;
        case 'NEW_ONLINEUSER':
          dispatch(updateOnlineUsers(parsedMsg.payload));
          break;
        case 'SET_ONLINEUSERS':
          dispatch(setOnlineUsers(parsedMsg.payload));
          break;
        case 'WELCOME':
          console.log(parsedMsg.payload);
          break;
      }
    });

    ws.current.addEventListener('error', () => {
      console.log(
        'Connection closed. Reconnect will be attempted in 2 seconds'
      );
      setTimeout(() => {
        void connect();
      }, 2000);
    });
  };

  useEffect(() => {
    void connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [user?.token]);

  return (
    <Container>
      <Grid container sx={{ py: 5 }}>
        <Grid item xs={12} sm={3}>
          <Typography sx={{ mb: 2, fontSize: '0.9rem' }}>
            Online users
          </Typography>
          {onlineUsers.map((user) => (
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}
              key={user._id}
            >
              <StyledBadge
                overlap='circular'
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant='dot'
              >
                <Avatar
                  alt={user.displayName}
                  src={
                    user.avatar?.includes('google')
                      ? user.avatar
                      : `${apiUrl}/${user.avatar}`
                  }
                  sx={{ width: 32, height: 32 }}
                />
              </StyledBadge>
              <Typography>{user.displayName}</Typography>
            </Box>
          ))}
        </Grid>
        <Grid
          item
          xs={12}
          sm={9}
          container
          sx={{ flexDirection: 'column', borderLeft: '1px solid #aaa', pl: 3 }}
        >
          {user ? (
            <>
              <Grid
                item
                sx={{
                  height: '500px',
                  mb: 1,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column-reverse',
                  alignItems: 'baseline',
                }}
              >
                {chatMessages.map((msg, index) => {
                  const nextMessage = chatMessages[index + 1];
                  const isSameUsernameAsNext =
                    nextMessage && msg.username === nextMessage.username;
                  const isLastMessage = index === chatMessages.length - 1;
                  let username = msg.username;
                  if (isSameUsernameAsNext && !isLastMessage) {
                    username = '';
                  }
                  return (
                    <ChatBubble
                      key={msg._id || Math.random().toString()}
                      username={username}
                      text={msg.text}
                      datetime={msg.datetime}
                      avatar={msg.avatar}
                    />
                  );
                })}
              </Grid>
              <Grid item>
                <Box
                  component='form'
                  sx={{ display: 'flex', gap: 2 }}
                  onSubmit={onMessageSubmit}
                >
                  <TextField
                    autoFocus
                    type='text'
                    name='message'
                    placeholder='Message'
                    value={messageText}
                    onChange={onMessageChange}
                    size='small'
                  />
                  <Button type='submit'>Send</Button>
                </Box>
              </Grid>
            </>
          ) : (
            <Box
              sx={{
                height: '500px',
                background: '#272727',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography variant='h5'>
                <Link to='/login' style={{ color: '#4fc3f7' }}>
                  Login
                </Link>
                &nbsp; or &nbsp;
                <Link to='/register' style={{ color: '#4fc3f7' }}>
                  Register
                </Link>
                &nbsp; to join chat
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Chat;
