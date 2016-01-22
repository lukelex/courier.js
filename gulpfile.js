var gulp = require("gulp");
var jasmine = require("gulp-jasmine");
var header = require("gulp-header");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var buffer = require("vinyl-buffer");
var pkg = require("./package.json");
var babel = require("gulp-babel");
var browserify = require("browserify");
var babelify = require("babelify");
var sourcemaps = require("gulp-sourcemaps");
var source = require("vinyl-source-stream");

var d = new Date();
var releaseDate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear()

var banner = [
  "<%= pkg.banner.divider %>",
  "<%= pkg.banner.project %>",
  "<%= pkg.banner.copyright %>",
  "<%= pkg.banner.license %>",
  "<%= pkg.banner.licenseLink %>",
  "<%= pkg.banner.divider %>",
  "\n// Version: <%= pkg.version %> | From: <%= date %>\n",
  ""].join("\n");

gulp.task("test", function(){
  gulp.src("specs/*_spec.js")
      .pipe(jasmine());
});

gulp.task("es6", function(){
  gulp.src("src/courier.js")
  .pipe(babel())
  .pipe(concat("result.js"))
  .pipe(gulp.dest("dist"))
});

gulp.task("pack", function () {
  return browserify(["./src/courier.js"], {
    standalone: 'Courier',
  }).transform(babelify, { presets: ["es2015"] })
    .bundle()
    .pipe(source("courier.js"))
    .pipe(buffer())
    .pipe(header(banner, { pkg: pkg, date: releaseDate }))
    .pipe(gulp.dest("./dist"))
    .pipe(concat("courier.min.js"))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./dist"));
});
