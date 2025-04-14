import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

let player = null;
const opponents = {};
const collectibles = {};

socket.on('connect', () => {
  player = new Player({ x: 0, y: 0, score: 0, id: socket.id });
  socket.emit('newPlayer', { x: player.x, y: player.y, score: player.score, id: player.id });
});

socket.on('currentPlayers', serverPlayers => {
  Object.keys(serverPlayers).forEach(id => {
    const p = serverPlayers[id];
    if (id === socket.id) {
      player.x = p.x;
      player.y = p.y;
      player.score = p.score;
    } else {
      opponents[id] = new Player(p);
    }
  });
});

socket.on('newPlayer', p => {
  opponents[p.id] = new Player(p);
});

socket.on('playerMoved', p => {
  if (opponents[p.id]) {
    opponents[p.id].x = p.x;
    opponents[p.id].y = p.y;
    opponents[p.id].score = p.score;
  }
});

socket.on('playerDisconnected', id => {
  delete opponents[id];
});

socket.on('collectibleSpawned', data => {
  collectibles[data.id] = new Collectible(data);
});

socket.on('collectibleCollected', ({ id: cid, playerId, newScore }) => {
  delete collectibles[cid];
  if (playerId === player.id) {
    player.score = newScore;
  } else if (opponents[playerId]) {
    opponents[playerId].score = newScore;
  }
});

document.addEventListener('keydown', ({ key }) => {
  let dir = null;
  if (key === 'w' || key === 'ArrowUp') dir = 'up';
  if (key === 's' || key === 'ArrowDown') dir = 'down';
  if (key === 'a' || key === 'ArrowLeft') dir = 'left';
  if (key === 'd' || key === 'ArrowRight') dir = 'right';
  if (dir && player) {
    player.movePlayer(dir, 5);
    socket.emit('playerMoved', { x: player.x, y: player.y, score: player.score, id: player.id });
  }
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  Object.values(collectibles).forEach(c => {
    ctx.fillStyle = c.color;
    ctx.fillRect(c.x, c.y, c.width, c.height);

    if (player && player.collision(c)) {
      socket.emit('collectibleCollected', c.id);
    }
  });

  if (player) {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }

  Object.values(opponents).forEach(o => {
    ctx.fillStyle = o.color;
    ctx.fillRect(o.x, o.y, o.width, o.height);
  });

  requestAnimationFrame(gameLoop);
}

gameLoop();
