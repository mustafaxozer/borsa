const TelegramBot = require('node-telegram-bot-api');
const TOKEN = '7400156060:AAFbOxhmaKZ-YIJvF2DlSjwW-J94Fl2lpz0';
const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'WFX Coin Simülasyonuna hoş geldin!', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '📈 Grafiği Aç',
            web_app: {
              url: 'https://borsa-ashen.vercel.app/' // Şimdilik localhost değil!
            }
          }
        ]
      ]
    }
  });
});
