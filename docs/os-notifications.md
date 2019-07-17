# System Notifications

By default, Laravel Mix will display a system notification for each compilation. That way, you can quickly see if you have any errors that need addressing. However, in certain circumstances, this is undesirable \(such as compiling on your production server\). If this happens to be the case, they can be disabled from your `webpack.mix.js` file.

```js
mix.js(src, output).disableNotifications();
```

Simple!

You can set the timeout for the notifications with the following:

```js
mix.setNotificationsTimeout(2);
```

This would set the notifications timeout to 2 seconds but you may have to use milliseconds based on your OS.