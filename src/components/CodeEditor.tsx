import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { EditorView } from "@codemirror/view";

const langExtensions = [javascript({ jsx: true, typescript: true }), python(), java(), cpp()];
const editorBaseTheme = EditorView.theme({
  "&": { borderRadius: "0 0 12px 12px", fontSize: "13px" },
  "&.cm-focused": { outline: "none" },
  ".cm-scroller": { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" },
  ".cm-gutters": { borderRight: "1px solid rgba(255,255,255,0.05)" },
});

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  editable?: boolean;
  readOnly?: boolean;
  minHeight?: string;
  maxHeight?: string;
  placeholder?: string;
}

const CodeEditor = ({
  value,
  onChange,
  editable = false,
  readOnly = true,
  minHeight = "120px",
  maxHeight = "600px",
  placeholder,
}: CodeEditorProps) => (
  <CodeMirror
    value={value}
    onChange={onChange}
    editable={editable}
    readOnly={readOnly}
    theme={vscodeDark}
    extensions={[...langExtensions, editorBaseTheme]}
    basicSetup={{
      lineNumbers: true,
      foldGutter: true,
      highlightActiveLine: editable,
      highlightSelectionMatches: true,
    }}
    minHeight={minHeight}
    maxHeight={maxHeight}
    placeholder={placeholder}
  />
);

export default CodeEditor;
