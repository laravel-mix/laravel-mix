import './node-browser-polyfills';
import { setupVueApp } from './app-vue';
import { setupReactApp } from './app-react';

console.log('loaded: app.js');

setupVueApp();
setupReactApp();
