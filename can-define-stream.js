var define = require('can-define');
var assign = require("can-util/js/assign/assign");
var each = require("can-util/js/each/each");

module.exports = function(canStream) {
	return function(DefineMapType) {
		["toStream","toStreamFromProperty","toStreamFromEvent"] .forEach(function(name){
			DefineMapType.prototype[name] = function(){
				return canStream[name].apply(canStream, [this].concat( [].slice.call(arguments) ));
			};
		});

		DefineMapType.prototype.stream = DefineMapType.prototype.toStream;

		// figure out how to rebuild definitions.
		var definitions = DefineMapType.prototype._define.definitions,
			dataInitializers = DefineMapType.prototype._define.dataInitializers,
			computedInitializers = DefineMapType.prototype._define.computedInitializers;

		each(definitions, function(definition, property){
			var streamDefinition = definition.stream;
			if(streamDefinition) {
				var newDefinition = assign({
					value: function() {
						return canStream.toCompute(streamDefinition, this);
					}
				}, define.types.compute);
				define.property(DefineMapType.prototype, property, newDefinition, dataInitializers, computedInitializers);
			}
		});
		/*var oldExtensions = define.extensions;
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
		};*/
	};
};
