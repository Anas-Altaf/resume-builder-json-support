import React, { useContext } from "react";
import { ResumeContext } from "../../pages/builder";

const SPACING_CONTROLS = [
    { key: "sectionGap", label: "Section Gap", min: 0, max: 16, step: 1, unit: "px" },
    { key: "entryGap", label: "Entry Gap", min: 0, max: 12, step: 1, unit: "px" },
    { key: "lineHeight", label: "Line Height", min: 1.0, max: 2.0, step: 0.05, unit: "" },
    { key: "columnGap", label: "Column Gap", min: 0, max: 32, step: 2, unit: "px" },
];

const SpacingControls = () => {
    const { resumeData, setResumeData } = useContext(ResumeContext);

    const spacing = resumeData.spacing || {
        sectionGap: 4,
        entryGap: 2,
        lineHeight: 1.3,
        columnGap: 16,
    };

    const handleChange = (key, value) => {
        setResumeData({
            ...resumeData,
            spacing: { ...spacing, [key]: parseFloat(value) },
        });
    };

    const resetDefaults = () => {
        setResumeData({
            ...resumeData,
            spacing: { sectionGap: 4, entryGap: 2, lineHeight: 1.3, columnGap: 16 },
        });
    };

    return (
        <div className="flex-col-gap-2">
            <div className="flex items-center justify-between">
                <h2 className="input-title">Spacing</h2>
                <button
                    type="button"
                    onClick={resetDefaults}
                    className="text-xs text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded bg-zinc-800/50"
                >
                    Reset
                </button>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {SPACING_CONTROLS.map(({ key, label, min, max, step, unit }) => (
                    <div key={key} className="flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                            <label className="text-xs text-zinc-400">{label}</label>
                            <span className="text-xs text-zinc-300 font-mono">
                                {key === "lineHeight" ? spacing[key].toFixed(2) : spacing[key]}{unit}
                            </span>
                        </div>
                        <input
                            type="range"
                            min={min}
                            max={max}
                            step={step}
                            value={spacing[key]}
                            onChange={(e) => handleChange(key, e.target.value)}
                            className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpacingControls;
