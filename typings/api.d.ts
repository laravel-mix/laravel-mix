// Type definitions for laravel-mix 6.0
// Project: https://github.com/JeffreyWay/laravel-mix#readme
// Definitions by: Geoff Garbers <https://github.com/garbetjie>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import * as webpack from 'webpack';
import { TransformOptions as BabelConfig } from 'babel-core';
import { MixConfig } from './config';

export interface Api {
    sourceMaps(
        generateForProduction?: boolean,
        devType?: string,
        productionTyp?: string
    ): Api;

    setPublicPath(defaultPath: string): Api;

    setResourceRoot(path: string): Api;

    webpackConfig(config: webpack.Configuration): Api;
    webpackConfig(
        config: (webpack: typeof import('webpack')) => webpack.Configuration
    ): Api;

    babelConfig(config: BabelConfig): Api;

    options(options: MixConfig): Api;

    before(callback: (data: any) => void): Api;
    after(callback: (data: any) => void): Api;
    then(callback: (data: any) => void): Api;

    override(callback: (data: any) => void): Api;

    inProduction(): boolean;

    config: MixConfig;
}
