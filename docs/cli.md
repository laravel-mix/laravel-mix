# The Laravel Mix CLI

In Laravel Mix v6 you'll find a new CLI that simplifies working with mix. Now building with mix can be as simple as `npx mix` and watching `npx mix watch`. This new CLI gives mix current and future flexibility to keep your scripts working.

The new CLI also offers a better experience and simplified output when building assets. Now after a finished build you'll get information on the built assets and their sizes.

## Building (in Development)

To build assets for development you can run `npx mix` and Mix will read your mix config file, build, and bundle your assets.

## Watching assets for changes

Typically during development you want to make changes repeatedly and then update your files. However running `npx mix` over-and-over again would be time consuming and not as efficient if we did it for you when you changed your assets. This is precisely what the watch command does! When you update a file mix will automatically recompile that file and rebuild your bundle. You can run the watch command using `npx mix watch`.

### Polling

In certain situations webpack cannot automatically pick up changes (like when on an NFS volume inside virtualbox). If this is a problem you can pass the `--watch-options-poll` option directly to webpack-cli to turn on polling to work around this. To do so you run the mix CLI like so: `npx mix watch -- --watch-options-poll=1000`

### Hot Module Replacement

Webpack offers something called hot module replacement. This gives supporting modules the ability to "live update" in certain situations . In fact this is what powers Vue's live updates when developing. If you want to watch your assets and have modules (like Vue components) automatically reflect your changes without a page load you can pass the `--hot` flag when watching like so: `npx mix watch --hot`

## Building for production

When it comes time to build assets for production Mix will set the appropriate webpack options, minify your source code, and optionally version your assets based on your mix configuration file. To build assets for production you pass the `-p` flag to the Mix CLI and it'll take care of the rest.

`npx mix -p`

## Customizing the location of `webpack.mix.js`

You can customise the location of your `webpack.mix.js` file by using the `--mix-config` option. For example if you wanted to load your `webpack.mix.js` file from separte `build` directory you could write that like so: `npx mix --mix-config=build/webpack.mix.js -p`

## Passing arbitrary options to webpack

You can end a call to mix with `--` and anything after that will be passed directly to webpack-cli. For example you can pass environment variables using webpack-cli's `--env` option, for example: `npx mix -- --env foo=bar`
