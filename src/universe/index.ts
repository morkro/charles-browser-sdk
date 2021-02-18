import { Readable } from 'readable-stream'
import qs from 'qs'
import { UniverseHealth, UniverseStatus } from './status'
import { Client } from '../client'
import { Feeds, Feed, FeedRawPayload, FeedsFetchRemoteError, FeedFetchCountRemoteError } from '../eventing/feeds/feed'
import * as realtime from '../realtime'
import { BaseError } from '../errors'
import universeTopics from './topics'
import { Message, MessageRawPayload } from '../messaging'
import * as uuid from '../helpers/uuid'

import { EntityFetchOptions, EntityFetchQuery } from '../entities/_base'

import {
  ANALYTICS_ENDPOINT,
  AnalyticsFetchRemoteError,
  AnalyticsReport
} from '../analytics/analytics'

import * as staff from '../entities/staff/staff'
import * as track from '../entities/track/track'
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
import { Event, EventRawPayload } from '../eventing/feeds/event'
import * as productCategory from '../entities/product-category/product-category'
import * as productCategoryTree from '../entities/product-category-tree/product-category-tree'
import * as messageTemplateCategory from '../entities/message-template-category/message-template-category'
import * as messageTemplateCategoryTree from '../entities/message-template-category-tree/message-template-category-tree'
import * as customProperty from '../entities/custom-property/custom-property'
import * as tag from '../entities/tag/tag'
import * as tagGroup from '../entities/tag-group/tag-group'
import * as configuration from '../entities/configuration/configuration'
import * as inventory from '../entities/inventory/inventory'
import * as integration from '../entities/integration/integration'
import * as messageBroker from '../entities/message-broker/message-broker'
import * as storefront from '../entities/storefront/storefront'
import * as shippingMethod from '../entities/shipping-method/shipping-method'
import * as route from '../entities/route/route'
import * as thing from '../entities/thing/thing'
import * as nlu from '../entities/nlu/nlu'
import * as intent from '../entities/intent/intent'
import * as message from '../messaging/message'
import * as location from '../entities/location/location'
import * as contactList from '../entities/contact-list/contact-list'
import * as notificationCampaign from '../entities/notification-campaign/notification-campaign'
import * as favorite from '../entities/favorite/favorite'
import * as knowledgeBase from '../entities/knowledge-base/knowledge-base'
import * as knowledgeBaseFaqItem from '../entities/knowledge-base-faq-item/knowledge-base-faq-item'
import * as crm from '../entities/crm/crm'

// hygen:import:injection -  Please, don't delete this line: when running the cli for crud resources the new routes will be automatically added here.

export interface UniverseUser {
  id?: string
  accessToken: string
}

/**
 * The universe options are the base struct to steer subsequent API
 * calls. NOTE: override the universe base e.g. in proxied contexts or local development.
 */
export interface UniverseOptions {
  /**
   * name of the univserse, namely the left most split part of a charles URL
   * e.g. `charlest-test` in `https://charles-test.hello-charles.com`. By default
   * the name constructs the universe URL.
   */
  name: string
  /**
   * The override of the universe base URL. It overrides the above mentioned computation.
   */
  universeBase?: string
  /**
   * The override of the universe base URL. It overrides the above mentioned computation.
   */
  mqttUniverseBase?: string

  http: Client
  /**
   * the API base of the general charles services.
   */
  base: string
  /**
   * The user ID of a charles user that is available inside of an universe.
   */
  user: UniverseUser
}

