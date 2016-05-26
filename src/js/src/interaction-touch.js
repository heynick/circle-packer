import utilities from './utilities';
import globals from './globals';
import setDragPosition from './inertia/setDragPosition'
import * as store from './store';


globals.doc.addEventListener('touchstart', function(e) {
	e.preventDefault();



	//for (let i = 0; i < e.touches.length; i++) {

		utilities.closest(e.target, function(el) {

			if (el.tagName === 'g') {


				let newID = parseInt(el.id, 10);
				console.log(newID)
				let positionX = globals.ballArr[newID].x;
				let positionY = globals.ballArr[newID].y;

				globals.ballArr[newID].mousedownX = e.touches[0].pageX
				globals.ballArr[newID].mousedownY = e.touches[0].pageY
				globals.ballArr[newID].dragStartPositionX = positionX
				globals.ballArr[newID].dragStartPositionY = positionY
				globals.ballArr[newID].velocityX = 0
				globals.ballArr[newID].velocityY = 0
				globals.ballArr[newID].isDragging = true;
				globals.ballArr[newID].hasInertia = false;



				setDragPosition(e.touches[0], globals.ballArr[newID]);
				store.heldBalls.push(newID);


			}

		})

	//}

});

globals.doc.addEventListener('touchmove', function(e) {

	e.preventDefault();

	store.heldBalls.forEach(function(i) {
		console.log(i)
		setDragPosition(e.touches[0], globals.ballArr[i]);

		// for (let j = 0; j < e.touches.length; j++) {

		// 	setDragPosition(e.touches[j], globals.ballArr[0]);

		// 	//console.log(store.heldBalls)

		// 	//setDragPosition(e.touches[i], store.heldBalls[i]);

		// }
	
	})



	// if (store.heldBalls.length) {

	// 	for (let i = 0; i < e.touches.length; i++) {

	// 		setDragPosition(e.touches[i], globals.ballArr[store.heldBalls[i]]);

	// 		//console.log(store.heldBalls)

	// 		//setDragPosition(e.touches[i], store.heldBalls[i]);

	// 	}
	// }


});


globals.doc.addEventListener('touchend', function(e) {

	// get the <g> element of the finger which was removed
	utilities.closest(e.changedTouches[0].target, function(el) {


		if (el.tagName === 'g') {

			
			el.setAttribute('class', '');

			let newID = parseInt(el.id, 10);

			globals.ballArr[newID].isDragging = false;
			globals.ballArr[newID].hasInertia = true;
			
		}

	});

});
