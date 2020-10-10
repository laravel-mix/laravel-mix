// Type definitions for laravel-mix 6.0
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
import { TerserPluginOptions } from 'terser-webpack-plugin';
import * as ExtractTypes from './extract';

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
    terser?: TerserPluginOptions;
    cssNano?: CssNanoConfig;
    cleanCss?: CleanCssConfig;
    webpackConfig?: webpack.Configuration;
    babelConfig?: BabelConfig;
    clearConsole?: boolean;
    merge?: (options: MixConfig) => void;
}

declare module 'laravel-mix' {
    declare const api: Api;
    export = api;

    namespace builder {
        interface Entry {}
    }

    namespace components {
        type Autoload = (libs: Record<string, string>) => Api;
        type BrowserSync = (userConfig: string | BrowserSyncConfig) => Api;
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
            | ((output?: string) => Api)
            | ((libs: string[], output?: string) => Api)
            | ((test: ExtractTypes.ExtractTestCallback, output?: string) => Api)
            | ((
                  config: Partial<ExtractTypes.Extraction>,
                  output?: string
              ) => Api);
        type Notifications = () => Api;
        type Version = (files?: string | string[]) => Api;

        // CSS-related
        type _Preprocessor = (
            src: string,
            output: string,
            pluginOptions?: object,
            postCssPlugins?: any[]
        ) => Api;
        type Css = () => Api;
        type Stylus = _Preprocessor;
        type Less = _Preprocessor;
        type Sass = _Preprocessor;
        type PostCss = (src: string, output: string, plugins?: any[]) => Api;

        // JS-related
        type Coffee = Javascript;
        type Javascript = (entry: string | string[], output: string) => Api;
        type Typescript = Javascript;

        // File-related
        type Combine = (
            src: string | string[],
            output?: string,
            babel?: boolean
        ) => Api;
        type Babel = Combine;
        type Minify = Combine;
        type Scripts = Combine;
        type Styles = Combine;

        type Copy = (from: string | string[], to: string) => Api;
        type CopyDirectory = Copy;

        // Features
        type Preact = () => Api;
        type React = () => Api;
        type Vue = (
            options: {
                version: number;
                extractStyles?: boolean;
                globalStyles?:
                    | boolean
                    | string
                    | string[]
                    | Record<string, string | string[]>;
            }
        ) => Api;
    }

    interface Component {
        name?: () => string;
        register?: (...args: any[]) => void;
        passive?: boolean;
        mix?: () => string[];
        dependencies?: () => string | string[];
        boot?: () => void;
        babelConfig?: () => BabelConfig;
        webpackPlugins?: () => webpack.WebpackPluginInstance[];
        webpackConfig?: (config: webpack.Configuration) => void;
        webpackEntry?: (entry: builder.Entry) => void;
        webpackRules?: () => webpack.RuleSetRule | webpack.RuleSetRule[];
    }

    interface Api {
        sourceMaps(
            generateForProduction?: boolean,
            devType?: string,
            productionTyp?: string
        ): Api;

        setPublicPath(defaultPath: string): Api;

        setResourceRoot(path: string): Api;

        webpackConfig(
            config:
                | webpack.Configuration
                | ((webpack: typeof import('webpack')) => webpack.Configuration)
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
