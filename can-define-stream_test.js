var QUnit = require('steal-qunit');
var DefineMap = require('can-define/map/map');
require('can-define-stream');

QUnit.module('can-define-stream');

test('Stream behavior on multiple properties with merge', function() {

	var expectedNewVal,
		expectedOldVal,
		caseName;

	var MyMap = DefineMap.extend({
		foo: 'string',
		bar: { type: 'string', value: 'bar' },
		baz: {
			type: 'string',
		    stream( stream ) {
				var fooStream = this.stream('.foo');
				var barStream = this.stream('.bar');
				return stream.merge(fooStream).merge(barStream);
		    }
		}
	});

	var map = new MyMap();

	map.foo = 'foo-1';

	QUnit.equal( map.baz, undefined, "read value before binding");

	map.on("baz", function(ev, newVal, oldVal){
		QUnit.equal(newVal, expectedNewVal, caseName+ " newVal");
		QUnit.equal(oldVal, expectedOldVal, caseName+ " oldVal");
	});

	QUnit.equal( map.baz, 'bar', "read value immediately after binding");

	caseName = "setting foo";
	expectedOldVal = 'bar';
	expectedNewVal = 'foo-2';
	map.foo = 'foo-2';

	caseName = "setting bar";
	expectedOldVal = expectedNewVal;
	expectedNewVal = 'new bar';
	map.bar = 'new bar';

	caseName = "setting baz setter";
	expectedOldVal = expectedNewVal;
	expectedNewVal = 'new baz';
	map.baz = 'new baz';
});

test('Test if streams are memory safe', function() {

	var MyMap = DefineMap.extend({
		foo: 'string',
		bar: { type: 'string', value: 'bar' },
		baz: {
			type: 'string',
		    stream( stream ) {
				var fooStream = this.stream('.foo');
				var barStream = this.stream('.bar');
				return stream.merge(fooStream).merge(barStream);
		    }
		}
	});

	var map = new MyMap();

	QUnit.equal(0, map._bindings, 'Should have no bindings');


	map.on("baz", function(ev, newVal, oldVal){});

	QUnit.equal(3, map._bindings, 'Should have 3 bindings');

	map.off('baz');

	QUnit.equal(0, map._bindings, 'Should reset the bindings');
});
