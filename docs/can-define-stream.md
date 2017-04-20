@module {Object} can-define-stream can-define-stream
@parent can-ecosystem
@group can-define-stream/behaviors 0 behaviors
@group can-define-stream/DefineMap.prototype 2 DefineMap.prototype
@group can-define-stream/DefineList.prototype 2 DefineList.prototype
@group can-define-stream.fns 3 Methods
@package ../package.json

@description Exports a function that takes a [can-stream] can-stream interface and returns a function that takes a Type [can-define/map/map] or [can-define/list/list] and uses the supplied can-stream interface to create streamed property definitions and a .stream method

@type {Object}

The `can-define-stream` module exports methods useful for converting observable values like [can-compute]s into streams.

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
            return this.stream(".fullName").scan(function(last) {
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

@body

## Usage

The [can-stream-kefir.toStream] method has shorthands for all of the other methods:

```
var canStream = require("can-stream-kefir");

canStream.toStream(compute)                    //-> stream
canStream.toStream(map, "eventName")           //-> stream
canStream.toStream(map, ".propName")           //-> stream
canStream.toStream(map, ".propName eventName") //-> stream
```

For example:

__Update map property based on stream value__

```js
var canStream = require("can-stream-kefir");
var canDefineStream = require("can-define-stream");

var Person = DefineMap.extend({
    name: "string",
    lastValidName: {
        stream: function() {
            return this.stream(".name").filter(function(name) {
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
var canStream = require("can-stream-kefir");
var canDefineStream = require("can-define-stream");

var PeopleList = DefineList.extend({});

canDefineStream(canStream)(PeopleList);

var people = new PeopleList([
    { first: "Justin", last: "Meyer" },
    { first: "Paula", last: "Strozak" }
]);

var stream = people.stream('length');

stream.onValue(function(val) {
    val //-> 2, 3
});

people.push({
    first: 'Obaid',
    last: 'Ahmed'
}); //-> stream.onValue -> 3

```