export interface ApiRequestOptions {
  method: string
  path: string
  data?: object
  query?: EntityFetchQuery
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
export interface UniverseExportCsvOptions {
  query?: UniverseFetchQuery
}

export declare interface Universe {
  on: ((event: 'raw-error' | 'error', cb: (error: Error) => void) => this) & ((event:
  'armed' // currently unused
  | 'universe:message' // receive any message in this universe
  | 'universe:feeds:messages' // receive any message in any feed in this universe
  | 'universe:feeds:events' // receive any event in any feed in this universe
  | 'universe:feeds' // receive notifications about feeds and their updates, also which action happened for that feed
  | string,
    cb: Function) => this)
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

export interface UnviverseProductsSearchResultItem extends UnviverseSearchResultItem {
  document: {
    id: product.ProductRawPayload['id']
    created_at: product.ProductRawPayload['created_at']
    updated_at: product.ProductRawPayload['updated_at']
    name: product.ProductRawPayload['name']
    summary: product.ProductRawPayload['summary']
    description: product.ProductRawPayload['description']
    type: product.ProductRawPayload['type']
    assets_config: product.ProductRawPayload['assets_config']
  }
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
  people: (q: string) => Promise<UnviversePeopleSearchResultItem[]>
  feeds: (q: string) => Promise<UnviverseFeedsSearchResultItem[]>
  products: (q: string) => Promise<UnviverseProductsSearchResultItem[]>
}

/* Analytics */
export interface UniverseAnalyticsOptions {
  start: string
  timezone: string
  end: string
  period?: string
}

export interface UniverseAnalytics {
  orders: (options: UniverseAnalyticsOptions) => Promise<AnalyticsReport[] | undefined>
  revenues: (options: UniverseAnalyticsOptions) => Promise<AnalyticsReport[] | undefined>
  xau: (options: UniverseAnalyticsOptions) => Promise<AnalyticsReport[] | undefined>
  feedOpenedClosed: (options: UniverseAnalyticsOptions) => Promise<AnalyticsReport[] | undefined>
  feedConversion: (options: UniverseAnalyticsOptions) => Promise<AnalyticsReport[] | undefined>
  peopleMessagingChannelParticipationDistribution: (options: UniverseAnalyticsOptions) => Promise<AnalyticsReport[] | undefined>
}

export interface UniverseFeeds {
  fetch: (options?: UniverseFetchOptions) => Promise<Feed[] | FeedRawPayload[] | undefined>
  fetchCount: (options?: UniverseFetchOptions) => Promise<{ count: number }>
  fromJson: (feeds: FeedRawPayload[]) => Feed[]
  toJson: (feeds: Feed[]) => FeedRawPayload[]
  stream: (options?: UniverseFetchOptions) => Promise<Feeds>
}

export interface UniversePeople {
  fetch: (options?: UniverseFetchOptions) => Promise<person.Person[] | person.PersonRawPayload[] | undefined>
  fetchCount: (options?: UniverseFetchOptions) => Promise<{ count: number }>
  fromJson: (feeds: person.PersonRawPayload[]) => person.Person[]
  toJson: (feeds: person.Person[]) => person.PersonRawPayload[]
  stream: (options?: UniverseFetchOptions) => Promise<person.People>
  export: (options?: UniverseExportCsvOptions) => Promise<Blob>
}

export interface UniverseTracks {
  fromJson: (payloads: track.TrackRawPayload[]) => track.Track[]
  toJson: (feeds: track.Track[]) => track.TrackRawPayload[]
  fetch: (options?: EntityFetchOptions) => Promise<track.Track[] | track.TrackRawPayload[] | undefined>
  fetchCount: (options?: EntityFetchOptions) => Promise<{ count: number }>
  current: (options?: EntityFetchOptions) => Promise<track.Track[] | track.TrackRawPayload[] | undefined>
}

export interface UniverseProducts {
  fetch: (options?: EntityFetchOptions) => Promise<Product[] | ProductRawPayload[] | undefined>
  fromJson: (products: ProductRawPayload[]) => Product[]
  toJson: (products: Product[]) => ProductRawPayload[]
  fetchCount: (options?: EntityFetchOptions) => Promise<{ count: number }>
}

export interface IUniverseCarts {
  fetch: (options?: UniverseFetchOptions) => Promise<cart.Cart[] | cart.CartRawPayload[] | undefined>
  fromJson: (carts: cart.CartRawPayload[]) => cart.Cart[]
  toJson: (carts: cart.Cart[]) => cart.CartRawPayload[]
  fetchCount: (options?: EntityFetchOptions) => Promise<{ count: number }>
}
export interface IUniverseOrders {
  fetch: (options?: UniverseFetchOptions) => Promise<order.Order[] | order.OrderRawPayload[] | undefined>
  fromJson: (orders: order.OrderRawPayload[]) => order.Order[]
  toJson: (orders: order.Order[]) => order.OrderRawPayload[]
  fetchCount: (options?: EntityFetchOptions) => Promise<{ count: number }>
  export: (options?: UniverseExportCsvOptions) => Promise<Blob>
}
export interface IUniverseContactLists {
  fetch: (options?: UniverseFetchOptions) => Promise<contactList.ContactList[] | contactList.ContactListRawPayload[] | undefined>
  fromJson: (contactLists: contactList.ContactListRawPayload[]) => contactList.ContactList[]
  toJson: (contactLists: contactList.ContactList[]) => contactList.ContactListRawPayload[]
  fetchCount: (options?: EntityFetchOptions) => Promise<{ count: number }>
}
export interface IUniverseNotificationCampaigns {
  fetch: (options?: UniverseFetchOptions) => Promise<notificationCampaign.NotificationCampaign[] | notificationCampaign.NotificationCampaignRawPayload[] | undefined>
  fromJson: (notificationCampaigns: notificationCampaign.NotificationCampaignRawPayload[]) => notificationCampaign.NotificationCampaign[]
  toJson: (notificationCampaigns: notificationCampaign.NotificationCampaign[]) => notificationCampaign.NotificationCampaignRawPayload[]
  fetchCount: (options?: EntityFetchOptions) => Promise<{ count: number }>
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

interface BaseResourceCreateable<T, K> {
  new(...args: any[]): T
  create: (payload: K, universe: Universe, http: Universe['http']) => T
}

interface BaseResourceList<T> {
  endpoint: string
  new(...args: any[]): T
}

type BaseResourceErrorProto<E> = new(...args: any[]) => E

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type BaseResourceEntityFetchOptions<O> = EntityFetchOptions

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
 * universe.on('universe:feeds:events', (p) => {
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
  public mqttUniverseBase: string
  private static readonly endpoint: string = 'api/v0/universes'

  public constructor (options: UniverseOptions) {
    super()

    this.options = options
    this.name = options.name
    this.user = options.user
    this.base = this.options.base ?? 'https://hello-charles.com'
    this.universeBase = options.universeBase ?? `https://${this.name}.hello-charles.com`
    this.mqttUniverseBase = options.mqttUniverseBase ?? `wss://${this.name}.hello-charles.com`

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

      this.getMqttClient().on('error', (error) => {
        this.handleError(error)
      })

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
      base: this.mqttUniverseBase,
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
      universeTopics.api.feedsMessages.generateTopic(),
      universeTopics.api.feedsEvents.generateTopic(),
      universeTopics.api.people.generateTopic()
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

    if (universeTopics.api.feedsEvents.isTopic(msg.topic)) {
      let event
      let feed
      if ((msg as realtime.RealtimeMessageMessage).payload.event) {
        const feedPayload: FeedRawPayload = { id: (msg as realtime.RealtimeMessageMessage).payload.event.feed }
        feed = Feed.create(feedPayload, this, this.http, this.mqtt)
        event = Event.create((msg as realtime.RealtimeMessageMessage).payload.event as EventRawPayload, feed, this, this.http)
      }
      this.emit('universe:feeds:events', { ...msg, event, feed: feed })
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

    if (universeTopics.api.people.isTopic(msg.topic)) {
      let _person
      if ((msg as realtime.RealtimePeople).payload.person) {
        _person = person.Person.create((msg as realtime.RealtimePeople).payload.person, this, this.http)
      }
      this.emit('universe:people', { ...msg, _person })
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

  private baseResourceFactory<T, K>(proto: BaseResourceCreateable<T, K>, payload: K): T {
    return proto.create(payload, this, this.http)
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

  public track (payload: track.TrackRawPayload): track.Track {
    return track.Track.create(payload, this, this.http)
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

  public productCategory (payload: productCategory.ProductCategoryRawPayload): productCategory.ProductCategory {
    return productCategory.ProductCategory.create(payload, this, this.http)
  }

  public productCategoryTree (payload: productCategoryTree.ProductCategoryTreeRawPayload): productCategoryTree.ProductCategoryTree {
    return productCategoryTree.ProductCategoryTree.create(payload, this, this.http)
  }

  public messageTemplateCategory (payload: messageTemplateCategory.MessageTemplateCategoryRawPayload): messageTemplateCategory.MessageTemplateCategory {
    return messageTemplateCategory.MessageTemplateCategory.create(payload, this, this.http)
  }

  public messageTemplateCategoryTree (payload: messageTemplateCategoryTree.MessageTemplateCategoryTreeRawPayload): messageTemplateCategoryTree.MessageTemplateCategoryTree {
    return messageTemplateCategoryTree.MessageTemplateCategoryTree.create(payload, this, this.http)
  }

  public customProperty (payload: customProperty.CustomPropertyRawPayload): customProperty.CustomProperty {
    return customProperty.CustomProperty.create(payload, this, this.http)
  }

  public tag (payload: tag.TagRawPayload): tag.Tag {
    return tag.Tag.create(payload, this, this.http)
  }

  public tagGroup (payload: tagGroup.TagGroupRawPayload): tagGroup.TagGroup {
    return tagGroup.TagGroup.create(payload, this, this.http)
  }

  public configuration (payload: configuration.ConfigurationRawPayload): configuration.Configuration {
    return configuration.Configuration.create(payload, this, this.http)
  }

  public inventory (payload: inventory.InventoryRawPayload): inventory.Inventory {
    return inventory.Inventory.create(payload, this, this.http)
  }

  public integration (payload: integration.IntegrationRawPayload): integration.Integration {
    return integration.Integration.create(payload, this, this.http)
  }

  public messageBroker (payload: messageBroker.MessageBrokerRawPayload): messageBroker.MessageBroker {
    return messageBroker.MessageBroker.create(payload, this, this.http)
  }

  public storefront (payload: storefront.StorefrontRawPayload): storefront.Storefront {
    return storefront.Storefront.create(payload, this, this.http)
  }

  public shippingMethod (payload: shippingMethod.ShippingMethodRawPayload): shippingMethod.ShippingMethod {
    return shippingMethod.ShippingMethod.create(payload, this, this.http)
  }

  public route (payload: route.RouteRawPayload): route.Route {
    return route.Route.create(payload, this, this.http)
  }

  public thing (payload: thing.ThingRawPayload): thing.Thing {
    return thing.Thing.create(payload, this, this.http)
  }

  public nlu (payload: nlu.NluRawPayload): nlu.Nlu {
    return nlu.Nlu.create(payload, this, this.http)
  }

  public intent (payload: intent.IntentRawPayload): intent.Intent {
    return intent.Intent.create(payload, this, this.http)
  }

  public location (payload: location.LocationRawPayload): location.Location {
    return location.Location.create(payload, this, this.http)
  }

  public message (payload: message.MessageRawPayload): message.Message {
    return message.Message.create(payload, this, this.http)
  }

  public contactList (payload: contactList.ContactListRawPayload): contactList.ContactList {
    return contactList.ContactList.create(payload, this, this.http)
  }

  public notificationCampaign (payload: notificationCampaign.NotificationCampaignRawPayload): notificationCampaign.NotificationCampaign {
    return notificationCampaign.NotificationCampaign.create(payload, this, this.http)
  }

  public favorite (payload: favorite.FavoriteRawPayload): favorite.Favorite {
    return favorite.Favorite.create(payload, this, this.http)
  }

  public knowledgeBase (payload: knowledgeBase.KnowledgeBaseRawPayload): knowledgeBase.KnowledgeBase {
    return knowledgeBase.KnowledgeBase.create(payload, this, this.http)
  }

  public knowledgeBaseFaqItem (payload: knowledgeBaseFaqItem.KnowledgeBaseFaqItemRawPayload): knowledgeBaseFaqItem.KnowledgeBaseFaqItem {
    return knowledgeBaseFaqItem.KnowledgeBaseFaqItem.create(payload, this, this.http)
  }

  public crm (payload: crm.CRMRawPayload): crm.CRM {
    return crm.CRM.create(payload, this, this.http)
  }

  // hygen:factory:injection -  Please, don't delete this line: when running the cli for crud resources the new routes will be automatically added here.

  /**
   * Make requests on unimplemented API resources
   *
   * @param options
   */
  public async apiRequest (options: ApiRequestOptions): Promise<{ [key: string]: any } | Array<{ [key: string]: any } | undefined>> {
    const opts = {
      method: options.method,
      path: `${options.path}${options.query ? qs.stringify(options.query, { addQueryPrefix: true }) : ''}`,
      data: options.data ?? undefined
    }

    try {
      const res = await this.http.getClient()(opts)

      return res.data.data
    } catch (err) {
      throw new UniverseApiRequestError(undefined, { error: err })
    }
  }

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

  private async makeAnalyticsRequest<T, K>(endpointSlug: string, options: K): Promise<T[]> {
    try {
      const opts = {
        method: 'GET',
        url: `${this.universeBase}/${ANALYTICS_ENDPOINT}${endpointSlug}`,
        params: options
      }

      const res = await this.http.getClient()(opts)
      return res.data.data as T[]
    } catch (err) {
      throw new AnalyticsFetchRemoteError(undefined, { error: err })
    }
  }

  /* Analytics & Reports */
  public get analytics (): UniverseAnalytics {
    return {
      orders: async (options: UniverseAnalyticsOptions): Promise<AnalyticsReport[]> => {
        return await this.makeAnalyticsRequest<AnalyticsReport, UniverseAnalyticsOptions>('/commerce/orders/distribution/count', options)
      },
      revenues: async (options: UniverseAnalyticsOptions): Promise<AnalyticsReport[]> => {
        return await this.makeAnalyticsRequest<AnalyticsReport, UniverseAnalyticsOptions>('/commerce/revenues/distribution', options)
      },
      xau: async (options: UniverseAnalyticsOptions): Promise<AnalyticsReport[]> => {
        return await this.makeAnalyticsRequest<AnalyticsReport, UniverseAnalyticsOptions>('/messages/xau/count', options)
      },
      peopleMessagingChannelParticipationDistribution: async (options: UniverseAnalyticsOptions): Promise<AnalyticsReport[]> => {
        return await this.makeAnalyticsRequest<AnalyticsReport, UniverseAnalyticsOptions>('/people/channel_participation/distribution', options)
      },
      feedOpenedClosed: async (options: UniverseAnalyticsOptions): Promise<AnalyticsReport[]> => {
        return await this.makeAnalyticsRequest<AnalyticsReport, UniverseAnalyticsOptions>('/feeds/open_close/distribution/count', options)
      },
      feedConversion: async (options: UniverseAnalyticsOptions): Promise<AnalyticsReport[]> => {
        return await this.makeAnalyticsRequest<AnalyticsReport, UniverseAnalyticsOptions>('/feeds/conversion/counts', options)
      }
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
                'participants.channel_users',
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
      fetchCount: async (options?: UniverseFetchOptions): Promise<{ count: number }> => {
        try {
          const opts = {
            method: 'HEAD',
            url: `${this.universeBase}/${Feeds.endpoint}`,
            params: {
              ...(options?.query ?? {})
            }
          }

          const res = await this.http.getClient()(opts)

          return {
            count: Number(res.headers['X-Resource-Count'] || res.headers['x-resource-count'])
          }
        } catch (err) {
          throw new FeedFetchCountRemoteError(undefined, { error: err })
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

  /**
   * People accessor
   *
   * ```js
   * // fetch all feeds with regular defaults (as class instance list)
   * await universe.people.fetch()
   * // fetch all people as raw structs with some query options
   * await universe.people.fetch({ raw: true, query: {} })
   * // cast a list of class instances to list of structs
   * universe.people.toJson([person])
   * // cast a list of structs to list of class instances
   * universe.people.fromJson([person])
   * ```
   */
  public get people (): UniversePeople {
    return {
      fromJson: (payloads: person.PersonRawPayload[]): person.Person[] => {
        return payloads.map((item) => (person.Person.create(item, this, this.http)))
      },
      toJson: (people: person.Person[]): person.PersonRawPayload[] => {
        return people.map((item) => (item.serialize()))
      },
      fetch: async (options?: UniverseFetchOptions): Promise<person.Person[] | person.PersonRawPayload[] | undefined> => {
        try {
          const opts = {
            method: 'GET',
            url: `${this.universeBase}/${person.People.endpoint}`,
            params: {
              ...(options?.query ?? {})
            }
          }

          const res = await this.http.getClient()(opts)
          const resources = res.data.data as person.PersonRawPayload[]

          if (options && options.raw === true) {
            return resources
          }

          return resources.map((resource: person.PersonRawPayload) => {
            return person.Person.create(resource, this, this.http)
          })
        } catch (err) {
          throw new person.PeopleFetchRemoteError(undefined, { error: err })
        }
      },
      fetchCount: async (options?: UniverseFetchOptions): Promise<{ count: number }> => {
        try {
          const opts = {
            method: 'HEAD',
            url: `${this.universeBase}/${person.People.endpoint}`,
            params: {
              ...(options?.query ?? {})
            }
          }

          const res = await this.http.getClient()(opts)

          return {
            count: Number(res.headers['X-Resource-Count'] || res.headers['x-resource-count'])
          }
        } catch (err) {
          throw new person.PeopleFetchCountRemoteError(undefined, { error: err })
        }
      },
      stream: async (options?: UniverseFetchOptions): Promise<person.People> => {
        const inst = new person.People({
          universe: this,
          http: this.http
        })

        const ret = await inst.getStream(options)

        return ret
      },
      export: async (options?: UniverseExportCsvOptions): Promise<Blob> => {
        const inst = new person.People({
          universe: this,
          http: this.http
        })

        const ret = await inst.exportCsv(options)

        return ret
      }
    }
  }

  public async staffs (options?: EntityFetchOptions): Promise<staff.Staff[] | staff.StaffRawPayload[] | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.universeBase}/${staff.Staffs.endpoint}`, {
        params: {
          ...(options?.query ?? {})
        }
      })
      const resources = res.data.data as staff.StaffRawPayload[]

      if (options && options.raw === true) {
        return resources
      }

      return resources.map((resource: staff.StaffRawPayload) => {
        return staff.Staff.create(resource, this, this.http)
      })
    } catch (err) {
      throw new staff.StaffsFetchRemoteError(undefined, { error: err })
    }
  }

  public get tracks (): UniverseTracks {
    return {
      fromJson: (payloads: track.TrackRawPayload[]): track.Track[] => {
        return payloads.map((item) => (track.Track.create(item, this, this.http)))
      },
      toJson: (products: track.Track[]): track.TrackRawPayload[] => {
        return products.map((item) => (item.serialize()))
      },
      fetch: async (options?: EntityFetchOptions): Promise<track.Track[] | track.TrackRawPayload[] | undefined> => {
        try {
          const res = await this.http.getClient().get(`${this.universeBase}/${track.Tracks.endpoint}`, {
            params: {
              ...(options?.query ?? {})
            }
          })
          const resources = res.data.data as track.TrackRawPayload[]

          if (options && options.raw === true) {
            return resources
          }

          return resources.map((resource: track.TrackRawPayload) => {
            return track.Track.create(resource, this, this.http)
          })
        } catch (err) {
          throw new track.TracksFetchRemoteError(undefined, { error: err })
        }
      },
      fetchCount: async (options?: EntityFetchOptions): Promise<{ count: number }> => {
        try {
          const opts = {
            method: 'HEAD',
            url: `${this.universeBase}/${track.Tracks.endpoint}`,
            params: {
              ...(options?.query ?? {})
            }
          }

          const res = await this.http.getClient()(opts)

          return {
            count: Number(res.headers['X-Resource-Count'] || res.headers['x-resource-count'])
          }
        } catch (err) {
          throw new track.TracksFetchRemoteError(undefined, { error: err })
        }
      },
      current: async (options?: EntityFetchOptions): Promise<track.Track[] | track.TrackRawPayload[] | undefined> => {
        try {
          const res = await this.http.getClient().get(`${this.universeBase}/${track.Tracks.currentEndpoint}`, {
            params: {
              ...(options?.query ?? {})
            }
          })
          const resources = res.data.data as track.TrackRawPayload[]

          if (options && options.raw === true) {
            return resources
          }

          return resources.map((resource: track.TrackRawPayload) => {
            return track.Track.create(resource, this, this.http)
          })
        } catch (err) {
          throw new track.TracksFetchRemoteError(undefined, { error: err })
        }
      }
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

  public get products (): UniverseProducts {
    return {
      fromJson: (payloads: ProductRawPayload[]): Product[] => {
        return payloads.map((item) => (Product.create(item, this, this.http)))
      },
      toJson: (products: Product[]): ProductRawPayload[] => {
        return products.map((item) => (item.serialize()))
      },
      fetch: async (options?: EntityFetchOptions): Promise<product.Product[] | ProductRawPayload[] | undefined> => {
        try {
          const opts = {
            method: 'GET',
            url: `${this.universeBase}/${product.Products.endpoint}`,
            params: {
              ...(options?.query ?? {}),
              embed: options?.query?.embed ?? 'options'
            }
          }
          const res = await this.http.getClient()(opts)
          const resources = res.data.data as product.ProductRawPayload[]

          if (options && options.raw === true) {
            return resources
          }

          return resources.map((resource: product.ProductRawPayload) => {
            return product.Product.create(resource, this, this.http)
          })
        } catch (err) {
          throw new product.ProductsFetchRemoteError(undefined, { error: err })
        }
      },
      fetchCount: async (options?: UniverseFetchOptions): Promise<{ count: number }> => {
        try {
          const opts = {
            method: 'HEAD',
            url: `${this.universeBase}/${product.Products.endpoint}`,
            params: {
              ...(options?.query ?? {})
            }
          }

          const res = await this.http.getClient()(opts)

          return {
            count: Number(res.headers['X-Resource-Count'] || res.headers['x-resource-count'])
          }
        } catch (err) {
          throw new product.ProductsFetchCountRemoteError(undefined, { error: err })
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
      },
      fetchCount: async (options?: UniverseFetchOptions): Promise<{ count: number }> => {
        try {
          const opts = {
            method: 'HEAD',
            url: `${this.universeBase}/${cart.Carts.endpoint}`,
            params: {
              ...(options?.query ?? {})
            }
          }

          const res = await this.http.getClient()(opts)

          return {
            count: Number(res.headers['X-Resource-Count'] || res.headers['x-resource-count'])
          }
        } catch (err) {
          throw new cart.CartsFetchCountRemoteError(undefined, { error: err })
        }
      }
    }
  }

  /**
   * Orders accessor
   *
   * ```js
   * // fetch all orders with regular defaults (as class instance list)
   * await universe.orders.fetch()
   * // fetch all orders as raw structs with some query options
   * await universe.orders.fetch({ raw: true })
   * // cast a list of class instances to list of structs
   * universe.orders.toJson([feed])
   * // cast a list of structs to list of class instances
   * universe.orders.fromJson([feed])
   * ```
   */
  public get orders (): IUniverseOrders {
    return {
      fromJson: (payloads: order.OrderRawPayload[]): order.Order[] => {
        return payloads.map((item) => (order.Order.create(item, this, this.http)))
      },
      toJson: (orders: order.Order[]): order.OrderRawPayload[] => {
        return orders.map((item) => (item.serialize()))
      },
      fetch: async (options?: UniverseFetchOptions): Promise<order.Order[] | order.OrderRawPayload[] | undefined> => {
        try {
          const opts = {
            method: 'GET',
            url: `${this.universeBase}/${order.Orders.endpoint}`,
            params: {
              ...(options?.query ?? {})
            }
          }
          const res = await this.http.getClient()(opts)
          const resources = res.data.data as order.OrderRawPayload[]

          if (options && options.raw === true) {
            return resources
          }

          return resources.map((resource: order.OrderRawPayload) => {
            return order.Order.create(resource, this, this.http)
          })
        } catch (err) {
          throw new order.OrdersFetchRemoteError(undefined, { error: err })
        }
      },
      fetchCount: async (options?: UniverseFetchOptions): Promise<{ count: number }> => {
        try {
          const opts = {
            method: 'HEAD',
            url: `${this.universeBase}/${order.Orders.endpoint}`,
            params: {
              ...(options?.query ?? {})
            }
          }

          const res = await this.http.getClient()(opts)

          return {
            count: Number(res.headers['X-Resource-Count'] || res.headers['x-resource-count'])
          }
        } catch (err) {
          throw new order.OrdersFetchCountRemoteError(undefined, { error: err })
        }
      },
      export: async (options?: UniverseExportCsvOptions): Promise<Blob> => {
        const inst = new order.Orders({
          universe: this,
          http: this.http
        })

        const ret = await inst.exportCsv(options)

        return ret
      }
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

  public async productCategories (options?: EntityFetchOptions): Promise<productCategory.ProductCategory[] | productCategory.ProductCategoryRawPayload[] | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.universeBase}/${productCategory.ProductCategories.endpoint}`, {
        params: {
          ...(options?.query ?? {})
        }
      })
      const resources = res.data.data as productCategory.ProductCategoryRawPayload[]

      if (options && options.raw === true) {
        return resources
      }

      return resources.map((resource: productCategory.ProductCategoryRawPayload) => {
        return productCategory.ProductCategory.create(resource, this, this.http)
      })
    } catch (err) {
      throw new productCategory.ProductCategoriesFetchRemoteError(undefined, { error: err })
    }
  }

  public async productCategoryTrees (options?: EntityFetchOptions): Promise<productCategoryTree.ProductCategoryTree[] | productCategoryTree.ProductCategoryTreeRawPayload[] | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.universeBase}/${productCategoryTree.ProductCategoryTrees.endpoint}`, {
        params: {
          ...(options?.query ?? {})
        }
      })
      const resources = res.data.data as productCategoryTree.ProductCategoryTreeRawPayload[]

      if (options && options.raw === true) {
        return resources
      }

      return resources.map((resource: productCategoryTree.ProductCategoryTreeRawPayload) => {
        return productCategoryTree.ProductCategoryTree.create(resource, this, this.http)
      })
    } catch (err) {
      throw new productCategoryTree.ProductCategoryTreesFetchRemoteError(undefined, { error: err })
    }
  }

  public async messageTemplateCategories (): Promise<messageTemplateCategory.MessageTemplateCategory[] | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.universeBase}/${messageTemplateCategory.MessageTemplateCategories.endpoint}`)
      const resources = res.data.data as messageTemplateCategory.MessageTemplateCategoryRawPayload[]

      return resources.map((resource: messageTemplateCategory.MessageTemplateCategoryRawPayload) => {
        return messageTemplateCategory.MessageTemplateCategory.create(resource, this, this.http)
      })
    } catch (err) {
      throw new messageTemplateCategory.MessageTemplateCategoriesFetchRemoteError(undefined, { error: err })
    }
  }

  public async messageTemplateCategoryTrees (): Promise<messageTemplateCategoryTree.MessageTemplateCategoryTree[] | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.universeBase}/${messageTemplateCategoryTree.MessageTemplateCategoryTrees.endpoint}`)
      const resources = res.data.data as messageTemplateCategoryTree.MessageTemplateCategoryTreeRawPayload[]

      return resources.map((resource: messageTemplateCategoryTree.MessageTemplateCategoryTreeRawPayload) => {
        return messageTemplateCategoryTree.MessageTemplateCategoryTree.create(resource, this, this.http)
      })
    } catch (err) {
      throw new messageTemplateCategoryTree.MessageTemplateCategoryTreesFetchRemoteError(undefined, { error: err })
    }
  }

  public async customProperties (): Promise<customProperty.CustomProperty[] | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.universeBase}/${customProperty.CustomProperties.endpoint}`)
      const resources = res.data.data as customProperty.CustomPropertyRawPayload[]

      return resources.map((resource: customProperty.CustomPropertyRawPayload) => {
        return customProperty.CustomProperty.create(resource, this, this.http)
      })
    } catch (err) {
      throw new customProperty.CustomPropertiesFetchRemoteError(undefined, { error: err })
    }
  }

