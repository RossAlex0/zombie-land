import { Suspense } from 'react';
import LoginForm from '@components/block/loginForm/LoginForm';

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
