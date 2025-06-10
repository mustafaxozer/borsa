const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let coinValue = 100; // Başlangıç WFX değeri
const history = [];  // Grafik için tarihçeyi tutar (max 30 nokta)

function addHistory(value) {
  const time = new Date().toLocaleTimeString();
  history.push({ time, value });
  if (history.length > 30) history.shift();
}

// İlk değer
addHistory(coinValue);

app.use(express.static('public')); // public klasöründe frontend dosyaları

io.on('connection', (socket) => {
  console.log('Yeni client bağlandı');

  // İlk veriyi gönder
  socket.emit('update', { coinValue, history });

  // Al veya Sat talebi
  socket.on('trade', (type) => {
    if (type === 'buy') coinValue += 1;
    else if (type === 'sell') coinValue -= 1;
    if (coinValue < 0) coinValue = 0; // Negatif olmasın
    addHistory(coinValue);

    // Tüm clientlara güncel veri gönder
    io.emit('update', { coinValue, history });
  });

  socket.on('disconnect', () => {
    console.log('Client ayrıldı');
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
