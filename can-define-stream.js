var define = require('can-define');
var assign = require("can-util/js/assign/assign");

var oldExtensions = define.extensions;
define.behaviors.push('stream');

define.extensions = function (objPrototype, prop, definition) {
	if (definition.stream) {
		return assign({
			value: function() {
				return this.toCompute(definition.stream, this);
			}
		}, define.types.compute);

	} else {
		return oldExtensions.apply(this, arguments);
	}
};


module.exports = function(canStream) {
	return function(DefineMapType) {

		DefineMapType.prototype.toStream = canStream.toStream;
		DefineMapType.prototype.toCompute = canStream.toCompute;
		DefineMapType.prototype.toStreamFromProperty = canStream.toStreamFromProperty;
		DefineMapType.prototype.toStreamFromEvent = canStream.toStreamFromEvent;

		DefineMapType.prototype.stream = function() {
			[].unshift.call(arguments, this);
			return this.toStream.apply(this, arguments);
		};


	};
};
