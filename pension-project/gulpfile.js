const path = require('path');
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const runSequence = require('gulp-sequence');
gulp.task('clean',function() {
	return gulp.src([
			"./dist/pages",
            "./dist/js",
            "./dist/css",
            "./dist/img",
            "./dist/lib",
            "./dist/index.html"
        ])
        .pipe(plugins.clean());
});
gulp.task('copy', function() {
    runSequence('clean',['copy:pages','copy:js','copy:css','copy:img','copy:lib'],function() {
        return gulp.src('index.html').pipe(gulp.dest('./dist'));
    });
});
//复制页面
gulp.task('copy:pages',function() {
	gulp.src('./pages/**/*').pipe(gulp.dest('dist/pages'));
});

//复制js
gulp.task('copy:js',function() {
	gulp.src('./js/**/*').pipe(gulp.dest('dist/js'));
});

//复制css
gulp.task('copy:css',function() {
	gulp.src('./css/**/*.css').pipe(gulp.dest('dist/css'));
});

//复制img
gulp.task('copy:img',function() {
	gulp.src('./img/**/*').pipe(gulp.dest('dist/img'));
})

//复制依赖
gulp.task('copy:lib',function() {
	gulp.src('./lib/**/*').pipe(gulp.dest('dist/lib'));
});