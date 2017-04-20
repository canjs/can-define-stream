@function can-define-stream.tostream toStream
@parent can-define-stream.fns


@description Creates a stream based on [can-compute] compute

@signature `canStream.toStream( propAndOrEvent )`

Creates a stream from a that gets updated whenever the property value changes or event is triggered.

@param {String} an event or property name

@return {Stream} A [can-stream](https://github.com/canjs/can-stream) stream.
