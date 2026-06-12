import { withErrorHandler } from '@helpers/withErrorHandler';
import { verifyAdmin } from '@middleware/verifyAdmin';
import { configurationController } from '@server/controllers/configuration/configuration.controller';

export const GET = withErrorHandler(configurationController.getConfiguration);

export const PATCH = withErrorHandler(configurationController.updateConfiguration);
