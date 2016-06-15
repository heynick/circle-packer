(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('./src/prototypes');

require('./src/globals');

require('./src/utilities');

require('./src/resize');

require('./src/polypoints');

require('./src/balls');

require('./src/inertia');

require('./src/interaction/touch');

require('./src/interaction/mouse');

},{"./src/balls":2,"./src/globals":3,"./src/inertia":4,"./src/interaction/mouse":10,"./src/interaction/touch":11,"./src/polypoints":12,"./src/prototypes":13,"./src/resize":14,"./src/utilities":18}],2:[function(require,module,exports){
'use strict';

var _globals = require('./globals');

var _globals2 = _interopRequireDefault(_globals);

var _options = require('./settings/options');

var _options2 = _interopRequireDefault(_options);

var _colors = require('./settings/colors');

var _colors2 = _interopRequireDefault(_colors);

var _utilities = require('./utilities');

var _utilities2 = _interopRequireDefault(_utilities);

var _polypoints = require('./polypoints');

var _polypoints2 = _interopRequireDefault(_polypoints);

var _inertia = require('./inertia');

var _inertia2 = _interopRequireDefault(_inertia);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var appendedBalls = []; // store a reference to all balls in here, so we don't need to query the dom

var INNER_WIDTH = _globals2.default.w;
var INNER_HEIGHT = _globals2.default.h;
var INNER_WIDTH_HALF = INNER_WIDTH / 2;
var INNER_HEIGHT_HALF = INNER_HEIGHT / 2;

var createCircle = function createCircle(i) {

	var circleObj = {
		id: i,
		fill: _colors2.default[Math.floor(Math.random() * _colors2.default.length)],
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
		r: _utilities2.default.random(_options2.default.MIN_SIZE, _options2.default.MAX_SIZE),
		isDragging: false
	};

	_globals2.default.ballArr.push(circleObj);
};

var circlePack = function circlePack(i, currentBall) {
	// circle packing based on: http://codepen.io/jun-lu/pen/rajrJx

	var c = void 0,
	    dx = void 0,
	    dy = void 0,
	    d = void 0,
	    l = void 0,
	    r = void 0;

	for (var j = 0; j < _globals2.default.ballArr.length; j++) {

		if (i === j) {
			continue; // skip this loop
		}

		c = _globals2.default.ballArr[j];

		dx = c.x - currentBall.x;
		dy = c.y - currentBall.y;
		d = dx * dx + dy * dy;

		r = c.r + currentBall.r;
		l = r * r * _options2.default.SPREAD_PUSH;

		if (d < l) {

			var f = (_options2.default.attachment - d / l) * r;
			var t = Math.atan2(dy, dx);

			// set right edge && left edge boundaries
			var hozBoundary = c.x < INNER_WIDTH - c.r && c.x > c.r;
			var verBoundary = c.y < INNER_HEIGHT - c.r && c.y > c.r;

			// if the ball is over the boundary divide its movement by 100 so it doesn't disappear out of viewport
			c.vx += Math.cos(t) * f / (hozBoundary ? 1 : 100);
			c.vy += Math.sin(t) * f / (verBoundary ? 1 : 100);
		}
	}
};

var manageBall = function manageBall(i, currentBall) {

	var gEl = void 0;

	if (!currentBall.added) {
		// CREATE NEW BALL

		currentBall.added = true;

		gEl = _globals2.default.doc.createElementNS('http://www.w3.org/2000/svg', 'g');
		var polyEl = _globals2.default.doc.createElementNS('http://www.w3.org/2000/svg', 'polygon');

		polyEl.setAttribute('fill', currentBall.fill);
		polyEl.setAttribute('points', _polypoints2.default.getPolyPoints(currentBall.r * _options2.default.BALL_ROUGHNESS, currentBall.r));

		gEl.id = i;
		gEl.appendChild(polyEl);

		// create a record of appended ball
		appendedBalls.push(gEl);
		// and finally append it into the dom
		_globals2.default.svgEl.appendChild(gEl);
	} else {
		// update existing ball
		gEl = appendedBalls[i];
	}

	currentBall.vx *= _options2.default.SPREAD_SPEED;
	currentBall.vy *= _options2.default.SPREAD_SPEED;

	var roundedY = Math.round((currentBall.y += currentBall.vy) * 100) / 100;
	var roundedX = Math.round((currentBall.x += currentBall.vx) * 100) / 100;

	if (!_globals2.default.isIE) {
		gEl.style.webkitTransform = 'translate3d(' + roundedX + 'px, ' + roundedY + 'px, 0)';
		gEl.style.transform = 'translate3d(' + roundedX + 'px, ' + roundedY + 'px, 0)';
	} else {
		//http://stackoverflow.com/a/28776528
		gEl.setAttribute('transform', 'translate(' + roundedX + ', ' + roundedY + ')');
	}
};

var renderLoop = function renderLoop() {

	for (var i = 0; i < _globals2.default.ballArr.length; i++) {

		var currentBall = _globals2.default.ballArr[i];

		circlePack(i, currentBall);
		manageBall(i, currentBall);
	}

	(0, _inertia2.default)();

	_globals2.default.animating = requestAnimationFrame(renderLoop);
};

function startAnimationLoop() {
	if (!_globals2.default.animating) {
		renderLoop();
	}
}

function stopAnimationLoop() {
	if (_globals2.default.animating) {
		cancelAnimationFrame(_globals2.default.animating);
		_globals2.default.animating = undefined;
	}
}

setTimeout(function () {

	//stopAnimationLoop();

}, 3000);

// generate the balls!
for (var i = 0; i < _options2.default.BALL_COUNT; i++) {
	createCircle(i);
}

startAnimationLoop();

},{"./globals":3,"./inertia":4,"./polypoints":12,"./settings/colors":15,"./settings/options":16,"./utilities":18}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var userAgent = navigator.userAgent;
var isIE = userAgent.indexOf("MSIE ") > -1 || userAgent.indexOf("Trident/") > -1;

exports.default = {
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

},{}],4:[function(require,module,exports){
// inertia physics based on http://codepen.io/desandro/pen/QbPKEq?editors=001

'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {

	_store2.default.heldBalls.forEach(function (i) {

		_globals2.default.ballArr[i].velocityX *= _options2.default.friction;
		_globals2.default.ballArr[i].velocityY *= _options2.default.friction;

		(0, _applyBoundForce2.default)(i);
		(0, _applyDragForce2.default)(i);

		_globals2.default.ballArr[i].positionX += _globals2.default.ballArr[i].velocityX;
		_globals2.default.ballArr[i].positionY += _globals2.default.ballArr[i].velocityY;

		// is infinitesimal
		if (Math.round(Math.abs(_globals2.default.ballArr[i].velocityX) * 100) / 100 === 0 && Math.round(Math.abs(_globals2.default.ballArr[i].velocityY) * 100) / 100 === 0) {

			// only remove if you're not dragging it
			if (_globals2.default.ballArr[i].isDragging === false) {

				//console.log('no inertia, removing')

				var itemToRemove = _store2.default.heldBalls.indexOf(i);

				if (itemToRemove !== -1) {
					_store2.default.heldBalls.splice(itemToRemove, 1);
				}
			}
		} else {
			// this is what actually moves the balls coordinates
			_globals2.default.ballArr[i].x = _globals2.default.ballArr[i].positionX;
			_globals2.default.ballArr[i].y = _globals2.default.ballArr[i].positionY;
		}
	});
};

var _globals = require('./globals');

var _globals2 = _interopRequireDefault(_globals);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _options = require('./settings/options');

var _options2 = _interopRequireDefault(_options);

var _applyDragForce = require('./inertia/applyDragForce');

var _applyDragForce2 = _interopRequireDefault(_applyDragForce);

var _applyBoundForce = require('./inertia/applyBoundForce');

var _applyBoundForce2 = _interopRequireDefault(_applyBoundForce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

// globals.ballArr holds all the ball details, always and forever
// store.heldBalls is an array which should only contain ID, nothing else about the ball

},{"./globals":3,"./inertia/applyBoundForce":5,"./inertia/applyDragForce":6,"./settings/options":16,"./store":17}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = applyBoundForce;

var _globals = require('../globals');

var _globals2 = _interopRequireDefault(_globals);

var _applyForceX = require('./applyForceX');

var _applyForceX2 = _interopRequireDefault(_applyForceX);

var _applyForceY = require('./applyForceY');

var _applyForceY2 = _interopRequireDefault(_applyForceY);

var _options = require('../settings/options');

var _options2 = _interopRequireDefault(_options);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function right(i) {

	var position = _globals2.default.ballArr[i].positionX;

	if (position < _options2.default.rightBound) {
		return;
	}

	var velocity = _globals2.default.ballArr[i].velocityX;
	var distance = _options2.default.rightBound - position;
	var force = distance * 0.1;
	var rest = position + (velocity + force) / (1 - _options2.default.friction);

	// if in bounds, apply force to align at bounds
	if (rest > _options2.default.rightBound) {
		(0, _applyForceX2.default)(force, i);
	} else {
		force = distance * 0.1 - velocity;
		(0, _applyForceX2.default)(force, i);
	}
}

function left(i) {

	var position = _globals2.default.ballArr[i].positionX;

	if (position > _options2.default.leftBound) {
		return;
	}

	var velocity = _globals2.default.ballArr[i].velocityX;
	var distance = _options2.default.leftBound - position;
	var force = distance * 0.1;
	var rest = position + (velocity + force) / (1 - _options2.default.friction);

	if (rest < _options2.default.leftBound) {
		(0, _applyForceX2.default)(force, i);
	} else {
		force = distance * 0.1 - velocity;
		(0, _applyForceX2.default)(force, i);
	}
}

function top(i) {

	var position = _globals2.default.ballArr[i].positionY;

	if (position > _options2.default.topBound) {
		return;
	}

	var velocity = _globals2.default.ballArr[i].velocityY;
	var distance = _options2.default.topBound - position;
	var force = distance * 0.1;
	var rest = position + (velocity + force) / (1 - _options2.default.friction);

	if (rest < _options2.default.topBound) {
		(0, _applyForceY2.default)(force, i);
	} else {
		force = distance * 0.1 - velocity;
		(0, _applyForceY2.default)(force, i);
	}
}

function bottom(i) {

	var position = _globals2.default.ballArr[i].positionY;

	if (position < _options2.default.bottomBound) {
		return;
	}

	var velocity = _globals2.default.ballArr[i].velocityY;
	var distance = _options2.default.bottomBound - position;
	var force = distance * 0.1;
	var rest = position + (velocity + force) / (1 - _options2.default.friction);

	if (rest > _options2.default.bottomBound) {
		(0, _applyForceY2.default)(force, i);
	} else {
		force = distance * 0.1 - velocity;
		(0, _applyForceY2.default)(force, i);
	}
}

function applyBoundForce(i) {

	if (_globals2.default.ballArr[i].isDragging) {
		return;
	}

	left(i);
	right(i);
	top(i);
	bottom(i);
}

},{"../globals":3,"../settings/options":16,"./applyForceX":7,"./applyForceY":8}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = applyDragForce;

