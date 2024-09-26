import {mapper, z, zBaseRecord, zCast} from '@supaglue/vdk'
import type {Oas_crm_contacts, Oas_crm_owners} from '@opensdks/sdk-hubspot'
import type {PipelineStageMapping} from '.'
import {unified} from '../../router'

export type SimplePublicObject =
  Oas_crm_contacts['components']['schemas']['SimplePublicObject']
export type Owner = Oas_crm_owners['components']['schemas']['PublicOwner']

export const HUBSPOT_OBJECT_SINGULAR_TO_PLURAL = {
  company: 'companies',
  contact: 'contacts',
  deal: 'deals',
  line_item: 'line_items',
  product: 'products',
  ticket: 'tickets',
  quote: 'quotes',
  call: 'calls',
  communication: 'communications',
  email: 'emails',
  meeting: 'meetings',
  note: 'notes',
  postal_mail: 'postal_mails',
  task: 'tasks',
  // Technically not a "standard" object, but we are treating it as such
  owner: 'owners',
} as const

export type HubspotObjectTypeSingular =
  keyof typeof HUBSPOT_OBJECT_SINGULAR_TO_PLURAL
export type HubspotObjectTypePlural =
  (typeof HUBSPOT_OBJECT_SINGULAR_TO_PLURAL)[HubspotObjectTypeSingular]

export const HSAssociation = z.object({
  id: z.string().describe('Id of the related object'),
  type: z.string().openapi({
    examples: ['contact_to_company', 'contact_to_company_unlabeled'],
  }),
})

export const HSAssociations = z.record(
  // Technically can be anything... but we are only using `companies` for now
  z.string().openapi({
    example: 'companies',
    description: 'pluralized form object type',
  }),
  z.union([z.undefined(), z.object({results: z.array(HSAssociation)})]),
)

