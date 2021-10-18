const File = require('./File');
const Paths = require('./Paths');

class PackageManager {
    static detect() {
        const execPath = process.env.npm_execpath || '';

        if (
            execPath.endsWith('yarn.js') ||
            execPath.endsWith('yarn') ||
            PackageManager.hasYarnLockFile()
        ) {
            return 'yarn';
        }

        return 'npm';
    }

    static hasYarnLockFile() {
        const paths = new Paths();

        return File.exists(paths.root('yarn.lock'));
    }
}

module.exports = PackageManager;
