# What is Mix?

[Webpack](https://webpack.js.org/) is an incredibly powerful module bundler that prepares your JavaScript and assets for the browser. The only understandable downside is that it requires a bit of a learning curve.

In an effort to flatten that curve, Mix is a thin layer on top of webpack for the rest of us. It exposes a simple, fluent API for dynamically constructing your webpack configuration.

Mix targets the 80% use case. If, for example, you only care about compiling modern JavaScript and triggering a CSS preprocessor, Mix should be right up your alley. Don't worry about researching the necessary webpack loaders and plugins.
Instead, install Mix...

~~~bash
npm install laravel-mix --save-dev
~~~

...and define your build within a `webpack.mix.js` file in your project root.

~~~js
mix.js('src/app.js', 'dist')
   .sass('src/styles.scss', 'dist');
~~~

That's it! Mix will read this file and construct the necessary webpack configuration for the build.

The only remaining step is to compile your code and get to work.

~~~bash
npx mix
~~~

Of course, the Mix API offers far more than basic JavaScript and Sass compilation. Whether you require CSS autoprefixing, or Vue support, or sourcemaps, or vendor extraction, Mix has you covered.
Give the documentation here a browse, and you'll be ready to go in no time at all.
