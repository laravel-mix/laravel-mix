import api from './index';
import { MixConfig } from './config';
import MixHelpers from '../src/Mix';
import WebpackConfig from '../src/builder/WebpackConfig';

type ElementType<T> = T extends ReadonlyArray<infer U> ? ElementType<U> : T;

declare global {
    // Mix test-only globals
    declare var mix = api;

    // General globals added by including Mix
    declare var Mix: MixHelpers;
    declare var Config: MixConfig;
    declare var webpackConfig: WebpackConfig;

    // Helpers added by including Mix
    declare var tap: <T>(val: T, callback: (v: T) => void) => T;
    declare var flatten: <T extends unknown[]>(arr: T) => ElementType<T>[];

    interface ArrayConstructor {
        wrap<T>(val: T | T[] | ArrayLike<T>): T[];
    }

    interface Array {
        tap(callback: (arr: this) => void): this;
    }
}