export const HSBase = z.object({
  id: z.string(),
  properties: z
    .object({
      hs_object_id: z.string(),
      createdate: z.string().nullish(),
      lastmodifieddate: z.string().nullish(),
      hs_lastmodifieddate: z.string().nullish(),
    })
    .passthrough(),
  associations: HSAssociations.nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
  archived: z.boolean(),
})
export const HSContact = z.object({
  id: z.string(),
  properties: z
    .object({
      hs_object_id: z.string(),
      hs_lastmodifieddate: z.string().nullish(),
      createdate: z.string().nullish(),
      lastmodifieddate: z.string().nullish(),
      // properties specific to contacts below...
      email: z.string().nullish(),
      phone: z.string().nullish(),
      firstname: z.string().nullish(),
      lastname: z.string().nullish(),
    })
    .passthrough(),
  associations: HSAssociations.nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
  archived: z.boolean(),
})
export const HSDeal = z.object({
  id: z.string(),
  properties: z
    .object({
      hs_object_id: z.string(),
      createdate: z.string().nullish(),
      lastmodifieddate: z.string().nullish(),
      // properties specific to opportunities below...
      dealname: z.string().nullish(),
      hubspot_owner_id: z.string().nullish(),
      notes_last_updated: z.string().nullish(), // Assuming lastActivityAt is a string in HubSpot format
      dealstage: z.string().nullish(),
      pipeline: z.string().nullish(),
      closedate: z.string().nullish(), // Assuming closeDate is a string in HubSpot format
      description: z.string().nullish(),
      amount: z.string().nullish(),
      hs_is_closed_won: z.string().nullish(),
      hs_is_closed: z.string().nullish(),

      // account_id: z.string().nullish(),
      // status: z.string().nullish(),
      is_deleted: z.boolean().nullish(), // Does this exist?
      archivedAt: z.string().nullish(), // Does this exist?
    })
    .passthrough(),
  associations: HSAssociations.nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
  archived: z.boolean(),
  /** toObjectType => toObjectId[] */
  '#pipelineStageMapping': zCast<PipelineStageMapping>(),
})
export const HSCompany = z.object({
  id: z.string(),
  properties: z
    .object({
      hs_object_id: z.string(),
      createdate: z.string().nullish(),
      lastmodifieddate: z.string().nullish(),
      name: z.string().nullish(),
      description: z.string().nullish(),
      hubspot_owner_id: z.string().nullish(),
      industry: z.string().nullish(),
      website: z.string().nullish(),
      numberofemployees: z.string().nullish(),
      addresses: z.string().nullish(), // Assuming addresses is a string; adjust the type if needed
      phonenumbers: z.string().nullish(), // Assuming phonenumbers is a string; adjust the type if needed
      lifecyclestage: z.string().nullish(),
      notes_last_updated: z.string().nullish(),
    })
    .passthrough(),
  associations: HSAssociations.nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
  archived: z.boolean(),
})
export const HSEmail = z.object({
  id: z.string(),
  properties: z
    .object({
      hs_timestamp: z.string().nullish(),
      hubspot_owner_id: z.string().nullish(),
      hs_email_direction: z.string().nullish(),
      hs_email_html: z.string().nullish(),
      hs_email_status: z.string().nullish(),
      hs_email_subject: z.string().nullish(),
      hs_email_text: z.string().nullish(),
      hs_email_from_email: z.string().nullish(),
      hs_email_from_firstname: z.string().nullish(),
      hs_email_from_lastname: z.string().nullish(),
      hs_email_to_email: z.string().nullish(),
      hs_email_to_firstname: z.string().nullish(),
      hs_email_to_lastname: z.string().nullish(),
      hs_attachment_ids: z.string().nullish(),
      hs_email_headers: z.string().nullish(),
    })
    .passthrough(),
  associations: HSAssociations.nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
  archived: z.boolean(),
})
export const HSCall = z.object({
  id: z.string(),
  properties: z.object({
    hs_timestamp: z.string().nullish(),
    hs_call_body: z.string().nullish(),
    hs_call_callee_object_id: z.string().nullish(),
    hs_call_callee_object_type_id: z.string().nullish(),
    hs_call_direction: z.string().nullish(),
    hs_call_disposition: z.string().nullish(),
    hs_call_duration: z.string().nullish(),
    hs_call_from_number: z.string().nullish(),
    hs_call_recording_url: z.string().nullish(),
    hs_call_status: z.string().nullish(),
    hs_call_title: z.string().nullish(),
    hs_call_source: z.string().nullish(),
    hs_call_to_number: z.string().nullish(),
    hubspot_owner_id: z.string().nullish(),
    hs_activity_type: z.string().nullish(),
    hs_attachment_ids: z.string().nullish(),
  }),
  associations: HSAssociations.nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
  archived: z.boolean(),
})
export const HSNote = z.object({
  id: z.string(),
  properties: z.object({
    hs_timestamp: z.string().nullish(),
    hs_note_body: z.string().nullish(),
    hubspot_owner_id: z.string().nullish(),
    hs_attachment_ids: z.string().nullish(),
  }),
  associations: HSAssociations.nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
  archived: z.boolean(),
})
export const HSMeeting = z.object({
  id: z.string(),
  properties: z.object({
    hs_timestamp: z.string().nullish(),
    hs_meeting_title: z.string().nullish(),
    hubspot_owner_id: z.string().nullish(),
    hs_meeting_body: z.string().nullish(),
    hs_meeting_start_time: z.string().nullish(),
    hs_meeting_end_time: z.string().nullish(),
    hs_meeting_outcome: z.string().nullish(),
    hs_activity_type: z.string().nullish(),
    hs_attachment_ids: z.string().nullish(),
    hs_meeting_location: z.string().nullish(),
    hs_meeting_external_URL: z.string().nullish(),
    hs_internal_meeting_notes: z.string().nullish(),
  }),
  associations: z
    .object({
      deals: z
        .union([
          z.array(
            z.object({
              id: z.string(),
              type: z.string(),
            }),
          ),
          z.object({
            results: z.array(
              z.object({
                id: z.string(),
                type: z.string(),
              }),
            ),
          }),
        ])
        .optional(),
    })
    .optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  archived: z.boolean(),
})

export const associationsToFetch = {
  contact: ['company'],
  deal: ['company'],
  email: ['email'],
  call: ['call'],
  note: ['note'],
  meeting: ['deal'],
}
export const propertiesToFetch = {
  company: [
    'hubspot_owner_id',
    'description',
    'industry',
    'website',
    'domain',
    'hs_additional_domains',
    'numberofemployees',
    'address',
    'address2',
    'city',
    'state',
    'country',
    'zip',
    'phone',
    'notes_last_updated',
    'lifecyclestage',
    'createddate',
  ],
  contact: [
    'address', // TODO: IP state/zip/country?
    'address2',
    'city',
    'country',
    'email',
    'fax',
    'firstname',
    'hs_createdate', // TODO: Use this or createdate?
    'hs_is_contact', // TODO: distinguish from "visitor"?
    'hubspot_owner_id',
    'lifecyclestage',
    'lastname',
    'mobilephone',
    'phone',
    'state',
    'work_email',
    'zip',
  ],
  deal: [
    'dealname',
    'description',
    'amount',
    'hubspot_owner_id',
    'notes_last_updated',
    'closedate',
    'dealstage',
    'pipeline',
    'hs_is_closed_won',
    'hs_is_closed',
  ],
  email: [
    'hs_timestamp',
    'hubspot_owner_id',
    'hs_email_direction',
    'hs_email_html',
    'hs_email_status',
    'hs_email_subject',
    'hs_email_text',
    'hs_attachment_ids',
    'hs_email_headers',
    'hs_email_from_email',
    'hs_email_from_firstname',
    'hs_email_from_lastname',
    'hs_email_to_email',
    'hs_email_to_firstname',
    'hs_email_to_lastname',
  ],
  call: [
    'hs_call_body',
    'hs_call_direction',
    'hs_call_duration',
    'hs_call_status',
    'hs_call_from_number',
    'hs_call_recording_url',
    'hs_call_disposition',
    'hs_call_source',
  ],
  note: ['hs_note_body', 'hs_attachment_ids'],
  meeting: [
    'hs_timestamp',
    'hs_meeting_title',
    'hubspot_owner_id',
    'hs_meeting_body',
    'hs_internal_meeting_notes',
    'hs_meeting_external_URL',
    'hs_meeting_location',
    'hs_meeting_start_time',
    'hs_meeting_end_time',
    'hs_meeting_outcome',
    'hs_activity_type',
    'hs_attachment_ids',
  ],
}

