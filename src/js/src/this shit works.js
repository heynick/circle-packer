
function applyForce( forceX, forceY ) {
	velocityX += forceX;
	velocityY += forceY;
}


function applyBoundForce() {
	
	if ( isDragging || mouseBallHeld.positionX < globals.w && mouseBallHeld.positionX > leftBound && mouseBallHeld.positionY < globals.h && mouseBallHeld.positionY > topBound) {
		return;
	}

	// bouncing past bound
	let distanceX = globals.w - mouseBallHeld.positionX;
	let distanceY = globals.h - mouseBallHeld.positionY;

	let	forceX = distanceX * 0.1,
		forceY = distanceY * 0.1,

		distanceYtop = topBound - mouseBallHeld.positionY,
		distanceXleft = leftBound - mouseBallHeld.positionX,
		forceXleft = distanceXleft * 0.1,
		forceYtop = distanceYtop * 0.1,

	// calculate resting position with this force
		restX = mouseBallHeld.positionX + ( mouseBallHeld.velocityX + forceX ) / ( 1 - friction ),
		restY = mouseBallHeld.positionY + ( mouseBallHeld.velocityY + forceY ) / ( 1 - friction ),

		restYneg = mouseBallHeld.positionY + ( mouseBallHeld.velocityY + forceYtop ) / ( 1 - friction ),
		restXneg = mouseBallHeld.positionX + ( mouseBallHeld.velocityX + forceXleft ) / ( 1 - friction );

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

	console.log(mouseBallHeld)

	let dragVelocityX = globals.ballArr[mouseBallHeld.id].x - mouseBallHeld.positionX;
	let dragVelocityY = globals.ballArr[mouseBallHeld.id].y - mouseBallHeld.positionY;
	let dragForceX = dragVelocityX - mouseBallHeld.velocityX;
	let dragForceY = dragVelocityY - mouseBallHeld.velocityY;


	mouseBallHeld.velocityX += dragForceX;
	mouseBallHeld.velocityY += dragForceY;

	//applyForce( dragForceX, dragForceY );

}


function setDragPosition( e, currentBall ) {
  	//e.preventDefault();

	var moveX = e.pageX - currentBall.mousedownX;
	var moveY = e.pageY - currentBall.mousedownY;

  	currentBall.dragPositionX = currentBall.dragStartPositionX + moveX;
  	currentBall.dragPositionY = currentBall.dragStartPositionY + moveY;

	globals.ballArr[currentBall.id].x = currentBall.dragPositionX;
	globals.ballArr[currentBall.id].y = currentBall.dragPositionY;

}

var updateInertia = function() {

	mouseBallHeld.velocityX *= friction;
	mouseBallHeld.velocityY *= friction;

	applyBoundForce();
	applyDragForce();

	mouseBallHeld.positionX += mouseBallHeld.velocityX;
	mouseBallHeld.positionY += mouseBallHeld.velocityY;


	// potential bugs here
	if (globals.ballArr[mouseBallHeld.id]) {

		globals.ballArr[mouseBallHeld.id].x = mouseBallHeld.positionX;
		globals.ballArr[mouseBallHeld.id].y = mouseBallHeld.positionY;

	}

};
