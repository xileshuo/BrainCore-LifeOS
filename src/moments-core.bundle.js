/* BrainCore Moments core — Memoria (MIT) + Memos View archive/trash/sort/share */
var BCMomentsCore = (function () {
var module = { exports: {} };
var exports = module.exports;
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// node_modules/dom-to-image-more/dist/dom-to-image-more.min.js
var require_dom_to_image_more_min = __commonJS({
  "node_modules/dom-to-image-more/dist/dom-to-image-more.min.js"(exports, module2) {
    ((l) => {
      let f = /* @__PURE__ */ (() => {
        let e2 = 0;
        return { escape: function(e3) {
          return e3.replace(/([.*+?^${}()|[\]/\\])/g, "\\$1");
        }, isDataUrl: function(e3) {
          return -1 !== e3.search(/^(data:)/);
        }, canvasToBlob: function(t4) {
          if (t4.toBlob) return new Promise(function(e3) {
            t4.toBlob(e3);
          });
          return ((r3) => new Promise(function(e3) {
            var t5 = u(r3.toDataURL().split(",")[1]), n3 = t5.length, o3 = new Uint8Array(n3);
            for (let e4 = 0; e4 < n3; e4++) o3[e4] = t5.charCodeAt(e4);
            e3(new Blob([o3], { type: "image/png" }));
          }))(t4);
        }, resolveUrl: function(e3, t4) {
          var n3 = document.implementation.createHTMLDocument(), o3 = n3.createElement("base"), r3 = (n3.head.appendChild(o3), n3.createElement("a"));
          return n3.body.appendChild(r3), o3.href = t4, r3.href = e3, r3.href;
        }, getAndEncode: function(s2) {
          let e3 = a.impl.urlCache.find(function(e4) {
            return e4.url === s2;
          });
          e3 || (e3 = { url: s2, promise: null }, a.impl.urlCache.push(e3));
          null === e3.promise && (a.impl.options.cacheBust && (s2 += (/\?/.test(s2) ? "&" : "?") + (/* @__PURE__ */ new Date()).getTime()), e3.promise = new Promise(function(t4) {
            let e4 = a.impl.options.httpTimeout, r3 = new XMLHttpRequest();
            if (r3.onreadystatechange = function() {
              if (4 === r3.readyState) if (300 <= r3.status) n3 ? t4(n3) : l2(`cannot fetch resource: ${s2}, status: ` + r3.status);
              else {
                let e5 = new FileReader();
                e5.onloadend = function() {
                  t4(e5.result);
                }, e5.readAsDataURL(r3.response);
              }
            }, r3.ontimeout = function() {
              n3 ? t4(n3) : l2(`timeout of ${e4}ms occured while fetching resource: ` + s2);
            }, r3.responseType = "blob", r3.timeout = e4, 0 < a.impl.options.useCredentialsFilters.length && (a.impl.options.useCredentials = 0 < a.impl.options.useCredentialsFilters.filter((e5) => 0 <= s2.search(e5)).length), a.impl.options.useCredentials && (r3.withCredentials = true), a.impl.options.corsImg && 0 === s2.indexOf("http") && -1 === s2.indexOf(window.location.origin)) {
              var i3 = "POST" === (a.impl.options.corsImg.method || "GET").toUpperCase() ? "POST" : "GET";
              r3.open(i3, (a.impl.options.corsImg.url || "").replace("#{cors}", s2), true);
              let t5 = false, n4 = a.impl.options.corsImg.headers || {}, o3 = (Object.keys(n4).forEach(function(e5) {
                -1 !== n4[e5].indexOf("application/json") && (t5 = true), r3.setRequestHeader(e5, n4[e5]);
              }), ((e5) => {
                try {
                  return JSON.parse(JSON.stringify(e5));
                } catch (e6) {
                  l2("corsImg.data is missing or invalid:" + e6.toString());
                }
              })(a.impl.options.corsImg.data || ""));
              Object.keys(o3).forEach(function(e5) {
                "string" == typeof o3[e5] && (o3[e5] = o3[e5].replace("#{cors}", s2));
              }), r3.send(t5 ? JSON.stringify(o3) : o3);
            } else r3.open("GET", s2, true), r3.send();
            let n3;
            function l2(e5) {
              console.error(e5), t4("");
            }
            a.impl.options.imagePlaceholder && (i3 = a.impl.options.imagePlaceholder.split(/,/)) && i3[1] && (n3 = i3[1]);
          }));
          return e3.promise;
        }, uid: function() {
          return "u" + ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4) + e2++;
        }, delay: function(n3) {
          return function(t4) {
            return new Promise(function(e3) {
              setTimeout(function() {
                e3(t4);
              }, n3);
            });
          };
        }, asArray: function(t4) {
          var n3 = [], o3 = t4.length;
          for (let e3 = 0; e3 < o3; e3++) n3.push(t4[e3]);
          return n3;
        }, escapeXhtml: function(e3) {
          return e3.replace(/%/g, "%25").replace(/#/g, "%23").replace(/\n/g, "%0A");
        }, makeImage: function(r3) {
          return "data:," !== r3 ? new Promise(function(e3, t4) {
            let n3 = document.createElementNS("http://www.w3.org/2000/svg", "svg"), o3 = new Image();
            a.impl.options.useCredentials && (o3.crossOrigin = "use-credentials"), o3.onload = function() {
              document.body.removeChild(n3), window && window.requestAnimationFrame ? window.requestAnimationFrame(function() {
                e3(o3);
              }) : e3(o3);
            }, o3.onerror = (e4) => {
              document.body.removeChild(n3), t4(e4);
            }, n3.appendChild(o3), o3.src = r3, document.body.appendChild(n3);
          }) : Promise.resolve();
        }, width: function(e3) {
          var t4 = i2(e3, "width");
          if (!isNaN(t4)) return t4;
          var t4 = i2(e3, "border-left-width"), n3 = i2(e3, "border-right-width");
          return e3.scrollWidth + t4 + n3;
        }, height: function(e3) {
          var t4 = i2(e3, "height");
          if (!isNaN(t4)) return t4;
          var t4 = i2(e3, "border-top-width"), n3 = i2(e3, "border-bottom-width");
          return e3.scrollHeight + t4 + n3;
        }, getWindow: t3, isElement: r2, isElementHostForOpenShadowRoot: function(e3) {
          return r2(e3) && null !== e3.shadowRoot;
        }, isShadowRoot: n2, isInShadowRoot: o2, isHTMLElement: function(e3) {
          return e3 instanceof t3(e3).HTMLElement;
        }, isHTMLCanvasElement: function(e3) {
          return e3 instanceof t3(e3).HTMLCanvasElement;
        }, isHTMLInputElement: function(e3) {
          return e3 instanceof t3(e3).HTMLInputElement;
        }, isHTMLImageElement: function(e3) {
          return e3 instanceof t3(e3).HTMLImageElement;
        }, isHTMLLinkElement: function(e3) {
          return e3 instanceof t3(e3).HTMLLinkElement;
        }, isHTMLScriptElement: function(e3) {
          return e3 instanceof t3(e3).HTMLScriptElement;
        }, isHTMLStyleElement: function(e3) {
          return e3 instanceof t3(e3).HTMLStyleElement;
        }, isHTMLTextAreaElement: function(e3) {
          return e3 instanceof t3(e3).HTMLTextAreaElement;
        }, isShadowSlotElement: function(e3) {
          return o2(e3) && e3 instanceof t3(e3).HTMLSlotElement;
        }, isSVGElement: function(e3) {
          return e3 instanceof t3(e3).SVGElement;
        }, isSVGRectElement: function(e3) {
          return e3 instanceof t3(e3).SVGRectElement;
        }, isDimensionMissing: function(e3) {
          return isNaN(e3) || e3 <= 0;
        } };
        function t3(e3) {
          e3 = e3 ? e3.ownerDocument : void 0;
          return (e3 ? e3.defaultView : void 0) || window || l;
        }
        function n2(e3) {
          return e3 instanceof t3(e3).ShadowRoot;
        }
        function o2(e3) {
          return null != e3 && void 0 !== e3.getRootNode && n2(e3.getRootNode());
        }
        function r2(e3) {
          return e3 instanceof t3(e3).Element;
        }
        function i2(t4, n3) {
          if (t4.nodeType === c) {
            let e3 = m(t4).getPropertyValue(n3);
            if ("px" === e3.slice(-2)) return e3 = e3.slice(0, -2), parseFloat(e3);
          }
          return NaN;
        }
      })(), r = /* @__PURE__ */ (() => {
        let o2 = /url\(['"]?([^'"]+?)['"]?\)/g;
        return { inlineAll: function(t3, o3, r2) {
          if (!e2(t3)) return Promise.resolve(t3);
          return Promise.resolve(t3).then(n2).then(function(e3) {
            let n3 = Promise.resolve(t3);
            return e3.forEach(function(t4) {
              n3 = n3.then(function(e4) {
                return i2(e4, t4, o3, r2);
              });
            }), n3;
          });
        }, shouldProcess: e2, impl: { readUrls: n2, inline: i2 } };
        function e2(e3) {
          return -1 !== e3.search(o2);
        }
        function n2(e3) {
          for (var t3, n3 = []; null !== (t3 = o2.exec(e3)); ) n3.push(t3[1]);
          return n3.filter(function(e4) {
            return !f.isDataUrl(e4);
          });
        }
        function i2(n3, o3, t3, e3) {
          return Promise.resolve(o3).then(function(e4) {
            return t3 ? f.resolveUrl(e4, t3) : e4;
          }).then(e3 || f.getAndEncode).then(function(e4) {
            return n3.replace((t4 = o3, new RegExp(`(url\\(['"]?)(${f.escape(t4)})(['"]?\\))`, "g")), `$1${e4}$3`);
            var t4;
          });
        }
      })(), e = { resolveAll: function() {
        return t2().then(function(e2) {
          return Promise.all(e2.map(function(e3) {
            return e3.resolve();
          }));
        }).then(function(e2) {
          return e2.join("\n");
        });
      }, impl: { readAll: t2 } };
      function t2() {
        return Promise.resolve(f.asArray(document.styleSheets)).then(function(e2) {
          let n2 = [];
          return e2.forEach(function(t4) {
            var e3 = Object.getPrototypeOf(t4);
            if (Object.prototype.hasOwnProperty.call(e3, "cssRules")) try {
              f.asArray(t4.cssRules || []).forEach(n2.push.bind(n2));
            } catch (e4) {
              console.error("domtoimage: Error while reading CSS rules from " + t4.href, e4.toString());
            }
          }), n2;
        }).then(function(e2) {
          return e2.filter(function(e3) {
            return e3.type === CSSRule.FONT_FACE_RULE;
          }).filter(function(e3) {
            return r.shouldProcess(e3.style.getPropertyValue("src"));
          });
        }).then(function(e2) {
          return e2.map(t3);
        });
        function t3(t4) {
          return { resolve: function() {
            var e2 = (t4.parentStyleSheet || {}).href;
            return r.inlineAll(t4.cssText, e2);
          }, src: function() {
            return t4.style.getPropertyValue("src");
          } };
        }
      }
      let n = { inlineAll: function t3(e2) {
        if (!f.isElement(e2)) return Promise.resolve(e2);
        return n2(e2).then(function() {
          return f.isHTMLImageElement(e2) ? o(e2).inline() : Promise.all(f.asArray(e2.childNodes).map(function(e3) {
            return t3(e3);
          }));
        });
        function n2(o2) {
          let e3 = ["background", "background-image"], t4 = e3.map(function(t5) {
            let e4 = o2.style.getPropertyValue(t5), n3 = o2.style.getPropertyPriority(t5);
            return e4 ? r.inlineAll(e4).then(function(e5) {
              o2.style.setProperty(t5, e5, n3);
            }) : Promise.resolve();
          });
          return Promise.all(t4).then(function() {
            return o2;
          });
        }
      }, impl: { newImage: o } };
      function o(n2) {
        return { inline: function(e2) {
          if (f.isDataUrl(n2.src)) return Promise.resolve();
          return Promise.resolve(n2.src).then(e2 || f.getAndEncode).then(function(t3) {
            return new Promise(function(e3) {
              n2.onload = e3, n2.onerror = e3, n2.src = t3;
            });
          });
        } };
      }
      let s = { copyDefaultStyles: true, imagePlaceholder: void 0, cacheBust: false, useCredentials: false, useCredentialsFilters: [], httpTimeout: 3e4, styleCaching: "strict", corsImg: void 0, adjustClonedNode: void 0 }, a = { toSvg: d, toPng: function(e2, t3) {
        return i(e2, t3).then(function(e3) {
          return e3.toDataURL();
        });
      }, toJpeg: function(e2, t3) {
        return i(e2, t3).then(function(e3) {
          return e3.toDataURL("image/jpeg", (t3 ? t3.quality : void 0) || 1);
        });
      }, toBlob: function(e2, t3) {
        return i(e2, t3).then(f.canvasToBlob);
      }, toPixelData: function(t3, e2) {
        return i(t3, e2).then(function(e3) {
          return e3.getContext("2d").getImageData(0, 0, f.width(t3), f.height(t3)).data;
        });
      }, toCanvas: i, impl: { fontFaces: e, images: n, util: f, inliner: r, urlCache: [], options: {} } }, c = ("object" == typeof exports && "object" == typeof module2 ? module2.exports = a : l.domtoimage = a, ("undefined" != typeof Node ? Node.ELEMENT_NODE : void 0) || 1), m = (void 0 !== l ? l.getComputedStyle : void 0) || ("undefined" != typeof window ? window.getComputedStyle : void 0) || globalThis.getComputedStyle, u = (void 0 !== l ? l.atob : void 0) || ("undefined" != typeof window ? window.atob : void 0) || globalThis.atob;
      function d(e2, r2) {
        let t3 = a.impl.util.getWindow(e2);
        var n2 = r2 = r2 || {};
        void 0 === n2.copyDefaultStyles ? a.impl.options.copyDefaultStyles = s.copyDefaultStyles : a.impl.options.copyDefaultStyles = n2.copyDefaultStyles, a.impl.options.imagePlaceholder = (void 0 === n2.imagePlaceholder ? s : n2).imagePlaceholder, a.impl.options.cacheBust = (void 0 === n2.cacheBust ? s : n2).cacheBust, a.impl.options.corsImg = (void 0 === n2.corsImg ? s : n2).corsImg, a.impl.options.useCredentials = (void 0 === n2.useCredentials ? s : n2).useCredentials, a.impl.options.useCredentialsFilters = (void 0 === n2.useCredentialsFilters ? s : n2).useCredentialsFilters, a.impl.options.httpTimeout = (void 0 === n2.httpTimeout ? s : n2).httpTimeout, a.impl.options.styleCaching = (void 0 === n2.styleCaching ? s : n2).styleCaching;
        let i2 = [];
        return Promise.resolve(e2).then(function(e3) {
          if (e3.nodeType === c) return e3;
          var t4 = e3, n3 = e3.parentNode, o2 = document.createElement("span");
          return n3.replaceChild(o2, t4), o2.append(e3), i2.push({ parent: n3, child: t4, wrapper: o2 }), o2;
        }).then(function(e3) {
          return (function l2(t4, s2, r3, u2) {
            let e4 = s2.filter;
            if (t4 === h || f.isHTMLScriptElement(t4) || f.isHTMLStyleElement(t4) || f.isHTMLLinkElement(t4) || null !== r3 && e4 && !e4(t4)) return Promise.resolve();
            return Promise.resolve(t4).then(n3).then(o2).then(function(e5) {
              return c2(e5, a2(t4));
            }).then(i3).then(function(e5) {
              return d2(e5, t4);
            });
            function n3(e5) {
              return f.isHTMLCanvasElement(e5) ? f.makeImage(e5.toDataURL()) : e5.cloneNode(false);
            }
            function o2(e5) {
              return s2.adjustClonedNode && s2.adjustClonedNode(t4, e5, false), Promise.resolve(e5);
            }
            function i3(e5) {
              return s2.adjustClonedNode && s2.adjustClonedNode(t4, e5, true), Promise.resolve(e5);
            }
            function a2(e5) {
              return f.isElementHostForOpenShadowRoot(e5) ? e5.shadowRoot : e5;
            }
            function c2(n4, e5) {
              let o3 = t5(e5), r4 = Promise.resolve();
              if (0 !== o3.length) {
                let t6 = m(i4(e5));
                f.asArray(o3).forEach(function(e6) {
                  r4 = r4.then(function() {
                    return l2(e6, s2, t6, u2).then(function(e7) {
                      e7 && n4.appendChild(e7);
                    });
                  });
                });
              }
              return r4.then(function() {
                return n4;
              });
              function i4(e6) {
                return f.isShadowRoot(e6) ? e6.host : e6;
              }
              function t5(t6) {
                if (f.isShadowSlotElement(t6)) {
                  let e6 = t6.assignedNodes();
                  if (e6 && 0 < e6.length) return e6;
                }
                return t6.childNodes;
              }
            }
            function d2(u3, a3) {
              return !f.isElement(u3) || f.isShadowSlotElement(a3) ? Promise.resolve(u3) : Promise.resolve().then(e5).then(t5).then(n4).then(o3).then(function() {
                return u3;
              });
              function e5() {
                function o4(e7, t6) {
                  t6.font = e7.font, t6.fontFamily = e7.fontFamily, t6.fontFeatureSettings = e7.fontFeatureSettings, t6.fontKerning = e7.fontKerning, t6.fontSize = e7.fontSize, t6.fontStretch = e7.fontStretch, t6.fontStyle = e7.fontStyle, t6.fontVariant = e7.fontVariant, t6.fontVariantCaps = e7.fontVariantCaps, t6.fontVariantEastAsian = e7.fontVariantEastAsian, t6.fontVariantLigatures = e7.fontVariantLigatures, t6.fontVariantNumeric = e7.fontVariantNumeric, t6.fontVariationSettings = e7.fontVariationSettings, t6.fontWeight = e7.fontWeight;
                }
                function e6(e7, t6) {
                  let n5 = m(e7);
                  n5.cssText ? (t6.style.cssText = n5.cssText, o4(n5, t6.style)) : (y(s2, e7, n5, r3, t6), null === r3 && (["inset-block", "inset-block-start", "inset-block-end"].forEach((e8) => t6.style.removeProperty(e8)), ["left", "right", "top", "bottom"].forEach((e8) => {
                    t6.style.getPropertyValue(e8) && t6.style.setProperty(e8, "0px");
                  })));
                }
                e6(a3, u3);
              }
              function t5() {
                let s3 = f.uid();
                function t6(r4) {
                  let i4 = m(a3, r4), l3 = i4.getPropertyValue("content");
                  if ("" !== l3 && "none" !== l3) {
                    let n6 = function() {
                      let e7 = `.${s3}:` + r4, t8 = (i4.cssText ? n7 : o4)();
                      return document.createTextNode(e7 + `{${t8}}`);
                      function n7() {
                        return `${i4.cssText} content: ${l3};`;
                      }
                      function o4() {
                        let e8 = f.asArray(i4).map(t9).join("; ");
                        return e8 + ";";
                        function t9(e9) {
                          let t10 = i4.getPropertyValue(e9), n8 = i4.getPropertyPriority(e9) ? " !important" : "";
                          return e9 + ": " + t10 + n8;
                        }
                      }
                    };
                    var n5 = n6;
                    let e6 = u3.getAttribute("class") || "", t7 = (u3.setAttribute("class", e6 + " " + s3), document.createElement("style"));
                    t7.appendChild(n6()), u3.appendChild(t7);
                  }
                }
                [":before", ":after"].forEach(function(e6) {
                  t6(e6);
                });
              }
              function n4() {
                f.isHTMLTextAreaElement(a3) && (u3.innerHTML = a3.value), f.isHTMLInputElement(a3) && u3.setAttribute("value", a3.value);
              }
              function o3() {
                f.isSVGElement(u3) && (u3.setAttribute("xmlns", "http://www.w3.org/2000/svg"), f.isSVGRectElement(u3)) && ["width", "height"].forEach(function(e6) {
                  let t6 = u3.getAttribute(e6);
                  t6 && u3.style.setProperty(e6, t6);
                });
              }
            }
          })(e3, r2, null, t3);
        }).then(r2.disableEmbedFonts ? Promise.resolve(e2) : p).then(g).then(function(t4) {
          r2.bgcolor && (t4.style.backgroundColor = r2.bgcolor);
          r2.width && (t4.style.width = r2.width + "px");
          r2.height && (t4.style.height = r2.height + "px");
          r2.style && Object.keys(r2.style).forEach(function(e4) {
            t4.style[e4] = r2.style[e4];
          });
          let e3 = null;
          "function" == typeof r2.onclone && (e3 = r2.onclone(t4));
          return Promise.resolve(e3).then(function() {
            return t4;
          });
        }).then(function(e3) {
          let n3 = r2.width || f.width(e3), o2 = r2.height || f.height(e3);
          return Promise.resolve(e3).then(function(e4) {
            return e4.setAttribute("xmlns", "http://www.w3.org/1999/xhtml"), new XMLSerializer().serializeToString(e4);
          }).then(f.escapeXhtml).then(function(e4) {
            var t4 = (f.isDimensionMissing(n3) ? ' width="100%"' : ` width="${n3}"`) + (f.isDimensionMissing(o2) ? ' height="100%"' : ` height="${o2}"`);
            return `<svg xmlns="http://www.w3.org/2000/svg"${(f.isDimensionMissing(n3) ? "" : ` width="${n3}"`) + (f.isDimensionMissing(o2) ? "" : ` height="${o2}"`)}><foreignObject${t4}>${e4}</foreignObject></svg>`;
          }).then(function(e4) {
            return "data:image/svg+xml;charset=utf-8," + e4;
          });
        }).then(function(e3) {
          for (; 0 < i2.length; ) {
            var t4 = i2.pop();
            t4.parent.replaceChild(t4.child, t4.wrapper);
          }
          return e3;
        }).then(function(e3) {
          return a.impl.urlCache = [], (() => {
            h && (document.body.removeChild(h), h = null), v && clearTimeout(v), v = setTimeout(() => {
              v = null, w = {};
            }, 2e4);
          })(), e3;
        });
      }
      function i(r2, i2) {
        return d(r2, i2 = i2 || {}).then(f.makeImage).then(function(e2) {
          var t3 = "number" != typeof i2.scale ? 1 : i2.scale, n2 = ((e3, t4) => {
            let n3 = i2.width || f.width(e3), o3 = i2.height || f.height(e3);
            return f.isDimensionMissing(n3) && (n3 = f.isDimensionMissing(o3) ? 300 : 2 * o3), f.isDimensionMissing(o3) && (o3 = n3 / 2), (e3 = document.createElement("canvas")).width = n3 * t4, e3.height = o3 * t4, i2.bgcolor && ((t4 = e3.getContext("2d")).fillStyle = i2.bgcolor, t4.fillRect(0, 0, e3.width, e3.height)), e3;
          })(r2, t3), o2 = n2.getContext("2d");
          return o2.msImageSmoothingEnabled = false, o2.imageSmoothingEnabled = false, e2 && (o2.scale(t3, t3), o2.drawImage(e2, 0, 0)), n2;
        });
      }
      let h = null;
      function p(n2) {
        return e.resolveAll().then(function(e2) {
          var t3;
          return "" !== e2 && (t3 = document.createElement("style"), n2.appendChild(t3), t3.appendChild(document.createTextNode(e2))), n2;
        });
      }
      function g(e2) {
        return n.inlineAll(e2).then(function() {
          return e2;
        });
      }
      function y(e2, t3, i2, l2, n2) {
        let s2 = a.impl.options.copyDefaultStyles ? ((t4, e3) => {
          var n3, o2 = ((e4) => ("relaxed" !== t4.styleCaching ? e4 : e4.filter((e5, t5, n4) => 0 === t5 || t5 === n4.length - 1)).join(">"))(e3 = ((e4) => {
            var t5 = [];
            do {
              if (e4.nodeType === c) {
                var n4 = e4.tagName;
                if (t5.push(n4), E.includes(n4)) break;
              }
            } while (e4 = e4.parentNode);
            return t5;
          })(e3));
          {
            if (w[o2]) return w[o2];
            e3 = ((e4, t5) => {
              let n4 = e4.body;
              do {
                var o3 = t5.pop(), o3 = e4.createElement(o3);
                n4.appendChild(o3), n4 = o3;
              } while (0 < t5.length);
              return n4.textContent = "\u200B", n4;
            })((n3 = (() => {
              if (h) return h.contentWindow;
              t5 = document.characterSet || "UTF-8", e4 = (e4 = document.doctype) ? (`<!DOCTYPE ${s3(e4.name)} ${s3(e4.publicId)} ` + s3(e4.systemId)).trim() + ">" : "", (h = document.createElement("iframe")).id = "domtoimage-sandbox-" + f.uid(), h.style.visibility = "hidden", h.style.position = "fixed", document.body.appendChild(h);
              var e4, t5, n4 = h, o3 = "domtoimage-sandbox";
              try {
                return n4.contentWindow.document.write(e4 + `<html><head><meta charset='${t5}'><title>${o3}</title></head><body></body></html>`), n4.contentWindow;
              } catch (e5) {
              }
              var r3 = document.createElement("meta");
              r3.setAttribute("charset", t5);
              try {
                var i4 = document.implementation.createHTMLDocument(o3), l3 = (i4.head.appendChild(r3), e4 + i4.documentElement.outerHTML);
                return n4.setAttribute("srcdoc", l3), n4.contentWindow;
              } catch (e5) {
              }
              return n4.contentDocument.head.appendChild(r3), n4.contentDocument.title = o3, n4.contentWindow;
              function s3(e5) {
                var t6;
                return e5 ? ((t6 = document.createElement("div")).innerText = e5, t6.innerHTML) : "";
              }
            })()).document, e3), n3 = ((e4, t5) => {
              let n4 = {}, o3 = e4.getComputedStyle(t5);
              return f.asArray(o3).forEach(function(e5) {
                n4[e5] = "width" === e5 || "height" === e5 ? "auto" : o3.getPropertyValue(e5);
              }), n4;
            })(n3, e3);
            var r2 = e3;
            do {
              var i3 = r2.parentElement;
              null !== i3 && i3.removeChild(r2), r2 = i3;
            } while (r2 && "BODY" !== r2.tagName);
            return w[o2] = n3;
          }
        })(e2, t3) : {}, u2 = n2.style;
        f.asArray(i2).forEach(function(e3) {
          var t4, n3 = i2.getPropertyValue(e3), o2 = s2[e3], r2 = l2 ? l2.getPropertyValue(e3) : void 0;
          u2.getPropertyValue(e3) || (n3 !== o2 || l2 && n3 !== r2) && (o2 = i2.getPropertyPriority(e3), r2 = u2, n3 = n3, o2 = o2, t4 = 0 <= ["background-clip"].indexOf(e3 = e3), o2 ? (r2.setProperty(e3, n3, o2), t4 && r2.setProperty("-webkit-" + e3, n3, o2)) : (r2.setProperty(e3, n3), t4 && r2.setProperty("-webkit-" + e3, n3)));
        });
      }
      let v = null, w = {}, E = ["ADDRESS", "ARTICLE", "ASIDE", "BLOCKQUOTE", "DETAILS", "DIALOG", "DD", "DIV", "DL", "DT", "FIELDSET", "FIGCAPTION", "FIGURE", "FOOTER", "FORM", "H1", "H2", "H3", "H4", "H5", "H6", "HEADER", "HGROUP", "HR", "LI", "MAIN", "NAV", "OL", "P", "PRE", "SECTION", "SVG", "TABLE", "UL", "math", "svg", "BODY", "HEAD", "HTML"];
    })(exports);
  }
});

// src/moments-memoria/braincore-entry.ts
var braincore_entry_exports = {};
__export(braincore_entry_exports, {
  ARCHIVE_TAG: () => ARCHIVE_TAG,
  DEFAULT_SETTINGS: () => DEFAULT_SETTINGS,
  DELETED_TAG: () => DELETED_TAG,
  MemoStore: () => MemoStore,
  MemoriaView: () => MemoriaView,
  PIN_TAG: () => PIN_TAG,
  STAR_TAG: () => STAR_TAG,
  StatsView: () => StatsView,
  VIEW_TYPE_MOMENTS: () => VIEW_TYPE_MEMORIA,
  VIEW_TYPE_MOMENTS_STATS: () => VIEW_TYPE_MEMORIA_STATS,
  VIEW_TYPE_MOMENTS_YEAR: () => VIEW_TYPE_MEMORIA_YEAR,
  YearPanoramaView: () => YearPanoramaView,
  extractTags: () => extractTags,
  initLocale: () => initLocale,
  parseFile: () => parseFile,
  renderMemo: () => renderMemo,
  t: () => t
});
module.exports = __toCommonJS(braincore_entry_exports);

// src/moments-memoria/store.ts
var import_obsidian = require("obsidian");

// src/moments-memoria/types.ts
var DEFAULT_SETTINGS = {
  folder: "\u8BFB&\u5199/Moments",
  attachmentFolder: "Boxes/\u56FE\u7247",
  clearAfterSave: true,
  pageSize: 50,
  showSidebarTags: true,
  showSidebarYears: true,
  useTrash: false,
  exportTheme: "auto",
  collapseLineLimit: 8,
  dailyGoal: 5,
  trashMaxItems: 300,
  density: "cozy",
  contentWidth: "balanced",
  enableVimKeys: false,
  enableMoodColoring: false,
  enableSmartReview: true,
  language: "auto",
  sendHotkey: "ctrl-enter",
  defaultOverviewMode: "heatmap",
  openOnStartup: false,
  buddy: null,
  mobileInputStyle: "fab",
  shareAuthorName: "",
  shareAuthorBio: "",
  shareAvatar: ""
};
var VIEW_TYPE_MEMORIA = "braincore-moments-view";
var VIEW_TYPE_MEMORIA_STATS = "braincore-moments-stats-view";
var VIEW_TYPE_MEMORIA_YEAR = "braincore-moments-year-view";
var PIN_TAG = "\u7F6E\u9876";
var STAR_TAG = "\u6536\u85CF";
var ARCHIVE_TAG = "\u5F52\u6863";
var DELETED_TAG = "\u5DF2\u5220\u9664";
var RESERVED_TAGS = /* @__PURE__ */ new Set([PIN_TAG, STAR_TAG, DELETED_TAG]);

// src/moments-memoria/parser.ts
var WEEKDAY_CN = ["\u5468\u65E5", "\u5468\u4E00", "\u5468\u4E8C", "\u5468\u4E09", "\u5468\u56DB", "\u5468\u4E94", "\u5468\u516D"];
function parseFile(filePath, raw) {
  const lines = raw.split(/\r?\n/);
  const memos = [];
  let currentDate = "";
  let i = 0;
  const dateHeaderRe = /^#{2,3}\s+(\d{4}-\d{2}-\d{2})(?:\s+.+)?$/;
  const memoStartRe = /^-\s+(\d{2}:\d{2})\s?(.*)$/;
  while (i < lines.length) {
    const line = lines[i];
    const dm = line.match(dateHeaderRe);
    if (dm) {
      currentDate = dm[1];
      i++;
      continue;
    }
    const mm = line.match(memoStartRe);
    if (mm && currentDate) {
      const time = mm[1];
      const firstLine = mm[2] ?? "";
      const startLine = i;
      const bodyLines = [firstLine];
      i++;
      while (i < lines.length) {
        const next = lines[i];
        if (memoStartRe.test(next) || dateHeaderRe.test(next)) break;
        if (/^#\s+\d{4}\s*$/.test(next)) break;
        if (next.startsWith("  ")) {
          bodyLines.push(next.slice(2));
          i++;
          continue;
        }
        if (next.trim() === "") {
          let j = i + 1;
          while (j < lines.length && lines[j].trim() === "") j++;
          if (j >= lines.length) break;
          const peek = lines[j];
          if (memoStartRe.test(peek) || dateHeaderRe.test(peek)) break;
          if (/^#\s+\d{4}\s*$/.test(peek)) break;
          if (peek.startsWith("  ")) {
            for (let k = i; k < j; k++) bodyLines.push("");
            i = j;
            continue;
          }
          break;
        }
        break;
      }
      const endLine = i - 1;
      while (bodyLines.length && bodyLines[0].trim() === "") bodyLines.shift();
      while (bodyLines.length && bodyLines[bodyLines.length - 1].trim() === "")
        bodyLines.pop();
      const content = bodyLines.join("\n");
      const datetime = parseLocalDateTime(currentDate, time);
      const tags = extractTags(content);
      const hasImage = detectImage(content);
      const hasLink = detectLink(content);
      const isPinned = tags.includes(PIN_TAG) || /\[pinned::\d{14}\]/i.test(content);
      const isStarred = tags.includes(STAR_TAG);
      const isArchived = tags.includes(ARCHIVE_TAG) || /\[archived::\d{14}\]/i.test(content);
      const isDeleted = tags.includes(DELETED_TAG) || /\[deleted::\d{14}\]/i.test(content);
      const tasks = detectTasks(content);
      memos.push({
        file: filePath,
        date: currentDate,
        time,
        datetime,
        updatedAt: datetime.getTime(),
        content,
        tags,
        hasImage,
        hasLink,
        isPinned,
        isStarred,
        isArchived,
        isDeleted,
        hasOpenTask: tasks.open,
        hasClosedTask: tasks.closed,
        range: [startLine, endLine]
      });
      continue;
    }
    i++;
  }
  return memos;
}
function parseLocalDateTime(date, time) {
  const [y, mo, d] = date.split("-").map((s) => parseInt(s, 10));
  const [h, mi] = time.split(":").map((s) => parseInt(s, 10));
  return new Date(y, mo - 1, d, h, mi, 0, 0);
}
function extractTags(text) {
  const re = /#([A-Za-z0-9_\u4e00-\u9fff][A-Za-z0-9_\u4e00-\u9fff/]*)/g;
  const set = /* @__PURE__ */ new Set();
  let m;
  while ((m = re.exec(text)) !== null) {
    set.add(m[1]);
  }
  return [...set];
}
function detectImage(text) {
  if (/!\[[^\]]*\]\([^)]+\)/.test(text)) return true;
  if (/!\[\[[^\]]+\.(png|jpe?g|gif|webp|svg|bmp|avif)(\|[^\]]*)?\]\]/i.test(text))
    return true;
  return false;
}
function detectTasks(text) {
  const openRe = /(?:^|\n)\s*[-*+]\s+\[ \]\s/;
  const closedRe = /(?:^|\n)\s*[-*+]\s+\[[xX]\]\s/;
  return {
    open: openRe.test(text),
    closed: closedRe.test(text)
  };
}
function detectLink(text) {
  const stripped = text.replace(/```[\s\S]*?```/g, "").replace(/~~~[\s\S]*?~~~/g, "").replace(/`[^`\n]*`/g, "").replace(/!\[[^\]]*\]\([^)]+\)/g, "").replace(/!\[\[[^\]]+\]\]/g, "");
  if (/\[[^\]]+\]\([^)]+\)/.test(stripped)) return true;
  if (/\[\[[^\]]+\]\]/.test(stripped)) return true;
  if (/https?:\/\/[^\s)]+/.test(stripped)) return true;
  return false;
}
function fmtDate(d) {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function fmtTime(d) {
  const h = d.getHours().toString().padStart(2, "0");
  const mi = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${mi}`;
}
function fmtWeekday(d) {
  return WEEKDAY_CN[d.getDay()];
}
function renderMemo(time, content) {
  const raw = content.replace(/\r\n/g, "\n");
  const lines = raw.split("\n");
  while (lines.length && lines[0].trim() === "") lines.shift();
  while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();
  if (lines.length === 0) {
    return `- ${time}

---`;
  }
  const body = lines.map((l) => l.trim() === "" ? "" : `  ${l}`).join("\n");
  return `- ${time}
${body}

---`;
}

// src/moments-memoria/i18n.ts
var zhCN = {
  // 侧栏 / 视图
  "sidebar.views": "\u89C6\u56FE",
  "sidebar.search": "\u68C0\u7D22",
  "sidebar.tags": "\u6807\u7B7E",
  "sidebar.all": "\u5168\u90E8\u7B14\u8BB0",
  "sidebar.pinned": "\u7F6E\u9876",
  "sidebar.archived": "\u5F52\u6863",
  "sidebar.trash": "\u56DE\u6536\u7AD9",
  "sidebar.tagsEmpty": "\u8FD8\u6CA1\u6709\u6807\u7B7E",
  "sidebar.starred": "\u6536\u85CF",
  "sidebar.today": "\u4ECA\u5929",
  "sidebar.week": "\u672C\u5468",
  "sidebar.todo": "\u5F85\u529E",
  "sidebar.review": "\u90A3\u5E74\u4ECA\u65E5",
  "sidebar.noTag": "\u65E0\u6807\u7B7E",
  "sidebar.withImage": "\u6709\u56FE\u7247",
  "sidebar.withLink": "\u6709\u94FE\u63A5",
  "sidebar.random": "\u968F\u673A\u62BD\u53D6",
  "sidebar.section.views": "\u89C6\u56FE",
  "sidebar.section.search": "\u68C0\u7D22\u5F0F",
  "sidebar.section.years": "\u5E74\u4EFD",
  "sidebar.section.tags": "\u5168\u90E8\u6807\u7B7E",
  // 输入框
  "input.placeholder": "\u6B64\u523B\uFF0C\u4F60\u5728\u60F3\u4EC0\u4E48\uFF1F",
  "input.placeholderWithTag": "\u6B64\u523B\uFF0C\u4F60\u5728\u60F3\u4EC0\u4E48\uFF1F\uFF08\u4F1A\u81EA\u52A8\u52A0 #{tag}\uFF09",
  "input.editPlaceholder": "\u7F16\u8F91 {date} {time} \u7684\u7B14\u8BB0\uFF08Esc \u53D6\u6D88\uFF09",
  "input.submit": "\u53D1\u9001",
  "input.cancel": "\u53D6\u6D88",
  "input.editTimeTitle": "\u4FEE\u6539\u8FD9\u6761\u7B14\u8BB0\u7684\u65F6\u95F4\uFF08\u5E74/\u6708/\u65E5 \u65F6:\u5206\uFF09",
  // 日期标签（视图显示用，md 文件里始终保持写入时的格式，不受此影响）
  "date.today": "\u4ECA\u5929",
  "date.yesterday": "\u6628\u5929",
  "weekday.0": "\u5468\u65E5",
  "weekday.1": "\u5468\u4E00",
  "weekday.2": "\u5468\u4E8C",
  "weekday.3": "\u5468\u4E09",
  "weekday.4": "\u5468\u56DB",
  "weekday.5": "\u5468\u4E94",
  "weekday.6": "\u5468\u516D",
  // 笔记统计
  "list.totalCount": "\u5171 {n} \u6761",
  "list.dailyGoalProgress": "\u76EE\u6807 {goal} \u6761\uFF0C\u5DF2\u8BB0 {done} \u6761",
  "list.dailyGoalDone": "\u76EE\u6807 {goal} \u6761\uFF0C\u5F53\u524D\u5DF2\u5B8C\u6210 {done} \u6761",
  "list.dailyGoalExceed": "\u76EE\u6807 {goal} \u6761\uFF0C\u5F53\u524D\u5DF2\u5B8C\u6210 {done} \u6761\uFF08\u8D85\u989D {extra}\uFF09",
  "list.pinnedHead": "\u7F6E\u9876  \u5171 {n} \u6761",
  "list.presetPinned": "\u{1F4CC} \u7F6E\u9876",
  "list.presetStarred": "\u2B50 \u6536\u85CF",
  "list.presetRandom": "\u968F\u673A\u62BD\u53D6",
  "list.presetOnThisDay": "\u90A3\u5E74\u4ECA\u65E5",
  "list.loadMore": "\u2193 \u6EDA\u52A8\u52A0\u8F7D\u66F4\u591A\uFF08\u8FD8\u6709 {n} \u6761\uFF09",
  "list.heatmapMore": "\u8FD8\u6709 {n} \u6761\u2026",
  "list.noText": "\uFF08\u65E0\u6587\u5B57\uFF09",
  "list.imageHolder": "[\u56FE]",
  // 回顾筛选
  "review.poolCount": "\u7B5B\u9009\u6C60 {n} \u6761",
  "review.filter.year": "\u5E74\u4EFD",
  "review.filter.allYears": "\u5168\u90E8\u5E74\u4EFD",
  "review.filter.tag": "\u6807\u7B7E",
  "review.filter.allTags": "\u5168\u90E8\u6807\u7B7E",
  "review.filter.type": "\u7C7B\u578B",
  "review.filter.keyword": "\u5173\u952E\u8BCD",
  "review.filter.reset": "\u91CD\u7F6E",
  "review.keyword.placeholder": "\u5728\u90A3\u5E74\u4ECA\u65E5\u91CC\u641C\u7D22",
  "review.type.all": "\u5168\u90E8\u7C7B\u578B",
  "review.type.starred": "\u6536\u85CF",
  "review.type.pinned": "\u7F6E\u9876",
  "review.type.withImage": "\u6709\u56FE\u7247",
  "review.type.todo": "\u5F85\u529E",
  // 导出 HTML 页面
  "export.exportedAt": "{date} \u5BFC\u51FA",
  "export.footer": "\u7531 Moments \xB7 BrainCore LifeOS \u5BFC\u51FA",
  "export.dateFull": "{y}\u5E74{m}\u6708{d}\u65E5 {wd} {hh}:{mm}",
  "export.noticeDone": "\u2713 \u5DF2\u5BFC\u51FA {n} \u6761\u5230 {path}",
  "export.mdTitle": "Moments \u5BFC\u51FA \xB7 {desc}",
  "export.mdSummary": "\u5BFC\u51FA\u4E8E {date}\uFF0C{count}",
  // 数据报告
  "stats.title": "Moments \u6570\u636E\u62A5\u544A",
  "stats.empty": "\u8FD8\u6CA1\u6709\u7B14\u8BB0\uFF0C\u8D76\u7D27\u53BB\u5199\u4E00\u6761\u5427 \u2728",
  "stats.label.memos": "\u6761\u7B14\u8BB0",
  "stats.label.words": "\u5B57",
  "stats.label.activeDays": "\u6D3B\u8DC3\u5929",
  "stats.label.spanDays": "\u603B\u8DE8\u5EA6",
  "stats.section.yearHeatmap": "\u{1F525} \u5168\u5E74\u6D3B\u8DC3\u5EA6",
  "stats.section.monthly": "\u{1F4C5} \u6708\u5EA6\u5206\u5E03",
  "stats.section.tagCloud": "\u2601\uFE0F \u6807\u7B7E\u4E91 \xB7 \u5B57\u53F7\u4EE3\u8868\u4F7F\u7528\u9891\u7387",
  "stats.section.topTags": "\u{1F3F7}\uFE0F \u6700\u5E38\u7528\u6807\u7B7E Top 10",
  "stats.section.rhythm": "\u23F1 \u8BB0\u5F55\u8282\u5F8B",
  "stats.section.hourly": "\u4E00\u5929\u4E2D\uFF0C\u4F60\u4EC0\u4E48\u65F6\u5019\u5199\u5F97\u6700\u591A",
  "stats.section.weekday": "\u4E00\u5468\u91CC\u7684\u8BB0\u5F55\u8282\u594F",
  "stats.section.highlights": "\u{1F31F} \u6709\u8DA3\u7684\u53D1\u73B0",
  "stats.nav.prevYear": "\u4E0A\u4E00\u5E74",
  "stats.nav.nextYear": "\u4E0B\u4E00\u5E74",
  "stats.legend.less": "\u5C11 ",
  "stats.legend.more": " \u591A",
  "stats.noTag": "\u6682\u65E0\u6807\u7B7E",
  "stats.hourly.subtitle": "\u57FA\u4E8E {n} \u6761\u5386\u53F2\u7B14\u8BB0\u7D2F\u8BA1",
  "stats.hourly.barTip": "{hh}:00 \u2014 {n} \u6761",
  "stats.hourly.peak": "\u{1F4DD} \u4F60\u6700\u559C\u6B22\u5728 {hh}:00 \u5199\u7B14\u8BB0\uFF0C\u81F3\u4ECA\u7D2F\u8BA1 {n} \u6761\uFF08{pct}%\uFF09",
  "stats.hourly.kpi.peak": "\u9AD8\u5CF0\u65F6\u6BB5",
  "stats.hourly.kpi.count": "\u5CF0\u503C\u7B14\u8BB0",
  "stats.hourly.kpi.share": "\u5360\u5168\u90E8\u7B14\u8BB0",
  "stats.hourly.countValue": "{n} \u6761",
  "stats.hourly.axisCount": "{n} \u6761",
  "stats.hourly.axisTime": "\u8BB0\u5F55\u65F6\u95F4",
  "stats.weekday.peak": "\u4F60\u5728{day}\u6700\u5E38\u8BB0\u5F55\uFF0C\u7D2F\u8BA1 {n} \u6761\uFF08{pct}%\uFF09",
  "stats.weekday.mon": "\u5468\u4E00",
  "stats.weekday.tue": "\u5468\u4E8C",
  "stats.weekday.wed": "\u5468\u4E09",
  "stats.weekday.thu": "\u5468\u56DB",
  "stats.weekday.fri": "\u5468\u4E94",
  "stats.weekday.sat": "\u5468\u516D",
  "stats.weekday.sun": "\u5468\u65E5",
  "stats.subtitle.monthly": "{year} \u5E74 \xB7 \u6309\u6708\u4EFD\u770B\u5206\u5E03",
  "stats.monthlyYearSum": "{year} \u5E74\u5171 {n} \u6761",
  "stats.monthShort": "{m}\u6708",
  "stats.monthlyBarTip": "{m} \u6708 \xB7 {n} \u6761",
  "stats.highlightsENOnly": "\u82F1\u6587\u7248\u7684\u300C\u6709\u8DA3\u53D1\u73B0\u300D\u6587\u6848\u8FD8\u5728\u51C6\u5907\u4E2D\uFF5E\u76EE\u524D\u4E2D\u6587\u6587\u6848\u66F4\u4E30\u5BCC\uFF0C\u5207\u56DE\u7B80\u4F53\u4E2D\u6587\u53EF\u4EE5\u770B\u5230\u5B8C\u6574\u7684\u968F\u673A\u6587\u6848\u6C60\u3002",
  // 年度全景
  "year.title": "\u5E74\u5EA6\u5168\u666F",
  "year.viewTitle": "Moments \xB7 \u5E74\u5EA6\u5168\u666F",
  "year.subtitle": "{year} \u5E74 \xB7 \u56DE\u987E\u4F60\u4E00\u6574\u5E74\u7684\u60F3\u6CD5",
  "year.empty": "{year} \u5E74\u8FD8\u6CA1\u6709\u7B14\u8BB0",
  "year.thisYear": "\u4ECA\u5E74",
  "year.yearSum": "{year} \u5E74\u5171 {n} \u6761\u7B14\u8BB0",
  "year.activeDays": "\u6D3B\u8DC3 {n} \u5929",
  "year.weekdayShort.0": "\u65E5",
  "year.weekdayShort.1": "\u4E00",
  "year.weekdayShort.2": "\u4E8C",
  "year.weekdayShort.3": "\u4E09",
  "year.weekdayShort.4": "\u56DB",
  "year.weekdayShort.5": "\u4E94",
  "year.weekdayShort.6": "\u516D",
  // Notice
  "notice.saved": "\u2713 \u5DF2\u8BB0\u4E0B",
  "notice.updated": "\u2713 \u5DF2\u66F4\u65B0",
  "notice.updatedWithTime": "\u2713 \u5DF2\u66F4\u65B0\uFF08\u542B\u65F6\u95F4\uFF09",
  "notice.deleted": "\u5DF2\u5220\u9664",
  "notice.imageFailed": "\u56FE\u7247\u4FDD\u5B58\u5931\u8D25\uFF1A{msg}",
  "notice.saveFailed": "\u4FDD\u5B58\u5931\u8D25\uFF1A{msg}",
  "notice.invalidTime": "\u65F6\u95F4\u683C\u5F0F\u4E0D\u5408\u6CD5\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9",
  "notice.emptyContent": "\u8FD8\u6CA1\u5199\u5185\u5BB9\uFF0C\u5148\u8F93\u5165\u70B9\u4EC0\u4E48\u518D\u53D1\u5E03",
  "notice.exportEmpty": "\u5F53\u524D\u7B5B\u9009\u6CA1\u6709\u53EF\u5BFC\u51FA\u7684\u7B14\u8BB0",
  "notice.exportFailed": "\u5BFC\u51FA\u5931\u8D25\uFF1A{msg}",
  "notice.exportDone": "\u2713 \u5DF2\u5BFC\u51FA {n} \u6761\u5230 {path}",
  "notice.dailyGoalDone": "\u{1F389} \u4ECA\u65E5\u6253\u5361\u5B8C\u6210\uFF01\u5DF2\u8BB0 {n} \u6761\uFF5E",
  "notice.checkFailed": "\u52FE\u9009\u5931\u8D25\uFF1A{msg}",
  "notice.copied": "\u5DF2\u590D\u5236",
  "notice.quoted": "\u5DF2\u5F15\u7528\uFF0C\u7EE7\u7EED\u8865\u5145\u60F3\u6CD5\u5427",
  "notice.pinned": "\u2713 \u5DF2\u7F6E\u9876",
  "notice.unpinned": "\u5DF2\u53D6\u6D88\u7F6E\u9876",
  "notice.starred": "\u2713 \u5DF2\u6536\u85CF",
  "notice.unstarred": "\u5DF2\u53D6\u6D88\u6536\u85CF",
  "notice.confirmDelete": "\u786E\u5B9A\u5220\u9664\u8FD9\u6761\u7B14\u8BB0\u5417\uFF1F",
  "notice.confirmDeleteOk": "\u786E\u8BA4\u5220\u9664",
  "notice.confirmContinue": "\u7EE7\u7EED",
  "card.pinnedMark": "\u5DF2\u7F6E\u9876",
  "card.starredMark": "\u5DF2\u6536\u85CF",
  "notice.deletedTrash": "\u5DF2\u5220\u9664 \xB7 \u53EF\u5728 _trash.md \u6062\u590D",
  // v2.0.7: main.ts / store.ts 的文案补齐
  "notice.normalizing": "\u6B63\u5728\u89C4\u8303\u5316\u2026",
  "notice.normalized": "\u2713 \u5DF2\u89C4\u8303\u5316 {n} \u6761\u7B14\u8BB0",
  "notice.normalizeFailed": "\u89C4\u8303\u5316\u5931\u8D25\uFF1A{msg}",
  "notice.protocolCaptureSaved": "\u2713 \u5DF2\u901A\u8FC7\u5FEB\u6377\u6307\u4EE4\u4FDD\u5B58",
  "notice.protocolCaptureFailed": "\u5FEB\u6377\u6307\u4EE4\u4FDD\u5B58\u5931\u8D25\uFF1A{msg}",
  "notice.normalizeConfirm": "\u5C06\u91CD\u5199\u6240\u6709 Moments \u7B14\u8BB0\u7684 md \u683C\u5F0F\u4EE5\u4FEE\u590D\u6E32\u67D3\u95EE\u9898\u3002\n\u5EFA\u8BAE\u5148\u5907\u4EFD Moments \u6587\u4EF6\u5939\u3002\n\n\u786E\u5B9A\u7EE7\u7EED\u5417\uFF1F",
  "error.fileChanged": "\u6587\u4EF6\u5185\u5BB9\u5DF2\u53D8\u66F4\uFF0C\u627E\u4E0D\u5230\u539F\u7B14\u8BB0\u4F4D\u7F6E\uFF0C\u8BF7\u5173\u95ED\u7F16\u8F91\u540E\u70B9\u5237\u65B0\u91CD\u8BD5",
  "error.originNotFound": "\u627E\u4E0D\u5230\u539F\u7B14\u8BB0\u6587\u4EF6",
  "error.emptyContent": "\u5185\u5BB9\u4E0D\u80FD\u4E3A\u7A7A",
  "error.unknown": "\u672A\u77E5\u9519\u8BEF",
  "command.openMemoria": "\u6253\u5F00 Moments \u9762\u677F",
  "command.openStats": "\u6253\u5F00\u6570\u636E\u62A5\u544A",
  "command.openYear": "\u6253\u5F00\u5E74\u5EA6\u5168\u666F\u56FE",
  "command.quickCapture": "\u5FEB\u901F\u8BB0\u5F55\uFF08\u5F39\u7A97\uFF09",
  "command.normalizeAll": "\u89C4\u8303\u5316\u6240\u6709\u7B14\u8BB0\u683C\u5F0F\uFF08\u4FEE\u590D md \u6E32\u67D3\uFF09",
  "ribbon.openMemoria": "\u6253\u5F00 Moments",
  "quickCapture.title": "\u{1F4AD} \u6B64\u523B\u60F3\u5230\u4E86\u4EC0\u4E48\uFF1F",
  "quickCapture.placeholder": "Ctrl+Enter \u53D1\u9001 \xB7 Esc \u5173\u95ED",
  "quickCapture.cancel": "\u53D6\u6D88",
  "quickCapture.send": "\u53D1\u9001",
  "settings.shortcut.heading": "iOS \u5FEB\u6377\u6307\u4EE4",
  "settings.shortcut.name": "\u590D\u5236\u5FEB\u901F\u8BB0\u5F55 URI",
  "settings.shortcut.desc": "\u590D\u5236\u5F53\u524D\u4ED3\u5E93\u4E13\u7528\u7684 URI \u6A21\u677F\uFF0C\u7528\u4E8E iOS \u5FEB\u6377\u6307\u4EE4\u7684\u201C\u6253\u5F00 URL\u201D\u64CD\u4F5C\u3002\u8BF7\u628A\u7ECF\u8FC7 URL \u7F16\u7801\u7684\u8F93\u5165\u5185\u5BB9\u8FFD\u52A0\u5728\u6A21\u677F\u672B\u5C3E\u3002",
  "settings.shortcut.copy": "\u590D\u5236 URI \u6A21\u677F",
  "settings.shortcut.copied": "\u2713 URI \u6A21\u677F\u5DF2\u590D\u5236",
  "settings.shortcut.copyFailed": "\u590D\u5236\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5",
  // 搜索
  "search.placeholder": "\u641C\u7D22\u7B14\u8BB0",
  "search.noResult": "\u6CA1\u6709\u5339\u914D\u7684\u7B14\u8BB0",
  // 筛选空态
  "empty.default": "\u8FD9\u91CC\u8FD8\u6CA1\u6709\u7B14\u8BB0\u54E6",
  "empty.defaultSub": "\u5728\u9876\u90E8\u8F93\u5165\u6846\u5199\u4E0B\u4F60\u7684\u7B2C\u4E00\u4E2A\u60F3\u6CD5\u5427\uFF5E",
  "empty.onThisDay": "\u90A3\u5E74\u4ECA\u65E5\u8FD8\u6CA1\u6709\u8BB0\u5F55",
  "empty.onThisDaySub": "\u8981\u4E0D\u968F\u673A\u62BD\u4E00\u5F20\u65E7\u7B14\u8BB0\uFF1F",
  "empty.onThisDayBtn": "\u968F\u673A\u62BD\u4E00\u5F20",
  "empty.onThisDayMeta": "\u518D\u62BD\u4E00\u6B21",
  "empty.onThisDayBackToReview": " \u56DE\u5230\u5F80\u5E74\u4ECA\u5929",
  "meta.reroll": " \u6362\u4E00\u6279",
  "meta.backToOnThisDay": " \u56DE\u5230\u5F80\u5E74\u4ECA\u5929",
  "empty.todo": "\u6CA1\u6709\u672A\u5B8C\u6210\u7684\u5F85\u529E",
  "empty.todoSub": "\u6240\u6709 `- [ ]` \u90FD\u52FE\u4E0A\u4E86\uFF0C\u6216\u8005\u4F60\u8FD8\u6CA1\u5199\u8FC7\u4EFB\u4F55\u5F85\u529E\u3002\u5728\u7B14\u8BB0\u91CC\u5199 `- [ ] \u8981\u505A\u7684\u4E8B` \u5C31\u80FD\u5728\u8FD9\u91CC\u770B\u5230\u3002",
  // 密度切换
  "density.toggle": "\u5207\u6362\u89C6\u56FE\u5BC6\u5EA6",
  "density.cozy": "\u5BBD\u677E",
  "density.compact": "\u7D27\u51D1",
  // 卡片菜单
  "card.pin": "\u7F6E\u9876",
  "card.unpin": "\u53D6\u6D88\u7F6E\u9876",
  "card.star": "\u6536\u85CF",
  "card.unstar": "\u53D6\u6D88\u6536\u85CF",
  "card.edit": "\u7F16\u8F91",
  "card.delete": "\u5220\u9664",
  "card.archive": "\u5F52\u6863",
  "card.unarchive": "\u53D6\u6D88\u5F52\u6863",
  "card.share": "\u5206\u4EAB",
  "card.restore": "\u6062\u590D",
  "card.purge": "\u5F7B\u5E95\u5220\u9664",
  "card.quote": "\u5F15\u7528",
  "card.copyLink": "\u590D\u5236\u94FE\u63A5",
  "card.copySource": "\u590D\u5236\u539F\u6587",
  "card.exportImage": "\u4FDD\u5B58\u56FE\u7247",
  "card.openSource": "\u6253\u5F00\u539F\u6587",
  "card.exportMd": "\u5BFC\u51FA\u4E3A Markdown",
  "card.exportHtml": "\u5BFC\u51FA\u4E3A HTML",
  "card.exportJson": "\u5BFC\u51FA\u4E3A JSON",
  "card.exportTooltip": "\u5BFC\u51FA\u5F53\u524D\u7B5B\u9009\u7ED3\u679C",
  "notice.archived": "\u5DF2\u5F52\u6863",
  "notice.unarchived": "\u5DF2\u53D6\u6D88\u5F52\u6863",
  "notice.softDeleted": "\u5DF2\u79FB\u5165\u56DE\u6536\u7AD9",
  "notice.restored": "\u5DF2\u6062\u590D",
  "notice.purged": "\u5DF2\u5F7B\u5E95\u5220\u9664",
  "notice.confirmPurge": "\u5F7B\u5E95\u5220\u9664\u540E\u65E0\u6CD5\u6062\u590D\uFF0C\u786E\u5B9A\u5417\uFF1F",
  "sort.createdDesc": "\u521B\u5EFA\u65F6\u95F4\uFF0C\u6700\u65B0\u4F18\u5148",
  "sort.createdAsc": "\u521B\u5EFA\u65F6\u95F4\uFF0C\u6700\u65E9\u4F18\u5148",
  "sort.updatedDesc": "\u7F16\u8F91\u65F6\u95F4\uFF0C\u6700\u65B0\u4F18\u5148",
  "sort.updatedAsc": "\u7F16\u8F91\u65F6\u95F4\uFF0C\u6700\u65E9\u4F18\u5148",
  "share.copyImage": "\u590D\u5236\u56FE\u7247",
  "share.previewImage": "\u9884\u89C8\u56FE\u7247",
  "share.previewHint": "\u70B9\u51FB\u9884\u89C8\u5927\u56FE\uFF0C\u590D\u5236\u8BF7\u7528\u4E0B\u65B9\u6309\u94AE",
  "share.searchPlaceholder": "\u641C\u7D22\u8BB0\u5F55",
  "share.loadMore": "\u518D\u52A0\u8F7D {n} \u6761",
  "share.saveImage": "\u4FDD\u5B58\u56FE\u7247",
  "share.imageCopied": "\u5206\u4EAB\u56FE\u7247\u5DF2\u590D\u5236\u3002",
  "share.copyFailed": "\u590D\u5236\u5931\u8D25\u3002",
  "share.copyFailedTitle": "\u65E0\u6CD5\u590D\u5236\u56FE\u7247",
  "share.copyFailedChoice": "\u7CFB\u7EDF\u672A\u80FD\u5199\u5165\u526A\u8D34\u677F\u3002\u4F60\u53EF\u4EE5\u91CD\u8BD5\u590D\u5236\uFF0C\u6216\u660E\u786E\u9009\u62E9\u4FDD\u5B58\u56FE\u7247\u3002",
  "share.retryCopy": "\u91CD\u8BD5\u590D\u5236",
  "share.saveInstead": "\u4FDD\u5B58\u56FE\u7247",
  "share.cancel": "\u53D6\u6D88",
  "share.cancelGeneration": "\u53D6\u6D88\u751F\u6210",
  "share.generationCancelled": "\u5DF2\u53D6\u6D88\u751F\u6210\u3002",
  "share.progressLayout": "\u6B63\u5728\u6392\u7248",
  "share.progressCopy": "\u6B63\u5728\u751F\u6210\u590D\u5236\u56FE\u7247",
  "share.progressPrepare": "\u6B63\u5728\u51C6\u5907\u56FE\u7247",
  "share.progressPreview": "\u6B63\u5728\u751F\u6210\u9884\u89C8",
  "share.progressSave": "\u6B63\u5728\u751F\u6210\u4FDD\u5B58\u56FE\u7247",
  "share.imageSaved": "\u5206\u4EAB\u56FE\u7247\u5DF2\u4FDD\u5B58\u3002",
  "share.saveFailed": "\u4FDD\u5B58\u5931\u8D25\u3002",
  "share.titlePlaceholder": "\u6807\u9898\uFF08\u53EF\u9009\uFF1B\u7559\u7A7A\u5219\u7528\u6C34\u5370\u91CC\u7684\u9644\u52A0\u6587\u6848\uFF09",
  "share.multiAction": "\u591A\u9009\u5206\u4EAB",
  "share.multiTitle": "\u9009\u62E9\u8981\u5408\u5E76\u5206\u4EAB\u7684 Moments",
  "share.selectAll": "\u5168\u9009",
  "share.clearSelection": "\u6E05\u7A7A",
  "share.selectedCount": "\u5DF2\u9009 {n} \u6761",
  "share.budgetStatus": "\u4F30\u7B97\u9AD8\u5EA6 {height}/{maxHeight} \xB7 \u4E0A\u9650 {max} \u6761",
  "share.budgetExceeded": "\u5DF2\u8FBE\u5230\u591A\u6761\u5206\u4EAB\u7684\u6570\u91CF\u6216\u9AD8\u5EA6\u4E0A\u9650\uFF0C\u8BF7\u51CF\u5C11\u9009\u62E9\u3002",
  "share.createCombined": "\u751F\u6210\u5206\u4EAB\u56FE",
  // 统计
  "stats.memos": "\u7B14\u8BB0",
  "stats.tags": "\u6807\u7B7E",
  "stats.days": "\u5929\u6570",
  "stats.dailyGoal": "\u6BCF\u65E5\u76EE\u6807",
  // 工具栏按钮
  "toolbar.yearPanorama": "\u5E74\u5EA6\u5168\u666F\u56FE",
  "toolbar.statsReport": "\u6570\u636E\u62A5\u544A",
  "toolbar.export": "\u5BFC\u51FA",
  "toolbar.saveMd": "\u4FDD\u5B58\u5230\u5E93 \xB7 Markdown",
  "toolbar.saveHtml": "\u4FDD\u5B58\u5230\u5E93 \xB7 HTML",
  "toolbar.saveJson": "\u4FDD\u5B58\u5230\u5E93 \xB7 JSON",
  "toolbar.toggleSidebar": "\u5207\u6362\u4FA7\u680F",
  "toolbar.toCalendar": "\u5207\u6362\u4E3A\u6708\u5386",
  "toolbar.toHeatmap": "\u5207\u6362\u4E3A\u70ED\u529B\u56FE",
  "toolbar.insertTag": "\u63D2\u5165\u6807\u7B7E #",
  "toolbar.insertImage": "\u63D2\u5165\u56FE\u7247",
  "toolbar.insertUL": "\u63D2\u5165\u65E0\u5E8F\u5217\u8868",
  "toolbar.insertOL": "\u63D2\u5165\u6709\u5E8F\u5217\u8868",
  "toolbar.insertTask": "\u63D2\u5165\u4EFB\u52A1\u5217\u8868",
  "toolbar.insertTable": "\u63D2\u5165\u8868\u683C",
  "toolbar.quote": "\u5F15\u7528",
  "toolbar.more": "\u66F4\u591A\u64CD\u4F5C",
  // 设置页（v2.0.1 新补）
  "settings.title": "Moments \u8BBE\u7F6E",
  "settings.folder.name": "\u7B14\u8BB0\u6587\u4EF6\u5939",
  "settings.folder.desc": "Moments \u5728\u6B64\u6587\u4EF6\u5939\u4E0B\u8BFB\u5199 YYYY.md \u6587\u4EF6\uFF08\u76F8\u5BF9 vault \u6839\u76EE\u5F55\uFF09",
  "settings.attachFolder.name": "\u56FE\u7247\u9644\u4EF6\u6587\u4EF6\u5939",
  "settings.attachFolder.desc": "\u7C98\u8D34/\u62D6\u62FD/\u9009\u62E9\u7684\u56FE\u7247\u4F1A\u4FDD\u5B58\u5230\u6B64\u76EE\u5F55\uFF08\u76F8\u5BF9 vault \u6839\u76EE\u5F55\uFF09",
  "settings.sidebarTags.name": "\u5728\u4FA7\u8FB9\u680F\u663E\u793A\u6807\u7B7E\u6811",
  "settings.sidebarTags.desc": "\u9ED8\u8BA4\u5173\u95ED\u3002Obsidian \u53F3\u4FA7\u680F\u5DF2\u6709\u6807\u7B7E\u9762\u677F\uFF0C\u91CD\u590D\u5C55\u793A\u610F\u4E49\u4E0D\u5927\u3002\u5173\u95ED\u540E\u53EF\u5728\u5361\u7247\u5E95\u90E8\u70B9\u51FB\u6807\u7B7E\u80F6\u56CA\u7B5B\u9009\uFF0C\u6216\u5728\u641C\u7D22\u6846\u8F93\u5165\u300C#\u6807\u7B7E\u540D\u300D\u7B5B\u9009\u3002",
  "settings.sidebarYears.name": "\u5728\u4FA7\u8FB9\u680F\u663E\u793A\u5E74\u4EFD\u5217\u8868",
  "settings.sidebarYears.desc": "\u9ED8\u8BA4\u5F00\u542F\u3002\u7B14\u8BB0\u8DE8\u5EA6\u957F\uFF08\u5982 8 \u5E74\u4EE5\u4E0A\uFF09\u65F6\u5E74\u4EFD\u5217\u8868\u4F1A\u5F88\u957F\uFF0C\u5173\u95ED\u540E\u53EF\u9690\u85CF\uFF0C\u51CF\u5C11\u53F3\u4FA7\u89C6\u89C9\u5E72\u6270\u3002",
  "settings.clearAfterSave.name": "\u53D1\u9001\u540E\u6E05\u7A7A\u8F93\u5165\u6846",
  "settings.pageSize.name": "\u6BCF\u6B21\u52A0\u8F7D\u6761\u6570",
  "settings.pageSize.desc": "\u7011\u5E03\u6D41\u6BCF\u6B21\u5C55\u793A\u591A\u5C11\u6761\uFF0C\u6EDA\u52A8\u5230\u5E95\u81EA\u52A8\u52A0\u8F7D\u66F4\u591A",
  "settings.useTrash.name": "\u5220\u9664\u65F6\u4FDD\u7559\u5230\u56DE\u6536\u7AD9",
  "settings.useTrash.desc": "\u5F00\u542F\u540E\uFF0C\u5220\u9664\u7684\u7B14\u8BB0\u4F1A\u8FFD\u52A0\u5230 <\u7B14\u8BB0\u6587\u4EF6\u5939>/_trash.md\uFF08\u800C\u4E0D\u662F\u5F7B\u5E95\u6D88\u5931\uFF09\uFF0C\u4FBF\u4E8E\u8BEF\u5220\u540E\u624B\u52A8\u6062\u590D\u3002\u5173\u95ED = \u5F7B\u5E95\u5220\u9664\u3002",
  "settings.trashMax.name": "\u56DE\u6536\u7AD9\u6700\u5927\u6761\u6570",
  "settings.trashMax.desc": "_trash.md \u4FDD\u7559\u7684\u6700\u5927\u7B14\u8BB0\u6570\uFF0C\u8D85\u51FA\u540E\u81EA\u52A8\u4E22\u5F03\u6700\u65E7\u7684\u3002\u9632\u6B62\u957F\u671F\u4F7F\u7528\u540E\u56DE\u6536\u7AD9\u6587\u4EF6\u53D8\u5F97\u8FC7\u5927\u5F71\u54CD\u6027\u80FD\u3002",
  "settings.trash.100": "100 \u6761",
  "settings.trash.300": "300 \u6761\uFF08\u63A8\u8350\uFF09",
  "settings.trash.500": "500 \u6761",
  "settings.trash.1000": "1000 \u6761",
  "settings.trash.3000": "3000 \u6761",
  "settings.trash.0": "\u4E0D\u9650\u5236\uFF08\u4E0D\u63A8\u8350\uFF09",
  "settings.exportTheme.name": "\u5BFC\u51FA\u56FE\u7247 \xB7 \u80CC\u666F\u4E3B\u9898",
  "settings.exportTheme.desc": "\u4FDD\u5B58\u5361\u7247\u56FE\u7247\u65F6\u7684\u80CC\u666F\u6837\u5F0F\u30028 \u79CD\u7CBE\u9009\u4E3B\u9898 + \u8DDF\u968F Obsidian \u660E\u6697\u8272 + \u968F\u673A\u3002",
  "settings.exportTheme.auto": "\u{1F3AD} \u8DDF\u968F Obsidian \u660E\u6697",
  "settings.exportTheme.random": "\u{1F3B2} \u6BCF\u6B21\u968F\u673A",
  "settings.exportTheme.paper": "\u{1F4C4} \u7EB8\u5F20\u767D",
  "settings.exportTheme.kraft": "\u{1F7EB} \u725B\u76AE\u7EB8",
  "settings.exportTheme.mint": "\u{1F33F} \u8584\u8377\u7EFF",
  "settings.exportTheme.peach": "\u{1F351} \u871C\u6843\u7C89",
  "settings.exportTheme.sky": "\u2601\uFE0F \u6674\u7A7A\u84DD",
  "settings.exportTheme.lavender": "\u{1F49C} \u85B0\u8863\u8349",
  "settings.exportTheme.midnight": "\u{1F319} \u5348\u591C\u84DD",
  "settings.exportTheme.charcoal": "\u26AB \u6728\u70AD\u9ED1",
  "settings.collapse.name": "\u957F\u7B14\u8BB0\u81EA\u52A8\u6298\u53E0",
  "settings.collapse.desc": "\u8D85\u8FC7\u8BBE\u5B9A\u884C\u6570\u7684\u7B14\u8BB0\u4F1A\u81EA\u52A8\u6298\u53E0\uFF0C\u5E95\u90E8\u663E\u793A\u300C\u7EE7\u7EED\u8BFB\u300D\u6309\u94AE\u3002\u56FE\u7247\u59CB\u7EC8\u5B8C\u6574\u663E\u793A\uFF0C\u53EA\u6298\u6587\u5B57\u90E8\u5206\u3002",
  "settings.collapse.0": "\u6C38\u4E0D\u6298\u53E0",
  "settings.collapse.4": "4 \u884C",
  "settings.collapse.6": "6 \u884C",
  "settings.collapse.8": "8 \u884C\uFF08\u63A8\u8350\uFF09",
  "settings.collapse.12": "12 \u884C",
  "settings.collapse.20": "20 \u884C",
  "settings.dailyGoal.name": "\u6BCF\u65E5\u76EE\u6807\u7B14\u8BB0\u6570",
  "settings.dailyGoal.desc": "\u5DE6\u4FA7\u680F\u70ED\u529B\u56FE\u4E0B\u65B9\u7684\u8FDB\u5EA6\u6761\u6EE1\u503C\u3002\u8BB0\u5F55\u8D8A\u7B80\u5355\u8D8A\u5BB9\u6613\u575A\u6301\uFF0C\u5EFA\u8BAE 3-7 \u6761\u3002",
  "settings.heading.newFeatures": "\u529F\u80FD\u5F00\u5173",
  "settings.density.name": "\u89C6\u56FE\u5BC6\u5EA6",
  "settings.density.desc": "\u7D27\u51D1\u6A21\u5F0F\u6BCF\u5F20\u5361\u53EA\u663E\u793A\u524D\u51E0\u884C\uFF0C\u9002\u5408\u5FEB\u901F\u6D4F\u89C8 1000+ \u6761\u7B14\u8BB0\uFF1B\u5BBD\u677E\u6A21\u5F0F\u662F\u9ED8\u8BA4",
  "settings.density.cozy": "\u5BBD\u677E",
  "settings.density.compact": "\u7D27\u51D1",
  "settings.contentWidth.name": "\u5185\u5BB9\u5BBD\u5EA6",
  "settings.contentWidth.desc": "\u8C03\u6574\u684C\u9762\u7AEF\u8F93\u5165\u533A\u548C\u7B14\u8BB0\u6D41\u7684\u6700\u5927\u5BBD\u5EA6\uFF1B\u79FB\u52A8\u7AEF\u59CB\u7EC8\u4F7F\u7528\u81EA\u9002\u5E94\u5BBD\u5EA6\u3002",
  "settings.contentWidth.focused": "\u4E13\u6CE8",
  "settings.contentWidth.balanced": "\u5747\u8861\uFF08\u63A8\u8350\uFF09",
  "settings.contentWidth.wide": "\u5BBD\u9614",
  "settings.vim.name": "\u542F\u7528 Vim \u5FEB\u6377\u952E",
  "settings.vim.desc": "j/k \u4E0A\u4E0B\u5207\u6362\u5361\u7247\uFF0CEnter \u7F16\u8F91\uFF0C/ \u641C\u7D22\uFF0Ci \u5199\u65B0\u7B14\u8BB0\uFF0Cgg/G \u8DF3\u9996\u5C3E\uFF0CEsc \u6E05\u9009\u4E2D",
  "settings.mood.name": "\u542F\u7528\u60C5\u611F\u8272\u5F69\u53EF\u89C6\u5316",
  "settings.mood.desc": "\u6839\u636E\u5185\u5BB9\u5173\u952E\u8BCD\uFF0C\u5728\u5361\u7247\u5DE6\u8FB9\u663E\u793A\u8272\u5E26\u5E76\u94FA\u4E00\u5C42\u6D45\u5E95\u30027 \u79CD\u7EF4\u5EA6\uFF1A\u5F00\u5FC3(\u91D1)\u3001\u611F\u52A8(\u7C89)\u3001\u9F13\u52B1(\u6A59)\u3001\u4F4E\u843D(\u84DD\u7070)\u3001\u70E6\u8E81(\u7EA2)\u3001\u5BB3\u6015(\u7D2B)\u3001\u75B2\u60EB(\u8910)\u3002\u57FA\u4E8E\u5173\u952E\u8BCD\u8BCD\u5178\uFF0C\u4F1A\u6709\u8BEF\u5224\u3002",
  "settings.smartReview.name": "\u542F\u7528\u667A\u80FD\u62BD\u9009",
  "settings.smartReview.desc": "\u300C\u968F\u673A\u62BD\u4E00\u5F20\u300D\u6539\u7528\u52A0\u6743\u7B97\u6CD5\uFF1A\u8D8A\u4E45\u6CA1\u7FFB\u8FC7\u7684\u8D8A\u4F18\u5148\u3001\u548C\u4ECA\u5929\u6807\u7B7E/\u60C5\u7EEA\u547C\u5E94\u7684\u52A0\u5206",
  "settings.language.name": "\u8BED\u8A00",
  "settings.language.desc": "auto \u4F1A\u8DDF\u968F Obsidian \u8BED\u8A00\uFF1B\u624B\u52A8\u5207\u6362\u5373\u65F6\u751F\u6548\uFF08\u9700\u91CD\u5F00 Moments \u89C6\u56FE\uFF09",
  "settings.language.auto": "\u81EA\u52A8\uFF08\u8DDF\u968F Obsidian\uFF09",
  "settings.language.zh": "\u7B80\u4F53\u4E2D\u6587",
  "settings.language.en": "English",
  "settings.sendHotkey.name": "\u53D1\u9001\u5FEB\u6377\u952E",
  "settings.sendHotkey.desc": "\u9ED8\u8BA4 Ctrl/Cmd+Enter \u53D1\u9001\u3002\u5982\u679C\u6309\u4E0B\u6CA1\u53CD\u5E94\uFF0C\u901A\u5E38\u662F Obsidian \u628A Ctrl+Enter \u7ED1\u5B9A\u7ED9\u4E86\u5185\u7F6E\u547D\u4EE4\u300C\u5728\u65B0\u6807\u7B7E\u9875\u4E2D\u6253\u5F00\u5149\u6807\u5904\u94FE\u63A5\u300D\uFF08\u6309\u952E\u641C\u7D22\u641C\u4E0D\u5230\uFF0C\u9700\u8981\u5728 \u8BBE\u7F6E \u2192 \u5FEB\u6377\u952E \u5217\u8868\u91CC\u624B\u52A8\u6ED1\u5230\u8BE5\u547D\u4EE4\u4F4D\u7F6E\uFF0C\u70B9\u51FB\u53F3\u4FA7 \xD7 \u89E3\u9664\u7ED1\u5B9A\uFF09\u3002\u89E3\u9664\u540E\u5373\u53EF\u6062\u590D\uFF0C\u6216\u5207\u6362\u4E3A Enter \u53D1\u9001\u3002",
  "settings.sendHotkey.enter": "Enter \u53D1\u9001\uFF08Shift+Enter \u6362\u884C\uFF09",
  "settings.sendHotkey.ctrlEnter": "Ctrl/Cmd+Enter \u53D1\u9001\uFF08Enter \u6362\u884C\uFF09\u2B50 \u9ED8\u8BA4",
  "settings.mobileInputStyle.name": "\u79FB\u52A8\u7AEF\u8F93\u5165\u6846\u5165\u53E3",
  "settings.mobileInputStyle.desc": "\u4EC5\u624B\u673A/\u5E73\u677F\u751F\u6548\u3002FAB \u6A21\u5F0F\u4E0B\u8F93\u5165\u6846\u9ED8\u8BA4\u9690\u85CF\uFF0C\u53F3\u4E0B\u89D2\u663E\u793A\u6D6E\u52A8 \u2795 \u6309\u94AE\uFF0C\u70B9\u51FB\u5C55\u5F00\u3002",
  "settings.mobileInputStyle.fab": "FAB \u6D6E\u52A8\u6309\u94AE\uFF08\u70B9\u51FB\u5C55\u5F00\uFF09\u2B50 \u9ED8\u8BA4",
  "settings.mobileInputStyle.alwaysVisible": "\u5E38\u9A7B\u5E95\u90E8",
  "fab.aria": "\u65B0\u5EFA\u7B14\u8BB0",
  "fab.close": "\u6536\u8D77\u8F93\u5165\u6846",
  "settings.heading.about": "\u5173\u4E8E",
  "settings.about.p1": "Moments \u2014 \u6D6E\u58A8\u5F0F\u788E\u7247\u7B14\u8BB0\u3002\u6240\u6709\u7B14\u8BB0\u4EE5\u7EAF Markdown \u683C\u5F0F\u5B58\u50A8\uFF08",
  "settings.about.p2": "\uFF09\uFF0C\u505C\u7528\u63D2\u4EF6\u540E\u4F60\u7684\u7B14\u8BB0\u4F9D\u7136\u5B8C\u6574\u53EF\u8BFB\u3002",
  "settings.repo.name": "GitHub \u4ED3\u5E93",
  "settings.repo.desc": "\u67E5\u770B\u6E90\u7801\u3001\u53CD\u9988\u95EE\u9898\u3001\u63D0\u51FA\u5EFA\u8BAE\uFF0C\u90FD\u5728\u8FD9\u91CC\u89C1",
  "settings.repo.btn": "\u6253\u5F00\u4ED3\u5E93",
  "settings.version": "\u5F53\u524D\u7248\u672C\uFF1Av{ver}",
  // 通用
  "common.confirm": "\u786E\u5B9A",
  "common.cancel": "\u53D6\u6D88",
  "common.close": "\u5173\u95ED",
  "common.refresh": "\u5237\u65B0",
  "common.loading": "\u52A0\u8F7D\u4E2D\u2026",
  // v2.0.19: 补齐过去硬编码中文的地方
  // 折叠按钮
  "card.collapseFull": "\u5168\u6587",
  "card.collapseFold": "\u6536\u8D77",
  // 侧栏月历（原先全写死）
  "calendar.weekday.0": "\u65E5",
  "calendar.weekday.1": "\u4E00",
  "calendar.weekday.2": "\u4E8C",
  "calendar.weekday.3": "\u4E09",
  "calendar.weekday.4": "\u56DB",
  "calendar.weekday.5": "\u4E94",
  "calendar.weekday.6": "\u516D",
  "calendar.prevMonth": "\u4E0A\u4E2A\u6708",
  "calendar.nextMonth": "\u4E0B\u4E2A\u6708",
  "calendar.monthTitle": "{year}\u5E74{m}\u6708",
  "calendar.dayCount": "{date}  {n} \u6761",
  // 图片 lightbox
  "lightbox.close": "\u5173\u95ED",
  "lightbox.prev": "\u4E0A\u4E00\u5F20",
  "lightbox.next": "\u4E0B\u4E00\u5F20",
  // 统计页热力图 / 柱图 hover 与按钮文案
  "stats.yearBtn": "{year} \u5E74",
  "stats.heatmap.future": "{date}  \u672A\u6765",
  "stats.heatmap.dayCount": "{date}  {n} \u6761",
  "stats.monthlyBarRange": "{key}: {n} \u6761",
  // 年度全景 hover 行
  "year.dayHover": "{date}  {n} \u6761",
  // 导出 describe 用（view.ts describeCurrentFilter）
  "export.desc.all": "\u5168\u90E8\u7B14\u8BB0",
  "export.desc.year": "{year} \u5E74",
  // v2.0.20: 侧栏默认视图设置
  "settings.defaultOverview.name": "\u4FA7\u680F\u9ED8\u8BA4\u89C6\u56FE",
  "settings.defaultOverview.desc": "\u6253\u5F00 Moments \u9762\u677F\u65F6\u4FA7\u680F\u9876\u90E8\u9ED8\u8BA4\u663E\u793A\u54EA\u4E2A\u89C6\u56FE\u3002\u4ECD\u7136\u53EF\u4EE5\u968F\u65F6\u70B9\u5207\u6362\u6309\u94AE\u4E34\u65F6\u5207\u6362\u5230\u53E6\u4E00\u4E2A\uFF08\u4E34\u65F6\u5207\u6362\u4E0D\u4F1A\u6539\u8FD9\u91CC\u7684\u9ED8\u8BA4\u503C\uFF09\u3002",
  "settings.defaultOverview.heatmap": "\u{1F525} \u70ED\u529B\u56FE\uFF08\u9ED8\u8BA4\uFF09",
  "settings.defaultOverview.calendar": "\u{1F4C5} \u6708\u5386",
  "settings.defaultOverview.buddy": "\u{1F43E} \u5BA0\u7269",
  "settings.openOnStartup.name": "\u542F\u52A8\u65F6\u6253\u5F00 Moments",
  "settings.openOnStartup.desc": "Obsidian \u6062\u590D\u5B8C\u5DE5\u4F5C\u533A\u540E\uFF0C\u81EA\u52A8\u6253\u5F00\u6216\u5207\u6362\u5230 Moments\u3002\u4E0D\u4F1A\u5173\u95ED\u5DF2\u6709\u6807\u7B7E\u9875\u3002",
  // v2.1.0: 宠物系统
  "toolbar.toBuddy": "\u5207\u6362\u4E3A\u5BA0\u7269",
  // 稀有度
  "buddy.rarity.common": "\u666E\u901A",
  "buddy.rarity.uncommon": "\u7F55\u89C1",
  "buddy.rarity.rare": "\u7A00\u6709",
  "buddy.rarity.epic": "\u53F2\u8BD7",
  "buddy.rarity.legendary": "\u4F20\u8BF4",
  // v2.1.0-iter13: 成长阶段（幼年 → 少年 → 成年）
  //   阈值（OR 关系）：少年 = 30 天 OR 100 条；成年 = 365 天 OR 1000 条
  "buddy.stage.baby": "\u5E7C\u5E74",
  "buddy.stage.teen": "\u5C11\u5E74",
  "buddy.stage.adult": "\u6210\u5E74",
  // 5 维属性（中文走 Memoria 风格的本地化）
  "buddy.stat.debugging": "\u6253\u78E8\u529B",
  "buddy.stat.patience": "\u8010\u5FC3\u503C",
  "buddy.stat.chaos": "\u6DF7\u6C8C\u6C14",
  "buddy.stat.wisdom": "\u667A\u6167\u5149",
  "buddy.stat.snark": "\u5410\u69FD\u6B32",
  // v2.1.0-iter11: 属性 tooltip（hover 时显示算法解释 + "如何升级"提示）
  "buddy.stat.tip.debugging": "\u7B14\u8BB0\u91CC\u7528\u5217\u8868 / \u4EFB\u52A1 / \u5F15\u7528 / \u94FE\u63A5 / \u6807\u9898\u7B49\u7ED3\u6784\u7684\u6BD4\u4F8B\uFF08\u591A\u7528 markdown \u7ED3\u6784\u80FD\u6DA8\uFF09",
  "buddy.stat.tip.patience": "\u5E73\u5747\u7B14\u8BB0\u957F\u5EA6\uFF08\u5076\u5C14\u5199\u4E00\u4E24\u6761\u957F\u53CD\u601D\u80FD\u6DA8\uFF09",
  "buddy.stat.tip.chaos": "\u6700\u8FD1 7 \u5929\u5199\u7B14\u8BB0\u7684\u9891\u7387 vs \u5386\u53F2\u5E73\u5747\u7684\u504F\u79BB\uFF08\u53D8\u591A\u53D8\u5C11\u90FD\u6DA8\uFF0C\u5E73\u7A33\u8F93\u51FA\u964D\uFF09",
  "buddy.stat.tip.wisdom": "\u7B14\u8BB0\u5E26 #\u6807\u7B7E \u6216 [[\u53CC\u94FE]] \u7684\u6BD4\u4F8B",
  "buddy.stat.tip.snark": "\u60C5\u7EEA\u8868\u8FBE\u7684\u6D3B\u8DC3\u5EA6\uFF08\u542B emoji \u6216\u60C5\u7EEA\u8BCD\u7684\u7B14\u8BB0\u6BD4\u4F8B\uFF09",
  // 物种名（18 种）
  "buddy.species.cactus": "\u4ED9\u4EBA\u638C",
  "buddy.species.capybara": "\u6C34\u8C5A",
  "buddy.species.chonk": "\u80D6\u80D6\u517D",
  "buddy.species.snail": "\u8717\u725B",
  "buddy.species.cat": "\u732B",
  "buddy.species.blob": "\u53F2\u83B1\u59C6",
  "buddy.species.duck": "\u9E2D\u5B50",
  "buddy.species.turtle": "\u4E4C\u9F9F",
  "buddy.species.rabbit": "\u5154\u5B50",
  "buddy.species.goose": "\u9E45",
  "buddy.species.mushroom": "\u8611\u83C7",
  "buddy.species.penguin": "\u4F01\u9E45",
  "buddy.species.axolotl": "\u7F8E\u897F\u8788",
  "buddy.species.robot": "\u673A\u5668\u4EBA",
  "buddy.species.octopus": "\u7AE0\u9C7C",
  "buddy.species.owl": "\u732B\u5934\u9E70",
  "buddy.species.dragon": "\u9F99",
  "buddy.species.ghost": "\u5E7D\u7075",
  // Motto（每只一句，体现性格）
  "buddy.motto.cactus": "\u6162\u6162\u6765\uFF0C\u4E0D\u7740\u6025",
  "buddy.motto.capybara": "\u5FC3\u82E5\u5B89\u597D\uFF0C\u4E07\u4E8B\u90FD\u597D",
  "buddy.motto.chonk": "\u5706\u6EDA\u6EDA\u5730\u5B58\u5728\u7740",
  "buddy.motto.snail": "\u6211\u6709\u81EA\u5DF1\u7684\u8282\u594F",
  "buddy.motto.cat": "\u4FDD\u6301\u597D\u5947",
  "buddy.motto.blob": "\u968F\u6CE2\u9010\u6D41\u4E5F\u633A\u597D",
  "buddy.motto.duck": "\u770B\u7740\u50CF\u9E2D\uFF0C\u53EB\u7740\u4E5F\u50CF\u9E2D",
  "buddy.motto.turtle": "\u7A33\u5C31\u5B8C\u4E8B\u4E86",
  "buddy.motto.rabbit": "\u8E66\u8E66\u8DF3\u8DF3\u8FC7\u65E5\u5B50",
  "buddy.motto.goose": "\u5435\u95F9\u662F\u6211\u7684\u8BED\u8A00",
  "buddy.motto.mushroom": "\u5728\u9634\u5F71\u91CC\u751F\u957F",
  "buddy.motto.penguin": "\u897F\u88C5\u662F\u6211\u7684\u672C\u8272",
  "buddy.motto.axolotl": "\u6C38\u8FDC\u7684\u7AE5\u5FC3",
  "buddy.motto.robot": "BEEP BOOP",
  "buddy.motto.octopus": "\u516B\u6761\u817F\uFF0C\u516B\u4E2A\u60F3\u6CD5",
  "buddy.motto.owl": "\u591C\u665A\u5C5E\u4E8E\u6211",
  "buddy.motto.dragon": "\u4F20\u8BF4\u4E0D\u6B62\u662F\u8FC7\u53BB",
  "buddy.motto.ghost": "Anything is possible.",
  // 陪伴信息
  "buddy.daysCompanion": "\u5DF2\u966A\u4F60 {n} \u5929",
  "buddy.daysCompanion.first": "\u966A\u4F60\u7684\u7B2C 1 \u5929",
  // 蛋（首次孵化）
  "buddy.egg.title": "\u4E00\u4E2A\u7B49\u5F85\u5B75\u5316\u7684\u86CB",
  "buddy.egg.desc": "\u7ED9\u5B83\u8D77\u4E2A\u540D\u5B57\u5427 \u2728",
  "buddy.egg.placeholder": "\u6BD4\u5982\uFF1A\u8C46\u8C46 / Aix / \u5C0F\u82B1...",
  "buddy.egg.hatchBtn": "\u5B75\u5316",
  // v2.1.0-iter10: 重命名（外观锁定，仅名字可改 —— 这才是"专属陪伴"的核心）
  "buddy.rename.tip": "\u53CC\u51FB\u6539\u540D",
  "buddy.rename.title": "\u7ED9\u5B83\u6362\u4E2A\u540D\u5B57",
  "buddy.rename.placeholder": "\u65B0\u540D\u5B57",
  "buddy.rename.save": "\u4FDD\u5B58",
  "buddy.rename.cancel": "\u53D6\u6D88",
  // 气泡文案池（每个情境 3 条候选，按时间稳定轮换）
  // 气泡文案池（每个情境 6 条候选，纯随机抽取，让每次打开都有新鲜感）
  "buddy.quip.goalDone.0": "\u4ECA\u5929\u7684\u4F60\u8D85\u68D2 \u2B50",
  "buddy.quip.goalDone.1": "\u76EE\u6807\u8FBE\u6210\uFF0C\u53EF\u4EE5\u559D\u676F\u6C34\u4E86\uFF5E",
  "buddy.quip.goalDone.2": "\u8BB0\u5F55\u7684\u8FD9\u4EFD\u5FC3\uFF0C\u633A\u597D\u7684",
  "buddy.quip.goalDone.3": "\u8BF4\u5230\u505A\u5230\uFF0C\u4F60\u771F\u53EF\u9760",
  "buddy.quip.goalDone.4": "\u4ECA\u5929\u4E5F\u597D\u597D\u5BF9\u5F85\u4E86\u81EA\u5DF1",
  "buddy.quip.goalDone.5": "\u8FD9\u4E00\u5929\uFF0C\u88AB\u4F60\u6D3B\u660E\u767D\u4E86",
  "buddy.quip.lateNight.0": "\u591C\u6DF1\u4E86\uFF0C\u65E9\u70B9\u4F11\u606F\u54E6",
  "buddy.quip.lateNight.1": "\u51CC\u6668\u5199\u4E0B\u7684\u5B57\u6700\u8BDA\u5B9E",
  "buddy.quip.lateNight.2": "\u6211\u966A\u4F60\uFF0C\u4F46\u8BB0\u5F97\u7761\u89C9",
  "buddy.quip.lateNight.3": "\u522B\u71AC\u592A\u665A\uFF0C\u8EAB\u4F53\u5728\u6297\u8BAE\u5566",
  "buddy.quip.lateNight.4": "\u6708\u4EAE\u90FD\u5728\u770B\u4F60\u5199\u5B57",
  "buddy.quip.lateNight.5": "\u591C\u91CC\u7684\u60F3\u6CD5\uFF0C\u767D\u5929\u518D\u770B\u4E00\u904D",
  "buddy.quip.longGone.0": "\u597D\u4E45\u6CA1\u89C1\uFF0C\u6700\u8FD1\u600E\u4E48\u6837\uFF1F",
  "buddy.quip.longGone.1": "\u6211\u6709\u70B9\u60F3\u4F60\u4E86",
  "buddy.quip.longGone.2": "\u8FD9\u91CC\u4E00\u76F4\u90FD\u5728",
  "buddy.quip.longGone.3": "\u56DE\u6765\u5566\uFF0C\u968F\u4FBF\u5750",
  "buddy.quip.longGone.4": "\u6700\u8FD1\u6709\u4EC0\u4E48\u60F3\u8BF4\u7684\u5417\uFF1F",
  "buddy.quip.longGone.5": "\u7A7A\u767D\u4E5F\u662F\u4E00\u79CD\u8BB0\u5F55",
  "buddy.quip.missYou.0": "\u4ECA\u5929\u804A\u804A\u5417\uFF1F",
  "buddy.quip.missYou.1": "\u968F\u624B\u5199\u4E00\u53E5\u4E5F\u884C\u7684",
  "buddy.quip.missYou.2": "\u60F3\u5230\u4EC0\u4E48\u4E86\u5417\uFF1F",
  "buddy.quip.missYou.3": "\u8FD9\u51E0\u5929\u8FC7\u5F97\u600E\u4E48\u6837\uFF1F",
  "buddy.quip.missYou.4": "\u6211\u5728\u8FD9\u513F\u7B49\u4F60\u5462",
  "buddy.quip.missYou.5": "\u54EA\u6015\u4E00\u4E2A\u8BCD\u4E5F\u597D",
  "buddy.quip.earlyBird.0": "\u65E9\u8D77\u7684\u4EBA\u6700\u5389\u5BB3",
  "buddy.quip.earlyBird.1": "\u65E9\u5B89\uFF0C\u4ECA\u5929\u4E5F\u52A0\u6CB9",
  "buddy.quip.earlyBird.2": "\u6E05\u6668\u7684\u7075\u611F\u6700\u503C\u94B1",
  "buddy.quip.earlyBird.3": "\u65B0\u7684\u4E00\u5929\uFF0C\u6162\u6162\u5C55\u5F00",
  "buddy.quip.earlyBird.4": "\u65E9\u5B89\uFF0C\u5148\u559D\u53E3\u6C34\u5427",
  "buddy.quip.earlyBird.5": "\u4ECA\u5929\u4E5F\u4F1A\u662F\u597D\u7684\u4E00\u5929",
  "buddy.quip.weekend.0": "\u5468\u672B\u5FEB\u4E50\uFF5E",
  "buddy.quip.weekend.1": "\u4ECA\u5929\u53EF\u4EE5\u6162\u6162\u6765",
  "buddy.quip.weekend.2": "\u8BB0\u5F97\u7ED9\u81EA\u5DF1\u7559\u70B9\u653E\u7A7A\u65F6\u95F4",
  "buddy.quip.weekend.3": "\u5468\u672B\u4E0D\u7528\u592A\u8D76\uFF0C\u677E\u677E\u80A9",
  "buddy.quip.weekend.4": "\u4ECA\u5929\u5BA0\u7231\u4E00\u4E0B\u81EA\u5DF1",
  "buddy.quip.weekend.5": "\u6563\u6B65 / \u53D1\u5446 / \u770B\u4E91\u90FD\u503C\u5F97",
  "buddy.quip.wroteToday.0": "\u4ECA\u5929\u5199\u4E86\u4E00\u4E9B\uFF0C\u633A\u597D",
  "buddy.quip.wroteToday.1": "\u7EE7\u7EED\u8BB0\u5F55\uFF0C\u4E00\u70B9\u70B9\u5C31\u884C",
  "buddy.quip.wroteToday.2": "\u4F60\u7684\u65E5\u5B50\u88AB\u4F60\u8BA4\u771F\u5BF9\u5F85\u7740",
  "buddy.quip.wroteToday.3": "\u4E00\u5929\u4E00\u70B9\uFF0C\u5C31\u5F88\u597D",
  "buddy.quip.wroteToday.4": "\u8FD9\u4E9B\u5B57\uFF0C\u90FD\u662F\u4F60\u7684",
  "buddy.quip.wroteToday.5": "\u4ECA\u5929\u7684\u5370\u8BB0\uFF0C\u7559\u4E0B\u6765\u4E86",
  "buddy.quip.idle.0": "\u968F\u4FBF\u5199\u70B9\u4EC0\u4E48\u5427",
  "buddy.quip.idle.1": "\u4ECA\u5929\u53D1\u751F\u4E86\u4EC0\u4E48\u6709\u8DA3\u7684\uFF1F",
  "buddy.quip.idle.2": "\u8111\u5B50\u91CC\u90A3\u4E2A\u5FF5\u5934\uFF0C\u8BB0\u4E0B\u6765\u5440",
  "buddy.quip.idle.3": "\u7559\u4E00\u53E5\u7ED9\u672A\u6765\u7684\u81EA\u5DF1",
  "buddy.quip.idle.4": "\u4E0D\u60F3\u5199\u4E5F\u53EF\u4EE5\u6765\u770B\u770B\u6211",
  "buddy.quip.idle.5": "\u4ECA\u5929\u7684\u5929\u7A7A\u662F\u4EC0\u4E48\u6837\u7684\uFF1F",
  // v2.1.0-iter4: 情绪感知文案池 —— 根据用户今天笔记的主导情绪触发
  //   sad/angry/tired/fear 走温柔共情；happy/touched/inspired 走同频呼应
  //   v2.1.0-iter5: 每种情绪扩到 6 条候选
  "buddy.quip.mood.sad.0": "\u4ECA\u5929\u6709\u70B9\u7D2F\u5427\uFF0C\u6211\u5728\u7684",
  "buddy.quip.mood.sad.1": "\u96BE\u8FC7\u7684\u8BDD\uFF0C\u5C31\u5148\u653E\u4E00\u653E",
  "buddy.quip.mood.sad.2": "\u4F60\u5DF2\u7ECF\u505A\u5F97\u5F88\u597D\u4E86\uFF0C\u771F\u7684",
  "buddy.quip.mood.sad.3": "\u4E0D\u5F00\u5FC3\u4E5F\u53EF\u4EE5\uFF0C\u522B\u903C\u81EA\u5DF1",
  "buddy.quip.mood.sad.4": "\u8FD9\u4EFD\u96BE\u8FC7\uFF0C\u6211\u66FF\u4F60\u6536\u7740",
  "buddy.quip.mood.sad.5": "\u773C\u6CEA\u4E0D\u662F\u8F6F\u5F31\uFF0C\u662F\u5728\u6392\u6BD2",
  "buddy.quip.mood.angry.0": "\u5148\u6DF1\u547C\u5438\u4E00\u4E0B\uFF0C\u6CA1\u5173\u7CFB\u7684",
  "buddy.quip.mood.angry.1": "\u70E6\u5C31\u70E6\u4F1A\u513F\u5427\uFF0C\u522B\u618B\u7740",
  "buddy.quip.mood.angry.2": "\u5199\u4E0B\u6765\u5C31\u8F7B\u4E00\u70B9\u4E86",
  "buddy.quip.mood.angry.3": "\u5141\u8BB8\u81EA\u5DF1\u751F\u6C14\uFF0C\u771F\u7684",
  "buddy.quip.mood.angry.4": "\u8FD9\u4E8B\u513F\u8FC7\u53BB\u5C31\u8FC7\u53BB\u4E86",
  "buddy.quip.mood.angry.5": "\u6C14\u8FC7\u4E4B\u540E\uFF0C\u8981\u597D\u597D\u7167\u987E\u81EA\u5DF1",
  "buddy.quip.mood.tired.0": "\u7D2F\u4E86\u5C31\u6B47\u4F1A\u513F\uFF0C\u4E16\u754C\u4E0D\u6025",
  "buddy.quip.mood.tired.1": "\u4ECA\u5929\u8F9B\u82E6\u4E86\uFF0C\u6CE1\u676F\u70ED\u7684\u5427",
  "buddy.quip.mood.tired.2": "\u4F60\u5141\u8BB8\u81EA\u5DF1\u4E0D\u5B8C\u7F8E\u4E00\u4E0B",
  "buddy.quip.mood.tired.3": "\u5148\u8EBA\u5341\u5206\u949F\u5427\uFF0C\u771F\u7684",
  "buddy.quip.mood.tired.4": "\u7D2F\u662F\u8EAB\u4F53\u5728\u8BF4\uFF1A\u8BE5\u505C\u4E86",
  "buddy.quip.mood.tired.5": "\u4F60\u4E0D\u662F\u673A\u5668\uFF0C\u6162\u4E00\u70B9\u6CA1\u4E8B",
  "buddy.quip.mood.fear.0": "\u5BB3\u6015\u662F\u6B63\u5E38\u7684\uFF0C\u6211\u966A\u4F60",
  "buddy.quip.mood.fear.1": "\u4E00\u70B9\u70B9\u6765\uFF0C\u4E0D\u7528\u4E00\u4E0B\u5168\u505A\u5230",
  "buddy.quip.mood.fear.2": "\u6700\u574F\u4E5F\u5C31\u90A3\u6837\u4E86\uFF0C\u4F60\u633A\u5F97\u4F4F",
  "buddy.quip.mood.fear.3": "\u62C5\u5FC3\u7684\u4E8B 99% \u4E0D\u4F1A\u53D1\u751F",
  "buddy.quip.mood.fear.4": "\u7D27\u5F20\u8BF4\u660E\u4F60\u5728\u610F\uFF0C\u6CA1\u4EC0\u4E48\u4E0D\u597D",
  "buddy.quip.mood.fear.5": "\u6211\u5728\u5462\uFF0C\u6162\u6162\u6765",
  "buddy.quip.mood.happy.0": "\u4F60\u5F00\u5FC3\u6211\u4E5F\u5F00\u5FC3 \u2600\uFE0F",
  "buddy.quip.mood.happy.1": "\u8FD9\u4EFD\u597D\u5FC3\u60C5\uFF0C\u503C\u5F97\u8BB0\u4E0B\u6765",
  "buddy.quip.mood.happy.2": "\u4ECA\u5929\u7684\u4F60\u5728\u53D1\u5149",
  "buddy.quip.mood.happy.3": "\u7B11\u5BB9\u592A\u6CBB\u6108\u4E86",
  "buddy.quip.mood.happy.4": "\u5FEB\u4E50\u8981\u5927\u58F0\u4E00\u70B9 \u{1F389}",
  "buddy.quip.mood.happy.5": "\u8FD9\u79CD\u611F\u89C9\uFF0C\u591A\u7559\u4E00\u4F1A\u513F",
  "buddy.quip.mood.touched.0": "\u6E29\u67D4\u7684\u611F\u89C9\u771F\u597D",
  "buddy.quip.mood.touched.1": "\u8FD9\u4E9B\u5C0F\u7F8E\u597D\uFF0C\u90FD\u8BB0\u4F4F\u5B83",
  "buddy.quip.mood.touched.2": "\u5FC3\u52A8\u7684\u65F6\u523B\u6700\u73CD\u8D35",
  "buddy.quip.mood.touched.3": "\u88AB\u6E29\u67D4\u5BF9\u5F85\u7684\u77AC\u95F4\uFF0C\u73CD\u8D35",
  "buddy.quip.mood.touched.4": "\u8FD9\u4EFD\u5FC3\u610F\uFF0C\u8981\u8BB0\u4F4F\u54E6",
  "buddy.quip.mood.touched.5": "\u67D4\u8F6F\u7684\u4F60\uFF0C\u771F\u597D\u770B",
  "buddy.quip.mood.inspired.0": "\u90A3\u80A1\u52B2\u513F\uFF0C\u6211\u4E5F\u611F\u53D7\u5230\u4E86",
  "buddy.quip.mood.inspired.1": "\u53BB\u5427\uFF0C\u6211\u770B\u597D\u4F60",
  "buddy.quip.mood.inspired.2": "\u4ECA\u5929\u7684\u4F60\u5145\u6EE1\u529B\u91CF \u26A1",
  "buddy.quip.mood.inspired.3": "\u51B2\uFF01\u6211\u5728\u540E\u9762\u7ED9\u4F60\u52A0\u6CB9",
  "buddy.quip.mood.inspired.4": "\u8FD9\u4EFD\u52C7\u6C14\uFF0C\u503C\u5F97\u7EAA\u5FF5",
  "buddy.quip.mood.inspired.5": "\u76F8\u4FE1\u81EA\u5DF1\uFF0C\u4F60\u53EF\u4EE5\u7684"
};
var enUS = {
  // Sidebar / Views
  "sidebar.views": "Views",
  "sidebar.search": "Search",
  "sidebar.tags": "Tags",
  "sidebar.all": "All notes",
  "sidebar.pinned": "Pinned",
  "sidebar.archived": "Archive",
  "sidebar.trash": "Trash",
  "sidebar.tagsEmpty": "No tags yet",
  "sidebar.starred": "Starred",
  "sidebar.today": "Today",
  "sidebar.week": "This week",
  "sidebar.todo": "To-do",
  "sidebar.review": "On this day",
  "sidebar.noTag": "No tag",
  "sidebar.withImage": "With image",
  "sidebar.withLink": "With link",
  "sidebar.random": "Random draw",
  "sidebar.section.views": "Views",
  "sidebar.section.search": "Queries",
  "sidebar.section.years": "Years",
  "sidebar.section.tags": "All tags",
  // Input
  "input.placeholder": "What's on your mind?",
  "input.placeholderWithTag": "What's on your mind? (will auto-add #{tag})",
  "input.editPlaceholder": "Editing memo from {date} {time} (Esc to cancel)",
  "input.submit": "Send",
  "input.cancel": "Cancel",
  "input.editTimeTitle": "Change this memo's date & time",
  // Date labels (view-layer only; md files always keep the format at write time)
  "date.today": "Today",
  "date.yesterday": "Yesterday",
  "weekday.0": "Sun",
  "weekday.1": "Mon",
  "weekday.2": "Tue",
  "weekday.3": "Wed",
  "weekday.4": "Thu",
  "weekday.5": "Fri",
  "weekday.6": "Sat",
  // List stats
  "list.totalCount": "{n} memos",
  "list.dailyGoalProgress": "Goal {goal}, done {done}",
  "list.dailyGoalDone": "Goal {goal}, done {done}",
  "list.dailyGoalExceed": "Goal {goal}, done {done} (+{extra} over)",
  "list.pinnedHead": "Pinned  ({n})",
  "list.presetPinned": "\u{1F4CC} Pinned",
  "list.presetStarred": "\u2B50 Starred",
  "list.presetRandom": "Random draw",
  "list.presetOnThisDay": "On this day",
  "list.loadMore": "\u2193 Scroll for more ({n} remaining)",
  "list.heatmapMore": "{n} more\u2026",
  "list.noText": "(no text)",
  "list.imageHolder": "[image]",
  // Review filters
  "review.poolCount": "Pool {n}",
  "review.filter.year": "Year",
  "review.filter.allYears": "All years",
  "review.filter.tag": "Tag",
  "review.filter.allTags": "All tags",
  "review.filter.type": "Type",
  "review.filter.keyword": "Keyword",
  "review.filter.reset": "Reset",
  "review.keyword.placeholder": "Search review",
  "review.type.all": "All types",
  "review.type.starred": "Starred",
  "review.type.pinned": "Pinned",
  "review.type.withImage": "With image",
  "review.type.todo": "To-do",
  // Export HTML page
  "export.exportedAt": "Exported {date}",
  "export.footer": "Exported by Moments \xB7 BrainCore LifeOS",
  "export.dateFull": "{wd}, {m}/{d}/{y} {hh}:{mm}",
  "export.noticeDone": "\u2713 Exported {n} memos to {path}",
  "export.mdTitle": "Moments Export \xB7 {desc}",
  "export.mdSummary": "Exported {date}, {count}",
  // Stats report
  "stats.title": "Moments Stats",
  "stats.empty": "No memos yet, write your first one \u2728",
  "stats.label.memos": "memos",
  "stats.label.words": "words",
  "stats.label.activeDays": "active days",
  "stats.label.spanDays": "days total",
  "stats.section.yearHeatmap": "\u{1F525} Year activity",
  "stats.section.monthly": "\u{1F4C5} Monthly distribution",
  "stats.section.tagCloud": "\u2601\uFE0F Tag cloud",
  "stats.section.topTags": "\u{1F3F7}\uFE0F Top 10 tags",
  "stats.section.rhythm": "\u23F1 Writing rhythm",
  "stats.section.hourly": "When do you write most",
  "stats.section.weekday": "Your rhythm across the week",
  "stats.section.highlights": "\u{1F31F} Interesting findings",
  "stats.nav.prevYear": "Previous year",
  "stats.nav.nextYear": "Next year",
  "stats.legend.less": "less ",
  "stats.legend.more": " more",
  "stats.noTag": "No tags yet",
  "stats.hourly.subtitle": "Based on {n} memos",
  "stats.hourly.barTip": "{hh}:00 \u2014 {n} memos",
  "stats.hourly.peak": "\u{1F4DD} You write most at {hh}:00 ({n} memos, {pct}%)",
  "stats.hourly.kpi.peak": "Peak hour",
  "stats.hourly.kpi.count": "Peak memos",
  "stats.hourly.kpi.share": "Share of all memos",
  "stats.hourly.countValue": "{n} memos",
  "stats.hourly.axisCount": "{n}",
  "stats.hourly.axisTime": "Time of day",
  "stats.weekday.peak": "You write most on {day} ({n} memos, {pct}%)",
  "stats.weekday.mon": "Mon",
  "stats.weekday.tue": "Tue",
  "stats.weekday.wed": "Wed",
  "stats.weekday.thu": "Thu",
  "stats.weekday.fri": "Fri",
  "stats.weekday.sat": "Sat",
  "stats.weekday.sun": "Sun",
  "stats.subtitle.monthly": "{year} \xB7 Monthly distribution",
  "stats.monthlyYearSum": "{year} \xB7 {n} memos",
  "stats.monthShort": "{m}",
  "stats.monthlyBarTip": "Month {m} \xB7 {n} memos",
  "stats.highlightsENOnly": "Insights text is only available in Chinese for now \u2014 switch to \u7B80\u4F53\u4E2D\u6587 to see the full pool of playful findings.",
  // Year panorama
  "year.title": "Year panorama",
  "year.viewTitle": "Moments \xB7 Year panorama",
  "year.subtitle": "{year} \xB7 Review a year of your thoughts",
  "year.empty": "No memos in {year}",
  "year.thisYear": "This year",
  "year.yearSum": "{year} \xB7 {n} memos total",
  "year.activeDays": "{n} active days",
  "year.weekdayShort.0": "S",
  "year.weekdayShort.1": "M",
  "year.weekdayShort.2": "T",
  "year.weekdayShort.3": "W",
  "year.weekdayShort.4": "T",
  "year.weekdayShort.5": "F",
  "year.weekdayShort.6": "S",
  // Notice
  "notice.saved": "\u2713 Saved",
  "notice.updated": "\u2713 Updated",
  "notice.updatedWithTime": "\u2713 Updated (with time)",
  "notice.deleted": "Deleted",
  "notice.imageFailed": "Image save failed: {msg}",
  "notice.saveFailed": "Save failed: {msg}",
  "notice.invalidTime": "Invalid datetime, please re-select",
  "notice.emptyContent": "Nothing to publish yet \u2014 type something first",
  "notice.exportEmpty": "No memos to export in current filter",
  "notice.exportFailed": "Export failed: {msg}",
  "notice.exportDone": "\u2713 Exported {n} memos to {path}",
  "notice.dailyGoalDone": "\u{1F389} Daily goal reached! {n} memos today ~",
  "notice.checkFailed": "Check failed: {msg}",
  "notice.copied": "Copied",
  "notice.quoted": "Quoted, feel free to continue",
  "notice.pinned": "\u2713 Pinned",
  "notice.unpinned": "Unpinned",
  "notice.starred": "\u2713 Starred",
  "notice.unstarred": "Unstarred",
  "notice.confirmDelete": "Delete this memo?",
  "notice.confirmDeleteOk": "Confirm delete",
  "notice.confirmContinue": "Continue",
  "card.pinnedMark": "Pinned",
  "card.starredMark": "Starred",
  "notice.deletedTrash": "Deleted \xB7 restorable in _trash.md",
  // v2.0.7
  "notice.normalizing": "Normalizing\u2026",
  "notice.normalized": "\u2713 Normalized {n} memos",
  "notice.normalizeFailed": "Normalize failed: {msg}",
  "notice.protocolCaptureSaved": "\u2713 Saved from Shortcuts",
  "notice.protocolCaptureFailed": "Shortcut capture failed: {msg}",
  "notice.normalizeConfirm": "This will rewrite the md format of all Moments notes to fix render issues.\nPlease back up your Moments folder first.\n\nContinue?",
  "error.fileChanged": "File has changed, origin location not found. Please close the editor, refresh and retry.",
  "error.originNotFound": "Origin note file not found",
  "error.emptyContent": "Content cannot be empty",
  "error.unknown": "Unknown error",
  "command.openMemoria": "Open Moments panel",
  "command.openStats": "Open stats",
  "command.openYear": "Open year panorama",
  "command.quickCapture": "Quick capture (popup)",
  "command.normalizeAll": "Normalize all memos (fix md rendering)",
  "ribbon.openMemoria": "Open Moments",
  "quickCapture.title": "\u{1F4AD} What's on your mind?",
  "quickCapture.placeholder": "Ctrl+Enter to send \xB7 Esc to close",
  "quickCapture.cancel": "Cancel",
  "quickCapture.send": "Send",
  "settings.shortcut.heading": "iOS Shortcuts",
  "settings.shortcut.name": "Copy quick-capture URI",
  "settings.shortcut.desc": "Copy a URI template for this vault and use it in the iOS Shortcuts \u201COpen URLs\u201D action. Append the URL-encoded input text to the template.",
  "settings.shortcut.copy": "Copy URI template",
  "settings.shortcut.copied": "\u2713 URI template copied",
  "settings.shortcut.copyFailed": "Copy failed. Please try again.",
  // Search
  "search.placeholder": "Search memos",
  "search.noResult": "No matching memos",
  // Empty states
  "empty.default": "No memos yet",
  "empty.defaultSub": "Write your first thought in the top input box \uFF5E",
  "empty.onThisDay": "Nothing from past years on this day",
  "empty.onThisDaySub": "How about 5 random old memos?",
  "empty.onThisDayBtn": "Random draw",
  "empty.onThisDayMeta": "Reshuffle",
  "empty.onThisDayBackToReview": " Back to on-this-day",
  "meta.reroll": " Shuffle",
  "meta.backToOnThisDay": " Back to on-this-day",
  "empty.todo": "No open to-dos",
  "empty.todoSub": "All `- [ ]` checked off, or you haven't written any yet. Put `- [ ] something` in a memo to see it here.",
  // Density
  "density.toggle": "Toggle view density",
  "density.cozy": "Cozy",
  "density.compact": "Compact",
  // Card menu
  "card.pin": "Pin",
  "card.unpin": "Unpin",
  "card.star": "Star",
  "card.unstar": "Unstar",
  "card.edit": "Edit",
  "card.delete": "Delete",
  "card.archive": "Archive",
  "card.unarchive": "Unarchive",
  "card.share": "Share",
  "card.restore": "Restore",
  "card.purge": "Delete permanently",
  "card.quote": "Quote",
  "card.copyLink": "Copy link",
  "card.copySource": "Copy source",
  "card.exportImage": "Save as image",
  "card.openSource": "Open source file",
  "card.exportMd": "Export as Markdown",
  "card.exportHtml": "Export as HTML",
  "card.exportJson": "Export as JSON",
  "card.exportTooltip": "Export current filter results",
  "notice.archived": "Archived",
  "notice.unarchived": "Unarchived",
  "notice.softDeleted": "Moved to trash",
  "notice.restored": "Restored",
  "notice.purged": "Permanently deleted",
  "notice.confirmPurge": "Permanently delete? This cannot be undone.",
  "sort.createdDesc": "Created time, newest first",
  "sort.createdAsc": "Created time, oldest first",
  "sort.updatedDesc": "Updated time, newest first",
  "sort.updatedAsc": "Updated time, oldest first",
  "share.copyImage": "Copy image",
  "share.previewImage": "Preview image",
  "share.previewHint": "Click to preview. Use the button below to copy.",
  "share.searchPlaceholder": "Search Moments",
  "share.loadMore": "Load {n} more",
  "share.saveImage": "Save image",
  "share.imageCopied": "Share image copied.",
  "share.copyFailed": "Copy failed.",
  "share.copyFailedTitle": "Couldn't copy image",
  "share.copyFailedChoice": "The clipboard rejected the image. Retry copying, or explicitly choose to save it.",
  "share.retryCopy": "Retry copy",
  "share.saveInstead": "Save image",
  "share.cancel": "Cancel",
  "share.cancelGeneration": "Cancel generation",
  "share.generationCancelled": "Generation cancelled.",
  "share.progressLayout": "Laying out",
  "share.progressCopy": "Preparing copy",
  "share.progressPrepare": "Preparing image",
  "share.progressPreview": "Preparing preview",
  "share.progressSave": "Preparing download",
  "share.imageSaved": "Share image saved.",
  "share.saveFailed": "Save failed.",
  "share.titlePlaceholder": "Title (optional; falls back to watermark subtitle)",
  "share.multiAction": "Share multiple",
  "share.multiTitle": "Select Moments to share",
  "share.selectAll": "Select all",
  "share.clearSelection": "Clear",
  "share.selectedCount": "{n} selected",
  "share.budgetStatus": "Estimated height {height}/{maxHeight} \xB7 {max} items max",
  "share.budgetExceeded": "The multi-share item or height limit has been reached. Remove an item to continue.",
  "share.createCombined": "Create share image",
  // Stats
  "stats.memos": "memos",
  "stats.tags": "tags",
  "stats.days": "days",
  "stats.dailyGoal": "Daily goal",
  // Toolbar
  "toolbar.yearPanorama": "Year panorama",
  "toolbar.statsReport": "Stats report",
  "toolbar.export": "Export",
  "toolbar.saveMd": "Save to vault \xB7 Markdown",
  "toolbar.saveHtml": "Save to vault \xB7 HTML",
  "toolbar.saveJson": "Save to vault \xB7 JSON",
  "toolbar.toggleSidebar": "Toggle sidebar",
  "toolbar.toCalendar": "Switch to calendar",
  "toolbar.toHeatmap": "Switch to heatmap",
  "toolbar.insertTag": "Insert tag #",
  "toolbar.insertImage": "Insert image",
  "toolbar.insertUL": "Insert bullet list",
  "toolbar.insertOL": "Insert numbered list",
  "toolbar.insertTask": "Insert task list",
  "toolbar.insertTable": "Insert table",
  "toolbar.quote": "Quote",
  "toolbar.more": "More actions",
  // Settings page
  "settings.title": "Moments Settings",
  "settings.folder.name": "Memo folder",
  "settings.folder.desc": "Moments reads/writes YYYY.md files under this folder (relative to vault root)",
  "settings.attachFolder.name": "Image attachment folder",
  "settings.attachFolder.desc": "Pasted/dragged/picked images are saved here (relative to vault root)",
  "settings.sidebarTags.name": "Show tag tree in sidebar",
  "settings.sidebarTags.desc": `Default off. Obsidian's right sidebar already has a tag panel, so this is usually redundant. Without it you can still click tag pills on cards to filter, or type "#tag" in the search bar.`,
  "settings.sidebarYears.name": "Show year list in sidebar",
  "settings.sidebarYears.desc": "Default on. When your memos span many years (e.g. 8+), the year list gets long; turn this off to hide it and reduce visual clutter on the right.",
  "settings.clearAfterSave.name": "Clear input after send",
  "settings.pageSize.name": "Page size",
  "settings.pageSize.desc": "How many memos to render per batch; scroll to bottom auto-loads more",
  "settings.useTrash.name": "Keep deleted in trash",
  "settings.useTrash.desc": "When on, deleted memos are appended to <memo-folder>/_trash.md instead of disappearing. Off = permanent delete.",
  "settings.trashMax.name": "Trash max items",
  "settings.trashMax.desc": "Maximum memos kept in _trash.md; oldest are discarded when exceeded. Prevents the trash file growing too large over time.",
  "settings.trash.100": "100 items",
  "settings.trash.300": "300 items (recommended)",
  "settings.trash.500": "500 items",
  "settings.trash.1000": "1000 items",
  "settings.trash.3000": "3000 items",
  "settings.trash.0": "Unlimited (not recommended)",
  "settings.exportTheme.name": "Card image \xB7 background theme",
  "settings.exportTheme.desc": "Background style when saving a card as image. 8 presets + follow Obsidian light/dark + random.",
  "settings.exportTheme.auto": "\u{1F3AD} Follow Obsidian",
  "settings.exportTheme.random": "\u{1F3B2} Random each time",
  "settings.exportTheme.paper": "\u{1F4C4} Paper white",
  "settings.exportTheme.kraft": "\u{1F7EB} Kraft",
  "settings.exportTheme.mint": "\u{1F33F} Mint",
  "settings.exportTheme.peach": "\u{1F351} Peach",
  "settings.exportTheme.sky": "\u2601\uFE0F Sky blue",
  "settings.exportTheme.lavender": "\u{1F49C} Lavender",
  "settings.exportTheme.midnight": "\u{1F319} Midnight",
  "settings.exportTheme.charcoal": "\u26AB Charcoal",
  "settings.collapse.name": "Auto-collapse long memos",
  "settings.collapse.desc": 'Memos exceeding the line limit are auto-collapsed with a "Continue reading" button. Images are always fully shown; only text is folded.',
  "settings.collapse.0": "Never collapse",
  "settings.collapse.4": "4 lines",
  "settings.collapse.6": "6 lines",
  "settings.collapse.8": "8 lines (recommended)",
  "settings.collapse.12": "12 lines",
  "settings.collapse.20": "20 lines",
  "settings.dailyGoal.name": "Daily goal",
  "settings.dailyGoal.desc": "Full value for the progress bar under the heatmap. Simple records are easier to sustain; 3-7 is recommended.",
  "settings.heading.newFeatures": "Feature toggles",
  "settings.density.name": "View density",
  "settings.density.desc": "Compact shows only first few lines per card; cozy is the default",
  "settings.density.cozy": "Cozy",
  "settings.density.compact": "Compact",
  "settings.contentWidth.name": "Content width",
  "settings.contentWidth.desc": "Set the maximum width of the desktop capture area and memo feed. Mobile remains fluid.",
  "settings.contentWidth.focused": "Focused",
  "settings.contentWidth.balanced": "Balanced (recommended)",
  "settings.contentWidth.wide": "Wide",
  "settings.vim.name": "Enable Vim keys",
  "settings.vim.desc": "j/k to navigate, Enter to edit, / to search, i to write, gg/G for first/last, Esc to clear",
  "settings.mood.name": "Enable mood coloring",
  "settings.mood.desc": "Show a left color band and a light wash on cards based on keywords. 7 moods: happy (gold), touched (pink), inspired (orange), sad (blue-gray), angry (red), fear (purple), tired (brown). Keyword-based, expect some miss-matches.",
  "settings.smartReview.name": "Enable smart review",
  "settings.smartReview.desc": '"Random 5" will use weighted picking: older memos get priority, tag/mood echoes with today get boost',
  "settings.language.name": "Language",
  "settings.language.desc": "Auto follows Obsidian's locale; manual switch takes effect after reopening Moments view",
  "settings.language.auto": "Auto (follow Obsidian)",
  "settings.language.zh": "\u7B80\u4F53\u4E2D\u6587",
  "settings.language.en": "English",
  "settings.sendHotkey.name": "Send shortcut",
  "settings.sendHotkey.desc": `Default is Ctrl/Cmd+Enter. If it doesn't work, Obsidian likely has Ctrl+Enter bound to the built-in command "Open link under cursor in new tab" (note: Obsidian's hotkey search-by-key can miss it \u2014 scroll through the Hotkeys list to find it manually, then click the \xD7 on the right to unbind). Once unbound it works normally, or just switch to Enter below.`,
  "settings.sendHotkey.enter": "Enter to send (Shift+Enter for newline)",
  "settings.sendHotkey.ctrlEnter": "Ctrl/Cmd+Enter to send (Enter for newline) \u2B50 Default",
  "settings.mobileInputStyle.name": "Mobile input entry style",
  "settings.mobileInputStyle.desc": "Phone / tablet only. In FAB mode the input is hidden by default and a floating \u2795 button sits at the bottom-right; tap it to expand.",
  "settings.mobileInputStyle.fab": "Floating \u2795 button (tap to expand) \u2B50 Default",
  "settings.mobileInputStyle.alwaysVisible": "Always visible at bottom",
  "fab.aria": "New memo",
  "fab.close": "Collapse input",
  "settings.heading.about": "About",
  "settings.about.p1": "Moments \u2014 a floating-memo plugin. All memos are stored as plain Markdown (",
  "settings.about.p2": "), so your notes stay fully readable even if you disable the plugin.",
  "settings.repo.name": "GitHub repository",
  "settings.repo.desc": "Source code, issues and feature requests \u2014 all here",
  "settings.repo.btn": "Open repo",
  "settings.version": "Current version: v{ver}",
  // Common
  "common.confirm": "OK",
  "common.cancel": "Cancel",
  "common.close": "Close",
  "common.refresh": "Refresh",
  "common.loading": "Loading\u2026",
  // v2.0.19: English counterparts of the newly i18n'd strings
  // Collapse button
  "card.collapseFull": "Read more",
  "card.collapseFold": "Collapse",
  // Sidebar calendar
  "calendar.weekday.0": "S",
  "calendar.weekday.1": "M",
  "calendar.weekday.2": "T",
  "calendar.weekday.3": "W",
  "calendar.weekday.4": "T",
  "calendar.weekday.5": "F",
  "calendar.weekday.6": "S",
  "calendar.prevMonth": "Previous month",
  "calendar.nextMonth": "Next month",
  "calendar.monthTitle": "{m}/{year}",
  "calendar.dayCount": "{date}  {n} memos",
  // Image lightbox
  "lightbox.close": "Close",
  "lightbox.prev": "Previous",
  "lightbox.next": "Next",
  // Stats heatmap / monthly bar hover + year button
  "stats.yearBtn": "{year}",
  "stats.heatmap.future": "{date}  future",
  "stats.heatmap.dayCount": "{date}  {n} memos",
  "stats.monthlyBarRange": "{key}: {n} memos",
  // Year panorama day hover
  "year.dayHover": "{date}  {n} memos",
  // describeCurrentFilter
  "export.desc.all": "All memos",
  "export.desc.year": "{year}",
  // v2.0.20: Sidebar default overview setting
  "settings.defaultOverview.name": "Sidebar default view",
  "settings.defaultOverview.desc": "Which overview to show on top of the sidebar when Moments opens. You can still click the toggle button to temporarily switch (temporary switch won't change this default).",
  "settings.defaultOverview.heatmap": "\u{1F525} Heatmap (default)",
  "settings.defaultOverview.calendar": "\u{1F4C5} Calendar",
  "settings.defaultOverview.buddy": "\u{1F43E} Buddy",
  "settings.openOnStartup.name": "Open Moments on startup",
  "settings.openOnStartup.desc": "Open or reveal Moments after Obsidian restores the workspace. Existing tabs remain open.",
  // v2.1.0: Buddy companion system
  "toolbar.toBuddy": "Switch to buddy",
  "buddy.rarity.common": "Common",
  "buddy.rarity.uncommon": "Uncommon",
  "buddy.rarity.rare": "Rare",
  "buddy.rarity.epic": "Epic",
  "buddy.rarity.legendary": "Legendary",
  // v2.1.0-iter13: Growth stages
  "buddy.stage.baby": "Baby",
  "buddy.stage.teen": "Teen",
  "buddy.stage.adult": "Adult",
  "buddy.stat.debugging": "Debugging",
  "buddy.stat.patience": "Patience",
  "buddy.stat.chaos": "Chaos",
  "buddy.stat.wisdom": "Wisdom",
  "buddy.stat.snark": "Snark",
  // Stat tooltips (hover-explained algorithm + how to level up)
  "buddy.stat.tip.debugging": "Memos using lists / tasks / quotes / links / headings (use more markdown structures to raise)",
  "buddy.stat.tip.patience": "Average memo length (write a long reflection occasionally to raise)",
  "buddy.stat.tip.chaos": "Recent 7-day memo frequency vs historical average (raise by deviating, lower by being steady)",
  "buddy.stat.tip.wisdom": "% of memos with #tags or [[backlinks]]",
  "buddy.stat.tip.snark": "Emotional expressiveness (% of memos with emoji or mood keywords)",
  // Species names
  "buddy.species.cactus": "Cactus",
  "buddy.species.capybara": "Capybara",
  "buddy.species.chonk": "Chonk",
  "buddy.species.snail": "Snail",
  "buddy.species.cat": "Cat",
  "buddy.species.blob": "Blob",
  "buddy.species.duck": "Duck",
  "buddy.species.turtle": "Turtle",
  "buddy.species.rabbit": "Rabbit",
  "buddy.species.goose": "Goose",
  "buddy.species.mushroom": "Mushroom",
  "buddy.species.penguin": "Penguin",
  "buddy.species.axolotl": "Axolotl",
  "buddy.species.robot": "Robot",
  "buddy.species.octopus": "Octopus",
  "buddy.species.owl": "Owl",
  "buddy.species.dragon": "Dragon",
  "buddy.species.ghost": "Ghost",
  // Mottos
  "buddy.motto.cactus": "Slow and steady",
  "buddy.motto.capybara": "Be calm, be okay",
  "buddy.motto.chonk": "Round and content",
  "buddy.motto.snail": "I have my own pace",
  "buddy.motto.cat": "Stay curious",
  "buddy.motto.blob": "Going with the flow",
  "buddy.motto.duck": "If it walks like a duck...",
  "buddy.motto.turtle": "Slow wins it",
  "buddy.motto.rabbit": "Hop hop hop",
  "buddy.motto.goose": "Loud is my language",
  "buddy.motto.mushroom": "Growing in the shadows",
  "buddy.motto.penguin": "Tuxedo by birth",
  "buddy.motto.axolotl": "Forever young",
  "buddy.motto.robot": "BEEP BOOP",
  "buddy.motto.octopus": "Eight arms, eight ideas",
  "buddy.motto.owl": "The night belongs to me",
  "buddy.motto.dragon": "Legends never fade",
  "buddy.motto.ghost": "Anything is possible.",
  // Companion info
  "buddy.daysCompanion": "{n} days together",
  "buddy.daysCompanion.first": "Day 1 together",
  // Egg (first hatching)
  "buddy.egg.title": "An egg waiting to hatch",
  "buddy.egg.desc": "Give it a name \u2728",
  "buddy.egg.placeholder": "e.g. Aix / Pebble / Mochi...",
  "buddy.egg.hatchBtn": "Hatch",
  // v2.1.0-iter10: Rename only (appearance is fate, by design)
  "buddy.rename.tip": "Double-click to rename",
  "buddy.rename.title": "Rename your buddy",
  "buddy.rename.placeholder": "New name",
  "buddy.rename.save": "Save",
  "buddy.rename.cancel": "Cancel",
  // Quip pool (each scenario has 6 candidates, randomly picked on each render)
  "buddy.quip.goalDone.0": "You crushed it today \u2B50",
  "buddy.quip.goalDone.1": "Goal hit. Time for a break~",
  "buddy.quip.goalDone.2": "I love how you keep showing up",
  "buddy.quip.goalDone.3": "Said and done. You're reliable.",
  "buddy.quip.goalDone.4": "You treated yourself well today",
  "buddy.quip.goalDone.5": "This day was well-lived",
  "buddy.quip.lateNight.0": "It's late. Get some sleep soon",
  "buddy.quip.lateNight.1": "The most honest words come at 2am",
  "buddy.quip.lateNight.2": "I'm here, but please rest soon",
  "buddy.quip.lateNight.3": "Don't stay up too late. Body's protesting.",
  "buddy.quip.lateNight.4": "Even the moon is watching you write",
  "buddy.quip.lateNight.5": "Late-night thoughts, revisit by day",
  "buddy.quip.longGone.0": "Long time no see. How's life?",
  "buddy.quip.longGone.1": "I missed you a little",
  "buddy.quip.longGone.2": "Still here whenever you're back",
  "buddy.quip.longGone.3": "Welcome back, have a seat",
  "buddy.quip.longGone.4": "Anything on your mind recently?",
  "buddy.quip.longGone.5": "Silence is also a kind of record",
  "buddy.quip.missYou.0": "Wanna talk today?",
  "buddy.quip.missYou.1": "Even one line is fine",
  "buddy.quip.missYou.2": "What's on your mind?",
  "buddy.quip.missYou.3": "How have the past few days been?",
  "buddy.quip.missYou.4": "I'm right here, waiting",
  "buddy.quip.missYou.5": "Even one word would do",
  "buddy.quip.earlyBird.0": "Early riser, you're winning",
  "buddy.quip.earlyBird.1": "Morning. Let's go gently",
  "buddy.quip.earlyBird.2": "The dawn ideas are gold",
  "buddy.quip.earlyBird.3": "A new day unfolds slowly",
  "buddy.quip.earlyBird.4": "Morning. Have some water first",
  "buddy.quip.earlyBird.5": "Today will be a good day, too",
  "buddy.quip.weekend.0": "Happy weekend ~",
  "buddy.quip.weekend.1": "No rush today",
  "buddy.quip.weekend.2": "Save some time to do nothing",
  "buddy.quip.weekend.3": "Relax your shoulders this weekend",
  "buddy.quip.weekend.4": "Be gentle with yourself today",
  "buddy.quip.weekend.5": "Walks / daydreams / watching clouds all count",
  "buddy.quip.wroteToday.0": "You wrote some today. Nice.",
  "buddy.quip.wroteToday.1": "Keep going, bit by bit",
  "buddy.quip.wroteToday.2": "Your days are being lived deliberately",
  "buddy.quip.wroteToday.3": "A little each day, that's enough",
  "buddy.quip.wroteToday.4": "These words \u2014 all yours",
  "buddy.quip.wroteToday.5": "Today's traces are kept",
  "buddy.quip.idle.0": "Write whatever's there",
  "buddy.quip.idle.1": "Anything fun happen today?",
  "buddy.quip.idle.2": "That little thought \u2014 write it down",
  "buddy.quip.idle.3": "Leave a line for future-you",
  "buddy.quip.idle.4": "Don't want to write? Just visit me",
  "buddy.quip.idle.5": "What does the sky look like today?",
  // v2.1.0-iter4: Mood-aware quip pool (6 candidates each)
  "buddy.quip.mood.sad.0": "Rough day, huh. I'm here.",
  "buddy.quip.mood.sad.1": "It's okay to set it down for now",
  "buddy.quip.mood.sad.2": "You've done enough, really",
  "buddy.quip.mood.sad.3": "It's okay to not be okay",
  "buddy.quip.mood.sad.4": "This sadness \u2014 I'll hold it with you",
  "buddy.quip.mood.sad.5": "Tears aren't weakness, they're release",
  "buddy.quip.mood.angry.0": "Breathe. It's okay.",
  "buddy.quip.mood.angry.1": "Let yourself feel it. Don't bottle it",
  "buddy.quip.mood.angry.2": "Writing it out helps, a bit",
  "buddy.quip.mood.angry.3": "You're allowed to be angry",
  "buddy.quip.mood.angry.4": "This too shall pass",
  "buddy.quip.mood.angry.5": "After the storm, take care of yourself",
  "buddy.quip.mood.tired.0": "Rest if you need to. The world can wait.",
  "buddy.quip.mood.tired.1": "Long day. Maybe something warm?",
  "buddy.quip.mood.tired.2": "You're allowed to be imperfect today",
  "buddy.quip.mood.tired.3": "Lie down for ten. Really.",
  "buddy.quip.mood.tired.4": "Fatigue is your body saying: stop",
  "buddy.quip.mood.tired.5": "You're not a machine. Slow is fine.",
  "buddy.quip.mood.fear.0": "Being scared is okay. I'm with you.",
  "buddy.quip.mood.fear.1": "One step at a time, not all at once",
  "buddy.quip.mood.fear.2": "Worst case isn't that bad. You got this.",
  "buddy.quip.mood.fear.3": "99% of worries never happen",
  "buddy.quip.mood.fear.4": "Nervous means you care. That's okay.",
  "buddy.quip.mood.fear.5": "I'm right here. Take your time.",
  "buddy.quip.mood.happy.0": "Your joy makes me happy too \u2600\uFE0F",
  "buddy.quip.mood.happy.1": "This mood \u2014 worth remembering",
  "buddy.quip.mood.happy.2": "You're glowing today",
  "buddy.quip.mood.happy.3": "Your smile is healing",
  "buddy.quip.mood.happy.4": "Celebrate a little louder \u{1F389}",
  "buddy.quip.mood.happy.5": "Stay in this feeling a bit longer",
  "buddy.quip.mood.touched.0": "Tender moments. Nice.",
  "buddy.quip.mood.touched.1": "Keep these little warm things",
  "buddy.quip.mood.touched.2": "Moments that move you matter",
  "buddy.quip.mood.touched.3": "Being treated gently \u2014 precious",
  "buddy.quip.mood.touched.4": "This kindness, remember it",
  "buddy.quip.mood.touched.5": "The tender version of you \u2014 lovely",
  "buddy.quip.mood.inspired.0": "I feel that energy too",
  "buddy.quip.mood.inspired.1": "Go get it. I'm cheering.",
  "buddy.quip.mood.inspired.2": "You're full of power today \u26A1",
  "buddy.quip.mood.inspired.3": "Go! I've got your back",
  "buddy.quip.mood.inspired.4": "This courage \u2014 worth remembering",
  "buddy.quip.mood.inspired.5": "Believe in yourself. You can."
};
var currentDict = zhCN;
var currentLocale = "zh-CN";
function initLocale(setting) {
  currentLocale = setting;
  const resolved = resolveLocale(setting);
  currentDict = resolved === "en-US" ? enUS : zhCN;
}
function resolveLocale(setting) {
  if (setting === "zh-CN") return "zh-CN";
  if (setting === "en-US") return "en-US";
  try {
    const w = window;
    const ml = w.moment?.locale?.().toLowerCase() ?? "";
    if (ml.startsWith("zh")) return "zh-CN";
    if (ml.startsWith("en")) return "en-US";
  } catch {
  }
  try {
    const lang = activeDocument.documentElement.lang.toLowerCase();
    if (lang.startsWith("zh")) return "zh-CN";
    if (lang.startsWith("en")) return "en-US";
  } catch {
  }
  return "zh-CN";
}
function t(key, params) {
  let text = currentDict[key];
  if (text === void 0) {
    text = zhCN[key];
    if (text === void 0) {
      return key;
    }
  }
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      const replacement = String(v);
      text = text.replace(new RegExp(`\\{${k}\\}`, "g"), () => replacement);
    }
  }
  return text;
}
function getCurrentLocale() {
  return resolveLocale(currentLocale);
}

// src/moments-memoria/store.ts
function stampUpdatedAt(memos, mtime) {
  for (const m of memos) m.updatedAt = mtime;
  return memos;
}
var MemoStore = class {
  constructor(app, settings) {
    __publicField(this, "app", app);
    __publicField(this, "settings", settings);
    __publicField(this, "memos", []);
    __publicField(this, "listeners", []);
    __publicField(this, "loading", false);
    __publicField(this, "reloadAllPending", false);
    /** v1.1.15 初版：每个文件一条 Promise 链（prev.then 套 prev.then...）保证串行。
     *  v1.4.11 改版：改为 running/pending flag，避免长期频繁写入时 Promise 链无限累积
     *    造成内存泄漏 + 每次新 reloadFile 要等前面全部 N 次做完。
     *    新策略：同一文件正在跑就标记 pending=true，当前这次跑完再跑一次（合并掉中间所有），
     *    任何时刻同一文件最多有 2 次待办（正在跑 + 最多 1 次待跑）。 */
    __publicField(this, "reloadLocks", /* @__PURE__ */ new Map());
  }
  /** 订阅数据变更 */
  onChange(cb) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((x) => x !== cb);
    };
  }
  emit() {
    for (const l of this.listeners) l();
  }
  /** v1.4.11: 仅触发监听器重渲染，不改动 memos 数据。
   *   用于设置项变更后刷 UI（替代原来误调的 reloadAll）。 */
  notifyChange() {
    this.emit();
  }
  getAll() {
    return this.memos;
  }
  /** 扫描 folder 下的所有 md 文件，重建 memo 列表
   *  v1.4.11: 改为并行读取（之前 for await 串行，5 个年份文件要等 200-400ms）
   *    并行后大致压到 50-80ms。parseFile 是纯 CPU，不用担心顺序问题。 */
  async reloadAll() {
    if (this.loading) {
      this.reloadAllPending = true;
      return;
    }
    this.loading = true;
    try {
      do {
        this.reloadAllPending = false;
        const files = this.collectFiles();
        const parsed = await Promise.all(
          files.map(async (f) => {
            const raw = await this.app.vault.read(f);
            return stampUpdatedAt(parseFile(f.path, raw), f.stat.mtime);
          })
        );
        const result = [];
        for (const arr of parsed) result.push(...arr);
        this.sortMemos(result);
        this.memos = result;
        this.emit();
      } while (this.reloadAllPending);
    } finally {
      this.loading = false;
    }
  }
  /** 文件内容变化时重载单个文件
   *  v1.4.11: running/pending flag 策略（见类顶部注释），取代原来的 Promise 链。
   *    同一文件任意时刻最多执行 2 次：正在跑 + 最多 1 次 pending。
   *    好处：
   *      1. 不会无限累积 Promise 引用（内存泄漏）
   *      2. addMemo 主动 reload + vault.modify 事件 reload 两次会被合并为 1 次
   *      3. 用户连发多条时尾部 reload 不需要排队等前面所有做完 */
  async reloadFile(file) {
    if (!this.isInFolder(file)) return;
    const key = file.path;
    const existing = this.reloadLocks.get(key);
    if (existing && existing.running) {
      existing.pending = true;
      return;
    }
    const state = { running: true, pending: false };
    this.reloadLocks.set(key, state);
    try {
      do {
        state.pending = false;
        const current = this.app.vault.getAbstractFileByPath(key);
        if (!(current instanceof import_obsidian.TFile)) break;
        const raw = await this.app.vault.read(current);
        const fresh = stampUpdatedAt(parseFile(current.path, raw), current.stat.mtime);
        this.memos = this.memos.filter((m) => m.file !== current.path);
        this.memos.push(...fresh);
        this.sortMemos(this.memos);
        this.emit();
      } while (state.pending);
    } finally {
      this.reloadLocks.delete(key);
    }
  }
  /** 指定文件从 memo 列表中移除 */
  removeFile(path) {
    const before = this.memos.length;
    this.memos = this.memos.filter((m) => m.file !== path);
    if (this.memos.length !== before) this.emit();
  }
  /**
   * 排序：
   *   1) 置顶的永远在最前
   *   2) 其他按 datetime 降序
   *   3) 同分钟按文件行号倒序（更晚追加的在前）
   */
  sortMemos(arr) {
    arr.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      const dt = b.datetime.getTime() - a.datetime.getTime();
      if (dt !== 0) return dt;
      if (a.file !== b.file) return a.file < b.file ? 1 : -1;
      return b.range[0] - a.range[0];
    });
  }
  collectFiles() {
    const folder = (0, import_obsidian.normalizePath)(this.settings.folder);
    return this.app.vault.getMarkdownFiles().filter((f) => {
      if (f.name.startsWith("_")) return false;
      return f.path.startsWith(`${folder}/`);
    });
  }
  isInFolder(file) {
    const folder = (0, import_obsidian.normalizePath)(this.settings.folder);
    if (file.name.startsWith("_")) return false;
    return file.path.startsWith(`${folder}/`);
  }
  /**
   * 始终基于磁盘最新内容重新定位记录，避免外部编辑让旧 range 指向相邻记录。
   * 同一分钟、同内容的重复记录按原起始行距离择近，保证操作稳定可预测。
   */
  locateMemoRange(raw, memo) {
    const candidates = parseFile(memo.file, raw).filter(
      (item) => item.date === memo.date && item.time === memo.time && item.content === memo.content
    );
    if (candidates.length === 0) {
      throw new Error(t("error.fileChanged"));
    }
    const originalStart = memo.range[0];
    candidates.sort((a, b) => {
      const distance = Math.abs(a.range[0] - originalStart) - Math.abs(b.range[0] - originalStart);
      return distance || a.range[0] - b.range[0];
    });
    return candidates[0].range;
  }
  /** 创建一条新 memo */
  async addMemo(content, when = /* @__PURE__ */ new Date()) {
    content = content.trim();
    if (!content) return;
    const year = when.getFullYear().toString();
    const dateStr = fmtDate(when);
    const timeStr = fmtTime(when);
    const weekday = fmtWeekday(when);
    const folder = (0, import_obsidian.normalizePath)(this.settings.folder);
    await this.ensureFolder(folder);
    const filePath = `${folder}/${year}.md`;
    const file = this.app.vault.getAbstractFileByPath(filePath);
    if (!file) {
      const initial = `${this.periodHeadings(new Date(when), [])}

### ${dateStr} ${weekday}

${renderMemo(
        timeStr,
        content
      )}

`;
      await this.app.vault.create(filePath, initial);
    } else {
      const raw = await this.app.vault.read(file);
      const next = this.insertMemoIntoYear(
        raw,
        year,
        dateStr,
        weekday,
        timeStr,
        content
      );
      await this.app.vault.modify(file, next);
    }
    const f = this.app.vault.getAbstractFileByPath(filePath);
    if (f instanceof import_obsidian.TFile) await this.reloadFile(f);
  }
  /** 编辑一条 memo
   *  v1.1.15: 写入前用最新文件内容重新 parse，按 (date, time) + 原 range 附近定位
   *    真实行号；如果 memo 已不存在（被外部删了）或位置完全对不上，抛错让上层提示用户刷新，
   *    避免用过期 range 盲写损坏相邻 memo。 */
  async editMemo(memo, newContent) {
    newContent = newContent.trim();
    if (!newContent) return;
    const file = this.app.vault.getAbstractFileByPath(memo.file);
    if (!file) return;
    const raw = await this.app.vault.read(file);
    const lines = raw.split(/\r?\n/);
    const [s, e] = this.locateMemoRange(raw, memo);
    const rendered = renderMemo(memo.time, newContent).split("\n");
    lines.splice(s, e - s + 1, ...rendered);
    await this.app.vault.modify(file, lines.join("\n"));
    await this.reloadFile(file);
  }
  /** v1.6.0: 修改一条已存在 memo 的时间（年/月/日/时/分），可同时修改正文。
   *   实现策略：在源位置删除原 memo 块 + 在新时间位置插入新内容。
   *
   *   边界处理：
   *     1. 同年改日期或时间 → 同一文件内"块搬家"：先 splice 删旧位置，
   *        再调 insertMemoIntoYear 重新插入到目标日期块下。
   *     2. 跨年改 → 旧文件删块 + 目标年份文件 addMemo（必要时新建文件）。
   *     3. 旧位置删除后如果该日期下没别的 memo 了，会触发孤儿日期标题清理。
   *     4. 旧年份文件如果删空了**保留**（只剩 # YYYY 头），不主动删文件。
   *     5. 不写入回收站（这是搬移不是删除，避免污染 _trash.md）。
   *     6. 不做时间冲突检查 —— 同时间多条 memo 是合法状态（用户连发速记时常见）。
   *
   *   定位策略与 editMemo 一致：先按原 range 起点，原 range 失效就 fallback 到
   *   按 (date, time, content) 候选挑 range[0] 最近的那条。 */
  async editMemoDateTime(memo, newDateTime, newContent) {
    const file = this.app.vault.getAbstractFileByPath(memo.file);
    if (!file) {
      throw new Error(t("error.originNotFound"));
    }
    const content = (newContent ?? memo.content).trim();
    if (!content) {
      throw new Error(t("error.emptyContent"));
    }
    const newYear = newDateTime.getFullYear().toString();
    const newDate = fmtDate(newDateTime);
    const newTime = fmtTime(newDateTime);
    const newWeekday = fmtWeekday(newDateTime);
    if (newDate === memo.date && newTime === memo.time && content === memo.content) {
      return;
    }
    const oldRaw = await this.app.vault.read(file);
    const [s, e] = this.locateMemoRange(oldRaw, memo);
    const sourceWithoutMemo = this.removeMemoFromRaw(oldRaw, [s, e]);
    const folder = (0, import_obsidian.normalizePath)(this.settings.folder);
    await this.ensureFolder(folder);
    const newFilePath = `${folder}/${newYear}.md`;
    const sameFile = newFilePath === file.path;
    if (sameFile) {
      const next = this.insertMemoIntoYear(
        sourceWithoutMemo,
        newYear,
        newDate,
        newWeekday,
        newTime,
        content
      );
      await this.app.vault.modify(file, next);
      await this.reloadFile(file);
    } else {
      const target = this.app.vault.getAbstractFileByPath(newFilePath);
      if (!target) {
        const periods = this.periodHeadings(newDateTime, []);
        const initial = `${periods}

### ${newDate} ${newWeekday}

${renderMemo(newTime, content)}

`;
        await this.app.vault.create(newFilePath, initial);
      } else {
        const targetRaw = await this.app.vault.read(target);
        const next = this.insertMemoIntoYear(
          targetRaw,
          newYear,
          newDate,
          newWeekday,
          newTime,
          content
        );
        await this.app.vault.modify(target, next);
      }
      try {
        await this.app.vault.modify(file, sourceWithoutMemo);
      } catch (error) {
        throw new Error(
          "\u76EE\u6807\u5E74\u4EFD\u5DF2\u5199\u5165\uFF0C\u4F46\u539F\u5E74\u4EFD\u672A\u80FD\u79FB\u9664\u65E7\u8BB0\u5F55\uFF1B\u4E3A\u907F\u514D\u4E22\u5931\u5DF2\u4FDD\u7559\u4E24\u4EFD\uFF0C\u8BF7\u5237\u65B0\u540E\u624B\u52A8\u786E\u8BA4\u3002",
          { cause: error }
        );
      }
      await this.reloadFile(file);
      const newFile = this.app.vault.getAbstractFileByPath(newFilePath);
      if (newFile) await this.reloadFile(newFile);
    }
  }
  /** 删除 memo（同时清理"孤儿"日期标题：某日下已无 memo 则把日期行也删掉）。
   *  不再写入 _trash.md；界面上的 5 秒撤销不依赖回收站文件。
   */
  async deleteMemo(memo) {
    const file = this.app.vault.getAbstractFileByPath(memo.file);
    if (!file) return;
    const raw = await this.app.vault.read(file);
    const [s, e] = this.locateMemoRange(raw, memo);
    const imageFiles = this.collectOwnedImageFiles(memo);
    const updatedRaw = this.removeMemoFromRaw(raw, [s, e]);
    await this.app.vault.modify(file, updatedRaw);
    await this.reloadFile(file);
    for (const image of imageFiles) {
      const stillUsed = await this.isAttachmentReferencedInVault(image, file.path, updatedRaw);
      if (!stillUsed) await this.app.vault.delete(image);
    }
  }
  collectOwnedImageFiles(memo) {
    const folder = (0, import_obsidian.normalizePath)(this.settings.attachmentFolder).replace(/\/$/, "");
    if (!folder) return [];
    const links = [];
    memo.content.replace(/!\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g, (_m, link) => {
      links.push(link.trim());
      return _m;
    });
    memo.content.replace(/!\[[^\]]*\]\(([^)]+)\)/g, (_m, link) => {
      links.push(link.trim());
      return _m;
    });
    const files = links.map((link) => this.app.metadataCache.getFirstLinkpathDest(link, memo.file)).filter((item) => item instanceof import_obsidian.TFile);
    return Array.from(new Map(files.filter((item) => item.path.startsWith(`${folder}/`)).map((item) => [item.path, item])).values());
  }
  /** 从最新源码移除一条记录，并统一清理分隔线、孤立日期标题和多余空行。 */
  removeMemoFromRaw(raw, range) {
    const lines = raw.split(/\r?\n/);
    const [start, end] = range;
    lines.splice(start, end - start + 1);
    let separatorAt = start;
    while (separatorAt < lines.length && lines[separatorAt].trim() === "") {
      lines.splice(separatorAt, 1);
    }
    if (lines[separatorAt]?.trim() === "---") {
      lines.splice(separatorAt, 1);
      while (separatorAt < lines.length && lines[separatorAt].trim() === "") {
        lines.splice(separatorAt, 1);
      }
    }
    this.removeOrphanDateHeaders(lines);
    const cleaned = [];
    let blank = 0;
    for (const line of lines) {
      if (line.trim() === "") {
        blank += 1;
        if (blank <= 2) cleaned.push(line);
      } else {
        blank = 0;
        cleaned.push(line);
      }
    }
    return cleaned.join("\n");
  }
  /** 删除 Boxes 图片前做全库保守检查；误判为仍在使用只会留下文件，不会丢数据。 */
  async isAttachmentReferencedInVault(image, changedFilePath, changedFileRaw) {
    const hasReference = (raw) => raw.includes(image.path) || raw.includes(image.name);
    if (hasReference(changedFileRaw)) return true;
    const cacheLooksLikeHit = (note) => {
      const fileCache = this.app.metadataCache.getFileCache(note);
      if (!fileCache) return null;
      for (const embed of fileCache.embeds || []) {
        const dest = this.app.metadataCache.getFirstLinkpathDest(embed.link, note.path);
        if (dest?.path === image.path) return true;
      }
      for (const link of fileCache.links || []) {
        const dest = this.app.metadataCache.getFirstLinkpathDest(link.link, note.path);
        if (dest?.path === image.path) return true;
      }
      return false;
    };
    for (const note of this.app.vault.getMarkdownFiles()) {
      if (note.path === changedFilePath) continue;
      try {
        const cached = cacheLooksLikeHit(note);
        if (cached === true) return true;
        if (hasReference(await this.app.vault.cachedRead(note))) return true;
      } catch (err) {
        console.warn(`[Moments] \u68C0\u67E5\u9644\u4EF6\u5F15\u7528\u5931\u8D25\uFF0C\u4FDD\u7559 ${image.path}:`, err);
        return true;
      }
    }
    const extraExts = /* @__PURE__ */ new Set(["canvas", "base", "json", "html", "excalidraw"]);
    for (const file of this.app.vault.getFiles()) {
      if (file.extension === "md") continue;
      if (!extraExts.has(String(file.extension || "").toLowerCase())) continue;
      try {
        if (hasReference(await this.app.vault.cachedRead(file))) return true;
      } catch (err) {
        console.warn(`[Moments] \u68C0\u67E5\u975E Markdown \u5F15\u7528\u5931\u8D25\uFF0C\u4FDD\u7559 ${image.path}:`, err);
        return true;
      }
    }
    return false;
  }
  /**
   * v1.1.9: 把一条 memo 追加到 `<folder>/_trash.md`。
   *
   * 格式：每条带来源注释 + 原时间 + 原内容，方便将来人肉恢复：
   *   ## 已删除 2026-05-04 01:30
   *   - 来源：读&写/Moments/2026.md · 原时间 2026-04-25 12:43
   *     <原 memo 内容>
   *
   * 注意：_trash.md 没有 `# YYYY` 头、也不按日期分组，避免被 parseFile 误识别成正常 memo；
   *       也不放在 Moments 文件夹之外，因为用户停用插件后依然能在同一文件夹里看到它。
   */
  async appendToTrash(memo) {
    const folder = (0, import_obsidian.normalizePath)(this.settings.folder);
    await this.ensureFolder(folder);
    const trashPath = `${folder}/_trash.md`;
    const now = /* @__PURE__ */ new Date();
    const delStamp = `${fmtDate(now)} ${fmtTime(now)}`;
    const indented = memo.content.split("\n").map((l) => l === "" ? "" : `  ${l}`).join("\n");
    const block = `
## \u5DF2\u5220\u9664 ${delStamp}

- \u6765\u6E90\uFF1A\`${memo.file}\` \xB7 \u539F\u65F6\u95F4 ${memo.date} ${memo.time}
${indented}
`;
    const existing = this.app.vault.getAbstractFileByPath(trashPath);
    if (!existing) {
      const header = `# Moments \u56DE\u6536\u7AD9

> \u8FD9\u91CC\u4FDD\u5B58\u88AB\u5220\u9664\u7684\u7B14\u8BB0\u3002\u505C\u7528\u63D2\u4EF6\u540E\u4F9D\u7136\u53EF\u8BFB\uFF0C\u53EF\u624B\u52A8\u6062\u590D\u6216\u6E05\u7A7A\u3002
> \u8BE5\u6587\u4EF6\u4E0D\u4F1A\u88AB Moments \u4E3B\u89C6\u56FE\u8BC6\u522B\u4E3A\u666E\u901A\u7B14\u8BB0\u3002
`;
      await this.app.vault.create(trashPath, header + block);
    } else {
      const old = await this.app.vault.read(existing);
      const merged = old + block;
      const trimmed = this.trimTrashToLimit(
        merged,
        this.settings.trashMaxItems
      );
      await this.app.vault.modify(existing, trimmed);
    }
  }
  /**
   * v1.4.3: 把 _trash.md 内容裁剪到最多 limit 条（保留最新的），
   *         返回裁剪后的完整文本。limit <= 0 表示不裁剪。
   *
   *   逻辑：以 `## 已删除 ...` 行作为每条记录的分界，切成 N 条；
   *         如果 N > limit，则丢掉最前面 N-limit 条，保留最新的 limit 条。
   *         文件头的说明块（`# Moments 回收站` 及其 > 引用）永远保留。
   */
  trimTrashToLimit(raw, limit) {
    if (!limit || limit <= 0) return raw;
    const lines = raw.split(/\r?\n/);
    const delHeaderRe = /^##\s+已删除\s+/;
    const headerIdxs = [];
    for (let i = 0; i < lines.length; i++) {
      if (delHeaderRe.test(lines[i])) headerIdxs.push(i);
    }
    if (headerIdxs.length <= limit) return raw;
    const keepFromIdx = headerIdxs[headerIdxs.length - limit];
    const headEndIdx = headerIdxs[0];
    const headPart = lines.slice(0, headEndIdx);
    const keptPart = lines.slice(keepFromIdx);
    while (headPart.length && headPart[headPart.length - 1].trim() === "") {
      headPart.pop();
    }
    return headPart.join("\n") + "\n\n" + keptPart.join("\n");
  }
  /**
   * 原地移除所有"空日期标题"：
   *   ## 2025-06-28 周六     <- 下方没有任何 - HH:MM 行的标题将被删除
   */
  removeOrphanDateHeaders(lines) {
    const dateRe = /^#{2,3}\s+\d{4}-\d{2}-\d{2}(?:\s+.+)?$/;
    const memoRe = /^- \d{2}:\d{2}/;
    const nextBlockRe = /^#{1,2}\s+/;
    const toDelete = [];
    for (let i = 0; i < lines.length; i++) {
      if (!dateRe.test(lines[i])) continue;
      let hasMemo = false;
      for (let j = i + 1; j < lines.length; j++) {
        if (nextBlockRe.test(lines[j])) break;
        if (memoRe.test(lines[j])) {
          hasMemo = true;
          break;
        }
      }
      if (!hasMemo) toDelete.push(i);
    }
    for (let k = toDelete.length - 1; k >= 0; k--) {
      lines.splice(toDelete[k], 1);
    }
  }
  /** 切换置顶（追加/移除 #置顶 标签） */
  async togglePinned(memo) {
    await this.toggleReservedTag(memo, PIN_TAG);
  }
  /** 切换收藏（追加/移除 #收藏 标签） */
  async toggleStarred(memo) {
    await this.toggleReservedTag(memo, STAR_TAG);
  }
  /** 对齐 Memos View：切换归档 */
  async toggleArchived(memo) {
    await this.toggleReservedTag(memo, ARCHIVE_TAG);
  }
  /**
   * Moments 删除直接从 YYYY.md 移除。界面上的 5 秒撤销不依赖 _trash.md。
   */
  async softDeleteMemo(memo) {
    if (memo.isDeleted) return;
    await this.deleteMemo(memo);
  }
  /** 从回收站恢复 */
  async restoreDeletedMemo(memo) {
    if (!memo.isDeleted) return;
    await this.toggleReservedTag(memo, DELETED_TAG);
  }
  async toggleReservedTag(memo, tag) {
    const has = memo.tags.includes(tag);
    let newContent;
    if (has) {
      const re = new RegExp(
        `\\s*#${escapeRegex(tag)}(?![A-Za-z0-9_\\u4e00-\\u9fff/])`,
        "g"
      );
      newContent = memo.content.replace(re, "");
      newContent = newContent.split("\n").map((l) => l.replace(/[ \t]+$/, "")).join("\n").replace(/\n{3,}/g, "\n\n").trim();
      if (newContent === "") {
        newContent = `\uFF08\u5DF2\u53D6\u6D88${tag}\uFF09`;
      }
    } else {
      const lines = memo.content.split("\n");
      if (lines.length === 0 || lines[0].trim() === "") {
        lines[0] = `#${tag}`;
      } else {
        lines[0] = `${lines[0].replace(/\s+$/, "")} #${tag}`;
      }
      newContent = lines.join("\n");
    }
    await this.editMemo(memo, newContent);
  }
  /**
   * 保存二进制图片到附件目录
   * 文件名：moments-YYYYMMDD-HHmmss-随机.<ext>
   */
  async saveImageAttachment(bytes, extension) {
    const folder = (0, import_obsidian.normalizePath)(this.settings.attachmentFolder);
    await this.ensureFolder(folder);
    const now = /* @__PURE__ */ new Date();
    const stamp = now.getFullYear().toString() + pad(now.getMonth() + 1) + pad(now.getDate()) + "-" + pad(now.getHours()) + pad(now.getMinutes()) + pad(now.getSeconds());
    const rand = Math.random().toString(36).slice(2, 6);
    const ext = (extension || "png").replace(/^\./, "").toLowerCase();
    const path = `${folder}/moments-${stamp}-${rand}.${ext}`;
    await this.app.vault.createBinary(path, bytes);
    return path;
  }
  async ensureFolder(folder) {
    const folderPath = (0, import_obsidian.normalizePath)(String(folder || "")).replace(/\/+$/, "");
    if (!folderPath) return;
    let current = "";
    for (const part of folderPath.split("/").filter(Boolean)) {
      current = current ? `${current}/${part}` : part;
      if (this.app.vault.getAbstractFileByPath(current)) continue;
      try {
        await this.app.vault.createFolder(current);
      } catch (e) {
        const msg = String(e?.message || e || "");
        if (/already exists/i.test(msg)) continue;
        throw e;
      }
    }
  }
  /**
   * 智能插入一条 memo 到 raw 文本：
   *  - 没有 "# {year}" 标题则头部加上
   *  - 已有对应日期分组，插入到该组末尾
   *  - 没有日期分组，按日期升序新建分组
   */
  insertMemoIntoYear(raw, year, date, weekday, time, content) {
    const lines = raw.split(/\r?\n/);
    const dateHeader = `### ${date} ${weekday}`;
    const memoBlock = renderMemo(time, content);
    const yearLine = -1;
    const dateRe = new RegExp(`^#{2,3}\\s+${date}(?:\\s+.+)?$`);
    const dateLine = lines.findIndex((l) => dateRe.test(l));
    if (dateLine >= 0) {
      let end = lines.length;
      for (let i = dateLine + 1; i < lines.length; i++) {
        if (/^#{1,3}\s+/.test(lines[i])) {
          end = i;
          break;
        }
      }
      const timeRe = /^-\s+(\d{2}:\d{2})(?:\s|$)/;
      let insertBeforeIdx = -1;
      for (let i = dateLine + 1; i < end; i++) {
        const tm = lines[i].match(timeRe);
        if (tm && tm[1] > time) {
          insertBeforeIdx = i;
          break;
        }
      }
      if (insertBeforeIdx >= 0) {
        let at = insertBeforeIdx;
        while (at > dateLine + 1 && lines[at - 1].trim() === "") {
          at--;
        }
        lines.splice(at, 0, memoBlock, "");
        return lines.join("\n");
      }
      const insertAt = this.trimTrailingBlank(lines, dateLine + 1, end);
      lines.splice(insertAt, 0, "", memoBlock);
      return lines.join("\n");
    }
    const allDateRe = /^#{2,3}\s+(\d{4}-\d{2}-\d{2})/;
    const nextYearRe = /^#\s+\d{4}\s*$/;
    let insertIdx = -1;
    let scanEnd = lines.length;
    for (let i = yearLine + 1; i < lines.length; i++) {
      if (nextYearRe.test(lines[i])) {
        scanEnd = i;
        break;
      }
    }
    for (let i = yearLine + 1; i < scanEnd; i++) {
      const m = lines[i].match(allDateRe);
      if (m && m[1] > date) {
        insertIdx = i;
        break;
      }
    }
    if (insertIdx === -1) {
      if (scanEnd < lines.length) {
        let endOfYear = scanEnd;
        while (endOfYear > yearLine + 1 && lines[endOfYear - 1].trim() === "") {
          endOfYear--;
        }
        const period3 = this.periodHeadings(/* @__PURE__ */ new Date(`${date}T12:00:00`), lines);
        const block2 = [...period3 ? [period3, ""] : [], dateHeader, "", memoBlock, ""];
        lines.splice(endOfYear, 0, "", ...block2);
        return lines.join("\n");
      }
      while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();
      const period2 = this.periodHeadings(/* @__PURE__ */ new Date(`${date}T12:00:00`), lines);
      lines.push("", ...period2 ? [period2, ""] : [], dateHeader, "", memoBlock, "");
      return lines.join("\n");
    }
    const period = this.periodHeadings(/* @__PURE__ */ new Date(`${date}T12:00:00`), lines);
    const block = ["", ...period ? [period, ""] : [], dateHeader, "", memoBlock, ""];
    lines.splice(insertIdx, 0, ...block);
    return lines.join("\n");
  }
  periodHeadings(when, lines) {
    const month = String(when.getMonth() + 1).padStart(2, "0");
    const probe = new Date(when);
    probe.setHours(12, 0, 0, 0);
    probe.setDate(probe.getDate() + 3 - (probe.getDay() + 6) % 7);
    const first = new Date(probe.getFullYear(), 0, 4, 12);
    first.setDate(first.getDate() + 3 - (first.getDay() + 6) % 7);
    const week = 1 + Math.round((probe.getTime() - first.getTime()) / 6048e5);
    const monthHeading = `# ${month}\u6708`;
    const weekHeading = `## \u7B2C${week}\u5468`;
    return [lines.includes(monthHeading) ? "" : monthHeading, lines.includes(weekHeading) ? "" : weekHeading].filter(Boolean).join("\n\n");
  }
  trimTrailingBlank(lines, from, to) {
    let last = from;
    for (let i = from; i < to; i++) {
      if (lines[i].trim() !== "") last = i + 1;
    }
    return last;
  }
};
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function pad(n) {
  return n.toString().padStart(2, "0");
}

// src/moments-memoria/view.ts
var import_obsidian7 = require("obsidian");

// src/moments-memoria/tag-suggest.ts
var import_obsidian2 = require("obsidian");

// src/moments-memoria/textarea-utils.ts
function replaceTextareaRange(el, start, end, newText) {
  try {
    el.focus();
    el.setSelectionRange(start, end);
    if (activeDocument.execCommand("insertText", false, newText)) {
      return;
    }
  } catch {
  }
  if (typeof el.setRangeText === "function") {
    try {
      el.focus();
      el.setRangeText(newText, start, end, "end");
      el.dispatchEvent(new Event("input", { bubbles: true }));
      return;
    } catch {
    }
  }
  el.value = el.value.slice(0, start) + newText + el.value.slice(end);
  el.selectionStart = el.selectionEnd = start + newText.length;
  el.dispatchEvent(new Event("input", { bubbles: true }));
}
function setTextareaValue(el, newText) {
  replaceTextareaRange(el, 0, el.value.length, newText);
}
var WrapHandler = class {
  /**
   * @returns true = 已处理，调用方应 preventDefault；false = 正常输入
   */
  handleKey(e, el) {
    if (e.ctrlKey || e.metaKey || e.altKey) return false;
    if (e.isComposing || e.keyCode === 229) {
      return false;
    }
    const key = e.key;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const hasSelection = end > start;
    const text = el.value;
    if (key === "`") {
      if (hasSelection) {
        const selected = text.slice(start, end);
        replaceTextareaRange(el, start, end, "`" + selected + "`");
        return true;
      }
      return false;
    }
    if (key === "*") {
      if (!hasSelection && start > 0 && text[start - 1] === "*") {
        const innerEnd = start - 1;
        let leftStar = -1;
        for (let i = innerEnd - 1; i >= 0; i--) {
          const ch = text[i];
          if (ch === "\n") break;
          if (ch === "*") {
            if (i > 0 && text[i - 1] === "*") break;
            leftStar = i;
            break;
          }
        }
        if (leftStar >= 0 && innerEnd - leftStar > 1) {
          const inner = text.slice(leftStar + 1, innerEnd);
          replaceTextareaRange(el, leftStar, innerEnd + 1, "**" + inner + "**");
          return true;
        }
      }
      if (hasSelection) {
        const selected = text.slice(start, end);
        replaceTextareaRange(el, start, end, "*" + selected + "*");
        return true;
      }
      return false;
    }
    if ((key === "=" || key === "~") && hasSelection) {
      const wrap = key + key;
      const selected = text.slice(start, end);
      replaceTextareaRange(el, start, end, wrap + selected + wrap);
      return true;
    }
    return false;
  }
};

// src/moments-memoria/tag-suggest.ts
var _TagSuggest = class _TagSuggest {
  constructor(app, textarea) {
    __publicField(this, "app", app);
    __publicField(this, "textarea", textarea);
    __publicField(this, "dropdown", null);
    __publicField(this, "items", []);
    __publicField(this, "active", 0);
    __publicField(this, "rangeStart", 0);
    // 触发位置（# 字符所在的索引）
    /** v1.4.11: 标签全扫缓存。
     *   原实现：每按一个键 → 遍历 vault 所有 md → metadataCache.getFileCache → getAllTags。
     *   vault 有 3000+ md 时每次打字都能感觉到输入延迟。
     *   现在：30 秒 TTL 缓存，期间按键直接复用；另外订阅 metadataCache "changed" 事件
     *   让缓存失效，保证新增标签可以在下次打字时看到。 */
    __publicField(this, "cachedTags", null);
    __publicField(this, "cacheTime", 0);
    __publicField(this, "metaChangeRef", null);
    // -------- 事件 --------
    __publicField(this, "handleInput", () => {
      const trigger = this.detectTrigger();
      if (!trigger) {
        this.close();
        return;
      }
      this.rangeStart = trigger.start;
      const all = this.collectAllTags();
      this.items = this.match(all, trigger.query);
      if (this.items.length === 0) {
        this.close();
        return;
      }
      this.active = 0;
      this.render();
    });
    __publicField(this, "handleBlur", () => {
      window.setTimeout(() => this.close(), 150);
    });
    __publicField(this, "handleKeydown", (e) => {
      if (!this.dropdown) return;
      if (e.isComposing || e.keyCode === 229) {
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        this.active = (this.active + 1) % this.items.length;
        this.refreshActive();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        this.active = (this.active - 1 + this.items.length) % this.items.length;
        this.refreshActive();
      } else if (e.key === "Enter" || e.key === "Tab") {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) return;
        e.preventDefault();
        e.stopPropagation();
        this.applySelected();
      } else if (e.key === "Escape") {
        e.preventDefault();
        this.close();
      }
    });
    this.textarea.addEventListener("input", this.handleInput);
    this.textarea.addEventListener("keydown", this.handleKeydown, true);
    this.textarea.addEventListener("blur", this.handleBlur);
    this.textarea.addEventListener("scroll", () => this.close());
    const ref = this.app.metadataCache.on("changed", () => {
      this.cachedTags = null;
    });
    this.metaChangeRef = {
      unref: () => this.app.metadataCache.offref(ref)
    };
  }
  destroy() {
    this.textarea.removeEventListener("input", this.handleInput);
    this.textarea.removeEventListener("keydown", this.handleKeydown, true);
    this.textarea.removeEventListener("blur", this.handleBlur);
    if (this.metaChangeRef) {
      this.metaChangeRef.unref();
      this.metaChangeRef = null;
    }
    this.close();
  }
  // -------- 触发检测 --------
  /**
   * 检测光标位置是否处于 "#xxx" 这种待补全状态
   * 返回 { start: # 字符位置, query: # 后到光标的字符 }
   */
  detectTrigger() {
    const pos = this.textarea.selectionStart ?? 0;
    const text = this.textarea.value;
    let i = pos - 1;
    while (i >= 0) {
      const ch = text[i];
      if (ch === "#") {
        const prev = i === 0 ? " " : text[i - 1];
        if (/[\s\n\r,，。.!?！？（(]/.test(prev) || i === 0) {
          const query = text.slice(i + 1, pos);
          if (/^[A-Za-z0-9_\u4e00-\u9fff/]*$/.test(query)) {
            return { start: i, query };
          }
        }
        return null;
      }
      if (/[\s\n\r]/.test(ch)) return null;
      if (!/[A-Za-z0-9_\u4e00-\u9fff/]/.test(ch)) return null;
      i--;
    }
    return null;
  }
  // -------- 数据 --------
  /** 收集 Vault 里所有标签，按使用频率排序
   *  v1.4.11: 30 秒 TTL 缓存 + metadataCache changed 事件失效。 */
  collectAllTags() {
    if (this.cachedTags && Date.now() - this.cacheTime < _TagSuggest.CACHE_TTL_MS) {
      return this.cachedTags;
    }
    const counter = /* @__PURE__ */ new Map();
    const cache = this.app.metadataCache;
    const files = this.app.vault.getMarkdownFiles();
    for (const f of files) {
      const meta = cache.getFileCache(f);
      if (!meta) continue;
      const tags = (0, import_obsidian2.getAllTags)(meta) ?? [];
      for (const tag of tags) {
        const name = tag.replace(/^#/, "");
        if (!name) continue;
        counter.set(name, (counter.get(name) ?? 0) + 1);
      }
    }
    const result = [...counter.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
    this.cachedTags = result;
    this.cacheTime = Date.now();
    return result;
  }
  /** 模糊匹配：优先前缀，其次包含 */
  match(all, query) {
    if (!query) {
      return all.slice(0, 8).map((x) => x.name);
    }
    const q = query.toLowerCase();
    const prefix = [];
    const contain = [];
    for (const t2 of all) {
      const lower = t2.name.toLowerCase();
      if (lower === q) continue;
      if (lower.startsWith(q)) prefix.push(t2);
      else if (lower.includes(q)) contain.push(t2);
      else {
        const segs = lower.split("/");
        if (segs.some((s) => s.startsWith(q))) contain.push(t2);
      }
    }
    return [...prefix, ...contain].slice(0, 8).map((x) => x.name);
  }
  // -------- UI --------
  render() {
    if (!this.dropdown) {
      this.dropdown = activeDocument.body.createDiv({ cls: "memoria-tag-suggest" });
      this.dropdown.addEventListener("mousedown", (e) => e.preventDefault());
    }
    this.dropdown.empty();
    this.items.forEach((name, i) => {
      const item = this.dropdown.createDiv({
        cls: "memoria-tag-suggest-item" + (i === this.active ? " active" : "")
      });
      const icon = item.createSpan({ cls: "memoria-tag-suggest-icon" });
      (0, import_obsidian2.setIcon)(icon, "hash");
      item.createSpan({ cls: "memoria-tag-suggest-name", text: name });
      item.addEventListener("click", () => {
        this.active = i;
        this.applySelected();
      });
    });
    this.position();
  }
  refreshActive() {
    if (!this.dropdown) return;
    const items = this.dropdown.querySelectorAll(".memoria-tag-suggest-item");
    items.forEach((el, i) => {
      el.toggleClass("active", i === this.active);
    });
    const activeEl = items[this.active];
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }
  /** 把下拉定位到 textarea 当前光标下方 */
  position() {
    if (!this.dropdown) return;
    const rect = this.textarea.getBoundingClientRect();
    const top = rect.bottom + 4;
    const left = rect.left + 4;
    this.dropdown.style.top = `${top}px`;
    this.dropdown.style.left = `${left}px`;
    this.dropdown.style.minWidth = `${Math.min(rect.width, 280)}px`;
  }
  applySelected() {
    if (!this.dropdown || !this.items.length) return;
    const chosen = this.items[this.active];
    const pos = this.textarea.selectionStart ?? 0;
    const insert = `#${chosen} `;
    replaceTextareaRange(this.textarea, this.rangeStart, pos, insert);
    this.textarea.focus();
    this.close();
  }
  close() {
    if (this.dropdown) {
      this.dropdown.remove();
      this.dropdown = null;
    }
    this.items = [];
    this.active = 0;
  }
};
__publicField(_TagSuggest, "CACHE_TTL_MS", 3e4);
var TagSuggest = _TagSuggest;

// src/moments-memoria/image-grid.ts
var import_obsidian3 = require("obsidian");
var RE_WIKI_IMG = /!\[\[([^\]]+?)(?:\|([^\]]*))?\]\]/g;
var RE_MD_IMG = /!\[([^\]]*)\]\(([^)]+)\)/g;
function isImageExt(ext) {
  return /^(png|jpe?g|gif|webp|svg|bmp|avif)$/i.test(ext);
}
function extractImages(app, content, sourceFile) {
  const images = [];
  let stripped = content.replace(RE_WIKI_IMG, (_full, link, alt) => {
    const trimmed = link.trim();
    const ext = (trimmed.split(".").pop() ?? "").toLowerCase();
    if (!isImageExt(ext)) return _full;
    const file = app.metadataCache.getFirstLinkpathDest(trimmed, sourceFile);
    if (!(file instanceof import_obsidian3.TFile)) {
      return _full;
    }
    const src = app.vault.getResourcePath(file);
    images.push({ vaultPath: file.path, src, alt: alt ?? file.basename });
    return "";
  });
  stripped = stripped.replace(RE_MD_IMG, (_full, alt, url) => {
    const u = url.trim();
    const ext = u.split(/[?#]/)[0].split(".").pop() ?? "";
    if (!isImageExt(ext) && !u.startsWith("data:image/")) {
      return _full;
    }
    let src = u;
    if (!u.startsWith("http") && !u.startsWith("data:")) {
      const file = app.metadataCache.getFirstLinkpathDest(u, sourceFile);
      if (file instanceof import_obsidian3.TFile) {
        src = app.vault.getResourcePath(file);
      }
    }
    images.push({ src, alt: alt || "image" });
    return "";
  });
  const text = stripped.split("\n").map((l) => l.replace(/\s+$/, "")).join("\n").replace(/\n{3,}/g, "\n\n").trim();
  return { text, images };
}
function renderImageGrid(parent, images, onZoom) {
  if (images.length === 0) return;
  const grid = parent.createDiv({
    cls: `memoria-img-grid memoria-img-grid-${Math.min(images.length, 9)}`
  });
  const display = images.slice(0, 9);
  display.forEach((img, idx) => {
    const cell = grid.createDiv({ cls: "memoria-img-cell" });
    const el = cell.createEl("img", {
      cls: "memoria-img",
      attr: {
        src: img.src,
        alt: img.alt,
        loading: "lazy"
      }
    });
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      onZoom(idx);
    });
    if (idx === 8 && images.length > 9) {
      const overlay = cell.createDiv({ cls: "memoria-img-overlay" });
      overlay.setText(`+${images.length - 9}`);
      overlay.addEventListener("click", (e) => {
        e.stopPropagation();
        onZoom(8);
      });
    }
  });
}
function openLightbox(images, startIndex) {
  let cur = startIndex;
  const backdrop = activeDocument.body.createDiv({ cls: "memoria-lightbox" });
  const stage = backdrop.createDiv({ cls: "memoria-lightbox-stage" });
  const imgEl = stage.createEl("img", { cls: "memoria-lightbox-img" });
  const counter = backdrop.createDiv({ cls: "memoria-lightbox-counter" });
  const closeBtn = backdrop.createEl("button", {
    cls: "memoria-lightbox-close",
    text: "\xD7",
    attr: { "aria-label": t("lightbox.close") }
  });
  const prevBtn = backdrop.createEl("button", {
    cls: "memoria-lightbox-nav memoria-lightbox-prev",
    text: "\u2039",
    attr: { "aria-label": t("lightbox.prev") }
  });
  const nextBtn = backdrop.createEl("button", {
    cls: "memoria-lightbox-nav memoria-lightbox-next",
    text: "\u203A",
    attr: { "aria-label": t("lightbox.next") }
  });
  const update = () => {
    imgEl.src = images[cur].src;
    imgEl.alt = images[cur].alt;
    counter.setText(`${cur + 1} / ${images.length}`);
    prevBtn.style.visibility = cur > 0 ? "visible" : "hidden";
    nextBtn.style.visibility = cur < images.length - 1 ? "visible" : "hidden";
  };
  update();
  const close = () => {
    backdrop.remove();
    activeDocument.removeEventListener("keydown", onKey);
  };
  const prev = () => {
    if (cur > 0) {
      cur--;
      update();
    }
  };
  const next = () => {
    if (cur < images.length - 1) {
      cur++;
      update();
    }
  };
  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    prev();
  });
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    next();
  });
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop || e.target === stage) close();
  });
  imgEl.addEventListener("click", (e) => {
    e.stopPropagation();
    next();
  });
  const onKey = (e) => {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") prev();
    else if (e.key === "ArrowRight") next();
  };
  activeDocument.addEventListener("keydown", onKey);
}

// src/moments-memoria/calendar.ts
var import_obsidian4 = require("obsidian");
function getWeekdays() {
  return [0, 1, 2, 3, 4, 5, 6].map((i) => t(`calendar.weekday.${i}`));
}
function renderCalendar(parent, memos, options, initYear, initMonth) {
  const today = /* @__PURE__ */ new Date();
  let year = initYear ?? today.getFullYear();
  let month = initMonth ?? today.getMonth();
  let activeDate = options.activeDate ?? null;
  const container = parent.createDiv({ cls: "memoria-calendar" });
  const dayMap = /* @__PURE__ */ new Map();
  for (const m of memos) {
    dayMap.set(m.date, (dayMap.get(m.date) ?? 0) + 1);
  }
  const render = () => {
    container.empty();
    const head = container.createDiv({ cls: "memoria-cal-head" });
    const prevBtn = head.createEl("button", {
      cls: "memoria-cal-nav",
      attr: { "aria-label": t("calendar.prevMonth") }
    });
    (0, import_obsidian4.setIcon)(prevBtn, "chevron-left");
    const title = head.createDiv({
      cls: "memoria-cal-title",
      text: t("calendar.monthTitle", { year, m: month + 1 })
    });
    title.addEventListener("click", () => {
      year = today.getFullYear();
      month = today.getMonth();
      options.onMonthChange?.(year, month);
      render();
    });
    const nextBtn = head.createEl("button", {
      cls: "memoria-cal-nav",
      attr: { "aria-label": t("calendar.nextMonth") }
    });
    (0, import_obsidian4.setIcon)(nextBtn, "chevron-right");
    prevBtn.addEventListener("click", () => {
      if (month === 0) {
        month = 11;
        year--;
      } else month--;
      options.onMonthChange?.(year, month);
      render();
    });
    nextBtn.addEventListener("click", () => {
      if (month === 11) {
        month = 0;
        year++;
      } else month++;
      options.onMonthChange?.(year, month);
      render();
    });
    const weekHead = container.createDiv({ cls: "memoria-cal-week-head" });
    for (const w of getWeekdays()) {
      weekHead.createDiv({ cls: "memoria-cal-wday", text: w });
    }
    const grid = container.createDiv({ cls: "memoria-cal-grid" });
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDow = firstDayOfMonth.getDay();
    for (let i = 0; i < startDow; i++) {
      grid.createDiv({ cls: "memoria-cal-cell empty" });
    }
    const todayStr = fmtDate2(today);
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const key = fmtDate2(d);
      const count = dayMap.get(key) ?? 0;
      const cell = grid.createDiv({
        cls: "memoria-cal-cell" + (count > 0 ? " has-memo" : "") + (key === todayStr ? " is-today" : "") + (key === activeDate ? " is-active" : "")
      });
      cell.setAttr("title", count > 0 ? t("calendar.dayCount", { date: key, n: count }) : key);
      cell.createDiv({ cls: "memoria-cal-num", text: String(day) });
      if (count > 0) {
        const dot = cell.createDiv({ cls: "memoria-cal-dot" });
        const level = count < 2 ? 1 : count < 4 ? 2 : count < 7 ? 3 : 4;
        dot.addClass(`level-${level}`);
      }
      if (count > 0 || key === todayStr) {
        cell.addEventListener("click", () => {
          activeDate = activeDate === key ? null : key;
          options.onPickDate(key);
          render();
        });
      }
    }
  };
  render();
  return {
    element: container,
    setMonth: (y, m) => {
      year = y;
      month = m;
      render();
    }
  };
}
function fmtDate2(d) {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// src/moments-memoria/search.ts
var EMPTY_QUERY = {
  includeTerms: [],
  excludeTerms: [],
  includeTags: [],
  excludeTags: [],
  afterDate: null,
  beforeDate: null,
  raw: ""
};
function parseSearchQuery(raw) {
  const q = {
    includeTerms: [],
    excludeTerms: [],
    includeTags: [],
    excludeTags: [],
    afterDate: null,
    beforeDate: null,
    raw: raw.trim()
  };
  if (!q.raw) return q;
  const tokens = q.raw.split(/\s+/).filter((t2) => t2.length > 0);
  for (const token of tokens) {
    const isExclude = token.startsWith("-") && token.length > 1;
    const body = isExclude ? token.slice(1) : token;
    const dateMatch = body.match(/^(after|before|date):(.+)$/i);
    if (dateMatch) {
      const kind = dateMatch[1].toLowerCase();
      const value = dateMatch[2];
      const range = parseDateToken(value);
      if (range) {
        if (kind === "after") {
          q.afterDate = pickLater(q.afterDate, range.start);
        } else if (kind === "before") {
          q.beforeDate = pickEarlier(q.beforeDate, range.end);
        } else {
          q.afterDate = pickLater(q.afterDate, range.start);
          q.beforeDate = pickEarlier(q.beforeDate, range.end);
        }
        continue;
      }
    }
    if (body.startsWith("#") && body.length > 1) {
      const tagName = body.slice(1);
      if (isExclude) {
        q.excludeTags.push(tagName);
      } else {
        q.includeTags.push(tagName);
      }
      continue;
    }
    if (isExclude) {
      q.excludeTerms.push(body);
    } else {
      q.includeTerms.push(body);
    }
  }
  return q;
}
function parseDateToken(s) {
  const yearRe = /^(\d{4})$/;
  const monthRe = /^(\d{4})-(\d{1,2})$/;
  const dateRe = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
  let m = s.match(dateRe);
  if (m) {
    const y = m[1];
    const mo = m[2].padStart(2, "0");
    const d = m[3].padStart(2, "0");
    return { start: `${y}-${mo}-${d}`, end: `${y}-${mo}-${d}` };
  }
  m = s.match(monthRe);
  if (m) {
    const y = parseInt(m[1], 10);
    const mo = parseInt(m[2], 10);
    if (mo < 1 || mo > 12) return null;
    const moStr = mo.toString().padStart(2, "0");
    const lastDay = new Date(y, mo, 0).getDate();
    const dStr = lastDay.toString().padStart(2, "0");
    return { start: `${y}-${moStr}-01`, end: `${y}-${moStr}-${dStr}` };
  }
  m = s.match(yearRe);
  if (m) {
    const y = m[1];
    return { start: `${y}-01-01`, end: `${y}-12-31` };
  }
  return null;
}
function pickLater(a, b) {
  if (!a) return b;
  return a > b ? a : b;
}
function pickEarlier(a, b) {
  if (!a) return b;
  return a < b ? a : b;
}
function matchesQuery(memoContent, memoTags, memoDate, q) {
  if (q.raw === "") return true;
  const lowerContent = memoContent.toLowerCase();
  for (const term of q.includeTerms) {
    if (!lowerContent.includes(term.toLowerCase())) return false;
  }
  for (const term of q.excludeTerms) {
    if (lowerContent.includes(term.toLowerCase())) return false;
  }
  for (const tag of q.includeTags) {
    const hit = memoTags.some(
      (t2) => t2 === tag || t2.startsWith(tag + "/")
    );
    if (!hit) return false;
  }
  for (const tag of q.excludeTags) {
    const hit = memoTags.some(
      (t2) => t2 === tag || t2.startsWith(tag + "/")
    );
    if (hit) return false;
  }
  if (q.afterDate && memoDate < q.afterDate) return false;
  if (q.beforeDate && memoDate > q.beforeDate) return false;
  return true;
}

// src/moments-memoria/mood.ts
var MOOD_KEYWORDS = {
  happy: [
    "\u5F00\u5FC3",
    "\u9AD8\u5174",
    "\u5FEB\u4E50",
    "\u6B23\u559C",
    "\u5174\u594B",
    "\u723D",
    "\u54C8\u54C8",
    "\u563B\u563B",
    "\u6EE1\u8DB3",
    "\u5E78\u798F",
    "\u60CA\u559C",
    "\u68D2",
    "\u592A\u68D2",
    "\u8D5E",
    "\u597D\u73A9",
    "\u6709\u610F\u601D",
    "\u4E50",
    "\u563F\u563F",
    "\u54C7",
    "\u592A\u597D\u4E86",
    "\u771F\u597D",
    "nice",
    "yyds",
    "happy",
    "joy",
    "awesome",
    "great",
    "love",
    "amazing",
    "wonderful",
    "excited",
    "yay",
    "lol",
    "haha"
  ],
  touched: [
    "\u611F\u52A8",
    "\u6E29\u6696",
    "\u6696\u5FC3",
    "\u6CEA\u76EE",
    "\u5FC3\u52A8",
    "\u6CBB\u6108",
    "\u6E29\u99A8",
    "\u611F\u6168",
    "\u6000\u5FF5",
    "\u60F3\u5FF5",
    "\u601D\u5FF5",
    "\u96BE\u5FD8",
    "\u611F\u6FC0",
    "\u611F\u8C22",
    "\u4E0D\u820D",
    "\u7737\u604B",
    "touched",
    "moved",
    "warm",
    "heartwarming",
    "nostalgic",
    "miss",
    "grateful"
  ],
  // v2.0.2: 新增「鼓励/励志/加油」
  inspired: [
    // 中文
    "\u52A0\u6CB9",
    "\u51B2",
    "\u51B2\u51B2\u51B2",
    "\u5965\u5229\u7ED9",
    "\u71C3\u8D77\u6765\u4E86",
    "\u6253\u9E21\u8840",
    "\u52A8\u529B",
    "\u575A\u6301",
    "\u52AA\u529B",
    "\u4E0D\u653E\u5F03",
    "\u7A81\u7834",
    "\u81EA\u4FE1",
    "\u52C7\u6562",
    "\u9F13\u52B1",
    "\u9F13\u821E",
    "\u52C7\u6C14",
    "\u76F8\u4FE1\u81EA\u5DF1",
    "\u4F60\u53EF\u4EE5\u7684",
    "\u6211\u53EF\u4EE5",
    "\u62FC\u4E86",
    "\u5E72\u4E86",
    "\u6491\u4F4F",
    "\u632F\u4F5C",
    "\u632F\u594B",
    "\u6602\u626C",
    "\u6597\u5FD7",
    "\u529B\u91CF",
    "\u5E0C\u671B",
    "\u524D\u8FDB",
    "\u5411\u524D",
    "\u6210\u957F",
    "\u7A81\u7834\u81EA\u6211",
    "\u6311\u6218",
    "\u51FA\u53D1",
    "\u542F\u7A0B",
    "\u641E\u8D77",
    "go",
    // 英文
    "inspired",
    "motivated",
    "encourage",
    "encouraged",
    "brave",
    "courage",
    "go for it",
    "you got this",
    "keep going",
    "never give up",
    "let's go",
    "hustle",
    "grit",
    "hope"
  ],
  sad: [
    "\u96BE\u8FC7",
    "\u4F24\u5FC3",
    "\u5931\u843D",
    "\u4F4E\u843D",
    "\u6CAE\u4E27",
    "\u6291\u90C1",
    "\u5B64\u72EC",
    "\u5BC2\u5BDE",
    "\u5FC3\u788E",
    "\u9057\u61BE",
    "\u53EF\u60DC",
    "\u540E\u6094",
    "\u54ED\u4E86",
    "\u54ED\u6CE3",
    "\u6D41\u6CEA",
    "\u6CEA\u6C34",
    "\u773C\u6CEA",
    "emo",
    "\u4E27",
    "\u60B2\u4F24",
    "\u60B2\u75DB",
    "\u54C0\u4F24",
    "\u5FC3\u9178",
    "\u75DB\u82E6",
    "\u96BE\u53D7",
    "\u59D4\u5C48",
    "\u5931\u671B",
    "\u7EDD\u671B",
    "\u5FC3\u75BC",
    "sad",
    "lonely",
    "depressed",
    "down",
    "heartbroken",
    "regret",
    "cry",
    "crying",
    "tears",
    "grief",
    "sorrow",
    "miserable"
  ],
  angry: [
    "\u70E6",
    "\u70E6\u8E81",
    "\u6124\u6012",
    "\u751F\u6C14",
    "\u607C\u706B",
    "\u65E0\u8BED",
    "\u5D29\u6E83",
    "\u8BA8\u538C",
    "\u90C1\u95F7",
    "\u6293\u72C2",
    "\u6C14\u6B7B",
    "\u6C14\u4EBA",
    "\u8349",
    "\u9760",
    "\u5367\u69FD",
    "\u6C14\u70B8",
    "angry",
    "annoyed",
    "frustrated",
    "hate",
    "ugh",
    "wtf",
    "damn",
    "mad"
  ],
  fear: [
    "\u5BB3\u6015",
    "\u6050\u60E7",
    "\u6050\u6016",
    "\u5413\u4EBA",
    "\u5413\u6B7B",
    "\u5413\u5230",
    "\u60CA\u5413",
    "\u60CA\u6050",
    "\u4E0D\u5B89",
    "\u62C5\u5FE7",
    "\u62C5\u5FC3",
    "\u5FD0\u5FD1",
    "\u7126\u8651",
    "\u7D27\u5F20",
    "\u60CA\u614C",
    "\u5FC3\u614C",
    "\u6BDB\u9AA8\u609A\u7136",
    "\u80C6\u602F",
    "\u80C6\u6218\u5FC3\u60CA",
    "\u6050\u614C",
    "\u614C\u4E71",
    "\u60F6\u6050",
    "afraid",
    "scared",
    "fear",
    "terrifying",
    "horror",
    "anxious",
    "worried",
    "nervous",
    "panic",
    "frightened"
  ],
  tired: [
    "\u7D2F",
    "\u597D\u7D2F",
    "\u592A\u7D2F",
    "\u75B2\u60EB",
    "\u75B2\u5026",
    "\u7CBE\u75B2\u529B\u5C3D",
    "\u7B4B\u75B2\u529B\u5C3D",
    "\u56F0",
    "\u56F0\u4E86",
    "\u60F3\u7761",
    "\u6CA1\u52B2",
    "\u65E0\u529B",
    "\u5026\u6020",
    "\u56F0\u5026",
    "\u72AF\u56F0",
    "\u4E4F\u529B",
    "\u6194\u60B4",
    "\u56F0\u5F97\u4E0D\u884C",
    "tired",
    "exhausted",
    "sleepy",
    "drained",
    "worn out",
    "burnout",
    "burnt out"
  ]
};
var MOOD_REGEXPS = (() => {
  const compile = (keywords) => {
    const parts = keywords.map((kw) => {
      if ([...kw].every((ch) => ch.charCodeAt(0) <= 127)) {
        return `\\b${escapeRegExp(kw)}\\b`;
      }
      return escapeRegExp(kw);
    });
    return new RegExp(parts.join("|"), "gi");
  };
  return {
    happy: compile(MOOD_KEYWORDS.happy),
    touched: compile(MOOD_KEYWORDS.touched),
    inspired: compile(MOOD_KEYWORDS.inspired),
    sad: compile(MOOD_KEYWORDS.sad),
    angry: compile(MOOD_KEYWORDS.angry),
    fear: compile(MOOD_KEYWORDS.fear),
    tired: compile(MOOD_KEYWORDS.tired)
  };
})();
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function detectMood(text) {
  if (!text) return "neutral";
  const scores = {
    happy: 0,
    touched: 0,
    inspired: 0,
    sad: 0,
    angry: 0,
    fear: 0,
    tired: 0
  };
  for (const [mood, re] of Object.entries(MOOD_REGEXPS)) {
    re.lastIndex = 0;
    const matches = text.match(re);
    if (matches) {
      scores[mood] = matches.length;
    }
  }
  const entries = Object.entries(scores).sort(
    (a, b) => b[1] - a[1]
  );
  const top = entries[0];
  const second = entries[1];
  if (top[1] === 0) return "neutral";
  if (top[1] === second[1]) return "neutral";
  return top[0];
}
function moodClass(mood) {
  return `memoria-mood-${mood}`;
}

// src/moments-memoria/smart-review.ts
var RECENT_SHOWN_KEY = "memoria:smart-review:recent";
var RECENT_SHOWN_MAX = 30;
function pickSmartReview(allMemos, opts) {
  if (allMemos.length === 0) return [];
  const { count, todayStr, todayMemos } = opts;
  const pool = allMemos.filter((m) => m.date !== todayStr);
  if (pool.length === 0) {
    return shuffle([...allMemos]).slice(0, count);
  }
  const todayTags = /* @__PURE__ */ new Set();
  for (const m of todayMemos) for (const t2 of m.tags) todayTags.add(t2);
  const todayMood = dominantMood(todayMemos);
  const recentShown = loadRecentShown();
  const nowTs = Date.now();
  const scored = pool.map((memo) => {
    const id = memoId(memo);
    const daysAgo = Math.max(
      0,
      (nowTs - memo.datetime.getTime()) / (1e3 * 60 * 60 * 24)
    );
    const noveltyScore = Math.log(1 + daysAgo) * 2;
    const recentIdx = recentShown.indexOf(id);
    const recentPenalty = recentIdx >= 0 ? -(10 - recentIdx * 0.3) : 0;
    let topicEcho = 0;
    if (todayTags.size > 0) {
      for (const t2 of memo.tags) {
        if (todayTags.has(t2)) topicEcho += 3;
      }
    }
    let moodBonus = 0;
    const memoMood = detectMood(memo.content);
    if (todayMood === "sad" || todayMood === "angry") {
      if (memoMood === "happy" || memoMood === "touched") moodBonus = 4;
    } else if (todayMood === "happy") {
      if (memoMood === "touched") moodBonus = 2;
    }
    const jitter = Math.random() * 1.5;
    const score = noveltyScore + recentPenalty + topicEcho + moodBonus + jitter;
    return { memo, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const picked = scored.slice(0, count).map((s) => s.memo);
  const newShown = [...picked.map(memoId), ...recentShown];
  saveRecentShown(newShown.slice(0, RECENT_SHOWN_MAX));
  return picked;
}
function memoId(m) {
  return `${m.file}:${m.range[0]}`;
}
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function dominantMood(memos) {
  if (memos.length === 0) return "neutral";
  const count = {
    happy: 0,
    touched: 0,
    inspired: 0,
    sad: 0,
    angry: 0,
    fear: 0,
    tired: 0,
    neutral: 0
  };
  for (const m of memos) {
    const mood = detectMood(m.content);
    count[mood]++;
  }
  const entries = Object.entries(count);
  entries.sort((a, b) => b[1] - a[1]);
  if (entries[0][0] === "neutral" || entries[0][1] === 0) return "neutral";
  return entries[0][0];
}
function loadRecentShown() {
  try {
    const raw = window.localStorage.getItem(RECENT_SHOWN_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}
function saveRecentShown(list) {
  try {
    window.localStorage.setItem(RECENT_SHOWN_KEY, JSON.stringify(list));
  } catch {
  }
}

// src/moments-memoria/html-to-md.ts
function shouldConvertHtmlToMd(html) {
  if (!html) return false;
  const re = /<\/?(strong|b|em|i|a|h[1-6]|ul|ol|li|blockquote|pre|code|img|hr)[\s>]/i;
  return re.test(html);
}
function looksLikeMarkdown(plain) {
  if (!plain) return false;
  if (/\[\[[^\]]+\]\]/.test(plain)) return true;
  if (/```/.test(plain)) return true;
  if (/(^|\n)#[^\s#]/.test(plain)) return true;
  if (/\*\*[^*\n]+\*\*|==[^=\n]+==|~~[^~\n]+~~/.test(plain)) return true;
  return false;
}
function htmlToMarkdown(html) {
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return nodeToMd(doc.body).trim();
  } catch {
    return "";
  }
}
function nodeToMd(node, listDepth = 0, listType = null, olIndex = 1) {
  if (node.nodeType === Node.TEXT_NODE) {
    return (node.textContent ?? "").replace(/\s+/g, " ").replace(/([\\`*_{}[\]()#+\-.!])/g, "\\$1");
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return "";
  const el = node;
  const tag = el.tagName;
  const children = Array.from(el.childNodes);
  const childText = () => {
    return children.map((c) => nodeToMd(c, listDepth, listType, olIndex)).join("");
  };
  switch (tag) {
    case "BR":
      return "\n";
    case "HR":
      return "\n---\n";
    case "STRONG":
    case "B":
      return "**" + childText().replace(/\\([*_])/g, "$1") + "**";
    case "EM":
    case "I":
      return "*" + childText().replace(/\\([*_])/g, "$1") + "*";
    case "CODE":
      return "`" + (el.textContent ?? "") + "`";
    case "PRE": {
      const code = el.textContent ?? "";
      return "\n```\n" + code + "\n```\n";
    }
    case "A": {
      const href = el.getAttribute("href") ?? "";
      const text = childText();
      if (!href) return text;
      return `[${text}](${href})`;
    }
    case "IMG": {
      const src = el.getAttribute("src") ?? "";
      const alt = el.getAttribute("alt") ?? "";
      if (!src) return "";
      return `![${alt}](${src})`;
    }
    case "H1":
      return "\n# " + childText() + "\n";
    case "H2":
      return "\n## " + childText() + "\n";
    case "H3":
      return "\n### " + childText() + "\n";
    case "H4":
      return "\n#### " + childText() + "\n";
    case "H5":
      return "\n##### " + childText() + "\n";
    case "H6":
      return "\n###### " + childText() + "\n";
    case "BLOCKQUOTE": {
      const inner = childText().trim();
      return "\n" + inner.split("\n").map((l) => "> " + l).join("\n") + "\n";
    }
    case "UL": {
      let out = "\n";
      Array.from(el.children).forEach((c) => {
        if (c.tagName === "LI") {
          const indent = "  ".repeat(listDepth);
          const inner = Array.from(c.childNodes).map((ch) => nodeToMd(ch, listDepth + 1, "ul", 1)).join("").trim();
          out += `${indent}- ${inner}
`;
        }
      });
      return out;
    }
    case "OL": {
      let out = "\n";
      let idx = 1;
      Array.from(el.children).forEach((c) => {
        if (c.tagName === "LI") {
          const indent = "  ".repeat(listDepth);
          const inner = Array.from(c.childNodes).map((ch) => nodeToMd(ch, listDepth + 1, "ol", 1)).join("").trim();
          out += `${indent}${idx}. ${inner}
`;
          idx++;
        }
      });
      return out;
    }
    case "LI":
      return childText();
    case "P":
    case "DIV":
    case "SECTION":
    case "ARTICLE":
      return "\n" + childText() + "\n";
    case "SCRIPT":
    case "STYLE":
    case "NOSCRIPT":
      return "";
    // 安全：丢弃
    default:
      return childText();
  }
}

// src/moments-memoria/export.ts
var import_obsidian5 = require("obsidian");
async function exportMemos(app, opts) {
  const { format, memos, filterDesc, exportFolder } = opts;
  if (memos.length === 0) {
    throw new Error(t("notice.exportEmpty"));
  }
  const folder = (0, import_obsidian5.normalizePath)(exportFolder);
  await ensureFolder(app, folder);
  const stamp = formatTimestamp(/* @__PURE__ */ new Date());
  const rand = Math.random().toString(36).slice(2, 6);
  const filename = `moments-export-${stamp}-${rand}.${format}`;
  const filePath = `${folder}/${filename}`;
  let content;
  switch (format) {
    case "md":
      content = renderMarkdown(memos, filterDesc);
      break;
    case "html":
      content = renderHtml(memos, filterDesc);
      break;
    case "json":
      content = renderJson(memos, filterDesc);
      break;
    default:
      throw new Error("Unknown export format");
  }
  await app.vault.create(filePath, content);
  new import_obsidian5.Notice(t("export.noticeDone", { n: memos.length, path: filePath }));
  return filePath;
}
async function ensureFolder(app, folder) {
  const folderPath = (0, import_obsidian5.normalizePath)(String(folder || "")).replace(/\/+$/, "");
  if (!folderPath) return;
  let current = "";
  for (const part of folderPath.split("/").filter(Boolean)) {
    current = current ? `${current}/${part}` : part;
    if (app.vault.getAbstractFileByPath(current)) continue;
    try {
      await app.vault.createFolder(current);
    } catch (e) {
      const msg = String(e?.message || e || "");
      if (/already exists/i.test(msg)) continue;
      throw e;
    }
  }
}
function formatTimestamp(d) {
  const p = (n) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}
function renderMarkdown(memos, filterDesc) {
  const now = /* @__PURE__ */ new Date();
  const fm = [
    "---",
    `exported_by: BrainCore Moments`,
    `exported_at: ${now.toISOString()}`,
    `count: ${memos.length}`,
    `filter: ${escapeYaml(filterDesc)}`,
    "---",
    "",
    `# ${t("export.mdTitle", { desc: filterDesc })}`,
    "",
    `> ${t("export.mdSummary", {
      date: now.toLocaleString(),
      count: t("list.totalCount", { n: memos.length })
    })}`,
    ""
  ].join("\n");
  const byDate = /* @__PURE__ */ new Map();
  for (const m of memos) {
    const arr = byDate.get(m.date) ?? [];
    arr.push(m);
    byDate.set(m.date, arr);
  }
  const sortedDates = [...byDate.keys()].sort().reverse();
  const parts = [fm];
  for (const date of sortedDates) {
    parts.push(`## ${date}`);
    parts.push("");
    const items = byDate.get(date) ?? [];
    items.sort((a, b) => b.time.localeCompare(a.time));
    for (const m of items) {
      parts.push(`- ${m.time}`);
      const indented = m.content.split("\n").map((l) => l === "" ? "" : `  ${l}`).join("\n");
      parts.push(indented);
      parts.push("");
    }
  }
  return parts.join("\n");
}
function escapeYaml(s) {
  return s.replace(/[":]/g, " ").replace(/\s+/g, " ").trim();
}
function renderHtml(memos, filterDesc) {
  const now = /* @__PURE__ */ new Date();
  const css = `
:root {
  color-scheme: light dark;
  --bg: #fbfaf7;
  --bg-card: #ffffff;
  --fg: #2c2a28;
  --fg-muted: #8a857f;
  --fg-dim: #b5b0a9;
  --accent: #c08a5a;
  --accent-soft: rgba(192, 138, 90, 0.12);
  --border: rgba(0, 0, 0, 0.06);
  --border-strong: rgba(0, 0, 0, 0.12);
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.03);
  --tag-bg: #f0ebe3;
  --tag-fg: #7a5c3a;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #17171a;
    --bg-card: #1e1e22;
    --fg: #e8e6e1;
    --fg-muted: #9c968e;
    --fg-dim: #5c5852;
    --accent: #d9a579;
    --accent-soft: rgba(217, 165, 121, 0.14);
    --border: rgba(255, 255, 255, 0.06);
    --border-strong: rgba(255, 255, 255, 0.12);
    --shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.25);
    --tag-bg: rgba(217, 165, 121, 0.12);
    --tag-fg: #d9a579;
  }
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", sans-serif;
  background: var(--bg);
  color: var(--fg);
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.container {
  max-width: 720px;
  margin: 0 auto;
  padding: 64px 24px 96px;
}

/* \u9876\u90E8\u6807\u9898\u533A */
.header {
  text-align: center;
  padding-bottom: 40px;
  margin-bottom: 48px;
  border-bottom: 1px solid var(--border);
  position: relative;
}
.header::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 48px;
  height: 2px;
  background: var(--accent);
  border-radius: 2px;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--accent);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 16px;
}
.brand-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--accent);
  display: inline-block;
}
.title {
  font-size: 34px;
  font-weight: 300;
  margin: 0 0 12px;
  letter-spacing: -0.02em;
  color: var(--fg);
}
.subtitle {
  font-size: 14px;
  color: var(--fg-muted);
  font-weight: 400;
}
.stat-strip {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-top: 28px;
  font-size: 13px;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.stat-num {
  font-size: 22px;
  font-weight: 500;
  color: var(--fg);
  font-variant-numeric: tabular-nums;
}
.stat-label {
  color: var(--fg-dim);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* \u65E5\u671F\u5206\u7EC4 */
.day-group {
  margin-bottom: 40px;
}
.day-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--fg-muted);
  padding: 6px 0 18px;
  letter-spacing: 0.04em;
  border-bottom: 1px dashed var(--border);
  margin-bottom: 20px;
}
.day-head-date {
  color: var(--fg);
  font-size: 15px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}
.day-head-weekday {
  color: var(--fg-dim);
  font-size: 12px;
}
.day-head-count {
  margin-left: auto;
  color: var(--fg-dim);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}

/* memo \u5361\u7247 */
.memo {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px 20px;
  margin-bottom: 12px;
  box-shadow: var(--shadow);
  transition: border-color 0.15s, transform 0.15s;
}
.memo:hover {
  border-color: var(--border-strong);
  transform: translateY(-1px);
}
.memo-time {
  font-size: 11px;
  color: var(--fg-dim);
  font-family: "SF Mono", ui-monospace, "JetBrains Mono", Consolas, monospace;
  letter-spacing: 0.04em;
  margin-bottom: 8px;
  font-variant-numeric: tabular-nums;
}
.memo-body {
  font-size: 15px;
  color: var(--fg);
  white-space: pre-wrap;
  word-break: break-word;
}
.memo-body p { margin: 0.4em 0; }
.memo-body p:first-child { margin-top: 0; }
.memo-body p:last-child { margin-bottom: 0; }
.memo-body a {
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px solid var(--accent-soft);
}
.memo-body a:hover {
  border-bottom-color: var(--accent);
}
.memo-body code {
  background: var(--accent-soft);
  color: var(--accent);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  font-family: "SF Mono", ui-monospace, Consolas, monospace;
}
.memo-body ul, .memo-body ol {
  padding-left: 1.5em;
  margin: 0.4em 0;
}
.memo-body h1, .memo-body h2, .memo-body h3,
.memo-body h4, .memo-body h5, .memo-body h6 {
  margin: 0.8em 0 0.4em;
  font-weight: 600;
  line-height: 1.35;
  color: var(--fg);
}
.memo-body h1 { font-size: 1.5em; }
.memo-body h2 { font-size: 1.3em; }
.memo-body h3 { font-size: 1.15em; }
.memo-body h4, .memo-body h5, .memo-body h6 { font-size: 1em; }
.memo-body blockquote {
  margin: 0.5em 0;
  padding: 0.2em 0 0.2em 14px;
  border-left: 3px solid var(--accent-soft);
  color: var(--fg-muted);
  font-style: italic;
}
.memo-body pre {
  background: var(--accent-soft);
  padding: 12px 14px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 0.6em 0;
  font-size: 0.88em;
  line-height: 1.55;
}
.memo-body pre code {
  background: transparent;
  color: var(--fg);
  padding: 0;
  border-radius: 0;
  font-size: 1em;
}
.memo-body hr {
  border: none;
  border-top: 1px dashed var(--border);
  margin: 1em 0;
}
.memo-body del {
  color: var(--fg-dim);
}
/* \u5F85\u529E\u5217\u8868\u6837\u5F0F\uFF08export-only\uFF0C\u548C Obsidian \u4E3B\u89C6\u56FE\u65E0\u5173\uFF09 */
.memo-body ul.task-list {
  list-style: none;
  padding-left: 0.2em;
}
.memo-body ul.task-list li.task-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 2px 0;
}
.memo-body ul.task-list li.task-item input[type="checkbox"] {
  margin: 0;
  margin-top: 0.32em;
  flex-shrink: 0;
  accent-color: var(--accent);
  cursor: default;
}
.memo-body ul.task-list li.task-item.is-checked > span {
  color: var(--fg-dim);
  text-decoration: line-through;
}

/* \u6807\u7B7E */
.memo-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}
.tag {
  display: inline-block;
  background: var(--tag-bg);
  color: var(--tag-fg);
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.02em;
}

/* \u9875\u811A */
.footer {
  margin-top: 72px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  text-align: center;
  color: var(--fg-dim);
  font-size: 12px;
  letter-spacing: 0.04em;
}
.footer a {
  color: var(--fg-muted);
  text-decoration: none;
  border-bottom: 1px solid var(--border);
}

/* \u6253\u5370\u53CB\u597D */
@media print {
  body { background: #fff; color: #000; }
  .memo { page-break-inside: avoid; box-shadow: none; border-color: #ddd; }
  .header { break-after: avoid; }
}

/* \u54CD\u5E94\u5F0F */
@media (max-width: 560px) {
  .container { padding: 32px 16px 48px; }
  .title { font-size: 26px; }
  .stat-strip { gap: 20px; }
  .memo { padding: 14px 16px; }
}
  `.trim();
  const byDate = /* @__PURE__ */ new Map();
  for (const m of memos) {
    const arr = byDate.get(m.date) ?? [];
    arr.push(m);
    byDate.set(m.date, arr);
  }
  const sortedDates = [...byDate.keys()].sort().reverse();
  const dayCount = sortedDates.length;
  const tagSet = /* @__PURE__ */ new Set();
  for (const m of memos) for (const t2 of m.tags) tagSet.add(t2);
  const locale = getCurrentLocale();
  const weekdayNamesCN = ["\u5468\u65E5", "\u5468\u4E00", "\u5468\u4E8C", "\u5468\u4E09", "\u5468\u56DB", "\u5468\u4E94", "\u5468\u516D"];
  const weekdayNamesEN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekdayNames = locale === "en-US" ? weekdayNamesEN : weekdayNamesCN;
  const getWeekday = (dateStr) => {
    const d = /* @__PURE__ */ new Date(dateStr + "T00:00:00");
    return weekdayNames[d.getDay()] ?? "";
  };
  const parts = [];
  parts.push("<!DOCTYPE html>");
  parts.push(`<html lang="${locale}">`);
  parts.push("<head>");
  parts.push('<meta charset="UTF-8">');
  parts.push(
    '<meta name="viewport" content="width=device-width, initial-scale=1">'
  );
  parts.push(`<title>Moments \xB7 ${escapeHtml(filterDesc)}</title>`);
  parts.push("<style>" + css + "</style>");
  parts.push("</head>");
  parts.push("<body>");
  parts.push('<div class="container">');
  parts.push('<header class="header">');
  parts.push(
    '<div class="brand"><span class="brand-dot"></span>MEMORIA</div>'
  );
  parts.push(`<h1 class="title">${escapeHtml(filterDesc)}</h1>`);
  parts.push(
    `<p class="subtitle">${t("export.exportedAt", { date: formatDateFull(now, locale) })}</p>`
  );
  parts.push('<div class="stat-strip">');
  parts.push(
    `<div class="stat-item"><div class="stat-num">${memos.length}</div><div class="stat-label">${t("stats.memos")}</div></div>`
  );
  parts.push(
    `<div class="stat-item"><div class="stat-num">${dayCount}</div><div class="stat-label">${t("stats.days")}</div></div>`
  );
  parts.push(
    `<div class="stat-item"><div class="stat-num">${tagSet.size}</div><div class="stat-label">${t("stats.tags")}</div></div>`
  );
  parts.push("</div>");
  parts.push("</header>");
  for (const date of sortedDates) {
    parts.push('<section class="day-group">');
    parts.push(
      `<div class="day-head"><span class="day-head-date">${date}</span><span class="day-head-weekday">${getWeekday(date)}</span><span class="day-head-count">${t("list.totalCount", { n: (byDate.get(date) ?? []).length })}</span></div>`
    );
    const items = byDate.get(date) ?? [];
    items.sort((a, b) => a.time.localeCompare(b.time));
    for (const m of items) {
      parts.push('<article class="memo">');
      parts.push(`<div class="memo-time">${m.time}</div>`);
      const contentClean = m.content.replace(/#[^\s#]+/g, "").replace(/\s+$/gm, "").trim();
      parts.push(
        '<div class="memo-body">' + renderInlineMd(contentClean) + "</div>"
      );
      if (m.tags.length > 0) {
        const tagsHtml = m.tags.map((t2) => `<span class="tag">#${escapeHtml(t2)}</span>`).join("");
        parts.push('<div class="memo-tags">' + tagsHtml + "</div>");
      }
      parts.push("</article>");
    }
    parts.push("</section>");
  }
  parts.push('<footer class="footer">');
  parts.push(
    `<a href="https://github.com/i-iooi-i/obsidian-memoria" target="_blank" rel="noopener">${t("export.footer")}</a>`
  );
  parts.push("</footer>");
  parts.push("</div>");
  parts.push("</body></html>");
  return parts.join("\n");
}
function formatDateFull(d, locale) {
  const wdCN = ["\u5468\u65E5", "\u5468\u4E00", "\u5468\u4E8C", "\u5468\u4E09", "\u5468\u56DB", "\u5468\u4E94", "\u5468\u516D"][d.getDay()];
  const wdEN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
  const pad3 = (n) => n.toString().padStart(2, "0");
  if (locale === "en-US") {
    return `${wdEN}, ${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} ${pad3(d.getHours())}:${pad3(d.getMinutes())}`;
  }
  return `${d.getFullYear()}\u5E74${d.getMonth() + 1}\u6708${d.getDate()}\u65E5 ${wdCN} ${pad3(d.getHours())}:${pad3(d.getMinutes())}`;
}
function renderInlineMd(text) {
  const lines = text.split("\n");
  const out = [];
  let i = 0;
  const renderInline = (raw) => {
    let html = escapeHtml(raw);
    html = html.replace(/`([^`\n]+?)`/g, "<code>$1</code>");
    html = html.replace(
      /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>'
    );
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "<em>$1</em>");
    html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");
    return html;
  };
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith("```")) {
      const buf = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      out.push(`<pre><code>${escapeHtml(buf.join("\n"))}</code></pre>`);
      continue;
    }
    const hMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (hMatch) {
      const lv = hMatch[1].length;
      out.push(`<h${lv}>${renderInline(hMatch[2])}</h${lv}>`);
      i++;
      continue;
    }
    if (/^\s*(---|\*\*\*|___)\s*$/.test(line)) {
      out.push("<hr>");
      i++;
      continue;
    }
    if (/^\s*>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^\s*>\s?/, ""));
        i++;
      }
      out.push(`<blockquote>${renderInline(buf.join("<br>"))}</blockquote>`);
      continue;
    }
    const isTask = /^\s*[-*+]\s+\[([ xX])\]\s+/.test(line);
    const isUl = /^\s*[-*+]\s+/.test(line) && !isTask;
    const isOl = /^\s*\d+\.\s+/.test(line);
    if (isTask) {
      const items = [];
      while (i < lines.length && /^\s*[-*+]\s+\[([ xX])\]\s+/.test(lines[i])) {
        const mm = lines[i].match(/^\s*[-*+]\s+\[([ xX])\]\s+(.*)$/);
        if (!mm) break;
        const checked = mm[1].toLowerCase() === "x";
        const body = renderInline(mm[2]);
        items.push(
          `<li class="task-item${checked ? " is-checked" : ""}"><input type="checkbox" disabled${checked ? " checked" : ""}><span>${body}</span></li>`
        );
        i++;
      }
      out.push(`<ul class="task-list">${items.join("")}</ul>`);
      continue;
    }
    if (isUl) {
      const items = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i]) && !/^\s*[-*+]\s+\[([ xX])\]\s+/.test(lines[i])) {
        const body = lines[i].replace(/^\s*[-*+]\s+/, "");
        items.push(`<li>${renderInline(body)}</li>`);
        i++;
      }
      out.push(`<ul>${items.join("")}</ul>`);
      continue;
    }
    if (isOl) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        const body = lines[i].replace(/^\s*\d+\.\s+/, "");
        items.push(`<li>${renderInline(body)}</li>`);
        i++;
      }
      out.push(`<ol>${items.join("")}</ol>`);
      continue;
    }
    if (trimmed === "") {
      i++;
      continue;
    }
    const pBuf = [line];
    i++;
    while (i < lines.length) {
      const nxt = lines[i];
      const nxtTrim = nxt.trim();
      if (nxtTrim === "" || nxtTrim.startsWith("```") || /^(#{1,6})\s+/.test(nxt) || /^\s*(---|\*\*\*|___)\s*$/.test(nxt) || /^\s*>\s?/.test(nxt) || /^\s*[-*+]\s+/.test(nxt) || /^\s*\d+\.\s+/.test(nxt)) {
        break;
      }
      pBuf.push(nxt);
      i++;
    }
    out.push(`<p>${pBuf.map(renderInline).join("<br>")}</p>`);
  }
  return out.join("");
}
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function renderJson(memos, filterDesc) {
  const data = {
    exported_by: "BrainCore Moments",
    exported_at: (/* @__PURE__ */ new Date()).toISOString(),
    filter: filterDesc,
    count: memos.length,
    memos: memos.map((m) => ({
      date: m.date,
      time: m.time,
      content: m.content,
      tags: m.tags,
      file: m.file
    }))
  };
  return JSON.stringify(data, null, 2);
}

// src/moments-memoria/share.ts
var import_obsidian6 = require("obsidian");
var import_dom_to_image_more = __toESM(require_dom_to_image_more_min());

// src/moments-memoria/export-layout.ts
var ELLIPSIS = "\u2026\u2026";
var COPY_SLOT_SELECTOR = [
  ".memos-share-card.is-text-only .memos-share-card-content"
].join(",");
function sourceLines(value) {
  const raw = value.replace(/\r\n?/g, "\n").replace(/[ \t]+$/gm, "").split("\n");
  while (raw.length && !raw[0].trim()) raw.shift();
  while (raw.length && !raw[raw.length - 1].trim()) raw.pop();
  return raw.map((text) => ({ text, blank: !text.length, prose: text.trim().length > 42 }));
}
function textMetrics(value) {
  const lines = sourceLines(value);
  return { chars: lines.reduce((sum, line) => sum + line.text.length, 0), lines: lines.length };
}
function copyDensity(value, thresholds = { mediumChars: 30, mediumLines: 4, longChars: 70, longLines: 7 }) {
  const metric = textMetrics(value);
  if (metric.chars > thresholds.longChars || metric.lines > thresholds.longLines) return "long";
  if (metric.chars > thresholds.mediumChars || metric.lines > thresholds.mediumLines) return "medium";
  return "short";
}
function splitLinesAt(lines, index) {
  const cut = Math.max(1, Math.min(lines.length - 1, index));
  return [lines.slice(0, cut), lines.slice(cut)];
}
function lineElement(line) {
  const el = document.createElement("div");
  el.className = `bc-fit-line${line.blank ? " is-blank" : ""}${line.prose ? " is-prose" : ""}`;
  el.textContent = line.blank ? "\xA0" : line.text;
  return el;
}
function proseUnits(line) {
  if (!line.prose) return [line];
  const sentences = line.text.match(/[^。！？；.!?]+[。！？；.!?]?/g)?.filter(Boolean) ?? [line.text];
  const units = [];
  for (const sentence of sentences) {
    if (sentence.length <= 42) {
      units.push({ text: sentence, blank: false, prose: true });
      continue;
    }
    for (let start = 0; start < sentence.length; start += 42) units.push({ text: sentence.slice(start, start + 42), blank: false, prose: true });
  }
  return units;
}
function columnCopyUnits(lines) {
  return lines.flatMap((line) => proseUnits(line));
}
function appendFlow(container, lines) {
  let prose = "";
  const flushProse = () => {
    if (!prose) return;
    container.appendChild(lineElement({ text: prose, blank: false, prose: true }));
    prose = "";
  };
  lines.forEach((line) => {
    if (line.prose) prose += line.text;
    else {
      flushProse();
      container.appendChild(lineElement(line));
    }
  });
  flushProse();
}
function columnElement(lines) {
  const column = document.createElement("div");
  column.className = "bc-fit-column";
  appendFlow(column, lines);
  return column;
}
function renderSingle(slot, lines, stage) {
  slot.replaceChildren();
  slot.dataset.fitStage = stage;
  const block = document.createElement("div");
  block.className = "bc-fit-block bc-fit-single";
  appendFlow(block, lines);
  slot.appendChild(block);
}
function renderColumns(slot, left, right, stage) {
  slot.replaceChildren();
  slot.dataset.fitStage = stage;
  const block = document.createElement("div");
  block.className = "bc-fit-block bc-fit-columns";
  block.append(columnElement(left), columnElement(right));
  slot.appendChild(block);
}
function elementFits(container) {
  const block = container.firstElementChild;
  if (!block || container.clientWidth < 2 || container.clientHeight < 2) return false;
  const box = container.getBoundingClientRect();
  const tolerance = 0.75;
  if (block.scrollWidth > container.clientWidth + tolerance || block.scrollHeight > container.clientHeight + tolerance) return false;
  for (const line of Array.from(block.querySelectorAll(".bc-fit-line"))) {
    const rect = line.getBoundingClientRect();
    if (rect.left < box.left - tolerance || rect.right > box.right + tolerance || rect.top < box.top - tolerance || rect.bottom > box.bottom + tolerance) return false;
  }
  return true;
}
function trySingle(slot, lines, stage) {
  renderSingle(slot, lines, stage);
  return elementFits(slot);
}
function tryBestColumns(slot, lines, stage) {
  const units = columnCopyUnits(lines);
  if (units.length < 2) return false;
  let best = null;
  for (let split = 1; split < units.length; split++) {
    const [left2, right2] = splitLinesAt(units, split);
    renderColumns(slot, left2, right2, stage);
    if (!elementFits(slot)) continue;
    const columns = slot.querySelectorAll(".bc-fit-column");
    const balance = Math.abs((columns[0]?.scrollHeight || 0) - (columns[1]?.scrollHeight || 0));
    if (!best || balance < best.balance) best = { split, balance };
  }
  if (!best) return false;
  const [left, right] = splitLinesAt(units, best.split);
  renderColumns(slot, left, right, stage);
  return true;
}
function renderTruncated(slot, lines) {
  const ellipsis = { text: ELLIPSIS, blank: false, prose: false };
  const units = columnCopyUnits(lines);
  for (let count = units.length - 1; count >= 0; count--) {
    const shown = [...units.slice(0, count), ellipsis];
    if (tryBestColumns(slot, shown, "truncated")) {
      slot.dataset.fitTruncated = "true";
      return;
    }
    renderSingle(slot, shown, "single-small");
    if (elementFits(slot)) {
      slot.dataset.fitStage = "truncated";
      slot.dataset.fitTruncated = "true";
      return;
    }
  }
  renderSingle(slot, [ellipsis], "truncated");
  slot.dataset.fitTruncated = "true";
}
function fitCopySlot(slot) {
  const source = slot.dataset.copySource ?? slot.textContent ?? "";
  slot.dataset.copySource = source;
  slot.classList.add("bc-fit-copy");
  slot.removeAttribute("data-fit-truncated");
  const lines = sourceLines(source);
  if (!lines.length) {
    slot.replaceChildren();
    slot.dataset.fitStage = "single-normal";
    return "single-normal";
  }
  if (trySingle(slot, lines, "single-normal")) return "single-normal";
  if (trySingle(slot, lines, "single-small")) return "single-small";
  if (tryBestColumns(slot, lines, "columns-normal")) return "columns-normal";
  if (tryBestColumns(slot, lines, "columns-small")) return "columns-small";
  renderTruncated(slot, lines);
  return "truncated";
}
function applySharedCopyLayout(root) {
  const slots = /* @__PURE__ */ new Set();
  if (root.matches(COPY_SLOT_SELECTOR)) slots.add(root);
  root.querySelectorAll(COPY_SLOT_SELECTOR).forEach((slot) => slots.add(slot));
  slots.forEach((slot) => {
    if (slot.closest(".memos-share-card.is-multi-share")) return;
    fitCopySlot(slot);
  });
}

// src/moments-memoria/share.ts
var SHARE_STYLES = [
  {
    id: "paper",
    label: "\u7EB8\u5F20\u767D",
    background: "#fdfdfd",
    cardBackground: "#fdfdfd",
    barBackground: "#a9322d",
    text: "#1a1a1c",
    muted: "#8a8a8e",
    barText: "#fffaf5",
    barMuted: "#f2d0c9",
    accent: "#7c3aed",
    border: "#c8c8cc",
    shadow: "0 28px 70px rgba(30,30,35,.12)",
    swatch: "#fdfdfd"
  },
  {
    id: "kraft",
    label: "\u725B\u76AE\u7EB8",
    background: "#f5ebd8",
    cardBackground: "#f5ebd8",
    barBackground: "#6d4626",
    text: "#3d2f1e",
    muted: "#8a6f4a",
    barText: "#fff9ed",
    barMuted: "#ecd6b4",
    accent: "#b45309",
    border: "#c8a876",
    shadow: "0 28px 64px rgba(96,65,28,.16)",
    swatch: "#c8a876"
  },
  {
    id: "mint",
    label: "\u8584\u8377\u7EFF",
    background: "#e8f5ec",
    cardBackground: "#e8f5ec",
    barBackground: "#1d5f48",
    text: "#1a3a28",
    muted: "#5a8368",
    barText: "#f5fff8",
    barMuted: "#c5e8d1",
    accent: "#059669",
    border: "#95c8a5",
    shadow: "0 28px 64px rgba(30,100,55,.15)",
    swatch: "#059669"
  },
  {
    id: "peach",
    label: "\u871C\u6843\u7C89",
    background: "#fde8e1",
    cardBackground: "#fde8e1",
    barBackground: "#59424b",
    text: "#3d1f18",
    muted: "#a77363",
    barText: "#fff8fa",
    barMuted: "#eed3d9",
    accent: "#ea580c",
    border: "#ecab93",
    shadow: "0 28px 64px rgba(155,65,35,.15)",
    swatch: "#ea580c"
  },
  {
    id: "sky",
    label: "\u6674\u7A7A\u84DD",
    background: "#e0f2fe",
    cardBackground: "#e0f2fe",
    barBackground: "#145d88",
    text: "#0c2a3e",
    muted: "#5a7a95",
    barText: "#f4fbff",
    barMuted: "#c3e4f6",
    accent: "#0284c7",
    border: "#84bcd8",
    shadow: "0 28px 64px rgba(20,95,135,.14)",
    swatch: "#0284c7"
  },
  {
    id: "lavender",
    label: "\u85B0\u8863\u8349",
    background: "#eee7fa",
    cardBackground: "#eee7fa",
    barBackground: "#503a76",
    text: "#2a1a3e",
    muted: "#7a6a95",
    barText: "#fbf8ff",
    barMuted: "#ddcff6",
    accent: "#7c3aed",
    border: "#bba9de",
    shadow: "0 28px 64px rgba(90,55,140,.14)",
    swatch: "#7c3aed"
  },
  { id: "midnight", label: "\u5348\u591C\u84DD", background: "#1a2238", cardBackground: "#1a2238", barBackground: "#c5d2f0", text: "#e8e8ea", muted: "#8a95b0", barText: "#15213d", barMuted: "#4e6086", accent: "#60a5fa", border: "#3a4568", shadow: "0 28px 70px rgba(0,0,0,.4)", swatch: "#1a2238" },
  { id: "charcoal", label: "\u6728\u70AD\u9ED1", background: "#1a1b1e", cardBackground: "#1a1b1e", barBackground: "#d6d2cb", text: "#e8e8ea", muted: "#8a8a90", barText: "#1b1c20", barMuted: "#62646a", accent: "#a78bfa", border: "#3a3a40", shadow: "0 28px 70px rgba(0,0,0,.46)", swatch: "#1a1b1e" }
];
var DEFAULT_SHARE_STYLE = SHARE_STYLES[0];
var SHARE_CARD_WIDTH = 900;
var SHARE_PREFERENCE_KEY = "braincore:moments:share-preference";
var MULTI_SHARE_MAX_ITEMS = 12;
var MULTI_SHARE_MAX_ESTIMATED_HEIGHT = 12e3;
var MULTI_SHARE_PAGE_SIZE = 100;
function throwIfShareAborted(signal) {
  if (signal?.aborted) throw new DOMException("Share generation cancelled", "AbortError");
}
function isShareAbort(error) {
  return error instanceof DOMException && error.name === "AbortError";
}
function estimateMemoShareHeight(memo) {
  const imageCount = (memo.content.match(/!\[\[[\s\S]*?\]\]|!\[[^\]]*\]\([^)]+\)|<img\b/gi) || []).length;
  const plain = memo.content.replace(/!\[\[[\s\S]*?\]\]|!\[[^\]]*\]\([^)]+\)|<img\b[^>]*>/gi, "");
  const sourceLines2 = Math.max(1, plain.split(/\r?\n/).length);
  return 96 + Math.max(sourceLines2, Math.ceil(plain.length / 34)) * 32 + imageCount * 520;
}
function memoToShareShape(memo) {
  return {
    content: memo.content,
    sourcePath: memo.file,
    createdLabel: memo.time,
    dayKey: memo.date
  };
}
function profileFromSettings(settings) {
  return {
    authorName: (settings.shareAuthorName || "").trim(),
    authorBio: (settings.shareAuthorBio || "").trim(),
    avatar: (settings.shareAvatar || "").trim()
  };
}
function resolveAvatarUrl(app, avatar) {
  const v = avatar.trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v) || /^data:/i.test(v)) return v;
  const file = app.vault.getAbstractFileByPath((0, import_obsidian6.normalizePath)(v.replace(/^\//, "")));
  if (file instanceof import_obsidian6.TFile) return app.vault.getResourcePath(file);
  return null;
}
function formatShareDate(dayKey) {
  return dayKey.replace(/-/g, ".");
}
function openMemoShareModal(app, memo, settings) {
  new MemoShareModal(app, [memoToShareShape(memo)], profileFromSettings(settings), settings.exportTheme).open();
}
function openMultiMemoSharePicker(app, memos, settings) {
  new MultiMemoSharePickerModal(app, memos, settings).open();
}
var MultiMemoSharePickerModal = class extends import_obsidian6.Modal {
  constructor(app, memos, settings) {
    super(app);
    __publicField(this, "memos");
    __publicField(this, "settings");
    __publicField(this, "selected", /* @__PURE__ */ new Set());
    __publicField(this, "confirmButton", null);
    __publicField(this, "countEl", null);
    __publicField(this, "budgetEl", null);
    __publicField(this, "listEl", null);
    __publicField(this, "query", "");
    __publicField(this, "visibleLimit", MULTI_SHARE_PAGE_SIZE);
    this.memos = memos;
    this.settings = settings;
  }
  onOpen() {
    this.modalEl.addClass("memos-multi-share-picker-modal");
    this.contentEl.empty();
    const header = this.contentEl.createDiv({ cls: "memos-multi-share-picker-header" });
    header.createEl("h2", { text: t("share.multiTitle") });
    const search = header.createEl("input", {
      cls: "memos-multi-share-picker-search",
      attr: { type: "search", placeholder: t("share.searchPlaceholder") }
    });
    search.addEventListener("input", () => {
      this.query = search.value.trim().toLowerCase();
      this.visibleLimit = MULTI_SHARE_PAGE_SIZE;
      this.renderRows();
    });
    const headerActions = header.createDiv({ cls: "memos-multi-share-picker-header-actions" });
    const selectAll = headerActions.createEl("button", { text: t("share.selectAll"), attr: { type: "button" } });
    const clear = headerActions.createEl("button", { text: t("share.clearSelection"), attr: { type: "button" } });
    this.listEl = this.contentEl.createDiv({ cls: "memos-multi-share-picker-list" });
    this.renderRows();
    selectAll.addEventListener("click", () => {
      this.selected.clear();
      let estimatedHeight = 0;
      for (const index of this.filteredIndexes()) {
        const memo = this.memos[index];
        const nextHeight = estimatedHeight + estimateMemoShareHeight(memo);
        if (this.selected.size >= MULTI_SHARE_MAX_ITEMS || nextHeight > MULTI_SHARE_MAX_ESTIMATED_HEIGHT) break;
        this.selected.add(index);
        estimatedHeight = nextHeight;
      }
      this.renderRows();
      this.updateSelectionState();
    });
    clear.addEventListener("click", () => {
      this.selected.clear();
      this.renderRows();
      this.updateSelectionState();
    });
    const footer = this.contentEl.createDiv({ cls: "memos-multi-share-picker-footer" });
    const summary = footer.createDiv({ cls: "memos-multi-share-picker-budget" });
    this.countEl = summary.createSpan();
    this.budgetEl = summary.createSpan({ cls: "memos-multi-share-picker-budget-detail" });
    this.confirmButton = footer.createEl("button", { cls: "mod-cta", text: t("share.createCombined"), attr: { type: "button" } });
    this.confirmButton.addEventListener("click", () => {
      const chosen = this.memos.filter((_, index) => this.selected.has(index));
      if (!chosen.length) return;
      this.close();
      new MemoShareModal(this.app, chosen.map(memoToShareShape), profileFromSettings(this.settings), this.settings.exportTheme).open();
    });
    this.updateSelectionState();
  }
  onClose() {
    this.contentEl.empty();
    this.modalEl.removeClass("memos-multi-share-picker-modal");
  }
  filteredIndexes() {
    const q = this.query;
    const indexes = [];
    for (let i = 0; i < this.memos.length; i++) {
      const memo = this.memos[i];
      if (!q) {
        indexes.push(i);
        continue;
      }
      const hay = `${memo.date} ${memo.time} ${memo.content}`.toLowerCase();
      if (hay.includes(q)) indexes.push(i);
    }
    return indexes;
  }
  renderRows() {
    if (!this.listEl) return;
    this.listEl.empty();
    const indexes = this.filteredIndexes();
    const shown = indexes.slice(0, this.visibleLimit);
    for (const index of shown) {
      const memo = this.memos[index];
      const row = this.listEl.createEl("label", { cls: "memos-multi-share-picker-row" });
      const checkbox = row.createEl("input", { attr: { type: "checkbox" } });
      checkbox.checked = this.selected.has(index);
      row.toggleClass("is-selected", checkbox.checked);
      const summary = row.createDiv({ cls: "memos-multi-share-picker-summary" });
      summary.createSpan({ cls: "memos-multi-share-picker-date", text: `${memo.date} ${memo.time}` });
      summary.createSpan({ cls: "memos-multi-share-picker-copy", text: memo.content.replace(/!\[\[[\s\S]*?\]\]|!\[[^\]]*\]\([^)]+\)|<img\b[^>]*>/gi, "[\u56FE\u7247]").replace(/\s+/g, " ").trim() || "[\u56FE\u7247]" });
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          const nextHeight = Array.from(this.selected).reduce((sum, selectedIndex) => sum + estimateMemoShareHeight(this.memos[selectedIndex]), 0) + estimateMemoShareHeight(memo);
          if (this.selected.size >= MULTI_SHARE_MAX_ITEMS || nextHeight > MULTI_SHARE_MAX_ESTIMATED_HEIGHT) {
            checkbox.checked = false;
            new import_obsidian6.Notice(t("share.budgetExceeded"));
          } else {
            this.selected.add(index);
          }
        } else {
          this.selected.delete(index);
        }
        row.toggleClass("is-selected", checkbox.checked);
        this.updateSelectionState();
      });
    }
    if (indexes.length > this.visibleLimit) {
      const remaining = indexes.length - this.visibleLimit;
      const more = this.listEl.createEl("button", {
        cls: "memos-multi-share-load-more",
        text: t("share.loadMore", { n: remaining }),
        attr: { type: "button" }
      });
      more.addEventListener("click", () => {
        this.visibleLimit += MULTI_SHARE_PAGE_SIZE;
        this.renderRows();
      });
    }
  }
  updateSelectionState() {
    const estimatedHeight = Array.from(this.selected).reduce((sum, index) => sum + estimateMemoShareHeight(this.memos[index]), 0);
    const overBudget = this.selected.size > MULTI_SHARE_MAX_ITEMS || estimatedHeight > MULTI_SHARE_MAX_ESTIMATED_HEIGHT;
    this.countEl?.setText(t("share.selectedCount", { n: this.selected.size }));
    this.budgetEl?.setText(t("share.budgetStatus", {
      height: Math.ceil(estimatedHeight / 100),
      maxHeight: Math.ceil(MULTI_SHARE_MAX_ESTIMATED_HEIGHT / 100),
      max: MULTI_SHARE_MAX_ITEMS
    }));
    this.budgetEl?.toggleClass("is-over-budget", overBudget);
    if (this.confirmButton) this.confirmButton.disabled = this.selected.size === 0 || overBudget;
  }
};
var ShareCopyFailureModal = class extends import_obsidian6.Modal {
  constructor(app, retry, save) {
    super(app);
    __publicField(this, "retry", retry);
    __publicField(this, "save", save);
  }
  onOpen() {
    this.titleEl.setText(t("share.copyFailedTitle"));
    this.contentEl.createEl("p", { text: t("share.copyFailedChoice") });
    const actions = this.contentEl.createDiv({ cls: "memos-share-copy-failure-actions" });
    const retryButton = actions.createEl("button", { cls: "mod-cta", text: t("share.retryCopy"), attr: { type: "button" } });
    const saveButton = actions.createEl("button", { text: t("share.saveInstead"), attr: { type: "button" } });
    const cancelButton = actions.createEl("button", { text: t("share.cancel"), attr: { type: "button" } });
    retryButton.addEventListener("click", () => {
      this.close();
      void this.retry();
    });
    saveButton.addEventListener("click", () => {
      this.close();
      void this.save();
    });
    cancelButton.addEventListener("click", () => this.close());
  }
  onClose() {
    this.contentEl.empty();
  }
};
var MemoShareModal = class extends import_obsidian6.Modal {
  constructor(app, memos, profile, exportTheme) {
    super(app);
    __publicField(this, "memos");
    __publicField(this, "profile");
    __publicField(this, "markdownRenderComponent", new import_obsidian6.Component());
    __publicField(this, "selectedStyle", DEFAULT_SHARE_STYLE);
    __publicField(this, "customTitle", "");
    __publicField(this, "previewWrapEl", null);
    __publicField(this, "styleListEl", null);
    __publicField(this, "titleInputEl", null);
    __publicField(this, "copyButtonEl", null);
    __publicField(this, "saveButtonEl", null);
    __publicField(this, "titlePreviewTimer", null);
    __publicField(this, "copyFlashTimer", null);
    __publicField(this, "previewRenderId", 0);
    __publicField(this, "previewAbortController", null);
    __publicField(this, "exportAbortController", null);
    __publicField(this, "progressEl", null);
    __publicField(this, "progressLabelEl", null);
    __publicField(this, "progressBarEl", null);
    __publicField(this, "lightboxEl", null);
    __publicField(this, "previewResizeObserver", null);
    /** 预生成导出图，避免点「保存」时长时间无响应，并保留用户手势以便系统分享进相册 */
    __publicField(this, "exportCacheKey", "");
    __publicField(this, "exportCacheBlob", null);
    __publicField(this, "exportWarmPromise", null);
    /** 切主题时防抖预生成，避免连点时反复 dom-to-image 卡主线程 */
    __publicField(this, "exportWarmTimer", null);
    __publicField(this, "onVisibilityChange", null);
    __publicField(this, "saveBusy", false);
    this.memos = memos;
    this.profile = profile;
    const preference = this.loadPreference();
    const requested = SHARE_STYLES.find((style) => style.id === preference.styleId || style.id === exportTheme);
    this.selectedStyle = requested || DEFAULT_SHARE_STYLE;
    this.customTitle = "";
  }
  preferenceKey() {
    const name = this.app.vault?.getName?.() || "default";
    return `${SHARE_PREFERENCE_KEY}::${name}`;
  }
  loadPreference() {
    try {
      const scoped = window.localStorage.getItem(this.preferenceKey());
      if (scoped) return JSON.parse(scoped);
      const legacy = window.localStorage.getItem(SHARE_PREFERENCE_KEY);
      return legacy ? JSON.parse(legacy) : {};
    } catch {
      return {};
    }
  }
  savePreference() {
    try {
      window.localStorage.setItem(this.preferenceKey(), JSON.stringify({ styleId: this.selectedStyle.id }));
    } catch {
    }
  }
  onOpen() {
    document.body.addClass("memos-share-modal-open");
    this.modalEl.addClass("memos-share-modal");
    this.markdownRenderComponent.load();
    this.onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (this.saveBusy) return;
        if (this.exportWarmTimer !== null) {
          window.clearTimeout(this.exportWarmTimer);
          this.exportWarmTimer = null;
        }
        if (this.exportWarmPromise) {
          this.exportAbortController?.abort();
          this.exportWarmPromise = null;
        }
      }
    };
    document.addEventListener("visibilitychange", this.onVisibilityChange);
    this.render();
  }
  onClose() {
    if (this.onVisibilityChange) {
      document.removeEventListener("visibilitychange", this.onVisibilityChange);
      this.onVisibilityChange = null;
    }
    if (this.titlePreviewTimer !== null) window.clearTimeout(this.titlePreviewTimer);
    if (this.copyFlashTimer !== null) window.clearTimeout(this.copyFlashTimer);
    if (this.exportWarmTimer !== null) window.clearTimeout(this.exportWarmTimer);
    this.exportWarmTimer = null;
    this.previewResizeObserver?.disconnect();
    this.previewResizeObserver = null;
    this.closeLightbox();
    this.previewAbortController?.abort();
    this.exportAbortController?.abort();
    this.exportCacheBlob = null;
    this.exportCacheKey = "";
    this.exportWarmPromise = null;
    this.markdownRenderComponent.unload();
    this.contentEl.empty();
    this.modalEl.removeClass("memos-share-modal");
    document.body.removeClass("memos-share-modal-open");
  }
  render() {
    this.contentEl.empty();
    const titleRow = document.createElement("div");
    titleRow.className = "memos-share-title-row";
    this.titleInputEl = titleRow.createEl("input", {
      cls: "memos-share-title-input",
      attr: {
        type: "text",
        placeholder: t("share.titlePlaceholder")
      }
    });
    this.titleInputEl.value = this.customTitle;
    this.titleInputEl.addEventListener("input", () => {
      this.customTitle = this.titleInputEl?.value ?? "";
      this.savePreference();
      this.invalidateExportCache();
      if (this.titlePreviewTimer !== null) window.clearTimeout(this.titlePreviewTimer);
      this.titlePreviewTimer = window.setTimeout(() => {
        this.titlePreviewTimer = null;
        void this.renderPreview();
      }, 140);
    });
    const scrollEl = this.contentEl.createDiv({ cls: "memos-share-scroll" });
    this.previewWrapEl = scrollEl.createDiv({ cls: "memos-share-preview-wrap", attr: { title: t("share.previewHint") } });
    this.previewWrapEl.addEventListener("click", () => {
      void this.previewImage();
    });
    this.previewResizeObserver?.disconnect();
    this.previewResizeObserver = new ResizeObserver(() => {
      const previewEl = this.previewWrapEl?.querySelector(".memos-share-preview");
      const previewInnerEl = previewEl?.querySelector(".memos-share-preview-inner");
      if (previewEl instanceof HTMLElement && previewInnerEl instanceof HTMLElement) {
        this.fitPreviewToContainer(previewEl, previewInnerEl);
      }
    });
    this.previewResizeObserver.observe(this.previewWrapEl);
    this.styleListEl = scrollEl.createDiv({ cls: "memos-share-style-list" });
    this.renderStyleList();
    scrollEl.appendChild(titleRow);
    this.progressEl = this.contentEl.createDiv({ cls: "memos-share-generation-progress" });
    this.progressEl.hidden = true;
    this.progressLabelEl = this.progressEl.createSpan();
    this.progressBarEl = this.progressEl.createEl("progress", { attr: { max: "1", value: "0" } });
    const cancelGeneration = this.progressEl.createEl("button", { text: t("share.cancelGeneration"), attr: { type: "button" } });
    cancelGeneration.addEventListener("click", () => {
      this.previewAbortController?.abort();
      this.exportAbortController?.abort();
    });
    const actionsEl = this.contentEl.createDiv({ cls: "memos-share-actions" });
    const bindAction = (button, onClick) => {
      button.addEventListener("pointerdown", () => {
        button.addClass("is-pressed");
      });
      button.addEventListener("pointerup", () => {
        window.setTimeout(() => {
          if (button.isConnected) button.removeClass("is-pressed");
        }, 180);
      });
      button.addEventListener("pointercancel", () => button.removeClass("is-pressed"));
      button.addEventListener("click", () => {
        button.addClass("is-pressed");
        void onClick();
      });
    };
    const previewButtonEl = actionsEl.createEl("button", {
      cls: "memos-share-action",
      text: t("share.previewImage"),
      attr: { type: "button" }
    });
    bindAction(previewButtonEl, async () => {
      previewButtonEl.addClass("is-busy");
      const prev = previewButtonEl.getText();
      previewButtonEl.setText("\u9884\u89C8\u4E2D\u2026");
      try {
        await this.previewImage();
      } finally {
        if (previewButtonEl.isConnected) {
          previewButtonEl.removeClass("is-busy");
          previewButtonEl.setText(prev);
          previewButtonEl.removeClass("is-pressed");
        }
      }
    });
    const copyButtonEl = actionsEl.createEl("button", {
      cls: "memos-share-action",
      text: t("share.copyImage"),
      attr: { type: "button" }
    });
    this.copyButtonEl = copyButtonEl;
    bindAction(copyButtonEl, async () => {
      copyButtonEl.addClass("is-busy");
      copyButtonEl.setText("\u590D\u5236\u4E2D\u2026");
      try {
        await this.copyImage();
      } finally {
        if (copyButtonEl.isConnected && !copyButtonEl.hasClass("is-success")) {
          copyButtonEl.removeClass("is-busy");
          if (copyButtonEl.getText() === "\u590D\u5236\u4E2D\u2026") {
            copyButtonEl.setText(t("share.copyImage"));
          }
          copyButtonEl.removeClass("is-pressed");
        }
      }
    });
    const saveButtonEl = actionsEl.createEl("button", {
      cls: "memos-share-action",
      text: t("share.saveImage"),
      attr: { type: "button" }
    });
    this.saveButtonEl = saveButtonEl;
    bindAction(saveButtonEl, () => this.saveImage());
    void this.renderPreview();
    this.scheduleWarmExportCache(import_obsidian6.Platform.isMobile ? 700 : 280);
  }
  renderStyleList() {
    if (!this.styleListEl) return;
    this.styleListEl.empty();
    SHARE_STYLES.forEach((style) => {
      const buttonEl = this.styleListEl?.createEl("button", {
        cls: `memos-share-style-button${this.selectedStyle.id === style.id ? " is-active" : ""}`,
        attr: {
          type: "button",
          "aria-pressed": String(this.selectedStyle.id === style.id),
          "aria-label": `\u9009\u62E9${style.label}\u4E3B\u9898`
        }
      });
      if (!buttonEl) return;
      buttonEl.dataset.shareStyleId = style.id;
      buttonEl.style.setProperty("--share-swatch", style.swatch);
      buttonEl.empty();
      buttonEl.createSpan({ cls: "memos-share-style-swatch" });
      buttonEl.createSpan({ text: style.label });
      buttonEl.addEventListener("click", () => {
        this.selectedStyle = style;
        this.savePreference();
        this.updateStyleListActive();
        this.invalidateExportCache();
        if (!this.updatePreviewStyle()) void this.renderPreview();
        else if (!import_obsidian6.Platform.isMobile) this.scheduleWarmExportCache(450);
      });
    });
  }
  updateStyleListActive() {
    if (!this.styleListEl) return;
    this.styleListEl.querySelectorAll(".memos-share-style-button").forEach((buttonEl) => {
      if (!(buttonEl instanceof HTMLElement)) return;
      const isActive = buttonEl.dataset.shareStyleId === this.selectedStyle.id;
      buttonEl.toggleClass("is-active", isActive);
      buttonEl.setAttribute("aria-pressed", String(isActive));
    });
  }
  async renderPreview() {
    if (!this.previewWrapEl) return;
    this.previewAbortController?.abort();
    const controller = new AbortController();
    this.previewAbortController = controller;
    const renderId = ++this.previewRenderId;
    const previousPreviewEl = this.previewWrapEl.querySelector(".memos-share-preview");
    const previousHeight = previousPreviewEl instanceof HTMLElement ? previousPreviewEl.offsetHeight : this.previewWrapEl.offsetHeight;
    if (previousHeight > 0) {
      this.previewWrapEl.style.minHeight = `${previousHeight}px`;
    }
    const previewEl = this.previewWrapEl.createDiv({ cls: "memos-share-preview" });
    const previewInnerEl = previewEl.createDiv({ cls: "memos-share-preview-inner" });
    const avatarUrl = resolveAvatarUrl(this.app, this.profile.avatar);
    const previewCard = new DOMParser().parseFromString(
      buildShareCardHtml(
        this.memos,
        this.selectedStyle,
        "preview",
        this.profile,
        avatarUrl,
        this.customTitle
      ),
      "text/html"
    );
    previewInnerEl.append(...Array.from(previewCard.body.childNodes));
    previewEl.setCssStyles({
      position: "absolute",
      visibility: "hidden",
      pointerEvents: "none"
    });
    try {
      await renderShareContents(this.app, previewInnerEl, this.memos, this.markdownRenderComponent, {
        signal: controller.signal,
        onProgress: ({ current, total }) => this.updateGenerationProgress(t("share.progressLayout"), current, total)
      });
      throwIfShareAborted(controller.signal);
      applySharedCopyLayout(previewInnerEl);
    } catch (error) {
      previewEl.remove();
      if (!isShareAbort(error)) console.error("Failed to render share preview", error);
      return;
    } finally {
      if (this.previewAbortController === controller) {
        this.previewAbortController = null;
        this.hideGenerationProgress();
      }
    }
    await new Promise((resolve) => window.requestAnimationFrame(() => resolve()));
    if (renderId !== this.previewRenderId || !this.previewWrapEl) {
      previewEl.remove();
      return;
    }
    this.fitPreviewToContainer(previewEl, previewInnerEl);
    previewEl.setCssStyles({
      position: "",
      visibility: "",
      pointerEvents: ""
    });
    const nextHeight = previewEl.offsetHeight;
    if (nextHeight > 0) {
      this.previewWrapEl.style.minHeight = `${nextHeight}px`;
    }
    Array.from(this.previewWrapEl.querySelectorAll(".memos-share-preview")).forEach((node) => {
      if (node !== previewEl) node.remove();
    });
    this.scheduleWarmExportCache(import_obsidian6.Platform.isMobile ? 500 : 200);
  }
  fitPreviewToContainer(previewEl, previewInnerEl) {
    if (!this.previewWrapEl) return;
    const wrapStyle = window.getComputedStyle(this.previewWrapEl);
    const horizontalPadding = Number.parseFloat(wrapStyle.paddingLeft) + Number.parseFloat(wrapStyle.paddingRight);
    const availableWidth = Math.max(160, this.previewWrapEl.clientWidth - horizontalPadding);
    const maxScale = this.app.isMobile ? 1 : 0.8;
    const minScale = this.app.isMobile ? 0.28 : 0.38;
    const scale = Math.min(maxScale, Math.max(minScale, availableWidth / SHARE_CARD_WIDTH));
    const cardEl = previewInnerEl.querySelector(".memos-share-card");
    const cardHeight = cardEl instanceof HTMLElement ? cardEl.offsetHeight : 0;
    previewEl.style.width = `${SHARE_CARD_WIDTH * scale}px`;
    previewEl.style.height = cardHeight ? `${cardHeight * scale}px` : "";
    previewInnerEl.style.transform = `scale(${scale})`;
  }
  async copyImage() {
    let blob = null;
    try {
      blob = await this.getExportBlob({ label: t("share.progressCopy"), silent: false });
      await this.writeBlobToClipboard(blob);
      new import_obsidian6.Notice(t("share.imageCopied"));
      this.flashCopyButton();
    } catch (error) {
      if (isShareAbort(error)) {
        new import_obsidian6.Notice(t("share.generationCancelled"));
        return;
      }
      console.error("Failed to copy share image", error);
      new ShareCopyFailureModal(
        this.app,
        async () => {
          if (blob) await this.retryClipboard(blob);
          else await this.copyImage();
        },
        async () => {
          if (blob) await this.downloadBlob(blob);
          else await this.saveImage();
        }
      ).open();
    }
  }
  async writeBlobToClipboard(blob) {
    if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") throw new Error("Image clipboard is unavailable");
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
  }
  async retryClipboard(blob) {
    try {
      await this.writeBlobToClipboard(blob);
      new import_obsidian6.Notice(t("share.imageCopied"));
      this.flashCopyButton();
    } catch (error) {
      console.error("Failed to retry share image copy", error);
      new ShareCopyFailureModal(this.app, () => this.retryClipboard(blob), () => this.downloadBlob(blob)).open();
    }
  }
  closeLightbox() {
    this.lightboxEl?.remove();
    this.lightboxEl = null;
  }
  attachLightboxChrome(layer, frame, close) {
    layer.addEventListener("click", (event) => {
      if (event.target === layer) close();
    });
    const button = frame.createEl("button", {
      cls: "memos-share-lightbox-close",
      text: "\xD7",
      attr: { type: "button", "aria-label": "\u5173\u95ED\u9884\u89C8" }
    });
    frame.insertBefore(button, frame.firstChild);
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      close();
    });
    const actions = frame.createDiv({ cls: "memos-share-lightbox-actions" });
    actions.addEventListener("click", (event) => event.stopPropagation());
    const copyButtonEl = actions.createEl("button", {
      cls: "memos-share-action",
      text: t("share.copyImage"),
      attr: { type: "button" }
    });
    copyButtonEl.addEventListener("click", () => {
      close();
      void this.copyImage();
    });
    const saveButtonEl = actions.createEl("button", {
      cls: "memos-share-action",
      text: t("share.saveImage"),
      attr: { type: "button" }
    });
    saveButtonEl.addEventListener("click", () => {
      close();
      void this.saveImage();
    });
  }
  openLightboxFromCard(cardEl) {
    this.closeLightbox();
    const layer = document.body.createDiv({ cls: "memos-share-lightbox" });
    this.lightboxEl = layer;
    const frame = layer.createDiv({ cls: "memos-share-lightbox-frame" });
    const stage = frame.createDiv({ cls: "memos-share-lightbox-stage" });
    const scale = Math.min(1, Math.max(0.2, (Math.min(window.innerWidth, 900) - 32) / SHARE_CARD_WIDTH));
    const cardHeight = cardEl.offsetHeight;
    stage.style.width = `${SHARE_CARD_WIDTH * scale}px`;
    stage.style.height = cardHeight ? `${cardHeight * scale}px` : "";
    frame.style.width = stage.style.width;
    this.attachLightboxChrome(layer, frame, () => this.closeLightbox());
    stage.addEventListener("click", (event) => event.stopPropagation());
    window.requestAnimationFrame(() => {
      if (this.lightboxEl !== layer) return;
      const clone = cardEl.cloneNode(true);
      clone.addClass("memos-share-lightbox-card");
      clone.style.transform = `scale(${scale})`;
      stage.appendChild(clone);
    });
  }
  async previewImage() {
    let cardEl = this.previewWrapEl?.querySelector(".memos-share-card");
    if (!(cardEl instanceof HTMLElement) || cardEl.offsetHeight <= 0) {
      new import_obsidian6.Notice("\u6B63\u5728\u51C6\u5907\u9884\u89C8\u2026");
      await this.renderPreview();
      cardEl = this.previewWrapEl?.querySelector(".memos-share-card");
    }
    if (cardEl instanceof HTMLElement && cardEl.offsetHeight > 0) {
      this.openLightboxFromCard(cardEl);
      return;
    }
    new import_obsidian6.Notice("\u9884\u89C8\u8FD8\u6CA1\u6392\u597D\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5");
  }
  updatePreviewStyle() {
    if (!this.previewWrapEl) return false;
    const cardEl = this.previewWrapEl.querySelector(".memos-share-card");
    if (!(cardEl instanceof HTMLElement)) return false;
    this.applyStyleToShareCard(cardEl, this.selectedStyle);
    return true;
  }
  applyStyleToShareCard(cardEl, style) {
    cardEl.style.setProperty("--share-bg", style.cardBackground);
    const isPaper = style.id === "paper";
    cardEl.style.setProperty("--share-bar-bg", isPaper ? "#111" : "#fff");
    cardEl.style.setProperty("--share-text", style.text);
    cardEl.style.setProperty("--share-muted", style.muted);
    cardEl.style.setProperty("--share-bar-text", isPaper ? "#fff" : "#111");
    cardEl.style.setProperty("--share-bar-muted", isPaper ? "rgba(255,255,255,.68)" : "#737373");
    cardEl.style.setProperty("--share-accent", style.accent);
    cardEl.style.setProperty("--share-border", style.border);
    cardEl.style.setProperty("--share-shadow", style.shadow);
    cardEl.className = cardEl.className.replace(/share-style-[a-z-]+/g, "").trim();
    cardEl.addClass(`share-style-${style.id}`);
  }
  flashCopyButton() {
    const button = this.copyButtonEl;
    if (!button) return;
    const original = t("share.copyImage");
    button.setText(t("share.imageCopied"));
    button.addClass("is-success");
    if (this.copyFlashTimer !== null) window.clearTimeout(this.copyFlashTimer);
    this.copyFlashTimer = window.setTimeout(() => {
      this.copyFlashTimer = null;
      if (!button.isConnected) return;
      button.setText(original);
      button.removeClass("is-success");
    }, 1300);
  }
  /** 点击瞬间着色反馈（三钮平等，不再永久高亮「复制」） */
  pulseActionButton(button) {
    button.addClass("is-pressed");
    window.setTimeout(() => {
      if (button.isConnected) button.removeClass("is-pressed");
    }, 220);
  }
  async saveImage() {
    if (this.saveBusy) return;
    this.saveBusy = true;
    const saveBtn = this.saveButtonEl;
    const originalLabel = t("share.saveImage");
    try {
      const key = this.currentExportKey();
      const hadCache = Boolean(this.exportCacheBlob && this.exportCacheKey === key);
      if (!hadCache && saveBtn) {
        saveBtn.setText("\u751F\u6210\u4E2D\u2026");
        saveBtn.addClass("is-busy");
        new import_obsidian6.Notice("\u6B63\u5728\u751F\u6210\u56FE\u7247\u2026");
      }
      const blob = await this.getExportBlob({ silent: true });
      if (saveBtn) {
        saveBtn.removeClass("is-busy");
        saveBtn.setText(originalLabel);
      }
      if (!hadCache && import_obsidian6.Platform.isMobile) {
        const shared = await this.tryShareFiles(blob);
        if (shared) {
          if (saveBtn) saveBtn.removeClass("is-primary");
          return;
        }
        if (saveBtn) {
          saveBtn.setText("\u518D\u70B9\u4FDD\u5B58\u5230\u76F8\u518C");
          saveBtn.addClass("is-primary");
        }
        new import_obsidian6.Notice("\u5DF2\u5C31\u7EEA\uFF0C\u518D\u70B9\u4E00\u6B21\u5373\u53EF\u4FDD\u5B58\u5230\u76F8\u518C");
        return;
      }
      if (saveBtn) {
        saveBtn.setText("\u4FDD\u5B58\u4E2D\u2026");
        saveBtn.addClass("is-busy");
      }
      await this.saveBlobToPhotos(blob);
      if (saveBtn) {
        saveBtn.removeClass("is-busy");
        saveBtn.removeClass("is-primary");
        saveBtn.setText(originalLabel);
      }
    } catch (error) {
      if (saveBtn) {
        saveBtn.removeClass("is-busy");
        saveBtn.removeClass("is-primary");
        saveBtn.setText(originalLabel);
      }
      if (isShareAbort(error)) {
        new import_obsidian6.Notice(t("share.generationCancelled"));
        return;
      }
      console.error("Failed to save share image", error);
      new import_obsidian6.Notice(t("share.saveFailed"));
    } finally {
      this.saveBusy = false;
    }
  }
  shareFileName() {
    const firstMemo = this.memos[0];
    return `memo-share-${firstMemo?.dayKey || "moments"}-${this.memos.length > 1 ? `${this.memos.length}-items` : (firstMemo?.createdLabel || "").replace(/[:\s]/g, "")}.png`;
  }
  currentExportKey() {
    return [
      this.selectedStyle.id,
      this.customTitle,
      String(this.memos.length),
      ...this.memos.map((m) => `${m.dayKey}|${m.createdLabel}|${m.content.length}`)
    ].join("::");
  }
  invalidateExportCache() {
    this.exportCacheKey = "";
    this.exportCacheBlob = null;
    if (this.exportWarmTimer !== null) {
      window.clearTimeout(this.exportWarmTimer);
      this.exportWarmTimer = null;
    }
    this.exportAbortController?.abort();
    this.exportWarmPromise = null;
  }
  /** 延迟预热导出图：连点主题只保留最后一次 */
  scheduleWarmExportCache(delayMs) {
    if (document.visibilityState === "hidden") return;
    if (this.exportWarmTimer !== null) window.clearTimeout(this.exportWarmTimer);
    this.exportWarmTimer = window.setTimeout(() => {
      this.exportWarmTimer = null;
      this.warmExportCache();
    }, Math.max(0, delayMs));
  }
  /** 预览就绪后延迟后台生成，避免与首次点击抢主线程 */
  warmExportCache() {
    if (document.visibilityState === "hidden") return;
    const key = this.currentExportKey();
    if (this.exportCacheBlob && this.exportCacheKey === key) return;
    const warmKey = key;
    const start = () => {
      if (document.visibilityState === "hidden") return;
      if (this.currentExportKey() !== warmKey) return;
      if (this.exportCacheBlob && this.exportCacheKey === warmKey) return;
      this.exportWarmPromise = (async () => {
        try {
          const blob = await this.createImageBlob("", { silent: true, fast: true });
          if (this.currentExportKey() === warmKey) {
            this.exportCacheKey = warmKey;
            this.exportCacheBlob = blob;
          }
          return blob;
        } finally {
          this.exportWarmPromise = null;
        }
      })();
    };
    const ric = window.requestIdleCallback;
    if (typeof ric === "function") {
      ric(() => start(), { timeout: import_obsidian6.Platform.isMobile ? 1600 : 900 });
    } else {
      window.setTimeout(start, import_obsidian6.Platform.isMobile ? 480 : 320);
    }
  }
  async getExportBlob(opts = {}) {
    const key = this.currentExportKey();
    if (this.exportCacheBlob && this.exportCacheKey === key) return this.exportCacheBlob;
    if (this.exportWarmPromise) {
      try {
        await this.exportWarmPromise;
        if (this.exportCacheBlob && this.exportCacheKey === key) return this.exportCacheBlob;
      } catch {
      }
    }
    const blob = await this.createImageBlob(opts.label ?? "", {
      silent: opts.silent ?? true,
      fast: true
    });
    this.exportCacheKey = key;
    this.exportCacheBlob = blob;
    return blob;
  }
  async downloadBlob(blob) {
    const url = URL.createObjectURL(blob);
    const linkEl = document.createElement("a");
    linkEl.href = url;
    linkEl.download = this.shareFileName();
    linkEl.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1e3);
    new import_obsidian6.Notice(t("share.imageSaved"));
  }
  /** 手机：系统分享 → 选「存储图像」进相册；桌面：下载。 */
  async tryShareFiles(blob) {
    const fileName = this.shareFileName();
    const file = new File([blob], fileName, { type: blob.type || "image/png" });
    const nav = navigator;
    const shareData = { files: [file], title: fileName };
    const canShareFiles = typeof nav.share === "function" && (!nav.canShare || nav.canShare(shareData));
    if (!canShareFiles) return false;
    try {
      await nav.share(shareData);
      new import_obsidian6.Notice("\u8BF7\u70B9\u300C\u5B58\u50A8\u56FE\u50CF\u300D\u4FDD\u5B58\u5230\u76F8\u518C");
      return true;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return true;
      return false;
    }
  }
  async saveBlobToPhotos(blob) {
    if (await this.tryShareFiles(blob)) return;
    if (import_obsidian6.Platform.isMobile) {
      try {
        const dataUrl = await blobToDataUrl(blob);
        const opened = window.open(dataUrl, "_blank");
        if (opened) {
          new import_obsidian6.Notice("\u5DF2\u6253\u5F00\u56FE\u7247\uFF0C\u957F\u6309\u9009\u62E9\u300C\u5B58\u50A8\u56FE\u50CF\u300D\u4FDD\u5B58\u5230\u76F8\u518C");
          return;
        }
      } catch {
      }
    }
    await this.downloadBlob(blob);
  }
  updateGenerationProgress(label, current, total) {
    if (!label) {
      this.hideGenerationProgress();
      return;
    }
    if (!this.progressEl || !this.progressLabelEl || !this.progressBarEl) return;
    this.progressEl.hidden = false;
    this.progressLabelEl.setText(`${label} ${Math.min(current, total)}/${total}`);
    this.progressBarEl.max = Math.max(1, total);
    this.progressBarEl.value = Math.min(current, total);
  }
  hideGenerationProgress() {
    if (this.progressEl) this.progressEl.hidden = true;
  }
  async createImageBlob(label, opts = {}) {
    this.exportAbortController?.abort();
    const controller = new AbortController();
    this.exportAbortController = controller;
    const silent = Boolean(opts.silent) || !label;
    try {
      return await exportShareCardDomToBlob(
        this.app,
        this.memos,
        this.selectedStyle,
        this.markdownRenderComponent,
        this.profile,
        this.customTitle,
        {
          signal: controller.signal,
          fast: Boolean(opts.fast) || silent,
          onProgress: silent ? void 0 : ({ current, total }) => this.updateGenerationProgress(label, current, total)
        }
      );
    } finally {
      if (this.exportAbortController === controller) {
        this.exportAbortController = null;
        this.hideGenerationProgress();
      }
    }
  }
};
function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("read failed"));
    reader.readAsDataURL(blob);
  });
}
function sanitizeShareContent(root) {
  root.querySelectorAll(".internal-embed, .markdown-embed, .markdown-embed-content, .callout").forEach((el) => {
    if (el instanceof HTMLElement) {
      el.style.border = "none";
      el.style.boxShadow = "none";
      el.style.background = "transparent";
      el.style.padding = "0";
      el.style.margin = "0";
    }
  });
  root.querySelectorAll("hr").forEach((el) => el.remove());
}
async function exportShareCardDomToBlob(app, memos, style, component, profile, customTitle, options = {}) {
  const surfaceEl = document.createElement("div");
  surfaceEl.addClass("memos-share-export-surface");
  surfaceEl.style.setProperty("--share-export-bg", style.background);
  const avatarUrl = resolveAvatarUrl(app, profile.avatar);
  const exportCard = new DOMParser().parseFromString(
    buildShareCardHtml(memos, style, "image", profile, avatarUrl, customTitle),
    "text/html"
  );
  surfaceEl.append(...Array.from(exportCard.body.childNodes));
  const cardEl = surfaceEl.querySelector(".memos-share-card");
  if (!(cardEl instanceof HTMLElement) || !cardEl.querySelector(".memos-share-card-content")) {
    throw new Error("Share card content element was not created.");
  }
  document.body.appendChild(surfaceEl);
  try {
    window.getSelection()?.removeAllRanges();
    await renderShareContents(app, surfaceEl, memos, component, options);
    throwIfShareAborted(options.signal);
    await waitForDomToSettle(surfaceEl, options.signal, options.fast);
    throwIfShareAborted(options.signal);
    applySharedCopyLayout(surfaceEl);
    await new Promise((resolve) => requestAnimationFrame(() => resolve()));
    const rect = surfaceEl.getBoundingClientRect();
    const blob = await import_dom_to_image_more.default.toBlob(surfaceEl, {
      width: Math.ceil(rect.width),
      height: Math.ceil(rect.height),
      cacheBust: false,
      imagePlaceholder: TRANSPARENT_IMAGE_PLACEHOLDER
    });
    throwIfShareAborted(options.signal);
    return blob;
  } finally {
    surfaceEl.remove();
  }
}
async function waitForDomToSettle(rootEl, signal, fast = false) {
  throwIfShareAborted(signal);
  const fontBudgetMs = fast ? import_obsidian6.Platform.isMobile ? 180 : 400 : import_obsidian6.Platform.isMobile ? 600 : 2500;
  const imageWaitMs = fast ? import_obsidian6.Platform.isMobile ? 900 : 1600 : import_obsidian6.Platform.isMobile ? 4e3 : 8e3;
  await Promise.race([
    Promise.resolve(document.fonts?.ready).catch(() => void 0),
    new Promise((resolve) => window.setTimeout(resolve, fontBudgetMs))
  ]);
  const images = Array.from(rootEl.querySelectorAll("img"));
  await Promise.all(images.map((image) => waitForShareImage(image, signal, imageWaitMs)));
  throwIfShareAborted(signal);
  await new Promise((resolve) => window.requestAnimationFrame(() => resolve()));
}
function waitForShareImage(image, signal, timeoutMs) {
  if (image.complete) return Promise.resolve();
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      image.removeEventListener("load", finish);
      image.removeEventListener("error", finish);
      signal?.removeEventListener("abort", finish);
      resolve();
    };
    const timer = window.setTimeout(finish, timeoutMs);
    image.addEventListener("load", finish, { once: true });
    image.addEventListener("error", finish, { once: true });
    signal?.addEventListener("abort", finish, { once: true });
  });
}
var TRANSPARENT_IMAGE_PLACEHOLDER = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";
function buildShareCardHtml(memos, style, mode, profile, avatarUrl, customTitle) {
  const scale = mode === "preview" ? "memos-share-card-preview" : "memos-share-card-image";
  const memo = memos[0];
  const allContent = memos.map((item) => item.content).join("\n");
  const hasImage = /!\[\[[\s\S]*?\]\]|!\[[^\]]*\]\([^)]+\)|<img\b/i.test(allContent);
  const contentMode = hasImage ? "has-media" : "is-text-only";
  const plainText = allContent.replace(/!\[\[[\s\S]*?\]\]|!\[[^\]]*\]\([^)]+\)|<img\b[^>]*>/gi, "").trim();
  const density = `is-copy-${copyDensity(plainText, { mediumChars: 60, mediumLines: 5, longChars: 145, longLines: 10 })}`;
  const name = profile.authorName || "Moments";
  const leftTitle = (customTitle || "").trim() || profile.authorBio || "";
  const dateLabel = formatShareDate(memo.dayKey);
  const avatarHtml = avatarUrl ? `<img class="memos-share-leica-avatar" src="${escapeHtml2(avatarUrl)}" alt="" />` : `<div class="memos-share-leica-avatar is-placeholder" aria-hidden="true">${escapeHtml2(name.slice(0, 1) || "M")}</div>`;
  const leftHtml = leftTitle ? `<div class="memos-share-leica-left"><div class="memos-share-leica-title">${escapeHtml2(leftTitle)}</div></div>` : `<div class="memos-share-leica-left is-empty"></div>`;
  const isPaper = style.id === "paper";
  const barBackground = isPaper ? "#111" : "#fff";
  const barText = isPaper ? "#fff" : "#111";
  const barMuted = isPaper ? "rgba(255,255,255,.68)" : "#737373";
  return [
    `<section class="memos-share-card ${scale} ${contentMode} ${density}${memos.length > 1 ? " is-multi-share" : ""} share-style-${style.id}" style="--share-bg:${style.cardBackground};--share-bar-bg:${barBackground};--share-text:${style.text};--share-muted:${style.muted};--share-bar-text:${barText};--share-bar-muted:${barMuted};--share-accent:${style.accent};--share-border:${style.border};--share-shadow:${style.shadow};">`,
    '<div class="memos-share-card-body">',
    ...memos.map((item, index) => `<section class="memos-share-entry"><div class="memos-share-entry-date">${escapeHtml2(formatShareDate(item.dayKey))} \xB7 ${escapeHtml2(item.createdLabel)}</div><article class="memos-share-card-content markdown-rendered" data-share-index="${index}"></article></section>`),
    "</div>",
    '<div class="memos-share-leica" role="contentinfo">',
    leftHtml,
    '<div class="memos-share-leica-right">',
    avatarHtml,
    '<div class="memos-share-leica-meta">',
    `<div class="memos-share-leica-name">${escapeHtml2(name)}</div>`,
    `<div class="memos-share-leica-datetime"><span>${escapeHtml2(dateLabel)}</span><span class="memos-share-leica-dot">\xB7</span><span>${escapeHtml2(memo.createdLabel)}</span></div>`,
    "</div>",
    "</div>",
    "</div>",
    "</section>"
  ].join("");
}
async function renderShareContents(app, root, memos, component, options = {}) {
  const contentEls = Array.from(root.querySelectorAll(".memos-share-card-content"));
  options.onProgress?.({ current: 0, total: contentEls.length });
  for (let index = 0; index < contentEls.length; index++) {
    throwIfShareAborted(options.signal);
    const contentEl = contentEls[index];
    const memo = memos[index];
    if (!memo) continue;
    contentEl.empty();
    await import_obsidian6.MarkdownRenderer.render(app, memo.content.trimEnd(), contentEl, memo.sourcePath, component);
    sanitizeShareContent(contentEl);
    options.onProgress?.({ current: index + 1, total: contentEls.length });
    await new Promise((resolve) => window.requestAnimationFrame(() => resolve()));
  }
}
function escapeHtml2(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// src/moments-memoria/view-helpers.ts
function fmtDateLocal(d) {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function seededSample(arr, n, seed) {
  if (n >= arr.length) return [...arr];
  let s = seed >>> 0;
  const rand = () => {
    s = s + 1831565813 >>> 0;
    let t2 = s;
    t2 = Math.imul(t2 ^ t2 >>> 15, t2 | 1);
    t2 ^= t2 + Math.imul(t2 ^ t2 >>> 7, t2 | 61);
    return ((t2 ^ t2 >>> 14) >>> 0) / 4294967296;
  };
  const copy = [...arr];
  for (let i = 0; i < n; i++) {
    const j = i + Math.floor(rand() * (copy.length - i));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}
function normalizeForRender(raw) {
  const lines = raw.split("\n");
  const out = [];
  let inFence = false;
  const isTableLine = (s) => /^\s*\|.*\|\s*$/.test(s);
  const isHeading = (s) => /^#{1,6}\s/.test(s);
  const isHr = (s) => /^\s*(?:---|\*\*\*|___)\s*$/.test(s);
  const isCallout = (s) => /^\s*>/.test(s);
  const isFence = (s) => /^\s*(?:```|~~~)/.test(s);
  const lastNonEmpty = () => {
    for (let i = out.length - 1; i >= 0; i--) {
      if (out[i].trim() !== "") return out[i];
    }
    return "";
  };
  const pushBlank = () => {
    if (out.length > 0 && out[out.length - 1].trim() !== "") out.push("");
  };
  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i];
    const prev = i > 0 ? lines[i - 1] : "";
    const next = i < lines.length - 1 ? lines[i + 1] : "";
    if (isFence(ln) && !inFence) {
      pushBlank();
      out.push(ln);
      inFence = true;
      continue;
    }
    if (inFence) {
      out.push(ln);
      if (isFence(ln)) {
        inFence = false;
        if (next.trim() !== "") out.push("");
      }
      continue;
    }
    if (isHeading(ln)) {
      pushBlank();
      out.push(ln);
      if (next.trim() !== "") out.push("");
      continue;
    }
    if (isHr(ln) && prev.trim() !== "" && !isHeading(lastNonEmpty())) {
      pushBlank();
      out.push(ln);
      if (next.trim() !== "") out.push("");
      continue;
    }
    if (isTableLine(ln) && prev.trim() !== "" && !isTableLine(prev)) {
      pushBlank();
      out.push(ln);
      continue;
    }
    if (isTableLine(ln)) {
      out.push(ln);
      if (next.trim() !== "" && !isTableLine(next)) out.push("");
      continue;
    }
    if (isCallout(ln) && prev.trim() !== "" && !isCallout(prev)) {
      pushBlank();
      out.push(ln);
      continue;
    }
    out.push(ln);
  }
  return out.join("\n");
}

// src/moments-memoria/buddy/species.ts
var SPECIES = {
  // ===== Common =====
  cactus: {
    id: "cactus",
    rarity: "common",
    nameKey: "buddy.species.cactus",
    mottoKey: "buddy.motto.cactus",
    base: { debugging: 30, patience: 95, chaos: 10, wisdom: 50, snark: 20 }
  },
  capybara: {
    id: "capybara",
    rarity: "common",
    nameKey: "buddy.species.capybara",
    mottoKey: "buddy.motto.capybara",
    base: { debugging: 25, patience: 90, chaos: 5, wisdom: 70, snark: 10 }
  },
  chonk: {
    id: "chonk",
    rarity: "common",
    nameKey: "buddy.species.chonk",
    mottoKey: "buddy.motto.chonk",
    base: { debugging: 20, patience: 50, chaos: 30, wisdom: 40, snark: 60 }
  },
  snail: {
    id: "snail",
    rarity: "common",
    nameKey: "buddy.species.snail",
    mottoKey: "buddy.motto.snail",
    base: { debugging: 60, patience: 100, chaos: 5, wisdom: 60, snark: 25 }
  },
  // ===== Uncommon =====
  cat: {
    id: "cat",
    rarity: "uncommon",
    nameKey: "buddy.species.cat",
    mottoKey: "buddy.motto.cat",
    base: { debugging: 50, patience: 30, chaos: 60, wisdom: 65, snark: 80 }
  },
  blob: {
    id: "blob",
    rarity: "uncommon",
    nameKey: "buddy.species.blob",
    mottoKey: "buddy.motto.blob",
    base: { debugging: 40, patience: 70, chaos: 50, wisdom: 45, snark: 35 }
  },
  duck: {
    id: "duck",
    rarity: "uncommon",
    nameKey: "buddy.species.duck",
    mottoKey: "buddy.motto.duck",
    base: { debugging: 80, patience: 40, chaos: 35, wisdom: 60, snark: 55 }
  },
  turtle: {
    id: "turtle",
    rarity: "uncommon",
    nameKey: "buddy.species.turtle",
    mottoKey: "buddy.motto.turtle",
    base: { debugging: 65, patience: 95, chaos: 5, wisdom: 80, snark: 30 }
  },
  // ===== Rare =====
  rabbit: {
    id: "rabbit",
    rarity: "rare",
    nameKey: "buddy.species.rabbit",
    mottoKey: "buddy.motto.rabbit",
    base: { debugging: 55, patience: 35, chaos: 70, wisdom: 50, snark: 45 }
  },
  goose: {
    id: "goose",
    rarity: "rare",
    nameKey: "buddy.species.goose",
    mottoKey: "buddy.motto.goose",
    base: { debugging: 30, patience: 25, chaos: 90, wisdom: 35, snark: 95 }
  },
  mushroom: {
    id: "mushroom",
    rarity: "rare",
    nameKey: "buddy.species.mushroom",
    mottoKey: "buddy.motto.mushroom",
    base: { debugging: 45, patience: 80, chaos: 25, wisdom: 90, snark: 40 }
  },
  penguin: {
    id: "penguin",
    rarity: "rare",
    nameKey: "buddy.species.penguin",
    mottoKey: "buddy.motto.penguin",
    base: { debugging: 60, patience: 65, chaos: 30, wisdom: 55, snark: 50 }
  },
  // ===== Epic =====
  axolotl: {
    id: "axolotl",
    rarity: "epic",
    nameKey: "buddy.species.axolotl",
    mottoKey: "buddy.motto.axolotl",
    base: { debugging: 70, patience: 60, chaos: 65, wisdom: 75, snark: 55 }
  },
  robot: {
    id: "robot",
    rarity: "epic",
    nameKey: "buddy.species.robot",
    mottoKey: "buddy.motto.robot",
    base: { debugging: 100, patience: 100, chaos: 0, wisdom: 80, snark: 5 }
  },
  octopus: {
    id: "octopus",
    rarity: "epic",
    nameKey: "buddy.species.octopus",
    mottoKey: "buddy.motto.octopus",
    base: { debugging: 85, patience: 50, chaos: 75, wisdom: 90, snark: 60 }
  },
  // ===== Legendary =====
  owl: {
    id: "owl",
    rarity: "legendary",
    nameKey: "buddy.species.owl",
    mottoKey: "buddy.motto.owl",
    base: { debugging: 90, patience: 80, chaos: 20, wisdom: 100, snark: 70 }
  },
  dragon: {
    id: "dragon",
    rarity: "legendary",
    nameKey: "buddy.species.dragon",
    mottoKey: "buddy.motto.dragon",
    base: { debugging: 80, patience: 70, chaos: 95, wisdom: 95, snark: 85 }
  },
  ghost: {
    id: "ghost",
    rarity: "legendary",
    nameKey: "buddy.species.ghost",
    mottoKey: "buddy.motto.ghost",
    base: { debugging: 41, patience: 71, chaos: 63, wisdom: 74, snark: 100 }
  }
};
var RARITY_WEIGHTS = {
  common: 60,
  uncommon: 25,
  rare: 10,
  epic: 4,
  legendary: 1
};
function speciesByRarity(rarity) {
  return Object.keys(SPECIES).filter(
    (id) => SPECIES[id].rarity === rarity
  );
}

// src/moments-memoria/buddy/sprites.ts
var SPRITES = {
  // ===== Common（普通，60% 概率） =====
  cactus: `n  ____  n
| |\xB0  \xB0| |
|_|    |_|
  |    |`,
  capybara: ` n______n
( \xD7    \xD7 )
(   Oo   )
 \`------\xB4`,
  chonk: ` /\\    /\\
( \xD7    \xD7 )
(   ..   )
 \`------\xB4`,
  snail: `\xB0    .--.
 \\  ( @ )
  \\_\`--\xB4
 ~~~~~~~`,
  // ===== Uncommon（罕见，25% 概率） =====
  cat: `  /\\_/\\
 ( \xD7  \xD7 )
 (  \u03C9  )
 (")_(")`,
  blob: ` .----.
( \xB0  \xB0 )
(      )
 \`----\xB4`,
  duck: `   __
 <(- )___
  (  ._>
   \`--\xB4`,
  turtle: `   _,--._
  ( \xB7  \xB7 )
 /[______]\\
  \`\`    \`\``,
  // ===== Rare（稀有，10% 概率） =====
  rabbit: ` (\\__/)
( \u25C9  \u25C9 )
=(  ..  )=
 (")__(")`,
  goose: `   (\xB0>
    ||
  _(__)_
   ^^^^`,
  mushroom: `. o  .
.-o-OO-o-.
(________)
  |\xB0  \xB0|
  |____|`,
  penguin: `  .---.
 (\xD7>\xD7)
/(   )\\
  \`---\xB4`,
  // ===== Epic（史诗，4% 概率） =====
  axolotl: `  \\^^^/
}~(______)~{
}~(\xD7 .. \xD7)~{
  ( .--. )
  (_/  \\_)`,
  robot: `  .[||].
 [ \xD7  \xD7 ]
 [ ==== ]
  \`------\xB4`,
  octopus: ` .----.
( \xB0  \xB0 )
(______)
/\\/\\/\\/\\`,
  // ===== Legendary（传说，1% 概率） =====
  owl: `  /\\  /\\
 ((@)(@))
 (  ><  )
  \`----\xB4`,
  dragon: ` /^\\  /^\\
<  \xB0  \xB0  >
(   ~~   )
 \`-vvvv-\xB4`,
  ghost: ` .----.
( \xB0  \xB0 )
~\`~\`\`~\`~`
};
var EYE_VARIANTS = ["\xB7", "\u2726", "\xD7", "\u25C9", "@", "\xB0"];
var HAT_RENDERS = {
  none: [],
  crown: ["__|__"],
  tophat: ["[___]", "  |  "],
  propeller: ["~+~", " | "],
  halo: [" ___ ", "(   )"],
  wizard: ["  /\\", " /  \\", "/----\\"],
  beanie: [" ___ ", "(\\__/)"],
  duckling: ["(\xB0<"]
};

// src/moments-memoria/buddy/hatch.ts
function mulberry32(seed) {
  let a = seed >>> 0;
  return function() {
    a = a + 1831565813 | 0;
    let t2 = a;
    t2 = Math.imul(t2 ^ t2 >>> 15, t2 | 1);
    t2 ^= t2 + Math.imul(t2 ^ t2 >>> 7, t2 | 61);
    return ((t2 ^ t2 >>> 14) >>> 0) / 4294967296;
  };
}
function hatch(vaultName, chosenName) {
  const seed = (Date.now() & 4294967295 ^ Math.floor(Math.random() * 4294967296)) >>> 0;
  const rng = mulberry32(seed);
  const rarity = pickRarity(rng);
  const pool = speciesByRarity(rarity);
  const species = pool[Math.floor(rng() * pool.length)];
  const eye = EYE_VARIANTS[Math.floor(rng() * EYE_VARIANTS.length)];
  const hatRoll = rng();
  const hatWeights = [
    ["none", 7],
    ["crown", 1],
    ["tophat", 1],
    ["propeller", 1],
    ["halo", 1],
    ["wizard", 1],
    ["beanie", 1],
    ["duckling", 1]
  ];
  const hatTotal = hatWeights.reduce((s, [, w]) => s + w, 0);
  let hatPick = hatRoll * hatTotal;
  let hat = "none";
  for (const [hatId, w] of hatWeights) {
    hatPick -= w;
    if (hatPick <= 0) {
      hat = hatId;
      break;
    }
  }
  const shiny = rng() < 0.01;
  return {
    species,
    rarity,
    eye,
    hat,
    shiny,
    name: chosenName.trim() || "Buddy",
    hatchedAt: (/* @__PURE__ */ new Date()).toISOString(),
    seed
  };
}
function pickRarity(rng) {
  const total = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (const [rarity, w] of Object.entries(RARITY_WEIGHTS)) {
    r -= w;
    if (r <= 0) return rarity;
  }
  return "common";
}
function daysSinceHatch(hatchedAtISO) {
  try {
    const hatchedAt = new Date(hatchedAtISO);
    if (!isFinite(hatchedAt.getTime())) return 0;
    const now = /* @__PURE__ */ new Date();
    const startOfHatch = new Date(
      hatchedAt.getFullYear(),
      hatchedAt.getMonth(),
      hatchedAt.getDate()
    ).getTime();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    if (startOfHatch > startOfToday) return 0;
    return Math.round((startOfToday - startOfHatch) / 864e5);
  } catch {
    return 0;
  }
}

// src/moments-memoria/buddy/stats.ts
function computeStats(buddy, memos) {
  const base = SPECIES[buddy.species].base;
  const beh = computeBehaviorScores(memos);
  return {
    debugging: clamp(base.debugging * 0.5 + beh.debugging * 50),
    patience: clamp(base.patience * 0.5 + beh.patience * 50),
    chaos: clamp(base.chaos * 0.5 + beh.chaos * 50),
    wisdom: clamp(base.wisdom * 0.5 + beh.wisdom * 50),
    snark: clamp(base.snark * 0.5 + beh.snark * 50)
  };
}
function computeBehaviorScores(memos) {
  if (memos.length === 0) {
    return { debugging: 0.5, patience: 0.5, chaos: 0.5, wisdom: 0.5, snark: 0.5 };
  }
  const structureRe = /(^|\n)(- \[[ xX]\]|- |\* |\d+\.\s|>\s|#{1,6}\s)|\[[^\]]+\]\([^)]+\)/m;
  const structured = memos.filter((m) => structureRe.test(m.content)).length;
  const debugging = clampF(structured / memos.length);
  const totalChars = memos.reduce((s, m) => s + m.content.length, 0);
  const avgLen = totalChars / memos.length;
  const patience = clampF(1 / (1 + Math.exp(-(avgLen - 60) / 50)));
  const recent7d = memos.filter((m) => {
    const days = (Date.now() - m.datetime.getTime()) / 864e5;
    return days <= 7;
  }).length;
  let earliestTs = Infinity;
  for (const m of memos) {
    const ts = m.datetime.getTime();
    if (ts < earliestTs) earliestTs = ts;
  }
  const historyDays = Math.max(
    1,
    Math.ceil((Date.now() - earliestTs) / 864e5)
  );
  const historyAvg7d = memos.length / historyDays * 7;
  const deviation = historyAvg7d > 0 ? Math.min(2, Math.abs(recent7d - historyAvg7d) / historyAvg7d) / 2 : 0;
  const chaos = clampF(deviation);
  const tagged = memos.filter(
    (m) => m.tags.filter((t2) => t2 !== "\u7F6E\u9876" && t2 !== "\u6536\u85CF").length > 0
  ).length;
  const linkRe = /\[\[[^\]]+\]\]/;
  const linked = memos.filter((m) => linkRe.test(m.content)).length;
  const tagRatio = tagged / memos.length;
  const linkRatio = linked / memos.length;
  const wisdom = clampF(
    Math.max(tagRatio, linkRatio) + Math.min(tagRatio, linkRatio) * 0.3
  );
  const moody = memos.filter((m) => detectMood(m.content) !== "neutral").length;
  const snark = clampF(moody / memos.length);
  return { debugging, patience, chaos, wisdom, snark };
}
function clamp(n) {
  return Math.max(0, Math.min(100, Math.round(n)));
}
function clampF(n) {
  if (!isFinite(n)) return 0.5;
  return Math.max(0, Math.min(1, n));
}

// src/moments-memoria/buddy/stage.ts
var STAGE_THRESHOLDS = {
  teen: { days: 30, memos: 100 },
  adult: { days: 365, memos: 1e3 }
};
function computeStage(days, memoCount) {
  if (days >= STAGE_THRESHOLDS.adult.days || memoCount >= STAGE_THRESHOLDS.adult.memos) {
    return "adult";
  }
  if (days >= STAGE_THRESHOLDS.teen.days || memoCount >= STAGE_THRESHOLDS.teen.memos) {
    return "teen";
  }
  return "baby";
}
var STAGE_KEY = {
  baby: "buddy.stage.baby",
  teen: "buddy.stage.teen",
  adult: "buddy.stage.adult"
};

// src/moments-memoria/buddy/render.ts
var RARITY_LABELS = {
  common: "\u2605",
  uncommon: "\u2605\u2605",
  rare: "\u2605\u2605\u2605",
  epic: "\u2605\u2605\u2605\u2605",
  legendary: "\u2605\u2605\u2605\u2605\u2605"
};
var RARITY_KEY = {
  common: "buddy.rarity.common",
  uncommon: "buddy.rarity.uncommon",
  rare: "buddy.rarity.rare",
  epic: "buddy.rarity.epic",
  legendary: "buddy.rarity.legendary"
};
function composeSprite(buddy) {
  const baseLines = SPRITES[buddy.species].split("\n");
  let lines = baseLines;
  const knownEyes = ["\xB7", "\u2726", "\xD7", "\u25C9", "@", "\xB0", "x", "X"];
  if (buddy.eye !== "\xB7") {
    lines = lines.map((line, idx) => {
      if (idx >= 2) return line;
      let modified = line;
      for (const old of knownEyes) {
        if (old === buddy.eye) continue;
        const escaped = old.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        modified = modified.replace(
          new RegExp(`${escaped}([^\\S\\n]+)${escaped}`, "g"),
          `${buddy.eye}$1${buddy.eye}`
        );
      }
      return modified;
    });
  }
  if (buddy.hat !== "none") {
    const hatLines = HAT_RENDERS[buddy.hat];
    if (hatLines.length > 0) {
      const spriteW = Math.max(...lines.map((l) => l.length));
      const centered = hatLines.map((h) => {
        const pad3 = Math.max(0, Math.floor((spriteW - h.length) / 2));
        return " ".repeat(pad3) + h;
      });
      lines = [...centered, ...lines];
    }
  }
  return lines;
}
function renderBuddy(parent, buddy, memos, quipText, callbacks) {
  const meta = SPECIES[buddy.species];
  const stats = computeStats(buddy, memos);
  const days = daysSinceHatch(buddy.hatchedAt);
  const stage = computeStage(days, memos.length);
  const card = parent.createDiv({
    cls: `memoria-buddy memoria-buddy-${buddy.rarity} memoria-buddy-stage-${stage}` + (buddy.shiny ? " memoria-buddy-shiny" : "") + (callbacks?.justHatched ? " is-just-hatched" : "")
  });
  const topbar = card.createDiv({ cls: "memoria-buddy-topbar" });
  const rarityWrap = topbar.createDiv({ cls: "memoria-buddy-rarity-wrap" });
  rarityWrap.createSpan({
    cls: "memoria-buddy-rarity",
    text: `${RARITY_LABELS[buddy.rarity]} ${t(RARITY_KEY[buddy.rarity])}`
  });
  rarityWrap.createSpan({
    cls: `memoria-buddy-stage memoria-buddy-stage-tag-${stage}`,
    text: ` \xB7 ${t(STAGE_KEY[stage])}`
  });
  if (buddy.shiny) {
    rarityWrap.createSpan({
      cls: "memoria-buddy-shiny-tag",
      text: "\u2728"
    });
  }
  topbar.createSpan({
    cls: "memoria-buddy-days",
    // v2.1.0-iter10: 首日显示"陪你的第 1 天"而不是"已陪你 0 天"
    //   后者会让用户有"陪伴还没开始"的失落感。
    // 英文界面空间更紧，hover 顶栏用紧凑的 1 day / 60 days，避免换成两行。
    text: getCurrentLocale() === "en-US" ? days <= 1 ? "1 day" : `${days} days` : days === 0 ? t("buddy.daysCompanion.first") : t("buddy.daysCompanion", { n: days })
  });
  const spriteWrap = card.createDiv({ cls: "memoria-buddy-sprite-wrap" });
  if (stage === "teen" || stage === "adult") {
    spriteWrap.createDiv({
      cls: "memoria-buddy-aura memoria-buddy-aura-top",
      text: "\u2726 \u2726"
    });
  }
  const spriteLines = composeSprite(buddy);
  const sprite = spriteWrap.createDiv({ cls: "memoria-buddy-sprite" });
  sprite.setText(spriteLines.join("\n"));
  if (stage === "adult") {
    spriteWrap.createDiv({
      cls: "memoria-buddy-aura memoria-buddy-aura-bottom",
      text: "\u2508\u2508\u2508\u2508\u2508\u2508\u2508"
    });
  }
  const nameRow = card.createDiv({ cls: "memoria-buddy-name-row" });
  const nameSpan = nameRow.createSpan({
    cls: "memoria-buddy-name",
    text: buddy.name
  });
  nameSpan.setAttr("title", t("buddy.rename.tip"));
  if (callbacks?.onRename) {
    nameSpan.addClass("is-clickable");
    nameSpan.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      callbacks.onRename();
    });
  }
  const speciesSpan = nameRow.createSpan({
    cls: "memoria-buddy-species",
    text: ` \xB7 ${t(meta.nameKey)}`
  });
  speciesSpan.setAttr("title", `\u300C${t(meta.mottoKey)}\u300D`);
  const statsBox = card.createDiv({ cls: "memoria-buddy-stats" });
  renderStat(statsBox, "DEBUGGING", t("buddy.stat.debugging"), stats.debugging);
  renderStat(statsBox, "PATIENCE", t("buddy.stat.patience"), stats.patience);
  renderStat(statsBox, "CHAOS", t("buddy.stat.chaos"), stats.chaos);
  renderStat(statsBox, "WISDOM", t("buddy.stat.wisdom"), stats.wisdom);
  renderStat(statsBox, "SNARK", t("buddy.stat.snark"), stats.snark);
  if (quipText) {
    const bubble = card.createDiv({ cls: "memoria-buddy-bubble" });
    bubble.createSpan({ cls: "memoria-buddy-bubble-text", text: quipText });
  }
}
function renderStat(parent, rawKey, label, value) {
  const row = parent.createDiv({ cls: "memoria-buddy-stat-row" });
  const tooltips = {
    DEBUGGING: t("buddy.stat.tip.debugging"),
    PATIENCE: t("buddy.stat.tip.patience"),
    CHAOS: t("buddy.stat.tip.chaos"),
    WISDOM: t("buddy.stat.tip.wisdom"),
    SNARK: t("buddy.stat.tip.snark")
  };
  const tip = tooltips[rawKey] || "";
  const labelSpan = row.createSpan({
    cls: "memoria-buddy-stat-label",
    text: label
  });
  if (tip) labelSpan.setAttr("title", tip);
  const barWrap = row.createSpan({ cls: "memoria-buddy-stat-bar" });
  if (tip) barWrap.setAttr("title", tip);
  const fill = barWrap.createSpan({ cls: "memoria-buddy-stat-fill" });
  fill.style.width = `${Math.max(0, Math.min(100, value))}%`;
  row.createSpan({ cls: "memoria-buddy-stat-val", text: String(value) });
}
function renderEgg(parent, onHatch) {
  const egg = parent.createDiv({ cls: "memoria-buddy memoria-buddy-egg" });
  const spriteEl = egg.createDiv({ cls: "memoria-buddy-sprite" });
  const setEggSprite = (eyes) => {
    spriteEl.setText(
      `   .---.
  /     \\
 |  ${eyes[0]}  ${eyes[1]} |
  \\_____/`
    );
  };
  setEggSprite("??");
  egg.createDiv({
    cls: "memoria-buddy-egg-title",
    text: t("buddy.egg.title")
  });
  egg.createDiv({
    cls: "memoria-buddy-egg-desc",
    text: t("buddy.egg.desc")
  });
  const input = egg.createEl("input", {
    cls: "memoria-buddy-egg-input",
    attr: {
      type: "text",
      placeholder: t("buddy.egg.placeholder"),
      maxlength: "20"
    }
  });
  input.addEventListener("input", () => {
    if (input.value.trim()) {
      setEggSprite("\u2726\u2726");
      egg.addClass("is-ready");
    } else {
      setEggSprite("??");
      egg.removeClass("is-ready");
    }
  });
  const btn = egg.createEl("button", {
    cls: "memoria-buddy-egg-btn",
    text: t("buddy.egg.hatchBtn")
  });
  let hatching = false;
  const submit = () => {
    if (hatching) return;
    const v = input.value.trim();
    if (!v) {
      input.focus();
      input.classList.add("is-error");
      window.setTimeout(() => input.classList.remove("is-error"), 600);
      return;
    }
    hatching = true;
    btn.setAttr("disabled", "true");
    onHatch(v);
  };
  btn.addEventListener("click", submit);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  });
  window.setTimeout(() => input.focus(), 50);
}

// src/moments-memoria/buddy/quips.ts
function pickQuip(buddy, memos) {
  const now = /* @__PURE__ */ new Date();
  const hour = now.getHours();
  const todayStr = fmtDate3(now);
  const todayMemos = memos.filter((m) => m.date === todayStr);
  const moodSource = todayMemos.length > 0 ? todayMemos : memos.filter((m) => {
    const days = (now.getTime() - m.datetime.getTime()) / 864e5;
    return days <= 3;
  });
  if (moodSource.length > 0 && Math.random() < 0.5) {
    const dominant = dominantMood2(moodSource);
    if (dominant !== "neutral") {
      return pick(`buddy.quip.mood.${dominant}`, buddy);
    }
  }
  if (todayMemos.length >= 5) {
    return pick("buddy.quip.goalDone", buddy);
  }
  if (hour >= 0 && hour < 5 && todayMemos.length > 0) {
    return pick("buddy.quip.lateNight", buddy);
  }
  if (memos.length > 0) {
    let lastTs = 0;
    for (const m of memos) {
      const ts = m.datetime.getTime();
      if (ts > lastTs) lastTs = ts;
    }
    const daysSince = (Date.now() - lastTs) / (1e3 * 60 * 60 * 24);
    if (daysSince >= 7) {
      return pick("buddy.quip.longGone", buddy);
    }
    if (daysSince >= 3) {
      return pick("buddy.quip.missYou", buddy);
    }
  }
  if (hour >= 5 && hour < 9 && todayMemos.length > 0) {
    return pick("buddy.quip.earlyBird", buddy);
  }
  const dow = now.getDay();
  if (dow === 0 || dow === 6) {
    return pick("buddy.quip.weekend", buddy);
  }
  if (todayMemos.length > 0) {
    return pick("buddy.quip.wroteToday", buddy);
  }
  return pick("buddy.quip.idle", buddy);
}
function dominantMood2(memos) {
  if (memos.length === 0) return "neutral";
  const combined = memos.map((m) => m.content).join("\n");
  return detectMood(combined);
}
function pick(baseKey, buddy) {
  const candidates = [
    `${baseKey}.0`,
    `${baseKey}.1`,
    `${baseKey}.2`,
    `${baseKey}.3`,
    `${baseKey}.4`,
    `${baseKey}.5`
  ];
  const idx = Math.floor(Math.random() * candidates.length);
  return t(candidates[idx]);
}
function fmtDate3(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// src/moments-memoria/view.ts
var _MemoriaView = class _MemoriaView extends import_obsidian7.ItemView {
  constructor(leaf, store, settings, plugin) {
    super(leaf);
    __publicField(this, "store", store);
    __publicField(this, "settings", settings);
    __publicField(this, "plugin", plugin);
    __publicField(this, "workspaceLeafEl", null);
    __publicField(this, "filter", {
      tag: null,
      year: null,
      date: null,
      keyword: "",
      preset: "all"
    });
    /** 对齐 Memos View：创建/编辑时间 × 升降序 */
    __publicField(this, "sortOrder", "created-desc");
    __publicField(this, "reviewFilters", {
      tag: "",
      year: "",
      type: "all",
      keyword: ""
    });
    __publicField(this, "unsubscribe", null);
    __publicField(this, "inputEl");
    __publicField(this, "submitBtnEl", null);
    __publicField(this, "isSubmitting", false);
    /** 仅让刚发布的一条卡片播放一次轻量进入动画。 */
    __publicField(this, "justCreatedAt", 0);
    /** Keep the native image picker alive while iOS hands control to Photos/Camera. */
    __publicField(this, "imagePickerEl", null);
    __publicField(this, "listEl");
    __publicField(this, "sidebarEl");
    __publicField(this, "searchEl");
    __publicField(this, "childComponent", new import_obsidian7.Component());
    /** v1.1.14: 改为按 settings.pageSize 初始化，不再硬编码 50 */
    __publicField(this, "pageLimit");
    __publicField(this, "searchExpanded", true);
    __publicField(this, "yearsExpanded", true);
    __publicField(this, "tagsExpanded", true);
    __publicField(this, "tagSuggest", null);
    /** 侧栏顶部视图：热力图 / 月历 / 宠物（v2.1.0 新增 buddy）
     *  v2.0.20: 初始值从 settings.defaultOverviewMode 读（老用户默认 heatmap 不变）
     *  在 constructor 里设置实际初值，这里只给类型 */
    __publicField(this, "overviewMode", "heatmap");
    __publicField(this, "calendarDisplay", null);
    /** v2.0.20: 当前会话中用户是否手动切换过 overviewMode
     *  - false：跟随 settings.defaultOverviewMode（用户在设置页改默认值时立即生效）
     *  - true：锁定为用户当前选择（改设置默认值不影响当前会话） */
    __publicField(this, "overviewModeOverridden", false);
    /** v2.1.0-iter6: 宠物气泡文案的会话级缓存
     *  用户反馈：每次点视图切换都刷新气泡会引发"刷屏心理"（忍不住一直点）。
     *  改为只在真正有意义的时机才换一句：
     *    1. view 首次打开（onOpen 时 cache 清空，下次 renderBuddy 重算）
     *    2. 用户新增了一条笔记（store.onChange 里检测到 memos.length 增加）
     *  其他渲染（切换视图、筛选、刷新 UI）都复用 cache，不重算。
     *  null = 需要重算；字符串 = 直接用（即便是空串）*/
    __publicField(this, "buddyQuipCache", null);
    /** 用于检测笔记数是否增加（增加才换气泡，删除不换） */
    __publicField(this, "buddyLastMemoCount", -1);
    /** v2.1.0-iter8: 选中包裹快捷键处理器（** == * ~~ `）*/
    __publicField(this, "wrapHandler", new WrapHandler());
    /** v2.1.0-iter10: "刚孵化"标记 —— 仅在下一次 renderBuddy 时给卡片加
     *  .is-just-hatched class 播放破壳动画，播完立即清除，
     *  后续切视图不再重播（避免"伪更新"打扰） */
    __publicField(this, "buddyJustHatched", false);
    /** 当前是否处于编辑某条 memo 的模式 */
    __publicField(this, "editingMemo", null);
    __publicField(this, "editBannerEl", null);
    /** v1.6.0: 编辑模式下的 datetime-local input（新建模式隐藏） */
    __publicField(this, "editDateTimeEl", null);
    /** v2.2.0: 移动端 FAB 浮动按钮 —— 仅在 settings.mobileInputStyle === "fab"
     *  且当前是触屏设备时才显示；点击后给 root 加 `.is-fab-expanded` 让输入卡片
     *  滑出。可视性完全由 CSS 控制（@media + class 组合），这里只持引用方便
     *  访问按钮自身。 */
    __publicField(this, "fabEl", null);
    __publicField(this, "composerFrameBound", false);
    /** 点 ➕ 展开前的 layout 高度；区分「webview 已为键盘缩高」与「键盘叠在 layout 上」。 */
    __publicField(this, "composerBaselineH", 0);
    /** 展开瞬间强制按键盘高度占位，直到实测 inset / layout 缩高到位。 */
    __publicField(this, "composerForceReserve", false);
    /** v2.0.0: 当前搜索的结构化查询，给 renderMemoCard 高亮用 */
    __publicField(this, "currentQuery", EMPTY_QUERY);
    /** v2.0.0: Vim 选中的卡片索引（-1 = 无选中）*/
    __publicField(this, "vimSelectedIdx", -1);
    /** v1.4.1: 今日已提示过"满级达成"的日期（yyyy-MM-dd），避免每次刷新都弹 Notice */
    __publicField(this, "dailyGoalNoticedDate", null);
    /** v1.4.11: MarkdownRenderer HTML 缓存。key = textForMd（剥标签/图片后的文本）。
     *    列表刷新（切筛选、toggle 置顶/收藏、滚动加载更多）时，内容未变的卡片直接复用 HTML，
     *    不再走 MarkdownRenderer.render（异步 + 昂贵）。实测 50 卡重渲染 ~200ms → ~20ms。
     *    LRU 上限 500 条，超出后丢最老的。
     *
     *  v1.4.15: 缓存值从 innerHTML 字符串改为 DocumentFragment（克隆自 body）。
     *    原因：
     *      1. Obsidian 社区插件审核明确不鼓励 innerHTML 写入（XSS 疑虑，即便来源是
     *         MarkdownRenderer 受信输出）
     *      2. DocumentFragment + cloneNode(true) 性能与 innerHTML 几乎一致，但 API 语义更好
     *      3. 不会破坏 DOM 上的事件监听（虽然这里是 clone，事件本来就不会复制，
     *         行为与 innerHTML 一致） */
    __publicField(this, "mdCache", /* @__PURE__ */ new Map());
    /** 把输入卡片卡在「搜索栏底边横线 → 键盘」之间，左右与顶栏同宽。（与 4.0.1 一致） */
    __publicField(this, "syncComposerFrame", (force = false) => {
      const root = this.contentEl;
      if (!root || !force && !root.hasClass("is-fab-expanded")) return;
      const topbar = root.querySelector(".memoria-topbar");
      if (!topbar) return;
      const topRect = topbar.getBoundingClientRect();
      const vv = window.visualViewport;
      const layoutH = window.innerHeight;
      const layoutAlreadyShrunk = this.isComposerLayoutShrunk();
      const kb = this.measureKeyboardInset();
      const reportKb = layoutAlreadyShrunk ? Math.max(18, Math.round(this.composerBaselineH - layoutH)) : kb;
      document.body.style.setProperty("--bc-kb-inset", `${reportKb}px`);
      const top = Math.max(8, Math.round(topRect.bottom + 4));
      const left = Math.max(8, Math.round(topRect.left));
      const right = Math.max(8, Math.round(window.innerWidth - topRect.right));
      const gap = 52;
      const vvBottom = vv ? Math.round((vv.offsetTop ?? 0) + vv.height) : layoutH;
      const endY = layoutAlreadyShrunk ? Math.min(layoutH, vvBottom) - gap : Math.min(vvBottom, layoutH - kb) - gap;
      const height = Math.max(160, endY - top);
      root.style.setProperty("--memoria-composer-top", `${top}px`);
      root.style.setProperty("--memoria-composer-left", `${left}px`);
      root.style.setProperty("--memoria-composer-right", `${right}px`);
      root.style.setProperty("--memoria-composer-height", `${height}px`);
      root.style.setProperty("--memoria-composer-bottom", "auto");
    });
    /**
     * v2.0.0: Vim 快捷键处理。
     *
     * 快捷键表：
     *   j       → 下一条卡片
     *   k       → 上一条卡片
     *   g g     → 跳到第一条（需要在 1 秒内连按两次 g）
     *   G       → 跳到最后一条
     *   Enter   → 进入选中卡片的编辑模式
     *   /       → 聚焦搜索框
     *   Esc     → 清除选中
     *   i       → 聚焦输入框开写新笔记
     *
     * 选中态的视觉：给卡片加 .is-vim-selected class，CSS 会让它高亮 + 自动滚入视口
     */
    __publicField(this, "gPressedAt", 0);
    /** v2.0.0: 热力图格子的 hover tooltip（含那天的笔记数 + 首条预览） */
    __publicField(this, "heatmapTooltipEl", null);
    this.pageLimit = Math.max(10, this.settings.pageSize || 50);
    this.overviewMode = this.settings.defaultOverviewMode || "heatmap";
  }
  /** v1.1.14: 统一走 settings.pageSize，设置即改即生效 */
  getInitialPageLimit() {
    return Math.max(10, this.settings.pageSize || 50);
  }
  getViewType() {
    return VIEW_TYPE_MEMORIA;
  }
  getDisplayText() {
    return "Moments";
  }
  getIcon() {
    return "sparkles";
  }
  async onOpen() {
    this.workspaceLeafEl = this.contentEl.closest(".workspace-leaf");
    this.workspaceLeafEl?.addClass("memoria-workspace-leaf");
    this.contentEl.addClass("memoria-root");
    this.buildLayout();
    this.unsubscribe = this.store.onChange(() => this.renderAll());
    this.registerDomEvent(
      this.contentEl,
      "keydown",
      (evt) => {
        const active = activeDocument.activeElement;
        const insideView = active instanceof HTMLElement && this.contentEl.contains(active);
        if (!insideView) return;
        if (this.shouldSendOnKeydown(evt)) {
          evt.preventDefault();
          evt.stopPropagation();
          evt.stopImmediatePropagation();
          void this.submitMemo();
        }
      },
      true
      // capture 阶段
    );
    try {
      await this.store.reloadAll();
    } catch (err) {
      console.error("[Memoria] reloadAll failed:", err);
      new import_obsidian7.Notice("Moments \u6570\u636E\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u6570\u636E\u76EE\u5F55\u540E\u91CD\u8BD5", 8e3);
    }
    const draft = this.loadDraft();
    if (draft) this.inputEl.value = draft;
    this.autoResizeInput();
    this.syncInputCardContentState();
    this.renderAll();
  }
  async onClose() {
    this.workspaceLeafEl?.removeClass("memoria-workspace-leaf");
    this.workspaceLeafEl = null;
    this.disposeImagePicker();
    if (this.unsubscribe) this.unsubscribe();
    if (this.tagSuggest) {
      this.tagSuggest.destroy();
      this.tagSuggest = null;
    }
    this.childComponent.unload();
  }
  // ====================== 布局 ======================
  buildLayout() {
    const root = this.contentEl;
    root.empty();
    root.addClass("memoria-container");
    const shell = root.createDiv({ cls: "memoria-shell" });
    this.sidebarEl = shell.createDiv({ cls: "memoria-sidebar" });
    const overlay = shell.createDiv({ cls: "memoria-sidebar-overlay" });
    overlay.addEventListener("click", () => this.toggleSidebar(false));
    const main = shell.createDiv({ cls: "memoria-main" });
    const topBar = main.createDiv({ cls: "memoria-topbar" });
    const titleWrap = topBar.createDiv({ cls: "memoria-topbar-title" });
    const logoEl = titleWrap.createSpan({ cls: "memoria-logo" });
    (0, import_obsidian7.setIcon)(logoEl, "sparkles");
    titleWrap.createSpan({ cls: "memoria-brand", text: "Moments" });
    const searchWrap = topBar.createDiv({ cls: "memoria-search-wrap" });
    const searchIcon = searchWrap.createDiv({ cls: "memoria-search-icon" });
    (0, import_obsidian7.setIcon)(searchIcon, "search");
    this.searchEl = searchWrap.createEl("input", {
      cls: "memoria-search",
      attr: {
        // v1.1.15: placeholder 回归简洁，去掉 v1.1.11 加的"支持 #标签 关键词"提示
        //   功能还在，但 UI 上保持干净；感兴趣的用户会在 README / 设置页看到说明
        // v2.0.1: 走 i18n
        placeholder: t("search.placeholder"),
        type: "text",
        "aria-label": t("search.placeholder")
      }
    });
    const doSearch = (0, import_obsidian7.debounce)(() => {
      this.filter.keyword = this.searchEl.value.trim();
      this.pageLimit = this.getInitialPageLimit();
      this.renderList();
    }, 180);
    this.searchEl.addEventListener("input", doSearch);
    const tools = topBar.createDiv({ cls: "memoria-topbar-tools" });
    const openLeafType = async (type, fail) => {
      try {
        const existing = this.app.workspace.getLeavesOfType(type);
        if (existing.length) {
          await this.app.workspace.revealLeaf(existing[0]);
          return;
        }
        const leaf = this.app.workspace.getLeaf("tab");
        await leaf.setViewState({ type, active: true });
        await this.app.workspace.revealLeaf(leaf);
      } catch (err) {
        console.error("[Moments] Failed to open view:", err);
        new import_obsidian7.Notice(fail);
      }
    };
    const toolButton = (label, icon, action) => {
      const button = tools.createEl("button", { cls: "memoria-icon-btn", attr: { type: "button", "aria-label": label, title: label } });
      (0, import_obsidian7.setIcon)(button, icon);
      button.addEventListener("click", action);
    };
    const exportButton = tools.createEl("button", {
      cls: "memoria-icon-btn",
      attr: { type: "button", "aria-label": t("toolbar.export"), title: t("toolbar.export") }
    });
    (0, import_obsidian7.setIcon)(exportButton, "download");
    exportButton.addEventListener("click", (event) => {
      const menu = new import_obsidian7.Menu();
      menu.addItem((item) => item.setTitle(t("toolbar.saveMd")).setIcon("file-text").onClick(() => this.doExport("md")));
      menu.addItem((item) => item.setTitle(t("toolbar.saveHtml")).setIcon("globe").onClick(() => this.doExport("html")));
      menu.addItem((item) => item.setTitle(t("toolbar.saveJson")).setIcon("braces").onClick(() => this.doExport("json")));
      menu.showAtMouseEvent(event);
    });
    toolButton(t("toolbar.yearPanorama"), "calendar-days", () => void openLeafType(VIEW_TYPE_MEMORIA_YEAR, "\u5E74\u5EA6\u5168\u666F\u6253\u5F00\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5"));
    toolButton(t("toolbar.statsReport"), "bar-chart-3", () => void openLeafType(VIEW_TYPE_MEMORIA_STATS, "\u6570\u636E\u62A5\u544A\u6253\u5F00\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5"));
    tools.appendChild(exportButton);
    const toggleBtn = topBar.createEl("button", {
      cls: "memoria-icon-btn memoria-sidebar-toggle",
      attr: {
        type: "button",
        "aria-label": t("toolbar.toggleSidebar"),
        title: t("toolbar.toggleSidebar")
      }
    });
    const syncSidebarToggleIcon = () => {
      toggleBtn.empty();
      if (this.isMobileSidebarLayout()) {
        (0, import_obsidian7.setIcon)(toggleBtn, "menu");
      } else {
        (0, import_obsidian7.setIcon)(
          toggleBtn,
          this.contentEl.hasClass("memoria-sidebar-collapsed") ? "panel-left-open" : "panel-left-close"
        );
      }
    };
    syncSidebarToggleIcon();
    toggleBtn.addEventListener("click", () => {
      if (this.isMobileSidebarLayout()) {
        this.toggleSidebar(!this.contentEl.hasClass("memoria-sidebar-open"));
      } else {
        this.toggleDesktopSidebar(
          !this.contentEl.hasClass("memoria-sidebar-collapsed")
        );
      }
      syncSidebarToggleIcon();
    });
    this.registerDomEvent(window, "resize", syncSidebarToggleIcon);
    this.buildInputCard(main);
    this.listEl = main.createDiv({ cls: "memoria-list" });
    this.listEl.addEventListener("scroll", () => {
      if (this.listEl.scrollTop + this.listEl.clientHeight >= this.listEl.scrollHeight - 200) {
        const visible = this.getFilteredMemos();
        if (this.pageLimit < visible.length) {
          const prevLimit = this.pageLimit;
          this.pageLimit += this.getInitialPageLimit();
          this.appendMoreMemos(visible, prevLimit, this.pageLimit);
        }
      }
    });
    this.registerDomEvent(window, "keydown", (e) => {
      if (!this.settings.enableVimKeys) return;
      if (this.app.workspace.activeLeaf !== this.leaf) return;
      if (this.isVimTypingTarget(e.target) || this.isVimTypingTarget(activeDocument.activeElement)) return;
      this.handleVimKey(e);
    });
    this.buildFab();
  }
  /** v2.2.0: 创建移动端 FAB 浮动按钮 + 关闭按钮，并初始化 root 模式 class。
   *  整体策略：
   *    - FAB 按钮挂在 contentEl 末尾（position: fixed 全局定位）
   *    - 输入卡片右上角加 close-btn（仅 fab 模式 + 已展开时可见）
   *    - 模式切换通过 root 上的 .memoria-input-fab-mode 类（CSS 控制可见性）
   *    - 展开/收起通过 root 上的 .is-fab-expanded 类
   *  CSS 全部用 (hover: none) and (pointer: coarse) 媒体查询包裹，桌面零影响。
   */
  buildFab() {
    this.fabEl = this.contentEl.createEl("button", {
      cls: "memoria-fab",
      attr: { "aria-label": t("fab.aria") }
    });
    (0, import_obsidian7.setIcon)(this.fabEl, "plus");
    this.fabEl.addEventListener("click", (e) => {
      e.stopPropagation();
      this.expandFabInput();
    });
    const inputCard = this.inputEl?.closest(
      ".memoria-input-card"
    );
    if (inputCard) {
      const closeBtn = inputCard.createEl("button", {
        cls: "memoria-input-close",
        attr: { "aria-label": t("fab.close") }
      });
      (0, import_obsidian7.setIcon)(closeBtn, "x");
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.collapseFabInput(true);
      });
    }
    this.syncFabMode();
    this.syncContentWidth();
    this.bindComposerFrame();
  }
  /**
   * 键盘 inset：
   * - layout 已缩高 → inset 视为 0（高度贴 layout 底，勿再叠一层）
   * - 键盘叠在 layout 上 → 用 vv / baseline 实测
   * - 展开瞬间强制预留，避免先铺满再点一下才收缩
   */
  measureKeyboardInset() {
    const vv = window.visualViewport;
    const layoutH = window.innerHeight;
    const baseline = this.composerBaselineH > 0 ? this.composerBaselineH : layoutH;
    const vvMeasured = vv ? Math.max(0, Math.round(layoutH - vv.height - (vv.offsetTop ?? 0))) : 0;
    const layoutShrink = Math.max(0, Math.round(baseline - layoutH));
    const vvFromBaseline = vv ? Math.max(0, Math.round(baseline - vv.height - (vv.offsetTop ?? 0))) : 0;
    const layoutAlreadyShrunk = layoutShrink > 80;
    let overlayKb = Math.max(vvMeasured, layoutAlreadyShrunk ? 0 : vvFromBaseline);
    const focused = Boolean(this.inputEl && document.activeElement === this.inputEl);
    if (focused && !layoutAlreadyShrunk && (this.composerForceReserve || overlayKb < 120)) {
      overlayKb = Math.max(overlayKb, Math.round(Math.min(360, baseline * 0.4)));
    }
    if (focused && !layoutAlreadyShrunk && overlayKb >= 120) {
      this.composerForceReserve = false;
    }
    if (layoutAlreadyShrunk) {
      this.composerForceReserve = false;
    }
    return Math.max(overlayKb, focused && !layoutAlreadyShrunk ? 18 : 0);
  }
  isComposerLayoutShrunk() {
    if (this.composerBaselineH <= 0) return false;
    return this.composerBaselineH - window.innerHeight > 80;
  }
  bindComposerFrame() {
    if (this.composerFrameBound) return;
    this.composerFrameBound = true;
    const onFocus = () => {
      this.syncComposerFrame();
      window.setTimeout(() => this.syncComposerFrame(), 280);
    };
    const onBlur = () => {
      window.setTimeout(() => {
        this.syncComposerFrame();
        if (!this.contentEl?.hasClass("is-fab-expanded")) {
          document.body.style.removeProperty("--bc-kb-inset");
        }
      }, 120);
    };
    this.inputEl?.addEventListener("focus", onFocus);
    this.inputEl?.addEventListener("blur", onBlur);
    window.addEventListener("resize", this.syncComposerFrame);
    window.visualViewport?.addEventListener("resize", this.syncComposerFrame);
    window.visualViewport?.addEventListener("scroll", this.syncComposerFrame);
    this.register(() => {
      this.inputEl?.removeEventListener("focus", onFocus);
      this.inputEl?.removeEventListener("blur", onBlur);
      window.removeEventListener("resize", this.syncComposerFrame);
      window.visualViewport?.removeEventListener("resize", this.syncComposerFrame);
      window.visualViewport?.removeEventListener("scroll", this.syncComposerFrame);
      document.body.style.removeProperty("--bc-kb-inset");
    });
  }
  /** v2.2.0: 根据 settings.mobileInputStyle 同步 root 上的 .memoria-input-fab-mode 类。
   *  CSS 媒体查询会在桌面端忽略所有 fab-mode 规则，所以这里不需要判断设备 —— 闭眼加就行。
   *  在 onOpen / renderAll / 设置变更后都调用一次，保证 class 跟 settings 一致。 */
  syncFabMode() {
    const isFab = this.settings.mobileInputStyle === "fab";
    if (isFab) {
      this.contentEl.addClass("memoria-input-fab-mode");
    } else {
      this.contentEl.removeClass("memoria-input-fab-mode");
      this.contentEl.removeClass("is-fab-expanded");
    }
  }
  /** 点 ➕：卡片保持可见并立刻 focus——iOS 不会给 visibility:hidden 的输入框弹键盘。
   *  同时按键盘高度占位，首帧就接近「搜索栏 → 键盘」的最终形态。 */
  expandFabInput() {
    this.contentEl.addClass("is-fab-expanded");
    this.composerBaselineH = Math.max(
      window.innerHeight,
      window.visualViewport ? Math.round(window.visualViewport.height) : 0
    );
    this.composerForceReserve = true;
    this.syncComposerFrame(true);
    this.inputEl?.focus({ preventScroll: true });
    if (this.inputEl) {
      const len = this.inputEl.value.length;
      this.inputEl.setSelectionRange(len, len);
      this.inputEl.scrollTop = this.inputEl.scrollHeight;
    }
    this.syncComposerFrame(true);
    let ticks = 0;
    const tick = () => {
      this.syncComposerFrame();
      if (this.inputEl && document.activeElement !== this.inputEl && this.contentEl.hasClass("is-fab-expanded") && ticks < 6) {
        this.inputEl.focus({ preventScroll: true });
      }
      ticks += 1;
      if (ticks < 20) window.setTimeout(tick, 50);
      else this.composerForceReserve = false;
    };
    window.setTimeout(tick, 32);
  }
  /** 桌面端共享阅读宽度；设置变更时只更新 CSS 变量，不重建界面。 */
  syncContentWidth() {
    const widths = {
      focused: "560px",
      balanced: "980px",
      wide: "none"
    };
    const width = widths[this.settings.contentWidth] ?? widths.balanced;
    this.contentEl.style.setProperty("--memoria-feed-max-width", width);
  }
  /** Open the same capture surface used by the mobile FAB.
   *  External URI entry points call this after revealing the Memoria leaf. */
  openCaptureInput() {
    this.syncFabMode();
    if (this.settings.mobileInputStyle === "fab") {
      this.expandFabInput();
      return;
    }
    window.requestAnimationFrame(() => {
      this.inputEl?.focus();
    });
  }
  /** v2.2.0: 收起 FAB 输入框。
   *  force=true（默认调用方：点 ✕ / 发送成功 / 退出编辑）→ 无条件收起卡片。
   *    草稿已实时 saveDraft，下次展开 loadDraft 自动恢复，不会丢内容。
   *  force=false → "草稿保护"：有内容时只 blur 键盘、卡片保持展开，无内容才收。
   *    供未来"失焦自动收起"等被动场景使用（当前主动收起一律 force=true）。
   *  v2.3.1: ✕ 按钮改为 force=true，修复"有内容点 ✕ 没反应"。 */
  collapseFabInput(force = false) {
    if (!force && this.inputEl?.value.trim()) {
      this.inputEl.blur();
      return;
    }
    this.contentEl.removeClass("is-fab-expanded");
    this.composerBaselineH = 0;
    this.composerForceReserve = false;
    document.body.style.removeProperty("--bc-kb-inset");
    this.inputEl?.blur();
  }
  buildInputCard(parent) {
    const inputCard = parent.createDiv({ cls: "memoria-input-card" });
    this.inputEl = inputCard.createEl("textarea", {
      cls: "memoria-input",
      attr: {
        placeholder: t("input.placeholder"),
        // v2.0.17: rows=1 让 textarea 的"内容约束高度"降到 1 行（~22px），
        //   这样展开动画（40→96）全程由 min-height 主导 rendered height，
        //   视觉上从第一毫秒就开始丝滑升高，而不是前半段卡在 rows=2 的 ~44px。
        rows: "1"
      }
    });
    this.inputEl.addEventListener("focus", () => {
      inputCard.addClass("is-focused");
    });
    this.inputEl.addEventListener("blur", () => {
      inputCard.removeClass("is-focused");
    });
    this.tagSuggest = new TagSuggest(this.app, this.inputEl);
    this.inputEl.addEventListener("keydown", (e) => {
      if (this.shouldSendOnKeydown(e)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        void this.submitMemo();
        return;
      }
      if (e.isComposing || e.keyCode === 229) {
        return;
      }
      if (this.wrapHandler.handleKey(e, this.inputEl)) {
        e.preventDefault();
        return;
      }
      if (e.key === "Escape" && this.editingMemo) {
        e.preventDefault();
        this.exitEditMode();
      } else if (e.key === "Tab") {
        if (this.handleListIndent(e.shiftKey)) {
          e.preventDefault();
        }
      } else if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        if (this.settings.sendHotkey === "ctrl-enter") {
          if (this.handleListContinuation()) {
            e.preventDefault();
          }
        }
      }
    });
    this.inputEl.addEventListener("input", () => {
      if (!this.editingMemo) this.saveDraft(this.inputEl.value);
      this.autoResizeInput();
      this.syncInputCardContentState();
    });
    this.inputEl.addEventListener("paste", (e) => {
      void (async () => {
        const items = Array.from(e.clipboardData?.items ?? []);
        if (!items) return;
        for (const it of items) {
          if (it.kind === "file" && it.type.startsWith("image/")) {
            e.preventDefault();
            const file = it.getAsFile();
            if (file) await this.handleImageFile(file);
            return;
          }
        }
        const htmlData = e.clipboardData?.getData("text/html");
        const plainData = e.clipboardData?.getData("text/plain") ?? "";
        if (looksLikeMarkdown(plainData)) {
          return;
        }
        if (htmlData && shouldConvertHtmlToMd(htmlData)) {
          e.preventDefault();
          const md = htmlToMarkdown(htmlData) || plainData;
          this.insertAtCursor(md);
          this.autoResizeInput();
        }
      })().catch((err) => {
        console.error("[Memoria] Failed to handle paste:", err);
      });
    });
    this.inputEl.addEventListener("dragover", (e) => {
      e.preventDefault();
      this.inputEl.addClass("dragging");
    });
    this.inputEl.addEventListener("dragleave", () => {
      this.inputEl.removeClass("dragging");
    });
    this.inputEl.addEventListener("drop", (e) => {
      void (async () => {
        e.preventDefault();
        this.inputEl.removeClass("dragging");
        const files = Array.from(e.dataTransfer?.files ?? []);
        for (const f of files) {
          if (f.type.startsWith("image/")) {
            await this.handleImageFile(f);
          }
        }
      })().catch((err) => {
        console.error("[Memoria] Failed to handle dropped image:", err);
      });
    });
    const inputToolbar = inputCard.createDiv({ cls: "memoria-input-toolbar" });
    const toolLeft = inputToolbar.createDiv({ cls: "memoria-input-tools" });
    const addTagBtn = toolLeft.createEl("button", {
      cls: "memoria-tool-btn",
      attr: { "aria-label": t("toolbar.insertTag") }
    });
    (0, import_obsidian7.setIcon)(addTagBtn, "hash");
    addTagBtn.addEventListener("click", () => this.insertAtCursor("#"));
    const addImageBtn = toolLeft.createEl("button", {
      cls: "memoria-tool-btn",
      attr: { "aria-label": t("toolbar.insertImage") }
    });
    (0, import_obsidian7.setIcon)(addImageBtn, "image");
    addImageBtn.addEventListener("click", () => this.pickImageFromDisk());
    const ulBtn = toolLeft.createEl("button", {
      cls: "memoria-tool-btn",
      attr: { "aria-label": t("toolbar.insertUL") }
    });
    (0, import_obsidian7.setIcon)(ulBtn, "list");
    ulBtn.addEventListener("click", () => this.insertListAtCursor("- "));
    const olBtn = toolLeft.createEl("button", {
      cls: "memoria-tool-btn",
      attr: { "aria-label": t("toolbar.insertOL") }
    });
    (0, import_obsidian7.setIcon)(olBtn, "list-ordered");
    olBtn.addEventListener("click", () => this.insertOrderedListAtCursor());
    const taskBtn = toolLeft.createEl("button", {
      cls: "memoria-tool-btn",
      attr: { "aria-label": t("toolbar.insertTask") }
    });
    (0, import_obsidian7.setIcon)(taskBtn, "square-check");
    taskBtn.addEventListener("click", () => this.insertListAtCursor("- [ ] "));
    const addTableBtn = toolLeft.createEl("button", {
      cls: "memoria-tool-btn",
      attr: { "aria-label": t("toolbar.insertTable") }
    });
    (0, import_obsidian7.setIcon)(addTableBtn, "table");
    addTableBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.showTablePicker(addTableBtn);
    });
    const submitWrap = inputToolbar.createDiv({ cls: "memoria-submit-wrap" });
    const editDateTimeInput = submitWrap.createEl("input", {
      cls: "memoria-edit-datetime memoria-hidden",
      type: "datetime-local",
      attr: { step: "60", title: t("input.editTimeTitle") }
    });
    this.editDateTimeEl = editDateTimeInput;
    const cancelBtn = submitWrap.createEl("button", {
      cls: "memoria-cancel-btn memoria-hidden",
      text: t("input.cancel")
    });
    cancelBtn.addEventListener("click", () => this.exitEditMode());
    this.editBannerEl = cancelBtn;
    const submitBtn = submitWrap.createEl("button", {
      cls: "memoria-submit-btn",
      attr: {
        "aria-label": t("input.submit"),
        title: t("input.submit")
      }
    });
    this.submitBtnEl = submitBtn;
    (0, import_obsidian7.setIcon)(submitBtn, "send-horizontal");
    submitBtn.addEventListener("click", () => {
      void this.submitMemo();
    });
  }
  /** 在光标处插入文本。
   *  v2.0.13: 修复 BUG —— 之前 `slice(0,start) + text + slice(end)` 会把选区
   *  替换掉，造成用户全选 + 点 # 等按钮时原文本全部消失。改为：有选区时把选区
   *  文本保留下来夹在 text 后面（即"在选中前插入"），无选区时按原行为。
   *  注意：列表按钮走 insertListAtCursor / insertOrderedListAtCursor 已有专用逻辑，
   *  不会调到这里的选区分支；这里主要保护 # / 链接 / 引用 / 表格 等其他工具按钮。 */
  insertAtCursor(text) {
    const el = this.inputEl;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    if (start !== end) {
      const selected = el.value.slice(start, end);
      replaceTextareaRange(el, start, end, text + selected);
    } else {
      replaceTextareaRange(el, start, end, text);
    }
    el.focus();
    this.autoResizeInput();
    if (!this.editingMemo) this.saveDraft(el.value);
    this.syncInputCardContentState();
  }
  /**
   * v1.1.8: 让 textarea 高度跟随内容自适应
   * - 先 reset height = auto 让浏览器重算 scrollHeight
   * - 再 set height = scrollHeight
   * - CSS 上有 max-height: 40vh，超过会自动出现内部滚动条
   */
  autoResizeInput() {
    const el = this.inputEl;
    if (!el) return;
    if (this.contentEl?.hasClass("is-fab-expanded")) {
      if (el.style.height) el.setCssStyles({ height: "" });
      return;
    }
    if (el.value.length === 0) {
      if (el.style.height) el.setCssStyles({ height: "" });
      return;
    }
    el.setCssStyles({ height: "auto" });
    const contentHeight = el.scrollHeight + 2;
    const expandedMin = import_obsidian7.Platform.isMobile ? 56 : 96;
    if (contentHeight <= expandedMin) {
      if (el.style.height) el.setCssStyles({ height: "" });
    } else {
      const nextHeight = `${contentHeight}px`;
      if (el.style.height !== nextHeight) {
        el.classList.add("memoria-no-transition");
        el.setCssStyles({ height: nextHeight });
        window.requestAnimationFrame(() => el.classList.remove("memoria-no-transition"));
      }
    }
  }
  /**
   * v2.0.17: 同步输入卡片的 has-content 状态。
   * 设计：输入卡片默认处于"收起态"（textarea 矮、工具栏图标变灰、发送按钮淡色），
   *   节省阅读区垂直空间。有以下任一情况时进入"展开态"：
   *   1. 鼠标 hover / 输入框聚焦（纯 CSS，见 :hover / :focus-within）
   *   2. 输入框已有内容（本方法通过加 .has-content class 控制）
   *   3. 编辑模式（复用已有的 .is-editing class）
   *   4. 拖拽图片中（复用已有的 .dragging class）
   *
   * 这样用户打到一半切去看笔记卡片（鼠标离开输入框）时，输入框不会意外塌下去把草稿挤走。
   */
  syncInputCardContentState() {
    if (!this.inputEl) return;
    const card = this.inputEl.closest(".memoria-input-card");
    if (!card) return;
    const hasContent = this.inputEl.value.length > 0;
    card.toggleClass("has-content", hasContent);
  }
  /**
   * v1.1.7: 插入列表前缀（无序 `- ` / 任务 `- [ ] `）
   * - 如果光标在行首或文档开头 → 直接插入 `prefix`
   * - 否则先补一个换行 → 再插入 `prefix`
   * 这样连续点按钮可以快速生成多条
   *
   * v2.0.13: 修复 BUG —— 之前如果用户**选中了文本**再点列表按钮，selectionStart!==selectionEnd
   *   走 insertAtCursor 会把选区替换成只有前缀的字符串，**用户原文本全部丢失**！
   *   修复：检测到有选区时，把选中文本按行拆开，每行前面加列表前缀（多行时每一项都成为列表项），
   *   单行时直接 `prefix + 选中文本` 包起来变成一个列表项。和 flomo / Typora / VSCode 行为一致。
   */
  insertListAtCursor(prefix) {
    const el = this.inputEl;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    if (start !== end) {
      const selected = el.value.slice(start, end);
      const lines = selected.split("\n");
      const wrapped = lines.map((ln) => `${prefix}${ln}`).join("\n");
      const before2 = el.value.slice(0, start);
      const atLineStart2 = start === 0 || before2.endsWith("\n");
      const finalText = atLineStart2 ? wrapped : `
${wrapped}`;
      replaceTextareaRange(el, start, end, finalText);
      el.focus();
      this.autoResizeInput();
      if (!this.editingMemo) this.saveDraft(el.value);
      return;
    }
    const pos = start;
    const before = el.value.slice(0, pos);
    const atLineStart = pos === 0 || before.endsWith("\n");
    this.insertAtCursor(atLineStart ? prefix : `
${prefix}`);
  }
  /**
   * v1.1.8: 插入有序列表前缀，自动计算序号
   * 规则：
   *   1. 向上扫描"光标所在行之前"的连续有序列表行（`N. ` 开头）
   *   2. 找到最近一个序号 → next = 该序号 + 1
   *   3. 找不到 / 不连续 → 从 1 开始
   *
   * 场景示例：
   *   a) 空输入框连点 3 次 → `1. \n2. \n3. `
   *   b) 已写 "第一段文字\n\n" 光标在末尾 → 插入 `1. `（不连续，从 1 开始）
   *   c) 已写 "5. abc\n" 光标在末尾 → 插入 `6. `
   *
   * v2.0.13: 同 insertListAtCursor，修复"选中文本被前缀替换"的 BUG。
   *   有选区时按行拆开，每行加递增序号（`1. ` `2. ` `3. ` ...），不再丢失原文本。
   */
  insertOrderedListAtCursor() {
    const el = this.inputEl;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    if (start !== end) {
      const selected = el.value.slice(start, end);
      const lines2 = selected.split("\n");
      const wrapped = lines2.map((ln, i) => `${i + 1}. ${ln}`).join("\n");
      const before2 = el.value.slice(0, start);
      const atLineStart2 = start === 0 || before2.endsWith("\n");
      const finalText = atLineStart2 ? wrapped : `
${wrapped}`;
      replaceTextareaRange(el, start, end, finalText);
      el.focus();
      this.autoResizeInput();
      if (!this.editingMemo) this.saveDraft(el.value);
      return;
    }
    const pos = start;
    const before = el.value.slice(0, pos);
    const atLineStart = pos === 0 || before.endsWith("\n");
    const trimmedBefore = atLineStart ? before.replace(/\n$/, "") : before;
    const lines = trimmedBefore.split("\n");
    const olRe = /^(\d+)\.\s/;
    let nextNum = 1;
    for (let i = lines.length - 1; i >= 0; i--) {
      const ln = lines[i];
      if (ln.trim() === "") {
        break;
      }
      const m = ln.match(olRe);
      if (m) {
        nextNum = parseInt(m[1], 10) + 1;
        break;
      }
      break;
    }
    const prefix = `${nextNum}. `;
    this.insertAtCursor(atLineStart ? prefix : `
${prefix}`);
  }
  /**
   * v1.1.9: 列表行 Tab / Shift+Tab 缩进
   * - 只在"当前行是列表行"（无序/有序/任务）时生效，普通文本不拦截 Tab
   * - 行首插入/删除 2 空格
   * 返回 true 表示已处理（外部应 preventDefault），false 则放行
   */
  handleListIndent(shift) {
    const el = this.inputEl;
    const pos = el.selectionStart ?? 0;
    const text = el.value;
    const lineStart = text.lastIndexOf("\n", pos - 1) + 1;
    let lineEnd = text.indexOf("\n", pos);
    if (lineEnd === -1) lineEnd = text.length;
    const curLine = text.slice(lineStart, lineEnd);
    const listRe = /^(\s*)(?:[-*]\s+\[[ xX]\]\s|[-*]\s|\d+\.\s)/;
    if (!listRe.test(curLine)) return false;
    let newLine;
    let shift2;
    if (shift) {
      if (curLine.startsWith("  ")) {
        newLine = curLine.slice(2);
        shift2 = -2;
      } else if (curLine.startsWith(" ")) {
        newLine = curLine.slice(1);
        shift2 = -1;
      } else {
        return true;
      }
    } else {
      newLine = "  " + curLine;
      shift2 = 2;
    }
    replaceTextareaRange(el, lineStart, lineEnd, newLine);
    const newPos = Math.max(lineStart, pos + shift2);
    el.setSelectionRange(newPos, newPos);
    if (!this.editingMemo) this.saveDraft(el.value);
    this.autoResizeInput();
    return true;
  }
  /**
   * v1.1.9: 列表项 Enter 智能续行
   * 规则：
   *   1. 当前行是 "<indent>- [ ] 内容" → 新行 "<indent>- [ ] "
   *   2. 当前行是 "<indent>- 内容" → 新行 "<indent>- "
   *   3. 当前行是 "<indent>N. 内容" → 新行 "<indent>(N+1). "
   *   4. 当前行是空列表项（只剩前缀）→ 清空当前行前缀 + 插入换行（退出列表）
   *   5. 光标不在行尾（在中间） → 不介入，走浏览器默认 Enter
   * 返回 true 表示已处理（外部应 preventDefault）
   */
  handleListContinuation() {
    const el = this.inputEl;
    const pos = el.selectionStart ?? 0;
    if (el.selectionStart !== el.selectionEnd) return false;
    const text = el.value;
    const lineStart = text.lastIndexOf("\n", pos - 1) + 1;
    let lineEnd = text.indexOf("\n", pos);
    if (lineEnd === -1) lineEnd = text.length;
    const curLine = text.slice(lineStart, lineEnd);
    if (pos !== lineEnd) return false;
    const taskRe = /^(\s*)([-*]\s+)\[[ xX]\](\s+)(.*)$/;
    const ulRe = /^(\s*)([-*]\s+)(.*)$/;
    const olRe = /^(\s*)(\d+)(\.\s+)(.*)$/;
    let mTask = curLine.match(taskRe);
    if (mTask) {
      const [, indent, bullet, space, body] = mTask;
      if (body === "") {
        this.replaceLineAndInsertNewline(lineStart, lineEnd);
      } else {
        const newPrefix = `
${indent}${bullet}[ ]${space}`;
        this.insertAtCursor(newPrefix);
      }
      return true;
    }
    let mOl = curLine.match(olRe);
    if (mOl) {
      const [, indent, num, dot, body] = mOl;
      if (body === "") {
        this.replaceLineAndInsertNewline(lineStart, lineEnd);
      } else {
        const next = parseInt(num, 10) + 1;
        this.insertAtCursor(`
${indent}${next}${dot}`);
      }
      return true;
    }
    let mUl = curLine.match(ulRe);
    if (mUl) {
      const [, indent, bullet, body] = mUl;
      if (body === "") {
        this.replaceLineAndInsertNewline(lineStart, lineEnd);
      } else {
        this.insertAtCursor(`
${indent}${bullet}`);
      }
      return true;
    }
    return false;
  }
  /** v1.1.9 辅助：把 [lineStart,lineEnd) 这一行清空并插入换行（用于"空列表项退出列表"）
   *  v2.1.0-iter8: 改用 replaceTextareaRange 保留 undo stack */
  replaceLineAndInsertNewline(lineStart, lineEnd) {
    const el = this.inputEl;
    replaceTextareaRange(el, lineStart, lineEnd, "\n");
    const newPos = lineStart + 1;
    el.setSelectionRange(newPos, newPos);
    if (!this.editingMemo) this.saveDraft(el.value);
    this.autoResizeInput();
  }
  /**
   * 点击"插入表格"按钮 -> 弹出 8×8 网格让用户选行列数
   *
   * 桌面端：参考 Word/Notion —— hover 高亮选区，点击确认插入
   * 手机端（v1.1.7）：手指没有 hover，改为"点哪格就插多大"的 tap-to-insert 模式。
   *   每格会显示小数字提示（如 "3×4"），点击即立即插入并关闭弹层。
   */
  showTablePicker(anchor) {
    const existing = activeDocument.querySelector(".memoria-table-picker");
    if (existing) {
      existing.remove();
      return;
    }
    const isMobile = import_obsidian7.Platform.isMobile;
    const MAX = isMobile ? 5 : 6;
    const pop = activeDocument.body.createDiv({
      cls: "memoria-table-picker" + (isMobile ? " is-mobile" : "")
    });
    const label = pop.createDiv({
      cls: "memoria-table-picker-label",
      text: isMobile ? "\u70B9\u51FB\u683C\u5B50\u76F4\u63A5\u63D2\u5165" : "0 \xD7 0"
    });
    const grid = pop.createDiv({ cls: "memoria-table-picker-grid" });
    const cells = [];
    for (let r = 0; r < MAX; r++) {
      cells[r] = [];
      for (let c = 0; c < MAX; c++) {
        const cell = grid.createDiv({ cls: "memoria-table-picker-cell" });
        cell.dataset.row = String(r);
        cell.dataset.col = String(c);
        if (isMobile) {
          cell.createSpan({
            cls: "memoria-table-picker-cell-text",
            text: `${r + 1}\xD7${c + 1}`
          });
        }
        cells[r][c] = cell;
      }
    }
    let selR = 0;
    let selC = 0;
    const updateHighlight = (r, c) => {
      selR = r;
      selC = c;
      for (let i = 0; i < MAX; i++) {
        for (let j = 0; j < MAX; j++) {
          cells[i][j].toggleClass("is-active", i <= r && j <= c);
        }
      }
      label.setText(`${r + 1} \xD7 ${c + 1}`);
    };
    if (!isMobile) {
      grid.addEventListener("mouseover", (e) => {
        const t2 = e.target;
        if (!t2.hasClass("memoria-table-picker-cell")) return;
        const r = parseInt(t2.dataset.row ?? "0", 10);
        const c = parseInt(t2.dataset.col ?? "0", 10);
        updateHighlight(r, c);
      });
      grid.addEventListener("click", (e) => {
        const t2 = e.target;
        if (!t2.hasClass("memoria-table-picker-cell")) return;
        this.insertTable(selR + 1, selC + 1);
        pop.remove();
      });
    } else {
      grid.addEventListener("click", (e) => {
        let t2 = e.target;
        if (!t2.hasClass("memoria-table-picker-cell")) {
          t2 = t2.closest(".memoria-table-picker-cell");
        }
        if (!t2) return;
        const r = parseInt(t2.dataset.row ?? "0", 10);
        const c = parseInt(t2.dataset.col ?? "0", 10);
        this.insertTable(r + 1, c + 1);
        pop.remove();
      });
    }
    if (isMobile) {
      pop.setCssStyles({
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)"
      });
    } else {
      const rect = anchor.getBoundingClientRect();
      pop.setCssStyles({
        left: `${Math.round(rect.left)}px`,
        top: `${Math.round(rect.bottom + 6)}px`
      });
      window.requestAnimationFrame(() => {
        const pr = pop.getBoundingClientRect();
        const vw = activeDocument.documentElement.clientWidth;
        const vh = activeDocument.documentElement.clientHeight;
        if (pr.right > vw - 8) {
          pop.setCssStyles({ left: `${Math.max(8, vw - pr.width - 8)}px` });
        }
        if (pr.bottom > vh - 8) {
          pop.setCssStyles({ top: `${Math.max(8, rect.top - pr.height - 6)}px` });
        }
      });
    }
    const closeOnOutside = (e) => {
      const t2 = e.target;
      if (!pop.contains(t2) && t2 !== anchor) {
        pop.remove();
        activeDocument.removeEventListener("mousedown", closeOnOutside, true);
        activeDocument.removeEventListener("touchstart", closeOnOutside, true);
      }
    };
    window.setTimeout(() => {
      activeDocument.addEventListener("mousedown", closeOnOutside, true);
      activeDocument.addEventListener("touchstart", closeOnOutside, true);
    }, 0);
    this.register(() => {
      pop.remove();
      activeDocument.removeEventListener("mousedown", closeOnOutside, true);
      activeDocument.removeEventListener("touchstart", closeOnOutside, true);
    });
  }
  /** 在光标位置插入一个 rows × cols 的空 md 表格模板 */
  insertTable(rows, cols) {
    const header = "| " + Array(cols).fill("  ").join(" | ") + " |";
    const sep = "| " + Array(cols).fill("--").join(" | ") + " |";
    const body = Array(Math.max(0, rows - 1)).fill(null).map(() => "| " + Array(cols).fill("  ").join(" | ") + " |");
    const lines = [header, sep, ...body];
    const el = this.inputEl;
    let prefix = "";
    let suffix = "\n";
    const val = el.value;
    const start = el.selectionStart ?? val.length;
    const beforeChar = val.slice(0, start);
    if (beforeChar.length > 0 && !beforeChar.endsWith("\n\n")) {
      prefix = beforeChar.endsWith("\n") ? "\n" : "\n\n";
    }
    const afterChar = val.slice(start);
    if (afterChar && !afterChar.startsWith("\n")) {
      suffix = "\n\n";
    }
    const text = prefix + lines.join("\n") + suffix;
    this.insertAtCursor(text);
  }
  /** 用浏览器 file picker 选图片 */
  pickImageFromDisk() {
    this.disposeImagePicker();
    const inp = activeDocument.createElement("input");
    inp.type = "file";
    inp.accept = "image/*";
    inp.multiple = true;
    inp.tabIndex = -1;
    inp.className = "memoria-image-picker";
    inp.setAttribute("aria-hidden", "true");
    inp.addEventListener("change", () => {
      const files = Array.from(inp.files ?? []);
      this.disposeImagePicker(inp);
      void this.importSelectedImages(files).catch((err) => {
        console.error("[Memoria] Failed to import selected image:", err);
      });
    }, { once: true });
    inp.addEventListener("cancel", () => {
      this.disposeImagePicker(inp);
    }, { once: true });
    activeDocument.body.appendChild(inp);
    this.imagePickerEl = inp;
    inp.value = "";
    inp.click();
  }
  disposeImagePicker(inp = this.imagePickerEl) {
    if (!inp) return;
    if (this.imagePickerEl === inp) this.imagePickerEl = null;
    inp.remove();
  }
  async importSelectedImages(files) {
    for (const file of files) {
      await this.handleImageFile(file);
    }
  }
  /** 把一张图片保存到附件目录，并把 ![[]] 引用插入输入框 */
  async handleImageFile(file) {
    try {
      const ext = (file.name.split(".").pop() || "png").toLowerCase();
      const buf = await file.arrayBuffer();
      const path = await this.store.saveImageAttachment(buf, ext);
      const fileName = path.split("/").pop() ?? path;
      const ref = `![[${fileName}]]`;
      if (this.inputEl.value && !/\n$/.test(this.inputEl.value)) {
        this.insertAtCursor("\n" + ref + "\n");
      } else {
        this.insertAtCursor(ref + "\n");
      }
      new import_obsidian7.Notice(`\u56FE\u7247\u5DF2\u4FDD\u5B58: ${fileName}`);
    } catch (e) {
      console.error(e);
      new import_obsidian7.Notice(t("notice.imageFailed", { msg: e.message }));
    }
  }
  /** v2.0.17: 根据设置的 sendHotkey 判断当前 keydown 是否应触发"发送"
   *  两种模式**完全互斥**：
   *  - "enter"      ：仅纯 Enter 触发发送；Shift+Enter 换行；Ctrl/Cmd+Enter 不触发（让浏览器默认换行）
   *  - "ctrl-enter" ：仅 Ctrl/Cmd+Enter 触发发送；纯 Enter 换行 / 列表续行
   *  IME 保护：仅在"纯 Enter 发送"时考虑（中文输入法确认候选词也是 Enter）；
   *            带 Ctrl/Cmd 修饰键时 IME 不会劫持，无需考虑
   */
  shouldSendOnKeydown(e) {
    if (e.key !== "Enter") return false;
    const mode = this.settings.sendHotkey;
    const isMod = e.ctrlKey || e.metaKey;
    const isShift = e.shiftKey;
    if (mode === "enter") {
      if (isMod || isShift) return false;
      if (e.isComposing || e.keyCode === 229) {
        return false;
      }
      return true;
    }
    if (isMod && !isShift) return true;
    return false;
  }
  async submitMemo() {
    if (this.isSubmitting) return;
    const text = this.inputEl.value.trim();
    if (!text) {
      new import_obsidian7.Notice(t("notice.emptyContent"));
      this.inputEl.focus();
      return;
    }
    this.isSubmitting = true;
    this.submitBtnEl?.addClass("is-busy");
    if (this.submitBtnEl) this.submitBtnEl.disabled = true;
    try {
      if (this.editingMemo) {
        const dtStr = this.editDateTimeEl?.value ?? "";
        const origStr = `${this.editingMemo.date}T${this.editingMemo.time}`;
        const timeChanged = dtStr && dtStr !== origStr;
        if (timeChanged) {
          const newDate = new Date(dtStr);
          if (isNaN(newDate.getTime())) {
            new import_obsidian7.Notice(t("notice.invalidTime"));
            return;
          }
          await this.store.editMemoDateTime(this.editingMemo, newDate, text);
          new import_obsidian7.Notice(t("notice.updatedWithTime"));
        } else {
          await this.store.editMemo(this.editingMemo, text);
          new import_obsidian7.Notice(t("notice.updated"));
        }
        this.exitEditMode();
      } else {
        const finalText = this.appendActiveTagIfMissing(text);
        this.justCreatedAt = Date.now();
        await this.store.addMemo(finalText);
        new import_obsidian7.Notice(t("notice.saved"));
      }
      if (this.settings.clearAfterSave) {
        this.inputEl.value = "";
        this.clearDraft();
      }
      if (!this.editingMemo && this.settings.clearAfterSave) {
        this.inputEl.blur();
      }
      this.autoResizeInput();
      this.syncInputCardContentState();
      if (!this.editingMemo && this.settings.clearAfterSave && this.settings.mobileInputStyle === "fab") {
        this.collapseFabInput(true);
      }
    } catch (e) {
      console.error(e);
      new import_obsidian7.Notice(t("notice.saveFailed", { msg: e.message }));
    } finally {
      this.isSubmitting = false;
      this.submitBtnEl?.removeClass("is-busy");
      if (this.submitBtnEl) this.submitBtnEl.disabled = false;
    }
  }
  /** v2.0.13: 如果当前侧栏正按某标签筛选，把该标签自动追加到新 memo 末尾。
   *   - 用户已包含同名标签则不重复（按 tag 完整匹配 #foo / #foo/bar）
   *   - 多语言无关，纯文本匹配
   *   - 不修改"编辑已有 memo"路径，只对新建生效 */
  appendActiveTagIfMissing(text) {
    const activeTag = this.filter.tag;
    if (!activeTag) return text;
    const tagRe = /#([A-Za-z0-9_\u4e00-\u9fff/]+)/g;
    const existingTags = /* @__PURE__ */ new Set();
    let m;
    while ((m = tagRe.exec(text)) !== null) {
      existingTags.add(m[1]);
    }
    if (existingTags.has(activeTag)) return text;
    for (const ex of existingTags) {
      if (ex.startsWith(activeTag + "/")) return text;
    }
    const sep = text.endsWith("\n") ? "" : "\n";
    return `${text}${sep}#${activeTag}`;
  }
  draftKey() {
    try {
      return `${_MemoriaView.DRAFT_KEY_PREFIX}:${this.app.vault.getName()}`;
    } catch {
      return _MemoriaView.DRAFT_KEY_PREFIX;
    }
  }
  saveDraft(text) {
    try {
      const key = this.draftKey();
      if (text.trim() === "") {
        window.localStorage.removeItem(key);
      } else {
        if (text.length > 512 * 1024) return;
        window.localStorage.setItem(key, text);
      }
    } catch {
    }
  }
  loadDraft() {
    try {
      return window.localStorage.getItem(this.draftKey()) ?? "";
    } catch {
      return "";
    }
  }
  clearDraft() {
    try {
      window.localStorage.removeItem(this.draftKey());
    } catch {
    }
  }
  isMobileSidebarLayout() {
    return window.innerWidth <= 680;
  }
  /** 切换侧栏抽屉（移动端用） */
  toggleSidebar(open) {
    this.contentEl.toggleClass("memoria-sidebar-open", open);
  }
  /** 收起桌面侧栏，让主内容区获得完整宽度 */
  toggleDesktopSidebar(collapsed) {
    this.contentEl.toggleClass("memoria-sidebar-collapsed", collapsed);
    if (collapsed) this.toggleSidebar(false);
  }
  /** 导出当前筛选结果到当前 Moments 目录下的 exports 子目录。 */
  async doExport(format) {
    try {
      const memos = this.getFilteredMemos();
      if (memos.length === 0) {
        new import_obsidian7.Notice(t("notice.exportEmpty"));
        return;
      }
      const desc = this.describeCurrentFilter();
      const folder = `${this.settings.folder}/exports`;
      const path = await exportMemos(this.app, {
        format,
        memos,
        filterDesc: desc,
        exportFolder: folder
      });
      const file = this.app.vault.getAbstractFileByPath(path);
      if (file instanceof import_obsidian7.TFile && format === "md") {
        await this.app.workspace.getLeaf("tab").openFile(file);
      }
    } catch (e) {
      console.error(e);
      new import_obsidian7.Notice(t("notice.exportFailed", { msg: e.message }));
    }
  }
  /** 用人类可读的方式描述当前筛选状态（给导出文件的 filter 字段用）
   *  v2.0.19: 走 i18n —— 之前 preset 映射和"X 年"/"全部笔记"都是硬编码中文，
   *    导致英文用户导出的 md/html/json 里 filter 字段总是中文。*/
  describeCurrentFilter() {
    const parts = [];
    if (this.filter.preset && this.filter.preset !== "all") {
      const presetKeyMap = {
        today: "sidebar.today",
        week: "sidebar.week",
        "on-this-day": "list.presetOnThisDay",
        "no-tag": "sidebar.noTag",
        "with-image": "sidebar.withImage",
        "with-link": "sidebar.withLink",
        pinned: "sidebar.pinned",
        starred: "sidebar.starred",
        todo: "sidebar.todo",
        deleted: "sidebar.trash",
        random: "sidebar.random"
      };
      const k = presetKeyMap[this.filter.preset];
      parts.push(k ? t(k) : this.filter.preset);
    }
    if (this.filter.tag) parts.push(`#${this.filter.tag}`);
    if (this.filter.year) parts.push(t("export.desc.year", { year: this.filter.year }));
    if (this.filter.date) parts.push(this.filter.date);
    if (this.filter.keyword) parts.push(`"${this.filter.keyword}"`);
    return parts.length === 0 ? t("export.desc.all") : parts.join(" \xB7 ");
  }
  /**
   * 正在认真打字时不抢 Vim 键：搜索框、日期框、编辑中的输入框、
   * 或顶部输入框已经有内容。空的捕捉框仍允许 j/k 选卡片。
   */
  isVimTypingTarget(target) {
    if (!(target instanceof HTMLElement)) return false;
    const tag = target.tagName;
    const isField = tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;
    if (!isField) return false;
    if (target === this.searchEl || target === this.editDateTimeEl) return true;
    if (target === this.inputEl) {
      if (this.editingMemo) return true;
      return (this.inputEl.value || "").trim().length > 0;
    }
    return true;
  }
  handleVimKey(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const key = e.key;
    const cards = Array.from(
      this.listEl.querySelectorAll(".memoria-card")
    );
    if (cards.length === 0 && !["i", "/", "Escape"].includes(key)) return;
    const updateSelected = (idx) => {
      this.vimSelectedIdx = Math.max(0, Math.min(cards.length - 1, idx));
      cards.forEach((c, i) => {
        c.toggleClass("is-vim-selected", i === this.vimSelectedIdx);
      });
      const target = cards[this.vimSelectedIdx];
      if (target) {
        target.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
      this.inputEl?.blur();
    };
    switch (key) {
      case "j":
        e.preventDefault();
        e.stopPropagation();
        updateSelected(
          this.vimSelectedIdx < 0 ? 0 : this.vimSelectedIdx + 1
        );
        break;
      case "k":
        e.preventDefault();
        e.stopPropagation();
        updateSelected(
          this.vimSelectedIdx < 0 ? 0 : this.vimSelectedIdx - 1
        );
        break;
      case "G":
        e.preventDefault();
        e.stopPropagation();
        updateSelected(cards.length - 1);
        break;
      case "g": {
        const now = Date.now();
        if (now - this.gPressedAt < 1e3) {
          e.preventDefault();
          e.stopPropagation();
          updateSelected(0);
          this.gPressedAt = 0;
        } else {
          this.gPressedAt = now;
        }
        break;
      }
      case "Enter":
        if (this.vimSelectedIdx >= 0) {
          e.preventDefault();
          e.stopPropagation();
          const memos = this.getFilteredMemos().slice(0, this.pageLimit);
          const memo = memos[this.vimSelectedIdx];
          if (memo) this.enterEditMode(memo);
        }
        break;
      case "/":
        e.preventDefault();
        e.stopPropagation();
        this.searchEl?.focus();
        this.searchEl?.select();
        break;
      case "i":
        e.preventDefault();
        e.stopPropagation();
        this.inputEl?.focus();
        break;
      case "Escape":
        if (this.vimSelectedIdx >= 0) {
          e.preventDefault();
          this.vimSelectedIdx = -1;
          cards.forEach((c) => c.removeClass("is-vim-selected"));
        }
        break;
    }
  }
  syncVimSelection() {
    const cards = Array.from(this.listEl.querySelectorAll(".memoria-card"));
    if (!cards.length) {
      this.vimSelectedIdx = -1;
      return;
    }
    if (this.vimSelectedIdx >= cards.length) this.vimSelectedIdx = cards.length - 1;
    cards.forEach((c, i) => c.toggleClass("is-vim-selected", i === this.vimSelectedIdx && this.vimSelectedIdx >= 0));
  }
  /** 进入编辑模式：把 memo 内容填入输入框
   *  v1.1.7: 进入前如果输入框有在打的草稿，先保存到 localStorage，退出编辑时恢复
   *  v1.6.0: 同步把 memo 的时间填入 datetime-local 输入框，允许编辑时一并修改
   */
  enterEditMode(memo) {
    if (this.inputEl.value.trim()) this.saveDraft(this.inputEl.value);
    this.editingMemo = memo;
    this.inputEl.value = memo.content;
    if (this.editDateTimeEl) {
      this.editDateTimeEl.value = `${memo.date}T${memo.time}`;
    }
    if (this.settings.mobileInputStyle === "fab") {
      this.contentEl.addClass("is-fab-expanded");
    }
    this.inputEl.focus();
    const len = this.inputEl.value.length;
    this.inputEl.setSelectionRange(len, len);
    this.updateEditBanner();
    this.autoResizeInput();
  }
  /** 退出编辑模式，恢复新建笔记状态
   *  v1.1.7: 恢复之前暂存的草稿
   *  v1.6.0: 清空 datetime input
   */
  exitEditMode() {
    this.editingMemo = null;
    this.inputEl.value = this.loadDraft();
    if (this.editDateTimeEl) this.editDateTimeEl.value = "";
    this.updateEditBanner();
    this.autoResizeInput();
    this.syncInputCardContentState();
    if (this.settings.mobileInputStyle === "fab" && !this.inputEl.value.trim()) {
      this.collapseFabInput(true);
    }
  }
  /** 刷新编辑模式的 UI 状态（取消按钮显隐 + 输入卡片的编辑态高亮）
   *  v1.6.0: 同步控制 datetime-local 输入框的显隐
   */
  updateEditBanner() {
    if (!this.editBannerEl) return;
    const inputCard = this.inputEl.closest(".memoria-input-card");
    if (this.editingMemo) {
      this.editBannerEl.removeClass("memoria-hidden");
      this.editDateTimeEl?.removeClass("memoria-hidden");
      inputCard?.addClass("is-editing");
      this.inputEl.setAttr(
        "placeholder",
        t("input.editPlaceholder", {
          date: this.editingMemo.date,
          time: this.editingMemo.time
        })
      );
    } else {
      this.editBannerEl.addClass("memoria-hidden");
      this.editDateTimeEl?.addClass("memoria-hidden");
      inputCard?.removeClass("is-editing");
      if (this.filter.tag) {
        this.inputEl.setAttr(
          "placeholder",
          t("input.placeholderWithTag", { tag: this.filter.tag })
        );
      } else {
        this.inputEl.setAttr("placeholder", t("input.placeholder"));
      }
    }
  }
  // ====================== 渲染 ======================
  /**
   * v1.4.8: 外部视图（年度全景图等）调用：筛选到某一天的笔记并重绘。
   *   和侧栏月历点某天走同一条路径：清空其他筛选 → 设置 filter.date → 重渲染。
   */
  focusOnDate(date) {
    this.filter.date = date;
    this.calendarDisplay = {
      year: Number(date.slice(0, 4)),
      month: Number(date.slice(5, 7)) - 1
    };
    this.filter.preset = "all";
    this.filter.year = null;
    this.filter.tag = null;
    this.filter.keyword = "";
    if (this.searchEl) this.searchEl.value = "";
    this.pageLimit = this.getInitialPageLimit();
    this.renderAll();
  }
  renderAll() {
    this.syncFabMode();
    this.syncContentWidth();
    this.renderSidebar();
    this.renderList();
  }
  renderSidebar() {
    if (!this.overviewModeOverridden) {
      this.overviewMode = this.settings.defaultOverviewMode || "heatmap";
    }
    this.sidebarEl.empty();
    const memos = this.store.getAll();
    const tagSet = /* @__PURE__ */ new Set();
    const daySet = /* @__PURE__ */ new Set();
    let imageCount = 0;
    let linkCount = 0;
    let noTagCount = 0;
    let pinnedCount = 0;
    let starredCount = 0;
    const todayStrForSidebar = fmtDateLocal(/* @__PURE__ */ new Date());
    const todayMMDD = todayStrForSidebar.slice(5);
    let onThisDayCount = 0;
    let todayCount = 0;
    let weekCount = 0;
    let todoCount = 0;
    const weekMondayTs = (() => {
      const now = /* @__PURE__ */ new Date();
      const monday = new Date(now);
      const dow = (now.getDay() + 6) % 7;
      monday.setDate(now.getDate() - dow);
      monday.setHours(0, 0, 0, 0);
      return monday.getTime();
    })();
    const activeMemos = memos.filter((m) => !m.isDeleted);
    for (const m of activeMemos) {
      for (const t2 of m.tags) if (!RESERVED_TAGS.has(t2)) tagSet.add(t2);
      daySet.add(m.date);
      if (m.hasImage) imageCount++;
      if (m.hasLink) linkCount++;
      if (m.isPinned) pinnedCount++;
      if (m.isStarred) starredCount++;
      if (m.hasOpenTask) todoCount++;
      if (m.date === todayStrForSidebar) todayCount++;
      if (m.datetime.getTime() >= weekMondayTs) weekCount++;
      if (m.date.slice(5) === todayMMDD && m.date !== todayStrForSidebar)
        onThisDayCount++;
      const effectiveTags = m.tags.filter((t2) => !RESERVED_TAGS.has(t2));
      if (effectiveTags.length === 0) noTagCount++;
    }
    const stats = this.sidebarEl.createDiv({ cls: "memoria-stats" });
    this.renderStatItem(stats, activeMemos.length.toString(), t("stats.memos"));
    this.renderStatItem(stats, tagSet.size.toString(), t("stats.tags"));
    this.renderStatItem(stats, daySet.size.toString(), t("stats.days"));
    this.renderOverview(this.sidebarEl, activeMemos);
    this.renderDailyGoal(this.sidebarEl, activeMemos);
    this.sidebarEl.createDiv({
      cls: "memoria-sidebar-section",
      text: t("sidebar.section.views")
    });
    const presets = [
      { key: "all", icon: "layout-grid", text: t("sidebar.all"), count: activeMemos.length },
      { key: "pinned", icon: "pin", text: t("sidebar.pinned"), count: pinnedCount },
      { key: "starred", icon: "star", text: t("sidebar.starred"), count: starredCount },
      // v1.4.13: 加上条数显示，让侧栏所有视图入口右侧数字"对齐"，
      //   视觉节奏统一；也能一眼看到今天 / 本周的活跃度
      { key: "today", icon: "calendar", text: t("sidebar.today"), count: todayCount },
      { key: "week", icon: "calendar-days", text: t("sidebar.week"), count: weekCount },
      // v1.5.0: 待办视图 —— 筛出含未完成 `- [ ]` 的 memo。
      //   勾完所有 task 后这条自动从视图消失（借助 v1.4.x 的"勾选回写 md"闭环）
      { key: "todo", icon: "check-square", text: t("sidebar.todo"), count: todoCount },
      // v1.1.19: 合并每日回顾 + 随机回顾 → 统一"回顾"入口
      //   默认先看"往年的今天"，没有时 empty 状态里再引导去"随机 5 条"
      {
        key: "random",
        icon: "shuffle",
        text: t("list.presetRandom")
      },
      {
        key: "on-this-day",
        icon: "history",
        text: t("list.presetOnThisDay"),
        count: onThisDayCount
      }
    ];
    for (const p of presets) {
      this.renderNavItem(p.key, p.icon, p.text, p.count);
    }
    const yearCount = /* @__PURE__ */ new Map();
    for (const m of activeMemos) {
      const y = m.date.substring(0, 4);
      yearCount.set(y, (yearCount.get(y) ?? 0) + 1);
    }
    if (this.settings.showSidebarYears && yearCount.size) {
      const head = this.sidebarEl.createDiv({
        cls: "memoria-sidebar-section memoria-section-collapsible" + (this.yearsExpanded ? "" : " is-collapsed"),
        text: t("sidebar.section.years")
      });
      head.addEventListener("click", () => {
        this.yearsExpanded = !this.yearsExpanded;
        this.renderSidebar();
      });
      if (this.yearsExpanded) {
        const body = this.sidebarEl.createDiv({ cls: "memoria-section-body" });
        const years = [...yearCount.entries()].sort(
          (a, b) => a[0] < b[0] ? 1 : -1
        );
        for (const [y, c] of years) {
          const el = body.createDiv({
            cls: "memoria-nav-item" + (this.filter.year === y ? " active" : "")
          });
          el.setAttr("data-year", y);
          const icon = el.createDiv({ cls: "memoria-nav-icon" });
          (0, import_obsidian7.setIcon)(icon, "calendar");
          el.createSpan({ cls: "memoria-nav-text", text: y });
          el.createSpan({ cls: "memoria-nav-count", text: String(c) });
          el.addEventListener("click", () => {
            this.filter.year = this.filter.year === y ? null : y;
            this.filter.preset = "all";
            this.pageLimit = this.getInitialPageLimit();
            this.renderList();
            this.syncSidebarActive();
          });
        }
      }
    }
    {
      const tagCount = /* @__PURE__ */ new Map();
      for (const m of activeMemos)
        for (const tag of m.tags) {
          if (RESERVED_TAGS.has(tag)) continue;
          tagCount.set(tag, (tagCount.get(tag) ?? 0) + 1);
        }
      const head = this.sidebarEl.createDiv({
        cls: "memoria-sidebar-section memoria-tags-heading memoria-section-collapsible" + (this.tagsExpanded ? "" : " is-collapsed"),
        text: t("sidebar.section.tags")
      });
      head.addEventListener("click", () => {
        this.tagsExpanded = !this.tagsExpanded;
        this.renderSidebar();
      });
      if (this.tagsExpanded) {
        const body = this.sidebarEl.createDiv({ cls: "memoria-section-body" });
        if (tagCount.size) {
          const sorted = [...tagCount.entries()].sort(
            (a, b) => a[0].localeCompare(b[0], void 0, { numeric: true })
          );
          for (const [tag, c] of sorted) {
            const el = body.createDiv({
              cls: "memoria-nav-item memoria-tag-item" + (this.filter.tag === tag ? " active" : "")
            });
            el.setAttr("data-tag", tag);
            const icon = el.createDiv({ cls: "memoria-nav-icon" });
            (0, import_obsidian7.setIcon)(icon, "tag");
            el.createSpan({ cls: "memoria-nav-text", text: tag });
            el.createSpan({ cls: "memoria-nav-count", text: String(c) });
            el.addEventListener("click", () => {
              this.filter.tag = this.filter.tag === tag ? null : tag;
              this.filter.preset = "all";
              this.pageLimit = this.getInitialPageLimit();
              this.renderList();
              this.syncSidebarActive();
            });
          }
        } else {
          body.createDiv({
            cls: "memoria-sidebar-hint",
            text: t("sidebar.tagsEmpty")
          });
        }
      }
    }
  }
  applyPreset(key) {
    this.filter.preset = key;
    this.filter.tag = null;
    this.filter.year = null;
    this.filter.date = null;
    if (key === "random") this.filter.randomSeed = Date.now();
    this.pageLimit = this.getInitialPageLimit();
    this.renderList();
    this.syncSidebarActive();
  }
  syncSidebarActive() {
    const preset = this.filter.preset;
    const year = this.filter.year;
    const tag = this.filter.tag;
    this.sidebarEl.querySelectorAll(".memoria-nav-item[data-preset]").forEach((el) => {
      el.toggleClass("active", el.dataset.preset === preset && !tag && !year);
    });
    this.sidebarEl.querySelectorAll(".memoria-nav-item[data-year]").forEach((el) => {
      el.toggleClass("active", el.dataset.year === year);
    });
    this.sidebarEl.querySelectorAll(".memoria-nav-item[data-tag]").forEach((el) => {
      el.toggleClass("active", el.dataset.tag === tag);
    });
  }
  renderNavItem(key, icon, text, count, parentEl = this.sidebarEl) {
    const isActive = this.filter.preset === key && !this.filter.tag && !this.filter.year;
    const el = parentEl.createDiv({
      cls: "memoria-nav-item" + (isActive ? " active" : "")
    });
    el.setAttr("data-preset", String(key));
    const iconEl = el.createDiv({ cls: "memoria-nav-icon" });
    (0, import_obsidian7.setIcon)(iconEl, icon);
    el.createSpan({ cls: "memoria-nav-text", text });
    if (count !== void 0) {
      el.createSpan({ cls: "memoria-nav-count", text: String(count) });
    }
    el.addEventListener("click", () => this.applyPreset(key));
  }
  renderStatItem(parent, num, label) {
    const item = parent.createDiv({ cls: "memoria-stat" });
    item.createDiv({ cls: "memoria-stat-num", text: num });
    item.createDiv({ cls: "memoria-stat-label", text: label });
  }
  /** 热力图 / 月历 / 宠物视图容器（v2.1.0 三态切换，按钮在统计条上） */
  renderOverview(parent, memos) {
    const wrap = parent.createDiv({ cls: "memoria-overview" });
    const content = wrap.createDiv({ cls: "memoria-overview-content" });
    if (this.overviewMode === "heatmap") {
      this.renderHeatmap(content, memos);
    } else if (this.overviewMode === "calendar") {
      const activeCalendarMonth = this.filter.date ? {
        year: Number(this.filter.date.slice(0, 4)),
        month: Number(this.filter.date.slice(5, 7)) - 1
      } : null;
      const shown = this.calendarDisplay ?? activeCalendarMonth ?? {
        year: (/* @__PURE__ */ new Date()).getFullYear(),
        month: (/* @__PURE__ */ new Date()).getMonth()
      };
      renderCalendar(content, memos, {
        activeDate: this.filter.date,
        onMonthChange: (year, month) => {
          this.calendarDisplay = { year, month };
        },
        onPickDate: (d) => {
          this.calendarDisplay = {
            year: Number(d.slice(0, 4)),
            month: Number(d.slice(5, 7)) - 1
          };
          this.filter.date = this.filter.date === d ? null : d;
          this.filter.preset = "all";
          this.pageLimit = this.getInitialPageLimit();
          this.renderList();
        }
      }, shown.year, shown.month);
    } else {
      this.renderBuddyView(content, memos);
    }
  }
  /** v2.1.0: 渲染宠物视图（首次未孵化时显示蛋 + 起名输入框） */
  renderBuddyView(parent, memos) {
    const data = this.settings.buddy;
    if (!data) {
      renderEgg(parent, (chosenName) => {
        void (async () => {
          const vaultName = this.app.vault.getName();
          const hatched = hatch(vaultName, chosenName);
          this.settings.buddy = {
            species: hatched.species,
            rarity: hatched.rarity,
            eye: hatched.eye,
            hat: hatched.hat,
            shiny: hatched.shiny,
            name: hatched.name,
            hatchedAt: hatched.hatchedAt,
            seed: hatched.seed
          };
          await this.plugin.saveSettings();
          this.buddyJustHatched = true;
          this.renderSidebar();
        })().catch((err) => {
          console.error("[Memoria] Failed to hatch buddy:", err);
        });
      });
      return;
    }
    const buddy = {
      species: data.species,
      rarity: data.rarity,
      eye: data.eye,
      hat: data.hat,
      shiny: data.shiny,
      name: data.name,
      hatchedAt: data.hatchedAt,
      seed: data.seed
    };
    const memoCountIncreased = this.buddyLastMemoCount >= 0 && memos.length > this.buddyLastMemoCount;
    if (this.buddyQuipCache === null || memoCountIncreased) {
      this.buddyQuipCache = pickQuip(buddy, memos);
    }
    this.buddyLastMemoCount = memos.length;
    const justHatched = this.buddyJustHatched;
    this.buddyJustHatched = false;
    renderBuddy(parent, buddy, memos, this.buddyQuipCache, {
      onRename: () => {
        void this.openBuddyRename(buddy.name).catch((err) => {
          console.error("[Memoria] Failed to rename buddy:", err);
        });
      },
      justHatched
    });
  }
  /** v2.1.0-iter10: 双击宠物名打开重命名弹窗 */
  async openBuddyRename(currentName) {
    const newName = await this.promptAsync(t("buddy.rename.title"), currentName);
    if (newName === null) return;
    const trimmed = newName.trim();
    if (!trimmed || trimmed === currentName) return;
    if (!this.settings.buddy) return;
    this.settings.buddy.name = trimmed.slice(0, 20);
    await this.plugin.saveSettings();
    this.renderSidebar();
  }
  /** v2.1.0-iter10: 异步输入弹窗（基于 confirmAsync 改造）—— 比浏览器原生 prompt() 不劫持焦点 */
  promptAsync(title, defaultValue) {
    return new Promise((resolve) => {
      const backdrop = activeDocument.body.createDiv({ cls: "memoria-modal-backdrop" });
      const box = backdrop.createDiv({ cls: "memoria-modal memoria-confirm" });
      box.createDiv({ cls: "memoria-modal-title", text: title });
      const input = box.createEl("input", {
        cls: "memoria-buddy-egg-input",
        attr: { type: "text", maxlength: "20", value: defaultValue }
      });
      const btns = box.createDiv({ cls: "memoria-modal-btns" });
      const cancel = btns.createEl("button", { text: t("buddy.rename.cancel") });
      const ok = btns.createEl("button", {
        text: t("buddy.rename.save"),
        cls: "mod-cta"
      });
      let settled = false;
      let pendingMouseUp = null;
      const cleanup = () => {
        if (pendingMouseUp) {
          activeDocument.removeEventListener("mouseup", pendingMouseUp, true);
          pendingMouseUp = null;
        }
      };
      this.register(() => {
        if (settled) return;
        settled = true;
        backdrop.remove();
        activeDocument.removeEventListener("keydown", onKey, true);
        cleanup();
        window.setTimeout(() => resolve(null), 0);
      });
      const close = (result) => {
        if (settled) return;
        settled = true;
        backdrop.remove();
        activeDocument.removeEventListener("keydown", onKey, true);
        cleanup();
        window.setTimeout(() => resolve(result), 0);
      };
      const onKey = (e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          close(null);
        } else if (e.key === "Enter") {
          e.preventDefault();
          close(input.value);
        }
      };
      cancel.addEventListener("click", () => close(null));
      ok.addEventListener("click", () => close(input.value));
      backdrop.addEventListener("mousedown", (e) => {
        if (e.target !== backdrop) return;
        cleanup();
        const up = (ev) => {
          activeDocument.removeEventListener("mouseup", up, true);
          pendingMouseUp = null;
          if (ev.target === backdrop) close(null);
        };
        pendingMouseUp = up;
        activeDocument.addEventListener("mouseup", up, true);
      });
      activeDocument.addEventListener("keydown", onKey, true);
      window.setTimeout(() => {
        input.focus();
        input.select();
      }, 50);
    });
  }
  /**
   * v1.4.0 → v1.4.1: 每日打卡进度条 + 右侧靶心 + 视图切换按钮
   *
   * 布局（参考 Thino）：
   *   [═══════ 进度条 ═══════]  ⊙  📅
   *   └── 点击跳"今天"  hover tooltip  切换热力图↔月历
   *
   * 达成目标首次 Notice："今日打卡完成 🎉"（同一天只弹一次）
   */
  renderDailyGoal(parent, memos) {
    const goal = Math.max(1, this.settings.dailyGoal || 5);
    const todayStr = fmtDateLocal(/* @__PURE__ */ new Date());
    let todayCount = 0;
    for (const m of memos) {
      if (m.date === todayStr) todayCount++;
    }
    const pct = Math.min(100, Math.round(todayCount / goal * 100));
    const isDone = todayCount >= goal;
    if (isDone && this.dailyGoalNoticedDate !== todayStr) {
      this.dailyGoalNoticedDate = todayStr;
      window.setTimeout(() => {
        new import_obsidian7.Notice(t("notice.dailyGoalDone", { n: todayCount }));
      }, 200);
    }
    if (this.dailyGoalNoticedDate && this.dailyGoalNoticedDate !== todayStr) {
      this.dailyGoalNoticedDate = null;
    }
    const goalTooltip = isDone ? t("list.dailyGoalExceed", {
      goal,
      done: todayCount,
      extra: todayCount - goal
    }) : t("list.dailyGoalDone", { goal, done: todayCount });
    const row = parent.createDiv({
      cls: `memoria-daily-goal-row${isDone ? " is-done" : ""}`
    });
    const barWrap = row.createDiv({
      cls: "memoria-daily-goal",
      attr: {
        // v1.4.2: 只用 aria-label（Obsidian 会转成气泡），删掉 title 避免双层 tooltip
        "aria-label": goalTooltip
      }
    });
    barWrap.addEventListener("click", () => this.applyPreset("today"));
    const bar = barWrap.createDiv({ cls: "memoria-daily-goal-bar" });
    const fill = bar.createDiv({ cls: "memoria-daily-goal-fill" });
    fill.style.width = `${pct}%`;
    const actions = row.createDiv({ cls: "memoria-daily-goal-actions" });
    const targetBtn = actions.createEl("button", {
      cls: "memoria-icon-btn memoria-daily-goal-target",
      attr: {
        "aria-label": goalTooltip
      }
    });
    (0, import_obsidian7.setIcon)(targetBtn, "crosshair");
    targetBtn.addEventListener("click", (e) => e.preventDefault());
    const nextMode = this.overviewMode === "heatmap" ? "calendar" : this.overviewMode === "calendar" ? "buddy" : "heatmap";
    const nextIcon = nextMode === "calendar" ? "calendar" : nextMode === "buddy" ? "paw-print" : "activity";
    const nextLabelKey = nextMode === "calendar" ? "toolbar.toCalendar" : nextMode === "buddy" ? "toolbar.toBuddy" : "toolbar.toHeatmap";
    const switchBtn = actions.createEl("button", {
      cls: "memoria-icon-btn memoria-daily-goal-switch",
      attr: {
        "aria-label": t(nextLabelKey)
      }
    });
    (0, import_obsidian7.setIcon)(switchBtn, nextIcon);
    switchBtn.addEventListener("click", () => {
      this.overviewMode = nextMode;
      this.overviewModeOverridden = true;
      this.renderSidebar();
    });
  }
  renderHeatmap(parent, memos) {
    const weeks = 14;
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const curDow = today.getDay();
    const endSunday = new Date(today);
    endSunday.setDate(today.getDate() - curDow);
    const startSunday = new Date(endSunday);
    startSunday.setDate(endSunday.getDate() - (weeks - 1) * 7);
    const dayMap = /* @__PURE__ */ new Map();
    for (const m of memos) dayMap.set(m.date, (dayMap.get(m.date) ?? 0) + 1);
    const grid = parent.createDiv({ cls: "memoria-heatmap" });
    for (let w = 0; w < weeks; w++) {
      const col = grid.createDiv({ cls: "memoria-heatmap-col" });
      for (let d = 0; d < 7; d++) {
        const day = new Date(startSunday);
        day.setDate(startSunday.getDate() + w * 7 + d);
        const key = fmtDateLocal(day);
        const count = dayMap.get(key) ?? 0;
        const level = count === 0 ? 0 : count < 2 ? 1 : count < 4 ? 2 : count < 7 ? 3 : 4;
        const cell = col.createDiv({
          cls: `memoria-heatmap-cell level-${level}`
        });
        if (day > today) cell.addClass("future");
        if (count > 0) {
          const dayMemos = memos.filter((m) => m.date === key);
          cell.addEventListener("mouseenter", () => {
            this.showHeatmapTooltip(cell, key, dayMemos);
          });
          cell.addEventListener("mouseleave", () => {
            this.hideHeatmapTooltip();
          });
          cell.addEventListener("click", () => {
            this.calendarDisplay = {
              year: Number(key.slice(0, 4)),
              month: Number(key.slice(5, 7)) - 1
            };
            this.filter.date = key;
            this.filter.preset = "all";
            this.renderList();
          });
          cell.addClass("memoria-clickable");
        } else {
          cell.setAttr(
            "title",
            `${key}  ${t("list.totalCount", { n: count })}`
          );
        }
      }
    }
  }
  showHeatmapTooltip(anchor, dateKey, memos) {
    this.hideHeatmapTooltip();
    const tip = activeDocument.body.createDiv({ cls: "memoria-heatmap-tooltip" });
    const head = tip.createDiv({ cls: "memoria-heatmap-tooltip-head" });
    head.createSpan({ text: dateKey });
    head.createSpan({
      cls: "memoria-heatmap-tooltip-count",
      text: t("list.totalCount", { n: memos.length })
    });
    const preview = memos.slice(0, 2);
    for (const m of preview) {
      const row = tip.createDiv({ cls: "memoria-heatmap-tooltip-row" });
      row.createSpan({ cls: "memoria-heatmap-tooltip-time", text: m.time });
      const imgTag = t("list.imageHolder");
      const snippet = m.content.replace(/!\[[^\]]*\]\([^)]+\)/g, imgTag).replace(/!\[\[[^\]]+\]\]/g, imgTag).replace(/#[^\s#]+/g, "").replace(/\s+/g, " ").trim().slice(0, 50);
      row.createSpan({
        cls: "memoria-heatmap-tooltip-text",
        text: snippet || t("list.noText")
      });
    }
    if (memos.length > 2) {
      tip.createDiv({
        cls: "memoria-heatmap-tooltip-more",
        text: t("list.heatmapMore", { n: memos.length - 2 })
      });
    }
    const rect = anchor.getBoundingClientRect();
    tip.setCssStyles({
      position: "fixed",
      left: Math.min(rect.right + 8, window.innerWidth - 280) + "px",
      top: Math.max(8, rect.top - 4) + "px",
      zIndex: "1000"
    });
    this.heatmapTooltipEl = tip;
  }
  hideHeatmapTooltip() {
    if (this.heatmapTooltipEl) {
      this.heatmapTooltipEl.remove();
      this.heatmapTooltipEl = null;
    }
  }
  buildTagTree(counts) {
    const root = {
      name: "",
      full: "",
      count: 0,
      self: 0,
      children: /* @__PURE__ */ new Map()
    };
    for (const [tag, c] of counts) {
      const parts = tag.split("/");
      let node = root;
      let acc = "";
      for (const p of parts) {
        acc = acc ? `${acc}/${p}` : p;
        if (!node.children.has(p)) {
          node.children.set(p, {
            name: p,
            full: acc,
            count: 0,
            self: 0,
            children: /* @__PURE__ */ new Map()
          });
        }
        node = node.children.get(p);
      }
      node.self += c;
    }
    this.sumTag(root);
    return root;
  }
  sumTag(node) {
    let total = node.self;
    for (const c of node.children.values()) total += this.sumTag(c);
    node.count = total;
    return total;
  }
  renderTagTree(parent, node, depth) {
    const children = [...node.children.values()].sort(
      (a, b) => b.count - a.count
    );
    for (const c of children) {
      const wrap = parent.createDiv({ cls: "memoria-tag-node" });
      const el = wrap.createDiv({
        cls: "memoria-nav-item memoria-tag-item" + (this.filter.tag === c.full ? " active" : "")
      });
      el.setAttr("data-tag", c.full);
      el.style.paddingLeft = `${12 + depth * 14}px`;
      const icon = el.createDiv({ cls: "memoria-nav-icon" });
      icon.setText("#");
      el.createSpan({ cls: "memoria-nav-text", text: c.name });
      el.createSpan({ cls: "memoria-nav-count", text: String(c.count) });
      el.addEventListener("click", () => {
        this.filter.tag = this.filter.tag === c.full ? null : c.full;
        this.filter.preset = "all";
        this.pageLimit = this.getInitialPageLimit();
        this.renderList();
        this.syncSidebarActive();
      });
      if (c.children.size) this.renderTagTree(wrap, c, depth + 1);
    }
  }
  // ====================== 过滤逻辑 ======================
  applyReviewFilters(memos) {
    const rf = this.reviewFilters;
    let result = memos;
    if (rf.year) result = result.filter((m) => m.date.startsWith(rf.year));
    if (rf.tag) {
      result = result.filter(
        (m) => m.tags.some((tag) => tag === rf.tag || tag.startsWith(rf.tag + "/"))
      );
    }
    if (rf.type === "starred") result = result.filter((m) => m.isStarred);
    else if (rf.type === "pinned") result = result.filter((m) => m.isPinned);
    else if (rf.type === "with-image") result = result.filter((m) => m.hasImage);
    else if (rf.type === "todo") result = result.filter((m) => m.hasOpenTask);
    const keyword = rf.keyword.trim().toLocaleLowerCase();
    if (keyword) {
      result = result.filter((m) => {
        const contentHit = m.content.toLocaleLowerCase().includes(keyword);
        const tagHit = m.tags.some((tag) => tag.toLocaleLowerCase().includes(keyword));
        return contentHit || tagHit || m.date.includes(keyword);
      });
    }
    return result;
  }
  getReviewFilterPoolCount() {
    return this.applyReviewFilters(this.getBaseFilteredMemos()).length;
  }
  renderReviewToolbar(parent) {
    const bar = parent.createDiv({ cls: "memoria-review-toolbar" });
    const makeSelect = (label, value, options, onChange) => {
      const wrap = bar.createDiv({ cls: "memoria-review-control" });
      const selectWrap = wrap.createDiv({ cls: "memoria-review-select-wrap" });
      const select = selectWrap.createEl("select", {
        cls: "memoria-review-select",
        attr: { "aria-label": label }
      });
      const chevron = selectWrap.createDiv({ cls: "memoria-review-select-icon" });
      (0, import_obsidian7.setIcon)(chevron, "chevron-down");
      for (const option of options) {
        select.createEl("option", {
          text: option.label,
          attr: { value: option.value }
        });
      }
      select.value = value;
      select.addEventListener("change", () => {
        onChange(select.value);
        this.filter.preset = "random";
        this.filter.randomSeed = Date.now();
        this.pageLimit = this.getInitialPageLimit();
        this.renderList();
      });
    };
    const memos = this.store.getAll();
    const years = Array.from(new Set(memos.map((m) => m.date.substring(0, 4)))).sort((a, b) => a < b ? 1 : -1);
    const tags = Array.from(
      new Set(memos.flatMap((m) => m.tags.filter((tag) => !RESERVED_TAGS.has(tag))))
    ).sort((a, b) => a.localeCompare(b));
    makeSelect(
      t("review.filter.year"),
      this.reviewFilters.year,
      [
        { value: "", label: t("review.filter.allYears") },
        ...years.map((year) => ({ value: year, label: year }))
      ],
      (value) => {
        this.reviewFilters.year = value;
      }
    );
    makeSelect(
      t("review.filter.tag"),
      this.reviewFilters.tag,
      [
        { value: "", label: t("review.filter.allTags") },
        ...tags.map((tag) => ({ value: tag, label: `#${tag}` }))
      ],
      (value) => {
        this.reviewFilters.tag = value;
      }
    );
    makeSelect(
      t("review.filter.type"),
      this.reviewFilters.type,
      [
        { value: "all", label: t("review.type.all") },
        { value: "starred", label: t("review.type.starred") },
        { value: "pinned", label: t("review.type.pinned") },
        { value: "with-image", label: t("review.type.withImage") },
        { value: "todo", label: t("review.type.todo") }
      ],
      (value) => {
        this.reviewFilters.type = value;
      }
    );
    const keywordWrap = bar.createDiv({ cls: "memoria-review-control memoria-review-keyword" });
    const keywordBox = keywordWrap.createDiv({ cls: "memoria-review-search-wrap" });
    const keywordIcon = keywordBox.createDiv({ cls: "memoria-review-search-icon" });
    (0, import_obsidian7.setIcon)(keywordIcon, "search");
    const keywordInput = keywordBox.createEl("input", {
      cls: "memoria-review-input",
      attr: {
        type: "text",
        placeholder: t("review.keyword.placeholder"),
        "aria-label": t("review.filter.keyword")
      }
    });
    keywordInput.value = this.reviewFilters.keyword;
    let isComposingKeyword = false;
    const applyKeywordNow = () => {
      const cursor = keywordInput.selectionStart ?? keywordInput.value.length;
      this.reviewFilters.keyword = keywordInput.value.trim();
      this.filter.preset = "random";
      this.filter.randomSeed = Date.now();
      this.pageLimit = this.getInitialPageLimit();
      this.renderList();
      const nextInput = this.listEl.querySelector(".memoria-review-input");
      nextInput?.focus();
      nextInput?.setSelectionRange(cursor, cursor);
    };
    const applyKeyword = (0, import_obsidian7.debounce)(() => {
      if (!isComposingKeyword) applyKeywordNow();
    }, 180);
    keywordInput.addEventListener("compositionstart", () => {
      isComposingKeyword = true;
    });
    keywordInput.addEventListener("compositionend", () => {
      isComposingKeyword = false;
      applyKeywordNow();
    });
    keywordInput.addEventListener("input", () => {
      if (!isComposingKeyword) applyKeyword();
    });
    const actions = bar.createDiv({ cls: "memoria-review-actions" });
    const rerollBtn = actions.createEl("button", { cls: "memoria-meta-btn" });
    (0, import_obsidian7.setIcon)(rerollBtn.createSpan(), "shuffle");
    rerollBtn.createSpan({ text: t("meta.reroll") });
    rerollBtn.addEventListener("click", () => {
      this.filter.preset = "random";
      this.filter.randomSeed = Date.now();
      this.renderList();
    });
    const resetBtn = actions.createEl("button", { cls: "memoria-meta-btn" });
    (0, import_obsidian7.setIcon)(resetBtn.createSpan(), "rotate-ccw");
    resetBtn.createSpan({ text: t("review.filter.reset") });
    resetBtn.addEventListener("click", () => {
      this.reviewFilters = { tag: "", year: "", type: "all", keyword: "" };
      this.filter.randomSeed = Date.now();
      this.renderList();
    });
    const backBtn = actions.createEl("button", { cls: "memoria-meta-btn" });
    (0, import_obsidian7.setIcon)(backBtn.createSpan(), "history");
    backBtn.createSpan({ text: t("meta.backToOnThisDay") });
    backBtn.addEventListener("click", () => {
      this.filter.preset = "on-this-day";
      this.renderList();
    });
  }
  getBaseFilteredMemos() {
    const all = this.store.getAll();
    const query = parseSearchQuery(this.filter.keyword);
    this.currentQuery = query;
    let result = all.filter((memo) => {
      if (this.filter.preset === "deleted") {
        if (!memo.isDeleted) return false;
      } else if (memo.isDeleted) {
        return false;
      }
      if (this.filter.year && !memo.date.startsWith(this.filter.year))
        return false;
      if (this.filter.date && memo.date !== this.filter.date) return false;
      if (this.filter.tag) {
        const hit = memo.tags.some(
          (mt) => mt === this.filter.tag || mt.startsWith(this.filter.tag + "/")
        );
        if (!hit) return false;
      }
      if (!matchesQuery(memo.content, memo.tags, memo.date, query)) {
        return false;
      }
      return true;
    });
    const todayStr = fmtDateLocal(/* @__PURE__ */ new Date());
    if (this.filter.preset === "today") {
      result = result.filter((m) => m.date === todayStr);
    } else if (this.filter.preset === "week") {
      const now = /* @__PURE__ */ new Date();
      const monday = new Date(now);
      const dow = (now.getDay() + 6) % 7;
      monday.setDate(now.getDate() - dow);
      monday.setHours(0, 0, 0, 0);
      result = result.filter((m) => m.datetime >= monday);
    } else if (this.filter.preset === "on-this-day") {
      const now = /* @__PURE__ */ new Date();
      const mo = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const mmdd = `${mo}-${day}`;
      result = result.filter(
        (m) => m.date.slice(5) === mmdd && m.date !== todayStr
      );
    } else if (this.filter.preset === "no-tag") {
      result = result.filter(
        (m) => m.tags.filter((t2) => !RESERVED_TAGS.has(t2)).length === 0
      );
    } else if (this.filter.preset === "with-image") {
      result = result.filter((m) => m.hasImage);
    } else if (this.filter.preset === "with-link") {
      result = result.filter((m) => m.hasLink);
    } else if (this.filter.preset === "pinned") {
      result = result.filter((m) => m.isPinned);
    } else if (this.filter.preset === "starred") {
      result = result.filter((m) => m.isStarred);
    } else if (this.filter.preset === "todo") {
      result = result.filter((m) => m.hasOpenTask);
    } else if (this.filter.preset === "deleted") {
      result = result.filter((m) => m.isDeleted);
    }
    result = result.slice().sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      const createdDiff = a.datetime.getTime() - b.datetime.getTime();
      const updatedDiff = (a.updatedAt ?? a.datetime.getTime()) - (b.updatedAt ?? b.datetime.getTime());
      switch (this.sortOrder) {
        case "created-asc":
          return createdDiff;
        case "updated-desc":
          return -updatedDiff || -createdDiff;
        case "updated-asc":
          return updatedDiff || createdDiff;
        case "created-desc":
        default:
          return -createdDiff;
      }
    });
    return result;
  }
  getFilteredMemos() {
    let result = this.getBaseFilteredMemos();
    const todayStr = fmtDateLocal(/* @__PURE__ */ new Date());
    if (this.filter.preset === "random" || this.filter.preset === "on-this-day") {
      result = this.applyReviewFilters(result);
      if (!result.length) return result;
      if (this.settings.enableSmartReview) {
        const todayMemos = this.store.getAll().filter((m) => m.date === todayStr);
        return pickSmartReview(result, {
          count: Math.min(5, result.length),
          todayStr,
          todayMemos
        });
      }
      const seed = this.filter.randomSeed ?? 1;
      return seededSample(result, Math.min(5, result.length), seed);
    }
    return result;
  }
  renderList() {
    this.listEl.empty();
    this.childComponent.unload();
    this.childComponent = new import_obsidian7.Component();
    this.childComponent.load();
    this.listEl.toggleClass("is-compact", this.settings.density === "compact");
    this.updateEditBanner();
    const memos = this.getFilteredMemos();
    const meta = this.listEl.createDiv({ cls: "memoria-list-meta" });
    const metaLeft = meta.createDiv({ cls: "memoria-list-meta-left" });
    const metaTools = meta.createDiv({ cls: "memoria-list-meta-tools" });
    metaLeft.createSpan({ text: this.describeFilter(memos.length) });
    const sortBtn = metaTools.createEl("button", {
      cls: "memoria-meta-btn memoria-sort-btn",
      attr: {
        type: "button",
        title: this.getSortLabel(),
        "aria-label": this.getSortLabel()
      }
    });
    (0, import_obsidian7.setIcon)(
      sortBtn,
      this.sortOrder.endsWith("-asc") ? "arrow-up-narrow-wide" : "arrow-down-wide-narrow"
    );
    sortBtn.addEventListener("click", (event) => {
      this.openSortMenu(event);
    });
    const quickFilters = metaTools.createDiv({ cls: "memoria-list-quick-filters" });
    const quickItems = [
      { key: "no-tag", icon: "tag", title: t("sidebar.noTag") },
      { key: "with-image", icon: "image", title: t("sidebar.withImage") },
      { key: "with-link", icon: "link", title: t("sidebar.withLink") }
    ];
    for (const item of quickItems) {
      const button = quickFilters.createEl("button", {
        cls: "memoria-meta-btn memoria-quick-filter" + (this.filter.preset === item.key ? " is-active" : ""),
        attr: { type: "button", title: item.title, "aria-label": item.title, "aria-pressed": String(this.filter.preset === item.key) }
      });
      (0, import_obsidian7.setIcon)(button, item.icon);
      button.addEventListener("click", () => {
        this.filter.preset = this.filter.preset === item.key ? "all" : item.key;
        this.filter.tag = null;
        this.filter.year = null;
        this.pageLimit = this.getInitialPageLimit();
        this.renderAll();
      });
    }
    const shareButton = quickFilters.createEl("button", {
      cls: "memoria-meta-btn memoria-quick-filter memoria-multi-share-button",
      attr: { type: "button", title: t("share.multiAction"), "aria-label": t("share.multiAction") }
    });
    (0, import_obsidian7.setIcon)(shareButton, "share-2");
    shareButton.addEventListener("click", () => {
      openMultiMemoSharePicker(this.app, memos, this.settings);
    });
    if (this.filter.preset === "random" || this.filter.preset === "on-this-day") {
      meta.createDiv({
        cls: "memoria-list-meta-right",
        text: t("review.poolCount", { n: this.getReviewFilterPoolCount() })
      });
      this.renderReviewToolbar(this.listEl);
    }
    if (memos.length === 0) {
      const empty = this.listEl.createDiv({ cls: "memoria-empty" });
      if (this.filter.preset === "on-this-day") {
        empty.createDiv({ cls: "memoria-empty-emoji", text: "\u{1F570}\uFE0F" });
        empty.createDiv({
          cls: "memoria-empty-text",
          text: t("empty.onThisDay")
        });
        empty.createDiv({
          cls: "memoria-empty-sub",
          text: t("empty.onThisDaySub")
        });
        const jumpBtn = empty.createEl("button", {
          cls: "memoria-empty-btn"
        });
        (0, import_obsidian7.setIcon)(jumpBtn.createSpan(), "shuffle");
        jumpBtn.createSpan({ text: t("empty.onThisDayBtn") });
        jumpBtn.addEventListener("click", () => {
          this.filter.preset = "random";
          this.filter.randomSeed = Date.now();
          this.renderList();
        });
        return;
      }
      if (this.filter.preset === "todo") {
        empty.createDiv({ cls: "memoria-empty-emoji", text: "\u{1F389}" });
        empty.createDiv({
          cls: "memoria-empty-text",
          text: t("empty.todo")
        });
        empty.createDiv({
          cls: "memoria-empty-sub",
          text: t("empty.todoSub")
        });
        return;
      }
      empty.createDiv({ cls: "memoria-empty-emoji", text: "\u{1F4ED}" });
      empty.createDiv({
        cls: "memoria-empty-text",
        text: t("empty.default")
      });
      empty.createDiv({
        cls: "memoria-empty-sub",
        text: t("empty.defaultSub")
      });
      return;
    }
    const visible = memos.slice(0, this.pageLimit);
    const pinnedMemos = visible.filter((m) => m.isPinned);
    const normalMemos = visible.filter((m) => !m.isPinned);
    if (pinnedMemos.length) {
      const pinGroup = this.listEl.createDiv({
        cls: "memoria-day-group memoria-pin-group"
      });
      const pinHead = pinGroup.createDiv({
        cls: "memoria-day-head memoria-pin-head"
      });
      const pinIcon = pinHead.createSpan({ cls: "memoria-pin-head-icon" });
      (0, import_obsidian7.setIcon)(pinIcon, "pin");
      pinHead.createSpan({ text: t("list.pinnedHead", { n: pinnedMemos.length }) });
      for (const m of pinnedMemos) this.renderMemoCard(pinGroup, m);
    }
    const groups = /* @__PURE__ */ new Map();
    for (const m of normalMemos) {
      const arr = groups.get(m.date) ?? [];
      arr.push(m);
      groups.set(m.date, arr);
    }
    const todayStr = fmtDateLocal(/* @__PURE__ */ new Date());
    const ydDate = /* @__PURE__ */ new Date();
    ydDate.setDate(ydDate.getDate() - 1);
    const yesterdayStr = fmtDateLocal(ydDate);
    for (const [date, list] of groups) {
      const group = this.listEl.createDiv({ cls: "memoria-day-group" });
      group.dataset.date = date;
      const head = group.createDiv({ cls: "memoria-day-head" });
      const d = /* @__PURE__ */ new Date(date + "T00:00:00");
      const wd = t(`weekday.${d.getDay()}`);
      let label = `${date}  ${wd}`;
      if (date === todayStr) label = `${t("date.today")}  ${wd}`;
      else if (date === yesterdayStr) label = `${t("date.yesterday")}  ${wd}`;
      head.setText(label);
      for (const m of list) this.renderMemoCard(group, m);
    }
    if (this.pageLimit < memos.length) {
      const more = this.listEl.createDiv({ cls: "memoria-load-more" });
      more.setText(t("list.loadMore", { n: memos.length - this.pageLimit }));
    }
    this.syncVimSelection();
  }
  /**
   * v2.0.3: 增量追加更多笔记，避免 renderList 全清重建带来的滚动闪烁。
   *
   * 问题背景：
   *   原实现滚动到底时调用 renderList() → listEl.empty() → 全部重建。
   *   用户看到视野内的卡片被销毁一瞬间再重新渲染，像"跳一下"。
   *
   * 新实现：
   *   1. 移除旧的 "load-more" 提示和 empty 占位（如果有）
   *   2. 从 memos[prevLimit..newLimit] 取切片，按日期分组追加到 listEl 末尾
   *   3. 如果新切片第一天的日期 === listEl 里最后一个 day-group 的日期 →
   *      **把那一天的剩余 memo 追加到已有 group**（不新建 day-head）
   *   4. 之后每个新日期都建新 day-group
   *   5. 最后加回 "load-more" 提示（如果还有更多）
   *
   * 限制：
   *   - 只用于"普通分组"的追加。置顶分组不参与分页（永远一次性渲染在顶）。
   *   - filter.preset === "random" 时禁用（随机列表不分页）。
   */
  appendMoreMemos(allMemos, prevLimit, newLimit) {
    const oldMore = this.listEl.querySelector(".memoria-load-more");
    oldMore?.remove();
    const oldEmpty = this.listEl.querySelector(".memoria-empty");
    oldEmpty?.remove();
    const slice = allMemos.slice(prevLimit, newLimit).filter((m) => !m.isPinned);
    if (slice.length === 0) return;
    const groups = /* @__PURE__ */ new Map();
    for (const m of slice) {
      const arr = groups.get(m.date) ?? [];
      arr.push(m);
      groups.set(m.date, arr);
    }
    const todayStr = fmtDateLocal(/* @__PURE__ */ new Date());
    const ydDate = /* @__PURE__ */ new Date();
    ydDate.setDate(ydDate.getDate() - 1);
    const yesterdayStr = fmtDateLocal(ydDate);
    const allGroups = this.listEl.querySelectorAll(
      ".memoria-day-group:not(.memoria-pin-group)"
    );
    const lastGroup = allGroups.length > 0 ? allGroups[allGroups.length - 1] : null;
    const lastGroupDate = lastGroup?.dataset.date ?? null;
    let isFirstGroup = true;
    for (const [date, list] of groups) {
      if (isFirstGroup && lastGroup && date === lastGroupDate) {
        for (const m of list) this.renderMemoCard(lastGroup, m);
      } else {
        const group = this.listEl.createDiv({ cls: "memoria-day-group" });
        group.dataset.date = date;
        const head = group.createDiv({ cls: "memoria-day-head" });
        const d = /* @__PURE__ */ new Date(date + "T00:00:00");
        const wd = t(`weekday.${d.getDay()}`);
        let label = `${date}  ${wd}`;
        if (date === todayStr) label = `${t("date.today")}  ${wd}`;
        else if (date === yesterdayStr) label = `${t("date.yesterday")}  ${wd}`;
        head.setText(label);
        for (const m of list) this.renderMemoCard(group, m);
      }
      isFirstGroup = false;
    }
    if (this.pageLimit < allMemos.length) {
      const more = this.listEl.createDiv({ cls: "memoria-load-more" });
      more.setText(t("list.loadMore", { n: allMemos.length - this.pageLimit }));
    }
  }
  describeFilter(n) {
    const parts = [];
    const presetMap = {
      today: `\u2600\uFE0F ${t("sidebar.today")}`,
      week: `\u{1F5D3}\uFE0F ${t("sidebar.week")}`,
      // v1.1.19: 两个"回顾"合并为一个入口，但内部仍有两种视图（每日/随机）
      random: t("list.presetRandom"),
      "on-this-day": t("list.presetOnThisDay"),
      "no-tag": `\u{1F3F7}\uFE0F ${t("sidebar.noTag")}`,
      "with-image": `\u{1F5BC}\uFE0F ${t("sidebar.withImage")}`,
      "with-link": `\u{1F517} ${t("sidebar.withLink")}`,
      pinned: t("list.presetPinned"),
      starred: t("list.presetStarred"),
      todo: `\u2705 ${t("sidebar.todo")}`
    };
    if (this.filter.preset !== "all") parts.push(presetMap[this.filter.preset]);
    if (this.filter.year) parts.push(this.filter.year);
    if (this.filter.date) parts.push(`\u{1F4C5} ${this.filter.date}`);
    if (this.filter.tag) parts.push(`#${this.filter.tag}`);
    if (this.filter.keyword) parts.push(`\u300C${this.filter.keyword}\u300D`);
    const prefix = parts.length ? parts.join(" \xB7 ") + " \xB7 " : "";
    return `${prefix}${t("list.totalCount", { n })}`;
  }
  getSortLabel() {
    switch (this.sortOrder) {
      case "created-asc":
        return t("sort.createdAsc");
      case "updated-desc":
        return t("sort.updatedDesc");
      case "updated-asc":
        return t("sort.updatedAsc");
      case "created-desc":
      default:
        return t("sort.createdDesc");
    }
  }
  openSortMenu(event) {
    const menu = new import_obsidian7.Menu();
    const items = [
      { title: t("sort.createdDesc"), value: "created-desc", icon: "arrow-down-wide-narrow" },
      { title: t("sort.createdAsc"), value: "created-asc", icon: "arrow-up-narrow-wide" },
      { title: t("sort.updatedDesc"), value: "updated-desc", icon: "arrow-down-wide-narrow" },
      { title: t("sort.updatedAsc"), value: "updated-asc", icon: "arrow-up-narrow-wide" }
    ];
    for (const item of items) {
      menu.addItem((menuItem) => {
        menuItem.setTitle(item.title).onClick(() => {
          if (this.sortOrder === item.value) return;
          this.sortOrder = item.value;
          this.renderList();
        });
        menuItem.setIcon(this.sortOrder === item.value ? "check" : item.icon);
      });
    }
    menu.showAtMouseEvent(event);
  }
  renderMemoCard(parent, memo) {
    let moodCls = "";
    if (this.settings.enableMoodColoring) {
      const mood = detectMood(memo.content);
      if (mood !== "neutral") moodCls = " " + moodClass(mood);
    }
    const card = parent.createDiv({
      cls: "memoria-card" + (memo.isPinned ? " is-pinned" : "") + (memo.isStarred ? " is-starred" : "") + (this.justCreatedAt && Math.abs(memo.datetime.getTime() - this.justCreatedAt) < 3e3 ? " is-just-added" : "") + (this.editingMemo === memo ? " is-editing" : "") + moodCls
    });
    card.addEventListener("click", () => {
      if (!this.settings.enableVimKeys) return;
      const cards = Array.from(this.listEl.querySelectorAll(".memoria-card"));
      const idx = cards.indexOf(card);
      if (idx < 0) return;
      this.vimSelectedIdx = idx;
      this.syncVimSelection();
    });
    card.addEventListener("dblclick", (e) => {
      const target = e.target;
      if (target.closest(".memoria-img-cell")) return;
      if (target.tagName === "A") return;
      this.enterEditMode(memo);
    });
    if (import_obsidian7.Platform.isMobile) {
      let pressTimer = null;
      let startX = 0;
      let startY = 0;
      const cancel = () => {
        if (pressTimer !== null) {
          window.clearTimeout(pressTimer);
          pressTimer = null;
        }
      };
      card.addEventListener("pointerdown", (e) => {
        const t2 = e.target;
        if (t2.closest(".memoria-img-cell") || t2.closest("a") || t2.closest("button") || t2.closest('input[type="checkbox"]')) {
          return;
        }
        startX = e.clientX;
        startY = e.clientY;
        pressTimer = window.setTimeout(() => {
          pressTimer = null;
          this.enterEditMode(memo);
        }, 500);
      });
      card.addEventListener("pointermove", (e) => {
        if (pressTimer === null) return;
        if (Math.abs(e.clientX - startX) > 6 || Math.abs(e.clientY - startY) > 6) {
          cancel();
        }
      });
      card.addEventListener("pointerup", cancel);
      card.addEventListener("pointercancel", cancel);
      card.addEventListener("pointerleave", cancel);
    }
    const head = card.createDiv({ cls: "memoria-card-head" });
    const timeWrap = head.createDiv({ cls: "memoria-card-time-wrap" });
    if (memo.isPinned) {
      const pinIcon = timeWrap.createSpan({ cls: "memoria-card-pin" });
      (0, import_obsidian7.setIcon)(pinIcon, "pin");
      pinIcon.setAttr("aria-label", t("card.pinnedMark"));
    }
    if (memo.isStarred) {
      const starIcon = timeWrap.createSpan({ cls: "memoria-card-star" });
      (0, import_obsidian7.setIcon)(starIcon, "star");
      starIcon.setAttr("aria-label", t("card.starredMark"));
    }
    timeWrap.createSpan({
      cls: "memoria-card-time",
      text: `${memo.date} ${memo.time}`
    });
    const actions = head.createDiv({ cls: "memoria-card-actions" });
    const quoteBtn = actions.createEl("button", {
      cls: "memoria-icon-btn memoria-card-quote",
      attr: { "aria-label": t("toolbar.quote") }
    });
    (0, import_obsidian7.setIcon)(quoteBtn, "quote");
    quoteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.quoteMemo(memo);
    });
    const menuBtn = actions.createEl("button", {
      cls: "memoria-icon-btn",
      attr: { "aria-label": t("toolbar.more") }
    });
    (0, import_obsidian7.setIcon)(menuBtn, "more-horizontal");
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.showMemoMenu(e, memo);
    });
    const { text: textNoTags, tags } = this.stripTags(memo.content);
    const { text: textForMd, images } = extractImages(
      this.app,
      textNoTags,
      memo.file
    );
    if (textForMd.trim()) {
      const body = card.createDiv({ cls: "memoria-card-body" });
      const normalizedMd = normalizeForRender(textForMd);
      const cacheKey = normalizedMd;
      const cached = this.mdCache.get(cacheKey);
      if (cached !== void 0) {
        body.appendChild(cached.cloneNode(true));
        this.mdCache.delete(cacheKey);
        this.mdCache.set(cacheKey, cached);
      } else {
        void import_obsidian7.MarkdownRenderer.render(
          this.app,
          normalizedMd,
          body,
          memo.file,
          this.childComponent
        ).then(() => {
          const frag = activeDocument.createDocumentFragment();
          for (const child of Array.from(body.childNodes)) {
            frag.appendChild(child.cloneNode(true));
          }
          this.mdCache.set(cacheKey, frag);
          if (this.mdCache.size > _MemoriaView.MD_CACHE_MAX) {
            const first = this.mdCache.keys().next();
            if (!first.done) this.mdCache.delete(first.value);
          }
        }).catch((err) => {
          console.error("[Memoria] Failed to render markdown:", err);
        });
      }
      this.bindTaskCheckboxes(body, memo, textForMd);
      this.wrapWideTables(body);
      this.bindInternalLinks(body, memo);
      if (this.currentQuery.includeTerms.length > 0) {
        this.highlightSearchTerms(body, this.currentQuery.includeTerms);
      }
    }
    if (images.length) {
      renderImageGrid(card, images, (idx) => openLightbox(images, idx));
    }
    const visibleTags = tags.filter((t2) => !RESERVED_TAGS.has(t2));
    if (visibleTags.length) {
      const tagRow = card.createDiv({ cls: "memoria-card-tags" });
      for (const t2 of visibleTags) {
        const pill = tagRow.createSpan({
          cls: "memoria-tag-pill",
          text: `#${t2}`
        });
        pill.addEventListener("click", () => {
          this.filter.tag = t2;
          this.filter.preset = "all";
          this.pageLimit = this.getInitialPageLimit();
          this.renderAll();
        });
      }
    }
    if (textForMd.trim()) {
      const body = card.querySelector(".memoria-card-body");
      if (body) this.applyCollapseIfNeeded(body, card);
    }
  }
  /**
   * 让 markdown 渲染产生的复选框可点击 —— 同步回写到 memo.content
   *
   * 注意：这里的 renderedText 是「已剥离标签、已剥离图片」的文本，
   * 它和 memo.content 的行号并不完全一致（因为剥离后的空行折叠会导致行错位）。
   * Bug fix (v1.1.2): 所以我们直接在 memo.content 原文里**精确定位第 N 条任务行**（第 N 个出现的 `- [ ]/[x]` 行），
   * 而不是用 indexOf(original) —— 后者遇到多条相同任务（比如两条 `- [ ] 读书`）只会改第一个。
   */
  bindTaskCheckboxes(body, memo, renderedText) {
    const boxes = body.querySelectorAll(
      'input[type="checkbox"]'
    );
    if (!boxes.length) return;
    const taskRe = /^(\s*[-*]\s+\[)( |x|X)(\]\s)/;
    const fenceRe = /^\s*(?:```|~~~)/;
    const contentLines = memo.content.split("\n");
    const taskLineNums = [];
    let inFence = false;
    contentLines.forEach((ln, idx) => {
      if (fenceRe.test(ln)) {
        inFence = !inFence;
        return;
      }
      if (inFence) return;
      if (taskRe.test(ln)) taskLineNums.push(idx);
    });
    if (boxes.length !== taskLineNums.length) {
      return;
    }
    boxes.forEach((box, i) => {
      box.disabled = false;
      box.addClass("memoria-clickable");
      box.addEventListener("click", (e) => {
        void (async () => {
          e.stopPropagation();
          const lineNum = taskLineNums[i];
          const lines = memo.content.split("\n");
          const original = lines[lineNum];
          const m = original.match(taskRe);
          if (!m) return;
          const checked = /[xX]/.test(m[2]);
          lines[lineNum] = original.replace(
            taskRe,
            checked ? "$1 $3" : "$1x$3"
          );
          const newContent = lines.join("\n");
          try {
            await this.store.editMemo(memo, newContent);
          } catch (err) {
            console.error("[Memoria] \u4EFB\u52A1\u52FE\u9009\u5931\u8D25:", err);
            new import_obsidian7.Notice(t("notice.checkFailed", { msg: err.message }));
          }
        })();
      });
    });
  }
  /**
   * 给表格外层加一个可横向滚动的容器，避免宽表格撑破卡片布局。
   */
  wrapWideTables(body) {
    const tables = body.querySelectorAll("table");
    tables.forEach((tb) => {
      const parent = tb.parentElement;
      if (!parent) return;
      if (parent.hasClass("memoria-table-wrap")) return;
      const wrap = createDiv({ cls: "memoria-table-wrap" });
      parent.insertBefore(wrap, tb);
      wrap.appendChild(tb);
    });
  }
  /**
   * v1.4.17: 给 Markdown 渲染出来的 [[双链]] 和 http(s):// 外链接入点击跳转。
   *
   * 背景：
   *   MarkdownRenderer.render() 只生成静态 DOM（`<a class="internal-link">`
   *   等），不会自动绑点击事件——OB 原生 editor / preview 是靠
   *   MarkdownView 内部的事件委托做的。自定义 ItemView 里用
   *   MarkdownRenderer.render 必须自己补点击处理，否则点 [[笔记名]] 毫无反应。
   *
   * 行为：
   *   - 单击：在当前 tab 打开对应笔记（mod-click 或 middle-click 新 tab）
   *   - 点 #标签：OB 原生 search 面板按 tag 搜索
   *   - 外链（http/https）：走 OB 的外链处理（尊重用户的"在浏览器打开"偏好）
   *
   * 用事件委托挂一次，所有当前/未来子节点的点击都走这里，性能零开销。
   */
  bindInternalLinks(body, memo) {
    body.addEventListener("click", (e) => {
      const target = e.target;
      if (!target) return;
      const internal = target.closest("a.internal-link");
      if (internal) {
        e.preventDefault();
        e.stopPropagation();
        const href = internal.getAttribute("data-href") || internal.getAttribute("href") || "";
        if (!href) return;
        const newLeaf = e.ctrlKey || e.metaKey || e.button === 1;
        void this.app.workspace.openLinkText(href, memo.file, newLeaf);
        return;
      }
      const tagLink = target.closest("a.tag");
      if (tagLink) {
        e.preventDefault();
        e.stopPropagation();
        const tag = (tagLink.getAttribute("href") || "").replace(/^#/, "");
        if (!tag) return;
        const search = this.app.internalPlugins?.getPluginById("global-search");
        search?.instance?.openGlobalSearch?.(`tag:#${tag}`);
        return;
      }
      const external = target.closest("a.external-link");
      if (external) {
        e.stopPropagation();
        return;
      }
    });
  }
  /**
   * v2.0.0: 搜索关键词高亮。
   *
   * 遍历 body 下所有**文本节点**（不碰 <a>、<code>、<pre> 内部），
   * 对每个节点做关键词替换 → 用 <mark class="memoria-search-hit"> wrap。
   *
   * 为什么不在 MarkdownRenderer 之前改 md 源文本？
   *   因为会破坏 markdown 语法（比如关键词如果是 "代码"，替换后变 "<mark>代码</mark>"
   *   会让本来应该被渲染成 **加粗** 的 markdown 不工作）。
   * 在渲染后的 DOM 上处理是最安全的方式。
   *
   * 性能：只在搜索有关键词时才调用，单条卡片 ~0.5-1ms。
   */
  highlightSearchTerms(body, terms) {
    if (terms.length === 0) return;
    const sorted = [...terms].sort((a, b) => b.length - a.length);
    const escaped = sorted.map(
      (t2) => t2.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );
    const re = new RegExp(`(${escaped.join("|")})`, "gi");
    const SKIP_TAGS = /* @__PURE__ */ new Set(["A", "CODE", "PRE", "MARK", "SCRIPT", "STYLE"]);
    const walk = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent ?? "";
        if (!re.test(text)) return;
        re.lastIndex = 0;
        const frag = activeDocument.createDocumentFragment();
        let lastIdx = 0;
        let m;
        while ((m = re.exec(text)) !== null) {
          if (m.index > lastIdx) {
            frag.appendChild(
              activeDocument.createTextNode(text.slice(lastIdx, m.index))
            );
          }
          const mark = activeDocument.createElement("mark");
          mark.className = "memoria-search-hit";
          mark.textContent = m[0];
          frag.appendChild(mark);
          lastIdx = m.index + m[0].length;
        }
        if (lastIdx < text.length) {
          frag.appendChild(activeDocument.createTextNode(text.slice(lastIdx)));
        }
        node.parentNode?.replaceChild(frag, node);
        return;
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node;
        if (SKIP_TAGS.has(el.tagName)) return;
        const children = Array.from(node.childNodes);
        for (const ch of children) walk(ch);
      }
    };
    walk(body);
  }
  /**
   * v1.3.0 → v1.3.6: 长笔记折叠
   *
   * 思路演进：
   *   v1.3.0：按钮作为 body 的兄弟，全宽大横条
   *   v1.3.4：按钮 appendChild 到 body 内部，绝对定位到 body 右下角
   *   v1.3.6：按钮永远挂在**卡片最后一个元素**（tagRow / imgGrid / body）的末尾，
   *           通过 `margin-left: auto` 右对齐，和该元素的最后一行水平对齐。
   *           这样不论有没有图片/标签，按钮都在"卡片最后一行"的右边。
   */
  applyCollapseIfNeeded(body, card) {
    const lineLimit = Number(this.settings.collapseLineLimit);
    if (!Number.isFinite(lineLimit) || lineLimit <= 0) return;
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const style = window.getComputedStyle(body);
        let lineH = parseFloat(style.lineHeight);
        if (!isFinite(lineH) || lineH <= 0) {
          lineH = parseFloat(style.fontSize) * 1.5;
        }
        if (!isFinite(lineH) || lineH <= 0) lineH = 24;
        const full = body.scrollHeight;
        const thresholdPx = lineH * lineLimit;
        if (full <= thresholdPx + 12) return;
        body.addClass("is-collapsed");
        body.style.setProperty("--memoria-collapse-max", `${thresholdPx}px`);
        const btn = createEl("button", {
          cls: "memoria-collapse-toggle"
        });
        const label = btn.createSpan({
          cls: "memoria-collapse-label",
          text: t("card.collapseFull")
        });
        const iconSpan = btn.createSpan({ cls: "memoria-collapse-icon" });
        (0, import_obsidian7.setIcon)(iconSpan, "chevron-down");
        const placeBtn = () => {
          const tagRow = card.querySelector(
            ".memoria-card-tags"
          );
          if (tagRow) {
            tagRow.appendChild(btn);
          } else {
            card.appendChild(btn);
          }
        };
        placeBtn();
        let expanded = false;
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          expanded = !expanded;
          if (expanded) {
            body.removeClass("is-collapsed");
            (0, import_obsidian7.setIcon)(iconSpan, "chevron-up");
            label.setText(t("card.collapseFold"));
          } else {
            body.addClass("is-collapsed");
            (0, import_obsidian7.setIcon)(iconSpan, "chevron-down");
            label.setText(t("card.collapseFull"));
            card.scrollIntoView({ block: "nearest", behavior: "smooth" });
          }
        });
      });
    });
  }
  stripTags(content) {
    const tags = [];
    const text = content.replace(
      /[ \t]*#([A-Za-z0-9_\u4e00-\u9fff][A-Za-z0-9_\u4e00-\u9fff/]*)/g,
      (_m, g1) => {
        if (!tags.includes(g1)) tags.push(g1);
        return "";
      }
    );
    return {
      text: text.split("\n").map((l) => l.replace(/\s+$/, "")).join("\n").replace(/\n{3,}/g, "\n\n").trim(),
      tags
    };
  }
  showMemoMenu(evt, memo) {
    const menu = new import_obsidian7.Menu();
    menu.addItem(
      (item) => item.setTitle(memo.isPinned ? t("card.unpin") : t("card.pin")).setIcon(memo.isPinned ? "pin-off" : "pin").onClick(async () => {
        await this.store.togglePinned(memo);
        new import_obsidian7.Notice(memo.isPinned ? t("notice.unpinned") : t("notice.pinned"));
      })
    );
    menu.addItem(
      (item) => item.setTitle(memo.isStarred ? t("card.unstar") : t("card.star")).setIcon(memo.isStarred ? "star-off" : "star").onClick(async () => {
        await this.store.toggleStarred(memo);
        new import_obsidian7.Notice(
          memo.isStarred ? t("notice.unstarred") : t("notice.starred")
        );
      })
    );
    menu.addSeparator();
    menu.addItem(
      (item) => item.setTitle(t("card.edit")).setIcon("pencil").onClick(() => this.enterEditMode(memo))
    );
    menu.addItem(
      (item) => item.setTitle(t("card.openSource")).setIcon("file-text").onClick(() => this.openInFile(memo))
    );
    menu.addItem(
      (item) => item.setTitle(t("card.copySource")).setIcon("copy").onClick(async () => {
        await navigator.clipboard.writeText(memo.content);
        new import_obsidian7.Notice(t("notice.copied"));
      })
    );
    menu.addItem(
      (item) => item.setTitle(t("card.share")).setIcon("share").onClick(() => {
        openMemoShareModal(this.app, memo, this.settings);
      })
    );
    menu.addSeparator();
    if (memo.isDeleted) {
      menu.addItem(
        (item) => item.setTitle(t("card.restore")).setIcon("rotate-ccw").onClick(async () => {
          await this.store.restoreDeletedMemo(memo);
          new import_obsidian7.Notice(t("notice.restored"));
          this.restoreInputFocus();
        })
      );
      menu.addItem(
        (item) => item.setTitle(t("card.purge")).setIcon("trash").setWarning(true).onClick(async () => {
          const ok = await this.confirmAsync(t("notice.confirmPurge"));
          if (!ok) return;
          await this.store.deleteMemo(memo);
          new import_obsidian7.Notice(t("notice.purged"));
          this.restoreInputFocus();
        })
      );
    } else {
      menu.addItem(
        (item) => item.setTitle(t("card.delete")).setIcon("trash").setWarning(true).onClick(async () => {
          const ok = await this.confirmAsync(t("notice.confirmDelete"));
          if (!ok) return;
          await this.store.softDeleteMemo(memo);
          this.showDeleteUndo(memo);
          this.restoreInputFocus();
        })
      );
    }
    menu.showAtMouseEvent(evt);
  }
  /** 删除后的 5 秒撤销窗口：不建立回收站文件，也能防止误触。 */
  showDeleteUndo(memo) {
    const toast = activeDocument.body.createDiv({ cls: "memoria-undo-toast" });
    toast.createSpan({ text: "\u5DF2\u5220\u9664" });
    const undo = toast.createEl("button", { text: "\u64A4\u9500", attr: { type: "button" } });
    let done = false;
    const timer = window.setTimeout(() => toast.remove(), 5e3);
    undo.addEventListener("click", () => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      undo.disabled = true;
      void this.store.addMemo(memo.content, memo.datetime).then(() => {
        toast.remove();
        new import_obsidian7.Notice("\u5DF2\u6062\u590D");
      }).catch(() => {
        undo.disabled = false;
        done = false;
        new import_obsidian7.Notice("\u6062\u590D\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5");
      });
    });
  }
  /**
   * 自定义异步确认浮层（替代浏览器原生 confirm()，避免焦点劫持）。
   */
  confirmAsync(message) {
    return new Promise((resolve) => {
      const backdrop = activeDocument.body.createDiv({
        cls: "memoria-modal-backdrop"
      });
      const box = backdrop.createDiv({ cls: "memoria-modal memoria-confirm" });
      box.createDiv({ cls: "memoria-modal-title", text: message });
      const btns = box.createDiv({ cls: "memoria-modal-btns" });
      const cancel = btns.createEl("button", { text: t("input.cancel") });
      const ok = btns.createEl("button", { text: t("notice.confirmDeleteOk"), cls: "mod-warning" });
      let settled = false;
      let pendingMouseUp = null;
      const cleanupPendingMouseUp = () => {
        if (pendingMouseUp) {
          activeDocument.removeEventListener("mouseup", pendingMouseUp, true);
          pendingMouseUp = null;
        }
      };
      this.register(() => {
        if (settled) return;
        settled = true;
        backdrop.remove();
        activeDocument.removeEventListener("keydown", onKey, true);
        cleanupPendingMouseUp();
        window.setTimeout(() => resolve(false), 0);
      });
      const close = (result) => {
        if (settled) return;
        settled = true;
        backdrop.remove();
        activeDocument.removeEventListener("keydown", onKey, true);
        cleanupPendingMouseUp();
        window.setTimeout(() => resolve(result), 0);
      };
      const onKey = (e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          close(false);
        } else if (e.key === "Enter") {
          e.preventDefault();
          close(true);
        }
      };
      cancel.addEventListener("click", () => close(false));
      ok.addEventListener("click", () => close(true));
      backdrop.addEventListener("mousedown", (e) => {
        if (e.target !== backdrop) return;
        cleanupPendingMouseUp();
        const up = (ev) => {
          activeDocument.removeEventListener("mouseup", up, true);
          pendingMouseUp = null;
          if (ev.target === backdrop) close(false);
        };
        pendingMouseUp = up;
        activeDocument.addEventListener("mouseup", up, true);
      });
      activeDocument.addEventListener("keydown", onKey, true);
      window.setTimeout(() => ok.focus(), 20);
    });
  }
  /**
   * 恢复输入框的"可点击输入"状态。
   *
   * 一些浏览器在大规模 DOM 重建后 textarea 的焦点状态会进入怪异模式，
   * 鼠标悬停不会触发光标显示，必须先点到外部再点回来才行。
   * 显式 blur + 微延时 focus 可以重置这个状态。
   */
  restoreInputFocus() {
    if (!this.inputEl) return;
    try {
      this.inputEl.blur();
    } catch {
    }
    window.setTimeout(() => {
      try {
        this.inputEl.setSelectionRange(
          this.inputEl.value.length,
          this.inputEl.value.length
        );
      } catch {
      }
    }, 20);
  }
  async openInFile(memo) {
    const leaf = this.app.workspace.getLeaf(false);
    const file = this.app.vault.getAbstractFileByPath(memo.file);
    if (file instanceof import_obsidian7.TFile) {
      await leaf.openFile(file, { eState: { line: memo.range[0] } });
    }
  }
  /**
   * 引用某条笔记：把它以 > 引用块的形式填入顶部输入框，方便续写
   * 格式：
   *   > [!quote] 2026-04-20 12:12
   *   > 被引用的内容
   *
   *   （光标停在这里，等用户接着写）
   */
  quoteMemo(memo) {
    if (this.editingMemo) this.exitEditMode();
    const cleaned = memo.content.replace(/\s*#置顶(?![A-Za-z0-9_\u4e00-\u9fff/])/g, "").replace(/\s*#收藏(?![A-Za-z0-9_\u4e00-\u9fff/])/g, "").trim();
    const quoted = cleaned.split("\n").map((l) => l.trim() === "" ? ">" : `> ${l}`).join("\n");
    const block = `> [!quote] ${memo.date} ${memo.time}
${quoted}

`;
    if (this.inputEl.value.trim()) {
      const trimmed = this.inputEl.value.replace(/\s+$/, "");
      setTextareaValue(this.inputEl, trimmed + "\n\n" + block);
    } else {
      setTextareaValue(this.inputEl, block);
    }
    this.inputEl.focus();
    const pos = this.inputEl.value.length;
    this.inputEl.setSelectionRange(pos, pos);
    this.autoResizeInput();
    this.syncInputCardContentState();
    new import_obsidian7.Notice(t("notice.quoted"));
  }
  /**
   * v1.2.2 重写：保存 memo 为 PNG 图片（纯 SVG <text>，彻底根治 tainted canvas）
   * v1.2.3: 主题色板 + 粗虚线分割 + 羽毛笔 SVG 图标
   */
  async exportMemoAsPng(memo) {
    const WIDTH = 640;
    const PAD_X = 48;
    const PAD_TOP = 56;
    const PAD_BOTTOM = 40;
    const isDark = activeDocument.body.hasClass("theme-dark") || activeDocument.documentElement.hasClass("theme-dark");
    const palettes = {
      paper: {
        bg: "#fdfdfd",
        fg: "#1a1a1c",
        muted: "#8a8a8e",
        accent1: "#7c3aed",
        accent2: "#3b82f6",
        tagBg: "rgba(124,58,237,0.08)",
        tagFg: "#6d28d9",
        border: "#c8c8cc"
      },
      kraft: {
        bg: "#f5ebd8",
        fg: "#3d2f1e",
        muted: "#8a6f4a",
        accent1: "#b45309",
        accent2: "#d97706",
        tagBg: "rgba(180,83,9,0.12)",
        tagFg: "#92400e",
        border: "#c8a876"
      },
      mint: {
        bg: "#e8f5ec",
        fg: "#1a3a28",
        muted: "#5a8368",
        accent1: "#059669",
        accent2: "#10b981",
        tagBg: "rgba(5,150,105,0.12)",
        tagFg: "#047857",
        border: "#95c8a5"
      },
      peach: {
        bg: "#fde8e1",
        fg: "#3d1f18",
        muted: "#a77363",
        accent1: "#ea580c",
        accent2: "#f97316",
        tagBg: "rgba(234,88,12,0.12)",
        tagFg: "#c2410c",
        border: "#ecab93"
      },
      sky: {
        bg: "#e0f2fe",
        fg: "#0c2a3e",
        muted: "#5a7a95",
        accent1: "#0284c7",
        accent2: "#0ea5e9",
        tagBg: "rgba(2,132,199,0.12)",
        tagFg: "#0369a1",
        border: "#84bcd8"
      },
      lavender: {
        bg: "#eee7fa",
        fg: "#2a1a3e",
        muted: "#7a6a95",
        accent1: "#7c3aed",
        accent2: "#a78bfa",
        tagBg: "rgba(124,58,237,0.12)",
        tagFg: "#6d28d9",
        border: "#bba9de"
      },
      midnight: {
        bg: "#1a2238",
        fg: "#e8e8ea",
        muted: "#8a95b0",
        accent1: "#60a5fa",
        accent2: "#a78bfa",
        tagBg: "rgba(167,139,250,0.18)",
        tagFg: "#c4b5fd",
        border: "#3a4568"
      },
      charcoal: {
        bg: "#1a1b1e",
        fg: "#e8e8ea",
        muted: "#8a8a90",
        accent1: "#a78bfa",
        accent2: "#60a5fa",
        tagBg: "rgba(167,139,250,0.14)",
        tagFg: "#c4b5fd",
        border: "#3a3a40"
      }
    };
    let themeId = this.settings.exportTheme || "auto";
    if (themeId === "auto") {
      themeId = isDark ? "charcoal" : "paper";
    } else if (themeId === "random") {
      const keys = Object.keys(palettes);
      themeId = keys[Math.floor(Math.random() * keys.length)];
    }
    const P = palettes[themeId] || palettes.paper;
    const bg = P.bg;
    const fg = P.fg;
    const muted = P.muted;
    const accent1 = P.accent1;
    const accent2 = P.accent2;
    const tagBg = P.tagBg;
    const tagFg = P.tagFg;
    const borderClr = P.border;
    const { text: contentText, tags } = this.stripTags(memo.content);
    const cleanText = contentText.replace(/!\[\[[^\]]+\]\]/g, "").replace(/!\[[^\]]*\]\([^)]+\)/g, "").trim();
    const effectiveTags = tags.filter((t2) => !RESERVED_TAGS.has(t2));
    const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
    const FONT_SIZE = 16;
    const LINE_HEIGHT = 28;
    const textWidth = WIDTH - PAD_X * 2;
    const charWidth = (ch, scale = 1) => {
      const code = ch.charCodeAt(0);
      if (code >= 19968 && code <= 40959 || code >= 13312 && code <= 19903 || code >= 12352 && code <= 12543 || code >= 44032 && code <= 55215 || code >= 65280 && code <= 65519) {
        return FONT_SIZE * scale;
      }
      return FONT_SIZE * 0.55 * scale;
    };
    const parseInline = (src) => {
      const out = [];
      let i = 0;
      const push = (text, style = {}) => {
        if (!text) return;
        out.push({ text, ...style });
      };
      while (i < src.length) {
        if (src[i] === "`") {
          const end = src.indexOf("`", i + 1);
          if (end > i) {
            push(src.slice(i + 1, end), { code: true });
            i = end + 1;
            continue;
          }
        }
        if (src[i] === "*" && src[i + 1] === "*") {
          const end = src.indexOf("**", i + 2);
          if (end > i) {
            const inner = src.slice(i + 2, end);
            for (const s of parseInline(inner)) {
              push(s.text, { ...s, bold: true });
            }
            i = end + 2;
            continue;
          }
        }
        if (src[i] === "~" && src[i + 1] === "~") {
          const end = src.indexOf("~~", i + 2);
          if (end > i) {
            push(src.slice(i + 2, end), { strike: true });
            i = end + 2;
            continue;
          }
        }
        if ((src[i] === "*" || src[i] === "_") && src[i + 1] !== src[i]) {
          const marker = src[i];
          const end = src.indexOf(marker, i + 1);
          if (end > i && /\S/.test(src.slice(i + 1, end))) {
            push(src.slice(i + 1, end), { italic: true });
            i = end + 1;
            continue;
          }
        }
        if (src[i] === "[") {
          const close = src.indexOf("](", i);
          const rp = close > 0 ? src.indexOf(")", close + 2) : -1;
          if (close > i && rp > close) {
            push(src.slice(i + 1, close), { link: true });
            i = rp + 1;
            continue;
          }
        }
        let j = i;
        while (j < src.length && src[j] !== "`" && !(src[j] === "*") && !(src[j] === "_" && j > 0 && /\s/.test(src[j - 1] || " ")) && !(src[j] === "~" && src[j + 1] === "~") && src[j] !== "[") {
          j++;
        }
        if (j === i) j++;
        push(src.slice(i, j));
        i = j;
      }
      return out;
    };
    const parseBlocks = (src) => {
      const blocks2 = [];
      const lines = src.split("\n");
      let idx = 0;
      while (idx < lines.length) {
        const raw = lines[idx];
        const fenceM = raw.match(/^\s*```(.*)$/);
        if (fenceM) {
          const codeLines = [];
          idx++;
          while (idx < lines.length && !/^\s*```/.test(lines[idx])) {
            codeLines.push(lines[idx]);
            idx++;
          }
          idx++;
          blocks2.push({
            kind: "code",
            indent: 0,
            codeLines,
            spans: [],
            fontSize: 14,
            bold: false
          });
          continue;
        }
        if (raw.trim() === "") {
          blocks2.push({
            kind: "para",
            indent: 0,
            spans: [{ text: "" }],
            fontSize: FONT_SIZE,
            bold: false
          });
          idx++;
          continue;
        }
        if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(raw)) {
          blocks2.push({
            kind: "hr",
            indent: 0,
            spans: [],
            fontSize: FONT_SIZE,
            bold: false
          });
          idx++;
          continue;
        }
        let m = raw.match(/^(#{1,6})\s+(.+)$/);
        if (m) {
          const level = m[1].length;
          const sizes = [0, 22, 19, 17, 16, 15, 14];
          const kindMap = {
            1: "h1",
            2: "h2",
            3: "h3",
            4: "h4",
            5: "h5",
            6: "h6"
          };
          blocks2.push({
            kind: kindMap[level],
            indent: 0,
            spans: parseInline(m[2]),
            fontSize: sizes[level],
            bold: true
          });
          idx++;
          continue;
        }
        m = raw.match(/^>\s?(.*)$/);
        if (m) {
          blocks2.push({
            kind: "quote",
            indent: 16,
            spans: parseInline(m[1]),
            fontSize: FONT_SIZE,
            bold: false
          });
          idx++;
          continue;
        }
        m = raw.match(/^(\s*)[-*]\s+\[([ xX])\]\s+(.*)$/);
        if (m) {
          blocks2.push({
            kind: "task",
            indent: 24 + m[1].length * 8,
            checked: m[2].toLowerCase() === "x",
            spans: parseInline(m[3]),
            fontSize: FONT_SIZE,
            bold: false
          });
          idx++;
          continue;
        }
        m = raw.match(/^(\s*)[-*]\s+(.+)$/);
        if (m) {
          blocks2.push({
            kind: "li",
            indent: 18 + m[1].length * 8,
            prefix: { text: "\u2022" },
            spans: parseInline(m[2]),
            fontSize: FONT_SIZE,
            bold: false
          });
          idx++;
          continue;
        }
        m = raw.match(/^(\s*)(\d+)\.\s+(.+)$/);
        if (m) {
          blocks2.push({
            kind: "ol",
            indent: 22 + m[1].length * 8,
            prefix: { text: m[2] + "." },
            spans: parseInline(m[3]),
            fontSize: FONT_SIZE,
            bold: false
          });
          idx++;
          continue;
        }
        blocks2.push({
          kind: "para",
          indent: 0,
          spans: parseInline(raw),
          fontSize: FONT_SIZE,
          bold: false
        });
        idx++;
      }
      return blocks2;
    };
    const wrapBlock = (block, maxW) => {
      const out = [];
      let line = [];
      let w = 0;
      const spanWidth = (ch, span) => {
        const scale = block.fontSize / FONT_SIZE * (span.bold || block.bold ? 1.05 : 1);
        return charWidth(ch, scale);
      };
      const pushSpan = (span) => {
        if (span.text === "") {
          if (line.length === 0) line.push({ text: "" });
          return;
        }
        let buf = "";
        for (const ch of span.text) {
          const cw = spanWidth(ch, span);
          if (w + cw > maxW && (line.length > 0 || buf.length > 0)) {
            if (buf) {
              line.push({ ...span, text: buf });
              buf = "";
            }
            if (line.length === 0) line.push({ text: "" });
            out.push(line);
            line = [];
            w = 0;
          }
          buf += ch;
          w += cw;
        }
        if (buf) line.push({ ...span, text: buf });
      };
      for (const s of block.spans) pushSpan(s);
      if (line.length > 0 || out.length === 0) {
        if (line.length === 0) line.push({ text: "" });
        out.push(line);
      }
      return out;
    };
    const blocks = cleanText ? parseBlocks(cleanText) : [
      {
        kind: "para",
        indent: 0,
        spans: [{ text: "" }],
        fontSize: FONT_SIZE,
        bold: false
      }
    ];
    const visualLines = [];
    for (const blk of blocks) {
      if (blk.kind === "hr") {
        visualLines.push({ block: blk, spans: [], isFirstOfBlock: true });
        continue;
      }
      if (blk.kind === "code") {
        const codeLines = blk.codeLines || [""];
        codeLines.forEach(
          (ln, i) => visualLines.push({
            block: blk,
            spans: [{ text: ln, code: true }],
            isFirstOfBlock: i === 0
          })
        );
        continue;
      }
      const wrapped = wrapBlock(blk, textWidth - blk.indent);
      wrapped.forEach(
        (ln, idx) => visualLines.push({
          block: blk,
          spans: ln,
          isFirstOfBlock: idx === 0
        })
      );
    }
    const TAG_FONT = 13;
    const TAG_HEIGHT = 26;
    const TAG_PAD_X = 12;
    const TAG_GAP = 8;
    const tagLayout = [];
    if (effectiveTags.length > 0) {
      let cx = 0;
      let cy = 0;
      for (const t2 of effectiveTags) {
        const label = "#" + t2;
        let tw = 0;
        for (const ch of label) tw += charWidth(ch) * (TAG_FONT / FONT_SIZE);
        const boxW = tw + TAG_PAD_X * 2;
        if (cx + boxW > textWidth && cx > 0) {
          cx = 0;
          cy += TAG_HEIGHT + TAG_GAP;
        }
        tagLayout.push({ text: label, x: cx, y: cy, w: boxW });
        cx += boxW + TAG_GAP;
      }
    }
    const tagsBlockH = effectiveTags.length > 0 ? tagLayout[tagLayout.length - 1].y + TAG_HEIGHT : 0;
    const quoteH = 32;
    const quoteGap = 8;
    const visualLineHeight = (vl) => {
      if (vl.block.kind === "hr") return 20;
      if (vl.block.kind === "h1" || vl.block.kind === "h2" || vl.block.kind === "h3" || vl.block.kind === "h4" || vl.block.kind === "h5" || vl.block.kind === "h6") {
        return Math.round(vl.block.fontSize * 1.6);
      }
      if (vl.block.kind === "code") return 20;
      return LINE_HEIGHT;
    };
    const blockTopGap = (vl, prev) => {
      if (!vl.isFirstOfBlock) return 0;
      if (!prev) return 0;
      if (vl.block.kind === "h1") return 14;
      if (vl.block.kind === "h2") return 12;
      if (vl.block.kind === "h3") return 10;
      if (vl.block.kind === "h4") return 8;
      if (vl.block.kind === "h5") return 6;
      if (vl.block.kind === "h6") return 6;
      if (vl.block.kind === "code") return 8;
      if (vl.block.kind === "quote" && prev.block.kind !== "quote") return 4;
      const isListKind = (k) => k === "li" || k === "ol" || k === "task";
      if (isListKind(vl.block.kind) && !isListKind(prev.block.kind)) return 4;
      return 0;
    };
    let bodyH = 0;
    let prevVl = null;
    for (const vl of visualLines) {
      bodyH += blockTopGap(vl, prevVl) + visualLineHeight(vl);
      prevVl = vl;
    }
    bodyH = Math.max(bodyH, LINE_HEIGHT);
    const bodyToTagsGap = effectiveTags.length > 0 ? 24 : 0;
    const tagsToFooterGap = 32;
    const footerLineH = 1;
    const footerGap = 18;
    const footerH = 48;
    const contentH = quoteH + quoteGap + bodyH + bodyToTagsGap + tagsBlockH + tagsToFooterGap + footerLineH + footerGap + footerH;
    const HEIGHT = PAD_TOP + contentH + PAD_BOTTOM;
    let y = PAD_TOP;
    const topBarW = 48;
    const topBarH = 4;
    const quoteX = PAD_X;
    const quoteY = y + 22;
    y += quoteH + quoteGap;
    const bodyStartY = y;
    const codeFont = "'SF Mono','Consolas','Monaco',monospace";
    const quoteMarks = [];
    let cy2 = bodyStartY;
    let prevVl2 = null;
    const bodySvgParts = [];
    for (const vl of visualLines) {
      cy2 += blockTopGap(vl, prevVl2);
      if (vl.block.kind === "hr") {
        const midY = cy2 + 10;
        bodySvgParts.push(
          `<line x1="${PAD_X}" y1="${midY}" x2="${WIDTH - PAD_X}" y2="${midY}" stroke="${borderClr}" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="4 3"/>`
        );
        cy2 += 20;
        prevVl2 = vl;
        continue;
      }
      if (vl.block.kind === "code") {
        const lineH2 = visualLineHeight(vl);
        const codeLine = vl.spans[0]?.text || "";
        bodySvgParts.push(
          `<rect x="${PAD_X}" y="${cy2}" width="${WIDTH - PAD_X * 2}" height="${lineH2}" fill="${tagBg}" ${vl.isFirstOfBlock ? `rx="0"` : ""}/>`
        );
        if (codeLine.length > 0) {
          const maxChars = Math.floor(
            (WIDTH - PAD_X * 2 - 20) / (14 * 0.6)
            // 14px 等宽字体 ASCII 约 0.6em
          );
          const displayed = codeLine.length > maxChars ? codeLine.slice(0, maxChars - 1) + "\u2026" : codeLine;
          const baselineY2 = cy2 + 14;
          bodySvgParts.push(
            `<text x="${PAD_X + 10}" y="${baselineY2}" font-family="${codeFont}" font-size="13" fill="${tagFg}" xml:space="preserve">${esc(
              displayed
            )}</text>`
          );
        }
        cy2 += lineH2;
        prevVl2 = vl;
        continue;
      }
      const lineH = visualLineHeight(vl);
      const baselineY = cy2 + vl.block.fontSize + (lineH - vl.block.fontSize) / 2 - 4;
      const startX = PAD_X + vl.block.indent;
      if (vl.block.kind === "quote") {
        quoteMarks.push(
          `<rect x="${PAD_X}" y="${cy2}" width="3" height="${lineH}" rx="1.5" fill="${accent1}" opacity="0.5"/>`
        );
      }
      let cursorX = startX;
      if (vl.isFirstOfBlock && vl.block.prefix) {
        const pfx = vl.block.prefix.text;
        const pfxColor = vl.block.kind === "ol" ? fg : accent1;
        bodySvgParts.push(
          `<text x="${PAD_X + 6}" y="${baselineY}" font-size="${vl.block.fontSize}" fill="${pfxColor}" font-weight="${vl.block.kind === "ol" ? 600 : 700}">${esc(pfx)}</text>`
        );
      }
      if (vl.isFirstOfBlock && vl.block.kind === "task") {
        const checkedFill = vl.block.checked ? accent1 : "transparent";
        const checkboxY = cy2 + (lineH - 14) / 2;
        bodySvgParts.push(
          `<rect x="${PAD_X + 4}" y="${checkboxY}" width="14" height="14" rx="3" ry="3" fill="${checkedFill}" stroke="${vl.block.checked ? accent1 : muted}" stroke-width="1.5"/>`
        );
        if (vl.block.checked) {
          bodySvgParts.push(
            `<polyline points="${PAD_X + 7.5},${checkboxY + 7.5} ${PAD_X + 10},${checkboxY + 10} ${PAD_X + 14.5},${checkboxY + 4.5}" fill="none" stroke="${bg}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`
          );
        }
      }
      const tspans = [];
      let runX = cursorX;
      for (const sp of vl.spans) {
        if (!sp.text) continue;
        if (sp.code) {
          let cw = 0;
          for (const ch of sp.text) cw += charWidth(ch, 0.95);
          const boxW = cw + 8;
          bodySvgParts.push(
            `<rect x="${runX - 2}" y="${cy2 + (lineH - vl.block.fontSize) / 2 - 2}" width="${boxW}" height="${vl.block.fontSize + 4}" rx="4" fill="${tagBg}"/>`
          );
          tspans.push(
            `<tspan x="${runX + 2}" y="${baselineY}" font-family="${codeFont}" fill="${tagFg}" font-size="${Math.round(
              vl.block.fontSize * 0.95
            )}">${esc(sp.text)}</tspan>`
          );
          runX += boxW;
          continue;
        }
        const attrs = [];
        const isBold = sp.bold || vl.block.bold;
        if (isBold) attrs.push(`font-weight="700"`);
        if (sp.italic) attrs.push(`font-style="italic"`);
        const taskDone = vl.block.kind === "task" && vl.block.checked === true;
        if (sp.link) {
          attrs.push(`fill="${accent1}"`);
          attrs.push(`text-decoration="underline"`);
        } else if (sp.strike || taskDone) {
          attrs.push(`text-decoration="line-through"`);
          attrs.push(`fill="${muted}"`);
        }
        tspans.push(
          `<tspan x="${runX}" y="${baselineY}" ${attrs.join(
            " "
          )}>${esc(sp.text)}</tspan>`
        );
        const scale = vl.block.fontSize / FONT_SIZE * (isBold ? 1.05 : 1);
        for (const ch of sp.text) runX += charWidth(ch, scale);
      }
      if (tspans.length === 0 && !vl.block.prefix) {
      } else if (tspans.length > 0) {
        bodySvgParts.push(
          `<text font-size="${vl.block.fontSize}" fill="${fg}">${tspans.join(
            ""
          )}</text>`
        );
      }
      cy2 += lineH;
      prevVl2 = vl;
    }
    const textLines = bodySvgParts.join("\n  ") + "\n  " + quoteMarks.join("\n  ");
    y += bodyH;
    y += bodyToTagsGap;
    const tagsStartY = y;
    const tagsSvg = tagLayout.map(
      (t2) => `<g>
    <rect x="${PAD_X + t2.x}" y="${tagsStartY + t2.y}" width="${t2.w}" height="${TAG_HEIGHT}" rx="13" ry="13" fill="${tagBg}"/>
    <text x="${PAD_X + t2.x + t2.w / 2}" y="${tagsStartY + t2.y + TAG_HEIGHT / 2 + TAG_FONT * 0.35}" text-anchor="middle" font-size="${TAG_FONT}" fill="${tagFg}" font-weight="500">${esc(
        t2.text
      )}</text>
  </g>`
    ).join("\n  ");
    y += tagsBlockH;
    y += tagsToFooterGap;
    const lineY = y;
    y += footerLineH + footerGap;
    const dateStr = memo.date.replace(/-/g, ".");
    const dateY = y + 20;
    const timeY = dateY + 20;
    const fontFamily = "-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei','\u5FAE\u8F6F\u96C5\u9ED1',sans-serif";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" font-family="${fontFamily}">
  <defs>
    <linearGradient id="topBar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${accent1}"/>
      <stop offset="100%" stop-color="${accent2}"/>
    </linearGradient>
  </defs>

  <!-- \u80CC\u666F -->
  <rect width="100%" height="100%" fill="${bg}"/>

  <!-- \u9876\u90E8\u5DE6\u4E0A\u89D2\u6E10\u53D8\u88C5\u9970\u6761 -->
  <rect x="${PAD_X}" y="0" width="${topBarW}" height="${topBarH}" fill="url(#topBar)"/>

  <!-- \u88C5\u9970\u5F15\u53F7 -->
  <text x="${quoteX}" y="${quoteY}" font-size="54" font-family="Georgia,'Times New Roman',serif" fill="${accent1}" opacity="0.25" font-weight="700">&#8220;</text>

  <!-- \u6B63\u6587\uFF08v1.2.5: markdown \u6E32\u67D3\uFF0CbodySvgParts \u5DF2\u7ECF\u662F\u5B8C\u6574\u7684 text/rect/line \u5143\u7D20\uFF09 -->
  ${textLines}

  ${tagsSvg ? `<!-- \u6807\u7B7E\u80F6\u56CA -->
  ${tagsSvg}` : ""}

  <!-- \u5206\u5272\u7EBF\uFF08v1.2.5: \u7EC6\u4E00\u6863\u7684\u865A\u7EBF\uFF0C\u7EB8\u5361\u6298\u75D5\u611F\uFF09 -->
  <line x1="${PAD_X}" y1="${lineY}" x2="${WIDTH - PAD_X}" y2="${lineY}" stroke="${borderClr}" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="5 4"/>

  <!-- \u65E5\u671F -->
  <text x="${PAD_X}" y="${dateY}" font-size="18" fill="${fg}" font-weight="600" letter-spacing="1">${esc(
      dateStr
    )}</text>
  <text x="${PAD_X}" y="${timeY}" font-size="13" fill="${muted}">${esc(
      memo.time
    )}</text>

  <!-- \u53F3\u4E0B\u89D2\uFF1A\u7FBD\u6BDB\u7B14 SVG \u56FE\u6807 + MEMORIA \u6C34\u5370\uFF08v1.2.5: \u66F4\u8D34\u8FD1 MEMORIA\uFF09 -->
  <!-- MEMORIA \u5B9E\u6D4B 12px \u7C97\u4F53+\u5B57\u8DDD2\uFF0C\u7EA6 72px \u5BBD\uFF1B\u56FE\u6807 17.5 + \u95F4\u8DDD 4 \u2248 94 -->
  <g transform="translate(${WIDTH - PAD_X - 94}, ${timeY - 16}) scale(1.3)" fill="${muted}" opacity="0.85">
    <!-- \u7FBD\u6BDB\u7B14\uFF1A\u4E3B\u6746 + \u7FBD\u7247 + \u7B14\u5C16\uFF0C\u7EAF path\uFF0C100% \u8DE8\u5E73\u53F0 -->
    <path d="M13.5 0.5 C11 2.5, 8 5, 5.5 8 C3.5 10.5, 2 12.5, 1.2 14 L3 14.5 L13.5 4 Z M5 6.5 L3.5 9 L5.5 9.2 Z M8 3.5 L6.5 6 L8.5 6.2 Z M10.5 1.2 L9 3.6 L11 3.8 Z M1 14.2 L0 15.5 L1 15.5 Z"/>
  </g>
  <text x="${WIDTH - PAD_X}" y="${timeY}" font-size="12" fill="${muted}" text-anchor="end" letter-spacing="2" font-weight="600">MEMORIA</text>
</svg>`;
    const baseName = `memoria-${memo.date}-${memo.time.replace(":", "")}`;
    try {
      const pngBlob = await this.svgToPngBlob(svg, WIDTH, HEIGHT, 2);
      this.downloadBlob(pngBlob, `${baseName}.png`);
      new import_obsidian7.Notice(`\u2713 \u5DF2\u4FDD\u5B58 ${baseName}.png`);
      return;
    } catch (err) {
      console.warn("[Memoria] PNG \u5BFC\u51FA\u5931\u8D25\uFF0C\u964D\u7EA7\u4E3A SVG\uFF1A", err);
    }
    const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    this.downloadBlob(svgBlob, `${baseName}.svg`);
    new import_obsidian7.Notice(`\u2713 \u5DF2\u4FDD\u5B58 ${baseName}.svg\uFF08PNG \u5BFC\u51FA\u88AB\u62E6\u622A\uFF0C\u5DF2\u964D\u7EA7\uFF09`);
  }
  /** SVG 字符串 → PNG Blob（可能因 tainted canvas 抛错） */
  async svgToPngBlob(svg, width, height, scale) {
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    try {
      const img = new Image();
      img.width = width;
      img.height = height;
      await new Promise((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("SVG \u6E32\u67D3\u5931\u8D25"));
        img.src = url;
      });
      const canvas = activeDocument.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("canvas \u4E0D\u53EF\u7528");
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, width, height);
      return await new Promise((resolve, reject) => {
        canvas.toBlob((result) => {
          if (result) resolve(result);
          else reject(new Error("canvas.toBlob \u8FD4\u56DE null\uFF08\u901A\u5E38\u662F tainted canvas\uFF09"));
        }, "image/png");
      });
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  /** 触发浏览器下载一个 Blob */
  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = activeDocument.createElement("a");
    a.href = url;
    a.download = filename;
    activeDocument.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1e3);
  }
};
__publicField(_MemoriaView, "MD_CACHE_MAX", 500);
/** v1.1.7: 草稿持久化（localStorage）
 *  v1.1.14: key 带上 vault 名，避免在多 vault 之间切换时草稿串味。
 */
__publicField(_MemoriaView, "DRAFT_KEY_PREFIX", "memoria:input-draft");
var MemoriaView = _MemoriaView;

// src/moments-memoria/stats.ts
var import_obsidian8 = require("obsidian");
var StatsView = class extends import_obsidian8.ItemView {
  constructor(leaf, store) {
    super(leaf);
    __publicField(this, "store", store);
    __publicField(this, "memos", []);
    __publicField(this, "unsubscribe", null);
    __publicField(this, "workspaceLeafEl", null);
  }
  getViewType() {
    return VIEW_TYPE_MEMORIA_STATS;
  }
  getDisplayText() {
    return t("stats.title");
  }
  getIcon() {
    return "bar-chart-3";
  }
  async onOpen() {
    this.workspaceLeafEl = this.contentEl.closest(".workspace-leaf");
    this.workspaceLeafEl?.addClass("memoria-stats-workspace-leaf");
    this.contentEl.addClass("memoria-stats-view");
    this.memos = this.store.getAll();
    this.render();
    this.unsubscribe = this.store.onChange(() => {
      this.memos = this.store.getAll();
      this.render();
    });
  }
  async onClose() {
    this.workspaceLeafEl?.removeClass("memoria-stats-workspace-leaf");
    this.workspaceLeafEl = null;
    if (this.unsubscribe) this.unsubscribe();
  }
  render() {
    const contentEl = this.contentEl;
    contentEl.empty();
    const titleEl = contentEl.createDiv({ cls: "mstat-pagetitle" });
    titleEl.createSpan({ cls: "mstat-pagetitle-icon", text: "\u{1F4CA}" });
    titleEl.createSpan({
      cls: "mstat-pagetitle-text",
      text: t("stats.title")
    });
    if (this.memos.length === 0) {
      contentEl.createEl("p", {
        text: t("stats.empty"),
        cls: "mstat-empty-page"
      });
      return;
    }
    const body = contentEl.createDiv({ cls: "memoria-stats-body" });
    const sections = [
      ["overview", () => this.renderOverview(body)],
      ["year-heatmap", () => this.renderYearHeatmap(body)],
      ["top-tags", () => this.renderTopTags(body)],
      ["writing-rhythm", () => this.renderWritingRhythm(body)],
      ["highlights", () => this.renderHighlights(body)],
      ["tag-cloud", () => this.renderTagCloud(body)]
    ];
    for (const [name, renderSection] of sections) {
      this.renderSectionSafely(name, renderSection);
    }
  }
  renderSectionSafely(name, renderSection) {
    try {
      renderSection();
    } catch (error) {
      console.error(`[Memoria] Failed to render stats section: ${name}`, error);
    }
  }
  // -------- 总览 --------
  renderOverview(parent) {
    const section = parent.createDiv({ cls: "mstat-section" });
    const row = section.createDiv({ cls: "mstat-overview" });
    const totalWords = this.memos.reduce(
      (s, m) => s + m.content.replace(/\s/g, "").length,
      0
    );
    const days = new Set(this.memos.map((m) => m.date)).size;
    const firstDay = [...this.memos].sort(
      (a, b) => a.datetime.getTime() - b.datetime.getTime()
    )[0];
    const spanDays = Math.floor(
      (Date.now() - firstDay.datetime.getTime()) / (1e3 * 60 * 60 * 24)
    ) + 1;
    this.renderBigNum(row, this.memos.length, t("stats.label.memos"));
    this.renderBigNum(row, totalWords, t("stats.label.words"));
    this.renderBigNum(row, days, t("stats.label.activeDays"));
    this.renderBigNum(row, spanDays, t("stats.label.spanDays"));
  }
  renderBigNum(parent, num, label) {
    const item = parent.createDiv({ cls: "mstat-bignum" });
    item.createDiv({
      cls: "mstat-bignum-num",
      text: num.toLocaleString()
    });
    item.createDiv({ cls: "mstat-bignum-label", text: label });
  }
  // -------- 365 天大热力图 --------
  renderYearHeatmap(parent) {
    const section = parent.createDiv({ cls: "mstat-section" });
    const titleRow = section.createDiv({ cls: "mstat-yh-title-row" });
    titleRow.createDiv({ cls: "mstat-title", text: t("stats.section.yearHeatmap") });
    const yearNav = titleRow.createDiv({ cls: "mstat-yh-year-nav" });
    const prevBtn = yearNav.createEl("button", {
      cls: "mstat-yh-year-arrow",
      attr: { "aria-label": t("stats.nav.prevYear"), title: t("stats.nav.prevYear") }
    });
    (0, import_obsidian8.setIcon)(prevBtn, "chevron-left");
    const yearBtn = yearNav.createEl("button", {
      cls: "mstat-yh-year-btn"
    });
    const nextBtn = yearNav.createEl("button", {
      cls: "mstat-yh-year-arrow",
      attr: { "aria-label": t("stats.nav.nextYear"), title: t("stats.nav.nextYear") }
    });
    (0, import_obsidian8.setIcon)(nextBtn, "chevron-right");
    let displayYear = (/* @__PURE__ */ new Date()).getFullYear();
    yearBtn.setText(t("stats.yearBtn", { year: displayYear }));
    const yhScroll = section.createDiv({ cls: "mstat-yh-scroll" });
    const wrap = yhScroll.createDiv({ cls: "mstat-yh-wrap" });
    const monthLabels = yhScroll.createDiv({ cls: "mstat-yh-monthlabels" });
    const monthlyTitle = parent.createDiv({
      cls: "mstat-section mstat-monthly-title"
    });
    const monthlyTitleRow = monthlyTitle.createDiv({ cls: "mstat-title-row" });
    monthlyTitleRow.createDiv({ cls: "mstat-title", text: t("stats.section.monthly") });
    const monthlySubtitle = monthlyTitleRow.createDiv({
      cls: "mstat-subtitle"
    });
    const monthlyChartWrap = parent.createDiv({ cls: "mstat-monthly-wrap" });
    const render = (year) => {
      wrap.empty();
      monthLabels.empty();
      yearBtn.setText(t("stats.yearBtn", { year }));
      const dayMap = /* @__PURE__ */ new Map();
      for (const m of this.memos) {
        if (!m.date.startsWith(`${year}-`)) continue;
        dayMap.set(m.date, (dayMap.get(m.date) ?? 0) + 1);
      }
      const start = new Date(year, 0, 1);
      const today = /* @__PURE__ */ new Date();
      const end = new Date(year, 11, 31);
      const todayDateOnly = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const startDow = start.getDay();
      const gridStart = new Date(start);
      gridStart.setDate(start.getDate() - startDow);
      const days = Math.floor(
        (end.getTime() - gridStart.getTime()) / (1e3 * 60 * 60 * 24) + 0.5
      ) + 1;
      const weeks = Math.ceil(days / 7);
      const monthFirstWeek = [];
      let lastMonth = -1;
      for (let w = 0; w < weeks; w++) {
        const day = new Date(gridStart);
        day.setDate(gridStart.getDate() + w * 7);
        if (day.getFullYear() !== year) continue;
        const mo = day.getMonth();
        if (mo !== lastMonth) {
          monthFirstWeek.push({ month: mo, week: w });
          lastMonth = mo;
        }
      }
      const cellW = 13;
      const gap = 3;
      monthLabels.style.width = `${weeks * (cellW + gap)}px`;
      for (let i = 0; i < monthFirstWeek.length; i++) {
        const m = monthFirstWeek[i];
        const next = monthFirstWeek[i + 1];
        const spanWeeks = next ? next.week - m.week : weeks - m.week;
        if (spanWeeks < 2) continue;
        const label = monthLabels.createDiv({
          cls: "mstat-yh-mlabel",
          text: t("stats.monthShort", { m: m.month + 1 })
        });
        label.style.left = `${m.week * (cellW + gap)}px`;
      }
      for (let w = 0; w < weeks; w++) {
        const col = wrap.createDiv({ cls: "mstat-yh-col" });
        for (let d = 0; d < 7; d++) {
          const day = new Date(gridStart);
          day.setDate(gridStart.getDate() + w * 7 + d);
          const key = fmtDate4(day);
          const inRange = day >= start && day <= end;
          const count = dayMap.get(key) ?? 0;
          const isFuture = inRange && day > todayDateOnly;
          const level = !inRange ? -1 : count === 0 ? 0 : count < 2 ? 1 : count < 4 ? 2 : count < 7 ? 3 : 4;
          const cell = col.createDiv({
            cls: `mstat-yh-cell level-${level}`,
            attr: {
              title: !inRange ? "" : isFuture ? t("stats.heatmap.future", { date: key }) : t("stats.heatmap.dayCount", { date: key, n: count })
            }
          });
          if (level === -1) cell.addClass("is-outside-range");
        }
      }
      this.renderMonthlyForYear(monthlyChartWrap, year);
      const yearTotal = this.memos.filter(
        (m) => m.date.startsWith(`${year}-`)
      ).length;
      monthlySubtitle.setText(t("stats.monthlyYearSum", { year, n: yearTotal }));
    };
    const switchYear = (delta) => {
      const years = [
        ...new Set(this.memos.map((m) => parseInt(m.date.substring(0, 4))))
      ].sort();
      if (years.length === 0) return;
      const idx = years.indexOf(displayYear);
      const safeIdx = idx < 0 ? 0 : idx;
      const nextIdx = (safeIdx + delta + years.length) % years.length;
      displayYear = years[nextIdx];
      render(displayYear);
    };
    prevBtn.addEventListener("click", () => switchYear(-1));
    nextBtn.addEventListener("click", () => switchYear(1));
    yearBtn.addEventListener("click", () => switchYear(1));
    render(displayYear);
    const legend = section.createDiv({ cls: "mstat-yh-legend" });
    legend.createSpan({ text: t("stats.legend.less") });
    for (let i = 0; i <= 4; i++) {
      legend.createDiv({ cls: `mstat-yh-cell level-${i}` });
    }
    legend.createSpan({ text: t("stats.legend.more") });
  }
  // -------- 年度月份柱状图（由 renderYearHeatmap 的 year 驱动） --------
  renderMonthlyForYear(parent, year) {
    parent.empty();
    const months = [];
    for (let i = 0; i < 12; i++) {
      months.push({
        key: `${year}-${pad2(i + 1)}`,
        label: t("stats.monthShort", { m: i + 1 }),
        count: 0
      });
    }
    for (const m of this.memos) {
      if (!m.date.startsWith(`${year}-`)) continue;
      const mi = parseInt(m.date.substring(5, 7), 10) - 1;
      months[mi].count++;
    }
    const max = Math.max(1, ...months.map((m) => m.count));
    const scrollWrap = parent.createDiv({ cls: "mstat-bar-chart-scroll" });
    const chart = scrollWrap.createDiv({ cls: "mstat-bar-chart" });
    for (const mo of months) {
      const col = chart.createDiv({ cls: "mstat-bar-col" });
      const barWrap = col.createDiv({ cls: "mstat-bar-wrap" });
      const bar = barWrap.createDiv({
        cls: "mstat-bar" + (mo.count === max && mo.count > 0 ? " is-max" : "") + (mo.count === 0 ? " is-empty" : "")
      });
      bar.style.height = mo.count === 0 ? "2px" : `${mo.count / max * 100}%`;
      bar.setAttr("title", t("stats.monthlyBarRange", { key: mo.key, n: mo.count }));
      col.createDiv({
        cls: "mstat-bar-num" + (mo.count === 0 ? " is-dim" : ""),
        // v1.1.5: 0 也显示数字（弱化颜色），保持"每列都有数字"的节奏感
        text: String(mo.count)
      });
      col.createDiv({ cls: "mstat-bar-label", text: mo.label });
    }
  }
  // -------- 标签云 --------
  renderTagCloud(parent) {
    const counter = /* @__PURE__ */ new Map();
    for (const m of this.memos)
      for (const t2 of m.tags) {
        if (RESERVED_TAGS.has(t2)) continue;
        counter.set(t2, (counter.get(t2) ?? 0) + 1);
      }
    if (counter.size === 0) return;
    const section = parent.createDiv({ cls: "mstat-section" });
    section.createDiv({ cls: "mstat-title", text: t("stats.section.tagCloud") });
    const list = [...counter.entries()].sort((a, b) => b[1] - a[1]);
    const max = list[0][1];
    const min = list[list.length - 1][1];
    const cloud = section.createDiv({ cls: "mstat-cloud" });
    for (const [tag, c] of list) {
      const ratio = max === min ? 1 : (c - min) / (max - min);
      const fontSize = 12 + ratio * 10;
      const opacity = 0.55 + ratio * 0.45;
      const span = cloud.createSpan({
        cls: "mstat-cloud-tag",
        text: `#${tag}`,
        attr: { title: t("list.totalCount", { n: c }) }
      });
      span.style.fontSize = `${fontSize}px`;
      span.style.opacity = String(opacity);
    }
  }
  // -------- 热门标签 --------
  renderTopTags(parent) {
    const section = parent.createDiv({ cls: "mstat-section" });
    section.createDiv({ cls: "mstat-title", text: t("stats.section.topTags") });
    const counter = /* @__PURE__ */ new Map();
    for (const m of this.memos)
      for (const t2 of m.tags) {
        if (RESERVED_TAGS.has(t2)) continue;
        counter.set(t2, (counter.get(t2) ?? 0) + 1);
      }
    const top = [...counter.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
    if (top.length === 0) {
      section.createDiv({
        cls: "mstat-empty",
        text: t("stats.noTag")
      });
      return;
    }
    const max = top[0][1];
    const list = section.createDiv({ cls: "mstat-hbar-list" });
    top.forEach(([tag, count], i) => {
      const row = list.createDiv({ cls: "mstat-hbar-row" });
      const rank = row.createDiv({
        cls: "mstat-hbar-rank rank-" + Math.min(i + 1, 4)
      });
      rank.setText(String(i + 1));
      row.createDiv({ cls: "mstat-hbar-label", text: `#${tag}` });
      const barWrap = row.createDiv({ cls: "mstat-hbar-wrap" });
      const bar = barWrap.createDiv({ cls: "mstat-hbar" });
      bar.style.width = `${count / max * 100}%`;
      row.createDiv({
        cls: "mstat-hbar-num",
        text: count.toString()
      });
    });
  }
  // -------- 写作节律：小时曲线 + 星期圆点 --------
  renderWritingRhythm(parent) {
    const section = parent.createDiv({ cls: "mstat-section" });
    const titleRow = section.createDiv({ cls: "mstat-title-row" });
    titleRow.createDiv({
      cls: "mstat-title",
      text: t("stats.section.rhythm")
    });
    titleRow.createDiv({
      cls: "mstat-subtitle",
      text: t("stats.hourly.subtitle", { n: this.memos.length })
    });
    const rhythmGrid = section.createDiv({ cls: "mstat-rhythm-grid" });
    this.renderSectionSafely("hourly-rhythm", () => this.renderHourlyRhythm(rhythmGrid));
    this.renderSectionSafely("weekday-rhythm", () => this.renderWeekdayRhythm(rhythmGrid));
  }
  renderHourlyRhythm(parent) {
    const panel = parent.createDiv({ cls: "mstat-rhythm-panel mstat-rhythm-hour" });
    panel.createDiv({ cls: "mstat-rhythm-heading", text: t("stats.section.hourly") });
    const buckets = Array.from({ length: 24 }, () => 0);
    for (const m of this.memos) buckets[m.datetime.getHours()]++;
    const max = Math.max(1, ...buckets);
    const peakHour = buckets.indexOf(max);
    const peakPct = (max / this.memos.length * 100).toFixed(1);
    const summary = panel.createDiv({ cls: "mstat-rhythm-summary" });
    const summaryItems = [
      { label: t("stats.hourly.kpi.peak"), value: `${pad2(peakHour)}:00` },
      { label: t("stats.hourly.kpi.count"), value: t("stats.hourly.countValue", { n: max }) },
      { label: t("stats.hourly.kpi.share"), value: `${peakPct}%` }
    ];
    for (const item of summaryItems) {
      const metric = summary.createDiv({ cls: "mstat-rhythm-metric" });
      metric.createDiv({ cls: "mstat-rhythm-metric-value", text: item.value });
      metric.createDiv({ cls: "mstat-rhythm-metric-label", text: item.label });
    }
    const scrollWrap = panel.createDiv({ cls: "mstat-rhythm-scroll" });
    const chartShell = scrollWrap.createDiv({ cls: "mstat-rhythm-chart-shell" });
    const yAxis = chartShell.createDiv({ cls: "mstat-rhythm-y-axis" });
    for (const value of [max, Math.round(max / 2), 0]) {
      yAxis.createSpan({ text: t("stats.hourly.axisCount", { n: value }) });
    }
    const plot = chartShell.createDiv({ cls: "mstat-rhythm-plot" });
    const svg = plot.createSvg("svg", {
      cls: "mstat-rhythm-svg",
      attr: {
        viewBox: "0 0 660 150",
        preserveAspectRatio: "none",
        role: "img",
        "aria-label": t("stats.section.hourly")
      }
    });
    const left = 8;
    const right = 652;
    const top = 12;
    const baseline = 138;
    const plotHeight = baseline - top;
    const xAt = (hour) => left + hour / 23 * (right - left);
    const yAt = (count) => baseline - count / max * plotHeight;
    for (const ratio of [0, 0.5, 1]) {
      const y = top + ratio * plotHeight;
      svg.createSvg("line", {
        cls: "mstat-rhythm-gridline",
        attr: { x1: left, y1: y, x2: right, y2: y }
      });
    }
    const points = buckets.map((count, hour) => [xAt(hour), yAt(count)]);
    const linePath = points.map(
      ([x, y], index) => `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`
    ).join(" ");
    const areaPath = `M ${left} ${baseline} ${linePath.replace(/^M/, "L")} L ${right} ${baseline} Z`;
    svg.createSvg("path", {
      cls: "mstat-rhythm-area",
      attr: { d: areaPath }
    });
    svg.createSvg("path", {
      cls: "mstat-rhythm-line",
      attr: { d: linePath }
    });
    points.forEach(([x, y], hour) => {
      svg.createSvg("circle", {
        cls: "mstat-rhythm-point" + (hour === peakHour ? " is-peak" : "") + (buckets[hour] === 0 ? " is-empty" : ""),
        attr: {
          cx: x,
          cy: y,
          r: hour === peakHour ? 4.5 : 2.5,
          "aria-label": t("stats.hourly.barTip", {
            hh: pad2(hour),
            n: buckets[hour]
          })
        }
      });
    });
    const xAxis = plot.createDiv({ cls: "mstat-rhythm-x-axis" });
    for (const hour of [0, 6, 12, 18, 23]) {
      xAxis.createSpan({ text: `${pad2(hour)}:00` });
    }
    plot.createDiv({ cls: "mstat-rhythm-axis-caption", text: t("stats.hourly.axisTime") });
    const desc = panel.createDiv({ cls: "mstat-desc" });
    desc.setText(
      t("stats.hourly.peak", {
        hh: pad2(peakHour),
        n: max,
        pct: peakPct
      })
    );
  }
  renderWeekdayRhythm(parent) {
    const panel = parent.createDiv({ cls: "mstat-rhythm-panel mstat-rhythm-week" });
    panel.createDiv({ cls: "mstat-rhythm-heading", text: t("stats.section.weekday") });
    const labels = [
      t("stats.weekday.mon"),
      t("stats.weekday.tue"),
      t("stats.weekday.wed"),
      t("stats.weekday.thu"),
      t("stats.weekday.fri"),
      t("stats.weekday.sat"),
      t("stats.weekday.sun")
    ];
    const buckets = Array.from({ length: 7 }, () => 0);
    for (const memo of this.memos) {
      const mondayFirstIndex = (memo.datetime.getDay() + 6) % 7;
      buckets[mondayFirstIndex]++;
    }
    const max = Math.max(1, ...buckets);
    const peakDay = buckets.indexOf(max);
    const dots = panel.createDiv({ cls: "mstat-weekday-dots" });
    buckets.forEach((count, day) => {
      const ratio = count / max;
      const item = dots.createDiv({ cls: "mstat-weekday-item" });
      const dotWrap = item.createDiv({ cls: "mstat-weekday-dot-wrap" });
      const dot = dotWrap.createSpan({
        cls: "mstat-weekday-dot" + (day === peakDay ? " is-peak" : ""),
        attr: { title: `${labels[day]} \xB7 ${count}` }
      });
      const size = count === 0 ? 10 : 14 + Math.sqrt(ratio) * 30;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.opacity = count === 0 ? "0.18" : String(0.38 + ratio * 0.62);
      item.createDiv({ cls: "mstat-weekday-label", text: labels[day] });
      item.createDiv({ cls: "mstat-weekday-count", text: String(count) });
    });
    panel.createDiv({
      cls: "mstat-desc",
      text: t("stats.weekday.peak", {
        day: labels[peakDay],
        n: max,
        pct: (max / this.memos.length * 100).toFixed(1)
      })
    });
  }
  // -------- 高亮记录 --------
  // v1.1.19: 引入"文案池"+"每日彩蛋"，让数据报告有温度。
  //   - 每条 fact 从 2-3 条候选里按日期 seed 挑一条 → 同一天稳定，换一天有新鲜感
  //   - 顶部加 1 条"今日彩蛋"，根据当前小时段和日期 seed 双重随机
  renderHighlights(parent) {
    const section = parent.createDiv({ cls: "mstat-section" });
    section.createDiv({ cls: "mstat-title", text: t("stats.section.highlights") });
    const list = section.createDiv({ cls: "mstat-fact-list" });
    if (getCurrentLocale() === "en-US") {
      list.createDiv({
        cls: "mstat-fact",
        text: t("stats.highlightsENOnly")
      });
      return;
    }
    const today = /* @__PURE__ */ new Date();
    const daySeed = today.getFullYear() * 1e4 + (today.getMonth() + 1) * 100 + today.getDate();
    const pickFromPool = (pool, salt) => {
      const idx = Math.abs(daySeed + salt * 131 >>> 0) % pool.length;
      return pool[idx];
    };
    const easterEggs = [];
    const hour = today.getHours();
    if (hour >= 0 && hour < 5) {
      easterEggs.push(
        "\u51CC\u6668\u4E86\u8FD8\u5728\u770B\u6570\u636E\u62A5\u544A\uFF1F\u7075\u611F\u5F80\u5F80\u85CF\u5728\u71AC\u591C\u7684\u7B2C\u4E09\u676F\u8336\u91CC\u3002",
        "\u6B64\u65F6\u6B64\u523B\u4F60\u662F\u5168\u4E16\u754C\u6700\u6E05\u9192\u7684\u4E00\u6279\u4EBA\u4E4B\u4E00\uFF0C\u597D\u597D\u8BB0\u5F55\u8FD9\u4EFD\u6E05\u9192\u3002",
        "\u591C\u6DF1\u4EBA\u9759\uFF0C\u6700\u9002\u5408\u7ED9\u81EA\u5DF1\u5199\u5C01\u5C0F\u7EB8\u6761\u3002"
      );
    } else if (hour >= 5 && hour < 9) {
      easterEggs.push(
        "\u65E9\u8D77\u7684\u9E1F\u513F\u6709\u866B\u5403\uFF0C\u65E9\u8D77\u7684\u8111\u5B50\u6700\u5BB9\u6613\u8E66\u51FA\u91D1\u53E5\u3002",
        "\u6E05\u6668\u7684\u60F3\u6CD5\u6700\u4E0D\u5E26\u6EE4\u955C\uFF0C\u73B0\u5728\u8BB0\u4E0B\u6765\u4F1A\u5F88\u503C\u3002"
      );
    } else if (hour >= 9 && hour < 14) {
      easterEggs.push(
        "\u4E0A\u5348\u8111\u529B\u5DC5\u5CF0\uFF0C\u4E00\u4E2A\u597D\u60F3\u6CD5\u503C\u4E00\u4E0B\u5348\u3002",
        "\u8BB0\u5F97\u559D\u6C34\u3002\u53E6\u5916\uFF0C\u521A\u624D\u90A3\u4E2A\u5FF5\u5934\u662F\u4E0D\u662F\u8FD8\u6CA1\u8BB0\u4E0B\u6765\uFF1F"
      );
    } else if (hour >= 14 && hour < 19) {
      easterEggs.push(
        '\u4E0B\u5348\u5E38\u5E38\u6709\u4E00\u79CD"\u4ECA\u5929\u597D\u50CF\u767D\u8FC7\u4E86"\u7684\u9519\u89C9\uFF0C\u7FFB\u7FFB\u8FC7\u5F80\u7684\u81EA\u5DF1\uFF0C\u4F60\u4F1A\u88AB\u6CBB\u6108\u3002',
        "\u4E0B\u5348\u4E09\u70B9\u7684\u8D70\u795E\u65F6\u523B\uFF0C\u662F\u5F88\u591A\u597D\u60F3\u6CD5\u7684\u51FA\u751F\u8BC1\u660E\u3002"
      );
    } else {
      easterEggs.push(
        "\u508D\u665A\u5230\u6DF1\u591C\uFF0C\u662F Moments \u6700\u6D3B\u8DC3\u7684\u65F6\u95F4\u6BB5\uFF0C\u4F60\u4E5F\u662F\u3002",
        "\u7761\u524D\u5199\u4E00\u6761\uFF0C\u660E\u5929\u9192\u6765\u4F1A\u611F\u8C22\u4ECA\u665A\u7684\u81EA\u5DF1\u3002"
      );
    }
    this.renderFact(list, "\u2728", pickFromPool(easterEggs, 0), true);
    const dayMap = /* @__PURE__ */ new Map();
    for (const m of this.memos)
      dayMap.set(m.date, (dayMap.get(m.date) ?? 0) + 1);
    const busyDay = [...dayMap.entries()].sort((a, b) => b[1] - a[1])[0];
    this.renderFact(
      list,
      "\u{1F4C5}",
      pickFromPool(
        [
          `\u6700\u6D3B\u8DC3\u7684\u4E00\u5929\uFF1A${busyDay[0]}\uFF0C\u90A3\u5929\u4F60\u5199\u4E86 ${busyDay[1]} \u6761`,
          `${busyDay[0]} \u662F\u4F60\u7684"\u8BDD\u75E8\u65E5" \u2014\u2014 \u5355\u5929 ${busyDay[1]} \u6761\uFF0C\u5927\u6982\u53D1\u751F\u4E86\u4EC0\u4E48\u597D\u73A9\u7684\uFF1F`,
          `${busyDay[0]} \u5199\u4E86 ${busyDay[1]} \u6761\uFF0C\u662F\u4E0D\u662F\u90A3\u5929\u5FC3\u91CC\u88C5\u4E86\u5F88\u591A\u4E1C\u897F`
        ],
        1
      )
    );
    let longest = this.memos[0];
    for (const m of this.memos)
      if (m.content.length > longest.content.length) longest = m;
    this.renderFact(
      list,
      "\u{1F4CF}",
      pickFromPool(
        [
          `\u6700\u957F\u7684\u4E00\u6761\uFF1A${longest.content.length} \u5B57\uFF08${longest.date}\uFF09`,
          `${longest.date} \u7684\u90A3\u6761\u7B14\u8BB0 ${longest.content.length} \u5B57\uFF0C\u4E00\u770B\u5C31\u662F\u618B\u4E86\u5F88\u4E45\u624D\u4E0B\u7B14`,
          `\u53F2\u4E0A\u6700\u957F\uFF1A${longest.content.length} \u5B57\uFF0C${longest.date}\uFF0C\u771F\xB7\u957F\u7BC7\u5DE8\u5236`
        ],
        2
      )
    );
    const weekdayCounter = Array.from({ length: 7 }, () => 0);
    for (const m of this.memos) weekdayCounter[m.datetime.getDay()]++;
    const wdMax = Math.max(...weekdayCounter);
    const wdIdx = weekdayCounter.indexOf(wdMax);
    const wdName = ["\u5468\u65E5", "\u5468\u4E00", "\u5468\u4E8C", "\u5468\u4E09", "\u5468\u56DB", "\u5468\u4E94", "\u5468\u516D"][wdIdx];
    this.renderFact(
      list,
      "\u{1F4C6}",
      pickFromPool(
        [
          `${wdName}\u662F\u4F60\u5199\u7B14\u8BB0\u6700\u591A\u7684\u4E00\u5929\uFF08${wdMax} \u6761\uFF09`,
          `${wdName}\u4F3C\u4E4E\u662F\u4F60\u7684"\u7075\u611F\u65E5"\uFF0C\u7D2F\u8BA1 ${wdMax} \u6761`,
          `\u7FFB\u770B\u5386\u53F2\uFF0C\u4F60\u7279\u522B\u504F\u7231\u5728${wdName}\u8BB0\u5F55 \u2014\u2014 ${wdMax} \u6761\u8BF4\u660E\u95EE\u9898`
        ],
        3
      )
    );
    const days = dayMap.size;
    const avg = (this.memos.length / days).toFixed(2);
    const avgNum = parseFloat(avg);
    this.renderFact(
      list,
      "\u{1F4AB}",
      avgNum >= 3 ? `\u6D3B\u8DC3\u65E5\u5E73\u5747\u6BCF\u5929 ${avg} \u6761 \u2014\u2014 \u633A\u9AD8\u4EA7\u7684 \u{1F4AA}` : avgNum >= 1.5 ? `\u6D3B\u8DC3\u65E5\u5E73\u5747\u6BCF\u5929 ${avg} \u6761\uFF0C\u8282\u594F\u521A\u521A\u597D` : `\u6D3B\u8DC3\u65E5\u5E73\u5747\u6BCF\u5929 ${avg} \u6761\uFF0C\u5C11\u5373\u662F\u591A`
    );
    const imgCount = this.memos.filter((m) => m.hasImage).length;
    if (imgCount > 0) {
      const pct = imgCount / this.memos.length * 100;
      this.renderFact(
        list,
        "\u{1F5BC}\uFE0F",
        pickFromPool(
          [
            `\u5171\u6709 ${imgCount} \u6761\u7B14\u8BB0\u5E26\u56FE\u7247\uFF08${pct.toFixed(1)}%\uFF09`,
            `${imgCount} \u6761\u7B14\u8BB0\u914D\u4E86\u56FE \u2014\u2014 \u89C6\u89C9\u8BB0\u5FC6\u6709\u65F6\u5019\u6BD4\u6587\u5B57\u66F4\u7262`,
            `${pct.toFixed(0)}% \u7684\u7B14\u8BB0\u662F\u56FE\u6587\u5E76\u8302\u7684\uFF0C\u4F60\u633A\u91CD\u89C6"\u753B\u9762\u611F"`
          ],
          5
        )
      );
    }
    const nightCount = this.memos.filter((m) => {
      const h = m.datetime.getHours();
      return h >= 0 && h < 5;
    }).length;
    if (nightCount > 0) {
      this.renderFact(
        list,
        "\u{1F319}",
        pickFromPool(
          [
            `\u51CC\u6668 0-5 \u70B9\u4F60\u5199\u4E86 ${nightCount} \u6761\uFF0C\u662F\u4E2A\u591C\u732B\u5B50\u5462`,
            `\u51CC\u6668\u7075\u611F ${nightCount} \u6B21 \u2014\u2014 \u5931\u7720\u7684\u4F60\u5176\u5B9E\u5F88\u5BCC\u6709`,
            `${nightCount} \u6B21\u5728\u51CC\u6668\u7559\u4E0B\u8FC7\u60F3\u6CD5\uFF0C\u90A3\u4E9B\u65F6\u523B\u7684\u4F60\u6700\u8BDA\u5B9E`
          ],
          6
        )
      );
    }
    const streak = this.calcLongestStreak([...dayMap.keys()]);
    this.renderFact(
      list,
      "\u{1F525}",
      pickFromPool(
        [
          `\u6700\u957F\u8FDE\u7EED\u6253\u5361\uFF1A${streak} \u5929`,
          `\u4F60\u66FE\u7ECF\u8FDE\u7EED ${streak} \u5929\u6CA1\u65AD\u66F4\uFF0C\u8FD9\u4EFD\u575A\u6301\u81EA\u5DF1\u770B\u4E86\u90FD\u611F\u52A8`,
          `\u5386\u53F2\u6700\u957F streak\uFF1A${streak} \u5929 \u2014\u2014 \u53EF\u4EE5\u62FF\u6765\u6253\u7834`
        ],
        7
      )
    );
    const thisYear = today.getFullYear();
    const thisYearCount = this.memos.filter(
      (m) => m.date.startsWith(`${thisYear}-`)
    ).length;
    const lastYearCount = this.memos.filter(
      (m) => m.date.startsWith(`${thisYear - 1}-`)
    ).length;
    if (lastYearCount > 0) {
      const diff = thisYearCount - lastYearCount;
      const pct = (Math.abs(diff) / lastYearCount * 100).toFixed(0);
      if (diff > 0) {
        this.renderFact(
          list,
          "\u{1F4CA}",
          `\u4ECA\u5E74 ${thisYearCount} \u6761\uFF0C\u6BD4\u53BB\u5E74\u591A\u4E86 ${pct}% \u2014\u2014 \u770B\u5F97\u51FA\u6765\u4F60\u66F4\u613F\u610F\u8BB0\u5F55\u4E86`
        );
      } else if (diff < 0) {
        this.renderFact(
          list,
          "\u{1F4CA}",
          `\u4ECA\u5E74 ${thisYearCount} \u6761\uFF0C\u6BD4\u53BB\u5E74\u5C11\u4E86 ${pct}% \u2014\u2014 \u4E0D\u4E00\u5B9A\u662F\u574F\u4E8B\uFF0C\u4E5F\u8BB8\u53EA\u662F\u8BDD\u53D8\u5C11\u4E86`
        );
      } else {
        this.renderFact(list, "\u{1F4CA}", `\u4ECA\u5E74\u548C\u53BB\u5E74\u6301\u5E73\uFF08\u5404 ${thisYearCount} \u6761\uFF09`);
      }
    }
    const lastDate = [...dayMap.keys()].sort().pop();
    if (lastDate) {
      const diffDays = Math.floor(
        (Date.now() - (/* @__PURE__ */ new Date(lastDate + "T00:00:00")).getTime()) / (1e3 * 60 * 60 * 24)
      );
      if (diffDays >= 3) {
        this.renderFact(
          list,
          "\u{1F4AD}",
          pickFromPool(
            [
              `\u4F60\u5DF2\u7ECF ${diffDays} \u5929\u6CA1\u8BB0\u5F55\u65B0\u60F3\u6CD5\u4E86\uFF0C\u8981\u4E0D\u8981\u968F\u624B\u5199\u4E00\u6761\uFF1F`,
              `${diffDays} \u5929\u6CA1\u66F4\u65B0 \u2014\u2014 \u4E5F\u8BB8\u6B64\u523B\u8111\u5B50\u91CC\u90A3\u4E2A\u5FF5\u5934\u5C31\u503C\u5F97\u7559\u4E0B\u6765`,
              `\u8DDD\u79BB\u4E0A\u6B21\u8BB0\u5F55\u5DF2\u7ECF ${diffDays} \u5929\uFF0CMoments \u6709\u70B9\u60F3\u4F60`
            ],
            9
          )
        );
      }
    }
  }
  // v1.1.19: 多加一个 isEgg 参数，给"今日彩蛋"一个区别于常规 fact 的视觉
  renderFact(parent, icon, text, isEgg = false) {
    const row = parent.createDiv({
      cls: "mstat-fact" + (isEgg ? " is-egg" : "")
    });
    row.createSpan({ cls: "mstat-fact-icon", text: icon });
    row.createSpan({ cls: "mstat-fact-text", text });
  }
  calcLongestStreak(dates) {
    if (dates.length === 0) return 0;
    const sorted = [...dates].sort();
    let longest = 1;
    let cur = 1;
    for (let i = 1; i < sorted.length; i++) {
      const prev = (/* @__PURE__ */ new Date(sorted[i - 1] + "T00:00:00")).getTime();
      const curTs = (/* @__PURE__ */ new Date(sorted[i] + "T00:00:00")).getTime();
      const diff = Math.round((curTs - prev) / (24 * 60 * 60 * 1e3));
      if (diff === 1) {
        cur++;
        longest = Math.max(longest, cur);
      } else if (diff > 1) {
        cur = 1;
      }
    }
    return longest;
  }
};
function pad2(n) {
  return n.toString().padStart(2, "0");
}
function fmtDate4(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

// src/moments-memoria/year-panorama.ts
var import_obsidian9 = require("obsidian");
function weekdayShort(dow) {
  return t(`year.weekdayShort.${dow}`);
}
var MONTH_LABELS_EN = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC"
];
var YearPanoramaView = class extends import_obsidian9.ItemView {
  constructor(leaf, store) {
    super(leaf);
    __publicField(this, "store", store);
    __publicField(this, "unsubscribe", null);
    __publicField(this, "displayYear");
    this.displayYear = (/* @__PURE__ */ new Date()).getFullYear();
  }
  getViewType() {
    return VIEW_TYPE_MEMORIA_YEAR;
  }
  getDisplayText() {
    return t("year.viewTitle");
  }
  getIcon() {
    return "calendar-days";
  }
  async onOpen() {
    this.render();
    this.unsubscribe = this.store.onChange(() => this.render());
  }
  async onClose() {
    if (this.unsubscribe) this.unsubscribe();
    this.unsubscribe = null;
  }
  render() {
    const container = this.contentEl;
    container.empty();
    container.addClass("memoria-year-view");
    const dayMap = /* @__PURE__ */ new Map();
    for (const m of this.store.getAll()) {
      dayMap.set(m.date, (dayMap.get(m.date) ?? 0) + 1);
    }
    const header = container.createDiv({ cls: "memoria-year-header" });
    const nav = header.createDiv({ cls: "memoria-year-nav" });
    const prevBtn = nav.createEl("button", {
      cls: "memoria-year-nav-btn",
      attr: { "aria-label": t("stats.nav.prevYear") }
    });
    (0, import_obsidian9.setIcon)(prevBtn, "chevron-left");
    prevBtn.addEventListener("click", () => {
      this.displayYear--;
      this.render();
    });
    const todayBtn = nav.createEl("button", {
      cls: "memoria-year-today-btn",
      text: String(this.displayYear)
    });
    todayBtn.addEventListener("click", () => {
      this.displayYear = (/* @__PURE__ */ new Date()).getFullYear();
      this.render();
    });
    const nextBtn = nav.createEl("button", {
      cls: "memoria-year-nav-btn",
      attr: { "aria-label": t("stats.nav.nextYear") }
    });
    (0, import_obsidian9.setIcon)(nextBtn, "chevron-right");
    nextBtn.addEventListener("click", () => {
      this.displayYear++;
      this.render();
    });
    const grid = container.createDiv({ cls: "memoria-year-grid" });
    const today = /* @__PURE__ */ new Date();
    const todayStr = fmtDate5(today);
    let yearCount = 0;
    for (let month = 0; month < 12; month++) {
      const monthEl = grid.createDiv({ cls: "memoria-year-month" });
      monthEl.createDiv({
        cls: "memoria-year-month-label",
        text: MONTH_LABELS_EN[month]
      });
      const weekHead = monthEl.createDiv({ cls: "memoria-year-weekhead" });
      for (let i = 0; i < 7; i++) {
        weekHead.createDiv({ cls: "memoria-year-wday", text: weekdayShort(i) });
      }
      const cal = monthEl.createDiv({ cls: "memoria-year-grid-days" });
      const firstDayOfMonth = new Date(this.displayYear, month, 1);
      const startDow = firstDayOfMonth.getDay();
      const daysInMonth = new Date(
        this.displayYear,
        month + 1,
        0
      ).getDate();
      const daysInPrevMonth = new Date(this.displayYear, month, 0).getDate();
      for (let i = 0; i < 42; i++) {
        let dayNum;
        let realDate;
        let isOut = false;
        if (i < startDow) {
          dayNum = daysInPrevMonth - (startDow - 1 - i);
          realDate = new Date(this.displayYear, month - 1, dayNum);
          isOut = true;
        } else if (i < startDow + daysInMonth) {
          dayNum = i - startDow + 1;
          realDate = new Date(this.displayYear, month, dayNum);
        } else {
          dayNum = i - startDow - daysInMonth + 1;
          realDate = new Date(this.displayYear, month + 1, dayNum);
          isOut = true;
        }
        const key = fmtDate5(realDate);
        const count = dayMap.get(key) ?? 0;
        if (!isOut && count > 0) yearCount += count;
        let levelCls = "";
        if (!isOut && count > 0) {
          const lvl = count < 2 ? 1 : count < 4 ? 2 : count < 7 ? 3 : 4;
          levelCls = ` level-${lvl}`;
        }
        const cell = cal.createDiv({
          cls: "memoria-year-day" + (isOut ? " is-out" : "") + (!isOut && count > 0 ? " has-memo" : "") + levelCls + (key === todayStr ? " is-today" : ""),
          text: String(dayNum)
        });
        if (!isOut && count > 0) {
          cell.setAttr("aria-label", t("year.dayHover", { date: key, n: count }));
          cell.addEventListener("click", () => {
            void this.jumpToDate(key);
          });
        } else if (!isOut) {
          cell.setAttr("aria-label", key);
        }
      }
    }
    const foot = container.createDiv({ cls: "memoria-year-foot" });
    const activeDays = Array.from(dayMap.keys()).filter(
      (d) => d.startsWith(String(this.displayYear) + "-")
    ).length;
    foot.createSpan({
      cls: "memoria-year-foot-item",
      text: t("year.yearSum", { year: this.displayYear, n: yearCount })
    });
    foot.createSpan({ cls: "memoria-year-foot-sep", text: "\xB7" });
    foot.createSpan({
      cls: "memoria-year-foot-item",
      text: t("year.activeDays", { n: activeDays })
    });
  }
  /** 点击某天：打开 Memoria 主视图并筛选到那一天的笔记。
   *  v1.4.8: 从"设搜索框值"改为调 MemoriaView.focusOnDate()，
   *    因为搜索框只匹配 memo.content，对 memo.date 无效；走 focusOnDate 能复用
   *    侧栏月历点日期的同一套 filter.date 机制，才能真正筛出该日笔记。
   */
  async jumpToDate(date) {
    const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_MEMORIA);
    let leaf = leaves[0];
    if (!leaf) {
      leaf = this.app.workspace.getLeaf("tab");
      await leaf.setViewState({
        type: VIEW_TYPE_MEMORIA,
        active: true
      });
    }
    await this.app.workspace.revealLeaf(leaf);
    const view = leaf.view;
    if (view instanceof MemoriaView) {
      view.focusOnDate(date);
    }
  }
};
function fmtDate5(d) {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}
/*! Bundled license information:

dom-to-image-more/dist/dom-to-image-more.min.js:
  (*! dom-to-image-more 16-10-2024 *)
*/

var __exp = module.exports;
return {
  VIEW_TYPE_MOMENTS: __exp.VIEW_TYPE_MOMENTS,
  VIEW_TYPE_MOMENTS_STATS: __exp.VIEW_TYPE_MOMENTS_STATS,
  VIEW_TYPE_MOMENTS_YEAR: __exp.VIEW_TYPE_MOMENTS_YEAR,
  DEFAULT_SETTINGS: __exp.DEFAULT_SETTINGS,
  MemoStore: __exp.MemoStore,
  MomentsView: __exp.MemoriaView,
  MomentsStatsView: __exp.StatsView,
  MomentsYearView: __exp.YearPanoramaView,
  initLocale: __exp.initLocale,
  PIN_TAG: __exp.PIN_TAG,
  STAR_TAG: __exp.STAR_TAG,
  ARCHIVE_TAG: __exp.ARCHIVE_TAG,
  DELETED_TAG: __exp.DELETED_TAG,
};
})();
