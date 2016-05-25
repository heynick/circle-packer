/*global window, globals.doc, app, navigator */
/*jshint bitwise: false*/

// inertia physics:
// http://codepen.io/desandro/pen/QbPKEq?editors=001

'use strict';

import globals from './globals';
import utilities from './utilities';
import * as store from './store';
import * as options from './options';


// function applyForce( forceX, forceY ) {

// 	globals.ballArr[store.heldBalls[0]].velocityX += forceX;
// 	globals.ballArr[store.heldBalls[0]].velocityY += forceY;
// }


// function applyBoundForce() {
	
// 	if ( store.isDragging || store.heldBalls.positionX < globals.w && store.heldBalls.positionX > options.leftBound && store.heldBalls.positionY < globals.h && store.heldBalls.positionY > options.topBound) {
// 		return;
// 	}

// 	// bouncing past bound
// 	let distanceX = globals.w - store.heldBalls.positionX;
// 	let distanceY = globals.h - store.heldBalls.positionY;

// 	let	forceX = distanceX * 0.1,
// 		forceY = distanceY * 0.1,

// 		distanceYtop = options.topBound - store.heldBalls.positionY,
// 		distanceXleft = options.leftBound - store.heldBalls.positionX,
// 		forceXleft = distanceXleft * 0.1,
// 		forceYtop = distanceYtop * 0.1,

// 	// calculate resting position with this force
// 		restX = store.heldBalls.positionX + ( store.heldBalls.velocityX + forceX ) / ( 1 - options.friction ),
// 		restY = store.heldBalls.positionY + ( store.heldBalls.velocityY + forceY ) / ( 1 - options.friction ),

// 		restYneg = store.heldBalls.positionY + ( store.heldBalls.velocityY + forceYtop ) / ( 1 - options.friction ),
// 		restXneg = store.heldBalls.positionX + ( store.heldBalls.velocityX + forceXleft ) / ( 1 - options.friction );

//   	// if in bounds, apply force to align at bounds
// 	if ( restX > globals.w) {
// 		// passes right
// 		applyForce( forceX, 0 );
// 	} else if (restXneg < options.leftBound) {
// 		// passes left
// 		applyForce( forceXleft, 0 );
// 	} else if (restY > globals.h) {
// 		// passes bottom
// 		applyForce( 0, forceY );
// 	} else if (restYneg < options.topBound) {
// 		// passes top
// 		applyForce( 0, forceYtop );
// 	}
// }


function applyDragForce() {

	if ( !store.isDragging ) {
		return;
	}

	let dragVelocityX = globals.ballArr[store.heldBalls[0]].x - globals.ballArr[store.heldBalls[0]].positionX;
	let dragVelocityY = globals.ballArr[store.heldBalls[0]].y - globals.ballArr[store.heldBalls[0]].positionY;
	
	
	let dragForceX = dragVelocityX - globals.ballArr[store.heldBalls[0]].velocityX;
	let dragForceY = dragVelocityY - globals.ballArr[store.heldBalls[0]].velocityY;

	//console.log(dragForceX)

	globals.ballArr[store.heldBalls[0]].velocityX += dragForceX;
	globals.ballArr[store.heldBalls[0]].velocityY += dragForceY;

	//console.log(globals.ballArr[store.heldBalls[0]])

	//applyForce( dragForceX, dragForceY );
	

}


// globals.ballArr holds all the ball details, always and forever

// store.heldBalls is an array which should only contain ID, nothing else about the ball



const updateInertia = function() {


	//console.log( Math.abs(globals.ballArr[store.heldBalls[0]].velocityX) )
	//console.log( globals.ballArr[store.heldBalls[0]] === undefined )

	if (globals.ballArr[store.heldBalls[0]] === undefined) {
		return;
	}

	Math.abs(globals.ballArr[store.heldBalls[0]].velocityX)
	


	// if (!store.heldBalls.length) {
	// 	return;
	// }


	// if ( globals.ballArr[store.heldBalls[0]].velocityX >= 300) {
	// 	console.log('no')
	// 	return;
	// }

	// if (Math.abs(globals.ballArr[store.heldBalls[0]].velocityX) > 0 && Math.abs(globals.ballArr[store.heldBalls[0]].velocityY) > 0) {
	// 	console.log(store.heldBalls)
	// }


	globals.ballArr[store.heldBalls[0]].velocityX *= options.friction;
	globals.ballArr[store.heldBalls[0]].velocityY *= options.friction;

	//applyBoundForce();
	applyDragForce();

	globals.ballArr[store.heldBalls[0]].positionX += globals.ballArr[store.heldBalls[0]].velocityX;
	globals.ballArr[store.heldBalls[0]].positionY += globals.ballArr[store.heldBalls[0]].velocityY;


	// potential bugs here
	if (globals.ballArr[store.heldBalls[0]]) {


	}
		globals.ballArr[store.heldBalls[0]].x = globals.ballArr[store.heldBalls[0]].positionX;
		globals.ballArr[store.heldBalls[0]].y = globals.ballArr[store.heldBalls[0]].positionY;

};



module.exports['updateInertia'] = updateInertia
