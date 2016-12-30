import test from 'ava';
import mix from '../src/index';
import path from 'path';

test.afterEach('cleanup', t => {
    mix.reset();
});


test('that it determines the JS paths', t => {
	mix.js('js/stub.js', 'dist')
	   .js('js/another.js', 'dist');

	let js = mix.config.js;
	let root = path.resolve(__dirname, '../');

	t.is(path.resolve(root, 'js/stub.js'), js[0].entry[0].path);
	t.is(path.resolve(root, 'js/another.js'), js[1].entry[0].path);
	t.is('dist/stub.js', js[0].output.path);
	t.falsy(js[0].vendor);

	// We can also pass an array of entry scripts, to be bundled together.
	 mix.reset();

	 mix.js(['js/stub.js', 'js/another.js'], 'dist/bundle.js');
	 t.is('dist/bundle.js', mix.config.js[0].output.path);
	 t.is(2, mix.config.js[0].entry.length);
});


test('that it determines the CSS output path correctly.', t => {
	mix.setPublicPath('./public')
	   .js('js/stub.js', 'dist')
	   .sass('sass/stub.scss', 'dist');

	t.is('dist/stub.css', mix.config.cssOutput());
});


test('that it calculates the output correctly', t => {
	mix.js('js/stub.js', 'dist').sass('sass/stub.scss', 'dist');

	t.deepEqual({
		path: './public',
		filename: 'dist/stub.js',
		publicPath: './'
	}, mix.config.output());


	// Enabling Hot Reloading should change this output.
	mix.config.hmr = true;

	t.deepEqual({
		path: '/',
		filename: 'dist/stub.js',
		publicPath: 'http://localhost:8080/'
	}, mix.config.output());


	// Extracting vendor libraries should change this output.
	mix.config.hmr = false;
	mix.extract(['some-lib']);

	t.deepEqual({
		path: './public',
		filename: 'dist/[name].js',
		publicPath: './'
	}, mix.config.output());


	// Enabling file versioning shoul dchange this output.
	mix.version();

	t.deepEqual({
		path: './public',
		filename: 'dist/[name].[hash].js',
		publicPath: './'
	}, mix.config.output());
});


test('that it calculates the project root', t => {
	// The project root should be three dirs up from where
	// laravel-mix is installed.
	let root = require('path').resolve(__dirname, '../../../');

	t.is(root, mix.config.root());
});


test('that it calculates the webpack.mix path', t => {
	t.is(mix.config.root('webpack.mix'), mix.config.configPath());
});


test('that it knows if it is running within a Laravel project', t => {
	t.falsy(mix.config.isUsingLaravel());

	// If an ./artisan file exists in the root, it's a Laravel app.
	let artisan = new mix.config.File('./artisan').write('I am Laravel');

	t.truthy(mix.config.isUsingLaravel());

	artisan.delete();
});
