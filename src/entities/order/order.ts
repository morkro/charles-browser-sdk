
import Entity, { EntityOptions } from '../_base'
import { Universe } from '../../universe'
import { BaseError } from '../../errors'

export interface OrderOptions extends EntityOptions {
  rawPayload?: OrderRawPayload
}

export interface OrderItemOptions extends EntityOptions {
  rawPayload?: OrderItemRawPayload
}

export interface OrderAmount {
  net?: number
  gross?: number
}

export interface OrderItemPriceRawPayload {
  readonly amount: OrderAmount
  readonly currency: string
  readonly vat_rate: number
  readonly vat_class: 'vat_class_zero' | 'vat_class_reduced' | 'vat_class_normal' | 'vat_class_custom'
  readonly custom_vat_rate: number
  readonly tax_region: string
  readonly tax_country: string
  readonly additional_taxes: {
    readonly id: string
    readonly rate: number
    readonly amount: number
  }[]
}

export interface OrderItemDiscountRawPayload {
  readonly id?: string
  readonly type?: 'value' | 'rate'
  readonly name?: string
  readonly rate?: number
  readonly value?: {
    readonly amount?: number
    readonly currency?: string
  }
  readonly amount?: number
  readonly currency?: string
}

export interface OrderItemRawPayload {
  readonly qty?: number
  readonly sku?: string
  readonly name?: string
  readonly price?: OrderItemPriceRawPayload
  readonly product?: string
  readonly metadata?: object
  readonly custom_id?: string
  readonly discounts?: OrderItemDiscountRawPayload[]
  readonly order_index?: number
  readonly custom_properties?: object
  readonly shipping_required?: boolean
  readonly external_reference_id?: string
  readonly external_reference_custom_id?: string
}

export interface OrderItemPayload {
  readonly qty?: number
  readonly sku?: string
  readonly name: string
  readonly price: OrderItemPriceRawPayload
  readonly product?: string
  readonly metadata?: object
  readonly customId?: string
  readonly discounts?: OrderItemDiscountRawPayload[]
  readonly orderIndex?: number
  readonly customProperties?: object
  readonly shippingRequired?: boolean
  readonly externalReferenceId?: string
  readonly externalReferenceCustomId?: string
}

export interface OrderAdress {
  readonly lines?: string[]
  readonly locality?: string
  readonly region?: string
  readonly postal_code?: string
  readonly country?: string
}

export interface OrderShippingAddress extends OrderAdress {

}

export interface OrderBillingAddress extends OrderAdress {

}

export interface OrderContact {
  readonly email?: string
}

export interface OrderRawPayload {
  readonly id?: string
  readonly created_at?: string
  readonly updated_at?: string
  readonly deleted?: boolean
  readonly active?: boolean
  readonly name?: string
  readonly custom_id?: string
  readonly items?: OrderItemRawPayload[]
  readonly is_proxy?: boolean
  readonly proxy_vendor?: 'shopify' | string
  readonly type?: 'sale' | 'cancellation'
  readonly external_reference_id?: string
  readonly external_reference_custom_id?: string
  readonly client_id?: string
  readonly person?: string
  readonly note?: string
  readonly comment?: string
  readonly shipping_address?: OrderShippingAddress
  readonly billing_address?: OrderBillingAddress
  readonly contact?: OrderContact
  readonly metadata?: object
  readonly custom_properies?: object
  readonly cart?: string
}

export interface OrderPayload {
  readonly id?: OrderRawPayload['id']
  readonly createdAt?: Date | null
  readonly updatedAt?: Date | null
  readonly deleted?: boolean
  readonly active?: boolean
  readonly name?: OrderRawPayload['name']
  readonly custom_id?: OrderRawPayload['custom_id']
  readonly items?: OrderItem[]
  readonly isProxy?: OrderRawPayload['is_proxy']
  readonly proxyVendor?: OrderRawPayload['proxy_vendor']
  readonly type?: OrderRawPayload['type']
  readonly externalReferenceId?: OrderRawPayload['external_reference_id']
  readonly externalReferenceCustomId?: OrderRawPayload['external_reference_custom_id']
  readonly clientId?: OrderRawPayload['client_id']
  readonly person?: OrderRawPayload['person']
  readonly note?: OrderRawPayload['note']
  readonly comment?: OrderRawPayload['comment']
  readonly shippingAddress?: OrderRawPayload['shipping_address']
  readonly billingAddress?: OrderRawPayload['billing_address']
  readonly contact?: OrderRawPayload['contact']
  readonly metadata?: OrderRawPayload['metadata']
  readonly customProperies?: OrderRawPayload['custom_properies']
  readonly cart?: OrderRawPayload['cart']
}

