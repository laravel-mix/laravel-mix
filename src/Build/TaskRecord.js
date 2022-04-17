const Task = require('../tasks/Task');

exports.TaskRecord = class TaskRecord {
    /**
     * @param {object} param0
     * @param {Task<any>} param0.task
     * @param {"before" | "during" | "after"} param0.when
     */
    constructor({ task, when }) {
        this.task = task;
        this.when = when;
    }
};
