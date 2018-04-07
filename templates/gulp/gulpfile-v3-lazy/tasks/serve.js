'use strict';

const $                = require('gulp-load-plugins')(); 
const gulp             = require('gulp');
const browserSync   = require('browser-sync').create();

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';


module.exports = function(options) {
    return function() {
        browserSync.init({
            server: options.dst
        });
        browserSync.watch(options.watch).on('change', browserSync.reload);
    };
};