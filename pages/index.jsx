import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Hero from "../components/hero/Hero";
import ResumeGrid from "../components/resume/ResumeGrid";
import useResumes from "../hooks/useResumes";

export default function Home() {
  const router = useRouter();

  // Read-only usage — no live resumeData, no auto-save
  const {
    resumes,
    activeResumeId,
    createResume,
    loadResume,
    renameResume,
    duplicateResume,
    deleteResume,
  } = useResumes(null, null);

  // Print: navigate to builder with action param
  const handlePrint = (id) => {
    router.push(`/builder?resume=${id}&action=print`);
  };

  const handleCreate = () => {
    const id = createResume();
    router.push(`/builder?resume=${id}`);
  };

  return (
    <div className="min-h-screen bg-black">
      <Hero />

      {/* Resume section below hero */}
      <section className="relative z-10 bg-black border-t border-zinc-800 px-6 py-12 md:px-16">
        <ResumeGrid
          resumes={resumes}
          activeResumeId={activeResumeId}
          onLoad={(id) => {
            loadResume(id);
            router.push(`/builder?resume=${id}`);
          }}
          onRename={renameResume}
          onDuplicate={duplicateResume}
          onDelete={deleteResume}
          onPrint={handlePrint}
          onCreate={handleCreate}
        />
      </section>
    </div>
  );
}
