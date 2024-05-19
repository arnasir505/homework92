import { Grid, Typography } from '@mui/material';
import React from 'react';
import stc from 'string-to-color';

interface Props {
  username: string;
  text: string;
}

const ChatBubble: React.FC<Props> = ({ username, text }) => {
  return (
    <Grid item sx={{ background: '#272727', p: 1, mb: 1 }}>
      <Typography sx={{ color: stc(username), fontSize: '.9rem' }}>
        {username}
      </Typography>
      {text}
    </Grid>
  );
};

export default ChatBubble;
