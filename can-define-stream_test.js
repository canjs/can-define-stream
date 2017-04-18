var QUnit = require('steal-qunit');
var DefineMap = require('can-define/map/map');
var DefineList = require('can-define/list/list');
var defineStream = require('can-define-stream');
var compute = require('can-compute');
var canStream = require('can-stream');

QUnit.module('can-define-stream');


test('Stream behavior on multiple properties with merge', function() {

	var expectedNewVal,
		expectedOldVal,
		caseName;


	var MyMap = DefineMap.extend('MyMap', {
		foo: 'string',
		bar: { type: 'string', value: 'bar' },
		baz: {
			type: 'string',
			stream: function( stream ) {
				var fooStream = this.stream('.foo');
				var barStream = this.stream('.bar');

				var c1 = this.toCompute(fooStream);
				var c2 = this.toCompute(barStream);
				var mergedCompute = compute();

				var changeHandler = function(ev, val) {
					mergedCompute(val);
				};
				c1.on('change', changeHandler);
				c2.on('change', changeHandler);

				return this.toStream(mergedCompute);
			}
		}
	});

	var canStreamInterface = {
		toStream: function(c) {
			return {
				onValue: function(callback) {
					c.on('change', function() {
						callback.apply(null, Array.from(arguments));
					});
					callback(null, c());
				}
			};
		},
		toCompute: function(makeStream, context) {
			var emitter,
				lastValue,
				streamHandler,
				lastSetValue;

			var setterStream = this.toStream(compute(function (e) {
				emitter = e;
				if(lastSetValue !== undefined) {
					emitter.emit(lastSetValue);
				}
			}));

			if(typeof makeStream !== 'function') {
				var _makeStream = makeStream;
				makeStream = function() {
					return _makeStream;
				};
			}
			var valueStream = makeStream.call(context, setterStream);

			// Create a compute that will bind to the resolved stream when bound
			return compute(undefined, {

				// When the compute is read, use that last value
				get: function () {
					return lastValue;
				},
				set: function (val) {
					lastSetValue = val;
					return val;
				},

				on: function (updated) {
					streamHandler = function (ev, newVal, oldVal) {
						lastValue = newVal;
						updated(lastValue);
					};
					valueStream.onValue(streamHandler);
				},

				off: function () {
					valueStream.offValue(streamHandler);
				}
			});
		}
	};

	var canStreaming = canStream(canStreamInterface);
	defineStream(canStreaming)(MyMap);

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
			stream: function( stream ) {
				var fooStream = this.stream('.foo');
				var barStream = this.stream('.bar');

				var c1 = this.toCompute(fooStream);
				var c2 = this.toCompute(barStream);
				var mergedCompute = compute();

				var changeHandler = function(ev, val) {
					mergedCompute(val);
				};
				c1.on('change', changeHandler);
				c2.on('change', changeHandler);

				return this.toStream(mergedCompute);
			}
		}
	});

	var canStreamInterface = {
		toStream: function(c) {
			return {
				onValue: function(callback) {
					c.on('change', function() {
						callback.apply(null, Array.from(arguments));
					});
				},
				offValue: function() {
					c.off();
				}
			};
		},
		toCompute: function(makeStream, context) {
			var emitter,
				lastValue,
				streamHandler,
				lastSetValue;

			var setterStream = this.toStream(compute(function (e) {
				emitter = e;
				if(lastSetValue !== undefined) {
					emitter.emit(lastSetValue);
				}
			}));

			if(typeof makeStream !== 'function') {
				var _makeStream = makeStream;
				makeStream = function() {
					return _makeStream;
				};
			}
			var valueStream = makeStream.call(context, setterStream);


			// Create a compute that will bind to the resolved stream when bound
			return compute(undefined, {

				// When the compute is read, use that last value
				get: function () {
					return lastValue;
				},
				set: function (val) {
					if(emitter) {
						emitter.emit(val);
					} else {
						lastSetValue = val;
					}
					return val;
				},

				on: function (updated) {
					streamHandler = function (val) {
						lastValue = val;
						updated();
					};
					valueStream.onValue(streamHandler);
				},

				off: function () {
					valueStream.offValue();
				}
			});
		}
	};
	var canStreaming = canStream(canStreamInterface);
	defineStream(canStreaming)(MyMap);

	var map = new MyMap();

	QUnit.equal(map.__bindEvents._lifecycleBindings, undefined, 'Should have no bindings');


	map.on("baz", function(ev, newVal, oldVal){});

	QUnit.equal(map.__bindEvents._lifecycleBindings, 3, 'Should have 3 bindings');


	map.off('baz');

	QUnit.equal(map.__bindEvents._lifecycleBindings, 2, 'Should reset the bindings');
});





test('Stream on DefineList', function() {
	var expectedLength;

	var PeopleList = DefineList.extend({});

	var canStreamInterface = {
		toStream: function(c) {
			return {
				onValue: function(callback) {
					c.on('change', function() {
						callback.apply(null, Array.from(arguments));
					});
				}
			};
		},
		toCompute: function(makeStream, context) {}
	};
	var canStreaming = canStream(canStreamInterface);
	defineStream(canStreaming)(PeopleList);

	var people = new PeopleList([
	  { first: "Justin", last: "Meyer" },
	  { first: "Paula", last: "Strozak" }
	]);

	var stream = people.stream('length');

	expectedLength = 2;
	stream.onValue(function(ev, val) {
		QUnit.equal(val, expectedLength, 'List size changed');
	});

	expectedLength = 3;
	people.push({
		first: 'Obaid',
		last: 'Ahmed'
	});

	expectedLength = 2;
	people.pop();
});
