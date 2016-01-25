/*global window, app.globals.doc, app, navigator */
/*jshint bitwise: false*/


// http://codepen.io/desandro/pen/QbPKEq?editors=001

var mouseBallHeldArr = [];

app.interaction = (function () {
    'use strict';


    var cursorPos = [],

        friction = 0.85,
        isDragging = false,

        mouseBallHeld = '',

        mousedownX = 0,
        mousedownY = 0,

        leftBound = 0,
        topBound = 0;


    function applyForce( forceX, forceY ) {
        mouseBallHeldArr.forEach(function(e) {


        });
    }


    function applyBoundForce() {

            mouseBallHeldArr.forEach(function(e) {


                if ( isDragging || app.globals.circleArr[e].positionX < app.globals.w && app.globals.circleArr[e].positionX > leftBound && app.globals.circleArr[e].positionY < app.globals.h && app.globals.circleArr[e].positionY > topBound) {
                    return;
                }

                // bouncing past bound
                var distanceX = app.globals.w - app.globals.circleArr[e].positionX,
                    distanceY = app.globals.h - app.globals.circleArr[e].positionY,

                    forceX = distanceX * 0.1,
                    forceY = distanceY * 0.1,

                    distanceYtop = topBound - app.globals.circleArr[e].positionY,
                    distanceXleft = leftBound - app.globals.circleArr[e].positionX,
                    forceXleft = distanceXleft * 0.1,
                    forceYtop = distanceYtop * 0.1;

                // calculate resting position with this force


                var restX = app.globals.circleArr[e].positionX + ( app.globals.circleArr[e].velocityX + forceX ) / ( 1 - friction ),
                    restY = app.globals.circleArr[e].positionY + ( app.globals.circleArr[e].velocityY + forceY ) / ( 1 - friction ),

                    restYneg = app.globals.circleArr[e].positionY + ( app.globals.circleArr[e].velocityY + forceYtop ) / ( 1 - friction ),
                    restXneg = app.globals.circleArr[e].positionX + ( app.globals.circleArr[e].velocityX + forceXleft ) / ( 1 - friction );


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

            });


    }

    function applyDragForce() {
        if ( !isDragging ) {
            return;
        }

        mouseBallHeldArr.forEach(function(e) {


            app.globals.circleArr[e].dragVelocityX = app.globals.circleArr[e].x - app.globals.circleArr[e].positionX;
            app.globals.circleArr[e].dragVelocityY = app.globals.circleArr[e].y - app.globals.circleArr[e].positionY;

            app.globals.circleArr[e].dragForceX = app.globals.circleArr[e].dragVelocityX - app.globals.circleArr[e].velocityX;
            app.globals.circleArr[e].dragForceY = app.globals.circleArr[e].dragVelocityY - app.globals.circleArr[e].velocityY;


            app.globals.circleArr[e].velocityX += app.globals.circleArr[e].dragForceX;
            app.globals.circleArr[e].velocityY += app.globals.circleArr[e].dragForceY;


        });

    }


    function setDragPosition( e, currentBall ) {

        var moveX = e.pageX - mousedownX;
        var moveY = e.pageY - mousedownY;

        mouseBallHeldArr.forEach(function(e) {
            app.globals.circleArr[e].x = app.globals.circleArr[e].dragStartPositionX + moveX;
            app.globals.circleArr[e].y = app.globals.circleArr[e].dragStartPositionY + moveY;

        });

        //e.preventDefault();

    }

    var updateInertia = function() {

        applyBoundForce();

        applyDragForce();

        mouseBallHeldArr.forEach(function(e) {

            //if (mouseBallHeldArr) {

                //console.log(app.globals.circleArr[e])

                app.globals.circleArr[e].velocityX *= friction;
                app.globals.circleArr[e].velocityY *= friction;

                app.globals.circleArr[e].positionX += app.globals.circleArr[e].velocityX;
                app.globals.circleArr[e].positionY += app.globals.circleArr[e].velocityY;

                /*app.globals.circleArr[e].x = app.globals.circleArr[e].positionX;
                app.globals.circleArr[e].y = app.globals.circleArr[e].positionY;*/

            //}

        });

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


            app.utilities.closest(e.target, function(el) {

                if (el.tagName === 'g') {

                    cursorPos = [e.pageX, e.pageY];

                    el.setAttribute('class', 'held');

                    mouseBallHeld = parseInt(el.id, 10);

                    mouseBallHeldArr.push(mouseBallHeld);

                    isDragging = true;
                    mousedownX = e.pageX;
                    mousedownY = e.pageY;


                    app.globals.circleArr[mouseBallHeld].dragStartPositionX = e.pageX;
                    app.globals.circleArr[mouseBallHeld].dragStartPositionY = e.pageY;







                }

            });



        });

        app.globals.doc.addEventListener('mousemove', function(e) {

            if (isDragging) {

                app.utilities.closest(e.target, function(el) {

                    if (el.tagName === 'g') {

                        setDragPosition(e, el.id);


                    }
                });

            }

        });


        app.globals.doc.addEventListener('mouseup', function(e) {

            if (isDragging) {
                // gotta do it this way because user could mouseup on a different element
                // which would wreck the closest loop
                mouseBallHeldArr.forEach(function(e) {


                    app.globals.doc.getElementById(e).setAttribute('class', '');


                });



                app.utilities.closest(e.target, function(el) {

                    mouseBallHeldArr.splice(el.id, 1);

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
                app.globals.doc.removeEventListener( 'mousemove' );
                app.globals.doc.removeEventListener( 'mouseup' );


            }


        });

    };

    var touch = function() {

        var touchBallsHeld = [];

        app.globals.doc.addEventListener('touchmove', function(e) {

            e.preventDefault();


            if (touchBallsHeld.length) {


                for (var i = 0; i < e.touches.length; i++) {

                    //console.log(e.touches.length);
                    app.globals.circleArr[touchBallsHeld[i]].x = e.touches[i].pageX;
                    app.globals.circleArr[touchBallsHeld[i]].y = e.touches[i].pageY;
                    //console.log(touchBallsHeld);
                }

            }


        });





        app.globals.doc.addEventListener('touchstart', function(e) {

            app.utilities.closest(e.target, function(el) {

                if (el.tagName === 'g') {

                    el.setAttribute('class', 'held');


                    touchBallsHeld.push(el.id);
                    console.log(touchBallsHeld);

                }

            });
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

