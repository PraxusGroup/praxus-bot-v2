/* jshint -W079 */
const Promise = require('bluebird');

class Game {
  constructor(app, bot) {
    this.app = app;
    this.bot = bot;
    this.db  = this.app.models;
  }

  findOrCreate(game) {
    let title = this.gameName(game.name);

    let newGame = {
      title: title
    };

    let query = {
      where: newGame
    };

    return this.db.Game.findOrCreate(query, newGame);
  }

  gameName(title) {
    var check = title.toLowerCase();
    
    if (check === 'arma iii'.toLowerCase()) {
      return 'Arma 3';
    } else if (check === 'day z'.toLowerCase()) {
      return 'DayZ';
    } else if (check === 'skyrim'.toLowerCase()) {
      return 'The Elder Scrolls V: Skyrim';
    } else if (check === 'FINAL FANTASY XIV'.toLowerCase()) {
      return 'FINAL FANTASY XIV - A Realm Reborn';
    } else if (check === 'Total War Rome II'.toLowerCase()) {
      return 'Total War: ROME 2';
    } else {
      return title;
    }
  }
}

module.exports = function(app, bot) {
  return new Game(app, bot);
};

