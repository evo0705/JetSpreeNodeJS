const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
//const notify = require('gulp-notify');
const livereload = require('gulp-livereload');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const Cache = require('gulp-file-cache');

var cache = new Cache();

gulp.task('default', ['watch']);

gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean())
        .on('end', function () {
            gulp.src('.gulp-cache', {read: false}).pipe(clean());
        });
});

gulp.task('compile', function () {

    // gulp.src('dist', { read: false })
    // 	.pipe(clean())
    // 	.on('end', function () {

    return gulp.src('./src/**/*.js')
        .pipe(cache.filter())
        .pipe(babel({
            presets: ['es2015', 'stage-0']
        }))
        .pipe(cache.cache())
        .pipe(gulp.dest('./dist'))
        .on('end', function () {

            gulp.src('./src/views/**/*.pug')
                .pipe(gulp.dest('./dist/views'))
                .on('end', function () {

                    gulp.src('./src/public/**/*')
                        .pipe(gulp.dest('./dist/public'))
                        .on('end', function () {

                            gulp.src('./src/**/*.json')
                                .pipe(gulp.dest('./dist'))
                                .pipe(livereload())
                        });
                });
        });
    // });
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
            ext: 'js',
            watch: 'src'
        }).on('restart', function () {
            gulp.src('dist/app.js')
                .pipe(livereload());
            //.pipe(notify('Reloading Page due to code changes'));
        });
    } else {
        nodemon_instance.emit('restart');
    }
});