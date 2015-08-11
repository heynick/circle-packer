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
    include = require('gulp-include');


// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

var paths = {
    pub: './public/',
    dev: './dev/'
}

var scssSrcFile = paths.dev + 'scss/source.scss';
var scssSrcPath = paths.dev + 'scss/**/*.scss';
var jsSrc = paths.dev + 'js/source.js';

var publicCss = paths.pub + 'css';
var publicJs = paths.pub + 'js';

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
    .pipe(notify({ message: 'style.css created'}));
});


gulp.task('scssAndMinify', function() {
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
  return gulp
    // Watch the scssSrcFile folder for change,
    // and run `sass` task when something happens
    .watch(scssSrcPath, ['sass'])
    // When there is a change,
    // log a message in the console
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
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
gulp.task('clean', function (cb) {
  del([
    // here we use a globbing pattern to match everything inside the `mobile` folder
    paths.pub + '**/*.css',
    paths.pub + '**/*.js',
    // we don't want to clean this file though so we negate the pattern
    '!dist/mobile/deploy.json'
  ]);
});



// -----------------------------------------------------------------------------
// default
// -----------------------------------------------------------------------------

gulp.task('default', ['clean', 'sass', 'js', 'watch' /*, possible other tasks... */]);

gulp.task('build', ['clean', 'scssAndMinify', 'jsMinify']);