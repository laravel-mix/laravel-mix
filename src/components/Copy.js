let CopyFilesTask = require('../tasks/CopyFilesTask');

class Copy {
    name() {
        return ['copy', 'copyDirectory'];
    }

    register(from, to) {
        Mix.addTask(new CopyFilesTask({ from, to: new File(to) }));
    }
}

module.exports = Copy;
