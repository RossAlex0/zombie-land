'use client';

import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import { useAuth } from '@context/authProvider';
import { Home, LogOut } from 'lucide-react';
import Loading from '../../loading';
import { useState } from 'react';
import { useUpdateProfile } from '@hooks/api-request/user/useUpdateProfile';
import { useUpdatePassword } from '@hooks/api-request/user/useUpdatePassword';
import useLogout from '@hooks/api-request/auth/useLogout';
import FlashMessage from '@components/ui/flash-message/FlashMessage';
import { usePathname, useRouter } from 'next/navigation';
import ModalPassword from '@components/block/modal-zbl/modal-password/ModalPassword';
import ProfileForm from '@components/block/form/profile/ProfileForm';
import useFetch from '@hooks/api-request/useFetch';
import { BookingWithTickets } from '@customTypes/collections/booking';
import BookingCard from '@components/block/card/booking-card/BookingCard';
import './account.scss';

export default function Account() {
  const { user, loading, setUser } = useAuth();
  const { logout, loading: loadingLogout } = useLogout();
  const { data: bookings, loading: loadingBookings } =
    useFetch<BookingWithTickets[]>('/api/booking/me');
  const updateProfile = useUpdateProfile();
  const updatePassword = useUpdatePassword();
  const pathname = usePathname();
  const router = useRouter();

  const [pendingPasswords, setPendingPasswords] = useState({ password: '', confirmPassword: '' });
  const [openModalPassword, setOpenModalPassword] = useState(false);
  const [hasApiMessage, setHasApiMessage] = useState(false);

  const flash = (query: string) => {
    setHasApiMessage(true);
    router.replace(`${pathname}?${query}`);
    setTimeout(() => setHasApiMessage(false), 3000);
  };

  const handleSubmitProfile = async (fields: Record<string, string>) => {
    const response = await updateProfile(fields);
    if (response.data) setUser(response.data);
    if (response.message) flash('success=updated&entity=Profile');
    if (response.error) flash('error=update_failed&entity=Profile');
  };

  const handleRequestPasswordChange = (password: string, confirmPassword: string) => {
    setPendingPasswords({ password, confirmPassword });
    setOpenModalPassword(true);
  };

  const handleValidatePassword = async (oldPassword: string) => {
    const response = await updatePassword({
      password: pendingPasswords.password,
      confirmPassword: pendingPasswords.confirmPassword,
      oldPassword,
    });

    if (response.message) flash('success=updated&entity=Mot de passe');
    if (response.error) flash('error=update_failed&entity=Mot de passe');

    setOpenModalPassword(false);
    setPendingPasswords({ password: '', confirmPassword: '' });
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      {user ? (
        <section className="account">
          {hasApiMessage ? (
            <div className="account_flash">
              <FlashMessage />
            </div>
          ) : undefined}
          <div className="account_container">
            <TextZbl redPrefix="//" color="grey">
              Mon profil
            </TextZbl>
            <ProfileForm
              user={user}
              loading={loading}
              onSubmitProfile={handleSubmitProfile}
              onRequestPasswordChange={handleRequestPasswordChange}
            />
          </div>
          <div className="account_container account_container--bookings">
            <TextZbl redPrefix="//" color="grey">
              Mes réservations
            </TextZbl>
            {loadingBookings ? (
              <TextZbl jetbrains color="grey">
                Chargement de vos réservations...
              </TextZbl>
            ) : bookings && bookings.length > 0 ? (
              <>
                <div className="account_bookings">
                  {bookings.slice(0, 5).map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
                <div className="account_bookings_footer">
                  <ButtonZbl theme="dark" navTo="/booking/me">
                    <TextZbl color="yellow">Voir toutes mes réservations</TextZbl>
                  </ButtonZbl>
                </div>
              </>
            ) : (
              <TextZbl jetbrains color="grey">
                Aucune réservation enregistrée.
              </TextZbl>
            )}
          </div>
          <div className="account_absolute">
            <ButtonZbl
              theme="dark"
              onClick={() => logout()}
              disabled={loadingLogout}
              className="account_logout"
            >
              <LogOut size={16} color="#ac382a" />
              <TextZbl color="red" jetbrains>
                Se déconnecter
              </TextZbl>
            </ButtonZbl>
          </div>
        </section>
      ) : (
        <section className="account_disconnect">
          <TextZbl tag="h1" color="red">
            Pour accéder à cette page vous devez vous connectez !
          </TextZbl>
          <ButtonZbl theme="dark" navTo="/">
            <Home color="#e5bf00" size={20} />
            <TextZbl color="yellow">Retour vers la page d&apos;accueil</TextZbl>
          </ButtonZbl>
        </section>
      )}
      {openModalPassword ? (
        <ModalPassword
          onClose={() => setOpenModalPassword(false)}
          onValidate={handleValidatePassword}
        />
      ) : undefined}
    </>
  );
}
