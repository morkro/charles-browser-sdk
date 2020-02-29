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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var errors_1 = require("../../errors");
var event_1 = require("./event");
var Feed = /** @class */ (function (_super) {
    __extends(Feed, _super);
    function Feed(options) {
        var _this = _super.call(this) || this;
        _this.eventsMap = new Map();
        _this.universe = options.universe;
        _this.http = options.http;
        _this.options = options;
        _this.initialized = options.initialized || false;
        if (options && options.rawPayload) {
            _this.deserialize(options.rawPayload);
        }
        return _this;
    }
    Feed.prototype.deserialize = function (rawPayload) {
        this.id = rawPayload.id;
        this.participants = rawPayload.participants;
        this.agents = rawPayload.agents;
        this.parents = rawPayload.parents;
        this.createdAt = rawPayload.created_at ? new Date(rawPayload.created_at) : undefined;
        this.updatedAt = rawPayload.updated_at ? new Date(rawPayload.updated_at) : undefined;
        this.deleted = rawPayload.deleted;
        this.active = rawPayload.active;
        return this;
    };
    Feed.create = function (payload, universe, http) {
        return new Feed({ rawPayload: payload, universe: universe, http: http, initialized: true });
    };
    Feed.createUninitialized = function (payload, universe, http) {
        return new Feed({ rawPayload: payload, universe: universe, http: http, initialized: false });
    };
    Feed.prototype.serialize = function () {
        return {
            id: this.id,
            participants: this.participants,
            agents: this.agents,
            parents: this.parents,
            created_at: this.createdAt ? this.createdAt.toISOString() : undefined,
            updated_at: this.updatedAt ? this.updatedAt.toISOString() : undefined,
            deleted: this.deleted,
            active: this.active
        };
    };
    Feed.prototype.reply = function (contentOptions) {
        return new FeedReply(__assign({ feed: this, http: this.http, universe: this.universe, rawPayload: __assign({}, contentOptions) }, contentOptions));
    };
    Feed.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.fetch()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this];
                    case 2:
                        err_1 = _a.sent();
                        throw this.handleError(new FeedInitializationError(undefined, { error: err_1 }));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Feed.prototype.fetch = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.http.getClient().get(this.universe.universeBase + "/" + Feed.endpoint + "/" + this.id)];
                    case 1:
                        res = _a.sent();
                        this.deserialize(res.data.data[0]);
                        return [2 /*return*/, this];
                    case 2:
                        err_2 = _a.sent();
                        throw this.handleError(new FeedFetchRemoteError(undefined, { error: err_2 }));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Feed.prototype.fetchLatestEvents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, events, err_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.http.getClient().get(this.universe.universeBase + "/" + Feed.endpoint + "/" + this.id + "/events/latest")];
                    case 1:
                        res = _a.sent();
                        events = res.data.data;
                        events.forEach(function (eventRaw) {
                            var e = event_1.Event.create(eventRaw, _this, _this.universe, _this.http);
                            _this.eventsMap.set(e.id, e);
                        });
                        return [2 /*return*/, Array.from(this.eventsMap.values())];
                    case 2:
                        err_3 = _a.sent();
                        throw this.handleError(new FeedFetchLatestEventsRemoteError(undefined, { error: err_3 }));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Feed.prototype.fetchEvents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, events, err_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.http.getClient().get(this.universe.universeBase + "/" + Feed.endpoint + "/" + this.id + "/events")];
                    case 1:
                        res = _a.sent();
                        events = res.data.data;
                        events.forEach(function (eventRaw) {
                            var e = event_1.Event.create(eventRaw, _this, _this.universe, _this.http);
                            _this.eventsMap.set(e.id, e);
                        });
                        return [2 /*return*/, Array.from(this.eventsMap.values())];
                    case 2:
                        err_4 = _a.sent();
                        throw this.handleError(new FeedFetchEventsRemoteError(undefined, { error: err_4 }));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Feed.prototype.events = function () {
        return Array.from(this.eventsMap.values());
    };
    Feed.prototype.getEventsMap = function () {
        return this.eventsMap;
    };
    Feed.prototype.handleError = function (err) {
        if (this.listeners('error').length > 0)
            this.emit('error', err);
        return err;
    };
    Feed.endpoint = 'api/v0/feeds';
    return Feed;
}(events_1.EventEmitter));
exports.Feed = Feed;
var FeedReply = /** @class */ (function () {
    function FeedReply(options) {
        this.feed = options.feed;
        this.universe = options.universe;
        this.http = options.http;
    }
    FeedReply.prototype.send = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var res, err_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, ((_a = this.http) === null || _a === void 0 ? void 0 : _a.getClient().post("" + this.universe.universeBase + this.feed.id, {
                                content: this.content
                            }))];
                    case 1:
                        res = _b.sent();
                        return [2 /*return*/, res.data.data[0]];
                    case 2:
                        err_5 = _b.sent();
                        throw new FeedReplyError(undefined, { error: err_5 });
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return FeedReply;
}());
exports.FeedReply = FeedReply;
var FeedReplyError = /** @class */ (function (_super) {
    __extends(FeedReplyError, _super);
    function FeedReplyError(message, properties) {
        if (message === void 0) { message = 'Could not send feed reply unexpectedly.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'FeedReplyError';
        return _this;
    }
    return FeedReplyError;
}(errors_1.BaseError));
exports.FeedReplyError = FeedReplyError;
var FeedInitializationError = /** @class */ (function (_super) {
    __extends(FeedInitializationError, _super);
    function FeedInitializationError(message, properties) {
        if (message === void 0) { message = 'Could not initialize feed.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'FeedInitializationError';
        return _this;
    }
    return FeedInitializationError;
}(errors_1.BaseError));
exports.FeedInitializationError = FeedInitializationError;
var FeedFetchRemoteError = /** @class */ (function (_super) {
    __extends(FeedFetchRemoteError, _super);
    function FeedFetchRemoteError(message, properties) {
        if (message === void 0) { message = 'Could not get feed.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'FeedFetchRemoteError';
        return _this;
    }
    return FeedFetchRemoteError;
}(errors_1.BaseError));
exports.FeedFetchRemoteError = FeedFetchRemoteError;
var FeedFetchLatestEventsRemoteError = /** @class */ (function (_super) {
    __extends(FeedFetchLatestEventsRemoteError, _super);
    function FeedFetchLatestEventsRemoteError(message, properties) {
        if (message === void 0) { message = 'Could not get latest feed events.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'FeedFetchLatestEventsRemoteError';
        return _this;
    }
    return FeedFetchLatestEventsRemoteError;
}(errors_1.BaseError));
exports.FeedFetchLatestEventsRemoteError = FeedFetchLatestEventsRemoteError;
var FeedFetchEventsRemoteError = /** @class */ (function (_super) {
    __extends(FeedFetchEventsRemoteError, _super);
    function FeedFetchEventsRemoteError(message, properties) {
        if (message === void 0) { message = 'Could not get feed events.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'FeedFetchEventsRemoteError';
        return _this;
    }
    return FeedFetchEventsRemoteError;
}(errors_1.BaseError));
exports.FeedFetchEventsRemoteError = FeedFetchEventsRemoteError;
//# sourceMappingURL=feed.js.map