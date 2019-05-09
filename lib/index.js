"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-underscore-dangle */
var react_1 = __importDefault(require("react"));
// @ts-ignore
var dom_to_react_1 = __importDefault(require("dom-to-react"));
var utils_1 = require("./utils");
exports.STATUS = {
    FAILED: 'failed',
    LOADED: 'loaded',
    LOADING: 'loading',
    PENDING: 'pending',
    READY: 'ready',
    UNSUPPORTED: 'unsupported',
};
exports.storage = [];
var InlineSVG = /** @class */ (function (_super) {
    __extends(InlineSVG, _super);
    function InlineSVG(props) {
        var _this = _super.call(this, props) || this;
        _this.handleLoad = function (content) {
            /* istanbul ignore else */
            if (_this.isMounted) {
                _this.setState({
                    content: content,
                    status: exports.STATUS.LOADED,
                }, _this.generateElement);
            }
        };
        _this.handleError = function (error) {
            var onError = _this.props.onError;
            var status = error.message === 'Browser does not support SVG' ? exports.STATUS.UNSUPPORTED : exports.STATUS.FAILED;
            if (process.env.NODE_ENV === 'development') {
                console.error(error); // tslint:disable-line:no-console
            }
            /* istanbul ignore else */
            if (_this.isMounted) {
                _this.setState({ status: status }, function () {
                    /* istanbul ignore else */
                    if (typeof onError === 'function') {
                        onError(error);
                    }
                });
            }
        };
        _this.request = function () {
            var _a = _this.props, cacheRequests = _a.cacheRequests, src = _a.src;
            if (cacheRequests) {
                exports.storage.push({ url: src, content: '', loading: true, queue: [] });
            }
            try {
                return fetch(src)
                    .then(function (response) {
                    if (response.status > 299) {
                        throw new utils_1.InlineSVGError('Not Found');
                    }
                    return response.text();
                })
                    .then(function (content) {
                    /* istanbul ignore else */
                    if (cacheRequests) {
                        var cachedItem = exports.storage.find(function (d) { return d.url === src; });
                        if (cachedItem) {
                            cachedItem.content = content;
                            cachedItem.loading = false;
                            cachedItem.queue.forEach(function (cb) { return cb(content); });
                        }
                    }
                    _this.handleLoad(content);
                })
                    .catch(function (error) { return _this.handleError(error); });
            }
            catch (error) {
                _this.handleError(new utils_1.InlineSVGError(error.message));
            }
        };
        _this.state = {
            content: '',
            element: null,
            hasCache: !!props.cacheRequests && !!exports.storage.find(function (s) { return s.url === props.src; }),
            status: exports.STATUS.PENDING,
        };
        _this._isMounted = false;
        return _this;
    }
    InlineSVG.prototype.componentDidMount = function () {
        this.isMounted = true;
        if (!utils_1.canUseDOM()) {
            this.handleError(new utils_1.InlineSVGError('No DOM'));
            return;
        }
        var status = this.state.status;
        var src = this.props.src;
        try {
            /* istanbul ignore else */
            if (status === exports.STATUS.PENDING) {
                /* istanbul ignore else */
                if (!utils_1.isSupportedEnvironment()) {
                    throw new utils_1.InlineSVGError('Browser does not support SVG');
                }
                /* istanbul ignore else */
                if (!src) {
                    throw new utils_1.InlineSVGError('Missing src');
                }
                this.load();
            }
        }
        catch (error) {
            this.handleError(error);
        }
    };
    InlineSVG.prototype.componentDidUpdate = function (prevProps, prevState) {
        if (!utils_1.canUseDOM()) {
            return;
        }
        var _a = this.state, hasCache = _a.hasCache, status = _a.status;
        var _b = this.props, onLoad = _b.onLoad, src = _b.src;
        if (prevState.status !== exports.STATUS.READY && status === exports.STATUS.READY) {
            /* istanbul ignore else */
            if (onLoad) {
                onLoad(src, hasCache);
            }
        }
        if (prevProps.src !== src) {
            if (!src) {
                this.handleError(new utils_1.InlineSVGError('Missing src'));
                return;
            }
            this.load();
        }
    };
    InlineSVG.prototype.componentWillUnmount = function () {
        this._isMounted = false;
    };
    Object.defineProperty(InlineSVG.prototype, "isMounted", {
        get: function () {
            return this._isMounted;
        },
        set: function (value) {
            this._isMounted = value;
        },
        enumerable: true,
        configurable: true
    });
    InlineSVG.prototype.parseSVG = function () {
        var content = this.state.content;
        var preProcessor = this.props.preProcessor;
        if (preProcessor) {
            return preProcessor(content);
        }
        return content;
    };
    InlineSVG.prototype.updateSVGAttributes = function (node) {
        var _this = this;
        var _a = this.props, _b = _a.baseURL, baseURL = _b === void 0 ? '' : _b, uniquifyIDs = _a.uniquifyIDs, uniqueHash = _a.uniqueHash;
        var replaceableAttributes = ['id', 'href', 'xlink:href', 'xlink:role', 'xlink:arcrole'];
        if (!uniquifyIDs) {
            return node;
        }
        var hash = uniqueHash || utils_1.randomString();
        __spread(node.children).map(function (d) {
            if (d.attributes && d.attributes.length) {
                var attributes_1 = Object.values(d.attributes);
                attributes_1.forEach(function (a) {
                    var match = a.value.match(/^url\((#[^)]+)/);
                    if (match && match[1]) {
                        a.value = "url(" + baseURL + match[1] + "__" + hash + ")";
                    }
                });
                replaceableAttributes.forEach(function (r) {
                    var attribute = attributes_1.find(function (a) { return a.name === r; });
                    if (attribute) {
                        attribute.value = attribute.value + "__" + hash;
                    }
                });
            }
            if (d.children.length) {
                d = _this.updateSVGAttributes(d);
            }
            return d;
        });
        return node;
    };
    InlineSVG.prototype.generateNode = function () {
        var _a = this.props, description = _a.description, title = _a.title;
        try {
            var svgText = this.parseSVG();
            var parser = new DOMParser();
            var doc = parser.parseFromString(svgText, 'image/svg+xml');
            var svg = doc.querySelector('svg');
            if (!svg) {
                throw new utils_1.InlineSVGError('Could not parse the SVG code');
            }
            svg = this.updateSVGAttributes(svg);
            if (description) {
                var originalDesc = svg.querySelector('desc');
                if (originalDesc && originalDesc.parentNode) {
                    originalDesc.parentNode.removeChild(originalDesc);
                }
                var descElement = document.createElement('desc');
                descElement.innerHTML = description;
                svg.prepend(descElement);
            }
            if (title) {
                var originalTitle = svg.querySelector('title');
                if (originalTitle && originalTitle.parentNode) {
                    originalTitle.parentNode.removeChild(originalTitle);
                }
                var titleElement = document.createElement('title');
                titleElement.innerHTML = title;
                svg.prepend(titleElement);
            }
            return svg;
        }
        catch (error) {
            return this.handleError(error);
        }
    };
    InlineSVG.prototype.generateElement = function () {
        var _a = this.props, baseURL = _a.baseURL, cacheRequests = _a.cacheRequests, children = _a.children, description = _a.description, onError = _a.onError, onLoad = _a.onLoad, loader = _a.loader, preProcessor = _a.preProcessor, src = _a.src, title = _a.title, uniqueHash = _a.uniqueHash, uniquifyIDs = _a.uniquifyIDs, rest = __rest(_a, ["baseURL", "cacheRequests", "children", "description", "onError", "onLoad", "loader", "preProcessor", "src", "title", "uniqueHash", "uniquifyIDs"]);
        try {
            var node = this.generateNode();
            /* istanbul ignore else */
            if (node) {
                var d2r = new dom_to_react_1.default();
                this.setState({
                    element: react_1.default.cloneElement(d2r.prepareNode(node), __assign({}, rest)),
                    status: exports.STATUS.READY,
                });
            }
        }
        catch (error) {
            this.handleError(error);
        }
    };
    InlineSVG.prototype.load = function () {
        var _this = this;
        /* istanbul ignore else */
        if (this.isMounted) {
            this.setState({
                content: '',
                element: null,
                status: exports.STATUS.LOADING,
            }, function () {
                var _a = _this.props, cacheRequests = _a.cacheRequests, src = _a.src;
                var cache = cacheRequests && exports.storage.find(function (d) { return d.url === src; });
                if (cache) {
                    if (cache.loading) {
                        cache.queue.push(_this.handleLoad);
                    }
                    else {
                        _this.handleLoad(cache.content);
                    }
                    return;
                }
                var dataURI = src.match(/data:image\/svg[^,]*?(;base64)?,(.*)/);
                var inlineSrc;
                if (dataURI) {
                    inlineSrc = dataURI[1] ? atob(dataURI[2]) : decodeURIComponent(dataURI[2]);
                }
                else if (src.indexOf('<svg') >= 0) {
                    inlineSrc = src;
                }
                if (inlineSrc) {
                    _this.handleLoad(inlineSrc);
                    return;
                }
                _this.request();
            });
        }
    };
    InlineSVG.prototype.render = function () {
        if (!utils_1.canUseDOM()) {
            return null;
        }
        var _a = this.state, element = _a.element, status = _a.status;
        var _b = this.props, _c = _b.children, children = _c === void 0 ? null : _c, _d = _b.loader, loader = _d === void 0 ? null : _d;
        if (element) {
            return element;
        }
        if ([exports.STATUS.UNSUPPORTED, exports.STATUS.FAILED].indexOf(status) > -1) {
            return children;
        }
        return loader;
    };
    InlineSVG.defaultProps = {
        cacheRequests: true,
        uniquifyIDs: false,
    };
    return InlineSVG;
}(react_1.default.PureComponent));
exports.default = InlineSVG;
