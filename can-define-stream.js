var define = require('can-define');
var assign = require("can-util/js/assign/assign");
var DefineMap = require('can-define/map/map');
var DefineList = require('can-define/list/list');
var compute = require("can-compute");

var oldExtensions = define.extensions;
define.behaviors.push('stream');

define.extensions = function (objPrototype, prop, definition) {
	if (definition.stream) {
		return assign({
			value: function() {
				return this.canStream.toCompute(definition.stream, this);
			}
		}, define.types.compute);

	} else {
		return oldExtensions.apply(this, arguments);
	}
};


module.exports = function(canStream) {
	return function(DefineMapType) {
		DefineMapType.prototype.canStream = canStream;
		DefineMapType.prototype.stream = function() {
			[].unshift.call(arguments, this);
			return canStream.toStream.apply(this, arguments);
		}
		return;
	}
}
