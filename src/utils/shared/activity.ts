/**
 * Activity statuses hidden from the public site. Closed activities stay
 * visible in the back-office so admins can still manage / reopen them.
 */
const HIDDEN_PUBLIC_STATUSES = ['close'];

/**
 * Keeps only the activities visitors should see on the public site
 * (everything except closed ones).
 */
export function filterPublicActivities<T extends { status: string }>(activities: T[]): T[] {
  return activities.filter((activity) => !HIDDEN_PUBLIC_STATUSES.includes(activity.status));
}
