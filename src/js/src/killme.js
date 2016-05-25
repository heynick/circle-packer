/*global window, globals.doc, app, navigator */
/*jshint bitwise: false*/

// inertia physics:
// http://codepen.io/desandro/pen/QbPKEq?editors=001

'use strict';

import globals from './globals';
import utilities from './utilities';
import * as store from './store';
import * as options from './options';


// function applyForce( forceX, forceY, i ) {

// 	globals.ballArr[i].velocityX += forceX;
// 	globals.ballArr[i].velocityY += forceY;
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


function applyDragForce(i) {


	if ( !globals.ballArr[i].isDragging ) {
		console.log('not dragging, should return?')
		return;
	}

	let dragVelocityX = globals.ballArr[i].x - globals.ballArr[i].positionX;
	let dragVelocityY = globals.ballArr[i].y - globals.ballArr[i].positionY;
	let dragForceX = dragVelocityX - globals.ballArr[i].velocityX;
	let dragForceY = dragVelocityY - globals.ballArr[i].velocityY;


	//applyForce( dragForceX, dragForceY );
	globals.ballArr[i].velocityX += dragForceX;
	globals.ballArr[i].velocityY += dragForceY;
	//applyForce()

}


// globals.ballArr holds all the ball details, always and forever

// store.heldBalls is an array which should only contain ID, nothing else about the ball


const updateInertia = function() {

	// if (!store.heldBalls.length) {
	// 	return;
	// }


	store.heldBalls.forEach(function(i) {

		// i is the ID of the ball

		console.log(globals.ballArr[i])

		applyDragForce(i);

		globals.ballArr[i].velocityX *= options.friction;
		globals.ballArr[i].velocityY *= options.friction;

		globals.ballArr[i].positionX += globals.ballArr[i].velocityX;
		globals.ballArr[i].positionY += globals.ballArr[i].velocityY;


		// potential bugs here
			globals.ballArr[i].x = globals.ballArr[i].positionX;
			globals.ballArr[i].y = globals.ballArr[i].positionY;
		if (globals.ballArr[i].isDragging) {
		}

		if (globals.ballArr[i].hasInertia === false) {
			console.log('removing!')
			let itemToRemove = store.heldBalls.indexOf(i)

			if (itemToRemove != -1) {
				store.heldBalls.splice(itemToRemove, 1);
			}

			//return;

		}



		if (Math.floor(Math.abs(globals.ballArr[i].velocityX)) === 0 && Math.floor(Math.abs(globals.ballArr[i].velocityY)) === 0) {


			console.log('no inertia')

			globals.ballArr[i].hasInertia = false
			globals.ballArr[i].isDragging = false
	
		}

		
	})


	// if (globals.ballArr[store.heldBalls[0]] === undefined) {
	// 	return;
	// }


	
	// // is infinitesimal
	// if (Math.floor(Math.abs(globals.ballArr[store.heldBalls[0]].velocityX)) === 0 && Math.floor(Math.abs(globals.ballArr[store.heldBalls[0]].velocityY)) === 0) {

	// 	// if (globals.ballArr[store.heldBalls[0]].isDragging = true) {
	// 	// 	return;
	// 	// }

	// 	
		


		

	// 	console.log('inertiaEnd', store.heldBalls) // [2]

	// 	return;

	// }

	


	

};



module.exports['updateInertia'] = updateInertia
