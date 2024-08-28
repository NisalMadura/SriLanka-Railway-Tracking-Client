import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3003';
const socket = io(SOCKET_URL, {
  transports: ['websocket'], // Use WebSocket for better performance
});

export default socket;
