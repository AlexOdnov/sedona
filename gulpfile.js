const { src, dest, parallel, series, watch } = require('gulp');
const del = require('del');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const browserSync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const sassglob = require('gulp-sass-glob');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const postcssWebp = require('webp-in-css/plugin');
const postcssAutoprefixer = require('autoprefixer');
const postcssMQpack = require('css-mqpacker');
const postcssCsso = require('postcss-csso');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const favicon = require('gulp-favicons');
const svgsprite = require('gulp-svg-sprite');
const webpackstream = require('webpack-stream');

const projectFolder = './build/';
const sourceFolder = './src/';
const localIPAddress = '192.168.1.40';
const browserPath = [
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Firefox Developer Edition\\firefox.exe',
];

const path = {
  project: {
    html: `${projectFolder}`,
    css: `${projectFolder}css/`,
    js: `${projectFolder}js/`,
    favicons: `${projectFolder}img/favicons/`,
    bgImg: `${projectFolder}img/backgrounds/`,
    contentImg: `${projectFolder}img/contentImage/`,
    svgSprite: `${projectFolder}img/svgSprite/`,
    data: `${sourceFolder}data/`,
  },
  source: {
    html: [`${sourceFolder}html/*.html`, `!${sourceFolder}html/_*.html`],
    css: `${sourceFolder}scss/style.scss`,
    js: `${sourceFolder}js/index.js`,
    favicons: `${sourceFolder}img/favicons/*`,
    bgImg: `${sourceFolder}img/backgrounds/*`,
    contentImg: `${sourceFolder}img/contentImage/*`,
    svgSprite: `${sourceFolder}img/svgSprite/*.svg`,
    data: `${sourceFolder}data/*`,
  },
  watch: {
    html: `${sourceFolder}html/*.html`,
    css: `${sourceFolder}scss/**/*.scss`,
    js: `${sourceFolder}js/**/*.js`,
    favicons: `${sourceFolder}img/favicons/*`,
    bgImg: `${sourceFolder}img/backgrounds/*`,
    contentImg: `${sourceFolder}img/contentImage/*`,
    svgSprite: `${sourceFolder}img/svgSprite/*.svg`,
    data: `${sourceFolder}data/*`,
  },
};

const clean = () => {
  return del([projectFolder]);
};

