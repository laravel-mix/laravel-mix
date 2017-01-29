import test from 'ava';
import Collection from '../src/Collection';

let collection;

test.before(t => {
    collection = new Collection();
});

test('that it can be instantiated with item', t => {
    let collection = new Collection({ foo: 'bar' });

    t.deepEqual({ foo: "bar" }, collection.get());
});


test('that it can add items to the collection', t => {
    collection.add('foo', ['bar']);
    t.deepEqual({ foo: ["bar"] }, collection.get());

    collection.add('foo', 'baz');
    t.deepEqual({ foo: ["bar", "baz"] }, collection.get());
});


test('that a collection can be emptied', t => {
    collection.add('foo', ['bar']);

    collection.empty();

    t.deepEqual({}, collection.get());
});
