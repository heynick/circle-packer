app.globals = {
    doc: document,
    animating: undefined,
    circleArr: [],
    activeBall: undefined,
    w: window.innerWidth,
    h: window.innerHeight,
    get svgEl() {  // http://stackoverflow.com/a/4616262
        return this.doc.getElementById('svg-el')
    }
}