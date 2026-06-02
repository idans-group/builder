import React, { Component, ErrorInfo, ReactNode } from "react";
import { defineRegistry, JSONUIProvider, Renderer as CoreRenderer } from "@json-render/react";
import { shadcnComponents } from "@json-render/shadcn";
import { catalog } from "./Catalog";

// React Error Boundary to catch and display rendering or schema validation exceptions gracefully
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error inside json-render renderer:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="w-full p-6 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-200 flex flex-col gap-3 animate-fade-in">
          <div className="flex items-center gap-2 text-neutral-400">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-xs font-bold uppercase tracking-wider font-heading text-neutral-300">
              UI Render Engine Notice
            </h3>
          </div>
          <div className="p-3 bg-neutral-950 border border-neutral-900 rounded-lg">
            <p className="text-xs text-neutral-400 leading-relaxed font-mono whitespace-pre-wrap break-words">
              {this.state.error.toString()}
            </p>
          </div>
          <p className="text-[10px] text-neutral-500 leading-normal">
            This exception occurs if the compiled JSON schema contains components, bindings, or property types (like nested state descriptors) that do not conform to the strict Zod validator schemas inside the shadcn components catalog.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

// 1. Create the registry that maps our catalog definitions to pre-built React implementations, providing an action block
const { registry } = defineRegistry(catalog, {
  components: {
    Card: shadcnComponents.Card,
    Stack: shadcnComponents.Stack,
    Grid: shadcnComponents.Grid,
    Tabs: shadcnComponents.Tabs,
    Table: shadcnComponents.Table,
    Heading: shadcnComponents.Heading,
    Text: shadcnComponents.Text,
    Badge: shadcnComponents.Badge,
    Alert: shadcnComponents.Alert,
    Input: shadcnComponents.Input,
    Switch: shadcnComponents.Switch,
    Select: shadcnComponents.Select,
    Button: shadcnComponents.Button,
  },
  actions: {} as any
});

interface LiveUIRendererProps {
  spec: any;
  initialState?: Record<string, any>;
  onStateChange?: (changes: Array<{ path: string; value: any }>) => void;
}

// Helper to recursively reconstruct a nested components tree from a list of `@json-render` JSON Patch operations
function reconstructSpecFromPatches(patches: any[]): any {
  const elements: Record<string, any> = {};
  let rootKey = "";

  for (const patch of patches) {
    if (!patch || typeof patch !== "object") continue;
    const { op, path, value } = patch;
    if (op !== "add") continue;

    if (path === "/root") {
      rootKey = value;
    } else if (path.startsWith("/elements/")) {
      const key = path.substring(10);
      elements[key] = value;
    }
  }

  if (!rootKey || !elements[rootKey]) return null;

  function buildComponent(key: string): any {
    const elem = elements[key];
    if (!elem) return null;

    const resolvedChildren = (elem.children || [])
      .map((child: any) => {
        if (typeof child === "string" && elements[child]) {
          return buildComponent(child);
        }
        return child;
      })
      .filter((c: any) => c !== null);

    return {
      type: elem.type,
      props: elem.props || {},
      children: resolvedChildren
    };
  }

  const rootComponent = buildComponent(rootKey);
  if (rootComponent) {
    return {
      components: [rootComponent]
    };
  }

  return null;
}

// 2. Export a beautifully wrapped Live UI Renderer component with integrated state context
export const LiveUIRenderer: React.FC<LiveUIRendererProps> = ({
  spec,
  initialState = {},
  onStateChange,
}) => {
  // Resiliently resolve the spec, reconstructing it if it is a JSON Patch operations list
  const resolvedSpec = React.useMemo(() => {
    if (Array.isArray(spec)) {
      console.log("Renderer - Reconstructing tree from JSON patch operations...");
      return reconstructSpecFromPatches(spec);
    }
    return spec;
  }, [spec]);

  return (
    <JSONUIProvider
      registry={registry}
      initialState={initialState}
      onStateChange={onStateChange}
    >
      <div className="w-full h-full p-6 glass-panel rounded-xl overflow-y-auto min-h-[400px] transition-premium">
        {resolvedSpec ? (
          <ErrorBoundary>
            <CoreRenderer spec={resolvedSpec} registry={registry} />
          </ErrorBoundary>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-neutral-500 text-sm gap-2">
            <svg
              className="w-8 h-8 text-neutral-600 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>No UI spec compiled yet. Click &quot;Compile &amp; Render UI&quot; above to build.</span>
          </div>
        )}
      </div>
    </JSONUIProvider>
  );
};
export { registry };
