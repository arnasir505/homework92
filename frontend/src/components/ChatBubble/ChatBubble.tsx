import { Avatar, Box, Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import stc from 'string-to-color';
import { apiUrl } from '../../constants';

interface Props {
  username: string;
  text: string;
  datetime: string;
  avatar?: string;
}

const ChatBubble: React.FC<Props> = ({ username, text, datetime, avatar }) => {
  return (
    <Grid item sx={{ display: 'flex' }}>
      <Box>
        {username && (
          <Avatar
            src={avatar?.includes('google') ? avatar : `${apiUrl}/${avatar}`}
            sx={{ width: 32, height: 32, mr: 1 }}
          >
            {username[0]}
          </Avatar>
        )}
      </Box>
      <Grid
        item
        sx={{
          background: '#272727',
          p: 1,
          mb: 1,
          borderRadius: '.5rem',
          marginLeft: username ? 0 : 5,
        }}
      >
        <Typography sx={{ color: stc(username), fontSize: '.9rem' }}>
          {username}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'end', gap: 1 }}>
          <Typography variant='body1'>{text}</Typography>
          <Typography variant='body2' sx={{ color: '#aaa', fontSize: '.8rem' }}>
            {dayjs(datetime).format('HH:mm')}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ChatBubble;
