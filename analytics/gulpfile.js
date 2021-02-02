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
    webpHTML = require('gulp-webp-html'),
    webpCSS = require('gulp-webp-css'),
    svgSprite = require('gulp-svg-sprite'),
    ttf2woff = require('gulp-ttf2woff'),
    ttf2woff2 = require('gulp-ttf2woff2'),
    fonter = require('gulp-fonter'),
    fs = require('fs')

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
    .pipe(fileInclude())
    .pipe(webpHTML())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())

const css = () => src(path.src.css)
    .pipe(scss({outputStyle: "expanded"}))
    .pipe(groupMedia())
    .pipe(autoprefixer({overrideBrowserslist: ['last 5 versions'], cascade: true}))
    .pipe(webpCSS())
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

const fonts = () => {
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts))
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts))
}

gulp.task('otf2ttf', () => src([sourceFolder + '/fonts/*.otf'])
    .pipe(fonter({
        formats: ['ttf']
    }))
    .pipe(dest(sourceFolder + '/fonts/'))
)


gulp.task('svgSprite', () =>
    gulp.src([sourceFolder + '/iconsprite/*.svg'])
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: '../icons/icons.svg',
                    example: true
                }
            }
        }))
        .pipe(dest(path.build.img))
)

const fontsStyle = () => {
    let fileContent = fs.readFileSync(sourceFolder + '/scss/_fonts.scss');
    if (fileContent == '') {
        fs.writeFile(sourceFolder + '/scss/_fonts.scss', '', cb);
        return fs.readdir(path.build.fonts, function (err, items) {
            if (items) {
                let cFontname;
                for (var i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (cFontname !== fontname) {
                        fs.appendFile(sourceFolder + '/scss/_fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
                    }
                    cFontname = fontname;
                }
            }
        })
    }
}

function cb() {

}

const watchFiles = () => {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.img], img)
}

const clean = () => del(path.clean)

const build = gulp.series(clean, gulp.parallel(js, css, html, img, fonts), fontsStyle)
const watch = gulp.parallel(build, watchFiles, browserSync)

exports.fontsStyle = fontsStyle
exports.fonts = fonts
exports.img = img
exports.js = js
exports.css = css
exports.html = html
exports.build = build
exports.watch = watch
exports.default = watch
