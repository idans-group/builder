import React, { useRef, useEffect } from "react";
import { Message, PRD } from "../types";

interface ChatSectionProps {
  messages: Message[];
  inputValue: string;
  onChangeInput: (val: string) => void;
  onSendMessage: () => void;
  isProcessing: boolean;
  prd: PRD | null;
  onOpenSettings: () => void;
  onResetConversation: () => void;
  onRollbackAndSubmit: (messageId: string) => void;
  onEditPrompt: (messageId: string, newContent: string) => void;
  onRollbackToInputBar: (messageId: string) => void;
}

export const ChatSection: React.FC<ChatSectionProps> = ({
  messages,
  inputValue,
  onChangeInput,
  onSendMessage,
  isProcessing,
  prd,
  onOpenSettings,
  onResetConversation,
  onRollbackAndSubmit,
  onEditPrompt,
  onRollbackToInputBar
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Context Menu State
  const [contextMenu, setContextMenu] = React.useState<{
    messageId: string;
    x: number;
    y: number;
  } | null>(null);

  // Message Editing State
  const [editingMessageId, setEditingMessageId] = React.useState<string | null>(null);
  const [editingContent, setEditingContent] = React.useState<string>("");

  // Dismiss context menu on click outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setContextMenu(null);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  // Automatically grow the textarea height to fit content, up to the max-height limit
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  // Compute PRD progress based on fields filled
  const getProgress = () => {
    if (!prd) return 0;
    let score = 10; // title exists
    if (prd.overview) score += 15;
    
    const hasItems = (val: any) => {
      if (Array.isArray(val)) return val.length > 0;
      if (typeof val === "string" && val.trim().length > 0) return true;
      return false;
    };
    
    if (hasItems(prd.targetAudience)) score += 15;
    if (hasItems(prd.userFlows)) score += 20;
    if (hasItems(prd.functionalRequirements)) score += 20;
    if (hasItems(prd.edgeCases)) score += 20;
    return Math.min(score, 100);
  };

  const progress = getProgress();

  return (
    <div className="flex flex-col w-full h-full bg-[#0d0d0d] border-r border-neutral-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-900 bg-neutral-950/40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-neutral-400 rounded-full animate-pulse" />
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-neutral-200 font-heading">AI Product Manager</h1>
            <p className="text-[10px] text-neutral-500 font-medium">Goal: Perfect PRD Specifications</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {messages.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to clear the conversation and restart?")) {
                  onResetConversation();
                }
              }}
              className="p-1.5 text-neutral-400 hover:text-neutral-200 bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-800 rounded-lg transition-premium animate-fade-in"
              title="Reset Conversation"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
          <button
            onClick={onOpenSettings}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-800 rounded-lg transition-premium"
            title="Configure AI Engine"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>


      {/* Progress Indicator */}
      {prd && (
        <div className="px-4 py-2 bg-neutral-950/20 border-b border-neutral-900 flex items-center justify-between text-xs text-neutral-400 gap-4">
          <span className="font-semibold text-[10px] uppercase tracking-wider text-neutral-500 shrink-0">PRD Draft Progress</span>
          <div className="flex-1 h-1.5 bg-neutral-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-neutral-300 transition-premium"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-semibold text-neutral-200 shrink-0">{progress}%</span>
        </div>
      )}

      {/* Message List */}
      <div
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-4 bg-neutral-950/20"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-xs mx-auto text-neutral-500 gap-3">
            <div className="w-12 h-12 flex items-center justify-center bg-neutral-900 border border-neutral-800 rounded-2xl text-xl">
              💡
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-300 font-heading">Outline your Product</h2>
              <p className="text-xs leading-relaxed mt-1">
                Enter your application concept below (e.g. &quot;fitness habit hub&quot; or &quot;enterprise API manager&quot;) to start drafting a perfect PRD.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col max-w-[85%] ${
                message.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
              } animate-fade-in`}
              onContextMenu={(e) => {
                if (message.role !== "user" || isProcessing) return;
                e.preventDefault();
                setContextMenu({
                  messageId: message.id,
                  x: e.clientX,
                  y: e.clientY
                });
              }}
            >
              <div
                title={message.role === "user" && !isProcessing ? "Right-click to manage context" : undefined}
                className={`px-3.5 py-2.5 text-sm rounded-xl leading-relaxed whitespace-pre-wrap transition-premium select-text ${
                  message.role === "user"
                    ? `bg-neutral-200 text-neutral-950 rounded-tr-none font-medium ${
                        !isProcessing ? "hover:bg-neutral-100 cursor-context-menu" : ""
                      }`
                    : "bg-neutral-900 border border-neutral-800/80 text-neutral-200 rounded-tl-none"
                }`}
              >
                {editingMessageId === message.id ? (
                  <div className="flex flex-col gap-2 min-w-[240px]" onClick={(e) => e.stopPropagation()}>
                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 text-xs resize-none min-h-[60px] leading-normal"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (editingContent.trim()) {
                            onEditPrompt(message.id, editingContent.trim());
                            setEditingMessageId(null);
                          }
                        } else if (e.key === "Escape") {
                          setEditingMessageId(null);
                        }
                      }}
                      autoFocus
                    />
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingMessageId(null)}
                        className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 rounded-md text-[10px] font-semibold transition-premium cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (editingContent.trim()) {
                            onEditPrompt(message.id, editingContent.trim());
                            setEditingMessageId(null);
                          }
                        }}
                        className="px-2.5 py-1 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 rounded-md text-[10px] font-semibold transition-premium cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  message.content
                )}
              </div>
              <span className="text-[9px] text-neutral-600 mt-1 font-medium px-1 flex items-center gap-1.5">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {message.role === "user" && !isProcessing && (
                  <span className="text-[8px] text-neutral-700 font-semibold tracking-wider uppercase bg-neutral-900 border border-neutral-800/40 px-1.5 py-0.5 rounded-sm">
                    Right-Click Menu
                  </span>
                )}
              </span>
            </div>
          ))
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex flex-col items-start max-w-[80%] mr-auto animate-fade-in">
            <div className="px-3.5 py-3.5 bg-neutral-900 border border-neutral-800/80 rounded-xl rounded-tl-none flex items-center gap-1.5">
              <div className="loading-dots flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full" />
                <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full" />
                <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full" />
              </div>
              <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider pl-1.5">
                AI PM is analyzing...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-neutral-900 bg-neutral-950/40 backdrop-blur-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (inputValue.trim() && !isProcessing) onSendMessage();
          }}
          className="flex gap-2 items-end"
        >
          <textarea
            ref={textareaRef}
            placeholder={
              messages.length === 0
                ? "Describe what you want to build..."
                : "Answer clarifying questions..."
            }
            value={inputValue}
            onChange={(e) => onChangeInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // Prevent standard newline insertion
                if (inputValue.trim() && !isProcessing) {
                  onSendMessage();
                }
              }
            }}
            disabled={isProcessing}
            rows={1}
            className="flex-1 px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 disabled:opacity-50 transition-premium text-sm resize-none min-h-[40px] max-h-36 overflow-y-auto leading-normal"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isProcessing}
            className="px-4 py-2.5 h-10 w-10 shrink-0 bg-neutral-200 text-neutral-950 rounded-xl font-semibold hover:bg-neutral-100 disabled:opacity-50 disabled:hover:bg-neutral-200 transition-premium flex items-center justify-center active:scale-[0.97]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>

      {/* Context Menu Overlay */}
      {contextMenu && (
        <div
          className="fixed bg-neutral-900/95 border border-neutral-800 text-neutral-200 text-[11px] rounded-xl shadow-2xl p-1.5 z-[100] min-w-[170px] animate-fade-in backdrop-blur-md"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => {
              const msg = messages.find(m => m.id === contextMenu.messageId);
              if (msg) {
                setEditingMessageId(contextMenu.messageId);
                setEditingContent(msg.content);
              }
              setContextMenu(null);
            }}
            className="w-full text-left px-2.5 py-1.5 hover:bg-neutral-800 rounded-lg font-medium transition-premium flex items-center gap-2 cursor-pointer text-neutral-300 hover:text-neutral-100"
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit Prompt
          </button>
          <button
            type="button"
            onClick={() => {
              onRollbackAndSubmit(contextMenu.messageId);
              setContextMenu(null);
            }}
            className="w-full text-left px-2.5 py-1.5 hover:bg-neutral-800 rounded-lg font-medium transition-premium flex items-center gap-2 cursor-pointer text-neutral-300 hover:text-neutral-100"
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
            </svg>
            Rollback & Re-submit
          </button>
          
          <div className="h-[1px] bg-neutral-800/80 my-1" />
          
          <button
            type="button"
            onClick={() => {
              onRollbackToInputBar(contextMenu.messageId);
              setContextMenu(null);
            }}
            className="w-full text-left px-2.5 py-1.5 hover:bg-neutral-800 rounded-lg font-medium transition-premium flex items-center gap-2 cursor-pointer text-neutral-500 hover:text-neutral-300"
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Rollback to Input Bar
          </button>
        </div>
      )}

    </div>
  );
};
