/**
 * Construit un FormData à partir d'un objet, en ignorant les valeurs
 * null/undefined. Les objets/tableaux sont automatiquement stringifiés en JSON,
 * les File sont ajoutés tels quels, le reste est converti en string.
 */
export function buildFormData(payload: Record<string, unknown>): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) continue;

    if (value instanceof File) {
      formData.append(key, value);
    } else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  }

  return formData;
}
