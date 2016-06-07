import globals from '../globals';

export default {
	BALL_ROUGHNESS: 0.88, // 1:== perfect circle
	SPREAD_PUSH: 0.6, // how hard the balls push against each other. 1:== neutral
	MIN_SIZE: 90,
	MAX_SIZE: 140,
	SPREAD_SPEED: 0.075, // how fast they initially push
	BALL_COUNT: 8,
	friction: 0.95, // for inertia
	topBound: 0,
	leftBound: 0,
	bottomBound: globals.h,
	rightBound: globals.w
}
