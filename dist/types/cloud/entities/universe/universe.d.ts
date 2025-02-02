import { APICarrier } from '../../../base';
import Entity, { EntityOptions } from '../../../entities/_base';
import { BaseError } from '../../../errors';
import type { Cloud } from '../../index';
export interface CloudUniverseOptions extends EntityOptions {
    rawPayload?: CloudUniverseRawPayload;
}
export interface CloudUniverseRawPayload {
    readonly id?: string;
    readonly created_at?: string;
    readonly updated_at?: string;
    readonly deleted?: boolean;
    readonly active?: boolean;
    readonly name?: string | null;
}
export interface CloudUniversePayload {
    readonly id?: CloudUniverseRawPayload['id'];
    readonly createdAt?: Date | null;
    readonly updatedAt?: Date | null;
    readonly deleted?: boolean;
    readonly active?: boolean;
    readonly name?: CloudUniverseRawPayload['name'];
}
export declare class CloudUniverse extends Entity<CloudUniversePayload, CloudUniverseRawPayload> {
    protected apiCarrier: APICarrier;
    protected http: Cloud['http'];
    protected options: CloudUniverseOptions;
    initialized: boolean;
    endpoint: string;
    id?: CloudUniversePayload['id'];
    createdAt?: CloudUniversePayload['createdAt'];
    updatedAt?: CloudUniversePayload['updatedAt'];
    deleted?: CloudUniversePayload['deleted'];
    active?: CloudUniversePayload['active'];
    name?: CloudUniversePayload['name'];
    constructor(options: CloudUniverseOptions);
    protected deserialize(rawPayload: CloudUniverseRawPayload): CloudUniverse;
    static create(payload: CloudUniverseRawPayload, carrier: Cloud, http: Cloud['http']): CloudUniverse;
    serialize(): CloudUniverseRawPayload;
    init(): Promise<CloudUniverse | undefined>;
}
export declare class CloudUniverses {
    static endpoint: string;
}
export declare class CloudUniverseInitializationError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class CloudUniverseFetchRemoteError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class CloudUniversesFetchRemoteError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
