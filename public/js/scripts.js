// http://stackoverflow.com/a/31080629
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}var app = app || {};app.globals = {
    doc: document,
    animating: undefined,
    circleArr: [],
    activeBall: undefined,
    w: window.innerWidth,
    h: window.innerHeight,
    get svgEl() {  // http://stackoverflow.com/a/4616262
        return this.doc.getElementById('svg-el')
    }
}/*global window, app, navigator */
/*jshint bitwise: false*/

app.utilities = (function () {
	'use strict';
/*
	var init = function () {




	};*/

	var isIE = function() {
	  var userAgent = navigator.userAgent;
	  return userAgent.indexOf("MSIE ") > -1 || userAgent.indexOf("Trident/") > -1;
	};


	// http://davidwalsh.name/javascript-debounce-function
	var debounce = function(func, wait, immediate) {
	  var timeout;
	  return function() {
	    var context = this, args = arguments;
	    var later = function() {
	      timeout = null;
	      if (!immediate) func.apply(context, args);
	    };
	    var callNow = immediate && !timeout;
	    clearTimeout(timeout);
	    timeout = setTimeout(later, wait);
	    if (callNow) func.apply(context, args);
	  };
	}

	// event delegation
	// similar to $.closest
	// so we can traverse up the tree for delegation
	// http://stackoverflow.com/questions/22100853/dom-pure-javascript-solution-to-jquery-closest-implementation
	var closest = function(el, fn) {
	    return el && (
	        fn(el) ? el : closest(el.parentNode, fn)
	    );
	}

	var random = function( min, max ){
		return parseInt( Math.random() * (max - min) + min);
	}


	// http://bl.ocks.org/jebeck/196406a3486985d2b92e
	// used for creating the arced text paths
	var getPathData = function(r) {
		r = Math.floor(r * 1.15); // adjust the radius a little so our text's baseline isn't sitting directly on the circle
		var startX = r/2 - r;
		return 'M' + startX*2 + ',' + "1" + ' ' +
		  'a' + r + ',' + r + ' 0 0 0 ' + 2*r + ',0';
	}

	return {
		//init: init,
		debounce: debounce,
		closest: closest,
		random: random,
		getPathData: getPathData,
		isIE: isIE


	};

})();/*global window, document, app, navigator */
/*jshint bitwise: false*/

// source:
// http://rectangleworld.com/blog/archives/413

app.polypoints = (function () {
	'use strict';

	var setLinePoints = function(iterations) {
		var point;
		var pointList = {};
		pointList.first = {x:0, y:1};

		var lastPoint = {x:1, y:1};
		var nextPoint;
		var dx, newX, newY;

		pointList.first.next = lastPoint;

		for (var i = 0; i < iterations; i++) {
			point = pointList.first;

			while (point.next != null) {
				nextPoint = point.next;

				dx = nextPoint.x - point.x;
				newX = 0.5 * (point.x + nextPoint.x);
				newY = 0.5 * (point.y + nextPoint.y);
				newY += dx*(Math.random()*2 -1);

				var newPoint = {x:newX, y:newY};


				//put between points
				newPoint.next = nextPoint;
				point.next = newPoint;

				point = nextPoint;
			}
		}

		return pointList;

	}


	var getPolyPoints = function(minBallSize, maxBallSize) {
		var point;
		var rad;
		var twoPi = 2*Math.PI;
		var x0,y0;
		var phase = 0;

		//generate the random function that will be used to vary the radius, 9 iterations of subdivision
		var pointList = setLinePoints(6);

		var coordString = '';

		point = pointList.first;

		while (point.next) {
			point = point.next;
			phase = twoPi*point.x;
			rad = minBallSize + point.y*(maxBallSize - minBallSize);
			x0 = rad*Math.cos(phase);
			y0 = rad*Math.sin(phase);

			coordString = coordString + (Math.round(x0 * 100) / 100 + ',' + Math.round(y0 * 100) / 100 + ' ');
		}

		return coordString;

	}

	return {
		setLinePoints: setLinePoints,
		getPolyPoints: getPolyPoints

	};

})();/*global window, app, navigator */
/*jshint bitwise: false*/

