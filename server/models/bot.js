const _ = require('lodash');

module.exports = function(Bot) {

  Bot.removeRole = function(discordId, next) {
    

    next(null, {});
  };

  Bot.remoteMethod(
    'removeRole',
    {
      http: { path: '/remove-role/:discordId', verb: 'delete' },
      accepts: [
        { arg: 'discordId', type: 'string', required: true }
      ],
      returns: { arg: 'gamer', type: 'object' }
    }
  );

  Bot.topGames = function (next) {
    const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;

    const Gamelog   = Bot.app.models.Gamelog;
    const Gamer     = Bot.app.models.Gamer;
    const Game      = Bot.app.models.Game;

    let gameLogList;
    let gamerList;
    let gameList;
    let topGamesList;

    Gamelog
      .find({
        where: {
          playedOn: {gt: Date.now() - ONE_MONTH}
        }
      })
      .then((gamelogs) => {
        gameLogList = gamelogs;

        return Game.find();
      })
      .then((games) => {
        gameList = games;

        return Gamer.find();
      })
      .then((gamers) =>{
        gamerList = gamers;

        let result = _.chain(gameLogList)
          .groupBy('gameId')
          .toPairs()
          .map(function(currentItem) {
            return _.zipObject(['gameId', 'logs'], currentItem);
          })
          .value();

        let resultList = [];

        for (let i = 0; i < result.length; i++) {
          result[i].title = findGameName(result[i].gameId);
        }

        for (let i = 0; i < result.length; i++) {
          result[i].gamers = sortByGamer(result[i].logs);
          delete result[i].logs;
        }

        for (let i = 0; i < result.length; i++) {
          result[i].count = result[i].gamers.length;
        }

        for (let i = 0; i < result.length; i++) {
          if (result[i].count > 5)
            resultList.push(result[i]);
        }
        
        next(null, resultList);
      })
      .catch(next);

    function sortByGamer(logList) {
      let result =_.chain(logList)
        .groupBy('gamerId')
        .toPairs()
        .map((currentItem) => {
          return _.zipObject(['gamerId', 'logs'], currentItem);
        })
        .value();
        
      for (let i = 0; i < result.length; i++) {
        result[i].username = findGamerName(result[i].gamerId);
        result[i].count = result[i].logs.length;
        delete result[i].logs;
      }

      return result;
    }

    function findGamerName(gamerId) {
      return gamerList.filter((gamer) => {
        return gamer.id.toString() === gamerId;
      })[0].username;
    }

    function findGameName(gameId) {
      return gameList.filter((game) => {
        return game.id.toString() === gameId;
      })[0].title;
    }
  };

  Bot.remoteMethod(
    'topGames',
    {
      http: { path: '/topGames', verb: 'get' },
      returns: { arg: 'data', type: 'object' }
    }
  );
};
