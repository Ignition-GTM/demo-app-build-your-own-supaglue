import {db as _db, dbUpsert, eq, schema, sql} from '@supaglue/db'
import {publicProcedure, trpc, z} from '@supaglue/vdk'
import {TRPCError} from '@trpc/server'
import {initNangoSDK} from '@opensdks/sdk-nango'
import {initSupaglueSDK} from '@opensdks/sdk-supaglue'
import * as models from './models'

export const mgmtProcedure = publicProcedure.use(async ({next, ctx}) => {
  const supaglueApiKey =
    ctx.headers.get('x-api-key') ?? ctx.supaglueApiKey ?? ''
  if (!supaglueApiKey) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'x-api-key header is required',
    })
  }
  const supaglue = initSupaglueSDK({headers: {'x-api-key': supaglueApiKey}})
  const nango = initNangoSDK({
    headers: {authorization: `Bearer ${ctx.headers.get('nango-secret-key')}`},
  })

  const useNewBackend =
    ctx.headers.get('x-use-new-backend')?.toLowerCase() === 'true'

  return next({ctx: {...ctx, db: _db, supaglue, nango, useNewBackend}})
})

export async function getCustomerOrFail(db: typeof _db, id: string) {
  const cus = await db.query.customer.findFirst({
    where: eq(schema.customer.id, id),
  })
  if (!cus) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `Customer not found even after upsert. id: ${id}`,
    })
  }
  return {...cus, customer_id: cus.id}
}

export const mgmtRouter = trpc.router({
  // Customer management
  listCustomers: mgmtProcedure
    .meta({openapi: {method: 'GET', path: '/customers'}})
    .input(z.void())
    .output(z.array(models.customer))
    .query(async ({ctx}) =>
      ctx.useNewBackend
        ? ctx.db.query.customer
            .findMany()
            .then((rows) => rows.map((r) => ({...r, customer_id: r.id})))
        : ctx.supaglue.mgmt.GET('/customers').then((r) => r.data),
    ),

  getCustomer: mgmtProcedure
    .meta({openapi: {method: 'GET', path: '/customers/{id}'}})
    .input(z.object({id: z.string()}))
    .output(models.customer)
    .query(async ({ctx, input}) =>
      ctx.useNewBackend
        ? getCustomerOrFail(ctx.db, input.id)
        : ctx.supaglue.mgmt
            .GET('/customers/{customer_id}', {
              params: {path: {customer_id: input.id}},
            })
            .then((r) => r.data),
    ),
  upsertCustomer: mgmtProcedure
    .meta({openapi: {method: 'PUT', path: '/customers/{customer_id}'}})
    .input(models.customer.pick({customer_id: true, name: true, email: true}))
    .output(models.customer)
    .mutation(async ({ctx, input}) => {
      if (ctx.useNewBackend) {
        await dbUpsert(
          ctx.db,
          schema.customer,
          [{...input, id: input.customer_id, updated_at: sql.raw('now()')}],
          {noDiffColumns: ['updated_at']},
        )
        return getCustomerOrFail(ctx.db, input.customer_id)
      }
      return ctx.supaglue.mgmt
        .PUT('/customers', {
          body: {
            customer_id: input.customer_id,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            email: input.email!,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            name: input.name!,
          },
        })
        .then((r) => r.data)
    }),

  // Connection management

  listConnections: mgmtProcedure
    .meta({
      openapi: {method: 'GET', path: '/customers/{customer_id}/connections'},
    })
    .input(z.object({customer_id: z.string()}))
    .output(z.array(models.connection))
    .query(async ({ctx, input}) =>
      ctx.useNewBackend
        ? ctx.nango
            .GET('/connection', {
              params: {query: {connectionId: input.customer_id}},
            })
            .then((r) => r.data.configs.map(models.fromNangoConnection))
        : ctx.supaglue.mgmt
            .GET('/customers/{customer_id}/connections', {
              params: {path: {customer_id: input.customer_id}},
            })
            .then((r) => r.data),
    ),

  getConnection: mgmtProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/customers/{customer_id}/connections/{provider_name}',
      },
    })
    .input(z.object({customer_id: z.string(), provider_name: z.string()}))
    .output(models.connection)
    .query(async ({ctx, input}) =>
      ctx.supaglue.mgmt
        .GET('/customers/{customer_id}/connections/{provider_name}', {
          params: {
            path: {
              customer_id: input.customer_id,
              provider_name: input.provider_name as 'hubspot',
            },
          },
        })
        .then((r) => r.data),
    ),
  deleteConnection: mgmtProcedure
    .meta({
      openapi: {
        method: 'DELETE',
        path: '/customers/{customer_id}/connections/{provider_name}',
      },
    })
    .input(z.object({customer_id: z.string(), provider_name: z.string()}))
    .output(z.void())
    .query(async ({ctx, input}) =>
      ctx.supaglue.mgmt
        .DELETE('/customers/{customer_id}/connections/{provider_name}', {
          params: {
            path: {
              customer_id: input.customer_id,
              provider_name: input.provider_name as 'hubspot',
            },
          },
        })
        .then((r) => r.data),
    ),

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
    .query(async ({ctx}) =>
      ctx.supaglue.mgmt
        .GET('/connection_sync_configs', {
          params: {
            header: {
              'x-customer-id': ctx.headers.get('x-customer-id')!,
              'x-provider-name': ctx.headers.get('x-provider-name')!,
            },
          },
        })

        .then((r) => r.data),
    ),

  upsertConnectionSyncConfig: mgmtProcedure
    .meta({
      openapi: {
        method: 'PUT',
        path: '/connection_sync_configs',
      },
    })
    .input(models.connection_sync_config)
    .output(models.connection_sync_config)
    .query(async ({ctx, input}) =>
      ctx.supaglue.mgmt
        .PUT('/connection_sync_configs', {
          params: {
            header: {
              'x-customer-id': ctx.headers.get('x-customer-id')!,
              'x-provider-name': ctx.headers.get('x-provider-name')!,
            },
          },
          body: {
            custom_objects: input.custom_objects!,
            destination_config: input.destination_config as {
              type: 'postgres'
              schema: string
            },
          },
        })
        .then((r) => r.data),
    ),
})
