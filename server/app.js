import express from 'express';
import { Server } from 'socket.io'
import { createServer } from 'http'
import cors from 'cors'

// Define the port
const port = 3000;

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
}));

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Server is running!');
});

io.on('connection', (socket) => {
    console.log('User connected');
    console.log('Socket Id', socket.id);

    socket.on("message", ({ message, room }) => {
        console.log(message, room);
        io.to(room).emit('recieve-message', message)
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected ${socket.id}`);

    })
})

// Start the server
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
