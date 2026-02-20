import { FaCloudUploadAlt, FaCloudDownloadAlt } from "react-icons/fa";
import React, { useContext, useState } from "react";
import { ResumeContext } from "../../pages/builder";

const REQUIRED_KEYS = ["name", "workExperience", "education", "projects", "skills", "languages"];

const LoadUnload = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext);
  const [error, setError] = useState("");

  // load backup resume data
  const handleLoad = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setError("");
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        // Validate required keys
        const missingKeys = REQUIRED_KEYS.filter((key) => !(key in parsed));
        if (missingKeys.length > 0) {
          setError(`Invalid resume file. Missing fields: ${missingKeys.join(", ")}`);
          return;
        }
        setResumeData(parsed);
        setError("");
      } catch {
        setError("Invalid JSON file. Please upload a valid resume backup file.");
      }
    };
    reader.readAsText(file);
    // Reset input so the same file can be re-uploaded if needed
    event.target.value = "";
  };

  // download resume data
  const handleDownload = (data, filename, event) => {
    event.preventDefault();
    const jsonData = JSON.stringify(data);
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div className="flex flex-col gap-2 mb-2 items-center">
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="inline-flex flex-row items-center gap-2">
          <h2 className="text-[1.2rem] text-white">Load Data</h2>
          <label className="p-2 text-white bg-zinc-800 rounded cursor-pointer hover:bg-zinc-700 transition-colors">
            <FaCloudUploadAlt className="text-[1.2rem] text-white" />
            <input
              aria-label="Load Data"
              type="file"
              className="hidden"
              onChange={handleLoad}
              accept=".json"
            />
          </label>
        </div>
        <div className="inline-flex flex-row items-center gap-2">
          <h2 className="text-[1.2rem] text-white">Save Data</h2>
          <button
            aria-label="Save Data"
            className="p-2 text-white bg-zinc-800 rounded hover:bg-zinc-700 transition-colors"
            onClick={(event) =>
              handleDownload(
                resumeData,
                resumeData.name + " by ATSResume.json",
                event
              )
            }
          >
            <FaCloudDownloadAlt className="text-[1.2rem] text-white" />
          </button>
        </div>
      </div>
      {error && (
        <p className="text-red-400 text-sm text-center px-4">{error}</p>
      )}
    </div>
  );
};

export default LoadUnload;
