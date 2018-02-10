let webpack = require('webpack');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let Verify = require('../Verify');
const Rules = require('../rules')
module.exports = function() {
    // all prepared or customized rules
    let rules = [];

    let extractPlugins = [];

  /**
   * Calls the customizeRule callback with that prepared rule if the user registered a callback for customization.
   * Pushes either the original rule or the customized rule to our rules array and returns the rule.
   *
   * @param {string} name name of the rule
   * @param {object} rule the webpack rule to customize
   * @return {object} either the customized or the original rule.
   */
    const prepareAndPushDynamicRule = (name, rule) => {
      // see if the user has registered a customize callback and replace the rule if so
      rule = Mix.callCustomizeRule(name, rule, Config);
      // Not necessary, but results in a cleaner configuration: If the user skipped the
      // rule by returning an empty object ({}), we don't push it to the rules array.
      if(Object.keys(rule).length > 0) {
        // push the original or customized rule to our rules array
        rules.push(rule);
      }
      // return the rule for convenience
      return rule;
    }

  /**
   * Executes the given rule function and – if the user registered a callback for customization – calls the customizeRule callback with that prepared rule.
   * Pushes either the original rule or the customized rule to our rules array and returns the rule.
   * @param {string} name name of the rule
   * @param {object} additionalParameters some rule functions require additional parameters. See vue for example.
   * @return {object} either the customized or the original rule.
   */
    const prepareAndPushRule = (name, additionalParameters = []) => {
        // call the rule function and let it return a prepared rule object
        let rule = Rules[name](Config, ...additionalParameters);
        return prepareAndPushDynamicRule(name, rule);
    }

    // Babel Compilation.
    prepareAndPushRule('jsx');

    // TypeScript Compilation.
    if (Mix.isUsing('typeScript')) {
        prepareAndPushRule('typeScript');
    }

    // CSS Compilation.
    prepareAndPushRule('css');

    // Recognize .scss Imports.
    prepareAndPushRule('sass');

    // Recognize .less Imports.
    prepareAndPushRule('less');

    // Add support for loading HTML files.
    prepareAndPushRule('html');

    // Add support for loading images.
    prepareAndPushRule('images');

    // Add support for loading fonts.
    prepareAndPushRule('fonts');

    // Add support for loading cursor files.
    prepareAndPushRule('cursors');

    // Here, we'll filter through all CSS preprocessors that the user has requested.
    // For each one, we'll add a new Webpack rule and then prepare the necessary
    // extract plugin to extract the CSS into its file.
    Object.keys(Config.preprocessors).forEach(type => {
        if (type === 'fastSass') return;

        Config.preprocessors[type].forEach(preprocessor => {
            let outputPath = preprocessor.output.filePath
                .replace(Config.publicPath + path.sep, path.sep)
                .replace(/\\/g, '/');

            tap(new ExtractTextPlugin(outputPath), extractPlugin => {
                let loaders = [
                    {
                        loader: 'css-loader',
                        options: {
                            url: Config.processCssUrls,
                            sourceMap: Mix.isUsing('sourcemaps'),
                            importLoaders: 1
                        }
                    },

                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap:
                                type === 'sass' && Config.processCssUrls
                                    ? true
                                    : Mix.isUsing('sourcemaps'),
                            ident: 'postcss',
                            plugins: (function() {
                                let plugins = Config.postCss;

                                if (
                                    preprocessor.postCssPlugins &&
                                    preprocessor.postCssPlugins.length
                                ) {
                                    plugins = preprocessor.postCssPlugins;
                                }

                                if (
                                    Config.autoprefixer &&
                                    Config.autoprefixer.enabled
                                ) {
                                    plugins.push(
                                        require('autoprefixer')(
                                            Config.autoprefixer.options
                                        )
                                    );
                                }

                                return plugins;
                            })()
                        }
                    }
                ];

                if (type === 'sass' && Config.processCssUrls) {
                    loaders.push({
                        loader: 'resolve-url-loader',
                        options: {
                            sourceMap: true,
                            root: Mix.paths.root('node_modules')
                        }
                    });
                }

                if (type !== 'postCss') {
                    loaders.push({
                        loader: `${type}-loader`,
                        options: Object.assign(preprocessor.pluginOptions, {
                            sourceMap:
                                type === 'sass' && Config.processCssUrls
                                    ? true
                                    : Mix.isUsing('sourcemaps')
                        })
                    });
                }

                prepareAndPushDynamicRule(`${type}Preprocessor`, {
                    test: preprocessor.src.path(),
                    use: extractPlugin.extract({
                        fallback: 'style-loader',
                        use: loaders
                    })
                });

                extractPlugins.push(extractPlugin);
            });
        });
    });

    // Vue Compilation.
    let vueExtractPlugin;

    if (Config.extractVueStyles) {
        let fileName =
            typeof Config.extractVueStyles === 'string'
                ? Config.extractVueStyles
                : 'vue-styles.css';
        let filePath = fileName
            .replace(Config.publicPath, '')
            .replace(/^\//, '');
        vueExtractPlugin = extractPlugins.length
            ? extractPlugins[0]
            : new ExtractTextPlugin(filePath);
    }

    prepareAndPushRule('vue', [vueExtractPlugin]);

    // TODO: Should happen before prepare and push rule

    // If there were no existing extract text plugins to add our
    // Vue styles extraction too, we'll push a new one in.
    if (Config.extractVueStyles && !extractPlugins.length) {
        extractPlugins.push(vueExtractPlugin);
    }

    // If we want to import a global styles file in every component,
    // use sass resources loader
    if (Config.extractVueStyles && Config.globalVueStyles) {
        Verify.dependency('sass-resources-loader', ['sass-resources-loader']);
        tap(rules[rules.length - 1].options.loaders, vueLoaders => {
            vueLoaders.scss.push({
                loader: 'sass-resources-loader',
                options: {
                    resources: Mix.paths.root(Config.globalVueStyles)
                }
            });
            vueLoaders.sass.push({
                loader: 'sass-resources-loader',
                options: {
                    resources: Mix.paths.root(Config.globalVueStyles)
                }
            });
        });
    }

    return { rules, extractPlugins };
};
