// server.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let currentPrice = 1.00;

function randomChange() {
  const change = (Math.random() * 0.1 - 0.05);
  currentPrice = Math.max(0.1, +(currentPrice + change).toFixed(2));
  return currentPrice;
}

wss.on('connection', function connection(ws) {
  // Bağlanan yeni clienta anında fiyatı gönder
  ws.send(JSON.stringify({ price: currentPrice }));

  // Her saniye fiyat güncelle ve tüm clientlara yolla
  const interval = setInterval(() => {
    const price = randomChange();
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ price }));
      }
    });
  }, 1000);

  ws.on('close', () => clearInterval(interval));
});

console.log('WebSocket server 8080 portunda çalışıyor...');
