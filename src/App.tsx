import { useState, useEffect } from "react";
import { Message, PRD, JSONSpec, AIConfig } from "./types";
import { ChatSection } from "./components/ChatSection";
import { CanvasSection } from "./components/CanvasSection";
import { SettingsModal } from "./components/SettingsModal";
import { simulatePMResponse, generateSimulatedSpec, generateLivePMResponse, generateLiveUISpec } from "./services/ai";
import { catalog } from "./components/json-render/Catalog";

const LOCAL_STORAGE_KEY = "builder_ai_config";
const STORAGE_CHAT_KEY = "builder_chat_messages";
const STORAGE_PRD_KEY = "builder_active_prd";
const STORAGE_SPEC_KEY = "builder_compiled_spec";
const STORAGE_TAB_KEY = "builder_active_tab";

const DEFAULT_CONFIG: AIConfig = {
  provider: "simulation",
  apiKey: "",
  model: ""
};

function App() {
  // State variables
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [prd, setPrd] = useState<PRD | null>(null);
  const [jsonSpec, setJsonSpec] = useState<JSONSpec | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [activeTab, setActiveTab] = useState<"prd" | "ui" | "json">("prd");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [aiConfig, setAiConfig] = useState<AIConfig>(DEFAULT_CONFIG);
  const [apiError, setApiError] = useState<string | null>(null);

  // Load config and conversation states from localStorage on mount
  useEffect(() => {
    // 1. Load config
    const savedConfig = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedConfig) {
      try {
        setAiConfig(JSON.parse(savedConfig));
      } catch (e) {
        console.error("Error parsing AI config:", e);
      }
    }

    // 2. Load messages (and re-instantiate dates)
    const savedMessages = localStorage.getItem(STORAGE_CHAT_KEY);
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages).map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
        setMessages(parsed);
      } catch (e) {
        console.error("Error parsing saved messages:", e);
      }
    }

    // 3. Load active PRD
    const savedPRD = localStorage.getItem(STORAGE_PRD_KEY);
    if (savedPRD) {
      try {
        setPrd(JSON.parse(savedPRD));
      } catch (e) {
        console.error("Error parsing active PRD:", e);
      }
    }

    // 4. Load compiled Spec
    const savedSpec = localStorage.getItem(STORAGE_SPEC_KEY);
    if (savedSpec) {
      try {
        setJsonSpec(JSON.parse(savedSpec));
      } catch (e) {
        console.error("Error parsing compiled spec:", e);
      }
    }

    // 5. Load active Tab
    const savedTab = localStorage.getItem(STORAGE_TAB_KEY);
    if (savedTab) {
      setActiveTab(savedTab as any);
    }
  }, []);

  // Save states to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify(messages));
    } else {
      localStorage.removeItem(STORAGE_CHAT_KEY);
    }
  }, [messages]);

  useEffect(() => {
    if (prd) {
      localStorage.setItem(STORAGE_PRD_KEY, JSON.stringify(prd));
    } else {
      localStorage.removeItem(STORAGE_PRD_KEY);
    }
  }, [prd]);

  useEffect(() => {
    if (jsonSpec) {
      localStorage.setItem(STORAGE_SPEC_KEY, JSON.stringify(jsonSpec));
    } else {
      localStorage.removeItem(STORAGE_SPEC_KEY);
    }
  }, [jsonSpec]);

  useEffect(() => {
    localStorage.setItem(STORAGE_TAB_KEY, activeTab);
  }, [activeTab]);

  const handleSaveConfig = (newConfig: AIConfig) => {
    setAiConfig(newConfig);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newConfig));
  };

  const handleResetConversation = () => {
    setMessages([]);
    setPrd(null);
    setJsonSpec(null);
    setInputValue("");
    setActiveTab("prd");
    
    // Clear storage keys
    localStorage.removeItem(STORAGE_CHAT_KEY);
    localStorage.removeItem(STORAGE_PRD_KEY);
    localStorage.removeItem(STORAGE_SPEC_KEY);
    localStorage.removeItem(STORAGE_TAB_KEY);
  };

  const submitMessagesToAI = async (
    targetMessages: Message[],
    originalMessagesForRollback: Message[],
    originalInputValue?: string
  ) => {
    setIsProcessing(true);
    try {
      let aiResponseText = "";
      let updatedPrd: PRD;

      if (aiConfig.provider === "simulation" || !aiConfig.apiKey) {
        // Simulated PM
        const response = await simulatePMResponse(targetMessages, prd);
        aiResponseText = response.content;
        updatedPrd = response.prd;
      } else {
        // Live API PM
        const response = await generateLivePMResponse(aiConfig, targetMessages, prd);
        aiResponseText = response.content;
        updatedPrd = response.prd;
      }

      const assistantMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: "assistant",
        content: aiResponseText,
        timestamp: new Date()
      };

      setMessages([...targetMessages, assistantMessage]);
      setPrd(updatedPrd);

      // Auto toggle to PRD tab on first message
      if (originalMessagesForRollback.length === 0) {
        setActiveTab("prd");
      }
    } catch (error: any) {
      console.error("Error in messaging loop:", error);
      setApiError(error.message || "An unexpected error occurred during requirements drafting. Please verify your settings.");
      // Roll back messages log and restore the user's prompt to the input box
      setMessages(originalMessagesForRollback);
      if (originalInputValue) {
        setInputValue(originalInputValue);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");

    await submitMessagesToAI(newMessages, messages, userMessage.content);
  };

  const handleRollbackAndSubmit = async (messageId: string) => {
    const idx = messages.findIndex(m => m.id === messageId);
    if (idx === -1) return;

    const targetMessages = messages.slice(0, idx + 1);
    setMessages(targetMessages);

    await submitMessagesToAI(targetMessages, messages);
  };

  const handleEditAndSubmit = async (messageId: string, newContent: string) => {
    const idx = messages.findIndex(m => m.id === messageId);
    if (idx === -1) return;

    const targetMessages = messages.slice(0, idx + 1);
    targetMessages[idx] = {
      ...targetMessages[idx],
      content: newContent
    };
    setMessages(targetMessages);

    await submitMessagesToAI(targetMessages, messages);
  };

  const handleRollbackToInputBar = (messageId: string) => {
    const idx = messages.findIndex(m => m.id === messageId);
    if (idx === -1) return;

    const targetMessages = messages.slice(0, idx);
    setMessages(targetMessages);
    setInputValue(messages[idx].content);
  };

  const handleCompileSpec = async () => {
    if (!prd) return;
    setIsCompiling(true);

    try {
      let spec: JSONSpec;

      if (aiConfig.provider === "simulation" || !aiConfig.apiKey) {
        spec = generateSimulatedSpec(prd.title);
      } else {
        // Retrieve the structured schema rules system prompt from the catalog definition
        const systemPromptFromCatalog = catalog.prompt();
        spec = await generateLiveUISpec(aiConfig, prd, systemPromptFromCatalog);
      }

      setJsonSpec(spec);
      // Seamlessly switch tabs to the rendered Interactive UI canvas!
      setActiveTab("ui");
    } catch (error: any) {
      console.error("Compilation error:", error);
      setApiError(error.message || "An unexpected API error occurred. Please verify your connection.");
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#0a0a0a] text-neutral-50 overflow-hidden font-sans">
      {/* Sidebar - Left Chat Pane */}
      <div className="w-[380px] shrink-0 h-full flex">
        <ChatSection
          messages={messages}
          inputValue={inputValue}
          onChangeInput={setInputValue}
          onSendMessage={handleSendMessage}
          isProcessing={isProcessing}
          prd={prd}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onResetConversation={handleResetConversation}
          onRollbackAndSubmit={handleRollbackAndSubmit}
          onEditPrompt={handleEditAndSubmit}
          onRollbackToInputBar={handleRollbackToInputBar}
        />
      </div>

      {/* Main Panel - Right Canvas Pane */}
      <div className="flex-1 h-full">
        <CanvasSection
          prd={prd}
          jsonSpec={jsonSpec}
          onCompileSpec={handleCompileSpec}
          isCompiling={isCompiling}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* Settings Modal overlay */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={aiConfig}
        onSave={handleSaveConfig}
      />

      {/* Floating Notification Toast */}
      {apiError && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 animate-fade-in">
          <div className="bg-neutral-950/95 border border-neutral-800 text-neutral-200 rounded-xl shadow-2xl backdrop-blur-md p-4 flex gap-3 items-start">
            {/* Warning Icon */}
            <svg className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1 font-heading">
                Engine Notice
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed break-words">
                {apiError}
              </p>
              
              {/* OK Button */}
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => setApiError(null)}
                  className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-300 rounded-lg text-xs font-semibold tracking-tight transition-premium active:scale-[0.97] cursor-pointer"
                >
                  OK
                </button>
              </div>
            </div>

            {/* X Dismiss Button */}
            <button
              onClick={() => setApiError(null)}
              className="p-1 hover:bg-neutral-900 text-neutral-500 hover:text-neutral-300 rounded-lg transition-premium shrink-0 cursor-pointer"
              aria-label="Close notification"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