export class OrderItem {
  protected universe: Universe
  protected http: Universe['http']
  protected options: OrderOptions

  public qty?: OrderItemPayload['qty']
  public sku?: OrderItemPayload['sku']
  public name?: OrderItemPayload['name']
  public price?: OrderItemPayload['price']
  public product?: OrderItemPayload['product']
  public metadata?: OrderItemPayload['metadata']
  public customId?: OrderItemPayload['customId']
  public discounts?: OrderItemPayload['discounts']
  public orderIndex?: OrderItemPayload['orderIndex']
  public customProperties?: OrderItemPayload['customProperties']
  public shippingRequired?: OrderItemPayload['shippingRequired']
  public externalReferenceId?: OrderItemPayload['externalReferenceId']
  public externalReferenceCustomId?: OrderItemPayload['externalReferenceCustomId']

  constructor(options: OrderItemOptions) {
    this.universe = options.universe
    this.http = options.http
    this.options = options

    if (options && options.rawPayload) {
      this.deserialize(options.rawPayload)
    }
  }

  protected deserialize(rawPayload: OrderItemRawPayload): OrderItem {
    this.qty = rawPayload.qty
    this.sku = rawPayload.sku
    this.name = rawPayload.name
    this.price = rawPayload.price
    this.product = rawPayload.product
    this.metadata = rawPayload.metadata
    this.customId = rawPayload.custom_id
    this.discounts = rawPayload.discounts
    this.orderIndex = rawPayload.order_index
    this.customProperties = rawPayload.custom_properties
    this.shippingRequired = rawPayload.shipping_required
    this.externalReferenceId = rawPayload.external_reference_id
    this.externalReferenceCustomId = rawPayload.external_reference_custom_id

    return this
  }

  public static create(payload: OrderItemRawPayload, universe: Universe, http: Universe['http']): OrderItem {
    return new OrderItem({ rawPayload: payload, universe, http })
  }

  public serialize(): OrderItemRawPayload {
    return {
      qty: this.qty,
      sku: this.sku,
      name: this.name,
      price: this.price,
      product: this.product,
      metadata: this.metadata,
      custom_id: this.customId,
      discounts: this.discounts,
      order_index: this.orderIndex,
      custom_properties: this.customProperties,
      shipping_required: this.shippingRequired,
      external_reference_id: this.externalReferenceId,
      external_reference_custom_id: this.externalReferenceCustomId
    }
  }
}

/**
 * Manage orders.
 *
 * @category CommerceEntity
 */
export class Order extends Entity<OrderPayload, OrderRawPayload> {
  protected universe: Universe
  protected http: Universe['http']
  protected options: OrderOptions
  public initialized: boolean

  public endpoint: string

  public id?: OrderPayload['id']
  public createdAt?: OrderPayload['createdAt']
  public updatedAt?: OrderPayload['updatedAt']
  public deleted?: OrderPayload['deleted']
  public active?: OrderPayload['active']
  public name?: OrderPayload['name']
  public customId?: OrderPayload['custom_id']
  public items?: OrderPayload['items']
  public isProxy?: OrderPayload['isProxy']
  public proxyVendor?: OrderPayload['proxyVendor']
  public type?: OrderPayload['type']
  public externalReferenceId?: OrderPayload['externalReferenceId']
  public externalReferenceCustomId?: OrderPayload['externalReferenceCustomId']
  public clientId?: OrderPayload['clientId']
  public person?: OrderPayload['person']
  public note?: OrderPayload['note']
  public comment?: OrderPayload['comment']
  public shippingAddress?: OrderPayload['shippingAddress']
  public billingAddress?: OrderPayload['billingAddress']
  public contact?: OrderPayload['contact']
  public metadata?: OrderPayload['metadata']
  public customProperies?: OrderPayload['customProperies']
  public cart?: OrderPayload['cart']

