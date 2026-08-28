import React from 'react';
import { useRegisterPresenter } from '../presenters/useRegisterPresenter';
import { AuthBrandSide } from '../components/AuthBrandSide';
import { RegisterFormView } from '../components/RegisterFormView';

export const RegisterPage: React.FC = () => {
  const presenter = useRegisterPresenter();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-2xl border border-line bg-card shadow-xl overflow-hidden">
        {/* Editorial Brand Story Panel (Left) */}
        <AuthBrandSide
          tag="Lembaran Pertama"
          quote="“Dunia butuh caramu memandang sesuatu. Mulai tulis ceritamu hari ini.”"
          subtext="Sebuah tempat sederhana untuk membagikan apa yang kamu tahu, tanpa distraksi iklan atau algoritma yang memaksa."
          authorName="Komunitas Penulis"
          authorHandle="avianblog.com/@editor"
          authorAvatar="https://picsum.photos/seed/editorial-team/120/120"
        />

        {/* Register Form Panel (Right) */}
        <RegisterFormView
          form={presenter.form}
          passwordChecks={presenter.passwordChecks}
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

export default RegisterPage;
