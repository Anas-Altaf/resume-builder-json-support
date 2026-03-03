import React, { useRef, useState, useCallback } from "react";

/**
 * RichInput — single-line input with inline formatting support.
 *
 * Supports: **bold**, *italic*, __underline__
 * Keyboard shortcuts: Ctrl+B, Ctrl+I, Ctrl+U
 *
 * Props mirror a standard <input> (value, onChange, placeholder, className, name, type, maxLength, minLength)
 */
export default function RichInput({
    value = "",
    onChange,
    placeholder,
    className = "",
    name,
    type = "text",
    maxLength,
    minLength,
}) {
    const inputRef = useRef(null);

    /** Wrap the currently selected text with open/close markers */
    const wrapSelection = useCallback(
        (openTag, closeTag) => {
            const el = inputRef.current;
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
                    openTag +
                    selected +
                    closeTag +
                    value.slice(end);
                newStart = start + openTag.length;
                newEnd = end + openTag.length;
            }

            // Fire synthetic onChange
            onChange({ target: { name, value: newValue } });

            // Restore selection after React re-renders
            requestAnimationFrame(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                    inputRef.current.setSelectionRange(newStart, newEnd);
                }
            });
        },
        [value, onChange, name]
    );

    const handleKeyDown = (e) => {
        if (e.ctrlKey || e.metaKey) {
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

    return (
        <input
            ref={inputRef}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={className}
            maxLength={maxLength}
            minLength={minLength}
        />
    );
}
