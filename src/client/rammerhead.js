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
                    let shuffleDict = JSON.parse(a.responseText);
                    if (shuffleDict) {
                        const s = (e, t) => (e % t + t) % t,
                            i = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~-",
                            prefixConstant = "_rhs";
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
                                    if (t.startsWith(prefixConstant)) return t;
                                    let r = "";
                                    for (let e = 0; e < t.length; e++) {
                                        var n = t.charAt(e),
                                            o = i.indexOf(n);
                                        "%" === n && 3 <= t.length - e ? r = (r = (r += n) + t.charAt(++e)) + t.charAt(++e) : r += -1 === o ? n : this.dictionary.charAt(s(o + e, i.length))
                                    }
                                    return prefixConstant + r
                                }
                                unshuffle(t) {
                                    if (!t.startsWith(prefixConstant)) return t;
                                    t = t.slice(prefixConstant.length);
                                    let r = "";
                                    for (let e = 0; e < t.length; e++) {
                                        var n = t.charAt(e),
                                            o = this.dictionary.indexOf(n);
                                        "%" === n && 3 <= t.length - e ? r = (r = (r += n) + t.charAt(++e)) + t.charAt(++e) : r += -1 === o ? n : i.charAt(s(o - e, i.length))
                                    }
                                    return r
                                }
                            }(shuffleDict);
                        let currentHref = location.href,
                            newHref = n(location.href, e => o.shuffle(e));
                        currentHref !== newHref && history.replaceState(null, null, newHref);
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
                let parsed = t(e);
                return parsed && parsed.proxy && (parsed.proxy.port || (parsed.proxy.port = r)), parsed
            })
        }
        
        {
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
            for (var tagName in e) {
                for (var propName of e[tagName]) {
                    if (window[tagName]) {
                        var descriptor = Object.getOwnPropertyDescriptor(window[tagName].prototype, propName);
                        if (descriptor) {
                            let originalGetter = descriptor.get;
                            descriptor.get = function() {
                                let value = originalGetter.call(this);
                                let parsed = b.utils.url.parseProxyUrl(value);
                                return parsed && parsed.destUrl ? parsed.destUrl : value;
                            };
                            
                            if (propName === "action") {
                                let originalSetter = descriptor.set;
                                descriptor.set = function(value) {
                                    x = true;
                                    try {
                                        return originalSetter.call(this, value);
                                    } catch (err) {
                                        x = false;
                                        throw err;
                                    } finally {
                                        x = false;
                                    }
                                };
                            }
                            
                            try {
                                Object.defineProperty(window[tagName].prototype, propName, descriptor);
                            } catch (err) {
                                console.warn(`Failed to redefine property ${propName} on ${tagName}`);
                            }
                        }
                    }
                }
            }
        }

        if (delete window.overrideGetProxyUrl, delete window.overrideParseProxyUrl, delete window.overrideIsCrossDomainWindows, window.rammerheadStartListeners) {
            for (var listener of window.rammerheadStartListeners) {
                try {
                    listener();
                } catch (err) {
                    console.error(err);
                }
            }
            delete window.rammerheadStartListeners;
        }

        if (window.rammerheadDisableLocalStorageImplementation) {
            delete window.rammerheadDisableLocalStorageImplementation;
        }
    }
    var x = false;
}();