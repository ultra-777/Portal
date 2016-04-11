
require('es6-promise').polyfill();

var gulp = require('gulp'),
    del = require('del'),
    ts = require('gulp-typescript'),
    tsLint = require('gulp-tslint'),
    less = require('gulp-less'),
    watch = require('gulp-watch'),
    inject = require('gulp-inject'),
    rename = require('gulp-rename'),
    minifyCss = require('gulp-cssnano'),
    concatCss = require('gulp-concat-css'),
    uglify = require('gulp-uglify'),
    sourceMaps = require('gulp-sourcemaps'),
    runSequence = require('run-sequence');

var Config = require('./gulp.config.js');
var config = new Config();

var tscConfig = require('./client/tsconfig.json');

var mergeArray = function(source, target){
    for (var i in source) {
        var item = source[i];
        if (0 > target.indexOf(item))
            target.push(item);
    }
    return target;
}

var updateHtml = function(pathPairs) {

    var target = gulp.src(config.source.index.base);

    var path = [];
    var folderMap = {};
    for (var p in pathPairs) {
        var pathPair = pathPairs[p];
        for (var f in pathPair.files) {
            var filepath = pathPair.files[f];
            var resultFilePath = (pathPair.folder ? pathPair.folder : '') + '/' + filepath.replace(/^.*(\\|\/|\:)/, '');
            var key = (0 == filepath.indexOf('.')) ? filepath.substring(1) : filepath;
            folderMap[key] = resultFilePath;
            path.push(filepath);
        }
    }
    var sources = gulp.src(path, { read: false });



    return target
                .pipe(
                    inject(
                        sources, {
                            transform: function (filepath, file, index, length, targetFile) {
                                var extension = filepath.replace(/^.*?\.([a-zA-Z0-9]+)$/, "$1");
                                var key = (0 == filepath.indexOf('.')) ? filepath.substring(1) : filepath;
                                var targetFilePath = folderMap[key];
                                if (extension) {
                                    switch (extension) {
                                        case 'js':
                                            return '<script src="' + targetFilePath + '"></script>';
                                        case 'css':
                                            return '<link rel="stylesheet" href="' + targetFilePath + '"></link>';
                                    }
                                }
                                return inject.transform.apply(inject.transform, arguments);
                            }
                        }
                    )
                )
                .pipe(gulp.dest(config.target.root));
};

gulp.task('clean', function (cb) {
    return del(config.target.getCleanPath(), cb);
});

gulp.task('compile-application-development', function () {
    return gulp.src(config.source.ts)
        .pipe(sourceMaps.init())
        .pipe(ts(tscConfig.compilerOptions))
        .pipe(sourceMaps.write('.'))
    .pipe(gulp.dest(config.target.getAppFolderPath()));

});

gulp.task('compile-application-production', function () {
    return gulp.src(config.source.ts)
        .pipe(ts(tscConfig.compilerOptions))
            /*
        .pipe(uglify({
            mangle: false
        }))
        */
    .pipe(gulp.dest(config.target.getAppFolderPath()));
});

gulp.task('compile-bootstrap-development', function () {

    return gulp.src(config.source.bootstrap)
        .pipe(sourceMaps.init())
        .pipe(ts(tscConfig.compilerOptions))
        .pipe(sourceMaps.write('.'))
        .pipe(gulp.dest(config.target.getAppFolderPath()));
});

gulp.task('compile-bootstrap-production', function () {

    return gulp.src(config.source.bootstrap)
        .pipe(ts(tscConfig.compilerOptions))
        .pipe(uglify())
        .pipe(gulp.dest(config.target.getAppFolderPath()));
});

gulp.task('libs-development', function () {

    var libs = [];
    mergeArray(config.source.vendors.development.js, libs);
    mergeArray(config.source.vendors.development.css, libs);
    return gulp.src(libs)
        .pipe(gulp.dest(config.target.getLibsFolderPath()));
});

