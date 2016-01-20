'use strict';

var gulp        = require('gulp'),
    prefixer    = require('gulp-autoprefixer'),
    rename      = require('gulp-rename'),
    uglify      = require('gulp-uglify'),
    cssmin      = require('gulp-minify-css');

var path = {
    build: {
        js:    'js/',
        css:   'css/'
    },
    src: {
        js:    'js/app.js',
        style: 'css/style.css'
    }
};

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(uglify())
        .pipe(rename("app.min.js"))
        .pipe(gulp.dest(path.build.js));
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(cssmin())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest(path.build.css));
});

gulp.task('build', [
    'js:build',
    'style:build'
]);

gulp.task('default', ['build']);