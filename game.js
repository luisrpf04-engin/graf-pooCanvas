// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Clase Ball (Pelota)
class Ball {
    constructor(x, y, radius, speedX, speedY, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Colisión con arriba y abajo
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
            this.speedY = -this.speedY;
        }
    }

    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = -this.speedX;
    }
}

// Clase Paddle (Paleta)
class Paddle {
    constructor(x, y, width, height, color, isPlayerControlled = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.isPlayerControlled = isPlayerControlled;
        this.speed = 6;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(direction) {
        if (direction === 'up' && this.y > 0) {
            this.y -= this.speed;
        } else if (direction === 'down' && this.y + this.height < canvas.height) {
            this.y += this.speed;
        }
    }

    // IA para la paleta de la CPU
    autoMove(ball) {
        if (ball.y < this.y + this.height / 2) {
            this.y -= this.speed;
        } else if (ball.y > this.y + this.height / 2) {
            this.y += this.speed;
        }
    }
}

// Clase Game
class Game {
    constructor() {

        // Crear 5 pelotas diferentes
        this.balls = [
            new Ball(canvas.width/2, canvas.height/2, 10, 4, 4, "white"),
            new Ball(canvas.width/2, canvas.height/2, 8, 3, 5, "yellow"),
            new Ball(canvas.width/2, canvas.height/2, 12, 5, 3, "cyan"),
            new Ball(canvas.width/2, canvas.height/2, 6, 6, 2, "orange"),
            new Ball(canvas.width/2, canvas.height/2, 14, 2, 4, "lime")
        ];

        // Paleta jugador (doble de alto)
        this.paddle1 = new Paddle(
            0,
            canvas.height / 2 - 100,
            10,
            200,
            "blue",
            true
        );

        // Paleta CPU
        this.paddle2 = new Paddle(
            canvas.width - 10,
            canvas.height / 2 - 50,
            10,
            100,
            "red"
        );

        this.keys = {};
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar pelotas
        this.balls.forEach(ball => ball.draw());

        // Dibujar paletas
        this.paddle1.draw();
        this.paddle2.draw();
    }

    update() {

        // Movimiento de todas las pelotas
        this.balls.forEach(ball => {

            ball.move();

            // Colisión con paleta jugador
            if (
                ball.x - ball.radius <= this.paddle1.x + this.paddle1.width &&
                ball.y >= this.paddle1.y &&
                ball.y <= this.paddle1.y + this.paddle1.height
            ) {
                ball.speedX = -ball.speedX;
            }

            // Colisión con paleta CPU
            if (
                ball.x + ball.radius >= this.paddle2.x &&
                ball.y >= this.paddle2.y &&
                ball.y <= this.paddle2.y + this.paddle2.height
            ) {
                ball.speedX = -ball.speedX;
            }

            // Punto marcado
            if (
                ball.x - ball.radius <= 0 ||
                ball.x + ball.radius >= canvas.width
            ) {
                ball.reset();
            }

        });

        // Movimiento del jugador
        if (this.keys["ArrowUp"]) {
            this.paddle1.move("up");
        }

        if (this.keys["ArrowDown"]) {
            this.paddle1.move("down");
        }

        // IA CPU sigue la primera pelota
        this.paddle2.autoMove(this.balls[0]);
    }

    handleInput() {
        window.addEventListener("keydown", (event) => {
            this.keys[event.key] = true;
        });

        window.addEventListener("keyup", (event) => {
            this.keys[event.key] = false;
        });
    }

    run() {

        this.handleInput();

        const gameLoop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(gameLoop);
        };

        gameLoop();
    }
}

// Iniciar juego
const game = new Game();
game.run();