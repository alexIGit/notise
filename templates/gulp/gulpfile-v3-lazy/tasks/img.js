'use strict';

const $                = require('gulp-load-plugins')(); 
const gulp             = require('gulp');
const pngquant      = require('imagemin-pngquant');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';


module.exports = function(options) {
    return function() {
        return gulp.src(options.src, {since: gulp.lastRun('img')})
            .pipe($.newer(options.src))
            .pipe($.if(!isDevelopment, $.cache($.imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use: [pngquant()],
                interlaced: true
            }))))
            .pipe(gulp.dest(options.dst));  
    };
};