/*global window, app, navigator */
/*jshint bitwise: false*/
'use strict';

var globals = require('./globals')
var utilities = require('./utilities')
var polypoints = require('./polypoints')
var interaction = require('./interaction')


// OPTIONS
const BALL_ROUGHNESS = 0.88, // 1 === perfect circle
			SPREAD_PUSH = 0.6, // how hard the balls push against each other. 1 === neutral
			MIN_SIZE = 70,
			MAX_SIZE = 205,
			SPREAD_SPEED = 0.075,
			BALL_COUNT = 10;

var appendedBalls = []; // store a reference to all balls in here, so we don't need to query the dom

//http://www.colourlovers.com/palette/396423/Praise_Certain_Frogs
var ballColors = [
	'#F4FCE8', // dark blue
	'#C3FF68', // green
	'#87D69B', // blue
	'#4E9689', // metal blue
	'#7ED0D6'
];

var innerWidth = window.innerWidth,
		innerHeight = window.innerHeight,
		innerWidthHalf = innerWidth / 2,
		innerHeightHalf = innerHeight / 2;

var createCircle = function(r = utilities.random(MIN_SIZE, MAX_SIZE), fill =  ballColors[Math.floor(Math.random() * ballColors.length)]) {

	var circleObj = {
		fill: fill,
		x: innerWidthHalf + Math.random(),
		y: innerHeightHalf + Math.random(),
		vx: 0,
		vy: 0,
		// positionX: 0,
		// positionY: 0,
		// dragVelocityX: 0,
		// dragVelocityY: 0,
		// dragForceY: 0,
		// dragForceX: 0,
		// velocityX: 0,
		// velocityY: 0,
		// dragStartPositionX: 0,
		// dragStartPositionY: 0,
		r: r
	};

	globals.ballArr.push(circleObj);

};


var circlePack = function(i, currentBall) {
	// circle packing, based off http://codepen.io/jun-lu/pen/rajrJx

	let c,
			dx,
			dy,
			d,
			l,
			r;

	for (let j = 0; j < globals.ballArr.length; j++) {

		if (i === j) {
			continue; // skip this loop
		}

		c = globals.ballArr[j];

		dx = c.x - currentBall.x;
		dy = c.y - currentBall.y;
		d = dx * dx + dy * dy;

		r = c.r + currentBall.r;
		l = r * r * SPREAD_PUSH;

		if (d < l) {

			let f = (1 - d / l) * r;
			let t = Math.atan2(dy, dx);

			// set right edge && left edge boundaries
			let hozBoundary = c.x + 20 < innerWidth - c.r && c.x > 20 + c.r, // 20 get away from edges in case text goes over boundary
					verBoundary = c.y + 60 < innerHeight - c.r && c.y > 0 + c.r; // +60 to keep some spacing at bottom for label to hang

			// if the ball is over the boundary divide its movement by 100 so it doesn't disappear out of viewport
			c.vx += Math.cos( t ) * f / (hozBoundary ? 1 : 100);
			c.vy += Math.sin( t ) * f / (verBoundary ? 1 : 100);

		}

	}
}

var manageBall = function(i, currentBall) {
	// CREATE NEW BALL
	if (!currentBall.added) {

		currentBall.added = true;

		var gEl = globals.doc.createElementNS('http://www.w3.org/2000/svg', 'g'),
				polyEl = globals.doc.createElementNS('http://www.w3.org/2000/svg', 'polygon');

		polyEl.setAttribute('fill', currentBall.fill);
		polyEl.setAttribute('points', polypoints.getPolyPoints(currentBall.r * BALL_ROUGHNESS, currentBall.r));

		gEl.id = i;
		gEl.appendChild(polyEl);

		// create a record of appended ball
		appendedBalls.push(gEl);
		// and finally append it into the dom
		globals.svgEl.appendChild(gEl);


	} else {
		// update existing ball
		var gEl = appendedBalls[i];
	}

	currentBall.vx *= SPREAD_SPEED;
	currentBall.vy *= SPREAD_SPEED;

	let roundedY = Math.round((currentBall.y += currentBall.vy) * 100) / 100,
			roundedX = Math.round((currentBall.x += currentBall.vx) * 100) / 100;

	//http://stackoverflow.com/a/28776528
	if (utilities.isIE()) {
		gEl.setAttribute('transform', 'translate(' + roundedX + ', ' + roundedY + ')');
	} else {
		gEl.style.webkitTransform = 'translate3d(' + roundedX + 'px, ' + roundedY + 'px, 0)';
		gEl.style.transform = 'translate3d(' + roundedX + 'px, ' + roundedY + 'px, 0)';
	}
}


var renderLoop = function() {

	for (let i = 0; i < globals.ballArr.length; i++) {

		let currentBall = globals.ballArr[i];
		circlePack(i, currentBall)
		manageBall(i, currentBall)

	}

	interaction.updateInertia();

	globals.animating = requestAnimationFrame(renderLoop);

}


function startAnimationLoop() {
	if (!globals.animating) {
		renderLoop();
	}
}


function stopAnimationLoop() {
	if (globals.animating) {
		cancelAnimationFrame(globals.animating);
		globals.animating = undefined;
	}
}



setTimeout(function() {

	//stopAnimationLoop();

}, 3000);


for (let i = 0; i < BALL_COUNT; i++) {
	 createCircle();
}

startAnimationLoop();


//module.exports['createCircle'] = createCircle;
//module.exports['renderLoop'] = renderLoop;
