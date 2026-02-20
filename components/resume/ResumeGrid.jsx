import React from "react";
import ResumeCard from "./ResumeCard";
import { useRouter } from "next/router";

/**
 * ResumeGrid — used on the home page to display all saved resumes.
 */
export default function ResumeGrid({
    resumes,
    activeResumeId,
    onLoad,
    onRename,
    onDuplicate,
    onDelete,
    onPrint,
    onCreate,
}) {
    const router = useRouter();

    const handleCreate = () => {
        const id = onCreate();
        router.push(`/builder?resume=${id}`);
    };

    if (resumes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-5xl mb-4">📋</div>
                <p className="text-zinc-400 text-lg mb-2">No resumes saved yet</p>
                <p className="text-zinc-600 text-sm mb-6">
                    Create your first resume and it will appear here automatically.
                </p>
                <button
                    onClick={handleCreate}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors"
                >
                    <span className="text-lg leading-none">＋</span>
                    New Resume
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-semibold text-xl">Your Resumes</h2>
                <button
                    onClick={handleCreate}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors"
                >
                    <span className="text-base leading-none">＋</span>
                    New Resume
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {resumes.map((resume) => (
                    <ResumeCard
                        key={resume.id}
                        resume={resume}
                        isActive={resume.id === activeResumeId}
                        onLoad={(id) => { onLoad(id); router.push(`/builder?resume=${id}`); }}
                        onRename={onRename}
                        onDuplicate={onDuplicate}
                        onDelete={onDelete}
                        onPrint={onPrint}
                        compact={false}
                    />
                ))}
            </div>
        </div>
    );
}
