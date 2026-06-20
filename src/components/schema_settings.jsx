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
        showToast("Schema settings saved. Reload Roam to refresh Agenda watches.", "SUCCESS")
    }

    const handleReset = () => {
        const normalizedSchema = setCRMSchema(extensionAPI, DEFAULT_CRM_SCHEMA)
        setSchema(normalizedSchema)
        showToast("Schema settings reset to lowercase defaults.", "SUCCESS")
    }

    const previewSchema = normalizeCRMSchema(schema)

    return (
        <div className="crm-schema-settings" style={{ padding: "10px" }}>
            {CRM_SCHEMA_FIELDS.map((field) => (
                <FormGroup
                    key={field.key}
                    label={field.label}
                    helperText={`Default: ${DEFAULT_CRM_SCHEMA[field.key]}`}
                >
                    <InputGroup
                        value={schema[field.key] || ""}
                        placeholder={DEFAULT_CRM_SCHEMA[field.key]}
                        onChange={(event) => updateField(field.key, event.target.value)}
                    />
                </FormGroup>
            ))}

            <div style={{ marginBottom: "12px", color: "#bfccd6" }}>
                Current defaults create{" "}
                <code>{previewSchema.metadataAttribute}::</code> with{" "}
                <code>{previewSchema.tagAttribute}:: #{previewSchema.personTagPage}</code>, Agenda tag{" "}
                <code>#{previewSchema.agendaPage}</code>, and call blocks under{" "}
                <code>[[{previewSchema.callPage}]]</code>.
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
                <Button intent={Intent.PRIMARY} onClick={handleSave}>
                    Save Schema
                </Button>
                <Button icon="reset" onClick={handleReset}>
                    Reset Defaults
                </Button>
            </div>
        </div>
    )
}

export default SchemaSettings
