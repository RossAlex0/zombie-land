import AuthLayout from '@components/layout/authLayout/AuthLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
