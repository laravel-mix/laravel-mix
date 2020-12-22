class PackageManager {
    static detect() {
        const execPath = process.env.npm_execpath || '';

        if (execPath.endsWith('yarn.js')) {
            return 'yarn';
        }

        return 'npm';
    }
}

module.exports = PackageManager;
