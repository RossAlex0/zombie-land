'use client';

import { useEffect } from 'react';
import TextZbl from '@components/ui/text-zbl/TextZbl';
import ButtonZbl from '@components/ui/button-zbl/ButtonZbl';

import '@styles/error.scss';
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="zbl_error">
      <div className="zbl_error_content">
        <TextZbl redPrefix="//" jetbrains>
          fatal_error - contamination_critique
        </TextZbl>
        <TextZbl tag="h1" jetbrains>
          SYSTÈME <span className="red">INFECTÉ</span>
        </TextZbl>
        <TextZbl>
          Une défaillance critique est survenue. Le virus a corrompu le processus en cours.
        </TextZbl>

        {error?.digest && <TextZbl color="grey">ref_erreur : {error.digest}</TextZbl>}

        <ButtonZbl theme="light" onClick={() => reset()}>
          Relancer le protocole
        </ButtonZbl>
      </div>
    </div>
  );
}
