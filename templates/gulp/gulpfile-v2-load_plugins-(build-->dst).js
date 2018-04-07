'use strict';

const $ = require('gulp-load-plugins')();
const gulp          = require('gulp');
const del           = require('del');
const browserSync   = require('browser-sync').create();
const pngquant      = require('imagemin-pngquant');
const combine       = require('stream-combiner2').obj;

var isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/',
        uncss: 'build/*.html'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/*.js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'src/scss/*.scss',
        img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/scss/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
         browserSync: 'build/**/*.*'
    },
    manifest: {
        dest: 'manifest',
        css: 'manifest/css.json'
    },
    clean: './build',
    browserSync: './build'
};

gulp.task('styles', function(){
    return gulp.src(path.src.style)
        .pipe($.if(isDevelopment, $.sourcemaps.init()))
        .pipe($.sass.sync())
        .on('error', $.notify.onError(function(err){
            return {
                title: 'Styles',
                message: err.message
            };
        }))
        .pipe($.uncss({
            html:[path.build.uncss]
        }))
        .pipe($.if(isDevelopment, combine( $.debug({title:"sass"}, $.sourcemaps.write() ))))
        .pipe($.if(!isDevelopment, combine( $.cssnano({autoprefixer: {
            browsers:['last 10 versions', 'ie 9'], 
            add: true
          }}), $.rev())))
        .pipe(gulp.dest(path.build.css))
        .pipe($.if(!isDevelopment, combine($.rev.manifest('css.json'), gulp.dest(path.manifest.dest) )));
});
gulp.task('clean', function(){
    return del(path.clean);
});
gulp.task('html',function(){
    return gulp.src(path.src.html)
        .pipe($.rigger())
        .pipe($.if(!isDevelopment, $.revReplace({
            manifest: gulp.src(path.manifest.css, {allowEmpty: true})
        })))
        .pipe($.if(!isDevelopment, $.htmlmin({collapseWhitespace:true})))
        .pipe(gulp.dest(path.build.html))
});
gulp.task('img',function(){
    return gulp.src(path.src.img, {since: gulp.lastRun('img')})
        .pipe($.newer(path.src.img))
        .pipe($.if(!isDevelopment, $.cache($.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))))
        .pipe(gulp.dest(path.build.img));
});
gulp.task('fonts',function(){
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});
gulp.task('js',function(){
    return gulp.src(path.src.js)
        .pipe(gulp.dest(path.build.js));
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
gulp.task('build', gulp.series(
    'clean', 'html',
    gulp.parallel('styles', 'img', 'fonts', 'js')
));
gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')) );
