// Type definitions for laravel-mix 6.0

import * as webpack from 'webpack';
import { Options as AutoprefixerConfig } from 'autoprefixer';
import { Options as CleanCssConfig } from 'clean-css';
import { CssNanoOptions as CssNanoConfig } from 'cssnano';
import { Options as GifsicleConfig } from 'imagemin-gifsicle';
import { Options as MozjpegConfig } from 'imagemin-mozjpeg';
import { Options as OptipngConfig } from 'imagemin-optipng';
import { Options as SvgoConfig } from 'imagemin-svgo';
import { TransformOptions as BabelConfig } from 'babel-core';
// import { TerserPluginOptions } from 'terser-webpack-plugin';
import { TerserPluginOptions } from './terser';
import { AcceptedPlugin } from 'postcss';

interface MixConfig {
    /** Determine if webpack should be triggered in a production environment. */
    production?: boolean;

    /** Determine if we should enable hot reloading. */
    hmr?: boolean;

    /** Hostname and port used for the hot reload module */
    hmrOptions?: {
        host: string;
        port: string;
    };

    /**
     * PostCSS plugins to be applied to compiled CSS.
     *
     * See: https://github.com/postcss/postcss/blob/master/docs/plugins.md
     **/
    postCss?: AcceptedPlugin[];

    /**
     * Determine if we should enable autoprefixer by default.
     * May be set to false to disable it.
     **/
    autoprefixer?: false | AutoprefixerConfig;

    /** The public path for the build. */
    publicPath?: string;

    /**
     * The path for the runtime chunk (`manifest.js`).
     *
     * Defaults to being placed next to compiled JS files.
     **/
    runtimeChunkPath?: string | null;

    /** Determine if error notifications should be displayed for each build. */
    notifications?: {
        onSuccess?: boolean;
        onFailure?: boolean;
    };

    /**
     * Determine if sourcemaps should be created for the build.
     *
     * @deprecated Please use mix.sourceMaps() instead
     **/
    sourcemaps: false | string;

    /** The resource root for the build. */
    resourceRoot?: string;

    /**
     * Image Loader defaults.
     * See: https://github.com/thetalecrafter/img-loader#options
     **/
    imgLoaderOptions?: {
        enabled?: boolean;
        gifsicle?: GifsicleConfig;
        mozjpeg?: MozjpegConfig;
        optipng?: OptipngConfig;
        svgo?: SvgoConfig;
    };

    /** File Loader directory defaults. */
    fileLoaderDirs?: {
        images?: string;
        fonts?: string;
    };

    /**
     * Determine if CSS relative url()s should be resolved by webpack.
     * Disabling this can improve performance greatly.
     **/
    processCssUrls?: boolean;

    /**
     * Terser-specific settings for Webpack.
     *
     * See: https://github.com/webpack-contrib/terser-webpack-plugin#options
     **/
    terser?: TerserPluginOptions;

    /**
     * cssnano-specific settings for Webpack.
     * Disabled if set to false.
     *
     * See: https://cssnano.co/optimisations/
     **/
    cssNano?: false | CssNanoConfig;

    /**
     * CleanCss-specific settings for Webpack.
     *
     * See: https://github.com/jakubpawlowicz/clean-css#constructor-options
     **/
    cleanCss?: CleanCssConfig;

    /**
     * Custom Webpack-specific configuration to merge/override Mix's.
     *
     * @see mix.webpackConfig()
     **/
    webpackConfig?: webpack.Configuration;

    /** Custom Babel configuration to be merged with Mix's defaults. */
    babelConfig?: BabelConfig;

    /**
     * Determine if Mix should ask the friendly errors plugin to
     * clear the console before outputting the results or not.
     *
     * https://github.com/geowarin/friendly-errors-webpack-plugin#options
     **/
    clearConsole?: boolean;

    /**
     * Options to pass to vue-loader
     *
     * @deprecated Use `.vue({options: {…}})` instead
     **/
    vue?: any;

    /** The default Babel configuration. */
    babel?: (babelRcPath?: string) => BabelConfig;

    /** Merge the given options with the current defaults. */
    merge?: (options: MixConfig) => void;
}
