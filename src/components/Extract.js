const path = require('path');
const File = require('../File');
const { Component } = require('./Component');

/** @typedef {import('../../types/extract').Extraction} Extraction */
/** @typedef {import('../../types/extract').ExtractConfig} ExtractConfig */
/** @typedef {import('../builder/Entry')} Entry */

module.exports = class Extract extends Component {
    /** @type {Entry|null} */
    entry = null;

    /** @type {Extraction[]} */
    extractions = [];

    /**
     * The name of the component.
     *
     * mix.extract() or mix.extractVendor()
     */
    name() {
        return ['extract', 'extractVendors'];
    }

    /**
     * Register the component.
     *
     * @param {ExtractConfig} [config]
     * @param {string} [output]
     */
    register(config = null, output = null) {
        this.context.chunks.runtime = true;
        this.extractions.push(this.normalizeExtraction(config, output));
    }

    /**
     * Assets to append to the webpack entry.
     *
     * @param {Entry} entry
     */
    webpackEntry(entry) {
        this.entry = entry;
        this.context.chunks.entry = entry;

        if (!this.context.bundlingJavaScript) {
            throw new Error('You must compile JS to extract vendor code');
        }

        this.extractions.forEach(extraction => {
            const path = this.extractionPath(extraction.to);
            const isDefaultVendorChunk =
                extraction.to === null ||
                extraction.to === undefined ||
                extraction.test.source ===
                    '(?<!node_modules)[\\\\/]node_modules[\\\\/]()';

            this.context.chunks.add(
                `vendor${this.extractions.indexOf(extraction)}`,
                path.replace(/\.js$/, ''),
                extraction.test,
                {
                    chunks: 'all',
                    enforce: true,
                    priority: isDefaultVendorChunk ? -10 : 0
                }
            );
        });
    }

    extractionPath(outputPath) {
        if (outputPath) {
            return new File(outputPath).normalizedOutputPath();
        }

        return path.join(this.entry.base, 'vendor').replace(/\\/g, '/');
    }

    /**
     *
     * @param {ExtractConfig|null} [config]
     * @param {string} [output]
     * @returns {Extraction}
     */
    normalizeExtraction(config = null, output = null) {
        config = config || {};

        if (typeof config === 'string') {
            if (output !== null || !config.endsWith('.js')) {
                throw new Error(
                    'mix.extract(string) expects a file path as its only argument'
                );
            }

            config = { to: config };
        } else if (typeof config === 'function') {
            config = { test: config };
        } else if (Array.isArray(config)) {
            config = { test: this.buildLibraryRegex(config) };
        }

        return {
            to: output || null,
            ...config,
            test: config.test || this.buildLibraryRegex(config.libraries || [])
        };
    }

    /**
     *
     * @param {string[]|RegExp} libraries
     */
    buildLibraryRegex(libraries = []) {
        let pattern = '(?<!node_modules)[\\\\/]node_modules[\\\\/]';
        let extra = '';

        if (Array.isArray(libraries)) {
            extra = libraries.map(lib => `${lib}[\\\\/]`).join('|');
        } else if (libraries instanceof RegExp) {
            extra = libraries.source;
        } else {
            throw new Error(
                `Unexpected type [${typeof libraries}] passed to mix.extract({ libraries: … }). ` +
                    `You may pass either an array of strings or a regular expression.`
            );
        }

        return new RegExp(`${pattern}(${extra})`, 'i');
    }
};
