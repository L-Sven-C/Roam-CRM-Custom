import React, { useEffect, useState } from "react"
import { Button, FormGroup, InputGroup, Intent } from "@blueprintjs/core"
import { showToast } from "./toast"
import {
    getContactEventPages,
    getDefaultContactEventPages,
    setContactEventPages,
} from "../schema"
import { t } from "../i18n"

function ContactEventPagesSettings({ extensionAPI }) {
    const [pagesText, setPagesText] = useState("")

    useEffect(() => {
        setPagesText(getContactEventPages(extensionAPI).join(", "))
    }, [extensionAPI])

    const handleSave = () => {
        const pages = setContactEventPages(extensionAPI, pagesText)
        setPagesText(pages.join(", "))
        showToast(t(extensionAPI, "contactEvents.saved"), "SUCCESS")
    }

    const handleReset = () => {
        const pages = setContactEventPages(extensionAPI, getDefaultContactEventPages(extensionAPI))
        setPagesText(pages.join(", "))
        showToast(t(extensionAPI, "contactEvents.resetDone"), "SUCCESS")
    }

    return (
        <div className="crm-contact-event-pages-settings" style={{ padding: "10px" }}>
            <FormGroup
                label={t(extensionAPI, "contactEvents.pagesLabel")}
                helperText={t(extensionAPI, "contactEvents.pagesHelp")}
            >
                <InputGroup
                    value={pagesText}
                    placeholder={getDefaultContactEventPages(extensionAPI).join(", ")}
                    onChange={(event) => setPagesText(event.target.value)}
                />
            </FormGroup>

            <div style={{ display: "flex", gap: "10px" }}>
                <Button intent={Intent.PRIMARY} onClick={handleSave}>
                    {t(extensionAPI, "contactEvents.save")}
                </Button>
                <Button icon="reset" onClick={handleReset}>
                    {t(extensionAPI, "contactEvents.reset")}
                </Button>
            </div>
        </div>
    )
}

export default ContactEventPagesSettings
