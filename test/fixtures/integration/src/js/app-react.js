import { createElement } from 'react';
import ReactDOM from 'react-dom';
import { ScssModuleReact } from './ScssModule.jsx';

export function setupReactApp() {
    const domContainer = document.querySelector('#react-app');
    ReactDOM.render(createElement(ScssModuleReact), domContainer);
}
