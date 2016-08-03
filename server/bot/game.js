const Promise = require('bluebird');

class Game {
  constructor(app, bot) {
    this.app = app;
    this.bot = bot;
    this.db  = this.app.models;
  }

  findOrCreate(game) {
    console.log(game);

    let title = this.gameName(game.name);

    let query = {
      where: {
        title: title
      }
    };

    let newGame = {
      title: title
    };

    return this.db.Game.findOrCreate(query, newGame);
  }

  gameName(title) {
    title = title.toLowerCase();
    
    if (title === 'arma iii'.toLowerCase()) {
      return 'Arma 3';
    } else if (title === 'day z'.toLowerCase()) {
      return 'DayZ';
    } else if (title === 'skyrim'.toLowerCase()) {
      return 'The Elder Scrolls V: Skyrim';
    } else if (title === 'FINAL FANTASY XIV'.toLowerCase()) {
      return 'FINAL FANTASY XIV - A Realm Reborn';
    } else if (title === 'Total War Rome II'.toLowerCase()) {
      return 'Total War: ROME 2';
    } else {
      return title;
    }
  }
}

module.exports = function(app, bot) {
  return new Game(app, bot);
};

