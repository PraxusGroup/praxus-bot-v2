module.exports = {
  database: {
    url: process.env.MONGODB_URI,
    name: 'database',
    connector: 'mongodb'
  }
};