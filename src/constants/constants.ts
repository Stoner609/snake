const CANVAS_SIZE: number[] = [800, 800];

const SNAKE_START: number[][] = [
	[8, 7],
	[8, 8],
];
const APPLE_START: number[] = [8, 3];
const SCALE: number = 40;
const SPEED: number = 300;

type T_DIRECTIONS = {
	[keyboard: string]: number[];
};
const DIRECTIONS: T_DIRECTIONS = {
	ArrowUp: [0, -1], // up
	ArrowDown: [0, 1], // down
	ArrowLeft: [-1, 0], // left
	ArrowRight: [1, 0], // right
};

export { CANVAS_SIZE, SNAKE_START, APPLE_START, SCALE, SPEED, DIRECTIONS };
