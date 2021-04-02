import File from '../../src/File.js';

export default class Stub {
    /**
     *
     * @param {string} name
     * @param {string} contents
     * @param {string} basePath
     * @returns
     */
    constructor(name, contents, basePath = 'test/fixtures/app') {
        this.name = name;
        this.basePath = basePath;
        this.file = new File(`${this.basePath}/src/${name}`).write(contents);
    }

    relativePath() {
        return this.file.relativePath();
    }

    /**
     *
     * @param {string} expected
     * @returns {boolean}
     */
    hasCompiledContent(expected) {
        let matches =
            this.minify(expected) ===
            this.minify(File.find(`${this.basePath}/dist/${this.name}`).read());

        this.delete();

        return matches;
    }

    /**
     *
     * @param {string} text
     * @returns
     */
    minify(text) {
        return text.replace(/(\r|\n|\r\n)/g, '').replace(/\s{2}/g, '');
    }

    delete() {
        this.file.delete();
    }
}
