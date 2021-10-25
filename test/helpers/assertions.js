import File from '../../src/File.js';

/**
 * Check that a matching webpack rule can be found
 *
 * @param {import("webpack").Configuration} config
 * @param {(rule: import("webpack").RuleSetRule) => boolean} test
 */
function hasWebpackRule(config, test) {
    /** @param {import("webpack").RuleSetRule} rule */
    const checkRule = rule =>
        test(rule) ||
        (rule.oneOf || []).find(checkRule) ||
        (rule.rules || []).find(checkRule);

    return !!config.module.rules.find(checkRule);
}

/**
 * Check that a matching rule with the given loader can be found
 *
 * @param {import("webpack").Configuration} config
 * @param {string|RegExp|((loader: string) => boolean)} loader
 */
function hasWebpackLoader(config, loader) {
    const checkLoader =
        typeof loader === 'string'
            ? str => new RegExp(`[\/\\\\]${loader}[\/\\\\]`).test(str)
            : loader instanceof RegExp
            ? str => loader.test(str)
            : loader;

    return hasWebpackRule(
        config,
        rule =>
            (rule.loader && checkLoader(rule.loader)) ||
            (rule.use || []).find(use => checkLoader(use.loader))
    );
}

export default {
    /**
     * Assert that a matching webpack rule can be found
     *
     * @param {import("ava").Assertions} t
     * @param {import("webpack").Configuration} config
     * @param {(rule: import("webpack").RuleSetRule) => boolean} test
     */
    hasWebpackRule: (t, config, test) => t.true(hasWebpackRule(config, test)),

    /**
     * Assert that a rule with the given loader can be found
     *
     * @param {import("ava").Assertions} t
     * @param {import("webpack").Configuration} config
     * @param {string|RegExp|((loader: string) => boolean)} loader
     */
    hasWebpackLoader: (t, config, loader) => t.true(hasWebpackLoader(config, loader)),

    /**
     * Assert that a rule with the given loader cannot be found
     *
     * @param {import("ava").Assertions} t
     * @param {import("webpack").Configuration} config
     * @param {string|RegExp|((loader: string) => boolean)} loader
     */
    doesNotHaveWebpackLoader: (t, config, loader) =>
        t.false(hasWebpackLoader(config, loader)),

    /**
     * Verify that the mix manifest is the same as `expected`
     *
     * @param {Record<string, string>} expected
     * @param {import("ava").Assertions} t
     */
    manifestEquals: (expected, t) => {
        let manifest = JSON.parse(
            File.find(`test/fixtures/app/dist/mix-manifest.json`).read()
        );

        t.deepEqual(Object.keys(manifest).sort(), Object.keys(expected).sort());

        Object.keys(expected).forEach(key => {
            t.true(new RegExp(expected[key]).test(manifest[key]));
        });
    },

    /**
     * Assert that a file exists
     *
     * @param {string} path
     * @param {import("ava").Assertions} t
     */
    fileExists: (path, t) => {
        t.true(File.exists(path));
    },

    /**
     * Assert that a file does not exist
     *
     * @param {string} path
     * @param {import("ava").Assertions} t
     */
    fileDoesNotExist: (path, t) => {
        t.false(File.exists(path));
    },

    /**
     * Assert that a file isn't empty.
     *
     * @param {string} path
     * @param {import("ava").Assertions} t
     */
    fileNotEmpty: (path, t) => {
        t.not(File.find(path).read().replace(/\s/g, ''), '');
    },

    /**
     * Assert that a file path matches the given CSS.
     *
     * @param {string} path
     * @param {string} expected
     * @param {import("ava").Assertions} t
     */
    fileMatchesCss: (path, expected, t) => {
        t.is(File.find(path).read().replace(/\s/g, ''), expected.replace(/\s/g, ''));
    },

    /**
     * Assert that a file contains the given string
     *
     * @param {string} path
     * @param {string} str
     * @param {import("ava").Assertions} t
     */
    fileContains: (path, str, t) => {
        t.true(new File(path).read().includes(str));
    },

    /**
     * Assert that a file does not contain the given string
     *
     * @param {string} path
     * @param {string} str
     * @param {import("ava").Assertions} t
     */
    fileDoesNotContain: (path, str, t) => {
        t.false(new File(path).read().includes(str));
    }
};
