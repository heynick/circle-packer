/*global window, globals.doc, app, navigator */
/*jshint bitwise: false*/


// http://codepen.io/desandro/pen/QbPKEq?editors=001

'use strict';

var globals = require('./globals')
var utilities = require('./utilities')

var cursorPos = [],

	// particle properties
	velocityX = 0,
	velocityY = 0,

	friction = 0.85,
	isDragging = false,

	mouseBallHeld = '',

	mousedownX,
	mousedownY,

	leftBound = 0,
	topBound = 0;


var	positionX = null;
var	positionY = null;
var dragPositionX = positionX;
var dragPositionY = positionY;

var dragStartPositionX;
var dragStartPositionY;

function applyForce( forceX, forceY ) {
	velocityX += forceX;
	velocityY += forceY;
}


function applyBoundForce() {
	if ( isDragging || positionX < globals.w && positionX > leftBound && positionY < globals.h && positionY > topBound) {
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
		restX = positionX + ( velocityX + forceX ) / ( 1 - friction ),
		restY = positionY + ( velocityY + forceY ) / ( 1 - friction ),

		restYneg = positionY + ( velocityY + forceYtop ) / ( 1 - friction ),
		restXneg = positionX + ( velocityX + forceXleft ) / ( 1 - friction );

  	// if in bounds, apply force to align at bounds
	if ( restX > globals.w) {
		// passes right
		applyForce( forceX, 0 );
	} else if (restXneg < leftBound) {
		// passes left
		applyForce( forceXleft, 0 );
	} else if (restY > globals.h) {
		// passes bottom
		applyForce( 0, forceY );
	} else if (restYneg < topBound) {
		// passes top
		applyForce( 0, forceYtop );
	}

}

function applyDragForce() {

	if ( !isDragging ) {
		return;
	}

	var dragVelocityX = globals.ballArr[mouseBallHeld].x - positionX;
	var dragVelocityY = globals.ballArr[mouseBallHeld].y - positionY;
	var dragForceX = dragVelocityX - velocityX;
	var dragForceY = dragVelocityY - velocityY;

	applyForce( dragForceX, dragForceY );
}


function setDragPosition( e, currentBall ) {

	var moveX = e.pageX - mousedownX;
	var moveY = e.pageY - mousedownY;
  dragPositionX = dragStartPositionX + moveX;
  dragPositionY = dragStartPositionY + moveY;

	globals.ballArr[currentBall].x = dragPositionX;
	globals.ballArr[currentBall].y = dragPositionY;
  e.preventDefault();

}

var updateInertia = function() {

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




var keys = function() {

	globals.doc.onkeydown = function(e) {
	    e = e || window.event;
	    if (e.keyCode == 27) {

	        setTimeout(function() {
	        	globals.activeBall.classList.remove('active');
	        }, 0)
	    }
	};

};


var mouse = function() {

	globals.doc.addEventListener('mousedown', function(e) {

		cursorPos = [e.pageX, e.pageY];

		utilities.closest(e.target, function(el) {

			if (el.tagName === 'g') {

				el.setAttribute('class', 'held');

				mouseBallHeld = el.id;
				isDragging = true;

				positionX = globals.ballArr[mouseBallHeld].x;
				positionY = globals.ballArr[mouseBallHeld].y;

				mousedownX = e.pageX;
				mousedownY = e.pageY;
				dragStartPositionX = positionX;
				dragStartPositionY = positionY;

				setDragPosition( e, mouseBallHeld );

			}

		});

	});


	globals.doc.addEventListener('mousemove', function(e) {

		if (isDragging) {

			setDragPosition(e, mouseBallHeld);

		}

	});

	globals.doc.addEventListener('mouseup', function(e) {

		if (isDragging) {
			// gotta do it this way because user could mouseup on a different element
			// which would wreck the closest loop
			globals.doc.getElementById(mouseBallHeld).setAttribute('class', '');

			utilities.closest(e.target, function(el) {

				// check whether mouseup occured on an anchor, and whether it clicked
				if (el.tagName === 'a' && [e.pageX, e.pageY].equals(cursorPos)) {

					globals.svgEl.appendChild(el.parentNode);
					globals.activeBall = el;

					//window.cancelAnimationFrame(globals.animating);

					setTimeout(function() {

						//console.log('click');

						el.setAttribute('class', 'active');

					}, 0)

				}

			});

			isDragging = false;


			globals.doc.removeEventListener( 'mousemove' );
			globals.doc.removeEventListener( 'mouseup' );


		}


	});

};


var touch = function() {

	var touchBallsHeld = [];

	globals.doc.addEventListener('touchstart', function(e) {

		utilities.closest(e.target, function(el) {

			if (el.tagName === 'g') {

				el.setAttribute('class', 'held');


				touchBallsHeld.push(el.id);

				mouseBallHeld = el.id;
				isDragging = true;


				globals.ballArr[mouseBallHeld].dragStartPositionX = e.pageX;
				globals.ballArr[mouseBallHeld].dragStartPositionY = e.pageY;

			}

		});
	});

	globals.doc.addEventListener('touchmove', function(e) {

		e.preventDefault();

		if (touchBallsHeld.length) {

			for (var i = 0; i < e.touches.length; i++) {

				if (globals.ballArr[touchBallsHeld[i]] === undefined) return; // if you touchmove not on a ball

				globals.ballArr[touchBallsHeld[i]].x = e.touches[i].pageX;
				globals.ballArr[touchBallsHeld[i]].y = e.touches[i].pageY;

			}

		}


	});



	globals.doc.addEventListener('touchend', function(e) {

		// get the 'g' element of the finger which was removed
		utilities.closest(e.changedTouches[0].target, function(el) {

			if (el.tagName === 'g') {

				el.setAttribute('class', '');

				// remove the corresponding ball from the touchBallsHeld array
				var indexToRemove = touchBallsHeld.indexOf(el.id);
				if (indexToRemove > -1) {
				    touchBallsHeld.splice(indexToRemove, 1);
				}

			}

		});

	});
};


mouse();
touch();
keys();


module.exports['updateInertia'] = updateInertia
