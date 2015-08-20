/*global window, app, navigator */
/*jshint bitwise: false*/


app.balls = (function () {
	'use strict';

	var containerEl = app.globals.doc.getElementById('container');

	// OPTIONS
	var minRad = 5,
		maxRad = 60,
		spareCount = 21,
		pushSpread = 1, // how hard the balls push against each other
		spreadSpeed = 0.06;

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

	var createCircleCounter = 0;
	var createCircle = function(type) {

		// need to check that datamodel contains certain properties before we can assign to them
		var thisCircle = dataModel[createCircleCounter],
			checkDataModel = thisCircle ? true : false;

		var href = checkDataModel ? thisCircle.href : null,
			img = checkDataModel ? thisCircle.img : '/',
			text = checkDataModel ? thisCircle.text : null,
			r = checkDataModel ? thisCircle.r : app.utilities.random(minRad, maxRad),
			fill = checkDataModel ? thisCircle.fill : ballColors[Math.floor(Math.random() * ballColors.length)];


		var circleObj = {
			href: href,
			img: img,
			fill: fill,
			text: text,
			id: createCircleCounter,
			x: window.innerWidth/2 + Math.random(),
			y: window.innerHeight/2 + Math.random(),
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

		createCircleCounter++;

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

		var groupEl;

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
			    	l = (r = currentCircle.r + c.r) * r * pushSpread;

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

					var polygonEl = app.globals.doc.createElementNS('http://www.w3.org/2000/svg', 'polygon');
						polygonEl.setAttribute('fill', currentCircle.fill);
						polygonEl.setAttribute('points', getPolyPoints(currentCircle.r*0.8, currentCircle.r));


					groupEl = app.globals.doc.createElementNS('http://www.w3.org/2000/svg', 'g');
					groupEl.id = i;
					appendedBalls.push(groupEl);


					// ADD ANCHOR
					if (currentCircle.href) {
						var ballAnchor = app.globals.doc.createElementNS('http://www.w3.org/2000/svg', 'a');
							ballAnchor.setAttribute('xlink:href', currentCircle.href);

					}

					// ADD TITLE
					if (currentCircle.title) {
			    		var titleHTML = app.globals.doc.querySelector('#title');
						groupEl.appendChild(titleHTML);
					}



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
					groupEl.setAttribute('transform', 'translate(' + roundedX + ', '+ roundedY+')');

				} else {
					//groupEl.style.webkitTransform = 'translate3d(' + roundedX + 'px, '+roundedY+'px, 0)';
					groupEl.style.transform = 'translate3d(' + roundedX + 'px, '+roundedY+'px, 0)';
				}


				// only append if it doesn't already exist
				if (!app.globals.doc.getElementById(i)) {


					// ADD TEXT LABEL
					if (currentCircle.text) {
						var path = app.globals.doc.createElementNS('http://www.w3.org/2000/svg', "path");
						path.setAttribute("id", "textPath" + i);
						path.setAttribute("d", app.utilities.getPathData(currentCircle.r));

						groupEl.appendChild(path);

						var textPath = app.globals.doc.createElementNS('http://www.w3.org/2000/svg', "textPath");
							textPath.setAttribute("startOffset", "50%"); // cheeky bastard
							textPath.setAttributeNS('http://www.w3.org/1999/xlink', "href", "#textPath" + i);
							textPath.innerHTML = currentCircle.text;

						var text = app.globals.doc.createElementNS('http://www.w3.org/2000/svg', "text");
							text.appendChild(textPath);

						groupEl.appendChild(ballAnchor);
						ballAnchor.appendChild(polygonEl);

						ballAnchor.appendChild(text);

					}



					if (currentCircle.href) {


					} else if (polygonEl) {

						groupEl.appendChild(polygonEl);
						if (currentCircle.text) {
							groupEl.appendChild(text);

						}
					}

			      	app.globals.svgEl.appendChild(groupEl);
				}


		    }

		    // ensure that the circles don't exceed the limit
		    // this needs work for better randomisation
		    if (app.globals.circleArr.length < articleCount) {
		    	app.globals.circleArr.push( createCircle('article') );
		    }
		    if (app.globals.circleArr.length < spareCount) {
		    	app.globals.circleArr.push( createCircle('spare') );
		    }

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
		setTimeout(function() {
			app.globals.circleArr.push( createCircle('title') );
		}, 1200);


	};


	return {
		init: init,
		createCircle: createCircle,
		renderLoop: init.renderLoop
	};

})();