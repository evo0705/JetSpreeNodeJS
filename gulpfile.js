const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const notify = require('gulp-notify');
const livereload = require('gulp-livereload');
const babel = require('gulp-babel');

gulp.task('compile', function() {
	// Compile babel code
	return gulp.src('./src/**/*.js')
			   .pipe(babel({
				  	presets: ['es2015', 'stage-0']
				  }))
			   .pipe(gulp.dest('./dist'))
			   .pipe(livereload());
})

gulp.task('watch', function() {
	// livereload for browser
	livereload.listen();

	// configure nodemon
	nodemon({
		script: 'dist/app',
		ext: 'js',
		watch: 'src',
		tasks: ['compile']
	}).on('restart', function() {
		gulp.src('dist/app.js')	
			.pipe(livereload())
			.pipe(notify('Reloading Page due to code changes'));
	})
})