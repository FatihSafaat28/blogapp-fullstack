import React from 'react';
import { Button } from '../../../shared/components/ui/Form/Button';
import { Spinner } from '../../../shared/components/ui/Feedback/Spinner';
import { AutoSaveStatus } from '../types/editor.types';
import {
  ArrowLeft,
  CheckCircle,
  WarningCircle,
  PaperPlaneTilt,
  Clock,
} from '@phosphor-icons/react';

interface EditorHeaderProps {
  autoSaveStatus: AutoSaveStatus;
  isPublished: boolean;
  wordCount: number;
  readingTime: number;
  isPublishing: boolean;
  onExit: () => void;
  onOpenSettings?: () => void;
  onOpenPublishModal: () => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  autoSaveStatus,
  isPublished,
  wordCount,
  readingTime,
  isPublishing,
  onExit,
  onOpenPublishModal,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-card/85 backdrop-blur-md border-b border-line px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors">
      {/* Left: Back & Status Pill */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onExit}
          aria-label="Kembali ke dashboard postingan"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-ink-muted hover:text-ink hover:bg-muted/70 transition-colors"
        >
          <ArrowLeft size={16} weight="bold" />
          <span className="hidden sm:inline">Dashboard</span>
        </button>

        {/* AutoSave Status Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border border-line-subtle bg-muted/40">
          {autoSaveStatus === 'saving' ? (
            <>
              <Spinner size="sm" color="primary" />
              <span className="text-ink-muted">Menyimpan...</span>
            </>
          ) : autoSaveStatus === 'saved' ? (
            <>
              <CheckCircle size={14} weight="fill" className="text-success" />
              <span className="text-ink-muted">Tersimpan</span>
            </>
          ) : autoSaveStatus === 'error' ? (
            <>
              <WarningCircle size={14} weight="fill" className="text-danger" />
              <span className="text-danger">Gagal simpan</span>
            </>
          ) : (
            <span className="text-ink-muted">Draf</span>
          )}
        </div>
      </div>

      {/* Center / Right: Word Counts & Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Word count & Reading time */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-ink-muted">
          <span>{wordCount} kata</span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <Clock size={13} /> {readingTime} min baca
          </span>
        </div>

        {/* Single Publish Action Button */}
        <Button
          variant={isPublished ? 'secondary' : 'primary'}
          size="sm"
          iconPrefix={<PaperPlaneTilt size={15} weight="bold" />}
          onClick={onOpenPublishModal}
          isLoading={isPublishing}
        >
          {isPublished ? 'Perbarui Tulisan' : 'Terbitkan Tulisan'}
        </Button>
      </div>
    </header>
  );
};
