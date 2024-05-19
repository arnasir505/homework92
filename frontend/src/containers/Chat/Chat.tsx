import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { wsApiUrl } from '../../constants';
import { IncomingMessage } from '../../types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectChatMessages,
  setMessages,
  updateMessages,
} from '../../store/chat/chatSlice';
import { selectUser } from '../../store/users/usersSlice';
import { Link } from 'react-router-dom';

const Chat: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const chatMessages = useAppSelector(selectChatMessages);
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
          payload: { username: user?.displayName, text: messageText },
        })
      );
      setMessageText('');
    }
  };

  useEffect(() => {
    ws.current = new WebSocket(wsApiUrl);

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
        case 'WELCOME':
          console.log(parsedMsg.payload);
          break;
      }
    });

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return (
    <Container>
      <Grid container sx={{ py: 5 }}>
        <Grid item xs={12} sm={3}>
          Online users
        </Grid>
        <Grid
          item
          xs={12}
          sm={9}
          container
          sx={{ flexDirection: 'column', borderLeft: '1px solid #aaa', pl: 4 }}
        >
          <Grid item sx={{ height: '500px', overflowY: 'scroll' }}>
            Chat room
            {chatMessages.map((msg) => (
              <Grid item key={msg._id || Math.random().toString()}>
                {msg.username}:{msg.text}
              </Grid>
            ))}
          </Grid>
          <Grid item>
            {user ? (
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
            ) : (
              <Box sx={{ border: '1px solid #aaa', padding: 1 }}>
                <Typography variant='body1' sx={{ textAlign: 'center' }}>
                  <Link to='/login' style={{ color: '#4fc3f7' }}>
                    Login
                  </Link>
                  &nbsp; or &nbsp;
                  <Link to='/register' style={{ color: '#4fc3f7' }}>
                    Register
                  </Link>
                  &nbsp; to send message
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Chat;
