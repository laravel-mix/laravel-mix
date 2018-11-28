let os = require('os');
let md5 = require('md5');
let path = require('path');
let fs = require('fs-extra');
let Terser = require('terser');
let UglifyCss = require('clean-css');

class File {
    /**
     * Create a new instance.
     *
     * @param {string} filePath
     */
    constructor(filePath) {
        this.absolutePath = path.resolve(filePath);
        this.filePath = this.relativePath();
        this.segments = this.parse();
    }

    /**
     * Static constructor.
     *
     * @param {string} file
     */
    static find(file) {
        return new File(file);
    }

    /**
     * Get the size of the file.
     */
    size() {
        return fs.statSync(this.path()).size;
    }

    /**
     * Determine if the given file exists.
     *
     * @param {string} file
     */
    static exists(file) {
        return fs.existsSync(file);
    }

    /**
     * Delete/Unlink the current file.
     */
    delete() {
        if (fs.existsSync(this.path())) {
            fs.unlinkSync(this.path());
        }
    }

    /**
     * Get the name of the file.
     */
    name() {
        return this.segments.file;
    }

    /**
     * Get the name of the file, minus the extension.
     */
    nameWithoutExtension() {
        return this.segments.name;
    }

    /**
     * Get the extension of the file.
     */
    extension() {
        return this.segments.ext;
    }

    /**
     * Get the absolute path to the file.
     */
    path() {
        return this.absolutePath;
    }

    /**
     * Get the relative path to the file, from the project root.
     */
    relativePath() {
        return path.relative(Mix.paths.root(), this.path());
    }

    /**
     * Get the absolute path to the file, minus the extension.
     */
    pathWithoutExtension() {
        return this.segments.pathWithoutExt;
    }

    /**
     * Force the file's relative path to begin from the public path.
     *
     * @param {string|null} publicPath
     */
    forceFromPublic(publicPath) {
        publicPath = publicPath || Config.publicPath;

        if (!this.relativePath().startsWith(publicPath)) {
            return new File(path.join(publicPath, this.relativePath()));
        }

        return this;
    }

    /**
     * Get the path to the file, starting at the project's public dir.
     *
     * @param {string|null} publicPath
     */
    pathFromPublic(publicPath) {
        publicPath = publicPath || Config.publicPath;

        let extra = this.filePath.startsWith(publicPath) ? publicPath : '';

        return this.path().replace(Mix.paths.root(extra), '');
    }

    /**
     * Get the base directory of the file.
     */
    base() {
        return this.segments.base;
    }

    /**
     * Determine if the file is a directory.
     */
    isDirectory() {
        return this.segments.isDir;
    }

    /**
     * Determine if the path is a file, and not a directory.
     */
    isFile() {
        return this.segments.isFile;
    }

    /**
     * Write the given contents to the file.
     *
     * @param {string} body
     */
    write(body) {
        if (typeof body === 'object') {
            body = JSON.stringify(body, null, 4);
        }

        body = body + os.EOL;

        fs.writeFileSync(this.absolutePath, body);

        return this;
    }

    /**
     * Read the file's contents.
     */
    read() {
        return fs.readFileSync(this.path(), 'utf8');
    }

    /**
     * Calculate the proper version hash for the file.
     */
    version() {
        return md5(this.read()).substr(0, 20);
    }

    /**
     * Create all nested directories.
     */
    makeDirectories() {
        fs.ensureDirSync(this.base());

        return this;
    }

    /**
     * Copy the current file to a new location.
     *
     * @param {string} destination
     */
    copyTo(destination) {
        fs.copySync(this.path(), destination);

        return this;
    }

    /**
     * Minify the file, if it is CSS or JS.
     */
    minify() {
        if (this.extension() === '.js') {
            this.write(
                Terser.minify(this.read(), Config.terser.terserOptions).code
            );
        }

        if (this.extension() === '.css') {
            this.write(
                new UglifyCss(Config.cleanCss).minify(this.read()).styles
            );
        }

        return this;
    }

    /**
     * Rename the file.
     *
     * @param {string} to
     */
    rename(to) {
        to = path.join(this.base(), to);

        fs.renameSync(this.path(), to);

        return new File(to);
    }

    /**
     * It can append to the current path.
     *
     * @param {string} append
     */
    append(append) {
        return new File(path.join(this.path(), append));
    }

    /**
     * Determine if the file path contains the given text.
     *
     * @param {string} text
     */
    contains(text) {
        return this.path().includes(text);
    }

    /**
     * Parse the file path.
     */
    parse() {
        let parsed = path.parse(this.absolutePath);

        return {
            path: this.filePath,
            absolutePath: this.absolutePath,
            pathWithoutExt: path.join(parsed.dir, `${parsed.name}`),
            isDir: !parsed.ext && !parsed.name.endsWith('*'),
            isFile: !!parsed.ext,
            name: parsed.name,
            ext: parsed.ext,
            file: parsed.base,
            base: parsed.dir
        };
    }
}

module.exports = File;
