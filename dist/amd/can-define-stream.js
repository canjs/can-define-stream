/*can-define-stream@0.0.1#can-define-stream*/
define(function (require, exports, module) {
    var define = require('can-define');
    var canStream = require('can-stream');
    var assign = require('can-util/js/assign');
    var DefineMap = require('can-define/map');
    var DefineList = require('can-define/list');
    var Kefir = require('kefir');
    var compute = require('can-compute');
    var oldExtensions = define.extensions;
    define.behaviors.push('stream');
    var makeComputeWithSetter = function (valueStream, willHaveEmitter) {
        var streamHandler, lastValue;
        var valueCompute = compute(undefined, {
            get: function () {
                return lastValue;
            },
            set: function (val) {
                willHaveEmitter.emitter.emit(val);
                return val;
            },
            on: function (updated) {
                streamHandler = function (val) {
                    lastValue = val;
                    updated();
                };
                valueStream.onValue(streamHandler);
            },
            off: function () {
                valueStream.offValue(streamHandler);
            }
        });
        return valueCompute;
    };
    var makeComputeFromStream = function (map, makeStream) {
        var willHaveEmitter = {};
        var setterStream = Kefir.stream(function (emitter) {
            willHaveEmitter.emitter = emitter;
        });
        var valueStream = makeStream.call(map, setterStream);
        return makeComputeWithSetter(valueStream, willHaveEmitter);
    };
    define.extensions = function (objPrototype, prop, definition) {
        if (definition.stream) {
            return assign({
                value: function () {
                    return makeComputeFromStream(this, definition.stream);
                }
            }, define.types.compute);
        } else {
            return oldExtensions.apply(this, arguments);
        }
    };
    DefineList.prototype.stream = DefineMap.prototype.stream = function () {
        [].unshift.call(arguments, this);
        return canStream.toStream.apply(this, arguments);
    };
});