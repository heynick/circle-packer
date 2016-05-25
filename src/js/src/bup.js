/*global window, globals.doc, app, navigator */
/*jshint bitwise: false*/


// http://codepen.io/desandro/pen/QbPKEq?editors=001

'use strict';

var globals = require('./globals')
var utilities = require('./utilities')

	// particle properties
var	friction = 0.85,
	isDragging = false,

	ballHeld = {},

	//mousedownX,
	//mousedownY,

	leftBound = 0,
	topBound = 0;


var heldBalls = [];




// function applyForce( forceX, forceY ) {
// 	ballHeld.velocityX += forceX;
// 	ballHeld.velocityY += forceY;
// }

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


/*function applyDragForce() {

	if ( !heldBalls.length ) {
		return;
	}

	let dragVelocityX = globals.ballArr[ballHeld.id].x - ballHeld.positionX,
		dragVelocityY = globals.ballArr[ballHeld.id].y - ballHeld.positionY,
		dragForceX = dragVelocityX - ballHeld.velocityX,
		dragForceY = dragVelocityY - ballHeld.velocityY;


	ballHeld.velocityX += dragForceX;
	ballHeld.velocityY += dragForceY;


	//applyForce( dragForceX, dragForceY );

}*/


function setDragPosition( e, currentBall ) {
  	//e.preventDefault();

  	// if you touchmove on something thats not a ball, don't continue
  	if (currentBall === undefined) {
  		return;
  	}

	let moveX = e.pageX - currentBall.mousedownX,
		moveY = e.pageY - currentBall.mousedownY;

  	currentBall.dragPositionX = currentBall.dragStartPositionX + moveX;
  	currentBall.dragPositionY = currentBall.dragStartPositionY + moveY;

	globals.ballArr[currentBall.id].x = currentBall.dragPositionX;
	globals.ballArr[currentBall.id].y = currentBall.dragPositionY;


}

var updateInertia = function() {

	for (let i = 0; i < heldBalls.length; i++) {

		//console.log(heldBalls)

		heldBalls[i].velocityX *= friction;
		heldBalls[i].velocityY *= friction;

		//applyBoundForce();



		//if ( heldBalls.length ) {

			let dragVelocityX = globals.ballArr[heldBalls[i].id].x - heldBalls[i].positionX,
				dragVelocityY = globals.ballArr[heldBalls[i].id].y - heldBalls[i].positionY,
				dragForceX = dragVelocityX - heldBalls[i].velocityX,
				dragForceY = dragVelocityY - heldBalls[i].velocityY;


			heldBalls[i].velocityX += dragForceX;
			heldBalls[i].velocityY += dragForceY;
			//applyDragForce();
			console.log(heldBalls[i])

		//}

		heldBalls[i].positionX += heldBalls[i].velocityX;
		heldBalls[i].positionY += heldBalls[i].velocityY;


		// if there's still inertia
		if (1) {
		//if (Math.abs(heldBalls[i].velocityX) > 0 && Math.abs(heldBalls[i].velocityY) > 0) {
			//console.log(globals.ballArr[heldBalls[i].id])

			globals.ballArr[heldBalls[i].id].x = heldBalls[i].positionX;
			globals.ballArr[heldBalls[i].id].y = heldBalls[i].positionY;
		}

	}

	console.log('d')




};



var mouse = function() {

	globals.doc.addEventListener('mousedown', function(e) {

		utilities.closest(e.target, function(el) {

			if (el.tagName === 'g') {

				el.setAttribute('class', 'held');

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

				ballHeld = newBall;
				heldBalls.push(newBall);


			}

		});

	});


	globals.doc.addEventListener('mousemove', function(e) {

		if (heldBalls.length) {
			// i'd assume you could have only one mouse pointer,
			// so get just the first [0] and only ball within heldBalls
			setDragPosition(e, heldBalls[0]);
			// otherwise it'd be a loop:
			// for (var i = 0; i < heldBalls.length; i++) {
			//	setDragPosition(e, heldBalls[i]);
			// }
		}
	});

	globals.doc.addEventListener('mouseup', function(e) {


		utilities.closest(e.target, function(el) {

			if (el.tagName === 'g') {

				el.setAttribute('class', '');

				// remove item from array which matches the id of item released
				heldBalls = heldBalls.filter(function( obj ) {
				    return obj.id !== parseInt(el.id, 10);
				});

			}

		});
	});

};


var touch = function() {

	globals.doc.addEventListener('touchstart', function(e) {
		e.preventDefault();

		utilities.closest(e.target, function(el) {

			if (el.tagName === 'g') {

				// if (heldBalls.length) {
				// 	return;
				// }


				el.setAttribute('class', 'held');

				//isDragging = true;

				let newBall = {},
					newID = parseInt(el.id, 10);

				for (let i = 0; i < e.touches.length; i++) {

					let positionX = globals.ballArr[newID].x,
						positionY = globals.ballArr[newID].y;

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

					ballHeld = newBall;
				}

				heldBalls.push(newBall);


			}

		});
	});

	globals.doc.addEventListener('touchmove', function(e) {
		e.preventDefault();

		for (let i = 0; i < heldBalls.length; i++) {

			//console.log(heldBalls)

			setDragPosition(e.touches[i], heldBalls[i]);

		}

	});



	globals.doc.addEventListener('touchend', function(e) {

		// get the <g> element of the finger which was removed
		utilities.closest(e.changedTouches[0].target, function(el) {


			if (el.tagName === 'g') {

				el.setAttribute('class', '');

				// remove item from array which matches the id of item released
				heldBalls = heldBalls.filter(function( obj ) {
				    return obj.id !== parseInt(el.id, 10);
				});

			}

		});

	});
};


mouse();
touch();


module.exports['updateInertia'] = updateInertia
