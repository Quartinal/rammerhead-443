! function() {
    var e, t, b = window["%hammerhead%"];
    if (!b) throw new Error("hammerhead not loaded yet");
    if (b.settings._settings.sessionId) console.warn("unexpected task.js to load before rammerhead.js. url shuffling cannot be used"), r();
    else {
        e = r, t = b.__proto__.start, b.__proto__.start = function() {
            t.apply(this, arguments), b.__proto__.start = t, e()
        };
        {
            const a = new XMLHttpRequest,
                l = (location.pathname.slice(1).match(/^[a-z0-9]+/i) || [])[0];
            if (l)
                if (a.open("GET", "/api/shuffleDict?id=" + l, !1), a.send(), 200 !== a.status) console.warn(`received a non 200 status code while trying to fetch shuffleDict:
status: ${a.status}
response: ` + a.responseText);
                else {
                    var l = JSON.parse(a.responseText);
                    if (l) {
                        const s = (e, t) => (e % t + t) % t,
                            i = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~-",
                            e = "_rhs";
                        const n = (e, n) => (e || "").replace(/^((?:[a-z0-9]+:\/\/[^/]+)?(?:\/[^/]+\/))([^]+)/i, function(e, t, r) {
                                return t + n(r)
                            }),
                            o = new class {
                                constructor(e = function() {
                                    let e = "";
                                    const t = i.split("");
                                    for (; 0 < t.length;) e += t.splice(Math.floor(Math.random() * t.length), 1)[0];
                                    return e
                                }()) {
                                    this.dictionary = e
                                }
                                shuffle(t) {
                                    if (window.rhDisableShuffling) return t;
                                    if (t.startsWith(e)) return t;
                                    let r = "";
                                    for (let e = 0; e < t.length; e++) {
                                        var n = t.charAt(e),
                                            o = i.indexOf(n);
                                        "%" === n && 3 <= t.length - e ? r = (r = (r += n) + t.charAt(++e)) + t.charAt(++e) : r += -1 === o ? n : this.dictionary.charAt(s(o + e, i.length))
                                    }
                                    return e + r
                                }
                                unshuffle(t) {
                                    if (!t.startsWith(e)) return t;
                                    t = t.slice(e.length);
                                    let r = "";
                                    for (let e = 0; e < t.length; e++) {
                                        var n = t.charAt(e),
                                            o = this.dictionary.indexOf(n);
                                        "%" === n && 3 <= t.length - e ? r = (r = (r += n) + t.charAt(++e)) + t.charAt(++e) : r += -1 === o ? n : i.charAt(s(o - e, i.length))
                                    }
                                    return r
                                }
                            }(l);
                        a = location.href, l = n(location.href, e => o.shuffle(e));
                        a !== l && history.replaceState(null, null, l);
                        let r = b.utils.url.getProxyUrl,
                            t = b.utils.url.parseProxyUrl;
                        b.utils.url.overrideGetProxyUrl(function(e, t) {
                            return x ? r(e, t) : n(r(e, t), e => o.shuffle(e))
                        }), b.utils.url.overrideParseProxyUrl(function(e) {
                            return t(n(e, e => o.unshuffle(e)))
                        }), window.overrideGetProxyUrl(r => function(e, t) {
                            return x ? r(e, t) : n(r(e, t), e => o.shuffle(e))
                        }), window.overrideParseProxyUrl(t => function(e) {
                            return t(n(e, e => o.unshuffle(e)))
                        })
                    }
                }
            else console.warn("cannot get session id from url")
        }
    }

    function r() {
        {
            let r = location.port || ("https:" === location.protocol ? "443" : "80"),
                n = b.utils.url.getProxyUrl;
            b.utils.url.overrideGetProxyUrl(function(e, t = {}) {
                return t.proxyPort || (t.proxyPort = r), n(e, t)
            }), window.overrideParseProxyUrl(t => function(e) {
                e = t(e);
                return e && e.proxy && (e.proxy.port || (e.proxy.port = r)), e
            })
        } {
            let e = {
                HTMLAnchorElement: ["href"],
                HTMLAreaElement: ["href"],
                HTMLBaseElement: ["href"],
                HTMLEmbedElement: ["src"],
                HTMLFormElement: ["action"],
                HTMLFrameElement: ["src"],
                HTMLIFrameElement: ["src"],
                HTMLImageElement: ["src"],
                HTMLInputElement: ["src"],
                HTMLLinkElement: ["href"],
                HTMLMediaElement: ["src"],
                HTMLModElement: ["cite"],
                HTMLObjectElement: ["data"],
                HTMLQuoteElement: ["cite"],
                HTMLScriptElement: ["src"],
                HTMLSourceElement: ["src"],
                HTMLTrackElement: ["src"]
            };
            for (var r in e)
                for (var n of e[r])
                    if (window[r]) {
                        var o = Object.getOwnPropertyDescriptor(window[r].prototype, n);
                        let t = o.get;
                        if (o.get = function() {
                                return e = t.call(this), (b.utils.url.parseProxyUrl(e) || {}).destUrl || e;
                                var e
                            }, "action" === n) {
                            let r = o.set;
                            o.set = function(e) {
                                x = !0;
                                try {
                                    var t = r.call(this, e)
                                } catch (e) {
                                    throw x = !1, e
                                }
                                return x = !1, t
                            }
                        }
                        Object.defineProperty(window[r].prototype, n, o)
                    } else console.warn("unexpected unsupported element class " + r)
        } {
            let t = e => new URL(b.utils.url.parseProxyUrl(e.location.href).destUrl).host,
                r = e => `rammerhead|storage-wrapper|${b.settings._settings.sessionId}|${t(e)}|`,
                i = (e = "", t = window) => r(t) + e,
                a = (e = "", t = window) => e.startsWith(r(t)) ? e.slice(r.length) : null,
                e = (e, o) => {
                    let s = ["internal", "clear", "key", "getItem", "setItem", "removeItem", "length"];
                    Object.defineProperty(window, e, {
                        configurable: !0,
                        writable: !0,
                        value: new Proxy(window[e], {
                            get(e, t, r) {
                                if (s.includes(t) && "length" !== t) return Reflect.get(e, t, r);
                                if ("length" !== t) return o[i(t)]; {
                                    let e = 0;
                                    for (var [n] of Object.entries(o)) a(n) && e++;
                                    return e
                                }
                            },
                            set(e, t, r) {
                                return s.includes(t) || (o[i(t)] = r), !0
                            },
                            deleteProperty(e, t) {
                                return delete o[i(t)], !0
                            },
                            has(e, t) {
                                return i(t) in o || t in e
                            },
                            ownKeys() {
                                var e, t = [];
                                for ([e] of Object.entries(o)) {
                                    var r = a(e);
                                    r && !s.includes(r) && t.push(r)
                                }
                                return t
                            },
                            getOwnPropertyDescriptor(e, t) {
                                return Object.getOwnPropertyDescriptor(o, i(t))
                            },
                            defineProperty(e, t, r) {
                                return s.includes(t) || Object.defineProperty(o, i(t), r), !0
                            }
                        })
                    })
                },
                n = (e, n) => {
                    Storage.prototype[e] = new Proxy(Storage.prototype[e], {
                        apply(e, t, r) {
                            return n.apply(t, r)
                        }
                    })
                };
            e("localStorage", b.storages.localStorageProxy.internal.nativeStorage), e("sessionStorage", b.storages.sessionStorageProxy.internal.nativeStorage), n("clear", function() {
                for (var [e] of Object.entries(this)) delete this[e]
            }), n("key", function(e) {
                return (Object.entries(this)[e] || [])[0] || null
            }), n("getItem", function(e) {
                return this.internal.nativeStorage[i(e, this.internal.ctx)] || null
            }), n("setItem", function(e, t) {
                e && (this.internal.nativeStorage[i(e, this.internal.ctx)] = t)
            }), n("removeItem", function(e) {
                delete this.internal.nativeStorage[i(e, this.internal.ctx)]
            })
        } {
            let e = [];
            var t, t = ((t = new XMLHttpRequest).open("GET", "/blocklist.txt", !1), t.send(), 200 === t.status ? e = t.responseText.split("\n").map(e => e.trim()).filter(e => e) : console.warn("Failed to fetch blocklist"), `
            (function() {
                const blocklist = ${JSON.stringify(e)};
                const hammerhead = window['%hammerhead%'];
                
                function isBlockedDomain(url) {
                    const unshuffledUrl = hammerhead.utils.url.parseProxyUrl(url).destUrl;
                    const urlObj = new URL(unshuffledUrl);
                    return blocklist.some(domain => urlObj.hostname.includes(domain) || urlObj.hostname.startsWith(domain));
                }

                function removeBlockedElements() {
                    const elements = document.querySelectorAll('script, iframe, img, embed, object');
                    elements.forEach(element => {
                        const src = element.src || element.data;
                        if (src && isBlockedDomain(src)) {
                            element.remove();
                        }
                    });
                }

                removeBlockedElements();

                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'childList') {
                            removeBlockedElements();
                        }
                    });
                });

                observer.observe(document.body, { childList: true, subtree: true });
            })();
        `),
                t = b.processScript(t),
                s = document.createElement("script");
            s.textContent = t, (document.head || document.documentElement).appendChild(s), s.parentNode.removeChild(s)
        }
        if (delete window.overrideGetProxyUrl, delete window.overrideParseProxyUrl, delete window.overrideIsCrossDomainWindows, window.rammerheadStartListeners) {
            for (var e of window.rammerheadStartListeners) try {
                e()
            } catch (e) {
                console.error(e)
            }
            delete window.rammerheadStartListeners
        }
        if (window.rammerheadDisableLocalStorageImplementation) delete window.rammerheadDisableLocalStorageImplementation;
        else {
            var i = "rammerhead_synctimestamp",
                a = !1,
                l = localStorage,
                c = l.internal.nativeStorage,
                u = b.settings._settings.sessionId,
                d = window.__get$(window, "location").origin,
                m = [];
            try {
                a = !0;
                var f, h = (() => {
                    var e = c[i],
                        t = parseInt(e);
                    return isNaN(t) ? (e && console.warn("invalid timestamp retrieved from storage: " + e), null) : t
                })();

                function p(e) {
                    if (!e || "object" != typeof e) throw new TypeError("data must be an object");
                    for (var t in l.clear(), e) l[t] = e[t]
                }
                h ? (f = g({
                    type: "sync",
                    timestamp: h,
                    data: l
                })).timestamp && (w(f.timestamp), p(f.data)) : (f = g({
                    type: "sync",
                    fetch: !0
                })).timestamp && (w(f.timestamp), p(f.data)), a = !1
            } catch (e) {
                if ("server wants to disable localStorage syncing" !== e.message) throw e;
                return
            }
            l.addChangeEventListener(function(e) {
                a || -1 === m.indexOf(e.key) && m.push(e.key)
            }), setInterval(function() {
                var e = v();
                e && (g({
                    type: "update",
                    updateData: e
                }, function(e) {
                    w(e.timestamp)
                }), m = [])
            }, 5e3), document.addEventListener("visibilitychange", function() {
                var e;
                "hidden" === document.visibilityState && (e = v()) && b.nativeMethods.sendBeacon.call(window.navigator, y(), JSON.stringify({
                    type: "update",
                    updateData: e
                }))
            })
        }

        function w(e) {
            if (!e) throw new TypeError("timestamp must be defined");
            if (isNaN(parseInt(e))) throw new TypeError("timestamp must be a number. received" + e);
            c[i] = e
        }

        function y() {
            return "/syncLocalStorage?sessionId=" + encodeURIComponent(u) + "&origin=" + encodeURIComponent(d)
        }

        function g(e, t) {
            if (!e || "object" != typeof e) throw new TypeError("data must be an object");
            var r = b.createNativeXHR();

            function n() {
                if (404 === r.status) throw new Error("server wants to disable localStorage syncing");
                if (200 !== r.status) throw new Error("server sent a non 200 code. got " + r.status + ". Response: " + r.responseText)
            }
            if (r.open("POST", y(), !!t), r.setRequestHeader("content-type", "application/json"), r.send(JSON.stringify(e)), !t) return n(), JSON.parse(r.responseText);
            r.onload = function() {
                n(), t(JSON.parse(r.responseText))
            }
        }

        function v() {
            if (!m.length) return null;
            for (var e = {}, t = 0; t < m.length; t++) e[m[t]] = l[m[t]];
            return m = [], e
        }
    }
    var x = !1
}();