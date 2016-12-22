# Hot Module Replacement

Where available, Laravel Mix provides seamless support for hot module replacement.

> Hot Module Replacement \(or Hot Reloading\) allows you to, not just refresh the page when a piece of JavaScript is changed, but it will also maintain the current state of the component in the browser. As an example, consider a simple counter component. When you press a button, the count goes up. Imagine that you click this button a number of times, and then update the component file. Once you do, the webpage will refresh to reflect your change, but the count will remain the same. It won't reset. This is the beauty of hot reloading!

### Usage in Laravel

Both Laravel and Laravel Mix work together to abstract away the complexities in getting hot reloading to work. Have a look at your Laravel install's included `package.json` file. Within the `scripts` object, you'll see:

```js
"scripts": {
  "webpack": "webpack --progress --hide-modules",
  "dev": "webpack --watch --progress --hide-modules",
  "hmr": "webpack-dev-server --inline --hot",
  "production": "export NODE_ENV=production && webpack --progress --hide-modules"
},
```

Take note of the `hmr` option; this is the one you want. From the command line, run `npm run hmr` to boot up a Node server and monitor your bundle for changes. Next, load your Laravel app in the browser, as you normally would. Perhaps, `http://my-app.dev`.

The key to making hot reloading work within a Laravel application is ensuring that all script sources reference the Node server URL that we just booted up. This will be [http://localhost:8080](http://localhost:8080). Now you could of course manually update your HTML/Blade files, like so:

```html
<body>
    <div id="app">...</div>
    <script src="http://localhost:8080/js/bundle.js"></script>
</body>
```

And this would work. Give it a try. Assuming you have some demo components to work with, try changing the state in the browser, and then modifying the component's template. You should see your browser instantly refresh to reflect the change, without losing your state.

However, it can be a burden to manually change this URL for production deploys. As such, Laravel offers a useful `mix()` function, which will build up your script or stylesheet imports dynamically, and echo them out. As such, the code snippet above may be changed to:

```html
<body>
    <div id="app"></div>
    {!! mix('js/bundle.js') !!}
</body>
```

With this adjustment, Laravel will do the work for you. If you run nom run her to enable hot reloading, the function will set the necessary `http://localhost:8080` base url. If, instead, you use `npm run dev` or `npm run production`, it'll use your domain as the base.



### Usage in SPAs

Laravel Mix includes the popular `vue-loader` package, which means, for SPAs, there's nothing for you to do. It'll all work seamlessly out of the box!

