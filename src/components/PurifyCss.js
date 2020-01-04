let AutomaticComponent = require('./AutomaticComponent');

class PurifyCss extends AutomaticComponent {
    /**
     * Required dependencies for the component.
     */
    dependencies() {
        if (Config.purifyCss) {
            throw new Error(
                'PurifyCSS support is no longer available. We recommend using PurgeCss + postCss instead.'
            );
        }
    }
}

module.exports = PurifyCss;
