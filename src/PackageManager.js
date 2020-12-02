class PackageManager {
    static detect() {
        const execPath = process.env.npm_execpath || '';

        if (execPath.endsWith('bin/yarn.js')) {
            return 'yarn';
        }

        return 'npm';
    }
}

module.exports = PackageManager;
