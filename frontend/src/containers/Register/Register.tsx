import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectRegisterError,
  selectRegisterLoading,
} from '../../store/users/usersSlice';
import { register } from '../../store/users/usersThunk';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Box,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import FileInput from '../../components/FileInput/FileInput';
import {
  clearAvatar,
  clearForm,
  selectRegisterAvatarFilename,
  selectRegisterState,
  updateAvatar,
  updateDisplayName,
  updateEmail,
  updateFilename,
  updatePassword,
} from '../../store/register/registerSlice';

const Register = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectRegisterError);
  const loading = useAppSelector(selectRegisterLoading);
  const navigate = useNavigate();
  const { email, displayName, password } =
    useAppSelector(selectRegisterState);

  const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files && files[0]) {
      const blobImageUrl = window.URL.createObjectURL(files[0]);
      dispatch(updateAvatar(blobImageUrl));
    }
  };

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    await dispatch(register()).unwrap();
    dispatch(clearForm());
    navigate('/');
  };

  const getFieldError = (fieldName: string) => {
    try {
      return error?.errors[fieldName].message;
    } catch {
      return undefined;
    }
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
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign up
        </Typography>
        <Box component='form' onSubmit={submitFormHandler} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='email'
                label='Email'
                name='email'
                autoComplete='new-email'
                value={email}
                onChange={(e) => dispatch(updateEmail(e.target.value))}
                error={Boolean(getFieldError('email'))}
                helperText={getFieldError('email')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Name'
                name='displayName'
                autoComplete='new-name'
                value={displayName}
                onChange={(e) => dispatch(updateDisplayName(e.target.value))}
                error={Boolean(getFieldError('displayName'))}
                helperText={getFieldError('displayName')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FileInput
                onChange={fileInputChangeHandler}
                name='image'
                label='Avatar'
                selectFilename={selectRegisterAvatarFilename}
                updateFilename={updateFilename}
                clearImage={clearAvatar}
                selectError={selectRegisterError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name='password'
                label='Password'
                type='password'
                autoComplete='new-password'
                value={password}
                onChange={(e) => dispatch(updatePassword(e.target.value))}
                error={Boolean(getFieldError('password'))}
                helperText={getFieldError('password')}
                required
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
            Sign Up
          </LoadingButton>
          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Link component={RouterLink} to='/login' variant='body2'>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
export default Register;
