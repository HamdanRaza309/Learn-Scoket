import React, { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import { Box, Button, Container, Stack, TextField, Typography, Paper } from '@mui/material'

function App() {
  const [message, setMessage] = useState('') // State for the user's message input
  const [room, setRoom] = useState('') // State for the room input
  const [socketId, setSocketId] = useState('') // State to store the connected socket ID
  const [messagesArray, setMessagesArray] = useState([])

  // Initialize socket connection and ensure memoization to avoid unnecessary re-creation
  const socket = useMemo(() => io(`http://localhost:3000`), [])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Emit message along with room information
    socket.emit('message', { message, room })
    setMessage('') // Clear message input after submission
  }

  useEffect(() => {
    // On socket connection, store socket ID
    socket.on('connect', () => {
      setSocketId(socket.id)
    })

    // Listen for a welcome message from the server
    socket.on('welcome', (m) => {
      console.log(m);
    })

    // Listen for incoming messages
    socket.on('recieve-message', (data) => {
      setMessagesArray((messages) => [...messages, data])
    })

    // Disconnect socket on component unmount to prevent memory leaks
    return () => {
      socket.disconnect();
    }
  }, [])

  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        bgcolor: '#f9fafc',
        borderRadius: 6,
        p: 6,
        gap: 3,
      }}
    >
      {/* Title of the application */}
      <Typography
        variant="h3"
        component="div"
        gutterBottom
        sx={{
          textAlign: 'center',
          color: '#1a237e',
          fontWeight: '700',
          mb: 2,
          letterSpacing: 1.5,
        }}
      >
        Live Chat Room
      </Typography>

      {/* Display socket ID */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: '#e3f2fd',
          color: '#0d47a1',
          fontSize: '1rem',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        Socket ID: {socketId}
      </Paper>

      {/* Form to send message and specify the room */}
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Stack spacing={3}>
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            label="Type Your Message"
            variant="outlined"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
            }}
          />
          <TextField
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            label="Enter Room Name"
            variant="outlined"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
            }}
          />
          <Box textAlign="center">
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              sx={{
                px: 8,
                py: 1.8,
                fontWeight: '700',
                textTransform: 'capitalize',
                fontSize: '1rem',
                letterSpacing: 1.2,
                borderRadius: '50px',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              Send Message
            </Button>
          </Box>
        </Stack>
      </form>

      {/* Message Display */}
      <Box
        sx={{
          width: '100%',
          maxHeight: '300px',
          overflowY: 'auto',
          bgcolor: '#e8eaf6',
          p: 3,
          borderRadius: 4,
          mt: 3,
        }}
      >
        {messagesArray.map((m, i) => (
          <Typography
            key={i}
            variant="body1"
            component="div"
            sx={{
              p: 1.5,
              mb: 1.5,
              borderRadius: 2,
              bgcolor: '#c5cae9',
              color: '#283593',
              fontWeight: '600',
              wordBreak: 'break-word',
            }}
          >
            {m}
          </Typography>
        ))}
      </Box>
    </Container>
  );
}

export default App
