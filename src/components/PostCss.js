let Verify = require('../Verify');
let Preprocessor = require('./Preprocessor');

class PostCss extends Preprocessor {
    constructor() {
        super();

        this.name = 'postCss';
    }

    register() {
        Verify.preprocessor('postCss', src, output);

        src = new File(src);

        output = this.normalizeOutput(
            new File(output),
            src.nameWithoutExtension() + '.css'
        );

        Config.preprocessors['postCss'] = (
            Config.preprocessors['postCss'] || []
        ).concat({
            src,
            output,
            postCssPlugins
        });

        return this;
    }
}

module.exports = PostCss;
