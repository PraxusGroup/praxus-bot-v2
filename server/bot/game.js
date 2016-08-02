import Promise from 'bluebird';

class Game {
  constructor(app, bot) {
    this.app = app;
    this.bot = bot;
    this.db  = this.app.models;
  }

  findOrCreate(game) {
    console.log(game);
  }
}

module.exports = function(app, bot) {
  return new Game(app, bot);
};

