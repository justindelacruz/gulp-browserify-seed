// Gulp Dependencies
// ==================================
var gulp = require('gulp');
var rename = require('gulp-rename');

// Build Dependencies
// ==================================
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');

// Style Dependencies
// ==================================
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');

// Development Dependencies
// ==================================
var jshint = require('gulp-jshint');

// Test Dependencies
// ==================================
var mochaPhantomjs = require('gulp-mocha-phantomjs');

// JS Lint
// ==================================
gulp.task('lint-client', function() {
    return gulp.src('./client/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('lint-test', function() {
    return gulp.src('./test/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Browserify
// ==================================
gulp.task('browserify-client', ['lint-client'], function() {
    return gulp.src('client/index.js')
        .pipe(browserify({
            insertGlobals: true
        }))
        .pipe(rename('app.js'))
        .pipe(gulp.dest('build'))
        .pipe(gulp.dest('public/js'));
});

gulp.task('browserify-test', ['lint-test'], function() {
    return gulp.src('test/client/index.js')
        .pipe(browserify({
            insertGlobals: true
        }))
        .pipe(rename('client-test.js'))
        .pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
    gulp.watch('client/**/*.js', ['browserify-client']);
    gulp.watch('test/client/**/*.js', ['browserify-test']);
});

// Test
// ==================================
gulp.task('test', ['lint-test', 'browserify-test'], function() {
    return gulp.src('test/client/index.html')
        .pipe(mochaPhantomjs());
});

gulp.task('watch', function() {
    gulp.watch('client/**/*.js', ['browserify-client', 'test']);
    gulp.watch('test/client/**/*.js', ['test']);
});

// Assets
// ==================================
gulp.task('styles', function() {
    return gulp.src('client/sass/index.scss')
        .pipe(sass())
        .pipe(prefix({ cascade: true }))
        .pipe(rename('app.css'))
        .pipe(gulp.dest('build'))
        .pipe(gulp.dest('public/css'));
});

gulp.task('minify', ['styles'], function() {
    return gulp.src('build/app.css')
        .pipe(minifyCSS())
        .pipe(rename('app.min.css'))
        .pipe(gulp.dest('public/css'));
});

gulp.task('uglify', ['browserify-client'], function() {
    return gulp.src('build/app.js')
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('public/js'));
});

gulp.task('build', ['uglify', 'minify']);