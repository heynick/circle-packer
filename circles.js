// http://davidwalsh.name/javascript-debounce-function
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
var minRad = 10;

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
		text: 'hohokum in paper.js',
		img: '/'
	},
	{
		href: '/item2',
		fill: '#ccc',
		r: 30,
		img: '/image'
	}
];

var ballColors = [
  '#F4FCE8', // dark blue
  '#C3FF68', // green
  '#87D69B', // blue
  '#4E9689', // metal blue
  '#7ED0D6'
];

var articleCount = dataModel.length;
var spareCount = 40;

var innerWidth = window.innerWidth;
var innerHeight = window.innerHeight;

var circleCount = 0;

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
		circleObj.href = '/home.html';
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

function addTextLabel(el) {

}

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
	    		if (c.y < innerHeight - c.r && c.y > 0 + c.r) {
		    		c.vy += Math.sin( t ) * f;
	    		}


	    	}


		}

		// end circle packing


		if (!currentCircle.added) {

		    currentCircle.added = true;


			var polygonEl = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
				polygonEl.setAttribute('fill', currentCircle.fill);
				polygonEl.setAttribute('points', getPolyPoints(currentCircle.r*0.80, currentCircle.r));

			var groupEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
				groupEl.id = 'circ-' + (i);


			if (currentCircle.href) {
				var ballA = document.createElementNS('http://www.w3.org/2000/svg', 'a');
					ballA.setAttribute('xlink:href', currentCircle.href);
				ballA.addEventListener('click', function(e) {
					svgEl.appendChild(e.target.parentNode.parentNode.parentNode);
					e.target.parentNode.parentNode.parentNode.classList.add('open');

					setTimeout(function() {

						e.target.parentNode.parentNode.classList.add('active');

					}, 0)
				});
			}


			// create the anchor
			if (!currentCircle.title && currentCircle.href) {



		    } else {

		    	var titleGroupWrapper = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		    	var newText = document.querySelector('#fo');
		    	titleGroupWrapper.setAttribute('x', currentCircle.x );
		    	titleGroupWrapper.setAttribute('y', currentCircle.y );
		    	titleGroupWrapper.id = 'circ-' + (i);

		    }



		} else {
			// has already been added, so update an existing ball.
			var groupEl = document.querySelector('#circ-' + i);

			if (currentCircle.title) {
				var titleGroupWrapper = document.querySelector('#circ-' + i);
			}
		}

		var spreadSpeed = 0.06;
		currentCircle.vx *= spreadSpeed;
		currentCircle.vy *= spreadSpeed;

		var roundedY = Math.round((currentCircle.y+=currentCircle.vy) * 100) / 100;
		var roundedX = Math.round((currentCircle.x+=currentCircle.vx) * 100) / 100;

		if (!currentCircle.title) {
			groupEl.style.webkitTransform = 'translateY(' + roundedY + 'px) translateX('+ roundedX +'px)';
			groupEl.style.transform = 'translateY(' + roundedY + 'px) translateX('+ roundedX +'px)';

		} else {

			titleGroupWrapper.style.webkitTransform = 'translateY(' + roundedY + 'px) translateX('+ roundedX +'px)';
			titleGroupWrapper.style.transform = 'translateY(' + roundedY + 'px) translateX('+ roundedX +'px)';
		}



		// only append if it doesn't already exist
		if (!document.querySelector('#circ-' + i)) {
			if (currentCircle.title) {
				titleGroupWrapper.appendChild(newText);
				titleGroupWrapper.appendChild(polygonEl);


				//groupEl.appendChild(titleGroupWrapper);
				svgEl.appendChild(titleGroupWrapper);
			} else {

				//var defs = document.createElementNS('http://www.w3.org/2000/svg', "defs");
				var path = document.createElementNS('http://www.w3.org/2000/svg', "path");
				path.setAttribute("id", "textPath" + i);
				path.setAttribute("d", getPathData(currentCircle.r));

				groupEl.appendChild(path);
				//ball.appendChild(defs);

				if (currentCircle.text) {

					var textPath = document.createElementNS('http://www.w3.org/2000/svg', "textPath");
						textPath.setAttribute("startOffset", "50%"); // cheeky bastard
						textPath.setAttributeNS('http://www.w3.org/1999/xlink', "href", "#textPath" + i);
						textPath.innerHTML = currentCircle.text;

					var text = document.createElementNS('http://www.w3.org/2000/svg', "text");
						text.appendChild(textPath);

				}



				if (ballA) {
					groupEl.appendChild(ballA);
					ballA.appendChild(polygonEl);

					if (currentCircle.text) {

						ballA.appendChild(text);
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

}, 2000);

// punch in the title card
setTimeout(function() {
	circleArr.push( createCircle('title') );
}, 1200);

// maybe put this in a konami code
/*document.addEventListener('mousemove', function(e) {
	circleArr[30].x = e.x;
	circleArr[30].y = e.y;
});*/


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


}, 250);