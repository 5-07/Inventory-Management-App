// components/Signup.js

import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Paper } from '@mui/material';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const Signup = ({ onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onSignup();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 3, mt: 5 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            StashPal
          </Typography>
          <Typography component="h2" variant="h6" gutterBottom>
            Sign Up
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <Box
            component="form"
            noValidate
            onSubmit={handleSignup}
            sx={{
              mt: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '100%',
            }}
          >
            <TextField
              variant="outlined"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Signup;
