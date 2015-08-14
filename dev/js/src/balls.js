/*global window, document, app, navigator */
/*jshint bitwise: false*/


app.circleArr = []; // store outside so can be accessed globally

app.balls = (function () {
	'use strict';

	var svgEl = document.querySelector('svg'),
		containerEl = document.getElementById('container');

	var activeBall; // currently active article


	var minRad = 5;
	var maxRad = 60;

	var appendedBalls = []; // store a reference to all balls in here, so we don't need to query the dom

	var dataModel =	[
		{
			href: '/item1',
			fill: 'url(#image)',
			r: 90,
			text: 'Emerald Hill Zone',
			img: '/'
		},
		{
			href: '/item1',
			fill: 'aquamarine',
			r: 90,
			text: 'The amount of fucks I give',
			img: '/'
		},
		{
			href: '/item1',
			fill: 'aquamarine',
			r: 90,
			text: 'CSS Cube using Accelerometer',
			img: '/'
		},
		{
			href: '/item1',
			fill: 'aquamarine',
			r: 90,
			text: 'hohokum in paper.js',
			img: '/'
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


	var articleCount = dataModel.length;
	var spareCount = 40;
	var pushSpread = 1; // how hard the balls push against each other

	var innerWidth = window.innerWidth;
	var innerHeight = window.innerHeight;

	var circleCount = 0;
	var spreadSpeed = 0.06;

	var animating;

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


	var createCircle = function(type) {

		var href = dataModel[circleCount] ? dataModel[circleCount].href : null,
			img = dataModel[circleCount] ? dataModel[circleCount].img : '/',
			text = dataModel[circleCount] ? dataModel[circleCount].text : null,
			r = dataModel[circleCount] ? dataModel[circleCount].r : app.utilities.random(minRad, maxRad),
			fill = dataModel[circleCount] ? dataModel[circleCount].fill : ballColors[Math.floor(Math.random() * ballColors.length)];


		var circleObj = {

				href: href,
				img: img,
				fill: fill,
				text: text,
				id: circleCount,
				x: innerWidth/2 + Math.random(),
				y: innerHeight/2 + Math.random(),
				vx: 0,
				vy: 0,
				r: r

		};

		if (type === 'title') {
			circleObj.title = true;
			circleObj.fill = '#ddd';
			circleObj.r = 170;
		}
		if (type === 'article') {
			articleCount++;
		}
		if (type === 'spareCount') {
			spareCount++
		}

		circleCount++;

		return circleObj;

	}

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


	var getPolyPoints = function(minRad, maxRad) {
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
			rad = minRad + point.y*(maxRad - minRad);
			x0 = rad*Math.cos(phase);
			y0 = rad*Math.sin(phase);

			coordString = coordString + (Math.round(x0 * 100) / 100 + ',' + Math.round(y0 * 100) / 100 + ' ');
		}

		return coordString;

	}



	var init = function () {

		var groupEl;



		function renderLoop() {

		    for (var i = 0; i < app.circleArr.length; i++) {

		    	currentCircle = app.circleArr[i];

		    	// circle packing, based off:
		    	// http://codepen.io/jun-lu/pen/rajrJx
		    	for (var j = 0; j < app.circleArr.length; j++) {

		    		if (i === j) {
		    			continue; // skip this loop
		    		}

			    	c = app.circleArr[j];
			    	d = (dx = c.x - currentCircle.x) * dx + (dy = c.y - currentCircle.y) * dy;
			    	l = (r = currentCircle.r + c.r) * r * pushSpread;

			    	if (d < l) {

			    		f = (1-d/l) * r;
			    		t = Math.atan2(dy, dx);

			    		// right edge && left edge

			    		var hozRestriction = c.x < innerWidth - c.r && c.x > 0 + c.r,
			    			vertRestriction = c.y + 60 < innerHeight - c.r && c.y > 0 + c.r; // +60 to keep some spacing at bottom for label

			    		// if the ball is over the edges divide its movement by 100 so it doesn't disappear out of viewport
			    		c.vx += Math.cos( t ) * f / (hozRestriction ? 1 : 100);
			    		c.vy += Math.sin( t ) * f / (vertRestriction ? 1 : 100);

			    	}

				}
				// end circle packing


				// CREATE NEW BALL
				if (!currentCircle.added) {

				    currentCircle.added = true;

					var polygonEl = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
						polygonEl.setAttribute('fill', currentCircle.fill);
						polygonEl.setAttribute('points', getPolyPoints(currentCircle.r*0.80, currentCircle.r));


					groupEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
					groupEl.id = i;
					appendedBalls.push(groupEl);


					// ADD ANCHOR
					if (currentCircle.href) {
						var ballAnchor = document.createElementNS('http://www.w3.org/2000/svg', 'a');
							ballAnchor.setAttribute('xlink:href', currentCircle.href);

						ballAnchor.addEventListener('click', function(e) {
							e.preventDefault();


							app.utilities.closest(e.target, function(el) {

								if (el.tagName === 'a') {
									//containerEl.classList.add('open');
									svgEl.appendChild(el.parentNode);
									activeBall = el;

									setTimeout(function() {

										el.classList.add('active');

									}, 0)

								}

							});


						});

					}

					if (currentCircle.title) {
			    		var titleHTML = document.querySelector('#title');
						groupEl.appendChild(titleHTML);
					}



			    // UPDATE EXISTING BALL
				} else {
					groupEl = appendedBalls[i];
				}

				currentCircle.vx *= spreadSpeed;
				currentCircle.vy *= spreadSpeed;

				var roundedY = Math.round((currentCircle.y+=currentCircle.vy) * 100) / 100;
				var roundedX = Math.round((currentCircle.x+=currentCircle.vx) * 100) / 100;

				groupEl.style.webkitTransform = 'translateY(' + roundedY + 'px) translateX('+ roundedX +'px)';
				groupEl.style.transform = 'translateY(' + roundedY + 'px) translateX('+ roundedX +'px)';

				//http://stackoverflow.com/a/28776528

				if ('ie') { // sort this out later
					var transVal = getComputedStyle(groupEl).getPropertyValue('transform');
					groupEl.setAttribute('transform', transVal);

				}


				// only append if it doesn't already exist
				if (!document.getElementById(i)) {


					// ADD TEXT LABEL
					if (currentCircle.text) {
						var path = document.createElementNS('http://www.w3.org/2000/svg', "path");
						path.setAttribute("id", "textPath" + i);
						path.setAttribute("d", app.utilities.getPathData(currentCircle.r));

						groupEl.appendChild(path);
						//ball.appendChild(defs);

						var textPath = document.createElementNS('http://www.w3.org/2000/svg', "textPath");
							textPath.setAttribute("startOffset", "50%"); // cheeky bastard
							textPath.setAttributeNS('http://www.w3.org/1999/xlink', "href", "#textPath" + i);
							textPath.innerHTML = currentCircle.text;

						var text = document.createElementNS('http://www.w3.org/2000/svg', "text");
							text.appendChild(textPath);

					}



					if (ballAnchor) {
						groupEl.appendChild(ballAnchor);
						ballAnchor.appendChild(polygonEl);

						if (currentCircle.text) {

							ballAnchor.appendChild(text);
						}

					} else if (polygonEl){

						groupEl.appendChild(polygonEl);
						if (currentCircle.text) {
							groupEl.appendChild(text);

						}
					}

			      	svgEl.appendChild(groupEl);
				}


		    }

		    // ensure that the circles don't exceed the limit
		    if (app.circleArr.length < articleCount) {
		    	app.circleArr.push( createCircle('article') );
		    }
		    if (app.circleArr.length < spareCount) {
		    	app.circleArr.push( createCircle('spare') );
		    }

		    animating = window.requestAnimationFrame(renderLoop);

		}


		function startAnimationLoop() {
		    if (!animating) {
		       renderLoop();
		    }
		}


		function stopAnimationLoop() {
		    if (animating) {
		       window.cancelAnimationFrame(animating);
		       animating = undefined;
		    }
		}


		startAnimationLoop();

		setTimeout(function() {

			//stopAnimationLoop();

		}, 1000);

		// punch in the title card
		setTimeout(function() {
			app.circleArr.push( createCircle('title') );
		}, 1200);



		document.onkeydown = function(e) {
		    e = e || window.event;
		    if (e.keyCode == 27) {

		        setTimeout(function() {
		        	activeBall.classList.remove('active');
		        }, 0)
		    }
		};



	};



	return {
		init: init,
		createCircle: createCircle
	};

})();