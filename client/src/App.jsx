import React, { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import { Box, Button, Container, TextField, Typography } from '@mui/material'

function App() {
  const [message, setMessage] = useState('')
  const [room, setRoom] = useState('')
  const [socketId, setSocketId] = useState('')
  const socket = useMemo(() => io(`http://localhost:3000`), [])

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit('message', { message, room })
    setMessage('')
  }

  useEffect(() => {
    socket.on('connect', () => {
      setSocketId(socket.id)
      console.log("Connected", socket.id);
    })

    socket.on('welcome', (m) => {
      console.log(m);
    })

    socket.on('recieve-message', (data) => {
      console.log(data);
    })

    return () => {
      socket.disconnect();
    }
  }, [])

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        bgcolor: '#ffffff',
        borderRadius: 4,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        p: 4,
      }}
    >
      <Typography
        variant="h3"
        component="div"
        gutterBottom
        sx={{
          textAlign: 'center',
          color: '#3f51b5',
          fontWeight: '600',
          mb: 3,
          letterSpacing: 1.2,
        }}
      >
        SOCKET.IO Chat
      </Typography>

      <Typography
        variant="h6"
        component="div"
        gutterBottom
        sx={{
          textAlign: 'center',
          color: '#0000h0',
          fontWeight: '600',
          mb: 3,
          letterSpacing: 1.2,
        }}
      >
        {socketId}
      </Typography>

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="Your Message"
          variant="outlined"
          fullWidth
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="Room"
          variant="outlined"
          fullWidth
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />
        <Box textAlign="center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              px: 6,
              py: 1.5,
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: 1,
              borderRadius: '30px',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
              },
            }}
          >
            Send
          </Button>
        </Box>
      </form>
    </Container>
  );
}

export default App
