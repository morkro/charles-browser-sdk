import { EventEmitter } from 'events'
import { Universe } from '../../universe'
import { Feed } from './feed'
import { BaseError } from '../../errors'
import { Message } from '../../messaging/message'

export interface EventOptions {
  universe: Universe
  feed: Feed
  http: Universe['http']
  rawPayload?: EventRawPayload
  initialized?: boolean
}

export interface EventRawPayload {
  readonly id?: string
  readonly resource_type?: 'message' | 'merge' | 'order'
  readonly resource?: string
  readonly payload?: Message | object
  readonly created_at?: string
  readonly updated_at?: string
}

export interface EventPayload {
  readonly id?: EventRawPayload['id']
  readonly resourceType?: EventRawPayload['resource_type']
  readonly resource?: EventRawPayload['resource']
  readonly payload?: EventRawPayload['payload']
  readonly createdAt?: Date | null
  readonly updatedAt?: Date | null
}

export class Event extends EventEmitter {
  protected universe: Universe
  protected feed: Feed
  protected http: Universe['http']
  protected options: EventOptions
  public initialized: boolean

  private endpoint: string
  public id?: string
  public resource?: EventPayload['resource']
  public resourceType?: EventPayload['resourceType']
  public payload?: EventPayload['payload']
  public createdAt?: EventPayload['createdAt']
  public updatedAt?: EventPayload['updatedAt']

  constructor(options: EventOptions) {
    super()
    this.universe = options.universe
    this.feed = options.feed
    this.endpoint = `${this.feed.id}/events`
    this.http = options.http
    this.options = options
    this.initialized = options.initialized || false

    if (options && options.rawPayload) {
      this.deserialize(options.rawPayload)
    }
  }

  private deserialize(rawPayload: EventRawPayload): Event {
    this.id = rawPayload.id
    this.resource = rawPayload.resource
    this.resourceType = rawPayload.resource_type
    this.payload = rawPayload.payload
    this.createdAt = rawPayload.created_at ? new Date(rawPayload.created_at) : undefined
    this.updatedAt = rawPayload.updated_at ? new Date(rawPayload.updated_at) : undefined

    return this
  }

  public static create(payload: EventRawPayload, feed: Feed, universe: Universe, http: Universe['http']): Event {
    return new Event({ rawPayload: payload, universe, http, initialized: true, feed })
  }

  public static createUninitialized(payload: EventRawPayload, feed: Feed, universe: Universe, http: Universe['http']): Event {
    return new Event({ rawPayload: payload, universe, http, initialized: false, feed })
  }

  public serialize(): EventRawPayload {
    return {
      id: this.id,
      resource: this.resource,
      resource_type: this.resourceType,
      payload: this.payload,
      created_at: this.createdAt ? this.createdAt.toISOString() : undefined,
      updated_at: this.updatedAt ? this.updatedAt.toISOString() : undefined
    }
  }

  public async init(): Promise<Event | undefined> {
    try {
      await this.fetch()

      return this
    } catch (err) {
      throw this.handleError(new EventInitializationError(undefined, { error: err }))
    }
  }

  public async fetch(): Promise<Event | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.universe.universeBase}/${this.endpoint}/${this.id}`)

      this.deserialize(res.data.data[0] as EventRawPayload)

      return this
    } catch (err) {
      throw this.handleError(new EventFetchRemoteError(undefined, { error: err }))
    }
  }

  private handleError(err: Error): Error {
    if (this.listeners('error').length > 0) this.emit('error', err)

    return err
  }
}

export class EventInitializationError extends BaseError {
  public name = 'EventInitializationError'
  constructor(public message: string = 'Could not initialize event.', properties?: any) {
    super(message, properties)
  }
}

export class EventFetchRemoteError extends BaseError {
  public name = 'EventFetchRemoteError'
  constructor(public message: string = 'Could not get event.', properties?: any) {
    super(message, properties)
  }
}