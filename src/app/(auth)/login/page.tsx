import { Suspense } from 'react';
import Header from '@components/block/header/Header';
import LoginForm from '@components/block/loginForm/LoginForm';
import './login.scss';

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="login">
        <Suspense>
          <LoginForm />
        </Suspense>
      </main>
    </>
  );
}
