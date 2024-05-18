import { Route, Routes } from 'react-router-dom';
import Appbar from './components/Appbar/Appbar';
import Register from './containers/Register/Register';
import Login from './containers/Login/Login';
import { Typography } from '@mui/material';

const App = () => {
  return (
    <>
      <header>
        <Appbar />
      </header>
      <main>
        <Routes>
          <Route path='/' element={<h1>Chat</h1>} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route
            path='*'
            element={
              <Typography variant='h2' style={{ textAlign: 'center' }}>
                Not Found
              </Typography>
            }
          />
        </Routes>
      </main>
    </>
  );
};

export default App;