gulp.task('libs-js-production', function () {
    return gulp.src(config.source.vendors.production.js)
        .pipe(gulp.dest(config.target.getLibsFolderPath()));
});

gulp.task('libs-css-production', function () {
    return gulp.src(config.source.vendors.production.css)
        .pipe(gulp.dest(config.target.getLibsFolderPath()));
});

gulp.task('libs-production', function () {

    return runSequence('libs-js-production', 'libs-css-production');
});

gulp.task('index-development', function () {
    var pathPairs = [];
    pathPairs.push({ folder: config.target.libsFolderName, files: config.source.vendors.development.js });
    pathPairs.push({ folder: config.target.libsFolderName, files: config.source.vendors.development.css });
    pathPairs.push({ folder: config.target.appFolderName, files: [config.target.getAppFolderPath() + '/' + config.target.stylesFileName] });
    return updateHtml(pathPairs);
});

gulp.task('index-production', function () {
    var pathPairs = [];
    pathPairs.push({ folder: config.target.libsFolderName, files: config.source.vendors.production.js });
    pathPairs.push({ folder: config.target.libsFolderName, files: config.source.vendors.production.css });
    pathPairs.push({ folder: config.target.appFolderName, files: [config.target.getAppFolderPath() + '/' + config.target.stylesFileName] });
    return updateHtml(pathPairs);
});

gulp.task('static-templates', function () {
    return gulp.src(config.source.templates).pipe(gulp.dest(config.target.root));
});

gulp.task('static-icons', function () {
    return gulp.src(config.source.icons).pipe(gulp.dest(config.target.root));
});

gulp.task('static-fonts', function () {
    return gulp.src(config.source.vendors.fonts).pipe(gulp.dest(config.target.getFontFolderPath()));
});

gulp.task('favicon', function () {
    return gulp.src(config.source.favicon).pipe(gulp.dest(config.target.root));
});

gulp.task('less-development', function () {
    return gulp.src(config.source.less)
        .pipe(less())
        .pipe(concatCss(config.target.stylesFileName))
        .pipe(gulp.dest(config.target.getAppFolderPath()));
});

gulp.task('less-production', function () {
    return gulp.src(config.source.less)
        .pipe(less())
        .pipe(concatCss(config.target.stylesFileName))
        .pipe(minifyCss())
        .pipe(gulp.dest(config.target.getAppFolderPath()));
});

gulp.task('static', ['static-templates', 'static-icons', 'static-fonts', 'favicon']);

gulp.task('tsLint', function () {
    return gulp.src(config.source.application + '/**/*.ts')
      .pipe(tsLint())
      .pipe(tsLint.report('verbose'));
});

gulp.task('development', [], function (callback) {
    runSequence(
        'clean',
        'libs-development',
        'tsLint',
        'compile-bootstrap-development',
        'compile-application-development',
        'less-development',
        'index-development',
        'static',
        /*'watch-development',*/
        callback);
});

gulp.task('production', [], function (callback) {
    runSequence(
        'clean',
        'libs-production',
        'tsLint',
        'compile-bootstrap-production',
        'compile-application-production',
        'less-production',
        'index-production',
        'static',
        callback);
});

gulp.task('watch-development', function (cb) {
    watch(config.source.less, function () {
        gulp.run('less');
    });

    var staticClauses = [];
    for (var k in config.source.web)
        staticClauses.push(config.source.web[k]);
    for (var k in config.source.templates)
        staticClauses.push(config.source.templates[k]);
    for (var k in config.source.icons)
        staticClauses.push(config.source.icons[k]);

    watch(staticClauses, function () {
        gulp.run('static');
    });
    watch(config.source.ts, function () {
        gulp.run('compile-application');
    });
    watch(config.source.bootstrap, function () {
        gulp.run('compile-bootstrap');
    });
});

gulp.task('default', ['development']);