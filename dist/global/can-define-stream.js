/*[global-shim-start]*/
(function(exports, global, doEval){ // jshint ignore:line
	var origDefine = global.define;

	var get = function(name){
		var parts = name.split("."),
			cur = global,
			i;
		for(i = 0 ; i < parts.length; i++){
			if(!cur) {
				break;
			}
			cur = cur[parts[i]];
		}
		return cur;
	};
	var set = function(name, val){
		var parts = name.split("."),
			cur = global,
			i, part, next;
		for(i = 0; i < parts.length - 1; i++) {
			part = parts[i];
			next = cur[part];
			if(!next) {
				next = cur[part] = {};
			}
			cur = next;
		}
		part = parts[parts.length - 1];
		cur[part] = val;
	};
	var useDefault = function(mod){
		if(!mod || !mod.__esModule) return false;
		var esProps = { __esModule: true, "default": true };
		for(var p in mod) {
			if(!esProps[p]) return false;
		}
		return true;
	};
	var modules = (global.define && global.define.modules) ||
		(global._define && global._define.modules) || {};
	var ourDefine = global.define = function(moduleName, deps, callback){
		var module;
		if(typeof deps === "function") {
			callback = deps;
			deps = [];
		}
		var args = [],
			i;
		for(i =0; i < deps.length; i++) {
			args.push( exports[deps[i]] ? get(exports[deps[i]]) : ( modules[deps[i]] || get(deps[i]) )  );
		}
		// CJS has no dependencies but 3 callback arguments
		if(!deps.length && callback.length) {
			module = { exports: {} };
			var require = function(name) {
				return exports[name] ? get(exports[name]) : modules[name];
			};
			args.push(require, module.exports, module);
		}
		// Babel uses the exports and module object.
		else if(!args[0] && deps[0] === "exports") {
			module = { exports: {} };
			args[0] = module.exports;
			if(deps[1] === "module") {
				args[1] = module;
			}
		} else if(!args[0] && deps[0] === "module") {
			args[0] = { id: moduleName };
		}

		global.define = origDefine;
		var result = callback ? callback.apply(null, args) : undefined;
		global.define = ourDefine;

		// Favor CJS module.exports over the return value
		result = module && module.exports ? module.exports : result;
		modules[moduleName] = result;

		// Set global exports
		var globalExport = exports[moduleName];
		if(globalExport && !get(globalExport)) {
			if(useDefault(result)) {
				result = result["default"];
			}
			set(globalExport, result);
		}
	};
	global.define.orig = origDefine;
	global.define.modules = modules;
	global.define.amd = true;
	ourDefine("@loader", [], function(){
		// shim for @@global-helpers
		var noop = function(){};
		return {
			get: function(){
				return { prepareGlobal: noop, retrieveGlobal: noop };
			},
			global: global,
			__exec: function(__load){
				doEval(__load.source, global);
			}
		};
	});
}
)({"can-util/namespace":"can"},window,function(__$source__, __$global__) { // jshint ignore:line
	eval("(function() { " + __$source__ + " \n }).call(__$global__);");
}
)
/*can-util@3.0.1#js/assign/assign*/
define('can-util/js/assign/assign', function (require, exports, module) {
    module.exports = function (d, s) {
        for (var prop in s) {
            d[prop] = s[prop];
        }
        return d;
    };
});
/*can-util@3.0.1#js/global/global*/
define('can-util/js/global/global', function (require, exports, module) {
    (function (global) {
        module.exports = function () {
            return typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope ? self : typeof process === 'object' && {}.toString.call(process) === '[object process]' ? global : window;
        };
    }(function () {
        return this;
    }()));
});
/*can-util@3.0.1#dom/document/document*/
define('can-util/dom/document/document', function (require, exports, module) {
    (function (global) {
        var global = require('can-util/js/global/global');
        var setDocument;
        module.exports = function (setDoc) {
            if (setDoc) {
                setDocument = setDoc;
            }
            return setDocument || global().document;
        };
    }(function () {
        return this;
    }()));
});
/*can-util@3.0.1#dom/events/events*/
define('can-util/dom/events/events', function (require, exports, module) {
    var assign = require('can-util/js/assign/assign');
    var _document = require('can-util/dom/document/document');
    module.exports = {
        addEventListener: function () {
            this.addEventListener.apply(this, arguments);
        },
        removeEventListener: function () {
            this.removeEventListener.apply(this, arguments);
        },
        canAddEventListener: function () {
            return this.nodeName && (this.nodeType === 1 || this.nodeType === 9) || this === window;
        },
        dispatch: function (event, args, bubbles) {
            var doc = _document();
            var ev = doc.createEvent('HTMLEvents');
            var isString = typeof event === 'string';
            ev.initEvent(isString ? event : event.type, bubbles === undefined ? true : bubbles, false);
            if (!isString) {
                assign(ev, event);
            }
            ev.args = args;
            return this.dispatchEvent(ev);
        }
    };
});
/*can-util@3.0.1#js/cid/cid*/
define('can-util/js/cid/cid', function (require, exports, module) {
    var cid = 0;
    module.exports = function (object, name) {
        if (!object._cid) {
            cid++;
            object._cid = (name || '') + cid;
        }
        return object._cid;
    };
});
/*can-util@3.0.1#js/is-empty-object/is-empty-object*/
define('can-util/js/is-empty-object/is-empty-object', function (require, exports, module) {
    module.exports = function (obj) {
        for (var prop in obj) {
            return false;
        }
        return true;
    };
});
/*can-util@3.0.1#dom/dispatch/dispatch*/
define('can-util/dom/dispatch/dispatch', function (require, exports, module) {
    var domEvents = require('can-util/dom/events/events');
    module.exports = function () {
        return domEvents.dispatch.apply(this, arguments);
    };
});
/*can-util@3.0.1#namespace*/
define('can-util/namespace', function (require, exports, module) {
    module.exports = {};
});
/*can-util@3.0.1#dom/data/data*/
define('can-util/dom/data/data', function (require, exports, module) {
    var isEmptyObject = require('can-util/js/is-empty-object/is-empty-object');
    var data = {};
    var expando = 'can' + new Date();
    var uuid = 0;
    var setData = function (name, value) {
        var id = this[expando] || (this[expando] = ++uuid), store = data[id] || (data[id] = {});
        if (name !== undefined) {
            store[name] = value;
        }
        return store;
    };
    module.exports = {
        getCid: function () {
            return this[expando];
        },
        cid: function () {
            return this[expando] || (this[expando] = ++uuid);
        },
        expando: expando,
        clean: function (prop) {
            var id = this[expando];
            if (data[id] && data[id][prop]) {
                delete data[id][prop];
            }
            if (isEmptyObject(data[id])) {
                delete data[id];
            }
        },
        get: function (key) {
            var id = this[expando], store = id && data[id];
            return key === undefined ? store || setData(this) : store && store[key];
        },
        set: setData
    };
});
/*can-util@3.0.1#dom/matches/matches*/
define('can-util/dom/matches/matches', function (require, exports, module) {
    var matchesMethod = function (element) {
        return element.matches || element.webkitMatchesSelector || element.webkitMatchesSelector || element.mozMatchesSelector || element.msMatchesSelector || element.oMatchesSelector;
    };
    module.exports = function () {
        var method = matchesMethod(this);
        return method ? method.apply(this, arguments) : false;
    };
});
/*can-util@3.0.1#js/is-array-like/is-array-like*/
define('can-util/js/is-array-like/is-array-like', function (require, exports, module) {
    function isArrayLike(obj) {
        var type = typeof obj;
        if (type === 'string') {
            return true;
        }
        var length = obj && type !== 'boolean' && typeof obj !== 'number' && 'length' in obj && obj.length;
        return typeof arr !== 'function' && (length === 0 || typeof length === 'number' && length > 0 && length - 1 in obj);
    }
    module.exports = isArrayLike;
});
/*can-util@3.0.1#js/is-promise/is-promise*/
define('can-util/js/is-promise/is-promise', function (require, exports, module) {
    module.exports = function (obj) {
        return obj instanceof Promise || Object.prototype.toString.call(obj) === '[object Promise]';
    };
});
/*can-util@3.0.1#js/types/types*/
define('can-util/js/types/types', function (require, exports, module) {
    var isPromise = require('can-util/js/is-promise/is-promise');
    var types = {
        isMapLike: function () {
            return false;
        },
        isListLike: function () {
            return false;
        },
        isPromise: function (obj) {
            return isPromise(obj);
        },
        isConstructor: function (func) {
            if (typeof func !== 'function') {
                return false;
            }
            for (var prop in func.prototype) {
                return true;
            }
            return false;
        },
        isCallableForValue: function (obj) {
            return typeof obj === 'function' && !types.isConstructor(obj);
        },
        isCompute: function (obj) {
            return obj && obj.isComputed;
        },
        iterator: typeof Symbol === 'function' && Symbol.iterator || '@@iterator',
        DefaultMap: null,
        DefaultList: null,
        queueTask: function (task) {
            var args = task[2] || [];
            task[0].apply(task[1], args);
        },
        wrapElement: function (element) {
            return element;
        },
        unwrapElement: function (element) {
            return element;
        }
    };
    module.exports = types;
});
/*can-util@3.0.1#js/is-iterable/is-iterable*/
define('can-util/js/is-iterable/is-iterable', function (require, exports, module) {
    var types = require('can-util/js/types/types');
    module.exports = function (obj) {
        return obj && !!obj[types.iterator];
    };
});
/*can-util@3.0.1#js/each/each*/
define('can-util/js/each/each', function (require, exports, module) {
    var isArrayLike = require('can-util/js/is-array-like/is-array-like');
    var has = Object.prototype.hasOwnProperty;
    var isIterable = require('can-util/js/is-iterable/is-iterable');
    var types = require('can-util/js/types/types');
    function each(elements, callback, context) {
        var i = 0, key, len, item;
        if (elements) {
            if (isArrayLike(elements)) {
                for (len = elements.length; i < len; i++) {
                    item = elements[i];
                    if (callback.call(context || item, item, i, elements) === false) {
                        break;
                    }
                }
            } else if (isIterable(elements)) {
                var iter = elements[types.iterator]();
                var res, value;
                while (!(res = iter.next()).done) {
                    value = res.value;
                    callback.call(context || elements, Array.isArray(value) ? value[1] : value, value[0]);
                }
            } else if (typeof elements === 'object') {
                for (key in elements) {
                    if (has.call(elements, key) && callback.call(context || elements[key], elements[key], key, elements) === false) {
                        break;
                    }
                }
            }
        }
        return elements;
    }
    module.exports = each;
});
/*can-util@3.0.1#dom/events/delegate/delegate*/
define('can-util/dom/events/delegate/delegate', function (require, exports, module) {
    var domEvents = require('can-util/dom/events/events');
    var domData = require('can-util/dom/data/data');
    var domMatches = require('can-util/dom/matches/matches');
    var each = require('can-util/js/each/each');
    var isEmptyObject = require('can-util/js/is-empty-object/is-empty-object');
    var dataName = 'delegateEvents';
    var useCapture = function (eventType) {
        return eventType === 'focus' || eventType === 'blur';
    };
    var handleEvent = function (ev) {
        var events = domData.get.call(this, dataName);
        var eventTypeEvents = events[ev.type];
        var matches = [];
        if (eventTypeEvents) {
            var selectorDelegates = [];
            each(eventTypeEvents, function (delegates) {
                selectorDelegates.push(delegates);
            });
            var cur = ev.target;
            do {
                selectorDelegates.forEach(function (delegates) {
                    if (domMatches.call(cur, delegates[0].selector)) {
                        matches.push({
                            target: cur,
                            delegates: delegates
                        });
                    }
                });
                cur = cur.parentNode;
            } while (cur && cur !== ev.currentTarget);
        }
        var oldStopProp = ev.stopPropagation;
        ev.stopPropagation = function () {
            oldStopProp.apply(this, arguments);
            this.cancelBubble = true;
        };
        for (var i = 0; i < matches.length; i++) {
            var match = matches[i];
            var delegates = match.delegates;
            for (var d = 0, dLen = delegates.length; d < dLen; d++) {
                if (delegates[d].handler.call(match.target, ev) === false) {
                    return false;
                }
                if (ev.cancelBubble) {
                    return;
                }
            }
        }
    };
    domEvents.addDelegateListener = function (eventType, selector, handler) {
        var events = domData.get.call(this, dataName), eventTypeEvents;
        if (!events) {
            domData.set.call(this, dataName, events = {});
        }
        if (!(eventTypeEvents = events[eventType])) {
            eventTypeEvents = events[eventType] = {};
            domEvents.addEventListener.call(this, eventType, handleEvent, useCapture(eventType));
        }
        if (!eventTypeEvents[selector]) {
            eventTypeEvents[selector] = [];
        }
        eventTypeEvents[selector].push({
            handler: handler,
            selector: selector
        });
    };
    domEvents.removeDelegateListener = function (eventType, selector, handler) {
        var events = domData.get.call(this, dataName);
        if (events[eventType] && events[eventType][selector]) {
            var eventTypeEvents = events[eventType], delegates = eventTypeEvents[selector], i = 0;
            while (i < delegates.length) {
                if (delegates[i].handler === handler) {
                    delegates.splice(i, 1);
                } else {
                    i++;
                }
            }
            if (delegates.length === 0) {
                delete eventTypeEvents[selector];
                if (isEmptyObject(eventTypeEvents)) {
                    domEvents.removeEventListener.call(this, eventType, handleEvent, useCapture(eventType));
                    delete events[eventType];
                    if (isEmptyObject(events)) {
                        domData.clean.call(this, dataName);
                    }
                }
            }
        }
    };
});
/*can-event@3.0.1#can-event*/
define('can-event', function (require, exports, module) {
    var domEvents = require('can-util/dom/events/events');
    var CID = require('can-util/js/cid/cid');
    var isEmptyObject = require('can-util/js/is-empty-object/is-empty-object');
    var domDispatch = require('can-util/dom/dispatch/dispatch');
    var namespace = require('can-util/namespace');
    require('can-util/dom/events/delegate/delegate');
    function makeHandlerArgs(event, args) {
        if (typeof event === 'string') {
            event = { type: event };
        }
        var handlerArgs = [event];
        if (args) {
            handlerArgs.push.apply(handlerArgs, args);
        }
        return handlerArgs;
    }
    function getHandlers(eventName) {
        var events = this.__bindEvents;
        if (!events) {
            return;
        }
        var handlers = events[eventName];
        if (!handlers) {
            return;
        } else {
            return handlers;
        }
    }
    var canEvent = {
        addEventListener: function (event, handler) {
            var allEvents = this.__bindEvents || (this.__bindEvents = {}), eventList = allEvents[event] || (allEvents[event] = []);
            eventList.push(handler);
            return this;
        },
        removeEventListener: function (event, fn) {
            if (!this.__bindEvents) {
                return this;
            }
            var handlers = this.__bindEvents[event] || [], i = 0, handler, isFunction = typeof fn === 'function';
            while (i < handlers.length) {
                handler = handlers[i];
                if (isFunction && handler === fn || !isFunction && (handler.cid === fn || !fn)) {
                    handlers.splice(i, 1);
                } else {
                    i++;
                }
            }
            return this;
        },
        dispatchSync: function (event, args) {
            var handlerArgs = makeHandlerArgs(event, args);
            var handlers = getHandlers.call(this, handlerArgs[0].type);
            if (!handlers) {
                return;
            }
            handlers = handlers.slice(0);
            for (var i = 0, len = handlers.length; i < len; i++) {
                handlers[i].apply(this, handlerArgs);
            }
            return handlerArgs[0];
        },
        on: function (eventName, selector, handler) {
            var method = typeof selector === 'string' ? 'addDelegateListener' : 'addEventListener';
            var listenWithDOM = domEvents.canAddEventListener.call(this);
            var eventBinder = listenWithDOM ? domEvents[method] : this[method] || canEvent[method];
            return eventBinder.apply(this, arguments);
        },
        off: function (eventName, selector, handler) {
            var method = typeof selector === 'string' ? 'removeDelegateListener' : 'removeEventListener';
            var listenWithDOM = domEvents.canAddEventListener.call(this);
            var eventBinder = listenWithDOM ? domEvents[method] : this[method] || canEvent[method];
            return eventBinder.apply(this, arguments);
        },
        trigger: function () {
            var listenWithDOM = domEvents.canAddEventListener.call(this);
            var dispatch = listenWithDOM ? domDispatch : canEvent.dispatch;
            return dispatch.apply(this, arguments);
        },
        one: function (event, handler) {
            var one = function () {
                canEvent.off.call(this, event, one);
                return handler.apply(this, arguments);
            };
            canEvent.on.call(this, event, one);
            return this;
        },
        listenTo: function (other, event, handler) {
            var idedEvents = this.__listenToEvents;
            if (!idedEvents) {
                idedEvents = this.__listenToEvents = {};
            }
            var otherId = CID(other);
            var othersEvents = idedEvents[otherId];
            if (!othersEvents) {
                othersEvents = idedEvents[otherId] = {
                    obj: other,
                    events: {}
                };
            }
            var eventsEvents = othersEvents.events[event];
            if (!eventsEvents) {
                eventsEvents = othersEvents.events[event] = [];
            }
            eventsEvents.push(handler);
            canEvent.on.call(other, event, handler);
        },
        stopListening: function (other, event, handler) {
            var idedEvents = this.__listenToEvents, iterIdedEvents = idedEvents, i = 0;
            if (!idedEvents) {
                return this;
            }
            if (other) {
                var othercid = CID(other);
                (iterIdedEvents = {})[othercid] = idedEvents[othercid];
                if (!idedEvents[othercid]) {
                    return this;
                }
            }
            for (var cid in iterIdedEvents) {
                var othersEvents = iterIdedEvents[cid], eventsEvents;
                other = idedEvents[cid].obj;
                if (!event) {
                    eventsEvents = othersEvents.events;
                } else {
                    (eventsEvents = {})[event] = othersEvents.events[event];
                }
                for (var eventName in eventsEvents) {
                    var handlers = eventsEvents[eventName] || [];
                    i = 0;
                    while (i < handlers.length) {
                        if (handler && handler === handlers[i] || !handler) {
                            canEvent.off.call(other, eventName, handlers[i]);
                            handlers.splice(i, 1);
                        } else {
                            i++;
                        }
                    }
                    if (!handlers.length) {
                        delete othersEvents.events[eventName];
                    }
                }
                if (isEmptyObject(othersEvents.events)) {
                    delete idedEvents[cid];
                }
            }
            return this;
        }
    };
    canEvent.addEvent = canEvent.bind = function () {
        return canEvent.addEventListener.apply(this, arguments);
    };
    canEvent.unbind = canEvent.removeEvent = function () {
        return canEvent.removeEventListener.apply(this, arguments);
    };
    canEvent.delegate = canEvent.on;
    canEvent.undelegate = canEvent.off;
    canEvent.dispatch = canEvent.dispatchSync;
    Object.defineProperty(canEvent, 'makeHandlerArgs', {
        enumerable: false,
        value: makeHandlerArgs
    });
    Object.defineProperty(canEvent, 'handlers', {
        enumerable: false,
        value: getHandlers
    });
    Object.defineProperty(canEvent, 'flush', {
        enumerable: false,
        writable: true,
        value: function () {
        }
    });
    module.exports = namespace.event = canEvent;
});
/*can-event@3.0.1#lifecycle/lifecycle*/
define('can-event/lifecycle/lifecycle', function (require, exports, module) {
    var canEvent = require('can-event');
    module.exports = {
        addAndSetup: function () {
            canEvent.addEventListener.apply(this, arguments);
            if (!this.__inSetup) {
                if (!this._bindings) {
                    this._bindings = 1;
                    if (this._eventSetup) {
                        this._eventSetup();
                    }
                } else {
                    this._bindings++;
                }
            }
            return this;
        },
        removeAndTeardown: function (event, handler) {
            if (!this.__bindEvents) {
                return this;
            }
            var handlers = this.__bindEvents[event] || [];
            var handlerCount = handlers.length;
            canEvent.removeEventListener.apply(this, arguments);
            if (this._bindings === null) {
                this._bindings = 0;
            } else {
                this._bindings = this._bindings - (handlerCount - handlers.length);
            }
            if (!this._bindings && this._eventTeardown) {
                this._eventTeardown();
            }
            return this;
        }
    };
});
/*can-util@3.0.1#js/last/last*/
define('can-util/js/last/last', function (require, exports, module) {
    module.exports = function (arr) {
        return arr && arr[arr.length - 1];
    };
});
/*can-util@3.0.1#js/dev/dev*/
define('can-util/js/dev/dev', function (require, exports, module) {
});
/*can-event@3.0.1#batch/batch*/
define('can-event/batch/batch', function (require, exports, module) {
    'use strict';
    var canEvent = require('can-event');
    var last = require('can-util/js/last/last');
    var namespace = require('can-util/namespace');
    var canTypes = require('can-util/js/types/types');
    var canDev = require('can-util/js/dev/dev');
    var batchNum = 1, collectionQueue = null, queues = [], dispatchingQueues = false, makeHandlerArgs = canEvent.makeHandlerArgs, getHandlers = canEvent.handlers;
    function addToCollectionQueue(item, event, args, handlers) {
        var handlerArgs = makeHandlerArgs(event, args);
        var tasks = [];
        for (var i = 0, len = handlers.length; i < len; i++) {
            tasks[i] = [
                handlers[i],
                item,
                handlerArgs
            ];
        }
        [].push.apply(collectionQueue.tasks, tasks);
    }
    var canBatch = {
        transactions: 0,
        start: function (batchStopHandler) {
            canBatch.transactions++;
            if (canBatch.transactions === 1) {
                var queue = {
                    number: batchNum++,
                    index: 0,
                    tasks: [],
                    batchEnded: false,
                    callbacksIndex: 0,
                    callbacks: [],
                    complete: false
                };
                if (batchStopHandler) {
                    queue.callbacks.push(batchStopHandler);
                }
                collectionQueue = queue;
            }
        },
        collecting: function () {
            return collectionQueue;
        },
        dispatching: function () {
            return queues[0];
        },
        stop: function (force, callStart) {
            if (force) {
                canBatch.transactions = 0;
            } else {
                canBatch.transactions--;
            }
            if (canBatch.transactions === 0) {
                queues.push(collectionQueue);
                collectionQueue = null;
                if (!dispatchingQueues) {
                    canEvent.flush();
                }
            }
        },
        flush: function () {
            dispatchingQueues = true;
            while (queues.length) {
                var queue = queues[0];
                var tasks = queue.tasks, callbacks = queue.callbacks;
                canBatch.batchNum = queue.number;
                var len = tasks.length, index;
                while (queue.index < len) {
                    index = queue.index++;
                    tasks[index][0].apply(tasks[index][1], tasks[index][2]);
                }
                if (!queue.batchEnded) {
                    queue.batchEnded = true;
                    canEvent.dispatchSync.call(canBatch, 'batchEnd', [queue.number]);
                }
                while (queue.callbacksIndex < callbacks.length) {
                    callbacks[queue.callbacksIndex++]();
                }
                if (!queue.complete) {
                    queue.complete = true;
                    canBatch.batchNum = undefined;
                    queues.shift();
                }
            }
            dispatchingQueues = false;
        },
        dispatch: function (event, args) {
            var item = this, handlers;
            if (!item.__inSetup) {
                event = typeof event === 'string' ? { type: event } : event;
                if (event.batchNum) {
                    canEvent.dispatchSync.call(item, event, args);
                } else if (collectionQueue) {
                    handlers = getHandlers.call(this, event.type);
                    if (handlers) {
                        event.batchNum = collectionQueue.number;
                        addToCollectionQueue(item, event, args, handlers);
                    }
                } else if (queues.length) {
                    handlers = getHandlers.call(this, event.type);
                    if (handlers) {
                        canBatch.start();
                        event.batchNum = collectionQueue.number;
                        addToCollectionQueue(item, event, args, handlers);
                        last(queues).callbacks.push(canBatch.stop);
                    }
                } else {
                    handlers = getHandlers.call(this, event.type);
                    if (handlers) {
                        canBatch.start();
                        event.batchNum = collectionQueue.number;
                        addToCollectionQueue(item, event, args, handlers);
                        canBatch.stop();
                    }
                }
            }
        },
        queue: function (task, inCurrentBatch) {
            if (collectionQueue) {
                collectionQueue.tasks.push(task);
            } else if (queues.length) {
                if (inCurrentBatch && queues[0].index < queues.tasks.length) {
                    queues[0].tasks.push(task);
                } else {
                    canBatch.start();
                    collectionQueue.tasks.push(task);
                    last(queues).callbacks.push(canBatch.stop);
                }
            } else {
                canBatch.start();
                collectionQueue.tasks.push(task);
                canBatch.stop();
            }
        },
        queues: function () {
            return queues;
        },
        afterPreviousEvents: function (handler) {
            this.queue([handler]);
        },
        after: function (handler) {
            var queue = collectionQueue || queues[0];
            if (queue) {
                queue.callbacks.push(handler);
            } else {
                handler({});
            }
        }
    };
    canEvent.flush = canBatch.flush;
    canEvent.dispatch = canBatch.dispatch;
    canBatch.trigger = function () {
        console.warn('use canEvent.dispatch instead');
        return canEvent.dispatch.apply(this, arguments);
    };
    canTypes.queueTask = canBatch.queue;
    module.exports = namespace.batch = canBatch;
});
/*can-observation@3.0.1#can-observation*/
define('can-observation', function (require, exports, module) {
    require('can-event');
    var canEvent = require('can-event');
    var canBatch = require('can-event/batch/batch');
    var assign = require('can-util/js/assign/assign');
    var namespace = require('can-util/namespace');
    var remaining = {
        updates: 0,
        notifications: 0
    };
    function Observation(func, context, compute) {
        this.newObserved = {};
        this.oldObserved = null;
        this.func = func;
        this.context = context;
        this.compute = compute.updater ? compute : { updater: compute };
        this.onDependencyChange = this.onDependencyChange.bind(this);
        this.childDepths = {};
        this.ignore = 0;
        this.needsUpdate = false;
    }
    var observationStack = [];
    assign(Observation.prototype, {
        get: function () {
            if (this.bound) {
                canEvent.flush();
                if (remaining.updates) {
                    Observation.updateChildrenAndSelf(this);
                }
                return this.value;
            } else {
                return this.func.call(this.context);
            }
        },
        getPrimaryDepth: function () {
            return this.compute._primaryDepth || 0;
        },
        addEdge: function (objEv) {
            objEv.obj.addEventListener(objEv.event, this.onDependencyChange);
            if (objEv.obj.observation) {
                this.depth = null;
            }
        },
        removeEdge: function (objEv) {
            objEv.obj.removeEventListener(objEv.event, this.onDependencyChange);
            if (objEv.obj.observation) {
                this.depth = null;
            }
        },
        dependencyChange: function (ev) {
            if (this.bound) {
                if (ev.batchNum !== this.batchNum) {
                    Observation.registerUpdate(this, ev.batchNum);
                    this.batchNum = ev.batchNum;
                }
            }
        },
        onDependencyChange: function (ev, newVal, oldVal) {
            this.dependencyChange(ev, newVal, oldVal);
        },
        update: function (batchNum) {
            if (this.needsUpdate) {
                remaining.updates--;
            }
            this.needsUpdate = false;
            if (this.bound) {
                var oldValue = this.value;
                this.oldValue = null;
                this.start();
                if (oldValue !== this.value) {
                    this.compute.updater(this.value, oldValue, batchNum);
                    return true;
                }
            }
        },
        getValueAndBind: function () {
            console.warn('can-observation: call start instead of getValueAndBind');
            return this.start();
        },
        start: function () {
            this.bound = true;
            this.oldObserved = this.newObserved || {};
            this.ignore = 0;
            this.newObserved = {};
            observationStack.push(this);
            this.value = this.func.call(this.context);
            observationStack.pop();
            this.updateBindings();
        },
        updateBindings: function () {
            var newObserved = this.newObserved, oldObserved = this.oldObserved, name, obEv;
            for (name in newObserved) {
                obEv = newObserved[name];
                if (!oldObserved[name]) {
                    this.addEdge(obEv);
                } else {
                    oldObserved[name] = null;
                }
            }
            for (name in oldObserved) {
                obEv = oldObserved[name];
                if (obEv) {
                    this.removeEdge(obEv);
                }
            }
        },
        teardown: function () {
            console.warn('can-observation: call stop instead of teardown');
            return this.stop();
        },
        stop: function () {
            this.bound = false;
            for (var name in this.newObserved) {
                var ob = this.newObserved[name];
                this.removeEdge(ob);
            }
            this.newObserved = {};
        }
    });
    var updateOrder = [], curPrimaryDepth = Infinity, maxPrimaryDepth = 0, currentBatchNum, isUpdating = false;
    var updateUpdateOrder = function (observation) {
        var primaryDepth = observation.getPrimaryDepth();
        if (primaryDepth < curPrimaryDepth) {
            curPrimaryDepth = primaryDepth;
        }
        if (primaryDepth > maxPrimaryDepth) {
            maxPrimaryDepth = primaryDepth;
        }
        var primary = updateOrder[primaryDepth] || (updateOrder[primaryDepth] = []);
        return primary;
    };
    Observation.registerUpdate = function (observation, batchNum) {
        if (observation.needsUpdate) {
            return;
        }
        remaining.updates++;
        observation.needsUpdate = true;
        var objs = updateUpdateOrder(observation);
        objs.push(observation);
    };
    var afterCallbacks = [];
    Observation.updateAndNotify = function (ev, batchNum) {
        currentBatchNum = batchNum;
        if (isUpdating) {
            return;
        }
        isUpdating = true;
        while (true) {
            if (curPrimaryDepth <= maxPrimaryDepth) {
                var primary = updateOrder[curPrimaryDepth];
                var lastUpdate = primary && primary.pop();
                if (lastUpdate) {
                    lastUpdate.update(currentBatchNum);
                } else {
                    curPrimaryDepth++;
                }
            } else {
                updateOrder = [];
                curPrimaryDepth = Infinity;
                maxPrimaryDepth = 0;
                isUpdating = false;
                var afterCB = afterCallbacks;
                afterCallbacks = [];
                afterCB.forEach(function (cb) {
                    cb();
                });
                return;
            }
        }
    };
    canEvent.addEventListener.call(canBatch, 'batchEnd', Observation.updateAndNotify);
    Observation.afterUpdateAndNotify = function (callback) {
        canBatch.after(function () {
            if (isUpdating) {
                afterCallbacks.push(callback);
            } else {
                callback();
            }
        });
    };
    Observation.updateChildrenAndSelf = function (observation) {
        if (observation.needsUpdate) {
            return Observation.unregisterAndUpdate(observation);
        }
        var childHasChanged;
        for (var prop in observation.newObserved) {
            if (observation.newObserved[prop].obj.observation) {
                if (Observation.updateChildrenAndSelf(observation.newObserved[prop].obj.observation)) {
                    childHasChanged = true;
                }
            }
        }
        if (childHasChanged) {
            return observation.update(currentBatchNum);
        }
    };
    Observation.unregisterAndUpdate = function (observation) {
        var primaryDepth = observation.getPrimaryDepth();
        var primary = updateOrder[primaryDepth];
        if (primary) {
            var index = primary.indexOf(observation);
            if (index !== -1) {
                primary.splice(index, 1);
            }
        }
        return observation.update(currentBatchNum);
    };
    Observation.add = function (obj, event) {
        var top = observationStack[observationStack.length - 1];
        if (top && !top.ignore) {
            var evStr = event + '', name = obj._cid + '|' + evStr;
            if (top.traps) {
                top.traps.push({
                    obj: obj,
                    event: evStr,
                    name: name
                });
            } else if (!top.newObserved[name]) {
                top.newObserved[name] = {
                    obj: obj,
                    event: evStr
                };
            }
        }
    };
    Observation.addAll = function (observes) {
        var top = observationStack[observationStack.length - 1];
        if (top) {
            if (top.traps) {
                top.traps.push.apply(top.traps, observes);
            } else {
                for (var i = 0, len = observes.length; i < len; i++) {
                    var trap = observes[i], name = trap.name;
                    if (!top.newObserved[name]) {
                        top.newObserved[name] = trap;
                    }
                }
            }
        }
    };
    Observation.ignore = function (fn) {
        return function () {
            if (observationStack.length) {
                var top = observationStack[observationStack.length - 1];
                top.ignore++;
                var res = fn.apply(this, arguments);
                top.ignore--;
                return res;
            } else {
                return fn.apply(this, arguments);
            }
        };
    };
    Observation.trap = function () {
        if (observationStack.length) {
            var top = observationStack[observationStack.length - 1];
            var oldTraps = top.traps;
            var traps = top.traps = [];
            return function () {
                top.traps = oldTraps;
                return traps;
            };
        } else {
            return function () {
                return [];
            };
        }
    };
    Observation.trapsCount = function () {
        if (observationStack.length) {
            var top = observationStack[observationStack.length - 1];
            return top.traps.length;
        } else {
            return 0;
        }
    };
    Observation.isRecording = function () {
        var len = observationStack.length;
        var last = len && observationStack[len - 1];
        return last && last.ignore === 0 && last;
    };
    module.exports = namespace.Observation = Observation;
});
/*can-observation@3.0.1#reader/reader*/
define('can-observation/reader/reader', function (require, exports, module) {
    var Observation = require('can-observation');
    var assign = require('can-util/js/assign/assign');
    var CID = require('can-util/js/cid/cid');
    var types = require('can-util/js/types/types');
    var dev = require('can-util/js/dev/dev');
    var canEvent = require('can-event');
    var each = require('can-util/js/each/each');
    var observeReader;
    var isAt = function (index, reads) {
        var prevRead = reads[index - 1];
        return prevRead && prevRead.at;
    };
    var readValue = function (value, index, reads, options, state, prev) {
        var usedValueReader;
        do {
            usedValueReader = false;
            for (var i = 0, len = observeReader.valueReaders.length; i < len; i++) {
                if (observeReader.valueReaders[i].test(value, index, reads, options)) {
                    value = observeReader.valueReaders[i].read(value, index, reads, options, state, prev);
                }
            }
        } while (usedValueReader);
        return value;
    };
    var specialRead = {
        index: true,
        key: true,
        event: true,
        element: true,
        viewModel: true
    };
    var checkForObservableAndNotify = function (options, state, getObserves, value, index) {
        if (options.foundObservable && !state.foundObservable) {
            if (Observation.trapsCount()) {
                Observation.addAll(getObserves());
                options.foundObservable(value, index);
                state.foundObservable = true;
            }
        }
    };
    observeReader = {
        read: function (parent, reads, options) {
            options = options || {};
            var state = { foundObservable: false };
            var getObserves;
            if (options.foundObservable) {
                getObserves = Observation.trap();
            }
            var cur = readValue(parent, 0, reads, options, state), type, prev, readLength = reads.length, i = 0, last;
            checkForObservableAndNotify(options, state, getObserves, parent, 0);
            while (i < readLength) {
                prev = cur;
                for (var r = 0, readersLength = observeReader.propertyReaders.length; r < readersLength; r++) {
                    var reader = observeReader.propertyReaders[r];
                    if (reader.test(cur)) {
                        cur = reader.read(cur, reads[i], i, options, state);
                        break;
                    }
                }
                checkForObservableAndNotify(options, state, getObserves, prev, i);
                last = cur;
                i = i + 1;
                cur = readValue(cur, i, reads, options, state, prev);
                checkForObservableAndNotify(options, state, getObserves, prev, i - 1);
                type = typeof cur;
                if (i < reads.length && (cur === null || type !== 'function' && type !== 'object')) {
                    if (options.earlyExit) {
                        options.earlyExit(prev, i - 1, cur);
                    }
                    return {
                        value: undefined,
                        parent: prev
                    };
                }
            }
            if (cur === undefined) {
                if (options.earlyExit) {
                    options.earlyExit(prev, i - 1);
                }
            }
            return {
                value: cur,
                parent: prev
            };
        },
        get: function (parent, reads, options) {
            return observeReader.read(parent, observeReader.reads(reads), options || {}).value;
        },
        valueReadersMap: {},
        valueReaders: [
            {
                name: 'function',
                test: function (value, i, reads, options) {
                    return types.isCallableForValue(value) && !types.isCompute(value);
                },
                read: function (value, i, reads, options, state, prev) {
                    if (isAt(i, reads)) {
                        return i === reads.length ? value.bind(prev) : value;
                    } else if (options.callMethodsOnObservables && types.isMapLike(prev)) {
                        return value.apply(prev, options.args || []);
                    } else if (options.isArgument && i === reads.length) {
                        return options.proxyMethods !== false ? value.bind(prev) : value;
                    }
                    return value.apply(prev, options.args || []);
                }
            },
            {
                name: 'compute',
                test: function (value, i, reads, options) {
                    return types.isCompute(value) && !isAt(i, reads);
                },
                read: function (value, i, reads, options, state) {
                    if (options.readCompute === false && i === reads.length) {
                        return value;
                    }
                    return value.get ? value.get() : value();
                },
                write: function (base, newVal) {
                    if (base.set) {
                        base.set(newVal);
                    } else {
                        base(newVal);
                    }
                }
            }
        ],
        propertyReadersMap: {},
        propertyReaders: [
            {
                name: 'map',
                test: function () {
                    return types.isMapLike.apply(this, arguments) || types.isListLike.apply(this, arguments);
                },
                read: function (value, prop, index, options, state) {
                    var res = value['get' in value ? 'get' : 'attr'](prop.key);
                    if (res !== undefined) {
                        return res;
                    } else {
                        return value[prop.key];
                    }
                },
                write: function (base, prop, newVal) {
                    if (typeof base.set === 'function') {
                        base.set(prop, newVal);
                    } else {
                        base.attr(prop, newVal);
                    }
                }
            },
            {
                name: 'promise',
                test: function (value) {
                    return types.isPromise(value);
                },
                read: function (value, prop, index, options, state) {
                    var observeData = value.__observeData;
                    if (!value.__observeData) {
                        observeData = value.__observeData = {
                            isPending: true,
                            state: 'pending',
                            isResolved: false,
                            isRejected: false,
                            value: undefined,
                            reason: undefined
                        };
                        CID(observeData);
                        assign(observeData, canEvent);
                        value.then(function (value) {
                            observeData.isPending = false;
                            observeData.isResolved = true;
                            observeData.value = value;
                            observeData.state = 'resolved';
                            observeData.dispatch('state', [
                                'resolved',
                                'pending'
                            ]);
                        }, function (reason) {
                            observeData.isPending = false;
                            observeData.isRejected = true;
                            observeData.reason = reason;
                            observeData.state = 'rejected';
                            observeData.dispatch('state', [
                                'rejected',
                                'pending'
                            ]);
                        });
                    }
                    Observation.add(observeData, 'state');
                    return prop.key in observeData ? observeData[prop.key] : value[prop.key];
                }
            },
            {
                name: 'object',
                test: function () {
                    return true;
                },
                read: function (value, prop) {
                    if (value == null) {
                        return undefined;
                    } else {
                        if (typeof value === 'object') {
                            if (prop.key in value) {
                                return value[prop.key];
                            } else if (prop.at && specialRead[prop.key] && '@' + prop.key in value) {
                                return value['@' + prop.key];
                            }
                        } else {
                            return value[prop.key];
                        }
                    }
                },
                write: function (base, prop, newVal) {
                    base[prop] = newVal;
                }
            }
        ],
        reads: function (key) {
            var keys = [];
            var last = 0;
            var at = false;
            if (key.charAt(0) === '@') {
                last = 1;
                at = true;
            }
            var keyToAdd = '';
            for (var i = last; i < key.length; i++) {
                var character = key.charAt(i);
                if (character === '.' || character === '@') {
                    if (key.charAt(i - 1) !== '\\') {
                        keys.push({
                            key: keyToAdd,
                            at: at
                        });
                        at = character === '@';
                        keyToAdd = '';
                    } else {
                        keyToAdd = keyToAdd.substr(0, keyToAdd.length - 1) + '.';
                    }
                } else {
                    keyToAdd += character;
                }
            }
            keys.push({
                key: keyToAdd,
                at: at
            });
            return keys;
        },
        write: function (parent, key, value, options) {
            var keys = typeof key === 'string' ? observeReader.reads(key) : key;
            var last;
            if (keys.length > 1) {
                last = keys.pop();
                parent = observeReader.read(parent, keys, options).value;
                keys.push(last);
            } else {
                last = keys[0];
            }
            if (observeReader.valueReadersMap.compute.test(parent[last.key], keys.length - 1, keys, options)) {
                observeReader.valueReadersMap.compute.write(parent[last.key], value, options);
            } else {
                if (observeReader.valueReadersMap.compute.test(parent, keys.length - 1, keys, options)) {
                    parent = parent();
                }
                if (observeReader.propertyReadersMap.map.test(parent)) {
                    observeReader.propertyReadersMap.map.write(parent, last.key, value, options);
                } else if (observeReader.propertyReadersMap.object.test(parent)) {
                    observeReader.propertyReadersMap.object.write(parent, last.key, value, options);
                }
            }
        }
    };
    each(observeReader.propertyReaders, function (reader) {
        observeReader.propertyReadersMap[reader.name] = reader;
    });
    each(observeReader.valueReaders, function (reader) {
        observeReader.valueReadersMap[reader.name] = reader;
    });
    observeReader.set = observeReader.write;
    module.exports = observeReader;
});
/*can-util@3.0.1#js/is-container/is-container*/
define('can-util/js/is-container/is-container', function (require, exports, module) {
    module.exports = function (current) {
        return /^f|^o/.test(typeof current);
    };
});
/*can-util@3.0.1#js/get/get*/
define('can-util/js/get/get', function (require, exports, module) {
    var isContainer = require('can-util/js/is-container/is-container');
    function get(obj, name) {
        var parts = typeof name !== 'undefined' ? (name + '').replace(/\[/g, '.').replace(/]/g, '').split('.') : [], length = parts.length, current, i, container;
        if (!length) {
            return obj;
        }
        current = obj;
        for (i = 0; i < length && isContainer(current); i++) {
            container = current;
            current = container[parts[i]];
        }
        return current;
    }
    module.exports = get;
});
/*can-compute@3.0.1#proto-compute*/
define('can-compute/proto-compute', function (require, exports, module) {
    var Observation = require('can-observation');
    var canEvent = require('can-event');
    var eventLifecycle = require('can-event/lifecycle/lifecycle');
    require('can-event/batch/batch');
    var observeReader = require('can-observation/reader/reader');
    var getObject = require('can-util/js/get/get');
    var CID = require('can-util/js/cid/cid');
    var assign = require('can-util/js/assign/assign');
    var types = require('can-util/js/types/types');
    var isEmptyObject = require('can-util/js/is-empty-object/is-empty-object');
    var Compute = function (getterSetter, context, eventName, bindOnce) {
        CID(this, 'compute');
        var args = [];
        for (var i = 0, arglen = arguments.length; i < arglen; i++) {
            args[i] = arguments[i];
        }
        var contextType = typeof args[1];
        if (typeof args[0] === 'function') {
            this._setupGetterSetterFn(args[0], args[1], args[2], args[3]);
        } else if (args[1] !== undefined) {
            if (contextType === 'string' || contextType === 'number') {
                var isListLike = types.isListLike(args[0]);
                if (types.isMapLike(args[0]) || isListLike) {
                    var map = args[0];
                    var propertyName = args[1];
                    var mapGetterSetter = function (newValue) {
                        if (arguments.length) {
                            observeReader.set(map, propertyName, newValue);
                        } else {
                            if (isListLike) {
                                observeReader.get(map, 'length');
                            }
                            return observeReader.get(map, '' + propertyName);
                        }
                    };
                    this._setupGetterSetterFn(mapGetterSetter, args[1], args[2], args[3]);
                } else {
                    this._setupProperty(args[0], args[1], args[2]);
                }
            } else if (contextType === 'function') {
                this._setupSetter(args[0], args[1], args[2]);
            } else {
                if (args[1] && args[1].fn) {
                    this._setupAsyncCompute(args[0], args[1]);
                } else {
                    this._setupSettings(args[0], args[1]);
                }
            }
        } else {
            this._setupSimpleValue(args[0]);
        }
        this._args = args;
        this._primaryDepth = 0;
        this.isComputed = true;
    };
    var updateOnChange = function (compute, newValue, oldValue, batchNum) {
        var valueChanged = newValue !== oldValue && !(newValue !== newValue && oldValue !== oldValue);
        if (valueChanged) {
            canEvent.dispatch.call(compute, {
                type: 'change',
                batchNum: batchNum
            }, [
                newValue,
                oldValue
            ]);
        }
    };
    var setupComputeHandlers = function (compute, func, context) {
        var observation = new Observation(func, context, compute);
        compute.observation = observation;
        return {
            _on: function () {
                observation.start();
                compute.value = observation.value;
                compute.hasDependencies = !isEmptyObject(observation.newObserved);
            },
            _off: function () {
                observation.stop();
            },
            getDepth: function () {
                return observation.getDepth();
            }
        };
    };
    assign(Compute.prototype, {
        setPrimaryDepth: function (depth) {
            this._primaryDepth = depth;
        },
        _setupGetterSetterFn: function (getterSetter, context, eventName) {
            this._set = context ? getterSetter.bind(context) : getterSetter;
            this._get = context ? getterSetter.bind(context) : getterSetter;
            this._canObserve = eventName === false ? false : true;
            var handlers = setupComputeHandlers(this, getterSetter, context || this);
            assign(this, handlers);
        },
        _setupProperty: function (target, propertyName, eventName) {
            var self = this, handler;
            handler = function () {
                self.updater(self._get(), self.value);
            };
            this._get = function () {
                return getObject(target, propertyName);
            };
            this._set = function (value) {
                var properties = propertyName.split('.'), leafPropertyName = properties.pop(), targetProperty = getObject(target, properties.join('.'));
                targetProperty[leafPropertyName] = value;
            };
            this._on = function (update) {
                canEvent.on.call(target, eventName || propertyName, handler);
                this.value = this._get();
            };
            this._off = function () {
                return canEvent.off.call(target, eventName || propertyName, handler);
            };
        },
        _setupSetter: function (initialValue, setter, eventName) {
            this.value = initialValue;
            this._set = setter;
            assign(this, eventName);
        },
        _setupSettings: function (initialValue, settings) {
            this.value = initialValue;
            this._set = settings.set || this._set;
            this._get = settings.get || this._get;
            if (!settings.__selfUpdater) {
                var self = this, oldUpdater = this.updater;
                this.updater = function () {
                    oldUpdater.call(self, self._get(), self.value);
                };
            }
            this._on = settings.on ? settings.on : this._on;
            this._off = settings.off ? settings.off : this._off;
        },
        _setupAsyncCompute: function (initialValue, settings) {
            var self = this;
            var getter = settings.fn;
            var bindings;
            this.value = initialValue;
            this._setUpdates = true;
            this.lastSetValue = new Compute(initialValue);
            this._set = function (newVal) {
                if (newVal === self.lastSetValue.get()) {
                    return this.value;
                }
                return self.lastSetValue.set(newVal);
            };
            this._get = function () {
                return getter.call(settings.context, self.lastSetValue.get());
            };
            if (getter.length === 0) {
                bindings = setupComputeHandlers(this, getter, settings.context);
            } else if (getter.length === 1) {
                bindings = setupComputeHandlers(this, function () {
                    return getter.call(settings.context, self.lastSetValue.get());
                }, settings);
            } else {
                var oldUpdater = this.updater, resolve = Observation.ignore(function (newVal) {
                        oldUpdater.call(self, newVal, self.value);
                    });
                this.updater = function (newVal) {
                    oldUpdater.call(self, newVal, self.value);
                };
                bindings = setupComputeHandlers(this, function () {
                    var res = getter.call(settings.context, self.lastSetValue.get(), resolve);
                    return res !== undefined ? res : this.value;
                }, this);
            }
            assign(this, bindings);
        },
        _setupSimpleValue: function (initialValue) {
            this.value = initialValue;
        },
        _eventSetup: Observation.ignore(function () {
            this.bound = true;
            this._on(this.updater);
        }),
        _eventTeardown: function () {
            this._off(this.updater);
            this.bound = false;
        },
        addEventListener: eventLifecycle.addAndSetup,
        removeEventListener: eventLifecycle.removeAndTeardown,
        clone: function (context) {
            if (context && typeof this._args[0] === 'function') {
                this._args[1] = context;
            } else if (context) {
                this._args[2] = context;
            }
            return new Compute(this._args[0], this._args[1], this._args[2], this._args[3]);
        },
        _on: function () {
        },
        _off: function () {
        },
        get: function () {
            var recordingObservation = Observation.isRecording();
            if (recordingObservation && this._canObserve !== false) {
                Observation.add(this, 'change');
                if (!this.bound) {
                    Compute.temporarilyBind(this);
                }
            }
            if (this.bound) {
                if (this.observation) {
                    return this.observation.get();
                } else {
                    return this.value;
                }
            } else {
                return this._get();
            }
        },
        _get: function () {
            return this.value;
        },
        set: function (newVal) {
            var old = this.value;
            var setVal = this._set(newVal, old);
            if (this._setUpdates) {
                return this.value;
            }
            if (this.hasDependencies) {
                return this._get();
            }
            this.updater(setVal === undefined ? this._get() : setVal, old);
            return this.value;
        },
        _set: function (newVal) {
            return this.value = newVal;
        },
        updater: function (newVal, oldVal, batchNum) {
            this.value = newVal;
            if (this.observation) {
                this.observation.value = newVal;
            }
            updateOnChange(this, newVal, oldVal, batchNum);
        },
        toFunction: function () {
            return this._computeFn.bind(this);
        },
        _computeFn: function (newVal) {
            if (arguments.length) {
                return this.set(newVal);
            }
            return this.get();
        }
    });
    Compute.prototype.on = Compute.prototype.bind = Compute.prototype.addEventListener;
    Compute.prototype.off = Compute.prototype.unbind = Compute.prototype.removeEventListener;
    var k = function () {
    };
    var computes;
    var unbindComputes = function () {
        for (var i = 0, len = computes.length; i < len; i++) {
            computes[i].removeEventListener('change', k);
        }
        computes = null;
    };
    Compute.temporarilyBind = function (compute) {
        var computeInstance = compute.computeInstance || compute;
        computeInstance.addEventListener('change', k);
        if (!computes) {
            computes = [];
            setTimeout(unbindComputes, 10);
        }
        computes.push(computeInstance);
    };
    Compute.async = function (initialValue, asyncComputer, context) {
        return new Compute(initialValue, {
            fn: asyncComputer,
            context: context
        });
    };
    Compute.truthy = function (compute) {
        return new Compute(function () {
            var res = compute.get();
            if (typeof res === 'function') {
                res = res.get();
            }
            return !!res;
        });
    };
    module.exports = exports = Compute;
});
/*can-compute@3.0.1#can-compute*/
define('can-compute', function (require, exports, module) {
    require('can-event');
    require('can-event/batch/batch');
    var Compute = require('can-compute/proto-compute');
    var CID = require('can-util/js/cid/cid');
    var namespace = require('can-util/namespace');
    var COMPUTE = function (getterSetter, context, eventName, bindOnce) {
        var internalCompute = new Compute(getterSetter, context, eventName, bindOnce);
        var addEventListener = internalCompute.addEventListener;
        var removeEventListener = internalCompute.removeEventListener;
        var compute = function (val) {
            if (arguments.length) {
                return internalCompute.set(val);
            }
            return internalCompute.get();
        };
        var cid = CID(compute, 'compute');
        var handlerKey = '__handler' + cid;
        compute.on = compute.bind = compute.addEventListener = function (ev, handler) {
            var computeHandler = handler && handler[handlerKey];
            if (handler && !computeHandler) {
                computeHandler = handler[handlerKey] = function () {
                    handler.apply(compute, arguments);
                };
            }
            return addEventListener.call(internalCompute, ev, computeHandler);
        };
        compute.off = compute.unbind = compute.removeEventListener = function (ev, handler) {
            var computeHandler = handler && handler[handlerKey];
            if (computeHandler) {
                delete handler[handlerKey];
                return internalCompute.removeEventListener(ev, computeHandler);
            }
            return removeEventListener.apply(internalCompute, arguments);
        };
        compute.isComputed = internalCompute.isComputed;
        compute.clone = function (ctx) {
            if (typeof getterSetter === 'function') {
                context = ctx;
            }
            return COMPUTE(getterSetter, context, ctx, bindOnce);
        };
        compute.computeInstance = internalCompute;
        return compute;
    };
    COMPUTE.truthy = function (compute) {
        return COMPUTE(function () {
            var res = compute();
            if (typeof res === 'function') {
                res = res();
            }
            return !!res;
        });
    };
    COMPUTE.async = function (initialValue, asyncComputer, context) {
        return COMPUTE(initialValue, {
            fn: asyncComputer,
            context: context
        });
    };
    COMPUTE.temporarilyBind = Compute.temporarilyBind;
    module.exports = namespace.compute = COMPUTE;
});
/*can-util@3.0.1#js/is-plain-object/is-plain-object*/
define('can-util/js/is-plain-object/is-plain-object', function (require, exports, module) {
    var core_hasOwn = Object.prototype.hasOwnProperty;
    function isWindow(obj) {
        return obj !== null && obj == obj.window;
    }
    function isPlainObject(obj) {
        if (!obj || typeof obj !== 'object' || obj.nodeType || isWindow(obj)) {
            return false;
        }
        try {
            if (obj.constructor && !core_hasOwn.call(obj, 'constructor') && !core_hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
                return false;
            }
        } catch (e) {
            return false;
        }
        var key;
        for (key in obj) {
        }
        return key === undefined || core_hasOwn.call(obj, key);
    }
    module.exports = isPlainObject;
});
/*can-util@3.0.1#js/is-array/is-array*/
define('can-util/js/is-array/is-array', function (require, exports, module) {
    module.exports = function (arr) {
        return Array.isArray(arr);
    };
});
/*can-util@3.0.1#js/defaults/defaults*/
define('can-util/js/defaults/defaults', function (require, exports, module) {
    module.exports = function (target) {
        var length = arguments.length;
        for (var i = 1; i < length; i++) {
            for (var prop in arguments[i]) {
                if (target[prop] === undefined) {
                    target[prop] = arguments[i][prop];
                }
            }
        }
        return target;
    };
});
/*can-define@1.0.0#can-define*/
define('can-define', function (require, exports, module) {
    'use strict';
    'format cjs';
    var event = require('can-event');
    var eventLifecycle = require('can-event/lifecycle/lifecycle');
    var canBatch = require('can-event/batch/batch');
    var canEvent = require('can-event');
    var compute = require('can-compute');
    var Observation = require('can-observation');
    var isEmptyObject = require('can-util/js/is-empty-object/is-empty-object');
    var assign = require('can-util/js/assign/assign');
    var dev = require('can-util/js/dev/dev');
    var CID = require('can-util/js/cid/cid');
    var isPlainObject = require('can-util/js/is-plain-object/is-plain-object');
    var isArray = require('can-util/js/is-array/is-array');
    var types = require('can-util/js/types/types');
    var each = require('can-util/js/each/each');
    var defaults = require('can-util/js/defaults/defaults');
    var ns = require('can-util/namespace');
    var eventsProto, define, make, makeDefinition, replaceWith, getDefinitionsAndMethods, isDefineType, getDefinitionOrMethod;
    var defineConfigurableAndNotEnumerable = function (obj, prop, value) {
        Object.defineProperty(obj, prop, {
            configurable: true,
            enumerable: false,
            writable: true,
            value: value
        });
    };
    var eachPropertyDescriptor = function (map, cb) {
        for (var prop in map) {
            if (map.hasOwnProperty(prop)) {
                cb(prop, Object.getOwnPropertyDescriptor(map, prop));
            }
        }
    };
    module.exports = define = ns.define = function (objPrototype, defines, baseDefine) {
        var dataInitializers = Object.create(baseDefine ? baseDefine.dataInitializers : null), computedInitializers = Object.create(baseDefine ? baseDefine.computedInitializers : null);
        var result = getDefinitionsAndMethods(defines, baseDefine);
        result.dataInitializers = dataInitializers;
        result.computedInitializers = computedInitializers;
        each(result.definitions, function (definition, property) {
            define.property(objPrototype, property, definition, dataInitializers, computedInitializers);
        });
        replaceWith(objPrototype, '_data', function () {
            var map = this;
            var data = {};
            for (var prop in dataInitializers) {
                replaceWith(data, prop, dataInitializers[prop].bind(map), true);
            }
            return data;
        });
        replaceWith(objPrototype, '_computed', function () {
            var map = this;
            var data = {};
            for (var prop in computedInitializers) {
                replaceWith(data, prop, computedInitializers[prop].bind(map));
            }
            return data;
        });
        for (var prop in eventsProto) {
            Object.defineProperty(objPrototype, prop, {
                enumerable: false,
                value: eventsProto[prop],
                configurable: true,
                writable: true
            });
        }
        Object.defineProperty(objPrototype, '_define', {
            enumerable: false,
            value: result,
            configurable: true,
            writable: true
        });
        if (!objPrototype[types.iterator]) {
            defineConfigurableAndNotEnumerable(objPrototype, types.iterator, function () {
                return new define.Iterator(this);
            });
        }
        return result;
    };
    define.extensions = function () {
    };
    define.property = function (objPrototype, prop, definition, dataInitializers, computedInitializers) {
        var propertyDefinition = define.extensions.apply(this, arguments);
        if (propertyDefinition) {
            definition = propertyDefinition;
        }
        var type = definition.type;
        delete definition.type;
        if (type && isEmptyObject(definition) && type === define.types['*']) {
            definition.type = type;
            Object.defineProperty(objPrototype, prop, {
                get: make.get.data(prop),
                set: make.set.events(prop, make.get.data(prop), make.set.data(prop), make.eventType.data(prop)),
                enumerable: true
            });
            return;
        }
        definition.type = type;
        var dataProperty = definition.get ? 'computed' : 'data', reader = make.read[dataProperty](prop), getter = make.get[dataProperty](prop), setter = make.set[dataProperty](prop), getInitialValue;
        var typeConvert = function (val) {
            return val;
        };
        if (definition.Type) {
            typeConvert = make.set.Type(prop, definition.Type, typeConvert);
        }
        if (type) {
            typeConvert = make.set.type(prop, type, typeConvert);
        }
        if (definition.value !== undefined || definition.Value !== undefined) {
            getInitialValue = make.get.defaultValue(prop, definition, typeConvert);
        }
        if (definition.get) {
            computedInitializers[prop] = make.compute(prop, definition.get, getInitialValue);
        } else if (getInitialValue) {
            dataInitializers[prop] = getInitialValue;
        }
        if (definition.get && definition.set) {
            setter = make.set.setter(prop, definition.set, make.read.lastSet(prop), setter, true);
        } else if (definition.set) {
            setter = make.set.events(prop, reader, setter, make.eventType[dataProperty](prop));
            setter = make.set.setter(prop, definition.set, reader, setter, false);
        } else if (!definition.get) {
            setter = make.set.events(prop, reader, setter, make.eventType[dataProperty](prop));
        }
        if (type) {
            setter = make.set.type(prop, type, setter);
        }
        if (definition.Type) {
            setter = make.set.Type(prop, definition.Type, setter);
        }
        Object.defineProperty(objPrototype, prop, {
            get: getter,
            set: setter,
            enumerable: 'serialize' in definition ? !!definition.serialize : !definition.get
        });
    };
    define.Constructor = function (defines) {
        var constructor = function (props) {
            define.setup.call(this, props);
        };
        define(constructor.prototype, defines);
        return constructor;
    };
    make = {
        compute: function (prop, get, defaultValueFn) {
            return function () {
                var map = this, defaultValue = defaultValueFn && defaultValueFn.call(this), computeFn;
                if (defaultValue) {
                    computeFn = defaultValue.isComputed ? defaultValue : compute.async(defaultValue, get, map);
                } else {
                    computeFn = compute.async(defaultValue, get, map);
                }
                return {
                    compute: computeFn,
                    count: 0,
                    handler: function (ev, newVal, oldVal) {
                        canEvent.dispatch.call(map, {
                            type: prop,
                            target: map
                        }, [
                            newVal,
                            oldVal
                        ]);
                    }
                };
            };
        },
        set: {
            data: function (prop) {
                return function (newVal) {
                    this._data[prop] = newVal;
                };
            },
            computed: function (prop) {
                return function (val) {
                    this._computed[prop].compute(val);
                };
            },
            events: function (prop, getCurrent, setData, eventType) {
                return function (newVal) {
                    var current = getCurrent.call(this);
                    if (newVal !== current) {
                        setData.call(this, newVal);
                        canEvent.dispatch.call(this, {
                            type: prop,
                            target: this
                        }, [
                            newVal,
                            current
                        ]);
                    }
                };
            },
            setter: function (prop, setter, getCurrent, setEvents, hasGetter) {
                return function (value) {
                    var self = this;
                    canBatch.start();
                    var setterCalled = false, current = getCurrent.call(this), setValue = setter.call(this, value, function (value) {
                            setEvents.call(self, value);
                            setterCalled = true;
                        }, current);
                    if (setterCalled) {
                        canBatch.stop();
                    } else {
                        if (hasGetter) {
                            if (setValue !== undefined) {
                                if (current !== setValue) {
                                    setEvents.call(this, setValue);
                                }
                                canBatch.stop();
                            } else if (setter.length === 0) {
                                setEvents.call(this, value);
                                canBatch.stop();
                                return;
                            } else if (setter.length === 1) {
                                canBatch.stop();
                            } else {
                                canBatch.stop();
                                return;
                            }
                        } else {
                            if (setValue !== undefined) {
                                setEvents.call(this, setValue);
                                canBatch.stop();
                            } else if (setter.length === 0) {
                                setEvents.call(this, value);
                                canBatch.stop();
                                return;
                            } else if (setter.length === 1) {
                                setEvents.call(this, undefined);
                                canBatch.stop();
                            } else {
                                canBatch.stop();
                                return;
                            }
                        }
                    }
                };
            },
            type: function (prop, type, set) {
                if (typeof type === 'object') {
                    return make.set.Type(prop, type, set);
                } else {
                    return function (newValue) {
                        return set.call(this, type.call(this, newValue, prop));
                    };
                }
            },
            Type: function (prop, Type, set) {
                if (isArray(Type) && types.DefineList) {
                    Type = types.DefineList.extend({ '#': Type[0] });
                } else if (typeof Type === 'object') {
                    if (types.DefineMap) {
                        Type = types.DefineMap.extend(Type);
                    } else {
                        Type = define.constructor(Type);
                    }
                }
                return function (newValue) {
                    if (newValue instanceof Type || newValue == null) {
                        return set.call(this, newValue);
                    } else {
                        return set.call(this, new Type(newValue));
                    }
                };
            }
        },
        eventType: {
            data: function (prop) {
                return function (newVal, oldVal) {
                    return oldVal !== undefined || this._data.hasOwnProperty(prop) ? 'set' : 'add';
                };
            },
            computed: function () {
                return function () {
                    return 'set';
                };
            }
        },
        read: {
            data: function (prop) {
                return function () {
                    return this._data[prop];
                };
            },
            computed: function (prop) {
                return function () {
                    return this._computed[prop].compute();
                };
            },
            lastSet: function (prop) {
                return function () {
                    var lastSetValue = this._computed[prop].compute.computeInstance.lastSetValue;
                    return lastSetValue && lastSetValue.get();
                };
            }
        },
        get: {
            defaultValue: function (prop, definition, typeConvert) {
                return function () {
                    var value = definition.value;
                    if (value !== undefined) {
                        if (typeof value === 'function') {
                            value = value.call(this);
                        }
                        return typeConvert(value);
                    }
                    var Value = definition.Value;
                    if (Value) {
                        return typeConvert(new Value());
                    }
                };
            },
            data: function (prop) {
                return function () {
                    Observation.add(this, prop);
                    return this._data[prop];
                };
            },
            computed: function (prop) {
                return function () {
                    return this._computed[prop].compute();
                };
            }
        }
    };
    define.behaviors = [
        'get',
        'set',
        'value',
        'Value',
        'type',
        'Type',
        'serialize'
    ];
    var addDefinition = function (definition, behavior, value) {
        if (behavior === 'type') {
            var behaviorDef = value;
            if (typeof behaviorDef === 'string') {
                behaviorDef = define.types[behaviorDef];
                if (typeof behaviorDef === 'object') {
                    assign(definition, behaviorDef);
                    behaviorDef = behaviorDef[behavior];
                }
            }
            definition[behavior] = behaviorDef;
        } else {
            definition[behavior] = value;
        }
    };
    makeDefinition = function (prop, def, defaultDefinition) {
        var definition = {};
        each(def, function (value, behavior) {
            addDefinition(definition, behavior, value);
        });
        each(defaultDefinition, function (value, prop) {
            if (definition[prop] === undefined) {
                if (prop !== 'type' && prop !== 'Type') {
                    definition[prop] = value;
                }
            }
        });
        if (!definition.type && !definition.Type) {
            defaults(definition, defaultDefinition);
        }
        if (isEmptyObject(definition)) {
            definition.type = define.types['*'];
        }
        return definition;
    };
    getDefinitionOrMethod = function (prop, value, defaultDefinition) {
        var definition;
        if (typeof value === 'string') {
            definition = { type: value };
        } else if (typeof value === 'function') {
            if (types.isConstructor(value)) {
                definition = { Type: value };
            } else if (isDefineType(value)) {
                definition = { type: value };
            }
        } else if (isArray(value)) {
            definition = { Type: value };
        } else if (isPlainObject(value)) {
            definition = value;
        }
        if (definition) {
            return makeDefinition(prop, definition, defaultDefinition);
        } else {
            return value;
        }
    };
    getDefinitionsAndMethods = function (defines, baseDefines) {
        var definitions = Object.create(baseDefines ? baseDefines.definitions : null);
        var methods = {};
        var defaults = defines['*'], defaultDefinition;
        if (defaults) {
            delete defines['*'];
            defaultDefinition = getDefinitionOrMethod('*', defaults, {});
        } else {
            defaultDefinition = {};
        }
        eachPropertyDescriptor(defines, function (prop, propertyDescriptor) {
            var value;
            if (propertyDescriptor.get || propertyDescriptor.set) {
                value = {
                    get: propertyDescriptor.get,
                    set: propertyDescriptor.set
                };
            } else {
                value = propertyDescriptor.value;
            }
            if (prop === 'constructor') {
                methods[prop] = value;
                return;
            } else {
                var result = getDefinitionOrMethod(prop, value, defaultDefinition);
                if (result && typeof result === 'object') {
                    definitions[prop] = result;
                } else {
                    methods[prop] = result;
                }
            }
        });
        if (defaults) {
            defines['*'] = defaults;
        }
        return {
            definitions: definitions,
            methods: methods,
            defaultDefinition: defaultDefinition
        };
    };
    replaceWith = function (obj, prop, cb, writable) {
        Object.defineProperty(obj, prop, {
            configurable: true,
            get: function () {
                var value = cb.call(this, obj, prop);
                Object.defineProperty(this, prop, {
                    value: value,
                    writable: !!writable
                });
                return value;
            }
        });
    };
    eventsProto = assign({}, event);
    assign(eventsProto, {
        _eventSetup: function () {
        },
        _eventTeardown: function () {
        },
        addEventListener: function (eventName, handler) {
            var computedBinding = this._computed && this._computed[eventName];
            if (computedBinding && computedBinding.compute) {
                if (!computedBinding.count) {
                    computedBinding.count = 1;
                    computedBinding.compute.addEventListener('change', computedBinding.handler);
                } else {
                    computedBinding.count++;
                }
            }
            return eventLifecycle.addAndSetup.apply(this, arguments);
        },
        removeEventListener: function (eventName, handler) {
            var computedBinding = this._computed && this._computed[eventName];
            if (computedBinding) {
                if (computedBinding.count === 1) {
                    computedBinding.count = 0;
                    computedBinding.compute.removeEventListener('change', computedBinding.handler);
                } else {
                    computedBinding.count--;
                }
            }
            return eventLifecycle.removeAndTeardown.apply(this, arguments);
        }
    });
    eventsProto.on = eventsProto.bind = eventsProto.addEventListener;
    eventsProto.off = eventsProto.unbind = eventsProto.removeEventListener;
    delete eventsProto.one;
    define.setup = function (props, sealed) {
        defineConfigurableAndNotEnumerable(this, '_cid');
        defineConfigurableAndNotEnumerable(this, '__bindEvents', {});
        defineConfigurableAndNotEnumerable(this, '_bindings', 0);
        CID(this);
        var definitions = this._define.definitions;
        var instanceDefinitions = {};
        var map = this;
        each(props, function (value, prop) {
            if (definitions[prop]) {
                map[prop] = value;
            } else {
                var def = define.makeSimpleGetterSetter(prop);
                instanceDefinitions[prop] = {};
                Object.defineProperty(map, prop, def);
                map[prop] = define.types.observable(value);
            }
        });
        if (!isEmptyObject(instanceDefinitions)) {
            defineConfigurableAndNotEnumerable(this, '_instanceDefinitions', instanceDefinitions);
        }
    };
    define.replaceWith = replaceWith;
    define.eventsProto = eventsProto;
    define.defineConfigurableAndNotEnumerable = defineConfigurableAndNotEnumerable;
    define.make = make;
    define.getDefinitionOrMethod = getDefinitionOrMethod;
    var simpleGetterSetters = {};
    define.makeSimpleGetterSetter = function (prop) {
        if (!simpleGetterSetters[prop]) {
            var setter = make.set.events(prop, make.get.data(prop), make.set.data(prop), make.eventType.data(prop));
            simpleGetterSetters[prop] = {
                get: make.get.data(prop),
                set: function (newVal) {
                    return setter.call(this, define.types.observable(newVal));
                },
                enumerable: true
            };
        }
        return simpleGetterSetters[prop];
    };
    define.Iterator = function (obj) {
        this.obj = obj;
        this.definitions = Object.keys(obj._define.definitions);
        this.instanceDefinitions = obj._instanceDefinitions ? Object.keys(obj._instanceDefinitions) : Object.keys(obj);
        this.hasGet = typeof obj.get === 'function';
    };
    define.Iterator.prototype.next = function () {
        var key;
        if (this.definitions.length) {
            key = this.definitions.shift();
            var def = this.obj._define.definitions[key];
            if (def.get) {
                return this.next();
            }
        } else if (this.instanceDefinitions.length) {
            key = this.instanceDefinitions.shift();
        } else {
            return {
                value: undefined,
                done: true
            };
        }
        return {
            value: [
                key,
                this.hasGet ? this.obj.get(key) : this.obj[key]
            ],
            done: false
        };
    };
    isDefineType = function (func) {
        return func && func.canDefineType === true;
    };
    define.types = {
        'date': function (str) {
            var type = typeof str;
            if (type === 'string') {
                str = Date.parse(str);
                return isNaN(str) ? null : new Date(str);
            } else if (type === 'number') {
                return new Date(str);
            } else {
                return str;
            }
        },
        'number': function (val) {
            if (val == null) {
                return val;
            }
            return +val;
        },
        'boolean': function (val) {
            if (val == null) {
                return val;
            }
            if (val === 'false' || val === '0' || !val) {
                return false;
            }
            return true;
        },
        'observable': function (newVal) {
            if (isArray(newVal) && types.DefineList) {
                newVal = new types.DefineList(newVal);
            } else if (isPlainObject(newVal) && types.DefineMap) {
                newVal = new types.DefineMap(newVal);
            }
            return newVal;
        },
        'stringOrObservable': function (newVal) {
            if (isArray(newVal)) {
                return new types.DefaultList(newVal);
            } else if (isPlainObject(newVal)) {
                return new types.DefaultMap(newVal);
            } else {
                return define.types.string(newVal);
            }
        },
        'htmlbool': function (val) {
            return typeof val === 'string' || !!val;
        },
        '*': function (val) {
            return val;
        },
        'any': function (val) {
            return val;
        },
        'string': function (val) {
            if (val == null) {
                return val;
            }
            return '' + val;
        },
        'compute': {
            set: function (newValue, setVal, setErr, oldValue) {
                if (newValue && newValue.isComputed) {
                    return newValue;
                }
                if (oldValue && oldValue.isComputed) {
                    oldValue(newValue);
                    return oldValue;
                }
                return newValue;
            },
            get: function (value) {
                return value && value.isComputed ? value() : value;
            }
        }
    };
});
/*kefir@3.6.0#dist/kefir*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define('kefir', ['exports'], factory) : factory(global.Kefir = global.Kefir || {});
}(this, function (exports) {
    'use strict';
    function createObj(proto) {
        var F = function () {
        };
        F.prototype = proto;
        return new F();
    }
    function extend(target) {
        var length = arguments.length, i = void 0, prop = void 0;
        for (i = 1; i < length; i++) {
            for (prop in arguments[i]) {
                target[prop] = arguments[i][prop];
            }
        }
        return target;
    }
    function inherit(Child, Parent) {
        var length = arguments.length, i = void 0;
        Child.prototype = createObj(Parent.prototype);
        Child.prototype.constructor = Child;
        for (i = 2; i < length; i++) {
            extend(Child.prototype, arguments[i]);
        }
        return Child;
    }
    var NOTHING = ['<nothing>'];
    var END = 'end';
    var VALUE = 'value';
    var ERROR = 'error';
    var ANY = 'any';
    function concat(a, b) {
        var result = void 0, length = void 0, i = void 0, j = void 0;
        if (a.length === 0) {
            return b;
        }
        if (b.length === 0) {
            return a;
        }
        j = 0;
        result = new Array(a.length + b.length);
        length = a.length;
        for (i = 0; i < length; i++, j++) {
            result[j] = a[i];
        }
        length = b.length;
        for (i = 0; i < length; i++, j++) {
            result[j] = b[i];
        }
        return result;
    }
    function find(arr, value) {
        var length = arr.length, i = void 0;
        for (i = 0; i < length; i++) {
            if (arr[i] === value) {
                return i;
            }
        }
        return -1;
    }
    function findByPred(arr, pred) {
        var length = arr.length, i = void 0;
        for (i = 0; i < length; i++) {
            if (pred(arr[i])) {
                return i;
            }
        }
        return -1;
    }
    function cloneArray(input) {
        var length = input.length, result = new Array(length), i = void 0;
        for (i = 0; i < length; i++) {
            result[i] = input[i];
        }
        return result;
    }
    function remove(input, index) {
        var length = input.length, result = void 0, i = void 0, j = void 0;
        if (index >= 0 && index < length) {
            if (length === 1) {
                return [];
            } else {
                result = new Array(length - 1);
                for (i = 0, j = 0; i < length; i++) {
                    if (i !== index) {
                        result[j] = input[i];
                        j++;
                    }
                }
                return result;
            }
        } else {
            return input;
        }
    }
    function map(input, fn) {
        var length = input.length, result = new Array(length), i = void 0;
        for (i = 0; i < length; i++) {
            result[i] = fn(input[i]);
        }
        return result;
    }
    function forEach(arr, fn) {
        var length = arr.length, i = void 0;
        for (i = 0; i < length; i++) {
            fn(arr[i]);
        }
    }
    function fillArray(arr, value) {
        var length = arr.length, i = void 0;
        for (i = 0; i < length; i++) {
            arr[i] = value;
        }
    }
    function contains(arr, value) {
        return find(arr, value) !== -1;
    }
    function slide(cur, next, max) {
        var length = Math.min(max, cur.length + 1), offset = cur.length - length + 1, result = new Array(length), i = void 0;
        for (i = offset; i < length; i++) {
            result[i - offset] = cur[i];
        }
        result[length - 1] = next;
        return result;
    }
    function callSubscriber(type, fn, event) {
        if (type === ANY) {
            fn(event);
        } else if (type === event.type) {
            if (type === VALUE || type === ERROR) {
                fn(event.value);
            } else {
                fn();
            }
        }
    }
    function Dispatcher() {
        this._items = [];
        this._spies = [];
        this._inLoop = 0;
        this._removedItems = null;
    }
    extend(Dispatcher.prototype, {
        add: function (type, fn) {
            this._items = concat(this._items, [{
                    type: type,
                    fn: fn
                }]);
            return this._items.length;
        },
        remove: function (type, fn) {
            var index = findByPred(this._items, function (x) {
                return x.type === type && x.fn === fn;
            });
            if (this._inLoop !== 0 && index !== -1) {
                if (this._removedItems === null) {
                    this._removedItems = [];
                }
                this._removedItems.push(this._items[index]);
            }
            this._items = remove(this._items, index);
            return this._items.length;
        },
        addSpy: function (fn) {
            this._spies = concat(this._spies, [fn]);
            return this._spies.length;
        },
        removeSpy: function (fn) {
            this._spies = remove(this._spies, this._spies.indexOf(fn));
            return this._spies.length;
        },
        dispatch: function (event) {
            this._inLoop++;
            for (var i = 0, spies = this._spies; this._spies !== null && i < spies.length; i++) {
                spies[i](event);
            }
            for (var _i = 0, items = this._items; _i < items.length; _i++) {
                if (this._items === null) {
                    break;
                }
                if (this._removedItems !== null && contains(this._removedItems, items[_i])) {
                    continue;
                }
                callSubscriber(items[_i].type, items[_i].fn, event);
            }
            this._inLoop--;
            if (this._inLoop === 0) {
                this._removedItems = null;
            }
        },
        cleanup: function () {
            this._items = null;
            this._spies = null;
        }
    });
    function Observable() {
        this._dispatcher = new Dispatcher();
        this._active = false;
        this._alive = true;
        this._activating = false;
        this._logHandlers = null;
        this._spyHandlers = null;
    }
    extend(Observable.prototype, {
        _name: 'observable',
        _onActivation: function () {
        },
        _onDeactivation: function () {
        },
        _setActive: function (active) {
            if (this._active !== active) {
                this._active = active;
                if (active) {
                    this._activating = true;
                    this._onActivation();
                    this._activating = false;
                } else {
                    this._onDeactivation();
                }
            }
        },
        _clear: function () {
            this._setActive(false);
            this._dispatcher.cleanup();
            this._dispatcher = null;
            this._logHandlers = null;
        },
        _emit: function (type, x) {
            switch (type) {
            case VALUE:
                return this._emitValue(x);
            case ERROR:
                return this._emitError(x);
            case END:
                return this._emitEnd();
            }
        },
        _emitValue: function (value) {
            if (this._alive) {
                this._dispatcher.dispatch({
                    type: VALUE,
                    value: value
                });
            }
        },
        _emitError: function (value) {
            if (this._alive) {
                this._dispatcher.dispatch({
                    type: ERROR,
                    value: value
                });
            }
        },
        _emitEnd: function () {
            if (this._alive) {
                this._alive = false;
                this._dispatcher.dispatch({ type: END });
                this._clear();
            }
        },
        _on: function (type, fn) {
            if (this._alive) {
                this._dispatcher.add(type, fn);
                this._setActive(true);
            } else {
                callSubscriber(type, fn, { type: END });
            }
            return this;
        },
        _off: function (type, fn) {
            if (this._alive) {
                var count = this._dispatcher.remove(type, fn);
                if (count === 0) {
                    this._setActive(false);
                }
            }
            return this;
        },
        onValue: function (fn) {
            return this._on(VALUE, fn);
        },
        onError: function (fn) {
            return this._on(ERROR, fn);
        },
        onEnd: function (fn) {
            return this._on(END, fn);
        },
        onAny: function (fn) {
            return this._on(ANY, fn);
        },
        offValue: function (fn) {
            return this._off(VALUE, fn);
        },
        offError: function (fn) {
            return this._off(ERROR, fn);
        },
        offEnd: function (fn) {
            return this._off(END, fn);
        },
        offAny: function (fn) {
            return this._off(ANY, fn);
        },
        observe: function (observerOrOnValue, onError, onEnd) {
            var _this = this;
            var closed = false;
            var observer = !observerOrOnValue || typeof observerOrOnValue === 'function' ? {
                value: observerOrOnValue,
                error: onError,
                end: onEnd
            } : observerOrOnValue;
            var handler = function (event) {
                if (event.type === END) {
                    closed = true;
                }
                if (event.type === VALUE && observer.value) {
                    observer.value(event.value);
                } else if (event.type === ERROR && observer.error) {
                    observer.error(event.value);
                } else if (event.type === END && observer.end) {
                    observer.end(event.value);
                }
            };
            this.onAny(handler);
            return {
                unsubscribe: function () {
                    if (!closed) {
                        _this.offAny(handler);
                        closed = true;
                    }
                },
                get closed() {
                    return closed;
                }
            };
        },
        _ofSameType: function (A, B) {
            return A.prototype.getType() === this.getType() ? A : B;
        },
        setName: function (sourceObs, selfName) {
            this._name = selfName ? sourceObs._name + '.' + selfName : sourceObs;
            return this;
        },
        log: function () {
            var name = arguments.length <= 0 || arguments[0] === undefined ? this.toString() : arguments[0];
            var isCurrent = void 0;
            var handler = function (event) {
                var type = '<' + event.type + (isCurrent ? ':current' : '') + '>';
                if (event.type === END) {
                    console.log(name, type);
                } else {
                    console.log(name, type, event.value);
                }
            };
            if (this._alive) {
                if (!this._logHandlers) {
                    this._logHandlers = [];
                }
                this._logHandlers.push({
                    name: name,
                    handler: handler
                });
            }
            isCurrent = true;
            this.onAny(handler);
            isCurrent = false;
            return this;
        },
        offLog: function () {
            var name = arguments.length <= 0 || arguments[0] === undefined ? this.toString() : arguments[0];
            if (this._logHandlers) {
                var handlerIndex = findByPred(this._logHandlers, function (obj) {
                    return obj.name === name;
                });
                if (handlerIndex !== -1) {
                    this.offAny(this._logHandlers[handlerIndex].handler);
                    this._logHandlers.splice(handlerIndex, 1);
                }
            }
            return this;
        },
        spy: function () {
            var name = arguments.length <= 0 || arguments[0] === undefined ? this.toString() : arguments[0];
            var handler = function (event) {
                var type = '<' + event.type + '>';
                if (event.type === END) {
                    console.log(name, type);
                } else {
                    console.log(name, type, event.value);
                }
            };
            if (this._alive) {
                if (!this._spyHandlers) {
                    this._spyHandlers = [];
                }
                this._spyHandlers.push({
                    name: name,
                    handler: handler
                });
                this._dispatcher.addSpy(handler);
            }
            return this;
        },
        offSpy: function () {
            var name = arguments.length <= 0 || arguments[0] === undefined ? this.toString() : arguments[0];
            if (this._spyHandlers) {
                var handlerIndex = findByPred(this._spyHandlers, function (obj) {
                    return obj.name === name;
                });
                if (handlerIndex !== -1) {
                    this._dispatcher.removeSpy(this._spyHandlers[handlerIndex].handler);
                    this._spyHandlers.splice(handlerIndex, 1);
                }
            }
            return this;
        }
    });
    Observable.prototype.toString = function () {
        return '[' + this._name + ']';
    };
    function Stream() {
        Observable.call(this);
    }
    inherit(Stream, Observable, {
        _name: 'stream',
        getType: function () {
            return 'stream';
        }
    });
    function Property() {
        Observable.call(this);
        this._currentEvent = null;
    }
    inherit(Property, Observable, {
        _name: 'property',
        _emitValue: function (value) {
            if (this._alive) {
                this._currentEvent = {
                    type: VALUE,
                    value: value
                };
                if (!this._activating) {
                    this._dispatcher.dispatch({
                        type: VALUE,
                        value: value
                    });
                }
            }
        },
        _emitError: function (value) {
            if (this._alive) {
                this._currentEvent = {
                    type: ERROR,
                    value: value
                };
                if (!this._activating) {
                    this._dispatcher.dispatch({
                        type: ERROR,
                        value: value
                    });
                }
            }
        },
        _emitEnd: function () {
            if (this._alive) {
                this._alive = false;
                if (!this._activating) {
                    this._dispatcher.dispatch({ type: END });
                }
                this._clear();
            }
        },
        _on: function (type, fn) {
            if (this._alive) {
                this._dispatcher.add(type, fn);
                this._setActive(true);
            }
            if (this._currentEvent !== null) {
                callSubscriber(type, fn, this._currentEvent);
            }
            if (!this._alive) {
                callSubscriber(type, fn, { type: END });
            }
            return this;
        },
        getType: function () {
            return 'property';
        }
    });
    var neverS = new Stream();
    neverS._emitEnd();
    neverS._name = 'never';
    function never() {
        return neverS;
    }
    function timeBased(mixin) {
        function AnonymousStream(wait, options) {
            var _this = this;
            Stream.call(this);
            this._wait = wait;
            this._intervalId = null;
            this._$onTick = function () {
                return _this._onTick();
            };
            this._init(options);
        }
        inherit(AnonymousStream, Stream, {
            _init: function () {
            },
            _free: function () {
            },
            _onTick: function () {
            },
            _onActivation: function () {
                this._intervalId = setInterval(this._$onTick, this._wait);
            },
            _onDeactivation: function () {
                if (this._intervalId !== null) {
                    clearInterval(this._intervalId);
                    this._intervalId = null;
                }
            },
            _clear: function () {
                Stream.prototype._clear.call(this);
                this._$onTick = null;
                this._free();
            }
        }, mixin);
        return AnonymousStream;
    }
    var S = timeBased({
        _name: 'later',
        _init: function (_ref) {
            var x = _ref.x;
            this._x = x;
        },
        _free: function () {
            this._x = null;
        },
        _onTick: function () {
            this._emitValue(this._x);
            this._emitEnd();
        }
    });
    function later(wait, x) {
        return new S(wait, { x: x });
    }
    var S$1 = timeBased({
        _name: 'interval',
        _init: function (_ref) {
            var x = _ref.x;
            this._x = x;
        },
        _free: function () {
            this._x = null;
        },
        _onTick: function () {
            this._emitValue(this._x);
        }
    });
    function interval(wait, x) {
        return new S$1(wait, { x: x });
    }
    var S$2 = timeBased({
        _name: 'sequentially',
        _init: function (_ref) {
            var xs = _ref.xs;
            this._xs = cloneArray(xs);
        },
        _free: function () {
            this._xs = null;
        },
        _onTick: function () {
            if (this._xs.length === 1) {
                this._emitValue(this._xs[0]);
                this._emitEnd();
            } else {
                this._emitValue(this._xs.shift());
            }
        }
    });
    function sequentially(wait, xs) {
        return xs.length === 0 ? never() : new S$2(wait, { xs: xs });
    }
    var S$3 = timeBased({
        _name: 'fromPoll',
        _init: function (_ref) {
            var fn = _ref.fn;
            this._fn = fn;
        },
        _free: function () {
            this._fn = null;
        },
        _onTick: function () {
            var fn = this._fn;
            this._emitValue(fn());
        }
    });
    function fromPoll(wait, fn) {
        return new S$3(wait, { fn: fn });
    }
    function emitter(obs) {
        function value(x) {
            obs._emitValue(x);
            return obs._active;
        }
        function error(x) {
            obs._emitError(x);
            return obs._active;
        }
        function end() {
            obs._emitEnd();
            return obs._active;
        }
        function event(e) {
            obs._emit(e.type, e.value);
            return obs._active;
        }
        return {
            value: value,
            error: error,
            end: end,
            event: event,
            emit: value,
            emitEvent: event
        };
    }
    var S$4 = timeBased({
        _name: 'withInterval',
        _init: function (_ref) {
            var fn = _ref.fn;
            this._fn = fn;
            this._emitter = emitter(this);
        },
        _free: function () {
            this._fn = null;
            this._emitter = null;
        },
        _onTick: function () {
            var fn = this._fn;
            fn(this._emitter);
        }
    });
    function withInterval(wait, fn) {
        return new S$4(wait, { fn: fn });
    }
    function S$5(fn) {
        Stream.call(this);
        this._fn = fn;
        this._unsubscribe = null;
    }
    inherit(S$5, Stream, {
        _name: 'stream',
        _onActivation: function () {
            var fn = this._fn;
            var unsubscribe = fn(emitter(this));
            this._unsubscribe = typeof unsubscribe === 'function' ? unsubscribe : null;
            if (!this._active) {
                this._callUnsubscribe();
            }
        },
        _callUnsubscribe: function () {
            if (this._unsubscribe !== null) {
                this._unsubscribe();
                this._unsubscribe = null;
            }
        },
        _onDeactivation: function () {
            this._callUnsubscribe();
        },
        _clear: function () {
            Stream.prototype._clear.call(this);
            this._fn = null;
        }
    });
    function stream(fn) {
        return new S$5(fn);
    }
    function fromCallback(callbackConsumer) {
        var called = false;
        return stream(function (emitter) {
            if (!called) {
                callbackConsumer(function (x) {
                    emitter.emit(x);
                    emitter.end();
                });
                called = true;
            }
        }).setName('fromCallback');
    }
    function fromNodeCallback(callbackConsumer) {
        var called = false;
        return stream(function (emitter) {
            if (!called) {
                callbackConsumer(function (error, x) {
                    if (error) {
                        emitter.error(error);
                    } else {
                        emitter.emit(x);
                    }
                    emitter.end();
                });
                called = true;
            }
        }).setName('fromNodeCallback');
    }
    function spread(fn, length) {
        switch (length) {
        case 0:
            return function () {
                return fn();
            };
        case 1:
            return function (a) {
                return fn(a[0]);
            };
        case 2:
            return function (a) {
                return fn(a[0], a[1]);
            };
        case 3:
            return function (a) {
                return fn(a[0], a[1], a[2]);
            };
        case 4:
            return function (a) {
                return fn(a[0], a[1], a[2], a[3]);
            };
        default:
            return function (a) {
                return fn.apply(null, a);
            };
        }
    }
    function apply(fn, c, a) {
        var aLength = a ? a.length : 0;
        if (c == null) {
            switch (aLength) {
            case 0:
                return fn();
            case 1:
                return fn(a[0]);
            case 2:
                return fn(a[0], a[1]);
            case 3:
                return fn(a[0], a[1], a[2]);
            case 4:
                return fn(a[0], a[1], a[2], a[3]);
            default:
                return fn.apply(null, a);
            }
        } else {
            switch (aLength) {
            case 0:
                return fn.call(c);
            default:
                return fn.apply(c, a);
            }
        }
    }
    function fromSubUnsub(sub, unsub, transformer) {
        return stream(function (emitter) {
            var handler = transformer ? function () {
                emitter.emit(apply(transformer, this, arguments));
            } : function (x) {
                emitter.emit(x);
            };
            sub(handler);
            return function () {
                return unsub(handler);
            };
        }).setName('fromSubUnsub');
    }
    var pairs = [
        [
            'addEventListener',
            'removeEventListener'
        ],
        [
            'addListener',
            'removeListener'
        ],
        [
            'on',
            'off'
        ]
    ];
    function fromEvents(target, eventName, transformer) {
        var sub = void 0, unsub = void 0;
        for (var i = 0; i < pairs.length; i++) {
            if (typeof target[pairs[i][0]] === 'function' && typeof target[pairs[i][1]] === 'function') {
                sub = pairs[i][0];
                unsub = pairs[i][1];
                break;
            }
        }
        if (sub === undefined) {
            throw new Error('target don\'t support any of ' + 'addEventListener/removeEventListener, addListener/removeListener, on/off method pair');
        }
        return fromSubUnsub(function (handler) {
            return target[sub](eventName, handler);
        }, function (handler) {
            return target[unsub](eventName, handler);
        }, transformer).setName('fromEvents');
    }
    function P(value) {
        this._currentEvent = {
            type: 'value',
            value: value,
            current: true
        };
    }
    inherit(P, Property, {
        _name: 'constant',
        _active: false,
        _activating: false,
        _alive: false,
        _dispatcher: null,
        _logHandlers: null
    });
    function constant(x) {
        return new P(x);
    }
    function P$1(value) {
        this._currentEvent = {
            type: 'error',
            value: value,
            current: true
        };
    }
    inherit(P$1, Property, {
        _name: 'constantError',
        _active: false,
        _activating: false,
        _alive: false,
        _dispatcher: null,
        _logHandlers: null
    });
    function constantError(x) {
        return new P$1(x);
    }
    function createConstructor(BaseClass, name) {
        return function AnonymousObservable(source, options) {
            var _this = this;
            BaseClass.call(this);
            this._source = source;
            this._name = source._name + '.' + name;
            this._init(options);
            this._$handleAny = function (event) {
                return _this._handleAny(event);
            };
        };
    }
    function createClassMethods(BaseClass) {
        return {
            _init: function () {
            },
            _free: function () {
            },
            _handleValue: function (x) {
                this._emitValue(x);
            },
            _handleError: function (x) {
                this._emitError(x);
            },
            _handleEnd: function () {
                this._emitEnd();
            },
            _handleAny: function (event) {
                switch (event.type) {
                case VALUE:
                    return this._handleValue(event.value);
                case ERROR:
                    return this._handleError(event.value);
                case END:
                    return this._handleEnd();
                }
            },
            _onActivation: function () {
                this._source.onAny(this._$handleAny);
            },
            _onDeactivation: function () {
                this._source.offAny(this._$handleAny);
            },
            _clear: function () {
                BaseClass.prototype._clear.call(this);
                this._source = null;
                this._$handleAny = null;
                this._free();
            }
        };
    }
    function createStream(name, mixin) {
        var S = createConstructor(Stream, name);
        inherit(S, Stream, createClassMethods(Stream), mixin);
        return S;
    }
    function createProperty(name, mixin) {
        var P = createConstructor(Property, name);
        inherit(P, Property, createClassMethods(Property), mixin);
        return P;
    }
    var P$2 = createProperty('toProperty', {
        _init: function (_ref) {
            var fn = _ref.fn;
            this._getInitialCurrent = fn;
        },
        _onActivation: function () {
            if (this._getInitialCurrent !== null) {
                var getInitial = this._getInitialCurrent;
                this._emitValue(getInitial());
            }
            this._source.onAny(this._$handleAny);
        }
    });
    function toProperty(obs) {
        var fn = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
        if (fn !== null && typeof fn !== 'function') {
            throw new Error('You should call toProperty() with a function or no arguments.');
        }
        return new P$2(obs, { fn: fn });
    }
    var S$6 = createStream('changes', {
        _handleValue: function (x) {
            if (!this._activating) {
                this._emitValue(x);
            }
        },
        _handleError: function (x) {
            if (!this._activating) {
                this._emitError(x);
            }
        }
    });
    function changes(obs) {
        return new S$6(obs);
    }
    function fromPromise(promise) {
        var called = false;
        var result = stream(function (emitter) {
            if (!called) {
                var onValue = function (x) {
                    emitter.emit(x);
                    emitter.end();
                };
                var onError = function (x) {
                    emitter.error(x);
                    emitter.end();
                };
                var _promise = promise.then(onValue, onError);
                if (_promise && typeof _promise.done === 'function') {
                    _promise.done();
                }
                called = true;
            }
        });
        return toProperty(result, null).setName('fromPromise');
    }
    function getGlodalPromise() {
        if (typeof Promise === 'function') {
            return Promise;
        } else {
            throw new Error('There isn\'t default Promise, use shim or parameter');
        }
    }
    function toPromise(obs) {
        var Promise = arguments.length <= 1 || arguments[1] === undefined ? getGlodalPromise() : arguments[1];
        var last = null;
        return new Promise(function (resolve, reject) {
            obs.onAny(function (event) {
                if (event.type === END && last !== null) {
                    (last.type === VALUE ? resolve : reject)(last.value);
                    last = null;
                } else {
                    last = event;
                }
            });
        });
    }
    var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};
    function createCommonjsModule(fn, module) {
        return module = { exports: {} }, fn(module, module.exports), module.exports;
    }
    var ponyfill = createCommonjsModule(function (module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: true });
        exports['default'] = symbolObservablePonyfill;
        function symbolObservablePonyfill(root) {
            var result;
            var _Symbol = root.Symbol;
            if (typeof _Symbol === 'function') {
                if (_Symbol.observable) {
                    result = _Symbol.observable;
                } else {
                    result = _Symbol('observable');
                    _Symbol.observable = result;
                }
            } else {
                result = '@@observable';
            }
            return result;
        }
        ;
    });
    var require$$0$1 = ponyfill && typeof ponyfill === 'object' && 'default' in ponyfill ? ponyfill['default'] : ponyfill;
    var index$1 = createCommonjsModule(function (module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: true });
        var _ponyfill = require$$0$1;
        var _ponyfill2 = _interopRequireDefault(_ponyfill);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { 'default': obj };
        }
        var root = undefined;
        if (typeof commonjsGlobal !== 'undefined') {
            root = commonjsGlobal;
        } else if (typeof window !== 'undefined') {
            root = window;
        }
        var result = (0, _ponyfill2['default'])(root);
        exports['default'] = result;
    });
    var require$$0 = index$1 && typeof index$1 === 'object' && 'default' in index$1 ? index$1['default'] : index$1;
    var index = createCommonjsModule(function (module) {
        module.exports = require$$0;
    });
    var $$observable = index && typeof index === 'object' && 'default' in index ? index['default'] : index;
    function fromESObservable(_observable) {
        var observable = _observable[$$observable] ? _observable[$$observable]() : _observable;
        return stream(function (emitter) {
            var unsub = observable.subscribe({
                error: function (error) {
                    emitter.error(error);
                    emitter.end();
                },
                next: function (value) {
                    emitter.emit(value);
                },
                complete: function () {
                    emitter.end();
                }
            });
            if (unsub.unsubscribe) {
                return function () {
                    unsub.unsubscribe();
                };
            } else {
                return unsub;
            }
        }).setName('fromESObservable');
    }
    function ESObservable(observable) {
        this._observable = observable.takeErrors(1);
    }
    extend(ESObservable.prototype, {
        subscribe: function (observerOrOnNext, onError, onComplete) {
            var _this = this;
            var observer = typeof observerOrOnNext === 'function' ? {
                next: observerOrOnNext,
                error: onError,
                complete: onComplete
            } : observerOrOnNext;
            var fn = function (event) {
                if (event.type === END) {
                    closed = true;
                }
                if (event.type === VALUE && observer.next) {
                    observer.next(event.value);
                } else if (event.type === ERROR && observer.error) {
                    observer.error(event.value);
                } else if (event.type === END && observer.complete) {
                    observer.complete(event.value);
                }
            };
            this._observable.onAny(fn);
            var closed = false;
            var subscription = {
                unsubscribe: function () {
                    closed = true;
                    _this._observable.offAny(fn);
                },
                get closed() {
                    return closed;
                }
            };
            return subscription;
        }
    });
    ESObservable.prototype[$$observable] = function () {
        return this;
    };
    function toESObservable() {
        return new ESObservable(this);
    }
    function defaultErrorsCombinator(errors) {
        var latestError = void 0;
        for (var i = 0; i < errors.length; i++) {
            if (errors[i] !== undefined) {
                if (latestError === undefined || latestError.index < errors[i].index) {
                    latestError = errors[i];
                }
            }
        }
        return latestError.error;
    }
    function Combine(active, passive, combinator) {
        var _this = this;
        Stream.call(this);
        this._activeCount = active.length;
        this._sources = concat(active, passive);
        this._combinator = combinator ? spread(combinator, this._sources.length) : function (x) {
            return x;
        };
        this._aliveCount = 0;
        this._latestValues = new Array(this._sources.length);
        this._latestErrors = new Array(this._sources.length);
        fillArray(this._latestValues, NOTHING);
        this._emitAfterActivation = false;
        this._endAfterActivation = false;
        this._latestErrorIndex = 0;
        this._$handlers = [];
        var _loop = function (i) {
            _this._$handlers.push(function (event) {
                return _this._handleAny(i, event);
            });
        };
        for (var i = 0; i < this._sources.length; i++) {
            _loop(i);
        }
    }
    inherit(Combine, Stream, {
        _name: 'combine',
        _onActivation: function () {
            this._aliveCount = this._activeCount;
            for (var i = this._activeCount; i < this._sources.length; i++) {
                this._sources[i].onAny(this._$handlers[i]);
            }
            for (var _i = 0; _i < this._activeCount; _i++) {
                this._sources[_i].onAny(this._$handlers[_i]);
            }
            if (this._emitAfterActivation) {
                this._emitAfterActivation = false;
                this._emitIfFull();
            }
            if (this._endAfterActivation) {
                this._emitEnd();
            }
        },
        _onDeactivation: function () {
            var length = this._sources.length, i = void 0;
            for (i = 0; i < length; i++) {
                this._sources[i].offAny(this._$handlers[i]);
            }
        },
        _emitIfFull: function () {
            var hasAllValues = true;
            var hasErrors = false;
            var length = this._latestValues.length;
            var valuesCopy = new Array(length);
            var errorsCopy = new Array(length);
            for (var i = 0; i < length; i++) {
                valuesCopy[i] = this._latestValues[i];
                errorsCopy[i] = this._latestErrors[i];
                if (valuesCopy[i] === NOTHING) {
                    hasAllValues = false;
                }
                if (errorsCopy[i] !== undefined) {
                    hasErrors = true;
                }
            }
            if (hasAllValues) {
                var combinator = this._combinator;
                this._emitValue(combinator(valuesCopy));
            }
            if (hasErrors) {
                this._emitError(defaultErrorsCombinator(errorsCopy));
            }
        },
        _handleAny: function (i, event) {
            if (event.type === VALUE || event.type === ERROR) {
                if (event.type === VALUE) {
                    this._latestValues[i] = event.value;
                    this._latestErrors[i] = undefined;
                }
                if (event.type === ERROR) {
                    this._latestValues[i] = NOTHING;
                    this._latestErrors[i] = {
                        index: this._latestErrorIndex++,
                        error: event.value
                    };
                }
                if (i < this._activeCount) {
                    if (this._activating) {
                        this._emitAfterActivation = true;
                    } else {
                        this._emitIfFull();
                    }
                }
            } else {
                if (i < this._activeCount) {
                    this._aliveCount--;
                    if (this._aliveCount === 0) {
                        if (this._activating) {
                            this._endAfterActivation = true;
                        } else {
                            this._emitEnd();
                        }
                    }
                }
            }
        },
        _clear: function () {
            Stream.prototype._clear.call(this);
            this._sources = null;
            this._latestValues = null;
            this._latestErrors = null;
            this._combinator = null;
            this._$handlers = null;
        }
    });
    function combine(active) {
        var passive = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
        var combinator = arguments[2];
        if (typeof passive === 'function') {
            combinator = passive;
            passive = [];
        }
        return active.length === 0 ? never() : new Combine(active, passive, combinator);
    }
    var Observable$1 = {
        empty: function () {
            return never();
        },
        concat: function (a, b) {
            return a.merge(b);
        },
        of: function (x) {
            return constant(x);
        },
        map: function (fn, obs) {
            return obs.map(fn);
        },
        bimap: function (fnErr, fnVal, obs) {
            return obs.mapErrors(fnErr).map(fnVal);
        },
        ap: function (obsFn, obsVal) {
            return combine([
                obsFn,
                obsVal
            ], function (fn, val) {
                return fn(val);
            });
        },
        chain: function (fn, obs) {
            return obs.flatMap(fn);
        }
    };
    var staticLand = Object.freeze({ Observable: Observable$1 });
    var mixin = {
        _init: function (_ref) {
            var fn = _ref.fn;
            this._fn = fn;
        },
        _free: function () {
            this._fn = null;
        },
        _handleValue: function (x) {
            var fn = this._fn;
            this._emitValue(fn(x));
        }
    };
    var S$7 = createStream('map', mixin);
    var P$3 = createProperty('map', mixin);
    var id = function (x) {
        return x;
    };
    function map$1(obs) {
        var fn = arguments.length <= 1 || arguments[1] === undefined ? id : arguments[1];
        return new (obs._ofSameType(S$7, P$3))(obs, { fn: fn });
    }
    var mixin$1 = {
        _init: function (_ref) {
            var fn = _ref.fn;
            this._fn = fn;
        },
        _free: function () {
            this._fn = null;
        },
        _handleValue: function (x) {
            var fn = this._fn;
            if (fn(x)) {
                this._emitValue(x);
            }
        }
    };
    var S$8 = createStream('filter', mixin$1);
    var P$4 = createProperty('filter', mixin$1);
    var id$1 = function (x) {
        return x;
    };
    function filter(obs) {
        var fn = arguments.length <= 1 || arguments[1] === undefined ? id$1 : arguments[1];
        return new (obs._ofSameType(S$8, P$4))(obs, { fn: fn });
    }
    var mixin$2 = {
        _init: function (_ref) {
            var n = _ref.n;
            this._n = n;
            if (n <= 0) {
                this._emitEnd();
            }
        },
        _handleValue: function (x) {
            this._n--;
            this._emitValue(x);
            if (this._n === 0) {
                this._emitEnd();
            }
        }
    };
    var S$9 = createStream('take', mixin$2);
    var P$5 = createProperty('take', mixin$2);
    function take(obs, n) {
        return new (obs._ofSameType(S$9, P$5))(obs, { n: n });
    }
    var mixin$3 = {
        _init: function (_ref) {
            var n = _ref.n;
            this._n = n;
            if (n <= 0) {
                this._emitEnd();
            }
        },
        _handleError: function (x) {
            this._n--;
            this._emitError(x);
            if (this._n === 0) {
                this._emitEnd();
            }
        }
    };
    var S$10 = createStream('takeErrors', mixin$3);
    var P$6 = createProperty('takeErrors', mixin$3);
    function takeErrors(obs, n) {
        return new (obs._ofSameType(S$10, P$6))(obs, { n: n });
    }
    var mixin$4 = {
        _init: function (_ref) {
            var fn = _ref.fn;
            this._fn = fn;
        },
        _free: function () {
            this._fn = null;
        },
        _handleValue: function (x) {
            var fn = this._fn;
            if (fn(x)) {
                this._emitValue(x);
            } else {
                this._emitEnd();
            }
        }
    };
    var S$11 = createStream('takeWhile', mixin$4);
    var P$7 = createProperty('takeWhile', mixin$4);
    var id$2 = function (x) {
        return x;
    };
    function takeWhile(obs) {
        var fn = arguments.length <= 1 || arguments[1] === undefined ? id$2 : arguments[1];
        return new (obs._ofSameType(S$11, P$7))(obs, { fn: fn });
    }
    var mixin$5 = {
        _init: function () {
            this._lastValue = NOTHING;
        },
        _free: function () {
            this._lastValue = null;
        },
        _handleValue: function (x) {
            this._lastValue = x;
        },
        _handleEnd: function () {
            if (this._lastValue !== NOTHING) {
                this._emitValue(this._lastValue);
            }
            this._emitEnd();
        }
    };
    var S$12 = createStream('last', mixin$5);
    var P$8 = createProperty('last', mixin$5);
    function last(obs) {
        return new (obs._ofSameType(S$12, P$8))(obs);
    }
    var mixin$6 = {
        _init: function (_ref) {
            var n = _ref.n;
            this._n = Math.max(0, n);
        },
        _handleValue: function (x) {
            if (this._n === 0) {
                this._emitValue(x);
            } else {
                this._n--;
            }
        }
    };
    var S$13 = createStream('skip', mixin$6);
    var P$9 = createProperty('skip', mixin$6);
    function skip(obs, n) {
        return new (obs._ofSameType(S$13, P$9))(obs, { n: n });
    }
    var mixin$7 = {
        _init: function (_ref) {
            var fn = _ref.fn;
            this._fn = fn;
        },
        _free: function () {
            this._fn = null;
        },
        _handleValue: function (x) {
            var fn = this._fn;
            if (this._fn !== null && !fn(x)) {
                this._fn = null;
            }
            if (this._fn === null) {
                this._emitValue(x);
            }
        }
    };
    var S$14 = createStream('skipWhile', mixin$7);
    var P$10 = createProperty('skipWhile', mixin$7);
    var id$3 = function (x) {
        return x;
    };
    function skipWhile(obs) {
        var fn = arguments.length <= 1 || arguments[1] === undefined ? id$3 : arguments[1];
        return new (obs._ofSameType(S$14, P$10))(obs, { fn: fn });
    }
    var mixin$8 = {
        _init: function (_ref) {
            var fn = _ref.fn;
            this._fn = fn;
            this._prev = NOTHING;
        },
        _free: function () {
            this._fn = null;
            this._prev = null;
        },
        _handleValue: function (x) {
            var fn = this._fn;
            if (this._prev === NOTHING || !fn(this._prev, x)) {
                this._prev = x;
                this._emitValue(x);
            }
        }
    };
    var S$15 = createStream('skipDuplicates', mixin$8);
    var P$11 = createProperty('skipDuplicates', mixin$8);
    var eq = function (a, b) {
        return a === b;
    };
    function skipDuplicates(obs) {
        var fn = arguments.length <= 1 || arguments[1] === undefined ? eq : arguments[1];
        return new (obs._ofSameType(S$15, P$11))(obs, { fn: fn });
    }
    var mixin$9 = {
        _init: function (_ref) {
            var fn = _ref.fn;
            var seed = _ref.seed;
            this._fn = fn;
            this._prev = seed;
        },
        _free: function () {
            this._prev = null;
            this._fn = null;
        },
        _handleValue: function (x) {
            if (this._prev !== NOTHING) {
                var fn = this._fn;
                this._emitValue(fn(this._prev, x));
            }
            this._prev = x;
        }
    };
    var S$16 = createStream('diff', mixin$9);
    var P$12 = createProperty('diff', mixin$9);
    function defaultFn(a, b) {
        return [
            a,
            b
        ];
    }
    function diff(obs, fn) {
        var seed = arguments.length <= 2 || arguments[2] === undefined ? NOTHING : arguments[2];
        return new (obs._ofSameType(S$16, P$12))(obs, {
            fn: fn || defaultFn,
            seed: seed
        });
    }
    var P$13 = createProperty('scan', {
        _init: function (_ref) {
            var fn = _ref.fn;
            var seed = _ref.seed;
            this._fn = fn;
            this._seed = seed;
            if (seed !== NOTHING) {
                this._emitValue(seed);
            }
        },
        _free: function () {
            this._fn = null;
            this._seed = null;
        },
        _handleValue: function (x) {
            var fn = this._fn;
            if (this._currentEvent === null || this._currentEvent.type === ERROR) {
                this._emitValue(this._seed === NOTHING ? x : fn(this._seed, x));
            } else {
                this._emitValue(fn(this._currentEvent.value, x));
            }
        }
    });
    function scan(obs, fn) {
        var seed = arguments.length <= 2 || arguments[2] === undefined ? NOTHING : arguments[2];
        return new P$13(obs, {
            fn: fn,
            seed: seed
        });
    }
    var mixin$10 = {
        _init: function (_ref) {
            var fn = _ref.fn;
            this._fn = fn;
        },
        _free: function () {
            this._fn = null;
        },
        _handleValue: function (x) {
            var fn = this._fn;
            var xs = fn(x);
            for (var i = 0; i < xs.length; i++) {
                this._emitValue(xs[i]);
            }
        }
    };
    var S$17 = createStream('flatten', mixin$10);
    var id$4 = function (x) {
        return x;
    };
    function flatten(obs) {
        var fn = arguments.length <= 1 || arguments[1] === undefined ? id$4 : arguments[1];
        return new S$17(obs, { fn: fn });
    }
    var END_MARKER = {};
    var mixin$11 = {
        _init: function (_ref) {
            var _this = this;
            var wait = _ref.wait;
            this._wait = Math.max(0, wait);
            this._buff = [];
            this._$shiftBuff = function () {
                var value = _this._buff.shift();
                if (value === END_MARKER) {
                    _this._emitEnd();
                } else {
                    _this._emitValue(value);
                }
            };
        },
        _free: function () {
            this._buff = null;
            this._$shiftBuff = null;
        },
        _handleValue: function (x) {
            if (this._activating) {
                this._emitValue(x);
            } else {
                this._buff.push(x);
                setTimeout(this._$shiftBuff, this._wait);
            }
        },
        _handleEnd: function () {
            if (this._activating) {
                this._emitEnd();
            } else {
                this._buff.push(END_MARKER);
                setTimeout(this._$shiftBuff, this._wait);
            }
        }
    };
    var S$18 = createStream('delay', mixin$11);
    var P$14 = createProperty('delay', mixin$11);
    function delay(obs, wait) {
        return new (obs._ofSameType(S$18, P$14))(obs, { wait: wait });
    }
    var now = Date.now ? function () {
        return Date.now();
    } : function () {
        return new Date().getTime();
    };
    var mixin$12 = {
        _init: function (_ref) {
            var _this = this;
            var wait = _ref.wait;
            var leading = _ref.leading;
            var trailing = _ref.trailing;
            this._wait = Math.max(0, wait);
            this._leading = leading;
            this._trailing = trailing;
            this._trailingValue = null;
            this._timeoutId = null;
            this._endLater = false;
            this._lastCallTime = 0;
            this._$trailingCall = function () {
                return _this._trailingCall();
            };
        },
        _free: function () {
            this._trailingValue = null;
            this._$trailingCall = null;
        },
        _handleValue: function (x) {
            if (this._activating) {
                this._emitValue(x);
            } else {
                var curTime = now();
                if (this._lastCallTime === 0 && !this._leading) {
                    this._lastCallTime = curTime;
                }
                var remaining = this._wait - (curTime - this._lastCallTime);
                if (remaining <= 0) {
                    this._cancelTrailing();
                    this._lastCallTime = curTime;
                    this._emitValue(x);
                } else if (this._trailing) {
                    this._cancelTrailing();
                    this._trailingValue = x;
                    this._timeoutId = setTimeout(this._$trailingCall, remaining);
                }
            }
        },
        _handleEnd: function () {
            if (this._activating) {
                this._emitEnd();
            } else {
                if (this._timeoutId) {
                    this._endLater = true;
                } else {
                    this._emitEnd();
                }
            }
        },
        _cancelTrailing: function () {
            if (this._timeoutId !== null) {
                clearTimeout(this._timeoutId);
                this._timeoutId = null;
            }
        },
        _trailingCall: function () {
            this._emitValue(this._trailingValue);
            this._timeoutId = null;
            this._trailingValue = null;
            this._lastCallTime = !this._leading ? 0 : now();
            if (this._endLater) {
                this._emitEnd();
            }
        }
    };
    var S$19 = createStream('throttle', mixin$12);
    var P$15 = createProperty('throttle', mixin$12);
    function throttle(obs, wait) {
        var _ref2 = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
        var _ref2$leading = _ref2.leading;
        var leading = _ref2$leading === undefined ? true : _ref2$leading;
        var _ref2$trailing = _ref2.trailing;
        var trailing = _ref2$trailing === undefined ? true : _ref2$trailing;
        return new (obs._ofSameType(S$19, P$15))(obs, {
            wait: wait,
            leading: leading,
            trailing: trailing
        });
    }
    var mixin$13 = {
        _init: function (_ref) {
            var _this = this;
            var wait = _ref.wait;
            var immediate = _ref.immediate;
            this._wait = Math.max(0, wait);
            this._immediate = immediate;
            this._lastAttempt = 0;
            this._timeoutId = null;
            this._laterValue = null;
            this._endLater = false;
            this._$later = function () {
                return _this._later();
            };
        },
        _free: function () {
            this._laterValue = null;
            this._$later = null;
        },
        _handleValue: function (x) {
            if (this._activating) {
                this._emitValue(x);
            } else {
                this._lastAttempt = now();
                if (this._immediate && !this._timeoutId) {
                    this._emitValue(x);
                }
                if (!this._timeoutId) {
                    this._timeoutId = setTimeout(this._$later, this._wait);
                }
                if (!this._immediate) {
                    this._laterValue = x;
                }
            }
        },
        _handleEnd: function () {
            if (this._activating) {
                this._emitEnd();
            } else {
                if (this._timeoutId && !this._immediate) {
                    this._endLater = true;
                } else {
                    this._emitEnd();
                }
            }
        },
        _later: function () {
            var last = now() - this._lastAttempt;
            if (last < this._wait && last >= 0) {
                this._timeoutId = setTimeout(this._$later, this._wait - last);
            } else {
                this._timeoutId = null;
                if (!this._immediate) {
                    this._emitValue(this._laterValue);
                    this._laterValue = null;
                }
                if (this._endLater) {
                    this._emitEnd();
                }
            }
        }
    };
    var S$20 = createStream('debounce', mixin$13);
    var P$16 = createProperty('debounce', mixin$13);
    function debounce(obs, wait) {
        var _ref2 = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
        var _ref2$immediate = _ref2.immediate;
        var immediate = _ref2$immediate === undefined ? false : _ref2$immediate;
        return new (obs._ofSameType(S$20, P$16))(obs, {
            wait: wait,
            immediate: immediate
        });
    }
    var mixin$14 = {
        _init: function (_ref) {
            var fn = _ref.fn;
            this._fn = fn;
        },
        _free: function () {
            this._fn = null;
        },
        _handleError: function (x) {
            var fn = this._fn;
            this._emitError(fn(x));
        }
    };
    var S$21 = createStream('mapErrors', mixin$14);
    var P$17 = createProperty('mapErrors', mixin$14);
    var id$5 = function (x) {
        return x;
    };
    function mapErrors(obs) {
        var fn = arguments.length <= 1 || arguments[1] === undefined ? id$5 : arguments[1];
        return new (obs._ofSameType(S$21, P$17))(obs, { fn: fn });
    }
    var mixin$15 = {
        _init: function (_ref) {
            var fn = _ref.fn;
            this._fn = fn;
        },
        _free: function () {
            this._fn = null;
        },
        _handleError: function (x) {
            var fn = this._fn;
            if (fn(x)) {
                this._emitError(x);
            }
        }
    };
    var S$22 = createStream('filterErrors', mixin$15);
    var P$18 = createProperty('filterErrors', mixin$15);
    var id$6 = function (x) {
        return x;
    };
    function filterErrors(obs) {
        var fn = arguments.length <= 1 || arguments[1] === undefined ? id$6 : arguments[1];
        return new (obs._ofSameType(S$22, P$18))(obs, { fn: fn });
    }
    var mixin$16 = {
        _handleValue: function () {
        }
    };
    var S$23 = createStream('ignoreValues', mixin$16);
    var P$19 = createProperty('ignoreValues', mixin$16);
    function ignoreValues(obs) {
        return new (obs._ofSameType(S$23, P$19))(obs);
    }
    var mixin$17 = {
        _handleError: function () {
        }
    };
    var S$24 = createStream('ignoreErrors', mixin$17);
    var P$20 = createProperty('ignoreErrors', mixin$17);
    function ignoreErrors(obs) {
        return new (obs._ofSameType(S$24, P$20))(obs);
    }
    var mixin$18 = {
        _handleEnd: function () {
        }
    };
    var S$25 = createStream('ignoreEnd', mixin$18);
    var P$21 = createProperty('ignoreEnd', mixin$18);
    function ignoreEnd(obs) {
        return new (obs._ofSameType(S$25, P$21))(obs);
    }
    var mixin$19 = {
        _init: function (_ref) {
            var fn = _ref.fn;
            this._fn = fn;
        },
        _free: function () {
            this._fn = null;
        },
        _handleEnd: function () {
            var fn = this._fn;
            this._emitValue(fn());
            this._emitEnd();
        }
    };
    var S$26 = createStream('beforeEnd', mixin$19);
    var P$22 = createProperty('beforeEnd', mixin$19);
    function beforeEnd(obs, fn) {
        return new (obs._ofSameType(S$26, P$22))(obs, { fn: fn });
    }
    var mixin$20 = {
        _init: function (_ref) {
            var min = _ref.min;
            var max = _ref.max;
            this._max = max;
            this._min = min;
            this._buff = [];
        },
        _free: function () {
            this._buff = null;
        },
        _handleValue: function (x) {
            this._buff = slide(this._buff, x, this._max);
            if (this._buff.length >= this._min) {
                this._emitValue(this._buff);
            }
        }
    };
    var S$27 = createStream('slidingWindow', mixin$20);
    var P$23 = createProperty('slidingWindow', mixin$20);
    function slidingWindow(obs, max) {
        var min = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
        return new (obs._ofSameType(S$27, P$23))(obs, {
            min: min,
            max: max
        });
    }
    var mixin$21 = {
        _init: function (_ref) {
            var fn = _ref.fn;
            var flushOnEnd = _ref.flushOnEnd;
            this._fn = fn;
            this._flushOnEnd = flushOnEnd;
            this._buff = [];
        },
        _free: function () {
            this._buff = null;
        },
        _flush: function () {
            if (this._buff !== null && this._buff.length !== 0) {
                this._emitValue(this._buff);
                this._buff = [];
            }
        },
        _handleValue: function (x) {
            this._buff.push(x);
            var fn = this._fn;
            if (!fn(x)) {
                this._flush();
            }
        },
        _handleEnd: function () {
            if (this._flushOnEnd) {
                this._flush();
            }
            this._emitEnd();
        }
    };
    var S$28 = createStream('bufferWhile', mixin$21);
    var P$24 = createProperty('bufferWhile', mixin$21);
    var id$7 = function (x) {
        return x;
    };
    function bufferWhile(obs, fn) {
        var _ref2 = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
        var _ref2$flushOnEnd = _ref2.flushOnEnd;
        var flushOnEnd = _ref2$flushOnEnd === undefined ? true : _ref2$flushOnEnd;
        return new (obs._ofSameType(S$28, P$24))(obs, {
            fn: fn || id$7,
            flushOnEnd: flushOnEnd
        });
    }
    var mixin$22 = {
        _init: function (_ref) {
            var count = _ref.count;
            var flushOnEnd = _ref.flushOnEnd;
            this._count = count;
            this._flushOnEnd = flushOnEnd;
            this._buff = [];
        },
        _free: function () {
            this._buff = null;
        },
        _flush: function () {
            if (this._buff !== null && this._buff.length !== 0) {
                this._emitValue(this._buff);
                this._buff = [];
            }
        },
        _handleValue: function (x) {
            this._buff.push(x);
            if (this._buff.length >= this._count) {
                this._flush();
            }
        },
        _handleEnd: function () {
            if (this._flushOnEnd) {
                this._flush();
            }
            this._emitEnd();
        }
    };
    var S$29 = createStream('bufferWithCount', mixin$22);
    var P$25 = createProperty('bufferWithCount', mixin$22);
    function bufferWhile$1(obs, count) {
        var _ref2 = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
        var _ref2$flushOnEnd = _ref2.flushOnEnd;
        var flushOnEnd = _ref2$flushOnEnd === undefined ? true : _ref2$flushOnEnd;
        return new (obs._ofSameType(S$29, P$25))(obs, {
            count: count,
            flushOnEnd: flushOnEnd
        });
    }
    var mixin$23 = {
        _init: function (_ref) {
            var _this = this;
            var wait = _ref.wait;
            var count = _ref.count;
            var flushOnEnd = _ref.flushOnEnd;
            this._wait = wait;
            this._count = count;
            this._flushOnEnd = flushOnEnd;
            this._intervalId = null;
            this._$onTick = function () {
                return _this._flush();
            };
            this._buff = [];
        },
        _free: function () {
            this._$onTick = null;
            this._buff = null;
        },
        _flush: function () {
            if (this._buff !== null) {
                this._emitValue(this._buff);
                this._buff = [];
            }
        },
        _handleValue: function (x) {
            this._buff.push(x);
            if (this._buff.length >= this._count) {
                clearInterval(this._intervalId);
                this._flush();
                this._intervalId = setInterval(this._$onTick, this._wait);
            }
        },
        _handleEnd: function () {
            if (this._flushOnEnd && this._buff.length !== 0) {
                this._flush();
            }
            this._emitEnd();
        },
        _onActivation: function () {
            this._intervalId = setInterval(this._$onTick, this._wait);
            this._source.onAny(this._$handleAny);
        },
        _onDeactivation: function () {
            if (this._intervalId !== null) {
                clearInterval(this._intervalId);
                this._intervalId = null;
            }
            this._source.offAny(this._$handleAny);
        }
    };
    var S$30 = createStream('bufferWithTimeOrCount', mixin$23);
    var P$26 = createProperty('bufferWithTimeOrCount', mixin$23);
    function bufferWithTimeOrCount(obs, wait, count) {
        var _ref2 = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
        var _ref2$flushOnEnd = _ref2.flushOnEnd;
        var flushOnEnd = _ref2$flushOnEnd === undefined ? true : _ref2$flushOnEnd;
        return new (obs._ofSameType(S$30, P$26))(obs, {
            wait: wait,
            count: count,
            flushOnEnd: flushOnEnd
        });
    }
    function xformForObs(obs) {
        return {
            '@@transducer/step': function (res, input) {
                obs._emitValue(input);
                return null;
            },
            '@@transducer/result': function () {
                obs._emitEnd();
                return null;
            }
        };
    }
    var mixin$24 = {
        _init: function (_ref) {
            var transducer = _ref.transducer;
            this._xform = transducer(xformForObs(this));
        },
        _free: function () {
            this._xform = null;
        },
        _handleValue: function (x) {
            if (this._xform['@@transducer/step'](null, x) !== null) {
                this._xform['@@transducer/result'](null);
            }
        },
        _handleEnd: function () {
            this._xform['@@transducer/result'](null);
        }
    };
    var S$31 = createStream('transduce', mixin$24);
    var P$27 = createProperty('transduce', mixin$24);
    function transduce(obs, transducer) {
        return new (obs._ofSameType(S$31, P$27))(obs, { transducer: transducer });
    }
    var mixin$25 = {
        _init: function (_ref) {
            var fn = _ref.fn;
            this._handler = fn;
            this._emitter = emitter(this);
        },
        _free: function () {
            this._handler = null;
            this._emitter = null;
        },
        _handleAny: function (event) {
            this._handler(this._emitter, event);
        }
    };
    var S$32 = createStream('withHandler', mixin$25);
    var P$28 = createProperty('withHandler', mixin$25);
    function withHandler(obs, fn) {
        return new (obs._ofSameType(S$32, P$28))(obs, { fn: fn });
    }
    var isArray = Array.isArray || function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]';
    };
    function Zip(sources, combinator) {
        var _this = this;
        Stream.call(this);
        this._buffers = map(sources, function (source) {
            return isArray(source) ? cloneArray(source) : [];
        });
        this._sources = map(sources, function (source) {
            return isArray(source) ? never() : source;
        });
        this._combinator = combinator ? spread(combinator, this._sources.length) : function (x) {
            return x;
        };
        this._aliveCount = 0;
        this._$handlers = [];
        var _loop = function (i) {
            _this._$handlers.push(function (event) {
                return _this._handleAny(i, event);
            });
        };
        for (var i = 0; i < this._sources.length; i++) {
            _loop(i);
        }
    }
    inherit(Zip, Stream, {
        _name: 'zip',
        _onActivation: function () {
            while (this._isFull()) {
                this._emit();
            }
            var length = this._sources.length;
            this._aliveCount = length;
            for (var i = 0; i < length && this._active; i++) {
                this._sources[i].onAny(this._$handlers[i]);
            }
        },
        _onDeactivation: function () {
            for (var i = 0; i < this._sources.length; i++) {
                this._sources[i].offAny(this._$handlers[i]);
            }
        },
        _emit: function () {
            var values = new Array(this._buffers.length);
            for (var i = 0; i < this._buffers.length; i++) {
                values[i] = this._buffers[i].shift();
            }
            var combinator = this._combinator;
            this._emitValue(combinator(values));
        },
        _isFull: function () {
            for (var i = 0; i < this._buffers.length; i++) {
                if (this._buffers[i].length === 0) {
                    return false;
                }
            }
            return true;
        },
        _handleAny: function (i, event) {
            if (event.type === VALUE) {
                this._buffers[i].push(event.value);
                if (this._isFull()) {
                    this._emit();
                }
            }
            if (event.type === ERROR) {
                this._emitError(event.value);
            }
            if (event.type === END) {
                this._aliveCount--;
                if (this._aliveCount === 0) {
                    this._emitEnd();
                }
            }
        },
        _clear: function () {
            Stream.prototype._clear.call(this);
            this._sources = null;
            this._buffers = null;
            this._combinator = null;
            this._$handlers = null;
        }
    });
    function zip(observables, combinator) {
        return observables.length === 0 ? never() : new Zip(observables, combinator);
    }
    var id$8 = function (x) {
        return x;
    };
    function AbstractPool() {
        var _this = this;
        var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        var _ref$queueLim = _ref.queueLim;
        var queueLim = _ref$queueLim === undefined ? 0 : _ref$queueLim;
        var _ref$concurLim = _ref.concurLim;
        var concurLim = _ref$concurLim === undefined ? -1 : _ref$concurLim;
        var _ref$drop = _ref.drop;
        var drop = _ref$drop === undefined ? 'new' : _ref$drop;
        Stream.call(this);
        this._queueLim = queueLim < 0 ? -1 : queueLim;
        this._concurLim = concurLim < 0 ? -1 : concurLim;
        this._drop = drop;
        this._queue = [];
        this._curSources = [];
        this._$handleSubAny = function (event) {
            return _this._handleSubAny(event);
        };
        this._$endHandlers = [];
        this._currentlyAdding = null;
        if (this._concurLim === 0) {
            this._emitEnd();
        }
    }
    inherit(AbstractPool, Stream, {
        _name: 'abstractPool',
        _add: function (obj, toObs) {
            toObs = toObs || id$8;
            if (this._concurLim === -1 || this._curSources.length < this._concurLim) {
                this._addToCur(toObs(obj));
            } else {
                if (this._queueLim === -1 || this._queue.length < this._queueLim) {
                    this._addToQueue(toObs(obj));
                } else if (this._drop === 'old') {
                    this._removeOldest();
                    this._add(obj, toObs);
                }
            }
        },
        _addAll: function (obss) {
            var _this2 = this;
            forEach(obss, function (obs) {
                return _this2._add(obs);
            });
        },
        _remove: function (obs) {
            if (this._removeCur(obs) === -1) {
                this._removeQueue(obs);
            }
        },
        _addToQueue: function (obs) {
            this._queue = concat(this._queue, [obs]);
        },
        _addToCur: function (obs) {
            if (this._active) {
                if (!obs._alive) {
                    if (obs._currentEvent) {
                        this._emit(obs._currentEvent.type, obs._currentEvent.value);
                    }
                    return;
                }
                this._currentlyAdding = obs;
                obs.onAny(this._$handleSubAny);
                this._currentlyAdding = null;
                if (obs._alive) {
                    this._curSources = concat(this._curSources, [obs]);
                    if (this._active) {
                        this._subToEnd(obs);
                    }
                }
            } else {
                this._curSources = concat(this._curSources, [obs]);
            }
        },
        _subToEnd: function (obs) {
            var _this3 = this;
            var onEnd = function () {
                return _this3._removeCur(obs);
            };
            this._$endHandlers.push({
                obs: obs,
                handler: onEnd
            });
            obs.onEnd(onEnd);
        },
        _subscribe: function (obs) {
            obs.onAny(this._$handleSubAny);
            if (this._active) {
                this._subToEnd(obs);
            }
        },
        _unsubscribe: function (obs) {
            obs.offAny(this._$handleSubAny);
            var onEndI = findByPred(this._$endHandlers, function (obj) {
                return obj.obs === obs;
            });
            if (onEndI !== -1) {
                obs.offEnd(this._$endHandlers[onEndI].handler);
                this._$endHandlers.splice(onEndI, 1);
            }
        },
        _handleSubAny: function (event) {
            if (event.type === VALUE) {
                this._emitValue(event.value);
            } else if (event.type === ERROR) {
                this._emitError(event.value);
            }
        },
        _removeQueue: function (obs) {
            var index = find(this._queue, obs);
            this._queue = remove(this._queue, index);
            return index;
        },
        _removeCur: function (obs) {
            if (this._active) {
                this._unsubscribe(obs);
            }
            var index = find(this._curSources, obs);
            this._curSources = remove(this._curSources, index);
            if (index !== -1) {
                if (this._queue.length !== 0) {
                    this._pullQueue();
                } else if (this._curSources.length === 0) {
                    this._onEmpty();
                }
            }
            return index;
        },
        _removeOldest: function () {
            this._removeCur(this._curSources[0]);
        },
        _pullQueue: function () {
            if (this._queue.length !== 0) {
                this._queue = cloneArray(this._queue);
                this._addToCur(this._queue.shift());
            }
        },
        _onActivation: function () {
            for (var i = 0, sources = this._curSources; i < sources.length && this._active; i++) {
                this._subscribe(sources[i]);
            }
        },
        _onDeactivation: function () {
            for (var i = 0, sources = this._curSources; i < sources.length; i++) {
                this._unsubscribe(sources[i]);
            }
            if (this._currentlyAdding !== null) {
                this._unsubscribe(this._currentlyAdding);
            }
        },
        _isEmpty: function () {
            return this._curSources.length === 0;
        },
        _onEmpty: function () {
        },
        _clear: function () {
            Stream.prototype._clear.call(this);
            this._queue = null;
            this._curSources = null;
            this._$handleSubAny = null;
            this._$endHandlers = null;
        }
    });
    function Merge(sources) {
        AbstractPool.call(this);
        this._addAll(sources);
        this._initialised = true;
    }
    inherit(Merge, AbstractPool, {
        _name: 'merge',
        _onEmpty: function () {
            if (this._initialised) {
                this._emitEnd();
            }
        }
    });
    function merge(observables) {
        return observables.length === 0 ? never() : new Merge(observables);
    }
    function S$33(generator) {
        var _this = this;
        Stream.call(this);
        this._generator = generator;
        this._source = null;
        this._inLoop = false;
        this._iteration = 0;
        this._$handleAny = function (event) {
            return _this._handleAny(event);
        };
    }
    inherit(S$33, Stream, {
        _name: 'repeat',
        _handleAny: function (event) {
            if (event.type === END) {
                this._source = null;
                this._getSource();
            } else {
                this._emit(event.type, event.value);
            }
        },
        _getSource: function () {
            if (!this._inLoop) {
                this._inLoop = true;
                var generator = this._generator;
                while (this._source === null && this._alive && this._active) {
                    this._source = generator(this._iteration++);
                    if (this._source) {
                        this._source.onAny(this._$handleAny);
                    } else {
                        this._emitEnd();
                    }
                }
                this._inLoop = false;
            }
        },
        _onActivation: function () {
            if (this._source) {
                this._source.onAny(this._$handleAny);
            } else {
                this._getSource();
            }
        },
        _onDeactivation: function () {
            if (this._source) {
                this._source.offAny(this._$handleAny);
            }
        },
        _clear: function () {
            Stream.prototype._clear.call(this);
            this._generator = null;
            this._source = null;
            this._$handleAny = null;
        }
    });
    function repeat(generator) {
        return new S$33(generator);
    }
    function concat$1(observables) {
        return repeat(function (index) {
            return observables.length > index ? observables[index] : false;
        }).setName('concat');
    }
    function Pool() {
        AbstractPool.call(this);
    }
    inherit(Pool, AbstractPool, {
        _name: 'pool',
        plug: function (obs) {
            this._add(obs);
            return this;
        },
        unplug: function (obs) {
            this._remove(obs);
            return this;
        }
    });
    function FlatMap(source, fn, options) {
        var _this = this;
        AbstractPool.call(this, options);
        this._source = source;
        this._fn = fn;
        this._mainEnded = false;
        this._lastCurrent = null;
        this._$handleMain = function (event) {
            return _this._handleMain(event);
        };
    }
    inherit(FlatMap, AbstractPool, {
        _onActivation: function () {
            AbstractPool.prototype._onActivation.call(this);
            if (this._active) {
                this._source.onAny(this._$handleMain);
            }
        },
        _onDeactivation: function () {
            AbstractPool.prototype._onDeactivation.call(this);
            this._source.offAny(this._$handleMain);
            this._hadNoEvSinceDeact = true;
        },
        _handleMain: function (event) {
            if (event.type === VALUE) {
                var sameCurr = this._activating && this._hadNoEvSinceDeact && this._lastCurrent === event.value;
                if (!sameCurr) {
                    this._add(event.value, this._fn);
                }
                this._lastCurrent = event.value;
                this._hadNoEvSinceDeact = false;
            }
            if (event.type === ERROR) {
                this._emitError(event.value);
            }
            if (event.type === END) {
                if (this._isEmpty()) {
                    this._emitEnd();
                } else {
                    this._mainEnded = true;
                }
            }
        },
        _onEmpty: function () {
            if (this._mainEnded) {
                this._emitEnd();
            }
        },
        _clear: function () {
            AbstractPool.prototype._clear.call(this);
            this._source = null;
            this._lastCurrent = null;
            this._$handleMain = null;
        }
    });
    function FlatMapErrors(source, fn) {
        FlatMap.call(this, source, fn);
    }
    inherit(FlatMapErrors, FlatMap, {
        _handleMain: function (event) {
            if (event.type === ERROR) {
                var sameCurr = this._activating && this._hadNoEvSinceDeact && this._lastCurrent === event.value;
                if (!sameCurr) {
                    this._add(event.value, this._fn);
                }
                this._lastCurrent = event.value;
                this._hadNoEvSinceDeact = false;
            }
            if (event.type === VALUE) {
                this._emitValue(event.value);
            }
            if (event.type === END) {
                if (this._isEmpty()) {
                    this._emitEnd();
                } else {
                    this._mainEnded = true;
                }
            }
        }
    });
    function createConstructor$1(BaseClass, name) {
        return function AnonymousObservable(primary, secondary, options) {
            var _this = this;
            BaseClass.call(this);
            this._primary = primary;
            this._secondary = secondary;
            this._name = primary._name + '.' + name;
            this._lastSecondary = NOTHING;
            this._$handleSecondaryAny = function (event) {
                return _this._handleSecondaryAny(event);
            };
            this._$handlePrimaryAny = function (event) {
                return _this._handlePrimaryAny(event);
            };
            this._init(options);
        };
    }
    function createClassMethods$1(BaseClass) {
        return {
            _init: function () {
            },
            _free: function () {
            },
            _handlePrimaryValue: function (x) {
                this._emitValue(x);
            },
            _handlePrimaryError: function (x) {
                this._emitError(x);
            },
            _handlePrimaryEnd: function () {
                this._emitEnd();
            },
            _handleSecondaryValue: function (x) {
                this._lastSecondary = x;
            },
            _handleSecondaryError: function (x) {
                this._emitError(x);
            },
            _handleSecondaryEnd: function () {
            },
            _handlePrimaryAny: function (event) {
                switch (event.type) {
                case VALUE:
                    return this._handlePrimaryValue(event.value);
                case ERROR:
                    return this._handlePrimaryError(event.value);
                case END:
                    return this._handlePrimaryEnd(event.value);
                }
            },
            _handleSecondaryAny: function (event) {
                switch (event.type) {
                case VALUE:
                    return this._handleSecondaryValue(event.value);
                case ERROR:
                    return this._handleSecondaryError(event.value);
                case END:
                    this._handleSecondaryEnd(event.value);
                    this._removeSecondary();
                }
            },
            _removeSecondary: function () {
                if (this._secondary !== null) {
                    this._secondary.offAny(this._$handleSecondaryAny);
                    this._$handleSecondaryAny = null;
                    this._secondary = null;
                }
            },
            _onActivation: function () {
                if (this._secondary !== null) {
                    this._secondary.onAny(this._$handleSecondaryAny);
                }
                if (this._active) {
                    this._primary.onAny(this._$handlePrimaryAny);
                }
            },
            _onDeactivation: function () {
                if (this._secondary !== null) {
                    this._secondary.offAny(this._$handleSecondaryAny);
                }
                this._primary.offAny(this._$handlePrimaryAny);
            },
            _clear: function () {
                BaseClass.prototype._clear.call(this);
                this._primary = null;
                this._secondary = null;
                this._lastSecondary = null;
                this._$handleSecondaryAny = null;
                this._$handlePrimaryAny = null;
                this._free();
            }
        };
    }
    function createStream$1(name, mixin) {
        var S = createConstructor$1(Stream, name);
        inherit(S, Stream, createClassMethods$1(Stream), mixin);
        return S;
    }
    function createProperty$1(name, mixin) {
        var P = createConstructor$1(Property, name);
        inherit(P, Property, createClassMethods$1(Property), mixin);
        return P;
    }
    var mixin$26 = {
        _handlePrimaryValue: function (x) {
            if (this._lastSecondary !== NOTHING && this._lastSecondary) {
                this._emitValue(x);
            }
        },
        _handleSecondaryEnd: function () {
            if (this._lastSecondary === NOTHING || !this._lastSecondary) {
                this._emitEnd();
            }
        }
    };
    var S$34 = createStream$1('filterBy', mixin$26);
    var P$29 = createProperty$1('filterBy', mixin$26);
    function filterBy(primary, secondary) {
        return new (primary._ofSameType(S$34, P$29))(primary, secondary);
    }
    var id2 = function (_, x) {
        return x;
    };
    function sampledBy(passive, active, combinator) {
        var _combinator = combinator ? function (a, b) {
            return combinator(b, a);
        } : id2;
        return combine([active], [passive], _combinator).setName(passive, 'sampledBy');
    }
    var mixin$27 = {
        _handlePrimaryValue: function (x) {
            if (this._lastSecondary !== NOTHING) {
                this._emitValue(x);
            }
        },
        _handleSecondaryEnd: function () {
            if (this._lastSecondary === NOTHING) {
                this._emitEnd();
            }
        }
    };
    var S$35 = createStream$1('skipUntilBy', mixin$27);
    var P$30 = createProperty$1('skipUntilBy', mixin$27);
    function skipUntilBy(primary, secondary) {
        return new (primary._ofSameType(S$35, P$30))(primary, secondary);
    }
    var mixin$28 = {
        _handleSecondaryValue: function () {
            this._emitEnd();
        }
    };
    var S$36 = createStream$1('takeUntilBy', mixin$28);
    var P$31 = createProperty$1('takeUntilBy', mixin$28);
    function takeUntilBy(primary, secondary) {
        return new (primary._ofSameType(S$36, P$31))(primary, secondary);
    }
    var mixin$29 = {
        _init: function () {
            var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            var _ref$flushOnEnd = _ref.flushOnEnd;
            var flushOnEnd = _ref$flushOnEnd === undefined ? true : _ref$flushOnEnd;
            this._buff = [];
            this._flushOnEnd = flushOnEnd;
        },
        _free: function () {
            this._buff = null;
        },
        _flush: function () {
            if (this._buff !== null) {
                this._emitValue(this._buff);
                this._buff = [];
            }
        },
        _handlePrimaryEnd: function () {
            if (this._flushOnEnd) {
                this._flush();
            }
            this._emitEnd();
        },
        _onActivation: function () {
            this._primary.onAny(this._$handlePrimaryAny);
            if (this._alive && this._secondary !== null) {
                this._secondary.onAny(this._$handleSecondaryAny);
            }
        },
        _handlePrimaryValue: function (x) {
            this._buff.push(x);
        },
        _handleSecondaryValue: function () {
            this._flush();
        },
        _handleSecondaryEnd: function () {
            if (!this._flushOnEnd) {
                this._emitEnd();
            }
        }
    };
    var S$37 = createStream$1('bufferBy', mixin$29);
    var P$32 = createProperty$1('bufferBy', mixin$29);
    function bufferBy(primary, secondary, options) {
        return new (primary._ofSameType(S$37, P$32))(primary, secondary, options);
    }
    var mixin$30 = {
        _init: function () {
            var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            var _ref$flushOnEnd = _ref.flushOnEnd;
            var flushOnEnd = _ref$flushOnEnd === undefined ? true : _ref$flushOnEnd;
            var _ref$flushOnChange = _ref.flushOnChange;
            var flushOnChange = _ref$flushOnChange === undefined ? false : _ref$flushOnChange;
            this._buff = [];
            this._flushOnEnd = flushOnEnd;
            this._flushOnChange = flushOnChange;
        },
        _free: function () {
            this._buff = null;
        },
        _flush: function () {
            if (this._buff !== null) {
                this._emitValue(this._buff);
                this._buff = [];
            }
        },
        _handlePrimaryEnd: function () {
            if (this._flushOnEnd) {
                this._flush();
            }
            this._emitEnd();
        },
        _handlePrimaryValue: function (x) {
            this._buff.push(x);
            if (this._lastSecondary !== NOTHING && !this._lastSecondary) {
                this._flush();
            }
        },
        _handleSecondaryEnd: function () {
            if (!this._flushOnEnd && (this._lastSecondary === NOTHING || this._lastSecondary)) {
                this._emitEnd();
            }
        },
        _handleSecondaryValue: function (x) {
            if (this._flushOnChange && !x) {
                this._flush();
            }
            this._lastSecondary = x;
        }
    };
    var S$38 = createStream$1('bufferWhileBy', mixin$30);
    var P$33 = createProperty$1('bufferWhileBy', mixin$30);
    function bufferWhileBy(primary, secondary, options) {
        return new (primary._ofSameType(S$38, P$33))(primary, secondary, options);
    }
    var f = function () {
        return false;
    };
    var t = function () {
        return true;
    };
    function awaiting(a, b) {
        var result = merge([
            map$1(a, t),
            map$1(b, f)
        ]);
        result = skipDuplicates(result);
        result = toProperty(result, f);
        return result.setName(a, 'awaiting');
    }
    var mixin$31 = {
        _init: function (_ref) {
            var fn = _ref.fn;
            this._fn = fn;
        },
        _free: function () {
            this._fn = null;
        },
        _handleValue: function (x) {
            var fn = this._fn;
            var result = fn(x);
            if (result.convert) {
                this._emitError(result.error);
            } else {
                this._emitValue(x);
            }
        }
    };
    var S$39 = createStream('valuesToErrors', mixin$31);
    var P$34 = createProperty('valuesToErrors', mixin$31);
    var defFn = function (x) {
        return {
            convert: true,
            error: x
        };
    };
    function valuesToErrors(obs) {
        var fn = arguments.length <= 1 || arguments[1] === undefined ? defFn : arguments[1];
        return new (obs._ofSameType(S$39, P$34))(obs, { fn: fn });
    }
    var mixin$32 = {
        _init: function (_ref) {
            var fn = _ref.fn;
            this._fn = fn;
        },
        _free: function () {
            this._fn = null;
        },
        _handleError: function (x) {
            var fn = this._fn;
            var result = fn(x);
            if (result.convert) {
                this._emitValue(result.value);
            } else {
                this._emitError(x);
            }
        }
    };
    var S$40 = createStream('errorsToValues', mixin$32);
    var P$35 = createProperty('errorsToValues', mixin$32);
    var defFn$1 = function (x) {
        return {
            convert: true,
            value: x
        };
    };
    function errorsToValues(obs) {
        var fn = arguments.length <= 1 || arguments[1] === undefined ? defFn$1 : arguments[1];
        return new (obs._ofSameType(S$40, P$35))(obs, { fn: fn });
    }
    var mixin$33 = {
        _handleError: function (x) {
            this._emitError(x);
            this._emitEnd();
        }
    };
    var S$41 = createStream('endOnError', mixin$33);
    var P$36 = createProperty('endOnError', mixin$33);
    function endOnError(obs) {
        return new (obs._ofSameType(S$41, P$36))(obs);
    }
    Observable.prototype.toProperty = function (fn) {
        return toProperty(this, fn);
    };
    Observable.prototype.changes = function () {
        return changes(this);
    };
    Observable.prototype.toPromise = function (Promise) {
        return toPromise(this, Promise);
    };
    Observable.prototype.toESObservable = toESObservable;
    Observable.prototype[$$observable] = toESObservable;
    Observable.prototype.map = function (fn) {
        return map$1(this, fn);
    };
    Observable.prototype.filter = function (fn) {
        return filter(this, fn);
    };
    Observable.prototype.take = function (n) {
        return take(this, n);
    };
    Observable.prototype.takeErrors = function (n) {
        return takeErrors(this, n);
    };
    Observable.prototype.takeWhile = function (fn) {
        return takeWhile(this, fn);
    };
    Observable.prototype.last = function () {
        return last(this);
    };
    Observable.prototype.skip = function (n) {
        return skip(this, n);
    };
    Observable.prototype.skipWhile = function (fn) {
        return skipWhile(this, fn);
    };
    Observable.prototype.skipDuplicates = function (fn) {
        return skipDuplicates(this, fn);
    };
    Observable.prototype.diff = function (fn, seed) {
        return diff(this, fn, seed);
    };
    Observable.prototype.scan = function (fn, seed) {
        return scan(this, fn, seed);
    };
    Observable.prototype.flatten = function (fn) {
        return flatten(this, fn);
    };
    Observable.prototype.delay = function (wait) {
        return delay(this, wait);
    };
    Observable.prototype.throttle = function (wait, options) {
        return throttle(this, wait, options);
    };
    Observable.prototype.debounce = function (wait, options) {
        return debounce(this, wait, options);
    };
    Observable.prototype.mapErrors = function (fn) {
        return mapErrors(this, fn);
    };
    Observable.prototype.filterErrors = function (fn) {
        return filterErrors(this, fn);
    };
    Observable.prototype.ignoreValues = function () {
        return ignoreValues(this);
    };
    Observable.prototype.ignoreErrors = function () {
        return ignoreErrors(this);
    };
    Observable.prototype.ignoreEnd = function () {
        return ignoreEnd(this);
    };
    Observable.prototype.beforeEnd = function (fn) {
        return beforeEnd(this, fn);
    };
    Observable.prototype.slidingWindow = function (max, min) {
        return slidingWindow(this, max, min);
    };
    Observable.prototype.bufferWhile = function (fn, options) {
        return bufferWhile(this, fn, options);
    };
    Observable.prototype.bufferWithCount = function (count, options) {
        return bufferWhile$1(this, count, options);
    };
    Observable.prototype.bufferWithTimeOrCount = function (wait, count, options) {
        return bufferWithTimeOrCount(this, wait, count, options);
    };
    Observable.prototype.transduce = function (transducer) {
        return transduce(this, transducer);
    };
    Observable.prototype.withHandler = function (fn) {
        return withHandler(this, fn);
    };
    Observable.prototype.combine = function (other, combinator) {
        return combine([
            this,
            other
        ], combinator);
    };
    Observable.prototype.zip = function (other, combinator) {
        return zip([
            this,
            other
        ], combinator);
    };
    Observable.prototype.merge = function (other) {
        return merge([
            this,
            other
        ]);
    };
    Observable.prototype.concat = function (other) {
        return concat$1([
            this,
            other
        ]);
    };
    var pool = function () {
        return new Pool();
    };
    Observable.prototype.flatMap = function (fn) {
        return new FlatMap(this, fn).setName(this, 'flatMap');
    };
    Observable.prototype.flatMapLatest = function (fn) {
        return new FlatMap(this, fn, {
            concurLim: 1,
            drop: 'old'
        }).setName(this, 'flatMapLatest');
    };
    Observable.prototype.flatMapFirst = function (fn) {
        return new FlatMap(this, fn, { concurLim: 1 }).setName(this, 'flatMapFirst');
    };
    Observable.prototype.flatMapConcat = function (fn) {
        return new FlatMap(this, fn, {
            queueLim: -1,
            concurLim: 1
        }).setName(this, 'flatMapConcat');
    };
    Observable.prototype.flatMapConcurLimit = function (fn, limit) {
        return new FlatMap(this, fn, {
            queueLim: -1,
            concurLim: limit
        }).setName(this, 'flatMapConcurLimit');
    };
    Observable.prototype.flatMapErrors = function (fn) {
        return new FlatMapErrors(this, fn).setName(this, 'flatMapErrors');
    };
    Observable.prototype.filterBy = function (other) {
        return filterBy(this, other);
    };
    Observable.prototype.sampledBy = function (other, combinator) {
        return sampledBy(this, other, combinator);
    };
    Observable.prototype.skipUntilBy = function (other) {
        return skipUntilBy(this, other);
    };
    Observable.prototype.takeUntilBy = function (other) {
        return takeUntilBy(this, other);
    };
    Observable.prototype.bufferBy = function (other, options) {
        return bufferBy(this, other, options);
    };
    Observable.prototype.bufferWhileBy = function (other, options) {
        return bufferWhileBy(this, other, options);
    };
    var DEPRECATION_WARNINGS = true;
    function dissableDeprecationWarnings() {
        DEPRECATION_WARNINGS = false;
    }
    function warn(msg) {
        if (DEPRECATION_WARNINGS && console && typeof console.warn === 'function') {
            var msg2 = '\nHere is an Error object for you containing the call stack:';
            console.warn(msg, msg2, new Error());
        }
    }
    Observable.prototype.awaiting = function (other) {
        warn('You are using deprecated .awaiting() method, see https://github.com/rpominov/kefir/issues/145');
        return awaiting(this, other);
    };
    Observable.prototype.valuesToErrors = function (fn) {
        warn('You are using deprecated .valuesToErrors() method, see https://github.com/rpominov/kefir/issues/149');
        return valuesToErrors(this, fn);
    };
    Observable.prototype.errorsToValues = function (fn) {
        warn('You are using deprecated .errorsToValues() method, see https://github.com/rpominov/kefir/issues/149');
        return errorsToValues(this, fn);
    };
    Observable.prototype.endOnError = function () {
        warn('You are using deprecated .endOnError() method, see https://github.com/rpominov/kefir/issues/150');
        return endOnError(this);
    };
    var Kefir = {
        Observable: Observable,
        Stream: Stream,
        Property: Property,
        never: never,
        later: later,
        interval: interval,
        sequentially: sequentially,
        fromPoll: fromPoll,
        withInterval: withInterval,
        fromCallback: fromCallback,
        fromNodeCallback: fromNodeCallback,
        fromEvents: fromEvents,
        stream: stream,
        constant: constant,
        constantError: constantError,
        fromPromise: fromPromise,
        fromESObservable: fromESObservable,
        combine: combine,
        zip: zip,
        merge: merge,
        concat: concat$1,
        Pool: Pool,
        pool: pool,
        repeat: repeat,
        staticLand: staticLand
    };
    Kefir.Kefir = Kefir;
    exports.dissableDeprecationWarnings = dissableDeprecationWarnings;
    exports.Kefir = Kefir;
    exports.Observable = Observable;
    exports.Stream = Stream;
    exports.Property = Property;
    exports.never = never;
    exports.later = later;
    exports.interval = interval;
    exports.sequentially = sequentially;
    exports.fromPoll = fromPoll;
    exports.withInterval = withInterval;
    exports.fromCallback = fromCallback;
    exports.fromNodeCallback = fromNodeCallback;
    exports.fromEvents = fromEvents;
    exports.stream = stream;
    exports.constant = constant;
    exports.constantError = constantError;
    exports.fromPromise = fromPromise;
    exports.fromESObservable = fromESObservable;
    exports.combine = combine;
    exports.zip = zip;
    exports.merge = merge;
    exports.concat = concat$1;
    exports.Pool = Pool;
    exports.pool = pool;
    exports.repeat = repeat;
    exports.staticLand = staticLand;
    exports['default'] = Kefir;
    Object.defineProperty(exports, '__esModule', { value: true });
}));
/*can-util@3.0.1#js/make-array/make-array*/
define('can-util/js/make-array/make-array', function (require, exports, module) {
    var each = require('can-util/js/each/each');
    function makeArray(arr) {
        var ret = [];
        each(arr, function (a, i) {
            ret[i] = a;
        });
        return ret;
    }
    module.exports = makeArray;
});
/*can-stream@0.0.4#can-stream*/
define('can-stream', function (require, exports, module) {
    var compute = require('can-compute');
    var Kefir = require('kefir');
    var makeArray = require('can-util/js/make-array/make-array');
    var assign = require('can-util/js/assign/assign');
    var canEvent = require('can-event');
    var canStream = {};
    canStream.singleComputeToStream = function (compute) {
        return Kefir.stream(function (emitter) {
            var changeHandler = function (ev, newVal) {
                emitter.emit(newVal);
            };
            compute.on('change', changeHandler);
            emitter.emit(compute());
            return function () {
                compute.off('change', changeHandler);
            };
        });
    };
    canStream.toStreamFromCompute = function () {
        var computes = makeArray(arguments);
        var callback;
        if (computes[computes.length - 1].isComputed) {
            callback = function () {
                return arguments.length > 1 ? Kefir.merge(arguments) : arguments[0];
            };
        } else {
            callback = computes.pop();
        }
        var streams = computes.map(canStream.singleComputeToStream);
        return callback.apply(this, streams);
    };
    canStream.toStreamFromProperty = function (obs, propName) {
        return canStream.toStreamFromCompute(compute(obs, propName));
    };
    canStream.toStreamFromEvent = function () {
        var obs = arguments[0];
        var eventName, propName;
        if (arguments.length === 2) {
            eventName = arguments[1];
            return Kefir.stream(function (emitter) {
                var handler = function (ev) {
                    var clone = assign({}, ev);
                    clone.args = Array.prototype.slice.call(arguments, 1);
                    emitter.emit(clone);
                };
                canEvent.addEventListener.call(obs, eventName, handler);
                return function () {
                    canEvent.removeEventListener.call(obs, eventName, handler);
                };
            });
        } else {
            propName = arguments[1];
            eventName = arguments[2];
            var propValueStream = canStream.toStreamFromProperty(obs, propName);
            return Kefir.stream(function (emitter) {
                var handler = function (ev) {
                    var clone = assign({}, ev);
                    clone.args = Array.prototype.slice.call(arguments, 1);
                    emitter.emit(clone);
                };
                var curValue;
                propValueStream.onValue(function (value) {
                    if (curValue) {
                        canEvent.removeEventListener.call(curValue, eventName, handler);
                    }
                    if (value) {
                        canEvent.addEventListener.call(value, eventName, handler);
                    }
                    curValue = value;
                });
                return function () {
                    if (curValue) {
                        canEvent.removeEventListener.call(curValue, eventName, handler);
                    }
                };
            });
        }
    };
    canStream.toSingleStream = function () {
        return Kefir.merge(arguments);
    };
    canStream.toStream = function () {
        if (arguments.length === 1) {
            return canStream.toStreamFromCompute(arguments[0]);
        } else if (arguments.length > 1) {
            var obs = arguments[0];
            var eventNameOrPropName = arguments[1].trim();
            if (eventNameOrPropName.indexOf(' ') === -1) {
                if (eventNameOrPropName.indexOf('.') === 0) {
                    return canStream.toStreamFromProperty(obs, eventNameOrPropName.slice(1));
                } else {
                    return canStream.toStreamFromEvent(obs, eventNameOrPropName);
                }
            } else {
                var splitEventNameAndProperty = eventNameOrPropName.split(' ');
                return canStream.toStreamFromEvent(obs, splitEventNameAndProperty[0].slice(1), splitEventNameAndProperty[1]);
            }
        }
        return undefined;
    };
    module.exports = canStream;
});
/*can-util@3.0.1#js/is-function/is-function*/
define('can-util/js/is-function/is-function', function (require, exports, module) {
    var isFunction = function () {
        if (typeof document !== 'undefined' && typeof document.getElementsByTagName('body') === 'function') {
            return function (value) {
                return Object.prototype.toString.call(value) === '[object Function]';
            };
        }
        return function (value) {
            return typeof value === 'function';
        };
    }();
    module.exports = isFunction;
});
/*can-util@3.0.1#js/deep-assign/deep-assign*/
define('can-util/js/deep-assign/deep-assign', function (require, exports, module) {
    var isArray = require('can-util/js/is-array/is-array');
    var isFunction = require('can-util/js/is-function/is-function');
    var isPlainObject = require('can-util/js/is-plain-object/is-plain-object');
    function deepAssign() {
        var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length;
        if (typeof target !== 'object' && !isFunction(target)) {
            target = {};
        }
        if (length === i) {
            target = this;
            --i;
        }
        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    if (target === copy) {
                        continue;
                    }
                    if (copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && isArray(src) ? src : [];
                        } else {
                            clone = src && isPlainObject(src) ? src : {};
                        }
                        target[name] = deepAssign(clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    }
    module.exports = deepAssign;
});
/*can-construct@3.0.1#can-construct*/
define('can-construct', function (require, exports, module) {
    'use strict';
    var assign = require('can-util/js/assign/assign');
    var deepAssign = require('can-util/js/deep-assign/deep-assign');
    var dev = require('can-util/js/dev/dev');
    var makeArray = require('can-util/js/make-array/make-array');
    var types = require('can-util/js/types/types');
    var namespace = require('can-util/namespace');
    var initializing = 0;
    var Construct = function () {
        if (arguments.length) {
            return Construct.extend.apply(Construct, arguments);
        }
    };
    var canGetDescriptor;
    try {
        Object.getOwnPropertyDescriptor({});
        canGetDescriptor = true;
    } catch (e) {
        canGetDescriptor = false;
    }
    var getDescriptor = function (newProps, name) {
            var descriptor = Object.getOwnPropertyDescriptor(newProps, name);
            if (descriptor && (descriptor.get || descriptor.set)) {
                return descriptor;
            }
            return null;
        }, inheritGetterSetter = function (newProps, oldProps, addTo) {
            addTo = addTo || newProps;
            var descriptor;
            for (var name in newProps) {
                if (descriptor = getDescriptor(newProps, name)) {
                    this._defineProperty(addTo, oldProps, name, descriptor);
                } else {
                    Construct._overwrite(addTo, oldProps, name, newProps[name]);
                }
            }
        }, simpleInherit = function (newProps, oldProps, addTo) {
            addTo = addTo || newProps;
            for (var name in newProps) {
                Construct._overwrite(addTo, oldProps, name, newProps[name]);
            }
        };
    assign(Construct, {
        constructorExtends: true,
        newInstance: function () {
            var inst = this.instance(), args;
            if (inst.setup) {
                Object.defineProperty(inst, '__inSetup', {
                    configurable: true,
                    enumerable: false,
                    value: true,
                    writable: true
                });
                args = inst.setup.apply(inst, arguments);
                inst.__inSetup = false;
            }
            if (inst.init) {
                inst.init.apply(inst, args || arguments);
            }
            return inst;
        },
        _inherit: canGetDescriptor ? inheritGetterSetter : simpleInherit,
        _defineProperty: function (what, oldProps, propName, descriptor) {
            Object.defineProperty(what, propName, descriptor);
        },
        _overwrite: function (what, oldProps, propName, val) {
            what[propName] = val;
        },
        setup: function (base) {
            this.defaults = deepAssign(true, {}, base.defaults, this.defaults);
        },
        instance: function () {
            initializing = 1;
            var inst = new this();
            initializing = 0;
            return inst;
        },
        extend: function (name, staticProperties, instanceProperties) {
            var shortName = name, klass = staticProperties, proto = instanceProperties;
            if (typeof shortName !== 'string') {
                proto = klass;
                klass = shortName;
                shortName = null;
            }
            if (!proto) {
                proto = klass;
                klass = null;
            }
            proto = proto || {};
            var _super_class = this, _super = this.prototype, Constructor, prototype;
            prototype = this.instance();
            Construct._inherit(proto, _super, prototype);
            if (shortName) {
            } else if (klass && klass.shortName) {
                shortName = klass.shortName;
            } else if (this.shortName) {
                shortName = this.shortName;
            }
            function init() {
                if (!initializing) {
                    return (!this || this.constructor !== Constructor) && arguments.length && Constructor.constructorExtends ? Constructor.extend.apply(Constructor, arguments) : Constructor.newInstance.apply(Constructor, arguments);
                }
            }
            if (typeof constructorName === 'undefined') {
                Constructor = function () {
                    return init.apply(this, arguments);
                };
            }
            for (var propName in _super_class) {
                if (_super_class.hasOwnProperty(propName)) {
                    Constructor[propName] = _super_class[propName];
                }
            }
            Construct._inherit(klass, _super_class, Constructor);
            assign(Constructor, {
                constructor: Constructor,
                prototype: prototype
            });
            if (shortName !== undefined) {
                Constructor.shortName = shortName;
            }
            Constructor.prototype.constructor = Constructor;
            var t = [_super_class].concat(makeArray(arguments)), args = Constructor.setup.apply(Constructor, t);
            if (Constructor.init) {
                Constructor.init.apply(Constructor, args || t);
            }
            return Constructor;
        }
    });
    Construct.prototype.setup = function () {
    };
    Construct.prototype.init = function () {
    };
    var oldIsConstructor = types.isConstructor;
    types.isConstructor = function (obj) {
        return obj.prototype instanceof Construct || oldIsConstructor.call(null, obj);
    };
    module.exports = namespace.Construct = Construct;
});
/*can-define@1.0.0#define-helpers/define-helpers*/
define('can-define/define-helpers/define-helpers', function (require, exports, module) {
    var assign = require('can-util/js/assign/assign');
    var CID = require('can-util/js/cid/cid');
    var define = require('can-define');
    var canBatch = require('can-event/batch/batch');
    var canEvent = require('can-event');
    var hasMethod = function (obj, method) {
        return obj && typeof obj === 'object' && method in obj;
    };
    var defineHelpers = {
        extendedSetup: function (props) {
            assign(this, props);
        },
        toObject: function (map, props, where, Type) {
            if (props instanceof Type) {
                props.each(function (value, prop) {
                    where[prop] = value;
                });
                return where;
            } else {
                return props;
            }
        },
        defineExpando: function (map, prop, value) {
            var constructorDefines = map._define.definitions;
            if (constructorDefines && constructorDefines[prop]) {
                return;
            }
            var instanceDefines = map._instanceDefinitions;
            if (!instanceDefines) {
                instanceDefines = map._instanceDefinitions = {};
            }
            if (!instanceDefines[prop]) {
                var defaultDefinition = map._define.defaultDefinition || { type: define.types.observable };
                define.property(map, prop, defaultDefinition, {}, {});
                map._data[prop] = defaultDefinition.type ? defaultDefinition.type(value) : define.types.observable(value);
                instanceDefines[prop] = defaultDefinition;
                canBatch.start();
                canEvent.dispatch.call(map, {
                    type: '__keys',
                    target: map
                });
                if (map._data[prop] !== undefined) {
                    canEvent.dispatch.call(map, {
                        type: prop,
                        target: map
                    }, [
                        map._data[prop],
                        undefined
                    ]);
                }
                canBatch.stop();
                return true;
            }
        },
        getValue: function (map, name, val, how) {
            if (how === 'serialize') {
                var constructorDefinitions = map._define.definitions;
                var propDef = constructorDefinitions[name];
                if (propDef && typeof propDef.serialize === 'function') {
                    return propDef.serialize.call(map, val, name);
                }
                var defaultDefinition = map._define.defaultDefinition;
                if (defaultDefinition && typeof defaultDefinition.serialize === 'function') {
                    return defaultDefinition.serialize.call(map, val, name);
                }
            }
            if (hasMethod(val, how)) {
                return val[how]();
            } else {
                return val;
            }
        },
        serialize: function () {
            var serializeMap = null;
            return function (map, how, where) {
                var cid = CID(map), firstSerialize = false;
                if (!serializeMap) {
                    firstSerialize = true;
                    serializeMap = {
                        get: {},
                        serialize: {}
                    };
                }
                serializeMap[how][cid] = where;
                map.each(function (val, name) {
                    var result, isObservable = hasMethod(val, how), serialized = isObservable && serializeMap[how][CID(val)];
                    if (serialized) {
                        result = serialized;
                    } else {
                        result = defineHelpers.getValue(map, name, val, how);
                    }
                    if (result !== undefined) {
                        where[name] = result;
                    }
                });
                if (firstSerialize) {
                    serializeMap = null;
                }
                return where;
            };
        }()
    };
    module.exports = defineHelpers;
});
/*can-define@1.0.0#map/map*/
define('can-define/map/map', function (require, exports, module) {
    var Construct = require('can-construct');
    var define = require('can-define');
    var assign = require('can-util/js/assign/assign');
    var isArray = require('can-util/js/is-array/is-array');
    var isPlainObject = require('can-util/js/is-plain-object/is-plain-object');
    var defineHelpers = require('can-define/define-helpers/define-helpers');
    var Observation = require('can-observation');
    var types = require('can-util/js/types/types');
    var canBatch = require('can-event/batch/batch');
    var ns = require('can-util/namespace');
    var readWithoutObserve = Observation.ignore(function (map, prop) {
        return map[prop];
    });
    var eachDefinition = function (map, cb, thisarg, definitions, observe) {
        for (var prop in definitions) {
            var definition = definitions[prop];
            if (typeof definition !== 'object' || ('serialize' in definition ? !!definition.serialize : !definition.get)) {
                var item = observe === false ? readWithoutObserve(map, prop) : map[prop];
                if (cb.call(thisarg || item, item, prop, map) === false) {
                    return false;
                }
            }
        }
    };
    var setProps = function (props, remove) {
        props = assign({}, props);
        var prop, self = this, newVal;
        canBatch.start();
        this.each(function (curVal, prop) {
            if (prop === '_cid') {
                return;
            }
            newVal = props[prop];
            if (newVal === undefined) {
                if (remove) {
                    self[prop] = undefined;
                }
                return;
            }
            if (typeof curVal !== 'object' || curVal === null) {
                self.set(prop, newVal);
            } else if ('set' in curVal && isPlainObject(newVal)) {
                curVal.set(newVal, remove);
            } else if ('attr' in curVal && (isPlainObject(newVal) || isArray(newVal))) {
                curVal.attr(newVal, remove);
            } else if ('replace' in curVal && isArray(newVal)) {
                curVal.replace(newVal);
            } else if (curVal !== newVal) {
                self.set(prop, newVal);
            }
            delete props[prop];
        }, this, false);
        for (prop in props) {
            if (prop !== '_cid') {
                newVal = props[prop];
                this.set(prop, newVal);
            }
        }
        canBatch.stop();
        return this;
    };
    var DefineMap = Construct.extend('DefineMap', {
        setup: function (base) {
            if (DefineMap) {
                var prototype = this.prototype;
                define(prototype, prototype, base.prototype._define);
                this.prototype.setup = function (props) {
                    define.setup.call(this, defineHelpers.toObject(this, props, {}, DefineMap), this.constructor.seal);
                };
            }
        }
    }, {
        setup: function (props, sealed) {
            if (!this._define) {
                Object.defineProperty(this, '_define', {
                    enumerable: false,
                    value: { definitions: {} }
                });
                Object.defineProperty(this, '_data', {
                    enumerable: false,
                    value: {}
                });
            }
            define.setup.call(this, defineHelpers.toObject(this, props, {}, DefineMap), sealed === true);
        },
        get: function (prop) {
            if (arguments.length) {
                if (prop in this || Object.isSealed(this)) {
                    return this[prop];
                } else {
                    Observation.add(this, prop);
                    return this[prop];
                }
            } else {
                return defineHelpers.serialize(this, 'get', {});
            }
        },
        set: function (prop, value) {
            if (typeof prop === 'object') {
                return setProps.call(this, prop, value);
            }
            var defined = defineHelpers.defineExpando(this, prop, value);
            if (!defined) {
                this[prop] = value;
            }
            return this;
        },
        serialize: function () {
            return defineHelpers.serialize(this, 'serialize', {});
        },
        forEach: function (cb, thisarg, observe) {
            if (observe !== false) {
                Observation.add(this, '__keys');
            }
            var res;
            var constructorDefinitions = this._define.definitions;
            if (constructorDefinitions) {
                res = eachDefinition(this, cb, thisarg, constructorDefinitions, observe);
            }
            if (res === false) {
                return this;
            }
            if (this._instanceDefinitions) {
                eachDefinition(this, cb, thisarg, this._instanceDefinitions, observe);
            }
            return this;
        },
        '*': { type: define.types.observable }
    });
    for (var prop in define.eventsProto) {
        Object.defineProperty(DefineMap.prototype, prop, {
            enumerable: false,
            value: define.eventsProto[prop]
        });
    }
    types.DefineMap = DefineMap;
    types.DefaultMap = DefineMap;
    DefineMap.prototype.toObject = function () {
        console.warn('Use DefineMap::get instead of DefineMap::toObject');
        return this.get();
    };
    DefineMap.prototype.each = DefineMap.prototype.forEach;
    var oldIsMapLike = types.isMapLike;
    types.isMapLike = function (obj) {
        return obj instanceof DefineMap || oldIsMapLike.apply(this, arguments);
    };
    module.exports = ns.DefineMap = DefineMap;
});
/*can-define@1.0.0#list/list*/
define('can-define/list/list', function (require, exports, module) {
    var Construct = require('can-construct');
    var define = require('can-define');
    var make = define.make;
    var canEvent = require('can-event');
    var canBatch = require('can-event/batch/batch');
    var Observation = require('can-observation');
    var defineHelpers = require('can-define/define-helpers/define-helpers');
    var assign = require('can-util/js/assign/assign');
    var each = require('can-util/js/each/each');
    var isArray = require('can-util/js/is-array/is-array');
    var makeArray = require('can-util/js/make-array/make-array');
    var types = require('can-util/js/types/types');
    var ns = require('can-util/namespace');
    var splice = [].splice;
    var serializeNonTypes = function (MapType, arg, args) {
        if (arg && arg.serialize && !(arg instanceof MapType)) {
            args.push(new MapType(arg.serialize()));
        } else {
            args.push(arg);
        }
    };
    var identity = function (x) {
        return x;
    };
    var makeFilterCallback = function (props) {
        return function (item) {
            for (var prop in props) {
                if (item[prop] !== props[prop]) {
                    return false;
                }
            }
            return true;
        };
    };
    var DefineList = Construct.extend('DefineList', {
        setup: function (base) {
            if (DefineList) {
                var prototype = this.prototype;
                var result = define(prototype, prototype, base.prototype._define);
                var itemsDefinition = result.definitions['#'] || result.defaultDefinition;
                if (itemsDefinition) {
                    if (itemsDefinition.Type) {
                        this.prototype.__type = make.set.Type('*', itemsDefinition.Type, identity);
                    } else if (itemsDefinition.type) {
                        this.prototype.__type = make.set.type('*', itemsDefinition.type, identity);
                    }
                }
            }
        }
    }, {
        setup: function (items) {
            if (!this._define) {
                Object.defineProperty(this, '_define', {
                    enumerable: false,
                    value: { definitions: {} }
                });
                Object.defineProperty(this, '_data', {
                    enumerable: false,
                    value: {}
                });
            }
            define.setup.call(this, {}, false);
            this._length = 0;
            if (items) {
                this.splice.apply(this, [
                    0,
                    0
                ].concat(defineHelpers.toObject(this, items, [], DefineList)));
            }
        },
        __type: define.types.observable,
        _triggerChange: function (attr, how, newVal, oldVal) {
            canBatch.start();
            var index = +attr;
            if (!~('' + attr).indexOf('.') && !isNaN(index)) {
                var itemsDefinition = this._define.definitions['#'];
                if (how === 'add') {
                    if (itemsDefinition && typeof itemsDefinition.added === 'function') {
                        Observation.ignore(itemsDefinition.added).call(this, newVal, index);
                    }
                    canEvent.dispatch.call(this, how, [
                        newVal,
                        index
                    ]);
                    canEvent.dispatch.call(this, 'length', [this._length]);
                } else if (how === 'remove') {
                    if (itemsDefinition && typeof itemsDefinition.removed === 'function') {
                        Observation.ignore(itemsDefinition.removed).call(this, oldVal, index);
                    }
                    canEvent.dispatch.call(this, how, [
                        oldVal,
                        index
                    ]);
                    canEvent.dispatch.call(this, 'length', [this._length]);
                } else {
                    canEvent.dispatch.call(this, how, [
                        newVal,
                        index
                    ]);
                }
            } else {
                canEvent.dispatch.call(this, {
                    type: '' + attr,
                    target: this
                }, [
                    newVal,
                    oldVal
                ]);
            }
            canBatch.stop();
        },
        get: function (index) {
            if (arguments.length) {
                Observation.add(this, '' + index);
                return this[index];
            } else {
                return defineHelpers.serialize(this, 'get', []);
            }
        },
        set: function (prop, value) {
            if (typeof prop !== 'object') {
                prop = isNaN(+prop) || prop % 1 ? prop : +prop;
                if (typeof prop === 'number') {
                    if (typeof prop === 'number' && prop > this._length - 1) {
                        var newArr = new Array(prop + 1 - this._length);
                        newArr[newArr.length - 1] = value;
                        this.push.apply(this, newArr);
                        return newArr;
                    }
                    this.splice(prop, 1, value);
                } else {
                    var defined = defineHelpers.defineExpando(this, prop, value);
                    if (!defined) {
                        this[prop] = value;
                    }
                }
            } else {
                if (isArray(prop)) {
                    if (value) {
                        this.replace(prop);
                    } else {
                        this.splice.apply(this, [
                            0,
                            prop.length
                        ].concat(prop));
                    }
                } else {
                    each(prop, function (value, prop) {
                        this.set(prop, value);
                    }, this);
                }
            }
            return this;
        },
        _items: function () {
            var arr = [];
            this._each(function (item) {
                arr.push(item);
            });
            return arr;
        },
        _each: function (callback) {
            for (var i = 0, len = this._length; i < len; i++) {
                callback(this[i], i);
            }
        },
        splice: function (index, howMany) {
            var args = makeArray(arguments), added = [], i, len, listIndex, allSame = args.length > 2;
            index = index || 0;
            for (i = 0, len = args.length - 2; i < len; i++) {
                listIndex = i + 2;
                args[listIndex] = this.__type(args[listIndex], listIndex);
                added.push(args[listIndex]);
                if (this[i + index] !== args[listIndex]) {
                    allSame = false;
                }
            }
            if (allSame && this._length <= added.length) {
                return added;
            }
            if (howMany === undefined) {
                howMany = args[1] = this._length - index;
            }
            var removed = splice.apply(this, args);
            canBatch.start();
            if (howMany > 0) {
                this._triggerChange('' + index, 'remove', undefined, removed);
            }
            if (args.length > 2) {
                this._triggerChange('' + index, 'add', added, removed);
            }
            canBatch.stop();
            return removed;
        },
        serialize: function () {
            return defineHelpers.serialize(this, 'serialize', []);
        }
    });
    var getArgs = function (args) {
        return args[0] && Array.isArray(args[0]) ? args[0] : makeArray(args);
    };
    each({
        push: 'length',
        unshift: 0
    }, function (where, name) {
        var orig = [][name];
        DefineList.prototype[name] = function () {
            var args = [], len = where ? this._length : 0, i = arguments.length, res, val;
            while (i--) {
                val = arguments[i];
                args[i] = this.__type(val, i);
            }
            res = orig.apply(this, args);
            if (!this.comparator || args.length) {
                this._triggerChange('' + len, 'add', args, undefined);
            }
            return res;
        };
    });
    each({
        pop: 'length',
        shift: 0
    }, function (where, name) {
        DefineList.prototype[name] = function () {
            if (!this._length) {
                return undefined;
            }
            var args = getArgs(arguments), len = where && this._length ? this._length - 1 : 0;
            var res = [][name].apply(this, args);
            this._triggerChange('' + len, 'remove', undefined, [res]);
            return res;
        };
    });
    assign(DefineList.prototype, {
        indexOf: function (item, fromIndex) {
            for (var i = fromIndex || 0, len = this.length; i < len; i++) {
                if (this.get(i) === item) {
                    return i;
                }
            }
            return -1;
        },
        join: function () {
            Observation.add(this, 'length');
            return [].join.apply(this, arguments);
        },
        reverse: function () {
            var list = [].reverse.call(this._items());
            return this.replace(list);
        },
        slice: function () {
            Observation.add(this, 'length');
            var temp = Array.prototype.slice.apply(this, arguments);
            return new this.constructor(temp);
        },
        concat: function () {
            var args = [], MapType = this.constructor.DefineMap;
            each(arguments, function (arg) {
                if (types.isListLike(arg) || Array.isArray(arg)) {
                    var arr = types.isListLike(arg) ? makeArray(arg) : arg;
                    each(arr, function (innerArg) {
                        serializeNonTypes(MapType, innerArg, args);
                    });
                } else {
                    serializeNonTypes(MapType, arg, args);
                }
            });
            return new this.constructor(Array.prototype.concat.apply(makeArray(this), args));
        },
        forEach: function (cb, thisarg) {
            var item;
            for (var i = 0, len = this.length; i < len; i++) {
                item = this.get(i);
                if (cb.call(thisarg || item, item, i, this) === false) {
                    break;
                }
            }
            return this;
        },
        replace: function (newList) {
            this.splice.apply(this, [
                0,
                this._length
            ].concat(makeArray(newList || [])));
            return this;
        },
        filter: function (callback, thisArg) {
            var filteredList = [], self = this, filtered;
            if (typeof callback === 'object') {
                callback = makeFilterCallback(callback);
            }
            this.each(function (item, index, list) {
                filtered = callback.call(thisArg | self, item, index, self);
                if (filtered) {
                    filteredList.push(item);
                }
            });
            return new this.constructor(filteredList);
        },
        map: function (callback, thisArg) {
            var mappedList = [], self = this;
            this.each(function (item, index, list) {
                var mapped = callback.call(thisArg | self, item, index, self);
                mappedList.push(mapped);
            });
            return new this.constructor(mappedList);
        },
        sort: function (compareFunction) {
            Array.prototype.sort.call(this, compareFunction);
            return this.replace(this.get());
        }
    });
    for (var prop in define.eventsProto) {
        Object.defineProperty(DefineList.prototype, prop, {
            enumerable: false,
            value: define.eventsProto[prop],
            writable: true
        });
    }
    Object.defineProperty(DefineList.prototype, 'length', {
        get: function () {
            if (!this.__inSetup) {
                Observation.add(this, 'length');
            }
            return this._length;
        },
        set: function (newVal) {
            this._length = newVal;
        },
        enumerable: true
    });
    var oldIsListLike = types.isListLike;
    types.isListLike = function (obj) {
        return obj instanceof DefineList || oldIsListLike.apply(this, arguments);
    };
    DefineList.prototype.each = DefineList.prototype.forEach;
    DefineList.prototype.attr = function (prop, value) {
        console.warn('DefineMap::attr shouldn\'t be called');
        if (arguments.length === 0) {
            return this.get();
        } else if (prop && typeof prop === 'object') {
            return this.set.apply(this, arguments);
        } else if (arguments.length === 1) {
            return this.get(prop);
        } else {
            return this.set(prop, value);
        }
    };
    DefineList.prototype.item = function (index, value) {
        if (arguments.length === 1) {
            return this.get(index);
        } else {
            return this.set(index, value);
        }
    };
    DefineList.prototype.items = function () {
        console.warn('DefineList::get should should be used instead of DefineList::items');
        return this.get();
    };
    types.DefineList = DefineList;
    types.DefaultList = DefineList;
    module.exports = ns.DefineList = DefineList;
});
/*can-define-stream@0.0.1#can-define-stream*/
define('can-define-stream', function (require, exports, module) {
    var define = require('can-define');
    var canStream = require('can-stream');
    var assign = require('can-util/js/assign/assign');
    var DefineMap = require('can-define/map/map');
    var DefineList = require('can-define/list/list');
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
/*[global-shim-end]*/
(function(){ // jshint ignore:line
	window._define = window.define;
	window.define = window.define.orig;
}
)();