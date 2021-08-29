"use strict";
const /*  */
/* Основные плагины */
    gulp = require("gulp"),//Version 4.0.0!!!!!!CLI version 2.0.1!!!!!!!!!!! 
    plumber = require("gulp-plumber"),
    less = require("gulp-less"),
    sass = require("gulp-sass"),
    //sourcemaps = require("gulp-sourcemaps"),//>>>>>>>>>>>>>>>>>>>>>//ВЫКЛЮЧИЛ
    browserSync = require("browser-sync"),
    reload = require("browser-sync").reload,
    /* Плагины для сжатия и конкатинации */
    // htmlmin = require("gulp-htmlmin"), //>>>>>>>>>>>>>>>>>>>>>//ВЫКЛЮЧИЛ
    cssmin = require("gulp-csso"),
    jsmin = require('gulp-uglify-es').default,
    fileinclude = require("gulp-file-include"), //импортеры
    rigger = require('gulp-rigger'), //импортеры
    //imagemin = require("gulp-imagemin"),//>>>>>>>>>>>>>>>>>>>>>//ВЫКЛЮЧИЛ
    concat = require("gulp-concat"),//>>>>>>>>>>>>>>>>>>>>>//ВЫКЛЮЧИЛ
    /* Оптимизация */
    prefixer = require("gulp-autoprefixer"),
    babel = require('gulp-babel'),
    media = require("gulp-group-css-media-queries"),
    rename = require("gulp-rename");

/* Выбор препроцессора */
const preproc = sass;

/* Основные пути */
const path = {
    /* Пути для папок с готовыми файлами */
    build: {
        html: "./app/build/",
        js: "./app/build/js/",
        css: "./app/build/css/",
        img: "./app/build/img/",
        font: "./app/build/fonts/"
    },
    /* Пути для папок с исходными файлами */
    src: {
        html: "./app/src/*.html",
        js: "./app/src/js/*.js",
        style: "./app/src/style/*.scss",
        css: "./app/src/css/",
        img: "./app/src/img/**/*.*",
        font: "./app/src/fonts/**/*.*"
    },
    /* Пути для прослушки изменений файлов */
    watchSrc: {
        html: ["./app/src/*.html","./app/src/html include/**/*.*"],
        js: "./app/src/js/**/*.js",
        style: "./app/src/style/**/*.*",
        img: "./app/src/images/**/*.*",
        font: "./app/src/fonts/**/*.*"
    }
};
/* Конфигурация локального сервера */
const config = {
    server: {
        baseDir: "./app/build/"
    },
    tunnel: false,
    host: "localhost",
    port: 777
};
/* ВЕС ACTION */
const htmlBuild = () => {
    return gulp
        .src(path.src.html)
        .pipe(plumber())
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            context: {
              name: 'example'
            }
          }))
        // .pipe(htmlmin({
        //     collapseWhitespace: true
        // }))
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({
            stream: true
        }));
};
const styleBuild = () => {
    return gulp
        .src(path.src.style)
        .pipe(plumber())
        // .pipe(sourcemaps.init())
        .pipe(preproc())
        .pipe(gulp.dest(path.src.css))
        .pipe(prefixer({
            browsers: ['last 15 versions', '> 1%', 'ie 8', 'ie 7']
        }))
        .pipe(media())
        .pipe(cssmin())
        .pipe(rename({
            suffix: ".min"
        }))
        // .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({
            stream: true
        }));
};
const jsBuild = () => {
    return gulp
        .src(path.src.js)
        .pipe(rigger())
        .pipe(babel())
        .pipe(plumber())
        // .pipe(sourcemaps.init())
        // .pipe(concat('script.js'))
        .pipe(jsmin())
        .pipe(rename({
            suffix: ".min"
        }))
        // .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({
            stream: true
        }));
};
const imageBuild = () => {
    return gulp
        .src(path.src.img)
        // .pipe(imagemin([
        //     imagemin.gifsicle({interlaced: true}),
        //     imagemin.jpegtran({progressive: true}),
        //     imagemin.optipng({optimizationLevel: 5}),
        //     imagemin.svgo({
        //         plugins: [
        //             {removeViewBox: true},
        //             {cleanupIDs: false},
        //         ]
        //     })
        // ]))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({
            stream: true
        }));
};
const fontBuild = () => {
    return gulp
        .src(path.src.font)
        .pipe(gulp.dest(path.build.font));
};
const doingWatch = () => {
    gulp.watch(path.watchSrc.html, htmlBuild);
    gulp.watch(path.watchSrc.style, styleBuild);
    gulp.watch(path.watchSrc.img, imageBuild);
    gulp.watch(path.watchSrc.js, jsBuild);
    gulp.watch(path.watchSrc.font, fontBuild);
};
const server = () => {
    return browserSync(config);
};
const build = gulp.parallel(htmlBuild, styleBuild, jsBuild, imageBuild, fontBuild);
const allActions = gulp.parallel(build, server, doingWatch);
/* ############################################################################## */
gulp.task('build', build);
gulp.task('default', allActions);
