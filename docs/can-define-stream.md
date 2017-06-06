@module {function} can-define-stream can-define-stream
@parent can-ecosystem
@group can-define-stream.types 3 types
@group can-define-stream.fns 4 DefineMap methods
@package ../package.json

@description Add useful stream conversion methods to a supplied [can-define/map/map] or [can-define/list/list] constructor using a [can-define-stream.types.streamInterface stream interface] such as [can-stream-kefir].

@signature `canDefineStream(streamInterface)`

The `can-define-stream` module exports a function that takes a [can-define-stream.types.streamInterface] and returns a function that takes a [can-define-stream.types.DefineMap DefineMap.prototype] or [can-define-stream.types.DefineList DefineList.prototype] and uses the supplied stream interface to create streamed property definitions.

```js
var canStream = require("can-stream-kefir");
var canDefineStream = require("can-define-stream");
var DefineMap = require("can-define/map/map");

var Person = DefineMap.extend({
    first: "string",
    last: "string",
    fullName: {
        get: function() {
            return this.first + " " + this.last;
        }
    },
    fullNameChangeCount: {
        stream: function() {
            return this.toStream(".fullName").scan(function(last) {
                return last + 1;
            }, 0);
        }
    }
});

canDefineStream(canStream)(Person);

var me = new Person({name: "Justin", last: "Meyer"});

me.on("fullNameChangeCount", function(ev, newVal) {
    console.log(newVal);
});
me.fullNameChangeCount //-> 0
me.first = "Obaid"; //-> console.logs 1
me.last = "Ahmed"; //-> console.logs 2
```

@param {can-define-stream.types.streamInterface} streamInterface A [can-define-stream.types.streamInterface] function. See [can-stream-kefir] for implementation.

@return {function} A function that takes a [can-define-stream.types.DefineMap DefineMap.prototype] or [can-define-stream.types.DefineList DefineList.prototype].

@body

## Use

The [can-define-stream.toStream] method has shorthands for all of the other methods:

```js
toStream("eventName")           //-> stream
toStream(".propName")           //-> stream
toStream(".propName eventName") //-> stream
```

For example:

__Update map property based on stream value__

```js
var DefineMap = require('can-define/map/map');
var canStream = require("can-stream-kefir");
var canDefineStream = require("can-define-stream");

var Person = DefineMap.extend({
    name: "string",
    lastValidName: {
        stream: function() {
            return this.toStream(".name").filter(function(name) { // using propName
                return name.indexOf(" ") >= 0;
            });
        }
    }
});

canDefineStream(canStream)(Person);

var me = new Person({name: "James"});

me.on("lastValidName", function(lastValid) {});

me.name = "JamesAtherton"; //lastValidName -> undefined
me.name = "James Atherton"; //lastValidName -> James Atherton
```

__Stream on DefineList__

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

var stream = people.toStream('length'); // using eventName

stream.onValue(function(val) {
    val //-> 2, 3
});

people.push({
    first: 'Obaid',
    last: 'Ahmed'
}); //-> stream.onValue -> 3
```
