const mineflayer = require('mineflayer');

const config = {
  host: 'kkj.falixsrv.me',
  port: 35139,
  username: 'AFK-Bot',
  auth: 'offline'
};

let bot;
let reconnectTimer;

function startBot() {
  console.log(`Verbinde mit ${config.host}:${config.port} ...`);

  bot = mineflayer.createBot(config);

  bot.once('spawn', () => {
    console.log(`Bot ist online: ${bot.username}`);

    // Alle 30 Sekunden leicht umschauen
    setInterval(() => {
      if (!bot || !bot.entity) return;

      bot.look(
        bot.entity.yaw + 0.3,
        bot.entity.pitch,
        true
      ).catch(() => {});
    }, 30000);
  });

  bot.on('kicked', reason => {
    console.log('Bot wurde gekickt:', reason);
  });

  bot.on('error', err => {
    console.log('Bot-Fehler:', err.message);
  });

  bot.on('end', () => {
    console.log('Verbindung beendet. Neuer Versuch in 10 Sekunden...');

    clearTimeout(reconnectTimer);

    reconnectTimer = setTimeout(() => {
      startBot();
    }, 10000);
  });
}

startBot();

process.on('SIGINT', () => {
  if (bot) bot.quit('Bot wird beendet');
  process.exit(0);
});