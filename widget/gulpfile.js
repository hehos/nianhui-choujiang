var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    clean = require('gulp-clean');


var pkg = require('./package.json');
var cf = {
    src: {
        file: {
            scss: ['**/*.scss', '!libs/**/*.scss', '!vendors/**/*.scss']
        },
        dir: {
        }
    },
    autoprefixerBrowsers: [
        'Android 2.3',
        'Android >= 4',
        'Chrome >= 20',
        'Firefox >= 24',
        'Explorer >= 8',
        'iOS >= 6',
        'Opera >= 12',
        'Safari >= 6'
    ]
};


gulp.task('sass', function () {
    return sass(cf.src.file.scss, { sourcemap: true })
        .on('error', sass.logError)
        .pipe(autoprefixer({
            browsers: cf.autoprefixerBrowsers,
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(sourcemaps.write('/map', {
            includeContent: false,
            sourceRoot: 'scss'
        }))
        .pipe(gulp.dest('.'));
});

gulp.task('watch', function() {
    gulp.watch(cf.src.file.scss, ['sass']);
});

gulp.task('default', function() {
    gulp.start('sass');
});


gulp.task('cleanBootstrap', function() {
    return gulp.src('libs/**/*.css', {read: false})
        .pipe(clean());
});