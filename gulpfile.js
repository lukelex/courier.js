var gulp = require("gulp"),
    jasmine = require("gulp-jasmine"),
    header = require("gulp-header"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    pkg = require("./package.json");

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

gulp.task("pack", function(){
  gulp.src("src/courier.js")
      .pipe(concat("courier.js"))
      .pipe(header(banner, { pkg: pkg, date: releaseDate }))
      .pipe(gulp.dest("dist"))
      .pipe(concat("courier.min.js"))
      .pipe(uglify())
      .pipe(gulp.dest("dist"));
});
