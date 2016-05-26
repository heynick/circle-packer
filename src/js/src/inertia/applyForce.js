import globals from '../globals';

export default function applyForce( forceX, forceY, i ) {
	globals.ballArr[i].velocityX += forceX;
	globals.ballArr[i].velocityY += forceY;
}