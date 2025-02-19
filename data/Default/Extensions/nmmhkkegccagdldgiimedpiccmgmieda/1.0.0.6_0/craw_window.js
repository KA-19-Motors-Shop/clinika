/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
var b,
  k = k || {};
k.scope = {};
k.createTemplateTagFirstArg = function (a) {
  return (a.raw = a);
};
k.createTemplateTagFirstArgWithRaw = function (a, c) {
  a.raw = c;
  return a;
};
k.arrayIteratorImpl = function (a) {
  var c = 0;
  return function () {
    return c < a.length ? { done: !1, value: a[c++] } : { done: !0 };
  };
};
k.arrayIterator = function (a) {
  return { next: k.arrayIteratorImpl(a) };
};
k.makeIterator = function (a) {
  var c = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
  return c ? c.call(a) : k.arrayIterator(a);
};
k.arrayFromIterator = function (a) {
  for (var c, d = []; !(c = a.next()).done; ) d.push(c.value);
  return d;
};
k.arrayFromIterable = function (a) {
  return a instanceof Array ? a : k.arrayFromIterator(k.makeIterator(a));
};
k.ASSUME_ES5 = !1;
k.ASSUME_NO_NATIVE_MAP = !1;
k.ASSUME_NO_NATIVE_SET = !1;
k.SIMPLE_FROUND_POLYFILL = !1;
k.ISOLATE_POLYFILLS = !1;
k.FORCE_POLYFILL_PROMISE = !1;
k.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
k.objectCreate =
  k.ASSUME_ES5 || "function" == typeof Object.create
    ? Object.create
    : function (a) {
        var c = function () {};
        c.prototype = a;
        return new c();
      };
k.defineProperty =
  k.ASSUME_ES5 || "function" == typeof Object.defineProperties
    ? Object.defineProperty
    : function (a, c, d) {
        if (a == Array.prototype || a == Object.prototype) return a;
        a[c] = d.value;
        return a;
      };
k.getGlobal = function (a) {
  a = [
    "object" == typeof globalThis && globalThis,
    a,
    "object" == typeof window && window,
    "object" == typeof self && self,
    "object" == typeof global && global,
  ];
  for (var c = 0; c < a.length; ++c) {
    var d = a[c];
    if (d && d.Math == Math) return d;
  }
  throw Error("Cannot find global object");
};
k.global = k.getGlobal(this);
k.IS_SYMBOL_NATIVE =
  "function" === typeof Symbol && "symbol" === typeof Symbol("x");
k.TRUST_ES6_POLYFILLS = !k.ISOLATE_POLYFILLS || k.IS_SYMBOL_NATIVE;
k.polyfills = {};
k.propertyToPolyfillSymbol = {};
k.POLYFILL_PREFIX = "$jscp$";
k.polyfill = function (a, c, d) {
  c &&
    (k.ISOLATE_POLYFILLS
      ? k.polyfillIsolated(a, c, d)
      : k.polyfillUnisolated(a, c));
};
k.polyfillUnisolated = function (a, c) {
  var d = k.global;
  a = a.split(".");
  for (var e = 0; e < a.length - 1; e++) {
    var f = a[e];
    if (!(f in d)) return;
    d = d[f];
  }
  a = a[a.length - 1];
  e = d[a];
  c = c(e);
  c != e &&
    null != c &&
    k.defineProperty(d, a, { configurable: !0, writable: !0, value: c });
};
k.polyfillIsolated = function (a, c, d) {
  var e = a.split(".");
  a = 1 === e.length;
  var f = e[0];
  f = !a && f in k.polyfills ? k.polyfills : k.global;
  for (var g = 0; g < e.length - 1; g++) {
    var h = e[g];
    if (!(h in f)) return;
    f = f[h];
  }
  e = e[e.length - 1];
  d = k.IS_SYMBOL_NATIVE && "es6" === d ? f[e] : null;
  c = c(d);
  null != c &&
    (a
      ? k.defineProperty(k.polyfills, e, {
          configurable: !0,
          writable: !0,
          value: c,
        })
      : c !== d &&
        (void 0 === k.propertyToPolyfillSymbol[e] &&
          (k.propertyToPolyfillSymbol[e] = k.IS_SYMBOL_NATIVE
            ? k.global.Symbol(e)
            : k.POLYFILL_PREFIX + e),
        k.defineProperty(f, k.propertyToPolyfillSymbol[e], {
          configurable: !0,
          writable: !0,
          value: c,
        })));
};
k.getConstructImplementation = function () {
  function a() {
    function d() {}
    new d();
    Reflect.construct(d, [], function () {});
    return new d() instanceof d;
  }
  if (
    k.TRUST_ES6_POLYFILLS &&
    "undefined" != typeof Reflect &&
    Reflect.construct
  ) {
    if (a()) return Reflect.construct;
    var c = Reflect.construct;
    return function (d, e, f) {
      d = c(d, e);
      f && Reflect.setPrototypeOf(d, f.prototype);
      return d;
    };
  }
  return function (d, e, f) {
    void 0 === f && (f = d);
    f = k.objectCreate(f.prototype || Object.prototype);
    return Function.prototype.apply.call(d, f, e) || f;
  };
};
k.construct = { valueOf: k.getConstructImplementation }.valueOf();
k.underscoreProtoCanBeSet = function () {
  var a = { a: !0 },
    c = {};
  try {
    return (c.__proto__ = a), c.a;
  } catch (d) {}
  return !1;
};
k.setPrototypeOf =
  k.TRUST_ES6_POLYFILLS && "function" == typeof Object.setPrototypeOf
    ? Object.setPrototypeOf
    : k.underscoreProtoCanBeSet()
    ? function (a, c) {
        a.__proto__ = c;
        if (a.__proto__ !== c) throw new TypeError(a + " is not extensible");
        return a;
      }
    : null;
k.inherits = function (a, c) {
  a.prototype = k.objectCreate(c.prototype);
  a.prototype.constructor = a;
  if (k.setPrototypeOf) {
    var d = k.setPrototypeOf;
    d(a, c);
  } else
    for (d in c)
      if ("prototype" != d)
        if (Object.defineProperties) {
          var e = Object.getOwnPropertyDescriptor(c, d);
          e && Object.defineProperty(a, d, e);
        } else a[d] = c[d];
  a.superClass_ = c.prototype;
};
k.polyfill(
  "Reflect",
  function (a) {
    return a ? a : {};
  },
  "es6"
);
k.polyfill(
  "Reflect.construct",
  function () {
    return k.construct;
  },
  "es6"
);
k.polyfill(
  "Reflect.setPrototypeOf",
  function (a) {
    if (a) return a;
    if (k.setPrototypeOf) {
      var c = k.setPrototypeOf;
      return function (d, e) {
        try {
          return c(d, e), !0;
        } catch (f) {
          return !1;
        }
      };
    }
    return null;
  },
  "es6"
);
k.findInternal = function (a, c, d) {
  a instanceof String && (a = String(a));
  for (var e = a.length, f = 0; f < e; f++) {
    var g = a[f];
    if (c.call(d, g, f, a)) return { i: f, v: g };
  }
  return { i: -1, v: void 0 };
};
k.checkStringArgs = function (a, c, d) {
  if (null == a)
    throw new TypeError(
      "The 'this' value for String.prototype." +
        d +
        " must not be null or undefined"
    );
  if (c instanceof RegExp)
    throw new TypeError(
      "First argument to String.prototype." +
        d +
        " must not be a regular expression"
    );
  return a + "";
};
k.polyfill(
  "String.prototype.endsWith",
  function (a) {
    return a
      ? a
      : function (c, d) {
          var e = k.checkStringArgs(this, c, "endsWith");
          c += "";
          void 0 === d && (d = e.length);
          d = Math.max(0, Math.min(d | 0, e.length));
          for (var f = c.length; 0 < f && 0 < d; )
            if (e[--d] != c[--f]) return !1;
          return 0 >= f;
        };
  },
  "es6"
);
k.polyfill(
  "String.prototype.startsWith",
  function (a) {
    return a
      ? a
      : function (c, d) {
          var e = k.checkStringArgs(this, c, "startsWith");
          c += "";
          var f = e.length,
            g = c.length;
          d = Math.max(0, Math.min(d | 0, e.length));
          for (var h = 0; h < g && d < f; ) if (e[d++] != c[h++]) return !1;
          return h >= g;
        };
  },
  "es6"
);
k.polyfill(
  "String.prototype.repeat",
  function (a) {
    return a
      ? a
      : function (c) {
          var d = k.checkStringArgs(this, null, "repeat");
          if (0 > c || 1342177279 < c)
            throw new RangeError("Invalid count value");
          c |= 0;
          for (var e = ""; c; ) if ((c & 1 && (e += d), (c >>>= 1))) d += d;
          return e;
        };
  },
  "es6"
);
k.polyfill(
  "String.prototype.trimLeft",
  function (a) {
    function c() {
      return this.replace(/^[\s\xa0]+/, "");
    }
    return a || c;
  },
  "es_2019"
);
k.initSymbol = function () {};
k.polyfill(
  "Symbol",
  function (a) {
    if (a) return a;
    var c = function (f, g) {
      this.$jscomp$symbol$id_ = f;
      k.defineProperty(this, "description", {
        configurable: !0,
        writable: !0,
        value: g,
      });
    };
    c.prototype.toString = function () {
      return this.$jscomp$symbol$id_;
    };
    var d = 0,
      e = function (f) {
        if (this instanceof e)
          throw new TypeError("Symbol is not a constructor");
        return new c("jscomp_symbol_" + (f || "") + "_" + d++, f);
      };
    return e;
  },
  "es6"
);
k.polyfill(
  "Symbol.iterator",
  function (a) {
    if (a) return a;
    a = Symbol("Symbol.iterator");
    for (
      var c =
          "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(
            " "
          ),
        d = 0;
      d < c.length;
      d++
    ) {
      var e = k.global[c[d]];
      "function" === typeof e &&
        "function" != typeof e.prototype[a] &&
        k.defineProperty(e.prototype, a, {
          configurable: !0,
          writable: !0,
          value: function () {
            return k.iteratorPrototype(k.arrayIteratorImpl(this));
          },
        });
    }
    return a;
  },
  "es6"
);
k.iteratorPrototype = function (a) {
  a = { next: a };
  a[Symbol.iterator] = function () {
    return this;
  };
  return a;
};
k.iteratorFromArray = function (a, c) {
  a instanceof String && (a += "");
  var d = 0,
    e = !1,
    f = {
      next: function () {
        if (!e && d < a.length) {
          var g = d++;
          return { value: c(g, a[g]), done: !1 };
        }
        e = !0;
        return { done: !0, value: void 0 };
      },
    };
  f[Symbol.iterator] = function () {
    return f;
  };
  return f;
};
k.polyfill(
  "Array.prototype.entries",
  function (a) {
    return a
      ? a
      : function () {
          return k.iteratorFromArray(this, function (c, d) {
            return [c, d];
          });
        };
  },
  "es6"
);
k.polyfill(
  "Array.prototype.keys",
  function (a) {
    return a
      ? a
      : function () {
          return k.iteratorFromArray(this, function (c) {
            return c;
          });
        };
  },
  "es6"
);
var m = m || {};
m.global = this || self;
m.exportPath_ = function (a, c, d, e) {
  a = a.split(".");
  e = e || m.global;
  a[0] in e ||
    "undefined" == typeof e.execScript ||
    e.execScript("var " + a[0]);
  for (var f; a.length && (f = a.shift()); )
    if (a.length || void 0 === c)
      e = e[f] && e[f] !== Object.prototype[f] ? e[f] : (e[f] = {});
    else if (!d && m.isObject(c) && m.isObject(e[f]))
      for (var g in c) c.hasOwnProperty(g) && (e[f][g] = c[g]);
    else e[f] = c;
};
m.define = function (a, c) {
  return c;
};
m.FEATURESET_YEAR = 2012;
m.DEBUG = !0;
m.LOCALE = "en";
m.TRUSTED_SITE = !0;
m.DISALLOW_TEST_ONLY_CODE = !m.DEBUG;
m.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING = !1;
m.provide = function (a) {
  if (m.isInModuleLoader_())
    throw Error("goog.provide cannot be used within a module.");
  m.constructNamespace_(a);
};
m.constructNamespace_ = function (a, c, d) {
  m.exportPath_(a, c, d);
};
m.getScriptNonce = function (a) {
  if (a && a != m.global) return m.getScriptNonce_(a.document);
  null === m.cspNonce_ && (m.cspNonce_ = m.getScriptNonce_(m.global.document));
  return m.cspNonce_;
};
m.NONCE_PATTERN_ = /^[\w+/_-]+[=]{0,2}$/;
m.cspNonce_ = null;
m.getScriptNonce_ = function (a) {
  return (a = a.querySelector && a.querySelector("script[nonce]")) &&
    (a = a.nonce || a.getAttribute("nonce")) &&
    m.NONCE_PATTERN_.test(a)
    ? a
    : "";
};
m.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
m.module = function (a) {
  if ("string" !== typeof a || !a || -1 == a.search(m.VALID_MODULE_RE_))
    throw Error("Invalid module identifier");
  if (!m.isInGoogModuleLoader_())
    throw Error(
      "Module " +
        a +
        " has been loaded incorrectly. Note, modules cannot be loaded as normal scripts. They require some kind of pre-processing step. You're likely trying to load a module via a script tag or as a part of a concatenated bundle without rewriting the module. For more info see: https://github.com/google/closure-library/wiki/goog.module:-an-ES6-module-like-alternative-to-goog.provide."
    );
  if (m.moduleLoaderState_.moduleName)
    throw Error("goog.module may only be called once per module.");
  m.moduleLoaderState_.moduleName = a;
};
m.module.get = function () {
  return null;
};
m.module.getInternal_ = function () {
  return null;
};
m.ModuleType = { ES6: "es6", GOOG: "goog" };
m.moduleLoaderState_ = null;
m.isInModuleLoader_ = function () {
  return m.isInGoogModuleLoader_() || m.isInEs6ModuleLoader_();
};
m.isInGoogModuleLoader_ = function () {
  return (
    !!m.moduleLoaderState_ && m.moduleLoaderState_.type == m.ModuleType.GOOG
  );
};
m.isInEs6ModuleLoader_ = function () {
  if (m.moduleLoaderState_ && m.moduleLoaderState_.type == m.ModuleType.ES6)
    return !0;
  var a = m.global.$jscomp;
  return a
    ? "function" != typeof a.getCurrentModulePath
      ? !1
      : !!a.getCurrentModulePath()
    : !1;
};
m.module.declareLegacyNamespace = function () {
  m.moduleLoaderState_.declareLegacyNamespace = !0;
};
m.declareModuleId = function (a) {
  if (m.moduleLoaderState_) m.moduleLoaderState_.moduleName = a;
  else {
    var c = m.global.$jscomp;
    if (!c || "function" != typeof c.getCurrentModulePath)
      throw Error(
        'Module with namespace "' + a + '" has been loaded incorrectly.'
      );
    c = c.require(c.getCurrentModulePath());
    m.loadedModules_[a] = { exports: c, type: m.ModuleType.ES6, moduleId: a };
  }
};
m.setTestOnly = function (a) {
  if (m.DISALLOW_TEST_ONLY_CODE)
    throw (
      ((a = a || ""),
      Error(
        "Importing test-only code into non-debug environment" +
          (a ? ": " + a : ".")
      ))
    );
};
m.forwardDeclare = function () {};
m.getObjectByName = function (a) {
  a = a.split(".");
  for (var c = m.global, d = 0; d < a.length; d++)
    if (((c = c[a[d]]), null == c)) return null;
  return c;
};
m.addDependency = function () {};
m.useStrictRequires = !1;
m.ENABLE_DEBUG_LOADER = !0;
m.logToConsole_ = function (a) {
  m.global.console && m.global.console.error(a);
};
m.require = function () {};
m.requireType = function () {
  return {};
};
m.basePath = "";
m.nullFunction = function () {};
m.abstractMethod = function () {
  throw Error("unimplemented abstract method");
};
m.addSingletonGetter = function (a) {
  a.instance_ = void 0;
  a.getInstance = function () {
    if (a.instance_) return a.instance_;
    m.DEBUG &&
      (m.instantiatedSingletons_[m.instantiatedSingletons_.length] = a);
    return (a.instance_ = new a());
  };
};
m.instantiatedSingletons_ = [];
m.LOAD_MODULE_USING_EVAL = !0;
m.SEAL_MODULE_EXPORTS = m.DEBUG;
m.loadedModules_ = {};
m.DEPENDENCIES_ENABLED = !1;
m.TRANSPILE = "detect";
m.ASSUME_ES_MODULES_TRANSPILED = !1;
m.TRANSPILE_TO_LANGUAGE = "";
m.TRANSPILER = "transpile.js";
m.hasBadLetScoping = null;
m.loadModule = function (a) {
  var c = m.moduleLoaderState_;
  try {
    m.moduleLoaderState_ = {
      moduleName: "",
      declareLegacyNamespace: !1,
      type: m.ModuleType.GOOG,
    };
    var d = {},
      e = d;
    if ("function" === typeof a) e = a.call(void 0, e);
    else if ("string" === typeof a)
      e = m.loadModuleFromSource_.call(void 0, e, a);
    else throw Error("Invalid module definition");
    var f = m.moduleLoaderState_.moduleName;
    if ("string" === typeof f && f)
      m.moduleLoaderState_.declareLegacyNamespace
        ? m.constructNamespace_(f, e, d !== e)
        : m.SEAL_MODULE_EXPORTS &&
          Object.seal &&
          "object" == typeof e &&
          null != e &&
          Object.seal(e),
        (m.loadedModules_[f] = {
          exports: e,
          type: m.ModuleType.GOOG,
          moduleId: m.moduleLoaderState_.moduleName,
        });
    else throw Error('Invalid module name "' + f + '"');
  } finally {
    m.moduleLoaderState_ = c;
  }
};
m.loadModuleFromSource_ = function (a, c) {
  eval(m.CLOSURE_EVAL_PREFILTER_.createScript(c));
  return a;
};
m.normalizePath_ = function (a) {
  a = a.split("/");
  for (var c = 0; c < a.length; )
    "." == a[c]
      ? a.splice(c, 1)
      : c && ".." == a[c] && a[c - 1] && ".." != a[c - 1]
      ? a.splice(--c, 2)
      : c++;
  return a.join("/");
};
m.loadFileSync_ = function (a) {
  if (m.global.CLOSURE_LOAD_FILE_SYNC)
    return m.global.CLOSURE_LOAD_FILE_SYNC(a);
  try {
    var c = new m.global.XMLHttpRequest();
    c.open("get", a, !1);
    c.send();
    return 0 == c.status || 200 == c.status ? c.responseText : null;
  } catch (d) {
    return null;
  }
};
m.transpile_ = function (a, c, d) {
  var e = m.global.$jscomp;
  e || (m.global.$jscomp = e = {});
  var f = e.transpile;
  if (!f) {
    var g = m.basePath + m.TRANSPILER,
      h = m.loadFileSync_(g);
    if (h) {
      (function () {
        (0, eval)(h + "\n//# sourceURL=" + g);
      }.call(m.global));
      if (
        m.global.$gwtExport &&
        m.global.$gwtExport.$jscomp &&
        !m.global.$gwtExport.$jscomp.transpile
      )
        throw Error(
          'The transpiler did not properly export the "transpile" method. $gwtExport: ' +
            JSON.stringify(m.global.$gwtExport)
        );
      m.global.$jscomp.transpile = m.global.$gwtExport.$jscomp.transpile;
      e = m.global.$jscomp;
      f = e.transpile;
    }
  }
  if (!f) {
    var l = " requires transpilation but no transpiler was found.";
    l +=
      ' Please add "//javascript/closure:transpiler" as a data dependency to ensure it is included.';
    f = e.transpile = function (n, p) {
      m.logToConsole_(p + l);
      return n;
    };
  }
  return f(a, c, d);
};
m.typeOf = function (a) {
  var c = typeof a;
  return "object" != c ? c : a ? (Array.isArray(a) ? "array" : c) : "null";
};
m.isArrayLike = function (a) {
  var c = m.typeOf(a);
  return "array" == c || ("object" == c && "number" == typeof a.length);
};
m.isDateLike = function (a) {
  return m.isObject(a) && "function" == typeof a.getFullYear;
};
m.isObject = function (a) {
  var c = typeof a;
  return ("object" == c && null != a) || "function" == c;
};
m.getUid = function (a) {
  return (
    (Object.prototype.hasOwnProperty.call(a, m.UID_PROPERTY_) &&
      a[m.UID_PROPERTY_]) ||
    (a[m.UID_PROPERTY_] = ++m.uidCounter_)
  );
};
m.hasUid = function (a) {
  return !!a[m.UID_PROPERTY_];
};
m.removeUid = function (a) {
  null !== a && "removeAttribute" in a && a.removeAttribute(m.UID_PROPERTY_);
  try {
    delete a[m.UID_PROPERTY_];
  } catch (c) {}
};
m.UID_PROPERTY_ = "closure_uid_" + ((1e9 * Math.random()) >>> 0);
m.uidCounter_ = 0;
m.cloneObject = function (a) {
  var c = m.typeOf(a);
  if ("object" == c || "array" == c) {
    if ("function" === typeof a.clone) return a.clone();
    c = "array" == c ? [] : {};
    for (var d in a) c[d] = m.cloneObject(a[d]);
    return c;
  }
  return a;
};
m.bindNative_ = function (a, c, d) {
  return a.call.apply(a.bind, arguments);
};
m.bindJs_ = function (a, c, d) {
  if (!a) throw Error();
  if (2 < arguments.length) {
    var e = Array.prototype.slice.call(arguments, 2);
    return function () {
      var f = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(f, e);
      return a.apply(c, f);
    };
  }
  return function () {
    return a.apply(c, arguments);
  };
};
m.bind = function (a, c, d) {
  Function.prototype.bind &&
  -1 != Function.prototype.bind.toString().indexOf("native code")
    ? (m.bind = m.bindNative_)
    : (m.bind = m.bindJs_);
  return m.bind.apply(null, arguments);
};
m.partial = function (a, c) {
  var d = Array.prototype.slice.call(arguments, 1);
  return function () {
    var e = d.slice();
    e.push.apply(e, arguments);
    return a.apply(this, e);
  };
};
m.mixin = function (a, c) {
  for (var d in c) a[d] = c[d];
};
m.now = function () {
  return Date.now();
};
m.globalEval = function (a) {
  (0, eval)(a);
};
m.getCssName = function (a, c) {
  if ("." == String(a).charAt(0))
    throw Error(
      'className passed in goog.getCssName must not start with ".". You passed: ' +
        a
    );
  var d = function (f) {
      return m.cssNameMapping_[f] || f;
    },
    e = function (f) {
      f = f.split("-");
      for (var g = [], h = 0; h < f.length; h++) g.push(d(f[h]));
      return g.join("-");
    };
  e = m.cssNameMapping_
    ? "BY_WHOLE" == m.cssNameMappingStyle_
      ? d
      : e
    : function (f) {
        return f;
      };
  a = c ? a + "-" + e(c) : e(a);
  return m.global.CLOSURE_CSS_NAME_MAP_FN
    ? m.global.CLOSURE_CSS_NAME_MAP_FN(a)
    : a;
};
m.setCssNameMapping = function (a, c) {
  m.cssNameMapping_ = a;
  m.cssNameMappingStyle_ = c;
};
m.getMsg = function (a, c, d) {
  d && d.html && (a = a.replace(/</g, "&lt;"));
  d &&
    d.unescapeHtmlEntities &&
    (a = a
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&apos;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&"));
  c &&
    (a = a.replace(/\{\$([^}]+)}/g, function (e, f) {
      return null != c && f in c ? c[f] : e;
    }));
  return a;
};
m.getMsgWithFallback = function (a) {
  return a;
};
m.exportSymbol = function (a, c, d) {
  m.exportPath_(a, c, !0, d);
};
m.exportProperty = function (a, c, d) {
  a[c] = d;
};
m.inherits = function (a, c) {
  function d() {}
  d.prototype = c.prototype;
  a.superClass_ = c.prototype;
  a.prototype = new d();
  a.prototype.constructor = a;
  a.base = function (e, f, g) {
    for (var h = Array(arguments.length - 2), l = 2; l < arguments.length; l++)
      h[l - 2] = arguments[l];
    return c.prototype[f].apply(e, h);
  };
};
m.scope = function (a) {
  if (m.isInModuleLoader_())
    throw Error("goog.scope is not supported within a module.");
  a.call(m.global);
};
m.defineClass = function (a, c) {
  var d = c.constructor,
    e = c.statics;
  (d && d != Object.prototype.constructor) ||
    (d = function () {
      throw Error("cannot instantiate an interface (no constructor defined).");
    });
  d = m.defineClass.createSealingConstructor_(d);
  a && m.inherits(d, a);
  delete c.constructor;
  delete c.statics;
  m.defineClass.applyProperties_(d.prototype, c);
  null != e &&
    (e instanceof Function ? e(d) : m.defineClass.applyProperties_(d, e));
  return d;
};
m.defineClass.SEAL_CLASS_INSTANCES = m.DEBUG;
m.defineClass.createSealingConstructor_ = function (a) {
  return m.defineClass.SEAL_CLASS_INSTANCES
    ? function () {
        var c = a.apply(this, arguments) || this;
        c[m.UID_PROPERTY_] = c[m.UID_PROPERTY_];
        return c;
      }
    : a;
};
m.defineClass.OBJECT_PROTOTYPE_FIELDS_ =
  "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(
    " "
  );
m.defineClass.applyProperties_ = function (a, c) {
  for (var d in c) Object.prototype.hasOwnProperty.call(c, d) && (a[d] = c[d]);
  for (var e = 0; e < m.defineClass.OBJECT_PROTOTYPE_FIELDS_.length; e++)
    (d = m.defineClass.OBJECT_PROTOTYPE_FIELDS_[e]),
      Object.prototype.hasOwnProperty.call(c, d) && (a[d] = c[d]);
};
m.TRUSTED_TYPES_POLICY_NAME = "goog";
m.identity_ = function (a) {
  return a;
};
m.createTrustedTypesPolicy = function () {
  var a = m.TRUSTED_TYPES_POLICY_NAME + "#html",
    c = null,
    d = m.global.trustedTypes;
  if (!d || !d.createPolicy) return c;
  try {
    c = d.createPolicy(a, {
      createHTML: m.identity_,
      createScript: m.identity_,
      createScriptURL: m.identity_,
    });
  } catch (e) {
    m.logToConsole_(e.message);
  }
  return c;
};
m.craw = {};
var q = function () {};
q.prototype.onWindowReady = function () {};
q.prototype.pollOnlineStatus = function () {
  return null;
};
q.prototype.finishedLaunch = function () {
  return !0;
};
q.prototype.getAppUnavailableMessage = function () {
  return chrome.i18n.getMessage("craw_app_unavailable");
};
q.defaultImpl_ = q;
m.craw.AppWindowDelegate = q;
m.debug = {};
function r(a) {
  if (Error.captureStackTrace) Error.captureStackTrace(this, r);
  else {
    var c = Error().stack;
    c && (this.stack = c);
  }
  a && (this.message = String(a));
}
m.inherits(r, Error);
r.prototype.name = "CustomError";
m.debug.Error = r;
m.dom = {};
m.dom.NodeType = {
  ELEMENT: 1,
  ATTRIBUTE: 2,
  TEXT: 3,
  CDATA_SECTION: 4,
  ENTITY_REFERENCE: 5,
  ENTITY: 6,
  PROCESSING_INSTRUCTION: 7,
  COMMENT: 8,
  DOCUMENT: 9,
  DOCUMENT_TYPE: 10,
  DOCUMENT_FRAGMENT: 11,
  NOTATION: 12,
};
m.asserts = {};
m.asserts.ENABLE_ASSERTS = m.DEBUG;
m.asserts.AssertionError = function (a, c) {
  r.call(this, m.asserts.subs_(a, c));
};
m.inherits(m.asserts.AssertionError, r);
m.asserts.AssertionError.prototype.name = "AssertionError";
m.asserts.DEFAULT_ERROR_HANDLER = function (a) {
  throw a;
};
m.asserts.errorHandler_ = m.asserts.DEFAULT_ERROR_HANDLER;
m.asserts.subs_ = function (a, c) {
  a = a.split("%s");
  for (var d = "", e = a.length - 1, f = 0; f < e; f++)
    d += a[f] + (f < c.length ? c[f] : "%s");
  return d + a[e];
};
m.asserts.doAssertFailure_ = function (a, c, d, e) {
  var f = "Assertion failed";
  if (d) {
    f += ": " + d;
    var g = e;
  } else a && ((f += ": " + a), (g = c));
  a = new m.asserts.AssertionError("" + f, g || []);
  m.asserts.errorHandler_(a);
};
m.asserts.setErrorHandler = function (a) {
  m.asserts.ENABLE_ASSERTS && (m.asserts.errorHandler_ = a);
};
m.asserts.assert = function (a, c, d) {
  m.asserts.ENABLE_ASSERTS &&
    !a &&
    m.asserts.doAssertFailure_(
      "",
      null,
      c,
      Array.prototype.slice.call(arguments, 2)
    );
  return a;
};
m.asserts.assertExists = function (a, c, d) {
  m.asserts.ENABLE_ASSERTS &&
    null == a &&
    m.asserts.doAssertFailure_(
      "Expected to exist: %s.",
      [a],
      c,
      Array.prototype.slice.call(arguments, 2)
    );
  return a;
};
m.asserts.fail = function (a, c) {
  m.asserts.ENABLE_ASSERTS &&
    m.asserts.errorHandler_(
      new m.asserts.AssertionError(
        "Failure" + (a ? ": " + a : ""),
        Array.prototype.slice.call(arguments, 1)
      )
    );
};
m.asserts.assertNumber = function (a, c, d) {
  m.asserts.ENABLE_ASSERTS &&
    "number" !== typeof a &&
    m.asserts.doAssertFailure_(
      "Expected number but got %s: %s.",
      [m.typeOf(a), a],
      c,
      Array.prototype.slice.call(arguments, 2)
    );
  return a;
};
m.asserts.assertString = function (a, c, d) {
  m.asserts.ENABLE_ASSERTS &&
    "string" !== typeof a &&
    m.asserts.doAssertFailure_(
      "Expected string but got %s: %s.",
      [m.typeOf(a), a],
      c,
      Array.prototype.slice.call(arguments, 2)
    );
};
m.asserts.assertFunction = function (a, c, d) {
  m.asserts.ENABLE_ASSERTS &&
    "function" !== typeof a &&
    m.asserts.doAssertFailure_(
      "Expected function but got %s: %s.",
      [m.typeOf(a), a],
      c,
      Array.prototype.slice.call(arguments, 2)
    );
};
m.asserts.assertObject = function (a, c, d) {
  m.asserts.ENABLE_ASSERTS &&
    !m.isObject(a) &&
    m.asserts.doAssertFailure_(
      "Expected object but got %s: %s.",
      [m.typeOf(a), a],
      c,
      Array.prototype.slice.call(arguments, 2)
    );
  return a;
};
m.asserts.assertArray = function (a, c, d) {
  m.asserts.ENABLE_ASSERTS &&
    !Array.isArray(a) &&
    m.asserts.doAssertFailure_(
      "Expected array but got %s: %s.",
      [m.typeOf(a), a],
      c,
      Array.prototype.slice.call(arguments, 2)
    );
};
m.asserts.assertBoolean = function (a, c, d) {
  m.asserts.ENABLE_ASSERTS &&
    "boolean" !== typeof a &&
    m.asserts.doAssertFailure_(
      "Expected boolean but got %s: %s.",
      [m.typeOf(a), a],
      c,
      Array.prototype.slice.call(arguments, 2)
    );
  return a;
};
m.asserts.assertElement = function (a, c, d) {
  !m.asserts.ENABLE_ASSERTS ||
    (m.isObject(a) && a.nodeType == m.dom.NodeType.ELEMENT) ||
    m.asserts.doAssertFailure_(
      "Expected Element but got %s: %s.",
      [m.typeOf(a), a],
      c,
      Array.prototype.slice.call(arguments, 2)
    );
  return a;
};
m.asserts.assertInstanceof = function (a, c, d, e) {
  !m.asserts.ENABLE_ASSERTS ||
    a instanceof c ||
    m.asserts.doAssertFailure_(
      "Expected instanceof %s but got %s.",
      [m.asserts.getType_(c), m.asserts.getType_(a)],
      d,
      Array.prototype.slice.call(arguments, 3)
    );
  return a;
};
m.asserts.assertFinite = function (a, c, d) {
  !m.asserts.ENABLE_ASSERTS ||
    ("number" == typeof a && isFinite(a)) ||
    m.asserts.doAssertFailure_(
      "Expected %s to be a finite number but it is not.",
      [a],
      c,
      Array.prototype.slice.call(arguments, 2)
    );
  return a;
};
m.asserts.assertObjectPrototypeIsIntact = function () {
  for (var a in Object.prototype)
    m.asserts.fail(a + " should not be enumerable in Object.prototype.");
};
m.asserts.getType_ = function (a) {
  return a instanceof Function
    ? a.displayName || a.name || "unknown type name"
    : a instanceof Object
    ? a.constructor.displayName ||
      a.constructor.name ||
      Object.prototype.toString.call(a)
    : null === a
    ? "null"
    : typeof a;
};
m.array = {};
m.NATIVE_ARRAY_PROTOTYPES = m.TRUSTED_SITE;
var u = 2012 < m.FEATURESET_YEAR;
m.array.ASSUME_NATIVE_FUNCTIONS = u;
function aa(a) {
  return a[a.length - 1];
}
m.array.peek = aa;
m.array.last = aa;
var ba =
  m.NATIVE_ARRAY_PROTOTYPES && (u || Array.prototype.indexOf)
    ? function (a, c, d) {
        m.asserts.assert(null != a.length);
        return Array.prototype.indexOf.call(a, c, d);
      }
    : function (a, c, d) {
        d = null == d ? 0 : 0 > d ? Math.max(0, a.length + d) : d;
        if ("string" === typeof a)
          return "string" !== typeof c || 1 != c.length ? -1 : a.indexOf(c, d);
        for (; d < a.length; d++) if (d in a && a[d] === c) return d;
        return -1;
      };
m.array.indexOf = ba;
var ca =
  m.NATIVE_ARRAY_PROTOTYPES && (u || Array.prototype.lastIndexOf)
    ? function (a, c, d) {
        m.asserts.assert(null != a.length);
        return Array.prototype.lastIndexOf.call(
          a,
          c,
          null == d ? a.length - 1 : d
        );
      }
    : function (a, c, d) {
        d = null == d ? a.length - 1 : d;
        0 > d && (d = Math.max(0, a.length + d));
        if ("string" === typeof a)
          return "string" !== typeof c || 1 != c.length
            ? -1
            : a.lastIndexOf(c, d);
        for (; 0 <= d; d--) if (d in a && a[d] === c) return d;
        return -1;
      };
m.array.lastIndexOf = ca;
var w =
  m.NATIVE_ARRAY_PROTOTYPES && (u || Array.prototype.forEach)
    ? function (a, c, d) {
        m.asserts.assert(null != a.length);
        Array.prototype.forEach.call(a, c, d);
      }
    : function (a, c, d) {
        for (
          var e = a.length, f = "string" === typeof a ? a.split("") : a, g = 0;
          g < e;
          g++
        )
          g in f && c.call(d, f[g], g, a);
      };
m.array.forEach = w;
function da(a, c, d) {
  var e = a.length,
    f = "string" === typeof a ? a.split("") : a;
  for (--e; 0 <= e; --e) e in f && c.call(d, f[e], e, a);
}
m.array.forEachRight = da;
var ea =
  m.NATIVE_ARRAY_PROTOTYPES && (u || Array.prototype.filter)
    ? function (a, c, d) {
        m.asserts.assert(null != a.length);
        return Array.prototype.filter.call(a, c, d);
      }
    : function (a, c, d) {
        for (
          var e = a.length,
            f = [],
            g = 0,
            h = "string" === typeof a ? a.split("") : a,
            l = 0;
          l < e;
          l++
        )
          if (l in h) {
            var n = h[l];
            c.call(d, n, l, a) && (f[g++] = n);
          }
        return f;
      };
m.array.filter = ea;
var x =
  m.NATIVE_ARRAY_PROTOTYPES && (u || Array.prototype.map)
    ? function (a, c, d) {
        m.asserts.assert(null != a.length);
        return Array.prototype.map.call(a, c, d);
      }
    : function (a, c, d) {
        for (
          var e = a.length,
            f = Array(e),
            g = "string" === typeof a ? a.split("") : a,
            h = 0;
          h < e;
          h++
        )
          h in g && (f[h] = c.call(d, g[h], h, a));
        return f;
      };
m.array.map = x;
var fa =
  m.NATIVE_ARRAY_PROTOTYPES && (u || Array.prototype.reduce)
    ? function (a, c, d, e) {
        m.asserts.assert(null != a.length);
        e && (c = m.bind(c, e));
        return Array.prototype.reduce.call(a, c, d);
      }
    : function (a, c, d, e) {
        var f = d;
        w(a, function (g, h) {
          f = c.call(e, f, g, h, a);
        });
        return f;
      };
m.array.reduce = fa;
m.array.reduceRight =
  m.NATIVE_ARRAY_PROTOTYPES && (u || Array.prototype.reduceRight)
    ? function (a, c, d, e) {
        m.asserts.assert(null != a.length);
        m.asserts.assert(null != c);
        e && (c = m.bind(c, e));
        return Array.prototype.reduceRight.call(a, c, d);
      }
    : function (a, c, d, e) {
        var f = d;
        da(a, function (g, h) {
          f = c.call(e, f, g, h, a);
        });
        return f;
      };
var ha =
  m.NATIVE_ARRAY_PROTOTYPES && (u || Array.prototype.some)
    ? function (a, c, d) {
        m.asserts.assert(null != a.length);
        return Array.prototype.some.call(a, c, d);
      }
    : function (a, c, d) {
        for (
          var e = a.length, f = "string" === typeof a ? a.split("") : a, g = 0;
          g < e;
          g++
        )
          if (g in f && c.call(d, f[g], g, a)) return !0;
        return !1;
      };
m.array.some = ha;
var ia =
  m.NATIVE_ARRAY_PROTOTYPES && (u || Array.prototype.every)
    ? function (a, c, d) {
        m.asserts.assert(null != a.length);
        return Array.prototype.every.call(a, c, d);
      }
    : function (a, c, d) {
        for (
          var e = a.length, f = "string" === typeof a ? a.split("") : a, g = 0;
          g < e;
          g++
        )
          if (g in f && !c.call(d, f[g], g, a)) return !1;
        return !0;
      };
m.array.every = ia;
m.array.count = function (a, c, d) {
  var e = 0;
  w(
    a,
    function (f, g, h) {
      c.call(d, f, g, h) && ++e;
    },
    d
  );
  return e;
};
function ja(a, c, d) {
  c = ka(a, c, d);
  return 0 > c ? null : "string" === typeof a ? a.charAt(c) : a[c];
}
m.array.find = ja;
function ka(a, c, d) {
  for (
    var e = a.length, f = "string" === typeof a ? a.split("") : a, g = 0;
    g < e;
    g++
  )
    if (g in f && c.call(d, f[g], g, a)) return g;
  return -1;
}
m.array.findIndex = ka;
m.array.findRight = function (a, c, d) {
  c = la(a, c, d);
  return 0 > c ? null : "string" === typeof a ? a.charAt(c) : a[c];
};
function la(a, c, d) {
  var e = a.length,
    f = "string" === typeof a ? a.split("") : a;
  for (--e; 0 <= e; e--) if (e in f && c.call(d, f[e], e, a)) return e;
  return -1;
}
m.array.findIndexRight = la;
function y(a, c) {
  return 0 <= ba(a, c);
}
m.array.contains = y;
function z(a) {
  return 0 == a.length;
}
m.array.isEmpty = z;
function ma(a) {
  if (!Array.isArray(a)) for (var c = a.length - 1; 0 <= c; c--) delete a[c];
  a.length = 0;
}
m.array.clear = ma;
m.array.insert = function (a, c) {
  y(a, c) || a.push(c);
};
function na(a, c, d) {
  oa(a, d, 0, c);
}
m.array.insertAt = na;
m.array.insertArrayAt = function (a, c, d) {
  m.partial(oa, a, d, 0).apply(null, c);
};
m.array.insertBefore = function (a, c, d) {
  var e;
  2 == arguments.length || 0 > (e = ba(a, d)) ? a.push(c) : na(a, c, e);
};
function pa(a, c) {
  c = ba(a, c);
  var d;
  (d = 0 <= c) && A(a, c);
  return d;
}
m.array.remove = pa;
m.array.removeLast = function (a, c) {
  c = ca(a, c);
  return 0 <= c ? (A(a, c), !0) : !1;
};
function A(a, c) {
  m.asserts.assert(null != a.length);
  return 1 == Array.prototype.splice.call(a, c, 1).length;
}
m.array.removeAt = A;
m.array.removeIf = function (a, c, d) {
  c = ka(a, c, d);
  return 0 <= c ? (A(a, c), !0) : !1;
};
m.array.removeAllIf = function (a, c, d) {
  var e = 0;
  da(a, function (f, g) {
    c.call(d, f, g, a) && A(a, g) && e++;
  });
  return e;
};
function B(a) {
  return Array.prototype.concat.apply([], arguments);
}
m.array.concat = B;
m.array.join = function (a) {
  return Array.prototype.concat.apply([], arguments);
};
function C(a) {
  var c = a.length;
  if (0 < c) {
    for (var d = Array(c), e = 0; e < c; e++) d[e] = a[e];
    return d;
  }
  return [];
}
m.array.toArray = C;
m.array.clone = C;
m.array.extend = function (a, c) {
  for (var d = 1; d < arguments.length; d++) {
    var e = arguments[d];
    if (m.isArrayLike(e)) {
      var f = a.length || 0,
        g = e.length || 0;
      a.length = f + g;
      for (var h = 0; h < g; h++) a[f + h] = e[h];
    } else a.push(e);
  }
};
function oa(a, c, d, e) {
  m.asserts.assert(null != a.length);
  return Array.prototype.splice.apply(a, D(arguments, 1));
}
m.array.splice = oa;
function D(a, c, d) {
  m.asserts.assert(null != a.length);
  return 2 >= arguments.length
    ? Array.prototype.slice.call(a, c)
    : Array.prototype.slice.call(a, c, d);
}
m.array.slice = D;
function qa(a, c, d) {
  c = c || a;
  var e = function (n) {
    return m.isObject(n) ? "o" + m.getUid(n) : (typeof n).charAt(0) + n;
  };
  d = d || e;
  e = {};
  for (var f = 0, g = 0; g < a.length; ) {
    var h = a[g++],
      l = d(h);
    Object.prototype.hasOwnProperty.call(e, l) || ((e[l] = !0), (c[f++] = h));
  }
  c.length = f;
}
m.array.removeDuplicates = qa;
function ra(a, c, d) {
  return sa(a, d || E, !1, c);
}
m.array.binarySearch = ra;
m.array.binarySelect = function (a, c, d) {
  return sa(a, c, !0, void 0, d);
};
function sa(a, c, d, e, f) {
  for (var g = 0, h = a.length, l; g < h; ) {
    var n = g + ((h - g) >>> 1);
    var p = d ? c.call(f, a[n], n, a) : c(e, a[n]);
    0 < p ? (g = n + 1) : ((h = n), (l = !p));
  }
  return l ? g : -g - 1;
}
function ta(a, c) {
  a.sort(c || E);
}
m.array.sort = ta;
m.array.stableSort = function (a, c) {
  for (var d = Array(a.length), e = 0; e < a.length; e++)
    d[e] = { index: e, value: a[e] };
  var f = c || E;
  ta(d, function (g, h) {
    return f(g.value, h.value) || g.index - h.index;
  });
  for (e = 0; e < a.length; e++) a[e] = d[e].value;
};
function ua(a, c, d) {
  var e = d || E;
  ta(a, function (f, g) {
    return e(c(f), c(g));
  });
}
m.array.sortByKey = ua;
m.array.sortObjectsByKey = function (a, c, d) {
  ua(
    a,
    function (e) {
      return e[c];
    },
    d
  );
};
function va(a, c, d) {
  c = c || E;
  for (var e = 1; e < a.length; e++) {
    var f = c(a[e - 1], a[e]);
    if (0 < f || (0 == f && d)) return !1;
  }
  return !0;
}
m.array.isSorted = va;
m.array.equals = function (a, c) {
  if (!m.isArrayLike(a) || !m.isArrayLike(c) || a.length != c.length) return !1;
  for (var d = a.length, e = wa, f = 0; f < d; f++)
    if (!e(a[f], c[f])) return !1;
  return !0;
};
m.array.compare3 = function (a, c, d) {
  d = d || E;
  for (var e = Math.min(a.length, c.length), f = 0; f < e; f++) {
    var g = d(a[f], c[f]);
    if (0 != g) return g;
  }
  return E(a.length, c.length);
};
function E(a, c) {
  return a > c ? 1 : a < c ? -1 : 0;
}
m.array.defaultCompare = E;
m.array.inverseDefaultCompare = function (a, c) {
  return -E(a, c);
};
function wa(a, c) {
  return a === c;
}
m.array.defaultCompareEquality = wa;
m.array.binaryInsert = function (a, c, d) {
  d = ra(a, c, d);
  return 0 > d ? (na(a, c, -(d + 1)), !0) : !1;
};
m.array.binaryRemove = function (a, c, d) {
  c = ra(a, c, d);
  return 0 <= c ? A(a, c) : !1;
};
m.array.bucket = function (a, c, d) {
  for (var e = {}, f = 0; f < a.length; f++) {
    var g = a[f],
      h = c.call(d, g, f, a);
    void 0 !== h && (e[h] || (e[h] = [])).push(g);
  }
  return e;
};
m.array.toObject = function (a, c, d) {
  var e = {};
  w(a, function (f, g) {
    e[c.call(d, f, g, a)] = f;
  });
  return e;
};
function xa(a, c, d) {
  var e = [],
    f = 0,
    g = a;
  d = d || 1;
  void 0 !== c && ((f = a), (g = c));
  if (0 > d * (g - f)) return [];
  if (0 < d) for (a = f; a < g; a += d) e.push(a);
  else for (a = f; a > g; a += d) e.push(a);
  return e;
}
m.array.range = xa;
function ya(a, c) {
  for (var d = [], e = 0; e < c; e++) d[e] = a;
  return d;
}
m.array.repeat = ya;
function za(a) {
  for (var c = [], d = 0; d < arguments.length; d++) {
    var e = arguments[d];
    if (Array.isArray(e))
      for (var f = 0; f < e.length; f += 8192) {
        var g = D(e, f, f + 8192);
        g = za.apply(null, g);
        for (var h = 0; h < g.length; h++) c.push(g[h]);
      }
    else c.push(e);
  }
  return c;
}
m.array.flatten = za;
m.array.rotate = function (a, c) {
  m.asserts.assert(null != a.length);
  a.length &&
    ((c %= a.length),
    0 < c
      ? Array.prototype.unshift.apply(a, a.splice(-c, c))
      : 0 > c && Array.prototype.push.apply(a, a.splice(0, -c)));
  return a;
};
m.array.moveItem = function (a, c, d) {
  m.asserts.assert(0 <= c && c < a.length);
  m.asserts.assert(0 <= d && d < a.length);
  c = Array.prototype.splice.call(a, c, 1);
  Array.prototype.splice.call(a, d, 0, c[0]);
};
m.array.zip = function (a) {
  if (!arguments.length) return [];
  for (var c = [], d = arguments[0].length, e = 1; e < arguments.length; e++)
    arguments[e].length < d && (d = arguments[e].length);
  for (e = 0; e < d; e++) {
    for (var f = [], g = 0; g < arguments.length; g++) f.push(arguments[g][e]);
    c.push(f);
  }
  return c;
};
m.array.shuffle = function (a, c) {
  c = c || Math.random;
  for (var d = a.length - 1; 0 < d; d--) {
    var e = Math.floor(c() * (d + 1)),
      f = a[d];
    a[d] = a[e];
    a[e] = f;
  }
};
m.array.copyByIndex = function (a, c) {
  var d = [];
  w(c, function (e) {
    d.push(a[e]);
  });
  return d;
};
m.array.concatMap = function (a, c, d) {
  return B.apply([], x(a, c, d));
};
m.debug.errorcontext = {};
m.debug.errorcontext.addErrorContext = function (a, c, d) {
  a[m.debug.errorcontext.CONTEXT_KEY_] ||
    (a[m.debug.errorcontext.CONTEXT_KEY_] = {});
  a[m.debug.errorcontext.CONTEXT_KEY_][c] = d;
};
m.debug.errorcontext.getErrorContext = function (a) {
  return a[m.debug.errorcontext.CONTEXT_KEY_] || {};
};
m.debug.errorcontext.CONTEXT_KEY_ = "__closure__error__context__984382";
m.string = {};
m.string.internal = {};
m.string.internal.startsWith = function (a, c) {
  return 0 == a.lastIndexOf(c, 0);
};
m.string.internal.endsWith = function (a, c) {
  var d = a.length - c.length;
  return 0 <= d && a.indexOf(c, d) == d;
};
m.string.internal.caseInsensitiveStartsWith = function (a, c) {
  return (
    0 == m.string.internal.caseInsensitiveCompare(c, a.substr(0, c.length))
  );
};
m.string.internal.caseInsensitiveEndsWith = function (a, c) {
  return (
    0 ==
    m.string.internal.caseInsensitiveCompare(
      c,
      a.substr(a.length - c.length, c.length)
    )
  );
};
m.string.internal.caseInsensitiveEquals = function (a, c) {
  return a.toLowerCase() == c.toLowerCase();
};
m.string.internal.isEmptyOrWhitespace = function (a) {
  return /^[\s\xa0]*$/.test(a);
};
m.string.internal.trim =
  m.TRUSTED_SITE && String.prototype.trim
    ? function (a) {
        return a.trim();
      }
    : function (a) {
        return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1];
      };
m.string.internal.caseInsensitiveCompare = function (a, c) {
  a = String(a).toLowerCase();
  c = String(c).toLowerCase();
  return a < c ? -1 : a == c ? 0 : 1;
};
m.string.internal.newLineToBr = function (a, c) {
  return a.replace(/(\r\n|\r|\n)/g, c ? "<br />" : "<br>");
};
m.string.internal.htmlEscape = function (a, c) {
  if (c)
    a = a
      .replace(m.string.internal.AMP_RE_, "&amp;")
      .replace(m.string.internal.LT_RE_, "&lt;")
      .replace(m.string.internal.GT_RE_, "&gt;")
      .replace(m.string.internal.QUOT_RE_, "&quot;")
      .replace(m.string.internal.SINGLE_QUOTE_RE_, "&#39;")
      .replace(m.string.internal.NULL_RE_, "&#0;");
  else {
    if (!m.string.internal.ALL_RE_.test(a)) return a;
    -1 != a.indexOf("&") && (a = a.replace(m.string.internal.AMP_RE_, "&amp;"));
    -1 != a.indexOf("<") && (a = a.replace(m.string.internal.LT_RE_, "&lt;"));
    -1 != a.indexOf(">") && (a = a.replace(m.string.internal.GT_RE_, "&gt;"));
    -1 != a.indexOf('"') &&
      (a = a.replace(m.string.internal.QUOT_RE_, "&quot;"));
    -1 != a.indexOf("'") &&
      (a = a.replace(m.string.internal.SINGLE_QUOTE_RE_, "&#39;"));
    -1 != a.indexOf("\x00") &&
      (a = a.replace(m.string.internal.NULL_RE_, "&#0;"));
  }
  return a;
};
m.string.internal.AMP_RE_ = /&/g;
m.string.internal.LT_RE_ = /</g;
m.string.internal.GT_RE_ = />/g;
m.string.internal.QUOT_RE_ = /"/g;
m.string.internal.SINGLE_QUOTE_RE_ = /'/g;
m.string.internal.NULL_RE_ = /\x00/g;
m.string.internal.ALL_RE_ = /[\x00&<>"']/;
m.string.internal.whitespaceEscape = function (a) {
  return m.string.internal.newLineToBr(a.replace(/  /g, " &#160;"), void 0);
};
m.string.internal.contains = function (a, c) {
  return -1 != a.indexOf(c);
};
m.string.internal.caseInsensitiveContains = function (a, c) {
  return m.string.internal.contains(a.toLowerCase(), c.toLowerCase());
};
m.string.internal.compareVersions = function (a, c) {
  var d = 0;
  a = m.string.internal.trim(String(a)).split(".");
  c = m.string.internal.trim(String(c)).split(".");
  for (var e = Math.max(a.length, c.length), f = 0; 0 == d && f < e; f++) {
    var g = a[f] || "",
      h = c[f] || "";
    do {
      g = /(\d*)(\D*)(.*)/.exec(g) || ["", "", "", ""];
      h = /(\d*)(\D*)(.*)/.exec(h) || ["", "", "", ""];
      if (0 == g[0].length && 0 == h[0].length) break;
      d =
        m.string.internal.compareElements_(
          0 == g[1].length ? 0 : parseInt(g[1], 10),
          0 == h[1].length ? 0 : parseInt(h[1], 10)
        ) ||
        m.string.internal.compareElements_(
          0 == g[2].length,
          0 == h[2].length
        ) ||
        m.string.internal.compareElements_(g[2], h[2]);
      g = g[3];
      h = h[3];
    } while (0 == d);
  }
  return d;
};
m.string.internal.compareElements_ = function (a, c) {
  return a < c ? -1 : a > c ? 1 : 0;
};
m.labs = {};
m.labs.userAgent = {};
m.labs.userAgent.util = {};
m.labs.userAgent.util.getNativeUserAgentString_ = function () {
  var a = m.labs.userAgent.util.getNavigator_();
  return a && (a = a.userAgent) ? a : "";
};
m.labs.userAgent.util.getNavigator_ = function () {
  return m.global.navigator;
};
m.labs.userAgent.util.userAgent_ =
  m.labs.userAgent.util.getNativeUserAgentString_();
m.labs.userAgent.util.setUserAgent = function (a) {
  m.labs.userAgent.util.userAgent_ =
    a || m.labs.userAgent.util.getNativeUserAgentString_();
};
m.labs.userAgent.util.getUserAgent = function () {
  return m.labs.userAgent.util.userAgent_;
};
m.labs.userAgent.util.matchUserAgent = function (a) {
  return m.string.internal.contains(m.labs.userAgent.util.getUserAgent(), a);
};
m.labs.userAgent.util.matchUserAgentIgnoreCase = function (a) {
  return m.string.internal.caseInsensitiveContains(
    m.labs.userAgent.util.getUserAgent(),
    a
  );
};
m.labs.userAgent.util.extractVersionTuples = function (a) {
  for (
    var c = /(\w[\w ]+)\/([^\s]+)\s*(?:\((.*?)\))?/g, d = [], e;
    (e = c.exec(a));

  )
    d.push([e[1], e[2], e[3] || void 0]);
  return d;
};
m.object = {};
m.object.forEach = function (a, c, d) {
  for (var e in a) c.call(d, a[e], e, a);
};
m.object.filter = function (a, c, d) {
  var e = {},
    f;
  for (f in a) c.call(d, a[f], f, a) && (e[f] = a[f]);
  return e;
};
m.object.map = function (a, c, d) {
  var e = {},
    f;
  for (f in a) e[f] = c.call(d, a[f], f, a);
  return e;
};
m.object.some = function (a, c, d) {
  for (var e in a) if (c.call(d, a[e], e, a)) return !0;
  return !1;
};
m.object.every = function (a, c, d) {
  for (var e in a) if (!c.call(d, a[e], e, a)) return !1;
  return !0;
};
m.object.getCount = function (a) {
  var c = 0,
    d;
  for (d in a) c++;
  return c;
};
m.object.getAnyKey = function (a) {
  for (var c in a) return c;
};
m.object.getAnyValue = function (a) {
  for (var c in a) return a[c];
};
m.object.contains = function (a, c) {
  return m.object.containsValue(a, c);
};
m.object.getValues = function (a) {
  var c = [],
    d = 0,
    e;
  for (e in a) c[d++] = a[e];
  return c;
};
m.object.getKeys = function (a) {
  var c = [],
    d = 0,
    e;
  for (e in a) c[d++] = e;
  return c;
};
m.object.getValueByKeys = function (a, c) {
  var d = m.isArrayLike(c),
    e = d ? c : arguments;
  for (d = d ? 0 : 1; d < e.length; d++) {
    if (null == a) return;
    a = a[e[d]];
  }
  return a;
};
m.object.containsKey = function (a, c) {
  return null !== a && c in a;
};
m.object.containsValue = function (a, c) {
  for (var d in a) if (a[d] == c) return !0;
  return !1;
};
m.object.findKey = function (a, c, d) {
  for (var e in a) if (c.call(d, a[e], e, a)) return e;
};
m.object.findValue = function (a, c, d) {
  return (c = m.object.findKey(a, c, d)) && a[c];
};
m.object.isEmpty = function (a) {
  for (var c in a) return !1;
  return !0;
};
m.object.clear = function (a) {
  for (var c in a) delete a[c];
};
m.object.remove = function (a, c) {
  var d;
  (d = c in a) && delete a[c];
  return d;
};
m.object.add = function (a, c, d) {
  if (null !== a && c in a)
    throw Error('The object already contains the key "' + c + '"');
  m.object.set(a, c, d);
};
m.object.get = function (a, c, d) {
  return null !== a && c in a ? a[c] : d;
};
m.object.set = function (a, c, d) {
  a[c] = d;
};
m.object.setIfUndefined = function (a, c, d) {
  return c in a ? a[c] : (a[c] = d);
};
m.object.setWithReturnValueIfNotSet = function (a, c, d) {
  if (c in a) return a[c];
  d = d();
  return (a[c] = d);
};
m.object.equals = function (a, c) {
  for (var d in a) if (!(d in c) || a[d] !== c[d]) return !1;
  for (var e in c) if (!(e in a)) return !1;
  return !0;
};
m.object.clone = function (a) {
  var c = {},
    d;
  for (d in a) c[d] = a[d];
  return c;
};
m.object.unsafeClone = function (a) {
  if (!a || "object" !== typeof a) return a;
  if ("function" === typeof a.clone) return a.clone();
  var c = Array.isArray(a)
      ? []
      : "function" !== typeof ArrayBuffer ||
        "function" !== typeof ArrayBuffer.isView ||
        !ArrayBuffer.isView(a) ||
        a instanceof DataView
      ? {}
      : new a.constructor(a.length),
    d;
  for (d in a) c[d] = m.object.unsafeClone(a[d]);
  return c;
};
m.object.transpose = function (a) {
  var c = {},
    d;
  for (d in a) c[a[d]] = d;
  return c;
};
m.object.PROTOTYPE_FIELDS_ =
  "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(
    " "
  );
m.object.extend = function (a, c) {
  for (var d, e, f = 1; f < arguments.length; f++) {
    e = arguments[f];
    for (d in e) a[d] = e[d];
    for (var g = 0; g < m.object.PROTOTYPE_FIELDS_.length; g++)
      (d = m.object.PROTOTYPE_FIELDS_[g]),
        Object.prototype.hasOwnProperty.call(e, d) && (a[d] = e[d]);
  }
};
m.object.create = function (a) {
  var c = arguments.length;
  if (1 == c && Array.isArray(arguments[0]))
    return m.object.create.apply(null, arguments[0]);
  if (c % 2) throw Error("Uneven number of arguments");
  for (var d = {}, e = 0; e < c; e += 2) d[arguments[e]] = arguments[e + 1];
  return d;
};
m.object.createSet = function (a) {
  var c = arguments.length;
  if (1 == c && Array.isArray(arguments[0]))
    return m.object.createSet.apply(null, arguments[0]);
  for (var d = {}, e = 0; e < c; e++) d[arguments[e]] = !0;
  return d;
};
m.object.createImmutableView = function (a) {
  var c = a;
  Object.isFrozen &&
    !Object.isFrozen(a) &&
    ((c = Object.create(a)), Object.freeze(c));
  return c;
};
m.object.isImmutableView = function (a) {
  return !!Object.isFrozen && Object.isFrozen(a);
};
m.object.getAllPropertyNames = function (a, c, d) {
  if (!a) return [];
  if (!Object.getOwnPropertyNames || !Object.getPrototypeOf)
    return m.object.getKeys(a);
  for (
    var e = {};
    a && (a !== Object.prototype || c) && (a !== Function.prototype || d);

  ) {
    for (var f = Object.getOwnPropertyNames(a), g = 0; g < f.length; g++)
      e[f[g]] = !0;
    a = Object.getPrototypeOf(a);
  }
  return m.object.getKeys(e);
};
m.object.getSuperClass = function (a) {
  return (a = Object.getPrototypeOf(a.prototype)) && a.constructor;
};
m.labs.userAgent.browser = {};
m.labs.userAgent.browser.matchOpera_ = function () {
  return m.labs.userAgent.util.matchUserAgent("Opera");
};
m.labs.userAgent.browser.matchIE_ = function () {
  return (
    m.labs.userAgent.util.matchUserAgent("Trident") ||
    m.labs.userAgent.util.matchUserAgent("MSIE")
  );
};
m.labs.userAgent.browser.matchEdgeHtml_ = function () {
  return m.labs.userAgent.util.matchUserAgent("Edge");
};
m.labs.userAgent.browser.matchEdgeChromium_ = function () {
  return m.labs.userAgent.util.matchUserAgent("Edg/");
};
m.labs.userAgent.browser.matchOperaChromium_ = function () {
  return m.labs.userAgent.util.matchUserAgent("OPR");
};
m.labs.userAgent.browser.matchFirefox_ = function () {
  return (
    m.labs.userAgent.util.matchUserAgent("Firefox") ||
    m.labs.userAgent.util.matchUserAgent("FxiOS")
  );
};
m.labs.userAgent.browser.matchSafari_ = function () {
  return (
    m.labs.userAgent.util.matchUserAgent("Safari") &&
    !(
      m.labs.userAgent.browser.matchChrome_() ||
      m.labs.userAgent.browser.matchCoast_() ||
      m.labs.userAgent.browser.matchOpera_() ||
      m.labs.userAgent.browser.matchEdgeHtml_() ||
      m.labs.userAgent.browser.matchEdgeChromium_() ||
      m.labs.userAgent.browser.matchOperaChromium_() ||
      m.labs.userAgent.browser.matchFirefox_() ||
      m.labs.userAgent.browser.isSilk() ||
      m.labs.userAgent.util.matchUserAgent("Android")
    )
  );
};
m.labs.userAgent.browser.matchCoast_ = function () {
  return m.labs.userAgent.util.matchUserAgent("Coast");
};
m.labs.userAgent.browser.matchIosWebview_ = function () {
  return (
    (m.labs.userAgent.util.matchUserAgent("iPad") ||
      m.labs.userAgent.util.matchUserAgent("iPhone")) &&
    !m.labs.userAgent.browser.matchSafari_() &&
    !m.labs.userAgent.browser.matchChrome_() &&
    !m.labs.userAgent.browser.matchCoast_() &&
    !m.labs.userAgent.browser.matchFirefox_() &&
    m.labs.userAgent.util.matchUserAgent("AppleWebKit")
  );
};
m.labs.userAgent.browser.matchChrome_ = function () {
  return (
    (m.labs.userAgent.util.matchUserAgent("Chrome") ||
      m.labs.userAgent.util.matchUserAgent("CriOS")) &&
    !m.labs.userAgent.browser.matchEdgeHtml_()
  );
};
m.labs.userAgent.browser.matchAndroidBrowser_ = function () {
  return (
    m.labs.userAgent.util.matchUserAgent("Android") &&
    !(
      m.labs.userAgent.browser.isChrome() ||
      m.labs.userAgent.browser.isFirefox() ||
      m.labs.userAgent.browser.isOpera() ||
      m.labs.userAgent.browser.isSilk()
    )
  );
};
m.labs.userAgent.browser.isOpera = m.labs.userAgent.browser.matchOpera_;
m.labs.userAgent.browser.isIE = m.labs.userAgent.browser.matchIE_;
m.labs.userAgent.browser.isEdge = m.labs.userAgent.browser.matchEdgeHtml_;
m.labs.userAgent.browser.isEdgeChromium =
  m.labs.userAgent.browser.matchEdgeChromium_;
m.labs.userAgent.browser.isOperaChromium =
  m.labs.userAgent.browser.matchOperaChromium_;
m.labs.userAgent.browser.isFirefox = m.labs.userAgent.browser.matchFirefox_;
m.labs.userAgent.browser.isSafari = m.labs.userAgent.browser.matchSafari_;
m.labs.userAgent.browser.isCoast = m.labs.userAgent.browser.matchCoast_;
m.labs.userAgent.browser.isIosWebview =
  m.labs.userAgent.browser.matchIosWebview_;
m.labs.userAgent.browser.isChrome = m.labs.userAgent.browser.matchChrome_;
m.labs.userAgent.browser.isAndroidBrowser =
  m.labs.userAgent.browser.matchAndroidBrowser_;
m.labs.userAgent.browser.isSilk = function () {
  return m.labs.userAgent.util.matchUserAgent("Silk");
};
m.labs.userAgent.browser.getVersion = function () {
  function a(f) {
    f = ja(f, e);
    return d[f] || "";
  }
  var c = m.labs.userAgent.util.getUserAgent();
  if (m.labs.userAgent.browser.isIE())
    return m.labs.userAgent.browser.getIEVersion_(c);
  c = m.labs.userAgent.util.extractVersionTuples(c);
  var d = {};
  w(c, function (f) {
    d[f[0]] = f[1];
  });
  var e = m.partial(m.object.containsKey, d);
  return m.labs.userAgent.browser.isOpera()
    ? a(["Version", "Opera"])
    : m.labs.userAgent.browser.isEdge()
    ? a(["Edge"])
    : m.labs.userAgent.browser.isEdgeChromium()
    ? a(["Edg"])
    : m.labs.userAgent.browser.isChrome()
    ? a(["Chrome", "CriOS", "HeadlessChrome"])
    : ((c = c[2]) && c[1]) || "";
};
m.labs.userAgent.browser.isVersionOrHigher = function (a) {
  return (
    0 <=
    m.string.internal.compareVersions(m.labs.userAgent.browser.getVersion(), a)
  );
};
m.labs.userAgent.browser.getIEVersion_ = function (a) {
  var c = /rv: *([\d\.]*)/.exec(a);
  if (c && c[1]) return c[1];
  c = "";
  var d = /MSIE +([\d\.]+)/.exec(a);
  if (d && d[1])
    if (((a = /Trident\/(\d.\d)/.exec(a)), "7.0" == d[1]))
      if (a && a[1])
        switch (a[1]) {
          case "4.0":
            c = "8.0";
            break;
          case "5.0":
            c = "9.0";
            break;
          case "6.0":
            c = "10.0";
            break;
          case "7.0":
            c = "11.0";
        }
      else c = "7.0";
    else c = d[1];
  return c;
};
m.dom.asserts = {};
m.dom.asserts.assertIsLocation = function (a) {
  if (m.asserts.ENABLE_ASSERTS) {
    var c = m.dom.asserts.getWindow_(a);
    c &&
      (!a || (!(a instanceof c.Location) && a instanceof c.Element)) &&
      m.asserts.fail(
        "Argument is not a Location (or a non-Element mock); got: %s",
        m.dom.asserts.debugStringForType_(a)
      );
  }
};
m.dom.asserts.assertIsElementType_ = function (a, c) {
  if (m.asserts.ENABLE_ASSERTS) {
    var d = m.dom.asserts.getWindow_(a);
    d &&
      "undefined" != typeof d[c] &&
      ((a &&
        (a instanceof d[c] ||
          !(a instanceof d.Location || a instanceof d.Element))) ||
        m.asserts.fail(
          "Argument is not a %s (or a non-Element, non-Location mock); got: %s",
          c,
          m.dom.asserts.debugStringForType_(a)
        ));
  }
  return a;
};
m.dom.asserts.assertIsHTMLAnchorElement = function (a) {
  m.dom.asserts.assertIsElementType_(a, "HTMLAnchorElement");
};
m.dom.asserts.assertIsHTMLButtonElement = function (a) {
  return m.dom.asserts.assertIsElementType_(a, "HTMLButtonElement");
};
m.dom.asserts.assertIsHTMLLinkElement = function (a) {
  m.dom.asserts.assertIsElementType_(a, "HTMLLinkElement");
};
m.dom.asserts.assertIsHTMLImageElement = function (a) {
  m.dom.asserts.assertIsElementType_(a, "HTMLImageElement");
};
m.dom.asserts.assertIsHTMLAudioElement = function (a) {
  m.dom.asserts.assertIsElementType_(a, "HTMLAudioElement");
};
m.dom.asserts.assertIsHTMLVideoElement = function (a) {
  m.dom.asserts.assertIsElementType_(a, "HTMLVideoElement");
};
m.dom.asserts.assertIsHTMLInputElement = function (a) {
  return m.dom.asserts.assertIsElementType_(a, "HTMLInputElement");
};
m.dom.asserts.assertIsHTMLTextAreaElement = function (a) {
  return m.dom.asserts.assertIsElementType_(a, "HTMLTextAreaElement");
};
m.dom.asserts.assertIsHTMLCanvasElement = function (a) {
  return m.dom.asserts.assertIsElementType_(a, "HTMLCanvasElement");
};
m.dom.asserts.assertIsHTMLEmbedElement = function (a) {
  m.dom.asserts.assertIsElementType_(a, "HTMLEmbedElement");
};
m.dom.asserts.assertIsHTMLFormElement = function (a) {
  return m.dom.asserts.assertIsElementType_(a, "HTMLFormElement");
};
m.dom.asserts.assertIsHTMLFrameElement = function (a) {
  m.dom.asserts.assertIsElementType_(a, "HTMLFrameElement");
};
m.dom.asserts.assertIsHTMLIFrameElement = function (a) {
  m.dom.asserts.assertIsElementType_(a, "HTMLIFrameElement");
};
m.dom.asserts.assertIsHTMLObjectElement = function (a) {
  m.dom.asserts.assertIsElementType_(a, "HTMLObjectElement");
};
m.dom.asserts.assertIsHTMLScriptElement = function (a) {
  m.dom.asserts.assertIsElementType_(a, "HTMLScriptElement");
};
m.dom.asserts.debugStringForType_ = function (a) {
  if (m.isObject(a))
    try {
      return (
        a.constructor.displayName ||
        a.constructor.name ||
        Object.prototype.toString.call(a)
      );
    } catch (c) {
      return "<object could not be stringified>";
    }
  else return void 0 === a ? "undefined" : null === a ? "null" : typeof a;
};
m.dom.asserts.getWindow_ = function (a) {
  try {
    var c = a && a.ownerDocument,
      d = c && (c.defaultView || c.parentWindow);
    d = d || m.global;
    if (d.Element && d.Location) return d;
  } catch (e) {}
  return null;
};
m.functions = {};
m.functions.constant = function (a) {
  return function () {
    return a;
  };
};
m.functions.FALSE = function () {
  return !1;
};
m.functions.TRUE = function () {
  return !0;
};
m.functions.NULL = function () {
  return null;
};
m.functions.UNDEFINED = function () {};
m.functions.EMPTY = m.functions.UNDEFINED;
m.functions.identity = function (a) {
  return a;
};
m.functions.error = function (a) {
  return function () {
    throw Error(a);
  };
};
m.functions.fail = function () {};
m.functions.lock = function (a, c) {
  c = c || 0;
  return function () {
    return a.apply(this, Array.prototype.slice.call(arguments, 0, c));
  };
};
m.functions.nth = function (a) {
  return function () {
    return arguments[a];
  };
};
m.functions.partialRight = function (a, c) {
  var d = Array.prototype.slice.call(arguments, 1);
  return function () {
    var e = this;
    e === m.global && (e = void 0);
    var f = Array.prototype.slice.call(arguments);
    f.push.apply(f, d);
    return a.apply(e, f);
  };
};
m.functions.withReturnValue = function (a, c) {
  return m.functions.sequence(a, m.functions.constant(c));
};
m.functions.equalTo = function (a, c) {
  return function (d) {
    return c ? a == d : a === d;
  };
};
m.functions.compose = function (a, c) {
  var d = arguments,
    e = d.length;
  return function () {
    var f;
    e && (f = d[e - 1].apply(this, arguments));
    for (var g = e - 2; 0 <= g; g--) f = d[g].call(this, f);
    return f;
  };
};
m.functions.sequence = function (a) {
  var c = arguments,
    d = c.length;
  return function () {
    for (var e, f = 0; f < d; f++) e = c[f].apply(this, arguments);
    return e;
  };
};
m.functions.and = function (a) {
  var c = arguments,
    d = c.length;
  return function () {
    for (var e = 0; e < d; e++) if (!c[e].apply(this, arguments)) return !1;
    return !0;
  };
};
m.functions.or = function (a) {
  var c = arguments,
    d = c.length;
  return function () {
    for (var e = 0; e < d; e++) if (c[e].apply(this, arguments)) return !0;
    return !1;
  };
};
m.functions.not = function (a) {
  return function () {
    return !a.apply(this, arguments);
  };
};
m.functions.create = function (a, c) {
  var d = function () {};
  d.prototype = a.prototype;
  d = new d();
  a.apply(d, Array.prototype.slice.call(arguments, 1));
  return d;
};
m.functions.CACHE_RETURN_VALUE = !0;
m.functions.cacheReturnValue = function (a) {
  var c = !1,
    d;
  return function () {
    if (!m.functions.CACHE_RETURN_VALUE) return a();
    c || ((d = a()), (c = !0));
    return d;
  };
};
m.functions.once = function (a) {
  var c = a;
  return function () {
    if (c) {
      var d = c;
      c = null;
      d();
    }
  };
};
m.functions.debounce = function (a, c, d) {
  var e = 0;
  return function (f) {
    m.global.clearTimeout(e);
    var g = arguments;
    e = m.global.setTimeout(function () {
      a.apply(d, g);
    }, c);
  };
};
m.functions.throttle = function (a, c, d) {
  var e = 0,
    f = !1,
    g = [],
    h = function () {
      e = 0;
      f && ((f = !1), l());
    },
    l = function () {
      e = m.global.setTimeout(h, c);
      a.apply(d, g);
    };
  return function (n) {
    g = arguments;
    e ? (f = !0) : l();
  };
};
m.functions.rateLimit = function (a, c, d) {
  var e = 0,
    f = function () {
      e = 0;
    };
  return function (g) {
    e || ((e = m.global.setTimeout(f, c)), a.apply(d, arguments));
  };
};
m.functions.isFunction = function (a) {
  return "function" === typeof a;
};
m.dom.HtmlElement = function () {};
m.dom.TagName = function () {};
m.dom.TagName.cast = function (a) {
  return a;
};
m.dom.TagName.prototype.toString = function () {};
m.dom.TagName.A = "A";
m.dom.TagName.ABBR = "ABBR";
m.dom.TagName.ACRONYM = "ACRONYM";
m.dom.TagName.ADDRESS = "ADDRESS";
m.dom.TagName.APPLET = "APPLET";
m.dom.TagName.AREA = "AREA";
m.dom.TagName.ARTICLE = "ARTICLE";
m.dom.TagName.ASIDE = "ASIDE";
m.dom.TagName.AUDIO = "AUDIO";
m.dom.TagName.B = "B";
m.dom.TagName.BASE = "BASE";
m.dom.TagName.BASEFONT = "BASEFONT";
m.dom.TagName.BDI = "BDI";
m.dom.TagName.BDO = "BDO";
m.dom.TagName.BIG = "BIG";
m.dom.TagName.BLOCKQUOTE = "BLOCKQUOTE";
m.dom.TagName.BODY = "BODY";
m.dom.TagName.BR = "BR";
m.dom.TagName.BUTTON = "BUTTON";
m.dom.TagName.CANVAS = "CANVAS";
m.dom.TagName.CAPTION = "CAPTION";
m.dom.TagName.CENTER = "CENTER";
m.dom.TagName.CITE = "CITE";
m.dom.TagName.CODE = "CODE";
m.dom.TagName.COL = "COL";
m.dom.TagName.COLGROUP = "COLGROUP";
m.dom.TagName.COMMAND = "COMMAND";
m.dom.TagName.DATA = "DATA";
m.dom.TagName.DATALIST = "DATALIST";
m.dom.TagName.DD = "DD";
m.dom.TagName.DEL = "DEL";
m.dom.TagName.DETAILS = "DETAILS";
m.dom.TagName.DFN = "DFN";
m.dom.TagName.DIALOG = "DIALOG";
m.dom.TagName.DIR = "DIR";
m.dom.TagName.DIV = "DIV";
m.dom.TagName.DL = "DL";
m.dom.TagName.DT = "DT";
m.dom.TagName.EM = "EM";
m.dom.TagName.EMBED = "EMBED";
m.dom.TagName.FIELDSET = "FIELDSET";
m.dom.TagName.FIGCAPTION = "FIGCAPTION";
m.dom.TagName.FIGURE = "FIGURE";
m.dom.TagName.FONT = "FONT";
m.dom.TagName.FOOTER = "FOOTER";
m.dom.TagName.FORM = "FORM";
m.dom.TagName.FRAME = "FRAME";
m.dom.TagName.FRAMESET = "FRAMESET";
m.dom.TagName.H1 = "H1";
m.dom.TagName.H2 = "H2";
m.dom.TagName.H3 = "H3";
m.dom.TagName.H4 = "H4";
m.dom.TagName.H5 = "H5";
m.dom.TagName.H6 = "H6";
m.dom.TagName.HEAD = "HEAD";
m.dom.TagName.HEADER = "HEADER";
m.dom.TagName.HGROUP = "HGROUP";
m.dom.TagName.HR = "HR";
m.dom.TagName.HTML = "HTML";
m.dom.TagName.I = "I";
m.dom.TagName.IFRAME = "IFRAME";
m.dom.TagName.IMG = "IMG";
m.dom.TagName.INPUT = "INPUT";
m.dom.TagName.INS = "INS";
m.dom.TagName.ISINDEX = "ISINDEX";
m.dom.TagName.KBD = "KBD";
m.dom.TagName.KEYGEN = "KEYGEN";
m.dom.TagName.LABEL = "LABEL";
m.dom.TagName.LEGEND = "LEGEND";
m.dom.TagName.LI = "LI";
m.dom.TagName.LINK = "LINK";
m.dom.TagName.MAIN = "MAIN";
m.dom.TagName.MAP = "MAP";
m.dom.TagName.MARK = "MARK";
m.dom.TagName.MATH = "MATH";
m.dom.TagName.MENU = "MENU";
m.dom.TagName.MENUITEM = "MENUITEM";
m.dom.TagName.META = "META";
m.dom.TagName.METER = "METER";
m.dom.TagName.NAV = "NAV";
m.dom.TagName.NOFRAMES = "NOFRAMES";
m.dom.TagName.NOSCRIPT = "NOSCRIPT";
m.dom.TagName.OBJECT = "OBJECT";
m.dom.TagName.OL = "OL";
m.dom.TagName.OPTGROUP = "OPTGROUP";
m.dom.TagName.OPTION = "OPTION";
m.dom.TagName.OUTPUT = "OUTPUT";
m.dom.TagName.P = "P";
m.dom.TagName.PARAM = "PARAM";
m.dom.TagName.PICTURE = "PICTURE";
m.dom.TagName.PRE = "PRE";
m.dom.TagName.PROGRESS = "PROGRESS";
m.dom.TagName.Q = "Q";
m.dom.TagName.RP = "RP";
m.dom.TagName.RT = "RT";
m.dom.TagName.RTC = "RTC";
m.dom.TagName.RUBY = "RUBY";
m.dom.TagName.S = "S";
m.dom.TagName.SAMP = "SAMP";
m.dom.TagName.SCRIPT = "SCRIPT";
m.dom.TagName.SECTION = "SECTION";
m.dom.TagName.SELECT = "SELECT";
m.dom.TagName.SMALL = "SMALL";
m.dom.TagName.SOURCE = "SOURCE";
m.dom.TagName.SPAN = "SPAN";
m.dom.TagName.STRIKE = "STRIKE";
m.dom.TagName.STRONG = "STRONG";
m.dom.TagName.STYLE = "STYLE";
m.dom.TagName.SUB = "SUB";
m.dom.TagName.SUMMARY = "SUMMARY";
m.dom.TagName.SUP = "SUP";
m.dom.TagName.SVG = "SVG";
m.dom.TagName.TABLE = "TABLE";
m.dom.TagName.TBODY = "TBODY";
m.dom.TagName.TD = "TD";
m.dom.TagName.TEMPLATE = "TEMPLATE";
m.dom.TagName.TEXTAREA = "TEXTAREA";
m.dom.TagName.TFOOT = "TFOOT";
m.dom.TagName.TH = "TH";
m.dom.TagName.THEAD = "THEAD";
m.dom.TagName.TIME = "TIME";
m.dom.TagName.TITLE = "TITLE";
m.dom.TagName.TR = "TR";
m.dom.TagName.TRACK = "TRACK";
m.dom.TagName.TT = "TT";
m.dom.TagName.U = "U";
m.dom.TagName.UL = "UL";
m.dom.TagName.VAR = "VAR";
m.dom.TagName.VIDEO = "VIDEO";
m.dom.TagName.WBR = "WBR";
m.dom.tags = {};
m.dom.tags.VOID_TAGS_ = {
  area: !0,
  base: !0,
  br: !0,
  col: !0,
  command: !0,
  embed: !0,
  hr: !0,
  img: !0,
  input: !0,
  keygen: !0,
  link: !0,
  meta: !0,
  param: !0,
  source: !0,
  track: !0,
  wbr: !0,
};
m.dom.tags.isVoidTag = function (a) {
  return !0 === m.dom.tags.VOID_TAGS_[a];
};
m.html = {};
m.html.trustedtypes = {};
m.html.trustedtypes.getPolicyPrivateDoNotAccessOrElse = function () {
  if (!m.TRUSTED_TYPES_POLICY_NAME) return null;
  void 0 === m.html.trustedtypes.cachedPolicy_ &&
    (m.html.trustedtypes.cachedPolicy_ = m.createTrustedTypesPolicy());
  return m.html.trustedtypes.cachedPolicy_;
};
m.string.TypedString = function () {};
m.string.Const = function (a, c) {
  this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ =
    (a === m.string.Const.GOOG_STRING_CONSTRUCTOR_TOKEN_PRIVATE_ && c) || "";
  this.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ =
    m.string.Const.TYPE_MARKER_;
};
m.string.Const.prototype.implementsGoogStringTypedString = !0;
m.string.Const.prototype.getTypedStringValue = function () {
  return this.stringConstValueWithSecurityContract__googStringSecurityPrivate_;
};
m.DEBUG &&
  (m.string.Const.prototype.toString = function () {
    return (
      "Const{" +
      this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ +
      "}"
    );
  });
m.string.Const.unwrap = function (a) {
  if (
    a instanceof m.string.Const &&
    a.constructor === m.string.Const &&
    a.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ ===
      m.string.Const.TYPE_MARKER_
  )
    return a.stringConstValueWithSecurityContract__googStringSecurityPrivate_;
  m.asserts.fail("expected object of type Const, got '" + a + "'");
  return "type_error:Const";
};
m.string.Const.from = function (a) {
  return new m.string.Const(
    m.string.Const.GOOG_STRING_CONSTRUCTOR_TOKEN_PRIVATE_,
    a
  );
};
m.string.Const.TYPE_MARKER_ = {};
m.string.Const.GOOG_STRING_CONSTRUCTOR_TOKEN_PRIVATE_ = {};
m.string.Const.EMPTY = m.string.Const.from("");
var Aa = {},
  G = function (a, c) {
    this.privateDoNotAccessOrElseSafeScriptWrappedValue_ = c === Aa ? a : "";
    this.implementsGoogStringTypedString = !0;
  };
G.fromConstant = function (a) {
  a = m.string.Const.unwrap(a);
  return 0 === a.length ? G.EMPTY : Ba(a);
};
G.prototype.getTypedStringValue = function () {
  return this.privateDoNotAccessOrElseSafeScriptWrappedValue_.toString();
};
G.unwrap = function (a) {
  return Ca(a).toString();
};
var Ca = function (a) {
    if (a instanceof G && a.constructor === G)
      return a.privateDoNotAccessOrElseSafeScriptWrappedValue_;
    (0, m.asserts.fail)(
      "expected object of type SafeScript, got '" +
        a +
        "' of type " +
        m.typeOf(a)
    );
    return "type_error:SafeScript";
  },
  Ba = function (a) {
    var c = m.html.trustedtypes.getPolicyPrivateDoNotAccessOrElse();
    a = c ? c.createScript(a) : a;
    return new G(a, Aa);
  };
G.prototype.toString = function () {
  return this.privateDoNotAccessOrElseSafeScriptWrappedValue_.toString();
};
G.EMPTY = Ba("");
m.html.SafeScript = G;
m.fs = {};
m.fs.url = {};
m.fs.url.createObjectUrl = function (a) {
  return m.fs.url.getUrlObject_().createObjectURL(a);
};
m.fs.url.revokeObjectUrl = function (a) {
  m.fs.url.getUrlObject_().revokeObjectURL(a);
};
m.fs.url.UrlObject_ = function () {};
m.fs.url.UrlObject_.prototype.createObjectURL = function () {};
m.fs.url.UrlObject_.prototype.revokeObjectURL = function () {};
m.fs.url.getUrlObject_ = function () {
  var a = m.fs.url.findUrlObject_();
  if (null != a) return a;
  throw Error("This browser doesn't seem to support blob URLs");
};
m.fs.url.findUrlObject_ = function () {
  return void 0 !== m.global.URL && void 0 !== m.global.URL.createObjectURL
    ? m.global.URL
    : void 0 !== m.global.createObjectURL
    ? m.global
    : null;
};
m.fs.url.browserSupportsObjectUrls = function () {
  return null != m.fs.url.findUrlObject_();
};
m.fs.blob = {};
m.fs.blob.getBlob = function (a) {
  var c = m.global.BlobBuilder || m.global.WebKitBlobBuilder;
  if (void 0 !== c) {
    c = new c();
    for (var d = 0; d < arguments.length; d++) c.append(arguments[d]);
    return c.getBlob();
  }
  return m.fs.blob.getBlobWithProperties(C(arguments));
};
m.fs.blob.getBlobWithProperties = function (a, c) {
  var d = m.global.BlobBuilder || m.global.WebKitBlobBuilder;
  if (void 0 !== d) {
    d = new d();
    for (var e = 0; e < a.length; e++) d.append(a[e], void 0);
    return d.getBlob(c);
  }
  if (void 0 !== m.global.Blob)
    return (d = {}), c && (d.type = c), new Blob(a, d);
  throw Error("This browser doesn't seem to support creating Blobs");
};
m.i18n = {};
m.i18n.bidi = {};
m.i18n.bidi.FORCE_RTL = !1;
m.i18n.bidi.IS_RTL =
  m.i18n.bidi.FORCE_RTL ||
  (("ar" == m.LOCALE.substring(0, 2).toLowerCase() ||
    "fa" == m.LOCALE.substring(0, 2).toLowerCase() ||
    "he" == m.LOCALE.substring(0, 2).toLowerCase() ||
    "iw" == m.LOCALE.substring(0, 2).toLowerCase() ||
    "ps" == m.LOCALE.substring(0, 2).toLowerCase() ||
    "sd" == m.LOCALE.substring(0, 2).toLowerCase() ||
    "ug" == m.LOCALE.substring(0, 2).toLowerCase() ||
    "ur" == m.LOCALE.substring(0, 2).toLowerCase() ||
    "yi" == m.LOCALE.substring(0, 2).toLowerCase()) &&
    (2 == m.LOCALE.length ||
      "-" == m.LOCALE.substring(2, 3) ||
      "_" == m.LOCALE.substring(2, 3))) ||
  (3 <= m.LOCALE.length &&
    "ckb" == m.LOCALE.substring(0, 3).toLowerCase() &&
    (3 == m.LOCALE.length ||
      "-" == m.LOCALE.substring(3, 4) ||
      "_" == m.LOCALE.substring(3, 4))) ||
  (7 <= m.LOCALE.length &&
    ("-" == m.LOCALE.substring(2, 3) || "_" == m.LOCALE.substring(2, 3)) &&
    ("adlm" == m.LOCALE.substring(3, 7).toLowerCase() ||
      "arab" == m.LOCALE.substring(3, 7).toLowerCase() ||
      "hebr" == m.LOCALE.substring(3, 7).toLowerCase() ||
      "nkoo" == m.LOCALE.substring(3, 7).toLowerCase() ||
      "rohg" == m.LOCALE.substring(3, 7).toLowerCase() ||
      "thaa" == m.LOCALE.substring(3, 7).toLowerCase())) ||
  (8 <= m.LOCALE.length &&
    ("-" == m.LOCALE.substring(3, 4) || "_" == m.LOCALE.substring(3, 4)) &&
    ("adlm" == m.LOCALE.substring(4, 8).toLowerCase() ||
      "arab" == m.LOCALE.substring(4, 8).toLowerCase() ||
      "hebr" == m.LOCALE.substring(4, 8).toLowerCase() ||
      "nkoo" == m.LOCALE.substring(4, 8).toLowerCase() ||
      "rohg" == m.LOCALE.substring(4, 8).toLowerCase() ||
      "thaa" == m.LOCALE.substring(4, 8).toLowerCase()));
m.i18n.bidi.Format = {
  LRE: "\u202a",
  RLE: "\u202b",
  PDF: "\u202c",
  LRM: "\u200e",
  RLM: "\u200f",
};
m.i18n.bidi.Dir = { LTR: 1, RTL: -1, NEUTRAL: 0 };
m.i18n.bidi.RIGHT = "right";
m.i18n.bidi.LEFT = "left";
m.i18n.bidi.I18N_RIGHT = m.i18n.bidi.IS_RTL
  ? m.i18n.bidi.LEFT
  : m.i18n.bidi.RIGHT;
m.i18n.bidi.I18N_LEFT = m.i18n.bidi.IS_RTL
  ? m.i18n.bidi.RIGHT
  : m.i18n.bidi.LEFT;
m.i18n.bidi.toDir = function (a) {
  return "number" == typeof a
    ? 0 < a
      ? m.i18n.bidi.Dir.LTR
      : 0 > a
      ? m.i18n.bidi.Dir.RTL
      : m.i18n.bidi.Dir.NEUTRAL
    : null == a
    ? null
    : a
    ? m.i18n.bidi.Dir.RTL
    : m.i18n.bidi.Dir.LTR;
};
m.i18n.bidi.ltrChars_ =
  "A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0900-\u1fff\u200e\u2c00-\ud801\ud804-\ud839\ud83c-\udbff\uf900-\ufb1c\ufe00-\ufe6f\ufefd-\uffff";
m.i18n.bidi.rtlChars_ =
  "\u0591-\u06ef\u06fa-\u08ff\u200f\ud802-\ud803\ud83a-\ud83b\ufb1d-\ufdff\ufe70-\ufefc";
m.i18n.bidi.htmlSkipReg_ = /<[^>]*>|&[^;]+;/g;
m.i18n.bidi.stripHtmlIfNeeded_ = function (a, c) {
  return c ? a.replace(m.i18n.bidi.htmlSkipReg_, "") : a;
};
m.i18n.bidi.rtlCharReg_ = new RegExp("[" + m.i18n.bidi.rtlChars_ + "]");
m.i18n.bidi.ltrCharReg_ = new RegExp("[" + m.i18n.bidi.ltrChars_ + "]");
m.i18n.bidi.hasAnyRtl = function (a, c) {
  return m.i18n.bidi.rtlCharReg_.test(m.i18n.bidi.stripHtmlIfNeeded_(a, c));
};
m.i18n.bidi.hasRtlChar = m.i18n.bidi.hasAnyRtl;
m.i18n.bidi.hasAnyLtr = function (a) {
  return m.i18n.bidi.ltrCharReg_.test(
    m.i18n.bidi.stripHtmlIfNeeded_(a, void 0)
  );
};
m.i18n.bidi.ltrRe_ = new RegExp("^[" + m.i18n.bidi.ltrChars_ + "]");
m.i18n.bidi.rtlRe_ = new RegExp("^[" + m.i18n.bidi.rtlChars_ + "]");
m.i18n.bidi.isRtlChar = function (a) {
  return m.i18n.bidi.rtlRe_.test(a);
};
m.i18n.bidi.isLtrChar = function (a) {
  return m.i18n.bidi.ltrRe_.test(a);
};
m.i18n.bidi.isNeutralChar = function (a) {
  return !m.i18n.bidi.isLtrChar(a) && !m.i18n.bidi.isRtlChar(a);
};
m.i18n.bidi.ltrDirCheckRe_ = new RegExp(
  "^[^" + m.i18n.bidi.rtlChars_ + "]*[" + m.i18n.bidi.ltrChars_ + "]"
);
m.i18n.bidi.rtlDirCheckRe_ = new RegExp(
  "^[^" + m.i18n.bidi.ltrChars_ + "]*[" + m.i18n.bidi.rtlChars_ + "]"
);
m.i18n.bidi.startsWithRtl = function (a, c) {
  return m.i18n.bidi.rtlDirCheckRe_.test(m.i18n.bidi.stripHtmlIfNeeded_(a, c));
};
m.i18n.bidi.isRtlText = m.i18n.bidi.startsWithRtl;
m.i18n.bidi.startsWithLtr = function (a, c) {
  return m.i18n.bidi.ltrDirCheckRe_.test(m.i18n.bidi.stripHtmlIfNeeded_(a, c));
};
m.i18n.bidi.isLtrText = m.i18n.bidi.startsWithLtr;
m.i18n.bidi.isRequiredLtrRe_ = /^http:\/\/.*/;
m.i18n.bidi.isNeutralText = function (a, c) {
  a = m.i18n.bidi.stripHtmlIfNeeded_(a, c);
  return (
    m.i18n.bidi.isRequiredLtrRe_.test(a) ||
    (!m.i18n.bidi.hasAnyLtr(a) && !m.i18n.bidi.hasAnyRtl(a))
  );
};
m.i18n.bidi.ltrExitDirCheckRe_ = new RegExp(
  "[" + m.i18n.bidi.ltrChars_ + "][^" + m.i18n.bidi.rtlChars_ + "]*$"
);
m.i18n.bidi.rtlExitDirCheckRe_ = new RegExp(
  "[" + m.i18n.bidi.rtlChars_ + "][^" + m.i18n.bidi.ltrChars_ + "]*$"
);
m.i18n.bidi.endsWithLtr = function (a, c) {
  return m.i18n.bidi.ltrExitDirCheckRe_.test(
    m.i18n.bidi.stripHtmlIfNeeded_(a, c)
  );
};
m.i18n.bidi.isLtrExitText = m.i18n.bidi.endsWithLtr;
m.i18n.bidi.endsWithRtl = function (a, c) {
  return m.i18n.bidi.rtlExitDirCheckRe_.test(
    m.i18n.bidi.stripHtmlIfNeeded_(a, c)
  );
};
m.i18n.bidi.isRtlExitText = m.i18n.bidi.endsWithRtl;
m.i18n.bidi.rtlLocalesRe_ =
  /^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;
m.i18n.bidi.isRtlLanguage = function (a) {
  return m.i18n.bidi.rtlLocalesRe_.test(a);
};
m.i18n.bidi.bracketGuardTextRe_ = /(\(.*?\)+)|(\[.*?\]+)|(\{.*?\}+)|(<.*?>+)/g;
m.i18n.bidi.guardBracketInText = function (a, c) {
  c = (void 0 === c ? m.i18n.bidi.hasAnyRtl(a) : c)
    ? m.i18n.bidi.Format.RLM
    : m.i18n.bidi.Format.LRM;
  return a.replace(m.i18n.bidi.bracketGuardTextRe_, c + "$&" + c);
};
m.i18n.bidi.enforceRtlInHtml = function (a) {
  return "<" == a.charAt(0)
    ? a.replace(/<\w+/, "$& dir=rtl")
    : "\n<span dir=rtl>" + a + "</span>";
};
m.i18n.bidi.enforceRtlInText = function (a) {
  return m.i18n.bidi.Format.RLE + a + m.i18n.bidi.Format.PDF;
};
m.i18n.bidi.enforceLtrInHtml = function (a) {
  return "<" == a.charAt(0)
    ? a.replace(/<\w+/, "$& dir=ltr")
    : "\n<span dir=ltr>" + a + "</span>";
};
m.i18n.bidi.enforceLtrInText = function (a) {
  return m.i18n.bidi.Format.LRE + a + m.i18n.bidi.Format.PDF;
};
m.i18n.bidi.dimensionsRe_ =
  /:\s*([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)/g;
m.i18n.bidi.leftRe_ = /left/gi;
m.i18n.bidi.rightRe_ = /right/gi;
m.i18n.bidi.tempRe_ = /%%%%/g;
m.i18n.bidi.mirrorCSS = function (a) {
  return a
    .replace(m.i18n.bidi.dimensionsRe_, ":$1 $4 $3 $2")
    .replace(m.i18n.bidi.leftRe_, "%%%%")
    .replace(m.i18n.bidi.rightRe_, m.i18n.bidi.LEFT)
    .replace(m.i18n.bidi.tempRe_, m.i18n.bidi.RIGHT);
};
m.i18n.bidi.doubleQuoteSubstituteRe_ = /([\u0591-\u05f2])"/g;
m.i18n.bidi.singleQuoteSubstituteRe_ = /([\u0591-\u05f2])'/g;
m.i18n.bidi.normalizeHebrewQuote = function (a) {
  return a
    .replace(m.i18n.bidi.doubleQuoteSubstituteRe_, "$1\u05f4")
    .replace(m.i18n.bidi.singleQuoteSubstituteRe_, "$1\u05f3");
};
m.i18n.bidi.wordSeparatorRe_ = /\s+/;
m.i18n.bidi.hasNumeralsRe_ = /[\d\u06f0-\u06f9]/;
m.i18n.bidi.rtlDetectionThreshold_ = 0.4;
m.i18n.bidi.estimateDirection = function (a, c) {
  var d = 0,
    e = 0,
    f = !1;
  a = m.i18n.bidi.stripHtmlIfNeeded_(a, c).split(m.i18n.bidi.wordSeparatorRe_);
  for (c = 0; c < a.length; c++) {
    var g = a[c];
    m.i18n.bidi.startsWithRtl(g)
      ? (d++, e++)
      : m.i18n.bidi.isRequiredLtrRe_.test(g)
      ? (f = !0)
      : m.i18n.bidi.hasAnyLtr(g)
      ? e++
      : m.i18n.bidi.hasNumeralsRe_.test(g) && (f = !0);
  }
  return 0 == e
    ? f
      ? m.i18n.bidi.Dir.LTR
      : m.i18n.bidi.Dir.NEUTRAL
    : d / e > m.i18n.bidi.rtlDetectionThreshold_
    ? m.i18n.bidi.Dir.RTL
    : m.i18n.bidi.Dir.LTR;
};
m.i18n.bidi.detectRtlDirectionality = function (a, c) {
  return m.i18n.bidi.estimateDirection(a, c) == m.i18n.bidi.Dir.RTL;
};
m.i18n.bidi.setElementDirAndAlign = function (a, c) {
  a &&
    (c = m.i18n.bidi.toDir(c)) &&
    ((a.style.textAlign =
      c == m.i18n.bidi.Dir.RTL ? m.i18n.bidi.RIGHT : m.i18n.bidi.LEFT),
    (a.dir = c == m.i18n.bidi.Dir.RTL ? "rtl" : "ltr"));
};
m.i18n.bidi.setElementDirByTextDirectionality = function (a, c) {
  switch (m.i18n.bidi.estimateDirection(c)) {
    case m.i18n.bidi.Dir.LTR:
      "ltr" !== a.dir && (a.dir = "ltr");
      break;
    case m.i18n.bidi.Dir.RTL:
      "rtl" !== a.dir && (a.dir = "rtl");
      break;
    default:
      a.removeAttribute("dir");
  }
};
m.i18n.bidi.DirectionalString = function () {};
m.html.TrustedResourceUrl = function (a, c) {
  this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ =
    c === m.html.TrustedResourceUrl.CONSTRUCTOR_TOKEN_PRIVATE_ ? a : "";
};
b = m.html.TrustedResourceUrl.prototype;
b.implementsGoogStringTypedString = !0;
b.getTypedStringValue = function () {
  return this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_.toString();
};
b.implementsGoogI18nBidiDirectionalString = !0;
b.getDirection = function () {
  return m.i18n.bidi.Dir.LTR;
};
b.toString = function () {
  return this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ + "";
};
m.html.TrustedResourceUrl.unwrap = function (a) {
  return m.html.TrustedResourceUrl.unwrapTrustedScriptURL(a).toString();
};
m.html.TrustedResourceUrl.unwrapTrustedScriptURL = function (a) {
  if (
    a instanceof m.html.TrustedResourceUrl &&
    a.constructor === m.html.TrustedResourceUrl
  )
    return a.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_;
  m.asserts.fail(
    "expected object of type TrustedResourceUrl, got '" +
      a +
      "' of type " +
      m.typeOf(a)
  );
  return "type_error:TrustedResourceUrl";
};
m.html.TrustedResourceUrl.format = function (a, c) {
  var d = m.string.Const.unwrap(a);
  if (!m.html.TrustedResourceUrl.BASE_URL_.test(d))
    throw Error("Invalid TrustedResourceUrl format: " + d);
  a = d.replace(m.html.TrustedResourceUrl.FORMAT_MARKER_, function (e, f) {
    if (!Object.prototype.hasOwnProperty.call(c, f))
      throw Error(
        'Found marker, "' +
          f +
          '", in format string, "' +
          d +
          '", but no valid label mapping found in args: ' +
          JSON.stringify(c)
      );
    e = c[f];
    return e instanceof m.string.Const
      ? m.string.Const.unwrap(e)
      : encodeURIComponent(String(e));
  });
  return m.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(
    a
  );
};
m.html.TrustedResourceUrl.FORMAT_MARKER_ = /%{(\w+)}/g;
m.html.TrustedResourceUrl.BASE_URL_ =
  /^((https:)?\/\/[0-9a-z.:[\]-]+\/|\/[^/\\]|[^:/\\%]+\/|[^:/\\%]*[?#]|about:blank#)/i;
m.html.TrustedResourceUrl.URL_PARAM_PARSER_ = /^([^?#]*)(\?[^#]*)?(#[\s\S]*)?/;
m.html.TrustedResourceUrl.formatWithParams = function (a, c, d, e) {
  a = m.html.TrustedResourceUrl.format(a, c);
  a = m.html.TrustedResourceUrl.unwrap(a);
  a = m.html.TrustedResourceUrl.URL_PARAM_PARSER_.exec(a);
  c = a[3] || "";
  return m.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(
    a[1] +
      m.html.TrustedResourceUrl.stringifyParams_("?", a[2] || "", d) +
      m.html.TrustedResourceUrl.stringifyParams_("#", c, e)
  );
};
m.html.TrustedResourceUrl.fromConstant = function (a) {
  return m.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(
    m.string.Const.unwrap(a)
  );
};
m.html.TrustedResourceUrl.fromConstants = function (a) {
  for (var c = "", d = 0; d < a.length; d++) c += m.string.Const.unwrap(a[d]);
  return m.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(
    c
  );
};
m.html.TrustedResourceUrl.fromSafeScript = function (a) {
  a = m.fs.blob.getBlobWithProperties([G.unwrap(a)], "text/javascript");
  a = m.fs.url.createObjectUrl(a);
  return m.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(
    a
  );
};
m.html.TrustedResourceUrl.CONSTRUCTOR_TOKEN_PRIVATE_ = {};
m.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse =
  function (a) {
    var c = m.html.trustedtypes.getPolicyPrivateDoNotAccessOrElse();
    a = c ? c.createScriptURL(a) : a;
    return new m.html.TrustedResourceUrl(
      a,
      m.html.TrustedResourceUrl.CONSTRUCTOR_TOKEN_PRIVATE_
    );
  };
m.html.TrustedResourceUrl.stringifyParams_ = function (a, c, d) {
  if (null == d) return c;
  if ("string" === typeof d) return d ? a + encodeURIComponent(d) : "";
  for (var e in d)
    if (Object.prototype.hasOwnProperty.call(d, e)) {
      var f = d[e];
      f = Array.isArray(f) ? f : [f];
      for (var g = 0; g < f.length; g++) {
        var h = f[g];
        null != h &&
          (c || (c = a),
          (c +=
            (c.length > a.length ? "&" : "") +
            encodeURIComponent(e) +
            "=" +
            encodeURIComponent(String(h))));
      }
    }
  return c;
};
m.html.SafeUrl = function (a, c) {
  this.privateDoNotAccessOrElseSafeUrlWrappedValue_ =
    c === m.html.SafeUrl.CONSTRUCTOR_TOKEN_PRIVATE_ ? a : "";
};
m.html.SafeUrl.INNOCUOUS_STRING = "about:invalid#zClosurez";
b = m.html.SafeUrl.prototype;
b.implementsGoogStringTypedString = !0;
b.getTypedStringValue = function () {
  return this.privateDoNotAccessOrElseSafeUrlWrappedValue_.toString();
};
b.implementsGoogI18nBidiDirectionalString = !0;
b.getDirection = function () {
  return m.i18n.bidi.Dir.LTR;
};
b.toString = function () {
  return this.privateDoNotAccessOrElseSafeUrlWrappedValue_.toString();
};
m.html.SafeUrl.unwrap = function (a) {
  if (a instanceof m.html.SafeUrl && a.constructor === m.html.SafeUrl)
    return a.privateDoNotAccessOrElseSafeUrlWrappedValue_;
  m.asserts.fail(
    "expected object of type SafeUrl, got '" + a + "' of type " + m.typeOf(a)
  );
  return "type_error:SafeUrl";
};
m.html.SafeUrl.fromConstant = function (a) {
  return m.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(
    m.string.Const.unwrap(a)
  );
};
m.html.SAFE_MIME_TYPE_PATTERN_ =
  /^(?:audio\/(?:3gpp2|3gpp|aac|L16|midi|mp3|mp4|mpeg|oga|ogg|opus|x-m4a|x-matroska|x-wav|wav|webm)|font\/\w+|image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp|x-icon)|video\/(?:mpeg|mp4|ogg|webm|quicktime|x-matroska))(?:;\w+=(?:\w+|"[\w;,= ]+"))*$/i;
m.html.SafeUrl.isSafeMimeType = function (a) {
  return m.html.SAFE_MIME_TYPE_PATTERN_.test(a);
};
m.html.SafeUrl.fromBlob = function (a) {
  a = m.html.SafeUrl.isSafeMimeType(a.type)
    ? m.fs.url.createObjectUrl(a)
    : m.html.SafeUrl.INNOCUOUS_STRING;
  return m.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a);
};
m.html.SafeUrl.revokeObjectUrl = function (a) {
  a = a.getTypedStringValue();
  a !== m.html.SafeUrl.INNOCUOUS_STRING && m.fs.url.revokeObjectUrl(a);
};
m.html.SafeUrl.fromMediaSource = function (a) {
  m.asserts.assert("MediaSource" in m.global, "No support for MediaSource");
  a =
    a instanceof MediaSource
      ? m.fs.url.createObjectUrl(a)
      : m.html.SafeUrl.INNOCUOUS_STRING;
  return m.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a);
};
m.html.DATA_URL_PATTERN_ = /^data:(.*);base64,[a-z0-9+\/]+=*$/i;
m.html.SafeUrl.tryFromDataUrl = function (a) {
  a = String(a);
  a = a.replace(/(%0A|%0D)/g, "");
  var c = a.match(m.html.DATA_URL_PATTERN_);
  return c && m.html.SafeUrl.isSafeMimeType(c[1])
    ? m.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)
    : null;
};
m.html.SafeUrl.fromDataUrl = function (a) {
  return m.html.SafeUrl.tryFromDataUrl(a) || m.html.SafeUrl.INNOCUOUS_URL;
};
m.html.SafeUrl.fromTelUrl = function (a) {
  m.string.internal.caseInsensitiveStartsWith(a, "tel:") ||
    (a = m.html.SafeUrl.INNOCUOUS_STRING);
  return m.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a);
};
m.html.SIP_URL_PATTERN_ =
  /^sip[s]?:[+a-z0-9_.!$%&'*\/=^`{|}~-]+@([a-z0-9-]+\.)+[a-z0-9]{2,63}$/i;
m.html.SafeUrl.fromSipUrl = function (a) {
  m.html.SIP_URL_PATTERN_.test(decodeURIComponent(a)) ||
    (a = m.html.SafeUrl.INNOCUOUS_STRING);
  return m.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a);
};
m.html.SafeUrl.fromFacebookMessengerUrl = function (a) {
  m.string.internal.caseInsensitiveStartsWith(a, "fb-messenger://share") ||
    (a = m.html.SafeUrl.INNOCUOUS_STRING);
  return m.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a);
};
m.html.SafeUrl.fromWhatsAppUrl = function (a) {
  m.string.internal.caseInsensitiveStartsWith(a, "whatsapp://send") ||
    (a = m.html.SafeUrl.INNOCUOUS_STRING);
  return m.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a);
};
m.html.SafeUrl.fromSmsUrl = function (a) {
  (m.string.internal.caseInsensitiveStartsWith(a, "sms:") &&
    m.html.SafeUrl.isSmsUrlBodyValid_(a)) ||
    (a = m.html.SafeUrl.INNOCUOUS_STRING);
  return m.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a);
};
m.html.SafeUrl.isSmsUrlBodyValid_ = function (a) {
  var c = a.indexOf("#");
  0 < c && (a = a.substring(0, c));
  c = a.match(/[?&]body=/gi);
  if (!c) return !0;
  if (1 < c.length) return !1;
  a = a.match(/[?&]body=([^&]*)/)[1];
  if (!a) return !0;
  try {
    decodeURIComponent(a);
  } catch (d) {
    return !1;
  }
  return /^(?:[a-z0-9\-_.~]|%[0-9a-f]{2})+$/i.test(a);
};
m.html.SafeUrl.fromSshUrl = function (a) {
  m.string.internal.caseInsensitiveStartsWith(a, "ssh://") ||
    (a = m.html.SafeUrl.INNOCUOUS_STRING);
  return m.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a);
};
m.html.SafeUrl.sanitizeChromeExtensionUrl = function (a, c) {
  return m.html.SafeUrl.sanitizeExtensionUrl_(
    /^chrome-extension:\/\/([^\/]+)\//,
    a,
    c
  );
};
m.html.SafeUrl.sanitizeFirefoxExtensionUrl = function (a, c) {
  return m.html.SafeUrl.sanitizeExtensionUrl_(
    /^moz-extension:\/\/([^\/]+)\//,
    a,
    c
  );
};
m.html.SafeUrl.sanitizeEdgeExtensionUrl = function (a, c) {
  return m.html.SafeUrl.sanitizeExtensionUrl_(
    /^ms-browser-extension:\/\/([^\/]+)\//,
    a,
    c
  );
};
m.html.SafeUrl.sanitizeExtensionUrl_ = function (a, c, d) {
  (a = a.exec(c))
    ? ((a = a[1]),
      -1 ==
        (d instanceof m.string.Const
          ? [m.string.Const.unwrap(d)]
          : d.map(function (e) {
              return m.string.Const.unwrap(e);
            })
        ).indexOf(a) && (c = m.html.SafeUrl.INNOCUOUS_STRING))
    : (c = m.html.SafeUrl.INNOCUOUS_STRING);
  return m.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(c);
};
m.html.SafeUrl.fromTrustedResourceUrl = function (a) {
  return m.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(
    m.html.TrustedResourceUrl.unwrap(a)
  );
};
m.html.SAFE_URL_PATTERN_ = /^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i;
m.html.SafeUrl.SAFE_URL_PATTERN = m.html.SAFE_URL_PATTERN_;
m.html.SafeUrl.trySanitize = function (a) {
  if (a instanceof m.html.SafeUrl) return a;
  a =
    "object" == typeof a && a.implementsGoogStringTypedString
      ? a.getTypedStringValue()
      : String(a);
  return m.html.SAFE_URL_PATTERN_.test(a)
    ? m.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)
    : m.html.SafeUrl.tryFromDataUrl(a);
};
m.html.SafeUrl.sanitize = function (a) {
  return m.html.SafeUrl.trySanitize(a) || m.html.SafeUrl.INNOCUOUS_URL;
};
m.html.SafeUrl.sanitizeAssertUnchanged = function (a, c) {
  if (a instanceof m.html.SafeUrl) return a;
  a =
    "object" == typeof a && a.implementsGoogStringTypedString
      ? a.getTypedStringValue()
      : String(a);
  if (
    c &&
    /^data:/i.test(a) &&
    ((c = m.html.SafeUrl.fromDataUrl(a)), c.getTypedStringValue() == a)
  )
    return c;
  m.asserts.assert(
    m.html.SAFE_URL_PATTERN_.test(a),
    "%s does not match the safe URL pattern",
    a
  ) || (a = m.html.SafeUrl.INNOCUOUS_STRING);
  return m.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a);
};
m.html.SafeUrl.CONSTRUCTOR_TOKEN_PRIVATE_ = {};
m.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse = function (a) {
  return new m.html.SafeUrl(a, m.html.SafeUrl.CONSTRUCTOR_TOKEN_PRIVATE_);
};
m.html.SafeUrl.INNOCUOUS_URL =
  m.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(
    m.html.SafeUrl.INNOCUOUS_STRING
  );
m.html.SafeUrl.ABOUT_BLANK =
  m.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse("about:blank");
m.html.SafeStyle = function (a, c) {
  this.privateDoNotAccessOrElseSafeStyleWrappedValue_ =
    c === m.html.SafeStyle.CONSTRUCTOR_TOKEN_PRIVATE_ ? a : "";
};
m.html.SafeStyle.prototype.implementsGoogStringTypedString = !0;
m.html.SafeStyle.fromConstant = function (a) {
  a = m.string.Const.unwrap(a);
  if (0 === a.length) return m.html.SafeStyle.EMPTY;
  m.asserts.assert(
    m.string.internal.endsWith(a, ";"),
    "Last character of style string is not ';': " + a
  );
  m.asserts.assert(
    m.string.internal.contains(a, ":"),
    "Style string must contain at least one ':', to specify a \"name: value\" pair: " +
      a
  );
  return m.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(a);
};
m.html.SafeStyle.prototype.getTypedStringValue = function () {
  return this.privateDoNotAccessOrElseSafeStyleWrappedValue_;
};
m.html.SafeStyle.prototype.toString = function () {
  return this.privateDoNotAccessOrElseSafeStyleWrappedValue_.toString();
};
m.html.SafeStyle.unwrap = function (a) {
  if (a instanceof m.html.SafeStyle && a.constructor === m.html.SafeStyle)
    return a.privateDoNotAccessOrElseSafeStyleWrappedValue_;
  m.asserts.fail(
    "expected object of type SafeStyle, got '" + a + "' of type " + m.typeOf(a)
  );
  return "type_error:SafeStyle";
};
m.html.SafeStyle.CONSTRUCTOR_TOKEN_PRIVATE_ = {};
m.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse = function (
  a
) {
  return new m.html.SafeStyle(a, m.html.SafeStyle.CONSTRUCTOR_TOKEN_PRIVATE_);
};
m.html.SafeStyle.EMPTY =
  m.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse("");
m.html.SafeStyle.INNOCUOUS_STRING = "zClosurez";
m.html.SafeStyle.create = function (a) {
  var c = "",
    d;
  for (d in a)
    if (Object.prototype.hasOwnProperty.call(a, d)) {
      if (!/^[-_a-zA-Z0-9]+$/.test(d))
        throw Error("Name allows only [-_a-zA-Z0-9], got: " + d);
      var e = a[d];
      null != e &&
        ((e = Array.isArray(e)
          ? x(e, m.html.SafeStyle.sanitizePropertyValue_).join(" ")
          : m.html.SafeStyle.sanitizePropertyValue_(e)),
        (c += d + ":" + e + ";"));
    }
  return c
    ? m.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(c)
    : m.html.SafeStyle.EMPTY;
};
m.html.SafeStyle.sanitizePropertyValue_ = function (a) {
  if (a instanceof m.html.SafeUrl)
    return (
      'url("' +
      m.html.SafeUrl.unwrap(a).replace(/</g, "%3c").replace(/[\\"]/g, "\\$&") +
      '")'
    );
  a =
    a instanceof m.string.Const
      ? m.string.Const.unwrap(a)
      : m.html.SafeStyle.sanitizePropertyValueString_(String(a));
  if (/[{;}]/.test(a))
    throw new m.asserts.AssertionError("Value does not allow [{;}], got: %s.", [
      a,
    ]);
  return a;
};
m.html.SafeStyle.sanitizePropertyValueString_ = function (a) {
  var c = a
    .replace(m.html.SafeStyle.FUNCTIONS_RE_, "$1")
    .replace(m.html.SafeStyle.FUNCTIONS_RE_, "$1")
    .replace(m.html.SafeStyle.URL_RE_, "url");
  if (m.html.SafeStyle.VALUE_RE_.test(c)) {
    if (m.html.SafeStyle.COMMENT_RE_.test(a))
      return (
        m.asserts.fail("String value disallows comments, got: " + a),
        m.html.SafeStyle.INNOCUOUS_STRING
      );
    if (!m.html.SafeStyle.hasBalancedQuotes_(a))
      return (
        m.asserts.fail("String value requires balanced quotes, got: " + a),
        m.html.SafeStyle.INNOCUOUS_STRING
      );
    if (!m.html.SafeStyle.hasBalancedSquareBrackets_(a))
      return (
        m.asserts.fail(
          "String value requires balanced square brackets and one identifier per pair of brackets, got: " +
            a
        ),
        m.html.SafeStyle.INNOCUOUS_STRING
      );
  } else
    return (
      m.asserts.fail(
        "String value allows only " +
          m.html.SafeStyle.VALUE_ALLOWED_CHARS_ +
          " and simple functions, got: " +
          a
      ),
      m.html.SafeStyle.INNOCUOUS_STRING
    );
  return m.html.SafeStyle.sanitizeUrl_(a);
};
m.html.SafeStyle.hasBalancedQuotes_ = function (a) {
  for (var c = !0, d = !0, e = 0; e < a.length; e++) {
    var f = a.charAt(e);
    "'" == f && d ? (c = !c) : '"' == f && c && (d = !d);
  }
  return c && d;
};
m.html.SafeStyle.hasBalancedSquareBrackets_ = function (a) {
  for (var c = !0, d = /^[-_a-zA-Z0-9]$/, e = 0; e < a.length; e++) {
    var f = a.charAt(e);
    if ("]" == f) {
      if (c) return !1;
      c = !0;
    } else if ("[" == f) {
      if (!c) return !1;
      c = !1;
    } else if (!c && !d.test(f)) return !1;
  }
  return c;
};
m.html.SafeStyle.VALUE_ALLOWED_CHARS_ = "[-,.\"'%_!# a-zA-Z0-9\\[\\]]";
m.html.SafeStyle.VALUE_RE_ = new RegExp(
  "^" + m.html.SafeStyle.VALUE_ALLOWED_CHARS_ + "+$"
);
m.html.SafeStyle.URL_RE_ =
  /\b(url\([ \t\n]*)('[ -&(-\[\]-~]*'|"[ !#-\[\]-~]*"|[!#-&*-\[\]-~]*)([ \t\n]*\))/g;
m.html.SafeStyle.ALLOWED_FUNCTIONS_ =
  "calc cubic-bezier fit-content hsl hsla linear-gradient matrix minmax repeat rgb rgba (rotate|scale|translate)(X|Y|Z|3d)?".split(
    " "
  );
m.html.SafeStyle.FUNCTIONS_RE_ = new RegExp(
  "\\b(" +
    m.html.SafeStyle.ALLOWED_FUNCTIONS_.join("|") +
    ")\\([-+*/0-9a-z.%\\[\\], ]+\\)",
  "g"
);
m.html.SafeStyle.COMMENT_RE_ = /\/\*/;
m.html.SafeStyle.sanitizeUrl_ = function (a) {
  return a.replace(m.html.SafeStyle.URL_RE_, function (c, d, e, f) {
    var g = "";
    e = e.replace(/^(['"])(.*)\1$/, function (h, l, n) {
      g = l;
      return n;
    });
    c = m.html.SafeUrl.sanitize(e).getTypedStringValue();
    return d + g + c + g + f;
  });
};
m.html.SafeStyle.concat = function (a) {
  var c = "",
    d = function (e) {
      Array.isArray(e) ? w(e, d) : (c += m.html.SafeStyle.unwrap(e));
    };
  w(arguments, d);
  return c
    ? m.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(c)
    : m.html.SafeStyle.EMPTY;
};
var H = {},
  I = function (a, c) {
    this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ = c === H ? a : "";
    this.implementsGoogStringTypedString = !0;
  };
I.concat = function (a) {
  var c = "",
    d = function (e) {
      Array.isArray(e) ? w(e, d) : (c += I.unwrap(e));
    };
  w(arguments, d);
  return new I(c, H);
};
I.fromConstant = function (a) {
  a = m.string.Const.unwrap(a);
  if (0 === a.length) return I.EMPTY;
  (0, m.asserts.assert)(
    !(0, m.string.internal.contains)(a, "<"),
    "Forbidden '<' character in style sheet string: " + a
  );
  return new I(a, H);
};
I.prototype.getTypedStringValue = function () {
  return this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_;
};
I.unwrap = function (a) {
  if (a instanceof I && a.constructor === I)
    return a.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_;
  (0, m.asserts.fail)(
    "expected object of type SafeStyleSheet, got '" +
      a +
      "' of type " +
      m.typeOf(a)
  );
  return "type_error:SafeStyleSheet";
};
I.prototype.toString = function () {
  return this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_.toString();
};
I.EMPTY = new I("", H);
m.html.SafeStyleSheet = I;
m.html.SafeHtml = function (a, c, d) {
  this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ =
    d === m.html.SafeHtml.CONSTRUCTOR_TOKEN_PRIVATE_ ? a : "";
  this.dir_ = c;
};
m.html.SafeHtml.ENABLE_ERROR_MESSAGES = m.DEBUG;
m.html.SafeHtml.SUPPORT_STYLE_ATTRIBUTE = !0;
b = m.html.SafeHtml.prototype;
b.implementsGoogI18nBidiDirectionalString = !0;
b.getDirection = function () {
  return this.dir_;
};
b.implementsGoogStringTypedString = !0;
b.getTypedStringValue = function () {
  return this.privateDoNotAccessOrElseSafeHtmlWrappedValue_.toString();
};
b.toString = function () {
  return this.privateDoNotAccessOrElseSafeHtmlWrappedValue_.toString();
};
m.html.SafeHtml.unwrap = function (a) {
  return m.html.SafeHtml.unwrapTrustedHTML(a).toString();
};
m.html.SafeHtml.unwrapTrustedHTML = function (a) {
  if (a instanceof m.html.SafeHtml && a.constructor === m.html.SafeHtml)
    return a.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
  m.asserts.fail(
    "expected object of type SafeHtml, got '" + a + "' of type " + m.typeOf(a)
  );
  return "type_error:SafeHtml";
};
m.html.SafeHtml.htmlEscape = function (a) {
  if (a instanceof m.html.SafeHtml) return a;
  var c = "object" == typeof a,
    d = null;
  c && a.implementsGoogI18nBidiDirectionalString && (d = a.getDirection());
  return m.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(
    m.string.internal.htmlEscape(
      c && a.implementsGoogStringTypedString
        ? a.getTypedStringValue()
        : String(a)
    ),
    d
  );
};
m.html.SafeHtml.htmlEscapePreservingNewlines = function (a) {
  if (a instanceof m.html.SafeHtml) return a;
  a = m.html.SafeHtml.htmlEscape(a);
  return m.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(
    m.string.internal.newLineToBr(m.html.SafeHtml.unwrap(a)),
    a.getDirection()
  );
};
m.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces = function (a) {
  if (a instanceof m.html.SafeHtml) return a;
  a = m.html.SafeHtml.htmlEscape(a);
  return m.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(
    m.string.internal.whitespaceEscape(m.html.SafeHtml.unwrap(a)),
    a.getDirection()
  );
};
m.html.SafeHtml.from = m.html.SafeHtml.htmlEscape;
m.html.SafeHtml.comment = function (a) {
  return m.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(
    "\x3c!--" + m.string.internal.htmlEscape(a) + "--\x3e",
    null
  );
};
m.html.SafeHtml.VALID_NAMES_IN_TAG_ = /^[a-zA-Z0-9-]+$/;
m.html.SafeHtml.URL_ATTRIBUTES_ = {
  action: !0,
  cite: !0,
  data: !0,
  formaction: !0,
  href: !0,
  manifest: !0,
  poster: !0,
  src: !0,
};
m.html.SafeHtml.NOT_ALLOWED_TAG_NAMES_ = m.object.createSet(
  m.dom.TagName.APPLET,
  m.dom.TagName.BASE,
  m.dom.TagName.EMBED,
  m.dom.TagName.IFRAME,
  m.dom.TagName.LINK,
  m.dom.TagName.MATH,
  m.dom.TagName.META,
  m.dom.TagName.OBJECT,
  m.dom.TagName.SCRIPT,
  m.dom.TagName.STYLE,
  m.dom.TagName.SVG,
  m.dom.TagName.TEMPLATE
);
m.html.SafeHtml.create = function (a, c, d) {
  m.html.SafeHtml.verifyTagName(String(a));
  return m.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse(
    String(a),
    c,
    d
  );
};
m.html.SafeHtml.verifyTagName = function (a) {
  if (!m.html.SafeHtml.VALID_NAMES_IN_TAG_.test(a))
    throw Error(
      m.html.SafeHtml.ENABLE_ERROR_MESSAGES
        ? "Invalid tag name <" + a + ">."
        : ""
    );
  if (a.toUpperCase() in m.html.SafeHtml.NOT_ALLOWED_TAG_NAMES_)
    throw Error(
      m.html.SafeHtml.ENABLE_ERROR_MESSAGES
        ? "Tag name <" + a + "> is not allowed for SafeHtml."
        : ""
    );
};
m.html.SafeHtml.createIframe = function (a, c, d, e) {
  a && m.html.TrustedResourceUrl.unwrap(a);
  var f = {};
  f.src = a || null;
  f.srcdoc = c && m.html.SafeHtml.unwrap(c);
  a = m.html.SafeHtml.combineAttributes(f, { sandbox: "" }, d);
  return m.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse(
    "iframe",
    a,
    e
  );
};
m.html.SafeHtml.createSandboxIframe = function (a, c, d, e) {
  if (!m.html.SafeHtml.canUseSandboxIframe())
    throw Error(
      m.html.SafeHtml.ENABLE_ERROR_MESSAGES
        ? "The browser does not support sandboxed iframes."
        : ""
    );
  var f = {};
  f.src = a ? m.html.SafeUrl.unwrap(m.html.SafeUrl.sanitize(a)) : null;
  f.srcdoc = c || null;
  f.sandbox = "";
  a = m.html.SafeHtml.combineAttributes(f, {}, d);
  return m.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse(
    "iframe",
    a,
    e
  );
};
m.html.SafeHtml.canUseSandboxIframe = function () {
  return (
    m.global.HTMLIFrameElement &&
    "sandbox" in m.global.HTMLIFrameElement.prototype
  );
};
m.html.SafeHtml.createScriptSrc = function (a, c) {
  m.html.TrustedResourceUrl.unwrap(a);
  a = m.html.SafeHtml.combineAttributes({ src: a }, {}, c);
  return m.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse(
    "script",
    a
  );
};
m.html.SafeHtml.createScript = function (a, c) {
  for (var d in c)
    if (Object.prototype.hasOwnProperty.call(c, d)) {
      var e = d.toLowerCase();
      if ("language" == e || "src" == e || "text" == e || "type" == e)
        throw Error(
          m.html.SafeHtml.ENABLE_ERROR_MESSAGES
            ? 'Cannot set "' + e + '" attribute'
            : ""
        );
    }
  d = "";
  a = B(a);
  for (e = 0; e < a.length; e++) d += G.unwrap(a[e]);
  a = m.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(
    d,
    m.i18n.bidi.Dir.NEUTRAL
  );
  return m.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse(
    "script",
    c,
    a
  );
};
m.html.SafeHtml.createStyle = function (a, c) {
  c = m.html.SafeHtml.combineAttributes({ type: "text/css" }, {}, c);
  var d = "";
  a = B(a);
  for (var e = 0; e < a.length; e++) d += I.unwrap(a[e]);
  a = m.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(
    d,
    m.i18n.bidi.Dir.NEUTRAL
  );
  return m.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse(
    "style",
    c,
    a
  );
};
m.html.SafeHtml.createMetaRefresh = function (a, c) {
  a = m.html.SafeUrl.unwrap(m.html.SafeUrl.sanitize(a));
  (m.labs.userAgent.browser.isIE() || m.labs.userAgent.browser.isEdge()) &&
    m.string.internal.contains(a, ";") &&
    (a = "'" + a.replace(/'/g, "%27") + "'");
  return m.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse(
    "meta",
    { "http-equiv": "refresh", content: (c || 0) + "; url=" + a }
  );
};
m.html.SafeHtml.getAttrNameAndValue_ = function (a, c, d) {
  if (d instanceof m.string.Const) d = m.string.Const.unwrap(d);
  else if ("style" == c.toLowerCase())
    if (m.html.SafeHtml.SUPPORT_STYLE_ATTRIBUTE)
      d = m.html.SafeHtml.getStyleValue_(d);
    else
      throw Error(
        m.html.SafeHtml.ENABLE_ERROR_MESSAGES
          ? 'Attribute "style" not supported.'
          : ""
      );
  else {
    if (/^on/i.test(c))
      throw Error(
        m.html.SafeHtml.ENABLE_ERROR_MESSAGES
          ? 'Attribute "' +
              c +
              '" requires goog.string.Const value, "' +
              d +
              '" given.'
          : ""
      );
    if (c.toLowerCase() in m.html.SafeHtml.URL_ATTRIBUTES_)
      if (d instanceof m.html.TrustedResourceUrl)
        d = m.html.TrustedResourceUrl.unwrap(d);
      else if (d instanceof m.html.SafeUrl) d = m.html.SafeUrl.unwrap(d);
      else if ("string" === typeof d)
        d = m.html.SafeUrl.sanitize(d).getTypedStringValue();
      else
        throw Error(
          m.html.SafeHtml.ENABLE_ERROR_MESSAGES
            ? 'Attribute "' +
                c +
                '" on tag "' +
                a +
                '" requires goog.html.SafeUrl, goog.string.Const, or string, value "' +
                d +
                '" given.'
            : ""
        );
  }
  d.implementsGoogStringTypedString && (d = d.getTypedStringValue());
  m.asserts.assert(
    "string" === typeof d || "number" === typeof d,
    "String or number value expected, got " + typeof d + " with value: " + d
  );
  return c + '="' + m.string.internal.htmlEscape(String(d)) + '"';
};
m.html.SafeHtml.getStyleValue_ = function (a) {
  if (!m.isObject(a))
    throw Error(
      m.html.SafeHtml.ENABLE_ERROR_MESSAGES
        ? 'The "style" attribute requires goog.html.SafeStyle or map of style properties, ' +
            typeof a +
            " given: " +
            a
        : ""
    );
  a instanceof m.html.SafeStyle || (a = m.html.SafeStyle.create(a));
  return m.html.SafeStyle.unwrap(a);
};
m.html.SafeHtml.createWithDir = function (a, c, d, e) {
  c = m.html.SafeHtml.create(c, d, e);
  c.dir_ = a;
  return c;
};
m.html.SafeHtml.join = function (a, c) {
  a = m.html.SafeHtml.htmlEscape(a);
  var d = a.getDirection(),
    e = [],
    f = function (g) {
      Array.isArray(g)
        ? w(g, f)
        : ((g = m.html.SafeHtml.htmlEscape(g)),
          e.push(m.html.SafeHtml.unwrap(g)),
          (g = g.getDirection()),
          d == m.i18n.bidi.Dir.NEUTRAL
            ? (d = g)
            : g != m.i18n.bidi.Dir.NEUTRAL && d != g && (d = null));
    };
  w(c, f);
  return m.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(
    e.join(m.html.SafeHtml.unwrap(a)),
    d
  );
};
m.html.SafeHtml.concat = function (a) {
  return m.html.SafeHtml.join(
    m.html.SafeHtml.EMPTY,
    Array.prototype.slice.call(arguments)
  );
};
m.html.SafeHtml.concatWithDir = function (a, c) {
  var d = m.html.SafeHtml.concat(D(arguments, 1));
  d.dir_ = a;
  return d;
};
m.html.SafeHtml.CONSTRUCTOR_TOKEN_PRIVATE_ = {};
m.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse = function (
  a,
  c
) {
  var d = m.html.trustedtypes.getPolicyPrivateDoNotAccessOrElse();
  a = d ? d.createHTML(a) : a;
  return new m.html.SafeHtml(a, c, m.html.SafeHtml.CONSTRUCTOR_TOKEN_PRIVATE_);
};
m.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse = function (
  a,
  c,
  d
) {
  var e = null;
  var f = "<" + a + m.html.SafeHtml.stringifyAttributes(a, c);
  null == d ? (d = []) : Array.isArray(d) || (d = [d]);
  m.dom.tags.isVoidTag(a.toLowerCase())
    ? (m.asserts.assert(
        !d.length,
        "Void tag <" + a + "> does not allow content."
      ),
      (f += ">"))
    : ((e = m.html.SafeHtml.concat(d)),
      (f += ">" + m.html.SafeHtml.unwrap(e) + "</" + a + ">"),
      (e = e.getDirection()));
  (a = c && c.dir) &&
    (e = /^(ltr|rtl|auto)$/i.test(a) ? m.i18n.bidi.Dir.NEUTRAL : null);
  return m.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(f, e);
};
m.html.SafeHtml.stringifyAttributes = function (a, c) {
  var d = "";
  if (c)
    for (var e in c)
      if (Object.prototype.hasOwnProperty.call(c, e)) {
        if (!m.html.SafeHtml.VALID_NAMES_IN_TAG_.test(e))
          throw Error(
            m.html.SafeHtml.ENABLE_ERROR_MESSAGES
              ? 'Invalid attribute name "' + e + '".'
              : ""
          );
        var f = c[e];
        null != f && (d += " " + m.html.SafeHtml.getAttrNameAndValue_(a, e, f));
      }
  return d;
};
m.html.SafeHtml.combineAttributes = function (a, c, d) {
  var e = {},
    f;
  for (f in a)
    Object.prototype.hasOwnProperty.call(a, f) &&
      (m.asserts.assert(f.toLowerCase() == f, "Must be lower case"),
      (e[f] = a[f]));
  for (f in c)
    Object.prototype.hasOwnProperty.call(c, f) &&
      (m.asserts.assert(f.toLowerCase() == f, "Must be lower case"),
      (e[f] = c[f]));
  if (d)
    for (f in d)
      if (Object.prototype.hasOwnProperty.call(d, f)) {
        var g = f.toLowerCase();
        if (g in a)
          throw Error(
            m.html.SafeHtml.ENABLE_ERROR_MESSAGES
              ? 'Cannot override "' +
                  g +
                  '" attribute, got "' +
                  f +
                  '" with value "' +
                  d[f] +
                  '"'
              : ""
          );
        g in c && delete e[g];
        e[f] = d[f];
      }
  return e;
};
m.html.SafeHtml.DOCTYPE_HTML =
  m.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(
    "<!DOCTYPE html>",
    m.i18n.bidi.Dir.NEUTRAL
  );
m.html.SafeHtml.EMPTY = new m.html.SafeHtml(
  (m.global.trustedTypes && m.global.trustedTypes.emptyHTML) || "",
  m.i18n.bidi.Dir.NEUTRAL,
  m.html.SafeHtml.CONSTRUCTOR_TOKEN_PRIVATE_
);
m.html.SafeHtml.BR =
  m.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(
    "<br>",
    m.i18n.bidi.Dir.NEUTRAL
  );
m.html.uncheckedconversions = {};
m.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract =
  function (a, c) {
    m.asserts.assertString(
      m.string.Const.unwrap(a),
      "must provide justification"
    );
    m.asserts.assert(
      !m.string.internal.isEmptyOrWhitespace(m.string.Const.unwrap(a)),
      "must provide non-empty justification"
    );
    return m.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(
      c,
      null
    );
  };
m.html.uncheckedconversions.safeScriptFromStringKnownToSatisfyTypeContract =
  function (a, c) {
    m.asserts.assertString(
      m.string.Const.unwrap(a),
      "must provide justification"
    );
    m.asserts.assert(
      !m.string.internal.isEmptyOrWhitespace(m.string.Const.unwrap(a)),
      "must provide non-empty justification"
    );
    return Ba(c);
  };
m.html.uncheckedconversions.safeStyleFromStringKnownToSatisfyTypeContract =
  function (a, c) {
    m.asserts.assertString(
      m.string.Const.unwrap(a),
      "must provide justification"
    );
    m.asserts.assert(
      !m.string.internal.isEmptyOrWhitespace(m.string.Const.unwrap(a)),
      "must provide non-empty justification"
    );
    return m.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(c);
  };
m.html.uncheckedconversions.safeStyleSheetFromStringKnownToSatisfyTypeContract =
  function (a, c) {
    m.asserts.assertString(
      m.string.Const.unwrap(a),
      "must provide justification"
    );
    m.asserts.assert(
      !m.string.internal.isEmptyOrWhitespace(m.string.Const.unwrap(a)),
      "must provide non-empty justification"
    );
    return new I(c, H);
  };
m.html.uncheckedconversions.safeUrlFromStringKnownToSatisfyTypeContract =
  function (a, c) {
    m.asserts.assertString(
      m.string.Const.unwrap(a),
      "must provide justification"
    );
    m.asserts.assert(
      !m.string.internal.isEmptyOrWhitespace(m.string.Const.unwrap(a)),
      "must provide non-empty justification"
    );
    return m.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(c);
  };
m.html.uncheckedconversions.trustedResourceUrlFromStringKnownToSatisfyTypeContract =
  function (a, c) {
    m.asserts.assertString(
      m.string.Const.unwrap(a),
      "must provide justification"
    );
    m.asserts.assert(
      !m.string.internal.isEmptyOrWhitespace(m.string.Const.unwrap(a)),
      "must provide non-empty justification"
    );
    return m.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(
      c
    );
  };
m.dom.safe = {};
m.dom.safe.InsertAdjacentHtmlPosition = {
  AFTERBEGIN: "afterbegin",
  AFTEREND: "afterend",
  BEFOREBEGIN: "beforebegin",
  BEFOREEND: "beforeend",
};
m.dom.safe.insertAdjacentHtml = function (a, c, d) {
  a.insertAdjacentHTML(c, m.html.SafeHtml.unwrapTrustedHTML(d));
};
m.dom.safe.SET_INNER_HTML_DISALLOWED_TAGS_ = {
  MATH: !0,
  SCRIPT: !0,
  STYLE: !0,
  SVG: !0,
  TEMPLATE: !0,
};
m.dom.safe.isInnerHtmlCleanupRecursive_ = m.functions.cacheReturnValue(
  function () {
    if (m.DEBUG && "undefined" === typeof document) return !1;
    var a = document.createElement("div"),
      c = document.createElement("div");
    c.appendChild(document.createElement("div"));
    a.appendChild(c);
    if (m.DEBUG && !a.firstChild) return !1;
    c = a.firstChild.firstChild;
    a.innerHTML = m.html.SafeHtml.unwrapTrustedHTML(m.html.SafeHtml.EMPTY);
    return !c.parentElement;
  }
);
m.dom.safe.unsafeSetInnerHtmlDoNotUseOrElse = function (a, c) {
  if (m.dom.safe.isInnerHtmlCleanupRecursive_())
    for (; a.lastChild; ) a.removeChild(a.lastChild);
  a.innerHTML = m.html.SafeHtml.unwrapTrustedHTML(c);
};
m.dom.safe.setInnerHtml = function (a, c) {
  if (
    m.asserts.ENABLE_ASSERTS &&
    a.tagName &&
    m.dom.safe.SET_INNER_HTML_DISALLOWED_TAGS_[a.tagName.toUpperCase()]
  )
    throw Error(
      "goog.dom.safe.setInnerHtml cannot be used to set content of " +
        a.tagName +
        "."
    );
  m.dom.safe.unsafeSetInnerHtmlDoNotUseOrElse(a, c);
};
m.dom.safe.setInnerHtmlFromConstant = function (a, c) {
  m.dom.safe.setInnerHtml(
    a,
    m.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract(
      m.string.Const.from("Constant HTML to be immediatelly used."),
      m.string.Const.unwrap(c)
    )
  );
};
m.dom.safe.setOuterHtml = function (a, c) {
  a.outerHTML = m.html.SafeHtml.unwrapTrustedHTML(c);
};
m.dom.safe.setFormElementAction = function (a, c) {
  c =
    c instanceof m.html.SafeUrl ? c : m.html.SafeUrl.sanitizeAssertUnchanged(c);
  m.dom.asserts.assertIsHTMLFormElement(a).action = m.html.SafeUrl.unwrap(c);
};
m.dom.safe.setButtonFormAction = function (a, c) {
  c =
    c instanceof m.html.SafeUrl ? c : m.html.SafeUrl.sanitizeAssertUnchanged(c);
  m.dom.asserts.assertIsHTMLButtonElement(a).formAction =
    m.html.SafeUrl.unwrap(c);
};
m.dom.safe.setInputFormAction = function (a, c) {
  c =
    c instanceof m.html.SafeUrl ? c : m.html.SafeUrl.sanitizeAssertUnchanged(c);
  m.dom.asserts.assertIsHTMLInputElement(a).formAction =
    m.html.SafeUrl.unwrap(c);
};
m.dom.safe.setStyle = function (a, c) {
  a.style.cssText = m.html.SafeStyle.unwrap(c);
};
m.dom.safe.documentWrite = function (a, c) {
  a.write(m.html.SafeHtml.unwrapTrustedHTML(c));
};
m.dom.safe.setAnchorHref = function (a, c) {
  m.dom.asserts.assertIsHTMLAnchorElement(a);
  c =
    c instanceof m.html.SafeUrl ? c : m.html.SafeUrl.sanitizeAssertUnchanged(c);
  a.href = m.html.SafeUrl.unwrap(c);
};
m.dom.safe.setImageSrc = function (a, c) {
  m.dom.asserts.assertIsHTMLImageElement(a);
  c =
    c instanceof m.html.SafeUrl
      ? c
      : m.html.SafeUrl.sanitizeAssertUnchanged(c, /^data:image\//i.test(c));
  a.src = m.html.SafeUrl.unwrap(c);
};
m.dom.safe.setAudioSrc = function (a, c) {
  m.dom.asserts.assertIsHTMLAudioElement(a);
  c =
    c instanceof m.html.SafeUrl
      ? c
      : m.html.SafeUrl.sanitizeAssertUnchanged(c, /^data:audio\//i.test(c));
  a.src = m.html.SafeUrl.unwrap(c);
};
m.dom.safe.setVideoSrc = function (a, c) {
  m.dom.asserts.assertIsHTMLVideoElement(a);
  c =
    c instanceof m.html.SafeUrl
      ? c
      : m.html.SafeUrl.sanitizeAssertUnchanged(c, /^data:video\//i.test(c));
  a.src = m.html.SafeUrl.unwrap(c);
};
m.dom.safe.setEmbedSrc = function (a, c) {
  m.dom.asserts.assertIsHTMLEmbedElement(a);
  a.src = m.html.TrustedResourceUrl.unwrapTrustedScriptURL(c);
};
m.dom.safe.setFrameSrc = function (a, c) {
  m.dom.asserts.assertIsHTMLFrameElement(a);
  a.src = m.html.TrustedResourceUrl.unwrap(c);
};
m.dom.safe.setIframeSrc = function (a, c) {
  m.dom.asserts.assertIsHTMLIFrameElement(a);
  a.src = m.html.TrustedResourceUrl.unwrap(c);
};
m.dom.safe.setIframeSrcdoc = function (a, c) {
  m.dom.asserts.assertIsHTMLIFrameElement(a);
  a.srcdoc = m.html.SafeHtml.unwrapTrustedHTML(c);
};
m.dom.safe.setLinkHrefAndRel = function (a, c, d) {
  m.dom.asserts.assertIsHTMLLinkElement(a);
  a.rel = d;
  m.string.internal.caseInsensitiveContains(d, "stylesheet")
    ? (m.asserts.assert(
        c instanceof m.html.TrustedResourceUrl,
        'URL must be TrustedResourceUrl because "rel" contains "stylesheet"'
      ),
      (a.href = m.html.TrustedResourceUrl.unwrap(c)))
    : (a.href =
        c instanceof m.html.TrustedResourceUrl
          ? m.html.TrustedResourceUrl.unwrap(c)
          : c instanceof m.html.SafeUrl
          ? m.html.SafeUrl.unwrap(c)
          : m.html.SafeUrl.unwrap(m.html.SafeUrl.sanitizeAssertUnchanged(c)));
};
m.dom.safe.setObjectData = function (a, c) {
  m.dom.asserts.assertIsHTMLObjectElement(a);
  a.data = m.html.TrustedResourceUrl.unwrapTrustedScriptURL(c);
};
m.dom.safe.setScriptSrc = function (a, c) {
  m.dom.asserts.assertIsHTMLScriptElement(a);
  a.src = m.html.TrustedResourceUrl.unwrapTrustedScriptURL(c);
  m.dom.safe.setNonceForScriptElement_(a);
};
m.dom.safe.setScriptContent = function (a, c) {
  m.dom.asserts.assertIsHTMLScriptElement(a);
  a.textContent = Ca(c);
  m.dom.safe.setNonceForScriptElement_(a);
};
m.dom.safe.setNonceForScriptElement_ = function (a) {
  var c = m.getScriptNonce(a.ownerDocument && a.ownerDocument.defaultView);
  c && a.setAttribute("nonce", c);
};
m.dom.safe.setLocationHref = function (a, c) {
  m.dom.asserts.assertIsLocation(a);
  c =
    c instanceof m.html.SafeUrl ? c : m.html.SafeUrl.sanitizeAssertUnchanged(c);
  a.href = m.html.SafeUrl.unwrap(c);
};
m.dom.safe.assignLocation = function (a, c) {
  m.dom.asserts.assertIsLocation(a);
  c =
    c instanceof m.html.SafeUrl ? c : m.html.SafeUrl.sanitizeAssertUnchanged(c);
  a.assign(m.html.SafeUrl.unwrap(c));
};
m.dom.safe.replaceLocation = function (a, c) {
  c =
    c instanceof m.html.SafeUrl ? c : m.html.SafeUrl.sanitizeAssertUnchanged(c);
  a.replace(m.html.SafeUrl.unwrap(c));
};
m.dom.safe.openInWindow = function (a, c, d, e, f) {
  a =
    a instanceof m.html.SafeUrl ? a : m.html.SafeUrl.sanitizeAssertUnchanged(a);
  c = c || m.global;
  d = d instanceof m.string.Const ? m.string.Const.unwrap(d) : d || "";
  return void 0 !== e || void 0 !== f
    ? c.open(m.html.SafeUrl.unwrap(a), d, e, f)
    : c.open(m.html.SafeUrl.unwrap(a), d);
};
m.dom.safe.parseFromStringHtml = function (a, c) {
  return m.dom.safe.parseFromString(a, c, "text/html");
};
m.dom.safe.parseFromString = function (a, c, d) {
  return a.parseFromString(m.html.SafeHtml.unwrapTrustedHTML(c), d);
};
m.dom.safe.createImageFromBlob = function (a) {
  if (!/^image\/.*/g.test(a.type))
    throw Error(
      "goog.dom.safe.createImageFromBlob only accepts MIME type image/.*."
    );
  var c = m.global.URL.createObjectURL(a);
  a = new m.global.Image();
  a.onload = function () {
    m.global.URL.revokeObjectURL(c);
  };
  m.dom.safe.setImageSrc(
    a,
    m.html.uncheckedconversions.safeUrlFromStringKnownToSatisfyTypeContract(
      m.string.Const.from("Image blob URL."),
      c
    )
  );
  return a;
};
m.dom.safe.createContextualFragment = function (a, c) {
  return a.createContextualFragment(m.html.SafeHtml.unwrapTrustedHTML(c));
};
m.string.DETECT_DOUBLE_ESCAPING = !1;
m.string.FORCE_NON_DOM_HTML_UNESCAPING = !1;
m.string.Unicode = { NBSP: "\u00a0" };
m.string.startsWith = m.string.internal.startsWith;
m.string.endsWith = m.string.internal.endsWith;
m.string.caseInsensitiveStartsWith =
  m.string.internal.caseInsensitiveStartsWith;
m.string.caseInsensitiveEndsWith = m.string.internal.caseInsensitiveEndsWith;
m.string.caseInsensitiveEquals = m.string.internal.caseInsensitiveEquals;
m.string.subs = function (a, c) {
  for (
    var d = a.split("%s"), e = "", f = Array.prototype.slice.call(arguments, 1);
    f.length && 1 < d.length;

  )
    e += d.shift() + f.shift();
  return e + d.join("%s");
};
m.string.collapseWhitespace = function (a) {
  return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "");
};
m.string.isEmptyOrWhitespace = m.string.internal.isEmptyOrWhitespace;
m.string.isEmptyString = function (a) {
  return 0 == a.length;
};
m.string.isEmpty = m.string.isEmptyOrWhitespace;
m.string.isEmptyOrWhitespaceSafe = function (a) {
  return m.string.isEmptyOrWhitespace(m.string.makeSafe(a));
};
m.string.isEmptySafe = m.string.isEmptyOrWhitespaceSafe;
m.string.isBreakingWhitespace = function (a) {
  return !/[^\t\n\r ]/.test(a);
};
m.string.isAlpha = function (a) {
  return !/[^a-zA-Z]/.test(a);
};
m.string.isNumeric = function (a) {
  return !/[^0-9]/.test(a);
};
m.string.isAlphaNumeric = function (a) {
  return !/[^a-zA-Z0-9]/.test(a);
};
m.string.isSpace = function (a) {
  return " " == a;
};
m.string.isUnicodeChar = function (a) {
  return (
    (1 == a.length && " " <= a && "~" >= a) || ("\u0080" <= a && "\ufffd" >= a)
  );
};
m.string.stripNewlines = function (a) {
  return a.replace(/(\r\n|\r|\n)+/g, " ");
};
m.string.canonicalizeNewlines = function (a) {
  return a.replace(/(\r\n|\r|\n)/g, "\n");
};
m.string.normalizeWhitespace = function (a) {
  return a.replace(/\xa0|\s/g, " ");
};
m.string.normalizeSpaces = function (a) {
  return a.replace(/\xa0|[ \t]+/g, " ");
};
m.string.collapseBreakingSpaces = function (a) {
  return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "");
};
m.string.trim = m.string.internal.trim;
m.string.trimLeft = function (a) {
  return a.replace(/^[\s\xa0]+/, "");
};
m.string.trimRight = function (a) {
  return a.replace(/[\s\xa0]+$/, "");
};
m.string.caseInsensitiveCompare = m.string.internal.caseInsensitiveCompare;
m.string.numberAwareCompare_ = function (a, c, d) {
  if (a == c) return 0;
  if (!a) return -1;
  if (!c) return 1;
  for (
    var e = a.toLowerCase().match(d),
      f = c.toLowerCase().match(d),
      g = Math.min(e.length, f.length),
      h = 0;
    h < g;
    h++
  ) {
    d = e[h];
    var l = f[h];
    if (d != l)
      return (
        (a = parseInt(d, 10)),
        !isNaN(a) && ((c = parseInt(l, 10)), !isNaN(c) && a - c)
          ? a - c
          : d < l
          ? -1
          : 1
      );
  }
  return e.length != f.length ? e.length - f.length : a < c ? -1 : 1;
};
m.string.intAwareCompare = function (a, c) {
  return m.string.numberAwareCompare_(a, c, /\d+|\D+/g);
};
m.string.floatAwareCompare = function (a, c) {
  return m.string.numberAwareCompare_(a, c, /\d+|\.\d+|\D+/g);
};
m.string.numerateCompare = m.string.floatAwareCompare;
m.string.urlEncode = function (a) {
  return encodeURIComponent(String(a));
};
m.string.urlDecode = function (a) {
  return decodeURIComponent(a.replace(/\+/g, " "));
};
m.string.newLineToBr = m.string.internal.newLineToBr;
m.string.htmlEscape = function (a, c) {
  a = m.string.internal.htmlEscape(a, c);
  m.string.DETECT_DOUBLE_ESCAPING && (a = a.replace(m.string.E_RE_, "&#101;"));
  return a;
};
m.string.E_RE_ = /e/g;
m.string.unescapeEntities = function (a) {
  return m.string.contains(a, "&")
    ? !m.string.FORCE_NON_DOM_HTML_UNESCAPING && "document" in m.global
      ? m.string.unescapeEntitiesUsingDom_(a)
      : m.string.unescapePureXmlEntities_(a)
    : a;
};
m.string.unescapeEntitiesWithDocument = function (a, c) {
  return m.string.contains(a, "&")
    ? m.string.unescapeEntitiesUsingDom_(a, c)
    : a;
};
m.string.unescapeEntitiesUsingDom_ = function (a, c) {
  var d = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"' };
  var e = c ? c.createElement("div") : m.global.document.createElement("div");
  return a.replace(m.string.HTML_ENTITY_PATTERN_, function (f, g) {
    var h = d[f];
    if (h) return h;
    "#" == g.charAt(0) &&
      ((g = Number("0" + g.substr(1))),
      isNaN(g) || (h = String.fromCharCode(g)));
    h ||
      (m.dom.safe.setInnerHtml(
        e,
        m.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract(
          m.string.Const.from("Single HTML entity."),
          f + " "
        )
      ),
      (h = e.firstChild.nodeValue.slice(0, -1)));
    return (d[f] = h);
  });
};
m.string.unescapePureXmlEntities_ = function (a) {
  return a.replace(/&([^;]+);/g, function (c, d) {
    switch (d) {
      case "amp":
        return "&";
      case "lt":
        return "<";
      case "gt":
        return ">";
      case "quot":
        return '"';
      default:
        return "#" != d.charAt(0) || ((d = Number("0" + d.substr(1))), isNaN(d))
          ? c
          : String.fromCharCode(d);
    }
  });
};
m.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
m.string.whitespaceEscape = function (a) {
  return m.string.newLineToBr(a.replace(/  /g, " &#160;"), void 0);
};
m.string.preserveSpaces = function (a) {
  return a.replace(/(^|[\n ]) /g, "$1" + m.string.Unicode.NBSP);
};
m.string.stripQuotes = function (a, c) {
  for (var d = c.length, e = 0; e < d; e++) {
    var f = 1 == d ? c : c.charAt(e);
    if (a.charAt(0) == f && a.charAt(a.length - 1) == f)
      return a.substring(1, a.length - 1);
  }
  return a;
};
m.string.truncate = function (a, c, d) {
  d && (a = m.string.unescapeEntities(a));
  a.length > c && (a = a.substring(0, c - 3) + "...");
  d && (a = m.string.htmlEscape(a));
  return a;
};
m.string.truncateMiddle = function (a, c, d, e) {
  d && (a = m.string.unescapeEntities(a));
  e && a.length > c
    ? (e > c && (e = c),
      (a = a.substring(0, c - e) + "..." + a.substring(a.length - e)))
    : a.length > c &&
      ((e = Math.floor(c / 2)),
      (a = a.substring(0, e + (c % 2)) + "..." + a.substring(a.length - e)));
  d && (a = m.string.htmlEscape(a));
  return a;
};
m.string.specialEscapeChars_ = {
  "\x00": "\\0",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "\t": "\\t",
  "\x0B": "\\x0B",
  '"': '\\"',
  "\\": "\\\\",
  "<": "\\u003C",
};
m.string.jsEscapeCache_ = { "'": "\\'" };
m.string.quote = function (a) {
  a = String(a);
  for (var c = ['"'], d = 0; d < a.length; d++) {
    var e = a.charAt(d),
      f = e.charCodeAt(0);
    c[d + 1] =
      m.string.specialEscapeChars_[e] ||
      (31 < f && 127 > f ? e : m.string.escapeChar(e));
  }
  c.push('"');
  return c.join("");
};
m.string.escapeString = function (a) {
  for (var c = [], d = 0; d < a.length; d++)
    c[d] = m.string.escapeChar(a.charAt(d));
  return c.join("");
};
m.string.escapeChar = function (a) {
  if (a in m.string.jsEscapeCache_) return m.string.jsEscapeCache_[a];
  if (a in m.string.specialEscapeChars_)
    return (m.string.jsEscapeCache_[a] = m.string.specialEscapeChars_[a]);
  var c = a.charCodeAt(0);
  if (31 < c && 127 > c) var d = a;
  else {
    if (256 > c) {
      if (((d = "\\x"), 16 > c || 256 < c)) d += "0";
    } else (d = "\\u"), 4096 > c && (d += "0");
    d += c.toString(16).toUpperCase();
  }
  return (m.string.jsEscapeCache_[a] = d);
};
m.string.contains = m.string.internal.contains;
m.string.caseInsensitiveContains = m.string.internal.caseInsensitiveContains;
m.string.countOf = function (a, c) {
  return a && c ? a.split(c).length - 1 : 0;
};
m.string.removeAt = function (a, c, d) {
  var e = a;
  0 <= c &&
    c < a.length &&
    0 < d &&
    (e = a.substr(0, c) + a.substr(c + d, a.length - c - d));
  return e;
};
m.string.remove = function (a, c) {
  return a.replace(c, "");
};
m.string.removeAll = function (a, c) {
  c = new RegExp(m.string.regExpEscape(c), "g");
  return a.replace(c, "");
};
m.string.replaceAll = function (a, c, d) {
  c = new RegExp(m.string.regExpEscape(c), "g");
  return a.replace(c, d.replace(/\$/g, "$$$$"));
};
m.string.regExpEscape = function (a) {
  return String(a)
    .replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1")
    .replace(/\x08/g, "\\x08");
};
m.string.repeat = String.prototype.repeat
  ? function (a, c) {
      return a.repeat(c);
    }
  : function (a, c) {
      return Array(c + 1).join(a);
    };
m.string.padNumber = function (a, c, d) {
  a = void 0 !== d ? a.toFixed(d) : String(a);
  d = a.indexOf(".");
  -1 == d && (d = a.length);
  return m.string.repeat("0", Math.max(0, c - d)) + a;
};
m.string.makeSafe = function (a) {
  return null == a ? "" : String(a);
};
m.string.buildString = function (a) {
  return Array.prototype.join.call(arguments, "");
};
m.string.getRandomString = function () {
  return (
    Math.floor(2147483648 * Math.random()).toString(36) +
    Math.abs(Math.floor(2147483648 * Math.random()) ^ m.now()).toString(36)
  );
};
m.string.compareVersions = m.string.internal.compareVersions;
m.string.hashCode = function (a) {
  for (var c = 0, d = 0; d < a.length; ++d)
    c = (31 * c + a.charCodeAt(d)) >>> 0;
  return c;
};
m.string.uniqueStringCounter_ = (2147483648 * Math.random()) | 0;
m.string.createUniqueString = function () {
  return "goog_" + m.string.uniqueStringCounter_++;
};
m.string.toNumber = function (a) {
  var c = Number(a);
  return 0 == c && m.string.isEmptyOrWhitespace(a) ? NaN : c;
};
m.string.isLowerCamelCase = function (a) {
  return /^[a-z]+([A-Z][a-z]*)*$/.test(a);
};
m.string.isUpperCamelCase = function (a) {
  return /^([A-Z][a-z]*)+$/.test(a);
};
m.string.toCamelCase = function (a) {
  return String(a).replace(/\-([a-z])/g, function (c, d) {
    return d.toUpperCase();
  });
};
m.string.toSelectorCase = function (a) {
  return String(a)
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase();
};
m.string.toTitleCase = function (a, c) {
  c = "string" === typeof c ? m.string.regExpEscape(c) : "\\s";
  return a.replace(
    new RegExp("(^" + (c ? "|[" + c + "]+" : "") + ")([a-z])", "g"),
    function (d, e, f) {
      return e + f.toUpperCase();
    }
  );
};
m.string.capitalize = function (a) {
  return String(a.charAt(0)).toUpperCase() + String(a.substr(1)).toLowerCase();
};
m.string.parseInt = function (a) {
  isFinite(a) && (a = String(a));
  return "string" === typeof a
    ? /^\s*-?0x/i.test(a)
      ? parseInt(a, 16)
      : parseInt(a, 10)
    : NaN;
};
m.string.splitLimit = function (a, c, d) {
  a = a.split(c);
  for (var e = []; 0 < d && a.length; ) e.push(a.shift()), d--;
  a.length && e.push(a.join(c));
  return e;
};
m.string.lastComponent = function (a, c) {
  if (c) "string" == typeof c && (c = [c]);
  else return a;
  for (var d = -1, e = 0; e < c.length; e++)
    if ("" != c[e]) {
      var f = a.lastIndexOf(c[e]);
      f > d && (d = f);
    }
  return -1 == d ? a : a.slice(d + 1);
};
m.string.editDistance = function (a, c) {
  var d = [],
    e = [];
  if (a == c) return 0;
  if (!a.length || !c.length) return Math.max(a.length, c.length);
  for (var f = 0; f < c.length + 1; f++) d[f] = f;
  for (f = 0; f < a.length; f++) {
    e[0] = f + 1;
    for (var g = 0; g < c.length; g++)
      e[g + 1] = Math.min(e[g] + 1, d[g + 1] + 1, d[g] + Number(a[f] != c[g]));
    for (g = 0; g < d.length; g++) d[g] = e[g];
  }
  return e[c.length];
};
m.labs.userAgent.engine = {};
m.labs.userAgent.engine.isPresto = function () {
  return m.labs.userAgent.util.matchUserAgent("Presto");
};
m.labs.userAgent.engine.isTrident = function () {
  return (
    m.labs.userAgent.util.matchUserAgent("Trident") ||
    m.labs.userAgent.util.matchUserAgent("MSIE")
  );
};
m.labs.userAgent.engine.isEdge = function () {
  return m.labs.userAgent.util.matchUserAgent("Edge");
};
m.labs.userAgent.engine.isWebKit = function () {
  return (
    m.labs.userAgent.util.matchUserAgentIgnoreCase("WebKit") &&
    !m.labs.userAgent.engine.isEdge()
  );
};
m.labs.userAgent.engine.isGecko = function () {
  return (
    m.labs.userAgent.util.matchUserAgent("Gecko") &&
    !m.labs.userAgent.engine.isWebKit() &&
    !m.labs.userAgent.engine.isTrident() &&
    !m.labs.userAgent.engine.isEdge()
  );
};
m.labs.userAgent.engine.getVersion = function () {
  var a = m.labs.userAgent.util.getUserAgent();
  if (a) {
    a = m.labs.userAgent.util.extractVersionTuples(a);
    var c = m.labs.userAgent.engine.getEngineTuple_(a);
    if (c)
      return "Gecko" == c[0]
        ? m.labs.userAgent.engine.getVersionForKey_(a)
        : c[1];
    a = a[0];
    var d;
    if (a && (d = a[2]) && (d = /Trident\/([^\s;]+)/.exec(d))) return d[1];
  }
  return "";
};
m.labs.userAgent.engine.getEngineTuple_ = function (a) {
  if (!m.labs.userAgent.engine.isEdge()) return a[1];
  for (var c = 0; c < a.length; c++) {
    var d = a[c];
    if ("Edge" == d[0]) return d;
  }
};
m.labs.userAgent.engine.isVersionOrHigher = function (a) {
  return 0 <= m.string.compareVersions(m.labs.userAgent.engine.getVersion(), a);
};
m.labs.userAgent.engine.getVersionForKey_ = function (a) {
  return (
    ((a = ja(a, function (c) {
      return "Firefox" == c[0];
    })) &&
      a[1]) ||
    ""
  );
};
m.labs.userAgent.platform = {};
m.labs.userAgent.platform.isAndroid = function () {
  return m.labs.userAgent.util.matchUserAgent("Android");
};
m.labs.userAgent.platform.isIpod = function () {
  return m.labs.userAgent.util.matchUserAgent("iPod");
};
m.labs.userAgent.platform.isIphone = function () {
  return (
    m.labs.userAgent.util.matchUserAgent("iPhone") &&
    !m.labs.userAgent.util.matchUserAgent("iPod") &&
    !m.labs.userAgent.util.matchUserAgent("iPad")
  );
};
m.labs.userAgent.platform.isIpad = function () {
  return m.labs.userAgent.util.matchUserAgent("iPad");
};
m.labs.userAgent.platform.isIos = function () {
  return (
    m.labs.userAgent.platform.isIphone() ||
    m.labs.userAgent.platform.isIpad() ||
    m.labs.userAgent.platform.isIpod()
  );
};
m.labs.userAgent.platform.isMacintosh = function () {
  return m.labs.userAgent.util.matchUserAgent("Macintosh");
};
m.labs.userAgent.platform.isLinux = function () {
  return m.labs.userAgent.util.matchUserAgent("Linux");
};
m.labs.userAgent.platform.isWindows = function () {
  return m.labs.userAgent.util.matchUserAgent("Windows");
};
m.labs.userAgent.platform.isChromeOS = function () {
  return m.labs.userAgent.util.matchUserAgent("CrOS");
};
m.labs.userAgent.platform.isChromecast = function () {
  return m.labs.userAgent.util.matchUserAgent("CrKey");
};
m.labs.userAgent.platform.isKaiOS = function () {
  return m.labs.userAgent.util.matchUserAgentIgnoreCase("KaiOS");
};
m.labs.userAgent.platform.getVersion = function () {
  var a = m.labs.userAgent.util.getUserAgent(),
    c = "";
  m.labs.userAgent.platform.isWindows()
    ? ((c = /Windows (?:NT|Phone) ([0-9.]+)/),
      (c = (a = c.exec(a)) ? a[1] : "0.0"))
    : m.labs.userAgent.platform.isIos()
    ? ((c = /(?:iPhone|iPod|iPad|CPU)\s+OS\s+(\S+)/),
      (c = (a = c.exec(a)) && a[1].replace(/_/g, ".")))
    : m.labs.userAgent.platform.isMacintosh()
    ? ((c = /Mac OS X ([0-9_.]+)/),
      (c = (a = c.exec(a)) ? a[1].replace(/_/g, ".") : "10"))
    : m.labs.userAgent.platform.isKaiOS()
    ? ((c = /(?:KaiOS)\/(\S+)/i), (c = (a = c.exec(a)) && a[1]))
    : m.labs.userAgent.platform.isAndroid()
    ? ((c = /Android\s+([^\);]+)(\)|;)/), (c = (a = c.exec(a)) && a[1]))
    : m.labs.userAgent.platform.isChromeOS() &&
      ((c = /(?:CrOS\s+(?:i686|x86_64)\s+([0-9.]+))/),
      (c = (a = c.exec(a)) && a[1]));
  return c || "";
};
m.labs.userAgent.platform.isVersionOrHigher = function (a) {
  return (
    0 <= m.string.compareVersions(m.labs.userAgent.platform.getVersion(), a)
  );
};
m.reflect = {};
m.reflect.object = function (a, c) {
  return c;
};
m.reflect.objectProperty = function (a) {
  return a;
};
m.reflect.sinkValue = function (a) {
  m.reflect.sinkValue[" "](a);
  return a;
};
m.reflect.sinkValue[" "] = m.nullFunction;
m.reflect.canAccessProperty = function (a) {
  try {
    return m.reflect.sinkValue(a.nodeName), !0;
  } catch (c) {}
  return !1;
};
m.reflect.cache = function (a, c, d, e) {
  e = e ? e(c) : c;
  return Object.prototype.hasOwnProperty.call(a, e) ? a[e] : (a[e] = d(c));
};
m.userAgent = {};
m.userAgent.ASSUME_IE = !1;
m.userAgent.ASSUME_EDGE = !1;
m.userAgent.ASSUME_GECKO = !1;
m.userAgent.ASSUME_WEBKIT = !1;
m.userAgent.ASSUME_MOBILE_WEBKIT = !1;
m.userAgent.ASSUME_OPERA = !1;
m.userAgent.ASSUME_ANY_VERSION = !1;
m.userAgent.BROWSER_KNOWN_ =
  m.userAgent.ASSUME_IE ||
  m.userAgent.ASSUME_EDGE ||
  m.userAgent.ASSUME_GECKO ||
  m.userAgent.ASSUME_MOBILE_WEBKIT ||
  m.userAgent.ASSUME_WEBKIT ||
  m.userAgent.ASSUME_OPERA;
m.userAgent.getUserAgentString = function () {
  return m.labs.userAgent.util.getUserAgent();
};
m.userAgent.getNavigatorTyped = function () {
  return m.global.navigator || null;
};
m.userAgent.getNavigator = function () {
  return m.userAgent.getNavigatorTyped();
};
m.userAgent.OPERA = m.userAgent.BROWSER_KNOWN_
  ? m.userAgent.ASSUME_OPERA
  : m.labs.userAgent.browser.isOpera();
m.userAgent.IE = m.userAgent.BROWSER_KNOWN_
  ? m.userAgent.ASSUME_IE
  : m.labs.userAgent.browser.isIE();
m.userAgent.EDGE = m.userAgent.BROWSER_KNOWN_
  ? m.userAgent.ASSUME_EDGE
  : m.labs.userAgent.engine.isEdge();
m.userAgent.EDGE_OR_IE = m.userAgent.EDGE || m.userAgent.IE;
m.userAgent.GECKO = m.userAgent.BROWSER_KNOWN_
  ? m.userAgent.ASSUME_GECKO
  : m.labs.userAgent.engine.isGecko();
m.userAgent.WEBKIT = m.userAgent.BROWSER_KNOWN_
  ? m.userAgent.ASSUME_WEBKIT || m.userAgent.ASSUME_MOBILE_WEBKIT
  : m.labs.userAgent.engine.isWebKit();
m.userAgent.isMobile_ = function () {
  return m.userAgent.WEBKIT && m.labs.userAgent.util.matchUserAgent("Mobile");
};
m.userAgent.MOBILE =
  m.userAgent.ASSUME_MOBILE_WEBKIT || m.userAgent.isMobile_();
m.userAgent.SAFARI = m.userAgent.WEBKIT;
m.userAgent.determinePlatform_ = function () {
  var a = m.userAgent.getNavigatorTyped();
  return (a && a.platform) || "";
};
m.userAgent.PLATFORM = m.userAgent.determinePlatform_();
m.userAgent.ASSUME_MAC = !1;
m.userAgent.ASSUME_WINDOWS = !1;
m.userAgent.ASSUME_LINUX = !1;
m.userAgent.ASSUME_X11 = !1;
m.userAgent.ASSUME_ANDROID = !1;
m.userAgent.ASSUME_IPHONE = !1;
m.userAgent.ASSUME_IPAD = !1;
m.userAgent.ASSUME_IPOD = !1;
m.userAgent.ASSUME_KAIOS = !1;
m.userAgent.PLATFORM_KNOWN_ =
  m.userAgent.ASSUME_MAC ||
  m.userAgent.ASSUME_WINDOWS ||
  m.userAgent.ASSUME_LINUX ||
  m.userAgent.ASSUME_X11 ||
  m.userAgent.ASSUME_ANDROID ||
  m.userAgent.ASSUME_IPHONE ||
  m.userAgent.ASSUME_IPAD ||
  m.userAgent.ASSUME_IPOD;
m.userAgent.MAC = m.userAgent.PLATFORM_KNOWN_
  ? m.userAgent.ASSUME_MAC
  : m.labs.userAgent.platform.isMacintosh();
m.userAgent.WINDOWS = m.userAgent.PLATFORM_KNOWN_
  ? m.userAgent.ASSUME_WINDOWS
  : m.labs.userAgent.platform.isWindows();
m.userAgent.isLegacyLinux_ = function () {
  return (
    m.labs.userAgent.platform.isLinux() ||
    m.labs.userAgent.platform.isChromeOS()
  );
};
m.userAgent.LINUX = m.userAgent.PLATFORM_KNOWN_
  ? m.userAgent.ASSUME_LINUX
  : m.userAgent.isLegacyLinux_();
m.userAgent.isX11_ = function () {
  var a = m.userAgent.getNavigatorTyped();
  return !!a && m.string.contains(a.appVersion || "", "X11");
};
m.userAgent.X11 = m.userAgent.PLATFORM_KNOWN_
  ? m.userAgent.ASSUME_X11
  : m.userAgent.isX11_();
m.userAgent.ANDROID = m.userAgent.PLATFORM_KNOWN_
  ? m.userAgent.ASSUME_ANDROID
  : m.labs.userAgent.platform.isAndroid();
m.userAgent.IPHONE = m.userAgent.PLATFORM_KNOWN_
  ? m.userAgent.ASSUME_IPHONE
  : m.labs.userAgent.platform.isIphone();
m.userAgent.IPAD = m.userAgent.PLATFORM_KNOWN_
  ? m.userAgent.ASSUME_IPAD
  : m.labs.userAgent.platform.isIpad();
m.userAgent.IPOD = m.userAgent.PLATFORM_KNOWN_
  ? m.userAgent.ASSUME_IPOD
  : m.labs.userAgent.platform.isIpod();
m.userAgent.IOS = m.userAgent.PLATFORM_KNOWN_
  ? m.userAgent.ASSUME_IPHONE ||
    m.userAgent.ASSUME_IPAD ||
    m.userAgent.ASSUME_IPOD
  : m.labs.userAgent.platform.isIos();
m.userAgent.KAIOS = m.userAgent.PLATFORM_KNOWN_
  ? m.userAgent.ASSUME_KAIOS
  : m.labs.userAgent.platform.isKaiOS();
m.userAgent.determineVersion_ = function () {
  var a = "",
    c = m.userAgent.getVersionRegexResult_();
  c && (a = c ? c[1] : "");
  return m.userAgent.IE &&
    ((c = m.userAgent.getDocumentMode_()), null != c && c > parseFloat(a))
    ? String(c)
    : a;
};
m.userAgent.getVersionRegexResult_ = function () {
  var a = m.userAgent.getUserAgentString();
  if (m.userAgent.GECKO) return /rv:([^\);]+)(\)|;)/.exec(a);
  if (m.userAgent.EDGE) return /Edge\/([\d\.]+)/.exec(a);
  if (m.userAgent.IE) return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);
  if (m.userAgent.WEBKIT) return /WebKit\/(\S+)/.exec(a);
  if (m.userAgent.OPERA) return /(?:Version)[ \/]?(\S+)/.exec(a);
};
m.userAgent.getDocumentMode_ = function () {
  var a = m.global.document;
  return a ? a.documentMode : void 0;
};
m.userAgent.VERSION = m.userAgent.determineVersion_();
m.userAgent.compare = function (a, c) {
  return m.string.compareVersions(a, c);
};
m.userAgent.isVersionOrHigherCache_ = {};
m.userAgent.isVersionOrHigher = function (a) {
  return (
    m.userAgent.ASSUME_ANY_VERSION ||
    m.reflect.cache(m.userAgent.isVersionOrHigherCache_, a, function () {
      return 0 <= m.string.compareVersions(m.userAgent.VERSION, a);
    })
  );
};
m.userAgent.isVersion = m.userAgent.isVersionOrHigher;
m.userAgent.isDocumentModeOrHigher = function (a) {
  return Number(m.userAgent.DOCUMENT_MODE) >= a;
};
m.userAgent.isDocumentMode = m.userAgent.isDocumentModeOrHigher;
var Da;
if (m.global.document && m.userAgent.IE) {
  var Ea = m.userAgent.getDocumentMode_();
  Da = Ea ? Ea : parseInt(m.userAgent.VERSION, 10) || void 0;
} else Da = void 0;
m.userAgent.DOCUMENT_MODE = Da;
m.debug.LOGGING_ENABLED = m.DEBUG;
m.debug.FORCE_SLOPPY_STACKS = !1;
m.debug.CHECK_FOR_THROWN_EVENT = !1;
m.debug.catchErrors = function (a, c, d) {
  d = d || m.global;
  var e = d.onerror,
    f = !!c;
  m.userAgent.WEBKIT && !m.userAgent.isVersionOrHigher("535.3") && (f = !f);
  d.onerror = function (g, h, l, n, p) {
    e && e(g, h, l, n, p);
    a({ message: g, fileName: h, line: l, lineNumber: l, col: n, error: p });
    return f;
  };
};
m.debug.expose = function (a, c) {
  if ("undefined" == typeof a) return "undefined";
  if (null == a) return "NULL";
  var d = [],
    e;
  for (e in a)
    if (c || "function" !== typeof a[e]) {
      var f = e + " = ";
      try {
        f += a[e];
      } catch (g) {
        f += "*** " + g + " ***";
      }
      d.push(f);
    }
  return d.join("\n");
};
m.debug.deepExpose = function (a, c) {
  var d = [],
    e = [],
    f = {},
    g = function (h, l) {
      var n = l + "  ";
      try {
        if (void 0 === h) d.push("undefined");
        else if (null === h) d.push("NULL");
        else if ("string" === typeof h)
          d.push('"' + h.replace(/\n/g, "\n" + l) + '"');
        else if ("function" === typeof h)
          d.push(String(h).replace(/\n/g, "\n" + l));
        else if (m.isObject(h)) {
          m.hasUid(h) || e.push(h);
          var p = m.getUid(h);
          if (f[p]) d.push("*** reference loop detected (id=" + p + ") ***");
          else {
            f[p] = !0;
            d.push("{");
            for (var v in h)
              if (c || "function" !== typeof h[v])
                d.push("\n"), d.push(n), d.push(v + " = "), g(h[v], n);
            d.push("\n" + l + "}");
            delete f[p];
          }
        } else d.push(h);
      } catch (W) {
        d.push("*** " + W + " ***");
      }
    };
  g(a, "");
  for (a = 0; a < e.length; a++) m.removeUid(e[a]);
  return d.join("");
};
m.debug.exposeArray = function (a) {
  for (var c = [], d = 0; d < a.length; d++)
    Array.isArray(a[d]) ? c.push(m.debug.exposeArray(a[d])) : c.push(a[d]);
  return "[ " + c.join(", ") + " ]";
};
m.debug.normalizeErrorObject = function (a) {
  var c = m.getObjectByName("window.location.href");
  null == a && (a = 'Unknown Error of type "null/undefined"');
  if ("string" === typeof a)
    return {
      message: a,
      name: "Unknown error",
      lineNumber: "Not available",
      fileName: c,
      stack: "Not available",
    };
  var d = !1;
  try {
    var e = a.lineNumber || a.line || "Not available";
  } catch (h) {
    (e = "Not available"), (d = !0);
  }
  try {
    var f =
      a.fileName || a.filename || a.sourceURL || m.global.$googDebugFname || c;
  } catch (h) {
    (f = "Not available"), (d = !0);
  }
  c = m.debug.serializeErrorStack_(a);
  if (!(!d && a.lineNumber && a.fileName && a.stack && a.message && a.name)) {
    d = a.message;
    if (null == d) {
      if (a.constructor && a.constructor instanceof Function) {
        var g = a.constructor.name
          ? a.constructor.name
          : m.debug.getFunctionName(a.constructor);
        d = 'Unknown Error of type "' + g + '"';
        if (m.debug.CHECK_FOR_THROWN_EVENT && "Event" == g)
          try {
            d = d + ' with Event.type "' + (a.type || "") + '"';
          } catch (h) {}
      } else d = "Unknown Error of unknown type";
      "function" === typeof a.toString &&
        Object.prototype.toString !== a.toString &&
        (d += ": " + a.toString());
    }
    return {
      message: d,
      name: a.name || "UnknownError",
      lineNumber: e,
      fileName: f,
      stack: c || "Not available",
    };
  }
  a.stack = c;
  return a;
};
m.debug.serializeErrorStack_ = function (a, c) {
  c || (c = {});
  c[m.debug.serializeErrorAsKey_(a)] = !0;
  var d = a.stack || "";
  (a = a.cause) &&
    !c[m.debug.serializeErrorAsKey_(a)] &&
    ((d += "\nCaused by: "),
    (a.stack && 0 == a.stack.indexOf(a.toString())) ||
      (d += "string" === typeof a ? a : a.message + "\n"),
    (d += m.debug.serializeErrorStack_(a, c)));
  return d;
};
m.debug.serializeErrorAsKey_ = function (a) {
  var c = "";
  "function" === typeof a.toString && (c = "" + a);
  return c + a.stack;
};
m.debug.enhanceError = function (a, c) {
  a instanceof Error ||
    ((a = Error(a)),
    Error.captureStackTrace &&
      Error.captureStackTrace(a, m.debug.enhanceError));
  a.stack || (a.stack = m.debug.getStacktrace(m.debug.enhanceError));
  if (c) {
    for (var d = 0; a["message" + d]; ) ++d;
    a["message" + d] = String(c);
  }
  return a;
};
m.debug.enhanceErrorWithContext = function (a, c) {
  a = m.debug.enhanceError(a);
  if (c) for (var d in c) m.debug.errorcontext.addErrorContext(a, d, c[d]);
  return a;
};
m.debug.getStacktraceSimple = function (a) {
  if (!m.debug.FORCE_SLOPPY_STACKS) {
    var c = m.debug.getNativeStackTrace_(m.debug.getStacktraceSimple);
    if (c) return c;
  }
  c = [];
  for (var d = arguments.callee.caller, e = 0; d && (!a || e < a); ) {
    c.push(m.debug.getFunctionName(d));
    c.push("()\n");
    try {
      d = d.caller;
    } catch (f) {
      c.push("[exception trying to get caller]\n");
      break;
    }
    e++;
    if (e >= m.debug.MAX_STACK_DEPTH) {
      c.push("[...long stack...]");
      break;
    }
  }
  a && e >= a ? c.push("[...reached max depth limit...]") : c.push("[end]");
  return c.join("");
};
m.debug.MAX_STACK_DEPTH = 50;
m.debug.getNativeStackTrace_ = function (a) {
  var c = Error();
  if (Error.captureStackTrace)
    return Error.captureStackTrace(c, a), String(c.stack);
  try {
    throw c;
  } catch (d) {
    c = d;
  }
  return (a = c.stack) ? String(a) : null;
};
m.debug.getStacktrace = function (a) {
  var c;
  m.debug.FORCE_SLOPPY_STACKS ||
    (c = m.debug.getNativeStackTrace_(a || m.debug.getStacktrace));
  c || (c = m.debug.getStacktraceHelper_(a || arguments.callee.caller, []));
  return c;
};
m.debug.getStacktraceHelper_ = function (a, c) {
  var d = [];
  if (y(c, a)) d.push("[...circular reference...]");
  else if (a && c.length < m.debug.MAX_STACK_DEPTH) {
    d.push(m.debug.getFunctionName(a) + "(");
    for (var e = a.arguments, f = 0; e && f < e.length; f++) {
      0 < f && d.push(", ");
      var g = e[f];
      switch (typeof g) {
        case "object":
          g = g ? "object" : "null";
          break;
        case "string":
          break;
        case "number":
          g = String(g);
          break;
        case "boolean":
          g = g ? "true" : "false";
          break;
        case "function":
          g = (g = m.debug.getFunctionName(g)) ? g : "[fn]";
          break;
        default:
          g = typeof g;
      }
      40 < g.length && (g = g.substr(0, 40) + "...");
      d.push(g);
    }
    c.push(a);
    d.push(")\n");
    try {
      d.push(m.debug.getStacktraceHelper_(a.caller, c));
    } catch (h) {
      d.push("[exception trying to get caller]\n");
    }
  } else a ? d.push("[...long stack...]") : d.push("[end]");
  return d.join("");
};
m.debug.getFunctionName = function (a) {
  if (m.debug.fnNameCache_[a]) return m.debug.fnNameCache_[a];
  a = String(a);
  if (!m.debug.fnNameCache_[a]) {
    var c = /function\s+([^\(]+)/m.exec(a);
    m.debug.fnNameCache_[a] = c ? c[1] : "[Anonymous]";
  }
  return m.debug.fnNameCache_[a];
};
m.debug.makeWhitespaceVisible = function (a) {
  return a
    .replace(/ /g, "[_]")
    .replace(/\f/g, "[f]")
    .replace(/\n/g, "[n]\n")
    .replace(/\r/g, "[r]")
    .replace(/\t/g, "[t]");
};
m.debug.runtimeType = function (a) {
  return a instanceof Function
    ? a.displayName || a.name || "unknown type name"
    : a instanceof Object
    ? a.constructor.displayName ||
      a.constructor.name ||
      Object.prototype.toString.call(a)
    : null === a
    ? "null"
    : typeof a;
};
m.debug.fnNameCache_ = {};
m.debug.freezeInternal_ =
  (m.DEBUG && Object.freeze) ||
  function (a) {
    return a;
  };
m.debug.freeze = function (a) {
  return m.debug.freezeInternal_(a);
};
m.debug.entryPointRegistry = {};
m.debug.EntryPointMonitor = function () {};
m.debug.entryPointRegistry.refList_ = [];
m.debug.entryPointRegistry.monitors_ = [];
m.debug.entryPointRegistry.monitorsMayExist_ = !1;
m.debug.entryPointRegistry.register = function (a) {
  m.debug.entryPointRegistry.refList_[
    m.debug.entryPointRegistry.refList_.length
  ] = a;
  if (m.debug.entryPointRegistry.monitorsMayExist_)
    for (var c = m.debug.entryPointRegistry.monitors_, d = 0; d < c.length; d++)
      a(m.bind(c[d].wrap, c[d]));
};
m.debug.entryPointRegistry.monitorAll = function (a) {
  m.debug.entryPointRegistry.monitorsMayExist_ = !0;
  for (
    var c = m.bind(a.wrap, a), d = 0;
    d < m.debug.entryPointRegistry.refList_.length;
    d++
  )
    m.debug.entryPointRegistry.refList_[d](c);
  m.debug.entryPointRegistry.monitors_.push(a);
};
m.debug.entryPointRegistry.unmonitorAllIfPossible = function (a) {
  var c = m.debug.entryPointRegistry.monitors_;
  m.asserts.assert(
    a == c[c.length - 1],
    "Only the most recent monitor can be unwrapped."
  );
  a = m.bind(a.unwrap, a);
  for (var d = 0; d < m.debug.entryPointRegistry.refList_.length; d++)
    m.debug.entryPointRegistry.refList_[d](a);
  c.length--;
};
function Fa(a) {
  a && "function" == typeof a.dispose && a.dispose();
}
m.dispose = Fa;
function Ga(a) {
  for (var c = 0, d = arguments.length; c < d; ++c) {
    var e = arguments[c];
    m.isArrayLike(e) ? Ga.apply(null, e) : Fa(e);
  }
}
m.disposeAll = Ga;
m.disposable = {};
m.disposable.IDisposable = function () {};
m.Disposable = function () {
  m.Disposable.MONITORING_MODE != m.Disposable.MonitoringMode.OFF &&
    (m.Disposable.instances_[m.getUid(this)] = this);
  this.disposed_ = this.disposed_;
  this.onDisposeCallbacks_ = this.onDisposeCallbacks_;
};
m.Disposable.MonitoringMode = { OFF: 0, PERMANENT: 1, INTERACTIVE: 2 };
m.Disposable.MONITORING_MODE = 0;
m.Disposable.INCLUDE_STACK_ON_CREATION = !0;
m.Disposable.instances_ = {};
m.Disposable.getUndisposedObjects = function () {
  var a = [],
    c;
  for (c in m.Disposable.instances_)
    m.Disposable.instances_.hasOwnProperty(c) &&
      a.push(m.Disposable.instances_[Number(c)]);
  return a;
};
m.Disposable.clearUndisposedObjects = function () {
  m.Disposable.instances_ = {};
};
m.Disposable.prototype.disposed_ = !1;
m.Disposable.prototype.isDisposed = function () {
  return this.disposed_;
};
m.Disposable.prototype.dispose = function () {
  if (
    !this.disposed_ &&
    ((this.disposed_ = !0),
    this.disposeInternal(),
    m.Disposable.MONITORING_MODE != m.Disposable.MonitoringMode.OFF)
  ) {
    var a = m.getUid(this);
    if (
      m.Disposable.MONITORING_MODE == m.Disposable.MonitoringMode.PERMANENT &&
      !m.Disposable.instances_.hasOwnProperty(a)
    )
      throw Error(
        this +
          " did not call the goog.Disposable base constructor or was disposed of after a clearUndisposedObjects call"
      );
    if (
      m.Disposable.MONITORING_MODE != m.Disposable.MonitoringMode.OFF &&
      this.onDisposeCallbacks_ &&
      0 < this.onDisposeCallbacks_.length
    )
      throw Error(
        this +
          " did not empty its onDisposeCallbacks queue. This probably means it overrode dispose() or disposeInternal() without calling the superclass' method."
      );
    delete m.Disposable.instances_[a];
  }
};
m.Disposable.prototype.disposeInternal = function () {
  if (this.onDisposeCallbacks_)
    for (; this.onDisposeCallbacks_.length; )
      this.onDisposeCallbacks_.shift()();
};
m.Disposable.isDisposed = function () {
  return !1;
};
m.events = {};
m.events.BrowserFeature = {
  HAS_W3C_BUTTON: !m.userAgent.IE || m.userAgent.isDocumentModeOrHigher(9),
  HAS_W3C_EVENT_SUPPORT:
    !m.userAgent.IE || m.userAgent.isDocumentModeOrHigher(9),
  SET_KEY_CODE_TO_PREVENT_DEFAULT:
    m.userAgent.IE && !m.userAgent.isVersionOrHigher("9"),
  HAS_NAVIGATOR_ONLINE_PROPERTY:
    !m.userAgent.WEBKIT || m.userAgent.isVersionOrHigher("528"),
  HAS_HTML5_NETWORK_EVENT_SUPPORT:
    (m.userAgent.GECKO && m.userAgent.isVersionOrHigher("1.9b")) ||
    (m.userAgent.IE && m.userAgent.isVersionOrHigher("8")) ||
    (m.userAgent.OPERA && m.userAgent.isVersionOrHigher("9.5")) ||
    (m.userAgent.WEBKIT && m.userAgent.isVersionOrHigher("528")),
  HTML5_NETWORK_EVENTS_FIRE_ON_BODY:
    (m.userAgent.GECKO && !m.userAgent.isVersionOrHigher("8")) ||
    (m.userAgent.IE && !m.userAgent.isVersionOrHigher("9")),
  TOUCH_ENABLED:
    "ontouchstart" in m.global ||
    !!(
      m.global.document &&
      document.documentElement &&
      "ontouchstart" in document.documentElement
    ) ||
    !(
      !m.global.navigator ||
      (!m.global.navigator.maxTouchPoints &&
        !m.global.navigator.msMaxTouchPoints)
    ),
  POINTER_EVENTS: "PointerEvent" in m.global,
  MSPOINTER_EVENTS:
    "MSPointerEvent" in m.global &&
    !(!m.global.navigator || !m.global.navigator.msPointerEnabled),
  PASSIVE_EVENTS: (function () {
    if (!m.global.addEventListener || !Object.defineProperty) return !1;
    var a = !1,
      c = Object.defineProperty({}, "passive", {
        get: function () {
          a = !0;
        },
      });
    try {
      m.global.addEventListener("test", m.nullFunction, c),
        m.global.removeEventListener("test", m.nullFunction, c);
    } catch (d) {}
    return a;
  })(),
};
m.events.EventId = function (a) {
  this.id = a;
};
m.events.EventId.prototype.toString = function () {
  return this.id;
};
m.events.Event = function (a, c) {
  this.type = a instanceof m.events.EventId ? String(a) : a;
  this.currentTarget = this.target = c;
  this.defaultPrevented = this.propagationStopped_ = !1;
};
m.events.Event.prototype.stopPropagation = function () {
  this.propagationStopped_ = !0;
};
m.events.Event.prototype.preventDefault = function () {
  this.defaultPrevented = !0;
};
m.events.Event.stopPropagation = function (a) {
  a.stopPropagation();
};
m.events.Event.preventDefault = function (a) {
  a.preventDefault();
};
m.events.getVendorPrefixedName_ = function (a) {
  return m.userAgent.WEBKIT
    ? "webkit" + a
    : m.userAgent.OPERA
    ? "o" + a.toLowerCase()
    : a.toLowerCase();
};
m.events.EventType = {
  CLICK: "click",
  RIGHTCLICK: "rightclick",
  DBLCLICK: "dblclick",
  AUXCLICK: "auxclick",
  MOUSEDOWN: "mousedown",
  MOUSEUP: "mouseup",
  MOUSEOVER: "mouseover",
  MOUSEOUT: "mouseout",
  MOUSEMOVE: "mousemove",
  MOUSEENTER: "mouseenter",
  MOUSELEAVE: "mouseleave",
  MOUSECANCEL: "mousecancel",
  SELECTIONCHANGE: "selectionchange",
  SELECTSTART: "selectstart",
  WHEEL: "wheel",
  KEYPRESS: "keypress",
  KEYDOWN: "keydown",
  KEYUP: "keyup",
  BLUR: "blur",
  FOCUS: "focus",
  DEACTIVATE: "deactivate",
  FOCUSIN: "focusin",
  FOCUSOUT: "focusout",
  CHANGE: "change",
  RESET: "reset",
  SELECT: "select",
  SUBMIT: "submit",
  INPUT: "input",
  PROPERTYCHANGE: "propertychange",
  DRAGSTART: "dragstart",
  DRAG: "drag",
  DRAGENTER: "dragenter",
  DRAGOVER: "dragover",
  DRAGLEAVE: "dragleave",
  DROP: "drop",
  DRAGEND: "dragend",
  TOUCHSTART: "touchstart",
  TOUCHMOVE: "touchmove",
  TOUCHEND: "touchend",
  TOUCHCANCEL: "touchcancel",
  BEFOREUNLOAD: "beforeunload",
  CONSOLEMESSAGE: "consolemessage",
  CONTEXTMENU: "contextmenu",
  DEVICECHANGE: "devicechange",
  DEVICEMOTION: "devicemotion",
  DEVICEORIENTATION: "deviceorientation",
  DOMCONTENTLOADED: "DOMContentLoaded",
  ERROR: "error",
  HELP: "help",
  LOAD: "load",
  LOSECAPTURE: "losecapture",
  ORIENTATIONCHANGE: "orientationchange",
  READYSTATECHANGE: "readystatechange",
  RESIZE: "resize",
  SCROLL: "scroll",
  UNLOAD: "unload",
  CANPLAY: "canplay",
  CANPLAYTHROUGH: "canplaythrough",
  DURATIONCHANGE: "durationchange",
  EMPTIED: "emptied",
  ENDED: "ended",
  LOADEDDATA: "loadeddata",
  LOADEDMETADATA: "loadedmetadata",
  PAUSE: "pause",
  PLAY: "play",
  PLAYING: "playing",
  PROGRESS: "progress",
  RATECHANGE: "ratechange",
  SEEKED: "seeked",
  SEEKING: "seeking",
  STALLED: "stalled",
  SUSPEND: "suspend",
  TIMEUPDATE: "timeupdate",
  VOLUMECHANGE: "volumechange",
  WAITING: "waiting",
  SOURCEOPEN: "sourceopen",
  SOURCEENDED: "sourceended",
  SOURCECLOSED: "sourceclosed",
  ABORT: "abort",
  UPDATE: "update",
  UPDATESTART: "updatestart",
  UPDATEEND: "updateend",
  HASHCHANGE: "hashchange",
  PAGEHIDE: "pagehide",
  PAGESHOW: "pageshow",
  POPSTATE: "popstate",
  COPY: "copy",
  PASTE: "paste",
  CUT: "cut",
  BEFORECOPY: "beforecopy",
  BEFORECUT: "beforecut",
  BEFOREPASTE: "beforepaste",
  ONLINE: "online",
  OFFLINE: "offline",
  MESSAGE: "message",
  CONNECT: "connect",
  INSTALL: "install",
  ACTIVATE: "activate",
  FETCH: "fetch",
  FOREIGNFETCH: "foreignfetch",
  MESSAGEERROR: "messageerror",
  STATECHANGE: "statechange",
  UPDATEFOUND: "updatefound",
  CONTROLLERCHANGE: "controllerchange",
  ANIMATIONSTART: m.events.getVendorPrefixedName_("AnimationStart"),
  ANIMATIONEND: m.events.getVendorPrefixedName_("AnimationEnd"),
  ANIMATIONITERATION: m.events.getVendorPrefixedName_("AnimationIteration"),
  TRANSITIONEND: m.events.getVendorPrefixedName_("TransitionEnd"),
  POINTERDOWN: "pointerdown",
  POINTERUP: "pointerup",
  POINTERCANCEL: "pointercancel",
  POINTERMOVE: "pointermove",
  POINTEROVER: "pointerover",
  POINTEROUT: "pointerout",
  POINTERENTER: "pointerenter",
  POINTERLEAVE: "pointerleave",
  GOTPOINTERCAPTURE: "gotpointercapture",
  LOSTPOINTERCAPTURE: "lostpointercapture",
  MSGESTURECHANGE: "MSGestureChange",
  MSGESTUREEND: "MSGestureEnd",
  MSGESTUREHOLD: "MSGestureHold",
  MSGESTURESTART: "MSGestureStart",
  MSGESTURETAP: "MSGestureTap",
  MSGOTPOINTERCAPTURE: "MSGotPointerCapture",
  MSINERTIASTART: "MSInertiaStart",
  MSLOSTPOINTERCAPTURE: "MSLostPointerCapture",
  MSPOINTERCANCEL: "MSPointerCancel",
  MSPOINTERDOWN: "MSPointerDown",
  MSPOINTERENTER: "MSPointerEnter",
  MSPOINTERHOVER: "MSPointerHover",
  MSPOINTERLEAVE: "MSPointerLeave",
  MSPOINTERMOVE: "MSPointerMove",
  MSPOINTEROUT: "MSPointerOut",
  MSPOINTEROVER: "MSPointerOver",
  MSPOINTERUP: "MSPointerUp",
  TEXT: "text",
  TEXTINPUT: m.userAgent.IE ? "textinput" : "textInput",
  COMPOSITIONSTART: "compositionstart",
  COMPOSITIONUPDATE: "compositionupdate",
  COMPOSITIONEND: "compositionend",
  BEFOREINPUT: "beforeinput",
  EXIT: "exit",
  LOADABORT: "loadabort",
  LOADCOMMIT: "loadcommit",
  LOADREDIRECT: "loadredirect",
  LOADSTART: "loadstart",
  LOADSTOP: "loadstop",
  RESPONSIVE: "responsive",
  SIZECHANGED: "sizechanged",
  UNRESPONSIVE: "unresponsive",
  VISIBILITYCHANGE: "visibilitychange",
  STORAGE: "storage",
  DOMSUBTREEMODIFIED: "DOMSubtreeModified",
  DOMNODEINSERTED: "DOMNodeInserted",
  DOMNODEREMOVED: "DOMNodeRemoved",
  DOMNODEREMOVEDFROMDOCUMENT: "DOMNodeRemovedFromDocument",
  DOMNODEINSERTEDINTODOCUMENT: "DOMNodeInsertedIntoDocument",
  DOMATTRMODIFIED: "DOMAttrModified",
  DOMCHARACTERDATAMODIFIED: "DOMCharacterDataModified",
  BEFOREPRINT: "beforeprint",
  AFTERPRINT: "afterprint",
  BEFOREINSTALLPROMPT: "beforeinstallprompt",
  APPINSTALLED: "appinstalled",
};
m.events.getPointerFallbackEventName_ = function (a, c, d) {
  return m.events.BrowserFeature.POINTER_EVENTS
    ? a
    : m.events.BrowserFeature.MSPOINTER_EVENTS
    ? c
    : d;
};
m.events.PointerFallbackEventType = {
  POINTERDOWN: m.events.getPointerFallbackEventName_(
    m.events.EventType.POINTERDOWN,
    m.events.EventType.MSPOINTERDOWN,
    m.events.EventType.MOUSEDOWN
  ),
  POINTERUP: m.events.getPointerFallbackEventName_(
    m.events.EventType.POINTERUP,
    m.events.EventType.MSPOINTERUP,
    m.events.EventType.MOUSEUP
  ),
  POINTERCANCEL: m.events.getPointerFallbackEventName_(
    m.events.EventType.POINTERCANCEL,
    m.events.EventType.MSPOINTERCANCEL,
    m.events.EventType.MOUSECANCEL
  ),
  POINTERMOVE: m.events.getPointerFallbackEventName_(
    m.events.EventType.POINTERMOVE,
    m.events.EventType.MSPOINTERMOVE,
    m.events.EventType.MOUSEMOVE
  ),
  POINTEROVER: m.events.getPointerFallbackEventName_(
    m.events.EventType.POINTEROVER,
    m.events.EventType.MSPOINTEROVER,
    m.events.EventType.MOUSEOVER
  ),
  POINTEROUT: m.events.getPointerFallbackEventName_(
    m.events.EventType.POINTEROUT,
    m.events.EventType.MSPOINTEROUT,
    m.events.EventType.MOUSEOUT
  ),
  POINTERENTER: m.events.getPointerFallbackEventName_(
    m.events.EventType.POINTERENTER,
    m.events.EventType.MSPOINTERENTER,
    m.events.EventType.MOUSEENTER
  ),
  POINTERLEAVE: m.events.getPointerFallbackEventName_(
    m.events.EventType.POINTERLEAVE,
    m.events.EventType.MSPOINTERLEAVE,
    m.events.EventType.MOUSELEAVE
  ),
};
m.events.PointerTouchFallbackEventType = {
  POINTERDOWN: m.events.getPointerFallbackEventName_(
    m.events.EventType.POINTERDOWN,
    m.events.EventType.MSPOINTERDOWN,
    m.events.EventType.TOUCHSTART
  ),
  POINTERUP: m.events.getPointerFallbackEventName_(
    m.events.EventType.POINTERUP,
    m.events.EventType.MSPOINTERUP,
    m.events.EventType.TOUCHEND
  ),
  POINTERCANCEL: m.events.getPointerFallbackEventName_(
    m.events.EventType.POINTERCANCEL,
    m.events.EventType.MSPOINTERCANCEL,
    m.events.EventType.TOUCHCANCEL
  ),
  POINTERMOVE: m.events.getPointerFallbackEventName_(
    m.events.EventType.POINTERMOVE,
    m.events.EventType.MSPOINTERMOVE,
    m.events.EventType.TOUCHMOVE
  ),
};
m.events.PointerAsMouseEventType = {
  MOUSEDOWN: m.events.PointerFallbackEventType.POINTERDOWN,
  MOUSEUP: m.events.PointerFallbackEventType.POINTERUP,
  MOUSECANCEL: m.events.PointerFallbackEventType.POINTERCANCEL,
  MOUSEMOVE: m.events.PointerFallbackEventType.POINTERMOVE,
  MOUSEOVER: m.events.PointerFallbackEventType.POINTEROVER,
  MOUSEOUT: m.events.PointerFallbackEventType.POINTEROUT,
  MOUSEENTER: m.events.PointerFallbackEventType.POINTERENTER,
  MOUSELEAVE: m.events.PointerFallbackEventType.POINTERLEAVE,
};
m.events.MouseAsMouseEventType = {
  MOUSEDOWN: m.events.EventType.MOUSEDOWN,
  MOUSEUP: m.events.EventType.MOUSEUP,
  MOUSECANCEL: m.events.EventType.MOUSECANCEL,
  MOUSEMOVE: m.events.EventType.MOUSEMOVE,
  MOUSEOVER: m.events.EventType.MOUSEOVER,
  MOUSEOUT: m.events.EventType.MOUSEOUT,
  MOUSEENTER: m.events.EventType.MOUSEENTER,
  MOUSELEAVE: m.events.EventType.MOUSELEAVE,
};
m.events.PointerAsTouchEventType = {
  TOUCHCANCEL: m.events.PointerTouchFallbackEventType.POINTERCANCEL,
  TOUCHEND: m.events.PointerTouchFallbackEventType.POINTERUP,
  TOUCHMOVE: m.events.PointerTouchFallbackEventType.POINTERMOVE,
  TOUCHSTART: m.events.PointerTouchFallbackEventType.POINTERDOWN,
};
m.events.USE_LAYER_XY_AS_OFFSET_XY = !1;
m.events.BrowserEvent = function (a, c) {
  m.events.Event.call(this, a ? a.type : "");
  this.relatedTarget = this.currentTarget = this.target = null;
  this.button =
    this.screenY =
    this.screenX =
    this.clientY =
    this.clientX =
    this.offsetY =
    this.offsetX =
      0;
  this.key = "";
  this.charCode = this.keyCode = 0;
  this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
  this.state = null;
  this.pointerId = 0;
  this.pointerType = "";
  this.event_ = null;
  if (a) {
    var d = (this.type = a.type),
      e =
        a.changedTouches && a.changedTouches.length
          ? a.changedTouches[0]
          : null;
    this.target = a.target || a.srcElement;
    this.currentTarget = c;
    (c = a.relatedTarget)
      ? m.userAgent.GECKO && (m.reflect.canAccessProperty(c) || (c = null))
      : d == m.events.EventType.MOUSEOVER
      ? (c = a.fromElement)
      : d == m.events.EventType.MOUSEOUT && (c = a.toElement);
    this.relatedTarget = c;
    e
      ? ((this.clientX = void 0 !== e.clientX ? e.clientX : e.pageX),
        (this.clientY = void 0 !== e.clientY ? e.clientY : e.pageY),
        (this.screenX = e.screenX || 0),
        (this.screenY = e.screenY || 0))
      : (m.events.USE_LAYER_XY_AS_OFFSET_XY
          ? ((this.offsetX = void 0 !== a.layerX ? a.layerX : a.offsetX),
            (this.offsetY = void 0 !== a.layerY ? a.layerY : a.offsetY))
          : ((this.offsetX =
              m.userAgent.WEBKIT || void 0 !== a.offsetX
                ? a.offsetX
                : a.layerX),
            (this.offsetY =
              m.userAgent.WEBKIT || void 0 !== a.offsetY
                ? a.offsetY
                : a.layerY)),
        (this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX),
        (this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY),
        (this.screenX = a.screenX || 0),
        (this.screenY = a.screenY || 0));
    this.button = a.button;
    this.keyCode = a.keyCode || 0;
    this.key = a.key || "";
    this.charCode = a.charCode || ("keypress" == d ? a.keyCode : 0);
    this.ctrlKey = a.ctrlKey;
    this.altKey = a.altKey;
    this.shiftKey = a.shiftKey;
    this.metaKey = a.metaKey;
    this.pointerId = a.pointerId || 0;
    this.pointerType = m.events.BrowserEvent.getPointerType_(a);
    this.state = a.state;
    this.event_ = a;
    a.defaultPrevented &&
      m.events.BrowserEvent.superClass_.preventDefault.call(this);
  }
};
m.inherits(m.events.BrowserEvent, m.events.Event);
m.events.BrowserEvent.MouseButton = { LEFT: 0, MIDDLE: 1, RIGHT: 2 };
m.events.BrowserEvent.PointerType = {
  MOUSE: "mouse",
  PEN: "pen",
  TOUCH: "touch",
};
m.events.BrowserEvent.IEButtonMap = m.debug.freeze([1, 4, 2]);
m.events.BrowserEvent.IE_BUTTON_MAP = m.events.BrowserEvent.IEButtonMap;
m.events.BrowserEvent.IE_POINTER_TYPE_MAP = m.debug.freeze({
  2: m.events.BrowserEvent.PointerType.TOUCH,
  3: m.events.BrowserEvent.PointerType.PEN,
  4: m.events.BrowserEvent.PointerType.MOUSE,
});
m.events.BrowserEvent.prototype.stopPropagation = function () {
  m.events.BrowserEvent.superClass_.stopPropagation.call(this);
  this.event_.stopPropagation
    ? this.event_.stopPropagation()
    : (this.event_.cancelBubble = !0);
};
m.events.BrowserEvent.prototype.preventDefault = function () {
  m.events.BrowserEvent.superClass_.preventDefault.call(this);
  var a = this.event_;
  if (a.preventDefault) a.preventDefault();
  else if (
    ((a.returnValue = !1),
    m.events.BrowserFeature.SET_KEY_CODE_TO_PREVENT_DEFAULT)
  )
    try {
      if (a.ctrlKey || (112 <= a.keyCode && 123 >= a.keyCode)) a.keyCode = -1;
    } catch (c) {}
};
m.events.BrowserEvent.getPointerType_ = function (a) {
  return "string" === typeof a.pointerType
    ? a.pointerType
    : m.events.BrowserEvent.IE_POINTER_TYPE_MAP[a.pointerType] || "";
};
m.events.Listenable = function () {};
m.events.Listenable.IMPLEMENTED_BY_PROP =
  "closure_listenable_" + ((1e6 * Math.random()) | 0);
m.events.Listenable.addImplementation = function (a) {
  a.prototype[m.events.Listenable.IMPLEMENTED_BY_PROP] = !0;
};
m.events.Listenable.isImplementedBy = function (a) {
  return !(!a || !a[m.events.Listenable.IMPLEMENTED_BY_PROP]);
};
b = m.events.Listenable.prototype;
b.listen = function () {};
b.listenOnce = function () {};
b.unlisten = function () {};
b.unlistenByKey = function () {};
b.dispatchEvent = function () {};
b.removeAllListeners = function () {};
b.getParentEventTarget = function () {};
b.fireListeners = function () {};
b.getListeners = function () {};
b.getListener = function () {};
b.hasListener = function () {};
m.events.ListenableKey = function () {};
m.events.ListenableKey.counter_ = 0;
m.events.ListenableKey.reserveKey = function () {
  return ++m.events.ListenableKey.counter_;
};
m.events.Listener = function (a, c, d, e, f) {
  this.listener = a;
  this.proxy = null;
  this.src = c;
  this.type = d;
  this.capture = !!e;
  this.handler = f;
  this.key = m.events.ListenableKey.reserveKey();
  this.removed = this.callOnce = !1;
};
m.events.Listener.ENABLE_MONITORING = !1;
var Ha = function (a) {
  a.removed = !0;
  a.listener = null;
  a.proxy = null;
  a.src = null;
  a.handler = null;
};
m.events.ListenerMap = function (a) {
  this.src = a;
  this.listeners = {};
  this.typeCount_ = 0;
};
m.events.ListenerMap.prototype.add = function (a, c, d, e, f) {
  var g = a.toString();
  a = this.listeners[g];
  a || ((a = this.listeners[g] = []), this.typeCount_++);
  var h = m.events.ListenerMap.findListenerIndex_(a, c, e, f);
  -1 < h
    ? ((c = a[h]), d || (c.callOnce = !1))
    : ((c = new m.events.Listener(c, this.src, g, !!e, f)),
      (c.callOnce = d),
      a.push(c));
  return c;
};
m.events.ListenerMap.prototype.remove = function (a, c, d, e) {
  a = a.toString();
  if (!(a in this.listeners)) return !1;
  var f = this.listeners[a];
  c = m.events.ListenerMap.findListenerIndex_(f, c, d, e);
  return -1 < c
    ? (Ha(f[c]),
      A(f, c),
      0 == f.length && (delete this.listeners[a], this.typeCount_--),
      !0)
    : !1;
};
var Ia = function (a, c) {
  var d = c.type;
  if (!(d in a.listeners)) return !1;
  var e = pa(a.listeners[d], c);
  e &&
    (Ha(c),
    0 == a.listeners[d].length && (delete a.listeners[d], a.typeCount_--));
  return e;
};
m.events.ListenerMap.prototype.removeAll = function (a) {
  a = a && a.toString();
  var c = 0,
    d;
  for (d in this.listeners)
    if (!a || d == a) {
      for (var e = this.listeners[d], f = 0; f < e.length; f++) ++c, Ha(e[f]);
      delete this.listeners[d];
      this.typeCount_--;
    }
  return c;
};
m.events.ListenerMap.prototype.getListeners = function (a, c) {
  a = this.listeners[a.toString()];
  var d = [];
  if (a)
    for (var e = 0; e < a.length; ++e) {
      var f = a[e];
      f.capture == c && d.push(f);
    }
  return d;
};
m.events.ListenerMap.prototype.getListener = function (a, c, d, e) {
  a = this.listeners[a.toString()];
  var f = -1;
  a && (f = m.events.ListenerMap.findListenerIndex_(a, c, d, e));
  return -1 < f ? a[f] : null;
};
m.events.ListenerMap.prototype.hasListener = function (a, c) {
  var d = void 0 !== a,
    e = d ? a.toString() : "",
    f = void 0 !== c;
  return m.object.some(this.listeners, function (g) {
    for (var h = 0; h < g.length; ++h)
      if (!((d && g[h].type != e) || (f && g[h].capture != c))) return !0;
    return !1;
  });
};
m.events.ListenerMap.findListenerIndex_ = function (a, c, d, e) {
  for (var f = 0; f < a.length; ++f) {
    var g = a[f];
    if (!g.removed && g.listener == c && g.capture == !!d && g.handler == e)
      return f;
  }
  return -1;
};
m.events.LISTENER_MAP_PROP_ = "closure_lm_" + ((1e6 * Math.random()) | 0);
m.events.onString_ = "on";
m.events.onStringMap_ = {};
m.events.CaptureSimulationMode = { OFF_AND_FAIL: 0, OFF_AND_SILENT: 1, ON: 2 };
m.events.CAPTURE_SIMULATION_MODE = 2;
m.events.listenerCountEstimate_ = 0;
m.events.listen = function (a, c, d, e, f) {
  if (e && e.once) return m.events.listenOnce(a, c, d, e, f);
  if (Array.isArray(c)) {
    for (var g = 0; g < c.length; g++) m.events.listen(a, c[g], d, e, f);
    return null;
  }
  d = m.events.wrapListener(d);
  return m.events.Listenable.isImplementedBy(a)
    ? a.listen(c, d, m.isObject(e) ? !!e.capture : !!e, f)
    : m.events.listen_(a, c, d, !1, e, f);
};
m.events.listen_ = function (a, c, d, e, f, g) {
  if (!c) throw Error("Invalid event type");
  var h = m.isObject(f) ? !!f.capture : !!f;
  if (h && !m.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    if (
      m.events.CAPTURE_SIMULATION_MODE ==
      m.events.CaptureSimulationMode.OFF_AND_FAIL
    )
      return m.asserts.fail("Can not register capture listener in IE8-."), null;
    if (
      m.events.CAPTURE_SIMULATION_MODE ==
      m.events.CaptureSimulationMode.OFF_AND_SILENT
    )
      return null;
  }
  var l = m.events.getListenerMap_(a);
  l || (a[m.events.LISTENER_MAP_PROP_] = l = new m.events.ListenerMap(a));
  d = l.add(c, d, e, h, g);
  if (d.proxy) return d;
  e = m.events.getProxy();
  d.proxy = e;
  e.src = a;
  e.listener = d;
  if (a.addEventListener)
    m.events.BrowserFeature.PASSIVE_EVENTS || (f = h),
      void 0 === f && (f = !1),
      a.addEventListener(c.toString(), e, f);
  else if (a.attachEvent) a.attachEvent(m.events.getOnString_(c.toString()), e);
  else if (a.addListener && a.removeListener)
    m.asserts.assert("change" === c, "MediaQueryList only has a change event"),
      a.addListener(e);
  else throw Error("addEventListener and attachEvent are unavailable.");
  m.events.listenerCountEstimate_++;
  return d;
};
m.events.getProxy = function () {
  var a = m.events.handleBrowserEvent_,
    c = m.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT
      ? function (d) {
          return a.call(c.src, c.listener, d);
        }
      : function (d) {
          d = a.call(c.src, c.listener, d);
          if (!d) return d;
        };
  return c;
};
m.events.listenOnce = function (a, c, d, e, f) {
  if (Array.isArray(c)) {
    for (var g = 0; g < c.length; g++) m.events.listenOnce(a, c[g], d, e, f);
    return null;
  }
  d = m.events.wrapListener(d);
  return m.events.Listenable.isImplementedBy(a)
    ? a.listenOnce(c, d, m.isObject(e) ? !!e.capture : !!e, f)
    : m.events.listen_(a, c, d, !0, e, f);
};
m.events.listenWithWrapper = function (a, c, d, e, f) {
  c.listen(a, d, e, f);
};
m.events.unlisten = function (a, c, d, e, f) {
  if (Array.isArray(c)) {
    for (var g = 0; g < c.length; g++) m.events.unlisten(a, c[g], d, e, f);
    return null;
  }
  e = m.isObject(e) ? !!e.capture : !!e;
  d = m.events.wrapListener(d);
  if (m.events.Listenable.isImplementedBy(a)) return a.unlisten(c, d, e, f);
  if (!a) return !1;
  if ((a = m.events.getListenerMap_(a)))
    if ((c = a.getListener(c, d, e, f))) return m.events.unlistenByKey(c);
  return !1;
};
m.events.unlistenByKey = function (a) {
  if ("number" === typeof a || !a || a.removed) return !1;
  var c = a.src;
  if (m.events.Listenable.isImplementedBy(c)) return c.unlistenByKey(a);
  var d = a.type,
    e = a.proxy;
  c.removeEventListener
    ? c.removeEventListener(d, e, a.capture)
    : c.detachEvent
    ? c.detachEvent(m.events.getOnString_(d), e)
    : c.addListener && c.removeListener && c.removeListener(e);
  m.events.listenerCountEstimate_--;
  (d = m.events.getListenerMap_(c))
    ? (Ia(d, a),
      0 == d.typeCount_ &&
        ((d.src = null), (c[m.events.LISTENER_MAP_PROP_] = null)))
    : Ha(a);
  return !0;
};
m.events.unlistenWithWrapper = function (a, c, d, e, f) {
  c.unlisten(a, d, e, f);
};
m.events.removeAll = function (a, c) {
  if (!a) return 0;
  if (m.events.Listenable.isImplementedBy(a)) return a.removeAllListeners(c);
  a = m.events.getListenerMap_(a);
  if (!a) return 0;
  var d = 0;
  c = c && c.toString();
  for (var e in a.listeners)
    if (!c || e == c)
      for (var f = a.listeners[e].concat(), g = 0; g < f.length; ++g)
        m.events.unlistenByKey(f[g]) && ++d;
  return d;
};
m.events.getListeners = function (a, c) {
  return m.events.Listenable.isImplementedBy(a)
    ? a.getListeners(c, void 0)
    : a
    ? (a = m.events.getListenerMap_(a))
      ? a.getListeners(c, void 0)
      : []
    : [];
};
m.events.getListener = function (a, c, d, e, f) {
  d = m.events.wrapListener(d);
  e = !!e;
  return m.events.Listenable.isImplementedBy(a)
    ? a.getListener(c, d, e, f)
    : a
    ? (a = m.events.getListenerMap_(a))
      ? a.getListener(c, d, e, f)
      : null
    : null;
};
m.events.hasListener = function (a, c, d) {
  if (m.events.Listenable.isImplementedBy(a)) return a.hasListener(c, d);
  a = m.events.getListenerMap_(a);
  return !!a && a.hasListener(c, d);
};
m.events.expose = function (a) {
  var c = [],
    d;
  for (d in a)
    a[d] && a[d].id
      ? c.push(d + " = " + a[d] + " (" + a[d].id + ")")
      : c.push(d + " = " + a[d]);
  return c.join("\n");
};
m.events.getOnString_ = function (a) {
  return a in m.events.onStringMap_
    ? m.events.onStringMap_[a]
    : (m.events.onStringMap_[a] = m.events.onString_ + a);
};
m.events.fireListeners = function (a, c, d) {
  return m.events.Listenable.isImplementedBy(a)
    ? a.fireListeners(c, d, void 0)
    : m.events.fireListeners_(a, c, d, void 0);
};
m.events.fireListeners_ = function (a, c, d, e) {
  var f = !0;
  if ((a = m.events.getListenerMap_(a)))
    if ((c = a.listeners[c.toString()]))
      for (c = c.concat(), a = 0; a < c.length; a++) {
        var g = c[a];
        g &&
          g.capture == d &&
          !g.removed &&
          ((g = m.events.fireListener(g, e)), (f = f && !1 !== g));
      }
  return f;
};
m.events.fireListener = function (a, c) {
  var d = a.listener,
    e = a.handler || a.src;
  a.callOnce && m.events.unlistenByKey(a);
  return d.call(e, c);
};
m.events.getTotalListenerCount = function () {
  return m.events.listenerCountEstimate_;
};
m.events.dispatchEvent = function (a, c) {
  m.asserts.assert(
    m.events.Listenable.isImplementedBy(a),
    "Can not use goog.events.dispatchEvent with non-goog.events.Listenable instance."
  );
  return a.dispatchEvent(c);
};
m.events.protectBrowserEventEntryPoint = function (a) {
  m.events.handleBrowserEvent_ = a.protectEntryPoint(
    m.events.handleBrowserEvent_
  );
};
m.events.handleBrowserEvent_ = function (a, c) {
  if (a.removed) return !0;
  if (!m.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    var d = c || m.getObjectByName("window.event");
    c = new m.events.BrowserEvent(d, this);
    var e = !0;
    if (m.events.CAPTURE_SIMULATION_MODE == m.events.CaptureSimulationMode.ON) {
      if (!m.events.isMarkedIeEvent_(d)) {
        m.events.markIeEvent_(d);
        d = [];
        for (var f = c.currentTarget; f; f = f.parentNode) d.push(f);
        a = a.type;
        for (f = d.length - 1; !c.propagationStopped_ && 0 <= f; f--) {
          c.currentTarget = d[f];
          var g = m.events.fireListeners_(d[f], a, !0, c);
          e = e && g;
        }
        for (f = 0; !c.propagationStopped_ && f < d.length; f++)
          (c.currentTarget = d[f]),
            (g = m.events.fireListeners_(d[f], a, !1, c)),
            (e = e && g);
      }
    } else e = m.events.fireListener(a, c);
    return e;
  }
  return m.events.fireListener(a, new m.events.BrowserEvent(c, this));
};
m.events.markIeEvent_ = function (a) {
  var c = !1;
  if (0 == a.keyCode)
    try {
      a.keyCode = -1;
      return;
    } catch (d) {
      c = !0;
    }
  if (c || void 0 == a.returnValue) a.returnValue = !0;
};
m.events.isMarkedIeEvent_ = function (a) {
  return 0 > a.keyCode || void 0 != a.returnValue;
};
m.events.uniqueIdCounter_ = 0;
m.events.getUniqueId = function (a) {
  return a + "_" + m.events.uniqueIdCounter_++;
};
m.events.getListenerMap_ = function (a) {
  a = a[m.events.LISTENER_MAP_PROP_];
  return a instanceof m.events.ListenerMap ? a : null;
};
m.events.LISTENER_WRAPPER_PROP_ =
  "__closure_events_fn_" + ((1e9 * Math.random()) >>> 0);
m.events.wrapListener = function (a) {
  m.asserts.assert(a, "Listener can not be null.");
  if ("function" === typeof a) return a;
  m.asserts.assert(
    a.handleEvent,
    "An object listener must have handleEvent method."
  );
  a[m.events.LISTENER_WRAPPER_PROP_] ||
    (a[m.events.LISTENER_WRAPPER_PROP_] = function (c) {
      return a.handleEvent(c);
    });
  return a[m.events.LISTENER_WRAPPER_PROP_];
};
m.debug.entryPointRegistry.register(function (a) {
  m.events.handleBrowserEvent_ = a(m.events.handleBrowserEvent_);
});
m.events.EventHandler = function (a) {
  m.Disposable.call(this);
  this.handler_ = a;
  this.keys_ = {};
};
m.inherits(m.events.EventHandler, m.Disposable);
m.events.EventHandler.typeArray_ = [];
m.events.EventHandler.prototype.listen = function (a, c, d, e) {
  return this.listen_(a, c, d, e);
};
m.events.EventHandler.prototype.listen_ = function (a, c, d, e, f) {
  Array.isArray(c) ||
    (c && (m.events.EventHandler.typeArray_[0] = c.toString()),
    (c = m.events.EventHandler.typeArray_));
  for (var g = 0; g < c.length; g++) {
    var h = m.events.listen(
      a,
      c[g],
      d || this.handleEvent,
      e || !1,
      f || this.handler_ || this
    );
    if (!h) break;
    this.keys_[h.key] = h;
  }
  return this;
};
m.events.EventHandler.prototype.listenOnce = function (a, c, d, e) {
  return Ja(this, a, c, d, e);
};
var Ja = function (a, c, d, e, f, g) {
  if (Array.isArray(d))
    for (var h = 0; h < d.length; h++) Ja(a, c, d[h], e, f, g);
  else {
    c = m.events.listenOnce(c, d, e || a.handleEvent, f, g || a.handler_ || a);
    if (!c) return a;
    a.keys_[c.key] = c;
  }
  return a;
};
b = m.events.EventHandler.prototype;
b.listenWithWrapper = function (a, c, d, e) {
  c.listen(a, d, e, this.handler_ || this, this);
  return this;
};
b.unlisten = function (a, c, d, e, f) {
  if (Array.isArray(c))
    for (var g = 0; g < c.length; g++) this.unlisten(a, c[g], d, e, f);
  else if (
    (a = m.events.getListener(
      a,
      c,
      d || this.handleEvent,
      m.isObject(e) ? !!e.capture : !!e,
      f || this.handler_ || this
    ))
  )
    m.events.unlistenByKey(a), delete this.keys_[a.key];
  return this;
};
b.unlistenWithWrapper = function (a, c, d, e, f) {
  c.unlisten(a, d, e, f || this.handler_ || this, this);
  return this;
};
b.removeAll = function () {
  m.object.forEach(
    this.keys_,
    function (a, c) {
      this.keys_.hasOwnProperty(c) && m.events.unlistenByKey(a);
    },
    this
  );
  this.keys_ = {};
};
b.disposeInternal = function () {
  m.events.EventHandler.superClass_.disposeInternal.call(this);
  this.removeAll();
};
b.handleEvent = function () {
  throw Error("EventHandler.handleEvent not implemented");
};
m.events.EventTarget = function () {
  m.Disposable.call(this);
  this.eventTargetListeners_ = new m.events.ListenerMap(this);
  this.actualEventTarget_ = this;
  this.parentEventTarget_ = null;
};
m.inherits(m.events.EventTarget, m.Disposable);
m.events.Listenable.addImplementation(m.events.EventTarget);
m.events.EventTarget.MAX_ANCESTORS_ = 1e3;
b = m.events.EventTarget.prototype;
b.getParentEventTarget = function () {
  return this.parentEventTarget_;
};
b.addEventListener = function (a, c, d, e) {
  m.events.listen(this, a, c, d, e);
};
b.removeEventListener = function (a, c, d, e) {
  m.events.unlisten(this, a, c, d, e);
};
b.dispatchEvent = function (a) {
  Ka(this);
  var c = this.getParentEventTarget();
  if (c) {
    var d = [];
    for (var e = 1; c; c = c.getParentEventTarget())
      d.push(c),
        m.asserts.assert(
          ++e < m.events.EventTarget.MAX_ANCESTORS_,
          "infinite loop"
        );
  }
  return m.events.EventTarget.dispatchEventInternal_(
    this.actualEventTarget_,
    a,
    d
  );
};
b.disposeInternal = function () {
  m.events.EventTarget.superClass_.disposeInternal.call(this);
  this.removeAllListeners();
  this.parentEventTarget_ = null;
};
b.listen = function (a, c, d, e) {
  Ka(this);
  return this.eventTargetListeners_.add(String(a), c, !1, d, e);
};
b.listenOnce = function (a, c, d, e) {
  return this.eventTargetListeners_.add(String(a), c, !0, d, e);
};
b.unlisten = function (a, c, d, e) {
  return this.eventTargetListeners_.remove(String(a), c, d, e);
};
b.unlistenByKey = function (a) {
  return Ia(this.eventTargetListeners_, a);
};
b.removeAllListeners = function (a) {
  return this.eventTargetListeners_
    ? this.eventTargetListeners_.removeAll(a)
    : 0;
};
b.fireListeners = function (a, c, d) {
  a = this.eventTargetListeners_.listeners[String(a)];
  if (!a) return !0;
  a = a.concat();
  for (var e = !0, f = 0; f < a.length; ++f) {
    var g = a[f];
    if (g && !g.removed && g.capture == c) {
      var h = g.listener,
        l = g.handler || g.src;
      g.callOnce && this.unlistenByKey(g);
      e = !1 !== h.call(l, d) && e;
    }
  }
  return e && !d.defaultPrevented;
};
b.getListeners = function (a, c) {
  return this.eventTargetListeners_.getListeners(String(a), c);
};
b.getListener = function (a, c, d, e) {
  return this.eventTargetListeners_.getListener(String(a), c, d, e);
};
b.hasListener = function (a, c) {
  return this.eventTargetListeners_.hasListener(
    void 0 !== a ? String(a) : void 0,
    c
  );
};
var Ka = function (a) {
  m.asserts.assert(
    a.eventTargetListeners_,
    "Event target is not initialized. Did you call the superclass (goog.events.EventTarget) constructor?"
  );
};
m.events.EventTarget.dispatchEventInternal_ = function (a, c, d) {
  var e = c.type || c;
  if ("string" === typeof c) c = new m.events.Event(c, a);
  else if (c instanceof m.events.Event) c.target = c.target || a;
  else {
    var f = c;
    c = new m.events.Event(e, a);
    m.object.extend(c, f);
  }
  f = !0;
  if (d)
    for (var g = d.length - 1; !c.propagationStopped_ && 0 <= g; g--) {
      var h = (c.currentTarget = d[g]);
      f = h.fireListeners(e, !0, c) && f;
    }
  c.propagationStopped_ ||
    ((h = c.currentTarget = a),
    (f = h.fireListeners(e, !0, c) && f),
    c.propagationStopped_ || (f = h.fireListeners(e, !1, c) && f));
  if (d)
    for (g = 0; !c.propagationStopped_ && g < d.length; g++)
      (h = c.currentTarget = d[g]), (f = h.fireListeners(e, !1, c) && f);
  return f;
};
m.events.EventWrapper = function () {};
m.events.EventWrapper.prototype.listen = function () {};
m.events.EventWrapper.prototype.unlisten = function () {};
m.math = {};
m.math.randomInt = function () {
  return Math.floor(Math.random() * J.NETWORK_TEST_URLS_.length);
};
m.math.uniformRandom = function (a, c) {
  return a + Math.random() * (c - a);
};
m.math.clamp = function (a, c, d) {
  return Math.min(Math.max(a, c), d);
};
m.math.modulo = function (a, c) {
  a %= c;
  return 0 > a * c ? a + c : a;
};
m.math.lerp = function (a, c, d) {
  return a + d * (c - a);
};
m.math.nearlyEquals = function (a, c, d) {
  return Math.abs(a - c) <= (d || 1e-6);
};
m.math.standardAngle = function (a) {
  return m.math.modulo(a, 360);
};
m.math.standardAngleInRadians = function (a) {
  return m.math.modulo(a, 2 * Math.PI);
};
m.math.toRadians = function (a) {
  return (a * Math.PI) / 180;
};
m.math.toDegrees = function (a) {
  return (180 * a) / Math.PI;
};
m.math.angleDx = function (a, c) {
  return c * Math.cos(m.math.toRadians(a));
};
m.math.angleDy = function (a, c) {
  return c * Math.sin(m.math.toRadians(a));
};
m.math.angle = function (a, c, d, e) {
  return m.math.standardAngle(m.math.toDegrees(Math.atan2(e - c, d - a)));
};
m.math.angleDifference = function (a, c) {
  a = m.math.standardAngle(c) - m.math.standardAngle(a);
  180 < a ? (a -= 360) : -180 >= a && (a = 360 + a);
  return a;
};
m.math.sign = function (a) {
  return 0 < a ? 1 : 0 > a ? -1 : a;
};
m.math.longestCommonSubsequence = function (a, c, d, e) {
  d =
    d ||
    function (v, W) {
      return v == W;
    };
  e =
    e ||
    function (v) {
      return a[v];
    };
  for (var f = a.length, g = c.length, h = [], l = 0; l < f + 1; l++)
    (h[l] = []), (h[l][0] = 0);
  for (var n = 0; n < g + 1; n++) h[0][n] = 0;
  for (l = 1; l <= f; l++)
    for (n = 1; n <= g; n++)
      d(a[l - 1], c[n - 1])
        ? (h[l][n] = h[l - 1][n - 1] + 1)
        : (h[l][n] = Math.max(h[l - 1][n], h[l][n - 1]));
  var p = [];
  l = f;
  for (n = g; 0 < l && 0 < n; )
    d(a[l - 1], c[n - 1])
      ? (p.unshift(e(l - 1, n - 1)), l--, n--)
      : h[l - 1][n] > h[l][n - 1]
      ? l--
      : n--;
  return p;
};
m.math.sum = function (a) {
  return fa(
    arguments,
    function (c, d) {
      return c + d;
    },
    0
  );
};
m.math.average = function (a) {
  return m.math.sum.apply(null, arguments) / arguments.length;
};
m.math.sampleVariance = function (a) {
  var c = arguments.length;
  if (2 > c) return 0;
  var d = m.math.average.apply(null, arguments);
  return (
    m.math.sum.apply(
      null,
      x(arguments, function (e) {
        return Math.pow(e - d, 2);
      })
    ) /
    (c - 1)
  );
};
m.math.standardDeviation = function (a) {
  return Math.sqrt(m.math.sampleVariance.apply(null, arguments));
};
m.math.isInt = function (a) {
  return isFinite(a) && 0 == a % 1;
};
m.math.isFiniteNumber = function (a) {
  return isFinite(a);
};
m.math.isNegativeZero = function (a) {
  return 0 == a && 0 > 1 / a;
};
m.math.log10Floor = function (a) {
  if (0 < a) {
    var c = Math.round(Math.log(a) * Math.LOG10E);
    return c - (parseFloat("1e" + c) > a ? 1 : 0);
  }
  return 0 == a ? -Infinity : NaN;
};
m.math.safeFloor = function (a, c) {
  m.asserts.assert(void 0 === c || 0 < c);
  return Math.floor(a + (c || 2e-15));
};
m.math.safeCeil = function (a, c) {
  m.asserts.assert(void 0 === c || 0 < c);
  return Math.ceil(a - (c || 2e-15));
};
m.iter = {};
m.iter.StopIteration =
  "StopIteration" in m.global
    ? m.global.StopIteration
    : { message: "StopIteration", stack: "" };
m.iter.Iterator = function () {};
m.iter.Iterator.prototype.next = function () {
  throw m.iter.StopIteration;
};
m.iter.Iterator.prototype.__iterator__ = function () {
  return this;
};
m.iter.toIterator = function (a) {
  if (a instanceof m.iter.Iterator) return a;
  if ("function" == typeof a.__iterator__) return a.__iterator__(!1);
  if (m.isArrayLike(a)) {
    var c = 0,
      d = new m.iter.Iterator();
    d.next = function () {
      for (;;) {
        if (c >= a.length) throw m.iter.StopIteration;
        if (c in a) return a[c++];
        c++;
      }
    };
    return d;
  }
  throw Error("Not implemented");
};
m.iter.forEach = function (a, c, d) {
  if (m.isArrayLike(a))
    try {
      w(a, c, d);
    } catch (e) {
      if (e !== m.iter.StopIteration) throw e;
    }
  else {
    a = m.iter.toIterator(a);
    try {
      for (;;) c.call(d, a.next(), void 0, a);
    } catch (e) {
      if (e !== m.iter.StopIteration) throw e;
    }
  }
};
m.iter.filter = function (a, c, d) {
  var e = m.iter.toIterator(a);
  a = new m.iter.Iterator();
  a.next = function () {
    for (;;) {
      var f = e.next();
      if (c.call(d, f, void 0, e)) return f;
    }
  };
  return a;
};
m.iter.filterFalse = function (a, c, d) {
  return m.iter.filter(a, m.functions.not(c), d);
};
m.iter.range = function (a, c, d) {
  var e = 0,
    f = a,
    g = d || 1;
  1 < arguments.length && ((e = a), (f = +c));
  if (0 == g) throw Error("Range step argument must not be zero");
  var h = new m.iter.Iterator();
  h.next = function () {
    if ((0 < g && e >= f) || (0 > g && e <= f)) throw m.iter.StopIteration;
    var l = e;
    e += g;
    return l;
  };
  return h;
};
m.iter.join = function (a, c) {
  return m.iter.toArray(a).join(c);
};
m.iter.map = function (a, c, d) {
  var e = m.iter.toIterator(a);
  a = new m.iter.Iterator();
  a.next = function () {
    var f = e.next();
    return c.call(d, f, void 0, e);
  };
  return a;
};
m.iter.reduce = function (a, c, d, e) {
  var f = d;
  m.iter.forEach(a, function (g) {
    f = c.call(e, f, g);
  });
  return f;
};
m.iter.some = function (a, c, d) {
  a = m.iter.toIterator(a);
  try {
    for (;;) if (c.call(d, a.next(), void 0, a)) return !0;
  } catch (e) {
    if (e !== m.iter.StopIteration) throw e;
  }
  return !1;
};
m.iter.every = function (a, c, d) {
  a = m.iter.toIterator(a);
  try {
    for (;;) if (!c.call(d, a.next(), void 0, a)) return !1;
  } catch (e) {
    if (e !== m.iter.StopIteration) throw e;
  }
  return !0;
};
m.iter.chain = function (a) {
  return m.iter.chainFromIterable(arguments);
};
m.iter.chainFromIterable = function (a) {
  var c = m.iter.toIterator(a);
  a = new m.iter.Iterator();
  var d = null;
  a.next = function () {
    for (;;) {
      if (null == d) {
        var e = c.next();
        d = m.iter.toIterator(e);
      }
      try {
        return d.next();
      } catch (f) {
        if (f !== m.iter.StopIteration) throw f;
        d = null;
      }
    }
  };
  return a;
};
m.iter.dropWhile = function (a, c, d) {
  var e = m.iter.toIterator(a);
  a = new m.iter.Iterator();
  var f = !0;
  a.next = function () {
    for (;;) {
      var g = e.next();
      if (!f || !c.call(d, g, void 0, e)) return (f = !1), g;
    }
  };
  return a;
};
m.iter.takeWhile = function (a, c, d) {
  var e = m.iter.toIterator(a);
  a = new m.iter.Iterator();
  a.next = function () {
    var f = e.next();
    if (c.call(d, f, void 0, e)) return f;
    throw m.iter.StopIteration;
  };
  return a;
};
m.iter.toArray = function (a) {
  if (m.isArrayLike(a)) return C(a);
  a = m.iter.toIterator(a);
  var c = [];
  m.iter.forEach(a, function (d) {
    c.push(d);
  });
  return c;
};
m.iter.equals = function (a, c) {
  a = m.iter.zipLongest({}, a, c);
  var d = wa;
  return m.iter.every(a, function (e) {
    return d(e[0], e[1]);
  });
};
m.iter.nextOrValue = function (a) {
  try {
    m.iter.toIterator(a).next();
  } catch (c) {
    if (c != m.iter.StopIteration) throw c;
  }
};
m.iter.product = function (a) {
  if (
    ha(arguments, function (f) {
      return !f.length;
    }) ||
    !arguments.length
  )
    return new m.iter.Iterator();
  var c = new m.iter.Iterator(),
    d = arguments,
    e = ya(0, d.length);
  c.next = function () {
    if (e) {
      for (
        var f = x(e, function (h, l) {
            return d[l][h];
          }),
          g = e.length - 1;
        0 <= g;
        g--
      ) {
        m.asserts.assert(e);
        if (e[g] < d[g].length - 1) {
          e[g]++;
          break;
        }
        if (0 == g) {
          e = null;
          break;
        }
        e[g] = 0;
      }
      return f;
    }
    throw m.iter.StopIteration;
  };
  return c;
};
m.iter.cycle = function (a) {
  var c = m.iter.toIterator(a),
    d = [],
    e = 0;
  a = new m.iter.Iterator();
  var f = !1;
  a.next = function () {
    var g = null;
    if (!f)
      try {
        return (g = c.next()), d.push(g), g;
      } catch (h) {
        if (h != m.iter.StopIteration || z(d)) throw h;
        f = !0;
      }
    g = d[e];
    e = (e + 1) % d.length;
    return g;
  };
  return a;
};
m.iter.count = function (a, c) {
  var d = a || 0,
    e = void 0 !== c ? c : 1;
  a = new m.iter.Iterator();
  a.next = function () {
    var f = d;
    d += e;
    return f;
  };
  return a;
};
m.iter.repeat = function (a) {
  var c = new m.iter.Iterator();
  c.next = m.functions.constant(a);
  return c;
};
m.iter.accumulate = function (a) {
  var c = m.iter.toIterator(a),
    d = 0;
  a = new m.iter.Iterator();
  a.next = function () {
    return (d += c.next());
  };
  return a;
};
m.iter.zip = function (a) {
  var c = arguments,
    d = new m.iter.Iterator();
  if (0 < c.length) {
    var e = x(c, m.iter.toIterator);
    d.next = function () {
      return x(e, function (f) {
        return f.next();
      });
    };
  }
  return d;
};
m.iter.zipLongest = function (a, c) {
  var d = D(arguments, 1),
    e = new m.iter.Iterator();
  if (0 < d.length) {
    var f = x(d, m.iter.toIterator);
    e.next = function () {
      var g = !1,
        h = x(f, function (l) {
          try {
            var n = l.next();
            g = !0;
          } catch (p) {
            if (p !== m.iter.StopIteration) throw p;
            n = a;
          }
          return n;
        });
      if (!g) throw m.iter.StopIteration;
      return h;
    };
  }
  return e;
};
m.iter.compress = function (a, c) {
  var d = m.iter.toIterator(c);
  return m.iter.filter(a, function () {
    return !!d.next();
  });
};
m.iter.GroupByIterator_ = function (a, c) {
  this.iterator = m.iter.toIterator(a);
  this.keyFunc = c || m.functions.identity;
};
m.inherits(m.iter.GroupByIterator_, m.iter.Iterator);
m.iter.GroupByIterator_.prototype.next = function () {
  for (; this.currentKey == this.targetKey; )
    (this.currentValue = this.iterator.next()),
      (this.currentKey = this.keyFunc(this.currentValue));
  for (
    var a = (this.targetKey = this.currentKey), c = this.targetKey, d = [];
    this.currentKey == c;

  ) {
    d.push(this.currentValue);
    try {
      this.currentValue = this.iterator.next();
    } catch (e) {
      if (e !== m.iter.StopIteration) throw e;
      break;
    }
    this.currentKey = this.keyFunc(this.currentValue);
  }
  return [a, d];
};
m.iter.groupBy = function (a, c) {
  return new m.iter.GroupByIterator_(a, c);
};
m.iter.starMap = function (a, c, d) {
  var e = m.iter.toIterator(a);
  a = new m.iter.Iterator();
  a.next = function () {
    var f = m.iter.toArray(e.next());
    return c.apply(d, B(f, void 0, e));
  };
  return a;
};
m.iter.tee = function (a, c) {
  var d = m.iter.toIterator(a),
    e = x(xa("number" === typeof c ? c : 2), function () {
      return [];
    }),
    f = function () {
      var g = d.next();
      w(e, function (h) {
        h.push(g);
      });
    };
  return x(e, function (g) {
    var h = new m.iter.Iterator();
    h.next = function () {
      z(g) && f();
      m.asserts.assert(!z(g));
      return g.shift();
    };
    return h;
  });
};
m.iter.enumerate = function (a, c) {
  return m.iter.zip(m.iter.count(c), a);
};
m.iter.limit = function (a, c) {
  m.asserts.assert(m.math.isInt(c) && 0 <= c);
  var d = m.iter.toIterator(a);
  a = new m.iter.Iterator();
  var e = c;
  a.next = function () {
    if (0 < e--) return d.next();
    throw m.iter.StopIteration;
  };
  return a;
};
m.iter.consume = function (a, c) {
  m.asserts.assert(m.math.isInt(c) && 0 <= c);
  for (a = m.iter.toIterator(a); 0 < c--; ) m.iter.nextOrValue(a);
  return a;
};
m.iter.slice = function (a, c, d) {
  m.asserts.assert(m.math.isInt(c) && 0 <= c);
  a = m.iter.consume(a, c);
  "number" === typeof d &&
    (m.asserts.assert(m.math.isInt(d) && d >= c), (a = m.iter.limit(a, d - c)));
  return a;
};
m.iter.hasDuplicates_ = function (a) {
  var c = [];
  qa(a, c);
  return a.length != c.length;
};
m.iter.permutations = function (a, c) {
  a = m.iter.toArray(a);
  c = m.iter.product.apply(void 0, ya(a, "number" === typeof c ? c : a.length));
  return m.iter.filter(c, function (d) {
    return !m.iter.hasDuplicates_(d);
  });
};
m.iter.combinations = function (a, c) {
  function d(g) {
    return e[g];
  }
  var e = m.iter.toArray(a);
  a = m.iter.range(e.length);
  c = m.iter.permutations(a, c);
  var f = m.iter.filter(c, function (g) {
    return va(g);
  });
  c = new m.iter.Iterator();
  c.next = function () {
    return x(f.next(), d);
  };
  return c;
};
m.iter.combinationsWithReplacement = function (a, c) {
  function d(g) {
    return e[g];
  }
  var e = m.iter.toArray(a);
  a = xa(e.length);
  c = m.iter.product.apply(void 0, ya(a, c));
  var f = m.iter.filter(c, function (g) {
    return va(g);
  });
  c = new m.iter.Iterator();
  c.next = function () {
    return x(f.next(), d);
  };
  return c;
};
m.structs = {};
m.structs.Map = function (a, c) {
  this.map_ = {};
  this.keys_ = [];
  this.version_ = this.count_ = 0;
  var d = arguments.length;
  if (1 < d) {
    if (d % 2) throw Error("Uneven number of arguments");
    for (var e = 0; e < d; e += 2) this.set(arguments[e], arguments[e + 1]);
  } else a && this.addAll(a);
};
b = m.structs.Map.prototype;
b.getCount = function () {
  return this.count_;
};
b.getValues = function () {
  K(this);
  for (var a = [], c = 0; c < this.keys_.length; c++)
    a.push(this.map_[this.keys_[c]]);
  return a;
};
b.getKeys = function () {
  K(this);
  return this.keys_.concat();
};
b.containsKey = function (a) {
  return m.structs.Map.hasKey_(this.map_, a);
};
b.containsValue = function (a) {
  for (var c = 0; c < this.keys_.length; c++) {
    var d = this.keys_[c];
    if (m.structs.Map.hasKey_(this.map_, d) && this.map_[d] == a) return !0;
  }
  return !1;
};
b.equals = function (a, c) {
  if (this === a) return !0;
  if (this.count_ != a.getCount()) return !1;
  c = c || m.structs.Map.defaultEquals;
  K(this);
  for (var d, e = 0; (d = this.keys_[e]); e++)
    if (!c(this.get(d), a.get(d))) return !1;
  return !0;
};
m.structs.Map.defaultEquals = function (a, c) {
  return a === c;
};
m.structs.Map.prototype.isEmpty = function () {
  return 0 == this.count_;
};
m.structs.Map.prototype.clear = function () {
  this.map_ = {};
  this.version_ = this.count_ = this.keys_.length = 0;
};
m.structs.Map.prototype.remove = function (a) {
  return m.structs.Map.hasKey_(this.map_, a)
    ? (delete this.map_[a],
      this.count_--,
      this.version_++,
      this.keys_.length > 2 * this.count_ && K(this),
      !0)
    : !1;
};
var K = function (a) {
  if (a.count_ != a.keys_.length) {
    for (var c = 0, d = 0; c < a.keys_.length; ) {
      var e = a.keys_[c];
      m.structs.Map.hasKey_(a.map_, e) && (a.keys_[d++] = e);
      c++;
    }
    a.keys_.length = d;
  }
  if (a.count_ != a.keys_.length) {
    var f = {};
    for (d = c = 0; c < a.keys_.length; )
      (e = a.keys_[c]),
        m.structs.Map.hasKey_(f, e) || ((a.keys_[d++] = e), (f[e] = 1)),
        c++;
    a.keys_.length = d;
  }
};
b = m.structs.Map.prototype;
b.get = function (a, c) {
  return m.structs.Map.hasKey_(this.map_, a) ? this.map_[a] : c;
};
b.set = function (a, c) {
  m.structs.Map.hasKey_(this.map_, a) ||
    (this.count_++, this.keys_.push(a), this.version_++);
  this.map_[a] = c;
};
b.addAll = function (a) {
  if (a instanceof m.structs.Map)
    for (var c = a.getKeys(), d = 0; d < c.length; d++)
      this.set(c[d], a.get(c[d]));
  else for (c in a) this.set(c, a[c]);
};
b.forEach = function (a, c) {
  for (var d = this.getKeys(), e = 0; e < d.length; e++) {
    var f = d[e],
      g = this.get(f);
    a.call(c, g, f, this);
  }
};
b.clone = function () {
  return new m.structs.Map(this);
};
b.transpose = function () {
  for (var a = new m.structs.Map(), c = 0; c < this.keys_.length; c++) {
    var d = this.keys_[c];
    a.set(this.map_[d], d);
  }
  return a;
};
b.toObject = function () {
  K(this);
  for (var a = {}, c = 0; c < this.keys_.length; c++) {
    var d = this.keys_[c];
    a[d] = this.map_[d];
  }
  return a;
};
b.__iterator__ = function (a) {
  K(this);
  var c = 0,
    d = this.version_,
    e = this,
    f = new m.iter.Iterator();
  f.next = function () {
    if (d != e.version_)
      throw Error("The map has changed since the iterator was created");
    if (c >= e.keys_.length) throw m.iter.StopIteration;
    var g = e.keys_[c++];
    return a ? g : e.map_[g];
  };
  return f;
};
m.structs.Map.hasKey_ = function (a, c) {
  return Object.prototype.hasOwnProperty.call(a, c);
};
m.structs.LinkedMap = function (a) {
  this.maxCount_ = a || null;
  this.cache_ = !0;
  this.evictionCallback_ = void 0;
  this.map_ = new m.structs.Map();
  this.head_ = new m.structs.LinkedMap.Node_("", void 0);
  this.head_.next = this.head_.prev = this.head_;
};
var Ma = function (a, c) {
  (c = a.map_.get(c)) && a.cache_ && (c.remove(), La(a, c));
  return c;
};
b = m.structs.LinkedMap.prototype;
b.get = function (a, c) {
  return (a = Ma(this, a)) ? a.value : c;
};
b.set = function (a, c) {
  var d = Ma(this, a);
  d
    ? (d.value = c)
    : ((d = new m.structs.LinkedMap.Node_(a, c)),
      this.map_.set(a, d),
      La(this, d));
};
b.peek = function () {
  return this.head_.next.value;
};
b.shift = function () {
  return Na(this, this.head_.next);
};
b.pop = function () {
  return Na(this, this.head_.prev);
};
b.remove = function (a) {
  return (a = this.map_.get(a)) ? (this.removeNode(a), !0) : !1;
};
b.removeNode = function (a) {
  a.remove();
  this.map_.remove(a.key);
};
b.getCount = function () {
  return this.map_.getCount();
};
b.isEmpty = function () {
  return this.map_.isEmpty();
};
b.getKeys = function () {
  return this.map(function (a, c) {
    return c;
  });
};
b.getValues = function () {
  return this.map(function (a) {
    return a;
  });
};
b.contains = function (a) {
  return this.some(function (c) {
    return c == a;
  });
};
b.containsKey = function (a) {
  return this.map_.containsKey(a);
};
b.clear = function () {
  Oa(this, 0);
};
b.forEach = function (a, c) {
  for (var d = this.head_.next; d != this.head_; d = d.next)
    a.call(c, d.value, d.key, this);
};
b.map = function (a, c) {
  for (var d = [], e = this.head_.next; e != this.head_; e = e.next)
    d.push(a.call(c, e.value, e.key, this));
  return d;
};
b.some = function (a, c) {
  for (var d = this.head_.next; d != this.head_; d = d.next)
    if (a.call(c, d.value, d.key, this)) return !0;
  return !1;
};
b.every = function (a, c) {
  for (var d = this.head_.next; d != this.head_; d = d.next)
    if (!a.call(c, d.value, d.key, this)) return !1;
  return !0;
};
var La = function (a, c) {
    a.cache_
      ? ((c.next = a.head_.next),
        (c.prev = a.head_),
        (a.head_.next = c),
        (c.next.prev = c))
      : ((c.prev = a.head_.prev),
        (c.next = a.head_),
        (a.head_.prev = c),
        (c.prev.next = c));
    null != a.maxCount_ && Oa(a, a.maxCount_);
  },
  Oa = function (a, c) {
    for (; a.getCount() > c; ) {
      var d = a.cache_ ? a.head_.prev : a.head_.next;
      a.removeNode(d);
      a.evictionCallback_ && a.evictionCallback_(d.key, d.value);
    }
  },
  Na = function (a, c) {
    a.head_ != c && a.removeNode(c);
    return c.value;
  };
m.structs.LinkedMap.Node_ = function (a, c) {
  this.key = a;
  this.value = c;
};
m.structs.LinkedMap.Node_.prototype.remove = function () {
  this.prev.next = this.next;
  this.next.prev = this.prev;
  delete this.prev;
  delete this.next;
};
var L = {},
  M = function (a, c) {
    m.events.EventTarget.call(this);
    this.timeout_ = a || 36e5;
    this.cache_ = new m.structs.LinkedMap(c || 100);
  };
k.inherits(M, m.events.EventTarget);
M.prototype.get = function (a) {
  return (a = this.cache_.get(a)) && Date.now() - a.timeStamp_ <= this.timeout_
    ? a.licenses_
    : null;
};
M.prototype.remove = function (a) {
  this.cache_.remove(a);
};
M.Entry = function (a) {
  this.timeStamp_ = Date.now();
  this.licenses_ = a;
};
L.LicensesCache = M;
m.structs.getCount = function (a) {
  return a.getCount && "function" == typeof a.getCount
    ? a.getCount()
    : m.isArrayLike(a) || "string" === typeof a
    ? a.length
    : m.object.getCount(a);
};
m.structs.getValues = function (a) {
  if (a.getValues && "function" == typeof a.getValues) return a.getValues();
  if ("string" === typeof a) return a.split("");
  if (m.isArrayLike(a)) {
    for (var c = [], d = a.length, e = 0; e < d; e++) c.push(a[e]);
    return c;
  }
  return m.object.getValues(a);
};
m.structs.getKeys = function (a) {
  if (a.getKeys && "function" == typeof a.getKeys) return a.getKeys();
  if (!a.getValues || "function" != typeof a.getValues) {
    if (m.isArrayLike(a) || "string" === typeof a) {
      var c = [];
      a = a.length;
      for (var d = 0; d < a; d++) c.push(d);
      return c;
    }
    return m.object.getKeys(a);
  }
};
m.structs.contains = function (a, c) {
  return a.contains && "function" == typeof a.contains
    ? a.contains(c)
    : a.containsValue && "function" == typeof a.containsValue
    ? a.containsValue(c)
    : m.isArrayLike(a) || "string" === typeof a
    ? y(a, c)
    : m.object.containsValue(a, c);
};
m.structs.isEmpty = function (a) {
  return a.isEmpty && "function" == typeof a.isEmpty
    ? a.isEmpty()
    : m.isArrayLike(a) || "string" === typeof a
    ? z(a)
    : m.object.isEmpty(a);
};
m.structs.clear = function (a) {
  a.clear && "function" == typeof a.clear
    ? a.clear()
    : m.isArrayLike(a)
    ? ma(a)
    : m.object.clear(a);
};
m.structs.forEach = function (a, c, d) {
  if (a.forEach && "function" == typeof a.forEach) a.forEach(c, d);
  else if (m.isArrayLike(a) || "string" === typeof a) w(a, c, d);
  else
    for (
      var e = m.structs.getKeys(a),
        f = m.structs.getValues(a),
        g = f.length,
        h = 0;
      h < g;
      h++
    )
      c.call(d, f[h], e && e[h], a);
};
m.structs.filter = function (a, c, d) {
  if ("function" == typeof a.filter) return a.filter(c, d);
  if (m.isArrayLike(a) || "string" === typeof a) return ea(a, c, d);
  var e = m.structs.getKeys(a),
    f = m.structs.getValues(a),
    g = f.length;
  if (e) {
    var h = {};
    for (var l = 0; l < g; l++) c.call(d, f[l], e[l], a) && (h[e[l]] = f[l]);
  } else
    for (h = [], l = 0; l < g; l++) c.call(d, f[l], void 0, a) && h.push(f[l]);
  return h;
};
m.structs.map = function (a, c, d) {
  if ("function" == typeof a.map) return a.map(c, d);
  if (m.isArrayLike(a) || "string" === typeof a) return x(a, c, d);
  var e = m.structs.getKeys(a),
    f = m.structs.getValues(a),
    g = f.length;
  if (e) {
    var h = {};
    for (var l = 0; l < g; l++) h[e[l]] = c.call(d, f[l], e[l], a);
  } else for (h = [], l = 0; l < g; l++) h[l] = c.call(d, f[l], void 0, a);
  return h;
};
m.structs.some = function (a, c, d) {
  if ("function" == typeof a.some) return a.some(c, d);
  if (m.isArrayLike(a) || "string" === typeof a) return ha(a, c, d);
  for (
    var e = m.structs.getKeys(a),
      f = m.structs.getValues(a),
      g = f.length,
      h = 0;
    h < g;
    h++
  )
    if (c.call(d, f[h], e && e[h], a)) return !0;
  return !1;
};
m.structs.every = function (a, c, d) {
  if ("function" == typeof a.every) return a.every(c, d);
  if (m.isArrayLike(a) || "string" === typeof a) return ia(a, c, d);
  for (
    var e = m.structs.getKeys(a),
      f = m.structs.getValues(a),
      g = f.length,
      h = 0;
    h < g;
    h++
  )
    if (!c.call(d, f[h], e && e[h], a)) return !1;
  return !0;
};
m.uri = {};
m.uri.utils = {};
m.uri.utils.CharCode_ = { AMPERSAND: 38, EQUAL: 61, HASH: 35, QUESTION: 63 };
m.uri.utils.buildFromEncodedParts = function (a, c, d, e, f, g, h) {
  var l = "";
  a && (l += a + ":");
  d && ((l += "//"), c && (l += c + "@"), (l += d), e && (l += ":" + e));
  f && (l += f);
  g && (l += "?" + g);
  h && (l += "#" + h);
  return l;
};
m.uri.utils.splitRe_ =
  /^(?:([^:/?#.]+):)?(?:\/\/(?:([^\\/?#]*)@)?([^\\/?#]*?)(?::([0-9]+))?(?=[\\/?#]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/;
m.uri.utils.ComponentIndex = {
  SCHEME: 1,
  USER_INFO: 2,
  DOMAIN: 3,
  PORT: 4,
  PATH: 5,
  QUERY_DATA: 6,
  FRAGMENT: 7,
};
m.uri.utils.urlPackageSupportLoggingHandler_ = null;
m.uri.utils.setUrlPackageSupportLoggingHandler = function (a) {
  m.uri.utils.urlPackageSupportLoggingHandler_ = a;
};
m.uri.utils.split = function (a) {
  var c = a.match(m.uri.utils.splitRe_);
  m.uri.utils.urlPackageSupportLoggingHandler_ &&
    0 <=
      ["http", "https", "ws", "wss", "ftp"].indexOf(
        c[m.uri.utils.ComponentIndex.SCHEME]
      ) &&
    m.uri.utils.urlPackageSupportLoggingHandler_(a);
  return c;
};
m.uri.utils.decodeIfPossible_ = function (a, c) {
  return a ? (c ? decodeURI(a) : decodeURIComponent(a)) : a;
};
m.uri.utils.getComponentByIndex_ = function (a, c) {
  return m.uri.utils.split(c)[a] || null;
};
m.uri.utils.getScheme = function (a) {
  return m.uri.utils.getComponentByIndex_(m.uri.utils.ComponentIndex.SCHEME, a);
};
m.uri.utils.getEffectiveScheme = function (a) {
  a = m.uri.utils.getScheme(a);
  !a &&
    m.global.self &&
    m.global.self.location &&
    ((a = m.global.self.location.protocol), (a = a.substr(0, a.length - 1)));
  return a ? a.toLowerCase() : "";
};
m.uri.utils.getUserInfoEncoded = function () {
  return m.uri.utils.getComponentByIndex_(
    m.uri.utils.ComponentIndex.USER_INFO,
    void 0
  );
};
m.uri.utils.getUserInfo = function () {
  return m.uri.utils.decodeIfPossible_(m.uri.utils.getUserInfoEncoded());
};
m.uri.utils.getDomainEncoded = function () {
  return m.uri.utils.getComponentByIndex_(
    m.uri.utils.ComponentIndex.DOMAIN,
    void 0
  );
};
m.uri.utils.getDomain = function () {
  return m.uri.utils.decodeIfPossible_(m.uri.utils.getDomainEncoded(), !0);
};
m.uri.utils.getPort = function () {
  return (
    Number(
      m.uri.utils.getComponentByIndex_(m.uri.utils.ComponentIndex.PORT, void 0)
    ) || null
  );
};
m.uri.utils.getPathEncoded = function () {
  return m.uri.utils.getComponentByIndex_(
    m.uri.utils.ComponentIndex.PATH,
    void 0
  );
};
m.uri.utils.getPath = function () {
  return m.uri.utils.decodeIfPossible_(m.uri.utils.getPathEncoded(), !0);
};
m.uri.utils.getQueryData = function () {
  return m.uri.utils.getComponentByIndex_(
    m.uri.utils.ComponentIndex.QUERY_DATA,
    void 0
  );
};
m.uri.utils.getFragmentEncoded = function () {
  var a = (void 0).indexOf("#");
  return 0 > a ? null : (void 0).substr(a + 1);
};
m.uri.utils.setFragmentEncoded = function (a, c) {
  return m.uri.utils.removeFragment(a) + (c ? "#" + c : "");
};
m.uri.utils.getFragment = function () {
  return m.uri.utils.decodeIfPossible_(m.uri.utils.getFragmentEncoded());
};
m.uri.utils.getHost = function (a) {
  a = m.uri.utils.split(a);
  return m.uri.utils.buildFromEncodedParts(
    a[m.uri.utils.ComponentIndex.SCHEME],
    a[m.uri.utils.ComponentIndex.USER_INFO],
    a[m.uri.utils.ComponentIndex.DOMAIN],
    a[m.uri.utils.ComponentIndex.PORT]
  );
};
m.uri.utils.getOrigin = function (a) {
  a = m.uri.utils.split(a);
  return m.uri.utils.buildFromEncodedParts(
    a[m.uri.utils.ComponentIndex.SCHEME],
    null,
    a[m.uri.utils.ComponentIndex.DOMAIN],
    a[m.uri.utils.ComponentIndex.PORT]
  );
};
m.uri.utils.getPathAndAfter = function (a) {
  a = m.uri.utils.split(a);
  return m.uri.utils.buildFromEncodedParts(
    null,
    null,
    null,
    null,
    a[m.uri.utils.ComponentIndex.PATH],
    a[m.uri.utils.ComponentIndex.QUERY_DATA],
    a[m.uri.utils.ComponentIndex.FRAGMENT]
  );
};
m.uri.utils.removeFragment = function (a) {
  var c = a.indexOf("#");
  return 0 > c ? a : a.substr(0, c);
};
m.uri.utils.haveSameDomain = function (a, c) {
  a = m.uri.utils.split(a);
  c = m.uri.utils.split(c);
  return (
    a[m.uri.utils.ComponentIndex.DOMAIN] ==
      c[m.uri.utils.ComponentIndex.DOMAIN] &&
    a[m.uri.utils.ComponentIndex.SCHEME] ==
      c[m.uri.utils.ComponentIndex.SCHEME] &&
    a[m.uri.utils.ComponentIndex.PORT] == c[m.uri.utils.ComponentIndex.PORT]
  );
};
m.uri.utils.assertNoFragmentsOrQueries_ = function (a) {
  m.asserts.assert(
    0 > a.indexOf("#") && 0 > a.indexOf("?"),
    "goog.uri.utils: Fragment or query identifiers are not supported: [%s]",
    a
  );
};
m.uri.utils.parseQueryData = function (a, c) {
  if (a) {
    a = a.split("&");
    for (var d = 0; d < a.length; d++) {
      var e = a[d].indexOf("="),
        f = null;
      if (0 <= e) {
        var g = a[d].substring(0, e);
        f = a[d].substring(e + 1);
      } else g = a[d];
      c(g, f ? m.string.urlDecode(f) : "");
    }
  }
};
m.uri.utils.splitQueryData_ = function (a) {
  var c = a.indexOf("#");
  0 > c && (c = a.length);
  var d = a.indexOf("?");
  if (0 > d || d > c) {
    d = c;
    var e = "";
  } else e = a.substring(d + 1, c);
  return [a.substr(0, d), e, a.substr(c)];
};
m.uri.utils.joinQueryData_ = function (a) {
  return a[0] + (a[1] ? "?" + a[1] : "") + a[2];
};
m.uri.utils.appendQueryData_ = function (a, c) {
  return c ? (a ? a + "&" + c : c) : a;
};
m.uri.utils.appendQueryDataToUri_ = function (a, c) {
  if (!c) return a;
  a = m.uri.utils.splitQueryData_(a);
  a[1] = m.uri.utils.appendQueryData_(a[1], c);
  return m.uri.utils.joinQueryData_(a);
};
m.uri.utils.appendKeyValuePairs_ = function (a, c, d) {
  m.asserts.assertString(a);
  if (Array.isArray(c)) {
    m.asserts.assertArray(c);
    for (var e = 0; e < c.length; e++)
      m.uri.utils.appendKeyValuePairs_(a, String(c[e]), d);
  } else null != c && d.push(a + ("" === c ? "" : "=" + m.string.urlEncode(c)));
};
m.uri.utils.buildQueryData = function (a, c) {
  m.asserts.assert(
    0 == Math.max(a.length - (c || 0), 0) % 2,
    "goog.uri.utils: Key/value lists must be even in length."
  );
  var d = [];
  for (c = c || 0; c < a.length; c += 2)
    m.uri.utils.appendKeyValuePairs_(a[c], a[c + 1], d);
  return d.join("&");
};
m.uri.utils.buildQueryDataFromMap = function (a) {
  var c = [],
    d;
  for (d in a) m.uri.utils.appendKeyValuePairs_(d, a[d], c);
  return c.join("&");
};
m.uri.utils.appendParams = function (a, c) {
  var d =
    2 == arguments.length
      ? m.uri.utils.buildQueryData(arguments[1], 0)
      : m.uri.utils.buildQueryData(arguments, 1);
  return m.uri.utils.appendQueryDataToUri_(a, d);
};
m.uri.utils.appendParamsFromMap = function (a, c) {
  c = m.uri.utils.buildQueryDataFromMap(c);
  return m.uri.utils.appendQueryDataToUri_(a, c);
};
m.uri.utils.appendParam = function (a, c, d) {
  d = null != d ? "=" + m.string.urlEncode(d) : "";
  return m.uri.utils.appendQueryDataToUri_(a, c + d);
};
m.uri.utils.findParam_ = function (a, c, d, e) {
  for (var f = d.length; 0 <= (c = a.indexOf(d, c)) && c < e; ) {
    var g = a.charCodeAt(c - 1);
    if (
      g == m.uri.utils.CharCode_.AMPERSAND ||
      g == m.uri.utils.CharCode_.QUESTION
    )
      if (
        ((g = a.charCodeAt(c + f)),
        !g ||
          g == m.uri.utils.CharCode_.EQUAL ||
          g == m.uri.utils.CharCode_.AMPERSAND ||
          g == m.uri.utils.CharCode_.HASH)
      )
        return c;
    c += f + 1;
  }
  return -1;
};
m.uri.utils.hashOrEndRe_ = /#|$/;
m.uri.utils.hasParam = function (a, c) {
  return (
    0 <= m.uri.utils.findParam_(a, 0, c, a.search(m.uri.utils.hashOrEndRe_))
  );
};
m.uri.utils.getParamValue = function (a, c) {
  var d = a.search(m.uri.utils.hashOrEndRe_),
    e = m.uri.utils.findParam_(a, 0, c, d);
  if (0 > e) return null;
  var f = a.indexOf("&", e);
  if (0 > f || f > d) f = d;
  e += c.length + 1;
  return m.string.urlDecode(a.substr(e, f - e));
};
m.uri.utils.getParamValues = function (a, c) {
  for (
    var d = a.search(m.uri.utils.hashOrEndRe_), e = 0, f, g = [];
    0 <= (f = m.uri.utils.findParam_(a, e, c, d));

  ) {
    e = a.indexOf("&", f);
    if (0 > e || e > d) e = d;
    f += c.length + 1;
    g.push(m.string.urlDecode(a.substr(f, e - f)));
  }
  return g;
};
m.uri.utils.trailingQueryPunctuationRe_ = /[?&]($|#)/;
m.uri.utils.removeParam = function (a, c) {
  for (
    var d = a.search(m.uri.utils.hashOrEndRe_), e = 0, f, g = [];
    0 <= (f = m.uri.utils.findParam_(a, e, c, d));

  )
    g.push(a.substring(e, f)), (e = Math.min(a.indexOf("&", f) + 1 || d, d));
  g.push(a.substr(e));
  return g.join("").replace(m.uri.utils.trailingQueryPunctuationRe_, "$1");
};
m.uri.utils.setParam = function (a) {
  var c = m.uri.utils.StandardQueryParam.RANDOM,
    d = m.string.getRandomString();
  return m.uri.utils.appendParam(m.uri.utils.removeParam(a, c), c, d);
};
m.uri.utils.setParamsFromMap = function (a, c) {
  a = m.uri.utils.splitQueryData_(a);
  var d = a[1],
    e = [];
  d &&
    d.split("&").forEach(function (f) {
      var g = f.indexOf("=");
      c.hasOwnProperty(0 <= g ? f.substr(0, g) : f) || e.push(f);
    });
  a[1] = m.uri.utils.appendQueryData_(
    e.join("&"),
    m.uri.utils.buildQueryDataFromMap(c)
  );
  return m.uri.utils.joinQueryData_(a);
};
m.uri.utils.appendPath = function (a, c) {
  m.uri.utils.assertNoFragmentsOrQueries_(a);
  m.string.endsWith(a, "/") && (a = a.substr(0, a.length - 1));
  m.string.startsWith(c, "/") && (c = c.substr(1));
  return "" + a + "/" + c;
};
m.uri.utils.setPath = function (a, c) {
  m.string.startsWith(c, "/");
  m.uri.utils.split(a);
};
m.uri.utils.StandardQueryParam = { RANDOM: "zx" };
m.uri.utils.makeUnique = function (a) {
  return m.uri.utils.setParam(a);
};
m.Uri = function (a, c) {
  this.domain_ = this.userInfo_ = this.scheme_ = "";
  this.port_ = null;
  this.fragment_ = this.path_ = "";
  this.ignoreCase_ = this.isReadOnly_ = !1;
  var d;
  a instanceof m.Uri
    ? ((this.ignoreCase_ = void 0 !== c ? c : a.ignoreCase_),
      Pa(this, a.getScheme()),
      Qa(this, a.getUserInfo()),
      Ra(this, a.getDomain()),
      Sa(this, a.getPort()),
      this.setPath(a.getPath()),
      N(this, a.getQueryData().clone()),
      Ta(this, a.getFragment()))
    : a && (d = m.uri.utils.split(String(a)))
    ? ((this.ignoreCase_ = !!c),
      Pa(this, d[m.uri.utils.ComponentIndex.SCHEME] || "", !0),
      Qa(this, d[m.uri.utils.ComponentIndex.USER_INFO] || "", !0),
      Ra(this, d[m.uri.utils.ComponentIndex.DOMAIN] || "", !0),
      Sa(this, d[m.uri.utils.ComponentIndex.PORT]),
      this.setPath(d[m.uri.utils.ComponentIndex.PATH] || "", !0),
      N(this, d[m.uri.utils.ComponentIndex.QUERY_DATA] || "", !0),
      Ta(this, d[m.uri.utils.ComponentIndex.FRAGMENT] || "", !0))
    : ((this.ignoreCase_ = !!c),
      (this.queryData_ = new m.Uri.QueryData(null, this.ignoreCase_)));
};
m.Uri.RANDOM_PARAM = m.uri.utils.StandardQueryParam.RANDOM;
m.Uri.prototype.toString = function () {
  var a = [],
    c = this.getScheme();
  c &&
    a.push(
      m.Uri.encodeSpecialChars_(c, m.Uri.reDisallowedInSchemeOrUserInfo_, !0),
      ":"
    );
  var d = this.getDomain();
  if (d || "file" == c)
    a.push("//"),
      (c = this.getUserInfo()) &&
        a.push(
          m.Uri.encodeSpecialChars_(
            c,
            m.Uri.reDisallowedInSchemeOrUserInfo_,
            !0
          ),
          "@"
        ),
      a.push(m.Uri.removeDoubleEncoding_(m.string.urlEncode(d))),
      (d = this.getPort()),
      null != d && a.push(":", String(d));
  if ((d = this.getPath()))
    this.domain_ && "/" != d.charAt(0) && a.push("/"),
      a.push(
        m.Uri.encodeSpecialChars_(
          d,
          "/" == d.charAt(0)
            ? m.Uri.reDisallowedInAbsolutePath_
            : m.Uri.reDisallowedInRelativePath_,
          !0
        )
      );
  (d = this.queryData_.toString()) && a.push("?", d);
  (d = this.getFragment()) &&
    a.push("#", m.Uri.encodeSpecialChars_(d, m.Uri.reDisallowedInFragment_));
  return a.join("");
};
m.Uri.prototype.resolve = function (a) {
  var c = this.clone(),
    d = !!a.scheme_;
  d ? Pa(c, a.getScheme()) : (d = !!a.userInfo_);
  d ? Qa(c, a.getUserInfo()) : (d = !!a.domain_);
  d ? Ra(c, a.getDomain()) : (d = null != a.port_);
  var e = a.getPath();
  if (d) Sa(c, a.getPort());
  else if ((d = !!a.path_)) {
    if ("/" != e.charAt(0))
      if (this.domain_ && !this.path_) e = "/" + e;
      else {
        var f = c.getPath().lastIndexOf("/");
        -1 != f && (e = c.getPath().substr(0, f + 1) + e);
      }
    e = m.Uri.removeDotSegments(e);
  }
  d ? c.setPath(e) : (d = "" !== a.queryData_.toString());
  d ? N(c, a.getQueryData().clone()) : (d = !!a.fragment_);
  d && Ta(c, a.getFragment());
  return c;
};
m.Uri.prototype.clone = function () {
  return new m.Uri(this);
};
m.Uri.prototype.getScheme = function () {
  return this.scheme_;
};
var Pa = function (a, c, d) {
  O(a);
  a.scheme_ = d ? m.Uri.decodeOrEmpty_(c, !0) : c;
  a.scheme_ && (a.scheme_ = a.scheme_.replace(/:$/, ""));
};
m.Uri.prototype.getUserInfo = function () {
  return this.userInfo_;
};
var Qa = function (a, c, d) {
  O(a);
  a.userInfo_ = d ? m.Uri.decodeOrEmpty_(c) : c;
};
m.Uri.prototype.getDomain = function () {
  return this.domain_;
};
var Ra = function (a, c, d) {
  O(a);
  a.domain_ = d ? m.Uri.decodeOrEmpty_(c, !0) : c;
};
m.Uri.prototype.getPort = function () {
  return this.port_;
};
var Sa = function (a, c) {
  O(a);
  if (c) {
    c = Number(c);
    if (isNaN(c) || 0 > c) throw Error("Bad port number " + c);
    a.port_ = c;
  } else a.port_ = null;
};
m.Uri.prototype.getPath = function () {
  return this.path_;
};
m.Uri.prototype.setPath = function (a, c) {
  O(this);
  this.path_ = c ? m.Uri.decodeOrEmpty_(a, !0) : a;
};
var N = function (a, c, d) {
  O(a);
  c instanceof m.Uri.QueryData
    ? ((a.queryData_ = c), a.queryData_.setIgnoreCase(a.ignoreCase_))
    : (d || (c = m.Uri.encodeSpecialChars_(c, m.Uri.reDisallowedInQuery_)),
      (a.queryData_ = new m.Uri.QueryData(c, a.ignoreCase_)));
};
m.Uri.prototype.getQueryData = function () {
  return this.queryData_;
};
m.Uri.prototype.getQuery = function () {
  return this.queryData_.toString();
};
var P = function (a, c, d) {
  O(a);
  a.queryData_.set(c, d);
};
m.Uri.prototype.getFragment = function () {
  return this.fragment_;
};
var Ta = function (a, c, d) {
  O(a);
  a.fragment_ = d ? m.Uri.decodeOrEmpty_(c) : c;
};
m.Uri.prototype.makeUnique = function () {
  O(this);
  P(this, m.Uri.RANDOM_PARAM, m.string.getRandomString());
  return this;
};
m.Uri.prototype.removeParameter = function (a) {
  O(this);
  this.queryData_.remove(a);
  return this;
};
var O = function (a) {
  if (a.isReadOnly_) throw Error("Tried to modify a read-only Uri");
};
m.Uri.prototype.setIgnoreCase = function (a) {
  this.ignoreCase_ = a;
  this.queryData_ && this.queryData_.setIgnoreCase(a);
};
m.Uri.parse = function (a, c) {
  return a instanceof m.Uri ? a.clone() : new m.Uri(a, c);
};
m.Uri.create = function (a, c, d, e, f, g, h, l) {
  l = new m.Uri(null, l);
  a && Pa(l, a);
  c && Qa(l, c);
  d && Ra(l, d);
  e && Sa(l, e);
  f && l.setPath(f);
  g && N(l, g);
  h && Ta(l, h);
  return l;
};
m.Uri.resolve = function (a, c) {
  a instanceof m.Uri || (a = m.Uri.parse(a));
  c instanceof m.Uri || (c = m.Uri.parse(c));
  return a.resolve(c);
};
m.Uri.removeDotSegments = function (a) {
  if (".." == a || "." == a) return "";
  if (m.string.contains(a, "./") || m.string.contains(a, "/.")) {
    var c = m.string.startsWith(a, "/");
    a = a.split("/");
    for (var d = [], e = 0; e < a.length; ) {
      var f = a[e++];
      "." == f
        ? c && e == a.length && d.push("")
        : ".." == f
        ? ((1 < d.length || (1 == d.length && "" != d[0])) && d.pop(),
          c && e == a.length && d.push(""))
        : (d.push(f), (c = !0));
    }
    return d.join("/");
  }
  return a;
};
m.Uri.decodeOrEmpty_ = function (a, c) {
  return a
    ? c
      ? decodeURI(a.replace(/%25/g, "%2525"))
      : decodeURIComponent(a)
    : "";
};
m.Uri.encodeSpecialChars_ = function (a, c, d) {
  return "string" === typeof a
    ? ((a = encodeURI(a).replace(c, m.Uri.encodeChar_)),
      d && (a = m.Uri.removeDoubleEncoding_(a)),
      a)
    : null;
};
m.Uri.encodeChar_ = function (a) {
  a = a.charCodeAt(0);
  return "%" + ((a >> 4) & 15).toString(16) + (a & 15).toString(16);
};
m.Uri.removeDoubleEncoding_ = function (a) {
  return a.replace(/%25([0-9a-fA-F]{2})/g, "%$1");
};
m.Uri.reDisallowedInSchemeOrUserInfo_ = /[#\/\?@]/g;
m.Uri.reDisallowedInRelativePath_ = /[#\?:]/g;
m.Uri.reDisallowedInAbsolutePath_ = /[#\?]/g;
m.Uri.reDisallowedInQuery_ = /[#\?@]/g;
m.Uri.reDisallowedInFragment_ = /#/g;
m.Uri.haveSameDomain = function (a, c) {
  a = m.uri.utils.split(a);
  c = m.uri.utils.split(c);
  return (
    a[m.uri.utils.ComponentIndex.DOMAIN] ==
      c[m.uri.utils.ComponentIndex.DOMAIN] &&
    a[m.uri.utils.ComponentIndex.PORT] == c[m.uri.utils.ComponentIndex.PORT]
  );
};
m.Uri.QueryData = function (a, c) {
  this.count_ = this.keyMap_ = null;
  this.encodedQuery_ = a || null;
  this.ignoreCase_ = !!c;
};
var Q = function (a) {
  a.keyMap_ ||
    ((a.keyMap_ = new m.structs.Map()),
    (a.count_ = 0),
    a.encodedQuery_ &&
      m.uri.utils.parseQueryData(a.encodedQuery_, function (c, d) {
        a.add(m.string.urlDecode(c), d);
      }));
};
m.Uri.QueryData.createFromMap = function (a, c) {
  var d = m.structs.getKeys(a);
  if ("undefined" == typeof d) throw Error("Keys are undefined");
  c = new m.Uri.QueryData(null, c);
  a = m.structs.getValues(a);
  for (var e = 0; e < d.length; e++) {
    var f = d[e],
      g = a[e];
    Array.isArray(g) ? Ua(c, f, g) : c.add(f, g);
  }
  return c;
};
m.Uri.QueryData.createFromKeysValues = function (a, c, d) {
  if (a.length != c.length) throw Error("Mismatched lengths for keys/values");
  d = new m.Uri.QueryData(null, d);
  for (var e = 0; e < a.length; e++) d.add(a[e], c[e]);
  return d;
};
b = m.Uri.QueryData.prototype;
b.getCount = function () {
  Q(this);
  return this.count_;
};
b.add = function (a, c) {
  Q(this);
  this.encodedQuery_ = null;
  a = R(this, a);
  var d = this.keyMap_.get(a);
  d || this.keyMap_.set(a, (d = []));
  d.push(c);
  this.count_ = m.asserts.assertNumber(this.count_) + 1;
  return this;
};
b.remove = function (a) {
  Q(this);
  a = R(this, a);
  return this.keyMap_.containsKey(a)
    ? ((this.encodedQuery_ = null),
      (this.count_ =
        m.asserts.assertNumber(this.count_) - this.keyMap_.get(a).length),
      this.keyMap_.remove(a))
    : !1;
};
b.clear = function () {
  this.keyMap_ = this.encodedQuery_ = null;
  this.count_ = 0;
};
b.isEmpty = function () {
  Q(this);
  return 0 == this.count_;
};
b.containsKey = function (a) {
  Q(this);
  a = R(this, a);
  return this.keyMap_.containsKey(a);
};
b.containsValue = function (a) {
  var c = this.getValues();
  return y(c, a);
};
b.forEach = function (a, c) {
  Q(this);
  this.keyMap_.forEach(function (d, e) {
    w(
      d,
      function (f) {
        a.call(c, f, e, this);
      },
      this
    );
  }, this);
};
b.getKeys = function () {
  Q(this);
  for (
    var a = this.keyMap_.getValues(), c = this.keyMap_.getKeys(), d = [], e = 0;
    e < c.length;
    e++
  )
    for (var f = a[e], g = 0; g < f.length; g++) d.push(c[e]);
  return d;
};
b.getValues = function (a) {
  Q(this);
  var c = [];
  if ("string" === typeof a)
    this.containsKey(a) && (c = B(c, this.keyMap_.get(R(this, a))));
  else {
    a = this.keyMap_.getValues();
    for (var d = 0; d < a.length; d++) c = B(c, a[d]);
  }
  return c;
};
b.set = function (a, c) {
  Q(this);
  this.encodedQuery_ = null;
  a = R(this, a);
  this.containsKey(a) &&
    (this.count_ =
      m.asserts.assertNumber(this.count_) - this.keyMap_.get(a).length);
  this.keyMap_.set(a, [c]);
  this.count_ = m.asserts.assertNumber(this.count_) + 1;
  return this;
};
b.get = function (a, c) {
  if (!a) return c;
  a = this.getValues(a);
  return 0 < a.length ? String(a[0]) : c;
};
var Ua = function (a, c, d) {
  a.remove(c);
  0 < d.length &&
    ((a.encodedQuery_ = null),
    a.keyMap_.set(R(a, c), C(d)),
    (a.count_ = m.asserts.assertNumber(a.count_) + d.length));
};
m.Uri.QueryData.prototype.toString = function () {
  if (this.encodedQuery_) return this.encodedQuery_;
  if (!this.keyMap_) return "";
  for (var a = [], c = this.keyMap_.getKeys(), d = 0; d < c.length; d++) {
    var e = c[d],
      f = m.string.urlEncode(e);
    e = this.getValues(e);
    for (var g = 0; g < e.length; g++) {
      var h = f;
      "" !== e[g] && (h += "=" + m.string.urlEncode(e[g]));
      a.push(h);
    }
  }
  return (this.encodedQuery_ = a.join("&"));
};
m.Uri.QueryData.prototype.clone = function () {
  var a = new m.Uri.QueryData();
  a.encodedQuery_ = this.encodedQuery_;
  this.keyMap_ &&
    ((a.keyMap_ = this.keyMap_.clone()), (a.count_ = this.count_));
  return a;
};
var R = function (a, c) {
  c = String(c);
  a.ignoreCase_ && (c = c.toLowerCase());
  return c;
};
m.Uri.QueryData.prototype.setIgnoreCase = function (a) {
  a &&
    !this.ignoreCase_ &&
    (Q(this),
    (this.encodedQuery_ = null),
    this.keyMap_.forEach(function (c, d) {
      var e = d.toLowerCase();
      d != e && (this.remove(d), Ua(this, e, c));
    }, this));
  this.ignoreCase_ = a;
};
m.Uri.QueryData.prototype.extend = function (a) {
  for (var c = 0; c < arguments.length; c++)
    m.structs.forEach(
      arguments[c],
      function (d, e) {
        this.add(e, d);
      },
      this
    );
};
L.Errors = {};
var Va = {
  MINT_JWT_ERROR: "MINT_JWT_ERROR",
  PURCHASE_CANCELED: "PURCHASE_CANCELED",
  CONSUME_PURCHASE_ERROR: "CONSUME_PURCHASE_ERROR",
  GET_PURCHASES_ERROR: "GET_PURCHASES_ERROR",
  GET_SKU_DETAILS_ERROR: "GET_SKU_DETAILS_ERROR",
  ENV_NOT_SUPPORTED_ERROR: "ENV_NOT_SUPPORTED_ERROR",
  TOKEN_MISSING_ERROR: "TOKEN_MISSING_ERROR",
  INVALID_RESPONSE_ERROR: "INVALID_RESPONSE_ERROR",
};
function Wa(a) {
  return { request: {}, response: { errorType: a } };
}
L.Errors.ErrorTypes = Va;
L.Errors.getErrorResponse = Wa;
var S = function (a) {
    this.baseUrl_ = a || S.Environment.SANDBOX;
    this.baseUrlAndPath_ = this.baseUrl_ + S.WEB_STORE_REQUEST_PATH_;
  },
  Xa = function (a, c, d, e, f, g, h, l, n, p) {
    var v = d ? d : "",
      W = l || "application/x-www-form-urlencoded",
      jb = function (F, t) {
        if (t && 200 == F) {
          F = null;
          try {
            F = JSON.parse(t);
          } catch (Gb) {
            g(Va.INVALID_RESPONSE_ERROR);
            return;
          }
          f(F);
        } else g(Va.INVALID_RESPONSE_ERROR);
      },
      lb = function (F) {
        if (F) {
          var t = new XMLHttpRequest();
          t.open(e, c);
          t.setRequestHeader("Authorization", "Bearer " + F);
          t.setRequestHeader("Content-Type", W);
          t.onreadystatechange = function () {
            4 == t.readyState &&
              (401 == t.status && F
                ? chrome.identity.removeCachedAuthToken(
                    { token: F },
                    function () {
                      h
                        ? Xa(a, e, d, e, f, g, !1, l, n, p)
                        : (t, jb(t.status, t.responseText));
                    }
                  )
                : (t, jb(t.status, t.responseText)));
          };
          t.send(v);
        } else g(Va.TOKEN_MISSING_ERROR);
      };
    p ? lb(p) : chrome.identity.getAuthToken({ interactive: n || !1 }, lb);
  };
S.prototype.onFailure_ = function (a, c, d) {
  a(Wa(d || c));
};
var Ya = function (a, c, d, e, f, g, h, l) {
  c = { hl: window.navigator.language, itemId: c, sku: d, paymentVersion: 1 };
  h && (c.gl = h);
  h = new m.Uri.QueryData();
  l && h.add("projection", l);
  l = new m.Uri(a.baseUrlAndPath_ + "/payments/buy");
  N(l, h);
  f = m.bind(a.onFailure_, a, f, Va.MINT_JWT_ERROR);
  Xa(
    a,
    l.toString(),
    JSON.stringify(c),
    "POST",
    function (n) {
      e(n.jwt, n.paymentData, n.signature);
    },
    f,
    !0,
    "application/json",
    void 0,
    g
  );
};
S.Environment = {
  PROD: "https://www.googleapis.com",
  SANDBOX: "https://www-googleapis-staging.sandbox.google.com",
};
S.WEB_STORE_REQUEST_PATH_ = "/chromewebstore/v1.1";
L.WebStoreService = S;
m.dom.BrowserFeature = {};
m.dom.BrowserFeature.ASSUME_NO_OFFSCREEN_CANVAS = !1;
m.dom.BrowserFeature.ASSUME_OFFSCREEN_CANVAS = !1;
m.dom.BrowserFeature.detectOffscreenCanvas_ = function () {
  try {
    return !!new self.OffscreenCanvas(0, 0).getContext("2d");
  } catch (a) {}
  return !1;
};
m.dom.BrowserFeature.OFFSCREEN_CANVAS_2D =
  !m.dom.BrowserFeature.ASSUME_NO_OFFSCREEN_CANVAS &&
  (m.dom.BrowserFeature.ASSUME_OFFSCREEN_CANVAS ||
    m.dom.BrowserFeature.detectOffscreenCanvas_());
m.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES =
  !m.userAgent.IE || m.userAgent.isDocumentModeOrHigher(9);
m.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE =
  (!m.userAgent.GECKO && !m.userAgent.IE) ||
  (m.userAgent.IE && m.userAgent.isDocumentModeOrHigher(9)) ||
  (m.userAgent.GECKO && m.userAgent.isVersionOrHigher("1.9.1"));
m.dom.BrowserFeature.CAN_USE_INNER_TEXT =
  m.userAgent.IE && !m.userAgent.isVersionOrHigher("9");
m.dom.BrowserFeature.CAN_USE_PARENT_ELEMENT_PROPERTY =
  m.userAgent.IE || m.userAgent.OPERA || m.userAgent.WEBKIT;
m.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT = m.userAgent.IE;
m.dom.BrowserFeature.LEGACY_IE_RANGES =
  m.userAgent.IE && !m.userAgent.isDocumentModeOrHigher(9);
m.math.Coordinate = function (a, c) {
  this.x = void 0 !== a ? a : 0;
  this.y = void 0 !== c ? c : 0;
};
m.math.Coordinate.prototype.clone = function () {
  return new m.math.Coordinate(this.x, this.y);
};
m.DEBUG &&
  (m.math.Coordinate.prototype.toString = function () {
    return "(" + this.x + ", " + this.y + ")";
  });
m.math.Coordinate.prototype.equals = function (a) {
  return a instanceof m.math.Coordinate && m.math.Coordinate.equals(this, a);
};
m.math.Coordinate.equals = function (a, c) {
  return a == c ? !0 : a && c ? a.x == c.x && a.y == c.y : !1;
};
m.math.Coordinate.distance = function (a, c) {
  var d = a.x - c.x;
  a = a.y - c.y;
  return Math.sqrt(d * d + a * a);
};
m.math.Coordinate.magnitude = function (a) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
};
m.math.Coordinate.azimuth = function (a) {
  return m.math.angle(0, 0, a.x, a.y);
};
m.math.Coordinate.squaredDistance = function (a, c) {
  var d = a.x - c.x;
  a = a.y - c.y;
  return d * d + a * a;
};
m.math.Coordinate.difference = function (a, c) {
  return new m.math.Coordinate(a.x - c.x, a.y - c.y);
};
m.math.Coordinate.sum = function (a, c) {
  return new m.math.Coordinate(a.x + c.x, a.y + c.y);
};
b = m.math.Coordinate.prototype;
b.ceil = function () {
  this.x = Math.ceil(this.x);
  this.y = Math.ceil(this.y);
  return this;
};
b.floor = function () {
  this.x = Math.floor(this.x);
  this.y = Math.floor(this.y);
  return this;
};
b.round = function () {
  this.x = Math.round(this.x);
  this.y = Math.round(this.y);
  return this;
};
b.translate = function (a, c) {
  a instanceof m.math.Coordinate
    ? ((this.x += a.x), (this.y += a.y))
    : ((this.x += Number(a)), "number" === typeof c && (this.y += c));
  return this;
};
b.scale = function (a, c) {
  this.x *= a;
  this.y *= "number" === typeof c ? c : a;
  return this;
};
m.math.Size = function (a, c) {
  this.width = a;
  this.height = c;
};
m.math.Size.equals = function (a, c) {
  return a == c ? !0 : a && c ? a.width == c.width && a.height == c.height : !1;
};
m.math.Size.prototype.clone = function () {
  return new m.math.Size(this.width, this.height);
};
m.DEBUG &&
  (m.math.Size.prototype.toString = function () {
    return "(" + this.width + " x " + this.height + ")";
  });
b = m.math.Size.prototype;
b.aspectRatio = function () {
  return this.width / this.height;
};
b.isEmpty = function () {
  return !(this.width * this.height);
};
b.ceil = function () {
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this;
};
b.floor = function () {
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this;
};
b.round = function () {
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this;
};
b.scale = function (a, c) {
  this.width *= a;
  this.height *= "number" === typeof c ? c : a;
  return this;
};
m.dom.ASSUME_QUIRKS_MODE = !1;
m.dom.ASSUME_STANDARDS_MODE = !1;
m.dom.COMPAT_MODE_KNOWN_ =
  m.dom.ASSUME_QUIRKS_MODE || m.dom.ASSUME_STANDARDS_MODE;
m.dom.getDomHelper = function (a) {
  return a
    ? new m.dom.DomHelper(m.dom.getOwnerDocument(a))
    : m.dom.defaultDomHelper_ ||
        (m.dom.defaultDomHelper_ = new m.dom.DomHelper());
};
m.dom.getDocument = function () {
  return document;
};
m.dom.getElement = function (a) {
  return m.dom.getElementHelper_(document, a);
};
m.dom.getElementHelper_ = function (a, c) {
  return "string" === typeof c ? a.getElementById(c) : c;
};
m.dom.getRequiredElement = function (a) {
  return m.dom.getRequiredElementHelper_(document, a);
};
m.dom.getRequiredElementHelper_ = function (a, c) {
  m.asserts.assertString(c);
  a = m.dom.getElementHelper_(a, c);
  return (a = m.asserts.assertElement(a, "No element found with id: " + c));
};
m.dom.$ = m.dom.getElement;
m.dom.getElementsByTagName = function (a, c) {
  return (c || document).getElementsByTagName(String(a));
};
m.dom.getElementsByTagNameAndClass = function (a, c, d) {
  return m.dom.getElementsByTagNameAndClass_(document, a, c, d);
};
m.dom.getElementByTagNameAndClass = function (a, c, d) {
  return m.dom.getElementByTagNameAndClass_(document, a, c, d);
};
m.dom.getElementsByClass = function (a, c) {
  var d = c || document;
  return m.dom.canUseQuerySelector_(d)
    ? d.querySelectorAll("." + a)
    : m.dom.getElementsByTagNameAndClass_(document, "*", a, c);
};
m.dom.getElementByClass = function (a, c) {
  var d = c || document;
  return (
    (d.getElementsByClassName
      ? d.getElementsByClassName(a)[0]
      : m.dom.getElementByTagNameAndClass_(document, "*", a, c)) || null
  );
};
m.dom.getRequiredElementByClass = function (a, c) {
  c = m.dom.getElementByClass(a, c);
  return m.asserts.assert(c, "No element found with className: " + a);
};
m.dom.canUseQuerySelector_ = function (a) {
  return !(!a.querySelectorAll || !a.querySelector);
};
m.dom.getElementsByTagNameAndClass_ = function (a, c, d, e) {
  a = e || a;
  c = c && "*" != c ? String(c).toUpperCase() : "";
  if (m.dom.canUseQuerySelector_(a) && (c || d))
    return a.querySelectorAll(c + (d ? "." + d : ""));
  if (d && a.getElementsByClassName) {
    a = a.getElementsByClassName(d);
    if (c) {
      e = {};
      for (var f = 0, g = 0, h; (h = a[g]); g++)
        c == h.nodeName && (e[f++] = h);
      e.length = f;
      return e;
    }
    return a;
  }
  a = a.getElementsByTagName(c || "*");
  if (d) {
    e = {};
    for (g = f = 0; (h = a[g]); g++)
      (c = h.className),
        "function" == typeof c.split && y(c.split(/\s+/), d) && (e[f++] = h);
    e.length = f;
    return e;
  }
  return a;
};
m.dom.getElementByTagNameAndClass_ = function (a, c, d, e) {
  var f = e || a,
    g = c && "*" != c ? String(c).toUpperCase() : "";
  return m.dom.canUseQuerySelector_(f) && (g || d)
    ? f.querySelector(g + (d ? "." + d : ""))
    : m.dom.getElementsByTagNameAndClass_(a, c, d, e)[0] || null;
};
m.dom.$$ = m.dom.getElementsByTagNameAndClass;
m.dom.setProperties = function (a, c) {
  m.object.forEach(c, function (d, e) {
    d &&
      "object" == typeof d &&
      d.implementsGoogStringTypedString &&
      (d = d.getTypedStringValue());
    "style" == e
      ? (a.style.cssText = d)
      : "class" == e
      ? (a.className = d)
      : "for" == e
      ? (a.htmlFor = d)
      : m.dom.DIRECT_ATTRIBUTE_MAP_.hasOwnProperty(e)
      ? a.setAttribute(m.dom.DIRECT_ATTRIBUTE_MAP_[e], d)
      : m.string.startsWith(e, "aria-") || m.string.startsWith(e, "data-")
      ? a.setAttribute(e, d)
      : (a[e] = d);
  });
};
m.dom.DIRECT_ATTRIBUTE_MAP_ = {
  cellpadding: "cellPadding",
  cellspacing: "cellSpacing",
  colspan: "colSpan",
  frameborder: "frameBorder",
  height: "height",
  maxlength: "maxLength",
  nonce: "nonce",
  role: "role",
  rowspan: "rowSpan",
  type: "type",
  usemap: "useMap",
  valign: "vAlign",
  width: "width",
};
m.dom.getViewportSize = function (a) {
  return m.dom.getViewportSize_(a || window);
};
m.dom.getViewportSize_ = function (a) {
  a = a.document;
  a = m.dom.isCss1CompatMode_(a) ? a.documentElement : a.body;
  return new m.math.Size(a.clientWidth, a.clientHeight);
};
m.dom.getDocumentHeight = function () {
  return m.dom.getDocumentHeight_(window);
};
m.dom.getDocumentHeightForWindow = function (a) {
  return m.dom.getDocumentHeight_(a);
};
m.dom.getDocumentHeight_ = function (a) {
  var c = a.document,
    d = 0;
  if (c) {
    d = c.body;
    var e = c.documentElement;
    if (!e || !d) return 0;
    a = m.dom.getViewportSize_(a).height;
    if (m.dom.isCss1CompatMode_(c) && e.scrollHeight)
      d = e.scrollHeight != a ? e.scrollHeight : e.offsetHeight;
    else {
      c = e.scrollHeight;
      var f = e.offsetHeight;
      e.clientHeight != f && ((c = d.scrollHeight), (f = d.offsetHeight));
      d = c > a ? (c > f ? c : f) : c < f ? c : f;
    }
  }
  return d;
};
m.dom.getPageScroll = function (a) {
  return m.dom
    .getDomHelper((a || m.global || window).document)
    .getDocumentScroll();
};
m.dom.getDocumentScroll = function () {
  return m.dom.getDocumentScroll_(document);
};
m.dom.getDocumentScroll_ = function (a) {
  var c = m.dom.getDocumentScrollElement_(a);
  a = m.dom.getWindow_(a);
  return m.userAgent.IE &&
    m.userAgent.isVersionOrHigher("10") &&
    a.pageYOffset != c.scrollTop
    ? new m.math.Coordinate(c.scrollLeft, c.scrollTop)
    : new m.math.Coordinate(
        a.pageXOffset || c.scrollLeft,
        a.pageYOffset || c.scrollTop
      );
};
m.dom.getDocumentScrollElement = function () {
  return m.dom.getDocumentScrollElement_(document);
};
m.dom.getDocumentScrollElement_ = function (a) {
  return a.scrollingElement
    ? a.scrollingElement
    : !m.userAgent.WEBKIT && m.dom.isCss1CompatMode_(a)
    ? a.documentElement
    : a.body || a.documentElement;
};
m.dom.getWindow = function (a) {
  return a ? m.dom.getWindow_(a) : window;
};
m.dom.getWindow_ = function (a) {
  return a.parentWindow || a.defaultView;
};
m.dom.createDom = function (a, c, d) {
  return m.dom.createDom_(document, arguments);
};
m.dom.createDom_ = function (a, c) {
  var d = String(c[0]),
    e = c[1];
  if (
    !m.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES &&
    e &&
    (e.name || e.type)
  ) {
    d = ["<", d];
    e.name && d.push(' name="', m.string.htmlEscape(e.name), '"');
    if (e.type) {
      d.push(' type="', m.string.htmlEscape(e.type), '"');
      var f = {};
      m.object.extend(f, e);
      delete f.type;
      e = f;
    }
    d.push(">");
    d = d.join("");
  }
  d = m.dom.createElement_(a, d);
  e &&
    ("string" === typeof e
      ? (d.className = e)
      : Array.isArray(e)
      ? (d.className = e.join(" "))
      : m.dom.setProperties(d, e));
  2 < c.length && m.dom.append_(a, d, c, 2);
  return d;
};
m.dom.append_ = function (a, c, d, e) {
  function f(h) {
    h && c.appendChild("string" === typeof h ? a.createTextNode(h) : h);
  }
  for (; e < d.length; e++) {
    var g = d[e];
    m.isArrayLike(g) && !m.dom.isNodeLike(g)
      ? w(m.dom.isNodeList(g) ? C(g) : g, f)
      : f(g);
  }
};
m.dom.$dom = m.dom.createDom;
m.dom.createElement = function (a) {
  return m.dom.createElement_(document, a);
};
m.dom.createElement_ = function (a, c) {
  c = String(c);
  "application/xhtml+xml" === a.contentType && (c = c.toLowerCase());
  return a.createElement(c);
};
m.dom.createTextNode = function (a) {
  return document.createTextNode(String(a));
};
m.dom.createTable = function (a, c, d) {
  return m.dom.createTable_(document, a, c, !!d);
};
m.dom.createTable_ = function (a, c, d, e) {
  for (
    var f = m.dom.createElement_(a, m.dom.TagName.TABLE),
      g = f.appendChild(m.dom.createElement_(a, m.dom.TagName.TBODY)),
      h = 0;
    h < c;
    h++
  ) {
    for (var l = m.dom.createElement_(a, m.dom.TagName.TR), n = 0; n < d; n++) {
      var p = m.dom.createElement_(a, m.dom.TagName.TD);
      e && m.dom.setTextContent(p, m.string.Unicode.NBSP);
      l.appendChild(p);
    }
    g.appendChild(l);
  }
  return f;
};
m.dom.constHtmlToNode = function (a) {
  var c = x(arguments, m.string.Const.unwrap);
  c = m.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract(
    m.string.Const.from(
      "Constant HTML string, that gets turned into a Node later, so it will be automatically balanced."
    ),
    c.join("")
  );
  return m.dom.safeHtmlToNode(c);
};
m.dom.safeHtmlToNode = function (a) {
  return m.dom.safeHtmlToNode_(document, a);
};
m.dom.safeHtmlToNode_ = function (a, c) {
  var d = m.dom.createElement_(a, m.dom.TagName.DIV);
  m.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT
    ? (m.dom.safe.setInnerHtml(
        d,
        m.html.SafeHtml.concat(m.html.SafeHtml.BR, c)
      ),
      d.removeChild(m.asserts.assert(d.firstChild)))
    : m.dom.safe.setInnerHtml(d, c);
  return m.dom.childrenToNode_(a, d);
};
m.dom.childrenToNode_ = function (a, c) {
  if (1 == c.childNodes.length)
    return c.removeChild(m.asserts.assert(c.firstChild));
  for (a = a.createDocumentFragment(); c.firstChild; )
    a.appendChild(c.firstChild);
  return a;
};
m.dom.isCss1CompatMode = function () {
  return m.dom.isCss1CompatMode_(document);
};
m.dom.isCss1CompatMode_ = function (a) {
  return m.dom.COMPAT_MODE_KNOWN_
    ? m.dom.ASSUME_STANDARDS_MODE
    : "CSS1Compat" == a.compatMode;
};
m.dom.canHaveChildren = function (a) {
  if (a.nodeType != m.dom.NodeType.ELEMENT) return !1;
  switch (a.tagName) {
    case String(m.dom.TagName.APPLET):
    case String(m.dom.TagName.AREA):
    case String(m.dom.TagName.BASE):
    case String(m.dom.TagName.BR):
    case String(m.dom.TagName.COL):
    case String(m.dom.TagName.COMMAND):
    case String(m.dom.TagName.EMBED):
    case String(m.dom.TagName.FRAME):
    case String(m.dom.TagName.HR):
    case String(m.dom.TagName.IMG):
    case String(m.dom.TagName.INPUT):
    case String(m.dom.TagName.IFRAME):
    case String(m.dom.TagName.ISINDEX):
    case String(m.dom.TagName.KEYGEN):
    case String(m.dom.TagName.LINK):
    case String(m.dom.TagName.NOFRAMES):
    case String(m.dom.TagName.NOSCRIPT):
    case String(m.dom.TagName.META):
    case String(m.dom.TagName.OBJECT):
    case String(m.dom.TagName.PARAM):
    case String(m.dom.TagName.SCRIPT):
    case String(m.dom.TagName.SOURCE):
    case String(m.dom.TagName.STYLE):
    case String(m.dom.TagName.TRACK):
    case String(m.dom.TagName.WBR):
      return !1;
  }
  return !0;
};
m.dom.appendChild = function (a, c) {
  m.asserts.assert(
    null != a && null != c,
    "goog.dom.appendChild expects non-null arguments"
  );
  a.appendChild(c);
};
m.dom.append = function (a, c) {
  m.dom.append_(m.dom.getOwnerDocument(a), a, arguments, 1);
};
m.dom.removeChildren = function (a) {
  for (var c; (c = a.firstChild); ) a.removeChild(c);
};
m.dom.insertSiblingBefore = function (a, c) {
  m.asserts.assert(
    null != a && null != c,
    "goog.dom.insertSiblingBefore expects non-null arguments"
  );
  c.parentNode && c.parentNode.insertBefore(a, c);
};
m.dom.insertSiblingAfter = function (a, c) {
  m.asserts.assert(
    null != a && null != c,
    "goog.dom.insertSiblingAfter expects non-null arguments"
  );
  c.parentNode && c.parentNode.insertBefore(a, c.nextSibling);
};
m.dom.insertChildAt = function (a, c, d) {
  m.asserts.assert(
    null != a,
    "goog.dom.insertChildAt expects a non-null parent"
  );
  a.insertBefore(c, a.childNodes[d] || null);
};
m.dom.removeNode = function (a) {
  return a && a.parentNode ? a.parentNode.removeChild(a) : null;
};
m.dom.replaceNode = function (a, c) {
  m.asserts.assert(
    null != a && null != c,
    "goog.dom.replaceNode expects non-null arguments"
  );
  var d = c.parentNode;
  d && d.replaceChild(a, c);
};
m.dom.copyContents = function (a, c) {
  m.asserts.assert(
    null != a && null != c,
    "goog.dom.copyContents expects non-null arguments"
  );
  c = c.cloneNode(!0).childNodes;
  for (m.dom.removeChildren(a); c.length; ) a.appendChild(c[0]);
};
m.dom.flattenElement = function (a) {
  var c,
    d = a.parentNode;
  if (d && d.nodeType != m.dom.NodeType.DOCUMENT_FRAGMENT) {
    if (a.removeNode) return a.removeNode(!1);
    for (; (c = a.firstChild); ) d.insertBefore(c, a);
    return m.dom.removeNode(a);
  }
};
m.dom.getChildren = function (a) {
  return m.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE && void 0 != a.children
    ? a.children
    : ea(a.childNodes, function (c) {
        return c.nodeType == m.dom.NodeType.ELEMENT;
      });
};
m.dom.getFirstElementChild = function (a) {
  return void 0 !== a.firstElementChild
    ? a.firstElementChild
    : m.dom.getNextElementNode_(a.firstChild, !0);
};
m.dom.getLastElementChild = function (a) {
  return void 0 !== a.lastElementChild
    ? a.lastElementChild
    : m.dom.getNextElementNode_(a.lastChild, !1);
};
m.dom.getNextElementSibling = function (a) {
  return void 0 !== a.nextElementSibling
    ? a.nextElementSibling
    : m.dom.getNextElementNode_(a.nextSibling, !0);
};
m.dom.getPreviousElementSibling = function (a) {
  return void 0 !== a.previousElementSibling
    ? a.previousElementSibling
    : m.dom.getNextElementNode_(a.previousSibling, !1);
};
m.dom.getNextElementNode_ = function (a, c) {
  for (; a && a.nodeType != m.dom.NodeType.ELEMENT; )
    a = c ? a.nextSibling : a.previousSibling;
  return a;
};
m.dom.getNextNode = function (a) {
  if (!a) return null;
  if (a.firstChild) return a.firstChild;
  for (; a && !a.nextSibling; ) a = a.parentNode;
  return a ? a.nextSibling : null;
};
m.dom.getPreviousNode = function (a) {
  if (!a) return null;
  if (!a.previousSibling) return a.parentNode;
  for (a = a.previousSibling; a && a.lastChild; ) a = a.lastChild;
  return a;
};
m.dom.isNodeLike = function (a) {
  return m.isObject(a) && 0 < a.nodeType;
};
m.dom.isElement = function (a) {
  return m.isObject(a) && a.nodeType == m.dom.NodeType.ELEMENT;
};
m.dom.isWindow = function (a) {
  return m.isObject(a) && a.window == a;
};
m.dom.getParentElement = function (a) {
  var c;
  if (
    m.dom.BrowserFeature.CAN_USE_PARENT_ELEMENT_PROPERTY &&
    !(
      m.userAgent.IE &&
      m.userAgent.isVersionOrHigher("9") &&
      !m.userAgent.isVersionOrHigher("10") &&
      m.global.SVGElement &&
      a instanceof m.global.SVGElement
    ) &&
    (c = a.parentElement)
  )
    return c;
  c = a.parentNode;
  return m.dom.isElement(c) ? c : null;
};
m.dom.contains = function (a, c) {
  if (!a || !c) return !1;
  if (a.contains && c.nodeType == m.dom.NodeType.ELEMENT)
    return a == c || a.contains(c);
  if ("undefined" != typeof a.compareDocumentPosition)
    return a == c || !!(a.compareDocumentPosition(c) & 16);
  for (; c && a != c; ) c = c.parentNode;
  return c == a;
};
m.dom.compareNodeOrder = function (a, c) {
  if (a == c) return 0;
  if (a.compareDocumentPosition)
    return a.compareDocumentPosition(c) & 2 ? 1 : -1;
  if (m.userAgent.IE && !m.userAgent.isDocumentModeOrHigher(9)) {
    if (a.nodeType == m.dom.NodeType.DOCUMENT) return -1;
    if (c.nodeType == m.dom.NodeType.DOCUMENT) return 1;
  }
  if ("sourceIndex" in a || (a.parentNode && "sourceIndex" in a.parentNode)) {
    var d = a.nodeType == m.dom.NodeType.ELEMENT,
      e = c.nodeType == m.dom.NodeType.ELEMENT;
    if (d && e) return a.sourceIndex - c.sourceIndex;
    var f = a.parentNode,
      g = c.parentNode;
    return f == g
      ? m.dom.compareSiblingOrder_(a, c)
      : !d && m.dom.contains(f, c)
      ? -1 * m.dom.compareParentsDescendantNodeIe_(a, c)
      : !e && m.dom.contains(g, a)
      ? m.dom.compareParentsDescendantNodeIe_(c, a)
      : (d ? a.sourceIndex : f.sourceIndex) -
        (e ? c.sourceIndex : g.sourceIndex);
  }
  e = m.dom.getOwnerDocument(a);
  d = e.createRange();
  d.selectNode(a);
  d.collapse(!0);
  a = e.createRange();
  a.selectNode(c);
  a.collapse(!0);
  return d.compareBoundaryPoints(m.global.Range.START_TO_END, a);
};
m.dom.compareParentsDescendantNodeIe_ = function (a, c) {
  var d = a.parentNode;
  if (d == c) return -1;
  for (; c.parentNode != d; ) c = c.parentNode;
  return m.dom.compareSiblingOrder_(c, a);
};
m.dom.compareSiblingOrder_ = function (a, c) {
  for (; (c = c.previousSibling); ) if (c == a) return -1;
  return 1;
};
m.dom.findCommonAncestor = function (a) {
  var c,
    d = arguments.length;
  if (!d) return null;
  if (1 == d) return arguments[0];
  var e = [],
    f = Infinity;
  for (c = 0; c < d; c++) {
    for (var g = [], h = arguments[c]; h; ) g.unshift(h), (h = h.parentNode);
    e.push(g);
    f = Math.min(f, g.length);
  }
  g = null;
  for (c = 0; c < f; c++) {
    h = e[0][c];
    for (var l = 1; l < d; l++) if (h != e[l][c]) return g;
    g = h;
  }
  return g;
};
m.dom.isInDocument = function (a) {
  return 16 == (a.ownerDocument.compareDocumentPosition(a) & 16);
};
m.dom.getOwnerDocument = function (a) {
  m.asserts.assert(a, "Node cannot be null or undefined.");
  return a.nodeType == m.dom.NodeType.DOCUMENT
    ? a
    : a.ownerDocument || a.document;
};
m.dom.getFrameContentDocument = function (a) {
  return a.contentDocument || a.contentWindow.document;
};
m.dom.getFrameContentWindow = function (a) {
  try {
    return (
      a.contentWindow ||
      (a.contentDocument ? m.dom.getWindow(a.contentDocument) : null)
    );
  } catch (c) {}
  return null;
};
m.dom.setTextContent = function (a, c) {
  m.asserts.assert(
    null != a,
    "goog.dom.setTextContent expects a non-null value for node"
  );
  if ("textContent" in a) a.textContent = c;
  else if (a.nodeType == m.dom.NodeType.TEXT) a.data = String(c);
  else if (a.firstChild && a.firstChild.nodeType == m.dom.NodeType.TEXT) {
    for (; a.lastChild != a.firstChild; )
      a.removeChild(m.asserts.assert(a.lastChild));
    a.firstChild.data = String(c);
  } else {
    m.dom.removeChildren(a);
    var d = m.dom.getOwnerDocument(a);
    a.appendChild(d.createTextNode(String(c)));
  }
};
m.dom.getOuterHtml = function (a) {
  m.asserts.assert(
    null !== a,
    "goog.dom.getOuterHtml expects a non-null value for element"
  );
  if ("outerHTML" in a) return a.outerHTML;
  var c = m.dom.getOwnerDocument(a);
  c = m.dom.createElement_(c, m.dom.TagName.DIV);
  c.appendChild(a.cloneNode(!0));
  return c.innerHTML;
};
m.dom.findNode = function (a, c) {
  var d = [];
  return m.dom.findNodes_(a, c, d, !0) ? d[0] : void 0;
};
m.dom.findNodes = function (a, c) {
  var d = [];
  m.dom.findNodes_(a, c, d, !1);
  return d;
};
m.dom.findNodes_ = function (a, c, d, e) {
  if (null != a)
    for (a = a.firstChild; a; ) {
      if ((c(a) && (d.push(a), e)) || m.dom.findNodes_(a, c, d, e)) return !0;
      a = a.nextSibling;
    }
  return !1;
};
m.dom.findElement = function (a, c) {
  for (a = m.dom.getChildrenReverse_(a); 0 < a.length; ) {
    var d = a.pop();
    if (c(d)) return d;
    for (d = d.lastElementChild; d; d = d.previousElementSibling) a.push(d);
  }
  return null;
};
m.dom.findElements = function (a, c) {
  var d = [];
  for (a = m.dom.getChildrenReverse_(a); 0 < a.length; ) {
    var e = a.pop();
    c(e) && d.push(e);
    for (e = e.lastElementChild; e; e = e.previousElementSibling) a.push(e);
  }
  return d;
};
m.dom.getChildrenReverse_ = function (a) {
  if (a.nodeType == m.dom.NodeType.DOCUMENT) return [a.documentElement];
  var c = [];
  for (a = a.lastElementChild; a; a = a.previousElementSibling) c.push(a);
  return c;
};
m.dom.TAGS_TO_IGNORE_ = { SCRIPT: 1, STYLE: 1, HEAD: 1, IFRAME: 1, OBJECT: 1 };
m.dom.PREDEFINED_TAG_VALUES_ = { IMG: " ", BR: "\n" };
m.dom.isFocusableTabIndex = function (a) {
  return m.dom.hasSpecifiedTabIndex_(a) && m.dom.isTabIndexFocusable_(a);
};
m.dom.setFocusableTabIndex = function (a, c) {
  c ? (a.tabIndex = 0) : ((a.tabIndex = -1), a.removeAttribute("tabIndex"));
};
m.dom.isFocusable = function (a) {
  var c;
  return (c = m.dom.nativelySupportsFocus_(a)
    ? !a.disabled &&
      (!m.dom.hasSpecifiedTabIndex_(a) || m.dom.isTabIndexFocusable_(a))
    : m.dom.isFocusableTabIndex(a)) && m.userAgent.IE
    ? m.dom.hasNonZeroBoundingRect_(a)
    : c;
};
m.dom.hasSpecifiedTabIndex_ = function (a) {
  return m.userAgent.IE && !m.userAgent.isVersionOrHigher("9")
    ? ((a = a.getAttributeNode("tabindex")), null != a && a.specified)
    : a.hasAttribute("tabindex");
};
m.dom.isTabIndexFocusable_ = function (a) {
  a = a.tabIndex;
  return "number" === typeof a && 0 <= a && 32768 > a;
};
m.dom.nativelySupportsFocus_ = function (a) {
  return (
    (a.tagName == m.dom.TagName.A && a.hasAttribute("href")) ||
    a.tagName == m.dom.TagName.INPUT ||
    a.tagName == m.dom.TagName.TEXTAREA ||
    a.tagName == m.dom.TagName.SELECT ||
    a.tagName == m.dom.TagName.BUTTON
  );
};
m.dom.hasNonZeroBoundingRect_ = function (a) {
  a =
    "function" !== typeof a.getBoundingClientRect ||
    (m.userAgent.IE && null == a.parentElement)
      ? { height: a.offsetHeight, width: a.offsetWidth }
      : a.getBoundingClientRect();
  return null != a && 0 < a.height && 0 < a.width;
};
m.dom.getTextContent = function (a) {
  if (m.dom.BrowserFeature.CAN_USE_INNER_TEXT && null !== a && "innerText" in a)
    a = m.string.canonicalizeNewlines(a.innerText);
  else {
    var c = [];
    m.dom.getTextContent_(a, c, !0);
    a = c.join("");
  }
  a = a.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
  a = a.replace(/\u200B/g, "");
  m.dom.BrowserFeature.CAN_USE_INNER_TEXT || (a = a.replace(/ +/g, " "));
  " " != a && (a = a.replace(/^\s*/, ""));
  return a;
};
m.dom.getRawTextContent = function (a) {
  var c = [];
  m.dom.getTextContent_(a, c, !1);
  return c.join("");
};
m.dom.getTextContent_ = function (a, c, d) {
  if (!(a.nodeName in m.dom.TAGS_TO_IGNORE_))
    if (a.nodeType == m.dom.NodeType.TEXT)
      d
        ? c.push(String(a.nodeValue).replace(/(\r\n|\r|\n)/g, ""))
        : c.push(a.nodeValue);
    else if (a.nodeName in m.dom.PREDEFINED_TAG_VALUES_)
      c.push(m.dom.PREDEFINED_TAG_VALUES_[a.nodeName]);
    else
      for (a = a.firstChild; a; )
        m.dom.getTextContent_(a, c, d), (a = a.nextSibling);
};
m.dom.getNodeTextLength = function (a) {
  return m.dom.getTextContent(a).length;
};
m.dom.getNodeTextOffset = function (a, c) {
  c = c || m.dom.getOwnerDocument(a).body;
  for (var d = []; a && a != c; ) {
    for (var e = a; (e = e.previousSibling); )
      d.unshift(m.dom.getTextContent(e));
    a = a.parentNode;
  }
  return m.string.trimLeft(d.join("")).replace(/ +/g, " ").length;
};
m.dom.getNodeAtOffset = function (a, c, d) {
  a = [a];
  for (var e = 0, f = null; 0 < a.length && e < c; )
    if (((f = a.pop()), !(f.nodeName in m.dom.TAGS_TO_IGNORE_)))
      if (f.nodeType == m.dom.NodeType.TEXT) {
        var g = f.nodeValue.replace(/(\r\n|\r|\n)/g, "").replace(/ +/g, " ");
        e += g.length;
      } else if (f.nodeName in m.dom.PREDEFINED_TAG_VALUES_)
        e += m.dom.PREDEFINED_TAG_VALUES_[f.nodeName].length;
      else
        for (g = f.childNodes.length - 1; 0 <= g; g--) a.push(f.childNodes[g]);
  m.isObject(d) &&
    ((d.remainder = f ? f.nodeValue.length + c - e - 1 : 0), (d.node = f));
  return f;
};
m.dom.isNodeList = function (a) {
  if (a && "number" == typeof a.length) {
    if (m.isObject(a))
      return "function" == typeof a.item || "string" == typeof a.item;
    if ("function" === typeof a) return "function" == typeof a.item;
  }
  return !1;
};
m.dom.getAncestorByTagNameAndClass = function (a, c, d, e) {
  if (!c && !d) return null;
  var f = c ? String(c).toUpperCase() : null;
  return m.dom.getAncestor(
    a,
    function (g) {
      return (
        (!f || g.nodeName == f) &&
        (!d ||
          ("string" === typeof g.className && y(g.className.split(/\s+/), d)))
      );
    },
    !0,
    e
  );
};
m.dom.getAncestorByClass = function (a, c, d) {
  return m.dom.getAncestorByTagNameAndClass(a, null, c, d);
};
m.dom.getAncestor = function (a, c, d, e) {
  a && !d && (a = a.parentNode);
  for (d = 0; a && (null == e || d <= e); ) {
    m.asserts.assert("parentNode" != a.name);
    if (c(a)) return a;
    a = a.parentNode;
    d++;
  }
  return null;
};
m.dom.getActiveElement = function (a) {
  try {
    var c = a && a.activeElement;
    return c && c.nodeName ? c : null;
  } catch (d) {
    return null;
  }
};
m.dom.getPixelRatio = function () {
  var a = m.dom.getWindow();
  return void 0 !== a.devicePixelRatio
    ? a.devicePixelRatio
    : a.matchMedia
    ? m.dom.matchesPixelRatio_(3) ||
      m.dom.matchesPixelRatio_(2) ||
      m.dom.matchesPixelRatio_(1.5) ||
      m.dom.matchesPixelRatio_(1) ||
      0.75
    : 1;
};
m.dom.matchesPixelRatio_ = function (a) {
  return m.dom
    .getWindow()
    .matchMedia(
      "(min-resolution: " +
        a +
        "dppx),(min--moz-device-pixel-ratio: " +
        a +
        "),(min-resolution: " +
        96 * a +
        "dpi)"
    ).matches
    ? a
    : 0;
};
m.dom.getCanvasContext2D = function (a) {
  return a.getContext("2d");
};
m.dom.DomHelper = function (a) {
  this.document_ = a || m.global.document || document;
};
b = m.dom.DomHelper.prototype;
b.getDomHelper = m.dom.getDomHelper;
b.getDocument = function () {
  return this.document_;
};
b.getElement = function (a) {
  return m.dom.getElementHelper_(this.document_, a);
};
b.getRequiredElement = function (a) {
  return m.dom.getRequiredElementHelper_(this.document_, a);
};
b.$ = m.dom.DomHelper.prototype.getElement;
b.getElementsByTagName = function (a, c) {
  return (c || this.document_).getElementsByTagName(String(a));
};
b.getElementsByTagNameAndClass = function (a, c, d) {
  return m.dom.getElementsByTagNameAndClass_(this.document_, a, c, d);
};
b.getElementByTagNameAndClass = function (a, c, d) {
  return m.dom.getElementByTagNameAndClass_(this.document_, a, c, d);
};
b.getElementsByClass = function (a, c) {
  return m.dom.getElementsByClass(a, c || this.document_);
};
b.getElementByClass = function (a, c) {
  return m.dom.getElementByClass(a, c || this.document_);
};
b.getRequiredElementByClass = function (a, c) {
  return m.dom.getRequiredElementByClass(a, c || this.document_);
};
b.$$ = m.dom.DomHelper.prototype.getElementsByTagNameAndClass;
b.setProperties = m.dom.setProperties;
b.getViewportSize = function (a) {
  return m.dom.getViewportSize(a || this.getWindow());
};
b.getDocumentHeight = function () {
  return m.dom.getDocumentHeight_(this.getWindow());
};
b.createDom = function (a, c, d) {
  return m.dom.createDom_(this.document_, arguments);
};
b.$dom = m.dom.DomHelper.prototype.createDom;
b.createElement = function (a) {
  return m.dom.createElement_(this.document_, a);
};
b.createTextNode = function (a) {
  return this.document_.createTextNode(String(a));
};
b.createTable = function (a, c, d) {
  return m.dom.createTable_(this.document_, a, c, !!d);
};
b.safeHtmlToNode = function (a) {
  return m.dom.safeHtmlToNode_(this.document_, a);
};
b.isCss1CompatMode = function () {
  return m.dom.isCss1CompatMode_(this.document_);
};
b.getWindow = function () {
  return m.dom.getWindow_(this.document_);
};
b.getDocumentScrollElement = function () {
  return m.dom.getDocumentScrollElement_(this.document_);
};
b.getDocumentScroll = function () {
  return m.dom.getDocumentScroll_(this.document_);
};
b.getActiveElement = function (a) {
  return m.dom.getActiveElement(a || this.document_);
};
b.appendChild = m.dom.appendChild;
b.append = m.dom.append;
b.canHaveChildren = m.dom.canHaveChildren;
b.removeChildren = m.dom.removeChildren;
b.insertSiblingBefore = m.dom.insertSiblingBefore;
b.insertSiblingAfter = m.dom.insertSiblingAfter;
b.insertChildAt = m.dom.insertChildAt;
b.removeNode = m.dom.removeNode;
b.replaceNode = m.dom.replaceNode;
b.copyContents = m.dom.copyContents;
b.flattenElement = m.dom.flattenElement;
b.getChildren = m.dom.getChildren;
b.getFirstElementChild = m.dom.getFirstElementChild;
b.getLastElementChild = m.dom.getLastElementChild;
b.getNextElementSibling = m.dom.getNextElementSibling;
b.getPreviousElementSibling = m.dom.getPreviousElementSibling;
b.getNextNode = m.dom.getNextNode;
b.getPreviousNode = m.dom.getPreviousNode;
b.isNodeLike = m.dom.isNodeLike;
b.isElement = m.dom.isElement;
b.isWindow = m.dom.isWindow;
b.getParentElement = m.dom.getParentElement;
b.contains = m.dom.contains;
b.compareNodeOrder = m.dom.compareNodeOrder;
b.findCommonAncestor = m.dom.findCommonAncestor;
b.getOwnerDocument = m.dom.getOwnerDocument;
b.getFrameContentDocument = m.dom.getFrameContentDocument;
b.getFrameContentWindow = m.dom.getFrameContentWindow;
b.setTextContent = m.dom.setTextContent;
b.getOuterHtml = m.dom.getOuterHtml;
b.findNode = m.dom.findNode;
b.findNodes = m.dom.findNodes;
b.isFocusableTabIndex = m.dom.isFocusableTabIndex;
b.setFocusableTabIndex = m.dom.setFocusableTabIndex;
b.isFocusable = m.dom.isFocusable;
b.getTextContent = m.dom.getTextContent;
b.getNodeTextLength = m.dom.getNodeTextLength;
b.getNodeTextOffset = m.dom.getNodeTextOffset;
b.getNodeAtOffset = m.dom.getNodeAtOffset;
b.isNodeList = m.dom.isNodeList;
b.getAncestorByTagNameAndClass = m.dom.getAncestorByTagNameAndClass;
b.getAncestorByClass = m.dom.getAncestorByClass;
b.getAncestor = m.dom.getAncestor;
b.getCanvasContext2D = m.dom.getCanvasContext2D;
var T = function () {
  this.isFinishedLaunch_ =
    this.retrieveJwtFailed_ =
    this.transactionStarted_ =
    this.walletIsLoaded_ =
      !1;
  this.webStoreService_ = new S();
};
k.inherits(T, q);
T.prototype.getAppUnavailableMessage = function () {
  return chrome.i18n.getMessage("iap_unavailable");
};
T.prototype.pollOnlineStatus = function () {
  if (!window.iapParams_.oauthToken)
    return chrome.i18n.getMessage("please_sign_in");
  if (this.retrieveJwtFailed_)
    return chrome.i18n.getMessage("jwt_retrieve_failed");
};
T.prototype.finishedLaunch = function () {
  return this.isFinishedLaunch_;
};
var Za = function (a) {
  var c = window.iapParams_;
  a.isFinishedLaunch_ &&
    c.oauthToken &&
    a.walletIsLoaded_ &&
    !a.transactionStarted_ &&
    ((a.transactionStarted_ = !0),
    m.dom
      .getDocument()
      .querySelector("webview")
      .contentWindow.postMessage({ jwt: window.iapJwt_, parameters: c }, "*"));
};
T.prototype.retrieveJwtOnSuccess_ = function (a, c, d) {
  window.iapJwt_ = a;
  window.payment_data = c;
  window.signature = d;
  this.retrieveJwtFailed_ = !1;
  this.isFinishedLaunch_ = !0;
  Za(this);
};
T.prototype.retrieveJwtOnFailed_ = function () {
  this.isFinishedLaunch_ = this.retrieveJwtFailed_ = !0;
};
T.prototype.onWindowReady = function () {
  var a = m.dom.getDocument().querySelector("webview");
  if (a) {
    a.style.borderTop = "1px #eaeaea solid";
    var c = !1,
      d = window.iapParams_,
      e = this,
      f = function (g) {
        if (window.sku_) {
          var h = window.sku_,
            l = window.iapParams_ || {},
            n = e.webStoreService_,
            p = l || {};
          if ("env" in p) {
            switch (p.env) {
              case "prod":
                n.baseUrl_ = S.Environment.PROD;
                break;
              default:
                n.baseUrl_ = S.Environment.SANDBOX;
            }
            n.baseUrlAndPath_ = n.baseUrl_ + S.WEB_STORE_REQUEST_PATH_;
          }
          e.retrieveJwtFailed_ = !1;
          e.isFinishedLaunch_ = !1;
          Ya(
            e.webStoreService_,
            l.applicationId,
            h,
            m.bind(e.retrieveJwtOnSuccess_, e),
            m.bind(e.retrieveJwtOnFailed_, e),
            g,
            l.gl,
            l.projection
          );
        } else (e.isFinishedLaunch_ = !0), Za(e);
      };
    d.oauthToken
      ? f(d.oauthToken)
      : chrome.identity.getAuthToken({ interactive: !0 }, function (g) {
          window.iapParams_.oauthToken = g;
          f(g);
        });
    a.addEventListener(
      "contentload",
      function () {
        if (!c) {
          c = !0;
          switch (d.env || "sandbox") {
            case "prod":
              var g =
                "https://payments.google.com/payments/v4/js/integrator.js";
              break;
            default:
              g = "https://sandbox.google.com/payments/v4/js/integrator.js";
          }
          a.executeScript(
            {
              runAt: "document_start",
              code:
                'document.write("<script type=\\"text/javascript\\" src=\\"' +
                g +
                "\\\" data-payments-main>\x3c/script><script type=\\\"text/javascript\\\">window.addEventListener('message', function(e) {  if (e.origin != 'chrome-extension://" +
                chrome.runtime.id +
                "') return;var mode = payments.business.integration.mashupMode.embedded('renderplace');var bootstrapper = payments.business.integration.bootstrap.asMashupMode(mode);bootstrapper    .usingDefaultActivityStatusChangeHandler()    .usingBaseZIndex(1201)    .usingOnResizeFrameCallback(function() {        var iframe = document.getElementById('renderplaceIframe');        var size = {'width': iframe.clientWidth, 'height': iframe.clientHeight};        e.source.postMessage({resize: size}, e.origin);})    .usingOAuthToken(e.data.parameters.oauthToken)    .usingStyle(':md;pc=#80868b');var standaloneContextBootstrapper = bootstrapper.inStandaloneContext(    payments.business.integration.standaloneContextAuthId.forGaia());var buyFlowScenario =    standaloneContextBootstrapper.buyFlow(function(res) {        e.source.postMessage({type: 'success', result: res}, e.origin);});buyFlowScenario.withEncryptedParameters(e.data.jwt);buyFlowScenario.load(undefined, function(res) {    e.source.postMessage({type: 'failure', result: res}, e.origin);});}, false);('registered payment listener: ' + Date.now());\x3c/script>&nbsp;\");",
            },
            function () {
              ("did exec once");
              a.executeScript({
                runAt: "document_end",
                code: "document.write(\"<script type=\\\"text/javascript\\\">var elem = document.createElement('div');elem.setAttribute('id', 'renderplace');elem.setAttribute('style', 'margin-left:35px;margin-right:35px;');document.body.appendChild(elem);('finished loading, start payment: ' + Date.now());\x3c/script>\");",
              });
            }
          );
        }
      },
      !1
    );
    a.addEventListener("consolemessage", function (g) {
      -1 != g.message.indexOf("finished") && ((e.walletIsLoaded_ = !0), Za(e));
    });
    a.addEventListener(
      "newwindow",
      function (g) {
        window.open(g.targetUrl);
        g.window.discard();
      },
      !1
    );
  }
};
q.defaultImpl_ = T;
window.addEventListener(
  "message",
  function (a) {
    "event", a;
    if ("type" in a.data)
      (window.purchase_result = a.data.result), window.close();
    else if ("resize" in a.data) {
      var c = chrome.app.window.current();
      c.resizeTo(c.outerBounds.width + 0, a.data.resize.height + 80);
    }
  },
  !1
);
L.WindowDelegate = T;
m.async = {};
m.async.FreeList = function (a, c, d) {
  this.limit_ = d;
  this.create_ = a;
  this.reset_ = c;
  this.occupants_ = 0;
  this.head_ = null;
};
m.async.FreeList.prototype.get = function () {
  if (0 < this.occupants_) {
    this.occupants_--;
    var a = this.head_;
    this.head_ = a.next;
    a.next = null;
  } else a = this.create_();
  return a;
};
m.async.FreeList.prototype.put = function (a) {
  this.reset_(a);
  this.occupants_ < this.limit_ &&
    (this.occupants_++, (a.next = this.head_), (this.head_ = a));
};
m.async.nextTick = function (a, c, d) {
  var e = a;
  c && (e = m.bind(a, c));
  e = m.async.nextTick.wrapCallback_(e);
  "function" === typeof m.global.setImmediate &&
  (d || m.async.nextTick.useSetImmediate_())
    ? m.global.setImmediate(e)
    : (m.async.nextTick.setImmediate_ ||
        (m.async.nextTick.setImmediate_ =
          m.async.nextTick.getSetImmediateEmulator_()),
      m.async.nextTick.setImmediate_(e));
};
m.async.nextTick.useSetImmediate_ = function () {
  return m.global.Window &&
    m.global.Window.prototype &&
    !m.labs.userAgent.browser.isEdge() &&
    m.global.Window.prototype.setImmediate == m.global.setImmediate
    ? !1
    : !0;
};
m.async.nextTick.getSetImmediateEmulator_ = function () {
  var a = m.global.MessageChannel;
  "undefined" === typeof a &&
    "undefined" !== typeof window &&
    window.postMessage &&
    window.addEventListener &&
    !m.labs.userAgent.engine.isPresto() &&
    (a = function () {
      var f = m.dom.createElement(m.dom.TagName.IFRAME);
      f.style.display = "none";
      document.documentElement.appendChild(f);
      var g = f.contentWindow;
      f = g.document;
      f.open();
      f.close();
      var h = "callImmediate" + Math.random(),
        l =
          "file:" == g.location.protocol
            ? "*"
            : g.location.protocol + "//" + g.location.host;
      f = m.bind(function (n) {
        if (("*" == l || n.origin == l) && n.data == h) this.port1.onmessage();
      }, this);
      g.addEventListener("message", f, !1);
      this.port1 = {};
      this.port2 = {
        postMessage: function () {
          g.postMessage(h, l);
        },
      };
    });
  if ("undefined" !== typeof a && !m.labs.userAgent.browser.isIE()) {
    var c = new a(),
      d = {},
      e = d;
    c.port1.onmessage = function () {
      if (void 0 !== d.next) {
        d = d.next;
        var f = d.cb;
        d.cb = null;
        f();
      }
    };
    return function (f) {
      e.next = { cb: f };
      e = e.next;
      c.port2.postMessage(0);
    };
  }
  return function (f) {
    m.global.setTimeout(f, 0);
  };
};
m.async.nextTick.wrapCallback_ = m.functions.identity;
m.debug.entryPointRegistry.register(function (a) {
  m.async.nextTick.wrapCallback_ = a;
});
function $a(a) {
  m.global.setTimeout(function () {
    throw a;
  }, 0);
}
m.async.throwException = $a;
var U = function () {
  this.workTail_ = this.workHead_ = null;
};
U.prototype.add = function (a, c) {
  var d = U.freelist_.get();
  d.set(a, c);
  this.workTail_
    ? (this.workTail_.next = d)
    : ((0, m.asserts.assert)(!this.workHead_), (this.workHead_ = d));
  this.workTail_ = d;
};
U.prototype.remove = function () {
  var a = null;
  this.workHead_ &&
    ((a = this.workHead_),
    (this.workHead_ = this.workHead_.next),
    this.workHead_ || (this.workTail_ = null),
    (a.next = null));
  return a;
};
U.DEFAULT_MAX_UNUSED = 100;
U.freelist_ = new m.async.FreeList(
  function () {
    return new ab();
  },
  function (a) {
    return a.reset();
  },
  U.DEFAULT_MAX_UNUSED
);
var ab = function () {
  this.next = this.scope = this.fn = null;
};
ab.prototype.set = function (a, c) {
  this.fn = a;
  this.scope = c;
  this.next = null;
};
ab.prototype.reset = function () {
  this.next = this.scope = this.fn = null;
};
m.async.WorkQueue = U;
m.ASSUME_NATIVE_PROMISE = !1;
m.async.run = function (a, c) {
  m.async.run.schedule_ || m.async.run.initializeRunner_();
  m.async.run.workQueueScheduled_ ||
    (m.async.run.schedule_(), (m.async.run.workQueueScheduled_ = !0));
  m.async.run.workQueue_.add(a, c);
};
m.async.run.initializeRunner_ = function () {
  if (
    m.ASSUME_NATIVE_PROMISE ||
    (m.global.Promise && m.global.Promise.resolve)
  ) {
    var a = m.global.Promise.resolve(void 0);
    m.async.run.schedule_ = function () {
      a.then(m.async.run.processWorkQueue);
    };
  } else
    m.async.run.schedule_ = function () {
      m.async.nextTick(m.async.run.processWorkQueue);
    };
};
m.async.run.forceNextTick = function (a) {
  m.async.run.schedule_ = function () {
    m.async.nextTick(m.async.run.processWorkQueue);
    a && a(m.async.run.processWorkQueue);
  };
};
m.async.run.workQueueScheduled_ = !1;
m.async.run.workQueue_ = new U();
m.DEBUG &&
  (m.async.run.resetQueue = function () {
    m.async.run.workQueueScheduled_ = !1;
    m.async.run.workQueue_ = new U();
  });
m.async.run.processWorkQueue = function () {
  for (var a; (a = m.async.run.workQueue_.remove()); ) {
    try {
      a.fn.call(a.scope);
    } catch (c) {
      $a(c);
    }
    U.freelist_.put(a);
  }
  m.async.run.workQueueScheduled_ = !1;
};
m.json = {};
m.json.USE_NATIVE_JSON = !1;
m.json.TRY_NATIVE_JSON = !1;
m.json.isValid = function (a) {
  return /^\s*$/.test(a)
    ? !1
    : /^[\],:{}\s\u2028\u2029]*$/.test(
        a
          .replace(/\\["\\\/bfnrtu]/g, "@")
          .replace(
            /(?:"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)[\s\u2028\u2029]*(?=:|,|]|}|$)/g,
            "]"
          )
          .replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, "")
      );
};
m.json.errorLogger_ = m.nullFunction;
m.json.setErrorLogger = function (a) {
  m.json.errorLogger_ = a;
};
m.json.parse = m.json.USE_NATIVE_JSON
  ? m.global.JSON.parse
  : function (a) {
      if (m.json.TRY_NATIVE_JSON)
        try {
          return m.global.JSON.parse(a);
        } catch (e) {
          var c = e;
        }
      a = String(a);
      if (m.json.isValid(a))
        try {
          var d = eval("(" + a + ")");
          c && m.json.errorLogger_("Invalid JSON: " + a, c);
          return d;
        } catch (e) {}
      throw Error("Invalid JSON string: " + a);
    };
m.json.serialize = m.json.USE_NATIVE_JSON
  ? m.global.JSON.stringify
  : function (a, c) {
      return new m.json.Serializer(c).serialize(a);
    };
m.json.Serializer = function (a) {
  this.replacer_ = a;
};
m.json.Serializer.prototype.serialize = function (a) {
  var c = [];
  bb(this, a, c);
  return c.join("");
};
var bb = function (a, c, d) {
  if (null == c) d.push("null");
  else {
    if ("object" == typeof c) {
      if (Array.isArray(c)) {
        var e = c;
        c = e.length;
        d.push("[");
        for (var f = "", g = 0; g < c; g++)
          d.push(f),
            (f = e[g]),
            bb(a, a.replacer_ ? a.replacer_.call(e, String(g), f) : f, d),
            (f = ",");
        d.push("]");
        return;
      }
      if (c instanceof String || c instanceof Number || c instanceof Boolean)
        c = c.valueOf();
      else {
        d.push("{");
        g = "";
        for (e in c)
          Object.prototype.hasOwnProperty.call(c, e) &&
            ((f = c[e]),
            "function" != typeof f &&
              (d.push(g),
              cb(e, d),
              d.push(":"),
              bb(a, a.replacer_ ? a.replacer_.call(c, e, f) : f, d),
              (g = ",")));
        d.push("}");
        return;
      }
    }
    switch (typeof c) {
      case "string":
        cb(c, d);
        break;
      case "number":
        d.push(isFinite(c) && !isNaN(c) ? String(c) : "null");
        break;
      case "boolean":
        d.push(String(c));
        break;
      case "function":
        d.push("null");
        break;
      default:
        throw Error("Unknown type: " + typeof c);
    }
  }
};
m.json.Serializer.charToJsonCharCache_ = {
  '"': '\\"',
  "\\": "\\\\",
  "/": "\\/",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "\t": "\\t",
  "\x0B": "\\u000b",
};
m.json.Serializer.charsToReplace_ = /\uffff/.test("\uffff")
  ? /[\\"\x00-\x1f\x7f-\uffff]/g
  : /[\\"\x00-\x1f\x7f-\xff]/g;
var cb = function (a, c) {
  c.push(
    '"',
    a.replace(m.json.Serializer.charsToReplace_, function (d) {
      var e = m.json.Serializer.charToJsonCharCache_[d];
      e ||
        ((e = "\\u" + (d.charCodeAt(0) | 65536).toString(16).substr(1)),
        (m.json.Serializer.charToJsonCharCache_[d] = e));
      return e;
    }),
    '"'
  );
};
m.json.hybrid = {};
m.json.hybrid.stringify = m.json.USE_NATIVE_JSON
  ? m.global.JSON.stringify
  : function (a) {
      if (m.global.JSON)
        try {
          return m.global.JSON.stringify(a);
        } catch (c) {}
      return m.json.serialize(a);
    };
m.json.hybrid.parse_ = function (a) {
  var c = m.json.parse;
  if (m.global.JSON)
    try {
      var d = m.global.JSON.parse(a);
      m.asserts.assert("object" == typeof d);
      return d;
    } catch (e) {}
  return c(a);
};
m.json.hybrid.parse = m.json.USE_NATIVE_JSON
  ? m.global.JSON.parse
  : function (a) {
      return m.json.hybrid.parse_(a);
    };
m.log = {};
m.log.ENABLED = m.debug.LOGGING_ENABLED;
m.log.ROOT_LOGGER_NAME = "";
var db = function (a, c) {
  this.name = a;
  this.value = c;
};
db.prototype.toString = function () {
  return this.name;
};
m.log.Level = db;
m.log.Level.OFF = new m.log.Level("OFF", Infinity);
m.log.Level.SHOUT = new m.log.Level("SHOUT", 1200);
m.log.Level.SEVERE = new m.log.Level("SEVERE", 1e3);
m.log.Level.WARNING = new m.log.Level("WARNING", 900);
m.log.Level.INFO = new m.log.Level("INFO", 800);
m.log.Level.CONFIG = new m.log.Level("CONFIG", 700);
m.log.Level.FINE = new m.log.Level("FINE", 500);
m.log.Level.FINER = new m.log.Level("FINER", 400);
m.log.Level.FINEST = new m.log.Level("FINEST", 300);
m.log.Level.ALL = new m.log.Level("ALL", 0);
m.log.Level.PREDEFINED_LEVELS = [
  m.log.Level.OFF,
  m.log.Level.SHOUT,
  m.log.Level.SEVERE,
  m.log.Level.WARNING,
  m.log.Level.INFO,
  m.log.Level.CONFIG,
  m.log.Level.FINE,
  m.log.Level.FINER,
  m.log.Level.FINEST,
  m.log.Level.ALL,
];
m.log.Level.predefinedLevelsCache_ = null;
m.log.Level.createPredefinedLevelsCache_ = function () {
  m.log.Level.predefinedLevelsCache_ = {};
  for (var a = 0, c; (c = m.log.Level.PREDEFINED_LEVELS[a]); a++)
    (m.log.Level.predefinedLevelsCache_[c.value] = c),
      (m.log.Level.predefinedLevelsCache_[c.name] = c);
};
m.log.Level.getPredefinedLevel = function (a) {
  m.log.Level.predefinedLevelsCache_ ||
    m.log.Level.createPredefinedLevelsCache_();
  return m.log.Level.predefinedLevelsCache_[a] || null;
};
m.log.Level.getPredefinedLevelByValue = function (a) {
  m.log.Level.predefinedLevelsCache_ ||
    m.log.Level.createPredefinedLevelsCache_();
  if (a in m.log.Level.predefinedLevelsCache_)
    return m.log.Level.predefinedLevelsCache_[a];
  for (var c = 0; c < m.log.Level.PREDEFINED_LEVELS.length; ++c) {
    var d = m.log.Level.PREDEFINED_LEVELS[c];
    if (d.value <= a) return d;
  }
  return null;
};
var eb = function () {};
eb.prototype.getName = function () {};
m.log.Logger = eb;
m.log.Logger.Level = m.log.Level;
var fb = function (a) {
    this.capacity_ = "number" === typeof a ? a : m.log.LogBuffer.CAPACITY;
    this.clear();
  },
  gb = function (a, c, d, e) {
    if (!a.isBufferingEnabled()) return new m.log.LogRecord(c, d, e);
    var f = (a.curIndex_ + 1) % a.capacity_;
    a.curIndex_ = f;
    if (a.isFull_) return (a = a.buffer_[f]), a.reset(c, d, e), a;
    a.isFull_ = f == a.capacity_ - 1;
    return (a.buffer_[f] = new m.log.LogRecord(c, d, e));
  };
fb.prototype.isBufferingEnabled = function () {
  return 0 < this.capacity_;
};
fb.prototype.clear = function () {
  this.buffer_ = Array(this.capacity_);
  this.curIndex_ = -1;
  this.isFull_ = !1;
};
m.log.LogBuffer = fb;
m.log.LogBuffer.CAPACITY = 0;
m.log.LogBuffer.getInstance = function () {
  m.log.LogBuffer.instance_ ||
    (m.log.LogBuffer.instance_ = new m.log.LogBuffer(m.log.LogBuffer.CAPACITY));
  return m.log.LogBuffer.instance_;
};
m.log.LogBuffer.isBufferingEnabled = function () {
  return m.log.LogBuffer.getInstance().isBufferingEnabled();
};
var hb = function (a, c, d, e, f) {
  this.reset(a || m.log.Level.OFF, c, d, e, f);
};
hb.prototype.reset = function (a, c) {
  this.level_ = a;
  this.msg_ = c;
};
hb.prototype.getLevel = function () {
  return this.level_;
};
hb.prototype.setLevel = function (a) {
  this.level_ = a;
};
hb.prototype.getMessage = function () {
  return this.msg_;
};
m.log.LogRecord = hb;
m.log.LogRecord.nextSequenceNumber_ = 0;
var ib = function (a, c) {
  this.level = null;
  this.handlers = [];
  this.parent = (void 0 === c ? null : c) || null;
  this.children = [];
  this.logger = {
    getName: function () {
      return a;
    },
  };
};
ib.prototype.getEffectiveLevel = function () {
  if (this.level) return this.level;
  if (this.parent) return this.parent.getEffectiveLevel();
  m.asserts.fail("Root logger has no level set.");
  return m.log.Level.OFF;
};
ib.prototype.publish = function (a) {
  for (var c = this; c; )
    c.handlers.forEach(function (d) {
      d(a);
    }),
      (c = c.parent);
};
m.log.LogRegistryEntry = ib;
var kb = function () {
    this.entries = {};
    var a = new m.log.LogRegistryEntry(m.log.ROOT_LOGGER_NAME);
    a.level = m.log.Level.CONFIG;
    this.entries[m.log.ROOT_LOGGER_NAME] = a;
  },
  V = function (a, c, d) {
    var e = a.entries[c];
    if (e) return void 0 !== d && (e.level = d), e;
    e = c.lastIndexOf(".");
    e = V(a, c.substr(0, e));
    var f = new m.log.LogRegistryEntry(c, e);
    a.entries[c] = f;
    e.children.push(f);
    void 0 !== d && (f.level = d);
    return f;
  };
kb.prototype.getAllLoggers = function () {
  var a = this;
  return Object.keys(this.entries).map(function (c) {
    return a.entries[c].logger;
  });
};
m.log.LogRegistry = kb;
m.log.LogRegistry.getInstance = function () {
  m.log.LogRegistry.instance_ ||
    (m.log.LogRegistry.instance_ = new m.log.LogRegistry());
  return m.log.LogRegistry.instance_;
};
m.log.getLogger = function () {
  return m.log.ENABLED
    ? V(m.log.LogRegistry.getInstance(), "goog.net.XhrIo", void 0).logger
    : null;
};
m.log.getRootLogger = function () {
  return m.log.ENABLED
    ? V(m.log.LogRegistry.getInstance(), m.log.ROOT_LOGGER_NAME).logger
    : null;
};
m.log.addHandler = function (a, c) {
  m.log.ENABLED &&
    a &&
    V(m.log.LogRegistry.getInstance(), a.getName()).handlers.push(c);
};
m.log.removeHandler = function (a, c) {
  return m.log.ENABLED &&
    a &&
    ((a = V(m.log.LogRegistry.getInstance(), a.getName())),
    (c = a.handlers.indexOf(c)),
    -1 !== c)
    ? (a.handlers.splice(c, 1), !0)
    : !1;
};
m.log.setLevel = function (a, c) {
  m.log.ENABLED &&
    a &&
    (V(m.log.LogRegistry.getInstance(), a.getName()).level = c);
};
m.log.getLevel = function () {
  return null;
};
m.log.getEffectiveLevel = function (a) {
  return m.log.ENABLED && a
    ? V(m.log.LogRegistry.getInstance(), a.getName()).getEffectiveLevel()
    : m.log.Level.OFF;
};
m.log.isLoggable = function (a, c) {
  return m.log.ENABLED && a && c
    ? c.value >= m.log.getEffectiveLevel(a).value
    : !1;
};
m.log.getAllLoggers = function () {
  return m.log.ENABLED ? m.log.LogRegistry.getInstance().getAllLoggers() : [];
};
m.log.getLogRecord = function (a, c, d) {
  return gb(
    m.log.LogBuffer.getInstance(),
    c || m.log.Level.OFF,
    d,
    a.getName()
  );
};
m.log.publishLogRecord = function (a, c) {
  m.log.ENABLED &&
    a &&
    m.log.isLoggable(a, c.getLevel()) &&
    V(m.log.LogRegistry.getInstance(), a.getName()).publish(c);
};
m.log.log = function (a, c, d) {
  if (m.log.ENABLED && a && m.log.isLoggable(a, c)) {
    c = c || m.log.Level.OFF;
    var e = V(m.log.LogRegistry.getInstance(), a.getName());
    "function" === typeof d && (d = d());
    a = gb(m.log.LogBuffer.getInstance(), c, d, a.getName());
    e.publish(a);
  }
};
m.log.error = function (a, c, d) {
  m.log.ENABLED && a && m.log.log(a, m.log.Level.SEVERE, c, d);
};
m.log.warning = function (a, c, d) {
  m.log.ENABLED && a && m.log.log(a, m.log.Level.WARNING, c, d);
};
m.log.info = function (a, c, d) {
  m.log.ENABLED && a && m.log.log(a, m.log.Level.INFO, c, d);
};
m.log.fine = function (a, c) {
  m.log.ENABLED && a && m.log.log(a, m.log.Level.FINE, c, void 0);
};
m.net = {};
m.net.ErrorCode = {
  NO_ERROR: 0,
  ACCESS_DENIED: 1,
  FILE_NOT_FOUND: 2,
  FF_SILENT_ERROR: 3,
  CUSTOM_ERROR: 4,
  EXCEPTION: 5,
  HTTP_ERROR: 6,
  ABORT: 7,
  TIMEOUT: 8,
  OFFLINE: 9,
};
m.net.ErrorCode.getDebugMessage = function (a) {
  switch (a) {
    case m.net.ErrorCode.NO_ERROR:
      return "No Error";
    case m.net.ErrorCode.ACCESS_DENIED:
      return "Access denied to content document";
    case m.net.ErrorCode.FILE_NOT_FOUND:
      return "File not found";
    case m.net.ErrorCode.FF_SILENT_ERROR:
      return "Firefox silently errored";
    case m.net.ErrorCode.CUSTOM_ERROR:
      return "Application custom error";
    case m.net.ErrorCode.EXCEPTION:
      return "An exception occurred";
    case m.net.ErrorCode.HTTP_ERROR:
      return "Http response at 400 or 500 level";
    case m.net.ErrorCode.ABORT:
      return "Request was aborted";
    case m.net.ErrorCode.TIMEOUT:
      return "Request timed out";
    case m.net.ErrorCode.OFFLINE:
      return "The resource is not available offline";
    default:
      return "Unrecognized error code";
  }
};
m.net.EventType = {
  COMPLETE: "complete",
  SUCCESS: "success",
  ERROR: "error",
  ABORT: "abort",
  READY: "ready",
  READY_STATE_CHANGE: "readystatechange",
  TIMEOUT: "timeout",
  INCREMENTAL_DATA: "incrementaldata",
  PROGRESS: "progress",
  DOWNLOAD_PROGRESS: "downloadprogress",
  UPLOAD_PROGRESS: "uploadprogress",
};
m.net.HttpStatus = {
  CONTINUE: 100,
  SWITCHING_PROTOCOLS: 101,
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NON_AUTHORITATIVE_INFORMATION: 203,
  NO_CONTENT: 204,
  RESET_CONTENT: 205,
  PARTIAL_CONTENT: 206,
  MULTI_STATUS: 207,
  MULTIPLE_CHOICES: 300,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,
  USE_PROXY: 305,
  TEMPORARY_REDIRECT: 307,
  PERMANENT_REDIRECT: 308,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  REQUEST_ENTITY_TOO_LARGE: 413,
  REQUEST_URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  REQUEST_RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  UNPROCESSABLE_ENTITY: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  INSUFFICIENT_STORAGE: 507,
  NETWORK_AUTHENTICATION_REQUIRED: 511,
  QUIRK_IE_NO_CONTENT: 1223,
};
m.net.HttpStatus.isSuccess = function (a) {
  switch (a) {
    case m.net.HttpStatus.OK:
    case m.net.HttpStatus.CREATED:
    case m.net.HttpStatus.ACCEPTED:
    case m.net.HttpStatus.NO_CONTENT:
    case m.net.HttpStatus.PARTIAL_CONTENT:
    case m.net.HttpStatus.NOT_MODIFIED:
    case m.net.HttpStatus.QUIRK_IE_NO_CONTENT:
      return !0;
    default:
      return !1;
  }
};
m.net.XhrLike = function () {};
b = m.net.XhrLike.prototype;
b.open = function () {};
b.send = function () {};
b.abort = function () {};
b.setRequestHeader = function () {};
b.getResponseHeader = function () {};
b.getAllResponseHeaders = function () {};
m.net.XmlHttpFactory = function () {};
m.net.XmlHttpFactory.prototype.cachedOptions_ = null;
m.net.XmlHttpFactory.prototype.getOptions = function () {
  var a;
  (a = this.cachedOptions_) ||
    ((a = {}),
    mb(this) &&
      ((a[m.net.XmlHttp.OptionType.USE_NULL_FUNCTION] = !0),
      (a[m.net.XmlHttp.OptionType.LOCAL_REQUEST_ERROR] = !0)),
    (a = this.cachedOptions_ = a));
  return a;
};
m.net.WrapperXmlHttpFactory = function (a, c) {
  this.xhrFactory_ = a;
  this.optionsFactory_ = c;
};
m.inherits(m.net.WrapperXmlHttpFactory, m.net.XmlHttpFactory);
m.net.WrapperXmlHttpFactory.prototype.createInstance = function () {
  return this.xhrFactory_();
};
m.net.WrapperXmlHttpFactory.prototype.getOptions = function () {
  return this.optionsFactory_();
};
m.net.XmlHttp = function () {
  return m.net.XmlHttp.factory_.createInstance();
};
m.net.XmlHttp.ASSUME_NATIVE_XHR = !1;
m.net.XmlHttpDefines = {};
m.net.XmlHttpDefines.ASSUME_NATIVE_XHR = !1;
m.net.XmlHttp.getOptions = function () {
  return m.net.XmlHttp.factory_.getOptions();
};
m.net.XmlHttp.OptionType = { USE_NULL_FUNCTION: 0, LOCAL_REQUEST_ERROR: 1 };
m.net.XmlHttp.ReadyState = {
  UNINITIALIZED: 0,
  LOADING: 1,
  LOADED: 2,
  INTERACTIVE: 3,
  COMPLETE: 4,
};
m.net.XmlHttp.setFactory = function (a, c) {
  m.net.XmlHttp.setGlobalFactory(
    new m.net.WrapperXmlHttpFactory(m.asserts.assert(a), m.asserts.assert(c))
  );
};
m.net.XmlHttp.setGlobalFactory = function (a) {
  m.net.XmlHttp.factory_ = a;
};
m.net.DefaultXmlHttpFactory = function () {};
m.inherits(m.net.DefaultXmlHttpFactory, m.net.XmlHttpFactory);
m.net.DefaultXmlHttpFactory.prototype.createInstance = function () {
  var a = mb(this);
  return a ? new ActiveXObject(a) : new XMLHttpRequest();
};
var mb = function (a) {
  if (m.net.XmlHttp.ASSUME_NATIVE_XHR || m.net.XmlHttpDefines.ASSUME_NATIVE_XHR)
    return "";
  if (
    !a.ieProgId_ &&
    "undefined" == typeof XMLHttpRequest &&
    "undefined" != typeof ActiveXObject
  ) {
    for (
      var c = [
          "MSXML2.XMLHTTP.6.0",
          "MSXML2.XMLHTTP.3.0",
          "MSXML2.XMLHTTP",
          "Microsoft.XMLHTTP",
        ],
        d = 0;
      d < c.length;
      d++
    ) {
      var e = c[d];
      try {
        return new ActiveXObject(e), (a.ieProgId_ = e);
      } catch (f) {}
    }
    throw Error(
      "Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed"
    );
  }
  return a.ieProgId_;
};
m.net.XmlHttp.setGlobalFactory(new m.net.DefaultXmlHttpFactory());
m.promise = {};
m.promise.Resolver = function () {};
m.Thenable = function () {};
m.Thenable.prototype.then = function () {};
m.Thenable.IMPLEMENTED_BY_PROP = "$goog_Thenable";
m.Thenable.addImplementation = function (a) {
  a.prototype[m.Thenable.IMPLEMENTED_BY_PROP] = !0;
};
m.Thenable.isImplementedBy = function (a) {
  if (!a) return !1;
  try {
    return !!a[m.Thenable.IMPLEMENTED_BY_PROP];
  } catch (c) {
    return !1;
  }
};
m.Promise = function (a, c) {
  this.state_ = m.Promise.State_.PENDING;
  this.result_ = void 0;
  this.callbackEntriesTail_ = this.callbackEntries_ = this.parent_ = null;
  this.executing_ = !1;
  0 < m.Promise.UNHANDLED_REJECTION_DELAY
    ? (this.unhandledRejectionId_ = 0)
    : 0 == m.Promise.UNHANDLED_REJECTION_DELAY &&
      (this.hadUnhandledRejection_ = !1);
  m.Promise.LONG_STACK_TRACES &&
    ((this.stack_ = []), nb(this, Error("created")), (this.currentStep_ = 0));
  if (a != m.nullFunction)
    try {
      var d = this;
      a.call(
        c,
        function (e) {
          X(d, m.Promise.State_.FULFILLED, e);
        },
        function (e) {
          if (m.DEBUG && !(e instanceof m.Promise.CancellationError))
            try {
              if (e instanceof Error) throw e;
              throw Error("Promise rejected.");
            } catch (f) {}
          X(d, m.Promise.State_.REJECTED, e);
        }
      );
    } catch (e) {
      X(this, m.Promise.State_.REJECTED, e);
    }
};
m.Promise.LONG_STACK_TRACES = !1;
m.Promise.UNHANDLED_REJECTION_DELAY = 0;
m.Promise.State_ = { PENDING: 0, BLOCKED: 1, FULFILLED: 2, REJECTED: 3 };
m.Promise.CallbackEntry_ = function () {
  this.next =
    this.context =
    this.onRejected =
    this.onFulfilled =
    this.child =
      null;
  this.always = !1;
};
m.Promise.CallbackEntry_.prototype.reset = function () {
  this.context = this.onRejected = this.onFulfilled = this.child = null;
  this.always = !1;
};
m.Promise.DEFAULT_MAX_UNUSED = 100;
m.Promise.freelist_ = new m.async.FreeList(
  function () {
    return new m.Promise.CallbackEntry_();
  },
  function (a) {
    a.reset();
  },
  m.Promise.DEFAULT_MAX_UNUSED
);
m.Promise.getCallbackEntry_ = function (a, c, d) {
  var e = m.Promise.freelist_.get();
  e.onFulfilled = a;
  e.onRejected = c;
  e.context = d;
  return e;
};
m.Promise.returnEntry_ = function (a) {
  m.Promise.freelist_.put(a);
};
m.Promise.resolve = function (a) {
  if (a instanceof m.Promise) return a;
  var c = new m.Promise(m.nullFunction);
  X(c, m.Promise.State_.FULFILLED, a);
  return c;
};
m.Promise.reject = function (a) {
  return new m.Promise(function (c, d) {
    d(a);
  });
};
m.Promise.resolveThen_ = function (a, c, d) {
  m.Promise.maybeThen_(a, c, d, null) || m.async.run(m.partial(c, a));
};
m.Promise.race = function (a) {
  return new m.Promise(function (c, d) {
    a.length || c(void 0);
    for (var e = 0, f; e < a.length; e++)
      (f = a[e]), m.Promise.resolveThen_(f, c, d);
  });
};
m.Promise.all = function (a) {
  return new m.Promise(function (c, d) {
    var e = a.length,
      f = [];
    if (e)
      for (
        var g = function (p, v) {
            e--;
            f[p] = v;
            0 == e && c(f);
          },
          h = function (p) {
            d(p);
          },
          l = 0,
          n;
        l < a.length;
        l++
      )
        (n = a[l]), m.Promise.resolveThen_(n, m.partial(g, l), h);
    else c(f);
  });
};
m.Promise.allSettled = function (a) {
  return new m.Promise(function (c) {
    var d = a.length,
      e = [];
    if (d)
      for (
        var f = function (l, n, p) {
            d--;
            e[l] = n
              ? { fulfilled: !0, value: p }
              : { fulfilled: !1, reason: p };
            0 == d && c(e);
          },
          g = 0,
          h;
        g < a.length;
        g++
      )
        (h = a[g]),
          m.Promise.resolveThen_(h, m.partial(f, g, !0), m.partial(f, g, !1));
    else c(e);
  });
};
m.Promise.firstFulfilled = function (a) {
  return new m.Promise(function (c, d) {
    var e = a.length,
      f = [];
    if (e)
      for (
        var g = function (p) {
            c(p);
          },
          h = function (p, v) {
            e--;
            f[p] = v;
            0 == e && d(f);
          },
          l = 0,
          n;
        l < a.length;
        l++
      )
        (n = a[l]), m.Promise.resolveThen_(n, g, m.partial(h, l));
    else c(void 0);
  });
};
m.Promise.withResolver = function () {
  var a,
    c,
    d = new m.Promise(function (e, f) {
      a = e;
      c = f;
    });
  return new m.Promise.Resolver_(d, a, c);
};
m.Promise.prototype.then = function (a, c, d) {
  null != a &&
    m.asserts.assertFunction(a, "opt_onFulfilled should be a function.");
  null != c &&
    m.asserts.assertFunction(
      c,
      "opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?"
    );
  m.Promise.LONG_STACK_TRACES && nb(this, Error("then"));
  return ob(
    this,
    "function" === typeof a ? a : null,
    "function" === typeof c ? c : null,
    d
  );
};
m.Thenable.addImplementation(m.Promise);
var pb = function (a, c) {
  m.Promise.LONG_STACK_TRACES && nb(a, Error("thenCatch"));
  return ob(a, null, c, void 0);
};
m.Promise.prototype.cancel = function (a) {
  if (this.state_ == m.Promise.State_.PENDING) {
    var c = new m.Promise.CancellationError(a);
    m.async.run(function () {
      qb(this, c);
    }, this);
  }
};
var qb = function (a, c) {
    if (a.state_ == m.Promise.State_.PENDING)
      if (a.parent_) {
        var d = a.parent_;
        if (d.callbackEntries_) {
          for (
            var e = 0, f = null, g = null, h = d.callbackEntries_;
            h && (h.always || (e++, h.child == a && (f = h), !(f && 1 < e)));
            h = h.next
          )
            f || (g = h);
          f &&
            (d.state_ == m.Promise.State_.PENDING && 1 == e
              ? qb(d, c)
              : (g
                  ? ((e = g),
                    m.asserts.assert(d.callbackEntries_),
                    m.asserts.assert(null != e),
                    e.next == d.callbackEntriesTail_ &&
                      (d.callbackEntriesTail_ = e),
                    (e.next = e.next.next))
                  : rb(d),
                sb(d, f, m.Promise.State_.REJECTED, c)));
        }
        a.parent_ = null;
      } else X(a, m.Promise.State_.REJECTED, c);
  },
  ub = function (a, c) {
    a.callbackEntries_ ||
      (a.state_ != m.Promise.State_.FULFILLED &&
        a.state_ != m.Promise.State_.REJECTED) ||
      tb(a);
    m.asserts.assert(null != c.onFulfilled);
    a.callbackEntriesTail_
      ? (a.callbackEntriesTail_.next = c)
      : (a.callbackEntries_ = c);
    a.callbackEntriesTail_ = c;
  },
  ob = function (a, c, d, e) {
    var f = m.Promise.getCallbackEntry_(null, null, null);
    f.child = new m.Promise(function (g, h) {
      f.onFulfilled = c
        ? function (l) {
            try {
              var n = c.call(e, l);
              g(n);
            } catch (p) {
              h(p);
            }
          }
        : g;
      f.onRejected = d
        ? function (l) {
            try {
              var n = d.call(e, l);
              void 0 === n && l instanceof m.Promise.CancellationError
                ? h(l)
                : g(n);
            } catch (p) {
              h(p);
            }
          }
        : h;
    });
    f.child.parent_ = a;
    ub(a, f);
    return f.child;
  };
m.Promise.prototype.unblockAndFulfill_ = function (a) {
  m.asserts.assert(this.state_ == m.Promise.State_.BLOCKED);
  this.state_ = m.Promise.State_.PENDING;
  X(this, m.Promise.State_.FULFILLED, a);
};
m.Promise.prototype.unblockAndReject_ = function (a) {
  m.asserts.assert(this.state_ == m.Promise.State_.BLOCKED);
  this.state_ = m.Promise.State_.PENDING;
  X(this, m.Promise.State_.REJECTED, a);
};
var X = function (a, c, d) {
  a.state_ == m.Promise.State_.PENDING &&
    (a === d &&
      ((c = m.Promise.State_.REJECTED),
      (d = new TypeError("Promise cannot resolve to itself"))),
    (a.state_ = m.Promise.State_.BLOCKED),
    m.Promise.maybeThen_(d, a.unblockAndFulfill_, a.unblockAndReject_, a) ||
      ((a.result_ = d),
      (a.state_ = c),
      (a.parent_ = null),
      tb(a),
      c != m.Promise.State_.REJECTED ||
        d instanceof m.Promise.CancellationError ||
        m.Promise.addUnhandledRejection_(a, d)));
};
m.Promise.maybeThen_ = function (a, c, d, e) {
  if (a instanceof m.Promise)
    return (
      null != c &&
        m.asserts.assertFunction(c, "opt_onFulfilled should be a function."),
      null != d &&
        m.asserts.assertFunction(
          d,
          "opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?"
        ),
      m.Promise.LONG_STACK_TRACES && nb(a, Error("then")),
      ub(a, m.Promise.getCallbackEntry_(c || m.nullFunction, d || null, e)),
      !0
    );
  if (m.Thenable.isImplementedBy(a)) return a.then(c, d, e), !0;
  if (m.isObject(a))
    try {
      var f = a.then;
      if ("function" === typeof f) return m.Promise.tryThen_(a, f, c, d, e), !0;
    } catch (g) {
      return d.call(e, g), !0;
    }
  return !1;
};
m.Promise.tryThen_ = function (a, c, d, e, f) {
  var g = !1,
    h = function (n) {
      g || ((g = !0), d.call(f, n));
    },
    l = function (n) {
      g || ((g = !0), e.call(f, n));
    };
  try {
    c.call(a, h, l);
  } catch (n) {
    l(n);
  }
};
var tb = function (a) {
    a.executing_ || ((a.executing_ = !0), m.async.run(a.executeCallbacks_, a));
  },
  rb = function (a) {
    var c = null;
    a.callbackEntries_ &&
      ((c = a.callbackEntries_),
      (a.callbackEntries_ = c.next),
      (c.next = null));
    a.callbackEntries_ || (a.callbackEntriesTail_ = null);
    null != c && m.asserts.assert(null != c.onFulfilled);
    return c;
  };
m.Promise.prototype.executeCallbacks_ = function () {
  for (var a; (a = rb(this)); )
    m.Promise.LONG_STACK_TRACES && this.currentStep_++,
      sb(this, a, this.state_, this.result_);
  this.executing_ = !1;
};
var sb = function (a, c, d, e) {
  if (d == m.Promise.State_.REJECTED && c.onRejected && !c.always)
    if (0 < m.Promise.UNHANDLED_REJECTION_DELAY)
      for (; a && a.unhandledRejectionId_; a = a.parent_)
        m.global.clearTimeout(a.unhandledRejectionId_),
          (a.unhandledRejectionId_ = 0);
    else if (0 == m.Promise.UNHANDLED_REJECTION_DELAY)
      for (; a && a.hadUnhandledRejection_; a = a.parent_)
        a.hadUnhandledRejection_ = !1;
  if (c.child) (c.child.parent_ = null), m.Promise.invokeCallback_(c, d, e);
  else
    try {
      c.always
        ? c.onFulfilled.call(c.context)
        : m.Promise.invokeCallback_(c, d, e);
    } catch (f) {
      m.Promise.handleRejection_.call(null, f);
    }
  m.Promise.returnEntry_(c);
};
m.Promise.invokeCallback_ = function (a, c, d) {
  c == m.Promise.State_.FULFILLED
    ? a.onFulfilled.call(a.context, d)
    : a.onRejected && a.onRejected.call(a.context, d);
};
var nb = function (a, c) {
    if (m.Promise.LONG_STACK_TRACES && "string" === typeof c.stack) {
      var d = c.stack.split("\n", 4)[3];
      c = c.message;
      c += Array(11 - c.length).join(" ");
      a.stack_.push(c + d);
    }
  },
  vb = function (a, c) {
    if (
      m.Promise.LONG_STACK_TRACES &&
      c &&
      "string" === typeof c.stack &&
      a.stack_.length
    ) {
      for (var d = ["Promise trace:"], e = a; e; e = e.parent_) {
        for (var f = a.currentStep_; 0 <= f; f--) d.push(e.stack_[f]);
        d.push(
          "Value: [" +
            (e.state_ == m.Promise.State_.REJECTED ? "REJECTED" : "FULFILLED") +
            "] <" +
            String(e.result_) +
            ">"
        );
      }
      c.stack += "\n\n" + d.join("\n");
    }
  };
m.Promise.addUnhandledRejection_ = function (a, c) {
  0 < m.Promise.UNHANDLED_REJECTION_DELAY
    ? (a.unhandledRejectionId_ = m.global.setTimeout(function () {
        vb(a, c);
        m.Promise.handleRejection_.call(null, c);
      }, m.Promise.UNHANDLED_REJECTION_DELAY))
    : 0 == m.Promise.UNHANDLED_REJECTION_DELAY &&
      ((a.hadUnhandledRejection_ = !0),
      m.async.run(function () {
        a.hadUnhandledRejection_ &&
          (vb(a, c), m.Promise.handleRejection_.call(null, c));
      }));
};
m.Promise.handleRejection_ = $a;
m.Promise.setUnhandledRejectionHandler = function (a) {
  m.Promise.handleRejection_ = a;
};
m.Promise.CancellationError = function (a) {
  r.call(this, a);
};
m.inherits(m.Promise.CancellationError, r);
m.Promise.CancellationError.prototype.name = "cancel";
m.Promise.Resolver_ = function (a, c, d) {
  this.promise = a;
  this.resolve = c;
  this.reject = d;
};
m.Timer = function (a, c) {
  m.events.EventTarget.call(this);
  this.interval_ = a || 1;
  this.timerObject_ = c || m.Timer.defaultTimerObject;
  this.boundTick_ = m.bind(this.tick_, this);
  this.last_ = m.now();
};
m.inherits(m.Timer, m.events.EventTarget);
m.Timer.MAX_TIMEOUT_ = 2147483647;
m.Timer.INVALID_TIMEOUT_ID_ = -1;
m.Timer.prototype.enabled = !1;
m.Timer.defaultTimerObject = m.global;
m.Timer.intervalScale = 0.8;
b = m.Timer.prototype;
b.timer_ = null;
b.setInterval = function (a) {
  this.interval_ = a;
  this.timer_ && this.enabled
    ? (this.stop(), this.start())
    : this.timer_ && this.stop();
};
b.tick_ = function () {
  if (this.enabled) {
    var a = m.now() - this.last_;
    0 < a && a < this.interval_ * m.Timer.intervalScale
      ? (this.timer_ = this.timerObject_.setTimeout(
          this.boundTick_,
          this.interval_ - a
        ))
      : (this.timer_ &&
          (this.timerObject_.clearTimeout(this.timer_), (this.timer_ = null)),
        this.dispatchEvent(m.Timer.TICK),
        this.enabled && (this.stop(), this.start()));
  }
};
b.start = function () {
  this.enabled = !0;
  this.timer_ ||
    ((this.timer_ = this.timerObject_.setTimeout(
      this.boundTick_,
      this.interval_
    )),
    (this.last_ = m.now()));
};
b.stop = function () {
  this.enabled = !1;
  this.timer_ &&
    (this.timerObject_.clearTimeout(this.timer_), (this.timer_ = null));
};
b.disposeInternal = function () {
  m.Timer.superClass_.disposeInternal.call(this);
  this.stop();
  delete this.timerObject_;
};
m.Timer.TICK = "tick";
m.Timer.callOnce = function (a, c, d) {
  if ("function" === typeof a) d && (a = m.bind(a, d));
  else if (a && "function" == typeof a.handleEvent)
    a = m.bind(a.handleEvent, a);
  else throw Error("Invalid listener argument");
  return Number(c) > m.Timer.MAX_TIMEOUT_
    ? m.Timer.INVALID_TIMEOUT_ID_
    : m.Timer.defaultTimerObject.setTimeout(a, c || 0);
};
m.Timer.clear = function (a) {
  m.Timer.defaultTimerObject.clearTimeout(a);
};
m.Timer.promise = function (a, c) {
  var d = null;
  return pb(
    new m.Promise(function (e, f) {
      d = m.Timer.callOnce(function () {
        e(c);
      }, a);
      d == m.Timer.INVALID_TIMEOUT_ID_ && f(Error("Failed to schedule timer."));
    }),
    function (e) {
      m.Timer.clear(d);
      throw e;
    }
  );
};
m.net.XhrIo = function (a) {
  m.events.EventTarget.call(this);
  this.headers = new m.structs.Map();
  this.xmlHttpFactory_ = a || null;
  this.active_ = !1;
  this.xhrOptions_ = this.xhr_ = null;
  this.lastError_ = this.lastMethod_ = this.lastUri_ = "";
  this.inAbort_ = this.inOpen_ = this.inSend_ = this.errorDispatched_ = !1;
  this.timeoutInterval_ = 0;
  this.timeoutId_ = null;
  this.responseType_ = m.net.XhrIo.ResponseType.DEFAULT;
  this.useXhr2Timeout_ =
    this.progressEventsEnabled_ =
    this.withCredentials_ =
      !1;
};
m.inherits(m.net.XhrIo, m.events.EventTarget);
m.net.XhrIo.ResponseType = {
  DEFAULT: "",
  TEXT: "text",
  DOCUMENT: "document",
  BLOB: "blob",
  ARRAY_BUFFER: "arraybuffer",
};
m.net.XhrIo.prototype.logger_ = m.log.getLogger();
m.net.XhrIo.CONTENT_TYPE_HEADER = "Content-Type";
m.net.XhrIo.CONTENT_TRANSFER_ENCODING = "Content-Transfer-Encoding";
m.net.XhrIo.HTTP_SCHEME_PATTERN = /^https?$/i;
m.net.XhrIo.METHODS_WITH_FORM_DATA = ["POST", "PUT"];
m.net.XhrIo.FORM_CONTENT_TYPE =
  "application/x-www-form-urlencoded;charset=utf-8";
m.net.XhrIo.XHR2_TIMEOUT_ = "timeout";
m.net.XhrIo.XHR2_ON_TIMEOUT_ = "ontimeout";
m.net.XhrIo.sendInstances_ = [];
m.net.XhrIo.send = function (a, c, d, e, f, g, h) {
  var l = new m.net.XhrIo();
  m.net.XhrIo.sendInstances_.push(l);
  c && l.listen(m.net.EventType.COMPLETE, c);
  l.listenOnce(m.net.EventType.READY, l.cleanupSend_);
  g && (l.timeoutInterval_ = Math.max(0, g));
  h && (l.withCredentials_ = h);
  l.send(a, d, e, f);
  return l;
};
m.net.XhrIo.cleanup = function () {
  for (var a = m.net.XhrIo.sendInstances_; a.length; ) a.pop().dispose();
};
m.net.XhrIo.protectEntryPoints = function (a) {
  m.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = a.protectEntryPoint(
    m.net.XhrIo.prototype.onReadyStateChangeEntryPoint_
  );
};
m.net.XhrIo.prototype.cleanupSend_ = function () {
  this.dispose();
  pa(m.net.XhrIo.sendInstances_, this);
};
m.net.XhrIo.prototype.send = function (a, c, d, e) {
  if (this.xhr_)
    throw Error(
      "[goog.net.XhrIo] Object is active with another request=" +
        this.lastUri_ +
        "; newUri=" +
        a
    );
  c = c ? c.toUpperCase() : "GET";
  this.lastUri_ = a;
  this.lastError_ = "";
  this.lastMethod_ = c;
  this.errorDispatched_ = !1;
  this.active_ = !0;
  this.xhr_ = this.xmlHttpFactory_
    ? this.xmlHttpFactory_.createInstance()
    : m.net.XmlHttp();
  this.xhrOptions_ = this.xmlHttpFactory_
    ? this.xmlHttpFactory_.getOptions()
    : m.net.XmlHttp.getOptions();
  this.xhr_.onreadystatechange = m.bind(this.onReadyStateChange_, this);
  this.progressEventsEnabled_ &&
    "onprogress" in this.xhr_ &&
    ((this.xhr_.onprogress = m.bind(function (g) {
      this.onProgressHandler_(g, !0);
    }, this)),
    this.xhr_.upload &&
      (this.xhr_.upload.onprogress = m.bind(this.onProgressHandler_, this)));
  try {
    m.log.fine(this.logger_, Y(this, "Opening Xhr")),
      (this.inOpen_ = !0),
      this.xhr_.open(c, String(a), !0),
      (this.inOpen_ = !1);
  } catch (g) {
    m.log.fine(this.logger_, Y(this, "Error opening Xhr: " + g.message));
    wb(this, g);
    return;
  }
  a = d || "";
  var f = this.headers.clone();
  e &&
    m.structs.forEach(e, function (g, h) {
      f.set(h, g);
    });
  e = ja(f.getKeys(), m.net.XhrIo.isContentTypeHeader_);
  d = m.global.FormData && a instanceof m.global.FormData;
  !y(m.net.XhrIo.METHODS_WITH_FORM_DATA, c) ||
    e ||
    d ||
    f.set(m.net.XhrIo.CONTENT_TYPE_HEADER, m.net.XhrIo.FORM_CONTENT_TYPE);
  f.forEach(function (g, h) {
    this.xhr_.setRequestHeader(h, g);
  }, this);
  this.responseType_ && (this.xhr_.responseType = this.responseType_);
  "withCredentials" in this.xhr_ &&
    this.xhr_.withCredentials !== this.withCredentials_ &&
    (this.xhr_.withCredentials = this.withCredentials_);
  try {
    xb(this),
      0 < this.timeoutInterval_ &&
        ((this.useXhr2Timeout_ = m.net.XhrIo.shouldUseXhr2Timeout_(this.xhr_)),
        m.log.fine(
          this.logger_,
          Y(
            this,
            "Will abort after " +
              this.timeoutInterval_ +
              "ms if incomplete, xhr2 " +
              this.useXhr2Timeout_
          )
        ),
        this.useXhr2Timeout_
          ? ((this.xhr_[m.net.XhrIo.XHR2_TIMEOUT_] = this.timeoutInterval_),
            (this.xhr_[m.net.XhrIo.XHR2_ON_TIMEOUT_] = m.bind(
              this.timeout_,
              this
            )))
          : (this.timeoutId_ = m.Timer.callOnce(
              this.timeout_,
              this.timeoutInterval_,
              this
            ))),
      m.log.fine(this.logger_, Y(this, "Sending request")),
      (this.inSend_ = !0),
      this.xhr_.send(a),
      (this.inSend_ = !1);
  } catch (g) {
    m.log.fine(this.logger_, Y(this, "Send error: " + g.message)), wb(this, g);
  }
};
m.net.XhrIo.shouldUseXhr2Timeout_ = function (a) {
  return (
    m.userAgent.IE &&
    m.userAgent.isVersionOrHigher(9) &&
    "number" === typeof a[m.net.XhrIo.XHR2_TIMEOUT_] &&
    void 0 !== a[m.net.XhrIo.XHR2_ON_TIMEOUT_]
  );
};
m.net.XhrIo.isContentTypeHeader_ = function (a) {
  return m.string.caseInsensitiveEquals(m.net.XhrIo.CONTENT_TYPE_HEADER, a);
};
m.net.XhrIo.prototype.timeout_ = function () {
  "undefined" != typeof m &&
    this.xhr_ &&
    ((this.lastError_ =
      "Timed out after " + this.timeoutInterval_ + "ms, aborting"),
    m.log.fine(this.logger_, Y(this, this.lastError_)),
    this.dispatchEvent(m.net.EventType.TIMEOUT),
    this.abort(m.net.ErrorCode.TIMEOUT));
};
var wb = function (a, c) {
    a.active_ = !1;
    a.xhr_ && ((a.inAbort_ = !0), a.xhr_.abort(), (a.inAbort_ = !1));
    a.lastError_ = c;
    yb(a);
    zb(a);
  },
  yb = function (a) {
    a.errorDispatched_ ||
      ((a.errorDispatched_ = !0),
      a.dispatchEvent(m.net.EventType.COMPLETE),
      a.dispatchEvent(m.net.EventType.ERROR));
  };
m.net.XhrIo.prototype.abort = function () {
  this.xhr_ &&
    this.active_ &&
    (m.log.fine(this.logger_, Y(this, "Aborting")),
    (this.active_ = !1),
    (this.inAbort_ = !0),
    this.xhr_.abort(),
    (this.inAbort_ = !1),
    this.dispatchEvent(m.net.EventType.COMPLETE),
    this.dispatchEvent(m.net.EventType.ABORT),
    zb(this));
};
m.net.XhrIo.prototype.disposeInternal = function () {
  this.xhr_ &&
    (this.active_ &&
      ((this.active_ = !1),
      (this.inAbort_ = !0),
      this.xhr_.abort(),
      (this.inAbort_ = !1)),
    zb(this, !0));
  m.net.XhrIo.superClass_.disposeInternal.call(this);
};
m.net.XhrIo.prototype.onReadyStateChange_ = function () {
  if (!this.isDisposed())
    if (this.inOpen_ || this.inSend_ || this.inAbort_) Ab(this);
    else this.onReadyStateChangeEntryPoint_();
};
m.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = function () {
  Ab(this);
};
var Ab = function (a) {
  if (a.active_ && "undefined" != typeof m)
    if (
      a.xhrOptions_[m.net.XmlHttp.OptionType.LOCAL_REQUEST_ERROR] &&
      Bb(a) == m.net.XmlHttp.ReadyState.COMPLETE &&
      2 == Cb(a)
    )
      m.log.fine(a.logger_, Y(a, "Local request error detected and ignored"));
    else if (a.inSend_ && Bb(a) == m.net.XmlHttp.ReadyState.COMPLETE)
      m.Timer.callOnce(a.onReadyStateChange_, 0, a);
    else if ((a.dispatchEvent(m.net.EventType.READY_STATE_CHANGE), Db(a))) {
      m.log.fine(a.logger_, Y(a, "Request complete"));
      a.active_ = !1;
      try {
        if (a.isSuccess())
          a.dispatchEvent(m.net.EventType.COMPLETE),
            a.dispatchEvent(m.net.EventType.SUCCESS);
        else {
          try {
            var c =
              Bb(a) > m.net.XmlHttp.ReadyState.LOADED ? a.xhr_.statusText : "";
          } catch (d) {
            m.log.fine(a.logger_, "Can not get status: " + d.message), (c = "");
          }
          a.lastError_ = c + " [" + Cb(a) + "]";
          yb(a);
        }
      } finally {
        zb(a);
      }
    }
};
m.net.XhrIo.prototype.onProgressHandler_ = function (a, c) {
  m.asserts.assert(
    a.type === m.net.EventType.PROGRESS,
    "goog.net.EventType.PROGRESS is of the same type as raw XHR progress."
  );
  this.dispatchEvent(
    m.net.XhrIo.buildProgressEvent_(a, m.net.EventType.PROGRESS)
  );
  this.dispatchEvent(
    m.net.XhrIo.buildProgressEvent_(
      a,
      c ? m.net.EventType.DOWNLOAD_PROGRESS : m.net.EventType.UPLOAD_PROGRESS
    )
  );
};
m.net.XhrIo.buildProgressEvent_ = function (a, c) {
  return {
    type: c,
    lengthComputable: a.lengthComputable,
    loaded: a.loaded,
    total: a.total,
  };
};
var zb = function (a, c) {
    if (a.xhr_) {
      xb(a);
      var d = a.xhr_,
        e = a.xhrOptions_[m.net.XmlHttp.OptionType.USE_NULL_FUNCTION]
          ? m.nullFunction
          : null;
      a.xhr_ = null;
      a.xhrOptions_ = null;
      c || a.dispatchEvent(m.net.EventType.READY);
      try {
        d.onreadystatechange = e;
      } catch (f) {
        m.log.error(
          a.logger_,
          "Problem encountered resetting onreadystatechange: " + f.message
        );
      }
    }
  },
  xb = function (a) {
    a.xhr_ &&
      a.useXhr2Timeout_ &&
      (a.xhr_[m.net.XhrIo.XHR2_ON_TIMEOUT_] = null);
    a.timeoutId_ && (m.Timer.clear(a.timeoutId_), (a.timeoutId_ = null));
  },
  Db = function (a) {
    return Bb(a) == m.net.XmlHttp.ReadyState.COMPLETE;
  };
m.net.XhrIo.prototype.isSuccess = function () {
  var a = Cb(this),
    c;
  if (!(c = m.net.HttpStatus.isSuccess(a))) {
    if ((a = 0 === a))
      (a = m.uri.utils.getEffectiveScheme(String(this.lastUri_))),
        (a = !m.net.XhrIo.HTTP_SCHEME_PATTERN.test(a));
    c = a;
  }
  return c;
};
var Bb = function (a) {
    return a.xhr_ ? a.xhr_.readyState : m.net.XmlHttp.ReadyState.UNINITIALIZED;
  },
  Cb = function (a) {
    try {
      return Bb(a) > m.net.XmlHttp.ReadyState.LOADED ? a.xhr_.status : -1;
    } catch (c) {
      return -1;
    }
  };
m.net.XhrIo.prototype.getResponseHeader = function (a) {
  if (this.xhr_ && Db(this))
    return (a = this.xhr_.getResponseHeader(a)), null === a ? void 0 : a;
};
m.net.XhrIo.prototype.getAllResponseHeaders = function () {
  return this.xhr_ && Db(this) ? this.xhr_.getAllResponseHeaders() || "" : "";
};
var Y = function (a, c) {
  return c + " [" + a.lastMethod_ + " " + a.lastUri_ + " " + Cb(a) + "]";
};
m.debug.entryPointRegistry.register(function (a) {
  m.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = a(
    m.net.XhrIo.prototype.onReadyStateChangeEntryPoint_
  );
});
var Z = function (a, c, d) {
  this.appUrl_ = a;
  this.authCompletedCallback_ = c;
  this.authFailedCallback_ = d || m.functions.NULL;
  this.uberTokenAttempts_ = 0;
};
Z.prototype.onAuthTokenReceived_ = function (a) {
  if (void 0 === a) this.authFailedCallback_();
  else {
    var c = m.bind(this.onUberAuthResponse_, this),
      d = "source=" + chrome.runtime.getManifest().oauth2.client_id,
      e = {
        Authorization: "Bearer " + a,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      f = m.bind(function () {
        0 === this.uberTokenAttempts_
          ? (++this.uberTokenAttempts_,
            chrome.identity.removeCachedAuthToken(
              { token: a },
              m.bind(this.authenticate, this)
            ))
          : this.authFailedCallback_();
      }, this);
    m.net.XhrIo.send(
      Z.UBERAUTH_URL_,
      function () {
        if (this.isSuccess()) {
          try {
            var g = this.xhr_ ? this.xhr_.responseText : "";
          } catch (h) {
            m.log.fine(this.logger_, "Can not get responseText: " + h.message),
              (g = "");
          }
          c(g);
        } else f();
      },
      "POST",
      d,
      e
    );
  }
};
Z.prototype.onUberAuthResponse_ = function (a) {
  var c = m.Uri.parse("https://accounts.google.com/MergeSession");
  P(c, "source", "appsv2");
  P(c, "uberauth", a);
  P(c, "continue", this.appUrl_);
  this.authCompletedCallback_(c.toString());
};
Z.prototype.authenticate = function () {
  chrome.identity.getAuthToken(
    { interactive: !0 },
    m.bind(this.onAuthTokenReceived_, this)
  );
};
Z.UBERAUTH_URL_ = "https://www.google.com/accounts/OAuthLogin?issueuberauth=1";
m.craw.AppAuthenticator = Z;
var Eb = function (a, c) {
  this.url_ = a;
  this.useAuth_ = c;
};
Eb.prototype.getUrl = function () {
  return this.url_;
};
Eb.prototype.getUseAuth = function () {
  return this.useAuth_;
};
m.craw.WindowConfig = Eb;
var J = function (a) {
  this.config_ = a;
  this.authenticator_ = new Z(
    a.getUrl(),
    m.bind(this.navigateToUrl_, this),
    m.bind(this.showOfflineWarning, this)
  );
  this.webview_ = m.dom.getDocument().querySelector("webview");
  this.hasLaunched_ = !1;
  this.loadingOverlay_ = m.dom.getElement("loading_overlay");
  this.offlineOverlay_ = m.dom.getElement("offline_overlay");
  this.customStatus_ = null;
  this.delegate_ = new q.defaultImpl_(this);
  this.webview_.addEventListener(
    "contentload",
    m.bind(this.onContentLoad_, this),
    !1
  );
  this.webview_.addEventListener(
    "newwindow",
    m.bind(this.onNewWindow_, this),
    !1
  );
  this.delegate_.onWindowReady();
  this.pollOnlineStatus_();
};
J.prototype.navigateToUrl_ = function (a) {
  this.webview_.src = a;
  this.hasLaunched_ = !0;
};
J.prototype.onContentLoad_ = function () {};
J.prototype.onNewWindow_ = function () {};
var Fb = function (a) {
  a.hasLaunched_ = !1;
  a.config_.getUseAuth()
    ? a.authenticator_.authenticate()
    : a.navigateToUrl_(a.config_.getUrl());
};
b = J.prototype;
b.hideVisibleOverlays_ = function () {
  this.loadingOverlay_.style.display = "none";
  this.offlineOverlay_.style.display = "none";
};
b.fadeInOfflineOverlay_ = function () {
  this.offlineOverlay_.style.opacity = "1";
};
b.showOfflineWarning = function () {
  m.dom.getElement("app_unavailable").innerText =
    this.delegate_.getAppUnavailableMessage();
  m.dom.getElement("connect_to_network").innerText =
    this.customStatus_ || chrome.i18n.getMessage("craw_connect_to_network");
  this.offlineOverlay_.style.display = "-webkit-flex";
  this.offlineOverlay_.style.pointerEvents = "all";
  m.Timer.callOnce(m.bind(this.fadeInOfflineOverlay_, this), 0);
};
b.setOnlineStatus_ = function (a) {
  m.Timer.callOnce(m.bind(this.pollOnlineStatus_, this), 1e3);
  a
    ? this.hasLaunched_
      ? this.delegate_.finishedLaunch() &&
        ((this.offlineOverlay_.style.opacity = "0"),
        (this.offlineOverlay_.style.pointerEvents = "none"),
        (this.loadingOverlay_.style.opacity = "0"),
        (this.loadingOverlay_.style.pointerEvents = "none"),
        m.Timer.callOnce(m.bind(this.hideVisibleOverlays_, this), 250))
      : Fb(this)
    : this.showOfflineWarning();
};
b.pollOnlineStatus_ = function () {
  if ((this.customStatus_ = this.delegate_.pollOnlineStatus()))
    this.setOnlineStatus_(!1);
  else {
    var a = m.bind(this.setOnlineStatus_, this),
      c = new m.Uri(J.NETWORK_TEST_URLS_[m.math.randomInt()]);
    P(c, J.QUERY_NOCACHE_PARAMETER_, Date.now().toString());
    m.net.XhrIo.send(c.toString(), function () {
      a(this.isSuccess());
    });
  }
};
J.QUERY_NOCACHE_PARAMETER_ = "nocache";
J.NETWORK_TEST_URLS_ = [
  "https://www.google.com/images/cleardot.gif",
  "https://www.google.com/images/dot2.gif",
  "https://www.google.com/images/x2.gif",
];
m.craw.AppWindow = J;
window.onload = function () {
  Fb(new J(m.dom.getWindow().crawConfig_));
};
