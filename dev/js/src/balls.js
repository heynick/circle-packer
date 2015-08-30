/*global window, app, navigator */
/*jshint bitwise: false*/




app.balls = (function () {
	'use strict';

	var containerEl = app.globals.doc.getElementById('container');

	// OPTIONS
	var minBallSize = 5,
		maxBallSize = 60,
		ballRoughness = 0.8, // 1 === perfect circle
		spareCount = 20,
		spreadPush = 1.1, // how hard the balls push against each other
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
			fill: '#4E9689',
			r: 90,
			text: 'The amount of fucks I give',
			img: '/'
		},
		{
			href: '/item1',
			fill: '#4E9689',
			r: 90,
			text: 'CSS Cube using Accelerometer',
			img: '/'
		},
		{
			href: '/item1',
			fill: '#4E9689',
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

	var innerWidthHalf = window.innerWidth / 2,
		innerHeightHalf = window.innerHeight / 2;

	var articleCount = dataModel.length;

	var createCircleCounter = 0;
	var createCircle = function(type) {

		// need to check that datamodel contains certain properties before we can assign to them
		var thisCircle = dataModel[createCircleCounter],
			checkDataModel = thisCircle ? true : false;

		var href = checkDataModel ? thisCircle.href : null,
			img = checkDataModel ? thisCircle.img : '/',
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
		if (type === 'spareCount') {
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

		    // ensure that the circles don't exceed the limit
		    // could use work for better randomisation
		    if (app.globals.circleArr.length < spareCount) {
		    	app.globals.circleArr.push( createCircle('spare') );
		    }
		    if (app.globals.circleArr.length < articleCount) {
		    	app.globals.circleArr.push( createCircle('article') );
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