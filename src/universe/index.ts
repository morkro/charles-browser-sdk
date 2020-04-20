import { Readable } from 'readable-stream'
import { UniverseHealth, UniverseStatus } from './status'
import { Client } from '../client'
import { Feeds, Feed, FeedRawPayload, FeedsFetchRemoteError } from '../eventing/feeds/feed'
import * as realtime from '../realtime'
import { BaseError } from '../errors'
import universeTopics from './topics'
import { Message, MessageRawPayload } from '../messaging'
import * as uuid from '../helpers/uuid'

import { EntityFetchOptions } from '../entities/_base'

import * as staff from '../entities/staff/staff'
import * as asset from '../entities/asset/asset'
import * as person from '../entities/person/person'
import * as channelUser from '../entities/person/channel-user'
import * as email from '../entities/person/email'

import * as product from '../entities/product/product'
import * as ticket from '../entities/ticket/ticket'
import * as cart from '../entities/cart/cart'
import * as order from '../entities/order/order'
import * as discount from '../entities/discount/discount'
import * as messageTemplate from '../entities/message-template/message-template'
import { Product, ProductRawPayload } from '../entities/product/product'

// hygen:import:injection -  Please, don't delete this line: when running the cli for crud resources the new routes will be automatically added here.

export interface UniverseUser {
  id?: string
  accessToken: string
}

export interface UniverseOptions {
  name: string
  http: Client
  base: string
  user: UniverseUser
}

export interface UniversePayload {
  name: string
  id: string
  active: boolean
  deleted: boolean
  organization: string
  configuration: object | null
  updatedAt: Date | null
  createdAt: Date | null
}

export interface UniverseFetchQuery {
  [key: string]: any
}

export interface UniverseFetchOptions {
  raw?: boolean
  query?: UniverseFetchQuery
}

export declare interface Universe {
  on(event: 'raw-error' | 'error', cb: (error: Error) => void): this
  on(event:
  'armed' // currently unused
  | 'universe:message' // receive any message in this universe
  | 'universe:feeds:messages' // receive any message in any feed in this universe
  | 'universe:feeds' // receive notifications about feeds and their updates, also which action happened for that feed
  | string,
    cb: Function): this
}

export interface UnviverseSearchResultItem {
  document: object
}

export interface UnviversePeopleSearchResultItem extends UnviverseSearchResultItem {
  document: {
    id: person.PersonRawPayload['id']
    name: person.PersonRawPayload['name']
    first_name: person.PersonRawPayload['first_name']
    middle_name: person.PersonRawPayload['middle_name']
    last_name: person.PersonRawPayload['last_name']
    created_at: person.PersonRawPayload['created_at']
    avatar: person.PersonRawPayload['avatar']
  }
  feeds: string[]
}

export interface UnviverseFeedsSearchResultItem extends UnviverseSearchResultItem {
  document: {
    id: MessageRawPayload['id']
    date: MessageRawPayload['date']
    feed: MessageRawPayload['feed']
    person: MessageRawPayload['person']
    content: MessageRawPayload['content']
  }
  event: string
  feed: string
  resource_type: 'message'
  person: person.PersonRawPayload
}

export interface UniverseSearches {
  people: Function
  feeds: Function
}

export interface UniverseFeeds {
  fetch: (options?: UniverseFetchOptions) => Promise<Feed[] | FeedRawPayload[] | undefined>
  fromJson: (feeds: FeedRawPayload[]) => Feed[]
  toJson: (feeds: Feed[]) => FeedRawPayload[]
  stream: (options?: UniverseFetchOptions) => Promise<Feeds>
}

export interface UniverseProducts {
  fetch: (options?: EntityFetchOptions) => Promise<Product[] | ProductRawPayload[] | undefined>
  fromJson: (products: ProductRawPayload[]) => Product[]
  toJson: (products: Product[]) => ProductRawPayload[]
}

