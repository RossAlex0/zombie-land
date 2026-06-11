import { Suspense } from 'react';
import LoginForm from '@components/block/form/login/LoginForm';

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
