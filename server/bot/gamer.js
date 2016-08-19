const Promise = require('bluebird');
const request = require('request');

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

  syncNodeBB(gamer) {
    return new Promise((resolve, reject) => {
      let nodeBBUser;
      let updateQuery = {
        discordUserId: gamer.discordUserId
      };

      // Meaning, we already have the required data
      if (gamer.nodeBBUserId) return resolve(gamer);

      this._getNodeBBUID(gamer.username)
        .then((res) => {
          nodeBBUser = res;

          if (!res) return Promise.resolve(false);

          return this._getNodeBBEmail(res.uid);
        })
        .then((res) => {
          return this.db.Gamer.updateAll(updateQuery, {
            email: res.email || null,
            nodeBBUserId: nodeBBUser.uid  || null
          });
        })
        .then(resolve)
        .catch(reject);
    });
  }

  // Uses nodebb-plugin-ns-api to extend the users api to get all user data
  _getNodeBBEmail(uid) {
    return this._nodeBB_GET('http://nodebb.praxusgroup.com/api/v1/users/' + uid);
  }

  _getNodeBBUID(username) {
    return this._nodeBB_GET('http://nodebb.praxusgroup.com/api/user/' + username);
  }

  _nodeBB_GET(url) {
    return new Promise((resolve, reject) => {
      const options = {
        url: url,
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + this.app.datasources.nodebb.settings.token
        }
      };
      let response;

      request(options, (err, res) => {
        if (err) return reject(err);

        if (res.statusCode !== 404) {
          response = JSON.parse(res.body);
        } else {
          response = false;
        }

        resolve(response);
      });
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

  syncGamersRoles(members, roles) {
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

  syncGamersNodeBB(gamers) {
    let sync = [];

    gamers.forEach((gamer) => {
      sync.push(this.syncNodeBB(gamer));
    });

    return Promise.all(sync);
  }
}

module.exports = function(app, bot) {
  return new Gamer(app, bot);
};

