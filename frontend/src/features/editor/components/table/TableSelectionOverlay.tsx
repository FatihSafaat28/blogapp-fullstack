import React from 'react';
import { createPortal } from 'react-dom';

interface TableSelectionOverlayProps {
  cellRect: DOMRect | null;
  isTableActive: boolean;
}

export const TableSelectionOverlay: React.FC<TableSelectionOverlayProps> = ({
  cellRect,
  isTableActive,
}) => {
  if (!isTableActive || !cellRect) return null;

  const overlayStyle: React.CSSProperties = {
    top: `${cellRect.top}px`,
    left: `${cellRect.left}px`,
    width: `${cellRect.width}px`,
    height: `${cellRect.height}px`,
  };

  return createPortal(
    <div
      style={overlayStyle}
      className="fixed z-30 pointer-events-none border-2 border-brand rounded-xs animate-fadeIn"
    >
      {/* Corner selection dot handle */}
      <span className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-brand shadow-xs pointer-events-none" />
    </div>,
    document.body
  );
};
