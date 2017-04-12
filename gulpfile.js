const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const livereload = require('gulp-livereload');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const Cache = require('gulp-file-cache');
const sourcemaps = require('gulp-sourcemaps');
const runSequence = require('run-sequence');

gulp.task('default', ['watch']);

gulp.task('clean', function () {
    return gulp.src('dist', {read: false}).pipe(clean());
});

gulp.task('clean-cache', function () {
    return gulp.src('.gulp-cache', {read: false}).pipe(clean());
});

gulp.task('rebuild', () => {
    runSequence('clean-cache', 'clean', 'compile');
});

gulp.task('compile', function () {
    let cache = new Cache();
    return gulp.src('./src/**/*.js')
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(cache.filter())
        .pipe(babel({
            presets: ['es2015', 'stage-0']
        }))
        .pipe(cache.cache())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist'))
        .pipe(livereload())
        .on('end', function () {

            gulp.src('./src/views/**/*.pug')
                .pipe(gulp.dest('./dist/views'))
                .on('end', function () {

                    gulp.src('./src/public/**/*')
                        .pipe(gulp.dest('./dist/public'))
                        .on('end', function () {

                            gulp.src('./src/**/*.json')
                                .pipe(gulp.dest('./dist'))
                        });
                });
        });
});

var nodemon_instance;
gulp.task('watch', function () {
    // livereload for browser
    livereload.listen();

    // configure nodemon
    if (!nodemon_instance) {
        nodemon_instance = nodemon({
            tasks: ['compile'],
            script: 'dist/app',
            ext: 'js pug json css styl ico jpg png gif',
            watch: 'src'
        }).on('restart', function () {
            gulp.src('dist/app')
                .pipe(livereload());
        });
    } else {
        nodemon_instance.emit('restart');
    }
});