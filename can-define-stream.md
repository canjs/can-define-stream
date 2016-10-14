@module {Function} can-define-stream
@parent can-infrastructure

Convert one or more properties into a stream. [can-stream](https://github.com/canjs/can-stream) is used internally
to provide the stream functionality.

@signature `computeStream(…computes[, evaluator])`


## Proposal
```js
var map = new DefineMap.extend({
    foo: 'string'
});

var stream = map.stream('foo');
stream.onValue(function(val) {
    console.log('updated val: ' + val);
});
```
