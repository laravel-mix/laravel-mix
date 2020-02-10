// Type definitions for laravel-mix 5.0
// Project: https://github.com/JeffreyWay/laravel-mix#readme
// Definitions by: Geoff Garbers <https://github.com/garbetjie>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import * as webpack from 'webpack';
import { Options as AutoprefixerConfig } from 'autoprefixer';
import { Options as CleanCssConfig } from 'clean-css';
import { CssNanoOptions as CssNanoConfig } from 'cssnano';
import { Options as GifsicleConfig } from 'imagemin-gifsicle';
import { Options as MozjpegConfig } from 'imagemin-mozjpeg';
import { Options as OptipngConfig } from 'imagemin-optipng';
import { Options as SvgoConfig } from 'imagemin-svgo';
import { TransformOptions as BabelConfig } from 'babel-core';
import { Options as BrowserSyncConfig } from 'browser-sync';
import { PurifyOptions } from 'purifycss-webpack';

interface MixConfig {
    production?: boolean;
    hmr?: boolean;
    hmrOptions?: {
        host: string;
        port: string;
    };
    postCss?: any[];
    autoprefixer?: {
        enabled?: boolean;
        options?: AutoprefixerConfig;
    };
    purifyCss?: boolean | PurifyOptions;
    publicPath?: string;
    notifications?: {
        onSuccess?: boolean;
        onFailure?: boolean;
    };
    sourceMaps?: boolean;
    resourceRoot?: string;
    imgLoaderOptions?: {
        enabled?: boolean;
        gifsicle?: GifsicleConfig;
        mozjpeg?: MozjpegConfig;
        optipng?: OptipngConfig;
        svgo?: SvgoConfig;
    };
    fileLoaderDirs?: {
        images?: string;
        fonts?: string;
    };
    babel?: (babelRcPath: string) => BabelConfig;
    processCssUrls?: boolean;
    extractVueStyles?: boolean;
    globalVueStyles?: string;
    terser?: {
        cache?: boolean;
        parallel?: boolean;
        sourceMap?: boolean;
        terserOptions?: {
            compress?: {
                warnings?: boolean;
            };
            output?: {
                comments?: boolean;
            };
        };
    };
    cssNano?: CssNanoConfig;
    cleanCss?: CleanCssConfig;
    webpackConfig?: webpack.Configuration;
    babelConfig?: BabelConfig;
    clearConsole?: boolean;
    merge?: (options: MixConfig) => void;
}

declare module 'laravel-mix' {
    export = Api;

    namespace builder {
        interface Entry {}
    }

    namespace components {
        type _Preprocessor = (
            src: string,
            output: string,
            pluginOptions?: object,
            postCssPlugins?: any[]
        ) => Api;

        type Autoload = (libs: object) => Api;
        type Babel = Combine;
        type BrowserSync = (userConfig: string | BrowserSyncConfig) => Api;
        type Coffee = Javascript;
        type Combine = (
            src: string | string[],
            output?: string,
            babel?: boolean
        ) => Api;
        type Copy = (from: string | string[], to: string) => Api;
        type CopyDirectory = Copy;
        type Css = () => Api;
        type DisableNotifications = () => Api;
        type DisableSuccessNotifications = DisableNotifications;
        type Dump = DumpWebpackConfig;
        type DumpWebpackConfig = () => Api;
        type Extend = (
            name: string,
            component:
                | Component
                | ((
                      mix: Api,
                      config: webpack.Configuration,
                      ...args: any[]
                  ) => void)
        ) => Api;
        type Extract =
            | ((output: string) => Api)
            | ((libs: string | string[], output: string) => Api);
        type ExtractVendors = Extract;
        type Javascript = (entry: string | string[], output: string) => Api;
        type Less = _Preprocessor;
        type Minify = Combine;
        type Notifications = () => Api;
        type PostCss = (
            src: string,
            output: string,
            postCssPlugins?: any[] | any
        ) => Api;
        type Preact = Javascript;
        type React = Javascript;
        type Sass = _Preprocessor;
        type Scripts = Combine;
        type Styles = Combine;
        type Stylus = _Preprocessor;
        type Typescript = Javascript;
        type Version = (files?: string | string[]) => Api;
        type Vue = Javascript;
    }

    interface Component {
        name?: () => string;
        register?: (...args: any[]) => void;
        passive?: boolean;
        mix?: () => string[];
        dependencies?: () => string | string[];
        boot?: () => void;
        babelConfig?: () => BabelConfig;
        webpackPlugins?: () => webpack.Plugin | webpack.Plugin[];
        webpackConfig?: (config: webpack.Configuration) => void;
        webpackEntry?: (entry: builder.Entry) => void;
        webpackRules?: () => webpack.RuleSetRule | webpack.RuleSetRule[];
    }

    class Api {
        sourceMaps(
            generateForProduction?: boolean,
            devType?: string,
            productionTyp?: string
        ): Api;

        setPublicPath(defaultPath: string): Api;

        setResourceRoot(path: string): Api;

        webpackConfig(
            config: webpack.Configuration | ((n: any) => webpack.Configuration)
        ): Api;

        babelConfig(config: BabelConfig): Api;

        options(options: MixConfig): Api;

        then(callback: (data: any) => void): Api;

        override(callback: (data: any) => void): Api;

        inProduction(): boolean;

        config: MixConfig;

        // Components.

        autoload: components.Autoload;
        browserSync: components.BrowserSync;
        coffee: components.Coffee;
        combine: components.Combine;
        scripts: components.Scripts;
        babel: components.Babel;
        styles: components.Styles;
        minify: components.Minify;
        copy: components.Copy;
        copyDirectory: components.CopyDirectory;
        css: components.Css; // TODO
        disableNotifications: components.DisableNotifications;
        disableSuccessNotifications: components.DisableSuccessNotifications;
        dumpWebpackConfig: components.DumpWebpackConfig;
        dump: components.Dump;
        extend: components.Extend;
        extract: components.Extract;
        extractVendors: components.ExtractVendors;
        js: components.Javascript;
        less: components.Less;
        notifications: components.Notifications;
        postCss: components.PostCss;
        preact: components.Preact;
        react: components.React;
        sass: components.Sass;
        stylus: components.Stylus;
        typeScript: components.Typescript;
        ts: components.Typescript;
        version: components.Version;
        vue: components.Vue;
    }
}
