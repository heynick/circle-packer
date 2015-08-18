

window.onload = function() {
    'use strict';

    document.documentElement.classList.remove('no-js');

    // initialise modules

    app.utilities.init();

    app.balls.init();
    app.dragging.init();


    // initiate FastClick
    //FastClick.attach(document.body);


};