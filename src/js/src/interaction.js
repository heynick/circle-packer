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


function applyDragForce(i) {

	if ( !globals.ballArr[i].isDragging ) {
		return;
	}


	let dragVelocityX = globals.ballArr[i].x - globals.ballArr[i].positionX;
	let dragVelocityY = globals.ballArr[i].y - globals.ballArr[i].positionY;	
	let dragForceX = dragVelocityX - globals.ballArr[i].velocityX;
	let dragForceY = dragVelocityY - globals.ballArr[i].velocityY;

	globals.ballArr[i].velocityX += dragForceX;
	globals.ballArr[i].velocityY += dragForceY;

	//applyForce( dragForceX, dragForceY );
	

}


// globals.ballArr holds all the ball details, always and forever

// store.heldBalls is an array which should only contain ID, nothing else about the ball



const updateInertia = function() {


	store.heldBalls.forEach(function(i) {

		globals.ballArr[i].velocityX *= options.friction;
		globals.ballArr[i].velocityY *= options.friction;


		//applyBoundForce();
		applyDragForce(i);

		globals.ballArr[i].positionX += globals.ballArr[i].velocityX;
		globals.ballArr[i].positionY += globals.ballArr[i].velocityY;


		// is infinitesimal
		if (Math.round(Math.abs(globals.ballArr[i].velocityX) * 100) / 100 === 0 && Math.round(Math.abs(globals.ballArr[i].velocityY) * 100) / 100 === 0) {

			// only remove if youre not dragging it
			if (globals.ballArr[i].isDragging === false) {

				//console.log('no inertia, removing')

				globals.ballArr[i].hasInertia = false;

				
				let itemToRemove = store.heldBalls.indexOf(i)

				if (itemToRemove !== -1) {
					store.heldBalls.splice(itemToRemove, 1);
				}

			}

		
		} else {
			// this is what actually moves the balls coordinates
			globals.ballArr[i].x = globals.ballArr[i].positionX;
			globals.ballArr[i].y = globals.ballArr[i].positionY;
		}



	})

	

};



module.exports['updateInertia'] = updateInertia
