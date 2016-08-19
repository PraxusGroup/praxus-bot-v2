const Discord  = require('discord.io');
const Tactical = require('../bot/main.js')();

var readyState = {
  app: false,
  bot: false,
};

function initBot(cb) {
  const id = setInterval(() => {
    if (readyState.app && readyState.bot) {
      clearInterval(id);
      cb();
    }
  }, 100);
}

module.exports = function(app) {

  const bot = new Discord.Client({
    token: app.datasources.discord.settings.token,
    discriminator: 8742,
    autorun: true,
    bot: true
  });

  app.on('started', () => {
    readyState.app = true;
  });

  bot.on('ready', (event) => {
    readyState.bot = true;
  });

  bot.on('message', (user, userID, channelID, message, event) => {
    if (message === '!ping') {
      bot.sendMessage({
        to: channelID,
        message: 'pong'
      });
    }
  });

  initBot(() => {
    app.discordBot = Tactical.start(app, bot);
  });
};

