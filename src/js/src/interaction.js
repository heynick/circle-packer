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

	//mousedownX,
	//mousedownY,

	leftBound = 0,
	topBound = 0;


var touchBallsHeld = [];


var heldBalls = [];


var	positionX = null,
	positionY = null;
	//dragPositionX = positionX,
	//dragPositionY = positionY,
	//dragStartPositionX,
	//dragStartPositionY;


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

	let dragVelocityX = globals.ballArr[mouseBallHeld].x - positionX;
	let dragVelocityY = globals.ballArr[mouseBallHeld].y - positionY;
	let dragForceX = dragVelocityX - velocityX;
	let dragForceY = dragVelocityY - velocityY;

	applyForce( dragForceX, dragForceY );

}


function setDragPosition( e, currentBall ) {
  	//e.preventDefault();


  	if (0) {

  		for (var i = 0; i < e.touches.length; i++) {

  			console.log(currentBall.id)

			let moveX = e.touches[i].pageX - currentBall.mousedownX;
			let moveY = e.touches[i].pageY - currentBall.mousedownY;

		  	currentBall.dragPositionX = currentBall.dragStartPositionX + moveX;
		  	currentBall.dragPositionY = currentBall.dragStartPositionY + moveY;

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



var mouse = function() {

	globals.doc.addEventListener('mousedown', function(e) {

		cursorPos = [e.pageX, e.pageY];

		utilities.closest(e.target, function(el) {

			if (el.tagName === 'g') {

				el.setAttribute('class', 'held');

				mouseBallHeld = el.id;
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
					dragStartPositionY: positionY
				}

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


var touch = function() {



	globals.doc.addEventListener('touchstart', function(e) {
		e.preventDefault();

		utilities.closest(e.target, function(el) {

			if (el.tagName === 'g') {

				el.setAttribute('class', 'held');



				mouseBallHeld = el.id;
				isDragging = true;

				let newID = parseInt(el.id, 10);

				//console.log(e);


				for (var i = 0; i < e.touches.length; i++) {

					let positionX = globals.ballArr[newID].x;
					let positionY = globals.ballArr[newID].y;

					let newBall = {
						id: newID,
						positionX: positionX,
						positionY: positionY,
						mousedownX: e.touches[i].pageX,
						mousedownY: e.touches[i].pageY,
						dragStartPositionX: positionX,
						dragStartPositionY: positionY
					}

					heldBalls.push(newBall);

				}





				//globals.ballArr[mouseBallHeld].dragStartPositionX = e.pageX;
				//globals.ballArr[mouseBallHeld].dragStartPositionY = e.pageY;

			}

		});
	});

	globals.doc.addEventListener('touchmove', function(e) {

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



	globals.doc.addEventListener('touchend', function(e) {

		isDragging = false;

		// get the 'g' element of the finger which was removed
		utilities.closest(e.changedTouches[0].target, function(el) {

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


module.exports['updateInertia'] = updateInertia
