import { createElement } from 'react';
import ReactDOM from 'react-dom';

import { componentCssImportReact } from './component-with-css-module.jsx';

const domContainer = document.querySelector('#react-app');
ReactDOM.render(createElement(componentCssImportReact), domContainer);
