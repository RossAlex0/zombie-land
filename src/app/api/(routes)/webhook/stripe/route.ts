import { withErrorHandler } from '@helpers/withErrorHandler';
import { stripeWebhook } from '../../../../../utils/stripe/stripeWebhook';

export const POST = withErrorHandler(stripeWebhook);
