var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var del = require('del');
const imagemin = require('gulp-imagemin');


// Compile LESS files from /less into dist/css
gulp.task('less', function() {
    return gulp.src('less/*.less')
        .pipe(less())
        .pipe(gulp.dest('dist/css'));
});

//Images
gulp.task('image', function () {
   return gulp.src(["img/**/*", "!**/Thumbs.db", "!**/*.psd"])
       .pipe(imagemin())
       .pipe(gulp.dest("dist/img"));
});

//HTML
gulp.task('minify-html', function() {
  return gulp.src('*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

// Minify compiled CSS
gulp.task('minify-css', ['less'], function() {
    return gulp.src(['!dist/css/*.min.css', 'dist/css/*.css'])
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'));
});

// Minify JS
gulp.task('minify-js', function() {
	
	gulp.src(['!vendor/jquery-easing/*.min.js', 'vendor/jquery-easing/*.js'])
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('vendor/jquery-easing'))
	
    gulp.src(['!js/*.min.js', "js/*.js"])
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/js'));
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('pre-copy', function() {
    gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('vendor/bootstrap'))

    gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('vendor/jquery'))

  gulp.src(['node_modules/jquery.easing/jquery.easing.1.3.js'])
        .pipe(gulp.dest('vendor/jquery-easing'))

	gulp.src(['node_modules/slippry/dist/*', 'node_modules/slippry/images'])
        .pipe(gulp.dest('vendor/slippry'))

	gulp.src(['node_modules/slippry/images/*'])
        .pipe(gulp.dest('vendor/slippry/images'))

	gulp.src(['node_modules/jquery-touchswipe/*.js'])
        .pipe(gulp.dest('vendor/jquery-touchswipe'))

    gulp.src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(gulp.dest('vendor/font-awesome'))
});

gulp.task('post-copy', ['pre-copy', 'less', 'minify-html', 'minify-css', 'minify-js'], function() {
	gulp.src(['vendor/**/*'])
		.pipe(gulp.dest('dist/vendor'));
		
	gulp.src(['favicons/**/*'])
		.pipe(gulp.dest('dist/favicons'));
	
	gulp.src(['favicon.ico', 'Richard Hancock CV.pdf', '.htaccess', 'sitemap.xml.gz'])
		.pipe(gulp.dest('dist'));
	
	gulp.src(['mail/**/*'])
		.pipe(gulp.dest('dist/mail'));
});

gulp.task('clean', function() {
	return del([
		'dist/**/*'
	]);
});

// Run everything
gulp.task('default', ['pre-copy', 'less', 'minify-html', 'minify-css', 'minify-js', 'post-copy']);
