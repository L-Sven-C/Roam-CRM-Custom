export const CRM_SCHEMA_SETTING_KEY = "crm-schema"

export const DEFAULT_CRM_SCHEMA = {
    personTagPage: "person",
    tagAttribute: "category",
    metadataAttribute: "metadata",
    contactPage: "contact",
    birthdayAttribute: "birthday",
    lastContactedAttribute: "last contacted",
    contactFrequencyAttribute: "contact frequency",
    emailAttribute: "email",
    agendaPage: "agenda",
    agendaAttribute: "agenda",
    callPage: "call",
    notesAttribute: "notes",
    nextActionsAttribute: "next actions",
}

export const CRM_SCHEMA_FIELDS = [
    { key: "personTagPage", label: "Person tag page" },
    { key: "tagAttribute", label: "Person marker attribute" },
    { key: "metadataAttribute", label: "Metadata page" },
    { key: "contactPage", label: "Contact section page" },
    { key: "birthdayAttribute", label: "Birthday attribute" },
    { key: "lastContactedAttribute", label: "Last contacted attribute" },
    { key: "contactFrequencyAttribute", label: "Contact frequency attribute" },
    { key: "emailAttribute", label: "Email attribute" },
    { key: "agendaPage", label: "Agenda page/tag" },
    { key: "agendaAttribute", label: "Agenda attribute" },
    { key: "callPage", label: "Call page" },
    { key: "notesAttribute", label: "Notes attribute" },
    { key: "nextActionsAttribute", label: "Next actions attribute" },
]

const ATTRIBUTE_KEYS = new Set([
    "tagAttribute",
    "birthdayAttribute",
    "lastContactedAttribute",
    "contactFrequencyAttribute",
    "emailAttribute",
    "agendaAttribute",
    "notesAttribute",
    "nextActionsAttribute",
])

const PAGE_KEYS = new Set(["personTagPage", "metadataAttribute", "contactPage", "agendaPage", "callPage"])

function stripRoamPageSyntax(value) {
    return value
        .replace(/^#\[\[(.*)\]\]$/, "$1")
        .replace(/^\[\[(.*)\]\]$/, "$1")
        .replace(/^#/, "")
}

export function normalizeSchemaValue(key, value) {
    const fallback = DEFAULT_CRM_SCHEMA[key]
    if (typeof value !== "string") return fallback

    let normalized = value.trim()
    if (!normalized) return fallback

    if (ATTRIBUTE_KEYS.has(key)) {
        normalized = normalized.replace(/\s*:+\s*$/, "").trim()
    }

    if (PAGE_KEYS.has(key)) {
        normalized = stripRoamPageSyntax(normalized).trim()
    }

    return normalized || fallback
}

export function normalizeCRMSchema(schema) {
    return Object.keys(DEFAULT_CRM_SCHEMA).reduce((acc, key) => {
        acc[key] = normalizeSchemaValue(key, schema?.[key] || DEFAULT_CRM_SCHEMA[key])
        return acc
    }, {})
}

export function getCRMSchema(extensionAPI) {
    const savedSchema = extensionAPI?.settings?.get(CRM_SCHEMA_SETTING_KEY)
    const savedSchemaObject = savedSchema && typeof savedSchema === "object" ? savedSchema : {}
    const schema = {
        ...DEFAULT_CRM_SCHEMA,
        ...savedSchemaObject,
    }

    if (!savedSchemaObject.tagAttribute || savedSchemaObject.tagAttribute === "tag") {
        schema.tagAttribute = DEFAULT_CRM_SCHEMA.tagAttribute
    }

    return normalizeCRMSchema({
        ...schema,
    })
}

export function setCRMSchema(extensionAPI, schema) {
    const normalizedSchema = normalizeCRMSchema(schema)
    extensionAPI.settings.set(CRM_SCHEMA_SETTING_KEY, normalizedSchema)
    return normalizedSchema
}

export function createAttributeText(schema, key, value = "") {
    const attr = normalizeSchemaValue(key, schema?.[key])
    const attrPrefix = `${attr}::`
    const stringValue = value === null || value === undefined ? "" : String(value).trim()
    return stringValue ? `${attrPrefix} ${stringValue}` : attrPrefix
}

export function createPageRef(pageTitle) {
    return `[[${pageTitle}]]`
}

export function createHashTag(pageTitle) {
    return /^[A-Za-z0-9_-]+$/.test(pageTitle) ? `#${pageTitle}` : `#[[${pageTitle}]]`
}

export function createAgendaRegex(schema) {
    const pageTitle = escapeRegExp(schema.agendaPage)
    return new RegExp(`\\[\\[${pageTitle}\\]\\]|#${pageTitle}|#\\[\\[${pageTitle}\\]\\]`, "g")
}

export function createHashTagRegex(pageTitle) {
    const escapedPageTitle = escapeRegExp(pageTitle)
    return new RegExp(`#${escapedPageTitle}|#\\[\\[${escapedPageTitle}\\]\\]`, "g")
}

export function getAgendaPullEntity(extensionAPI) {
    const schema = getCRMSchema(extensionAPI)
    return `[:node/title "${escapeDatalogString(schema.agendaPage)}"]`
}

export function getDefaultEventKeywords(extensionAPI) {
    const schema = getCRMSchema(extensionAPI)
    return [
        {
            term: "1:1",
            requiresMultipleAttendees: true,
            template: "[[1:1]] with {attendees}",
            priority: 1,
        },
        {
            term: "dinner",
            requiresMultipleAttendees: true,
            template: "[[dinner]] with {attendees}",
            priority: 2,
        },
        {
            term: "",
            requiresMultipleAttendees: true,
            template: `${createPageRef(schema.callPage)} with {attendees}`,
            priority: 999,
            isDefault: true,
        },
    ]
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function escapeDatalogString(value) {
    return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')
}
