// Type definitions for laravel-mix 6.0
// Project: https://github.com/JeffreyWay/laravel-mix#readme
// Definitions by: Geoff Garbers <https://github.com/garbetjie>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import { Api as MixApi } from './api';

declare namespace mix {
    interface Api extends MixApi {
        //
    }
}

declare const api: mix.Api;
export = api;
