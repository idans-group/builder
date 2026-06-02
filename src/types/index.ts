export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'typing' | 'completed' | 'generating-prd' | 'generating-spec';
}

export interface PRD {
  title: string;
  overview: string;
  targetAudience: string[];
  userFlows: string[];
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  edgeCases: string[];
  finalized: boolean;
}

export interface JSONSpec {
  // A json-render spec root
  components: JSONComponent[];
}

export interface JSONComponent {
  type: string;
  props?: Record<string, any>;
  children?: (JSONComponent | string)[];
}

export interface AIConfig {
  provider: 'simulation' | 'gemini' | 'openai';
  apiKey: string;
  model: string;
}
