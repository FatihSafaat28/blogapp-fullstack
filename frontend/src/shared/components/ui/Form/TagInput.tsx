import React, { useState, KeyboardEvent, useId } from 'react';
import { X } from '@phosphor-icons/react';

export interface TagInputProps {
  id?: string;
  label?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  error?: string;
  helperText?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  id,
  label,
  tags,
  onChange,
  placeholder = 'Ketik topik lalu tekan Enter...',
  maxTags = 5,
  error,
  helperText,
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
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
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-ink cursor-pointer select-none"
        >
          {label}
        </label>
      )}
      <div
        className={`flex flex-wrap items-center gap-1.5 p-1.5 min-h-10.5 bg-canvas rounded-lg transition-all duration-150 ${
          error
            ? 'border border-danger ring-1 ring-danger'
            : 'border border-line focus-within:ring-1 focus-within:ring-ink'
        }`}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-ink border border-line"
          >
            #{tag}
            <button
              type="button"
              className="p-0.5 hover:bg-card rounded-full transition-colors cursor-pointer"
              onClick={() => removeTag(tag)}
              aria-label={`Hapus tag ${tag}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
        {tags.length < maxTags && (
          <input
            id={inputId}
            name="tagInput"
            type="text"
            className="flex-1 min-w-30 px-2 py-1 text-sm bg-transparent border-none outline-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ''}
            aria-label="Input penambahan tag"
          />
        )}
      </div>
      {error && <span className="text-xs font-medium text-danger">{error}</span>}
      {!error && (
        <span className="text-xs text-ink-muted">
          {helperText || `Maksimal ${maxTags} tag (${tags.length}/${maxTags})`}
        </span>
      )}
    </div>
  );
};