app.balls = (function () {
	'use strict';

	var containerEl = app.globals.doc.getElementById('container');

	// OPTIONS
	var ballRoughness = 0.88, // 1 === perfect circle
		minBallSize = 30,
		maxBallSize = 75,

		spareCount = 5,
		spreadPush = 1.05, // how hard the balls push against each other
		spreadSpeed = 0.075;

	var appendedBalls = []; // store a reference to all balls in here, so we don't need to query the dom

	var dataModel =	[
		{
			href: '/item1',
			fill: 'url(#img1)',
			r: 90,
			text: 'Emerald Hill Zone',
			img: '/public/img/1.jpg'
		},
		{
			href: '/item1',
			fill: 'url(#img2)',
			r: 90,
			text: 'The amount of fucks I give',
			img: '1'
		},
		{
			href: '/item1',
			fill: 'url(#img3)',
			r: 90,
			text: 'CSS Cube using Accelerometer',
			img: ''
		},
		{
			href: '/item1',
			fill: 'url(#img4)',
			r: 90,
			text: 'hohokum in paper.js',
			img: ''
		}
	];

	//http://www.colourlovers.com/palette/396423/Praise_Certain_Frogs
	var ballColors = [
	  '#F4FCE8', // dark blue
	  '#C3FF68', // green
	  '#87D69B', // blue
	  '#4E9689', // metal blue
	  '#7ED0D6'
	];

	var innerWidthHalf = window.innerWidth / 2,
		innerHeightHalf = window.innerHeight / 2;

	var articleCount = dataModel.length;

	var createCircleCounter = 0;

	var createCircle = function(type) {

		// need to check that datamodel contains certain properties before we can assign to them
		var thisCircle = dataModel[createCircleCounter],
			checkDataModel = type !== 'spare' ? true : false;

		var href = checkDataModel ? thisCircle.href : null,
			img = checkDataModel ? thisCircle.img : null,
			text = checkDataModel ? thisCircle.text : null,
			r = checkDataModel ? thisCircle.r : app.utilities.random(minBallSize, maxBallSize),
			fill = checkDataModel ? thisCircle.fill : ballColors[Math.floor(Math.random() * ballColors.length)];


		var circleObj = {
			isTitleBall: false,
			href: href,
			img: img,
			fill: fill,
			text: text,
			id: createCircleCounter,
			x: innerWidthHalf + Math.random(),
			y: innerHeightHalf + Math.random(),
			vx: 0,
			vy: 0,
			positionX: 0,
			positionY: 0,
			dragVelocityX: 0,
			dragVelocityY: 0,
			dragForceY: 0,
			dragForceX: 0,
			velocityX: 0,
			velocityY: 0,

			dragStartPositionX: 0,
			dragStartPositionY: 0,
			r: r
		};


		if (type === 'title') {
			circleObj.isTitleBall = true;
			circleObj.fill = '#ddd';
			circleObj.r = 170;
		}
		if (type === 'article') {
			articleCount++;
		}
		if (type === 'spare') {
			spareCount++
		}

		createCircleCounter++;

		return circleObj;

	}


	var init = function () {




		var m,
			c,
			dx,
			dy,
			d,
			f,
			t,
			l,
			r,
			currentCircle;


		// ensure that the circles don't exceed the limit
		// could use work for better randomisation

		for (var i = 0; i < 10; i++) {
			app.globals.circleArr.push( createCircle('spare') );

		}
		// for (var i = 0; i < 2; i++) {
		// 	app.globals.circleArr.push( createCircle('article') );
		//
		// }


		function renderLoop() {

		    for (var i = 0; i < app.globals.circleArr.length; i++) {

		    	currentCircle = app.globals.circleArr[i];

		    	// circle packing, based off:
		    	// http://codepen.io/jun-lu/pen/rajrJx
		    	for (var j = 0; j < app.globals.circleArr.length; j++) {

		    		if (i === j) {
		    			continue; // skip this loop
		    		}

			    	c = app.globals.circleArr[j];
			    	d = (dx = c.x - currentCircle.x) * dx + (dy = c.y - currentCircle.y) * dy;
			    	l = (r = currentCircle.r + c.r) * r * spreadPush;

			    	if (d < l) {

			    		f = (1-d/l) * r;
			    		t = Math.atan2(dy, dx);

			    		// set right edge && left edge boundaries
			    		var hozBoundary = c.x + 20 < window.innerWidth - c.r && c.x > 20 + c.r, // 20 get away from edges in case text goes over boundary
			    			verBoundary = c.y + 60 < window.innerHeight - c.r && c.y > 0 + c.r; // +60 to keep some spacing at bottom for label

			    		// if the ball is over the boundary divide its movement by 100 so it doesn't disappear out of viewport
			    		c.vx += Math.cos( t ) * f / (hozBoundary ? 1 : 100);
			    		c.vy += Math.sin( t ) * f / (verBoundary ? 1 : 100);

			    	}

				}
				// end circle packing


				// CREATE NEW BALL
				if (!currentCircle.added) {

				    currentCircle.added = true;

					var groupEl = app.globals.doc.createElementNS('http://www.w3.org/2000/svg', 'g'),
						polygonEl = app.globals.doc.createElementNS('http://www.w3.org/2000/svg', 'polygon');

					groupEl.id = i;
					polygonEl.setAttribute('fill', currentCircle.fill);
					polygonEl.setAttribute('points', app.polypoints.getPolyPoints(currentCircle.r * ballRoughness, currentCircle.r));

					// ADD ANCHOR AND TEXT
					if (currentCircle.href) {
						var ballAnchor = app.globals.doc.createElementNS('http://www.w3.org/2000/svg', 'a'),
							path = app.globals.doc.createElementNS('http://www.w3.org/2000/svg', "path"),
							textPath = app.globals.doc.createElementNS('http://www.w3.org/2000/svg', "textPath");

						path.setAttribute("id", "textPath" + i);
						path.setAttribute("d", app.utilities.getPathData(currentCircle.r));

						textPath.setAttribute("startOffset", "50%"); // cheeky bastard
						textPath.setAttributeNS('http://www.w3.org/1999/xlink', "href", "#textPath" + i);
						textPath.innerHTML = currentCircle.text;

						groupEl.appendChild(path);

						var text = app.globals.doc.createElementNS('http://www.w3.org/2000/svg', "text");
							text.appendChild(textPath);

						ballAnchor.setAttribute('xlink:href', currentCircle.href);
						ballAnchor.appendChild(polygonEl);
						ballAnchor.appendChild(text);

						groupEl.appendChild(ballAnchor);

					} else {
						groupEl.appendChild(polygonEl);
					}

					// ADD TITLE
					if (currentCircle.isTitleBall) {
						var titleHTML = app.globals.doc.querySelector('#title');
						groupEl.appendChild(titleHTML);
					}

					/*if (currentCircle.img) {

						console.log(currentCircle.img);
						var foreignObj = app.globals.doc.createElementNS('http://www.w3.org/2000/svg',"foreignObject");
						var img = app.globals.doc.createElement('img');

						img.src = currentCircle.img;

						foreignObj.appendChild(img);
						groupEl.appendChild(foreignObj);


					}*/

					appendedBalls.push(groupEl);
					app.globals.svgEl.appendChild(groupEl);


			    // UPDATE EXISTING BALL
				} else {
					groupEl = appendedBalls[i];
				}

				currentCircle.vx *= spreadSpeed;
				currentCircle.vy *= spreadSpeed;

				var roundedY = Math.round((currentCircle.y+=currentCircle.vy) * 100) / 100,
					roundedX = Math.round((currentCircle.x+=currentCircle.vx) * 100) / 100;

				//http://stackoverflow.com/a/28776528
				if (app.utilities.isIE()) {
					groupEl.setAttribute('transform', 'translate(' + roundedX + ', '+ roundedY + ')');

				} else {
					groupEl.style.webkitTransform = 'translate3d(' + roundedX + 'px, '+roundedY+'px, 0)';
					groupEl.style.transform = 'translate3d(' + roundedX + 'px, ' + roundedY + 'px, 0)';
				}

		    }



		    app.interaction.updateInertia();

		    app.globals.animating = window.requestAnimationFrame(renderLoop);

		}


		function startAnimationLoop() {
		    if (!app.globals.animating) {
		       renderLoop();
		    }
		}


		function stopAnimationLoop() {
		    if (app.globals.animating) {
		       window.cancelAnimationFrame(app.globals.animating);
		       app.globals.animating = undefined;
		    }
		}


		startAnimationLoop();

		setTimeout(function() {

			//stopAnimationLoop();

		}, 1000);

		// punch in the title card
		/*setTimeout(function() {
			app.globals.circleArr.push( createCircle('title') );
		}, 1200);*/


	};


	return {
		init: init,
		createCircle: createCircle,
		renderLoop: init.renderLoop
	};

})();
/*global window, app.globals.doc, app, navigator */
/*jshint bitwise: false*/


