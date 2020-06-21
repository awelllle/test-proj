const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');

gulp.task('default', function () {
    //run Eslint
    gulp.src(["src/**/*.js"])
        .pipe(eslint())
        .pipe(eslint.format());
    //Node source
    gulp.src("./src/**/*.js")
        .pipe(babel())
        .pipe(gulp.dest("./dist"))
});