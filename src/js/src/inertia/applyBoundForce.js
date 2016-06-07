import globals from '../globals';
import applyForceX from './applyForceX'
import applyForceY from './applyForceY'
import options from '../settings/options';

function right(i) {

	if ( globals.ballArr[i].positionX < options.rightBound ) {
		return;
	}

	let distance = options.rightBound - globals.ballArr[i].positionX;
	let	force = distance * 0.1;
	let rest = globals.ballArr[i].positionX + ( globals.ballArr[i].velocityX + force ) / ( 1 - options.friction );

  	// if in bounds, apply force to align at bounds
	if ( rest > options.rightBound ) {
		applyForceX( force, i )
	} else {
		force = distance * 0.1 - globals.ballArr[i].velocityX
		applyForceX( force, i)
	}
}


function left(i) {

	if ( globals.ballArr[i].positionX > options.leftBound ) {
		return;
	}

	// bouncing past bound
	let distance = options.leftBound - globals.ballArr[i].positionX;
	let	force = distance * 0.1;
	let rest =  globals.ballArr[i].positionX + ( globals.ballArr[i].velocityX + force ) / ( 1 - options.friction );

	if (rest < options.leftBound ) {
		applyForceX( force, i)
	} else {
		force = distance * 0.1 - globals.ballArr[i].velocityX
		applyForceX( force, i);
	}


}

function top(i) {

	if ( globals.ballArr[i].positionY > options.topBound ) {
		return;
	}

	// bouncing past bound
	let distance = options.topBound - globals.ballArr[i].positionY;
	let	force = distance * 0.1;
	let rest =  globals.ballArr[i].positionY + ( globals.ballArr[i].velocityY + force ) / ( 1 - options.friction );

	if (rest < options.topBound) {
		applyForceY( force, i)
	} else {
		force = distance * 0.1 - globals.ballArr[i].velocityY
		applyForceY( force, i);
	}

}

function bottom(i) {

	if ( globals.ballArr[i].positionY < options.bottomBound ) {
		return;
	}

	// bouncing past bound
	let distance = options.bottomBound - globals.ballArr[i].positionY;
	let	force = distance * 0.1;
	let rest =  globals.ballArr[i].positionY + ( globals.ballArr[i].velocityY + force ) / ( 1 - options.friction );

	if (rest > options.bottomBound) {
		applyForceY( force, i)
	} else {
		force = distance * 0.1 - globals.ballArr[i].velocityY
		applyForceY( force, i);
	}

}

export default function applyBoundForce(i) {

	if (globals.ballArr[i].isDragging) {
		return;
	}

	left(i);
	right(i);
	top(i);
	bottom(i);

}
