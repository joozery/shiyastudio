'use client';
import { useMemo, useSyncExternalStore } from 'react';
const key = 'shiya-creator-selection';
const changed = 'shiya-creator-selection-changed';
function subscribe(listener: () => void) { window.addEventListener('storage', listener); window.addEventListener(changed, listener); return () => { window.removeEventListener('storage', listener); window.removeEventListener(changed, listener); }; }
function snapshot() { try {
    return localStorage.getItem(key) || '[]';
}
catch {
    return '[]';
} }
function serverSnapshot() { return '[]'; }
export function useCreatorSelection() { const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot); const selected = useMemo<string[]>(() => { try {
    const values = JSON.parse(raw);
    return Array.isArray(values) ? values.filter(value => typeof value === 'string') : [];
}
catch {
    return [];
} }, [raw]); const write = (values: string[]) => { try {
    localStorage.setItem(key, JSON.stringify(values));
    window.dispatchEvent(new Event(changed));
}
catch { } }; return { selected, toggle: (id: string) => write(selected.includes(id) ? selected.filter(value => value !== id) : [...selected, id]), clear: () => write([]) }; }
