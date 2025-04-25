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
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const result = await res.json();
      if (!res.ok) alert(result.message);

      dispatch({ type: 'REGISTER_SUCCESS' });
      navigate("/login");

    } catch (error) {
      alert(error.message);
    }
  };

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
                id="email"
                placeholder="Email"
                variant="outlined"
                margin="normal"
                required
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
    </Container>
  );
};

export default Register;
