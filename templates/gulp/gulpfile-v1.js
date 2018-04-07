'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const del = require('del');
const debug = require('gulp-debug');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const newer = require('gulp-newer');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const cssnano = require('gulp-cssnano');

const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const rigger = require('gulp-rigger');

var isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

var path = {
    dst: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'dst/',
        js: 'dst/js/',
        css: 'dst/css/',
        img: 'dst/img/',
        fonts: 'dst/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/main.js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'src/scss/main.scss',
        img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/scss/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
         browserSync: 'dst/**/*.*'
    },
    clean: './dst',
    browserSync: './dst'
};


gulp.task('styles', function(){
    return gulp.src(path.src.style)
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulpIf(isDevelopment, debug({title:"sass"})))
        .pipe(gulpIf(isDevelopment, sourcemaps.write()))
        .pipe(gulpIf(!isDevelopment, cssnano()))
        .pipe(gulp.dest(path.dst.css))
   
    ;
});
gulp.task('clean', function(){
    return del(path.clean);
});
gulp.task('html',function(){
    return gulp.src(path.src.html, {since: gulp.lastRun('html')})
        .pipe(newer(path.src.html))
        .pipe(rigger())
        .pipe(gulp.dest(path.dst.html))
});
gulp.task('img',function(){
    return gulp.src(path.src.img, {since: gulp.lastRun('img')})
        .pipe(newer(path.src.img))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.dst.img));
});
gulp.task('fonts',function(){
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.dst.fonts));
});
gulp.task('watch',function(){
    gulp.watch(path.watch.style, gulp.series('styles'));
    gulp.watch(path.watch.html, gulp.series('html'));
    gulp.watch(path.watch.img, gulp.series('img'));
    gulp.watch(path.watch.fonts, gulp.series('fonts'));
    
});
gulp.task('serve',function(){
    browserSync.init({
        server: path.browserSync
    });
    browserSync.watch(path.watch.browserSync).on('change', browserSync.reload);
});
gulp.task('dst', gulp.series(
    'clean',
    gulp.parallel('styles', 'html', 'img', 'fonts')
));
gulp.task('dev', gulp.series('dst', gulp.parallel('watch', 'serve')) );
