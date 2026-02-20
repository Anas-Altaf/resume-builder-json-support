import React, { useState } from "react";
import ResumeCard from "./ResumeCard";

/**
 * ResumeSidebar — collapsible left sidebar listing all saved resumes.
 *
 * Props: all come from useResumes() in builder.jsx
 */
export default function ResumeSidebar({
    resumes,
    activeResumeId,
    saveStatus,
    onLoad,
    onRename,
    onDuplicate,
    onDelete,
    onPrint,
    onCreate,
}) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Toggle button — always visible, exclude from print */}
            <button
                onClick={() => setOpen((v) => !v)}
                className="exclude-print fixed left-0 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center w-8 h-14 bg-zinc-800 hover:bg-zinc-700 text-white rounded-r-xl shadow-lg transition-all border-r-0 border border-zinc-700"
                title={open ? "Close resume list" : "Open resume list"}
                aria-label={open ? "Close sidebar" : "Open sidebar"}
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                >
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </button>

            {/* Backdrop */}
            {open && (
                <div
                    className="exclude-print fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar panel */}
            <aside
                className={`exclude-print fixed left-0 top-0 h-full z-50 flex flex-col bg-zinc-900 border-r border-zinc-700 shadow-2xl transition-all duration-300 ease-in-out ${open ? "w-72 translate-x-0" : "w-72 -translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-700 shrink-0">
                    <div>
                        <h2 className="text-white font-semibold text-sm tracking-wide">My Resumes</h2>
                        <p className="text-zinc-500 text-xs mt-0.5">
                            {resumes.length} resume{resumes.length !== 1 ? "s" : ""} saved
                        </p>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="p-1 text-zinc-500 hover:text-white transition-colors rounded"
                        aria-label="Close sidebar"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* New Resume button */}
                <div className="px-3 pt-3 pb-2 shrink-0">
                    <button
                        onClick={() => { onCreate(); setOpen(false); }}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
                    >
                        <span className="text-base leading-none">＋</span>
                        New Resume
                    </button>
                </div>

                {/* Save status */}
                {saveStatus !== "idle" && (
                    <div className="px-4 py-1 shrink-0">
                        <p className={`text-xs text-center transition-opacity ${saveStatus === "saving" ? "text-yellow-400" : "text-green-400"}`}>
                            {saveStatus === "saving" ? "⏳ Saving…" : "✓ Saved"}
                        </p>
                    </div>
                )}

                {/* Resume list */}
                <div className="flex-1 overflow-y-auto px-2 pb-4 min-h-0">
                    {resumes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-4">
                            <div className="text-3xl mb-3">📋</div>
                            <p className="text-zinc-500 text-sm">No resumes yet.</p>
                            <p className="text-zinc-600 text-xs mt-1">Click "New Resume" above to start.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1 mt-1">
                            {resumes.map((resume) => (
                                <ResumeCard
                                    key={resume.id}
                                    resume={resume}
                                    isActive={resume.id === activeResumeId}
                                    onLoad={(id) => { onLoad(id); setOpen(false); }}
                                    onRename={onRename}
                                    onDuplicate={(id) => { onDuplicate(id); }}
                                    onDelete={onDelete}
                                    onPrint={(id) => { onPrint(id); setOpen(false); }}
                                    compact={true}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer hint */}
                <div className="px-4 py-3 border-t border-zinc-800 shrink-0">
                    <p className="text-zinc-600 text-xs text-center">Auto-saved every 1.5 s</p>
                </div>
            </aside>
        </>
    );
}
