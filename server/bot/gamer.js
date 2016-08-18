const Promise = require('bluebird');

class Gamer {
  constructor(app, bot) {
    this.app = app;
    this.bot = bot;
    this.db  = this.app.models;
    this.syncedGamers = [];
  }

  initEvents() {
    this.bot.on('any', (event) => {
      if (event.t === 'GUILD_MEMBER_ADD') return;

      if (event.d && event.d.user_id) {
        this.bumpLastActivity(event.d.user_id);
      }
    });

    // Add new member to server
    this.bot.on('guildMemberAdd', (member, event) => {
      this.syncGamers(this.bot.users);
    });

    // Bumps the bots last activity date to when it was started
    this.bumpLastActivity(this.bot.id);
  }

  bumpLastActivity(gamerId) {
    let query = {
      discordUserId: gamerId
    };

    const now = new Date();

    return this.db.Gamer.updateAll(query, {
      lastDiscordActivity: now,
      lastForgivenTime: now
    });
  }

  create(gamer) {
    let query = {
      where: {
        discordUserId: gamer.id
      }
    };

    let newGamer = {
      username: gamer.username,
      discordUserId: gamer.id,
      discriminator: gamer.discriminator || null,
      discordAvatarURL: gamer.avatar || null,
    };

    if (this.syncedGamers.includes(gamer.id)) {
      return Promise.resolve(newGamer);
    } else {
      this.syncedGamers.push(gamer.id);
    }

    return this.db.Gamer.findOrCreate(query, newGamer);
  }

  findOrCreate(gamer) {
    let query = {
      where: {
        discordUserId: gamer.id
      }
    };

    let newGamer = {
      username: gamer.username,
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

    member.roles.forEach((roleId, index) => {
      member.roles[index] = roles[roleId].name;
    });

    if (!member.roles.length) {
      member.roles.push("Guest");
    }

    return this.db.Gamer.updateAll(query, {
      roles: member.roles
    });
  }

  syncGamers(users) {
    let sync = [];
    let ids = [];

    for (let gamerId in users) {
      ids.push(gamerId);
    }

    ids.forEach((gamerId) => {
      sync.push(this.create(users[gamerId]));
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

