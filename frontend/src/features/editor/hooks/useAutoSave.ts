import { useState, useRef, useEffect, useCallback } from 'react';
import { useAutoSaveMutation } from '../api/editorQueries';
import { AutoSavePayload, AutoSaveStatus } from '../types/editor.types';
import { useToast } from '../../../shared/components/ui/Toast/useToast';

interface UseAutoSaveProps {
  postId?: string;
  onSaveSuccess?: () => void;
}

export const useAutoSave = ({ postId, onSaveSuccess }: UseAutoSaveProps) => {
  const [status, setStatus] = useState<AutoSaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const latestPayloadRef = useRef<AutoSavePayload | null>(null);
  const isDirtyRef = useRef(false);

  const autoSaveMutation = useAutoSaveMutation();
  const { showToast } = useToast();

  const performSave = useCallback(
    async (payload: AutoSavePayload) => {
      if (!postId || postId === 'new') return;
      setStatus('saving');

      try {
        await autoSaveMutation.mutateAsync({ id: postId, payload });
        setStatus('saved');
        setLastSavedAt(new Date());
        isDirtyRef.current = false;
        // Clean emergency backup on success
        localStorage.removeItem(`avian_backup_${postId}`);
        onSaveSuccess?.();
      } catch (err) {
        setStatus('error');
        // Emergency snapshot to localStorage
        try {
          localStorage.setItem(`avian_backup_${postId}`, JSON.stringify(payload));
        } catch {
          // localStorage full / unavailable
        }
      }
    },
    [postId, autoSaveMutation, onSaveSuccess]
  );

  const triggerAutoSave = useCallback(
    (payload: AutoSavePayload) => {
      latestPayloadRef.current = payload;
      isDirtyRef.current = true;

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        if (latestPayloadRef.current) {
          performSave(latestPayloadRef.current);
        }
      }, 2000);
    },
    [performSave]
  );

  const flushAutoSave = useCallback(
    async (overridePayload?: AutoSavePayload) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      const payloadToSave = overridePayload || latestPayloadRef.current;
      if (payloadToSave) {
        await performSave(payloadToSave);
      }
    },
    [performSave]
  );

  // Keyboard shortcut Ctrl+S / Cmd+S instant manual save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (latestPayloadRef.current) {
          flushAutoSave();
          showToast('✦ Perubahan tulisan berhasil disimpan.', 'success');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flushAutoSave, showToast]);

  // Native beforeunload protection
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (status === 'saving' || isDirtyRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [status]);

  return {
    status,
    lastSavedAt,
    triggerAutoSave,
    flushAutoSave,
    isSaving: status === 'saving',
  };
};
