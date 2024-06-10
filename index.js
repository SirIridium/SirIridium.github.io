/*import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { availableParallelism } from 'node:os';
import cluster from 'node:cluster';
import { createAdapter, setupPrimary } from '@socket.io/cluster-adapter';

if (cluster.isPrimary) {
  const numCPUs = availableParallelism();
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({
      PORT: 3000 + i
    });
  }

  setupPrimary();
} else {
  const db = await open({
    filename: 'chat.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
    
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_offset TEXT UNIQUE,
      content TEXT
    );
  `);

  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {},
    adapter: createAdapter()
  });

  const __dirname = dirname(fileURLToPath(import.meta.url));

  app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
  });

    io.on('connection', (socket) => {
      socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
      });
    });
    
  io.on('connection', async (socket) => {
    socket.on('chat message', async (msg, clientOffset, callback) => {
      let result;
      try {
        result = await db.run('INSERT INTO messages (content, client_offset) VALUES (?, ?)', msg, clientOffset);
      } catch (e) {
        if (e.errno === 19 /* SQLITE_CONSTRAINT  ) {
          callback();
        } else {
          // nothing to do, just let the client retry
        }
        return;
      }
      io.emit('chat message', msg, result.lastID);
      callback();
    });

    if (!socket.recovered) {
      try {
        await db.each('SELECT id, content FROM messages WHERE id > ?',
          [socket.handshake.auth.serverOffset || 0],
          (_err, row) => {
            socket.emit('chat message', row.content, row.id);
          }
        )
      } catch (e) {
        // something went wrong
      }
    }
  });

  const port = process.env.PORT;

  server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
  });
}
*/

// Snake class
class Snake {
  constructor() {
    this.body = [{ x: 10, y: 10 }];
    this.direction = "right";
  }

  move() {
    const head = { ...this.body[0] };
    switch (this.direction) {
      case "up":
        head.y -= 1;
        break;
      case "down":
        head.y += 1;
        break;
      case "left":
        head.x -= 1;
        break;
      case "right":
        head.x += 1;
        break;
    }
    this.body.unshift(head);
  }

  grow() {
    // Increase the length of the snake
    // Add a new segment to the end of the snake's body
    const tail = { ...this.body[this.body.length - 1] };
    this.body.push(tail);
  }

  draw() {
    // Draw the snake on the canvas
    ctx.fillStyle = "green";
    this.body.forEach((segment) => {
      ctx.fillRect(segment.x * 10, segment.y * 10, 10, 10);
    });
  }

  checkCollision() {
    // Check if the snake collides with walls or itself
    const head = this.body[0];
    if (
      head.x < 0 ||
      head.x >= canvas.width / 10 ||
      head.y < 0 ||
      head.y >= canvas.height / 10
    ) {
      return true; // Collision with wall
    }
    for (let i = 1; i < this.body.length; i++) {
      if (head.x === this.body[i].x && head.y === this.body[i].y) {
        return true; // Collision with itself
      }
    }
    return false;
  }
}

// Food class
class Food {
  constructor() {
    this.position = { x: 0, y: 0 };
  }

  generate() {
    // Generate new food at a random position on the canvas
    this.position.x = Math.floor(Math.random() * (canvas.width / 10));
    this.position.y = Math.floor(Math.random() * (canvas.height / 10));
  }

  draw() {
    // Draw the food on the canvas
    ctx.fillStyle = "red";
    ctx.fillRect(this.position.x * 10, this.position.y * 10, 10, 10);
  }
}

// Game loop
function gameLoop() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move the snake
  snake.move();

  // Check for collision
  if (snake.checkCollision()) {
    // End the game
    alert("Game Over!");
    return;
  }

  // Check if the snake eats the food
  const head = snake.body[0];
  if (head.x === food.position.x && head.y === food.position.y) {
    snake.grow();
    food.generate();
  }

  // Render game
  snake.draw();
  food.draw();

  // Repeat
  requestAnimationFrame(gameLoop);
}

// Initialize game
const snake = new Snake();
const food = new Food();
food.generate();
gameLoop();

// Keyboard input
document.addEventListener("keydown", (event) => {
  const key = event.key;
  if (key === "ArrowUp" && snake.direction !== "down") {
    snake.direction = "up";
  } else if (key === "ArrowDown" && snake.direction !== "up") {
    snake.direction = "down";
  } else if (key === "ArrowLeft" && snake.direction !== "right") {
    snake.direction = "left";
  } else if (key === "ArrowRight" && snake.direction !== "left") {
    snake.direction = "right";
  }
});
