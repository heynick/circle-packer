import utilities from './utilities';
import globals from './globals';
import setDragPosition from './inertia/setDragPosition'
import * as store from './store';


globals.doc.addEventListener('touchstart', function(e) {
	e.preventDefault();

	utilities.closest(e.target, function(el) {

		if (el.tagName === 'g') {


			el.setAttribute('class', 'held');

			store.isDragging = true;

			let newBall = {}


			let newID = parseInt(el.id, 10);

			for (let i = 0; i < e.touches.length; i++) {

				let positionX = globals.ballArr[newID].x;
				let positionY = globals.ballArr[newID].y;

				newBall = {
					id: newID,
					positionX: positionX,
					positionY: positionY,
					mousedownX: e.touches[i].pageX,
					mousedownY: e.touches[i].pageY,
					dragStartPositionX: positionX,
					dragStartPositionY: positionY,
					velocityX: 0,
					velocityY: 0
				}

			}

			store.mouseBallHeld = newBall;
			store.heldBalls.push(newBall);


		}

	});
});

globals.doc.addEventListener('touchmove', function(e) {

	e.preventDefault();

	for (let i = 0; i < e.touches.length; i++) {

		//console.log(store.heldBalls)

		setDragPosition(e.touches[i], store.heldBalls[i]);

	}


	// if (store.isDragging) {

	// 	for (let i = 0; i < e.touches.length; i++) {


	// 		globals.ballArr[store.heldBalls[i].id].x = e.touches[i].pageX;
	// 		globals.ballArr[store.heldBalls[i].id].y = e.touches[i].pageY;

	// 	}

	// }


});



globals.doc.addEventListener('touchend', function(e) {

	// get the <g> element of the finger which was removed
	utilities.closest(e.changedTouches[0].target, function(el) {


		if (el.tagName === 'g') {

			el.setAttribute('class', '');

			// remove item from array which matches the id of item released
			store.heldBalls = store.heldBalls.filter(function( obj ) {
			    return obj.id !== parseInt(el.id, 10);
			});

			console.log(store.heldBalls.length)

			if (!store.heldBalls.length) {
				store.mouseBallHeld === {};
				store.isDragging = false;
			}

		}

	});



});
