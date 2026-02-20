import React, { useContext, useEffect } from "react";
import { ResumeContext } from "../../pages/builder";

/**
 * Curated font list — system fonts (no load needed) + Google Fonts (loaded dynamically)
 * `google` = Google Fonts family name with + for spaces (used in the URL).
 */
export const FONTS = [
    // ── System / Web-safe ────────────────────────────────────────────────────
    { name: "Georgia", family: "Georgia, serif", google: null, category: "Serif" },
    { name: "Times New Roman", family: "'Times New Roman', Times, serif", google: null, category: "Serif" },
    { name: "Garamond", family: "Garamond, serif", google: null, category: "Serif" },
    { name: "Arial", family: "Arial, Helvetica, sans-serif", google: null, category: "Sans-serif" },
    { name: "Helvetica", family: "Helvetica, Arial, sans-serif", google: null, category: "Sans-serif" },
    { name: "Calibri", family: "Calibri, 'Gill Sans', sans-serif", google: null, category: "Sans-serif" },
    { name: "Trebuchet MS", family: "'Trebuchet MS', sans-serif", google: null, category: "Sans-serif" },
    { name: "Verdana", family: "Verdana, Geneva, sans-serif", google: null, category: "Sans-serif" },
    { name: "Courier New", family: "'Courier New', Courier, monospace", google: null, category: "Monospace" },
    // ── Google Fonts ─────────────────────────────────────────────────────────
    { name: "Inter", family: "'Inter', sans-serif", google: "Inter", category: "Sans-serif" },
    { name: "Roboto", family: "'Roboto', sans-serif", google: "Roboto", category: "Sans-serif" },
    { name: "Open Sans", family: "'Open Sans', sans-serif", google: "Open+Sans", category: "Sans-serif" },
    { name: "Lato", family: "'Lato', sans-serif", google: "Lato", category: "Sans-serif" },
    { name: "Nunito", family: "'Nunito', sans-serif", google: "Nunito", category: "Sans-serif" },
    { name: "Montserrat", family: "'Montserrat', sans-serif", google: "Montserrat", category: "Sans-serif" },
    { name: "Poppins", family: "'Poppins', sans-serif", google: "Poppins", category: "Sans-serif" },
    { name: "Raleway", family: "'Raleway', sans-serif", google: "Raleway", category: "Sans-serif" },
    { name: "Merriweather", family: "'Merriweather', serif", google: "Merriweather", category: "Serif" },
    { name: "Playfair Display", family: "'Playfair Display', serif", google: "Playfair+Display", category: "Serif" },
    { name: "EB Garamond", family: "'EB Garamond', serif", google: "EB+Garamond", category: "Serif" },
    { name: "Libre Baskerville", family: "'Libre Baskerville', serif", google: "Libre+Baskerville", category: "Serif" },
    { name: "Source Code Pro", family: "'Source Code Pro', monospace", google: "Source+Code+Pro", category: "Monospace" },
];

export const DEFAULT_FONT = "Georgia, serif";

/** Inject a Google Fonts <link> tag if not already present */
function loadGoogleFont(googleName) {
    if (!googleName || typeof document === "undefined") return;
    const id = `gfont-${googleName.replace(/\+/g, "-")}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${googleName}:wght@300;400;500;600;700&display=swap`;
    document.head.appendChild(link);
}

export default function FontPicker() {
    const { resumeData, setResumeData } = useContext(ResumeContext);
    const currentFamily = resumeData.fontFamily || DEFAULT_FONT;

    // Load the currently selected google font on mount / change
    useEffect(() => {
        const font = FONTS.find((f) => f.family === currentFamily);
        if (font?.google) loadGoogleFont(font.google);
    }, [currentFamily]);

    const handleChange = (e) => {
        const family = e.target.value;
        const font = FONTS.find((f) => f.family === family);
        if (font?.google) loadGoogleFont(font.google);
        setResumeData({ ...resumeData, fontFamily: family });
    };

    const systemFonts = FONTS.filter((f) => !f.google);
    const googleFonts = FONTS.filter((f) => f.google);
    const currentFont = FONTS.find((f) => f.family === currentFamily);

    return (
        <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-zinc-800/60 border border-zinc-700 mb-3">
            <label className="text-zinc-400 text-xs font-medium shrink-0">🔤 Font</label>

            <select
                value={currentFamily}
                onChange={handleChange}
                className="flex-1 bg-zinc-900 text-zinc-200 text-sm rounded border border-zinc-600 px-2 py-1 outline-none focus:border-indigo-500 transition-colors"
            >
                <optgroup label="── System Fonts ──">
                    {systemFonts.map((f) => (
                        <option key={f.name} value={f.family}>
                            {f.name} ({f.category})
                        </option>
                    ))}
                </optgroup>
                <optgroup label="── Google Fonts ──">
                    {googleFonts.map((f) => (
                        <option key={f.name} value={f.family}>
                            {f.name} ({f.category})
                        </option>
                    ))}
                </optgroup>
            </select>

            {/* Live font preview */}
            <span
                style={{ fontFamily: currentFamily }}
                className="text-zinc-200 text-base shrink-0 w-10 text-center"
                title={`Preview: ${currentFont?.name}`}
            >
                Aa
            </span>
        </div>
    );
}
