import globals from '../globals';
import applyForce from './applyForce'
import * as options from '../options';

function right(restX, forceX, globals, i, distanceX) {

	if (globals.ballArr[i].positionX > options.leftBound) {
		console.log('')
		//return;
	}

  	// if in bounds, apply force to align at bounds
	if ( restX > globals.w) {
		console.log('right')
		applyForce( forceX, 0, i );
		return
	}

	forceX = distanceX * 0.1 - globals.ballArr[i].velocityX
	applyForce( forceX, 0, i)
	console.log('right resting')
}


function left(restXneg, forceXleft, globals, i, distanceXleft) {

	
	if (globals.ballArr[i].positionX < globals.w) {
		//return;
	}
	

	if (restXneg < options.leftBound) {
		console.log('left over')
		//applyForce( forceXleft, 0, i );
		return;
	}

	// console.log('left resting')
	// forceXleft = distanceXleft * 0.1 + globals.ballArr[i].velocityX
	// applyForce( forceXleft, 0, i)
	  	
}

export default function applyBoundForce(i) {
	
	if ( globals.ballArr[i].isDragging ||  globals.ballArr[i].positionY < globals.h && globals.ballArr[i].positionY > options.topBound) {
		return;
	}

	// bouncing past bound
	let distanceX = globals.w - globals.ballArr[i].positionX;
	let distanceY = globals.h - globals.ballArr[i].positionY;
	let	forceX = distanceX * 0.1;
	let	forceY = distanceY * 0.1;

	let distanceXleft = options.leftBound - globals.ballArr[i].positionX;
	let distanceYtop = options.topBound - globals.ballArr[i].positionY;
	let forceXleft = distanceXleft * 0.1;
	let forceYtop = distanceYtop * 0.1;

	// calculate resting position with this force
	let restX =    globals.ballArr[i].positionX + ( globals.ballArr[i].velocityX + forceX ) / ( 1 - options.friction );
	let restY =    globals.ballArr[i].positionY + ( globals.ballArr[i].velocityY + forceY ) / ( 1 - options.friction );
	let restYneg = globals.ballArr[i].positionY + ( globals.ballArr[i].velocityY + forceYtop ) / ( 1 - options.friction );
	let restXneg = globals.ballArr[i].positionX + ( globals.ballArr[i].velocityX + forceXleft ) / ( 1 - options.friction );


	right(restX, forceX, globals, i, distanceX);
	left(restX, forceX, globals, i, distanceX);





	// else {
	// 	console.log('left resting')
	// }

	// } else if (restY > globals.h) {
	// 	// bottom
	// 	applyForce( 0, forceY, i);
	// } else if (restYneg < options.topBound) {
	// 	// top
	// 	applyForce( 0, forceYtop, i);
	// }
}
