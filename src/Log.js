class Log {
    /**
     * Log basic info to the console.
     *
     * @param  {String} message
     * @param  {String} color
     */
    static info(message, color = 'default') {
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
