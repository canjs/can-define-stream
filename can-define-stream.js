var define = require('can-define');
var compute = require('can-compute');
var computeStream = require('can-compute-stream');
var isArray = require("can-util/js/is-array/is-array");
var assign = require("can-util/js/assign/assign");

define.behaviors.push('stream');

var oldExtensions = define.extensions;
define.extensions = function (objPrototype, prop, definition) {
	if (isArray(definition.stream)) {
		return assign({
			value: function () {
				var map = this;
				var computes = definition.stream
					.map(function (arg) {
						return typeof arg === 'string' ? compute(map, arg) : arg;
					});
				return computeStream.asCompute.apply(this, computes);
			}
		}, define.types.compute);
	} else {
		return oldExtensions.apply(this, arguments);
	}
};