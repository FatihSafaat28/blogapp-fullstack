import React from 'react';
import { useLoginPresenter } from '../presenters/useLoginPresenter';
import { AuthBrandSide } from '../components/AuthBrandSide';
import { LoginFormView } from '../components/LoginFormView';

export const LoginPage: React.FC = () => {
  const presenter = useLoginPresenter();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-2xl border border-line bg-card shadow-xl overflow-hidden">
        {/* Editorial Brand Story Panel (Left) */}
        <AuthBrandSide
          tag="Ruang Gagasan"
          quote="“Gagasan terbaik sering kali lahir dari catatan-catatan kecil yang kita rawat setiap hari.”"
          subtext="Studio pribadimu selalu siap kapan pun kamu ingin kembali menuangkan pikiran."
          authorName="Fatih Safaat"
          authorHandle="avianblog.com/@fatihsafaat"
          authorAvatar="https://picsum.photos/seed/fatih-writer/120/120"
        />

        {/* Login Form Panel (Right) */}
        <LoginFormView
          form={presenter.form}
          showPassword={presenter.showPassword}
          isSubmitting={presenter.isSubmitting}
          serverError={presenter.serverError}
          togglePasswordVisibility={presenter.togglePasswordVisibility}
          onSubmit={presenter.onSubmit}
        />
      </div>
    </div>
  );
};

export default LoginPage;
