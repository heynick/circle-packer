import globals from '../globals';
import applyForce from './applyForce'
import * as options from '../options';

export default function applyBoundForce(i) {
	
	if ( globals.ballArr[i].isDragging || globals.ballArr[i].positionX < globals.w && globals.ballArr[i].positionX > options.leftBound && globals.ballArr[i].positionY < globals.h && globals.ballArr[i].positionY > options.topBound) {
		return;
	}

	// bouncing past bound
	let distanceX = globals.w - globals.ballArr[i].positionX;
	let distanceY = globals.h - globals.ballArr[i].positionY;

	let	forceX = distanceX * 0.1,
		forceY = distanceY * 0.1,

		distanceYtop = options.topBound - globals.ballArr[i].positionY,
		distanceXleft = options.leftBound - globals.ballArr[i].positionX,
		forceXleft = distanceXleft * 0.1,
		forceYtop = distanceYtop * 0.1,

	// calculate resting position with this force
		restX =    globals.ballArr[i].positionX + ( globals.ballArr[i].velocityX + forceX ) / ( 1 - options.friction ),
		restY =    globals.ballArr[i].positionY + ( globals.ballArr[i].velocityY + forceY ) / ( 1 - options.friction ),

		restYneg = globals.ballArr[i].positionY + ( globals.ballArr[i].velocityY + forceYtop ) / ( 1 - options.friction ),
		restXneg = globals.ballArr[i].positionX + ( globals.ballArr[i].velocityX + forceXleft ) / ( 1 - options.friction );

  	// if in bounds, apply force to align at bounds
	if ( restX > globals.w) {
		console.log('passes right')
		applyForce( forceX, 0, i );
	} else if (restXneg < options.leftBound) {
		// passes left
		applyForce( forceXleft, 0, i );
	} else if (restY > globals.h) {
		// passes bottom
		applyForce( 0, forceY, i);
	} else if (restYneg < options.topBound) {
		// passes top
		applyForce( 0, forceYtop, i);
	}
}
