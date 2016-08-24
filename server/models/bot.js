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
};
