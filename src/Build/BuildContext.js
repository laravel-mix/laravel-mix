const { Chunks } = require('../Chunks');
const Task = require('../tasks/Task');
const { Manifest } = require('./Manifest');
const { TaskRecord } = require('./TaskRecord');

/**
 * Holds all the data necessary for the current build
 */
exports.BuildContext = class BuildContext {
    /**
     * @param {import('../Mix')} mix
     */
    constructor(mix) {
        /** @internal */
        this.mix = mix;

        /**
         * @public
         * @type {typeof mix.config}
         */
        this.config = Object.create(mix.config);

        /**
         * @public
         */
        this.chunks = new Chunks(Object.create(mix, {
            config: {
                get: () => this.config,
            }
        }));

        /**
         * @public
         */
        this.manifest = new Manifest();

        /**
         * @type {TaskRecord[]}
         **/
        this.tasks = [];

        /** Record<string, any> */
        this.metadata = {};
    }

    /**
     * Queue up a new task.
     *
     * @param {Task<any>} task
     * @param {{ when: "before" | "during" | "after"}} options
     */
    addTask(task, options) {
        this.tasks.push(new TaskRecord({ task, when: options.when }));
    }

    #createApi() {
        const api = this.mix.registrar.installAll()

        // @ts-ignore: Legacy — move this to a component?
        api.inProduction = () => this.config.production;

        return api
    }

    /**
     * @returns {import("laravel-mix")}
     */
    get api() {
        return this._api = this._api || this.#createApi();
    }
};
