# OS Notifications

By default, Laravel Mix is configured to display a system notification for each compilation. This allows you to quickly determine if you have any errors that need addressing.
However, if you find this annoying or not appropriate for your needs, they can of course be disabled, like so:

```js
mix.disableNotifications();
```

Goodbye notifications.

As a slight tweak, you can instead disable success messages exclusively.

```js
mix.disableSuccessNotifications();
```
