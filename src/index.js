import displayBirthdays from "./components/birthday_drawer"
import { showToast } from "./components/toast"
import { getAllPeople, parseAgendaPull } from "./utils_reminders"
import { getPageUID, isSecondDateAfter, getExtensionAPISetting } from "./utils"
import { getEventInfo } from "./utils_gcal"
import {
    createLastWeekCalls,
    createLastMonthCalls,
    createPersonTemplates,
    createCallTemplates,
} from "./components/call_templates"
import IntervalSettings from "./components/list_intervals"
import displayCRMDialog from "./components/clay"
import { moveFocus, getLastBlockAndFocus } from './utils';
import EventKeywordSettings from "./components/event_keyword_settings"
import SchemaSettings from "./components/schema_settings"
import { getAgendaPullEntity, getCRMSchema } from "./schema"
import { UI_LANGUAGE_OPTIONS, t } from "./i18n"

const testing = false
const version = "v2.9.8"

const plugin_title = "Roam CRM Custom"

var runners = {
    intervals: [],
    eventListeners: [],
    pullFunctions: [],
    pullWatches: [],
}

let googleLoadedHandler

const pullPattern =
    "[:block/_refs :block/uid :node/title {:block/_refs [{:block/refs[:node/title]} :node/title :block/uid :block/string]}]"

function versionTextComponent() {
    return React.createElement("div", {}, version)
}

function headerTextComponent() {
    return React.createElement("h1", {})
}

