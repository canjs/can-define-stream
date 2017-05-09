@function can-define-stream.tostreamfromproperty toStreamFromProperty
@parent can-define-stream.fns


@description Creates a stream based on property

@signature `canStream.toStreamFromProperty( property )`

Creates a stream from a that gets updated whenever the property value changes.

@param {String} a property name

@return {Stream} A [can-stream](https://github.com/canjs/can-stream) stream.
