/*global window, app, navigator */
/*jshint bitwise: false*/
'use strict';

import globals from './globals'
import options from './settings/options'
import colors from './settings/colors'
import utilities from './utilities'
import polypoints from './polypoints'
import updateInertia from './inertia'

var appendedBalls = []; // store a reference to all balls in here, so we don't need to query the dom

const INNER_WIDTH = globals.w,
	INNER_HEIGHT = globals.h,
	INNER_WIDTH_HALF = INNER_WIDTH / 2,
	INNER_HEIGHT_HALF = INNER_HEIGHT / 2;

var createCircle = function( i ) {

	var circleObj = {
		id: i,
		fill: colors[Math.floor(Math.random() * colors.length)],
		x: INNER_WIDTH_HALF + Math.random(),
		y: INNER_HEIGHT_HALF + Math.random(),
		vx: 0,
		vy: 0,
		positionX: 0,
		positionY: 0,
		velocityX: 0,
		velocityY: 0,
		mousedownX: 0,
		mousedownY: 0,
		dragStartPositionX: 0,
		dragStartPositionY: 0,
		r: utilities.random(options.MIN_SIZE, options.MAX_SIZE),
		isDragging: false
	};

	globals.ballArr.push(circleObj);

};


var circlePack = function(i, currentBall) {
	// circle packing based on: http://codepen.io/jun-lu/pen/rajrJx

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
		d = (dx * dx) + (dy * dy);

		r = c.r + currentBall.r;
		l = r * r * options.SPREAD_PUSH;

		if (d < l) {

			let f = (1 - d / l) * r;
			let t = Math.atan2(dy, dx);

			// set right edge && left edge boundaries
			let hozBoundary = c.x < INNER_WIDTH - c.r && c.x > c.r;
			let verBoundary = c.y < INNER_HEIGHT - c.r && c.y >c.r;

			// if the ball is over the boundary divide its movement by 100 so it doesn't disappear out of viewport
			c.vx += Math.cos( t ) * f / (hozBoundary ? 1 : 100);
			c.vy += Math.sin( t ) * f / (verBoundary ? 1 : 100);
		}
	}
}

var manageBall = function(i, currentBall) {

	if (!currentBall.added) {
		// CREATE NEW BALL

		currentBall.added = true;

		var gEl = globals.doc.createElementNS('http://www.w3.org/2000/svg', 'g'),
			polyEl = globals.doc.createElementNS('http://www.w3.org/2000/svg', 'polygon');

		polyEl.setAttribute('fill', currentBall.fill);
		polyEl.setAttribute('points', polypoints.getPolyPoints(currentBall.r * options.BALL_ROUGHNESS, currentBall.r));

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

	currentBall.vx *= options.SPREAD_SPEED;
	currentBall.vy *= options.SPREAD_SPEED;

	let roundedY = Math.round((currentBall.y += currentBall.vy) * 100) / 100,
		roundedX = Math.round((currentBall.x += currentBall.vx) * 100) / 100;

	if (!globals.isIE) {
		gEl.style.webkitTransform = 'translate3d(' + roundedX + 'px, ' + roundedY + 'px, 0)';
		gEl.style.transform = 'translate3d(' + roundedX + 'px, ' + roundedY + 'px, 0)';
	} else {
		//http://stackoverflow.com/a/28776528
		gEl.setAttribute('transform', 'translate(' + roundedX + ', ' + roundedY + ')');
	}
}


var renderLoop = function() {

	for (let i = 0; i < globals.ballArr.length; i++) {

		let currentBall = globals.ballArr[i];

		circlePack(i, currentBall)
		manageBall(i, currentBall)

	}

	updateInertia()

	globals.animating = requestAnimationFrame(renderLoop)

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


// generate the balls!
for (let i = 0; i < options.BALL_COUNT; i++) {
	 createCircle(i);
}

startAnimationLoop();
