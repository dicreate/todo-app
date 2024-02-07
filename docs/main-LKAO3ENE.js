var lp = Object.defineProperty,
  dp = Object.defineProperties;
var fp = Object.getOwnPropertyDescriptors;
var yc = Object.getOwnPropertySymbols;
var hp = Object.prototype.hasOwnProperty,
  pp = Object.prototype.propertyIsEnumerable;
var Dc = (t, e, r) =>
    e in t
      ? lp(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r })
      : (t[e] = r),
  g = (t, e) => {
    for (var r in (e ||= {})) hp.call(e, r) && Dc(t, r, e[r]);
    if (yc) for (var r of yc(e)) pp.call(e, r) && Dc(t, r, e[r]);
    return t;
  },
  z = (t, e) => dp(t, fp(e));
var Cc = null;
var Uo = 1,
  wc = Symbol("SIGNAL");
function ne(t) {
  let e = Cc;
  return (Cc = t), e;
}
var _c = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function gp(t) {
  if (!(zo(t) && !t.dirty) && !(!t.dirty && t.lastCleanEpoch === Uo)) {
    if (!t.producerMustRecompute(t) && !Ho(t)) {
      (t.dirty = !1), (t.lastCleanEpoch = Uo);
      return;
    }
    t.producerRecomputeValue(t), (t.dirty = !1), (t.lastCleanEpoch = Uo);
  }
}
function Ic(t) {
  return t && (t.nextProducerIndex = 0), ne(t);
}
function Ec(t, e) {
  if (
    (ne(e),
    !(
      !t ||
      t.producerNode === void 0 ||
      t.producerIndexOfThis === void 0 ||
      t.producerLastReadVersion === void 0
    ))
  ) {
    if (zo(t))
      for (let r = t.nextProducerIndex; r < t.producerNode.length; r++)
        Go(t.producerNode[r], t.producerIndexOfThis[r]);
    for (; t.producerNode.length > t.nextProducerIndex; )
      t.producerNode.pop(),
        t.producerLastReadVersion.pop(),
        t.producerIndexOfThis.pop();
  }
}
function Ho(t) {
  qr(t);
  for (let e = 0; e < t.producerNode.length; e++) {
    let r = t.producerNode[e],
      n = t.producerLastReadVersion[e];
    if (n !== r.version || (gp(r), n !== r.version)) return !0;
  }
  return !1;
}
function bc(t) {
  if ((qr(t), zo(t)))
    for (let e = 0; e < t.producerNode.length; e++)
      Go(t.producerNode[e], t.producerIndexOfThis[e]);
  (t.producerNode.length =
    t.producerLastReadVersion.length =
    t.producerIndexOfThis.length =
      0),
    t.liveConsumerNode &&
      (t.liveConsumerNode.length = t.liveConsumerIndexOfThis.length = 0);
}
function Go(t, e) {
  if ((mp(t), qr(t), t.liveConsumerNode.length === 1))
    for (let n = 0; n < t.producerNode.length; n++)
      Go(t.producerNode[n], t.producerIndexOfThis[n]);
  let r = t.liveConsumerNode.length - 1;
  if (
    ((t.liveConsumerNode[e] = t.liveConsumerNode[r]),
    (t.liveConsumerIndexOfThis[e] = t.liveConsumerIndexOfThis[r]),
    t.liveConsumerNode.length--,
    t.liveConsumerIndexOfThis.length--,
    e < t.liveConsumerNode.length)
  ) {
    let n = t.liveConsumerIndexOfThis[e],
      i = t.liveConsumerNode[e];
    qr(i), (i.producerIndexOfThis[n] = e);
  }
}
function zo(t) {
  return t.consumerIsAlwaysLive || (t?.liveConsumerNode?.length ?? 0) > 0;
}
function qr(t) {
  (t.producerNode ??= []),
    (t.producerIndexOfThis ??= []),
    (t.producerLastReadVersion ??= []);
}
function mp(t) {
  (t.liveConsumerNode ??= []), (t.liveConsumerIndexOfThis ??= []);
}
function vp() {
  throw new Error();
}
var yp = vp;
function Mc(t) {
  yp = t;
}
function C(t) {
  return typeof t == "function";
}
function on(t) {
  let r = t((n) => {
    Error.call(n), (n.stack = new Error().stack);
  });
  return (
    (r.prototype = Object.create(Error.prototype)),
    (r.prototype.constructor = r),
    r
  );
}
var Zr = on(
  (t) =>
    function (r) {
      t(this),
        (this.message = r
          ? `${r.length} errors occurred during unsubscription:
${r.map((n, i) => `${i + 1}) ${n.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = r);
    }
);
function Wn(t, e) {
  if (t) {
    let r = t.indexOf(e);
    0 <= r && t.splice(r, 1);
  }
}
var X = class t {
  constructor(e) {
    (this.initialTeardown = e),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let e;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: r } = this;
      if (r)
        if (((this._parentage = null), Array.isArray(r)))
          for (let o of r) o.remove(this);
        else r.remove(this);
      let { initialTeardown: n } = this;
      if (C(n))
        try {
          n();
        } catch (o) {
          e = o instanceof Zr ? o.errors : [o];
        }
      let { _finalizers: i } = this;
      if (i) {
        this._finalizers = null;
        for (let o of i)
          try {
            Sc(o);
          } catch (s) {
            (e = e ?? []),
              s instanceof Zr ? (e = [...e, ...s.errors]) : e.push(s);
          }
      }
      if (e) throw new Zr(e);
    }
  }
  add(e) {
    var r;
    if (e && e !== this)
      if (this.closed) Sc(e);
      else {
        if (e instanceof t) {
          if (e.closed || e._hasParent(this)) return;
          e._addParent(this);
        }
        (this._finalizers =
          (r = this._finalizers) !== null && r !== void 0 ? r : []).push(e);
      }
  }
  _hasParent(e) {
    let { _parentage: r } = this;
    return r === e || (Array.isArray(r) && r.includes(e));
  }
  _addParent(e) {
    let { _parentage: r } = this;
    this._parentage = Array.isArray(r) ? (r.push(e), r) : r ? [r, e] : e;
  }
  _removeParent(e) {
    let { _parentage: r } = this;
    r === e ? (this._parentage = null) : Array.isArray(r) && Wn(r, e);
  }
  remove(e) {
    let { _finalizers: r } = this;
    r && Wn(r, e), e instanceof t && e._removeParent(this);
  }
};
X.EMPTY = (() => {
  let t = new X();
  return (t.closed = !0), t;
})();
var Wo = X.EMPTY;
function Yr(t) {
  return (
    t instanceof X ||
    (t && "closed" in t && C(t.remove) && C(t.add) && C(t.unsubscribe))
  );
}
function Sc(t) {
  C(t) ? t() : t.unsubscribe();
}
var Pe = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var sn = {
  setTimeout(t, e, ...r) {
    let { delegate: n } = sn;
    return n?.setTimeout ? n.setTimeout(t, e, ...r) : setTimeout(t, e, ...r);
  },
  clearTimeout(t) {
    let { delegate: e } = sn;
    return (e?.clearTimeout || clearTimeout)(t);
  },
  delegate: void 0,
};
function Qr(t) {
  sn.setTimeout(() => {
    let { onUnhandledError: e } = Pe;
    if (e) e(t);
    else throw t;
  });
}
function qn() {}
var xc = qo("C", void 0, void 0);
function Tc(t) {
  return qo("E", void 0, t);
}
function Ac(t) {
  return qo("N", t, void 0);
}
function qo(t, e, r) {
  return { kind: t, value: e, error: r };
}
var Rt = null;
function an(t) {
  if (Pe.useDeprecatedSynchronousErrorHandling) {
    let e = !Rt;
    if ((e && (Rt = { errorThrown: !1, error: null }), t(), e)) {
      let { errorThrown: r, error: n } = Rt;
      if (((Rt = null), r)) throw n;
    }
  } else t();
}
function Nc(t) {
  Pe.useDeprecatedSynchronousErrorHandling &&
    Rt &&
    ((Rt.errorThrown = !0), (Rt.error = t));
}
var Ft = class extends X {
    constructor(e) {
      super(),
        (this.isStopped = !1),
        e
          ? ((this.destination = e), Yr(e) && e.add(this))
          : (this.destination = wp);
    }
    static create(e, r, n) {
      return new un(e, r, n);
    }
    next(e) {
      this.isStopped ? Yo(Ac(e), this) : this._next(e);
    }
    error(e) {
      this.isStopped
        ? Yo(Tc(e), this)
        : ((this.isStopped = !0), this._error(e));
    }
    complete() {
      this.isStopped ? Yo(xc, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(e) {
      this.destination.next(e);
    }
    _error(e) {
      try {
        this.destination.error(e);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  Dp = Function.prototype.bind;
function Zo(t, e) {
  return Dp.call(t, e);
}
var Qo = class {
    constructor(e) {
      this.partialObserver = e;
    }
    next(e) {
      let { partialObserver: r } = this;
      if (r.next)
        try {
          r.next(e);
        } catch (n) {
          Kr(n);
        }
    }
    error(e) {
      let { partialObserver: r } = this;
      if (r.error)
        try {
          r.error(e);
        } catch (n) {
          Kr(n);
        }
      else Kr(e);
    }
    complete() {
      let { partialObserver: e } = this;
      if (e.complete)
        try {
          e.complete();
        } catch (r) {
          Kr(r);
        }
    }
  },
  un = class extends Ft {
    constructor(e, r, n) {
      super();
      let i;
      if (C(e) || !e)
        i = { next: e ?? void 0, error: r ?? void 0, complete: n ?? void 0 };
      else {
        let o;
        this && Pe.useDeprecatedNextContext
          ? ((o = Object.create(e)),
            (o.unsubscribe = () => this.unsubscribe()),
            (i = {
              next: e.next && Zo(e.next, o),
              error: e.error && Zo(e.error, o),
              complete: e.complete && Zo(e.complete, o),
            }))
          : (i = e);
      }
      this.destination = new Qo(i);
    }
  };
function Kr(t) {
  Pe.useDeprecatedSynchronousErrorHandling ? Nc(t) : Qr(t);
}
function Cp(t) {
  throw t;
}
function Yo(t, e) {
  let { onStoppedNotification: r } = Pe;
  r && sn.setTimeout(() => r(t, e));
}
var wp = { closed: !0, next: qn, error: Cp, complete: qn };
var cn = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function ve(t) {
  return t;
}
function Ko(...t) {
  return Jo(t);
}
function Jo(t) {
  return t.length === 0
    ? ve
    : t.length === 1
    ? t[0]
    : function (r) {
        return t.reduce((n, i) => i(n), r);
      };
}
var V = (() => {
  class t {
    constructor(r) {
      r && (this._subscribe = r);
    }
    lift(r) {
      let n = new t();
      return (n.source = this), (n.operator = r), n;
    }
    subscribe(r, n, i) {
      let o = Ip(r) ? r : new un(r, n, i);
      return (
        an(() => {
          let { operator: s, source: a } = this;
          o.add(
            s ? s.call(o, a) : a ? this._subscribe(o) : this._trySubscribe(o)
          );
        }),
        o
      );
    }
    _trySubscribe(r) {
      try {
        return this._subscribe(r);
      } catch (n) {
        r.error(n);
      }
    }
    forEach(r, n) {
      return (
        (n = Oc(n)),
        new n((i, o) => {
          let s = new un({
            next: (a) => {
              try {
                r(a);
              } catch (u) {
                o(u), s.unsubscribe();
              }
            },
            error: o,
            complete: i,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(r) {
      var n;
      return (n = this.source) === null || n === void 0
        ? void 0
        : n.subscribe(r);
    }
    [cn]() {
      return this;
    }
    pipe(...r) {
      return Jo(r)(this);
    }
    toPromise(r) {
      return (
        (r = Oc(r)),
        new r((n, i) => {
          let o;
          this.subscribe(
            (s) => (o = s),
            (s) => i(s),
            () => n(o)
          );
        })
      );
    }
  }
  return (t.create = (e) => new t(e)), t;
})();
function Oc(t) {
  var e;
  return (e = t ?? Pe.Promise) !== null && e !== void 0 ? e : Promise;
}
function _p(t) {
  return t && C(t.next) && C(t.error) && C(t.complete);
}
function Ip(t) {
  return (t && t instanceof Ft) || (_p(t) && Yr(t));
}
function Xo(t) {
  return C(t?.lift);
}
function k(t) {
  return (e) => {
    if (Xo(e))
      return e.lift(function (r) {
        try {
          return t(r, this);
        } catch (n) {
          this.error(n);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function O(t, e, r, n, i) {
  return new es(t, e, r, n, i);
}
var es = class extends Ft {
  constructor(e, r, n, i, o, s) {
    super(e),
      (this.onFinalize = o),
      (this.shouldUnsubscribe = s),
      (this._next = r
        ? function (a) {
            try {
              r(a);
            } catch (u) {
              e.error(u);
            }
          }
        : super._next),
      (this._error = i
        ? function (a) {
            try {
              i(a);
            } catch (u) {
              e.error(u);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = n
        ? function () {
            try {
              n();
            } catch (a) {
              e.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var e;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: r } = this;
      super.unsubscribe(),
        !r && ((e = this.onFinalize) === null || e === void 0 || e.call(this));
    }
  }
};
function ln() {
  return k((t, e) => {
    let r = null;
    t._refCount++;
    let n = O(e, void 0, void 0, void 0, () => {
      if (!t || t._refCount <= 0 || 0 < --t._refCount) {
        r = null;
        return;
      }
      let i = t._connection,
        o = r;
      (r = null), i && (!o || i === o) && i.unsubscribe(), e.unsubscribe();
    });
    t.subscribe(n), n.closed || (r = t.connect());
  });
}
var dn = class extends V {
  constructor(e, r) {
    super(),
      (this.source = e),
      (this.subjectFactory = r),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      Xo(e) && (this.lift = e.lift);
  }
  _subscribe(e) {
    return this.getSubject().subscribe(e);
  }
  getSubject() {
    let e = this._subject;
    return (
      (!e || e.isStopped) && (this._subject = this.subjectFactory()),
      this._subject
    );
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: e } = this;
    (this._subject = this._connection = null), e?.unsubscribe();
  }
  connect() {
    let e = this._connection;
    if (!e) {
      e = this._connection = new X();
      let r = this.getSubject();
      e.add(
        this.source.subscribe(
          O(
            r,
            void 0,
            () => {
              this._teardown(), r.complete();
            },
            (n) => {
              this._teardown(), r.error(n);
            },
            () => this._teardown()
          )
        )
      ),
        e.closed && ((this._connection = null), (e = X.EMPTY));
    }
    return e;
  }
  refCount() {
    return ln()(this);
  }
};
var Rc = on(
  (t) =>
    function () {
      t(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    }
);
var ye = (() => {
    class t extends V {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(r) {
        let n = new Jr(this, this);
        return (n.operator = r), n;
      }
      _throwIfClosed() {
        if (this.closed) throw new Rc();
      }
      next(r) {
        an(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let n of this.currentObservers) n.next(r);
          }
        });
      }
      error(r) {
        an(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = r);
            let { observers: n } = this;
            for (; n.length; ) n.shift().error(r);
          }
        });
      }
      complete() {
        an(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: r } = this;
            for (; r.length; ) r.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var r;
        return (
          ((r = this.observers) === null || r === void 0 ? void 0 : r.length) >
          0
        );
      }
      _trySubscribe(r) {
        return this._throwIfClosed(), super._trySubscribe(r);
      }
      _subscribe(r) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(r),
          this._innerSubscribe(r)
        );
      }
      _innerSubscribe(r) {
        let { hasError: n, isStopped: i, observers: o } = this;
        return n || i
          ? Wo
          : ((this.currentObservers = null),
            o.push(r),
            new X(() => {
              (this.currentObservers = null), Wn(o, r);
            }));
      }
      _checkFinalizedStatuses(r) {
        let { hasError: n, thrownError: i, isStopped: o } = this;
        n ? r.error(i) : o && r.complete();
      }
      asObservable() {
        let r = new V();
        return (r.source = this), r;
      }
    }
    return (t.create = (e, r) => new Jr(e, r)), t;
  })(),
  Jr = class extends ye {
    constructor(e, r) {
      super(), (this.destination = e), (this.source = r);
    }
    next(e) {
      var r, n;
      (n =
        (r = this.destination) === null || r === void 0 ? void 0 : r.next) ===
        null ||
        n === void 0 ||
        n.call(r, e);
    }
    error(e) {
      var r, n;
      (n =
        (r = this.destination) === null || r === void 0 ? void 0 : r.error) ===
        null ||
        n === void 0 ||
        n.call(r, e);
    }
    complete() {
      var e, r;
      (r =
        (e = this.destination) === null || e === void 0
          ? void 0
          : e.complete) === null ||
        r === void 0 ||
        r.call(e);
    }
    _subscribe(e) {
      var r, n;
      return (n =
        (r = this.source) === null || r === void 0
          ? void 0
          : r.subscribe(e)) !== null && n !== void 0
        ? n
        : Wo;
    }
  };
var re = class extends ye {
  constructor(e) {
    super(), (this._value = e);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(e) {
    let r = super._subscribe(e);
    return !r.closed && e.next(this._value), r;
  }
  getValue() {
    let { hasError: e, thrownError: r, _value: n } = this;
    if (e) throw r;
    return this._throwIfClosed(), n;
  }
  next(e) {
    super.next((this._value = e));
  }
};
var be = new V((t) => t.complete());
function Fc(t) {
  return t && C(t.schedule);
}
function Pc(t) {
  return t[t.length - 1];
}
function Xr(t) {
  return C(Pc(t)) ? t.pop() : void 0;
}
function gt(t) {
  return Fc(Pc(t)) ? t.pop() : void 0;
}
function Lc(t, e, r, n) {
  function i(o) {
    return o instanceof r
      ? o
      : new r(function (s) {
          s(o);
        });
  }
  return new (r || (r = Promise))(function (o, s) {
    function a(l) {
      try {
        c(n.next(l));
      } catch (d) {
        s(d);
      }
    }
    function u(l) {
      try {
        c(n.throw(l));
      } catch (d) {
        s(d);
      }
    }
    function c(l) {
      l.done ? o(l.value) : i(l.value).then(a, u);
    }
    c((n = n.apply(t, e || [])).next());
  });
}
function kc(t) {
  var e = typeof Symbol == "function" && Symbol.iterator,
    r = e && t[e],
    n = 0;
  if (r) return r.call(t);
  if (t && typeof t.length == "number")
    return {
      next: function () {
        return (
          t && n >= t.length && (t = void 0), { value: t && t[n++], done: !t }
        );
      },
    };
  throw new TypeError(
    e ? "Object is not iterable." : "Symbol.iterator is not defined."
  );
}
function Pt(t) {
  return this instanceof Pt ? ((this.v = t), this) : new Pt(t);
}
function Vc(t, e, r) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var n = r.apply(t, e || []),
    i,
    o = [];
  return (
    (i = {}),
    s("next"),
    s("throw"),
    s("return"),
    (i[Symbol.asyncIterator] = function () {
      return this;
    }),
    i
  );
  function s(f) {
    n[f] &&
      (i[f] = function (h) {
        return new Promise(function (p, x) {
          o.push([f, h, p, x]) > 1 || a(f, h);
        });
      });
  }
  function a(f, h) {
    try {
      u(n[f](h));
    } catch (p) {
      d(o[0][3], p);
    }
  }
  function u(f) {
    f.value instanceof Pt
      ? Promise.resolve(f.value.v).then(c, l)
      : d(o[0][2], f);
  }
  function c(f) {
    a("next", f);
  }
  function l(f) {
    a("throw", f);
  }
  function d(f, h) {
    f(h), o.shift(), o.length && a(o[0][0], o[0][1]);
  }
}
function jc(t) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var e = t[Symbol.asyncIterator],
    r;
  return e
    ? e.call(t)
    : ((t = typeof kc == "function" ? kc(t) : t[Symbol.iterator]()),
      (r = {}),
      n("next"),
      n("throw"),
      n("return"),
      (r[Symbol.asyncIterator] = function () {
        return this;
      }),
      r);
  function n(o) {
    r[o] =
      t[o] &&
      function (s) {
        return new Promise(function (a, u) {
          (s = t[o](s)), i(a, u, s.done, s.value);
        });
      };
  }
  function i(o, s, a, u) {
    Promise.resolve(u).then(function (c) {
      o({ value: c, done: a });
    }, s);
  }
}
var ei = (t) => t && typeof t.length == "number" && typeof t != "function";
function ti(t) {
  return C(t?.then);
}
function ni(t) {
  return C(t[cn]);
}
function ri(t) {
  return Symbol.asyncIterator && C(t?.[Symbol.asyncIterator]);
}
function ii(t) {
  return new TypeError(
    `You provided ${
      t !== null && typeof t == "object" ? "an invalid object" : `'${t}'`
    } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
function Ep() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var oi = Ep();
function si(t) {
  return C(t?.[oi]);
}
function ai(t) {
  return Vc(this, arguments, function* () {
    let r = t.getReader();
    try {
      for (;;) {
        let { value: n, done: i } = yield Pt(r.read());
        if (i) return yield Pt(void 0);
        yield yield Pt(n);
      }
    } finally {
      r.releaseLock();
    }
  });
}
function ui(t) {
  return C(t?.getReader);
}
function K(t) {
  if (t instanceof V) return t;
  if (t != null) {
    if (ni(t)) return bp(t);
    if (ei(t)) return Mp(t);
    if (ti(t)) return Sp(t);
    if (ri(t)) return $c(t);
    if (si(t)) return xp(t);
    if (ui(t)) return Tp(t);
  }
  throw ii(t);
}
function bp(t) {
  return new V((e) => {
    let r = t[cn]();
    if (C(r.subscribe)) return r.subscribe(e);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable"
    );
  });
}
function Mp(t) {
  return new V((e) => {
    for (let r = 0; r < t.length && !e.closed; r++) e.next(t[r]);
    e.complete();
  });
}
function Sp(t) {
  return new V((e) => {
    t.then(
      (r) => {
        e.closed || (e.next(r), e.complete());
      },
      (r) => e.error(r)
    ).then(null, Qr);
  });
}
function xp(t) {
  return new V((e) => {
    for (let r of t) if ((e.next(r), e.closed)) return;
    e.complete();
  });
}
function $c(t) {
  return new V((e) => {
    Ap(t, e).catch((r) => e.error(r));
  });
}
function Tp(t) {
  return $c(ai(t));
}
function Ap(t, e) {
  var r, n, i, o;
  return Lc(this, void 0, void 0, function* () {
    try {
      for (r = jc(t); (n = yield r.next()), !n.done; ) {
        let s = n.value;
        if ((e.next(s), e.closed)) return;
      }
    } catch (s) {
      i = { error: s };
    } finally {
      try {
        n && !n.done && (o = r.return) && (yield o.call(r));
      } finally {
        if (i) throw i.error;
      }
    }
    e.complete();
  });
}
function fe(t, e, r, n = 0, i = !1) {
  let o = e.schedule(function () {
    r(), i ? t.add(this.schedule(null, n)) : this.unsubscribe();
  }, n);
  if ((t.add(o), !i)) return o;
}
function ci(t, e = 0) {
  return k((r, n) => {
    r.subscribe(
      O(
        n,
        (i) => fe(n, t, () => n.next(i), e),
        () => fe(n, t, () => n.complete(), e),
        (i) => fe(n, t, () => n.error(i), e)
      )
    );
  });
}
function li(t, e = 0) {
  return k((r, n) => {
    n.add(t.schedule(() => r.subscribe(n), e));
  });
}
function Bc(t, e) {
  return K(t).pipe(li(e), ci(e));
}
function Uc(t, e) {
  return K(t).pipe(li(e), ci(e));
}
function Hc(t, e) {
  return new V((r) => {
    let n = 0;
    return e.schedule(function () {
      n === t.length
        ? r.complete()
        : (r.next(t[n++]), r.closed || this.schedule());
    });
  });
}
function Gc(t, e) {
  return new V((r) => {
    let n;
    return (
      fe(r, e, () => {
        (n = t[oi]()),
          fe(
            r,
            e,
            () => {
              let i, o;
              try {
                ({ value: i, done: o } = n.next());
              } catch (s) {
                r.error(s);
                return;
              }
              o ? r.complete() : r.next(i);
            },
            0,
            !0
          );
      }),
      () => C(n?.return) && n.return()
    );
  });
}
function di(t, e) {
  if (!t) throw new Error("Iterable cannot be null");
  return new V((r) => {
    fe(r, e, () => {
      let n = t[Symbol.asyncIterator]();
      fe(
        r,
        e,
        () => {
          n.next().then((i) => {
            i.done ? r.complete() : r.next(i.value);
          });
        },
        0,
        !0
      );
    });
  });
}
function zc(t, e) {
  return di(ai(t), e);
}
function Wc(t, e) {
  if (t != null) {
    if (ni(t)) return Bc(t, e);
    if (ei(t)) return Hc(t, e);
    if (ti(t)) return Uc(t, e);
    if (ri(t)) return di(t, e);
    if (si(t)) return Gc(t, e);
    if (ui(t)) return zc(t, e);
  }
  throw ii(t);
}
function Y(t, e) {
  return e ? Wc(t, e) : K(t);
}
function _(...t) {
  let e = gt(t);
  return Y(t, e);
}
function fn(t, e) {
  let r = C(t) ? t : () => t,
    n = (i) => i.error(r());
  return new V(e ? (i) => e.schedule(n, 0, i) : n);
}
function ts(t) {
  return !!t && (t instanceof V || (C(t.lift) && C(t.subscribe)));
}
var st = on(
  (t) =>
    function () {
      t(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence");
    }
);
function R(t, e) {
  return k((r, n) => {
    let i = 0;
    r.subscribe(
      O(n, (o) => {
        n.next(t.call(e, o, i++));
      })
    );
  });
}
var { isArray: Np } = Array;
function Op(t, e) {
  return Np(e) ? t(...e) : t(e);
}
function fi(t) {
  return R((e) => Op(t, e));
}
var { isArray: Rp } = Array,
  { getPrototypeOf: Fp, prototype: Pp, keys: kp } = Object;
function hi(t) {
  if (t.length === 1) {
    let e = t[0];
    if (Rp(e)) return { args: e, keys: null };
    if (Lp(e)) {
      let r = kp(e);
      return { args: r.map((n) => e[n]), keys: r };
    }
  }
  return { args: t, keys: null };
}
function Lp(t) {
  return t && typeof t == "object" && Fp(t) === Pp;
}
function pi(t, e) {
  return t.reduce((r, n, i) => ((r[n] = e[i]), r), {});
}
function gi(...t) {
  let e = gt(t),
    r = Xr(t),
    { args: n, keys: i } = hi(t);
  if (n.length === 0) return Y([], e);
  let o = new V(Vp(n, e, i ? (s) => pi(i, s) : ve));
  return r ? o.pipe(fi(r)) : o;
}
function Vp(t, e, r = ve) {
  return (n) => {
    qc(
      e,
      () => {
        let { length: i } = t,
          o = new Array(i),
          s = i,
          a = i;
        for (let u = 0; u < i; u++)
          qc(
            e,
            () => {
              let c = Y(t[u], e),
                l = !1;
              c.subscribe(
                O(
                  n,
                  (d) => {
                    (o[u] = d), l || ((l = !0), a--), a || n.next(r(o.slice()));
                  },
                  () => {
                    --s || n.complete();
                  }
                )
              );
            },
            n
          );
      },
      n
    );
  };
}
function qc(t, e, r) {
  t ? fe(r, t, e) : e();
}
function Zc(t, e, r, n, i, o, s, a) {
  let u = [],
    c = 0,
    l = 0,
    d = !1,
    f = () => {
      d && !u.length && !c && e.complete();
    },
    h = (x) => (c < n ? p(x) : u.push(x)),
    p = (x) => {
      o && e.next(x), c++;
      let B = !1;
      K(r(x, l++)).subscribe(
        O(
          e,
          (P) => {
            i?.(P), o ? h(P) : e.next(P);
          },
          () => {
            B = !0;
          },
          void 0,
          () => {
            if (B)
              try {
                for (c--; u.length && c < n; ) {
                  let P = u.shift();
                  s ? fe(e, s, () => p(P)) : p(P);
                }
                f();
              } catch (P) {
                e.error(P);
              }
          }
        )
      );
    };
  return (
    t.subscribe(
      O(e, h, () => {
        (d = !0), f();
      })
    ),
    () => {
      a?.();
    }
  );
}
function ee(t, e, r = 1 / 0) {
  return C(e)
    ? ee((n, i) => R((o, s) => e(n, o, i, s))(K(t(n, i))), r)
    : (typeof e == "number" && (r = e), k((n, i) => Zc(n, i, t, r)));
}
function ns(t = 1 / 0) {
  return ee(ve, t);
}
function Yc() {
  return ns(1);
}
function hn(...t) {
  return Yc()(Y(t, gt(t)));
}
function mi(t) {
  return new V((e) => {
    K(t()).subscribe(e);
  });
}
function rs(...t) {
  let e = Xr(t),
    { args: r, keys: n } = hi(t),
    i = new V((o) => {
      let { length: s } = r;
      if (!s) {
        o.complete();
        return;
      }
      let a = new Array(s),
        u = s,
        c = s;
      for (let l = 0; l < s; l++) {
        let d = !1;
        K(r[l]).subscribe(
          O(
            o,
            (f) => {
              d || ((d = !0), c--), (a[l] = f);
            },
            () => u--,
            void 0,
            () => {
              (!u || !d) && (c || o.next(n ? pi(n, a) : a), o.complete());
            }
          )
        );
      }
    });
  return e ? i.pipe(fi(e)) : i;
}
function ke(t, e) {
  return k((r, n) => {
    let i = 0;
    r.subscribe(O(n, (o) => t.call(e, o, i++) && n.next(o)));
  });
}
function mt(t) {
  return k((e, r) => {
    let n = null,
      i = !1,
      o;
    (n = e.subscribe(
      O(r, void 0, void 0, (s) => {
        (o = K(t(s, mt(t)(e)))),
          n ? (n.unsubscribe(), (n = null), o.subscribe(r)) : (i = !0);
      })
    )),
      i && (n.unsubscribe(), (n = null), o.subscribe(r));
  });
}
function Qc(t, e, r, n, i) {
  return (o, s) => {
    let a = r,
      u = e,
      c = 0;
    o.subscribe(
      O(
        s,
        (l) => {
          let d = c++;
          (u = a ? t(u, l, d) : ((a = !0), l)), n && s.next(u);
        },
        i &&
          (() => {
            a && s.next(u), s.complete();
          })
      )
    );
  };
}
function pn(t, e) {
  return C(e) ? ee(t, e, 1) : ee(t, 1);
}
function vt(t) {
  return k((e, r) => {
    let n = !1;
    e.subscribe(
      O(
        r,
        (i) => {
          (n = !0), r.next(i);
        },
        () => {
          n || r.next(t), r.complete();
        }
      )
    );
  });
}
function at(t) {
  return t <= 0
    ? () => be
    : k((e, r) => {
        let n = 0;
        e.subscribe(
          O(r, (i) => {
            ++n <= t && (r.next(i), t <= n && r.complete());
          })
        );
      });
}
function is(t) {
  return R(() => t);
}
function vi(t = jp) {
  return k((e, r) => {
    let n = !1;
    e.subscribe(
      O(
        r,
        (i) => {
          (n = !0), r.next(i);
        },
        () => (n ? r.complete() : r.error(t()))
      )
    );
  });
}
function jp() {
  return new st();
}
function Zn(t) {
  return k((e, r) => {
    try {
      e.subscribe(r);
    } finally {
      r.add(t);
    }
  });
}
function Ze(t, e) {
  let r = arguments.length >= 2;
  return (n) =>
    n.pipe(
      t ? ke((i, o) => t(i, o, n)) : ve,
      at(1),
      r ? vt(e) : vi(() => new st())
    );
}
function gn(t) {
  return t <= 0
    ? () => be
    : k((e, r) => {
        let n = [];
        e.subscribe(
          O(
            r,
            (i) => {
              n.push(i), t < n.length && n.shift();
            },
            () => {
              for (let i of n) r.next(i);
              r.complete();
            },
            void 0,
            () => {
              n = null;
            }
          )
        );
      });
}
function os(t, e) {
  let r = arguments.length >= 2;
  return (n) =>
    n.pipe(
      t ? ke((i, o) => t(i, o, n)) : ve,
      gn(1),
      r ? vt(e) : vi(() => new st())
    );
}
function ss(t, e) {
  return k(Qc(t, e, arguments.length >= 2, !0));
}
function as(...t) {
  let e = gt(t);
  return k((r, n) => {
    (e ? hn(t, r, e) : hn(t, r)).subscribe(n);
  });
}
function Le(t, e) {
  return k((r, n) => {
    let i = null,
      o = 0,
      s = !1,
      a = () => s && !i && n.complete();
    r.subscribe(
      O(
        n,
        (u) => {
          i?.unsubscribe();
          let c = 0,
            l = o++;
          K(t(u, l)).subscribe(
            (i = O(
              n,
              (d) => n.next(e ? e(u, d, l, c++) : d),
              () => {
                (i = null), a();
              }
            ))
          );
        },
        () => {
          (s = !0), a();
        }
      )
    );
  });
}
function us(t) {
  return k((e, r) => {
    K(t).subscribe(O(r, () => r.complete(), qn)), !r.closed && e.subscribe(r);
  });
}
function te(t, e, r) {
  let n = C(t) || e || r ? { next: t, error: e, complete: r } : t;
  return n
    ? k((i, o) => {
        var s;
        (s = n.subscribe) === null || s === void 0 || s.call(n);
        let a = !0;
        i.subscribe(
          O(
            o,
            (u) => {
              var c;
              (c = n.next) === null || c === void 0 || c.call(n, u), o.next(u);
            },
            () => {
              var u;
              (a = !1),
                (u = n.complete) === null || u === void 0 || u.call(n),
                o.complete();
            },
            (u) => {
              var c;
              (a = !1),
                (c = n.error) === null || c === void 0 || c.call(n, u),
                o.error(u);
            },
            () => {
              var u, c;
              a && ((u = n.unsubscribe) === null || u === void 0 || u.call(n)),
                (c = n.finalize) === null || c === void 0 || c.call(n);
            }
          )
        );
      })
    : ve;
}
var $p = "https://g.co/ng/security#xss",
  y = class extends Error {
    constructor(e, r) {
      super(_a(e, r)), (this.code = e);
    }
  };
function _a(t, e) {
  return `${`NG0${Math.abs(t)}`}${e ? ": " + e : ""}`;
}
function H(t) {
  for (let e in t) if (t[e] === H) return e;
  throw Error("Could not find renamed property on target object.");
}
function Bp(t, e) {
  for (let r in e) e.hasOwnProperty(r) && !t.hasOwnProperty(r) && (t[r] = e[r]);
}
function he(t) {
  if (typeof t == "string") return t;
  if (Array.isArray(t)) return "[" + t.map(he).join(", ") + "]";
  if (t == null) return "" + t;
  if (t.overriddenName) return `${t.overriddenName}`;
  if (t.name) return `${t.name}`;
  let e = t.toString();
  if (e == null) return "" + e;
  let r = e.indexOf(`
`);
  return r === -1 ? e : e.substring(0, r);
}
function Kc(t, e) {
  return t == null || t === ""
    ? e === null
      ? ""
      : e
    : e == null || e === ""
    ? t
    : t + " " + e;
}
var Up = H({ __forward_ref__: H });
function pr(t) {
  return (
    (t.__forward_ref__ = pr),
    (t.toString = function () {
      return he(this());
    }),
    t
  );
}
function ce(t) {
  return Fl(t) ? t() : t;
}
function Fl(t) {
  return (
    typeof t == "function" && t.hasOwnProperty(Up) && t.__forward_ref__ === pr
  );
}
function Pl(t) {
  return t && !!t.ɵproviders;
}
var Hp = H({ ɵcmp: H }),
  Gp = H({ ɵdir: H }),
  zp = H({ ɵpipe: H }),
  Wp = H({ ɵmod: H }),
  Si = H({ ɵfac: H }),
  Yn = H({ __NG_ELEMENT_ID__: H }),
  Jc = H({ __NG_ENV_ID__: H });
function kl(t) {
  return typeof t == "string" ? t : t == null ? "" : String(t);
}
function qp(t) {
  return typeof t == "function"
    ? t.name || t.toString()
    : typeof t == "object" && t != null && typeof t.type == "function"
    ? t.type.name || t.type.toString()
    : kl(t);
}
function Zp(t, e) {
  let r = e ? `. Dependency path: ${e.join(" > ")} > ${t}` : "";
  throw new y(-200, `Circular dependency in DI detected for ${t}${r}`);
}
function Ia(t, e) {
  throw new y(-201, !1);
}
function Yp(t, e) {
  t == null && Qp(e, t, null, "!=");
}
function Qp(t, e, r, n) {
  throw new Error(
    `ASSERTION ERROR: ${t}` +
      (n == null ? "" : ` [Expected=> ${r} ${n} ${e} <=Actual]`)
  );
}
function w(t) {
  return {
    token: t.token,
    providedIn: t.providedIn || null,
    factory: t.factory,
    value: void 0,
  };
}
function It(t) {
  return { providers: t.providers || [], imports: t.imports || [] };
}
function zi(t) {
  return Xc(t, Vl) || Xc(t, jl);
}
function Ll(t) {
  return zi(t) !== null;
}
function Xc(t, e) {
  return t.hasOwnProperty(e) ? t[e] : null;
}
function Kp(t) {
  let e = t && (t[Vl] || t[jl]);
  return e || null;
}
function el(t) {
  return t && (t.hasOwnProperty(tl) || t.hasOwnProperty(Jp)) ? t[tl] : null;
}
var Vl = H({ ɵprov: H }),
  tl = H({ ɵinj: H }),
  jl = H({ ngInjectableDef: H }),
  Jp = H({ ngInjectorDef: H }),
  T = (function (t) {
    return (
      (t[(t.Default = 0)] = "Default"),
      (t[(t.Host = 1)] = "Host"),
      (t[(t.Self = 2)] = "Self"),
      (t[(t.SkipSelf = 4)] = "SkipSelf"),
      (t[(t.Optional = 8)] = "Optional"),
      t
    );
  })(T || {}),
  bs;
function Xp() {
  return bs;
}
function Me(t) {
  let e = bs;
  return (bs = t), e;
}
function $l(t, e, r) {
  let n = zi(t);
  if (n && n.providedIn == "root")
    return n.value === void 0 ? (n.value = n.factory()) : n.value;
  if (r & T.Optional) return null;
  if (e !== void 0) return e;
  Ia(t, "Injector");
}
var Qn = globalThis;
var S = class {
  constructor(e, r) {
    (this._desc = e),
      (this.ngMetadataName = "InjectionToken"),
      (this.ɵprov = void 0),
      typeof r == "number"
        ? (this.__NG_ELEMENT_ID__ = r)
        : r !== void 0 &&
          (this.ɵprov = w({
            token: this,
            providedIn: r.providedIn || "root",
            factory: r.factory,
          }));
  }
  get multi() {
    return this;
  }
  toString() {
    return `InjectionToken ${this._desc}`;
  }
};
var eg = {},
  Xn = eg,
  Ms = "__NG_DI_FLAG__",
  xi = "ngTempTokenPath",
  tg = "ngTokenPath",
  ng = /\n/gm,
  rg = "\u0275",
  nl = "__source",
  Kn;
function yt(t) {
  let e = Kn;
  return (Kn = t), e;
}
function ig(t, e = T.Default) {
  if (Kn === void 0) throw new y(-203, !1);
  return Kn === null
    ? $l(t, void 0, e)
    : Kn.get(t, e & T.Optional ? null : void 0, e);
}
function F(t, e = T.Default) {
  return (Xp() || ig)(ce(t), e);
}
function m(t, e = T.Default) {
  return F(t, Wi(e));
}
function Wi(t) {
  return typeof t > "u" || typeof t == "number"
    ? t
    : 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4);
}
function Ss(t) {
  let e = [];
  for (let r = 0; r < t.length; r++) {
    let n = ce(t[r]);
    if (Array.isArray(n)) {
      if (n.length === 0) throw new y(900, !1);
      let i,
        o = T.Default;
      for (let s = 0; s < n.length; s++) {
        let a = n[s],
          u = og(a);
        typeof u == "number" ? (u === -1 ? (i = a.token) : (o |= u)) : (i = a);
      }
      e.push(F(i, o));
    } else e.push(F(n));
  }
  return e;
}
function Bl(t, e) {
  return (t[Ms] = e), (t.prototype[Ms] = e), t;
}
function og(t) {
  return t[Ms];
}
function sg(t, e, r, n) {
  let i = t[xi];
  throw (
    (e[nl] && i.unshift(e[nl]),
    (t.message = ag(
      `
` + t.message,
      i,
      r,
      n
    )),
    (t[tg] = i),
    (t[xi] = null),
    t)
  );
}
function ag(t, e, r, n = null) {
  t =
    t &&
    t.charAt(0) ===
      `
` &&
    t.charAt(1) == rg
      ? t.slice(2)
      : t;
  let i = he(e);
  if (Array.isArray(e)) i = e.map(he).join(" -> ");
  else if (typeof e == "object") {
    let o = [];
    for (let s in e)
      if (e.hasOwnProperty(s)) {
        let a = e[s];
        o.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : he(a)));
      }
    i = `{${o.join(", ")}}`;
  }
  return `${r}${n ? "(" + n + ")" : ""}[${i}]: ${t.replace(
    ng,
    `
  `
  )}`;
}
function gr(t) {
  return { toString: t }.toString();
}
var Ul = (function (t) {
    return (t[(t.OnPush = 0)] = "OnPush"), (t[(t.Default = 1)] = "Default"), t;
  })(Ul || {}),
  Je = (function (t) {
    return (
      (t[(t.Emulated = 0)] = "Emulated"),
      (t[(t.None = 2)] = "None"),
      (t[(t.ShadowDom = 3)] = "ShadowDom"),
      t
    );
  })(Je || {}),
  Cn = {},
  Se = [],
  De = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.SignalBased = 1)] = "SignalBased"),
      (t[(t.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
      t
    );
  })(De || {});
function Hl(t, e, r) {
  let n = t.length;
  for (;;) {
    let i = t.indexOf(e, r);
    if (i === -1) return i;
    if (i === 0 || t.charCodeAt(i - 1) <= 32) {
      let o = e.length;
      if (i + o === n || t.charCodeAt(i + o) <= 32) return i;
    }
    r = i + 1;
  }
}
function xs(t, e, r) {
  let n = 0;
  for (; n < r.length; ) {
    let i = r[n];
    if (typeof i == "number") {
      if (i !== 0) break;
      n++;
      let o = r[n++],
        s = r[n++],
        a = r[n++];
      t.setAttribute(e, s, a, o);
    } else {
      let o = i,
        s = r[++n];
      cg(o) ? t.setProperty(e, o, s) : t.setAttribute(e, o, s), n++;
    }
  }
  return n;
}
function ug(t) {
  return t === 3 || t === 4 || t === 6;
}
function cg(t) {
  return t.charCodeAt(0) === 64;
}
function er(t, e) {
  if (!(e === null || e.length === 0))
    if (t === null || t.length === 0) t = e.slice();
    else {
      let r = -1;
      for (let n = 0; n < e.length; n++) {
        let i = e[n];
        typeof i == "number"
          ? (r = i)
          : r === 0 ||
            (r === -1 || r === 2
              ? rl(t, r, i, null, e[++n])
              : rl(t, r, i, null, null));
      }
    }
  return t;
}
function rl(t, e, r, n, i) {
  let o = 0,
    s = t.length;
  if (e === -1) s = -1;
  else
    for (; o < t.length; ) {
      let a = t[o++];
      if (typeof a == "number") {
        if (a === e) {
          s = -1;
          break;
        } else if (a > e) {
          s = o - 1;
          break;
        }
      }
    }
  for (; o < t.length; ) {
    let a = t[o];
    if (typeof a == "number") break;
    if (a === r) {
      if (n === null) {
        i !== null && (t[o + 1] = i);
        return;
      } else if (n === t[o + 1]) {
        t[o + 2] = i;
        return;
      }
    }
    o++, n !== null && o++, i !== null && o++;
  }
  s !== -1 && (t.splice(s, 0, e), (o = s + 1)),
    t.splice(o++, 0, r),
    n !== null && t.splice(o++, 0, n),
    i !== null && t.splice(o++, 0, i);
}
var Gl = "ng-template";
function lg(t, e, r) {
  let n = 0,
    i = !0;
  for (; n < t.length; ) {
    let o = t[n++];
    if (typeof o == "string" && i) {
      let s = t[n++];
      if (r && o === "class" && Hl(s.toLowerCase(), e, 0) !== -1) return !0;
    } else if (o === 1) {
      for (; n < t.length && typeof (o = t[n++]) == "string"; )
        if (o.toLowerCase() === e) return !0;
      return !1;
    } else typeof o == "number" && (i = !1);
  }
  return !1;
}
function zl(t) {
  return t.type === 4 && t.value !== Gl;
}
function dg(t, e, r) {
  let n = t.type === 4 && !r ? Gl : t.value;
  return e === n;
}
function fg(t, e, r) {
  let n = 4,
    i = t.attrs || [],
    o = gg(i),
    s = !1;
  for (let a = 0; a < e.length; a++) {
    let u = e[a];
    if (typeof u == "number") {
      if (!s && !Ve(n) && !Ve(u)) return !1;
      if (s && Ve(u)) continue;
      (s = !1), (n = u | (n & 1));
      continue;
    }
    if (!s)
      if (n & 4) {
        if (
          ((n = 2 | (n & 1)),
          (u !== "" && !dg(t, u, r)) || (u === "" && e.length === 1))
        ) {
          if (Ve(n)) return !1;
          s = !0;
        }
      } else {
        let c = n & 8 ? u : e[++a];
        if (n & 8 && t.attrs !== null) {
          if (!lg(t.attrs, c, r)) {
            if (Ve(n)) return !1;
            s = !0;
          }
          continue;
        }
        let l = n & 8 ? "class" : u,
          d = hg(l, i, zl(t), r);
        if (d === -1) {
          if (Ve(n)) return !1;
          s = !0;
          continue;
        }
        if (c !== "") {
          let f;
          d > o ? (f = "") : (f = i[d + 1].toLowerCase());
          let h = n & 8 ? f : null;
          if ((h && Hl(h, c, 0) !== -1) || (n & 2 && c !== f)) {
            if (Ve(n)) return !1;
            s = !0;
          }
        }
      }
  }
  return Ve(n) || s;
}
function Ve(t) {
  return (t & 1) === 0;
}
function hg(t, e, r, n) {
  if (e === null) return -1;
  let i = 0;
  if (n || !r) {
    let o = !1;
    for (; i < e.length; ) {
      let s = e[i];
      if (s === t) return i;
      if (s === 3 || s === 6) o = !0;
      else if (s === 1 || s === 2) {
        let a = e[++i];
        for (; typeof a == "string"; ) a = e[++i];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          i += 4;
          continue;
        }
      }
      i += o ? 1 : 2;
    }
    return -1;
  } else return mg(e, t);
}
function pg(t, e, r = !1) {
  for (let n = 0; n < e.length; n++) if (fg(t, e[n], r)) return !0;
  return !1;
}
function gg(t) {
  for (let e = 0; e < t.length; e++) {
    let r = t[e];
    if (ug(r)) return e;
  }
  return t.length;
}
function mg(t, e) {
  let r = t.indexOf(4);
  if (r > -1)
    for (r++; r < t.length; ) {
      let n = t[r];
      if (typeof n == "number") return -1;
      if (n === e) return r;
      r++;
    }
  return -1;
}
function il(t, e) {
  return t ? ":not(" + e.trim() + ")" : e;
}
function vg(t) {
  let e = t[0],
    r = 1,
    n = 2,
    i = "",
    o = !1;
  for (; r < t.length; ) {
    let s = t[r];
    if (typeof s == "string")
      if (n & 2) {
        let a = t[++r];
        i += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else n & 8 ? (i += "." + s) : n & 4 && (i += " " + s);
    else
      i !== "" && !Ve(s) && ((e += il(o, i)), (i = "")),
        (n = s),
        (o = o || !Ve(n));
    r++;
  }
  return i !== "" && (e += il(o, i)), e;
}
function yg(t) {
  return t.map(vg).join(",");
}
function Dg(t) {
  let e = [],
    r = [],
    n = 1,
    i = 2;
  for (; n < t.length; ) {
    let o = t[n];
    if (typeof o == "string")
      i === 2 ? o !== "" && e.push(o, t[++n]) : i === 8 && r.push(o);
    else {
      if (!Ve(i)) break;
      i = o;
    }
    n++;
  }
  return { attrs: e, classes: r };
}
function Te(t) {
  return gr(() => {
    let e = Ql(t),
      r = z(g({}, e), {
        decls: t.decls,
        vars: t.vars,
        template: t.template,
        consts: t.consts || null,
        ngContentSelectors: t.ngContentSelectors,
        onPush: t.changeDetection === Ul.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (e.standalone && t.dependencies) || null,
        getStandaloneInjector: null,
        signals: t.signals ?? !1,
        data: t.data || {},
        encapsulation: t.encapsulation || Je.Emulated,
        styles: t.styles || Se,
        _: null,
        schemas: t.schemas || null,
        tView: null,
        id: "",
      });
    Kl(r);
    let n = t.dependencies;
    return (
      (r.directiveDefs = sl(n, !1)), (r.pipeDefs = sl(n, !0)), (r.id = _g(r)), r
    );
  });
}
function Cg(t) {
  return Vt(t) || Wl(t);
}
function wg(t) {
  return t !== null;
}
function Et(t) {
  return gr(() => ({
    type: t.type,
    bootstrap: t.bootstrap || Se,
    declarations: t.declarations || Se,
    imports: t.imports || Se,
    exports: t.exports || Se,
    transitiveCompileScopes: null,
    schemas: t.schemas || null,
    id: t.id || null,
  }));
}
function ol(t, e) {
  if (t == null) return Cn;
  let r = {};
  for (let n in t)
    if (t.hasOwnProperty(n)) {
      let i = t[n],
        o,
        s,
        a = De.None;
      Array.isArray(i)
        ? ((a = i[0]), (o = i[1]), (s = i[2] ?? o))
        : ((o = i), (s = i)),
        e ? ((r[o] = a !== De.None ? [n, a] : n), (e[o] = s)) : (r[o] = n);
    }
  return r;
}
function le(t) {
  return gr(() => {
    let e = Ql(t);
    return Kl(e), e;
  });
}
function Vt(t) {
  return t[Hp] || null;
}
function Wl(t) {
  return t[Gp] || null;
}
function ql(t) {
  return t[zp] || null;
}
function Zl(t) {
  let e = Vt(t) || Wl(t) || ql(t);
  return e !== null ? e.standalone : !1;
}
function Yl(t, e) {
  let r = t[Wp] || null;
  if (!r && e === !0)
    throw new Error(`Type ${he(t)} does not have '\u0275mod' property.`);
  return r;
}
function Ql(t) {
  let e = {};
  return {
    type: t.type,
    providersResolver: null,
    factory: null,
    hostBindings: t.hostBindings || null,
    hostVars: t.hostVars || 0,
    hostAttrs: t.hostAttrs || null,
    contentQueries: t.contentQueries || null,
    declaredInputs: e,
    inputTransforms: null,
    inputConfig: t.inputs || Cn,
    exportAs: t.exportAs || null,
    standalone: t.standalone === !0,
    signals: t.signals === !0,
    selectors: t.selectors || Se,
    viewQuery: t.viewQuery || null,
    features: t.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: ol(t.inputs, e),
    outputs: ol(t.outputs),
    debugInfo: null,
  };
}
function Kl(t) {
  t.features?.forEach((e) => e(t));
}
function sl(t, e) {
  if (!t) return null;
  let r = e ? ql : Cg;
  return () => (typeof t == "function" ? t() : t).map((n) => r(n)).filter(wg);
}
function _g(t) {
  let e = 0,
    r = [
      t.selectors,
      t.ngContentSelectors,
      t.hostVars,
      t.hostAttrs,
      t.consts,
      t.vars,
      t.decls,
      t.encapsulation,
      t.standalone,
      t.signals,
      t.exportAs,
      JSON.stringify(t.inputs),
      JSON.stringify(t.outputs),
      Object.getOwnPropertyNames(t.type.prototype),
      !!t.contentQueries,
      !!t.viewQuery,
    ].join("|");
  for (let i of r) e = (Math.imul(31, e) + i.charCodeAt(0)) << 0;
  return (e += 2147483648), "c" + e;
}
var lt = 0,
  I = 1,
  D = 2,
  ie = 3,
  je = 4,
  Be = 5,
  tr = 6,
  nr = 7,
  ae = 8,
  wn = 9,
  Dt = 10,
  oe = 11,
  rr = 12,
  al = 13,
  xn = 14,
  $e = 15,
  mr = 16,
  mn = 17,
  Ke = 18,
  qi = 19,
  Jl = 20,
  Jn = 21,
  cs = 22,
  jt = 23,
  Ce = 25,
  Xl = 1;
var $t = 7,
  Ti = 8,
  _n = 9,
  ue = 10,
  Ea = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.HasTransplantedViews = 2)] = "HasTransplantedViews"),
      t
    );
  })(Ea || {});
function kt(t) {
  return Array.isArray(t) && typeof t[Xl] == "object";
}
function dt(t) {
  return Array.isArray(t) && t[Xl] === !0;
}
function ba(t) {
  return (t.flags & 4) !== 0;
}
function Zi(t) {
  return t.componentOffset > -1;
}
function Yi(t) {
  return (t.flags & 1) === 1;
}
function Ct(t) {
  return !!t.template;
}
function Ig(t) {
  return (t[D] & 512) !== 0;
}
function In(t, e) {
  let r = t.hasOwnProperty(Si);
  return r ? t[Si] : null;
}
var Ts = class {
  constructor(e, r, n) {
    (this.previousValue = e), (this.currentValue = r), (this.firstChange = n);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function ed(t, e, r, n) {
  e !== null ? e.applyValueToInputSignal(e, n) : (t[r] = n);
}
function Tn() {
  return td;
}
function td(t) {
  return t.type.prototype.ngOnChanges && (t.setInput = bg), Eg;
}
Tn.ngInherit = !0;
function Eg() {
  let t = rd(this),
    e = t?.current;
  if (e) {
    let r = t.previous;
    if (r === Cn) t.previous = e;
    else for (let n in e) r[n] = e[n];
    (t.current = null), this.ngOnChanges(e);
  }
}
function bg(t, e, r, n, i) {
  let o = this.declaredInputs[n],
    s = rd(t) || Mg(t, { previous: Cn, current: null }),
    a = s.current || (s.current = {}),
    u = s.previous,
    c = u[o];
  (a[o] = new Ts(c && c.currentValue, r, u === Cn)), ed(t, e, i, r);
}
var nd = "__ngSimpleChanges__";
function rd(t) {
  return t[nd] || null;
}
function Mg(t, e) {
  return (t[nd] = e);
}
var ul = null;
var Ye = function (t, e, r) {
    ul?.(t, e, r);
  },
  Sg = "svg",
  xg = "math",
  Tg = !1;
function Ag() {
  return Tg;
}
function Xe(t) {
  for (; Array.isArray(t); ) t = t[lt];
  return t;
}
function id(t, e) {
  return Xe(e[t]);
}
function Ue(t, e) {
  return Xe(e[t.index]);
}
function Ma(t, e) {
  return t.data[e];
}
function Ng(t, e) {
  return t[e];
}
function bt(t, e) {
  let r = e[t];
  return kt(r) ? r : r[lt];
}
function Og(t) {
  return (t[D] & 4) === 4;
}
function Sa(t) {
  return (t[D] & 128) === 128;
}
function Rg(t) {
  return dt(t[ie]);
}
function En(t, e) {
  return e == null ? null : t[e];
}
function od(t) {
  t[mn] = 0;
}
function Fg(t) {
  t[D] & 1024 || ((t[D] |= 1024), Sa(t) && ir(t));
}
function Pg(t, e) {
  for (; t > 0; ) (e = e[xn]), t--;
  return e;
}
function sd(t) {
  return t[D] & 9216 || t[jt]?.dirty;
}
function As(t) {
  sd(t)
    ? ir(t)
    : t[D] & 64 &&
      (Ag()
        ? ((t[D] |= 1024), ir(t))
        : t[Dt].changeDetectionScheduler?.notify());
}
function ir(t) {
  t[Dt].changeDetectionScheduler?.notify();
  let e = or(t);
  for (; e !== null && !(e[D] & 8192 || ((e[D] |= 8192), !Sa(e))); ) e = or(e);
}
function kg(t, e) {
  if ((t[D] & 256) === 256) throw new y(911, !1);
  t[Jn] === null && (t[Jn] = []), t[Jn].push(e);
}
function or(t) {
  let e = t[ie];
  return dt(e) ? e[ie] : e;
}
var A = { lFrame: hd(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
function Lg() {
  return A.lFrame.elementDepthCount;
}
function Vg() {
  A.lFrame.elementDepthCount++;
}
function jg() {
  A.lFrame.elementDepthCount--;
}
function ad() {
  return A.bindingsEnabled;
}
function $g() {
  return A.skipHydrationRootTNode !== null;
}
function Bg(t) {
  return A.skipHydrationRootTNode === t;
}
function Ug() {
  A.skipHydrationRootTNode = null;
}
function G() {
  return A.lFrame.lView;
}
function ge() {
  return A.lFrame.tView;
}
function E(t) {
  return (A.lFrame.contextLView = t), t[ae];
}
function b(t) {
  return (A.lFrame.contextLView = null), t;
}
function we() {
  let t = ud();
  for (; t !== null && t.type === 64; ) t = t.parent;
  return t;
}
function ud() {
  return A.lFrame.currentTNode;
}
function Hg() {
  let t = A.lFrame,
    e = t.currentTNode;
  return t.isParent ? e : e.parent;
}
function qt(t, e) {
  let r = A.lFrame;
  (r.currentTNode = t), (r.isParent = e);
}
function xa() {
  return A.lFrame.isParent;
}
function cd() {
  A.lFrame.isParent = !1;
}
function Gg() {
  return A.lFrame.contextLView;
}
function zg(t) {
  return (A.lFrame.bindingIndex = t);
}
function Qi() {
  return A.lFrame.bindingIndex++;
}
function Wg(t) {
  let e = A.lFrame,
    r = e.bindingIndex;
  return (e.bindingIndex = e.bindingIndex + t), r;
}
function qg() {
  return A.lFrame.inI18n;
}
function Zg(t, e) {
  let r = A.lFrame;
  (r.bindingIndex = r.bindingRootIndex = t), Ns(e);
}
function Yg() {
  return A.lFrame.currentDirectiveIndex;
}
function Ns(t) {
  A.lFrame.currentDirectiveIndex = t;
}
function Qg(t) {
  let e = A.lFrame.currentDirectiveIndex;
  return e === -1 ? null : t[e];
}
function ld() {
  return A.lFrame.currentQueryIndex;
}
function Ta(t) {
  A.lFrame.currentQueryIndex = t;
}
function Kg(t) {
  let e = t[I];
  return e.type === 2 ? e.declTNode : e.type === 1 ? t[Be] : null;
}
function dd(t, e, r) {
  if (r & T.SkipSelf) {
    let i = e,
      o = t;
    for (; (i = i.parent), i === null && !(r & T.Host); )
      if (((i = Kg(o)), i === null || ((o = o[xn]), i.type & 10))) break;
    if (i === null) return !1;
    (e = i), (t = o);
  }
  let n = (A.lFrame = fd());
  return (n.currentTNode = e), (n.lView = t), !0;
}
function Aa(t) {
  let e = fd(),
    r = t[I];
  (A.lFrame = e),
    (e.currentTNode = r.firstChild),
    (e.lView = t),
    (e.tView = r),
    (e.contextLView = t),
    (e.bindingIndex = r.bindingStartIndex),
    (e.inI18n = !1);
}
function fd() {
  let t = A.lFrame,
    e = t === null ? null : t.child;
  return e === null ? hd(t) : e;
}
function hd(t) {
  let e = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: t,
    child: null,
    inI18n: !1,
  };
  return t !== null && (t.child = e), e;
}
function pd() {
  let t = A.lFrame;
  return (A.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t;
}
var gd = pd;
function Na() {
  let t = pd();
  (t.isParent = !0),
    (t.tView = null),
    (t.selectedIndex = -1),
    (t.contextLView = null),
    (t.elementDepthCount = 0),
    (t.currentDirectiveIndex = -1),
    (t.currentNamespace = null),
    (t.bindingRootIndex = -1),
    (t.bindingIndex = -1),
    (t.currentQueryIndex = 0);
}
function Jg(t) {
  return (A.lFrame.contextLView = Pg(t, A.lFrame.contextLView))[ae];
}
function Zt() {
  return A.lFrame.selectedIndex;
}
function Bt(t) {
  A.lFrame.selectedIndex = t;
}
function Xg() {
  let t = A.lFrame;
  return Ma(t.tView, t.selectedIndex);
}
function em() {
  return A.lFrame.currentNamespace;
}
var md = !0;
function Ki() {
  return md;
}
function Ji(t) {
  md = t;
}
function tm(t, e, r) {
  let { ngOnChanges: n, ngOnInit: i, ngDoCheck: o } = e.type.prototype;
  if (n) {
    let s = td(e);
    (r.preOrderHooks ??= []).push(t, s),
      (r.preOrderCheckHooks ??= []).push(t, s);
  }
  i && (r.preOrderHooks ??= []).push(0 - t, i),
    o &&
      ((r.preOrderHooks ??= []).push(t, o),
      (r.preOrderCheckHooks ??= []).push(t, o));
}
function Xi(t, e) {
  for (let r = e.directiveStart, n = e.directiveEnd; r < n; r++) {
    let o = t.data[r].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: u,
        ngAfterViewChecked: c,
        ngOnDestroy: l,
      } = o;
    s && (t.contentHooks ??= []).push(-r, s),
      a &&
        ((t.contentHooks ??= []).push(r, a),
        (t.contentCheckHooks ??= []).push(r, a)),
      u && (t.viewHooks ??= []).push(-r, u),
      c &&
        ((t.viewHooks ??= []).push(r, c), (t.viewCheckHooks ??= []).push(r, c)),
      l != null && (t.destroyHooks ??= []).push(r, l);
  }
}
function wi(t, e, r) {
  vd(t, e, 3, r);
}
function _i(t, e, r, n) {
  (t[D] & 3) === r && vd(t, e, r, n);
}
function ls(t, e) {
  let r = t[D];
  (r & 3) === e && ((r &= 16383), (r += 1), (t[D] = r));
}
function vd(t, e, r, n) {
  let i = n !== void 0 ? t[mn] & 65535 : 0,
    o = n ?? -1,
    s = e.length - 1,
    a = 0;
  for (let u = i; u < s; u++)
    if (typeof e[u + 1] == "number") {
      if (((a = e[u]), n != null && a >= n)) break;
    } else
      e[u] < 0 && (t[mn] += 65536),
        (a < o || o == -1) &&
          (nm(t, r, e, u), (t[mn] = (t[mn] & 4294901760) + u + 2)),
        u++;
}
function cl(t, e) {
  Ye(4, t, e);
  let r = ne(null);
  try {
    e.call(t);
  } finally {
    ne(r), Ye(5, t, e);
  }
}
function nm(t, e, r, n) {
  let i = r[n] < 0,
    o = r[n + 1],
    s = i ? -r[n] : r[n],
    a = t[s];
  i
    ? t[D] >> 14 < t[mn] >> 16 &&
      (t[D] & 3) === e &&
      ((t[D] += 16384), cl(a, o))
    : cl(a, o);
}
var Dn = -1,
  Ut = class {
    constructor(e, r, n) {
      (this.factory = e),
        (this.resolving = !1),
        (this.canSeeViewProviders = r),
        (this.injectImpl = n);
    }
  };
function rm(t) {
  return t instanceof Ut;
}
function im(t) {
  return (t.flags & 8) !== 0;
}
function om(t) {
  return (t.flags & 16) !== 0;
}
function yd(t) {
  return t !== Dn;
}
function Ai(t) {
  return t & 32767;
}
function sm(t) {
  return t >> 16;
}
function Ni(t, e) {
  let r = sm(t),
    n = e;
  for (; r > 0; ) (n = n[xn]), r--;
  return n;
}
var Os = !0;
function ll(t) {
  let e = Os;
  return (Os = t), e;
}
var am = 256,
  Dd = am - 1,
  Cd = 5,
  um = 0,
  Qe = {};
function cm(t, e, r) {
  let n;
  typeof r == "string"
    ? (n = r.charCodeAt(0) || 0)
    : r.hasOwnProperty(Yn) && (n = r[Yn]),
    n == null && (n = r[Yn] = um++);
  let i = n & Dd,
    o = 1 << i;
  e.data[t + (i >> Cd)] |= o;
}
function Oi(t, e) {
  let r = wd(t, e);
  if (r !== -1) return r;
  let n = e[I];
  n.firstCreatePass &&
    ((t.injectorIndex = e.length),
    ds(n.data, t),
    ds(e, null),
    ds(n.blueprint, null));
  let i = Oa(t, e),
    o = t.injectorIndex;
  if (yd(i)) {
    let s = Ai(i),
      a = Ni(i, e),
      u = a[I].data;
    for (let c = 0; c < 8; c++) e[o + c] = a[s + c] | u[s + c];
  }
  return (e[o + 8] = i), o;
}
function ds(t, e) {
  t.push(0, 0, 0, 0, 0, 0, 0, 0, e);
}
function wd(t, e) {
  return t.injectorIndex === -1 ||
    (t.parent && t.parent.injectorIndex === t.injectorIndex) ||
    e[t.injectorIndex + 8] === null
    ? -1
    : t.injectorIndex;
}
function Oa(t, e) {
  if (t.parent && t.parent.injectorIndex !== -1) return t.parent.injectorIndex;
  let r = 0,
    n = null,
    i = e;
  for (; i !== null; ) {
    if (((n = Md(i)), n === null)) return Dn;
    if ((r++, (i = i[xn]), n.injectorIndex !== -1))
      return n.injectorIndex | (r << 16);
  }
  return Dn;
}
function Rs(t, e, r) {
  cm(t, e, r);
}
function _d(t, e, r) {
  if (r & T.Optional || t !== void 0) return t;
  Ia(e, "NodeInjector");
}
function Id(t, e, r, n) {
  if (
    (r & T.Optional && n === void 0 && (n = null), !(r & (T.Self | T.Host)))
  ) {
    let i = t[wn],
      o = Me(void 0);
    try {
      return i ? i.get(e, n, r & T.Optional) : $l(e, n, r & T.Optional);
    } finally {
      Me(o);
    }
  }
  return _d(n, e, r);
}
function Ed(t, e, r, n = T.Default, i) {
  if (t !== null) {
    if (e[D] & 2048 && !(n & T.Self)) {
      let s = hm(t, e, r, n, Qe);
      if (s !== Qe) return s;
    }
    let o = bd(t, e, r, n, Qe);
    if (o !== Qe) return o;
  }
  return Id(e, r, n, i);
}
function bd(t, e, r, n, i) {
  let o = dm(r);
  if (typeof o == "function") {
    if (!dd(e, t, n)) return n & T.Host ? _d(i, r, n) : Id(e, r, n, i);
    try {
      let s;
      if (((s = o(n)), s == null && !(n & T.Optional))) Ia(r);
      else return s;
    } finally {
      gd();
    }
  } else if (typeof o == "number") {
    let s = null,
      a = wd(t, e),
      u = Dn,
      c = n & T.Host ? e[$e][Be] : null;
    for (
      (a === -1 || n & T.SkipSelf) &&
      ((u = a === -1 ? Oa(t, e) : e[a + 8]),
      u === Dn || !fl(n, !1)
        ? (a = -1)
        : ((s = e[I]), (a = Ai(u)), (e = Ni(u, e))));
      a !== -1;

    ) {
      let l = e[I];
      if (dl(o, a, l.data)) {
        let d = lm(a, e, r, s, n, c);
        if (d !== Qe) return d;
      }
      (u = e[a + 8]),
        u !== Dn && fl(n, e[I].data[a + 8] === c) && dl(o, a, e)
          ? ((s = l), (a = Ai(u)), (e = Ni(u, e)))
          : (a = -1);
    }
  }
  return i;
}
function lm(t, e, r, n, i, o) {
  let s = e[I],
    a = s.data[t + 8],
    u = n == null ? Zi(a) && Os : n != s && (a.type & 3) !== 0,
    c = i & T.Host && o === a,
    l = Ii(a, s, r, u, c);
  return l !== null ? Ht(e, s, l, a) : Qe;
}
function Ii(t, e, r, n, i) {
  let o = t.providerIndexes,
    s = e.data,
    a = o & 1048575,
    u = t.directiveStart,
    c = t.directiveEnd,
    l = o >> 20,
    d = n ? a : a + l,
    f = i ? a + l : c;
  for (let h = d; h < f; h++) {
    let p = s[h];
    if ((h < u && r === p) || (h >= u && p.type === r)) return h;
  }
  if (i) {
    let h = s[u];
    if (h && Ct(h) && h.type === r) return u;
  }
  return null;
}
function Ht(t, e, r, n) {
  let i = t[r],
    o = e.data;
  if (rm(i)) {
    let s = i;
    s.resolving && Zp(qp(o[r]));
    let a = ll(s.canSeeViewProviders);
    s.resolving = !0;
    let u,
      c = s.injectImpl ? Me(s.injectImpl) : null,
      l = dd(t, n, T.Default);
    try {
      (i = t[r] = s.factory(void 0, o, t, n)),
        e.firstCreatePass && r >= n.directiveStart && tm(r, o[r], e);
    } finally {
      c !== null && Me(c), ll(a), (s.resolving = !1), gd();
    }
  }
  return i;
}
function dm(t) {
  if (typeof t == "string") return t.charCodeAt(0) || 0;
  let e = t.hasOwnProperty(Yn) ? t[Yn] : void 0;
  return typeof e == "number" ? (e >= 0 ? e & Dd : fm) : e;
}
function dl(t, e, r) {
  let n = 1 << t;
  return !!(r[e + (t >> Cd)] & n);
}
function fl(t, e) {
  return !(t & T.Self) && !(t & T.Host && e);
}
var Lt = class {
  constructor(e, r) {
    (this._tNode = e), (this._lView = r);
  }
  get(e, r, n) {
    return Ed(this._tNode, this._lView, e, Wi(n), r);
  }
};
function fm() {
  return new Lt(we(), G());
}
function He(t) {
  return gr(() => {
    let e = t.prototype.constructor,
      r = e[Si] || Fs(e),
      n = Object.prototype,
      i = Object.getPrototypeOf(t.prototype).constructor;
    for (; i && i !== n; ) {
      let o = i[Si] || Fs(i);
      if (o && o !== r) return o;
      i = Object.getPrototypeOf(i);
    }
    return (o) => new o();
  });
}
function Fs(t) {
  return Fl(t)
    ? () => {
        let e = Fs(ce(t));
        return e && e();
      }
    : In(t);
}
function hm(t, e, r, n, i) {
  let o = t,
    s = e;
  for (; o !== null && s !== null && s[D] & 2048 && !(s[D] & 512); ) {
    let a = bd(o, s, r, n | T.Self, Qe);
    if (a !== Qe) return a;
    let u = o.parent;
    if (!u) {
      let c = s[Jl];
      if (c) {
        let l = c.get(r, Qe, n);
        if (l !== Qe) return l;
      }
      (u = Md(s)), (s = s[xn]);
    }
    o = u;
  }
  return i;
}
function Md(t) {
  let e = t[I],
    r = e.type;
  return r === 2 ? e.declTNode : r === 1 ? t[Be] : null;
}
var yi = "__parameters__";
function pm(t) {
  return function (...r) {
    if (t) {
      let n = t(...r);
      for (let i in n) this[i] = n[i];
    }
  };
}
function Sd(t, e, r) {
  return gr(() => {
    let n = pm(e);
    function i(...o) {
      if (this instanceof i) return n.apply(this, o), this;
      let s = new i(...o);
      return (a.annotation = s), a;
      function a(u, c, l) {
        let d = u.hasOwnProperty(yi)
          ? u[yi]
          : Object.defineProperty(u, yi, { value: [] })[yi];
        for (; d.length <= l; ) d.push(null);
        return (d[l] = d[l] || []).push(s), u;
      }
    }
    return (
      r && (i.prototype = Object.create(r.prototype)),
      (i.prototype.ngMetadataName = t),
      (i.annotationCls = i),
      i
    );
  });
}
function gm(t) {
  return typeof t == "function";
}
function mm(t, e, r) {
  if (t.length !== e.length) return !1;
  for (let n = 0; n < t.length; n++) {
    let i = t[n],
      o = e[n];
    if ((r && ((i = r(i)), (o = r(o))), o !== i)) return !1;
  }
  return !0;
}
function vm(t) {
  return t.flat(Number.POSITIVE_INFINITY);
}
function Ra(t, e) {
  t.forEach((r) => (Array.isArray(r) ? Ra(r, e) : e(r)));
}
function xd(t, e, r) {
  e >= t.length ? t.push(r) : t.splice(e, 0, r);
}
function Ri(t, e) {
  return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0];
}
function ym(t, e, r, n) {
  let i = t.length;
  if (i == e) t.push(r, n);
  else if (i === 1) t.push(n, t[0]), (t[0] = r);
  else {
    for (i--, t.push(t[i - 1], t[i]); i > e; ) {
      let o = i - 2;
      (t[i] = t[o]), i--;
    }
    (t[e] = r), (t[e + 1] = n);
  }
}
function Dm(t, e, r) {
  let n = vr(t, e);
  return n >= 0 ? (t[n | 1] = r) : ((n = ~n), ym(t, n, e, r)), n;
}
function fs(t, e) {
  let r = vr(t, e);
  if (r >= 0) return t[r | 1];
}
function vr(t, e) {
  return Cm(t, e, 1);
}
function Cm(t, e, r) {
  let n = 0,
    i = t.length >> r;
  for (; i !== n; ) {
    let o = n + ((i - n) >> 1),
      s = t[o << r];
    if (e === s) return o << r;
    s > e ? (i = o) : (n = o + 1);
  }
  return ~(i << r);
}
var Fa = Bl(Sd("Optional"), 8);
var Td = Bl(Sd("SkipSelf"), 4);
var bn = new S("ENVIRONMENT_INITIALIZER"),
  Ad = new S("INJECTOR", -1),
  Nd = new S("INJECTOR_DEF_TYPES"),
  Fi = class {
    get(e, r = Xn) {
      if (r === Xn) {
        let n = new Error(`NullInjectorError: No provider for ${he(e)}!`);
        throw ((n.name = "NullInjectorError"), n);
      }
      return r;
    }
  };
function eo(t) {
  return { ɵproviders: t };
}
function wm(...t) {
  return { ɵproviders: Od(!0, t), ɵfromNgModule: !0 };
}
function Od(t, ...e) {
  let r = [],
    n = new Set(),
    i,
    o = (s) => {
      r.push(s);
    };
  return (
    Ra(e, (s) => {
      let a = s;
      Ps(a, o, [], n) && ((i ||= []), i.push(a));
    }),
    i !== void 0 && Rd(i, o),
    r
  );
}
function Rd(t, e) {
  for (let r = 0; r < t.length; r++) {
    let { ngModule: n, providers: i } = t[r];
    Pa(i, (o) => {
      e(o, n);
    });
  }
}
function Ps(t, e, r, n) {
  if (((t = ce(t)), !t)) return !1;
  let i = null,
    o = el(t),
    s = !o && Vt(t);
  if (!o && !s) {
    let u = t.ngModule;
    if (((o = el(u)), o)) i = u;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    i = t;
  }
  let a = n.has(i);
  if (s) {
    if (a) return !1;
    if ((n.add(i), s.dependencies)) {
      let u =
        typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
      for (let c of u) Ps(c, e, r, n);
    }
  } else if (o) {
    if (o.imports != null && !a) {
      n.add(i);
      let c;
      try {
        Ra(o.imports, (l) => {
          Ps(l, e, r, n) && ((c ||= []), c.push(l));
        });
      } finally {
      }
      c !== void 0 && Rd(c, e);
    }
    if (!a) {
      let c = In(i) || (() => new i());
      e({ provide: i, useFactory: c, deps: Se }, i),
        e({ provide: Nd, useValue: i, multi: !0 }, i),
        e({ provide: bn, useValue: () => F(i), multi: !0 }, i);
    }
    let u = o.providers;
    if (u != null && !a) {
      let c = t;
      Pa(u, (l) => {
        e(l, c);
      });
    }
  } else return !1;
  return i !== t && t.providers !== void 0;
}
function Pa(t, e) {
  for (let r of t)
    Pl(r) && (r = r.ɵproviders), Array.isArray(r) ? Pa(r, e) : e(r);
}
var _m = H({ provide: String, useValue: H });
function Fd(t) {
  return t !== null && typeof t == "object" && _m in t;
}
function Im(t) {
  return !!(t && t.useExisting);
}
function Em(t) {
  return !!(t && t.useFactory);
}
function Mn(t) {
  return typeof t == "function";
}
function bm(t) {
  return !!t.useClass;
}
var to = new S("Set Injector scope."),
  Ei = {},
  Mm = {},
  hs;
function ka() {
  return hs === void 0 && (hs = new Fi()), hs;
}
var xe = class {},
  sr = class extends xe {
    get destroyed() {
      return this._destroyed;
    }
    constructor(e, r, n, i) {
      super(),
        (this.parent = r),
        (this.source = n),
        (this.scopes = i),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        Ls(e, (s) => this.processProvider(s)),
        this.records.set(Ad, vn(void 0, this)),
        i.has("environment") && this.records.set(xe, vn(void 0, this));
      let o = this.records.get(to);
      o != null && typeof o.value == "string" && this.scopes.add(o.value),
        (this.injectorDefTypes = new Set(this.get(Nd, Se, T.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let e = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of e) r();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear();
      }
    }
    onDestroy(e) {
      return (
        this.assertNotDestroyed(),
        this._onDestroyHooks.push(e),
        () => this.removeOnDestroy(e)
      );
    }
    runInContext(e) {
      this.assertNotDestroyed();
      let r = yt(this),
        n = Me(void 0),
        i;
      try {
        return e();
      } finally {
        yt(r), Me(n);
      }
    }
    get(e, r = Xn, n = T.Default) {
      if ((this.assertNotDestroyed(), e.hasOwnProperty(Jc))) return e[Jc](this);
      n = Wi(n);
      let i,
        o = yt(this),
        s = Me(void 0);
      try {
        if (!(n & T.SkipSelf)) {
          let u = this.records.get(e);
          if (u === void 0) {
            let c = Nm(e) && zi(e);
            c && this.injectableDefInScope(c)
              ? (u = vn(ks(e), Ei))
              : (u = null),
              this.records.set(e, u);
          }
          if (u != null) return this.hydrate(e, u);
        }
        let a = n & T.Self ? ka() : this.parent;
        return (r = n & T.Optional && r === Xn ? null : r), a.get(e, r);
      } catch (a) {
        if (a.name === "NullInjectorError") {
          if (((a[xi] = a[xi] || []).unshift(he(e)), o)) throw a;
          return sg(a, e, "R3InjectorError", this.source);
        } else throw a;
      } finally {
        Me(s), yt(o);
      }
    }
    resolveInjectorInitializers() {
      let e = yt(this),
        r = Me(void 0),
        n;
      try {
        let i = this.get(bn, Se, T.Self);
        for (let o of i) o();
      } finally {
        yt(e), Me(r);
      }
    }
    toString() {
      let e = [],
        r = this.records;
      for (let n of r.keys()) e.push(he(n));
      return `R3Injector[${e.join(", ")}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new y(205, !1);
    }
    processProvider(e) {
      e = ce(e);
      let r = Mn(e) ? e : ce(e && e.provide),
        n = xm(e);
      if (!Mn(e) && e.multi === !0) {
        let i = this.records.get(r);
        i ||
          ((i = vn(void 0, Ei, !0)),
          (i.factory = () => Ss(i.multi)),
          this.records.set(r, i)),
          (r = e),
          i.multi.push(e);
      }
      this.records.set(r, n);
    }
    hydrate(e, r) {
      return (
        r.value === Ei && ((r.value = Mm), (r.value = r.factory())),
        typeof r.value == "object" &&
          r.value &&
          Am(r.value) &&
          this._ngOnDestroyHooks.add(r.value),
        r.value
      );
    }
    injectableDefInScope(e) {
      if (!e.providedIn) return !1;
      let r = ce(e.providedIn);
      return typeof r == "string"
        ? r === "any" || this.scopes.has(r)
        : this.injectorDefTypes.has(r);
    }
    removeOnDestroy(e) {
      let r = this._onDestroyHooks.indexOf(e);
      r !== -1 && this._onDestroyHooks.splice(r, 1);
    }
  };
function ks(t) {
  let e = zi(t),
    r = e !== null ? e.factory : In(t);
  if (r !== null) return r;
  if (t instanceof S) throw new y(204, !1);
  if (t instanceof Function) return Sm(t);
  throw new y(204, !1);
}
function Sm(t) {
  if (t.length > 0) throw new y(204, !1);
  let r = Kp(t);
  return r !== null ? () => r.factory(t) : () => new t();
}
function xm(t) {
  if (Fd(t)) return vn(void 0, t.useValue);
  {
    let e = Pd(t);
    return vn(e, Ei);
  }
}
function Pd(t, e, r) {
  let n;
  if (Mn(t)) {
    let i = ce(t);
    return In(i) || ks(i);
  } else if (Fd(t)) n = () => ce(t.useValue);
  else if (Em(t)) n = () => t.useFactory(...Ss(t.deps || []));
  else if (Im(t)) n = () => F(ce(t.useExisting));
  else {
    let i = ce(t && (t.useClass || t.provide));
    if (Tm(t)) n = () => new i(...Ss(t.deps));
    else return In(i) || ks(i);
  }
  return n;
}
function vn(t, e, r = !1) {
  return { factory: t, value: e, multi: r ? [] : void 0 };
}
function Tm(t) {
  return !!t.deps;
}
function Am(t) {
  return (
    t !== null && typeof t == "object" && typeof t.ngOnDestroy == "function"
  );
}
function Nm(t) {
  return typeof t == "function" || (typeof t == "object" && t instanceof S);
}
function Ls(t, e) {
  for (let r of t)
    Array.isArray(r) ? Ls(r, e) : r && Pl(r) ? Ls(r.ɵproviders, e) : e(r);
}
function Yt(t, e) {
  t instanceof sr && t.assertNotDestroyed();
  let r,
    n = yt(t),
    i = Me(void 0);
  try {
    return e();
  } finally {
    yt(n), Me(i);
  }
}
function hl(t, e = null, r = null, n) {
  let i = kd(t, e, r, n);
  return i.resolveInjectorInitializers(), i;
}
function kd(t, e = null, r = null, n, i = new Set()) {
  let o = [r || Se, wm(t)];
  return (
    (n = n || (typeof t == "object" ? void 0 : he(t))),
    new sr(o, e || ka(), n || null, i)
  );
}
var Qt = (() => {
  let e = class e {
    static create(n, i) {
      if (Array.isArray(n)) return hl({ name: "" }, i, n, "");
      {
        let o = n.name ?? "";
        return hl({ name: o }, n.parent, n.providers, o);
      }
    }
  };
  (e.THROW_IF_NOT_FOUND = Xn),
    (e.NULL = new Fi()),
    (e.ɵprov = w({ token: e, providedIn: "any", factory: () => F(Ad) })),
    (e.__NG_ELEMENT_ID__ = -1);
  let t = e;
  return t;
})();
var Vs;
function Ld(t) {
  Vs = t;
}
function Om() {
  if (Vs !== void 0) return Vs;
  if (typeof document < "u") return document;
  throw new y(210, !1);
}
var La = new S("AppId", { providedIn: "root", factory: () => Rm }),
  Rm = "ng",
  Va = new S("Platform Initializer"),
  An = new S("Platform ID", {
    providedIn: "platform",
    factory: () => "unknown",
  });
var ja = new S("CSP nonce", {
  providedIn: "root",
  factory: () =>
    Om().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
    null,
});
function Vd(t) {
  return t instanceof Function ? t() : t;
}
function jd(t) {
  return (t.flags & 128) === 128;
}
var ut = (function (t) {
    return (
      (t[(t.Important = 1)] = "Important"),
      (t[(t.DashCase = 2)] = "DashCase"),
      t
    );
  })(ut || {}),
  Fm = /^>|^->|<!--|-->|--!>|<!-$/g,
  Pm = /(<|>)/g,
  km = "\u200B$1\u200B";
function Lm(t) {
  return t.replace(Fm, (e) => e.replace(Pm, km));
}
var $d = new Map(),
  Vm = 0;
function jm() {
  return Vm++;
}
function $m(t) {
  $d.set(t[qi], t);
}
function Bm(t) {
  $d.delete(t[qi]);
}
var pl = "__ngContext__";
function wt(t, e) {
  kt(e) ? ((t[pl] = e[qi]), $m(e)) : (t[pl] = e);
}
var Um;
function $a(t, e) {
  return Um(t, e);
}
function yn(t, e, r, n, i) {
  if (n != null) {
    let o,
      s = !1;
    dt(n) ? (o = n) : kt(n) && ((s = !0), (n = n[lt]));
    let a = Xe(n);
    t === 0 && r !== null
      ? i == null
        ? Gd(e, r, a)
        : Pi(e, r, a, i || null, !0)
      : t === 1 && r !== null
      ? Pi(e, r, a, i || null, !0)
      : t === 2
      ? sv(e, a, s)
      : t === 3 && e.destroyNode(a),
      o != null && uv(e, t, o, r, i);
  }
}
function Hm(t, e) {
  return t.createText(e);
}
function Gm(t, e, r) {
  t.setValue(e, r);
}
function zm(t, e) {
  return t.createComment(Lm(e));
}
function Bd(t, e, r) {
  return t.createElement(e, r);
}
function Wm(t, e) {
  Ud(t, e), (e[lt] = null), (e[Be] = null);
}
function qm(t, e, r, n, i, o) {
  (n[lt] = i), (n[Be] = e), io(t, n, r, 1, i, o);
}
function Ud(t, e) {
  io(t, e, e[oe], 2, null, null);
}
function Zm(t) {
  let e = t[rr];
  if (!e) return ps(t[I], t);
  for (; e; ) {
    let r = null;
    if (kt(e)) r = e[rr];
    else {
      let n = e[ue];
      n && (r = n);
    }
    if (!r) {
      for (; e && !e[je] && e !== t; ) kt(e) && ps(e[I], e), (e = e[ie]);
      e === null && (e = t), kt(e) && ps(e[I], e), (r = e && e[je]);
    }
    e = r;
  }
}
function Ym(t, e, r, n) {
  let i = ue + n,
    o = r.length;
  n > 0 && (r[i - 1][je] = e),
    n < o - ue
      ? ((e[je] = r[i]), xd(r, ue + n, e))
      : (r.push(e), (e[je] = null)),
    (e[ie] = r);
  let s = e[mr];
  s !== null && r !== s && Qm(s, e);
  let a = e[Ke];
  a !== null && a.insertView(t), As(e), (e[D] |= 128);
}
function Qm(t, e) {
  let r = t[_n],
    i = e[ie][ie][$e];
  e[$e] !== i && (t[D] |= Ea.HasTransplantedViews),
    r === null ? (t[_n] = [e]) : r.push(e);
}
function Hd(t, e) {
  let r = t[_n],
    n = r.indexOf(e);
  r.splice(n, 1);
}
function ar(t, e) {
  if (t.length <= ue) return;
  let r = ue + e,
    n = t[r];
  if (n) {
    let i = n[mr];
    i !== null && i !== t && Hd(i, n), e > 0 && (t[r - 1][je] = n[je]);
    let o = Ri(t, ue + e);
    Wm(n[I], n);
    let s = o[Ke];
    s !== null && s.detachView(o[I]),
      (n[ie] = null),
      (n[je] = null),
      (n[D] &= -129);
  }
  return n;
}
function no(t, e) {
  if (!(e[D] & 256)) {
    let r = e[oe];
    r.destroyNode && io(t, e, r, 3, null, null), Zm(e);
  }
}
function ps(t, e) {
  if (!(e[D] & 256)) {
    (e[D] &= -129),
      (e[D] |= 256),
      e[jt] && bc(e[jt]),
      Jm(t, e),
      Km(t, e),
      e[I].type === 1 && e[oe].destroy();
    let r = e[mr];
    if (r !== null && dt(e[ie])) {
      r !== e[ie] && Hd(r, e);
      let n = e[Ke];
      n !== null && n.detachView(t);
    }
    Bm(e);
  }
}
function Km(t, e) {
  let r = t.cleanup,
    n = e[nr];
  if (r !== null)
    for (let o = 0; o < r.length - 1; o += 2)
      if (typeof r[o] == "string") {
        let s = r[o + 3];
        s >= 0 ? n[s]() : n[-s].unsubscribe(), (o += 2);
      } else {
        let s = n[r[o + 1]];
        r[o].call(s);
      }
  n !== null && (e[nr] = null);
  let i = e[Jn];
  if (i !== null) {
    e[Jn] = null;
    for (let o = 0; o < i.length; o++) {
      let s = i[o];
      s();
    }
  }
}
function Jm(t, e) {
  let r;
  if (t != null && (r = t.destroyHooks) != null)
    for (let n = 0; n < r.length; n += 2) {
      let i = e[r[n]];
      if (!(i instanceof Ut)) {
        let o = r[n + 1];
        if (Array.isArray(o))
          for (let s = 0; s < o.length; s += 2) {
            let a = i[o[s]],
              u = o[s + 1];
            Ye(4, a, u);
            try {
              u.call(a);
            } finally {
              Ye(5, a, u);
            }
          }
        else {
          Ye(4, i, o);
          try {
            o.call(i);
          } finally {
            Ye(5, i, o);
          }
        }
      }
    }
}
function Xm(t, e, r) {
  return ev(t, e.parent, r);
}
function ev(t, e, r) {
  let n = e;
  for (; n !== null && n.type & 40; ) (e = n), (n = e.parent);
  if (n === null) return r[lt];
  {
    let { componentOffset: i } = n;
    if (i > -1) {
      let { encapsulation: o } = t.data[n.directiveStart + i];
      if (o === Je.None || o === Je.Emulated) return null;
    }
    return Ue(n, r);
  }
}
function Pi(t, e, r, n, i) {
  t.insertBefore(e, r, n, i);
}
function Gd(t, e, r) {
  t.appendChild(e, r);
}
function gl(t, e, r, n, i) {
  n !== null ? Pi(t, e, r, n, i) : Gd(t, e, r);
}
function tv(t, e, r, n) {
  t.removeChild(e, r, n);
}
function Ba(t, e) {
  return t.parentNode(e);
}
function nv(t, e) {
  return t.nextSibling(e);
}
function rv(t, e, r) {
  return ov(t, e, r);
}
function iv(t, e, r) {
  return t.type & 40 ? Ue(t, r) : null;
}
var ov = iv,
  ml;
function ro(t, e, r, n) {
  let i = Xm(t, n, e),
    o = e[oe],
    s = n.parent || e[Be],
    a = rv(s, n, e);
  if (i != null)
    if (Array.isArray(r))
      for (let u = 0; u < r.length; u++) gl(o, i, r[u], a, !1);
    else gl(o, i, r, a, !1);
  ml !== void 0 && ml(o, n, e, r, i);
}
function bi(t, e) {
  if (e !== null) {
    let r = e.type;
    if (r & 3) return Ue(e, t);
    if (r & 4) return js(-1, t[e.index]);
    if (r & 8) {
      let n = e.child;
      if (n !== null) return bi(t, n);
      {
        let i = t[e.index];
        return dt(i) ? js(-1, i) : Xe(i);
      }
    } else {
      if (r & 32) return $a(e, t)() || Xe(t[e.index]);
      {
        let n = zd(t, e);
        if (n !== null) {
          if (Array.isArray(n)) return n[0];
          let i = or(t[$e]);
          return bi(i, n);
        } else return bi(t, e.next);
      }
    }
  }
  return null;
}
function zd(t, e) {
  if (e !== null) {
    let n = t[$e][Be],
      i = e.projection;
    return n.projection[i];
  }
  return null;
}
function js(t, e) {
  let r = ue + t + 1;
  if (r < e.length) {
    let n = e[r],
      i = n[I].firstChild;
    if (i !== null) return bi(n, i);
  }
  return e[$t];
}
function sv(t, e, r) {
  let n = Ba(t, e);
  n && tv(t, n, e, r);
}
function Ua(t, e, r, n, i, o, s) {
  for (; r != null; ) {
    let a = n[r.index],
      u = r.type;
    if (
      (s && e === 0 && (a && wt(Xe(a), n), (r.flags |= 2)),
      (r.flags & 32) !== 32)
    )
      if (u & 8) Ua(t, e, r.child, n, i, o, !1), yn(e, t, i, a, o);
      else if (u & 32) {
        let c = $a(r, n),
          l;
        for (; (l = c()); ) yn(e, t, i, l, o);
        yn(e, t, i, a, o);
      } else u & 16 ? av(t, e, n, r, i, o) : yn(e, t, i, a, o);
    r = s ? r.projectionNext : r.next;
  }
}
function io(t, e, r, n, i, o) {
  Ua(r, n, t.firstChild, e, i, o, !1);
}
function av(t, e, r, n, i, o) {
  let s = r[$e],
    u = s[Be].projection[n.projection];
  if (Array.isArray(u))
    for (let c = 0; c < u.length; c++) {
      let l = u[c];
      yn(e, t, i, l, o);
    }
  else {
    let c = u,
      l = s[ie];
    jd(n) && (c.flags |= 128), Ua(t, e, c, l, i, o, !0);
  }
}
function uv(t, e, r, n, i) {
  let o = r[$t],
    s = Xe(r);
  o !== s && yn(e, t, n, o, i);
  for (let a = ue; a < r.length; a++) {
    let u = r[a];
    io(u[I], u, t, e, n, o);
  }
}
function cv(t, e, r, n, i) {
  if (e) i ? t.addClass(r, n) : t.removeClass(r, n);
  else {
    let o = n.indexOf("-") === -1 ? void 0 : ut.DashCase;
    i == null
      ? t.removeStyle(r, n, o)
      : (typeof i == "string" &&
          i.endsWith("!important") &&
          ((i = i.slice(0, -10)), (o |= ut.Important)),
        t.setStyle(r, n, i, o));
  }
}
function lv(t, e, r) {
  t.setAttribute(e, "style", r);
}
function Wd(t, e, r) {
  r === "" ? t.removeAttribute(e, "class") : t.setAttribute(e, "class", r);
}
function qd(t, e, r) {
  let { mergedAttrs: n, classes: i, styles: o } = r;
  n !== null && xs(t, e, n),
    i !== null && Wd(t, e, i),
    o !== null && lv(t, e, o);
}
var $s = class {
  constructor(e) {
    this.changingThisBreaksApplicationSecurity = e;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${$p})`;
  }
};
function Ha(t) {
  return t instanceof $s ? t.changingThisBreaksApplicationSecurity : t;
}
var Bs = class {};
var dv = "h",
  fv = "b";
var hv = () => null;
function Ga(t, e, r = !1) {
  return hv(t, e, r);
}
var Us = class {},
  ki = class {};
function pv(t) {
  let e = Error(`No component factory found for ${he(t)}.`);
  return (e[gv] = t), e;
}
var gv = "ngComponent";
var Hs = class {
    resolveComponentFactory(e) {
      throw pv(e);
    }
  },
  oo = (() => {
    let e = class e {};
    e.NULL = new Hs();
    let t = e;
    return t;
  })();
function mv() {
  return Nn(we(), G());
}
function Nn(t, e) {
  return new Ge(Ue(t, e));
}
var Ge = (() => {
  let e = class e {
    constructor(n) {
      this.nativeElement = n;
    }
  };
  e.__NG_ELEMENT_ID__ = mv;
  let t = e;
  return t;
})();
function vv(t) {
  return t instanceof Ge ? t.nativeElement : t;
}
var ur = class {},
  Kt = (() => {
    let e = class e {
      constructor() {
        this.destroyNode = null;
      }
    };
    e.__NG_ELEMENT_ID__ = () => yv();
    let t = e;
    return t;
  })();
function yv() {
  let t = G(),
    e = we(),
    r = bt(e.index, t);
  return (kt(r) ? r : t)[oe];
}
var Dv = (() => {
    let e = class e {};
    e.ɵprov = w({ token: e, providedIn: "root", factory: () => null });
    let t = e;
    return t;
  })(),
  gs = {};
function Zd(t) {
  return wv(t)
    ? Array.isArray(t) || (!(t instanceof Map) && Symbol.iterator in t)
    : !1;
}
function Cv(t, e) {
  if (Array.isArray(t)) for (let r = 0; r < t.length; r++) e(t[r]);
  else {
    let r = t[Symbol.iterator](),
      n;
    for (; !(n = r.next()).done; ) e(n.value);
  }
}
function wv(t) {
  return t !== null && (typeof t == "function" || typeof t == "object");
}
var Gs = class {
    constructor() {}
    supports(e) {
      return Zd(e);
    }
    create(e) {
      return new zs(e);
    }
  },
  _v = (t, e) => e,
  zs = class {
    constructor(e) {
      (this.length = 0),
        (this._linkedRecords = null),
        (this._unlinkedRecords = null),
        (this._previousItHead = null),
        (this._itHead = null),
        (this._itTail = null),
        (this._additionsHead = null),
        (this._additionsTail = null),
        (this._movesHead = null),
        (this._movesTail = null),
        (this._removalsHead = null),
        (this._removalsTail = null),
        (this._identityChangesHead = null),
        (this._identityChangesTail = null),
        (this._trackByFn = e || _v);
    }
    forEachItem(e) {
      let r;
      for (r = this._itHead; r !== null; r = r._next) e(r);
    }
    forEachOperation(e) {
      let r = this._itHead,
        n = this._removalsHead,
        i = 0,
        o = null;
      for (; r || n; ) {
        let s = !n || (r && r.currentIndex < vl(n, i, o)) ? r : n,
          a = vl(s, i, o),
          u = s.currentIndex;
        if (s === n) i--, (n = n._nextRemoved);
        else if (((r = r._next), s.previousIndex == null)) i++;
        else {
          o || (o = []);
          let c = a - i,
            l = u - i;
          if (c != l) {
            for (let f = 0; f < c; f++) {
              let h = f < o.length ? o[f] : (o[f] = 0),
                p = h + f;
              l <= p && p < c && (o[f] = h + 1);
            }
            let d = s.previousIndex;
            o[d] = l - c;
          }
        }
        a !== u && e(s, a, u);
      }
    }
    forEachPreviousItem(e) {
      let r;
      for (r = this._previousItHead; r !== null; r = r._nextPrevious) e(r);
    }
    forEachAddedItem(e) {
      let r;
      for (r = this._additionsHead; r !== null; r = r._nextAdded) e(r);
    }
    forEachMovedItem(e) {
      let r;
      for (r = this._movesHead; r !== null; r = r._nextMoved) e(r);
    }
    forEachRemovedItem(e) {
      let r;
      for (r = this._removalsHead; r !== null; r = r._nextRemoved) e(r);
    }
    forEachIdentityChange(e) {
      let r;
      for (r = this._identityChangesHead; r !== null; r = r._nextIdentityChange)
        e(r);
    }
    diff(e) {
      if ((e == null && (e = []), !Zd(e))) throw new y(900, !1);
      return this.check(e) ? this : null;
    }
    onDestroy() {}
    check(e) {
      this._reset();
      let r = this._itHead,
        n = !1,
        i,
        o,
        s;
      if (Array.isArray(e)) {
        this.length = e.length;
        for (let a = 0; a < this.length; a++)
          (o = e[a]),
            (s = this._trackByFn(a, o)),
            r === null || !Object.is(r.trackById, s)
              ? ((r = this._mismatch(r, o, s, a)), (n = !0))
              : (n && (r = this._verifyReinsertion(r, o, s, a)),
                Object.is(r.item, o) || this._addIdentityChange(r, o)),
            (r = r._next);
      } else
        (i = 0),
          Cv(e, (a) => {
            (s = this._trackByFn(i, a)),
              r === null || !Object.is(r.trackById, s)
                ? ((r = this._mismatch(r, a, s, i)), (n = !0))
                : (n && (r = this._verifyReinsertion(r, a, s, i)),
                  Object.is(r.item, a) || this._addIdentityChange(r, a)),
              (r = r._next),
              i++;
          }),
          (this.length = i);
      return this._truncate(r), (this.collection = e), this.isDirty;
    }
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._movesHead !== null ||
        this._removalsHead !== null ||
        this._identityChangesHead !== null
      );
    }
    _reset() {
      if (this.isDirty) {
        let e;
        for (e = this._previousItHead = this._itHead; e !== null; e = e._next)
          e._nextPrevious = e._next;
        for (e = this._additionsHead; e !== null; e = e._nextAdded)
          e.previousIndex = e.currentIndex;
        for (
          this._additionsHead = this._additionsTail = null, e = this._movesHead;
          e !== null;
          e = e._nextMoved
        )
          e.previousIndex = e.currentIndex;
        (this._movesHead = this._movesTail = null),
          (this._removalsHead = this._removalsTail = null),
          (this._identityChangesHead = this._identityChangesTail = null);
      }
    }
    _mismatch(e, r, n, i) {
      let o;
      return (
        e === null ? (o = this._itTail) : ((o = e._prev), this._remove(e)),
        (e =
          this._unlinkedRecords === null
            ? null
            : this._unlinkedRecords.get(n, null)),
        e !== null
          ? (Object.is(e.item, r) || this._addIdentityChange(e, r),
            this._reinsertAfter(e, o, i))
          : ((e =
              this._linkedRecords === null
                ? null
                : this._linkedRecords.get(n, i)),
            e !== null
              ? (Object.is(e.item, r) || this._addIdentityChange(e, r),
                this._moveAfter(e, o, i))
              : (e = this._addAfter(new Ws(r, n), o, i))),
        e
      );
    }
    _verifyReinsertion(e, r, n, i) {
      let o =
        this._unlinkedRecords === null
          ? null
          : this._unlinkedRecords.get(n, null);
      return (
        o !== null
          ? (e = this._reinsertAfter(o, e._prev, i))
          : e.currentIndex != i &&
            ((e.currentIndex = i), this._addToMoves(e, i)),
        e
      );
    }
    _truncate(e) {
      for (; e !== null; ) {
        let r = e._next;
        this._addToRemovals(this._unlink(e)), (e = r);
      }
      this._unlinkedRecords !== null && this._unlinkedRecords.clear(),
        this._additionsTail !== null && (this._additionsTail._nextAdded = null),
        this._movesTail !== null && (this._movesTail._nextMoved = null),
        this._itTail !== null && (this._itTail._next = null),
        this._removalsTail !== null && (this._removalsTail._nextRemoved = null),
        this._identityChangesTail !== null &&
          (this._identityChangesTail._nextIdentityChange = null);
    }
    _reinsertAfter(e, r, n) {
      this._unlinkedRecords !== null && this._unlinkedRecords.remove(e);
      let i = e._prevRemoved,
        o = e._nextRemoved;
      return (
        i === null ? (this._removalsHead = o) : (i._nextRemoved = o),
        o === null ? (this._removalsTail = i) : (o._prevRemoved = i),
        this._insertAfter(e, r, n),
        this._addToMoves(e, n),
        e
      );
    }
    _moveAfter(e, r, n) {
      return (
        this._unlink(e), this._insertAfter(e, r, n), this._addToMoves(e, n), e
      );
    }
    _addAfter(e, r, n) {
      return (
        this._insertAfter(e, r, n),
        this._additionsTail === null
          ? (this._additionsTail = this._additionsHead = e)
          : (this._additionsTail = this._additionsTail._nextAdded = e),
        e
      );
    }
    _insertAfter(e, r, n) {
      let i = r === null ? this._itHead : r._next;
      return (
        (e._next = i),
        (e._prev = r),
        i === null ? (this._itTail = e) : (i._prev = e),
        r === null ? (this._itHead = e) : (r._next = e),
        this._linkedRecords === null && (this._linkedRecords = new Li()),
        this._linkedRecords.put(e),
        (e.currentIndex = n),
        e
      );
    }
    _remove(e) {
      return this._addToRemovals(this._unlink(e));
    }
    _unlink(e) {
      this._linkedRecords !== null && this._linkedRecords.remove(e);
      let r = e._prev,
        n = e._next;
      return (
        r === null ? (this._itHead = n) : (r._next = n),
        n === null ? (this._itTail = r) : (n._prev = r),
        e
      );
    }
    _addToMoves(e, r) {
      return (
        e.previousIndex === r ||
          (this._movesTail === null
            ? (this._movesTail = this._movesHead = e)
            : (this._movesTail = this._movesTail._nextMoved = e)),
        e
      );
    }
    _addToRemovals(e) {
      return (
        this._unlinkedRecords === null && (this._unlinkedRecords = new Li()),
        this._unlinkedRecords.put(e),
        (e.currentIndex = null),
        (e._nextRemoved = null),
        this._removalsTail === null
          ? ((this._removalsTail = this._removalsHead = e),
            (e._prevRemoved = null))
          : ((e._prevRemoved = this._removalsTail),
            (this._removalsTail = this._removalsTail._nextRemoved = e)),
        e
      );
    }
    _addIdentityChange(e, r) {
      return (
        (e.item = r),
        this._identityChangesTail === null
          ? (this._identityChangesTail = this._identityChangesHead = e)
          : (this._identityChangesTail =
              this._identityChangesTail._nextIdentityChange =
                e),
        e
      );
    }
  },
  Ws = class {
    constructor(e, r) {
      (this.item = e),
        (this.trackById = r),
        (this.currentIndex = null),
        (this.previousIndex = null),
        (this._nextPrevious = null),
        (this._prev = null),
        (this._next = null),
        (this._prevDup = null),
        (this._nextDup = null),
        (this._prevRemoved = null),
        (this._nextRemoved = null),
        (this._nextAdded = null),
        (this._nextMoved = null),
        (this._nextIdentityChange = null);
    }
  },
  qs = class {
    constructor() {
      (this._head = null), (this._tail = null);
    }
    add(e) {
      this._head === null
        ? ((this._head = this._tail = e),
          (e._nextDup = null),
          (e._prevDup = null))
        : ((this._tail._nextDup = e),
          (e._prevDup = this._tail),
          (e._nextDup = null),
          (this._tail = e));
    }
    get(e, r) {
      let n;
      for (n = this._head; n !== null; n = n._nextDup)
        if ((r === null || r <= n.currentIndex) && Object.is(n.trackById, e))
          return n;
      return null;
    }
    remove(e) {
      let r = e._prevDup,
        n = e._nextDup;
      return (
        r === null ? (this._head = n) : (r._nextDup = n),
        n === null ? (this._tail = r) : (n._prevDup = r),
        this._head === null
      );
    }
  },
  Li = class {
    constructor() {
      this.map = new Map();
    }
    put(e) {
      let r = e.trackById,
        n = this.map.get(r);
      n || ((n = new qs()), this.map.set(r, n)), n.add(e);
    }
    get(e, r) {
      let n = e,
        i = this.map.get(n);
      return i ? i.get(e, r) : null;
    }
    remove(e) {
      let r = e.trackById;
      return this.map.get(r).remove(e) && this.map.delete(r), e;
    }
    get isEmpty() {
      return this.map.size === 0;
    }
    clear() {
      this.map.clear();
    }
  };
function vl(t, e, r) {
  let n = t.previousIndex;
  if (n === null) return n;
  let i = 0;
  return r && n < r.length && (i = r[n]), n + e + i;
}
function yl() {
  return new za([new Gs()]);
}
var za = (() => {
  let e = class e {
    constructor(n) {
      this.factories = n;
    }
    static create(n, i) {
      if (i != null) {
        let o = i.factories.slice();
        n = n.concat(o);
      }
      return new e(n);
    }
    static extend(n) {
      return {
        provide: e,
        useFactory: (i) => e.create(n, i || yl()),
        deps: [[e, new Td(), new Fa()]],
      };
    }
    find(n) {
      let i = this.factories.find((o) => o.supports(n));
      if (i != null) return i;
      throw new y(901, !1);
    }
  };
  e.ɵprov = w({ token: e, providedIn: "root", factory: yl });
  let t = e;
  return t;
})();
function Vi(t, e, r, n, i = !1) {
  for (; r !== null; ) {
    let o = e[r.index];
    o !== null && n.push(Xe(o)), dt(o) && Iv(o, n);
    let s = r.type;
    if (s & 8) Vi(t, e, r.child, n);
    else if (s & 32) {
      let a = $a(r, e),
        u;
      for (; (u = a()); ) n.push(u);
    } else if (s & 16) {
      let a = zd(e, r);
      if (Array.isArray(a)) n.push(...a);
      else {
        let u = or(e[$e]);
        Vi(u[I], u, a, n, !0);
      }
    }
    r = i ? r.projectionNext : r.next;
  }
  return n;
}
function Iv(t, e) {
  for (let r = ue; r < t.length; r++) {
    let n = t[r],
      i = n[I].firstChild;
    i !== null && Vi(n[I], n, i, e);
  }
  t[$t] !== t[lt] && e.push(t[$t]);
}
var Yd = [];
function Ev(t) {
  return t[jt] ?? bv(t);
}
function bv(t) {
  let e = Yd.pop() ?? Object.create(Sv);
  return (e.lView = t), e;
}
function Mv(t) {
  t.lView[jt] !== t && ((t.lView = null), Yd.push(t));
}
var Sv = z(g({}, _c), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (t) => {
    ir(t.lView);
  },
  consumerOnSignalRead() {
    this.lView[jt] = this;
  },
});
function Qd(t) {
  return Jd(t[rr]);
}
function Kd(t) {
  return Jd(t[je]);
}
function Jd(t) {
  for (; t !== null && !dt(t); ) t = t[je];
  return t;
}
var xv = "ngOriginalError";
function ms(t) {
  return t[xv];
}
var ct = class {
    constructor() {
      this._console = console;
    }
    handleError(e) {
      let r = this._findOriginalError(e);
      this._console.error("ERROR", e),
        r && this._console.error("ORIGINAL ERROR", r);
    }
    _findOriginalError(e) {
      let r = e && ms(e);
      for (; r && ms(r); ) r = ms(r);
      return r || null;
    }
  },
  Xd = new S("", {
    providedIn: "root",
    factory: () => m(ct).handleError.bind(void 0),
  });
var ef = !1,
  Tv = new S("", { providedIn: "root", factory: () => ef });
var On = {};
function q(t = 1) {
  tf(ge(), G(), Zt() + t, !1);
}
function tf(t, e, r, n) {
  if (!n)
    if ((e[D] & 3) === 3) {
      let o = t.preOrderCheckHooks;
      o !== null && wi(e, o, r);
    } else {
      let o = t.preOrderHooks;
      o !== null && _i(e, o, 0, r);
    }
  Bt(r);
}
function W(t, e = T.Default) {
  let r = G();
  if (r === null) return F(t, e);
  let n = we();
  return Ed(n, r, ce(t), e);
}
function nf(t, e, r, n, i, o) {
  let s = ne(null);
  try {
    let a = null;
    i & De.SignalBased && (a = e[n][wc]),
      a !== null && a.transformFn !== void 0 && (o = a.transformFn(o)),
      i & De.HasDecoratorInputTransform &&
        (o = t.inputTransforms[n].call(e, o)),
      t.setInput !== null ? t.setInput(e, a, o, r, n) : ed(e, a, n, o);
  } finally {
    ne(s);
  }
}
function Av(t, e) {
  let r = t.hostBindingOpCodes;
  if (r !== null)
    try {
      for (let n = 0; n < r.length; n++) {
        let i = r[n];
        if (i < 0) Bt(~i);
        else {
          let o = i,
            s = r[++n],
            a = r[++n];
          Zg(s, o);
          let u = e[o];
          a(2, u);
        }
      }
    } finally {
      Bt(-1);
    }
}
function so(t, e, r, n, i, o, s, a, u, c, l) {
  let d = e.blueprint.slice();
  return (
    (d[lt] = i),
    (d[D] = n | 4 | 128 | 8 | 64),
    (c !== null || (t && t[D] & 2048)) && (d[D] |= 2048),
    od(d),
    (d[ie] = d[xn] = t),
    (d[ae] = r),
    (d[Dt] = s || (t && t[Dt])),
    (d[oe] = a || (t && t[oe])),
    (d[wn] = u || (t && t[wn]) || null),
    (d[Be] = o),
    (d[qi] = jm()),
    (d[tr] = l),
    (d[Jl] = c),
    (d[$e] = e.type == 2 ? t[$e] : d),
    d
  );
}
function yr(t, e, r, n, i) {
  let o = t.data[e];
  if (o === null) (o = Nv(t, e, r, n, i)), qg() && (o.flags |= 32);
  else if (o.type & 64) {
    (o.type = r), (o.value = n), (o.attrs = i);
    let s = Hg();
    o.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return qt(o, !0), o;
}
function Nv(t, e, r, n, i) {
  let o = ud(),
    s = xa(),
    a = s ? o : o && o.parent,
    u = (t.data[e] = Lv(t, a, r, e, n, i));
  return (
    t.firstChild === null && (t.firstChild = u),
    o !== null &&
      (s
        ? o.child == null && u.parent !== null && (o.child = u)
        : o.next === null && ((o.next = u), (u.prev = o))),
    u
  );
}
function rf(t, e, r, n) {
  if (r === 0) return -1;
  let i = e.length;
  for (let o = 0; o < r; o++) e.push(n), t.blueprint.push(n), t.data.push(null);
  return i;
}
function of(t, e, r, n, i) {
  let o = Zt(),
    s = n & 2;
  try {
    Bt(-1), s && e.length > Ce && tf(t, e, Ce, !1), Ye(s ? 2 : 0, i), r(n, i);
  } finally {
    Bt(o), Ye(s ? 3 : 1, i);
  }
}
function Wa(t, e, r) {
  if (ba(e)) {
    let n = ne(null);
    try {
      let i = e.directiveStart,
        o = e.directiveEnd;
      for (let s = i; s < o; s++) {
        let a = t.data[s];
        a.contentQueries && a.contentQueries(1, r[s], s);
      }
    } finally {
      ne(n);
    }
  }
}
function qa(t, e, r) {
  ad() && (Gv(t, e, r, Ue(r, e)), (r.flags & 64) === 64 && uf(t, e, r));
}
function Za(t, e, r = Ue) {
  let n = e.localNames;
  if (n !== null) {
    let i = e.index + 1;
    for (let o = 0; o < n.length; o += 2) {
      let s = n[o + 1],
        a = s === -1 ? r(e, t) : t[s];
      t[i++] = a;
    }
  }
}
function sf(t) {
  let e = t.tView;
  return e === null || e.incompleteFirstPass
    ? (t.tView = Ya(
        1,
        null,
        t.template,
        t.decls,
        t.vars,
        t.directiveDefs,
        t.pipeDefs,
        t.viewQuery,
        t.schemas,
        t.consts,
        t.id
      ))
    : e;
}
function Ya(t, e, r, n, i, o, s, a, u, c, l) {
  let d = Ce + n,
    f = d + i,
    h = Ov(d, f),
    p = typeof c == "function" ? c() : c;
  return (h[I] = {
    type: t,
    blueprint: h,
    template: r,
    queries: null,
    viewQuery: a,
    declTNode: e,
    data: h.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: f,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof o == "function" ? o() : o,
    pipeRegistry: typeof s == "function" ? s() : s,
    firstChild: null,
    schemas: u,
    consts: p,
    incompleteFirstPass: !1,
    ssrId: l,
  });
}
function Ov(t, e) {
  let r = [];
  for (let n = 0; n < e; n++) r.push(n < t ? null : On);
  return r;
}
function Rv(t, e, r, n) {
  let o = n.get(Tv, ef) || r === Je.ShadowDom,
    s = t.selectRootElement(e, o);
  return Fv(s), s;
}
function Fv(t) {
  Pv(t);
}
var Pv = () => null;
function kv(t, e, r, n) {
  let i = df(e);
  i.push(r), t.firstCreatePass && ff(t).push(n, i.length - 1);
}
function Lv(t, e, r, n, i, o) {
  let s = e ? e.injectorIndex : -1,
    a = 0;
  return (
    $g() && (a |= 128),
    {
      type: r,
      index: n,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: i,
      attrs: o,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: e,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function Dl(t, e, r, n, i) {
  for (let o in e) {
    if (!e.hasOwnProperty(o)) continue;
    let s = e[o];
    if (s === void 0) continue;
    n ??= {};
    let a,
      u = De.None;
    Array.isArray(s) ? ((a = s[0]), (u = s[1])) : (a = s);
    let c = o;
    if (i !== null) {
      if (!i.hasOwnProperty(o)) continue;
      c = i[o];
    }
    t === 0 ? Cl(n, r, c, a, u) : Cl(n, r, c, a);
  }
  return n;
}
function Cl(t, e, r, n, i) {
  let o;
  t.hasOwnProperty(r) ? (o = t[r]).push(e, n) : (o = t[r] = [e, n]),
    i !== void 0 && o.push(i);
}
function Vv(t, e, r) {
  let n = e.directiveStart,
    i = e.directiveEnd,
    o = t.data,
    s = e.attrs,
    a = [],
    u = null,
    c = null;
  for (let l = n; l < i; l++) {
    let d = o[l],
      f = r ? r.get(d) : null,
      h = f ? f.inputs : null,
      p = f ? f.outputs : null;
    (u = Dl(0, d.inputs, l, u, h)), (c = Dl(1, d.outputs, l, c, p));
    let x = u !== null && s !== null && !zl(e) ? Xv(u, l, s) : null;
    a.push(x);
  }
  u !== null &&
    (u.hasOwnProperty("class") && (e.flags |= 8),
    u.hasOwnProperty("style") && (e.flags |= 16)),
    (e.initialInputs = a),
    (e.inputs = u),
    (e.outputs = c);
}
function jv(t) {
  return t === "class"
    ? "className"
    : t === "for"
    ? "htmlFor"
    : t === "formaction"
    ? "formAction"
    : t === "innerHtml"
    ? "innerHTML"
    : t === "readonly"
    ? "readOnly"
    : t === "tabindex"
    ? "tabIndex"
    : t;
}
function $v(t, e, r, n, i, o, s, a) {
  let u = Ue(e, r),
    c = e.inputs,
    l;
  !a && c != null && (l = c[n])
    ? (Ka(t, r, l, n, i), Zi(e) && Bv(r, e.index))
    : e.type & 3
    ? ((n = jv(n)),
      (i = s != null ? s(i, e.value || "", n) : i),
      o.setProperty(u, n, i))
    : e.type & 12;
}
function Bv(t, e) {
  let r = bt(e, t);
  r[D] & 16 || (r[D] |= 64);
}
function Qa(t, e, r, n) {
  if (ad()) {
    let i = n === null ? null : { "": -1 },
      o = Wv(t, r),
      s,
      a;
    o === null ? (s = a = null) : ([s, a] = o),
      s !== null && af(t, e, r, s, i, a),
      i && qv(r, n, i);
  }
  r.mergedAttrs = er(r.mergedAttrs, r.attrs);
}
function af(t, e, r, n, i, o) {
  for (let c = 0; c < n.length; c++) Rs(Oi(r, e), t, n[c].type);
  Yv(r, t.data.length, n.length);
  for (let c = 0; c < n.length; c++) {
    let l = n[c];
    l.providersResolver && l.providersResolver(l);
  }
  let s = !1,
    a = !1,
    u = rf(t, e, n.length, null);
  for (let c = 0; c < n.length; c++) {
    let l = n[c];
    (r.mergedAttrs = er(r.mergedAttrs, l.hostAttrs)),
      Qv(t, r, e, u, l),
      Zv(u, l, i),
      l.contentQueries !== null && (r.flags |= 4),
      (l.hostBindings !== null || l.hostAttrs !== null || l.hostVars !== 0) &&
        (r.flags |= 64);
    let d = l.type.prototype;
    !s &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((t.preOrderHooks ??= []).push(r.index), (s = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((t.preOrderCheckHooks ??= []).push(r.index), (a = !0)),
      u++;
  }
  Vv(t, r, o);
}
function Uv(t, e, r, n, i) {
  let o = i.hostBindings;
  if (o) {
    let s = t.hostBindingOpCodes;
    s === null && (s = t.hostBindingOpCodes = []);
    let a = ~e.index;
    Hv(s) != a && s.push(a), s.push(r, n, o);
  }
}
function Hv(t) {
  let e = t.length;
  for (; e > 0; ) {
    let r = t[--e];
    if (typeof r == "number" && r < 0) return r;
  }
  return 0;
}
function Gv(t, e, r, n) {
  let i = r.directiveStart,
    o = r.directiveEnd;
  Zi(r) && Kv(e, r, t.data[i + r.componentOffset]),
    t.firstCreatePass || Oi(r, e),
    wt(n, e);
  let s = r.initialInputs;
  for (let a = i; a < o; a++) {
    let u = t.data[a],
      c = Ht(e, t, a, r);
    if ((wt(c, e), s !== null && Jv(e, a - i, c, u, r, s), Ct(u))) {
      let l = bt(r.index, e);
      l[ae] = Ht(e, t, a, r);
    }
  }
}
function uf(t, e, r) {
  let n = r.directiveStart,
    i = r.directiveEnd,
    o = r.index,
    s = Yg();
  try {
    Bt(o);
    for (let a = n; a < i; a++) {
      let u = t.data[a],
        c = e[a];
      Ns(a),
        (u.hostBindings !== null || u.hostVars !== 0 || u.hostAttrs !== null) &&
          zv(u, c);
    }
  } finally {
    Bt(-1), Ns(s);
  }
}
function zv(t, e) {
  t.hostBindings !== null && t.hostBindings(1, e);
}
function Wv(t, e) {
  let r = t.directiveRegistry,
    n = null,
    i = null;
  if (r)
    for (let o = 0; o < r.length; o++) {
      let s = r[o];
      if (pg(e, s.selectors, !1))
        if ((n || (n = []), Ct(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = [];
            (i = i || new Map()),
              s.findHostDirectiveDefs(s, a, i),
              n.unshift(...a, s);
            let u = a.length;
            Zs(t, e, u);
          } else n.unshift(s), Zs(t, e, 0);
        else
          (i = i || new Map()), s.findHostDirectiveDefs?.(s, n, i), n.push(s);
    }
  return n === null ? null : [n, i];
}
function Zs(t, e, r) {
  (e.componentOffset = r), (t.components ??= []).push(e.index);
}
function qv(t, e, r) {
  if (e) {
    let n = (t.localNames = []);
    for (let i = 0; i < e.length; i += 2) {
      let o = r[e[i + 1]];
      if (o == null) throw new y(-301, !1);
      n.push(e[i], o);
    }
  }
}
function Zv(t, e, r) {
  if (r) {
    if (e.exportAs)
      for (let n = 0; n < e.exportAs.length; n++) r[e.exportAs[n]] = t;
    Ct(e) && (r[""] = t);
  }
}
function Yv(t, e, r) {
  (t.flags |= 1),
    (t.directiveStart = e),
    (t.directiveEnd = e + r),
    (t.providerIndexes = e);
}
function Qv(t, e, r, n, i) {
  t.data[n] = i;
  let o = i.factory || (i.factory = In(i.type, !0)),
    s = new Ut(o, Ct(i), W);
  (t.blueprint[n] = s), (r[n] = s), Uv(t, e, n, rf(t, r, i.hostVars, On), i);
}
function Kv(t, e, r) {
  let n = Ue(e, t),
    i = sf(r),
    o = t[Dt].rendererFactory,
    s = 16;
  r.signals ? (s = 4096) : r.onPush && (s = 64);
  let a = ao(
    t,
    so(t, i, null, s, n, e, null, o.createRenderer(n, r), null, null, null)
  );
  t[e.index] = a;
}
function Jv(t, e, r, n, i, o) {
  let s = o[e];
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let u = s[a++],
        c = s[a++],
        l = s[a++],
        d = s[a++];
      nf(n, r, u, c, l, d);
    }
}
function Xv(t, e, r) {
  let n = null,
    i = 0;
  for (; i < r.length; ) {
    let o = r[i];
    if (o === 0) {
      i += 4;
      continue;
    } else if (o === 5) {
      i += 2;
      continue;
    }
    if (typeof o == "number") break;
    if (t.hasOwnProperty(o)) {
      n === null && (n = []);
      let s = t[o];
      for (let a = 0; a < s.length; a += 3)
        if (s[a] === e) {
          n.push(o, s[a + 1], s[a + 2], r[i + 1]);
          break;
        }
    }
    i += 2;
  }
  return n;
}
function cf(t, e, r, n) {
  return [t, !0, 0, e, null, n, null, r, null, null];
}
function lf(t, e) {
  let r = t.contentQueries;
  if (r !== null) {
    let n = ne(null);
    try {
      for (let i = 0; i < r.length; i += 2) {
        let o = r[i],
          s = r[i + 1];
        if (s !== -1) {
          let a = t.data[s];
          Ta(o), a.contentQueries(2, e[s], s);
        }
      }
    } finally {
      ne(n);
    }
  }
}
function ao(t, e) {
  return t[rr] ? (t[al][je] = e) : (t[rr] = e), (t[al] = e), e;
}
function Ys(t, e, r) {
  Ta(0);
  let n = ne(null);
  try {
    e(t, r);
  } finally {
    ne(n);
  }
}
function df(t) {
  return t[nr] || (t[nr] = []);
}
function ff(t) {
  return t.cleanup || (t.cleanup = []);
}
function hf(t, e) {
  let r = t[wn],
    n = r ? r.get(ct, null) : null;
  n && n.handleError(e);
}
function Ka(t, e, r, n, i) {
  for (let o = 0; o < r.length; ) {
    let s = r[o++],
      a = r[o++],
      u = r[o++],
      c = e[s],
      l = t.data[s];
    nf(l, c, n, a, u, i);
  }
}
function ey(t, e, r) {
  let n = id(e, t);
  Gm(t[oe], n, r);
}
var ty = 100;
function ny(t, e = !0) {
  let r = t[Dt],
    n = r.rendererFactory,
    i = !1;
  i || n.begin?.();
  try {
    ry(t);
  } catch (o) {
    throw (e && hf(t, o), o);
  } finally {
    i || (n.end?.(), r.inlineEffectRunner?.flush());
  }
}
function ry(t) {
  Qs(t, 0);
  let e = 0;
  for (; sd(t); ) {
    if (e === ty) throw new y(103, !1);
    e++, Qs(t, 1);
  }
}
function iy(t, e, r, n) {
  let i = e[D];
  if ((i & 256) === 256) return;
  let o = !1;
  !o && e[Dt].inlineEffectRunner?.flush(), Aa(e);
  let s = null,
    a = null;
  !o && oy(t) && ((a = Ev(e)), (s = Ic(a)));
  try {
    od(e), zg(t.bindingStartIndex), r !== null && of(t, e, r, 2, n);
    let u = (i & 3) === 3;
    if (!o)
      if (u) {
        let d = t.preOrderCheckHooks;
        d !== null && wi(e, d, null);
      } else {
        let d = t.preOrderHooks;
        d !== null && _i(e, d, 0, null), ls(e, 0);
      }
    if ((sy(e), pf(e, 0), t.contentQueries !== null && lf(t, e), !o))
      if (u) {
        let d = t.contentCheckHooks;
        d !== null && wi(e, d);
      } else {
        let d = t.contentHooks;
        d !== null && _i(e, d, 1), ls(e, 1);
      }
    Av(t, e);
    let c = t.components;
    c !== null && mf(e, c, 0);
    let l = t.viewQuery;
    if ((l !== null && Ys(2, l, n), !o))
      if (u) {
        let d = t.viewCheckHooks;
        d !== null && wi(e, d);
      } else {
        let d = t.viewHooks;
        d !== null && _i(e, d, 2), ls(e, 2);
      }
    if ((t.firstUpdatePass === !0 && (t.firstUpdatePass = !1), e[cs])) {
      for (let d of e[cs]) d();
      e[cs] = null;
    }
    o || (e[D] &= -73);
  } catch (u) {
    throw (ir(e), u);
  } finally {
    a !== null && (Ec(a, s), Mv(a)), Na();
  }
}
function oy(t) {
  return t.type !== 2;
}
function pf(t, e) {
  for (let r = Qd(t); r !== null; r = Kd(r))
    for (let n = ue; n < r.length; n++) {
      let i = r[n];
      gf(i, e);
    }
}
function sy(t) {
  for (let e = Qd(t); e !== null; e = Kd(e)) {
    if (!(e[D] & Ea.HasTransplantedViews)) continue;
    let r = e[_n];
    for (let n = 0; n < r.length; n++) {
      let i = r[n],
        o = i[ie];
      Fg(i);
    }
  }
}
function ay(t, e, r) {
  let n = bt(e, t);
  gf(n, r);
}
function gf(t, e) {
  Sa(t) && Qs(t, e);
}
function Qs(t, e) {
  let n = t[I],
    i = t[D],
    o = t[jt],
    s = !!(e === 0 && i & 16);
  if (
    ((s ||= !!(i & 64 && e === 0)),
    (s ||= !!(i & 1024)),
    (s ||= !!(o?.dirty && Ho(o))),
    o && (o.dirty = !1),
    (t[D] &= -9217),
    s)
  )
    iy(n, t, n.template, t[ae]);
  else if (i & 8192) {
    pf(t, 1);
    let a = n.components;
    a !== null && mf(t, a, 1);
  }
}
function mf(t, e, r) {
  for (let n = 0; n < e.length; n++) ay(t, e[n], r);
}
function Ja(t) {
  for (t[Dt].changeDetectionScheduler?.notify(); t; ) {
    t[D] |= 64;
    let e = or(t);
    if (Ig(t) && !e) return t;
    t = e;
  }
  return null;
}
var Gt = class {
    get rootNodes() {
      let e = this._lView,
        r = e[I];
      return Vi(r, e, r.firstChild, []);
    }
    constructor(e, r, n = !0) {
      (this._lView = e),
        (this._cdRefInjectingView = r),
        (this.notifyErrorHandler = n),
        (this._appRef = null),
        (this._attachedToViewContainer = !1);
    }
    get context() {
      return this._lView[ae];
    }
    set context(e) {
      this._lView[ae] = e;
    }
    get destroyed() {
      return (this._lView[D] & 256) === 256;
    }
    destroy() {
      if (this._appRef) this._appRef.detachView(this);
      else if (this._attachedToViewContainer) {
        let e = this._lView[ie];
        if (dt(e)) {
          let r = e[Ti],
            n = r ? r.indexOf(this) : -1;
          n > -1 && (ar(e, n), Ri(r, n));
        }
        this._attachedToViewContainer = !1;
      }
      no(this._lView[I], this._lView);
    }
    onDestroy(e) {
      kg(this._lView, e);
    }
    markForCheck() {
      Ja(this._cdRefInjectingView || this._lView);
    }
    detach() {
      this._lView[D] &= -129;
    }
    reattach() {
      As(this._lView), (this._lView[D] |= 128);
    }
    detectChanges() {
      (this._lView[D] |= 1024), ny(this._lView, this.notifyErrorHandler);
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
      if (this._appRef) throw new y(902, !1);
      this._attachedToViewContainer = !0;
    }
    detachFromAppRef() {
      (this._appRef = null), Ud(this._lView[I], this._lView);
    }
    attachToAppRef(e) {
      if (this._attachedToViewContainer) throw new y(902, !1);
      (this._appRef = e), As(this._lView);
    }
  },
  Rn = (() => {
    let e = class e {};
    e.__NG_ELEMENT_ID__ = uy;
    let t = e;
    return t;
  })();
function uy(t) {
  return cy(we(), G(), (t & 16) === 16);
}
function cy(t, e, r) {
  if (Zi(t) && !r) {
    let n = bt(t.index, e);
    return new Gt(n, n);
  } else if (t.type & 47) {
    let n = e[$e];
    return new Gt(n, e);
  }
  return null;
}
var wl = new Set();
function uo(t) {
  wl.has(t) ||
    (wl.add(t),
    performance?.mark?.("mark_feature_usage", { detail: { feature: t } }));
}
var Ks = class extends ye {
  constructor(e = !1) {
    super(), (this.__isAsync = e);
  }
  emit(e) {
    super.next(e);
  }
  subscribe(e, r, n) {
    let i = e,
      o = r || (() => null),
      s = n;
    if (e && typeof e == "object") {
      let u = e;
      (i = u.next?.bind(u)), (o = u.error?.bind(u)), (s = u.complete?.bind(u));
    }
    this.__isAsync && ((o = vs(o)), i && (i = vs(i)), s && (s = vs(s)));
    let a = super.subscribe({ next: i, error: o, complete: s });
    return e instanceof X && e.add(a), a;
  }
};
function vs(t) {
  return (e) => {
    setTimeout(t, void 0, e);
  };
}
var U = Ks;
function _l(...t) {}
function ly() {
  let t = typeof Qn.requestAnimationFrame == "function",
    e = Qn[t ? "requestAnimationFrame" : "setTimeout"],
    r = Qn[t ? "cancelAnimationFrame" : "clearTimeout"];
  if (typeof Zone < "u" && e && r) {
    let n = e[Zone.__symbol__("OriginalDelegate")];
    n && (e = n);
    let i = r[Zone.__symbol__("OriginalDelegate")];
    i && (r = i);
  }
  return { nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: r };
}
var J = class t {
    constructor({
      enableLongStackTrace: e = !1,
      shouldCoalesceEventChangeDetection: r = !1,
      shouldCoalesceRunChangeDetection: n = !1,
    }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new U(!1)),
        (this.onMicrotaskEmpty = new U(!1)),
        (this.onStable = new U(!1)),
        (this.onError = new U(!1)),
        typeof Zone > "u")
      )
        throw new y(908, !1);
      Zone.assertZonePatched();
      let i = this;
      (i._nesting = 0),
        (i._outer = i._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
        e &&
          Zone.longStackTraceZoneSpec &&
          (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
        (i.shouldCoalesceEventChangeDetection = !n && r),
        (i.shouldCoalesceRunChangeDetection = n),
        (i.lastRequestAnimationFrameId = -1),
        (i.nativeRequestAnimationFrame = ly().nativeRequestAnimationFrame),
        hy(i);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get("isAngularZone") === !0;
    }
    static assertInAngularZone() {
      if (!t.isInAngularZone()) throw new y(909, !1);
    }
    static assertNotInAngularZone() {
      if (t.isInAngularZone()) throw new y(909, !1);
    }
    run(e, r, n) {
      return this._inner.run(e, r, n);
    }
    runTask(e, r, n, i) {
      let o = this._inner,
        s = o.scheduleEventTask("NgZoneEvent: " + i, e, dy, _l, _l);
      try {
        return o.runTask(s, r, n);
      } finally {
        o.cancelTask(s);
      }
    }
    runGuarded(e, r, n) {
      return this._inner.runGuarded(e, r, n);
    }
    runOutsideAngular(e) {
      return this._outer.run(e);
    }
  },
  dy = {};
function Xa(t) {
  if (t._nesting == 0 && !t.hasPendingMicrotasks && !t.isStable)
    try {
      t._nesting++, t.onMicrotaskEmpty.emit(null);
    } finally {
      if ((t._nesting--, !t.hasPendingMicrotasks))
        try {
          t.runOutsideAngular(() => t.onStable.emit(null));
        } finally {
          t.isStable = !0;
        }
    }
}
function fy(t) {
  t.isCheckStableRunning ||
    t.lastRequestAnimationFrameId !== -1 ||
    ((t.lastRequestAnimationFrameId = t.nativeRequestAnimationFrame.call(
      Qn,
      () => {
        t.fakeTopEventTask ||
          (t.fakeTopEventTask = Zone.root.scheduleEventTask(
            "fakeTopEventTask",
            () => {
              (t.lastRequestAnimationFrameId = -1),
                Js(t),
                (t.isCheckStableRunning = !0),
                Xa(t),
                (t.isCheckStableRunning = !1);
            },
            void 0,
            () => {},
            () => {}
          )),
          t.fakeTopEventTask.invoke();
      }
    )),
    Js(t));
}
function hy(t) {
  let e = () => {
    fy(t);
  };
  t._inner = t._inner.fork({
    name: "angular",
    properties: { isAngularZone: !0 },
    onInvokeTask: (r, n, i, o, s, a) => {
      if (py(a)) return r.invokeTask(i, o, s, a);
      try {
        return Il(t), r.invokeTask(i, o, s, a);
      } finally {
        ((t.shouldCoalesceEventChangeDetection && o.type === "eventTask") ||
          t.shouldCoalesceRunChangeDetection) &&
          e(),
          El(t);
      }
    },
    onInvoke: (r, n, i, o, s, a, u) => {
      try {
        return Il(t), r.invoke(i, o, s, a, u);
      } finally {
        t.shouldCoalesceRunChangeDetection && e(), El(t);
      }
    },
    onHasTask: (r, n, i, o) => {
      r.hasTask(i, o),
        n === i &&
          (o.change == "microTask"
            ? ((t._hasPendingMicrotasks = o.microTask), Js(t), Xa(t))
            : o.change == "macroTask" &&
              (t.hasPendingMacrotasks = o.macroTask));
    },
    onHandleError: (r, n, i, o) => (
      r.handleError(i, o), t.runOutsideAngular(() => t.onError.emit(o)), !1
    ),
  });
}
function Js(t) {
  t._hasPendingMicrotasks ||
  ((t.shouldCoalesceEventChangeDetection ||
    t.shouldCoalesceRunChangeDetection) &&
    t.lastRequestAnimationFrameId !== -1)
    ? (t.hasPendingMicrotasks = !0)
    : (t.hasPendingMicrotasks = !1);
}
function Il(t) {
  t._nesting++, t.isStable && ((t.isStable = !1), t.onUnstable.emit(null));
}
function El(t) {
  t._nesting--, Xa(t);
}
function py(t) {
  return !Array.isArray(t) || t.length !== 1
    ? !1
    : t[0].data?.__ignore_ng_zone__ === !0;
}
var vf = (() => {
  let e = class e {
    constructor() {
      (this.handler = null), (this.internalCallbacks = []);
    }
    execute() {
      let n = [...this.internalCallbacks];
      this.internalCallbacks.length = 0;
      for (let o of n) o();
      return !!this.handler?.execute() || n.length > 0;
    }
    ngOnDestroy() {
      this.handler?.destroy(),
        (this.handler = null),
        (this.internalCallbacks.length = 0);
    }
  };
  e.ɵprov = w({ token: e, providedIn: "root", factory: () => new e() });
  let t = e;
  return t;
})();
function gy(t, e) {
  let r = bt(e, t),
    n = r[I];
  my(n, r);
  let i = r[lt];
  i !== null && r[tr] === null && (r[tr] = Ga(i, r[wn])), eu(n, r, r[ae]);
}
function my(t, e) {
  for (let r = e.length; r < t.blueprint.length; r++) e.push(t.blueprint[r]);
}
function eu(t, e, r) {
  Aa(e);
  try {
    let n = t.viewQuery;
    n !== null && Ys(1, n, r);
    let i = t.template;
    i !== null && of(t, e, i, 1, r),
      t.firstCreatePass && (t.firstCreatePass = !1),
      t.staticContentQueries && lf(t, e),
      t.staticViewQueries && Ys(2, t.viewQuery, r);
    let o = t.components;
    o !== null && vy(e, o);
  } catch (n) {
    throw (
      (t.firstCreatePass &&
        ((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)),
      n)
    );
  } finally {
    (e[D] &= -5), Na();
  }
}
function vy(t, e) {
  for (let r = 0; r < e.length; r++) gy(t, e[r]);
}
function ji(t, e, r) {
  let n = r ? t.styles : null,
    i = r ? t.classes : null,
    o = 0;
  if (e !== null)
    for (let s = 0; s < e.length; s++) {
      let a = e[s];
      if (typeof a == "number") o = a;
      else if (o == 1) i = Kc(i, a);
      else if (o == 2) {
        let u = a,
          c = e[++s];
        n = Kc(n, u + ": " + c + ";");
      }
    }
  r ? (t.styles = n) : (t.stylesWithoutHost = n),
    r ? (t.classes = i) : (t.classesWithoutHost = i);
}
var $i = class extends oo {
  constructor(e) {
    super(), (this.ngModule = e);
  }
  resolveComponentFactory(e) {
    let r = Vt(e);
    return new cr(r, this.ngModule);
  }
};
function bl(t) {
  let e = [];
  for (let r in t) {
    if (!t.hasOwnProperty(r)) continue;
    let n = t[r];
    n !== void 0 &&
      e.push({ propName: Array.isArray(n) ? n[0] : n, templateName: r });
  }
  return e;
}
function yy(t) {
  let e = t.toLowerCase();
  return e === "svg" ? Sg : e === "math" ? xg : null;
}
var Xs = class {
    constructor(e, r) {
      (this.injector = e), (this.parentInjector = r);
    }
    get(e, r, n) {
      n = Wi(n);
      let i = this.injector.get(e, gs, n);
      return i !== gs || r === gs ? i : this.parentInjector.get(e, r, n);
    }
  },
  cr = class extends ki {
    get inputs() {
      let e = this.componentDef,
        r = e.inputTransforms,
        n = bl(e.inputs);
      if (r !== null)
        for (let i of n)
          r.hasOwnProperty(i.propName) && (i.transform = r[i.propName]);
      return n;
    }
    get outputs() {
      return bl(this.componentDef.outputs);
    }
    constructor(e, r) {
      super(),
        (this.componentDef = e),
        (this.ngModule = r),
        (this.componentType = e.type),
        (this.selector = yg(e.selectors)),
        (this.ngContentSelectors = e.ngContentSelectors
          ? e.ngContentSelectors
          : []),
        (this.isBoundToModule = !!r);
    }
    create(e, r, n, i) {
      i = i || this.ngModule;
      let o = i instanceof xe ? i : i?.injector;
      o &&
        this.componentDef.getStandaloneInjector !== null &&
        (o = this.componentDef.getStandaloneInjector(o) || o);
      let s = o ? new Xs(e, o) : e,
        a = s.get(ur, null);
      if (a === null) throw new y(407, !1);
      let u = s.get(Dv, null),
        c = s.get(vf, null),
        l = s.get(Bs, null),
        d = {
          rendererFactory: a,
          sanitizer: u,
          inlineEffectRunner: null,
          afterRenderEventManager: c,
          changeDetectionScheduler: l,
        },
        f = a.createRenderer(null, this.componentDef),
        h = this.componentDef.selectors[0][0] || "div",
        p = n ? Rv(f, n, this.componentDef.encapsulation, s) : Bd(f, h, yy(h)),
        x = 512;
      this.componentDef.signals
        ? (x |= 4096)
        : this.componentDef.onPush || (x |= 16);
      let B = null;
      p !== null && (B = Ga(p, s, !0));
      let P = Ya(0, null, null, 1, 0, null, null, null, null, null, null),
        me = so(null, P, null, x, null, null, d, f, s, null, B);
      Aa(me);
      let it, Fe;
      try {
        let qe = this.componentDef,
          ot,
          Bo = null;
        qe.findHostDirectiveDefs
          ? ((ot = []),
            (Bo = new Map()),
            qe.findHostDirectiveDefs(qe, ot, Bo),
            ot.push(qe))
          : (ot = [qe]);
        let up = Dy(me, p),
          cp = Cy(up, p, qe, ot, me, d, f);
        (Fe = Ma(P, Ce)),
          p && Iy(f, qe, p, n),
          r !== void 0 && Ey(Fe, this.ngContentSelectors, r),
          (it = _y(cp, qe, ot, Bo, me, [by])),
          eu(P, me, null);
      } finally {
        Na();
      }
      return new ea(this.componentType, it, Nn(Fe, me), me, Fe);
    }
  },
  ea = class extends Us {
    constructor(e, r, n, i, o) {
      super(),
        (this.location = n),
        (this._rootLView = i),
        (this._tNode = o),
        (this.previousInputValues = null),
        (this.instance = r),
        (this.hostView = this.changeDetectorRef = new Gt(i, void 0, !1)),
        (this.componentType = e);
    }
    setInput(e, r) {
      let n = this._tNode.inputs,
        i;
      if (n !== null && (i = n[e])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(e) &&
            Object.is(this.previousInputValues.get(e), r))
        )
          return;
        let o = this._rootLView;
        Ka(o[I], o, i, e, r), this.previousInputValues.set(e, r);
        let s = bt(this._tNode.index, o);
        Ja(s);
      }
    }
    get injector() {
      return new Lt(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(e) {
      this.hostView.onDestroy(e);
    }
  };
function Dy(t, e) {
  let r = t[I],
    n = Ce;
  return (t[n] = e), yr(r, n, 2, "#host", null);
}
function Cy(t, e, r, n, i, o, s) {
  let a = i[I];
  wy(n, t, e, s);
  let u = null;
  e !== null && (u = Ga(e, i[wn]));
  let c = o.rendererFactory.createRenderer(e, r),
    l = 16;
  r.signals ? (l = 4096) : r.onPush && (l = 64);
  let d = so(i, sf(r), null, l, i[t.index], t, o, c, null, null, u);
  return (
    a.firstCreatePass && Zs(a, t, n.length - 1), ao(i, d), (i[t.index] = d)
  );
}
function wy(t, e, r, n) {
  for (let i of t) e.mergedAttrs = er(e.mergedAttrs, i.hostAttrs);
  e.mergedAttrs !== null &&
    (ji(e, e.mergedAttrs, !0), r !== null && qd(n, r, e));
}
function _y(t, e, r, n, i, o) {
  let s = we(),
    a = i[I],
    u = Ue(s, i);
  af(a, i, s, r, null, n);
  for (let l = 0; l < r.length; l++) {
    let d = s.directiveStart + l,
      f = Ht(i, a, d, s);
    wt(f, i);
  }
  uf(a, i, s), u && wt(u, i);
  let c = Ht(i, a, s.directiveStart + s.componentOffset, s);
  if (((t[ae] = i[ae] = c), o !== null)) for (let l of o) l(c, e);
  return Wa(a, s, t), c;
}
function Iy(t, e, r, n) {
  if (n) xs(t, r, ["ng-version", "17.1.1"]);
  else {
    let { attrs: i, classes: o } = Dg(e.selectors[0]);
    i && xs(t, r, i), o && o.length > 0 && Wd(t, r, o.join(" "));
  }
}
function Ey(t, e, r) {
  let n = (t.projection = []);
  for (let i = 0; i < e.length; i++) {
    let o = r[i];
    n.push(o != null ? Array.from(o) : null);
  }
}
function by() {
  let t = we();
  Xi(G()[I], t);
}
function My(t) {
  return Object.getPrototypeOf(t.prototype).constructor;
}
function Ae(t) {
  let e = My(t.type),
    r = !0,
    n = [t];
  for (; e; ) {
    let i;
    if (Ct(t)) i = e.ɵcmp || e.ɵdir;
    else {
      if (e.ɵcmp) throw new y(903, !1);
      i = e.ɵdir;
    }
    if (i) {
      if (r) {
        n.push(i);
        let s = t;
        (s.inputs = Di(t.inputs)),
          (s.inputTransforms = Di(t.inputTransforms)),
          (s.declaredInputs = Di(t.declaredInputs)),
          (s.outputs = Di(t.outputs));
        let a = i.hostBindings;
        a && Ny(t, a);
        let u = i.viewQuery,
          c = i.contentQueries;
        if (
          (u && Ty(t, u),
          c && Ay(t, c),
          Sy(t, i),
          Bp(t.outputs, i.outputs),
          Ct(i) && i.data.animation)
        ) {
          let l = t.data;
          l.animation = (l.animation || []).concat(i.data.animation);
        }
      }
      let o = i.features;
      if (o)
        for (let s = 0; s < o.length; s++) {
          let a = o[s];
          a && a.ngInherit && a(t), a === Ae && (r = !1);
        }
    }
    e = Object.getPrototypeOf(e);
  }
  xy(n);
}
function Sy(t, e) {
  for (let r in e.inputs) {
    if (!e.inputs.hasOwnProperty(r) || t.inputs.hasOwnProperty(r)) continue;
    let n = e.inputs[r];
    if (
      n !== void 0 &&
      ((t.inputs[r] = n),
      (t.declaredInputs[r] = e.declaredInputs[r]),
      e.inputTransforms !== null)
    ) {
      let i = Array.isArray(n) ? n[0] : n;
      if (!e.inputTransforms.hasOwnProperty(i)) continue;
      (t.inputTransforms ??= {}), (t.inputTransforms[i] = e.inputTransforms[i]);
    }
  }
}
function xy(t) {
  let e = 0,
    r = null;
  for (let n = t.length - 1; n >= 0; n--) {
    let i = t[n];
    (i.hostVars = e += i.hostVars),
      (i.hostAttrs = er(i.hostAttrs, (r = er(r, i.hostAttrs))));
  }
}
function Di(t) {
  return t === Cn ? {} : t === Se ? [] : t;
}
function Ty(t, e) {
  let r = t.viewQuery;
  r
    ? (t.viewQuery = (n, i) => {
        e(n, i), r(n, i);
      })
    : (t.viewQuery = e);
}
function Ay(t, e) {
  let r = t.contentQueries;
  r
    ? (t.contentQueries = (n, i, o) => {
        e(n, i, o), r(n, i, o);
      })
    : (t.contentQueries = e);
}
function Ny(t, e) {
  let r = t.hostBindings;
  r
    ? (t.hostBindings = (n, i) => {
        e(n, i), r(n, i);
      })
    : (t.hostBindings = e);
}
var KS = new RegExp(`^(\\d+)*(${fv}|${dv})*(.*)`);
var Oy = () => null;
function lr(t, e) {
  return Oy(t, e);
}
function co(t, e, r, n) {
  let i = e.tView,
    s = t[D] & 4096 ? 4096 : 16,
    a = so(
      t,
      i,
      r,
      s,
      null,
      e,
      null,
      null,
      null,
      n?.injector ?? null,
      n?.dehydratedView ?? null
    ),
    u = t[e.index];
  a[mr] = u;
  let c = t[Ke];
  return c !== null && (a[Ke] = c.createEmbeddedView(i)), eu(i, a, r), a;
}
function yf(t, e) {
  let r = ue + e;
  if (r < t.length) return t[r];
}
function dr(t, e) {
  return !e || e.firstChild === null || jd(t);
}
function lo(t, e, r, n = !0) {
  let i = e[I];
  if ((Ym(i, e, t, r), n)) {
    let s = js(r, t),
      a = e[oe],
      u = Ba(a, t[$t]);
    u !== null && qm(i, t[Be], a, e, u, s);
  }
  let o = e[tr];
  o !== null && o.firstChild !== null && (o.firstChild = null);
}
function Df(t, e) {
  let r = ar(t, e);
  return r !== void 0 && no(r[I], r), r;
}
var Mt = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = Ry;
  let t = e;
  return t;
})();
function Ry() {
  let t = we();
  return wf(t, G());
}
var Fy = Mt,
  Cf = class extends Fy {
    constructor(e, r, n) {
      super(),
        (this._lContainer = e),
        (this._hostTNode = r),
        (this._hostLView = n);
    }
    get element() {
      return Nn(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new Lt(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let e = Oa(this._hostTNode, this._hostLView);
      if (yd(e)) {
        let r = Ni(e, this._hostLView),
          n = Ai(e),
          i = r[I].data[n + 8];
        return new Lt(i, r);
      } else return new Lt(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(e) {
      let r = Ml(this._lContainer);
      return (r !== null && r[e]) || null;
    }
    get length() {
      return this._lContainer.length - ue;
    }
    createEmbeddedView(e, r, n) {
      let i, o;
      typeof n == "number"
        ? (i = n)
        : n != null && ((i = n.index), (o = n.injector));
      let s = lr(this._lContainer, e.ssrId),
        a = e.createEmbeddedViewImpl(r || {}, o, s);
      return this.insertImpl(a, i, dr(this._hostTNode, s)), a;
    }
    createComponent(e, r, n, i, o) {
      let s = e && !gm(e),
        a;
      if (s) a = r;
      else {
        let p = r || {};
        (a = p.index),
          (n = p.injector),
          (i = p.projectableNodes),
          (o = p.environmentInjector || p.ngModuleRef);
      }
      let u = s ? e : new cr(Vt(e)),
        c = n || this.parentInjector;
      if (!o && u.ngModule == null) {
        let x = (s ? c : this.parentInjector).get(xe, null);
        x && (o = x);
      }
      let l = Vt(u.componentType ?? {}),
        d = lr(this._lContainer, l?.id ?? null),
        f = d?.firstChild ?? null,
        h = u.create(c, i, f, o);
      return this.insertImpl(h.hostView, a, dr(this._hostTNode, d)), h;
    }
    insert(e, r) {
      return this.insertImpl(e, r, !0);
    }
    insertImpl(e, r, n) {
      let i = e._lView;
      if (Rg(i)) {
        let a = this.indexOf(e);
        if (a !== -1) this.detach(a);
        else {
          let u = i[ie],
            c = new Cf(u, u[Be], u[ie]);
          c.detach(c.indexOf(e));
        }
      }
      let o = this._adjustIndex(r),
        s = this._lContainer;
      return lo(s, i, o, n), e.attachToViewContainerRef(), xd(ys(s), o, e), e;
    }
    move(e, r) {
      return this.insert(e, r);
    }
    indexOf(e) {
      let r = Ml(this._lContainer);
      return r !== null ? r.indexOf(e) : -1;
    }
    remove(e) {
      let r = this._adjustIndex(e, -1),
        n = ar(this._lContainer, r);
      n && (Ri(ys(this._lContainer), r), no(n[I], n));
    }
    detach(e) {
      let r = this._adjustIndex(e, -1),
        n = ar(this._lContainer, r);
      return n && Ri(ys(this._lContainer), r) != null ? new Gt(n) : null;
    }
    _adjustIndex(e, r = 0) {
      return e ?? this.length + r;
    }
  };
function Ml(t) {
  return t[Ti];
}
function ys(t) {
  return t[Ti] || (t[Ti] = []);
}
function wf(t, e) {
  let r,
    n = e[t.index];
  return (
    dt(n) ? (r = n) : ((r = cf(n, e, null, t)), (e[t.index] = r), ao(e, r)),
    ky(r, e, t, n),
    new Cf(r, t, e)
  );
}
function Py(t, e) {
  let r = t[oe],
    n = r.createComment(""),
    i = Ue(e, t),
    o = Ba(r, i);
  return Pi(r, o, n, nv(r, i), !1), n;
}
var ky = jy,
  Ly = () => !1;
function Vy(t, e, r) {
  return Ly(t, e, r);
}
function jy(t, e, r, n) {
  if (t[$t]) return;
  let i;
  r.type & 8 ? (i = Xe(n)) : (i = Py(e, r)), (t[$t] = i);
}
function Dr(t, e, r) {
  let n = t[e];
  return Object.is(n, r) ? !1 : ((t[e] = r), !0);
}
function $y(t, e, r, n, i, o, s, a, u) {
  let c = e.consts,
    l = yr(e, t, 4, s || null, En(c, a));
  Qa(e, r, l, En(c, u)), Xi(e, l);
  let d = (l.tView = Ya(
    2,
    l,
    n,
    i,
    o,
    e.directiveRegistry,
    e.pipeRegistry,
    null,
    e.schemas,
    c,
    null
  ));
  return (
    e.queries !== null &&
      (e.queries.template(e, l), (d.queries = e.queries.embeddedTView(l))),
    l
  );
}
function pe(t, e, r, n, i, o, s, a) {
  let u = G(),
    c = ge(),
    l = t + Ce,
    d = c.firstCreatePass ? $y(l, c, u, e, r, n, i, o, s) : c.data[l];
  qt(d, !1);
  let f = By(c, u, d, t);
  Ki() && ro(c, u, f, d), wt(f, u);
  let h = cf(f, u, f, d);
  return (
    (u[l] = h),
    ao(u, h),
    Vy(h, d, u),
    Yi(d) && qa(c, u, d),
    s != null && Za(u, d, a),
    pe
  );
}
var By = Uy;
function Uy(t, e, r, n) {
  return Ji(!0), e[oe].createComment("");
}
function Hy(t, e, r, n) {
  return Dr(t, Qi(), r) ? e + kl(r) + n : On;
}
function Ci(t, e) {
  return (t << 17) | (e << 2);
}
function zt(t) {
  return (t >> 17) & 32767;
}
function Gy(t) {
  return (t & 2) == 2;
}
function zy(t, e) {
  return (t & 131071) | (e << 17);
}
function ta(t) {
  return t | 2;
}
function Sn(t) {
  return (t & 131068) >> 2;
}
function Ds(t, e) {
  return (t & -131069) | (e << 2);
}
function Wy(t) {
  return (t & 1) === 1;
}
function na(t) {
  return t | 1;
}
function qy(t, e, r, n, i, o) {
  let s = o ? e.classBindings : e.styleBindings,
    a = zt(s),
    u = Sn(s);
  t[n] = r;
  let c = !1,
    l;
  if (Array.isArray(r)) {
    let d = r;
    (l = d[1]), (l === null || vr(d, l) > 0) && (c = !0);
  } else l = r;
  if (i)
    if (u !== 0) {
      let f = zt(t[a + 1]);
      (t[n + 1] = Ci(f, a)),
        f !== 0 && (t[f + 1] = Ds(t[f + 1], n)),
        (t[a + 1] = zy(t[a + 1], n));
    } else
      (t[n + 1] = Ci(a, 0)), a !== 0 && (t[a + 1] = Ds(t[a + 1], n)), (a = n);
  else
    (t[n + 1] = Ci(u, 0)),
      a === 0 ? (a = n) : (t[u + 1] = Ds(t[u + 1], n)),
      (u = n);
  c && (t[n + 1] = ta(t[n + 1])),
    Sl(t, l, n, !0),
    Sl(t, l, n, !1),
    Zy(e, l, t, n, o),
    (s = Ci(a, u)),
    o ? (e.classBindings = s) : (e.styleBindings = s);
}
function Zy(t, e, r, n, i) {
  let o = i ? t.residualClasses : t.residualStyles;
  o != null &&
    typeof e == "string" &&
    vr(o, e) >= 0 &&
    (r[n + 1] = na(r[n + 1]));
}
function Sl(t, e, r, n) {
  let i = t[r + 1],
    o = e === null,
    s = n ? zt(i) : Sn(i),
    a = !1;
  for (; s !== 0 && (a === !1 || o); ) {
    let u = t[s],
      c = t[s + 1];
    Yy(u, e) && ((a = !0), (t[s + 1] = n ? na(c) : ta(c))),
      (s = n ? zt(c) : Sn(c));
  }
  a && (t[r + 1] = n ? ta(i) : na(i));
}
function Yy(t, e) {
  return t === null || e == null || (Array.isArray(t) ? t[1] : t) === e
    ? !0
    : Array.isArray(t) && typeof e == "string"
    ? vr(t, e) >= 0
    : !1;
}
function Z(t, e, r) {
  let n = G(),
    i = Qi();
  if (Dr(n, i, e)) {
    let o = ge(),
      s = Xg();
    $v(o, s, n, t, e, n[oe], r, !1);
  }
  return Z;
}
function xl(t, e, r, n, i) {
  let o = e.inputs,
    s = i ? "class" : "style";
  Ka(t, r, o[s], s, n);
}
function tu(t, e) {
  return Qy(t, e, null, !0), tu;
}
function Qy(t, e, r, n) {
  let i = G(),
    o = ge(),
    s = Wg(2);
  if ((o.firstUpdatePass && Jy(o, t, s, n), e !== On && Dr(i, s, e))) {
    let a = o.data[Zt()];
    rD(o, a, i, i[oe], t, (i[s + 1] = iD(e, r)), n, s);
  }
}
function Ky(t, e) {
  return e >= t.expandoStartIndex;
}
function Jy(t, e, r, n) {
  let i = t.data;
  if (i[r + 1] === null) {
    let o = i[Zt()],
      s = Ky(t, r);
    oD(o, n) && e === null && !s && (e = !1),
      (e = Xy(i, o, e, n)),
      qy(i, o, e, r, s, n);
  }
}
function Xy(t, e, r, n) {
  let i = Qg(t),
    o = n ? e.residualClasses : e.residualStyles;
  if (i === null)
    (n ? e.classBindings : e.styleBindings) === 0 &&
      ((r = Cs(null, t, e, r, n)), (r = fr(r, e.attrs, n)), (o = null));
  else {
    let s = e.directiveStylingLast;
    if (s === -1 || t[s] !== i)
      if (((r = Cs(i, t, e, r, n)), o === null)) {
        let u = eD(t, e, n);
        u !== void 0 &&
          Array.isArray(u) &&
          ((u = Cs(null, t, e, u[1], n)),
          (u = fr(u, e.attrs, n)),
          tD(t, e, n, u));
      } else o = nD(t, e, n);
  }
  return (
    o !== void 0 && (n ? (e.residualClasses = o) : (e.residualStyles = o)), r
  );
}
function eD(t, e, r) {
  let n = r ? e.classBindings : e.styleBindings;
  if (Sn(n) !== 0) return t[zt(n)];
}
function tD(t, e, r, n) {
  let i = r ? e.classBindings : e.styleBindings;
  t[zt(i)] = n;
}
function nD(t, e, r) {
  let n,
    i = e.directiveEnd;
  for (let o = 1 + e.directiveStylingLast; o < i; o++) {
    let s = t[o].hostAttrs;
    n = fr(n, s, r);
  }
  return fr(n, e.attrs, r);
}
function Cs(t, e, r, n, i) {
  let o = null,
    s = r.directiveEnd,
    a = r.directiveStylingLast;
  for (
    a === -1 ? (a = r.directiveStart) : a++;
    a < s && ((o = e[a]), (n = fr(n, o.hostAttrs, i)), o !== t);

  )
    a++;
  return t !== null && (r.directiveStylingLast = a), n;
}
function fr(t, e, r) {
  let n = r ? 1 : 2,
    i = -1;
  if (e !== null)
    for (let o = 0; o < e.length; o++) {
      let s = e[o];
      typeof s == "number"
        ? (i = s)
        : i === n &&
          (Array.isArray(t) || (t = t === void 0 ? [] : ["", t]),
          Dm(t, s, r ? !0 : e[++o]));
    }
  return t === void 0 ? null : t;
}
function rD(t, e, r, n, i, o, s, a) {
  if (!(e.type & 3)) return;
  let u = t.data,
    c = u[a + 1],
    l = Wy(c) ? Tl(u, e, r, i, Sn(c), s) : void 0;
  if (!Bi(l)) {
    Bi(o) || (Gy(c) && (o = Tl(u, null, r, i, a, s)));
    let d = id(Zt(), r);
    cv(n, s, d, i, o);
  }
}
function Tl(t, e, r, n, i, o) {
  let s = e === null,
    a;
  for (; i > 0; ) {
    let u = t[i],
      c = Array.isArray(u),
      l = c ? u[1] : u,
      d = l === null,
      f = r[i + 1];
    f === On && (f = d ? Se : void 0);
    let h = d ? fs(f, n) : l === n ? f : void 0;
    if ((c && !Bi(h) && (h = fs(u, n)), Bi(h) && ((a = h), s))) return a;
    let p = t[i + 1];
    i = s ? zt(p) : Sn(p);
  }
  if (e !== null) {
    let u = o ? e.residualClasses : e.residualStyles;
    u != null && (a = fs(u, n));
  }
  return a;
}
function Bi(t) {
  return t !== void 0;
}
function iD(t, e) {
  return (
    t == null ||
      t === "" ||
      (typeof e == "string"
        ? (t = t + e)
        : typeof t == "object" && (t = he(Ha(t)))),
    t
  );
}
function oD(t, e) {
  return (t.flags & (e ? 8 : 16)) !== 0;
}
var ra = class {
  destroy(e) {}
  updateValue(e, r) {}
  swap(e, r) {
    let n = Math.min(e, r),
      i = Math.max(e, r),
      o = this.detach(i);
    if (i - n > 1) {
      let s = this.detach(n);
      this.attach(n, o), this.attach(i, s);
    } else this.attach(n, o);
  }
  move(e, r) {
    this.attach(r, this.detach(e));
  }
};
function ws(t, e, r, n, i) {
  return t === r && Object.is(e, n) ? 1 : Object.is(i(t, e), i(r, n)) ? -1 : 0;
}
function sD(t, e, r) {
  let n,
    i,
    o = 0,
    s = t.length - 1;
  if (Array.isArray(e)) {
    let a = e.length - 1;
    for (; o <= s && o <= a; ) {
      let u = t.at(o),
        c = e[o],
        l = ws(o, u, o, c, r);
      if (l !== 0) {
        l < 0 && t.updateValue(o, c), o++;
        continue;
      }
      let d = t.at(s),
        f = e[a],
        h = ws(s, d, a, f, r);
      if (h !== 0) {
        h < 0 && t.updateValue(s, f), s--, a--;
        continue;
      }
      let p = r(o, u),
        x = r(s, d),
        B = r(o, c);
      if (Object.is(B, x)) {
        let P = r(a, f);
        Object.is(P, p)
          ? (t.swap(o, s), t.updateValue(s, f), a--, s--)
          : t.move(s, o),
          t.updateValue(o, c),
          o++;
        continue;
      }
      if (((n ??= new Ui()), (i ??= Nl(t, o, s, r)), ia(t, n, o, B)))
        t.updateValue(o, c), o++, s++;
      else if (i.has(B)) n.set(p, t.detach(o)), s--;
      else {
        let P = t.create(o, e[o]);
        t.attach(o, P), o++, s++;
      }
    }
    for (; o <= a; ) Al(t, n, r, o, e[o]), o++;
  } else if (e != null) {
    let a = e[Symbol.iterator](),
      u = a.next();
    for (; !u.done && o <= s; ) {
      let c = t.at(o),
        l = u.value,
        d = ws(o, c, o, l, r);
      if (d !== 0) d < 0 && t.updateValue(o, l), o++, (u = a.next());
      else {
        (n ??= new Ui()), (i ??= Nl(t, o, s, r));
        let f = r(o, l);
        if (ia(t, n, o, f)) t.updateValue(o, l), o++, s++, (u = a.next());
        else if (!i.has(f))
          t.attach(o, t.create(o, l)), o++, s++, (u = a.next());
        else {
          let h = r(o, c);
          n.set(h, t.detach(o)), s--;
        }
      }
    }
    for (; !u.done; ) Al(t, n, r, t.length, u.value), (u = a.next());
  }
  for (; o <= s; ) t.destroy(t.detach(s--));
  n?.forEach((a) => {
    t.destroy(a);
  });
}
function ia(t, e, r, n) {
  return e !== void 0 && e.has(n)
    ? (t.attach(r, e.get(n)), e.delete(n), !0)
    : !1;
}
function Al(t, e, r, n, i) {
  if (ia(t, e, n, r(n, i))) t.updateValue(n, i);
  else {
    let o = t.create(n, i);
    t.attach(n, o);
  }
}
function Nl(t, e, r, n) {
  let i = new Set();
  for (let o = e; o <= r; o++) i.add(n(o, t.at(o)));
  return i;
}
var Ui = class {
  constructor() {
    (this.kvMap = new Map()), (this._vMap = void 0);
  }
  has(e) {
    return this.kvMap.has(e);
  }
  delete(e) {
    if (!this.has(e)) return !1;
    let r = this.kvMap.get(e);
    return (
      this._vMap !== void 0 && this._vMap.has(r)
        ? (this.kvMap.set(e, this._vMap.get(r)), this._vMap.delete(r))
        : this.kvMap.delete(e),
      !0
    );
  }
  get(e) {
    return this.kvMap.get(e);
  }
  set(e, r) {
    if (this.kvMap.has(e)) {
      let n = this.kvMap.get(e);
      this._vMap === void 0 && (this._vMap = new Map());
      let i = this._vMap;
      for (; i.has(n); ) n = i.get(n);
      i.set(n, r);
    } else this.kvMap.set(e, r);
  }
  forEach(e) {
    for (let [r, n] of this.kvMap)
      if ((e(n, r), this._vMap !== void 0)) {
        let i = this._vMap;
        for (; i.has(n); ) (n = i.get(n)), e(n, r);
      }
  }
};
function St(t, e, r) {
  uo("NgControlFlow");
  let n = G(),
    i = Qi(),
    o = ua(n, Ce + t),
    s = 0;
  if (Dr(n, i, e)) {
    let a = ne(null);
    try {
      if ((Df(o, s), e !== -1)) {
        let u = ca(n[I], Ce + e),
          c = lr(o, u.tView.ssrId),
          l = co(n, u, r, { dehydratedView: c });
        lo(o, l, s, dr(u, c));
      }
    } finally {
      ne(a);
    }
  } else {
    let a = yf(o, s);
    a !== void 0 && (a[ae] = r);
  }
}
var oa = class {
  constructor(e, r, n) {
    (this.lContainer = e), (this.$implicit = r), (this.$index = n);
  }
  get $count() {
    return this.lContainer.length - ue;
  }
};
function _f(t) {
  return t;
}
var sa = class {
  constructor(e, r, n) {
    (this.hasEmptyBlock = e), (this.trackByFn = r), (this.liveCollection = n);
  }
};
function If(t, e, r, n, i, o, s, a, u, c, l, d, f) {
  uo("NgControlFlow");
  let h = u !== void 0,
    p = G(),
    x = a ? s.bind(p[$e][ae]) : s,
    B = new sa(h, x);
  (p[Ce + t] = B), pe(t + 1, e, r, n, i, o), h && pe(t + 2, u, c, l, d, f);
}
var aa = class extends ra {
  constructor(e, r, n) {
    super(),
      (this.lContainer = e),
      (this.hostLView = r),
      (this.templateTNode = n),
      (this.needsIndexUpdate = !1);
  }
  get length() {
    return this.lContainer.length - ue;
  }
  at(e) {
    return this.getLView(e)[ae].$implicit;
  }
  attach(e, r) {
    let n = r[tr];
    (this.needsIndexUpdate ||= e !== this.length),
      lo(this.lContainer, r, e, dr(this.templateTNode, n));
  }
  detach(e) {
    return (
      (this.needsIndexUpdate ||= e !== this.length - 1), aD(this.lContainer, e)
    );
  }
  create(e, r) {
    let n = lr(this.lContainer, this.templateTNode.tView.ssrId);
    return co(
      this.hostLView,
      this.templateTNode,
      new oa(this.lContainer, r, e),
      { dehydratedView: n }
    );
  }
  destroy(e) {
    no(e[I], e);
  }
  updateValue(e, r) {
    this.getLView(e)[ae].$implicit = r;
  }
  reset() {
    this.needsIndexUpdate = !1;
  }
  updateIndexes() {
    if (this.needsIndexUpdate)
      for (let e = 0; e < this.length; e++) this.getLView(e)[ae].$index = e;
  }
  getLView(e) {
    return uD(this.lContainer, e);
  }
};
function Ef(t) {
  let e = ne(null),
    r = Zt();
  try {
    let n = G(),
      i = n[I],
      o = n[r];
    if (o.liveCollection === void 0) {
      let a = r + 1,
        u = ua(n, a),
        c = ca(i, a);
      o.liveCollection = new aa(u, n, c);
    } else o.liveCollection.reset();
    let s = o.liveCollection;
    if ((sD(s, t, o.trackByFn), s.updateIndexes(), o.hasEmptyBlock)) {
      let a = Qi(),
        u = s.length === 0;
      if (Dr(n, a, u)) {
        let c = r + 2,
          l = ua(n, c);
        if (u) {
          let d = ca(i, c),
            f = lr(l, d.tView.ssrId),
            h = co(n, d, void 0, { dehydratedView: f });
          lo(l, h, 0, dr(d, f));
        } else Df(l, 0);
      }
    }
  } finally {
    ne(e);
  }
}
function ua(t, e) {
  return t[e];
}
function aD(t, e) {
  return ar(t, e);
}
function uD(t, e) {
  return yf(t, e);
}
function ca(t, e) {
  return Ma(t, e);
}
function cD(t, e, r, n, i, o) {
  let s = e.consts,
    a = En(s, i),
    u = yr(e, t, 2, n, a);
  return (
    Qa(e, r, u, En(s, o)),
    u.attrs !== null && ji(u, u.attrs, !1),
    u.mergedAttrs !== null && ji(u, u.mergedAttrs, !0),
    e.queries !== null && e.queries.elementStart(e, u),
    u
  );
}
function L(t, e, r, n) {
  let i = G(),
    o = ge(),
    s = Ce + t,
    a = i[oe],
    u = o.firstCreatePass ? cD(s, o, i, e, r, n) : o.data[s],
    c = lD(o, i, u, a, e, t);
  i[s] = c;
  let l = Yi(u);
  return (
    qt(u, !0),
    qd(a, c, u),
    (u.flags & 32) !== 32 && Ki() && ro(o, i, c, u),
    Lg() === 0 && wt(c, i),
    Vg(),
    l && (qa(o, i, u), Wa(o, u, i)),
    n !== null && Za(i, u),
    L
  );
}
function N() {
  let t = we();
  xa() ? cd() : ((t = t.parent), qt(t, !1));
  let e = t;
  Bg(e) && Ug(), jg();
  let r = ge();
  return (
    r.firstCreatePass && (Xi(r, t), ba(t) && r.queries.elementEnd(t)),
    e.classesWithoutHost != null &&
      im(e) &&
      xl(r, e, G(), e.classesWithoutHost, !0),
    e.stylesWithoutHost != null &&
      om(e) &&
      xl(r, e, G(), e.stylesWithoutHost, !1),
    N
  );
}
function ze(t, e, r, n) {
  return L(t, e, r, n), N(), ze;
}
var lD = (t, e, r, n, i, o) => (Ji(!0), Bd(n, i, em()));
function dD(t, e, r, n, i) {
  let o = e.consts,
    s = En(o, n),
    a = yr(e, t, 8, "ng-container", s);
  s !== null && ji(a, s, !0);
  let u = En(o, i);
  return Qa(e, r, a, u), e.queries !== null && e.queries.elementStart(e, a), a;
}
function nu(t, e, r) {
  let n = G(),
    i = ge(),
    o = t + Ce,
    s = i.firstCreatePass ? dD(o, i, n, e, r) : i.data[o];
  qt(s, !0);
  let a = fD(i, n, s, t);
  return (
    (n[o] = a),
    Ki() && ro(i, n, a, s),
    wt(a, n),
    Yi(s) && (qa(i, n, s), Wa(i, s, n)),
    r != null && Za(n, s),
    nu
  );
}
function ru() {
  let t = we(),
    e = ge();
  return (
    xa() ? cd() : ((t = t.parent), qt(t, !1)),
    e.firstCreatePass && (Xi(e, t), ba(t) && e.queries.elementEnd(t)),
    ru
  );
}
var fD = (t, e, r, n) => (Ji(!0), zm(e[oe], ""));
function de() {
  return G();
}
var Hi = "en-US";
var hD = Hi;
function pD(t) {
  Yp(t, "Expected localeId to be defined"),
    typeof t == "string" && (hD = t.toLowerCase().replace(/_/g, "-"));
}
function Jt(t) {
  return !!t && typeof t.then == "function";
}
function bf(t) {
  return !!t && typeof t.subscribe == "function";
}
function j(t, e, r, n) {
  let i = G(),
    o = ge(),
    s = we();
  return mD(o, i, i[oe], s, t, e, n), j;
}
function gD(t, e, r, n) {
  let i = t.cleanup;
  if (i != null)
    for (let o = 0; o < i.length - 1; o += 2) {
      let s = i[o];
      if (s === r && i[o + 1] === n) {
        let a = e[nr],
          u = i[o + 2];
        return a.length > u ? a[u] : null;
      }
      typeof s == "string" && (o += 2);
    }
  return null;
}
function mD(t, e, r, n, i, o, s) {
  let a = Yi(n),
    c = t.firstCreatePass && ff(t),
    l = e[ae],
    d = df(e),
    f = !0;
  if (n.type & 3 || s) {
    let x = Ue(n, e),
      B = s ? s(x) : x,
      P = d.length,
      me = s ? (Fe) => s(Xe(Fe[n.index])) : n.index,
      it = null;
    if ((!s && a && (it = gD(t, e, i, n.index)), it !== null)) {
      let Fe = it.__ngLastListenerFn__ || it;
      (Fe.__ngNextListenerFn__ = o), (it.__ngLastListenerFn__ = o), (f = !1);
    } else {
      o = Rl(n, e, l, o, !1);
      let Fe = r.listen(B, i, o);
      d.push(o, Fe), c && c.push(i, me, P, P + 1);
    }
  } else o = Rl(n, e, l, o, !1);
  let h = n.outputs,
    p;
  if (f && h !== null && (p = h[i])) {
    let x = p.length;
    if (x)
      for (let B = 0; B < x; B += 2) {
        let P = p[B],
          me = p[B + 1],
          qe = e[P][me].subscribe(o),
          ot = d.length;
        d.push(o, qe), c && c.push(i, n.index, ot, -(ot + 1));
      }
  }
}
function Ol(t, e, r, n) {
  try {
    return Ye(6, e, r), r(n) !== !1;
  } catch (i) {
    return hf(t, i), !1;
  } finally {
    Ye(7, e, r);
  }
}
function Rl(t, e, r, n, i) {
  return function o(s) {
    if (s === Function) return n;
    let a = t.componentOffset > -1 ? bt(t.index, e) : e;
    Ja(a);
    let u = Ol(e, r, n, s),
      c = o.__ngNextListenerFn__;
    for (; c; ) (u = Ol(e, r, c, s) && u), (c = c.__ngNextListenerFn__);
    return i && u === !1 && s.preventDefault(), u;
  };
}
function v(t = 1) {
  return Jg(t);
}
function vD() {
  return this._results[Symbol.iterator]();
}
var la = class t {
    get changes() {
      return (this._changes ??= new U());
    }
    constructor(e = !1) {
      (this._emitDistinctChangesOnly = e),
        (this.dirty = !0),
        (this._results = []),
        (this._changesDetected = !1),
        (this._changes = void 0),
        (this.length = 0),
        (this.first = void 0),
        (this.last = void 0);
      let r = t.prototype;
      r[Symbol.iterator] || (r[Symbol.iterator] = vD);
    }
    get(e) {
      return this._results[e];
    }
    map(e) {
      return this._results.map(e);
    }
    filter(e) {
      return this._results.filter(e);
    }
    find(e) {
      return this._results.find(e);
    }
    reduce(e, r) {
      return this._results.reduce(e, r);
    }
    forEach(e) {
      this._results.forEach(e);
    }
    some(e) {
      return this._results.some(e);
    }
    toArray() {
      return this._results.slice();
    }
    toString() {
      return this._results.toString();
    }
    reset(e, r) {
      this.dirty = !1;
      let n = vm(e);
      (this._changesDetected = !mm(this._results, n, r)) &&
        ((this._results = n),
        (this.length = n.length),
        (this.last = n[this.length - 1]),
        (this.first = n[0]));
    }
    notifyOnChanges() {
      this._changes !== void 0 &&
        (this._changesDetected || !this._emitDistinctChangesOnly) &&
        this._changes.emit(this);
    }
    setDirty() {
      this.dirty = !0;
    }
    destroy() {
      this._changes !== void 0 &&
        (this._changes.complete(), this._changes.unsubscribe());
    }
  },
  Wt = (() => {
    let e = class e {};
    e.__NG_ELEMENT_ID__ = CD;
    let t = e;
    return t;
  })(),
  yD = Wt,
  DD = class extends yD {
    constructor(e, r, n) {
      super(),
        (this._declarationLView = e),
        (this._declarationTContainer = r),
        (this.elementRef = n);
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(e, r) {
      return this.createEmbeddedViewImpl(e, r);
    }
    createEmbeddedViewImpl(e, r, n) {
      let i = co(this._declarationLView, this._declarationTContainer, e, {
        injector: r,
        dehydratedView: n,
      });
      return new Gt(i);
    }
  };
function CD() {
  return iu(we(), G());
}
function iu(t, e) {
  return t.type & 4 ? new DD(e, t, Nn(t, e)) : null;
}
var da = class t {
    constructor(e) {
      (this.queryList = e), (this.matches = null);
    }
    clone() {
      return new t(this.queryList);
    }
    setDirty() {
      this.queryList.setDirty();
    }
  },
  fa = class t {
    constructor(e = []) {
      this.queries = e;
    }
    createEmbeddedView(e) {
      let r = e.queries;
      if (r !== null) {
        let n = e.contentQueries !== null ? e.contentQueries[0] : r.length,
          i = [];
        for (let o = 0; o < n; o++) {
          let s = r.getByIndex(o),
            a = this.queries[s.indexInDeclarationView];
          i.push(a.clone());
        }
        return new t(i);
      }
      return null;
    }
    insertView(e) {
      this.dirtyQueriesWithMatches(e);
    }
    detachView(e) {
      this.dirtyQueriesWithMatches(e);
    }
    dirtyQueriesWithMatches(e) {
      for (let r = 0; r < this.queries.length; r++)
        Sf(e, r).matches !== null && this.queries[r].setDirty();
    }
  },
  ha = class {
    constructor(e, r, n = null) {
      (this.predicate = e), (this.flags = r), (this.read = n);
    }
  },
  pa = class t {
    constructor(e = []) {
      this.queries = e;
    }
    elementStart(e, r) {
      for (let n = 0; n < this.queries.length; n++)
        this.queries[n].elementStart(e, r);
    }
    elementEnd(e) {
      for (let r = 0; r < this.queries.length; r++)
        this.queries[r].elementEnd(e);
    }
    embeddedTView(e) {
      let r = null;
      for (let n = 0; n < this.length; n++) {
        let i = r !== null ? r.length : 0,
          o = this.getByIndex(n).embeddedTView(e, i);
        o &&
          ((o.indexInDeclarationView = n), r !== null ? r.push(o) : (r = [o]));
      }
      return r !== null ? new t(r) : null;
    }
    template(e, r) {
      for (let n = 0; n < this.queries.length; n++)
        this.queries[n].template(e, r);
    }
    getByIndex(e) {
      return this.queries[e];
    }
    get length() {
      return this.queries.length;
    }
    track(e) {
      this.queries.push(e);
    }
  },
  ga = class t {
    constructor(e, r = -1) {
      (this.metadata = e),
        (this.matches = null),
        (this.indexInDeclarationView = -1),
        (this.crossesNgTemplate = !1),
        (this._appliesToNextNode = !0),
        (this._declarationNodeIndex = r);
    }
    elementStart(e, r) {
      this.isApplyingToNode(r) && this.matchTNode(e, r);
    }
    elementEnd(e) {
      this._declarationNodeIndex === e.index && (this._appliesToNextNode = !1);
    }
    template(e, r) {
      this.elementStart(e, r);
    }
    embeddedTView(e, r) {
      return this.isApplyingToNode(e)
        ? ((this.crossesNgTemplate = !0),
          this.addMatch(-e.index, r),
          new t(this.metadata))
        : null;
    }
    isApplyingToNode(e) {
      if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
        let r = this._declarationNodeIndex,
          n = e.parent;
        for (; n !== null && n.type & 8 && n.index !== r; ) n = n.parent;
        return r === (n !== null ? n.index : -1);
      }
      return this._appliesToNextNode;
    }
    matchTNode(e, r) {
      let n = this.metadata.predicate;
      if (Array.isArray(n))
        for (let i = 0; i < n.length; i++) {
          let o = n[i];
          this.matchTNodeWithReadOption(e, r, wD(r, o)),
            this.matchTNodeWithReadOption(e, r, Ii(r, e, o, !1, !1));
        }
      else
        n === Wt
          ? r.type & 4 && this.matchTNodeWithReadOption(e, r, -1)
          : this.matchTNodeWithReadOption(e, r, Ii(r, e, n, !1, !1));
    }
    matchTNodeWithReadOption(e, r, n) {
      if (n !== null) {
        let i = this.metadata.read;
        if (i !== null)
          if (i === Ge || i === Mt || (i === Wt && r.type & 4))
            this.addMatch(r.index, -2);
          else {
            let o = Ii(r, e, i, !1, !1);
            o !== null && this.addMatch(r.index, o);
          }
        else this.addMatch(r.index, n);
      }
    }
    addMatch(e, r) {
      this.matches === null ? (this.matches = [e, r]) : this.matches.push(e, r);
    }
  };
function wD(t, e) {
  let r = t.localNames;
  if (r !== null) {
    for (let n = 0; n < r.length; n += 2) if (r[n] === e) return r[n + 1];
  }
  return null;
}
function _D(t, e) {
  return t.type & 11 ? Nn(t, e) : t.type & 4 ? iu(t, e) : null;
}
function ID(t, e, r, n) {
  return r === -1 ? _D(e, t) : r === -2 ? ED(t, e, n) : Ht(t, t[I], r, e);
}
function ED(t, e, r) {
  if (r === Ge) return Nn(e, t);
  if (r === Wt) return iu(e, t);
  if (r === Mt) return wf(e, t);
}
function Mf(t, e, r, n) {
  let i = e[Ke].queries[n];
  if (i.matches === null) {
    let o = t.data,
      s = r.matches,
      a = [];
    for (let u = 0; u < s.length; u += 2) {
      let c = s[u];
      if (c < 0) a.push(null);
      else {
        let l = o[c];
        a.push(ID(e, l, s[u + 1], r.metadata.read));
      }
    }
    i.matches = a;
  }
  return i.matches;
}
function ma(t, e, r, n) {
  let i = t.queries.getByIndex(r),
    o = i.matches;
  if (o !== null) {
    let s = Mf(t, e, i, r);
    for (let a = 0; a < o.length; a += 2) {
      let u = o[a];
      if (u > 0) n.push(s[a / 2]);
      else {
        let c = o[a + 1],
          l = e[-u];
        for (let d = ue; d < l.length; d++) {
          let f = l[d];
          f[mr] === f[ie] && ma(f[I], f, c, n);
        }
        if (l[_n] !== null) {
          let d = l[_n];
          for (let f = 0; f < d.length; f++) {
            let h = d[f];
            ma(h[I], h, c, n);
          }
        }
      }
    }
  }
  return n;
}
function bD(t, e) {
  return t[Ke].queries[e].queryList;
}
function MD(t, e, r) {
  let n = new la((r & 4) === 4);
  kv(t, e, n, n.destroy),
    e[Ke] === null && (e[Ke] = new fa()),
    e[Ke].queries.push(new da(n));
}
function SD(t, e, r) {
  t.queries === null && (t.queries = new pa()), t.queries.track(new ga(e, r));
}
function Sf(t, e) {
  return t.queries.getByIndex(e);
}
function xf(t, e, r) {
  let n = ge();
  n.firstCreatePass &&
    (SD(n, new ha(t, e, r), -1), (e & 2) === 2 && (n.staticViewQueries = !0)),
    MD(n, G(), e);
}
function ou(t) {
  let e = G(),
    r = ge(),
    n = ld();
  Ta(n + 1);
  let i = Sf(r, n);
  if (t.dirty && Og(e) === ((i.metadata.flags & 2) === 2)) {
    if (i.matches === null) t.reset([]);
    else {
      let o = i.crossesNgTemplate ? ma(r, e, n, []) : Mf(r, e, i, n);
      t.reset(o, vv), t.notifyOnChanges();
    }
    return !0;
  }
  return !1;
}
function su() {
  return bD(G(), ld());
}
function _e(t) {
  let e = Gg();
  return Ng(e, Ce + t);
}
function Q(t, e = "") {
  let r = G(),
    n = ge(),
    i = t + Ce,
    o = n.firstCreatePass ? yr(n, i, 1, e, null) : n.data[i],
    s = xD(n, r, o, e, t);
  (r[i] = s), Ki() && ro(n, r, s, o), qt(o, !1);
}
var xD = (t, e, r, n, i) => (Ji(!0), Hm(e[oe], n));
function ft(t) {
  return Tf("", t, ""), ft;
}
function Tf(t, e, r) {
  let n = G(),
    i = Hy(n, t, e, r);
  return i !== On && ey(n, Zt(), i), Tf;
}
function TD(t, e, r) {
  let n = ge();
  if (n.firstCreatePass) {
    let i = Ct(t);
    va(r, n.data, n.blueprint, i, !0), va(e, n.data, n.blueprint, i, !1);
  }
}
function va(t, e, r, n, i) {
  if (((t = ce(t)), Array.isArray(t)))
    for (let o = 0; o < t.length; o++) va(t[o], e, r, n, i);
  else {
    let o = ge(),
      s = G(),
      a = we(),
      u = Mn(t) ? t : ce(t.provide),
      c = Pd(t),
      l = a.providerIndexes & 1048575,
      d = a.directiveStart,
      f = a.providerIndexes >> 20;
    if (Mn(t) || !t.multi) {
      let h = new Ut(c, i, W),
        p = Is(u, e, i ? l : l + f, d);
      p === -1
        ? (Rs(Oi(a, s), o, u),
          _s(o, t, e.length),
          e.push(u),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          r.push(h),
          s.push(h))
        : ((r[p] = h), (s[p] = h));
    } else {
      let h = Is(u, e, l + f, d),
        p = Is(u, e, l, l + f),
        x = h >= 0 && r[h],
        B = p >= 0 && r[p];
      if ((i && !B) || (!i && !x)) {
        Rs(Oi(a, s), o, u);
        let P = OD(i ? ND : AD, r.length, i, n, c);
        !i && B && (r[p].providerFactory = P),
          _s(o, t, e.length, 0),
          e.push(u),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          r.push(P),
          s.push(P);
      } else {
        let P = Af(r[i ? p : h], c, !i && n);
        _s(o, t, h > -1 ? h : p, P);
      }
      !i && n && B && r[p].componentProviders++;
    }
  }
}
function _s(t, e, r, n) {
  let i = Mn(e),
    o = bm(e);
  if (i || o) {
    let u = (o ? ce(e.useClass) : e).prototype.ngOnDestroy;
    if (u) {
      let c = t.destroyHooks || (t.destroyHooks = []);
      if (!i && e.multi) {
        let l = c.indexOf(r);
        l === -1 ? c.push(r, [n, u]) : c[l + 1].push(n, u);
      } else c.push(r, u);
    }
  }
}
function Af(t, e, r) {
  return r && t.componentProviders++, t.multi.push(e) - 1;
}
function Is(t, e, r, n) {
  for (let i = r; i < n; i++) if (e[i] === t) return i;
  return -1;
}
function AD(t, e, r, n) {
  return ya(this.multi, []);
}
function ND(t, e, r, n) {
  let i = this.multi,
    o;
  if (this.providerFactory) {
    let s = this.providerFactory.componentProviders,
      a = Ht(r, r[I], this.providerFactory.index, n);
    (o = a.slice(0, s)), ya(i, o);
    for (let u = s; u < a.length; u++) o.push(a[u]);
  } else (o = []), ya(i, o);
  return o;
}
function ya(t, e) {
  for (let r = 0; r < t.length; r++) {
    let n = t[r];
    e.push(n());
  }
  return e;
}
function OD(t, e, r, n, i) {
  let o = new Ut(t, r, W);
  return (
    (o.multi = []),
    (o.index = e),
    (o.componentProviders = 0),
    Af(o, i, n && !r),
    o
  );
}
function au(t, e = []) {
  return (r) => {
    r.providersResolver = (n, i) => TD(n, i ? i(t) : t, e);
  };
}
var _t = class {},
  hr = class {};
var Da = class extends _t {
    constructor(e, r, n) {
      super(),
        (this._parent = r),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new $i(this));
      let i = Yl(e);
      (this._bootstrapComponents = Vd(i.bootstrap)),
        (this._r3Injector = kd(
          e,
          r,
          [
            { provide: _t, useValue: this },
            { provide: oo, useValue: this.componentFactoryResolver },
            ...n,
          ],
          he(e),
          new Set(["environment"])
        )),
        this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(e));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let e = this._r3Injector;
      !e.destroyed && e.destroy(),
        this.destroyCbs.forEach((r) => r()),
        (this.destroyCbs = null);
    }
    onDestroy(e) {
      this.destroyCbs.push(e);
    }
  },
  Ca = class extends hr {
    constructor(e) {
      super(), (this.moduleType = e);
    }
    create(e) {
      return new Da(this.moduleType, e, []);
    }
  };
var Gi = class extends _t {
  constructor(e) {
    super(),
      (this.componentFactoryResolver = new $i(this)),
      (this.instance = null);
    let r = new sr(
      [
        ...e.providers,
        { provide: _t, useValue: this },
        { provide: oo, useValue: this.componentFactoryResolver },
      ],
      e.parent || ka(),
      e.debugName,
      new Set(["environment"])
    );
    (this.injector = r),
      e.runEnvironmentInitializers && r.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(e) {
    this.injector.onDestroy(e);
  }
};
function uu(t, e, r = null) {
  return new Gi({
    providers: t,
    parent: e,
    debugName: r,
    runEnvironmentInitializers: !0,
  }).injector;
}
var RD = (() => {
  let e = class e {
    constructor(n) {
      (this._injector = n), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let i = Od(!1, n.type),
          o =
            i.length > 0
              ? uu([i], this._injector, `Standalone[${n.type.name}]`)
              : null;
        this.cachedInjectors.set(n, o);
      }
      return this.cachedInjectors.get(n);
    }
    ngOnDestroy() {
      try {
        for (let n of this.cachedInjectors.values()) n !== null && n.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
  };
  e.ɵprov = w({
    token: e,
    providedIn: "environment",
    factory: () => new e(F(xe)),
  });
  let t = e;
  return t;
})();
function Ne(t) {
  uo("NgStandalone"),
    (t.getStandaloneInjector = (e) =>
      e.get(RD).getOrCreateStandaloneInjector(t));
}
var fo = (() => {
    let e = class e {
      log(n) {
        console.log(n);
      }
      warn(n) {
        console.warn(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })(),
  wa = class {
    constructor(e, r) {
      (this.ngModuleFactory = e), (this.componentFactories = r);
    }
  },
  cu = (() => {
    let e = class e {
      compileModuleSync(n) {
        return new Ca(n);
      }
      compileModuleAsync(n) {
        return Promise.resolve(this.compileModuleSync(n));
      }
      compileModuleAndAllComponentsSync(n) {
        let i = this.compileModuleSync(n),
          o = Yl(n),
          s = Vd(o.declarations).reduce((a, u) => {
            let c = Vt(u);
            return c && a.push(new cr(c)), a;
          }, []);
        return new wa(i, s);
      }
      compileModuleAndAllComponentsAsync(n) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
      }
      clearCache() {}
      clearCacheFor(n) {}
      getModuleId(n) {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
var ho = (() => {
  let e = class e {
    constructor() {
      (this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new re(!1));
    }
    get _hasPendingTasks() {
      return this.hasPendingTasks.value;
    }
    add() {
      this._hasPendingTasks || this.hasPendingTasks.next(!0);
      let n = this.taskId++;
      return this.pendingTasks.add(n), n;
    }
    remove(n) {
      this.pendingTasks.delete(n),
        this.pendingTasks.size === 0 &&
          this._hasPendingTasks &&
          this.hasPendingTasks.next(!1);
    }
    ngOnDestroy() {
      this.pendingTasks.clear(),
        this._hasPendingTasks && this.hasPendingTasks.next(!1);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var Nf = new S("");
var Of = new S("Application Initializer"),
  Rf = (() => {
    let e = class e {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((n, i) => {
            (this.resolve = n), (this.reject = i);
          })),
          (this.appInits = m(Of, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let n = [];
        for (let o of this.appInits) {
          let s = o();
          if (Jt(s)) n.push(s);
          else if (bf(s)) {
            let a = new Promise((u, c) => {
              s.subscribe({ complete: u, error: c });
            });
            n.push(a);
          }
        }
        let i = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(n)
          .then(() => {
            i();
          })
          .catch((o) => {
            this.reject(o);
          }),
          n.length === 0 && i(),
          (this.initialized = !0);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  lu = new S("appBootstrapListener");
function FD() {
  Mc(() => {
    throw new y(600, !1);
  });
}
function PD(t) {
  return t.isBoundToModule;
}
function kD(t, e, r) {
  try {
    let n = r();
    return Jt(n)
      ? n.catch((i) => {
          throw (e.runOutsideAngular(() => t.handleError(i)), i);
        })
      : n;
  } catch (n) {
    throw (e.runOutsideAngular(() => t.handleError(n)), n);
  }
}
var Cr = (() => {
  let e = class e {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = m(Xd)),
        (this.afterRenderEffectManager = m(vf)),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = m(ho).hasPendingTasks.pipe(R((n) => !n))),
        (this._injector = m(xe));
    }
    get destroyed() {
      return this._destroyed;
    }
    get injector() {
      return this._injector;
    }
    bootstrap(n, i) {
      let o = n instanceof ki;
      if (!this._injector.get(Rf).done) {
        let h = !o && Zl(n),
          p = !1;
        throw new y(405, p);
      }
      let a;
      o ? (a = n) : (a = this._injector.get(oo).resolveComponentFactory(n)),
        this.componentTypes.push(a.componentType);
      let u = PD(a) ? void 0 : this._injector.get(_t),
        c = i || a.selector,
        l = a.create(Qt.NULL, [], c, u),
        d = l.location.nativeElement,
        f = l.injector.get(Nf, null);
      return (
        f?.registerApplication(d),
        l.onDestroy(() => {
          this.detachView(l.hostView),
            Es(this.components, l),
            f?.unregisterApplication(d);
        }),
        this._loadComponent(l),
        l
      );
    }
    tick() {
      if (this._runningTick) throw new y(101, !1);
      try {
        this._runningTick = !0;
        for (let n of this._views) n.detectChanges();
      } catch (n) {
        this.internalErrorHandler(n);
      } finally {
        try {
          let n = this.afterRenderEffectManager.execute();
        } catch (n) {
          this.internalErrorHandler(n);
        }
        this._runningTick = !1;
      }
    }
    attachView(n) {
      let i = n;
      this._views.push(i), i.attachToAppRef(this);
    }
    detachView(n) {
      let i = n;
      Es(this._views, i), i.detachFromAppRef();
    }
    _loadComponent(n) {
      this.attachView(n.hostView), this.tick(), this.components.push(n);
      let i = this._injector.get(lu, []);
      [...this._bootstrapListeners, ...i].forEach((o) => o(n));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((n) => n()),
            this._views.slice().forEach((n) => n.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(n) {
      return (
        this._destroyListeners.push(n), () => Es(this._destroyListeners, n)
      );
    }
    destroy() {
      if (this._destroyed) throw new y(406, !1);
      let n = this._injector;
      n.destroy && !n.destroyed && n.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {}
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function Es(t, e) {
  let r = t.indexOf(e);
  r > -1 && t.splice(r, 1);
}
var LD = (() => {
  let e = class e {
    constructor() {
      (this.zone = m(J)), (this.applicationRef = m(Cr));
    }
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription =
          this.zone.onMicrotaskEmpty.subscribe({
            next: () => {
              this.zone.run(() => {
                this.applicationRef.tick();
              });
            },
          }));
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function VD(t) {
  return [
    { provide: J, useFactory: t },
    {
      provide: bn,
      multi: !0,
      useFactory: () => {
        let e = m(LD, { optional: !0 });
        return () => e.initialize();
      },
    },
    {
      provide: bn,
      multi: !0,
      useFactory: () => {
        let e = m(UD);
        return () => {
          e.initialize();
        };
      },
    },
    { provide: Xd, useFactory: jD },
  ];
}
function jD() {
  let t = m(J),
    e = m(ct);
  return (r) => t.runOutsideAngular(() => e.handleError(r));
}
function $D(t) {
  let e = VD(() => new J(BD(t)));
  return eo([[], e]);
}
function BD(t) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1,
  };
}
var UD = (() => {
  let e = class e {
    constructor() {
      (this.subscription = new X()),
        (this.initialized = !1),
        (this.zone = m(J)),
        (this.pendingTasks = m(ho));
    }
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let n = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (n = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              J.assertNotInAngularZone(),
                queueMicrotask(() => {
                  n !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(n), (n = null));
                });
            })
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            J.assertInAngularZone(), (n ??= this.pendingTasks.add());
          })
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function HD() {
  return (typeof $localize < "u" && $localize.locale) || Hi;
}
var du = new S("LocaleId", {
  providedIn: "root",
  factory: () => m(du, T.Optional | T.SkipSelf) || HD(),
});
var Ff = new S("PlatformDestroyListeners");
var Mi = null;
function GD(t = [], e) {
  return Qt.create({
    name: e,
    providers: [
      { provide: to, useValue: "platform" },
      { provide: Ff, useValue: new Set([() => (Mi = null)]) },
      ...t,
    ],
  });
}
function zD(t = []) {
  if (Mi) return Mi;
  let e = GD(t);
  return (Mi = e), FD(), WD(e), e;
}
function WD(t) {
  t.get(Va, null)?.forEach((r) => r());
}
function Pf(t) {
  try {
    let { rootComponent: e, appProviders: r, platformProviders: n } = t,
      i = zD(n),
      o = [$D(), ...(r || [])],
      a = new Gi({
        providers: o,
        parent: i,
        debugName: "",
        runEnvironmentInitializers: !1,
      }).injector,
      u = a.get(J);
    return u.run(() => {
      a.resolveInjectorInitializers();
      let c = a.get(ct, null),
        l;
      u.runOutsideAngular(() => {
        l = u.onError.subscribe({
          next: (h) => {
            c.handleError(h);
          },
        });
      });
      let d = () => a.destroy(),
        f = i.get(Ff);
      return (
        f.add(d),
        a.onDestroy(() => {
          l.unsubscribe(), f.delete(d);
        }),
        kD(c, u, () => {
          let h = a.get(Rf);
          return (
            h.runInitializers(),
            h.donePromise.then(() => {
              let p = a.get(du, Hi);
              pD(p || Hi);
              let x = a.get(Cr);
              return e !== void 0 && x.bootstrap(e), x;
            })
          );
        })
      );
    });
  } catch (e) {
    return Promise.reject(e);
  }
}
function po(t) {
  return typeof t == "boolean" ? t : t != null && t !== "false";
}
var hu = null;
function ht() {
  return hu;
}
function $f(t) {
  hu || (hu = t);
}
var go = class {},
  Ie = new S("DocumentToken"),
  Bf = (() => {
    let e = class e {
      historyGo(n) {
        throw new Error("Not implemented");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => m(YD), providedIn: "platform" }));
    let t = e;
    return t;
  })();
var YD = (() => {
  let e = class e extends Bf {
    constructor() {
      super(),
        (this._doc = m(Ie)),
        (this._location = window.location),
        (this._history = window.history);
    }
    getBaseHrefFromDOM() {
      return ht().getBaseHref(this._doc);
    }
    onPopState(n) {
      let i = ht().getGlobalEventTarget(this._doc, "window");
      return (
        i.addEventListener("popstate", n, !1),
        () => i.removeEventListener("popstate", n)
      );
    }
    onHashChange(n) {
      let i = ht().getGlobalEventTarget(this._doc, "window");
      return (
        i.addEventListener("hashchange", n, !1),
        () => i.removeEventListener("hashchange", n)
      );
    }
    get href() {
      return this._location.href;
    }
    get protocol() {
      return this._location.protocol;
    }
    get hostname() {
      return this._location.hostname;
    }
    get port() {
      return this._location.port;
    }
    get pathname() {
      return this._location.pathname;
    }
    get search() {
      return this._location.search;
    }
    get hash() {
      return this._location.hash;
    }
    set pathname(n) {
      this._location.pathname = n;
    }
    pushState(n, i, o) {
      this._history.pushState(n, i, o);
    }
    replaceState(n, i, o) {
      this._history.replaceState(n, i, o);
    }
    forward() {
      this._history.forward();
    }
    back() {
      this._history.back();
    }
    historyGo(n = 0) {
      this._history.go(n);
    }
    getState() {
      return this._history.state;
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = w({ token: e, factory: () => new e(), providedIn: "platform" }));
  let t = e;
  return t;
})();
function Uf(t, e) {
  if (t.length == 0) return e;
  if (e.length == 0) return t;
  let r = 0;
  return (
    t.endsWith("/") && r++,
    e.startsWith("/") && r++,
    r == 2 ? t + e.substring(1) : r == 1 ? t + e : t + "/" + e
  );
}
function kf(t) {
  let e = t.match(/#|\?|$/),
    r = (e && e.index) || t.length,
    n = r - (t[r - 1] === "/" ? 1 : 0);
  return t.slice(0, n) + t.slice(r);
}
function Xt(t) {
  return t && t[0] !== "?" ? "?" + t : t;
}
var vo = (() => {
    let e = class e {
      historyGo(n) {
        throw new Error("Not implemented");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => m(Hf), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  QD = new S("appBaseHref"),
  Hf = (() => {
    let e = class e extends vo {
      constructor(n, i) {
        super(),
          (this._platformLocation = n),
          (this._removeListenerFns = []),
          (this._baseHref =
            i ??
            this._platformLocation.getBaseHrefFromDOM() ??
            m(Ie).location?.origin ??
            "");
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(n) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(n),
          this._platformLocation.onHashChange(n)
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(n) {
        return Uf(this._baseHref, n);
      }
      path(n = !1) {
        let i =
            this._platformLocation.pathname + Xt(this._platformLocation.search),
          o = this._platformLocation.hash;
        return o && n ? `${i}${o}` : i;
      }
      pushState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + Xt(s));
        this._platformLocation.pushState(n, i, a);
      }
      replaceState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + Xt(s));
        this._platformLocation.replaceState(n, i, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(n = 0) {
        this._platformLocation.historyGo?.(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(F(Bf), F(QD, 8));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
var wr = (() => {
  let e = class e {
    constructor(n) {
      (this._subject = new U()),
        (this._urlChangeListeners = []),
        (this._urlChangeSubscription = null),
        (this._locationStrategy = n);
      let i = this._locationStrategy.getBaseHref();
      (this._basePath = XD(kf(Lf(i)))),
        this._locationStrategy.onPopState((o) => {
          this._subject.emit({
            url: this.path(!0),
            pop: !0,
            state: o.state,
            type: o.type,
          });
        });
    }
    ngOnDestroy() {
      this._urlChangeSubscription?.unsubscribe(),
        (this._urlChangeListeners = []);
    }
    path(n = !1) {
      return this.normalize(this._locationStrategy.path(n));
    }
    getState() {
      return this._locationStrategy.getState();
    }
    isCurrentPathEqualTo(n, i = "") {
      return this.path() == this.normalize(n + Xt(i));
    }
    normalize(n) {
      return e.stripTrailingSlash(JD(this._basePath, Lf(n)));
    }
    prepareExternalUrl(n) {
      return (
        n && n[0] !== "/" && (n = "/" + n),
        this._locationStrategy.prepareExternalUrl(n)
      );
    }
    go(n, i = "", o = null) {
      this._locationStrategy.pushState(o, "", n, i),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(n + Xt(i)), o);
    }
    replaceState(n, i = "", o = null) {
      this._locationStrategy.replaceState(o, "", n, i),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(n + Xt(i)), o);
    }
    forward() {
      this._locationStrategy.forward();
    }
    back() {
      this._locationStrategy.back();
    }
    historyGo(n = 0) {
      this._locationStrategy.historyGo?.(n);
    }
    onUrlChange(n) {
      return (
        this._urlChangeListeners.push(n),
        this._urlChangeSubscription ||
          (this._urlChangeSubscription = this.subscribe((i) => {
            this._notifyUrlChangeListeners(i.url, i.state);
          })),
        () => {
          let i = this._urlChangeListeners.indexOf(n);
          this._urlChangeListeners.splice(i, 1),
            this._urlChangeListeners.length === 0 &&
              (this._urlChangeSubscription?.unsubscribe(),
              (this._urlChangeSubscription = null));
        }
      );
    }
    _notifyUrlChangeListeners(n = "", i) {
      this._urlChangeListeners.forEach((o) => o(n, i));
    }
    subscribe(n, i, o) {
      return this._subject.subscribe({ next: n, error: i, complete: o });
    }
  };
  (e.normalizeQueryParams = Xt),
    (e.joinWithSlash = Uf),
    (e.stripTrailingSlash = kf),
    (e.ɵfac = function (i) {
      return new (i || e)(F(vo));
    }),
    (e.ɵprov = w({ token: e, factory: () => KD(), providedIn: "root" }));
  let t = e;
  return t;
})();
function KD() {
  return new wr(F(vo));
}
function JD(t, e) {
  if (!t || !e.startsWith(t)) return e;
  let r = e.substring(t.length);
  return r === "" || ["/", ";", "?", "#"].includes(r[0]) ? r : e;
}
function Lf(t) {
  return t.replace(/\/index.html$/, "");
}
function XD(t) {
  if (new RegExp("^(https?:)?//").test(t)) {
    let [, r] = t.split(/\/\/[^\/]+/);
    return r;
  }
  return t;
}
function Gf(t, e) {
  e = encodeURIComponent(e);
  for (let r of t.split(";")) {
    let n = r.indexOf("="),
      [i, o] = n == -1 ? [r, ""] : [r.slice(0, n), r.slice(n + 1)];
    if (i.trim() === e) return decodeURIComponent(o);
  }
  return null;
}
var fu = /\s+/,
  Vf = [],
  Fn = (() => {
    let e = class e {
      constructor(n, i) {
        (this._ngEl = n),
          (this._renderer = i),
          (this.initialClasses = Vf),
          (this.stateMap = new Map());
      }
      set klass(n) {
        this.initialClasses = n != null ? n.trim().split(fu) : Vf;
      }
      set ngClass(n) {
        this.rawClass = typeof n == "string" ? n.trim().split(fu) : n;
      }
      ngDoCheck() {
        for (let i of this.initialClasses) this._updateState(i, !0);
        let n = this.rawClass;
        if (Array.isArray(n) || n instanceof Set)
          for (let i of n) this._updateState(i, !0);
        else if (n != null)
          for (let i of Object.keys(n)) this._updateState(i, !!n[i]);
        this._applyStateDiff();
      }
      _updateState(n, i) {
        let o = this.stateMap.get(n);
        o !== void 0
          ? (o.enabled !== i && ((o.changed = !0), (o.enabled = i)),
            (o.touched = !0))
          : this.stateMap.set(n, { enabled: i, changed: !0, touched: !0 });
      }
      _applyStateDiff() {
        for (let n of this.stateMap) {
          let i = n[0],
            o = n[1];
          o.changed
            ? (this._toggleClass(i, o.enabled), (o.changed = !1))
            : o.touched ||
              (o.enabled && this._toggleClass(i, !1), this.stateMap.delete(i)),
            (o.touched = !1);
        }
      }
      _toggleClass(n, i) {
        (n = n.trim()),
          n.length > 0 &&
            n.split(fu).forEach((o) => {
              i
                ? this._renderer.addClass(this._ngEl.nativeElement, o)
                : this._renderer.removeClass(this._ngEl.nativeElement, o);
            });
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(W(Ge), W(Kt));
    }),
      (e.ɵdir = le({
        type: e,
        selectors: [["", "ngClass", ""]],
        inputs: { klass: [De.None, "class", "klass"], ngClass: "ngClass" },
        standalone: !0,
      }));
    let t = e;
    return t;
  })();
var pu = class {
    constructor(e, r, n, i) {
      (this.$implicit = e),
        (this.ngForOf = r),
        (this.index = n),
        (this.count = i);
    }
    get first() {
      return this.index === 0;
    }
    get last() {
      return this.index === this.count - 1;
    }
    get even() {
      return this.index % 2 === 0;
    }
    get odd() {
      return !this.even;
    }
  },
  zf = (() => {
    let e = class e {
      set ngForOf(n) {
        (this._ngForOf = n), (this._ngForOfDirty = !0);
      }
      set ngForTrackBy(n) {
        this._trackByFn = n;
      }
      get ngForTrackBy() {
        return this._trackByFn;
      }
      constructor(n, i, o) {
        (this._viewContainer = n),
          (this._template = i),
          (this._differs = o),
          (this._ngForOf = null),
          (this._ngForOfDirty = !0),
          (this._differ = null);
      }
      set ngForTemplate(n) {
        n && (this._template = n);
      }
      ngDoCheck() {
        if (this._ngForOfDirty) {
          this._ngForOfDirty = !1;
          let n = this._ngForOf;
          if (!this._differ && n)
            if (0)
              try {
              } catch {}
            else this._differ = this._differs.find(n).create(this.ngForTrackBy);
        }
        if (this._differ) {
          let n = this._differ.diff(this._ngForOf);
          n && this._applyChanges(n);
        }
      }
      _applyChanges(n) {
        let i = this._viewContainer;
        n.forEachOperation((o, s, a) => {
          if (o.previousIndex == null)
            i.createEmbeddedView(
              this._template,
              new pu(o.item, this._ngForOf, -1, -1),
              a === null ? void 0 : a
            );
          else if (a == null) i.remove(s === null ? void 0 : s);
          else if (s !== null) {
            let u = i.get(s);
            i.move(u, a), jf(u, o);
          }
        });
        for (let o = 0, s = i.length; o < s; o++) {
          let u = i.get(o).context;
          (u.index = o), (u.count = s), (u.ngForOf = this._ngForOf);
        }
        n.forEachIdentityChange((o) => {
          let s = i.get(o.currentIndex);
          jf(s, o);
        });
      }
      static ngTemplateContextGuard(n, i) {
        return !0;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(W(Mt), W(Wt), W(za));
    }),
      (e.ɵdir = le({
        type: e,
        selectors: [["", "ngFor", "", "ngForOf", ""]],
        inputs: {
          ngForOf: "ngForOf",
          ngForTrackBy: "ngForTrackBy",
          ngForTemplate: "ngForTemplate",
        },
        standalone: !0,
      }));
    let t = e;
    return t;
  })();
function jf(t, e) {
  t.context.$implicit = e.item;
}
var eC = !0,
  gu = class {
    constructor(e, r) {
      (this._viewContainerRef = e),
        (this._templateRef = r),
        (this._created = !1);
    }
    create() {
      (this._created = !0),
        this._viewContainerRef.createEmbeddedView(this._templateRef);
    }
    destroy() {
      (this._created = !1), this._viewContainerRef.clear();
    }
    enforceState(e) {
      e && !this._created
        ? this.create()
        : !e && this._created && this.destroy();
    }
  },
  vu = (() => {
    let e = class e {
      constructor() {
        (this._defaultViews = []),
          (this._defaultUsed = !1),
          (this._caseCount = 0),
          (this._lastCaseCheckIndex = 0),
          (this._lastCasesMatched = !1);
      }
      set ngSwitch(n) {
        (this._ngSwitch = n),
          this._caseCount === 0 && this._updateDefaultCases(!0);
      }
      _addCase() {
        return this._caseCount++;
      }
      _addDefault(n) {
        this._defaultViews.push(n);
      }
      _matchCase(n) {
        let i = eC ? n === this._ngSwitch : n == this._ngSwitch;
        return (
          (this._lastCasesMatched = this._lastCasesMatched || i),
          this._lastCaseCheckIndex++,
          this._lastCaseCheckIndex === this._caseCount &&
            (this._updateDefaultCases(!this._lastCasesMatched),
            (this._lastCaseCheckIndex = 0),
            (this._lastCasesMatched = !1)),
          i
        );
      }
      _updateDefaultCases(n) {
        if (this._defaultViews.length > 0 && n !== this._defaultUsed) {
          this._defaultUsed = n;
          for (let i of this._defaultViews) i.enforceState(n);
        }
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵdir = le({
        type: e,
        selectors: [["", "ngSwitch", ""]],
        inputs: { ngSwitch: "ngSwitch" },
        standalone: !0,
      }));
    let t = e;
    return t;
  })(),
  Wf = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this.ngSwitch = o), o._addCase(), (this._view = new gu(n, i));
      }
      ngDoCheck() {
        this._view.enforceState(this.ngSwitch._matchCase(this.ngSwitchCase));
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(W(Mt), W(Wt), W(vu, 9));
    }),
      (e.ɵdir = le({
        type: e,
        selectors: [["", "ngSwitchCase", ""]],
        inputs: { ngSwitchCase: "ngSwitchCase" },
        standalone: !0,
      }));
    let t = e;
    return t;
  })();
var We = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = Et({ type: e })),
      (e.ɵinj = It({}));
    let t = e;
    return t;
  })(),
  qf = "browser",
  tC = "server";
function yu(t) {
  return t === tC;
}
var mo = class {};
var wu = class extends go {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  _u = class t extends wu {
    static makeCurrent() {
      $f(new t());
    }
    onAndCancel(e, r, n) {
      return (
        e.addEventListener(r, n),
        () => {
          e.removeEventListener(r, n);
        }
      );
    }
    dispatchEvent(e, r) {
      e.dispatchEvent(r);
    }
    remove(e) {
      e.parentNode && e.parentNode.removeChild(e);
    }
    createElement(e, r) {
      return (r = r || this.getDefaultDocument()), r.createElement(e);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument("fakeTitle");
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(e) {
      return e.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(e) {
      return e instanceof DocumentFragment;
    }
    getGlobalEventTarget(e, r) {
      return r === "window"
        ? window
        : r === "document"
        ? e
        : r === "body"
        ? e.body
        : null;
    }
    getBaseHref(e) {
      let r = nC();
      return r == null ? null : rC(r);
    }
    resetBaseElement() {
      Ir = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(e) {
      return Gf(document.cookie, e);
    }
  },
  Ir = null;
function nC() {
  return (
    (Ir = Ir || document.querySelector("base")),
    Ir ? Ir.getAttribute("href") : null
  );
}
function rC(t) {
  return new URL(t, document.baseURI).pathname;
}
var iC = (() => {
    let e = class e {
      build() {
        return new XMLHttpRequest();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Iu = new S("EventManagerPlugins"),
  Kf = (() => {
    let e = class e {
      constructor(n, i) {
        (this._zone = i),
          (this._eventNameToPlugin = new Map()),
          n.forEach((o) => {
            o.manager = this;
          }),
          (this._plugins = n.slice().reverse());
      }
      addEventListener(n, i, o) {
        return this._findPluginFor(i).addEventListener(n, i, o);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(n) {
        let i = this._eventNameToPlugin.get(n);
        if (i) return i;
        if (((i = this._plugins.find((s) => s.supports(n))), !i))
          throw new y(5101, !1);
        return this._eventNameToPlugin.set(n, i), i;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(F(Iu), F(J));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  yo = class {
    constructor(e) {
      this._doc = e;
    }
  },
  Du = "ng-app-id",
  Jf = (() => {
    let e = class e {
      constructor(n, i, o, s = {}) {
        (this.doc = n),
          (this.appId = i),
          (this.nonce = o),
          (this.platformId = s),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = yu(s)),
          this.resetHostNodes();
      }
      addStyles(n) {
        for (let i of n)
          this.changeUsageCount(i, 1) === 1 && this.onStyleAdded(i);
      }
      removeStyles(n) {
        for (let i of n)
          this.changeUsageCount(i, -1) <= 0 && this.onStyleRemoved(i);
      }
      ngOnDestroy() {
        let n = this.styleNodesInDOM;
        n && (n.forEach((i) => i.remove()), n.clear());
        for (let i of this.getAllStyles()) this.onStyleRemoved(i);
        this.resetHostNodes();
      }
      addHost(n) {
        this.hostNodes.add(n);
        for (let i of this.getAllStyles()) this.addStyleToHost(n, i);
      }
      removeHost(n) {
        this.hostNodes.delete(n);
      }
      getAllStyles() {
        return this.styleRef.keys();
      }
      onStyleAdded(n) {
        for (let i of this.hostNodes) this.addStyleToHost(i, n);
      }
      onStyleRemoved(n) {
        let i = this.styleRef;
        i.get(n)?.elements?.forEach((o) => o.remove()), i.delete(n);
      }
      collectServerRenderedStyles() {
        let n = this.doc.head?.querySelectorAll(`style[${Du}="${this.appId}"]`);
        if (n?.length) {
          let i = new Map();
          return (
            n.forEach((o) => {
              o.textContent != null && i.set(o.textContent, o);
            }),
            i
          );
        }
        return null;
      }
      changeUsageCount(n, i) {
        let o = this.styleRef;
        if (o.has(n)) {
          let s = o.get(n);
          return (s.usage += i), s.usage;
        }
        return o.set(n, { usage: i, elements: [] }), i;
      }
      getStyleElement(n, i) {
        let o = this.styleNodesInDOM,
          s = o?.get(i);
        if (s?.parentNode === n) return o.delete(i), s.removeAttribute(Du), s;
        {
          let a = this.doc.createElement("style");
          return (
            this.nonce && a.setAttribute("nonce", this.nonce),
            (a.textContent = i),
            this.platformIsServer && a.setAttribute(Du, this.appId),
            n.appendChild(a),
            a
          );
        }
      }
      addStyleToHost(n, i) {
        let o = this.getStyleElement(n, i),
          s = this.styleRef,
          a = s.get(i)?.elements;
        a ? a.push(o) : s.set(i, { elements: [o], usage: 1 });
      }
      resetHostNodes() {
        let n = this.hostNodes;
        n.clear(), n.add(this.doc.head);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(F(Ie), F(La), F(ja, 8), F(An));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Cu = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/MathML/",
  },
  bu = /%COMP%/g,
  Xf = "%COMP%",
  oC = `_nghost-${Xf}`,
  sC = `_ngcontent-${Xf}`,
  aC = !0,
  uC = new S("RemoveStylesOnCompDestroy", {
    providedIn: "root",
    factory: () => aC,
  });
function cC(t) {
  return sC.replace(bu, t);
}
function lC(t) {
  return oC.replace(bu, t);
}
function eh(t, e) {
  return e.map((r) => r.replace(bu, t));
}
var Zf = (() => {
    let e = class e {
      constructor(n, i, o, s, a, u, c, l = null) {
        (this.eventManager = n),
          (this.sharedStylesHost = i),
          (this.appId = o),
          (this.removeStylesOnCompDestroy = s),
          (this.doc = a),
          (this.platformId = u),
          (this.ngZone = c),
          (this.nonce = l),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = yu(u)),
          (this.defaultRenderer = new Er(n, a, c, this.platformIsServer));
      }
      createRenderer(n, i) {
        if (!n || !i) return this.defaultRenderer;
        this.platformIsServer &&
          i.encapsulation === Je.ShadowDom &&
          (i = z(g({}, i), { encapsulation: Je.Emulated }));
        let o = this.getOrCreateRenderer(n, i);
        return (
          o instanceof Do
            ? o.applyToHost(n)
            : o instanceof br && o.applyStyles(),
          o
        );
      }
      getOrCreateRenderer(n, i) {
        let o = this.rendererByCompId,
          s = o.get(i.id);
        if (!s) {
          let a = this.doc,
            u = this.ngZone,
            c = this.eventManager,
            l = this.sharedStylesHost,
            d = this.removeStylesOnCompDestroy,
            f = this.platformIsServer;
          switch (i.encapsulation) {
            case Je.Emulated:
              s = new Do(c, l, i, this.appId, d, a, u, f);
              break;
            case Je.ShadowDom:
              return new Eu(c, l, n, i, a, u, this.nonce, f);
            default:
              s = new br(c, l, i, d, a, u, f);
              break;
          }
          o.set(i.id, s);
        }
        return s;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(
        F(Kf),
        F(Jf),
        F(La),
        F(uC),
        F(Ie),
        F(An),
        F(J),
        F(ja)
      );
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Er = class {
    constructor(e, r, n, i) {
      (this.eventManager = e),
        (this.doc = r),
        (this.ngZone = n),
        (this.platformIsServer = i),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null);
    }
    destroy() {}
    createElement(e, r) {
      return r
        ? this.doc.createElementNS(Cu[r] || r, e)
        : this.doc.createElement(e);
    }
    createComment(e) {
      return this.doc.createComment(e);
    }
    createText(e) {
      return this.doc.createTextNode(e);
    }
    appendChild(e, r) {
      (Yf(e) ? e.content : e).appendChild(r);
    }
    insertBefore(e, r, n) {
      e && (Yf(e) ? e.content : e).insertBefore(r, n);
    }
    removeChild(e, r) {
      e && e.removeChild(r);
    }
    selectRootElement(e, r) {
      let n = typeof e == "string" ? this.doc.querySelector(e) : e;
      if (!n) throw new y(-5104, !1);
      return r || (n.textContent = ""), n;
    }
    parentNode(e) {
      return e.parentNode;
    }
    nextSibling(e) {
      return e.nextSibling;
    }
    setAttribute(e, r, n, i) {
      if (i) {
        r = i + ":" + r;
        let o = Cu[i];
        o ? e.setAttributeNS(o, r, n) : e.setAttribute(r, n);
      } else e.setAttribute(r, n);
    }
    removeAttribute(e, r, n) {
      if (n) {
        let i = Cu[n];
        i ? e.removeAttributeNS(i, r) : e.removeAttribute(`${n}:${r}`);
      } else e.removeAttribute(r);
    }
    addClass(e, r) {
      e.classList.add(r);
    }
    removeClass(e, r) {
      e.classList.remove(r);
    }
    setStyle(e, r, n, i) {
      i & (ut.DashCase | ut.Important)
        ? e.style.setProperty(r, n, i & ut.Important ? "important" : "")
        : (e.style[r] = n);
    }
    removeStyle(e, r, n) {
      n & ut.DashCase ? e.style.removeProperty(r) : (e.style[r] = "");
    }
    setProperty(e, r, n) {
      e != null && (e[r] = n);
    }
    setValue(e, r) {
      e.nodeValue = r;
    }
    listen(e, r, n) {
      if (
        typeof e == "string" &&
        ((e = ht().getGlobalEventTarget(this.doc, e)), !e)
      )
        throw new Error(`Unsupported event target ${e} for event ${r}`);
      return this.eventManager.addEventListener(
        e,
        r,
        this.decoratePreventDefault(n)
      );
    }
    decoratePreventDefault(e) {
      return (r) => {
        if (r === "__ngUnwrap__") return e;
        (this.platformIsServer ? this.ngZone.runGuarded(() => e(r)) : e(r)) ===
          !1 && r.preventDefault();
      };
    }
  };
function Yf(t) {
  return t.tagName === "TEMPLATE" && t.content !== void 0;
}
var Eu = class extends Er {
    constructor(e, r, n, i, o, s, a, u) {
      super(e, o, s, u),
        (this.sharedStylesHost = r),
        (this.hostEl = n),
        (this.shadowRoot = n.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let c = eh(i.id, i.styles);
      for (let l of c) {
        let d = document.createElement("style");
        a && d.setAttribute("nonce", a),
          (d.textContent = l),
          this.shadowRoot.appendChild(d);
      }
    }
    nodeOrShadowRoot(e) {
      return e === this.hostEl ? this.shadowRoot : e;
    }
    appendChild(e, r) {
      return super.appendChild(this.nodeOrShadowRoot(e), r);
    }
    insertBefore(e, r, n) {
      return super.insertBefore(this.nodeOrShadowRoot(e), r, n);
    }
    removeChild(e, r) {
      return super.removeChild(this.nodeOrShadowRoot(e), r);
    }
    parentNode(e) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(e)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  br = class extends Er {
    constructor(e, r, n, i, o, s, a, u) {
      super(e, o, s, a),
        (this.sharedStylesHost = r),
        (this.removeStylesOnCompDestroy = i),
        (this.styles = u ? eh(u, n.styles) : n.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  Do = class extends br {
    constructor(e, r, n, i, o, s, a, u) {
      let c = i + "-" + n.id;
      super(e, r, n, o, s, a, u, c),
        (this.contentAttr = cC(c)),
        (this.hostAttr = lC(c));
    }
    applyToHost(e) {
      this.applyStyles(), this.setAttribute(e, this.hostAttr, "");
    }
    createElement(e, r) {
      let n = super.createElement(e, r);
      return super.setAttribute(n, this.contentAttr, ""), n;
    }
  },
  dC = (() => {
    let e = class e extends yo {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return !0;
      }
      addEventListener(n, i, o) {
        return (
          n.addEventListener(i, o, !1), () => this.removeEventListener(n, i, o)
        );
      }
      removeEventListener(n, i, o) {
        return n.removeEventListener(i, o);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(F(Ie));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Qf = ["alt", "control", "meta", "shift"],
  fC = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS",
  },
  hC = {
    alt: (t) => t.altKey,
    control: (t) => t.ctrlKey,
    meta: (t) => t.metaKey,
    shift: (t) => t.shiftKey,
  },
  pC = (() => {
    let e = class e extends yo {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return e.parseEventName(n) != null;
      }
      addEventListener(n, i, o) {
        let s = e.parseEventName(i),
          a = e.eventCallback(s.fullKey, o, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => ht().onAndCancel(n, s.domEventName, a));
      }
      static parseEventName(n) {
        let i = n.toLowerCase().split("."),
          o = i.shift();
        if (i.length === 0 || !(o === "keydown" || o === "keyup")) return null;
        let s = e._normalizeKey(i.pop()),
          a = "",
          u = i.indexOf("code");
        if (
          (u > -1 && (i.splice(u, 1), (a = "code.")),
          Qf.forEach((l) => {
            let d = i.indexOf(l);
            d > -1 && (i.splice(d, 1), (a += l + "."));
          }),
          (a += s),
          i.length != 0 || s.length === 0)
        )
          return null;
        let c = {};
        return (c.domEventName = o), (c.fullKey = a), c;
      }
      static matchEventFullKeyCode(n, i) {
        let o = fC[n.key] || n.key,
          s = "";
        return (
          i.indexOf("code.") > -1 && ((o = n.code), (s = "code.")),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === " " ? (o = "space") : o === "." && (o = "dot"),
              Qf.forEach((a) => {
                if (a !== o) {
                  let u = hC[a];
                  u(n) && (s += a + ".");
                }
              }),
              (s += o),
              s === i)
        );
      }
      static eventCallback(n, i, o) {
        return (s) => {
          e.matchEventFullKeyCode(s, n) && o.runGuarded(() => i(s));
        };
      }
      static _normalizeKey(n) {
        return n === "esc" ? "escape" : n;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(F(Ie));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function th(t, e) {
  return Pf(g({ rootComponent: t }, gC(e)));
}
function gC(t) {
  return {
    appProviders: [...CC, ...(t?.providers ?? [])],
    platformProviders: DC,
  };
}
function mC() {
  _u.makeCurrent();
}
function vC() {
  return new ct();
}
function yC() {
  return Ld(document), document;
}
var DC = [
  { provide: An, useValue: qf },
  { provide: Va, useValue: mC, multi: !0 },
  { provide: Ie, useFactory: yC, deps: [] },
];
var CC = [
  { provide: to, useValue: "root" },
  { provide: ct, useFactory: vC, deps: [] },
  { provide: Iu, useClass: dC, multi: !0, deps: [Ie, J, An] },
  { provide: Iu, useClass: pC, multi: !0, deps: [Ie] },
  Zf,
  Jf,
  Kf,
  { provide: ur, useExisting: Zf },
  { provide: mo, useClass: iC, deps: [] },
  [],
];
function wC() {
  return new Mu(F(Ie));
}
var Mu = (() => {
  let e = class e {
    constructor(n) {
      this._doc = n;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(n) {
      this._doc.title = n || "";
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(F(Ie));
  }),
    (e.ɵprov = w({
      token: e,
      factory: function (i) {
        let o = null;
        return i ? (o = new i()) : (o = wC()), o;
      },
      providedIn: "root",
    }));
  let t = e;
  return t;
})();
var M = "primary",
  $r = Symbol("RouteTitle"),
  Nu = class {
    constructor(e) {
      this.params = e || {};
    }
    has(e) {
      return Object.prototype.hasOwnProperty.call(this.params, e);
    }
    get(e) {
      if (this.has(e)) {
        let r = this.params[e];
        return Array.isArray(r) ? r[0] : r;
      }
      return null;
    }
    getAll(e) {
      if (this.has(e)) {
        let r = this.params[e];
        return Array.isArray(r) ? r : [r];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function jn(t) {
  return new Nu(t);
}
function EC(t, e, r) {
  let n = r.path.split("/");
  if (
    n.length > t.length ||
    (r.pathMatch === "full" && (e.hasChildren() || n.length < t.length))
  )
    return null;
  let i = {};
  for (let o = 0; o < n.length; o++) {
    let s = n[o],
      a = t[o];
    if (s.startsWith(":")) i[s.substring(1)] = a;
    else if (s !== a.path) return null;
  }
  return { consumed: t.slice(0, n.length), posParams: i };
}
function bC(t, e) {
  if (t.length !== e.length) return !1;
  for (let r = 0; r < t.length; ++r) if (!tt(t[r], e[r])) return !1;
  return !0;
}
function tt(t, e) {
  let r = t ? Ou(t) : void 0,
    n = e ? Ou(e) : void 0;
  if (!r || !n || r.length != n.length) return !1;
  let i;
  for (let o = 0; o < r.length; o++)
    if (((i = r[o]), !ah(t[i], e[i]))) return !1;
  return !0;
}
function Ou(t) {
  return [...Object.keys(t), ...Object.getOwnPropertySymbols(t)];
}
function ah(t, e) {
  if (Array.isArray(t) && Array.isArray(e)) {
    if (t.length !== e.length) return !1;
    let r = [...t].sort(),
      n = [...e].sort();
    return r.every((i, o) => n[o] === i);
  } else return t === e;
}
function uh(t) {
  return t.length > 0 ? t[t.length - 1] : null;
}
function At(t) {
  return ts(t) ? t : Jt(t) ? Y(Promise.resolve(t)) : _(t);
}
var MC = { exact: lh, subset: dh },
  ch = { exact: SC, subset: xC, ignored: () => !0 };
function nh(t, e, r) {
  return (
    MC[r.paths](t.root, e.root, r.matrixParams) &&
    ch[r.queryParams](t.queryParams, e.queryParams) &&
    !(r.fragment === "exact" && t.fragment !== e.fragment)
  );
}
function SC(t, e) {
  return tt(t, e);
}
function lh(t, e, r) {
  if (
    !tn(t.segments, e.segments) ||
    !_o(t.segments, e.segments, r) ||
    t.numberOfChildren !== e.numberOfChildren
  )
    return !1;
  for (let n in e.children)
    if (!t.children[n] || !lh(t.children[n], e.children[n], r)) return !1;
  return !0;
}
function xC(t, e) {
  return (
    Object.keys(e).length <= Object.keys(t).length &&
    Object.keys(e).every((r) => ah(t[r], e[r]))
  );
}
function dh(t, e, r) {
  return fh(t, e, e.segments, r);
}
function fh(t, e, r, n) {
  if (t.segments.length > r.length) {
    let i = t.segments.slice(0, r.length);
    return !(!tn(i, r) || e.hasChildren() || !_o(i, r, n));
  } else if (t.segments.length === r.length) {
    if (!tn(t.segments, r) || !_o(t.segments, r, n)) return !1;
    for (let i in e.children)
      if (!t.children[i] || !dh(t.children[i], e.children[i], n)) return !1;
    return !0;
  } else {
    let i = r.slice(0, t.segments.length),
      o = r.slice(t.segments.length);
    return !tn(t.segments, i) || !_o(t.segments, i, n) || !t.children[M]
      ? !1
      : fh(t.children[M], e, o, n);
  }
}
function _o(t, e, r) {
  return e.every((n, i) => ch[r](t[i].parameters, n.parameters));
}
var xt = class {
    constructor(e = new $([], {}), r = {}, n = null) {
      (this.root = e), (this.queryParams = r), (this.fragment = n);
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= jn(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      return NC.serialize(this);
    }
  },
  $ = class {
    constructor(e, r) {
      (this.segments = e),
        (this.children = r),
        (this.parent = null),
        Object.values(r).forEach((n) => (n.parent = this));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return Io(this);
    }
  },
  en = class {
    constructor(e, r) {
      (this.path = e), (this.parameters = r);
    }
    get parameterMap() {
      return (this._parameterMap ??= jn(this.parameters)), this._parameterMap;
    }
    toString() {
      return ph(this);
    }
  };
function TC(t, e) {
  return tn(t, e) && t.every((r, n) => tt(r.parameters, e[n].parameters));
}
function tn(t, e) {
  return t.length !== e.length ? !1 : t.every((r, n) => r.path === e[n].path);
}
function AC(t, e) {
  let r = [];
  return (
    Object.entries(t.children).forEach(([n, i]) => {
      n === M && (r = r.concat(e(i, n)));
    }),
    Object.entries(t.children).forEach(([n, i]) => {
      n !== M && (r = r.concat(e(i, n)));
    }),
    r
  );
}
var ic = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => new bo(), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  bo = class {
    parse(e) {
      let r = new Fu(e);
      return new xt(
        r.parseRootSegment(),
        r.parseQueryParams(),
        r.parseFragment()
      );
    }
    serialize(e) {
      let r = `/${Mr(e.root, !0)}`,
        n = FC(e.queryParams),
        i = typeof e.fragment == "string" ? `#${OC(e.fragment)}` : "";
      return `${r}${n}${i}`;
    }
  },
  NC = new bo();
function Io(t) {
  return t.segments.map((e) => ph(e)).join("/");
}
function Mr(t, e) {
  if (!t.hasChildren()) return Io(t);
  if (e) {
    let r = t.children[M] ? Mr(t.children[M], !1) : "",
      n = [];
    return (
      Object.entries(t.children).forEach(([i, o]) => {
        i !== M && n.push(`${i}:${Mr(o, !1)}`);
      }),
      n.length > 0 ? `${r}(${n.join("//")})` : r
    );
  } else {
    let r = AC(t, (n, i) =>
      i === M ? [Mr(t.children[M], !1)] : [`${i}:${Mr(n, !1)}`]
    );
    return Object.keys(t.children).length === 1 && t.children[M] != null
      ? `${Io(t)}/${r[0]}`
      : `${Io(t)}/(${r.join("//")})`;
  }
}
function hh(t) {
  return encodeURIComponent(t)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",");
}
function Co(t) {
  return hh(t).replace(/%3B/gi, ";");
}
function OC(t) {
  return encodeURI(t);
}
function Ru(t) {
  return hh(t)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/%26/gi, "&");
}
function Eo(t) {
  return decodeURIComponent(t);
}
function rh(t) {
  return Eo(t.replace(/\+/g, "%20"));
}
function ph(t) {
  return `${Ru(t.path)}${RC(t.parameters)}`;
}
function RC(t) {
  return Object.entries(t)
    .map(([e, r]) => `;${Ru(e)}=${Ru(r)}`)
    .join("");
}
function FC(t) {
  let e = Object.entries(t)
    .map(([r, n]) =>
      Array.isArray(n)
        ? n.map((i) => `${Co(r)}=${Co(i)}`).join("&")
        : `${Co(r)}=${Co(n)}`
    )
    .filter((r) => r);
  return e.length ? `?${e.join("&")}` : "";
}
var PC = /^[^\/()?;#]+/;
function Su(t) {
  let e = t.match(PC);
  return e ? e[0] : "";
}
var kC = /^[^\/()?;=#]+/;
function LC(t) {
  let e = t.match(kC);
  return e ? e[0] : "";
}
var VC = /^[^=?&#]+/;
function jC(t) {
  let e = t.match(VC);
  return e ? e[0] : "";
}
var $C = /^[^&#]+/;
function BC(t) {
  let e = t.match($C);
  return e ? e[0] : "";
}
var Fu = class {
  constructor(e) {
    (this.url = e), (this.remaining = e);
  }
  parseRootSegment() {
    return (
      this.consumeOptional("/"),
      this.remaining === "" ||
      this.peekStartsWith("?") ||
      this.peekStartsWith("#")
        ? new $([], {})
        : new $([], this.parseChildren())
    );
  }
  parseQueryParams() {
    let e = {};
    if (this.consumeOptional("?"))
      do this.parseQueryParam(e);
      while (this.consumeOptional("&"));
    return e;
  }
  parseFragment() {
    return this.consumeOptional("#")
      ? decodeURIComponent(this.remaining)
      : null;
  }
  parseChildren() {
    if (this.remaining === "") return {};
    this.consumeOptional("/");
    let e = [];
    for (
      this.peekStartsWith("(") || e.push(this.parseSegment());
      this.peekStartsWith("/") &&
      !this.peekStartsWith("//") &&
      !this.peekStartsWith("/(");

    )
      this.capture("/"), e.push(this.parseSegment());
    let r = {};
    this.peekStartsWith("/(") &&
      (this.capture("/"), (r = this.parseParens(!0)));
    let n = {};
    return (
      this.peekStartsWith("(") && (n = this.parseParens(!1)),
      (e.length > 0 || Object.keys(r).length > 0) && (n[M] = new $(e, r)),
      n
    );
  }
  parseSegment() {
    let e = Su(this.remaining);
    if (e === "" && this.peekStartsWith(";")) throw new y(4009, !1);
    return this.capture(e), new en(Eo(e), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let e = {};
    for (; this.consumeOptional(";"); ) this.parseParam(e);
    return e;
  }
  parseParam(e) {
    let r = LC(this.remaining);
    if (!r) return;
    this.capture(r);
    let n = "";
    if (this.consumeOptional("=")) {
      let i = Su(this.remaining);
      i && ((n = i), this.capture(n));
    }
    e[Eo(r)] = Eo(n);
  }
  parseQueryParam(e) {
    let r = jC(this.remaining);
    if (!r) return;
    this.capture(r);
    let n = "";
    if (this.consumeOptional("=")) {
      let s = BC(this.remaining);
      s && ((n = s), this.capture(n));
    }
    let i = rh(r),
      o = rh(n);
    if (e.hasOwnProperty(i)) {
      let s = e[i];
      Array.isArray(s) || ((s = [s]), (e[i] = s)), s.push(o);
    } else e[i] = o;
  }
  parseParens(e) {
    let r = {};
    for (
      this.capture("(");
      !this.consumeOptional(")") && this.remaining.length > 0;

    ) {
      let n = Su(this.remaining),
        i = this.remaining[n.length];
      if (i !== "/" && i !== ")" && i !== ";") throw new y(4010, !1);
      let o;
      n.indexOf(":") > -1
        ? ((o = n.slice(0, n.indexOf(":"))), this.capture(o), this.capture(":"))
        : e && (o = M);
      let s = this.parseChildren();
      (r[o] = Object.keys(s).length === 1 ? s[M] : new $([], s)),
        this.consumeOptional("//");
    }
    return r;
  }
  peekStartsWith(e) {
    return this.remaining.startsWith(e);
  }
  consumeOptional(e) {
    return this.peekStartsWith(e)
      ? ((this.remaining = this.remaining.substring(e.length)), !0)
      : !1;
  }
  capture(e) {
    if (!this.consumeOptional(e)) throw new y(4011, !1);
  }
};
function gh(t) {
  return t.segments.length > 0 ? new $([], { [M]: t }) : t;
}
function mh(t) {
  let e = {};
  for (let [n, i] of Object.entries(t.children)) {
    let o = mh(i);
    if (n === M && o.segments.length === 0 && o.hasChildren())
      for (let [s, a] of Object.entries(o.children)) e[s] = a;
    else (o.segments.length > 0 || o.hasChildren()) && (e[n] = o);
  }
  let r = new $(t.segments, e);
  return UC(r);
}
function UC(t) {
  if (t.numberOfChildren === 1 && t.children[M]) {
    let e = t.children[M];
    return new $(t.segments.concat(e.segments), e.children);
  }
  return t;
}
function $n(t) {
  return t instanceof xt;
}
function HC(t, e, r = null, n = null) {
  let i = vh(t);
  return yh(i, e, r, n);
}
function vh(t) {
  let e;
  function r(o) {
    let s = {};
    for (let u of o.children) {
      let c = r(u);
      s[u.outlet] = c;
    }
    let a = new $(o.url, s);
    return o === t && (e = a), a;
  }
  let n = r(t.root),
    i = gh(n);
  return e ?? i;
}
function yh(t, e, r, n) {
  let i = t;
  for (; i.parent; ) i = i.parent;
  if (e.length === 0) return xu(i, i, i, r, n);
  let o = GC(e);
  if (o.toRoot()) return xu(i, i, new $([], {}), r, n);
  let s = zC(o, i, t),
    a = s.processChildren
      ? Tr(s.segmentGroup, s.index, o.commands)
      : Ch(s.segmentGroup, s.index, o.commands);
  return xu(i, s.segmentGroup, a, r, n);
}
function Mo(t) {
  return typeof t == "object" && t != null && !t.outlets && !t.segmentPath;
}
function Or(t) {
  return typeof t == "object" && t != null && t.outlets;
}
function xu(t, e, r, n, i) {
  let o = {};
  n &&
    Object.entries(n).forEach(([u, c]) => {
      o[u] = Array.isArray(c) ? c.map((l) => `${l}`) : `${c}`;
    });
  let s;
  t === e ? (s = r) : (s = Dh(t, e, r));
  let a = gh(mh(s));
  return new xt(a, o, i);
}
function Dh(t, e, r) {
  let n = {};
  return (
    Object.entries(t.children).forEach(([i, o]) => {
      o === e ? (n[i] = r) : (n[i] = Dh(o, e, r));
    }),
    new $(t.segments, n)
  );
}
var So = class {
  constructor(e, r, n) {
    if (
      ((this.isAbsolute = e),
      (this.numberOfDoubleDots = r),
      (this.commands = n),
      e && n.length > 0 && Mo(n[0]))
    )
      throw new y(4003, !1);
    let i = n.find(Or);
    if (i && i !== uh(n)) throw new y(4004, !1);
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    );
  }
};
function GC(t) {
  if (typeof t[0] == "string" && t.length === 1 && t[0] === "/")
    return new So(!0, 0, t);
  let e = 0,
    r = !1,
    n = t.reduce((i, o, s) => {
      if (typeof o == "object" && o != null) {
        if (o.outlets) {
          let a = {};
          return (
            Object.entries(o.outlets).forEach(([u, c]) => {
              a[u] = typeof c == "string" ? c.split("/") : c;
            }),
            [...i, { outlets: a }]
          );
        }
        if (o.segmentPath) return [...i, o.segmentPath];
      }
      return typeof o != "string"
        ? [...i, o]
        : s === 0
        ? (o.split("/").forEach((a, u) => {
            (u == 0 && a === ".") ||
              (u == 0 && a === ""
                ? (r = !0)
                : a === ".."
                ? e++
                : a != "" && i.push(a));
          }),
          i)
        : [...i, o];
    }, []);
  return new So(r, e, n);
}
var Ln = class {
  constructor(e, r, n) {
    (this.segmentGroup = e), (this.processChildren = r), (this.index = n);
  }
};
function zC(t, e, r) {
  if (t.isAbsolute) return new Ln(e, !0, 0);
  if (!r) return new Ln(e, !1, NaN);
  if (r.parent === null) return new Ln(r, !0, 0);
  let n = Mo(t.commands[0]) ? 0 : 1,
    i = r.segments.length - 1 + n;
  return WC(r, i, t.numberOfDoubleDots);
}
function WC(t, e, r) {
  let n = t,
    i = e,
    o = r;
  for (; o > i; ) {
    if (((o -= i), (n = n.parent), !n)) throw new y(4005, !1);
    i = n.segments.length;
  }
  return new Ln(n, !1, i - o);
}
function qC(t) {
  return Or(t[0]) ? t[0].outlets : { [M]: t };
}
function Ch(t, e, r) {
  if (((t ??= new $([], {})), t.segments.length === 0 && t.hasChildren()))
    return Tr(t, e, r);
  let n = ZC(t, e, r),
    i = r.slice(n.commandIndex);
  if (n.match && n.pathIndex < t.segments.length) {
    let o = new $(t.segments.slice(0, n.pathIndex), {});
    return (
      (o.children[M] = new $(t.segments.slice(n.pathIndex), t.children)),
      Tr(o, 0, i)
    );
  } else
    return n.match && i.length === 0
      ? new $(t.segments, {})
      : n.match && !t.hasChildren()
      ? Pu(t, e, r)
      : n.match
      ? Tr(t, 0, i)
      : Pu(t, e, r);
}
function Tr(t, e, r) {
  if (r.length === 0) return new $(t.segments, {});
  {
    let n = qC(r),
      i = {};
    if (
      Object.keys(n).some((o) => o !== M) &&
      t.children[M] &&
      t.numberOfChildren === 1 &&
      t.children[M].segments.length === 0
    ) {
      let o = Tr(t.children[M], e, r);
      return new $(t.segments, o.children);
    }
    return (
      Object.entries(n).forEach(([o, s]) => {
        typeof s == "string" && (s = [s]),
          s !== null && (i[o] = Ch(t.children[o], e, s));
      }),
      Object.entries(t.children).forEach(([o, s]) => {
        n[o] === void 0 && (i[o] = s);
      }),
      new $(t.segments, i)
    );
  }
}
function ZC(t, e, r) {
  let n = 0,
    i = e,
    o = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; i < t.segments.length; ) {
    if (n >= r.length) return o;
    let s = t.segments[i],
      a = r[n];
    if (Or(a)) break;
    let u = `${a}`,
      c = n < r.length - 1 ? r[n + 1] : null;
    if (i > 0 && u === void 0) break;
    if (u && c && typeof c == "object" && c.outlets === void 0) {
      if (!oh(u, c, s)) return o;
      n += 2;
    } else {
      if (!oh(u, {}, s)) return o;
      n++;
    }
    i++;
  }
  return { match: !0, pathIndex: i, commandIndex: n };
}
function Pu(t, e, r) {
  let n = t.segments.slice(0, e),
    i = 0;
  for (; i < r.length; ) {
    let o = r[i];
    if (Or(o)) {
      let u = YC(o.outlets);
      return new $(n, u);
    }
    if (i === 0 && Mo(r[0])) {
      let u = t.segments[e];
      n.push(new en(u.path, ih(r[0]))), i++;
      continue;
    }
    let s = Or(o) ? o.outlets[M] : `${o}`,
      a = i < r.length - 1 ? r[i + 1] : null;
    s && a && Mo(a)
      ? (n.push(new en(s, ih(a))), (i += 2))
      : (n.push(new en(s, {})), i++);
  }
  return new $(n, {});
}
function YC(t) {
  let e = {};
  return (
    Object.entries(t).forEach(([r, n]) => {
      typeof n == "string" && (n = [n]),
        n !== null && (e[r] = Pu(new $([], {}), 0, n));
    }),
    e
  );
}
function ih(t) {
  let e = {};
  return Object.entries(t).forEach(([r, n]) => (e[r] = `${n}`)), e;
}
function oh(t, e, r) {
  return t == r.path && tt(e, r.parameters);
}
var Ar = "imperative",
  se = (function (t) {
    return (
      (t[(t.NavigationStart = 0)] = "NavigationStart"),
      (t[(t.NavigationEnd = 1)] = "NavigationEnd"),
      (t[(t.NavigationCancel = 2)] = "NavigationCancel"),
      (t[(t.NavigationError = 3)] = "NavigationError"),
      (t[(t.RoutesRecognized = 4)] = "RoutesRecognized"),
      (t[(t.ResolveStart = 5)] = "ResolveStart"),
      (t[(t.ResolveEnd = 6)] = "ResolveEnd"),
      (t[(t.GuardsCheckStart = 7)] = "GuardsCheckStart"),
      (t[(t.GuardsCheckEnd = 8)] = "GuardsCheckEnd"),
      (t[(t.RouteConfigLoadStart = 9)] = "RouteConfigLoadStart"),
      (t[(t.RouteConfigLoadEnd = 10)] = "RouteConfigLoadEnd"),
      (t[(t.ChildActivationStart = 11)] = "ChildActivationStart"),
      (t[(t.ChildActivationEnd = 12)] = "ChildActivationEnd"),
      (t[(t.ActivationStart = 13)] = "ActivationStart"),
      (t[(t.ActivationEnd = 14)] = "ActivationEnd"),
      (t[(t.Scroll = 15)] = "Scroll"),
      (t[(t.NavigationSkipped = 16)] = "NavigationSkipped"),
      t
    );
  })(se || {}),
  Re = class {
    constructor(e, r) {
      (this.id = e), (this.url = r);
    }
  },
  Rr = class extends Re {
    constructor(e, r, n = "imperative", i = null) {
      super(e, r),
        (this.type = se.NavigationStart),
        (this.navigationTrigger = n),
        (this.restoredState = i);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  nn = class extends Re {
    constructor(e, r, n) {
      super(e, r), (this.urlAfterRedirects = n), (this.type = se.NavigationEnd);
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  Oe = (function (t) {
    return (
      (t[(t.Redirect = 0)] = "Redirect"),
      (t[(t.SupersededByNewNavigation = 1)] = "SupersededByNewNavigation"),
      (t[(t.NoDataFromResolver = 2)] = "NoDataFromResolver"),
      (t[(t.GuardRejected = 3)] = "GuardRejected"),
      t
    );
  })(Oe || {}),
  ku = (function (t) {
    return (
      (t[(t.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
      (t[(t.IgnoredByUrlHandlingStrategy = 1)] =
        "IgnoredByUrlHandlingStrategy"),
      t
    );
  })(ku || {}),
  Tt = class extends Re {
    constructor(e, r, n, i) {
      super(e, r),
        (this.reason = n),
        (this.code = i),
        (this.type = se.NavigationCancel);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  rn = class extends Re {
    constructor(e, r, n, i) {
      super(e, r),
        (this.reason = n),
        (this.code = i),
        (this.type = se.NavigationSkipped);
    }
  },
  Fr = class extends Re {
    constructor(e, r, n, i) {
      super(e, r),
        (this.error = n),
        (this.target = i),
        (this.type = se.NavigationError);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  xo = class extends Re {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = se.RoutesRecognized);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Lu = class extends Re {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = se.GuardsCheckStart);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Vu = class extends Re {
    constructor(e, r, n, i, o) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.shouldActivate = o),
        (this.type = se.GuardsCheckEnd);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  ju = class extends Re {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = se.ResolveStart);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  $u = class extends Re {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = se.ResolveEnd);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Bu = class {
    constructor(e) {
      (this.route = e), (this.type = se.RouteConfigLoadStart);
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  Uu = class {
    constructor(e) {
      (this.route = e), (this.type = se.RouteConfigLoadEnd);
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  Hu = class {
    constructor(e) {
      (this.snapshot = e), (this.type = se.ChildActivationStart);
    }
    toString() {
      return `ChildActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Gu = class {
    constructor(e) {
      (this.snapshot = e), (this.type = se.ChildActivationEnd);
    }
    toString() {
      return `ChildActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  zu = class {
    constructor(e) {
      (this.snapshot = e), (this.type = se.ActivationStart);
    }
    toString() {
      return `ActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Wu = class {
    constructor(e) {
      (this.snapshot = e), (this.type = se.ActivationEnd);
    }
    toString() {
      return `ActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  };
var Pr = class {},
  kr = class {
    constructor(e) {
      this.url = e;
    }
  };
var qu = class {
    constructor() {
      (this.outlet = null),
        (this.route = null),
        (this.injector = null),
        (this.children = new Fo()),
        (this.attachRef = null);
    }
  },
  Fo = (() => {
    let e = class e {
      constructor() {
        this.contexts = new Map();
      }
      onChildOutletCreated(n, i) {
        let o = this.getOrCreateContext(n);
        (o.outlet = i), this.contexts.set(n, o);
      }
      onChildOutletDestroyed(n) {
        let i = this.getContext(n);
        i && ((i.outlet = null), (i.attachRef = null));
      }
      onOutletDeactivated() {
        let n = this.contexts;
        return (this.contexts = new Map()), n;
      }
      onOutletReAttached(n) {
        this.contexts = n;
      }
      getOrCreateContext(n) {
        let i = this.getContext(n);
        return i || ((i = new qu()), this.contexts.set(n, i)), i;
      }
      getContext(n) {
        return this.contexts.get(n) || null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  To = class {
    constructor(e) {
      this._root = e;
    }
    get root() {
      return this._root.value;
    }
    parent(e) {
      let r = this.pathFromRoot(e);
      return r.length > 1 ? r[r.length - 2] : null;
    }
    children(e) {
      let r = Zu(e, this._root);
      return r ? r.children.map((n) => n.value) : [];
    }
    firstChild(e) {
      let r = Zu(e, this._root);
      return r && r.children.length > 0 ? r.children[0].value : null;
    }
    siblings(e) {
      let r = Yu(e, this._root);
      return r.length < 2
        ? []
        : r[r.length - 2].children.map((i) => i.value).filter((i) => i !== e);
    }
    pathFromRoot(e) {
      return Yu(e, this._root).map((r) => r.value);
    }
  };
function Zu(t, e) {
  if (t === e.value) return e;
  for (let r of e.children) {
    let n = Zu(t, r);
    if (n) return n;
  }
  return null;
}
function Yu(t, e) {
  if (t === e.value) return [e];
  for (let r of e.children) {
    let n = Yu(t, r);
    if (n.length) return n.unshift(e), n;
  }
  return [];
}
var Ee = class {
  constructor(e, r) {
    (this.value = e), (this.children = r);
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function kn(t) {
  let e = {};
  return t && t.children.forEach((r) => (e[r.value.outlet] = r)), e;
}
var Ao = class extends To {
  constructor(e, r) {
    super(e), (this.snapshot = r), sc(this, e);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function wh(t) {
  let e = QC(t),
    r = new re([new en("", {})]),
    n = new re({}),
    i = new re({}),
    o = new re({}),
    s = new re(""),
    a = new Bn(r, n, o, s, i, M, t, e.root);
  return (a.snapshot = e.root), new Ao(new Ee(a, []), e);
}
function QC(t) {
  let e = {},
    r = {},
    n = {},
    i = "",
    o = new Lr([], e, n, i, r, M, t, null, {});
  return new No("", new Ee(o, []));
}
var Bn = class {
  constructor(e, r, n, i, o, s, a, u) {
    (this.urlSubject = e),
      (this.paramsSubject = r),
      (this.queryParamsSubject = n),
      (this.fragmentSubject = i),
      (this.dataSubject = o),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = u),
      (this.title = this.dataSubject?.pipe(R((c) => c[$r])) ?? _(void 0)),
      (this.url = e),
      (this.params = r),
      (this.queryParams = n),
      (this.fragment = i),
      (this.data = o);
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return (
      (this._paramMap ??= this.params.pipe(R((e) => jn(e)))), this._paramMap
    );
  }
  get queryParamMap() {
    return (
      (this._queryParamMap ??= this.queryParams.pipe(R((e) => jn(e)))),
      this._queryParamMap
    );
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`;
  }
};
function oc(t, e, r = "emptyOnly") {
  let n,
    { routeConfig: i } = t;
  return (
    e !== null &&
    (r === "always" ||
      i?.path === "" ||
      (!e.component && !e.routeConfig?.loadComponent))
      ? (n = {
          params: g(g({}, e.params), t.params),
          data: g(g({}, e.data), t.data),
          resolve: g(g(g(g({}, t.data), e.data), i?.data), t._resolvedData),
        })
      : (n = {
          params: g({}, t.params),
          data: g({}, t.data),
          resolve: g(g({}, t.data), t._resolvedData ?? {}),
        }),
    i && Ih(i) && (n.resolve[$r] = i.title),
    n
  );
}
var Lr = class {
    get title() {
      return this.data?.[$r];
    }
    constructor(e, r, n, i, o, s, a, u, c) {
      (this.url = e),
        (this.params = r),
        (this.queryParams = n),
        (this.fragment = i),
        (this.data = o),
        (this.outlet = s),
        (this.component = a),
        (this.routeConfig = u),
        (this._resolve = c);
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return (this._paramMap ??= jn(this.params)), this._paramMap;
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= jn(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      let e = this.url.map((n) => n.toString()).join("/"),
        r = this.routeConfig ? this.routeConfig.path : "";
      return `Route(url:'${e}', path:'${r}')`;
    }
  },
  No = class extends To {
    constructor(e, r) {
      super(r), (this.url = e), sc(this, r);
    }
    toString() {
      return _h(this._root);
    }
  };
function sc(t, e) {
  (e.value._routerState = t), e.children.forEach((r) => sc(t, r));
}
function _h(t) {
  let e = t.children.length > 0 ? ` { ${t.children.map(_h).join(", ")} } ` : "";
  return `${t.value}${e}`;
}
function Tu(t) {
  if (t.snapshot) {
    let e = t.snapshot,
      r = t._futureSnapshot;
    (t.snapshot = r),
      tt(e.queryParams, r.queryParams) ||
        t.queryParamsSubject.next(r.queryParams),
      e.fragment !== r.fragment && t.fragmentSubject.next(r.fragment),
      tt(e.params, r.params) || t.paramsSubject.next(r.params),
      bC(e.url, r.url) || t.urlSubject.next(r.url),
      tt(e.data, r.data) || t.dataSubject.next(r.data);
  } else
    (t.snapshot = t._futureSnapshot),
      t.dataSubject.next(t._futureSnapshot.data);
}
function Qu(t, e) {
  let r = tt(t.params, e.params) && TC(t.url, e.url),
    n = !t.parent != !e.parent;
  return r && !n && (!t.parent || Qu(t.parent, e.parent));
}
function Ih(t) {
  return typeof t.title == "string" || t.title === null;
}
var KC = (() => {
    let e = class e {
      constructor() {
        (this.activated = null),
          (this._activatedRoute = null),
          (this.name = M),
          (this.activateEvents = new U()),
          (this.deactivateEvents = new U()),
          (this.attachEvents = new U()),
          (this.detachEvents = new U()),
          (this.parentContexts = m(Fo)),
          (this.location = m(Mt)),
          (this.changeDetector = m(Rn)),
          (this.environmentInjector = m(xe)),
          (this.inputBinder = m(ac, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0);
      }
      get activatedComponentRef() {
        return this.activated;
      }
      ngOnChanges(n) {
        if (n.name) {
          let { firstChange: i, previousValue: o } = n.name;
          if (i) return;
          this.isTrackedInParentContexts(o) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(o)),
            this.initializeOutletWithName();
        }
      }
      ngOnDestroy() {
        this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this);
      }
      isTrackedInParentContexts(n) {
        return this.parentContexts.getContext(n)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if (
          (this.parentContexts.onChildOutletCreated(this.name, this),
          this.activated)
        )
          return;
        let n = this.parentContexts.getContext(this.name);
        n?.route &&
          (n.attachRef
            ? this.attach(n.attachRef, n.route)
            : this.activateWith(n.route, n.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new y(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new y(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new y(4012, !1);
        this.location.detach();
        let n = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(n.instance),
          n
        );
      }
      attach(n, i) {
        (this.activated = n),
          (this._activatedRoute = i),
          this.location.insert(n.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(n.instance);
      }
      deactivate() {
        if (this.activated) {
          let n = this.component;
          this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(n);
        }
      }
      activateWith(n, i) {
        if (this.isActivated) throw new y(4013, !1);
        this._activatedRoute = n;
        let o = this.location,
          a = n.snapshot.component,
          u = this.parentContexts.getOrCreateContext(this.name).children,
          c = new Ku(n, u, o.injector);
        (this.activated = o.createComponent(a, {
          index: o.length,
          injector: c,
          environmentInjector: i ?? this.environmentInjector,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵdir = le({
        type: e,
        selectors: [["router-outlet"]],
        inputs: { name: "name" },
        outputs: {
          activateEvents: "activate",
          deactivateEvents: "deactivate",
          attachEvents: "attach",
          detachEvents: "detach",
        },
        exportAs: ["outlet"],
        standalone: !0,
        features: [Tn],
      }));
    let t = e;
    return t;
  })(),
  Ku = class {
    constructor(e, r, n) {
      (this.route = e), (this.childContexts = r), (this.parent = n);
    }
    get(e, r) {
      return e === Bn
        ? this.route
        : e === Fo
        ? this.childContexts
        : this.parent.get(e, r);
    }
  },
  ac = new S("");
function JC(t, e, r) {
  let n = Vr(t, e._root, r ? r._root : void 0);
  return new Ao(n, e);
}
function Vr(t, e, r) {
  if (r && t.shouldReuseRoute(e.value, r.value.snapshot)) {
    let n = r.value;
    n._futureSnapshot = e.value;
    let i = XC(t, e, r);
    return new Ee(n, i);
  } else {
    if (t.shouldAttach(e.value)) {
      let o = t.retrieve(e.value);
      if (o !== null) {
        let s = o.route;
        return (
          (s.value._futureSnapshot = e.value),
          (s.children = e.children.map((a) => Vr(t, a))),
          s
        );
      }
    }
    let n = ew(e.value),
      i = e.children.map((o) => Vr(t, o));
    return new Ee(n, i);
  }
}
function XC(t, e, r) {
  return e.children.map((n) => {
    for (let i of r.children)
      if (t.shouldReuseRoute(n.value, i.value.snapshot)) return Vr(t, n, i);
    return Vr(t, n);
  });
}
function ew(t) {
  return new Bn(
    new re(t.url),
    new re(t.params),
    new re(t.queryParams),
    new re(t.fragment),
    new re(t.data),
    t.outlet,
    t.component,
    t
  );
}
var Eh = "ngNavigationCancelingError";
function bh(t, e) {
  let { redirectTo: r, navigationBehaviorOptions: n } = $n(e)
      ? { redirectTo: e, navigationBehaviorOptions: void 0 }
      : e,
    i = Mh(!1, Oe.Redirect, e);
  return (i.url = r), (i.navigationBehaviorOptions = n), i;
}
function Mh(t, e, r) {
  let n = new Error("NavigationCancelingError: " + (t || ""));
  return (n[Eh] = !0), (n.cancellationCode = e), r && (n.url = r), n;
}
function tw(t) {
  return Sh(t) && $n(t.url);
}
function Sh(t) {
  return t && t[Eh];
}
var nw = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = Te({
      type: e,
      selectors: [["ng-component"]],
      standalone: !0,
      features: [Ne],
      decls: 1,
      vars: 0,
      template: function (i, o) {
        i & 1 && ze(0, "router-outlet");
      },
      dependencies: [KC],
      encapsulation: 2,
    }));
  let t = e;
  return t;
})();
function rw(t, e) {
  return (
    t.providers &&
      !t._injector &&
      (t._injector = uu(t.providers, e, `Route: ${t.path}`)),
    t._injector ?? e
  );
}
function uc(t) {
  let e = t.children && t.children.map(uc),
    r = e ? z(g({}, t), { children: e }) : g({}, t);
  return (
    !r.component &&
      !r.loadComponent &&
      (e || r.loadChildren) &&
      r.outlet &&
      r.outlet !== M &&
      (r.component = nw),
    r
  );
}
function nt(t) {
  return t.outlet || M;
}
function iw(t, e) {
  let r = t.filter((n) => nt(n) === e);
  return r.push(...t.filter((n) => nt(n) !== e)), r;
}
function Br(t) {
  if (!t) return null;
  if (t.routeConfig?._injector) return t.routeConfig._injector;
  for (let e = t.parent; e; e = e.parent) {
    let r = e.routeConfig;
    if (r?._loadedInjector) return r._loadedInjector;
    if (r?._injector) return r._injector;
  }
  return null;
}
var ow = (t, e, r, n) =>
    R(
      (i) => (
        new Ju(e, i.targetRouterState, i.currentRouterState, r, n).activate(t),
        i
      )
    ),
  Ju = class {
    constructor(e, r, n, i, o) {
      (this.routeReuseStrategy = e),
        (this.futureState = r),
        (this.currState = n),
        (this.forwardEvent = i),
        (this.inputBindingEnabled = o);
    }
    activate(e) {
      let r = this.futureState._root,
        n = this.currState ? this.currState._root : null;
      this.deactivateChildRoutes(r, n, e),
        Tu(this.futureState.root),
        this.activateChildRoutes(r, n, e);
    }
    deactivateChildRoutes(e, r, n) {
      let i = kn(r);
      e.children.forEach((o) => {
        let s = o.value.outlet;
        this.deactivateRoutes(o, i[s], n), delete i[s];
      }),
        Object.values(i).forEach((o) => {
          this.deactivateRouteAndItsChildren(o, n);
        });
    }
    deactivateRoutes(e, r, n) {
      let i = e.value,
        o = r ? r.value : null;
      if (i === o)
        if (i.component) {
          let s = n.getContext(i.outlet);
          s && this.deactivateChildRoutes(e, r, s.children);
        } else this.deactivateChildRoutes(e, r, n);
      else o && this.deactivateRouteAndItsChildren(r, n);
    }
    deactivateRouteAndItsChildren(e, r) {
      e.value.component &&
      this.routeReuseStrategy.shouldDetach(e.value.snapshot)
        ? this.detachAndStoreRouteSubtree(e, r)
        : this.deactivateRouteAndOutlet(e, r);
    }
    detachAndStoreRouteSubtree(e, r) {
      let n = r.getContext(e.value.outlet),
        i = n && e.value.component ? n.children : r,
        o = kn(e);
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, i);
      if (n && n.outlet) {
        let s = n.outlet.detach(),
          a = n.children.onOutletDeactivated();
        this.routeReuseStrategy.store(e.value.snapshot, {
          componentRef: s,
          route: e,
          contexts: a,
        });
      }
    }
    deactivateRouteAndOutlet(e, r) {
      let n = r.getContext(e.value.outlet),
        i = n && e.value.component ? n.children : r,
        o = kn(e);
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, i);
      n &&
        (n.outlet && (n.outlet.deactivate(), n.children.onOutletDeactivated()),
        (n.attachRef = null),
        (n.route = null));
    }
    activateChildRoutes(e, r, n) {
      let i = kn(r);
      e.children.forEach((o) => {
        this.activateRoutes(o, i[o.value.outlet], n),
          this.forwardEvent(new Wu(o.value.snapshot));
      }),
        e.children.length && this.forwardEvent(new Gu(e.value.snapshot));
    }
    activateRoutes(e, r, n) {
      let i = e.value,
        o = r ? r.value : null;
      if ((Tu(i), i === o))
        if (i.component) {
          let s = n.getOrCreateContext(i.outlet);
          this.activateChildRoutes(e, r, s.children);
        } else this.activateChildRoutes(e, r, n);
      else if (i.component) {
        let s = n.getOrCreateContext(i.outlet);
        if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(i.snapshot);
          this.routeReuseStrategy.store(i.snapshot, null),
            s.children.onOutletReAttached(a.contexts),
            (s.attachRef = a.componentRef),
            (s.route = a.route.value),
            s.outlet && s.outlet.attach(a.componentRef, a.route.value),
            Tu(a.route.value),
            this.activateChildRoutes(e, null, s.children);
        } else {
          let a = Br(i.snapshot);
          (s.attachRef = null),
            (s.route = i),
            (s.injector = a),
            s.outlet && s.outlet.activateWith(i, s.injector),
            this.activateChildRoutes(e, null, s.children);
        }
      } else this.activateChildRoutes(e, null, n);
    }
  },
  Oo = class {
    constructor(e) {
      (this.path = e), (this.route = this.path[this.path.length - 1]);
    }
  },
  Vn = class {
    constructor(e, r) {
      (this.component = e), (this.route = r);
    }
  };
function sw(t, e, r) {
  let n = t._root,
    i = e ? e._root : null;
  return Sr(n, i, r, [n.value]);
}
function aw(t) {
  let e = t.routeConfig ? t.routeConfig.canActivateChild : null;
  return !e || e.length === 0 ? null : { node: t, guards: e };
}
function Hn(t, e) {
  let r = Symbol(),
    n = e.get(t, r);
  return n === r ? (typeof t == "function" && !Ll(t) ? t : e.get(t)) : n;
}
function Sr(
  t,
  e,
  r,
  n,
  i = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let o = kn(e);
  return (
    t.children.forEach((s) => {
      uw(s, o[s.value.outlet], r, n.concat([s.value]), i),
        delete o[s.value.outlet];
    }),
    Object.entries(o).forEach(([s, a]) => Nr(a, r.getContext(s), i)),
    i
  );
}
function uw(
  t,
  e,
  r,
  n,
  i = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let o = t.value,
    s = e ? e.value : null,
    a = r ? r.getContext(t.value.outlet) : null;
  if (s && o.routeConfig === s.routeConfig) {
    let u = cw(s, o, o.routeConfig.runGuardsAndResolvers);
    u
      ? i.canActivateChecks.push(new Oo(n))
      : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
      o.component ? Sr(t, e, a ? a.children : null, n, i) : Sr(t, e, r, n, i),
      u &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        i.canDeactivateChecks.push(new Vn(a.outlet.component, s));
  } else
    s && Nr(e, a, i),
      i.canActivateChecks.push(new Oo(n)),
      o.component
        ? Sr(t, null, a ? a.children : null, n, i)
        : Sr(t, null, r, n, i);
  return i;
}
function cw(t, e, r) {
  if (typeof r == "function") return r(t, e);
  switch (r) {
    case "pathParamsChange":
      return !tn(t.url, e.url);
    case "pathParamsOrQueryParamsChange":
      return !tn(t.url, e.url) || !tt(t.queryParams, e.queryParams);
    case "always":
      return !0;
    case "paramsOrQueryParamsChange":
      return !Qu(t, e) || !tt(t.queryParams, e.queryParams);
    case "paramsChange":
    default:
      return !Qu(t, e);
  }
}
function Nr(t, e, r) {
  let n = kn(t),
    i = t.value;
  Object.entries(n).forEach(([o, s]) => {
    i.component
      ? e
        ? Nr(s, e.children.getContext(o), r)
        : Nr(s, null, r)
      : Nr(s, e, r);
  }),
    i.component
      ? e && e.outlet && e.outlet.isActivated
        ? r.canDeactivateChecks.push(new Vn(e.outlet.component, i))
        : r.canDeactivateChecks.push(new Vn(null, i))
      : r.canDeactivateChecks.push(new Vn(null, i));
}
function Ur(t) {
  return typeof t == "function";
}
function lw(t) {
  return typeof t == "boolean";
}
function dw(t) {
  return t && Ur(t.canLoad);
}
function fw(t) {
  return t && Ur(t.canActivate);
}
function hw(t) {
  return t && Ur(t.canActivateChild);
}
function pw(t) {
  return t && Ur(t.canDeactivate);
}
function gw(t) {
  return t && Ur(t.canMatch);
}
function xh(t) {
  return t instanceof st || t?.name === "EmptyError";
}
var wo = Symbol("INITIAL_VALUE");
function Un() {
  return Le((t) =>
    gi(t.map((e) => e.pipe(at(1), as(wo)))).pipe(
      R((e) => {
        for (let r of e)
          if (r !== !0) {
            if (r === wo) return wo;
            if (r === !1 || r instanceof xt) return r;
          }
        return !0;
      }),
      ke((e) => e !== wo),
      at(1)
    )
  );
}
function mw(t, e) {
  return ee((r) => {
    let {
      targetSnapshot: n,
      currentSnapshot: i,
      guards: { canActivateChecks: o, canDeactivateChecks: s },
    } = r;
    return s.length === 0 && o.length === 0
      ? _(z(g({}, r), { guardsResult: !0 }))
      : vw(s, n, i, t).pipe(
          ee((a) => (a && lw(a) ? yw(n, o, t, e) : _(a))),
          R((a) => z(g({}, r), { guardsResult: a }))
        );
  });
}
function vw(t, e, r, n) {
  return Y(t).pipe(
    ee((i) => Iw(i.component, i.route, r, e, n)),
    Ze((i) => i !== !0, !0)
  );
}
function yw(t, e, r, n) {
  return Y(e).pipe(
    pn((i) =>
      hn(
        Cw(i.route.parent, n),
        Dw(i.route, n),
        _w(t, i.path, r),
        ww(t, i.route, r)
      )
    ),
    Ze((i) => i !== !0, !0)
  );
}
function Dw(t, e) {
  return t !== null && e && e(new zu(t)), _(!0);
}
function Cw(t, e) {
  return t !== null && e && e(new Hu(t)), _(!0);
}
function ww(t, e, r) {
  let n = e.routeConfig ? e.routeConfig.canActivate : null;
  if (!n || n.length === 0) return _(!0);
  let i = n.map((o) =>
    mi(() => {
      let s = Br(e) ?? r,
        a = Hn(o, s),
        u = fw(a) ? a.canActivate(e, t) : Yt(s, () => a(e, t));
      return At(u).pipe(Ze());
    })
  );
  return _(i).pipe(Un());
}
function _w(t, e, r) {
  let n = e[e.length - 1],
    o = e
      .slice(0, e.length - 1)
      .reverse()
      .map((s) => aw(s))
      .filter((s) => s !== null)
      .map((s) =>
        mi(() => {
          let a = s.guards.map((u) => {
            let c = Br(s.node) ?? r,
              l = Hn(u, c),
              d = hw(l) ? l.canActivateChild(n, t) : Yt(c, () => l(n, t));
            return At(d).pipe(Ze());
          });
          return _(a).pipe(Un());
        })
      );
  return _(o).pipe(Un());
}
function Iw(t, e, r, n, i) {
  let o = e && e.routeConfig ? e.routeConfig.canDeactivate : null;
  if (!o || o.length === 0) return _(!0);
  let s = o.map((a) => {
    let u = Br(e) ?? i,
      c = Hn(a, u),
      l = pw(c) ? c.canDeactivate(t, e, r, n) : Yt(u, () => c(t, e, r, n));
    return At(l).pipe(Ze());
  });
  return _(s).pipe(Un());
}
function Ew(t, e, r, n) {
  let i = e.canLoad;
  if (i === void 0 || i.length === 0) return _(!0);
  let o = i.map((s) => {
    let a = Hn(s, t),
      u = dw(a) ? a.canLoad(e, r) : Yt(t, () => a(e, r));
    return At(u);
  });
  return _(o).pipe(Un(), Th(n));
}
function Th(t) {
  return Ko(
    te((e) => {
      if ($n(e)) throw bh(t, e);
    }),
    R((e) => e === !0)
  );
}
function bw(t, e, r, n) {
  let i = e.canMatch;
  if (!i || i.length === 0) return _(!0);
  let o = i.map((s) => {
    let a = Hn(s, t),
      u = gw(a) ? a.canMatch(e, r) : Yt(t, () => a(e, r));
    return At(u);
  });
  return _(o).pipe(Un(), Th(n));
}
var jr = class {
    constructor(e) {
      this.segmentGroup = e || null;
    }
  },
  Ro = class extends Error {
    constructor(e) {
      super(), (this.urlTree = e);
    }
  };
function Pn(t) {
  return fn(new jr(t));
}
function Mw(t) {
  return fn(new y(4e3, !1));
}
function Sw(t) {
  return fn(Mh(!1, Oe.GuardRejected));
}
var Xu = class {
    constructor(e, r) {
      (this.urlSerializer = e), (this.urlTree = r);
    }
    lineralizeSegments(e, r) {
      let n = [],
        i = r.root;
      for (;;) {
        if (((n = n.concat(i.segments)), i.numberOfChildren === 0)) return _(n);
        if (i.numberOfChildren > 1 || !i.children[M]) return Mw(e.redirectTo);
        i = i.children[M];
      }
    }
    applyRedirectCommands(e, r, n) {
      let i = this.applyRedirectCreateUrlTree(
        r,
        this.urlSerializer.parse(r),
        e,
        n
      );
      if (r.startsWith("/")) throw new Ro(i);
      return i;
    }
    applyRedirectCreateUrlTree(e, r, n, i) {
      let o = this.createSegmentGroup(e, r.root, n, i);
      return new xt(
        o,
        this.createQueryParams(r.queryParams, this.urlTree.queryParams),
        r.fragment
      );
    }
    createQueryParams(e, r) {
      let n = {};
      return (
        Object.entries(e).forEach(([i, o]) => {
          if (typeof o == "string" && o.startsWith(":")) {
            let a = o.substring(1);
            n[i] = r[a];
          } else n[i] = o;
        }),
        n
      );
    }
    createSegmentGroup(e, r, n, i) {
      let o = this.createSegments(e, r.segments, n, i),
        s = {};
      return (
        Object.entries(r.children).forEach(([a, u]) => {
          s[a] = this.createSegmentGroup(e, u, n, i);
        }),
        new $(o, s)
      );
    }
    createSegments(e, r, n, i) {
      return r.map((o) =>
        o.path.startsWith(":")
          ? this.findPosParam(e, o, i)
          : this.findOrReturn(o, n)
      );
    }
    findPosParam(e, r, n) {
      let i = n[r.path.substring(1)];
      if (!i) throw new y(4001, !1);
      return i;
    }
    findOrReturn(e, r) {
      let n = 0;
      for (let i of r) {
        if (i.path === e.path) return r.splice(n), i;
        n++;
      }
      return e;
    }
  },
  ec = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  };
function xw(t, e, r, n, i) {
  let o = cc(t, e, r);
  return o.matched
    ? ((n = rw(e, n)),
      bw(n, e, r, i).pipe(R((s) => (s === !0 ? o : g({}, ec)))))
    : _(o);
}
function cc(t, e, r) {
  if (e.path === "**") return Tw(r);
  if (e.path === "")
    return e.pathMatch === "full" && (t.hasChildren() || r.length > 0)
      ? g({}, ec)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: r,
          parameters: {},
          positionalParamSegments: {},
        };
  let i = (e.matcher || EC)(r, t, e);
  if (!i) return g({}, ec);
  let o = {};
  Object.entries(i.posParams ?? {}).forEach(([a, u]) => {
    o[a] = u.path;
  });
  let s =
    i.consumed.length > 0
      ? g(g({}, o), i.consumed[i.consumed.length - 1].parameters)
      : o;
  return {
    matched: !0,
    consumedSegments: i.consumed,
    remainingSegments: r.slice(i.consumed.length),
    parameters: s,
    positionalParamSegments: i.posParams ?? {},
  };
}
function Tw(t) {
  return {
    matched: !0,
    parameters: t.length > 0 ? uh(t).parameters : {},
    consumedSegments: t,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function sh(t, e, r, n) {
  return r.length > 0 && Ow(t, r, n)
    ? {
        segmentGroup: new $(e, Nw(n, new $(r, t.children))),
        slicedSegments: [],
      }
    : r.length === 0 && Rw(t, r, n)
    ? {
        segmentGroup: new $(t.segments, Aw(t, r, n, t.children)),
        slicedSegments: r,
      }
    : { segmentGroup: new $(t.segments, t.children), slicedSegments: r };
}
function Aw(t, e, r, n) {
  let i = {};
  for (let o of r)
    if (Po(t, e, o) && !n[nt(o)]) {
      let s = new $([], {});
      i[nt(o)] = s;
    }
  return g(g({}, n), i);
}
function Nw(t, e) {
  let r = {};
  r[M] = e;
  for (let n of t)
    if (n.path === "" && nt(n) !== M) {
      let i = new $([], {});
      r[nt(n)] = i;
    }
  return r;
}
function Ow(t, e, r) {
  return r.some((n) => Po(t, e, n) && nt(n) !== M);
}
function Rw(t, e, r) {
  return r.some((n) => Po(t, e, n));
}
function Po(t, e, r) {
  return (t.hasChildren() || e.length > 0) && r.pathMatch === "full"
    ? !1
    : r.path === "";
}
function Fw(t, e, r, n) {
  return nt(t) !== n && (n === M || !Po(e, r, t)) ? !1 : cc(e, t, r).matched;
}
function Pw(t, e, r) {
  return e.length === 0 && !t.children[r];
}
var tc = class {};
function kw(t, e, r, n, i, o, s = "emptyOnly") {
  return new nc(t, e, r, n, i, s, o).recognize();
}
var Lw = 31,
  nc = class {
    constructor(e, r, n, i, o, s, a) {
      (this.injector = e),
        (this.configLoader = r),
        (this.rootComponentType = n),
        (this.config = i),
        (this.urlTree = o),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.applyRedirects = new Xu(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0);
    }
    noMatchError(e) {
      return new y(4002, `'${e.segmentGroup}'`);
    }
    recognize() {
      let e = sh(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(e).pipe(
        R((r) => {
          let n = new Lr(
              [],
              Object.freeze({}),
              Object.freeze(g({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              {},
              M,
              this.rootComponentType,
              null,
              {}
            ),
            i = new Ee(n, r),
            o = new No("", i),
            s = HC(n, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (s.queryParams = this.urlTree.queryParams),
            (o.url = this.urlSerializer.serialize(s)),
            this.inheritParamsAndData(o._root, null),
            { state: o, tree: s }
          );
        })
      );
    }
    match(e) {
      return this.processSegmentGroup(this.injector, this.config, e, M).pipe(
        mt((n) => {
          if (n instanceof Ro)
            return (this.urlTree = n.urlTree), this.match(n.urlTree.root);
          throw n instanceof jr ? this.noMatchError(n) : n;
        })
      );
    }
    inheritParamsAndData(e, r) {
      let n = e.value,
        i = oc(n, r, this.paramsInheritanceStrategy);
      (n.params = Object.freeze(i.params)),
        (n.data = Object.freeze(i.data)),
        e.children.forEach((o) => this.inheritParamsAndData(o, n));
    }
    processSegmentGroup(e, r, n, i) {
      return n.segments.length === 0 && n.hasChildren()
        ? this.processChildren(e, r, n)
        : this.processSegment(e, r, n, n.segments, i, !0).pipe(
            R((o) => (o instanceof Ee ? [o] : []))
          );
    }
    processChildren(e, r, n) {
      let i = [];
      for (let o of Object.keys(n.children))
        o === "primary" ? i.unshift(o) : i.push(o);
      return Y(i).pipe(
        pn((o) => {
          let s = n.children[o],
            a = iw(r, o);
          return this.processSegmentGroup(e, a, s, o);
        }),
        ss((o, s) => (o.push(...s), o)),
        vt(null),
        os(),
        ee((o) => {
          if (o === null) return Pn(n);
          let s = Ah(o);
          return Vw(s), _(s);
        })
      );
    }
    processSegment(e, r, n, i, o, s) {
      return Y(r).pipe(
        pn((a) =>
          this.processSegmentAgainstRoute(
            a._injector ?? e,
            r,
            a,
            n,
            i,
            o,
            s
          ).pipe(
            mt((u) => {
              if (u instanceof jr) return _(null);
              throw u;
            })
          )
        ),
        Ze((a) => !!a),
        mt((a) => {
          if (xh(a)) return Pw(n, i, o) ? _(new tc()) : Pn(n);
          throw a;
        })
      );
    }
    processSegmentAgainstRoute(e, r, n, i, o, s, a) {
      return Fw(n, i, o, s)
        ? n.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(e, i, n, o, s)
          : this.allowRedirects && a
          ? this.expandSegmentAgainstRouteUsingRedirect(e, i, r, n, o, s)
          : Pn(i)
        : Pn(i);
    }
    expandSegmentAgainstRouteUsingRedirect(e, r, n, i, o, s) {
      let {
        matched: a,
        consumedSegments: u,
        positionalParamSegments: c,
        remainingSegments: l,
      } = cc(r, i, o);
      if (!a) return Pn(r);
      i.redirectTo.startsWith("/") &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > Lw && (this.allowRedirects = !1));
      let d = this.applyRedirects.applyRedirectCommands(u, i.redirectTo, c);
      return this.applyRedirects
        .lineralizeSegments(i, d)
        .pipe(ee((f) => this.processSegment(e, n, r, f.concat(l), s, !1)));
    }
    matchSegmentAgainstRoute(e, r, n, i, o) {
      let s = xw(r, n, i, e, this.urlSerializer);
      return (
        n.path === "**" && (r.children = {}),
        s.pipe(
          Le((a) =>
            a.matched
              ? ((e = n._injector ?? e),
                this.getChildConfig(e, n, i).pipe(
                  Le(({ routes: u }) => {
                    let c = n._loadedInjector ?? e,
                      {
                        consumedSegments: l,
                        remainingSegments: d,
                        parameters: f,
                      } = a,
                      h = new Lr(
                        l,
                        f,
                        Object.freeze(g({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        $w(n),
                        nt(n),
                        n.component ?? n._loadedComponent ?? null,
                        n,
                        Bw(n)
                      ),
                      { segmentGroup: p, slicedSegments: x } = sh(r, l, d, u);
                    if (x.length === 0 && p.hasChildren())
                      return this.processChildren(c, u, p).pipe(
                        R((P) => (P === null ? null : new Ee(h, P)))
                      );
                    if (u.length === 0 && x.length === 0)
                      return _(new Ee(h, []));
                    let B = nt(n) === o;
                    return this.processSegment(c, u, p, x, B ? M : o, !0).pipe(
                      R((P) => new Ee(h, P instanceof Ee ? [P] : []))
                    );
                  })
                ))
              : Pn(r)
          )
        )
      );
    }
    getChildConfig(e, r, n) {
      return r.children
        ? _({ routes: r.children, injector: e })
        : r.loadChildren
        ? r._loadedRoutes !== void 0
          ? _({ routes: r._loadedRoutes, injector: r._loadedInjector })
          : Ew(e, r, n, this.urlSerializer).pipe(
              ee((i) =>
                i
                  ? this.configLoader.loadChildren(e, r).pipe(
                      te((o) => {
                        (r._loadedRoutes = o.routes),
                          (r._loadedInjector = o.injector);
                      })
                    )
                  : Sw(r)
              )
            )
        : _({ routes: [], injector: e });
    }
  };
function Vw(t) {
  t.sort((e, r) =>
    e.value.outlet === M
      ? -1
      : r.value.outlet === M
      ? 1
      : e.value.outlet.localeCompare(r.value.outlet)
  );
}
function jw(t) {
  let e = t.value.routeConfig;
  return e && e.path === "";
}
function Ah(t) {
  let e = [],
    r = new Set();
  for (let n of t) {
    if (!jw(n)) {
      e.push(n);
      continue;
    }
    let i = e.find((o) => n.value.routeConfig === o.value.routeConfig);
    i !== void 0 ? (i.children.push(...n.children), r.add(i)) : e.push(n);
  }
  for (let n of r) {
    let i = Ah(n.children);
    e.push(new Ee(n.value, i));
  }
  return e.filter((n) => !r.has(n));
}
function $w(t) {
  return t.data || {};
}
function Bw(t) {
  return t.resolve || {};
}
function Uw(t, e, r, n, i, o) {
  return ee((s) =>
    kw(t, e, r, n, s.extractedUrl, i, o).pipe(
      R(({ state: a, tree: u }) =>
        z(g({}, s), { targetSnapshot: a, urlAfterRedirects: u })
      )
    )
  );
}
function Hw(t, e) {
  return ee((r) => {
    let {
      targetSnapshot: n,
      guards: { canActivateChecks: i },
    } = r;
    if (!i.length) return _(r);
    let o = new Set(i.map((u) => u.route)),
      s = new Set();
    for (let u of o) if (!s.has(u)) for (let c of Nh(u)) s.add(c);
    let a = 0;
    return Y(s).pipe(
      pn((u) =>
        o.has(u)
          ? Gw(u, n, t, e)
          : ((u.data = oc(u, u.parent, t).resolve), _(void 0))
      ),
      te(() => a++),
      gn(1),
      ee((u) => (a === s.size ? _(r) : be))
    );
  });
}
function Nh(t) {
  let e = t.children.map((r) => Nh(r)).flat();
  return [t, ...e];
}
function Gw(t, e, r, n) {
  let i = t.routeConfig,
    o = t._resolve;
  return (
    i?.title !== void 0 && !Ih(i) && (o[$r] = i.title),
    zw(o, t, e, n).pipe(
      R(
        (s) => (
          (t._resolvedData = s), (t.data = oc(t, t.parent, r).resolve), null
        )
      )
    )
  );
}
function zw(t, e, r, n) {
  let i = Ou(t);
  if (i.length === 0) return _({});
  let o = {};
  return Y(i).pipe(
    ee((s) =>
      Ww(t[s], e, r, n).pipe(
        Ze(),
        te((a) => {
          o[s] = a;
        })
      )
    ),
    gn(1),
    is(o),
    mt((s) => (xh(s) ? be : fn(s)))
  );
}
function Ww(t, e, r, n) {
  let i = Br(e) ?? n,
    o = Hn(t, i),
    s = o.resolve ? o.resolve(e, r) : Yt(i, () => o(e, r));
  return At(s);
}
function Au(t) {
  return Le((e) => {
    let r = t(e);
    return r ? Y(r).pipe(R(() => e)) : _(e);
  });
}
var Oh = (() => {
    let e = class e {
      buildTitle(n) {
        let i,
          o = n.root;
        for (; o !== void 0; )
          (i = this.getResolvedTitleForRoute(o) ?? i),
            (o = o.children.find((s) => s.outlet === M));
        return i;
      }
      getResolvedTitleForRoute(n) {
        return n.data[$r];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => m(qw), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  qw = (() => {
    let e = class e extends Oh {
      constructor(n) {
        super(), (this.title = n);
      }
      updateTitle(n) {
        let i = this.buildTitle(n);
        i !== void 0 && this.title.setTitle(i);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(F(Mu));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  lc = new S("", { providedIn: "root", factory: () => ({}) }),
  dc = new S("ROUTES"),
  Zw = (() => {
    let e = class e {
      constructor() {
        (this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = m(cu));
      }
      loadComponent(n) {
        if (this.componentLoaders.get(n)) return this.componentLoaders.get(n);
        if (n._loadedComponent) return _(n._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(n);
        let i = At(n.loadComponent()).pipe(
            R(Rh),
            te((s) => {
              this.onLoadEndListener && this.onLoadEndListener(n),
                (n._loadedComponent = s);
            }),
            Zn(() => {
              this.componentLoaders.delete(n);
            })
          ),
          o = new dn(i, () => new ye()).pipe(ln());
        return this.componentLoaders.set(n, o), o;
      }
      loadChildren(n, i) {
        if (this.childrenLoaders.get(i)) return this.childrenLoaders.get(i);
        if (i._loadedRoutes)
          return _({ routes: i._loadedRoutes, injector: i._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(i);
        let s = Yw(i, this.compiler, n, this.onLoadEndListener).pipe(
            Zn(() => {
              this.childrenLoaders.delete(i);
            })
          ),
          a = new dn(s, () => new ye()).pipe(ln());
        return this.childrenLoaders.set(i, a), a;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function Yw(t, e, r, n) {
  return At(t.loadChildren()).pipe(
    R(Rh),
    ee((i) =>
      i instanceof hr || Array.isArray(i) ? _(i) : Y(e.compileModuleAsync(i))
    ),
    R((i) => {
      n && n(t);
      let o,
        s,
        a = !1;
      return (
        Array.isArray(i)
          ? ((s = i), (a = !0))
          : ((o = i.create(r).injector),
            (s = o.get(dc, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(uc), injector: o }
      );
    })
  );
}
function Qw(t) {
  return t && typeof t == "object" && "default" in t;
}
function Rh(t) {
  return Qw(t) ? t.default : t;
}
var fc = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => m(Kw), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Kw = (() => {
    let e = class e {
      shouldProcessUrl(n) {
        return !0;
      }
      extract(n) {
        return n;
      }
      merge(n, i) {
        return n;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Jw = new S("");
var Xw = (() => {
  let e = class e {
    get hasRequestedNavigation() {
      return this.navigationId !== 0;
    }
    constructor() {
      (this.currentNavigation = null),
        (this.currentTransition = null),
        (this.lastSuccessfulNavigation = null),
        (this.events = new ye()),
        (this.transitionAbortSubject = new ye()),
        (this.configLoader = m(Zw)),
        (this.environmentInjector = m(xe)),
        (this.urlSerializer = m(ic)),
        (this.rootContexts = m(Fo)),
        (this.location = m(wr)),
        (this.inputBindingEnabled = m(ac, { optional: !0 }) !== null),
        (this.titleStrategy = m(Oh)),
        (this.options = m(lc, { optional: !0 }) || {}),
        (this.paramsInheritanceStrategy =
          this.options.paramsInheritanceStrategy || "emptyOnly"),
        (this.urlHandlingStrategy = m(fc)),
        (this.createViewTransition = m(Jw, { optional: !0 })),
        (this.navigationId = 0),
        (this.afterPreactivation = () => _(void 0)),
        (this.rootComponentType = null);
      let n = (o) => this.events.next(new Bu(o)),
        i = (o) => this.events.next(new Uu(o));
      (this.configLoader.onLoadEndListener = i),
        (this.configLoader.onLoadStartListener = n);
    }
    complete() {
      this.transitions?.complete();
    }
    handleNavigationRequest(n) {
      let i = ++this.navigationId;
      this.transitions?.next(z(g(g({}, this.transitions.value), n), { id: i }));
    }
    setupNavigations(n, i, o) {
      return (
        (this.transitions = new re({
          id: 0,
          currentUrlTree: i,
          currentRawUrl: i,
          extractedUrl: this.urlHandlingStrategy.extract(i),
          urlAfterRedirects: this.urlHandlingStrategy.extract(i),
          rawUrl: i,
          extras: {},
          resolve: null,
          reject: null,
          promise: Promise.resolve(!0),
          source: Ar,
          restoredState: null,
          currentSnapshot: o.snapshot,
          targetSnapshot: null,
          currentRouterState: o,
          targetRouterState: null,
          guards: { canActivateChecks: [], canDeactivateChecks: [] },
          guardsResult: null,
        })),
        this.transitions.pipe(
          ke((s) => s.id !== 0),
          R((s) =>
            z(g({}, s), {
              extractedUrl: this.urlHandlingStrategy.extract(s.rawUrl),
            })
          ),
          Le((s) => {
            this.currentTransition = s;
            let a = !1,
              u = !1;
            return _(s).pipe(
              te((c) => {
                this.currentNavigation = {
                  id: c.id,
                  initialUrl: c.rawUrl,
                  extractedUrl: c.extractedUrl,
                  trigger: c.source,
                  extras: c.extras,
                  previousNavigation: this.lastSuccessfulNavigation
                    ? z(g({}, this.lastSuccessfulNavigation), {
                        previousNavigation: null,
                      })
                    : null,
                };
              }),
              Le((c) => {
                let l =
                    !n.navigated ||
                    this.isUpdatingInternalState() ||
                    this.isUpdatedBrowserUrl(),
                  d = c.extras.onSameUrlNavigation ?? n.onSameUrlNavigation;
                if (!l && d !== "reload") {
                  let f = "";
                  return (
                    this.events.next(
                      new rn(
                        c.id,
                        this.urlSerializer.serialize(c.rawUrl),
                        f,
                        ku.IgnoredSameUrlNavigation
                      )
                    ),
                    c.resolve(null),
                    be
                  );
                }
                if (this.urlHandlingStrategy.shouldProcessUrl(c.rawUrl))
                  return _(c).pipe(
                    Le((f) => {
                      let h = this.transitions?.getValue();
                      return (
                        this.events.next(
                          new Rr(
                            f.id,
                            this.urlSerializer.serialize(f.extractedUrl),
                            f.source,
                            f.restoredState
                          )
                        ),
                        h !== this.transitions?.getValue()
                          ? be
                          : Promise.resolve(f)
                      );
                    }),
                    Uw(
                      this.environmentInjector,
                      this.configLoader,
                      this.rootComponentType,
                      n.config,
                      this.urlSerializer,
                      this.paramsInheritanceStrategy
                    ),
                    te((f) => {
                      (s.targetSnapshot = f.targetSnapshot),
                        (s.urlAfterRedirects = f.urlAfterRedirects),
                        (this.currentNavigation = z(
                          g({}, this.currentNavigation),
                          { finalUrl: f.urlAfterRedirects }
                        ));
                      let h = new xo(
                        f.id,
                        this.urlSerializer.serialize(f.extractedUrl),
                        this.urlSerializer.serialize(f.urlAfterRedirects),
                        f.targetSnapshot
                      );
                      this.events.next(h);
                    })
                  );
                if (
                  l &&
                  this.urlHandlingStrategy.shouldProcessUrl(c.currentRawUrl)
                ) {
                  let {
                      id: f,
                      extractedUrl: h,
                      source: p,
                      restoredState: x,
                      extras: B,
                    } = c,
                    P = new Rr(f, this.urlSerializer.serialize(h), p, x);
                  this.events.next(P);
                  let me = wh(this.rootComponentType).snapshot;
                  return (
                    (this.currentTransition = s =
                      z(g({}, c), {
                        targetSnapshot: me,
                        urlAfterRedirects: h,
                        extras: z(g({}, B), {
                          skipLocationChange: !1,
                          replaceUrl: !1,
                        }),
                      })),
                    (this.currentNavigation.finalUrl = h),
                    _(s)
                  );
                } else {
                  let f = "";
                  return (
                    this.events.next(
                      new rn(
                        c.id,
                        this.urlSerializer.serialize(c.extractedUrl),
                        f,
                        ku.IgnoredByUrlHandlingStrategy
                      )
                    ),
                    c.resolve(null),
                    be
                  );
                }
              }),
              te((c) => {
                let l = new Lu(
                  c.id,
                  this.urlSerializer.serialize(c.extractedUrl),
                  this.urlSerializer.serialize(c.urlAfterRedirects),
                  c.targetSnapshot
                );
                this.events.next(l);
              }),
              R(
                (c) => (
                  (this.currentTransition = s =
                    z(g({}, c), {
                      guards: sw(
                        c.targetSnapshot,
                        c.currentSnapshot,
                        this.rootContexts
                      ),
                    })),
                  s
                )
              ),
              mw(this.environmentInjector, (c) => this.events.next(c)),
              te((c) => {
                if (((s.guardsResult = c.guardsResult), $n(c.guardsResult)))
                  throw bh(this.urlSerializer, c.guardsResult);
                let l = new Vu(
                  c.id,
                  this.urlSerializer.serialize(c.extractedUrl),
                  this.urlSerializer.serialize(c.urlAfterRedirects),
                  c.targetSnapshot,
                  !!c.guardsResult
                );
                this.events.next(l);
              }),
              ke((c) =>
                c.guardsResult
                  ? !0
                  : (this.cancelNavigationTransition(c, "", Oe.GuardRejected),
                    !1)
              ),
              Au((c) => {
                if (c.guards.canActivateChecks.length)
                  return _(c).pipe(
                    te((l) => {
                      let d = new ju(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        this.urlSerializer.serialize(l.urlAfterRedirects),
                        l.targetSnapshot
                      );
                      this.events.next(d);
                    }),
                    Le((l) => {
                      let d = !1;
                      return _(l).pipe(
                        Hw(
                          this.paramsInheritanceStrategy,
                          this.environmentInjector
                        ),
                        te({
                          next: () => (d = !0),
                          complete: () => {
                            d ||
                              this.cancelNavigationTransition(
                                l,
                                "",
                                Oe.NoDataFromResolver
                              );
                          },
                        })
                      );
                    }),
                    te((l) => {
                      let d = new $u(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        this.urlSerializer.serialize(l.urlAfterRedirects),
                        l.targetSnapshot
                      );
                      this.events.next(d);
                    })
                  );
              }),
              Au((c) => {
                let l = (d) => {
                  let f = [];
                  d.routeConfig?.loadComponent &&
                    !d.routeConfig._loadedComponent &&
                    f.push(
                      this.configLoader.loadComponent(d.routeConfig).pipe(
                        te((h) => {
                          d.component = h;
                        }),
                        R(() => {})
                      )
                    );
                  for (let h of d.children) f.push(...l(h));
                  return f;
                };
                return gi(l(c.targetSnapshot.root)).pipe(vt(null), at(1));
              }),
              Au(() => this.afterPreactivation()),
              Le(() => {
                let { currentSnapshot: c, targetSnapshot: l } = s,
                  d = this.createViewTransition?.(
                    this.environmentInjector,
                    c.root,
                    l.root
                  );
                return d ? Y(d).pipe(R(() => s)) : _(s);
              }),
              R((c) => {
                let l = JC(
                  n.routeReuseStrategy,
                  c.targetSnapshot,
                  c.currentRouterState
                );
                return (
                  (this.currentTransition = s =
                    z(g({}, c), { targetRouterState: l })),
                  (this.currentNavigation.targetRouterState = l),
                  s
                );
              }),
              te(() => {
                this.events.next(new Pr());
              }),
              ow(
                this.rootContexts,
                n.routeReuseStrategy,
                (c) => this.events.next(c),
                this.inputBindingEnabled
              ),
              at(1),
              te({
                next: (c) => {
                  (a = !0),
                    (this.lastSuccessfulNavigation = this.currentNavigation),
                    this.events.next(
                      new nn(
                        c.id,
                        this.urlSerializer.serialize(c.extractedUrl),
                        this.urlSerializer.serialize(c.urlAfterRedirects)
                      )
                    ),
                    this.titleStrategy?.updateTitle(
                      c.targetRouterState.snapshot
                    ),
                    c.resolve(!0);
                },
                complete: () => {
                  a = !0;
                },
              }),
              us(
                this.transitionAbortSubject.pipe(
                  te((c) => {
                    throw c;
                  })
                )
              ),
              Zn(() => {
                !a &&
                  !u &&
                  this.cancelNavigationTransition(
                    s,
                    "",
                    Oe.SupersededByNewNavigation
                  ),
                  this.currentNavigation?.id === s.id &&
                    (this.currentNavigation = null);
              }),
              mt((c) => {
                if (((u = !0), Sh(c)))
                  this.events.next(
                    new Tt(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      c.message,
                      c.cancellationCode
                    )
                  ),
                    tw(c) ? this.events.next(new kr(c.url)) : s.resolve(!1);
                else {
                  this.events.next(
                    new Fr(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      c,
                      s.targetSnapshot ?? void 0
                    )
                  );
                  try {
                    s.resolve(n.errorHandler(c));
                  } catch (l) {
                    this.options.resolveNavigationPromiseOnError
                      ? s.resolve(!1)
                      : s.reject(l);
                  }
                }
                return be;
              })
            );
          })
        )
      );
    }
    cancelNavigationTransition(n, i, o) {
      let s = new Tt(n.id, this.urlSerializer.serialize(n.extractedUrl), i, o);
      this.events.next(s), n.resolve(!1);
    }
    isUpdatingInternalState() {
      return (
        this.currentTransition?.extractedUrl.toString() !==
        this.currentTransition?.currentUrlTree.toString()
      );
    }
    isUpdatedBrowserUrl() {
      return (
        this.urlHandlingStrategy
          .extract(this.urlSerializer.parse(this.location.path(!0)))
          .toString() !== this.currentTransition?.extractedUrl.toString() &&
        !this.currentTransition?.extras.skipLocationChange
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function e0(t) {
  return t !== Ar;
}
var t0 = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => m(n0), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  rc = class {
    shouldDetach(e) {
      return !1;
    }
    store(e, r) {}
    shouldAttach(e) {
      return !1;
    }
    retrieve(e) {
      return null;
    }
    shouldReuseRoute(e, r) {
      return e.routeConfig === r.routeConfig;
    }
  },
  n0 = (() => {
    let e = class e extends rc {};
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = He(e)))(o || e);
      };
    })()),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Fh = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => m(r0), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  r0 = (() => {
    let e = class e extends Fh {
      constructor() {
        super(...arguments),
          (this.location = m(wr)),
          (this.urlSerializer = m(ic)),
          (this.options = m(lc, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || "replace"),
          (this.urlHandlingStrategy = m(fc)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.currentUrlTree = new xt()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = wh(null)),
          (this.stateMemento = this.createStateMemento());
      }
      getCurrentUrlTree() {
        return this.currentUrlTree;
      }
      getRawUrlTree() {
        return this.rawUrlTree;
      }
      restoredState() {
        return this.location.getState();
      }
      get browserPageId() {
        return this.canceledNavigationResolution !== "computed"
          ? this.currentPageId
          : this.restoredState()?.ɵrouterPageId ?? this.currentPageId;
      }
      getRouterState() {
        return this.routerState;
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        };
      }
      registerNonRouterCurrentEntryChangeListener(n) {
        return this.location.subscribe((i) => {
          i.type === "popstate" && n(i.url, i.state);
        });
      }
      handleRouterEvent(n, i) {
        if (n instanceof Rr) this.stateMemento = this.createStateMemento();
        else if (n instanceof rn) this.rawUrlTree = i.initialUrl;
        else if (n instanceof xo) {
          if (
            this.urlUpdateStrategy === "eager" &&
            !i.extras.skipLocationChange
          ) {
            let o = this.urlHandlingStrategy.merge(i.finalUrl, i.initialUrl);
            this.setBrowserUrl(o, i);
          }
        } else
          n instanceof Pr
            ? ((this.currentUrlTree = i.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                i.finalUrl,
                i.initialUrl
              )),
              (this.routerState = i.targetRouterState),
              this.urlUpdateStrategy === "deferred" &&
                (i.extras.skipLocationChange ||
                  this.setBrowserUrl(this.rawUrlTree, i)))
            : n instanceof Tt &&
              (n.code === Oe.GuardRejected || n.code === Oe.NoDataFromResolver)
            ? this.restoreHistory(i)
            : n instanceof Fr
            ? this.restoreHistory(i, !0)
            : n instanceof nn &&
              ((this.lastSuccessfulId = n.id),
              (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(n, i) {
        let o = this.urlSerializer.serialize(n);
        if (this.location.isCurrentPathEqualTo(o) || i.extras.replaceUrl) {
          let s = this.browserPageId,
            a = g(g({}, i.extras.state), this.generateNgRouterState(i.id, s));
          this.location.replaceState(o, "", a);
        } else {
          let s = g(
            g({}, i.extras.state),
            this.generateNgRouterState(i.id, this.browserPageId + 1)
          );
          this.location.go(o, "", s);
        }
      }
      restoreHistory(n, i = !1) {
        if (this.canceledNavigationResolution === "computed") {
          let o = this.browserPageId,
            s = this.currentPageId - o;
          s !== 0
            ? this.location.historyGo(s)
            : this.currentUrlTree === n.finalUrl &&
              s === 0 &&
              (this.resetState(n), this.resetUrlToCurrentUrlTree());
        } else
          this.canceledNavigationResolution === "replace" &&
            (i && this.resetState(n), this.resetUrlToCurrentUrlTree());
      }
      resetState(n) {
        (this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            n.finalUrl ?? this.rawUrlTree
          ));
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.rawUrlTree),
          "",
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId)
        );
      }
      generateNgRouterState(n, i) {
        return this.canceledNavigationResolution === "computed"
          ? { navigationId: n, ɵrouterPageId: i }
          : { navigationId: n };
      }
    };
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = He(e)))(o || e);
      };
    })()),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  xr = (function (t) {
    return (
      (t[(t.COMPLETE = 0)] = "COMPLETE"),
      (t[(t.FAILED = 1)] = "FAILED"),
      (t[(t.REDIRECTING = 2)] = "REDIRECTING"),
      t
    );
  })(xr || {});
function i0(t, e) {
  t.events
    .pipe(
      ke(
        (r) =>
          r instanceof nn ||
          r instanceof Tt ||
          r instanceof Fr ||
          r instanceof rn
      ),
      R((r) =>
        r instanceof nn || r instanceof rn
          ? xr.COMPLETE
          : (
              r instanceof Tt
                ? r.code === Oe.Redirect ||
                  r.code === Oe.SupersededByNewNavigation
                : !1
            )
          ? xr.REDIRECTING
          : xr.FAILED
      ),
      ke((r) => r !== xr.REDIRECTING),
      at(1)
    )
    .subscribe(() => {
      e();
    });
}
function o0(t) {
  throw t;
}
var s0 = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact",
  },
  a0 = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset",
  },
  Ph = (() => {
    let e = class e {
      get currentUrlTree() {
        return this.stateManager.getCurrentUrlTree();
      }
      get rawUrlTree() {
        return this.stateManager.getRawUrlTree();
      }
      get events() {
        return this._events;
      }
      get routerState() {
        return this.stateManager.getRouterState();
      }
      constructor() {
        (this.disposed = !1),
          (this.isNgZoneEnabled = !1),
          (this.console = m(fo)),
          (this.stateManager = m(Fh)),
          (this.options = m(lc, { optional: !0 }) || {}),
          (this.pendingTasks = m(ho)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.navigationTransitions = m(Xw)),
          (this.urlSerializer = m(ic)),
          (this.location = m(wr)),
          (this.urlHandlingStrategy = m(fc)),
          (this._events = new ye()),
          (this.errorHandler = this.options.errorHandler || o0),
          (this.navigated = !1),
          (this.routeReuseStrategy = m(t0)),
          (this.onSameUrlNavigation =
            this.options.onSameUrlNavigation || "ignore"),
          (this.config = m(dc, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!m(ac, { optional: !0 })),
          (this.eventsSubscription = new X()),
          (this.isNgZoneEnabled = m(J) instanceof J && J.isInAngularZone()),
          this.resetConfig(this.config),
          this.navigationTransitions
            .setupNavigations(this, this.currentUrlTree, this.routerState)
            .subscribe({
              error: (n) => {
                this.console.warn(n);
              },
            }),
          this.subscribeToNavigationEvents();
      }
      subscribeToNavigationEvents() {
        let n = this.navigationTransitions.events.subscribe((i) => {
          try {
            let o = this.navigationTransitions.currentTransition,
              s = this.navigationTransitions.currentNavigation;
            if (o !== null && s !== null) {
              if (
                (this.stateManager.handleRouterEvent(i, s),
                i instanceof Tt &&
                  i.code !== Oe.Redirect &&
                  i.code !== Oe.SupersededByNewNavigation)
              )
                this.navigated = !0;
              else if (i instanceof nn) this.navigated = !0;
              else if (i instanceof kr) {
                let a = this.urlHandlingStrategy.merge(i.url, o.currentRawUrl),
                  u = {
                    info: o.extras.info,
                    skipLocationChange: o.extras.skipLocationChange,
                    replaceUrl:
                      this.urlUpdateStrategy === "eager" || e0(o.source),
                  };
                this.scheduleNavigation(a, Ar, null, u, {
                  resolve: o.resolve,
                  reject: o.reject,
                  promise: o.promise,
                });
              }
            }
            c0(i) && this._events.next(i);
          } catch (o) {
            this.navigationTransitions.transitionAbortSubject.next(o);
          }
        });
        this.eventsSubscription.add(n);
      }
      resetRootComponentType(n) {
        (this.routerState.root.component = n),
          (this.navigationTransitions.rootComponentType = n);
      }
      initialNavigation() {
        this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(
              this.location.path(!0),
              Ar,
              this.stateManager.restoredState()
            );
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ??=
          this.stateManager.registerNonRouterCurrentEntryChangeListener(
            (n, i) => {
              setTimeout(() => {
                this.navigateToSyncWithBrowser(n, "popstate", i);
              }, 0);
            }
          );
      }
      navigateToSyncWithBrowser(n, i, o) {
        let s = { replaceUrl: !0 },
          a = o?.navigationId ? o : null;
        if (o) {
          let c = g({}, o);
          delete c.navigationId,
            delete c.ɵrouterPageId,
            Object.keys(c).length !== 0 && (s.state = c);
        }
        let u = this.parseUrl(n);
        this.scheduleNavigation(u, i, a, s);
      }
      get url() {
        return this.serializeUrl(this.currentUrlTree);
      }
      getCurrentNavigation() {
        return this.navigationTransitions.currentNavigation;
      }
      get lastSuccessfulNavigation() {
        return this.navigationTransitions.lastSuccessfulNavigation;
      }
      resetConfig(n) {
        (this.config = n.map(uc)), (this.navigated = !1);
      }
      ngOnDestroy() {
        this.dispose();
      }
      dispose() {
        this.navigationTransitions.complete(),
          this.nonRouterCurrentEntryChangeSubscription &&
            (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
            (this.nonRouterCurrentEntryChangeSubscription = void 0)),
          (this.disposed = !0),
          this.eventsSubscription.unsubscribe();
      }
      createUrlTree(n, i = {}) {
        let {
            relativeTo: o,
            queryParams: s,
            fragment: a,
            queryParamsHandling: u,
            preserveFragment: c,
          } = i,
          l = c ? this.currentUrlTree.fragment : a,
          d = null;
        switch (u) {
          case "merge":
            d = g(g({}, this.currentUrlTree.queryParams), s);
            break;
          case "preserve":
            d = this.currentUrlTree.queryParams;
            break;
          default:
            d = s || null;
        }
        d !== null && (d = this.removeEmptyProps(d));
        let f;
        try {
          let h = o ? o.snapshot : this.routerState.snapshot.root;
          f = vh(h);
        } catch {
          (typeof n[0] != "string" || !n[0].startsWith("/")) && (n = []),
            (f = this.currentUrlTree.root);
        }
        return yh(f, n, d, l ?? null);
      }
      navigateByUrl(n, i = { skipLocationChange: !1 }) {
        let o = $n(n) ? n : this.parseUrl(n),
          s = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
        return this.scheduleNavigation(s, Ar, null, i);
      }
      navigate(n, i = { skipLocationChange: !1 }) {
        return u0(n), this.navigateByUrl(this.createUrlTree(n, i), i);
      }
      serializeUrl(n) {
        return this.urlSerializer.serialize(n);
      }
      parseUrl(n) {
        try {
          return this.urlSerializer.parse(n);
        } catch {
          return this.urlSerializer.parse("/");
        }
      }
      isActive(n, i) {
        let o;
        if (
          (i === !0 ? (o = g({}, s0)) : i === !1 ? (o = g({}, a0)) : (o = i),
          $n(n))
        )
          return nh(this.currentUrlTree, n, o);
        let s = this.parseUrl(n);
        return nh(this.currentUrlTree, s, o);
      }
      removeEmptyProps(n) {
        return Object.entries(n).reduce(
          (i, [o, s]) => (s != null && (i[o] = s), i),
          {}
        );
      }
      scheduleNavigation(n, i, o, s, a) {
        if (this.disposed) return Promise.resolve(!1);
        let u, c, l;
        a
          ? ((u = a.resolve), (c = a.reject), (l = a.promise))
          : (l = new Promise((f, h) => {
              (u = f), (c = h);
            }));
        let d = this.pendingTasks.add();
        return (
          i0(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(d));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: i,
            restoredState: o,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: n,
            extras: s,
            resolve: u,
            reject: c,
            promise: l,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          l.catch((f) => Promise.reject(f))
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function u0(t) {
  for (let e = 0; e < t.length; e++) if (t[e] == null) throw new y(4008, !1);
}
function c0(t) {
  return !(t instanceof Pr) && !(t instanceof kr);
}
var l0 = new S("");
function kh(t, ...e) {
  return eo([
    { provide: dc, multi: !0, useValue: t },
    [],
    { provide: Bn, useFactory: d0, deps: [Ph] },
    { provide: lu, multi: !0, useFactory: f0 },
    e.map((r) => r.ɵproviders),
  ]);
}
function d0(t) {
  return t.routerState.root;
}
function f0() {
  let t = m(Qt);
  return (e) => {
    let r = t.get(Cr);
    if (e !== r.components[0]) return;
    let n = t.get(Ph),
      i = t.get(h0);
    t.get(p0) === 1 && n.initialNavigation(),
      t.get(g0, null, T.Optional)?.setUpPreloading(),
      t.get(l0, null, T.Optional)?.init(),
      n.resetRootComponentType(r.componentTypes[0]),
      i.closed || (i.next(), i.complete(), i.unsubscribe());
  };
}
var h0 = new S("", { factory: () => new ye() }),
  p0 = new S("", { providedIn: "root", factory: () => 1 });
var g0 = new S("");
var Lh = [];
var Vh = { providers: [kh(Lh)] };
var Hr = (function (t) {
  return (
    (t.NOT_STARTED = "not_started"),
    (t.IN_PROGRESS = "in_progress"),
    (t.DONE = "done"),
    t
  );
})(Hr || {});
var m0 = ["textarea"],
  Gn = (() => {
    let e = class e {
      constructor() {
        (this.eventChangeDescription = new U()),
          (this.changeStatus = new U()),
          (this.deleteItem = new U()),
          (this.TodoStatus = Hr),
          (this.isShowDescription = !1);
      }
      ngOnInit() {
        this.description = this.todoItem.description;
      }
      toggleDescription() {
        (this.isShowDescription = !this.isShowDescription),
          this.isShowDescription && setTimeout(() => this.autoResize(), 0);
      }
      emitChangeDescription(n) {
        this.eventChangeDescription.emit({ description: n, index: this.index });
      }
      emitChangeStatus(n) {
        this.changeStatus.emit({ status: n, index: this.index });
      }
      emitDeleteItem() {
        this.deleteItem.emit(this.index);
      }
      autoResize() {
        if (!this.textarea || !this.textarea.nativeElement) return;
        let n = this.textarea.nativeElement;
        (n.style.height = "auto"), (n.style.height = `${n.scrollHeight}px`);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵdir = le({
        type: e,
        viewQuery: function (i, o) {
          if ((i & 1 && xf(m0, 5), i & 2)) {
            let s;
            ou((s = su())) && (o.textarea = s.first);
          }
        },
        inputs: { todoItem: "todoItem", index: "index" },
        outputs: {
          eventChangeDescription: "eventChangeDescription",
          changeStatus: "changeStatus",
          deleteItem: "deleteItem",
        },
      }));
    let t = e;
    return t;
  })();
var Wh = (() => {
    let e = class e {
      constructor(n, i) {
        (this._renderer = n),
          (this._elementRef = i),
          (this.onChange = (o) => {}),
          (this.onTouched = () => {});
      }
      setProperty(n, i) {
        this._renderer.setProperty(this._elementRef.nativeElement, n, i);
      }
      registerOnTouched(n) {
        this.onTouched = n;
      }
      registerOnChange(n) {
        this.onChange = n;
      }
      setDisabledState(n) {
        this.setProperty("disabled", n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(W(Kt), W(Ge));
    }),
      (e.ɵdir = le({ type: e }));
    let t = e;
    return t;
  })(),
  v0 = (() => {
    let e = class e extends Wh {};
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = He(e)))(o || e);
      };
    })()),
      (e.ɵdir = le({ type: e, features: [Ae] }));
    let t = e;
    return t;
  })(),
  qh = new S("NgValueAccessor");
var y0 = { provide: qh, useExisting: pr(() => rt), multi: !0 };
function D0() {
  let t = ht() ? ht().getUserAgent() : "";
  return /android (\d+)/.test(t.toLowerCase());
}
var C0 = new S("CompositionEventMode"),
  rt = (() => {
    let e = class e extends Wh {
      constructor(n, i, o) {
        super(n, i),
          (this._compositionMode = o),
          (this._composing = !1),
          this._compositionMode == null && (this._compositionMode = !D0());
      }
      writeValue(n) {
        let i = n ?? "";
        this.setProperty("value", i);
      }
      _handleInput(n) {
        (!this._compositionMode ||
          (this._compositionMode && !this._composing)) &&
          this.onChange(n);
      }
      _compositionStart() {
        this._composing = !0;
      }
      _compositionEnd(n) {
        (this._composing = !1), this._compositionMode && this.onChange(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(W(Kt), W(Ge), W(C0, 8));
    }),
      (e.ɵdir = le({
        type: e,
        selectors: [
          ["input", "formControlName", "", 3, "type", "checkbox"],
          ["textarea", "formControlName", ""],
          ["input", "formControl", "", 3, "type", "checkbox"],
          ["textarea", "formControl", ""],
          ["input", "ngModel", "", 3, "type", "checkbox"],
          ["textarea", "ngModel", ""],
          ["", "ngDefaultControl", ""],
        ],
        hostBindings: function (i, o) {
          i & 1 &&
            j("input", function (a) {
              return o._handleInput(a.target.value);
            })("blur", function () {
              return o.onTouched();
            })("compositionstart", function () {
              return o._compositionStart();
            })("compositionend", function (a) {
              return o._compositionEnd(a.target.value);
            });
        },
        features: [au([y0]), Ae],
      }));
    let t = e;
    return t;
  })();
var w0 = new S("NgValidators"),
  _0 = new S("NgAsyncValidators");
function Zh(t) {
  return t != null;
}
function Yh(t) {
  return Jt(t) ? Y(t) : t;
}
function Qh(t) {
  let e = {};
  return (
    t.forEach((r) => {
      e = r != null ? g(g({}, e), r) : e;
    }),
    Object.keys(e).length === 0 ? null : e
  );
}
function Kh(t, e) {
  return e.map((r) => r(t));
}
function I0(t) {
  return !t.validate;
}
function Jh(t) {
  return t.map((e) => (I0(e) ? e : (r) => e.validate(r)));
}
function E0(t) {
  if (!t) return null;
  let e = t.filter(Zh);
  return e.length == 0
    ? null
    : function (r) {
        return Qh(Kh(r, e));
      };
}
function Xh(t) {
  return t != null ? E0(Jh(t)) : null;
}
function b0(t) {
  if (!t) return null;
  let e = t.filter(Zh);
  return e.length == 0
    ? null
    : function (r) {
        let n = Kh(r, e).map(Yh);
        return rs(n).pipe(R(Qh));
      };
}
function ep(t) {
  return t != null ? b0(Jh(t)) : null;
}
function jh(t, e) {
  return t === null ? [e] : Array.isArray(t) ? [...t, e] : [t, e];
}
function M0(t) {
  return t._rawValidators;
}
function S0(t) {
  return t._rawAsyncValidators;
}
function hc(t) {
  return t ? (Array.isArray(t) ? t : [t]) : [];
}
function Lo(t, e) {
  return Array.isArray(t) ? t.includes(e) : t === e;
}
function $h(t, e) {
  let r = hc(e);
  return (
    hc(t).forEach((i) => {
      Lo(r, i) || r.push(i);
    }),
    r
  );
}
function Bh(t, e) {
  return hc(e).filter((r) => !Lo(t, r));
}
var Vo = class {
    constructor() {
      (this._rawValidators = []),
        (this._rawAsyncValidators = []),
        (this._onDestroyCallbacks = []);
    }
    get value() {
      return this.control ? this.control.value : null;
    }
    get valid() {
      return this.control ? this.control.valid : null;
    }
    get invalid() {
      return this.control ? this.control.invalid : null;
    }
    get pending() {
      return this.control ? this.control.pending : null;
    }
    get disabled() {
      return this.control ? this.control.disabled : null;
    }
    get enabled() {
      return this.control ? this.control.enabled : null;
    }
    get errors() {
      return this.control ? this.control.errors : null;
    }
    get pristine() {
      return this.control ? this.control.pristine : null;
    }
    get dirty() {
      return this.control ? this.control.dirty : null;
    }
    get touched() {
      return this.control ? this.control.touched : null;
    }
    get status() {
      return this.control ? this.control.status : null;
    }
    get untouched() {
      return this.control ? this.control.untouched : null;
    }
    get statusChanges() {
      return this.control ? this.control.statusChanges : null;
    }
    get valueChanges() {
      return this.control ? this.control.valueChanges : null;
    }
    get path() {
      return null;
    }
    _setValidators(e) {
      (this._rawValidators = e || []),
        (this._composedValidatorFn = Xh(this._rawValidators));
    }
    _setAsyncValidators(e) {
      (this._rawAsyncValidators = e || []),
        (this._composedAsyncValidatorFn = ep(this._rawAsyncValidators));
    }
    get validator() {
      return this._composedValidatorFn || null;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn || null;
    }
    _registerOnDestroy(e) {
      this._onDestroyCallbacks.push(e);
    }
    _invokeOnDestroyCallbacks() {
      this._onDestroyCallbacks.forEach((e) => e()),
        (this._onDestroyCallbacks = []);
    }
    reset(e = void 0) {
      this.control && this.control.reset(e);
    }
    hasError(e, r) {
      return this.control ? this.control.hasError(e, r) : !1;
    }
    getError(e, r) {
      return this.control ? this.control.getError(e, r) : null;
    }
  },
  pc = class extends Vo {
    get formDirective() {
      return null;
    }
    get path() {
      return null;
    }
  },
  Wr = class extends Vo {
    constructor() {
      super(...arguments),
        (this._parent = null),
        (this.name = null),
        (this.valueAccessor = null);
    }
  },
  gc = class {
    constructor(e) {
      this._cd = e;
    }
    get isTouched() {
      return !!this._cd?.control?.touched;
    }
    get isUntouched() {
      return !!this._cd?.control?.untouched;
    }
    get isPristine() {
      return !!this._cd?.control?.pristine;
    }
    get isDirty() {
      return !!this._cd?.control?.dirty;
    }
    get isValid() {
      return !!this._cd?.control?.valid;
    }
    get isInvalid() {
      return !!this._cd?.control?.invalid;
    }
    get isPending() {
      return !!this._cd?.control?.pending;
    }
    get isSubmitted() {
      return !!this._cd?.submitted;
    }
  },
  x0 = {
    "[class.ng-untouched]": "isUntouched",
    "[class.ng-touched]": "isTouched",
    "[class.ng-pristine]": "isPristine",
    "[class.ng-dirty]": "isDirty",
    "[class.ng-valid]": "isValid",
    "[class.ng-invalid]": "isInvalid",
    "[class.ng-pending]": "isPending",
  },
  JT = z(g({}, x0), { "[class.ng-submitted]": "isSubmitted" }),
  Nt = (() => {
    let e = class e extends gc {
      constructor(n) {
        super(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(W(Wr, 2));
    }),
      (e.ɵdir = le({
        type: e,
        selectors: [
          ["", "formControlName", ""],
          ["", "ngModel", ""],
          ["", "formControl", ""],
        ],
        hostVars: 14,
        hostBindings: function (i, o) {
          i & 2 &&
            tu("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)(
              "ng-pristine",
              o.isPristine
            )("ng-dirty", o.isDirty)("ng-valid", o.isValid)(
              "ng-invalid",
              o.isInvalid
            )("ng-pending", o.isPending);
        },
        features: [Ae],
      }));
    let t = e;
    return t;
  })();
var Gr = "VALID",
  ko = "INVALID",
  zn = "PENDING",
  zr = "DISABLED";
function T0(t) {
  return (jo(t) ? t.validators : t) || null;
}
function A0(t) {
  return Array.isArray(t) ? Xh(t) : t || null;
}
function N0(t, e) {
  return (jo(e) ? e.asyncValidators : t) || null;
}
function O0(t) {
  return Array.isArray(t) ? ep(t) : t || null;
}
function jo(t) {
  return t != null && !Array.isArray(t) && typeof t == "object";
}
var mc = class {
  constructor(e, r) {
    (this._pendingDirty = !1),
      (this._hasOwnPendingAsyncValidator = !1),
      (this._pendingTouched = !1),
      (this._onCollectionChange = () => {}),
      (this._parent = null),
      (this.pristine = !0),
      (this.touched = !1),
      (this._onDisabledChange = []),
      this._assignValidators(e),
      this._assignAsyncValidators(r);
  }
  get validator() {
    return this._composedValidatorFn;
  }
  set validator(e) {
    this._rawValidators = this._composedValidatorFn = e;
  }
  get asyncValidator() {
    return this._composedAsyncValidatorFn;
  }
  set asyncValidator(e) {
    this._rawAsyncValidators = this._composedAsyncValidatorFn = e;
  }
  get parent() {
    return this._parent;
  }
  get valid() {
    return this.status === Gr;
  }
  get invalid() {
    return this.status === ko;
  }
  get pending() {
    return this.status == zn;
  }
  get disabled() {
    return this.status === zr;
  }
  get enabled() {
    return this.status !== zr;
  }
  get dirty() {
    return !this.pristine;
  }
  get untouched() {
    return !this.touched;
  }
  get updateOn() {
    return this._updateOn
      ? this._updateOn
      : this.parent
      ? this.parent.updateOn
      : "change";
  }
  setValidators(e) {
    this._assignValidators(e);
  }
  setAsyncValidators(e) {
    this._assignAsyncValidators(e);
  }
  addValidators(e) {
    this.setValidators($h(e, this._rawValidators));
  }
  addAsyncValidators(e) {
    this.setAsyncValidators($h(e, this._rawAsyncValidators));
  }
  removeValidators(e) {
    this.setValidators(Bh(e, this._rawValidators));
  }
  removeAsyncValidators(e) {
    this.setAsyncValidators(Bh(e, this._rawAsyncValidators));
  }
  hasValidator(e) {
    return Lo(this._rawValidators, e);
  }
  hasAsyncValidator(e) {
    return Lo(this._rawAsyncValidators, e);
  }
  clearValidators() {
    this.validator = null;
  }
  clearAsyncValidators() {
    this.asyncValidator = null;
  }
  markAsTouched(e = {}) {
    (this.touched = !0),
      this._parent && !e.onlySelf && this._parent.markAsTouched(e);
  }
  markAllAsTouched() {
    this.markAsTouched({ onlySelf: !0 }),
      this._forEachChild((e) => e.markAllAsTouched());
  }
  markAsUntouched(e = {}) {
    (this.touched = !1),
      (this._pendingTouched = !1),
      this._forEachChild((r) => {
        r.markAsUntouched({ onlySelf: !0 });
      }),
      this._parent && !e.onlySelf && this._parent._updateTouched(e);
  }
  markAsDirty(e = {}) {
    (this.pristine = !1),
      this._parent && !e.onlySelf && this._parent.markAsDirty(e);
  }
  markAsPristine(e = {}) {
    (this.pristine = !0),
      (this._pendingDirty = !1),
      this._forEachChild((r) => {
        r.markAsPristine({ onlySelf: !0 });
      }),
      this._parent && !e.onlySelf && this._parent._updatePristine(e);
  }
  markAsPending(e = {}) {
    (this.status = zn),
      e.emitEvent !== !1 && this.statusChanges.emit(this.status),
      this._parent && !e.onlySelf && this._parent.markAsPending(e);
  }
  disable(e = {}) {
    let r = this._parentMarkedDirty(e.onlySelf);
    (this.status = zr),
      (this.errors = null),
      this._forEachChild((n) => {
        n.disable(z(g({}, e), { onlySelf: !0 }));
      }),
      this._updateValue(),
      e.emitEvent !== !1 &&
        (this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
      this._updateAncestors(z(g({}, e), { skipPristineCheck: r })),
      this._onDisabledChange.forEach((n) => n(!0));
  }
  enable(e = {}) {
    let r = this._parentMarkedDirty(e.onlySelf);
    (this.status = Gr),
      this._forEachChild((n) => {
        n.enable(z(g({}, e), { onlySelf: !0 }));
      }),
      this.updateValueAndValidity({ onlySelf: !0, emitEvent: e.emitEvent }),
      this._updateAncestors(z(g({}, e), { skipPristineCheck: r })),
      this._onDisabledChange.forEach((n) => n(!1));
  }
  _updateAncestors(e) {
    this._parent &&
      !e.onlySelf &&
      (this._parent.updateValueAndValidity(e),
      e.skipPristineCheck || this._parent._updatePristine(),
      this._parent._updateTouched());
  }
  setParent(e) {
    this._parent = e;
  }
  getRawValue() {
    return this.value;
  }
  updateValueAndValidity(e = {}) {
    this._setInitialStatus(),
      this._updateValue(),
      this.enabled &&
        (this._cancelExistingSubscription(),
        (this.errors = this._runValidator()),
        (this.status = this._calculateStatus()),
        (this.status === Gr || this.status === zn) &&
          this._runAsyncValidator(e.emitEvent)),
      e.emitEvent !== !1 &&
        (this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
      this._parent && !e.onlySelf && this._parent.updateValueAndValidity(e);
  }
  _updateTreeValidity(e = { emitEvent: !0 }) {
    this._forEachChild((r) => r._updateTreeValidity(e)),
      this.updateValueAndValidity({ onlySelf: !0, emitEvent: e.emitEvent });
  }
  _setInitialStatus() {
    this.status = this._allControlsDisabled() ? zr : Gr;
  }
  _runValidator() {
    return this.validator ? this.validator(this) : null;
  }
  _runAsyncValidator(e) {
    if (this.asyncValidator) {
      (this.status = zn), (this._hasOwnPendingAsyncValidator = !0);
      let r = Yh(this.asyncValidator(this));
      this._asyncValidationSubscription = r.subscribe((n) => {
        (this._hasOwnPendingAsyncValidator = !1),
          this.setErrors(n, { emitEvent: e });
      });
    }
  }
  _cancelExistingSubscription() {
    this._asyncValidationSubscription &&
      (this._asyncValidationSubscription.unsubscribe(),
      (this._hasOwnPendingAsyncValidator = !1));
  }
  setErrors(e, r = {}) {
    (this.errors = e), this._updateControlsErrors(r.emitEvent !== !1);
  }
  get(e) {
    let r = e;
    return r == null || (Array.isArray(r) || (r = r.split(".")), r.length === 0)
      ? null
      : r.reduce((n, i) => n && n._find(i), this);
  }
  getError(e, r) {
    let n = r ? this.get(r) : this;
    return n && n.errors ? n.errors[e] : null;
  }
  hasError(e, r) {
    return !!this.getError(e, r);
  }
  get root() {
    let e = this;
    for (; e._parent; ) e = e._parent;
    return e;
  }
  _updateControlsErrors(e) {
    (this.status = this._calculateStatus()),
      e && this.statusChanges.emit(this.status),
      this._parent && this._parent._updateControlsErrors(e);
  }
  _initObservables() {
    (this.valueChanges = new U()), (this.statusChanges = new U());
  }
  _calculateStatus() {
    return this._allControlsDisabled()
      ? zr
      : this.errors
      ? ko
      : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(zn)
      ? zn
      : this._anyControlsHaveStatus(ko)
      ? ko
      : Gr;
  }
  _anyControlsHaveStatus(e) {
    return this._anyControls((r) => r.status === e);
  }
  _anyControlsDirty() {
    return this._anyControls((e) => e.dirty);
  }
  _anyControlsTouched() {
    return this._anyControls((e) => e.touched);
  }
  _updatePristine(e = {}) {
    (this.pristine = !this._anyControlsDirty()),
      this._parent && !e.onlySelf && this._parent._updatePristine(e);
  }
  _updateTouched(e = {}) {
    (this.touched = this._anyControlsTouched()),
      this._parent && !e.onlySelf && this._parent._updateTouched(e);
  }
  _registerOnCollectionChange(e) {
    this._onCollectionChange = e;
  }
  _setUpdateStrategy(e) {
    jo(e) && e.updateOn != null && (this._updateOn = e.updateOn);
  }
  _parentMarkedDirty(e) {
    let r = this._parent && this._parent.dirty;
    return !e && !!r && !this._parent._anyControlsDirty();
  }
  _find(e) {
    return null;
  }
  _assignValidators(e) {
    (this._rawValidators = Array.isArray(e) ? e.slice() : e),
      (this._composedValidatorFn = A0(this._rawValidators));
  }
  _assignAsyncValidators(e) {
    (this._rawAsyncValidators = Array.isArray(e) ? e.slice() : e),
      (this._composedAsyncValidatorFn = O0(this._rawAsyncValidators));
  }
};
var tp = new S("CallSetDisabledState", {
    providedIn: "root",
    factory: () => vc,
  }),
  vc = "always";
function R0(t, e) {
  return [...e.path, t];
}
function F0(t, e, r = vc) {
  k0(t, e),
    e.valueAccessor.writeValue(t.value),
    (t.disabled || r === "always") &&
      e.valueAccessor.setDisabledState?.(t.disabled),
    L0(t, e),
    j0(t, e),
    V0(t, e),
    P0(t, e);
}
function Uh(t, e) {
  t.forEach((r) => {
    r.registerOnValidatorChange && r.registerOnValidatorChange(e);
  });
}
function P0(t, e) {
  if (e.valueAccessor.setDisabledState) {
    let r = (n) => {
      e.valueAccessor.setDisabledState(n);
    };
    t.registerOnDisabledChange(r),
      e._registerOnDestroy(() => {
        t._unregisterOnDisabledChange(r);
      });
  }
}
function k0(t, e) {
  let r = M0(t);
  e.validator !== null
    ? t.setValidators(jh(r, e.validator))
    : typeof r == "function" && t.setValidators([r]);
  let n = S0(t);
  e.asyncValidator !== null
    ? t.setAsyncValidators(jh(n, e.asyncValidator))
    : typeof n == "function" && t.setAsyncValidators([n]);
  let i = () => t.updateValueAndValidity();
  Uh(e._rawValidators, i), Uh(e._rawAsyncValidators, i);
}
function L0(t, e) {
  e.valueAccessor.registerOnChange((r) => {
    (t._pendingValue = r),
      (t._pendingChange = !0),
      (t._pendingDirty = !0),
      t.updateOn === "change" && np(t, e);
  });
}
function V0(t, e) {
  e.valueAccessor.registerOnTouched(() => {
    (t._pendingTouched = !0),
      t.updateOn === "blur" && t._pendingChange && np(t, e),
      t.updateOn !== "submit" && t.markAsTouched();
  });
}
function np(t, e) {
  t._pendingDirty && t.markAsDirty(),
    t.setValue(t._pendingValue, { emitModelToViewChange: !1 }),
    e.viewToModelUpdate(t._pendingValue),
    (t._pendingChange = !1);
}
function j0(t, e) {
  let r = (n, i) => {
    e.valueAccessor.writeValue(n), i && e.viewToModelUpdate(n);
  };
  t.registerOnChange(r),
    e._registerOnDestroy(() => {
      t._unregisterOnChange(r);
    });
}
function $0(t, e) {
  if (!t.hasOwnProperty("model")) return !1;
  let r = t.model;
  return r.isFirstChange() ? !0 : !Object.is(e, r.currentValue);
}
function B0(t) {
  return Object.getPrototypeOf(t.constructor) === v0;
}
function U0(t, e) {
  if (!e) return null;
  Array.isArray(e);
  let r, n, i;
  return (
    e.forEach((o) => {
      o.constructor === rt ? (r = o) : B0(o) ? (n = o) : (i = o);
    }),
    i || n || r || null
  );
}
function Hh(t, e) {
  let r = t.indexOf(e);
  r > -1 && t.splice(r, 1);
}
function Gh(t) {
  return (
    typeof t == "object" &&
    t !== null &&
    Object.keys(t).length === 2 &&
    "value" in t &&
    "disabled" in t
  );
}
var H0 = class extends mc {
  constructor(e = null, r, n) {
    super(T0(r), N0(n, r)),
      (this.defaultValue = null),
      (this._onChange = []),
      (this._pendingChange = !1),
      this._applyFormState(e),
      this._setUpdateStrategy(r),
      this._initObservables(),
      this.updateValueAndValidity({
        onlySelf: !0,
        emitEvent: !!this.asyncValidator,
      }),
      jo(r) &&
        (r.nonNullable || r.initialValueIsDefault) &&
        (Gh(e) ? (this.defaultValue = e.value) : (this.defaultValue = e));
  }
  setValue(e, r = {}) {
    (this.value = this._pendingValue = e),
      this._onChange.length &&
        r.emitModelToViewChange !== !1 &&
        this._onChange.forEach((n) =>
          n(this.value, r.emitViewToModelChange !== !1)
        ),
      this.updateValueAndValidity(r);
  }
  patchValue(e, r = {}) {
    this.setValue(e, r);
  }
  reset(e = this.defaultValue, r = {}) {
    this._applyFormState(e),
      this.markAsPristine(r),
      this.markAsUntouched(r),
      this.setValue(this.value, r),
      (this._pendingChange = !1);
  }
  _updateValue() {}
  _anyControls(e) {
    return !1;
  }
  _allControlsDisabled() {
    return this.disabled;
  }
  registerOnChange(e) {
    this._onChange.push(e);
  }
  _unregisterOnChange(e) {
    Hh(this._onChange, e);
  }
  registerOnDisabledChange(e) {
    this._onDisabledChange.push(e);
  }
  _unregisterOnDisabledChange(e) {
    Hh(this._onDisabledChange, e);
  }
  _forEachChild(e) {}
  _syncPendingControls() {
    return this.updateOn === "submit" &&
      (this._pendingDirty && this.markAsDirty(),
      this._pendingTouched && this.markAsTouched(),
      this._pendingChange)
      ? (this.setValue(this._pendingValue, {
          onlySelf: !0,
          emitModelToViewChange: !1,
        }),
        !0)
      : !1;
  }
  _applyFormState(e) {
    Gh(e)
      ? ((this.value = this._pendingValue = e.value),
        e.disabled
          ? this.disable({ onlySelf: !0, emitEvent: !1 })
          : this.enable({ onlySelf: !0, emitEvent: !1 }))
      : (this.value = this._pendingValue = e);
  }
};
var G0 = { provide: Wr, useExisting: pr(() => pt) },
  zh = Promise.resolve(),
  pt = (() => {
    let e = class e extends Wr {
      constructor(n, i, o, s, a, u) {
        super(),
          (this._changeDetectorRef = a),
          (this.callSetDisabledState = u),
          (this.control = new H0()),
          (this._registered = !1),
          (this.name = ""),
          (this.update = new U()),
          (this._parent = n),
          this._setValidators(i),
          this._setAsyncValidators(o),
          (this.valueAccessor = U0(this, s));
      }
      ngOnChanges(n) {
        if ((this._checkForErrors(), !this._registered || "name" in n)) {
          if (this._registered && (this._checkName(), this.formDirective)) {
            let i = n.name.previousValue;
            this.formDirective.removeControl({
              name: i,
              path: this._getPath(i),
            });
          }
          this._setUpControl();
        }
        "isDisabled" in n && this._updateDisabled(n),
          $0(n, this.viewModel) &&
            (this._updateValue(this.model), (this.viewModel = this.model));
      }
      ngOnDestroy() {
        this.formDirective && this.formDirective.removeControl(this);
      }
      get path() {
        return this._getPath(this.name);
      }
      get formDirective() {
        return this._parent ? this._parent.formDirective : null;
      }
      viewToModelUpdate(n) {
        (this.viewModel = n), this.update.emit(n);
      }
      _setUpControl() {
        this._setUpdateStrategy(),
          this._isStandalone()
            ? this._setUpStandalone()
            : this.formDirective.addControl(this),
          (this._registered = !0);
      }
      _setUpdateStrategy() {
        this.options &&
          this.options.updateOn != null &&
          (this.control._updateOn = this.options.updateOn);
      }
      _isStandalone() {
        return !this._parent || !!(this.options && this.options.standalone);
      }
      _setUpStandalone() {
        F0(this.control, this, this.callSetDisabledState),
          this.control.updateValueAndValidity({ emitEvent: !1 });
      }
      _checkForErrors() {
        this._isStandalone() || this._checkParentType(), this._checkName();
      }
      _checkParentType() {}
      _checkName() {
        this.options && this.options.name && (this.name = this.options.name),
          !this._isStandalone() && this.name;
      }
      _updateValue(n) {
        zh.then(() => {
          this.control.setValue(n, { emitViewToModelChange: !1 }),
            this._changeDetectorRef?.markForCheck();
        });
      }
      _updateDisabled(n) {
        let i = n.isDisabled.currentValue,
          o = i !== 0 && po(i);
        zh.then(() => {
          o && !this.control.disabled
            ? this.control.disable()
            : !o && this.control.disabled && this.control.enable(),
            this._changeDetectorRef?.markForCheck();
        });
      }
      _getPath(n) {
        return this._parent ? R0(n, this._parent) : [n];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(
        W(pc, 9),
        W(w0, 10),
        W(_0, 10),
        W(qh, 10),
        W(Rn, 8),
        W(tp, 8)
      );
    }),
      (e.ɵdir = le({
        type: e,
        selectors: [
          ["", "ngModel", "", 3, "formControlName", "", 3, "formControl", ""],
        ],
        inputs: {
          name: "name",
          isDisabled: [De.None, "disabled", "isDisabled"],
          model: [De.None, "ngModel", "model"],
          options: [De.None, "ngModelOptions", "options"],
        },
        outputs: { update: "ngModelChange" },
        exportAs: ["ngModel"],
        features: [au([G0]), Ae, Tn],
      }));
    let t = e;
    return t;
  })();
var z0 = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = Et({ type: e })),
    (e.ɵinj = It({}));
  let t = e;
  return t;
})();
var W0 = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = Et({ type: e })),
    (e.ɵinj = It({ imports: [z0] }));
  let t = e;
  return t;
})();
var Ot = (() => {
  let e = class e {
    static withConfig(n) {
      return {
        ngModule: e,
        providers: [{ provide: tp, useValue: n.callSetDisabledState ?? vc }],
      };
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = Et({ type: e })),
    (e.ɵinj = It({ imports: [W0] }));
  let t = e;
  return t;
})();
function q0(t, e) {
  if (t & 1) {
    let r = de();
    L(0, "div", 7)(1, "textarea", 8, 9),
      j("ngModelChange", function (i) {
        E(r);
        let o = v();
        return b((o.description = i));
      })("blur", function () {
        E(r);
        let i = _e(2),
          o = v();
        return b(o.emitChangeDescription(i.value));
      })("keyup.enter", function () {
        E(r);
        let i = _e(2),
          o = v();
        return b(o.emitChangeDescription(i.value));
      })("input", function () {
        E(r);
        let i = v();
        return b(i.autoResize());
      }),
      Q(3, "      "),
      N(),
      L(4, "div", 10)(5, "button", 11),
      j("click", function () {
        E(r);
        let i = v();
        return b(i.emitDeleteItem());
      }),
      Q(6, "\u0423\u0434\u0430\u043B\u0438\u0442\u044C"),
      N()()();
  }
  if (t & 2) {
    let r = v();
    q(), Z("ngModel", r.description);
  }
}
var rp = (() => {
  let e = class e extends Gn {};
  (e.ɵfac = (() => {
    let n;
    return function (o) {
      return (n || (n = He(e)))(o || e);
    };
  })()),
    (e.ɵcmp = Te({
      type: e,
      selectors: [["app-item-done"]],
      standalone: !0,
      features: [Ae, Ne],
      decls: 9,
      vars: 3,
      consts: [
        [1, "todo"],
        [1, "todo-header"],
        [1, "cursor-pointer", 3, "click"],
        ["src", "./docs/assets/icons/done.svg", "alt", "done", 1, "img"],
        [1, "todo-title"],
        [1, "todo-arrow", 3, "ngClass", "click"],
        ["class", "todo-description"],
        [1, "todo-description"],
        [
          1,
          "textarea",
          3,
          "ngModel",
          "ngModelChange",
          "blur",
          "keyup.enter",
          "input",
        ],
        ["textarea", ""],
        [1, "btn-group"],
        [1, "button", 3, "click"],
      ],
      template: function (i, o) {
        i & 1 &&
          (L(0, "div", 0)(1, "div", 1)(2, "div", 2),
          j("click", function () {
            return o.emitChangeStatus(o.TodoStatus.NOT_STARTED);
          }),
          ze(3, "img", 3),
          N(),
          L(4, "span", 4),
          Q(5),
          N(),
          L(6, "span", 5),
          j("click", function () {
            return o.toggleDescription();
          }),
          Q(7, ">"),
          N()(),
          pe(8, q0, 7, 1, "div", 6),
          N()),
          i & 2 &&
            (q(5),
            ft(o.todoItem.title),
            q(),
            Z("ngClass", o.isShowDescription ? "" : "todo-hide"),
            q(2),
            St(8, o.isShowDescription ? 8 : -1));
      },
      dependencies: [We, Fn, Ot, rt, Nt, pt],
      styles: [
        ".todo[_ngcontent-%COMP%]{position:relative;display:flex;height:fit-content;min-height:3.5rem;flex-direction:column;align-items:flex-start;justify-content:center;gap:.25rem;border-radius:1rem;--tw-bg-opacity: 1;background-color:rgb(226 232 240 / var(--tw-bg-opacity));--tw-shadow: 0 20px 25px -5px rgb(0 0 0 / .1), 0 8px 10px -6px rgb(0 0 0 / .1);--tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.todo-header[_ngcontent-%COMP%]{display:flex;width:100%;align-items:center;gap:.5rem;padding-top:.5rem;padding-bottom:.5rem}.todo-description[_ngcontent-%COMP%]{margin-left:1rem;width:calc(100% - 2rem);padding-bottom:.5rem}.todo-arrow[_ngcontent-%COMP%]{position:absolute;top:.75rem;right:1rem;--tw-rotate: -90deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));cursor:pointer;font-size:1.5rem;line-height:2rem;font-weight:600;transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s;transition-delay:75ms;transition-timing-function:cubic-bezier(0,0,.2,1)}.todo-hide[_ngcontent-%COMP%]{--tw-rotate: 90deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.todo-title[_ngcontent-%COMP%]{display:block;width:calc(100% - 6rem);overflow-wrap:break-word;font-size:1rem;line-height:1.5rem;font-weight:600;--tw-text-opacity: 1;color:rgb(30 41 59 / var(--tw-text-opacity))}.textarea[_ngcontent-%COMP%]{max-height:none;min-height:2.5rem;width:100%;resize:none;overflow:hidden;border-bottom-width:1px;--tw-border-opacity: 1;border-bottom-color:rgb(113 113 122 / var(--tw-border-opacity));background-color:transparent;outline:2px solid transparent;outline-offset:2px}.img[_ngcontent-%COMP%]{margin-left:.75rem}.btn-group[_ngcontent-%COMP%]{display:flex;justify-content:flex-end;gap:.5rem}.todo[_ngcontent-%COMP%]{--tw-bg-opacity: 1;background-color:rgb(134 239 172 / var(--tw-bg-opacity))}",
      ],
    }));
  let t = e;
  return t;
})();
function Z0(t, e) {
  if (t & 1) {
    let r = de();
    L(0, "div", 7)(1, "textarea", 8, 9),
      j("ngModelChange", function (i) {
        E(r);
        let o = v();
        return b((o.description = i));
      })("blur", function () {
        E(r);
        let i = _e(2),
          o = v();
        return b(o.emitChangeDescription(i.value));
      })("keyup.enter", function () {
        E(r);
        let i = _e(2),
          o = v();
        return b(o.emitChangeDescription(i.value));
      })("input", function () {
        E(r);
        let i = v();
        return b(i.autoResize());
      }),
      Q(3, "      "),
      N(),
      L(4, "div", 10)(5, "button", 11),
      j("click", function () {
        E(r);
        let i = v();
        return b(i.emitDeleteItem());
      }),
      Q(6, "\u0423\u0434\u0430\u043B\u0438\u0442\u044C"),
      N()()();
  }
  if (t & 2) {
    let r = v();
    q(), Z("ngModel", r.description);
  }
}
var ip = (() => {
  let e = class e extends Gn {};
  (e.ɵfac = (() => {
    let n;
    return function (o) {
      return (n || (n = He(e)))(o || e);
    };
  })()),
    (e.ɵcmp = Te({
      type: e,
      selectors: [["app-item-in-progress"]],
      standalone: !0,
      features: [Ae, Ne],
      decls: 9,
      vars: 3,
      consts: [
        [1, "todo"],
        [1, "todo-header"],
        [1, "cursor-pointer", 3, "click"],
        [
          "src",
          "../../../../assets/icons/in_progress.svg",
          "alt",
          "done",
          1,
          "img",
        ],
        [1, "todo-title"],
        [1, "todo-arrow", 3, "ngClass", "click"],
        ["class", "todo-description"],
        [1, "todo-description"],
        [
          1,
          "textarea",
          3,
          "ngModel",
          "ngModelChange",
          "blur",
          "keyup.enter",
          "input",
        ],
        ["textarea", ""],
        [1, "btn-group"],
        [1, "button", 3, "click"],
      ],
      template: function (i, o) {
        i & 1 &&
          (L(0, "div", 0)(1, "div", 1)(2, "div", 2),
          j("click", function () {
            return o.emitChangeStatus(o.TodoStatus.DONE);
          }),
          ze(3, "img", 3),
          N(),
          L(4, "div", 4),
          Q(5),
          N(),
          L(6, "span", 5),
          j("click", function () {
            return o.toggleDescription();
          }),
          Q(7, ">"),
          N()(),
          pe(8, Z0, 7, 1, "div", 6),
          N()),
          i & 2 &&
            (q(5),
            ft(o.todoItem.title),
            q(),
            Z("ngClass", o.isShowDescription ? "" : "todo-hide"),
            q(2),
            St(8, o.isShowDescription ? 8 : -1));
      },
      dependencies: [We, Fn, Ot, rt, Nt, pt],
      styles: [
        ".todo[_ngcontent-%COMP%]{position:relative;display:flex;height:fit-content;min-height:3.5rem;flex-direction:column;align-items:flex-start;justify-content:center;gap:.25rem;border-radius:1rem;--tw-bg-opacity: 1;background-color:rgb(226 232 240 / var(--tw-bg-opacity));--tw-shadow: 0 20px 25px -5px rgb(0 0 0 / .1), 0 8px 10px -6px rgb(0 0 0 / .1);--tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.todo-header[_ngcontent-%COMP%]{display:flex;width:100%;align-items:center;gap:.5rem;padding-top:.5rem;padding-bottom:.5rem}.todo-description[_ngcontent-%COMP%]{margin-left:1rem;width:calc(100% - 2rem);padding-bottom:.5rem}.todo-arrow[_ngcontent-%COMP%]{position:absolute;top:.75rem;right:1rem;--tw-rotate: -90deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));cursor:pointer;font-size:1.5rem;line-height:2rem;font-weight:600;transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s;transition-delay:75ms;transition-timing-function:cubic-bezier(0,0,.2,1)}.todo-hide[_ngcontent-%COMP%]{--tw-rotate: 90deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.todo-title[_ngcontent-%COMP%]{display:block;width:calc(100% - 6rem);overflow-wrap:break-word;font-size:1rem;line-height:1.5rem;font-weight:600;--tw-text-opacity: 1;color:rgb(30 41 59 / var(--tw-text-opacity))}.textarea[_ngcontent-%COMP%]{max-height:none;min-height:2.5rem;width:100%;resize:none;overflow:hidden;border-bottom-width:1px;--tw-border-opacity: 1;border-bottom-color:rgb(113 113 122 / var(--tw-border-opacity));background-color:transparent;outline:2px solid transparent;outline-offset:2px}.img[_ngcontent-%COMP%]{margin-left:.75rem}.btn-group[_ngcontent-%COMP%]{display:flex;justify-content:flex-end;gap:.5rem}.todo[_ngcontent-%COMP%]{--tw-bg-opacity: 1;background-color:rgb(254 215 170 / var(--tw-bg-opacity))}",
      ],
    }));
  let t = e;
  return t;
})();
function Y0(t, e) {
  if (t & 1) {
    let r = de();
    L(0, "div", 7)(1, "textarea", 8, 9),
      j("ngModelChange", function (i) {
        E(r);
        let o = v();
        return b((o.description = i));
      })("blur", function () {
        E(r);
        let i = _e(2),
          o = v();
        return b(o.emitChangeDescription(i.value));
      })("keyup.enter", function () {
        E(r);
        let i = _e(2),
          o = v();
        return b(o.emitChangeDescription(i.value));
      })("close", function () {
        E(r);
        let i = _e(2),
          o = v();
        return b(o.emitChangeDescription(i.value));
      })("input", function () {
        E(r);
        let i = v();
        return b(i.autoResize());
      }),
      Q(3, "    "),
      N(),
      L(4, "div", 10)(5, "button", 11),
      j("click", function () {
        E(r);
        let i = v();
        return b(i.emitDeleteItem());
      }),
      Q(6, "\u0423\u0434\u0430\u043B\u0438\u0442\u044C"),
      N()()();
  }
  if (t & 2) {
    let r = v();
    q(), Z("ngModel", r.description);
  }
}
var op = (() => {
  let e = class e extends Gn {};
  (e.ɵfac = (() => {
    let n;
    return function (o) {
      return (n || (n = He(e)))(o || e);
    };
  })()),
    (e.ɵcmp = Te({
      type: e,
      selectors: [["app-item-not-started"]],
      standalone: !0,
      features: [Ae, Ne],
      decls: 9,
      vars: 3,
      consts: [
        [1, "todo"],
        [1, "todo-header"],
        [1, "cursor-pointer", 3, "click"],
        ["src", "../../../../assets/icons/Check.svg", "alt", "done", 1, "img"],
        [1, "todo-title"],
        [1, "todo-arrow", 3, "ngClass", "click"],
        ["class", "todo-description"],
        [1, "todo-description"],
        [
          1,
          "textarea",
          3,
          "ngModel",
          "ngModelChange",
          "blur",
          "keyup.enter",
          "close",
          "input",
        ],
        ["textarea", ""],
        [1, "btn-group"],
        [1, "button", 3, "click"],
      ],
      template: function (i, o) {
        i & 1 &&
          (L(0, "div", 0)(1, "div", 1)(2, "div", 2),
          j("click", function () {
            return o.emitChangeStatus(o.TodoStatus.IN_PROGRESS);
          }),
          ze(3, "img", 3),
          N(),
          L(4, "div", 4),
          Q(5),
          N(),
          L(6, "span", 5),
          j("click", function () {
            return o.toggleDescription();
          }),
          Q(7, ">"),
          N()(),
          pe(8, Y0, 7, 1, "div", 6),
          N()),
          i & 2 &&
            (q(5),
            ft(o.todoItem.title),
            q(),
            Z("ngClass", o.isShowDescription ? "" : "todo-hide"),
            q(2),
            St(8, o.isShowDescription ? 8 : -1));
      },
      dependencies: [We, Fn, Ot, rt, Nt, pt],
      styles: [
        ".todo[_ngcontent-%COMP%]{position:relative;display:flex;height:fit-content;min-height:3.5rem;flex-direction:column;align-items:flex-start;justify-content:center;gap:.25rem;border-radius:1rem;--tw-bg-opacity: 1;background-color:rgb(226 232 240 / var(--tw-bg-opacity));--tw-shadow: 0 20px 25px -5px rgb(0 0 0 / .1), 0 8px 10px -6px rgb(0 0 0 / .1);--tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.todo-header[_ngcontent-%COMP%]{display:flex;width:100%;align-items:center;gap:.5rem;padding-top:.5rem;padding-bottom:.5rem}.todo-description[_ngcontent-%COMP%]{margin-left:1rem;width:calc(100% - 2rem);padding-bottom:.5rem}.todo-arrow[_ngcontent-%COMP%]{position:absolute;top:.75rem;right:1rem;--tw-rotate: -90deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));cursor:pointer;font-size:1.5rem;line-height:2rem;font-weight:600;transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s;transition-delay:75ms;transition-timing-function:cubic-bezier(0,0,.2,1)}.todo-hide[_ngcontent-%COMP%]{--tw-rotate: 90deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.todo-title[_ngcontent-%COMP%]{display:block;width:calc(100% - 6rem);overflow-wrap:break-word;font-size:1rem;line-height:1.5rem;font-weight:600;--tw-text-opacity: 1;color:rgb(30 41 59 / var(--tw-text-opacity))}.textarea[_ngcontent-%COMP%]{max-height:none;min-height:2.5rem;width:100%;resize:none;overflow:hidden;border-bottom-width:1px;--tw-border-opacity: 1;border-bottom-color:rgb(113 113 122 / var(--tw-border-opacity));background-color:transparent;outline:2px solid transparent;outline-offset:2px}.img[_ngcontent-%COMP%]{margin-left:.75rem}.btn-group[_ngcontent-%COMP%]{display:flex;justify-content:flex-end;gap:.5rem}",
      ],
    }));
  let t = e;
  return t;
})();
function Q0(t, e) {
  if (t & 1) {
    let r = de();
    L(0, "h2", 9),
      Q(1),
      N(),
      L(2, "button", 10),
      j("click", function () {
        E(r);
        let i = v();
        return b((i.isShowTitle = !1));
      }),
      Q(3, " \u0420\u0435\u0434. "),
      N();
  }
  if (t & 2) {
    let r = v();
    q(), ft(r.todoGroup.title);
  }
}
function K0(t, e) {
  if (t & 1) {
    let r = de();
    L(0, "input", 11),
      j("ngModelChange", function (i) {
        E(r);
        let o = v();
        return b((o.groupTitle = i));
      })("blur", function () {
        E(r);
        let i = v();
        return b(i.onEnterValue());
      })("keyup.enter", function () {
        E(r);
        let i = v();
        return b(i.onEnterValue());
      }),
      N();
  }
  if (t & 2) {
    let r = v();
    Z("ngModel", r.groupTitle);
  }
}
function J0(t, e) {
  if (t & 1) {
    let r = de();
    L(0, "app-item-not-started", 15),
      j("eventChangeDescription", function (i) {
        E(r);
        let o = v(2);
        return b(o.handleChangeDescriptionItem(i));
      })("changeStatus", function (i) {
        E(r);
        let o = v(2);
        return b(o.handleChangeStatus(i));
      })("deleteItem", function (i) {
        E(r);
        let o = v(2);
        return b(o.handleDeleteItem(i));
      }),
      N();
  }
  if (t & 2) {
    let r = v(),
      n = r.$implicit,
      i = r.$index;
    Z("todoItem", n)("index", i);
  }
}
function X0(t, e) {
  if (t & 1) {
    let r = de();
    L(0, "app-item-in-progress", 16),
      j("changeStatus", function (i) {
        E(r);
        let o = v(2);
        return b(o.handleChangeStatus(i));
      })("deleteItem", function (i) {
        E(r);
        let o = v(2);
        return b(o.handleDeleteItem(i));
      })("eventChangeDescription", function (i) {
        E(r);
        let o = v(2);
        return b(o.handleChangeDescriptionItem(i));
      }),
      N();
  }
  if (t & 2) {
    let r = v(),
      n = r.$implicit,
      i = r.$index;
    Z("todoItem", n)("index", i);
  }
}
function e_(t, e) {
  if (t & 1) {
    let r = de();
    L(0, "app-item-done", 16),
      j("changeStatus", function (i) {
        E(r);
        let o = v(2);
        return b(o.handleChangeStatus(i));
      })("deleteItem", function (i) {
        E(r);
        let o = v(2);
        return b(o.handleDeleteItem(i));
      })("eventChangeDescription", function (i) {
        E(r);
        let o = v(2);
        return b(o.handleChangeDescriptionItem(i));
      }),
      N();
  }
  if (t & 2) {
    let r = v(),
      n = r.$implicit,
      i = r.$index;
    Z("todoItem", n)("index", i);
  }
}
function t_(t, e) {
  if (
    (t & 1 &&
      (nu(0, 12),
      pe(1, J0, 1, 2, "app-item-not-started", 13)(
        2,
        X0,
        1,
        2,
        "app-item-in-progress",
        14
      )(3, e_, 1, 2, "app-item-done", 14),
      ru()),
    t & 2)
  ) {
    let r = e.$implicit;
    Z("ngSwitch", r.status),
      q(),
      Z("ngSwitchCase", "not_started"),
      q(),
      Z("ngSwitchCase", "in_progress"),
      q(),
      Z("ngSwitchCase", "done");
  }
}
var sp = (() => {
  let e = class e {
    constructor() {
      (this.isShowTitle = !0),
        (this.changeTitleEvent = new U()),
        (this.deleteGroup = new U()),
        (this.addNewItem = new U()),
        (this.changeDescription = new U()),
        (this.changeItemStatus = new U()),
        (this.deleteItem = new U());
    }
    ngOnInit() {
      (this.groupTitle = this.todoGroup.title),
        this.todoGroup.title === "" && (this.isShowTitle = !1);
    }
    onEnterValue() {
      (this.isShowTitle = !0),
        this.changeTitleEvent.emit({
          value: this.groupTitle,
          index: this.index,
        });
    }
    deleteGroupEvent() {
      this.deleteGroup.emit(this.index);
    }
    addNewTodo(n) {
      this.addNewItem.emit({
        item: { status: Hr.NOT_STARTED, title: n, description: "" },
        index: this.index,
      });
    }
    handleChangeDescriptionItem(n) {
      this.changeDescription.emit({
        description: n.description,
        indexGroup: this.index,
        indexItem: n.index,
      });
    }
    handleChangeStatus(n) {
      this.changeItemStatus.emit({
        status: n.status,
        indexItem: n.index,
        groupIndex: this.index,
      });
    }
    handleDeleteItem(n) {
      this.deleteItem.emit({ indexItem: n, indexGroup: this.index });
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = Te({
      type: e,
      selectors: [["app-todo-group"]],
      inputs: { todoGroup: "todoGroup", index: "index" },
      outputs: {
        changeTitleEvent: "changeTitleEvent",
        deleteGroup: "deleteGroup",
        addNewItem: "addNewItem",
        changeDescription: "changeDescription",
        changeItemStatus: "changeItemStatus",
        deleteItem: "deleteItem",
      },
      standalone: !0,
      features: [Ne],
      decls: 14,
      vars: 1,
      consts: [
        [
          1,
          "relative",
          "mt-10",
          "max-w-4xl",
          "my-12",
          "mx-auto",
          "rounded-xl",
          "border-slate-200",
          "border-2",
          "p-10",
          "shadow-2xl",
          "max-sm:p-4",
        ],
        [
          1,
          "text-center",
          "mb-5",
          "flex",
          "flex-col",
          "justify-center",
          "items-center",
          "gap-4",
        ],
        [1, "flex", "gap-4", "justify-center", "items-center"],
        [
          1,
          "absolute",
          "right-5",
          "top-5",
          "text-2xl",
          "w-8",
          "h-8",
          "flex",
          "justify-center",
          "items-center",
          "rounded-md",
          "bg-red-800",
          "max-sm:top-3",
          "max-sm:right-3",
        ],
        [1, "text-red-100", 3, "click"],
        [1, "w-full", "h-0.5", "bg-gray-400"],
        [1, "flex", "flex-col", "gap-4", "justify-center"],
        [
          "type",
          "text",
          "placeholder",
          "\u041D\u043E\u0432\u0430\u044F \u0437\u0430\u0434\u0430\u0447\u0430 ...",
          1,
          "input",
          3,
          "keyup.enter",
          "blur",
        ],
        ["newTodo", ""],
        [1, "font-bold", "text-2xl", "leading-10"],
        [1, "", 3, "click"],
        [
          "type",
          "text",
          "placeholder",
          "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0433\u0440\u0443\u043F\u043F\u044B ...",
          1,
          "input",
          3,
          "ngModel",
          "ngModelChange",
          "blur",
          "keyup.enter",
        ],
        [3, "ngSwitch"],
        [
          3,
          "todoItem",
          "index",
          "eventChangeDescription",
          "changeStatus",
          "deleteItem",
          4,
          "ngSwitchCase",
        ],
        [
          3,
          "todoItem",
          "index",
          "changeStatus",
          "deleteItem",
          "eventChangeDescription",
          4,
          "ngSwitchCase",
        ],
        [
          3,
          "todoItem",
          "index",
          "eventChangeDescription",
          "changeStatus",
          "deleteItem",
        ],
        [
          3,
          "todoItem",
          "index",
          "changeStatus",
          "deleteItem",
          "eventChangeDescription",
        ],
      ],
      template: function (i, o) {
        if (i & 1) {
          let s = de();
          L(0, "div", 0)(1, "div", 1)(2, "div", 2),
            pe(3, Q0, 4, 1)(4, K0, 1, 1),
            N(),
            L(5, "div", 3)(6, "button", 4),
            j("click", function () {
              return o.deleteGroupEvent();
            }),
            Q(7, " X "),
            N()(),
            ze(8, "div", 5),
            N(),
            L(9, "div", 6),
            If(10, t_, 4, 4, "ng-container", 12, _f),
            L(12, "input", 7, 8),
            j("keyup.enter", function () {
              E(s);
              let u = _e(13);
              return o.addNewTodo(u.value), b((u.value = ""));
            })("blur", function () {
              E(s);
              let u = _e(13);
              return u.value !== "" && o.addNewTodo(u.value), b((u.value = ""));
            }),
            N()()();
        }
        i & 2 &&
          (q(3), St(3, o.isShowTitle ? 3 : 4), q(7), Ef(o.todoGroup.items));
      },
      dependencies: [We, vu, Wf, rp, ip, op, Ot, rt, Nt, pt],
      styles: ["*[_ngcontent-%COMP%]{font-family:Comfortaa,sans-serif}"],
    }));
  let t = e;
  return t;
})();
function n_(t, e) {
  if (t & 1) {
    let r = de();
    L(0, "app-todo-group", 4),
      j("deleteGroup", function (i) {
        E(r);
        let o = v();
        return b(o.handleDeleteGroup(i));
      })("changeTitleEvent", function (i) {
        E(r);
        let o = v();
        return b(o.handleChangeTitle(i));
      })("addNewItem", function (i) {
        E(r);
        let o = v();
        return b(o.handleNewItem(i));
      })("changeDescription", function (i) {
        E(r);
        let o = v();
        return b(o.handleChangeDescription(i));
      })("changeItemStatus", function (i) {
        E(r);
        let o = v();
        return b(o.handleChangeStatus(i));
      })("deleteItem", function (i) {
        E(r);
        let o = v();
        return b(o.handleDeleteItem(i));
      }),
      N();
  }
  if (t & 2) {
    let r = e.$implicit,
      n = e.index;
    Z("index", n)("todoGroup", r);
  }
}
var ap = (() => {
  let e = class e {
    constructor() {
      this.todoGroups = [];
    }
    ngOnInit() {
      let n = localStorage.getItem("todoGroups");
      n && (this.todoGroups = JSON.parse(n));
    }
    saveGroupsToLocalStorage() {
      localStorage.setItem("todoGroups", JSON.stringify(this.todoGroups));
    }
    addGroup() {
      let n = { title: "", items: [] };
      this.todoGroups.push(n), this.saveGroupsToLocalStorage();
    }
    handleChangeTitle(n) {
      (this.todoGroups[n.index].title = n.value),
        this.saveGroupsToLocalStorage();
    }
    handleDeleteGroup(n) {
      this.todoGroups.splice(n, 1), this.saveGroupsToLocalStorage();
    }
    handleNewItem(n) {
      this.todoGroups[n.index].items?.push(n.item),
        this.saveGroupsToLocalStorage();
    }
    handleChangeDescription(n) {
      (this.todoGroups[n.indexGroup].items[n.indexItem].description =
        n.description),
        this.saveGroupsToLocalStorage();
    }
    handleChangeStatus(n) {
      (this.todoGroups[n.groupIndex].items[n.indexItem].status = n.status),
        this.saveGroupsToLocalStorage();
    }
    handleDeleteItem(n) {
      this.todoGroups[n.indexGroup].items.splice(n.indexItem, 1),
        this.saveGroupsToLocalStorage();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = Te({
      type: e,
      selectors: [["app-root"]],
      standalone: !0,
      features: [Ne],
      decls: 6,
      vars: 1,
      consts: [
        [1, "m-4"],
        [
          1,
          "fixed",
          "right-10",
          "bottom-16",
          "bg-green-700",
          "w-16",
          "h-16",
          "text-center",
          "rounded-full",
          "z-20",
          "max-sm:bottom-5",
          "max-sm:right-5",
        ],
        [1, "text-7xl", "text-green-100", 3, "click"],
        [
          3,
          "index",
          "todoGroup",
          "deleteGroup",
          "changeTitleEvent",
          "addNewItem",
          "changeDescription",
          "changeItemStatus",
          "deleteItem",
          4,
          "ngFor",
          "ngForOf",
        ],
        [
          3,
          "index",
          "todoGroup",
          "deleteGroup",
          "changeTitleEvent",
          "addNewItem",
          "changeDescription",
          "changeItemStatus",
          "deleteItem",
        ],
      ],
      template: function (i, o) {
        i & 1 &&
          (L(0, "div", 0)(1, "main")(2, "div", 1)(3, "button", 2),
          j("click", function () {
            return o.addGroup();
          }),
          Q(4, " + "),
          N()(),
          pe(5, n_, 1, 2, "app-todo-group", 3),
          N()()),
          i & 2 && (q(5), Z("ngForOf", o.todoGroups));
      },
      dependencies: [We, zf, sp],
      styles: ["*[_ngcontent-%COMP%]{font-family:Comfortaa,sans-serif}"],
    }));
  let t = e;
  return t;
})();
th(ap, Vh).catch((t) => console.error(t));
