import { Message, PRD, JSONSpec, AIConfig } from "../types";

// Standard prompt templates to instruct LLMs on generating conforming json-render specs
export const SYSTEM_INSTRUCTION_PRD = `You are an elite, edge-case-obsessed Product Manager. Your goal is to interview the user about their application idea and incrementally build a perfect Product Requirements Document (PRD).

Keep your responses structured, clear, and highly professional. Ask one targeted question at a time to clarify:
1. Core product value and target personas.
2. Critical user flows and actions.
3. Edge cases, validation limits, and failure modes.

Structure of the PRD you are building:
- Title
- Overview
- Target Audience & Personas
- Primary User Flows
- Functional Requirements (including form inputs & actions)
- Non-Functional Requirements & Security
- Edge Cases & Guardrails`;

// High-fidelity in-browser simulation database for zero-config out-of-the-box experience
const APP_SCENARIOS = {
  dashboard: {
    title: "SaaS Analytics & Billing Dashboard",
    overview: "A premium business intelligence dashboard that monitors monthly active subscriptions, maps revenue metrics, manages customer plans, and issues billing adjustments in real-time.",
    targetAudience: [
      "SaaS Founders seeking quick financial metrics",
      "Finance Admins managing subscriptions",
      "Customer Support agents auditing billing histories"
    ],
    userFlows: [
      "Log in and view Monthly Recurring Revenue (MRR) changes",
      "Filter subscriber list by plan status (Active, Delinquent)",
      "Trigger live manual adjustments to a customer's monthly bill"
    ],
    functionalRequirements: [
      "Visual display of MRR ($24.8k), Active Users (1,240), and Churn Rate (1.2%)",
      "Data table rendering top 4 customers with ID, plan type, and monthly revenue",
      "Interactive Billing adjustment panel containing input forms and toggle switches"
    ],
    nonFunctionalRequirements: [
      "Sub-second compilation and state bindings refresh",
      "Monochrome sleek borders conforming to strict accessibility standards"
    ],
    edgeCases: [
      "Delinquent accounts should block manual billing upgrades",
      "Adjustments exceeding $1000 require admin authorization toggles"
    ]
  },
  tracker: {
    title: "Personal Fitness & Habit Hub",
    overview: "An immersive, metrics-focused hub designed to track daily physical training, monitor macro-nutritional goals, log active habits, and reward streak achievements.",
    targetAudience: [
      "Daily runners and gym enthusiasts",
      "Nutrition-focused dieters tracking macro metrics",
      "Habit-builders focusing on streak consistency"
    ],
    userFlows: [
      "Check daily training completion checklist",
      "Add new macro log items (Protein, Carbs, Fats)",
      "Toggle notification alerts for hydration streaks"
    ],
    functionalRequirements: [
      "Metrics overview displaying active training duration and calorie counts",
      "Checklist items showing dynamic progress bars",
      "Nutrient intake log forms with automated check validations"
    ],
    nonFunctionalRequirements: [
      "Responsive container alignment for standard mobile views",
      "Zero network latency for logging metrics offline"
    ],
    edgeCases: [
      "Logging negative nutrient intake values should trigger form errors",
      "Double hydration triggers within 5 minutes must merge into a single event log"
    ]
  },
  settings: {
    title: "Enterprise Developer Portal & Settings",
    overview: "A control center for managing API developer keys, modifying webhook subscriptions, toggling sandbox environments, and auditing server health stats.",
    targetAudience: [
      "Integration Engineers configuring webhooks",
      "SecOps specialists reviewing access scopes",
      "System Administrators tracking API limits"
    ],
    userFlows: [
      "View current API server latency metrics",
      "Create or rotate active development secrets",
      "Modify sandbox database configurations and trigger environment alerts"
    ],
    functionalRequirements: [
      "Security alert box displaying recent authentication attempts",
      "Active secret management table with status pills",
      "Webhook creation forms with select dropdowns and boolean switches"
    ],
    nonFunctionalRequirements: [
      "Sensitive API tokens must remain masked until hovered or clicked",
      "Secure key validation before form submission"
    ],
    edgeCases: [
      "Webhooks missing https headers should trigger input validation errors",
      "Key rotations must immediately invalidate legacy caches"
    ]
  }
};

