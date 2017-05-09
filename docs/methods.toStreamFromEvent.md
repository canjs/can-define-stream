@function can-define-stream.tostreamfromevent toStreamFromEvent
@parent can-define-stream.fns


@description Creates a stream based on event

@signature `canStream.toStreamFromEvent( eventName )`

Creates a stream from a that gets updated whenever the event is triggered.

@param {String} an event name

@return {Stream} A [can-stream](https://github.com/canjs/can-stream) stream.
