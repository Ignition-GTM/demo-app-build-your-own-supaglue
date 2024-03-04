import type {_Provider, ProviderFromRouter} from '@supaglue/vdk'
import {publicProcedure, trpc, z} from '@supaglue/vdk'
import {TRPCError} from '@trpc/server'
import * as models from '../models'
import {nangoPostgresProvider} from './providers/nango-postgres-provider'
import {supaglueProvider} from './providers/supaglue-provider'

export {models}

export const mgmtProcedure = publicProcedure.use(async ({next, ctx, path}) => {
  const useNewBackend =
    ctx.headers.get('x-use-new-backend')?.toLowerCase() === 'true'

  const provider: _Provider<InitOpts> = useNewBackend
    ? nangoPostgresProvider
    : supaglueProvider
  const providerName = useNewBackend ? 'nango-postgres' : 'supaglue'

  return next({
    ctx: {
      ...ctx,
      path,
      useNewBackend,
      provider,
      providerName,
    },
  })
})

type MgmtProcedure = ReturnType<
  (typeof mgmtProcedure)['query']
>['_def']['_ctx_out']

type InitOpts = {ctx: {headers: Headers}}

export const mgmtRouter = trpc.router({
  // Customer management
  listCustomers: mgmtProcedure
    .meta({openapi: {method: 'GET', path: '/customers'}})
    .input(z.void())
    .output(z.array(models.customer))
    .query(({ctx, input}) => mgmtProxyCallProvider({ctx, input})),

  getCustomer: mgmtProcedure
    .meta({openapi: {method: 'GET', path: '/customers/{id}'}})
    .input(z.object({id: z.string()}))
    .output(models.customer)
    .query(({ctx, input}) => mgmtProxyCallProvider({ctx, input})),
  upsertCustomer: mgmtProcedure
    .meta({openapi: {method: 'PUT', path: '/customers/{customer_id}'}})
    .input(models.customer.pick({customer_id: true, name: true, email: true}))
    .output(models.customer)
    .mutation(({ctx, input}) => mgmtProxyCallProvider({ctx, input})),

  // Connection management

  listConnections: mgmtProcedure
    .meta({
      openapi: {method: 'GET', path: '/customers/{customer_id}/connections'},
    })
    .input(z.object({customer_id: z.string()}))
    .output(z.array(models.connection))
    .query(({ctx, input}) => mgmtProxyCallProvider({ctx, input})),

  getConnection: mgmtProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/customers/{customer_id}/connections/{provider_name}',
      },
    })
    .input(z.object({customer_id: z.string(), provider_name: z.string()}))
    .output(models.connection)
    .query(({ctx, input}) => mgmtProxyCallProvider({ctx, input})),
  deleteConnection: mgmtProcedure
    .meta({
      openapi: {
        method: 'DELETE',
        path: '/customers/{customer_id}/connections/{provider_name}',
      },
    })
    .input(z.object({customer_id: z.string(), provider_name: z.string()}))
    .output(z.void())
    .query(({ctx, input}) => mgmtProxyCallProvider({ctx, input})),

  // MARK: - connection sync config

  getConnectionSyncConfig: mgmtProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/connection_sync_configs',
      },
    })
    .input(z.void())
    .output(models.connection_sync_config)
    .query(({ctx, input}) => mgmtProxyCallProvider({ctx, input})),

  upsertConnectionSyncConfig: mgmtProcedure
    .meta({
      openapi: {
        method: 'PUT',
        path: '/connection_sync_configs',
      },
    })
    .input(models.connection_sync_config)
    .output(models.connection_sync_config)
    .query(({ctx, input}) => mgmtProxyCallProvider({ctx, input})),
})

export type MgmtProvider<TInstance> = ProviderFromRouter<
  typeof mgmtRouter,
  TInstance,
  {headers: Headers},
  InitOpts
>

async function mgmtProxyCallProvider({
  input,
  ctx,
}: {
  input: unknown
  ctx: MgmtProcedure
}) {
  const instance = ctx.provider.__init__({ctx})
  // verticals.salesEngagement.listContacts -> listContacts
  const methodName = ctx.path.split('.').pop() ?? ''
  const implementation = ctx.provider?.[methodName as '__init__'] as Function

  if (typeof implementation !== 'function') {
    throw new TRPCError({
      code: 'NOT_IMPLEMENTED',
      message: `${ctx.providerName} provider does not implement ${ctx.path}`,
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const out = await implementation({instance, input, ctx})
  // console.log('[proxyCallRemote] output', out)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return out
}