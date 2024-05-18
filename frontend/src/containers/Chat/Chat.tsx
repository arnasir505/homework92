import { Container, Grid } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { wsApiUrl } from '../../constants';

const Chat: React.FC = () => {
  const [messageText, setMessageText] = useState('');
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(wsApiUrl);
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
          <Grid item sx={{ height: '500px' }}>
            Chat room
          </Grid>
          <Grid item>Input</Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Chat;
