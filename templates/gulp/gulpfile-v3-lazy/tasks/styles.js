'use strict';

const $                = require('gulp-load-plugins')(); 
const gulp             = require('gulp');
const combine          = require('stream-combiner2').obj;

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = function(options){

    return function(){
        return gulp.src(options.src)
            .pipe($.if(isDevelopment, $.sourcemaps.init()))
            .pipe($.sass.sync())
            .on('error', $.notify.onError(function(err){
                return {
                    title: 'Styles',
                    message: err.message
                };
            }))
            .pipe($.uncss({
                html:[options.uncss]
            }))
            .pipe($.if(isDevelopment, combine( $.debug({title:"sass"}, $.sourcemaps.write() ))))
            .pipe($.if(!isDevelopment, combine( $.cssnano({autoprefixer: {
                browsers:['last 10 versions', 'ie 9'], 
                add: true
            }}), $.rev())))
            .pipe(gulp.dest(options.dst))
            .pipe($.if(!isDevelopment, combine($.rev.manifest('css.json'), gulp.dest(options.manifest) )));
    };
};