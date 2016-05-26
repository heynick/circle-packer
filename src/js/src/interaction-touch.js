import utilities from './utilities';
import globals from './globals';
import setDragPosition from './inertia/setDragPosition'
import * as store from './store';


globals.doc.addEventListener('touchstart', function(e) {
	e.preventDefault();



	//for (let i = 0; i < e.touches.length; i++) {

		utilities.closest(e.changedTouches[0].target, function(el) {


			if (el.tagName === 'g') {

				let newID = parseInt(el.id, 10);

				// remove the ball if its already included in the heldballs array
			 	let index = store.heldBalls.indexOf(newID);
			 	if (index > -1) {
			 		store.heldBalls.splice(index, 1)
			 	}


				let positionX = globals.ballArr[newID].x;
				let positionY = globals.ballArr[newID].y;

				globals.ballArr[newID].mousedownX = e.changedTouches[0].pageX
				globals.ballArr[newID].mousedownY = e.changedTouches[0].pageY
				globals.ballArr[newID].dragStartPositionX = positionX
				globals.ballArr[newID].dragStartPositionY = positionY
				globals.ballArr[newID].velocityX = 0
				globals.ballArr[newID].velocityY = 0
				globals.ballArr[newID].isDragging = true;
				globals.ballArr[newID].hasInertia = false;

				setDragPosition(e.changedTouches[0], globals.ballArr[newID]);
				store.heldBalls.push(newID);


			}

		})

	//}

});

globals.doc.addEventListener('touchmove', function(e) {
	e.preventDefault();

	if (store.heldBalls.length) {


		// inertia works
		for (let j = 0; j < e.touches.length; j++) {
			
			utilities.closest(e.touches[j].target, function(el) {
			
				if (el.tagName === 'g') {
					for (var i = 0; i < store.heldBalls.length; i++) {

						// only move the ball that your fingers touch target is touching. jebus this took a long time.
						if (parseInt(el.id, 10) === globals.ballArr[store.heldBalls[i]].id) {
							setDragPosition(e.touches[j], globals.ballArr[store.heldBalls[i]]);
						}

					}

				}
			})
		}


		// multitouch works
		// for (var i = 0; i < store.heldBalls.length; i++) {
		// 	setDragPosition(e.touches[i], globals.ballArr[store.heldBalls[i]]);
		// }			
		
		
	}


	// for (let j = 0; j < e.touches.length; j++) {

	// 	utilities.closest(e.touches[j].target, function(el) {

	// 		if (el.tagName === 'g') {
	// 			console.log(el.id)
	// 			console.log(globals.ballArr[store.heldBalls[el.id]])


	// 			setDragPosition(e.touches[j], globals.ballArr[store.heldBalls[el.id]]);


	// 		}

	// 	})
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
