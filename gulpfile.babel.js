'use strict';
import {src, dest, watch, series, parallel} from 'gulp';
import gulpClean from 'gulp-clean';

// Sass
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';

// Node Utitlies
import path from 'path';

// Developer Utilties
import {create as browserSyncCreate} from 'browser-sync';
const browserSync = browserSyncCreate('dev-hoist');

const babel = require('gulp-babel');

const basePath = path.join(__dirname, 'app');
const paths = {
    resources: path.join(basePath, 'assets', '**', '**'),
    scripts: path.join(basePath, '**', '*.js'),
    styles: [path.join(basePath, '**', '*.scss'), path.join(basePath, '**', '*.css')],
    dist: path.join(__dirname, 'dist'),
    index: path.join(basePath, '*.*')
};

const browserSyncServer = () => {
    browserSync.init({
        server: {
            baseDir: paths.dist,
        },
    });
};

const browserSyncReload = done => {
    browserSync.reload();
    done();
};

const css = () => src(paths.styles, { allowEmpty: true, follow: true})
        .pipe(sass({outputStyle: 'expanded'}))
        .pipe(postcss([autoprefixer()]))
        .pipe(dest(paths.dist))
        .pipe(browserSync.stream());

const js = () => src(paths.scripts, {allowEmpty: true, follow: true})
        .pipe(babel(require('./babel.config.js')))
        .pipe(dest(paths.dist));

const resources = () => src([
        paths.resources], {allowEmpty: true})
        .pipe(dest(path.join(paths.dist, 'assets')))
        .pipe(browserSync.stream());

const indexFiles = () => src(paths.index, {allowEmpty: true, dot: true, follow: true})
        .pipe(dest(paths.dist));

export const clean = () => src([paths.dist], {read: false, allowEmpty: true})
        .pipe(gulpClean({force: true}));

const build = (cb) => series(clean, css, js, resources, indexFiles)(cb);

const cssWatch = () => watch([path.join(basePath, '**/**.scss'), path.join(basePath, '**/**.css')], callback => {
        series(css)(callback);
    });

const jsWatch = () => watch(path.join(basePath, '**/**.js'), callback => {
        series(js, browserSyncReload)(callback);
    });

const resourcesWatch = () =>  watch([
        path.join(basePath, 'app', 'assets', '**', '**'),
        path.join(basePath, '*')], callback => {
        series(resources, browserSyncReload)(callback);
    });

const indexWatch = () => watch(path.join(basePath, '*.*'), callback => series(indexFiles, browserSyncReload)(callback));

const watchAll = done => (parallel(cssWatch, jsWatch, resourcesWatch, indexWatch))(done)

exports.default = build;

export const develop = (done) => series(build, parallel(watchAll, browserSyncServer))(done);
