import React, { useState, createContext, useEffect } from "react";
import { useRouter } from "next/router";
import Language from "../components/form/Language";
import Meta from "../components/meta/Meta";
import FormCP from "../components/form/FormCP";
import LoadUnload from "../components/form/LoadUnload";
import Preview from "../components/preview/Preview";
import DefaultResumeData from "../components/utility/DefaultResumeData";
import SocialMedia from "../components/form/SocialMedia";
import WorkExperience from "../components/form/WorkExperience";
import Skill from "../components/form/Skill";
import PersonalInformation from "../components/form/PersonalInformation";
import Summary from "../components/form/Summary";
import Projects from "../components/form/Projects";
import Education from "../components/form/Education";
import dynamic from "next/dynamic";
import Certification from "../components/form/certification";
import { SparklesCore } from "../components/ui/sparkles";
import AIAnalysis from "../components/ai/AIAnalysis";
import ResumeSidebar from "../components/resume/ResumeSidebar";
import useResumes from "../hooks/useResumes";

const ResumeContext = createContext(DefaultResumeData);

// server side rendering false
const Print = dynamic(() => import("../components/utility/WinPrint"), {
  ssr: false,
});

export default function Builder() {
  const router = useRouter();

  // ── Resume state ───────────────────────────────────────────────────────────
  const [resumeData, setResumeData] = useState(DefaultResumeData);
  const [formClose, setFormClose] = useState(false);

  // ── Resume manager ─────────────────────────────────────────────────────────
  const {
    resumes,
    activeResumeId,
    saveStatus,
    createResume,
    loadResume,
    renameResume,
    duplicateResume,
    deleteResume,
    ensureActiveResume,
  } = useResumes(resumeData, setResumeData);

  // ── Load resume from URL param (?resume=<id>) ─────────────────────────────
  useEffect(() => {
    const { resume: idFromUrl, action } = router.query;
    if (idFromUrl && idFromUrl !== activeResumeId) {
      loadResume(idFromUrl);
      if (action === "print") {
        setTimeout(() => window.print(), 600);
      }
    }
  }, [router.query]);

  // ── Ensure new sessions get a resume slot created ─────────────────────────
  // After hook bootstraps: if no resume exists at all, create one on first real edit
  const handleChange = (e) => {
    ensureActiveResume();
    setResumeData({ ...resumeData, [e.target.name]: e.target.value });
  };

  const handleProfilePicture = (e) => {
    const file = e.target.files[0];
    if (file instanceof Blob) {
      ensureActiveResume();
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeData({ ...resumeData, profilePicture: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // ── Print helper: load resume then print ─────────────────────────────────
  const handlePrint = (id) => {
    loadResume(id);
    // Small delay to let state flush before triggering print
    setTimeout(() => window.print(), 300);
  };

  // ── Create new and stay on builder ────────────────────────────────────────
  const handleCreate = () => {
    createResume();
  };

  return (
    <>
      <ResumeContext.Provider
        value={{
          resumeData,
          setResumeData,
          handleProfilePicture,
          handleChange,
        }}
      >
        <Meta
          title="Free Resume Maker"
          description="free resume maker for humanity."
          keywords="ATS-friendly, Resume optimization, Keyword-rich resume, ATS resume builder, ATS resume templates, ATS-compliant resume, ATS-optimized CV, ATS-friendly format, ATS resume tips, Resume writing services, Career guidance, Job search in India, Resume tips for India, Professional resume builder, Cover letter writing, Interview preparation, Job interview tips, Career growth, Online job applications, resume builder, free resume builder, resume ats, best free resume builder, resume creator, resume cv, resume design, resume editor, resume maker"
        />

        {/* Resume sidebar — collapsible, default collapsed */}
        <ResumeSidebar
          resumes={resumes}
          activeResumeId={activeResumeId}
          saveStatus={saveStatus}
          onLoad={loadResume}
          onRename={renameResume}
          onDuplicate={duplicateResume}
          onDelete={deleteResume}
          onPrint={handlePrint}
          onCreate={handleCreate}
        />

        <div className="f-col gap-4 md:flex-row justify-evenly max-w-full md:mx-auto md:h-screen">
          {!formClose && (
            <div className="relative w-full h-full md:overflow-y-scroll exclude-print bg-black">
              <div className="w-full absolute inset-0 z-0">
                <SparklesCore
                  id="tsparticlesfullpage"
                  background="transparent"
                  minSize={0.6}
                  maxSize={1.4}
                  particleDensity={100}
                  className="w-full h-full"
                  particleColor="#FFFFFF"
                />
              </div>
              <form className="relative z-10 p-4 bg-black/30">
                {/* Save status indicator */}
                {saveStatus !== "idle" && (
                  <div className="mb-3 text-center">
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${saveStatus === "saving"
                        ? "bg-yellow-900/40 text-yellow-400"
                        : "bg-green-900/40 text-green-400"
                        }`}
                    >
                      {saveStatus === "saving" ? "⏳ Saving…" : "✓ Saved"}
                    </span>
                  </div>
                )}
                <LoadUnload />
                <PersonalInformation />
                <SocialMedia />
                <Summary />
                <Education />
                <WorkExperience />
                <Projects />
                {resumeData.skills.map((skill, index) => (
                  <Skill title={skill.title} key={index} />
                ))}
                <Language />
                <Certification />
              </form>
            </div>
          )}
          <Preview className="w-full h-full" />
        </div>
        <FormCP formClose={formClose} setFormClose={setFormClose} />
        <AIAnalysis resumeData={resumeData} />
        <Print />
      </ResumeContext.Provider>
    </>
  );
}

export { ResumeContext };
