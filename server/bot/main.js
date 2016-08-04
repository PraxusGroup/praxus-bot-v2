const EventEmitter = require('events');

class Tactical {
  constructor() {
    this.name   = 'Tactical Bot';
    this.events = new EventEmitter();
  }

  start(app, bot) {
    this.app = app;
    this.bot = bot;

    for (const key in this.bot.servers) {
      this.serverId = key;
    }

    if (!this.serverId)
      throw new Error('Unable to connect to server');

    this.server = this.bot.servers[this.serverId];
    
    console.log(this.bot.username + ' - (' + this.bot.id + ')');
    console.log('Connected to server: ', this.bot.servers[this.serverId].name);

    this.gameLogger = require('./gameLogger.js')(app, bot);
    this.gameLogger.initEvents();

    this.game  = require('./game.js')(app, bot);
    this.gamer = require('./gamer.js')(app, bot);
    this.gamer.initEvents();
    this.syncWithDB();
  }

  syncWithDB() {
    this.gamer
      .syncGamers(this.bot.users)
      .then(() => {
        console.log('Finalized: Sync Gamers');

        return this.gamer.syncGamerRoles(this.server.members, this.server.roles);
      })
      .then(() => {
        console.log('Finalized: Sync GamerRoles');
      });
  }
  
}

module.exports = function() {
  return new Tactical();
};