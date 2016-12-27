# How is Laravel Mix different from Laravel Elixir?

You may be aware that a tool called Laravel Elixir has existed for some time now \(also built by us\). Laravel Mix is the evolution of that tool. Though its entry point API is almost identical, there are a handful of key differences to be aware of, if you're switching over.

#### 1. Laravel Mix is built on top of Webpack, not Gulp.

The most significant change is our switch over to Webpack as a base, rather than Gulp. This allows for, not just more power and flexibility, but also a simpler and more configurable \(should you need it\) codebase. Please note that all Laravel Elixir plugins assume and use Gulp. Because Laravel Mix uses Webpack and not Gulp, all Laravel Elixir plugins wouldn't work with it. That is why we changed the name, to avoid confusion. On the other hand, Laravel Mix will have no need for plugins, since you may freely edit your `webpack.config.js` file.

#### 2. Your gulpfile.js will now be webpack.mix.js

Because Laravel Mix is built upon Webpack, you won't find any `gulpfile.js`, when installing Laravel. Instead, you'll see two new files:

- `webpack.config.js` - This is the standard Webpack config file that we've populated and included for you. Only advanced users will need/wish to edit this.
- `webpack.mix.js` - This will be the equivalent of your old `gulpfile.js`. In fact, you'll find that the API is almost identical.

#### 3. Webpack isn't a general task runner, like Gulp.

Gulp is excellent for general purpose tasks. Move this file here, and then minify a script, and then compile my JavaScript, and then version this particular file. Instead, Webpack assumes a JavaScript entry, at which point you may opt-in to various compilation steps or plugins. This is an important distinction to make.

That being said, we've introduced a number of options that will allow you to continue, for example, combining various files, or minifying a stylesheet that isn't related to your Webpack build. This means, `mix.copy(`\), `mix.combine()`, and `mix.minify()` are still available.

Example: With Laravel Elixir, you might have called `mix.version('./public/some/random/file.js')`, and this would have applied a hash to the file. With Laravel Mix, you'll simply run `mix.version()`, and the tool will automatically version all relevant files for the Webpack build.

#### 4. Greater flexibility.

Because we're now using Webpack, we're able to introduce a number of new configuration options, such as `mix.extract(['vendor', 'libs'])`, which allows you to extract all specified vendor libraries into their own bundled file for better long-term caching.

