/*global window, app.globals.doc, app, navigator */
/*jshint bitwise: false*/


// http://codepen.io/desandro/pen/QbPKEq?editors=001

app.interaction = (function () {
	'use strict';


	var cursorPos = [],

		// particle properties
		positionX = 0,
		positionY = 0,

		velocityX = 0,
		velocityY = 0,

		friction = 0.85,
		isDragging = false,

		mouseBallHeld = '',

		mousedownX,
		mousedownY,

		leftBound = 0,
		topBound = 0;


	function applyForce( forceX, forceY ) {
		if (forceX) {
			velocityX += forceX;
		}
		if (forceY) {
			velocityY += forceY;
		}
	}


	function applyBoundForce() {
		if ( isDragging || positionX < app.globals.w && positionX > leftBound && positionY < app.globals.h && positionY > topBound) {
			return;
		}

		// bouncing past bound
		var distanceX = app.globals.w - positionX,
			distanceY = app.globals.h - positionY,

			forceX = distanceX * 0.1,
			forceY = distanceY * 0.1,

			distanceYtop = topBound - positionY,
			distanceXleft = leftBound - positionX,
			forceXleft = distanceXleft * 0.1,
			forceYtop = distanceYtop * 0.1,

		// calculate resting position with this force
			restX = positionX + ( velocityX + forceX ) / ( 1 - friction ),
			restY = positionY + ( velocityY + forceY ) / ( 1 - friction ),

			restYneg = positionY + ( velocityY + forceYtop ) / ( 1 - friction ),
			restXneg = positionX + ( velocityX + forceXleft ) / ( 1 - friction );

	  	// if in bounds, apply force to align at bounds
		if ( restX > app.globals.w) {
			// passes right
			applyForce( forceX, 0 );
		} else if (restXneg < leftBound) {
			// passes left
			applyForce( forceXleft, 0 );
		} else if (restY > app.globals.h) {
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

		var dragVelocityX = app.globals.circleArr[mouseBallHeld].x - positionX;
		var dragVelocityY = app.globals.circleArr[mouseBallHeld].y - positionY;
		var dragForceX = dragVelocityX - velocityX;
		var dragForceY = dragVelocityY - velocityY;

		applyForce( dragForceX, dragForceY );
	}


	function setDragPosition( e, currentBall ) {

		//console.log(mousedownX)

		var moveX = e.pageX - mousedownX;
		var moveY = e.pageY - mousedownY;
		app.globals.circleArr[currentBall].x = app.globals.circleArr[currentBall].dragStartPositionX + moveX;
		app.globals.circleArr[currentBall].y = app.globals.circleArr[currentBall].dragStartPositionY + moveY;

		//e.preventDefault();
	}

	var updateInertia = function() {

		applyBoundForce();
		applyDragForce();

		velocityX *= friction;
		velocityY *= friction;

		positionX += velocityX;
		positionY += velocityY;

		if (mouseBallHeld) {

			app.globals.circleArr[mouseBallHeld].x = positionX;
			app.globals.circleArr[mouseBallHeld].y = positionY;

		}

	};



	var init = function () {

		mouse();
		touch();
		keys();

	};


	var keys = function() {

		app.globals.doc.onkeydown = function(e) {
		    e = e || window.event;
		    if (e.keyCode == 27) {

		        setTimeout(function() {
		        	app.globals.activeBall.classList.remove('active');
		        }, 0)
		    }
		};

	};



	var mouse = function() {

		app.globals.doc.addEventListener('mousedown', function(e) {

			cursorPos = [e.pageX, e.pageY];


			app.utilities.closest(e.target, function(el) {

				if (el.tagName === 'g') {

					el.setAttribute('class', 'held');

					mouseBallHeld = el.id;
					isDragging = true;
					mousedownX = e.pageX;
					mousedownY = e.pageY;


					app.globals.circleArr[mouseBallHeld].dragStartPositionX = mousedownX;
					app.globals.circleArr[mouseBallHeld].dragStartPositionY = mousedownY;

					//setDragPosition( e, mouseBallHeld );


				}

			});


		});


		app.globals.doc.addEventListener('mousemove', function(e) {

			if (isDragging) {
				setDragPosition(e, mouseBallHeld);
				//console.log(mouseBallHeld)
			}

		});

		app.globals.doc.addEventListener('mouseup', function(e) {

			if (isDragging) {
				// gotta do it this way because user could mouseup on a different element
				// which would wreck the closest loop
				app.globals.doc.getElementById(mouseBallHeld).setAttribute('class', '');

				app.utilities.closest(e.target, function(el) {

					// check whether mouseup occured on an anchor, and whether it clicked
					if (el.tagName === 'a' && [e.pageX, e.pageY].equals(cursorPos)) {

						app.globals.svgEl.appendChild(el.parentNode);
						app.globals.activeBall = el;

						//window.cancelAnimationFrame(app.globals.animating);

						setTimeout(function() {

							//console.log('click');

							el.setAttribute('class', 'active');

						}, 0)

					}/* else if (el.tagName === 'g') {

						app.globals.circleArr[mouseBallHeld].x = e.pageX;
						app.globals.circleArr[mouseBallHeld].y = e.pageY;

					}*/

				});

				isDragging = false;
				//app.globals.doc.removeEventListener( 'mousemove' );
				//app.globals.doc.removeEventListener( 'mouseup' );


			}


		});

	};

	var touch = function() {

		var touchBallsHeld = [];

		app.globals.doc.addEventListener('touchstart', function(e) {

			app.utilities.closest(e.target, function(el) {

				if (el.tagName === 'g') {

					el.setAttribute('class', 'held');


					touchBallsHeld.push(el.id);

					mouseBallHeld = el.id;
					isDragging = true;
					mousedownX = e.pageX;
					mousedownY = e.pageY;


					app.globals.circleArr[mouseBallHeld].dragStartPositionX = mousedownX;
					app.globals.circleArr[mouseBallHeld].dragStartPositionY = mousedownY;

				}

			});
		});

		app.globals.doc.addEventListener('touchmove', function(e) {

			e.preventDefault();


			if (touchBallsHeld.length) {


				for (var i = 0; i < e.touches.length; i++) {


					app.globals.circleArr[touchBallsHeld[i]].x = e.touches[i].pageX;
					app.globals.circleArr[touchBallsHeld[i]].y = e.touches[i].pageY;


					//setDragPosition(e.touches[i], touchBallsHeld[i]);

				}

			}


		});









		app.globals.doc.addEventListener('touchend', function(e) {

			// get the 'g' element of the finger which was removed
			app.utilities.closest(e.changedTouches[0].target, function(el) {

				if (el.tagName === 'g') {

					el.setAttribute('class', '');

					// remove the corresponding ball from the touchBallsHeld array
					var indexToRemove = touchBallsHeld.indexOf(el.id);
					if (indexToRemove > -1) {
					    touchBallsHeld.splice(indexToRemove, 1);
					}

				}

			});

		});
	};






	return {
		init: init,
		updateInertia: updateInertia
	};

})();