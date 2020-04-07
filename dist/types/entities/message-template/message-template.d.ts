import Entity, { EntityOptions } from '../_base';
import { Universe } from '../../universe';
import { BaseError } from '../../errors';
export interface MessageTemplateOptions extends EntityOptions {
    rawPayload?: MessageTemplateRawPayload;
}
export interface MessageTemplateRawPayloadAttachment {
    type: 'image' | 'document' | string;
    mime_type?: string;
    payload: string | null | object;
}
export interface MessageTemplateRawPayload {
    readonly id?: string;
    readonly created_at?: string;
    readonly updated_at?: string;
    readonly deleted?: boolean;
    readonly active?: boolean;
    readonly is_proxy?: boolean;
    readonly approved?: boolean;
    readonly name?: string;
    readonly comment?: string;
    readonly proxy_vendor?: string;
    readonly content?: {
        body?: string | null;
        attachments?: MessageTemplateRawPayloadAttachment[] | null;
        i18n: {
            locale: string;
            body?: string;
            attachments?: MessageTemplateRawPayloadAttachment[];
        }[] | null;
    } | null;
    readonly configuration?: object;
    readonly payload?: object;
    readonly metadata?: object;
}
export interface MessageTemplatePayload {
    readonly id?: MessageTemplateRawPayload['id'];
    readonly createdAt?: Date | null;
    readonly updatedAt?: Date | null;
    readonly deleted?: MessageTemplateRawPayload['deleted'];
    readonly active?: MessageTemplateRawPayload['active'];
    readonly isProxy?: MessageTemplateRawPayload['is_proxy'];
    readonly approved?: MessageTemplateRawPayload['approved'];
    readonly name?: MessageTemplateRawPayload['name'];
    readonly comment?: MessageTemplateRawPayload['comment'];
    readonly proxyVendor?: MessageTemplateRawPayload['proxy_vendor'];
    readonly content?: MessageTemplateRawPayload['content'];
    readonly configuration?: MessageTemplateRawPayload['configuration'];
    readonly payload?: MessageTemplateRawPayload['payload'];
    readonly metadata?: MessageTemplateRawPayload['metadata'];
}
/**
 * Manage messagetemplates.
 *
 * @category Entity
 */
export declare class MessageTemplate extends Entity<MessageTemplatePayload, MessageTemplateRawPayload> {
    protected universe: Universe;
    protected http: Universe['http'];
    protected options: MessageTemplateOptions;
    initialized: boolean;
    endpoint: string;
    id?: MessageTemplatePayload['id'];
    createdAt?: MessageTemplatePayload['createdAt'];
    updatedAt?: MessageTemplatePayload['updatedAt'];
    deleted?: MessageTemplatePayload['deleted'];
    active?: MessageTemplatePayload['active'];
    isProxy?: MessageTemplatePayload['isProxy'];
    approved?: MessageTemplatePayload['approved'];
    name?: MessageTemplatePayload['name'];
    comment?: MessageTemplatePayload['comment'];
    proxyVendor?: MessageTemplatePayload['proxyVendor'];
    content?: MessageTemplatePayload['content'];
    configuration?: MessageTemplatePayload['configuration'];
    payload?: MessageTemplatePayload['payload'];
    metadata?: MessageTemplatePayload['metadata'];
    constructor(options: MessageTemplateOptions);
    protected deserialize(rawPayload: MessageTemplateRawPayload): MessageTemplate;
    static create(payload: MessageTemplateRawPayload, universe: Universe, http: Universe['http']): MessageTemplate;
    serialize(): MessageTemplateRawPayload;
    init(): Promise<MessageTemplate | undefined>;
}
export declare class MessageTemplates {
    static endpoint: string;
}
export declare class MessageTemplateInitializationError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class MessageTemplateFetchRemoteError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class MessageTemplatesFetchRemoteError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}