// http://codepen.io/desandro/pen/QbPKEq?editors=001

app.interaction = (function () {
	'use strict';


	var cursorPos = [],

		// particle properties
		velocityX = 0,
		velocityY = 0,

		friction = 0.85,
		isDragging = false,

		mouseBallHeld = '',

		mousedownX,
		mousedownY,

		leftBound = 0,
		topBound = 0;

	var	positionX = null;
	var	positionY = null;
	var dragPositionX = positionX;
	var dragPositionY = positionY;

	var dragStartPositionX = null;
	var dragStartPositionY = null;

	function applyForce( forceX, forceY ) {
			velocityX += forceX;
		if (forceX) {
		}
			velocityY += forceY;
		if (forceY) {
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

		console.log(e);

		var moveX = e.pageX - mousedownX;
		var moveY = e.pageY - mousedownY;
	  dragPositionX = dragStartPositionX + moveX;
	  dragPositionY = dragStartPositionY + moveY;

		app.globals.circleArr[currentBall].x = dragStartPositionX + moveX;
		app.globals.circleArr[currentBall].y = dragStartPositionY + moveY;
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

					positionX = app.globals.circleArr[mouseBallHeld].x;
					positionY = app.globals.circleArr[mouseBallHeld].y;
					mousedownX = e.pageX;
					mousedownY = e.pageY;
					dragStartPositionX = positionX;
					dragStartPositionY = positionY;

					setDragPosition( e, mouseBallHeld );

				}

			});

		});


		app.globals.doc.addEventListener('mousemove', function(e) {

			if (isDragging) {

				setDragPosition(e, mouseBallHeld);

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

							// this is a click
							el.setAttribute('class', 'active');

						}, 0)

					}

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

					mouseBallHeld = el.id;
					isDragging = true;

					positionX = app.globals.circleArr[mouseBallHeld].x;
					positionY = app.globals.circleArr[mouseBallHeld].y;
					mousedownX = e.pageX;
					mousedownY = e.pageY;
					dragStartPositionX = positionX;
					dragStartPositionY = positionY;

					setDragPosition( e, mouseBallHeld );

				}

				if (el.tagName === 'g') {


					//
					// for (var i = 0; i < touchBallsHeld.length; i++) {
					//
					//
					// 	var thisBall = touchBallsHeld[i];
					// 	console.log(dragStartPositionX);
					//
					// 	positionX = app.globals.circleArr[thisBall].x;
					// 	positionY = app.globals.circleArr[thisBall].y;
					// 	mousedownX = e.pageX;
					// 	mousedownY = e.pageY;
					// 	dragStartPositionX = positionX;
					// 	dragStartPositionY = positionY;
					//
					// 	setDragPosition( e.touches[i], thisBall );
					//
					// }


					//app.globals.circleArr[mouseBallHeld].dragStartPositionX = e.pageX;
					//app.globals.circleArr[mouseBallHeld].dragStartPositionY = e.pageY;

				}

			});
		});

		app.globals.doc.addEventListener('touchmove', function(e) {

			if (isDragging) {



				for (var i = 0; i < e.touches.length; i++) {
					//setDragPosition(e.touches[i], mouseBallHeld);

					setDragPosition( e.touches[i], touchBallsHeld[i] );

				}

			}

			e.preventDefault();

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
/*global window, document, app, navigator */
/*jshint bitwise: false*/

app.resize = (function () {
	'use strict';


	var ballsBrowserResize = app.utilities.debounce(function() {


		app.globals.w = window.innerWidth;
		app.globals.h = window.innerHeight;

		// need to remove balls if small, add if large

		// reset ball position just like on init
		app.globals.circleArr.forEach(function(el) {

			el.x = (app.globals.w/2) + Math.random();
			el.y = (app.globals.h/2) + Math.random();

		});



	}, 500);

	var init = function () {

		window.addEventListener('resize', ballsBrowserResize);

	};




	return {
		init: init



	};

})();

window.onload = function() {
    'use strict';

    app.globals.doc.documentElement.classList.remove('no-js');

    // initialise modules
    app.balls.init();
    app.interaction.init();
    app.resize.init();


    // initiate FastClick
    //FastClick.attach(document.body);


};