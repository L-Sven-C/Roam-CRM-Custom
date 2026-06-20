import createBlock from "roamjs-components/writes/createBlock"
import {
    DEFAULT_CRM_SCHEMA,
    createAttributeText,
    createHashTag,
    createPageRef,
} from "../schema"

function createLastWeekCalls(parentUid, schema = DEFAULT_CRM_SCHEMA) {
    const callPage = schema.callPage
    const notesAttribute = schema.notesAttribute
    const nextActionsAttribute = schema.nextActionsAttribute

    createBlock({
        parentUid: parentUid,
        node: {
            text: `${callPage} blocks in the last week`,
            heading: 1,
            open: false,
            children: [
                {
                    text: `{{query block}} #.rollup-table`,
                    open: false,
                    children: [
                        {
                            text: `results`,
                            children: [
                                {
                                    text: `layout`,
                                    children: [
                                        {
                                            text: `rowStyle`,
                                            children: [
                                                {
                                                    text: `Bare`,
                                                    children: [],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    text: `interface`,
                                    children: [
                                        {
                                            text: `show`,
                                        },
                                    ],
                                },
                                {
                                    text: `views`,
                                    children: [
                                        {
                                            text: notesAttribute,
                                            children: [
                                                {
                                                    text: `link`,
                                                },
                                            ],
                                        },
                                        {
                                            text: nextActionsAttribute,
                                            children: [
                                                {
                                                    text: `embed`,
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    text: `sorts`,
                                    children: [
                                        {
                                            text: `text`,
                                            children: [
                                                {
                                                    text: `false`,
                                                },
                                            ],
                                        },
                                        {
                                            text: `Next`,
                                            children: [
                                                {
                                                    text: `false`,
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            text: `scratch`,
                            children: [
                                {
                                    text: `custom`,
                                },
                                {
                                    text: `selections`,
                                    children: [
                                        {
                                            text: `node`,
                                            children: [
                                                {
                                                    text: `Notes`,
                                                },
                                            ],
                                        },
                                        {
                                            text: `node:NEXT`,
                                            children: [
                                                {
                                                    text: `Next Actions`,
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    text: `conditions`,
                                    children: [
                                        {
                                            text: `clause`,
                                            children: [
                                                {
                                                    text: `source`,
                                                    children: [
                                                        {
                                                            text: `node`,
                                                        },
                                                    ],
                                                },
                                                {
                                                    text: `Relation`,
                                                    children: [
                                                        {
                                                            text: `references title`,
                                                        },
                                                    ],
                                                },
                                                {
                                                    text: `target`,
                                                    children: [
                                                        {
                                                            text: callPage,
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            text: `clause`,
                                            children: [
                                                {
                                                    text: `source`,
                                                    children: [
                                                        {
                                                            text: `node`,
                                                        },
                                                    ],
                                                },
                                                {
                                                    text: `Relation`,
                                                    children: [
                                                        {
                                                            text: `has attribute`,
                                                        },
                                                    ],
                                                },
                                                {
                                                    text: `target`,
                                                    children: [
                                                        {
                                                            text: nextActionsAttribute,
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            text: `clause`,
                                            children: [
                                                {
                                                    text: `source`,
                                                    children: [
                                                        {
                                                            text: `node`,
                                                        },
                                                    ],
                                                },
                                                {
                                                    text: `Relation`,
                                                    children: [
                                                        {
                                                            text: `has descendant`,
                                                        },
                                                    ],
                                                },
                                                {
                                                    text: `target`,
                                                    children: [
                                                        {
                                                            text: `NEXT`,
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            text: `clause`,
                                            children: [
                                                {
                                                    text: `source`,
                                                    children: [
                                                        {
                                                            text: `NEXT`,
                                                        },
                                                    ],
                                                },
                                                {
                                                    text: `Relation`,
                                                    children: [
                                                        {
                                                            text: `with text`,
                                                        },
                                                    ],
                                                },
                                                {
                                                    text: `target`,
                                                    children: [
                                                        {
                                                            text: `${nextActionsAttribute}:`,
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            text: `clause`,
                                            children: [
                                                {
                                                    text: `source`,
                                                    children: [
                                                        {
                                                            text: `node`,
                                                        },
                                                    ],
                                                },
                                                {
                                                    text: `Relation`,
                                                    children: [
                                                        {
                                                            text: `created after`,
                                                        },
                                                    ],
                                                },
                                                {
                                                    text: `target`,
                                                    children: [
                                                        {
                                                            text: `one week ago`,
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    })
}

function createLastMonthCalls(parentUid, schema = DEFAULT_CRM_SCHEMA) {
    const callPage = schema.callPage
    const notesAttribute = schema.notesAttribute
    const nextActionsAttribute = schema.nextActionsAttribute

    createBlock({
        parentUid: parentUid,
        node: {
            text: `${callPage} blocks in the last month`,
            heading: 1,
            children: [
                {
                    text: `{{query block}} #.rollup-table`,
                    open: false,
                    children: [
                        {
                            text: `results`,
                            children: [
                                {
                                    text: `layout`,
                                    children: [
                                        {
                                            text: `rowStyle`,
                                            children: [
                                                {
                                                    text: `Bare`,
                                                    children: [],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    text: `interface`,
                                    children: [
                                        {
                                            text: `show`,
                                        },
                                    ],
                                },
                                {
                                    text: `views`,
                                    children: [
                                        {
                                            text: notesAttribute,
                                            children: [
                                                {
                                                    text: `link`,
                                                },
                                            ],
                                        },
                                        {
                                            text: nextActionsAttribute,
                                            children: [
                                                {
                                                    text: `embed`,
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    text: `sorts`,
                                    children: [
                                        {
                                            text: `text`,
                                            children: [
                                                {
                                                    text: `false`,
                                                },
                                            ],
                                        },
                                        {
                                            text: `Next`,
                                            children: [
                                                {
                                                    text: `false`,
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            text: `scratch`,
                            children: [
                                {
                                    text: `custom`,
                                },
                                {
                                    text: `selections`,
                                    children: [
                                        {
                                            text: `node`,
                                            children: [
                                                {
                                                    text: `Notes`,
                                                },
                                            ],
                                        },
                                        {
                                            text: `node:NEXT`,
                                            children: [
                                                {
                                                    text: `Next Actions`,
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    text: `conditions`,
                                    children: [
                                        {
                                            text: `clause`,
                                            children: [
                                                {
                                                    text: `source`,
                                                    children: [
                                                        {
                                                            text: `node`,
                                                        },
                                                    ],
                                                },
                                                {
                                                    text: `Relation`,
                                                    children: [
                                                        {
                                                            text: `references title`,
                                                        },
                                                    ],
                                                },
                                                {
                                                    text: `target`,
                                                    children: [
                                                        {
                                                            text: callPage,
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            text: `clause`,
                                            children: [
                                                {
                                                    text: `source`,
                                                    children: [
                                                        {
                                                            text: `node`,
                                                        },
                                                    ],
                                                },
                                                {
                                                    text: `Relation`,
                                                    children: [
                                                        {
                                                            text: `has attribute`,
                                                        },
                                                    ],
                                                },
                                                {
                                                    text: `target`,
                                                    children: [
                                                        {
                                                            text: nextActionsAttribute,
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            text: `clause`,
                                            children: [
                                                {
                                                    text: `source`,
                                                    children: [
                                                        {
                                                            text: `node`,
                                                        },
                                                    ],
                                                },
                                                {
                                                    text: `Relation`,
                                                    children: [
                                                        {
                                                            text: `has descendant`,
                                                        },
                                                    ],
                                                },
                                                {
                                                    text: `target`,
                                                    children: [
                                                        {
                                                            text: `NEXT`,
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            text: `clause`,
                                            children: [
                                                {
                                                    text: `source`,
                                                    children: [
                                                        {
                                                            text: `NEXT`,
                                                        },
                                                    ],
                                                },
                                                {
                                                    text: `Relation`,
                                                    children: [
                                                        {
                                                            text: `with text`,
                                                        },
                                                    ],
                                                },
                                                {
                                                    text: `target`,
                                                    children: [
                                                        {
                                                            text: `${nextActionsAttribute}:`,
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            text: `clause`,
                                            children: [
                                                {
                                                    text: `source`,
                                                    children: [
                                                        {
                                                            text: `node`,
                                                        },
                                                    ],
                                                },
                                                {
                                                    text: `Relation`,
                                                    children: [
                                                        {
                                                            text: `created after`,
                                                        },
                                                    ],
                                                },
                                                {
                                                    text: `target`,
                                                    children: [
                                                        {
                                                            text: `one month ago`,
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    })
}

function createCallTemplates(parentUid, schema = DEFAULT_CRM_SCHEMA) {
    createBlock({
        parentUid: parentUid,
        order: "last",
        node: {
            text: `call template #SmartBlock`,
            children: [
                {
                    text: `${createPageRef(schema.callPage)} with `,
                    children: [
                        {
                            text: createAttributeText(schema, "notesAttribute"),
                            children: [
                                {
                                    text: ` `,
                                },
                            ],
                        },
                        {
                            text: createAttributeText(schema, "nextActionsAttribute"),
                            children: [
                                {
                                    text: ` `,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    })
}

function createPersonTemplates(parentUid, schema = DEFAULT_CRM_SCHEMA) {
    createBlock({
        parentUid: parentUid,
        order: "last",
        node: {
            text: `person metadata #SmartBlock`,
            children: [
                {
                    text: createPageRef(schema.metadataAttribute),
                    children: [
                        { text: createAttributeText(schema, "tagAttribute", createHashTag(schema.personTagPage)) },
                        { text: `tag::` },
                        { text: createAttributeText(schema, "birthdayAttribute") },
                        { text: `location::` },
                        {
                            text: createPageRef(schema.contactPage),
                            children: [
                                { text: `phone number::` },
                                { text: createAttributeText(schema, "emailAttribute") },
                                { text: `social media::` },
                                {
                                    text: createAttributeText(
                                        schema,
                                        "contactFrequencyAttribute",
                                        "#[[C List]]",
                                    ),
                                },
                                { text: createAttributeText(schema, "lastContactedAttribute") },
                            ],
                        },
                        {
                            text: createPageRef("work"),
                            children: [
                                { text: `company::` },
                                { text: `role::` },
                                { text: `history::` },
                            ],
                        },
                        {
                            text: createPageRef("relationship"),
                            children: [
                                { text: `love::` },
                                { text: `family::` },
                                { text: `pet::` },
                                { text: `others::` },
                            ],
                        },
                        {
                            text: createPageRef("background"),
                            children: [
                                { text: `how we met::` },
                                { text: `growth::` },
                                { text: `preference::` },
                            ],
                        },
                        { text: `current interest::` },
                        { text: `ask me about::` },
                        { text: `last reviewed::` },
                    ],
                },
                { text: createAttributeText(schema, "agendaAttribute") },
                { text: `---` },
            ],
        },
    })
}

export { createLastWeekCalls, createLastMonthCalls, createCallTemplates, createPersonTemplates }
