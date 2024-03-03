import JsonURL from '@jsonurl/jsonurl'
import {z} from '@opensdks/util-zod'

export const zPaginationParams = z.object({
  cursor: z.string().nullish(),
  page_size: z.number().optional(),
})
export type Pagination = z.infer<typeof zPaginationParams>

export const zPaginatedResult = z.object({
  next_cursor: z.string().nullish(),
  has_next_page: z.boolean(),
})

export type PaginatedOutput<T extends {}> = z.infer<
  ReturnType<typeof paginatedOutput<z.ZodObject<any, any, any, T>>>
>
export function paginatedOutput<ItemType extends z.AnyZodObject>(
  itemSchema: ItemType,
) {
  return z.object({
    has_next_page: z.boolean(),
    items: z.array(itemSchema.extend({_original: z.unknown()})),
  })
}

const zLastUpdatedAtId = z.object({
  last_updated_at: z.string(),
  last_id: z.string(),
})

export const LastUpdatedAtId = {
  fromCursor: (cursor?: string | null) => {
    if (!cursor) {
      return undefined
    }
    const ret = zLastUpdatedAtId.safeParse(JsonURL.parse(cursor))
    // TODO: Return indication to caller that the cursor is invalid so that they can dynamically
    // switch to a full sync rather than incremental sync
    if (!ret.success) {
      console.warn('Failed to parse LastUpdatedAtId cursor', cursor, ret.error)
      return undefined
    }
    return ret.data
  },
  toCursor: (params?: z.infer<typeof zLastUpdatedAtId>) => {
    if (!params) {
      return null
    }
    return JsonURL.stringify(params)
  },
}

const zLastUpdatedAtNextOffset = z.object({
  last_updated_at: z.string(),
  // TODO: Rename to next_cursor from next_offset
  next_offset: z.string().nullish(),
})

export const LastUpdatedAtNextOffset = {
  fromCursor: (cursor?: string | null) => {
    if (!cursor) {
      return undefined
    }
    const ret = zLastUpdatedAtNextOffset.safeParse(JsonURL.parse(cursor))
    // TODO: Return indication to caller that the cursor is invalid so that they can dynamically
    // switch to a full sync rather than incremental sync
    if (!ret.success) {
      console.warn('Failed to parse LastUpdatedAtId cursor', cursor, ret.error)
      return undefined
    }
    return ret.data
  },
  toCursor: (params?: z.infer<typeof zLastUpdatedAtNextOffset>) => {
    if (!params) {
      return null
    }
    return JsonURL.stringify(params)
  },
}

// cursor pagination
// offset increment pagination
// updated_since + id ideally
// page increment pagination

// TODO: Move these out to a separate file

export const zBaseRecord = z.object({
  id: z.string(),
  /** z.string().datetime() does not work for simple things like `2023-07-19T23:46:48.000+0000`  */
  updated_at: z.string().describe('ISO8601 date string'),
  raw_data: z.record(z.unknown()).optional(),
})

export type BaseRecord = z.infer<typeof zBaseRecord>

export const zWarning = z
  .object({
    title: z.string().optional(),
    problem_type: z.string().optional(),
    detail: z.string().optional(),
  })
  .openapi({ref: 'warning'})

export function withWarnings<T extends z.ZodRawShape>(shape: T) {
  return z.object({
    ...shape,
    warnings: z.array(zWarning).optional(),
  })
}
