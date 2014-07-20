var gulp = require('gulp')
,   livereload = require('gulp-livereload')

gulp.task('js', function () {
    var react = require('gulp-react')

    return gulp.src('src/**/*.js')
        .pipe(react())
        .pipe(gulp.dest('js'))
})

gulp.task('clean', function () {
    var del = require('del')

    return del.sync(['build', 'js'])
})

gulp.task('build', ['js'], function () {
    var filesToMove = [
        'js/**/*.js',
        'css/**/*.css',
        '*.json',
        '*.html'
    ]

    return gulp.src(filesToMove, { base : './' })
        .pipe(gulp.dest('build'))
})

gulp.task('blabla', function () {
    var gutil = require('gulp-util')
    ,   chalk = require('chalk')

    gutil.log([
        chalk.blue('Howdy mate o/'),
        "This here is taking care of handling and compiling your react stuff, and all",
        "The only thing you have to handle manually (because I haven't found out how to do otherwise)",
        "is run the node app yourself by using : ",
        chalk.red("nodewebkit build"),
        "Come on, give it a try (and keep this running)",
        '',
        chalk.bgBlue.gray("Protip :") + ' you can simply use the reload button on nodewebkit to enjoy the modifs :)'
    ].join("\n"))

    return gulp.src('')
        pipe(gutil.noop())
})

livereload.listen()
gulp.task('lr', ['build'], function () {
    livereload.changed()
})

gulp.task('dev', ['clean', 'blabla', 'build'], function () {

    gulp.watch(['src/**/*.js', 'css/**/*.css', '*.html', '*.json'], ['lr'])
})

gulp.task('default', ['dev'])
