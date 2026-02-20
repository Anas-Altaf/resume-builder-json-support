import React, { useState, useRef, useEffect } from "react";

/**
 * Relative time helper — "2 minutes ago", "yesterday", etc.
 */
function timeAgo(isoString) {
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days === 1) return "yesterday";
    if (days < 7) return `${days}d ago`;
    return new Date(isoString).toLocaleDateString();
}

/**
 * ResumeCard — used in sidebar and home page grid.
 */
export default function ResumeCard({
    resume,
    isActive,
    onLoad,
    onRename,
    onDuplicate,
    onDelete,
    onPrint,
    compact = false,
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [renaming, setRenaming] = useState(false);
    const [nameValue, setNameValue] = useState(resume.name);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [menuStyle, setMenuStyle] = useState({});
    const menuRef = useRef(null);
    const renameRef = useRef(null);
    const btnRef = useRef(null);

    useEffect(() => setNameValue(resume.name), [resume.name]);

    // Close menu on outside click
    useEffect(() => {
        if (!menuOpen) return;
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target) &&
                btnRef.current && !btnRef.current.contains(e.target)) {
                setMenuOpen(false);
                setDeleteConfirm(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [menuOpen]);

    // Position menu using fixed coordinates when it opens
    useEffect(() => {
        if (menuOpen && btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            const menuWidth = 176; // w-44
            const menuHeight = 220;
            const spaceBelow = window.innerHeight - rect.bottom;
            const openUpward = spaceBelow < menuHeight;

            // Right-align menu with button, but clamp so it stays in viewport
            const idealLeft = rect.right - menuWidth;
            const left = Math.max(8, Math.min(idealLeft, window.innerWidth - menuWidth - 8));

            setMenuStyle({
                position: "fixed",
                left,
                ...(openUpward
                    ? { bottom: window.innerHeight - rect.top + 4 }
                    : { top: rect.bottom + 4 }),
            });
        }
    }, [menuOpen]);

    useEffect(() => {
        if (renaming && renameRef.current) renameRef.current.focus();
    }, [renaming]);

    const handleRenameSubmit = () => {
        if (nameValue.trim()) onRename(resume.id, nameValue.trim());
        setRenaming(false);
    };

    const handleCardClick = () => {
        if (renaming || menuOpen) return;
        onLoad(resume.id);
    };

    const handlePrint = () => {
        setMenuOpen(false);
        onPrint(resume.id);
    };

    const cardBase = compact
        ? "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer select-none transition-all group"
        : "flex flex-col gap-1 p-4 rounded-xl cursor-pointer select-none transition-all group border";

    const cardActive = isActive
        ? compact
            ? "bg-zinc-700 text-white"
            : "border-indigo-500 bg-zinc-900 text-white"
        : compact
            ? "hover:bg-zinc-700/60 text-zinc-300"
            : "border-zinc-700 bg-zinc-900/60 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800";

    return (
        <div className={`${cardBase} ${cardActive} relative`} onClick={handleCardClick}>
            {compact ? (
                <span className="text-base shrink-0">📄</span>
            ) : (
                <div className="text-3xl mb-1 text-center">📄</div>
            )}

            <div className="flex-1 min-w-0">
                {renaming ? (
                    <input
                        ref={renameRef}
                        value={nameValue}
                        onChange={(e) => setNameValue(e.target.value)}
                        onBlur={handleRenameSubmit}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleRenameSubmit();
                            if (e.key === "Escape") {
                                setNameValue(resume.name);
                                setRenaming(false);
                            }
                            e.stopPropagation();
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-transparent border-b border-indigo-400 outline-none text-white w-full text-sm font-medium"
                    />
                ) : (
                    <p className={`font-medium truncate text-sm ${isActive ? "text-white" : "text-zinc-200"}`}>
                        {resume.name}
                    </p>
                )}
                <p className="text-xs text-zinc-500 truncate">{timeAgo(resume.updatedAt)}</p>
            </div>

            {/* 3-dot menu button */}
            <div className="shrink-0">
                <button
                    ref={btnRef}
                    onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen((v) => !v);
                        setDeleteConfirm(false);
                    }}
                    className={`p-1 rounded transition-colors text-zinc-500 hover:text-white hover:bg-zinc-600 ${compact ? "opacity-0 group-hover:opacity-100" : ""
                        }`}
                    title="Options"
                    aria-label="Resume options"
                >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                        <circle cx="10" cy="4" r="1.5" />
                        <circle cx="10" cy="10" r="1.5" />
                        <circle cx="10" cy="16" r="1.5" />
                    </svg>
                </button>
            </div>

            {/* Dropdown menu — fixed position to avoid overflow */}
            {menuOpen && (
                <div
                    ref={menuRef}
                    className="z-[100] w-44 bg-zinc-800 border border-zinc-700 rounded-lg shadow-2xl py-1"
                    style={menuStyle}
                    onClick={(e) => e.stopPropagation()}
                >
                    <MenuItem
                        icon="✏️"
                        label="Rename"
                        onClick={() => { setRenaming(true); setMenuOpen(false); }}
                    />
                    <MenuItem
                        icon="📑"
                        label="Duplicate"
                        onClick={() => { onDuplicate(resume.id); setMenuOpen(false); }}
                    />
                    <MenuItem
                        icon="🖨️"
                        label="Print / Save PDF"
                        onClick={handlePrint}
                    />
                    <div className="border-t border-zinc-700 my-1" />
                    {deleteConfirm ? (
                        <div className="px-3 py-2">
                            <p className="text-xs text-zinc-400 mb-2">Delete permanently?</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => { onDelete(resume.id); setMenuOpen(false); setDeleteConfirm(false); }}
                                    className="flex-1 text-xs bg-red-600 hover:bg-red-500 text-white rounded px-2 py-1 transition-colors"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setDeleteConfirm(false)}
                                    className="flex-1 text-xs bg-zinc-700 hover:bg-zinc-600 text-white rounded px-2 py-1 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <MenuItem
                            icon="🗑️"
                            label="Delete"
                            danger
                            onClick={() => setDeleteConfirm(true)}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

function MenuItem({ icon, label, onClick, danger }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors hover:bg-zinc-700 ${danger ? "text-red-400 hover:text-red-300" : "text-zinc-300 hover:text-white"
                }`}
        >
            <span className="text-base leading-none">{icon}</span>
            <span>{label}</span>
        </button>
    );
}
