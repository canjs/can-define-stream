var QUnit = require('steal-qunit');
var DefineMap = require('can-define/map/map');
require('can-define-stream');

QUnit.module('can-define-stream');

test('Stream behaviour on single property', function() {

	var expected = '';

	var MyMap = DefineMap.extend({
		foo: 'string',
		bar: { type: 'string', value: 'bar' },
		baz: {
			type: 'string',
		    stream( stream ) {
				return stream;
		    },
		    get(lastSetValue) {
		      return `**${lastSetValue}**`;
		    }
		}
	});

	var map = new MyMap();

	map.baz.onValue(function(evnt){
		QUnit.equal(evnt.target[evnt.type], expected, evnt.type + " updated");
	});

	expected = '1';
	map.baz = '1';
	expected = '2';
	map.baz = '2';

});

test('Stream behavior on multiple properties with merge', function() {

	var expected = '';

	var MyMap = DefineMap.extend({
		foo: 'string',
		bar: { type: 'string', value: 'bar' },
		baz: {
			type: 'string',
		    stream( stream ) {
				var fooStream = this.stream('foo');
				var barStream = this.stream('bar');
				return stream.merge(fooStream).merge(barStream);
		    },
		    get(lastSetValue) {
		      return `**${lastSetValue}**`;
		    }
		}
	});

	var map = new MyMap();

	map.foo = 'foo-1';

	map.baz.onValue(function(evnt){
		QUnit.equal(evnt.target[evnt.type], expected, evnt.type + " updated");
	});

	expected = 'foo-2';
	map.foo = 'foo-2';
	expected = 'new bar';
	map.bar = 'new bar';

});
