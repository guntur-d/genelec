(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
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

  // node_modules/mithril/render/vnode.js
  var require_vnode = __commonJS({
    "node_modules/mithril/render/vnode.js"(exports, module) {
      "use strict";
      function Vnode(tag, key, attrs, children, text, dom) {
        return { tag, key, attrs, children, text, dom, is: void 0, domSize: void 0, state: void 0, events: void 0, instance: void 0 };
      }
      Vnode.normalize = function(node) {
        if (Array.isArray(node)) return Vnode("[", void 0, void 0, Vnode.normalizeChildren(node), void 0, void 0);
        if (node == null || typeof node === "boolean") return null;
        if (typeof node === "object") return node;
        return Vnode("#", void 0, void 0, String(node), void 0, void 0);
      };
      Vnode.normalizeChildren = function(input) {
        var children = [];
        if (input.length) {
          var isKeyed = input[0] != null && input[0].key != null;
          for (var i = 1; i < input.length; i++) {
            if ((input[i] != null && input[i].key != null) !== isKeyed) {
              throw new TypeError(
                isKeyed && (input[i] != null || typeof input[i] === "boolean") ? "In fragments, vnodes must either all have keys or none have keys. You may wish to consider using an explicit keyed empty fragment, m.fragment({key: ...}), instead of a hole." : "In fragments, vnodes must either all have keys or none have keys."
              );
            }
          }
          for (var i = 0; i < input.length; i++) {
            children[i] = Vnode.normalize(input[i]);
          }
        }
        return children;
      };
      module.exports = Vnode;
    }
  });

  // node_modules/mithril/render/hyperscriptVnode.js
  var require_hyperscriptVnode = __commonJS({
    "node_modules/mithril/render/hyperscriptVnode.js"(exports, module) {
      "use strict";
      var Vnode = require_vnode();
      module.exports = function() {
        var attrs = arguments[this], start = this + 1, children;
        if (attrs == null) {
          attrs = {};
        } else if (typeof attrs !== "object" || attrs.tag != null || Array.isArray(attrs)) {
          attrs = {};
          start = this;
        }
        if (arguments.length === start + 1) {
          children = arguments[start];
          if (!Array.isArray(children)) children = [children];
        } else {
          children = [];
          while (start < arguments.length) children.push(arguments[start++]);
        }
        return Vnode("", attrs.key, attrs, children);
      };
    }
  });

  // node_modules/mithril/util/hasOwn.js
  var require_hasOwn = __commonJS({
    "node_modules/mithril/util/hasOwn.js"(exports, module) {
      "use strict";
      module.exports = {}.hasOwnProperty;
    }
  });

  // node_modules/mithril/render/hyperscript.js
  var require_hyperscript = __commonJS({
    "node_modules/mithril/render/hyperscript.js"(exports, module) {
      "use strict";
      var Vnode = require_vnode();
      var hyperscriptVnode = require_hyperscriptVnode();
      var hasOwn = require_hasOwn();
      var selectorParser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g;
      var selectorCache = /* @__PURE__ */ Object.create(null);
      function isEmpty(object) {
        for (var key in object) if (hasOwn.call(object, key)) return false;
        return true;
      }
      function compileSelector(selector) {
        var match, tag = "div", classes = [], attrs = {};
        while (match = selectorParser.exec(selector)) {
          var type = match[1], value = match[2];
          if (type === "" && value !== "") tag = value;
          else if (type === "#") attrs.id = value;
          else if (type === ".") classes.push(value);
          else if (match[3][0] === "[") {
            var attrValue = match[6];
            if (attrValue) attrValue = attrValue.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\");
            if (match[4] === "class") classes.push(attrValue);
            else attrs[match[4]] = attrValue === "" ? attrValue : attrValue || true;
          }
        }
        if (classes.length > 0) attrs.className = classes.join(" ");
        if (isEmpty(attrs)) attrs = null;
        return selectorCache[selector] = { tag, attrs };
      }
      function execSelector(state, vnode) {
        var attrs = vnode.attrs;
        var hasClass = hasOwn.call(attrs, "class");
        var className = hasClass ? attrs.class : attrs.className;
        vnode.tag = state.tag;
        if (state.attrs != null) {
          attrs = Object.assign({}, state.attrs, attrs);
          if (className != null || state.attrs.className != null) attrs.className = className != null ? state.attrs.className != null ? String(state.attrs.className) + " " + String(className) : className : state.attrs.className != null ? state.attrs.className : null;
        } else {
          if (className != null) attrs.className = className;
        }
        if (hasClass) attrs.class = null;
        if (state.tag === "input" && hasOwn.call(attrs, "type")) {
          attrs = Object.assign({ type: attrs.type }, attrs);
        }
        vnode.is = attrs.is;
        vnode.attrs = attrs;
        return vnode;
      }
      function hyperscript(selector) {
        if (selector == null || typeof selector !== "string" && typeof selector !== "function" && typeof selector.view !== "function") {
          throw Error("The selector must be either a string or a component.");
        }
        var vnode = hyperscriptVnode.apply(1, arguments);
        if (typeof selector === "string") {
          vnode.children = Vnode.normalizeChildren(vnode.children);
          if (selector !== "[") return execSelector(selectorCache[selector] || compileSelector(selector), vnode);
        }
        vnode.tag = selector;
        return vnode;
      }
      module.exports = hyperscript;
    }
  });

  // node_modules/mithril/render/trust.js
  var require_trust = __commonJS({
    "node_modules/mithril/render/trust.js"(exports, module) {
      "use strict";
      var Vnode = require_vnode();
      module.exports = function(html) {
        if (html == null) html = "";
        return Vnode("<", void 0, void 0, html, void 0, void 0);
      };
    }
  });

  // node_modules/mithril/render/fragment.js
  var require_fragment = __commonJS({
    "node_modules/mithril/render/fragment.js"(exports, module) {
      "use strict";
      var Vnode = require_vnode();
      var hyperscriptVnode = require_hyperscriptVnode();
      module.exports = function() {
        var vnode = hyperscriptVnode.apply(0, arguments);
        vnode.tag = "[";
        vnode.children = Vnode.normalizeChildren(vnode.children);
        return vnode;
      };
    }
  });

  // node_modules/mithril/hyperscript.js
  var require_hyperscript2 = __commonJS({
    "node_modules/mithril/hyperscript.js"(exports, module) {
      "use strict";
      var hyperscript = require_hyperscript();
      hyperscript.trust = require_trust();
      hyperscript.fragment = require_fragment();
      module.exports = hyperscript;
    }
  });

  // node_modules/mithril/render/domFor.js
  var require_domFor = __commonJS({
    "node_modules/mithril/render/domFor.js"(exports, module) {
      "use strict";
      var delayedRemoval = /* @__PURE__ */ new WeakMap();
      function* domFor(vnode) {
        var dom = vnode.dom;
        var domSize = vnode.domSize;
        var generation = delayedRemoval.get(dom);
        if (dom != null) do {
          var nextSibling = dom.nextSibling;
          if (delayedRemoval.get(dom) === generation) {
            yield dom;
            domSize--;
          }
          dom = nextSibling;
        } while (domSize);
      }
      module.exports = {
        delayedRemoval,
        domFor
      };
    }
  });

  // node_modules/mithril/render/render.js
  var require_render = __commonJS({
    "node_modules/mithril/render/render.js"(exports, module) {
      "use strict";
      var Vnode = require_vnode();
      var df = require_domFor();
      var delayedRemoval = df.delayedRemoval;
      var domFor = df.domFor;
      module.exports = function() {
        var nameSpace = {
          svg: "http://www.w3.org/2000/svg",
          math: "http://www.w3.org/1998/Math/MathML"
        };
        var currentRedraw;
        var currentRender;
        function getDocument(dom) {
          return dom.ownerDocument;
        }
        function getNameSpace(vnode) {
          return vnode.attrs && vnode.attrs.xmlns || nameSpace[vnode.tag];
        }
        function checkState(vnode, original) {
          if (vnode.state !== original) throw new Error("'vnode.state' must not be modified.");
        }
        function callHook(vnode) {
          var original = vnode.state;
          try {
            return this.apply(original, arguments);
          } finally {
            checkState(vnode, original);
          }
        }
        function activeElement(dom) {
          try {
            return getDocument(dom).activeElement;
          } catch (e) {
            return null;
          }
        }
        function createNodes(parent, vnodes, start, end, hooks, nextSibling, ns) {
          for (var i = start; i < end; i++) {
            var vnode = vnodes[i];
            if (vnode != null) {
              createNode(parent, vnode, hooks, ns, nextSibling);
            }
          }
        }
        function createNode(parent, vnode, hooks, ns, nextSibling) {
          var tag = vnode.tag;
          if (typeof tag === "string") {
            vnode.state = {};
            if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks);
            switch (tag) {
              case "#":
                createText(parent, vnode, nextSibling);
                break;
              case "<":
                createHTML(parent, vnode, ns, nextSibling);
                break;
              case "[":
                createFragment(parent, vnode, hooks, ns, nextSibling);
                break;
              default:
                createElement(parent, vnode, hooks, ns, nextSibling);
            }
          } else createComponent(parent, vnode, hooks, ns, nextSibling);
        }
        function createText(parent, vnode, nextSibling) {
          vnode.dom = getDocument(parent).createTextNode(vnode.children);
          insertDOM(parent, vnode.dom, nextSibling);
        }
        var possibleParents = { caption: "table", thead: "table", tbody: "table", tfoot: "table", tr: "tbody", th: "tr", td: "tr", colgroup: "table", col: "colgroup" };
        function createHTML(parent, vnode, ns, nextSibling) {
          var match = vnode.children.match(/^\s*?<(\w+)/im) || [];
          var temp = getDocument(parent).createElement(possibleParents[match[1]] || "div");
          if (ns === "http://www.w3.org/2000/svg") {
            temp.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + vnode.children + "</svg>";
            temp = temp.firstChild;
          } else {
            temp.innerHTML = vnode.children;
          }
          vnode.dom = temp.firstChild;
          vnode.domSize = temp.childNodes.length;
          var fragment = getDocument(parent).createDocumentFragment();
          var child;
          while (child = temp.firstChild) {
            fragment.appendChild(child);
          }
          insertDOM(parent, fragment, nextSibling);
        }
        function createFragment(parent, vnode, hooks, ns, nextSibling) {
          var fragment = getDocument(parent).createDocumentFragment();
          if (vnode.children != null) {
            var children = vnode.children;
            createNodes(fragment, children, 0, children.length, hooks, null, ns);
          }
          vnode.dom = fragment.firstChild;
          vnode.domSize = fragment.childNodes.length;
          insertDOM(parent, fragment, nextSibling);
        }
        function createElement(parent, vnode, hooks, ns, nextSibling) {
          var tag = vnode.tag;
          var attrs = vnode.attrs;
          var is = vnode.is;
          ns = getNameSpace(vnode) || ns;
          var element = ns ? is ? getDocument(parent).createElementNS(ns, tag, { is }) : getDocument(parent).createElementNS(ns, tag) : is ? getDocument(parent).createElement(tag, { is }) : getDocument(parent).createElement(tag);
          vnode.dom = element;
          if (attrs != null) {
            setAttrs(vnode, attrs, ns);
          }
          insertDOM(parent, element, nextSibling);
          if (!maybeSetContentEditable(vnode)) {
            if (vnode.children != null) {
              var children = vnode.children;
              createNodes(element, children, 0, children.length, hooks, null, ns);
              if (vnode.tag === "select" && attrs != null) setLateSelectAttrs(vnode, attrs);
            }
          }
        }
        function initComponent(vnode, hooks) {
          var sentinel;
          if (typeof vnode.tag.view === "function") {
            vnode.state = Object.create(vnode.tag);
            sentinel = vnode.state.view;
            if (sentinel.$$reentrantLock$$ != null) return;
            sentinel.$$reentrantLock$$ = true;
          } else {
            vnode.state = void 0;
            sentinel = vnode.tag;
            if (sentinel.$$reentrantLock$$ != null) return;
            sentinel.$$reentrantLock$$ = true;
            vnode.state = vnode.tag.prototype != null && typeof vnode.tag.prototype.view === "function" ? new vnode.tag(vnode) : vnode.tag(vnode);
          }
          initLifecycle(vnode.state, vnode, hooks);
          if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks);
          vnode.instance = Vnode.normalize(callHook.call(vnode.state.view, vnode));
          if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument");
          sentinel.$$reentrantLock$$ = null;
        }
        function createComponent(parent, vnode, hooks, ns, nextSibling) {
          initComponent(vnode, hooks);
          if (vnode.instance != null) {
            createNode(parent, vnode.instance, hooks, ns, nextSibling);
            vnode.dom = vnode.instance.dom;
            vnode.domSize = vnode.dom != null ? vnode.instance.domSize : 0;
          } else {
            vnode.domSize = 0;
          }
        }
        function updateNodes(parent, old, vnodes, hooks, nextSibling, ns) {
          if (old === vnodes || old == null && vnodes == null) return;
          else if (old == null || old.length === 0) createNodes(parent, vnodes, 0, vnodes.length, hooks, nextSibling, ns);
          else if (vnodes == null || vnodes.length === 0) removeNodes(parent, old, 0, old.length);
          else {
            var isOldKeyed = old[0] != null && old[0].key != null;
            var isKeyed = vnodes[0] != null && vnodes[0].key != null;
            var start = 0, oldStart = 0;
            if (!isOldKeyed) while (oldStart < old.length && old[oldStart] == null) oldStart++;
            if (!isKeyed) while (start < vnodes.length && vnodes[start] == null) start++;
            if (isOldKeyed !== isKeyed) {
              removeNodes(parent, old, oldStart, old.length);
              createNodes(parent, vnodes, start, vnodes.length, hooks, nextSibling, ns);
            } else if (!isKeyed) {
              var commonLength = old.length < vnodes.length ? old.length : vnodes.length;
              start = start < oldStart ? start : oldStart;
              for (; start < commonLength; start++) {
                o = old[start];
                v = vnodes[start];
                if (o === v || o == null && v == null) continue;
                else if (o == null) createNode(parent, v, hooks, ns, getNextSibling(old, start + 1, nextSibling));
                else if (v == null) removeNode(parent, o);
                else updateNode(parent, o, v, hooks, getNextSibling(old, start + 1, nextSibling), ns);
              }
              if (old.length > commonLength) removeNodes(parent, old, start, old.length);
              if (vnodes.length > commonLength) createNodes(parent, vnodes, start, vnodes.length, hooks, nextSibling, ns);
            } else {
              var oldEnd = old.length - 1, end = vnodes.length - 1, map, o, v, oe, ve, topSibling;
              while (oldEnd >= oldStart && end >= start) {
                oe = old[oldEnd];
                ve = vnodes[end];
                if (oe.key !== ve.key) break;
                if (oe !== ve) updateNode(parent, oe, ve, hooks, nextSibling, ns);
                if (ve.dom != null) nextSibling = ve.dom;
                oldEnd--, end--;
              }
              while (oldEnd >= oldStart && end >= start) {
                o = old[oldStart];
                v = vnodes[start];
                if (o.key !== v.key) break;
                oldStart++, start++;
                if (o !== v) updateNode(parent, o, v, hooks, getNextSibling(old, oldStart, nextSibling), ns);
              }
              while (oldEnd >= oldStart && end >= start) {
                if (start === end) break;
                if (o.key !== ve.key || oe.key !== v.key) break;
                topSibling = getNextSibling(old, oldStart, nextSibling);
                moveDOM(parent, oe, topSibling);
                if (oe !== v) updateNode(parent, oe, v, hooks, topSibling, ns);
                if (++start <= --end) moveDOM(parent, o, nextSibling);
                if (o !== ve) updateNode(parent, o, ve, hooks, nextSibling, ns);
                if (ve.dom != null) nextSibling = ve.dom;
                oldStart++;
                oldEnd--;
                oe = old[oldEnd];
                ve = vnodes[end];
                o = old[oldStart];
                v = vnodes[start];
              }
              while (oldEnd >= oldStart && end >= start) {
                if (oe.key !== ve.key) break;
                if (oe !== ve) updateNode(parent, oe, ve, hooks, nextSibling, ns);
                if (ve.dom != null) nextSibling = ve.dom;
                oldEnd--, end--;
                oe = old[oldEnd];
                ve = vnodes[end];
              }
              if (start > end) removeNodes(parent, old, oldStart, oldEnd + 1);
              else if (oldStart > oldEnd) createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns);
              else {
                var originalNextSibling = nextSibling, vnodesLength = end - start + 1, oldIndices = new Array(vnodesLength), li = 0, i = 0, pos = 2147483647, matched = 0, map, lisIndices;
                for (i = 0; i < vnodesLength; i++) oldIndices[i] = -1;
                for (i = end; i >= start; i--) {
                  if (map == null) map = getKeyMap(old, oldStart, oldEnd + 1);
                  ve = vnodes[i];
                  var oldIndex = map[ve.key];
                  if (oldIndex != null) {
                    pos = oldIndex < pos ? oldIndex : -1;
                    oldIndices[i - start] = oldIndex;
                    oe = old[oldIndex];
                    old[oldIndex] = null;
                    if (oe !== ve) updateNode(parent, oe, ve, hooks, nextSibling, ns);
                    if (ve.dom != null) nextSibling = ve.dom;
                    matched++;
                  }
                }
                nextSibling = originalNextSibling;
                if (matched !== oldEnd - oldStart + 1) removeNodes(parent, old, oldStart, oldEnd + 1);
                if (matched === 0) createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns);
                else {
                  if (pos === -1) {
                    lisIndices = makeLisIndices(oldIndices);
                    li = lisIndices.length - 1;
                    for (i = end; i >= start; i--) {
                      v = vnodes[i];
                      if (oldIndices[i - start] === -1) createNode(parent, v, hooks, ns, nextSibling);
                      else {
                        if (lisIndices[li] === i - start) li--;
                        else moveDOM(parent, v, nextSibling);
                      }
                      if (v.dom != null) nextSibling = vnodes[i].dom;
                    }
                  } else {
                    for (i = end; i >= start; i--) {
                      v = vnodes[i];
                      if (oldIndices[i - start] === -1) createNode(parent, v, hooks, ns, nextSibling);
                      if (v.dom != null) nextSibling = vnodes[i].dom;
                    }
                  }
                }
              }
            }
          }
        }
        function updateNode(parent, old, vnode, hooks, nextSibling, ns) {
          var oldTag = old.tag, tag = vnode.tag;
          if (oldTag === tag && old.is === vnode.is) {
            vnode.state = old.state;
            vnode.events = old.events;
            if (shouldNotUpdate(vnode, old)) return;
            if (typeof oldTag === "string") {
              if (vnode.attrs != null) {
                updateLifecycle(vnode.attrs, vnode, hooks);
              }
              switch (oldTag) {
                case "#":
                  updateText(old, vnode);
                  break;
                case "<":
                  updateHTML(parent, old, vnode, ns, nextSibling);
                  break;
                case "[":
                  updateFragment(parent, old, vnode, hooks, nextSibling, ns);
                  break;
                default:
                  updateElement(old, vnode, hooks, ns);
              }
            } else updateComponent(parent, old, vnode, hooks, nextSibling, ns);
          } else {
            removeNode(parent, old);
            createNode(parent, vnode, hooks, ns, nextSibling);
          }
        }
        function updateText(old, vnode) {
          if (old.children.toString() !== vnode.children.toString()) {
            old.dom.nodeValue = vnode.children;
          }
          vnode.dom = old.dom;
        }
        function updateHTML(parent, old, vnode, ns, nextSibling) {
          if (old.children !== vnode.children) {
            removeDOM(parent, old);
            createHTML(parent, vnode, ns, nextSibling);
          } else {
            vnode.dom = old.dom;
            vnode.domSize = old.domSize;
          }
        }
        function updateFragment(parent, old, vnode, hooks, nextSibling, ns) {
          updateNodes(parent, old.children, vnode.children, hooks, nextSibling, ns);
          var domSize = 0, children = vnode.children;
          vnode.dom = null;
          if (children != null) {
            for (var i = 0; i < children.length; i++) {
              var child = children[i];
              if (child != null && child.dom != null) {
                if (vnode.dom == null) vnode.dom = child.dom;
                domSize += child.domSize || 1;
              }
            }
            if (domSize !== 1) vnode.domSize = domSize;
          }
        }
        function updateElement(old, vnode, hooks, ns) {
          var element = vnode.dom = old.dom;
          ns = getNameSpace(vnode) || ns;
          updateAttrs(vnode, old.attrs, vnode.attrs, ns);
          if (!maybeSetContentEditable(vnode)) {
            updateNodes(element, old.children, vnode.children, hooks, null, ns);
          }
        }
        function updateComponent(parent, old, vnode, hooks, nextSibling, ns) {
          vnode.instance = Vnode.normalize(callHook.call(vnode.state.view, vnode));
          if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument");
          updateLifecycle(vnode.state, vnode, hooks);
          if (vnode.attrs != null) updateLifecycle(vnode.attrs, vnode, hooks);
          if (vnode.instance != null) {
            if (old.instance == null) createNode(parent, vnode.instance, hooks, ns, nextSibling);
            else updateNode(parent, old.instance, vnode.instance, hooks, nextSibling, ns);
            vnode.dom = vnode.instance.dom;
            vnode.domSize = vnode.instance.domSize;
          } else if (old.instance != null) {
            removeNode(parent, old.instance);
            vnode.dom = void 0;
            vnode.domSize = 0;
          } else {
            vnode.dom = old.dom;
            vnode.domSize = old.domSize;
          }
        }
        function getKeyMap(vnodes, start, end) {
          var map = /* @__PURE__ */ Object.create(null);
          for (; start < end; start++) {
            var vnode = vnodes[start];
            if (vnode != null) {
              var key = vnode.key;
              if (key != null) map[key] = start;
            }
          }
          return map;
        }
        var lisTemp = [];
        function makeLisIndices(a) {
          var result = [0];
          var u = 0, v = 0, i = 0;
          var il = lisTemp.length = a.length;
          for (var i = 0; i < il; i++) lisTemp[i] = a[i];
          for (var i = 0; i < il; ++i) {
            if (a[i] === -1) continue;
            var j = result[result.length - 1];
            if (a[j] < a[i]) {
              lisTemp[i] = j;
              result.push(i);
              continue;
            }
            u = 0;
            v = result.length - 1;
            while (u < v) {
              var c = (u >>> 1) + (v >>> 1) + (u & v & 1);
              if (a[result[c]] < a[i]) {
                u = c + 1;
              } else {
                v = c;
              }
            }
            if (a[i] < a[result[u]]) {
              if (u > 0) lisTemp[i] = result[u - 1];
              result[u] = i;
            }
          }
          u = result.length;
          v = result[u - 1];
          while (u-- > 0) {
            result[u] = v;
            v = lisTemp[v];
          }
          lisTemp.length = 0;
          return result;
        }
        function getNextSibling(vnodes, i, nextSibling) {
          for (; i < vnodes.length; i++) {
            if (vnodes[i] != null && vnodes[i].dom != null) return vnodes[i].dom;
          }
          return nextSibling;
        }
        function moveDOM(parent, vnode, nextSibling) {
          if (vnode.dom != null) {
            var target;
            if (vnode.domSize == null) {
              target = vnode.dom;
            } else {
              target = getDocument(parent).createDocumentFragment();
              for (var dom of domFor(vnode)) target.appendChild(dom);
            }
            insertDOM(parent, target, nextSibling);
          }
        }
        function insertDOM(parent, dom, nextSibling) {
          if (nextSibling != null) parent.insertBefore(dom, nextSibling);
          else parent.appendChild(dom);
        }
        function maybeSetContentEditable(vnode) {
          if (vnode.attrs == null || vnode.attrs.contenteditable == null && // attribute
          vnode.attrs.contentEditable == null) return false;
          var children = vnode.children;
          if (children != null && children.length === 1 && children[0].tag === "<") {
            var content = children[0].children;
            if (vnode.dom.innerHTML !== content) vnode.dom.innerHTML = content;
          } else if (children != null && children.length !== 0) throw new Error("Child node of a contenteditable must be trusted.");
          return true;
        }
        function removeNodes(parent, vnodes, start, end) {
          for (var i = start; i < end; i++) {
            var vnode = vnodes[i];
            if (vnode != null) removeNode(parent, vnode);
          }
        }
        function tryBlockRemove(parent, vnode, source, counter) {
          var original = vnode.state;
          var result = callHook.call(source.onbeforeremove, vnode);
          if (result == null) return;
          var generation = currentRender;
          for (var dom of domFor(vnode)) delayedRemoval.set(dom, generation);
          counter.v++;
          Promise.resolve(result).finally(function() {
            checkState(vnode, original);
            tryResumeRemove(parent, vnode, counter);
          });
        }
        function tryResumeRemove(parent, vnode, counter) {
          if (--counter.v === 0) {
            onremove(vnode);
            removeDOM(parent, vnode);
          }
        }
        function removeNode(parent, vnode) {
          var counter = { v: 1 };
          if (typeof vnode.tag !== "string" && typeof vnode.state.onbeforeremove === "function") tryBlockRemove(parent, vnode, vnode.state, counter);
          if (vnode.attrs && typeof vnode.attrs.onbeforeremove === "function") tryBlockRemove(parent, vnode, vnode.attrs, counter);
          tryResumeRemove(parent, vnode, counter);
        }
        function removeDOM(parent, vnode) {
          if (vnode.dom == null) return;
          if (vnode.domSize == null) {
            parent.removeChild(vnode.dom);
          } else {
            for (var dom of domFor(vnode)) parent.removeChild(dom);
          }
        }
        function onremove(vnode) {
          if (typeof vnode.tag !== "string" && typeof vnode.state.onremove === "function") callHook.call(vnode.state.onremove, vnode);
          if (vnode.attrs && typeof vnode.attrs.onremove === "function") callHook.call(vnode.attrs.onremove, vnode);
          if (typeof vnode.tag !== "string") {
            if (vnode.instance != null) onremove(vnode.instance);
          } else {
            if (vnode.events != null) vnode.events._ = null;
            var children = vnode.children;
            if (Array.isArray(children)) {
              for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (child != null) onremove(child);
              }
            }
          }
        }
        function setAttrs(vnode, attrs, ns) {
          for (var key in attrs) {
            setAttr(vnode, key, null, attrs[key], ns);
          }
        }
        function setAttr(vnode, key, old, value, ns) {
          if (key === "key" || value == null || isLifecycleMethod(key) || old === value && !isFormAttribute(vnode, key) && typeof value !== "object") return;
          if (key[0] === "o" && key[1] === "n") return updateEvent(vnode, key, value);
          if (key.slice(0, 6) === "xlink:") vnode.dom.setAttributeNS("http://www.w3.org/1999/xlink", key.slice(6), value);
          else if (key === "style") updateStyle(vnode.dom, old, value);
          else if (hasPropertyKey(vnode, key, ns)) {
            if (key === "value") {
              if ((vnode.tag === "input" || vnode.tag === "textarea") && vnode.dom.value === "" + value) return;
              if (vnode.tag === "select" && old !== null && vnode.dom.value === "" + value) return;
              if (vnode.tag === "option" && old !== null && vnode.dom.value === "" + value) return;
              if (vnode.tag === "input" && vnode.attrs.type === "file" && "" + value !== "") {
                console.error("`value` is read-only on file inputs!");
                return;
              }
            }
            if (vnode.tag === "input" && key === "type") vnode.dom.setAttribute(key, value);
            else vnode.dom[key] = value;
          } else {
            if (typeof value === "boolean") {
              if (value) vnode.dom.setAttribute(key, "");
              else vnode.dom.removeAttribute(key);
            } else vnode.dom.setAttribute(key === "className" ? "class" : key, value);
          }
        }
        function removeAttr(vnode, key, old, ns) {
          if (key === "key" || old == null || isLifecycleMethod(key)) return;
          if (key[0] === "o" && key[1] === "n") updateEvent(vnode, key, void 0);
          else if (key === "style") updateStyle(vnode.dom, old, null);
          else if (hasPropertyKey(vnode, key, ns) && key !== "className" && key !== "title" && !(key === "value" && (vnode.tag === "option" || vnode.tag === "select" && vnode.dom.selectedIndex === -1 && vnode.dom === activeElement(vnode.dom))) && !(vnode.tag === "input" && key === "type")) {
            vnode.dom[key] = null;
          } else {
            var nsLastIndex = key.indexOf(":");
            if (nsLastIndex !== -1) key = key.slice(nsLastIndex + 1);
            if (old !== false) vnode.dom.removeAttribute(key === "className" ? "class" : key);
          }
        }
        function setLateSelectAttrs(vnode, attrs) {
          if ("value" in attrs) {
            if (attrs.value === null) {
              if (vnode.dom.selectedIndex !== -1) vnode.dom.value = null;
            } else {
              var normalized = "" + attrs.value;
              if (vnode.dom.value !== normalized || vnode.dom.selectedIndex === -1) {
                vnode.dom.value = normalized;
              }
            }
          }
          if ("selectedIndex" in attrs) setAttr(vnode, "selectedIndex", null, attrs.selectedIndex, void 0);
        }
        function updateAttrs(vnode, old, attrs, ns) {
          var val;
          if (old != null) {
            if (old === attrs) {
              console.warn("Don't reuse attrs object, use new object for every redraw, this will throw in next major");
            }
            for (var key in old) {
              if ((val = old[key]) != null && (attrs == null || attrs[key] == null)) {
                removeAttr(vnode, key, val, ns);
              }
            }
          }
          if (attrs != null) {
            for (var key in attrs) {
              setAttr(vnode, key, old && old[key], attrs[key], ns);
            }
          }
        }
        function isFormAttribute(vnode, attr) {
          return attr === "value" || attr === "checked" || attr === "selectedIndex" || attr === "selected" && (vnode.dom === activeElement(vnode.dom) || vnode.tag === "option" && vnode.dom.parentNode === activeElement(vnode.dom));
        }
        function isLifecycleMethod(attr) {
          return attr === "oninit" || attr === "oncreate" || attr === "onupdate" || attr === "onremove" || attr === "onbeforeremove" || attr === "onbeforeupdate";
        }
        function hasPropertyKey(vnode, key, ns) {
          return ns === void 0 && // If it's a custom element, just keep it.
          (vnode.tag.indexOf("-") > -1 || vnode.is || // If it's a normal element, let's try to avoid a few browser bugs.
          key !== "href" && key !== "list" && key !== "form" && key !== "width" && key !== "height") && key in vnode.dom;
        }
        function updateStyle(element, old, style) {
          if (old === style) {
          } else if (style == null) {
            element.style = "";
          } else if (typeof style !== "object") {
            element.style = style;
          } else if (old == null || typeof old !== "object") {
            element.style = "";
            for (var key in style) {
              var value = style[key];
              if (value != null) {
                if (key.includes("-")) element.style.setProperty(key, String(value));
                else element.style[key] = String(value);
              }
            }
          } else {
            for (var key in old) {
              if (old[key] != null && style[key] == null) {
                if (key.includes("-")) element.style.removeProperty(key);
                else element.style[key] = "";
              }
            }
            for (var key in style) {
              var value = style[key];
              if (value != null && (value = String(value)) !== String(old[key])) {
                if (key.includes("-")) element.style.setProperty(key, value);
                else element.style[key] = value;
              }
            }
          }
        }
        function EventDict() {
          this._ = currentRedraw;
        }
        EventDict.prototype = /* @__PURE__ */ Object.create(null);
        EventDict.prototype.handleEvent = function(ev) {
          var handler = this["on" + ev.type];
          var result;
          if (typeof handler === "function") result = handler.call(ev.currentTarget, ev);
          else if (typeof handler.handleEvent === "function") handler.handleEvent(ev);
          var self = this;
          if (self._ != null) {
            if (ev.redraw !== false) (0, self._)();
            if (result != null && typeof result.then === "function") {
              Promise.resolve(result).then(function() {
                if (self._ != null && ev.redraw !== false) (0, self._)();
              });
            }
          }
          if (result === false) {
            ev.preventDefault();
            ev.stopPropagation();
          }
        };
        function updateEvent(vnode, key, value) {
          if (vnode.events != null) {
            vnode.events._ = currentRedraw;
            if (vnode.events[key] === value) return;
            if (value != null && (typeof value === "function" || typeof value === "object")) {
              if (vnode.events[key] == null) vnode.dom.addEventListener(key.slice(2), vnode.events, false);
              vnode.events[key] = value;
            } else {
              if (vnode.events[key] != null) vnode.dom.removeEventListener(key.slice(2), vnode.events, false);
              vnode.events[key] = void 0;
            }
          } else if (value != null && (typeof value === "function" || typeof value === "object")) {
            vnode.events = new EventDict();
            vnode.dom.addEventListener(key.slice(2), vnode.events, false);
            vnode.events[key] = value;
          }
        }
        function initLifecycle(source, vnode, hooks) {
          if (typeof source.oninit === "function") callHook.call(source.oninit, vnode);
          if (typeof source.oncreate === "function") hooks.push(callHook.bind(source.oncreate, vnode));
        }
        function updateLifecycle(source, vnode, hooks) {
          if (typeof source.onupdate === "function") hooks.push(callHook.bind(source.onupdate, vnode));
        }
        function shouldNotUpdate(vnode, old) {
          do {
            if (vnode.attrs != null && typeof vnode.attrs.onbeforeupdate === "function") {
              var force = callHook.call(vnode.attrs.onbeforeupdate, vnode, old);
              if (force !== void 0 && !force) break;
            }
            if (typeof vnode.tag !== "string" && typeof vnode.state.onbeforeupdate === "function") {
              var force = callHook.call(vnode.state.onbeforeupdate, vnode, old);
              if (force !== void 0 && !force) break;
            }
            return false;
          } while (false);
          vnode.dom = old.dom;
          vnode.domSize = old.domSize;
          vnode.instance = old.instance;
          vnode.attrs = old.attrs;
          vnode.children = old.children;
          vnode.text = old.text;
          return true;
        }
        var currentDOM;
        return function(dom, vnodes, redraw) {
          if (!dom) throw new TypeError("DOM element being rendered to does not exist.");
          if (currentDOM != null && dom.contains(currentDOM)) {
            throw new TypeError("Node is currently being rendered to and thus is locked.");
          }
          var prevRedraw = currentRedraw;
          var prevDOM = currentDOM;
          var hooks = [];
          var active = activeElement(dom);
          var namespace = dom.namespaceURI;
          currentDOM = dom;
          currentRedraw = typeof redraw === "function" ? redraw : void 0;
          currentRender = {};
          try {
            if (dom.vnodes == null) dom.textContent = "";
            vnodes = Vnode.normalizeChildren(Array.isArray(vnodes) ? vnodes : [vnodes]);
            updateNodes(dom, dom.vnodes, vnodes, hooks, null, namespace === "http://www.w3.org/1999/xhtml" ? void 0 : namespace);
            dom.vnodes = vnodes;
            if (active != null && activeElement(dom) !== active && typeof active.focus === "function") active.focus();
            for (var i = 0; i < hooks.length; i++) hooks[i]();
          } finally {
            currentRedraw = prevRedraw;
            currentDOM = prevDOM;
          }
        };
      };
    }
  });

  // node_modules/mithril/render.js
  var require_render2 = __commonJS({
    "node_modules/mithril/render.js"(exports, module) {
      "use strict";
      module.exports = require_render()(typeof window !== "undefined" ? window : null);
    }
  });

  // node_modules/mithril/api/mount-redraw.js
  var require_mount_redraw = __commonJS({
    "node_modules/mithril/api/mount-redraw.js"(exports, module) {
      "use strict";
      var Vnode = require_vnode();
      module.exports = function(render, schedule, console2) {
        var subscriptions = [];
        var pending = false;
        var offset = -1;
        function sync() {
          for (offset = 0; offset < subscriptions.length; offset += 2) {
            try {
              render(subscriptions[offset], Vnode(subscriptions[offset + 1]), redraw);
            } catch (e) {
              console2.error(e);
            }
          }
          offset = -1;
        }
        function redraw() {
          if (!pending) {
            pending = true;
            schedule(function() {
              pending = false;
              sync();
            });
          }
        }
        redraw.sync = sync;
        function mount(root, component) {
          if (component != null && component.view == null && typeof component !== "function") {
            throw new TypeError("m.mount expects a component, not a vnode.");
          }
          var index2 = subscriptions.indexOf(root);
          if (index2 >= 0) {
            subscriptions.splice(index2, 2);
            if (index2 <= offset) offset -= 2;
            render(root, []);
          }
          if (component != null) {
            subscriptions.push(root, component);
            render(root, Vnode(component), redraw);
          }
        }
        return { mount, redraw };
      };
    }
  });

  // node_modules/mithril/mount-redraw.js
  var require_mount_redraw2 = __commonJS({
    "node_modules/mithril/mount-redraw.js"(exports, module) {
      "use strict";
      var render = require_render2();
      module.exports = require_mount_redraw()(render, typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : null, typeof console !== "undefined" ? console : null);
    }
  });

  // node_modules/mithril/querystring/build.js
  var require_build = __commonJS({
    "node_modules/mithril/querystring/build.js"(exports, module) {
      "use strict";
      module.exports = function(object) {
        if (Object.prototype.toString.call(object) !== "[object Object]") return "";
        var args = [];
        for (var key in object) {
          destructure(key, object[key]);
        }
        return args.join("&");
        function destructure(key2, value) {
          if (Array.isArray(value)) {
            for (var i = 0; i < value.length; i++) {
              destructure(key2 + "[" + i + "]", value[i]);
            }
          } else if (Object.prototype.toString.call(value) === "[object Object]") {
            for (var i in value) {
              destructure(key2 + "[" + i + "]", value[i]);
            }
          } else args.push(encodeURIComponent(key2) + (value != null && value !== "" ? "=" + encodeURIComponent(value) : ""));
        }
      };
    }
  });

  // node_modules/mithril/pathname/build.js
  var require_build2 = __commonJS({
    "node_modules/mithril/pathname/build.js"(exports, module) {
      "use strict";
      var buildQueryString = require_build();
      module.exports = function(template, params) {
        if (/:([^\/\.-]+)(\.{3})?:/.test(template)) {
          throw new SyntaxError("Template parameter names must be separated by either a '/', '-', or '.'.");
        }
        if (params == null) return template;
        var queryIndex = template.indexOf("?");
        var hashIndex = template.indexOf("#");
        var queryEnd = hashIndex < 0 ? template.length : hashIndex;
        var pathEnd = queryIndex < 0 ? queryEnd : queryIndex;
        var path = template.slice(0, pathEnd);
        var query = {};
        Object.assign(query, params);
        var resolved = path.replace(/:([^\/\.-]+)(\.{3})?/g, function(m9, key, variadic) {
          delete query[key];
          if (params[key] == null) return m9;
          return variadic ? params[key] : encodeURIComponent(String(params[key]));
        });
        var newQueryIndex = resolved.indexOf("?");
        var newHashIndex = resolved.indexOf("#");
        var newQueryEnd = newHashIndex < 0 ? resolved.length : newHashIndex;
        var newPathEnd = newQueryIndex < 0 ? newQueryEnd : newQueryIndex;
        var result = resolved.slice(0, newPathEnd);
        if (queryIndex >= 0) result += template.slice(queryIndex, queryEnd);
        if (newQueryIndex >= 0) result += (queryIndex < 0 ? "?" : "&") + resolved.slice(newQueryIndex, newQueryEnd);
        var querystring = buildQueryString(query);
        if (querystring) result += (queryIndex < 0 && newQueryIndex < 0 ? "?" : "&") + querystring;
        if (hashIndex >= 0) result += template.slice(hashIndex);
        if (newHashIndex >= 0) result += (hashIndex < 0 ? "" : "&") + resolved.slice(newHashIndex);
        return result;
      };
    }
  });

  // node_modules/mithril/request/request.js
  var require_request = __commonJS({
    "node_modules/mithril/request/request.js"(exports, module) {
      "use strict";
      var buildPathname = require_build2();
      var hasOwn = require_hasOwn();
      module.exports = function($window, oncompletion) {
        function PromiseProxy(executor) {
          return new Promise(executor);
        }
        function makeRequest(url, args) {
          return new Promise(function(resolve, reject) {
            url = buildPathname(url, args.params);
            var method = args.method != null ? args.method.toUpperCase() : "GET";
            var body = args.body;
            var assumeJSON = (args.serialize == null || args.serialize === JSON.serialize) && !(body instanceof $window.FormData || body instanceof $window.URLSearchParams);
            var responseType = args.responseType || (typeof args.extract === "function" ? "" : "json");
            var xhr = new $window.XMLHttpRequest(), aborted = false, isTimeout = false;
            var original = xhr, replacedAbort;
            var abort = xhr.abort;
            xhr.abort = function() {
              aborted = true;
              abort.call(this);
            };
            xhr.open(method, url, args.async !== false, typeof args.user === "string" ? args.user : void 0, typeof args.password === "string" ? args.password : void 0);
            if (assumeJSON && body != null && !hasHeader(args, "content-type")) {
              xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            }
            if (typeof args.deserialize !== "function" && !hasHeader(args, "accept")) {
              xhr.setRequestHeader("Accept", "application/json, text/*");
            }
            if (args.withCredentials) xhr.withCredentials = args.withCredentials;
            if (args.timeout) xhr.timeout = args.timeout;
            xhr.responseType = responseType;
            for (var key in args.headers) {
              if (hasOwn.call(args.headers, key)) {
                xhr.setRequestHeader(key, args.headers[key]);
              }
            }
            xhr.onreadystatechange = function(ev) {
              if (aborted) return;
              if (ev.target.readyState === 4) {
                try {
                  var success = ev.target.status >= 200 && ev.target.status < 300 || ev.target.status === 304 || /^file:\/\//i.test(url);
                  var response = ev.target.response, message;
                  if (responseType === "json") {
                    if (!ev.target.responseType && typeof args.extract !== "function") {
                      try {
                        response = JSON.parse(ev.target.responseText);
                      } catch (e) {
                        response = null;
                      }
                    }
                  } else if (!responseType || responseType === "text") {
                    if (response == null) response = ev.target.responseText;
                  }
                  if (typeof args.extract === "function") {
                    response = args.extract(ev.target, args);
                    success = true;
                  } else if (typeof args.deserialize === "function") {
                    response = args.deserialize(response);
                  }
                  if (success) {
                    if (typeof args.type === "function") {
                      if (Array.isArray(response)) {
                        for (var i = 0; i < response.length; i++) {
                          response[i] = new args.type(response[i]);
                        }
                      } else response = new args.type(response);
                    }
                    resolve(response);
                  } else {
                    var completeErrorResponse = function() {
                      try {
                        message = ev.target.responseText;
                      } catch (e) {
                        message = response;
                      }
                      var error = new Error(message);
                      error.code = ev.target.status;
                      error.response = response;
                      reject(error);
                    };
                    if (xhr.status === 0) {
                      setTimeout(function() {
                        if (isTimeout) return;
                        completeErrorResponse();
                      });
                    } else completeErrorResponse();
                  }
                } catch (e) {
                  reject(e);
                }
              }
            };
            xhr.ontimeout = function(ev) {
              isTimeout = true;
              var error = new Error("Request timed out");
              error.code = ev.target.status;
              reject(error);
            };
            if (typeof args.config === "function") {
              xhr = args.config(xhr, args, url) || xhr;
              if (xhr !== original) {
                replacedAbort = xhr.abort;
                xhr.abort = function() {
                  aborted = true;
                  replacedAbort.call(this);
                };
              }
            }
            if (body == null) xhr.send();
            else if (typeof args.serialize === "function") xhr.send(args.serialize(body));
            else if (body instanceof $window.FormData || body instanceof $window.URLSearchParams) xhr.send(body);
            else xhr.send(JSON.stringify(body));
          });
        }
        PromiseProxy.prototype = Promise.prototype;
        PromiseProxy.__proto__ = Promise;
        function hasHeader(args, name) {
          for (var key in args.headers) {
            if (hasOwn.call(args.headers, key) && key.toLowerCase() === name) return true;
          }
          return false;
        }
        return {
          request: function(url, args) {
            if (typeof url !== "string") {
              args = url;
              url = url.url;
            } else if (args == null) args = {};
            var promise = makeRequest(url, args);
            if (args.background === true) return promise;
            var count = 0;
            function complete() {
              if (--count === 0 && typeof oncompletion === "function") oncompletion();
            }
            return wrap(promise);
            function wrap(promise2) {
              var then = promise2.then;
              promise2.constructor = PromiseProxy;
              promise2.then = function() {
                count++;
                var next = then.apply(promise2, arguments);
                next.then(complete, function(e) {
                  complete();
                  if (count === 0) throw e;
                });
                return wrap(next);
              };
              return promise2;
            }
          }
        };
      };
    }
  });

  // node_modules/mithril/request.js
  var require_request2 = __commonJS({
    "node_modules/mithril/request.js"(exports, module) {
      "use strict";
      var mountRedraw = require_mount_redraw2();
      module.exports = require_request()(typeof window !== "undefined" ? window : null, mountRedraw.redraw);
    }
  });

  // node_modules/mithril/querystring/parse.js
  var require_parse = __commonJS({
    "node_modules/mithril/querystring/parse.js"(exports, module) {
      "use strict";
      function decodeURIComponentSave(str) {
        try {
          return decodeURIComponent(str);
        } catch (err) {
          return str;
        }
      }
      module.exports = function(string) {
        if (string === "" || string == null) return {};
        if (string.charAt(0) === "?") string = string.slice(1);
        var entries = string.split("&"), counters = {}, data = {};
        for (var i = 0; i < entries.length; i++) {
          var entry = entries[i].split("=");
          var key = decodeURIComponentSave(entry[0]);
          var value = entry.length === 2 ? decodeURIComponentSave(entry[1]) : "";
          if (value === "true") value = true;
          else if (value === "false") value = false;
          var levels = key.split(/\]\[?|\[/);
          var cursor = data;
          if (key.indexOf("[") > -1) levels.pop();
          for (var j = 0; j < levels.length; j++) {
            var level = levels[j], nextLevel = levels[j + 1];
            var isNumber = nextLevel == "" || !isNaN(parseInt(nextLevel, 10));
            if (level === "") {
              var key = levels.slice(0, j).join();
              if (counters[key] == null) {
                counters[key] = Array.isArray(cursor) ? cursor.length : 0;
              }
              level = counters[key]++;
            } else if (level === "__proto__") break;
            if (j === levels.length - 1) cursor[level] = value;
            else {
              var desc = Object.getOwnPropertyDescriptor(cursor, level);
              if (desc != null) desc = desc.value;
              if (desc == null) cursor[level] = desc = isNumber ? [] : {};
              cursor = desc;
            }
          }
        }
        return data;
      };
    }
  });

  // node_modules/mithril/pathname/parse.js
  var require_parse2 = __commonJS({
    "node_modules/mithril/pathname/parse.js"(exports, module) {
      "use strict";
      var parseQueryString = require_parse();
      module.exports = function(url) {
        var queryIndex = url.indexOf("?");
        var hashIndex = url.indexOf("#");
        var queryEnd = hashIndex < 0 ? url.length : hashIndex;
        var pathEnd = queryIndex < 0 ? queryEnd : queryIndex;
        var path = url.slice(0, pathEnd).replace(/\/{2,}/g, "/");
        if (!path) path = "/";
        else {
          if (path[0] !== "/") path = "/" + path;
        }
        return {
          path,
          params: queryIndex < 0 ? {} : parseQueryString(url.slice(queryIndex + 1, queryEnd))
        };
      };
    }
  });

  // node_modules/mithril/pathname/compileTemplate.js
  var require_compileTemplate = __commonJS({
    "node_modules/mithril/pathname/compileTemplate.js"(exports, module) {
      "use strict";
      var parsePathname = require_parse2();
      module.exports = function(template) {
        var templateData = parsePathname(template);
        var templateKeys = Object.keys(templateData.params);
        var keys = [];
        var regexp = new RegExp("^" + templateData.path.replace(
          // I escape literal text so people can use things like `:file.:ext` or
          // `:lang-:locale` in routes. This is all merged into one pass so I
          // don't also accidentally escape `-` and make it harder to detect it to
          // ban it from template parameters.
          /:([^\/.-]+)(\.{3}|\.(?!\.)|-)?|[\\^$*+.()|\[\]{}]/g,
          function(m9, key, extra) {
            if (key == null) return "\\" + m9;
            keys.push({ k: key, r: extra === "..." });
            if (extra === "...") return "(.*)";
            if (extra === ".") return "([^/]+)\\.";
            return "([^/]+)" + (extra || "");
          }
        ) + "\\/?$");
        return function(data) {
          for (var i = 0; i < templateKeys.length; i++) {
            if (templateData.params[templateKeys[i]] !== data.params[templateKeys[i]]) return false;
          }
          if (!keys.length) return regexp.test(data.path);
          var values = regexp.exec(data.path);
          if (values == null) return false;
          for (var i = 0; i < keys.length; i++) {
            data.params[keys[i].k] = keys[i].r ? values[i + 1] : decodeURIComponent(values[i + 1]);
          }
          return true;
        };
      };
    }
  });

  // node_modules/mithril/util/censor.js
  var require_censor = __commonJS({
    "node_modules/mithril/util/censor.js"(exports, module) {
      "use strict";
      var hasOwn = require_hasOwn();
      var magic = new RegExp("^(?:key|oninit|oncreate|onbeforeupdate|onupdate|onbeforeremove|onremove)$");
      module.exports = function(attrs, extras) {
        var result = {};
        if (extras != null) {
          for (var key in attrs) {
            if (hasOwn.call(attrs, key) && !magic.test(key) && extras.indexOf(key) < 0) {
              result[key] = attrs[key];
            }
          }
        } else {
          for (var key in attrs) {
            if (hasOwn.call(attrs, key) && !magic.test(key)) {
              result[key] = attrs[key];
            }
          }
        }
        return result;
      };
    }
  });

  // node_modules/mithril/api/router.js
  var require_router = __commonJS({
    "node_modules/mithril/api/router.js"(exports, module) {
      "use strict";
      var Vnode = require_vnode();
      var m9 = require_hyperscript();
      var buildPathname = require_build2();
      var parsePathname = require_parse2();
      var compileTemplate = require_compileTemplate();
      var censor = require_censor();
      function decodeURIComponentSave(component) {
        try {
          return decodeURIComponent(component);
        } catch (e) {
          return component;
        }
      }
      module.exports = function($window, mountRedraw) {
        var callAsync = $window == null ? null : typeof $window.setImmediate === "function" ? $window.setImmediate : $window.setTimeout;
        var p = Promise.resolve();
        var scheduled = false;
        var ready = false;
        var hasBeenResolved = false;
        var dom, compiled, fallbackRoute;
        var currentResolver, component, attrs, currentPath, lastUpdate;
        var RouterRoot = {
          onremove: function() {
            ready = hasBeenResolved = false;
            $window.removeEventListener("popstate", fireAsync, false);
          },
          view: function() {
            var vnode = Vnode(component, attrs.key, attrs);
            if (currentResolver) return currentResolver.render(vnode);
            return [vnode];
          }
        };
        var SKIP = route.SKIP = {};
        function resolveRoute() {
          scheduled = false;
          var prefix = $window.location.hash;
          if (route.prefix[0] !== "#") {
            prefix = $window.location.search + prefix;
            if (route.prefix[0] !== "?") {
              prefix = $window.location.pathname + prefix;
              if (prefix[0] !== "/") prefix = "/" + prefix;
            }
          }
          var path = prefix.concat().replace(/(?:%[a-f89][a-f0-9])+/gim, decodeURIComponentSave).slice(route.prefix.length);
          var data = parsePathname(path);
          Object.assign(data.params, $window.history.state);
          function reject(e) {
            console.error(e);
            route.set(fallbackRoute, null, { replace: true });
          }
          loop(0);
          function loop(i) {
            for (; i < compiled.length; i++) {
              if (compiled[i].check(data)) {
                var payload = compiled[i].component;
                var matchedRoute = compiled[i].route;
                var localComp = payload;
                var update = lastUpdate = function(comp) {
                  if (update !== lastUpdate) return;
                  if (comp === SKIP) return loop(i + 1);
                  component = comp != null && (typeof comp.view === "function" || typeof comp === "function") ? comp : "div";
                  attrs = data.params, currentPath = path, lastUpdate = null;
                  currentResolver = payload.render ? payload : null;
                  if (hasBeenResolved) mountRedraw.redraw();
                  else {
                    hasBeenResolved = true;
                    mountRedraw.mount(dom, RouterRoot);
                  }
                };
                if (payload.view || typeof payload === "function") {
                  payload = {};
                  update(localComp);
                } else if (payload.onmatch) {
                  p.then(function() {
                    return payload.onmatch(data.params, path, matchedRoute);
                  }).then(update, path === fallbackRoute ? null : reject);
                } else update(
                  /* "div" */
                );
                return;
              }
            }
            if (path === fallbackRoute) {
              throw new Error("Could not resolve default route " + fallbackRoute + ".");
            }
            route.set(fallbackRoute, null, { replace: true });
          }
        }
        function fireAsync() {
          if (!scheduled) {
            scheduled = true;
            callAsync(resolveRoute);
          }
        }
        function route(root, defaultRoute, routes) {
          if (!root) throw new TypeError("DOM element being rendered to does not exist.");
          compiled = Object.keys(routes).map(function(route2) {
            if (route2[0] !== "/") throw new SyntaxError("Routes must start with a '/'.");
            if (/:([^\/\.-]+)(\.{3})?:/.test(route2)) {
              throw new SyntaxError("Route parameter names must be separated with either '/', '.', or '-'.");
            }
            return {
              route: route2,
              component: routes[route2],
              check: compileTemplate(route2)
            };
          });
          fallbackRoute = defaultRoute;
          if (defaultRoute != null) {
            var defaultData = parsePathname(defaultRoute);
            if (!compiled.some(function(i) {
              return i.check(defaultData);
            })) {
              throw new ReferenceError("Default route doesn't match any known routes.");
            }
          }
          dom = root;
          $window.addEventListener("popstate", fireAsync, false);
          ready = true;
          resolveRoute();
        }
        route.set = function(path, data, options) {
          if (lastUpdate != null) {
            options = options || {};
            options.replace = true;
          }
          lastUpdate = null;
          path = buildPathname(path, data);
          if (ready) {
            fireAsync();
            var state = options ? options.state : null;
            var title = options ? options.title : null;
            if (options && options.replace) $window.history.replaceState(state, title, route.prefix + path);
            else $window.history.pushState(state, title, route.prefix + path);
          } else {
            $window.location.href = route.prefix + path;
          }
        };
        route.get = function() {
          return currentPath;
        };
        route.prefix = "#!";
        route.Link = {
          view: function(vnode) {
            var child = m9(
              vnode.attrs.selector || "a",
              censor(vnode.attrs, ["options", "params", "selector", "onclick"]),
              vnode.children
            );
            var options, onclick, href;
            if (child.attrs.disabled = Boolean(child.attrs.disabled)) {
              child.attrs.href = null;
              child.attrs["aria-disabled"] = "true";
            } else {
              options = vnode.attrs.options;
              onclick = vnode.attrs.onclick;
              href = buildPathname(child.attrs.href, vnode.attrs.params);
              child.attrs.href = route.prefix + href;
              child.attrs.onclick = function(e) {
                var result;
                if (typeof onclick === "function") {
                  result = onclick.call(e.currentTarget, e);
                } else if (onclick == null || typeof onclick !== "object") {
                } else if (typeof onclick.handleEvent === "function") {
                  onclick.handleEvent(e);
                }
                if (
                  // Skip if `onclick` prevented default
                  result !== false && !e.defaultPrevented && // Ignore everything but left clicks
                  (e.button === 0 || e.which === 0 || e.which === 1) && // Let the browser handle `target=_blank`, etc.
                  (!e.currentTarget.target || e.currentTarget.target === "_self") && // No modifier keys
                  !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey
                ) {
                  e.preventDefault();
                  e.redraw = false;
                  route.set(href, null, options);
                }
              };
            }
            return child;
          }
        };
        route.param = function(key) {
          return attrs && key != null ? attrs[key] : attrs;
        };
        return route;
      };
    }
  });

  // node_modules/mithril/route.js
  var require_route = __commonJS({
    "node_modules/mithril/route.js"(exports, module) {
      "use strict";
      var mountRedraw = require_mount_redraw2();
      module.exports = require_router()(typeof window !== "undefined" ? window : null, mountRedraw);
    }
  });

  // node_modules/mithril/index.js
  var require_mithril = __commonJS({
    "node_modules/mithril/index.js"(exports, module) {
      "use strict";
      var hyperscript = require_hyperscript2();
      var request = require_request2();
      var mountRedraw = require_mount_redraw2();
      var domFor = require_domFor();
      var m9 = function m10() {
        return hyperscript.apply(this, arguments);
      };
      m9.m = hyperscript;
      m9.trust = hyperscript.trust;
      m9.fragment = hyperscript.fragment;
      m9.Fragment = "[";
      m9.mount = mountRedraw.mount;
      m9.route = require_route();
      m9.render = require_render2();
      m9.redraw = mountRedraw.redraw;
      m9.request = request.request;
      m9.parseQueryString = require_parse();
      m9.buildQueryString = require_build();
      m9.parsePathname = require_parse2();
      m9.buildPathname = require_build2();
      m9.vnode = require_vnode();
      m9.censor = require_censor();
      m9.domFor = domFor.domFor;
      module.exports = m9;
    }
  });

  // src/index.js
  var import_mithril8 = __toESM(require_mithril(), 1);

  // src/views/LandingPage.js
  var import_mithril = __toESM(require_mithril(), 1);
  var i18n = {
    en: {
      welcome: "Welcome",
      subtitle: "Select your language and theme below",
      login: "Log In",
      signup: "Sign Up",
      loggedIn: "You are already signed in",
      theme: "Theme",
      language: "Language",
      changePassword: "Change Password"
    },
    id: {
      welcome: "Selamat Datang",
      subtitle: "Pilih bahasa dan tema di bawah ini",
      login: "Masuk",
      signup: "Daftar",
      loggedIn: "Anda sudah masuk",
      theme: "Tema",
      language: "Bahasa",
      changePassword: "Ubah Kata Sandi"
    }
  };
  var LandingPage = {
    lang: localStorage.getItem("lang") || "en",
    selectedTheme: localStorage.getItem("theme") || "auto",
    themes: ["auto", "light", "dark"],
    oninit: () => {
      document.documentElement.setAttribute("data-theme", LandingPage.selectedTheme);
      document.documentElement.setAttribute("lang", LandingPage.lang);
    },
    view: () => {
      const t2 = i18n[LandingPage.lang];
      const isLoggedIn = localStorage.getItem("token") !== null;
      document.documentElement.setAttribute("data-theme", LandingPage.selectedTheme);
      return (0, import_mithril.default)("main.container", [
        (0, import_mithril.default)("hgroup", [
          (0, import_mithril.default)("h1", t2.welcome),
          (0, import_mithril.default)("h2", t2.subtitle)
        ]),
        isLoggedIn ? (0, import_mithril.default)("div", [
          (0, import_mithril.default)("p", { style: "color: green" }, `\u2705 ${t2.loggedIn}`),
          (0, import_mithril.default)("nav", { style: "display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem;" }, [
            (0, import_mithril.default)("a", {
              href: "/change-password",
              oncreate: import_mithril.default.route.link,
              style: "text-decoration: underline; color: var(--primary);"
              // pretty, Pico-style
            }, `\u{1F511} ${t2.changePassword}`),
            (0, import_mithril.default)("button", {
              onclick: () => {
                const lang3 = localStorage.getItem("lang");
                const theme = localStorage.getItem("theme");
                localStorage.clear();
                localStorage.setItem("lang", lang3);
                localStorage.setItem("theme", theme);
                location.reload();
              }
            }, "\u{1F6AA} Log Out")
          ])
        ]) : (0, import_mithril.default)("nav", { style: "display: flex; gap: 1rem;" }, [
          (0, import_mithril.default)("a", {
            href: "/login",
            oncreate: import_mithril.default.route.link
          }, `\u{1F510} ${t2.login}`),
          (0, import_mithril.default)("a", {
            href: "/signup",
            oncreate: import_mithril.default.route.link
          }, `\u{1F4DD} ${t2.signup}`)
        ]),
        (0, import_mithril.default)("section", [
          (0, import_mithril.default)("label", `${t2.theme}:`),
          (0, import_mithril.default)("select", {
            onchange: (e) => {
              const value = e.target.value;
              LandingPage.selectedTheme = value;
              localStorage.setItem("theme", value);
              document.documentElement.setAttribute("data-theme", value);
            }
          }, LandingPage.themes.map(
            (theme) => (0, import_mithril.default)("option", {
              value: theme,
              selected: LandingPage.selectedTheme === theme
            }, theme.charAt(0).toUpperCase() + theme.slice(1))
          )),
          (0, import_mithril.default)("label", `${t2.language}:`),
          (0, import_mithril.default)("select", {
            onchange: (e) => {
              const value = e.target.value;
              LandingPage.lang = value;
              localStorage.setItem("lang", value);
            }
          }, ["en", "id"].map(
            (lang3) => (0, import_mithril.default)("option", {
              value: lang3,
              selected: LandingPage.lang === lang3
            }, lang3 === "en" ? "\u{1F1FA}\u{1F1F8} English" : "\u{1F1EE}\u{1F1E9} Bahasa Indonesia")
          ))
        ])
      ]);
    }
  };
  var LandingPage_default = LandingPage;

  // src/views/SignupForm.js
  var import_mithril2 = __toESM(require_mithril(), 1);
  function debounce(fn, delay) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }
  var i18n2 = {
    en: {
      createAccount: "Create Account",
      subtitle: "Join us and start your journey",
      fullName: "Full Name",
      username: "Username",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      usernameAvailable: "\u2705 Username is available",
      usernameTaken: "\u274C Username is taken",
      checking: "\u23F3 Checking availability...",
      signUp: "Sign Up",
      signingUp: "Signing Up...",
      passwordMismatch: "Passwords do not match",
      usernameOrEmailExists: "Username or email already exists",
      signupFailed: "Signup failed",
      completeFields: "Please complete all fields correctly.",
      tooWeak: "Too Weak",
      weak: "Weak",
      fair: "Fair",
      strong: "Strong",
      veryStrong: "Very Strong"
    },
    id: {
      createAccount: "Buat Akun",
      subtitle: "Bergabunglah dan mulai perjalanan Anda",
      fullName: "Nama Lengkap",
      username: "Nama Pengguna",
      email: "Surel",
      password: "Kata Sandi",
      confirmPassword: "Konfirmasi Kata Sandi",
      usernameAvailable: "\u2705 Nama pengguna tersedia",
      usernameTaken: "\u274C Nama pengguna sudah dipakai",
      checking: "\u23F3 Memeriksa ketersediaan...",
      signUp: "Daftar",
      signingUp: "Mendaftar...",
      passwordMismatch: "Kata sandi tidak cocok",
      usernameOrEmailExists: "Nama pengguna atau email sudah ada",
      signupFailed: "Pendaftaran gagal",
      completeFields: "Silakan lengkapi semua kolom dengan benar.",
      tooWeak: "Terlalu Lemah",
      weak: "Lemah",
      fair: "Cukup",
      strong: "Kuat",
      veryStrong: "Sangat Kuat"
    }
  };
  var lang = localStorage.getItem("lang") || "en";
  var t = i18n2[lang];
  var strengthLabels = [
    t.tooWeak,
    t.weak,
    t.fair,
    t.strong,
    t.veryStrong
  ];
  var SignupForm = {
    fullName: "",
    userName: "",
    userNameAvailable: null,
    email: "",
    password: "",
    confirmPassword: "",
    error: "",
    success: "",
    isFormValid: false,
    isLoading: false,
    validateForm() {
      SignupForm.isFormValid = SignupForm.fullName.trim() && SignupForm.userName.trim() && SignupForm.email.trim() && SignupForm.password && SignupForm.confirmPassword && SignupForm.password === SignupForm.confirmPassword && SignupForm.userNameAvailable === true;
    },
    getPasswordStrength(password) {
      if (!password) return 0;
      let score = 0;
      if (password.length >= 8) score++;
      if (/[A-Z]/.test(password)) score++;
      if (/[a-z]/.test(password)) score++;
      if (/[0-9]/.test(password)) score++;
      if (/[^A-Za-z0-9]/.test(password)) score++;
      return score;
    },
    checkUsernameAvailability: debounce(async function() {
      if (!SignupForm.userName) return;
      try {
        const res = await import_mithril2.default.request({
          method: "GET",
          url: `/api/check-username?userName=${SignupForm.userName}`
        });
        SignupForm.userNameAvailable = res.available;
      } catch (err) {
        SignupForm.userNameAvailable = false;
      }
      SignupForm.validateForm();
      import_mithril2.default.redraw();
    }, 750),
    view: () => {
      document.documentElement.setAttribute("data-theme", localStorage.getItem("theme") || "auto");
      const strength = SignupForm.getPasswordStrength(SignupForm.password);
      SignupForm.validateForm();
      return (0, import_mithril2.default)("main.container", [
        (0, import_mithril2.default)("article", [
          (0, import_mithril2.default)("hgroup", [
            (0, import_mithril2.default)("h1", t.createAccount),
            (0, import_mithril2.default)("h2", t.subtitle)
          ]),
          SignupForm.error && (0, import_mithril2.default)("p", { class: "text-red-600" }, SignupForm.error),
          SignupForm.success && (0, import_mithril2.default)("p", { class: "text-green-600" }, SignupForm.success),
          (0, import_mithril2.default)("form", {
            onsubmit: async (e) => {
              e.preventDefault();
              SignupForm.error = SignupForm.success = "";
              SignupForm.isLoading = true;
              import_mithril2.default.redraw();
              if (SignupForm.password !== SignupForm.confirmPassword) {
                SignupForm.error = t.passwordMismatch;
                SignupForm.isLoading = false;
                import_mithril2.default.redraw();
                return;
              }
              try {
                const res = await import_mithril2.default.request({
                  method: "POST",
                  url: "/api/signup",
                  body: {
                    fullName: SignupForm.fullName,
                    userName: SignupForm.userName,
                    email: SignupForm.email,
                    password: SignupForm.password
                  }
                });
                SignupForm.success = res.msg;
                localStorage.setItem("token", res.token);
              } catch (err) {
                SignupForm.error = err.message || t.signupFailed;
                if (err.status === 409) {
                  SignupForm.error = t.usernameOrEmailExists;
                }
              }
              SignupForm.isLoading = false;
              import_mithril2.default.redraw();
            }
          }, [
            (0, import_mithril2.default)("label", { for: "fullName" }, t.fullName),
            (0, import_mithril2.default)("input", {
              id: "fullName",
              type: "text",
              placeholder: "Guntur D",
              value: SignupForm.fullName,
              oninput: (e) => {
                SignupForm.fullName = e.target.value;
                SignupForm.validateForm();
              }
            }),
            (0, import_mithril2.default)("label", { for: "userName" }, t.username),
            (0, import_mithril2.default)("input", {
              id: "userName",
              type: "text",
              placeholder: "username123",
              value: SignupForm.userName,
              oninput: (e) => {
                SignupForm.userName = e.target.value;
                SignupForm.userNameAvailable = null;
                SignupForm.validateForm();
                SignupForm.checkUsernameAvailability();
              }
            }),
            SignupForm.userName && SignupForm.userNameAvailable === null && (0, import_mithril2.default)("small", t.checking),
            SignupForm.userName && SignupForm.userNameAvailable === true && (0, import_mithril2.default)("small", { style: "color:green" }, t.usernameAvailable),
            SignupForm.userName && SignupForm.userNameAvailable === false && (0, import_mithril2.default)("small", { style: "color:red" }, t.usernameTaken),
            (0, import_mithril2.default)("label", { for: "email" }, t.email),
            (0, import_mithril2.default)("input", {
              id: "email",
              type: "email",
              placeholder: "you@example.com",
              value: SignupForm.email,
              oninput: (e) => {
                SignupForm.email = e.target.value;
                SignupForm.validateForm();
              }
            }),
            (0, import_mithril2.default)("label", { for: "password" }, t.password),
            (0, import_mithril2.default)("input", {
              id: "password",
              type: "password",
              placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
              value: SignupForm.password,
              oninput: (e) => {
                SignupForm.password = e.target.value;
                SignupForm.validateForm();
              }
            }),
            SignupForm.password && (0, import_mithril2.default)("small", strengthLabels[strength - 1] || t.tooWeak),
            SignupForm.password && (0, import_mithril2.default)("progress", {
              value: strength,
              max: 5,
              style: "width:100%; height: 8px;"
            }),
            (0, import_mithril2.default)("label", { for: "confirmPassword" }, t.confirmPassword),
            (0, import_mithril2.default)("input", {
              id: "confirmPassword",
              type: "password",
              placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
              value: SignupForm.confirmPassword,
              oninput: (e) => {
                SignupForm.confirmPassword = e.target.value;
                SignupForm.validateForm();
              }
            }),
            (0, import_mithril2.default)("button", {
              type: "submit",
              value: t.signUp,
              disabled: SignupForm.isLoading || !SignupForm.isFormValid || SignupForm.userNameAvailable === null,
              "aria-busy": SignupForm.isLoading ? "true" : null
            }, SignupForm.isLoading ? (0, import_mithril2.default)("span", [
              (0, import_mithril2.default)("span", { "aria-hidden": "true", style: "margin-right: 0.5em;" }, "\u23F3"),
              t.signingUp
            ]) : t.signUp),
            !SignupForm.isFormValid && (0, import_mithril2.default)("p", { style: "color:#e1a500" }, t.completeFields)
          ])
        ])
      ]);
    }
  };
  var SignupForm_default = SignupForm;

  // src/views/LoginForm.js
  var import_mithril3 = __toESM(require_mithril(), 1);

  // node_modules/tslib/tslib.es6.mjs
  var __assign = function() {
    __assign = Object.assign || function __assign2(t2) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t2[p] = s[p];
      }
      return t2;
    };
    return __assign.apply(this, arguments);
  };
  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }
  function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t2[0] & 1) throw t2[1];
      return t2[1];
    }, trys: [], ops: [] }, f, y, t2, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
        if (f = 1, y && (t2 = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t2 = y["return"]) && t2.call(y), 0) : y.next) && !(t2 = t2.call(y, op[1])).done) return t2;
        if (y = 0, t2) op = [op[0] & 2, t2.value];
        switch (op[0]) {
          case 0:
          case 1:
            t2 = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t2 = _.trys, t2 = t2.length > 0 && t2[t2.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t2 || op[1] > t2[0] && op[1] < t2[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t2[1]) {
              _.label = t2[1];
              t2 = op;
              break;
            }
            if (t2 && _.label < t2[2]) {
              _.label = t2[2];
              _.ops.push(op);
              break;
            }
            if (t2[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t2 = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  }
  function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  }

  // node_modules/@fingerprintjs/fingerprintjs/dist/fp.esm.js
  var version = "4.6.2";
  function wait(durationMs, resolveWith) {
    return new Promise(function(resolve) {
      return setTimeout(resolve, durationMs, resolveWith);
    });
  }
  function releaseEventLoop() {
    return new Promise(function(resolve) {
      var channel = new MessageChannel();
      channel.port1.onmessage = function() {
        return resolve();
      };
      channel.port2.postMessage(null);
    });
  }
  function requestIdleCallbackIfAvailable(fallbackTimeout, deadlineTimeout) {
    if (deadlineTimeout === void 0) {
      deadlineTimeout = Infinity;
    }
    var requestIdleCallback = window.requestIdleCallback;
    if (requestIdleCallback) {
      return new Promise(function(resolve) {
        return requestIdleCallback.call(window, function() {
          return resolve();
        }, { timeout: deadlineTimeout });
      });
    } else {
      return wait(Math.min(fallbackTimeout, deadlineTimeout));
    }
  }
  function isPromise(value) {
    return !!value && typeof value.then === "function";
  }
  function awaitIfAsync(action, callback) {
    try {
      var returnedValue = action();
      if (isPromise(returnedValue)) {
        returnedValue.then(function(result) {
          return callback(true, result);
        }, function(error) {
          return callback(false, error);
        });
      } else {
        callback(true, returnedValue);
      }
    } catch (error) {
      callback(false, error);
    }
  }
  function mapWithBreaks(items, callback, loopReleaseInterval) {
    if (loopReleaseInterval === void 0) {
      loopReleaseInterval = 16;
    }
    return __awaiter(this, void 0, void 0, function() {
      var results, lastLoopReleaseTime, i, now;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            results = Array(items.length);
            lastLoopReleaseTime = Date.now();
            i = 0;
            _a.label = 1;
          case 1:
            if (!(i < items.length)) return [3, 4];
            results[i] = callback(items[i], i);
            now = Date.now();
            if (!(now >= lastLoopReleaseTime + loopReleaseInterval)) return [3, 3];
            lastLoopReleaseTime = now;
            return [4, releaseEventLoop()];
          case 2:
            _a.sent();
            _a.label = 3;
          case 3:
            ++i;
            return [3, 1];
          case 4:
            return [2, results];
        }
      });
    });
  }
  function suppressUnhandledRejectionWarning(promise) {
    promise.then(void 0, function() {
      return void 0;
    });
    return promise;
  }
  function includes(haystack, needle) {
    for (var i = 0, l = haystack.length; i < l; ++i) {
      if (haystack[i] === needle) {
        return true;
      }
    }
    return false;
  }
  function excludes(haystack, needle) {
    return !includes(haystack, needle);
  }
  function toInt(value) {
    return parseInt(value);
  }
  function toFloat(value) {
    return parseFloat(value);
  }
  function replaceNaN(value, replacement) {
    return typeof value === "number" && isNaN(value) ? replacement : value;
  }
  function countTruthy(values) {
    return values.reduce(function(sum, value) {
      return sum + (value ? 1 : 0);
    }, 0);
  }
  function round(value, base) {
    if (base === void 0) {
      base = 1;
    }
    if (Math.abs(base) >= 1) {
      return Math.round(value / base) * base;
    } else {
      var counterBase = 1 / base;
      return Math.round(value * counterBase) / counterBase;
    }
  }
  function parseSimpleCssSelector(selector) {
    var _a, _b;
    var errorMessage = "Unexpected syntax '".concat(selector, "'");
    var tagMatch = /^\s*([a-z-]*)(.*)$/i.exec(selector);
    var tag = tagMatch[1] || void 0;
    var attributes = {};
    var partsRegex = /([.:#][\w-]+|\[.+?\])/gi;
    var addAttribute = function(name, value) {
      attributes[name] = attributes[name] || [];
      attributes[name].push(value);
    };
    for (; ; ) {
      var match = partsRegex.exec(tagMatch[2]);
      if (!match) {
        break;
      }
      var part = match[0];
      switch (part[0]) {
        case ".":
          addAttribute("class", part.slice(1));
          break;
        case "#":
          addAttribute("id", part.slice(1));
          break;
        case "[": {
          var attributeMatch = /^\[([\w-]+)([~|^$*]?=("(.*?)"|([\w-]+)))?(\s+[is])?\]$/.exec(part);
          if (attributeMatch) {
            addAttribute(attributeMatch[1], (_b = (_a = attributeMatch[4]) !== null && _a !== void 0 ? _a : attributeMatch[5]) !== null && _b !== void 0 ? _b : "");
          } else {
            throw new Error(errorMessage);
          }
          break;
        }
        default:
          throw new Error(errorMessage);
      }
    }
    return [tag, attributes];
  }
  function getUTF8Bytes(input) {
    var result = new Uint8Array(input.length);
    for (var i = 0; i < input.length; i++) {
      var charCode = input.charCodeAt(i);
      if (charCode > 127) {
        return new TextEncoder().encode(input);
      }
      result[i] = charCode;
    }
    return result;
  }
  function x64Add(m9, n) {
    var m0 = m9[0] >>> 16, m1 = m9[0] & 65535, m22 = m9[1] >>> 16, m32 = m9[1] & 65535;
    var n0 = n[0] >>> 16, n1 = n[0] & 65535, n2 = n[1] >>> 16, n3 = n[1] & 65535;
    var o0 = 0, o1 = 0, o2 = 0, o3 = 0;
    o3 += m32 + n3;
    o2 += o3 >>> 16;
    o3 &= 65535;
    o2 += m22 + n2;
    o1 += o2 >>> 16;
    o2 &= 65535;
    o1 += m1 + n1;
    o0 += o1 >>> 16;
    o1 &= 65535;
    o0 += m0 + n0;
    o0 &= 65535;
    m9[0] = o0 << 16 | o1;
    m9[1] = o2 << 16 | o3;
  }
  function x64Multiply(m9, n) {
    var m0 = m9[0] >>> 16, m1 = m9[0] & 65535, m22 = m9[1] >>> 16, m32 = m9[1] & 65535;
    var n0 = n[0] >>> 16, n1 = n[0] & 65535, n2 = n[1] >>> 16, n3 = n[1] & 65535;
    var o0 = 0, o1 = 0, o2 = 0, o3 = 0;
    o3 += m32 * n3;
    o2 += o3 >>> 16;
    o3 &= 65535;
    o2 += m22 * n3;
    o1 += o2 >>> 16;
    o2 &= 65535;
    o2 += m32 * n2;
    o1 += o2 >>> 16;
    o2 &= 65535;
    o1 += m1 * n3;
    o0 += o1 >>> 16;
    o1 &= 65535;
    o1 += m22 * n2;
    o0 += o1 >>> 16;
    o1 &= 65535;
    o1 += m32 * n1;
    o0 += o1 >>> 16;
    o1 &= 65535;
    o0 += m0 * n3 + m1 * n2 + m22 * n1 + m32 * n0;
    o0 &= 65535;
    m9[0] = o0 << 16 | o1;
    m9[1] = o2 << 16 | o3;
  }
  function x64Rotl(m9, bits) {
    var m0 = m9[0];
    bits %= 64;
    if (bits === 32) {
      m9[0] = m9[1];
      m9[1] = m0;
    } else if (bits < 32) {
      m9[0] = m0 << bits | m9[1] >>> 32 - bits;
      m9[1] = m9[1] << bits | m0 >>> 32 - bits;
    } else {
      bits -= 32;
      m9[0] = m9[1] << bits | m0 >>> 32 - bits;
      m9[1] = m0 << bits | m9[1] >>> 32 - bits;
    }
  }
  function x64LeftShift(m9, bits) {
    bits %= 64;
    if (bits === 0) {
      return;
    } else if (bits < 32) {
      m9[0] = m9[1] >>> 32 - bits;
      m9[1] = m9[1] << bits;
    } else {
      m9[0] = m9[1] << bits - 32;
      m9[1] = 0;
    }
  }
  function x64Xor(m9, n) {
    m9[0] ^= n[0];
    m9[1] ^= n[1];
  }
  var F1 = [4283543511, 3981806797];
  var F2 = [3301882366, 444984403];
  function x64Fmix(h) {
    var shifted = [0, h[0] >>> 1];
    x64Xor(h, shifted);
    x64Multiply(h, F1);
    shifted[1] = h[0] >>> 1;
    x64Xor(h, shifted);
    x64Multiply(h, F2);
    shifted[1] = h[0] >>> 1;
    x64Xor(h, shifted);
  }
  var C1 = [2277735313, 289559509];
  var C2 = [1291169091, 658871167];
  var M$1 = [0, 5];
  var N1 = [0, 1390208809];
  var N2 = [0, 944331445];
  function x64hash128(input, seed) {
    var key = getUTF8Bytes(input);
    seed = seed || 0;
    var length = [0, key.length];
    var remainder = length[1] % 16;
    var bytes = length[1] - remainder;
    var h1 = [0, seed];
    var h2 = [0, seed];
    var k1 = [0, 0];
    var k2 = [0, 0];
    var i;
    for (i = 0; i < bytes; i = i + 16) {
      k1[0] = key[i + 4] | key[i + 5] << 8 | key[i + 6] << 16 | key[i + 7] << 24;
      k1[1] = key[i] | key[i + 1] << 8 | key[i + 2] << 16 | key[i + 3] << 24;
      k2[0] = key[i + 12] | key[i + 13] << 8 | key[i + 14] << 16 | key[i + 15] << 24;
      k2[1] = key[i + 8] | key[i + 9] << 8 | key[i + 10] << 16 | key[i + 11] << 24;
      x64Multiply(k1, C1);
      x64Rotl(k1, 31);
      x64Multiply(k1, C2);
      x64Xor(h1, k1);
      x64Rotl(h1, 27);
      x64Add(h1, h2);
      x64Multiply(h1, M$1);
      x64Add(h1, N1);
      x64Multiply(k2, C2);
      x64Rotl(k2, 33);
      x64Multiply(k2, C1);
      x64Xor(h2, k2);
      x64Rotl(h2, 31);
      x64Add(h2, h1);
      x64Multiply(h2, M$1);
      x64Add(h2, N2);
    }
    k1[0] = 0;
    k1[1] = 0;
    k2[0] = 0;
    k2[1] = 0;
    var val = [0, 0];
    switch (remainder) {
      case 15:
        val[1] = key[i + 14];
        x64LeftShift(val, 48);
        x64Xor(k2, val);
      // fallthrough
      case 14:
        val[1] = key[i + 13];
        x64LeftShift(val, 40);
        x64Xor(k2, val);
      // fallthrough
      case 13:
        val[1] = key[i + 12];
        x64LeftShift(val, 32);
        x64Xor(k2, val);
      // fallthrough
      case 12:
        val[1] = key[i + 11];
        x64LeftShift(val, 24);
        x64Xor(k2, val);
      // fallthrough
      case 11:
        val[1] = key[i + 10];
        x64LeftShift(val, 16);
        x64Xor(k2, val);
      // fallthrough
      case 10:
        val[1] = key[i + 9];
        x64LeftShift(val, 8);
        x64Xor(k2, val);
      // fallthrough
      case 9:
        val[1] = key[i + 8];
        x64Xor(k2, val);
        x64Multiply(k2, C2);
        x64Rotl(k2, 33);
        x64Multiply(k2, C1);
        x64Xor(h2, k2);
      // fallthrough
      case 8:
        val[1] = key[i + 7];
        x64LeftShift(val, 56);
        x64Xor(k1, val);
      // fallthrough
      case 7:
        val[1] = key[i + 6];
        x64LeftShift(val, 48);
        x64Xor(k1, val);
      // fallthrough
      case 6:
        val[1] = key[i + 5];
        x64LeftShift(val, 40);
        x64Xor(k1, val);
      // fallthrough
      case 5:
        val[1] = key[i + 4];
        x64LeftShift(val, 32);
        x64Xor(k1, val);
      // fallthrough
      case 4:
        val[1] = key[i + 3];
        x64LeftShift(val, 24);
        x64Xor(k1, val);
      // fallthrough
      case 3:
        val[1] = key[i + 2];
        x64LeftShift(val, 16);
        x64Xor(k1, val);
      // fallthrough
      case 2:
        val[1] = key[i + 1];
        x64LeftShift(val, 8);
        x64Xor(k1, val);
      // fallthrough
      case 1:
        val[1] = key[i];
        x64Xor(k1, val);
        x64Multiply(k1, C1);
        x64Rotl(k1, 31);
        x64Multiply(k1, C2);
        x64Xor(h1, k1);
    }
    x64Xor(h1, length);
    x64Xor(h2, length);
    x64Add(h1, h2);
    x64Add(h2, h1);
    x64Fmix(h1);
    x64Fmix(h2);
    x64Add(h1, h2);
    x64Add(h2, h1);
    return ("00000000" + (h1[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h1[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[1] >>> 0).toString(16)).slice(-8);
  }
  function errorToObject(error) {
    var _a;
    return __assign({ name: error.name, message: error.message, stack: (_a = error.stack) === null || _a === void 0 ? void 0 : _a.split("\n") }, error);
  }
  function isFunctionNative(func) {
    return /^function\s.*?\{\s*\[native code]\s*}$/.test(String(func));
  }
  function isFinalResultLoaded(loadResult) {
    return typeof loadResult !== "function";
  }
  function loadSource(source, sourceOptions) {
    var sourceLoadPromise = suppressUnhandledRejectionWarning(new Promise(function(resolveLoad) {
      var loadStartTime = Date.now();
      awaitIfAsync(source.bind(null, sourceOptions), function() {
        var loadArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          loadArgs[_i] = arguments[_i];
        }
        var loadDuration = Date.now() - loadStartTime;
        if (!loadArgs[0]) {
          return resolveLoad(function() {
            return { error: loadArgs[1], duration: loadDuration };
          });
        }
        var loadResult = loadArgs[1];
        if (isFinalResultLoaded(loadResult)) {
          return resolveLoad(function() {
            return { value: loadResult, duration: loadDuration };
          });
        }
        resolveLoad(function() {
          return new Promise(function(resolveGet) {
            var getStartTime = Date.now();
            awaitIfAsync(loadResult, function() {
              var getArgs = [];
              for (var _i2 = 0; _i2 < arguments.length; _i2++) {
                getArgs[_i2] = arguments[_i2];
              }
              var duration = loadDuration + Date.now() - getStartTime;
              if (!getArgs[0]) {
                return resolveGet({ error: getArgs[1], duration });
              }
              resolveGet({ value: getArgs[1], duration });
            });
          });
        });
      });
    }));
    return function getComponent() {
      return sourceLoadPromise.then(function(finalizeSource) {
        return finalizeSource();
      });
    };
  }
  function loadSources(sources2, sourceOptions, excludeSources, loopReleaseInterval) {
    var includedSources = Object.keys(sources2).filter(function(sourceKey) {
      return excludes(excludeSources, sourceKey);
    });
    var sourceGettersPromise = suppressUnhandledRejectionWarning(mapWithBreaks(includedSources, function(sourceKey) {
      return loadSource(sources2[sourceKey], sourceOptions);
    }, loopReleaseInterval));
    return function getComponents() {
      return __awaiter(this, void 0, void 0, function() {
        var sourceGetters, componentPromises, componentArray, components, index2;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, sourceGettersPromise];
            case 1:
              sourceGetters = _a.sent();
              return [4, mapWithBreaks(sourceGetters, function(sourceGetter) {
                return suppressUnhandledRejectionWarning(sourceGetter());
              }, loopReleaseInterval)];
            case 2:
              componentPromises = _a.sent();
              return [
                4,
                Promise.all(componentPromises)
                // Keeping the component keys order the same as the source keys order
              ];
            case 3:
              componentArray = _a.sent();
              components = {};
              for (index2 = 0; index2 < includedSources.length; ++index2) {
                components[includedSources[index2]] = componentArray[index2];
              }
              return [2, components];
          }
        });
      });
    };
  }
  function isTrident() {
    var w = window;
    var n = navigator;
    return countTruthy([
      "MSCSSMatrix" in w,
      "msSetImmediate" in w,
      "msIndexedDB" in w,
      "msMaxTouchPoints" in n,
      "msPointerEnabled" in n
    ]) >= 4;
  }
  function isEdgeHTML() {
    var w = window;
    var n = navigator;
    return countTruthy(["msWriteProfilerMark" in w, "MSStream" in w, "msLaunchUri" in n, "msSaveBlob" in n]) >= 3 && !isTrident();
  }
  function isChromium() {
    var w = window;
    var n = navigator;
    return countTruthy([
      "webkitPersistentStorage" in n,
      "webkitTemporaryStorage" in n,
      (n.vendor || "").indexOf("Google") === 0,
      "webkitResolveLocalFileSystemURL" in w,
      "BatteryManager" in w,
      "webkitMediaStream" in w,
      "webkitSpeechGrammar" in w
    ]) >= 5;
  }
  function isWebKit() {
    var w = window;
    var n = navigator;
    return countTruthy([
      "ApplePayError" in w,
      "CSSPrimitiveValue" in w,
      "Counter" in w,
      n.vendor.indexOf("Apple") === 0,
      "RGBColor" in w,
      "WebKitMediaKeys" in w
    ]) >= 4;
  }
  function isDesktopWebKit() {
    var w = window;
    var HTMLElement = w.HTMLElement, Document = w.Document;
    return countTruthy([
      "safari" in w,
      !("ongestureend" in w),
      !("TouchEvent" in w),
      !("orientation" in w),
      HTMLElement && !("autocapitalize" in HTMLElement.prototype),
      Document && "pointerLockElement" in Document.prototype
    ]) >= 4;
  }
  function isSafariWebKit() {
    var w = window;
    return (
      // Filters-out Chrome, Yandex, DuckDuckGo (macOS and iOS), Edge
      isFunctionNative(w.print) && // Doesn't work in Safari < 15.4
      String(w.browser) === "[object WebPageNamespace]"
    );
  }
  function isGecko() {
    var _a, _b;
    var w = window;
    return countTruthy([
      "buildID" in navigator,
      "MozAppearance" in ((_b = (_a = document.documentElement) === null || _a === void 0 ? void 0 : _a.style) !== null && _b !== void 0 ? _b : {}),
      "onmozfullscreenchange" in w,
      "mozInnerScreenX" in w,
      "CSSMozDocumentRule" in w,
      "CanvasCaptureMediaStream" in w
    ]) >= 4;
  }
  function isChromium86OrNewer() {
    var w = window;
    return countTruthy([
      !("MediaSettingsRange" in w),
      "RTCEncodedAudioFrame" in w,
      "" + w.Intl === "[object Intl]",
      "" + w.Reflect === "[object Reflect]"
    ]) >= 3;
  }
  function isChromium122OrNewer() {
    var w = window;
    var URLPattern = w.URLPattern;
    return countTruthy([
      "union" in Set.prototype,
      "Iterator" in w,
      URLPattern && "hasRegExpGroups" in URLPattern.prototype,
      "RGB8" in WebGLRenderingContext.prototype
    ]) >= 3;
  }
  function isWebKit606OrNewer() {
    var w = window;
    return countTruthy([
      "DOMRectList" in w,
      "RTCPeerConnectionIceEvent" in w,
      "SVGGeometryElement" in w,
      "ontransitioncancel" in w
    ]) >= 3;
  }
  function isWebKit616OrNewer() {
    var w = window;
    var n = navigator;
    var CSS = w.CSS, HTMLButtonElement = w.HTMLButtonElement;
    return countTruthy([
      !("getStorageUpdates" in n),
      HTMLButtonElement && "popover" in HTMLButtonElement.prototype,
      "CSSCounterStyleRule" in w,
      CSS.supports("font-size-adjust: ex-height 0.5"),
      CSS.supports("text-transform: full-width")
    ]) >= 4;
  }
  function isIPad() {
    if (navigator.platform === "iPad") {
      return true;
    }
    var s = screen;
    var screenRatio = s.width / s.height;
    return countTruthy([
      // Since iOS 13. Doesn't work in Chrome on iPadOS <15, but works in desktop mode.
      "MediaSource" in window,
      // Since iOS 12. Doesn't work in Chrome on iPadOS.
      !!Element.prototype.webkitRequestFullscreen,
      // iPhone 4S that runs iOS 9 matches this, but it is not supported
      // Doesn't work in incognito mode of Safari ≥17 with split screen because of tracking prevention
      screenRatio > 0.65 && screenRatio < 1.53
    ]) >= 2;
  }
  function getFullscreenElement() {
    var d = document;
    return d.fullscreenElement || d.msFullscreenElement || d.mozFullScreenElement || d.webkitFullscreenElement || null;
  }
  function exitFullscreen() {
    var d = document;
    return (d.exitFullscreen || d.msExitFullscreen || d.mozCancelFullScreen || d.webkitExitFullscreen).call(d);
  }
  function isAndroid() {
    var isItChromium = isChromium();
    var isItGecko = isGecko();
    var w = window;
    var n = navigator;
    var c = "connection";
    if (isItChromium) {
      return countTruthy([
        !("SharedWorker" in w),
        // `typechange` is deprecated, but it's still present on Android (tested on Chrome Mobile 117)
        // Removal proposal https://bugs.chromium.org/p/chromium/issues/detail?id=699892
        // Note: this expression returns true on ChromeOS, so additional detectors are required to avoid false-positives
        n[c] && "ontypechange" in n[c],
        !("sinkId" in new Audio())
      ]) >= 2;
    } else if (isItGecko) {
      return countTruthy(["onorientationchange" in w, "orientation" in w, /android/i.test(n.appVersion)]) >= 2;
    } else {
      return false;
    }
  }
  function isSamsungInternet() {
    var n = navigator;
    var w = window;
    var audioPrototype = Audio.prototype;
    var visualViewport = w.visualViewport;
    return countTruthy([
      "srLatency" in audioPrototype,
      "srChannelCount" in audioPrototype,
      "devicePosture" in n,
      visualViewport && "segments" in visualViewport,
      "getTextInformation" in Image.prototype
      // Not available in Samsung Internet 21
    ]) >= 3;
  }
  function getAudioFingerprint() {
    if (doesBrowserPerformAntifingerprinting$1()) {
      return -4;
    }
    return getUnstableAudioFingerprint();
  }
  function getUnstableAudioFingerprint() {
    var w = window;
    var AudioContext2 = w.OfflineAudioContext || w.webkitOfflineAudioContext;
    if (!AudioContext2) {
      return -2;
    }
    if (doesBrowserSuspendAudioContext()) {
      return -1;
    }
    var hashFromIndex = 4500;
    var hashToIndex = 5e3;
    var context = new AudioContext2(1, hashToIndex, 44100);
    var oscillator = context.createOscillator();
    oscillator.type = "triangle";
    oscillator.frequency.value = 1e4;
    var compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -50;
    compressor.knee.value = 40;
    compressor.ratio.value = 12;
    compressor.attack.value = 0;
    compressor.release.value = 0.25;
    oscillator.connect(compressor);
    compressor.connect(context.destination);
    oscillator.start(0);
    var _a = startRenderingAudio(context), renderPromise = _a[0], finishRendering = _a[1];
    var fingerprintPromise = suppressUnhandledRejectionWarning(renderPromise.then(function(buffer) {
      return getHash(buffer.getChannelData(0).subarray(hashFromIndex));
    }, function(error) {
      if (error.name === "timeout" || error.name === "suspended") {
        return -3;
      }
      throw error;
    }));
    return function() {
      finishRendering();
      return fingerprintPromise;
    };
  }
  function doesBrowserSuspendAudioContext() {
    return isWebKit() && !isDesktopWebKit() && !isWebKit606OrNewer();
  }
  function doesBrowserPerformAntifingerprinting$1() {
    return (
      // Safari ≥17
      isWebKit() && isWebKit616OrNewer() && isSafariWebKit() || // Samsung Internet ≥26
      isChromium() && isSamsungInternet() && isChromium122OrNewer()
    );
  }
  function startRenderingAudio(context) {
    var renderTryMaxCount = 3;
    var renderRetryDelay = 500;
    var runningMaxAwaitTime = 500;
    var runningSufficientTime = 5e3;
    var finalize = function() {
      return void 0;
    };
    var resultPromise = new Promise(function(resolve, reject) {
      var isFinalized = false;
      var renderTryCount = 0;
      var startedRunningAt = 0;
      context.oncomplete = function(event) {
        return resolve(event.renderedBuffer);
      };
      var startRunningTimeout = function() {
        setTimeout(function() {
          return reject(makeInnerError(
            "timeout"
            /* InnerErrorName.Timeout */
          ));
        }, Math.min(runningMaxAwaitTime, startedRunningAt + runningSufficientTime - Date.now()));
      };
      var tryRender = function() {
        try {
          var renderingPromise = context.startRendering();
          if (isPromise(renderingPromise)) {
            suppressUnhandledRejectionWarning(renderingPromise);
          }
          switch (context.state) {
            case "running":
              startedRunningAt = Date.now();
              if (isFinalized) {
                startRunningTimeout();
              }
              break;
            // Sometimes the audio context doesn't start after calling `startRendering` (in addition to the cases where
            // audio context doesn't start at all). A known case is starting an audio context when the browser tab is in
            // background on iPhone. Retries usually help in this case.
            case "suspended":
              if (!document.hidden) {
                renderTryCount++;
              }
              if (isFinalized && renderTryCount >= renderTryMaxCount) {
                reject(makeInnerError(
                  "suspended"
                  /* InnerErrorName.Suspended */
                ));
              } else {
                setTimeout(tryRender, renderRetryDelay);
              }
              break;
          }
        } catch (error) {
          reject(error);
        }
      };
      tryRender();
      finalize = function() {
        if (!isFinalized) {
          isFinalized = true;
          if (startedRunningAt > 0) {
            startRunningTimeout();
          }
        }
      };
    });
    return [resultPromise, finalize];
  }
  function getHash(signal) {
    var hash = 0;
    for (var i = 0; i < signal.length; ++i) {
      hash += Math.abs(signal[i]);
    }
    return hash;
  }
  function makeInnerError(name) {
    var error = new Error(name);
    error.name = name;
    return error;
  }
  function withIframe(action, initialHtml, domPollInterval) {
    var _a, _b, _c;
    if (domPollInterval === void 0) {
      domPollInterval = 50;
    }
    return __awaiter(this, void 0, void 0, function() {
      var d, iframe;
      return __generator(this, function(_d) {
        switch (_d.label) {
          case 0:
            d = document;
            _d.label = 1;
          case 1:
            if (!!d.body) return [3, 3];
            return [4, wait(domPollInterval)];
          case 2:
            _d.sent();
            return [3, 1];
          case 3:
            iframe = d.createElement("iframe");
            _d.label = 4;
          case 4:
            _d.trys.push([4, , 10, 11]);
            return [4, new Promise(function(_resolve, _reject) {
              var isComplete = false;
              var resolve = function() {
                isComplete = true;
                _resolve();
              };
              var reject = function(error) {
                isComplete = true;
                _reject(error);
              };
              iframe.onload = resolve;
              iframe.onerror = reject;
              var style = iframe.style;
              style.setProperty("display", "block", "important");
              style.position = "absolute";
              style.top = "0";
              style.left = "0";
              style.visibility = "hidden";
              if (initialHtml && "srcdoc" in iframe) {
                iframe.srcdoc = initialHtml;
              } else {
                iframe.src = "about:blank";
              }
              d.body.appendChild(iframe);
              var checkReadyState = function() {
                var _a2, _b2;
                if (isComplete) {
                  return;
                }
                if (((_b2 = (_a2 = iframe.contentWindow) === null || _a2 === void 0 ? void 0 : _a2.document) === null || _b2 === void 0 ? void 0 : _b2.readyState) === "complete") {
                  resolve();
                } else {
                  setTimeout(checkReadyState, 10);
                }
              };
              checkReadyState();
            })];
          case 5:
            _d.sent();
            _d.label = 6;
          case 6:
            if (!!((_b = (_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document) === null || _b === void 0 ? void 0 : _b.body)) return [3, 8];
            return [4, wait(domPollInterval)];
          case 7:
            _d.sent();
            return [3, 6];
          case 8:
            return [4, action(iframe, iframe.contentWindow)];
          case 9:
            return [2, _d.sent()];
          case 10:
            (_c = iframe.parentNode) === null || _c === void 0 ? void 0 : _c.removeChild(iframe);
            return [
              7
              /*endfinally*/
            ];
          case 11:
            return [
              2
              /*return*/
            ];
        }
      });
    });
  }
  function selectorToElement(selector) {
    var _a = parseSimpleCssSelector(selector), tag = _a[0], attributes = _a[1];
    var element = document.createElement(tag !== null && tag !== void 0 ? tag : "div");
    for (var _i = 0, _b = Object.keys(attributes); _i < _b.length; _i++) {
      var name_1 = _b[_i];
      var value = attributes[name_1].join(" ");
      if (name_1 === "style") {
        addStyleString(element.style, value);
      } else {
        element.setAttribute(name_1, value);
      }
    }
    return element;
  }
  function addStyleString(style, source) {
    for (var _i = 0, _a = source.split(";"); _i < _a.length; _i++) {
      var property = _a[_i];
      var match = /^\s*([\w-]+)\s*:\s*(.+?)(\s*!([\w-]+))?\s*$/.exec(property);
      if (match) {
        var name_2 = match[1], value = match[2], priority = match[4];
        style.setProperty(name_2, value, priority || "");
      }
    }
  }
  function isAnyParentCrossOrigin() {
    var currentWindow = window;
    for (; ; ) {
      var parentWindow = currentWindow.parent;
      if (!parentWindow || parentWindow === currentWindow) {
        return false;
      }
      try {
        if (parentWindow.location.origin !== currentWindow.location.origin) {
          return true;
        }
      } catch (error) {
        if (error instanceof Error && error.name === "SecurityError") {
          return true;
        }
        throw error;
      }
      currentWindow = parentWindow;
    }
  }
  var testString = "mmMwWLliI0O&1";
  var textSize = "48px";
  var baseFonts = ["monospace", "sans-serif", "serif"];
  var fontList = [
    // This is android-specific font from "Roboto" family
    "sans-serif-thin",
    "ARNO PRO",
    "Agency FB",
    "Arabic Typesetting",
    "Arial Unicode MS",
    "AvantGarde Bk BT",
    "BankGothic Md BT",
    "Batang",
    "Bitstream Vera Sans Mono",
    "Calibri",
    "Century",
    "Century Gothic",
    "Clarendon",
    "EUROSTILE",
    "Franklin Gothic",
    "Futura Bk BT",
    "Futura Md BT",
    "GOTHAM",
    "Gill Sans",
    "HELV",
    "Haettenschweiler",
    "Helvetica Neue",
    "Humanst521 BT",
    "Leelawadee",
    "Letter Gothic",
    "Levenim MT",
    "Lucida Bright",
    "Lucida Sans",
    "Menlo",
    "MS Mincho",
    "MS Outlook",
    "MS Reference Specialty",
    "MS UI Gothic",
    "MT Extra",
    "MYRIAD PRO",
    "Marlett",
    "Meiryo UI",
    "Microsoft Uighur",
    "Minion Pro",
    "Monotype Corsiva",
    "PMingLiU",
    "Pristina",
    "SCRIPTINA",
    "Segoe UI Light",
    "Serifa",
    "SimHei",
    "Small Fonts",
    "Staccato222 BT",
    "TRAJAN PRO",
    "Univers CE 55 Medium",
    "Vrinda",
    "ZWAdobeF"
  ];
  function getFonts() {
    var _this = this;
    return withIframe(function(_, _a) {
      var document2 = _a.document;
      return __awaiter(_this, void 0, void 0, function() {
        var holder, spansContainer, defaultWidth, defaultHeight, createSpan, createSpanWithFonts, initializeBaseFontsSpans, initializeFontsSpans, isFontAvailable, baseFontsSpans, fontsSpans, index2;
        return __generator(this, function(_b) {
          holder = document2.body;
          holder.style.fontSize = textSize;
          spansContainer = document2.createElement("div");
          spansContainer.style.setProperty("visibility", "hidden", "important");
          defaultWidth = {};
          defaultHeight = {};
          createSpan = function(fontFamily) {
            var span = document2.createElement("span");
            var style = span.style;
            style.position = "absolute";
            style.top = "0";
            style.left = "0";
            style.fontFamily = fontFamily;
            span.textContent = testString;
            spansContainer.appendChild(span);
            return span;
          };
          createSpanWithFonts = function(fontToDetect, baseFont) {
            return createSpan("'".concat(fontToDetect, "',").concat(baseFont));
          };
          initializeBaseFontsSpans = function() {
            return baseFonts.map(createSpan);
          };
          initializeFontsSpans = function() {
            var spans = {};
            var _loop_1 = function(font2) {
              spans[font2] = baseFonts.map(function(baseFont) {
                return createSpanWithFonts(font2, baseFont);
              });
            };
            for (var _i = 0, fontList_1 = fontList; _i < fontList_1.length; _i++) {
              var font = fontList_1[_i];
              _loop_1(font);
            }
            return spans;
          };
          isFontAvailable = function(fontSpans) {
            return baseFonts.some(function(baseFont, baseFontIndex) {
              return fontSpans[baseFontIndex].offsetWidth !== defaultWidth[baseFont] || fontSpans[baseFontIndex].offsetHeight !== defaultHeight[baseFont];
            });
          };
          baseFontsSpans = initializeBaseFontsSpans();
          fontsSpans = initializeFontsSpans();
          holder.appendChild(spansContainer);
          for (index2 = 0; index2 < baseFonts.length; index2++) {
            defaultWidth[baseFonts[index2]] = baseFontsSpans[index2].offsetWidth;
            defaultHeight[baseFonts[index2]] = baseFontsSpans[index2].offsetHeight;
          }
          return [2, fontList.filter(function(font) {
            return isFontAvailable(fontsSpans[font]);
          })];
        });
      });
    });
  }
  function getPlugins() {
    var rawPlugins = navigator.plugins;
    if (!rawPlugins) {
      return void 0;
    }
    var plugins = [];
    for (var i = 0; i < rawPlugins.length; ++i) {
      var plugin = rawPlugins[i];
      if (!plugin) {
        continue;
      }
      var mimeTypes = [];
      for (var j = 0; j < plugin.length; ++j) {
        var mimeType = plugin[j];
        mimeTypes.push({
          type: mimeType.type,
          suffixes: mimeType.suffixes
        });
      }
      plugins.push({
        name: plugin.name,
        description: plugin.description,
        mimeTypes
      });
    }
    return plugins;
  }
  function getCanvasFingerprint() {
    return getUnstableCanvasFingerprint(doesBrowserPerformAntifingerprinting());
  }
  function getUnstableCanvasFingerprint(skipImages) {
    var _a;
    var winding = false;
    var geometry;
    var text;
    var _b = makeCanvasContext(), canvas = _b[0], context = _b[1];
    if (!isSupported(canvas, context)) {
      geometry = text = "unsupported";
    } else {
      winding = doesSupportWinding(context);
      if (skipImages) {
        geometry = text = "skipped";
      } else {
        _a = renderImages(canvas, context), geometry = _a[0], text = _a[1];
      }
    }
    return { winding, geometry, text };
  }
  function makeCanvasContext() {
    var canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    return [canvas, canvas.getContext("2d")];
  }
  function isSupported(canvas, context) {
    return !!(context && canvas.toDataURL);
  }
  function doesSupportWinding(context) {
    context.rect(0, 0, 10, 10);
    context.rect(2, 2, 6, 6);
    return !context.isPointInPath(5, 5, "evenodd");
  }
  function renderImages(canvas, context) {
    renderTextImage(canvas, context);
    var textImage1 = canvasToString(canvas);
    var textImage2 = canvasToString(canvas);
    if (textImage1 !== textImage2) {
      return [
        "unstable",
        "unstable"
        /* ImageStatus.Unstable */
      ];
    }
    renderGeometryImage(canvas, context);
    var geometryImage = canvasToString(canvas);
    return [geometryImage, textImage1];
  }
  function renderTextImage(canvas, context) {
    canvas.width = 240;
    canvas.height = 60;
    context.textBaseline = "alphabetic";
    context.fillStyle = "#f60";
    context.fillRect(100, 1, 62, 20);
    context.fillStyle = "#069";
    context.font = '11pt "Times New Roman"';
    var printedText = "Cwm fjordbank gly ".concat(
      String.fromCharCode(55357, 56835)
      /* 😃 */
    );
    context.fillText(printedText, 2, 15);
    context.fillStyle = "rgba(102, 204, 0, 0.2)";
    context.font = "18pt Arial";
    context.fillText(printedText, 4, 45);
  }
  function renderGeometryImage(canvas, context) {
    canvas.width = 122;
    canvas.height = 110;
    context.globalCompositeOperation = "multiply";
    for (var _i = 0, _a = [
      ["#f2f", 40, 40],
      ["#2ff", 80, 40],
      ["#ff2", 60, 80]
    ]; _i < _a.length; _i++) {
      var _b = _a[_i], color = _b[0], x = _b[1], y = _b[2];
      context.fillStyle = color;
      context.beginPath();
      context.arc(x, y, 40, 0, Math.PI * 2, true);
      context.closePath();
      context.fill();
    }
    context.fillStyle = "#f9c";
    context.arc(60, 60, 60, 0, Math.PI * 2, true);
    context.arc(60, 60, 20, 0, Math.PI * 2, true);
    context.fill("evenodd");
  }
  function canvasToString(canvas) {
    return canvas.toDataURL();
  }
  function doesBrowserPerformAntifingerprinting() {
    return isWebKit() && isWebKit616OrNewer() && isSafariWebKit();
  }
  function getTouchSupport() {
    var n = navigator;
    var maxTouchPoints = 0;
    var touchEvent;
    if (n.maxTouchPoints !== void 0) {
      maxTouchPoints = toInt(n.maxTouchPoints);
    } else if (n.msMaxTouchPoints !== void 0) {
      maxTouchPoints = n.msMaxTouchPoints;
    }
    try {
      document.createEvent("TouchEvent");
      touchEvent = true;
    } catch (_a) {
      touchEvent = false;
    }
    var touchStart = "ontouchstart" in window;
    return {
      maxTouchPoints,
      touchEvent,
      touchStart
    };
  }
  function getOsCpu() {
    return navigator.oscpu;
  }
  function getLanguages() {
    var n = navigator;
    var result = [];
    var language = n.language || n.userLanguage || n.browserLanguage || n.systemLanguage;
    if (language !== void 0) {
      result.push([language]);
    }
    if (Array.isArray(n.languages)) {
      if (!(isChromium() && isChromium86OrNewer())) {
        result.push(n.languages);
      }
    } else if (typeof n.languages === "string") {
      var languages = n.languages;
      if (languages) {
        result.push(languages.split(","));
      }
    }
    return result;
  }
  function getColorDepth() {
    return window.screen.colorDepth;
  }
  function getDeviceMemory() {
    return replaceNaN(toFloat(navigator.deviceMemory), void 0);
  }
  function getScreenResolution() {
    if (isWebKit() && isWebKit616OrNewer() && isSafariWebKit()) {
      return void 0;
    }
    return getUnstableScreenResolution();
  }
  function getUnstableScreenResolution() {
    var s = screen;
    var parseDimension = function(value) {
      return replaceNaN(toInt(value), null);
    };
    var dimensions = [parseDimension(s.width), parseDimension(s.height)];
    dimensions.sort().reverse();
    return dimensions;
  }
  var screenFrameCheckInterval = 2500;
  var roundingPrecision = 10;
  var screenFrameBackup;
  var screenFrameSizeTimeoutId;
  function watchScreenFrame() {
    if (screenFrameSizeTimeoutId !== void 0) {
      return;
    }
    var checkScreenFrame = function() {
      var frameSize = getCurrentScreenFrame();
      if (isFrameSizeNull(frameSize)) {
        screenFrameSizeTimeoutId = setTimeout(checkScreenFrame, screenFrameCheckInterval);
      } else {
        screenFrameBackup = frameSize;
        screenFrameSizeTimeoutId = void 0;
      }
    };
    checkScreenFrame();
  }
  function getUnstableScreenFrame() {
    var _this = this;
    watchScreenFrame();
    return function() {
      return __awaiter(_this, void 0, void 0, function() {
        var frameSize;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              frameSize = getCurrentScreenFrame();
              if (!isFrameSizeNull(frameSize)) return [3, 2];
              if (screenFrameBackup) {
                return [2, __spreadArray([], screenFrameBackup, true)];
              }
              if (!getFullscreenElement()) return [3, 2];
              return [4, exitFullscreen()];
            case 1:
              _a.sent();
              frameSize = getCurrentScreenFrame();
              _a.label = 2;
            case 2:
              if (!isFrameSizeNull(frameSize)) {
                screenFrameBackup = frameSize;
              }
              return [2, frameSize];
          }
        });
      });
    };
  }
  function getScreenFrame() {
    var _this = this;
    if (isWebKit() && isWebKit616OrNewer() && isSafariWebKit()) {
      return function() {
        return Promise.resolve(void 0);
      };
    }
    var screenFrameGetter = getUnstableScreenFrame();
    return function() {
      return __awaiter(_this, void 0, void 0, function() {
        var frameSize, processSize;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, screenFrameGetter()];
            case 1:
              frameSize = _a.sent();
              processSize = function(sideSize) {
                return sideSize === null ? null : round(sideSize, roundingPrecision);
              };
              return [2, [processSize(frameSize[0]), processSize(frameSize[1]), processSize(frameSize[2]), processSize(frameSize[3])]];
          }
        });
      });
    };
  }
  function getCurrentScreenFrame() {
    var s = screen;
    return [
      replaceNaN(toFloat(s.availTop), null),
      replaceNaN(toFloat(s.width) - toFloat(s.availWidth) - replaceNaN(toFloat(s.availLeft), 0), null),
      replaceNaN(toFloat(s.height) - toFloat(s.availHeight) - replaceNaN(toFloat(s.availTop), 0), null),
      replaceNaN(toFloat(s.availLeft), null)
    ];
  }
  function isFrameSizeNull(frameSize) {
    for (var i = 0; i < 4; ++i) {
      if (frameSize[i]) {
        return false;
      }
    }
    return true;
  }
  function getHardwareConcurrency() {
    return replaceNaN(toInt(navigator.hardwareConcurrency), void 0);
  }
  function getTimezone() {
    var _a;
    var DateTimeFormat = (_a = window.Intl) === null || _a === void 0 ? void 0 : _a.DateTimeFormat;
    if (DateTimeFormat) {
      var timezone = new DateTimeFormat().resolvedOptions().timeZone;
      if (timezone) {
        return timezone;
      }
    }
    var offset = -getTimezoneOffset();
    return "UTC".concat(offset >= 0 ? "+" : "").concat(offset);
  }
  function getTimezoneOffset() {
    var currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    return Math.max(
      // `getTimezoneOffset` returns a number as a string in some unidentified cases
      toFloat(new Date(currentYear, 0, 1).getTimezoneOffset()),
      toFloat(new Date(currentYear, 6, 1).getTimezoneOffset())
    );
  }
  function getSessionStorage() {
    try {
      return !!window.sessionStorage;
    } catch (error) {
      return true;
    }
  }
  function getLocalStorage() {
    try {
      return !!window.localStorage;
    } catch (e) {
      return true;
    }
  }
  function getIndexedDB() {
    if (isTrident() || isEdgeHTML()) {
      return void 0;
    }
    try {
      return !!window.indexedDB;
    } catch (e) {
      return true;
    }
  }
  function getOpenDatabase() {
    return !!window.openDatabase;
  }
  function getCpuClass() {
    return navigator.cpuClass;
  }
  function getPlatform() {
    var platform = navigator.platform;
    if (platform === "MacIntel") {
      if (isWebKit() && !isDesktopWebKit()) {
        return isIPad() ? "iPad" : "iPhone";
      }
    }
    return platform;
  }
  function getVendor() {
    return navigator.vendor || "";
  }
  function getVendorFlavors() {
    var flavors = [];
    for (var _i = 0, _a = [
      // Blink and some browsers on iOS
      "chrome",
      // Safari on macOS
      "safari",
      // Chrome on iOS (checked in 85 on 13 and 87 on 14)
      "__crWeb",
      "__gCrWeb",
      // Yandex Browser on iOS, macOS and Android (checked in 21.2 on iOS 14, macOS and Android)
      "yandex",
      // Yandex Browser on iOS (checked in 21.2 on 14)
      "__yb",
      "__ybro",
      // Firefox on iOS (checked in 32 on 14)
      "__firefox__",
      // Edge on iOS (checked in 46 on 14)
      "__edgeTrackingPreventionStatistics",
      "webkit",
      // Opera Touch on iOS (checked in 2.6 on 14)
      "oprt",
      // Samsung Internet on Android (checked in 11.1)
      "samsungAr",
      // UC Browser on Android (checked in 12.10 and 13.0)
      "ucweb",
      "UCShellJava",
      // Puffin on Android (checked in 9.0)
      "puffinDevice"
      // UC on iOS and Opera on Android have no specific global variables
      // Edge for Android isn't checked
    ]; _i < _a.length; _i++) {
      var key = _a[_i];
      var value = window[key];
      if (value && typeof value === "object") {
        flavors.push(key);
      }
    }
    return flavors.sort();
  }
  function areCookiesEnabled() {
    var d = document;
    try {
      d.cookie = "cookietest=1; SameSite=Strict;";
      var result = d.cookie.indexOf("cookietest=") !== -1;
      d.cookie = "cookietest=1; SameSite=Strict; expires=Thu, 01-Jan-1970 00:00:01 GMT";
      return result;
    } catch (e) {
      return false;
    }
  }
  function getFilters() {
    var fromB64 = atob;
    return {
      abpIndo: [
        "#Iklan-Melayang",
        "#Kolom-Iklan-728",
        "#SidebarIklan-wrapper",
        '[title="ALIENBOLA" i]',
        fromB64("I0JveC1CYW5uZXItYWRz")
      ],
      abpvn: [".quangcao", "#mobileCatfish", fromB64("LmNsb3NlLWFkcw=="), '[id^="bn_bottom_fixed_"]', "#pmadv"],
      adBlockFinland: [
        ".mainostila",
        fromB64("LnNwb25zb3JpdA=="),
        ".ylamainos",
        fromB64("YVtocmVmKj0iL2NsaWNrdGhyZ2guYXNwPyJd"),
        fromB64("YVtocmVmXj0iaHR0cHM6Ly9hcHAucmVhZHBlYWsuY29tL2FkcyJd")
      ],
      adBlockPersian: [
        "#navbar_notice_50",
        ".kadr",
        'TABLE[width="140px"]',
        "#divAgahi",
        fromB64("YVtocmVmXj0iaHR0cDovL2cxLnYuZndtcm0ubmV0L2FkLyJd")
      ],
      adBlockWarningRemoval: [
        "#adblock-honeypot",
        ".adblocker-root",
        ".wp_adblock_detect",
        fromB64("LmhlYWRlci1ibG9ja2VkLWFk"),
        fromB64("I2FkX2Jsb2NrZXI=")
      ],
      adGuardAnnoyances: [
        ".hs-sosyal",
        "#cookieconsentdiv",
        'div[class^="app_gdpr"]',
        ".as-oil",
        '[data-cypress="soft-push-notification-modal"]'
      ],
      adGuardBase: [
        ".BetterJsPopOverlay",
        fromB64("I2FkXzMwMFgyNTA="),
        fromB64("I2Jhbm5lcmZsb2F0MjI="),
        fromB64("I2NhbXBhaWduLWJhbm5lcg=="),
        fromB64("I0FkLUNvbnRlbnQ=")
      ],
      adGuardChinese: [
        fromB64("LlppX2FkX2FfSA=="),
        fromB64("YVtocmVmKj0iLmh0aGJldDM0LmNvbSJd"),
        "#widget-quan",
        fromB64("YVtocmVmKj0iLzg0OTkyMDIwLnh5eiJd"),
        fromB64("YVtocmVmKj0iLjE5NTZobC5jb20vIl0=")
      ],
      adGuardFrench: [
        "#pavePub",
        fromB64("LmFkLWRlc2t0b3AtcmVjdGFuZ2xl"),
        ".mobile_adhesion",
        ".widgetadv",
        fromB64("LmFkc19iYW4=")
      ],
      adGuardGerman: ['aside[data-portal-id="leaderboard"]'],
      adGuardJapanese: [
        "#kauli_yad_1",
        fromB64("YVtocmVmXj0iaHR0cDovL2FkMi50cmFmZmljZ2F0ZS5uZXQvIl0="),
        fromB64("Ll9wb3BJbl9pbmZpbml0ZV9hZA=="),
        fromB64("LmFkZ29vZ2xl"),
        fromB64("Ll9faXNib29zdFJldHVybkFk")
      ],
      adGuardMobile: [
        fromB64("YW1wLWF1dG8tYWRz"),
        fromB64("LmFtcF9hZA=="),
        'amp-embed[type="24smi"]',
        "#mgid_iframe1",
        fromB64("I2FkX2ludmlld19hcmVh")
      ],
      adGuardRussian: [
        fromB64("YVtocmVmXj0iaHR0cHM6Ly9hZC5sZXRtZWFkcy5jb20vIl0="),
        fromB64("LnJlY2xhbWE="),
        'div[id^="smi2adblock"]',
        fromB64("ZGl2W2lkXj0iQWRGb3hfYmFubmVyXyJd"),
        "#psyduckpockeball"
      ],
      adGuardSocial: [
        fromB64("YVtocmVmXj0iLy93d3cuc3R1bWJsZXVwb24uY29tL3N1Ym1pdD91cmw9Il0="),
        fromB64("YVtocmVmXj0iLy90ZWxlZ3JhbS5tZS9zaGFyZS91cmw/Il0="),
        ".etsy-tweet",
        "#inlineShare",
        ".popup-social"
      ],
      adGuardSpanishPortuguese: ["#barraPublicidade", "#Publicidade", "#publiEspecial", "#queTooltip", ".cnt-publi"],
      adGuardTrackingProtection: [
        "#qoo-counter",
        fromB64("YVtocmVmXj0iaHR0cDovL2NsaWNrLmhvdGxvZy5ydS8iXQ=="),
        fromB64("YVtocmVmXj0iaHR0cDovL2hpdGNvdW50ZXIucnUvdG9wL3N0YXQucGhwIl0="),
        fromB64("YVtocmVmXj0iaHR0cDovL3RvcC5tYWlsLnJ1L2p1bXAiXQ=="),
        "#top100counter"
      ],
      adGuardTurkish: [
        "#backkapat",
        fromB64("I3Jla2xhbWk="),
        fromB64("YVtocmVmXj0iaHR0cDovL2Fkc2Vydi5vbnRlay5jb20udHIvIl0="),
        fromB64("YVtocmVmXj0iaHR0cDovL2l6bGVuemkuY29tL2NhbXBhaWduLyJd"),
        fromB64("YVtocmVmXj0iaHR0cDovL3d3dy5pbnN0YWxsYWRzLm5ldC8iXQ==")
      ],
      bulgarian: [fromB64("dGQjZnJlZW5ldF90YWJsZV9hZHM="), "#ea_intext_div", ".lapni-pop-over", "#xenium_hot_offers"],
      easyList: [
        ".yb-floorad",
        fromB64("LndpZGdldF9wb19hZHNfd2lkZ2V0"),
        fromB64("LnRyYWZmaWNqdW5reS1hZA=="),
        ".textad_headline",
        fromB64("LnNwb25zb3JlZC10ZXh0LWxpbmtz")
      ],
      easyListChina: [
        fromB64("LmFwcGd1aWRlLXdyYXBbb25jbGljayo9ImJjZWJvcy5jb20iXQ=="),
        fromB64("LmZyb250cGFnZUFkdk0="),
        "#taotaole",
        "#aafoot.top_box",
        ".cfa_popup"
      ],
      easyListCookie: [
        ".ezmob-footer",
        ".cc-CookieWarning",
        "[data-cookie-number]",
        fromB64("LmF3LWNvb2tpZS1iYW5uZXI="),
        ".sygnal24-gdpr-modal-wrap"
      ],
      easyListCzechSlovak: [
        "#onlajny-stickers",
        fromB64("I3Jla2xhbW5pLWJveA=="),
        fromB64("LnJla2xhbWEtbWVnYWJvYXJk"),
        ".sklik",
        fromB64("W2lkXj0ic2tsaWtSZWtsYW1hIl0=")
      ],
      easyListDutch: [
        fromB64("I2FkdmVydGVudGll"),
        fromB64("I3ZpcEFkbWFya3RCYW5uZXJCbG9jaw=="),
        ".adstekst",
        fromB64("YVtocmVmXj0iaHR0cHM6Ly94bHR1YmUubmwvY2xpY2svIl0="),
        "#semilo-lrectangle"
      ],
      easyListGermany: [
        "#SSpotIMPopSlider",
        fromB64("LnNwb25zb3JsaW5rZ3J1ZW4="),
        fromB64("I3dlcmJ1bmdza3k="),
        fromB64("I3Jla2xhbWUtcmVjaHRzLW1pdHRl"),
        fromB64("YVtocmVmXj0iaHR0cHM6Ly9iZDc0Mi5jb20vIl0=")
      ],
      easyListItaly: [
        fromB64("LmJveF9hZHZfYW5udW5jaQ=="),
        ".sb-box-pubbliredazionale",
        fromB64("YVtocmVmXj0iaHR0cDovL2FmZmlsaWF6aW9uaWFkcy5zbmFpLml0LyJd"),
        fromB64("YVtocmVmXj0iaHR0cHM6Ly9hZHNlcnZlci5odG1sLml0LyJd"),
        fromB64("YVtocmVmXj0iaHR0cHM6Ly9hZmZpbGlhemlvbmlhZHMuc25haS5pdC8iXQ==")
      ],
      easyListLithuania: [
        fromB64("LnJla2xhbW9zX3RhcnBhcw=="),
        fromB64("LnJla2xhbW9zX251b3JvZG9z"),
        fromB64("aW1nW2FsdD0iUmVrbGFtaW5pcyBza3lkZWxpcyJd"),
        fromB64("aW1nW2FsdD0iRGVkaWt1b3RpLmx0IHNlcnZlcmlhaSJd"),
        fromB64("aW1nW2FsdD0iSG9zdGluZ2FzIFNlcnZlcmlhaS5sdCJd")
      ],
      estonian: [fromB64("QVtocmVmKj0iaHR0cDovL3BheTRyZXN1bHRzMjQuZXUiXQ==")],
      fanboyAnnoyances: ["#ac-lre-player", ".navigate-to-top", "#subscribe_popup", ".newsletter_holder", "#back-top"],
      fanboyAntiFacebook: [".util-bar-module-firefly-visible"],
      fanboyEnhancedTrackers: [
        ".open.pushModal",
        "#issuem-leaky-paywall-articles-zero-remaining-nag",
        "#sovrn_container",
        'div[class$="-hide"][zoompage-fontsize][style="display: block;"]',
        ".BlockNag__Card"
      ],
      fanboySocial: ["#FollowUs", "#meteored_share", "#social_follow", ".article-sharer", ".community__social-desc"],
      frellwitSwedish: [
        fromB64("YVtocmVmKj0iY2FzaW5vcHJvLnNlIl1bdGFyZ2V0PSJfYmxhbmsiXQ=="),
        fromB64("YVtocmVmKj0iZG9rdG9yLXNlLm9uZWxpbmsubWUiXQ=="),
        "article.category-samarbete",
        fromB64("ZGl2LmhvbGlkQWRz"),
        "ul.adsmodern"
      ],
      greekAdBlock: [
        fromB64("QVtocmVmKj0iYWRtYW4ub3RlbmV0LmdyL2NsaWNrPyJd"),
        fromB64("QVtocmVmKj0iaHR0cDovL2F4aWFiYW5uZXJzLmV4b2R1cy5nci8iXQ=="),
        fromB64("QVtocmVmKj0iaHR0cDovL2ludGVyYWN0aXZlLmZvcnRobmV0LmdyL2NsaWNrPyJd"),
        "DIV.agores300",
        "TABLE.advright"
      ],
      hungarian: [
        "#cemp_doboz",
        ".optimonk-iframe-container",
        fromB64("LmFkX19tYWlu"),
        fromB64("W2NsYXNzKj0iR29vZ2xlQWRzIl0="),
        "#hirdetesek_box"
      ],
      iDontCareAboutCookies: [
        '.alert-info[data-block-track*="CookieNotice"]',
        ".ModuleTemplateCookieIndicator",
        ".o--cookies--container",
        "#cookies-policy-sticky",
        "#stickyCookieBar"
      ],
      icelandicAbp: [fromB64("QVtocmVmXj0iL2ZyYW1ld29yay9yZXNvdXJjZXMvZm9ybXMvYWRzLmFzcHgiXQ==")],
      latvian: [
        fromB64("YVtocmVmPSJodHRwOi8vd3d3LnNhbGlkemluaS5sdi8iXVtzdHlsZT0iZGlzcGxheTogYmxvY2s7IHdpZHRoOiAxMjBweDsgaGVpZ2h0OiA0MHB4OyBvdmVyZmxvdzogaGlkZGVuOyBwb3NpdGlvbjogcmVsYXRpdmU7Il0="),
        fromB64("YVtocmVmPSJodHRwOi8vd3d3LnNhbGlkemluaS5sdi8iXVtzdHlsZT0iZGlzcGxheTogYmxvY2s7IHdpZHRoOiA4OHB4OyBoZWlnaHQ6IDMxcHg7IG92ZXJmbG93OiBoaWRkZW47IHBvc2l0aW9uOiByZWxhdGl2ZTsiXQ==")
      ],
      listKr: [
        fromB64("YVtocmVmKj0iLy9hZC5wbGFuYnBsdXMuY28ua3IvIl0="),
        fromB64("I2xpdmVyZUFkV3JhcHBlcg=="),
        fromB64("YVtocmVmKj0iLy9hZHYuaW1hZHJlcC5jby5rci8iXQ=="),
        fromB64("aW5zLmZhc3R2aWV3LWFk"),
        ".revenue_unit_item.dable"
      ],
      listeAr: [
        fromB64("LmdlbWluaUxCMUFk"),
        ".right-and-left-sponsers",
        fromB64("YVtocmVmKj0iLmFmbGFtLmluZm8iXQ=="),
        fromB64("YVtocmVmKj0iYm9vcmFxLm9yZyJd"),
        fromB64("YVtocmVmKj0iZHViaXp6bGUuY29tL2FyLz91dG1fc291cmNlPSJd")
      ],
      listeFr: [
        fromB64("YVtocmVmXj0iaHR0cDovL3Byb21vLnZhZG9yLmNvbS8iXQ=="),
        fromB64("I2FkY29udGFpbmVyX3JlY2hlcmNoZQ=="),
        fromB64("YVtocmVmKj0id2Vib3JhbWEuZnIvZmNnaS1iaW4vIl0="),
        ".site-pub-interstitiel",
        'div[id^="crt-"][data-criteo-id]'
      ],
      officialPolish: [
        "#ceneo-placeholder-ceneo-12",
        fromB64("W2hyZWZePSJodHRwczovL2FmZi5zZW5kaHViLnBsLyJd"),
        fromB64("YVtocmVmXj0iaHR0cDovL2Fkdm1hbmFnZXIudGVjaGZ1bi5wbC9yZWRpcmVjdC8iXQ=="),
        fromB64("YVtocmVmXj0iaHR0cDovL3d3dy50cml6ZXIucGwvP3V0bV9zb3VyY2UiXQ=="),
        fromB64("ZGl2I3NrYXBpZWNfYWQ=")
      ],
      ro: [
        fromB64("YVtocmVmXj0iLy9hZmZ0cmsuYWx0ZXgucm8vQ291bnRlci9DbGljayJd"),
        fromB64("YVtocmVmXj0iaHR0cHM6Ly9ibGFja2ZyaWRheXNhbGVzLnJvL3Ryay9zaG9wLyJd"),
        fromB64("YVtocmVmXj0iaHR0cHM6Ly9ldmVudC4ycGVyZm9ybWFudC5jb20vZXZlbnRzL2NsaWNrIl0="),
        fromB64("YVtocmVmXj0iaHR0cHM6Ly9sLnByb2ZpdHNoYXJlLnJvLyJd"),
        'a[href^="/url/"]'
      ],
      ruAd: [
        fromB64("YVtocmVmKj0iLy9mZWJyYXJlLnJ1LyJd"),
        fromB64("YVtocmVmKj0iLy91dGltZy5ydS8iXQ=="),
        fromB64("YVtocmVmKj0iOi8vY2hpa2lkaWtpLnJ1Il0="),
        "#pgeldiz",
        ".yandex-rtb-block"
      ],
      thaiAds: [
        "a[href*=macau-uta-popup]",
        fromB64("I2Fkcy1nb29nbGUtbWlkZGxlX3JlY3RhbmdsZS1ncm91cA=="),
        fromB64("LmFkczMwMHM="),
        ".bumq",
        ".img-kosana"
      ],
      webAnnoyancesUltralist: [
        "#mod-social-share-2",
        "#social-tools",
        fromB64("LmN0cGwtZnVsbGJhbm5lcg=="),
        ".zergnet-recommend",
        ".yt.btn-link.btn-md.btn"
      ]
    };
  }
  function getDomBlockers(_a) {
    var _b = _a === void 0 ? {} : _a, debug = _b.debug;
    return __awaiter(this, void 0, void 0, function() {
      var filters, filterNames, allSelectors, blockedSelectors, activeBlockers;
      var _c;
      return __generator(this, function(_d) {
        switch (_d.label) {
          case 0:
            if (!isApplicable()) {
              return [2, void 0];
            }
            filters = getFilters();
            filterNames = Object.keys(filters);
            allSelectors = (_c = []).concat.apply(_c, filterNames.map(function(filterName) {
              return filters[filterName];
            }));
            return [4, getBlockedSelectors(allSelectors)];
          case 1:
            blockedSelectors = _d.sent();
            if (debug) {
              printDebug(filters, blockedSelectors);
            }
            activeBlockers = filterNames.filter(function(filterName) {
              var selectors = filters[filterName];
              var blockedCount = countTruthy(selectors.map(function(selector) {
                return blockedSelectors[selector];
              }));
              return blockedCount > selectors.length * 0.6;
            });
            activeBlockers.sort();
            return [2, activeBlockers];
        }
      });
    });
  }
  function isApplicable() {
    return isWebKit() || isAndroid();
  }
  function getBlockedSelectors(selectors) {
    var _a;
    return __awaiter(this, void 0, void 0, function() {
      var d, root, elements, blockedSelectors, i, element, holder, i;
      return __generator(this, function(_b) {
        switch (_b.label) {
          case 0:
            d = document;
            root = d.createElement("div");
            elements = new Array(selectors.length);
            blockedSelectors = {};
            forceShow(root);
            for (i = 0; i < selectors.length; ++i) {
              element = selectorToElement(selectors[i]);
              if (element.tagName === "DIALOG") {
                element.show();
              }
              holder = d.createElement("div");
              forceShow(holder);
              holder.appendChild(element);
              root.appendChild(holder);
              elements[i] = element;
            }
            _b.label = 1;
          case 1:
            if (!!d.body) return [3, 3];
            return [4, wait(50)];
          case 2:
            _b.sent();
            return [3, 1];
          case 3:
            d.body.appendChild(root);
            try {
              for (i = 0; i < selectors.length; ++i) {
                if (!elements[i].offsetParent) {
                  blockedSelectors[selectors[i]] = true;
                }
              }
            } finally {
              (_a = root.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(root);
            }
            return [2, blockedSelectors];
        }
      });
    });
  }
  function forceShow(element) {
    element.style.setProperty("visibility", "hidden", "important");
    element.style.setProperty("display", "block", "important");
  }
  function printDebug(filters, blockedSelectors) {
    var message = "DOM blockers debug:\n```";
    for (var _i = 0, _a = Object.keys(filters); _i < _a.length; _i++) {
      var filterName = _a[_i];
      message += "\n".concat(filterName, ":");
      for (var _b = 0, _c = filters[filterName]; _b < _c.length; _b++) {
        var selector = _c[_b];
        message += "\n  ".concat(blockedSelectors[selector] ? "\u{1F6AB}" : "\u27A1\uFE0F", " ").concat(selector);
      }
    }
    console.log("".concat(message, "\n```"));
  }
  function getColorGamut() {
    for (var _i = 0, _a = ["rec2020", "p3", "srgb"]; _i < _a.length; _i++) {
      var gamut = _a[_i];
      if (matchMedia("(color-gamut: ".concat(gamut, ")")).matches) {
        return gamut;
      }
    }
    return void 0;
  }
  function areColorsInverted() {
    if (doesMatch$5("inverted")) {
      return true;
    }
    if (doesMatch$5("none")) {
      return false;
    }
    return void 0;
  }
  function doesMatch$5(value) {
    return matchMedia("(inverted-colors: ".concat(value, ")")).matches;
  }
  function areColorsForced() {
    if (doesMatch$4("active")) {
      return true;
    }
    if (doesMatch$4("none")) {
      return false;
    }
    return void 0;
  }
  function doesMatch$4(value) {
    return matchMedia("(forced-colors: ".concat(value, ")")).matches;
  }
  var maxValueToCheck = 100;
  function getMonochromeDepth() {
    if (!matchMedia("(min-monochrome: 0)").matches) {
      return void 0;
    }
    for (var i = 0; i <= maxValueToCheck; ++i) {
      if (matchMedia("(max-monochrome: ".concat(i, ")")).matches) {
        return i;
      }
    }
    throw new Error("Too high value");
  }
  function getContrastPreference() {
    if (doesMatch$3("no-preference")) {
      return 0;
    }
    if (doesMatch$3("high") || doesMatch$3("more")) {
      return 1;
    }
    if (doesMatch$3("low") || doesMatch$3("less")) {
      return -1;
    }
    if (doesMatch$3("forced")) {
      return 10;
    }
    return void 0;
  }
  function doesMatch$3(value) {
    return matchMedia("(prefers-contrast: ".concat(value, ")")).matches;
  }
  function isMotionReduced() {
    if (doesMatch$2("reduce")) {
      return true;
    }
    if (doesMatch$2("no-preference")) {
      return false;
    }
    return void 0;
  }
  function doesMatch$2(value) {
    return matchMedia("(prefers-reduced-motion: ".concat(value, ")")).matches;
  }
  function isTransparencyReduced() {
    if (doesMatch$1("reduce")) {
      return true;
    }
    if (doesMatch$1("no-preference")) {
      return false;
    }
    return void 0;
  }
  function doesMatch$1(value) {
    return matchMedia("(prefers-reduced-transparency: ".concat(value, ")")).matches;
  }
  function isHDR() {
    if (doesMatch("high")) {
      return true;
    }
    if (doesMatch("standard")) {
      return false;
    }
    return void 0;
  }
  function doesMatch(value) {
    return matchMedia("(dynamic-range: ".concat(value, ")")).matches;
  }
  var M = Math;
  var fallbackFn = function() {
    return 0;
  };
  function getMathFingerprint() {
    var acos = M.acos || fallbackFn;
    var acosh = M.acosh || fallbackFn;
    var asin = M.asin || fallbackFn;
    var asinh = M.asinh || fallbackFn;
    var atanh = M.atanh || fallbackFn;
    var atan = M.atan || fallbackFn;
    var sin = M.sin || fallbackFn;
    var sinh = M.sinh || fallbackFn;
    var cos = M.cos || fallbackFn;
    var cosh = M.cosh || fallbackFn;
    var tan = M.tan || fallbackFn;
    var tanh = M.tanh || fallbackFn;
    var exp = M.exp || fallbackFn;
    var expm1 = M.expm1 || fallbackFn;
    var log1p = M.log1p || fallbackFn;
    var powPI = function(value) {
      return M.pow(M.PI, value);
    };
    var acoshPf = function(value) {
      return M.log(value + M.sqrt(value * value - 1));
    };
    var asinhPf = function(value) {
      return M.log(value + M.sqrt(value * value + 1));
    };
    var atanhPf = function(value) {
      return M.log((1 + value) / (1 - value)) / 2;
    };
    var sinhPf = function(value) {
      return M.exp(value) - 1 / M.exp(value) / 2;
    };
    var coshPf = function(value) {
      return (M.exp(value) + 1 / M.exp(value)) / 2;
    };
    var expm1Pf = function(value) {
      return M.exp(value) - 1;
    };
    var tanhPf = function(value) {
      return (M.exp(2 * value) - 1) / (M.exp(2 * value) + 1);
    };
    var log1pPf = function(value) {
      return M.log(1 + value);
    };
    return {
      acos: acos(0.12312423423423424),
      acosh: acosh(1e308),
      acoshPf: acoshPf(1e154),
      asin: asin(0.12312423423423424),
      asinh: asinh(1),
      asinhPf: asinhPf(1),
      atanh: atanh(0.5),
      atanhPf: atanhPf(0.5),
      atan: atan(0.5),
      sin: sin(-1e300),
      sinh: sinh(1),
      sinhPf: sinhPf(1),
      cos: cos(10.000000000123),
      cosh: cosh(1),
      coshPf: coshPf(1),
      tan: tan(-1e300),
      tanh: tanh(1),
      tanhPf: tanhPf(1),
      exp: exp(1),
      expm1: expm1(1),
      expm1Pf: expm1Pf(1),
      log1p: log1p(10),
      log1pPf: log1pPf(10),
      powPI: powPI(-100)
    };
  }
  var defaultText = "mmMwWLliI0fiflO&1";
  var presets = {
    /**
     * The default font. User can change it in desktop Chrome, desktop Firefox, IE 11,
     * Android Chrome (but only when the size is ≥ than the default) and Android Firefox.
     */
    default: [],
    /** OS font on macOS. User can change its size and weight. Applies after Safari restart. */
    apple: [{ font: "-apple-system-body" }],
    /** User can change it in desktop Chrome and desktop Firefox. */
    serif: [{ fontFamily: "serif" }],
    /** User can change it in desktop Chrome and desktop Firefox. */
    sans: [{ fontFamily: "sans-serif" }],
    /** User can change it in desktop Chrome and desktop Firefox. */
    mono: [{ fontFamily: "monospace" }],
    /**
     * Check the smallest allowed font size. User can change it in desktop Chrome, desktop Firefox and desktop Safari.
     * The height can be 0 in Chrome on a retina display.
     */
    min: [{ fontSize: "1px" }],
    /** Tells one OS from another in desktop Chrome. */
    system: [{ fontFamily: "system-ui" }]
  };
  function getFontPreferences() {
    return withNaturalFonts(function(document2, container) {
      var elements = {};
      var sizes = {};
      for (var _i = 0, _a = Object.keys(presets); _i < _a.length; _i++) {
        var key = _a[_i];
        var _b = presets[key], _c = _b[0], style = _c === void 0 ? {} : _c, _d = _b[1], text = _d === void 0 ? defaultText : _d;
        var element = document2.createElement("span");
        element.textContent = text;
        element.style.whiteSpace = "nowrap";
        for (var _e = 0, _f = Object.keys(style); _e < _f.length; _e++) {
          var name_1 = _f[_e];
          var value = style[name_1];
          if (value !== void 0) {
            element.style[name_1] = value;
          }
        }
        elements[key] = element;
        container.append(document2.createElement("br"), element);
      }
      for (var _g = 0, _h = Object.keys(presets); _g < _h.length; _g++) {
        var key = _h[_g];
        sizes[key] = elements[key].getBoundingClientRect().width;
      }
      return sizes;
    });
  }
  function withNaturalFonts(action, containerWidthPx) {
    if (containerWidthPx === void 0) {
      containerWidthPx = 4e3;
    }
    return withIframe(function(_, iframeWindow) {
      var iframeDocument = iframeWindow.document;
      var iframeBody = iframeDocument.body;
      var bodyStyle = iframeBody.style;
      bodyStyle.width = "".concat(containerWidthPx, "px");
      bodyStyle.webkitTextSizeAdjust = bodyStyle.textSizeAdjust = "none";
      if (isChromium()) {
        iframeBody.style.zoom = "".concat(1 / iframeWindow.devicePixelRatio);
      } else if (isWebKit()) {
        iframeBody.style.zoom = "reset";
      }
      var linesOfText = iframeDocument.createElement("div");
      linesOfText.textContent = __spreadArray([], Array(containerWidthPx / 20 << 0), true).map(function() {
        return "word";
      }).join(" ");
      iframeBody.appendChild(linesOfText);
      return action(iframeDocument, iframeBody);
    }, '<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1">');
  }
  function isPdfViewerEnabled() {
    return navigator.pdfViewerEnabled;
  }
  function getArchitecture() {
    var f = new Float32Array(1);
    var u8 = new Uint8Array(f.buffer);
    f[0] = Infinity;
    f[0] = f[0] - f[0];
    return u8[3];
  }
  function getApplePayState() {
    var ApplePaySession = window.ApplePaySession;
    if (typeof (ApplePaySession === null || ApplePaySession === void 0 ? void 0 : ApplePaySession.canMakePayments) !== "function") {
      return -1;
    }
    if (willPrintConsoleError()) {
      return -3;
    }
    try {
      return ApplePaySession.canMakePayments() ? 1 : 0;
    } catch (error) {
      return getStateFromError(error);
    }
  }
  var willPrintConsoleError = isAnyParentCrossOrigin;
  function getStateFromError(error) {
    if (error instanceof Error && error.name === "InvalidAccessError" && /\bfrom\b.*\binsecure\b/i.test(error.message)) {
      return -2;
    }
    throw error;
  }
  function getPrivateClickMeasurement() {
    var _a;
    var link = document.createElement("a");
    var sourceId = (_a = link.attributionSourceId) !== null && _a !== void 0 ? _a : link.attributionsourceid;
    return sourceId === void 0 ? void 0 : String(sourceId);
  }
  var STATUS_NO_GL_CONTEXT = -1;
  var STATUS_GET_PARAMETER_NOT_A_FUNCTION = -2;
  var validContextParameters = /* @__PURE__ */ new Set([
    10752,
    2849,
    2884,
    2885,
    2886,
    2928,
    2929,
    2930,
    2931,
    2932,
    2960,
    2961,
    2962,
    2963,
    2964,
    2965,
    2966,
    2967,
    2968,
    2978,
    3024,
    3042,
    3088,
    3089,
    3106,
    3107,
    32773,
    32777,
    32777,
    32823,
    32824,
    32936,
    32937,
    32938,
    32939,
    32968,
    32969,
    32970,
    32971,
    3317,
    33170,
    3333,
    3379,
    3386,
    33901,
    33902,
    34016,
    34024,
    34076,
    3408,
    3410,
    3411,
    3412,
    3413,
    3414,
    3415,
    34467,
    34816,
    34817,
    34818,
    34819,
    34877,
    34921,
    34930,
    35660,
    35661,
    35724,
    35738,
    35739,
    36003,
    36004,
    36005,
    36347,
    36348,
    36349,
    37440,
    37441,
    37443,
    7936,
    7937,
    7938
    // SAMPLE_ALPHA_TO_COVERAGE (32926) and SAMPLE_COVERAGE (32928) are excluded because they trigger a console warning
    // in IE, Chrome ≤ 59 and Safari ≤ 13 and give no entropy.
  ]);
  var validExtensionParams = /* @__PURE__ */ new Set([
    34047,
    35723,
    36063,
    34852,
    34853,
    34854,
    34229,
    36392,
    36795,
    38449
    // MAX_VIEWS_OVR
  ]);
  var shaderTypes = ["FRAGMENT_SHADER", "VERTEX_SHADER"];
  var precisionTypes = ["LOW_FLOAT", "MEDIUM_FLOAT", "HIGH_FLOAT", "LOW_INT", "MEDIUM_INT", "HIGH_INT"];
  var rendererInfoExtensionName = "WEBGL_debug_renderer_info";
  var polygonModeExtensionName = "WEBGL_polygon_mode";
  function getWebGlBasics(_a) {
    var _b, _c, _d, _e, _f, _g;
    var cache = _a.cache;
    var gl = getWebGLContext(cache);
    if (!gl) {
      return STATUS_NO_GL_CONTEXT;
    }
    if (!isValidParameterGetter(gl)) {
      return STATUS_GET_PARAMETER_NOT_A_FUNCTION;
    }
    var debugExtension = shouldAvoidDebugRendererInfo() ? null : gl.getExtension(rendererInfoExtensionName);
    return {
      version: ((_b = gl.getParameter(gl.VERSION)) === null || _b === void 0 ? void 0 : _b.toString()) || "",
      vendor: ((_c = gl.getParameter(gl.VENDOR)) === null || _c === void 0 ? void 0 : _c.toString()) || "",
      vendorUnmasked: debugExtension ? (_d = gl.getParameter(debugExtension.UNMASKED_VENDOR_WEBGL)) === null || _d === void 0 ? void 0 : _d.toString() : "",
      renderer: ((_e = gl.getParameter(gl.RENDERER)) === null || _e === void 0 ? void 0 : _e.toString()) || "",
      rendererUnmasked: debugExtension ? (_f = gl.getParameter(debugExtension.UNMASKED_RENDERER_WEBGL)) === null || _f === void 0 ? void 0 : _f.toString() : "",
      shadingLanguageVersion: ((_g = gl.getParameter(gl.SHADING_LANGUAGE_VERSION)) === null || _g === void 0 ? void 0 : _g.toString()) || ""
    };
  }
  function getWebGlExtensions(_a) {
    var cache = _a.cache;
    var gl = getWebGLContext(cache);
    if (!gl) {
      return STATUS_NO_GL_CONTEXT;
    }
    if (!isValidParameterGetter(gl)) {
      return STATUS_GET_PARAMETER_NOT_A_FUNCTION;
    }
    var extensions = gl.getSupportedExtensions();
    var contextAttributes = gl.getContextAttributes();
    var unsupportedExtensions = [];
    var attributes = [];
    var parameters = [];
    var extensionParameters = [];
    var shaderPrecisions = [];
    if (contextAttributes) {
      for (var _i = 0, _b = Object.keys(contextAttributes); _i < _b.length; _i++) {
        var attributeName = _b[_i];
        attributes.push("".concat(attributeName, "=").concat(contextAttributes[attributeName]));
      }
    }
    var constants = getConstantsFromPrototype(gl);
    for (var _c = 0, constants_1 = constants; _c < constants_1.length; _c++) {
      var constant = constants_1[_c];
      var code = gl[constant];
      parameters.push("".concat(constant, "=").concat(code).concat(validContextParameters.has(code) ? "=".concat(gl.getParameter(code)) : ""));
    }
    if (extensions) {
      for (var _d = 0, extensions_1 = extensions; _d < extensions_1.length; _d++) {
        var name_1 = extensions_1[_d];
        if (name_1 === rendererInfoExtensionName && shouldAvoidDebugRendererInfo() || name_1 === polygonModeExtensionName && shouldAvoidPolygonModeExtensions()) {
          continue;
        }
        var extension = gl.getExtension(name_1);
        if (!extension) {
          unsupportedExtensions.push(name_1);
          continue;
        }
        for (var _e = 0, _f = getConstantsFromPrototype(extension); _e < _f.length; _e++) {
          var constant = _f[_e];
          var code = extension[constant];
          extensionParameters.push("".concat(constant, "=").concat(code).concat(validExtensionParams.has(code) ? "=".concat(gl.getParameter(code)) : ""));
        }
      }
    }
    for (var _g = 0, shaderTypes_1 = shaderTypes; _g < shaderTypes_1.length; _g++) {
      var shaderType = shaderTypes_1[_g];
      for (var _h = 0, precisionTypes_1 = precisionTypes; _h < precisionTypes_1.length; _h++) {
        var precisionType = precisionTypes_1[_h];
        var shaderPrecision = getShaderPrecision(gl, shaderType, precisionType);
        shaderPrecisions.push("".concat(shaderType, ".").concat(precisionType, "=").concat(shaderPrecision.join(",")));
      }
    }
    extensionParameters.sort();
    parameters.sort();
    return {
      contextAttributes: attributes,
      parameters,
      shaderPrecisions,
      extensions,
      extensionParameters,
      unsupportedExtensions
    };
  }
  function getWebGLContext(cache) {
    if (cache.webgl) {
      return cache.webgl.context;
    }
    var canvas = document.createElement("canvas");
    var context;
    canvas.addEventListener("webglCreateContextError", function() {
      return context = void 0;
    });
    for (var _i = 0, _a = ["webgl", "experimental-webgl"]; _i < _a.length; _i++) {
      var type = _a[_i];
      try {
        context = canvas.getContext(type);
      } catch (_b) {
      }
      if (context) {
        break;
      }
    }
    cache.webgl = { context };
    return context;
  }
  function getShaderPrecision(gl, shaderType, precisionType) {
    var shaderPrecision = gl.getShaderPrecisionFormat(gl[shaderType], gl[precisionType]);
    return shaderPrecision ? [shaderPrecision.rangeMin, shaderPrecision.rangeMax, shaderPrecision.precision] : [];
  }
  function getConstantsFromPrototype(obj) {
    var keys = Object.keys(obj.__proto__);
    return keys.filter(isConstantLike);
  }
  function isConstantLike(key) {
    return typeof key === "string" && !key.match(/[^A-Z0-9_x]/);
  }
  function shouldAvoidDebugRendererInfo() {
    return isGecko();
  }
  function shouldAvoidPolygonModeExtensions() {
    return isChromium() || isWebKit();
  }
  function isValidParameterGetter(gl) {
    return typeof gl.getParameter === "function";
  }
  function getAudioContextBaseLatency() {
    var isAllowedPlatform = isAndroid() || isWebKit();
    if (!isAllowedPlatform) {
      return -2;
    }
    if (!window.AudioContext) {
      return -1;
    }
    var latency = new AudioContext().baseLatency;
    if (latency === null || latency === void 0) {
      return -1;
    }
    if (!isFinite(latency)) {
      return -3;
    }
    return latency;
  }
  function getDateTimeLocale() {
    if (!window.Intl) {
      return -1;
    }
    var DateTimeFormat = window.Intl.DateTimeFormat;
    if (!DateTimeFormat) {
      return -2;
    }
    var locale = DateTimeFormat().resolvedOptions().locale;
    if (!locale && locale !== "") {
      return -3;
    }
    return locale;
  }
  var sources = {
    // READ FIRST:
    // See https://github.com/fingerprintjs/fingerprintjs/blob/master/contributing.md#how-to-add-an-entropy-source
    // to learn how entropy source works and how to make your own.
    // The sources run in this exact order.
    // The asynchronous sources are at the start to run in parallel with other sources.
    fonts: getFonts,
    domBlockers: getDomBlockers,
    fontPreferences: getFontPreferences,
    audio: getAudioFingerprint,
    screenFrame: getScreenFrame,
    canvas: getCanvasFingerprint,
    osCpu: getOsCpu,
    languages: getLanguages,
    colorDepth: getColorDepth,
    deviceMemory: getDeviceMemory,
    screenResolution: getScreenResolution,
    hardwareConcurrency: getHardwareConcurrency,
    timezone: getTimezone,
    sessionStorage: getSessionStorage,
    localStorage: getLocalStorage,
    indexedDB: getIndexedDB,
    openDatabase: getOpenDatabase,
    cpuClass: getCpuClass,
    platform: getPlatform,
    plugins: getPlugins,
    touchSupport: getTouchSupport,
    vendor: getVendor,
    vendorFlavors: getVendorFlavors,
    cookiesEnabled: areCookiesEnabled,
    colorGamut: getColorGamut,
    invertedColors: areColorsInverted,
    forcedColors: areColorsForced,
    monochrome: getMonochromeDepth,
    contrast: getContrastPreference,
    reducedMotion: isMotionReduced,
    reducedTransparency: isTransparencyReduced,
    hdr: isHDR,
    math: getMathFingerprint,
    pdfViewerEnabled: isPdfViewerEnabled,
    architecture: getArchitecture,
    applePay: getApplePayState,
    privateClickMeasurement: getPrivateClickMeasurement,
    audioBaseLatency: getAudioContextBaseLatency,
    dateTimeLocale: getDateTimeLocale,
    // Some sources can affect other sources (e.g. WebGL can affect canvas), so it's important to run these sources
    // after other sources.
    webGlBasics: getWebGlBasics,
    webGlExtensions: getWebGlExtensions
  };
  function loadBuiltinSources(options) {
    return loadSources(sources, options, []);
  }
  var commentTemplate = "$ if upgrade to Pro: https://fpjs.dev/pro";
  function getConfidence(components) {
    var openConfidenceScore = getOpenConfidenceScore(components);
    var proConfidenceScore = deriveProConfidenceScore(openConfidenceScore);
    return { score: openConfidenceScore, comment: commentTemplate.replace(/\$/g, "".concat(proConfidenceScore)) };
  }
  function getOpenConfidenceScore(components) {
    if (isAndroid()) {
      return 0.4;
    }
    if (isWebKit()) {
      return isDesktopWebKit() && !(isWebKit616OrNewer() && isSafariWebKit()) ? 0.5 : 0.3;
    }
    var platform = "value" in components.platform ? components.platform.value : "";
    if (/^Win/.test(platform)) {
      return 0.6;
    }
    if (/^Mac/.test(platform)) {
      return 0.5;
    }
    return 0.7;
  }
  function deriveProConfidenceScore(openConfidenceScore) {
    return round(0.99 + 0.01 * openConfidenceScore, 1e-4);
  }
  function componentsToCanonicalString(components) {
    var result = "";
    for (var _i = 0, _a = Object.keys(components).sort(); _i < _a.length; _i++) {
      var componentKey = _a[_i];
      var component = components[componentKey];
      var value = "error" in component ? "error" : JSON.stringify(component.value);
      result += "".concat(result ? "|" : "").concat(componentKey.replace(/([:|\\])/g, "\\$1"), ":").concat(value);
    }
    return result;
  }
  function componentsToDebugString(components) {
    return JSON.stringify(components, function(_key, value) {
      if (value instanceof Error) {
        return errorToObject(value);
      }
      return value;
    }, 2);
  }
  function hashComponents(components) {
    return x64hash128(componentsToCanonicalString(components));
  }
  function makeLazyGetResult(components) {
    var visitorIdCache;
    var confidence = getConfidence(components);
    return {
      get visitorId() {
        if (visitorIdCache === void 0) {
          visitorIdCache = hashComponents(this.components);
        }
        return visitorIdCache;
      },
      set visitorId(visitorId) {
        visitorIdCache = visitorId;
      },
      confidence,
      components,
      version
    };
  }
  function prepareForSources(delayFallback) {
    if (delayFallback === void 0) {
      delayFallback = 50;
    }
    return requestIdleCallbackIfAvailable(delayFallback, delayFallback * 2);
  }
  function makeAgent(getComponents, debug) {
    var creationTime = Date.now();
    return {
      get: function(options) {
        return __awaiter(this, void 0, void 0, function() {
          var startTime, components, result;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                startTime = Date.now();
                return [4, getComponents()];
              case 1:
                components = _a.sent();
                result = makeLazyGetResult(components);
                if (debug || (options === null || options === void 0 ? void 0 : options.debug)) {
                  console.log("Copy the text below to get the debug data:\n\n```\nversion: ".concat(result.version, "\nuserAgent: ").concat(navigator.userAgent, "\ntimeBetweenLoadAndGet: ").concat(startTime - creationTime, "\nvisitorId: ").concat(result.visitorId, "\ncomponents: ").concat(componentsToDebugString(components), "\n```"));
                }
                return [2, result];
            }
          });
        });
      }
    };
  }
  function monitor() {
    if (window.__fpjs_d_m || Math.random() >= 1e-3) {
      return;
    }
    try {
      var request = new XMLHttpRequest();
      request.open("get", "https://m1.openfpcdn.io/fingerprintjs/v".concat(version, "/npm-monitoring"), true);
      request.send();
    } catch (error) {
      console.error(error);
    }
  }
  function load(options) {
    var _a;
    if (options === void 0) {
      options = {};
    }
    return __awaiter(this, void 0, void 0, function() {
      var delayFallback, debug, getComponents;
      return __generator(this, function(_b) {
        switch (_b.label) {
          case 0:
            if ((_a = options.monitoring) !== null && _a !== void 0 ? _a : true) {
              monitor();
            }
            delayFallback = options.delayFallback, debug = options.debug;
            return [4, prepareForSources(delayFallback)];
          case 1:
            _b.sent();
            getComponents = loadBuiltinSources({ cache: {}, debug });
            return [2, makeAgent(getComponents, debug)];
        }
      });
    });
  }
  var index = { load, hashComponents, componentsToDebugString };

  // lib/fingerprint.js
  var cachedId = null;
  var getFingerprint = async () => {
    if (cachedId) return cachedId;
    const fpPromise = index.load();
    const fp = await fpPromise;
    const result = await fp.get();
    cachedId = result.visitorId;
    return cachedId;
  };

  // src/views/LoginForm.js
  console.log("login fire");
  var i18n3 = {
    en: {
      heading: "Log In",
      subheading: "Welcome back! Please sign in.",
      email: "Email",
      password: "Password",
      login: "Log In",
      error: "Login failed. Please check your credentials.",
      forgotPassword: "Forgot your password?",
      reset: {
        heading: "Reset Your Password",
        subheading: "Enter your email and we'll send you reset instructions.",
        email: "Registered Email",
        button: "Send Reset Link",
        success: "Reset link sent! Please check your email.",
        error: "Could not send reset email. Try again."
      },
      passwordResetSuccess: "Password reset successfully! Please log in with your new password."
    },
    id: {
      heading: "Masuk",
      subheading: "Selamat datang! Silakan masuk.",
      email: "Surel",
      password: "Kata Sandi",
      login: "Masuk",
      error: "Login gagal. Silakan periksa kembali kredensial Anda.",
      forgotPassword: "Lupa kata sandi?",
      reset: {
        heading: "Atur Ulang Kata Sandi",
        subheading: "Masukkan email Anda dan kami akan mengirimkan instruksi.",
        email: "Email Terdaftar",
        button: "Kirim Tautan Atur Ulang",
        success: "Tautan atur ulang dikirim! Silakan periksa email Anda.",
        error: "Gagal mengirim email atur ulang. Coba lagi."
      },
      passwordResetSuccess: "Kata sandi berhasil diatur ulang! Silakan masuk dengan kata sandi baru Anda."
    }
  };
  var LoginForm = {
    email: "",
    password: "",
    error: "",
    success: "",
    loading: false,
    // ⏳ Track whether request is in progress
    forgotEmail: "",
    resetSuccess: false,
    resetError: "",
    showResetModal: false,
    resetLoading: false,
    resetStep: 1,
    // 1: email, 2: code
    resetCode: "",
    oninit: () => {
      LoginForm.email = "";
      LoginForm.password = "";
      LoginForm.error = "";
      LoginForm.loading = false;
      LoginForm.forgotEmail = "";
      LoginForm.resetSuccess = false;
      LoginForm.resetError = "";
      LoginForm.showResetModal = false;
      LoginForm.resetLoading = false;
      LoginForm.resetStep = 1;
      LoginForm.resetCode = "";
      const params = import_mithril3.default.route.param();
      if (params.success === "password_reset") {
        const lang3 = localStorage.getItem("lang") || "en";
        LoginForm.success = i18n3[lang3].passwordResetSuccess;
      } else {
        LoginForm.success = "";
      }
    },
    view: () => {
      document.documentElement.setAttribute("data-theme", localStorage.getItem("theme") || "auto");
      const lang3 = localStorage.getItem("lang") || "en";
      const t2 = i18n3[lang3];
      return (0, import_mithril3.default)(
        "main.container",
        [
          (0, import_mithril3.default)("article", [
            (0, import_mithril3.default)("hgroup", [
              (0, import_mithril3.default)("h1", t2.heading),
              (0, import_mithril3.default)("h2", t2.subheading)
            ]),
            LoginForm.error && (0, import_mithril3.default)("p", { style: "color: red;" }, `\u274C ${LoginForm.error}`),
            LoginForm.success && (0, import_mithril3.default)("p", { style: "color: green;" }, `\u2705 ${LoginForm.success}`),
            (0, import_mithril3.default)("form", {
              onsubmit: async (e) => {
                e.preventDefault();
                LoginForm.error = LoginForm.success = "";
                LoginForm.loading = true;
                try {
                  const res = await import_mithril3.default.request({
                    method: "POST",
                    url: "/api/login",
                    body: {
                      email: LoginForm.email,
                      password: LoginForm.password,
                      fingerprint: await getFingerprint()
                    }
                  });
                  LoginForm.success = res.msg || "Logged in";
                  localStorage.setItem("token", res.token);
                  import_mithril3.default.route.set("/");
                } catch (err) {
                  LoginForm.error = err.message || "Login failed";
                  if (err.status === 401) LoginForm.error = t2.error;
                }
                LoginForm.loading = false;
              }
            }, [
              (0, import_mithril3.default)("label", { for: "email" }, t2.email),
              (0, import_mithril3.default)("input", {
                id: "email",
                type: "email",
                placeholder: "you@example.com",
                value: LoginForm.email,
                oninput: (e) => LoginForm.email = e.target.value
              }),
              (0, import_mithril3.default)("label", { for: "password" }, t2.password),
              (0, import_mithril3.default)("input", {
                id: "password",
                type: "password",
                placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
                value: LoginForm.password,
                oninput: (e) => LoginForm.password = e.target.value
              }),
              (0, import_mithril3.default)("button", {
                type: "submit",
                //  value:  t.login,
                //  value: LoginForm.loading ? "⏳ " + t.login : t.login,
                "aria-busy": LoginForm.loading ? "true" : false,
                disabled: !(LoginForm.email && LoginForm.password)
              }, t2.login)
            ]),
            (0, import_mithril3.default)("a", {
              style: "margin-top: 0.5rem; text-decoration: underline; cursor: pointer; display: inline-block;",
              onclick: () => {
                LoginForm.resetSuccess = LoginForm.resetError = "";
                LoginForm.forgotEmail = LoginForm.email;
                LoginForm.showResetModal = true;
              }
            }, lang3 === "id" ? "\u{1F511} Lupa kata sandi?" : "\u{1F511} Forgot your password?")
          ])
        ],
        LoginForm.showResetModal && (0, import_mithril3.default)("dialog[open]", {
          style: "max-width: 400px; margin: auto; border-radius: 6px;"
        }, [
          (0, import_mithril3.default)("article", [
            (0, import_mithril3.default)("header", [
              (0, import_mithril3.default)("h3", lang3 === "id" ? "Lupa Kata Sandi" : "Forgot Password")
            ]),
            (0, import_mithril3.default)(
              "p",
              lang3 === "id" ? "Masukkan email yang terdaftar untuk menerima kode reset." : "Enter your registered email to receive a reset code."
            ),
            // Step 1: Email input
            LoginForm.resetStep === 1 && [
              LoginForm.resetSuccess && (0, import_mithril3.default)(
                "p",
                { style: "color: green" },
                lang3 === "id" ? "\u2705 Kode berhasil dikirim. Silakan cek email Anda." : "\u2705 Code sent successfully. Please check your email."
              ),
              LoginForm.resetError && (0, import_mithril3.default)(
                "p",
                { style: "color: red" },
                lang3 === "id" ? "\u274C Gagal mengirim tautan reset" : "\u274C Failed to send reset email"
              ),
              (0, import_mithril3.default)("form", {
                onsubmit: async (e) => {
                  e.preventDefault();
                  LoginForm.resetSuccess = LoginForm.resetError = "";
                  LoginForm.resetLoading = true;
                  try {
                    const res = await import_mithril3.default.request({
                      method: "POST",
                      url: "/api/request-password-reset",
                      body: { email: LoginForm.forgotEmail },
                      headers: { "x-lang": lang3 }
                    });
                    LoginForm.resetSuccess = true;
                    LoginForm.resetStep = 2;
                  } catch (err) {
                    LoginForm.resetError = true;
                  }
                  LoginForm.resetLoading = false;
                }
              }, [
                (0, import_mithril3.default)("label", { for: "forgotEmail" }, lang3 === "id" ? "Email Terdaftar" : "Registered Email"),
                (0, import_mithril3.default)("input", {
                  id: "forgotEmail",
                  type: "email",
                  value: LoginForm.forgotEmail,
                  oninput: (e) => LoginForm.forgotEmail = e.target.value
                }),
                (0, import_mithril3.default)("div", { style: "display: flex; gap: 0.5rem; margin-top: 1rem;" }, [
                  (0, import_mithril3.default)("button", {
                    style: { "border-color": "#D93526", "background-color": "#D93526" },
                    type: "button",
                    onclick: () => {
                      LoginForm.showResetModal = false;
                      LoginForm.resetStep = 1;
                      LoginForm.resetSuccess = LoginForm.resetError = "";
                      LoginForm.forgotEmail = "";
                      LoginForm.resetCode = "";
                    }
                  }, lang3 === "id" ? "Batal" : "Cancel"),
                  (0, import_mithril3.default)("button", {
                    type: "submit",
                    disabled: !LoginForm.forgotEmail || LoginForm.resetLoading
                  }, LoginForm.resetLoading ? lang3 === "id" ? "Mengirim..." : "Sending..." : lang3 === "id" ? "Kirim Kode" : "Send Code")
                ])
              ])
            ],
            // Step 2: Code input
            LoginForm.resetStep === 2 && [
              (0, import_mithril3.default)("form", {
                onsubmit: async (e) => {
                  e.preventDefault();
                  LoginForm.resetError = false;
                  LoginForm.resetLoading = true;
                  try {
                    await import_mithril3.default.request({
                      method: "POST",
                      url: "/api/verify-reset-code",
                      body: {
                        email: LoginForm.forgotEmail,
                        code: LoginForm.resetCode
                      }
                    });
                    import_mithril3.default.route.set("/reset", {
                      code: LoginForm.resetCode,
                      email: LoginForm.forgotEmail
                    });
                  } catch (err) {
                    LoginForm.resetError = true;
                  }
                  LoginForm.resetLoading = false;
                }
              }, [
                (0, import_mithril3.default)("label", { for: "resetCode" }, lang3 === "id" ? "Kode 6 Digit" : "6 Digit Code"),
                (0, import_mithril3.default)("input", {
                  id: "resetCode",
                  type: "text",
                  maxlength: 6,
                  pattern: "\\d{6}",
                  value: LoginForm.resetCode,
                  oninput: (e) => {
                    LoginForm.resetCode = e.target.value.replace(/\D/g, "").slice(0, 6);
                    LoginForm.resetError = false;
                  }
                }),
                LoginForm.resetError && (0, import_mithril3.default)(
                  "p",
                  { style: "color: red" },
                  lang3 === "id" ? "\u274C Kode salah" : "\u274C Incorrect code"
                ),
                (0, import_mithril3.default)("div", { style: "display: flex; gap: 0.5rem; margin-top: 1rem;" }, [
                  (0, import_mithril3.default)("button.secondary", {
                    type: "button",
                    onclick: () => {
                      LoginForm.resetStep = 1;
                      LoginForm.resetCode = "";
                      LoginForm.resetError = false;
                    }
                  }, lang3 === "id" ? "Kembali" : "Back"),
                  (0, import_mithril3.default)("button", {
                    type: "submit",
                    disabled: LoginForm.resetCode.length !== 6 || LoginForm.resetLoading,
                    "aria-busy": LoginForm.resetLoading ? "true" : false
                  }, LoginForm.resetLoading ? lang3 === "id" ? "Mengonfirmasi..." : "Confirming..." : lang3 === "id" ? "Konfirmasi" : "Confirm")
                ])
              ])
            ]
          ])
        ])
      );
    }
  };
  var LoginForm_default = LoginForm;

  // src/views/ProfilePage.js
  var import_mithril4 = __toESM(require_mithril(), 1);
  var ProfilePage = {
    user: null,
    error: "",
    loading: true,
    oninit: async () => {
      const visitorId = await getFingerprint();
      try {
        const res = await import_mithril4.default.request({
          method: "GET",
          url: "/api/profile",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "X-Device-Fingerprint": visitorId
            // 👈 send it here!
          }
        });
        ProfilePage.user = res.user;
      } catch (err) {
        ProfilePage.error = err.message || "Unauthorized";
      }
      ProfilePage.loading = false;
    },
    view: () => {
      document.documentElement.setAttribute("data-theme", localStorage.getItem("theme") || "auto");
      return (0, import_mithril4.default)("main.container", [
        (0, import_mithril4.default)("h1", "\u{1F464} Profile"),
        ProfilePage.error ? (0, import_mithril4.default)("p", { style: "color:red" }, `\u274C ${String(ProfilePage.error.message || ProfilePage.error)}`) : ProfilePage.user ? (0, import_mithril4.default)("pre", JSON.stringify(ProfilePage.user, null, 2)) : (0, import_mithril4.default)("p", "\u23F3 Loading...")
      ]);
    }
  };
  var ProfilePage_default = ProfilePage;

  // src/views/ChangePasswordForm.js
  var import_mithril5 = __toESM(require_mithril(), 1);
  var lang2 = localStorage.getItem("lang") || "en";
  var ChangePasswordForm = {
    language: lang2,
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    newPasswordInput: "",
    fingerprint: "",
    message: "",
    error: "",
    isSubmitting: false,
    t(key) {
      return ChangePasswordForm.translations[ChangePasswordForm.language][key] || key;
    },
    translations: {
      en: {
        title: "Change Password",
        old: "Current Password",
        new: "New Password",
        confirm: "Confirm New Password",
        mismatch: "New passwords do not match",
        changed: "Password changed successfully",
        invalid: "Invalid old password or fingerprint",
        button: "Update Password",
        strength: ["Too Weak", "Weak", "Fair", "Strong", "Very Strong"]
      },
      id: {
        title: "Ubah Kata Sandi",
        old: "Kata Sandi Saat Ini",
        new: "Kata Sandi Baru",
        confirm: "Konfirmasi Kata Sandi Baru",
        mismatch: "Kata sandi baru tidak cocok",
        changed: "Kata sandi berhasil diubah",
        invalid: "Kata sandi atau sidik perangkat tidak valid",
        button: "Perbarui Kata Sandi",
        strength: ["Terlalu Lemah", "Lemah", "Cukup", "Kuat", "Sangat Kuat"]
      }
    },
    getPasswordStrength(pwd) {
      if (!pwd) return 0;
      let score = 0;
      if (pwd.length >= 8) score++;
      if (/[A-Z]/.test(pwd)) score++;
      if (/[a-z]/.test(pwd)) score++;
      if (/[0-9]/.test(pwd)) score++;
      if (/[^A-Za-z0-9]/.test(pwd)) score++;
      return score;
    },
    async submit(e) {
      e.preventDefault();
      ChangePasswordForm.error = ChangePasswordForm.message = "";
      ChangePasswordForm.isSubmitting = true;
      if (ChangePasswordForm.newPasswordInput !== ChangePasswordForm.confirmPassword) {
        ChangePasswordForm.error = "mismatch";
        ChangePasswordForm.isSubmitting = false;
        return;
      }
      try {
        const fingerprint = await getFingerprint();
        const token = localStorage.getItem("token");
        await import_mithril5.default.request({
          method: "POST",
          url: "/api/change-password",
          body: {
            oldPassword: ChangePasswordForm.oldPassword,
            newPassword: ChangePasswordForm.newPasswordInput
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "x-device-fingerprint": fingerprint
          }
        });
        ChangePasswordForm.message = "changed";
        ChangePasswordForm.oldPassword = "";
        ChangePasswordForm.newPasswordInput = "";
        ChangePasswordForm.confirmPassword = "";
        setTimeout(() => {
          import_mithril5.default.route.set("/");
        }, 1e3);
      } catch (err) {
        ChangePasswordForm.error = "invalid";
      } finally {
        ChangePasswordForm.isSubmitting = false;
      }
    },
    view() {
      document.documentElement.setAttribute("data-theme", localStorage.getItem("theme") || "auto");
      const strength = ChangePasswordForm.getPasswordStrength(ChangePasswordForm.newPasswordInput);
      const t2 = ChangePasswordForm.t;
      return (0, import_mithril5.default)("main.container", [
        (0, import_mithril5.default)("form", { onsubmit: ChangePasswordForm.submit, style: "max-width: 400px; margin: auto" }, [
          (0, import_mithril5.default)("h2", t2("title")),
          (0, import_mithril5.default)("label", { for: "old" }, t2("old")),
          (0, import_mithril5.default)("input", {
            id: "old",
            type: "password",
            value: ChangePasswordForm.oldPassword,
            oninput: (e) => ChangePasswordForm.oldPassword = e.target.value
          }),
          (0, import_mithril5.default)("label", { for: "new" }, t2("new")),
          (0, import_mithril5.default)("input", {
            id: "new",
            type: "password",
            value: ChangePasswordForm.newPasswordInput,
            oninput: (e) => ChangePasswordForm.newPasswordInput = e.target.value
          }),
          ChangePasswordForm.newPasswordInput && (0, import_mithril5.default)("small", t2("strength")[strength - 1] || t2("strength")[0]),
          ChangePasswordForm.newPasswordInput && (0, import_mithril5.default)("progress", {
            value: strength,
            max: 5,
            style: "width: 100%; height: 6px;"
          }),
          (0, import_mithril5.default)("label", { for: "confirm" }, t2("confirm")),
          (0, import_mithril5.default)("input", {
            id: "confirm",
            type: "password",
            value: ChangePasswordForm.confirmPassword,
            oninput: (e) => ChangePasswordForm.confirmPassword = e.target.value
          }),
          (0, import_mithril5.default)(
            "button",
            {
              type: "submit",
              disabled: ChangePasswordForm.isSubmitting || !ChangePasswordForm.oldPassword || !ChangePasswordForm.newPasswordInput || !ChangePasswordForm.confirmPassword || ChangePasswordForm.newPasswordInput !== ChangePasswordForm.confirmPassword,
              "aria-busy": ChangePasswordForm.isSubmitting ? "true" : false
            },
            ChangePasswordForm.t("button")
          ),
          ChangePasswordForm.error && (0, import_mithril5.default)("p", { style: "color:red; margin-top: 8px" }, t2(ChangePasswordForm.error)),
          ChangePasswordForm.message && (0, import_mithril5.default)("p", { style: "color:green; margin-top: 8px" }, t2(ChangePasswordForm.message))
        ])
      ]);
    }
  };
  var ChangePasswordForm_default = ChangePasswordForm;

  // src/views/ForgotPasswordForm.js
  var import_mithril6 = __toESM(require_mithril(), 1);
  var i18n4 = {
    en: {
      heading: "Reset Your Password",
      subheading: "Enter your email and we'll send you reset instructions.",
      email: "Registered Email",
      button: "Send Reset Link",
      success: "Reset link sent! Please check your email.",
      error: "Could not send reset email. Try again."
    },
    id: {
      heading: "Atur Ulang Kata Sandi",
      subheading: "Masukkan email Anda dan kami akan mengirimkan instruksi.",
      email: "Email Terdaftar",
      button: "Kirim Tautan Atur Ulang",
      success: "Tautan atur ulang dikirim! Silakan periksa email Anda.",
      error: "Gagal mengirim email atur ulang. Coba lagi."
    }
  };
  var ForgotPasswordForm = {
    email: "",
    success: "",
    error: "",
    loading: false,
    view() {
      const lang3 = localStorage.getItem("lang") || "en";
      const t2 = i18n4[lang3];
      document.documentElement.setAttribute("data-theme", localStorage.getItem("theme") || "auto");
      return (0, import_mithril6.default)("main.container", [
        (0, import_mithril6.default)("article", [
          (0, import_mithril6.default)("hgroup", [
            (0, import_mithril6.default)("h1", t2.heading),
            (0, import_mithril6.default)("h2", t2.subheading)
          ]),
          ForgotPasswordForm.success && (0, import_mithril6.default)("p", { style: "color: green" }, t2.success),
          ForgotPasswordForm.error && (0, import_mithril6.default)("p", { style: "color: red" }, t2.error),
          (0, import_mithril6.default)("form", {
            onsubmit: async (e) => {
              e.preventDefault();
              ForgotPasswordForm.success = ForgotPasswordForm.error = "";
              ForgotPasswordForm.loading = true;
              try {
                await import_mithril6.default.request({
                  method: "POST",
                  url: "/api/request-password-reset",
                  body: { email: ForgotPasswordForm.email }
                });
                ForgotPasswordForm.success = true;
              } catch (err) {
                ForgotPasswordForm.error = true;
              }
              ForgotPasswordForm.loading = false;
            }
          }, [
            (0, import_mithril6.default)("label", { for: "email" }, t2.email),
            (0, import_mithril6.default)("input", {
              id: "email",
              type: "email",
              value: ForgotPasswordForm.email,
              oninput: (e) => ForgotPasswordForm.email = e.target.value
            }),
            (0, import_mithril6.default)("button", {
              type: "submit",
              disabled: !ForgotPasswordForm.email || ForgotPasswordForm.loading,
              "aria-busy": ForgotPasswordForm.loading ? "true" : null
            }, t2.button)
          ])
        ])
      ]);
    }
  };
  var ForgotPasswordForm_default = ForgotPasswordForm;

  // src/views/ResetPassword.js
  var import_mithril7 = __toESM(require_mithril(), 1);
  var ResetPassword = {
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
    error: "",
    success: "",
    loading: false,
    oninit: () => {
      ResetPassword.email = import_mithril7.default.route.param("email") || "";
      ResetPassword.code = import_mithril7.default.route.param("code") || "";
    },
    view: () => {
      const lang3 = localStorage.getItem("lang") || "en";
      const t2 = {
        en: {
          heading: "Reset Password",
          subheading: "Enter your new password below.",
          newPassword: "New Password",
          confirmPassword: "Confirm Password",
          submit: "Update Password",
          success: "\u2705 Password updated successfully!",
          error: "\u274C Error updating password. Try again.",
          mismatch: "\u274C Passwords do not match.",
          short: "\u274C Password too short (min 6 characters)."
        },
        id: {
          heading: "Atur Ulang Kata Sandi",
          subheading: "Masukkan kata sandi baru Anda.",
          newPassword: "Kata Sandi Baru",
          confirmPassword: "Konfirmasi Kata Sandi",
          submit: "Perbarui Kata Sandi",
          success: "\u2705 Kata sandi berhasil diperbarui!",
          error: "\u274C Gagal memperbarui kata sandi. Coba lagi.",
          mismatch: "\u274C Kata sandi tidak cocok.",
          short: "\u274C Kata sandi terlalu pendek (min 6 karakter)."
        }
      }[lang3];
      return (0, import_mithril7.default)("main.container", [
        (0, import_mithril7.default)("article", [
          (0, import_mithril7.default)("hgroup", [
            (0, import_mithril7.default)("h1", t2.heading),
            (0, import_mithril7.default)("h2", t2.subheading)
          ]),
          ResetPassword.success && (0, import_mithril7.default)("p", { style: "color: green" }, t2.success),
          ResetPassword.error && (0, import_mithril7.default)("p", { style: "color: red" }, ResetPassword.error),
          (0, import_mithril7.default)("form", {
            onsubmit: async (e) => {
              e.preventDefault();
              ResetPassword.error = ResetPassword.success = "";
              if (ResetPassword.newPassword !== ResetPassword.confirmPassword) {
                ResetPassword.error = t2.mismatch;
                return;
              }
              if (ResetPassword.newPassword.length < 6) {
                ResetPassword.error = t2.short;
                return;
              }
              ResetPassword.loading = true;
              try {
                const res = await import_mithril7.default.request({
                  method: "POST",
                  url: "/api/change-password",
                  body: {
                    email: ResetPassword.email,
                    resetCode: ResetPassword.code,
                    newPassword: ResetPassword.newPassword
                  }
                });
                import_mithril7.default.route.set("/login", { success: "password_reset" });
              } catch (err) {
                ResetPassword.error = err.message || t2.error;
              }
              ResetPassword.loading = false;
            }
          }, [
            (0, import_mithril7.default)("label", { for: "newPassword" }, t2.newPassword),
            (0, import_mithril7.default)("input", {
              id: "newPassword",
              type: "password",
              value: ResetPassword.newPassword,
              oninput: (e) => ResetPassword.newPassword = e.target.value
            }),
            (0, import_mithril7.default)("label", { for: "confirmPassword" }, t2.confirmPassword),
            (0, import_mithril7.default)("input", {
              id: "confirmPassword",
              type: "password",
              value: ResetPassword.confirmPassword,
              oninput: (e) => ResetPassword.confirmPassword = e.target.value
            }),
            (0, import_mithril7.default)("button", {
              type: "submit",
              disabled: ResetPassword.loading,
              "aria-busy": ResetPassword.loading ? "true" : false
            }, t2.submit)
          ])
        ])
      ]);
    }
  };
  var ResetPassword_default = ResetPassword;

  // src/index.js
  import_mithril8.default.route.prefix = "";
  import_mithril8.default.route(document.getElementById("app"), "/", {
    "/": LandingPage_default,
    "/signup": SignupForm_default,
    "/login": LoginForm_default,
    "/profile": ProfilePage_default,
    "/change-password": ChangePasswordForm_default,
    "/forgot-password": ForgotPasswordForm_default,
    "/reset": ResetPassword_default
  });
})();
