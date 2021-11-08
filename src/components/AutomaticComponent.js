const { Component } = require('./Component');

/**
 * @deprecated Instead extend `Component` and set `passive` to `true`
 **/
module.exports = class AutomaticComponent extends Component {
    passive = true;
};
