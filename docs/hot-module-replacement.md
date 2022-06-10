# Hot Module Replacement

-   [Basic Usage in Laravel](#basic-usage-in-laravel.md)
-   [My Browser Cannot Connect To The HMR Server](#my-browser-cannot-connect-to-the-hmr-server.md)

Where available, Laravel Mix provides seamless support for hot module replacement.

> Hot Module Replacement \(or Hot Reloading\) allows you to, not just refresh the page when a piece of JavaScript is changed, but also maintain the current state of the component in the browser.

Consider a simple counter component. When you press a button, the count goes up. Imagine that you click this button a number of times, and then update the component file. Normally,
you'd need to refresh the page to reflect the changes. As such, the count would of course default back to its original state: 0. With hot reloading enabled, however, the webpage will refresh to
reflect your change without requiring a page refresh. The current count will remain unchanged. This is the beauty of hot reloading!

### Basic Usage in Laravel

Laravel and Mix work together to tuck away the necessary complexity required to get hot reloading up and running.

From the command line, run `npx mix watch --hot` to boot up a Node server and monitor your bundle for changes. Next, load your Laravel app in the browser, as you normally would: perhaps `http://my-app.test`.

The key to making hot reloading work within a Laravel application is ensuring that all script sources reference the Node server URL that we just booted up. This will be [http://localhost:8080](http://localhost:8080). Now you could of course manually update your HTML/Blade files, like so:

```html
<body>
    <div id="app">...</div>
    <script src="http://localhost:8080/js/bundle.js"></script>
</body>
```

This would indeed work. Give it a try. Assuming you have some demo components to work with, try changing the state in the browser and then modifying the component's template. You should see your browser instantly refresh to reflect the change, without losing your state.

However, it can be a burden - and risk - to manually change this URL back and forth for production deploys. To solve this, Laravel's `mix()` function will build up your script or stylesheet imports dynamically, and echo them out. Change the code snippet above to:

```html
<body>
    <div id="app"></div>

    <script src="{{ mix('js/bundle.js') }}"></script>
</body>
```

With this adjustment, Laravel will do the work for you. If you run `npx mix watch --hot` to enable hot reloading, the function will prepend the necessary `http://localhost:8080` base url. If, instead, you run `npx mix` or `npx mix watch`, it'll reference your domain as the base.

### My Browser Cannot Connect To The HMR Server

Sometimes, when you are using the default port `8080` for the Node server, the Node server might be unresponsive and cannot serve the bundle files. You might see the error `net::ERR_EMPTY_RESPONSE` in your browser's console when trying to access the resources via port `8080`.

![Screenshot of the browser console reporting error net::ERR_EMPTY_RESPONSE when fetching the bundle files from the Node server](https://camo.githubusercontent.com/f34799c55c825e9762e4b62b383c3e2a88f75838d5cc3f4779d72c1859d8816a/68747470733a2f2f696d6775722e636f6d2f485068627976312e706e67)

In addition, Laravel Mix might not report the error, `failure to bind to port 8080`, in the CLI.

A potential solution is to manually provide the port. You can do this by appending this code below in your `webpack.mix.js`. 

```js
mix.options({
    hmrOptions: {
        host: 'localhost',
        port: 4206
    }
});
```

However, if the Node server is still unresponsive, try editing the port in the configuration and try again.

Keep in mind that this solution to an unresponsive Node server will only work for **some people, not everyone**.
