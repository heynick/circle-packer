// inertia physics based on http://codepen.io/desandro/pen/QbPKEq?editors=001

'use strict';

import globals from './globals';
import utilities from './utilities';
import store from './store';
import options from './settings/options';
import applyDragForce from './inertia/applyDragForce'
import applyForce from './inertia/applyForce'
import applyBoundForce from './inertia/applyBoundForce'


// globals.ballArr holds all the ball details, always and forever
// store.heldBalls is an array which should only contain ID, nothing else about the ball

export default function updateInertia() {

	store.heldBalls.forEach(function(i) {

		globals.ballArr[i].velocityX *= options.friction;
		globals.ballArr[i].velocityY *= options.friction;


		applyBoundForce(i);
		applyDragForce(i);

		globals.ballArr[i].positionX += globals.ballArr[i].velocityX;
		globals.ballArr[i].positionY += globals.ballArr[i].velocityY;


		// is infinitesimal
		if (Math.round(Math.abs(globals.ballArr[i].velocityX) * 100) / 100 === 0 && Math.round(Math.abs(globals.ballArr[i].velocityY) * 100) / 100 === 0) {

			// only remove if youre not dragging it
			if (globals.ballArr[i].isDragging === false) {

				//console.log('no inertia, removing')

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
