var gulp = require('gulp'),
    del = require('del'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    browserify = require('browserify'),
    concat = require('gulp-concat'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    runSequence = require('run-sequence'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync'),
    testServer = require('karma').Server;


// Environment options
//  --minify false (will not minify the javascript code)
//  --env local/prod/stage/dev (build the app for the various environments)


/***********************
 * PATHS
 ***********************/
var _root = __dirname + '/';
var _app = _root + 'application/'
var _source = _app + 'src/';
var _paths = {
    bower: _root + 'bower_components/',
    config: {
        npm: _root + 'package.json',
        karma: _root + 'karma.conf.js',
    },
    js: _source + 'js/',
    dist: _app + 'dist/' + (gutil.env.env ? gutil.env.env : 'local') + '/',
    css: _source + 'style/css/',
    sass: _source + 'style/sass/',
    tests: _source + 'tests/'
};

/***********************
 * GLOBS
 ***********************/
var globs = {
    js: [
        _paths.js + '**/!(config*).js'
    ],
    json: [
        _source + '**/*.json'
    ],
    css: [
        _paths.js + '**/*.css',
        _paths.css + '**/*.css'
    ],
	others: [
		_source + '*.ico'
	],
    html: [
        _paths.js + '**/*.html',
        _source + '*.html',
        _source + '**/*.html'
    ],
    tests: [_paths.tests + '**/*spec.js'],
    bower: [
        _paths.bower + 'angular-route/angular-route.min.js',
        _paths.bower + 'angular/angular.min.js',
        _paths.bower + 'ng-file-upload/*.js',
        _paths.bower + 'webui-core/dist/*.js',
        _paths.bower + 'webui-core/dist/*.css',
        _paths.bower + 'webui-core/dist/*.map',
        _paths.bower + 'webui-feedback/dist/*.js',
        _paths.bower + 'webui-feedback/dist/*.css',
        _paths.bower + 'webui-feedback/dist/*.map',
        // _paths.bower + 'chosen/*.js',
        // _paths.bower + 'chosen/*.css'
    ]
};

var staticFiles = [].concat(globs.json).concat(globs.html).concat(globs.others);

// JSHint task
gulp.task('lint', function() {
    gulp.src(globs.js)
    .pipe(jshint())
    // You can look into pretty reporters as well, but that's another story
    .pipe(jshint.reporter('default'));
});

// Browserify task
gulp.task('browserify', ['create-config-file'], function() {
  var b = browserify({
    entries: _paths.js + 'app.js',
    insertGlobals: true,
    debug: true
  });

  return b.bundle()
    .pipe(source('migrator.bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe((gutil.env.minify === 'false') ? gutil.noop() : uglify())
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(_paths.dist));
});

gulp.task('copy-vendor-files', function () {
    return gulp.src(globs.bower)
        .pipe(gulp.dest(_paths.dist + 'vendor/'));
});

gulp.task('delete-config-file', function () {
    return del([_paths.js + 'api-configs/config.js']);
});

gulp.task('create-config-file', ['delete-config-file'], function () {
    gutil.log('creating config file for environment: ', gutil.env.env ? gutil.env.env : 'local');
    return gulp.src(_paths.js + 'api-configs/config-' + (gutil.env.env ? gutil.env.env : 'local') + '.js')
        .pipe(rename('config.js'))
        .pipe(gulp.dest(_paths.js + 'api-configs/'));
});

gulp.task('copy-static-files', function () {
    return gulp.src(staticFiles)
        .pipe(gulp.dest(_paths.dist));
});

gulp.task('clean-dist-files', function () {
    return del([_paths.dist]);
});

gulp.task('server', function() {
    var bs = browserSync.create();
    bs.init({
        server: _paths.dist,
        browser: "google chrome",
    });
    gulp.watch(['**/*.html', '**/*.css', '**/*.js'], {cwd: _paths.dist}, bs.reload);
});

gulp.task('watch', ['lint'], function() {
    gulp.watch(globs.js, ['recompileJS']);
    gulp.watch(staticFiles, ['copy-static-files']);
    // gulp.watch(globs.tests, ['test']);
});

gulp.task('build', function (done) {
    runSequence(
                // 'test',
                'clean-dist-files',
                'copy-static-files',
                'copy-vendor-files',
                'browserify',
                done);
});

gulp.task('recompileJS', function (done) {
    runSequence('lint',
    // 'test',
    'browserify', done);
});

gulp.task('test', function (done) {
    new testServer({
        configFile: _root + 'karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('default', function (done) {
    runSequence('watch', 'build', 'server', done);
});
