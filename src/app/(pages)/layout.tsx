import Footer from '@components/block/footer/Footer';
import Header from '@components/block/header/Header';

export default function UserRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
