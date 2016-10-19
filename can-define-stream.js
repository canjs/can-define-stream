var canStream = require('can-stream');
var DefineMap = require('can-define/map/map');

DefineMap.prototype.stream = function() {
	[].unshift.call(arguments, this);
	return canStream.toStreamFromEvent.apply(this, arguments);
};
