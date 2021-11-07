// Type definitions for laravel-mix 6.0
// Project: https://github.com/JeffreyWay/laravel-mix#readme
// Definitions by: Geoff Garbers <https://github.com/garbetjie>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import * as webpack from 'webpack';
import { TransformOptions as BabelConfig } from '@babel/core';
import { Options as BrowserSyncConfig } from './browsersync';
import * as ExtractTypes from './extract';
import { MixConfig } from './config';
import { Component } from './component';

// @ts-ignore - May not be installed initially
import { AcceptedPlugin } from 'postcss';

// @ts-ignore - May not be installed initially
import { VueLoaderOptions } from 'vue-loader';

// @ts-ignore - May not be installed initially
import MixHelpers from '../src/Mix';

// General API
interface Api {
    /** Set the public path */
    setPublicPath(path: string): Api;

    /** Set the resource path */
    setResourceRoot(path: string): Api;

    /** Override Mix config options */
    options(options: MixConfig): Api;

    /** Determine if mix is building for production */
    inProduction(): boolean;

    /** Extend the mix api. This makes the component available as mix.name_here */
    extend(name: string, component: Component): Api;

    /** Wait for a callback before starting the build */
    before(callback: (Mix: MixHelpers) => void | Promise<void>): Api;

    /** Run a callback after the build has completed */
    after(callback: (stats: webpack.Stats) => void | Promise<void>): Api;

    /** Run a callback after the build has completed */
    then(callback: (stats: webpack.Stats) => void | Promise<void>): Api;

    /** Run a callback if a condition is true */
    when(condition: boolean, callback: (mix: Api) => void | Promise<void>): Api;
}

// Webpack config related abilities
interface Api {
    /** Merge custom webpack config */
    webpackConfig(config: webpack.Configuration): Api;

    /** Merge custom webpack config */
    webpackConfig(
        callback: (
            webpack: typeof import('webpack'),
            config: webpack.Configuration
        ) => webpack.Configuration
    ): Api;

    /** Override the webpack config after it is built */
    override(callback: (config: webpack.Configuration) => void): Api;

    /** Override the used babel config */
    babelConfig(config: BabelConfig): Api;

    /** Dump the webpack config when mix builds */
    dump(): Api;

    /** Dump the webpack config when mix builds */
    dumpWebpackConfig(): Api;
}

type CodeValuePrimitive = undefined | null | string | number | bigint | boolean;
type LazyCodeValue = () => CodeValuePrimitive;
type CodeValue = CodeValuePrimitive | LazyCodeValue;

// Assorted capabilities
interface Api {
    /** Add webpack-resolution aliases */
    alias(paths: Record<string, string>): Api;

    /** Autoload libraries */
    autoload(libraries: Record<string, string | string[]>): Api;

    /** Use BrowserSync to monitor files for changes and inject changes into the browser */
    browserSync(proxy: string): Api;

    /** Use BrowserSync to monitor files for changes and inject changes into the browser  */
    browserSync(config?: BrowserSyncConfig): Api;

    /** Generate source maps */
    sourceMaps(
        generateForProduction?: boolean,
        devType?: string,
        productionType?: string
    ): Api;

    /**
     * Version assets by hashing them and placing this hash url used in the mix manifest
     *
     * You may optionally pass an additional list of files to version in the mix manifest.
     **/
    version(files?: string | string[]): Api;

    /** Disable system notifications when mix builds assets */
    disableNotifications(): Api;

    /** Disable only success notifications when mix builds assets */
    disableSuccessNotifications(): Api;

    /** Replace variables in code with other values  */
    define(definitions: Record<string, CodeValue>): Api;
}

// JS / Transpilation capabilities
interface Api {
    /**
     * Compile modern javascript
     *
     * `src` may be a glob pattern
     **/
    js(src: string | string[], output: string): Api;

    /**
     * Compile typescript into JS
     *
     * `src` may be a glob pattern
     **/
    ts(src: string | string[], output: string): Api;

    /**
     * Compile TypeScript into JS
     *
     * `src` may be a glob pattern
     **/
    typeScript(src: string | string[], output: string): Api;

    /**
     * Compile CoffeeScript into JS
     *
     * `src` may be a glob pattern
     **/
    coffee(src: string | string[], output: string): Api;
}

// File related capabilities
interface Api {
    /** Copy files specified by `from` and place them in `to` */
    copy(from: string | string[], to: string): Api;

    /** Copy files specified by `from` and place them in `to` */
    copyDirectory(from: string | string[], to: string): Api;

    /**
     * Concatenate files specified by `src` and place them in `output` (or the public dir by default)
     *
     * You may pass a glob pattern to `src` to match several files.
     **/
    combine(src: string | string[], output?: string, babel?: boolean): Api;

