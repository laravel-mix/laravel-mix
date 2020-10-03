# Hot Module Replacement

-   [Basic Usage in Laravel](#basic-usage-in-laravel.md)

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
