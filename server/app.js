import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';

// Define the port
const port = 3000;

const app = express();
const server = createServer(app);

// Initialize Socket.IO with CORS configuration to allow requests from the client
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // Allow client from this origin
        methods: ['GET', 'POST'], // Allowed HTTP methods
        credentials: true // Allow cookies to be sent
    }
});

// Enable CORS for the Express app
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
}));

// Basic route to verify the server is running
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Socket.IO event handling
io.on('connection', (socket) => {
    console.log('User connected');
    console.log('Socket Id', socket.id); // Log the unique ID for each connected client

    // Listen for 'message' events and broadcast them to the specified room
    socket.on("message", ({ message, room }) => {
        console.log(message, room); // Log the received message and target room
        io.to(room).emit('recieve-message', message); // Emit the message to the target room
        // Uncomment below to send the message to all connected clients
        // socket.broadcast.emit('recieve-message', message); 
    });

    // Handle disconnection event
    socket.on("disconnect", () => {
        console.log(`User disconnected ${socket.id}`); // Log when a user disconnects
    });
});

// Start the server on the specified port
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