    /**
     * Concatenate files specified by `src` and place them in `output` (or the public dir by default)
     *
     * You may pass a glob pattern to `src` to match several files.
     **/
    babel(src: string | string[], output?: string, babel?: boolean): Api;

    /**
     * Concatenate files specified by `src` and place them in `output` (or the public dir by default)
     *
     * You may pass a glob pattern to `src` to match several files.
     **/
    minify(src: string | string[], output?: string, babel?: boolean): Api;

    /**
     * Concatenate files specified by `src` and place them in `output` (or the public dir by default)
     *
     * You may pass a glob pattern to `src` to match several files.
     **/
    scripts(src: string | string[], output?: string, babel?: boolean): Api;

    /**
     * Concatenate files specified by `src` and place them in `output` (or the public dir by default)
     *
     * You may pass a glob pattern to `src` to match several files.
     **/
    styles(src: string | string[], output?: string, babel?: boolean): Api;
}

// Styling related capabilities
interface Api {
    /** Compile CSS via PostCSS */
    css(src: string, output: string, plugins?: AcceptedPlugin[]): Api;

    /** Compile CSS via PostCSS */
    css(
        src: string,
        output: string,
        pluginOptions?: object,
        plugins?: AcceptedPlugin[]
    ): Api;

    /** Compile CSS via PostCSS */
    postCss(src: string, output: string, plugins?: AcceptedPlugin[]): Api;

    /** Compile CSS via PostCSS */
    postCss(
        src: string,
        output: string,
        pluginOptions?: object,
        plugins?: AcceptedPlugin[]
    ): Api;

    /** Compile Stylus into CSS */
    stylus(
        src: string,
        output: string,
        pluginOptions?: object,
        postCssPlugins?: AcceptedPlugin[]
    ): Api;

    /** Compile Less into CSS */
    less(
        src: string,
        output: string,
        pluginOptions?: object,
        postCssPlugins?: AcceptedPlugin[]
    ): Api;

    /** Compile Sass/SCSS into CSS */
    sass(
        src: string,
        output: string,
        pluginOptions?: object,
        postCssPlugins?: AcceptedPlugin[]
    ): Api;
}

// Vendor extraction
interface Api {
    /** Extract all matching chunks to `config.to` / `output` / vendor.js  */
    extract(config: Partial<ExtractTypes.Extraction>, output?: string): Api;

    /** Extract all chunks matching the given test to `output` / vendor.js  */
    extract(test: ExtractTypes.ExtractTestCallback, output?: string): Api;

    /** Extract the given libraries into `output` / vendor.js  */
    extract(libs: string[], output?: string): Api;

    /** Extract libraries from node_modules into `output` / vendor.js */
    extract(output?: string): Api;
}

type VueConfig = {
    /** Which version of Vue to support. Detected automatically if not given. */
    version?: number;

    /** A file to include w/ every vue style block. */
    globalStyles?: false | string | string[] | Record<string, string | string[]>;

    /** Whether or not to extract vue styles. If given a string the name of the file to extract to. */
    extractStyles?: boolean | string;

    /** Use vue-style-loader to extract Vue Styles. */
    useVueStyleLoader?: boolean;

    /** Whether or not to use the runtime only version of Vue. */
    runtimeOnly?: boolean;

    /** Options to pass to Vue Loader */
    options?: VueLoaderOptions;
};

type ReactConfig = {
    /** Whether or not to extract React styles. If given a string the name of the file to extract to. */
    extractStyles?: boolean | string;
};

// Third-party support "feature flags"
interface Api {
    /** Enable support for Preact */
    preact(): Api;

    /** Enable support for React */
    react(config?: ReactConfig): Api;

    /**
     * Enable support for Vue 2 or 3
     *
     * The version of Vue in use is detected but may be specified explicitly using `version`
     *
     * Pass options to configure global styles and Vue component style extraction
     **/
    vue(config?: VueConfig): Api;
}

declare const exports: Api;
declare namespace exports {
    export { Api, ReactConfig, VueConfig };
}

declare global {
    /**
     * The context for the current mix build group
     *
     * @deprecated This will go away in a future release
     **/
    var Mix: import('../src/Mix.js');

    /**
     * The webpack config helper for the current mix build group
     *
     * @deprecated This will go away in a future release
     **/
    var webpackConfig: import('../src/builder/WebpackConfig');

    /**
     * The options for the current mix build group
     *
     * @deprecated This will go away in a future release
     **/
    var Config: ReturnType<typeof import('../src/config')>;
}

export = exports;
