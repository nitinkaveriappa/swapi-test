import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import keys from 'lodash/keys';
import {
  Box,
  Grid,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { USERNAME, PASSWORD } from '../Constants/Login_Constants';
import { searchAllPeople } from '../../SWAPI';

const Login = () => {
  const signal = axios.CancelToken.source();
  let history = useHistory();
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [errors, setErrors] = useState({});
  const [invalidError, setInvalidError] = useState(false);
  const [isLoggingIn, setLoggingIn] = useState(false);
  const [loginData, setLoginData] = useState({
    [USERNAME]: '',
    [PASSWORD]: '',
  });

  useEffect(() => {
    document.title = `Login | Swapi App`;
    return () => {
      signal.cancel('Request Cancelled');
    };
  }, []);

  const handlePasswordVisibility = () => {
    setPasswordVisibility((prevStateValue) => {
      return !prevStateValue;
    });
  };

  const handleChange = (name) => (e) => {
    setErrors((prevErrors) => {
      delete prevErrors[name];
      return { ...prevErrors };
    });
    setInvalidError(false);
    setLoginData({ ...loginData, [name]: e.target.value });
  };

  const checkLogin = async () => {
    setLoggingIn(true);

    try {
      const response = await searchAllPeople(loginData[USERNAME], signal.token);
      console.log(response);
      if (
        response &&
        response.count === 1 &&
        response.results[0].name === loginData[USERNAME] &&
        response.results[0].birth_year === loginData[PASSWORD]
      ) {
        console.log('Login Successful', response.results[0]);
        localStorage.setItem('userName', response.results[0].name);
        history.push('/home');
      } else {
        setInvalidError(true);
        setLoginData({ [USERNAME]: '', [PASSWORD]: '' });
      }
      setLoggingIn(false);
    } catch (error) {
      console.log('API Error', error);
    }
  };

  const handleLogin = () => {
    console.log('Login');
    // checkFormValidity(loginData, errors);
    // console.log(errors);
    if (keys(errors).length === 0) {
      checkLogin();
    }
  };

  return (
    <Box
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Grid container spacing={2}>
        {invalidError && (
          <Grid item xs={12} sm={12}>
            <Typography color="error">Invalid Credentials</Typography>
          </Grid>
        )}
        <Grid item xs={12} sm={12}>
          <TextField
            type="username"
            id="username"
            label="Username"
            placeholder="Username"
            name="Username"
            fullWidth
            value={loginData[USERNAME]}
            onChange={handleChange(USERNAME)}
            disabled={isLoggingIn}
            required
            InputLabelProps={{
              shrink: true,
            }}
            error={!!errors[USERNAME]}
            helperText={errors[USERNAME]}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            type={passwordVisibility ? 'text' : 'password'}
            id="password"
            label="Password"
            placeholder="Password"
            name="password"
            fullWidth
            value={loginData[PASSWORD]}
            onChange={handleChange(PASSWORD)}
            disabled={isLoggingIn}
            required
            InputLabelProps={{
              shrink: true,
            }}
            error={!!errors[PASSWORD]}
            helperText={errors[PASSWORD]}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={() => handlePasswordVisibility()}
                  >
                    {passwordVisibility ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            disabled={isLoggingIn}
          >
            Login
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
