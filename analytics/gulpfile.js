const {dest, src} = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    fileInclude = require('gulp-file-include'),
    del = require('del'),
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    groupMedia = require('gulp-group-css-media-queries'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify-es').default,
    imagemin = require('gulp-imagemin'),
    webp = require('gulp-webp'),
    webpHTML = require('gulp-webp-html')

const projectFolder = 'dist',
    sourceFolder = '#src'

let path = {
    build: {
        html: projectFolder + '/',
        css: projectFolder + '/css/',
        js: projectFolder + '/js/',
        img: projectFolder + '/img/',
        fonts: projectFolder + '/fonts/',
    },
    src: {
        html: sourceFolder + '/*.html',
        css: sourceFolder + '/scss/style.scss',
        js: sourceFolder + '/js/script.js',
        img: sourceFolder + '/img/**/*.{jpg,png,gif,ico,webp,svg}',
        fonts: sourceFolder + '/fonts/*.ttf',
    },
    watch: {
        html: sourceFolder + '/**/*.html',
        css: sourceFolder + '/scss/**/*.scss',
        js: sourceFolder + '/js/**/.js',
        img: sourceFolder + '/img/**/*.{jpg,png,gif,ico,webp,svg}',
    },
    clean: './' + projectFolder + '/'
}

const browserSync = (params) => {
    browsersync.init({
        server: {
            baseDir: path.clean
        },
        port: 3000,
        notify: false
    })
}

const html = () => src(path.src.html)
    .pipe(webpHTML())
    .pipe(fileInclude())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())

const css = () => src(path.src.css)
    .pipe(scss({outputStyle: "expanded"}))
    .pipe(groupMedia())
    .pipe(autoprefixer({overrideBrowserslist: ['last 5 versions'], cascade: true}))
    .pipe(dest(path.build.css))
    .pipe(cleanCSS())
    .pipe(rename({extname: '.min.css'}))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())

const js = () => src(path.src.js)
    .pipe(fileInclude())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())

const img = () => src(path.src.img)
    .pipe(webp({
        quality: 70
    }))
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        interlaced: true,
        optimizationLevel: 3 //0 to 7
    }))
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())

const watchFiles = () => {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.img], img)
}

const clean = () => del(path.clean)

const build = gulp.series(clean, gulp.parallel(css, html, js, img))
const watch = gulp.parallel(build, watchFiles, browserSync)

exports.html = html
exports.css = css
exports.js = js
exports.img = img
// exports.fonts = fonts
exports.build = build
exports.watch = watch
exports.default = watch
