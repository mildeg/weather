var gulp = require("gulp");
var print = require('gulp-print').default;
var cache = require('gulp-cached');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel")

var gulp_src = gulp.src;

gulp.src = function () {
    return gulp_src.apply(gulp, arguments)
        .pipe(plumber(function (error) {
                // Output an error message
                gutil.log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
                // emit the end event, to properly end the task
                this.emit('end');
            })
        )
        .pipe(cache('processing'))
        .pipe(print());
};
;



gulp.task('sd-watch', function () {
    gulp.watch('./src/**/*.es6', ['sd-babel']);
});


gulp.task("sd-babel", function () {
    let fr = '/src/'
    let to = '/lib/'
    return gulp.src("src/**/*.es6")
        .pipe(sourcemaps.init())
        .pipe(babel())
        //.pipe(concat("all.js"))
        .pipe(sourcemaps.write(".", {
            sourceRoot: function (file) {
                let idx = file.path.lastIndexOf(fr);
                file.path = file.path.substring(0, idx) + to + file.path.substring(idx + fr.length)
                return file.base;
            }
        }))
        .pipe(gulp.dest(function (file) {
            //let idx = file.path.lastIndexOf(fr);
            //file.path = file.path.substring(0, idx) + to + file.path.substring(idx + fr.length)
            return file.base;
        }));
});


// gulp.task("app-babel", function () {
//     let fr = '/src/'
//     let to = '/lib/'
//     return gulp.src("app/src/*.es6")
//         .pipe(sourcemaps.init())
//         .pipe(babel())
//         //.pipe(concat("all.js"))
//         .pipe(sourcemaps.write(".", {
//             sourceRoot: function (file) {
//                 let idx = file.path.lastIndexOf(fr);
//                 file.path = file.path.substring(0, idx) + to + file.path.substring(idx + fr.length)
//                 return file.base;
//             }
//         }))
//         .pipe(gulp.dest(function (file) {
//             //let idx = file.path.lastIndexOf(fr);
//             //file.path = file.path.substring(0, idx) + to + file.path.substring(idx + fr.length)
//             return file.base;
//         }));
// });
