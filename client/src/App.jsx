import React, { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import { Box, Button, Container, TextField, Typography } from '@mui/material'

function App() {
  const [message, setMessage] = useState('') // State for the user's message input
  const [room, setRoom] = useState('') // State for the room input
  const [socketId, setSocketId] = useState('') // State to store the connected socket ID

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
      console.log("Connected", socket.id);
    })

    // Listen for a welcome message from the server
    socket.on('welcome', (m) => {
      console.log(m);
    })

    // Listen for incoming messages
    socket.on('recieve-message', (data) => {
      console.log(data);
    })

    // Disconnect socket on component unmount to prevent memory leaks
    return () => {
      socket.disconnect();
    }
  }, [])

  return (
    <Container
      maxWidth="sm"
      sx={{
        // Center container with modern design and spacing
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
      {/* Title of the application */}
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

      {/* Display socket ID */}
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

      {/* Form to send message and specify the room */}
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
              borderRadius: '8px', // Rounded corners for a modern feel
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
              borderRadius: '8px', // Rounded corners for a modern feel
            },
          }}
        />
        <Box textAlign="center">
          {/* Submit button with hover effect for better UX */}
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
                transform: 'scale(1.05)', // Slight zoom on hover
                boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)', // Add depth effect
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