//MARK: config panel
function createPanelConfig(extensionAPI, pullFunction) {
    const wrappedIntervalConfig = () => IntervalSettings({ extensionAPI })
    const wrappedEventKeywordConfig = () => EventKeywordSettings({ extensionAPI })
    const wrappedSchemaConfig = () => SchemaSettings({ extensionAPI })
    return {
        tabTitle: plugin_title,
        settings: [
            {
                id: "version-text",
                name: t(extensionAPI, "settings.version"),
                action: { type: "reactComponent", component: versionTextComponent },
            },
            {
                id: "ui-language-header",
                name: t(extensionAPI, "settings.language.header"),
                action: { type: "reactComponent", component: headerTextComponent },
            },
            {
                id: "ui-language",
                name: t(extensionAPI, "settings.language.name"),
                description: t(extensionAPI, "settings.language.description"),
                action: {
                    type: "select",
                    items: UI_LANGUAGE_OPTIONS,
                },
            },
            {
                id: "schema-header",
                name: t(extensionAPI, "settings.schema.header"),
                action: { type: "reactComponent", component: headerTextComponent },
            },
            {
                id: "schema-settings",
                name: t(extensionAPI, "settings.schema.name"),
                description: t(extensionAPI, "settings.schema.description"),
                className: "crm-schema-setting",
                action: { type: "reactComponent", component: wrappedSchemaConfig },
            },
            {
                id: "event-keywords-header",
                name: t(extensionAPI, "settings.eventKeywords.header"),
                action: { type: "reactComponent", component: headerTextComponent },
            },
            {
                id: "event-keywords-setting",
                name: t(extensionAPI, "settings.eventKeywords.name"),
                description: t(extensionAPI, "settings.eventKeywords.description"),
                className: "crm-event-keywords-setting",
                action: { type: "reactComponent", component: wrappedEventKeywordConfig },
            },
            {
                id: "modal-header",
                name: t(extensionAPI, "settings.modal.header"),
                action: { type: "reactComponent", component: headerTextComponent },
            },
            {
                id: "batch-contact-notification",
                name: t(extensionAPI, "settings.batch.name"),
                description: t(extensionAPI, "settings.batch.description"),
                action: {
                    type: "select",
                    items: [
                        "No Batch",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                    ],
                },
            },
            {
                id: "interval-settings",
                name: t(extensionAPI, "settings.intervals.name"),
                description: t(extensionAPI, "settings.intervals.description"),
                className: "crm-reminders-interval-setting",
                action: { type: "reactComponent", component: wrappedIntervalConfig },
            },
            {
                id: "sidebar-button",
                name: t(extensionAPI, "settings.sidebar.name"),
                description: t(extensionAPI, "settings.sidebar.description"),
                action: {
                    type: "switch",
                    onChange: (evt) => {
                        if (evt.target.checked) {
                            crmbutton(extensionAPI)
                        } else {
                            var crmDiv = document.getElementById("crmDiv")
                            crmDiv.remove()
                        }
                    },
                },
            },
            {
                id: "trigger-modal",
                name: t(extensionAPI, "settings.triggerStart.name"),
                description: t(extensionAPI, "settings.triggerStart.description"),
                action: {
                    type: "switch",
                    onChange: async (evt) => {
                        // TODO is this ever removed?
                    },
                },
            },
            {
                id: "trigger-modal-on-load",
                name: t(extensionAPI, "settings.preventLoad.name"),
                description: t(extensionAPI, "settings.preventLoad.description"),
                action: {
                    type: "switch",
                    onChange: async (evt) => {
                        // TODO is this ever removed?
                    },
                },
            },
            {
                id: "dnp-all-birthdays",
                name: t(extensionAPI, "settings.allBirthdays.name"),
                description: t(extensionAPI, "settings.allBirthdays.description"),
                action: {
                    type: "switch",
                },
            },
            {
                id: "show-birthday-check-toast",
                name: t(extensionAPI, "settings.birthdayToast.name"),
                description: t(extensionAPI, "settings.birthdayToast.description"),
                action: {
                    type: "switch",
                },
            },
            {
                id: "calendar-header",
                name: t(extensionAPI, "settings.calendar.header"),
                action: { type: "reactComponent", component: headerTextComponent },
            },
            {
                id: "calendar-setting",
                name: t(extensionAPI, "settings.calendarImport.name"),
                description: t(extensionAPI, "settings.calendarImport.description"),
                action: {
                    type: "switch",
                    onChange: async (evt) => { },
                },
            },

            {
                id: "include-event-title",
                name: t(extensionAPI, "settings.includeTitle.name"),
                description: t(extensionAPI, "settings.includeTitle.description"),
                action: {
                    type: "switch",
                    onChange: (evt) => { },
                },
            },
            {
                id: "detect-deleted-events",
                name: t(extensionAPI, "settings.deletedEvents.name"),
                description: t(extensionAPI, "settings.deletedEvents.description"),
                action: {
                    type: "switch",
                    onChange: (evt) => { },
                },
            },
            {
                id: "agenda-header",
                name: t(extensionAPI, "settings.agenda.header"),
                action: { type: "reactComponent", component: headerTextComponent },
            },

            {
                id: "agenda-addr-setting",
                name: t(extensionAPI, "settings.agendaRun.name"),
                description: t(extensionAPI, "settings.agendaRun.description"),
                action: {
                    type: "switch",
                    onChange: async (evt) => {
                        const agendaEntity = getAgendaPullEntity(extensionAPI)
                        if (evt.target.checked) {
                            await parseAgendaPull(
                                window.roamAlphaAPI.pull(pullPattern, agendaEntity),
                                extensionAPI,
                            )
                            // agenda addr pull watch
                            addPullWatch(agendaEntity, pullFunction)
                        } else {
                            removePullWatch(agendaEntity, pullFunction)
                        }
                    },
                },
            },
            {
                id: "agenda-addr-remove-names",
                name: t(extensionAPI, "settings.agendaRemoveNames.name"),
                description: t(extensionAPI, "settings.agendaRemoveNames.description"),
                action: { type: "switch" },
            },
            
            {
                id: "templates-header",
                name: t(extensionAPI, "settings.templates.header"),
                description: t(extensionAPI, "settings.templates.description"),
                action: { type: "reactComponent", component: headerTextComponent },
            },
            {
                id: "person-template",
                name: t(extensionAPI, "settings.personTemplate.name"),
                description: t(extensionAPI, "settings.personTemplate.description"),
                action: {
                    type: "button",
                    onClick: async () => {
                        const templatePageUID = await getPageUID("roam/templates")
                        createPersonTemplates(templatePageUID, getCRMSchema(extensionAPI))
                        showToast(t(extensionAPI, "toast.templateAdded"), "SUCCESS")
                    },
                    content: t(extensionAPI, "settings.import"),
                },
            },
            {
                id: "call-rollup-query",
                name: t(extensionAPI, "settings.callRollup.name"),
                description: t(extensionAPI, "settings.callRollup.description"),
                action: {
                    type: "button",
                    onClick: async () => {
                        const schema = getCRMSchema(extensionAPI)
                        const callPageUID = await getPageUID(schema.callPage)
                        createLastMonthCalls(callPageUID, schema)
                        createLastWeekCalls(callPageUID, schema)

                        showToast(t(extensionAPI, "toast.templatesAdded"), "SUCCESS")
                    },
                    content: t(extensionAPI, "settings.import"),
                },
            },
            {
                id: "call-template",
                name: t(extensionAPI, "settings.callTemplate.name"),
                description: t(extensionAPI, "settings.callTemplate.description"),
                action: {
                    type: "button",
                    onClick: async () => {
                        const templatePageUID = await getPageUID("roam/templates")
                        createCallTemplates(templatePageUID, getCRMSchema(extensionAPI))
                        showToast(t(extensionAPI, "toast.templateAdded"), "SUCCESS")
                    },
                    content: t(extensionAPI, "settings.import"),
                },
            },
        ],
    }
}