var _globals = require('../globals');

var _globals2 = _interopRequireDefault(_globals);

var _applyForceX = require('./applyForceX');

var _applyForceX2 = _interopRequireDefault(_applyForceX);

var _applyForceY = require('./applyForceY');

var _applyForceY2 = _interopRequireDefault(_applyForceY);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function applyDragForce(i) {

	if (!_globals2.default.ballArr[i].isDragging) {
		return;
	}

	var dragVelocityX = _globals2.default.ballArr[i].x - _globals2.default.ballArr[i].positionX;
	var dragVelocityY = _globals2.default.ballArr[i].y - _globals2.default.ballArr[i].positionY;
	var dragForceX = dragVelocityX - _globals2.default.ballArr[i].velocityX;
	var dragForceY = dragVelocityY - _globals2.default.ballArr[i].velocityY;

	(0, _applyForceX2.default)(dragForceX, i);
	(0, _applyForceY2.default)(dragForceY, i);
}

},{"../globals":3,"./applyForceX":7,"./applyForceY":8}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (forceX, i) {
	_globals2.default.ballArr[i].velocityX += forceX;
};

var _globals = require('../globals');

var _globals2 = _interopRequireDefault(_globals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"../globals":3}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (forceY, i) {
	_globals2.default.ballArr[i].velocityY += forceY;
};

