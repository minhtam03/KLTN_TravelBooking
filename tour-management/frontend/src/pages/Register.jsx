import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../utils/config';
import { Snackbar, Alert, Slide } from '@mui/material';
import {
  Box,
  Container,
  TextField,
  Typography,
  Button,
  Grid,
  Paper,
  InputAdornment,
} from '@mui/material';
import { Person, Email, Lock } from '@mui/icons-material';

import registerImg from '../assets/images/home/login.jpg';

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: '',
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

    const { username, email, password } = credentials;
    if (!username || !email || !password) {
      showSnackbar("Please fill in all required fields", "warning");
      return;
    }

    // Kiểm tra định dạng email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showSnackbar("Please enter a valid email address", "warning");
      return;
    }


    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const result = await res.json();
      if (!res.ok) {
        showSnackbar(result.message || 'Registration failed', 'error');
        return;
      }

      // dispatch({ type: 'REGISTER_SUCCESS' });
      // navigate("/login");

      dispatch({ type: 'REGISTER_SUCCESS' });
      showSnackbar("Account created successfully", "success");

      setTimeout(() => {
        navigate("/login");
      }, 1500);


    } catch (error) {
      showSnackbar(error.message || 'Something went wrong', 'error');
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
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const slideTransition = (props) => <Slide {...props} direction="down" />;

  return (
    <Container maxWidth="md">
      <Paper elevation={6} sx={{ mt: 12, borderRadius: 4 }}>
        <Grid container>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
            <Box
              component="img"
              src={registerImg}
              alt="register visual"
              sx={{
                width: '100%',
                maxWidth: 320,
                borderRadius: '10%',
                objectFit: 'cover',
                boxShadow: 3,
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
              Register
            </Typography>
            <Box component="form" onSubmit={handleClick}>
              <TextField
                fullWidth
                id="username"
                placeholder="Username"
                variant="outlined"
                margin="normal"

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
                id="email"
                placeholder="Email"
                variant="outlined"
                margin="normal"

                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
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

                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  )
                }}
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
                    backgroundColor: '#71aea3'
                  }
                }}
              >
                Create Account
              </Button>

              <Typography variant="body1" align="center" fontWeight="bold">
                <Link to="/login" style={{ color: '#71aea3', textDecoration: 'none' }}>
                  Already have an account? Log in
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

export default Register;
