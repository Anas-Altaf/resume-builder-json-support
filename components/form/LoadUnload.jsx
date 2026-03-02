import { FaCloudUploadAlt, FaCloudDownloadAlt, FaClipboard, FaCopy, FaFileImport, FaSave, FaTimes } from "react-icons/fa";
import React, { useContext, useState, useRef } from "react";
import { ResumeContext } from "../../pages/builder";

const REQUIRED_KEYS = ["name", "workExperience", "education", "projects", "skills", "languages"];

/** Validate + normalise parsed JSON before setting it as resume data */
function validateAndNormalize(parsed) {
  const missingKeys = REQUIRED_KEYS.filter((key) => !(key in parsed));
  if (missingKeys.length > 0) {
    return { ok: false, error: `Invalid resume data. Missing fields: ${missingKeys.join(", ")}` };
  }
  // Backward compat: map project.name → project.title
  if (parsed.projects) {
    parsed.projects = parsed.projects.map((p) => {
      if (p.name && !p.title) return { ...p, title: p.name };
      return p;
    });
  }
  return { ok: true, data: parsed };
}

/* ─── Modal Shell ─────────────────────────────────────────────────────────── */
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
    <div
      className="relative w-[95vw] max-w-lg bg-zinc-900 border border-white/10 rounded-xl shadow-2xl p-5 max-h-[85vh] flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors" aria-label="Close">
          <FaTimes size={18} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

/* ─── Main Component ──────────────────────────────────────────────────────── */
const LoadUnload = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext);

  const [loadOpen, setLoadOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);

  // ── Load modal state ────────────────────────────────────────────────────
  const [loadText, setLoadText] = useState("");
  const [loadError, setLoadError] = useState("");
  const [loadSuccess, setLoadSuccess] = useState("");
  const fileInputRef = useRef(null);

  // ── Save modal state ────────────────────────────────────────────────────
  const [saveText, setSaveText] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  /* ── Open helpers ─────────────────────────────────────────────────────── */
  const openLoad = () => {
    setLoadText("");
    setLoadError("");
    setLoadSuccess("");
    setLoadOpen(true);
  };

  const openSave = () => {
    setSaveText(JSON.stringify(resumeData, null, 2));
    setSaveSuccess("");
    setSaveOpen(true);
  };

  /* ── Load: apply JSON text ───────────────────────────────────────────── */
  const applyLoadText = (text) => {
    setLoadError("");
    setLoadSuccess("");
    try {
      const parsed = JSON.parse(text);
      const result = validateAndNormalize(parsed);
      if (!result.ok) {
        setLoadError(result.error);
        return;
      }
      setResumeData(result.data);
      setLoadSuccess("✓ Loaded successfully");
      setTimeout(() => setLoadOpen(false), 600);
    } catch {
      setLoadError("Invalid JSON. Please check the format and try again.");
    }
  };

  /* ── Load: paste from clipboard ──────────────────────────────────────── */
  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setLoadText(text);
    } catch {
      setLoadError("Clipboard access denied. Please paste manually into the text box.");
    }
  };

  /* ── Load: select file ───────────────────────────────────────────────── */
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setLoadText(e.target.result);
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  /* ── Save: copy to clipboard ─────────────────────────────────────────── */
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(saveText);
      setSaveSuccess("✓ Copied to clipboard");
      setTimeout(() => setSaveSuccess(""), 2000);
    } catch {
      setSaveSuccess("Failed to copy. Please select and copy manually.");
    }
  };

  /* ── Save: download file ─────────────────────────────────────────────── */
  const downloadFile = () => {
    const blob = new Blob([saveText], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = (resumeData.name || "resume") + " by ATSResume.json";
    link.click();
    setSaveSuccess("✓ File saved");
    setTimeout(() => setSaveSuccess(""), 2000);
  };

  return (
    <>
      {/* ── Trigger Buttons ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 mb-2 items-center">
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            type="button"
            onClick={openLoad}
            className="inline-flex items-center gap-2 px-4 py-2 text-white bg-zinc-800 rounded hover:bg-zinc-700 transition-colors"
          >
            <FaCloudUploadAlt className="text-[1.1rem]" />
            <span className="text-[0.95rem]">Load Data</span>
          </button>
          <button
            type="button"
            onClick={openSave}
            className="inline-flex items-center gap-2 px-4 py-2 text-white bg-zinc-800 rounded hover:bg-zinc-700 transition-colors"
          >
            <FaCloudDownloadAlt className="text-[1.1rem]" />
            <span className="text-[0.95rem]">Save Data</span>
          </button>
        </div>
      </div>

      {/* ── Load Modal ────────────────────────────────────────────────── */}
      {loadOpen && (
        <Modal title="Load Resume Data" onClose={() => setLoadOpen(false)}>
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={pasteFromClipboard}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm text-white bg-zinc-700 rounded hover:bg-zinc-600 transition-colors"
            >
              <FaClipboard /> Paste from Clipboard
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm text-white bg-zinc-700 rounded hover:bg-zinc-600 transition-colors"
            >
              <FaFileImport /> Select File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".json"
              onChange={handleFileSelect}
            />
          </div>

          <textarea
            className="w-full h-48 p-3 text-sm text-white bg-zinc-800 border border-white/10 rounded-lg resize-y font-mono focus:outline-none focus:border-blue-500/50 placeholder-zinc-500"
            placeholder="Paste your JSON here…"
            value={loadText}
            onChange={(e) => setLoadText(e.target.value)}
            spellCheck={false}
          />

          {loadError && <p className="text-red-400 text-sm mt-2">{loadError}</p>}
          {loadSuccess && <p className="text-green-400 text-sm mt-2">{loadSuccess}</p>}

          <button
            type="button"
            onClick={() => applyLoadText(loadText)}
            disabled={!loadText.trim()}
            className="mt-3 w-full py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Apply
          </button>
        </Modal>
      )}

      {/* ── Save Modal ────────────────────────────────────────────────── */}
      {saveOpen && (
        <Modal title="Save Resume Data" onClose={() => setSaveOpen(false)}>
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={copyToClipboard}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm text-white bg-zinc-700 rounded hover:bg-zinc-600 transition-colors"
            >
              <FaCopy /> Copy to Clipboard
            </button>
            <button
              type="button"
              onClick={downloadFile}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm text-white bg-zinc-700 rounded hover:bg-zinc-600 transition-colors"
            >
              <FaSave /> Save to File
            </button>
          </div>

          <textarea
            className="w-full h-48 p-3 text-sm text-white bg-zinc-800 border border-white/10 rounded-lg resize-y font-mono focus:outline-none focus:border-blue-500/50"
            value={saveText}
            onChange={(e) => setSaveText(e.target.value)}
            spellCheck={false}
          />

          {saveSuccess && <p className="text-green-400 text-sm mt-2">{saveSuccess}</p>}
        </Modal>
      )}
    </>
  );
};

export default LoadUnload;
