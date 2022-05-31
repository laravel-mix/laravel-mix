let os = require('os');
let md5 = require('md5');
let path = require('path');
let fs = require('fs-extra');
let Terser = require('terser');
let UglifyCss = require('clean-css');
const { escapeRegExp } = require('lodash');

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
     * Determine if the given file exists.
     */
    exists() {
        return fs.existsSync(this.path());
    }

    normalizedOutputPath() {
        let path = this.pathFromPublic(this.mix.config.publicPath);

        path = File.stripPublicDir(path);

        return path
            .replace(/\.(js|css)$/, '')
            .replace(/\\/g, '/')
            .replace(/^\//, '');
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
        return path.relative(this.mix.paths.root(), this.path());
    }

    /**
     * Get the relative path to the file, from the project root.
     */
    relativePathWithoutExtension() {
        return path.relative(this.mix.paths.root(), this.pathWithoutExtension());
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
     * @param {string|null} [publicPath]
     */
    forceFromPublic(publicPath = null) {
        publicPath = publicPath || this.mix.config.publicPath;

        if (!this.relativePath().startsWith(publicPath)) {
            return new File(path.join(publicPath, this.relativePath()));
        }

        return this;
    }

    /**
     *
     * @param {string} filePath
     * @param {string|null} publicPath
     */
    static stripPublicDir(filePath, publicPath = null) {
        let publicDir = path.basename(publicPath || this.mix.config.publicPath);

        publicDir = escapeRegExp(publicDir);

        return filePath.replace(new RegExp(`^[/\\\\]?${publicDir}[/\\\\]`), '');
    }

    /**
     * Get the path to the file, starting at the project's public dir.
     *
     * @param {string|null} [publicPath]
     */
    pathFromPublic(publicPath) {
        publicPath = publicPath || this.mix.config.publicPath;

        let extra = this.filePath.startsWith(publicPath) ? publicPath : '';

        // If the path starts with the public folder remove it
        if (
            this.filePath.startsWith(
                path.normalize(`${publicPath}/${path.basename(publicPath)}`)
            )
        ) {
            extra += `/${path.basename(publicPath)}`;
        }

        return path.normalize(
            '/' + path.relative(this.mix.paths.root(extra), this.path())
        );
    }

    /**
     * Get the path to the file without query string.
     */
    pathWithoutQueryString() {
        const queryStringIndex = this.path().indexOf('?');

        return queryStringIndex < 0
            ? this.path()
            : this.path().substr(0, queryStringIndex);
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
        return fs.readFileSync(this.pathWithoutQueryString(), 'utf8');
    }

    /**
     * Calculate the proper version hash for the file.
     */
    version() {
        return md5(this.read());
    }

    /**
     * Create all nested directories.
     */
    makeDirectories() {
        fs.mkdirSync(this.base(), { mode: 0o777, recursive: true });

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
     * Copy the current file to a new location.
     *
     * @param {string} destination
     * @internal
     */
    async copyToAsync(destination) {
        await fs.copy(this.path(), destination, {
            recursive: true,
        });
    }

    /**
     * Minify the file, if it is CSS or JS.
     */
    async minify() {
        if (this.extension() === '.js') {
            const output = await Terser.minify(
                this.read(),
                this.mix.config.terser.terserOptions
            );

            if (output.code !== undefined) {
                this.write(output.code);
            }
        }

        if (this.extension() === '.css') {
            const output = await new UglifyCss(this.mix.config.cleanCss).minify(
                this.read()
            );

            this.write(output.styles);
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

        let isDir = this.checkIsDir(parsed);

        return {
            path: this.filePath,
            absolutePath: this.absolutePath,
            pathWithoutExt: path.join(parsed.dir, `${parsed.name}`),
            isDir,
            isFile: !isDir,
            name: parsed.name,
            ext: parsed.ext,
            file: parsed.base,
            base: parsed.dir
        };
    }

    /**
     * This is a bit more involved check to verify if a file is a directory
     *
     * @param {path.ParsedPath} parsed
     * @private
     */
    checkIsDir(parsed) {
        // 1. If the file exists and is a directory
        try {
            return fs.lstatSync(this.absolutePath).isDirectory();
        } catch (err) {
            //
        }

        // 2. If the path ends in a slash
        if (this.absolutePath.endsWith('/')) {
            return true;
        }

        // 3. Pevious logic: No extension & does not end in a wildcard
        return !parsed.ext && !parsed.name.endsWith('*');
    }

    /**
     * @returns {Promise<File[]>}
     */
    async listContentsAsync() {
        const contents = await fs.promises.readdir(this.path(), {
            withFileTypes: true,
        });

        const files = await Promise.all(contents.map(async (entry) => {
            let file = new File(`${this.path()}/${entry.name}`)

            return entry.isDirectory()
                ? file.listContentsAsync()
                : [file]
        }))

        return files.flat();
    }

    // TODO: Can we refactor this to remove the need for implicit global? Or does this one make sense to leave as is?
    get mix() {
        // TODO: Use warning-less version here
        return global.Mix;
    }

    static get mix() {
        // TODO: Use warning-less version here
        return global.Mix;
    }
}

module.exports = File;
