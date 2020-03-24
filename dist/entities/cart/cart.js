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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var _base_1 = __importDefault(require("../_base"));
var errors_1 = require("../../errors");
var ICartStatusEnum;
(function (ICartStatusEnum) {
    ICartStatusEnum["open"] = "open";
    ICartStatusEnum["pending"] = "pending";
    ICartStatusEnum["completed"] = "completed";
    ICartStatusEnum["cancelled"] = "cancelled";
})(ICartStatusEnum = exports.ICartStatusEnum || (exports.ICartStatusEnum = {}));
var CartItem = /** @class */ (function () {
    function CartItem(options) {
        this.universe = options.universe;
        this.http = options.http;
        this.options = options;
        if (options && options.rawPayload) {
            this.deserialize(options.rawPayload);
        }
    }
    CartItem.prototype.deserialize = function (rawPayload) {
        this.qty = rawPayload.qty;
        this.sku = rawPayload.sku;
        this.name = rawPayload.name;
        this.price = rawPayload.price;
        this.product = rawPayload.product;
        this.metadata = rawPayload.metadata;
        this.customId = rawPayload.custom_id;
        this.discounts = rawPayload.discounts;
        this.orderIndex = rawPayload.order_index;
        this.customProperties = rawPayload.custom_properties;
        this.shippingRequired = rawPayload.shipping_required;
        this.externalReferenceId = rawPayload.external_reference_id;
        this.externalReferenceCustomId = rawPayload.external_reference_custom_id;
        return this;
    };
    CartItem.create = function (payload, universe, http) {
        return new CartItem({ rawPayload: payload, universe: universe, http: http });
    };
    CartItem.prototype.serialize = function () {
        return {
            qty: this.qty,
            sku: this.sku,
            name: this.name,
            price: this.price,
            product: this.product,
            metadata: this.metadata,
            custom_id: this.customId,
            discounts: this.discounts,
            order_index: this.orderIndex,
            custom_properties: this.customProperties,
            shipping_required: this.shippingRequired,
            external_reference_id: this.externalReferenceId,
            external_reference_custom_id: this.externalReferenceCustomId
        };
    };
    return CartItem;
}());
exports.CartItem = CartItem;
/**
 * Manage carts.
 *
 * @category CommerceEntity
 */
