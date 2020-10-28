# The Mix CLI

- [Compiling in a Local Environment](#compiling-in-a-local-environment)
    - [Watch Assets for Changes](#watch-assets-for-changes)
    - [Polling](#polling)
    - [Hot Module Replacement](#hot-module-replacement)
- [Compiling for Production](#compiling-for-production)
    - [Customize the Mix Configuration Path](#customize-the-mix-configuration-path)
- [Pass Options to Webpack-CLI](#pass-options-to-webpack-cli)
    

As part of Mix v6, you'll find a new CLI that simplifies your build scripts.

### Compiling in a Local Environment


To build assets for development, reach for the `npx mix` command. Mix will then read your `webpack.mix.js` configuration file, and compile your assets.

```
npx mix
```

#### Watch Assets for Changes

Particularly for larger projects, compilation can take a bit of time. For this reason, it's highly recommended that you instead leverage webpack's ability to watch your filesystem for changes. The `npx mix watch` command will handle this for you. Now, each time you update a file, Mix will automatically recompile the file and rebuild your bundle. 

```
npx mix watch
```

#### Polling

In certain situations, webpack may not automatically detect changes. An example of this is when you're on an NFS volume inside virtualbox. If this is a problem, pass the `--watch-options-poll` option directly to webpack-cli to turn on manual polling. 
 
 ```
 npx mix watch -- --watch-options-poll=1000
```

Of course, you can add this to a build script within your `package.json` file.

#### Hot Module Replacement

Hot module replacement is a webpack featured that gives supporting modules the ability to "live update" in certain situations. A live-update is when your application refreshes without requiring a page reload. In fact, this is what powers Vue's live updates when developing. To turn this feature on, include the `--hot` flag. 

```
npx mix watch --hot
```

### Compiling for Production

When it comes time to build your assets for a production environment, Mix will set the appropriate webpack options, minify your source code, and optionally version your assets based on your Mix configuration file (`webpack.mix.js`). To build assets for production, include the `--production` flag - or the alias `-p` - to the Mix CLI. Mix will take care of the rest!

```
npx mix --production
```

#### Customize the Mix Configuration Path

You may customise the location of your `webpack.mix.js` file by using the `--mix-config` option. For example, if you wish to load your `webpack.mix.js` file from a nested `build` directory, here's how:
 
 ```
 npx mix --mix-config=build/webpack.mix.js --production
```

### Pass Options to Webpack-CLI

If you end any `mix` call with two dashes (`--`), anything after it will be passed through to webpack-cli. For example, you can pass environment variables using webpack-cli's `--env` option: 

```
npx mix -- --env foo=bar
```
