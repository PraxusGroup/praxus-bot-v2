import Promise from 'bluebird';

class GameLogger {
  constructor(app, bot) {
    this.app = app;
    this.bot = bot;
    this.db  = this.app.models;

    this.Gamer = require('./gamer.js')(app, bot);
    this.Game  = require('./game.js')(app, bot);
  }

  initEvents() {
    console.log('Init: GameLogger Events');
    this.bot.on('presence', this.startGame);
  }

  startGame(oldUser, newUser) {
    if (this.checkStartGame(oldUser, newUser)) {
      Promise.join(
        this.Gamer.findOrCreate(newUser),
        this.Game.findOrCreate(newUser.game),
        (gamer, game) => {
          this.db.Gamelog
            .create({
              playedOn: new Date(),
              gameId: game.id,
              gamerId: gamer.id
            });
        }
      );
    }
  }

  checkStartGame(oldUser, newUser) {
    return (oldUser.status === newUser.status) &&
      ((newUser.game && !oldUser.game) || (newUser.game && oldUser.game));
  }
}

module.exports = function(app, bot) {
  return new GameLogger(app, bot);
};

