'use client';
import SignupForm from '@components/block/SignupForm/SignupForm';
import Header from '@components/block/header/Header';

import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="login">
        <Suspense>
          <SignupForm />
        </Suspense>
      </main>
    </>
  );
}
