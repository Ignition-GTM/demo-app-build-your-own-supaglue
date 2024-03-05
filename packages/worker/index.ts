// Inngest related exports
import type {Events} from '@supaglue/events'
import {inngest} from '@supaglue/events'
import type {ServeHandlerOptions} from 'inngest'
import {serve} from 'inngest/next'
import * as functions from './functions'

// TODO: add metadata to functions or otherwise generate inngestFunctions from functions
// to reduce boilerplate and make it so that we don't have to manually add new functions to inngestFunctions
// and have the potential to miss new functions. May also need eslint barrel for codegen support as well.
export const inngestFunctions = [
  inngest.createFunction(
    {id: 'schedule-syncs'},
    {cron: '0 * * * *'}, // Once an hour on the hour by default
    functions.scheduleSyncs,
  ),
  inngest.createFunction(
    {id: 'sync-connection'},
    {event: 'sync.requested'},
    functions.syncConnection,
  ),
  inngest.createFunction(
    {id: 'send-webhook'},
    // Inngest supports it but it is not supported in the sdk
    // @see https://discord.com/channels/842170679536517141/1214066130860118087/1214283616327180318
    {event: '*' as keyof Events},
    functions.sendWebhook,
  ),
  inngest.createFunction(
    {id: 'trigger-immediate-sync'},
    {event: 'connection.created'},
    functions.triggerImmediateSync,
  ),
]

export function createWorkerHandler(
  opts?: Omit<ServeHandlerOptions, 'client' | 'functions'>,
) {
  return serve({...opts, client: inngest, functions: inngestFunctions})
}

// Non-Inngest exports
export {functions as routines}
