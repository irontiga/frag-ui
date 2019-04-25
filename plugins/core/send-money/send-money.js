(function () {
  'use strict';

  var isPure = false;

  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global = typeof window == 'object' && window && window.Math == Math ? window
    : typeof self == 'object' && self && self.Math == Math ? self
    // eslint-disable-next-line no-new-func
    : Function('return this')();

  var fails = function (exec) {
    try {
      return !!exec();
    } catch (error) {
      return true;
    }
  };

  // Thank's IE8 for his funny defineProperty
  var descriptors = !fails(function () {
    return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
  });

  var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
  var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

  // Nashorn ~ JDK8 bug
  var NASHORN_BUG = nativeGetOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

  var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
    var descriptor = nativeGetOwnPropertyDescriptor(this, V);
    return !!descriptor && descriptor.enumerable;
  } : nativePropertyIsEnumerable;

  var objectPropertyIsEnumerable = {
  	f: f
  };

  var createPropertyDescriptor = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var toString = {}.toString;

  var classofRaw = function (it) {
    return toString.call(it).slice(8, -1);
  };

  // fallback for non-array-like ES3 and non-enumerable old V8 strings


  var split = ''.split;

  var indexedObject = fails(function () {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins
    return !Object('z').propertyIsEnumerable(0);
  }) ? function (it) {
    return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
  } : Object;

  // `RequireObjectCoercible` abstract operation
  // https://tc39.github.io/ecma262/#sec-requireobjectcoercible
  var requireObjectCoercible = function (it) {
    if (it == undefined) throw TypeError("Can't call method on " + it);
    return it;
  };

  // toObject with fallback for non-array-like ES3 strings



  var toIndexedObject = function (it) {
    return indexedObject(requireObjectCoercible(it));
  };

  var isObject = function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };

  // 7.1.1 ToPrimitive(input [, PreferredType])

  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string
  var toPrimitive = function (it, S) {
    if (!isObject(it)) return it;
    var fn, val;
    if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
    if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
    if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
    throw TypeError("Can't convert object to primitive value");
  };

  var hasOwnProperty = {}.hasOwnProperty;

  var has = function (it, key) {
    return hasOwnProperty.call(it, key);
  };

  var document$1 = global.document;
  // typeof document.createElement is 'object' in old IE
  var exist = isObject(document$1) && isObject(document$1.createElement);

  var documentCreateElement = function (it) {
    return exist ? document$1.createElement(it) : {};
  };

  // Thank's IE8 for his funny defineProperty
  var ie8DomDefine = !descriptors && !fails(function () {
    return Object.defineProperty(documentCreateElement('div'), 'a', {
      get: function () { return 7; }
    }).a != 7;
  });

  var nativeGetOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

  var f$1 = descriptors ? nativeGetOwnPropertyDescriptor$1 : function getOwnPropertyDescriptor(O, P) {
    O = toIndexedObject(O);
    P = toPrimitive(P, true);
    if (ie8DomDefine) try {
      return nativeGetOwnPropertyDescriptor$1(O, P);
    } catch (error) { /* empty */ }
    if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
  };

  var objectGetOwnPropertyDescriptor = {
  	f: f$1
  };

  var anObject = function (it) {
    if (!isObject(it)) {
      throw TypeError(String(it) + ' is not an object');
    } return it;
  };

  var nativeDefineProperty = Object.defineProperty;

  var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
    anObject(O);
    P = toPrimitive(P, true);
    anObject(Attributes);
    if (ie8DomDefine) try {
      return nativeDefineProperty(O, P, Attributes);
    } catch (error) { /* empty */ }
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var objectDefineProperty = {
  	f: f$2
  };

  var hide = descriptors ? function (object, key, value) {
    return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var setGlobal = function (key, value) {
    try {
      hide(global, key, value);
    } catch (error) {
      global[key] = value;
    } return value;
  };

  var shared = createCommonjsModule(function (module) {
  var SHARED = '__core-js_shared__';
  var store = global[SHARED] || setGlobal(SHARED, {});

  (module.exports = function (key, value) {
    return store[key] || (store[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: '3.0.1',
    mode: 'global',
    copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
  });
  });

  var functionToString = shared('native-function-to-string', Function.toString);

  var WeakMap$1 = global.WeakMap;

  var nativeWeakMap = typeof WeakMap$1 === 'function' && /native code/.test(functionToString.call(WeakMap$1));

  var id = 0;
  var postfix = Math.random();

  var uid = function (key) {
    return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + postfix).toString(36));
  };

  var shared$1 = shared('keys');


  var sharedKey = function (key) {
    return shared$1[key] || (shared$1[key] = uid(key));
  };

  var hiddenKeys = {};

  var WeakMap$2 = global.WeakMap;
  var set, get, has$1;

  var enforce = function (it) {
    return has$1(it) ? get(it) : set(it, {});
  };

  var getterFor = function (TYPE) {
    return function (it) {
      var state;
      if (!isObject(it) || (state = get(it)).type !== TYPE) {
        throw TypeError('Incompatible receiver, ' + TYPE + ' required');
      } return state;
    };
  };

  if (nativeWeakMap) {
    var store = new WeakMap$2();
    var wmget = store.get;
    var wmhas = store.has;
    var wmset = store.set;
    set = function (it, metadata) {
      wmset.call(store, it, metadata);
      return metadata;
    };
    get = function (it) {
      return wmget.call(store, it) || {};
    };
    has$1 = function (it) {
      return wmhas.call(store, it);
    };
  } else {
    var STATE = sharedKey('state');
    hiddenKeys[STATE] = true;
    set = function (it, metadata) {
      hide(it, STATE, metadata);
      return metadata;
    };
    get = function (it) {
      return has(it, STATE) ? it[STATE] : {};
    };
    has$1 = function (it) {
      return has(it, STATE);
    };
  }

  var internalState = {
    set: set,
    get: get,
    has: has$1,
    enforce: enforce,
    getterFor: getterFor
  };

  var redefine = createCommonjsModule(function (module) {
  var getInternalState = internalState.get;
  var enforceInternalState = internalState.enforce;
  var TEMPLATE = String(functionToString).split('toString');

  shared('inspectSource', function (it) {
    return functionToString.call(it);
  });

  (module.exports = function (O, key, value, options) {
    var unsafe = options ? !!options.unsafe : false;
    var simple = options ? !!options.enumerable : false;
    var noTargetGet = options ? !!options.noTargetGet : false;
    if (typeof value == 'function') {
      if (typeof key == 'string' && !has(value, 'name')) hide(value, 'name', key);
      enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
    }
    if (O === global) {
      if (simple) O[key] = value;
      else setGlobal(key, value);
      return;
    } else if (!unsafe) {
      delete O[key];
    } else if (!noTargetGet && O[key]) {
      simple = true;
    }
    if (simple) O[key] = value;
    else hide(O, key, value);
  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
  })(Function.prototype, 'toString', function toString() {
    return typeof this == 'function' && getInternalState(this).source || functionToString.call(this);
  });
  });

  var ceil = Math.ceil;
  var floor = Math.floor;

  // `ToInteger` abstract operation
  // https://tc39.github.io/ecma262/#sec-tointeger
  var toInteger = function (argument) {
    return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
  };

  var min = Math.min;

  // `ToLength` abstract operation
  // https://tc39.github.io/ecma262/#sec-tolength
  var toLength = function (argument) {
    return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
  };

  var max = Math.max;
  var min$1 = Math.min;

  // Helper for a popular repeating case of the spec:
  // Let integer be ? ToInteger(index).
  // If integer < 0, let result be max((length + integer), 0); else let result be min(length, length).
  var toAbsoluteIndex = function (index, length) {
    var integer = toInteger(index);
    return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
  };

  // `Array.prototype.{ indexOf, includes }` methods implementation
  // false -> Array#indexOf
  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
  // true  -> Array#includes
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  var arrayIncludes = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIndexedObject($this);
      var length = toLength(O.length);
      var index = toAbsoluteIndex(fromIndex, length);
      var value;
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare
      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++];
        // eslint-disable-next-line no-self-compare
        if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
      } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
        if (O[index] === el) return IS_INCLUDES || index || 0;
      } return !IS_INCLUDES && -1;
    };
  };

  var arrayIndexOf = arrayIncludes(false);


  var objectKeysInternal = function (object, names) {
    var O = toIndexedObject(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while (names.length > i) if (has(O, key = names[i++])) {
      ~arrayIndexOf(result, key) || result.push(key);
    }
    return result;
  };

  // IE8- don't enum bug keys
  var enumBugKeys = [
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toLocaleString',
    'toString',
    'valueOf'
  ];

  // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)

  var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

  var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return objectKeysInternal(O, hiddenKeys$1);
  };

  var objectGetOwnPropertyNames = {
  	f: f$3
  };

  var f$4 = Object.getOwnPropertySymbols;

  var objectGetOwnPropertySymbols = {
  	f: f$4
  };

  var Reflect = global.Reflect;

  // all object keys, includes non-enumerable and symbols
  var ownKeys = Reflect && Reflect.ownKeys || function ownKeys(it) {
    var keys = objectGetOwnPropertyNames.f(anObject(it));
    var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
    return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
  };

  var copyConstructorProperties = function (target, source) {
    var keys = ownKeys(source);
    var defineProperty = objectDefineProperty.f;
    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  };

  var replacement = /#|\.prototype\./;

  var isForced = function (feature, detection) {
    var value = data[normalize(feature)];
    return value == POLYFILL ? true
      : value == NATIVE ? false
      : typeof detection == 'function' ? fails(detection)
      : !!detection;
  };

  var normalize = isForced.normalize = function (string) {
    return String(string).replace(replacement, '.').toLowerCase();
  };

  var data = isForced.data = {};
  var NATIVE = isForced.NATIVE = 'N';
  var POLYFILL = isForced.POLYFILL = 'P';

  var isForced_1 = isForced;

  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;






  /*
    options.target      - name of the target object
    options.global      - target is the global object
    options.stat        - export as static methods of target
    options.proto       - export as prototype methods of target
    options.real        - real prototype method for the `pure` version
    options.forced      - export even if the native feature is available
    options.bind        - bind methods to the target, required for the `pure` version
    options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
    options.unsafe      - use the simple assignment of property instead of delete + defineProperty
    options.sham        - add a flag to not completely full polyfills
    options.enumerable  - export as enumerable property
    options.noTargetGet - prevent calling a getter on target
  */
  var _export = function (options, source) {
    var TARGET = options.target;
    var GLOBAL = options.global;
    var STATIC = options.stat;
    var FORCED, target, key, targetProperty, sourceProperty, descriptor;
    if (GLOBAL) {
      target = global;
    } else if (STATIC) {
      target = global[TARGET] || setGlobal(TARGET, {});
    } else {
      target = (global[TARGET] || {}).prototype;
    }
    if (target) for (key in source) {
      sourceProperty = source[key];
      if (options.noTargetGet) {
        descriptor = getOwnPropertyDescriptor(target, key);
        targetProperty = descriptor && descriptor.value;
      } else targetProperty = target[key];
      FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
      // contained in target
      if (!FORCED && targetProperty !== undefined) {
        if (typeof sourceProperty === typeof targetProperty) continue;
        copyConstructorProperties(sourceProperty, targetProperty);
      }
      // add a flag to not completely full polyfills
      if (options.sham || (targetProperty && targetProperty.sham)) {
        hide(sourceProperty, 'sham', true);
      }
      // extend global
      redefine(target, key, sourceProperty, options);
    }
  };

  var aFunction = function (it) {
    if (typeof it != 'function') {
      throw TypeError(String(it) + ' is not a function');
    } return it;
  };

  var anInstance = function (it, Constructor, name) {
    if (!(it instanceof Constructor)) {
      throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
    } return it;
  };

  var iterators = {};

  // Chrome 38 Symbol has incorrect toString conversion
  var nativeSymbol = !fails(function () {
    // eslint-disable-next-line no-undef
    return !String(Symbol());
  });

  var store$1 = shared('wks');

  var Symbol$1 = global.Symbol;


  var wellKnownSymbol = function (name) {
    return store$1[name] || (store$1[name] = nativeSymbol && Symbol$1[name]
      || (nativeSymbol ? Symbol$1 : uid)('Symbol.' + name));
  };

  // check on default Array iterator

  var ITERATOR = wellKnownSymbol('iterator');
  var ArrayPrototype = Array.prototype;

  var isArrayIteratorMethod = function (it) {
    return it !== undefined && (iterators.Array === it || ArrayPrototype[ITERATOR] === it);
  };

  // optional / simple context binding
  var bindContext = function (fn, that, length) {
    aFunction(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 0: return function () {
        return fn.call(that);
      };
      case 1: return function (a) {
        return fn.call(that, a);
      };
      case 2: return function (a, b) {
        return fn.call(that, a, b);
      };
      case 3: return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
    }
    return function (/* ...args */) {
      return fn.apply(that, arguments);
    };
  };

  var TO_STRING_TAG = wellKnownSymbol('toStringTag');
  // ES3 wrong here
  var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

  // fallback for IE11 Script Access Denied error
  var tryGet = function (it, key) {
    try {
      return it[key];
    } catch (error) { /* empty */ }
  };

  // getting tag from ES6+ `Object.prototype.toString`
  var classof = function (it) {
    var O, tag, result;
    return it === undefined ? 'Undefined' : it === null ? 'Null'
      // @@toStringTag case
      : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag
      // builtinTag case
      : CORRECT_ARGUMENTS ? classofRaw(O)
      // ES3 arguments fallback
      : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
  };

  var ITERATOR$1 = wellKnownSymbol('iterator');


  var getIteratorMethod = function (it) {
    if (it != undefined) return it[ITERATOR$1]
      || it['@@iterator']
      || iterators[classof(it)];
  };

  // call something on iterator step with safe closing on error
  var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
    try {
      return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
    } catch (error) {
      var returnMethod = iterator['return'];
      if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
      throw error;
    }
  };

  var iterate = createCommonjsModule(function (module) {
  var BREAK = {};

  var exports = module.exports = function (iterable, fn, that, ENTRIES, ITERATOR) {
    var boundFunction = bindContext(fn, that, ENTRIES ? 2 : 1);
    var iterator, iterFn, index, length, result, step;

    if (ITERATOR) {
      iterator = iterable;
    } else {
      iterFn = getIteratorMethod(iterable);
      if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
      // optimisation for array iterators
      if (isArrayIteratorMethod(iterFn)) {
        for (index = 0, length = toLength(iterable.length); length > index; index++) {
          result = ENTRIES ? boundFunction(anObject(step = iterable[index])[0], step[1]) : boundFunction(iterable[index]);
          if (result === BREAK) return BREAK;
        } return;
      }
      iterator = iterFn.call(iterable);
    }

    while (!(step = iterator.next()).done) {
      if (callWithSafeIterationClosing(iterator, boundFunction, step.value, ENTRIES) === BREAK) return BREAK;
    }
  };

  exports.BREAK = BREAK;
  });

  var ITERATOR$2 = wellKnownSymbol('iterator');
  var SAFE_CLOSING = false;

  try {
    var called = 0;
    var iteratorWithReturn = {
      next: function () {
        return { done: !!called++ };
      },
      'return': function () {
        SAFE_CLOSING = true;
      }
    };
    iteratorWithReturn[ITERATOR$2] = function () {
      return this;
    };
  } catch (error) { /* empty */ }

  var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
    if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
    var ITERATION_SUPPORT = false;
    try {
      var object = {};
      object[ITERATOR$2] = function () {
        return {
          next: function () {
            return { done: ITERATION_SUPPORT = true };
          }
        };
      };
      exec(object);
    } catch (error) { /* empty */ }
    return ITERATION_SUPPORT;
  };

  var SPECIES = wellKnownSymbol('species');

  // `SpeciesConstructor` abstract operation
  // https://tc39.github.io/ecma262/#sec-speciesconstructor
  var speciesConstructor = function (O, defaultConstructor) {
    var C = anObject(O).constructor;
    var S;
    return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? defaultConstructor : aFunction(S);
  };

  var document$2 = global.document;

  var html = document$2 && document$2.documentElement;

  var set$1 = global.setImmediate;
  var clear = global.clearImmediate;
  var process = global.process;
  var MessageChannel = global.MessageChannel;
  var Dispatch = global.Dispatch;
  var counter = 0;
  var queue = {};
  var ONREADYSTATECHANGE = 'onreadystatechange';
  var defer, channel, port;

  var run = function () {
    var id = +this;
    // eslint-disable-next-line no-prototype-builtins
    if (queue.hasOwnProperty(id)) {
      var fn = queue[id];
      delete queue[id];
      fn();
    }
  };

  var listener = function (event) {
    run.call(event.data);
  };

  // Node.js 0.9+ & IE10+ has setImmediate, otherwise:
  if (!set$1 || !clear) {
    set$1 = function setImmediate(fn) {
      var args = [];
      var i = 1;
      while (arguments.length > i) args.push(arguments[i++]);
      queue[++counter] = function () {
        // eslint-disable-next-line no-new-func
        (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
      };
      defer(counter);
      return counter;
    };
    clear = function clearImmediate(id) {
      delete queue[id];
    };
    // Node.js 0.8-
    if (classofRaw(process) == 'process') {
      defer = function (id) {
        process.nextTick(bindContext(run, id, 1));
      };
    // Sphere (JS game engine) Dispatch API
    } else if (Dispatch && Dispatch.now) {
      defer = function (id) {
        Dispatch.now(bindContext(run, id, 1));
      };
    // Browsers with MessageChannel, includes WebWorkers
    } else if (MessageChannel) {
      channel = new MessageChannel();
      port = channel.port2;
      channel.port1.onmessage = listener;
      defer = bindContext(port.postMessage, port, 1);
    // Browsers with postMessage, skip WebWorkers
    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
    } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
      defer = function (id) {
        global.postMessage(id + '', '*');
      };
      global.addEventListener('message', listener, false);
    // IE8-
    } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
      defer = function (id) {
        html.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] = function () {
          html.removeChild(this);
          run.call(id);
        };
      };
    // Rest old browsers
    } else {
      defer = function (id) {
        setTimeout(bindContext(run, id, 1), 0);
      };
    }
  }

  var task = {
    set: set$1,
    clear: clear
  };

  var navigator = global.navigator;

  var userAgent = navigator && navigator.userAgent || '';

  var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;

  var macrotask = task.set;

  var MutationObserver = global.MutationObserver || global.WebKitMutationObserver;
  var process$1 = global.process;
  var Promise$1 = global.Promise;
  var IS_NODE = classofRaw(process$1) == 'process';
  // Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
  var queueMicrotaskDescriptor = getOwnPropertyDescriptor$1(global, 'queueMicrotask');
  var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

  var flush, head, last, notify, toggle, node, promise;

  // modern engines have queueMicrotask method
  if (!queueMicrotask) {
    flush = function () {
      var parent, fn;
      if (IS_NODE && (parent = process$1.domain)) parent.exit();
      while (head) {
        fn = head.fn;
        head = head.next;
        try {
          fn();
        } catch (error) {
          if (head) notify();
          else last = undefined;
          throw error;
        }
      } last = undefined;
      if (parent) parent.enter();
    };

    // Node.js
    if (IS_NODE) {
      notify = function () {
        process$1.nextTick(flush);
      };
    // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
    } else if (MutationObserver && !/(iPhone|iPod|iPad).*AppleWebKit/i.test(userAgent)) {
      toggle = true;
      node = document.createTextNode('');
      new MutationObserver(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
      notify = function () {
        node.data = toggle = !toggle;
      };
    // environments with maybe non-completely correct, but existent Promise
    } else if (Promise$1 && Promise$1.resolve) {
      // Promise.resolve without an argument throws an error in LG WebOS 2
      promise = Promise$1.resolve(undefined);
      notify = function () {
        promise.then(flush);
      };
    // for other environments - macrotask based on:
    // - setImmediate
    // - MessageChannel
    // - window.postMessag
    // - onreadystatechange
    // - setTimeout
    } else {
      notify = function () {
        // strange IE + webpack dev server bug - use .call(global)
        macrotask.call(global, flush);
      };
    }
  }

  var microtask = queueMicrotask || function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };

  // 25.4.1.5 NewPromiseCapability(C)


  var PromiseCapability = function (C) {
    var resolve, reject;
    this.promise = new C(function ($$resolve, $$reject) {
      if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
      resolve = $$resolve;
      reject = $$reject;
    });
    this.resolve = aFunction(resolve);
    this.reject = aFunction(reject);
  };

  var f$5 = function (C) {
    return new PromiseCapability(C);
  };

  var newPromiseCapability = {
  	f: f$5
  };

  var promiseResolve = function (C, x) {
    anObject(C);
    if (isObject(x) && x.constructor === C) return x;
    var promiseCapability = newPromiseCapability.f(C);
    var resolve = promiseCapability.resolve;
    resolve(x);
    return promiseCapability.promise;
  };

  var hostReportErrors = function (a, b) {
    var console = global.console;
    if (console && console.error) {
      arguments.length === 1 ? console.error(a) : console.error(a, b);
    }
  };

  var perform = function (exec) {
    try {
      return { error: false, value: exec() };
    } catch (error) {
      return { error: true, value: error };
    }
  };

  var redefineAll = function (target, src, options) {
    for (var key in src) redefine(target, key, src[key], options);
    return target;
  };

  var defineProperty = objectDefineProperty.f;

  var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');

  var setToStringTag = function (it, TAG, STATIC) {
    if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG$1)) {
      defineProperty(it, TO_STRING_TAG$1, { configurable: true, value: TAG });
    }
  };

  var path = global;

  var aFunction$1 = function (variable) {
    return typeof variable == 'function' ? variable : undefined;
  };

  var getBuiltIn = function (namespace, method) {
    return arguments.length < 2 ? aFunction$1(path[namespace]) || aFunction$1(global[namespace])
      : path[namespace] && path[namespace][method] || global[namespace] && global[namespace][method];
  };

  var SPECIES$1 = wellKnownSymbol('species');

  var setSpecies = function (CONSTRUCTOR_NAME) {
    var C = getBuiltIn(CONSTRUCTOR_NAME);
    var defineProperty = objectDefineProperty.f;
    if (descriptors && C && !C[SPECIES$1]) defineProperty(C, SPECIES$1, {
      configurable: true,
      get: function () { return this; }
    });
  };

  var PROMISE = 'Promise';










  var task$1 = task.set;






  var SPECIES$2 = wellKnownSymbol('species');


  var getInternalState = internalState.get;
  var setInternalState = internalState.set;
  var getInternalPromiseState = internalState.getterFor(PROMISE);
  var PromiseConstructor = global[PROMISE];
  var TypeError$1 = global.TypeError;
  var document$3 = global.document;
  var process$2 = global.process;
  var $fetch = global.fetch;
  var versions = process$2 && process$2.versions;
  var v8 = versions && versions.v8 || '';
  var newPromiseCapability$1 = newPromiseCapability.f;
  var newGenericPromiseCapability = newPromiseCapability$1;
  var IS_NODE$1 = classofRaw(process$2) == 'process';
  var DISPATCH_EVENT = !!(document$3 && document$3.createEvent && global.dispatchEvent);
  var UNHANDLED_REJECTION = 'unhandledrejection';
  var REJECTION_HANDLED = 'rejectionhandled';
  var PENDING = 0;
  var FULFILLED = 1;
  var REJECTED = 2;
  var HANDLED = 1;
  var UNHANDLED = 2;
  var Internal, OwnPromiseCapability, PromiseWrapper;

  var FORCED = isForced_1(PROMISE, function () {
    // correct subclassing with @@species support
    var promise = PromiseConstructor.resolve(1);
    var empty = function () { /* empty */ };
    var FakePromise = (promise.constructor = {})[SPECIES$2] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return !((IS_NODE$1 || typeof PromiseRejectionEvent == 'function')
      && (!isPure || promise['finally'])
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1);
  });

  var INCORRECT_ITERATION = FORCED || !checkCorrectnessOfIteration(function (iterable) {
    PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
  });

  // helpers
  var isThenable = function (it) {
    var then;
    return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
  };

  var notify$1 = function (promise, state, isReject) {
    if (state.notified) return;
    state.notified = true;
    var chain = state.reactions;
    microtask(function () {
      var value = state.value;
      var ok = state.state == FULFILLED;
      var i = 0;
      var run = function (reaction) {
        var handler = ok ? reaction.ok : reaction.fail;
        var resolve = reaction.resolve;
        var reject = reaction.reject;
        var domain = reaction.domain;
        var result, then, exited;
        try {
          if (handler) {
            if (!ok) {
              if (state.rejection === UNHANDLED) onHandleUnhandled(promise, state);
              state.rejection = HANDLED;
            }
            if (handler === true) result = value;
            else {
              if (domain) domain.enter();
              result = handler(value); // may throw
              if (domain) {
                domain.exit();
                exited = true;
              }
            }
            if (result === reaction.promise) {
              reject(TypeError$1('Promise-chain cycle'));
            } else if (then = isThenable(result)) {
              then.call(result, resolve, reject);
            } else resolve(result);
          } else reject(value);
        } catch (error) {
          if (domain && !exited) domain.exit();
          reject(error);
        }
      };
      while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
      state.reactions = [];
      state.notified = false;
      if (isReject && !state.rejection) onUnhandled(promise, state);
    });
  };

  var dispatchEvent = function (name, promise, reason) {
    var event, handler;
    if (DISPATCH_EVENT) {
      event = document$3.createEvent('Event');
      event.promise = promise;
      event.reason = reason;
      event.initEvent(name, false, true);
      global.dispatchEvent(event);
    } else event = { promise: promise, reason: reason };
    if (handler = global['on' + name]) handler(event);
    else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
  };

  var onUnhandled = function (promise, state) {
    task$1.call(global, function () {
      var value = state.value;
      var IS_UNHANDLED = isUnhandled(state);
      var result;
      if (IS_UNHANDLED) {
        result = perform(function () {
          if (IS_NODE$1) {
            process$2.emit('unhandledRejection', value, promise);
          } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
        });
        // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
        state.rejection = IS_NODE$1 || isUnhandled(state) ? UNHANDLED : HANDLED;
        if (result.error) throw result.value;
      }
    });
  };

  var isUnhandled = function (state) {
    return state.rejection !== HANDLED && !state.parent;
  };

  var onHandleUnhandled = function (promise, state) {
    task$1.call(global, function () {
      if (IS_NODE$1) {
        process$2.emit('rejectionHandled', promise);
      } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
    });
  };

  var bind = function (fn, promise, state, unwrap) {
    return function (value) {
      fn(promise, state, value, unwrap);
    };
  };

  var internalReject = function (promise, state, value, unwrap) {
    if (state.done) return;
    state.done = true;
    if (unwrap) state = unwrap;
    state.value = value;
    state.state = REJECTED;
    notify$1(promise, state, true);
  };

  var internalResolve = function (promise, state, value, unwrap) {
    if (state.done) return;
    state.done = true;
    if (unwrap) state = unwrap;
    try {
      if (promise === value) throw TypeError$1("Promise can't be resolved itself");
      var then = isThenable(value);
      if (then) {
        microtask(function () {
          var wrapper = { done: false };
          try {
            then.call(value,
              bind(internalResolve, promise, wrapper, state),
              bind(internalReject, promise, wrapper, state)
            );
          } catch (error) {
            internalReject(promise, wrapper, error, state);
          }
        });
      } else {
        state.value = value;
        state.state = FULFILLED;
        notify$1(promise, state, false);
      }
    } catch (error) {
      internalReject(promise, { done: false }, error, state);
    }
  };

  // constructor polyfill
  if (FORCED) {
    // 25.4.3.1 Promise(executor)
    PromiseConstructor = function Promise(executor) {
      anInstance(this, PromiseConstructor, PROMISE);
      aFunction(executor);
      Internal.call(this);
      var state = getInternalState(this);
      try {
        executor(bind(internalResolve, this, state), bind(internalReject, this, state));
      } catch (error) {
        internalReject(this, state, error);
      }
    };
    // eslint-disable-next-line no-unused-vars
    Internal = function Promise(executor) {
      setInternalState(this, {
        type: PROMISE,
        done: false,
        notified: false,
        parent: false,
        reactions: [],
        rejection: false,
        state: PENDING,
        value: undefined
      });
    };
    Internal.prototype = redefineAll(PromiseConstructor.prototype, {
      // `Promise.prototype.then` method
      // https://tc39.github.io/ecma262/#sec-promise.prototype.then
      then: function then(onFulfilled, onRejected) {
        var state = getInternalPromiseState(this);
        var reaction = newPromiseCapability$1(speciesConstructor(this, PromiseConstructor));
        reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
        reaction.fail = typeof onRejected == 'function' && onRejected;
        reaction.domain = IS_NODE$1 ? process$2.domain : undefined;
        state.parent = true;
        state.reactions.push(reaction);
        if (state.state != PENDING) notify$1(this, state, false);
        return reaction.promise;
      },
      // `Promise.prototype.catch` method
      // https://tc39.github.io/ecma262/#sec-promise.prototype.catch
      'catch': function (onRejected) {
        return this.then(undefined, onRejected);
      }
    });
    OwnPromiseCapability = function () {
      var promise = new Internal();
      var state = getInternalState(promise);
      this.promise = promise;
      this.resolve = bind(internalResolve, promise, state);
      this.reject = bind(internalReject, promise, state);
    };
    newPromiseCapability.f = newPromiseCapability$1 = function (C) {
      return C === PromiseConstructor || C === PromiseWrapper
        ? new OwnPromiseCapability(C)
        : newGenericPromiseCapability(C);
    };

    // wrap fetch result
    if (typeof $fetch == 'function') _export({ global: true, enumerable: true, forced: true }, {
      // eslint-disable-next-line no-unused-vars
      fetch: function fetch(input) {
        return promiseResolve(PromiseConstructor, $fetch.apply(global, arguments));
      }
    });
  }

  _export({ global: true, wrap: true, forced: FORCED }, { Promise: PromiseConstructor });

  setToStringTag(PromiseConstructor, PROMISE, false, true);
  setSpecies(PROMISE);

  PromiseWrapper = path[PROMISE];

  // statics
  _export({ target: PROMISE, stat: true, forced: FORCED }, {
    // `Promise.reject` method
    // https://tc39.github.io/ecma262/#sec-promise.reject
    reject: function reject(r) {
      var capability = newPromiseCapability$1(this);
      capability.reject.call(undefined, r);
      return capability.promise;
    }
  });

  _export({ target: PROMISE, stat: true, forced: FORCED }, {
    // `Promise.resolve` method
    // https://tc39.github.io/ecma262/#sec-promise.resolve
    resolve: function resolve(x) {
      return promiseResolve(this, x);
    }
  });

  _export({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION }, {
    // `Promise.all` method
    // https://tc39.github.io/ecma262/#sec-promise.all
    all: function all(iterable) {
      var C = this;
      var capability = newPromiseCapability$1(C);
      var resolve = capability.resolve;
      var reject = capability.reject;
      var result = perform(function () {
        var values = [];
        var counter = 0;
        var remaining = 1;
        iterate(iterable, function (promise) {
          var index = counter++;
          var alreadyCalled = false;
          values.push(undefined);
          remaining++;
          C.resolve(promise).then(function (value) {
            if (alreadyCalled) return;
            alreadyCalled = true;
            values[index] = value;
            --remaining || resolve(values);
          }, reject);
        });
        --remaining || resolve(values);
      });
      if (result.error) reject(result.value);
      return capability.promise;
    },
    // `Promise.race` method
    // https://tc39.github.io/ecma262/#sec-promise.race
    race: function race(iterable) {
      var C = this;
      var capability = newPromiseCapability$1(C);
      var reject = capability.reject;
      var result = perform(function () {
        iterate(iterable, function (promise) {
          C.resolve(promise).then(capability.resolve, reject);
        });
      });
      if (result.error) reject(result.value);
      return capability.promise;
    }
  });

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const directives = new WeakMap();
  const isDirective = (o) => {
      return typeof o === 'function' && directives.has(o);
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * True if the custom elements polyfill is in use.
   */
  const isCEPolyfill = window.customElements !== undefined &&
      window.customElements.polyfillWrapFlushCallback !==
          undefined;
  /**
   * Removes nodes, starting from `startNode` (inclusive) to `endNode`
   * (exclusive), from `container`.
   */
  const removeNodes = (container, startNode, endNode = null) => {
      let node = startNode;
      while (node !== endNode) {
          const n = node.nextSibling;
          container.removeChild(node);
          node = n;
      }
  };

  /**
   * @license
   * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * A sentinel value that signals that a value was handled by a directive and
   * should not be written to the DOM.
   */
  const noChange = {};
  /**
   * A sentinel value that signals a NodePart to fully clear its content.
   */
  const nothing = {};

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * An expression marker with embedded unique key to avoid collision with
   * possible text in templates.
   */
  const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
  /**
   * An expression marker used text-positions, multi-binding attributes, and
   * attributes with markup-like text values.
   */
  const nodeMarker = `<!--${marker}-->`;
  const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
  /**
   * Suffix appended to all bound attribute names.
   */
  const boundAttributeSuffix = '$lit$';
  /**
   * An updateable Template that tracks the location of dynamic parts.
   */
  class Template {
      constructor(result, element) {
          this.parts = [];
          this.element = element;
          let index = -1;
          let partIndex = 0;
          const nodesToRemove = [];
          const _prepareTemplate = (template) => {
              const content = template.content;
              // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
              // null
              const walker = document.createTreeWalker(content, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
              // Keeps track of the last index associated with a part. We try to delete
              // unnecessary nodes, but we never want to associate two different parts
              // to the same index. They must have a constant node between.
              let lastPartIndex = 0;
              while (walker.nextNode()) {
                  index++;
                  const node = walker.currentNode;
                  if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
                      if (node.hasAttributes()) {
                          const attributes = node.attributes;
                          // Per
                          // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
                          // attributes are not guaranteed to be returned in document order.
                          // In particular, Edge/IE can return them out of order, so we cannot
                          // assume a correspondance between part index and attribute index.
                          let count = 0;
                          for (let i = 0; i < attributes.length; i++) {
                              if (attributes[i].value.indexOf(marker) >= 0) {
                                  count++;
                              }
                          }
                          while (count-- > 0) {
                              // Get the template literal section leading up to the first
                              // expression in this attribute
                              const stringForPart = result.strings[partIndex];
                              // Find the attribute name
                              const name = lastAttributeNameRegex.exec(stringForPart)[2];
                              // Find the corresponding attribute
                              // All bound attributes have had a suffix added in
                              // TemplateResult#getHTML to opt out of special attribute
                              // handling. To look up the attribute value we also need to add
                              // the suffix.
                              const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                              const attributeValue = node.getAttribute(attributeLookupName);
                              const strings = attributeValue.split(markerRegex);
                              this.parts.push({ type: 'attribute', index, name, strings });
                              node.removeAttribute(attributeLookupName);
                              partIndex += strings.length - 1;
                          }
                      }
                      if (node.tagName === 'TEMPLATE') {
                          _prepareTemplate(node);
                      }
                  }
                  else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
                      const data = node.data;
                      if (data.indexOf(marker) >= 0) {
                          const parent = node.parentNode;
                          const strings = data.split(markerRegex);
                          const lastIndex = strings.length - 1;
                          // Generate a new text node for each literal section
                          // These nodes are also used as the markers for node parts
                          for (let i = 0; i < lastIndex; i++) {
                              parent.insertBefore((strings[i] === '') ? createMarker() :
                                  document.createTextNode(strings[i]), node);
                              this.parts.push({ type: 'node', index: ++index });
                          }
                          // If there's no text, we must insert a comment to mark our place.
                          // Else, we can trust it will stick around after cloning.
                          if (strings[lastIndex] === '') {
                              parent.insertBefore(createMarker(), node);
                              nodesToRemove.push(node);
                          }
                          else {
                              node.data = strings[lastIndex];
                          }
                          // We have a part for each match found
                          partIndex += lastIndex;
                      }
                  }
                  else if (node.nodeType === 8 /* Node.COMMENT_NODE */) {
                      if (node.data === marker) {
                          const parent = node.parentNode;
                          // Add a new marker node to be the startNode of the Part if any of
                          // the following are true:
                          //  * We don't have a previousSibling
                          //  * The previousSibling is already the start of a previous part
                          if (node.previousSibling === null || index === lastPartIndex) {
                              index++;
                              parent.insertBefore(createMarker(), node);
                          }
                          lastPartIndex = index;
                          this.parts.push({ type: 'node', index });
                          // If we don't have a nextSibling, keep this node so we have an end.
                          // Else, we can remove it to save future costs.
                          if (node.nextSibling === null) {
                              node.data = '';
                          }
                          else {
                              nodesToRemove.push(node);
                              index--;
                          }
                          partIndex++;
                      }
                      else {
                          let i = -1;
                          while ((i = node.data.indexOf(marker, i + 1)) !==
                              -1) {
                              // Comment node has a binding marker inside, make an inactive part
                              // The binding won't work, but subsequent bindings will
                              // TODO (justinfagnani): consider whether it's even worth it to
                              // make bindings in comments work
                              this.parts.push({ type: 'node', index: -1 });
                          }
                      }
                  }
              }
          };
          _prepareTemplate(element);
          // Remove text binding nodes after the walk to not disturb the TreeWalker
          for (const n of nodesToRemove) {
              n.parentNode.removeChild(n);
          }
      }
  }
  const isTemplatePartActive = (part) => part.index !== -1;
  // Allows `document.createComment('')` to be renamed for a
  // small manual size-savings.
  const createMarker = () => document.createComment('');
  /**
   * This regex extracts the attribute name preceding an attribute-position
   * expression. It does this by matching the syntax allowed for attributes
   * against the string literal directly preceding the expression, assuming that
   * the expression is in an attribute-value position.
   *
   * See attributes in the HTML spec:
   * https://www.w3.org/TR/html5/syntax.html#attributes-0
   *
   * "\0-\x1F\x7F-\x9F" are Unicode control characters
   *
   * " \x09\x0a\x0c\x0d" are HTML space characters:
   * https://www.w3.org/TR/html5/infrastructure.html#space-character
   *
   * So an attribute is:
   *  * The name: any character except a control character, space character, ('),
   *    ("), ">", "=", or "/"
   *  * Followed by zero or more space characters
   *  * Followed by "="
   *  * Followed by zero or more space characters
   *  * Followed by:
   *    * Any character except space, ('), ("), "<", ">", "=", (`), or
   *    * (") then any non-("), or
   *    * (') then any non-(')
   */
  const lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * An instance of a `Template` that can be attached to the DOM and updated
   * with new values.
   */
  class TemplateInstance {
      constructor(template, processor, options) {
          this._parts = [];
          this.template = template;
          this.processor = processor;
          this.options = options;
      }
      update(values) {
          let i = 0;
          for (const part of this._parts) {
              if (part !== undefined) {
                  part.setValue(values[i]);
              }
              i++;
          }
          for (const part of this._parts) {
              if (part !== undefined) {
                  part.commit();
              }
          }
      }
      _clone() {
          // When using the Custom Elements polyfill, clone the node, rather than
          // importing it, to keep the fragment in the template's document. This
          // leaves the fragment inert so custom elements won't upgrade and
          // potentially modify their contents by creating a polyfilled ShadowRoot
          // while we traverse the tree.
          const fragment = isCEPolyfill ?
              this.template.element.content.cloneNode(true) :
              document.importNode(this.template.element.content, true);
          const parts = this.template.parts;
          let partIndex = 0;
          let nodeIndex = 0;
          const _prepareInstance = (fragment) => {
              // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
              // null
              const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
              let node = walker.nextNode();
              // Loop through all the nodes and parts of a template
              while (partIndex < parts.length && node !== null) {
                  const part = parts[partIndex];
                  // Consecutive Parts may have the same node index, in the case of
                  // multiple bound attributes on an element. So each iteration we either
                  // increment the nodeIndex, if we aren't on a node with a part, or the
                  // partIndex if we are. By not incrementing the nodeIndex when we find a
                  // part, we allow for the next part to be associated with the current
                  // node if neccessasry.
                  if (!isTemplatePartActive(part)) {
                      this._parts.push(undefined);
                      partIndex++;
                  }
                  else if (nodeIndex === part.index) {
                      if (part.type === 'node') {
                          const part = this.processor.handleTextExpression(this.options);
                          part.insertAfterNode(node.previousSibling);
                          this._parts.push(part);
                      }
                      else {
                          this._parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
                      }
                      partIndex++;
                  }
                  else {
                      nodeIndex++;
                      if (node.nodeName === 'TEMPLATE') {
                          _prepareInstance(node.content);
                      }
                      node = walker.nextNode();
                  }
              }
          };
          _prepareInstance(fragment);
          if (isCEPolyfill) {
              document.adoptNode(fragment);
              customElements.upgrade(fragment);
          }
          return fragment;
      }
  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * The return type of `html`, which holds a Template and the values from
   * interpolated expressions.
   */
  class TemplateResult {
      constructor(strings, values, type, processor) {
          this.strings = strings;
          this.values = values;
          this.type = type;
          this.processor = processor;
      }
      /**
       * Returns a string of HTML used to create a `<template>` element.
       */
      getHTML() {
          const endIndex = this.strings.length - 1;
          let html = '';
          for (let i = 0; i < endIndex; i++) {
              const s = this.strings[i];
              // This exec() call does two things:
              // 1) Appends a suffix to the bound attribute name to opt out of special
              // attribute value parsing that IE11 and Edge do, like for style and
              // many SVG attributes. The Template class also appends the same suffix
              // when looking up attributes to create Parts.
              // 2) Adds an unquoted-attribute-safe marker for the first expression in
              // an attribute. Subsequent attribute expressions will use node markers,
              // and this is safe since attributes with multiple expressions are
              // guaranteed to be quoted.
              const match = lastAttributeNameRegex.exec(s);
              if (match) {
                  // We're starting a new bound attribute.
                  // Add the safe attribute suffix, and use unquoted-attribute-safe
                  // marker.
                  html += s.substr(0, match.index) + match[1] + match[2] +
                      boundAttributeSuffix + match[3] + marker;
              }
              else {
                  // We're either in a bound node, or trailing bound attribute.
                  // Either way, nodeMarker is safe to use.
                  html += s + nodeMarker;
              }
          }
          return html + this.strings[endIndex];
      }
      getTemplateElement() {
          const template = document.createElement('template');
          template.innerHTML = this.getHTML();
          return template;
      }
  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const isPrimitive = (value) => {
      return (value === null ||
          !(typeof value === 'object' || typeof value === 'function'));
  };
  /**
   * Sets attribute values for AttributeParts, so that the value is only set once
   * even if there are multiple parts for an attribute.
   */
  class AttributeCommitter {
      constructor(element, name, strings) {
          this.dirty = true;
          this.element = element;
          this.name = name;
          this.strings = strings;
          this.parts = [];
          for (let i = 0; i < strings.length - 1; i++) {
              this.parts[i] = this._createPart();
          }
      }
      /**
       * Creates a single part. Override this to create a differnt type of part.
       */
      _createPart() {
          return new AttributePart(this);
      }
      _getValue() {
          const strings = this.strings;
          const l = strings.length - 1;
          let text = '';
          for (let i = 0; i < l; i++) {
              text += strings[i];
              const part = this.parts[i];
              if (part !== undefined) {
                  const v = part.value;
                  if (v != null &&
                      (Array.isArray(v) ||
                          // tslint:disable-next-line:no-any
                          typeof v !== 'string' && v[Symbol.iterator])) {
                      for (const t of v) {
                          text += typeof t === 'string' ? t : String(t);
                      }
                  }
                  else {
                      text += typeof v === 'string' ? v : String(v);
                  }
              }
          }
          text += strings[l];
          return text;
      }
      commit() {
          if (this.dirty) {
              this.dirty = false;
              this.element.setAttribute(this.name, this._getValue());
          }
      }
  }
  class AttributePart {
      constructor(comitter) {
          this.value = undefined;
          this.committer = comitter;
      }
      setValue(value) {
          if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
              this.value = value;
              // If the value is a not a directive, dirty the committer so that it'll
              // call setAttribute. If the value is a directive, it'll dirty the
              // committer if it calls setValue().
              if (!isDirective(value)) {
                  this.committer.dirty = true;
              }
          }
      }
      commit() {
          while (isDirective(this.value)) {
              const directive = this.value;
              this.value = noChange;
              directive(this);
          }
          if (this.value === noChange) {
              return;
          }
          this.committer.commit();
      }
  }
  class NodePart {
      constructor(options) {
          this.value = undefined;
          this._pendingValue = undefined;
          this.options = options;
      }
      /**
       * Inserts this part into a container.
       *
       * This part must be empty, as its contents are not automatically moved.
       */
      appendInto(container) {
          this.startNode = container.appendChild(createMarker());
          this.endNode = container.appendChild(createMarker());
      }
      /**
       * Inserts this part between `ref` and `ref`'s next sibling. Both `ref` and
       * its next sibling must be static, unchanging nodes such as those that appear
       * in a literal section of a template.
       *
       * This part must be empty, as its contents are not automatically moved.
       */
      insertAfterNode(ref) {
          this.startNode = ref;
          this.endNode = ref.nextSibling;
      }
      /**
       * Appends this part into a parent part.
       *
       * This part must be empty, as its contents are not automatically moved.
       */
      appendIntoPart(part) {
          part._insert(this.startNode = createMarker());
          part._insert(this.endNode = createMarker());
      }
      /**
       * Appends this part after `ref`
       *
       * This part must be empty, as its contents are not automatically moved.
       */
      insertAfterPart(ref) {
          ref._insert(this.startNode = createMarker());
          this.endNode = ref.endNode;
          ref.endNode = this.startNode;
      }
      setValue(value) {
          this._pendingValue = value;
      }
      commit() {
          while (isDirective(this._pendingValue)) {
              const directive = this._pendingValue;
              this._pendingValue = noChange;
              directive(this);
          }
          const value = this._pendingValue;
          if (value === noChange) {
              return;
          }
          if (isPrimitive(value)) {
              if (value !== this.value) {
                  this._commitText(value);
              }
          }
          else if (value instanceof TemplateResult) {
              this._commitTemplateResult(value);
          }
          else if (value instanceof Node) {
              this._commitNode(value);
          }
          else if (Array.isArray(value) ||
              // tslint:disable-next-line:no-any
              value[Symbol.iterator]) {
              this._commitIterable(value);
          }
          else if (value === nothing) {
              this.value = nothing;
              this.clear();
          }
          else {
              // Fallback, will render the string representation
              this._commitText(value);
          }
      }
      _insert(node) {
          this.endNode.parentNode.insertBefore(node, this.endNode);
      }
      _commitNode(value) {
          if (this.value === value) {
              return;
          }
          this.clear();
          this._insert(value);
          this.value = value;
      }
      _commitText(value) {
          const node = this.startNode.nextSibling;
          value = value == null ? '' : value;
          if (node === this.endNode.previousSibling &&
              node.nodeType === 3 /* Node.TEXT_NODE */) {
              // If we only have a single text node between the markers, we can just
              // set its value, rather than replacing it.
              // TODO(justinfagnani): Can we just check if this.value is primitive?
              node.data = value;
          }
          else {
              this._commitNode(document.createTextNode(typeof value === 'string' ? value : String(value)));
          }
          this.value = value;
      }
      _commitTemplateResult(value) {
          const template = this.options.templateFactory(value);
          if (this.value instanceof TemplateInstance &&
              this.value.template === template) {
              this.value.update(value.values);
          }
          else {
              // Make sure we propagate the template processor from the TemplateResult
              // so that we use its syntax extension, etc. The template factory comes
              // from the render function options so that it can control template
              // caching and preprocessing.
              const instance = new TemplateInstance(template, value.processor, this.options);
              const fragment = instance._clone();
              instance.update(value.values);
              this._commitNode(fragment);
              this.value = instance;
          }
      }
      _commitIterable(value) {
          // For an Iterable, we create a new InstancePart per item, then set its
          // value to the item. This is a little bit of overhead for every item in
          // an Iterable, but it lets us recurse easily and efficiently update Arrays
          // of TemplateResults that will be commonly returned from expressions like:
          // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
          // If _value is an array, then the previous render was of an
          // iterable and _value will contain the NodeParts from the previous
          // render. If _value is not an array, clear this part and make a new
          // array for NodeParts.
          if (!Array.isArray(this.value)) {
              this.value = [];
              this.clear();
          }
          // Lets us keep track of how many items we stamped so we can clear leftover
          // items from a previous render
          const itemParts = this.value;
          let partIndex = 0;
          let itemPart;
          for (const item of value) {
              // Try to reuse an existing part
              itemPart = itemParts[partIndex];
              // If no existing part, create a new one
              if (itemPart === undefined) {
                  itemPart = new NodePart(this.options);
                  itemParts.push(itemPart);
                  if (partIndex === 0) {
                      itemPart.appendIntoPart(this);
                  }
                  else {
                      itemPart.insertAfterPart(itemParts[partIndex - 1]);
                  }
              }
              itemPart.setValue(item);
              itemPart.commit();
              partIndex++;
          }
          if (partIndex < itemParts.length) {
              // Truncate the parts array so _value reflects the current state
              itemParts.length = partIndex;
              this.clear(itemPart && itemPart.endNode);
          }
      }
      clear(startNode = this.startNode) {
          removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
      }
  }
  /**
   * Implements a boolean attribute, roughly as defined in the HTML
   * specification.
   *
   * If the value is truthy, then the attribute is present with a value of
   * ''. If the value is falsey, the attribute is removed.
   */
  class BooleanAttributePart {
      constructor(element, name, strings) {
          this.value = undefined;
          this._pendingValue = undefined;
          if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
              throw new Error('Boolean attributes can only contain a single expression');
          }
          this.element = element;
          this.name = name;
          this.strings = strings;
      }
      setValue(value) {
          this._pendingValue = value;
      }
      commit() {
          while (isDirective(this._pendingValue)) {
              const directive = this._pendingValue;
              this._pendingValue = noChange;
              directive(this);
          }
          if (this._pendingValue === noChange) {
              return;
          }
          const value = !!this._pendingValue;
          if (this.value !== value) {
              if (value) {
                  this.element.setAttribute(this.name, '');
              }
              else {
                  this.element.removeAttribute(this.name);
              }
          }
          this.value = value;
          this._pendingValue = noChange;
      }
  }
  /**
   * Sets attribute values for PropertyParts, so that the value is only set once
   * even if there are multiple parts for a property.
   *
   * If an expression controls the whole property value, then the value is simply
   * assigned to the property under control. If there are string literals or
   * multiple expressions, then the strings are expressions are interpolated into
   * a string first.
   */
  class PropertyCommitter extends AttributeCommitter {
      constructor(element, name, strings) {
          super(element, name, strings);
          this.single =
              (strings.length === 2 && strings[0] === '' && strings[1] === '');
      }
      _createPart() {
          return new PropertyPart(this);
      }
      _getValue() {
          if (this.single) {
              return this.parts[0].value;
          }
          return super._getValue();
      }
      commit() {
          if (this.dirty) {
              this.dirty = false;
              // tslint:disable-next-line:no-any
              this.element[this.name] = this._getValue();
          }
      }
  }
  class PropertyPart extends AttributePart {
  }
  // Detect event listener options support. If the `capture` property is read
  // from the options object, then options are supported. If not, then the thrid
  // argument to add/removeEventListener is interpreted as the boolean capture
  // value so we should only pass the `capture` property.
  let eventOptionsSupported = false;
  try {
      const options = {
          get capture() {
              eventOptionsSupported = true;
              return false;
          }
      };
      // tslint:disable-next-line:no-any
      window.addEventListener('test', options, options);
      // tslint:disable-next-line:no-any
      window.removeEventListener('test', options, options);
  }
  catch (_e) {
  }
  class EventPart {
      constructor(element, eventName, eventContext) {
          this.value = undefined;
          this._pendingValue = undefined;
          this.element = element;
          this.eventName = eventName;
          this.eventContext = eventContext;
          this._boundHandleEvent = (e) => this.handleEvent(e);
      }
      setValue(value) {
          this._pendingValue = value;
      }
      commit() {
          while (isDirective(this._pendingValue)) {
              const directive = this._pendingValue;
              this._pendingValue = noChange;
              directive(this);
          }
          if (this._pendingValue === noChange) {
              return;
          }
          const newListener = this._pendingValue;
          const oldListener = this.value;
          const shouldRemoveListener = newListener == null ||
              oldListener != null &&
                  (newListener.capture !== oldListener.capture ||
                      newListener.once !== oldListener.once ||
                      newListener.passive !== oldListener.passive);
          const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);
          if (shouldRemoveListener) {
              this.element.removeEventListener(this.eventName, this._boundHandleEvent, this._options);
          }
          if (shouldAddListener) {
              this._options = getOptions(newListener);
              this.element.addEventListener(this.eventName, this._boundHandleEvent, this._options);
          }
          this.value = newListener;
          this._pendingValue = noChange;
      }
      handleEvent(event) {
          if (typeof this.value === 'function') {
              this.value.call(this.eventContext || this.element, event);
          }
          else {
              this.value.handleEvent(event);
          }
      }
  }
  // We copy options because of the inconsistent behavior of browsers when reading
  // the third argument of add/removeEventListener. IE11 doesn't support options
  // at all. Chrome 41 only reads `capture` if the argument is an object.
  const getOptions = (o) => o &&
      (eventOptionsSupported ?
          { capture: o.capture, passive: o.passive, once: o.once } :
          o.capture);

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * Creates Parts when a template is instantiated.
   */
  class DefaultTemplateProcessor {
      /**
       * Create parts for an attribute-position binding, given the event, attribute
       * name, and string literals.
       *
       * @param element The element containing the binding
       * @param name  The attribute name
       * @param strings The string literals. There are always at least two strings,
       *   event for fully-controlled bindings with a single expression.
       */
      handleAttributeExpressions(element, name, strings, options) {
          const prefix = name[0];
          if (prefix === '.') {
              const comitter = new PropertyCommitter(element, name.slice(1), strings);
              return comitter.parts;
          }
          if (prefix === '@') {
              return [new EventPart(element, name.slice(1), options.eventContext)];
          }
          if (prefix === '?') {
              return [new BooleanAttributePart(element, name.slice(1), strings)];
          }
          const comitter = new AttributeCommitter(element, name, strings);
          return comitter.parts;
      }
      /**
       * Create parts for a text-position binding.
       * @param templateFactory
       */
      handleTextExpression(options) {
          return new NodePart(options);
      }
  }
  const defaultTemplateProcessor = new DefaultTemplateProcessor();

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * The default TemplateFactory which caches Templates keyed on
   * result.type and result.strings.
   */
  function templateFactory(result) {
      let templateCache = templateCaches.get(result.type);
      if (templateCache === undefined) {
          templateCache = {
              stringsArray: new WeakMap(),
              keyString: new Map()
          };
          templateCaches.set(result.type, templateCache);
      }
      let template = templateCache.stringsArray.get(result.strings);
      if (template !== undefined) {
          return template;
      }
      // If the TemplateStringsArray is new, generate a key from the strings
      // This key is shared between all templates with identical content
      const key = result.strings.join(marker);
      // Check if we already have a Template for this key
      template = templateCache.keyString.get(key);
      if (template === undefined) {
          // If we have not seen this key before, create a new Template
          template = new Template(result, result.getTemplateElement());
          // Cache the Template for this key
          templateCache.keyString.set(key, template);
      }
      // Cache all future queries for this TemplateStringsArray
      templateCache.stringsArray.set(result.strings, template);
      return template;
  }
  const templateCaches = new Map();

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const parts = new WeakMap();
  /**
   * Renders a template to a container.
   *
   * To update a container with new values, reevaluate the template literal and
   * call `render` with the new result.
   *
   * @param result a TemplateResult created by evaluating a template tag like
   *     `html` or `svg`.
   * @param container A DOM parent to render to. The entire contents are either
   *     replaced, or efficiently updated if the same result type was previous
   *     rendered there.
   * @param options RenderOptions for the entire render tree rendered to this
   *     container. Render options must *not* change between renders to the same
   *     container, as those changes will not effect previously rendered DOM.
   */
  const render = (result, container, options) => {
      let part = parts.get(container);
      if (part === undefined) {
          removeNodes(container, container.firstChild);
          parts.set(container, part = new NodePart(Object.assign({ templateFactory }, options)));
          part.appendInto(container);
      }
      part.setValue(result);
      part.commit();
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // IMPORTANT: do not change the property name or the assignment expression.
  // This line will be used in regexes to search for lit-html usage.
  // TODO(justinfagnani): inject version number at build time
  (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.0.0');
  /**
   * Interprets a template literal as an HTML template that can efficiently
   * render to and update a container.
   */
  const html$1 = (strings, ...values) => new TemplateResult(strings, values, 'html', defaultTemplateProcessor);

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const walkerNodeFilter = 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */;
  /**
   * Removes the list of nodes from a Template safely. In addition to removing
   * nodes from the Template, the Template part indices are updated to match
   * the mutated Template DOM.
   *
   * As the template is walked the removal state is tracked and
   * part indices are adjusted as needed.
   *
   * div
   *   div#1 (remove) <-- start removing (removing node is div#1)
   *     div
   *       div#2 (remove)  <-- continue removing (removing node is still div#1)
   *         div
   * div <-- stop removing since previous sibling is the removing node (div#1,
   * removed 4 nodes)
   */
  function removeNodesFromTemplate(template, nodesToRemove) {
      const { element: { content }, parts } = template;
      const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
      let partIndex = nextActiveIndexInTemplateParts(parts);
      let part = parts[partIndex];
      let nodeIndex = -1;
      let removeCount = 0;
      const nodesToRemoveInTemplate = [];
      let currentRemovingNode = null;
      while (walker.nextNode()) {
          nodeIndex++;
          const node = walker.currentNode;
          // End removal if stepped past the removing node
          if (node.previousSibling === currentRemovingNode) {
              currentRemovingNode = null;
          }
          // A node to remove was found in the template
          if (nodesToRemove.has(node)) {
              nodesToRemoveInTemplate.push(node);
              // Track node we're removing
              if (currentRemovingNode === null) {
                  currentRemovingNode = node;
              }
          }
          // When removing, increment count by which to adjust subsequent part indices
          if (currentRemovingNode !== null) {
              removeCount++;
          }
          while (part !== undefined && part.index === nodeIndex) {
              // If part is in a removed node deactivate it by setting index to -1 or
              // adjust the index as needed.
              part.index = currentRemovingNode !== null ? -1 : part.index - removeCount;
              // go to the next active part.
              partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
              part = parts[partIndex];
          }
      }
      nodesToRemoveInTemplate.forEach((n) => n.parentNode.removeChild(n));
  }
  const countNodes = (node) => {
      let count = (node.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */) ? 0 : 1;
      const walker = document.createTreeWalker(node, walkerNodeFilter, null, false);
      while (walker.nextNode()) {
          count++;
      }
      return count;
  };
  const nextActiveIndexInTemplateParts = (parts, startIndex = -1) => {
      for (let i = startIndex + 1; i < parts.length; i++) {
          const part = parts[i];
          if (isTemplatePartActive(part)) {
              return i;
          }
      }
      return -1;
  };
  /**
   * Inserts the given node into the Template, optionally before the given
   * refNode. In addition to inserting the node into the Template, the Template
   * part indices are updated to match the mutated Template DOM.
   */
  function insertNodeIntoTemplate(template, node, refNode = null) {
      const { element: { content }, parts } = template;
      // If there's no refNode, then put node at end of template.
      // No part indices need to be shifted in this case.
      if (refNode === null || refNode === undefined) {
          content.appendChild(node);
          return;
      }
      const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
      let partIndex = nextActiveIndexInTemplateParts(parts);
      let insertCount = 0;
      let walkerIndex = -1;
      while (walker.nextNode()) {
          walkerIndex++;
          const walkerNode = walker.currentNode;
          if (walkerNode === refNode) {
              insertCount = countNodes(node);
              refNode.parentNode.insertBefore(node, refNode);
          }
          while (partIndex !== -1 && parts[partIndex].index === walkerIndex) {
              // If we've inserted the node, simply adjust all subsequent parts
              if (insertCount > 0) {
                  while (partIndex !== -1) {
                      parts[partIndex].index += insertCount;
                      partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
                  }
                  return;
              }
              partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
          }
      }
  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // Get a key to lookup in `templateCaches`.
  const getTemplateCacheKey = (type, scopeName) => `${type}--${scopeName}`;
  let compatibleShadyCSSVersion = true;
  if (typeof window.ShadyCSS === 'undefined') {
      compatibleShadyCSSVersion = false;
  }
  else if (typeof window.ShadyCSS.prepareTemplateDom === 'undefined') {
      console.warn(`Incompatible ShadyCSS version detected.` +
          `Please update to at least @webcomponents/webcomponentsjs@2.0.2 and` +
          `@webcomponents/shadycss@1.3.1.`);
      compatibleShadyCSSVersion = false;
  }
  /**
   * Template factory which scopes template DOM using ShadyCSS.
   * @param scopeName {string}
   */
  const shadyTemplateFactory = (scopeName) => (result) => {
      const cacheKey = getTemplateCacheKey(result.type, scopeName);
      let templateCache = templateCaches.get(cacheKey);
      if (templateCache === undefined) {
          templateCache = {
              stringsArray: new WeakMap(),
              keyString: new Map()
          };
          templateCaches.set(cacheKey, templateCache);
      }
      let template = templateCache.stringsArray.get(result.strings);
      if (template !== undefined) {
          return template;
      }
      const key = result.strings.join(marker);
      template = templateCache.keyString.get(key);
      if (template === undefined) {
          const element = result.getTemplateElement();
          if (compatibleShadyCSSVersion) {
              window.ShadyCSS.prepareTemplateDom(element, scopeName);
          }
          template = new Template(result, element);
          templateCache.keyString.set(key, template);
      }
      templateCache.stringsArray.set(result.strings, template);
      return template;
  };
  const TEMPLATE_TYPES = ['html', 'svg'];
  /**
   * Removes all style elements from Templates for the given scopeName.
   */
  const removeStylesFromLitTemplates = (scopeName) => {
      TEMPLATE_TYPES.forEach((type) => {
          const templates = templateCaches.get(getTemplateCacheKey(type, scopeName));
          if (templates !== undefined) {
              templates.keyString.forEach((template) => {
                  const { element: { content } } = template;
                  // IE 11 doesn't support the iterable param Set constructor
                  const styles = new Set();
                  Array.from(content.querySelectorAll('style')).forEach((s) => {
                      styles.add(s);
                  });
                  removeNodesFromTemplate(template, styles);
              });
          }
      });
  };
  const shadyRenderSet = new Set();
  /**
   * For the given scope name, ensures that ShadyCSS style scoping is performed.
   * This is done just once per scope name so the fragment and template cannot
   * be modified.
   * (1) extracts styles from the rendered fragment and hands them to ShadyCSS
   * to be scoped and appended to the document
   * (2) removes style elements from all lit-html Templates for this scope name.
   *
   * Note, <style> elements can only be placed into templates for the
   * initial rendering of the scope. If <style> elements are included in templates
   * dynamically rendered to the scope (after the first scope render), they will
   * not be scoped and the <style> will be left in the template and rendered
   * output.
   */
  const prepareTemplateStyles = (renderedDOM, template, scopeName) => {
      shadyRenderSet.add(scopeName);
      // Move styles out of rendered DOM and store.
      const styles = renderedDOM.querySelectorAll('style');
      // If there are no styles, skip unnecessary work
      if (styles.length === 0) {
          // Ensure prepareTemplateStyles is called to support adding
          // styles via `prepareAdoptedCssText` since that requires that
          // `prepareTemplateStyles` is called.
          window.ShadyCSS.prepareTemplateStyles(template.element, scopeName);
          return;
      }
      const condensedStyle = document.createElement('style');
      // Collect styles into a single style. This helps us make sure ShadyCSS
      // manipulations will not prevent us from being able to fix up template
      // part indices.
      // NOTE: collecting styles is inefficient for browsers but ShadyCSS
      // currently does this anyway. When it does not, this should be changed.
      for (let i = 0; i < styles.length; i++) {
          const style = styles[i];
          style.parentNode.removeChild(style);
          condensedStyle.textContent += style.textContent;
      }
      // Remove styles from nested templates in this scope.
      removeStylesFromLitTemplates(scopeName);
      // And then put the condensed style into the "root" template passed in as
      // `template`.
      insertNodeIntoTemplate(template, condensedStyle, template.element.content.firstChild);
      // Note, it's important that ShadyCSS gets the template that `lit-html`
      // will actually render so that it can update the style inside when
      // needed (e.g. @apply native Shadow DOM case).
      window.ShadyCSS.prepareTemplateStyles(template.element, scopeName);
      if (window.ShadyCSS.nativeShadow) {
          // When in native Shadow DOM, re-add styling to rendered content using
          // the style ShadyCSS produced.
          const style = template.element.content.querySelector('style');
          renderedDOM.insertBefore(style.cloneNode(true), renderedDOM.firstChild);
      }
      else {
          // When not in native Shadow DOM, at this point ShadyCSS will have
          // removed the style from the lit template and parts will be broken as a
          // result. To fix this, we put back the style node ShadyCSS removed
          // and then tell lit to remove that node from the template.
          // NOTE, ShadyCSS creates its own style so we can safely add/remove
          // `condensedStyle` here.
          template.element.content.insertBefore(condensedStyle, template.element.content.firstChild);
          const removes = new Set();
          removes.add(condensedStyle);
          removeNodesFromTemplate(template, removes);
      }
  };
  /**
   * Extension to the standard `render` method which supports rendering
   * to ShadowRoots when the ShadyDOM (https://github.com/webcomponents/shadydom)
   * and ShadyCSS (https://github.com/webcomponents/shadycss) polyfills are used
   * or when the webcomponentsjs
   * (https://github.com/webcomponents/webcomponentsjs) polyfill is used.
   *
   * Adds a `scopeName` option which is used to scope element DOM and stylesheets
   * when native ShadowDOM is unavailable. The `scopeName` will be added to
   * the class attribute of all rendered DOM. In addition, any style elements will
   * be automatically re-written with this `scopeName` selector and moved out
   * of the rendered DOM and into the document `<head>`.
   *
   * It is common to use this render method in conjunction with a custom element
   * which renders a shadowRoot. When this is done, typically the element's
   * `localName` should be used as the `scopeName`.
   *
   * In addition to DOM scoping, ShadyCSS also supports a basic shim for css
   * custom properties (needed only on older browsers like IE11) and a shim for
   * a deprecated feature called `@apply` that supports applying a set of css
   * custom properties to a given location.
   *
   * Usage considerations:
   *
   * * Part values in `<style>` elements are only applied the first time a given
   * `scopeName` renders. Subsequent changes to parts in style elements will have
   * no effect. Because of this, parts in style elements should only be used for
   * values that will never change, for example parts that set scope-wide theme
   * values or parts which render shared style elements.
   *
   * * Note, due to a limitation of the ShadyDOM polyfill, rendering in a
   * custom element's `constructor` is not supported. Instead rendering should
   * either done asynchronously, for example at microtask timing (for example
   * `Promise.resolve()`), or be deferred until the first time the element's
   * `connectedCallback` runs.
   *
   * Usage considerations when using shimmed custom properties or `@apply`:
   *
   * * Whenever any dynamic changes are made which affect
   * css custom properties, `ShadyCSS.styleElement(element)` must be called
   * to update the element. There are two cases when this is needed:
   * (1) the element is connected to a new parent, (2) a class is added to the
   * element that causes it to match different custom properties.
   * To address the first case when rendering a custom element, `styleElement`
   * should be called in the element's `connectedCallback`.
   *
   * * Shimmed custom properties may only be defined either for an entire
   * shadowRoot (for example, in a `:host` rule) or via a rule that directly
   * matches an element with a shadowRoot. In other words, instead of flowing from
   * parent to child as do native css custom properties, shimmed custom properties
   * flow only from shadowRoots to nested shadowRoots.
   *
   * * When using `@apply` mixing css shorthand property names with
   * non-shorthand names (for example `border` and `border-width`) is not
   * supported.
   */
  const render$1 = (result, container, options) => {
      const scopeName = options.scopeName;
      const hasRendered = parts.has(container);
      const needsScoping = container instanceof ShadowRoot &&
          compatibleShadyCSSVersion && result instanceof TemplateResult;
      // Handle first render to a scope specially...
      const firstScopeRender = needsScoping && !shadyRenderSet.has(scopeName);
      // On first scope render, render into a fragment; this cannot be a single
      // fragment that is reused since nested renders can occur synchronously.
      const renderContainer = firstScopeRender ? document.createDocumentFragment() : container;
      render(result, renderContainer, Object.assign({ templateFactory: shadyTemplateFactory(scopeName) }, options));
      // When performing first scope render,
      // (1) We've rendered into a fragment so that there's a chance to
      // `prepareTemplateStyles` before sub-elements hit the DOM
      // (which might cause them to render based on a common pattern of
      // rendering in a custom element's `connectedCallback`);
      // (2) Scope the template with ShadyCSS one time only for this scope.
      // (3) Render the fragment into the container and make sure the
      // container knows its `part` is the one we just rendered. This ensures
      // DOM will be re-used on subsequent renders.
      if (firstScopeRender) {
          const part = parts.get(renderContainer);
          parts.delete(renderContainer);
          if (part.value instanceof TemplateInstance) {
              prepareTemplateStyles(renderContainer, part.value.template, scopeName);
          }
          removeNodes(container, container.firstChild);
          container.appendChild(renderContainer);
          parts.set(container, part);
      }
      // After elements have hit the DOM, update styling if this is the
      // initial render to this container.
      // This is needed whenever dynamic changes are made so it would be
      // safest to do every render; however, this would regress performance
      // so we leave it up to the user to call `ShadyCSSS.styleElement`
      // for dynamic changes.
      if (!hasRendered && needsScoping) {
          window.ShadyCSS.styleElement(container.host);
      }
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
   * replaced at compile time by the munged name for object[property]. We cannot
   * alias this function, so we have to use a small shim that has the same
   * behavior when not compiling.
   */
  window.JSCompiler_renameProperty =
      (prop, _obj) => prop;
  const defaultConverter = {
      toAttribute(value, type) {
          switch (type) {
              case Boolean:
                  return value ? '' : null;
              case Object:
              case Array:
                  // if the value is `null` or `undefined` pass this through
                  // to allow removing/no change behavior.
                  return value == null ? value : JSON.stringify(value);
          }
          return value;
      },
      fromAttribute(value, type) {
          switch (type) {
              case Boolean:
                  return value !== null;
              case Number:
                  return value === null ? null : Number(value);
              case Object:
              case Array:
                  return JSON.parse(value);
          }
          return value;
      }
  };
  /**
   * Change function that returns true if `value` is different from `oldValue`.
   * This method is used as the default for a property's `hasChanged` function.
   */
  const notEqual = (value, old) => {
      // This ensures (old==NaN, value==NaN) always returns false
      return old !== value && (old === old || value === value);
  };
  const defaultPropertyDeclaration = {
      attribute: true,
      type: String,
      converter: defaultConverter,
      reflect: false,
      hasChanged: notEqual
  };
  const microtaskPromise = Promise.resolve(true);
  const STATE_HAS_UPDATED = 1;
  const STATE_UPDATE_REQUESTED = 1 << 2;
  const STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
  const STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
  const STATE_HAS_CONNECTED = 1 << 5;
  /**
   * Base element class which manages element properties and attributes. When
   * properties change, the `update` method is asynchronously called. This method
   * should be supplied by subclassers to render updates as desired.
   */
  class UpdatingElement extends HTMLElement {
      constructor() {
          super();
          this._updateState = 0;
          this._instanceProperties = undefined;
          this._updatePromise = microtaskPromise;
          this._hasConnectedResolver = undefined;
          /**
           * Map with keys for any properties that have changed since the last
           * update cycle with previous values.
           */
          this._changedProperties = new Map();
          /**
           * Map with keys of properties that should be reflected when updated.
           */
          this._reflectingProperties = undefined;
          this.initialize();
      }
      /**
       * Returns a list of attributes corresponding to the registered properties.
       * @nocollapse
       */
      static get observedAttributes() {
          // note: piggy backing on this to ensure we're finalized.
          this.finalize();
          const attributes = [];
          // Use forEach so this works even if for/of loops are compiled to for loops
          // expecting arrays
          this._classProperties.forEach((v, p) => {
              const attr = this._attributeNameForProperty(p, v);
              if (attr !== undefined) {
                  this._attributeToPropertyMap.set(attr, p);
                  attributes.push(attr);
              }
          });
          return attributes;
      }
      /**
       * Ensures the private `_classProperties` property metadata is created.
       * In addition to `finalize` this is also called in `createProperty` to
       * ensure the `@property` decorator can add property metadata.
       */
      /** @nocollapse */
      static _ensureClassProperties() {
          // ensure private storage for property declarations.
          if (!this.hasOwnProperty(JSCompiler_renameProperty('_classProperties', this))) {
              this._classProperties = new Map();
              // NOTE: Workaround IE11 not supporting Map constructor argument.
              const superProperties = Object.getPrototypeOf(this)._classProperties;
              if (superProperties !== undefined) {
                  superProperties.forEach((v, k) => this._classProperties.set(k, v));
              }
          }
      }
      /**
       * Creates a property accessor on the element prototype if one does not exist.
       * The property setter calls the property's `hasChanged` property option
       * or uses a strict identity check to determine whether or not to request
       * an update.
       * @nocollapse
       */
      static createProperty(name, options = defaultPropertyDeclaration) {
          // Note, since this can be called by the `@property` decorator which
          // is called before `finalize`, we ensure storage exists for property
          // metadata.
          this._ensureClassProperties();
          this._classProperties.set(name, options);
          // Do not generate an accessor if the prototype already has one, since
          // it would be lost otherwise and that would never be the user's intention;
          // Instead, we expect users to call `requestUpdate` themselves from
          // user-defined accessors. Note that if the super has an accessor we will
          // still overwrite it
          if (options.noAccessor || this.prototype.hasOwnProperty(name)) {
              return;
          }
          const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
          Object.defineProperty(this.prototype, name, {
              // tslint:disable-next-line:no-any no symbol in index
              get() {
                  return this[key];
              },
              set(value) {
                  // tslint:disable-next-line:no-any no symbol in index
                  const oldValue = this[name];
                  // tslint:disable-next-line:no-any no symbol in index
                  this[key] = value;
                  this._requestUpdate(name, oldValue);
              },
              configurable: true,
              enumerable: true
          });
      }
      /**
       * Creates property accessors for registered properties and ensures
       * any superclasses are also finalized.
       * @nocollapse
       */
      static finalize() {
          if (this.hasOwnProperty(JSCompiler_renameProperty('finalized', this)) &&
              this.finalized) {
              return;
          }
          // finalize any superclasses
          const superCtor = Object.getPrototypeOf(this);
          if (typeof superCtor.finalize === 'function') {
              superCtor.finalize();
          }
          this.finalized = true;
          this._ensureClassProperties();
          // initialize Map populated in observedAttributes
          this._attributeToPropertyMap = new Map();
          // make any properties
          // Note, only process "own" properties since this element will inherit
          // any properties defined on the superClass, and finalization ensures
          // the entire prototype chain is finalized.
          if (this.hasOwnProperty(JSCompiler_renameProperty('properties', this))) {
              const props = this.properties;
              // support symbols in properties (IE11 does not support this)
              const propKeys = [
                  ...Object.getOwnPropertyNames(props),
                  ...(typeof Object.getOwnPropertySymbols === 'function') ?
                      Object.getOwnPropertySymbols(props) :
                      []
              ];
              // This for/of is ok because propKeys is an array
              for (const p of propKeys) {
                  // note, use of `any` is due to TypeSript lack of support for symbol in
                  // index types
                  // tslint:disable-next-line:no-any no symbol in index
                  this.createProperty(p, props[p]);
              }
          }
      }
      /**
       * Returns the property name for the given attribute `name`.
       * @nocollapse
       */
      static _attributeNameForProperty(name, options) {
          const attribute = options.attribute;
          return attribute === false ?
              undefined :
              (typeof attribute === 'string' ?
                  attribute :
                  (typeof name === 'string' ? name.toLowerCase() : undefined));
      }
      /**
       * Returns true if a property should request an update.
       * Called when a property value is set and uses the `hasChanged`
       * option for the property if present or a strict identity check.
       * @nocollapse
       */
      static _valueHasChanged(value, old, hasChanged = notEqual) {
          return hasChanged(value, old);
      }
      /**
       * Returns the property value for the given attribute value.
       * Called via the `attributeChangedCallback` and uses the property's
       * `converter` or `converter.fromAttribute` property option.
       * @nocollapse
       */
      static _propertyValueFromAttribute(value, options) {
          const type = options.type;
          const converter = options.converter || defaultConverter;
          const fromAttribute = (typeof converter === 'function' ? converter : converter.fromAttribute);
          return fromAttribute ? fromAttribute(value, type) : value;
      }
      /**
       * Returns the attribute value for the given property value. If this
       * returns undefined, the property will *not* be reflected to an attribute.
       * If this returns null, the attribute will be removed, otherwise the
       * attribute will be set to the value.
       * This uses the property's `reflect` and `type.toAttribute` property options.
       * @nocollapse
       */
      static _propertyValueToAttribute(value, options) {
          if (options.reflect === undefined) {
              return;
          }
          const type = options.type;
          const converter = options.converter;
          const toAttribute = converter && converter.toAttribute ||
              defaultConverter.toAttribute;
          return toAttribute(value, type);
      }
      /**
       * Performs element initialization. By default captures any pre-set values for
       * registered properties.
       */
      initialize() {
          this._saveInstanceProperties();
          // ensures first update will be caught by an early access of `updateComplete`
          this._requestUpdate();
      }
      /**
       * Fixes any properties set on the instance before upgrade time.
       * Otherwise these would shadow the accessor and break these properties.
       * The properties are stored in a Map which is played back after the
       * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
       * (<=41), properties created for native platform properties like (`id` or
       * `name`) may not have default values set in the element constructor. On
       * these browsers native properties appear on instances and therefore their
       * default value will overwrite any element default (e.g. if the element sets
       * this.id = 'id' in the constructor, the 'id' will become '' since this is
       * the native platform default).
       */
      _saveInstanceProperties() {
          // Use forEach so this works even if for/of loops are compiled to for loops
          // expecting arrays
          this.constructor
              ._classProperties.forEach((_v, p) => {
              if (this.hasOwnProperty(p)) {
                  const value = this[p];
                  delete this[p];
                  if (!this._instanceProperties) {
                      this._instanceProperties = new Map();
                  }
                  this._instanceProperties.set(p, value);
              }
          });
      }
      /**
       * Applies previously saved instance properties.
       */
      _applyInstanceProperties() {
          // Use forEach so this works even if for/of loops are compiled to for loops
          // expecting arrays
          // tslint:disable-next-line:no-any
          this._instanceProperties.forEach((v, p) => this[p] = v);
          this._instanceProperties = undefined;
      }
      connectedCallback() {
          this._updateState = this._updateState | STATE_HAS_CONNECTED;
          // Ensure first connection completes an update. Updates cannot complete before
          // connection and if one is pending connection the `_hasConnectionResolver`
          // will exist. If so, resolve it to complete the update, otherwise
          // requestUpdate.
          if (this._hasConnectedResolver) {
              this._hasConnectedResolver();
              this._hasConnectedResolver = undefined;
          }
      }
      /**
       * Allows for `super.disconnectedCallback()` in extensions while
       * reserving the possibility of making non-breaking feature additions
       * when disconnecting at some point in the future.
       */
      disconnectedCallback() {
      }
      /**
       * Synchronizes property values when attributes change.
       */
      attributeChangedCallback(name, old, value) {
          if (old !== value) {
              this._attributeToProperty(name, value);
          }
      }
      _propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
          const ctor = this.constructor;
          const attr = ctor._attributeNameForProperty(name, options);
          if (attr !== undefined) {
              const attrValue = ctor._propertyValueToAttribute(value, options);
              // an undefined value does not change the attribute.
              if (attrValue === undefined) {
                  return;
              }
              // Track if the property is being reflected to avoid
              // setting the property again via `attributeChangedCallback`. Note:
              // 1. this takes advantage of the fact that the callback is synchronous.
              // 2. will behave incorrectly if multiple attributes are in the reaction
              // stack at time of calling. However, since we process attributes
              // in `update` this should not be possible (or an extreme corner case
              // that we'd like to discover).
              // mark state reflecting
              this._updateState = this._updateState | STATE_IS_REFLECTING_TO_ATTRIBUTE;
              if (attrValue == null) {
                  this.removeAttribute(attr);
              }
              else {
                  this.setAttribute(attr, attrValue);
              }
              // mark state not reflecting
              this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_ATTRIBUTE;
          }
      }
      _attributeToProperty(name, value) {
          // Use tracking info to avoid deserializing attribute value if it was
          // just set from a property setter.
          if (this._updateState & STATE_IS_REFLECTING_TO_ATTRIBUTE) {
              return;
          }
          const ctor = this.constructor;
          const propName = ctor._attributeToPropertyMap.get(name);
          if (propName !== undefined) {
              const options = ctor._classProperties.get(propName) || defaultPropertyDeclaration;
              // mark state reflecting
              this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
              this[propName] =
                  // tslint:disable-next-line:no-any
                  ctor._propertyValueFromAttribute(value, options);
              // mark state not reflecting
              this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
          }
      }
      /**
       * This private version of `requestUpdate` does not access or return the
       * `updateComplete` promise. This promise can be overridden and is therefore
       * not free to access.
       */
      _requestUpdate(name, oldValue) {
          let shouldRequestUpdate = true;
          // If we have a property key, perform property update steps.
          if (name !== undefined) {
              const ctor = this.constructor;
              const options = ctor._classProperties.get(name) || defaultPropertyDeclaration;
              if (ctor._valueHasChanged(this[name], oldValue, options.hasChanged)) {
                  if (!this._changedProperties.has(name)) {
                      this._changedProperties.set(name, oldValue);
                  }
                  // Add to reflecting properties set.
                  // Note, it's important that every change has a chance to add the
                  // property to `_reflectingProperties`. This ensures setting
                  // attribute + property reflects correctly.
                  if (options.reflect === true &&
                      !(this._updateState & STATE_IS_REFLECTING_TO_PROPERTY)) {
                      if (this._reflectingProperties === undefined) {
                          this._reflectingProperties = new Map();
                      }
                      this._reflectingProperties.set(name, options);
                  }
              }
              else {
                  // Abort the request if the property should not be considered changed.
                  shouldRequestUpdate = false;
              }
          }
          if (!this._hasRequestedUpdate && shouldRequestUpdate) {
              this._enqueueUpdate();
          }
      }
      /**
       * Requests an update which is processed asynchronously. This should
       * be called when an element should update based on some state not triggered
       * by setting a property. In this case, pass no arguments. It should also be
       * called when manually implementing a property setter. In this case, pass the
       * property `name` and `oldValue` to ensure that any configured property
       * options are honored. Returns the `updateComplete` Promise which is resolved
       * when the update completes.
       *
       * @param name {PropertyKey} (optional) name of requesting property
       * @param oldValue {any} (optional) old value of requesting property
       * @returns {Promise} A Promise that is resolved when the update completes.
       */
      requestUpdate(name, oldValue) {
          this._requestUpdate(name, oldValue);
          return this.updateComplete;
      }
      /**
       * Sets up the element to asynchronously update.
       */
      async _enqueueUpdate() {
          // Mark state updating...
          this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
          let resolve;
          let reject;
          const previousUpdatePromise = this._updatePromise;
          this._updatePromise = new Promise((res, rej) => {
              resolve = res;
              reject = rej;
          });
          try {
              // Ensure any previous update has resolved before updating.
              // This `await` also ensures that property changes are batched.
              await previousUpdatePromise;
          }
          catch (e) {
              // Ignore any previous errors. We only care that the previous cycle is
              // done. Any error should have been handled in the previous update.
          }
          // Make sure the element has connected before updating.
          if (!this._hasConnected) {
              await new Promise((res) => this._hasConnectedResolver = res);
          }
          try {
              const result = this.performUpdate();
              // If `performUpdate` returns a Promise, we await it. This is done to
              // enable coordinating updates with a scheduler. Note, the result is
              // checked to avoid delaying an additional microtask unless we need to.
              if (result != null) {
                  await result;
              }
          }
          catch (e) {
              reject(e);
          }
          resolve(!this._hasRequestedUpdate);
      }
      get _hasConnected() {
          return (this._updateState & STATE_HAS_CONNECTED);
      }
      get _hasRequestedUpdate() {
          return (this._updateState & STATE_UPDATE_REQUESTED);
      }
      get hasUpdated() {
          return (this._updateState & STATE_HAS_UPDATED);
      }
      /**
       * Performs an element update. Note, if an exception is thrown during the
       * update, `firstUpdated` and `updated` will not be called.
       *
       * You can override this method to change the timing of updates. If this
       * method is overridden, `super.performUpdate()` must be called.
       *
       * For instance, to schedule updates to occur just before the next frame:
       *
       * ```
       * protected async performUpdate(): Promise<unknown> {
       *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
       *   super.performUpdate();
       * }
       * ```
       */
      performUpdate() {
          // Mixin instance properties once, if they exist.
          if (this._instanceProperties) {
              this._applyInstanceProperties();
          }
          let shouldUpdate = false;
          const changedProperties = this._changedProperties;
          try {
              shouldUpdate = this.shouldUpdate(changedProperties);
              if (shouldUpdate) {
                  this.update(changedProperties);
              }
          }
          catch (e) {
              // Prevent `firstUpdated` and `updated` from running when there's an
              // update exception.
              shouldUpdate = false;
              throw e;
          }
          finally {
              // Ensure element can accept additional updates after an exception.
              this._markUpdated();
          }
          if (shouldUpdate) {
              if (!(this._updateState & STATE_HAS_UPDATED)) {
                  this._updateState = this._updateState | STATE_HAS_UPDATED;
                  this.firstUpdated(changedProperties);
              }
              this.updated(changedProperties);
          }
      }
      _markUpdated() {
          this._changedProperties = new Map();
          this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
      }
      /**
       * Returns a Promise that resolves when the element has completed updating.
       * The Promise value is a boolean that is `true` if the element completed the
       * update without triggering another update. The Promise result is `false` if
       * a property was set inside `updated()`. If the Promise is rejected, an
       * exception was thrown during the update. This getter can be implemented to
       * await additional state. For example, it is sometimes useful to await a
       * rendered element before fulfilling this Promise. To do this, first await
       * `super.updateComplete` then any subsequent state.
       *
       * @returns {Promise} The Promise returns a boolean that indicates if the
       * update resolved without triggering another update.
       */
      get updateComplete() {
          return this._updatePromise;
      }
      /**
       * Controls whether or not `update` should be called when the element requests
       * an update. By default, this method always returns `true`, but this can be
       * customized to control when to update.
       *
       * * @param _changedProperties Map of changed properties with old values
       */
      shouldUpdate(_changedProperties) {
          return true;
      }
      /**
       * Updates the element. This method reflects property values to attributes.
       * It can be overridden to render and keep updated element DOM.
       * Setting properties inside this method will *not* trigger
       * another update.
       *
       * * @param _changedProperties Map of changed properties with old values
       */
      update(_changedProperties) {
          if (this._reflectingProperties !== undefined &&
              this._reflectingProperties.size > 0) {
              // Use forEach so this works even if for/of loops are compiled to for
              // loops expecting arrays
              this._reflectingProperties.forEach((v, k) => this._propertyToAttribute(k, this[k], v));
              this._reflectingProperties = undefined;
          }
      }
      /**
       * Invoked whenever the element is updated. Implement to perform
       * post-updating tasks via DOM APIs, for example, focusing an element.
       *
       * Setting properties inside this method will trigger the element to update
       * again after this update cycle completes.
       *
       * * @param _changedProperties Map of changed properties with old values
       */
      updated(_changedProperties) {
      }
      /**
       * Invoked when the element is first updated. Implement to perform one time
       * work on the element after update.
       *
       * Setting properties inside this method will trigger the element to update
       * again after this update cycle completes.
       *
       * * @param _changedProperties Map of changed properties with old values
       */
      firstUpdated(_changedProperties) {
      }
  }
  /**
   * Marks class as having finished creating properties.
   */
  UpdatingElement.finalized = true;

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
  @license
  Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at
  http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
  http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
  found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
  part of the polymer project is also subject to an additional IP rights grant
  found at http://polymer.github.io/PATENTS.txt
  */
  const supportsAdoptingStyleSheets = ('adoptedStyleSheets' in Document.prototype) &&
      ('replace' in CSSStyleSheet.prototype);
  const constructionToken = Symbol();
  class CSSResult {
      constructor(cssText, safeToken) {
          if (safeToken !== constructionToken) {
              throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
          }
          this.cssText = cssText;
      }
      // Note, this is a getter so that it's lazy. In practice, this means
      // stylesheets are not created until the first element instance is made.
      get styleSheet() {
          if (this._styleSheet === undefined) {
              // Note, if `adoptedStyleSheets` is supported then we assume CSSStyleSheet
              // is constructable.
              if (supportsAdoptingStyleSheets) {
                  this._styleSheet = new CSSStyleSheet();
                  this._styleSheet.replaceSync(this.cssText);
              }
              else {
                  this._styleSheet = null;
              }
          }
          return this._styleSheet;
      }
      toString() {
          return this.cssText;
      }
  }
  const textFromCSSResult = (value) => {
      if (value instanceof CSSResult) {
          return value.cssText;
      }
      else {
          throw new Error(`Value passed to 'css' function must be a 'css' function result: ${value}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`);
      }
  };
  /**
   * Template tag which which can be used with LitElement's `style` property to
   * set element styles. For security reasons, only literal string values may be
   * used. To incorporate non-literal values `unsafeCSS` may be used inside a
   * template string part.
   */
  const css = (strings, ...values) => {
      const cssText = values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
      return new CSSResult(cssText, constructionToken);
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // IMPORTANT: do not change the property name or the assignment expression.
  // This line will be used in regexes to search for LitElement usage.
  // TODO(justinfagnani): inject version number at build time
  (window['litElementVersions'] || (window['litElementVersions'] = []))
      .push('2.0.1');
  /**
   * Minimal implementation of Array.prototype.flat
   * @param arr the array to flatten
   * @param result the accumlated result
   */
  function arrayFlat(styles, result = []) {
      for (let i = 0, length = styles.length; i < length; i++) {
          const value = styles[i];
          if (Array.isArray(value)) {
              arrayFlat(value, result);
          }
          else {
              result.push(value);
          }
      }
      return result;
  }
  /** Deeply flattens styles array. Uses native flat if available. */
  const flattenStyles = (styles) => styles.flat ? styles.flat(Infinity) : arrayFlat(styles);
  class LitElement extends UpdatingElement {
      /** @nocollapse */
      static finalize() {
          super.finalize();
          // Prepare styling that is stamped at first render time. Styling
          // is built from user provided `styles` or is inherited from the superclass.
          this._styles =
              this.hasOwnProperty(JSCompiler_renameProperty('styles', this)) ?
                  this._getUniqueStyles() :
                  this._styles || [];
      }
      /** @nocollapse */
      static _getUniqueStyles() {
          // Take care not to call `this.styles` multiple times since this generates
          // new CSSResults each time.
          // TODO(sorvell): Since we do not cache CSSResults by input, any
          // shared styles will generate new stylesheet objects, which is wasteful.
          // This should be addressed when a browser ships constructable
          // stylesheets.
          const userStyles = this.styles;
          const styles = [];
          if (Array.isArray(userStyles)) {
              const flatStyles = flattenStyles(userStyles);
              // As a performance optimization to avoid duplicated styling that can
              // occur especially when composing via subclassing, de-duplicate styles
              // preserving the last item in the list. The last item is kept to
              // try to preserve cascade order with the assumption that it's most
              // important that last added styles override previous styles.
              const styleSet = flatStyles.reduceRight((set, s) => {
                  set.add(s);
                  // on IE set.add does not return the set.
                  return set;
              }, new Set());
              // Array.from does not work on Set in IE
              styleSet.forEach((v) => styles.unshift(v));
          }
          else if (userStyles) {
              styles.push(userStyles);
          }
          return styles;
      }
      /**
       * Performs element initialization. By default this calls `createRenderRoot`
       * to create the element `renderRoot` node and captures any pre-set values for
       * registered properties.
       */
      initialize() {
          super.initialize();
          this.renderRoot =
              this.createRenderRoot();
          // Note, if renderRoot is not a shadowRoot, styles would/could apply to the
          // element's getRootNode(). While this could be done, we're choosing not to
          // support this now since it would require different logic around de-duping.
          if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
              this.adoptStyles();
          }
      }
      /**
       * Returns the node into which the element should render and by default
       * creates and returns an open shadowRoot. Implement to customize where the
       * element's DOM is rendered. For example, to render into the element's
       * childNodes, return `this`.
       * @returns {Element|DocumentFragment} Returns a node into which to render.
       */
      createRenderRoot() {
          return this.attachShadow({ mode: 'open' });
      }
      /**
       * Applies styling to the element shadowRoot using the `static get styles`
       * property. Styling will apply using `shadowRoot.adoptedStyleSheets` where
       * available and will fallback otherwise. When Shadow DOM is polyfilled,
       * ShadyCSS scopes styles and adds them to the document. When Shadow DOM
       * is available but `adoptedStyleSheets` is not, styles are appended to the
       * end of the `shadowRoot` to [mimic spec
       * behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
       */
      adoptStyles() {
          const styles = this.constructor._styles;
          if (styles.length === 0) {
              return;
          }
          // There are three separate cases here based on Shadow DOM support.
          // (1) shadowRoot polyfilled: use ShadyCSS
          // (2) shadowRoot.adoptedStyleSheets available: use it.
          // (3) shadowRoot.adoptedStyleSheets polyfilled: append styles after
          // rendering
          if (window.ShadyCSS !== undefined && !window.ShadyCSS.nativeShadow) {
              window.ShadyCSS.ScopingShim.prepareAdoptedCssText(styles.map((s) => s.cssText), this.localName);
          }
          else if (supportsAdoptingStyleSheets) {
              this.renderRoot.adoptedStyleSheets =
                  styles.map((s) => s.styleSheet);
          }
          else {
              // This must be done after rendering so the actual style insertion is done
              // in `update`.
              this._needsShimAdoptedStyleSheets = true;
          }
      }
      connectedCallback() {
          super.connectedCallback();
          // Note, first update/render handles styleElement so we only call this if
          // connected after first update.
          if (this.hasUpdated && window.ShadyCSS !== undefined) {
              window.ShadyCSS.styleElement(this);
          }
      }
      /**
       * Updates the element. This method reflects property values to attributes
       * and calls `render` to render DOM via lit-html. Setting properties inside
       * this method will *not* trigger another update.
       * * @param _changedProperties Map of changed properties with old values
       */
      update(changedProperties) {
          super.update(changedProperties);
          const templateResult = this.render();
          if (templateResult instanceof TemplateResult) {
              this.constructor
                  .render(templateResult, this.renderRoot, { scopeName: this.localName, eventContext: this });
          }
          // When native Shadow DOM is used but adoptedStyles are not supported,
          // insert styling after rendering to ensure adoptedStyles have highest
          // priority.
          if (this._needsShimAdoptedStyleSheets) {
              this._needsShimAdoptedStyleSheets = false;
              this.constructor._styles.forEach((s) => {
                  const style = document.createElement('style');
                  style.textContent = s.cssText;
                  this.renderRoot.appendChild(style);
              });
          }
      }
      /**
       * Invoked on each update to perform rendering tasks. This method must return
       * a lit-html TemplateResult. Setting properties inside this method will *not*
       * trigger the element to update.
       */
      render() {
      }
  }
  /**
   * Ensure this class is marked as `finalized` as an optimization ensuring
   * it will not needlessly try to `finalize`.
   */
  LitElement.finalized = true;
  /**
   * Render method used to render the lit-html TemplateResult to the element's
   * DOM.
   * @param {TemplateResult} Template to render.
   * @param {Element|DocumentFragment} Node into which to render.
   * @param {String} Element name.
   * @nocollapse
   */
  LitElement.render = render$1;

  // 19.1.2.14 / 15.2.3.14 Object.keys(O)



  var objectKeys = Object.keys || function keys(O) {
    return objectKeysInternal(O, enumBugKeys);
  };

  var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
    anObject(O);
    var keys = objectKeys(Properties);
    var length = keys.length;
    var i = 0;
    var key;
    while (length > i) objectDefineProperty.f(O, key = keys[i++], Properties[key]);
    return O;
  };

  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])





  var IE_PROTO = sharedKey('IE_PROTO');
  var PROTOTYPE = 'prototype';
  var Empty = function () { /* empty */ };

  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  var createDict = function () {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = documentCreateElement('iframe');
    var length = enumBugKeys.length;
    var lt = '<';
    var script = 'script';
    var gt = '>';
    var js = 'java' + script + ':';
    var iframeDocument;
    iframe.style.display = 'none';
    html.appendChild(iframe);
    iframe.src = String(js);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(lt + script + gt + 'document.F=Object' + lt + '/' + script + gt);
    iframeDocument.close();
    createDict = iframeDocument.F;
    while (length--) delete createDict[PROTOTYPE][enumBugKeys[length]];
    return createDict();
  };

  var objectCreate = Object.create || function create(O, Properties) {
    var result;
    if (O !== null) {
      Empty[PROTOTYPE] = anObject(O);
      result = new Empty();
      Empty[PROTOTYPE] = null;
      // add "__proto__" for Object.getPrototypeOf polyfill
      result[IE_PROTO] = O;
    } else result = createDict();
    return Properties === undefined ? result : objectDefineProperties(result, Properties);
  };

  hiddenKeys[IE_PROTO] = true;

  var UNSCOPABLES = wellKnownSymbol('unscopables');


  var ArrayPrototype$1 = Array.prototype;

  // Array.prototype[@@unscopables]
  // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
  if (ArrayPrototype$1[UNSCOPABLES] == undefined) {
    hide(ArrayPrototype$1, UNSCOPABLES, objectCreate(null));
  }

  // add a key to Array.prototype[@@unscopables]
  var addToUnscopables = function (key) {
    ArrayPrototype$1[UNSCOPABLES][key] = true;
  };

  // `ToObject` abstract operation
  // https://tc39.github.io/ecma262/#sec-toobject
  var toObject = function (argument) {
    return Object(requireObjectCoercible(argument));
  };

  var correctPrototypeGetter = !fails(function () {
    function F() { /* empty */ }
    F.prototype.constructor = null;
    return Object.getPrototypeOf(new F()) !== F.prototype;
  });

  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


  var IE_PROTO$1 = sharedKey('IE_PROTO');

  var ObjectPrototype = Object.prototype;

  var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
    O = toObject(O);
    if (has(O, IE_PROTO$1)) return O[IE_PROTO$1];
    if (typeof O.constructor == 'function' && O instanceof O.constructor) {
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectPrototype : null;
  };

  var ITERATOR$3 = wellKnownSymbol('iterator');
  var BUGGY_SAFARI_ITERATORS = false;

  var returnThis = function () { return this; };

  // `%IteratorPrototype%` object
  // https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
  var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

  if ([].keys) {
    arrayIterator = [].keys();
    // Safari 8 has buggy iterators w/o `next`
    if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
    else {
      PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
      if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
    }
  }

  if (IteratorPrototype == undefined) IteratorPrototype = {};

  // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
  if (!has(IteratorPrototype, ITERATOR$3)) hide(IteratorPrototype, ITERATOR$3, returnThis);

  var iteratorsCore = {
    IteratorPrototype: IteratorPrototype,
    BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
  };

  var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





  var returnThis$1 = function () { return this; };

  var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
    var TO_STRING_TAG = NAME + ' Iterator';
    IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
    setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
    iterators[TO_STRING_TAG] = returnThis$1;
    return IteratorConstructor;
  };

  var validateSetPrototypeOfArguments = function (O, proto) {
    anObject(O);
    if (!isObject(proto) && proto !== null) {
      throw TypeError("Can't set " + String(proto) + ' as a prototype');
    }
  };

  // Works with __proto__ only. Old v8 can't work with null proto objects.
  /* eslint-disable no-proto */


  var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
    var correctSetter = false;
    var test = {};
    var setter;
    try {
      setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
      setter.call(test, []);
      correctSetter = test instanceof Array;
    } catch (error) { /* empty */ }
    return function setPrototypeOf(O, proto) {
      validateSetPrototypeOfArguments(O, proto);
      if (correctSetter) setter.call(O, proto);
      else O.__proto__ = proto;
      return O;
    };
  }() : undefined);

  var ITERATOR$4 = wellKnownSymbol('iterator');


  var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
  var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
  var KEYS = 'keys';
  var VALUES = 'values';
  var ENTRIES = 'entries';

  var returnThis$2 = function () { return this; };

  var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
    createIteratorConstructor(IteratorConstructor, NAME, next);

    var getIterationMethod = function (KIND) {
      if (KIND === DEFAULT && defaultIterator) return defaultIterator;
      if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
      switch (KIND) {
        case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
        case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
        case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
      } return function () { return new IteratorConstructor(this); };
    };

    var TO_STRING_TAG = NAME + ' Iterator';
    var INCORRECT_VALUES_NAME = false;
    var IterablePrototype = Iterable.prototype;
    var nativeIterator = IterablePrototype[ITERATOR$4]
      || IterablePrototype['@@iterator']
      || DEFAULT && IterablePrototype[DEFAULT];
    var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
    var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
    var CurrentIteratorPrototype, methods, KEY;

    // fix native
    if (anyNativeIterator) {
      CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
      if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
        if (objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
          if (objectSetPrototypeOf) {
            objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
          } else if (typeof CurrentIteratorPrototype[ITERATOR$4] != 'function') {
            hide(CurrentIteratorPrototype, ITERATOR$4, returnThis$2);
          }
        }
        // Set @@toStringTag to native iterators
        setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      }
    }

    // fix Array#{values, @@iterator}.name in V8 / FF
    if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() { return nativeIterator.call(this); };
    }

    // define iterator
    if (IterablePrototype[ITERATOR$4] !== defaultIterator) {
      hide(IterablePrototype, ITERATOR$4, defaultIterator);
    }
    iterators[NAME] = defaultIterator;

    // export additional methods
    if (DEFAULT) {
      methods = {
        values: getIterationMethod(VALUES),
        keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
        entries: getIterationMethod(ENTRIES)
      };
      if (FORCED) for (KEY in methods) {
        if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
          redefine(IterablePrototype, KEY, methods[KEY]);
        }
      } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
    }

    return methods;
  };

  var ARRAY_ITERATOR = 'Array Iterator';
  var setInternalState$1 = internalState.set;
  var getInternalState$1 = internalState.getterFor(ARRAY_ITERATOR);

  // `Array.prototype.entries` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.entries
  // `Array.prototype.keys` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.keys
  // `Array.prototype.values` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.values
  // `Array.prototype[@@iterator]` method
  // https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
  // `CreateArrayIterator` internal method
  // https://tc39.github.io/ecma262/#sec-createarrayiterator
  var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
    setInternalState$1(this, {
      type: ARRAY_ITERATOR,
      target: toIndexedObject(iterated), // target
      index: 0,                          // next index
      kind: kind                         // kind
    });
  // `%ArrayIteratorPrototype%.next` method
  // https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
  }, function () {
    var state = getInternalState$1(this);
    var target = state.target;
    var kind = state.kind;
    var index = state.index++;
    if (!target || index >= target.length) {
      state.target = undefined;
      return { value: undefined, done: true };
    }
    if (kind == 'keys') return { value: index, done: false };
    if (kind == 'values') return { value: target[index], done: false };
    return { value: [index, target[index]], done: false };
  }, 'values');

  // argumentsList[@@iterator] is %ArrayProto_values%
  // https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
  // https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
  iterators.Arguments = iterators.Array;

  // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables('keys');
  addToUnscopables('values');
  addToUnscopables('entries');

  const ERROR_CODES = {
    1: "Valid OK",
    2: "Invalid address",
    3: "Negative amount",
    4: "Nagative fee",
    5: "No balance",
    6: "Invalid reference",
    7: "Invalid time length",
    8: "Invalid value length",
    9: "Name already registered",
    10: "Name does not exist",
    11: "Invalid name owner",
    12: "Name already for sale",
    13: "Name not for sale",
    14: "Name buyer already owner",
    15: "Invalid amount",
    16: "Invalid seller",
    17: "Name not lowercase",
    18: "Invalid description length",
    19: "Invalid options length",
    20: "Invalid option length",
    21: "Duplicate option",
    22: "Poll already created",
    23: "Poll already has votes",
    24: "Poll does not exist",
    25: "Option does not exist",
    26: "Already voted for that option",
    27: "Invalid data length",
    28: "Invalid quantity",
    29: "Asset does not exist",
    30: "Invalid return",
    31: "Have equals want",
    32: "Order does not exist",
    33: "Invalid order creator",
    34: "Invalid payments length",
    35: "Negative price",
    36: "Invalid creation bytes",
    37: "Invalid tags length",
    38: "Invalid type length",
    40: "Fee less required",
    41: "Invalid raw data",
    42: "Delegation already exists",
    43: "Supernode invalid",
    44: "Super node already exists",
    45: "Spending disallowed",
    10000: "AT_ERROR",
    1000: "Not yet released.."
  };
  //    GENESIS_TRANSACTION: 1,
  //    PAYMENT_TRANSACTION: 2,
  //
  //    REGISTER_NAME_TRANSACTION: 3,
  //    UPDATE_NAME_TRANSACTION: 4,
  //    SELL_NAME_TRANSACTION: 5,
  //    CANCEL_SELL_NAME_TRANSACTION: 6,
  //    BUY_NAME_TRANSACTION: 7,
  //
  //    CREATE_POLL_TRANSACTION: 8,
  //    VOTE_ON_POLL_TRANSACTION: 9,
  //
  //    ARBITRARY_TRANSACTION: 10,
  //
  //    ISSUE_ASSET_TRANSACTION: 11,
  //    TRANSFER_ASSET_TRANSACTION: 12,
  //    CREATE_ORDER_TRANSACTION: 13,
  //    CANCEL_ORDER_TRANSACTION: 14,
  //    MULTI_PAYMENT_TRANSACTION: 15,
  //
  //    DEPLOY_AT_TRANSACTION: 16,
  //
  //    MESSAGE_TRANSACTION: 17
  //};

  /**
   * Base class for a target. Has checks in place to validate Target objects
   * @module Target
   */

  class Target {
      // // Need a static getter to check for inheritance...otherwise browser bundles can break
      // static get _isInheritedFromTargetBaseClass () {
      //     return true
      // }
      /**
          * Last step before sending data. Turns it into a string (obj->JSON)
          * @param {object} data
          */
      static prepareOutgoingData (data) {
          return JSON.stringify(data)
      }

      constructor (source) {
          if (!source) throw new Error('Source must be spcified')

          // Not needed, uses type instead
          // if (!this.constructor.test) throw new Error('Class requires a static `test` method in order to check whether or not a source is compatible with the constructor')

          if (!this.constructor.type) throw new Error(`Type not defined`)

          if (!this.constructor.name) console.warn(`No name provided`);

          if (!this.constructor.description) console.warn('No description provided');

          if (!this.sendMessage) throw new Error('A new target requires a sendMessage method')
      }
  }

  const messageTypes = {};
  const targetTypes = {};
  // Change this to have id based targets, and therefore the ability to access any target anywhere always as long as you have it's id (don't need to pass objects around)
  // const allTargets = {}

  /**
   * Epml core. All plugins build off this
   * @constructor
   */
  class Epml {
      /**
       * Installs a plugin "globally". Every new and existing epml instance will have this plugin enabled
       * @param {object} plugin - Epml plugin
       * @param {object} options - Options config object
       */
      static registerPlugin (plugin, options) {
          plugin.init(Epml, options);
          return Epml
      }

      // /**
      //  * Adds a request handler function. Will be called whenever a message has a requestType corressponding to the supplied type
      //  * @param {string} type - Unique request identifier
      //  * @param {function} fn - Function to handle requests of this type
      //  */
      // static addRequestHandler (type, fn) {
      //     if (epmlRequestTypeHandlers[type]) throw new Error(`${type} is already defined`)

      //     epmlRequestTypeHandlers[type] = fn
      // }

      /**
       * @typedef TargetConstructor - Target constructor. Return a Target
       */
      // /**
      //  * Adds a new target contructor
      //  * @param {TargetConstructor} TargetConstructor - Has many methods...
      //  * @param {function} targetConstructor.isValidTarget - Takes a target and returns true if this constructor can handle this type of target
      //  */
      // static addTargetConstructor (TargetConstructor) {
      //     if (!(TargetConstructor instanceof Target)) throw new Error(`TargetConstructor must inherit from the Target base class.`)
      //     targetConstructors.push(TargetConstructor)
      // }

      static registerTargetType (type, targetConstructor) {
          if (type in targetTypes) throw new Error('Target type has already been registered')
          if (!(targetConstructor.prototype instanceof Target)) throw new Error('Target constructors must inherit from the Target base class')
          targetTypes[type] = targetConstructor;
          return Epml
      }

      static registerEpmlMessageType (type, fn) {
          messageTypes[type] = fn;
          return Epml
      }

      /**
       * Installs a plugin for only this instance
       * @param {object} plugin - Epml plugin
       */
      registerPlugin (plugin) {
          plugin.init(this);
          return this
      }

      /**
       * Takes data from an event and figures out what to do with it
       * @param {object} strData - String data received from something like event.data
       * @param {Target} target - Target object from which the message was received
       */
      static handleMessage (strData, target) {
          // Changes to targetID...and gets fetched through Epml.targets[targetID]...or something like that
          const data = Epml.prepareIncomingData(strData);
          // console.log(target)
          if ('EpmlMessageType' in data) {
              messageTypes[data.EpmlMessageType](data, target);
          }
          // Then send a response or whatever back with target.sendMessage(this.constructor.prepareOutgoingData(someData))
      }

      /**
      * Prepares data for processing. Take JSON string and return object
      * @param {string} strData - JSON data in string form
      */
      static prepareIncomingData (strData) {
          if (typeof strData !== 'string') {
              // If sending object is enabled then return the string...otherwise stringify and then parse (safeguard against code injections...whatever the word for that was)
              return strData
          }
          return JSON.parse(strData)
      }

      /**
       * Takes (a) target(s) and returns an array of target Objects
       * @param {Object|Object[]} targets
       * @returns {Object[]} - An array of target objects
       */
      static createTargets (targetSources) {
          if (!Array.isArray(targetSources)) targetSources = [targetSources];

          const targets = [];

          for (const targetSource of targetSources) {
              if (targetSource.allowObjects === undefined) targetSource.allowObjects = false;
              targets.push(...Epml.createTarget(targetSource));
          }

          return targets
      }

      /**
       * Takes a single target source and returns an array of target object
       * @param {any} targetSource - Can be any target source for which a targetConstructor has been installed
       * @return {Object} - Target object
       */
      static createTarget (targetSource) {
          /*
              {
                  source: myContentWindow / "my_channel" / "myWorker.js",
                  type: 'WINDOW' / 'BROADCAST_CHANNEL' / 'WORKER',
                  allowObjects: Bool
              }
          */

          // const TargetConstructor = targetConstructors.find(tCtor => tCtor.test(targetSource))
          // const newTarget = new TargetConstructor(targetSource)
          // console.log(targetTypes, targetTypes[targetSource.type])
          if (!targetTypes[targetSource.type]) {
              throw new Error(`Target type '${targetSource.type}' not registered`)
          }
          let newTargets = new targetTypes[targetSource.type](targetSource.source);
          if (!Array.isArray(newTargets)) newTargets = [newTargets];
          for (const newTarget of newTargets) {
              newTarget.allowObjects = targetSource.allowObjects;
          }
          return newTargets
      }

      /**
       * Creates a new Epml instance
       * @constructor
       * @param {Object|Object[]} targets - Target instantiation object or an array of them
       */
      constructor (targets) {
          this.targets = this.constructor.createTargets(targets);
      }
  }

  // https://gist.github.com/LeverOne/1308368
  var genUUID = (a, b) => { for (b = a = ''; a++ < 36; b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-'); return b };

  // function () {
  //     return (1 + Math.random()).toString(36)
  // }

  /**
   * Requires epml-request plugin...or not
   */

  const READY_CHECK_INTERVAL = 15; // ms
  const READY_MESSAGE_TYPE = 'EPML_READY_STATE_CHECK';
  const READY_MESSAGE_RESPONSE_TYPE = 'EPML_READY_STATE_CHECK_RESPONSE';

  const pendingReadyRequests = {};

  const readyPlugin = {
      init: (Epml, options) => {
          // if (!Epml.prototype.request) throw new Error('Requires request plugin')

          if (Epml.prototype.ready) throw new Error('Epml.prototype.ready is already defined')
          if (Epml.prototype.imReady) throw new Error('Epml.prototype.imReady is already defined')

          Epml.prototype.ready = readyPrototype;
          Epml.prototype.resetReadyCheck = resetCheckReadyPrototype;
          Epml.prototype.imReady = imReadyPrototype;

          // Being asked if ready
          Epml.registerEpmlMessageType(READY_MESSAGE_TYPE, respondToReadyRequest);

          // Getting a response after polling for ready
          Epml.registerEpmlMessageType(READY_MESSAGE_RESPONSE_TYPE, readyResponseHandler);
      }
  };

  // This is the only part in the other "window"
  function respondToReadyRequest (data, target) {
      if (!target._i_am_ready) return
      target.sendMessage({
          EpmlMessageType: READY_MESSAGE_RESPONSE_TYPE,
          requestID: data.requestID
      });
  }

  function imReadyPrototype () {
      // console.log('I\'m ready called', this)
      for (const target of this.targets) {
          target._i_am_ready = true;
      }
      // this._ready_plugin.imReady = true
  }

  // myEpmlInstance.ready().then(...)
  function readyPrototype () {
      this._ready_plugin = this._ready_plugin || {};

      this._ready_plugin.pendingReadyResolves = this._ready_plugin.pendingReadyResolves ? this._ready_plugin.pendingReadyResolves : []; // Call resolves when all targets are ready

      if (!this._pending_ready_checking) {
          this._pending_ready_checking = true;
          checkReady.call(this, this.targets)
              .then(() => {
                  this._ready_plugin.pendingReadyResolves.forEach(resolve => resolve());
              });
      }

      return new Promise(resolve => {
          if (this._ready_plugin.isReady) {
              resolve();
          } else {
              this._ready_plugin.pendingReadyResolves.push(resolve);
          }
      })
  }

  function resetCheckReadyPrototype () {
      this._ready_plugin = this._ready_plugin || {};
      this._ready_plugin.isReady = false;
  }

  function checkReady (targets) {
      // console.log('Checking', targets)
      this._ready_plugin = this._ready_plugin || {};
      this._ready_plugin.pendingReadyResolves = [];

      return Promise.all(targets.map(target => {
          return new Promise((resolve, reject) => {
              const id = genUUID();
              // Send a message at an interval.
              const inteval = setInterval(() => {
                  // console.log('interval')
                  // , this, window.location
                  target.sendMessage({
                      EpmlMessageType: READY_MESSAGE_TYPE,
                      requestID: id
                  });
              }, READY_CHECK_INTERVAL);

              // Clear the interval and resolve the promise
              pendingReadyRequests[id] = () => {
                  // console.log('RESOLVING')
                  clearInterval(inteval);
                  resolve();
              };
          })
      })).then(() => {
          this._ready_plugin.isReady = true;
      })
  }

  // Sets ready for a SINGLE TARGET
  function readyResponseHandler (data, target) {
      // console.log('response')
      // console.log('==== THIS TARGET IS REEEEEAAADDDDYYY ====')
      // console.log(target)

      target._ready_plugin = target._ready_plugin || {};
      target._ready_plugin._is_ready = true;

      pendingReadyRequests[data.requestID]();
  }

  // IE8 event listener support...probably going to be pointless in the end
  function bindEvent (element, eventName, eventHandler) {
      if (element.addEventListener) {
          element.addEventListener(eventName, eventHandler, false);
      } else if (element.attachEvent) {
          element.attachEvent('on' + eventName, eventHandler);
      } else {
          throw new Error('Could not bind event.')
      }
  }

  const sourceTargetMap = new Map();

  /**
   * Can only take ONE iframe or popup as source
   */
  class ContentWindowTarget extends Target {
      static get sources () {
          return Array.from(sourceTargetMap.keys())
      }

      static get targets () {
          return Array.from(sourceTargetMap.values())
      }

      static getTargetFromSource (source) {
          return sourceTargetMap.get(source)
      }

      static hasTarget (source) {
          return sourceTargetMap.has(source)
      }

      static get type () {
          return 'WINDOW'
      }

      static get name () {
          return 'Content window plugin'
      }

      static get description () {
          return `Allows Epml to communicate with iframes and popup windows.`
      }

      static test (source) {
          // if (typeof source !== 'object') return false
          // console.log('FOCUS FNS', source.focus === window.focus)
          // return (source === source.window && source.focus === window.focus) // <- Cause cors is a beach
          return (typeof source === 'object' && source.focus === window.focus)
      }

      isFrom (source) {
          //
      }

      constructor (source) {
          super(source);

          // if (source.contentWindow) source = source.contentWindow // <- Causes issues when cross origin

          // If the source already has an existing target object, simply return it.
          if (sourceTargetMap.has(source)) return sourceTargetMap.get(source)

          if (!this.constructor.test(source)) throw new Error('Source can not be used with target')

          this._source = source;

          // SHOULD MODIFY. Should become source = { contentWindow, origin } rather than source = contentWindow
          // try {
          //     this._sourceOrigin = source.origin
          // } catch (e) {
          //     // Go away CORS
          //     this._sourceOrigin = '*'
          // }
          this._sourceOrigin = '*';

          sourceTargetMap.set(source, this);

          // targetWindows.push(source)
      }

      get source () {
          return this._source
      }

      sendMessage (message) {
          message = Target.prepareOutgoingData(message);
          this._source.postMessage(message, this._sourceOrigin);
      }
  }

  /**
   * Epml content windows plugin. Enables communication with iframes and popup windows
   */
  var EpmlContentWindowPlugin = {
      init: function (Epml) {
          // const proto = Epml.prototype

          bindEvent(window, 'message', event => {
              // console.log(event)
              if (!ContentWindowTarget.hasTarget(event.source)) return
              Epml.handleMessage(event.data, ContentWindowTarget.getTargetFromSource(event.source));
              // Epml.handleMessage(event.data, event.source, message => {
              //     event.source.postMessage(message, event.origin)
              // })
          });

          // Epml.addTargetConstructor(ContentWindowTarget)
          Epml.registerTargetType(ContentWindowTarget.type, ContentWindowTarget);

          // Epml.addTargetHandler({
          //     targetType: 'WINDOW', // Unique type for each target type
          //     name: 'Content window',
          //     description: 'Allows Epml to communicate with iframes and popup windows',
          //     isMatchingTargetSource: function (source) {
          //         if (typeof source !== 'object') return false

          //         source = source.contentWindow || source
          //     },
          //     createTarget: function (source) {
          //         targetWindows.push({
          //             source,
          //             eventIsFromSource: function (event) {
          //                 if (event.source === source) return true
          //                 return false
          //             }
          //         })
          //         return {
          //             sendMessage: function (data) {
          //                 return source.postMessage(data, source.origin)
          //             }
          //         }
          //     }
          // })
      }
  };

  const REQUEST_MESSAGE_TYPE = 'REQUEST';
  const REQUEST_RESPONSE_MESSAGE_TYPE = 'REQUEST_RESPONSE';

  /**
   * Epml request module. Wrapper for asynchronous requests and responses (routes)
   * @module plugins/request/request.js
   */
  // Maps a target to an array of routes
  const routeMap = new Map();

  const pendingRequests = {};

  /**
   * Request plugin
   */
  const requestPlugin = {
      init: (Epml, options) => {
          if (Epml.prototype.request) throw new Error('Epml.prototype.request is already defined')

          if (Epml.prototype.route) throw new Error(`Empl.prototype.route is already defined`)

          Epml.prototype.request = requestFn;

          Epml.prototype.route = createRoute;

          Epml.registerEpmlMessageType(REQUEST_MESSAGE_TYPE, requestHandler);
          Epml.registerEpmlMessageType(REQUEST_RESPONSE_MESSAGE_TYPE, requestResponseHandler);
      }
  };

  const requestFn = function (requestType, data, timeout) {
      // console.log(this)
      return Promise.all(this.targets.map(target => {
          const uuid = genUUID();

          const message = {
              EpmlMessageType: REQUEST_MESSAGE_TYPE,
              requestOrResponse: 'request',
              requestID: uuid,
              requestType,
              data // If data is undefined it's simply omitted :)
          };

          target.sendMessage(message);

          return new Promise((resolve, reject) => {
              // console.log('PROMISEEEE')
              let timeOutFn;
              if (timeout) {
                  timeOutFn = setTimeout(() => {
                      delete pendingRequests[uuid];
                      reject(new Error('Request timed out'));
                  }, timeout);
              }

              pendingRequests[uuid] = (...args) => {
                  if (timeOutFn) clearTimeout(timeOutFn);
                  resolve(...args);
              };
              // console.log(pendingRequests)
          })
      }))
          .then(responses => {
              // console.log(responses)
              // If an instance only has one target, don't return the array. That'd be weird
              if (this.targets.length === 1) return responses[0]
          })
  };

  function requestResponseHandler (data, target) {
      // console.log("REQUESSTTT", data, pendingRequests)
      // console.log('IN REQUESTHANDLER', pendingRequests, data)
      if (data.requestID in pendingRequests) {
          pendingRequests[data.requestID](data.data);
      } else {
          console.warn('requestID not found in pendingRequests');
      }
  }

  function requestHandler (data, target) {
      // console.log('REQUESTHANLDER')
      // console.log(routeMap)
      // console.log(data)
      // console.log(target)
      if (!routeMap.has(target)) {
          // Error, route does not exist
          console.warn(`Route does not exist - missing target`);
          return
      }
      const routes = routeMap.get(target);
      // console.log(data, routes)
      const route = routes[data.requestType];
      if (!route) {
          // Error, route does not exist
          console.warn('Route does not exist');
          return
      }
      // console.log('CALLING FN')
      route(data, target);
  }

  function createRoute (route, fn) {
      // console.log(`CREATING ROUTTTEEE "${route}"`)
      if (!this.routes) this.routes = {};

      if (this.routes[route]) return

      for (const target of this.targets) {
          if (!routeMap.has(target)) {
              routeMap.set(target, {});
          }

          const routes = routeMap.get(target);

          routes[route] = (data, target) => {
              // console.log('ROUTE FN CALLED', data)
              // User supllied route function. This will turn it into a promise if it isn't one, or it will leave it as one.
              Promise.resolve(fn(data))
                  .then((response) => {
                      // response = this.constructor.prepareOutgoingData(response)
                      response = Target.prepareOutgoingData(response);
                      target.sendMessage({
                          data: response,
                          EpmlMessageType: REQUEST_RESPONSE_MESSAGE_TYPE,
                          requestOrResponse: 'request',
                          requestID: data.requestID
                      });
                  });
          };
      }

      // console.log('hello')
  }

  class TwoWayMap {
      constructor (map) {
          this._map = map || new Map();
          this._revMap = new Map();

          this._map.forEach((key, value) => {
              this._revMap.set(value, key);
          });
      }

      values () {
          return this._map.values()
      }

      entries () {
          return this._map.entries()
      }

      push (key, value) {
          this._map.set(key, value);
          this._revMap.set(value, key);
      }

      getByKey (key) {
          return this._map.get(key)
      }

      getByValue (value) {
          return this._revMap.get(value)
      }

      hasKey (key) {
          return this._map.has(key)
      }

      hasValue (value) {
          return this._revMap.has(value)
      }

      deleteByKey (key) {
          const value = this._map.get(key);
          this._map.delete(key);
          this._revMap.delete(value);
      }

      deleteByValue (value) {
          const key = this._revMap.get(value);
          this._map.delete(key);
          this._revMap.delete(value);
      }
  }

  const PROXY_MESSAGE_TYPE = 'PROXY_MESSAGE';

  // Proxy target source will be another instance of epml. The source instance will be the proxy. The extra parameter will be the target for that proxy

  // Stores source.proxy => new Map([[source.target, new ProxyTarget(source)]])
  const proxySources = new TwoWayMap();

  /**
   *  source = {
   *      target:'frame1',
   *      proxy: epmlInstance
   *  }
   */

  /**
   * Can only take ONE iframe or popup as source
   */
  class ProxyTarget extends Target {
      static get proxySources () {
          return proxySources
      }

      static get sources () {
          Array.from(proxySources.entries()).map((sourceProxy, valueMap) => {
              return {
                  proxy: sourceProxy,
                  target: Array.from(valueMap.keys())[0]
              }
          });
      }
      // ==================================================
      // ALL THIS NEEDS REWORKING. BUT PROBABLY NOT URGENT
      // ==================================================
      static get targets () {
          return Array.from(proxySources.values())
      }

      static getTargetFromSource (source) {
          return proxySources.getByValue(source)
      }

      static hasTarget (source) {
          return proxySources.hasValue(source)
      }

      static get type () {
          return 'PROXY'
      }

      static get name () {
          return 'Proxy target'
      }

      static get description () {
          return `Uses other target, and proxies requests, allowing things like iframes to communicate through their host`
      }

      static test (source) {
          if (typeof source !== 'object') return false
          // console.log('FOCUS FNS', source.focus === window.focus)
          if (!(source.proxy instanceof this.Epml)) return false
          // return (source === source.window && source.focus === window.focus)
          return true
      }

      isFrom (source) {
          //
      }

      // Bit different to a normal target, has a second parameter
      constructor (source) {
          super(source);
          /**
           * Source looks like {proxy: epmlInstance, target: 'referenceToTargetInProxy'}
           */

          this.constructor.proxySources.push(source.id, this);

          if (!this.constructor.test(source)) throw new Error('Source can not be used with target')

          this._source = source;
      }

      get source () {
          return this._source
      }

      sendMessage (message) {
          // ID for the proxy
          const uuid = genUUID();

          message = Target.prepareOutgoingData(message);

          message = {
              EpmlMessageType: PROXY_MESSAGE_TYPE,
              // proxyMessageType: 'REQUEST',
              state: 'TRANSIT',
              requestID: uuid,
              target: this._source.target, // 'frame1' - the registered name
              message,
              id: this._source.id
          };

          // console.log(this._source)
          // Doesn't need to loop through, as a proxy should only ever have a single proxy target (although the target can have multiple...it just shouldn't send THROUGH multiple targets)
          this._source.proxy.targets[0].sendMessage(message);
          // this._source.proxy.targets.forEach(target => target.sendMessage(messaage))
      }
  }

  // Proxy is a "normal" target, but it intercepts the message, changes the type, and passes it on to the target window, where it's received by the proxy handler...message type reverted, and passed to handleMessage with the actual target
  // import Target from '../../EpmlCore/Target.js';
  // Stores id => target (and reverse). Can be used in the host and the target...targets just have different roles :)
  // const proxySources = new TwoWayMap() // Map id to it's target :) OOOHHHHH....MAYBE THIS SHOULD BE IN THE PROXYTARGET...AND IT GET ACCESSED FROM HERE. DUH!!!
  // ProxyTarget.proxySources = proxySources // :)
  const proxySources$1 = ProxyTarget.proxySources;
  // There will be two message states....transit or delivery. Transit is sent to the proxy....delivery is sent to the target....the source simply being the target in the opposit direction

  let EpmlReference;

  var EpmlProxyPlugin = {
      init: function (Epml) {
          // const proto = Epml.prototype

          Object.defineProperty(ProxyTarget, 'Epml', {
              get: () => Epml
          });

          // So that the below functions can access
          EpmlReference = Epml;

          // Epml.addTargetConstructor(ContentWindowTarget)
          Epml.registerTargetType(ProxyTarget.type, ProxyTarget);

          Epml.registerProxyInstance = registerProxyInstance;

          Epml.registerEpmlMessageType(PROXY_MESSAGE_TYPE, proxyMessageHandler);
      }
  };

  function proxyMessageHandler (data, target) {
      // console.log(data)
      // SWITCH BASED ON STATE === TRANSIT OR DELIVERY
      // If it's in transit, then look up the id in the map and pass the corresponding target...
      // YES! Instead of creating a new target that will translate to send to the thing....you look up the source's id....it will (have to) correspond to the source object created in this window :)

      if (data.state === 'TRANSIT') {
          // This fetches an epml instance which has the id, and so has the targets inside of it...i guess
          const targetInstance = proxySources$1.getByKey(data.target);
          if (!targetInstance) {
              console.warn(`Target ${data.target} not registered.`);
              return
          }

          data.state = 'DELIVERY';
          // console.log(targetInstance)
          targetInstance.targets.forEach(target => target.sendMessage(data));
          // targets.targets[0].sendMessage(data)
      } else if (data.state === 'DELIVERY') {
          // This target is a target created through type: proxy
          const target = proxySources$1.getByKey(data.target);
          // console.log(target)
          // console.log(proxySources)
          // console.log(data)
          EpmlReference.handleMessage(data.message, target);
      }
  }

  // NOT A TARGET....IT'S AN EPML INSTANCE
  function registerProxyInstance (id, target) {
      // console.log(target, id)
      if (proxySources$1.hasKey(id)) console.warn(`${id} is already defined. Overwriting...`);
      proxySources$1.push(id, target);
      // console.log(proxySources)
  }

  // I need to pass the proxySources twowaymap to the proxyTarget object, so that any new target created through it can be pushed to it

  const STREAM_UPDATE_MESSAGE_TYPE = 'STREAM_UPDATE';

  const allStreams = {}; // Maybe not even needed

  class EpmlStream {
      static get streams () {
          return allStreams
      }

      constructor (name, subscriptionFn = () => {}) {
          this._name = name; // Stream name
          this.targets = []; // Targets listening to the stream
          this._subscriptionFn = subscriptionFn; // Called on subscription, whatever it returns we send to the new target
          if (name in allStreams) throw new Error(`Stream with name ${name} already exists!`)
          allStreams[name] = this;
      }

      async subscribe (target) {
          if (target in this.targets) {
              console.info('Target is already subscribed to this stream');
          }
          const response = await this._subscriptionFn();
          this._sendMessage(response, target);
          this.targets.push(target);
      }

      _sendMessage (data, target) {
          target.sendMessage({
              data: Target.prepareOutgoingData(data),
              EpmlMessageType: STREAM_UPDATE_MESSAGE_TYPE,
              streamName: this._name
          });
      }

      emit (data) {
          this.targets.forEach(target => this._sendMessage(data, target));
      }
  }

  const JOIN_STREAM_MESSAGE_TYPE = 'JOIN_STREAM';

  /**
   * Epml streams module. Wrapper for asynchronous requests and responses (routes)
   * @module plugins/request/request.js
   */
  // Maps a target to an array of routes
  // const routeMap = new Map()

  // const pendingRequests = {}

  // allStreams = Streams.allStreams

  // // Server
  // const targetsToStreamsMap = new Map()

  // // Client
  const subscriptions = {};

  /**
   * Request plugin
   */
  const EpmlStreamPlugin = {
      init: (Epml, options) => {
          // if (Epml.prototype.connectStream) throw new Error('Epml.prototype.connectStream is already defined')
          if (Epml.prototype.subscribe) throw new Error('Epml.prototype.subscribe is already defined')

          if (Epml.prototype.createStream) throw new Error(`Empl.prototype.createStream is already defined`)

          Epml.prototype.subscribe = subscribe;

          Epml.registerEpmlMessageType(JOIN_STREAM_MESSAGE_TYPE, joinStream);
          Epml.registerEpmlMessageType(STREAM_UPDATE_MESSAGE_TYPE, receiveData);
      }
  };

  // 'server'side...on the side of myStream = new Stream('myStream'[, joinFn]).
  const joinStream = function (req, target) {
      // if (!targetsToStreamsMap.has(target)) {
      //     // Error, route does not exist
      //     console.warn(`Stream does not exist - missing target`)
      //     return
      // }
      const name = req.data.name;
      // const streamToJoin = targetsToStreamsMap.get(target)[name]
      const streamToJoin = EpmlStream.streams[name];
      if (!streamToJoin) console.warn(`No stream with name ${name}`, this);

      streamToJoin.subscribe(target);
  };

  // Gives an Epml instance access to a stream...maybe
  // const connectStream = function (streamInstance) {
  //     //
  // }

  // No such thing as Epml.createStream...just myStream = new Epml.Stream()

  // Client side
  // EpmlInstance.subscribe(...)
  const subscribe = function (name, listener) {
      this.targets.forEach(target => {
          target.sendMessage({
              EpmlMessageType: JOIN_STREAM_MESSAGE_TYPE,
              data: { name }
          });
      });
      subscriptions[name] = subscriptions[name] || [];
      subscriptions[name].push(listener);
  };
  // Client side
  // Called on STREAM_UPDATE_MESSAGE_TYPE message
  const receiveData = function (message, target) {
      // console.log('data', message, target)
      subscriptions[message.streamName].forEach(listener => listener(message.data));
  };

  Epml.registerPlugin(requestPlugin);
  Epml.registerPlugin(readyPlugin);
  Epml.registerPlugin(EpmlContentWindowPlugin);
  Epml.registerPlugin(EpmlStreamPlugin);
  Epml.registerPlugin(EpmlProxyPlugin);
  Epml.allowProxying = true;

  const KMX_IN_USD = 5; // 1 KMX - 5 USD

  const parentEpml = new Epml({
    type: 'WINDOW',
    source: window.parent
  });
  const coreEpml = new Epml({
    type: 'PROXY',
    source: {
      id: 'visible-plugin',
      target: 'core-plugin',
      proxy: parentEpml
    }
  });

  class SendMoneyPage extends LitElement {
    static get properties() {
      return {
        addresses: {
          type: Array
        },
        amount: {
          type: Number
        },
        errorMessage: {
          type: String
        },
        sendMoneyLoading: {
          type: Boolean
        },
        data: {
          type: Object
        },
        addressesInfo: {
          type: Object
        },
        selectedAddress: {
          type: Object
        },
        selectedAddressInfo: {
          type: Object
        },
        addressesUnconfirmedTransactions: {
          type: Object
        },
        addressInfoStreams: {
          type: Object
        },
        unconfirmedTransactionStreams: {
          type: Object
        },
        maxWidth: {
          type: String
        }
      };
    }

    static get observers() {
      return [// "_setSelectedAddressInfo(selectedAddress.*, addressesInfo)"
      '_usdKeyUp(usdAmount)', '_kmxKeyUp(amount)'];
    }

    static get styles() {
      return css`
            #sendMoneyWrapper {
                /* Extra 3px for left border */
                /* overflow: hidden; */
            }

            /* #sendMoneyWrapper>* {
                width: auto !important;
                padding: 0 15px;
            } */

            #sendMoneyWrapper paper-button {
                float: right;
            }

            #sendMoneyWrapper .buttons {
                /* --paper-button-ink-color: var(--paper-green-500);
                    color: var(--paper-green-500); */
                width: auto !important;
            }

            .address-item {
                --paper-item-focused: {
                    background: transparent;
                }
                ;
                --paper-item-focused-before: {
                    opacity: 0;
                }
                ;
            }

            .address-balance {
                font-size: 42px;
                font-weight: 100;
            }

            .show-transactions {
                cursor: pointer;
            }

            .address-icon {
                border-radius: 50%;
                border: 5px solid;
                /*border-left: 4px solid;*/
                padding: 8px;
            }

            paper-input {
                margin: 0;
            }

            .selectedBalance {
                font-size: 14px;
                display: block;
            }

            .selectedBalance .balance {
                font-size: 22px;
                font-weight: 100;
            }
        `;
    }

    render() {
      return html$1`
            <div id="sendMoneyWrapper" style="width:auto; margin:10px;">
                <div class="layout horizontal center">
                    <paper-card style="width:100%; max-width:740px;">
                        <div style="background-color: ${this.selectedAddress.color}; padding:12px 15px; margin:0; color: ${this.textColor(this.selectedAddress.textColor)};">

                            <h3 style="margin:0; padding:8px 0;">Send money</h3>

                            <div class="selectedBalance">
                                <!--  style$="color: {{selectedAddress.color}}" -->
                                <span class="balance">${this.selectedAddressInfo.nativeBalance.total[0]} KMX
                                    (${this.selectedAddressInfo.nativeBalance.total[0] * KMX_IN_USD} USD)</span> available for
                                transfer from
                                <span>${this.selectedAddress.address}</span>
                            </div>
                        </div>
            
                        <div class="card-content">
                            <!-- KMX <paper-toggle-button checked="{{useUSDAmount}}" style="cursor:pointer; display: inline"></paper-toggle-button> USD -->
            
                            <paper-input id="USDAmountInput" label="Amount (USD)" ?hidden="${!this.useUSDAmount}" value="${this.usdAmount}"
                                type="number">
                                <div slot="prefix">$ &nbsp;</div>
                            </paper-input>
                            <paper-input id="amountInput" required label="Amount (KMX)" type="number" invalid=${this.validAmount} value="${this.amount}"
                                error-message="Insufficient funds" @keyup="${() => this._checkAmount}"></paper-input>
            
                            <paper-input label="To (address or name)" type="text" value="${this.recipient}"></paper-input>
            
                            <!-- <paper-input label="Fee" type="text" value="{{fee}}"></paper-input> -->
            
                            <p style="color:red">${this.errorMessage}</p>
                            <p style="color:green;word-break: break-word;">${this.successMessage}</p>
            
                            <div class="buttons">
                                <div>
                                    <paper-button autofocus on-tap="_sendMoney">Send &nbsp;
                                        <iron-icon icon="send"></iron-icon>
                                    </paper-button>
                                </div>
                            </div>

                            ${this.sendMoneyLoading ? html$1`
                                <paper-progress auto></paper-progress>
                            ` : ''}
                        </div>
                    </paper-card>
            
                </div>
            </div>
        `;
    }

    _floor(num) {
      return Math.floor(num);
    }

    _checkAmount() {
      this.validAmount = this.amount >= this.selectedAddressInfo.nativeBalance.total[0];
    }

    textColor(color) {
      return color == 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.87)';
    }

    async _sendMoney(e) {
      const amount = this.amount * Math.pow(10, 8);
      let recipient = this.recipient; // var fee = this.fee
      // Check for valid...^

      this.sendMoneyLoading = true;
      console.log(this.selectedAddress);
      let lastRef = await parentEpml.request('apiCall', {
        data: {
          type: 'api',
          url: `addresses/lastreference/${this.selectedAddress.address}/unconfirmed`
        }
      });
      lastRef = lastRef.data;
      let recipientAsNameInfo = await parentEpml.request('apiCall', {
        data: {
          type: 'api',
          url: `names/${recipient}` // eslint-disable-next-line handle-callback-err

        }
      }).catch(err => {
        return JSON.stringify({});
      });
      console.log(recipientAsNameInfo);

      if (recipientAsNameInfo.success) {
        recipientAsNameInfo = JSON.parse(recipientAsNameInfo.data);
        recipient = recipientAsNameInfo.value;
      }

      parentEpml.request('transaction', {
        data: {
          type: 2,
          nonce: this.selectedAddress.nonce,
          params: {
            recipient,
            amount,
            lastReference: lastRef // ,
            // fee

          }
        }
      }).then(response => {
        const responseData = JSON.parse(response.data);

        if (!responseData.reference) {
          throw new Error(`Error! ${ERROR_CODES[responseData]}. Error code ${responseData}`);
        }

        this.errorMessage = '';
        this.recipient = '';
        this.amount = '';
        this.successMessage = 'Success! ' + response.data;
      }).catch(err => {
        console.log(err);
        this.errorMessage = err;
      });
    }

    _getSelectedAddressInfo(addressesInfo, selectedAddress) {
      return this.addressesInfo[selectedAddress.address];
    }

    constructor() {
      super();
      this.addresses = [];
      this.errorMessage = '';
      this.sendMoneyLoading = false;
      this.data = {};
      this.addressesInfo = {};
      this.selectedAddress = {};
      this.selectedAddressInfo = {}; //computed: '_getSelectedAddressInfo(addressesInfo, selectedAddress)'

      this.addressesUnconfirmedTransactions = {};
      this.addressInfoStreams = {};
      this.unconfirmedTransactionStreams = {};
      this.maxWidth = '600';
      parentEpml.ready().then(() => {
        parentEpml.subscribe('selected_address', async selectedAddress => {
          selectedAddress = JSON.parse(selectedAddress);
          this.selectedAddress = {};
          if (!selectedAddress) return;
          const addr = selectedAddress.address;
          await coreEpml.ready();

          if (!this.addressInfoStreams[addr]) {
            this.addressInfoStreams[addr] = coreEpml.subscribe(`address/${addr}`, addrInfo => {
              console.log('Send money page received', addrInfo); // Ahh....actually if no balance....no last reference and so you can't send money

              addrInfo.nativeBalance = addrInfo.nativeBalance || {
                total: {}
              };
              addrInfo.nativeBalance.total['0'] = addrInfo.nativeBalance.total['0'] || 0;
              this.set(`addressesInfo.${addr}`, addrInfo);
              const addressesInfoStore = this.addressesInfo;
              this.addressesInfo = {};
              this.addressesInfo = addressesInfoStore;
            });
          }

          if (!this.unconfirmedTransactionStreams[addr]) {
            this.unconfirmedTransactionStreams[addr] = coreEpml.subscribe(`unconfirmedOfAddress/${addr}`, unconfirmedTransactions => {
              this.addressesUnconfirmedTransactions[addr] = unconfirmedTransactions;
            });
          }
        });
      });
    }

  }

  window.customElements.define('send-money-page', SendMoneyPage);

}());
