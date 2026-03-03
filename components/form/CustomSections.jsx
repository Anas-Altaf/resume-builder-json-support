import FormButton from "./FormButton";
import React, { useContext } from "react";
import { ResumeContext } from "../../pages/builder";

const CustomSections = () => {
    const { resumeData, setResumeData } = useContext(ResumeContext);
    const customSections = resumeData.customSections || [];

    const handleSectionTitle = (e, index) => {
        const updated = [...customSections];
        updated[index] = { ...updated[index], title: e.target.value, id: e.target.value.toLowerCase().replace(/\s+/g, "-") };
        setResumeData({ ...resumeData, customSections: updated });
    };

    const handleSectionItems = (e, index) => {
        const updated = [...customSections];
        updated[index] = { ...updated[index], items: e.target.value.split("\n") };
        setResumeData({ ...resumeData, customSections: updated });
    };

    const addSection = () => {
        setResumeData({
            ...resumeData,
            customSections: [
                ...customSections,
                { id: `custom-${Date.now()}`, title: "", items: [] },
            ],
        });
    };

    const removeSection = (index) => {
        const updated = [...customSections];
        updated.splice(index, 1);
        setResumeData({ ...resumeData, customSections: updated });
    };

    return (
        <div className="flex-col-gap-2">
            <h2 className="input-title">Custom Sections</h2>
            {customSections.map((section, index) => (
                <div key={index} className="f-col">
                    <input
                        type="text"
                        placeholder="Section Title (e.g. Awards, Publications)"
                        className="w-full other-input"
                        value={section.title}
                        onChange={(e) => handleSectionTitle(e, index)}
                    />
                    <textarea
                        placeholder="Items (one per line)"
                        className="w-full other-input h-28"
                        value={(section.items || []).join("\n")}
                        onChange={(e) => handleSectionItems(e, index)}
                    />
                </div>
            ))}
            <FormButton
                size={customSections.length}
                add={addSection}
                remove={removeSection}
            />
        </div>
    );
};

export default CustomSections;
