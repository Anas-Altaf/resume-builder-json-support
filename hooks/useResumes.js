import { useState, useEffect, useCallback, useRef } from "react";
import DefaultResumeData from "../components/utility/DefaultResumeData";

const STORAGE_KEY = "rm_resumes";
const ACTIVE_KEY = "rm_activeResumeId";
const AUTOSAVE_DELAY = 1500; // ms

/** Generate a simple UUID-like id without external deps */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/** Read raw list from localStorage */
function readResumes() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

/** Write raw list to localStorage */
function writeResumes(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/**
 * useResumes — manages all resume persistence.
 *
 * Safe to call with (null, null) for read-only usage (e.g. home page).
 *
 * @param {object|null}   resumeData    current live resume state (builder only)
 * @param {function|null} setResumeData setter from builder context (optional)
 */
export default function useResumes(resumeData, setResumeData) {
    const [resumes, setResumes] = useState([]);
    const [activeResumeId, setActiveResumeId] = useState(null);
    const [saveStatus, setSaveStatus] = useState("idle"); // "idle" | "saving" | "saved"
    const autoSaveTimer = useRef(null);
    // Keep a ref to avoid stale closure inside the debounced save
    const activeResumeIdRef = useRef(activeResumeId);
    useEffect(() => {
        activeResumeIdRef.current = activeResumeId;
    }, [activeResumeId]);

    // Helper: call setResumeData only when it's a function (builder mode)
    const applyData = useCallback((data) => {
        if (typeof setResumeData === "function") setResumeData(data);
    }, [setResumeData]);

    // ── Bootstrap ─────────────────────────────────────────────────────────────
    useEffect(() => {
        const list = readResumes();
        setResumes(list);

        const savedActiveId = localStorage.getItem(ACTIVE_KEY);
        if (savedActiveId) {
            const found = list.find((r) => r.id === savedActiveId);
            if (found) {
                setActiveResumeId(found.id);
                applyData(found.data);
                return;
            }
        }

        // Load most-recently updated resume if no active id stored
        if (list.length > 0) {
            const latest = [...list].sort(
                (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            )[0];
            setActiveResumeId(latest.id);
            applyData(latest.data);
            localStorage.setItem(ACTIVE_KEY, latest.id);
        }
    }, []); // runs once on mount

    // ── Auto-save debounce ────────────────────────────────────────────────────
    useEffect(() => {
        // Skip if no active resume, or no live resumeData (home page mode)
        if (!activeResumeIdRef.current || !resumeData) return;

        setSaveStatus("saving");
        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);

        autoSaveTimer.current = setTimeout(() => {
            const id = activeResumeIdRef.current;
            if (!id) return;
            const list = readResumes();
            const idx = list.findIndex((r) => r.id === id);
            if (idx === -1) return;
            list[idx] = { ...list[idx], data: resumeData, updatedAt: new Date().toISOString() };
            writeResumes(list);
            setResumes([...list]);
            setSaveStatus("saved");
            setTimeout(() => setSaveStatus("idle"), 2000);
        }, AUTOSAVE_DELAY);

        return () => {
            if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
        };
    }, [resumeData]);

    // ── Public API ────────────────────────────────────────────────────────────

    /** Create a brand-new blank resume and make it active */
    const createResume = useCallback((name = "Untitled Resume") => {
        const newResume = {
            id: generateId(),
            name,
            updatedAt: new Date().toISOString(),
            data: { ...DefaultResumeData },
        };
        const list = readResumes();
        list.unshift(newResume);
        writeResumes(list);
        setResumes([...list]);
        setActiveResumeId(newResume.id);
        applyData({ ...DefaultResumeData });
        localStorage.setItem(ACTIVE_KEY, newResume.id);
        setSaveStatus("idle");
        return newResume.id;
    }, [applyData]);

    /** Load an existing resume into the builder */
    const loadResume = useCallback((id) => {
        const list = readResumes();
        const found = list.find((r) => r.id === id);
        if (!found) return;
        setActiveResumeId(found.id);
        applyData(found.data);
        localStorage.setItem(ACTIVE_KEY, found.id);
        setSaveStatus("idle");
    }, [applyData]);

    /** Immediately save current resumeData to a resume slot (manual save) */
    const saveResume = useCallback((data, id) => {
        const targetId = id || activeResumeIdRef.current;
        if (!targetId) return;
        const list = readResumes();
        const idx = list.findIndex((r) => r.id === targetId);
        if (idx === -1) return;
        list[idx] = { ...list[idx], data, updatedAt: new Date().toISOString() };
        writeResumes(list);
        setResumes([...list]);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
    }, []);

    /** Rename a resume */
    const renameResume = useCallback((id, newName) => {
        const trimmed = newName.trim();
        if (!trimmed) return;
        const list = readResumes();
        const idx = list.findIndex((r) => r.id === id);
        if (idx === -1) return;
        list[idx] = { ...list[idx], name: trimmed, updatedAt: new Date().toISOString() };
        writeResumes(list);
        setResumes([...list]);
    }, []);

    /** Duplicate a resume */
    const duplicateResume = useCallback((id) => {
        const list = readResumes();
        const source = list.find((r) => r.id === id);
        if (!source) return;
        const copy = {
            ...source,
            id: generateId(),
            name: source.name + " (Copy)",
            updatedAt: new Date().toISOString(),
            data: JSON.parse(JSON.stringify(source.data)),
        };
        list.unshift(copy);
        writeResumes(list);
        setResumes([...list]);
        return copy.id;
    }, []);

    /** Delete a resume. If it was active, load the next available one. */
    const deleteResume = useCallback((id) => {
        let list = readResumes();
        list = list.filter((r) => r.id !== id);
        writeResumes(list);
        setResumes([...list]);

        if (activeResumeIdRef.current === id) {
            if (list.length > 0) {
                const next = list[0];
                setActiveResumeId(next.id);
                applyData(next.data);
                localStorage.setItem(ACTIVE_KEY, next.id);
            } else {
                setActiveResumeId(null);
                applyData({ ...DefaultResumeData });
                localStorage.removeItem(ACTIVE_KEY);
            }
        }
    }, [applyData]);

    /** Ensure an active resume slot exists; creates one on first real edit */
    const ensureActiveResume = useCallback(() => {
        if (activeResumeIdRef.current) return activeResumeIdRef.current;
        return createResume("My Resume");
    }, [createResume]);

    return {
        resumes,
        activeResumeId,
        saveStatus,
        createResume,
        loadResume,
        saveResume,
        renameResume,
        duplicateResume,
        deleteResume,
        ensureActiveResume,
    };
}
