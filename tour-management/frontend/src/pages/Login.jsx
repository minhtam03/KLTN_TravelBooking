// import React, { useState, useContext } from 'react'
// import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap'
// import { Link, useNavigate } from 'react-router-dom'
// import '../styles/login.css'

// import loginImg from '../assets/images/login.png'
// import userIcon from '../assets/images/user.png'

// import { AuthContext } from '../context/AuthContext'
// import { BASE_URL } from '../utils/config'

// const Login = () => {

//   const [credentials, setCredentials] = useState({
//     email: undefined,
//     password: undefined
//   })


//   const { dispatch } = useContext(AuthContext)
//   const navigate = useNavigate()


//   const handleChange = e => {
//     setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }))
//   }

//   const handleClick = async e => {
//     e.preventDefault()

//     dispatch({ type: 'LOGIN_START' })

//     try {
//       const res = await fetch(`${BASE_URL}/auth/login`, {
//         method: 'post',
//         headers: {
//           'content-type': 'application/json'
//         },
//         credentials: 'include',
//         body: JSON.stringify(credentials)
//       })

//       const result = await res.json()

//       if (!res.ok) alert(result.message)

//       console.log(result.data)

//       dispatch({ type: 'LOGIN_SUCCESS', payload: result.data })
//       // navigate('/')
//       if (result.role === "admin") {
//         navigate("/admin/home"); // Điều hướng admin
//       } else {
//         navigate("/"); // Điều hướng user
//       }

//     } catch (err) {
//       dispatch({ type: 'LOGIN_FAILURE', payload: err.message })
//       navigate("/login")
//     }
//   }

//   return (
//     <section>
//       <Container>
//         <Row>
//           <Col lg='8' className="m-auto">
//             <div className="login__container d-flex justify-content-between">
//               <div className='login__img'>
//                 <img src={loginImg} alt="" />
//               </div>


//               <div className='login__form'>
//                 <div className='user'>
//                   <img src={userIcon} alt="" />
//                 </div>
//                 <h2>Login</h2>
//                 <Form onSubmit={handleClick}>
//                   <FormGroup>
//                     <input type="text" placeholder='Email' required id='email'
//                       onChange={handleChange} />
//                   </FormGroup>

//                   <FormGroup>
//                     <input type="password" placeholder='Password' required id='password'
//                       onChange={handleChange} />
//                   </FormGroup>

//                   <Button className="btn secondary__btn auth__btn" type='submit'>
//                     Login
//                   </Button>
//                 </Form>
//                 <p>Don't have an account
//                   <Link to='/register'>Create</Link>
//                 </p>
//               </div>
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </section>
//   )
// }

// export default Login


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
      if (!res.ok) alert(result.message);

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

              {/* <Typography variant="body2" align="center" mt={2}>
                Or login with
              </Typography>
              <Box display="flex" justifyContent="center" gap={2} mt={1}>
                <Button variant="outlined" sx={{ minWidth: 36 }}>F</Button>
                <Button variant="outlined" sx={{ minWidth: 36 }}>T</Button>
                <Button variant="outlined" sx={{ minWidth: 36 }}>G</Button>
              </Box> */}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Login;

