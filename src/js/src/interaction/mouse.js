import utilities from '../utilities';
import globals from '../globals';
import setDragPosition from '../inertia/setDragPosition'
import store from '../store';


globals.doc.addEventListener('mousedown', function(e) {
	e.preventDefault();

	//store.cursorPos = [e.pageX, e.pageY];

	utilities.closest(e.target, function(el) {

		if (el.tagName === 'g') {

			el.setAttribute('class', 'held');

			

			// get the ball id of the one just clicked
			let newID = parseInt(el.id, 10);

			let positionX = globals.ballArr[newID].x;
			let positionY = globals.ballArr[newID].y;


			globals.ballArr[newID].mousedownX = e.pageX
			globals.ballArr[newID].mousedownY = e.pageY
			globals.ballArr[newID].dragStartPositionX = positionX
			globals.ballArr[newID].dragStartPositionY = positionY
			globals.ballArr[newID].velocityX = 0
			globals.ballArr[newID].velocityY = 0
			globals.ballArr[newID].isDragging = true;

			
			setDragPosition(e, globals.ballArr[newID]);

			store.heldBalls.push(newID);

			//console.log(globals.ballArr[newID])

		}

	});

});


globals.doc.addEventListener('mousemove', function(e) {

	if (store.heldBalls.length) {
		
		for (var i = 0; i < store.heldBalls.length; i++) {
			setDragPosition(e, globals.ballArr[store.heldBalls[i]]);
		}
	}
});


globals.doc.addEventListener('mouseup', function(e) {

	utilities.closest(e.target, function(el) {

		if (el.tagName === 'g') {
			
			el.setAttribute('class', '');

			let newID = parseInt(el.id, 10);

			globals.ballArr[newID].isDragging = false;

		}

	});
});
