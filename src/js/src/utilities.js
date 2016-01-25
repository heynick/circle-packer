/*global window, app, navigator */
/*jshint bitwise: false*/

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



module.exports['debounce'] = debounce
module.exports['closest'] = closest
module.exports['random'] = random
module.exports['getPathData'] = getPathData
module.exports['isIE'] = isIE
