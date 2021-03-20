import './node-browser-polyfills.js';
import { setupVueApp } from './app-vue.js';
import { setupReactApp } from './app-react.js';

console.log('loaded: app.js');

setupVueApp();
setupReactApp();
