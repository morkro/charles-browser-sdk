import Entity, { UniverseEntity, UniverseEntityOptions, EntityRawPayload, EntityFetchOptions, EntitiesList, EntityDeleteOptions, RawPatch } from '../_base';
import { Universe, UniverseFetchOptions, UniverseExportCsvOptions } from '../../universe';
import { BaseError } from '../../errors';
import { Order, OrderRawPayload } from '../../entities/order/order';
import { ChannelUser, ChannelUserRawPayload } from './channel-user';
import { Analytics, AnalyticsRawPayload } from './analytics';
import { Email, EmailRawPayload } from './email';
import { Cart, CartRawPayload } from '../cart/cart';
import { EventRawPayload } from '../../eventing/feeds/event';
export interface PersonOptions extends UniverseEntityOptions {
    rawPayload?: PersonRawPayload;
    mqtt?: Universe['mqtt'];
}
export interface AddressOptions extends PersonOptions {
    rawPayload?: PersonAddressRawPayload;
}
export interface PhonenumberOptions extends PersonOptions {
    rawPayload?: PersonPhonenumberRawPayload;
}
export interface PreviewNotificationParams {
    channelUserId: string;
    messageTemplateId: string;
}
export interface PersonAddressRawPayload extends EntityRawPayload {
    readonly first_name?: string;
    readonly last_name?: string;
    readonly phone?: string;
    readonly person?: string;
    readonly created_at?: string;
    readonly updated_at?: string;
    readonly deleted?: boolean;
    readonly active?: boolean;
    readonly type?: string;
    readonly lines?: string[];
    readonly company?: string;
    readonly locality?: string;
    readonly country?: string;
    readonly region?: string;
    readonly comment?: string;
    readonly postal_code?: string;
}
export interface PersonAddressPayload {
    readonly id?: PersonAddressRawPayload['id'];
    readonly firstName?: PersonAddressRawPayload['first_name'];
    readonly lastName?: PersonAddressRawPayload['last_name'];
    readonly phone?: PersonAddressRawPayload['phone'];
    readonly person?: PersonAddressRawPayload['person'];
    readonly createdAt?: Date | null;
    readonly updatedAt?: Date | null;
    readonly deleted?: PersonAddressRawPayload['deleted'];
    readonly active?: PersonAddressRawPayload['active'];
    readonly type?: PersonAddressRawPayload['type'];
    readonly lines?: PersonAddressRawPayload['lines'];
    readonly company?: PersonAddressRawPayload['company'];
    readonly locality?: PersonAddressRawPayload['locality'];
    readonly country?: PersonAddressRawPayload['country'];
    readonly region?: PersonAddressRawPayload['region'];
    readonly comment?: PersonAddressRawPayload['comment'];
    readonly postal_code?: PersonAddressRawPayload['postal_code'];
}
export interface PersonPhonenumberRawPayload extends EntityRawPayload {
    readonly created_at?: string;
    readonly updated_at?: string;
    readonly deleted?: boolean;
    readonly active?: boolean;
    readonly person?: string;
    readonly type?: string;
    readonly value?: string;
    readonly channel_user?: string;
    readonly is_portable?: boolean;
    readonly is_proxy?: boolean;
    readonly proxy_vendor?: string;
    readonly portability?: object | any | null;
}
export interface PersonPhonenumberPayload {
    readonly id?: PersonPhonenumberRawPayload['id'];
    readonly createdAt?: Date | null;
    readonly updatedAt?: Date | null;
    readonly deleted?: PersonPhonenumberRawPayload['deleted'];
    readonly active?: PersonPhonenumberRawPayload['active'];
    readonly type?: PersonPhonenumberRawPayload['type'];
    readonly value?: PersonPhonenumberRawPayload['value'];
    readonly person?: PersonPhonenumberRawPayload['person'];
    readonly channelUser?: PersonPhonenumberRawPayload['channel_user'];
    readonly isPortable?: PersonPhonenumberRawPayload['is_portable'];
    readonly isProxy?: PersonPhonenumberRawPayload['is_proxy'];
    readonly proxyVendor?: PersonPhonenumberRawPayload['proxy_vendor'];
    readonly portability?: PersonPhonenumberRawPayload['portability'];
}
export declare type PersonChannelUserRawPayload = ChannelUserRawPayload;
export declare type PersonAnalyticsRawPayload = AnalyticsRawPayload;
export declare type PersonEmailRawPayload = EmailRawPayload;
export interface PersonRawPayload extends EntityRawPayload {
    readonly created_at?: string;
    readonly updated_at?: string;
    readonly deleted?: boolean;
    readonly active?: boolean;
    readonly kind?: 'Contact' | 'Universe' | string | null;
    readonly first_name?: string;
    readonly nickname?: string;
    readonly middle_name?: string;
    readonly last_name?: string;
    readonly name?: string;
    readonly avatar?: string;
    readonly date_of_birth?: string;
    readonly gender?: string;
    readonly comment?: string;
    readonly tags?: string[];
    readonly name_preference?: string[];
    readonly custom_properties?: object;
    readonly measurements?: {
        body?: {
            weight: number;
            height: number;
        };
        shoes?: {
            sizes?: {
                type?: 'womens' | 'mens' | 'kids' | 'babys' | null;
                uk?: number | null;
                eu?: number | null;
                us?: number | null;
            };
        };
    };
    readonly emails?: PersonEmailRawPayload[];
    readonly addresses?: PersonAddressRawPayload[];
    readonly phonenumbers?: PersonPhonenumberRawPayload[];
    readonly channel_users?: PersonChannelUserRawPayload[];
    readonly analytics?: PersonAnalyticsRawPayload;
    readonly default_address?: string | null;
    readonly language_preference?: string;
}
export interface IPersonCarts {
    fetch: (options?: UniverseFetchOptions) => Promise<Cart[] | CartRawPayload[] | undefined>;
    fromJson: (carts: CartRawPayload[]) => Cart[];
    toJson: (carts: Cart[]) => CartRawPayload[];
    create: (cart: CartRawPayload) => Promise<Cart | undefined>;
}
export interface IPersonDeals {
    fetch: Function;
    fromJson: Function;
    toJson: Function;
    create: Function;
}
export interface IPersonPhonenumbers {
    fetch: Function;
    fromJson: Function;
    toJson: Function;
    create: Function;
}
export interface IPersonAddresses {
    fetch: Function;
    fromJson: Function;
    toJson: Function;
    create: Function;
}
declare class AddressArray<T> extends Array<T> {
    protected universe: Universe;
    protected apiCarrier: Universe;
    protected http: Universe['http'];
    protected person: Person;
    constructor(items: T[], universe: Universe, http: Universe['http'], person: Person);
    fromJson(payloads: PersonAddressRawPayload[]): Address[];
    toJson(items: Address[]): PersonAddressRawPayload[];
    fetch(options?: EntityFetchOptions): Promise<Address[] | PersonAddressRawPayload[] | undefined>;
    create(payload: PersonAddressRawPayload): Promise<Address | undefined>;
}
export interface PersonPayload {
    readonly id?: PersonRawPayload['id'];
    readonly createdAt?: Date | null;
    readonly updatedAt?: Date | null;
    readonly deleted?: boolean;
    readonly active?: boolean;
    readonly kind?: PersonRawPayload['kind'];
    readonly firstName?: PersonRawPayload['first_name'];
    readonly middleName?: PersonRawPayload['middle_name'];
    readonly lastName?: PersonRawPayload['last_name'];
    readonly name?: PersonRawPayload['name'];
    readonly nickname?: PersonRawPayload['nickname'];
    readonly emails?: Email[];
    readonly avatar?: PersonRawPayload['avatar'];
    readonly dateOfBirth?: PersonRawPayload['date_of_birth'];
    readonly gender?: PersonRawPayload['gender'];
    readonly comment?: PersonRawPayload['comment'];
    readonly measurements?: PersonRawPayload['measurements'];
    readonly tags?: PersonRawPayload['tags'];
    readonly namePreference?: PersonRawPayload['name_preference'];
    readonly customProperties?: PersonRawPayload['custom_properties'];
    readonly addresses?: Address[];
    readonly phonenumbers?: Phonenumber[];
    readonly channelUsers?: ChannelUser[];
    readonly analytics?: Analytics;
    readonly defaultAddress?: PersonRawPayload['default_address'];
    readonly languagePreference?: PersonRawPayload['language_preference'];
}
export declare class Person extends UniverseEntity<PersonPayload, PersonRawPayload> {
    protected universe: Universe;
    protected apiCarrier: Universe;
    protected http: Universe['http'];
    protected mqtt?: Universe['mqtt'];
    protected options: PersonOptions;
    initialized: boolean;
    endpoint: string;
    id?: PersonPayload['id'];
    createdAt?: PersonPayload['createdAt'];
    updatedAt?: PersonPayload['updatedAt'];
    deleted?: PersonPayload['deleted'];
    active?: PersonPayload['active'];
    kind?: PersonPayload['kind'];
    firstName?: PersonPayload['firstName'];
    middleName?: PersonPayload['middleName'];
    lastName?: PersonPayload['lastName'];
    name?: PersonPayload['name'];
    nickname?: PersonPayload['nickname'];
    emails?: PersonPayload['emails'];
    avatar?: PersonPayload['avatar'];
    dateOfBirth?: PersonPayload['dateOfBirth'];
    gender?: PersonPayload['gender'];
    comment?: PersonPayload['comment'];
    measurements?: PersonPayload['measurements'];
    tags?: PersonPayload['tags'];
    namePreference?: PersonPayload['namePreference'];
    customProperties?: PersonPayload['customProperties'];
    _addresses?: PersonPayload['addresses'];
    _phonenumbers?: PersonPayload['phonenumbers'];
    channelUsers?: PersonPayload['channelUsers'];
    analytics?: PersonPayload['analytics'];
    defaultAddress?: PersonPayload['defaultAddress'];
    languagePreference?: PersonPayload['languagePreference'];
    constructor(options: PersonOptions);
    protected deserialize(rawPayload: PersonRawPayload): Person;
    static create(payload: PersonRawPayload, universe: Universe, http: Universe['http'], mqtt?: Universe['mqtt']): Person;
    serialize(): PersonRawPayload;
    init(): Promise<Person | undefined>;
    setupDefaultMessageListeners(): Person;
    private get defaultSubscriptions();
    subscribeDefaults(): void;
    unsubscribeDefaults(): void;
    subscribe(topic: string | string[]): Person;
    unsubscribe(topic: string | string[]): Person;
    private getMqttClient;
    private handleMessage;
    patch(changePart: PersonRawPayload): Promise<Person>;
    delete(options?: EntityDeleteOptions): Promise<Person>;
    merge(mergeables: Object[]): Promise<Person | PersonRawPayload>;
    getGDPRFile(options?: PersonGDPROptions): Promise<object>;
    orders(options?: EntityFetchOptions): Promise<Order[] | OrderRawPayload[] | undefined>;
    get carts(): IPersonCarts;
    get deals(): IPersonDeals;
    get addresses(): AddressArray<Address>;
    set addresses(items: AddressArray<Address>);
    getEmails(options?: EntityFetchOptions): Promise<Email[] | EmailRawPayload[]>;
    email(payload: EmailRawPayload): Email;
    phonenumber(payload: PersonPhonenumberRawPayload): Phonenumber;
    address(payload: PersonAddressRawPayload): Address;
    get phonenumbers(): IPersonPhonenumbers;
    previewNotification(params: PreviewNotificationParams, language: string, parameters?: any[] | object, options?: EntityFetchOptions): Promise<EventRawPayload[]>;
}
export interface PersonGDPROptions {
    password?: string;
}
export interface PeopleOptions {
    universe: Universe;
    http: Universe['http'];
}
export declare class People extends EntitiesList<Person, PersonRawPayload> {
    static endpoint: string;
    endpoint: string;
    protected universe: Universe;
    protected apiCarrier: Universe;
    protected http: Universe['http'];
    constructor(options: PeopleOptions);
    protected parseItem(payload: PersonRawPayload): Person;
    getStream(options?: UniverseFetchOptions): Promise<People>;
    exportCsv(options?: UniverseExportCsvOptions): Promise<Blob>;
}
export declare class Address extends UniverseEntity<PersonAddressPayload, PersonAddressRawPayload> {
    protected universe: Universe;
    protected apiCarrier: Universe;
    protected http: Universe['http'];
    protected options: AddressOptions;
    initialized: boolean;
    endpoint: string;
    id?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    person?: string;
    lines?: string[];
    company?: string;
    locality?: string;
    country?: string;
    region?: string;
    postalCode?: string;
    type?: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    comment?: string;
    deleted?: boolean;
    active?: boolean;
    constructor(options: AddressOptions);
    protected deserialize(rawPayload: PersonAddressRawPayload): Address;
    static create(payload: PersonAddressRawPayload, universe: Universe, http: Universe['http']): Address;
    static createUninitialized(payload: PersonAddressRawPayload, universe: Universe, http: Universe['http']): Address;
    serialize(): PersonAddressRawPayload;
    patch(changePart: PersonAddressRawPayload): Promise<Entity<PersonAddressPayload, PersonAddressRawPayload>>;
    applyPatch(patch: RawPatch): Promise<Entity<PersonAddressPayload, PersonAddressRawPayload>>;
}
export declare class Phonenumber extends UniverseEntity<PersonPhonenumberPayload, PersonPhonenumberRawPayload> {
    protected universe: Universe;
    protected apiCarrier: Universe;
    protected http: Universe['http'];
    protected options: PhonenumberOptions;
    initialized: boolean;
    id?: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    comment?: string;
    deleted?: boolean;
    active?: boolean;
    value?: string;
    type?: string;
    person?: string;
    channelUser?: string;
    isPortable?: boolean;
    isProxy?: boolean;
    proxyVendor?: string;
    portability?: object | any | null;
    endpoint: string;
    constructor(options: PhonenumberOptions);
    protected deserialize(rawPayload: PersonPhonenumberRawPayload): Phonenumber;
    static create(payload: PersonPhonenumberRawPayload, universe: Universe, http: Universe['http']): Phonenumber;
    static createUninitialized(payload: PersonPhonenumberRawPayload, universe: Universe, http: Universe['http']): Phonenumber;
    serialize(): PersonPhonenumberRawPayload;
    patch(changePart: PersonPhonenumberRawPayload): Promise<Entity<PersonPhonenumberPayload, PersonPhonenumberRawPayload>>;
    applyPatch(patch: RawPatch): Promise<Entity<PersonPhonenumberPayload, PersonPhonenumberRawPayload>>;
}
export declare class PersonDeleteRemoteError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class PersonFetchOrdersRemoteError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class PersonInitializationError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class PersonFetchRemoteError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class PeopleFetchRemoteError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class PeopleFetchCountRemoteError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class AddressFetchRemoteError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class AddressCreateRemoteError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class AddressPatchRemoteError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class PersonMergeRemoteError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class PersonGDPRGetRemoteError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class PeopleExportRemoteError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class PersonEmailPostRemoteError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class PersonEmailApplyPatchError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class PersonEmailDeleteError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class PersonPreviewNotificationError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class DealsFetchRemoteError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class DealCreateRemoteError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class PhonenumbersFetchRemoteError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class PhonenumberCreateRemoteError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class PhonenumberPatchRemoteError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class PhonenumberApplyPatchRemoteError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export {};
