export const LayoutDefinition = {
    CHAT: 0,
    BASIC: 1,
    SINGLE_EDIT: 2,
    PREFERENCES: 3,
    VALIDATION: 4,
};

export const LayoutOptions : Record<number, string> = {
    [LayoutDefinition.CHAT]: "Chat",
    [LayoutDefinition.BASIC]: "Basic",
    [LayoutDefinition.SINGLE_EDIT]: "Single Edit",
    [LayoutDefinition.PREFERENCES]: "Preferences",
    [LayoutDefinition.VALIDATION]: "Validation",
};