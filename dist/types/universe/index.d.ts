import { Readable } from 'readable-stream';
import { UniverseHealth, UniverseStatus } from './status';
import { Client } from '../client';
import { Feed } from '../eventing/feeds/feed';
import { BaseError } from '../errors';
import { MessageRawPayload } from '../messaging';
import * as staff from '../entities/staff/staff';
import * as asset from '../entities/asset/asset';
import * as person from '../entities/person/person';
import * as product from '../entities/product/product';
import * as ticket from '../entities/ticket/ticket';
import * as cart from '../entities/cart/cart';
import * as order from '../entities/order/order';
import * as discount from '../entities/discount/discount';
export interface IUniverseUser {
    id?: string;
    accessToken: string;
}
export interface IUniverseOptions {
    name: string;
    http: Client;
    base: string;
    user: IUniverseUser;
}
export interface IUniversePayload {
    name: string;
    id: string;
    active: boolean;
    deleted: boolean;
    organization: string;
    configuration: object | null;
    updatedAt: Date | null;
    createdAt: Date | null;
}
export declare interface Universe {
    on(event: 'raw-error' | 'error', cb: (error: Error) => void): this;
    on(event: 'armed' | 'universe:message' | 'universe:feeds:messages' | 'universe:feeds' | string, cb: Function): this;
}
export interface UnviverseSearchResultItem {
    document: object;
}
export interface UnviversePeopleSearchResultItem extends UnviverseSearchResultItem {
    document: {
        id: person.PersonRawPayload['id'];
        name: person.PersonRawPayload['name'];
        first_name: person.PersonRawPayload['first_name'];
        middle_name: person.PersonRawPayload['middle_name'];
        last_name: person.PersonRawPayload['last_name'];
        created_at: person.PersonRawPayload['created_at'];
        avatar: person.PersonRawPayload['avatar'];
    };
    feeds: string[];
}
export interface UnviverseFeedsSearchResultItem extends UnviverseSearchResultItem {
    document: {
        id: MessageRawPayload['id'];
        date: MessageRawPayload['date'];
        feed: MessageRawPayload['feed'];
        person: MessageRawPayload['person'];
        content: MessageRawPayload['content'];
    };
    event: string;
    feed: string;
    resource_type: 'message';
    person: person.PersonRawPayload;
}
export interface UniverseSearches {
    people: Function;
    feeds: Function;
}
/**
 * The unsiverse is usually the base entitiy one wants to build upon. Consider it a project, product
 * or namespace for data.
 *
 * It also allows easy access to remote states of entities, such as:
 *
 * ```js
 * await universe.feeds()
 * await universe.staffs()
 * await universe.assets()
 * await universe.people()
 * await universe.products()
 * await universe.tickets()
 * ```
 *
 * Furthermore it is a global event emitter, informing implementers about e.g. about new messages
 *
 * ```js
 * universe.on('universe:message', (msg) => {
 *   // your logic
 * })
 *
 * universe.on('universe:feeds:messages', (p) => {
 *   // your logic
 * })
 *
 * universe.on('universe:feeds', (p) => {
 *   // your logic
 * })
 * ```
 *
 * @category Universe
 */
export declare class Universe extends Readable {
    status: UniverseStatus;
    health: UniverseHealth;
    options: IUniverseOptions;
    name: IUniverseOptions['name'];
    initialized: boolean;
    payload: IUniversePayload | null;
    user: IUniverseUser;
    protected http: Client;
    private mqtt;
    base: string;
    universeBase: string;
    private static endpoint;
    constructor(options: IUniverseOptions);
    init(): Promise<Universe | undefined>;
    private static parsePayload;
    private setInitialized;
    private setMqttClient;
    private get defaultSubscriptions();
    private subscibeDefaults;
    /**
     *
     * Parsing and routing logic is being handled here. We take extensive decisions about type and destinations here.
     */
    private handleMessage;
    /**
     * Safe access the mqtt client. This has a conequence that all the methods that use it need to be aware that they might throw.
     */
    private getMqttClient;
    create(options: IUniverseOptions): Universe;
    /**
     * In order to notify backends about the universe leaving we will try to
     * unsubscripe from topics before destroying. In any case all event handlers are gone
     * immediately.
     *
     */
    deinitialize(): void;
    get ready(): boolean;
    isReady(): boolean;
    get connected(): boolean;
    isConnected(): boolean;
    private handleError;
    product(payload: product.ProductRawPayload): product.Product;
    staff(payload: staff.StaffRawPayload): staff.Staff;
    asset(payload: asset.AssetRawPayload): asset.Asset;
    cart(payload: cart.CartRawPayload): cart.Cart;
    order(payload: order.OrderRawPayload): order.Order;
    person(payload: person.PersonRawPayload): person.Person;
    ticket(payload: ticket.TicketRawPayload): ticket.Ticket;
    discount(payload: discount.DiscountRawPayload): discount.Discount;
    feeds(): Promise<Feed[] | undefined>;
    staffs(): Promise<staff.Staff[] | undefined>;
    assets(): Promise<asset.Asset[] | undefined>;
    people(): Promise<person.Person[] | undefined>;
    products(): Promise<product.Product[] | undefined>;
    tickets(): Promise<ticket.Ticket[] | undefined>;
    carts(): Promise<cart.Cart[] | undefined>;
    orders(): Promise<order.Order[] | undefined>;
    discounts(): Promise<discount.Discount[] | undefined>;
    /**
     * Arm the client by retrieving latest data. Arming emits to the server and listens for the response once.
     */
    arm(): Universe;
    /**
     * Gets executable search
     *
     * @example
     * await universe.search.people('Your Name')
     */
    get search(): UniverseSearches;
    /**
     * Execute search for a given entity
     * @ignore
     * @param endpoint
     * @param q
     */
    private searchEntity;
}
export declare class UnviverseSingleton extends Universe {
    private static instance;
    constructor(options: IUniverseOptions);
    static getInstance(options: IUniverseOptions): Universe;
    static clearInstance(): void;
}
export declare class UniverseInitializationError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class UniverseSearchError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
