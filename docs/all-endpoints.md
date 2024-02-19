# All supaglue endpoints

POST  	createAccount	/crm/v2/accounts
GET   	listAccounts	/crm/v2/accounts
POST  	upsertAccount	/crm/v2/accounts/_upsert
GET   	getAccount	/crm/v2/accounts/{account_id}
PATCH 	updateAccount	/crm/v2/accounts/{account_id}
POST  	createContact	/crm/v2/contacts
GET   	listContacts	/crm/v2/contacts
POST  	searchContacts	/crm/v2/contacts/_search
POST  	upsertContact	/crm/v2/contacts/_upsert
GET   	getContact	/crm/v2/contacts/{contact_id}
PATCH 	updateContact	/crm/v2/contacts/{contact_id}
POST  	createLead	/crm/v2/leads
GET   	listLeads	/crm/v2/leads
POST  	upsertLead	/crm/v2/leads/_upsert
POST  	searchLeads	/crm/v2/leads/_search
GET   	getLead	/crm/v2/leads/{lead_id}
PATCH 	updateLead	/crm/v2/leads/{lead_id}
POST  	createOpportunity	/crm/v2/opportunities
GET   	listOpportunities	/crm/v2/opportunities
GET   	getOpportunity	/crm/v2/opportunities/{opportunity_id}
PATCH 	updateOpportunity	/crm/v2/opportunities/{opportunity_id}
GET   	listUsers	/crm/v2/users
GET   	getUser	/crm/v2/users/{user_id}
POST  	createCustomObjectRecord	/crm/v2/custom_objects/{object_name}/records
GET   	listCustomObjectRecords	/crm/v2/custom_objects/{object_name}/records
PATCH 	updateCustomObjectRecord	/crm/v2/custom_objects/{object_name}/records/{record_id}
GET   	getCustomObjectRecord	/crm/v2/custom_objects/{object_name}/records/{record_id}
POST  	createStandardObjectRecord	/crm/v2/standard_objects/{object_name}/records
GET   	listStandardObjectRecords	/crm/v2/standard_objects/{object_name}/records
PATCH 	updateStandardObjectRecord	/crm/v2/standard_objects/{object_name}/records/{record_id}
GET   	getStandardObjectRecord	/crm/v2/standard_objects/{object_name}/records/{record_id}
GET   	listAssociations	/crm/v2/associations
PUT   	upsertAssociation	/crm/v2/associations
GET   	listAssociationSchemas	/crm/v2/metadata/associations
POST  	createAssociationSchema	/crm/v2/metadata/associations
GET   	listCustomObjectSchemas	/crm/v2/metadata/custom_objects
POST  	createCustomObjectSchema	/crm/v2/metadata/custom_objects
GET   	listStandardObjectSchemas	/crm/v2/metadata/standard_objects
GET   	listPropertiesPreview	/crm/v2/metadata/properties/{object_name}
POST  	createProperty	/crm/v2/metadata/properties/{object_name}
GET   	getProperty	/crm/v2/metadata/properties/{object_name}/{property_name}
PATCH 	updateProperty	/crm/v2/metadata/properties/{object_name}/{property_name}
POST  	registerProperty	/crm/v2/metadata/properties/{object_name}/register
GET   	getCustomObjectSchema	/crm/v2/metadata/custom_objects/{object_name}
PUT   	updateCustomObjectSchema	/crm/v2/metadata/custom_objects/{object_name}
GET   	listLists	/crm/v2/lists
GET   	listListMemberships	/crm/v2/lists/{list_id}

POST  	createAccount	/engagement/v2/accounts
GET   	listAccounts	/engagement/v2/accounts
POST  	searchAccounts	/engagement/v2/accounts/_search
GET   	getAccount	/engagement/v2/accounts/{account_id}
PATCH 	updateAccount	/engagement/v2/accounts/{account_id}
POST  	upsertAccount	/engagement/v2/accounts/_upsert
POST  	createContact	/engagement/v2/contacts
GET   	listContacts	/engagement/v2/contacts
POST  	searchContacts	/engagement/v2/contacts/_search
GET   	getContact	/engagement/v2/contacts/{contact_id}
PATCH 	updateContact	/engagement/v2/contacts/{contact_id}
GET   	listUsers	/engagement/v2/users
GET   	getUser	/engagement/v2/users/{user_id}
GET   	listMailboxes	/engagement/v2/mailboxes
GET   	getMailbox	/engagement/v2/mailboxes/{mailbox_id}
POST  	createSequence	/engagement/v2/sequences
GET   	listSequences	/engagement/v2/sequences
GET   	getSequence	/engagement/v2/sequences/{sequence_id}
POST  	createSequenceStep	/engagement/v2/sequences/{sequence_id}/sequence_steps
PATCH 	updateSequenceStep	/engagement/v2/sequences/{sequence_id}/sequence_steps/{sequence_step_id}
POST  	createSequenceState	/engagement/v2/sequence_states
GET   	listSequenceStates	/engagement/v2/sequence_states
POST  	searchSequenceStates	/engagement/v2/sequence_states/_search
POST  	batchCreateSequenceState	/engagement/v2/sequence_states/_batch
GET   	getSequenceState	/engagement/v2/sequence_states/{sequence_state_id}

POST  	sendPassthroughRequest	/actions/v2/passthrough

GET   	listSalesforceContacts	/data/v2/salesforce/contacts
GET   	listSalesforceAccounts	/data/v2/salesforce/accounts
GET   	listHubspotContacts	/data/v2/hubspot/contacts
GET   	listHubspotCompanies	/data/v2/hubspot/companies

GET   	enrichPerson	/enrichment/v2/persons

