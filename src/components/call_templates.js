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
                    text: createAttributeText(schema, "metadataAttribute"),
                    children: [
                        { text: `phone number::` },
                        { text: createAttributeText(schema, "emailAttribute") },
                        { text: `location::` },
                        { text: `company::` },
                        { text: `role::` },
                        { text: `how we met::` },
                        { text: `social media::` },
                        { text: createAttributeText(schema, "tagAttribute", createHashTag(schema.personTagPage)) },
                    ],
                },
                {
                    text: createAttributeText(schema, "relationshipMetadataAttribute"),
                    children: [
                        {
                            text: createAttributeText(
                                schema,
                                "contactFrequencyAttribute",
                                "#[[C List]]: Contact every six months",
                            ),
                        },
                        {
                            text: createAttributeText(schema, "lastContactedAttribute"),
                        },
                        {
                            text: `friends & family::`,
                            children: [
                                { text: `partner::` },
                                { text: `kid::` },
                                { text: `pets::` },
                            ],
                        },
                        { text: createAttributeText(schema, "birthdayAttribute") },

                        { text: `fun now for me::` },
                        { text: `growing up::` },
                        { text: `growing up fun::` },
                        { text: `favorite food::` },
                        { text: `favorite place to visit::` },
                        { text: `ask me about::` },
                    ],
                },
                { text: `---` },
            ],
        },
    })
}

export { createLastWeekCalls, createLastMonthCalls, createCallTemplates, createPersonTemplates }
