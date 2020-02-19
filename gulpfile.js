const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const uncss = require('gulp-uncss');
const gcmq = require('gulp-group-css-media-queries');
const less = require('gulp-less');
const smartgrid = require('smart-grid');

const isDev = (process.argv.indexOf('--dev') !== -1);
const isProt = !isDev;
const isSync = (process.argv.indexOf('--sync') !== -1);

/*
const cssFiles = [
    './node_modules/normalize.css/normalize.css',
    './css/base.css',
    './css/grid.css',
    './css/humans.css'
];
*/

function clear(){
    return del('build/*');
}

function style() {
    return gulp.src('./src/css/style.less')
        .pipe(gulpif(isDev, sourcemaps.init()))
        //.pipe(concat('style.css'))
        .pipe(less())
        .pipe(gulpif(isProt, cleanCSS({
            level:2
        })))
        .pipe(autoprefixer({
            browsers: ['> 0.1%'],
            cascade: false
        }))
        .pipe(gulpif(isDev, sourcemaps.write()))
        .pipe(gcmq())
        .pipe(gulp.dest('./build/css'))
        .pipe(gulpif(isSync, browserSync.stream()));
};

function html() {
    return gulp.src('./src/*.html')
        .pipe(gulp.dest('./build'))
};

function img() {
    return gulp.src('./src/img/**/*')
        .pipe(gulp.dest('./build/img'))
};


function watch(){
    if (isSync) {
        browserSync.init({
            server: {
                baseDir: "./build/",
            }
        });
    }

    gulp.watch('./src/css/**/*.less', style);
    gulp.watch('./src/**/*.html', html).on('change', browserSync.reload);
};

function grid(done) {
    let settings = {
        columns: 12,
        offset: "20px",
        //mobileFirst: true,
        container: {
            maxWidth: "940px",
            fields: "20px"
        },
        breakPoints: {
            md: {
                width: "920px",
                fields: "20px"
            },
            sm: {
                width: "720px",
                fields: "10px"
            },
            xs: {
                width: "576px",
                fields: "10px"
            },
            xxs: {
                width: "420px",
                fields: "10px"
            }
        }
    };

    smartgrid('./src/css', settings);
    done();
}

let build = gulp.series(clear,
    gulp.parallel(style, img, html)
);


gulp.task('build', build);
gulp.task('start', gulp.series(build, watch));
gulp.task('grid', grid);















