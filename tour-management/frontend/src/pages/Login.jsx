import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../utils/config';

import {
  Box,
  Container,
  TextField,
  Typography,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  Paper,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Person, Lock } from '@mui/icons-material';
import { Snackbar, Alert, Slide } from '@mui/material';
import loginImg from '../assets/images/home/login.jpg';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: 'LOGIN_START' });

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials)
      });

      const result = await res.json();
      // if (!res.ok) alert(result.message);
      if (!res.ok) {
        showSnackbar(result.message || "Login failed");
        return;
      }


      dispatch({ type: 'LOGIN_SUCCESS', payload: result.data });
      if (result.role === 'admin') {
        navigate('/admin/home');
      } else {
        navigate('/');
      }
    } catch (err) {
      dispatch({ type: 'LOGIN_FAILURE', payload: err.message });
      navigate('/login');
    }
  };

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  const showSnackbar = (message, severity = 'error') => {
    setSnackbar(prev => ({ ...prev, open: false }));

    setTimeout(() => {
      setSnackbar({ open: true, message, severity });
    }, 100); // delay nhỏ để đảm bảo trạng thái được cập nhật
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const slideTransition = (props) => <Slide {...props} direction="down" />;

  return (
    <Container maxWidth="md">
      <Paper elevation={6} sx={{ mt: 12, borderRadius: 4 }}>
        <Grid container>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
            <Box
              component="img"
              src={loginImg}
              alt="login visual"
              sx={{
                width: '100%',
                maxWidth: 320,
                borderRadius: '10%', // làm ảnh bo tròn
                objectFit: 'cover',  // đảm bảo ảnh không bị méo
                boxShadow: 3,        // thêm bóng nhẹ nếu muốn
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} sx={{ p: 4 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              align="center"
              sx={{
                fontSize: 36,
                fontFamily: 'Volkhov, Georgia, serif',
                fontWeight: 700,
                color: 'var(--secondary-color)',
                mb: 4,
              }}
            >
              Log in
            </Typography>
            <Box component="form" onSubmit={handleClick}>
              <TextField
                fullWidth
                id="email"
                placeholder="Your Email"
                variant="outlined"
                margin="normal"
                required
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                fullWidth
                id="password"
                type="password"
                placeholder="Password"
                variant="outlined"
                margin="normal"
                required
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  )
                }}
              />

              <FormControlLabel
                control={<Checkbox name="remember" color="primary" />}
                label="Remember me"
                sx={{ mt: 1 }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  mb: 4,
                  backgroundColor: 'var(--secondary-color)',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#71aea3' // thay thế bằng màu đậm hơn nếu có biến cụ thể
                  }
                }}
              >
                Log in
              </Button>

              <Typography variant="body1" align="center"
                fontWeight="bold">
                <Link to="/register" style={{ color: '#71aea3', textDecoration: 'none' }}>
                  Create an account
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={slideTransition}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            fontSize: '1.1rem',
            fontWeight: 600,
            py: 2,
            px: 3
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;

