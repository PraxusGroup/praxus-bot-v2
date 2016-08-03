const Promise = require('bluebird');

class Gamer {
  constructor(app, bot) {
    this.app = app;
    this.bot = bot;
    this.db  = this.app.models;
  }

  initEvents() {
    this.bot.on('any', function(event) { 
      if (event.d && event.d.user_id) {
        this.bumpLastActivity(event.d.user_id);
      }
    });
  }

  bumpLastActivity(gamerId) {
    let query = {
      discordUserId: gamerId
    };

    return this.db.Gamer.updateAll(query, {
      lastDiscordActivity: new Date()
    });
  }

  findOrCreate(gamer) {
    let query = {
      where: {
        discordUserId: gamer.id
      }
    };

    let newGamer = {
      userName: gamer.username,
      discordUserId: gamer.id,
      discriminator: gamer.discriminator || null,
      discordAvatarURL: gamer.avatar || null,
    };

    return this.db.Gamer.findOrCreate(query, newGamer);
  }

  syncRole(member, roles) {
    let query = {
      discordUserId: member.id
    };

    if (!member.roles.length) return Promise.resolve(member);

    member.roles.forEach((roleId, index) => {
      member.roles[index] = roles[roleId].name;
    });

    return this.db.Gamer.updateAll(query, {
      roles: member.roles,
    });
  }

  syncGamers(users) {
    let sync = [];
    let ids = [];

    for (let gamerId in users) {
      ids.push(gamerId);
    }

    ids.forEach((gamerId) => {
      sync.push(this.findOrCreate(users[gamerId]));
    }); 

    return Promise.all(sync);
  }

  syncGamerRoles(members, roles) {
    let sync = [];
    let ids = [];

    for (let gamerId in members) {
      ids.push(gamerId);
    }

    ids.forEach((gamerId) => {
      sync.push(this.syncRole(members[gamerId], roles));
    });

    return Promise.all(sync);
  }
}

module.exports = function(app, bot) {
  return new Gamer(app, bot);
};

