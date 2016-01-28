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

	mouseBallHeld = {},

	//mousedownX,
	//mousedownY,

	leftBound = 0,
	topBound = 0;


var heldBalls = [];




// // function applyForce( forceX, forceY ) {
// 	velocityX += dragForceX;
// 	velocityY += dragForceY;
// // }

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

	//console.log(mouseBallHeld)

	let dragVelocityX = globals.ballArr[mouseBallHeld.id].x - mouseBallHeld.positionX;
	let dragVelocityY = globals.ballArr[mouseBallHeld.id].y - mouseBallHeld.positionY;
	let dragForceX = dragVelocityX - mouseBallHeld.velocityX;
	let dragForceY = dragVelocityY - mouseBallHeld.velocityY;


	mouseBallHeld.velocityX += dragForceX;
	mouseBallHeld.velocityY += dragForceY;

	//applyForce( dragForceX, dragForceY );

}


function setDragPosition( e, currentBall ) {
  	//e.preventDefault();


	var moveX = e.pageX - currentBall.mousedownX;
	var moveY = e.pageY - currentBall.mousedownY;

  	currentBall.dragPositionX = currentBall.dragStartPositionX + moveX;
  	currentBall.dragPositionY = currentBall.dragStartPositionY + moveY;

	globals.ballArr[currentBall.id].x = currentBall.dragPositionX;
	globals.ballArr[currentBall.id].y = currentBall.dragPositionY;


}

var updateInertia = function() {

	mouseBallHeld.velocityX *= friction;
	mouseBallHeld.velocityY *= friction;

	//applyBoundForce();
	applyDragForce();

	mouseBallHeld.positionX += mouseBallHeld.velocityX;
	mouseBallHeld.positionY += mouseBallHeld.velocityY;

	if (globals.ballArr[mouseBallHeld.id]) {


		globals.ballArr[mouseBallHeld.id].x = mouseBallHeld.positionX;
		globals.ballArr[mouseBallHeld.id].y = mouseBallHeld.positionY;

	}

};



var mouse = function() {

	globals.doc.addEventListener('mousedown', function(e) {

		cursorPos = [e.pageX, e.pageY];

		utilities.closest(e.target, function(el) {

			if (el.tagName === 'g') {

				el.setAttribute('class', 'held');

				isDragging = true;

				let newID = parseInt(el.id, 10);

				let positionX = globals.ballArr[newID].x;
				let positionY = globals.ballArr[newID].y;

				let newBall = {
					id: newID,
					positionX: positionX,
					positionY: positionY,
					mousedownX: e.pageX,
					mousedownY: e.pageY,
					dragStartPositionX: positionX,
					dragStartPositionY: positionY,
					velocityX: 0,
					velocityY: 0

				}

				mouseBallHeld = newBall;

				heldBalls.push(newBall);


			}

		});

	});


	globals.doc.addEventListener('mousemove', function(e) {

		if (isDragging) {

			for (var i = 0; i < heldBalls.length; i++) {

				//console.log('mouse', e)
				setDragPosition(e, heldBalls[i]);

			}

		}
	});

	globals.doc.addEventListener('mouseup', function(e) {


		utilities.closest(e.target, function(el) {

			if (el.tagName === 'g') {

				isDragging = false;
				el.setAttribute('class', '');

				let newID = parseInt(el.id, 10);

				// remove item from array which matches the id of item released
				heldBalls = heldBalls.filter(function( obj ) {
				    return obj.id !== newID;
				});

				mouseBallHeld === {};



			}

		});
	});

};


var touch = function() {



	globals.doc.addEventListener('touchstart', function(e) {
		e.preventDefault();

		utilities.closest(e.target, function(el) {

			if (el.tagName === 'g') {


				el.setAttribute('class', 'held');

				isDragging = true;

				let newBall = {}


				let newID = parseInt(el.id, 10);

				for (let i = 0; i < e.touches.length; i++) {

					let positionX = globals.ballArr[newID].x;
					let positionY = globals.ballArr[newID].y;

					newBall = {
						id: newID,
						positionX: positionX,
						positionY: positionY,
						mousedownX: e.touches[i].pageX,
						mousedownY: e.touches[i].pageY,
						dragStartPositionX: positionX,
						dragStartPositionY: positionY,
						velocityX: 0,
						velocityY: 0
					}

				}

				mouseBallHeld = newBall;
				heldBalls.push(newBall);


			}

		});
	});

	globals.doc.addEventListener('touchmove', function(e) {

		e.preventDefault();

		if (isDragging) {

			for (let i = 0; i < e.touches.length; i++) {

				if (globals.ballArr[heldBalls[i].id] === undefined) return; // if you touchmove not on a ball

				//console.log(e.touches.length)

				globals.ballArr[heldBalls[i].id].x = e.touches[i].pageX;
				globals.ballArr[heldBalls[i].id].y = e.touches[i].pageY;


				//setDragPosition(e.touches[i], heldBalls[i]);


			}


			// for (var i = 0; i < e.touches.length; i++) {



			// 	//console.log('touchmove', e.touches[i])
			// 	setDragPosition(e.touches[i], touchBallsHeld[i]);



			// }

		}


	});



	globals.doc.addEventListener('touchend', function(e) {


		// get the 'g' element of the finger which was removed
		utilities.closest(e.changedTouches[0].target, function(el) {

			if (el.tagName === 'g') {


				el.setAttribute('class', '');

				let newID = parseInt(el.id, 10);

				// remove item from array which matches the id of item released
				heldBalls = heldBalls.filter(function( obj ) {
				    return obj.id !== newID;
				});


				if (!heldBalls.length) {
					mouseBallHeld === {};
					isDragging = false;
				}


			}

		});

	});
};


mouse();
touch();


module.exports['updateInertia'] = updateInertia
