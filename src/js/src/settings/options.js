import globals from '../globals';

export default {
	BALL_ROUGHNESS: 0.82, // 1:== perfect circle
	SPREAD_PUSH: 5, // how hard the balls push against each other. 1:== neutral
	MIN_SIZE: 80,
	MAX_SIZE: 140,
	attachment: 0.5,
	SPREAD_SPEED: 0.02, // how fast react to each other
	BALL_COUNT: 10,
	friction: 0.95, // for inertia
	topBound: 0,
	leftBound: 0,
	bottomBound: globals.h,
	rightBound: globals.w
}
