
require('es6-promise').polyfill();

var gulp = require('gulp'),
    del = require('del'),
    ts = require('gulp-typescript'),
    tsLint = require('gulp-tslint'),
    less = require('gulp-less'),
    watch = require('gulp-watch'),
    inject = require('gulp-inject'),
    replace = require('gulp-replace'),
    rename = require('gulp-rename'),
    minifyCss = require('gulp-cssnano'),
    concatCss = require('gulp-concat-css'),
    uglify = require('gulp-uglify'),
    sourceMaps = require('gulp-sourcemaps'),
    runSequence = require('run-sequence'),
    systemjsBuilder = require('systemjs-builder'),
    concat = require('gulp-concat'),
    inlineNg2Template = require('gulp-inline-ng2-template');

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

var map2array = function(map){
    var result = [];
    for (var key in map){
        var entry = map[key];
        result.push(entry);
    }
    return result;
}

var updateHtml = function(pathPairs) {


    //var path = [];
    var injectMap = {};
    var replaceMap = {};
    for (var p in pathPairs) {
        var entry = pathPairs[p];
        var transformation = entry.transformation;
        if (!transformation)
            continue;
        switch (transformation){
            case 'inject': {
                    for (var f in entry.files) {
                        var filepath = entry.files[f];
                        var resultFilePath = (entry.folder ? entry.folder : '') + '/' + filepath.replace(/^.*(\\|\/|\:)/, '');
                        var key = (0 == filepath.indexOf('.')) ? filepath.substring(1) : filepath;
                        injectMap[key] = {raw: filepath, final: resultFilePath};
                    }
                }
                break;
            case 'replace':
                replaceMap[entry.template] = entry.content;
                break;
        }
    }

    var target = gulp.src(config.source.index);

    var result =
            target
                .pipe(
                    inject(
                        gulp.src(map2array(injectMap).map(function(item){return item.raw;}), { read: false }),
                        {
                            transform: function (filepath, file, index, length, targetFile) {
                                var extension = filepath.replace(/^.*?\.([a-zA-Z0-9]+)$/, "$1");
                                var key = (0 == filepath.indexOf('.')) ? filepath.substring(1) : filepath;
                                var content = injectMap[key];
                                if (extension) {
                                    switch (extension) {
                                        case 'js':
                                            return '<script src="' + content.final + '"></script>';
                                        case 'css':
                                            return '<link rel="stylesheet" href="' + content.final + '">';
                                    }
                                }
                                return inject.transform.apply(inject.transform, arguments);
                            }
                        }
                    )
                );

    for (var key in replaceMap){
        result = result.pipe(replace(key, replaceMap[key]))
    }

    result = result.pipe(gulp.dest(config.target.root));

    return result;
};

gulp.task('clean', function (cb) {
    return del(config.target.cleanPath, cb);
});

gulp.task('clean-source', function (cb) {
    return del(config.source.cleanPath, cb);
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
        .pipe(ts({
            "target": "ES5",
            "module": "system",
            "moduleResolution": "node",
            "sourceMap": true,
            "preserveConstEnums": true,
            "emitDecoratorMetadata": true,
            "experimentalDecorators": true,
            "removeComments": false,
            "noImplicitAny": false,
            "outFile": config.source.bundleFileName
        }))

        .pipe(inlineNg2Template({
            base: '/client',
            removeLineBreaks: true,
            target: 'es5'
        }))
        /*
        .pipe(uglify({
            mangle: false
        }))
        */
        .pipe(gulp.dest(config.source.application));
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
    return gulp.src(config.source.vendors.production.jsLib)
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
    pathPairs.push({ transformation: 'inject', folder: config.target.libsFolderName, files: config.source.vendors.development.js });
    pathPairs.push({ transformation: 'inject', folder: config.target.libsFolderName, files: config.source.vendors.development.css });
    pathPairs.push({ transformation: 'inject', folder: config.target.appFolderName, files: [config.target.getAppFolderPath() + '/' + config.target.stylesFileName] });
    pathPairs.push({ transformation: 'replace', template: config.source.systemJsKey, content: buildSystemJsScriptDevelopment() });
    return updateHtml(pathPairs);
});

gulp.task('index-production', function () {
    var pathPairs = [];
    pathPairs.push({ transformation: 'inject', folder: config.target.libsFolderName, files: [config.target.getLibsFolderPath() + '/' + config.target.bundlesFileName]});
    pathPairs.push({ transformation: 'inject', folder: config.target.libsFolderName, files: config.source.vendors.production.css });
    pathPairs.push({ transformation: 'inject', folder: config.target.appFolderName, files: [config.target.getAppFolderPath() + '/' + config.target.stylesFileName] });
    pathPairs.push({ transformation: 'replace', template: config.source.systemJsKey, content: buildSystemJsScriptProduction() });
    return updateHtml(pathPairs);
});

