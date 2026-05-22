import './authLayout.scss';
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="auth_main">
      <section className="auth_main_content">{children}</section>
    </main>
  );
}
