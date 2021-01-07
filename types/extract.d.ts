// Type definitions for laravel-mix 6.0

import * as webpack from 'webpack';

/**
 * Specify a custom extraction test
 * Equivalent to providing a function to webpack's split chunks
 */
export type ExtractTestCallback = (module: webpack.Module, context: any) => boolean;

/**
 * Specify a custom extraction test
 * Can be a regular expression or a function
 */
export type Extraction = {
    /** The path to extract files to */
    to: string;

    /** A custom test regex or callback — takes precedence over libraries  */
    test: RegExp | ExtractTestCallback;

    /** A list of libraries to match against */
    libraries: string[] | RegExp;
};

export type ExtractConfig =
    // A filename for node_modules extractions
    | string

    // A list of vendor files
    | string[]

    // Custom extraction test function
    | ExtractTestCallback

    // Extraction config
    | Partial<Extraction>;