var Cart = /** @class */ (function (_super) {
    __extends(Cart, _super);
    function Cart(options) {
        var _this = _super.call(this) || this;
        _this.universe = options.universe;
        _this.endpoint = 'api/v0/carts';
        _this.http = options.http;
        _this.options = options;
        _this.initialized = options.initialized || false;
        if (options && options.rawPayload) {
            _this.deserialize(options.rawPayload);
        }
        return _this;
    }
    Cart.prototype.deserialize = function (rawPayload) {
        var _this = this;
        this.id = rawPayload.id;
        this.createdAt = rawPayload.created_at ? new Date(rawPayload.created_at) : undefined;
        this.updatedAt = rawPayload.updated_at ? new Date(rawPayload.updated_at) : undefined;
        this.deleted = rawPayload.deleted || false;
        this.active = rawPayload.active || true;
        this.name = rawPayload.name;
        this.customId = rawPayload.custom_id;
        this.isProxy = rawPayload.is_proxy || false;
        this.proxyVendor = rawPayload.proxy_vendor;
        this.type = rawPayload.type;
        this.externalReferenceId = rawPayload.external_reference_id;
        this.externalReferenceCustomId = rawPayload.external_reference_custom_id;
        this.clientId = rawPayload.client_id;
        this.person = rawPayload.person;
        this.note = rawPayload.note;
        this.comment = rawPayload.comment;
        this.shippingAddress = rawPayload.shipping_address;
        this.billingAddress = rawPayload.billing_address;
        this.contact = rawPayload.contact;
        this.metadata = rawPayload.metadata;
        this.customProperies = rawPayload.custom_properies;
        this.shippingFulfillment = rawPayload.shipping_fulfillment;
        this.amountTotalGross = rawPayload.amount_total_gross;
        this.amountTotalNet = rawPayload.amount_total_net;
        this.amountTotalTax = rawPayload.amount_total_tax;
        this.amountTotalShippingGross = rawPayload.amount_total_shipping_gross;
        this.orderPrompt = rawPayload.order_prompt;
        this.status = rawPayload.status;
        this.proxyPayload = rawPayload.proxy_payload;
        if (Array.isArray(rawPayload.items)) {
            this.items = rawPayload.items.map(function (item) { return (CartItem.create(item, _this.universe, _this.http)); });
        }
        else {
            this.items = [];
        }
        return this;
    };
    Cart.create = function (payload, universe, http) {
        return new Cart({ rawPayload: payload, universe: universe, http: http, initialized: true });
    };
    Cart.prototype.serialize = function () {
        var items = undefined;
        if (Array.isArray(this.items)) {
            items = this.items.map(function (item) { return (item.serialize()); });
        }
        return {
            id: this.id,
            created_at: this.createdAt ? this.createdAt.toISOString() : undefined,
            updated_at: this.updatedAt ? this.updatedAt.toISOString() : undefined,
            deleted: this.deleted || false,
            active: this.active || true,
            name: this.name,
            custom_id: this.customId,
            is_proxy: this.isProxy,
            proxy_vendor: this.proxyVendor,
            type: this.type,
            external_reference_id: this.externalReferenceId,
            external_reference_custom_id: this.externalReferenceCustomId,
            client_id: this.clientId,
            person: this.person,
            note: this.note,
            comment: this.comment,
            shipping_address: this.shippingAddress,
            billing_address: this.billingAddress,
            contact: this.contact,
            metadata: this.metadata,
            custom_properies: this.customProperies,
            items: items,
            shipping_fulfillment: this.shippingFulfillment,
            amount_total_gross: this.amountTotalGross,
            amount_total_net: this.amountTotalNet,
            amount_total_tax: this.amountTotalTax,
            amount_total_shipping_gross: this.amountTotalShippingGross,
            order_prompt: this.orderPrompt,
            status: this.status,
            proxy_payload: this.proxyPayload
        };
    };
    Cart.prototype.init = function () {
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
                        throw this.handleError(new CartInitializationError(undefined, { error: err_1 }));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Cart;
}(_base_1.default));
exports.Cart = Cart;
var Carts = /** @class */ (function () {
    function Carts() {
    }
    Carts.endpoint = 'api/v0/carts';
    return Carts;
}());
exports.Carts = Carts;
var CartInitializationError = /** @class */ (function (_super) {
    __extends(CartInitializationError, _super);
    function CartInitializationError(message, properties) {
        if (message === void 0) { message = 'Could not initialize cart.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'CartInitializationError';
        return _this;
    }
    return CartInitializationError;
}(errors_1.BaseError));
exports.CartInitializationError = CartInitializationError;
var CartFetchRemoteError = /** @class */ (function (_super) {
    __extends(CartFetchRemoteError, _super);
    function CartFetchRemoteError(message, properties) {
        if (message === void 0) { message = 'Could not get cart.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'CartFetchRemoteError';
        return _this;
    }
    return CartFetchRemoteError;
}(errors_1.BaseError));
exports.CartFetchRemoteError = CartFetchRemoteError;
var CartsFetchRemoteError = /** @class */ (function (_super) {
    __extends(CartsFetchRemoteError, _super);
    function CartsFetchRemoteError(message, properties) {
        if (message === void 0) { message = 'Could not get carts.'; }
        var _this = _super.call(this, message, properties) || this;
        _this.message = message;
        _this.name = 'CartsFetchRemoteError';
        return _this;
    }
    return CartsFetchRemoteError;
}(errors_1.BaseError));
exports.CartsFetchRemoteError = CartsFetchRemoteError;
//# sourceMappingURL=cart.js.map