"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhonenumberApplyPatchRemoteError = exports.PhonenumberPatchRemoteError = exports.PhonenumberCreateRemoteError = exports.PhonenumbersFetchRemoteError = exports.DealCreateRemoteError = exports.DealsFetchRemoteError = exports.PersonPreviewNotificationError = exports.PersonEmailDeleteError = exports.PersonEmailApplyPatchError = exports.PersonEmailPostRemoteError = exports.PeopleExportRemoteError = exports.PersonGDPRGetRemoteError = exports.PersonMergeRemoteError = exports.AddressPatchRemoteError = exports.AddressCreateRemoteError = exports.AddressFetchRemoteError = exports.PeopleFetchCountRemoteError = exports.PeopleFetchRemoteError = exports.PersonFetchRemoteError = exports.PersonInitializationError = exports.PersonFetchOrdersRemoteError = exports.PersonDeleteRemoteError = exports.Phonenumber = exports.Address = exports.People = exports.Person = void 0;
var tslib_1 = require("tslib");
var _base_1 = require("../_base");
var errors_1 = require("../../errors");
var order_1 = require("../../entities/order/order");
var channel_user_1 = require("./channel-user");
var analytics_1 = require("./analytics");
var email_1 = require("./email");
var cart_1 = require("../cart/cart");
var just_omit_1 = tslib_1.__importDefault(require("just-omit"));
var qs_1 = tslib_1.__importDefault(require("qs"));
var deal_1 = require("../deal/deal");
var event_1 = require("../../eventing/feeds/event");
var feed_1 = require("../../eventing/feeds/feed");
var topics_1 = tslib_1.__importDefault(require("../../universe/topics"));
var realtime = tslib_1.__importStar(require("../../realtime"));
var AddressArray = (function (_super) {
    tslib_1.__extends(AddressArray, _super);
    function AddressArray(items, universe, http, person) {
        var _this = _super.apply(this, items) || this;
        _this.universe = universe;
        _this.apiCarrier = universe;
        _this.http = http;
        _this.person = person;
        Object.setPrototypeOf(_this, AddressArray.prototype);
        return _this;
    }
    AddressArray.prototype.fromJson = function (payloads) {
        var _this = this;
        return payloads.map(function (item) { return Address.create(item, _this.universe, _this.http); });
    };
    AddressArray.prototype.toJson = function (items) {
        return items.map(function (item) { return item.serialize(); });
    };
    AddressArray.prototype.fetch = function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var opts, res, resources, err_1;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        opts = {
                            method: 'GET',
                            url: this.universe.universeBase + "/" + People.endpoint + "/" + this.person.id + "/addresses",
                            params: tslib_1.__assign({}, ((options === null || options === void 0 ? void 0 : options.query) ? options.query : {}))
                        };
                        return [4, this.http.getClient()(opts)];
                    case 1:
                        res = _a.sent();
                        resources = res.data.data;
                        if (options && options.raw === true) {
                            return [2, resources];
                        }
                        return [2, resources.map(function (item) {
                                return Address.create(item, _this.universe, _this.http);
                            })];
                    case 2:
                        err_1 = _a.sent();
                        throw new AddressFetchRemoteError(undefined, { error: err_1 });
                    case 3: return [2];
                }
            });
        });
    };
    AddressArray.prototype.create = function (payload) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var opts, res, resources, err_2;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        opts = {
                            method: 'POST',
                            url: this.universe.universeBase + "/" + People.endpoint + "/" + this.person.id + "/addresses",
                            data: payload
                        };
                        return [4, this.http.getClient()(opts)];
                    case 1:
                        res = _a.sent();
                        resources = res.data.data;
                        return [2, resources.map(function (item) {
                                return Address.create(item, _this.universe, _this.http);
                            })[0]];
                    case 2:
                        err_2 = _a.sent();
                        throw new AddressCreateRemoteError(undefined, { error: err_2 });
                    case 3: return [2];
                }
            });
        });
    };
    return AddressArray;
}(Array));
var Person = (function (_super) {
    tslib_1.__extends(Person, _super);
    function Person(options) {
        var _a;
        var _this = _super.call(this) || this;
        _this.universe = options.universe;
        _this.apiCarrier = options.universe;
        _this.endpoint = 'api/v0/people';
        _this.http = options.http;
        _this.options = options;
        _this.initialized = (_a = options.initialized) !== null && _a !== void 0 ? _a : false;
        if (options === null || options === void 0 ? void 0 : options.rawPayload) {
            _this.deserialize(options.rawPayload);
        }
        if (options === null || options === void 0 ? void 0 : options.mqtt) {
            _this.mqtt = options === null || options === void 0 ? void 0 : options.mqtt;
        }
        return _this;
    }
    Person.prototype.deserialize = function (rawPayload) {
        var _this = this;
        var _a, _b;
        this.setRawPayload(rawPayload);
        this.id = rawPayload.id;
        this.createdAt = rawPayload.created_at ? new Date(rawPayload.created_at) : undefined;
        this.updatedAt = rawPayload.updated_at ? new Date(rawPayload.updated_at) : undefined;
        this.deleted = (_a = rawPayload.deleted) !== null && _a !== void 0 ? _a : false;
        this.active = (_b = rawPayload.active) !== null && _b !== void 0 ? _b : true;
        this.firstName = rawPayload.first_name;
        this.middleName = rawPayload.middle_name;
        this.lastName = rawPayload.last_name;
        this.name = rawPayload.name;
        this.nickname = rawPayload.nickname;
        this.avatar = rawPayload.avatar;
        this.dateOfBirth = rawPayload.date_of_birth;
        this.gender = rawPayload.gender;
        this.comment = rawPayload.comment;
        this.measurements = rawPayload.measurements;
        this.tags = rawPayload.tags;
        this.namePreference = rawPayload.name_preference;
        this.customProperties = rawPayload.custom_properties;
        this.defaultAddress = rawPayload.default_address;
        this.languagePreference = rawPayload.language_preference;
        if (rawPayload.analytics && this.initialized) {
            this.analytics = analytics_1.Analytics.create(rawPayload.analytics, this.universe, this.http);
        }
        else if (rawPayload.analytics && !this.initialized) {
            this.analytics = analytics_1.Analytics.createUninitialized(rawPayload.analytics, this.universe, this.http);
        }
        else if (!this.analytics) {
            this.analytics = undefined;
        }
        if (rawPayload.emails && this.initialized) {
            this.emails = rawPayload.emails.map(function (i) { return email_1.Email.create(i, _this.universe, _this.http); });
        }
        else if (rawPayload.emails && !this.initialized) {
            this.emails = rawPayload.emails.map(function (i) {
                return email_1.Email.createUninitialized(i, _this.universe, _this.http);
            });
        }
        else if (!this.emails) {
            this.emails = undefined;
        }
        if (rawPayload.addresses && this.initialized) {
            this._addresses = rawPayload.addresses.map(function (i) { return Address.create(i, _this.universe, _this.http); });
        }
        else if (rawPayload.addresses && !this.initialized) {
            this._addresses = rawPayload.addresses.map(function (i) {
                return Address.createUninitialized(i, _this.universe, _this.http);
            });
        }
        else if (!this._addresses) {
            this._addresses = undefined;
        }
        if (rawPayload.phonenumbers && this.initialized) {
            this._phonenumbers = rawPayload.phonenumbers.map(function (i) {
                return Phonenumber.create(i, _this.universe, _this.http);
            });
        }
        else if (rawPayload.phonenumbers && !this.initialized) {
            this._phonenumbers = rawPayload.phonenumbers.map(function (i) {
                return Phonenumber.createUninitialized(i, _this.universe, _this.http);
            });
        }
        else if (!this._phonenumbers) {
            this._phonenumbers = undefined;
        }
        if (rawPayload.channel_users && this.initialized) {
            this.channelUsers = rawPayload.channel_users.map(function (i) {
                return channel_user_1.ChannelUser.create(i, _this.universe, _this.http);
            });
        }
        else if (rawPayload.channel_users && !this.initialized) {
            this.channelUsers = rawPayload.channel_users.map(function (i) {
                return channel_user_1.ChannelUser.createUninitialized(i, _this.universe, _this.http);
            });
        }
        else if (!this.channelUsers) {
            this.channelUsers = undefined;
        }
        return this;
    };
    Person.create = function (payload, universe, http, mqtt) {
        return new Person({ rawPayload: payload, universe: universe, http: http, initialized: true, mqtt: mqtt });
    };
    Person.prototype.serialize = function () {
        var _a, _b;
        return {
            id: this.id,
            created_at: this.createdAt ? this.createdAt.toISOString() : undefined,
            updated_at: this.updatedAt ? this.updatedAt.toISOString() : undefined,
            deleted: (_a = this.deleted) !== null && _a !== void 0 ? _a : false,
            active: (_b = this.active) !== null && _b !== void 0 ? _b : true,
            first_name: this.firstName,
            middle_name: this.middleName,
            last_name: this.lastName,
            name: this.name,
            nickname: this.nickname,
            avatar: this.avatar,
            date_of_birth: this.dateOfBirth,
            gender: this.gender,
            comment: this.comment,
            measurements: this.measurements,
            tags: this.tags,
            name_preference: this.namePreference,
            custom_properties: this.customProperties,
            default_address: this.defaultAddress,
            language_preference: this.languagePreference,
            analytics: this.analytics ? this.analytics.serialize() : undefined,
            emails: Array.isArray(this.emails) ? this.emails.map(function (item) { return item.serialize(); }) : undefined,
            addresses: Array.isArray(this._addresses)
                ? this._addresses.map(function (item) { return item.serialize(); })
                : undefined,
            phonenumbers: Array.isArray(this._phonenumbers)
                ? this._phonenumbers.map(function (item) { return item.serialize(); })
                : undefined,
            channel_users: Array.isArray(this.channelUsers)
                ? this.channelUsers.map(function (item) { return item.serialize(); })
                : undefined
        };
    };
    Person.prototype.init = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var err_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.fetch({
                                query: {
                                    embed: ['channel_users', 'phonenumbers', 'addresses', 'emails', 'analytics']
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [2, this];
                    case 2:
                        err_3 = _a.sent();
                        throw this.handleError(new PersonInitializationError(undefined, { error: err_3 }));
                    case 3: return [2];
                }
            });
        });
    };
    Person.prototype.setupDefaultMessageListeners = function () {
        var _this = this;
        var _a;
        (_a = this.mqtt) === null || _a === void 0 ? void 0 : _a.on('message', function (msg) {
            _this.handleMessage(msg);
        });
        this.subscribeDefaults();
        return this;
    };
    Object.defineProperty(Person.prototype, "defaultSubscriptions", {
        get: function () {
            return [
                topics_1.default.api.personChange.generateTopic(this)
            ];
        },
        enumerable: false,
        configurable: true
    });
    Person.prototype.subscribeDefaults = function () {
        this.subscribe(this.defaultSubscriptions);
    };
    Person.prototype.unsubscribeDefaults = function () {
        this.unsubscribe(this.defaultSubscriptions);
    };
    Person.prototype.subscribe = function (topic) {
        this.getMqttClient()
            .subscribe(topic);
        return this;
    };
    Person.prototype.unsubscribe = function (topic) {
        this.getMqttClient()
            .unsubscribe(topic);
        return this;
    };
    Person.prototype.getMqttClient = function () {
        if (this.mqtt)
            return this.mqtt;
        throw new realtime.UninstantiatedRealtimeClient();
    };
    Person.prototype.handleMessage = function (msg) {
        if (topics_1.default.api.personChange.isTopic(msg.topic, this.serialize())) {
            var person = void 0;
            if (msg.payload.person) {
                person = Person.create(msg.payload.person, this.universe, this.http, this.mqtt);
            }
            this.emit('person:change', tslib_1.__assign(tslib_1.__assign({}, msg), { person: person }));
        }
    };
    Person.prototype.patch = function (changePart) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, _super.prototype.patch.call(this, just_omit_1.default(changePart, ['emails', 'phonenumbers', 'addresses', 'channel_users', 'analytics']))];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Person.prototype.delete = function (options) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var opts, err_4;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.id === null || this.id === undefined)
                            throw new TypeError('delete requires id to be set.');
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        opts = {
                            method: 'DELETE',
                            url: ((_a = this.universe) === null || _a === void 0 ? void 0 : _a.universeBase) + "/" + this.endpoint + "/" + this.id + ((options === null || options === void 0 ? void 0 : options.query) ? qs_1.default.stringify(options.query, { addQueryPrefix: true }) : ''),
                            headers: {
                                'Content-Type': 'application/json; charset=utf-8'
                            },
                            data: undefined,
                            responseType: 'json'
                        };
                        return [4, ((_b = this.http) === null || _b === void 0 ? void 0 : _b.getClient()(opts))];
                    case 2:
                        _c.sent();
                        return [2, this];
                    case 3:
                        err_4 = _c.sent();
                        throw new PersonDeleteRemoteError(undefined, { error: err_4 });
                    case 4: return [2];
                }
            });
        });
    };
    Person.prototype.merge = function (mergeables) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var opts, res, person, err_5;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.id === null || this.id === undefined)
                            throw new TypeError('Merge requires id to be set.');
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        opts = {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json; charset=utf-8'
                            },
                            url: ((_a = this.universe) === null || _a === void 0 ? void 0 : _a.universeBase) + "/" + this.endpoint + "/" + this.id + "/merge",
                            data: { mergeables: mergeables },
                            responseType: 'json'
                        };
                        return [4, ((_b = this.http) === null || _b === void 0 ? void 0 : _b.getClient()(opts))];
                    case 2:
                        res = _c.sent();
                        person = res.data.data[0];
                        return [2, Person.create(person, this.universe, this.http)];
                    case 3:
                        err_5 = _c.sent();
                        throw new PersonMergeRemoteError(undefined, { error: err_5 });
                    case 4: return [2];
                }
            });
        });
    };
    Person.prototype.getGDPRFile = function (options) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var opts, res, err_6;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.id === null || this.id === undefined)
                            throw new TypeError('GDPR download requires id to be set.');
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        opts = {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json; charset=utf-8'
                            },
                            url: ((_a = this.universe) === null || _a === void 0 ? void 0 : _a.universeBase) + "/" + this.endpoint + "/" + this.id + "/gdpr" + (options ? qs_1.default.stringify(options, { addQueryPrefix: true }) : ''),
                            responseType: 'json'
                        };
                        return [4, ((_b = this.http) === null || _b === void 0 ? void 0 : _b.getClient()(opts))];
                    case 2:
                        res = _c.sent();
                        return [2, res.data.data[0]];
                    case 3:
                        err_6 = _c.sent();
                        throw new PersonGDPRGetRemoteError(undefined, { error: err_6 });
                    case 4: return [2];
                }
            });
        });
    };
    Person.prototype.orders = function (options) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var opts, res, orders, ordersMap_1, err_7;
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        opts = {
                            method: 'GET',
                            url: this.universe.universeBase + "/" + this.endpoint + "/" + this.id + "/orders",
                            headers: {
                                'Content-Type': 'application/json; charset=utf-8'
                            },
                            params: tslib_1.__assign({}, ((options === null || options === void 0 ? void 0 : options.query) ? options.query : {})),
                            responseType: 'json'
                        };
                        return [4, ((_a = this.http) === null || _a === void 0 ? void 0 : _a.getClient()(opts))];
                    case 1:
                        res = _b.sent();
                        orders = res.data.data;
                        if (options && options.raw === true) {
                            return [2, orders];
                        }
                        ordersMap_1 = new Map();
                        orders.forEach(function (orderRaw) {
                            var o = order_1.Order.create(orderRaw, _this.universe, _this.http);
                            ordersMap_1.set(o.id, o);
                        });
                        return [2, Array.from(ordersMap_1.values())];
                    case 2:
                        err_7 = _b.sent();
                        throw this.handleError(new PersonFetchOrdersRemoteError(undefined, { error: err_7 }));
                    case 3: return [2];
                }
            });
        });
    };
    Object.defineProperty(Person.prototype, "carts", {
        get: function () {
            var _this = this;
            return {
                fromJson: function (payloads) {
                    return payloads.map(function (item) { return cart_1.Cart.create(item, _this.universe, _this.http); });
                },
                toJson: function (payloads) {
                    return payloads.map(function (item) { return item.serialize(); });
                },
                fetch: function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var opts, res, carts, err_8;
                    var _this = this;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                opts = {
                                    method: 'GET',
                                    url: this.universe.universeBase + "/" + People.endpoint + "/" + this.id + "/carts",
                                    params: tslib_1.__assign({}, ((options === null || options === void 0 ? void 0 : options.query) ? options.query : {}))
                                };
                                return [4, this.http.getClient()(opts)];
                            case 1:
                                res = _a.sent();
                                carts = res.data.data;
                                if (options && options.raw === true) {
                                    return [2, carts];
                                }
                                return [2, carts.map(function (cart) {
                                        return cart_1.Cart.create(cart, _this.universe, _this.http);
                                    })];
                            case 2:
                                err_8 = _a.sent();
                                throw new cart_1.CartsFetchRemoteError(undefined, { error: err_8 });
                            case 3: return [2];
                        }
                    });
                }); },
                create: function (cart) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var opts, res, carts, err_9;
                    var _this = this;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                opts = {
                                    method: 'POST',
                                    url: this.universe.universeBase + "/" + People.endpoint + "/" + this.id + "/carts",
                                    data: cart
                                };
                                return [4, this.http.getClient()(opts)];
                            case 1:
                                res = _a.sent();
                                carts = res.data.data;
                                return [2, carts.map(function (cart) {
                                        return cart_1.Cart.create(cart, _this.universe, _this.http);
                                    })[0]];
                            case 2:
                                err_9 = _a.sent();
                                throw new cart_1.CartCreateRemoteError(undefined, { error: err_9 });
                            case 3: return [2];
                        }
                    });
                }); }
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "deals", {
        get: function () {
            var _this = this;
            return {
                fromJson: function (payloads) {
                    return payloads.map(function (item) { return deal_1.Deal.create(item, _this.universe, _this.http); });
                },
                toJson: function (payloads) {
                    return payloads.map(function (item) { return item.serialize(); });
                },
                fetch: function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var opts, res, deals, err_10;
                    var _this = this;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                opts = {
                                    method: 'GET',
                                    url: this.universe.universeBase + "/" + People.endpoint + "/" + this.id + "/deals",
                                    params: tslib_1.__assign({}, ((options === null || options === void 0 ? void 0 : options.query) ? options.query : {}))
                                };
                                return [4, this.http.getClient()(opts)];
                            case 1:
                                res = _a.sent();
                                deals = res.data.data;
                                if (options && options.raw === true) {
                                    return [2, deals];
                                }
                                return [2, deals.map(function (deal) {
                                        return deal_1.Deal.create(deal, _this.universe, _this.http);
                                    })];
                            case 2:
                                err_10 = _a.sent();
                                throw new DealsFetchRemoteError(undefined, { error: err_10 });
                            case 3: return [2];
                        }
                    });
                }); },
                create: function (deal) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var opts, res, deals, err_11;
                    var _this = this;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                opts = {
                                    method: 'POST',
                                    url: this.universe.universeBase + "/" + People.endpoint + "/" + this.id + "/deals",
                                    data: deal
                                };
                                return [4, this.http.getClient()(opts)];
                            case 1:
                                res = _a.sent();
                                deals = res.data.data;
                                return [2, deals.map(function (deal) {
                                        return deal_1.Deal.create(deal, _this.universe, _this.http);
                                    })[0]];
                            case 2:
                                err_11 = _a.sent();
                                throw new DealCreateRemoteError(undefined, { error: err_11 });
                            case 3: return [2];
                        }
                    });
                }); }
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "addresses", {
        get: function () {
            var _a;
            var ret = new AddressArray((_a = this._addresses) !== null && _a !== void 0 ? _a : [], this.universe, this.http, this);
            return ret;
        },
        set: function (items) {
            this._addresses = items.map(function (item) { return (item); });
        },
        enumerable: false,
        configurable: true
    });
    Person.prototype.getEmails = function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var opts, res, emails, err_12;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        opts = {
                            method: 'GET',
                            url: this.universe.universeBase + "/" + People.endpoint + "/" + this.id + "/emails",
                            params: tslib_1.__assign({}, ((options === null || options === void 0 ? void 0 : options.query) ? options.query : {}))
                        };
                        return [4, this.http.getClient()(opts)];
                    case 1:
                        res = _a.sent();
                        emails = res.data.data;
                        if (options && options.raw === true) {
                            return [2, emails];
                        }
                        return [2, emails.map(function (email) {
                                return email_1.Email.create(email, _this.universe, _this.http);
                            })];
                    case 2:
                        err_12 = _a.sent();
                        throw new email_1.EmailsFetchRemoteError(undefined, { error: err_12 });
                    case 3: return [2];
                }
            });
        });
    };
    Person.prototype.email = function (payload) {
        return email_1.Email.create(tslib_1.__assign(tslib_1.__assign({}, payload), { person: this.id }), this.universe, this.http);
    };
    Person.prototype.phonenumber = function (payload) {
        return Phonenumber.create(tslib_1.__assign(tslib_1.__assign({}, payload), { person: this.id }), this.universe, this.http);
    };
    Person.prototype.address = function (payload) {
        return Address.create(tslib_1.__assign(tslib_1.__assign({}, payload), { person: this.id }), this.universe, this.http);
    };
    Object.defineProperty(Person.prototype, "phonenumbers", {
        get: function () {
            var _this = this;
            return {
                fromJson: function (payloads) {
                    return payloads.map(function (item) { return Phonenumber.create(item, _this.universe, _this.http); });
                },
                toJson: function (payloads) {
                    return payloads.map(function (item) { return item.serialize(); });
                },
                fetch: function (options) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var opts, res, phonenumbers, err_13;
                    var _this = this;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                opts = {
                                    method: 'GET',
                                    url: this.universe.universeBase + "/" + People.endpoint + "/" + this.id + "/phonenumbers",
                                    params: tslib_1.__assign({}, ((options === null || options === void 0 ? void 0 : options.query) ? options.query : {}))
                                };
                                return [4, this.http.getClient()(opts)];
                            case 1:
                                res = _a.sent();
                                phonenumbers = res.data.data;
                                if (options && options.raw === true) {
                                    return [2, phonenumbers];
                                }
                                return [2, phonenumbers.map(function (phonenumber) {
                                        return Phonenumber.create(phonenumber, _this.universe, _this.http);
                                    })];
                            case 2:
                                err_13 = _a.sent();
                                throw new PhonenumbersFetchRemoteError(undefined, { error: err_13 });
                            case 3: return [2];
                        }
                    });
                }); },
                create: function (phonenumber) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var opts, res, phonenumbers, err_14;
                    var _this = this;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                opts = {
                                    method: 'POST',
                                    url: this.universe.universeBase + "/" + People.endpoint + "/" + this.id + "/phonenumbers",
                                    data: phonenumber
                                };
                                return [4, this.http.getClient()(opts)];
                            case 1:
                                res = _a.sent();
                                phonenumbers = res.data.data;
                                return [2, phonenumbers.map(function (phonenumber) {
                                        return Phonenumber.create(phonenumber, _this.universe, _this.http);
                                    })[0]];
                            case 2:
                                err_14 = _a.sent();
                                throw new PhonenumberCreateRemoteError(undefined, { error: err_14 });
                            case 3: return [2];
                        }
                    });
                }); }
            };
        },
        enumerable: false,
        configurable: true
    });
    Person.prototype.previewNotification = function (params, language, parameters, options) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var opts, res, resources, _feed_1, err_15;
            var _this = this;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(this.id && (params === null || params === void 0 ? void 0 : params.messageTemplateId) && (params === null || params === void 0 ? void 0 : params.channelUserId)))
                            throw new TypeError('message template preview setup requires person id, channelUser id and message template id to be set.');
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        opts = {
                            method: 'POST',
                            url: this.universe.universeBase + "/api/v0/people/" + this.id + "/channel_users/" + params.channelUserId + "/notifications/templates/" + params.messageTemplateId + "/preview" + ((options === null || options === void 0 ? void 0 : options.query) ? qs_1.default.stringify(options.query, { addQueryPrefix: true }) : ''),
                            data: {
                                language: language,
                                parameters: parameters
                            }
                        };
                        return [4, ((_a = this.http) === null || _a === void 0 ? void 0 : _a.getClient()(opts))];
                    case 2:
                        res = _c.sent();
                        resources = res.data.data;
                        if (options && options.raw === true) {
                            return [2, resources];
                        }
                        _feed_1 = feed_1.Feed.createUninitialized({ id: (_b = resources === null || resources === void 0 ? void 0 : resources[0]) === null || _b === void 0 ? void 0 : _b.feed }, this.universe, this.http, null);
                        return [2, resources.map(function (item) {
                                return event_1.Event.create(item, _feed_1, _this.universe, _this.http);
                            })];
                    case 3:
                        err_15 = _c.sent();
                        throw new PersonPreviewNotificationError(undefined, { error: err_15 });
                    case 4: return [2];
                }
            });
        });
    };
    return Person;
}(_base_1.UniverseEntity));
exports.Person = Person;
var People = (function (_super) {
    tslib_1.__extends(People, _super);
    function People(options) {
        var _this = _super.call(this) || this;
        _this.endpoint = People.endpoint;
        _this.universe = options.universe;
        _this.apiCarrier = options.universe;
        _this.http = options.http;
        return _this;
    }
    People.prototype.parseItem = function (payload) {
        return Person.create(payload, this.universe, this.http);
    };
    People.prototype.getStream = function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._getStream(options)];
                    case 1: return [2, (_a.sent())];
                }
            });
        });
    };
    People.prototype.exportCsv = function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._exportCsv(options)];
                    case 1: return [2, (_a.sent())];
                }
            });
        });
    };
    People.endpoint = 'api/v0/people';
    return People;
}(_base_1.EntitiesList));
exports.People = People;
var Address = (function (_super) {
    tslib_1.__extends(Address, _super);
    function Address(options) {
        var _a;
        var _this = _super.call(this) || this;
        _this.universe = options.universe;
        _this.apiCarrier = options.universe;
        _this.http = options.http;
        _this.options = options;
        _this.initialized = (_a = options.initialized) !== null && _a !== void 0 ? _a : false;
        _this.endpoint = '';
        if ((options === null || options === void 0 ? void 0 : options.rawPayload) && options.rawPayload.person) {
            _this.endpoint = "api/v0/people/" + options.rawPayload.person + "/addresses";
        }
        if (options === null || options === void 0 ? void 0 : options.rawPayload) {
            _this.deserialize(options.rawPayload);
        }
        return _this;
    }
    Address.prototype.deserialize = function (rawPayload) {
        this.setRawPayload(rawPayload);
        this.id = rawPayload.id;
        this.firstName = rawPayload.first_name;
        this.lastName = rawPayload.last_name;
        this.phone = rawPayload.phone;
        this.person = rawPayload.person;
        this.lines = rawPayload.lines;
        this.company = rawPayload.company;
        this.locality = rawPayload.locality;
        this.country = rawPayload.country;
        this.region = rawPayload.region;
        this.postalCode = rawPayload.postal_code;
        this.type = rawPayload.type;
        this.createdAt = rawPayload.created_at ? new Date(rawPayload.created_at) : undefined;
        this.updatedAt = rawPayload.updated_at ? new Date(rawPayload.updated_at) : undefined;
        this.comment = rawPayload.comment;
        this.deleted = rawPayload.deleted;
        this.active = rawPayload.active;
        return this;
    };
    Address.create = function (payload, universe, http) {
        return new Address({ rawPayload: payload, universe: universe, http: http, initialized: true });
    };
    Address.createUninitialized = function (payload, universe, http) {
        return new Address({ rawPayload: payload, universe: universe, http: http, initialized: false });
    };
    Address.prototype.serialize = function () {
        return {
            id: this.id,
            first_name: this.firstName,
            last_name: this.lastName,
            person: this.person,
            phone: this.phone,
            lines: this.lines,
            company: this.company,
            locality: this.locality,
            country: this.country,
            region: this.region,
            postal_code: this.postalCode,
            type: this.type,
            created_at: this.createdAt ? this.createdAt.toISOString() : undefined,
            updated_at: this.updatedAt ? this.updatedAt.toISOString() : undefined,
            comment: this.comment,
            deleted: this.deleted,
            active: this.active
        };
    };
    Address.prototype.patch = function (changePart) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.person) {
                            throw new AddressPatchRemoteError('Address patch requires person to be set.');
                        }
                        return [4, this._patch(changePart)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Address.prototype.applyPatch = function (patch) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.person) {
                            throw new AddressPatchRemoteError('Address patch requires person to be set.');
                        }
                        return [4, this._applyPatch(patch)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    return Address;
}(_base_1.UniverseEntity));
exports.Address = Address;
var Phonenumber = (function (_super) {
    tslib_1.__extends(Phonenumber, _super);
    function Phonenumber(options) {
        var _a;
        var _this = _super.call(this) || this;
        _this.universe = options.universe;
        _this.apiCarrier = options.universe;
        _this.http = options.http;
        _this.options = options;
        _this.initialized = (_a = options.initialized) !== null && _a !== void 0 ? _a : false;
        _this.endpoint = '';
        if ((options === null || options === void 0 ? void 0 : options.rawPayload) && options.rawPayload.person) {
            _this.endpoint = "api/v0/people/" + options.rawPayload.person + "/phonenumbers";
        }
        if (options === null || options === void 0 ? void 0 : options.rawPayload) {
            _this.deserialize(options.rawPayload);
        }
        return _this;
    }
    Phonenumber.prototype.deserialize = function (rawPayload) {
        this.setRawPayload(rawPayload);
        this.id = rawPayload.id;
        this.createdAt = rawPayload.created_at ? new Date(rawPayload.created_at) : undefined;
        this.updatedAt = rawPayload.updated_at ? new Date(rawPayload.updated_at) : undefined;
        this.deleted = rawPayload.deleted;
        this.active = rawPayload.active;
        this.value = rawPayload.value;
        this.type = rawPayload.type;
        this.person = rawPayload.person;
        this.channelUser = rawPayload.channel_user;
        this.proxyVendor = rawPayload.proxy_vendor;
        this.isProxy = rawPayload.is_proxy;
        this.portability = rawPayload.portability;
        this.portability = rawPayload.portability;
        this.isPortable = rawPayload.is_portable;
        return this;
    };
    Phonenumber.create = function (payload, universe, http) {
        return new Phonenumber({ rawPayload: payload, universe: universe, http: http, initialized: true });
    };
    Phonenumber.createUninitialized = function (payload, universe, http) {
        return new Phonenumber({ rawPayload: payload, universe: universe, http: http, initialized: false });
    };
    Phonenumber.prototype.serialize = function () {
        return {
            id: this.id,
            value: this.value,
            type: this.type,
            created_at: this.createdAt ? this.createdAt.toISOString() : undefined,
            updated_at: this.updatedAt ? this.updatedAt.toISOString() : undefined,
            deleted: this.deleted,
            active: this.active,
            person: this.person,
            channel_user: this.channelUser,
            is_proxy: this.isProxy,
            proxy_vendor: this.proxyVendor,
            portability: this.portability,
            is_portable: this.isPortable
        };
    };
    Phonenumber.prototype.patch = function (changePart) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.person) {
                            throw new PhonenumberPatchRemoteError('Phonenumber patch requires person to be set.');
                        }
                        return [4, this._patch(changePart)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Phonenumber.prototype.applyPatch = function (patch) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.person) {
                            throw new PhonenumberApplyPatchRemoteError('Phonenumber applyPatch requires person to be set.');
                        }
                        return [4, this._applyPatch(patch)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    return Phonenumber;
}(_base_1.UniverseEntity));
exports.Phonenumber = Phonenumber;
var PersonDeleteRemoteError = (function (_super) {
    tslib_1.__extends(PersonDeleteRemoteError, _super);
    function PersonDeleteRemoteError(message, properties) {
        if (message === void 0) { message = 'Could not delete person.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'PersonDeleteRemoteError';
        Object.setPrototypeOf(_this, PersonDeleteRemoteError.prototype);
        return _this;
    }
    return PersonDeleteRemoteError;
}(errors_1.BaseError));
exports.PersonDeleteRemoteError = PersonDeleteRemoteError;
var PersonFetchOrdersRemoteError = (function (_super) {
    tslib_1.__extends(PersonFetchOrdersRemoteError, _super);
    function PersonFetchOrdersRemoteError(message, properties) {
        if (message === void 0) { message = 'Could not get person orders.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'PersonFetchOrdersRemoteError';
        Object.setPrototypeOf(_this, PersonFetchOrdersRemoteError.prototype);
        return _this;
    }
    return PersonFetchOrdersRemoteError;
}(errors_1.BaseError));
exports.PersonFetchOrdersRemoteError = PersonFetchOrdersRemoteError;
var PersonInitializationError = (function (_super) {
    tslib_1.__extends(PersonInitializationError, _super);
    function PersonInitializationError(message, properties) {
        if (message === void 0) { message = 'Could not initialize person.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'PersonInitializationError';
        Object.setPrototypeOf(_this, PersonInitializationError.prototype);
        return _this;
    }
    return PersonInitializationError;
}(errors_1.BaseError));
exports.PersonInitializationError = PersonInitializationError;
var PersonFetchRemoteError = (function (_super) {
    tslib_1.__extends(PersonFetchRemoteError, _super);
    function PersonFetchRemoteError(message, properties) {
        if (message === void 0) { message = 'Could not get person.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'PersonFetchRemoteError';
        Object.setPrototypeOf(_this, PersonFetchRemoteError.prototype);
        return _this;
    }
    return PersonFetchRemoteError;
}(errors_1.BaseError));
exports.PersonFetchRemoteError = PersonFetchRemoteError;
var PeopleFetchRemoteError = (function (_super) {
    tslib_1.__extends(PeopleFetchRemoteError, _super);
    function PeopleFetchRemoteError(message, properties) {
        if (message === void 0) { message = 'Could not get people.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'PeopleFetchRemoteError';
        Object.setPrototypeOf(_this, PeopleFetchRemoteError.prototype);
        return _this;
    }
    return PeopleFetchRemoteError;
}(errors_1.BaseError));
exports.PeopleFetchRemoteError = PeopleFetchRemoteError;
var PeopleFetchCountRemoteError = (function (_super) {
    tslib_1.__extends(PeopleFetchCountRemoteError, _super);
    function PeopleFetchCountRemoteError(message, properties) {
        if (message === void 0) { message = 'Could not get people count.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'PeopleFetchCountRemoteError';
        Object.setPrototypeOf(_this, PeopleFetchCountRemoteError.prototype);
        return _this;
    }
    return PeopleFetchCountRemoteError;
}(errors_1.BaseError));
exports.PeopleFetchCountRemoteError = PeopleFetchCountRemoteError;
var AddressFetchRemoteError = (function (_super) {
    tslib_1.__extends(AddressFetchRemoteError, _super);
    function AddressFetchRemoteError(message, properties) {
        if (message === void 0) { message = 'Could not get fetch person address data.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'AddressFetchRemoteError';
        Object.setPrototypeOf(_this, AddressFetchRemoteError.prototype);
        return _this;
    }
    return AddressFetchRemoteError;
}(errors_1.BaseError));
exports.AddressFetchRemoteError = AddressFetchRemoteError;
var AddressCreateRemoteError = (function (_super) {
    tslib_1.__extends(AddressCreateRemoteError, _super);
    function AddressCreateRemoteError(message, properties) {
        if (message === void 0) { message = 'Could not create person address.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'AddressCreateRemoteError';
        Object.setPrototypeOf(_this, AddressCreateRemoteError.prototype);
        return _this;
    }
    return AddressCreateRemoteError;
}(errors_1.BaseError));
exports.AddressCreateRemoteError = AddressCreateRemoteError;
var AddressPatchRemoteError = (function (_super) {
    tslib_1.__extends(AddressPatchRemoteError, _super);
    function AddressPatchRemoteError(message, properties) {
        if (message === void 0) { message = 'Could not patch person address.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'AddressPatchRemoteError';
        Object.setPrototypeOf(_this, AddressPatchRemoteError.prototype);
        return _this;
    }
    return AddressPatchRemoteError;
}(errors_1.BaseError));
exports.AddressPatchRemoteError = AddressPatchRemoteError;
var PersonMergeRemoteError = (function (_super) {
    tslib_1.__extends(PersonMergeRemoteError, _super);
    function PersonMergeRemoteError(message, properties) {
        if (message === void 0) { message = 'Could not merge persons.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'PersonMergeRemoteError';
        Object.setPrototypeOf(_this, PersonMergeRemoteError.prototype);
        return _this;
    }
    return PersonMergeRemoteError;
}(errors_1.BaseError));
exports.PersonMergeRemoteError = PersonMergeRemoteError;
var PersonGDPRGetRemoteError = (function (_super) {
    tslib_1.__extends(PersonGDPRGetRemoteError, _super);
    function PersonGDPRGetRemoteError(message, properties) {
        if (message === void 0) { message = 'Could not get gdpr info for person.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'PersonGDPRGetRemoteError';
        Object.setPrototypeOf(_this, PersonGDPRGetRemoteError.prototype);
        return _this;
    }
    return PersonGDPRGetRemoteError;
}(errors_1.BaseError));
exports.PersonGDPRGetRemoteError = PersonGDPRGetRemoteError;
var PeopleExportRemoteError = (function (_super) {
    tslib_1.__extends(PeopleExportRemoteError, _super);
    function PeopleExportRemoteError(message, properties) {
        if (message === void 0) { message = 'Could not export people.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'PeopleExportRemoteError';
        Object.setPrototypeOf(_this, PeopleExportRemoteError.prototype);
        return _this;
    }
    return PeopleExportRemoteError;
}(errors_1.BaseError));
exports.PeopleExportRemoteError = PeopleExportRemoteError;
var PersonEmailPostRemoteError = (function (_super) {
    tslib_1.__extends(PersonEmailPostRemoteError, _super);
    function PersonEmailPostRemoteError(message, properties) {
        if (message === void 0) { message = 'Could not save email for person.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'PersonEmailPostRemoteError';
        Object.setPrototypeOf(_this, PersonEmailPostRemoteError.prototype);
        return _this;
    }
    return PersonEmailPostRemoteError;
}(errors_1.BaseError));
exports.PersonEmailPostRemoteError = PersonEmailPostRemoteError;
var PersonEmailApplyPatchError = (function (_super) {
    tslib_1.__extends(PersonEmailApplyPatchError, _super);
    function PersonEmailApplyPatchError(message, properties) {
        if (message === void 0) { message = 'Could not apply patch on email for person.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'PersonEmailApplyPatchError';
        Object.setPrototypeOf(_this, PersonEmailApplyPatchError.prototype);
        return _this;
    }
    return PersonEmailApplyPatchError;
}(errors_1.BaseError));
exports.PersonEmailApplyPatchError = PersonEmailApplyPatchError;
var PersonEmailDeleteError = (function (_super) {
    tslib_1.__extends(PersonEmailDeleteError, _super);
    function PersonEmailDeleteError(message, properties) {
        if (message === void 0) { message = 'Could not delete email for person.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'PersonEmailDeleteError';
        Object.setPrototypeOf(_this, PersonEmailDeleteError.prototype);
        return _this;
    }
    return PersonEmailDeleteError;
}(errors_1.BaseError));
exports.PersonEmailDeleteError = PersonEmailDeleteError;
var PersonPreviewNotificationError = (function (_super) {
    tslib_1.__extends(PersonPreviewNotificationError, _super);
    function PersonPreviewNotificationError(message, properties) {
        if (message === void 0) { message = 'Could not preview notification for person.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'PersonPreviewNotificationError';
        Object.setPrototypeOf(_this, PersonPreviewNotificationError.prototype);
        return _this;
    }
    return PersonPreviewNotificationError;
}(errors_1.BaseError));
exports.PersonPreviewNotificationError = PersonPreviewNotificationError;
var DealsFetchRemoteError = (function (_super) {
    tslib_1.__extends(DealsFetchRemoteError, _super);
    function DealsFetchRemoteError(message, properties) {
        if (message === void 0) { message = 'Could not fetch deals for person.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'DealsFetchRemoteError';
        Object.setPrototypeOf(_this, DealsFetchRemoteError.prototype);
        return _this;
    }
    return DealsFetchRemoteError;
}(errors_1.BaseError));
exports.DealsFetchRemoteError = DealsFetchRemoteError;
var DealCreateRemoteError = (function (_super) {
    tslib_1.__extends(DealCreateRemoteError, _super);
    function DealCreateRemoteError(message, properties) {
        if (message === void 0) { message = 'Could not create deal for person.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'DealCreateRemoteError';
        Object.setPrototypeOf(_this, DealCreateRemoteError.prototype);
        return _this;
    }
    return DealCreateRemoteError;
}(errors_1.BaseError));
exports.DealCreateRemoteError = DealCreateRemoteError;
var PhonenumbersFetchRemoteError = (function (_super) {
    tslib_1.__extends(PhonenumbersFetchRemoteError, _super);
    function PhonenumbersFetchRemoteError(message, properties) {
        if (message === void 0) { message = 'Could not fetch phonenumbers for person.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'PhonenumbersFetchRemoteError';
        Object.setPrototypeOf(_this, PhonenumbersFetchRemoteError.prototype);
        return _this;
    }
    return PhonenumbersFetchRemoteError;
}(errors_1.BaseError));
exports.PhonenumbersFetchRemoteError = PhonenumbersFetchRemoteError;
var PhonenumberCreateRemoteError = (function (_super) {
    tslib_1.__extends(PhonenumberCreateRemoteError, _super);
    function PhonenumberCreateRemoteError(message, properties) {
        if (message === void 0) { message = 'Could not create phonenumber for person.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'PhonenumberCreateRemoteError';
        Object.setPrototypeOf(_this, PhonenumberCreateRemoteError.prototype);
        return _this;
    }
    return PhonenumberCreateRemoteError;
}(errors_1.BaseError));
exports.PhonenumberCreateRemoteError = PhonenumberCreateRemoteError;
var PhonenumberPatchRemoteError = (function (_super) {
    tslib_1.__extends(PhonenumberPatchRemoteError, _super);
    function PhonenumberPatchRemoteError(message, properties) {
        if (message === void 0) { message = 'Phonenumber patch requires person to be set.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'PhonenumberPatchRemoteError';
        Object.setPrototypeOf(_this, PhonenumberPatchRemoteError.prototype);
        return _this;
    }
    return PhonenumberPatchRemoteError;
}(errors_1.BaseError));
exports.PhonenumberPatchRemoteError = PhonenumberPatchRemoteError;
var PhonenumberApplyPatchRemoteError = (function (_super) {
    tslib_1.__extends(PhonenumberApplyPatchRemoteError, _super);
    function PhonenumberApplyPatchRemoteError(message, properties) {
        if (message === void 0) { message = 'Phonenumber applyPatch requires person to be set.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'PhonenumberApplyPatchRemoteError';
        Object.setPrototypeOf(_this, PhonenumberApplyPatchRemoteError.prototype);
        return _this;
    }
    return PhonenumberApplyPatchRemoteError;
}(errors_1.BaseError));
exports.PhonenumberApplyPatchRemoteError = PhonenumberApplyPatchRemoteError;
//# sourceMappingURL=person.js.map