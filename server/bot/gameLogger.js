/* jshint -W079 */
const Promise = require('bluebird');

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
    this.bot.on('presence', (user, userID, status, game) => {
      if (game) {
        let gamer = {
          username: user,
          id: userID
        };

        this.startGame(gamer, game);
      }
    });
  }

  startGame(user, gameStart) {
    return Promise.join(
      this.Gamer.findOrCreate(user),
      this.Game.findOrCreate(gameStart),
      (gamer, game) => {
        this.db.Gamelog
          .create({
            gamerId: gamer[0].id,
            gameId: game[0].id
          });
      }
    );
  }

  checkStartGame(oldUser, newUser) {
    return (oldUser.status === newUser.status) &&
      ((newUser.game && !oldUser.game) || (newUser.game && oldUser.game));
  }
}

module.exports = function(app, bot) {
  return new GameLogger(app, bot);
};

