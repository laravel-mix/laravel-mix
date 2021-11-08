const { Component } = require('./Component');

module.exports = class PurifyCss extends Component {
    passive = true;

    /**
     * Required dependencies for the component.
     */
    dependencies() {
        if (this.context.config.purifyCss) {
            throw new Error(
                'PurifyCSS support is no longer available. We recommend using PurgeCss + postCss instead.'
            );
        }

        return [];
    }
};
