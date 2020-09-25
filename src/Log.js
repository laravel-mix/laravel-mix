class Log {
    /**
     * Determine if we are in test mode.
     */
    static testing = false;

    /**
     * All logged messages.
     *
     * @var {Array}
     */
    static fakedLogs = [];

    /**
     * Log basic info to the console.
     *
     * @param  {String} message
     * @param  {String} color
     */

    static info(message, color = 'default') {
        if (Log.testing) {
            Log.fakedLogs.push(message);

            return;
        }

        console.log(Log.colors()[color], message);

        Log.reset();
    }

    /**
     * Log feedback info to the console.
     *
     * @param  {String} message
     * @param  {String} color
     */
    static feedback(message, color = 'green') {
        Log.line('\t' + message, color);
    }

    /**
     * Log error info to the console.
     *
     * @param  {String} message
     * @param  {String} color
     */
    static error(message, color = 'red') {
        Log.line(message, color);
    }

    /**
     * Log a new line of info to the console.
     *
     * @param  {String} message
     * @param  {String} color
     */
    static line(message, color = 'default') {
        Log.info(message, color);
    }

    /**
     * Reset the default color for future console.logs.
     *
     * @param  {String} message
     * @param  {String} color
     */
    static reset() {
        console.log(Log.colors()['default'], '');
    }

    /**
     * Enter testing mode.
     */
    static fake() {
        Log.testing = true;
    }

    /**
     * Exit testing mode.
     */
    static restore() {
        Log.testing = false;
        Log.fakedLogs = [];
    }

    /**
     * Determine if the given message was logged.
     *
     * @param  {String} message
     */
    static received(message) {
        let result = Log.fakedLogs.some(log => log.includes(message));

        Log.restore();

        return result;
    }

    /**
     * The colors lookup table.
     */
    static colors() {
        return {
            default: '\x1b[0m',
            green: '\x1b[32m',
            red: '\x1b[31m'
        };
    }
}

module.exports = Log;
