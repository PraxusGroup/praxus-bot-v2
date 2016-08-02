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
      this.id = key;
    }
    
    console.log(this.bot.username + ' - (' + this.bot.id + ')');
    console.log('connected to: ', this.bot.servers[this.id].name);

    this.gameLogger = require('./gameLogger.js')(app, bot);
    this.gameLogger.initEvents();

    
  }
}

module.exports = function() {
  return new Tactical();
};