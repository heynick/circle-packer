

window.onload = function() {
    'use strict';

    document.documentElement.classList.remove('no-js');

    // initialise modules

    app.utilities.init();

    app.balls.init();
    app.dragging.init();




/*    app.balls.init();
    app.articles.init();
    app.articles.filter();
    app.ui.init();
*/
    // initiate FastClick
    //FastClick.attach(document.body);


};