import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { LoginMutation } from '../../types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectLoginError,
  selectLoginLoading,
} from '../../store/users/usersSlice';
import { login, loginWithGoogle } from '../../store/users/usersThunk';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { LoadingButton } from '@mui/lab';
import {
  Container,
  Box,
  Avatar,
  Typography,
  Grid,
  TextField,
  Link,
  Alert,
  Divider,
} from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectLoginError);
  const loading = useAppSelector(selectLoginLoading);
  const navigate = useNavigate();

  const [state, setState] = useState<LoginMutation>({
    email: '',
    password: '',
  });

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    await dispatch(login(state)).unwrap();
    navigate('/');
  };

  const loginWithGoogleHandler = async (credential: string) => {
    await dispatch(loginWithGoogle(credential)).unwrap();
    navigate('/');
  };

  return (
    <Container maxWidth='xs'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOpenIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>
        {error && (
          <Alert
            severity='error'
            variant='filled'
            sx={{ mt: 5, width: '100%' }}
          >
            {error.error}
          </Alert>
        )}
        <Box
          component='form'
          onSubmit={submitFormHandler}
          sx={{ mt: 3, mb: 1 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label='Email'
                name='email'
                autoComplete='new-email'
                value={state.email}
                onChange={inputChangeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name='password'
                label='Password'
                type='password'
                autoComplete='new-password'
                value={state.password}
                onChange={inputChangeHandler}
              />
            </Grid>
          </Grid>
          <LoadingButton
            loading={loading}
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Sign in
          </LoadingButton>
          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Link component={RouterLink} to='/register' variant='body2'>
                Don't have an account? Sign up
              </Link>
            </Grid>
          </Grid>
        </Box>
        <Divider sx={{ opacity: 1, width: '100%' }}>or</Divider>
        <Box sx={{ pt: 2 }}>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                void loginWithGoogleHandler(credentialResponse.credential);
              }
            }}
            onError={() => {
              console.log('Login error');
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
