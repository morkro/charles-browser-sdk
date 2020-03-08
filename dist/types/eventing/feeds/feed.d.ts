/// <reference types="node" />
import { EventEmitter } from 'events';
import { Universe } from '../../universe';
import { BaseError } from '../../errors';
import { Reply, MessageRawPayload, MessageReplyContentOptions, ReplyResponse, ReplyOptions } from '../../messaging/message';
import { Event, EventRawPayload } from './event';
export interface FeedOptions {
    universe: Universe;
    http: Universe['http'];
    mqtt: Universe['mqtt'];
    rawPayload?: FeedRawPayload;
    initialized?: boolean;
}
export interface FeedRawPayload {
    readonly id?: string;
    readonly participants?: string[];
    readonly agents?: string[];
    readonly parents?: string[];
    readonly active?: boolean;
    readonly deleted?: boolean;
    readonly created_at?: string;
    readonly updated_at?: string;
}
export declare type FeedlatestEventsRawPayload = EventRawPayload[];
export declare type FeedEventsRawPayload = EventRawPayload[];
export interface FeedPayload {
    readonly id?: string;
    readonly participants?: string[];
    readonly agents?: string[];
    readonly parents?: string[];
    readonly createdAt?: Date | null;
    readonly updatedAt?: Date | null;
    readonly deleted?: boolean;
    readonly active?: boolean;
}
export interface FeedEventKV {
    eventId: Event['id'] | string;
    event: Event;
}
export declare type FeedEventsMap = Map<Event['id'], Event>;
export declare interface Feed {
    on(event: 'raw-error' | 'error', cb: (error: Error) => void): this;
    on(event: 'feed:message' | string, cb: Function): this;
}
export declare class Feed extends EventEmitter {
    protected universe: Universe;
    protected http: Universe['http'];
    protected mqtt?: Universe['mqtt'];
    protected options: FeedOptions;
    initialized: boolean;
    static endpoint: string;
    private eventsMap;
    id?: string;
    participants?: string[];
    agents?: string[];
    parents?: string[];
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deleted?: boolean;
    active?: boolean;
    constructor(options: FeedOptions);
    private deserialize;
    static create(payload: FeedRawPayload, universe: Universe, http: Universe['http'], mqtt: Universe['mqtt']): Feed;
    static createUninitialized(payload: FeedRawPayload, universe: Universe, http: Universe['http'], mqtt: Universe['mqtt']): Feed;
    serialize(): FeedRawPayload;
    reply(contentOptions: FeedReplyContentOptions): FeedReply;
    init(): Promise<Feed | undefined>;
    deinitialize(): void;
    private subscibeDefaults;
    /**
     * Safe access the mqtt client. This has a conequence that all the methods that use it need to be aware that they might throw.
     */
    private getMqttClient;
    /**
     *
     * Parsing and routing logic is being handled here.
     */
    private handleMessage;
    fetch(): Promise<Feed | undefined>;
    fetchLatestEvents(): Promise<Event[] | undefined>;
    fetchEvents(): Promise<Event[] | undefined>;
    events(): Array<Event>;
    getEventsMap(): Feed['eventsMap'];
    private handleError;
}
export declare class Feeds {
    static endpoint: string;
}
export interface FeedReplyContentOptions extends MessageReplyContentOptions {
}
export interface FeedReplyResponse extends ReplyResponse {
}
export interface FeedReplyOptions extends ReplyOptions {
    feed: Feed;
    universe: Universe;
    http: Universe['http'];
    rawPayload?: MessageRawPayload;
}
export declare class FeedReply {
    protected feed: Feed;
    private universe;
    private http;
    content: Reply['content'];
    contentType: Reply['contentType'];
    constructor(options: FeedReplyOptions);
    send(): Promise<FeedReplyResponse | undefined>;
}
export declare class FeedReplyError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class FeedInitializationError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class FeedFetchRemoteError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class FeedFetchLatestEventsRemoteError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class FeedFetchEventsRemoteError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class FeedsFetchRemoteError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}