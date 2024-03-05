import {
  initSDK,
  type ClientOptions,
  type SdkDefinition,
  type SDKTypes,
} from '@opensdks/runtime'
import oasMeta from './openapi.meta'
import type oasTypes from './openapi.types'

export type BYOSupaglueSDKTypes = SDKTypes<
  oasTypes,
  Omit<ClientOptions, 'headers'> & {
    headers: {
      'x-nango-secret-key'?: string
      'x-api-key'?: string
      'x-customer-id'?: string
      'x-provider-name'?: string
      /** Will use nangoPostgres instead of supaglue */
      'x-use-new-backend'?: 'true' | 'false'
      [k: string]: string | undefined
    }
  }
>

export const byoSupaglueSDkDef = {
  types: {} as BYOSupaglueSDKTypes,
  oasMeta,
} satisfies SdkDefinition<BYOSupaglueSDKTypes>

export function initBYOSupaglueSDK(opts: BYOSupaglueSDKTypes['options']) {
  return initSDK(byoSupaglueSDkDef, opts)
}

export type BYOSupaglueSDK = ReturnType<typeof initBYOSupaglueSDK>
