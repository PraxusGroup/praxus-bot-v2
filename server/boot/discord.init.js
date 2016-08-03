const Discord  = require('discord.io');
const Tactical = require('../bot/main.js')();

var bot = new Discord.Client({
  token: 'MjA5ODA2OTg3MDg3NTc3MDg5.CoFlew.Wv6ew0gbxVSYcR7Qpxp8P7s1a_U',
  discriminator: 8742,
  autorun: true,
  bot: true
});

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
    Tactical.start(app, bot);
  });
};

