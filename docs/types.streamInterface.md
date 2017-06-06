@typedef {function} can-define-stream.types.streamInterface streamInterface
@parent can-define-stream.types

@description A [can-stream.types.streamInterface] function.

@signature `streamInterface([observable], propAndOrEvent[,event])`

The stream interface function returned from [can-stream] that will be used to add streamable props to a provided [can-define-stream.types.DefineMap DefineMap.prototype] or [can-define-stream.types.DefineList DefineList.prototype] and has the following property methods:

- .toStream(observable, propAndOrEvent[,event])
- .toStreamFromProperty(property)
- .toStreamFromEvent(property)
- .toCompute([can-stream.types.makeStream makeStream(setStream)], context):compute

```js
import DefineMap from 'can-define/map/map';
import canDefineStream from 'can-define-stream';
import streamInterface from 'can-stream-kefir';

var Person = DefineMap.extend({
	first: "string",
	last: "string",
	fullName: {
			get: function() {
					return this.first + " " + this.last;
			}
	}
});

var john = new Person({ first: 'John' });
john.toStream('.first'); //-> Error (toStream doesn't exist)

var defineStreamAdder = canDefineStream(streamInterface);
defineStreamAdder(Person);

var justin = new Person({ first: 'Justin' });
justin.toStream('.first'); //-> Stream
```

@body

## Use

See [can-stream.types.streamInterface].

See [can-stream-kefir] for an example implementation.
