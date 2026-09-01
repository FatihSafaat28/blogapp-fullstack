import React from 'react';
import { createPortal } from 'react-dom';
import { Editor } from '@tiptap/react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { useSlashMenu } from '../hooks/useSlashMenu';

interface SlashDropdownMenuProps {
  editor: Editor | null;
}

export const SlashDropdownMenu: React.FC<SlashDropdownMenuProps> = ({ editor }) => {
  const {
    isOpen,
    coords,
    filterQuery,
    setFilterQuery,
    selectedIndex,
    setSelectedIndex,
    filteredItems,
    menuRef,
    filterInputRef,
    handleSelectItem,
  } = useSlashMenu(editor);

  if (!isOpen || !coords) return null;

  const groups: Array<'Style' | 'Lists' | 'Blocks'> = ['Style', 'Lists', 'Blocks'];

  return createPortal(
    <div
      ref={menuRef}
      style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
      className="absolute w-64 max-h-80 bg-card border border-line shadow-2xl rounded-2xl p-1.5 z-50 flex flex-col gap-1 text-xs text-ink animate-scaleIn select-none"
    >
      {/* Scrollable Items List */}
      <div className="flex-1 overflow-y-auto pr-0.5 max-h-64 flex flex-col gap-1.5">
        {filteredItems.length === 0 ? (
          <div className="py-4 text-center text-ink-muted text-xs">
            Tidak ada opsi yang cocok
          </div>
        ) : (
          groups.map((grp) => {
            const groupItems = filteredItems.filter((it) => it.group === grp);
            if (groupItems.length === 0) return null;

            return (
              <div key={grp} className="flex flex-col gap-0.5">
                <span className="px-2.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted/70">
                  {grp}
                </span>
                {groupItems.map((item) => {
                  const globalIndex = filteredItems.findIndex((it) => it.id === item.id);
                  const isSelected = globalIndex === selectedIndex;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectItem(item);
                      }}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-colors text-left cursor-pointer ${
                        isSelected ? 'bg-muted text-ink font-semibold' : 'text-ink hover:bg-muted/60'
                      }`}
                    >
                      <div className="w-5 flex justify-center text-ink-muted shrink-0">
                        {item.icon}
                      </div>
                      <span>{item.title}</span>
                    </button>
                  );
                })}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Filter Input /Filter... */}
      <div className="pt-1.5 border-t border-line-subtle flex items-center gap-1.5 px-2 py-1 bg-muted/40 rounded-xl">
        <MagnifyingGlass size={13} className="text-ink-muted shrink-0" />
        <span className="text-ink-muted font-mono text-[11px]">/</span>
        <input
          ref={filterInputRef}
          type="text"
          value={filterQuery}
          onChange={(e) => {
            setFilterQuery(e.target.value);
            setSelectedIndex(0);
          }}
          placeholder="Filter..."
          className="w-full bg-transparent border-none outline-none text-xs text-ink placeholder:text-ink-muted/50 p-0 focus:ring-0"
        />
      </div>
    </div>,
    document.body
  );
};
