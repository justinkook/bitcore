import io = require('socket.io-client');

console.log('Attempting socket connection');
const socket = io.connect('http://localhost:3000', {transports: ['websocket']});
socket.on('connect', () => {
  console.log('Connected to socket');
  socket.emit('room', '/BTC/regtest/inv');
});

socket.on('tx', sanitizedTx => {
  console.log(sanitizedTx);
});

socket.on('2N17ayiQb5nU7da1NgdG4B4jHE3k4B5UKaC', sanitizedCoin => {
  console.log(sanitizedCoin);
});

socket.on('coin', sanitizedCoin => {
  console.log(sanitizedCoin);
});

socket.on('block', payload => {
  console.log(payload);
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
});