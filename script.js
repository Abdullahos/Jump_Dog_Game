window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1000;
  canvas.height = 720;

  class InputHandler {
    constructor() {
      this.keys = [];

      window.addEventListener("keydown", (e) => {
        if (
          (e.code === "ArrowUp" || e.code === "ArrowDown" || e.code === "Space") &&
          this.keys.indexOf(e.code) === -1
        ) {
          this.keys.push(e.code);
        }
      });

      window.addEventListener("keyup", (e) => {
        if (this.keys.indexOf(e.code) !== -1) {
          this.keys.splice(this.keys.indexOf(e.code), 1);
        }
      });
    }
  }

  class Player {
    PLAYER_IMG_INDICES_LNEGTH = 9;
    MIN_Y_POS = 150;
    constructor(gameWidth, gameHeight, input, enemy) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 200;
      this.height = 200;
      this.x = 0;
      this.y = this.gameHeight - this.height;
      this.prev_y = this.y;
      this.image = document.getElementById("playerImage");
      this.frameX = 0;
      this.frameY = 0;
      this.speed = 1;
      this.vertical_speed = 15;
      this.gravity = 19;
      this.input = input;
      this.enemy = enemy;
      this.INITIAL_Y = this.gameHeight - this.height;
    }

    draw(context) {
      context.drawImage(
        this.image,
        this.frameX,
        this.frameY,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    update_X_Position() {
      this.frameX = this.frameX % 2 == 0 ? (this.frameX + 1) % this.PLAYER_IMG_INDICES_LNEGTH : this.frameX;
      this.cropFrame(this.frameX * this.width, 0);
    }

    update_Y_Position() {
      if (this.y === this.INITIAL_Y) this.prev_y = this.y;
      //jump
      if (
        (input.keys.indexOf("ArrowUp") > -1 ||
        input.keys.indexOf("Space") > -1
        ) &&
        this.prev_y >= this.y &&
        this.y - this.vertical_speed > this.MIN_Y_POS
      ) {
        this.cropFrame(0, 200);
        this.prev_y = this.y;
        this.y = this.y - this.vertical_speed;
      }
      //gravity
      else if (this.y < this.INITIAL_Y) {
        this.fallByGravity();
      }
    }

    fallByGravity() {
      this.cropFrame(400, 0);
      //above reset level with more than the gravity effect
      if (this.y + this.gravity > this.INITIAL_Y) {
        this.y = this.INITIAL_Y;
      } else if (this.y < this.INITIAL_Y) {
        this.y += this.gravity;
      }
      if (this.y === this.INITIAL_Y) {
        this.cropFrame(0, 0);
      }
    }

    cropFrame(x, y) {
      this.frameX = x;
      this.frameY = y;
    }
  }

  class BackgroundImage {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.x = 0;
      this.y = 0;
      this.width = 2400;
      this.height = 720;
      this.speed = 15;
      this.image = document.getElementById("backgroundImage");
    }
    draw(context) {
      context.drawImage(this.image, this.x, this.y);
      context.drawImage(this.image, this.x + this.width - this.speed, this.y);
    }
    update_X_Position() {
      this.x -= this.speed;
      if (this.x <= -this.width) this.x = 0;
    }
  }

  class Enemy {
    constructor(gameWidth, gameHeight, player) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      //dimensions of the enemy
      this.width = 160;
      this.height = 150;
      //start at the botton-right
      this.x = gameWidth - this.width;
      this.y = gameHeight - this.height;
      //indices of the frame
      this.frameX = 0;
      this.frameY = 0;
      //Speed
      this.min = 7;
      this.max = 20;
      this.speed = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
      
      this.image = document.getElementById("enemyImage");
      this.player = player;
    }
    draw(context) {
      context.drawImage(
        this.image,
        this.frameX,
        this.frameY,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    //change move enemy horizontally
    update_X_Position() {
      this.x -= this.speed;
      //pass throw screen(disapeared)
      if (this.x + this.width <= 0) {
        this.x = this.gameWidth;
        this.updateSpeed();
      }
      //random speed of generation enemy
      return this.collaped();
    }

    collaped() {
      return (this.x + this.width >= this.player.x + 50 &&
        this.x <= this.player.x + this.player.width - 50 &&
        this.player.y + this.player.height >= this.y + 100);
    }

    updateSpeed() {
      this.speed = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
    }

  }

  class ImagePrompt {
    constructor(gameWidth, gameHeight, ImageUrl) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
  
      this.width = 420;
      this.height = 420;
      //start at the botton-right
      this.x = (gameWidth / 2 ) - (this.width / 2);
      this.y = (gameHeight / 2) - (this.height / 2);
      //indices of the frame
      this.frameX = 0;
      this.frameY = 0;
    
      this.image = document.getElementById(ImageUrl);
      
    }
    draw(context) {
      context.drawImage(
        this.image,
        this.frameX,
        this.frameY,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }

  let input = new InputHandler();
  let player = new Player(canvas.width, canvas.height, input);
  let background = new BackgroundImage(canvas.width, canvas.height);
  let enemy = new Enemy(canvas.width, canvas.height, player);
  let gameOver = new ImagePrompt(canvas.width, canvas.height, "gameOver");

  function initGame() {
    input = new InputHandler();
    player = new Player(canvas.width, canvas.height, input);
    background = new BackgroundImage(canvas.width, canvas.height);
    enemy = new Enemy(canvas.width, canvas.height, player);
    gameOver = new ImagePrompt(canvas.width, canvas.height, "gameOver");
  }

  let lastTimestamp = 0;
  const targetFPS = 60;
  const frameDuration = 1000 / targetFPS;

  function animate(timestamp) {
    const elapsed = timestamp - lastTimestamp;

    if (elapsed > frameDuration) {
        lastTimestamp = timestamp - (elapsed % frameDuration);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background.draw(ctx);
        background.update_X_Position();

        player.draw(ctx);
        enemy.draw(ctx);

        const collapsed = enemy.update_X_Position();
        if (collapsed) {
          gameOver.draw(ctx);
            initGame();
            return;
        }
        player.update_X_Position();
        player.update_Y_Position();
    }

    animationId = requestAnimationFrame(animate);
}

  initGame();
  animate(0);
});
