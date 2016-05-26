import utilities from './utilities';
import globals from './globals';
import setDragPosition from './inertia/setDragPosition'
import * as store from './store';


globals.doc.addEventListener('touchstart', function(e) {
	e.preventDefault();

	// loop the elements, not the fingers

	for (let i = 0; i < e.touches.length; i++) {
		//console.log(e)

		utilities.closest(e.touches[i].target, function(el) {

			if (el.tagName === 'g') {

				
				let newID = parseInt(el.id, 10);
				

				let positionX = globals.ballArr[newID].x;
				let positionY = globals.ballArr[newID].y;


				//globals.ballArr[newID].positionX = positionX
				//globals.ballArr[newID].positionY = positionY
				globals.ballArr[newID].mousedownX = e.touches[i].pageX
				globals.ballArr[newID].mousedownY = e.touches[i].pageY
				globals.ballArr[newID].dragStartPositionX = positionX
				globals.ballArr[newID].dragStartPositionY = positionY
				globals.ballArr[newID].velocityX = 0
				globals.ballArr[newID].velocityY = 0
				globals.ballArr[newID].isDragging = true;
				globals.ballArr[newID].hasInertia = false;


				setDragPosition(e, globals.ballArr[newID]);
				store.heldBalls.push(newID);


			}

		})

	}

//	return;



	// utilities.closest(e.target, function(el) {

	// 	if (el.tagName === 'g') {

	// 		el.setAttribute('class', 'held');

	// 		store.isDragging = true;

			
	// 		let newID = parseInt(el.id, 10);

	// 		for (let i = 0; i < e.touches.length; i++) {
				
	// 			console.log(el)

	// 			let positionX = globals.ballArr[newID].x;
	// 			let positionY = globals.ballArr[newID].y;


	// 			globals.ballArr[newID].positionX = positionX
	// 			globals.ballArr[newID].positionY = positionY
	// 			globals.ballArr[newID].mousedownX = e.touches[i].pageX
	// 			globals.ballArr[newID].mousedownY = e.touches[i].pageY
	// 			globals.ballArr[newID].dragStartPositionX = positionX
	// 			globals.ballArr[newID].dragStartPositionY = positionY
	// 			globals.ballArr[newID].velocityX = 0
	// 			globals.ballArr[newID].velocityY = 0
	// 			globals.ballArr[newID].isDragging = true;
	// 			globals.ballArr[newID].hasInertia = false;


	// 			store.heldBalls.push(newID);
	// 			//setDragPosition(e, globals.ballArr[e.touches[i]]);

	// 			//console.log(e.touches[i])


	// 		}


	// 	}

	// });
});

globals.doc.addEventListener('touchmove', function(e) {

	e.preventDefault();

	// store.heldBalls.forEach(function(i) {
		
	// 	//setDragPosition(e.touches[0], globals.ballArr[store.heldBalls[0]]);

	// })

	if (store.heldBalls.length) {

		for (let i = 0; i < e.touches.length; i++) {

			setDragPosition(e.touches[i], globals.ballArr[i]);

		}

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

			store.isDragging = false;
			el.setAttribute('class', '');

			let newID = parseInt(el.id, 10);

			globals.ballArr[newID].isDragging = false;
			globals.ballArr[newID].hasInertia = true;
			

		}

	});

});
