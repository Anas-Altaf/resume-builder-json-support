/**
 * parseFormatting — converts simple markdown-style markers to safe HTML.
 *
 * Supported markers:
 *   **text**   → <strong>text</strong>
 *   *text*     → <em>text</em>
 *   __text__   → <u>text</u>
 *
 * New lines (\n) → <br/> for multi-line fields.
 */
export function parseFormatting(text) {
    if (!text) return "";

    // Escape raw HTML first to prevent XSS (allow only our own tags)
    let safe = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Apply markers — order matters: bold before italic (** before *)
    safe = safe
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/__(.+?)__/g, "<u>$1</u>");

    return safe;
}

/**
 * parseFormattingNewlines — same as above but also converts \n → <br/>
 * Use for single paragraph fields (summary, descriptions).
 */
export function parseFormattingNewlines(text) {
    return parseFormatting(text).replace(/\n/g, "<br/>");
}
