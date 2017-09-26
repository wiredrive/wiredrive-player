let gulp = require('gulp'),
    minify = require('gulp-minify'),
    rename = require('gulp-rename'),
    cleanCSS = require('gulp-clean-css'),
    gulpCopy = require('gulp-copy');

gulp.task('compress-js', () => {
    return gulp.src(['js/*.js', '!js/*-min.js'])
        .pipe(minify({
            ext:{
                src:'.js',
                min:'-min.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(gulp.dest('js'))
});

gulp.task('compress-css', () => {
    return gulp.src(['css/*.css', '!css/*-min.css'])
        .pipe(cleanCSS({debug: true}, (details) => {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(rename({
            suffix: '-min'
        }))
        .pipe(gulp.dest('css'));
});

gulp.task('grauman-copy', () => {
    return gulp
        .src(['node_modules/grauman/dist/*.js', 'node_modules/grauman/dist/*.css'])
        .pipe(gulpCopy('grauman/', { prefix: 3 }));
});

gulp.task('default', ['compress-js', 'compress-css', 'grauman-copy']);