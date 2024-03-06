// import {createClient, fetchLink} from '@opensdks/runtime'
import {env} from '@supaglue/env'
import {initSupaglueSDK} from '@opensdks/sdk-supaglue'

// import {env} from '@/env'

const supaglue = initSupaglueSDK({
  headers: {'x-api-key': env['SUPAGLUE_API_KEY']!},
})

// async function main() {
//   const syncConfigs = await supaglue.mgmt
//     .GET('/sync_configs')
//     .then((r) => r.data)
//   const customers = await supaglue.mgmt.GET('/customers').then((r) => r.data)
//   const connections = await Promise.all(
//     customers.map((c) =>
//       supaglue.mgmt
//         .GET('/customers/{customer_id}/connections', {
//           params: {path: {customer_id: c.customer_id}},
//         })
//         .then((r) => r.data),
//     ),
//   ).then((nestedArr) =>
//     nestedArr
//       .flatMap((arr) => arr)
//       .map((conn) => ({
//         ...conn,
//         // Not taking into account connection sync config here
//         sync_config: syncConfigs.find(
//           (c) => c.provider_name === conn.provider_name,
//         ),
//       })),
//   )
//   console.log('connections', connections)
// }
// main()

// supaglue.mgmt.GET('/sync_configs', {
//   params: {
//     // header: {
//     //   'x-customer-id': env['CUSTOMER_ID']!,
//     //   'x-provider-name': env['PROVIDER_NAME']!,
//     // },
//   },
// })

// supaglue.mgmt
//   .GET('/customers/{customer_id}/connections/{provider_name}', {
//     params: {
//       path: {customer_id: '$STUOMER_ID', provider_name: 'hubspot'},
//     },
//   })
//   .then((r) => {
//     console.log(r.data)
//   })

// createClient({
//   baseUrl: 'https://api.supaglue.io',
//   links: [fetchLink()],
//   headers: {'x-api-key': env['SUPAGLUE_API_KEY']!},
// })
//   .request(
//     'GET',
//     '/private/v2/customers/$STUOMER_ID/connections/$CONNECTIONID',
//   )
//   .then((r) => {
//     console.log(r.data)
//   })

async function exportMe() {
  const res = await supaglue.mgmt
    .GET('/customers/{customer_id}/connections', {
      params: {path: {customer_id: env['CUSTOMER_ID']!}},
    })
    .then((r) => {
      const conn = r.data.find((c) => c.provider_name === env['PROVIDER_NAME']!)
      if (!conn) {
        throw new Error('Connection not found')
      }
      return supaglue.private.exportConnection({
        customerId: conn.customer_id,
        connectionId: conn.id,
      })
    })
  console.log(res.data)
}
exportMe()
// supaglue.private
//   .exportConnection({
//     customerId: env['CUSTOMER_ID']!,
//     connectionId: env['CONNECTION_ID']!,
//   })
//   .then((r) => {
//     console.log(r.data)
//   })
