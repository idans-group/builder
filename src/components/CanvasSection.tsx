import React, { useState } from "react";
import { PRD, JSONSpec } from "../types";
import { LiveUIRenderer } from "./json-render/Renderer";

interface CanvasSectionProps {
  prd: PRD | null;
  jsonSpec: JSONSpec | null;
  onCompileSpec: () => void;
  isCompiling: boolean;
  activeTab: "prd" | "ui" | "json";
  setActiveTab: (tab: "prd" | "ui" | "json") => void;
}

export const CanvasSection: React.FC<CanvasSectionProps> = ({
  prd,
  jsonSpec,
  onCompileSpec,
  isCompiling,
  activeTab,
  setActiveTab
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyJSON = () => {
    if (jsonSpec) {
      navigator.clipboard.writeText(JSON.stringify(jsonSpec, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Safe helper to render list items that could be string or object shapes
  const renderListItem = (item: any) => {
    if (item === null || item === undefined) return "";
    if (typeof item === "object") {
      const title = item.name || item.title || item.label || "";
      const desc = item.description || item.text || item.value || "";
      if (title || desc) {
        return (
          <span>
            {title && <strong className="text-neutral-200">{title}: </strong>}
            {desc}
          </span>
        );
      }
      return JSON.stringify(item);
    }
    return String(item);
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#0a0a0a] overflow-hidden">
      {/* Header Tabs */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-900 bg-neutral-950/20">
        <div className="flex items-center gap-1.5 bg-neutral-900/60 border border-neutral-800/80 p-0.5 rounded-lg">
          <button
            onClick={() => setActiveTab("prd")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-premium ${
              activeTab === "prd"
                ? "bg-neutral-800 text-neutral-100"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            PRD Document
          </button>
          <button
            onClick={() => setActiveTab("ui")}
            disabled={!prd}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-premium disabled:opacity-30 ${
              activeTab === "ui"
                ? "bg-neutral-800 text-neutral-100"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            Live UI Playground
          </button>
          <button
            onClick={() => setActiveTab("json")}
            disabled={!jsonSpec}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-premium disabled:opacity-30 ${
              activeTab === "json"
                ? "bg-neutral-800 text-neutral-100"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            Raw JSON Spec
          </button>
        </div>

        {/* Action Button */}
        {prd && activeTab === "prd" && (
          <button
            onClick={onCompileSpec}
            disabled={isCompiling}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-neutral-200 text-neutral-950 rounded-lg hover:bg-neutral-100 disabled:opacity-50 active:scale-[0.98] transition-premium shadow-lg shadow-black/40"
          >
            {isCompiling ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Compiling Spec...</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Compile &amp; Render UI</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Main View Area */}
      <div className="flex-1 p-6 overflow-y-auto bg-neutral-950/10">
        {activeTab === "prd" && (
          <div className="w-full max-w-3xl mx-auto glass-panel p-8 rounded-2xl border border-neutral-800/80 animate-fade-in shadow-2xl">
            {prd ? (
              <div className="space-y-6">
                {/* PRD Header */}
                <div className="flex items-center justify-between pb-5 border-b border-neutral-800/80">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full">
                      Requirements Document
                    </span>
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-100 font-heading mt-1">{prd.title}</h1>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${prd.finalized ? "bg-neutral-400 animate-pulse" : "bg-neutral-700"}`} />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                      {prd.finalized ? "Finalized Spec" : "Drafting..."}
                    </span>
                  </div>
                </div>

                {/* Scope Overview */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-heading">1. Project Overview</h3>
                  <p className="text-sm leading-relaxed text-neutral-300 font-normal">{prd.overview}</p>
                </div>

                {/* Target Audience */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-heading">2. Target Audience &amp; Personas</h3>
                  <ul className="list-disc pl-4 text-sm text-neutral-300 leading-relaxed space-y-1">
                    {(() => {
                      const list = Array.isArray(prd.targetAudience) 
                        ? prd.targetAudience 
                        : typeof prd.targetAudience === "string" 
                          ? [prd.targetAudience] 
                          : [];
                      return list.map((audience, idx) => (
                        <li key={idx}>{renderListItem(audience)}</li>
                      ));
                    })()}
                  </ul>
                </div>

                {/* User Flows */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-heading">3. Primary User Flows</h3>
                  <ol className="list-decimal pl-4 text-sm text-neutral-300 leading-relaxed space-y-1">
                    {(() => {
                      const list = Array.isArray(prd.userFlows) 
                        ? prd.userFlows 
                        : typeof prd.userFlows === "string" 
                          ? [prd.userFlows] 
                          : [];
                      return list.map((flow, idx) => (
                        <li key={idx}>{renderListItem(flow)}</li>
                      ));
                    })()}
                  </ol>
                </div>

                {/* Functional Requirements */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-heading">4. Functional Components &amp; Controls</h3>
                  <ul className="list-disc pl-4 text-sm text-neutral-300 leading-relaxed space-y-1">
                    {(() => {
                      const list = Array.isArray(prd.functionalRequirements) 
                        ? prd.functionalRequirements 
                        : typeof prd.functionalRequirements === "string" 
                          ? [prd.functionalRequirements] 
                          : [];
                      return list.map((req, idx) => (
                        <li key={idx}>{renderListItem(req)}</li>
                      ));
                    })()}
                  </ul>
                </div>

                {/* Non-Functional */}
                {prd.nonFunctionalRequirements && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-heading">5. Non-Functional Criteria</h3>
                    <ul className="list-disc pl-4 text-sm text-neutral-300 leading-relaxed space-y-1">
                      {(() => {
                        const list = Array.isArray(prd.nonFunctionalRequirements) 
                          ? prd.nonFunctionalRequirements 
                          : typeof prd.nonFunctionalRequirements === "string" 
                            ? [prd.nonFunctionalRequirements] 
                            : [];
                        return list.map((nfr, idx) => (
                          <li key={idx}>{renderListItem(nfr)}</li>
                        ));
                      })()}
                    </ul>
                  </div>
                )}

                {/* Edge Cases */}
                {prd.edgeCases && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-heading">6. Edge Cases &amp; Validation Limits</h3>
                    <ul className="list-disc pl-4 text-sm text-neutral-300 leading-relaxed space-y-1">
                      {(() => {
                        const list = Array.isArray(prd.edgeCases) 
                          ? prd.edgeCases 
                          : typeof prd.edgeCases === "string" 
                            ? [prd.edgeCases] 
                            : [];
                        return list.map((edge, idx) => (
                          <li key={idx} className="text-neutral-400 font-medium">
                            {renderListItem(edge)}
                          </li>
                        ));
                      })()}
                    </ul>
                  </div>
                )}


              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-neutral-500 gap-2">
                <svg className="w-10 h-10 text-neutral-700 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-medium">Collaborate on the chat pane to draft the PRD document.</span>
              </div>
            )}
          </div>
        )}

        {activeTab === "ui" && (
          <div className="w-full max-w-4xl mx-auto h-full min-h-[500px] flex flex-col gap-4 animate-fade-in">
            <LiveUIRenderer spec={jsonSpec} />
          </div>
        )}

        {activeTab === "json" && jsonSpec && (
          <div className="w-full max-w-3xl mx-auto glass-panel p-6 rounded-2xl border border-neutral-800/80 animate-fade-in shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-4">
              <span className="text-xs font-bold text-neutral-400 font-heading">Compiled json-render Spec Tree</span>
              <button
                onClick={handleCopyJSON}
                className="px-3 py-1 text-[10px] font-bold border border-neutral-800 rounded bg-neutral-900 text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                {copied ? "Copied!" : "Copy Spec"}
              </button>
            </div>
            <pre className="text-xs text-neutral-300 font-mono overflow-x-auto max-h-[500px] leading-relaxed select-all">
              {JSON.stringify(jsonSpec, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
