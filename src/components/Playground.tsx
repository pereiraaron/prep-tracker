import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { SandpackFileExplorer } from "sandpack-file-explorer";
import { nightOwl } from "@codesandbox/sandpack-themes";
import { Play, Save, Loader2 } from "lucide-react";

const playgroundStyles = `
  .playground-root *:focus,
  .playground-root *:focus-visible,
  .playground-root *:focus-within {
    outline: none !important;
    box-shadow: none !important;
    border-color: transparent !important;
  }
  .playground-root .sp-file-explorer .sp-button,
  .playground-root .sp-file-explorer button,
  .playground-root .sp-file-explorer li,
  .playground-root .sp-file-explorer [role="treeitem"],
  .playground-root [class*="FileExplorer"] button,
  .playground-root [class*="FileExplorer"] li {
    border-bottom: 1px solid rgba(255,255,255,0.08) !important;
    font-size: 14px !important;
  }
  @media (max-width: 768px) {
    .playground-root {
      flex-direction: column !important;
      height: auto !important;
      min-height: calc(100vh - 110px);
    }
    .playground-root .sp-file-explorer,
    .playground-root .file-explorer-separator {
      display: none !important;
    }
    .playground-root .playground-right-panel {
      border-left: none !important;
      border-top: 1px solid rgba(255,255,255,0.06) !important;
    }
  }
`;

interface PlaygroundProps {
  files: Record<string, string>;
  template?: "react" | "vanilla" | "vanilla-ts" | "react-ts";
  showFileExplorer?: boolean;
  showConsole?: boolean;
  showPreview?: boolean;
  onSave?: (files: Record<string, string>) => void;
  saving?: boolean;
}

const SaveButton = ({ onSave, saving }: { onSave: (files: Record<string, string>) => void; saving: boolean }) => {
  const { sandpack } = useSandpack();

  const handleSave = () => {
    const currentFiles: Record<string, string> = {};
    for (const [path, file] of Object.entries(sandpack.files)) {
      currentFiles[path] = file.code;
    }
    onSave(currentFiles);
  };

  return (
    <button
      onClick={handleSave}
      disabled={saving}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        background: "rgba(255,255,255,0.08)",
        color: "#c5ccda",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "5px",
        fontSize: "11px",
        fontWeight: 600,
        cursor: saving ? "not-allowed" : "pointer",
        opacity: saving ? 0.6 : 1,
        transition: "all 0.15s",
      }}
    >
      {saving ? <Loader2 style={{ width: 10, height: 10, animation: "spin 1s linear infinite" }} /> : <Save style={{ width: 10, height: 10 }} />}
      {saving ? "Saving..." : "Save"}
    </button>
  );
};

const RunButton = () => {
  const { sandpack } = useSandpack();

  return (
    <button
      onClick={() => sandpack.runSandpack()}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        background: "#22c55e",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        fontSize: "11px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#16a34a";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#22c55e";
      }}
    >
      <Play style={{ width: 10, height: 10, fill: "#fff" }} />
      Run
    </button>
  );
};

const PlaygroundInner = ({
  showFileExplorer,
  showConsole,
  showPreview,
  onSave,
  saving,
}: {
  showFileExplorer: boolean;
  showConsole: boolean;
  showPreview: boolean;
  onSave?: (files: Record<string, string>) => void;
  saving?: boolean;
}) => (
  <div
    className="playground-root"
    style={{
      display: "flex",
      height: "calc(100vh - 110px)",
      borderRadius: "12px",
      border: "1px solid rgba(255,255,255,0.08)",
      overflow: "hidden",
      boxShadow: "0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04)",
    }}
  >
    <style>{playgroundStyles}</style>
    {showFileExplorer && (
      <>
        <SandpackFileExplorer />
        <div className="file-explorer-separator" style={{ width: 1, background: "rgba(255,255,255,0.1)", flexShrink: 0 }} />
      </>
    )}

    <SandpackCodeEditor
      showTabs
      showLineNumbers
      showInlineErrors
      wrapContent
      closableTabs
      style={{
        height: "100%",
        minHeight: 300,
        flex: showPreview ? 1 : 2,
        minWidth: 0,
      }}
    />

    {showPreview && (
      <div
        className="playground-right-panel"
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          height: "100%",
          minHeight: 300,
          minWidth: 0,
          borderLeft: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            ...sectionLabel,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>Preview</span>
          <div style={{ display: "flex", gap: 6 }}>
            {onSave && <SaveButton onSave={onSave} saving={saving ?? false} />}
            <RunButton />
          </div>
        </div>
        <SandpackPreview
          showOpenInCodeSandbox={false}
          showRefreshButton
          style={{ flex: showConsole ? 2 : 1, minHeight: 0 }}
        />
        {showConsole && (
          <>
            <div style={{ ...sectionLabel, borderTop: "1px solid rgba(255,255,255,0.06)" }}>Console</div>
            <SandpackConsole style={{ flex: 1, minHeight: 0, background: "#000" }} />
          </>
        )}
      </div>
    )}

    {!showPreview && showConsole && (
      <div
        className="playground-right-panel"
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          height: "100%",
          minHeight: 200,
          minWidth: 0,
          borderLeft: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            ...sectionLabel,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>Console</span>
          <div style={{ display: "flex", gap: 6 }}>
            {onSave && <SaveButton onSave={onSave} saving={saving ?? false} />}
            <RunButton />
          </div>
        </div>
        <SandpackConsole style={{ flex: 1, minHeight: 0 }} />
      </div>
    )}
  </div>
);

const Playground = ({
  files,
  template = "react",
  showFileExplorer = true,
  showConsole = true,
  showPreview = true,
  onSave,
  saving,
}: PlaygroundProps) => (
  <SandpackProvider
    template={template}
    files={files}
    theme={nightOwl}
    options={{
      recompileMode: "delayed",
      recompileDelay: 500,
    }}
  >
    <PlaygroundInner showFileExplorer={showFileExplorer} showConsole={showConsole} showPreview={showPreview} onSave={onSave} saving={saving} />
  </SandpackProvider>
);

const sectionLabel: React.CSSProperties = {
  padding: "6px 12px",
  fontSize: "11px",
  fontWeight: 600,
  color: "#7e8a9e",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  letterSpacing: "0.5px",
  textTransform: "uppercase",
};

export default Playground;
