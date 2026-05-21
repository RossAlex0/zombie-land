import Header from '@components/block/header/Header';
import ResetPasswordForm from '@components/block/resetPasswordForm/ResetPasswordForm';
import './reset-password.scss';

export default function ResetPasswordPage() {
  return (
    <>
      <Header />
      <main className="reset-password">
        <ResetPasswordForm />
      </main>
    </>
  );
}