export const mappers = {
  companies: mapper(HSCompany, unified.account, {
    id: 'id',
    name: 'properties.name',
    updated_at: (record) => new Date(record.updatedAt).toISOString(),
    is_deleted: (record) => !!record.archived,
    website: 'properties.website',
    industry: 'properties.industry',
    number_of_employees: (record) =>
      record.properties.numberofemployees
        ? Number.parseInt(record.properties.numberofemployees, 10)
        : null,
    owner_id: 'properties.hubspot_owner_id',
    created_at: (record) => new Date(record.createdAt).toISOString(),
  }),
  contacts: mapper(HSContact, unified.contact, {
    id: 'id',
    first_name: 'properties.firstname',
    last_name: 'properties.lastname',
    email: 'properties.email',
    phone: 'properties.phone',
    updated_at: (record) => new Date(record.updatedAt).toISOString(),
  }),
  opportunity: mapper(HSDeal, unified.opportunity, {
    id: 'id',
    name: 'properties.dealname',
    description: 'properties.description',
    owner_id: 'properties.hubspot_owner_id',
    status: (record) =>
      record.properties.hs_is_closed_won
        ? 'WON'
        : record.properties.hs_is_closed
          ? 'LOST'
          : 'OPEN',
    stage: (r) =>
      r['#pipelineStageMapping'][r.properties.pipeline ?? '']?.stageLabelById?.[
        r.properties.dealstage ?? ''
      ],
    account_id: (r) => r.associations?.['companies']?.results?.[0]?.id,
    close_date: 'properties.closedate',
    amount: (record) =>
      record.properties.amount
        ? Number.parseFloat(record.properties.amount)
        : null,
    last_activity_at: 'properties.notes_last_updated',
    created_at: 'properties.createdate',
    // TODO: take into account archivedAt if needed
    updated_at: (record) => new Date(record.updatedAt).toISOString(),
    last_modified_at: (record) => new Date(record.updatedAt).toISOString(),
  }),
  lead: mapper(HSBase, unified.lead, {
    id: 'id',
    updated_at: (record) => new Date(record.updatedAt).toISOString(),
  }),
  user: mapper(zCast<Owner>(), unified.user, {
    id: 'id',
    updated_at: 'updatedAt',
    created_at: 'createdAt',
    last_modified_at: 'updatedAt',
    name: (o) => [o.firstName, o.lastName].filter((n) => !!n?.trim()).join(' '),
    email: 'email',
    is_active: (record) => !record.archived, // Assuming archived is a boolean
    is_deleted: (record) => !!record.archived, // Assuming archived is a boolean
  }),
  customObject: mapper(HSBase, zBaseRecord, {
    id: 'id',
    updated_at: 'properties.hs_lastmodifieddate',
  }),
  emails: mapper(HSEmail, unified.email, {
    id: 'id',
    updated_at: (record) => new Date(record.updatedAt).toISOString(),
    from_email: 'properties.hs_email_from_email',
    to_email: 'properties.hs_email_to_email',
    subject: 'properties.hs_email_subject',
    text: 'properties.hs_email_text',
    // html: 'properties.hs_email_html',
    // status: 'properties.hs_email_status',
    // from_first_name: 'properties.hs_email_from_firstname',
    // from_last_name: 'properties.hs_email_from_lastname',
    // to_first_name: 'properties.hs_email_to_firstname',
    // to_last_name: 'properties.hs_email_to_lastname',
    // last_modified_at: (record) => new Date(record.updatedAt).toISOString(),
  }),
  calls: mapper(HSCall, unified.call, {
    id: 'id',
    updated_at: (record) => new Date(record.updatedAt).toISOString(),
    // body: 'properties.hs_call_body',
    // direction: 'properties.hs_call_direction',
    // duration: 'properties.hs_call_duration',
    // status: 'properties.hs_call_status',
    // from_number: 'properties.hs_call_from_number',
    // source: 'properties.hs_call_source',
    // disposition: 'properties.hs_call_disposition',
    // recording_url: 'properties.hs_call_recording_url',
    // created_at: 'properties.hs_timestamp',
    // last_modified_at: (record) => new Date(record.updatedAt).toISOString(),
  }),
  notes: mapper(HSNote, unified.note, {
    id: 'id',
    updated_at: (record) => new Date(record.updatedAt).toISOString(),
    // body: 'properties.hs_note_body',
    // attachment_ids: 'properties.hs_attachment_ids',
    // created_at: 'properties.hs_timestamp',
  }),
  meetings: mapper(HSMeeting, unified.meeting, {
    id: 'id',
    updated_at: (record) => new Date(record.updatedAt).toISOString(),
    deals: (record) => {
      if (!record.associations?.deals) return []
      if (Array.isArray(record.associations.deals)) {
        return record.associations.deals.map((deal) => ({id: deal.id}))
      }
      if (record.associations.deals.results) {
        return record.associations.deals.results.map((deal) => ({id: deal.id}))
      }
      return []
    },
  }),
}
const HSProperties = z.record(z.string())
const HSObject = z.object({
  properties: HSProperties,
  associations: z.any().optional(), // for now
})

