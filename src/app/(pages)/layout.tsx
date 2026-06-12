import Footer from '@components/block/footer/Footer';
import Header from '@components/block/header/Header';
import { BookingProvider } from '@context/bookingProvider';

export default function UserRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BookingProvider>
        <Header />
        {children}
        <Footer />
      </BookingProvider>
    </>
  );
}