function buildSystemJsScriptDevelopment(){
    return '\n' +
        '<script>\n' +
            'System.config({' +
                'packages: {\n' +
                    'app: {\n' +
                        'format: \'cjs\',\n' +
                        'defaultExtension: \'js\'\n' +
                    '}\n' +
                '},\n' +
                'map: {\n' +
                    'moment: \'' + config.target.libsFolderName + '/moment.min.js\'\n' +
                '}\n' +
            '});\n' +
            'System\n' +
                '.import(\'app/bootstrap\')\n' +
                '.then(null, console.error.bind(console));\n' +
            '\n' +
        '</script>\n';
}

function buildSystemJsScriptProduction(){
    /*
    return '\n' +
            '<script>\n' +
            'System.config({' +
                'packages: {\n' +
                    'app: {\n' +
                        'format: \'system\',\n' +
                        'defaultExtension: \'js\'\n' +
                    '}\n' +
                '},\n' +
                'map: {\n' +
                    'moment: \'' + config.target.libsFolderName + '/moment.min.js\'\n' +
                '},\n' +
                'bundles: {\n' +
                    '\'' + config.source.bundleFileName + '\': [\'client/app/bootstrap\']\n' +
                '}\n' +
            '});\n' +
            'System\n' +
                '.import(\'client/app/bootstrap\')\n' +
                '.then(null, console.error.bind(console));\n' +
            '\n' +
        '</script>\n';
        */

    return '\n' +
        '<script>\n' +
        'System.config({' +
        'packages: {\n' +
        'app: {\n' +
        'format: \'system\',\n' +
        'defaultExtension: \'js\'\n' +
        '}\n' +
        '},\n' +
        'map: {\n' +
        'moment: \'' + config.target.libsFolderName + '/moment.min.js\'\n' +
        '},\n' +
        'bundles: {\n' +
        '\'' + config.target.bundlesFileName + '\': [\'client/app/bootstrap\']\n' +
        '}\n' +
        '});\n' +
        'System\n' +
        '.import(\'client/app/bootstrap\')\n' +
        '.then(null, console.error.bind(console));\n' +
        '\n' +
        '</script>\n';
}

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

gulp.task('static-development', ['static-templates', 'static-icons', 'static-fonts', 'favicon']);

gulp.task('static-production', ['static-icons', 'static-fonts', 'favicon']);

gulp.task('merge-js', function() {

    var result = gulp.src(config.source.vendors.production.js)
        .pipe(concat(config.target.bundlesFileName))
        .pipe(gulp.dest(config.target.getLibsFolderPath()));
/*
    var result = gulp.src([
            './wwwroot/libs/shims_for_IE.js',
            './wwwroot/libs/angular2-polyfills.min.js',
            './wwwroot/libs/system.js',
            './wwwroot/libs/Rx.min.js',
            './wwwroot/libs/angular2.dev.js',
            './wwwroot/libs/router.dev.js',
            './wwwroot/libs/http.min.js',
            './wwwroot/libs/jquery.min.js',
            './wwwroot/libs/jquery.signalr-2.2.0.min.js',
            './wwwroot/libs/moment.min.js',
            './wwwroot/libs/ng2-bootstrap.min.js',
            './wwwroot/libs/bundle.js'
        ])
        .pipe(concat(config.target.bundlesFileName))
        .pipe(gulp.dest(config.target.getLibsFolderPath()));
*/
    return result;

});

gulp.task('tsLint', function () {
    return gulp.src(config.source.application + '/**/*.ts')
      .pipe(tsLint())
      .pipe(tsLint.report('verbose'));
});

gulp.task('development', [], function (callback) {
    runSequence(
        'clean',
        'tsLint',
        'compile-bootstrap-development',
        'compile-application-development',
        'libs-development',
        'less-development',
        'index-development',
        'static-development',
        'clean-source',
        /*'watch-development',*/
        callback);
});

gulp.task('production', [], function (callback) {
    runSequence(
        'clean',
        'tsLint',
        'compile-bootstrap-production',
        'compile-application-production',
        /*'libs-production',*/
        /*'libs-js-production',*/
        'libs-js-production',
        'libs-css-production',
        'less-production',
        'static-production',
        'merge-js',
        'index-production',
        'clean-source',
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