// Generates a gorgeous, highly interactive json-render specification
export function generateSimulatedSpec(prdTitle: string): JSONSpec {
  const titleLower = prdTitle.toLowerCase();
  
  if (titleLower.includes("fit") || titleLower.includes("habit") || titleLower.includes("health")) {
    return {
      components: [
        {
          type: "Stack",
          props: { direction: "vertical", gap: "md", className: "w-full" },
          children: [
            {
              type: "Heading",
              props: { text: "🏃 Fitness & Habit Hub", level: "h1" }
            },
            {
              type: "Text",
              props: { text: "Manage training metrics, nutrients, and daily activity logs in real-time.", variant: "muted" }
            },
            {
              type: "Grid",
              props: { columns: 3, gap: "md" },
              children: [
                {
                  type: "Card",
                  props: { title: "Daily Calories", description: "Target: 2,400 kcal" },
                  children: [
                    {
                      type: "Stack",
                      props: { direction: "vertical", gap: "sm" },
                      children: [
                        { type: "Heading", props: { text: "1,840 kcal", level: "h2" } },
                        { type: "Badge", props: { text: "76% Complete", variant: "default" } }
                      ]
                    }
                  ]
                },
                {
                  type: "Card",
                  props: { title: "Active Duration", description: "Target: 45 min" },
                  children: [
                    {
                      type: "Stack",
                      props: { direction: "vertical", gap: "sm" },
                      children: [
                        { type: "Heading", props: { text: "35 mins", level: "h2" } },
                        { type: "Badge", props: { text: "10 mins left", variant: "secondary" } }
                      ]
                    }
                  ]
                },
                {
                  type: "Card",
                  props: { title: "Hydration Status", description: "Target: 3.0 Liters" },
                  children: [
                    {
                      type: "Stack",
                      props: { direction: "vertical", gap: "sm" },
                      children: [
                        { type: "Heading", props: { text: "2.1 Liters", level: "h2" } },
                        { type: "Badge", props: { text: "70% Achieved", variant: "default" } }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: "Grid",
              props: { columns: 2, gap: "md" },
              children: [
                {
                  type: "Card",
                  props: { title: "Log Workout", description: "Record your latest active session metrics" },
                  children: [
                    {
                      type: "Stack",
                      props: { direction: "vertical", gap: "md" },
                      children: [
                        {
                          type: "Input",
                          props: {
                            label: "Activity Name",
                            name: "/workout/name",
                            placeholder: "e.g., Evening Run, Weightlifting",
                            type: "text",
                            value: "Outdoor Run"
                          }
                        },
                        {
                          type: "Select",
                          props: {
                            label: "Duration",
                            name: "/workout/duration",
                            options: ["15 minutes", "30 minutes", "45 minutes", "60+ minutes"],
                            value: "30 minutes"
                          }
                        },
                        {
                          type: "Switch",
                          props: {
                            label: "Log to Apple Health / Google Fit",
                            name: "/workout/sync",
                            checked: true
                          }
                        },
                        {
                          type: "Button",
                          props: { label: "Log Active Workout", variant: "primary" }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "Card",
                  props: { title: "Completed Sessions", description: "This week's active log history" },
                  children: [
                    {
                      type: "Table",
                      props: {
                        columns: ["Activity", "Duration", "Calories", "Date"],
                        rows: [
                          ["Outdoor Run", "30 mins", "320 kcal", "Today"],
                          ["Yoga Flow", "15 mins", "65 kcal", "Yesterday"],
                          ["Weightlifting", "45 mins", "280 kcal", "May 29"],
                          ["Swimming", "60 mins", "450 kcal", "May 28"]
                        ],
                        caption: "Last 4 recorded sessions"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
  }

  if (titleLower.includes("setting") || titleLower.includes("dev") || titleLower.includes("secret") || titleLower.includes("key")) {
    return {
      components: [
        {
          type: "Stack",
          props: { direction: "vertical", gap: "md", className: "w-full" },
          children: [
            {
              type: "Heading",
              props: { text: "⚙️ Developer Portal", level: "h1" }
            },
            {
              type: "Text",
              props: { text: "Rotate credentials, configure custom webhooks, and audit environment health.", variant: "muted" }
            },
            {
              type: "Alert",
              props: {
                title: "Production Secret Status Indicator",
                message: "A regular secret key audit is due in 3 days. We recommend rotating active development credentials.",
                type: "warning"
              }
            },
            {
              type: "Grid",
              props: { columns: 2, gap: "md" },
              children: [
                {
                  type: "Card",
                  props: { title: "Rotate API Secrets", description: "Generate highly secure access tokens" },
                  children: [
                    {
                      type: "Stack",
                      props: { direction: "vertical", gap: "md" },
                      children: [
                        {
                          type: "Input",
                          props: {
                            label: "Secret Label",
                            name: "/secret/label",
                            placeholder: "e.g., Marketing-API-Key",
                            type: "text",
                            value: "Staging-Client-Secret"
                          }
                        },
                        {
                          type: "Select",
                          props: {
                            label: "Expiration Limit",
                            name: "/secret/expire",
                            options: ["30 Days", "90 Days", "180 Days", "Never"],
                            value: "90 Days"
                          }
                        },
                        {
                          type: "Switch",
                          props: {
                            label: "Enable Write-Level Permissions",
                            name: "/secret/writeAccess",
                            checked: false
                          }
                        },
                        {
                          type: "Button",
                          props: { label: "Rotate Credentials", variant: "primary" }
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "Card",
                  props: { title: "API Secrets Catalog", description: "Currently active developer secrets" },
                  children: [
                    {
                      type: "Table",
                      props: {
                        columns: ["Key Name", "Created", "Expires", "Status"],
                        rows: [
                          ["Production-Master-Token", "Jan 12, 2026", "Never", "Active"],
                          ["Staging-Client-Secret", "Mar 10, 2026", "Jun 10, 2026", "Active"],
                          ["Analytics-Tracker-Key", "May 01, 2026", "Nov 01, 2026", "Active"],
                          ["Legacy-Sandbox-Token", "Nov 15, 2025", "Expired", "Revoked"]
                        ],
                        caption: "Active keys linked to your dev environment"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
  }

  // DEFAULT / SaaS Analytics Dashboard (Scenario A)
  return {
    components: [
      {
        type: "Stack",
        props: { direction: "vertical", gap: "md", className: "w-full" },
        children: [
          {
            type: "Heading",
            props: { text: "📊 Enterprise Billing Dashboard", level: "h1" }
          },
          {
            type: "Text",
            props: { text: "Monitor recurring revenue, audit subscriber plans, and manage real-time billing adjustments.", variant: "muted" }
          },
          {
            type: "Grid",
            props: { columns: 3, gap: "md" },
            children: [
              {
                type: "Card",
                props: { title: "Monthly Recurring Revenue", description: "Active monthly subscription total" },
                children: [
                  {
                    type: "Stack",
                    props: { direction: "vertical", gap: "sm" },
                    children: [
                      { type: "Heading", props: { text: "$24,840", level: "h2" } },
                      { type: "Badge", props: { text: "+8.4% this month", variant: "default" } }
                    ]
                  }
                ]
              },
              {
                type: "Card",
                props: { title: "Active Subscriptions", description: "Paying client contracts" },
                children: [
                  {
                    type: "Stack",
                    props: { direction: "vertical", gap: "sm" },
                    children: [
                      { type: "Heading", props: { text: "1,240 accounts", level: "h2" } },
                      { type: "Badge", props: { text: "1.2% Churn Rate", variant: "secondary" } }
                    ]
                  }
                ]
              },
              {
                type: "Card",
                props: { title: "Monthly Failures", description: "Unpaid accounts" },
                children: [
                  {
                    type: "Stack",
                    props: { direction: "vertical", gap: "sm" },
                    children: [
                      { type: "Heading", props: { text: "3 cases", level: "h2" } },
                      { type: "Badge", props: { text: "Needs immediate retry", variant: "destructive" } }
                    ]
                  }
                ]
              }
            ]
          },
          {
            type: "Grid",
            props: { columns: 2, gap: "md" },
            children: [
              {
                type: "Card",
                props: { title: "Adjust Customer Balance", description: "Issue manual credits or upgrades" },
                children: [
                  {
                    type: "Stack",
                    props: { direction: "vertical", gap: "md" },
                    children: [
                      {
                        type: "Input",
                        props: {
                          label: "Customer Email Path",
                          name: "/balance/email",
                          placeholder: "e.g., customer@domain.com",
                          type: "email",
                          value: "idans-group@builder.io"
                        }
                      },
                      {
                        type: "Select",
                        props: {
                          label: "Plan Upgrade Target",
                          name: "/balance/planType",
                          options: ["Basic ($19/mo)", "Pro ($49/mo)", "Enterprise ($249/mo)"],
                          value: "Pro ($49/mo)"
                        }
                      },
                      {
                        type: "Switch",
                        props: {
                          label: "Apply One-Time $20 Referral Credit",
                          name: "/balance/applyCredit",
                          checked: true
                        }
                      },
                      {
                        type: "Button",
                        props: { label: "Apply Balance Upgrades", variant: "primary" }
                      }
                    ]
                  }
                ]
              },
              {
                type: "Card",
                props: { title: "Recent Subscribers Hub", description: "Currently monitored SaaS accounts" },
                children: [
                  {
                    type: "Table",
                    props: {
                      columns: ["User Email", "Plan Tier", "Revenue", "Signed Up"],
                      rows: [
                        ["idans-group@builder.io", "Pro Plan", "$49.00", "Today"],
                        ["barto-dev@mit.edu", "Enterprise", "$249.00", "Yesterday"],
                        ["gemini-researcher@google.com", "Pro Plan", "$49.00", "May 28"],
                        ["stripe-auditor@fin.gov", "Basic Tier", "$19.00", "May 25"]
                      ],
                      caption: "Active billing status updates"
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
}

// In-Browser Simulator PM response stream builder
export async function simulatePMResponse(
  messages: Message[],
  currentPRD: PRD | null
): Promise<{ content: string; prd: PRD }> {
  await new Promise((resolve) => setTimeout(resolve, 1500)); // Highly realistic processing latency

  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")?.content || "";
  const lowerMsg = lastUserMsg.toLowerCase();

  // If this is the initial message
  if (messages.filter((m) => m.role === "user").length === 1) {
    let scenarioKey: "dashboard" | "tracker" | "settings" = "dashboard";
    if (lowerMsg.includes("fit") || lowerMsg.includes("habit") || lowerMsg.includes("health")) {
      scenarioKey = "tracker";
    } else if (lowerMsg.includes("setting") || lowerMsg.includes("dev") || lowerMsg.includes("webhook")) {
      scenarioKey = "settings";
    }

    const template = APP_SCENARIOS[scenarioKey];
    const initialPrd: PRD = {
      title: template.title,
      overview: template.overview,
      targetAudience: [template.targetAudience[0]],
      userFlows: [template.userFlows[0]],
      functionalRequirements: [template.functionalRequirements[0]],
      nonFunctionalRequirements: [template.nonFunctionalRequirements[0]],
      edgeCases: [template.edgeCases[0]],
      finalized: false
    };

    const content = `Welcome! I am your AI Product Manager. I've initiated your PRD for **${template.title}**.

Based on your prompt, I've outlined the foundational scope. However, to make this app solid enough to hand off to users, we need to hammer out details.

**Clarifying Question 1:**
Who are the primary user personas targeting this app, and how should we refine our **Target Audience** lists to capture them? (e.g. beginners, developers, or enterprise admins?)`;

    return { content, prd: initialPrd };
  }

  // Consecutive Refinements (incremental PRD construction)
  if (currentPRD) {
    let scenarioKey: "dashboard" | "tracker" | "settings" = "dashboard";
    const titleLower = currentPRD.title.toLowerCase();
    if (titleLower.includes("fit") || titleLower.includes("habit")) {
      scenarioKey = "tracker";
    } else if (titleLower.includes("setting") || titleLower.includes("dev")) {
      scenarioKey = "settings";
    }

    const template = APP_SCENARIOS[scenarioKey];
    const userMsgCount = messages.filter((m) => m.role === "user").length;

    if (userMsgCount === 2) {
      // Step 2: Add target audience & ask user flows
      const updatedPRD: PRD = {
        ...currentPRD,
        targetAudience: template.targetAudience,
        userFlows: [template.userFlows[0]]
      };
      const content = `Great points. I have fully fleshed out the **Target Audience & User Personas** in the PRD.

Now let's look at the **Primary User Flows**. We want to ensure users can accomplish their goals seamlessly.

**Clarifying Question 2:**
What are the primary operational tasks a user will execute upon opening the portal? (e.g., viewing summaries, submitting updates, or configuring triggers?)`;

      return { content, prd: updatedPRD };
    } else if (userMsgCount === 3) {
      // Step 3: Add user flows and ask functional requirements
      const updatedPRD: PRD = {
        ...currentPRD,
        userFlows: template.userFlows,
        functionalRequirements: [template.functionalRequirements[0]]
      };
      const content = `Understood. User flows have been comprehensively defined.

Now, let's detail the **Functional Requirements**. We need to specify what UI controls and metrics will exist in the actual layout to facilitate these actions.

**Clarifying Question 3:**
For this dashboard, what visual indicators (charts, logs) and active form elements (buttons, inputs, dropdown selectors) should be built into the interface?`;

      return { content, prd: updatedPRD };
    } else {
      // Step 4: Finalize functional requirements and edge cases
      const updatedPRD: PRD = {
        ...currentPRD,
        functionalRequirements: template.functionalRequirements,
        nonFunctionalRequirements: template.nonFunctionalRequirements,
        edgeCases: template.edgeCases,
        finalized: true
      };
      const content = `Excellent. I've integrated all visual components, metric metrics, inputs, and strict edge-case validation checks into the **PRD**.

We now have a complete, robust, and edge-case-proof Product Requirements Document.

I have marked the **PRD as Finalized**! You can now click the **"Compile & Render UI"** button at the top right of the Canvas to compile this PRD into a working, responsive Generative UI powered by the \`json-render\` catalog!`;

      return { content, prd: updatedPRD };
    }
  }

  // Fallback
  const fallbackPrd: PRD = {
    title: "Custom Interactive Platform",
    overview: "A custom tailored platform constructed to resolve specific operational demands.",
    targetAudience: ["System Developers", "End Users"],
    userFlows: ["Access the main landing interface", "Interact with metric elements"],
    functionalRequirements: ["Interactive forms", "Data metrics overview"],
    nonFunctionalRequirements: ["Ultra-responsive state rendering"],
    edgeCases: ["Inputs missing validations must block submit operations"],
    finalized: true
  };
  return {
    content: "Excellent. The PRD is fully constructed and ready to be compiled to the interactive Generative UI canvas!",
    prd: fallbackPrd
  };
}

// LIVE API GENERATION ENGINE
// Hooks up to actual OpenAI or Gemini endpoints using the catalog prompt schema!
export async function generateLivePMResponse(
  config: AIConfig,
  messages: Message[],
  prd: PRD | null
): Promise<{ content: string; prd: PRD }> {
  // If API key is missing, throw custom error
  if (!config.apiKey) {
    throw new Error("API Key is missing. Please configure it in Settings.");
  }

  try {
    const formattedHistory = messages.map((m) => ({
      role: m.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: m.content }]
    }));

    // Inject PRD context in prompt
    const systemPrompt = `${SYSTEM_INSTRUCTION_PRD}

CURRENT PRD DATA:
${prd ? JSON.stringify(prd, null, 2) : "None (Initializing)"}

Your output MUST be a JSON object with two fields:
1. "reply": Your conversational markdown reply asking the next targeted question.
2. "prd": An updated, rich PRD object containing fields (title, overview, targetAudience, userFlows, functionalRequirements, nonFunctionalRequirements, edgeCases, finalized). Ensure finalized is true only when the requirements are complete.

Ensure you respond in valid JSON format.`;

    if (config.provider === "gemini") {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${config.model || "gemini-1.5-flash"}:generateContent?key=${config.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              { role: "user", parts: [{ text: systemPrompt }] },
              ...formattedHistory
            ],
            generationConfig: {
              responseMimeType: "application/json"
            }
          })
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate Limit Exceeded (Status 429). Google Gemini's free tier has request quotas. Please wait 60 seconds before sending your next prompt.");
        }
        throw new Error(`Gemini API Error: Status ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const parsed = safeParseJSON(rawText);
      return { content: parsed.reply, prd: parsed.prd };
    } else {
      // OpenAI Provider
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.model || "gpt-4o",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map((m) => ({
              role: m.role,
              content: m.content
            }))
          ]
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate Limit Exceeded (Status 429). OpenAI's tier has request quotas. Please wait 60 seconds before sending your next prompt.");
        }
        throw new Error(`OpenAI API Error: Status ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.choices?.[0]?.message?.content;
      const parsed = safeParseJSON(rawText);
      return { content: parsed.reply, prd: parsed.prd };
    }
  } catch (error: any) {
    console.error("Live API Error:", error);
    throw error; // Rethrow the error so that App.tsx catches and displays it in the chat!
  }
}

export async function generateLiveUISpec(
  config: AIConfig,
  prd: PRD,
  systemPromptFromCatalog: string
): Promise<JSONSpec> {
  if (!config.apiKey) {
    throw new Error("API Key is missing. Please configure it in Settings.");
  }

  try {
    const prompt = `You are a Generative UI parser. Your task is to compile the following finalized PRD into a validated JSON UI spec conforming to our catalog schema:

FINALIZED PRD:
${JSON.stringify(prd, null, 2)}

CATALOG SYSTEM RULES & COMPONENT PROPERTIES SCHEMA:
${systemPromptFromCatalog}

Generate a beautiful, modern monochrome dashboard UI layout. Output MUST be valid JSON matching the schema: { "components": [...] }. Exclude any other text or markdown code fences.`;

    if (config.provider === "gemini") {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${config.model || "gemini-1.5-flash"}:generateContent?key=${config.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json"
            }
          })
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate Limit Exceeded (Status 429). Google Gemini's free tier has request quotas. Please wait 60 seconds before compiling again.");
        }
        throw new Error(`Gemini API Error: Status ${response.status}`);
      }
      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return safeParseJSON(rawText);
    } else {
      // OpenAI
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.model || "gpt-4o",
          response_format: { type: "json_object" },
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate Limit Exceeded (Status 429). OpenAI's tier has request quotas. Please wait 60 seconds before compiling again.");
        }
        throw new Error(`OpenAI API Error: Status ${response.status}`);
      }
      const data = await response.json();
      const rawText = data.choices?.[0]?.message?.content;
      return safeParseJSON(rawText);
    }
  } catch (error) {
    console.error("Live Spec API Error:", error);
    throw error; // Rethrow the error
  }
}

// Helper to strip comments, trailing commas, and escape literal newlines inside JSON strings
function cleanJSONString(text: string): string {
  let cleaned = text.trim();
  
  // 1. Strip multi-line /* ... */ and single-line // ... comments safely (avoiding URLs like https://)
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, "$1");
  
  // 2. Strip trailing commas before closing braces/brackets
  cleaned = cleaned.replace(/,(\s*[\]}])/g, "$1");
  
  // 3. Escape literal newlines and carriage returns inside double-quoted string values,
  // ensuring valid JSON string formatting is preserved.
  cleaned = cleaned.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/gs, (match) => {
    return match.replace(/\n/g, "\\n").replace(/\r/g, "\\r");
  });
  
  return cleaned.trim();
}

// Custom brace-counting scanner to extract all top-level JSON objects/arrays,
// safely ignoring braces or brackets residing inside double/single quoted string scopes or escaped values.
function extractAllJSONBlocks(text: string): string[] {
  const blocks: string[] = [];
  let braceCount = 0;
  let bracketCount = 0;
  let inString = false;
  let stringChar = "";
  let escape = false;
  let startIdx = -1;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (escape) {
      escape = false;
      continue;
    }

    if (char === "\\") {
      escape = true;
      continue;
    }

    if (inString) {
      if (char === stringChar) {
        inString = false;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      inString = true;
      stringChar = char;
      continue;
    }

    if (char === "{") {
      if (braceCount === 0 && bracketCount === 0) {
        startIdx = i;
      }
      braceCount++;
    } else if (char === "}") {
      braceCount = Math.max(0, braceCount - 1);
      if (braceCount === 0 && bracketCount === 0 && startIdx !== -1) {
        blocks.push(text.substring(startIdx, i + 1));
        startIdx = -1;
      }
    } else if (char === "[") {
      if (braceCount === 0 && bracketCount === 0) {
        startIdx = i;
      }
      bracketCount++;
    } else if (char === "]") {
      bracketCount = Math.max(0, bracketCount - 1);
      if (braceCount === 0 && bracketCount === 0 && startIdx !== -1) {
        blocks.push(text.substring(startIdx, i + 1));
        startIdx = -1;
      }
    }
  }

  return blocks;
}

// Resilient parsing helper that safely cleans markdown ticks, extracts JSON boundaries, and escapes literal newlines inside strings
export function safeParseJSON(rawText: string): any {
  if (!rawText) return null;
  
  let cleaned = rawText.trim();
  console.log("Resilient Parser - Raw Text Received:", rawText);
  
  // Try 1: Try brace-counting block extraction first (highly resilient to prefixes, suffixes, and NDJSON/multiple blocks)
  try {
    const blocks = extractAllJSONBlocks(cleaned);
    if (blocks.length > 0) {
      const parsedBlocks = blocks.map(block => {
        const cleanedBlock = cleanJSONString(block);
        return JSON.parse(cleanedBlock);
      });
      
      if (parsedBlocks.length === 1) {
        console.log("Resilient Parser - Block Scanner Succeeded with 1 element!");
        return parsedBlocks[0];
      } else if (parsedBlocks.length > 1) {
        console.log("Resilient Parser - Block Scanner Succeeded with NDJSON / multiple blocks:", parsedBlocks.length);
        return parsedBlocks;
      }
    }
  } catch (eBlocks: any) {
    console.warn("Resilient Parser - Block Scanner Failed:", eBlocks.message);
  }
  
  // Try 2: Normal JSON parse of the entire cleaned text (after stripping markdown code fences if present)
  try {
    let textToParse = cleaned;
    if (textToParse.startsWith("```")) {
      textToParse = textToParse.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/, "");
    }
    textToParse = cleanJSONString(textToParse);
    
    const parsed = JSON.parse(textToParse);
    console.log("Resilient Parser - Try 2 Succeeded!");
    return parsed;
  } catch (e: any) {
    console.warn("Resilient Parser - Try 2 Failed:", e.message);
  }
  
  // Try 3: Boundary extraction fallback using raw index markers
  const firstBrace = cleaned.indexOf("{");
  const firstBracket = cleaned.indexOf("[");
  let startIdx = -1;
  
  if (firstBrace !== -1 && firstBracket !== -1) {
    startIdx = Math.min(firstBrace, firstBracket);
  } else if (firstBrace !== -1) {
    startIdx = firstBrace;
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
  }
  
  const lastBrace = cleaned.lastIndexOf("}");
  const lastBracket = cleaned.lastIndexOf("]");
  let endIdx = -1;
  
  if (lastBrace !== -1 && lastBracket !== -1) {
    endIdx = Math.max(lastBrace, lastBracket);
  } else if (lastBrace !== -1) {
    endIdx = lastBrace;
  } else if (lastBracket !== -1) {
    endIdx = lastBracket;
  }
  
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    let extracted = cleaned.substring(startIdx, endIdx + 1);
    try {
      extracted = cleanJSONString(extracted);
      const parsed = JSON.parse(extracted);
      console.log("Resilient Parser - Try 3 Succeeded!");
      return parsed;
    } catch (e2: any) {
      console.warn("Resilient Parser - Try 3 Boundary Extraction Failed:", e2.message);
      console.warn("Resilient Parser - Extracted text was:", extracted);
    }
  }
  
  // Try 4: If it contains a explicitly fenced ```json codeblock surrounded by other text
  const codeBlockMatch = cleaned.match(/```json\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    try {
      let extracted = cleanJSONString(codeBlockMatch[1]);
      const parsed = JSON.parse(extracted);
      console.log("Resilient Parser - Try 4 Succeeded!");
      return parsed;
    } catch (e3: any) {
      console.warn("Resilient Parser - Try 4 Codeblock Extraction Failed:", e3.message);
    }
  }

  // Final Try: Throw original syntax error on the cleanest variant
  console.error("Resilient Parser - All recovery attempts failed. Throwing final syntax exception.");
  let finalClean = cleaned;
  if (finalClean.startsWith("```")) {
    finalClean = finalClean.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/, "");
  }
  finalClean = cleanJSONString(finalClean);
  return JSON.parse(finalClean);
}


