
import Entity, { EntityOptions } from '../_base'
import { Universe } from '../../universe'
import { BaseError } from '../../errors'

export interface MessageTemplateCategoryOptions extends EntityOptions {
  rawPayload?: MessageTemplateCategoryRawPayload
}

export interface MessageTemplateCategoryRawPayload {
  readonly id?: string
  readonly created_at?: string
  readonly updated_at?: string
  readonly deleted?: boolean
  readonly active?: boolean
}

export interface MessageTemplateCategoryPayload {
  readonly id?: MessageTemplateCategoryRawPayload['id']
  readonly createdAt?: Date | null
  readonly updatedAt?: Date | null
  readonly deleted?: MessageTemplateCategoryRawPayload['deleted']
  readonly active?: MessageTemplateCategoryRawPayload['active']
}

/**
 * Manage message template categories.
 *
 * @category Entity
 */
export class MessageTemplateCategory extends Entity<MessageTemplateCategoryPayload, MessageTemplateCategoryRawPayload> {
  protected universe: Universe
  protected http: Universe['http']
  protected options: MessageTemplateCategoryOptions
  public initialized: boolean

  public endpoint: string

  public id?: MessageTemplateCategoryPayload['id']
  public createdAt?: MessageTemplateCategoryPayload['createdAt']
  public updatedAt?: MessageTemplateCategoryPayload['updatedAt']
  public deleted?: MessageTemplateCategoryPayload['deleted']
  public active?: MessageTemplateCategoryPayload['active']

  constructor (options: MessageTemplateCategoryOptions) {
    super()
    this.universe = options.universe
    this.endpoint = 'api/v0/message_template_categories'
    this.http = options.http
    this.options = options
    this.initialized = options.initialized ?? false

    if (options?.rawPayload) {
      this.deserialize(options.rawPayload)
    }
  }

  protected deserialize (rawPayload: MessageTemplateCategoryRawPayload): MessageTemplateCategory {
    this.setRawPayload(rawPayload)

    this.id = rawPayload.id
    this.createdAt = rawPayload.created_at ? new Date(rawPayload.created_at) : undefined
    this.updatedAt = rawPayload.updated_at ? new Date(rawPayload.updated_at) : undefined
    this.deleted = rawPayload.deleted ?? false
    this.active = rawPayload.active ?? true

    return this
  }

  public static create (payload: MessageTemplateCategoryRawPayload, universe: Universe, http: Universe['http']): MessageTemplateCategory {
    return new MessageTemplateCategory({ rawPayload: payload, universe, http, initialized: true })
  }

  public serialize (): MessageTemplateCategoryRawPayload {
    return {
      id: this.id,
      created_at: this.createdAt ? this.createdAt.toISOString() : undefined,
      updated_at: this.updatedAt ? this.updatedAt.toISOString() : undefined,
      deleted: this.deleted ?? false,
      active: this.active ?? true
    }
  }

  public async init (): Promise<MessageTemplateCategory | undefined> {
    try {
      await this.fetch()

      return this
    } catch (err) {
      throw this.handleError(new MessageTemplateCategoryInitializationError(undefined, { error: err }))
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class MessageTemplateCategories {
  public static endpoint: string = 'api/v0/message_template_categories'
}

export class MessageTemplateCategoryInitializationError extends BaseError {
  public name = 'MessageTemplateCategoryInitializationError'
  constructor (public message: string = 'Could not initialize product category.', properties?: any) {
    super(message, properties)
    Object.setPrototypeOf(this, MessageTemplateCategoryInitializationError.prototype)
  }
}

export class MessageTemplateCategoryFetchRemoteError extends BaseError {
  public name = 'MessageTemplateCategoryFetchRemoteError'
  constructor (public message: string = 'Could not get product category.', properties?: any) {
    super(message, properties)
    Object.setPrototypeOf(this, MessageTemplateCategoryFetchRemoteError.prototype)
  }
}

export class MessageTemplateCategoriesFetchRemoteError extends BaseError {
  public name = 'MessageTemplateCategoriesFetchRemoteError'
  constructor (public message: string = 'Could not get product categories.', properties?: any) {
    super(message, properties)
    Object.setPrototypeOf(this, MessageTemplateCategoriesFetchRemoteError.prototype)
  }
}