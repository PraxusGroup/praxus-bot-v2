module.exports = {
  database: {
    url: process.env.MONGODB_URI,
    name: 'database',
    connector: 'mongodb'
  },
  discord: {
    token: process.env.DISCORD_TOKEN,
    name: 'discord',
    connector: 'memory'
  },
  nodebb: {
    token: process.env.NODEBB_TOKEN,
    name: 'nodebb',
    connector: 'memory'
  },
  raygun: {
    token: process.env.RAYGUN_APIKEY,
    name: 'raygun',
    connector: 'memory'
  }
};