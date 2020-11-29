// Type definitions for laravel-mix 6.0

// This is a workaround because `TerserPluginOptions` isn't exported from webpack-terser-plugin

// import { Rules } from 'webpack';
import { MinifyOptions } from 'terser';
import { RawSourceMap } from 'source-map';

// This type isn't exported from webpack…
type Rules = string | RegExp | (string | RegExp)[];

export type TerserPluginOptions = {
    test?: Rules;
    include?: Rules;
    exclude?: Rules;
    terserOptions?: MinifyOptions;
    extractComments?: ExtractCommentsOptions;
    parallel?: boolean;
    minify?: CustomMinifyFunction;
};

// None of these types are exported from Terser
type ExtractCommentsBanner = boolean | string | ((commentsFile: string) => string);
type ExtractCommentsCondition = boolean | string | RegExp | ExtractCommentsFunction;
type ExtractCommentsFilename = string | ((fileData: any) => string);

type ExtractCommentsObject = {
    condition: ExtractCommentsCondition;
    filename: ExtractCommentsFilename;
    banner: ExtractCommentsBanner;
};

type ExtractCommentsFunction = (
    astNode: any,
    comment: {
        value: string;
        type: 'comment1' | 'comment2' | 'comment3' | 'comment4';
        pos: number;
        line: number;
        col: number;
    }
) => boolean;

type ExtractCommentsOptions = ExtractCommentsCondition | ExtractCommentsObject;

type CustomMinifyFunction = (
    file: Record<string, string>,
    sourceMap: RawSourceMap,
    minifyOptions: MinifyOptions
) => void;
