// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import 'core-js/fn/array.find'
// import * as EventEmitter from 'events'
import events from 'events'
// import { AxiosError } from 'axios'
import { AuthOptions, AuthTypes, UsernameAuth, KeyAuth, TokenAuth } from './v0/auth'
import * as v0 from './v0'
import * as errors from './errors'
import { Client, ClientOptions } from './client'
import { environment } from './environment'
import { Universe, UnviverseSingleton, IUniverseOptions } from './universe'

export { v0 }

export const defaultOptions: CharlesSDKOptions = {
  universe: undefined
}

export interface CharlesSDKOptions {
  credentials?: UsernameAuth | KeyAuth | TokenAuth | undefined
  universe?: string
  base?: string
  user?: string
  responseInterceptors?: Function[]
  requestInterceptors?: Function[]
}

type MaybeOptions = object
export interface IInstanceOptions {
  universe: string
  [key: string]: any
}

export interface IUniverseFactoryOptions {
  singleton?: boolean
  base?: string
}

export declare interface CharlesClient {
  on(event: 'raw-error' | 'error', listener: (error: Error) => void): this
  on(event: string, listener: Function): this
}

export class CharlesClient extends events.EventEmitter {
  user?: string
  auth: v0.Auth
  http?: Client

  public options: CharlesSDKOptions | undefined
  public static environment = environment
  public initialized = false

  constructor(options?: CharlesSDKOptions) {
    super()

    this.auth = new v0.Auth({ base: defaultOptions.universe })

    if (!options) return

    if (this.handleOptions(options)) {
      this.initialized = true
    }
  }

  /**
   * Initialise the SDK instance by authenticating the client
   *
   */
  public init(options: CharlesSDKOptions = defaultOptions): void {
    // in cases where credentials and / or tokens and / or users are already
    // we will short circuit the client initialisations
    if (this.handleOptions(options)) return
    // in all other cases we will instantiate clients, that need to be authenticated
    // by the caller before any API will be available

    const clientOptions: ClientOptions = {
      headers: {}
    }

    if (options.universe) {
      this.auth = new v0.Auth({ base: options.universe })
    }

    if (options.responseInterceptors) {
      clientOptions.responseInterceptors = options.responseInterceptors
    }

    if (options.requestInterceptors) {
      clientOptions.requestInterceptors = options.requestInterceptors
    }

    this.http = Client.getInstance(clientOptions).setDefaults(clientOptions)
  }

  /**
   * De-Initialise the SDK instance and all its state
   *
   */
  public destroy(): void {
    Client.clearInstance()

    if (this.auth) {
      this.auth.clearInstance()
    }

    this.http = undefined
    this.options = undefined
    this.user = undefined
  }

  private handleOptions(options: CharlesSDKOptions): boolean {
    this.options = options
    this.options.universe = this.options.universe
    this.user = this.options.user

    if (options.credentials) {
      const authOptions: AuthOptions = {
        credentials: options.credentials,
        base: this.options.base,
        user: this.user
      }

      const clientOptions: ClientOptions = {
        headers: {},
        responseInterceptors: options.responseInterceptors
      }

      this.auth = new v0.Auth(authOptions)
      if ((options.credentials as TokenAuth).accessToken) {
        this.auth.setAuthed((options.credentials as TokenAuth).accessToken)
      }

      if ((options.credentials as TokenAuth).accessToken && clientOptions.headers) {
        clientOptions.headers['Authorization'] = `Bearer ${(options.credentials as TokenAuth).accessToken}`
      }

      this.http = Client.getInstance(clientOptions).setDefaults(clientOptions)
      return true
    }

    return false
  }

  private generateAuthenticatedInstance<T>(
    type: { new(options: IInstanceOptions, http: Client): T },
    maybeOptions?: MaybeOptions
  ): T {
    if (
      !this.options ||
      !this.options.universe ||
      !this.http ||
      !this.auth ||
      !this.auth.authenticated
    ) {
      throw new errors.UninstantiatedClient()
    }

    return new type(
      {
        user: this.auth.user,
        universe: this.options.universe,
        ...maybeOptions
      },
      this.http
    )
  }

  /**
   * Create a reference to a universe via singleton or instance
   */
  universe(name: string, options?: IUniverseFactoryOptions): Universe | UnviverseSingleton {
    if (!this.http || !this.auth.accessToken) {
      throw new errors.UninstantiatedClient('Cannot invoke universe without instantiated http client')
    }

    const opts = {
      http: this.http,
      name,
      base: options && options.base ? options.base : 'https://hello-charles.com',
      user: {
        accessToken: this.auth.accessToken,
        id: this.options ? this.options.user : undefined
      }
    }

    if (options && options.singleton === true) {
      return UnviverseSingleton.getInstance(opts)
    }

    return new Universe(opts)
  }

  /**
   * Create an authenticated Messages instance
   *
   */
  messages(): v0.Messages {
    return this.generateAuthenticatedInstance(v0.Messages)
  }
}

export class Charles extends CharlesClient {
  private static instance: Charles
  constructor(options: CharlesSDKOptions) {
    super(options)

    // only emit errors, when we have listeners to prevent unhandled rejects etc.
    this.on('raw-error', (err: Error) => {
      if (this.listeners('error').length > 0) this.emit('error', err)
    })
  }

  static getInstance(options: CharlesSDKOptions): Charles {
    if (!Charles.instance) {
      Charles.instance = new Charles(options)
    }

    return Charles.instance
  }
}

export default Charles.getInstance({ universe: defaultOptions.universe })
