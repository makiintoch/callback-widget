'use strict';

var gulp        = require('gulp'),
    prefixer    = require('gulp-autoprefixer'),
    rename      = require('gulp-rename'),
    uglify      = require('gulp-uglify'),
    cssmin      = require('gulp-minify-css');

var path = {
    build: {
        js:    'public/widgets/callback/js/',
        css:   'public/widgets/callback/css/'
    },
    src: {
        js:    'public/widgets/callback/js/app.js',
        style: 'public/widgets/callback/css/style.css'
    }
};


gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(rename("app.js"))
        .pipe(gulp.dest(path.build.js))
        .pipe(uglify())
        .pipe(rename("app.min.js"))
        .pipe(gulp.dest(path.build.js));
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest(path.build.css));
});

gulp.task('build', [
    'js:build',
    'style:build'
]);

gulp.task('default', ['build']);
