import utilities from './utilities';
import globals from './globals';
import setDragPosition from './inertia/setDragPosition'
import * as store from './store';


globals.doc.addEventListener('mousedown', function(e) {
	e.preventDefault();

	//store.cursorPos = [e.pageX, e.pageY];

	utilities.closest(e.target, function(el) {

		if (el.tagName === 'g') {

			el.setAttribute('class', 'held');

			store.isDragging = true;

			// get the ball id of the one just clicked
			let newID = parseInt(el.id, 10);

			let positionX = globals.ballArr[newID].x;
			let positionY = globals.ballArr[newID].y;

			// globals.ballArr[newID].positionX = positionX
			// globals.ballArr[newID].positionY = positionY

			globals.ballArr[newID].mousedownX = e.pageX
			globals.ballArr[newID].mousedownY = e.pageY

			globals.ballArr[newID].dragStartPositionX = positionX
			globals.ballArr[newID].dragStartPositionY = positionY

			globals.ballArr[newID].velocityX = 0
			globals.ballArr[newID].velocityY = 0

			globals.ballArr[newID].isDragging = true;
			globals.ballArr[newID].hasInertia = false;

			// globals.ballArr[newID].dragPositionX = 0
			// globals.ballArr[newID].dragPositionY = 0
			

			// let newBall = {
			// 	id: newID,
			// 	positionX: positionX,
			// 	positionY: positionY,
			// 	mousedownX: e.pageX,
			// 	mousedownY: e.pageY,
			// 	dragStartPositionX: positionX,
			// 	dragStartPositionY: positionY,
			// 	//dragPositionX: 0,
			// 	//dragPositionY: 0,
			// 	velocityX: 0,
			// 	velocityY: 0
			// }

			//console.log(newID)

			//console.log(globals.ballArr[newID])

			
			setDragPosition(e, globals.ballArr[newID]);

			store.heldBalls.push(newID);


			// maybe delete
			//store.mouseBallHeld = globals.ballArr[newID];

		}

	});

});


globals.doc.addEventListener('mousemove', function(e) {


	if (store.heldBalls.length) {
		//console.log(store.heldBalls[0])
		// i'd assume you could have only one mouse pointer,
		// so get just the first [0] and only ball within store.heldBalls
		setDragPosition(e, globals.ballArr[store.heldBalls[0]]);
		// otherwise it'd be a loop:
		// for (var i = 0; i < store.heldBalls.length; i++) {
		//	setDragPosition(e, store.heldBalls[i]);
		// }
	}
});


globals.doc.addEventListener('mouseup', function(e) {

	utilities.closest(e.target, function(el) {

		if (el.tagName === 'g') {

			store.isDragging = false;
			el.setAttribute('class', '');

			let newID = parseInt(el.id, 10);


			//console.log(el.id) // 2
			//console.log(store.heldBalls) // [2]


			// let itemToRemove = store.heldBalls.indexOf(newID)

			// if (itemToRemove != -1) {
			// 	store.heldBalls.splice(itemToRemove, 1);
			// }

			globals.ballArr[newID].isDragging = false;
			globals.ballArr[newID].hasInertia = true;

			

			

			// store.heldBalls.find(function (x) {

			// 	if (x === newID) {
			// 		console.log(newID)

			// 	}
				
			// });



			//remove item from array which matches the id of item released
			// store.heldBalls = store.heldBalls.filter(function( obj ) {
			//     return obj.id !== newID;
			// });


			//store.mouseBallHeld === {};

		}

	});
});
