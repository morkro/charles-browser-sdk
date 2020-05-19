import { Readable } from 'readable-stream';
import { UniverseHealth, UniverseStatus } from './status';
import { Client } from '../client';
import { Feeds, Feed, FeedRawPayload } from '../eventing/feeds/feed';
import { BaseError } from '../errors';
import { MessageRawPayload } from '../messaging';
import { EntityFetchOptions } from '../entities/_base';
import * as staff from '../entities/staff/staff';
import * as asset from '../entities/asset/asset';
import * as person from '../entities/person/person';
import * as channelUser from '../entities/person/channel-user';
import * as email from '../entities/person/email';
import * as product from '../entities/product/product';
import * as ticket from '../entities/ticket/ticket';
import * as cart from '../entities/cart/cart';
import * as order from '../entities/order/order';
import * as discount from '../entities/discount/discount';
import * as messageTemplate from '../entities/message-template/message-template';
import { Product, ProductRawPayload } from '../entities/product/product';
import * as productCategory from '../entities/product-category/product-category';
import * as productCategoryTree from '../entities/product-category-tree/product-category-tree';
import * as messageTemplateCategory from '../entities/message-template-category/message-template-category';
import * as messageTemplateCategoryTree from '../entities/message-template-category-tree/message-template-category-tree';
import * as customProperty from '../entities/custom-property/custom-property';
import * as tag from '../entities/tag/tag';
export interface UniverseUser {
    id?: string;
    accessToken: string;
}
export interface UniverseOptions {
    name: string;
    universeBase?: string;
    http: Client;
    base: string;
    user: UniverseUser;
}
export interface UniversePayload {
    name: string;
    id: string;
    active: boolean;
    deleted: boolean;
    organization: string;
    configuration: object | null;
    updatedAt: Date | null;
    createdAt: Date | null;
}
export interface UniverseFetchQuery {
    [key: string]: any;
}
export interface UniverseFetchOptions {
    raw?: boolean;
    query?: UniverseFetchQuery;
}
export declare interface Universe {
    on(event: 'raw-error' | 'error', cb: (error: Error) => void): this;
    on(event: 'armed' | 'universe:message' | 'universe:feeds:messages' | 'universe:feeds:events' | 'universe:feeds' | string, cb: Function): this;
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
export interface UnviverseProductsSearchResultItem extends UnviverseSearchResultItem {
    document: {
        id: product.ProductRawPayload['id'];
        created_at: product.ProductRawPayload['created_at'];
        updated_at: product.ProductRawPayload['updated_at'];
        name: product.ProductRawPayload['name'];
        summary: product.ProductRawPayload['summary'];
        description: product.ProductRawPayload['description'];
        type: product.ProductRawPayload['type'];
        assets_config: product.ProductRawPayload['assets_config'];
    };
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
    people: (q: string) => Promise<UnviversePeopleSearchResultItem[]>;
    feeds: (q: string) => Promise<UnviverseFeedsSearchResultItem[]>;
    products: (q: string) => Promise<UnviverseProductsSearchResultItem[]>;
}
export interface UniverseFeeds {
    fetch: (options?: UniverseFetchOptions) => Promise<Feed[] | FeedRawPayload[] | undefined>;
    fromJson: (feeds: FeedRawPayload[]) => Feed[];
    toJson: (feeds: Feed[]) => FeedRawPayload[];
    stream: (options?: UniverseFetchOptions) => Promise<Feeds>;
}
export interface UniverseProducts {
    fetch: (options?: EntityFetchOptions) => Promise<Product[] | ProductRawPayload[] | undefined>;
    fromJson: (products: ProductRawPayload[]) => Product[];
    toJson: (products: Product[]) => ProductRawPayload[];
}
export interface IUniverseCarts {
    fetch: (options?: UniverseFetchOptions) => Promise<cart.Cart[] | cart.CartRawPayload[] | undefined>;
    fromJson: (carts: cart.CartRawPayload[]) => cart.Cart[];
    toJson: (carts: cart.Cart[]) => cart.CartRawPayload[];
}
export declare type UniversePermissionType = 'admin';
export declare type UniverseRoleType = 'admin';
export interface MeData {
    user: {
        email: string;
        sub: string;
    };
    permissions: UniversePermissionType[];
    roles: UniversePermissionType[];
    staff: staff.StaffRawPayload;
}
export declare class Universe extends Readable {
    status: UniverseStatus;
    health: UniverseHealth;
    options: UniverseOptions;
    name: UniverseOptions['name'];
    initialized: boolean;
    payload: UniversePayload | null;
    user: UniverseUser;
    protected http: Client;
    private mqtt;
    base: string;
    universeBase: string;
    private static readonly endpoint;
    constructor(options: UniverseOptions);
    init(): Promise<Universe | undefined>;
    private static parsePayload;
    private setInitialized;
    private setMqttClient;
    private get defaultSubscriptions();
    private subscibeDefaults;
    private handleMessage;
    private getMqttClient;
    create(options: UniverseOptions): Universe;
    deinitialize(): void;
    get ready(): boolean;
    isReady(): boolean;
    get connected(): boolean;
    isConnected(): boolean;
    private handleError;
    feed(payload: FeedRawPayload): Feed;
    product(payload: product.ProductRawPayload): product.Product;
    staff(payload: staff.StaffRawPayload): staff.Staff;
    asset(payload: asset.AssetRawPayload): asset.Asset;
    cart(payload: cart.CartRawPayload): cart.Cart;
    order(payload: order.OrderRawPayload): order.Order;
    person(payload: person.PersonRawPayload): person.Person;
    address(payload: person.PersonAddressRawPayload): person.Address;
    phonenumber(payload: person.PersonPhonenumberRawPayload): person.Phonenumber;
    channelUser(payload: person.PersonChannelUserRawPayload): channelUser.ChannelUser;
    email(payload: person.PersonEmailRawPayload): email.Email;
    ticket(payload: ticket.TicketRawPayload): ticket.Ticket;
    discount(payload: discount.DiscountRawPayload): discount.Discount;
    messageTemplate(payload: messageTemplate.MessageTemplateRawPayload): messageTemplate.MessageTemplate;
    productCategory(payload: productCategory.ProductCategoryRawPayload): productCategory.ProductCategory;
    productCategoryTree(payload: productCategoryTree.ProductCategoryTreeRawPayload): productCategoryTree.ProductCategoryTree;
    messageTemplateCategory(payload: messageTemplateCategory.MessageTemplateCategoryRawPayload): messageTemplateCategory.MessageTemplateCategory;
    messageTemplateCategoryTree(payload: messageTemplateCategoryTree.MessageTemplateCategoryTreeRawPayload): messageTemplateCategoryTree.MessageTemplateCategoryTree;
    customProperty(payload: customProperty.CustomPropertyRawPayload): customProperty.CustomProperty;
    tag(payload: tag.TagRawPayload): tag.Tag;
    me(): Promise<MeData | undefined>;
    get feeds(): UniverseFeeds;
    staffs(options?: EntityFetchOptions): Promise<staff.Staff[] | staff.StaffRawPayload[] | undefined>;
    assets(): Promise<asset.Asset[] | undefined>;
    people(): Promise<person.Person[] | undefined>;
    get products(): UniverseProducts;
    tickets(): Promise<ticket.Ticket[] | undefined>;
    get carts(): IUniverseCarts;
    orders(): Promise<order.Order[] | undefined>;
    discounts(): Promise<discount.Discount[] | undefined>;
    messageTemplates(): Promise<messageTemplate.MessageTemplate[] | undefined>;
    productCategories(options?: EntityFetchOptions): Promise<productCategory.ProductCategory[] | productCategory.ProductCategoryRawPayload[] | undefined>;
    productCategoryTrees(options?: EntityFetchOptions): Promise<productCategoryTree.ProductCategoryTree[] | productCategoryTree.ProductCategoryTreeRawPayload[] | undefined>;
    messageTemplateCategories(): Promise<messageTemplateCategory.MessageTemplateCategory[] | undefined>;
    messageTemplateCategoryTrees(): Promise<messageTemplateCategoryTree.MessageTemplateCategoryTree[] | undefined>;
    customProperties(): Promise<customProperty.CustomProperty[] | undefined>;
    tags(options?: EntityFetchOptions): Promise<tag.Tag[] | tag.TagRawPayload[] | undefined>;
    arm(): Universe;
    get search(): UniverseSearches;
    private searchEntity;
}
export declare class UnviverseSingleton extends Universe {
    private static instance;
    static getInstance(options: UniverseOptions): Universe;
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
export declare class UniverseUnauthenticatedError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class UniverseMeError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
