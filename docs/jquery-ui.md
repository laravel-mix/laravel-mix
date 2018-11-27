# jQuery UI

jQuery UI is a toolkit for rendering common components, such as datepickers, draggables, etc. No adjustments are needed to make it work with Laravel Mix.

## Build Your `webpack.mix.js` Configuration

```js
mix.js('resources/assets/js/app.js', 'public/js').sass(
    'resources/assets/sass/app.scss',
    'public/css'
);
```

## Install `jquery-ui`

```
npm install jquery-ui --save-dev
```

## Load Your Desired Widget

```js
// resources/assets/js/app.js

import $ from 'jquery';
window.$ = window.jQuery = $;

import 'jquery-ui/ui/widgets/datepicker.js';
```

## Load CSS

```css
// resources/assets/sass/app.scss

@import '~jquery-ui/themes/base/all.css';
```

## Trigger the UI Plugin

```js
// resources/assets/js/app.js
$('#datepicker').datepicker();
```
