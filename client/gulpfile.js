var exec = require('child_process').exec;
var gulp = require('gulp');
var merge = require('gulp-merge-json');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
var argv = require('yargs').argv;
var package = require('./package.json');
var configFileList = package.configFiles;

function log(s) {
  gutil.log(gutil.colors.green(s));
}

function logErr(s) {
  gutil.log(gutil.colors.red(s));
}

var handleError = function (value, cb) {
  log(value);
  exec(value, {maxBuffer: 1024 * 1000}, function (err, stdout, stderr) {
    log(stdout);
    log(stderr);
    logErr(err);
  });
};

gulp.task('serve', function () {
  runSequence('merge-lang-files');

  log("Serving ionic app");
  exec('ionic serve');
});

gulp.task('merge-lang-files', function () {
  // iterate through all folders and combine the files
    log("Merging language files");
    var options = {};

    // merge all english files
    options["fileName"] = "en.json";
    gulp.src('src/**/en.json')
      .pipe(merge(options))
      .pipe(gulp.dest('src/assets/i18n'));

    log("language files merged");
  });
