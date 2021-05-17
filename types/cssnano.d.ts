// Type definitions for laravel-mix 6.0
// cssnano v5 does not have a types file yet

import { AcceptedPlugin } from 'postcss';

type CSSNanoPluginResolved = [AcceptedPlugin, Record<string, any>];
type CSSNanoPlugin =
    | string
    | AcceptedPlugin
    | [string, Record<string, any>]
    | CSSNanoPluginResolved;

type CSSNanoPresetFn = () => CSSNanoPresetResolved;
type CSSNanoPresetResolved = { plugins: CSSNanoPluginResolved[] };
type CSSNanoPreset =
    | string
    | CSSNanoPresetFn
    | [string | CSSNanoPresetFn, Record<string, any>]
    | CSSNanoPresetResolved;

interface CssNanoOptions {
    configFile?: string;
    preset?: CSSNanoPreset;
    plugins?: CSSNanoPlugin[];
}
