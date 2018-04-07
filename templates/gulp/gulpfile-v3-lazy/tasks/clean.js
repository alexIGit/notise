'use strict';

const $                = require('gulp-load-plugins')(); 
const gulp             = require('gulp');
const del           = require('del');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = function(options){
    return function(){
        return del(options.dst);
   };
};
