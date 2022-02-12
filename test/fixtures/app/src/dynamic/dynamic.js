import('./dynamic-module.js').then(module => module.default.init());
import(/* webpackChunkName: 'named' */ './dynamic-module-named.js').then(module =>
    module.default.init()
);
import(/* webpackChunkName: '/js/absolute' */ './dynamic-module-absolute.js').then(
    module => module.default.init()
);
