import test from 'ava';
import game from '../server/bot/game';

const loopback = require('loopback');
const app = loopback();

test.cb('Test Game Name Service', t => {
  const GameService = game(app);
  
  const name = GameService.gameName('arma iii');

  t.is(name, 'Arma 3');
  t.end();
});