# System Notifications

By default, Laravel Elixir will display a system notification for each compilation. That way, you can quickly see if you have any errors that need addressing. However, in certain circumstances, this is undesirable \(such as compiling on your production server\). If this happens to be the case, they can be disabled from your `webpack.elixir.js` file.



```js
mix.js(src, output)
   .disableNotifications();
```

Simple!