async function crmbutton(extensionAPI) {
    //creates a new left sidebar log button below Daily Notes

    if (!document.getElementById("crmDiv")) {
        var divCRM = document.createElement("div")
        divCRM.classList.add("log-button")
        divCRM.innerHTML = "Roam CRM"
        divCRM.id = "crmDiv"
        var spanCRM = document.createElement("span")
        spanCRM.classList.add("bp3-icon", "bp3-icon-people", "icon")
        divCRM.prepend(spanCRM)
        var sidebarcontent = document.querySelector(
            "#app > div.roam-body > div.roam-app > div.roam-sidebar-container.noselect > div",
        ),
            sidebartoprow = sidebarcontent.childNodes[1]
        if (sidebarcontent && sidebartoprow) {
            sidebartoprow.parentNode.insertBefore(divCRM, sidebartoprow.nextSibling)
        }
        divCRM.onclick = async () => {
            const allPeople = await getAllPeople(extensionAPI)
            displayCRMDialog(allPeople, extensionAPI)
        }
    }
}

async function setDONEFilter(page) {
    // sets a page filter to hide DONE tasks
    var fRemoves = await window.roamAlphaAPI.ui.filters.getPageFilters({ page: { title: page } })[
        "removes"
    ]
    // check if DONE is already filtered. if not add it
    const containsDONE = fRemoves.includes("DONE")

    if (!containsDONE) {
        fRemoves.push("DONE")
        await window.roamAlphaAPI.ui.filters.setPageFilters({
            page: { title: page },
            filters: { removes: fRemoves },
        })
    }
}

function createGoogleLoadedHandler(people, extensionAPI) {
    // handler for loading events once the google extension has finished loading
    return async function handleGoogleLoaded() {
        if (window.roamjs?.extension.smartblocks) {
            await getEventInfo(people, extensionAPI, testing, false, 'initial-load')
        }
    }
}

// Function to add an event listener and store its reference
function addEventListener(target, event, callback) {
    target.addEventListener(event, callback)
    runners.eventListeners.push({ target, event, callback })
}

function addPullWatch(entity, callback) {
    window.roamAlphaAPI.data.addPullWatch(pullPattern, entity, callback)
    runners.pullWatches.push({ entity, callback })
}

function removePullWatch(entity, callback) {
    window.roamAlphaAPI.data.removePullWatch(pullPattern, entity, callback)
    runners.pullWatches = runners.pullWatches.filter(
        (watch) => watch.entity !== entity || watch.callback !== callback,
    )
}

