var QUnit = require('steal-qunit');
var computeStream = require('can-compute-stream');
var compute = require('can-compute');
var DefineMap = require('can-define/map/map');
var DefineList = require('can-define/list/list');
require('can-define-stream');

QUnit.module('can-define-stream');


test('Stream map values into others', function () {

	var allFooValue;
	var MyMap = DefineMap.extend({
		foo1: 'number',
		foo2: 'number',
		allFoo: {
			type: 'compute',
			value: function () {
				var foo1 = compute(this, 'foo1');
				var foo2 = compute(this, 'foo2');
				return computeStream.asCompute(foo1, foo2);
			}
		}
	});
	MyMap.List = DefineList.extend({
		"*": MyMap
	});

	var list = new MyMap.List([]);
	list.on('add', function(){
		console.log(this instanceof DefineList);
		console.log('added');
	});
	console.log(list);
	var map = new MyMap();
	list.push(map);
	console.log(list);

	map.on('allFoo', function (ev, newVal) {
		allFooValue = newVal;
	});

	map.foo1 = 1;
	QUnit.equal(allFooValue, 1);

	map.foo2 = 2;
	QUnit.equal(allFooValue, 2);

	map.foo1 = 3;
	QUnit.equal(allFooValue, 3);
});


test('Stream map values into others using sugar syntax', function () {
	var expected;
	var MyMap = DefineMap.extend({
		foo1: 'number',
		foo2: 'number',
		allFoo: {
			stream: ['foo1', 'foo2']
		}
	});

	var map = new MyMap();

	map.on('allFoo', function (ev, newVal) {
		expected = newVal;
	});

	map.foo1 = 1;
	QUnit.equal(expected, 1);

	map.foo2 = 2;
	QUnit.equal(expected, 2);

	map.foo1 = 3;
	QUnit.equal(expected, 3);
});

test('Stream into streams', function () {
	var expected = 1;
	var MyMap = DefineMap.extend({
		foo1: {
			value: 0
		},
		stream1: {
			stream: ['foo1']
		},
		stream2: {
			stream: ['stream1']
		}
	});

	var map = new MyMap();

	map.on('stream1', function (ev, newVal) {
		QUnit.equal(newVal, expected, 'Stream 1 updated');
	});

	map.on('stream2', function (ev, newVal) {
		QUnit.equal(newVal, expected, 'Stream 2 updated');
	});

	map.foo1 = expected;

	expected = 2;
	map.stream1 = expected;

	expected = 3;
	map.stream2 = expected;
});


test('Stream map values into others using sugar syntax with events', function () {
	var expected;
	var MyMap = DefineMap.extend({
		foo1: 'number',
		foo2: 'number',
		allFoo: {
			stream: ['foo1 change', 'foo2']
		}
	});

	var map = new MyMap();

	map.on('allFoo', function (ev, newVal) {
		expected = newVal;
	});

	map.foo1 = 1;
	QUnit.equal(expected, 1);

	map.foo2 = 2;
	QUnit.equal(expected, 2);

	map.foo1 = 3;
	QUnit.equal(expected, 3);
});
