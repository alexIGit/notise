'use strict';

const $ = require('gulp-load-plugins')();
const gulp          = require('gulp');
const del           = require('del');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

var path = {
    dst: { //Тут мы укажем куда складывать готовые после сборки файлы
        dst: './build',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/',
        uncss: 'build/*.html'
    },
    src: {                   //Пути откуда брать исходники
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
};
 
function lazyRequireTask(taskName, path, options) {
    options = options || {};
    options.taskName = taskName;
    gulp.task(taskName, function(callback) {
        let task = require(path).call(this, options);
        return task(callback);
    });
}

lazyRequireTask('styles', './tasks/styles', {
    src: path.src.style, 
    uncss: path.dst.uncss,
    manifest: path.manifest.dest,
    dst: path.dst.css
    } 
);

lazyRequireTask('clean', './tasks/clean', {
    dst: path.dst.dst
});

lazyRequireTask('html', './tasks/html', {
    src: path.src.html,
    manifest: path.manifest.css,
    dst: path.dst.dst
});

lazyRequireTask('img', './tasks/img', {
    src: path.src.img,
    dst: path.dst.img
});

lazyRequireTask('fonts', './tasks/fonts', {
    src: path.src.fonts,
    dst: path.dst.fonts
});

lazyRequireTask('js', './tasks/scripts', {
    src: path.src.js,
    dst: path.dst.js
});

gulp.task('watch',function(){
    gulp.watch(path.watch.style, gulp.series('styles'));
    gulp.watch(path.watch.html, gulp.series('html'));
    gulp.watch(path.watch.img, gulp.series('img'));
    gulp.watch(path.watch.fonts, gulp.series('fonts'));
    
});

lazyRequireTask('serve', './tasks/serve', {
    dst: path.dst.dst,
    watch: path.watch.browserSync
});

gulp.task('build', gulp.series(
    'clean', 'html',
    gulp.parallel('styles', 'img', 'fonts', 'js')
));

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')) );