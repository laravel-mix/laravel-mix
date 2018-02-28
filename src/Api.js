let Verify = require('./Verify');
let CopyFilesTask = require('./tasks/CopyFilesTask');
let ConcatFilesTask = require('./tasks/ConcatenateFilesTask');
let VersionFilesTask = require('./tasks/VersionFilesTask');
let webpack = require('webpack');
let glob = require('glob');
let _ = require('lodash');
let path = require('path');

class Api {
    /**
     * Combine a collection of files.
     *
     * @param {string|Array} src
     * @param {string}       output
     * @param {Boolean}      babel
     */
    combine(src, output = '', babel = false) {
        output = new File(output);

        Verify.combine(src, output);

        if (typeof src === 'string' && File.find(src).isDirectory()) {
            src = _.pull(
                glob.sync(path.join(src, '**/*'), { nodir: true }),
                output.relativePath()
            );
        }

        let task = new ConcatFilesTask({ src, output, babel });

        Mix.addTask(task);

        return this;
    }

    /**
     * Alias for this.Mix.combine().
     *
     * @param {string|Array} src
     * @param {string}       output
     */
    scripts(src, output) {
        return this.combine(src, output);
    }

    /**
     * Identical to this.Mix.combine(), but includes Babel compilation.
     *
     * @param {string|Array} src
     * @param {string}       output
     */
    babel(src, output) {
        return this.combine(src, output, true);

        return this;
    }

    /**
     * Alias for this.Mix.combine().
     *
     * @param {string|Array} src
     * @param {string}       output
     */
    styles(src, output) {
        return this.combine(src, output);
    }

    /**
     * Minify the provided file.
     *
     * @param {string|Array} src
     */
    minify(src) {
        if (Array.isArray(src)) {
            src.forEach(file => this.minify(file));

            return this;
        }

        let output = src.replace(/\.([a-z]{2,})$/i, '.min.$1');

        return this.combine(src, output);
    }

    /**
     * Copy one or more files to a new location.
     *
     * @param {string} from
     * @param {string} to
     */
    copy(from, to) {
        let task = new CopyFilesTask({
            from,
            to: new File(to)
        });

        Mix.addTask(task);

        return this;
    }

    /**
     * Copy a directory to a new location. This is identical
     * to mix.copy().
     *
     * @param {string} from
     * @param {string} to
     */
    copyDirectory(from, to) {
        return this.copy(from, to);
    }

    /**
     * Enable automatic file versioning.
     *
     * @param {Array} files
     */
    version(files = []) {
        Config.versioning = true;

        files = flatten(
            [].concat(files).map(filePath => {
                if (File.find(filePath).isDirectory()) {
                    filePath += path.sep + '**/*';
                }

                if (!filePath.includes('*')) return filePath;

                return glob.sync(
                    new File(filePath).forceFromPublic().relativePath(),
                    { nodir: true }
                );
            })
        );

        Mix.addTask(new VersionFilesTask({ files }));

        return this;
    }

    /**
     * Register vendor libs that should be extracted.
     * This helps drastically with long-term caching.
     *
     * @param {Array}  libs
     * @param {string} output
     */
    extract(libs, output) {
        Config.extractions.push({ libs, output });

        return this;
    }

    /**
     * Enable sourcemap support.
     *
     * @param {Boolean} productionToo
     * @param {string}  type
     */
    sourceMaps(productionToo = true, type = 'eval-source-map') {
        if (Mix.inProduction()) {
            type = productionToo ? 'source-map' : false;
        }

        Config.sourcemaps = type;

        return this;
    }

    /**
     * Override the default path to your project's public directory.
     *
     * @param {string} defaultPath
     */
    setPublicPath(defaultPath) {
        Config.publicPath = path.normalize(defaultPath.replace(/\/$/, ''));

        return this;
    }

    /**
     * Set a prefix for all generated asset paths.
     *
     * @param {string} path
     */
    setResourceRoot(path) {
        Config.resourceRoot = path;

        return this;
    }

    /**
     * Disable all OS notifications.
     */
    disableNotifications() {
        Config.notifications = false;

        return this;
    }

    /**
     * Disable success notifications.
     */
    disableSuccessNotifications() {
        Config.notifications = {
            onSuccess: false,
            onFailure: true
        };

        return this;
    }

    /**
     * Merge custom config with the provided webpack.config file.
     *
     * @param {object} config
     */
    webpackConfig(config) {
        config = typeof config == 'function' ? config(webpack) : config;

        Config.webpackConfig = require('webpack-merge').smart(
            Config.webpackConfig,
            config
        );

        return this;
    }

    /**
     * Merge custom Babel config with Mix's default.
     *
     * @param {object} config
     */
    babelConfig(config) {
        Config.babelConfig = config;

        return this;
    }

    /* Set Mix-specific options.
     *
     * @param {object} options
     */
    options(options) {
        if (options.purifyCss) {
            options.purifyCss = require('./PurifyPaths').build(
                options.purifyCss
            );

            Verify.dependency(
                'purifycss-webpack',
                ['purifycss-webpack', 'purify-css'],
                true // abortOnComplete
            );
        }

        Config.merge(options);

        return this;
    }

    /**
     * Extend the mix API with a new component.
     *
     * @param {string} name
     * @param {*}      component
     */
    extend(name, component) {
        let ComponentFactory = require('./ComponentFactory');

        if (typeof component === 'function') {
            component = {
                register: component
            };
        }

        component.name = () => name;

        new ComponentFactory().install(component);
    }

    /**
     * Register a Webpack build event handler.
     *
     * @param {Function} callback
     */
    then(callback) {
        Mix.listen('build', callback);

        return this;
    }

    /**
     * Helper for determining a production environment.
     */
    inProduction() {
        return Mix.inProduction();
    }
}

module.exports = Api;
