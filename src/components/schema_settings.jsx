import React, { useEffect, useState } from "react"
import { Button, FormGroup, InputGroup, Intent } from "@blueprintjs/core"
import { showToast } from "./toast"
import {
    CRM_SCHEMA_FIELDS,
    DEFAULT_CRM_SCHEMA,
    getCRMSchema,
    normalizeCRMSchema,
    setCRMSchema,
} from "../schema"
import { t } from "../i18n"

function SchemaSettings({ extensionAPI }) {
    const [schema, setSchema] = useState(DEFAULT_CRM_SCHEMA)

    useEffect(() => {
        setSchema(getCRMSchema(extensionAPI))
    }, [extensionAPI])

    const updateField = (key, value) => {
        setSchema((currentSchema) => ({
            ...currentSchema,
            [key]: value,
        }))
    }

    const handleSave = () => {
        const normalizedSchema = setCRMSchema(extensionAPI, schema)
        setSchema(normalizedSchema)
        showToast(t(extensionAPI, "schema.saved"), "SUCCESS")
    }

    const handleReset = () => {
        const normalizedSchema = setCRMSchema(extensionAPI, DEFAULT_CRM_SCHEMA)
        setSchema(normalizedSchema)
        showToast(t(extensionAPI, "schema.resetDone"), "SUCCESS")
    }

    const previewSchema = normalizeCRMSchema(schema)

    return (
        <div className="crm-schema-settings" style={{ padding: "10px" }}>
            {CRM_SCHEMA_FIELDS.map((field) => (
                <FormGroup
                    key={field.key}
                    label={t(extensionAPI, `schema.${field.key}`)}
                    helperText={t(extensionAPI, "schema.default", {
                        value: DEFAULT_CRM_SCHEMA[field.key],
                    })}
                >
                    <InputGroup
                        value={schema[field.key] || ""}
                        placeholder={DEFAULT_CRM_SCHEMA[field.key]}
                        onChange={(event) => updateField(field.key, event.target.value)}
                    />
                </FormGroup>
            ))}

            <div style={{ marginBottom: "12px", color: "#bfccd6" }}>
                {t(extensionAPI, "schema.preview", {
                    metadata: previewSchema.metadataAttribute,
                    category: previewSchema.tagAttribute,
                    personTag: previewSchema.personTagPage,
                    contact: previewSchema.contactPage,
                    agenda: previewSchema.agendaPage,
                    agendaAttribute: previewSchema.agendaAttribute,
                    call: previewSchema.callPage,
                })}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
                <Button intent={Intent.PRIMARY} onClick={handleSave}>
                    {t(extensionAPI, "schema.save")}
                </Button>
                <Button icon="reset" onClick={handleReset}>
                    {t(extensionAPI, "schema.reset")}
                </Button>
            </div>
        </div>
    )
}

export default SchemaSettings
