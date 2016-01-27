(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('./src/prototypes');
require('./src/namespace');
require('./src/globals');
require('./src/utilities');
require('./src/polypoints');
require('./src/balls');
require('./src/interaction');
require('./src/resize');
require('./src/src');

},{"./src/balls":2,"./src/globals":3,"./src/interaction":4,"./src/namespace":5,"./src/polypoints":6,"./src/prototypes":7,"./src/resize":8,"./src/src":9,"./src/utilities":10}],2:[function(require,module,exports){
/*global window, app, navigator */
/*jshint bitwise: false*/
'use strict';

var globals = require('./globals');
var utilities = require('./utilities');
var polypoints = require('./polypoints');
var interaction = require('./interaction');

// OPTIONS
var BALL_ROUGHNESS = 0.88,
    // 1 === perfect circle
SPREAD_PUSH = 0.6,
    // how hard the balls push against each other. 1 === neutral
MIN_SIZE = 70,
    MAX_SIZE = 205,
    SPREAD_SPEED = 0.075,
    BALL_COUNT = 5;

var appendedBalls = []; // store a reference to all balls in here, so we don't need to query the dom

//http://www.colourlovers.com/palette/396423/Praise_Certain_Frogs
var ballColors = ['#F4FCE8', // dark blue
'#C3FF68', // green
'#87D69B', // blue
'#4E9689', // metal blue
'#7ED0D6'];

var INNER_WIDTH = window.innerWidth,
    INNER_HEIGHT = window.innerHeight,
    INNER_WIDTH_HALF = INNER_WIDTH / 2,
    INNER_HEIGHT_HALF = INNER_HEIGHT / 2;

var createCircle = function createCircle() {
	var r = arguments.length <= 0 || arguments[0] === undefined ? utilities.random(MIN_SIZE, MAX_SIZE) : arguments[0];
	var fill = arguments.length <= 1 || arguments[1] === undefined ? ballColors[Math.floor(Math.random() * ballColors.length)] : arguments[1];

	var circleObj = {
		fill: fill,
		x: INNER_WIDTH_HALF + Math.random(),
		y: INNER_HEIGHT_HALF + Math.random(),
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

var circlePack = function circlePack(i, currentBall) {
	// circle packing, based off http://codepen.io/jun-lu/pen/rajrJx

	var c = undefined,
	    dx = undefined,
	    dy = undefined,
	    d = undefined,
	    l = undefined,
	    r = undefined;

	for (var j = 0; j < globals.ballArr.length; j++) {

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

			var f = (1 - d / l) * r,
			    t = Math.atan2(dy, dx),
			   

			// set right edge && left edge boundaries
			hozBoundary = c.x < INNER_WIDTH - c.r && c.x > c.r,
			    verBoundary = c.y < INNER_HEIGHT - c.r && c.y > c.r;

			// if the ball is over the boundary divide its movement by 100 so it doesn't disappear out of viewport
			c.vx += Math.cos(t) * f / (hozBoundary ? 1 : 100);
			c.vy += Math.sin(t) * f / (verBoundary ? 1 : 100);
		}
	}
};

var manageBall = function manageBall(i, currentBall) {

	if (!currentBall.added) {
		// CREATE NEW BALL

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

	var roundedY = Math.round((currentBall.y += currentBall.vy) * 100) / 100,
	    roundedX = Math.round((currentBall.x += currentBall.vx) * 100) / 100;

	if (!globals.isIE) {
		gEl.style.webkitTransform = 'translate3d(' + roundedX + 'px, ' + roundedY + 'px, 0)';
		gEl.style.transform = 'translate3d(' + roundedX + 'px, ' + roundedY + 'px, 0)';
	} else {
		//http://stackoverflow.com/a/28776528
		gEl.setAttribute('transform', 'translate(' + roundedX + ', ' + roundedY + ')');
	}
};

var renderLoop = function renderLoop() {

	for (var i = 0; i < globals.ballArr.length; i++) {

		var currentBall = globals.ballArr[i];

		circlePack(i, currentBall);
		manageBall(i, currentBall);
	}

	interaction.updateInertia();

	globals.animating = requestAnimationFrame(renderLoop);
};

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

setTimeout(function () {

	//stopAnimationLoop();

}, 3000);

// generate the balls!
for (var i = 0; i < BALL_COUNT; i++) {
	createCircle();
}

startAnimationLoop();

//module.exports['createCircle'] = createCircle;
//module.exports['renderLoop'] = renderLoop;

},{"./globals":3,"./interaction":4,"./polypoints":6,"./utilities":10}],3:[function(require,module,exports){
"use strict";

var userAgent = navigator.userAgent;
var isIE = userAgent.indexOf("MSIE ") > -1 || userAgent.indexOf("Trident/") > -1;

var globals = {
    doc: document,
    animating: undefined,
    ballArr: [],
    isIE: isIE,
    activeBall: undefined,
    w: window.innerWidth,
    h: window.innerHeight,
    get svgEl() {
        // http://stackoverflow.com/a/4616262
        return this.doc.getElementById('svg-el');
    }
};

module.exports = globals;

},{}],4:[function(require,module,exports){
/*global window, globals.doc, app, navigator */
/*jshint bitwise: false*/

// http://codepen.io/desandro/pen/QbPKEq?editors=001

'use strict';

var globals = require('./globals');
var utilities = require('./utilities');

var cursorPos = [],

// particle properties
velocityX = 0,
    velocityY = 0,
    friction = 0.85,
    isDragging = false,
    mouseBallHeld = '',

//mousedownX,
//mousedownY,

leftBound = 0,
    topBound = 0;

var touchBallsHeld = [];

var heldBalls = [];

var positionX = null,
    positionY = null;
//dragPositionX = positionX,
//dragPositionY = positionY,
//dragStartPositionX,
//dragStartPositionY;

function applyForce(forceX, forceY) {
	velocityX += forceX;
	velocityY += forceY;
}

function applyBoundForce() {
	if (isDragging || positionX < globals.w && positionX > leftBound && positionY < globals.h && positionY > topBound) {
		return;
	}

	// bouncing past bound
	var distanceX = globals.w - positionX,
	    distanceY = globals.h - positionY,
	    forceX = distanceX * 0.1,
	    forceY = distanceY * 0.1,
	    distanceYtop = topBound - positionY,
	    distanceXleft = leftBound - positionX,
	    forceXleft = distanceXleft * 0.1,
	    forceYtop = distanceYtop * 0.1,
	   

	// calculate resting position with this force
	restX = positionX + (velocityX + forceX) / (1 - friction),
	    restY = positionY + (velocityY + forceY) / (1 - friction),
	    restYneg = positionY + (velocityY + forceYtop) / (1 - friction),
	    restXneg = positionX + (velocityX + forceXleft) / (1 - friction);

	// if in bounds, apply force to align at bounds
	if (restX > globals.w) {
		// passes right
		applyForce(forceX, 0);
	} else if (restXneg < leftBound) {
		// passes left
		applyForce(forceXleft, 0);
	} else if (restY > globals.h) {
		// passes bottom
		applyForce(0, forceY);
	} else if (restYneg < topBound) {
		// passes top
		applyForce(0, forceYtop);
	}
}

function applyDragForce() {

	if (!isDragging) {
		return;
	}

	var dragVelocityX = globals.ballArr[mouseBallHeld].x - positionX;
	var dragVelocityY = globals.ballArr[mouseBallHeld].y - positionY;
	var dragForceX = dragVelocityX - velocityX;
	var dragForceY = dragVelocityY - velocityY;

	applyForce(dragForceX, dragForceY);
}

function setDragPosition(e, currentBall) {
	//e.preventDefault();

	if (0) {

		for (var i = 0; i < e.touches.length; i++) {

			console.log(currentBall.id);

			var _moveX = e.touches[i].pageX - currentBall.mousedownX;
			var _moveY = e.touches[i].pageY - currentBall.mousedownY;

			currentBall.dragPositionX = currentBall.dragStartPositionX + _moveX;
			currentBall.dragPositionY = currentBall.dragStartPositionY + _moveY;

			globals.ballArr[currentBall.id].x = currentBall.dragPositionX;
			globals.ballArr[currentBall.id].y = currentBall.dragPositionY;
		}
	} else {
		console.log(e);
		var moveX = e.pageX - currentBall.mousedownX;
		var moveY = e.pageY - currentBall.mousedownY;

		currentBall.dragPositionX = currentBall.dragStartPositionX + moveX;
		currentBall.dragPositionY = currentBall.dragStartPositionY + moveY;

		globals.ballArr[currentBall.id].x = currentBall.dragPositionX;
		globals.ballArr[currentBall.id].y = currentBall.dragPositionY;
	}
}

var updateInertia = function updateInertia() {

	velocityX *= friction;
	velocityY *= friction;

	applyBoundForce();
	applyDragForce();

	positionX += velocityX;
	positionY += velocityY;

	if (mouseBallHeld) {

		globals.ballArr[mouseBallHeld].x = positionX;
		globals.ballArr[mouseBallHeld].y = positionY;
	}
};

var mouse = function mouse() {

	globals.doc.addEventListener('mousedown', function (e) {

		cursorPos = [e.pageX, e.pageY];

		utilities.closest(e.target, function (el) {

			if (el.tagName === 'g') {

				el.setAttribute('class', 'held');

				mouseBallHeld = el.id;
				isDragging = true;

				var newID = parseInt(el.id, 10);

				var _positionX = globals.ballArr[newID].x;
				var _positionY = globals.ballArr[newID].y;

				var newBall = {
					id: newID,
					positionX: _positionX,
					positionY: _positionY,
					mousedownX: e.pageX,
					mousedownY: e.pageY,
					dragStartPositionX: _positionX,
					dragStartPositionY: _positionY
				};

				heldBalls.push(newBall);
			}
		});
	});

	globals.doc.addEventListener('mousemove', function (e) {

		if (isDragging) {

			for (var i = 0; i < heldBalls.length; i++) {

				//console.log('mouse', e)
				setDragPosition(e, heldBalls[i]);
			}
		}
	});

	globals.doc.addEventListener('mouseup', function (e) {

		if (isDragging) {
			// gotta do it this way because user could mouseup on a different element
			// which would wreck the closest loop
			globals.doc.getElementById(mouseBallHeld).setAttribute('class', '');

			isDragging = false;
			//isMousing = false;

			heldBalls = [];

			//globals.doc.removeEventListener( 'mousemove' );
			//globals.doc.removeEventListener( 'mouseup' );
		}
	});
};

var touch = function touch() {

	globals.doc.addEventListener('touchstart', function (e) {
		e.preventDefault();

		utilities.closest(e.target, function (el) {

			if (el.tagName === 'g') {

				el.setAttribute('class', 'held');

				mouseBallHeld = el.id;
				isDragging = true;

				var newID = parseInt(el.id, 10);

				//console.log(e);

				for (var i = 0; i < e.touches.length; i++) {

					var _positionX2 = globals.ballArr[newID].x;
					var _positionY2 = globals.ballArr[newID].y;

					var newBall = {
						id: newID,
						positionX: _positionX2,
						positionY: _positionY2,
						mousedownX: e.touches[i].pageX,
						mousedownY: e.touches[i].pageY,
						dragStartPositionX: _positionX2,
						dragStartPositionY: _positionY2
					};

					heldBalls.push(newBall);
				}

				//globals.ballArr[mouseBallHeld].dragStartPositionX = e.pageX;
				//globals.ballArr[mouseBallHeld].dragStartPositionY = e.pageY;
			}
		});
	});

	globals.doc.addEventListener('touchmove', function (e) {

		e.preventDefault();

		if (isDragging) {

			for (var i = 0; i < e.touches.length; i++) {

				//if (globals.ballArr[heldBalls[i]] === undefined) return; // if you touchmove not on a ball
				setDragPosition(e.touches[i], heldBalls[i]);
			}

			// for (var i = 0; i < e.touches.length; i++) {

			// 	//console.log('touchmove', e.touches[i])
			// 	setDragPosition(e.touches[i], touchBallsHeld[i]);

			// 	//globals.ballArr[touchBallsHeld[i]].x = e.touches[i].pageX;
			// 	//globals.ballArr[touchBallsHeld[i]].y = e.touches[i].pageY;

			// }
		}
	});

	globals.doc.addEventListener('touchend', function (e) {

		isDragging = false;

		// get the 'g' element of the finger which was removed
		utilities.closest(e.changedTouches[0].target, function (el) {

			if (el.tagName === 'g') {

				el.setAttribute('class', '');

				heldBalls = [];

				// let newID = parseInt(el.id, 10);

				// // remove the corresponding ball from the touchBallsHeld array

				// for (let i = 0; i < touchBallsHeld.length; i++) {

				// 	if ( touchBallsHeld[i].id === newID) {

				// 		touchBallsHeld.splice(i, 1)
				// 		console.log(touchBallsHeld)

				// 		//touchBallsHeld.splice(i, 1);
				// 		//console.log('rem', touchBallsHeld)

				// 	}

				// }
			}
		});
	});
};

mouse();
touch();

module.exports['updateInertia'] = updateInertia;

},{"./globals":3,"./utilities":10}],5:[function(require,module,exports){
"use strict";

var app = app || {};

},{}],6:[function(require,module,exports){
/*global window, document, app, navigator */
/*jshint bitwise: false*/

// source:
// http://rectangleworld.com/blog/archives/413

'use strict';

var setLinePoints = function setLinePoints(iterations) {
		var point;
		var pointList = {};
		pointList.first = { x: 0, y: 1 };

		var lastPoint = { x: 1, y: 1 };
		var nextPoint;
		var dx, newX, newY;

		pointList.first.next = lastPoint;

		for (var i = 0; i < iterations; i++) {
				point = pointList.first;

				while (point.next != null) {
						nextPoint = point.next;

						dx = nextPoint.x - point.x;
						newX = 0.5 * (point.x + nextPoint.x);
						newY = 0.5 * (point.y + nextPoint.y);
						newY += dx * (Math.random() * 2 - 1);

						var newPoint = { x: newX, y: newY };

						//put between points
						newPoint.next = nextPoint;
						point.next = newPoint;

						point = nextPoint;
				}
		}

		return pointList;
};

var getPolyPoints = function getPolyPoints(minBallSize, maxBallSize) {
		var point;
		var rad;
		var twoPi = 2 * Math.PI;
		var x0, y0;
		var phase = 0;

		//generate the random function that will be used to vary the radius, 9 iterations of subdivision
		var pointList = setLinePoints(6);

		var coordString = '';

		point = pointList.first;

		while (point.next) {
				point = point.next;
				phase = twoPi * point.x;
				rad = minBallSize + point.y * (maxBallSize - minBallSize);
				x0 = rad * Math.cos(phase);
				y0 = rad * Math.sin(phase);

				coordString = coordString + (Math.round(x0 * 100) / 100 + ',' + Math.round(y0 * 100) / 100 + ' ');
		}

		return coordString;
};

module.exports['setLinePoints'] = setLinePoints;
module.exports['getPolyPoints'] = getPolyPoints;

},{}],7:[function(require,module,exports){
"use strict";

// http://stackoverflow.com/a/31080629
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array) return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length) return false;

    for (var i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i])) return false;
        } else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};

},{}],8:[function(require,module,exports){
/*global window, document, app, navigator */

'use strict';

var globals = require('./globals');
var utilities = require('./utilities');

var ballsBrowserResize = utilities.debounce(function () {

	globals.w = window.innerWidth;
	globals.h = window.innerHeight;

	// need to remove balls if small, add if large

	// reset ball position just like on init
	globals.ballArr.forEach(function (el) {

		el.x = globals.w / 2 + Math.random();
		el.y = globals.h / 2 + Math.random();
	});
}, 500);

window.addEventListener('resize', ballsBrowserResize);

},{"./globals":3,"./utilities":10}],9:[function(require,module,exports){
'use strict';

var globals = require('./globals');

window.onload = function () {
    'use strict';

    globals.doc.documentElement.classList.remove('no-js');

    // initiate FastClick
    //FastClick.attach(document.body);
};

},{"./globals":3}],10:[function(require,module,exports){
/*global window, app, navigator */
/*jshint bitwise: false*/

'use strict';

// http://davidwalsh.name/javascript-debounce-function

var debounce = function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
        args = arguments;
    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

// event delegation
// similar to $.closest
// so we can traverse up the tree for delegation
// http://stackoverflow.com/questions/22100853/dom-pure-javascript-solution-to-jquery-closest-implementation
var closest = function closest(el, fn) {
  return el && (fn(el) ? el : closest(el.parentNode, fn));
};

var random = function random(min, max) {
  return parseInt(Math.random() * (max - min) + min);
};

// http://bl.ocks.org/jebeck/196406a3486985d2b92e
// used for creating the arced text paths
var getPathData = function getPathData(r) {
  r = Math.floor(r * 1.15); // adjust the radius a little so our text's baseline isn't sitting directly on the circle
  var startX = r / 2 - r;
  return 'M' + startX * 2 + ',' + "1" + ' ' + 'a' + r + ',' + r + ' 0 0 0 ' + 2 * r + ',0';
};

module.exports['debounce'] = debounce;
module.exports['closest'] = closest;
module.exports['random'] = random;
module.exports['getPathData'] = getPathData;

},{}]},{},[1]);
