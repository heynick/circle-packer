/*global window, document, app, navigator */
/*jshint bitwise: false*/

// source:
// http://rectangleworld.com/blog/archives/413

'use strict';

var setLinePoints = function(iterations) {
	var point;
	var pointList = {};
	pointList.first = { x: 0, y: 1};

	var lastPoint = {x: 1, y: 1};
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

			var newPoint = {x: newX, y: newY};


			//put between points
			newPoint.next = nextPoint;
			point.next = newPoint;

			point = nextPoint;
		}
	}

	return pointList;

};


var getPolyPoints = function(minBallSize, maxBallSize) {
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


module.exports['setLinePoints'] = setLinePoints
module.exports['getPolyPoints'] = getPolyPoints
