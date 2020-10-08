import { Module } from 'webpack';

/**
 * Specify a custom extraction test
 * Equivalent to providing a function to webpack's split chunks
 */
export type ExtractTestCallback = ((module: Module, context: any) => boolean);

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
    libraries: string[];
};

export type ExtractConfig =
    // A filename for node_modules extractions
    | string

    // A list of vendor files
    | string[]

    // Extraction config
    | Partial<Extraction>;