var _globals = require('../globals');

var _globals2 = _interopRequireDefault(_globals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"../globals":3}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = setDragPosition;

var _globals = require('../globals');

var _globals2 = _interopRequireDefault(_globals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setDragPosition(e, currentBall) {
    //e.preventDefault();

    // dont move the ball around if inertia is carrying it, only when were dragging
    if (!currentBall.isDragging) {
        return;
    }

    var moveX = e.pageX - currentBall.mousedownX;
    var moveY = e.pageY - currentBall.mousedownY;

    currentBall.dragPositionX = currentBall.dragStartPositionX + moveX;
    currentBall.dragPositionY = currentBall.dragStartPositionY + moveY;

    _globals2.default.ballArr[currentBall.id].x = currentBall.dragPositionX;
    _globals2.default.ballArr[currentBall.id].y = currentBall.dragPositionY;
}

},{"../globals":3}],10:[function(require,module,exports){
'use strict';

var _utilities = require('../utilities');

var _utilities2 = _interopRequireDefault(_utilities);

var _globals = require('../globals');

var _globals2 = _interopRequireDefault(_globals);

var _setDragPosition = require('../inertia/setDragPosition');

var _setDragPosition2 = _interopRequireDefault(_setDragPosition);

var _store = require('../store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_globals2.default.doc.addEventListener('mousedown', function (e) {
	e.preventDefault();

	//store.cursorPos = [e.pageX, e.pageY];

	_utilities2.default.closest(e.target, function (el) {

		if (el.tagName === 'g') {

			el.setAttribute('class', 'held');

			// get the ball id of the one just clicked
			var newID = parseInt(el.id, 10);

			var positionX = _globals2.default.ballArr[newID].x;
			var positionY = _globals2.default.ballArr[newID].y;

			_globals2.default.ballArr[newID].mousedownX = e.pageX;
			_globals2.default.ballArr[newID].mousedownY = e.pageY;
			_globals2.default.ballArr[newID].dragStartPositionX = positionX;
			_globals2.default.ballArr[newID].dragStartPositionY = positionY;
			_globals2.default.ballArr[newID].velocityX = 0;
			_globals2.default.ballArr[newID].velocityY = 0;
			_globals2.default.ballArr[newID].isDragging = true;

			(0, _setDragPosition2.default)(e, _globals2.default.ballArr[newID]);

			_store2.default.heldBalls.push(newID);

			//console.log(globals.ballArr[newID])
		}
	});
});

_globals2.default.doc.addEventListener('mousemove', function (e) {

	if (_store2.default.heldBalls.length) {

		for (var i = 0; i < _store2.default.heldBalls.length; i++) {
			(0, _setDragPosition2.default)(e, _globals2.default.ballArr[_store2.default.heldBalls[i]]);
		}
	}
});

_globals2.default.doc.addEventListener('mouseup', function (e) {

	_utilities2.default.closest(e.target, function (el) {

		if (el.tagName === 'g') {

			el.setAttribute('class', '');

			var newID = parseInt(el.id, 10);

			_globals2.default.ballArr[newID].isDragging = false;
		}
	});
});

},{"../globals":3,"../inertia/setDragPosition":9,"../store":17,"../utilities":18}],11:[function(require,module,exports){
'use strict';

var _utilities = require('../utilities');

var _utilities2 = _interopRequireDefault(_utilities);

var _globals = require('../globals');

var _globals2 = _interopRequireDefault(_globals);

var _setDragPosition = require('../inertia/setDragPosition');

var _setDragPosition2 = _interopRequireDefault(_setDragPosition);

var _store = require('../store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_globals2.default.doc.addEventListener('touchstart', function (e) {
	e.preventDefault();

	_utilities2.default.closest(e.changedTouches[0].target, function (el) {

		if (el.tagName === 'g') {

			var newID = parseInt(el.id, 10);
			var positionX = _globals2.default.ballArr[newID].x;
			var positionY = _globals2.default.ballArr[newID].y;

			_globals2.default.ballArr[newID].mousedownX = e.changedTouches[0].pageX;
			_globals2.default.ballArr[newID].mousedownY = e.changedTouches[0].pageY;
			_globals2.default.ballArr[newID].dragStartPositionX = positionX;
			_globals2.default.ballArr[newID].dragStartPositionY = positionY;
			_globals2.default.ballArr[newID].velocityX = 0;
			_globals2.default.ballArr[newID].velocityY = 0;
			_globals2.default.ballArr[newID].isDragging = true;

			(0, _setDragPosition2.default)(e.changedTouches[0], _globals2.default.ballArr[newID]);
			_store2.default.heldBalls.push(newID);
		}
	});
});

_globals2.default.doc.addEventListener('touchmove', function (e) {
	e.preventDefault();

	if (_store2.default.heldBalls.length) {
		var _loop = function _loop(j) {

			_utilities2.default.closest(e.touches[j].target, function (el) {

				if (el.tagName === 'g') {
					for (var i = 0; i < _store2.default.heldBalls.length; i++) {

						// only move the ball that your fingers touch target is touching. jebus this took a long time.
						if (parseInt(el.id, 10) === _globals2.default.ballArr[_store2.default.heldBalls[i]].id) {
							(0, _setDragPosition2.default)(e.touches[j], _globals2.default.ballArr[_store2.default.heldBalls[i]]);
						}
					}
				}
			});
		};

		// inertia works
		for (var j = 0; j < e.touches.length; j++) {
			_loop(j);
		}
	}
});

_globals2.default.doc.addEventListener('touchend', function (e) {

	// get the <g> element of the finger which was removed
	_utilities2.default.closest(e.changedTouches[0].target, function (el) {

		if (el.tagName === 'g') {

			el.setAttribute('class', '');

			var newID = parseInt(el.id, 10);

			_globals2.default.ballArr[newID].isDragging = false;
		}
	});
});

},{"../globals":3,"../inertia/setDragPosition":9,"../store":17,"../utilities":18}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
'use strict';

