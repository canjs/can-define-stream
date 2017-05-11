@function can-define-stream.tostreamfromevent toStreamFromEvent
@parent can-define-stream.fns


@description Create a stream based on an event

@signature `DefineMap.toStreamFromEvent( eventName )`

Creates a stream from an event that gets updated whenever the event is triggered.

```js
var DefineList = require('can-define/list/list');
var canStream = require("can-stream-kefir");
var canDefineStream = require("can-define-stream");

var PeopleList = DefineList.extend({});

canDefineStream(canStream)(PeopleList);

var people = new PeopleList([
    { first: "Justin", last: "Meyer" },
    { first: "Paula", last: "Strozak" }
]);

var stream = people.toStreamFromEvent('length'); // using eventName

stream.onValue(function(val) {
    val //-> 2, 3
});

people.push({
    first: 'Obaid',
    last: 'Ahmed'
}); //-> stream.onValue -> 3
```

@param {String} event An event name

@return {Stream} A [can-stream] stream.
