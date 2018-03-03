let Verify = require('../Verify');
let Preprocessor = require('./Preprocessor');

class PostCss extends Preprocessor {
    name() {
        return 'postCss';
    }

    register(src, output, postCssPlugins = []) {
        Verify.preprocessor('postCss', src, output);

        src = new File(src);

        output = this.normalizeOutput(
            new File(output),
            src.nameWithoutExtension() + '.css'
        );

        this.details = (this.details || []).concat({
            type: 'postCss',
            src,
            output,
            postCssPlugins
        });
    }

    webpackConfig(config) {
        config.module.rules.find(
            rule => rule.test.toString() === '/\\.css$/'
        ).exclude = this.details.map(postCss => postCss.src.path());
    }
}

module.exports = PostCss;