  public async makeBaseResourceListRequest<T, TL, K, O, E>(proto: BaseResourceCreateable<T, K>, listProto: BaseResourceList<TL>, errorProto: BaseResourceErrorProto<E>, options?: BaseResourceEntityFetchOptions<O>): Promise<T[] | K[] | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.universeBase}/${listProto.endpoint}`, {
        params: {
          ...(options?.query ?? {})
        }
      })
      const resources = res.data.data as K[]

      if (options && options.raw === true) {
        return resources
      }

      return resources.map((resource: K) => {
        return proto.create(resource, this, this.http)
      })
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal,new-cap
      throw new errorProto(undefined, { error: err })
    }
  }

  public async tags (options?: EntityFetchOptions): Promise<tag.Tag[] | tag.TagRawPayload[] | undefined> {
    return await this.makeBaseResourceListRequest<tag.Tag, tag.Tags, tag.TagRawPayload, EntityFetchOptions, tag.TagsFetchRemoteError>(tag.Tag, tag.Tags, tag.TagsFetchRemoteError, options)
  }

  public async tagGroups (options?: EntityFetchOptions): Promise<tagGroup.TagGroup[] | tagGroup.TagGroupRawPayload[] | undefined> {
    return await this.makeBaseResourceListRequest<tagGroup.TagGroup, tagGroup.TagGroups, tagGroup.TagGroupRawPayload, EntityFetchOptions, tagGroup.TagGroupsFetchRemoteError>(tagGroup.TagGroup, tagGroup.TagGroups, tagGroup.TagGroupsFetchRemoteError, options)
  }

  public async configurations (options?: EntityFetchOptions): Promise<configuration.Configuration[] | configuration.ConfigurationRawPayload[] | undefined> {
    return await this.makeBaseResourceListRequest<configuration.Configuration, configuration.Configurations, configuration.ConfigurationRawPayload, EntityFetchOptions, configuration.ConfigurationsFetchRemoteError>(configuration.Configuration, configuration.Configurations, configuration.ConfigurationsFetchRemoteError, options)
  }

  public async uiConfigurations ({ query: { owner = 'self' }, ...rest }: { query: { owner: string }, [key: string]: any }): Promise<configuration.Configuration[] | configuration.ConfigurationRawPayload[] | undefined> {
    const opts = {
      query: {
        owner,
        field: [
          'ui'
        ]
      },
      ...rest
    }

    return await this.makeBaseResourceListRequest<configuration.Configuration, configuration.Configurations, configuration.ConfigurationRawPayload, EntityFetchOptions, configuration.ConfigurationsFetchRemoteError>(configuration.Configuration, configuration.Configurations, configuration.ConfigurationsFetchRemoteError, opts)
  }

  public async dashboardConfigurations ({ query: { owner = 'self' }, ...rest }: { query: { owner: string }, [key: string]: any }): Promise<configuration.Configuration[] | configuration.ConfigurationRawPayload[] | undefined> {
    const opts = {
      query: {
        owner,
        field: [
          'dashboard'
        ]
      },
      ...rest
    }

    return await this.makeBaseResourceListRequest<configuration.Configuration, configuration.Configurations, configuration.ConfigurationRawPayload, EntityFetchOptions, configuration.ConfigurationsFetchRemoteError>(configuration.Configuration, configuration.Configurations, configuration.ConfigurationsFetchRemoteError, opts)
  }

  public async inventories (options?: EntityFetchOptions): Promise<inventory.Inventory[] | inventory.InventoryRawPayload[] | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.universeBase}/${inventory.Inventories.endpoint}`, {
        params: {
          ...(options?.query ?? {})
        }
      })

      const resources = res.data.data as inventory.InventoryRawPayload[]

      if (options && options.raw === true) {
        return resources
      }

      return resources.map((resource: inventory.InventoryRawPayload) => {
        return inventory.Inventory.create(resource, this, this.http)
      })
    } catch (err) {
      throw new inventory.InventoriesFetchRemoteError(undefined, { error: err })
    }
  }

  public async integrations (options?: EntityFetchOptions): Promise<integration.Integration[] | integration.IntegrationRawPayload[] | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.universeBase}/${integration.Integrations.endpoint}`, {
        params: {
          ...(options?.query ?? {})
        }
      })

      const resources = res.data.data as integration.IntegrationRawPayload[]

      if (options && options.raw === true) {
        return resources
      }

      return resources.map((resource: integration.IntegrationRawPayload) => {
        return integration.Integration.create(resource, this, this.http)
      })
    } catch (err) {
      throw new integration.IntegrationsFetchRemoteError(undefined, { error: err })
    }
  }

  public async availableIntegrations (options?: EntityFetchOptions): Promise<integration.AvailableIntegrationRawPayload[] | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.universeBase}/${integration.Integrations.endpoint}/available`, {
        params: {
          ...(options?.query ?? {})
        }
      })

      const resources = res.data.data as integration.AvailableIntegrationRawPayload[]

      return resources
    } catch (err) {
      throw new integration.AvailableIntegrationsFetchRemoteError(undefined, { error: err })
    }
  }

  /**
   * Integration setup, calls vendor specific setup endpoint
   * @param payload data needed for vendor integration setup
   * @param setupEndpoint vendor specific endpoint
   */
  public async setupIntegration (payload: object, setupEndpoint: string): Promise<number | undefined> {
    try {
      const opts = {
        method: 'POST',
        url: `${this.universeBase}/${integration.Integrations.endpoint}/setup/${setupEndpoint}`,
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        data: {
          payload
        },
        responseType: 'json'
      }

      const res = await this.http?.getClient()(opts)
      return res.status
    } catch (err) {
      throw new integration.IntegrationsSetupRemoteError(undefined, { error: err })
    }
  }

  public async messageBrokers (options?: EntityFetchOptions): Promise<messageBroker.MessageBroker[] | messageBroker.MessageBrokerRawPayload[] | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.universeBase}/${messageBroker.MessageBrokers.endpoint}`, {
        params: {
          ...(options?.query ?? {})
        }
      })

      const resources = res.data.data as messageBroker.MessageBrokerRawPayload[]

      if (options && options.raw === true) {
        return resources
      }

      return resources.map((resource: messageBroker.MessageBrokerRawPayload) => {
        return messageBroker.MessageBroker.create(resource, this, this.http)
      })
    } catch (err) {
      throw new messageBroker.MessageBrokersFetchRemoteError(undefined, { error: err })
    }
  }

  public async storefronts (options?: EntityFetchOptions): Promise<storefront.Storefront[] | storefront.StorefrontRawPayload[] | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.universeBase}/${storefront.Storefronts.endpoint}`, {
        params: {
          ...(options?.query ?? {})
        }
      })

      const resources = res.data.data as storefront.StorefrontRawPayload[]

      if (options && options.raw === true) {
        return resources
      }

      return resources.map((resource: storefront.StorefrontRawPayload) => {
        return storefront.Storefront.create(resource, this, this.http)
      })
    } catch (err) {
      throw new storefront.StorefrontsFetchRemoteError(undefined, { error: err })
    }
  }

  public async shippingMethods (options?: EntityFetchOptions): Promise<shippingMethod.ShippingMethod[] | shippingMethod.ShippingMethodRawPayload[] | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.universeBase}/${shippingMethod.ShippingMethods.endpoint}`, {
        params: {
          ...(options?.query ?? {})
        }
      })

      const resources = res.data.data as shippingMethod.ShippingMethodRawPayload[]

      if (options && options.raw === true) {
        return resources
      }

      return resources.map((resource: shippingMethod.ShippingMethodRawPayload) => {
        return shippingMethod.ShippingMethod.create(resource, this, this.http)
      })
    } catch (err) {
      throw new shippingMethod.ShippingMethodsFetchRemoteError(undefined, { error: err })
    }
  }

  public async routes (options?: EntityFetchOptions): Promise<route.Route[] | route.RouteRawPayload[] | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.universeBase}/${route.Routes.endpoint}`, {
        params: {
          ...(options?.query ?? {})
        }
      })

      const resources = res.data.data as route.RouteRawPayload[]

      if (options && options.raw === true) {
        return resources
      }

      return resources.map((resource: route.RouteRawPayload) => {
        return route.Route.create(resource, this, this.http)
      })
    } catch (err) {
      throw new route.RoutesFetchRemoteError(undefined, { error: err })
    }
  }

  public async things (options?: EntityFetchOptions): Promise<thing.Thing[] | thing.ThingRawPayload[] | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.universeBase}/${thing.Things.endpoint}`, {
        params: {
          ...(options?.query ?? {})
        }
      })

      const resources = res.data.data as thing.ThingRawPayload[]

      if (options && options.raw === true) {
        return resources
      }

      return resources.map((resource: thing.ThingRawPayload) => {
        return thing.Thing.create(resource, this, this.http)
      })
    } catch (err) {
      throw new thing.ThingsFetchRemoteError(undefined, { error: err })
    }
  }

  public async nlus (options?: EntityFetchOptions): Promise<nlu.Nlu[] | nlu.NluRawPayload[] | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.universeBase}/${nlu.Nlus.endpoint}`, {
        params: {
          ...(options?.query ?? {})
        }
      })

      const resources = res.data.data as nlu.NluRawPayload[]

      if (options && options.raw === true) {
        return resources
      }

      return resources.map((resource: nlu.NluRawPayload) => {
        return nlu.Nlu.create(resource, this, this.http)
      })
    } catch (err) {
      throw new nlu.NlusFetchRemoteError(undefined, { error: err })
    }
  }

  public async intents (options?: EntityFetchOptions): Promise<intent.Intent[] | intent.IntentRawPayload[] | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.universeBase}/${intent.Intents.endpoint}`, {
        params: {
          ...(options?.query ?? {})
        }
      })

      const resources = res.data.data as intent.IntentRawPayload[]

      if (options && options.raw === true) {
        return resources
      }

      return resources.map((resource: intent.IntentRawPayload) => {
        return intent.Intent.create(resource, this, this.http)
      })
    } catch (err) {
      throw new intent.IntentsFetchRemoteError(undefined, { error: err })
    }
  }

  public async locations (options?: EntityFetchOptions): Promise<location.Location[] | location.LocationRawPayload[] | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.universeBase}/${location.Locations.endpoint}`, {
        params: {
          ...(options?.query ?? {})
        }
      })

      const resources = res.data.data as location.LocationRawPayload[]

      if (options && options.raw === true) {
        return resources
      }

      return resources.map((resource: location.LocationRawPayload) => {
        return location.Location.create(resource, this, this.http)
      })
    } catch (err) {
      throw new location.LocationsFetchRemoteError(undefined, { error: err })
    }
  }

  public get contactLists (): IUniverseContactLists {
    return {
      fromJson: (payloads: contactList.ContactListRawPayload[]): contactList.ContactList[] => {
        return payloads.map((item) => (contactList.ContactList.create(item, this, this.http)))
      },
      toJson: (contactLists: contactList.ContactList[]): contactList.ContactListRawPayload[] => {
        return contactLists.map((item) => (item.serialize()))
      },
      fetch: async (options?: UniverseFetchOptions): Promise<contactList.ContactList[] | contactList.ContactListRawPayload[] | undefined> => {
        try {
          const opts = {
            method: 'GET',
            url: `${this.universeBase}/${contactList.ContactLists.endpoint}`,
            params: {
              ...(options?.query ?? {})
            }
          }
          const res = await this.http.getClient()(opts)
          const resources = res.data.data as contactList.ContactListRawPayload[]

          if (options && options.raw === true) {
            return resources
          }

          return resources.map((resource: contactList.ContactListRawPayload) => {
            return contactList.ContactList.create(resource, this, this.http)
          })
        } catch (err) {
          throw new contactList.ContactListsFetchRemoteError(undefined, { error: err })
        }
      },
      fetchCount: async (options?: UniverseFetchOptions): Promise<{ count: number }> => {
        try {
          const opts = {
            method: 'HEAD',
            url: `${this.universeBase}/${contactList.ContactLists.endpoint}`,
            params: {
              ...(options?.query ?? {})
            }
          }

          const res = await this.http.getClient()(opts)

          return {
            count: Number(res.headers['X-Resource-Count'] || res.headers['x-resource-count'])
          }
        } catch (err) {
          throw new contactList.ContactListsFetchCountRemoteError(undefined, { error: err })
        }
      }
    }
  }

  public get notificationCampaigns (): IUniverseNotificationCampaigns {
    return {
      fromJson: (payloads: notificationCampaign.NotificationCampaignRawPayload[]): notificationCampaign.NotificationCampaign[] => {
        return payloads.map((item) => (notificationCampaign.NotificationCampaign.create(item, this, this.http)))
      },
      toJson: (contactLists: notificationCampaign.NotificationCampaign[]): notificationCampaign.NotificationCampaignRawPayload[] => {
        return contactLists.map((item) => (item.serialize()))
      },
      fetch: async (options?: UniverseFetchOptions): Promise<notificationCampaign.NotificationCampaign[] | notificationCampaign.NotificationCampaignRawPayload[] | undefined> => {
        try {
          const opts = {
            method: 'GET',
            url: `${this.universeBase}/${notificationCampaign.NotificationCampaigns.endpoint}`,
            params: {
              ...(options?.query ?? {})
            }
          }
          const res = await this.http.getClient()(opts)
          const resources = res.data.data as notificationCampaign.NotificationCampaignRawPayload[]

          if (options && options.raw === true) {
            return resources
          }

          return resources.map((resource: notificationCampaign.NotificationCampaignRawPayload) => {
            return notificationCampaign.NotificationCampaign.create(resource, this, this.http)
          })
        } catch (err) {
          throw new notificationCampaign.NotificationCampaignsFetchRemoteError(undefined, { error: err })
        }
      },
      fetchCount: async (options?: UniverseFetchOptions): Promise<{ count: number }> => {
        try {
          const opts = {
            method: 'HEAD',
            url: `${this.universeBase}/${notificationCampaign.NotificationCampaigns.endpoint}`,
            params: {
              ...(options?.query ?? {})
            }
          }

          const res = await this.http.getClient()(opts)

          return {
            count: Number(res.headers['X-Resource-Count'] || res.headers['x-resource-count'])
          }
        } catch (err) {
          throw new notificationCampaign.NotificationCampaignsFetchCountRemoteError(undefined, { error: err })
        }
      }
    }
  }

  public async favorites (options?: EntityFetchOptions): Promise<favorite.Favorite[] | favorite.FavoriteRawPayload[] | undefined> {
    return await this.makeBaseResourceListRequest<favorite.Favorite, favorite.Favorites, favorite.FavoriteRawPayload, EntityFetchOptions, favorite.FavoritesFetchRemoteError>(favorite.Favorite, favorite.Favorites, favorite.FavoritesFetchRemoteError, options)
  }

  public async knowledgeBases (options?: EntityFetchOptions): Promise<knowledgeBase.KnowledgeBase[] | knowledgeBase.KnowledgeBaseRawPayload[] | undefined> {
    return await this.makeBaseResourceListRequest<knowledgeBase.KnowledgeBase, knowledgeBase.KnowledgeBases, knowledgeBase.KnowledgeBaseRawPayload, EntityFetchOptions, knowledgeBase.KnowledgeBasesFetchRemoteError>(knowledgeBase.KnowledgeBase, knowledgeBase.KnowledgeBases, knowledgeBase.KnowledgeBasesFetchRemoteError, options)
  }

  public async crms (options?: EntityFetchOptions): Promise<crm.CRM[] | crm.CRMRawPayload[] | undefined> {
    return await this.makeBaseResourceListRequest<crm.CRM, crm.CRMs, crm.CRMRawPayload, EntityFetchOptions, crm.CRMsFetchRemoteError>(crm.CRM, crm.CRMs, crm.CRMsFetchRemoteError, options)
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

  public async versions (): Promise<{ universe: string } | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.universeBase}/api/versions`)

      return {
        universe: res.data?.universe
      }
    } catch (err) {
      throw new UniverseVersionsError(undefined, { error: err })
    }
  }

  public async self (): Promise<{ universe: string } | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.universeBase}/api/self`)

      return {
        universe: res.data?.universe
      }
    } catch (err) {
      throw new UniverseSelfError(undefined, { error: err })
    }
  }

  public async healthz (): Promise<{ message: string } | undefined> {
    try {
      const res = await this.http.getClient().get(`${this.universeBase}/api/healthz`)

      return {
        message: res.data?.msg
      }
    } catch (err) {
      throw new UniverseHealthzError(undefined, { error: err })
    }
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
      products: async (q: string): Promise<UnviverseProductsSearchResultItem[]> => {
        return await this.searchEntity<UnviverseProductsSearchResultItem[]>(product.Products.endpoint, q)
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

export class UniverseApiRequestError extends BaseError {
  public name = 'UniverseApiRequestError'
  constructor (public message: string = 'Unexptected error making api request.', properties?: any) {
    super(message, properties)

    Object.setPrototypeOf(this, UniverseApiRequestError.prototype)
  }
}

export class UniverseVersionsError extends BaseError {
  public name = 'UniverseVersionsError'
  constructor (public message: string = 'Unexptected response making versions request.', properties?: any) {
    super(message, properties)

    Object.setPrototypeOf(this, UniverseVersionsError.prototype)
  }
}

export class UniverseSelfError extends BaseError {
  public name = 'UniverseSelfError'
  constructor (public message: string = 'Unexptected response making self request.', properties?: any) {
    super(message, properties)

    Object.setPrototypeOf(this, UniverseSelfError.prototype)
  }
}

export class UniverseHealthzError extends BaseError {
  public name = 'UniverseHealthzError'
  constructor (public message: string = 'Unexptected response making health request.', properties?: any) {
    super(message, properties)

    Object.setPrototypeOf(this, UniverseHealthzError.prototype)
  }
}
