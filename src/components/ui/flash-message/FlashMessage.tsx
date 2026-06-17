'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import './flashMessage.scss';

const successLabels: Record<string, string> = {
  created: 'création réussie',
  updated: 'modification réussie',
  deleted: 'suppression réussie',
};

const errorLabels: Record<string, string> = {
  create_failed: 'échec de la création',
  update_failed: 'échec de la modification',
  delete_failed: 'échec de la suppression',
  required: 'champ(s) requis manquant(s)',
  server: 'erreur serveur',
};

function buildMessage(label: string, entity: string | null) {
  return entity ? `${entity} : ${label}` : label;
}

function FlashMessageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const success = searchParams.get('success');
  const error = searchParams.get('error');
  const entity = searchParams.get('entity');
  const active = success ?? error;

  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => {
      // On ne retire que nos propres clés pour préserver les autres
      // paramètres d'URL (recherche, filtres, pagination...)
      const params = new URLSearchParams(searchParams.toString());
      params.delete('success');
      params.delete('error');
      params.delete('entity');
      router.replace(params.size ? `${pathname}?${params.toString()}` : pathname, {
        scroll: false,
      });
    }, 3000);
    return () => clearTimeout(timer);
  }, [active, router, pathname, searchParams]);

  if (!active) return null;

  if (success && successLabels[success]) {
    return (
      <div className="flash-message flash-message--success">
        {buildMessage(successLabels[success], entity)}
      </div>
    );
  }

  if (error && errorLabels[error]) {
    return (
      <div className="flash-message flash-message--error">
        {buildMessage(errorLabels[error], entity)}
      </div>
    );
  }

  return null;
}

export default function FlashMessage() {
  return (
    <Suspense>
      <FlashMessageInner />
    </Suspense>
  );
}
