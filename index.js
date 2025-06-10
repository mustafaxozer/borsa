const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let currentPrice = 1.00;

function randomChange() {
  // Küçük rastgele hareket ±0.02
  const change = (Math.random() * 0.04 - 0.02);
  currentPrice = Math.max(0.1, +(currentPrice + change).toFixed(2));
}

function applyBuy() {
  // Alım fiyatı 0.05 - 0.10 TL arası yükseltsin
  const change = (Math.random() * 0.05 + 0.05);
  currentPrice = +(currentPrice + change).toFixed(2);
}

function applySell() {
  // Satım fiyatı 0.05 - 0.10 TL arası düşürsün (ama 0.1 altına düşürme)
  const change = (Math.random() * 0.05 + 0.05);
  currentPrice = Math.max(0.1, +(currentPrice - change).toFixed(2));
}

function broadcastPrice() {
  const msg = JSON.stringify({ price: currentPrice });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

wss.on('connection', ws => {
  // Bağlanan clienta anında fiyatı gönder
  ws.send(JSON.stringify({ price: currentPrice }));

  ws.on('message', message => {
    try {
      const data = JSON.parse(message);
      if (data.action === "buy") {
        applyBuy();
      } else if (data.action === "sell") {
        applySell();
      }
      broadcastPrice();
    } catch (e) {
      console.error("Hatalı mesaj:", message);
    }
  });
});

// Her saniye rastgele küçük fiyat değişikliği ve tüm clientlara güncelleme
setInterval(() => {
  randomChange();
  broadcastPrice();
}, 1000);

console.log('WebSocket server 8080 portunda çalışıyor...');
