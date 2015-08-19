

window.onload = function() {
    'use strict';

    app.globals.doc.documentElement.classList.remove('no-js');

    // initialise modules

    app.utilities.init();

    app.balls.init();
    app.dragging.init();


    // initiate FastClick
    //FastClick.attach(document.body);


};