import globals from '../globals';
import applyForce from './applyForce'

export default function applyDragForce(i) {

	if ( !globals.ballArr[i].isDragging ) {
		return;
	}

	let dragVelocityX = globals.ballArr[i].x - globals.ballArr[i].positionX;
	let dragVelocityY = globals.ballArr[i].y - globals.ballArr[i].positionY;	
	let dragForceX = dragVelocityX - globals.ballArr[i].velocityX;
	let dragForceY = dragVelocityY - globals.ballArr[i].velocityY;

	applyForce( dragForceX, dragForceY, i );

}
