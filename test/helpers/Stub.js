import File from '../../src/File';

export default class Stub {
    constructor(name, contents, basePath = 'test/fixtures/app') {
        this.basePath = basePath;

        return this.create(name, contents);
    }

    create(name, contents) {
        this.name = name;

        this.file = new File(`${this.basePath}/src/${name}`).write(contents);

        return this;
    }

    relativePath() {
        return this.file.relativePath();
    }

    hasCompiledContent(expected) {
        let matches =
            this.minify(expected) ===
            this.minify(File.find(`${this.basePath}/dist/${this.name}`).read());

        this.delete();

        return matches;
    }

    minify(text) {
        return text.replace(/(\r|\n|\r\n)/g, '').replace(/\s{2}/g, '');
    }

    delete() {
        this.file.delete();
    }
}
