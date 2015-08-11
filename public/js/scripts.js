console.log('start');// http://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
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
function closest(el, fn) {
    return el && (
        fn(el) ? el : closest(el.parentNode, fn)
    );
}


function random( min, max ){
	return parseInt( Math.random() * (max - min) + min);
}

// http://bl.ocks.org/jebeck/196406a3486985d2b92e
function getPathData(r) {
	// adjust the radius a little so our text's baseline isn't sitting directly on the circle
	r = Math.floor(r * 1.15);
	var startX = r/2 - r;
	return 'M' + startX*2 + ',' + "1" + ' ' +
	  'a' + r + ',' + r + ' 0 0 0 ' + 2*r + ',0';
}



var svgEl = document.querySelector('svg');


var maxRad = 60;
var minRad = 5;

var circleArr = [];

var dataModel =	[
	{
		href: '/item1',
		fill: 'url(#image)',
		r: 90,
		text: 'Emerald hill zone',
		img: '/'
	},
	{
		href: '/item1',
		fill: 'aquamarine',
		r: 90,
		text: 'The amount of fucks i give',
		img: '/'
	},
	{
		href: '/item1',
		fill: 'aquamarine',
		r: 90,
		text: 'CSS Cube using accelerometer',
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
var spareCount = 60;

var innerWidth = window.innerWidth;
var innerHeight = window.innerHeight;

var circleCount = 0;
var spreadSpeed = 0.06;


function createCircle(type) {

	var href = dataModel[circleCount] ? dataModel[circleCount].href : null,
		img = dataModel[circleCount] ? dataModel[circleCount].img : '/',
		text = dataModel[circleCount] ? dataModel[circleCount].text : null,
		r = dataModel[circleCount] ? dataModel[circleCount].r : random(minRad, maxRad),
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

var animating;

var m,
	c,
	dx,
	dy,
	d,
	f,
	l,
	r,
	currentCircle;


function renderLoop(){

    for (var i = 0; i < circleArr.length; i++) {

    	// circle packing
    	// http://codepen.io/jun-lu/pen/rajrJx
    	currentCircle = circleArr[i];

    	for (var j = 0; j < circleArr.length; j++) {

    		if (i === j) {
    			continue; // skip this loop
    		}

	    	c = circleArr[j];
	    	d = (dx = c.x - currentCircle.x) * dx + (dy = c.y - currentCircle.y) * dy;
	    	l = (r = currentCircle.r + c.r) * r;

	    	if (d < l) {

	    		f = (1-d/l) * r;
	    		t = Math.atan2(dy, dx);

	    		// right edge && left edge
	    		if (c.x < innerWidth - c.r && c.x > 0 + c.r) {
	    			c.vx += Math.cos( t ) * f;
	    		}

	    		// bottom edge && top edge
	    		// +60 to keep some spacing at bottom for label
	    		if (c.y + 60 < innerHeight - c.r && c.y > 0 + c.r) {
		    		c.vy += Math.sin( t ) * f;
	    		}


	    	}


		}

		// end circle packing

		// CREATE NEW BALL
		if (!currentCircle.added) {

		    currentCircle.added = true;


			var polygonEl = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
				polygonEl.setAttribute('fill', currentCircle.fill);
				polygonEl.setAttribute('points', getPolyPoints(currentCircle.r*0.80, currentCircle.r));

			var groupEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
				groupEl.id = 'circ-' + (i);


			// ADD ANCHOR
			if (currentCircle.href) {
				var ballAnchor = document.createElementNS('http://www.w3.org/2000/svg', 'a');
					ballAnchor.setAttribute('xlink:href', currentCircle.href);

				ballAnchor.addEventListener('click', function(e) {
					e.preventDefault();

					//console.dir(e.target.tagName);

					closest(e.target, function(el) {
						//console.log(el.tagName);

						if (el.tagName === 'a') {
							el.parentNode.parentNode.classList.add('open');
							svgEl.appendChild(el.parentNode);

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
			var groupEl = document.querySelector('#circ-' + i);
		}

		currentCircle.vx *= spreadSpeed;
		currentCircle.vy *= spreadSpeed;

		var roundedY = Math.round((currentCircle.y+=currentCircle.vy) * 100) / 100;
		var roundedX = Math.round((currentCircle.x+=currentCircle.vx) * 100) / 100;

		groupEl.style.webkitTransform = 'translateY(' + roundedY + 'px) translateX('+ roundedX +'px)';
		groupEl.style.transform = 'translateY(' + roundedY + 'px) translateX('+ roundedX +'px)';


		// only append if it doesn't already exist
		if (!document.querySelector('#circ-' + i)) {


			// ADD TEXT LABEL
			if (currentCircle.text) {
				var path = document.createElementNS('http://www.w3.org/2000/svg', "path");
				path.setAttribute("id", "textPath" + i);
				path.setAttribute("d", getPathData(currentCircle.r));

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

			} else {

				groupEl.appendChild(polygonEl);
				if (currentCircle.text) {
					groupEl.appendChild(text);

				}
			}

	      	svgEl.appendChild(groupEl);
		}


    }

    // ensure that the circles don't exceed the limit
    if (circleArr.length < articleCount) {
    	circleArr.push( createCircle('article') );
    }
    if (circleArr.length < spareCount) {
    	circleArr.push( createCircle('spare') );
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

}, 20000);

// punch in the title card
setTimeout(function() {
	circleArr.push( createCircle('title') );
}, 1200);

// maybe put this in a konami code
document.addEventListener('mousemove', function(e) {
	if (e.shiftKey) {

		circleArr[1].x = e.x;
		circleArr[1].y = e.y;
	}
});


function setLinePoints(iterations) {
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


function getPolyPoints(minRad, maxRad) {
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


var ballsBrowserResize = debounce(function() {


	w = window.innerWidth;
	h = window.innerHeight;

	document.querySelectorAll('g').remove();


}, 250);console.log('end');