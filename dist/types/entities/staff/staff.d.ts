/// <reference types="node" />
import { EventEmitter } from 'events';
import { Universe } from '../../universe';
import { BaseError } from '../../errors';
export interface StaffOptions {
    universe: Universe;
    http: Universe['http'];
    rawPayload?: StaffRawPayload;
    initialized?: boolean;
}
export interface StaffRawPayload {
    readonly id?: string;
    readonly created_at?: string;
    readonly updated_at?: string;
    readonly deleted?: boolean;
    readonly active?: boolean;
    readonly first_name?: string;
    readonly middle_name?: string;
    readonly last_name?: string;
    readonly display_name?: string;
    readonly comment?: string;
    readonly type?: 'agent' | 'bot';
}
export interface StaffPayload {
    readonly id?: StaffRawPayload['id'];
    readonly createdAt?: Date | null;
    readonly updatedAt?: Date | null;
    readonly deleted?: boolean;
    readonly active?: boolean;
    readonly firstName?: StaffRawPayload['first_name'];
    readonly middleName?: StaffRawPayload['middle_name'];
    readonly lastName?: StaffRawPayload['last_name'];
    readonly comment?: StaffRawPayload['comment'];
    readonly type?: StaffRawPayload['type'];
}
export declare class Staff extends EventEmitter {
    protected universe: Universe;
    protected http: Universe['http'];
    protected options: StaffOptions;
    initialized: boolean;
    endpoint: string;
    id?: string;
    createdAt?: StaffPayload['createdAt'];
    updatedAt?: StaffPayload['updatedAt'];
    deleted?: StaffPayload['deleted'];
    active?: StaffPayload['active'];
    firstName?: StaffRawPayload['first_name'];
    middleName?: StaffRawPayload['middle_name'];
    lastName?: StaffRawPayload['last_name'];
    comment?: StaffRawPayload['comment'];
    type?: StaffRawPayload['type'];
    constructor(options: StaffOptions);
    private deserialize;
    static create(payload: StaffRawPayload, universe: Universe, http: Universe['http']): Staff;
    serialize(): StaffRawPayload;
    init(): Promise<Staff | undefined>;
    fetch(): Promise<Staff | undefined>;
    private handleError;
}
export declare class Staffs {
    static endpoint: string;
}
export declare class StaffInitializationError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class StaffFetchRemoteError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
export declare class StaffsFetchRemoteError extends BaseError {
    message: string;
    name: string;
    constructor(message?: string, properties?: any);
}
