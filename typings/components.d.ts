// Type definitions for laravel-mix 6.0
// Project: https://github.com/JeffreyWay/laravel-mix#readme
// Definitions by: Geoff Garbers <https://github.com/garbetjie>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import * as webpack from 'webpack';
import { TransformOptions as BabelConfig } from 'babel-core';
import { Options as BrowserSyncConfig } from 'browser-sync';
import * as ExtractTypes from './extract';

// @ts-ignore - May not be installed initially
import { AcceptedPlugin } from 'postcss';

// @ts-ignore - May not be installed initially
import { VueLoaderOptions } from 'vue-loader';

export type DependencyObject = {
    /** The name of the package */
    package: string;

    /**
     * An additional, manual check to see if the package that is installed matches necessary expectations.
     *
     * For example you may use this to see if the installed package is the right version or has an expected API.
     *
     * The passed object is `require(package)`
     **/
    check?: (obj: any) => boolean;
};

/** A required depedency for this component to work */
export type Dependency = string | DependencyObject;

export interface Component {
    /** Whether or not to automatically register this component */
    passive?: boolean;

    /**
     * Register this component
     *
     * `args` reflect what was passed in via `mix.component_name(...args)`
     **/
    register?(...args: any[]): void;

    /**
     * The public API name / names for this component.
     * These get attached to the mix object and when called will register this compoent.
     *
     * For example if name returns `['foo', 'bar']` then you may
     * register this component via both `mix.foo()` and `mix.bar()`
     **/
    name?(): string | string[];

    /**
     * Specifiy one or more dependencies that must
     * be installed for this component to work
     **/
    dependencies?(): Dependency | Dependency[];

    /**
     * Boot this component
     * This is called after registration and dependencies have been installed
     * but before any configuration changes have taken place
     **/
    boot?(): void;

    /** Modify the babel config */
    babelConfig?(): BabelConfig;

    /** Update the build webpack entries */
    webpackEntry?(entry: any): void;

    /** Add one or more rules to the webpack config */
    webpackRules?(): webpack.RuleSetRule | webpack.RuleSetRule[];

    /** Add one or more plugins to the webpack config */
    webpackPlugins?(): webpack.WebpackPluginInstance[];

    /** Update the webpack config */
    webpackConfig?(config: webpack.Configuration): void;

    /** Add additional components to the Mix API */
    mix?(): Record<string, Component>;
}

export interface FunctionalComponent {
    (mix: Api, config: webpack.Configuration, ...args: any[]): void;
}

export interface Api {
    /**
     * Autoload libraries
     *
     * @param libraries
     **/
    autoload(libraries: Record<string, string | string[]>): Api;

    /** Use BrowserSync to monitor files for changes and inject changes into the browser */
    browserSync(proxy: string): Api;

    /** Use BrowserSync to monitor files for changes and inject changes into the browser  */
    browserSync(config?: BrowserSyncConfig): Api;

    /** Extend the mix api. This makes the component available as mix.name_here */
    extend(name: string, component: Component | FunctionalComponent): Api;

    /** Dump the webpack config when mix builds */
    dump(): Api;

    /** Dump the webpack config when mix builds */
    dumpWebpackConfig(): Api;

    /** Disable system notifications when mix builds assets */
    disableNotifications(): Api;

    /** Disable only success notifications when mix builds assets */
    disableSuccessNotifications(): Api;

    /**
     * Version assets by hashing them and placing this hash url used in the mix manifest
     *
     * You may optionally pass an additional list of files to version in the mix manifest.
     **/
    version(files?: string | string[]): Api;
}

export interface Api {
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

export interface Api {
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

export interface Api {
    /** Compile CSS via PostCSS */
    css(src: string, output: string, plugins?: AcceptedPlugin[]): Api;

    /** Compile CSS via PostCSS */
    postCss(src: string, output: string, plugins?: AcceptedPlugin[]): Api;

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

export interface Api {
    /** Extract all matching chunks to `config.to` / `output` / vendor.js  */
    extract(config: Partial<ExtractTypes.Extraction>, output?: string): Api;

    /** Extract all chunks matching the given test to `output` / vendor.js  */
    extract(test: ExtractTypes.ExtractTestCallback, output?: string): Api;

    /** Extract the given libraries into `output` / vendor.js  */
    extract(libs: string[], output?: string): Api;

    /** Extract libraries from node_modules into `output` / vendor.js */
    extract(output?: string): Api;
}

export type VueConfig = {
    /** Which version of Vue to support. Detected automatically if not given. */
    version?: number;

    /** A file to include w/ every vue style block. */
    globalStyles?: boolean | string | string[] | Record<string, string | string[]>;

    /** Whether or not to extract vue styles. If given a string the name of the file to extract to. */
    extractStyles?: boolean | string;

    /** Options to pass to Vue Loader */
    options: VueLoaderOptions;
};

export interface Api {
    /** Enable support for Preact */
    preact(): Api;

    /** Enable support for React */
    react(): Api;

    /**
     * Enable support for Vue 2 or 3
     *
     * The version of Vue in use is detected but may be specified explicitly using `version`
     *
     * Pass options to configure global styles and Vue component style extraction
     **/
    vue(config?: VueConfig): Api;
}
