var define = require('can-define');
var compute = require('can-compute');
var canStream = require('can-stream');
var isArray = require("can-util/js/is-array/is-array");
var assign = require("can-util/js/assign/assign");
var DefineMap = require('can-define/map/map');

var oldExtensions = define.extensions;
define.behaviors.push('stream');

define.extensions = function (objPrototype, prop, definition) {

	if (definition.stream) {
		return assign({
			value: function() {
				debugger;
				var internalStream = definition.stream.call(objPrototype, canStream.toStream(objPrototype, prop));
				//internalStream.onValue()
				return internalStream;
			}
		}, define.types.stream);

	} else {
		return oldExtensions.apply(this, arguments);
	}
};

DefineMap.prototype.stream = function() {
	[].unshift.call(arguments, this);
	return canStream.toStream.apply(this, arguments);
};
