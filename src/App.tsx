import React, { useState, useRef, useEffect } from "react";
import { useInterval } from "./hooks/useInterval";
import {
	CANVAS_SIZE,
	SNAKE_START,
	APPLE_START,
	SCALE,
	SPEED,
	DIRECTIONS,
} from "./constants/constants";

import "./App.css";

const App = () => {
	const game = useRef<HTMLDivElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [snake, setSnake] = useState(SNAKE_START);
	const [apple, setApple] = useState(APPLE_START);
	const [arrow, setArrow] = useState<string>("ArrowUp");
	const [dir, setDir] = useState([0, -1]);
	const [speed, setSpeed] = useState<number | null>(null);
	const [gameOver, setGameOver] = useState(false);

	const startGame = () => {
		setSnake(SNAKE_START);
		setApple(APPLE_START);
		setDir([0, -1]);
		setSpeed(SPEED);
		setGameOver(false);

		game.current?.focus();
	};

	const endGame = () => {
		setSpeed(null);
		setGameOver(true);
	};

	const moveSnake = (e: React.KeyboardEvent<Element>) => {
		if (
			e.code !== "ArrowUp" &&
			e.code !== "ArrowDown" &&
			e.code !== "ArrowLeft" &&
			e.code !== "ArrowRight"
		)
			return;
		if (arrow === "ArrowUp" && e.code === "ArrowDown") return;
		if (arrow === "ArrowDown" && e.code === "ArrowUp") return;
		if (arrow === "ArrowLeft" && e.code === "ArrowRight") return;
		if (arrow === "ArrowRight" && e.code === "ArrowLeft") return;
		setArrow(e.code);
		setDir(DIRECTIONS[e.code]);
	};

	const createApple = () => {
		return apple.map((_a, i) =>
			Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE))
		);
	};

	const checkCollision = (piece: number[], snk = snake) => {
		if (
			piece[0] * SCALE >= CANVAS_SIZE[0] ||
			piece[0] < 0 ||
			piece[1] * SCALE >= CANVAS_SIZE[1] ||
			piece[1] < 0
		) {
			return true;
		}

		// 用極快的速度切換兩個按鍵時有可能發生的情況
		if (piece[0] === snk[1][0] && piece[1] === snk[1][1]) return false;

		// 碰觸到自己
		for (const segment of snk) {
			if (piece[0] === segment[0] && piece[1] === segment[1]) {
				return true;
			}
		}

		return false;
	};

	const checkAppleCollision = (newSnake: number[][]) => {
		if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
			let newApple = createApple();

			// 假如是在身體裡面產生的就要在產一次新的蘋果
			while (checkCollision(newApple, newSnake)) {
				newApple = createApple();
			}
			setApple(newApple);
			return true;
		}
		return false;
	};

	const gameLoop = () => {
		const snakeCopy = JSON.parse(JSON.stringify(snake));
		const newSnakeHead = [
			snakeCopy[0][0] + dir[0],
			snakeCopy[0][1] + dir[1],
		];
		snakeCopy.unshift(newSnakeHead);
		if (checkCollision(newSnakeHead)) endGame();
		if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
		setSnake(snakeCopy);
	};

	useEffect(() => {
		if (canvasRef.current) {
			let ctx = canvasRef?.current?.getContext?.(
				"2d"
			) as CanvasRenderingContext2D;
			ctx?.setTransform(SCALE, 0, 0, SCALE, 0, 0);
			ctx?.clearRect(0, 0, CANVAS_SIZE[0], CANVAS_SIZE[1]);
			ctx.fillStyle = "pink";
			snake.forEach(([x, y]) => ctx?.fillRect(x, y, 1, 1));
			ctx.fillStyle = "lightblue";
			ctx?.fillRect(apple[0], apple[1], 1, 1);
		}
	}, [snake, apple, gameOver]);

	useEffect(() => {
		let _speed = speed;
		console.log(_speed);
		const timer = setInterval(() => {
			if (_speed !== null) {
				setSpeed(_speed - 10);
			}
		}, 1000);

		if (_speed === 50) {
			clearInterval(timer);
		}

		return () => {
			clearInterval(timer);
		};
	}, [speed, setSpeed]);

	useInterval(gameLoop, speed);

	return (
		<div
			ref={game}
			className="container"
			role="button"
			tabIndex={0}
			onKeyDown={(e: React.KeyboardEvent<Element>) => moveSnake(e)}
		>
			<canvas
				style={{
					border: "1px solid black",
				}}
				ref={canvasRef}
				width={`${CANVAS_SIZE[0]}px`}
				height={`${CANVAS_SIZE[1]}px`}
			/>
			{gameOver && <GameOverText />}
			{!speed && <StartGameButton startGame={startGame} />}
		</div>
	);
};

const GameOverText = () => (
	<div className="backdrop">
		<div className="game_over">Game Over</div>
	</div>
);

const StartGameButton = ({ startGame = () => {} }) => (
	<div className="backdrop">
		<button onClick={startGame}>Start Game</button>
	</div>
);

export default App;
