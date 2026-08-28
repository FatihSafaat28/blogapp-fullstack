import React from 'react';
import { UserCircle, Newspaper, ShareNetwork } from '@phosphor-icons/react';
import { useSettingsPresenter } from '../presenters/useSettingsPresenter';
import { ProfileFormView } from '../components/ProfileFormView';
import { BlogIdentityView } from '../components/BlogIdentityView';
import { SocialLinksView } from '../components/SocialLinksView';
import { Tabs, type TabItem } from '../../../shared/components/ui/Display/Tabs';
import { Card } from '../../../shared/components/ui/Display/Card';
import type { SettingsTab } from '../types/settings.types';

export const SettingsPage: React.FC = () => {
  const presenter = useSettingsPresenter();

  const tabs: TabItem[] = [
    {
      id: 'profile',
      label: 'Profil Pribadi',
      icon: <UserCircle size={16} weight="bold" />,
    },
    {
      id: 'blog',
      label: 'Identitas Blog',
      icon: <Newspaper size={16} weight="bold" />,
    },
    {
      id: 'social',
      label: 'Tautan Sosial',
      icon: <ShareNetwork size={16} weight="bold" />,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* 1. PAGE TITLE & HEADER */}
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-1">
          Pengaturan Blog & Profil
        </h1>
        <p className="text-sm text-ink-muted">
          Kustomisasi identitas kepenulisanmu, alamat publik Substack-style, dan tautan sosial.
        </p>
      </div>

      {/* 2. TAB NAVIGASI */}
      <div className="overflow-x-auto pb-1">
        <Tabs
          tabs={tabs}
          activeTab={presenter.activeTab}
          onChange={(id) => presenter.setActiveTab(id as SettingsTab)}
        />
      </div>

      {/* 3. CARD CONTAINER UNTUK VIEW FORM AKTIF */}
      <Card className="p-6 sm:p-8">
        {presenter.activeTab === 'profile' && (
          <ProfileFormView
            user={presenter.user}
            form={presenter.form}
            isSubmitting={presenter.isSubmitting}
            isUploadingAvatar={presenter.isUploadingAvatar}
            serverError={presenter.serverError}
            avatarValue={presenter.avatarValue}
            bioValue={presenter.bioValue}
            onAvatarUpload={presenter.handleAvatarUpload}
            onAvatarRemove={presenter.handleAvatarRemove}
            onSubmit={presenter.onSubmit}
          />
        )}

        {presenter.activeTab === 'blog' && (
          <BlogIdentityView
            user={presenter.user}
            form={presenter.form}
            isSubmitting={presenter.isSubmitting}
            serverError={presenter.serverError}
            blogTitleValue={presenter.blogTitleValue}
            avatarValue={presenter.avatarValue}
            bioValue={presenter.bioValue}
            onSubmit={presenter.onSubmit}
          />
        )}

        {presenter.activeTab === 'social' && (
          <SocialLinksView
            form={presenter.form}
            isSubmitting={presenter.isSubmitting}
            serverError={presenter.serverError}
            onSubmit={presenter.onSubmit}
          />
        )}
      </Card>
    </div>
  );
};

export default SettingsPage;
