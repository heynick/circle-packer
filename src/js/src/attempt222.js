

var updateInertia = function() {

	//console.log(store.heldBalls)

	// store.heldBalls.forEach((i) => {
	// 	console.log(i)
	// })

	// rewrite this into a map, not a for loop
	for (let i = 0; i < store.heldBalls.length; i++) {

		//console.log(store.heldBalls[i])

		// applyDragForce()
		if ( !store.isDragging ) {
		  return;
		}
		let dragVelocityX = store.heldBalls[i].dragPositionX - store.heldBalls[i].positionX;
		let dragVelocityY = store.heldBalls[i].dragPositionY - store.heldBalls[i].positionY;
		


		// 	applyBoundForce();
		let dragForceX = dragVelocityX - store.heldBalls[i].velocityX;
		let dragForceY = dragVelocityY - store.heldBalls[i].velocityY;

		// now applyForce(dragforceX, y)
		store.heldBalls[i].velocityX += dragForceX;
		store.heldBalls[i].velocityY += dragForceY;
		// end applyForce(dragforceX, y)

		
		// *= goes second last
		store.heldBalls[i].velocityX *= options.friction;
		store.heldBalls[i].velocityY *= options.friction;
			
		// += goes last
		store.heldBalls[i].positionX += store.heldBalls[i].velocityX;
		store.heldBalls[i].positionY += store.heldBalls[i].velocityY;


		// if there's still inertia
		if (1) {
		//if (Math.abs(store.heldBalls[i].velocityX) > 0 && Math.abs(store.heldBalls[i].velocityY) > 0) {
			//console.log(globals.ballArr[store.heldBalls[i].id])

			//globals.ballArr[store.heldBalls[i].id].x = store.heldBalls[i].positionX;
			//globals.ballArr[store.heldBalls[i].id].y = store.heldBalls[i].positionY;
		}

	}



};
