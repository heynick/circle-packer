import globals from '../globals';

export default function setDragPosition( e, currentBall ) {
  	//e.preventDefault();

  	//console.log(currentBall)

  	// dont move the ball around if inertia is carrying it, only when were dragging
  	if (!currentBall.isDragging) {
  		return;
  	}


	var moveX = e.pageX - currentBall.mousedownX;
	var moveY = e.pageY - currentBall.mousedownY;

	currentBall.dragPositionX = currentBall.dragStartPositionX + moveX;
	currentBall.dragPositionY = currentBall.dragStartPositionY + moveY;

	globals.ballArr[currentBall.id].x = currentBall.dragPositionX;
	globals.ballArr[currentBall.id].y = currentBall.dragPositionY;

}
