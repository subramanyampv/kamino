const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const stripBom = require('gulp-stripbom');

gulp.task('lint', () => {
    return gulp.src(['**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('test', () => {
    return gulp.src('test/**/*.js', { read: false })
        .pipe(mocha({}));
});

gulp.task('stripbom', function() {
    return gulp.src(['**/*.*', '!node_modules/**'])
        .pipe(stripBom())
        .pipe(gulp.dest('.'));
});

gulp.task('watch', () => {
    return gulp.watch('**/*.js', ['default']);
});

gulp.task('default', ['lint', 'test']);