const html = () => {
  return src(path.source.html)
    .pipe(
      fileinclude().on(
        'error',
        notify.onError({
          title: 'HTML compiler error',
          message: '<%= error.message %>',
        })
      )
    )
    .pipe(replace(/\.\.\//g, './'))
    .pipe(
      htmlmin({
        removeComments: true,
        collapseWhitespace: true,
      })
    )
    .pipe(dest(projectFolder))
    .pipe(browserSync.stream());
};

const css = () => {
  return src(path.source.css)
    .pipe(
      sassglob().on(
        'error',
        notify.onError({
          title: 'SCSS import error',
          message: '<%= error.message %>',
        })
      )
    )
    .pipe(
      sass().on(
        'error',
        notify.onError({
          title: 'SCSS compiler error',
          message: '<%= error.message %>',
        })
      )
    )
    .pipe(replace(/\.\.\/\.\.\//g, '../'))
    .pipe(
      postcss([
        postcssWebp(),
        postcssAutoprefixer(),
        postcssCsso(),
        postcssMQpack(),
      ])
    )
    .pipe(
      rename({
        suffix: '.min',
      })
    )
    .pipe(dest(path.project.css))
    .pipe(browserSync.stream());
};

const bgImg = () => {
  return src(path.source.bgImg)
    .pipe(
      imagemin([
        imagemin.mozjpeg({
          quality: 90,
          progressive: true,
        }),
        imagemin.optipng({
          optimizationLevel: 2,
        }),
        imagemin.svgo(),
      ])
    )
    .pipe(dest(path.project.bgImg))
    .pipe(webp({ quality: 85 }))
    .pipe(dest(path.project.bgImg))
    .pipe(browserSync.stream());
};

const contentImg = () => {
  return src(path.source.contentImg)
    .pipe(
      imagemin([
        imagemin.mozjpeg({
          quality: 90,
          progressive: true,
        }),
        imagemin.optipng({
          optimizationLevel: 2,
        }),
        imagemin.svgo(),
      ])
    )
    .pipe(dest(path.project.contentImg))
    .pipe(webp({ quality: 85 }))
    .pipe(dest(path.project.contentImg))
    .pipe(browserSync.stream());
};

const favicons = () => {
  return src(path.source.favicons)
    .pipe(
      favicon({
        icons: {
          appleIcon: false,
          favicons: true,
          online: false,
          appleStartup: false,
          android: false,
          firefox: false,
          yandex: false,
          windows: false,
          coast: false,
        },
      })
    )
    .pipe(dest(path.project.favicons));
};

const svgSprite = () => {
  return src(path.source.svgSprite)
    .pipe(
      imagemin([
        imagemin.svgo({
          plugins: [
            { removeScriptElement: true },
            { removeStyleElement: true },
            { removeXMLNS: true },
          ],
        }),
      ])
    )
    .pipe(replace(/class=".*?"/g, ''))
    .pipe(
      svgsprite({
        mode: {
          symbol: {
            sprite: 'sprite.svg',
            dest: './',
          },
        },
        svg: { xmlDeclaration: false, doctypeDeclaration: false },
      })
    )
    .pipe(dest(path.project.svgSprite))
    .pipe(browserSync.stream());
};

const js = () => {
  return src(path.source.js)
    .pipe(
      webpackstream({
        mode: 'development',
        devtool: 'source-map',
        output: {
          filename: 'index.js',
        },
        module: {
          rules: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env'],
                  plugins: ['@babel/plugin-proposal-class-properties'],
                },
              },
            },
          ],
        },
      }).on('error', function (err) {
        this.emit('end');
      })
    )
    .pipe(dest(path.project.js))
    .pipe(browserSync.stream());
};

const jsBuild = () => {
  return src(path.source.js)
    .pipe(
      webpackstream({
        mode: 'production',
        devtool: false,
        output: {
          filename: 'index.js',
        },
        module: {
          rules: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env'],
                  plugins: ['@babel/plugin-proposal-class-properties'],
                },
              },
            },
          ],
        },
      }).on(
        'error',
        notify.onError({
          title: 'JS compiler error',
          message: '<%= error.message %>',
        })
      )
    )
    .pipe(dest(path.project.js))
    .pipe(browserSync.stream());
};

const data = () => {
  return src(path.source.data).pipe(dest(path.project.data));
};

const server = () => {
  browserSync.init({
    server: {
      baseDir: projectFolder,
    },
    host: localIPAddress,
    browser: browserPath,
  });

  watch(path.watch.html, html);
  watch(path.watch.css, css);
  watch(path.watch.bgImg, bgImg);
  watch(path.watch.contentImg, contentImg);
  watch(path.watch.favicons, favicons);
  watch(path.watch.svgSprite, svgSprite);
  watch(path.watch.js, js);
  watch(path.watch.data, data);
};

const ieTest = () => {
  browserSync.init({
    server: {
      baseDir: projectFolder,
    },
    browser: 'iexplore',
  });
};

//tasks

exports.clean = clean;
exports.html = html;
exports.css = css;
exports.bgImg = bgImg;
exports.contentImg = contentImg;
exports.favicon = favicons;
exports.svg = svgSprite;
exports.js = js;
exports.jsBuild = jsBuild;
exports.data = data;
exports.server = server;
exports.ieTest = ieTest;

//scripts

exports.default = series(
  clean,
  parallel(html, css, js, bgImg, contentImg, favicons, svgSprite, data),
  server
);

exports.build = series(
  clean,
  parallel(html, css, jsBuild, bgImg, contentImg, favicons, svgSprite, data)
);
