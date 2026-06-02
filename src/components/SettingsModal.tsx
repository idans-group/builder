import React, { useState } from "react";
import { AIConfig } from "../types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AIConfig;
  onSave: (config: AIConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave
}) => {
  const [provider, setProvider] = useState<AIConfig["provider"]>(config.provider);
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [model, setModel] = useState(config.model);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ provider, apiKey, model });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md p-6 glass-panel rounded-2xl shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <h2 className="text-xl font-bold tracking-tight text-neutral-100 font-heading">AI Engine Configuration</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-200 transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="py-4 space-y-4">
          {/* Provider Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">AI Provider</label>
            <select
              value={provider}
              onChange={(e) => {
                const prov = e.target.value as AIConfig["provider"];
                setProvider(prov);
                if (prov === "gemini") setModel("gemini-1.5-flash");
                else if (prov === "openai") setModel("gpt-4o");
                else setModel("");
              }}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:border-neutral-500 transition-premium"
            >
              <option value="simulation">In-Browser Simulator (Zero-Config)</option>
              <option value="gemini">Google Gemini API</option>
              <option value="openai">OpenAI API</option>
            </select>
          </div>

          {provider !== "simulation" && (
            <>
              {/* API Key */}
              <div className="flex flex-col gap-1.5 animate-fade-in">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">API Access Key</label>
                <input
                  type="password"
                  placeholder={`Enter your ${provider === "gemini" ? "Gemini" : "OpenAI"} API Key`}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:border-neutral-500 transition-premium placeholder-neutral-600"
                />
              </div>

              {/* Model Name */}
              <div className="flex flex-col gap-1.5 animate-fade-in">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Model Name</label>
                <input
                  type="text"
                  placeholder="e.g. gemini-1.5-flash, gpt-4o"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 focus:outline-none focus:border-neutral-500 transition-premium placeholder-neutral-600"
                />
              </div>
            </>
          )}

          {provider === "simulation" && (
            <div className="p-3 bg-neutral-900/50 border border-neutral-800/40 rounded-lg text-xs text-neutral-400 leading-relaxed animate-fade-in">
              <span className="font-semibold text-neutral-200">Tip:</span> The in-browser simulation uses high-fidelity canned PM and spec builders. It works completely offline, requires no keys, and showcases beautiful layouts instantly!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-semibold bg-neutral-200 text-neutral-950 rounded-lg hover:bg-neutral-100 hover:scale-[1.02] active:scale-[0.98] transition-premium"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
