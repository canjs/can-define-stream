var define = require('can-define');
var canStream = require('can-stream');
var assign = require("can-util/js/assign/assign");
var DefineMap = require('can-define/map/map');

var oldExtensions = define.extensions;
define.behaviors.push('stream');

define.extensions = function (objPrototype, prop, definition) {

	if (definition.stream) {
		return assign({
			value: function() {
				return definition.stream.call(this, this.stream(prop));
			}
		}, definition.type);

	} else {
		return oldExtensions.apply(this, arguments);
	}
};

DefineMap.prototype.stream = function() {
	[].unshift.call(arguments, this);
	return canStream.toStream.apply(this, arguments);
};
