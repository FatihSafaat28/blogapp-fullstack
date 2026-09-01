import { useState, useRef, useEffect, useCallback } from 'react';
import { Editor } from '@tiptap/react';

export interface MatchPosition {
  from: number;
  to: number;
}

export const useSearchReplace = (editor: Editor | null) => {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [matches, setMatches] = useState<MatchPosition[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;
      setCoords({
        top: rect.bottom + scrollY + 6,
        left: Math.max(10, Math.min(rect.right + scrollX - 280, document.documentElement.clientWidth - 300)),
      });
    }
  };

  const performSearch = useCallback(() => {
    if (!editor || !searchTerm.trim()) {
      setMatches([]);
      setCurrentIndex(0);
      return;
    }

    const { doc } = editor.state;
    const results: MatchPosition[] = [];
    const flags = matchCase ? 'g' : 'gi';

    let pattern = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (wholeWord) {
      pattern = `\\b${pattern}\\b`;
    }

    let regex: RegExp;
    try {
      regex = new RegExp(pattern, flags);
    } catch {
      return;
    }

    doc.descendants((node, pos) => {
      if (node.isText && node.text) {
        let match;
        while ((match = regex.exec(node.text)) !== null) {
          results.push({
            from: pos + match.index,
            to: pos + match.index + match[0].length,
          });
        }
      }
    });

    setMatches(results);
    setCurrentIndex(results.length > 0 ? 1 : 0);

    if (results.length > 0) {
      editor.commands.setTextSelection({ from: results[0].from, to: results[0].to });
    }
  }, [editor, searchTerm, matchCase, wholeWord]);

  useEffect(() => {
    if (isOpen) {
      performSearch();
    }
  }, [searchTerm, matchCase, wholeWord, isOpen, performSearch]);

  const handleNext = () => {
    if (matches.length === 0 || !editor) return;
    const nextIndex = currentIndex >= matches.length ? 1 : currentIndex + 1;
    setCurrentIndex(nextIndex);
    const target = matches[nextIndex - 1];
    editor.commands.setTextSelection({ from: target.from, to: target.to });
  };

  const handlePrev = () => {
    if (matches.length === 0 || !editor) return;
    const prevIndex = currentIndex <= 1 ? matches.length : currentIndex - 1;
    setCurrentIndex(prevIndex);
    const target = matches[prevIndex - 1];
    editor.commands.setTextSelection({ from: target.from, to: target.to });
  };

  const handleReplace = () => {
    if (matches.length === 0 || !editor || currentIndex === 0) return;
    const currentMatch = matches[currentIndex - 1];
    editor
      .chain()
      .focus()
      .insertContentAt({ from: currentMatch.from, to: currentMatch.to }, replaceTerm)
      .run();
    performSearch();
  };

  const handleReplaceAll = () => {
    if (matches.length === 0 || !editor) return;
    let transaction = editor.state.tr;
    for (let i = matches.length - 1; i >= 0; i--) {
      const match = matches[i];
      transaction = transaction.replaceWith(
        match.from,
        match.to,
        editor.schema.text(replaceTerm)
      );
    }
    editor.view.dispatch(transaction);
    performSearch();
  };

  const handleToggle = () => {
    updatePosition();
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return {
    triggerRef,
    popoverRef,
    isOpen,
    coords,
    searchTerm,
    setSearchTerm,
    replaceTerm,
    setReplaceTerm,
    matchCase,
    setMatchCase,
    wholeWord,
    setWholeWord,
    matches,
    currentIndex,
    handleToggle,
    handleNext,
    handlePrev,
    handleReplace,
    handleReplaceAll,
    setIsOpen,
  };
};
