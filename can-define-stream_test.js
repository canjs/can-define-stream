var QUnit = require('steal-qunit');
var DefineMap = require('can-define/map/map');
var DefineList = require('can-define/list/list');
var defineStream = require('can-define-stream');
var compute = require('can-compute');

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
	    stream( stream ) {
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
		toStream: function(observable, propOrEvent) {
			var lastVal = (typeof observable === 'function') ? observable() :   observable[propOrEvent.replace(".", "")];
			var obj;
			return obj = {
				onValue: function(callback) {
					observable.on('change', function(val) {
						callback(val);
					});
					callback(lastVal);
				}
			};
		},
		toStreamFromProperty: function(observable, property) {
			return {
				onValue: function(callback) {
					var ret = { target: {} };
					ret.target[property] = observable[property];
					observable.on(property, function(ev, value) {
						callback(value);
					});
				}
			};
		},
		toStreamFromEvent: function(observable, event) {},
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
					valueStream.offValue(streamHandler);
				}
			});
		}
	};
	defineStream(canStreamInterface)(MyMap);

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
		toStream: function(observable, propOrEvent) {
			propOrEvent = propOrEvent ? propOrEvent.replace('.', '') : propOrEvent;
			var lastVal = (typeof observable === 'function') ? observable() :   observable[propOrEvent];
			var obj;
			return obj = {
				onValue: function(callback) {
					observable.on(propOrEvent, function(val) {
						callback(val);
					});
					callback(lastVal);
				},
				offValue: function() {
					observable.off(propOrEvent);
				}
			};
		},
		toStreamFromProperty: function(observable, property) {
			return {
				onValue: function(callback) {
					var ret = { target: {} };
					ret.target[property] = observable[property];
					observable.on(property, function(ev, value) {
						callback(value);
					});
				},
				offValue: function() {
					observable.off(property);
				}
			};
		},
		toStreamFromEvent: function(observable, event) {},
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
	defineStream(canStreamInterface)(MyMap);

	var map = new MyMap();

	QUnit.equal(0, map._bindings, 'Should have no bindings');


	map.on("baz", function(ev, newVal, oldVal){});

	QUnit.equal(3, map._bindings, 'Should have 3 bindings');


	map.off('baz');

	QUnit.equal(2, map._bindings, 'Should reset the bindings');
});



test('Update map property based on stream value', function() {
	var expected;
	var Person = DefineMap.extend({
		name: "string",
	  	lastValidName: {
	    	stream: function(){
				var nameStream = this.stream(".name");
				return nameStream;
	    	}
	  	}
	});
	var canStreamInterface = {
		toStream: function(observable, propOrEvent) {
			propOrEvent = propOrEvent ? propOrEvent.replace('.', '') : propOrEvent;
			var lastVal = (typeof observable === 'function') ? observable() :   observable[propOrEvent];
			var obj;
			return obj = {
				onValue: function(callback) {
					observable.on(propOrEvent, function(ev, val, oldVal) {
						if(val.indexOf(" ") >= 0) {
							callback(val);
						}
					});

					if(lastVal.indexOf(" ") >= 0) {
						callback(lastVal);
					}
				},
				offValue: function() {
					observable.off(propOrEvent);
				}
			};
		},
		toStreamFromProperty: function(observable, property) {
			return {
				onValue: function(callback) {
					var ret = { target: {} };
					ret.target[property] = observable[property];
					observable.on(property, function(ev, value) {
						callback(value);
					});
				},
				offValue: function() {
					observable.off(property);
				}
			};
		},
		toStreamFromEvent: function(observable, event) {},
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
	defineStream(canStreamInterface)(Person);
	var me = new Person({name: "James"});

	expected = me.name;
	me.on("lastValidName", function(lastValid){
		QUnit.equal(lastValid.target.name, expected, "Updated name to " + expected);
	});

	me.name = "JamesAtherton";

	expected = "James Atherton";
	me.name = "James Atherton";

	me.name = "JustinMeyer";

	expected = "Justin Meyer";
	me.name = "Justin Meyer";

});

test('Stream on DefineList', function() {
	var expectedLength;

	var PeopleList = DefineList.extend({});

	var canStreamInterface = {
		toStream: function(observable, propOrEvent) {

			var lastVal = (typeof observable === 'function') ? observable() :   observable[propOrEvent.replace(".", "")];
			var obj;
			return obj = {
				onValue: function(callback) {
					var event = propOrEvent ? propOrEvent : 'change';
					observable.on(event, function(ev, val) {
						callback(val);
					});

					callback(lastVal);
				}
			};
		},
		toStreamFromProperty: function(observable, property) {},
		toStreamFromEvent: function(observable, event) {},
		toCompute: function(makeStream, context) {}
	};
	defineStream(canStreamInterface)(PeopleList);

	var people = new PeopleList([
	  { first: "Justin", last: "Meyer" },
	  { first: "Paula", last: "Strozak" }
	]);

	var stream = people.stream('length');

	expectedLength = 2;
	stream.onValue(function(val) {
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
