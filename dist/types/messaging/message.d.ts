/// <reference types="node" />
import { EventEmitter } from 'events';
import { Universe } from '../universe';
import { BaseError } from '../errors';
export interface MessageOptions {
    universe: Universe;
    http: Universe['http'];
    rawPayload?: MessageRawPayload;
}
export interface MessageRawPayload {
    readonly id?: string;
    readonly source_type?: string;
    readonly source_api?: string;
    readonly tz?: string;
    readonly date?: string;
    readonly content_type?: string;
    readonly content?: {
        body?: string | null;
    };
    readonly external_reference_id?: string;
    readonly external_person_reference_id?: string;
    readonly external_channel_reference_id?: string;
    readonly raw_message?: string;
    readonly created_at?: string;
    readonly updated_at?: string;
    readonly raw_payload?: string;
    readonly broker?: string;
    readonly deleted?: string;
    readonly is_processed?: string;
    readonly processed_data?: string;
    readonly replyables?: {
        reply_to_message?: {
            deadline: string | null;
            type: 'http' | string | null;
            options: {
                method: 'POST' | string;
                uri: 'string';
            };
        };
    };
}
export interface MessagePayload {
    readonly id?: string;
    readonly sourceType?: string;
    readonly sourceApi?: string;
    readonly tz?: string;
    readonly date?: Date | null;
    readonly contentType?: string;
    readonly content?: {
        body?: string | null;
    };
    readonly externalReferenceId?: string;
    readonly externalPersonReferenceId?: string;
    readonly externalChannelReferenceId?: string;
    readonly rawMessage?: string;
    readonly createdAt?: Date | null;
    readonly updatedAt?: Date | null;
    readonly rawPayload?: string;
    readonly broker?: string;
    readonly deleted?: string;
    readonly isProcessed?: string;
    readonly processedData?: string;
    readonly replyables?: MessageRawPayload['replyables'] | null;
}
export interface Message extends MessagePayload {
}
export declare class Message extends EventEmitter {
    protected universe: Universe;
    protected http: Universe['http'];
    protected options: MessageOptions;
    readonly id?: string;
    readonly sourceType?: string;
    readonly sourceApi?: string;
    readonly tz?: string;
    readonly date?: Date | null;
    contentType?: string;
    content?: {
        body?: string | null;
    };
    readonly externalReferenceId?: string;
    readonly externalPersonReferenceId?: string;
    readonly externalChannelReferenceId?: string;
    readonly rawMessage?: string;
    readonly createdAt?: Date | null;
    readonly updatedAt?: Date | null;
    readonly rawPayload?: string;
    readonly broker?: string;
    readonly deleted?: string;
    readonly isProcessed?: string;
    readonly processedData?: string;
    readonly replyables?: MessageRawPayload['replyables'];
    constructor(options: MessageOptions);
    static deserialize(payload: MessageRawPayload, universe: Universe, http: Universe['http']): Message;
    serialize(): MessageRawPayload;
    reply(contentOptions: MessageReplyContentOptions): MessageReply;
    private handleError;
}
export interface MessageReplyContentOptions {
    content: MessagePayload['content'];
}
export interface ReplyOptions extends MessageOptions, MessageReplyContentOptions {
}
export interface MessageReplyOptions extends ReplyOptions {
    message: Message;
}
export interface ReplyResponse extends MessageRawPayload {
}
declare class Reply extends Message {
    constructor(options: ReplyOptions);
}
declare class MessageReply extends Reply {
    private message;
    constructor(options: MessageReplyOptions);
    send(): Promise<ReplyResponse | undefined>;
}
export declare class MessagesReplyError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export {};