POST  	submitForm	/marketing-automation/v2/forms/{form_id}/_submit
GET   	listForms	/marketing-automation/v2/forms
GET   	getFormFields	/marketing-automation/v2/forms/{form_id}/_fields

GET   	listCustomObjects	/metadata/v2/objects/custom
GET   	listStandardObjects	/metadata/v2/objects/standard
GET   	listPropertiesDeprecated	/metadata/v2/properties

GET   	listAccounts	/ticketing/v2/accounts
GET   	getAccount	/ticketing/v2/accounts/{account_id}
GET   	listCollections	/ticketing/v2/collections
GET   	getCollection	/ticketing/v2/collections/{collection_id}
GET   	listCollectionUsers	/ticketing/v2/collections/{parent_id}/users
GET   	listUsers	/ticketing/v2/users
GET   	getUser	/ticketing/v2/users/{user_id}
GET   	listContacts	/ticketing/v2/contacts
GET   	getContact	/ticketing/v2/contacts/{contact_id}
GET   	listTeams	/ticketing/v2/teams
GET   	getTeam	/ticketing/v2/teams/{team_id}
GET   	listTickets	/ticketing/v2/tickets
POST  	createTicket	/ticketing/v2/tickets
GET   	getTicket	/ticketing/v2/tickets/{ticket_id}
PATCH 	updateTicket	/ticketing/v2/tickets/{ticket_id}
GET   	listComments	/ticketing/v2/comments
POST  	createComment	/ticketing/v2/comments
GET   	getComment	/ticketing/v2/comments/{comment_id}
GET   	listTags	/ticketing/v2/tags
GET   	getTag	/ticketing/v2/tags/{tag_id}
GET   	listAttachments	/ticketing/v2/attachments
POST  	createAttachment	/ticketing/v2/attachments
GET   	getAttachment	/ticketing/v2/attachments/{attachment_id}

GET   	getCustomers	/mgmt/v2/customers
PUT   	upsertCustomer	/mgmt/v2/customers
GET   	getCustomer	/mgmt/v2/customers/{customer_id}
DELETE	deleteCustomer	/mgmt/v2/customers/{customer_id}
GET   	getDestinations	/mgmt/v2/destinations
POST  	createDestination	/mgmt/v2/destinations
GET   	getDestination	/mgmt/v2/destinations/{destination_id}
PUT   	updateDestination	/mgmt/v2/destinations/{destination_id}
GET   	getMagicLinks	/mgmt/v2/magic_links
POST  	createMagicLink	/mgmt/v2/magic_links
DELETE	deleteMagicLink	/mgmt/v2/magic_links/{magic_link_id}
GET   	listFieldMappings	/mgmt/v2/field_mappings
PUT   	updateObjectFieldMappings	/mgmt/v2/field_mappings/_update_object
GET   	listEntityMappings	/mgmt/v2/entity_mappings
PUT   	upsertEntityMapping	/mgmt/v2/entity_mappings/{entity_id}
DELETE	deleteEntityMapping	/mgmt/v2/entity_mappings/{entity_id}
GET   	getSchemas	/mgmt/v2/schemas
POST  	createSchema	/mgmt/v2/schemas
GET   	getSchema	/mgmt/v2/schemas/{schema_id}
PUT   	updateSchema	/mgmt/v2/schemas/{schema_id}
DELETE	deleteSchema	/mgmt/v2/schemas/{schema_id}
GET   	getEntities	/mgmt/v2/entities
POST  	createEntity	/mgmt/v2/entities
GET   	getEntity	/mgmt/v2/entities/{entity_id}
PUT   	updateEntity	/mgmt/v2/entities/{entity_id}
DELETE	deleteEntity	/mgmt/v2/entities/{entity_id}
GET   	getProviders	/mgmt/v2/providers
POST  	createProvider	/mgmt/v2/providers
GET   	getProvider	/mgmt/v2/providers/{provider_id}
PUT   	updateProvider	/mgmt/v2/providers/{provider_id}
DELETE	deleteProvider	/mgmt/v2/providers/{provider_id}
GET   	getSyncConfigs	/mgmt/v2/sync_configs
POST  	createSyncConfig	/mgmt/v2/sync_configs
GET   	getSyncConfig	/mgmt/v2/sync_configs/{sync_config_id}
PUT   	updateSyncConfig	/mgmt/v2/sync_configs/{sync_config_id}
DELETE	deleteSyncConfig	/mgmt/v2/sync_configs/{sync_config_id}
GET   	getConnectionSyncConfig	/mgmt/v2/connection_sync_configs
PUT   	upsertConnectionSyncConfig	/mgmt/v2/connection_sync_configs
DELETE	deleteConnectionSyncConfig	/mgmt/v2/connection_sync_configs
GET   	getConnections	/mgmt/v2/customers/{customer_id}/connections
POST  	createConnection	/mgmt/v2/customers/{customer_id}/connections
GET   	getProviderUserId	/mgmt/v2/customers/{customer_id}/connections/_provider_user_id
GET   	getConnection	/mgmt/v2/customers/{customer_id}/connections/{provider_name}
DELETE	deleteConnection	/mgmt/v2/customers/{customer_id}/connections/{provider_name}
GET   	getConnectionRateLimitInfo	/mgmt/v2/customers/{customer_id}/connections/{provider_name}/_rate_limit_info
GET   	getSyncs	/mgmt/v2/syncs
POST  	pauseSync	/mgmt/v2/syncs/_pause
POST  	resumeSync	/mgmt/v2/syncs/_resume
POST  	triggerSync	/mgmt/v2/syncs/_trigger
GET   	getSyncRuns	/mgmt/v2/sync-runs
