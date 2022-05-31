import eol from 'eol';
import _ from 'lodash';
import File from '../../src/File.js';

/**
 * Check that a matching webpack rule can be found
 *
 * @param {import("webpack").Configuration} config
 * @param {(rule: import('webpack').RuleSetRule) => boolean} [test]
 * @returns {Generator<import("webpack").RuleSetRule>}
 */
function* getRules(config, test) {
    /** @type {import('webpack').RuleSetRule[]} */
    // @ts-ignore: Configs built by mix always have a rules array
    const rules = (config.module && config.module.rules) || [];

    for (const rule of toRules(rules)) {
        if (test && !test(rule)) {
            continue;
        }

        yield rule;
    }
}

/**
 * Check that a matching webpack rule can be found
 *
 * @param {import('webpack').RuleSetRule} rule
 * @returns {Generator<{ loader: string, options?: Record<string, any>}>}
 */
function* getLoaders(rule) {
    if (rule.loader) {
        // @ts-ignore
        yield { loader: rule.loader, options: rule.options || undefined };
    }

    /** @type {{ loader: string, options?: Record<string, any>}[]} */
    // @ts-ignore
    const loaders = rule.use || [];

    yield* loaders;
}

/**
 * Check that a matching webpack rule can be found
 *
 * @param {import("webpack").RuleSetRule[]} rules
 * @returns {Generator<import("webpack").RuleSetRule>}
 */
function* toRules(rules) {
    for (const rule of rules) {
        yield rule;
        yield* toRules(rule.oneOf || []);
        yield* toRules(rule.rules || []);
    }
}

/**
 * Check that a matching webpack rule can be found
 *
 * @param {import("webpack").Configuration} config
 * @param {(rule: import("webpack").RuleSetRule) => boolean} test
 * @returns {import('webpack').RuleSetRule | undefined}
 */
function findWebpackRule(config, test) {
    for (const rule of getRules(config, test)) {
        return rule;
    }
}

/**
 * Check that a matching webpack rule can be found
 *
 * @param {import("webpack").Configuration} config
 * @param {string|RegExp|((plugin: any) => boolean)} test
 * @returns {NonNullable<import('webpack').Configuration['plugins']>[0] | undefined}
 */
function findWebpackPlugin(config, test) {
    /** @type {(plugin: any) => boolean} */
    const checkPlugin =
        typeof test === 'string'
            ? plugin => plugin.constructor.name === test
            : test instanceof RegExp
            ? plugin => test.test(plugin.constructor.name)
            : test;

    for (const plugin of config.plugins || []) {
        if (checkPlugin(plugin)) {
            return plugin;
        }
    }
}

/**
 * Check that a matching rule with the given loader can be found
 *
 * @param {import("webpack").Configuration} config
 * @param {string|RegExp|((loader: string) => boolean)} loader
 * @param {import('webpack').RuleSetRule|undefined} [forRule]
 */
function findWebpackLoader(config, loader, forRule = undefined) {
    /** @type {(loader: string) => boolean} */
    const checkLoader =
        typeof loader === 'string'
            ? str => new RegExp(`[/\\\\]${loader}[/\\\\]`).test(str)
            : loader instanceof RegExp
            ? str => loader.test(str)
            : loader;

    for (const rule of getRules(
        config,
        rule => forRule === undefined || rule === forRule
    )) {
        for (const found of getLoaders(rule)) {
            if (checkLoader(found.loader)) {
                return found;
            }
        }
    }
}

/**
 * @param {import('ava').ExecutionContext<unknown>} t
 */
export function assert(t) {
    return {
        /**
         * @param {string} path
         */
        file(path) {
            const file = new File(path);

            return {
                exists: () => t.true(file.exists()),
                absent: () => t.false(file.exists()),
                empty: () => t.is(file.read().replace(/\s/g, ''), ''),
                notEmpty: () => t.not(file.read().replace(/\s/g, ''), ''),

                /**
                 * Assert that a file path matches the given CSS.
                 *
                 * TODO: Use postcss to parse the trees to make sure they match instead
                 * This is super janky
                 *
                 * @param {string} path
                 * @param {string} expected
                 * @param {import("ava").Assertions} t
                 */
                matchesCss: expected =>
                    t.is(file.read().replace(/\s/g, ''), expected.replace(/\s/g, '')),

                /**
                 * Assert that a file contains the given string
                 *
                 * @param {string} path
                 * @param {string|string[]} str
                 * @param {import("ava").Assertions} t
                 */
                contains: str => {
                    const content = eol.lf(file.read());

                    for (const snippet of _.concat([], str)) {
                        t.true(content.includes(snippet));
                    }
                },

                /**
                 * Assert that a file does not contain the given string
                 *
                 * @param {string} path
                 * @param {string|string[]} str
                 * @param {import("ava").Assertions} t
                 */
                doesNotContain: str => {
                    const content = eol.lf(file.read());

                    for (const snippet of _.concat([], str)) {
                        t.false(content.includes(snippet));
                    }
                }
            };
        },

        /**
         * Assert that a matching webpack rule can be found
         *
         * @param {import("webpack").Configuration} config
         * @param {(rule: import("webpack").RuleSetRule) => boolean} test
         */
        rule(config, test) {
            return {
                exists: () => t.truthy(findWebpackRule(config, test)),

                /**
                 * @param {string|RegExp|((loader: string) => boolean)} loader
                 */
                loader: loader =>
                    this.loader(config, loader, findWebpackRule(config, test)),

                get: () => findWebpackRule(config, test)
            };
        },

        /**
         * Assert that a rule with the given loader can be found
         *
         * @param {import("webpack").Configuration} config
         * @param {string|RegExp|((loader: string) => boolean)} loader
         * @param {import('webpack').RuleSetRule|undefined} [forRule]
         */
        loader(config, loader, forRule = undefined) {
            return {
                exists: () => t.truthy(findWebpackLoader(config, loader, forRule)),
                absent: () => t.falsy(findWebpackLoader(config, loader, forRule)),
                get: () => findWebpackLoader(config, loader, forRule)
            };
        },

        /**
         * Assert that a rule with the given loader can be found
         *
         * @param {import("webpack").Configuration} config
         * @param {string|RegExp|((plugin: any) => boolean)} plugin
         * @param {import('webpack').RuleSetRule|undefined} [forRule]
         */
        webpackPlugin(config, plugin) {
            return {
                absent: () => t.falsy(findWebpackPlugin(config, plugin)),
                exists: () => t.truthy(findWebpackPlugin(config, plugin)),
                get: () => findWebpackPlugin(config, plugin)
            };
        },

        /**
         * Verify that the mix manifest is the same as `expected`
         *
         * @param {Record<string, string>} expected
         */
        manifestEquals(expected) {
            let manifest = JSON.parse(
                File.find(`test/fixtures/app/dist/mix-manifest.json`).read()
            );

            t.deepEqual(Object.keys(manifest).sort(), Object.keys(expected).sort());

            Object.keys(expected).forEach(key => {
                t.true(new RegExp(expected[key]).test(manifest[key]));
            });
        }
    };
}
