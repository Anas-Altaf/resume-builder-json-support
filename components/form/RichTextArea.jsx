import React, { useRef, useState, useCallback } from "react";

/**
 * RichTextArea — textarea with a floating formatting toolbar.
 *
 * Supports: **bold**, *italic*, __underline__
 * Keyboard shortcuts: Ctrl+B, Ctrl+I, Ctrl+U
 *
 * Props mirror a standard <textarea> (value, onChange, placeholder, className, name, maxLength, rows)
 */
export default function RichTextArea({
    value = "",
    onChange,
    placeholder,
    className = "",
    name,
    maxLength,
    rows = 4,
}) {
    const textareaRef = useRef(null);
    const [focused, setFocused] = useState(false);

    /** Wrap the currently selected text with open/close markers */
    const wrapSelection = useCallback((openTag, closeTag) => {
        const el = textareaRef.current;
        if (!el) return;

        const start = el.selectionStart;
        const end = el.selectionEnd;
        const selected = value.slice(start, end);

        // If text is already wrapped, unwrap it
        const before = value.slice(Math.max(0, start - openTag.length), start);
        const after = value.slice(end, end + closeTag.length);

        let newValue, newStart, newEnd;

        if (before === openTag && after === closeTag) {
            // Unwrap
            newValue =
                value.slice(0, start - openTag.length) +
                selected +
                value.slice(end + closeTag.length);
            newStart = start - openTag.length;
            newEnd = end - openTag.length;
        } else {
            // Wrap
            newValue =
                value.slice(0, start) +
                openTag + selected + closeTag +
                value.slice(end);
            newStart = start + openTag.length;
            newEnd = end + openTag.length;
        }

        // Fire synthetic onChange
        onChange({ target: { name, value: newValue } });

        // Restore selection after React re-renders
        requestAnimationFrame(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(newStart, newEnd);
            }
        });
    }, [value, onChange, name]);

    const handleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey)) {
            if (e.key === "b" || e.key === "B") {
                e.preventDefault();
                wrapSelection("**", "**");
            } else if (e.key === "i" || e.key === "I") {
                e.preventDefault();
                wrapSelection("*", "*");
            } else if (e.key === "u" || e.key === "U") {
                e.preventDefault();
                wrapSelection("__", "__");
            }
        }
    };

    const toolbarButtons = [
        { label: "B", title: "Bold (Ctrl+B)", open: "**", close: "**", style: "font-bold" },
        { label: "I", title: "Italic (Ctrl+I)", open: "*", close: "*", style: "italic" },
        { label: "U", title: "Underline (Ctrl+U)", open: "__", close: "__", style: "underline" },
    ];

    return (
        <div className="relative group">
            {/* Formatting toolbar — appears on focus */}
            <div
                className={`flex items-center gap-1 mb-1 transition-opacity duration-150 ${focused ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
            >
                <span className="text-zinc-500 text-[10px] mr-1 select-none">Format:</span>
                {toolbarButtons.map((btn) => (
                    <button
                        key={btn.label}
                        type="button"
                        title={btn.title}
                        onMouseDown={(e) => {
                            // Prevent textarea blur before we wrap
                            e.preventDefault();
                            wrapSelection(btn.open, btn.close);
                        }}
                        className={`${btn.style} text-xs w-6 h-6 flex items-center justify-center rounded border border-zinc-600 bg-zinc-800 text-zinc-200 hover:bg-zinc-600 hover:text-white transition-colors select-none`}
                    >
                        {btn.label}
                    </button>
                ))}
                <span className="text-zinc-600 text-[10px] ml-1 select-none hidden sm:inline">
                    or Ctrl+B / Ctrl+I / Ctrl+U
                </span>
            </div>

            <textarea
                ref={textareaRef}
                name={name}
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={placeholder}
                className={className}
                maxLength={maxLength}
                rows={rows}
            />
        </div>
    );
}