  constructor(options: OrderOptions) {
    super()
    this.universe = options.universe
    this.endpoint = 'api/v0/orders'
    this.http = options.http
    this.options = options
    this.initialized = options.initialized || false

    if (options && options.rawPayload) {
      this.deserialize(options.rawPayload)
    }
  }

  protected deserialize(rawPayload: OrderRawPayload): Order {
    this.id = rawPayload.id
    this.createdAt = rawPayload.created_at ? new Date(rawPayload.created_at) : undefined
    this.updatedAt = rawPayload.updated_at ? new Date(rawPayload.updated_at) : undefined
    this.deleted = rawPayload.deleted || false
    this.active = rawPayload.active || true
    this.name = rawPayload.name
    this.customId = rawPayload.custom_id
    this.isProxy = rawPayload.is_proxy || false
    this.proxyVendor = rawPayload.proxy_vendor
    this.type = rawPayload.type
    this.externalReferenceId = rawPayload.external_reference_id
    this.externalReferenceCustomId = rawPayload.external_reference_custom_id
    this.clientId = rawPayload.client_id
    this.person = rawPayload.person
    this.note = rawPayload.note
    this.comment = rawPayload.comment
    this.shippingAddress = rawPayload.shipping_address
    this.billingAddress = rawPayload.billing_address
    this.contact = rawPayload.contact
    this.metadata = rawPayload.metadata
    this.customProperies = rawPayload.custom_properies
    this.cart = rawPayload.cart

    if (Array.isArray(rawPayload.items)) {
      this.items = rawPayload.items.map((item) => (OrderItem.create(item, this.universe, this.http)))
    } else {
      this.items = []
    }

    return this
  }

  public static create(payload: OrderRawPayload, universe: Universe, http: Universe['http']): Order {
    return new Order({ rawPayload: payload, universe, http, initialized: true })
  }

  public serialize(): OrderRawPayload {
    let items = undefined
    if (Array.isArray(this.items)) {
      items = this.items.map((item) => (item.serialize()))
    }

    return {
      id: this.id,
      created_at: this.createdAt ? this.createdAt.toISOString() : undefined,
      updated_at: this.updatedAt ? this.updatedAt.toISOString() : undefined,
      deleted: this.deleted || false,
      active: this.active || true,
      name: this.name,
      custom_id: this.customId,
      is_proxy: this.isProxy,
      proxy_vendor: this.proxyVendor,
      type: this.type,
      external_reference_id: this.externalReferenceId,
      external_reference_custom_id: this.externalReferenceCustomId,
      client_id: this.clientId,
      person: this.person,
      note: this.note,
      comment: this.comment,
      shipping_address: this.shippingAddress,
      billing_address: this.billingAddress,
      contact: this.contact,
      metadata: this.metadata,
      custom_properies: this.customProperies,
      cart: this.cart,
      items
    }
  }

  public async init(): Promise<Order | undefined> {
    try {
      await this.fetch()

      return this
    } catch (err) {
      throw this.handleError(new OrderInitializationError(undefined, { error: err }))
    }
  }
}

export class Orders {
  public static endpoint: string = 'api/v0/orders'
}

export class OrderInitializationError extends BaseError {
  public name = 'OrderInitializationError'
  constructor(public message: string = 'Could not initialize order.', properties?: any) {
    super(message, properties)
  }
}

export class OrderFetchRemoteError extends BaseError {
  public name = 'OrderFetchRemoteError'
  constructor(public message: string = 'Could not get order.', properties?: any) {
    super(message, properties)
  }
}

export class OrdersFetchRemoteError extends BaseError {
  public name = 'OrdersFetchRemoteError'
  constructor(public message: string = 'Could not get orders.', properties?: any) {
    super(message, properties)
  }
}