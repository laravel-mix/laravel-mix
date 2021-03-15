import('./dynamic-module').then(module => module.default.init());
import(/* webpackChunkName: 'named' */ './dynamic-module-named').then(module =>
    module.default.init()
);
import(/* webpackChunkName: '/js/absolute' */ './dynamic-module-absolute').then(module =>
    module.default.init()
);
