'use strict';

const $                = require('gulp-load-plugins')(); 
const gulp             = require('gulp');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';


module.exports = function(options) {
    return function() {
        return gulp.src(options.src)
            .pipe($.rigger())
            .pipe($.if(!isDevelopment, $.revReplace({
                manifest: gulp.src(options.manifest, {allowEmpty: true})
            })))
            .pipe($.if(!isDevelopment, $.htmlmin({collapseWhitespace:true})))
            .pipe(gulp.dest(options.dst))
    };
};
