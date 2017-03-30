class Tasks {

    constructor() {
        this.tasks = new Map();
    }

    /**
     * Add task to the tasks list.
     *
     * @param {string} name
     * @param {(function()|Array)} task
     * @returns {Tasks}
     */
    addTask(name, task) {
        this.tasks.set(name, task);

        return this;
    }

    /**
     * Run provided tasks.
     *
     * @param {Array} neededTasks
     */
    initializeTasks(neededTasks) {
        this.resolveTasksCallbacks(neededTasks).forEach(task => task());
    }

    /**
     * Determine unique callbacks for tasks.
     *
     * @param {Array} tasks
     * @returns {Set}
     */
    resolveTasksCallbacks(tasks) {
        let callbacks = new Set();

        let resolver = (taskName, task) => {
            task = typeof taskName === 'function' ? taskName : task;

            if (this.tasks.has(taskName)) {
                task = this.tasks.get(taskName);
            }

            if (Array.isArray(task)) {
                if (task.includes(taskName)) {
                    throw new Error(`Task "${taskName}" contain self referenced task`);
                }

                this.resolveTasksCallbacks(task).forEach(task => callbacks.add(task));
            }

            if (typeof task === 'function') {
                callbacks.add(task);
            }
        };

        if (tasks.includes('all')) {
            this.tasks.forEach(resolver);
        } else {
            tasks.forEach(resolver);
        }

        return callbacks;
    }
}
