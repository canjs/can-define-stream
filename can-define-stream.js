var define = require('can-define');
var canStream = require('can-stream');
var assign = require("can-util/js/assign/assign");
var DefineMap = require('can-define/map/map');
var Kefir = require("kefir");
var compute = require("can-compute");
var oldExtensions = define.extensions;
define.behaviors.push('stream');


var makeComputeWithSetter = function (valueStream, willHaveEmitter) {

	var streamHandler, lastValue;

	// Create a compute that will bind to the resolved stream when bound
	var valueCompute = compute(undefined, {

		// When the compute is read, use that last value
		get: function () {
			return lastValue;
		},
		set: function (val) {
			willHaveEmitter.emitter ? willHaveEmitter.emitter.emit(val) : false;
			return val;
		},

		// When the compute is bound, bind to the resolved stream
		on: function (updated) {

			// When the stream passes a new values, save a reference to it and call
			// the compute's internal `updated` method (which ultimately calls `get`)
			streamHandler = function (val) {
				lastValue = val;
				updated();
			};
			valueStream.onValue(streamHandler);
		},

		// When the compute is unbound, unbind from the resolved stream
		off: function () {
			valueStream.offValue(streamHandler);
		}
	});

	// Return the compute that's bound to the stream
	return valueCompute;
};


var makeComputeFromStream = function(map, makeStream){
	var willHaveEmitter= {};
	var setterStream = Kefir.stream(function (emitter) {
		willHaveEmitter.emitter = emitter;
	});

	var valueStream = makeStream.call(map, setterStream);

	return makeComputeWithSetter(valueStream, willHaveEmitter);
};

define.extensions = function (objPrototype, prop, definition) {

	if (definition.stream) {
		return assign({
			value: function() {
				return makeComputeFromStream(this, definition.stream);
			}
		}, define.types.compute);

	} else {
		return oldExtensions.apply(this, arguments);
	}
};

DefineMap.prototype.stream = function() {
	[].unshift.call(arguments, this);
	return canStream.toStream.apply(this, arguments);
};
