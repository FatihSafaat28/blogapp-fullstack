import React from 'react';
import { Tabs } from '../../../../shared/components/ui/Display/Tabs';
import { Input } from '../../../../shared/components/ui/Form/Input';
import { MagnifyingGlass } from '@phosphor-icons/react';

interface PostFilterBarProps {
  statusFilter: 'all' | 'published' | 'draft';
  onStatusChange: (status: string) => void;
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  totalCount: number;
}

export const PostFilterBar: React.FC<PostFilterBarProps> = ({
  statusFilter,
  onStatusChange,
  searchTerm,
  onSearchChange,
  onClearSearch,
  totalCount,
}) => {
  const tabItems = [
    { id: 'all', label: 'Semua', count: statusFilter === 'all' ? totalCount : undefined },
    { id: 'published', label: 'Terbit' },
    { id: 'draft', label: 'Draf' },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
      {/* Status Segmented Tabs */}
      <div className="overflow-x-auto pb-1 sm:pb-0">
        <Tabs
          tabs={tabItems}
          activeTab={statusFilter}
          onChange={onStatusChange}
        />
      </div>

      {/* Instant Search Bar */}
      <div className="w-full sm:w-72">
        <Input
          placeholder="Cari berdasarkan judul..."
          value={searchTerm}
          onChange={onSearchChange}
          onClear={onClearSearch}
          iconPrefix={<MagnifyingGlass size={16} className="text-ink-muted" />}
        />
      </div>
    </div>
  );
};