// const reverse_address = mapper(unified.address, zHSProperties, {
//   address: (addr) => addr?.street_1 ?? '',
//   // TODO: Support address2 for companies only
//   city: (addr) => addr?.city ?? '',
//   state: (addr) => addr?.state ?? '',
//   zip: (addr) => addr?.postal_code ?? '',
//   country: (addr) => addr?.country ?? '',
// })

// const reverse_phone_numbers = mapper(
//   z.array(unified.phone_number),
//   zHSProperties,
//   {
//     phone: (phones) =>
//       phones.find((p) => p.phone_number_type === 'primary')?.phone_number ?? '',
//     mobilephone: (phones) =>
//       phones.find((p) => p.phone_number_type === 'mobile')?.phone_number ?? '',
//     fax: (phones) =>
//       phones.find((p) => p.phone_number_type === 'fax')?.phone_number ?? '',
//   },
// )

function getIfObject(
  props: Record<string, unknown> | null | undefined,
  key: string,
) {
  return props?.[key] != null && typeof props[key] === 'object'
    ? (props[key] as Record<string, unknown>)
    : {}
}

/** destinations mappers */
export const reverseMappers = {
  companies_input: mapper(unified.account_input, HSObject, (input) => ({
    ...input.passthrough_fields,
    properties: removeUndefinedValues({
      // We will remove undefined values later... Though it's arguable this is stil the right approach
      // for mapping when it got so complicated
      name: nullToEmptyString(input.name),
      industry: nullToEmptyString(input.industry),
      description: nullToEmptyString(input.description),
      website: nullToEmptyString(input.website),
      numberofemployees: nullToEmptyString(
        input.number_of_employees?.toString(),
      ),
      lifecyclestage: nullToEmptyString(input.lifecycle_stage),
      hubspot_owner_id: nullToEmptyString(input.owner_id),
      // only primary phone is supported for hubspot accounts
      phone:
        input.phone_numbers?.find((p) => p.phone_number_type === 'primary')
          ?.phone_number ?? '',
      address: input.addresses?.[0]?.street_1 ?? '',
      // NOTE: Support address2 for companies only
      city: input.addresses?.[0]?.city ?? '',
      state: input.addresses?.[0]?.state ?? '',
      zip: input.addresses?.[0]?.postal_code ?? '',
      country: input.addresses?.[0]?.country ?? '',
      ...getIfObject(input.passthrough_fields, 'properties'),
    }),
  })),
  contacts_input: mapper(unified.contact_input, HSObject, (input) => ({
    ...input.passthrough_fields,
    properties: removeUndefinedValues({
      last_name: nullToEmptyString(input.last_name),
      first_name: nullToEmptyString(input.first_name),
      email: nullToEmptyString(input.email),
      phone: nullToEmptyString(input.phone),
      ...getIfObject(input.passthrough_fields, 'properties'),
    }),
  })),
}

// MARK: - Utils

const removeValues = (
  obj: Record<string, unknown>,
  fn: (k: string, v: unknown) => boolean,
) => {
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  Object.keys(obj).forEach((key) => (fn(key, obj[key]) ? delete obj[key] : {}))
  return obj
}

const removeUndefinedValues = <T extends Record<string, unknown>>(
  obj: T,
): {[k in keyof T]: Exclude<T[k], undefined>} =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  removeValues(obj, (_, v) => v === undefined) as any

const nullToEmptyString = (
  value: string | undefined | null,
): string | undefined => (value === null ? '' : value)
