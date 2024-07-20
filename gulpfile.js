const { src, dest, watch, series, parallel } = require("gulp");
const terser = require("gulp-terser");
const jsobs = require("gulp-javascript-obfuscator");
const htmlmin = require("gulp-htmlmin");
const imagewebp = require("gulp-webp");
const imageavif = require("gulp-avif");
const rename = require("gulp-rename");
const strip = require("gulp-strip-comments");

let gulpsass = require("gulp-sass");
let sass = require("sass");
let autoprefixer = require("gulp-autoprefixer");
let sourcemaps = require("gulp-sourcemaps");
let cleanCSS = require("gulp-clean-css");
const postcss = require("gulp-postcss");

let sass$ = gulpsass(sass);
const isSourceMap = true;
const sourceMapWrite = isSourceMap ? "./" : false;

function scss(callback) {
    // SCSS path where code was written
    var scssFiles = "src/assets/scss/*.scss";
    // CSS path where code should need to be printed
    var cssDest = "dist/assets/css";
    // Normal file
    src(scssFiles)
        .pipe(sourcemaps.init()) // To create map file we should need to initiliaze.
        .pipe(sass$.sync().on("error", sass$.logError)) // To check any error with sass sync
        .pipe(dest(cssDest));
    //  Minified file
    src(scssFiles)
        .pipe(sourcemaps.init()) // To create map file we should need to initiliaze.
        .pipe(sass$.sync().on("error", sass$.logError)) // To check any error with sass sync
        .pipe(dest(cssDest))
        .pipe(cleanCSS({ debug: true }, (details) => {}))
        .pipe(
            rename({
                suffix: ".min",
            })
        )
        .pipe(sourcemaps.write(sourceMapWrite)) // To create map file
        .pipe(dest(cssDest));
    return callback();
}
// functions
function copyfile_php() {
    return src(["src/**/*.php"])
        .pipe(
            htmlmin({
                collapseWhitespace: true,
                ignoreCustomFragments: [
                    /<%[\s\S]*?%>/,
                    /<\?[=|php]?[\s\S]*?\?>/,
                ],
            })
        )
        .pipe(dest("dist"));
}
function remove_comments_php() {
    return src(["dist/**/*.php"]) // Target PHP files in the "dist" directory
        .pipe(strip())
        .pipe(dest("dist")); // Save modified files back to the same "dist" directory
}
function jsmin() {
    return (
        src(["src/assets/js/**/*.js"])
            // .pipe(terser())
            // .pipe(jsobs())
            .pipe(dest("dist/assets/js"))
    );
}
function avifImage() {
    return src([
        "src/assets/img/*.{jpg,png}",
        "src/assets/img/*/*.{jpg,png}",
        "src/assets/img/*/*/*.{jpg,png}",
    ])
        .pipe(imageavif())
        .pipe(dest("dist/assets/img"));
}
function webpImage() {
    return src([
        "src/assets/img/*.{jpg,png}",
        "src/assets/img/*/*.{jpg,png}",
        "src/assets/img/*/*/*.{jpg,png}",
    ])
        .pipe(imagewebp())
        .pipe(dest("dist/assets/img"));
}
function svgImage() {
    return src(["src/assets/img/**/*.svg", "src/assets/img/**/*.ico"]).pipe(
        dest("dist/assets/img")
    );
}
function copyfile() {
    // Copy all files and folders from src/assets/libs/
    src("src/assets/libs/**/*").pipe(dest("dist/assets/libs"));

    // Copy all files and folders from src/assets/iconfonts/
    return src("src/assets/iconfonts/**/*").pipe(dest("dist/assets/iconfonts"));
}

// create watchtask
function watchTask() {
    watch(["src/**/*.php"], copyfile_php);
    //watch(["dist/**/*.php"], remove_comments_php);
    watch(["src/assets/libs/**/*"], copyfile);
    watch(["src/assets/iconfonts/**/*"], copyfile);
    watch(["src/assets/js/**/*.js"], jsmin);
    watch(["src/assets/scss/**/*.scss"], scss);
    watch(
        [
            "src/assets/img/*.{jpg,png}",
            "src/assets/img/*/*.{jpg,png}",
            "src/assets/img/**/**/*.{jpg,png}",
        ],
        avifImage
    );
    watch(["src/assets/img/**/*.svg", "src/assets/img/**/*.ico"], svgImage);
}

// default gulp
exports.default = series(
    copyfile_php,
    // remove_comments_php,
    jsmin,
    avifImage,
    svgImage,
    copyfile,
    scss,
    watchTask
);