var _globals = require('./globals');

var _globals2 = _interopRequireDefault(_globals);

var _utilities = require('./utilities');

var _utilities2 = _interopRequireDefault(_utilities);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ballsBrowserResize = _utilities2.default.debounce(function () {

	_globals2.default.w = window.innerWidth;
	_globals2.default.h = window.innerHeight;

	// TODO: need to remove balls if small, add if large

	// reset ball position just like on init
	_globals2.default.ballArr.forEach(function (el) {

		el.x = _globals2.default.w / 2 + Math.random();
		el.y = _globals2.default.h / 2 + Math.random();
	});
}, 500);

window.addEventListener('resize', ballsBrowserResize);

},{"./globals":3,"./utilities":18}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
//http://www.colourlovers.com/palette/396423/Praise_Certain_Frogs
exports.default = ['#888', '#F4FCE8', // dark blue
'#C3FF68', // green
'#87D69B', // blue
'#4E9689', // metal blue
'#7ED0D6'];

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _globals = require('../globals');

var _globals2 = _interopRequireDefault(_globals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
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
	bottomBound: _globals2.default.h,
	rightBound: _globals2.default.w
};

},{"../globals":3}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

//var cursorPos = [];

exports.default = {
	isDragging: false, // will remove this
	heldBalls: []
};

},{}],18:[function(require,module,exports){
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
