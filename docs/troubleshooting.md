# Troubleshooting

### I'm having trouble updating/installing Mix.

Unfortunately, there are countless reasons why your dependencies may not be installing properly. A common root relates to an ancient version of Node (`node -v`) and npm (`npm -v`) installed. As a first step, visit http://nodejs.org and update those.

Otherwise, often, it's related to a faulty lock file that needs to be deleted. Give this series of commands a try to install everything from scratch:

```bash
rm -rf node_modules
rm package-lock.json yarn.lock
npm cache clear --force
npm install
```

### Why can't webpack find my app.js entry file?

If you come across a failure message like this one...

```bash

These dependencies were not found:

* /Users/you/Sites/folder/resources/assets/js/app.js
```

...then you're likely using npm 5.2 (`npm -v`). This version introduced a bug that caused installation errors for Mix. The issue has been fixed as of npm 5.3. Please upgrade, and then reinstall your `package.json` dependencies from scratch:

```bash
rm -rf node_modules
rm package-lock.json yarn.lock
npm cache clear --force
npm install
```
