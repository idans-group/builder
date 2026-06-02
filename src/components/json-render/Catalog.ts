import { schema } from "@json-render/react";
import { shadcnComponentDefinitions } from "@json-render/shadcn/catalog";

// Create and export the catalog for our generative UI system
export const catalog = schema.createCatalog({
  components: {
    Card: shadcnComponentDefinitions.Card as any,
    Stack: shadcnComponentDefinitions.Stack as any,
    Grid: shadcnComponentDefinitions.Grid as any,
    Tabs: shadcnComponentDefinitions.Tabs as any,
    Table: shadcnComponentDefinitions.Table as any,
    Heading: shadcnComponentDefinitions.Heading as any,
    Text: shadcnComponentDefinitions.Text as any,
    Badge: shadcnComponentDefinitions.Badge as any,
    Alert: shadcnComponentDefinitions.Alert as any,
    Input: shadcnComponentDefinitions.Input as any,
    Switch: shadcnComponentDefinitions.Switch as any,
    Select: shadcnComponentDefinitions.Select as any,
    Button: shadcnComponentDefinitions.Button as any,
  },
  actions: {}
} as any);

export type AppCatalog = typeof catalog;
