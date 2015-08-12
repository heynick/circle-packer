'use strict';

// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    sassdoc = require('sassdoc'),
    
    del = require('del'),

    concatCss = require('gulp-concat-css'),
    minifyCss = require('gulp-minify-css'),

    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    include = require('gulp-include'),

    imagemin = require('gulp-imagemin'),

    livereload = require('gulp-livereload');


// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

var basePaths = {
    pub: 'public/',
    dev: 'dev/'
}



livereload({
    start: true
});


var scssSrcFile = basePaths.dev + 'scss/source.scss';
var scssSrcPath = basePaths.dev + 'scss/**/*.scss';

var imgSrcPath = basePaths.dev + 'img/**/*';

var jsSrc = basePaths.dev + 'js/source.js';
var jsSrcPath = basePaths.dev + 'js/**/*.js';

var publicCss = basePaths.pub + 'css';
var publicJs = basePaths.pub + 'js';
var publicImg = basePaths.pub + 'img';

var sassOptions = { 
    outputStyle: 'expanded'
};
var autoprefixerOptions = { 
    browsers: ['last 2 versions', '> 5%', 'Firefox ESR'] 
};
var sassdocOptions = { dest: './public/sassdoc' };


// -----------------------------------------------------------------------------
// Sass compilation
// -----------------------------------------------------------------------------

gulp.task('sass', function () {
  return gulp
    .src(scssSrcFile)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(rename('style.css')) // the destination filename
    .pipe(gulp.dest(publicCss))
    .pipe(livereload())
    .pipe(notify({ message: 'style.css created'}));
});


gulp.task('sassAndMinify', function() {
  return gulp.src(scssSrcFile)
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest(publicCss))
    .pipe(notify({ message: 'style.min.css created'}));
});


// -----------------------------------------------------------------------------
// JS
// -----------------------------------------------------------------------------

gulp.task('js', function () {
    return gulp.src(jsSrc)
        .pipe(include())
            .on('error', console.log)
        .pipe(rename('scripts.js')) // the destination filename
        .pipe(gulp.dest(publicJs)) // the destination folder
        .pipe(livereload())
        .pipe(notify({ message: 'scripts.js created'}));
});

gulp.task('jsMinify', function () {
    return gulp.src(jsSrc)
        .pipe(include())
            .on('error', console.log)
        .pipe(uglify())
        .pipe(rename('scripts.min.js')) // the destination filename
        .pipe(gulp.dest(publicJs)) // the destination folder
        .pipe(notify({ message: 'scripts.min.js created'}));
});


// -----------------------------------------------------------------------------
// Images
// -----------------------------------------------------------------------------

gulp.task('copyImages', function() {
    
    // clear out old images first
    del([
        publicImg + '**/*',
    ]);

    return gulp.src(imgSrcPath)
        .pipe(gulp.dest(publicImg));

});

gulp.task('copyImagesAndMinify', function() {
  return gulp.src(imgSrcPath)
    .pipe(imagemin())
    .pipe(gulp.dest(publicImg));
});


// -----------------------------------------------------------------------------
// Sass documentation generation
// -----------------------------------------------------------------------------

gulp.task('sassdoc', function () {
  return gulp
    .src(scssSrcFile)
    .pipe(sassdoc(sassdocOptions))
    .resume();
});


// -----------------------------------------------------------------------------
// Watchers
// -----------------------------------------------------------------------------

gulp.task('watch', function() {

    gulp.watch(scssSrcPath, ['sass']).on('change', function(e) {
        console.log(e.path + ' was ' + e.type);
    });

    gulp.watch(jsSrcPath, ['js']).on('change', function(e) {
        console.log(e.path + ' was ' + e.type);
    });

    gulp.watch(imgSrcPath, ['copyImages']).on('change', function(e) {
        console.log(e.path + ' was ' + e.type);
    });

});


gulp.task('serve', function(done) {
    var express = require('express');
    var app = express();
    app.use(express.static(__dirname + '/'));
    app.listen(4000, function () {
        done();
    });
});


// -----------------------------------------------------------------------------
// Production build
// -----------------------------------------------------------------------------

gulp.task('prod', ['sassdoc'], function () {
  return gulp
    .src(scssSrcFile)
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest(publicCss));
});


// -----------------------------------------------------------------------------
// clean
// -----------------------------------------------------------------------------
gulp.task('clean', function () {
  del([
    // here we use a globbing pattern to match everything inside the `mobile` folder
    basePaths.pub + '**/*.css',
    basePaths.pub + '**/*.js',
    publicImg + '**/*',

    // we don't want to clean this file though so we negate the pattern
    '!dist/mobile/deploy.json'
  ]);
});



// -----------------------------------------------------------------------------
// default
// -----------------------------------------------------------------------------

gulp.task('default', ['clean', 'sass', 'js', 'copyImages', 'serve', 'watch']);

gulp.task('build', ['clean', 'sassAndMinify', 'jsMinify', 'copyImagesAndMinify' ]);