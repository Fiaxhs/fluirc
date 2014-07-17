var gulp = require('gulp')

gulp.task('js', function () {
    var react = require('gulp-react')

    return gulp.src('src/**/*.js')
        .pipe(react())
        .pipe(gulp.dest('js'))
})

gulp.task('default', ['build'])