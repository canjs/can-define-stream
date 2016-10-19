var QUnit = require('steal-qunit');
var DefineMap = require('can-define/map/map');
var DefineList = require('can-define/list/list');
require('can-define-stream');

QUnit.module('can-define-stream');

test('Create a stream on a property', function() {

	var MyMap = DefineMap.extend({
		foo: 'string'
	});

	var map = new MyMap();


	var stream = map.stream('foo');

	stream.onValue(function(ev){
		QUnit.equal(expected, map.foo);
	});

	expected = "obaid";
	map.foo = "obaid";

});


test('Create a stream on property that changes on change events', function() {
	var expected = 0;
	var MyMap = DefineMap.extend({
		fooList: {
			Type: DefineList.List,
			value: []
		}
	});

	var map = new MyMap();


	map.stream('fooList', 'length').onValue(function(ev){
		QUnit.equal(expected, map.fooList.length);
	});

	expected = 1;
	map.fooList.push(1);

	expected = 0;
	map.fooList.pop();

});

test('Create a stream on nested property', function() {
	var expected = 1;
	var MyMap = DefineMap.extend({
		foo: {
			value: {
				bar: {
					value: 1
				}
			}
		}
	});

	var map = new MyMap();


	map.stream('foo', 'bar').onValue(function(ev){
		QUnit.equal(map.foo.bar, expected);
	});

	expected = 2;
	map.foo.bar = 2;

});
