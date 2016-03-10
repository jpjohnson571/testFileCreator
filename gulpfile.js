// Include gulp
var gulp = require('gulp');
 // Define base folders
var path = {
  'src': './app',
  'dest': './dev',
  'bower': './dev/bower_components'
};
// Define the files compiled for path.dest + '/app.js'
var jsToCompile = [
  path.src + '/app.js',
  path.src + '/controllers/*.js',
  path.src + '/views/templates.js'
];

 // Include plugins
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var spa = require('browser-sync-spa');
var templateCache = require('gulp-angular-templatecache');
var minfyHtml = require('gulp-minify-html');
var fs = require('fs');
var plumber = require('gulp-plumber');
var insert = require('gulp-insert');

// currently, only copy bower_components to the dev location
gulp.task('init', function() {
  fs.stat(path.bower + '/webui-core', function(err, stat) {
    if (err == null) {
      //bower_components exists in the path.dest location do nothing (esle add it)
    } else {
        gulp.src( path.src + '/bower_components/**/*.*', {base: path.src})
        .pipe(plumber())
        .pipe(gulp.dest(path.dest));
    }
  });
});

// Compile the app.js file needed for this project
gulp.task('build-app.js', ['prepareTemplates'], function() {
  gulp.src(jsToCompile)
  .pipe(plumber())
  .pipe(concat('app.js'))
  //if issues compiling/running, comment out these two next lines---------------
  // .pipe(rename({suffix: '.min'}))
  // .pipe(uglify())
  .pipe(gulp.dest(path.dest));
});

//compile angular templates/views
gulp.task('prepareTemplates', function() {
   gulp.src(path.src + '/views/**/*.html')
   .pipe(plumber())
  // .pipe(minfyHtml({empty: true}))
  .pipe(templateCache({standalone:true}))
  .pipe(insert.prepend(
    '//This is a temp file that compiles all of the different views and appended to the build version of app.js, do not edit\n'))
  .pipe(gulp.dest(path.src + '/views'));
});

 // Compile CSS from Sass files
gulp.task('styles', function() {
     gulp.src([
      path.src + '/css/**/*.scss'
    ])
    .pipe(plumber())
    .pipe(sass({
      includePaths: [
        path.bower + '/webui-core/core/style/sass'
      ]
    }))
    .pipe(concat('app.css'))
    .pipe(gulp.dest(path.dest +'/styles'));
});

// Copy html files to build folder
gulp.task('html', function() {
   gulp.src(path.src + '/index.html')
   .pipe(plumber())
  //minify this file
  // .pipe(minfyHtml({empty: true}))
  // .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest(path.dest));
});

// Spin up a server
gulp.task('browserSync', function() {
  browserSync.use(spa({
    selector: "[ng-app]" //Only needed for angular apps
  }));

  browserSync.init({
    port: 8080,
    server: {
      baseDir: path.dest //this is where the server will run index.html from
    }
  })
});

 // Watch for changes in files
 gulp.task('watch', ['browserSync'], function() {
    // Watch .js files
    gulp.watch([jsToCompile, path.src + '/views/**/*.html'], ['build-app.js']);
    gulp.watch([jsToCompile, path.src + '/views/**/*.html']).on('change', reload);
    // Watch .scss files -- currently not needed
    // gulp.watch(path.src + '/css/*.scss', ['styles']);
    // gulp.watch(path.src + '/css/*.scss').on('change', reload);
    // Watch .html files
    gulp.watch(path.src + '/index.html', ['html']);
    gulp.watch(path.src + '/index.html').on('change', reload);
   });
 // Default Task
gulp.task('default', ['init','build-app.js','html','styles','watch']);
