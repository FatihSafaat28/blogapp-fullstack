import React, { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

export interface TagInputProps {
  label?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  error?: string;
  helperText?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  label,
  tags,
  onChange,
  placeholder = 'Ketik topik lalu tekan Enter...',
  maxTags = 5,
  error,
  helperText,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = inputValue.trim().replace(/^#/, '');
      if (trimmed && !tags.includes(trimmed) && tags.length < maxTags) {
        onChange([...tags, trimmed]);
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {label}
        </label>
      )}
      <div
        className={`flex flex-wrap items-center gap-1.5 p-1.5 min-h-[42px] bg-white dark:bg-slate-900 border rounded-lg transition-all duration-150 ${
          error
            ? 'border-red-500 ring-2 ring-red-500/10'
            : 'border-slate-200 dark:border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20'
        }`}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50"
          >
            #{tag}
            <button
              type="button"
              className="p-0.5 hover:bg-indigo-200 dark:hover:bg-indigo-900 rounded-full transition-colors"
              onClick={() => removeTag(tag)}
              aria-label={`Hapus tag ${tag}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
        {tags.length < maxTags && (
          <input
            type="text"
            className="flex-1 min-w-[120px] px-2 py-1 text-sm bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ''}
          />
        )}
      </div>
      {error && <span className="text-xs font-medium text-red-500">{error}</span>}
      {!error && (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {helperText || `Maksimal ${maxTags} tag (${tags.length}/${maxTags})`}
        </span>
      )}
    </div>
  );
};