export interface IUniverseCarts {
  fetch: (options?: UniverseFetchOptions) => Promise<cart.Cart[] | cart.CartRawPayload[] | undefined>
  fromJson: (carts: cart.CartRawPayload[]) => cart.Cart[]
  toJson: (carts: cart.Cart[]) => cart.CartRawPayload[]
}

export type UniversePermissionType =
  | 'admin'

export type UniverseRoleType =
  | 'admin'

export interface MeData {
  user: {
    email: string
    /**
     * user id
     */
    sub: string
  }
  permissions: UniversePermissionType[]
  roles: UniversePermissionType[]
  staff: staff.StaffRawPayload
}

/**
 * The unsiverse is usually the base entitiy one wants to build upon. Consider it a project, product
 * or namespace for data.
 *
 * It also allows easy access to remote states of entities, such as:
 *
 * ```js
 * await universe.feeds.fetch()
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
export class Universe extends Readable {
  public status: UniverseStatus
  public health: UniverseHealth
  public options: UniverseOptions
  public name: UniverseOptions['name']

  public initialized = false
  public payload: UniversePayload | null = null
  public user: UniverseUser

  protected http: Client
  private mqtt: realtime.RealtimeClient | null = null
  public base: string
  public universeBase: string
  private static readonly endpoint: string = 'api/v0/universes'

  public constructor (options: UniverseOptions) {
    super()

    this.options = options
    this.name = options.name
    this.user = options.user
    this.base = this.options.base ?? 'https://hello-charles.com'
    this.universeBase = `https://${this.name}.hello-charles.com`

    this.status = new UniverseStatus({ universe: this })
    this.health = new UniverseHealth({ universe: this })
    this.http = options.http

    return this
  }

  public async init (): Promise<Universe | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.base}/${Universe.endpoint}/${this.name}`)

      this.setInitialized(res.data.data[0])
      this.setMqttClient()

      return this
    } catch (err) {
      throw new UniverseInitializationError(undefined, { error: err })
    }
  }

  private static parsePayload (payload: any): UniversePayload {
    return {
      createdAt: new Date(payload.created_at) ?? null,
      updatedAt: new Date(payload.updated_at) ?? null,
      id: payload.id,
      organization: payload.organization,
      active: payload.active,
      deleted: payload.deleted,
      configuration: payload.configuration,
      name: payload.name
    }
  }

  private setInitialized (payload: any): Universe {
    this.payload = Universe.parsePayload(payload)
    this.initialized = true
    return this
  }

  private setMqttClient (): void {
    const realtimeOpts = {
      base: `wss:${this.name}.hello-charles.com`,
      username: this.user.id ?? 'charles-browser-sdk',
      password: this.user.accessToken
    }

    this.mqtt = new realtime.RealtimeClient(realtimeOpts)
    this.mqtt.on('message', (msg) => {
      this.handleMessage(msg)
    })
    this.subscibeDefaults()
  }

  private get defaultSubscriptions (): string[] {
    return [
      universeTopics.api.message.generateTopic(),
      universeTopics.api.feeds.generateTopic(),
      universeTopics.api.feedsActivities.generateTopic(),
      universeTopics.api.feedsMessages.generateTopic()
    ]
  }

  private subscibeDefaults (): void {
    this.getMqttClient()
      .subscribe(this.defaultSubscriptions)
  }

  /**
   *
   * Parsing and routing logic is being handled here. We take extensive decisions about type and destinations here.
   */
  private handleMessage (msg: realtime.RealtimeMessage | realtime.RealtimeMessageMessage): void {
    // each arming message will cause an unsubscription
    if (universeTopics.api.clients.arm.isTopic(msg.topic)) {
      this.emit('armed', msg)
      this.getMqttClient().unsubscribe(msg.topic)
      this.emit('message', msg)
      return
    }

    if (universeTopics.api.message.isTopic(msg.topic)) {
      let message
      if ((msg as realtime.RealtimeMessageMessage).payload.message) {
        message = Message.deserialize((msg as realtime.RealtimeMessageMessage).payload.message as MessageRawPayload, this, this.http)
      }
      this.emit('universe:message', { ...msg, message })
      return
    }

    if (universeTopics.api.feedsMessages.isTopic(msg.topic)) {
      let message
      let feed
      if ((msg as realtime.RealtimeFeedsMessages).payload.message) {
        message = Message.deserialize((msg as realtime.RealtimeFeedsMessages).payload.message as MessageRawPayload, this, this.http)
        feed = Feed.create((msg as realtime.RealtimeFeedsMessages).payload.feed as FeedRawPayload, this, this.http, this.mqtt)
      }
      this.emit('universe:feeds:messages', { ...msg, message, feed })
      return
    }

    if (universeTopics.api.feeds.isTopic(msg.topic)) {
      let feed
      if ((msg as realtime.RealtimeFeeds).payload.feed) {
        feed = Feed.create((msg as realtime.RealtimeFeeds).payload.feed as FeedRawPayload, this, this.http, this.mqtt)
      }
      this.emit('universe:feeds', { ...msg, feed, action: (msg as realtime.RealtimeFeeds).payload.action })
      return
    }

    this.emit('message', msg)
  }

  /**
   * Safe access the mqtt client. This has a conequence that all the methods that use it need to be aware that they might throw.
   */
  private getMqttClient (): realtime.RealtimeClient {
    if (this.mqtt) return this.mqtt

    throw new realtime.UninstantiatedRealtimeClient()
  }

  public create (options: UniverseOptions): Universe {
    return new Universe(options)
  }

  /**
   * In order to notify backends about the universe leaving we will try to
   * unsubscripe from topics before destroying. In any case all event handlers are gone
   * immediately.
   *
   */
  public deinitialize (): void {
    this.removeAllListeners()
    const client = this.getMqttClient()

    client.unsubscribe(this.defaultSubscriptions, function () {
      client.destroy()
    })
  }

  public get ready (): boolean {
    // TODO: implement
    return false
  }

  public isReady (): boolean {
    // TODO: implement
    return false
  }

  public get connected (): boolean {
    // TODO: implement
    return false
  }

  public isConnected (): boolean {
    // TODO: implement
    return false
  }

  private handleError (err: Error): void {
    if (this.listeners('error').length > 0) this.emit('error', err)
  }

  public feed (payload: FeedRawPayload): Feed {
    return Feed.create(payload, this, this.http, this.mqtt)
  }

  public product (payload: product.ProductRawPayload): product.Product {
    return product.Product.create(payload, this, this.http)
  }

  public staff (payload: staff.StaffRawPayload): staff.Staff {
    return staff.Staff.create(payload, this, this.http)
  }

  public asset (payload: asset.AssetRawPayload): asset.Asset {
    return asset.Asset.create(payload, this, this.http)
  }

  public cart (payload: cart.CartRawPayload): cart.Cart {
    return cart.Cart.create(payload, this, this.http)
  }

  public order (payload: order.OrderRawPayload): order.Order {
    return order.Order.create(payload, this, this.http)
  }

  public person (payload: person.PersonRawPayload): person.Person {
    return person.Person.create(payload, this, this.http)
  }

  public address (payload: person.PersonAddressRawPayload): person.Address {
    return person.Address.create(payload, this, this.http)
  }

  public phonenumber (payload: person.PersonPhonenumberRawPayload): person.Phonenumber {
    return person.Phonenumber.create(payload, this, this.http)
  }

  public channelUser (payload: person.PersonChannelUserRawPayload): channelUser.ChannelUser {
    return channelUser.ChannelUser.create(payload, this, this.http)
  }

  public email (payload: person.PersonEmailRawPayload): email.Email {
    return email.Email.create(payload, this, this.http)
  }

  public ticket (payload: ticket.TicketRawPayload): ticket.Ticket {
    return ticket.Ticket.create(payload, this, this.http)
  }

  public discount (payload: discount.DiscountRawPayload): discount.Discount {
    return discount.Discount.create(payload, this, this.http)
  }

  public messageTemplate (payload: messageTemplate.MessageTemplateRawPayload): messageTemplate.MessageTemplate {
    return messageTemplate.MessageTemplate.create(payload, this, this.http)
  }

  // hygen:factory:injection -  Please, don't delete this line: when running the cli for crud resources the new routes will be automatically added here.

  /**
   * Fetch the data of the current user. If you receive an instane of UniverseUnauthenticatedError
   * you should logout the current session and create a new one.
   */
  public async me (): Promise<MeData | undefined> {
    try {
      const opts = {
        method: 'GET',
        url: `${this.universeBase}/api/v0/me`
      }

      const response = await this.http.getClient()(opts)

      return response.data.data
    } catch (err) {
      if (err.response.status === 401) {
        throw new UniverseUnauthenticatedError(undefined, { error: err })
      }

      throw new UniverseMeError(undefined, { error: err })
    }
  }

  /**
   * Feeds accessor
   *
   * ```js
   * // fetch all feeds with regular defaults (as class instance list)
   * await universe.feeds.fetch()
   * // fetch all feeds as raw structs with some query options
   * await universe.feeds.fetch({ raw: true, query: { embed: ['participants', 'top_latest_events'] } })
   * // cast a list of class instances to list of structs
   * universe.feeds.toJson([feed])
   * // cast a list of structs to list of class instances
   * universe.feeds.fromJson([feed])
   * ```
   */
  public get feeds (): UniverseFeeds {
    return {
      fromJson: (payloads: FeedRawPayload[]): Feed[] => {
        return payloads.map((item) => (Feed.create(item, this, this.http, this.mqtt)))
      },
      toJson: (feeds: Feed[]): FeedRawPayload[] => {
        return feeds.map((item) => (item.serialize()))
      },
      fetch: async (options?: UniverseFetchOptions): Promise<Feed[] | FeedRawPayload[] | undefined> => {
        try {
          const opts = {
            method: 'GET',
            url: `${this.universeBase}/${Feeds.endpoint}`,
            params: {
              ...(options?.query ?? {}),
              embed: options?.query?.embed ?? [
                'participants',
                'top_latest_events',
                'top_latest_messages'
              ]
            }
          }

          const res = await this.http.getClient()(opts)
          const feeds = res.data.data as FeedRawPayload[]

          if (options && options.raw === true) {
            return feeds
          }

          return feeds.map((feed: FeedRawPayload) => {
            return Feed.create(feed, this, this.http, this.mqtt)
          })
        } catch (err) {
          throw new FeedsFetchRemoteError(undefined, { error: err })
        }
      },
      stream: async (options?: UniverseFetchOptions): Promise<Feeds> => {
        const inst = new Feeds({
          universe: this,
          http: this.http,
          mqtt: this.mqtt
        })

        const ret = await inst.getStream(options)

        return ret
      }
    }
  }

  public async staffs (): Promise<staff.Staff[] | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.universeBase}/${staff.Staffs.endpoint}`)
      const resources = res.data.data as staff.StaffRawPayload[]

      return resources.map((resource: staff.StaffRawPayload) => {
        return staff.Staff.create(resource, this, this.http)
      })
    } catch (err) {
      throw new staff.StaffsFetchRemoteError(undefined, { error: err })
    }
  }

  public async assets (): Promise<asset.Asset[] | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.universeBase}/${asset.Assets.endpoint}`)
      const resources = res.data.data as asset.AssetRawPayload[]

      return resources.map((resource: asset.AssetRawPayload) => {
        return asset.Asset.create(resource, this, this.http)
      })
    } catch (err) {
      throw new asset.AssetsFetchRemoteError(undefined, { error: err })
    }
  }

  public async people (): Promise<person.Person[] | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.universeBase}/${person.People.endpoint}`)
      const resources = res.data.data as person.PersonRawPayload[]

      return resources.map((resource: person.PersonRawPayload) => {
        return person.Person.create(resource, this, this.http)
      })
    } catch (err) {
      throw new person.PeopleFetchRemoteError(undefined, { error: err })
    }
  }

  public get products (): UniverseProducts {
    return {
      fromJson: (payloads: ProductRawPayload[]): Product[] => {
        return payloads.map((item) => (Product.create(item, this, this.http)))
      },
      toJson: (products: Product[]): ProductRawPayload[] => {
        return products.map((item) => (item.serialize()))
      },
      fetch: async (options?: EntityFetchOptions): Promise<product.Product[] | undefined> => {
        try {
          const opts = {
            method: 'GET',
            url: `${this.universeBase}/${product.Products.endpoint}`,
            params: {
              // ...(options?.query ?? {}), no other options (raw etc) available for GET products atm
              embed: options?.query?.embed ?? 'options'
            }
          }
          const res = await this.http.getClient()(opts)
          const resources = res.data.data as product.ProductRawPayload[]

          return resources.map((resource: product.ProductRawPayload) => {
            return product.Product.create(resource, this, this.http)
          })
        } catch (err) {
          throw new product.ProductsFetchRemoteError(undefined, { error: err })
        }
      }
    }
  }

  public async tickets (): Promise<ticket.Ticket[] | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.universeBase}/${ticket.Tickets.endpoint}`)
      const resources = res.data.data as ticket.TicketRawPayload[]

      return resources.map((resource: ticket.TicketRawPayload) => {
        return ticket.Ticket.create(resource, this, this.http)
      })
    } catch (err) {
      throw new ticket.TicketsFetchRemoteError(undefined, { error: err })
    }
  }

  /**
   * Carts accessor
   *
   * ```js
   * // fetch all carts with regular defaults (as class instance list)
   * await universe.carts.fetch()
   * // fetch all carts as raw structs with some query options
   * await universe.carts.fetch({ raw: true })
   * // cast a list of class instances to list of structs
   * universe.carts.toJson([feed])
   * // cast a list of structs to list of class instances
   * universe.carts.fromJson([feed])
   * ```
   */
  public get carts (): IUniverseCarts {
    return {
      fromJson: (payloads: cart.CartRawPayload[]): cart.Cart[] => {
        return payloads.map((item) => (cart.Cart.create(item, this, this.http)))
      },
      toJson: (carts: cart.Cart[]): cart.CartRawPayload[] => {
        return carts.map((item) => (item.serialize()))
      },
      fetch: async (options?: UniverseFetchOptions): Promise<cart.Cart[] | cart.CartRawPayload[] | undefined> => {
        try {
          const opts = {
            method: 'GET',
            url: `${this.universeBase}/${cart.Carts.endpoint}`,
            params: {
              ...(options?.query ?? {})
            }
          }
          const res = await this.http.getClient()(opts)
          const resources = res.data.data as cart.CartRawPayload[]

          if (options && options.raw === true) {
            return resources
          }

          return resources.map((resource: cart.CartRawPayload) => {
            return cart.Cart.create(resource, this, this.http)
          })
        } catch (err) {
          throw new cart.CartsFetchRemoteError(undefined, { error: err })
        }
      }
    }
  }

  public async orders (): Promise<order.Order[] | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.universeBase}/${order.Orders.endpoint}`)
      const resources = res.data.data as order.OrderRawPayload[]

      return resources.map((resource: order.OrderRawPayload) => {
        return order.Order.create(resource, this, this.http)
      })
    } catch (err) {
      throw new order.OrdersFetchRemoteError(undefined, { error: err })
    }
  }

  public async discounts (): Promise<discount.Discount[] | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.universeBase}/${discount.Discounts.endpoint}`)
      const resources = res.data.data as discount.DiscountRawPayload[]

      return resources.map((resource: discount.DiscountRawPayload) => {
        return discount.Discount.create(resource, this, this.http)
      })
    } catch (err) {
      throw new discount.DiscountsFetchRemoteError(undefined, { error: err })
    }
  }

  public async messageTemplates (): Promise<messageTemplate.MessageTemplate[] | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.universeBase}/${messageTemplate.MessageTemplates.endpoint}`)
      const resources = res.data.data as messageTemplate.MessageTemplateRawPayload[]

      return resources.map((resource: messageTemplate.MessageTemplateRawPayload) => {
        return messageTemplate.MessageTemplate.create(resource, this, this.http)
      })
    } catch (err) {
      throw new messageTemplate.MessageTemplatesFetchRemoteError(undefined, { error: err })
    }
  }

  // hygen:handler:injection -  Please, don't delete this line: when running the cli for crud resources the new routes will be automatically added here.

  /**
   * Arm the client by retrieving latest data. Arming emits to the server and listens for the response once.
   */
  public arm (): Universe {
    const mqtt = this.getMqttClient()
    const topicString = universeTopics.api.clients.arm.generateTopic({ client: uuid.v4() })
    // NOTE: this requires unsubscribing from this topic in the armed listener
    mqtt.subscribe(topicString, (err?: Error) => {
      if (err) {
        return this.handleError(err)
      }

      mqtt.publish(topicString)
    })

    return this
  }

  /**
   * Gets executable search
   *
   * @example
   * await universe.search.people('Your Name')
   */
  public get search (): UniverseSearches {
    return {
      people: async (q: string): Promise<UnviversePeopleSearchResultItem[]> => {
        return await this.searchEntity<UnviversePeopleSearchResultItem[]>(person.People.endpoint, q)
      },
      feeds: async (q: string): Promise<UnviverseFeedsSearchResultItem[]> => {
        return await this.searchEntity<UnviverseFeedsSearchResultItem[]>(Feeds.endpoint, q)
      }
    }
  }

  /**
   * Execute search for a given entity
   * @ignore
   * @param endpoint
   * @param q
   */
  private async searchEntity<T>(endpoint: string, q: string): Promise<T> {
    try {
      const res = await this.http.getClient().get(`${this.universeBase}/${endpoint}/search`, {
        params: {
          q
        }
      })
      return res.data.data
    } catch (err) {
      throw new UniverseSearchError(undefined, { error: err })
    }
  }
}

export class UnviverseSingleton extends Universe {
  private static instance: Universe

  // constructor (options: UniverseOptions) {
  //   super(options)
  // }

  static getInstance (options: UniverseOptions): Universe {
    if (!UnviverseSingleton.instance) {
      UnviverseSingleton.instance = new UnviverseSingleton(options)
    }

    return UnviverseSingleton.instance
  }

  static clearInstance (): void {
    UnviverseSingleton.instance.deinitialize()
  }
}

export class UniverseInitializationError extends BaseError {
  public name = 'UniverseInitializationError'
  constructor (public message: string = 'Could not initialize universe.', properties?: any) {
    super(message, properties)
  }
}

export class UniverseSearchError extends BaseError {
  public name = 'UniverseSearchError'
  constructor (public message: string = 'Could not fulfill search unexpectedly.', properties?: any) {
    super(message, properties)
  }
}

export class UniverseUnauthenticatedError extends BaseError {
  public name = 'UniverseUnauthenticatedError'
  constructor (public message: string = 'Invalid or expired session.', properties?: any) {
    super(message, properties)

    Object.setPrototypeOf(this, UniverseUnauthenticatedError.prototype)
  }
}

export class UniverseMeError extends BaseError {
  public name = 'UniverseMeError'
  constructor (public message: string = 'Unexptected error fetching me data', properties?: any) {
    super(message, properties)

    Object.setPrototypeOf(this, UniverseMeError.prototype)
  }
}
