// Type definitions for laravel-mix 6.0

import * as webpack from 'webpack';
import { TransformOptions as BabelConfig } from 'babel-core';

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

export interface ClassComponent {
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

export type Component = ClassComponent | FunctionalComponent;
