import React from 'react';
import { Link as NavLink } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../store/users/usersSlice';
import UserMenu from './UserMenu';
import AnonymousMenu from './AnonymousMenu';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  styled,
  Grid,
} from '@mui/material';

const LogoLink = styled(NavLink)({
  color: '#4fc3f7',
  textDecoration: 'none',
});

const Appbar: React.FC = () => {
  const user = useAppSelector(selectUser);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Container>
          <Toolbar>
            <Grid container justifyContent='space-between' alignItems='center'>
              <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                <LogoLink to='/'>Chat</LogoLink>
              </Typography>
              {user ? <UserMenu user={user} /> : <AnonymousMenu />}
            </Grid>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};

export default Appbar;
