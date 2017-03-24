const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const notify = require('gulp-notify');
const livereload = require('gulp-livereload');
const babel = require('gulp-babel');
const clean = require('gulp-clean');

gulp.task('default', ['watch']);

gulp.task('compile', function () {
	// Compile babel code
	return gulp.src('dist', { read: false })
		.pipe(clean())
		.on('end', function () {
			gulp.src('./src/**/*.js')
				.pipe(babel({
					presets: ['es2015', 'stage-0']
				}))
				.pipe(gulp.dest('./dist'))
				.pipe(livereload())
				.on('end', function () {
					gulp.src('./src/views/**/*.pug')
						.pipe(gulp.dest('./dist/views'))
						.pipe(livereload())
						.on('end', function () {
							gulp.src('./src/public/*')
								.pipe(gulp.dest('./dist/public'))
								.pipe(livereload());
						});
				});
		});
})

gulp.task('watch', function () {
	// livereload for browser
	livereload.listen();

	// configure nodemon
	nodemon({
		tasks: ['compile'],
		script: 'dist/app',
		ext: 'js',
		watch: 'src'
	}).on('restart', function () {
		gulp.src('dist/app.js')
			.pipe(livereload())
			.pipe(notify('Reloading Page due to code changes'));
	})
})