//MARK: onload
async function onload({ extensionAPI }) {
    const pullFunction = async function a(before, after) {
        await parseAgendaPull(after, extensionAPI)
    }
    // add to runners so it can be removed later
    runners.pullFunctions.push(pullFunction)

    const panelConfig = createPanelConfig(extensionAPI, pullFunction)
    extensionAPI.settings.panel.create(panelConfig)
    const ts1 = new Date().getTime()

    const people = await getAllPeople(extensionAPI)
    // add left sidebar button
    // sidebar-button
    if (getExtensionAPISetting(extensionAPI, "sidebar-button", false)) {
        crmbutton(extensionAPI)
    }

    if (testing) {
        // displayCRMDialog(people)
        // displayBirthdays(people, "01-19-2024", extensionAPI)
    } else {
        if (!getExtensionAPISetting(extensionAPI, "trigger-modal-on-load", false)) {
            displayBirthdays(
                people,
                getExtensionAPISetting(extensionAPI, "last-birthday-check-date", "01-19-2024"),
                extensionAPI,
            )
        }

    }

    // update last birthday check since it's already happened
    extensionAPI.settings.set(
        "last-birthday-check-date",
        window.roamAlphaAPI.util.dateToPageUid(new Date()),
    )
    
    // Set up birthday checks ONLY for users who don't have calendar integration enabled
    // Users with calendar integration will get these checks through the calendar interval
    if (!getExtensionAPISetting(extensionAPI, "calendar-setting", false)) {
        console.log("Setting up dedicated birthday check interval (calendar integration disabled)");
        const birthdayCheckIntervalId = setInterval(
            async () => {
                try {
                    // Check if the date has changed since last birthday check
                    const todaysDNPUID = window.roamAlphaAPI.util.dateToPageUid(new Date());
                    const lastBirthdayCheckDate = getExtensionAPISetting(
                        extensionAPI,
                        "last-birthday-check-date",
                        "01-19-2024"
                    );
                    
                    // If we've crossed over to a new date since the last check
                    if (isSecondDateAfter(lastBirthdayCheckDate, todaysDNPUID)) {
                        console.log("New day detected during birthday check interval");
                        // Get an updated list of people
                        const updatedPeople = await getAllPeople(extensionAPI);
                        // Run the birthday checks - this will update DNP and show modal if needed
                        await displayBirthdays(updatedPeople, lastBirthdayCheckDate, extensionAPI);
                        // Update the last birthday check date
                        extensionAPI.settings.set(
                            "last-birthday-check-date",
                            todaysDNPUID
                        );
                        
                        // Show toast if setting is enabled
                        if (getExtensionAPISetting(extensionAPI, "show-birthday-check-toast", false)) {
                            showToast(t(extensionAPI, "toast.birthdayCompleteUpdated"), "SUCCESS");
                        }
                    } else {
                        // Always show the toast for periodic checks if setting is enabled
                        if (getExtensionAPISetting(extensionAPI, "show-birthday-check-toast", false)) {
                            showToast(t(extensionAPI, "toast.birthdayCompleteNoUpdates"), "INFO");
                        }
                    }
                } catch (error) {
                    console.error("Error in birthday check interval:", error);
                }
            },
            30 * 60 * 1000 // every 30 minutes
        );
        runners.intervals.push(birthdayCheckIntervalId);
    }

    if (getExtensionAPISetting(extensionAPI, "calendar-setting", false)) {
        // bring in the events
        // listen for the google extension to be loaded
        if (window.roamjs?.extension?.google) {
            await getEventInfo(people, extensionAPI, testing, false, 'initial-load')
        } else {
            googleLoadedHandler = createGoogleLoadedHandler(people, extensionAPI)
            document.body.addEventListener("roamjs:google:loaded", googleLoadedHandler)
        }
        // Set an interval to fetch google events every hour and check for new days
        const intervalId = setInterval(
            async () => {
                // Check calendar events
                await getEventInfo(people, extensionAPI, testing, false, 'hourly-interval');
                
                // Also check if the date has changed since last birthday check
                const todaysDNPUID = window.roamAlphaAPI.util.dateToPageUid(new Date());
                const lastBirthdayCheckDate = getExtensionAPISetting(
                    extensionAPI,
                    "last-birthday-check-date",
                    "01-19-2024"
                );
                
                // If we've crossed over to a new date since the last check
                if (isSecondDateAfter(lastBirthdayCheckDate, todaysDNPUID)) {
                    console.log("New day detected during hourly check, running birthday checks");
                    // Get an updated list of people
                    const updatedPeople = await getAllPeople(extensionAPI);
                    // Display birthdays in modal (if appropriate)
                    await displayBirthdays(updatedPeople, lastBirthdayCheckDate, extensionAPI);
                    // Update the last birthday check date
                    extensionAPI.settings.set(
                        "last-birthday-check-date",
                        todaysDNPUID
                    );
                    
                    // Show toast if setting is enabled
                    if (getExtensionAPISetting(extensionAPI, "show-birthday-check-toast", false)) {
                        showToast(t(extensionAPI, "toast.birthdayCompleteUpdated"), "SUCCESS");
                    }
                } else {
                    // Always show the toast for periodic checks if setting is enabled
                    if (getExtensionAPISetting(extensionAPI, "show-birthday-check-toast", false)) {
                        showToast(t(extensionAPI, "toast.birthdayCompleteNoUpdates"), "INFO");
                    }
                }
            },
            60 * 60 * 1000, // hourly
        )
        runners.intervals.push(intervalId)

        // set a listener to run the calendar check on visibility change.
        // This is so the check runs right when your laptop is openend
        addEventListener(document, "visibilitychange", () => {
            if (document.visibilityState === "visible") {
                getEventInfo(people, extensionAPI, testing, false, 'visibility-change');
                
                // Also check if the date has changed since the tab was last visible
                // This helps catch overnight changes when Roam is left open
                const visibilityLastDate = getExtensionAPISetting(
                    extensionAPI,
                    "visibility-last-date",
                    null
                );
                
                if (visibilityLastDate) {
                    const todaysDNPUID = window.roamAlphaAPI.util.dateToPageUid(new Date());
                    if (visibilityLastDate !== todaysDNPUID) {
                        console.log("Date changed since tab was last visible");
                        const lastBirthdayCheckDate = getExtensionAPISetting(
                            extensionAPI,
                            "last-birthday-check-date", 
                            "01-19-2024"
                        );
                        
                        // If we haven't checked birthdays today
                        if (isSecondDateAfter(lastBirthdayCheckDate, todaysDNPUID)) {
                            console.log("Running birthday checks after visibility change");
                            // Get an updated list of people since we might have been away for a while
                            getAllPeople(extensionAPI).then(updatedPeople => {
                                displayBirthdays(updatedPeople, lastBirthdayCheckDate, extensionAPI);
                                // Update the last birthday check date
                                extensionAPI.settings.set(
                                    "last-birthday-check-date",
                                    todaysDNPUID
                                );
                            });
                        }
                    }
                }
                
                // Store the current date whenever visibility changes to visible
                extensionAPI.settings.set(
                    "visibility-last-date",
                    window.roamAlphaAPI.util.dateToPageUid(new Date())
                );
            }
        })
    }

    // Enhanced visibility change detection for ALL users
    // This handles the overnight scenario and also tab switching
    addEventListener(document, "visibilitychange", () => {
        if (document.visibilityState === "visible") {
            // Get the date when we last saw the page visible
            const visibilityLastDate = getExtensionAPISetting(
                extensionAPI,
                "visibility-last-date",
                null
            );
            
            // Current date
            const todaysDNPUID = window.roamAlphaAPI.util.dateToPageUid(new Date());
            
            // If we have a previous date and it's different from today
            // OR if the user has specifically enabled the 'trigger modal at start of day' setting
            if ((visibilityLastDate && visibilityLastDate !== todaysDNPUID) || 
                getExtensionAPISetting(extensionAPI, "trigger-modal", false)) {
                
                console.log("Date changed or trigger-modal enabled, checking birthdays");
                const lastBirthdayCheckDate = getExtensionAPISetting(
                    extensionAPI,
                    "last-birthday-check-date",
                    "01-19-2024"
                );
                
                // Only trigger if we haven't yet checked today
                if (isSecondDateAfter(lastBirthdayCheckDate, todaysDNPUID)) {
                    console.log("Displaying birthdays after visibility change");
                    
                    // Get fresh data since we might have been away for a while
                    getAllPeople(extensionAPI).then(async updatedPeople => {
                        await displayBirthdays(updatedPeople, lastBirthdayCheckDate, extensionAPI);
                        
                        // Update last check date
                        extensionAPI.settings.set(
                            "last-birthday-check-date",
                            todaysDNPUID
                        );
                        
                        // Show toast if setting is enabled
                        if (getExtensionAPISetting(extensionAPI, "show-birthday-check-toast", false)) {
                            showToast(t(extensionAPI, "toast.birthdayActivationUpdated"), "SUCCESS");
                        }
                    });
                } else if (getExtensionAPISetting(extensionAPI, "show-birthday-check-toast", false)) {
                    // Show toast for visibility change check if enabled
                    showToast(t(extensionAPI, "toast.birthdayAlreadyUpdated"), "INFO");
                }
            }
            
            // Always update the visibility last date
            extensionAPI.settings.set(
                "visibility-last-date",
                todaysDNPUID
            );
        }
    });

    // always set people pages to hide DONE
    // TODO put this behind a flag
    people.forEach(async (page) => {
        await setDONEFilter(page.title)
    })

    //MARK: command palette
    // Command Palette Sidebar - Close first block
    extensionAPI.ui.commandPalette.addCommand({
        label: t(extensionAPI, "command.sidebarCloseFirst"),
        "disable-hotkey": false,
        callback: async () => {
            async function removeWindow(w) {
                window.roamAlphaAPI.ui.rightSidebar.removeWindow({
                    window: {
                        type: w["type"],
                        "block-uid": w["block-uid"] || w["page-uid"] || w["mentions-uid"],
                    },
                })
            }

            const focusedBlock = window.roamAlphaAPI.ui.getFocusedBlock()
            const sidebarWindows = window.roamAlphaAPI.ui.rightSidebar.getWindows()

            // Check if cursor is in sidebar
            const isInSidebar = focusedBlock && focusedBlock["window-id"].startsWith('sidebar-')
            
            if (isInSidebar) {
                // Find the window that matches the focused block
                const focusedWindow = sidebarWindows.find(
                    window => window["window-id"] === focusedBlock["window-id"]
                )

                // If cursor is in a pinned or superpinned block, close it
                if (focusedWindow && (focusedWindow["pinned?"] || focusedWindow["pinned-to-top?"])) {
                    await removeWindow(focusedWindow)
                    return
                }
            }

            // Default behavior: close first non-pinned block
            const filteredBlocks = sidebarWindows.filter((obj) => !obj["pinned?"])
            if (filteredBlocks.length > 0) {
                filteredBlocks.sort((a, b) => a.order - b.order)
                await removeWindow(filteredBlocks[0])
            }
        },
    })
    // Command Palette Sidebar - Cursor in first block
    extensionAPI.ui.commandPalette.addCommand({
        label: t(extensionAPI, "command.sidebarCursorFirst"),
        "disable-hotkey": false,
        callback: async () => {
            let sidebarWindows = window.roamAlphaAPI.ui.rightSidebar.getWindows()

            if (sidebarWindows.length > 0) {
                let first = sidebarWindows[0]
                if (first.type == "block") {
                    window.roamAlphaAPI.ui.setBlockFocusAndSelection({
                        location: {
                            "block-uid": first["block-uid"],
                            "window-id": first["window-id"],
                        },
                    })
                } else if (first.type == "outline") {
                    let query = `[:find (pull ?e [:block/string :block/uid :block/children :block/order {:block/children ...}])
                            :in $ ?uid
                            :where 
                  [?e :block/uid ?uid]
                  ]`

                    let result = window.roamAlphaAPI.q(query, first["page-uid"]).flat()
                    const selectedObject = result[0].children.find((obj) => obj.order === 0)
                    window.roamAlphaAPI.ui.setBlockFocusAndSelection({
                        location: {
                            "block-uid": selectedObject["uid"],
                            "window-id": first["window-id"],
                        },
                    })
                }
            }
        },
    })
    // Command Palette Sidebar - Toggle first sidebar window open/close
    extensionAPI.ui.commandPalette.addCommand({
        label: t(extensionAPI, "command.sidebarToggleFirst"),
        "disable-hotkey": false,
        callback: async () => {
            async function toggleWindowCollapse(w) {
                if (w["collapsed?"] === true) {
                    window.roamAlphaAPI.ui.rightSidebar.expandWindow({
                        window: {
                            type: w["type"],
                            "block-uid": w["block-uid"] || w["page-uid"] || w["mentions-uid"],
                        },
                    })
                } else if (w["collapsed?"] === false) {
                    window.roamAlphaAPI.ui.rightSidebar.collapseWindow({
                        window: {
                            type: w["type"],
                            "block-uid": w["block-uid"] || w["page-uid"] || w["mentions-uid"],
                        },
                    })
                }
            }

            let sidebarWindows = window.roamAlphaAPI.ui.rightSidebar.getWindows()

            if (sidebarWindows.length > 0) {
                sidebarWindows.sort((a, b) => a.order - b.order)
                await toggleWindowCollapse(sidebarWindows[0])
            }
        },
    })
    // Command Palette Sidebar - Pin focused block or page
    extensionAPI.ui.commandPalette.addCommand({
        label: t(extensionAPI, "command.sidebarPinFocused"),
        "disable-hotkey": false,
        callback: async () => {
            const focusedBlock = roamAlphaAPI.ui.getFocusedBlock()
            // If no block is focused, do nothing
            if (!focusedBlock) return

            if (focusedBlock["window-id"].startsWith("sidebar-")) {
                const sidebarWindows = window.roamAlphaAPI.ui.rightSidebar.getWindows()

                // Find the window in the sidebar that matches the window-id of the focused block
                const matchingWindow = sidebarWindows.find(
                    (window) => window["window-id"] === focusedBlock["window-id"],
                )

                if (matchingWindow) {
                    // toggle pin/unpin accordingly
                    if (matchingWindow["pinned?"]) {
                        // If the window is pinned, unpin it
                        window.roamAlphaAPI.ui.rightSidebar.unpinWindow({
                            window: {
                                type: matchingWindow.type,
                                "block-uid":
                                    matchingWindow["block-uid"] ||
                                    matchingWindow["page-uid"] ||
                                    matchingWindow["mentions-uid"],
                            },
                        })
                    } else {
                        // If the window is not pinned, pin it
                        window.roamAlphaAPI.ui.rightSidebar.pinWindow({
                            window: {
                                type: matchingWindow.type,
                                "block-uid":
                                    matchingWindow["block-uid"] ||
                                    matchingWindow["page-uid"] ||
                                    matchingWindow["mentions-uid"],
                            },
                        })
                    }
                }
            } else {
                // block is not in the sidebar
                // Let's first add it to the sidebar
                await window.roamAlphaAPI.ui.rightSidebar.addWindow({
                    window: { type: "block", "block-uid": focusedBlock["block-uid"] },
                })
                
                // Get updated sidebar windows to find our newly added window
                const updatedSidebarWindows = window.roamAlphaAPI.ui.rightSidebar.getWindows()
                const newWindow = updatedSidebarWindows.find(
                    window => window.type === "block" && 
                             window["block-uid"] === focusedBlock["block-uid"]
                )

                if (newWindow) {
                    if (newWindow["pinned?"]) {
                        // If already pinned, unpin it
                        window.roamAlphaAPI.ui.rightSidebar.unpinWindow({
                            window: {
                                type: "block",
                                "block-uid": focusedBlock["block-uid"],
                            },
                        })
                    } else {
                        // If not pinned, pin it
                        window.roamAlphaAPI.ui.rightSidebar.pinWindow({
                            window: {
                                type: "block",
                                "block-uid": focusedBlock["block-uid"],
                            },
                        })
                    }
                }
            }
        },
    })
    // Command Palette Sidebar - Super Pin (pin to top) focused block or page
    extensionAPI.ui.commandPalette.addCommand({
        label: t(extensionAPI, "command.sidebarPinTopFocused"),
        "disable-hotkey": false,
        callback: async () => {
            const focusedBlock = roamAlphaAPI.ui.getFocusedBlock()
            // If no block is focused, do nothing
            if (!focusedBlock) return

            if (focusedBlock["window-id"].startsWith("sidebar-")) {
                const sidebarWindows = window.roamAlphaAPI.ui.rightSidebar.getWindows()

                // Find the window in the sidebar that matches the window-id of the focused block
                const matchingWindow = sidebarWindows.find(
                    (window) => window["window-id"] === focusedBlock["window-id"],
                )

                if (matchingWindow) {
                    // toggle pin/unpin accordingly
                    if (matchingWindow["pinned?"]) {
                        // If the window is pinned, unpin it
                        window.roamAlphaAPI.ui.rightSidebar.unpinWindow({
                            window: {
                                type: matchingWindow.type,
                                "block-uid":
                                    matchingWindow["block-uid"] ||
                                    matchingWindow["page-uid"] ||
                                    matchingWindow["mentions-uid"],
                            },
                        })
                    } else {
                        // If the window is not pinned, pin it
                        window.roamAlphaAPI.ui.rightSidebar.pinWindow({
                            window: {
                                type: matchingWindow.type,
                                "block-uid":
                                    matchingWindow["block-uid"] ||
                                    matchingWindow["page-uid"] ||
                                    matchingWindow["mentions-uid"],
                            },
                            "pin-to-top?": true,
                        })
                    }
                }
            } else {
                // block is not in the sidebar
                // Let's first add it to the sidebar
                await window.roamAlphaAPI.ui.rightSidebar.addWindow({
                    window: { type: "block", "block-uid": focusedBlock["block-uid"] },
                })
                
                // Get updated sidebar windows to find our newly added window
                const updatedSidebarWindows = window.roamAlphaAPI.ui.rightSidebar.getWindows()
                const newWindow = updatedSidebarWindows.find(
                    window => window.type === "block" && 
                             window["block-uid"] === focusedBlock["block-uid"]
                )

                if (newWindow) {
                    if (newWindow["pinned-to-top?"]) {
                        // If already pinned to top, unpin it
                        window.roamAlphaAPI.ui.rightSidebar.unpinWindow({
                            window: {
                                type: "block",
                                "block-uid": focusedBlock["block-uid"],
                            },
                        })
                    } else {
                        // If not pinned to top, pin it
                        window.roamAlphaAPI.ui.rightSidebar.pinWindow({
                            window: {
                                type: "block",
                                "block-uid": focusedBlock["block-uid"],
                            },
                            "pin-to-top?": true,
                        })
                    }
                }
            }
        },
    })
    // Command Palette Sidebar - Nav Up open sidebar windows
    extensionAPI.ui.commandPalette.addCommand({
        label: t(extensionAPI, "command.sidebarNavigateUp"),
        callback: () => moveFocus('up'),
        "disable-hotkey": false,
    });
    // Command Palette Sidebar - Nav Down open sidebar windows
    extensionAPI.ui.commandPalette.addCommand({
        label: t(extensionAPI, "command.sidebarNavigateDown"),
        callback: () => moveFocus('down'),
        "disable-hotkey": false,
    });

    // Command Roam CRM - Open Modal
    extensionAPI.ui.commandPalette.addCommand({
        label: t(extensionAPI, "command.openModal"),
        "disable-hotkey": false,
        callback: async () => {
            const allPeople = await getAllPeople(extensionAPI)
            const lastBirthdayCheckDate = getExtensionAPISetting(
                extensionAPI,
                "last-birthday-check-date",
                "01-19-2024",
            )

            displayBirthdays(allPeople, lastBirthdayCheckDate, extensionAPI)
        },
    })
    // Command Roam CRM - Open Full Page UI
    extensionAPI.ui.commandPalette.addCommand({
        label: t(extensionAPI, "command.openWorkspace"), //TODO come up with a better name for this
        "disable-hotkey": false,
        callback: async () => {
            const allPeople = await getAllPeople(extensionAPI)
            displayCRMDialog(allPeople, extensionAPI)
        },
    })
    
    // Command Palette Test Calendar Template Matching
    extensionAPI.ui.commandPalette.addCommand({
        label: t(extensionAPI, "command.testCalendarTemplate"),
        "disable-hotkey": false,
        callback: async () => {
            const allPeople = await getAllPeople(extensionAPI)
            // This command runs in testing mode (true) which:
            // 1. Shows detailed log output in console about keyword matching
            // 2. Processes single-person events according to your keyword settings
            // 3. DOESN'T actually create or update any blocks in Roam
            // 4. DOESN'T save any data to extension storage
            await getEventInfo(allPeople, extensionAPI, true, true, 'manual-template-test')
            showToast(t(extensionAPI, "toast.templateTestComplete"), "SUCCESS")
        },
    })
    // Command Palette Quick Capture - Create a new DNP block and focus it in the sidebar
    extensionAPI.ui.commandPalette.addCommand({
        label: t(extensionAPI, "command.sidebarCreateDnpBlock"),
        callback: async () => {
            const todayDate = new Date();
            const dailyNoteUid = window.roamAlphaAPI.util.dateToPageUid(todayDate);
            const blockUid = window.roamAlphaAPI.util.generateUID();

            // Create the new block
            await window.roamAlphaAPI.data.block.create({
                location: {
                    "parent-uid": dailyNoteUid,
                    order: "last"
                },
                block: {
                    uid: blockUid,
                    string: ""
                }
            });

            // Open in sidebar and get window info
            await window.roamAlphaAPI.ui.rightSidebar.addWindow({
                window: {
                    type: "block",
                    "block-uid": blockUid
                }
            });

            // Find the window ID
            const windows = window.roamAlphaAPI.ui.rightSidebar.getWindows();
            const newWindow = windows.find(win =>
                win.type === "block" && win["block-uid"] === blockUid
            );

            if (newWindow) {
                // Set focus to the new block
                window.roamAlphaAPI.ui.setBlockFocusAndSelection({
                    location: {
                        "block-uid": blockUid,
                        "window-id": newWindow["window-id"]
                    }
                });
            }
        },
        "default-hotkey": "ctrl-shift-n"
    });
    // Command Palette Roam Navigation - Go to last block on page
    extensionAPI.ui.commandPalette.addCommand({
        label: t(extensionAPI, "command.navigationLastBlock"),
        callback: getLastBlockAndFocus,
        "disable-hotkey": false,
    });
    //MARK: agenda addr
    if (getExtensionAPISetting(extensionAPI, "agenda-addr-setting", false)) {
        const agendaEntity = getAgendaPullEntity(extensionAPI)
        // run the initial agenda addr
        await parseAgendaPull(window.roamAlphaAPI.pull(pullPattern, agendaEntity), extensionAPI)

        // agenda addr pull watch
        addPullWatch(agendaEntity, pullFunction)
    }

    if (!testing) {
        console.log(`load ${plugin_title} plugin`)
    }
}
// MARK: unload
function onunload() {
    document.body.removeEventListener("roamjs:google:loaded", googleLoadedHandler)

    // remove pull watches
    for (let i = 0; i < runners.pullWatches.length; i++) {
        const { entity, callback } = runners.pullWatches[i]
        window.roamAlphaAPI.data.removePullWatch(pullPattern, entity, callback)
    }
    runners.pullWatches = []
    runners.pullFunctions = [] // Clear the array after stopping all intervals

    // remove the sidebar button
    var crmDiv = document.getElementById("crmDiv")
    if (crmDiv) {
        crmDiv.remove()
    }

    // make sure to remove the google calendar check
    for (let i = 0; i < runners.intervals.length; i++) {
        clearInterval(runners.intervals[i])
    }
    runners.intervals = [] // Clear the array after stopping all intervals

    //\ remove listeners
    for (let i = 0; i < runners.eventListeners.length; i++) {
        const { target, event, callback } = runners.eventListeners[i]
        target.removeEventListener(event, callback)
    }
    runners.eventListeners = [] // Clear the array after removing all event listeners

    if (!testing) {
        console.log(`unload ${plugin_title} plugin`)
    }
}

export default {
    onload,
    onunload,
}
